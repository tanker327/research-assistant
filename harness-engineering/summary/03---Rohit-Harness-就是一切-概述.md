---
source: https://x.com/rohit4verse/status/2033945654377283643
reading_list_url: https://x.com/i/article/2028491712692383744
original_title: "The Harness Is Everything: What Cursor, Claude Code, and Perplexity Actually Built"
author: Rohit (@rohit4verse)
date: 2026-03-17
stats: 1931 likes, 206 reposts, 951915 views
---

# Harness 就是一切：Cursor、Claude Code 和 Perplexity 到底构建了什么

## 一、文章概述

本文是 AI 工程领域一篇重要的技术长文，核心论点是：在 AI Agent 应用中，决定成败的不是底层模型的能力，而是模型运行所处的"Harness"（运行环境/脚手架）。作者通过 Princeton NLP 的 SWE-agent 论文、Anthropic 的 Claude Code 工程实践、OpenAI Codex 团队零人工代码实验，以及开源社区 Awesome Agent Harness 项目的分类体系，系统性地论证了这一观点。

文章详细拆解了 Harness 的技术内涵——它不是 system prompt，不是 API wrapper，而是包括工具调用、信息格式、历史压缩、错误防护、跨会话状态管理在内的完整设计环境。作者认为，Harness Engineering（环境工程）已成为 2025-2026 年应用 AI 领域最有价值的工程技能，其重要性远超 prompt engineering 和模型选择。

## 二、核心观点

- 模型能力已近乎商品化（commodity），真正的差异化来自运行环境设计
- 对 LLM Agent 而言，interface 不是便利层，而是其认知架构本身（"The interface is the mind"）
- Context window 不是 RAM，而是 Agent 的全部工作意识；无关信息会主动降低推理质量
- 同一模型在不同 interface 下性能差异可达 64%（SWE-agent 论文实证）
- Agent 失败时，正确的思路不是"换更好的模型"或"写更好的 prompt"，而是"环境缺少什么"
- 工程师的角色正在从"写代码"转变为"设计让 Agent 高效工作的环境"
- 每一次 Agent 失败都是环境需要改进的信号，形成良性循环

## 三、关键概念

### Agent-Computer Interface (ACI)
Princeton NLP 提出的概念，类比 HCI（人机交互），专门研究如何设计匹配 LLM 认知架构的交互界面。LLM 的认知特点包括：顺序 token 处理、对上下文顺序和格式敏感、有限工作记忆、对 prompt 中显著信息的锚定倾向。

### Harness（运行环境/脚手架）
Agent 运行的完整设计环境，包含：可调用的工具、信息接收格式、历史压缩与管理机制、错误防护 guardrails、跨会话工作交接的 scaffolding。

### Progressive Disclosure（渐进式信息披露）
不要一次性给 Agent 所有信息，而是给最少的定位信息和指向更深资源的指针。这是所有高效 Harness 的共同模式。

### Context Flooding（上下文洪水）
Agent 执行宽泛搜索返回大量无关结果，淹没 context window，导致后续推理质量持续下降的失败模式。

### Repository as System of Record（仓库即唯一事实来源）
Agent 无法访问 Slack、Google Docs 或团队成员脑中的知识。所有规范、架构决策、约束条件必须编码到仓库中的机器可读文件里。

## 四、实践方法

### SWE-agent 的 ACI 四大组件
1. **Search and Navigation**：搜索结果上限 50 条，超出则要求 Agent 缩小查询范围，防止 context flooding
2. **File Viewer**：有状态的文件查看器，每次显示 100 行（经实验验证的最优值），带行号标注，减少 Agent 的认知负担
3. **File Editor with Linting**：每次编辑后自动运行 linter，语法错误立即拒绝并回滚，防止级联错误
4. **Context Management**：将 5 轮之前的旧观察压缩为单行摘要，保持活跃上下文聚焦

### Anthropic 的双 Agent 架构
1. **Initializer Agent**（初始化 Agent）：专门负责环境搭建，产出三个关键文件：
   - `init.sh`：标准化开发环境启动脚本
   - `feature_list.json`：200+ 具体功能描述（JSON 格式，非 Markdown，防止 Agent 随意修改）
   - `claude-progress.txt`：跨会话进度日志 + 初始 git commit
2. **Coding Agent**（编码 Agent）：每个会话遵循标准化启动序列：pwd -> 读进度文件 -> 读功能列表 -> 运行 init.sh -> 运行基础测试 -> 开始工作。每个会话结束时必须 git commit + 更新进度文件 + 保持代码在可合并状态。
3. **Browser Automation**：通过 Puppeteer MCP Server 让 Agent 实际操作浏览器进行端到端验证，解决单元测试通过但功能实际不可用的问题。

### OpenAI Codex 团队的实践
1. **Repository Knowledge 体系**：放弃"一个大 AGENTS.md"方案（会导致上下文挤占、信息过载、快速过时、难以验证），改用结构化 `docs/` 目录 + 约 100 行的简短 AGENTS.md 作为索引入口
2. **Application Legibility**：让应用对 Agent 可见——每个 git worktree 可独立启动应用实例；集成 Chrome DevTools Protocol 处理 DOM/截图；构建完整本地可观测性栈（LogQL, PromQL, TraceQL）
3. **Mechanical Architecture Enforcement**：用自定义 linter（由 Codex 自己编写）+ 结构测试强制执行架构约束，linter 错误信息专门为 Agent 格式化，包含修复指导
4. **高吞吐合并策略**：PR 保持短生命周期，test flake 用重新运行而非阻塞来处理

### 五大设计模式（跨组织通用）
1. **Progressive Disclosure**：渐进式信息披露
2. **Git Worktree Isolation**：一个 Agent 一个 worktree，实现并行隔离
3. **Spec First, Repo as Source of Record**：规范先行，仓库为唯一事实来源
4. **Mechanical Architecture Enforcement**：机械化架构约束（非人工 code review）
5. **Integrated Feedback Loops**：尽可能紧密地闭合反馈环路

### 最小可行 Harness
1. 持久化进度文件（每次会话读写）
2. 结构化任务列表（可验证的完成标准）
3. 版本控制 + 描述性 commit message（每次会话必须 commit）
4. 浏览器自动化（如果是 Web 应用）

## 五、重要数据

- **64%**：SWE-agent 的 ACI 相比标准 bash shell 的相对性能提升（同一模型 GPT-4）
- **3.97% vs 12.47%**：GPT-4 在 SWE-bench 上使用标准 bash vs 使用 ACI 的 issue 解决率
- **100 万行代码**：OpenAI Codex 团队零人工代码实验中 5 个月内生成的代码量
- **~1,500 个 PR**：该实验中开启并合并的 Pull Request 数量
- **3 名工程师**：驱动大部分工作的核心团队规模
- **3.5 PR/工程师/天**：平均 Agent 驱动的 PR 吞吐量
- **200+**：Anthropic claude.ai clone 实验中的功能描述数量
- **100 行**：SWE-agent 文件查看器的最优单次显示行数（经实验验证）
- **50 条**：SWE-agent 搜索结果上限
- **5 轮**：SWE-agent 上下文管理中保留完整记录的最近交互轮数

## 六、核心金句

> "You are not using AI wrong because you haven't found the right model. You are using AI wrong because you haven't built the right environment."
> 你用 AI 用得不好，不是因为没找到对的模型，而是因为没有构建对的环境。

> "The model is almost irrelevant. The harness is everything."
> 模型几乎无关紧要。Harness 才是一切。

> "The interface is not a convenience layer. For an LM agent, the interface is the mind."
> 接口不是便利层。对 LM Agent 而言，接口就是心智本身。

> "You stop debugging code. You start debugging the system that produces code."
> 你不再调试代码，你开始调试产生代码的系统。

> "The model is what thinks. The harness is what thinks about. Getting that distinction right is the entire game."
> 模型负责思考。Harness 决定思考什么。理解这个区别就是全部关键。

> "If your agent cannot observe the consequences of its actions in the domain that matters, it will optimize for proxy metrics that may not correlate with actual correctness."
> 如果你的 Agent 无法在关键领域观察到自身行为的后果，它就会优化那些可能与实际正确性无关的代理指标。

> "Instead of 'how do I write a better prompt?' you ask 'what information does the agent need that it currently cannot access?'"
> 不要问"如何写更好的 prompt"，而要问"Agent 需要什么当前无法获取的信息"。

> "Every failure is a signal about what the environment needs."
> 每一次失败都是环境需要改进的信号。

## 七、要点总结

1. **Harness > Model**：AI Agent 的效能主要由运行环境决定，而非底层模型能力。同一模型在精心设计的环境中可提升 64% 的表现。

2. **Context Window 管理是核心挑战**：它不是越大越好的 RAM，而是需要精心策划的有限认知资源。信息过载会主动损害推理质量。

3. **跨会话连续性需要显式设计**：通过持久化进度文件、结构化任务列表、git commit 纪律来实现 Agent 在多个 context window 之间的有效交接。

4. **反馈环路的质量决定产出质量**：Linter 集成、浏览器自动化、可观测性工具等紧密反馈机制是高质量 Agent 输出的前提。

5. **工程师角色转型**：从"代码执行者"转变为"环境设计师"——设计工具、规范、反馈机制和架构约束，让 Agent 能高效可靠地工作。

6. **机械化约束优于人工审查**：在 Agent 高吞吐量场景下，自定义 linter 和结构测试比人工 code review 更可扩展、更一致。

7. **仓库是唯一事实来源**：所有规范、架构决策、进度状态都必须在仓库中以机器可读格式存在，Agent 无法获取的知识等于不存在。

8. **长期竞争优势在 Harness 层**：正如 Web 时代的价值在搜索引擎和浏览器，AI Agent 时代的持久价值在环境设计和编排基础设施，而非模型本身。
