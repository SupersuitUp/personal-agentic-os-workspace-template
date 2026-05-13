#!/usr/bin/env node

/**
 * sync.mjs: Pull recent Granola meetings into meeting-transcripts/.
 *
 * Writes one raw transcript file per meeting with frontmatter that
 * /process-transcript can consume.
 *
 * Usage:
 *   node sync.mjs                       # Sync new meetings from the last 7 days
 *   node sync.mjs --check               # Dry run: print what would be synced
 *   node sync.mjs --since 2026-04-01    # Only fetch meetings from that date forward
 *   node sync.mjs --days 14             # Look back 14 days
 *   node sync.mjs --id <meeting-id>     # Process one specific meeting
 *   node sync.mjs --force               # Re-sync even if already in state
 *   node sync.mjs --init                # Mark all current meetings as already synced (no files written)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { readState, markProcessed, markMultiple } from "./state.mjs";
import {
  fetchAllDocumentsSince,
  fetchDocuments,
  fetchTranscript,
  fetchNotesMarkdown,
  getAttendees,
  formatTranscript,
} from "./api.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Workspace root is three levels up: scripts/ -> sync-granola/ -> skills/ -> .agents/ -> <root>
const WORKSPACE_ROOT = resolve(__dirname, "..", "..", "..", "..");
const TRANSCRIPTS_DIR = resolve(WORKSPACE_ROOT, "meeting-transcripts");

if (!existsSync(TRANSCRIPTS_DIR)) mkdirSync(TRANSCRIPTS_DIR, { recursive: true });

// =====CLI parsing =====

const args = process.argv.slice(2);
const dryRun = args.includes("--check");
const initMode = args.includes("--init");
const forceMode = args.includes("--force");
const sinceIdx = args.indexOf("--since");
const idIdx = args.indexOf("--id");
const daysIdx = args.indexOf("--days");

const specificId = idIdx !== -1 ? args[idIdx + 1] : null;
const lookbackDays = daysIdx !== -1 ? parseInt(args[daysIdx + 1]) || 7 : 7;

let sinceDate;
if (sinceIdx !== -1 && args[sinceIdx + 1]) {
  sinceDate = new Date(args[sinceIdx + 1]);
} else {
  sinceDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
}

// =====Helpers =====

function slugify(str) {
  return (str || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function uniqueFilepath(date, slug) {
  let candidate = resolve(TRANSCRIPTS_DIR, `${date}-${slug}.md`);
  let counter = 2;
  while (existsSync(candidate)) {
    candidate = resolve(TRANSCRIPTS_DIR, `${date}-${slug}-${counter}.md`);
    counter += 1;
  }
  return candidate;
}

/**
 * Check if a Granola URL already appears in any transcripts file.
 * Catches the "state was reset but the file is still there" case.
 */
function granolaUrlAlreadyInTranscripts(meetingId) {
  try {
    const result = execSync(
      `grep -rl "notes.granola.ai/p/${meetingId}" "${TRANSCRIPTS_DIR}" 2>/dev/null || true`,
      { encoding: "utf8", timeout: 5000 }
    ).trim();
    return result ? result.split("\n")[0] : null;
  } catch {
    return null;
  }
}

function dedup(meeting) {
  const state = readState();
  if (state.processed[meeting.id] && !forceMode) {
    return { result: "already_processed", matched: null };
  }
  const urlMatch = granolaUrlAlreadyInTranscripts(meeting.id);
  if (urlMatch && !forceMode) {
    return { result: "already_in_workspace", matched: urlMatch };
  }
  return { result: "new_meeting", matched: null };
}

function escapeYaml(str) {
  return String(str).replace(/"/g, '\\"');
}

function generateTranscriptFile(meeting, transcriptText, notesMarkdown) {
  const date = new Date(meeting.created_at).toISOString().slice(0, 10);
  const slug = slugify(meeting.title);
  const filepath = uniqueFilepath(date, slug);

  const attendees = getAttendees(meeting);
  const attendeeYaml =
    attendees.length > 0
      ? attendees.map((a) => `  - "${escapeYaml(a)}"`).join("\n")
      : '  - "(unknown)"';

  let content = `---
source: "granola"
granola_id: "${meeting.id}"
granola_url: "https://notes.granola.ai/p/${meeting.id}"
title: "${escapeYaml(meeting.title || "Untitled")}"
date: "${date}"
attendees:
${attendeeYaml}
status: "raw"
---

`;

  if (notesMarkdown && notesMarkdown.trim()) {
    content += `## Granola Notes\n\n${notesMarkdown.trim()}\n\n`;
  }

  if (transcriptText) {
    content += `## Transcript\n\n${transcriptText}\n`;
  } else {
    content += `## Transcript\n\n_(No transcript was available for this meeting.)_\n`;
  }

  writeFileSync(filepath, content);
  return filepath;
}

// =====Main =====

async function main() {
  let meetings;

  if (specificId) {
    const docs = await fetchDocuments({ limit: 100, offset: 0 });
    const found = docs.find((d) => d.id === specificId);
    if (!found) {
      console.error(`Meeting ID ${specificId} not found in recent Granola documents.`);
      process.exit(1);
    }
    meetings = [found];
  } else {
    meetings = await fetchAllDocumentsSince(sinceDate);
    meetings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  if (initMode) {
    console.log(`Marking ${meetings.length} existing meetings as already synced (no files written)...`);
    const entries = {};
    for (const m of meetings) {
      entries[m.id] = {
        title: m.title || "(untitled)",
        date: new Date(m.created_at).toISOString().slice(0, 10),
        status: "skipped",
        dedup_result: "init_mark",
        transcript_path: null,
      };
    }
    markMultiple(entries);
    console.log(`Done. ${meetings.length} meetings marked.`);
    return;
  }

  let synced = 0;
  let skipped = 0;
  let duplicates = 0;
  let errors = 0;

  for (const meeting of meetings) {
    const dedupResult = dedup(meeting);
    const date = new Date(meeting.created_at).toISOString().slice(0, 10);
    const title = meeting.title || "(untitled)";

    if (dedupResult.result === "already_processed") {
      skipped++;
      continue;
    }

    if (dryRun) {
      const icon =
        dedupResult.result === "new_meeting" || forceMode
          ? "+"
          : dedupResult.result === "already_in_workspace"
          ? "="
          : "~";
      const matchInfo = dedupResult.matched ? ` -> ${basename(dedupResult.matched)}` : "";
      console.log(`  ${icon} [${date}] ${title} (${dedupResult.result}${matchInfo})`);
      if (dedupResult.result === "new_meeting" || forceMode) synced++;
      else duplicates++;
      continue;
    }

    if (dedupResult.result !== "new_meeting" && !forceMode) {
      markProcessed(meeting.id, {
        title,
        date,
        status: "duplicate",
        dedup_result: dedupResult.result,
        transcript_path: dedupResult.matched,
      });
      duplicates++;
      continue;
    }

    try {
      const attendees = getAttendees(meeting);
      const [segments, notesMarkdown] = await Promise.all([
        fetchTranscript(meeting.id),
        fetchNotesMarkdown(meeting.id),
      ]);

      const transcriptText = formatTranscript(segments, attendees);
      const filepath = generateTranscriptFile(meeting, transcriptText, notesMarkdown);

      markProcessed(meeting.id, {
        title,
        date,
        status: "synced",
        dedup_result: forceMode ? "forced" : "new_meeting",
        transcript_path: filepath,
        has_transcript: !!transcriptText,
      });

      synced++;
      const note = transcriptText ? ` [${segments?.length || 0} segments]` : " [no transcript]";
      console.log(`  + [${date}] ${title} -> ${basename(filepath)}${note}`);
    } catch (err) {
      console.error(`  ! Error processing ${title}:`, err.message);
      errors++;
    }
  }

  console.log("");
  if (dryRun) {
    console.log(`Dry run: ${synced} would sync, ${duplicates} duplicates, ${skipped} already processed`);
    console.log("Run without --check to actually import.");
  } else {
    console.log(`Done: ${synced} synced, ${duplicates} duplicates, ${skipped} already processed, ${errors} errors`);
    if (synced > 0) {
      console.log(`Files written to: ${TRANSCRIPTS_DIR}`);
      console.log("Next: ask your Jarvis to run /process-transcript on the new files.");
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
