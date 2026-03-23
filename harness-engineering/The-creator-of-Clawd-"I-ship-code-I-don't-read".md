---
title: "The creator of Clawd: \"I ship code I don't read\""
source: "https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code"
author:
  - "[[Gergely Orosz]]"
published: 2026-01-28
created: 2026-03-22
description: "How Peter Steinberger, creator of Moltbot (formerly Clawdbot), builds and ships like a full team by centering his development workflow around AI agents."
tags:
  - "clippings"
  - "Gergely Orosz"
  - "pragmaticengineer.com"
date: "2026-03-22T08:14:00-04:00"
---
# The creator of Clawd: "I ship code I don't read"

----

<audio src="https://api.substack.com/api/v1/audio/upload/fd4faaf7-2266-44c6-82d0-49b5a411aa44/src">Audio playback is not supported on your browser. Please upgrade.</audio>

How Peter Steinberger, creator of OpenClaw (formerly: Clawd), builds and ships like a full team by centering his development workflow around AI agents.

### Stream the latest episode

**Listen and watch now on [YouTube](https://youtu.be/8lF7HmQ_RgY), [Spotify](https://open.spotify.com/episode/5Ie6QtG7V0KLK4BZBtiT7j), and [Apple](https://podcasts.apple.com/us/podcast/the-pragmatic-engineer/id1769051199).** See the episode transcript at the top of this page, and timestamps for the episode at the bottom.

### Brought to You by

![](https://substackcdn.com/image/fetch/$s_!Gh57!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd9835d46-a4d0-40e1-a16b-dba8068fd6ad_800x70.png)

• **[Statsig](http://statsig.com/pragmatic)** — ⁠The unified platform for flags, analytics, experiments, and more. There are a few more seats left for **[The Pragmatic Summit](https://www.pragmaticsummit.com/)** I’m hosting with Statsig, on 11 February, in San Francisco. Join me on this one-day event: speakers include folks like Laura Tacho, Simon Willison, Chip Huyen, Martin Fowler, and engineering teams from Cursor, Linear Ramp, and many more. [Check out the agenda](https://www.pragmaticsummit.com/) and [apply here](https://www.pragmaticsummit.com/) — while we still have space!

• **[Sonar](https://www.sonarsource.com/pragmatic/?utm_medium=paid&utm_source=pragmaticengineer&utm_campaign=ss-ai&utm_content=podcast-sonar-ai-lp&utm_term=ww-all-x&s_category=Paid&s_source=Paid%20Other&s_origin=pragmaticengineer)** – The makers of SonarQube, the industry standard for automated code review. Generative AI promises high-speed “vibing,” but it’s created a massive verification bottleneck. Sonar solves this by providing independent verification for all code. **[Join me online](http://sonarsource.com/pragmatic/sonarsummit?utm_medium=paid&utm_source=pragmaticengineer&utm_campaign=ss-sonar-summit26&utm_content=podcast-sonar-summit&utm_term=ww-all-x&s_category=Paid&s_source=Paid%20Other&s_origin=pragmaticengineer)** at the Sonar Summit, on 3rd March. We will share practical strategies for the AI era. [Register here for free.](http://sonarsource.com/pragmatic/sonarsummit?utm_medium=paid&utm_source=pragmaticengineer&utm_campaign=ss-sonar-summit26&utm_content=podcast-sonar-summit&utm_term=ww-all-x&s_category=Paid&s_source=Paid%20Other&s_origin=pragmaticengineer)

• **[WorkOS](https://workos.com/)** – Everything you need to make your app enterprise ready. **[Join me in-person](https://luma.com/workos-pragmatic)**, on 9 February in San Francisco, for a fireside chat at the WorkOS HQ on the WorkOS AI Night with The Pragmatic Engineer. It’s [free to register](https://luma.com/workos-pragmatic), but seats are limited.

### In this episode

Peter Steinberger ships more code than I’ve seen a single person ship: in January, he made more than 6,600 commits alone (!!). As he puts it:

> “From the commits, it might appear like it’s a company. But it’s not. This is one dude \[me\] sitting at home having fun.”

How does he do it?

[Peter Steinberger](https://steipete.me/) is the creator of [Clawdbot](https://www.molt.bot/) (as of yesterday: renamed to [OpenClaw](https://openclaw.ai/)) and founder of [PSPDFKit](https://www.nutrient.io/company/about/pspdfkit/). OpenClaw – a work-in-progress AI agent that shows what the future of Siri could be like – is currently the hottest AI project in the tech industry, [with more searches](https://x.com/GergelyOrosz/status/2016163577007137134?s=20) on Google than Claude Code or Codex. I sat down with Peter in London to talk about what building software looks like when you go all-in with AI tools like Claude and Codex.

Peter’s background is fascinating. He built and scaled PSPDFKit into a global developer tools business. Then, after a three-year break, he returned to building. This time, LLMs and AI agents sit at the center of his workflow. We discuss what changes when one person can operate like a team and why closing the loop between code, tests, and feedback becomes a prerequisite for working effectively with AI.

We also go into how engineering judgment shifts with AI, how testing and planning evolve when agents are involved, and which skills and habits are needed to work effectively. This is a grounded conversation about real workflows and real tradeoffs, and about designing systems that can test and improve themselves.

### How Clawd OpenClaw went viral the last week

Last week, usage of Peter’s hobby project, Clawd — as of a few days ago, OpenClaw — has skyrocketed. It is the fastest-ever growing repository on GitHub, by the number of stars. Here’s how it compares to the also very popular Tailwind CSS in this dimension:

![](https://substackcdn.com/image/fetch/$s_!3vGV!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F01f8c024-dd46-46b1-bde6-e648412e8230_1524x990.png)

Number of stars for OpenClaw: this growth is unprecendented, across GitHub. Source: GitHub Star History

Clawdbot has also been more searched on Google than Claude Code or Codex — which is truly remarkable:

![Image](https://substackcdn.com/image/fetch/$s_!vyDa!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7a0964ac-8f68-444b-a91a-82ab947d8c7b_1644x1328.jpeg)

More Google searches for Clawd in the last week than for Claude Code and Codex, combined. Source: Google Trends

I sat down with Peter in London two weeks ago, when Clawd’s popularity was just *starting* to take off: the project had 2,000 GitHub stars, and a core group of people were enthusiastic, but the project had not yet gone as mainstream. Thanks to this, we got to talk to Peter’s varied background that all led to OpenClaw, and how he threw away traditional software engineering approaches for building this project.

### Interesting learnings from thow Peter builds software

![](https://www.youtube.com/watch?v=8lF7HmQ_RgY)

Ten learnings I noted from our conversation:

1. **Managing a dev team teaches you to let go of perfectionism: a skill important when working with AI agents.** Running PSPDFKit with 70+ people forced Peter to accept that code wouldn't always match his exact preferences. This makes him more efficient when working with agents today.
2. **Close the loop: AI agents must be able to verify their own work**. Peter designs systems so agents can compile, lint, execute, and validate output themselves.
3. **Pull requests are dead, long live “promot requests.”** Peter now views PRs as “prompt requests” and is more interested in seeing the prompts that generated code than the code itself. Interestingly, this is exactly what my brother, Balint Orosz said when he explained that they r [eject almost all external pull requests](https://newsletter.pragmaticengineer.com/i/185980265/4-new-way-to-build-software) from Craft Agents, but take the core idea and use them as prompts later.
4. **Code reviews are dead for this workflow—architecture discussions replace them.** Even in Discord, he doesn’t talk code with his core team: they only talk about architecture and big decisions.
5. **Runs 5-10 agents and stays in the “flow” state.** Peter queues up multiple agents working on different features simultaneously.
6. **Spend a lot of time planning out the work the agent will do, and prefers using Codex.** Peter spent a surprisingly long time going back-and-forth with an agent to come up with a solid plan. He challenges the agent, tweaks it, pushed back. When he is satisfied with the plan, he kicks it off, and moves on to the next one. He likes using Codex because Codex goes off and does long-running tasks: Claude Code comes back for clarifications, which he finds distracting — given he fleshed out a plan already.
7. **Under-prompt intentionally to discover unexpected solutions.** Peter sometimes gives vague prompts to let the AI explore directions he hadn't considered.
8. **Local CI beats remote CI for agent-driven development.** Peter runs tests locally through his agents rather than waiting for remote CI pipelines. He does this because he doesn’t want to wait an extra 10-ish minutes for a remote CI to run, when his agents can run tests locally.
9. **Most code is boring data transformation—focus energy on system design instead.** Peter argues that the majority of application code is just “massaging data in different forms” and doesn’t warrant obsessive attention.
10. **Engineers who thrive with AI care about outcomes over implementation details.** Peter observes engineers who love to solve algorithmic puzzles to struggling going “AI-native” like he has. People who love shipping products, on the other hand, excel.

**I don’t think software engineering is dead with AI: in fact, quite the opposite.** Peter strikes me as a software architect who keeps the high-level structure of his project in his head, deeply cares about architecture, tech debt, extensibility, modularity, and so on. One of the reasons OpenClaw is so successful is because it is so extensible: and Peter spends a good chunk of his energy making it both easy to add new capabilities to the bot, and also acting as the “benevolent dictator” of the project, ensuring the project follows the direction and style that he has in mind.

As always, take Peter’s context into account as you consider what works for *him*: Peter is building an experimental project, which is heavily work-in-progress, and “move fast and break things” is the only way such a project will succeed. Even so, it is remarkable how fast Peter is moving, and how he’s built a tool that found demand that took even major AI labs by surprise!

### The Pragmatic Engineer deepdives relevant for this episode

- [Inside a five-year-old startup’s rapid AI makeover](https://newsletter.pragmaticengineer.com/p/ai-first-makeover-craft)
- [When AI writes almost all code, what happens to software engineering?](https://newsletter.pragmaticengineer.com/p/when-ai-writes-almost-all-code-what)
- [Why it’s so dramatic that “writing code by hand is dead”](https://newsletter.pragmaticengineer.com/p/the-pulse-160-why-its-so-dramatic)
- [AI Engineering in the real world](https://newsletter.pragmaticengineer.com/p/ai-engineering-in-the-real-world)
- [The AI Engineering stack](https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack)

### Timestamps

([00:00](https://www.youtube.com/watch?v=8lF7HmQ_RgY)) Intro

([01:07](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=67s)) How Peter got into tech

([08:27](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=507s)) PSPDFKit

([19:14](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=1154s)) PSPDFKit’s tech stack and culture

([22:33](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=1353s)) Enterprise pricing

([29:42](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=1782s)) Burnout

([34:54](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=2094s)) Peter finding his spark again

([43:02](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=2582s)) Peter’s workflow

([49:10](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=2950s)) Managing agents

([54:08](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=3248s)) Agentic engineering

([59:01](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=3541s)) Testing and debugging

([1:03:49](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=3829s)) Why devs struggle with LLM coding

([1:07:20](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=4040s)) How PSPDFkit would look if built today

([1:11:10](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=4270s)) How planning has changed with AI

([1:21:14](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=4874s)) Building Clawdbot (now: OpenClaw)

([1:34:22](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=5662s)) AI’s impact on large companies

([1:38:38](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=5918s)) “I don’t care about CI”

([1:40:01](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=6001s)) Peter’s process for new features

([1:44:48](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=6288s)) Advice for new grads

([1:50:18](https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=6618s)) Rapid fire round

### References

**Where to find Peter Steinberger:**

• X: [https://x.com/steipete](https://x.com/steipete)

• LinkedIn: [https://www.linkedin.com/in/steipete](https://www.linkedin.com/in/steipete)

• Website: [https://steipete.me](https://steipete.me/)

• OpenClaw: [https://openclaw.ai](https://openclaw.ai/)

**Mentions during the episode:**

• OpenClaw (formerly Clawdbot): [https://openclaw.ai](https://openclaw.ai/)

•.Net: [https://dotnet.microsoft.com](https://dotnet.microsoft.com/)

• Worldwide Developers Conference: [https://en.wikipedia.org/wiki/Worldwide\_Developers\_Conference](https://en.wikipedia.org/wiki/Worldwide_Developers_Conference)

• PSPDFKit: Powering digital transformation since 2011: [https://www.nutrient.io/company/about/pspdfkit](https://www.nutrient.io/company/about/pspdfkit)

• Hiring a distributed team: [https://www.nutrient.io/blog/hiring-a-distributed-team](https://www.nutrient.io/blog/hiring-a-distributed-team)

• Claude Code: [https://code.claude.com](https://code.claude.com/)

• Shipping at Inference-Speed: [https://steipete.me/posts/2025/shipping-at-inference-speed](https://steipete.me/posts/2025/shipping-at-inference-speed)

• Cursor: [https://cursor.com](https://cursor.com/)

• Gemini 2.5: [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro)

• Claude Opus 4.5: [https://www.anthropic.com/news/claude-opus-4-5](https://www.anthropic.com/news/claude-opus-4-5)

• Codex: [https://openai.com/codex](https://openai.com/codex)

• Antigravity: [https://antigravity.google](https://antigravity.google/)

• TDD, AI agents and coding with Kent Beck: [https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent)

• AI tools for software engineers, but without the hype – with Simon Willison (co-creator of Django): [https://newsletter.pragmaticengineer.com/p/ai-tools-for-software-engineers-simon-willison](https://newsletter.pragmaticengineer.com/p/ai-tools-for-software-engineers-simon-willison)

• Ralph Wiggum Claude Code plugin: [https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum)

• Amantus Machina: [https://www.amantus.ai](https://www.amantus.ai/)

• Dr. Who: [https://en.wikipedia.org/wiki/Doctor\_Who](https://en.wikipedia.org/wiki/Doctor_Who)

• McPorter: [https://github.com/steipete/mcporter](https://github.com/steipete/mcporter)

• Black Mirror: “Plaything”: [https://www.imdb.com/title/tt31215636](https://www.imdb.com/title/tt31215636)

• Vibe Meter: Monitor Your AI Costs: [https://steipete.me/posts/2025/vibe-meter-monitor-your-ai-costs](https://steipete.me/posts/2025/vibe-meter-monitor-your-ai-costs)

• Aura Frames: [https://auraframes.com](https://auraframes.com/)

• When AI writes almost all code, what happens to software engineering?: [https://newsletter.pragmaticengineer.com/p/when-ai-writes-almost-all-code-what](https://newsletter.pragmaticengineer.com/p/when-ai-writes-almost-all-code-what)

• Software engineering with LLMs in 2025: reality check: [https://newsletter.pragmaticengineer.com/p/software-engineering-with-llms-in-2025](https://newsletter.pragmaticengineer.com/p/software-engineering-with-llms-in-2025)

—

Production and marketing by [Pen Name](https://penname.co/).