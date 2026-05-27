# Verifie l'etat reel du serveur de dev freeCodeCamp.
# Ne se fie PAS qu'a dev-logs/status.json (peut etre zombie apres un crash).
# Combine status.json + processus node + port TCP + HTTP HEAD.
#
# Usage:
#   .\dev-check.ps1                 # verifie une fois, affiche le verdict
#   .\dev-check.ps1 -Wait            # boucle jusqu'a UP (timeout 5 min par defaut)
#   .\dev-check.ps1 -Wait -Timeout 600  # boucle 10 min max
#   .\dev-check.ps1 -Quiet           # n'affiche que le verdict final
#   .\dev-check.ps1 -Open            # ouvre /cours-fr dans le navigateur des que UP
#   .\dev-check.ps1 -Wait -Open      # attend UP puis ouvre le navigateur
#
# Codes de sortie:
#   0  = serveur UP (port + HTTP repondent)
#   1  = serveur DOWN (port ferme, aucun process)
#   2  = serveur ZOMBIE (status.json dit UP/STARTING mais le port est ferme)
#   3  = serveur en STARTING reel (process en vie, port pas encore ouvert)

param(
    [switch]$Wait = $false,
    [int]$Timeout = 300,
    [switch]$Quiet = $false,
    [int]$Port = 8000,
    [switch]$Open = $false
)

$ErrorActionPreference = 'Stop'
$statusFile = Join-Path $PSScriptRoot 'dev-logs/status.json'

function Test-Port {
    param([int]$Port)
    $tcp = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $tcp.ConnectAsync('127.0.0.1', $Port)
        if ($task.Wait(1500) -and $tcp.Connected) { return $true }
        return $false
    } catch {
        return $false
    } finally {
        $tcp.Close()
    }
}

function Test-Http {
    param([int]$Port)
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -Method Head -TimeoutSec 3
        return [int]$response.StatusCode
    } catch {
        if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode }
        return 0
    }
}

function Get-ServerCheck {
    $reportedStatus = $null
    $reportedAge = $null
    if (Test-Path $statusFile) {
        try {
            $statusData = Get-Content -Raw $statusFile | ConvertFrom-Json
            $reportedStatus = $statusData.status
            $updatedAt = [DateTime]::Parse($statusData.updatedAt)
            $reportedAge = [Math]::Round(((Get-Date).ToUniversalTime() - $updatedAt.ToUniversalTime()).TotalMinutes, 1)
        } catch {}
    }

    $nodes = @(Get-Process -Name node -ErrorAction SilentlyContinue)
    $portOpen = Test-Port -Port $Port
    $httpStatus = if ($portOpen) { Test-Http -Port $Port } else { 0 }

    # La verite vient du port + HTTP. status.json peut mentir (zombie apres
    # crash) ou etre prematurement UP pendant que Gatsby ecrit les page-data.
    $verdict = if ($portOpen -and $httpStatus -gt 0) {
        'UP'
    } elseif ($portOpen) {
        'PORT_OPEN_NO_HTTP'
    } elseif ($nodes.Count -gt 0) {
        # Au moins un node tourne -> Gatsby est encore en train de bosser,
        # peu importe ce que status.json annonce. C'est du STARTING reel.
        'STARTING'
    } elseif ($reportedStatus -in @('UP', 'STARTING')) {
        # status.json dit UP/STARTING mais plus aucun node ne tourne -> zombie.
        'ZOMBIE'
    } else {
        'DOWN'
    }

    return [PSCustomObject]@{
        Verdict        = $verdict
        ReportedStatus = $reportedStatus
        ReportedAgeMin = $reportedAge
        NodeProcesses  = $nodes.Count
        PortOpen       = $portOpen
        HttpStatus     = $httpStatus
    }
}

function Open-Browser {
    $url = "http://localhost:$Port/cours-fr"
    try {
        Start-Process $url | Out-Null
        if (-not $Quiet) { Write-Host "Navigateur ouvert sur $url" -ForegroundColor Cyan }
    } catch {
        if (-not $Quiet) { Write-Host "Impossible d'ouvrir le navigateur: $($_.Exception.Message)" -ForegroundColor Yellow }
    }
}

function Write-Verdict {
    param($Check)
    $color = switch ($Check.Verdict) {
        'UP'       { 'Green' }
        'STARTING' { 'Yellow' }
        'ZOMBIE'   { 'Red' }
        'DOWN'     { 'Red' }
        default    { 'Yellow' }
    }
    Write-Host "Verdict          : $($Check.Verdict)" -ForegroundColor $color
    $ageText = if ($null -eq $Check.ReportedAgeMin) { "inconnu" } else { "$($Check.ReportedAgeMin) min" }
    Write-Host "status.json      : $($Check.ReportedStatus) (mis a jour il y a $ageText)"
    Write-Host "Process node     : $($Check.NodeProcesses)"
    Write-Host "Port $Port ouvert : $($Check.PortOpen)"
    Write-Host "HTTP /           : $($Check.HttpStatus)"
}

if ($Wait) {
    if (-not $Quiet) { Write-Host "Attente du serveur sur le port $Port (timeout $Timeout s)..." -ForegroundColor Cyan }
    $deadline = (Get-Date).AddSeconds($Timeout)
    while ((Get-Date) -lt $deadline) {
        $check = Get-ServerCheck
        if ($check.Verdict -eq 'UP') {
            if (-not $Quiet) { Write-Verdict $check }
            if ($Open) { Open-Browser }
            exit 0
        }
        if ($check.Verdict -in @('DOWN', 'ZOMBIE')) {
            if (-not $Quiet) {
                Write-Host "Le serveur est $($check.Verdict) (pas STARTING). Abandon de l'attente." -ForegroundColor Red
                Write-Verdict $check
            }
            if ($check.Verdict -eq 'ZOMBIE') { exit 2 } else { exit 1 }
        }
        if (-not $Quiet) {
            $remaining = [Math]::Max(0, [int]($deadline - (Get-Date)).TotalSeconds)
            Write-Host ("[{0}] toujours {1}, port={2}, nodes={3} (timeout dans {4}s)" -f (Get-Date -Format 'HH:mm:ss'), $check.Verdict, $check.PortOpen, $check.NodeProcesses, $remaining)
        }
        Start-Sleep -Seconds 3
    }
    if (-not $Quiet) { Write-Host "Timeout atteint, serveur toujours pas UP." -ForegroundColor Red }
    exit 3
}

$check = Get-ServerCheck
if (-not $Quiet) { Write-Verdict $check }
if ($Open -and $check.Verdict -eq 'UP') { Open-Browser }
switch ($check.Verdict) {
    'UP'       { exit 0 }
    'STARTING' { exit 3 }
    'ZOMBIE'   { exit 2 }
    default    { exit 1 }
}
