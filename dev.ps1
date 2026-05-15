# Script de developpement pour freeCodeCamp standalone
# Usage: .\dev.ps1
#        .\dev.ps1 -Fast

param(
    [switch]$Clean = $false,
    [switch]$Fast = $false
)

$ErrorActionPreference = "Stop"

$script:DevLogsDir = Join-Path $PSScriptRoot "dev-logs"
$script:StatusFile = Join-Path $script:DevLogsDir "status.json"
$script:StructuredLogFile = Join-Path $script:DevLogsDir "server.log"
$script:LatestLogFile = Join-Path $script:DevLogsDir "latest.log"
$script:ErrorsLogFile = Join-Path $script:DevLogsDir "errors.log"
$script:RunId = [guid]::NewGuid().ToString()
$script:RunStartedAt = (Get-Date).ToUniversalTime().ToString("o")
$script:CurrentStatus = "DOWN"
$script:RunMode = "normal"
$script:IsServerUp = $false
$script:WarningCount = 0
$script:ProblemCount = 0
$script:LastProblem = $null
$script:LastPortProbe = [DateTime]::MinValue

function Test-Port {
    param([int]$Port)

    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", $Port)
        $tcpClient.Close()
        return $true
    } catch {
        return $false
    }
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

function Initialize-DevLogs {
    New-Item -ItemType Directory -Path $script:DevLogsDir -Force | Out-Null

    $header = @(
        "runId=$script:RunId",
        "startedAt=$script:RunStartedAt",
        "repo=$PSScriptRoot",
        ""
    )
    Set-Content -LiteralPath $script:LatestLogFile -Value $header -Encoding UTF8

    if (-not (Test-Path $script:StructuredLogFile)) {
        New-Item -ItemType File -Path $script:StructuredLogFile -Force | Out-Null
    }

    if (-not (Test-Path $script:ErrorsLogFile)) {
        New-Item -ItemType File -Path $script:ErrorsLogFile -Force | Out-Null
    }
}

function Write-LogEvent {
    param(
        [ValidateSet("INFO", "WARN", "ERROR")]
        [string]$Level,
        [string]$Event,
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
        event = $Event
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

    $humanLine = "$timestamp [$Level] [$Event] $cleanMessage$details"
    Add-Content -LiteralPath $script:LatestLogFile -Value $humanLine -Encoding UTF8

    if ($Level -eq "ERROR" -or $Level -eq "WARN") {
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
        url = "http://localhost:8000"
        port = 8000
        startedAt = $script:RunStartedAt
        updatedAt = $updatedAt
        warnings = $script:WarningCount
        problems = $script:ProblemCount
        lastProblem = $script:LastProblem
        logs = $relativeLogs
        absoluteLogs = $absoluteLogs
    }

    $payload | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $script:StatusFile -Encoding UTF8
    Write-LogEvent -Level "INFO" -Event "status.$($Status.ToLowerInvariant())" -Message $Message -Data $Data
}

function Get-ProblemDetails {
    param([string]$Line)

    $patterns = @(
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
        Set-ServerStatus -Status "UP" -Message "Client pret sur http://localhost:$Port" -Data @{ port = $Port }
    }
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
        $script:ProblemCount++
        $problem = Get-ProblemDetails -Line $cleanLine
        $script:LastProblem = $problem
        $data.problemCode = $problem.code
        $data.action = $problem.action
        Write-LogEvent -Level "ERROR" -Event "process.problem" -Message $cleanLine -Data $data
        Set-ServerStatus -Status "ERROR" -Message $cleanLine -Data $data
    } elseif ($level -eq "WARN") {
        $warningDetails = Get-ProblemDetails -Line $cleanLine
        $data.problemCode = $warningDetails.code
        $data.action = $warningDetails.action
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
            Write-Host "$ServiceName est pret sur http://localhost:$Port" -ForegroundColor Green
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

    Write-Host "`nArret de tous les processus..." -ForegroundColor Yellow
    if ($ExitCode -eq 0) {
        Set-ServerStatus -Status "DOWN" -Message $Reason
    } else {
        Set-ServerStatus -Status "ERROR" -Message $Reason
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

function Start-Client {
    param([bool]$UseFast)

    if ($UseFast) {
        $script:RunMode = "fast"
        Write-Host "Mode rapide: lancement direct de Gatsby, sans turbo setup." -ForegroundColor Green
        Write-Host "Utilise .\dev.ps1 ou .\dev.ps1 -Clean si tu as modifie le curriculum ou les dependances." -ForegroundColor Yellow

        Invoke-LoggedCommand -FilePath "pnpm.cmd" -Arguments @("run", "develop") -WorkingDirectory (Join-Path $PSScriptRoot "client") -ServiceName "client" -Port 8000

        return
    }

    $script:RunMode = "normal"
    Invoke-LoggedCommand -FilePath "pnpm.cmd" -Arguments @("run", "develop:client") -WorkingDirectory $PSScriptRoot -ServiceName "client" -Port 8000
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
    try {
        & $FilePath @Arguments 2>&1 | ForEach-Object {
            Write-ProcessLine -Line $_ -ServiceName $ServiceName -Port $Port
        }
        $exitCode = $LASTEXITCODE
    } finally {
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
    $env:NODE_OPTIONS = "--max-old-space-size=7168"
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

    $useFast = [bool]$Fast
    if ($useFast -and -not (Test-FastClientReady)) {
        Write-Host "Mode rapide indisponible: les fichiers generes ne sont pas encore prets." -ForegroundColor Yellow
        Write-Host "Demarrage normal pour generer les donnees necessaires." -ForegroundColor Yellow
        $useFast = $false
    }

    Write-Host "Lancement du client de developpement..." -ForegroundColor Cyan
    $script:RunMode = if ($useFast) { "fast" } else { "normal" }
    Set-ServerStatus -Status "STARTING" -Message "Lancement du client de developpement" -Data @{ fast = $useFast }
    Write-Host "Appuyez sur Ctrl+C pour arreter tous les processus" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Lien attendu une fois demarre :" -ForegroundColor Cyan
    Write-Host "   Client : http://localhost:8000" -ForegroundColor White
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
