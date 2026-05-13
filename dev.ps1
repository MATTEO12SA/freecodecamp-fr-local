# Script de developpement pour freeCodeCamp standalone
# Usage: .\dev.ps1

param(
    [switch]$Clean = $false
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
    Write-Host "Variables d'environnement configurees" -ForegroundColor Green

    Write-Host "Lancement du client de developpement..." -ForegroundColor Cyan
    Write-Host "Appuyez sur Ctrl+C pour arreter tous les processus" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Lien attendu une fois demarre :" -ForegroundColor Cyan
    Write-Host "   Client : http://localhost:8000" -ForegroundColor White
    Write-Host ""

    & pnpm.cmd run develop:client
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    Stop-AllProcesses
    exit 1
} finally {
    if ($cancelEvent) {
        Unregister-Event -SourceIdentifier $cancelEvent.Name -ErrorAction SilentlyContinue
    }
}
