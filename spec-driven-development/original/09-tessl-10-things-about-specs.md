# Spec-Driven Development: 10 Things You Need to Know About Specs

**Source:** https://tessl.io/blog/spec-driven-development-10-things-you-need-to-know-about-specs/
**Author:** Patrick Debois (the father of DevOps)
**Published:** 29 Oct 2025
**Read time:** 15 minutes

---

A couple of months ago, I wrote about the [4 patterns of AI Native Dev](https://ainativedev.io/news/the-4-patterns-of-ai-native-dev-overview), and listed Pattern #2 to be about the shift from implementation to intent. The industry is moving from telling AI agents exactly how to code something to describing what we want them to build. At the heart of this transformation are Specifications.

Specifications, or specs, are living executable artifacts that fundamentally change how we collaborate with AI agents. After countless conversations with devs, tool builders, and teams experimenting with this approach, I've distilled what I know to be the 10 essential insights.

---

## 1. What's a Spec, Really?

First, let's get clear on what we mean by "spec" in the context of AI Native Development, because it's easy to confuse it with adjacent concepts:

- A **prompt** instructs an LLM to give a response → that's prompt engineering
- A **conversation** with your agents steers it to do what you want → that's interactive coding
- A **spec** formulates your intent as a set of requirements

Here's the key difference: a spec isn't just a one-off instruction. It's a structured document that captures what you want the system to do, which the agent then breaks down into smaller steps to implement. You can think of it as the difference between asking someone to "make dinner" versus handing them a recipe.

Spec-driven development changes the habit from asking the agent to do specific tasks to handing over a set of requirements to the agents. You're shifting from micromanagement to delegation.

---

## 2. Specs Come in Different Flavors

Not all specs are created equal. In the wild, there are at least four distinct types:

1. **Functional/technical features:** Your `prompt.md` or `spec.md` files. These describe what features you want, what the system should do, and how different components should behave.

2. **Agent identities:** Think of these as "steering tiles" or `Agent.md` files. These define the personality, capabilities, and boundaries of specific agents. It's like writing a job description for your AI teammate.

3. **Task/workflow specs:** Tools like [Kiro](https://landscape.ainativedev.io/) excel at this. These specs describe processes, sequences, and how different agents should coordinate their work.

4. **Usage/knowledge specs:** This is where platforms like [Tessl](https://tessl.io/) come in. These specs capture domain knowledge, usage patterns, and context that help agents understand your specific environment and needs.

Each type serves a different purpose, and mature AI Native Development often involves orchestrating multiple spec types together.

---

## 3. Specs Format Matters (But Not as Much as You Think)

Here's the good news: specs don't need a specific format. Most teams default to Markdown because it's easy to read in your IDE, renders nicely on GitHub, and both humans and agents can parse it effectively.

But the ecosystem is evolving. You'll encounter various approaches:

- Cursor [rules](https://cursor.com/docs/context/rules) files for Cursor IDE
- [Speclang](https://githubnext.com/projects/speclang/) attempts at formalization
- [BMAD patterns](https://github.com/bmad-code-org/BMAD-METHOD)
- OpenAI's [model specs](https://model-spec.openai.com/2025-10-27.html) approach
- [Agents.md](http://agents.md/) conventions
- [Claude Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) formatting
- [EARS format](https://kiro.dev/docs/specs/concepts/) used by Kiro

The reality? This is all a form of prompt engineering. Specs are sensitive to the models being used. What works brilliantly with Claude might need adjustment for GPT-4 or other models.

The challenge of interchanging specs across different tools and models remains real. We're in the early days here, much like the early cloud-native ecosystem before standards emerged. But don't let perfect be the enemy of good — you can start with Markdown and iterate based on what your tools and agents respond to best.

---

## 4. Context Window Constraints Are Real

Here's a hard truth: too large or too many specs will overload the context window. Teams can go spec-crazy, documenting everything, only to find their agents choking on the sheer volume.

Solutions are emerging:

- **RAG/context selection:** Intelligently selecting relevant pieces of your specs. Interestingly, tools like Claude Code are using grep-based approaches rather than full RAG systems, which is surprisingly effective for structured text.

- **Subagents with specific context:** Instead of one mega-agent with all specs, deploy specialized agents with focused context. Think microservices, but for AI agents.

- **AST parsing and LSP integration:** Connecting specs to related code and documentation via Abstract Syntax Tree parsing and Language Server Protocol integration. This keeps specs grounded in actual code structure.

The key insight: your specs need an information architecture. Don't just pile everything into one massive file.

---

## 5. Can We Regenerate Apps from Scratch Now?

Hope springs eternal, right? Yes, specs enable regeneration, but let's be realistic about where we are.

- **You need a planning method:** Something like a `Backlog.md` that breaks down the work into manageable chunks. Without this, agents tend to get lost or produce inconsistent results.

- **Stable regeneration is hard:** This is why spec-driven development is an iterative approach, not a magic "generate once" solution. Each regeneration might produce slightly different implementations.

- **Language/model dependence:** Your mileage varies dramatically depending on the programming language and the model's training data. Python and JavaScript? Pretty good. COBOL? Not so much.

As discussed in [levels of autonomy](https://ainativedev.io/news/the-5-levels-of-ai-agent-autonomy-learning-from-self-driving-cars), we're climbing a ladder here. Full autonomous regeneration is a higher rung than most teams need right now.

---

## 6. The Tool Ecosystem Is Exploding

The [AI Native Dev Landscape](https://landscape.ainativedev.io/) now tracks over 450 tools. For spec-driven development specifically, notable players include:

- **Kiro** for workflow specifications
- **Speckit** for spec management
- **[Claude Flow](https://github.com/ruvnet/claude-flow)** — a hive/swarm coding approach based on specs
- Various IDE extensions and agent platforms

Each tool takes a slightly different approach. Some focus on spec creation, others on validation, still others on agent execution. The landscape is fragmenting rapidly, which is both exciting and overwhelming.

The advice: pick one tool that fits your workflow and go deep before exploring alternatives. The switching costs are real, and consistency matters more than features at this stage.

---

## 7. Registries and Spec Sharing Are Coming

Once you start writing good specs, you'll want to reuse them. The question is: how?

- **Git Submodules:** The old standby. Not elegant, but it works for sharing specs across projects.

- **IDE team features:** Collaboration features built into Cursor, VS Code, and others. The risk? Lock-in to specific IDEs.

- **Package repositories:** The dream — spec registries that work like npm or PyPI, enabling reuse across your organization. Some forward-thinking companies are building internal registries.

- **Public registries:** Tessl and others are working on public spec sharing. Imagine being able to import well-tested specs for common patterns like authentication, API design, or database schemas — including your coding, operational, and security guidelines.

The parallel to DevOps is clear: remember when everyone was rolling their own deployment scripts? Then we got Ansible Galaxy, Terraform Registry, and Helm Charts. Spec registries are coming.

---

## 8. Do We Still Need Code Review?

A controversial question that comes up constantly: if specs define intent and agents generate the code, do we need to review code anymore?

Short answer: yes, absolutely, review is crucial.

Here's why:

- **You still need to understand what good looks like.** Someone on the team needs to know if the generated implementation makes sense, is maintainable, and follows best practices.

- **Tests are your safety net.** Specs should include test descriptions. Tests define intent too — they state how the component should act given various inputs and states. Without tests, you're flying blind.

- **Can agents generate the tests too?** They can, but here's the twist: it might need to be a different LLM or the same LLM with a different identity. Think of it as separation of concerns — the implementation agent and the testing agent should have different perspectives.

- **Human review remains essential** — at least for now. The agent that generates code from specs might miss edge cases. The agent that generates tests might miss important scenarios. Human oversight catches these gaps.

---

## 9. What About Legacy Applications?

"This all sounds great for greenfield projects, but what about our 15-year-old monolith?"

Fair question. The honest answer: specs work partially for legacy apps, but it's more complex.

- **The strangler pattern can help:** Gradually spec out new features or refactored modules while leaving legacy code as-is. Over time, you're "strangling" the old implementation with spec-driven new code.

- **Language-specific models matter:** Some languages have better model training than others. If your legacy app is in a well-supported language, you'll have an easier time. If it's in something obscure, you might be waiting for specialized models.

- **Tool integration is key:** Look for tools that understand your legacy language and can bridge between existing code and new specs. Some AST-based tools are getting better at this.

The reality? Specs won't magically modernize your legacy systems, but they can make incremental improvement more systematic.

---

## 10. We're Not There Yet (But It's Already Useful)

Spec-driven development is not a silver bullet, and we're still in the early adopter phase. But even in its current immature state, it offers real value.

- **It's a robust alternative to "vibe coding."** You know what that means: when you're just prompting and re-prompting until something works. Specs bring structure to AI-assisted development.

- **Output varies across tools and models.** The same spec will produce different code from different agents. This isn't necessarily bad — think of it as different interpretations of the same requirements — but it means specs alone aren't deterministic.

- **Spec evals are the future.** Just as we developed test coverage metrics and code quality tools, we'll need ways to evaluate spec quality. How complete is your spec? How testable? How maintainable? These metrics don't exist yet, but they're coming.

- **Knowledge capture is still early.** [Pattern #4](https://ainativedev.io/news/content-creation-to-knowledge) from the AI Native Dev framework talks about moving from content to knowledge. Specs are a form of knowledge capture, but we're still figuring out the best practices. How much context? What level of detail? When to split specs? These are open questions.

- **Specs align both humans and agents.** The process of writing specs together as a team helps not only your agents, but also aligns humans inside your team and organization.

> "The new code: specs write once, run everywhere" — Sean Grove

---

## Where Do We Go from Here?

Spec-driven development represents a fundamental shift in how we think about software development. It's part of the broader move from implementation to intent.

If you're getting started:

1. **Begin with one feature.** Don't spec your entire application. Pick a well-understood feature and write a detailed spec. See how your AI agent performs.

2. **Include tests in your specs** from day 1. Tests are intent too.

3. **Version your specs.** Use Git. Treat specs as code.

4. **Iterate based on agent behavior.** Your specs will need refinement as you learn how agents interpret them.

5. **Share with your team.** The real power of specs is alignment. If everyone's working from the same spec, coordination gets easier.

And most importantly: share your learnings with the community. We're all figuring this out together, and the patterns that emerge will come from shared experiences across hundreds of teams.

This is Pattern #2 in action: moving from implementation to intent. Specs are how we express that intent clearly, systematically, and collaboratively with our AI agents.

---

## Resources

- [Speclang](https://githubnext.com/projects/speclang/) — GitHub Next's spec language project
- [Agents.md](http://agents.md/) — Agent identity spec conventions
- [Kiro Concepts](https://kiro.dev/docs/specs/concepts/) — EARS format used by Kiro
- [AI Native Dev Landscape](https://landscape.ainativedev.io/) — 450+ tool tracker
- [4 Patterns of AI Native Dev](https://ainativedev.io/news/the-4-patterns-of-ai-native-dev-overview) — Patrick Debois's framework
- [5 Levels of AI Agent Autonomy](https://ainativedev.io/news/the-5-levels-of-ai-agent-autonomy-learning-from-self-driving-cars)
- [AI Development That Actually Works: Specs & Patterns from 30 Real Projects](https://tessl.io/blog/ai-development-patterns-what-actually-works/)
