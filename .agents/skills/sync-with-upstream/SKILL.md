---
name: sync-with-upstream
description: Pull the latest updates from the upstream Jarvis Workspace Template (new skills, updated scripts, refreshed README) into this workspace without disturbing any of the owner's personal files. Use when the owner says "sync with upstream", "pull template updates", "get the latest from the template", or any similar phrasing.
---

# Sync With Upstream

Pull updates from the upstream `garysheng/jarvis-workspace-template` template into this workspace. Leave the owner's personal files untouched.

## What Upstream Owns (Safe To Update)

- `.agents/skills/` (default skills the template ships — the ones the owner sees as `/slash-commands` in Claude Code)
- `scripts/`
- `README.md`
- `CLAUDE.md`, `AGENTS.md`
- Template directory scaffolding

## What Upstream Never Touches (Owner's Files)

- `user/`
- `people/`
- `artifacts/`
- `meeting-transcripts/`
- Any skill directory the owner added themselves under `.agents/skills/` (upstream only ever modifies the named default skills listed in this repo's README; custom skill names outside that list are left alone)

Merge conflicts are only possible in the shared root files (`README.md`, `CLAUDE.md`, `AGENTS.md`) or in default skills the owner has customized.

---

## Workflow

### Step 1: Verify the upstream remote, or add it with a disabled push URL

Run:

```bash
git remote -v
```

If `upstream` is not listed, add it now with a disabled push URL (this prevents any accidental `git push upstream` from ever touching the template):

```bash
git remote add upstream https://github.com/garysheng/jarvis-workspace-template.git
git remote set-url --push upstream DISABLED
```

Confirm the push URL shows as `DISABLED`:

```bash
git remote -v
# origin   https://github.com/OWNER/my-jarvis.git (fetch)
# origin   https://github.com/OWNER/my-jarvis.git (push)
# upstream https://github.com/garysheng/jarvis-workspace-template.git (fetch)
# upstream DISABLED (push)
```

### Step 2: Ensure a clean working tree

```bash
git status
```

If there are uncommitted changes, commit them first (or stash if truly work in progress). Do not proceed with a dirty working tree. If the owner has changes, tell them and wait for their instruction.

### Step 3: Fetch and preview what's coming

```bash
git fetch upstream
git log --oneline HEAD..upstream/main
git diff --name-only HEAD upstream/main
```

Summarize for the owner in plain language:

- How many new commits are incoming
- What files upstream touched (scripts, skills, README, etc.)
- Especially call out **any new skill directories** that have appeared in `.agents/skills/` (for each, read the `SKILL.md` frontmatter so you can describe what it does)

Ask the owner to confirm before merging.

### Step 4: Merge

```bash
git merge upstream/main --no-ff -m "Sync with upstream my-jarvis"
```

### Step 5: Resolve any conflicts

Conflicts are only likely in `README.md`, `CLAUDE.md`, `AGENTS.md`, or default skills the owner customized.

For each conflict:

1. Show the owner the file and explain what they had vs. what upstream changed
2. Propose a merge strategy:
   - For `README.md`: usually accept upstream's version since it is the shared docs
   - For `CLAUDE.md` / `AGENTS.md`: merge both, preserving any owner-added sections
   - For a customized default skill: offer to rename the owner's version to `.agents/skills/<skill-name>-custom/` (preserving it as its own discoverable skill) and accept upstream's version at the original path, OR keep the owner's version and discard upstream's changes to that skill
3. Apply the chosen merge, then `git add <files> && git commit`

### Step 6: Push to origin

```bash
git push origin main
```

Never `git push upstream` anything. The push URL is `DISABLED`, and the owner is not a collaborator on the template repo, but respect the boundary anyway.

### Step 7: Report what arrived

Tell the owner, in a short clear summary:

- **New skills** (name + one-line description from each SKILL.md frontmatter)
- **Updated skills** (what changed, if anything useful)
- **Script changes** (especially if they affect sync or setup)
- **Doc changes** worth knowing about (README, CLAUDE.md)
- **Anything that needs attention** (new environment requirements, new optional setup steps, breaking changes)

Invite the owner to try the new skills.

---

## Principles

- **The owner's files are sacred.** Never touch `user/`, `people/`, `artifacts/`, `meeting-transcripts/`, or any skill directory the owner added under `.agents/skills/` that is not in the list of default skills this repo ships.
- **Push URL stays DISABLED.** A typo should never become a template commit.
- **Preview before merging.** The owner deserves to know what is coming before it lands.
- **Be specific about new capabilities.** Do not just report "3 new skills" — say what they do.
