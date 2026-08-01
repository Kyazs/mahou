#Requires -Version 5.1
<#
.SYNOPSIS
    Install mahou into opencode's global config.
.DESCRIPTION
    Installs commands, agents, skills, plugins, tools, and references into
    ~/.config/opencode/. Replaces {{MAHOU_HOME}} in command files with the
    resolved absolute path (forward slashes for @-include compatibility).
    Also removes legacy singular-dir installs (command/, .magic-pi, magic*).
.PARAMETER Uninstall
    Remove mahou commands, agents, skills, plugins, tools, and references.
.EXAMPLE
    .\install.ps1
    .\install.ps1 -Uninstall
#>
param(
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

$ConfigDir = Join-Path $env:USERPROFILE ".config\opencode"
$CommandsDir = Join-Path $ConfigDir "commands"
$AgentsDir = Join-Path $ConfigDir "agents"
$SkillsDir = Join-Path $ConfigDir "skills"
$PluginsDir = Join-Path $ConfigDir "plugins"
$ToolsDir = Join-Path $ConfigDir "tools"
$MahouDir = Join-Path $ConfigDir "mahou"
$RefsDir = Join-Path $MahouDir "references"
$MahouSkillsDir = Join-Path $MahouDir "skills"
$LegacyCommandDir = Join-Path $ConfigDir "command"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceCommands = Join-Path $ScriptDir "commands"
$SourceAgents = Join-Path $ScriptDir "agents"
$SourceSkills = Join-Path $ScriptDir "skills"
$SourcePlugins = Join-Path $ScriptDir "plugins"
$SourceTools = Join-Path $ScriptDir "tools"
$SourceRefs = Join-Path $ScriptDir "references"

$CommandFiles = Get-ChildItem -Path $SourceCommands -Filter "mahou*.md" | Select-Object -ExpandProperty Name

# Mahou home path with forward slashes for @-include compatibility
$MahouHome = ($MahouDir -replace '\\', '/')

if ($Uninstall) {
    Write-Host "Uninstalling mahou..." -ForegroundColor Yellow

    foreach ($dir in @($CommandsDir, $LegacyCommandDir)) {
        if (Test-Path $dir) {
            Get-ChildItem -Path $dir -Filter "mahou*.md" -ErrorAction SilentlyContinue | ForEach-Object {
                Remove-Item $_.FullName -Force
                Write-Host "  Removed command: $($_.Name)"
            }
        }
    }

    foreach ($dir in @($RefsDir, $MahouSkillsDir)) {
        if (Test-Path $dir) {
            Remove-Item $dir -Recurse -Force
            Write-Host "  Removed: $dir"
        }
    }

    foreach ($agent in @("mahou-readonly.md", "mahou-planner.md", "ask.md", "implementer.md", "spec-reviewer.md", "code-quality-reviewer.md", "integration-reviewer.md", "issue-verifier.md")) {
        $p = Join-Path $AgentsDir $agent
        if (Test-Path $p) {
            Remove-Item $p -Force
            Write-Host "  Removed agent: $agent"
        }
    }

    if (Test-Path $SkillsDir) {
        Get-ChildItem -Path $SkillsDir -Directory -Filter "mahou-*" -ErrorAction SilentlyContinue | ForEach-Object {
            Remove-Item $_.FullName -Recurse -Force
            Write-Host "  Removed skill: $($_.Name)"
        }
    }

    foreach ($f in @("mahou-compaction.ts", "describe-image.ts")) {
        $p = Join-Path (if ($f -eq "mahou-compaction.ts") { $PluginsDir } else { $ToolsDir }) $f
        if (Test-Path $p) {
            Remove-Item $p -Force
            Write-Host "  Removed: $f"
        }
    }

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

foreach ($d in @($ConfigDir, $CommandsDir, $AgentsDir, $SkillsDir, $PluginsDir, $ToolsDir, $MahouDir, $RefsDir, $MahouSkillsDir)) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

Write-Host "  Copying reference files..."
Copy-Item -Path (Join-Path $SourceRefs "*") -Destination $RefsDir -Recurse -Force
$refCount = (Get-ChildItem $RefsDir -Recurse -File).Count
Write-Host "    $refCount reference files installed to $RefsDir"

Write-Host "  Installing commands..."
foreach ($f in $CommandFiles) {
    $src = Join-Path $SourceCommands $f
    $dst = Join-Path $CommandsDir $f

    if (-not (Test-Path $src)) {
        Write-Host "    SKIP (not found): $f" -ForegroundColor Red
        continue
    }

    $content = Get-Content $src -Raw
    $content = $content -replace '\{\{MAHOU_HOME\}\}', $MahouHome
    Set-Content -Path $dst -Value $content -NoNewline
    Write-Host "    Installed: $f"
}

# Remove legacy singular-dir copies so commands don't load twice
if (Test-Path $LegacyCommandDir) {
    Get-ChildItem -Path $LegacyCommandDir -Filter "mahou*.md" -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Host "  Cleaned legacy command dir: $($_.Name)"
    }
}

Write-Host "  Installing agents..."
foreach ($f in (Get-ChildItem -Path $SourceAgents -Filter "*.md").Name) {
    Copy-Item -Path (Join-Path $SourceAgents $f) -Destination (Join-Path $AgentsDir $f) -Force
    Write-Host "    Installed: $f"
}

Write-Host "  Installing skills (discovery + @-include)..."
Copy-Item -Path (Join-Path $SourceSkills "*") -Destination $SkillsDir -Recurse -Force
Copy-Item -Path (Join-Path $SourceSkills "*") -Destination $MahouSkillsDir -Recurse -Force
$skillCount = (Get-ChildItem -Path $SkillsDir -Recurse -Filter "SKILL.md").Count
Write-Host "    $skillCount skills installed"

Write-Host "  Installing plugins..."
foreach ($f in (Get-ChildItem -Path $SourcePlugins -Filter "*.ts").Name) {
    Copy-Item -Path (Join-Path $SourcePlugins $f) -Destination (Join-Path $PluginsDir $f) -Force
    Write-Host "    Installed: $f"
}

Write-Host "  Installing tools..."
foreach ($f in (Get-ChildItem -Path $SourceTools -Filter "*.ts").Name) {
    Copy-Item -Path (Join-Path $SourceTools $f) -Destination (Join-Path $ToolsDir $f) -Force
    Write-Host "    Installed: $f"
}

Write-Host ""
Write-Host "Install complete." -ForegroundColor Green
Write-Host "  Commands:   $CommandsDir" -ForegroundColor Gray
Write-Host "  Agents:     $AgentsDir" -ForegroundColor Gray
Write-Host "  Skills:     $SkillsDir" -ForegroundColor Gray
Write-Host "  Plugins:    $PluginsDir" -ForegroundColor Gray
Write-Host "  Tools:      $ToolsDir" -ForegroundColor Gray
Write-Host "  References: $RefsDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Restart opencode for the new commands to appear." -ForegroundColor Yellow
