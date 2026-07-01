#Requires -Version 5.1
<#
.SYNOPSIS
    Install mahou commands into opencode's global config.
.DESCRIPTION
    Copies command files to ~/.config/opencode/command/ and reference files to
    ~/.config/opencode/mahou/references/. Replaces {{MAHOU_HOME}} in
    command files with the resolved absolute path (forward slashes for @-include
    compatibility).
.PARAMETER Uninstall
    Remove mahou commands and references.
.EXAMPLE
    .\install.ps1
    .\install.ps1 -Uninstall
#>
param(
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

$ConfigDir = Join-Path $env:USERPROFILE ".config\opencode"
$CommandDir = Join-Path $ConfigDir "command"
$MahouDir = Join-Path $ConfigDir "mahou"
$RefsDir = Join-Path $MahouDir "references"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceCommands = Join-Path $ScriptDir "commands"
$SourceRefs = Join-Path $ScriptDir "references"

# Discover all mahou command files dynamically so new commands don't need installer updates
$CommandFiles = Get-ChildItem -Path $SourceCommands -Filter "mahou*.md" | Select-Object -ExpandProperty Name

# Mahou home path with forward slashes for @-include compatibility
$MahouHome = ($MahouDir -replace '\\', '/')

if ($Uninstall) {
    Write-Host "Uninstalling mahou..." -ForegroundColor Yellow

    $installedCommands = Get-ChildItem -Path $CommandDir -Filter "mahou*.md" -ErrorAction SilentlyContinue
    foreach ($cmd in $installedCommands) {
        Remove-Item $cmd.FullName -Force
        Write-Host "  Removed command: $($cmd.Name)"
    }

    if (Test-Path $RefsDir) {
        Remove-Item $RefsDir -Recurse -Force
        Write-Host "  Removed references: $RefsDir"
    }

    # Remove mahou dir if empty
    if (Test-Path $MahouDir) {
        $remaining = Get-ChildItem $MahouDir -ErrorAction SilentlyContinue
        if (-not $remaining) {
            Remove-Item $MahouDir -Force
            Write-Host "  Removed empty: $MahouDir"
        }
    }

    Write-Host "Uninstall complete. Restart opencode for changes to take effect." -ForegroundColor Green
    exit 0
}

# --- Install ---

Write-Host "Installing mahou..." -ForegroundColor Cyan

# Create directories
foreach ($d in @($ConfigDir, $CommandDir, $MahouDir, $RefsDir)) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# Copy references
Write-Host "  Copying reference files..."
Copy-Item -Path (Join-Path $SourceRefs "*") -Destination $RefsDir -Recurse -Force
$refCount = (Get-ChildItem $RefsDir -Recurse -File).Count
Write-Host "    $refCount reference files installed to $RefsDir"

# Copy commands with {{MAHOU_HOME}} replacement
Write-Host "  Installing commands..."
foreach ($f in $CommandFiles) {
    $src = Join-Path $SourceCommands $f
    $dst = Join-Path $CommandDir $f

    if (-not (Test-Path $src)) {
        Write-Host "    SKIP (not found): $f" -ForegroundColor Red
        continue
    }

    $content = Get-Content $src -Raw
    $content = $content -replace '\{\{MAHOU_HOME\}\}', $MahouHome
    Set-Content -Path $dst -Value $content -NoNewline
    Write-Host "    Installed: $f"
}

Write-Host ""
Write-Host "Install complete." -ForegroundColor Green
Write-Host "  Commands:   $CommandDir" -ForegroundColor Gray
Write-Host "  References: $RefsDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Restart opencode for the new commands to appear." -ForegroundColor Yellow
