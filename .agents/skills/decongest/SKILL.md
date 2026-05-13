---
name: decongest
description: Extract a single stuck thought, conviction, plan, sermon idea, principle, or insight from the owner's head into a clean artifact in the workspace. Use when the owner says "decongest", "I have something in my head", "I keep meaning to write about X", "help me get this out", "let me dump", "I'm clogged on Y", or describes a recurring thought they have not articulated yet. This is the upstream practice that feeds every other artifact-producing skill (process-braindump assumes the dump already exists; decongest is what produces the dump in the first place).
---

# Decongest

The practice of getting a single thought, conviction, plan, or insight out of the owner's head and into a clean artifact the workspace can use. The owner brings the seed. The skill helps articulate it. The agent executes the structuring. The output is a real file in the right destination.

## When the owner triggers this

Watch for any of these:

- "Decongest"
- "I have this thing in my head"
- "I keep meaning to write about X"
- "Help me get this out"
- "I'm clogged on Y"
- "Let me dump"
- A recurring topic the owner has mentioned three or more times in conversation without ever capturing it in a file

If the owner pastes a long brain dump that already exists, **route to `process-braindump` instead**. This skill is for the upstream case where the dump does not yet exist.

## Workflow

### Step 1: Identify the seed

Ask: "What is the one thing that is stuck? Not a list. The single thing."

Resist the urge to handle multiple things in one session. If the owner names three things, pick the one with the most heat and offer to come back for the others later.

### Step 2: Invite the dump

Offer the owner three ways to dump:

1. **Voice-transcribe**: open your speech-to-text tool (Wispr Flow, MacWhisper, Whisperflow, etc.), talk for two to ten minutes about the thing, paste the transcript here.
2. **Type stream of consciousness**: type whatever comes, no editing, no structure. Paragraph breaks optional.
3. **Talk through your harness's voice mode** (if the owner is using one) and let the transcript flow into the conversation.

The owner picks one. Wait for the dump.

### Step 3: Interview to sharpen

After the initial dump arrives, ask three to five sharp follow-up questions, **one at a time**. Wait for each answer before asking the next. The questions should pull at whatever the dump left implicit. Common ones:

- What is the one-sentence claim under this dump?
- Who is the person this is for?
- What is the concrete example or story behind it?
- What is the strongest counterargument?
- What action does this lead to (for the reader, for you, or both)?
- What other thing in the workspace does this connect to?

Do not batch the questions. The owner's answer to question one often reshapes question two.

### Step 4: Propose the artifact format

Given the dump plus the interview answers, propose what kind of artifact this should become. Common formats:

- **Strategic doc / artifact** (`artifacts/YYYY-MM-DD-slug.md`): for plans, principles, decisions, frameworks, status updates.
- **Wiki post** (if the owner has a personal wiki): polished essay for public or semi-public distribution.
- **Sermon, lesson, or devotional** (if the artifact is faith-shaped): outline or full draft.
- **Deal memo, partner brief, opportunity brief**: structured business artifact.
- **Family memo, kids letter, holiday note**: relational artifact.
- **App or tool spec**: detailed-enough description that AI can build the thing.
- **Prayer, song idea, poem**: short creative artifact.
- **People-file update** (`people/firstname-lastname.md`): if the dump turned out to be primarily about a relationship.
- **User profile update** (`user/USER.md`): if the dump turned out to be primarily a self-update (new goal, new constraint, new conviction about how the owner wants to operate).

State the proposal in one sentence and ask the owner to confirm or pick a different format.

### Step 5: Draft

Once the format is locked:

- Read `user/USER.md` to match the owner's voice. Read 2-3 recent files in the same destination to calibrate on conventions (length, structure, frontmatter).
- Draft the artifact using the dump and the interview answers as raw material. Do not invent content the owner did not say. The artifact is the owner's voice articulated, not the agent's voice imposed.
- Apply whatever voice / style rules the owner has established (file-naming conventions, frontmatter, section structure, banned constructions like em dashes if they have stated such preferences).
- Cross-link to related files in the workspace where the connection is genuine.

### Step 6: Show the draft, get a yes

Present the draft to the owner. Ask: "Does this match what was in your head, or did I miss something?" Apply any corrections. Iterate once or twice if needed. Do not ship until the owner says yes.

### Step 7: Save and report

Once approved:

- Write the file to the right destination.
- Update any cross-referenced files (people/, user/, etc.) so the new artifact is reachable from the rest of the workspace.
- Report back: "Saved to `artifacts/YYYY-MM-DD-slug.md`. Cross-linked from `people/jane-doe.md`. Want to decongest the next thing, or are you done for now?"

## Principles

- **The seed is the value.** The owner's stuck thought is the source of every useful output. The agent's role is to help articulate and structure, not to generate the seed.
- **One thing at a time.** Decongesting one thing well beats half-finishing five.
- **Voice-dump beats type-dump.** Speech is faster than typing for most owners and carries the rhythm of the actual thought. Default to suggesting voice transcription unless the owner prefers typing.
- **Interview before drafting.** A clean dump plus three sharp follow-ups produces a stronger artifact than ten paragraphs of unstructured material.
- **Owner's voice, not agent's voice.** Read `user/USER.md` and match. The artifact should sound like the owner wrote it after a long walk and a clear morning, not like an AI assistant drafted it.
- **Show before save.** Always present the draft for the owner to approve. Decongestion is a partnership, not a hand-off.
- **Connect to the graph.** Every new artifact links to at least one existing file in the workspace where the connection is real. Isolated artifacts decay.
