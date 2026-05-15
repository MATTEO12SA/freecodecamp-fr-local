# Watcher de traductions pour freeCodeCamp standalone
# Surveille les fichiers FR et regenere automatiquement la curriculum-data
# sans avoir a redemarrer Gatsby. Rafraichis le navigateur (Ctrl+F5) apres
# chaque rebuild pour voir les changements.
#
# Usage: .\watch-translations.ps1
#        .\watch-translations.ps1 -Quiet

param(
    [switch]$Quiet = $false
)

$ErrorActionPreference = "Stop"

$repoRoot = $PSScriptRoot
$frBlocksDir = Join-Path $repoRoot "curriculum\i18n-curriculum\curriculum\challenges\french\blocks"
$introJsonPath = Join-Path $repoRoot "client\i18n\locales\french\intro.json"
$introJsonDir = Split-Path $introJsonPath -Parent
$logsDir = Join-Path $repoRoot "dev-logs"
$watcherLog = Join-Path $logsDir "translations-watcher.log"

function Write-WatchLog {
    param(
        [ValidateSet("INFO", "WARN", "ERROR", "OK")]
        [string]$Level,
        [string]$Message
    )

    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "WARN" { "Yellow" }
        "ERROR" { "Red" }
        "OK" { "Green" }
    }
    $line = "[$timestamp] [$Level] $Message"
    Write-Host $line -ForegroundColor $color
    Add-Content -LiteralPath $watcherLog -Value $line -Encoding UTF8
}

function Invoke-RebuildCurriculumData {
    Write-WatchLog -Level "INFO" -Message "Changement detecte, regeneration en cours..."

    $startTime = Get-Date

    try {
        $env:CURRICULUM_LOCALE = "french"
        $env:CLIENT_LOCALE = "french"

        # Etape 1 : curriculum.json (lit toutes les .md FR et les fusionne avec l'anglais)
        Push-Location (Join-Path $repoRoot "curriculum")
        try {
            $curriculumOutput = & pnpm.cmd build 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-WatchLog -Level "ERROR" -Message "Echec curriculum build (code $LASTEXITCODE)"
                $curriculumOutput | Out-File -LiteralPath $watcherLog -Append -Encoding UTF8
                return
            }
        } finally {
            Pop-Location
        }

        # Etape 2 : client/static/curriculum-data/v2/*.json (servi par Gatsby au navigateur)
        Push-Location (Join-Path $repoRoot "client")
        try {
            $clientOutput = & pnpm.cmd create:external-curriculum 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-WatchLog -Level "ERROR" -Message "Echec create:external-curriculum (code $LASTEXITCODE)"
                $clientOutput | Out-File -LiteralPath $watcherLog -Append -Encoding UTF8
                return
            }
        } finally {
            Pop-Location
        }

        $duration = ((Get-Date) - $startTime).TotalSeconds
        Write-WatchLog -Level "OK" -Message ("Curriculum-data regeneree en {0:N1}s. Rafraichis le navigateur (Ctrl+F5)." -f $duration)
    } catch {
        Write-WatchLog -Level "ERROR" -Message "Exception : $_"
    }
}

if (-not (Test-Path $frBlocksDir)) {
    Write-WatchLog -Level "ERROR" -Message "Dossier introuvable : $frBlocksDir"
    exit 1
}

New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
Set-Content -LiteralPath $watcherLog -Value "=== Watcher demarre le $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" -Encoding UTF8

Write-WatchLog -Level "INFO" -Message "Surveillance de $frBlocksDir"
Write-WatchLog -Level "INFO" -Message "Surveillance de $introJsonPath"
Write-WatchLog -Level "INFO" -Message "Logs : dev-logs\translations-watcher.log"
Write-WatchLog -Level "INFO" -Message "Appuie sur Ctrl+C pour arreter."

# Debouncer : agrege les rafales d'evenements (un Ctrl+S declenche plusieurs Changed)
$script:pendingRebuild = $false
$script:lastEventAt = [DateTime]::MinValue
$debounceMs = 800

$blocksWatcher = New-Object System.IO.FileSystemWatcher
$blocksWatcher.Path = $frBlocksDir
$blocksWatcher.Filter = "*.md"
$blocksWatcher.IncludeSubdirectories = $true
$blocksWatcher.EnableRaisingEvents = $true
$blocksWatcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

$introWatcher = New-Object System.IO.FileSystemWatcher
$introWatcher.Path = $introJsonDir
$introWatcher.Filter = "intro.json"
$introWatcher.EnableRaisingEvents = $true
$introWatcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite

$action = {
    $script:pendingRebuild = $true
    $script:lastEventAt = Get-Date
}

Register-ObjectEvent -InputObject $blocksWatcher -EventName "Changed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $blocksWatcher -EventName "Created" -Action $action | Out-Null
Register-ObjectEvent -InputObject $blocksWatcher -EventName "Renamed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $introWatcher -EventName "Changed" -Action $action | Out-Null

try {
    while ($true) {
        Start-Sleep -Milliseconds 200
        if ($script:pendingRebuild) {
            $elapsedMs = ((Get-Date) - $script:lastEventAt).TotalMilliseconds
            if ($elapsedMs -ge $debounceMs) {
                $script:pendingRebuild = $false
                Invoke-RebuildCurriculumData
            }
        }
    }
} finally {
    Get-EventSubscriber | Unregister-Event -ErrorAction SilentlyContinue
    $blocksWatcher.Dispose()
    $introWatcher.Dispose()
    Write-WatchLog -Level "INFO" -Message "Watcher arrete."
}
