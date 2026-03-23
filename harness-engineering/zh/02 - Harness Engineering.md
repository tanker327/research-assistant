---
title: "Harness Engineering"
source: "https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html"
author:
  - "[[Birgitta BöckelerBirgitta is a Distinguished Engineer and AI-assisted delivery    expert at Thoughtworks. She has over 20 years of experience as a software    developer]]"
  - "[[architect and technical leader.]]"
published:
created: 2026-03-21
description: "关于 AI 辅助软件交付的 Thoughtworks 同事笔记"
tags:
  - "clippings"
  - "Birgitta BöckelerBirgitta is a Distinguished Engineer and AI-assisted delivery    expert at Thoughtworks. She has over 20 years of experience as a software    developer"
  - "architect and technical leader."
  - "martinfowler.com"
date: "2026-03-21T14:11:56-04:00"
---
# Harness Engineering

----

阅读 [OpenAI 最近关于"Harness Engineering"的文章](https://openai.com/index/harness-engineering/) 非常有意思。文章描述了一个团队如何以"完全不手动编写代码"作为强制约束，构建了一套 harness 来用 AI agent 维护一个大型应用。经过 5 个月，他们构建了一个真正的产品，代码量超过 100 万行。

这篇文章的标题是"Harness engineering: leveraging Codex in an agent-first world"，但正文中只提到了一次"harness"。也许这个术语是受到 [Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness) 最近博文的启发而后加的。无论如何，我喜欢用"harness"这个词来描述我们用来约束 AI agent 的工具和实践。

OpenAI 团队的 harness 组件混合了确定性方法和基于 LLM 的方法，分为 3 个类别（基于我的理解进行分组）：

1. **上下文工程**：持续增强代码库中的知识库，加上 agent 对动态上下文的访问能力，如可观测性数据和浏览器导航
2. **架构约束**：不仅由基于 LLM 的 agent 监控，还有确定性的自定义 linter 和结构性测试
3. **"垃圾回收"**：定期运行的 agent，用于发现文档中的不一致或架构约束的违规，对抗熵增和衰退

他们还强调了这个过程的迭代性："当 agent 遇到困难时，我们将其视为一个信号：找出缺失的东西——工具、防护栏、文档——然后反馈到代码仓库中，始终由 Codex 自己来编写修复。"

所有描述的措施都聚焦于提高长期的内部质量和可维护性。我在文章中没有看到的是对功能和行为的验证。

撇开这个空白不谈，假设我们可以信任 OpenAI 对这件事成功程度的描述（尊重作者和团队，但 OpenAI 确实有利益驱动让我们相信 AI 可维护的代码）——以下是我对文章*实际内容*的思考。

### Harness——未来的服务模板？

大多数组织只有两到三个主要技术栈——不是每个应用都是独一无二的雪花。这篇文章让我想象了一个未来：团队从一组针对常见应用拓扑的 harness 中选择一个来起步。这让人联想到今天的服务模板，它帮助团队在"黄金路径"上实例化新服务。Harness——包含自定义 linter、结构性测试、基础上下文和知识文档以及额外的上下文提供者——会成为新的服务模板吗？团队会把它们作为起点，然后根据应用的具体情况逐步调整吗？

对于服务模板，团队在积累经验后会回馈贡献，但其他团队往往难以整合更新。我们会在 harness 上看到类似的分叉和同步挑战吗？

这篇文章也让我重新审视了一些旧的假设：

早期和当前的 AI 编程炒作很大程度上假设 LLM 会给我们目标运行时带来无限的灵活性。用任何语言、任何模式生成代码，不受约束——LLM 会自己搞定。但要实现大规模可维护、可信赖的 AI 生成代码，必须有所取舍。

文中描述的 harness 表明，提高信任度和可靠性需要约束解决方案空间：特定的架构模式、强制的边界、标准化的结构。这意味着为了 prompt、规则和充满技术细节的 harness，要放弃一些"随意生成"的灵活性。

### 向有限数量的技术栈和拓扑收敛？

当编码不再是手敲代码，而更多是引导代码生成时，AI 可能会推动我们走向更少的技术栈。框架和 SDK 的易用性仍然重要——我们反复看到，对人类友好的东西对 AI 也友好。但开发者的品味偏好在这种细节层面将不再那么重要。接口中的小低效和特殊性不会那么恼人，因为我们不直接打交道。我们可能会选择有良好 harness 可用的技术栈，优先考虑"AI 友好性"。

这不仅适用于技术栈，也适用于代码库结构和拓扑。我们可能会默认采用更容易用 AI 维护的结构，因为它们更容易被 harness 化。OpenAI 团队讨论了架构刚性和强制规则。我能看到的主要关注领域是保持数据结构稳定，以及定义和执行模块边界。听起来合理——但没有具体示例，我仍然难以想象"我们要求 Codex 在边界处解析数据结构"在他们的 harness 中实际是什么样子。

但如果我们能广泛地弄清楚如何 harness 化代码库设计模式，这些拓扑会成为新的抽象层吗？而不是像许多 AI 爱好者所期望的那样，自然语言本身成为抽象层？

### 两个未来世界：AI 之前 vs AI 之后的应用维护？

假设我们开发出了好的 harness 技术，将 AI 自主性调高到 9，并增强了我们对结果的信心。哪些技术可以应用到现有应用中？哪些只能用于从一开始就以 harness 为设计理念的全新应用？

对于老旧代码库，我们需要考虑改造加装 harness 是否值得。AI 可以帮助我们更快完成，但那些应用往往非标准化程度很高、充满熵增，可能不值得这么做。这让我想到在一个从未用过静态代码分析工具的代码库上运行这类工具，然后被告警淹没的场景。

### 你今天的 harness 是什么？

这个团队在 harness 上工作了 5 个月，说明这不是一件能快速见效的事情。但值得反思你今天的 harness 是什么。你有 pre-commit hook 吗？里面有什么？你有自定义 linter 的想法吗？你想对代码库施加什么架构约束？你有没有尝试过像 ArchUnit 这样的结构性测试框架？

### 最后的思考

不出所料，他们描述的工作量远超只是生成和维护一堆 Markdown 规则文件。他们为 harness 的确定性部分构建了大量工具。他们的上下文工程不仅涉及策划知识库，还涉及大量的设计工作——代码设计本身就是上下文的重要组成部分。

OpenAI 团队说："我们现在最困难的挑战集中在设计环境、反馈循环和控制系统上。"这让我想起了 [Chad Fowler 最近关于"Relocating Rigor"的文章](https://aicoding.leaflet.pub/3mbrvhyye4k2e)。听到关于严谨性该往何处转移的具体想法和经验，令人耳目一新，而不是仅仅寄希望于"更好的模型"能神奇地解决可维护性问题。

最后，难得一次，我喜欢这个领域中的一个术语。虽然它才出现两周——在有人把自己的单 prompt、基于 LLM 的代码审查 agent 也叫做 harness 之前，我大概还能屏住呼吸等一等……
