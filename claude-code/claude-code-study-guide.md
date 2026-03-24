**Here's a full, ranked list of the most popular posts, threads, articles, videos, and resources teaching how to use Claude Code (Anthropic's agentic AI coding tool/CLI) + best practices.** 

Claude Code (often used in terminal, VS Code, or code.claude.com) shines with features like **CLAUDE.md** files for persistent rules/memory, Plan Mode, Skills/hooks, context management, and TDD workflows. All top content revolves around these — the "vibe" is system-first (not just prompting).

I pulled this from current top engagement (X likes/views, Reddit upvotes, HN points, search rankings as of March 2026). It's comprehensive but focused on the highest-impact, most-shared ones. Start with #1-3 for quick wins.

### 1. Official & Most Authoritative (Highest Reference Rate)
These are the foundation — shared everywhere on X, Reddit, HN (614 pts on one), and GitHub.
- **Anthropic Engineering Blog: "Claude Code: Best practices for agentic coding"**  
  Link: https://www.anthropic.com/engineering/claude-code-best-practices  
  Covers CLAUDE.md setup, agentic workflows, prompt templates for bugs/refactors/features, and how Claude uses your repo + CLAUDE.md. The original that sparked viral templates.
- **Official Claude Code Docs: Best Practices**  
  Link: https://code.claude.com/docs/en/best-practices  
  Core workflow (Explore → Plan → Implement → Verify), CLAUDE.md rules (<200 lines, hierarchical), context clearing at ~60%, hooks for safety, and verification.

### 2. Viral X (Twitter) Posts & Threads (Highest Real-Time Engagement)
Top mode search shows these dominate with thousands of likes/views. Many are practical or template-focused (promo "free guides" are common but often link to solid CLAUDE.md examples).
- **@arceyul's 1-hour tutorial thread/video** (2.8K+ likes, 120K+ views): Full beginner guide from zero (no coding/terminal experience). Real projects, cases, and tips. Link to post: https://x.com/arceyul/status/2031515868375507276 (includes video).
- **@godofprompt's Claude Code prompt for building apps** (792 likes, 114K+ views): "Steal my Claude Code prompt to plan and build any app from scratch with zero coding experience." Practical starter prompt. Link: https://x.com/godofprompt/status/2031787647056953454.
- **Boris Cherny (@bcherny) creator workflow thread** (widely referenced, sparked 9K-12K like template virals): Parallel sessions + CLAUDE.md as "living rulebook" (add a rule every mistake). Key original. Link: https://x.com/bcherny/status/2007179832300581177.
- Other high-engagement CLAUDE.md template shares (often 3K-12K likes): Summaries by @milesdeutscher, @heygurisingh, @NieceOfAnton, @svpino, and @arvidkahl. Search X for "CLAUDE.md template" or "Boris CLAUDE.md" for the latest copies.

### 3. In-Depth Articles & Guides (Most Shared Tutorials)
These rank highest in searches and get reposted constantly.
- **Builder.io: 50 Claude Code Tips and Best Practices** (very recent & comprehensive)  
  Link: https://www.builder.io/blog/claude-code-tips-best-practices  
  Sourced from Anthropic docs, Boris Cherny, and real usage — covers everything from basics to advanced daily workflows.
- **DataCamp: Claude Code Best Practices (Planning, Context, TDD)**  
  Link: https://www.datacamp.com/tutorial/claude-code-best-practices  
  Production-team focus: Plan Mode, CLAUDE.md under 150 lines with progressive disclosure, Document & Clear pattern, TDD as "external oracle."
- **Medium: Mastering the Vibe – Claude Code Best Practices That Actually Work**  
  Link: https://dinanjana.medium.com/mastering-the-vibe-claude-code-best-practices-that-actually-work-823371daf64c  
  .claude file system, Plan Mode (Shift+Tab twice), "plan then execute," and asking clarifying questions.
- **Creatoreconomy.so: 20 Tips to Master Claude Code (Build a Real App)**  
  Link: https://creatoreconomy.so/p/20-tips-to-master-claude-code-in-35-min-build-an-app  
  Step-by-step while building an app (video recap included).

### 4. GitHub Repos (Curated Full Lists – Super Practical)
- **shanraisshan/claude-code-best-practice**  
  Link: https://github.com/shanraisshan/claude-code-best-practice  
  All-in-one compilation of tips, workflows, skills, and official refs.
- **ykdojo/claude-code-tips (45 tips from basics to advanced)**  
  Link: https://github.com/ykdojo/claude-code-tips  
  Includes custom status line, half system prompt, Gemini as minion, container setups, and /dx commands. Also on Substack as 32 tips.

### 5. Reddit Threads (Community Best Practices & Discussions)
Highest-upvote ones in r/ClaudeAI and r/ClaudeCode:
- Anthropic's Guide share (242+ upvotes): https://www.reddit.com/r/ClaudeAI/comments/1k5slll/anthropics_guide_to_claude_code_best_practices/  
- CLAUDE.md best practices (hierarchies, pruning, modular docs): https://www.reddit.com/r/ClaudeCode/comments/1riwy13/claudemd_best_practices/ and https://www.reddit.com/r/ClaudeCode/comments/1p0jjlb/claudemd_tips/  
- Project structure + Skills/hooks: https://www.reddit.com/r/ClaudeAI/comments/1r66oo0/how_i_structure_claude_code_projects_claudemd/  
Search r/ClaudeCode for "best practices" for user war stories.

### 6. YouTube Videos (Visual Step-by-Step)
- "My top 6 tips & ways of using Claude Code efficiently" (practical strategies): https://www.youtube.com/watch?v=WwdIYp5fuxY
- Anthropic's own "Claude Code best practices | Code w/ Claude"
- Beginner tutorials with 400K+ views (e.g., full setup + real projects): Search "Claude Code Tutorial for Beginners" or "20 Tips to Master Claude Code" (Peter Yang/Creatoreconomy).

### Quick-Start Best Practices (Consensus Across All Top Content)
1. **CLAUDE.md** — Root file (plus ~/.claude personal + subdir ones). Keep <150-200 lines: project overview, tech stack, style rules, anti-patterns, test commands, review checklist. Update from every mistake. Use hierarchy + "read other .md" for modularity.
2. **Plan first** — Always use Plan Mode or write a plan.md. Get approval before coding.
3. **Context management** — Document & Clear (/clear at 60% of 200K tokens). Use /catchup to reload.
4. **Skills + Hooks** — Reusable folders (not just files) for verification, automation, testing. Treat as "products."
5. **TDD + Verification** — Tests before code. Multiple parallel Claudes. Human review on big changes.
6. **Mindset** — System-first (rules + skills) over prompt engineering. Start simple and iterate.

This covers **every major popular post/resource** right now. The official ones + Builder.io/DataCamp/GitHub will give you 95% of the value fast. If you want a ready CLAUDE.md template, setup steps for VS Code/terminal, or me to pull excerpts from any link above, just say! 🚀