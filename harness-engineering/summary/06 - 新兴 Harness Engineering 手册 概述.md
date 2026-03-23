---
title: "The Emerging \"Harness Engineering\" Playbook"
source: "https://www.ignorance.ai/p/the-emerging-harness-engineering"
author: "Charlie Guo"
published: 2026-02-22
type: summary
language: zh-CN
---

# 新兴的 "Harness Engineering" 手册

## 1. 文章概述

本文由 Charlie Guo 撰写，系统性地梳理了当前围绕 AI coding agent 构建工程实践的新兴趋势。文章以 OpenAI、Stripe、OpenClaw 等组织的真实案例为基础，指出我们已经超越了 demo 和副项目阶段，进入了 AI agent 在生产环境中大规模运作的新时代。无论是个人开发者、小型团队还是万人公司，他们在使用 coding agent 时正在趋同于一套共通的最佳实践。

文章提出，工程师的角色正在一分为二：一半是构建"harness"（约束环境），另一半是管理 agent 的日常工作。这套被称为 "Harness Engineering" 的新兴学科，融合了软件架构、团队管理和 context engineering，正在实时形成一套可复制的 playbook。同时，文章也坦诚地讨论了目前尚未解决的难题，包括代码熵增、大规模验证、遗留代码库改造和文化采纳等问题。

## 2. 核心观点

- 工程师的工作正在分裂为两个部分：**构建环境（harness）** 和 **管理工作（directing agents）**，两者同时进行、相互反馈。
- Agent 的瓶颈从来不是写代码的能力，而是缺乏结构化的工具、约束和反馈机制。
- "Harness Engineering" 的核心理念：每当 agent 犯错，就工程化地解决问题，确保同类错误不再发生。
- 提高 AI 生成代码的可信度，需要的是**收窄解空间**而非扩大它——这与直觉相反。
- Planning（规划）正在取代 coding（编码）成为工程师最核心的工作。
- 必须对 AI 产出保持与人工代码同等甚至更高的质量标准，拒绝 "slop"（低质量代码）。
- 投资于 harness 的回报是复合型的：每次改进都惠及所有未来的 agent session。

## 3. 关键概念

- **Harness Engineering**：由 Mitchell Hashimoto（Terraform、Ghostty 创建者）命名。指围绕 AI agent 构建的约束、工具、文档和反馈循环的集合，类似于为新员工提供完善的 onboarding 环境，而非让其自行摸索。
- **AGENTS.md**：一种新兴的开放规范，放置于代码仓库根目录的 Markdown 文件，coding agent 在每次 session 开始时自动读取。包含构建步骤、测试命令、编码规范、架构约束和常见陷阱等信息。关键在于它不是静态文档，而是一个持续更新的反馈循环。
- **Attended vs. Unattended Parallelization**：两种并行工作模式。Attended 模式下开发者主动管理多个 agent session；Unattended 模式下开发者发出任务后离开，agent 自主完成到 PR 阶段。后者对 harness 成熟度要求更高。
- **Agents Captain**：Greg Brockman 建议每个团队指定的角色，负责思考 agent 如何融入团队工作流。
- **Toolshed**：Stripe 的集中式 MCP 集成平台，连接 400+ 内部工具，让 agent 拥有与人类工程师相同的工具和上下文。

## 4. 实践方法

### 构建 Harness 的四大实践

1. **Architecture as Guardrails（架构即护栏）**
   - 强制执行严格的分层架构，明确依赖方向和接口
   - 通过 custom linter 和结构化测试机械化地执行约束
   - Stripe 使用隔离的、预热的 "devboxes" 沙箱环境运行 agent

2. **Tools as Both Foundation and Feedback（工具既是基础也是反馈）**
   - 维护团队依赖的工具列表，确保通过 CLI 或 MCP server 对 agent 可访问
   - Custom linter error messages 同时作为修复指导——工具在工作中教会 agent
   - 使用 browser automation 工具进行 end-to-end testing 显著提升准确性

3. **Documentation as the System of Record（文档即系统记录）**
   - AGENTS.md 在每次 agent 出错时更新，形成反馈循环
   - OpenAI 团队用小型 AGENTS.md 指向更深层的 design docs、architecture maps 等
   - 使用 background agent 定期扫描过时文档并提交清理 PR
   - Anthropic 发现使用 JSON 做 feature tracking 比 Markdown 更可靠

4. **Planning Before Execution（先规划后执行）**
   - 在 agent 写代码之前进行充分的 upfront planning
   - Anthropic 的 "initializer agent" 从高级 prompt 生成 200+ 个独立 feature，每个带有明确测试步骤
   - 规划与执行的分离是防止浪费和保持架构控制的关键

### 管理 Agent 的三大技能

1. **Planning is the New Coding** — 花更多时间在 scoping、directing 和 reviewing 上
2. **Say No to Slop** — 维持与人工代码相同的 review 标准，在更高抽象层次上审查
3. **Orchestration, Not Just Delegation** — 并行管理多个 agent session，根据 harness 成熟度选择 attended 或 unattended 模式

## 5. 重要数据

- **Peter Steinberger (OpenClaw)**：一个人，一个月 6,600+ commits，同时运行 5-10 个 agent，发布他自己没有逐行阅读的代码
- **OpenAI Harness Engineering 团队**：3 名工程师，5 个月内构建了百万行代码的内部产品，零行手写代码，平均每人每天 3.5 个 PR，且吞吐量随团队增长而增加
- **Stripe Minions**：每周产出超过 1,000 个合并的 pull request；开发者在 Slack 中发布任务，agent 完成代码编写、通过 CI、打开 PR，中间无需人工交互
- **Stripe 工具生态**：agent 通过 MCP server 访问 400+ 内部工具
- **Anthropic**：initializer agent 可从单个高级 prompt 生成 200+ 个独立 feature
- **作者个人经验**：同时管理 3-4 个活跃 agent session 是上限，超过则人成为瓶颈

## 6. 核心金句

> "Some great engineers at OpenAI yesterday told me that their job has fundamentally changed since December."
> — Greg Brockman
> 「OpenAI 的一些优秀工程师昨天告诉我，自去年 12 月以来，他们的工作已经发生了根本性的变化。」

> "It is the idea that anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent never makes that mistake again."
> — Mitchell Hashimoto
> 「其核心理念是：每当你发现 agent 犯了一个错误，你就花时间工程化地解决它，确保 agent 再也不会犯同样的错误。」

> "In a human-first workflow, these rules might feel pedantic or constraining. With agents, they become multipliers: once encoded, they apply everywhere at once."
> — OpenAI Harness Engineering Team
> 「在以人为主的工作流中，这些规则可能显得迂腐或束缚。但对于 agent 来说，它们成为倍增器：一旦编码，就同时适用于所有地方。」

> "This separation of planning and execution is the single most important thing I do."
> — Boris Tane (Cloudflare)
> 「将规划与执行分离，是我做的最重要的一件事。」

> "Ensure that some human is accountable for any code that gets merged. As a code reviewer, maintain at least the same bar as you would for human-written code."
> — Greg Brockman
> 「确保有人对每一行合并的代码负责。作为代码审查者，至少维持与审查人工代码相同的标准。」

> "Increasing trust and reliability in AI-generated code requires constraining the solution space rather than expanding it."
> — Birgitta Böckeler (Martin Fowler's site)
> 「提高对 AI 生成代码的信任和可靠性，需要的是收窄解空间，而非扩大它。」

## 7. 要点总结

1. **Harness Engineering 是一门正在实时形成的新学科**，融合了软件架构、团队管理和 context engineering。
2. **工程师角色的核心转变**：从"写代码的人"变为"构建 agent 工作环境 + 管理 agent 工作流"的人。
3. **四大 harness 实践已趋同**：架构护栏、工具可达性与反馈、文档作为活的系统记录、充分的前置规划。
4. **质量控制比速度更重要**：agent 产出速度越快，人类的 "bullshit detection"（识别低质量代码的能力）就越关键。
5. **投资具有复合回报**：每次 AGENTS.md 更新、每个 custom linter、每个 MCP 暴露的工具都会加速所有后续任务。
6. **四大未解难题**：代码熵增与可维护性、大规模验证缺口、遗留代码库（brownfield）改造、组织文化采纳。
7. **心态转变是关键**：热爱解算法题的工程师更难适应，热爱交付产品的工程师适应更快。未来属于那些愿意放手"手工编码之美"、拥抱更高抽象层次工作的人。
