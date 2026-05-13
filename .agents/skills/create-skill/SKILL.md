---
name: create-skill
description: Interview the owner to create a new skill file for a repeatable workflow. Asks detailed questions one at a time before drafting anything. Use when the owner says "create a skill for", "I want a skill that", "make a workflow for", or when you notice them repeating a task.
---

# Create Skill

Interview the owner to deeply understand a workflow, then codify it as a skill file.

## When to Use

- The owner explicitly asks for a new skill
- You notice the owner doing the same thing more than twice and it could be codified
- The owner describes a process they want to delegate to their Jarvis

## The Interview

Ask these questions **one at a time**. Wait for the owner to answer each one before moving to the next. Do not dump all questions at once. Dig deeper on any answer that is vague.

### 1. The What

"What is this skill supposed to do? Give me the quick version in one or two sentences."

### 2. The Trigger

"How should I know when to run this? What would you say or do that means 'run this skill now'? Give me a few example phrases."

### 3. The Walk-Through

"Walk me through the last time you did this, step by step. Start from the very beginning. What did you do first? Then what? What did you look at? What did you produce?"

This is the most important question. Let them talk. Ask follow-ups:
- "Then what happened?"
- "Where did you get that information?"
- "What did you do with the output?"
- "How long did this take?"

### 4. The Input

"What do I need from you to start this? A name? A file? A topic? A brain dump? What is the minimum context I need?"

### 5. The Output

"What should exist when I am done? A new file? An updated file? A message to you? Be specific about what the finished product looks like."

### 6. The Edge Cases

"What could go wrong? What would make this tricky? Are there situations where the process would be different?"

### 7. The Quality Bar

"How do I know if I did a good job? What separates a great output from a mediocre one for this skill?"

### 8. Anything Else

"Is there anything I am missing? Any rules, preferences, or quirks about how you want this done?"

## Draft the Skill

After the interview, create the skill file at `skills/[skill-name]/SKILL.md`:

```markdown
---
name: [kebab-case-name]
description: [One line describing what the skill does and when to use it. Include trigger phrases.]
---

# [Skill Name]

[One paragraph explaining the purpose.]

## How to Trigger

[When should this skill run? What does the owner say or do? List 3-4 example phrases.]

## Steps

[Step-by-step instructions derived from the walk-through in Question 3. Be specific enough that any AI agent could follow them. Include what files to read, what to create, and how to handle edge cases from Question 6.]

## Output

[What files are created or updated? What does the owner see when it is done?]

## Quality Bar

[From Question 7. What makes a great vs. mediocre execution of this skill.]

## Principles

[Any guiding rules for judgment calls, derived from the full interview.]
```

## Review with the Owner

Present the full draft. Ask section by section:
- "Does the trigger section cover all the ways you would invoke this?"
- "Do the steps match how you actually do it?"
- "Is the quality bar right?"
- "What would you change?"

Apply all feedback. Iterate until they approve.

## Save

Save to `skills/[skill-name]/SKILL.md`. Confirm:

"Skill saved at `skills/[skill-name]/SKILL.md`. You can trigger it by saying any of the trigger phrases. I will also suggest running it when I recognize the pattern."

## Proactive Suggestion

If you notice the owner repeating a workflow that is not yet a skill, suggest it:

"You have done this [X] times now. Want me to interview you about it and turn it into a skill? That way I handle it automatically next time."
