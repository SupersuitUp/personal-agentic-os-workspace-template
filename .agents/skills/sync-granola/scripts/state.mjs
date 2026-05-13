#!/usr/bin/env node

/**
 * state.mjs: Sync state for sync-granola.
 *
 * Tracks which Granola meeting IDs have been imported into this workspace
 * so re-runs do not produce duplicates.
 *
 * State lives at .agents/skills/sync-granola/state/processed.json
 * (gitignored: see .agents/skills/sync-granola/.gitignore).
 *
 * Usage as CLI:
 *   node state.mjs                     # Show summary
 *   node state.mjs --get <meeting-id>  # Show entry for a specific meeting
 *   node state.mjs --reset --confirm   # Wipe state
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(__dirname, "..");
const STATE_DIR = resolve(SKILL_DIR, "state");
const STATE_FILE = resolve(STATE_DIR, "processed.json");

if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

const EMPTY_STATE = { last_sync: null, processed: {} };

export function readState() {
  if (!existsSync(STATE_FILE)) return { ...EMPTY_STATE, processed: {} };
  try {
    const raw = JSON.parse(readFileSync(STATE_FILE, "utf8"));
    return { last_sync: raw.last_sync || null, processed: raw.processed || {} };
  } catch {
    return { ...EMPTY_STATE, processed: {} };
  }
}

export function writeState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function getEntry(meetingId) {
  return readState().processed[meetingId] || null;
}

export function isProcessed(meetingId) {
  return getEntry(meetingId) !== null;
}

export function markProcessed(meetingId, entry) {
  const state = readState();
  state.processed[meetingId] = {
    processed_at: new Date().toISOString(),
    ...entry,
  };
  state.last_sync = new Date().toISOString();
  writeState(state);
}

export function markMultiple(entries) {
  const state = readState();
  for (const [id, entry] of Object.entries(entries)) {
    state.processed[id] = {
      processed_at: new Date().toISOString(),
      ...entry,
    };
  }
  state.last_sync = new Date().toISOString();
  writeState(state);
}

export function stats() {
  const state = readState();
  const entries = Object.values(state.processed);
  return {
    total: entries.length,
    synced: entries.filter((e) => e.status === "synced").length,
    skipped: entries.filter((e) => e.status === "skipped").length,
    duplicate: entries.filter((e) => e.status === "duplicate").length,
    last_sync: state.last_sync,
  };
}

export { STATE_FILE };

// CLI
if (process.argv[1] && process.argv[1].endsWith("state.mjs")) {
  const args = process.argv.slice(2);

  if (args.includes("--reset")) {
    if (args.includes("--confirm")) {
      writeState({ ...EMPTY_STATE, processed: {} });
      console.log("State reset.");
    } else {
      console.log("Pass --confirm to actually reset state.");
    }
  } else if (args.includes("--get")) {
    const id = args[args.indexOf("--get") + 1];
    if (!id) {
      console.error("Usage: node state.mjs --get <meeting-id>");
      process.exit(1);
    }
    const entry = getEntry(id);
    console.log(entry ? JSON.stringify(entry, null, 2) : "Not processed.");
  } else {
    const s = stats();
    console.log("Granola sync state:");
    console.log(`  Total entries: ${s.total}`);
    console.log(`  Synced:        ${s.synced}`);
    console.log(`  Skipped:       ${s.skipped}`);
    console.log(`  Duplicate:     ${s.duplicate}`);
    console.log(`  Last sync:     ${s.last_sync || "never"}`);
  }
}
