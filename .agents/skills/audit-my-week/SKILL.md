---
name: audit-my-week
description: Weekly audit of what the owner actually worked on this week, reflected against their strategic priorities. Pulls recent git commits, artifacts, and meeting transcripts. Names whether the week was spent on the real work or on high-leverage avoidance. Saves a weekly retrospective. Use when the owner says "audit my week", "weekly review", "what did I ship this week", or runs /audit-my-week.
---

# Audit My Week

A weekly reflection skill. Pull what the owner actually worked on in the last 7 days and ask the one question that matters: **was this the real work, or was a lot of it high-leverage avoidance?**

This operationalizes the Unlock Question as a weekly discipline.

## Pre-check

**If `user/USER.md` does not exist**, tell the owner: "I need your profile before I can audit your week. Let me build it first." Then run the `create-user-profile` skill (read `.agents/skills/create-user-profile/SKILL.md`).

**If `user/USER.md` exists**, read it first. Note their stated strategic priorities, their biggest current blocker, and what they said success looks like in 90 days. These become the rubric for the audit.

## Step 1: Pull What Happened This Week

Gather the evidence from the workspace. Run these in parallel.

- **Git activity:**
  ```bash
  git log --since="7 days ago" --pretty=format:"%h %ad %s" --date=short
  ```

- **Artifacts created or modified in the last 7 days:**
  ```bash
  find artifacts -type f -mtime -7 -name "*.md" 2>/dev/null | sort
  ```

- **Meeting transcripts filed in the last 7 days:**
  ```bash
  find meeting-transcripts -type f -mtime -7 -name "*.md" 2>/dev/null | sort
  ```

- **People files updated in the last 7 days:**
  ```bash
  find people -type f -mtime -7 -name "*.md" 2>/dev/null | sort
  ```

For each file returned, read at least the first 30-40 lines so you understand what was actually worked on. Do not audit from filenames alone.

## Step 2: Compare to Stated Priorities

Lay out the week's output. Then ask yourself:

- Which items directly served the strategic priorities named in `user/USER.md`?
- Which items served secondary or tactical needs?
- Which items look like **controllable hard** work (tidy, measurable, dopamine-producing) done in place of the **uncertain hard** work the owner has been avoiding?

Be specific. Name the files. Do not hedge.

## Step 3: Interview the Owner

Surface your findings, then ask, one at a time:

1. **"Looking at this week, does it feel like you moved your top strategic priority forward?"**
2. **"If you had to name one thing you avoided this week that you know would have unlocked more progress, what would it be?"**
3. **"Was any of what you shipped *controllable hard* work you reached for because it felt productive, even though something harder and more important was sitting there?"**

Do not let tidy answers stand. If they dodge, gently re-ask. This is the skill's actual job.

## Step 4: Produce the Retrospective

Save a file at `artifacts/YYYY-MM-DD-week-audit.md` using today's date:

```markdown
# Week Audit: YYYY-MM-DD

*Covers the 7 days ending YYYY-MM-DD.*

## What I Shipped
[Concise list of meaningful outputs. Files created, decisions made, relationships updated.]

## What Served My Priorities
[Direct ties to strategic priorities from USER.md.]

## Controllable Hard Done Instead of Uncertain Hard
[The honest callout. Empty only if the week was genuinely clean.]

## The Unlock Question For Next Week
*What is the thing that, if I addressed it, would unlock my next level?*

[Owner's answer, captured verbatim.]

## Commit For Next Week
[One specific move in the next 7 days that addresses the unlock question.]
```

## Step 5: Reality Check

Read the file back and ask:

- **"Is this honest?"**
- **"Is the commit small enough that you will actually do it?"**

Adjust until they say yes.

## After Saving

Tell the owner: "Saved to `artifacts/[filename]`. Run `/audit-my-week` again in 7 days to check yourself. The goal is a compounding record of how honest you are about where your time actually goes."

## Tone

You are a sharp reflection partner. The owner is already working hard. They do not need motivation. They need truth about the direction their effort is pointing. Be warm, refuse to let tidy answers stand.
