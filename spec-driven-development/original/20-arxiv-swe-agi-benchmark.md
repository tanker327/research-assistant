# SWE-AGI: Benchmarking Specification-Driven Software Construction with MoonBit in the Era of Autonomous Agents

**Source:** https://arxiv.org/abs/2602.09447
**ArXiv ID:** 2602.09447 (cs.SE, cs.AI, cs.CL)
**Submitted:** February 10, 2026 (v1); February 11, 2026 (v2)
**Authors:** Zhirui Zhang, Hongbo Zhang, Haoxiang Fei, Zhiyuan Bao, Yubin Chen, Zhengyu Lei, Ziyue Liu, Yixuan Sun, Mingkun Xiao, Zihang Ye, Yu Zhang, Hongcheng Zhu, Yuxiang Wen, Heung-Yeung Shum
**Affiliation:** The Hong Kong University of Science and Technology
**Corresponding Author:** hshum@ust.hk
**GitHub:** https://github.com/moonbitlang/SWE-AGI

---

## Abstract

Although large language models (LLMs) have demonstrated impressive coding capabilities, their ability to autonomously build production-scale software from explicit specifications remains an open question. In this paper, we introduce SWE-AGI, the first open-source benchmark for evaluating end-to-end, specification-driven construction of software systems written in MoonBit. SWE-AGI tasks require LLM-based agents to implement a range of software systems, including parsers, interpreters, binary decoders, and SAT solvers, strictly from authoritative standards and RFCs under a fixed API scaffold. Each task involves implementing 10³–10⁴ lines of core logic, corresponding to weeks or months of engineering effort for an experienced human developer. By leveraging the nascent MoonBit ecosystem, SWE-AGI minimizes data leakage, forcing agents to rely on long-horizon architectural reasoning rather than code retrieval. Across frontier models, gpt-5.3-codex achieves the best overall performance (solving 19/22 tasks, 86.4%), outperforming claude-opus-4.6 (15/22, 68.2%), and kimi-2.5 exhibits the strongest performance among open-source models. However, performance degrades sharply with increasing task difficulty, particularly on hard, specification-intensive systems. Behavioral analysis further reveals that as codebases scale, code reading, rather than writing, becomes the dominant bottleneck in AI-assisted development. Overall, while specification-driven autonomous software engineering is increasingly viable, substantial challenges remain before it can reliably support production-scale development.

---

## 1 Introduction

Large language models (LLMs) are increasingly deployed as software engineering (SWE) agents: they read specifications, write and refactor code, run tests, and iterate over long trajectories. As this workflow becomes a practical interface for building and maintaining software, evaluation must move past single-shot code completion to address a more fundamental challenge: can an AI system autonomously carry out a production-scale implementation from explicit requirements to generate a correct, robust, and maintainable codebase?

Most existing benchmarks only partially capture this end-to-end capability. Function- and problem-level tasks (HumanEval, MBPP) are often short-horizon and can be solved via pattern matching or overfitting to limited tests. Repository-issue benchmarks (SWE-bench, SWE-bench Pro, SWE-agent) more closely reflect iterative development, but their results are frequently confounded by repository-specific conventions, hidden degrees of freedom in tooling, and difficult-to-control training-data overlap. To measure autonomy at this level, a benchmark should instead be specification-grounded, production-scale, and evaluated using deterministic, human-validated tests under a standardized interface.

In this paper, we introduce SWE-AGI, the first open-source benchmark for assessing autonomous software engineering through specification-driven, from-scratch system construction in MoonBit, a modern programming language with a nascent ecosystem. Leveraging MoonBit's native support for spec-first development and its integrated toolchain, SWE-AGI tasks require LLM-based agents to implement production-grade, standards-compliant systems in MoonBit strictly from authoritative specifications within a fixed API scaffold. Concretely, MoonBit supports declaration-first workflows via the `declare` keyword, which allows developers to write function signatures and type declarations first and provide implementations later. Combined with the unified build/test/package workflow (`moon`), this yields a standardized end-to-end engineering workflow that closely matches real-world practice. Since SWE-AGI focuses on production-scale software systems that are largely absent from the current MoonBit ecosystem (e.g., a CDCL SAT solver, a WASM decoder/validator, and a standards-compliant C99 parser), it explicitly prioritizes _reasoning over retrieval_: success depends on sustained specification understanding, architectural decision-making, and disciplined long-horizon implementation rather than recalling near-matching reference code.

SWE-AGI targets production-scale software engineering and consists of 22 tasks spanning seven categories. These tasks are stratified into three difficulty tiers based on code volume and implementation complexity, comprising 6 easy, 8 medium, and 8 hard tasks. Completing the core logic of a SWE-AGI task requires 10³–10⁴ lines of implementation under a fixed API scaffold, corresponding to weeks to months of engineering effort for an experienced human developer. To support evaluation at this scale, each task provides normative specifications (`specs/`), an explicit task statement (`TASK.md`), and a visible public test subset for local iteration, while benchmark scoring is performed solely on final submissions evaluated against hidden private tests. This evaluation design shifts the challenge from isolated code generation to an end-to-end software engineering process, requiring agents to demonstrate sustained autonomy rather than relying on one-shot generation: interpreting complex specifications, becoming familiar with MoonBit, architecting modular systems, and performing self-directed testing.

In the latest evaluation, gpt-5.3-codex achieves the strongest overall performance (solving 19/22 tasks, 86.4%), outperforming gpt-5.2-codex (17/22, 77.3%), claude-opus-4.6 (15/22, 68.2%), and claude-opus-4.5 (10/22, 45.5%). Although these frontier agents successfully complete all easy-tier tasks, performance degrades on the medium and hard tiers as task difficulty increases: success rates for both gpt-5.3-codex and gpt-5.2-codex decline sharply on hard tasks, whereas claude-opus-4.6 and claude-opus-4.5 begin to falter from the medium tier onward. In addition, several other LLMs are evaluated on six easy-tier tasks, including gemini-3-flash, kimi-k2.5, claude-sonnet-4.5, deepseek-v3.2, glm-4.7, and qwen3-max. Most of these models solve at most 2/6 easy tasks, revealing a substantial performance gap relative to the evaluated frontier agents even at the lowest difficulty level. Among these easy-tier baselines, kimi-k2.5 achieves the highest overall test-suite pass rate (92.0%) while tying for the best task success rate (2/6). A behavioral analysis of end-to-end SWE agents reveals that code reading, rather than code writing, emerges as the central bottleneck in AI-assisted software development. As codebases scale, maintaining a coherent modular architecture becomes the dominant activity.

This paper makes three contributions:

- **SWE-AGI benchmark:** The first benchmark focusing on the end-to-end construction of complex systems from authoritative standards. It shifts the evaluation paradigm from localized code completion to long-horizon architectural reasoning and rigorous system implementation.
- **Retrieval-resistant evaluation design:** A specification-grounded setting leveraging MoonBit's nascent ecosystem and spec-first primitives, ensuring that success reflects genuine long-horizon engineering capabilities rather than recall of near-matching artifacts.
- **Comprehensive empirical and behavioral analysis:** Benchmarking of state-of-the-art SWE agents built on frontier LLMs, revealing strong performance on easy-tier tasks but substantial degradation as task difficulty increases.

**Figure 1:** SWE-AGI benchmark execution pipeline. From a cold-start starter repository (inputs: TASK.md, normative specs/, a MoonBit scaffold, and public tests), an autonomous agent iterates over design/implementation and local testing, submits the project for evaluation (via `swe-agi-submit`), receives pass/fail feedback, and repeats until a verified submission passes.

---

## 2 SWE-AGI Benchmark

SWE-AGI evaluates autonomous software engineering through _specification-driven, from-scratch_ construction of production-scale systems under a fixed MoonBit scaffold.

### 2.1 Task Formulation

Each task is framed as the construction of a complete software system _from explicit specifications_ (e.g., RFCs and standards) under a fixed MoonBit API scaffold. Concretely, a task is distributed as a starter repository that provides:

1. An explicit task statement (`TASK.md`) with acceptance criteria, constraints, and executable instructions
2. Normative references (`specs/`)
3. Declaration-first API scaffolding that fixes the public interface
4. A visible public test subset for fast local iteration

These components collectively define the core loop of the AI agent: interpreting the specifications, implementing against a fixed interface, validating locally, and iteratively submitting until the hidden private tests pass.

Evaluation considers only final submissions against hidden private tests, allowing agents full freedom in intermediate reasoning, testing, and implementation strategies. Private tests reduce overfitting to the visible suite and enforce specification-grounded implementations, while preserving an iterative, real-world-like engineering loop. During development, agents may supplement the provided public tests with their own spec-grounded checks, perform local validation via `moon test`, and iteratively submit solutions using `swe-agi-submit` until the submission passes the private test suite.

**Conceptual contrast with SWE-bench:** SWE-bench uses a SWE-bench-style setting (issue resolution in existing repositories), whereas SWE-AGI uses specification-driven implementation (with agent-written tests) in a fixed scaffold.

### Benchmark Comparison (Table 1)

| Benchmark | Primary Goal | Typical Code Scale | Workload | Difficulty Focus | Evaluation Criteria |
|---|---|---|---|---|---|
| HumanEval | Function synthesis | ~10¹ LOC | Minutes | Local correctness | Unit tests |
| MBPP | Small programs | ~10¹–10² LOC | Minutes–hours | Edge cases; basic reasoning | Unit tests |
| APPS | Programming problems | ~10²–10³ LOC | Hours | Problem solving; I/O behavior | Test-based |
| LiveCodeBench | Programming problems (time-based) | ~10²–10³ LOC | Hours | Contamination-resistant coding skill | Test-based; time-evolving set |
| RepoBench | Repository-level completion | ~10¹–10² LOC | Seconds–minutes | Cross-file context retrieval | Completion accuracy |
| SWE-bench | Repo issue resolution | ~10¹–10³ LOC | Hours–days | Debugging; tool use; integration | Repository tests (CI) |
| SWE-bench Pro | Repo issue resolution (enhanced) | ~10¹–10³ LOC | Hours–days | Debugging; improved coverage | Repository tests (CI) |
| **SWE-AGI** | **Autonomous SWE from explicit specifications** | **~10³–10⁴ LOC** | **Weeks–months** | **Spec comprehension; system design** | **Hidden private tests via submission** |

Compared to common coding benchmarks, SWE-AGI shifts the primary sources of difficulty toward specification reading and operationalization, long-horizon system design and multi-module implementation, and iterative debugging/refactoring under build/test feedback in an open development setting. (External tools such as web search may be used, but are less helpful when near-matching implementations are unavailable.) Each task typically requires implementing 10³–10⁴ lines of core logic, corresponding to weeks or months of engineering effort for an experienced human developer, and is accompanied by high-coverage, human-validated test suites that evaluate both functional correctness on well-formed inputs and robustness to malformed inputs.

### 2.2 Benchmark Construction

SWE-AGI consists of 22 tasks spanning seven categories:

1. **Template and Domain-Specific Languages:** pug, jq
2. **Data Serialization and Configuration Formats:** csv, ini, yaml, toml
3. **Markup and Document Formats:** xml, html5
4. **Programming Language Front-Ends:** c99, lua, ecma262, python, r6rs
5. **Binary Formats and Streaming Decoders:** git_object, protobuf, zip, capnp, wasm
6. **Networking and Protocol State Machines:** uri, hpack, url
7. **Automated Reasoning and SAT Solving:** cdcl

Each task is framed as an end-to-end software system with a fixed API scaffold. Tasks are assigned to three coarse difficulty tiers (Easy/Medium/Hard), primarily based on the estimated scale of core implementation code (excluding tests), and further informed by semantic complexity indicators such as multi-phase parsing and validation, large state machines, and strict error-recovery requirements.

SWE-AGI prioritizes _reasoning over retrieval_ and is explicitly designed to minimize superficial success through memorization or direct code reuse. Accordingly, the benchmark focuses on systems that are largely absent from the current MoonBit ecosystem and that demand sustained engagement with formal specifications and non-trivial engineering decisions, including interface design, data-structure selection, and robust error handling.

#### Repository Packaging

Tasks are constructed by selecting authoritative upstream specifications (e.g., standards, RFCs, and reference documents), distilling explicit acceptance criteria—including corner cases and error semantics—into `TASK.md`, and providing a fixed API scaffold together with high-coverage test suites. The test suites comprise a visible public subset for local iteration and a hidden private subset for verification.

Typical directory layout for a SWE-AGI task:

```
tasks/<task>/
  specs/              # upstream specs and reference documents
  TASK.md             # goal, scope, API, behavioral rules, test execution
  *_spec.mbt          # fixed API declarations + helper contracts
  *_pub_test.mbt      # public tests (subset of full suite)
  *_priv_test.mbt     # private tests (held out; only in evaluation checkout)
  moon.mod.json       # package manifest and dependencies
  moon.pkg.json       # package lockfile (pinned deps)
```

#### Test Sets and Evaluation Metrics

Tests in SWE-AGI are constructed through a hybrid process. Canonical cases are adapted from authoritative specifications and reference materials, and are expanded with systematic edge cases—including property-based generators, LLM-generated candidates, and fuzz-style mutations where appropriate—followed by manual triage to ensure specification-consistent expectations.

SWE-AGI reports both _functional_ and _engineering_ metrics:

**Functional metrics:**
- Task success rate
- Test-suite pass rate (overall)

**Engineering metrics:**
- Time to solution (wall-clock)
- Implementation size (core LOC)
- Behavioral statistics for detailed agent analysis

Performance metrics such as runtime and memory usage are not scored in the current release, but are reserved for future versions once state-of-the-art models achieve consistently high task success rates.

### 2.3 Language Choice: MoonBit

SWE-AGI adopts MoonBit as its implementation language to control distributional bias during evaluation. As a relatively new programming language with a still-maturing ecosystem, MoonBit is largely absent from existing large-scale pretraining corpora and public code repositories. This reduces the likelihood that agents can exploit memorized near-solutions or ecosystem-specific shortcuts, thereby shifting the evaluation signal toward specification comprehension, algorithmic reasoning, and correct end-to-end implementation.

MoonBit's type soundness and unified toolchain further improve the quality and timeliness of feedback available to autonomous agents. Its emphasis on data-oriented programming, immutability, and exhaustive pattern matching surfaces many classes of errors—such as missing cases, violated invariants, and type mismatches—at compile time rather than at runtime. Moreover, MoonBit implementations are often more concise for a given specification, reducing overall code volume and the surface area for latent bugs. Combined with fast compilation (MoonBit can compile hundreds of packages in approximately one second) and test execution via the `moon` toolchain, these properties enable high-frequency compile–test–refine cycles with low feedback latency, providing earlier and more actionable signals within the agent loop.

MoonBit's built-in support for separating interface and implementation enables a scaffolded evaluation setup in which public APIs, type signatures, and module boundaries are explicitly fixed using `declare`. Agents are required to implement the specified interfaces exactly, with deviations detected at compile time rather than implicitly tolerated at runtime. This enforces clear boundaries, prevents interface-level circumvention, and ensures that evaluation focuses on the correctness and robustness of the implemented logic rather than flexibility in interface design.

Example of declaration-first, spec-driven workflow in MoonBit (the `declare` keyword fixes public types and function signatures before implementation):

```moonbit
declare pub(all) type CProgram

/// Parse a C99 translation unit from source text.
declare pub fn parse(code: StringView) -> CProgram raise

/// Encode the parsed program into the explicit test JSON schema
declare pub fn CProgram::to_test_json(self: CProgram) -> Json
```

---

## 3 Evaluation of Frontier Agents

We evaluate software engineering agents built on frontier models on SWE-AGI under an open development setting in which the scored private tests are hidden from the model. Throughout, "model" refers to the underlying LLM, and "agent" refers to the model coupled with an execution front-end, tool access, and associated policies. Agents must translate `TASK.md` plus authoritative references (`specs/`) into a working MoonBit implementation under a fixed scaffold, iterate locally using public tests (10% of all tests), and submit via `swe-agi-submit` until the evaluator reports that hidden private tests pass.

### 3.1 Setup

Agents evaluated on all 22 tasks:
- **gpt-5.3-codex** via Codex CLI (xhigh thinking mode)
- **gpt-5.2-codex** via Codex CLI (high thinking mode)
- **claude-opus-4.6** via Claude Code
- **claude-opus-4.5** via Claude Code

Additional models evaluated on 6 easy-tier tasks only:
- **claude-sonnet-4.5** via Claude Code
- **kimi-k2.5** (kimi-k2.5-thinking) via Kimi CLI
- **glm-4.7** via Claude Code
- **gemini-3-flash** via Gemini CLI (note: repeated execution failures observed, including "Loop detected" and API errors; gemini-3-pro omitted due to stability issues)
- **deepseek-v3.2** (deepseek-reasoner) via Claude Code
- **qwen3-max** (qwen3-max-thinking, 2026-01-23) via Claude Code

A task is considered _passed_ if the final submitted project compiles and the evaluator reports zero failed hidden private tests in a clean checkout; otherwise it is _failed_. No explicit budget constraint is enforced; token consumption and wall-clock time are reported as post hoc efficiency metrics.

### 3.2 Main Results

#### Overall Performance

On the **easy tier**, all four frontier agents (gpt-5.3-codex, gpt-5.2-codex, claude-opus-4.6, claude-opus-4.5) solve 6/6 tasks with 100% test-suite pass rate, indicating that for small parsers/decoders the end-to-end loop can be executed reliably.

On the **medium and hard tiers**, outcomes diverge sharply:

| Agent | Easy (6 tasks) | Medium (8 tasks) | Hard (8 tasks) | Total (22 tasks) | Overall % |
|---|---|---|---|---|---|
| gpt-5.3-codex | 6/6 | 8/8 | 5/8 | 19/22 | 86.4% |
| gpt-5.2-codex | 6/6 | 7/8 | 4/8 | 17/22 | 77.3% |
| claude-opus-4.6 | 6/6 | 5/8 | 4/8 | 15/22 | 68.2% |
| claude-opus-4.5 | 6/6 | 3/8 | 1/8 | 10/22 | 45.5% |

Easy-tier sweep of additional models (6 tasks):

| Agent | Easy Tasks Solved | Notes |
|---|---|---|
| kimi-k2.5 | 2/6 | Highest test-suite pass rate (92.0%) among this group |
| glm-4.7 | 2/6 | — |
| gemini-3-flash | 2/6 | Execution stability issues noted |
| deepseek-v3.2 | 1/6 | — |
| claude-sonnet-4.5 | 0/6 | — |
| qwen3-max | 0/6 | — |

These results indicate that SWE-AGI is sensitive to robustness and generalization under specification pressure: models that appear close on code-centric open benchmarks can separate substantially once placed in an end-to-end setting with hidden private tests.

Failure to solve a task does not always indicate broad functional incorrectness. Across tiers, many "failed" submissions still pass a large fraction of the evaluation test suite, suggesting that remaining defects are often localized to rare normative requirements, subtle state-machine corner cases, or performance bottlenecks that only surface in the hidden private tests. Notable near-misses:
- cdcl reaches 99.8% test-suite pass rate for gpt-5.2-codex
- lua reaches 96.4% for claude-opus-4.5

Practically, the pass/fail boundary is often dominated by eliminating the last few spec-sensitive edge cases rather than constructing missing core subsystems.

#### Agent Efficiency

gpt-5.3-codex is substantially more time-efficient than gpt-5.2-codex while also improving task completion:

| Tier | gpt-5.3-codex avg runtime | gpt-5.2-codex avg runtime | gpt-5.3-codex avg core LOC | gpt-5.2-codex avg core LOC |
|---|---|---|---|---|
| Easy | 0.28h | 0.81h | — | — |
| Medium | 1.2h | 5.1h | 2,575 | 4,702 |
| Hard | 1.7h | 7.8h | 6,255 | 9,034 |

claude-opus-4.6 improves substantially over claude-opus-4.5 on medium and hard tiers (15/22 vs. 10/22 overall), but this gain comes with higher wall-clock time (3.5h vs. 1.3h on medium; 5.7h vs. 1.7h on hard), consistent with additional exploration and debugging under specification pressure.

A noteworthy capability of gpt-5.2-codex: sustained long-horizon execution even when convergence fails. On ecma262, the agent ran for 42 hours without early termination while still failing the private test suite, producing an unusually large implementation (over 30k core LOC). Core LOC is treated as a coarse indicator of implementation scale rather than an optimization target: higher LOC may indicate broader feature coverage, but may also reflect verbose implementations and refactoring churn under heavy specification pressure.

### 3.3 End-to-End SWE Behavior Analysis

Beyond pass/fail outcomes, agents' effort allocation is analyzed by labeling logged tool actions into coarse SWE-relevant behavior categories:

| Category | Description |
|---|---|
| Spec | Reading/interpreting specification documents |
| Plan | Planning and architectural design activities |
| Read | Reading/inspecting existing code |
| Write | Writing new code |
| Debug | Debugging, fixing failures, running tests |
| Hyg | Hygiene activities (formatting, comments, cleanup) |
| Ext | External search and web lookup |
| Other | Miscellaneous logged actions |

**Key finding:** As difficulty increases, code understanding (Read) becomes the dominant activity, and interaction volume grows sharply for several agents. On hard tasks, Read accounts for:
- 41.4% of logged actions for gpt-5.3-codex
- 64.6% for gpt-5.2-codex
- 50.2% for claude-opus-4.6
- 43.5% for claude-opus-4.5

Total actions on hard tasks:
- gpt-5.2-codex: 1,676 logged actions per task (average)
- claude-opus-4.6: 1,498 logged actions per task (average)
- gpt-5.3-codex: 301 logged actions per task (average)

Once implementations reach multi-module, spec-heavy regimes, agents devote a substantial fraction of their effort to reading, inspecting, and validating existing code rather than generating new functionality. Long-horizon progress is constrained less by raw code generation capacity than by the ability to maintain and reason over an evolving codebase. The bottleneck shifts toward preserving architectural consistency, understanding prior design decisions, and verifying interactions across modules.

#### Strategy Differences Across Frontier Agents

**gpt-5.3-codex vs. gpt-5.2-codex:** Relative to gpt-5.2-codex, gpt-5.3-codex is markedly more iteration-oriented on medium and hard tasks. It spends a smaller share on Read (41.4% vs. 64.6% on hard) while allocating more to Debug (19.8% vs. 9.2%), and completes runs with far fewer logged actions (301 vs. 1,676 on hard). This profile is consistent with faster convergence: fewer prolonged "maintenance" phases dominated by reading and more decisive test–fix–retest loops.

**claude-opus-4.6 vs. claude-opus-4.5:** claude-opus-4.6 adopts a more deliberate workflow. Compared to claude-opus-4.5, it allocates more effort to specification engagement and planning (on hard tasks: 6.6% Spec and 6.7% Plan vs. 5.2% Spec and 4.4% Plan) and less to raw code writing (13.3% vs. 24.5%), while maintaining a comparable debugging share (16.2% vs. 20.3%). This shift toward reading and planning appears beneficial on spec-heavy systems where naive patching can destabilize global invariants. In contrast, claude-opus-4.5 exhibits a more pronounced "read specification–patch–rerun" pattern, with higher Write and Debug shares across tiers. While such a strategy can be effective on smaller tasks where localized fixes converge quickly, on complex state-machine–driven systems (e.g., the HTML5 parser) frequent local patches may accumulate inconsistencies and degrade architectural coherence, leading to instability rather than convergence.

---

## 4 Related Work

### Evaluation of LLMs

Broad evaluation frameworks such as HELM and BIG-bench emphasize multi-scenario, multi-metric measurement, highlighting trade-offs beyond accuracy, such as robustness and efficiency. As LLMs increasingly transition into autonomous agents, evaluation has shifted from static prompting to interactive environments that stress tool use, multi-step planning, and long-horizon consistency. While domain-agnostic benchmarks like AgentBench and Terminal-Bench provide foundational infrastructure, SWE-AGI focuses on the unique constraints of software engineering. It departs from the repository-centric paradigm of SWE-bench in two key ways: (i) tasks are defined by rigorous, ground-truth specifications rather than existing codebase conventions, and (ii) it employs a submission-based sandbox with private, non-public test suites, ensuring auditable measurement even for models with unrestricted web search and retrieval capabilities.

### Software Engineering Benchmarks

The evaluation of code intelligence has evolved from snippet-level synthesis to full-lifecycle engineering. Early benchmarks like HumanEval and MBPP focus on isolated function-level tasks, while EvalPlus addresses test-case insufficiency. To counter data contamination, LiveCodeBench introduced continuous curation. However, real-world engineering requires reasoning across multiple files, as explored in RepoBench and SWE-bench. Recently, the design space has expanded toward specialized dimensions: PRDBench targets PRD-to-code workflows; OSS-Bench focuses on memory-safety and optimization; and SWE-EVO shifts from initial construction to continuous software evolution. SWE-AGI complements this landscape by targeting the end-to-end systems regime: agents must build a complete, robust system from high-level specs under a fixed API. By decoupling the evaluation from visible unit tests and existing repository noise, SWE-AGI provides a cleaner signal for an agent's ability to handle the "requirements-to-implementation" gap—a critical frontier for production-scale AI engineering.

### Programming Languages and LLMs

Programming languages and ecosystems shape what models can learn and how reliably they generalize. MultiPL-E shows that model performance and failure modes vary across languages, reflecting differences in syntax, standard libraries, tooling, and conventions. Beyond syntax, effective AI coding increasingly depends on a "full-stack" tool-and-feedback loop: editor/refactoring support, build systems, test runners, linters, static analyzers, profilers, and submission/evaluation harnesses that provide fast and accurate signals. In many real deployments, the bottleneck is not code generation but review, debugging, integration, and specification clarification—suggesting an advantage for languages and platforms that shift feedback from humans to machines via strong static guarantees, deterministic builds, and rich automated checks.

This favors statically typed languages and ecosystems that integrate a one-stop toolchain and enforce disciplined interfaces, enabling agents to iterate with high-quality feedback and fewer ambiguous failure modes. As the fraction of AI-generated code grows, language and platform design may increasingly optimize for machine-assisted development: explicit specifications, stable API scaffolds, auditable build/test pipelines, and standard diagnostics that can be consumed by agents.

---

## 5 Conclusion

SWE-AGI evaluates LLM-based software engineering agents on tasks defined by explicit specifications and measured by deterministic, human-validated tests. The benchmark targets production-quality, from-scratch MoonBit implementations in the 10³–10⁴ LOC regime and is evaluated through an iterative submission protocol: agents build and test locally, submit via `swe-agi-submit`, and receive pass/fail feedback from hidden private tests.

Across 22 tasks spanning seven specification families, a steep difficulty gradient is observed: frontier agents reliably solve all easy tasks, but performance drops sharply on medium and hard tiers. Overall results:
- gpt-5.3-codex: 19/22 tasks (86.4%)
- gpt-5.2-codex: 17/22 (77.3%)
- claude-opus-4.6: 15/22 (68.2%)
- claude-opus-4.5: 10/22 (45.5%)

Many failures are near-misses with high test-suite pass rates, suggesting that the pass/fail boundary is often dominated by a small number of specification-sensitive edge cases and performance corner cases rather than missing major subsystems.

Complementing these outcome metrics, log-based behavior analysis indicates that long-horizon progress is increasingly dominated by code understanding and maintenance rather than raw code writing. As difficulty increases, agents spend a growing share of actions reading and inspecting evolving implementations, and systematic differences in Read/Write/Debug allocation track within-family performance improvements. The central bottleneck in end-to-end agentic software engineering is sustaining coherent, correct systems over long trajectories under build/test feedback.

Future work will extend SWE-AGI to encompass heterogeneous distributed systems and complex legacy code integration tasks that demand deep architectural reasoning. Plans also include studying library-centric workflows: how agents decompose specifications into reusable components, divide subtasks across libraries, and compose existing libraries into even larger software systems. Incorporating multi-modal inputs (e.g., architectural diagrams and visual execution traces) and exploring agent-centric toolchain optimizations alongside non-functional imperatives like security and maintainability will be essential for achieving deterministic, production-grade reliability.

---

## References

- Anthropic (2025). Claude sonnet 4.5. https://www.anthropic.com/news/claude-sonnet-4-5
- Austin, J. et al. (2021). Program synthesis with large language models. arXiv:2108.07732.
- Cassano, F. et al. (2022). MultiPL-E: A scalable and extensible approach to benchmarking neural code generation. arXiv:2208.08227.
- Chen, M. et al. (2021). Evaluating large language models trained on code. arXiv:2107.03374.
- DeepSeek Team et al. (2025). DeepSeek-v3.2: Pushing the frontier of open large language models. arXiv:2512.02556.
- Deng, X. et al. (2025). SWE-Bench Pro: Can AI agents solve long-horizon software engineering tasks? arXiv:2509.16941.
- Fu, L. et al. (2025). Automatically benchmarking LLM code agents through agent-driven annotation and evaluation. arXiv:2510.24358.
- Gemini Team et al. (2025). Gemini 2.5: Pushing the frontier with advanced reasoning, multimodality, long context, and next generation agentic capabilities. arXiv:2507.06261.
- Hendrycks, D. et al. (2021). Measuring coding challenge competence with APPS. arXiv:2105.09938.
- Jain, N. et al. (2024). LiveCodeBench: Holistic and contamination free evaluation of large language models for code. arXiv:2403.07974.
- Jiang, Y. et al. (2025). OSS-Bench: Benchmark generator for coding LLMs. arXiv:2505.12331.
- Jimenez, C.E. et al. (2023). SWE-bench: Can language models resolve real-world GitHub issues? arXiv:2310.06770.
- Kimi Team et al. (2025). Kimi k2: Open agentic intelligence. arXiv:2507.20534.
- Liang, P. et al. (2022). Holistic evaluation of language models. arXiv:2211.09110.
- Liu, J. et al. (2023a). Is your code generated by ChatGPT really correct? Rigorous evaluation of large language models for code generation. arXiv:2305.01210.
- Liu, T. et al. (2023b). RepoBench: Benchmarking repository-level code auto-completion systems. arXiv:2306.03091.
- Liu, X. et al. (2023c). AgentBench: Evaluating LLMs as agents. arXiv:2308.03688.
- MoonBit Team (2025). MoonBit programming language. https://www.moonbitlang.com/
- OpenAI (2025). OpenAI GPT-5 system card. arXiv:2601.03267.
- Qwen Team et al. (2025). Qwen3 technical report. arXiv:2505.09388.
- Schick, T. et al. (2023). Toolformer: Language models can teach themselves to use tools. arXiv:2302.04761.
- Shinn, N. et al. (2023). Reflexion: Language agents with verbal reinforcement learning. arXiv:2303.11366.
- Srivastava, A. et al. (2022). Beyond the imitation game: Quantifying and extrapolating the capabilities of language models. arXiv:2206.04615.
- Thai, M.V.T. et al. (2025). SWE-EVO: Benchmarking coding agents in long-horizon software evolution scenarios. arXiv:2512.18470.
- The Terminal-Bench Team (2025). Terminal-Bench: A benchmark for AI agents in terminal environments. https://github.com/laude-institute/terminal-bench
- Thomas, R. (2026). Breaking the spell of vibe coding. https://www.fast.ai/posts/2026-01-28-dark-flow/
- Yang, J. et al. (2024). SWE-agent: Agent-computer interfaces enable automated software engineering. arXiv:2405.15793.
- Yao, S. et al. (2022). ReAct: Synergizing reasoning and acting in language models. arXiv:2210.03629.

---

## Appendix A: SWE-AGI Task Suite

22 tasks across 7 categories. Core LOC (excluding tests and tooling) is a coarse magnitude estimate.

### Template and Domain-Specific Languages

| Task | Difficulty | Core LOC | Key Complexity Drivers |
|---|---|---|---|
| pug: Pug Template Language | Medium | ~5×10³ | Indentation semantics, mixins/blocks, scope/inclusion, error localization |
| jq: JQ Query Language Interpreter | Hard | ~7×10³ | Lexer/parser, stream semantics (0..N outputs), built-ins, error modes |

### Data Serialization and Configuration Formats

| Task | Difficulty | Core LOC | Key Complexity Drivers |
|---|---|---|---|
| csv: CSV Parser (RFC 4180) | Easy | ~10³ | Quoting/escaping, multiline fields, line ending edge cases, invalid patterns |
| ini: INI Parser | Easy | ~10³ | Section/key parsing, escaping rules, normalization, error handling |
| yaml: YAML 1.2 Parser | Medium | ~3×10³ | Indentation/block structure, anchors/tags, scalars, error recovery |
| toml: TOML 1.0 Parser | Medium | ~3×10³ | Dotted keys, array-of-tables, datetime/float rules, UTF-8 + diagnostics |

### Markup and Document Formats

| Task | Difficulty | Core LOC | Key Complexity Drivers |
|---|---|---|---|
| xml: XML 1.0 + Namespaces | Medium | ~3×10³ | Well-formedness, namespaces, entities/DTD subset, error handling, streaming/DOM tradeoffs |
| html5: HTML5 Parser | Hard | ~10⁴ | Tokenization + tree builder state machines, error recovery, entities, broad conformance |

### Programming Language Front-Ends

| Task | Difficulty | Core LOC | Key Complexity Drivers |
|---|---|---|---|
| c99: C99 Parser | Hard | ~5×10³ | Declarators/type system, precedence/ambiguity, AST + symbols, error recovery |
| lua: Lua 5.4 Interpreter | Hard | ~5×10³ | VM/bytecode, tables + metatables, closures, coroutines, GC scope |
| ecma262: ECMAScript Interpreter (ECMA-262 subset) | Hard | ~7×10³ | Parsing + semantics, runtime objects, corner cases exercised by suite |
| python: Python Interpreter (subset) | Hard | ~7×10³ | Indentation lexing, object model, exceptions, scoping/closures, built-ins |
| r6rs: R6RS Scheme Interpreter (subset) | Hard | ~7×10³ | Reader, macro system, evaluator/runtime, exact printing semantics |

### Binary Formats and Streaming Decoders

| Task | Difficulty | Core LOC | Key Complexity Drivers |
|---|---|---|---|
| git_object: Git Object Parser (loose objects) | Easy | ~10³ | zlib integration, header parsing, hashing, boundary/error handling |
| protobuf: Protocol Buffers (streaming codec) | Easy | ~10³ | Varint/zigzag, length-delimited fields, chunked reads, malformed input handling |
| zip: ZIP File Parser | Medium | ~3×10³ | Central directory, Zip64, streaming reads, CRC/validation, encoding details |
| capnp: Cap'n Proto Binary Format | Medium | ~3×10³ | Packed encoding, pointers/segments, far pointers, boundary safety |
| wasm: WASM Decoder + Validator | Medium | ~5×10³ | LEB128, section/index consistency, validation rules, precise error behavior |

### Networking and Protocol State Machines

| Task | Difficulty | Core LOC | Key Complexity Drivers |
|---|---|---|---|
| uri: URI Parser (RFC 3986) | Easy | ~10³ | Normalization and resolution rules, encoding constraints, error behavior |
| hpack: HPACK Decoder/Encoder (RFC 7541) | Easy | ~10³ | Huffman coding, dynamic table management, header field semantics |
| url: URL Parser (WHATWG) | Medium | ~3×10³ | Canonicalization, relative resolution, percent-encoding, IDNA/Punycode scope |

### Automated Reasoning and SAT Solving

| Task | Difficulty | Core LOC | Key Complexity Drivers |
|---|---|---|---|
| cdcl: CDCL SAT Solver | Hard | ~2×10³ | Unit propagation, clause learning, backtracking/heuristics, data-structure efficiency |

**Totals:** 22 tasks — Easy: 6, Medium: 8, Hard: 8

---

## Appendix B: Detailed Results on SWE Behaviors

Per-task behavior statistics are collected for all four fully-evaluated frontier agents (gpt-5.3-codex, gpt-5.2-codex, claude-opus-4.6, claude-opus-4.5). Percentages denote the share of logged tool actions assigned to each behavior category (Spec, Plan, Read, Write, Debug, Hyg, Ext, Other). The Action column reports counted logged actions for each task run and should be interpreted as a coarse proxy for interaction volume rather than a normalized efficiency measure, since logging granularity varies across agent front-ends and runs.

Key aggregate findings from behavior tables:

- On hard tasks, Read dominates for all agents: 41.4% (gpt-5.3-codex), 64.6% (gpt-5.2-codex), 50.2% (claude-opus-4.6), 43.5% (claude-opus-4.5)
- gpt-5.3-codex has substantially higher Debug share on hard tasks (19.8%) vs. gpt-5.2-codex (9.2%), reflecting a more decisive iteration loop
- claude-opus-4.6 has higher Spec and Plan shares than claude-opus-4.5 on hard tasks, reflecting more deliberate specification engagement before patching
- Total logged action counts on hard tasks: gpt-5.2-codex ~1,676 avg, claude-opus-4.6 ~1,498 avg, gpt-5.3-codex ~301 avg
