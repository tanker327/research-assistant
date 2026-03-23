# The Comprehensive Claude Code Guide

> Synthesized from 16 sources including Anthropic's official docs, Boris Cherny (Claude Code creator), Builder.io, DataCamp, community Reddit threads, GitHub repos, and practitioner workflows.

---

## Table of Contents

1. [The One Rule That Governs Everything](#1-the-one-rule-that-governs-everything)
2. [Initial Setup & Environment](#2-initial-setup--environment)
3. [CLAUDE.md -- Your Project Memory](#3-claudemd----your-project-memory)
4. [The Planning Discipline](#4-the-planning-discipline)
5. [Prompting & Communication](#5-prompting--communication)
6. [Context Management](#6-context-management)
7. [Verification -- Give Claude a Feedback Loop](#7-verification----give-claude-a-feedback-loop)
8. [Hooks -- Deterministic Guardrails](#8-hooks----deterministic-guardrails)
9. [Skills -- On-Demand Knowledge](#9-skills----on-demand-knowledge)
10. [Subagents & Agent Teams](#10-subagents--agent-teams)
11. [Session Management & Navigation](#11-session-management--navigation)
12. [Scaling -- Parallel Sessions & Automation](#12-scaling----parallel-sessions--automation)
13. [Debugging Strategies](#13-debugging-strategies)
14. [Cost & Model Selection](#14-cost--model-selection)
15. [Common Failure Patterns & How to Avoid Them](#15-common-failure-patterns--how-to-avoid-them)
16. [The Mindset Shift](#16-the-mindset-shift)
17. [Quick Reference -- Keyboard Shortcuts & Commands](#17-quick-reference----keyboard-shortcuts--commands)
18. [Recommended Open-Source Frameworks](#18-recommended-open-source-frameworks)

---

## 1. The One Rule That Governs Everything

**Claude's context window fills up fast, and performance degrades as it fills.**

Everything in this guide flows from this constraint. The context window holds your entire conversation -- every message, every file Claude reads, every command output. A fresh session burns ~20K tokens just loading the system prompt, tool definitions, and CLAUDE.md before you've typed anything.

Multiple practitioners have independently converged on the same threshold: **don't let context exceed 60% capacity.** Claude's output starts degrading at 20-40% of the window. Auto-compaction fires at ~83.5% and is lossy -- one developer lost 3 hours of refactoring work when it erased migration decisions mid-session.

The context window is the most important resource to manage. Every best practice below is ultimately about keeping your context clean, focused, and efficient.

---

## 2. Initial Setup & Environment

### Terminal Aliases

Set up shortcuts in `~/.zshrc` or `~/.bashrc`:

```bash
alias c='claude'
alias cc='claude --dangerously-skip-permissions'  # Only in sandboxed environments
alias ch='claude --chrome'
```

Run `source ~/.zshrc` to load. Use `c -c` to continue your last conversation, `c -r` to pick from recent sessions.

### Install the `gh` CLI

The GitHub CLI is the most context-efficient way to interact with GitHub. Claude knows how to use it for PRs, issues, and comments. Without it, unauthenticated API requests hit rate limits.

```bash
brew install gh
gh auth login
```

### Install a Code Intelligence Plugin

LSP plugins give Claude automatic diagnostics after every file edit -- type errors, unused imports, missing return types. **This is the single highest-impact plugin you can install.**

```
/plugin install typescript-lsp@claude-plugins-official
/plugin install pyright-lsp@claude-plugins-official
/plugin install rust-analyzer-lsp@claude-plugins-official
/plugin install gopls-lsp@claude-plugins-official
```

### Set Up a Status Line

The status line shows live info at the bottom of your terminal: current directory, git branch, context usage color-coded by fullness.

```
/statusline
```

Claude will ask what you want to display and generate the script. Track context usage continuously -- it's your most critical metric.

### Configure Permissions

Stop clicking "approve" on `npm run lint` for the hundredth time:

```
/permissions
```

Allowlist trusted commands. Alternatively, use `/sandbox` for OS-level isolation (Seatbelt on macOS, bubblewrap on Linux). In auto-allow mode, sandboxed commands run without prompts.

For unsupervised work (overnight migrations, experimental refactors), run Claude in a Docker container for full isolation and easy rollback.

### Connect MCP Servers

```bash
claude mcp add <server-name>
```

**Worth starting with:** Playwright (browser testing/UI verification), PostgreSQL/MySQL (schema queries), Slack (bug reports), Figma (design-to-code). Limit to 5-8 servers -- each adds tool schemas that permanently consume context.

---

## 3. CLAUDE.md -- Your Project Memory

### What It Is

CLAUDE.md is a special file Claude reads at the start of every conversation. It gives Claude persistent context it can't infer from code alone: build commands, code style, workflow rules, architectural decisions.

### Generate a Starter File

```
/init
```

This analyzes your codebase to detect build systems, test frameworks, and code patterns. **Then cut the result in half.** The output tends to be bloated.

### The Instruction Budget

Claude Code's system prompt already uses ~50 of the roughly 150-200 instructions frontier models follow before compliance drops. That leaves **~100-150 slots for your rules.** HumanLayer keeps theirs under 60 lines.

### The Litmus Test for Every Line

> "Would removing this cause Claude to make mistakes?"

If Claude already does something correctly without the instruction, it's noise. Every unnecessary line dilutes the ones that matter.

### What to Include vs. Exclude

| Include | Exclude |
|---|---|
| Bash commands Claude can't guess | Anything Claude can figure out by reading code |
| Code style rules that differ from defaults | Standard language conventions |
| Testing instructions and preferred runners | Detailed API docs (link instead) |
| Branch naming, PR conventions | Information that changes frequently |
| Architectural decisions specific to your project | Long explanations or tutorials |
| Dev environment quirks (required env vars) | File-by-file codebase descriptions |
| Common gotchas or non-obvious behaviors | Self-evident practices like "write clean code" |

### Example Structure

```markdown
# Code Style
- Use ES modules (import/export), not CommonJS (require)
- Destructure imports when possible

# Workflow
- Typecheck when done making a series of code changes
- Prefer running single tests, not the whole suite

# Build & Test
- Dev: npm run dev
- Test: pytest -x --tb=short
- Lint: npm run lint
```

### Hierarchical CLAUDE.md Files

Place files at multiple levels:

- **`~/.claude/CLAUDE.md`** -- applies to all sessions (personal preferences)
- **`./CLAUDE.md`** -- project root, check into git for team sharing
- **`./src/api/CLAUDE.md`** -- subdirectory, loaded only when Claude works in that area
- **Parent directories** -- useful for monorepos

Claude automatically loads CLAUDE.md files from the working directory upward to the project root.

### Use @imports for Progressive Disclosure

Keep your root CLAUDE.md lean. Reference domain-specific docs without inlining them:

```markdown
See @README.md for project overview and @package.json for npm commands.

# Additional Context
- Git workflow: @docs/git-instructions.md
- Payment system: @docs/payment-architecture.md
```

Claude reads the referenced file only when it enters that part of the codebase.

**Warning:** Don't `@`-import large files directly into CLAUDE.md. This embeds the entire file on every run, eating your instruction budget before the conversation starts.

### Use `.claude/rules/` for Conditional Rules

Split instructions that only apply to certain file types:

```markdown
---
paths:
  - "**/*.ts"
---
Prefer interfaces over types.
```

TypeScript rules load when Claude reads `.ts` files. Go rules when it reads `.go` files.

### Evolving CLAUDE.md Over Time

- **After mistakes:** "Update CLAUDE.md so this doesn't happen again." Claude writes its own rule.
- **Check into git** so your team can contribute. The file compounds in value over time.
- **Periodically prune:** Ask Claude to "review and compact the CLAUDE.md, preserving all critical information."
- **Emphasis works:** Add "IMPORTANT" or "YOU MUST" to improve adherence on critical rules.
- **Agent proposes, human reviews:** constraint-rule additions weekly -- agents encode specific failures, not general principles.

### Static Rules vs. Dynamic Context

```
CLAUDE.md = static rules you write once
Session memory = dynamic context that changes per conversation
```

Keep these separate. If Claude keeps bloating your CLAUDE.md with session learnings, split stable rules into `.claude/rules/` and let CLAUDE.md be the scratch surface you periodically prune.

---

## 4. The Planning Discipline

### Why Planning Matters

Every decision Claude makes without guidance might be 80% accurate -- fine for one decision, but across 20 decisions in a feature, you get 0.8^20 = ~1% chance of everything being correct. Planning collapses ambiguous decisions into reviewed specifications.

Anthropic's own team found that unguided attempts succeed about 33% of the time, and the tool's creator abandons 10-20% of sessions.

### The Four-Phase Workflow

**Phase 1: Explore** -- Enter Plan Mode (`Shift+Tab` twice). Claude reads files and answers questions without making changes.

```
Read /src/auth and understand how we handle sessions and login.
Also look at how we manage environment variables for secrets.
```

**Phase 2: Plan** -- Ask Claude to create a detailed implementation plan.

```
I want to add Google OAuth. What files need to change?
What's the session flow? Create a plan.
```

Press `Ctrl+G` to open the plan in your text editor for direct editing before Claude proceeds.

**Phase 3: Implement** -- Switch to Normal Mode (`Shift+Tab`) and let Claude code.

```
Implement the OAuth flow from your plan. Write tests for the
callback handler, run the test suite and fix any failures.
```

**Phase 4: Commit** -- Ask Claude to commit and create a PR.

```
Commit with a descriptive message and open a PR.
```

### The Annotation Cycle (For Larger Features)

1. Have Claude draft a `plan.md`
2. Open in your editor, add inline notes: `> NOTE: use drizzle:generate, not raw SQL`
3. Send back with: **"address all notes, don't implement yet"** (the guard phrase matters -- without it, Claude starts coding)
4. Repeat until no ambiguity remains
5. Implement

### The Spec, To-Do, Code Process

For each milestone:

1. **Spec** -- `spec.md` with requirements, tech stack, design guidelines, and up to 3 milestones
2. **To-Do** -- `todo.md` with tasks for the current milestone (audit carefully)
3. **Code** -- Only then let Claude start coding

> "If you just remember one thing, it's to follow the spec, to-do, and code process."
> -- Peter Yang

### The Interview Pattern

For larger features where you can't fully spec upfront:

```
I want to build [brief description]. Interview me in detail
using the AskUserQuestion tool.

Ask about technical implementation, UI/UX, edge cases,
concerns, and tradeoffs. Don't ask obvious questions,
dig into the hard parts I might not have considered.

Keep interviewing until we've covered everything,
then write a complete spec to SPEC.md.
```

Once the spec is complete, **start a fresh session** to execute it. Clean context + complete spec = best results.

### When to Skip Planning

If you can describe the diff in one sentence, skip the plan. Planning adds overhead. Use it when:
- You're uncertain about the approach
- The change modifies multiple files
- You're unfamiliar with the code being modified

---

## 5. Prompting & Communication

### Be Specific

| Strategy | Bad | Good |
|---|---|---|
| **Scope the task** | "add tests for foo.py" | "write a test for foo.py covering the edge case where the user is logged out. avoid mocks." |
| **Point to sources** | "why does ExecutionFactory have a weird API?" | "look through ExecutionFactory's git history and summarize how its API came to be" |
| **Reference patterns** | "add a calendar widget" | "look at how existing widgets are implemented. HotDogWidget.php is a good example. follow the pattern." |
| **Describe symptoms** | "fix the login bug" | "users report login fails after session timeout. check src/auth/, especially token refresh. write a failing test, then fix it." |

### Provide Rich Content

- **`@` to reference files** -- `@src/auth/middleware.ts` resolves automatically
- **Paste images directly** -- copy/paste or drag-and-drop screenshots, designs
- **Pipe data in** -- `cat error.log | claude "explain this error"`
- **Give URLs** -- Use `/permissions` to allowlist frequently-used documentation domains
- **Paste raw data, not interpretations** -- Your bug description adds abstraction that loses detail. Paste the error log, CI output, or stack trace directly and say "fix."

### Thinking Levels

Use keywords to control reasoning depth:

| Keyword | When to Use |
|---|---|
| "think" | Straightforward feature additions or bug fixes |
| "think hard" | Complex business logic, architectural decisions |
| "think harder" | Performance optimization, security-sensitive code |
| **"ultrathink"** | Architecture decisions, tricky debugging, multi-step reasoning |

Don't throw "ultrathink" at everything -- you pay in both time and tokens. Match effort to the problem. Use `/effort` to set a default level.

### Use Voice Input

Run `/voice` for built-in push-to-talk (hold `Space`). Spoken prompts naturally include more context because you explain background without cutting corners to save keystrokes. External tools like SuperWhisper or Monologue also work well.

### Explicit Over Implicit

Don't hope the AI will do what you want -- tell it explicitly. If you know you want it to use a specific agent or look up specific docs, say so. There's no downside to being explicit about something the AI might have done anyway.

### Power Prompts From Boris Cherny

- **Challenge Claude:** "Grill me on these changes and don't make a PR until I pass your test."
- **After a mediocre fix:** "Knowing everything you know now, scrap this and implement the elegant solution."
- **For bugs:** Paste the bug, say "fix." Don't micromanage how.

---

## 6. Context Management

### The Document & Clear Pattern

The best defense against context rot:

1. Dump your current plan and progress to a markdown file (or ask Claude to write a handoff doc)
2. Run `/clear` to reset the session
3. Start fresh with Claude reading that file

This gives you a full context window with only what you choose to preserve. Better than `/compact` because you control exactly what survives.

### Handoff Documents

Before clearing:

```
Put the current state in HANDOFF.md. Explain what you tried,
what worked, what didn't, so the next agent with fresh context
can load that file and continue.
```

### Commands for Context Control

| Command | What It Does |
|---|---|
| **`/clear`** | Completely resets context. Use between unrelated tasks. |
| **`/compact <instructions>`** | Summarizes conversation, preserving what you specify. E.g., `/compact Focus on API changes` |
| **`/btw`** | Quick side question in dismissible overlay -- never enters conversation history |
| **`Esc+Esc`** → **Summarize from here** | Condenses messages from a checkpoint forward while keeping earlier context |

### Compaction Best Practices

- Add standing instructions to CLAUDE.md: "When compacting, preserve the full list of modified files and current test status."
- Manually compact at ~50% context. Don't wait for auto-compaction at 83.5%.
- One task per conversation. Starting fresh costs 20K tokens -- nothing compared to quality loss from a polluted session.

### The `/catchup` Skill

After clearing, rebuild context from your git branch:

```markdown
<!-- .claude/commands/catchup.md -->
Rebuild context after a /clear. Read all files modified on the
current branch compared to main. Summarize what's been
implemented and what work remains.

Changed files on this branch:
$ git diff --name-only main
```

---

## 7. Verification -- Give Claude a Feedback Loop

> **This is the single highest-leverage thing you can do.** Boris Cherny says it alone gives a 2-3x quality improvement.

Without verification, Claude produces plausible-looking code that might not work. You become the only feedback loop.

### Types of Verification

| Type | How |
|---|---|
| **Tests** | "Write tests first, confirm they fail, then implement until green. Do NOT modify the tests." |
| **Linting** | "Run the linter after changes and fix any issues." |
| **Build verification** | "Run the build and verify it succeeds." |
| **Visual/UI** | Set up Playwright MCP or Claude Chrome extension. Claude screenshots the result and compares to the original. |
| **Bash commands** | Any command that checks output can be a verification step. |

### Test-Driven Development (TDD)

TDD is the single strongest pattern for agentic coding:

```
1. Write tests first
   > "Write tests for the auth module using pytest. TDD approach, no mocks."

2. Confirm tests fail
   > "Run the tests. They should all fail."

3. Commit the failing tests as a checkpoint

4. Implement until green
   > "Write the implementation. Do NOT modify the tests.
      Keep going until all tests pass."
```

Committing tests beforehand is critical -- Claude will sometimes change tests to make them pass rather than fixing the implementation. The diff shows exactly what changed.

### Verification for UI Changes

```
[paste screenshot] Implement this design. Take a screenshot
of the result and compare it to the original.
List differences and fix them.
```

---

## 8. Hooks -- Deterministic Guardrails

CLAUDE.md is advisory (~70-80% compliance). **Hooks are deterministic -- 100%.** If something must happen every time with zero exceptions, make it a hook.

### Types of Hooks

- **PreToolUse** -- Runs before Claude executes a tool. Exit code 2 blocks the action.
- **PostToolUse** -- Runs after a tool. Non-blocking feedback (linting, formatting).
- **Stop** -- Runs when Claude finishes a response.
- **Notification** -- Runs on events like compaction.

### Essential Hook Recipes

**Auto-format after every edit:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

**Block destructive commands:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "type": "command",
        "command": "if echo \"$TOOL_INPUT\" | grep -qE 'rm -rf|drop table|truncate'; then echo 'BLOCKED: destructive command' >&2; exit 2; fi"
      }
    ]
  }
}
```

**Play a sound when Claude finishes:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

**Re-inject context after compaction:**

Set up a Notification hook with a `compact` matcher that reminds Claude of the current task, modified files, and constraints after every compaction event.

### Hook Tips

- Never block Edit or Write tools mid-plan -- it breaks multi-step reasoning. Validate through PostToolUse hooks instead.
- You can ask Claude to write hooks: "Write a hook that runs eslint after every file edit."
- Run `/hooks` to browse what's configured.
- Configure in `.claude/settings.json`.

---

## 9. Skills -- On-Demand Knowledge

Unlike CLAUDE.md which loads every session, skills load only when relevant. This keeps context lean.

### Creating Skills

Add a directory with a `SKILL.md` to `.claude/skills/`:

```markdown
# .claude/skills/api-conventions/SKILL.md
---
name: api-conventions
description: REST API design conventions for our services
---
# API Conventions
- Use kebab-case for URL paths
- Use camelCase for JSON properties
- Always include pagination for list endpoints
```

### Invokable Workflow Skills

```markdown
# .claude/skills/fix-issue/SKILL.md
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---
Analyze and fix the GitHub issue: $ARGUMENTS.

1. Use `gh issue view` to get issue details
2. Search codebase for relevant files
3. Implement changes
4. Write and run tests
5. Create a descriptive commit
6. Push and create a PR
```

Run with `/fix-issue 1234`. Use `disable-model-invocation: true` for workflows with side effects you want to trigger manually.

### Skill Best Practices (From Anthropic Engineers)

- **Skills are folders, not files** -- use `references/`, `scripts/`, `examples/` subdirectories for progressive disclosure
- **Build a Gotchas section** in every skill -- highest-signal content, add Claude's failure points over time
- **The description field is a trigger, not a summary** -- write it for the model ("when should I fire?")
- **Don't state the obvious** -- focus on what pushes Claude out of its default behavior
- **Don't railroad Claude** -- give goals and constraints, not prescriptive step-by-step instructions
- **Include scripts and libraries** so Claude composes rather than reconstructs boilerplate
- **Use `context: fork`** to run a skill in an isolated subagent -- main context only sees the final result
- Make skills narrow and one-job. Broad catch-all skills feel sloppy. Scoped skills keep Claude on track.

---

## 10. Subagents & Agent Teams

### Why Subagents Matter

Context is your fundamental constraint. When Claude researches a codebase, it reads lots of files -- all consuming your context. Subagents run in separate context windows and report back summaries.

```
Use subagents to investigate how our authentication system
handles token refresh, and whether we have any existing
OAuth utilities I should reuse.
```

### Custom Subagents

Define specialized agents in `.claude/agents/`:

```markdown
# .claude/agents/security-reviewer.md
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Secrets or credentials in code
- Insecure data handling

Provide specific line references and suggested fixes.
```

### Use Cases for Subagents

- **Investigation:** "Use subagents to figure out how the payment flow handles failed transactions"
- **Verification:** "Use a subagent to review this code for edge cases"
- **Code simplification:** Run after Claude finishes to clean up
- **Test time compute:** Separate context windows make results better -- one agent writes code, another finds bugs

### Agent Teams (Experimental)

Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`. Tell Claude to create a team:

```
Create an agent team with 3 teammates to refactor these modules in parallel.
```

A team lead distributes work. Each teammate gets its own context window and shared task list. Start with 3-5 teammates and 5-6 tasks per teammate. **Avoid assigning tasks that modify the same files** -- two teammates editing the same file leads to overwrites.

### The Writer/Reviewer Pattern

| Session A (Writer) | Session B (Reviewer) |
|---|---|
| Implement a rate limiter for our API endpoints | |
| | Review the rate limiter in @src/middleware/rateLimiter.ts. Look for edge cases, race conditions. |
| Here's the review feedback: [Session B output]. Address these issues. | |

A fresh context improves review quality -- Claude won't be biased toward code it just wrote.

---

## 11. Session Management & Navigation

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| **`Esc`** | Stop Claude mid-action (context preserved) |
| **`Esc+Esc`** or **`/rewind`** | Open checkpoint menu (restore code, conversation, or both) |
| **`Shift+Tab`** | Cycle between Normal, Auto-Accept, and Plan modes |
| **`Ctrl+G`** | Open plan in your text editor for editing |
| **`Ctrl+S`** | Stash your draft prompt (type a quick question, draft restores after) |
| **`Ctrl+B`** | Background a long-running bash command |
| **`!command`** | Run bash command inline (output lands in context) |

### Session Persistence

```bash
claude --continue    # Resume most recent conversation
claude --resume      # Pick from recent conversations
```

Use `/rename oauth-migration` to label sessions. `/color red` to color-code them. When running 2-3 parallel sessions, this saves you from typing into the wrong terminal.

### Branching Conversations

`/branch` (or `/fork`) creates a copy of your conversation. Try the risky refactor in the branch. If it works, keep it. If not, your original is untouched.

### Checkpoints

Every Claude action creates a checkpoint. Double-tap `Escape` or `/rewind` to restore. Options: restore code and conversation, conversation only, code only, or summarize from a checkpoint.

Checkpoints persist across sessions. They only track file edits by Claude -- not external processes. Not a replacement for git.

### Remote Control

```
claude remote-control
```

Connect from claude.ai/code or the Claude iOS/Android app. Monitor and approve from your phone.

---

## 12. Scaling -- Parallel Sessions & Automation

### Git Worktrees

```bash
claude --worktree feature-auth
```

Creates an isolated working copy with a new branch. The Claude Code team calls this one of the biggest productivity unlocks. Spin up 2-5 worktrees, each with its own session, branch, and file system state.

### Non-Interactive Mode

```bash
# One-off queries
claude -p "Explain what this project does"

# Structured output for scripts
claude -p "List all API endpoints" --output-format json

# Streaming for real-time processing
claude -p "Analyze this log file" --output-format stream-json
```

### Fan-Out Across Files

For large migrations:

```bash
# Step 1: Generate task list
claude -p "List all Python files that need migrating" > files.txt

# Step 2: Process in parallel
for file in $(cat files.txt); do
  claude -p "Migrate $file from class components to hooks" \
    --allowedTools "Edit,Bash(git commit *)" &
done
wait
```

Test on 2-3 files first, refine the prompt, then run at scale.

### The `/loop` Command

```
/loop 5m check if the deploy succeeded and report back
```

Schedules a recurring prompt. Supports `s`, `m`, `h`, `d` units. Tasks are session-scoped and expire after 3 days.

---

## 13. Debugging Strategies

### The Debugging Workflow

1. **Paste raw data** -- error logs, CI output, stack traces. Don't interpret; let Claude see the original.
2. **Use "think ultra hard"** -- activates extended thinking for complex problems.
3. **Ask "Why do you think this happened?"** -- forces root-cause analysis instead of symptom patching.
4. **Give specific feedback** -- screenshots, console logs, expected vs. actual behavior.
5. **Verify Claude actually implemented what it claimed** -- Claude sometimes checks off to-do items without doing the work.

### The Recovery Prompt

```
Something broke. Here's what happened:

Error: [paste the error message]
What I was trying to do: [describe the task]
What was working before: [describe what worked]

Fix this specific error without changing anything else
that's currently working. Explain what went wrong
before making changes.
```

### Git Bisect With Claude

For finding which commit broke something, Claude can run `git bisect` autonomously -- but it needs a test script to verify each commit. Use tmux to test interactive applications.

---

## 14. Cost & Model Selection

### Pricing Overview

| Plan | Monthly Cost | Best For |
|---|---|---|
| API (Sonnet 4.6) | ~$100-200 | Light usage, under 30 min/day |
| API (Opus 4.6) | ~$300-800 | Complex multi-file work |
| Max ($100/mo) | $100 flat | Daily users |
| Max ($200/mo) | $200 flat | Power users, 5+ hours/day |

One developer tracked 8 months of usage (~10B tokens) and found API-equivalent cost exceeded $15,000 while Max subscription was ~$800: **93% savings.** Breakeven for Max is ~$100-200/month in API-equivalent usage.

### Model Selection

- **Boris Cherny uses Opus for everything** -- "even though it's bigger and slower, since you have to steer it less, it's almost always faster."
- **"opusplan" mode** routes Opus for planning and Sonnet for code generation -- Opus-quality reasoning where it matters, Sonnet's cheaper rates for implementation.
- **Sonnet 4.6** was preferred over Opus 4.5 by 59% of Claude Code users and tends to produce cleaner code with less over-engineering.
- **1M token context** available on Max/Team/Enterprise plans: `/model opus[1m]` or `/model sonnet[1m]`

### Three Biggest Token Wastes

1. Not clearing context between tasks
2. Redundant file reads from poor CLAUDE.md structure
3. Vague prompts that send Claude into trial-and-error loops

Fixing just these three typically cuts token usage in half.

---

## 15. Common Failure Patterns & How to Avoid Them

### The Kitchen Sink Session

You start with one task, ask something unrelated, go back to the first task. Context is full of irrelevant information.

> **Fix:** `/clear` between unrelated tasks.

### Correcting Over and Over

Claude does something wrong, you correct it, still wrong, correct again. Context is polluted with failed approaches.

> **Fix:** After two failed corrections, `/clear` and write a better initial prompt incorporating what you learned.

### The Over-Specified CLAUDE.md

Too long, Claude ignores half of it because important rules get lost in noise.

> **Fix:** Ruthlessly prune. If Claude does something correctly without the instruction, delete it or convert it to a hook.

### The Trust-Then-Verify Gap

Plausible-looking implementation that doesn't handle edge cases.

> **Fix:** Always provide verification. If you can't verify it, don't ship it.

### The Infinite Exploration

You ask Claude to "investigate" without scoping it. Claude reads hundreds of files, filling context.

> **Fix:** Scope investigations narrowly or use subagents.

### Over-Engineering

Claude writes extra abstractions, unsolicited helper functions, premature refactoring.

> **Fix:** Add "use the simplest possible approach" to your CLAUDE.md.

### Context Loss During Long Sessions

Auto-compaction erases decisions mid-session.

> **Fix:** Use the Document & Clear pattern. Never let a long session be your only record.

### Hallucinations With Niche Technologies

Claude generates confident, plausible-looking code for technologies it doesn't know well.

> **Fix:** If you can't personally verify the output, every result needs extra scrutiny. "I've got myself in a PILE of trouble using LLMs with technologies I am unfamiliar with."

---

## 16. The Mindset Shift

### Think Junior Developer, Not Magic Tool

Claude is like an incredibly fast junior developer who needs good direction. The best results come from:

- **Reviewing every plan before execution**
- **Course-correcting actively** rather than letting Claude go down rabbit holes
- **Breaking complex changes into smaller steps** that can be verified independently
- **Using the Escape key liberally** to interrupt when things go off track

### You're Still Allowed to Write Code

Trivial changes (adjusting a margin from 0.5rem to 1rem) don't need AI. Just do it yourself and save tokens. Always understand the codebase. Don't hand off too much and lose touch with the code.

### Always Review Auth, Payments, and Data Mutations

These decisions need a human regardless of how good everything else looks. A wrong auth scope, misconfigured payment webhook, or migration that drops a column can cost users, money, or trust.

### Design Systems, Not Isolated Prompts

Claude Code works best when you design small systems around it:
- CLAUDE.md for persistent context
- Skills for domain knowledge
- Hooks for enforcement
- Subagents for isolated tasks
- Plans for complex features

### Develop Your Intuition

Pay attention to what works. Notice the prompt structure, context, and mode when Claude produces great output. When it struggles, ask why: context too noisy? Prompt too vague? Task too big?

Over time, you'll know when to be specific and when to be open-ended, when to plan and when to explore, when to clear context and when to let it accumulate.

---

## 17. Quick Reference -- Keyboard Shortcuts & Commands

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Esc` | Stop Claude mid-action |
| `Esc+Esc` | Open rewind/checkpoint menu |
| `Shift+Tab` | Cycle permission modes (Normal / Auto-Accept / Plan) |
| `Ctrl+G` | Edit plan in external editor |
| `Ctrl+S` | Stash current draft prompt |
| `Ctrl+B` | Background long-running command |
| `Space` (in voice mode) | Push-to-talk |

### Slash Commands

| Command | Action |
|---|---|
| `/init` | Generate starter CLAUDE.md |
| `/clear` | Reset context completely |
| `/compact <focus>` | Summarize context with optional focus |
| `/btw` | Quick side question (no context impact) |
| `/rewind` | Open checkpoint menu |
| `/rename <name>` | Name current session |
| `/color <color>` | Color-code session (red, blue, green, yellow, purple, orange, pink, cyan) |
| `/branch` or `/fork` | Branch conversation |
| `/voice` | Enable voice dictation |
| `/permissions` | Configure permission allowlists |
| `/sandbox` | Enable OS-level isolation |
| `/hooks` | Browse configured hooks |
| `/plugin` | Browse plugin marketplace |
| `/model <model>` | Switch model mid-session |
| `/effort` | Set thinking effort level |
| `/usage` | Check rate limits |
| `/stats` | View usage statistics |
| `/copy` | Copy last response to clipboard |
| `/loop <interval> <prompt>` | Schedule recurring prompt |
| `/statusline` | Configure status bar |
| `/config` | Open configuration |
| `/output-style <style>` | Set output style (explanatory, concise, technical) |

### CLI Flags

| Flag | Action |
|---|---|
| `claude --continue` / `-c` | Resume most recent conversation |
| `claude --resume` / `-r` | Pick from recent sessions |
| `claude --worktree <name>` | Create isolated worktree branch |
| `claude -p "prompt"` | Non-interactive mode |
| `--output-format json` | JSON output |
| `--output-format stream-json` | Streaming JSON |
| `--allowedTools "Edit,Bash(...)"` | Restrict tools for batch ops |
| `--dangerously-skip-permissions` | Skip all prompts (sandbox only!) |
| `--verbose` | Debug output |

---

## 18. Recommended Open-Source Frameworks

| Framework | Stars | Key Feature |
|---|---|---|
| [**Superpowers**](https://github.com/obra/superpowers) | 103k | TDD-first, Iron Laws, whole-plan review. Official Anthropic marketplace plugin. |
| [**Everything Claude Code**](https://github.com/affaan-m/everything-claude-code) | 93k | Instinct scoring, AgentShield, multi-language rules. 28 agents, 116 skills. |
| [**Spec Kit**](https://github.com/github/spec-kit) | 79k | GitHub's official Spec-Driven Development toolkit. Constitution -> Specify -> Plan -> Tasks. |
| [**BMAD-METHOD**](https://github.com/bmad-code-org/BMAD-METHOD) | 42k | Full agile SDLC with 12+ agent personas and 34+ workflows. |
| [**Get Shit Done**](https://github.com/gsd-build/get-shit-done) | 38k | Fresh 200K contexts, wave execution, XML plans. |
| [**awesome-claude-code**](https://github.com/anthropics/awesome-claude-code) | -- | Community directory of skills, hooks, commands, agents, and plugins. Start here. |

---

## Sources

1. Anthropic -- Claude Code Best Practices (official blog)
2. Claude Code Official Docs -- Best Practices
3. Builder.io -- 50 Claude Code Tips (Vishwas Gopinath)
4. DataCamp -- Claude Code Best Practices (Bex Tuychiev)
5. Medium -- Mastering the Vibe (Dinanjana Gunaratne)
6. Creator Economy -- 20 Tips to Master Claude Code (Peter Yang)
7. GitHub -- shanraisshan/claude-code-best-practice
8. GitHub -- ykdojo/claude-code-tips (45 tips)
9. Reddit r/ClaudeAI -- Anthropic's Guide discussion
10. Reddit r/ClaudeCode -- CLAUDE.md Best Practices
11. Reddit r/ClaudeCode -- CLAUDE.md Tips (u/mrothro)
12. Reddit r/ClaudeAI -- How I Structure Claude Code Projects
13. X -- @arceyul Claude Code Tutorial
14. X -- @godofprompt Vibe Coding Project Planner
15. X -- @bcherny How I Use Claude Code (Boris Cherny, creator)
16. YouTube -- Academind Top 6 Tips for Claude Code
