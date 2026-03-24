# Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants

**Source:** https://arxiv.org/abs/2602.00180
**Authors:** Deepak Babu Piskala
**Submitted:** January 30, 2026
**Venue:** Submitted to AIWare 2026. 8 pages, 3 figures
**Subjects:** Software Engineering (cs.SE); Artificial Intelligence (cs.AI)
**DOI:** https://doi.org/10.48550/arXiv.2602.00180

---

## Abstract

The rise of AI coding assistants has reignited interest in an old idea: what if specifications — not code — were the primary artifact of software development? Spec-driven development (SDD) inverts the traditional workflow by treating specifications as the source of truth and code as a generated or verified secondary artifact. This paper provides practitioners with a comprehensive guide to SDD, covering its principles, workflow patterns, and supporting tools. We present three levels of specification rigor — spec-first, spec-anchored, and spec-as-source — with clear guidance on when each applies. Through analysis of tools ranging from Behavior-Driven Development frameworks to modern AI-assisted toolkits like GitHub Spec Kit, we demonstrate how the spec-first philosophy maps to real implementations. We present case studies from API development, enterprise systems, and embedded software, illustrating how different domains apply SDD. We conclude with a decision framework helping practitioners determine when SDD provides value and when simpler approaches suffice.

---

## I. Introduction

Historically, code has dominated software development culture. While requirements documents and design diagrams exist, they frequently become outdated and disconnected from actual implementation. The executable code becomes the de facto truth of any system.

This code-centric approach creates operational challenges. New developers asking "what should this function do?" typically receive responses to "examine the code." Stakeholders questioning whether systems meet requirements must reverse-engineer intent from implementations. When AI assistants receive vague feature requests, they must make assumptions about requirements that were never explicitly stated.

Spec-driven development offers an alternative paradigm: establish specifications as authoritative sources, with code deriving from them. Rather than coding first and documenting afterward, teams articulate clear behavioral specifications first, then generate, implement, or verify code against those specifications. The specification becomes the authoritative description that humans and machines use for understanding, building, and maintaining systems.

### I-A. The AI Catalyst

Although spec-first thinking traces back to Test-Driven Development and Behavior-Driven Development movements, AI coding assistants have made SDD newly relevant. The challenge is straightforward: AI excels at pattern completion but struggles with unstated requirements.

When developers prompt AI with vague requests like "Add photo sharing to my app," the AI must guess about formats, permissions models, size limits, storage approaches, and compression — each guess introduces risk. This pattern of loose prompts generating inconsistent outputs from language models represents what practitioners call "vibe coding." Providing AI with unambiguous, executable contracts dramatically improves coding agent reliability and enables scalable software creation.

With a detailed specification — "Users upload JPEG or PNG photos up to 10MB. Photos store in S3 with user-ID-prefixed keys. Only uploaders delete their photos. Photos resize to 1024px maximum on upload" — AI has sufficient context for generating appropriately scoped code.

**Core Principle:** Specifications declare intent; code realizes it. In SDD, code becomes the implementation detail of the specification rather than the inverse.

### I-B. What This Paper Provides

This practitioner's guide covers specification-driven development comprehensively. The paper begins by defining clear specification rigor levels — spec-first, spec-anchored, and spec-as-source — identifying appropriate applications for each. A practical workflow implementation follows, examining how SDD operates both with and without AI assistance. A tools and frameworks survey spans traditional BDD frameworks through contemporary AI-assisted toolkits. Case studies demonstrate SDD application across API development, enterprise systems, and embedded software domains. Finally, guidance addresses when SDD delivers value versus simpler alternatives.

---

## II. The Specification Spectrum

Different specification adoption levels exist depending on organizational needs, available tooling, and domain constraints. The spectrum ranges from traditional code-first development to fully spec-as-source approaches. Understanding team positioning — and desired positioning — represents the first step toward effective SDD adoption.

### II-A. Spec-First: Guided Initial Development

Spec-first development articulates specifications before coding to guide initial implementation. Once code exists, specifications may or may not be maintained — the primary value lies in initial clarity.

Spec-first represents the SDD entry point. Before writing code, developers or teams articulate intended functionality, typically through user stories with acceptance criteria, BDD scenarios, or detailed requirements documents. The specification guides implementation, though once code is written and tests pass, the specification may be abandoned or allowed to drift.

The defining characteristic is that specifications precede implementation, ensuring developers have clear targets before starting. However, code becomes the primary post-implementation artifact, and specifications may become outdated through subsequent iterations. This approach carries lower maintenance burdens than stronger specification disciplines, making it practical for teams unable to commit to ongoing specification maintenance.

Spec-first works particularly well for initial AI-assisted feature development, preventing AI from guessing requirements and dramatically improving generated code quality. It is valuable for prototypes and one-off features where ongoing specification maintenance costs exceed benefits. However, spec-first offers no protection against drift over time — teams maintaining codebases long-term should consider spec-anchored approaches.

### II-B. Spec-Anchored: Living Documentation

Spec-anchored development maintains specifications alongside code throughout system lifecycles. Behavioral changes require updating both specifications and code, maintaining synchronization.

Spec-anchored treats specifications as living documents evolving with codebases. When features change, specifications update concurrently with or before code. Automated checks — typically tests derived from specifications — ensure specifications and code remain aligned. Divergence triggers test failures, providing immediate feedback that documentation no longer reflects actual behavior.

In this approach, specifications and code evolve as equal partners. Tests enforce alignment between them, with BDD scenarios commonly serving as automated tests executing on every commit. Specifications provide continuously updated documentation that developers and stakeholders can trust. However, alignment maintenance requires discipline and tooling support — teams must commit to updating specifications whenever behavior changes.

Spec-anchored represents the optimal balance for most production systems. It provides clear documentation and verifiable requirements benefits without requiring complete code generation from specifications. BDD frameworks like Cucumber exemplify this approach, enabling human-readable scenarios that execute as automated tests. For API development, OpenAPI specifications paired with contract testing tools like Specmatic achieve similar specification-implementation alignment.

### II-C. Spec-as-Source: Humans Edit Specs, Machines Generate Code

Spec-as-source development treats specifications as the only artifacts humans edit directly. Code gets entirely generated from specifications and should never be manually modified. Any behavioral changes require specification updates and regeneration.

Spec-as-source represents the most radical SDD form. Specifications become, in effect, source code — simply expressed at higher abstraction levels. Developers think in requirements and behavior terms; machines translate to executable code. Changing functionality means changing specifications and regenerating — never editing generated code directly.

This approach, drawing on Design by Contract principles, fundamentally inverts traditional specification-code relationships: specifications become primary artifacts while code derives entirely from them. Manual code editing is either prohibited or confined to well-defined extension points. This requires mature, trusted generation tooling — developers must have confidence that generated code correctly implements specifications. In return, drift disappears by design: since code regenerates rather than being manually edited, specification-code alignment occurs automatically.

Spec-as-source already represents standard practice in domains with established code generation, such as generating API server stubs from OpenAPI specifications or producing certified embedded code from Simulink models. In automotive industries, engineers routinely build control algorithms in Simulink, verify behavior through simulation, and generate certified C code that nobody hand-edits. Emerging AI tools like Tessl aim to extend this approach to general software development. However, spec-as-source adoption requires high generation quality confidence and currently remains practical only where such confidence exists.

---

## III. The SDD Workflow

Spec-driven development operates through a common workflow across varied tools, with four core phases. Each phase produces an artifact constraining and guiding the next, creating accountability chains from intent through implementation.

### III-A. Phase 1: Specify

The specify phase addresses a fundamental question: What should software do? Output includes functional specifications describing behavior, requirements, and acceptance criteria — critically, without prescribing implementation details. This "what" versus "how" separation is essential to SDD's power.

During this phase, teams articulate user-facing behavior through user stories, scenarios, and acceptance criteria. They define success using Given/When/Then formats or input-output examples. Business rules and constraints receive explicit capture, and edge cases and error conditions get identified upfront rather than during implementation.

Specification quality directly determines subsequent deliverable quality. Good specifications share characteristics: they focus on behavior, describing what happens rather than how; they are testable, with verifiable requirements; they are unambiguous, allowing different readers the same interpretation; and they provide sufficient completeness for covering essential cases without over-specification. Effective specifications emphasize clarity, modularity, and self-checks guiding AI agents during implementation.

**Practice Principle:** Write specifications at detail levels eliminating ambiguity. If AI or developers could interpret requirements differently, add clarification. Where only one reasonable interpretation exists, avoid over-specification that constrains implementation unnecessarily.

### III-B. Phase 2: Plan

The plan phase addresses a different question: How should we build it? Given functional specifications, this phase produces technical plans covering architecture, data models, interfaces, and technology choices. Where specifications declare intent, plans declare implementation constraints.

Planning involves selecting appropriate technologies and frameworks, defining component architecture and boundaries, designing data models and schemas, specifying interfaces including APIs, messages, and contracts, and identifying non-functional requirements around performance, security, and scalability.

The plan phase bridges "what" and "how." It encodes constraints that implementations must respect — such as "use PostgreSQL for persistence" or "all API endpoints require authentication." When using AI coding assistants, plans provide crucial context: AI learns not just what to build but how systems are structured and what conventions apply. Without this context, even perfect functional specifications may yield code contradicting organizational standards or architectural decisions.

### III-C. Phase 3: Implement

The implement phase produces working code realizing specifications according to plans. In traditional development, this phase concentrates most effort. In SDD — particularly with AI assistance — this phase may be substantially automated, though human oversight remains essential.

Implementation begins by breaking plans into discrete, reviewable tasks. Each task then receives implementation via human developers, AI assistants, or hybrid approaches. Code undergoes review against both specification and plan for alignment verification. Unit tests encode specification requirements as executable assertions.

A key SDD principle involves working in small, validated increments. Rather than implementing entire specifications at once, teams break work into tasks delivering testable functionality pieces. This enables frequent checkpoints where humans verify alignment, catching drift early before compounding. Specifications act as "super-prompts" breaking complex problems into modular components aligned with agents' context windows, enabling AI systems to handle complexity that would overwhelm single-shot prompts.

### III-D. Phase 4: Validate

The validate phase addresses the critical closing question: Does code actually meet specifications? Validation closes loops, ensuring that specified requirements match built implementations. This phase combines automated verification with human judgment.

Validation encompasses running automated tests at unit, integration, and acceptance levels, executing BDD scenarios against implementations, reviewing non-functional requirement adherence, and conducting stakeholder acceptance testing where appropriate.

When validation reveals gaps — code not meeting specifications — teams face decisions: fix code or revise specifications. If original specifications were wrong or incomplete, updating them is appropriate. If code simply fails to meet valid specifications, fixing code becomes necessary. Either way, specifications remain authoritative. This discipline ensures specifications stay trustworthy — teams can rely on them because violations get detected and addressed rather than ignored.

---

## IV. How SDD Boosts AI Coding Agents

Large language models like GPT-4 or Claude, when functioning as coding agents, benefit substantially from SDD through optimized, context-rich inputs. Specifications act as super-prompts breaking complex problems into modular components aligned with agents' context windows. AI agents can generate code from specifications while self-verifying against requirements adherence checklists.

Emerging empirical studies suggest that human-refined specifications significantly improve LLM-generated code quality, with controlled studies indicating error reductions reaching 50%. This boosting effect particularly appears in scalable scenarios: specifications enable parallel agent execution across non-overlapping tasks, with dependency orchestration. Teams can partition work at specification levels, allowing multiple AI agents to implement different components simultaneously without interference.

Remaining challenges include LLM non-determinism — even structured specifications sometimes lead to varying outputs. Property-based testing addresses this by automatically verifying that specification invariants remain satisfied regardless of implementation variations. In embedded systems and safety-critical domains, SDD combines LLM generation with formal verification ensuring standards compliance like ISO 26262. Overall, SDD transforms AI agents from reactive tools into proactive collaborators, particularly enhancing efficiency in brownfield projects where legacy constraints get encoded in specifications.

An emerging approach involves "self-spec" methods where LLMs author their own specifications before generating code. Agents first produce specifications from high-level prompts, which humans then review and refine before the same or another agent implements against them. This creates explicit planning-execution separation, catching requirement misunderstandings before code generation.

---

## V. Tools and Frameworks

Various tools support spec-driven development, from traditional testing frameworks to contemporary AI-assisted toolkits. Common approaches include phased workflows (specify, plan, tasks, implement) and tools ranging from Kiro for VS Code-based specifications to spec-kit for CLI-driven projects to Tessl for spec-as-source models.

| Category | Examples | Role in SDD |
|----------|----------|-------------|
| BDD Frameworks | Cucumber, SpecFlow, Behave | Write executable specs in plain language (Gherkin) |
| TDD Frameworks | RSpec, JUnit, pytest | Encode specifications as unit tests |
| API Specification | OpenAPI/Swagger, GraphQL SDL, Protocol Buffers | Define contracts; generate code and tests |
| Contract Testing | Pact, Specmatic | Verify implementations match specs |
| AI-Assisted SDD | GitHub Spec Kit, Amazon Kiro, Tessl | Structured AI workflows from spec to code |
| Model-Based Design | Simulink, SCADE | Visual specs that generate embedded code |

### V-A. Behavior-Driven Development (BDD) Frameworks

BDD frameworks enable writing specifications in near-natural language executable as tests. The canonical format is Gherkin, using structured scenarios with Given/When/Then clauses:

```gherkin
Feature: Shopping Cart
  Scenario: Adding item to empty cart
    Given the cart is empty
    When I add item "Widget" to the cart
    Then the cart should contain 1 item
    And the item should be "Widget"
```

These scenarios serve dual purposes: stakeholder-readable documentation and automated tests verifying code. Tools like Cucumber (Ruby, Java, JavaScript), SpecFlow (.NET), and Behave (Python) execute scenarios against applications, bridging business requirements and technical implementation gaps.

**Best Practice:** Write BDD scenarios before implementation, involve stakeholders in creation, and treat them as authoritative feature behavior descriptions. When scenarios pass, confidence exists that systems meet documented requirements.

### V-B. API Specification Tools

In API development, spec-driven approaches represent standard practice under "design-first" or "API-first" nomenclature for years. OpenAPI enables teams to define REST APIs with complete endpoint specifications, request-response schemas, and examples, then generate server stubs, client SDKs, and documentation from specifications. GraphQL SDL allows defining types, queries, and mutations in schemas that become frontend-backend contracts, enabling parallel development. For event-driven architectures, AsyncAPI provides similar specification capabilities. Protocol Buffers and gRPC enable service interface and message type definition with automatic strongly-typed client-server code generation.

API specification tool benefits are clear: once API specifications receive agreement, frontend and backend teams work in parallel with confidence. The specification becomes the contract; any implementation matching the specification proves valid by definition. Contract testing tools like Pact and Specmatic automate verification that implementations actually match their specifications.

### V-C. AI-Assisted SDD Tools

Emerging tools structure AI coding workflows explicitly around specifications, recognizing that multi-step prompting with explicit artifacts yields better results than single-shot "just code this" approaches.

**GitHub Spec Kit** is an open-source toolkit providing commands for spec-driven AI development. The workflow follows four explicit phases: `/specify` generates detailed specifications from prompts, `/plan` creates technical architecture, `/tasks` breaks plans into implementation tasks, and implementation generates code task-by-task. At each phase, humans review and refine before proceeding, maintaining intent-implementation alignment.

**Amazon Kiro** guides users through requirements, design, and task creation stages before any code generation begins. Kiro emphasizes structured requirements capture and iterative refinement, ensuring AI has clear context before implementation attempts. The explicit staging prevents AI from guessing about unspecified requirements.

**Tessl** adopts the most radical approach: spec-as-source where specifications become maintained artifacts and code gets regenerated from them. Tessl represents emerging "specs as the new source code" visions, where developers never edit generated code — they edit specifications and regenerate.

These tools share a common insight: separating planning from implementation allows agents to focus on execution within defined boundaries, reducing non-determinism plaguing loosely-prompted AI coding.

---

## VI. Case Studies

### VI-A. Case Study 1: API-First Microservices

**Domain:** Financial services microservices
**Pattern:** Spec-anchored with OpenAPI
**Outcome:** 75% integration cycle time reduction

A financial services company faced "integration hell" — microservices frequently failed when deployed together because teams made incompatible API contract assumptions. Each team implemented services in isolation, with incompatibilities surfacing only during integration testing, requiring expensive rework.

The company mandated API-first development as their solution. Before implementing any service, teams wrote OpenAPI specifications defining endpoints, request-response schemas, and error conditions. Consumer teams reviewed these specifications and provided feedback before any coding began, front-loading integration discussions that previously happened too late.

They used Specmatic to generate mock servers from specifications, allowing frontend development to proceed in parallel with backend work. Critically, Specmatic validated that implemented services matched their specifications in CI. Any deviation caused build failures, preventing drift accumulation.

Integration failures dropped dramatically after adoption. Teams reported 75% reduction in API change cycle time because incompatibilities got caught at specification review stages rather than in production. Specifications became contracts that all parties trusted, eliminating ambiguity that caused extensive rework.

### VI-B. Case Study 2: BDD for Enterprise Features

**Domain:** Enterprise project management software
**Pattern:** Spec-anchored with Cucumber
**Outcome:** Stakeholder-verifiable requirements; reduced requirement ambiguity

An enterprise software team discovered that developers and product managers frequently disagreed on "done" definitions for features. Developers would implement something they believed met requirements; QA would find it didn't match product expectations, and arguments erupted about whose interpretation was correct. The lack of shared, authoritative expected behavior definitions caused friction and rework.

The team adopted Cucumber for all user-facing features. Product managers wrote Gherkin scenarios describing expected behavior in plain language. Developers implemented step definitions automating these scenarios as executable tests. Features only reached "done" status when all scenarios passed, providing objective, verifiable completion definitions.

Gherkin scenarios became shared language readable by business and technical stakeholders. Product managers could verify scenarios captured their intent. When disputes arose, scenarios became the authority — if scenarios were wrong, they received explicit stakeholder updates; if code was wrong, developers fixed it. This eliminated ambiguity that caused extensive rework and conflict.

### VI-C. Case Study 3: Model-Based Embedded Development

**Domain:** Automotive engine control
**Pattern:** Spec-as-source with Simulink
**Outcome:** Verified control logic; certified code generation

An automotive supplier needed to develop engine control software meeting ISO 26262 safety certification requirements. Manual coding proved error-prone, and certification required tracing every code line to specific requirements — labor-intensive when code was hand-written.

The team used MathWorks Simulink to model control algorithms as block diagrams with state machines. The model became the specification: engineers simulated and verified behavior at model levels, catching algorithmic errors before any code existed. Once model verification completed through simulation, certified code generators auto-produced code from the model.

Model-to-code generation itself was certified, meaning generated C code was guaranteed to behave as models specified. Engineers never edited generated code; if control logic required changing, they changed models and regenerated. This ensured verified models and deployed code remained perfectly aligned automatically.

This approach embodies spec-as-source at its most rigorous: specifications (Simulink models) become the only artifacts humans modify, and implementations (C code) entirely derive from them. SDD in embedded systems combines LLM generation with formal verification ensuring safety-critical compliance, demonstrating how specifications ensure precision in domains like automotive and aerospace where errors prove catastrophic.

---

## VII. The Redefinition of Developer Work

SDD fundamentally reshapes the meaning of software developer work. Developers are shifting from manual coding to orchestrating specifications, reviewing AI outputs, and focusing on high-level design. This transition potentially increases efficiency but introduces new challenges around specification maintenance, tool mastery, and judgment about AI output correctness.

In greenfield projects, developers become architects designing systems through specifications rather than code. They focus on requirements elicitation, constraint definition, and acceptance criteria — the "what" rather than the "how." AI agents handle spec-to-implementation translation, but humans remain responsible for ensuring specifications capture actual requirements.

In brownfield projects and legacy systems, SDD enables different work: encoding existing behavior as specifications before making changes. By extracting specifications from legacy code, teams can verify that modernization efforts preserve required functionality while eliminating undocumented behaviors. Specifications become bridges between old and new implementations.

Use cases span development spectrums: greenfield projects where specifications guide initial development, feature additions to legacy systems where specifications document existing behavior before modification, and embedded software where specifications ensure safety-critical domain precision. In each case, developer roles shift from code producers to specification authors and AI orchestrators.

---

## VIII. When to Use SDD

Spec-driven development is not universally applicable. Like any practice, it carries costs — upfront specification effort, tooling investment, and discipline requirements — and benefits — clarity, quality, and maintainability. A decision framework helps practitioners determine when SDD adds value.

**SDD demonstrates clear value when:**

- **Using AI coding assistants** — specifications dramatically improve output quality by removing ambiguity that forces AI to guess.
- **Complex requirements** — stakeholders can validate that systems meet needs before code generation.
- **Multi-maintainer systems** — specifications serve as documentation surviving team turnover.
- **Integration-heavy systems** — API specifications enable parallel development and prevent integration failures.
- **Regulated domains** — requirements-to-implementation traceability is often mandated, which SDD provides naturally.
- **Legacy modernization** — extracting specifications from existing behavior enables clean reimplementation with confidence.

**SDD may prove excessive when:**

- **Throwaway prototypes** — specification investment gets discarded along with the prototype.
- **Solo, short-lived projects** — overhead exceeds benefits when only one developer exists and long-term maintenance is absent.
- **Exploratory coding** — premature specification constrains learning when you don't yet know what you're building.
- **Simple CRUD applications** — obvious requirements need minimal specifications; if requirements are unlikely to be misinterpreted, elaborate specifications add cost without value.

**Golden Rule:** Use minimum specification rigor that removes ambiguity for your context. Apply spec-first for AI-assisted initial development; spec-anchored for long-lived production systems; spec-as-source only when generation tooling is mature and trusted.

---

## IX. Common Pitfalls

Teams adopting SDD often encounter predictable challenges that can undermine the approach's benefits if unaddressed.

**Over-specification** occurs when teams write overly detailed specifications, essentially becoming pseudo-code. This defeats SDD's purpose — separating "what" from "how." If specifications read like code, over-constraint has occurred — implementation has been unnecessarily limited and abstraction benefits enabling spec value are lost.

**Specification rot** affects spec-anchored approaches when teams fail to update specifications as code changes. Specifications drift from reality, losing documentation value and eroding trust. The solution involves automated enforcement through tests failing when specifications and code diverge, making drift visible and painful rather than silent and accumulating.

**Specification as bureaucracy** emerges when specifications become forms to complete rather than clarity tools. If specification processes add overhead without improving understanding or quality, teams will game systems or abandon them. Specifications should represent the minimum ambiguity removal needed, not comprehensive documentation exercises.

**Tooling complexity** can overwhelm teams, particularly with AI-assisted tools generating elaborate artifacts. Teams may drown in generated plans, task lists, and intermediate documents. Solutions involve starting simply and adding tooling complexity only when demonstrably helping — avoid elaborate workflows providing process without value.

**False confidence** represents perhaps the subtlest pitfall. Passing specification tests don't guarantee correct software — they only guarantee software matching specifications. If specifications are wrong, code will faithfully implement incorrectly. Specifications require the same careful review as code; they are not silver bullets eliminating the need for judgment about requirements.

---

## X. SDD vs Traditional Design Documents

A natural question arises: how does SDD differ from traditional High-Level Design (HLD) and Low-Level Design (LLD) documents that software engineering has always employed? After all, HLD describes architecture, LLD details implementation, and requirements documents specify functionality.

Traditional software engineering produces many specification-like artifacts: Software Requirements Specifications for functional and non-functional requirements, High-Level Design documents for architecture and components, Low-Level Design documents for class diagrams and algorithms, and interface specifications for API contracts and IDL.

The problem is not specification absence — it is drift. By Sprint 3, HLD becomes outdated. By release 2, SRS no longer matches products. Code becomes de facto truth, and documents become historical artifacts that nobody trusts or updates.

**Core Difference:** Traditional design documents are advisory — developers read them, then write code hopefully matching. SDD specifications are enforced — tests fail if code diverges, and in spec-as-source approaches, code regenerates rather than receiving manual editing.

What SDD actually adds is threefold:

1. **Executable specifications** — traditional specs get read by humans, while SDD specs execute as BDD scenarios, API contract tests, or model simulations. If code doesn't match, builds fail.
2. **CI/CD integration** — modern SDD embeds specification validation into continuous integration, checking every commit against specifications so drift gets caught immediately rather than during quarterly reviews.
3. **AI consumption** — traditional design documents were written for human readers, while SDD specs are structured for AI coding assistant consumption, generating code and tests from specifications rather than guessing from vague prompts.

SDD is not revolution — it is evolution. The core insight (write specifications first, let code derive from them) has been agile wisdom for decades. What is new is better tooling making executable specifications practical, CI/CD maturity enabling automated enforcement, and AI as consumers where specification quality directly determines output quality. As one observer noted: "SDD is not a revolution… it's just BDD with branding." But the branding serves a purpose: it reminds practitioners that specifications should be authoritative rather than advisory, and modern tooling can enforce what previously relied on human discipline.

---

## XI. Relationship to Existing Practices

SDD is not a replacement for existing development practices — it builds on and extends them within AI-assisted development contexts.

**Test-Driven Development (TDD)** represents SDD at unit levels. Writing tests first means writing micro-specifications defining expected behavior before implementation. SDD extends this thinking to higher levels — features, systems, and architectures — applying "specify first" discipline at broader scope.

**Behavior-Driven Development (BDD)** is the most direct SDD ancestor. Gherkin scenarios are executable specifications bridging business requirements and technical implementation. What AI-assisted SDD tools add is code generation assistance from those specifications, accelerating spec-to-working-software paths.

**Domain-Driven Design (DDD)** aligns well with SDD through ubiquitous language emphasis — specifications written in domain terms meaningful to developers and stakeholders. The shared vocabulary that DDD advocates becomes specification foundations meaningful to all parties.

**Agile methodologies** are compatible with SDD. User stories with acceptance criteria are specifications; Definition of Done represents specification forms. The difference involves emphasis: SDD treats these artifacts as authoritative rather than advisory, and enforces alignment through automation rather than relying on human discipline alone.

---

## XII. Conclusion

Spec-driven development inverts traditional specification-code relationships. Instead of code being truth with documentation as afterthought, SDD makes specifications authoritative and code derivative. This inversion becomes increasingly important as AI coding assistants become more capable — when AI can generate code from specifications faster than humans can type, specification quality becomes the bottleneck.

Specifications remove ambiguity for both human developers and AI assistants, preventing guesswork and misinterpretation that leads to costly rework. The three rigor levels — spec-first, spec-anchored, and spec-as-source — provide options matching different project needs, from lightweight initial clarity to rigorous code generation. Mature tooling exists across the spectrum, from BDD frameworks and API specification tools to AI-assisted SDD toolkits, making spec-first workflows practical today. Teams should match rigor to need, using minimum specification discipline that removes ambiguity for their contexts rather than over-engineering processes.

SDD builds on decades of TDD and BDD wisdom while adapting these practices for AI eras. The ideas are not new; what is new is tooling and AI capabilities making specifications more powerful than ever. Work is being redefined as developers shift from manual coding to orchestrating specifications, reviewing AI outputs, and focusing on high-level design.

As software systems grow more complex and AI becomes more capable, the question shifts from "what code should I write?" to "what specification should I provide?" Teams mastering spec-driven development will get more value from AI tools while maintaining clarity and traceability that complex systems require. SDD offers a systematic framework for answering that question — making specifications, not code, the primary software development artifact.

---

## References

[1] GitHub, "Spec-Driven Development with AI: Get Started with a New Open Source Toolkit," GitHub Blog, 2025. Available: https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/

[2] Thoughtworks, "Spec-Driven Development," Technology Radar, Vol. 32, 2025. Available: https://www.thoughtworks.com/radar/techniques/spec-driven-development

[3] B. Finster, "5-Minute DevOps: Spec-Driven Development Isn't New," Medium, Nov. 2025. Available: https://bdfinst.medium.com/5-minute-devops-spec-driven-development-isnt-new-3a5c552efc95

[4] M. Fowler, "Exploring Gen AI: Spec-Driven Development," martinfowler.com, 2025. Available: https://martinfowler.com/articles/exploring-gen-ai.html

[5] L. Griffin and R. Carroll, "Spec Driven Development: When Architecture Becomes Executable," InfoQ, Jan. 2026. Available: https://www.infoq.com/articles/spec-driven-development/

[6] R. Naszcyniec, "How Spec-Driven Development Improves AI Coding Quality," Red Hat Developer, 2025. Available: https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality

[7] Cucumber, "Cucumber Documentation," cucumber.io, 2024. Available: https://cucumber.io/docs/

[8] OpenAPI Initiative, "OpenAPI Specification v3.1.0," 2024. Available: https://spec.openapis.org/oas/v3.1.0

[9] Specmatic, "Contract-Driven Development with Specmatic," 2025. Available: https://specmatic.io/

[10] MathWorks, "Simulink: Simulation and Model-Based Design," 2024. Available: https://www.mathworks.com/products/simulink.html

[11] K. Beck, Test Driven Development: By Example, Addison-Wesley, 2002.

[12] D. North, "Introducing BDD," dannorth.net, Mar. 2006. Available: https://dannorth.net/introducing-bdd/

[13] Amazon Web Services, "Kiro: Agentic AI Development from Prototype to Production," 2025. Available: https://kiro.dev/

[14] Tessl, "Tessl: Make Agents Work in Real Codebases," 2025. Available: https://tessl.io/

[15] GitHub, "GitHub Copilot Documentation," 2024. Available: https://docs.github.com/en/copilot

[16] Cucumber, "Gherkin Reference," 2024. Available: https://cucumber.io/docs/gherkin/reference/

[17] GraphQL Foundation, "GraphQL Specification," 2024. Available: https://spec.graphql.org/

[18] Google, "Protocol Buffers Documentation," 2024. Available: https://protobuf.dev/

[19] gRPC Authors, "gRPC Documentation," 2024. Available: https://grpc.io/docs/

[20] Pact Foundation, "Pact Documentation," 2024. Available: https://docs.pact.io/

[21] Reqnroll Contributors (formerly SpecFlow), "Reqnroll Documentation," 2024. Available: https://docs.reqnroll.net/

[22] Behave, "Behave: BDD for Python," 2024. Available: https://behave.readthedocs.io/

[23] SmartBear, "What Is API-First Development?," Swagger.io, 2024. Available: https://swagger.io/resources/articles/adopting-an-api-first-approach/

[24] B. Meyer, "Applying Design by Contract," IEEE Computer, vol. 25, no. 10, pp. 40-51, 1992.

[25] ISO, "ISO 26262: Road vehicles - Functional safety," International Organization for Standardization, 2018.

[26] S. J. Mellor and M. J. Balcer, Executable UML: A Foundation for Model-Driven Architecture, Addison-Wesley, 2002.

[27] AsyncAPI Initiative, "AsyncAPI Specification," 2024. Available: https://www.asyncapi.com/

[28] M. Chen et al., "Evaluating Large Language Models Trained on Code," arXiv:2107.03374, 2021.
