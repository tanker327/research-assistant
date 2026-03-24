# Constitutional Spec-Driven Development: Enforcing Security by Construction in AI-Assisted Code Generation

**Source:** https://arxiv.org/abs/2602.02584
**Authors:** Srinivas Rao Marri
**Submitted:** January 31, 2026
**arXiv ID:** 2602.02584 [cs.SE]
**Subjects:** Software Engineering (cs.SE); Artificial Intelligence (cs.AI); Cryptography and Security (cs.CR)
**DOI:** https://doi.org/10.48550/arXiv.2602.02584
**Keywords:** AI code generation, security, microservices, specification-driven development, constitutional constraints, CWE/MITRE

---

## Abstract

The proliferation of AI-assisted "vibe coding" enables rapid software development but introduces significant security risks, as Large Language Models (LLMs) prioritize functional correctness over security. We present Constitutional Spec-Driven Development, a methodology that embeds non-negotiable security principles into the specification layer, ensuring AI-generated code adheres to security requirements by construction rather than inspection. Our approach introduces a Constitution: a versioned, machine-readable document encoding security constraints derived from Common Weakness Enumeration (CWE)/MITRE Top 25 vulnerabilities and regulatory frameworks. We demonstrate the methodology through a banking microservices application, selected as a representative example domain due to its stringent regulatory and security requirements, implementing customer management, account operations, and transaction processing. The methodology itself is domain-agnostic. The implementation addresses 10 critical CWE vulnerabilities through constitutional constraints with full traceability from principles to code locations. Our case study shows that constitutional constraints reduce security defects by 73% compared to unconstrained AI generation while maintaining developer velocity. We contribute a formal framework for constitutional security, a complete development methodology, and empirical evidence that proactive security specification outperforms reactive security verification in AI-assisted development workflows.

---

## 1 Introduction

The rapid adoption of AI-assisted code generation has created a fundamental tension in software development: the same tools that dramatically accelerate development velocity also introduce systematic security vulnerabilities. This paper addresses this challenge by introducing the term Constitutional Spec-Driven Development (CSDD), a novel methodology that embeds non-negotiable security constraints into the specification layer, ensuring that AI-generated code is secure by construction rather than by post-hoc verification. To our knowledge, this represents the first formalization of constitutional constraints applied specifically to AI code generation workflows, combining principles from Design by Contract (Meyer, 1992), Constitutional AI (Bai et al., 2022), and specification-driven development into a unified framework for secure AI-assisted software engineering. We use the term "constitution" metaphorically: just as a political constitution establishes foundational principles that govern all subsequent legislation, a software constitution establishes non-negotiable constraints that govern all subsequent code generation. The term implies architectural primacy, not legal obligation.

### 1.1 Motivation

**The Rise of Vibe Coding.** The emergence of AI-assisted coding tools has fundamentally transformed software development. Large Language Models can generate functional code from natural language descriptions, enabling rapid prototyping and reducing implementation time. This paradigm, termed "vibe coding," allows developers to describe desired functionality conversationally and receive working implementations. A developer might simply state "create a user registration endpoint" and receive a complete implementation within seconds. However, this acceleration introduces significant security risks that traditional development practices are ill-equipped to address.

**The Security Gap in AI-Generated Code.** Studies indicate that LLM-generated code frequently contains security vulnerabilities (Pearce et al., 2022; Perry et al., 2023; Zhou et al., 2025). Analysis of code produced by popular AI assistants reveals patterns of SQL injection, cross-site scripting, improper authentication, and insufficient input validation — vulnerabilities catalogued in the CWE/MITRE Top 25 Most Dangerous Software Weaknesses (MITRE, 2025). The fundamental issue is that AI models optimize for functional correctness based on training data distributions, not security requirements specific to deployment contexts. When an AI generates a database query, it produces code that works, but "working" code that concatenates user input into SQL strings creates exploitable injection vulnerabilities.

**Regulatory and Industry Pressures.** The banking and financial services sector presents acute challenges. Regulatory frameworks including PCI-DSS, SOC 2, and GDPR impose strict security requirements (PCI-SSC, 2022). A single SQL injection vulnerability in a banking application could expose millions of customer records, resulting in regulatory fines exceeding $10 million, class-action litigation, and irreparable reputation damage. Traditional security practices (code reviews, penetration testing, static analysis) operate as post-hoc verification, detecting vulnerabilities after introduction rather than preventing creation. When AI accelerates code generation by orders of magnitude, reactive security processes become inadequate.

**The False Dichotomy.** The tension appears fundamental: organizations desire AI-assisted velocity while requiring security guarantees mandated by regulation. Current approaches treat these as competing objectives; teams must choose between moving fast with AI or moving carefully with security. We argue this dichotomy is false and propose a methodology achieving both through architectural intervention at the specification layer. By constraining AI generation before code is produced, rather than inspecting it after, we eliminate entire categories of vulnerabilities while preserving the velocity benefits of AI assistance.

**The Core Problem.** Contemporary AI coding assistants operate without persistent security constraints. Each request is processed independently, relying on prompt engineering to incorporate security considerations. This suffers from:

- **Inconsistency:** Security requirements must be restated per prompt, and developers frequently forget to include critical constraints like "use parameterized queries" or "hash passwords with bcrypt"
- **Incompleteness:** Developers omit requirements they consider obvious, but AI models lack the contextual understanding to infer that a banking application requires stronger security than a prototype
- **Drift:** Early security specifications do not propagate to later code. A developer who specified secure authentication in sprint one may forget to maintain those standards when implementing new features in sprint five
- **Unverifiability:** No systematic mechanism exists to verify that generated code adheres to stated requirements across an entire codebase

These limitations are dangerous in vibe coding workflows where developers accept generated implementations with minimal scrutiny. The cognitive offloading that makes AI assistance attractive simultaneously reduces security flaw detection likelihood.

### 1.2 Contributions

This paper introduces Constitutional Spec-Driven Development as a new paradigm and makes the following contributions:

**C1. Constitutional Security Framework.** We formalize software constitutions, hierarchical constraint systems encoding non-negotiable security requirements as first-class architectural artifacts with versioning and governance. Unlike ad-hoc security guidelines, constitutions are structured documents with explicit CWE mappings, enforcement levels (MUST/SHOULD/MAY), and amendment procedures.

**C2. Spec-Driven Development Methodology.** We present a complete workflow integrating constitutional constraints with AI-assisted code generation across specification, planning, task decomposition, and implementation phases.

**C3. Compliance Traceability Matrix.** We introduce systematic mapping of constitutional principles to implementation artifacts at file and line-number granularity, enabling automated compliance verification.

**C4. Reference Implementation.** We demonstrate the methodology through a banking microservices application addressing 10 CWE/MITRE Top 25 vulnerabilities through constitutional constraints.

**C5. Empirical Evaluation.** We analyze constitutional constraint effectiveness, measuring compliance rates and defect density compared to unconstrained generation. Our case study demonstrates a 73% reduction in security vulnerabilities, 56% faster time to first secure build, and 4.3x improvement in compliance documentation coverage.

---

## 2 Background and Context

This section reviews the foundational concepts underlying Constitutional Spec-Driven Development: AI-assisted code generation, known security challenges, and prior work in formal specification and constitutional AI.

### 2.1 AI-Assisted Code Generation

Large Language Models trained on code corpora can generate syntactically correct, functionally appropriate code from natural language prompts (Chen et al., 2021). Tools like GitHub Copilot, Claude, and ChatGPT have achieved widespread adoption, with surveys indicating over 70% of professional developers use AI assistance regularly (GitHub, 2024).

### 2.2 Security Challenges in AI-Generated Code

Research has documented systematic security issues in AI-generated code. Pearce et al. (2022) found that GitHub Copilot produces vulnerable code in approximately 40% of security-relevant scenarios. Perry et al. (2023) demonstrated that developers using AI assistance write less secure code than those coding manually, partially due to over-reliance on AI output correctness. Zhou et al. (2025) specifically benchmarked vibe coding vulnerabilities in real-world tasks, confirming that agent-generated code exhibits systematic security weaknesses across diverse application domains. More recently, Liu et al. (2026) conducted a large-scale empirical study of 31,132 AI agent skills, finding that 26.1% contain at least one security vulnerability, including prompt injection, data exfiltration, and privilege escalation risks. Their findings underscore that the specification artifacts guiding AI agents (including constitutional documents) must themselves be authored defensively to resist adversarial manipulation.

### 2.3 Design by Contract

Meyer's Design by Contract (Meyer, 1992, 1997) introduced formal specification of software behavior through preconditions, postconditions, and invariants. Our constitutional approach extends this tradition by applying contract-like constraints to AI code generation.

### 2.4 Constitutional AI

Anthropic's Constitutional AI (Bai et al., 2022) demonstrated that AI systems can be guided by explicit principles during training and inference. We adapt this concept from AI alignment to software security, embedding security principles as generation constraints.

---

## 3 Constitutional Spec-Driven Development

This section presents the core methodology, introducing the key concepts, architectural components, and workflow that comprise Constitutional Spec-Driven Development.

### 3.1 Core Concepts

**Constitution.** By analogy to political constitutions that establish foundational governing principles, we define a software constitution as a versioned document encoding non-negotiable requirements as machine-readable principles with explicit CWE vulnerability mappings, enforcement levels (MUST/SHOULD/MAY per RFC 2119), and rationale. A constitution is not prescriptive about implementation technology; it specifies what must hold, not how to achieve it.

**Spec-Driven Development.** A hierarchical workflow where constitutional constraints flow through specification, planning, and implementation phases, ensuring security requirements propagate to generated code.

**Compliance Traceability.** Systematic mapping from constitutional principles to code artifacts at file and line-number granularity, enabling audit and impact analysis.

### 3.2 Constitutional Principles Structure

Each principle in our banking constitution follows this structure:

1. **Identifier:** Unique code (e.g., SEC-002)
2. **CWE Reference:** Specific vulnerability addressed (e.g., CWE-89)
3. **Enforcement Level:** MUST, SHOULD, or MAY
4. **Constraint:** What the code must/must not do
5. **Implementation Pattern:** How to satisfy the constraint
6. **Rationale:** Why this constraint exists (attack vector)

### 3.3 Compliance Traceability Matrix

The matrix maps each principle to specific implementation artifacts:

- **Audit Support:** Demonstrable compliance for regulators
- **Change Impact Analysis:** Understanding which code affects which principles
- **Gap Detection:** Identifying unimplemented requirements
- **Regression Prevention:** Ensuring changes do not violate principles

### 3.4 Architecture Overview

The Spec-Driven Development architecture places the Constitution at the apex of the development hierarchy, governing all downstream artifacts.

**Figure 1: Spec-Driven Development Architecture with Constitutional Constraints**

**Specification Layer Components:** The specification layer comprises three artifacts that translate constitutional principles into implementable work:

- **Feature Specifications (`spec.md`):** Define what to build (analogous to functional requirements) while respecting constitutional constraints.
- **Implementation Plans (`plan.md`):** Detail how to build features (analogous to technical requirements) with security considerations embedded at the design level.
- **Task Definitions (`tasks.md`):** Provide atomic work items (analogous to actionable tasks) that AI-assisted generation can execute within constitutional bounds.

---

## 4 Implementation

This section describes the reference implementation through a banking microservices application. Banking was selected as the example domain because its well-established regulatory requirements (PCI-DSS, GDPR) and high security stakes make constitutional constraints directly demonstrable. The methodology is domain-agnostic; practitioners in healthcare, e-commerce, government, or any regulated industry can author constitutions tailored to their specific compliance and security needs.

### 4.1 Constitution Document

Our example banking constitution (version 1.0.0) defines 15 security principles across four categories.

**I. Security-First Principles**

- **SEC-001** (CWE-79, Cross-Site Scripting): All user-supplied data MUST be contextually encoded before rendering
- **SEC-002** (CWE-89, SQL Injection): Database queries MUST use parameterized statements or ORM methods exclusively
- **SEC-003** (CWE-352, CSRF): State-changing operations MUST include anti-CSRF protection
- **SEC-004** (CWE-306, Missing Authentication): All API endpoints except health checks MUST require valid authentication tokens
- **SEC-005** (CWE-798, Hardcoded Credentials): Secrets MUST be loaded from environment variables

**II. Input Validation Principles**

- **SEC-006** (CWE-20, Improper Validation): All API inputs MUST be validated against strict schemas
- **SEC-007** (CWE-190, Integer Overflow): Financial amounts MUST use Decimal types with explicit precision

**III. Authentication & Authorization Principles**

- **SEC-008** (CWE-287, Improper Authentication): Authentication MUST use OAuth2 with JWT bearer tokens
- **SEC-009** (CWE-522, Weak Credentials): Passwords MUST be hashed using bcrypt with cost factor >= 12
- **SEC-010** (CWE-862/863, Authorization Failures): Every resource access MUST verify user permissions
- **SEC-011** (CWE-613, Session Expiration): Access tokens MUST expire within 15 minutes

**IV. Secure Data Handling Principles**

- **SEC-012** (CWE-312, Cleartext Storage): Sensitive data at rest MUST be encrypted
- **SEC-013** (CWE-319, Cleartext Transmission): All communication MUST use TLS 1.2+
- **SEC-014** (CWE-200, Information Exposure): Error responses MUST NOT expose implementation details
- **SEC-015** (CWE-532, Log Injection): Log entries MUST NOT contain passwords or tokens

### 4.2 Compliance Traceability Matrix

The Compliance Traceability Matrix provides a bidirectional mapping between constitutional security principles and their concrete implementations in the codebase. This matrix serves multiple purposes:

1. **Audit Support:** Auditors can verify that each security requirement has a corresponding implementation
2. **Change Impact Analysis:** Developers can assess which constitutional principles are affected when modifying specific files
3. **Gap Detection:** Missing mappings reveal unimplemented security requirements
4. **Regression Prevention:** The matrix enables targeted security testing when code changes occur

Table 1 presents the compliance traceability matrix for critical constitutional principles. Each row maps a security principle to its CWE identifier, the source file containing the implementation, the specific line numbers, and the technique employed.

### 4.3 Key Implementation Details

**Authentication Flow (SEC-008, SEC-009, SEC-011).** JWT tokens are generated with typed claims, configurable expiration, and cryptographic signing:

```python
# Listing 1: JWT Token Generation (SEC-008, SEC-005, SEC-011)
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({
        "exp": expire,
        "type": "access"
    })
    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm
    )
```

The `create_access_token` function demonstrates constitutional compliance: the `type` claim distinguishes token purposes (SEC-008), expiration defaults to 15 minutes (SEC-011), and the secret key is loaded from environment configuration rather than hardcoded (SEC-005).

**Authorization Enforcement (SEC-010).** Resource-based access control prevents Insecure Direct Object Reference (IDOR) vulnerabilities:

```python
# Listing 2: Authorization Check with Ownership Verification (SEC-010)
async def get_account(
    self,
    db: AsyncSession,
    account_number: str,
    customer_id: str
) -> Account:
    account = await self._get_account_by_number(db, account_number)
    if account.customer_id != customer_id:
        raise AuthorizationError("Not authorized to access this account")
    return account
```

This pattern requires the authenticated customer's ID as a mandatory parameter and explicitly verifies ownership before returning data. The authorization check occurs after data retrieval to ensure consistent error handling; the same "not authorized" response is returned whether the account does not exist or belongs to another user, preventing information disclosure.

**Input Validation (SEC-006, SEC-007).** Pydantic v2 schemas provide declarative validation:

```python
# Listing 3: Pydantic v2 Input Validation Schema (SEC-006, SEC-007)
class CustomerCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone: str = Field(pattern=r'^\+[1-9]\d{1,14}$')
    date_of_birth: date

    @field_validator('date_of_birth')
    def validate_age(cls, v):
        age = (date.today() - v).days // 365
        if age < 18:
            raise ValueError('Must be 18 or older')
        return v
```

The schema demonstrates defense-in-depth: `EmailStr` validates RFC 5322 email format, `Field(min_length=8)` enforces password complexity, the phone regex enforces E.164 international format, and the custom validator implements domain-specific business rules (banking age requirements). Pydantic's validation errors are automatically transformed into standardized 422 responses by FastAPI.

### 4.4 Technology Stack

Constitutional Spec-Driven Development influences technology selection by requiring that each component in the stack provides built-in mechanisms to enforce security principles. Rather than selecting technologies based solely on developer productivity or performance, CSDD mandates that security guarantees be native to the chosen tools. This approach shifts security from an afterthought to a selection criterion, ensuring that the technology stack itself becomes a first line of defense.

Table 2 summarizes the technology stack with constitutional rationale. Each technology was selected because it provides inherent support for specific constitutional principles; for example, SQLAlchemy's parameterized queries prevent SQL injection by design (SEC-002), while Pydantic's declarative schemas enable input validation without manual parsing (SEC-006). This constitutional alignment means that using these technologies correctly automatically satisfies the corresponding security requirements.

---

## 5 Case Study

This section presents an empirical evaluation of Constitutional Spec-Driven Development through a complete banking microservices implementation. We describe the development process, analyze security violations prevented by constitutional constraints, and present quantitative metrics comparing constitutional development to unconstrained AI-assisted development.

### 5.1 Development Process

We developed the banking application over a two-week period with a single developer utilizing AI assistance (Claude) for code generation. The development followed a five-phase methodology:

**Week 1: Foundation and Specification**

- Days 1–2: Constitution ratification (15 principles from CWE/MITRE analysis)
- Days 3–4: Feature specification (authentication, accounts, transactions)
- Day 5: Implementation planning (47 code locations identified)

**Week 2: Implementation and Verification**

- Days 1–3: Backend implementation with constitutional constraints
- Days 4–5: Frontend implementation
- Days 6–7: Verification and compliance matrix generation

### 5.2 Constitutional Violations Prevented

During implementation, constitutional constraints prevented several security vulnerabilities that AI code generation initially produced. We document four representative violations, each illustrating a common pattern where AI assistants optimize for functional correctness while inadvertently introducing security flaws. These violations were detected during constitutional validation and corrected through regeneration with explicit principle references.

**Violation 1: Raw SQL Query (CWE-89 — SQL Injection)**

When asked to implement transaction filtering by amount, the AI generated code using Python f-strings to construct the SQL query dynamically. This classic SQL injection vulnerability would allow attackers to execute arbitrary SQL commands by manipulating the amount parameter.

```python
# Listing 4: SQL Injection via f-string Interpolation – Violates SEC-002 (REJECTED)
query = f"SELECT * FROM transactions WHERE amount > {amount}"
result = await db.execute(text(query))
```

```python
# Listing 5: Secure ORM Query with Parameterized Values – Satisfies SEC-002 (ACCEPTED)
stmt = select(Transaction).where(Transaction.amount > amount)
result = await db.execute(stmt)
```

**Violation 2: Plaintext Password Logging (CWE-532)**

During customer registration, the AI included the user's password in audit log details for "complete traceability." This would expose plaintext passwords in log files, which are often stored with less stringent access controls than production databases.

```python
# Listing 6: Password Exposure in Audit Logs – Violates SEC-015 (REJECTED)
async def register_customer(db: AsyncSession, customer_data: CustomerCreate):
    customer = Customer(**customer_data.dict())
    db.add(customer)
    await db.commit()

    audit_log = AuditLog(
        action=AuditAction.CREATE,
        resource_type="customer",
        details={
            "email": customer_data.email,
            "password": customer_data.password,  # VIOLATION
            "phone": customer_data.phone
        }
    )
    db.add(audit_log)
    await db.commit()
    return customer
```

```python
# Listing 7: Secure Audit Logging with Credential Exclusion – Satisfies SEC-015 (ACCEPTED)
async def register_customer(db: AsyncSession, customer_data: CustomerCreate):
    customer = Customer(**customer_data.dict())
    db.add(customer)
    await db.commit()

    audit_log = AuditLog(
        action=AuditAction.CREATE,
        resource_type="customer",
        details={
            "email": customer_data.email,
            "phone": customer_data.phone,
            "customer_id": str(customer.id)
        }
    )
    db.add(audit_log)
    await db.commit()
    return customer
```

**Violation 3: Missing Authorization Check (CWE-862)**

The AI generated account retrieval that fetched accounts solely by account number without verifying ownership. This Insecure Direct Object Reference (IDOR) vulnerability would allow any authenticated user to access any other user's account details by guessing or enumerating account numbers — a massive privacy breach with regulatory implications under PCI-DSS and GDPR.

```python
# Listing 8: Missing Authorization Check (IDOR) – Violates SEC-010 (REJECTED)
async def get_account(self, db: AsyncSession, account_number: str):
    result = await db.execute(
        select(Account).where(Account.account_number == account_number)
    )
    account = result.scalar_one_or_none()
    if not account:
        raise NotFoundError("Account not found")
    return account
```

```python
# Listing 9: Secure Account Retrieval with Ownership Verification – Satisfies SEC-010 (ACCEPTED)
async def get_account(
    self,
    db: AsyncSession,
    account_number: str,
    customer_id: str
) -> Account:
    result = await db.execute(
        select(Account).where(Account.account_number == account_number)
    )
    account = result.scalar_one_or_none()
    if not account:
        raise NotFoundError("Account not found")
    if account.customer_id != customer_id:
        raise AuthorizationError("Not authorized to access this account")
    return account
```

**Violation 4: Improper Input Validation (SEC-006, CWE-20)**

The AI generated a fund transfer endpoint that accepted raw numeric input without validation, allowing negative amounts, excessively large values, and unbounded decimal precision. This violated SEC-006 (validate and sanitize all external input) and exposed the system to CWE-20 (Improper Input Validation) and CWE-190 (Integer Overflow or Wraparound).

```python
# Listing 10: Transfer Without Input Validation – Violates SEC-006 (REJECTED)
class TransferRequest(BaseModel):
    from_account: str
    to_account: str
    amount: float  # VIOLATION: float allows unbounded values and precision issues

async def transfer_funds(request: TransferRequest, db: AsyncSession):
    from_acc = await get_account(db, request.from_account)
    to_acc = await get_account(db, request.to_account)
    from_acc.balance -= request.amount
    to_acc.balance += request.amount
    await db.commit()
    return {"status": "completed", "amount": request.amount}
```

```python
# Listing 11: Secure Transfer with Pydantic v2 Validation – Satisfies SEC-006, SEC-007 (ACCEPTED)
class TransferRequest(BaseModel):
    from_account: str = Field(..., pattern=r"^[A-Z0-9]{10}$")
    to_account: str = Field(..., pattern=r"^[A-Z0-9]{10}$")
    amount: Decimal = Field(
        ..., gt=Decimal("0"), le=Decimal("1000000"),
        decimal_places=2
    )

    @field_validator("to_account")
    @classmethod
    def accounts_must_differ(cls, v, info):
        if v == info.data.get("from_account"):
            raise ValueError("Cannot transfer to the same account")
        return v

async def transfer_funds(request: TransferRequest, db: AsyncSession):
    from_acc = await get_account(db, request.from_account)
    if from_acc.balance < request.amount:
        raise InsufficientFundsError("Insufficient balance")
    from_acc.balance -= request.amount
    to_acc = await get_account(db, request.to_account)
    to_acc.balance += request.amount
    await db.commit()
    return {"status": "completed", "amount": str(request.amount)}
```

### 5.3 Quantitative Results

To evaluate the effectiveness of constitutional constraints, we conducted a comparative analysis implementing the same banking application requirements twice: once using Constitutional Spec-Driven Development and once using standard AI-assisted development without constitutional constraints (the "vibe coding" baseline). Both implementations used the same AI assistant (Claude) and the same developer.

**Table 3: Security Metrics Comparison**

Key findings:
- **73% reduction** in security defects compared to unconstrained AI generation
- **56% faster** time to first secure build
- **4.3x improvement** in compliance documentation coverage

### 5.4 Compliance Verification

The compliance traceability matrix was generated by systematically analyzing the codebase against constitutional principles. For each principle (SEC-001 through SEC-015), all code locations implementing that principle were identified and recorded with file path, line numbers, and implementation technique.

**Table 4: Compliance Verification Summary**

### 5.5 Security Coverage Distribution

The distribution of security implementation effort across vulnerability categories reflects the relative complexity and prevalence of each vulnerability type in the banking domain, with authentication requiring the largest effort (25%) due to the complexity of OAuth2/JWT implementation, password hashing, and token lifecycle management.

**Figure 2: CWE Vulnerability Coverage by Implementation Effort**

---

## 6 Lessons Learned

This section synthesizes key insights from implementing Constitutional Spec-Driven Development in the banking microservices case study, organized into three categories: constitution design, AI integration strategies, and methodology adoption considerations.

### 6.1 Constitution Design Principles

**Lesson 1: Specificity Enables Enforcement.** Vague principles like "use secure coding practices" provided insufficient guidance. After revising to specific principles referencing CWE identifiers and implementation patterns, compliance improved from inconsistent to 100%.

**Lesson 2: Rationale Enables Contextual Judgment.** Including the rationale (WHY) alongside the constraint (WHAT) and pattern (HOW) enabled appropriate decisions in edge cases.

**Lesson 3: Governance Mechanisms Prevent Constitutional Drift.** Semantic versioning and approval workflows prevented ad-hoc modifications that would compromise security.

**Lesson 4: Constitutional Documents Must Resist Adversarial Manipulation.** Because constitutional specifications are consumed by AI agents as natural language instructions, they represent an attack surface for prompt injection and specification poisoning. Liu et al. (2026) demonstrated that 26.1% of AI agent skills in production contain exploitable vulnerabilities, including prompt injection vectors that can override intended behavior. Constitutional documents must therefore be authored defensively:

- Principles should use unambiguous, declarative language that cannot be reinterpreted through injected context
- Specifications should avoid patterns that could be exploited to weaken constraints (e.g., conditional overrides, user-controlled exception clauses)
- Constitution files should be treated as security-critical artifacts with access controls, code review requirements, and integrity verification equivalent to production deployment configurations

### 6.2 AI Integration Strategies

**Lesson 5: Context Window Management is Critical.** Large constitutional documents may exceed AI model context window limits, causing truncation of critical security principles. Including only task-relevant principles (3–5 per request) improved compliance rates significantly.

**Table 5: Impact of Context Management Strategy on Compliance**

**Lesson 6: Iterative Refinement Outperforms Manual Patching.** Regeneration with explicit principle references (1.4 iterations average) outperformed manual patching (3.2 iterations average).

**Lesson 7: Traceability Requires Automated Tooling.** Manual compliance mapping achieved only 94% accuracy; automated tooling achieved 100%.

### 6.3 Methodology Adoption

**Lesson 8: Upfront Investment Yields Downstream Efficiency.** Constitution creation (16 hours) was recovered through a 4x reduction in security review cycles.

**Lesson 9: Framing Determines Adoption Success.** Presenting constraints as "guardrails preventing costly rework" achieved higher adoption than "bureaucratic security requirements."

**Lesson 10: Domain Criticality Determines Adoption Priority.** Regulated industries (financial services, healthcare, government) benefit most from constitutional approaches.

### 6.4 Beyond Security: Generalizability of Constitutional Constraints

While this paper focuses on security principles, the constitutional constraint mechanism is not limited to security. The same specification-driven enforcement model generalizes to any domain where non-negotiable requirements must be preserved across AI-generated code. We identify four categories of constitutional extension:

**Architectural Principles.** Organizations can encode architectural constraints such as layered separation (controllers must not access the database directly), dependency inversion (depend on abstractions rather than concrete implementations), and bounded context boundaries in domain-driven design. These principles prevent AI-generated code from violating structural invariants that are difficult to detect through testing alone.

**Design Patterns and Conventions.** Constitutional principles can mandate the use of specific design patterns: repository pattern for data access, factory pattern for object creation, or event-driven communication between services. For example, a principle such as "All inter-service communication must use asynchronous message queues; synchronous HTTP calls between services are prohibited" ensures consistency across AI-generated microservice implementations.

**Proprietary and Organizational Guidelines.** Enterprises maintain internal standards governing naming conventions, logging formats, error handling strategies, and API versioning schemes. Encoding these as constitutional principles ensures that AI-generated code conforms to organizational norms without requiring manual post-generation review for style and convention adherence.

**Performance and Scalability Constraints.** Principles such as "All database queries must use parameterized pagination with a maximum page size of 100 records" or "All external API calls must implement circuit breaker patterns with configurable timeout thresholds" encode operational requirements that are frequently overlooked in initial code generation.

This generalizability positions Constitutional Spec-Driven Development not merely as a security methodology but as a general-purpose framework for constraint-preserving AI code generation across any dimension of software quality.

### 6.5 Limitations

While our case study demonstrates significant benefits, Constitutional Spec-Driven Development has inherent limitations that practitioners must understand:

1. **Bounded by Known Vulnerability Classes:** Constitutional principles derived from CWE/OWASP frameworks address known vulnerability patterns but cannot anticipate zero-day attack vectors or novel vulnerability classes
2. **Technical Vulnerabilities Only:** Constitutional constraints effectively address technical vulnerability patterns (injection, authentication bypass) but do not address business logic flaws specific to application semantics
3. **AI Capability Dependency:** The methodology's effectiveness depends on the AI model's capability to understand natural language principles and translate them into correct implementations
4. **Constitution Completeness:** Constitutional documents may contain gaps (security requirements not captured in any principle), representing silent vulnerabilities
5. **Specification-Layer Attack Surface:** Constitutional documents, as natural language artifacts consumed by AI agents, are susceptible to prompt injection and specification poisoning attacks (Liu et al., 2026). Adversarial modifications to constitution files could weaken or bypass security constraints, requiring that these artifacts be treated with the same access control rigor as production security configurations

### 6.6 Threats to Validity

**Internal Validity.** Our case study involved a single development team with prior security training, potentially inflating observed benefits. The team's awareness of being studied may have influenced adherence to constitutional constraints (Hawthorne effect).

**External Validity.** Our reference implementation addresses a specific domain (banking) with well-understood security requirements aligned with established frameworks. Results may not generalize to domains with novel or poorly understood security requirements.

**Construct Validity.** Security defect measurement relied on static analysis tools and manual review, potentially missing subtle vulnerabilities. Compliance metrics measure documented traceability rather than actual security effectiveness.

**Conclusion Validity.** Small sample size (n=1 project) limits statistical power for quantitative claims. Replication across multiple projects and teams is needed to establish robust effect size estimates.

---

## 7 Conclusion

We presented Constitutional Spec-Driven Development, a methodology for enforcing non-negotiable security requirements in AI-assisted code generation. By embedding security principles as first-class architectural constraints, we transform security from a reactive verification activity to a proactive generation constraint.

Our banking microservices case study demonstrates that constitutional constraints reduce security defects by 73% while maintaining development velocity. The compliance traceability matrix provides auditable evidence of security requirement implementation, addressing regulatory compliance needs in financial services.

The key insight is that AI code generation should not operate in an unconstrained space. Just as constitutional law constrains governmental action, software constitutions constrain code generation to produce implementations that are secure by construction.

### 7.1 Future Work

Several directions extend this research:

- **Automated Constitution Generation:** Deriving constitutional principles automatically from regulatory documents (PCI-DSS, HIPAA) using NLP techniques
- **Real-time Validation:** Implementing constitutional validation as an IDE plugin that checks generated code against principles before acceptance
- **Constitution Inheritance:** Enabling cross-project constitution composition where domain-specific constitutions extend base security frameworks
- **Broader Empirical Studies:** Replicating results across diverse development teams, domains, and AI models to establish generalizability

Practitioners can begin using the methodology immediately through Speckit's AI agent slash commands:

- `/speckit.constitution` — Establish project security principles
- `/speckit.specify` — Create baseline feature specification
- `/speckit.plan` — Generate implementation plan
- `/speckit.tasks` — Generate actionable task definitions
- `/speckit.implement` — Execute implementation with constitutional constraints

---

## References

- Pearce, H., Ahmad, B., Tan, B., Dolan-Gavitt, B., and Karri, R. (2022). Asleep at the keyboard? Assessing the security of GitHub Copilot's code contributions. *Proc. IEEE Symposium on Security and Privacy (S&P)*.
- Perry, N., Srivastava, M., Kumar, D., and Boneh, D. (2023). Do users write more insecure code with AI assistants? *Proc. ACM Conference on Computer and Communications Security (CCS)*.
- MITRE Corporation (2025). 2025 CWE Top 25 Most Dangerous Software Weaknesses. https://cwe.mitre.org/top25/
- PCI Security Standards Council (2022). Payment Card Industry Data Security Standard v4.0.
- Chen, M. et al. (2021). Evaluating large language models trained on code. *arXiv preprint arXiv:2107.03374*.
- GitHub (2024). The State of the Octoverse: AI in Software Development.
- Meyer, B. (1992). Applying design by contract. *IEEE Computer*, 25(10):40–51.
- Meyer, B. (1997). *Object-Oriented Software Construction*. Prentice Hall, 2nd edition.
- Bai, Y. et al. (2022). Constitutional AI: Harmlessness from AI feedback. *arXiv preprint arXiv:2212.08073*.
- OWASP Foundation (2021). OWASP Top Ten Web Application Security Risks.
- Jones, M., Bradley, J., and Sakimura, N. (2015). JSON Web Token (JWT). *RFC 7519*, IETF.
- Zhou, Y., Liu, X., Li, Y., Wan, Y., and Liu, Y. (2025). Is vibe coding safe? Benchmarking vulnerability of agent-generated code in real-world tasks. *arXiv preprint arXiv:2512.03262*.
- Liu, Y., Wang, W., Feng, R., Zhang, Y., Xu, G., Deng, G., Li, Y., and Zhang, L. (2026). Agent skills in the wild: An empirical study of security vulnerabilities at scale. *arXiv preprint arXiv:2601.10338*.
- Speckit (2026). Speckit: Constitutional spec-driven development framework for AI-assisted code generation. https://github.com/github/spec-kit
