---
title: "Harness Engineering: The Complete Guide to Building Systems That Make AI Agents Actually Work (2026)"
source: "https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026"
author: "NxCode Team"
published: 2026-02-28
summary_created: 2026-03-21
---

# Harness Engineering 完整指南：构建让 AI Agent 真正运作的系统

## 1. 文章概述

本文系统性地介绍了 **Harness Engineering**（驾驭工程）这一新兴学科。文章指出，2025 年 AI Agent 证明了自己能写代码，而 2026 年行业认识到真正的难点不在于 Agent 本身，而在于围绕 Agent 构建的整套系统——即 "harness"（驾驭系统）。Harness 包括约束机制、反馈循环、文档体系和生命周期管理，其目标是让 AI Agent 在生产环境中可靠地工作。

OpenAI 的 Codex 团队用 5 个月时间构建了一个超过 100 万行代码的生产应用，其中零行代码由人类手写，所有代码均由 AI Agent 在 harness 系统内生成。这一案例有力地证明了 harness engineering 在生产规模上的可行性。文章从概念定义、核心支柱、实践方法、常见错误等多个维度对这一学科进行了全面阐述。

## 2. 核心观点

- **模型是商品，Harness 才是护城河**：底层模型的重要性远不如围绕模型构建的系统。同一模型配合不同 harness 会产生截然不同的结果。
- **Agent 不是难点，Harness 才是**：AI Agent 本身像一匹骏马，强大但缺乏方向；harness 是缰绳和马鞍，将力量引导到正确方向。
- **约束反而提升生产力**：限制 Agent 的解空间会让它更快收敛到正确方案，而非降低效率。
- **文档是关键基础设施**：对 Agent 而言，它无法访问的信息等于不存在。代码仓库必须成为唯一真相来源（single source of truth）。
- **软件工程师的角色正在演变**：从写代码转变为设计让 AI 写代码的环境，这需要更深层次的架构思维。
- **Harness 必须可演进**：过度工程化的控制流会在模型升级时崩溃，harness 应设计为可拆卸（rippable）的。

## 3. 关键概念

### Harness（驾驭系统）
源自马具的隐喻。马（horse）= AI 模型；harness = 基础设施（约束、护栏、反馈循环）；骑手（rider）= 人类工程师。Harness 是一套完整的系统，用于约束、告知、验证和纠正 AI Agent 的行为。

### Harness Engineering（驾驭工程）
设计和实现上述系统的学科，涵盖四大功能：
- **Constrain**（约束）：定义架构边界和依赖规则
- **Inform**（告知）：通过 Context Engineering 提供正确信息
- **Verify**（验证）：通过测试、Linting、CI 验证输出
- **Correct**（纠正）：通过反馈循环和自修复机制进行修正

### Context Engineering（上下文工程）
确保 Agent 在正确时间获得正确信息。包括静态上下文（`AGENTS.md`、架构文档、API 合约）和动态上下文（日志、指标、目录结构映射、CI/CD 状态）。

### Entropy Management（熵管理 / "垃圾回收"）
AI 生成的代码库会随时间积累熵——文档偏离现实、命名规范分化、死代码堆积。通过定期运行清理 Agent 来保持代码库健康。

### Reasoning Sandwich（推理三明治）
LangChain 提出的策略：规划和验证阶段使用高推理能力，实现阶段使用中等推理能力，在时间预算内获得更高质量。

## 4. 实践方法

### 三大支柱框架（OpenAI）
1. **Context Engineering**：静态文档 + 动态可观测性数据，仓库即唯一真相来源
2. **Architectural Constraints**：依赖分层（Types -> Config -> Repo -> Service -> Runtime -> UI），通过 Linter、LLM Auditor、结构测试、Pre-commit Hook 强制执行
3. **Entropy Management**：定期运行文档一致性 Agent、约束违规扫描 Agent、模式执行 Agent、依赖审计 Agent

### 分级实施路径
| 级别 | 适用场景 | 建设时间 | 核心内容 |
|------|---------|---------|---------|
| Level 1 | 单人开发者 | 1-2 小时 | `CLAUDE.md`、Pre-commit Hook、测试套件、清晰目录结构 |
| Level 2 | 3-10 人小团队 | 1-2 天 | 在 L1 基础上加 `AGENTS.md`、CI 架构约束、共享 Prompt 模板、文档即代码 |
| Level 3 | 工程组织 | 1-2 周 | 在 L2 基础上加自定义 Middleware、可观测性集成、熵管理 Agent、Harness A/B 测试、监控面板 |

### 团队实践模式
- **OpenAI 模式**：零人类代码，工程师专注于架构设计、文档编写和 Agent 行为分析
- **Stripe Minions 模式**：开发者在 Slack 发布任务 -> Minion 写代码 -> 通过 CI -> 开 PR -> 人类审查合并
- **LangChain Middleware 模式**：将 harness 结构化为可组合的 Middleware 层（LocalContext -> LoopDetection -> ReasoningSandwich -> PreCompletionChecklist）

## 5. 重要数据

- **OpenAI Codex**：5 个月内构建超过 **100 万行代码**的生产应用，**零行人类手写代码**，速度约为人类的 **10 倍**
- **LangChain**：仅改变 harness（不换模型），Terminal Bench 2.0 得分从 **52.8% 升至 66.5%**，排名从 **Top 30 跃升至 Top 5**
- **Stripe Minions**：每周产出超过 **1,000 个合并的 Pull Request**
- Level 1 Harness 仅需 **1-2 小时**搭建即可防止最常见的 Agent 错误

## 6. 核心金句

> "If 2025 was the year AI agents proved they could write code, 2026 is the year we learned that the agent isn't the hard part -- the harness is."
> 如果说 2025 年是 AI Agent 证明自己能写代码的一年，那么 2026 年就是我们认识到 Agent 不是难点——harness 才是难点的一年。

> "The model is commodity. The harness is moat."
> 模型是商品，Harness 才是护城河。

> "Without a harness, an AI agent is a thoroughbred in an open field. Fast, impressive, and completely useless for getting anything done."
> 没有 harness 的 AI Agent 就像空旷草原上的纯种马。速度快、令人印象深刻，但对完成任何实际工作毫无用处。

> "From the agent's perspective, anything it can't access in-context doesn't exist."
> 从 Agent 的角度来看，它在上下文中无法访问的任何信息都等于不存在。

> "If you over-engineer the control flow, the next model update will break your system."
> 如果你过度工程化控制流，下一次模型更新就会摧毁你的系统。

> "A harness without feedback is a cage, not a guide."
> 没有反馈的 harness 是牢笼，而非向导。

## 7. 要点总结

1. **Harness Engineering 是一门新学科**，专注于设计约束、反馈循环、文档和生命周期管理系统，使 AI Agent 可靠运行。
2. **模型可替换，Harness 不可替换**——LangChain 不换模型仅改 harness 就从 Top 30 跳到 Top 5，充分说明系统设计比模型选型更重要。
3. **三大支柱**：Context Engineering（上下文工程）、Architectural Constraints（架构约束）、Entropy Management（熵管理）。
4. **从简单开始**：一份好的 `AGENTS.md` 加 Pre-commit Hook 比复杂的 Middleware 更有实际影响力。
5. **仓库即真相来源**：所有 Agent 需要的信息必须在代码仓库中，存在于 Slack、Google Docs 或人脑中的知识对 Agent 不可见。
6. **工程师角色转变**：从写代码者变为设计 AI 写代码环境的架构师，需要更深层次的系统思维和架构能力。
7. **保持 Harness 可拆卸**：避免过度工程化，模型能力提升时应能轻松移除不再需要的控制逻辑。
8. **多供应商兼容设计**：Harness 应与模型供应商无关，确保可以在 Claude、GPT、Gemini 等模型间切换而不需重建整套系统。
