---
name: prep-for-meeting
description: Generate a meeting prep brief from relationship files and artifacts. Use when the owner says "prep me for my meeting with X", "I'm about to meet with X", or "brief me on X".
---

# Prep for Meeting

Generate a concise meeting preparation brief using everything the workspace knows about the attendees and relevant context.

## How to Trigger

The owner will say something like:
- "Prep me for my meeting with Sarah"
- "I'm about to hop on a call with John and Maria"
- "Brief me on everything I know about Acme Corp"
- "What should I know before my 2pm?"

## Steps

### 1. Identify the People

Extract the names from the request. Look up each person in `people/`.

If a person does not have a file, say so: "I don't have a file for [name]. Want to tell me about them quickly so I can create one?"

### 2. Read Their Files

For each attendee, read their full `people/` file. Note:
- Who they are and what they do
- How the owner knows them
- Last interaction (date and what was discussed)
- Any open commitments, follow-ups, or unresolved topics
- Personal details the owner captured (family, interests, things they care about)

### 3. Scan Artifacts for Relevance

Check `artifacts/` for any documents that mention these people or their organizations. Look for:
- Past strategic plans involving them
- Decision records where they were consulted
- Status updates about shared projects

### 4. Check Meeting Transcripts

Scan `meeting-transcripts/` for previous meetings with these people. Summarize what was discussed and any action items that came out of it.

### 5. Generate the Brief

Produce a concise brief with this structure:

```
## Meeting Brief: [Name(s)]
*Prepared: [date]*

### Who You Are Meeting
[One paragraph per person: who they are, your relationship, their current focus]

### Last Time You Spoke
[Date, what was discussed, any commitments made]

### Open Items
[Bullet list of unresolved topics, pending follow-ups, things they are waiting on from you or vice versa]

### Context from Your Files
[Any relevant artifacts, strategic docs, or notes that connect to this meeting]

### Suggested Topics
[2-3 things the owner might want to bring up based on the context]

### Personal Notes
[Anything personal the owner captured: their kid's name, something they are excited about, a challenge they mentioned]
```

### 6. Deliver

Present the brief directly in the conversation. Do not save it as a file unless the owner asks.

If the owner wants it saved: `artifacts/YYYY-MM-DD-meeting-brief-[name].md`

## After the Meeting

Remind the owner: "When the meeting is done, tell me what happened and I will update everything." This feeds into the `process-braindump` skill.

## Principles

- **Surface the personal details.** Remembering someone's kid's name or the project they were excited about is what makes this feel magical. Always include personal notes if they exist.
- **Flag gaps.** If the people file is thin ("I only know their name and company"), say so. The owner can fill it in before the meeting.
- **Keep it short.** The brief should be scannable in 2 minutes. Not a dossier. A cheat sheet.
