# CLAUDE.md Best Practices

**Source:** https://www.reddit.com/r/ClaudeCode/comments/1riwy13/claudemd_best_practices/
**Author:** u/maleslp
**Subreddit:** r/ClaudeCode

---

## Post Content

Hi all. I'm not new to CC (I use it nearly daily), but I'm not a developer by trade. I've learned a TON by just getting my hands dirty, but I know I'm still leagues behind many of you when it comes to technical prowess. Having said that, I had a couple of questions that I just can't figure out!

Is there anywhere a CLAUDE.md best practices guide? I understand it should be lean and just be a set of instructions, but when I ask Claude to update the documentation with what was just completed, it CONSTANTLY adds to CLAUDE.md. I'll remind it not to, but it just keeps doing it. Outside of that, what sorts of general things should, and shouldn't, be in CLAUDE.md? I never know where to put certain things, especially when Claude just wanted to put everything there. Thanks!

---

## Top Comments

### u/sittingmongoose (score: 4)

You want to keep it as minimal as possible. Don't put any code in it. Essentially it should be things that you have seen your agents struggle to figure out or correct mistakes it keeps making.

The code can grep(search) for code faster than it can read the CLAUDE.md and it will use less tokens doing that. Too much in the CLAUDE.md can confuse the agent, overwhelm it, and fill up its context.

### u/tom_mathews (score: 3)

Split it tbh. Stable rules go in `.claude/rules/` as separate files -- those never get touched by the agent. CLAUDE.md becomes the scratch surface for session-learned context that you periodically prune. The bloat problem disappears when you stop mixing permanent instructions with ephemeral learnings in one file. Claude treats everything in CLAUDE.md as equally mutable.

### u/Shep_Alderson (score: 2)

I think that asking Claude to update your CLAUDE.md with learnings is perfectly fine. I think that there's also value in going into your CLAUDE.md from time to time to clean things up manually.

I don't know of any plain examples of a "good" CLAUDE.md, but I don't think it hurts to let Claude update it as it goes.

### u/sputnik13net (score: 2)

I ask the agent to compact the rules from time to time and tell it to write it for machine consumption, that causes the rules to be in more summary form. If you need Claude to follow certain things more strictly I recently learned adding precompaction and session start hooks makes whatever you insert more strict. I learned this from looking at how beads inserts itself into Claude.

### u/Substantial-Cost-429 (score: 1)

We treat our claude.md like a living style guide. It's mostly notes of mistakes agents repeat and high level guidance. Don't dump code there. Add examples or patterns to follow to reduce errors. Also check out the caliber ai-setup repo on github, they have some nice setup ideas that can help structure things.

### u/ultrathink-art (score: 0)

CLAUDE.md structure matters a lot more once you're running multiple agents in sequence.

Single-agent: your CLAUDE.md is preferences and style. Multi-agent: it's the only shared contract between sessions. Our orchestrator has 6 specialized agents -- each reads a shared CLAUDE.md that's part production rules, part incident log. 'Never amend commits' is in there because an agent once amended the wrong commit and broke CI. Every hard rule has a war story behind it.

The update-via-Claude-prompt approach is fine for style, but for constraint rules we've found human review matters. Agents tend to append learnings that sound right but are too narrow (they encode the specific failure, not the general principle).

Best practice we've landed on: agent proposes, human reviews constraint additions once a week.

### u/Objective_Law2034 (score: -1)

The CLAUDE.md bloat problem is real - Claude treats it like a dumping ground unless you're strict about it.

Keep CLAUDE.md lean: coding conventions, project structure overview, and hard rules only. Things like "use TypeScript strict mode" or "API routes go in src/routes." Nothing that changes often.

For the stuff Claude keeps trying to add (what it learned about your codebase, what was just completed, how modules connect), that's not documentation, that's context memory. I use vexp (https://vexp.dev/) which handles this automatically. It indexes your codebase, tracks what the agent explores across sessions, and serves the relevant context back without you managing a file.

When the code changes, stale context gets flagged automatically.

Short version: CLAUDE.md = static rules you write once. Session memory = dynamic context that a tool manages for you.
