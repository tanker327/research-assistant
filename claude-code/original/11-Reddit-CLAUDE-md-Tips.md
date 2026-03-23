# CLAUDE.md Tips

**Source:** https://www.reddit.com/r/ClaudeCode/comments/1p0jjlb/claudemd_tips/
**Author:** u/mrothro
**Subreddit:** r/ClaudeCode

---

## Post Content

I was chatting with one of my colleagues and I realized they weren't getting the most out of the CLAUDE.md files for Claude Code. I thought I'd take a minute to share four tips that have served me very well.

1. **Create a hierarchy of CLAUDE.md files.** Your personal file is used for all projects, so it should have your personal work style and preferences. The one in the top level of any project dirtree has project-specific information. Then you can have them in lower level directories: I typically code microservices in a monorepo, so each of those directories has one specific to that service.

2. **Make it modular.** You don't have to have everything in the CLAUDE.md, it can contain guidance to read other .md files. Claude understands "modular documentation" so you can ask it to do this, creating a high level file with guidance on when to consult detailed doc files. This saves you tokens. Again, this can be hierarchical.

3. **Regularly capture learnings from a "good session".** When I see I'm getting close to the compaction limit in a particularly productive session, I use this prompt: "Review all of the relevant CLAUDE.md and other .md files and compare them to what you know now. If you can improve them, please do so." This works surprisingly well, though over time the files get pretty long, which leads to my final tip.

4. **Occasionally ask Claude to optimize the CLAUDE.md files.** Tell it to review the file and compact it for ready use but preserve all of the critical information. This also works quite well.

Hope that helps. If anyone has other tips they'd like to share, I'd love to hear them!

---

## Top Comments

### u/New_Goat_1342 (score: 3)

I have a docs folder in the project that Claude.md references then it can be kept tightly focused. Then a sync-docs skill that I run before any pull request to keep everything updated. Must work pretty well as it's been a long time since I've found myself cursing Claude for screwing up unit tests or significantly deviating from architecture.

> **u/mrothro** (score: 1): Good tip. I haven't explored managing this with skills at all yet, since I developed all this prior to their availability. Seems like there is an opportunity for real improvement here.

### u/CompetitiveNight6305 (score: 2)

Any tips for documenting what is specific for claude vs what is for anyone who is coding in your repo - be they agents or people?

> **u/mrothro** (score: 1): In my experience the other .md files CC creates actually work quite well for people. Example: I had been following the "modular docs" approach and had several detailed .md files (not CLAUDE.md but actual README-type files) and a colleague was using them to get up to speed. I guess that is an added bonus for tip 2.

### u/MelodicNewsly (score: 1)

To me it seems that the claude.md file hierarchy became outdated with skills. Skills have frontmatter, driving a more efficient search and capture mechanism.

I'm moving part of claude.md to skills, keeping claude.md as small and effective as possible.

I often see people using skills where they should have used a custom command or hook. Background *domain knowledge* vs *action*.

> **u/mrothro** (score: 1): It's a fair question. I did all this prior to skills. One thing, though: skills are only in CC. I sometimes use codex and gemini, and I just tell them to read CLAUDE.md. Not sure how that would work with skills.

### u/Input-X (score: 0)

I have one claude.md. It's about 30 lines. All it does is say read these files. Custom memory is so much easier to manage.
