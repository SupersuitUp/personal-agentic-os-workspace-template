---
name: process-braindump
description: Route a brain dump (spoken or typed) to the right files in the workspace. Updates people, artifacts, transcripts, and user profile as needed. Use when the owner dumps unstructured thoughts, meeting notes, or updates.
---

# Process Brain Dump

Take unstructured input (voice transcript, typed stream of consciousness, meeting debrief, or any raw thinking) and route it to the correct files in the workspace.

## How to Trigger

The owner will do one of:
- Paste a wall of text
- Voice-dictate a stream of consciousness
- Say "brain dump" or "let me tell you what happened"
- Share raw meeting notes or a transcript

## Routing Rules

Read the input and classify each piece of information. A single brain dump often contains multiple types. Split and route accordingly.

### People mentions → `people/`

If the owner mentions someone by name with context (what they discussed, what they are working on, how the relationship stands), update or create their file in `people/`.

- If the person already has a file, add to their interaction history
- If the person is new, create `people/firstname-lastname.md` with what you know
- Include: date of interaction, what was discussed, any commitments made, any personal details mentioned

### Strategic thinking → `artifacts/`

If the owner is working through a decision, articulating a plan, defining a principle, or documenting a status update, save it as an artifact.

- Filename: `YYYY-MM-DD-descriptive-slug.md`
- Include enough context that future-you (or future-AI) can understand it without the original brain dump

### Meeting debrief → `meeting-transcripts/`

If the input is clearly a meeting recap (mentions attendees, agenda items, decisions made), save it as a transcript.

- Filename: `YYYY-MM-DD-meeting-descriptor.md`
- Cross-reference: update `people/` files for anyone mentioned

### Self-updates → `user/USER.md`

If the owner shares something that changes their profile (new goal, new role, updated blocker, shift in priorities), update `user/USER.md` directly.

### Unsure → Ask

If a piece of information does not clearly fit any category, ask: "This part about [topic]. Should I save it as an artifact, add it to someone's people file, or is it just context for this conversation?"

## Output

After routing, give a brief summary of what you did:

"Here is what I routed:
- Updated `people/sarah-chen.md` with today's conversation notes
- Created `artifacts/2026-04-10-pricing-strategy.md` from your pricing thoughts
- Updated `user/USER.md` with your new 90-day goal"

## Principles

- **Do not lose information.** If the owner said it, it goes somewhere. Nothing falls through the cracks.
- **Cross-reference.** If a transcript mentions people who have files, link them. If an artifact references a decision discussed with someone, note it in their people file.
- **Keep files concise.** Capture what matters, skip filler words and tangents. The owner's thinking, not their throat-clearing.
- **Propose, do not assume.** Show the owner what you plan to do before doing it, especially for creating new files or updating USER.md.
