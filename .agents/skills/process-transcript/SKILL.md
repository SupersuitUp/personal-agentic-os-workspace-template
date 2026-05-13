---
name: process-transcript
description: Process a meeting transcript into structured workspace files. Extracts attendees, decisions, action items, and updates people files. Use when the owner pastes or drops a transcript from Granola, Otter, voice memo, or manual notes.
---

# Process Transcript

Take a raw meeting transcript and extract everything useful from it into the workspace.

## How to Trigger

The owner will:
- Paste a transcript directly into the conversation
- Say "process this transcript" or "here are my meeting notes"
- Drop a file into `meeting-transcripts/`

## Steps

### 1. Read the Transcript

Read the full transcript. Identify:
- **Who was there** (speaker names, roles if mentioned)
- **What was discussed** (main topics, in order)
- **What was decided** (explicit decisions, agreements, commitments)
- **Action items** (who said they would do what, by when)
- **Notable quotes or insights** (things worth preserving verbatim)

### 2. Save the Transcript

Save to `meeting-transcripts/YYYY-MM-DD-descriptive-slug.md` with this structure:

```markdown
# [Meeting Title]

*Date: YYYY-MM-DD*
*Participants: [names]*

## Summary
[2-3 sentence overview of what the meeting was about and what was accomplished]

## Key Topics
[Bulleted list of main topics discussed]

## Decisions Made
[Bulleted list of explicit decisions, with who made them]

## Action Items
- [ ] [Person]: [What they committed to] [by when, if stated]
- [ ] [Person]: [What they committed to]

## Notes
[Any other important context, quotes, or observations]
```

### 3. Update People Files

For each person mentioned in the transcript who has a `people/` file (or should have one):

- Add an entry to their interaction history with the date and a one-line summary
- Update any relevant context (new role, new project, changed situation)
- Note any commitments they made or the owner made to them

If a person is mentioned substantively but does not have a file, ask: "Should I create a people file for [name]? They came up in the transcript."

### 4. Create Artifacts for Decisions

If the meeting produced significant decisions or strategic plans, create separate artifacts in `artifacts/`. A decision record or strategic plan is more useful as its own file than buried in a transcript.

### 5. Report What You Did

"Here is what I processed:
- Saved transcript to `meeting-transcripts/2026-04-10-quarterly-planning.md`
- Updated `people/sarah-chen.md` and `people/mark-johnson.md` with interaction notes
- Created `artifacts/2026-04-10-q2-priorities.md` from the planning decisions
- Action items: [list the key ones]"

## Handling Poor Quality Transcripts

Voice-to-text transcripts are often messy: misheard words, no punctuation, wrong speaker labels. Do your best:

- Infer speaker identity from context when labels are wrong
- Clean up obvious transcription errors in the saved version
- If something is ambiguous, flag it: "[unclear: possibly referring to X]"
- Do not fabricate. If you cannot tell what was said, note it as unclear.

## Principles

- **Action items are gold.** The most valuable output is a clean list of who owes what to whom. Get this right.
- **Cross-reference everything.** Every person mentioned gets updated. Every decision gets its own artifact if it is significant.
- **The transcript is the raw material, not the product.** The product is the updated people files, the artifact, and the action items. The transcript is just the input.
