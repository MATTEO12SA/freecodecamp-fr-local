# Script de developpement pour freeCodeCamp standalone
# Usage: .\dev.ps1
#        .\dev.ps1 -Clean
#        .\dev.ps1 -Full

param(
    [switch]$Clean = $false,
    [switch]$Full = $false,
    # Compatibilite avec les anciens raccourcis. Le mode rapide est maintenant
    # le comportement par defaut de .\dev.ps1.
    [switch]$Fast = $false
)

$ErrorActionPreference = "Stop"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$OutputEncoding = $utf8NoBom
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom

$script:DevLogsDir = Join-Path $PSScriptRoot "dev-logs"
$script:StatusFile = Join-Path $script:DevLogsDir "status.json"
$script:StructuredLogFile = Join-Path $script:DevLogsDir "server.log"
$script:LatestLogFile = Join-Path $script:DevLogsDir "latest.log"
$script:ErrorsLogFile = Join-Path $script:DevLogsDir "errors.log"
$script:RunId = [guid]::NewGuid().ToString()
$script:RunStartedAt = (Get-Date).ToUniversalTime().ToString("o")
$script:ServerHost = "localhost"
$script:ServerPort = 8000
$script:ServerUrl = "http://$script:ServerHost`:$script:ServerPort"
$script:CurrentStatus = "DOWN"
$script:RunMode = "normal"
$script:IsServerUp = $false
$script:WarningCount = 0
$script:ProblemCount = 0
$script:LastProblem = $null
$script:LastPortProbe = [DateTime]::MinValue
$script:StartupPortWaitStarted = $false
$script:PortWatcherJob = $null
$script:PortWatcherProcess = $null
$script:IntroWatcherProcess = $null
$script:IsStopping = $false

function Test-Port {
    param([int]$Port)

    $hosts = @("127.0.0.1", "::1", "localhost")
    foreach ($hostName in $hosts) {
        $tcpClient = $null
        try {
            $tcpClient = New-Object System.Net.Sockets.TcpClient
            $connectTask = $tcpClient.ConnectAsync($hostName, $Port)
            if ($connectTask.Wait(1000) -and $tcpClient.Connected) {
                return $true
            }
        } catch {
            # Continue trying the next loopback address.
        } finally {
            if ($tcpClient) {
                $tcpClient.Close()
            }
        }
    }

    return $false
}

function Get-LogTimestamp {
    return (Get-Date).ToUniversalTime().ToString("o")
}

function Remove-AnsiControl {
    param([string]$Text)

    if ($null -eq $Text) {
        return ""
    }

    $escape = [regex]::Escape([string][char]27)
    return [regex]::Replace($Text, "$escape\[[0-?]*[ -/]*[@-~]", "")
}

function ConvertTo-LogText {
    param($Value)

    if ($null -eq $Value) {
        return ""
    }

    return (Remove-AnsiControl -Text ([string]$Value)).TrimEnd()
}

function ConvertTo-PowerShellLiteral {
    param([string]$Value)

    if ($null -eq $Value) {
        return "''"
    }

    return "'" + $Value.Replace("'", "''") + "'"
}

function New-EncodedPowerShellCommand {
    param([string]$Command)

    $bytes = [System.Text.Encoding]::Unicode.GetBytes($Command)
    return [Convert]::ToBase64String($bytes)
}

function Initialize-DevLogs {
    New-Item -ItemType Directory -Path $script:DevLogsDir -Force | Out-Null

    $header = @(
        "runId=$script:RunId",
        "startedAt=$script:RunStartedAt",
        "repo=$PSScriptRoot",
        ""
    )
    [System.IO.File]::WriteAllText($script:LatestLogFile, ($header -join [Environment]::NewLine), $utf8NoBom)
    [System.IO.File]::WriteAllText($script:StructuredLogFile, "", $utf8NoBom)
    [System.IO.File]::WriteAllText($script:ErrorsLogFile, "", $utf8NoBom)
}

function Format-JsonText {
    param([string]$Json)

    $builder = New-Object System.Text.StringBuilder
    $indent = 0
    $inString = $false
    $escaped = $false

    for ($index = 0; $index -lt $Json.Length; $index++) {
        $char = $Json[$index]

        if ($escaped) {
            [void]$builder.Append($char)
            $escaped = $false
            continue
        }

        if ($char -eq '\') {
            [void]$builder.Append($char)
            if ($inString) {
                $escaped = $true
            }
            continue
        }

        if ($char -eq '"') {
            [void]$builder.Append($char)
            $inString = -not $inString
            continue
        }

        if ($inString) {
            [void]$builder.Append($char)
            continue
        }

        switch ($char) {
            { $_ -eq '{' -or $_ -eq '[' } {
                [void]$builder.Append($char)
                $indent++
                [void]$builder.Append("`n")
                [void]$builder.Append("  " * $indent)
                continue
            }
            { $_ -eq '}' -or $_ -eq ']' } {
                $indent--
                [void]$builder.Append("`n")
                [void]$builder.Append("  " * $indent)
                [void]$builder.Append($char)
                continue
            }
            ',' {
                [void]$builder.Append($char)
                [void]$builder.Append("`n")
                [void]$builder.Append("  " * $indent)
                continue
            }
            ':' {
                [void]$builder.Append(": ")
                continue
            }
            default {
                [void]$builder.Append($char)
            }
        }
    }

    return $builder.ToString()
}

function Write-StatusFile {
    param($Payload)

    $json = ($Payload | ConvertTo-Json -Compress -Depth 8).
        Replace('\u0027', "'").
        Replace('\u003c', '<').
        Replace('\u003e', '>').
        Replace('\u0026', '&')
    $json = Format-JsonText -Json $json
    $encoding = New-Object System.Text.UTF8Encoding($false)
    $tempFile = "$script:StatusFile.$PID.tmp"
    $lastError = $null

    for ($attempt = 1; $attempt -le 5; $attempt++) {
        try {
            [System.IO.File]::WriteAllText($tempFile, $json, $encoding)
            Move-Item -LiteralPath $tempFile -Destination $script:StatusFile -Force
            return
        } catch {
            $lastError = $_
            Start-Sleep -Milliseconds (100 * $attempt)
        }
    }

    try {
        if (Test-Path $tempFile) {
            Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Best effort cleanup only.
    }

    Write-Host "Avertissement: impossible de mettre a jour status.json: $lastError" -ForegroundColor Yellow
}

function Read-SharedTextFile {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return ""
    }

    $stream = $null
    $reader = $null
    try {
        $stream = [System.IO.File]::Open($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
        $reader = New-Object System.IO.StreamReader($stream, $utf8NoBom)
        return $reader.ReadToEnd()
    } catch {
        return ""
    } finally {
        if ($reader) {
            $reader.Dispose()
        } elseif ($stream) {
            $stream.Dispose()
        }
    }
}

function Start-PortStatusWatcher {
    param([string]$HostName, [int]$Port, [int]$TimeoutSeconds = 1200)

    if ($script:PortWatcherProcess -or $script:PortWatcherJob) {
        return
    }

    $watcherScriptFile = Join-Path $script:DevLogsDir "status-watch.ps1"
    $watcherScript = @'
param(
    [string]$HostName,
    [int]$Port,
    [int]$TimeoutSeconds,
    [string]$StatusFile,
    [string]$LatestLogFile,
    [string]$DevLogsDir,
    [string]$StructuredLogFile,
    [string]$ErrorsLogFile,
    [string]$RunId,
    [string]$RunStartedAt,
    [string]$RunMode
)

function Test-LoopbackPort {
    param([string]$HostName, [int]$Port)

    foreach ($loopbackHost in @($HostName, "localhost", "127.0.0.1", "::1")) {
        $tcpClient = $null
        try {
            $tcpClient = New-Object System.Net.Sockets.TcpClient
            $connectTask = $tcpClient.ConnectAsync($loopbackHost, $Port)
            if ($connectTask.Wait(1000) -and $tcpClient.Connected) {
                return $true
            }
        } catch {
            # Try the next loopback address.
        } finally {
            if ($tcpClient) {
                $tcpClient.Close()
            }
        }
    }

    return $false
}

function Write-PrettyJson {
    param($Payload, [string]$Path)

    $json = $Payload | ConvertTo-Json -Depth 8
    $encoding = New-Object System.Text.UTF8Encoding($false)
    $tempFile = "$Path.$PID.watcher.tmp"

    for ($attempt = 1; $attempt -le 5; $attempt++) {
        try {
            [System.IO.File]::WriteAllText($tempFile, $json + [Environment]::NewLine, $encoding)
            Move-Item -LiteralPath $tempFile -Destination $Path -Force
            return
        } catch {
            Start-Sleep -Milliseconds (100 * $attempt)
        }
    }
}

function New-StatusPayload {
    param(
        [string]$Status,
        [string]$Message,
        $LastProblem = $null,
        [int]$Problems = 0
    )

    $serverUrl = "http://$HostName`:$Port"
    return [ordered]@{
        status = $Status
        message = $Message
        runId = $RunId
        mode = $RunMode
        service = "client"
        url = $serverUrl
        port = $Port
        startedAt = $RunStartedAt
        updatedAt = (Get-Date).ToUniversalTime().ToString("o")
        warnings = 0
        problems = $Problems
        lastProblem = $LastProblem
        logs = [ordered]@{
            directory = "dev-logs"
            status = "dev-logs/status.json"
            latest = "dev-logs/latest.log"
            server = "dev-logs/server.log"
            errors = "dev-logs/errors.log"
        }
        absoluteLogs = [ordered]@{
            directory = $DevLogsDir
            status = $StatusFile
            latest = $LatestLogFile
            server = $StructuredLogFile
            errors = $ErrorsLogFile
        }
    }
}

$serverUrl = "http://$HostName`:$Port"
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $deadline) {
    if (Test-LoopbackPort -HostName $HostName -Port $Port) {
        $updatedAt = (Get-Date).ToUniversalTime().ToString("o")
        Write-PrettyJson -Payload (New-StatusPayload -Status "UP" -Message "Client pret sur $serverUrl") -Path $StatusFile
        Add-Content -LiteralPath $LatestLogFile -Value "$updatedAt [INFO] [status.up] Client pret sur $serverUrl port=$Port watcherProcess=True" -Encoding UTF8
        exit 0
    }

    Start-Sleep -Seconds 2
}

$updatedAt = (Get-Date).ToUniversalTime().ToString("o")
$problem = [ordered]@{
    code = "SERVER_START_TIMEOUT"
    line = "Le port $Port n'a pas ouvert avant le timeout."
    action = "Regarde dev-logs/latest.log, puis relance avec .\dev.ps1 -Clean si Gatsby est bloque."
}
Write-PrettyJson -Payload (New-StatusPayload -Status "ERROR" -Message "Timeout: client non joignable sur $serverUrl apres $TimeoutSeconds secondes" -LastProblem $problem -Problems 1) -Path $StatusFile
Add-Content -LiteralPath $LatestLogFile -Value "$updatedAt [ERROR] [status.error] Timeout: client non joignable sur $serverUrl apres $TimeoutSeconds secondes problemCode=SERVER_START_TIMEOUT watcherProcess=True" -Encoding UTF8
exit 1
'@

    Set-Content -LiteralPath $watcherScriptFile -Value $watcherScript -Encoding UTF8
    $watcherCommand = @(
        "& $(ConvertTo-PowerShellLiteral -Value $watcherScriptFile)",
        "-HostName $(ConvertTo-PowerShellLiteral -Value $HostName)",
        "-Port $(ConvertTo-PowerShellLiteral -Value ([string]$Port))",
        "-TimeoutSeconds $(ConvertTo-PowerShellLiteral -Value ([string]$TimeoutSeconds))",
        "-StatusFile $(ConvertTo-PowerShellLiteral -Value $script:StatusFile)",
        "-LatestLogFile $(ConvertTo-PowerShellLiteral -Value $script:LatestLogFile)",
        "-DevLogsDir $(ConvertTo-PowerShellLiteral -Value $script:DevLogsDir)",
        "-StructuredLogFile $(ConvertTo-PowerShellLiteral -Value $script:StructuredLogFile)",
        "-ErrorsLogFile $(ConvertTo-PowerShellLiteral -Value $script:ErrorsLogFile)",
        "-RunId $(ConvertTo-PowerShellLiteral -Value $script:RunId)",
        "-RunStartedAt $(ConvertTo-PowerShellLiteral -Value $script:RunStartedAt)",
        "-RunMode $(ConvertTo-PowerShellLiteral -Value $script:RunMode)"
    ) -join " "
    $encodedWatcherCommand = New-EncodedPowerShellCommand -Command $watcherCommand

    $script:PortWatcherProcess = Start-Process -FilePath powershell -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-EncodedCommand",
        $encodedWatcherCommand
    ) -WindowStyle Hidden -PassThru

    return

    $script:PortWatcherJob = Start-Job -ArgumentList @(
        $HostName,
        $Port,
        $TimeoutSeconds,
        $script:StatusFile,
        $script:LatestLogFile,
        $script:DevLogsDir,
        $script:StructuredLogFile,
        $script:ErrorsLogFile,
        $script:RunId,
        $script:RunStartedAt,
        $script:RunMode
    ) -ScriptBlock {
        param(
            [string]$HostName,
            [int]$Port,
            [int]$TimeoutSeconds,
            [string]$StatusFile,
            [string]$LatestLogFile,
            [string]$DevLogsDir,
            [string]$StructuredLogFile,
            [string]$ErrorsLogFile,
            [string]$RunId,
            [string]$RunStartedAt,
            [string]$RunMode
        )

        $serverUrl = "http://$HostName`:$Port"

        function Test-LoopbackPort {
            param([string]$HostName, [int]$Port)

            foreach ($loopbackHost in @($HostName, "127.0.0.1", "::1", "localhost")) {
                $tcpClient = $null
                try {
                    $tcpClient = New-Object System.Net.Sockets.TcpClient
                    $connectTask = $tcpClient.ConnectAsync($loopbackHost, $Port)
                    if ($connectTask.Wait(1000) -and $tcpClient.Connected) {
                        return $true
                    }
                } catch {
                    # Try the next loopback address.
                } finally {
                    if ($tcpClient) {
                        $tcpClient.Close()
                    }
                }
            }

            return $false
        }

        function Format-JsonText {
            param([string]$Json)

            $builder = New-Object System.Text.StringBuilder
            $indent = 0
            $inString = $false
            $escaped = $false

            for ($index = 0; $index -lt $Json.Length; $index++) {
                $char = $Json[$index]

                if ($escaped) {
                    [void]$builder.Append($char)
                    $escaped = $false
                    continue
                }

                if ($char -eq '\') {
                    [void]$builder.Append($char)
                    if ($inString) {
                        $escaped = $true
                    }
                    continue
                }

                if ($char -eq '"') {
                    [void]$builder.Append($char)
                    $inString = -not $inString
                    continue
                }

                if ($inString) {
                    [void]$builder.Append($char)
                    continue
                }

                switch ($char) {
                    { $_ -eq '{' -or $_ -eq '[' } {
                        [void]$builder.Append($char)
                        $indent++
                        [void]$builder.Append("`n")
                        [void]$builder.Append("  " * $indent)
                        continue
                    }
                    { $_ -eq '}' -or $_ -eq ']' } {
                        $indent--
                        [void]$builder.Append("`n")
                        [void]$builder.Append("  " * $indent)
                        [void]$builder.Append($char)
                        continue
                    }
                    ',' {
                        [void]$builder.Append($char)
                        [void]$builder.Append("`n")
                        [void]$builder.Append("  " * $indent)
                        continue
                    }
                    ':' {
                        [void]$builder.Append(": ")
                        continue
                    }
                    default {
                        [void]$builder.Append($char)
                    }
                }
            }

            return $builder.ToString()
        }

        function Write-PrettyJson {
            param($Payload, [string]$Path)

            $json = ($Payload | ConvertTo-Json -Compress -Depth 8).
                Replace('\u0027', "'").
                Replace('\u003c', '<').
                Replace('\u003e', '>').
                Replace('\u0026', '&')
            $json = Format-JsonText -Json $json
            $encoding = New-Object System.Text.UTF8Encoding($false)
            $tempFile = "$Path.$PID.watcher.tmp"

            for ($attempt = 1; $attempt -le 5; $attempt++) {
                try {
                    [System.IO.File]::WriteAllText($tempFile, $json, $encoding)
                    Move-Item -LiteralPath $tempFile -Destination $Path -Force
                    return
                } catch {
                    Start-Sleep -Milliseconds (100 * $attempt)
                }
            }
        }

        $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
        while ((Get-Date) -lt $deadline) {
            if (Test-LoopbackPort -HostName $HostName -Port $Port) {
                $updatedAt = (Get-Date).ToUniversalTime().ToString("o")
                $payload = [ordered]@{
                    status = "UP"
                    message = "Client pret sur $serverUrl"
                    runId = $RunId
                    mode = $RunMode
                    service = "client"
                    url = $serverUrl
                    port = $Port
                    startedAt = $RunStartedAt
                    updatedAt = $updatedAt
                    warnings = 0
                    problems = 0
                    lastProblem = $null
                    logs = [ordered]@{
                        directory = "dev-logs"
                        status = "dev-logs/status.json"
                        latest = "dev-logs/latest.log"
                        server = "dev-logs/server.log"
                        errors = "dev-logs/errors.log"
                    }
                    absoluteLogs = [ordered]@{
                        directory = $DevLogsDir
                        status = $StatusFile
                        latest = $LatestLogFile
                        server = $StructuredLogFile
                        errors = $ErrorsLogFile
                    }
                }

                Write-PrettyJson -Payload $payload -Path $StatusFile
                Add-Content -LiteralPath $LatestLogFile -Value "$updatedAt [INFO] [status.up] Client pret sur $serverUrl port=$Port watcher=True" -Encoding UTF8
                return
            }

            Start-Sleep -Seconds 2
        }

        $updatedAt = (Get-Date).ToUniversalTime().ToString("o")
        $payload = [ordered]@{
            status = "ERROR"
            message = "Timeout: client non joignable sur $serverUrl apres $TimeoutSeconds secondes"
            runId = $RunId
            mode = $RunMode
            service = "client"
            url = $serverUrl
            port = $Port
            startedAt = $RunStartedAt
            updatedAt = $updatedAt
            warnings = 0
            problems = 1
            lastProblem = [ordered]@{
                code = "SERVER_START_TIMEOUT"
                line = "Le port $Port n'a pas ouvert avant le timeout."
                action = "Regarde dev-logs/latest.log, puis relance avec .\dev.ps1 -Clean si Gatsby est bloque."
            }
            logs = [ordered]@{
                directory = "dev-logs"
                status = "dev-logs/status.json"
                latest = "dev-logs/latest.log"
                server = "dev-logs/server.log"
                errors = "dev-logs/errors.log"
            }
            absoluteLogs = [ordered]@{
                directory = $DevLogsDir
                status = $StatusFile
                latest = $LatestLogFile
                server = $StructuredLogFile
                errors = $ErrorsLogFile
            }
        }

        Write-PrettyJson -Payload $payload -Path $StatusFile
        Add-Content -LiteralPath $LatestLogFile -Value "$updatedAt [ERROR] [status.error] Timeout: client non joignable sur $serverUrl apres $TimeoutSeconds secondes problemCode=SERVER_START_TIMEOUT watcher=True" -Encoding UTF8
    }
}

function Start-IntroJsonWatcher {
    param([string]$Locale)

    if ($script:IntroWatcherProcess) {
        return
    }

    if ([string]::IsNullOrWhiteSpace($Locale)) {
        $Locale = "french"
    }

    $introJsonPath = Join-Path $PSScriptRoot "client\i18n\locales\$Locale\intro.json"
    if (-not (Test-Path $introJsonPath)) {
        Write-LogEvent -Level "WARN" -Event "intro.watch.skipped" -Message "intro.json introuvable, surveillance impossible" -Data @{
            sourceJson = $introJsonPath
        }
        return
    }

    $watcherScriptFile = Join-Path $script:DevLogsDir "intro-watch.ps1"
    $clientStdoutLogFile = Join-Path $script:DevLogsDir "client.stdout.log"
    $sourceJsonRelativePath = "client/i18n/locales/$Locale/intro.json"
    $watcherScript = @'
param(
    [string]$IntroJsonPath,
    [string]$LatestLogFile,
    [string]$StructuredLogFile,
    [string]$ErrorsLogFile,
    [string]$RunId,
    [string]$RunStartedAt,
    [string]$RunMode,
    [string]$ServerUrl,
    [string]$ClientStdoutLogFile,
    [string]$SourceJsonRelativePath
)

function Get-UtcTimestamp {
    return (Get-Date).ToUniversalTime().ToString("o")
}

function Get-FileLength {
    param([string]$Path)

    try {
        if (-not (Test-Path -LiteralPath $Path)) {
            return 0
        }

        return ([System.IO.FileInfo](Get-Item -LiteralPath $Path)).Length
    } catch {
        return 0
    }
}

function Read-SharedTextFile {
    param([string]$Path, [long]$Offset = 0)

    $stream = $null
    $reader = $null

    try {
        if (-not (Test-Path -LiteralPath $Path)) {
            return ""
        }

        $stream = [System.IO.File]::Open($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
        if ($Offset -gt $stream.Length) {
            $Offset = 0
        }
        [void]$stream.Seek($Offset, [System.IO.SeekOrigin]::Begin)
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8, $true, 4096, $false)
        return $reader.ReadToEnd()
    } catch {
        return ""
    } finally {
        if ($reader) {
            $reader.Dispose()
        } elseif ($stream) {
            $stream.Dispose()
        }
    }
}

function Get-IntroHash {
    $stream = $null
    $sha256 = $null

    try {
        if (-not [System.IO.File]::Exists($IntroJsonPath)) {
            return $null
        }

        $stream = [System.IO.File]::Open($IntroJsonPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
        $sha256 = [System.Security.Cryptography.SHA256]::Create()
        return [BitConverter]::ToString($sha256.ComputeHash($stream)).Replace("-", "")
    } catch {
        return $null
    } finally {
        if ($sha256) {
            $sha256.Dispose()
        }
        if ($stream) {
            $stream.Dispose()
        }
    }
}

function Write-DevLog {
    param(
        [ValidateSet("INFO", "WARN", "ERROR")]
        [string]$Level,
        [Alias("Event")]
        [string]$EventName,
        [string]$Message,
        [hashtable]$Data = @{}
    )

    if ($null -eq $Data) {
        $Data = @{}
    }

    $timestamp = Get-UtcTimestamp
    $details = ""
    if ($Data.Count -gt 0) {
        $details = " " + (($Data.GetEnumerator() | Sort-Object Name | ForEach-Object {
            "$($_.Name)=$($_.Value)"
        }) -join " ")
    }

    $humanLine = "$timestamp [$Level] [$EventName] $Message$details"
    Add-Content -LiteralPath $LatestLogFile -Value $humanLine -Encoding UTF8

    try {
        $record = [ordered]@{
            timestamp = $timestamp
            runId = $RunId
            level = $Level
            event = $EventName
            status = "UP"
            message = $Message
            data = $Data
        }
        Add-Content -LiteralPath $StructuredLogFile -Value ($record | ConvertTo-Json -Compress -Depth 8) -Encoding UTF8
    } catch {
        # Logging must never stop the watcher.
    }

    if ($Level -eq "ERROR") {
        Add-Content -LiteralPath $ErrorsLogFile -Value $humanLine -Encoding UTF8
    }
}

function Wait-ForGatsbyRebuild {
    param(
        [long]$LatestOffset,
        [long]$StdoutOffset,
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        $stdoutTail = Read-SharedTextFile -Path $ClientStdoutLogFile -Offset $StdoutOffset
        if ($stdoutTail -match "Re-building development bundle|Building development bundle") {
            return "dev-logs/client.stdout.log"
        }

        $latestTail = Read-SharedTextFile -Path $LatestLogFile -Offset $LatestOffset
        if ($latestTail -match "Re-building development bundle|Building development bundle") {
            return "dev-logs/latest.log"
        }

        Start-Sleep -Milliseconds 500
    }

    return $null
}

$lastHash = Get-IntroHash
if (-not $lastHash) {
    Write-DevLog -Level "WARN" -Event "intro.watch.skipped" -Message "intro.json introuvable, surveillance impossible" -Data @{
        introJsonPath = $IntroJsonPath
        sourceJson = $SourceJsonRelativePath
    }
    exit 0
}

$lastStdoutLength = Get-FileLength -Path $ClientStdoutLogFile

Write-DevLog -Level "INFO" -Event "intro.watch" -Message "Surveillance intro.json active" -Data @{
    curriculumData = "/curriculum-data/v2/responsive-web-design-v9.json"
    sourceJson = $SourceJsonRelativePath
    serverPath = "/learn/responsive-web-design-v9/"
}

while ($true) {
    Start-Sleep -Seconds 1

    $currentHash = Get-IntroHash
    if (-not $currentHash -or $currentHash -eq $lastHash) {
        $lastStdoutLength = Get-FileLength -Path $ClientStdoutLogFile
        continue
    }

    Start-Sleep -Milliseconds 700
    $stableHash = Get-IntroHash
    if (-not $stableHash -or $stableHash -eq $lastHash) {
        $lastStdoutLength = Get-FileLength -Path $ClientStdoutLogFile
        continue
    }

    $lastHash = $stableHash
    $latestOffset = Get-FileLength -Path $LatestLogFile
    $stdoutOffset = $lastStdoutLength

    Write-DevLog -Level "INFO" -Event "intro.changed" -Message "intro.json modifie; attente du rebuild Gatsby" -Data @{
        curriculumData = "/curriculum-data/v2/responsive-web-design-v9.json"
        sourceJson = $SourceJsonRelativePath
        serverPath = "/learn/responsive-web-design-v9/"
    }

    $logSource = Wait-ForGatsbyRebuild -LatestOffset $latestOffset -StdoutOffset $stdoutOffset
    if ($logSource) {
        Write-DevLog -Level "INFO" -Event "intro.integrated" -Message "intro.json integre par Gatsby" -Data @{
            curriculumData = "/curriculum-data/v2/responsive-web-design-v9.json"
            sourceJson = $SourceJsonRelativePath
            logSource = $logSource
            serverPath = "/learn/responsive-web-design-v9/"
        }
    } else {
        Write-DevLog -Level "WARN" -Event "intro.integration.pending" -Message "intro.json modifie, mais aucun rebuild Gatsby detecte dans le delai" -Data @{
            curriculumData = "/curriculum-data/v2/responsive-web-design-v9.json"
            sourceJson = $SourceJsonRelativePath
            serverPath = "/learn/responsive-web-design-v9/"
        }
    }

    $lastStdoutLength = Get-FileLength -Path $ClientStdoutLogFile
}
'@

    Set-Content -LiteralPath $watcherScriptFile -Value $watcherScript -Encoding UTF8
    $watcherCommand = @(
        "& $(ConvertTo-PowerShellLiteral -Value $watcherScriptFile)",
        "-IntroJsonPath $(ConvertTo-PowerShellLiteral -Value $introJsonPath)",
        "-LatestLogFile $(ConvertTo-PowerShellLiteral -Value $script:LatestLogFile)",
        "-StructuredLogFile $(ConvertTo-PowerShellLiteral -Value $script:StructuredLogFile)",
        "-ErrorsLogFile $(ConvertTo-PowerShellLiteral -Value $script:ErrorsLogFile)",
        "-RunId $(ConvertTo-PowerShellLiteral -Value $script:RunId)",
        "-RunStartedAt $(ConvertTo-PowerShellLiteral -Value $script:RunStartedAt)",
        "-RunMode $(ConvertTo-PowerShellLiteral -Value $script:RunMode)",
        "-ServerUrl $(ConvertTo-PowerShellLiteral -Value $script:ServerUrl)",
        "-ClientStdoutLogFile $(ConvertTo-PowerShellLiteral -Value $clientStdoutLogFile)",
        "-SourceJsonRelativePath $(ConvertTo-PowerShellLiteral -Value $sourceJsonRelativePath)"
    ) -join " "
    $encodedWatcherCommand = New-EncodedPowerShellCommand -Command $watcherCommand

    $script:IntroWatcherProcess = Start-Process -FilePath powershell -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-EncodedCommand",
        $encodedWatcherCommand
    ) -WindowStyle Hidden -PassThru

    Write-LogEvent -Level "INFO" -Event "intro.watch.started" -Message "Surveillance intro.json demarree" -Data @{
        sourceJson = $sourceJsonRelativePath
        pid = $script:IntroWatcherProcess.Id
    }
}

function Write-LogEvent {
    param(
        [ValidateSet("INFO", "WARN", "ERROR")]
        [string]$Level,
        [Alias("Event")]
        [string]$EventName,
        [string]$Message,
        [hashtable]$Data = @{}
    )

    if ($null -eq $Data) {
        $Data = @{}
    }

    $timestamp = Get-LogTimestamp
    $cleanMessage = ConvertTo-LogText -Value $Message
    $record = [ordered]@{
        timestamp = $timestamp
        runId = $script:RunId
        level = $Level
        event = $EventName
        status = $script:CurrentStatus
        message = $cleanMessage
        data = $Data
    }

    $json = $record | ConvertTo-Json -Compress -Depth 8
    Add-Content -LiteralPath $script:StructuredLogFile -Value $json -Encoding UTF8

    $details = ""
    if ($Data.Count -gt 0) {
        $details = " " + (($Data.GetEnumerator() | Sort-Object Name | ForEach-Object {
            "$($_.Name)=$($_.Value)"
        }) -join " ")
    }

    $humanLine = "$timestamp [$Level] [$EventName] $cleanMessage$details"
    Add-Content -LiteralPath $script:LatestLogFile -Value $humanLine -Encoding UTF8

    if ($Level -eq "ERROR") {
        Add-Content -LiteralPath $script:ErrorsLogFile -Value $humanLine -Encoding UTF8
    }
}

function Set-ServerStatus {
    param(
        [ValidateSet("STARTING", "UP", "DOWN", "ERROR")]
        [string]$Status,
        [string]$Message,
        [hashtable]$Data = @{}
    )

    $script:CurrentStatus = $Status
    $updatedAt = Get-LogTimestamp
    $relativeLogs = [ordered]@{
        directory = "dev-logs"
        status = "dev-logs/status.json"
        latest = "dev-logs/latest.log"
        server = "dev-logs/server.log"
        errors = "dev-logs/errors.log"
    }
    $absoluteLogs = [ordered]@{
        directory = $script:DevLogsDir
        status = $script:StatusFile
        latest = $script:LatestLogFile
        server = $script:StructuredLogFile
        errors = $script:ErrorsLogFile
    }
    $payload = [ordered]@{
        status = $Status
        message = ConvertTo-LogText -Value $Message
        runId = $script:RunId
        mode = $script:RunMode
        service = "client"
        url = $script:ServerUrl
        port = $script:ServerPort
        startedAt = $script:RunStartedAt
        updatedAt = $updatedAt
        warnings = $script:WarningCount
        problems = $script:ProblemCount
        lastProblem = $script:LastProblem
        logs = $relativeLogs
        absoluteLogs = $absoluteLogs
    }

    Write-StatusFile -Payload $payload
    Write-LogEvent -Level "INFO" -Event "status.$($Status.ToLowerInvariant())" -Message $Message -Data $Data
}

function Get-ProblemDetails {
    param([string]$Line)

    $patterns = @(
        @{
            Pattern = "gatsby-plugin-react-helmet: Gatsby now has built-in support"
            Code = "GATSBY_PLUGIN_DEPRECATION"
            Action = "Warning non bloquant: Gatsby recommande Gatsby Head a la place de react-helmet."
        },
        @{
            Pattern = "webpack\.cache\.PackFileCacheStrategy|No serializer registered for ProvidedDependency|while serializing webpack"
            Code = "WEBPACK_CACHE_SERIALIZATION"
            Action = "Warning non bloquant: cache Webpack ignore pour certains modules."
        },
        @{
            Pattern = "Use `node --trace-deprecation|DeprecationWarning|punycode"
            Code = "DEPRECATION"
            Action = "Warning non bloquant: dependance Node depreciee."
        },
        @{
            Pattern = "EADDRINUSE|address already in use|port .* already in use"
            Code = "PORT_IN_USE"
            Action = "Le port 8000 semble deja utilise. Arrete l'ancien serveur puis relance dev.ps1."
        },
        @{
            Pattern = "Cannot find module|MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND"
            Code = "MODULE_NOT_FOUND"
            Action = "Une dependance ou un fichier manque. Verifie pnpm install et le chemin indique."
        },
        @{
            Pattern = "ENOENT|no such file or directory"
            Code = "FILE_MISSING"
            Action = "Un fichier attendu est absent. Regarde le chemin dans la ligne d'erreur."
        },
        @{
            Pattern = "Failed to compile|Compilation failed|Module build failed"
            Code = "COMPILE_FAILED"
            Action = "La compilation a echoue. Corrige le premier fichier mentionne dans latest.log."
        },
        @{
            Pattern = "Failed to write page-data|Couldn'?t find temp query result|Couldn'?t get query results|Error loading a result for the page query|no cached result was found"
            Code = "GATSBY_PAGE_DATA_CACHE"
            Action = "Cache Gatsby incoherent. Relance avec .\dev.ps1 -Clean pour regenerer client\.cache et client\public."
        },
        @{
            Pattern = "GraphQL Error|There was an error in your GraphQL query"
            Code = "GATSBY_GRAPHQL"
            Action = "Gatsby a bloque sur une requete GraphQL. Regarde les lignes juste avant/apres cette erreur."
        },
        @{
            Pattern = "ModuleConcatenation bailout: Cannot concat"
            Code = "WEBPACK_OPTIMIZATION_BAILOUT"
            Action = "Avertissement Webpack non bloquant: un module ne peut pas etre concatene pour l'optimisation."
        },
        @{
            Pattern = "TypeError|ReferenceError|SyntaxError|RangeError"
            Code = "JS_RUNTIME_ERROR"
            Action = "Erreur JavaScript/TypeScript. Le nom de l'erreur et la stack indiquent le fichier a corriger."
        },
        @{
            Pattern = "moduleResolution=node10|deprecated|DeprecationWarning"
            Code = "DEPRECATION"
            Action = "Avertissement de depreciation. Le build peut continuer, mais la config doit etre mise a jour."
        },
        @{
            Pattern = "ELIFECYCLE|Command failed|exited with|Exit status|npm ERR|pnpm .*ERR"
            Code = "COMMAND_FAILED"
            Action = "La commande de dev s'est terminee en erreur. Regarde le premier probleme dans errors.log."
        }
    )

    foreach ($item in $patterns) {
        if ($Line -match $item.Pattern) {
            return [ordered]@{
                code = $item.Code
                line = $Line
                action = $item.Action
            }
        }
    }

    return [ordered]@{
        code = "UNCLASSIFIED"
        line = $Line
        action = "Regarde les lignes autour de cette erreur dans latest.log."
    }
}

function Get-OutputLevel {
    param([string]$Line)

    if ($Line -match "(?i)^(Debugger listening|Debugger attached|For help, see: https://nodejs\.org)") {
        return "INFO"
    }

    if ($Line -match "^\s*ERROR\s+UNKNOWN\s*$") {
        return "INFO"
    }

    if ($Line -match "(?i)ModuleConcatenation bailout: Cannot concat") {
        return "WARN"
    }

    if ($Line -match "(?i)\b(error|fatal|exception|failed|cannot|could not|enoent|eaddrinuse|syntaxerror|typeerror|referenceerror|module build failed|npm ERR|ERR!)\b") {
        return "ERROR"
    }

    if ($Line -match "(?i)^\s*(warn|warning)\b|^\s*<w>|(?<!no-)deprecated|(?<!no-)deprecation") {
        return "WARN"
    }

    return "INFO"
}

function Test-ServerReadyFromOutput {
    param(
        [string]$Line,
        [int]$Port
    )

    if ($script:IsServerUp) {
        return
    }

    $now = Get-Date
    $mentionsLocalServer = $Line -match "localhost:$Port|127\.0\.0\.1:$Port|Local:\s+http"
    $shouldProbePort = (($now - $script:LastPortProbe).TotalSeconds -ge 2) -or $mentionsLocalServer

    if (-not $shouldProbePort) {
        return
    }

    $script:LastPortProbe = $now
    if (Test-Port -Port $Port) {
        $script:IsServerUp = $true
        Set-ServerStatus -Status "UP" -Message "Client pret sur $script:ServerUrl" -Data @{ port = $Port }
        return
    }

    # The background watcher owns long readiness waits. Blocking here would stop
    # process output from being drained and can make Gatsby appear frozen.
}

function Wait-ForServerReadyStatus {
    param([int]$Port, [string]$ServiceName, [int]$TimeoutSeconds = 300)

    $startTime = Get-Date
    while (-not $script:IsServerUp -and ((Get-Date) - $startTime).TotalSeconds -lt $TimeoutSeconds) {
        if (Test-Port -Port $Port) {
            $script:IsServerUp = $true
            Set-ServerStatus -Status "UP" -Message "$ServiceName pret sur $script:ServerUrl" -Data @{ port = $Port }
            return $true
        }

        Start-Sleep -Seconds 2
    }

    return $false
}

function Write-ProcessLine {
    param(
        $Line,
        [string]$ServiceName,
        [int]$Port
    )

    $cleanLine = ConvertTo-LogText -Value $Line

    if ([string]::IsNullOrWhiteSpace($cleanLine)) {
        Write-Host ""
        Add-Content -LiteralPath $script:LatestLogFile -Value "" -Encoding UTF8
        return
    }

    Write-Host $cleanLine

    $level = Get-OutputLevel -Line $cleanLine
    if ($level -eq "WARN") {
        $script:WarningCount++
    }

    $data = @{ service = $ServiceName }
    if ($level -eq "ERROR") {
        Test-ServerReadyFromOutput -Line $cleanLine -Port $Port

        if ($script:IsServerUp -or (Test-Port -Port $Port)) {
            $script:IsServerUp = $true
            Write-LogEvent -Level "WARN" -Event "process.warning" -Message $cleanLine -Data $data
            Set-ServerStatus -Status "UP" -Message "Client pret sur $script:ServerUrl" -Data @{ port = $Port }
            return
        }

        $script:ProblemCount++
        $problem = Get-ProblemDetails -Line $cleanLine
        $script:LastProblem = $problem
        $data.problemCode = $problem.code
        $data.action = $problem.action
        Write-LogEvent -Level "ERROR" -Event "process.problem" -Message $cleanLine -Data $data
        Set-ServerStatus -Status "ERROR" -Message $cleanLine -Data $data
    } elseif ($level -eq "WARN") {
        Write-LogEvent -Level "WARN" -Event "process.warning" -Message $cleanLine -Data $data
    } else {
        Write-LogEvent -Level "INFO" -Event "process.output" -Message $cleanLine -Data $data
    }

    Test-ServerReadyFromOutput -Line $cleanLine -Port $Port
}

function Wait-ForServer {
    param([int]$Port, [string]$ServiceName, [int]$TimeoutSeconds = 60)

    Write-Host "Attente du service $ServiceName sur le port $Port..." -ForegroundColor Yellow

    $startTime = Get-Date
    while (((Get-Date) - $startTime).TotalSeconds -lt $TimeoutSeconds) {
        if (Test-Port -Port $Port) {
            Write-Host "$ServiceName est pret sur $script:ServerUrl" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 2
    }

    Write-Host "Timeout: $ServiceName n'est pas encore pret sur le port $Port" -ForegroundColor Yellow
    return $false
}

function Stop-AllProcesses {
    param(
        [int]$ExitCode = 0,
        [string]$Reason = "Arret manuel"
    )

    $script:IsStopping = $true
    Write-Host "`nArret de tous les processus..." -ForegroundColor Yellow
    if ($ExitCode -eq 0) {
        if ($script:CurrentStatus -ne "ERROR") {
            $script:WarningCount = 0
            $script:ProblemCount = 0
            $script:LastProblem = $null
            Set-ServerStatus -Status "DOWN" -Message $Reason
        }
    } else {
        Set-ServerStatus -Status "ERROR" -Message $Reason
    }

    if ($script:PortWatcherJob) {
        Stop-Job -Job $script:PortWatcherJob -ErrorAction SilentlyContinue
        Remove-Job -Job $script:PortWatcherJob -Force -ErrorAction SilentlyContinue
    }
    if ($script:PortWatcherProcess) {
        Stop-Process -Id $script:PortWatcherProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($script:IntroWatcherProcess) {
        Stop-Process -Id $script:IntroWatcherProcess.Id -Force -ErrorAction SilentlyContinue
    }

    Get-Process -Name "node","pnpm" -ErrorAction SilentlyContinue |
        Stop-Process -Force -ErrorAction SilentlyContinue

    Write-Host "Tous les processus ont ete arretes." -ForegroundColor Green
    exit $ExitCode
}

function Remove-RepoPath {
    param([string]$RelativePath)

    $repoRoot = (Resolve-Path $PSScriptRoot).Path
    $targetPath = Join-Path $repoRoot $RelativePath

    if (-not (Test-Path $targetPath)) {
        return
    }

    $resolvedPath = (Resolve-Path $targetPath).Path
    if (-not $resolvedPath.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refus de supprimer en dehors du repo: $resolvedPath"
    }

    Remove-Item -LiteralPath $resolvedPath -Recurse -Force
}

function Test-StaleGatsbyCache {
    $cacheFiles = @(
        "client\.cache\async-requires.js",
        "client\.cache\_this_is_virtual_fs_path_\`$virtual\async-requires.js"
    )

    foreach ($relativePath in $cacheFiles) {
        $filePath = Join-Path $PSScriptRoot $relativePath
        if ((Test-Path $filePath) -and (Select-String -LiteralPath $filePath -Pattern "src/pages/certification" -Quiet)) {
            return $true
        }
    }

    return $false
}

function Clear-GatsbyCache {
    Write-Host "Nettoyage du cache Gatsby..." -ForegroundColor Cyan
    Write-LogEvent -Level "INFO" -Event "cache.clean.start" -Message "Nettoyage du cache Gatsby"

    Remove-RepoPath -RelativePath "client\.cache"
    Remove-RepoPath -RelativePath "client\public"

    Write-Host "Cache Gatsby nettoye" -ForegroundColor Green
    Write-LogEvent -Level "INFO" -Event "cache.clean.done" -Message "Cache Gatsby nettoye"
}

function Test-FastClientReady {
    $requiredPaths = @(
        "client\config\env.json",
        "client\static\curriculum-data\v2\responsive-web-design-v9.json",
        "client\static\js"
    )

    foreach ($relativePath in $requiredPaths) {
        if (-not (Test-Path (Join-Path $PSScriptRoot $relativePath))) {
            return $false
        }
    }

    return $true
}

function Invoke-DetachedCommand {
    param(
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$WorkingDirectory,
        [string]$ServiceName,
        [int]$Port
    )

    $stdoutFile = Join-Path $script:DevLogsDir "$ServiceName.stdout.log"
    $stderrFile = Join-Path $script:DevLogsDir "$ServiceName.stderr.log"
    [System.IO.File]::WriteAllText($stdoutFile, "", $utf8NoBom)
    [System.IO.File]::WriteAllText($stderrFile, "", $utf8NoBom)

    $commandLine = "$FilePath $($Arguments -join ' ')"
    Write-LogEvent -Level "INFO" -Event "process.start" -Message "Lancement detache de $commandLine" -Data @{
        service = $ServiceName
        workingDirectory = $WorkingDirectory
        port = $Port
        stdout = $stdoutFile
        stderr = $stderrFile
    }

    $process = Start-Process -FilePath $FilePath -ArgumentList $Arguments -WorkingDirectory $WorkingDirectory -WindowStyle Hidden -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile -PassThru
    Write-LogEvent -Level "INFO" -Event "process.detached" -Message "$ServiceName lance en arriere-plan" -Data @{
        service = $ServiceName
        pid = $process.Id
    }

    while (-not $process.HasExited) {
        $stdoutText = Read-SharedTextFile -Path $stdoutFile
        $gatsbyReady = $stdoutText -match "You can now view" -or $stdoutText -match [regex]::Escape($script:ServerUrl)

        if (-not $script:IsServerUp -and ($gatsbyReady -or (Test-Port -Port $Port))) {
            $script:IsServerUp = $true
            Set-ServerStatus -Status "UP" -Message "$ServiceName pret sur $script:ServerUrl" -Data @{ port = $Port }
        }

        Start-Sleep -Seconds 2
        $process.Refresh()
    }

    $exitCode = $process.ExitCode
    if ($exitCode -ne 0) {
        $message = "$ServiceName s'est arrete avec le code $exitCode"
        Set-ServerStatus -Status "ERROR" -Message $message -Data @{ exitCode = $exitCode }
        throw $message
    }

    Set-ServerStatus -Status "DOWN" -Message "$ServiceName est arrete" -Data @{ exitCode = $exitCode }
}

function Start-Client {
    param([bool]$UseFast)

    if ($UseFast) {
        $script:RunMode = "fast"
        Write-Host "Mode rapide: lancement direct de Gatsby, sans turbo setup ni debugger Node." -ForegroundColor Green
        Write-Host "C'est le mode par defaut. Utilise .\dev.ps1 -Clean pour vider le cache Gatsby, ou .\dev.ps1 -Full pour forcer le setup complet." -ForegroundColor Yellow

        Invoke-DetachedCommand -FilePath "pnpm.cmd" -Arguments @("exec", "gatsby", "develop") -WorkingDirectory (Join-Path $PSScriptRoot "client") -ServiceName "client" -Port $script:ServerPort

        return
    }

    $script:RunMode = "full"
    Invoke-LoggedCommand -FilePath "pnpm.cmd" -Arguments @("run", "develop:client") -WorkingDirectory $PSScriptRoot -ServiceName "client" -Port $script:ServerPort
}

function Invoke-LoggedCommand {
    param(
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$WorkingDirectory,
        [string]$ServiceName,
        [int]$Port
    )

    $commandLine = "$FilePath $($Arguments -join ' ')"
    Write-LogEvent -Level "INFO" -Event "process.start" -Message "Lancement de $commandLine" -Data @{
        service = $ServiceName
        workingDirectory = $WorkingDirectory
        port = $Port
    }

    Push-Location $WorkingDirectory
    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        & $FilePath @Arguments 2>&1 | ForEach-Object {
            Write-ProcessLine -Line $_ -ServiceName $ServiceName -Port $Port
        }
        $exitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousErrorActionPreference
        Pop-Location
    }

    if ($null -eq $exitCode) {
        $exitCode = 0
    }

    if ($exitCode -ne 0) {
        $message = "$ServiceName s'est arrete avec le code $exitCode"
        Set-ServerStatus -Status "ERROR" -Message $message -Data @{ exitCode = $exitCode }
        throw $message
    }

    Set-ServerStatus -Status "DOWN" -Message "$ServiceName est arrete" -Data @{ exitCode = $exitCode }
}

Initialize-DevLogs
Set-ServerStatus -Status "DOWN" -Message "Serveur non lance"

$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Stop-AllProcesses -Reason "Arret de PowerShell"
}

$cancelEvent = Register-ObjectEvent -InputObject ([Console]) -EventName CancelKeyPress -Action {
    $EventArgs.Cancel = $true
    Stop-AllProcesses -Reason "Arret par Ctrl+C"
}

try {
    Write-Host "Demarrage du developpement freeCodeCamp..." -ForegroundColor Cyan
    Write-LogEvent -Level "INFO" -Event "dev.start" -Message "Demarrage du developpement freeCodeCamp"

    Write-Host "Verification de pnpm..." -ForegroundColor Cyan
    $pnpmVersion = pnpm --version
    Write-Host "pnpm $pnpmVersion detecte" -ForegroundColor Green
    Write-LogEvent -Level "INFO" -Event "tool.detected" -Message "pnpm detecte" -Data @{ version = $pnpmVersion }

    Write-Host "Configuration de l'environnement..." -ForegroundColor Cyan
    $env:NODE_OPTIONS = "--max-old-space-size=7168 --no-deprecation"
    $env:NODE_ENV = "development"
    if (-not $env:CLIENT_LOCALE) {
        $env:CLIENT_LOCALE = "french"
    }
    if (-not $env:CURRICULUM_LOCALE) {
        $env:CURRICULUM_LOCALE = "french"
    }
    Write-Host "Variables d'environnement configurees" -ForegroundColor Green
    Write-LogEvent -Level "INFO" -Event "env.configured" -Message "Variables d'environnement configurees" -Data @{
        NODE_ENV = $env:NODE_ENV
        CLIENT_LOCALE = $env:CLIENT_LOCALE
        CURRICULUM_LOCALE = $env:CURRICULUM_LOCALE
    }

    if ($Clean -or (Test-StaleGatsbyCache)) {
        Clear-GatsbyCache
    }

    if ($Fast) {
        Write-Host "Option -Fast acceptee pour compatibilite: .\dev.ps1 utilise deja le mode rapide par defaut." -ForegroundColor Yellow
        Write-LogEvent -Level "INFO" -Event "option.deprecated" -Message "Option -Fast ignoree: le mode rapide est le defaut"
    }

    $useFast = -not [bool]$Full
    if ($Full) {
        Write-Host "Mode complet force: turbo setup puis develop:client." -ForegroundColor Yellow
        Write-LogEvent -Level "INFO" -Event "mode.full" -Message "Mode complet force par -Full"
    }

    if ($useFast -and -not (Test-FastClientReady)) {
        Write-Host "Mode rapide indisponible: les fichiers generes ne sont pas encore prets." -ForegroundColor Yellow
        Write-Host "Demarrage complet pour generer les donnees necessaires." -ForegroundColor Yellow
        $useFast = $false
    }

    Write-Host "Lancement du client de developpement..." -ForegroundColor Cyan
    $script:RunMode = if ($useFast) { "fast" } else { "full" }
    Set-ServerStatus -Status "STARTING" -Message "Lancement du client de developpement" -Data @{ fast = $useFast; full = (-not $useFast) }
    if (-not $useFast) {
        Start-PortStatusWatcher -HostName $script:ServerHost -Port $script:ServerPort
    }
    Start-IntroJsonWatcher -Locale $env:CLIENT_LOCALE
    Write-Host "Appuyez sur Ctrl+C pour arreter tous les processus" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Lien attendu une fois demarre :" -ForegroundColor Cyan
    Write-Host "   Client : $script:ServerUrl" -ForegroundColor White
    Write-Host ""

    Start-Client -UseFast $useFast
} catch {
    $errorMessage = ConvertTo-LogText -Value $_
    $script:ProblemCount++
    $script:LastProblem = Get-ProblemDetails -Line $errorMessage
    Write-Host "Erreur: $errorMessage" -ForegroundColor Red
    Set-ServerStatus -Status "ERROR" -Message $errorMessage
    Stop-AllProcesses -ExitCode 1 -Reason $errorMessage
} finally {
    if ($cancelEvent) {
        Unregister-Event -SourceIdentifier $cancelEvent.Name -ErrorAction SilentlyContinue
    }
}
