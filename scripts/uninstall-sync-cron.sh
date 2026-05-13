#!/usr/bin/env bash
# Remove the hourly sync cron entry for this Jarvis workspace.
# Mac / Linux companion to install-sync-cron.sh.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYNC_SCRIPT="$REPO_DIR/scripts/sync.sh"

if crontab -l 2>/dev/null | grep -qF "$SYNC_SCRIPT"; then
  crontab -l 2>/dev/null | grep -vF "$SYNC_SCRIPT" | crontab -
  echo "Removed sync cron for $REPO_DIR"
else
  echo "No sync cron found for $REPO_DIR (nothing to do)"
fi
