# Personal Agentic OS Workspace Template

Your personal AI-operated business OS. Spin up your own private copy from this template, open it, and start talking. By the end of your first session, you will have an AI system that knows who you are and a plan for the thing that matters most to you right now.

For the full conceptual framing, the multi-page Supersuit Up Workshop, tool-setup guides, and use cases, see **[supersuit.wiki](https://supersuit.wiki)**.

## What This Is

A structured workspace of plain markdown files that gives you AI-augmented recall, strategic clarity, and compounding context. Your AI agent (Claude Code, Hermes, Codex, or any harness) reads these files and operates from them. Every conversation makes the system smarter.

This is not a chatbot. This is a persistent memory system that compounds over time. Think Iron Man's Jarvis: it knows your goals, your relationships, your projects, your decisions. And it gets better every day you use it.

## Quick Start

1. Install the prerequisites: [Node.js](https://nodejs.org), [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (`npm install -g @anthropic-ai/claude-code`), [VS Code](https://code.visualstudio.com) (then open it and run "Shell Command: Install 'code' command in PATH" from the command palette so the `code` CLI works), and [GitHub CLI](https://cli.github.com) (`brew install gh` on Mac). The GitHub CLI is required for the built-in sync script.
   - **If `claude --version` fails after install:** Claude Code is installed but not on your PATH. Add it to your shell config (Mac / Linux):
     ```bash
     echo 'export PATH="$HOME/.claude/local:$PATH"' >> ~/.zshrc
     source ~/.zshrc
     ```
     (Use `~/.bashrc` instead of `~/.zshrc` if you are on bash.) Open a new terminal and `claude --version` should work.
2. Sign in to GitHub from the CLI: `gh auth login`. Follow the prompts (choose HTTPS and authenticate via browser for the smoothest path).
3. Create a `github-repos` folder in your home directory to keep all your repos in one predictable place: `mkdir -p ~/github-repos && cd ~/github-repos`
4. Get your own private copy. This repo is a **GitHub template**, so creating yours is one click:
   - Visit [github.com/SupersuitUp/personal-agentic-os-workspace-template](https://github.com/SupersuitUp/personal-agentic-os-workspace-template)
   - Click **"Use this template"** → **"Create a new repository"**
   - Name it `my-jarvis` (or whatever you prefer), set visibility to **Private**, click Create
   - Clone your new private repo locally:
     ```bash
     cd ~/github-repos
     gh repo clone YOUR-USERNAME/my-jarvis
     cd my-jarvis
     ```
5. Open in VS Code: `cd ~/github-repos && code my-jarvis`
6. Open the terminal (Terminal > New Terminal) and run: `claude`
7. Your Jarvis will walk you through the rest. On your first session, it runs the **onboard** skill automatically: imports your existing AI history, builds your profile, and interviews you about your most important blocker.
8. Turn on hourly auto-sync so your work is backed up to GitHub: `bash scripts/install-sync-cron.sh`

> **Pulling future updates from the template:** The template gets better over time (new skills, updated scripts). When you want the latest, run `/sync-with-upstream` in Claude Code (or just tell your harness *"sync with upstream"*). It will pull the new goodies from `SupersuitUp/personal-agentic-os-workspace-template` without touching your personal files. See the [sync-with-upstream](.agents/skills/sync-with-upstream/SKILL.md) skill for details. You cannot accidentally push to the upstream template: you are not a collaborator on that repo, and the skill configures your local remote with a disabled push URL as a second safety net.

## Folder Structure

```
my-jarvis/
├── CLAUDE.md                    # Points to AGENTS.md (Claude Code reads this first)
├── AGENTS.md                    # Full operating instructions for any AI agent
├── README.md                    # You are here
├── user/                        # Everything about you
│   └── USER.md                  # Your profile (created on first session)
├── people/                      # One file per person in your life
├── artifacts/                   # Strategic documents, plans, decisions
├── meeting-transcripts/         # Processed transcripts from meetings
├── scripts/                          # Workspace automation
│   ├── sync.sh                       # Commit local changes, pull + push to GitHub
│   ├── install-sync-cron.sh          # Mac / Linux: register hourly sync as a cron job
│   ├── uninstall-sync-cron.sh        # Mac / Linux: remove the sync cron job
│   ├── install-sync-task-windows.ps1 # Windows: register hourly sync as a Task Scheduler task
│   └── uninstall-sync-task-windows.ps1 # Windows: remove the sync Scheduled Task
├── .agents/
│   └── skills/                  # Canonical skills location (vendor-neutral convention)
│       ├── onboard/             # First-session onboarding flow
│       ├── create-user-profile/ # Build or update your user profile
│       ├── get-unlocked/        # Interview on your most important blocker (The Unlock Question)
│       ├── audit-my-week/       # Weekly reflection: real work vs high-leverage avoidance
│       ├── decongest/           # Extract a single stuck thought from your head into an artifact
│       ├── process-braindump/   # Route unstructured input to the right files
│       ├── prep-for-meeting/    # Generate meeting prep briefs
│       ├── process-transcript/  # Extract insights from meeting transcripts
│       ├── sync-granola/        # Pull recent Granola meeting notes into meeting-transcripts/
│       ├── create-skill/        # Create new skills through interview
│       └── sync-with-upstream/  # Pull updates from the template
└── .claude/
    └── skills -> ../.agents/skills   # Symlink so Claude Code auto-discovers the same skills
```

**Skills live under `.agents/skills/` as the canonical location.** This is vendor-neutral: it is the path [Codex auto-discovers by default](https://developers.openai.com/codex/skills), the example path [Hermes docs recommend for shared/external skill directories](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), and it avoids branding the workspace around any single vendor.

For Claude Code, which hardcodes its auto-discovery to `.claude/skills/`, the template commits a symlink `.claude/skills → ../.agents/skills` so the same skill directories are picked up automatically. Launch `claude` inside the workspace and `/onboard`, `/sync-with-upstream`, `/prep-for-meeting`, etc. all appear in the slash-command menu with zero manual registration.

For Hermes users: either use the natural-language triggers in the table below (which work via `AGENTS.md` routing), or add this workspace's skills directory to your `~/.hermes/config.yaml` so Hermes auto-registers them as slash commands too:

```yaml
skills:
  external_dirs:
    - /absolute/path/to/this/workspace/.agents/skills
```

**Windows note:** the `.claude/skills` symlink requires Git's symlink support. On modern Git for Windows installers with developer mode enabled, `core.symlinks=true` by default and everything works. If your clone shows a broken symlink (a text file rather than a working link), run `git config --global core.symlinks true` and re-clone, or run the fallback from `scripts/setup-claude-skills-windows.ps1`.

### user/

Everything your Jarvis needs to know about you. The core file is `USER.md`, which captures your identity, values, decision-making style, current situation, and goals. Created automatically on your first session.

You can add anything here: a `voice-profile.md` for your writing style, exported ChatGPT/Claude conversation history, strategic documents, anything. The more your Jarvis knows about you, the more useful it is.

### people/

One markdown file per person. Name, role, how you met, what you are working on together, interaction history, personal details. Your Jarvis uses these to brief you before meetings, remember commitments, and maintain relationship context you would otherwise forget.

### artifacts/

Your strategic documents. Plans, decision records, principles, status updates, proposals. Date-prefixed: `YYYY-MM-DD-descriptive-slug.md`. These are the outputs of your strategic thinking sessions.

### meeting-transcripts/

Processed meeting notes. Drop a raw transcript (from Granola, Otter, voice memo, or manual notes) and your Jarvis extracts attendees, decisions, action items, and updates the relevant people files.

### .agents/skills/

Skill files are plain-English SOPs for your AI agent. Each one describes a repeatable workflow step by step. Your Jarvis reads them and follows them. You build new skills over time as you discover patterns in your work.

Why `.agents/skills/` and not `.claude/skills/` or `skills/`? Because [Codex auto-discovers `.agents/skills/`](https://developers.openai.com/codex/skills) by default, [Hermes recommends it](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) as the conventional external-skills path, and it does not brand the workspace around any single vendor. A committed `.claude/skills → ../.agents/skills` symlink makes Claude Code auto-discover the same directory (Claude Code hardcodes its discovery path to `.claude/skills/`). The `AGENTS.md` routing table points at `.agents/skills/` paths so any harness that reads AGENTS.md finds the same skills whether or not it does auto-discovery.

## Built-In Skills

Claude Code auto-discovers every skill in `.agents/skills/` as a slash command. You can always invoke a skill explicitly with `/skill-name`, or just say a trigger phrase and the `AGENTS.md` routing will pick the right one.

| Skill | Slash Command | What It Does | Natural Trigger |
|-------|---------------|--------------|-----------------|
| **onboard** | `/onboard` | Full first-session setup: import AI history, build profile, strategic interview | Runs automatically if no `user/USER.md` exists |
| **create-user-profile** | `/create-user-profile` | Interview to build or update your profile | "Create my profile" or "Update my profile" |
| **get-unlocked** | `/get-unlocked` | Strategic interview on whatever would unlock your next level (operationalizes [The Unlock Question](https://supersuit.wiki/concepts/the-unlock-question)) | "Get unlocked" / "Help me think through something" / "I'm stuck" |
| **audit-my-week** | `/audit-my-week` | Pull the last 7 days of git activity, artifacts, and transcripts; reflect against stated priorities; save a weekly retrospective | "Audit my week" / "Weekly review" / "What did I ship" |
| **decongest** | `/decongest` | Extract a single stuck thought, conviction, or sermon idea from your head and turn it into a clean artifact | "Decongest" / "I have something in my head" / "Help me get this out" |
| **process-braindump** | `/process-braindump` | Route a brain dump to the correct files | Paste any unstructured text or voice transcript |
| **prep-for-meeting** | `/prep-for-meeting` | Meeting prep brief from your relationship files | "Prep me for my meeting with Sarah" |
| **process-transcript** | `/process-transcript` | Extract everything from a meeting transcript | "Process this transcript" or paste a transcript |
| **sync-granola** | `/sync-granola` | Pull recent Granola meeting notes into `meeting-transcripts/` (Mac, on demand) | "Sync granola" / "Pull my granola notes" / "Get my recent meetings" |
| **create-skill** | `/create-skill` | Interview you to create a new skill file | "Create a skill for X" or "I want a workflow for X" |
| **sync-with-upstream** | `/sync-with-upstream` | Pull the latest template updates (new skills, scripts, README) without touching your personal files | "Sync with upstream" or "Pull template updates" |

**Harness notes:**
- **Claude Code** auto-discovers these via the committed `.claude/skills` symlink and exposes them as first-class `/slash-commands`. Zero config.
- **Codex** reads `.agents/skills/` and follows `AGENTS.md` routing, but it does not have a first-class `/slash-command` menu like Claude Code. Invoke skills with natural language ("help me think through this", "audit my week") or by explicit instruction ("run the get-unlocked skill"). Typing `/get-unlocked` often works because AGENTS.md is in context, but it is not a native command.
- **Hermes** only auto-discovers skills from `~/.hermes/skills/` by default. To get slash-command discovery for workspace skills, add the workspace's `.agents/skills/` path to the `skills.external_dirs` list in `~/.hermes/config.yaml`. Natural-language triggers (via `AGENTS.md` routing) work regardless, even without the config.

## How It Works

**First session:** Your Jarvis runs the onboard skill. It asks you to import any existing AI conversation history (ChatGPT, Claude exports, docs about yourself), synthesizes a profile, then interviews you about the thing that matters most right now. You walk away with `user/USER.md` and an actionable plan in `artifacts/`.

**Every session after:** Open your workspace. Talk to your Jarvis. Brain dump what is on your mind (use voice-to-text for speed). Your Jarvis routes the information to the right files. Over time, your `people/` folder fills with relationship context, your `artifacts/` folder fills with strategic documents, and your Jarvis gets smarter about you and your operation.

**The compound effect:** At 30 days, your Jarvis knows your top 20 relationships, your strategic priorities, and your decision-making patterns. At 90 days, it can brief you before any meeting, draft in your voice, and catch things you would miss. The system does not plateau. It compounds.

## The Philosophy

**The truth in your head is not the truth.** Not operationally. Not for AI. Not for your team. If it only lives in your head, it might as well not exist. It is unsearchable, unshared, and inaccessible to your AI.

**You are the bottleneck.** Not the tools, not the models. Your strategic thinking, your clarity of communication, and your willingness to document what you know. This system helps you get what is inside your head into files that compound.

**Sovereignty matters.** Everything in this system is plain markdown files on your computer. No vendor lock-in. No subscription required to access your own data. If a better AI tool comes out tomorrow, point it at the same folder and keep going.

## Keeping Your Workspace Synced

Once you push your workspace to GitHub, you want it to stay synced automatically so nothing is ever lost and any machine (or collaborator you invite) is up to date. The starter repo ships a `scripts/sync.sh` that commits anything new, rebases against the remote, and pushes, plus one-command installers to run it hourly on whatever OS you are on. Output is appended to `.workspace-sync.log` (git-ignored).

**Mac / Linux:**

```bash
# install
bash scripts/install-sync-cron.sh

# remove later
bash scripts/uninstall-sync-cron.sh
```

Registers a cron entry that runs `scripts/sync.sh` every hour.

**Windows (PowerShell):**

```powershell
# install
powershell -ExecutionPolicy Bypass -File .\scripts\install-sync-task-windows.ps1

# remove later
powershell -ExecutionPolicy Bypass -File .\scripts\uninstall-sync-task-windows.ps1
```

Registers a Task Scheduler task named `WorkspaceSync-<your-workspace>` that runs `scripts/sync.sh` via Git Bash every hour. Requires Git for Windows (which ships `bash.exe`). If you previously installed an earlier version of this template, the installer also removes any legacy `JarvisSync-<your-workspace>` task so you do not end up with both.

Prerequisites for either OS: `gh auth login` must be complete so pushes work without prompting.

## Harness Compatibility

This workspace works with any AI harness that can read files:

- **Claude Code** (reads `CLAUDE.md` automatically)
- **Hermes** (reads `AGENTS.md`)
- **Codex** (reads `AGENTS.md`)
- **Cursor, OpenCode, Aider** (point them at the workspace)

The `CLAUDE.md` file points to `AGENTS.md`, which contains the full operating instructions. Any harness that reads either file gets the same behavior.

## Full Tutorial

For the complete walkthrough with installation help, conceptual framing, and exercises:

**[The Supersuit Up Workshop](https://supersuit.wiki/paos/supersuit-up-workshop)** on supersuit.wiki.

## Reference

- **[supersuit.wiki](https://supersuit.wiki)**: canonical concepts, use cases, tool setups, playbooks, the full workshop, and the glossary

## Contributing

This is an open-source starter repo. If you build a skill that others could use, submit a PR. If you find a bug or have a suggestion, open an issue. The system gets better when people share what they learn.

## License

MIT
