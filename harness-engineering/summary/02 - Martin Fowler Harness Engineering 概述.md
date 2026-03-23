---
title: "Harness Engineering 概述"
source: "https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html"
original_title: "Harness Engineering"
author: "Birgitta Böckeler (Thoughtworks)"
created: 2026-03-21
tags:
  - "AI"
  - "harness-engineering"
  - "software-architecture"
  - "AI-assisted-development"
---

# Harness Engineering 概述

## 1. 文章概述

本文是 Thoughtworks 资深工程师 Birgitta Böckeler 对 OpenAI 发布的 "Harness Engineering" 文章的深度解读与评论。OpenAI 团队描述了他们如何在完全不手写代码的前提下，利用 AI Agent 构建并维护一个超过100万行代码的真实产品，历时5个月。他们通过构建一套称为 "Harness"（约束工具链）的系统来确保 AI Agent 生成的代码质量和可维护性。

Birgitta 在认可这一实践价值的同时，也提出了自己的思考和质疑：Harness 是否会成为未来的 Service Template？AI 是否会推动技术栈趋于统一？现有遗留系统能否受益于 Harness 技术？她指出文章缺乏对功能和行为验证的讨论，并强调构建 Harness 远不只是维护一堆 Markdown 规则文件那么简单。

## 2. 核心观点

- **Harness 是 AI Agent 的"缰绳"**：Harness 是用于约束和引导 AI Agent 的工具链和实践体系，结合了确定性方法（Deterministic）和 LLM 方法，确保 AI 生成的代码可靠、可维护。
- **信任需要约束**：要在大规模场景下信任 AI 生成的代码，必须限制解决方案空间——使用特定架构模式、强制边界、标准化结构，而非追求"生成任何东西"的无限灵活性。
- **迭代优化是关键**：当 Agent 遇到困难时，团队将其视为信号，识别缺失的工具、护栏或文档，并反馈到代码库中，由 AI 自身来编写修复。
- **功能验证缺失**：OpenAI 文章聚焦于内部质量和可维护性，但缺少对功能和行为正确性验证的讨论。
- **构建 Harness 是重投入**：OpenAI 团队花了5个月打磨 Harness，这不是一个可以快速见效的事情，需要大量确定性工具开发和 Context Engineering 设计。

## 3. 关键概念

### Harness（约束工具链）
指用于约束、引导和验证 AI Agent 行为的完整工具链和实践体系。OpenAI 团队的 Harness 包含三大类组件：

1. **Context Engineering（上下文工程）**：持续增强的代码库知识库，加上 Agent 对可观测性数据、浏览器导航等动态上下文的访问能力。
2. **Architectural Constraints（架构约束）**：不仅由 LLM Agent 监控，还通过确定性的自定义 Linter 和结构化测试来强制执行。
3. **"Garbage Collection"（垃圾回收）**：定期运行的 Agent，用于发现文档不一致或架构约束违规，对抗熵增和退化。

### Forcing Function（强制约束）
OpenAI 团队采用"完全不手写代码"作为 Forcing Function，迫使团队必须构建足够完善的 Harness 来支撑 AI 自主开发。

### Service Template（服务模板）
现有的帮助团队在"Golden Path"上快速创建新服务的模板。Harness 可能成为其未来演进形态。

## 4. 实践方法

- **自定义 Linter**：编写针对项目特定架构约束的 Linter 规则，用确定性方式（而非仅依赖 LLM）检测违规。
- **结构化测试（Structural Testing）**：使用类似 ArchUnit 的框架，对代码架构进行自动化测试，确保模块边界和数据结构稳定。
- **知识库持续策展**：不仅编写文档，更将代码设计本身作为上下文的核心部分，持续维护和增强。
- **周期性清理 Agent**：部署定期运行的 AI Agent 来发现和修复文档不一致、架构违规等问题，主动对抗代码熵增。
- **反馈闭环**：Agent 失败时识别缺失要素（工具、护栏、文档），并将改进反馈到代码库，形成持续优化循环。
- **Pre-commit Hook**：作为最基础的 Harness 组件，在提交前执行自动化检查。

## 5. 核心金句

> "When the agent struggles, we treat it as a signal: identify what is missing — tools, guardrails, documentation — and feed it back into the repository, always by having Codex itself write the fix."
>
> 当 Agent 遇到困难时，我们将其视为信号：识别缺失的部分——工具、护栏、文档——并将其反馈到代码库中，始终由 Codex 自身来编写修复。

> "Our most difficult challenges now center on designing environments, feedback loops, and control systems."
>
> 我们现在最大的挑战集中在设计环境、反馈闭环和控制系统上。

> "What's good for humans is good for AI."
>
> 对人类友好的，对 AI 也同样友好。

> "For maintainable, AI-generated code at scale that we can trust, something has to give."
>
> 要在大规模场景下获得可信赖、可维护的 AI 生成代码，必须做出某些取舍。

## 6. 要点总结

- **Harness 是 AI 辅助开发的核心基础设施**，远不止 Markdown 规则文件，需要大量确定性工具开发和系统性设计。
- **信任来自约束而非自由**：限制解决方案空间（特定架构、强制边界、标准化结构）是实现可靠 AI 代码生成的前提。
- **Harness 可能成为未来的 Service Template**，团队可从通用 Harness 起步，再根据项目特性逐步定制。
- **AI 可能推动技术栈趋于收敛**：开发者口味将让位于"AI 友好性"，团队可能优先选择有成熟 Harness 可用的技术栈。
- **遗留系统改造面临挑战**：为未经规范化的老代码库加装 Harness 可能得不偿失，未来可能出现 "Pre-AI" 和 "Post-AI" 应用维护的分化。
- **这是一项长期投资**：5个月的 Harness 建设周期说明这不是快速见效的方案，但值得从当前的 Pre-commit Hook、自定义 Linter、架构约束等基础工作开始。
- **"Rigor"（严谨性）正在迁移**：从手写代码的严谨性，转移到设计环境、反馈闭环和控制系统的严谨性。
