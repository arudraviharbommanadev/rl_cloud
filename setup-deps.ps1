$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,

        [Parameter(Mandatory = $true)]
        [scriptblock]$Action
    )

    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
    & $Action
}

function Get-PythonCommand {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        return @("py", "-m", "pip")
    }

    if (Get-Command python -ErrorAction SilentlyContinue) {
        return @("python", "-m", "pip")
    }

    throw "Python was not found. Install Python and ensure 'py' or 'python' is available in PATH."
}

function Assert-NpmAvailable {
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        throw "npm was not found. Install Node.js and ensure 'npm' is available in PATH."
    }
}

$pythonCommand = Get-PythonCommand
Assert-NpmAvailable

Invoke-Step "Installing Python dependencies from requirements.txt" {
    & $pythonCommand[0] $pythonCommand[1] $pythonCommand[2] install -r (Join-Path $repoRoot "requirements.txt")
}

Invoke-Step "Installing Node backend dependencies" {
    Push-Location (Join-Path $repoRoot "backend-node")
    try {
        npm install
    }
    finally {
        Pop-Location
    }
}

Invoke-Step "Installing React frontend dependencies" {
    Push-Location (Join-Path $repoRoot "frontend-react")
    try {
        npm install
    }
    finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "All dependencies installed successfully." -ForegroundColor Green
