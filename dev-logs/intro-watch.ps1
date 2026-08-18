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
        # [FR-local] server.log desactive (doublon de latest.log).
        # Add-Content -LiteralPath $StructuredLogFile -Value ($record | ConvertTo-Json -Compress -Depth 8) -Encoding UTF8
    } catch {
        # Logging must never stop the watcher.
    }

    if ($Level -eq "ERROR") {
        # [FR-local] errors.log desactive (sous-ensemble de latest.log).
        # Add-Content -LiteralPath $ErrorsLogFile -Value $humanLine -Encoding UTF8
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
