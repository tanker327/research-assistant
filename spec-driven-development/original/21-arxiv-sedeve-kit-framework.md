# Sedeve-Kit: A Specification-Driven Development Framework for Building Distributed Systems

**Source:** https://arxiv.org/abs/2509.11566
**Authors:** Hua Guo (East China Normal University), Yunhong Ji (Shenzhen), Xuan Zhou (East China Normal University)
**Category:** Computer Science > Software Engineering (cs.SE)
**Submitted:** September 15, 2025
**DOI:** https://doi.org/10.48550/arXiv.2509.11566
**License:** CC BY 4.0
**Keywords:** TLA+, Formal Methods, Specification-Driven, Distributed Systems, Automated Testing

---

## Abstract

Developing distributed systems presents significant challenges, primarily due to the complexity introduced by non-deterministic concurrency and faults. To address these, we propose a specification-driven development framework. Our method encompasses three key stages. The first stage defines system specifications and invariants using TLA+. It allows us to perform model checking on the algorithm's correctness and generate test cases for subsequent development phases. In the second stage, based on the established specifications, we write code to ensure consistency and accuracy in the implementation. Finally, after completing the coding process, we rigorously test the system using the test cases generated in the initial stage. This process ensures system quality by maintaining a strong connection between the abstract design and the concrete implementation through continuous verification.

**Screencast:** https://www.youtube.com/watch?v=IKqJ6UX1q2o

**CCS Concepts:**
- Software and its engineering > Formal software verification
- Networks > Protocol testing and verification
- Networks > Formal specifications
- Software and its engineering > Software testing and debugging
- Hardware > Testing with distributed and parallel systems

---

## 1. Introduction

Developing a distributed system is inherently complex, and ensuring its correctness and reliability is even more challenging. Traditional development and quality assurance methods often fail to guarantee the quality of distributed systems. Formal verification and specification are valuable for ensuring the mathematical correctness of systems design (Clarke et al., 1986; Lamport, 2002). However, there is often a gap between design and implementation, as formal methods verify the design rather than the final implementation. It is impractical to model all possible program state details in the specification at the design level. At the implementation level, a system's behavior often involves numerous lines of code, with system state updates scattered throughout the codebase. Without careful engineering design, the final implementation may deviate from the original design as software evolves and iterates, leading to quality defects.

Since formal methods ensure the correctness of the design, we can implement the program according to the specifications and verify it using the specification's model state space to ensure it refines the specification. Based on this idea, we developed the _Specification-Driven Development Toolkit (sedeve-kit)_ framework, which ensures software quality throughout the entire software engineering cycle via specification-driven development (SDD). We specify algorithms using TLA+ (Lamport, 2002) and verify them with the model checker. Through correct formal specifications, sedeve-kit automatically generates test cases, which are then used to validate the final implementation. These test cases exhaustively cover the state space corresponding to the design, eliminating the need for developers to design test cases manually and significantly reducing their workload.

This paper makes the following contributions:

1. We establish sedeve-kit, a specification-driven development framework that optimizes distributed system development. Source code is available on GitHub: https://github.com/scuptio/sedeve-kit
2. Our method ensures the correctness of design and implementation, maintaining compliance with the design specifications.
3. We develop a general abstraction to describe distributed systems using I/O automata (Lynch and Tuttle, 1987) and TLA+, and create tools and libraries to map this abstraction to its implementation.
4. We create a testbed that is capable of running deterministic tests guided and controlled by the specification, liberating developers from manual tasks such as writing test cases, preparing test case data, and simulation.

---

## 2. Preliminaries

### 2.1. I/O Automata

We use the Input/Output automata (I/O automata or automata) abstraction to formalize the system. An automata is a model represented as a simple state machine that transitions from one state to another, and each transition is called an action.

An I/O automata A has the following components:

- **sig(A):** An _action signature_ S describes the I/O automata by three disjoint sets of actions: the input actions `in(S)`, the output actions `out(S)`, and the internal actions `int(S)`.
- **state(A):** A finite _set of states_; a special state is the _initial states_, a nonempty subset of `state(A)` which is denoted as `start(A)`.
- **trans(A):** A _state transition relation_; for a non-empty subset `s` of `state(A)` and an action `π`, there is a nonempty state set `s'`, which is a subset of `state(A)`, and the transition `(s, π, s') ∈ trans(A)`.
- **task(A):** A _task partition_ represents a combination of action sequences grouped to form a single task.

We then define a _trace_ of A as a finite sequence:

```
{s_0, π_1, s_1, π_2, s_2, ..., π_r, s_r}
```

in which, for `i ∈ {0, 1, ..., r}`, `s_i ∈ state(A)`, `(s_i, π_{i+1}, s_{i+1}) ∈ trans(A)`, and `s_0` is `start(A)`. The state transition graph of an I/O automata produces a collection of _trace_ sets, which are used to generate a set of test cases.

### 2.2. TLA+

TLA+ (Temporal Logic of Actions) (Lamport, 2002) is a formal specification language. TLA+ allows software engineers and system designers to precisely describe the behavior and properties of a system using mathematical notation. TLA+ specifications can be checked using the TLC model checker, which exhaustively explores all possible system behaviors to ensure that specified properties hold under all circumstances. This rigorous verification process helps detect potential errors, uncover corner cases, and improve the overall reliability of system designs.

---

## 3. The Design of Sedeve-Kit

### 3.1. The Components of Sedeve-Kit

Sedeve-kit contains a collection of libraries and command-line tools for the developer to facilitate SDD. The following are the components of sedeve-kit:

- **TraceGen:** Used to generate _trace_ set and test cases. It receives input from the SQLite database that stores the TLC model's states, which are retrieved by overwriting TLC operators (Kuppe et al., 2019) developed by the authors (https://github.com/scuptio/SedeveModules). TraceGen generates all traces using depth-first search (Cormen et al., 2009).
- **D-Player** (Deterministic Player): Controls running actions in the trace order.
- **A-Sender** (Action Sender): A library used by tested systems to send/receive control messages from D-Player to run deterministic testing.
- **S-Serde** (Serialization): A library used to marshal or unmarshal network and control messages.
- **S-Net:** A library wrapping the network interface.

### 3.2. The Workflow of SDD Using Sedeve-Kit

The workflow proceeds as follows:

1. **Design at abstract level:** Use TLA+ to specify the I/O automata.
2. **Model checking:** Run a model checker on the specification; ensure they pass model checking, guaranteeing correctness and dumping the model's states.
3. **Trace generation:** Use TraceGen to generate a trace set from the dumped states.
4. **Implementation:** Write code based on the specification and incorporate _action anchor macros (AAM)_ at appropriate source locations. During compilation for testing, these macros establish a communication channel with the D-Player and reorder actions in a predetermined order generated by the specification. When compiled for release, the macros are left empty and have no effect.
5. **Validation:** Validate the system using D-Player and the trace test case set. Repeat until all test cases pass successfully.

This process is iterative and can evolve continuously.

### 3.3. Modeling I/O Automata With TLA+

The system developer must identify the system events that should be defined as actions of I/O automata and their respective action types (input, output, or internal) before building the systems. However, not all system events need to be modeled as actions — deterministic behaviors are not modeled.

Deterministic behavior refers to the property that the program produces the same output when given the same input. Most sequential code operating within the same thread is typically deterministic and has easily understandable behavior. Non-deterministic behavior, stemming from failures, concurrency, random and network messages — especially asynchronous messages that can be lost, arrive out of order, or duplicated — is difficult to test manually. Such behaviors can lead to unexpected results and are challenging to reproduce. To model a system is mostly about modeling its non-deterministic behaviors and taking them as deterministic input/output/internal actions of the automata.

#### 3.3.1. Action Signature and State

Automata defines three action types: _input_, _internal_, and _output_ actions. An auxiliary variable `__action__` is introduced for every TLA+ specification. The auxiliary variable keeps the action signatures and the previous states of the action. When a state transitions to the next state, the auxiliary variable `__action__` is updated to capture essential states to express the action signature. This information includes:

- The action type (input, output, or internal)
- The action name
- The corresponding task (node ID in the context of modeling a distributed system) that yields
- Any additional relevant contexts associated with the action

The states are also saved by `__action__`. In the specification, TLA+ is used to write an initial predicate condition to compute an initial state. A `Next` operator generates the next state from a previous state.

#### 3.3.2. State Transition Relation

TLA+'s `Next` operators describe how each variable changes at each step. The `Next` operator defines a condition predicate for how the transition can happen. If the current state satisfies the predicate condition, then the state transitions to the next state. The transition would be an element of the global transition relation set. The final state transition relation set is obtained by adding all transitions.

#### 3.3.3. Task Partition

The task partition of a distributed system can be considered a partition of the state transition set on one node in the system. In TLA+, a node is identified by its node ID.

### 3.4. Mapping the System Behaviour to the Referenced I/O Automata Action

In the TLA+ specification, the `__action__` variable is used to store the necessary states and signatures of I/O automata. When programming guided by the specification, the developer maps the system behaviors to the referenced action. At the system implementation level, several _action anchor macros (AAM)_ are provided to map the `__action__` variable of TLA+. These macros include:

- **`Input(I)`** — used when there is an input action `I`
- **`Output(O)`** — used when there is an output action `O`
- **`BeginInternal(T)`** — used when initiating internal action `T`
- **`EndInternal(T)`** — used when finalizing internal action `T`

The developers insert these macros into the system's source code based on the system's specifications. Most of the actions are about handling messages from network channels. When running deterministic testing, these macros make sense, overwrite the network channel, and communicate to D-Player to conduct the validation. D-Player reads the trace dumped from the model using TraceGen and enforces executing a predefined action order. TraceGen can read actions from `__action__` to construct the trace of all possible action sequences.

Figure 2 in the paper illustrates the mapping from the `RequestVote` TLA+ action to the Rust source code in the Raft protocol (Ongaro and Ousterhout, 2014).

### 3.5. Testing Controlled by D-Player to Validate The System

D-Player and A-Sender are developed to control running tests and simulations with predefined action orders. The A-Sender library is used by the system to send action control messages to D-Player and read the response to control the order of actions and check states.

D-Player receives action control messages from the A-Sender library and reorders them according to the trace order defined by reading from the SQLite database generated previously. Actions are controlled to run one by one in the order specified by the trace. After D-Player receives an A-Sender's action control request, it compares the action with the current action of the trace's step. If the action control request received is not the one expected for the current step, the RPC request will be blocked and wait until it is the step's turn for that action. When the action's turn comes, D-Player responds with a message to let the invoking A-Sender pass and answers the current states of the automata to let the system check its state consistency with the model.

A-Sender and D-Player communicate through S-Serde and S-Net libraries. The A-Sender library translates AAM (which, like `input!(...)` in source code) into RPC requests sent to D-Player and reorders actions (for testing) or leaves them empty (for releasing).

If an inconsistency occurs, D-Player reports the errors. Formally, suppose there is a trace `T = {s_0, π_1, s_1, π_2, s_2, ... π_n, s_n}`, in which `π_i` is the `i`-th action of `T`, and `s_i` is the system's state after running `π_i`. The player processes each action `π_i` in `T`. After executing action `π_i`, the system verifies its state by asserting that its current state matches the expected state `s_i`. If the system receives an action `π_i`, then it yields an action `π'_{i+1}` that does not match the expected following action `π_{i+1}`, the player will trigger a timeout to report the inconsistency. The developer can quickly identify how the error occurred by debugging the error trace and examining each action within the trace.

**Example sequence diagram (Figure 3 in the paper):** Two nodes N_1 and N_2 are being tested. Node N_1 executes action π_1 in task T_1, while node N_2 executes action π_2 in task T_2. The predefined trace order of the test case is π_2 before π_1, but task T_1 starts action π_1 before task T_2 starts action π_2. To ensure consistent order of actions with the trace order, N_1 and N_2 communicate with D-Player through the A-Sender library to request the reordering of actions. Task T_1 is blocked and waits until task T_2 finishes executing π_2. This demonstrates how A-Sender and D-Player enforce the predefined order of actions that are meant to be concurrent, executing them in the trace order.

D-Player and A-Sender are implemented in Rust. A C binding wrapper is also provided to support more languages.

---

## 4. Comparison With State-Of-The-Art Works

Related works fall into two categories: Formal Verification Frameworks (FVF) and Model-Based Testing (MBT).

**Relation to FVF (Hawblitzel et al., 2015; Wilcox et al., 2015; Lesani et al., 2016; Bornholt et al., 2021):**
Like FVF, sedeve-kit enforces implementation as a specification refinement. Unlike FVF, it minimizes the effort required to comply with the specification and proof. FVF usually requires a lot of non-trivial work. For example, Verdi (Wilcox et al., 2015) uses 12,511 SLOC of Coq to specify the basic Raft protocol (no log compaction and membership management) and 36,925 SLOC to prove it. Sedeve-kit uses 3,038 SLOC of TLA+ (including invariants) to specify the entire functional Raft (https://github.com/scuptio/scupt-raft), including log compaction and membership management.

**Relation to MBT (Schvimer et al., 2020; Wang et al., 2023):**
Like MBT methods, sedeve-kit uses test cases to confirm the specification and does not require much manual work. Unlike MBT, sedeve-kit is not designed primarily to find bugs in systems. The MBT approach (Wang et al., 2023) could not find some concurrency bugs if the behavior of the system violated the specification. Such missing bugs caused by deviating from the specification cannot exist in sedeve-kit because the implementation is a specification refinement; the wrong schedule against the specification cannot pass the testing.

The spectrum of sedeve-kit lies between FVF and MBT.

### Advantages

1. Applicability to any concurrency and distributed systems, failure models, any programming languages, and network environments instills developers' confidence in correctness and software quality.
2. Minimal effort is required for compliance with the specification and proof; easy integration into software development cycles facilitates the closure of the design and implementation phases.
3. It can be easily integrated into the CI/CD process to ensure the quality of the entire software life cycle.

### Disadvantages

1. When applied to legacy systems, the developer must build an additional adapter layer (serialization and network libraries) and specify system behaviors.
2. Assurance of correctness is only within the context of the specification (the design space), without providing a wholly correct and bug-free system as systems built by FVF (Wilcox et al., 2015; Hawblitzel et al., 2015; Klein et al., 2009).

---

## 5. Conclusion

Sedeve-kit is an SDD framework for building distributed systems. It can seamlessly integrate into continuous development and deployment processes, enhancing early defect discovery, increasing productivity, and enabling faster release cycles. The framework guarantees software quality by shifting defect detection to the leftmost side of the software development lifecycle.

---

## References

- Bornholt, J., Joshi, R., Astrauskas, V., Cully, B., Kragl, B., Markle, S., Sauri, K., Schleit, D., Slatton, G., Tasiran, S., Van Geffen, J., and Warfield, A. 2021. Using Lightweight Formal Methods to Validate a Key-Value Storage Node in Amazon S3. In _SOSP 2021_. ACM, 836–850. https://doi.org/10.1145/3477132.3483540

- Clarke, E.M., Emerson, E.A., and Sistla, A.P. 1986. Automatic Verification of Finite-State Concurrent Systems Using Temporal Logic Specifications. _ACM Trans. Program. Lang. Syst._ 8, 2 (1986), 244–263. https://doi.org/10.1145/5397.5399

- Cormen, T.H., Leiserson, C.E., Rivest, R.L., and Stein, C. 2009. _Introduction to Algorithms, 3rd Edition_. MIT Press.

- Hawblitzel, C., Howell, J., Kapritsos, M., Lorch, J.R., Parno, B., Roberts, M.L., Setty, S.T.V., and Zill, B. 2015. IronFleet: proving practical distributed systems correct. In _SOSP 2015_. ACM, 1–17. https://doi.org/10.1145/2815400.2815428

- Klein, G., Elphinstone, K., Heiser, G., Andronick, J., Cock, D.A., Derrin, P., Elkaduwe, D., Engelhardt, K., Kolanski, R., Norrish, M., Sewell, T., Tuch, H., and Winwood, S. 2009. seL4: formal verification of an OS kernel. In _SOSP_. ACM, 207–220. https://doi.org/10.1145/1629575.1629596

- Kuppe, M.A., Lamport, L., and Ricketts, D. 2019. The TLA+ Toolbox. In _F-IDE@FM 2019_ (EPTCS, Vol. 310). 50–62. https://doi.org/10.4204/EPTCS.310.6

- Lamport, L. 2002. _Specifying Systems, The TLA+ Language and Tools for Hardware and Software Engineers_. Addison-Wesley.

- Lesani, M., Bell, C.J., and Chlipala, A. 2016. Chapar: certified causally consistent distributed key-value stores. In _POPL 2016_. ACM, 357–370. https://doi.org/10.1145/2837614.2837622

- Lynch, N.A. and Tuttle, M.R. 1987. Hierarchical Correctness Proofs for Distributed Algorithms. In _Proceedings of the Sixth Annual ACM Symposium on Principles of Distributed Computing_. ACM, 137–151. https://doi.org/10.1145/41840.41852

- Ongaro, D. and Ousterhout, J.K. 2014. In Search of an Understandable Consensus Algorithm. In _USENIX ATC '14_. USENIX Association, 305–319.

- Schvimer, J., Davis, A.J.J., and Hirschhorn, M. 2020. eXtreme Modelling in Practice. _Proc. VLDB Endow._ 13, 9 (2020), 1346–1358. https://doi.org/10.14778/3397230.3397233

- Wang, D., Dou, W., Gao, Y., Wu, C., Wei, J., and Huang, T. 2023. Model Checking Guided Testing for Distributed Systems. In _EuroSys 2023_. ACM, 127–143. https://doi.org/10.1145/3552326.3587442

- Wilcox, J.R., Woos, D., Panchekha, P., Tatlock, Z., Wang, X., Ernst, M.D., and Anderson, T.E. 2015. Verdi: a framework for implementing and formally verifying distributed systems. In _ACM SIGPLAN 2015_. ACM, 357–368. https://doi.org/10.1145/2737924.2737958
