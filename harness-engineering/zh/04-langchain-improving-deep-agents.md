---
Source: https://blog.langchain.com/improving-deep-agents-with-harness-engineering/
Author: LangChain 团队
Date: 2026年2月17日
---

# 通过 Harness Engineering 改进深度 Agent

阅读时间 8 分钟 2026年2月17日

摘要：我们的编程 Agent 在 [Terminal Bench 2.0](https://www.tbench.ai/leaderboard/terminal-bench/2.0?ref=blog.langchain.com) 上从前 30 名跃升至前 5 名。我们只改变了 harness。以下是我们的 harness engineering 方法（剧透：自我验证和 tracing 帮助很大）。

## Harness Engineering 的目标

Harness 的目标是将模型固有的、参差不齐的智能塑造成适合我们所关注任务的形态。**Harness Engineering** 关注的是系统层面——你在模型周围构建工具，以优化任务性能、token 效率、延迟等目标。设计决策包括系统提示词、工具选择和执行流程。

但你应该如何改变 harness 来改进你的 Agent 呢？

在 LangChain，我们使用 [Traces](https://docs.langchain.com/langsmith/observability-quickstart?ref=blog.langchain.com) 来大规模地理解 Agent 的故障模式。当今的模型在很大程度上仍是黑箱，其内部机制难以解读。但我们可以在文本空间中观察它们的输入和输出，然后将其用于我们的改进循环中。

我们使用了一个简单的方法来迭代改进 [deepagents-cli](https://github.com/langchain-ai/deepagents/tree/main/libs/cli?ref=blog.langchain.com)（我们的编程 Agent），在 Terminal Bench 2.0 上提升了 `13.7 分`，从 `52.8` 提高到 `66.5`。我们只调整了 harness，模型保持不变，使用的是 `gpt-5.2-codex`。

![Terminal Bench 分数](images/04-terminal-bench-scores.png)

## 实验设置与 Harness 的可调参数

我们使用了 [Terminal Bench 2.0](https://www.tbench.ai/?ref=blog.langchain.com)，这是目前评估 Agent 编程能力的标准 benchmark。它包含 89 个任务，涵盖机器学习、调试和生物学等领域。我们使用 [Harbor](https://harborframework.com/?ref=blog.langchain.com) 来编排运行。它负责启动沙箱（[Daytona](https://www.daytona.io/?ref=blog.langchain.com)）、与我们的 Agent 循环交互，以及运行验证和评分。

每个 Agent 的操作都存储在 [LangSmith](https://smith.langchain.com/?ref=blog.langchain.com) 中，同时包括延迟、token 数量和成本等指标。

### **我们可以调整的参数**

Agent harness 有很多可调参数：系统提示词、工具、hooks/middleware、技能、子 Agent 委派、记忆系统等等。我们刻意压缩了优化空间，聚焦于三个方面：**系统提示词、工具** 和 [**Middleware**](https://docs.langchain.com/oss/python/langchain/middleware/overview?ref=blog.langchain.com#the-agent-loop)（我们对模型调用和工具调用前后的 hooks 的统称）。

我们从默认提示词和标准工具+middleware 开始。使用 GPT-5.2-Codex 得分为 52.8%。这是一个不错的分数，刚好在排行榜前 30 名之外，但仍有提升空间。

![实验结果](images/04-langsmith-trace.png)

### **Trace Analyzer 技能**

我们希望 trace 分析具有可重复性，因此将其做成了一个 Agent 技能。这是我们用于**分析跨运行错误并改进 harness** 的方法。流程如下：

  1. 从 LangSmith 获取实验 traces
  2. 生成并行的错误分析 Agent -> 主 Agent 综合发现和建议
  3. 汇总反馈并对 harness 进行针对性修改



这与 [boosting](https://en.wikipedia.org/wiki/Boosting_\(machine_learning\)?ref=blog.langchain.com) 的工作方式类似，它专注于前几轮运行中的错误。在第 3 步中，人类可以提供很大帮助（虽然不是必需的），用于验证和讨论拟议的更改。过度拟合某个任务的更改不利于泛化，可能导致其他任务出现回退。

自动化 trace 分析节省了大量时间，使我们能够快速尝试实验。我们将很快发布这个技能，目前正在测试其在通用提示词优化方面的应用。

![Trace Analyzer 技能](images/04-trace-analyzer-skill.png)

## 哪些改进真正提升了 Agent 性能

自动化 Trace 分析使我们能够[调试 Agent 出错的位置](https://www.langchain.com/conceptual-guides/agent-observability-powers-agent-evaluation?ref=blog.langchain.com)。问题包括推理错误、不遵循任务指令、缺少测试和验证、超时等。我们在下面的章节中详细介绍这些改进。

### 构建与自我验证

当今的模型是出色的自我改进机器。

**自我验证允许 Agent 在单次运行中通过反馈进行自我改进**。然而，它们并没有天然的倾向去进入这种**构建-验证循环**。

最常见的失败模式是 Agent 编写了一个解决方案，重新阅读自己的代码，确认看起来没问题，然后就停了。测试是自主 Agent 编程的关键部分。它有助于测试整体正确性，同时给 Agent 提供了可以持续优化的信号。

我们在系统提示词中添加了关于如何进行问题解决的指导。

  1. **规划与探索：** 阅读任务，扫描代码库，根据任务规格说明以及如何验证解决方案来制定初始计划。
  2. **构建：** 以验证为导向实施计划。构建测试（如果不存在的话），测试正常路径和边界情况。
  3. **验证：** 运行测试，阅读完整输出，与要求进行对比（而不是与你自己的代码对比）。
  4. **修复：** 分析任何错误，回顾原始规格说明，修复问题。



我们特别注重测试，因为它驱动了每次迭代中的变化。我们发现，除了提示词之外，确定性的上下文注入也有助于 Agent 验证其工作。我们使用了一个 `PreCompletionChecklistMiddleware`，它在 Agent 退出前进行拦截，提醒它根据任务规格说明进行验证。这类似于 [Ralph Wiggum Loop](https://ghuntley.com/loop/?ref=blog.langchain.com)，其中一个 hook 强制 Agent 在退出时继续执行，我们将其用于验证。

![自我验证循环](images/04-self-verification-loop.png)

### 为 Agent 提供环境上下文

Harness engineering 的一部分是**为上下文工程构建良好的交付机制**。Terminal Bench 任务附带目录结构、内置工具和严格的超时限制。

  1. **目录上下文与工具：** 一个 `LocalContextMiddleware` 在 Agent 启动时运行，映射 `cwd` 以及其他父级和子级目录。我们运行 `bash` 命令来查找 `Python` 安装等工具。上下文发现和搜索容易出错，因此注入上下文可以减少这类错误面，并帮助 **Agent 熟悉其运行环境**。
  2. **教 Agent 编写可测试的代码：** Agent 不知道它们的代码需要具备可测试性。我们添加提示词说明它们的工作将通过程序化测试来衡量，类似于提交代码时的情况。例如，任务规格说明中提到的文件路径应该严格遵循，以确保解决方案在自动评分步骤中能正常工作。强调边界情况的提示词有助于 Agent 避免只检查"正常路径"情况。强制模型遵循测试标准是一种有效策略，可以避免随时间推移产生"粗糙代码堆积"。
  3. **时间预算管理：** 我们注入时间预算警告，提醒 Agent 完成工作并转向验证。Agent 在时间估算方面表现很差，因此这种启发式方法在此环境中很有帮助。现实世界的编程通常没有严格的时间限制，但如果不添加任何约束知识，Agent 就不会在时间范围内工作。



Agent 对其环境、约束和评估标准了解得越多，就越能自主地指导自己的工作。

**Harness 工程师的职责：准备和交付上下文，使 Agent 能够自主完成工作。**

### 鼓励 Agent 退后一步重新考虑计划

Agent 一旦决定了一个计划就可能变得目光短浅，导致"死循环"——对同一个有问题的方法反复做微小变化（在某些 traces 中超过 10 次）。

我们使用了一个 `LoopDetectionMiddleware`，通过工具调用 hooks 跟踪每个文件的编辑次数。在对同一文件进行 `N` 次编辑后，它会添加类似"...考虑重新审视你的方法"的上下文。这可以帮助 Agent 从死循环中恢复，尽管如果模型认为自己是正确的，它可能会继续沿着同一条路走下去。

重要说明：这是一种设计启发式方法，针对当前已知的模型问题进行工程化处理。随着模型的改进，这些防护措施可能将不再必要，但在当下，它们有助于 Agent 正确且自主地执行。

### 选择在推理上投入多少计算资源

推理模型可以自主运行数小时，因此我们必须决定在每个子任务上投入多少计算资源。你可以在每个任务上使用最大推理预算，但大多数工作都能从优化推理计算支出中受益。

Terminal Bench 的超时限制带来了一个权衡。更多推理帮助 Agent 评估每一步，但可能消耗超过 `2x` 的 token/时间。`gpt-5.2-codex` 有 4 种推理模式：`low`、`medium`、`high` 和 `xhigh`。

我们发现推理在规划阶段对全面理解问题很有帮助，Terminal Bench 的一些任务非常困难。一个好的计划有助于更快地找到可行的解决方案。

后期的验证阶段同样受益于更多的推理来捕捉错误并提交解决方案。作为启发式方法，我们选择了 xhigh-high-xhigh 的"**推理三明治**"作为基线。

![推理三明治](images/04-reasoning-sandwich.png)__在规划和验证阶段投入更多推理计算资源__

仅使用 `xhigh` 由于 Agent 超时，得分仅为 `53.9%`，而使用 `high` 则为 `63.6%`。在试验运行中，不同推理预算分配之间没有太大差异，因此我们坚持了我们的方法，最终将得分推至 `66.5%`。

模型的自然方式是**自适应推理**，如 [Claude](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking?ref=blog.langchain.com) 和 [Gemini](https://ai.google.dev/gemini-api/docs/thinking?ref=blog.langchain.com) 模型所展示的那样，由模型自行决定在推理上投入多少计算资源。

在多模型 harness 中，平衡推理预算可以表现为使用大型模型进行规划，然后[移交](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs?ref=blog.langchain.com)给较小的模型进行实现。

## 构建 Agent Harness 的实用要点

Agent 的设计空间很大。以下是我们从实验和整体构建 deepagents 过程中总结出的一些通用原则。

  1. **代替 Agent 进行上下文工程。** 对于当今的 Agent 来说，上下文组装仍然很困难，尤其是在陌生环境中。通过目录结构、可用工具、编码最佳实践和问题解决策略等上下文来引导模型，有助于减少因搜索不当和规划中可避免的错误导致的错误面。
  2. **帮助 Agent 自我验证其工作。** 模型倾向于接受它们找到的第一个看似合理的解决方案。积极地提示它们通过运行测试和优化解决方案来验证工作。这在没有人工参与的自主编程系统中尤为重要。
  3. **Tracing 作为反馈信号。** Traces 允许 Agent 进行自我评估和自我调试。将工具和推理结合在一起调试很重要（例如：模型走错路是因为它们缺少工具或不知道如何做某件事的指导）。
  4. **短期内检测并修复不良模式。** 当今的模型并不完美。Harness 设计者的职责是围绕当前的不足进行设计，同时为更智能的模型做好规划。盲目重试和不验证工作就是很好的例子。这些防护措施几乎肯定会随着时间推移而消失，但为了在当下构建稳健的 Agent 应用，它们是值得尝试的有用工具。
  5. **为模型量身定制 Harness。** [Codex](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide/?ref=blog.langchain.com) 和 [Claude](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices?ref=blog.langchain.com) 的提示词指南表明，不同模型需要不同的提示策略。使用早期版本 harness 对 Claude Opus 4.6 的测试得分为 `59.6%`，具有竞争力但不如 Codex，因为我们没有对 Claude 运行相同的改进循环。许多原则是通用的，如良好的上下文准备和对验证的重视，但针对你的任务进行几轮 harness 迭代有助于跨任务最大化 Agent 性能。



在 harness 设计方面还有更多开放研究要做。有趣的方向包括多模型系统（Codex、Gemini 和 Claude 协同工作）、用于持续学习的记忆原语以使 Agent 能够自主改进任务表现，以及衡量 harness 变化对不同模型的影响。

对于改进 Agent 的外层循环，我们正在研究 [RLMs](https://alexzhang13.github.io/blog/2025/rlm/?ref=blog.langchain.com) 等方法来更高效地挖掘 traces。我们将继续改进 harness 并公开分享我们的研究成果。

我们创建了一个 [Traces 数据集](https://smith.langchain.com/public/29393299-8f31-48bb-a949-5a1f5968a744/d?tab=2&ref=blog.langchain.com)与社区分享。

Deep Agents 是开源的。[Python](https://github.com/langchain-ai/deepagents?ref=blog.langchain.com) 和 [Javascript](https://github.com/langchain-ai/deepagentsjs?ref=blog.langchain.com)。

**愿我们持续攀登，持续开放研究。**

### 订阅我们的新闻通讯

来自 LangChain 团队和社区的最新动态

输入您的邮箱 订阅

正在处理您的申请...

成功！请检查您的收件箱并点击链接确认订阅。

抱歉，出现了问题。请重试。

[ ](https://x.com/LangChain) [ ](https://www.youtube.com/@LangChain)

© LangChain Blog 2026