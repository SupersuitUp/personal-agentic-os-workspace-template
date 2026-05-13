#!/usr/bin/env node

/**
 * api.mjs: Granola API client.
 *
 * Auth comes from the local Granola desktop app's WorkOS tokens at
 *   ~/Library/Application Support/Granola/supabase.json
 *
 * Endpoints used:
 *   POST https://api.granola.ai/v2/get-documents           (list documents)
 *   POST https://api.granola.ai/v1/get-document-transcript (raw transcript segments)
 *   POST https://api.granola.ai/v1/get-document-panels     (AI-generated notes)
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const SUPABASE_JSON = resolve(
  process.env.HOME,
  "Library/Application Support/Granola/supabase.json"
);

const BASE = "https://api.granola.ai";

// =====Auth =====

let _cachedToken = null;
let _tokenReadAt = 0;
const TOKEN_TTL_MS = 5 * 60 * 1000;

export function readToken() {
  const now = Date.now();
  if (_cachedToken && now - _tokenReadAt < TOKEN_TTL_MS) return _cachedToken;

  if (!existsSync(SUPABASE_JSON)) {
    throw new Error(
      `Granola supabase.json not found at ${SUPABASE_JSON}. Install Granola from granola.ai and sign in, then try again.`
    );
  }

  const raw = JSON.parse(readFileSync(SUPABASE_JSON, "utf8"));
  if (!raw.workos_tokens) {
    throw new Error(
      "No workos_tokens field in supabase.json. Sign in to Granola first."
    );
  }

  const tokens = typeof raw.workos_tokens === "string"
    ? JSON.parse(raw.workos_tokens)
    : raw.workos_tokens;

  if (!tokens.access_token) {
    throw new Error("No access_token found in Granola's workos_tokens.");
  }

  _cachedToken = tokens.access_token;
  _tokenReadAt = now;
  return _cachedToken;
}

// =====Low-level POST =====

async function post(path, body = {}) {
  const token = readToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Granola API ${path} failed: ${res.status} ${res.statusText}. ${text}`);
  }

  return res.json();
}

// =====Documents =====

export async function fetchDocuments({ limit = 50, offset = 0 } = {}) {
  const data = await post("/v2/get-documents", {
    limit,
    offset,
    include_last_viewed_panel: false,
  });
  return data.docs || [];
}

export async function fetchAllDocumentsSince(since, maxDocs = 200) {
  const results = [];
  let offset = 0;
  const limit = 50;
  let reachedCutoff = false;

  while (results.length < maxDocs && !reachedCutoff) {
    const docs = await fetchDocuments({ limit, offset });
    if (docs.length === 0) break;

    for (const doc of docs) {
      const created = new Date(doc.created_at);
      if (since && created < since) {
        reachedCutoff = true;
        break;
      }
      if (doc.valid_meeting && doc.deleted_at === null) {
        results.push(doc);
      }
    }

    if (docs.length < limit) break;
    offset += limit;
  }

  return results;
}

// =====Transcript =====

export async function fetchTranscript(documentId) {
  try {
    const segments = await post("/v1/get-document-transcript", {
      document_id: documentId,
    });
    if (!Array.isArray(segments) || segments.length === 0) return null;

    return segments
      .filter((s) => s.text && s.start_timestamp)
      .sort((a, b) => new Date(a.start_timestamp) - new Date(b.start_timestamp));
  } catch (err) {
    if (err.message.includes("404") || err.message.includes("not found")) return null;
    throw err;
  }
}

// =====AI notes panels =====

export async function fetchNotesMarkdown(documentId) {
  try {
    const panels = await post("/v1/get-document-panels", {
      document_id: documentId,
    });
    if (!Array.isArray(panels) || panels.length === 0) return null;

    const primary =
      panels.find((p) => p.template_slug === "v2:meeting-summary-consolidated") ||
      panels[0];
    if (!primary) return null;

    return prosemirrorToMarkdown(primary.content);
  } catch (err) {
    if (err.message.includes("404") || err.message.includes("not found")) return null;
    throw err;
  }
}

function prosemirrorToMarkdown(node) {
  if (!node) return "";
  if (typeof node === "string") return node;

  if (node.type === "doc") {
    return (node.content || []).map(prosemirrorToMarkdown).join("\n\n").trim();
  }

  if (node.type === "text") {
    let text = node.text || "";
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === "bold") text = `**${text}**`;
        if (mark.type === "italic") text = `*${text}*`;
        if (mark.type === "code") text = `\`${text}\``;
      }
    }
    return text;
  }

  if (node.type === "heading") {
    const level = node.attrs?.level || 2;
    const text = (node.content || []).map(prosemirrorToMarkdown).join("");
    return `${"#".repeat(level)} ${text}`;
  }

  if (node.type === "paragraph") {
    return (node.content || []).map(prosemirrorToMarkdown).join("");
  }

  if (node.type === "bulletList" || node.type === "orderedList") {
    return (node.content || [])
      .map((item, i) => {
        const text = (item.content || []).map(prosemirrorToMarkdown).join(" ").trim();
        return node.type === "orderedList" ? `${i + 1}. ${text}` : `- ${text}`;
      })
      .join("\n");
  }

  if (node.type === "listItem") {
    return (node.content || []).map(prosemirrorToMarkdown).join(" ");
  }

  if (node.type === "hardBreak") return "\n";

  if (node.content) {
    return node.content.map(prosemirrorToMarkdown).join("");
  }

  return "";
}

// =====Helpers =====

export function getAttendees(doc) {
  if (!doc.people) return [];
  const names = new Set();
  if (doc.people.attendees) {
    for (const a of doc.people.attendees) {
      const name = a.name || a.details?.person?.name?.fullName;
      if (name) names.add(name);
    }
  }
  return Array.from(names);
}

/**
 * Format Granola transcript segments into readable markdown.
 * source: "microphone" -> the owner ("You")
 * source: "system"     -> the other speaker (attendee name if exactly one other; otherwise "Other")
 */
export function formatTranscript(segments, attendees) {
  if (!segments || segments.length === 0) return null;

  const otherLabel = attendees.length === 1 ? attendees[0] : "Other";

  return segments
    .map((s) => {
      const speaker = s.source === "microphone" ? "You" : otherLabel;
      return `**${speaker}:** ${s.text}`;
    })
    .join("\n\n");
}
