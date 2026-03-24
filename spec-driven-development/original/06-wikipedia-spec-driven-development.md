# Spec-driven Development

**Source:** https://en.wikipedia.org/wiki/Spec-driven_development
**Title:** Spec-driven development — Wikipedia

---

**Spec-driven development** (**SDD**) is a software engineering methodology where a formal, machine-readable specification serves as the authoritative source of truth and the primary artifact from which implementation, testing, and documentation are derived. Unlike traditional development where documentation is often retrospective, spec-driven development mandates that system intent be explicitly defined in a structured format—such as OpenAPI or Markdown—before implementation begins. In the context of AI-assisted engineering, spec-driven development serves as a rigorous framework that transforms specifications into executable blueprints for coding agents, preventing the inconsistencies associated with ad-hoc "vibe coding".

The roots of spec-driven development trace back to 1960s NASA workflows and early formal methods that prioritized logic verification before coding. The methodology was academically formalized in 2004 as a synergy between test-driven development (TDD) and design by contract (DbC), before seeing a 2020s renaissance driven by LLM-powered agentic workflows.

Modern spec-driven development typically follows a four-phase lifecycle:

- **Specify** — defining functional requirements
- **Plan** — translating intent into technical architecture
- **Task** — decomposing the plan into atomic units
- **Implement** — automated code generation and human validation

Proponents argue this approach represents a shift toward architecture as an executable control plane, where implementation code is treated as a transient byproduct of the maintained specification—a concept sometimes referred to as "spec-as-source".

## Comparison with Other Methodologies

While complementary, spec-driven development is often distinguished from similar practices by its focus on high-level intent:

- **Test-driven development (TDD):** Focuses on correctness at the implementation level; SDD uses the specification to generate initial tests.
- **Behaviour-driven development (BDD):** Focuses on user-facing scenarios; SDD provides the structural and architectural invariants that BDD scenarios must satisfy.

## See Also

- Model-driven engineering
- Behavior-driven development
- Formal methods

## References

1. Böckeler, Birgitta. ["Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl"](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). *MartinFowler*.
2. ["Spec Driven Development: When Architecture Becomes Executable"](https://www.infoq.com/articles/spec-driven-development/). *InfoQ*. 2026-01-12.
3. ["Spec-Driven Development Explained"](https://www.nitorinfotech.com/blog/spec-driven-development-explained/). *Nitor Infotech*.
4. ["Spec-Driven Development with AI"](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/). *GitHub Blog*. 2025-01-10.
5. ["Spec-Driven Development Guide"](https://www.scalablepath.com/machine-learning/spec-driven-development-guide). *Scalable Path*. 2025-11-10.
6. Ostroff, J.S.; Makalsky, D.; Paige, R.F. (2004). ["Agile Specification-Driven Development"](https://www.researchgate.net/publication/221592745). Lecture Notes in Computer Science.
7. ["Inside Spec-Driven Development: What GitHub Spec Kit Makes Possible"](https://www.epam.com/insights/ai/blogs/inside-spec-driven-development-what-githubspec-kit-makes-possible-for-ai-engineering). *EPAM Insights*.
8. ["Tessl launches spec-driven framework"](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry/). *Tessl.io*. 2025-09-23.
9. ["Beyond TDD: Why Spec-Driven Development is the Next Step"](https://kinde.com/learn/ai-for-software-engineering/best-practice/beyond-tdd-why-spec-driven-development-is-the-next-step/). *Kinde*.
10. ["SDD vs TDD vs BDD in plain words"](https://beam.ai/agentic-insights/spec-driven-development-build-what-you-mean-not-what-you-guess). *Beam.ai*.
