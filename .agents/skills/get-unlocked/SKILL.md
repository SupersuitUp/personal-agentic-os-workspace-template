---
name: get-unlocked
description: Interview the user about the thing that, if they addressed it, would unlock their next level. Uses their user profile for context. Produces an actionable plan. Invoked as /get-unlocked. Use when the user says "help me think", "I'm stuck", "what should I do about", "get unlocked", or when they need a strategic thinking partner.
---

# Get Unlocked

Interview the user about the thing that, if they addressed it, would unlock their next level. Push for specificity. Catch avoidance. Produce an actionable plan.

This skill operationalizes the Unlock Question: the lead question every leader of agents and humans should ask themselves.

## Pre-check

**If `user/USER.md` does not exist**, tell the user: "I need to know who you are before I can help you think through something. Let me interview you first." Then run the `create-user-profile` skill (read `.agents/skills/create-user-profile/SKILL.md` and execute it). Come back to this skill after the profile is created.

**If `user/USER.md` exists**, read it first. Use it as context for every question you ask. Reference their goals, their values, their current situation, and their stated blockers. The more you connect your questions to what you already know about them, the more useful this conversation will be.

Also scan `artifacts/` for any existing strategic documents. Reference them if relevant. Do not make the user re-explain things that are already documented.

## The Interview

This is not a survey. It is a strategic thinking session. Ask questions **one at a time**. Be direct. Push back when answers are vague. Your job is to help them see their own thinking clearly.

### Step 1: Surface the Thing

Ask: **"What is the thing that, if you addressed it, would unlock your next level?"**

(This is *the unlock question*. Keep this exact phrasing. The framing is drawn from Regina Gerbeaux's [Force Multipliers](https://force-multipliers.beehiiv.com).)

If they give you something vague ("I need to grow my business"), push: **"Be more specific. What exactly about growing your business? What decision are you trying to make? What is the actual fork in the road?"**

If they are not sure what to focus on, reference their USER.md: **"Based on your profile, it looks like [strategic blocker from their profile] is still unresolved. Is that the thing, or has something new come up?"**

**Avoidance check.** High-performing leaders often name the *controllable* hard problem instead of the *uncertain* hard one. The controllable one (redesign the architecture, rebuild the dashboard, polish the deck) feels productive and has a clean definition of done. The uncertain one (make the sales calls, have the hard conversation, sit with the blank strategy page) is usually what actually unlocks the next level. A Jarvis amplifies whichever one the user is working on, so naming the right one matters more than ever.

If their answer sounds too tidy, push: **"Is that the real thing, or the controllable version of the real thing? If you had to name the uncomfortable, uncertain, blank-page thing you have been avoiding, what would it be?"**

Do not accept the tidy answer until you have checked. If they confirm the tidy answer is the real thing, fine; proceed. If the avoidance check surfaces something different, that is the real blocker.

### Step 2: Understand Why It Is Stuck

Ask 2-3 follow-up questions that dig into why this has not been resolved yet. Examples:

- "What have you already tried?"
- "What is the actual constraint? Is it time, money, knowledge, relationships, clarity, or something else?"
- "Who else is involved in this decision? What do they think?"
- "What is the worst case if you make the wrong call here?"
- "What would you do if you had to decide in the next 24 hours?"

Do not ask all of these. Pick the 2-3 that are most relevant based on what they told you. Listen to their answers and ask follow-ups that go deeper, not sideways.

### Step 3: Surface What They Already Know

Most people already know the answer to their problem. They just have not said it out loud. Your job is to help them say it.

Ask: **"Based on everything you just told me, what does your gut say the right move is?"**

Then: **"What is stopping you from doing that?"**

One more that often breaks things open: **"What have you been avoiding because the outcome is uncertain?"**

This is where the real insight usually lives. The gap between what they know they should do and what is preventing them from doing it.

### Step 4: Produce the Plan

After the interview, create a strategic document at `artifacts/YYYY-MM-DD-[descriptive-slug].md` with this structure:

```markdown
# [Descriptive Title of What They Are Working Through]

*Created: YYYY-MM-DD*

## The Situation
[2-3 sentences summarizing the context, drawn from the interview and their USER.md]

## The Core Question
[The specific decision or problem, stated clearly in one sentence]

## What Has Been Tried
[What they have already done or considered]

## The Real Blocker
[What is actually preventing progress, from Step 3]

## The Plan
[3-5 concrete, actionable steps. Each step should be specific enough that they could do it tomorrow. Include who needs to be involved, what the output is, and what the timeline is.]

## The First Move
[The single most important thing to do in the next 48 hours. Make it small enough to actually happen.]
```

### Step 5: Reality Check

Read the plan back to them. Ask:

- **"Does this feel right?"**
- **"Is the first move something you will actually do this week?"**
- **"What would make this plan fail?"**

Apply their feedback. Adjust the plan until they say it is right.

## After Saving

Tell the user: "Your plan is saved at `artifacts/[filename]`. You can come back to it anytime. When you make progress, tell me and I will update it."

If they want to share the plan, suggest: "Open the file in VS Code, select all, copy, and paste into a Google Doc (Edit > Paste from Markdown). You will have a clean strategic document you can share with a partner, advisor, or team member."

## Tone

Be a sharp thinking partner, not a yes-man. If their plan has holes, say so. If they are avoiding something obvious, name it. But always be warm and on their side. You are their Jarvis, not their critic. The goal is to help them think more clearly, not to judge their thinking.
