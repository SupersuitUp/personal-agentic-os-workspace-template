#!/usr/bin/env bash
# Sync this Jarvis workspace with its GitHub remote.
# Pulls remote changes, commits anything local, pushes back up.
# Safe to run on a cron. Writes output to .jarvis-sync.log.

set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

LOG="$REPO_DIR/.jarvis-sync.log"
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"

{
  echo ""
  echo "=== sync $(date) ==="

  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "not a git repo, aborting"
    exit 1
  fi

  if [[ -z "$(git remote)" ]]; then
    echo "no git remote configured, aborting"
    exit 1
  fi

  git fetch --all --prune

  if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
    git add -A
    git commit -m "jarvis sync: $(date -u +%Y-%m-%dT%H:%M:%SZ)" || true
  fi

  if ! git pull --rebase --autostash origin "$BRANCH"; then
    echo "rebase failed, aborting rebase and skipping push"
    git rebase --abort 2>/dev/null || true
    exit 1
  fi

  git push origin "$BRANCH" || echo "push failed (check auth: gh auth status)"
} >> "$LOG" 2>&1
