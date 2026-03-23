# How I Structure Claude Code Projects (CLAUDE.md, Skills, MCP)

**Source:** https://www.reddit.com/r/ClaudeAI/comments/1r66oo0/how_i_structure_claude_code_projects_claudemd/
**Author:** u/SilverConsistent9222
**Subreddit:** r/ClaudeAI

---

## Post Content

I've been using Claude Code more seriously over the past months, and a few workflow shifts made a big difference for me.

**The first one was starting in plan mode instead of execution.**

When I write the goal clearly and let Claude break it into steps first, I catch gaps early. Reviewing the plan before running anything saves time. It feels slower for a minute, but the end result is cleaner and needs fewer edits.

**Another big improvement came from using a CLAUDE.md file properly.**

Treat it as a long-term project memory. Include:

- Project structure
- Coding style preferences
- Common commands
- Naming conventions
- Constraints

Once this file is solid, you stop repeating context. Outputs become more consistent across sessions.

**Skills are also powerful if you work on recurring tasks.**

If you often ask Claude to:

- Format output in a specific way
- Review code with certain rules
- Summarize data using a fixed structure

You can package that logic once and reuse it. That removes friction and keeps quality stable.

**MCP is another layer worth exploring.**

Connecting Claude to tools like GitHub, Notion, or even local CLI scripts changes how you think about it. Instead of copying data back and forth, you operate across tools directly from the terminal. That's when automation starts to feel practical.

**For me, the biggest mindset shift was this:**

Claude Code works best when you design small systems around it, not isolated prompts.

I'm curious how others here are structuring their setup.

- Are you using project memory heavily?
- Are you building reusable Skills?
- Or mostly running one-off tasks?

---

## Top Comments

### u/JuniorCustard4931 (score: 19)

I went pretty deep on this, too. My setup for a personal assistant project:

**Memory layer:** Instead of one big CLAUDE.md, I split into `.claude/rules/memory-*.md` files -- profile (facts about me), preferences (how I like things done), decisions (past choices for consistency), and sessions (rolling summary of recent work). Claude Code auto-loads everything in `.claude/rules/` so it's always in context without bloating the main CLAUDE.md.

**Enforcement:** CLAUDE.md has a MANDATORY section telling Claude to update memory files *as it goes*, not at the end. The problem is Claude "forgets" instructions mid-session, so I added a Stop hook that checks if learning-likely files changed and reminds to capture anything new. Belt and suspenders.

**MCP:** Biggest unlock for me was connecting tools that Claude can't reach natively. Browser automation for research, Google Workspace for email/calendar, Reddit for monitoring -- turns Claude Code from a coding tool into an actual assistant.

**The thing most people miss:** CLAUDE.md should be a *routing file*, not a knowledge dump. Keep it under 150 lines. Point to `.claude/rules/*.md` for detailed specs and `docs/` for architecture. Otherwise it gets so long that Claude skims it and misses the important stuff.

> **u/z42b** (score: 3): I would love to see the lines where you tell Claude to update memory files as it goes AND the stop hook you mentioned. Any chance you fancy sharing? I totally agree with you that CLAUDE.md is an awesome routing file ;)

> **u/Proud-Sundae-5018** (score: 2): Hey man, I just wanna know how is your setup for memory different from the beta auto-memory feature in Claude Code that basically keeps updating a MEMORY.md file for each project?

### u/SilverConsistent9222 (score: 12)

Full step-by-step Claude Code walkthrough (CLI, CLAUDE.md, Skills, Hooks, MCP, GitHub workflows): https://youtube.com/playlist?list=PL-F5kYFVRcIvZQ_LEbdLIZrohgbf-Vock&si=EwcH5T7Y3orPTeHw

### u/garywiz (score: 4)

I've done two high complexity large codebase projects so far with Claude. You are right... making sure you have good planning documentation is essential.

I've finally settled on three important files for all projects:

**Claude-README.md** - Contains information about toolsets, working styles, my communication preferences, my skills background (very brief) and warnings about toolchain bugs we need to be wary of. It also points Claude to the other two files. This file is generic. I can move it to any new project.

**Claude-Status.md** - This contains the most recent snapshot of where we are, what we've done, what is left to do, what our end goal is, what our important milestones are, what problems are deferred and the likely "next task" we will work on. It is updated at the end of every session and is highly project specific.

**Architecture.md** - This is a concise but accurate description of the "big picture" of how the app works, what is important, what is not. It establishes a context for WHY we are doing certain things and points out inconsistencies discovered along the way which have bigger picture implications down the road. It describes the modularity goals of the project, and indicates which sections of the app may end up being eventually turned into separate libraries for longer term utility. Having this as a separate document saves context bloat when sessions involve some arcane debugging problem that really doesn't have much to do with the big picture at all.

Only Claude-Status.md is updated at every session. The README is mostly untouched once it reaches a certain point. And, the Architecture document is updated using SEPARATE sessions designed specifically as design and code review sessions.

So far this has worked well. Claude starts out with a rich context and even advises me when code may be going off the rails. I insist Claude keep me informed about changes. My requirement is that I personally MUST understand all the code otherwise I cannot offer any guidance and Claude can start going into the tall grasses coding on top of questionable code until (in the past) we've tended toward slop. That no longer happens.

Everybody's style is different I guess. But one takeaway here is that you have to start sessions with "rich context" so that every coding session is productive. The challenge with these documents is to keep them concise enough that they don't pollute the context. But conciseness is a good goal in and of itself.

### u/BC_MARO (score: 3)

The plan mode default is solid advice. I also landed on always-plan-first after one too many "let me just quickly fix this" sessions that turned into 20 minutes of rollbacks.

One thing I'd add: for MCP connections, keeping a TOOLS.md alongside CLAUDE.md helps a lot. CLAUDE.md has the project context, TOOLS.md has the environment-specific stuff like which MCP servers are connected, camera names, SSH aliases, etc. Keeps the project config portable while your local setup stays separate.

### u/Deep_Ad1959 (score: 2)

The SKILL.md per folder thing is exactly what I do. I have like 30 skills at this point and honestly I spend more time writing those specs than actual code. The real unlock for me was realizing each skill gets its own clean context when 5 agents run in parallel off the same CLAUDE.md -- no cross-contamination between tasks.

### u/RobertLigthart (score: 3)

Yea the skills part is underrated... I have skills set up for recurring workflows and it completely changed how I use claude code. Instead of re-explaining what I want every time I just trigger the skill and it knows exactly what to do. The CLAUDE.md file is huge too, once you get that dialed in the output quality jumps immediately.

> **u/Miserable_Ad7246** (score: 3): Can you give some examples of skills you use? For now I have only three -> do performance analysis, do security analysis, do memory/resource leak analysis.

### u/BP041 (score: 2)

The skills setup changed everything once I stopped making them too broad. My first few were these huge catch-all files -- "ml-pipeline skill", "backend skill" -- and they worked but felt sloppy.

Switching to narrow, one-job skills made a real difference. Each one loads exactly the tools and constraints needed for that task. Claude stays on track way better when the context is scoped.

One thing worth adding to the CLAUDE.md section: track patterns that keep recurring -- stuff like "this error usually means X" or "prefer Y approach for Z". Beats re-explaining the same context from scratch every session.

### u/BuildWithTall (score: 2)

I get Claude to generate a roadmap.md at the start -- basically our north star for what we're building. It's a living document. As things get shipped, items get ticked off and the plan evolves.

During Plan Mode, Claude also links directly to the plan's .md file. I'll usually send that to Codex for an independent review. That back-and-forth helps pressure test assumptions and tighten the architecture before writing code.

When it's time to execute, I choose clear context + execute. By then, Claude already has everything structured in the plan, so lesser chance of hitting the limit where the conversation needs to be compacted.

It's almost like separating: Strategy (roadmap.md), Peer review (Codex), Execution (Claude). Has made a big difference in keeping projects coherent as they scale.

### u/Atheist_Humanist (score: 1)

I'm experimenting with a system where I have the project prd.md with all the requisites for the project. I built a roadmap.md from it and for each feature I work on, I create a specific prd.md, review it and ask claude to create a spec.md that is the implementation plan. After that I ask it to implement the code based on the spec.md.

I also have Claude.md on every level. The project level, with some architecture choices and general things, another one for my backend and another one for my front-end. So when Claude is working on those spaces, these are loaded.

> **u/Proud-Sundae-5018** (score: 4): This guy seems to have created a bunch of useful skills/agents for some of the things you mentioned check it out: https://app.aitmpl.com/skills
>
> Also for the PRD and Spec flow it seems like you're following the concepts of Spec-based coding. Now I don't know how to follow those workflows since I haven't ever set it up like that but you should look into 3 Frameworks for this sorta workflow: 1. Spec based coding with spec kit 2. Open Spec 3. BMAD

### u/Meme_Theory (score: 1)

If you're using a lot of subagents; 'agents.md' is also loaded when agents access files in a directory. For more task focused direction that can change by content.

### u/Important_Swing_8051 (score: 1)

Wait until you understand your computer is the system, not just one Claude Code instance. It is limitless. There are some great examples in this conversation, but when you let Claude take real control, that is something qualitatively different.

### u/Greyveytrain-AI (score: 1)

I have gone through this thread and picked up some valuable insights - based on what I understand people set up various ".md" file types to support their specific projects - What I want to understand is, do you have core ".md" files set up across all workflow projects and then plug in ones related to a specific project just so Claude Code can reference that specific project .md?
