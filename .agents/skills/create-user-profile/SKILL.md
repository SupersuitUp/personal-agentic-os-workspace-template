---
name: create-user-profile
description: Interview the user to build a comprehensive profile that gives the Jarvis deep context on who they are, what they care about, and what is blocking them. Use when user says "create my profile", "who am I", "update my user file", "USER.md", or when no user/USER.md exists yet.
---

# Create or Update User Profile

Interview the user to build their core profile. Saves the result to `user/USER.md`.

## Pre-check

If `user/USER.md` already exists, read it first and ask what has changed. Skip questions where the existing answer is still accurate.

## When the User Gets Stuck

If the user says "I'm not sure" or "what do you think?", use what you already know about them from prior conversation, other workspace files, or context from this session. Offer your best guess and ask them to confirm or correct. Example: "Based on what you've told me so far, I think the answer might be [your guess]. Does that feel right, or would you adjust it?"

## Interview Flow

Ask these questions **one at a time**. Wait for the user to answer each one before moving to the next. Keep a conversational, warm tone. If the user gives a short answer, ask a follow-up to go deeper.

### Part 1: Who You Are

1. "What is your name and what do you do? Give me the real version, not the LinkedIn version."
2. "What are you most excited about right now in your work or life?"
3. "What are your core values or non-negotiables? The things that, if violated, would make you walk away from a deal or opportunity."
4. "How do you make decisions? Are you gut-first, data-first, advice-first? What is your process when something big is on the line?"

### Part 2: Your Operation

5. "Describe your business or career situation right now. What is the honest state of things?"
6. "Who are the most important people in your professional life right now? (Partners, clients, team members, mentors, investors)"
7. "What tools and systems do you currently use to stay organized? (Even if the answer is 'nothing,' that is useful information.)"

### Part 3: Your Strategic Blocker

8. "What is the single biggest thing blocking you right now? The thing that, if you solved it, would unlock the most progress."
9. "Why is it blocked? What have you tried? What is actually in the way?"
10. "If you had a brilliant advisor sitting next to you right now who knew everything about your situation, what would you ask them?"

### Part 4: Where You Are Going

11. "What does success look like for you in 90 days? Be specific."
12. "What is the scariest thing you are not saying right now, or will not admit to yourself?"

## Output

After the interview, compile everything into `user/USER.md`:

```markdown
# User Profile

*Last updated: YYYY-MM-DD*

## Who I Am
[Name, role, background from questions 1-2]

## Values and Decision-Making
[From questions 3-4]

## Current Situation
[From questions 5-7]

## Strategic Blocker
[From questions 8-10]

## 90-Day Vision
[From questions 11-12]
```

## After Saving

Tell the user:

"Your Jarvis now knows who you are. Every future conversation will be informed by this context. You can update this any time by saying 'update my profile.'

You can also add more files to your `user/` folder to give your Jarvis even deeper context. For example, you could create a `user/voice-profile.md` that captures your writing style, tone, and how you communicate, so that anything your Jarvis writes on your behalf sounds like you. The `user/` folder is all about your Jarvis getting to know who you are. You can put anything in there that helps."

Then ask: "Would you like me to help you think through your strategic blocker right now? I can draft a plan based on what you just told me."

If they say yes, create a second artifact at `artifacts/YYYY-MM-DD-strategic-blocker-plan.md` that breaks their blocker into actionable steps.
