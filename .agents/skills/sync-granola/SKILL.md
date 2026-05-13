---
name: sync-granola
description: Pull recent Granola meeting notes into this workspace's meeting-transcripts/ folder. Reads documents and transcripts via the Granola API using the local desktop app's auth. Run on demand when the owner says "sync granola", "pull my granola notes", "get my recent meetings", or after a batch of meetings. Mac-only for now.
---

# Sync Granola

Pull recent Granola meeting notes into this workspace's `meeting-transcripts/` folder so the owner can run `/process-transcript` on them. On demand only. No daemon, no cron.

## When to Run

- The owner says "sync granola", "pull my granola notes", "get my recent meetings", "import the last week of meetings"
- After a batch of meetings, before the owner sits down to review

Do not run automatically on a schedule. Granola transcripts come back already speaker-labeled (microphone vs system), so the reconciliation risk that voice memos have does not apply here, but the owner still wants to be in the loop on what gets imported.

## Prerequisites (verify before running)

- Granola desktop app installed and the owner is signed in. The API token lives at `~/Library/Application Support/Granola/supabase.json` and is written automatically by the desktop app.
- Mac. The skill reads the macOS-specific path above. Windows users should be told this is Mac-only for now.
- Node.js (already required by the workspace).

If `~/Library/Application Support/Granola/supabase.json` does not exist, tell the owner: "Granola does not seem to be installed or signed in on this machine. Install it from granola.ai, sign in, then ask me to sync again." Do not proceed.

## Quick Commands

```bash
# Dry run: see what would be synced from the last 7 days
node .agents/skills/sync-granola/scripts/sync.mjs --check

# Sync new meetings from the last 7 days
node .agents/skills/sync-granola/scripts/sync.mjs

# Look back further
node .agents/skills/sync-granola/scripts/sync.mjs --days 14

# Sync from a specific date
node .agents/skills/sync-granola/scripts/sync.mjs --since 2026-04-01

# Process one specific meeting by Granola ID
node .agents/skills/sync-granola/scripts/sync.mjs --id <granola-meeting-id>

# Re-sync a meeting that was already processed
node .agents/skills/sync-granola/scripts/sync.mjs --id <id> --force

# First-time setup: mark all existing Granola meetings as already processed
# so the owner is not drowned in months of old meetings on first run
node .agents/skills/sync-granola/scripts/sync.mjs --init

# Show sync state
node .agents/skills/sync-granola/scripts/state.mjs
```

## First-Time Setup

The first time the owner runs this skill, ask:

> "Do you want to import all of your existing Granola meetings, or just start fresh from today forward? If you have months of old meetings in Granola and you do not want to process them all, I will mark them as already-synced so future runs only pick up new meetings."

If they want to start fresh, run `--init`. Otherwise run a normal sync with whatever lookback window they want.

## Workflow

### Normal sync

1. Run `node .agents/skills/sync-granola/scripts/sync.mjs --check` first. Show the owner what would be imported (titles, dates, attendees).
2. If they confirm, run without `--check`.
3. The script writes one file per meeting to `meeting-transcripts/YYYY-MM-DD-slug.md` with this shape:

```markdown
---
source: "granola"
granola_id: "<id>"
granola_url: "https://notes.granola.ai/p/<id>"
title: "Meeting Title"
date: "YYYY-MM-DD"
attendees:
  - "Person A"
  - "Person B"
status: "raw"
---

## Granola Notes

[Granola's AI-generated meeting summary, if any]

## Transcript

**You:** ...
**Person A:** ...
```

The `status: "raw"` field marks this as freshly imported and not yet processed. After `/process-transcript` runs on it, the skill rewrites the file in canonical form and changes `status` to `"processed"`.

4. Tell the owner what was imported, with filenames, and offer: "Want me to run `/process-transcript` on these now?"

### Deduplication

Before importing, the script skips any meeting where:

- The Granola ID is already in `state/processed.json` (unless `--force`)
- A file in `meeting-transcripts/` already contains the Granola URL `notes.granola.ai/p/<id>` (catches the case where state was reset but the file was kept)

Filename collisions on the same date are resolved by appending a counter to the slug.

### Speaker labeling

Granola tags each transcript segment with `source: "microphone"` (the owner) or `source: "system"` (the other party). The script labels these as `**You:**` and the attendee's name (or `**Other:**` if there are multiple attendees and the script cannot disambiguate). The `process-transcript` skill normalizes these into proper speaker labels later.

## What This Skill Does NOT Do

- **Does not run on a schedule.** No daemon, no cron, no heartbeat. The owner triggers it.
- **Does not call `process-transcript` automatically.** It writes raw files and stops. The owner runs `/process-transcript` next.
- **Does not touch voice memos, Plaud recordings, or any non-Granola audio.** For those, the owner uses TurboScribe (or their own pipeline) to produce a transcript and pastes it into chat.
- **Does not modify `people/` or `artifacts/`.** Those updates happen in `process-transcript`.

## Principles

- **The owner is in the loop.** Always preview with `--check` first if more than 3 meetings would be imported.
- **Raw before processed.** Sync produces raw transcripts. Processing happens in a separate step the owner triggers.
- **Sovereign data.** Files land in the owner's workspace as plain markdown. No vendor lock-in. If Granola disappears tomorrow, the imported transcripts stay.
