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
        [ValidateSet("INFO", "WARN", "ERROR", "OK", "EVENT")]
        [string]$Level,
        [string]$Message
    )

    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "WARN" { "Yellow" }
        "ERROR" { "Red" }
        "OK" { "Green" }
        "EVENT" { "Magenta" }
    }
    $line = "[$timestamp] [$Level] $Message"
    Write-Host $line -ForegroundColor $color
    Add-Content -LiteralPath $watcherLog -Value $line -Encoding UTF8
}

function Invoke-RebuildCurriculumData {
    Write-WatchLog -Level "INFO" -Message "Regeneration en cours..."

    $startTime = Get-Date

    try {
        $env:CURRICULUM_LOCALE = "french"
        $env:CLIENT_LOCALE = "french"
        # Mode watch : on ne reecrit PAS les 18000+ JSON par-challenge.
        # Seuls les listings de superblocks (avec titres FR) sont reecrits, ce
        # qui evite que Gatsby crashe sur sa synchronisation static/->public/
        # (qui fait chmod sur chaque fichier qui change). Pour recharger le
        # contenu d'un challenge, lance un rebuild complet sans FCC_WATCH_MODE.
        $env:FCC_WATCH_MODE = "1"

        # Etape 1 : curriculum.json (lit toutes les .md FR + fusion anglais)
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

        # Etape 2 : client/static/curriculum-data/v2/*.json
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

Write-WatchLog -Level "INFO" -Message "Surveillance de $frBlocksDir (recursif, *.md)"
Write-WatchLog -Level "INFO" -Message "Surveillance de $introJsonPath"
Write-WatchLog -Level "INFO" -Message "Logs : dev-logs\translations-watcher.log"
Write-WatchLog -Level "INFO" -Message "Appuie sur Ctrl+C pour arreter."

$blocksWatcher = New-Object System.IO.FileSystemWatcher
$blocksWatcher.Path = $frBlocksDir
$blocksWatcher.Filter = "*.md"
$blocksWatcher.IncludeSubdirectories = $true
$blocksWatcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::Size
$blocksWatcher.EnableRaisingEvents = $true

$introWatcher = New-Object System.IO.FileSystemWatcher
$introWatcher.Path = $introJsonDir
$introWatcher.Filter = "intro.json"
$introWatcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::Size
$introWatcher.EnableRaisingEvents = $true

$srcBlocks = "WatcherBlocks"
$srcIntro = "WatcherIntro"

# Pas de -Action : on receptionne les events via Get-Event dans le thread principal,
# pour eviter le piege classique du runspace separe (les $script: vars ne sont pas partagees).
Register-ObjectEvent -InputObject $blocksWatcher -EventName "Changed" -SourceIdentifier "$srcBlocks-Changed" | Out-Null
Register-ObjectEvent -InputObject $blocksWatcher -EventName "Created" -SourceIdentifier "$srcBlocks-Created" | Out-Null
Register-ObjectEvent -InputObject $blocksWatcher -EventName "Renamed" -SourceIdentifier "$srcBlocks-Renamed" | Out-Null
Register-ObjectEvent -InputObject $introWatcher -EventName "Changed" -SourceIdentifier "$srcIntro-Changed" | Out-Null

$debounceMs = 800
$allSourceIds = @("$srcBlocks-Changed", "$srcBlocks-Created", "$srcBlocks-Renamed", "$srcIntro-Changed")

function Drain-AllEvents {
    foreach ($sid in $allSourceIds) {
        Get-Event -SourceIdentifier $sid -ErrorAction SilentlyContinue | ForEach-Object {
            Remove-Event -EventIdentifier $_.EventIdentifier
        }
    }
}

try {
    while ($true) {
        $event = $null
        foreach ($sid in $allSourceIds) {
            $pending = Get-Event -SourceIdentifier $sid -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($pending) { $event = $pending; break }
        }

        if (-not $event) {
            Start-Sleep -Milliseconds 200
            continue
        }

        $changedPath = $event.SourceEventArgs.FullPath
        $changeType = $event.SourceEventArgs.ChangeType
        Write-WatchLog -Level "EVENT" -Message "$changeType : $changedPath"

        # Debounce : on attend que la rafale d'events se calme
        Start-Sleep -Milliseconds $debounceMs
        Drain-AllEvents

        Invoke-RebuildCurriculumData
    }
} finally {
    foreach ($sid in $allSourceIds) {
        Unregister-Event -SourceIdentifier $sid -ErrorAction SilentlyContinue
    }
    $blocksWatcher.Dispose()
    $introWatcher.Dispose()
    Write-WatchLog -Level "INFO" -Message "Watcher arrete."
}
