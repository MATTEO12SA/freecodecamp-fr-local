param(
    [string]$HostName,
    [int]$Port,
    [int]$TimeoutSeconds,
    [string]$StatusFile,
    [string]$LatestLogFile,
    [string]$DevLogsDir,
    [string]$RunId,
    [string]$RunStartedAt,
    [string]$RunMode
)

function Test-HttpReady {
    param([string]$HostName, [int]$Port)

    $urls = @(
        "http://${HostName}:$Port/",
        "http://127.0.0.1:$Port/",
        "http://[::1]:$Port/"
    )
    foreach ($url in $urls) {
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -Method Head -TimeoutSec 2
            if ([int]$response.StatusCode -ge 200) {
                return $true
            }
        } catch {
            if ($_.Exception.Response) {
                return $true
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
    $clientPid = $null
    if (Test-Path -LiteralPath $StatusFile) {
        try {
            $existing = Get-Content -LiteralPath $StatusFile -Raw | ConvertFrom-Json
            $clientPid = $existing.clientPid
        } catch {
            $clientPid = $null
        }
    }
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
        clientPid = $clientPid
        logs = [ordered]@{
            directory = "dev-logs"
            status = "dev-logs/status.json"
            latest = "dev-logs/latest.log"
            client = "dev-logs/client.stdout.log"
        }
        absoluteLogs = [ordered]@{
            directory = $DevLogsDir
            status = $StatusFile
            latest = $LatestLogFile
            client = (Join-Path $DevLogsDir "client.stdout.log")
        }
    }
}

$serverUrl = "http://$HostName`:$Port"
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $deadline) {
    if (Test-HttpReady -HostName $HostName -Port $Port) {
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
    line = "Le client n'a pas repondu en HTTP sur $serverUrl avant le timeout."
    action = "Regarde dev-logs/latest.log et dev-logs/client.stdout.log, puis relance avec .\dev.ps1 -Clean si Gatsby est bloque."
}
Write-PrettyJson -Payload (New-StatusPayload -Status "ERROR" -Message "Timeout: client non joignable sur $serverUrl apres $TimeoutSeconds secondes" -LastProblem $problem -Problems 1) -Path $StatusFile
Add-Content -LiteralPath $LatestLogFile -Value "$updatedAt [ERROR] [status.error] Timeout: client non joignable sur $serverUrl apres $TimeoutSeconds secondes problemCode=SERVER_START_TIMEOUT watcherProcess=True" -Encoding UTF8
exit 1
