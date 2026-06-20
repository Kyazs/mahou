#!/usr/bin/env bash
set -euo pipefail

#
# Install magic-pi-opencode agents into opencode's global config.
# Copies agent files to ~/.config/opencode/agents/ and reference files to
# ~/.config/opencode/magic-pi/references/. Replaces {{MAGIC_PI_HOME}} in
# agent files with the resolved absolute path.
#
# Usage: ./install.sh [--uninstall]
#

CONFIG_DIR="${HOME}/.config/opencode"
AGENTS_DIR="${CONFIG_DIR}/agents"
MAGIC_PI_DIR="${CONFIG_DIR}/magic-pi"
REFS_DIR="${MAGIC_PI_DIR}/references"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_AGENTS="${SCRIPT_DIR}/agents"
SOURCE_REFS="${SCRIPT_DIR}/references"

AGENT_FILES=(
    "magic-ask.md"
    "magic-debug.md"
    "magic-review.md"
    "magic-brainstorm.md"
    "magic-orchestrator.md"
)

UNINSTALL=false
if [[ "${1:-}" == "--uninstall" || "${1:-}" == "-u" ]]; then
    UNINSTALL=true
fi

if $UNINSTALL; then
    echo "Uninstalling magic-pi-opencode..."

    for f in "${AGENT_FILES[@]}"; do
        target="${AGENTS_DIR}/${f}"
        if [[ -f "$target" ]]; then
            rm -f "$target"
            echo "  Removed agent: $f"
        fi
    done

    if [[ -d "$REFS_DIR" ]]; then
        rm -rf "$REFS_DIR"
        echo "  Removed references: $REFS_DIR"
    fi

    if [[ -d "$MAGIC_PI_DIR" ]]; then
        remaining=$(find "$MAGIC_PI_DIR" -mindepth 1 2>/dev/null | head -1)
        if [[ -z "$remaining" ]]; then
            rmdir "$MAGIC_PI_DIR"
            echo "  Removed empty: $MAGIC_PI_DIR"
        fi
    fi

    echo "Uninstall complete. Restart opencode for changes to take effect."
    exit 0
fi

# --- Install ---

echo "Installing magic-pi-opencode..."

mkdir -p "$AGENTS_DIR" "$REFS_DIR"

echo "  Copying reference files..."
cp -r "${SOURCE_REFS}/." "$REFS_DIR/"
ref_count=$(find "$REFS_DIR" -type f | wc -l | tr -d ' ')
echo "    $ref_count reference files installed to $REFS_DIR"

echo "  Installing agents..."
for f in "${AGENT_FILES[@]}"; do
    src="${SOURCE_AGENTS}/${f}"
    dst="${AGENTS_DIR}/${f}"

    if [[ ! -f "$src" ]]; then
        echo "    SKIP (not found): $f"
        continue
    fi

    sed "s|{{MAGIC_PI_HOME}}|${MAGIC_PI_DIR}|g" "$src" > "$dst"
    echo "    Installed: $f"
done

echo ""
echo "Install complete."
echo "  Agents:     ${AGENTS_DIR}"
echo "  References: ${REFS_DIR}"
echo ""
echo "Restart opencode for the new agents to appear in /agent."
