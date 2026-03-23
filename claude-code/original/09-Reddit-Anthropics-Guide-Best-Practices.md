# Anthropic's Guide to Claude Code: Best Practices for Agentic Coding

**Source:** https://www.reddit.com/r/ClaudeAI/comments/1k5slll/anthropics_guide_to_claude_code_best_practices/
**Author:** u/mariusvoila
**Subreddit:** r/ClaudeAI

---

## Post Content

Just came across this great post via [Alex Albert's tweet](https://x.com/alexalbert__/status/1914333320877584397) and thought folks here would appreciate it:

[Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)

They go into stuff like:

- Setting up a CLAUDE.md to guide Claude's behavior within your repo
- How Claude uses your codebase + CLAUDE.md to reason about your project
- Creating tool-using agents (e.g., Claude that can call functions or APIs)
- Examples of successful prompt formats for bug fixes, refactoring, feature building, etc.
- Debugging and iterating with Claude Code over multiple turns

### TL;DR

Anthropic recommends structuring your repo to make Claude "agentic" -- i.e., act more like an intelligent assistant who understands your goals, tools, and context. A lot of the power comes from writing a clear, detailed CLAUDE.md that explains what your code does and how Claude should help. The blog post includes real-world examples and prompt templates that work well.

---

## Top Comments

### u/ottomaniacc (score: 22)

I tested claude code against my mid sized project. Just initializing it cost $0.7. Then asked it to do the task that I created with task-master, and it was $1.3.

So, no thank you. I will use my claude sub with claude desktop and MCPs.

> **u/pandavr** (score: 7): Most underrated comment ever.

### u/Lilo_n_Ivy (score: 16)

You mean the same Claude that doesn't review the GitHub files synched in Project Knowledge even when I explicitly state in my prompt to review the files in GitHub before responding? I'm supposed to believe that same Claude is going to actually review a file in GitHub just because it has its name on it? Oookkkaaaayyyy

> **u/cheffromspace** (score: 10): Claude Code has special sauce. I don't have these issues. That, or you're doing something wrong.

> **u/mariusvoila** (score: 7): I don't mean to question your experience, but I've personally never encountered issues like this with the GitHub integration. The worst I experienced was with very large repositories, where some files would exceed the context window, but otherwise, it worked smoothly for me.

> **u/MrBuyNowPayLater** (score: 3): I experience this too - almost daily. Sometimes Claude follows the prompt instructions to reference the project knowledge or attached file, sometimes it doesn't. The struggle is real.

> **u/pandavr** (score: 1): KB is not completely added to your prompt. For that reason some instances seems to follow KB while other not. Instead if you tell claude to read a file. The content will be part of the chat and took into account. Also how you write things matter.

### u/cheffromspace (score: 2)

They've got /review commands to review a PR in GitHub, and I don't know how long they've had the --print flag, but it makes Claude Code much more scriptable! I was testing my MCP server having Claude run through a test script, found some bugs, too. And I knew it was an MCP client but didn't realize you can run it as a server? I've been seeing the release notes and I make a mental note to check on them but I've been sleeping on these new features. They've been doing really good work and shipping fast! This unlocks many things I've been dreaming about.

### u/bloudraak (score: 1)

I use Claude.md with Claude Code. It contains the instructions not to annotate commits with AI.

What I discovered is that Claude Code will often annotate commits with AI, often after the conversation was compacted. So it doesn't always read and follow instructions Claude.md.

### u/lukaszlenart (score: 1)

This is nice reading yet I missed some better example on how do you use "prompt improver" to improve my CLAUDE.md. Can you elaborate a bit more on this? I refer to this section "b. Tune your CLAUDE.md files" and this sentence:

> At Anthropic, we occasionally run CLAUDE.md files through the [prompt improver](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-improver) and often tune instructions (e.g. adding emphasis with "IMPORTANT" or "YOU MUST") to improve adherence.

### u/gsummit18 (score: 3)

There is absolutely no reason to use Claude Code. It's expensive, and you have very little control. Numerous better alternatives.

> **u/Kashasaurus** (score: 10): It is more expensive. But I find it much better than Cursor.
