# CiNQ Design System - Project Installer (PowerShell)
# Usage: .\install-to-product.ps1 [-TargetDir <path>] [-Mode <submodule|clone>]

param (
    [string]$TargetDir = ".",
    [ValidateSet("submodule", "clone")]
    [string]$Mode = "submodule"
)

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/CiNQ-STUDIOS/cinq-design-system.git"
$BrandDir = Join-Path $TargetDir "brand"
$DestDir = Join-Path $BrandDir "design-system"

Write-Host "==> Setting up CiNQ Design System into: $DestDir" -ForegroundColor Cyan

if (-not (Test-Path $BrandDir)) {
    New-Item -ItemType Directory -Path $BrandDir -Force | Out-Null
}

$IsGitRepo = Test-Path (Join-Path $TargetDir ".git")

if ($Mode -eq "submodule" -and $IsGitRepo) {
    Write-Host "==> Adding git submodule..." -ForegroundColor Green
    Push-Location $TargetDir
    try {
        git submodule add $RepoUrl brand/design-system
        git submodule update --init --recursive
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "==> Cloning repository into $DestDir..." -ForegroundColor Green
    git clone $RepoUrl $DestDir
    $NestedGit = Join-Path $DestDir ".git"
    if (Test-Path $NestedGit) {
        Write-Host "==> Removing .git from vendored folder..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $NestedGit
    }
}

Write-Host "==> Done! CiNQ Design System is installed at $DestDir" -ForegroundColor Green
Write-Host "==> You can now prompt your AI agent using the prompt in brand/design-system/README.md" -ForegroundColor Cyan
