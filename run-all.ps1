$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$fastApiDir = Join-Path $repoRoot "rl-fastapi"
$nodeDir = Join-Path $repoRoot "backend-node"
$frontendDir = Join-Path $repoRoot "frontend-react"

function Assert-CommandAvailable {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string]$InstallHint
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Name was not found. $InstallHint"
    }
}

function Get-PythonExe {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        return "py"
    }

    if (Get-Command python -ErrorAction SilentlyContinue) {
        return "python"
    }

    throw "Python was not found. Install Python and ensure 'py' or 'python' is available in PATH."
}

function Start-ComponentWindow {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$WorkingDirectory,

        [Parameter(Mandatory = $true)]
        [string]$Command
    )

    $encodedCommand = @"
Set-Location -LiteralPath '$WorkingDirectory'
$host.UI.RawUI.WindowTitle = '$Title'
Write-Host 'Starting $Title...' -ForegroundColor Cyan
$Command
"@

    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        $encodedCommand
    ) -WorkingDirectory $WorkingDirectory | Out-Null
}

$pythonExe = Get-PythonExe
Assert-CommandAvailable -Name "npm" -InstallHint "Install Node.js and ensure 'npm' is available in PATH."
Assert-CommandAvailable -Name "powershell" -InstallHint "PowerShell is required to launch separate windows."

Start-ComponentWindow `
    -Title "RL FastAPI" `
    -WorkingDirectory $fastApiDir `
    -Command "$pythonExe -m uvicorn main:app --host 0.0.0.0 --port 5000 --reload"

Start-ComponentWindow `
    -Title "Node Backend" `
    -WorkingDirectory $nodeDir `
    -Command "node server.js"

Start-ComponentWindow `
    -Title "React Frontend" `
    -WorkingDirectory $frontendDir `
    -Command "npm run dev"

Write-Host ""
Write-Host "Started all three components in separate PowerShell windows:" -ForegroundColor Green
Write-Host "  FastAPI:   http://localhost:5000"
Write-Host "  Node API:  http://localhost:3000"
Write-Host "  Frontend:  http://localhost:5173"
