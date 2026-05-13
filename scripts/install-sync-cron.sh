#!/usr/bin/env bash
# Install an hourly cron job that syncs this Jarvis workspace to GitHub.
# Idempotent: running again replaces the existing entry for this workspace.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYNC_SCRIPT="$REPO_DIR/scripts/sync.sh"

if [[ ! -f "$SYNC_SCRIPT" ]]; then
  echo "sync.sh not found at $SYNC_SCRIPT"
  exit 1
fi

chmod +x "$SYNC_SCRIPT"

CRON_LINE="0 * * * * $SYNC_SCRIPT"

TMP="$(mktemp)"
crontab -l 2>/dev/null | grep -vF "$SYNC_SCRIPT" > "$TMP" || true
echo "$CRON_LINE" >> "$TMP"
crontab "$TMP"
rm "$TMP"

echo "Installed hourly sync cron for $REPO_DIR"
echo ""
echo "Verify with: crontab -l"
echo "Logs will accumulate in: $REPO_DIR/.jarvis-sync.log"
echo ""
echo "To remove later: crontab -l | grep -vF '$SYNC_SCRIPT' | crontab -"
