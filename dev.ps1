# Script de developpement pour freeCodeCamp standalone
# Usage: .\dev.ps1
#        .\dev.ps1 -Fast

param(
    [switch]$Clean = $false,
    [switch]$Fast = $false
)

$ErrorActionPreference = "Stop"

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
    Write-Host "`nArret de tous les processus..." -ForegroundColor Yellow

    Get-Process -Name "node","pnpm" -ErrorAction SilentlyContinue |
        Stop-Process -Force -ErrorAction SilentlyContinue

    Write-Host "Tous les processus ont ete arretes." -ForegroundColor Green
    exit 0
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

    Remove-RepoPath -RelativePath "client\.cache"
    Remove-RepoPath -RelativePath "client\public"

    Write-Host "Cache Gatsby nettoye" -ForegroundColor Green
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
        Write-Host "Mode rapide: lancement direct de Gatsby, sans turbo setup." -ForegroundColor Green
        Write-Host "Utilise .\dev.ps1 ou .\dev.ps1 -Clean si tu as modifie le curriculum ou les dependances." -ForegroundColor Yellow

        Push-Location (Join-Path $PSScriptRoot "client")
        try {
            & pnpm.cmd run develop
        } finally {
            Pop-Location
        }

        return
    }

    & pnpm.cmd run develop:client
}

$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Stop-AllProcesses
}

$cancelEvent = Register-ObjectEvent -InputObject ([Console]) -EventName CancelKeyPress -Action {
    $EventArgs.Cancel = $true
    Stop-AllProcesses
}

try {
    Write-Host "Demarrage du developpement freeCodeCamp..." -ForegroundColor Cyan

    Write-Host "Verification de pnpm..." -ForegroundColor Cyan
    $pnpmVersion = pnpm --version
    Write-Host "pnpm $pnpmVersion detecte" -ForegroundColor Green

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
    Write-Host "Appuyez sur Ctrl+C pour arreter tous les processus" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Lien attendu une fois demarre :" -ForegroundColor Cyan
    Write-Host "   Client : http://localhost:8000" -ForegroundColor White
    Write-Host ""

    Start-Client -UseFast $useFast
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    Stop-AllProcesses
    exit 1
} finally {
    if ($cancelEvent) {
        Unregister-Event -SourceIdentifier $cancelEvent.Name -ErrorAction SilentlyContinue
    }
}
