# Architecture Decision Records (ADR) 完全指南

---

## 目录

1. [什么是 ADR](#1-什么是-adr)
2. [为什么需要 ADR](#2-为什么需要-adr)
3. [ADR 的核心原则](#3-adr-的核心原则)
4. [ADR 模板](#4-adr-模板)
5. [如何编写高质量的 ADR](#5-如何编写高质量的-adr)
6. [实战示例](#6-实战示例)
7. [ADR 生命周期管理](#7-adr-生命周期管理)
8. [Archgate 模式：ADR 绑定可执行规则](#8-archgate-模式adr-绑定可执行规则)
9. [ADR 工具链](#9-adr-工具链)
10. [常见反模式与避坑指南](#10-常见反模式与避坑指南)
11. [团队落地实践](#11-团队落地实践)
12. [参考资源](#12-参考资源)

---

## 1. 什么是 ADR

**Architecture Decision Record (ADR)** 是一份简短的文档，记录一个架构决策及其上下文和后果。这个概念由 Michael Nygard 在 2011 年的博文 *"Documenting Architecture Decisions"* 中首次提出并推广。

简单来说：

> **ADR = 我们做了什么决定 + 为什么这样决定 + 会带来什么影响**

每个 ADR 只记录 **一个** 架构决策。它不是设计文档，不是架构蓝图，而是一条决策日志——记录"某时某刻，在某种背景下，我们做了某个选择"。

### ADR 与其他文档的区别

| 文档类型 | 目的 | 特点 |
|---------|------|------|
| **ADR** | 记录单个架构决策及原因 | 不可变、带状态标记、简短（1-2 页） |
| 设计文档 (Design Doc) | 详细阐述某个功能/系统的设计方案 | 可更新、篇幅较长、包含实现细节 |
| 架构蓝图 (Architecture Doc) | 描述系统整体架构 | 持续更新、全局视角 |
| RFC (Request for Comments) | 征求团队对提案的反馈 | 讨论阶段使用、可能产出多个 ADR |

---

## 2. 为什么需要 ADR

### 2.1 解决的核心问题

每个团队都面临过这样的场景：

- **"这段代码为什么要这样写？"** — 三个月后没人记得当初的决策原因
- **"我们为什么用 PostgreSQL 而不是 MongoDB？"** — 新成员无法理解历史选择
- **"这个设计可以改吗？"** — 不知道改动会触发什么连锁反应
- **"同样的讨论又来了一遍"** — 缺乏记录导致决策被反复挑战

ADR 用最小的成本解决这些问题：把决策写下来，附上原因，存入代码仓库。

### 2.2 对 AI Agent 的特殊价值

在 Harness Engineering 的上下文中，ADR 的价值被进一步放大：

> "From the agent's point of view, anything it can't access in-context while running effectively doesn't exist."
> — Ryan Lopopolo, OpenAI

- **Agent 无法参加会议**：Slack 讨论、白板设计、口头共识对 Agent 不可见
- **Agent 需要结构化信息**：ADR 带有状态标记和时间戳，Agent 可通过 grep 机械化判断决策是否有效
- **ADR 防止决策知识腐败**：作为 Entropy Management（熵管理）的核心手段，ADR 确保决策历史不会随时间丢失

正如 Harness Engineering 实操手册所述：

> ADR 具有不变性原则——记录"某时做了某决定及原因"，不修改只替换（supersede）。Agent 通过 grep 发现 ADR 是安全的，因为 ADR 带时间戳和状态标记。

### 2.3 收益总结

| 收益 | 说明 |
|------|------|
| **知识传承** | 新成员可以快速理解项目历史决策和设计哲学 |
| **避免重复讨论** | 决策有据可查，避免同一话题反复争论 |
| **降低风险** | 变更前可以审查历史决策的 Context 和 Consequences |
| **提升 Agent 效能** | Agent 可通过结构化 ADR 自主理解架构约束 |
| **审计与合规** | 关键技术决策有完整的可追溯记录 |

---

## 3. ADR 的核心原则

### 3.1 不可变性 (Immutability)

这是 ADR 最重要的原则：

> **ADR 一旦被 Accepted，就不再修改其内容。当决策需要变更时，创建新 ADR 并将旧 ADR 标记为 `Superseded`。**

为什么？因为 ADR 是历史记录，不是活文档。修改历史等于篡改历史——你无法从中看到决策的演进脉络。

**正确做法**：
```
docs/adr/
├── 001-use-postgresql.md           # Status: Superseded by ADR-005
├── 002-rest-api-design.md          # Status: Accepted
├── 003-no-direct-db-in-handlers.md # Status: Accepted
├── 004-jwt-authentication.md       # Status: Deprecated
└── 005-migrate-to-cockroachdb.md   # Status: Accepted (supersedes ADR-001)
```

**错误做法**：直接修改 `001-use-postgresql.md` 的内容来反映新决策。

### 3.2 一个 ADR 一个决策 (One Decision Per ADR)

不要在一个 ADR 中塞入多个决策。每个 ADR 应当聚焦于一个核心技术方向或其直接依赖。

- 好："ADR-003: 使用 Repository Pattern 封装数据访问"
- 差："ADR-003: 数据库选型、ORM 选择和缓存策略"（应拆为 3 个 ADR）

### 3.3 简短精炼 (Concise)

一个 ADR 应该 5-10 分钟可以读完，通常 1-2 页。如同 Michael Nygard 所说：

> "The whole document should be one or two pages long. We will write each ADR as if it is a conversation with a future developer."

### 3.4 及时记录 (Timely)

在决策过程中或决策后立即编写 ADR，而非事后回忆补写。可以先用 `Proposed` 状态发起讨论，团队达成共识后改为 `Accepted`。

### 3.5 存储在代码仓库中 (Stored in Repository)

ADR 应该和代码一起版本控制，存放在 `docs/adr/` 目录中。这确保：
- 与代码变更的原子性提交
- Git blame 可追溯修改历史
- Agent 可直接在仓库中发现和引用
- Code Review 流程覆盖

---

## 4. ADR 模板

### 4.1 经典模板 (Michael Nygard 原版)

最轻量的模板，适合快速起步：

```markdown
# {编号}. {决策标题}

Date: YYYY-MM-DD

## Status

{Proposed | Accepted | Deprecated | Superseded by ADR-XXX}

## Context

{描述驱动此决策的背景、问题和约束条件}

## Decision

{做出的具体决策}

## Consequences

{此决策的正面、负面和中性后果}
```

### 4.2 MADR 模板 (Markdown Any Decision Records)

MADR 是一个更结构化的模板，强调备选方案的对比分析：

```markdown
# {决策标题}

- Status: {proposed | accepted | deprecated | superseded by ADR-XXX}
- Deciders: {参与决策的人}
- Date: YYYY-MM-DD

## Context and Problem Statement

{用 1-2 句话描述问题。以问题形式表述更佳。}

## Decision Drivers

- {driver 1, e.g., 性能要求}
- {driver 2, e.g., 团队技术栈}
- ...

## Considered Options

- {option 1}
- {option 2}
- {option 3}

## Decision Outcome

Chosen option: "{option X}", because {理由}.

### Consequences

- Good, because {正面后果}
- Bad, because {负面后果}

## Pros and Cons of the Options

### {Option 1}

- Good, because {argument a}
- Good, because {argument b}
- Bad, because {argument c}

### {Option 2}

- Good, because {argument a}
- Bad, because {argument b}
```

### 4.3 Harness Engineering 增强模板（推荐）

在经典模板基础上增加了 **Enforcement（执行机制）** 部分，将 ADR 与 linter 规则、测试绑定，实现机械化执行——这是 Harness Engineering 的核心创新：

```markdown
# ADR-{NUMBER}: {TITLE}

- **Status**: Accepted | Superseded by ADR-XXX | Deprecated
- **Date**: YYYY-MM-DD
- **Authors**: {name}
- **Enforced by**: {linter rule name / test file path / "manual review"}

## Context

{1-3 段简述。什么问题需要决策？当时的约束和背景是什么？}

## Decision

{明确的决策陈述。用"我们将..."开头。}

## Consequences

### Positive
- {好处 1}
- {好处 2}

### Negative
- {代价 1}
- {代价 2}

### Enforcement

{如何机械化执行此决策：}
- Linter rule: `{rule-name}` in `{config-file}`
- Structure test: `{test-file-path}`
- CI check: `{workflow-name}`

## Alternatives Considered

### {Alternative A}
- Pros: ...
- Cons: ...
- Why rejected: ...
```

**为什么推荐这个模板？**

相比经典模板，增加的 `Enforced by` 和 `Enforcement` 字段将"为什么"（ADR）和"做什么"（linter 规则/测试）绑定在一起。Agent 违规时，linter 错误消息可直接引用 ADR 编号，形成完整闭环。

---

## 5. 如何编写高质量的 ADR

### 5.1 Context（上下文）的写法

Context 是 ADR 中最重要的部分——它解释了 **为什么** 需要做这个决策。

**写什么**：
- 当前面临的具体问题或挑战
- 相关的技术约束（性能、安全、兼容性）
- 业务约束（时间、预算、合规要求）
- 团队现状（技能、规模、已有技术栈）

**不写什么**：
- 不要写成教科书式的技术介绍
- 不需要从零解释背景技术
- 避免过度冗长——1-3 段即可

**好的 Context 示例**：
```markdown
## Context

我们的用户认证系统目前使用服务端 Session，存储在 Redis 中。随着系统扩展到
3 个数据中心，Session 同步延迟已影响用户体验（P99 > 500ms）。同时，移动端
APP 的用户量在过去 6 个月增长了 300%，Session 存储成本每月增加 $2,000。
团队已有 JWT 的使用经验（在内部工具项目中使用过）。
```

**差的 Context 示例**：
```markdown
## Context

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间安全地传输
信息。它由三部分组成：Header、Payload、Signature...（长篇教科书式介绍）
```

### 5.2 Decision（决策）的写法

- 用 **"我们将..."** 开头，明确且直接
- 写具体的技术选择，不是模糊的方向
- 包含必要的约束条件

**好的 Decision**：
```markdown
## Decision

我们将使用 JWT（RS256 算法）替代服务端 Session 进行用户认证。
Access Token 有效期 15 分钟，Refresh Token 有效期 7 天，存储在
HttpOnly Cookie 中。Token 黑名单通过 Redis 维护，仅用于主动登出场景。
```

**差的 Decision**：
```markdown
## Decision

我们决定使用 JWT。
```

### 5.3 Consequences（后果）的写法

**必须同时列出正面和负面后果**。只写好处是最常见的反模式之一。

```markdown
## Consequences

### Positive
- 消除跨数据中心 Session 同步问题，认证延迟降至 <10ms
- 减少 Redis 存储成本约 $2,000/月
- 移动端无需维护 Session Cookie，简化客户端实现

### Negative
- Token 被盗后无法即时撤销（需等待过期或走黑名单机制）
- JWT payload 增加每次请求的网络传输量（约 +800 bytes）
- 团队需要学习 JWT 安全最佳实践（预计 1 周培训）
```

### 5.4 Alternatives Considered（备选方案）

记录你考虑过但没有选择的方案及其原因。这部分的价值在于：
- 未来团队不会重新提议已被否决的方案
- 如果前提条件改变，可以快速重新评估

```markdown
## Alternatives Considered

### Sticky Sessions + Redis Cluster
- Pros: 改动最小，团队已熟悉
- Cons: 不能根本解决跨数据中心延迟，Redis Cluster 运维复杂度高
- Why rejected: 只是缓解而非解决核心问题

### OAuth 2.0 + 外部 IdP (Auth0)
- Pros: 功能完善，免维护
- Cons: 月成本约 $5,000 (按 MAU 计费)，引入外部依赖
- Why rejected: 成本过高，且团队有能力自建
```

---

## 6. 实战示例

### 示例 1：数据库选型

```markdown
# ADR-001: 使用 PostgreSQL 作为主数据库

- **Status**: Accepted
- **Date**: 2026-01-15
- **Authors**: Eric Wu, Jane Chen
- **Enforced by**: manual review

## Context

我们正在构建一个电商平台 MVP，预计第一年处理约 10,000 并发用户。
系统需要支持复杂的商品目录查询（多维度筛选、全文搜索）、订单事务处理
（ACID 保证）以及用户行为分析。团队 5 人中 4 人有 PostgreSQL 经验，
1 人有 MongoDB 经验。项目时间约束为 3 个月交付 MVP。

## Decision

我们将使用 PostgreSQL 15+ 作为主数据库，利用其 JSONB 字段支持灵活
的商品属性存储，使用内置全文搜索满足初期搜索需求。

## Consequences

### Positive
- ACID 事务保证订单数据一致性
- JSONB 提供 NoSQL 式灵活性同时保留关系型查询能力
- 团队经验充足，上手成本低
- 成熟的生态（监控、备份、运维工具丰富）

### Negative
- 水平扩展不如分布式数据库简单（但 MVP 阶段不需要）
- 全文搜索性能不及 Elasticsearch（但初期数据量可以接受）

### Enforcement
- CI check: migration lint 检查 SQL 规范
- Structure test: 所有数据库访问必须通过 Repository 层

## Alternatives Considered

### MongoDB
- Pros: Schema 灵活，JSON 原生支持
- Cons: 事务支持较弱，团队经验不足，复杂查询需要聚合管道
- Why rejected: 电商场景的事务要求高，且团队 PostgreSQL 经验更丰富

### MySQL 8.0
- Pros: 广泛使用，性能稳定
- Cons: JSONB 支持不如 PostgreSQL 完善，全文搜索功能较弱
- Why rejected: PostgreSQL 在灵活查询和 JSON 处理方面优势明显
```

### 示例 2：API 分层架构（含 Enforcement）

```markdown
# ADR-003: 禁止在 UI 组件中直接调用 API

- **Status**: Accepted
- **Date**: 2026-03-15
- **Authors**: Team Lead
- **Enforced by**: oxlint rule `no-direct-fetch-in-components`

## Context

Agent 在生成 React 组件时，频繁在组件内直接使用 fetch() 调用后端 API，
绕过了 src/repos/ 层的统一错误处理和认证头注入。导致多个组件重复实现
错误处理逻辑，且认证 token 刷新逻辑不一致。

## Decision

我们将禁止在 src/components/ 和 src/pages/ 目录下直接使用 fetch()、
axios 或任何 HTTP 客户端。所有 API 调用必须通过 src/repos/ 层的
repository 函数完成。

## Consequences

### Positive
- API 调用逻辑集中管理，错误处理和认证一致
- Agent 生成的组件更简洁，只关注展示逻辑
- API 变更只需修改 repo 层，不需要逐个修改组件

### Negative
- 简单的一次性 API 调用也需要在 repo 层创建函数

### Enforcement
- Linter rule: `no-direct-fetch-in-components` in oxlint.json
- Structure test: src/__tests__/architecture.test.ts
- CI check: lint-and-typecheck workflow

## Alternatives Considered

### 只在 CLAUDE.md 中写规范要求
- Pros: 零成本实现
- Cons: Agent 只在"大多数时候"遵守，无法保证 100% 执行
- Why rejected: 用机制而非提示词保障质量
```

### 示例 3：配置管理

```markdown
# ADR-001: 统一通过 config 模块管理环境变量

- **Status**: Accepted
- **Date**: 2026-02-10
- **Authors**: Eric Wu
- **Enforced by**: ruff rule `banned-api["os.getenv"]`

## Context

项目中多处直接使用 os.getenv() 获取环境变量，导致以下问题：
1. 环境变量名散落在各文件中，无法集中查看所需变量清单
2. 缺少类型验证，拼写错误在运行时才暴露
3. 默认值处理不一致，部分地方有 fallback 部分没有

## Decision

我们将禁止直接使用 os.getenv()。所有环境变量必须通过
src/core/config.py (Pydantic Settings) 统一管理。

## Consequences

### Positive
- 所有配置集中定义，新成员一目了然
- Pydantic 自动进行类型验证和类型转换
- 启动时即验证必需变量是否存在（fail fast）
- Agent 只需查看一个文件即可了解所有配置项

### Negative
- 每新增一个环境变量需先在 config.py 中定义

### Enforcement
- Linter rule: `banned-api["os.getenv"]` in pyproject.toml [tool.ruff]
- Error message:
  ```
  ERROR: Direct os.getenv() call detected.
  WHY: All config must go through src/core/config.py. See ADR-001.
  FIX: Import settings from src.core.config and use settings.YOUR_VAR.
  ```

## Alternatives Considered

### python-decouple
- Pros: 轻量，支持 .env 文件
- Cons: 无类型验证，无自动文档生成
- Why rejected: Pydantic Settings 功能更完整，团队已使用 Pydantic
```

### 示例 4：ADR 被 Supersede 的实例

```markdown
# ADR-005: 从 PostgreSQL 迁移至 CockroachDB

- **Status**: Accepted
- **Date**: 2026-06-20
- **Authors**: Eric Wu
- **Enforced by**: manual review + migration CI pipeline
- **Supersedes**: ADR-001

## Context

自 ADR-001 以来，平台用户量增长 20 倍，单机 PostgreSQL 已接近
性能瓶颈（P99 查询延迟 > 200ms）。我们需要水平扩展能力，同时保持
PostgreSQL 的兼容性以最小化迁移成本。

## Decision

我们将主数据库从 PostgreSQL 迁移至 CockroachDB，利用其 PostgreSQL
兼容的 SQL 接口和自动分片能力。迁移分三阶段进行：双写 → 读切换 → 写切换。

## Consequences

### Positive
- 自动水平扩展，无需手动分片
- 保持 PostgreSQL SQL 兼容，现有查询代码改动最小
- 内置多区域部署支持

### Negative
- 运维工具链需要重建（监控、备份策略）
- 部分 PostgreSQL 特有功能不兼容（如部分扩展）
- 迁移期间需维护双写逻辑

## Alternatives Considered

### PostgreSQL + Citus 扩展
- Pros: 保持 PostgreSQL 生态
- Cons: 分片逻辑需手动管理，运维复杂度高
- Why rejected: CockroachDB 的自动分片更适合我们的运维能力
```

同时更新 ADR-001 的状态：

```markdown
# ADR-001: 使用 PostgreSQL 作为主数据库

- **Status**: Superseded by ADR-005
- **Date**: 2026-01-15
...（其余内容保持不变）
```

---

## 7. ADR 生命周期管理

### 7.1 状态流转

```
Proposed  ──────>  Accepted  ──────>  Superseded by ADR-XXX
                       │
                       └──────────>  Deprecated
```

| 状态 | 含义 | 触发条件 |
|------|------|---------|
| **Proposed** | 草案，征求反馈中 | 创建 ADR 时 |
| **Accepted** | 当前有效，必须遵守 | 团队达成共识后 |
| **Superseded by ADR-XXX** | 被新决策取代 | 新 ADR 替代旧决策时 |
| **Deprecated** | 已弃用，不再适用 | 决策不再相关时（如相关功能被移除） |

### 7.2 编号与命名规范

推荐使用 **三位数字编号 + 短横线 + 描述性名称**：

```
docs/adr/
├── template.md
├── 001-use-postgresql.md
├── 002-rest-api-design.md
├── 003-no-direct-api-calls-in-components.md
├── 004-jwt-authentication.md
└── 005-migrate-to-cockroachdb.md
```

**命名建议**：
- 使用小写字母和短横线
- 名称应体现决策内容，而非问题本身
- 好："003-no-direct-api-calls-in-components"
- 差："003-api-problem"

### 7.3 创建新 ADR 时的检查流程

每次创建新 ADR 时，按以下步骤操作：

**Step 1：扫描现有 ADR**

查看 `docs/adr/` 目录中所有状态为 `Accepted` 的 ADR，检查是否有被你的新决策替代的。

```bash
# 快速查看所有现有 ADR 的状态
grep -r "Status" docs/adr/ --include="*.md"
```

**Step 2：判断是否需要更新旧 ADR**

- **新决策是全新主题**（如第一次选择消息队列）→ 不需要更新任何旧 ADR，直接创建新的
- **新决策替代了旧决策**（如从 PostgreSQL 迁移到 CockroachDB）→ 需要更新旧 ADR 的状态

大多数情况下是前者，不需要更新旧 ADR。

**Step 3：如果需要更新，只改状态行**

在旧 ADR 中，只修改 Status 这一行，其他内容保持不变（不可变原则）：

```markdown
# 旧 ADR (001-use-postgresql.md)
# 修改前:
- **Status**: Accepted

# 修改后:
- **Status**: Superseded by ADR-005
```

**Step 4：在新 ADR 中注明替代关系**

```markdown
# 新 ADR (005-migrate-to-cockroachdb.md)
- **Status**: Accepted
- **Supersedes**: ADR-001
```

### 7.4 定期回顾

- 每 6-12 个月回顾现有 ADR
- 检查 `Accepted` 状态的 ADR 是否仍然有效
- 前提条件变化的 ADR 应被 `Superseded` 或 `Deprecated`
- 回顾本身也可以产出新的 ADR

---

## 8. Archgate 模式：ADR 绑定可执行规则

这是 Harness Engineering 的核心创新——将 ADR 从"建议性文档"升级为"可执行约束"。

### 8.1 核心思想

> 用机制而非提示词保障质量：Hook 强制跑 Linter 是"每一次"，CLAUDE.md 里写"请跑 Linter"是"大多数时候"。
> — Harness Engineering 实操手册

每个 ADR 可以关联一个可执行的 linter 规则文件：

```
docs/adr/
├── 003-no-direct-api-calls-in-components.md        # 决策文档（为什么）
└── 003-no-direct-api-calls-in-components.rules.ts   # lint 规则（做什么）
```

### 8.2 错误消息格式

当 Agent（或人类）违反规则时，linter 错误消息直接引用 ADR 编号，形成闭环：

```
ERROR: Direct API call (fetch) detected in component file.
WHY:   All API calls must go through src/repos/ for consistent error handling. See ADR-003.
FIX:   1) Create or find the appropriate repo in src/repos/
       2) Add the API call as a method on that repo
       3) Import and use the repo method here instead
EXAMPLE:
  Bad:  const res = await fetch('/api/users')
  Good: import { getUsers } from '@/repos/user.repo'; const users = await getUsers()
```

这种格式的价值：
- **ERROR**：什么错了
- **WHY**：为什么有此规则 + ADR 编号（Agent 可以自主查阅完整决策上下文）
- **FIX**：具体修复步骤（Agent 可以自主修复）
- **EXAMPLE**：正反对比示例

### 8.3 实现示例

**TypeScript (oxlint/eslint)**：
```typescript
// oxlint 自定义规则配置
{
  rules: {
    "no-direct-fetch-in-components": {
      severity: "error",
      messages: {
        noDirectFetch: [
          "ERROR: Direct API call detected in component file.",
          "WHY: All API calls must go through src/repos/. See ADR-003.",
          "FIX: Move the API call to the appropriate repo in src/repos/.",
        ].join("\n"),
      },
    },
  },
}
```

**Python (ruff)**：
```toml
# pyproject.toml
[tool.ruff.lint.flake8-tidy-imports.banned-api]
"os.getenv".msg = """
ERROR: Direct os.getenv() call detected.
WHY: All config must go through src/core/config.py. See ADR-001.
FIX: Import settings from src.core.config and use settings.YOUR_VAR.
"""
```

---

## 9. ADR 工具链

### 9.1 adr-tools (CLI)

基于 Bash 的 ADR 管理命令行工具，使用 Nygard 格式。

**安装 (macOS)**：
```bash
brew install adr-tools
```

**常用命令**：
```bash
# 初始化 ADR 目录
adr init docs/adr

# 创建新 ADR
adr new "Use PostgreSQL as primary database"
# -> 创建 docs/adr/0001-use-postgresql-as-primary-database.md

# 查看 ADR 列表
adr list

# 将 ADR 标记为被替代
adr new -s 1 "Migrate to CockroachDB"
# -> 创建新 ADR 并自动将 ADR-001 标记为 Superseded

# 生成 ADR 关系图
adr generate graph | dot -Tpng > adr-graph.png

# 生成目录
adr generate toc
```

### 9.2 Log4brains

一个更现代的 ADR 管理工具，提供 Web UI 来浏览 ADR。

```bash
npm install -g log4brains

# 初始化
log4brains init

# 创建新 ADR
log4brains adr new

# 启动预览服务器
log4brains preview

# 构建静态站点
log4brains build
```

### 9.3 手动管理（推荐起步方式）

对于大多数团队，不需要任何工具——手动创建 Markdown 文件就够了：

```bash
# 创建 ADR 目录和模板
mkdir -p docs/adr

# 复制模板
cp docs/adr/template.md docs/adr/001-your-decision.md

# 编辑并提交
vim docs/adr/001-your-decision.md
git add docs/adr/001-your-decision.md
git commit -m "ADR-001: Your decision title"
```

**推荐原因**：ADR 的核心价值在于内容，而非工具。先把写 ADR 的习惯建立起来，再考虑工具优化。

---

## 10. 常见反模式与避坑指南

### 反模式 1：Mega-ADR（巨型 ADR）

**症状**：一个 ADR 超过 3 页，包含大量图表、代码片段和实现细节。

**问题**：ADR 变成了设计文档，失去了"快速查阅决策"的价值。

**解决**：将详细设计放入独立的设计文档，ADR 只保留决策和关键理由。如果需要图表，链接到外部文档。

### 反模式 2：只记好处不记代价 (Fairy Tale)

**症状**：Consequences 部分只有 Positive，没有 Negative。

**问题**：浅层论证无法说服未来的读者，决策更容易被轻率推翻。

**解决**：强制要求至少列出一个 Negative consequence。没有代价的决策通常意味着分析不够深入。

### 反模式 3：事后补写 (Sprint/Rush)

**症状**：项目做完了才开始"补"ADR。

**问题**：事后回忆不准确，丢失当时的上下文和被否决的备选方案。

**解决**：在决策讨论时就创建 `Proposed` 状态的 ADR，讨论过程中持续完善。

### 反模式 4：没有人读的 ADR

**症状**：ADR 写了但团队不看，新成员不知道有 ADR。

**问题**：ADR 失去价值，逐渐被遗忘。

**解决**：
- 在 `AGENTS.md` / `CLAUDE.md` 中引用 ADR 目录
- 在 linter 错误消息中引用 ADR 编号（Archgate 模式）
- Code Review 时检查是否有相关 ADR 需要创建
- 新成员 Onboarding 时要求阅读所有 Accepted ADR

### 反模式 5：把 ADR 当政策文件 (Blueprint in Disguise)

**症状**：ADR 的语气像法律法规，充满详细的规定和流程。

**问题**：ADR 应该是决策日志，记录"我们做了什么选择和为什么"，不是制度文件。

**解决**：保持叙事式写作，就像和未来的开发者对话。

### 反模式 6：隧道视野 (Tunnel Vision)

**症状**：只从开发角度考虑，忽略了运维、安全、成本等影响。

**问题**：隐藏的后果在未来爆发。

**解决**：Consequences 部分从多个维度评估：开发、运维、安全、成本、性能、用户体验。

---

## 11. 团队落地实践

### 11.1 快速启动（第 1 周）

1. **创建 `docs/adr/` 目录和模板文件**
2. **写第一个 ADR**：选一个团队最近做过的技术决策（如框架选择、架构模式），回顾性地写出来
3. **在 AGENTS.md / CLAUDE.md 中添加 ADR 指引**：
   ```markdown
   ## Decision Records
   - ADRs: docs/adr/
   - Template: docs/adr/template.md
   ```
4. **约定：新的架构决策必须附带 ADR**

### 11.2 习惯养成（第 2-4 周）

1. **Code Review 中加入 ADR 检查**：如果 PR 涉及架构变更，是否附带了 ADR？
2. **每次技术讨论的结论记录为 ADR**：会议结束前 5 分钟指定一人撰写 ADR
3. **开始实践 Archgate 模式**：为最关键的 ADR 添加对应的 linter 规则

### 11.3 成熟运营（第 2 个月起）

1. **所有 linter 规则的错误消息引用 ADR 编号**
2. **每季度回顾 ADR，更新过时的决策**
3. **新成员 Onboarding 清单包含"阅读所有 Accepted ADR"**
4. **Agent 工作流中引用 ADR**：禁止事项清单中引用 ADR 编号

### 11.4 什么时候应该创建 ADR？

**ADR 是为架构决策准备的，不是每个 feature 或 bug fix 都需要。**

#### 不需要 ADR 的场景

这些是日常开发工作，直接做即可：

- 新增一个 CRUD 接口或页面
- 修复已有逻辑的 bug
- UI 变更（新页面、组件、样式调整）
- 不改变架构的代码重构
- 更新依赖版本（minor/patch）
- 局部实现细节的调整
- 可轻易回滚的变更

#### 需要 ADR 的场景

这些决策会长期影响项目，值得记录：

- 选择或更换数据库（PostgreSQL vs MongoDB）
- 引入新的架构模式（事件驱动、CQRS、微服务拆分）
- 采用新的框架或核心库
- 变更认证/授权策略
- 定义跨模块的架构约束（如"禁止在 handler 中直接访问数据库"）
- 重大依赖升级（改变系统运行方式的）
- 跨团队影响的技术决策

#### 判断标准速查表

| 需要 ADR | 不需要 ADR |
|---------|----------|
| 影响系统架构的决策 | 局部实现细节 |
| 引入长期约束的选择 | 可轻易回滚的变更 |
| 存在多个备选方案的权衡 | 明显只有一种做法 |
| 未来团队成员需要理解的选择 | 团队共识无需记录 |
| 跨团队影响的决策 | 单人单模块的实现 |

#### 三个快速判断问题

做决策时问自己：

1. **这个决策是否约束了未来的架构方向？** — 如果是，写 ADR
2. **未来的团队成员是否需要理解我们为什么这样选？** — 如果是，写 ADR
3. **是否存在多个可行的备选方案需要权衡？** — 如果是，写 ADR

三个问题都回答"否"——直接动手做，不需要 ADR。

**经验法则**：如果你在做技术决策时和同事讨论了超过 15 分钟，那它可能值得一个 ADR。

---

## 12. 参考资源

### 核心参考

- [Michael Nygard - Documenting Architecture Decisions (原始博文)](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Organization (官方资源汇总)](https://adr.github.io/)
- [MADR - Markdown Any Decision Records](https://adr.github.io/madr/)
- [Joel Parker Henderson - ADR 模板与示例大全](https://github.com/joelparkerhenderson/architecture-decision-record)

### 行业实践

- [AWS - Master Architecture Decision Records: Best Practices](https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/)
- [AWS - ADR Process (Prescriptive Guidance)](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html)
- [Google Cloud - Architecture Decision Records Overview](https://docs.cloud.google.com/architecture/architecture-decision-records)
- [Microsoft Azure - Maintain an ADR (Well-Architected Framework)](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record)
- [UK Government - Architectural Decision Record Framework](https://www.gov.uk/government/publications/architectural-decision-record-framework/architectural-decision-record-framework)

### 反模式与进阶

- [Olaf Zimmermann - How to Create ADRs and How Not To](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html)
- [TechTarget - 8 Best Practices for Creating ADRs](https://www.techtarget.com/searchapparchitecture/tip/4-best-practices-for-creating-architecture-decision-records)

### 工具

- [adr-tools (CLI)](https://github.com/npryce/adr-tools) - Bash 脚本管理 ADR
- [Log4brains](https://github.com/thomvaill/log4brains) - ADR 管理与 Web UI
- [MADR Templates](https://adr.github.io/adr-templates/) - 多种模板选择
- [ADR Tooling Overview](https://adr.github.io/adr-tooling/) - 工具生态汇总

### 本项目内部参考

- [Harness Engineering 实操手册](../Harness%20Engineering%20实操手册.md) - 第 3.4 节：ADR 模板与管理策略

---

> **文档版本**: v1.0 | **创建日期**: 2026-03-22 | **作者**: Generated with research
