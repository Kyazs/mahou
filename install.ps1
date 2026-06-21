#Requires -Version 5.1
<#
.SYNOPSIS
    Install magic-pi-opencode commands into opencode's global config.
.DESCRIPTION
    Copies command files to ~/.config/opencode/command/ and reference files to
    ~/.config/opencode/magic-pi/references/. Replaces {{MAGIC_PI_HOME}} in
    command files with the resolved absolute path (forward slashes for @-include
    compatibility).
.PARAMETER Uninstall
    Remove magic-pi-opencode commands and references.
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
$MagicPiDir = Join-Path $ConfigDir "magic-pi"
$RefsDir = Join-Path $MagicPiDir "references"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceCommands = Join-Path $ScriptDir "commands"
$SourceRefs = Join-Path $ScriptDir "references"

$CommandFiles = @(
    "magic.md",
    "magic-ask.md",
    "magic-debug.md",
    "magic-review.md",
    "magic-brainstorm.md",
    "magic-orchestrator.md"
)

# Magic-Pi home path with forward slashes for @-include compatibility
$MagicPiHome = ($MagicPiDir -replace '\\', '/')

if ($Uninstall) {
    Write-Host "Uninstalling magic-pi-opencode..." -ForegroundColor Yellow

    foreach ($f in $CommandFiles) {
        $target = Join-Path $CommandDir $f
        if (Test-Path $target) {
            Remove-Item $target -Force
            Write-Host "  Removed command: $f"
        }
    }

    if (Test-Path $RefsDir) {
        Remove-Item $RefsDir -Recurse -Force
        Write-Host "  Removed references: $RefsDir"
    }

    # Remove magic-pi dir if empty
    if (Test-Path $MagicPiDir) {
        $remaining = Get-ChildItem $MagicPiDir -ErrorAction SilentlyContinue
        if (-not $remaining) {
            Remove-Item $MagicPiDir -Force
            Write-Host "  Removed empty: $MagicPiDir"
        }
    }

    Write-Host "Uninstall complete. Restart opencode for changes to take effect." -ForegroundColor Green
    exit 0
}

# --- Install ---

Write-Host "Installing magic-pi-opencode..." -ForegroundColor Cyan

# Create directories
foreach ($d in @($ConfigDir, $CommandDir, $MagicPiDir, $RefsDir)) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# Copy references
Write-Host "  Copying reference files..."
Copy-Item -Path (Join-Path $SourceRefs "*") -Destination $RefsDir -Recurse -Force
$refCount = (Get-ChildItem $RefsDir -Recurse -File).Count
Write-Host "    $refCount reference files installed to $RefsDir"

# Copy commands with {{MAGIC_PI_HOME}} replacement
Write-Host "  Installing commands..."
foreach ($f in $CommandFiles) {
    $src = Join-Path $SourceCommands $f
    $dst = Join-Path $CommandDir $f

    if (-not (Test-Path $src)) {
        Write-Host "    SKIP (not found): $f" -ForegroundColor Red
        continue
    }

    $content = Get-Content $src -Raw
    $content = $content -replace '\{\{MAGIC_PI_HOME\}\}', $MagicPiHome
    Set-Content -Path $dst -Value $content -NoNewline
    Write-Host "    Installed: $f"
}

Write-Host ""
Write-Host "Install complete." -ForegroundColor Green
Write-Host "  Commands:   $CommandDir" -ForegroundColor Gray
Write-Host "  References: $RefsDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Restart opencode for the new commands to appear." -ForegroundColor Yellow
