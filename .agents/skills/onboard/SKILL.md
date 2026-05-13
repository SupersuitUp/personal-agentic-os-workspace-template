---
name: onboard
description: Full first-session onboarding flow. Imports existing AI history (ChatGPT, Claude, etc.), builds user profile, then interviews the user on their most important blocker. Use on first session or when user/USER.md does not exist.
---

# Onboard

The complete first-session experience. By the end, the user has a profile and an actionable plan for the thing that matters most to them right now.

## Flow

### Step 1: Import Existing Context

Before asking any questions, check if the user has context to import. Ask:

**"Before we start, do you have any of the following you can drop into the `user/` folder? This will make your Jarvis dramatically better from day one:"**

- ChatGPT conversation export (Settings > Data Controls > Export Data)
- Claude conversation export (Settings > Account > Export Data)
- LinkedIn profile (copy/paste or PDF)
- A personal bio, website about page, or portfolio
- Any strategic documents, business plans, or writing you have done
- Previous notes, journals, or thinking docs from any tool

**"Drop whatever you have into the `user/` folder and I will read all of it."**

If they have files to import, read everything in `user/` and synthesize a `user/USER.md` from it. Present it back: "Here is what I learned about you. Does this feel right? What would you correct?"

If they have nothing to import, move to Step 2.

### Step 2: Fill the Gaps

If `user/USER.md` was created from imports, scan it for gaps. Are any of these missing?

- What they are working on right now
- Their core values and non-negotiables
- How they make decisions
- Their biggest current blocker
- What success looks like in 90 days

For each gap, ask one focused question to fill it. Do not re-ask things the imports already answered.

If no imports were available, run the full interview from `.agents/skills/create-user-profile/SKILL.md`.

### Step 3: Get Unlocked

Once the profile is solid, transition:

**"Your Jarvis now knows who you are. Now let's put it to work. What is the thing that, if you addressed it, would unlock your next level?"**

Run the interview from `.agents/skills/get-unlocked/SKILL.md`. Use the freshly created profile as context. The AI should reference their goals, values, and situation throughout.

### Step 4: Wrap Up

After the plan is saved, tell the user:

"Here is what you have now:

- **`user/USER.md`**: Your profile. Your Jarvis reads this at the start of every session.
- **`artifacts/[your-plan].md`**: An actionable plan for the thing that matters most right now.

From here, the daily workflow is simple: open your workspace, talk to your Jarvis about whatever is on your mind (use voice-to-text), and let it route the information to the right place. Every conversation makes the system smarter.

You can update your profile anytime by saying 'update my profile.' You can get unlocked on a new blocker anytime by saying 'get unlocked' or 'help me think through something.'"
