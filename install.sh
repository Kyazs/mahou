#!/usr/bin/env bash
set -euo pipefail

#
# Install mahou into opencode's global config.
#
# Installs:
#   commands/  -> ~/.config/opencode/commands/     ({{MAHOU_HOME}} resolved)
#   agents/    -> ~/.config/opencode/agents/       (permission-enforced agents)
#   skills/    -> ~/.config/opencode/skills/       (skill-tool discovery)
#   skills/    -> ~/.config/opencode/mahou/skills/ (@-include via {{MAHOU_HOME}})
#   plugins/   -> ~/.config/opencode/plugins/      (compaction persistence)
#   tools/     -> ~/.config/opencode/tools/        (describe_image vision tool)
#   references/-> ~/.config/opencode/mahou/references/
#
# Also removes legacy singular-dir installs (command/, .magic-pi, magic*).
#
# Usage: ./install.sh [--uninstall]
#

CONFIG_DIR="${HOME}/.config/opencode"
COMMANDS_DIR="${CONFIG_DIR}/commands"
AGENTS_DIR="${CONFIG_DIR}/agents"
SKILLS_DIR="${CONFIG_DIR}/skills"
PLUGINS_DIR="${CONFIG_DIR}/plugins"
TOOLS_DIR="${CONFIG_DIR}/tools"
MAHOU_DIR="${CONFIG_DIR}/mahou"
REFS_DIR="${MAHOU_DIR}/references"
MAHOU_SKILLS_DIR="${MAHOU_DIR}/skills"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_COMMANDS="${SCRIPT_DIR}/commands"
SOURCE_AGENTS="${SCRIPT_DIR}/agents"
SOURCE_SKILLS="${SCRIPT_DIR}/skills"
SOURCE_PLUGINS="${SCRIPT_DIR}/plugins"
SOURCE_TOOLS="${SCRIPT_DIR}/tools"
SOURCE_REFS="${SCRIPT_DIR}/references"

COMMAND_FILES=("$SOURCE_COMMANDS"/mahou*.md)

UNINSTALL=false
if [[ "${1:-}" == "--uninstall" || "${1:-}" == "-u" ]]; then
    UNINSTALL=true
fi

if $UNINSTALL; then
    echo "Uninstalling mahou..."

    for target in "${COMMANDS_DIR}"/mahou*.md "${CONFIG_DIR}"/command/mahou*.md; do
        [[ -f "$target" ]] || continue
        f=$(basename "$target")
        rm -f "$target"
        echo "  Removed command: $f"
    done

    for dir in "$REFS_DIR" "$MAHOU_SKILLS_DIR"; do
        if [[ -d "$dir" ]]; then
            rm -rf "$dir"
            echo "  Removed: $dir"
        fi
    done

    for agent in "$AGENTS_DIR"/mahou-*.md "$AGENTS_DIR"/ask.md \
                 "$AGENTS_DIR"/implementer.md "$AGENTS_DIR"/spec-reviewer.md \
                 "$AGENTS_DIR"/code-quality-reviewer.md \
                 "$AGENTS_DIR"/integration-reviewer.md \
                 "$AGENTS_DIR"/issue-verifier.md; do
        [[ -f "$agent" ]] || continue
        rm -f "$agent"
        echo "  Removed agent: $(basename "$agent")"
    done

    for skill in "$SKILLS_DIR"/mahou-*; do
        [[ -d "$skill" ]] || continue
        rm -rf "$skill"
        echo "  Removed skill: $(basename "$skill")"
    done

    [[ -f "$PLUGINS_DIR/mahou-compaction.ts" ]] && { rm -f "$PLUGINS_DIR/mahou-compaction.ts"; echo "  Removed plugin: mahou-compaction.ts"; }
    [[ -f "$TOOLS_DIR/describe-image.ts" ]] && { rm -f "$TOOLS_DIR/describe-image.ts"; echo "  Removed tool: describe-image.ts"; }

    if [[ -d "$MAHOU_DIR" ]]; then
        remaining=$(find "$MAHOU_DIR" -mindepth 1 2>/dev/null | head -1)
        if [[ -z "$remaining" ]]; then
            rmdir "$MAHOU_DIR"
            echo "  Removed empty: $MAHOU_DIR"
        fi
    fi

    echo "Uninstall complete. Restart opencode for changes to take effect."
    exit 0
fi

# --- Install ---

echo "Installing mahou..."

mkdir -p "$COMMANDS_DIR" "$AGENTS_DIR" "$SKILLS_DIR" "$PLUGINS_DIR" "$TOOLS_DIR" "$REFS_DIR" "$MAHOU_SKILLS_DIR"

echo "  Copying reference files..."
cp -r "${SOURCE_REFS}/." "$REFS_DIR/"
ref_count=$(find "$REFS_DIR" -type f | wc -l | tr -d ' ')
echo "    $ref_count reference files installed to $REFS_DIR"

echo "  Installing commands..."
for src in "${COMMAND_FILES[@]}"; do
    [[ -f "$src" ]] || continue
    f=$(basename "$src")
    sed "s|{{MAHOU_HOME}}|${MAHOU_DIR}|g" "$src" > "${COMMANDS_DIR}/${f}"
    echo "    Installed: $f"
done

# Remove legacy singular-dir copies so commands don't load twice
if [[ -d "${CONFIG_DIR}/command" ]]; then
    rm -f "${CONFIG_DIR}"/command/mahou*.md
    echo "  Cleaned legacy command dir: ${CONFIG_DIR}/command/mahou*.md"
fi

echo "  Installing agents..."
for src in "$SOURCE_AGENTS"/*.md; do
    [[ -f "$src" ]] || continue
    cp "$src" "$AGENTS_DIR/$(basename "$src")"
    echo "    Installed: $(basename "$src")"
done

echo "  Installing skills (discovery + @-include)..."
cp -r "${SOURCE_SKILLS}/." "$SKILLS_DIR/"
cp -r "${SOURCE_SKILLS}/." "$MAHOU_SKILLS_DIR/"
skill_count=$(find "$SKILLS_DIR" -name SKILL.md | wc -l | tr -d ' ')
echo "    $skill_count skills installed"

echo "  Installing plugins..."
for src in "$SOURCE_PLUGINS"/*.ts; do
    [[ -f "$src" ]] || continue
    cp "$src" "$PLUGINS_DIR/$(basename "$src")"
    echo "    Installed: $(basename "$src")"
done

echo "  Installing tools..."
for src in "$SOURCE_TOOLS"/*.ts; do
    [[ -f "$src" ]] || continue
    cp "$src" "$TOOLS_DIR/$(basename "$src")"
    echo "    Installed: $(basename "$src")"
done

echo ""
echo "Install complete."
echo "  Commands:   ${COMMANDS_DIR}"
echo "  Agents:     ${AGENTS_DIR}"
echo "  Skills:     ${SKILLS_DIR}"
echo "  Plugins:    ${PLUGINS_DIR}"
echo "  Tools:      ${TOOLS_DIR}"
echo "  References: ${REFS_DIR}"
echo ""
echo "Restart opencode for the new commands to appear."
