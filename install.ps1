#Requires -Version 5.1
<#
.SYNOPSIS
    Install magic-pi-opencode agents into opencode's global config.
.DESCRIPTION
    Copies agent files to ~/.config/opencode/agents/ and reference files to
    ~/.config/opencode/magic-pi/references/. Replaces {{MAGIC_PI_HOME}} in
    agent files with the resolved absolute path (forward slashes for @-include
    compatibility).
.PARAMETER Uninstall
    Remove magic-pi-opencode agents and references.
.EXAMPLE
    .\install.ps1
    .\install.ps1 -Uninstall
#>
param(
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

$ConfigDir = Join-Path $env:USERPROFILE ".config\opencode"
$AgentsDir = Join-Path $ConfigDir "agents"
$MagicPiDir = Join-Path $ConfigDir "magic-pi"
$RefsDir = Join-Path $MagicPiDir "references"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceAgents = Join-Path $ScriptDir "agents"
$SourceRefs = Join-Path $ScriptDir "references"

$AgentFiles = @(
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

    foreach ($f in $AgentFiles) {
        $target = Join-Path $AgentsDir $f
        if (Test-Path $target) {
            Remove-Item $target -Force
            Write-Host "  Removed agent: $f"
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
foreach ($d in @($ConfigDir, $AgentsDir, $MagicPiDir, $RefsDir)) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# Copy references
Write-Host "  Copying reference files..."
Copy-Item -Path (Join-Path $SourceRefs "*") -Destination $RefsDir -Recurse -Force
$refCount = (Get-ChildItem $RefsDir -Recurse -File).Count
Write-Host "    $refCount reference files installed to $RefsDir"

# Copy agents with {{MAGIC_PI_HOME}} replacement
Write-Host "  Installing agents..."
foreach ($f in $AgentFiles) {
    $src = Join-Path $SourceAgents $f
    $dst = Join-Path $AgentsDir $f

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
Write-Host "  Agents:    $AgentsDir" -ForegroundColor Gray
Write-Host "  References: $RefsDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Restart opencode for the new agents to appear in /agent." -ForegroundColor Yellow
