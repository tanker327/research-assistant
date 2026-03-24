# Spec-Driven Development (SDD) — Reading List

**Spec-Driven Development (SDD)** is an emerging 2025–2026 AI-assisted software engineering practice. You write detailed, structured specifications (specs) *first* as the single source of truth. Then AI coding agents (like Claude Code, GitHub Copilot, etc.) generate, plan, and implement code from those specs — instead of "vibe coding" or iterative prompting. It's positioned as a more disciplined, maintainable alternative to pure agentic workflows, with tools like GitHub Spec Kit popularizing it heavily.

It draws comparisons to older ideas like Specification-Driven Development or BDD but is newly adapted for LLM agents. The spec becomes the primary artifact (sometimes even "spec-as-source"), with code as a derived/output artifact that can be regenerated.

---

## Core Introductions & Official Resources (Highest Popularity)

1. **GitHub Blog: "Spec-driven development with AI: Get started with a new open-source toolkit"** (Sep 2025)
   Official launch of Spec Kit; the post that kicked off much of the hype.
   https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/

2. **GitHub Spec Kit Repo + spec-driven.md** (core definition & process)
   The actual open-source toolkit and detailed methodology doc.
   - https://github.com/github/spec-kit
   - https://github.com/github/spec-kit/blob/main/spec-driven.md

3. **Martin Fowler: "Understanding Spec-Driven-Development: Kiro, spec-kit, Tessl…"** (Oct 2025)
   Excellent neutral overview comparing the main tools and defining levels of SDD (spec-first → spec-as-source). Highly recommended.
   https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html

4. **Thoughtworks: "Spec-driven development: Unpacking one of 2025's key new AI-assisted engineering practices"** (Dec 2025) + Technology Radar entry
   - https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices
   - Radar: https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development

5. **Microsoft Developer Blog: "Diving Into Spec-Driven Development With GitHub Spec Kit"** (Sep 2025)
   https://developer.microsoft.com/blog/spec-driven-development-spec-kit

6. **Wikipedia: Spec-driven development** (up-to-date entry with history and core concepts)
   https://en.wikipedia.org/wiki/Spec-driven_development

## Practical Guides & Tool-Specific Articles

7. **Heeki Park (Medium): "Using spec-driven development with Claude Code"**
   Practical workflow example.
   https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29

8. **Zencoder Docs: "A Practical Guide to Spec-Driven Development"**
   Four-phase process.
   https://docs.zencoder.ai/user-guides/tutorials/spec-driven-development-guide

9. **Tessl Blog: "Spec-Driven Development: 10 things you need to know about specs"** (Oct 2025)
   https://tessl.io/blog/spec-driven-development-10-things-you-need-to-know-about-specs/

10. **Red Hat Developers: "How spec-driven development improves AI coding quality"** (Oct 2025)
    https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality

11. **Augment Code: "What Is Spec-Driven Development? A Complete Guide"** (Feb 2026) + tools list
    https://www.augmentcode.com/guides/what-is-spec-driven-development

12. **Kiro Blog: "Kiro and the future of AI spec-driven software development"** (Jul 2025)
    https://kiro.dev/blog/kiro-and-the-future-of-software-development/

## Critical / Balanced Takes & Discussions

13. **Marmelab: "Spec-Driven Development: The Waterfall Strikes Back"** (Nov 2025)
    Thought-provoking critique.
    https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html

14. **InfoQ: "Spec Driven Development: When Architecture Becomes Executable"** (Jan 2026)
    https://www.infoq.com/articles/spec-driven-development/

15. **Dev.to: "Spec Driven Development (SDD) – A initial review"** (Sep 2025)
    https://dev.to/danielsogl/spec-driven-development-sdd-a-initial-review-2llp

16. **Reddit threads** (real-world usage)
    - https://www.reddit.com/r/ChatGPTCoding/comments/1otf3xc/does_anyone_use_specdriven_development/
    - https://www.reddit.com/r/ClaudeCode/comments/1rg0b9i/has_anyone_tried_the_spec_driven_development/

## Academic Papers (arXiv – Latest Research)

17. **"Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants"** by DB Piskala (Jan 2026)
    Core practitioner guide.
    - https://arxiv.org/abs/2602.00180
    - PDF: https://arxiv.org/pdf/2602.00180

18. **"Constitutional Spec-Driven Development: Enforcing Security by Construction…"** by SR Marri (Jan 2026)
    - https://arxiv.org/abs/2602.02584

19. **"SWE-AGI: Benchmarking Specification-Driven Software Construction"** (Feb 2026)
    https://arxiv.org/abs/2602.09447

20. **"Sedeve-Kit, a Specification-Driven Development Framework…"** (2025)
    https://arxiv.org/abs/2509.11566

## Bonus: Videos & Quick Overviews

21. **YouTube: "Spec-Driven Development: AI Assisted Coding Explained"**
    https://www.youtube.com/watch?v=mViFYTwWvcM

22. **YouTube: "Spec-Driven Development in the Real World"**
    https://www.youtube.com/watch?v=3le-v1Pme44

---

## Recommended Reading Order

1. GitHub Blog + spec-driven.md (foundational)
2. Martin Fowler article (best neutral comparison)
3. Thoughtworks post + Radar
4. arXiv paper #1 (deeper theory)
5. Your tool of choice's guide (e.g., Claude or Spec Kit)
