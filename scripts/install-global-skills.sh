#!/usr/bin/env bash
# Install PAOSWT skills as global slash-commands at ~/.claude/skills/.
#
# By default, skills are symlinked under their original names (/onboard,
# /decongest, etc.). Pass a prefix to namespace them, useful when the
# operator has multiple PAOSWT clones (one personal, one per Jarvis
# client) and wants each clone's skills available globally without
# collisions.
#
# Usage:
#   ./scripts/install-global-skills.sh                Install with no prefix
#   ./scripts/install-global-skills.sh personal-      Install as /personal-onboard, etc.
#   ./scripts/install-global-skills.sh acme-client-   Install as /acme-client-onboard, etc.
#   ./scripts/install-global-skills.sh --uninstall    Remove symlinks (prompts for which prefix)
#   ./scripts/install-global-skills.sh --help         Show this help
#
# This script is idempotent. Re-run any time to refresh.
# Source files in this repo are NEVER touched; the script only creates
# (or removes) symlinks under ~/.claude/skills/.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_SKILLS_DIR="$REPO_ROOT/.agents/skills"
DEST_SKILLS_DIR="$HOME/.claude/skills"

usage() {
  cat <<'HELP'
Install PAOSWT skills as global slash-commands at ~/.claude/skills/.

Usage:
  ./scripts/install-global-skills.sh                Install with no prefix
  ./scripts/install-global-skills.sh <prefix>       Install with custom prefix (e.g. "personal-")
  ./scripts/install-global-skills.sh --uninstall    Remove symlinks installed by this script
  ./scripts/install-global-skills.sh --help         Show this help

PROJECT-LOCAL DISCOVERY ALREADY WORKS WITHOUT THIS SCRIPT.
This repo ships .claude/skills -> ../.agents/skills, so when you open
Claude Code IN THIS REPO, all skills are discoverable automatically.

Run this script only if you want the skills available GLOBALLY (in any
Claude Code session anywhere on your machine, not just inside this repo).

PREFIX TIP:
If you have multiple PAOSWT clones (e.g. one personal, one per Jarvis
client you maintain), pick a distinct prefix per clone so the global
slash-commands do not collide. Examples:
  ./scripts/install-global-skills.sh personal-     -> /personal-onboard, /personal-decongest
  ./scripts/install-global-skills.sh acme-         -> /acme-onboard, /acme-decongest
HELP
}

list_source_skills() {
  for skill_dir in "$SRC_SKILLS_DIR"/*/; do
    [[ -d "$skill_dir" ]] || continue
    basename "$skill_dir"
  done
}

install() {
  local prefix="${1:-}"

  if [[ ! -d "$SRC_SKILLS_DIR" ]]; then
    echo "ERROR: $SRC_SKILLS_DIR does not exist. Are you running this from a PAOSWT clone?"
    exit 1
  fi

  mkdir -p "$DEST_SKILLS_DIR"

  if [[ -n "$prefix" ]]; then
    echo "Installing skills globally with prefix '$prefix'..."
  else
    echo "Installing skills globally with NO prefix (so /onboard, /decongest, etc.)..."
    echo "  If you have multiple PAOSWT clones, consider re-running with a prefix:"
    echo "  ./scripts/install-global-skills.sh personal-"
  fi
  echo

  local linked=0
  local skipped=0
  local conflicted=0

  while IFS= read -r name; do
    local dest="$DEST_SKILLS_DIR/${prefix}${name}"
    local src="$SRC_SKILLS_DIR/$name"

    if [[ -L "$dest" ]]; then
      if [[ "$(readlink "$dest")" == "$src" ]]; then
        echo "  ✓ ${prefix}${name} (already linked)"
        ((skipped++))
      else
        echo "  ! ${prefix}${name} (different symlink at $dest; skipping. Remove manually if you want this one.)"
        ((conflicted++))
      fi
    elif [[ -e "$dest" ]]; then
      echo "  ! ${prefix}${name} (real file/dir at $dest, NOT a symlink; skipping)"
      ((conflicted++))
    else
      ln -s "$src" "$dest"
      echo "  + ${prefix}${name}"
      ((linked++))
    fi
  done < <(list_source_skills)

  echo
  echo "Linked: $linked    Already linked: $skipped    Conflicts: $conflicted"
  echo
  if [[ $conflicted -gt 0 ]]; then
    echo "Conflicts mean another file/symlink already exists at that path."
    echo "Either rename the existing one, pick a different prefix, or live with the conflict."
    echo
  fi

  echo "Done. In any Claude Code session, you can now invoke skills as slash-commands:"
  echo
  while IFS= read -r name; do
    echo "  /${prefix}${name}"
  done < <(list_source_skills)
}

uninstall() {
  echo "Removing PAOSWT skill symlinks from $DEST_SKILLS_DIR..."
  echo "(Only symlinks pointing INTO this repo's .agents/skills/ are removed; everything else stays.)"
  echo

  local removed=0
  for entry in "$DEST_SKILLS_DIR"/*; do
    [[ -L "$entry" ]] || continue
    local target
    target="$(readlink "$entry")"
    if [[ "$target" == "$SRC_SKILLS_DIR/"* ]]; then
      rm "$entry"
      echo "  removed $(basename "$entry")"
      ((removed++))
    fi
  done

  echo
  echo "$removed symlink(s) removed. Source files in $SRC_SKILLS_DIR are untouched."
}

case "${1:-}" in
  --help|-h)
    usage
    ;;
  --uninstall)
    uninstall
    ;;
  *)
    install "${1:-}"
    ;;
esac
