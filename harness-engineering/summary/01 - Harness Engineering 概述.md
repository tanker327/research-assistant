---
title: "Harness engineering: leveraging Codex in an agent-first world"
source: "https://openai.com/index/harness-engineering/"
author: Ryan Lopopolo, Member of the Technical Staff, OpenAI
published: 2026-02-11
summary_created: 2026-03-21
---

# Harness Engineering: 在 Agent-First 世界中驾驭工程能力

## 1. 文章概述

本文由 OpenAI 工程师 Ryan Lopopolo 撰写，记录了其团队在过去五个月中进行的一项实验：使用 Codex agent 构建并交付一个内部软件产品，全程 **0 行手写代码**。该产品已拥有内部日活用户和外部 Alpha 测试者，代码库规模达到约一百万行代码，由仅三名工程师（后扩展到七人）驱动 Codex 完成，估计效率提升约 10 倍。

文章的核心主题是：当软件工程团队的主要工作不再是写代码，而是设计环境、明确意图、构建反馈循环时，工程实践会发生怎样的根本性变化。作者从空仓库起步，详细分享了 agent-first 开发模式下的架构设计、知识管理、质量保障、技术债处理等方面的实战经验和教训。

## 2. 核心观点

- **Humans steer, Agents execute**：人类的角色从写代码转变为设计系统、搭建脚手架、创造杠杆效应
- 早期进展比预期慢，不是因为 Codex 能力不足，而是因为**环境定义不充分**（underspecified）
- 工程师的核心问题变为："缺少什么能力？如何让它对 agent 可读且可执行？"
- Agent 无法访问的上下文等于不存在——所有知识必须存在于仓库中
- **给 agent 一张地图，而非一本千页手册**（progressive disclosure 渐进式信息披露）
- 通过**约束不变量而非微管理实现**来保持架构一致性
- 在高吞吐环境下，修正成本低而等待成本高——传统 merge 哲学需要重新审视
- 技术债如同高利贷，持续小额偿还优于积累后集中处理

## 3. 关键概念

### Agent-First Development
以 agent 为主要代码生产者的开发模式。人类工程师专注于系统设计、意图表达和反馈循环构建，而非直接编码。

### Agent Legibility（Agent 可读性）
代码库首先为 agent 的理解能力优化，而非为人类阅读习惯优化。所有决策上下文、架构规范、产品规格都必须以仓库内版本化的形式存在（代码、Markdown、Schema、执行计划等）。

### Progressive Disclosure（渐进式信息披露）
用简短的 `AGENTS.md`（约 100 行）作为目录，指向 `docs/` 中更深层的知识源，而非将所有信息塞入一个巨大的指令文件。

### Execution Plans
复杂工作以执行计划的形式捕获，包含进展和决策日志，作为一等公民 check in 到仓库中。活跃计划、已完成计划和已知技术债都被版本化并集中管理。

### Ralph Wiggum Loop
一种 agent-to-agent 的反馈循环：指示 Codex 先自我 review，再请求其他 agent review，响应反馈，迭代直到所有 agent reviewer 满意。

### Golden Principles（黄金准则）
编码到仓库中的固执己见的机械规则，用于保持代码库对未来 agent 运行的可读性和一致性。

### Garbage Collection（垃圾回收）
定期运行后台 Codex 任务扫描偏差、更新质量评分、提交定向重构 PR，类似于代码库层面的垃圾回收机制。

## 4. 实践方法

### 环境搭建与工具链
- 应用支持按 git worktree 启动，Codex 每个变更可启动独立实例
- 集成 Chrome DevTools Protocol，使 Codex 能直接操作 DOM snapshots、截图、导航
- 搭建本地可观测性栈（Victoria Logs/Metrics/Traces + Vector），每个 worktree 临时独立，agent 可通过 LogQL/PromQL/TraceQL 查询

### 知识管理
- `AGENTS.md` 仅作目录（约 100 行），指向结构化 `docs/` 目录
- 设计文档编目索引，含验证状态和核心信仰（core beliefs）
- `ARCHITECTURE.md` 提供顶层领域和包分层地图
- 质量文档对每个产品域和架构层评分，追踪差距
- 专用 linter 和 CI job 验证知识库的时效性、交叉引用和结构正确性
- 定期运行 "doc-gardening" agent 扫描过时文档并提交修复 PR

### 架构执行
- 每个业务域划分为固定层级：Types -> Config -> Repo -> Service -> Runtime -> UI
- 严格验证依赖方向，仅允许有限的跨层边
- 跨切面关注点（auth、connectors、telemetry、feature flags）通过单一 Providers 接口注入
- 自定义 linter（Codex 生成）和结构测试机械化执行约束
- 自定义 lint 的错误消息中注入修复指引，直接进入 agent 上下文

### 技术债管理
- 曾每周五花 20% 时间手动清理 "AI slop"，后发现不可扩展
- 改为编码 golden principles + 定期后台 Codex 任务自动扫描偏差
- 偏好共享 utility 包而非手写 helper；严格边界验证而非 "YOLO-style" 探测数据

### 依赖策略
- 偏好 "boring" 技术：可组合性好、API 稳定、训练集中表示充分
- 某些情况下，让 agent 重新实现子集功能比绕过外部库的不透明行为更划算（例：自建 map-with-concurrency helper 替代 `p-limit`）

## 5. 重要数据

- **0 行手写代码**：整个产品代码库无任何人类直接贡献的代码
- **约 100 万行代码**：5 个月内从空仓库积累
- **约 1,500 个 PR**：在该期间被创建和合并
- **3.5 PRs/工程师/天**：平均吞吐量
- **3 -> 7 名工程师**：团队扩展后吞吐量反而增加
- **约 1/10 时间**：相比手写代码的效率估算
- **6 小时+**：单次 Codex 运行可持续工作的时长（常在人类睡觉时进行）
- **20% 时间**：曾用于手动清理技术债（后被自动化替代）
- **100 行**：AGENTS.md 的目标长度

## 6. 核心金句

> "**Humans steer. Agents execute.**"
> 人类掌舵，Agent 执行。

> "**Give Codex a map, not a 1,000-page instruction manual.**"
> 给 Codex 一张地图，而不是一本千页操作手册。

> "**No manually-written code.**"
> 零手写代码。

> "From the agent's point of view, anything it can't access in-context while running effectively doesn't exist."
> 从 agent 的视角来看，它在运行时无法访问的上下文实际上等于不存在。

> "**By enforcing invariants, not micromanaging implementations, we let agents ship fast without undermining the foundation.**"
> 通过约束不变量而非微管理实现细节，我们让 agent 在不破坏根基的前提下快速交付。

> "Too much guidance becomes *non-guidance*. When everything is 'important,' nothing is."
> 过多的指引等于没有指引。当一切都"重要"时，什么都不重要了。

> "Technical debt is like a high-interest loan: it's almost always better to pay it down continuously in small increments than to let it compound and tackle it in painful bursts."
> 技术债就像高利贷：持续小额偿还几乎总是优于让它复利增长后再痛苦地集中还债。

> "Building software still demands discipline, but the discipline shows up more in the scaffolding rather than the code."
> 构建软件仍然需要纪律，但这种纪律更多体现在脚手架上，而非代码本身。

## 7. 要点总结

- **角色转变**：工程师从代码编写者变为环境设计者和意图表达者，核心工作是为 agent 创造高效工作的条件
- **环境优先**：agent 的效能瓶颈不在模型能力，而在环境是否充分定义——工具、抽象、内部结构是否就位
- **仓库即真相**：所有上下文（架构决策、产品规格、团队共识）必须以版本化形式存在于仓库中，Slack 讨论和口头共识对 agent 不可见
- **地图优于手册**：渐进式信息披露比海量指令更有效，`AGENTS.md` 应是目录而非百科全书
- **机械化执行胜过文档约束**：架构约束和代码风格通过自定义 linter 和结构测试强制执行，而非依赖文档指引
- **自动化技术债管理**：通过 golden principles + 后台 agent 任务实现持续的代码库"垃圾回收"
- **高吞吐改变哲学**：当 agent 吞吐量远超人类注意力时，修正成本低而等待成本高，传统的阻塞式 merge gate 可能适得其反
- **仍有未知**：架构一致性如何在完全 agent 生成的系统中长期演化，人类判断在何处最具杠杆效应，这些仍是开放问题
