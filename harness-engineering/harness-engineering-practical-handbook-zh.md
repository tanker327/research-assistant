# Harness Engineering 实操手册

_中文版，基于 `harness-engineering/original` 中的本地资料集重新整理，并结合截至 **2026 年 3 月 25 日** 的更新一手资料刷新。_

---

## 如何阅读本手册

这不是旧版中文手册的逐字翻译，而是一份与当前英文版对齐的新版中文整理稿，重点优化了：

- 与 `harness-engineering/original` 本地资料集的一致性
- 更适合中文读者阅读的结构
- 纳入本地资料之后发布的新一手资料
- 更明确地区分“相对稳定的原则”和“变化较快的实现细节”

如果某条内容来自有明确发布日期的文章，文中会尽量标出日期。  
如果某条内容来自当前文档页面而不是固定文章，则会标注为 **当前文档**。

---

## 第一章：什么是 Harness Engineering

### 1.1 核心定义

**Harness Engineering** 是围绕 AI Coding Agent 设计其工作环境的工程学科，其目标是让 Agent 的产出变得**可靠、可验证、可维护**。

Harness 不是：

- 一个 system prompt
- 一层 API wrapper
- 一个 memory 功能
- 狭义 benchmark 意义上的测试 harness

Harness 是围绕模型构建的**完整运行环境**，包括：

- 工具
- 约束
- 文档
- 启动流程
- 反馈回路
- 测试接口
- 状态交接机制
- 运行时策略
- review 边界

最好的简化公式仍然是：

```text
Agent = Model + Harness
```

模型提供原始能力，Harness 将这种能力转化为可信的软件工程产出。

### 1.2 为什么重要

纵观本地资料集，最稳定、最一致的结论是：

**现在影响结果的往往不是 prompt 微调，而是环境设计。**

代表性证据如下：

| 来源 | 日期 | 信号 |
|---|---|---|
| OpenAI, _Harness engineering: leveraging Codex in an agent-first world_ | 2026 | 5 个月约 100 万行代码，且按设计零手写代码 |
| LangChain, _Improving Deep Agents with harness engineering_ | 2026-02-17 | 同一个模型，仅改 Harness，Terminal Bench 2.0 从 52.8% 提升到 66.5% |
| Stripe, _Minions_ Part 1 | 2026-02-09 | 每周 1,000+ merged PR 由 Agent 端到端完成 |
| Stripe, _Minions_ Part 2 | 2026-02-19 | 指标更新到每周 1,300+ merged PR |
| SWE-agent / ACI 脉络 | 2024 起 | 不换模型，仅靠接口与环境设计就显著改变 benchmark 结果 |

对工程基础差的惩罚也变了。过去文档差、测试弱、架构模糊，问题会慢慢浮现；在 Agent 工作流中，同样的问题会以机器速度被持续放大。

### 1.3 工程师的工作已经变了

本地资料与更新后的行业文章在这一点上高度一致：

- 人类仍然定义意图
- 人类仍然拥有架构与质量的最终责任
- 人类直接写代码的时间在下降
- 最高杠杆的工作，正在转移到计划、校准和环境设计

OpenAI 将其描述为：从直接实现，转向设计环境。  
Charlie Guo 将其描述为：工程师的工作“一分为二”，既要搭环境，也要管理任务。  
George 则用控制论的视角解释：人类不再“手动拧阀门”，而是去设计调速器。

### 1.4 控制论是最合适的心智模型

George 的文章提供了非常强的概念框架：

- 瓦特调速器闭合了蒸汽机速度控制回路
- Kubernetes 闭合了期望运行状态的控制回路
- Harness Engineering 正在闭合软件变更层面的控制回路

代码库以前并不是没有回路，只是回路停留在较低层级：

- 编译器闭合语法回路
- 测试闭合行为回路
- linter 闭合风格回路

新的变化在于：LLM 同时成为了更高抽象层上的**传感器**和**执行器**：

- Agent 可以感知架构或语义问题
- Agent 也可以尝试直接修复

这并不意味着校准不再重要，恰恰相反，它变得更重要了。

### 1.5 三大支柱

#### 支柱一：Context Engineering（上下文工程）

Agent 只能知道它能够访问到的信息。任何不在仓库中、也不能通过工具稳定访问到的信息，在实践中都等同于缺失上下文。

通常可以分成两层：

- **通用上下文**：测试、CI、lint 规则、类型信息、schema、contract
- **校准上下文**：ADR、架构文档、质量原则、带修复指导的规则

#### 支柱二：Architectural Constraints（架构约束）

代码库需要通过机械化方式明确边界：

- 依赖方向
- 禁止 import
- 分层边界
- 允许运行路径
- 配置与策略保护

目标不是规定每一个实现细节，而是把那些必须稳定的部分锁定住，同时在边界内保留局部自主性。

#### 支柱三：Entropy Management（熵管理）

AI 生成的仓库会快速积累熵：

- 重复 helper
- 模式不一致
- 注释过时
- 架构漂移
- “能跑就行”的修复不断复利

答案不是最后来一次大扫除，而是持续垃圾回收。

### 1.6 ACI：大多数总结里最容易遗漏的概念

本地资料里最重要、也最容易被弱化的概念之一，是 **Agent-Computer Interface（ACI）**。  
这一脉络来自 SWE-agent，并在 Rohit 的整合文章中被强调得很清楚。

关键点是：Harness 不是“给模型更多上下文”，而是设计一个**适合 LLM 认知方式的接口**。

ACI 的关键教训包括：

- 搜索结果必须限流，并引导 Agent 细化查询
- 文件阅读应该窗口化，而不是整文件倾倒
- 编辑之后应该立即得到本地验证反馈
- 过期上下文应该被总结或卸载

这也是为什么“context window 不是 RAM”这句话如此重要。  
你不是在给模型堆内存，你是在整理它当前的工作意识。

### 1.7 最新行业图景

本地资料已经覆盖了 2026 年初的收敛趋势。之后，几篇官方一手文章又进一步把图景讲清楚了：

- **OpenAI，2026-01-23**：_Unrolling the Codex agent loop_ 明确解释了 agent loop、prompt 组装、prompt caching、compaction 和 statelessness 的权衡。
- **OpenAI，2026-02-04**：_Unlocking the Codex harness_ 展示了 Harness 本身正在演化成一个可复用的运行时表面，并通过稳定协议暴露给不同客户端。
- **Stripe，2026-02-19**：_Minions Part 2_ 将讨论从“Agent 可以写代码”推进到了“Agent 需要标准化开发环境、deterministic blueprint 节点、裁剪后的 MCP，以及有限次 CI 迭代”。
- **Anthropic 当前文档**：Context engineering 与 context-window 文档已明确把 compaction、note-taking、just-in-time retrieval 和 context awareness 视为一等运行时问题。

这意味着当前行业前沿已经不再只是：

> “我该怎么给 coding agent 写 prompt？”

而是：

- 如何安全地运行 agent loop？
- 如何在长时任务里保持上下文一致性？
- 如何把 Harness 暴露为一个可复用运行时？
- 如何复用面向人类开发者的优秀基础设施，而不是另造一套低质量 Agent 专用系统？

---

## 第二章：核心心智模型

### 2.1 Repository as System of Record（仓库即系统真相来源）

这是本地资料集中重复次数最多的一条规则。

如果 Agent 不能从仓库里读到，或不能通过工具稳定访问到，那它就不能算系统的一部分。

这会倒逼团队把以下内容显式放入仓库：

- 面向仓库的架构文档
- ADR
- 状态文件
- 可测试的结构化接口
- 自动生成的参考资料，而不是手工维护的描述性副本

### 2.2 地图优于手册

最好的 `AGENTS.md` 不是巨型规则手册。

它应该是：

- 短
- 指针式
- 稳定
- 加载成本低
- 明确 build/test 路径与禁止事项

这既符合 OpenAI 的“给地图，不要给千页手册”的表述，也符合 Stripe 的经验：全局无条件规则过多，会在 Agent 真正开始工作前就把上下文塞满。

### 2.3 Progressive Disclosure（渐进披露）

“渐进披露”这个模式在多个来源中反复出现：

- OpenAI 的 docs-as-map
- Anthropic 的启动流程
- SWE-agent 的 capped search
- Stripe 的目录作用域规则
- Agent runtime 中的工具按需加载

规则很简单：先给最小稳定定向层，再让 Agent 按需拉取更多上下文。

### 2.4 收窄解空间

跨来源最强的结论之一是：更高的可靠性，往往来自**减少自由度**，而不是无限扩张自由度。

这看起来和很多 LLM 宣传相反，因为宣传强调开放生成；但对可维护系统而言，约束反而是乘法器。

约束可以表现为：

- 固定项目拓扑
- 强分层边界
- 裁剪后的工具集
- 启动脚本
- 确定性的验证步骤
- worktree 隔离

### 2.5 面向人类先建设，再复用于 Agent

Stripe 的 Part 2 在这一点上尤其有价值。他们最强的无人值守 Agent 优势，来自本来就为人类工程师建设的基础设施：

- 标准化远程 devbox
- 强隔离
- 可预测启动
- 共享工具层
- 快速本地反馈

因此，本手册明确反对一个常见反模式：

> 不要为 Agent 另造一套低质量平行世界。应该建设优秀的开发者基础设施，让 Agent 继承它。

---

## 第三章：上下文工程的实践方式

### 3.1 Context Engineering 大于 Prompt Engineering

Anthropic 最近关于 context engineering 的文章给出了一个很好的区分：

- **prompt engineering**：主要关注怎么写指令
- **context engineering**：关注推理时完整 token 状态的策划与管理

换句话说，prompt 只是 context 的一个子集。

完整的上下文面包括：

- system / developer instructions
- 工具 schema
- 历史消息
- 本地文件
- 检索出来的文档
- 当前运行时元数据
- 模型总结、记忆、状态工件

### 3.2 指令要处在正确的高度

System prompt 最常见的两种失败方式是：

- 写得过于僵硬、像硬编码逻辑
- 写得过于抽象、像空泛口号

合适的高度应该是：

- 具体到能引导行为
- 抽象到能泛化
- 小到足够可读

### 3.3 Just-in-Time Retrieval 优于一开始全塞进去

Anthropic 当前文章一个重要更新是对 **just-in-time retrieval** 的强调。

现代 Agent 系统越来越倾向于：

- 只保留轻量引用和标识符
- 在运行时再拉取需要的数据
- 只查看当前看起来相关的部分
- 用 note-taking 或摘要来实现持久化

在 coding 和 research 场景中，这种模式特别自然，因为：

- 文件路径
- 目录名称
- 时间戳
- issue ID
- 存储的查询

本身就是很好的轻量路由元数据。

### 3.4 把 Context 当成稀缺注意力预算

Context 的有限性至少体现在两个层面：

- 有一个硬性的 token 上限或操作上限
- 在逼近硬上限之前，质量已经会先下降

这就是 **context rot** 的实践含义。Anthropic 当前文档与本地资料中引用的 Chroma 研究都指向同一件事：context 不是越多越好。

### 3.5 默认应该放进上下文的内容

默认应放入的高价值内容：

- 当前任务
- 执行约束
- 最小稳定环境说明
- build / test 命令
- 高信号的仓库特定规则

默认不应该放入的低信号内容：

- 巨大全局规则集
- 冗长低信号风格说明
- 大量工具目录
- 已经过时的描述性文档
- 除非当前决策依赖它，否则不要把大段日志直接放进主上下文

### 3.6 上下文工程检查表

你应该反复问自己：

1. 模型在开始动作前，必须知道什么？
2. 哪些内容可以延迟检索？
3. 哪些信息更适合存到外部记忆，而不是一直留在 live context 里？
4. 哪些约束应该机械化执行，而不是写成文字？
5. 哪些 token 正在挤占有效推理空间？

---

## 第四章：Harness 运行时

### 4.1 Harness 正在变成产品层能力

OpenAI 后续几篇工程文章的重要意义在于：它们揭示了一个方向变化。

Harness 不再只是“内部实现细节”，它正逐渐成为一个可复用的运行时表面。

最清晰的例子就是 OpenAI 在 **2026 年 2 月 4 日** 发布的 **Codex App Server** 文章。

### 4.2 Threads、Turns 与 Items

OpenAI 的 App Server 文章提供了一套非常实用的运行词汇：

- **thread**：一次持续会话的持久容器
- **turn**：由一次用户输入触发的一轮 Agent 工作
- **item**：输入 / 输出的最小原子单元，例如消息、工具调用、diff、审批请求

这很重要，因为一个成熟 Harness 需要稳定原语来处理：

- 持久化
- 流式更新
- 审批
- 重连
- UI 渲染
- 回放

### 4.3 Serious Harness 需要 API，而不只是终端

App Server 的案例也表明，一个严肃的 Harness 往往需要：

- 传输协议
- 向后兼容语义
- 明确的生命周期事件
- thread 持久化
- 稳定的客户端绑定

这强烈说明，“agent harness” 正在从一种本地 coding 技巧，演化为运行时平台类别。

### 4.4 Tools、Skills 与 MCP

本地资料已经强调了工具质量的重要性，OpenAI 和 Stripe 的更新资料则进一步证明：这仍然是前沿工程问题。

关键规则包括：

- 工具要清晰、不重叠
- 工具输出要 token-efficient
- 工具契约要稳定
- 工具列表要裁剪，而不是越多越好

Stripe 的 **Toolshed** 与 OpenAI 的工具 / runtime 接线方式，最终都指向同一条经验：

> 大型组织会希望拥有一个可被多个 Agent 表面复用的共享能力层。

### 4.5 Blueprint Workflow 与自由 Agent Loop

Stripe Part 2 提供了一个非常实用的新术语：**blueprints**。

Blueprint 是一种可以混合以下两类节点的工作流：

- 确定性节点
- Agentic 节点

这也是目前行业里关于“什么事情不应该交给自由工具循环”的最好解释之一。

适合确定性节点的任务：

- 便宜、重复、可预测
- 失败成本高
- LLM 几乎不需要“自己判断”

典型例子：

- 跑配置好的 lint
- push 分支
- 应用已知 autofix
- 限制 CI 重试策略

适合 Agentic 节点的任务：

- 需要解释和理解
- 搜索空间真实存在
- 需要从陌生错误中恢复

典型例子：

- 实现功能
- 解释 CI 失败
- 重构模块
- 调试微妙交互问题

### 4.6 运行时设计启发

一个好的 Harness runtime 通常会把这些问题做成显式能力：

- 哪些状态是持久的
- 哪些状态会被重放
- 哪些内容会被缓存
- 哪些动作需要审批
- 哪些工作可以无人值守执行
- compaction 与 memory 的默认策略是什么

---

## 第五章：让仓库可读

### 5.1 真正目标是 Legibility（可读性）

OpenAI 的材料反复强调：目标不只是“有文档”，而是让仓库**对 Agent 可读**。

一个对 Agent 可读的代码库，意味着它能快速判断：

- 我现在在哪里？
- 系统是怎么组织的？
- 哪些内容是 canonical？
- 当前哪里坏了？
- 接下来该做什么？

### 5.2 什么应该放进仓库

好的候选内容：

- 架构文档
- ADR
- 启动脚本
- 测试
- schema
- 质量规则
- 进度工件
- feature tracking 工件

需要谨慎的内容：

- 与可执行真相重复的高层描述性文档
- 没有保鲜机制的设计笔记
- 本来应该交给 formatter/linter 的长篇风格指南

### 5.3 `AGENTS.md` / `CLAUDE.md`

根文件要小。

建议内容包括：

- install / build / test 命令
- 架构地图指针
- 禁止事项
- 必须执行的验证步骤
- 深层文档链接

不要试图把整个系统都塞进一个文件。

### 5.4 ADR 在 Agentic Repo 中更重要

ADR 的价值在于：它把人类决策外化成 Harness 可以引用的形式。

适合 Agent 工作流的 ADR 应该是：

- 短
- 具体
- 能和 enforcement 连接起来

理想情况下，ADR 应绑定可执行规则。

### 5.5 Brownfield 改造

Martin Fowler 的评论与 Charlie Guo 的 “What’s Still Hard” 非常重要，因为它们能对抗过度乐观的叙事。

在老项目上 retrofit Harness 很难，原因包括：

- 边界本来就不清晰
- 测试可能很弱
- 文档可能过时
- 标准化程度低
- 一口气加太多检查会被历史问题淹没

更合理的 brownfield 顺序是：

1. 先加最短反馈环
2. 再加仓库可见的状态与文档
3. 先收紧最关键的架构边界
4. 自动化再逐步增强

### 5.6 Harness 会成为新的 Service Template

Martin Fowler 延伸出的另一个重要判断是：Harness 很可能会成为新的 **service template** 或 **golden path**。

一个可复用的 Harness 模板可以包含：

- `AGENTS.md`
- ADR 目录
- pre-commit 配置
- 默认 lint / format
- CI 检查
- 启动脚本
- 状态文件约定
- 安全默认值

这意味着 Harness Engineering 最终会变成组织级能力，而不只是某个仓库里的局部实践。

---

## 第六章：架构与确定性质量

### 6.1 约束不变量，而不是把 Taste 全留给 Review

那些容易被机械判断的问题，不应该等到人类 Review 再发现。

应该编码进系统的内容：

- 禁止 import
- 层级方向
- 配置保护
- 必须验证项
- 命名与结构约束

应该留给人类 Review 的内容：

- 业务正确性
- 微妙的产品取舍
- 抽象质量
- 长期设计判断

### 6.2 推荐约束类型

适合做成规则的约束：

- 分层边界
- 接口 shape
- 边界处 schema 校验
- 依赖方向
- 限制配置篡改
- 对某类改动强制要求测试存在

### 6.3 错误信息应该教会 Agent 如何修

这是整个资料集中最实用、也最容易被低估的经验之一。

linter 错误不应该只说：

> invalid dependency

它还应该告诉 Agent：

- 穿越了哪条边界
- 这条规则为什么存在
- 合法修复方式有哪些
- 如有必要，对应哪条 ADR

### 6.4 保护 Harness 不被 Agent 反噬

一个非常常见的反模式是：Agent 不是修代码，而是修改规则让错误消失。

因此需要保护：

- lint 配置
- CI 配置
- secret 文件
- 环境变量文件
- 视工作流需要，也包括部署相关清单

### 6.5 先 deterministic loop，再谈 prompt

这一点在所有来源中都成立：

- hook 强制验证，优于“请记得跑 lint”
- 确定性本地检查，优于事后人工评论
- 快速、可预测的反馈，优于叠更多模糊文字指令

### 6.6 快速反馈栈

推荐的反馈层级：

1. post-edit 本地检查
2. pre-commit 验证
3. CI
4. human review

只要能安全地下移，就应把检查下移。

---

## 第七章：测试、应用可读性与验证

### 7.1 Agent 需要“眼睛”

一个高频失败模式是：Agent 觉得事情完成了，因为代码“看起来没问题”。

这就是为什么 E2E 验证如此重要。

### 7.2 Application Legibility（应用可读性）

OpenAI 提出的 “application legibility” 应该是任何严肃手册中的一级概念。

让 Agent 读源代码还不够。它还应该能够通过结构化接口观察运行中的系统：

- 浏览器自动化
- DOM 快照
- accessibility tree
- 必要时截图
- 日志
- 指标
- trace

代码可见性回答“代码里有什么”。  
应用可读性回答“系统到底有没有正确工作”。

### 7.3 隔离运行环境

这里反复出现的两个具体模式是：

- **git worktree 隔离**
- **标准化远程开发环境**

OpenAI 强调每个 worktree 都能独立启动应用实例。  
Stripe 强调 devbox 必须热启动、可并行、可隔离、且安全。

共同结论是：

> 当每个任务都有隔离、可预测、低启动摩擦的环境时，Agent 会表现得更好。

### 7.4 将反馈左移

Stripe Part 2 将一个运营原则讲得非常清楚：

如果某个检查将来会在 CI 失败，那就尽量把它提前到更靠左的位置。

这能节省：

- token
- CI 时间
- human review 往返
- 调试延迟

### 7.5 按界面类型设计 E2E 策略

推荐层级：

- **Web 应用**：浏览器自动化与结构化 UI 检查
- **API**：HTTP / integration tests
- **CLI/TUI**：终端自动化
- **Infra**：plan/apply 校验与环境断言
- **ML/LLM 系统**：benchmark / eval loop、安全检查、漂移检测

### 7.6 验证规则

应明确以下规则：

- 功能只有在“目标域”里验证通过，才算完成
- 单元测试通过不等于完整功能可用
- Agent 应拿结果对照原始规格，而不是拿结果对照自己的实现

---

## 第八章：长时 Agent 与状态交接

### 8.1 多 Context Window 问题

这是 naive agent 系统最大的缺口之一。

即使模型很强，只要同时出现以下条件，表现就会明显下降：

- 项目超过一个 context window
- 每次新会话都是冷启动
- 半成品不断堆积
- 没有结构化交接机制

Anthropic 关于 long-running harness 的文章，仍然是这个问题最清晰的官方处理方式之一。

### 8.2 Initializer Agent -> Coding Agent

Anthropic 的双角色模式应该被视为核心设计模式，而不是旁支技巧：

- **initializer agent**：创建初始工作环境与持久支架
- **coding agent**：每次只推进一个功能，并留下清晰交接痕迹

initializer 常见产物包括：

- `init.sh`
- progress log
- feature list
- 初始 commit

### 8.3 Feature List 作为完成真相

Anthropic 文中最有实践价值的想法之一是：

不要让 Agent 通过“看代码”来猜项目是否完成。

更好的方法是维护结构化 feature list：

- 每个功能都有明确测试步骤
- 每个功能初始都标记为 failing
- 完成状态通过显式字段更新

这样可以避免 Agent 因为“代码已经有不少了”就误判项目已经完成。

### 8.4 Clean State Requirement（干净状态要求）

每次会话结束都应处于可交接状态。

这意味着：

- 不留下无关坏状态
- 代码要么提交，要么回退到已知良好基线
- progress 要更新
- next step 要外化

一旦 clean state 被放弃，长时 Agent 系统会迅速退化。

### 8.5 标准启动流程

一个好的启动序列通常包括：

1. 确认当前目录
2. 读取近期 git 历史
3. 读取 progress 工件
4. 读取 feature list
5. 运行 init 脚本
6. 跑一个基础 smoke path
7. 然后才开始新工作

这样可以避免在本来已经坏掉的基础上继续堆新功能。

### 8.6 Git 是跨会话桥梁

Git 的价值不仅是源码管理，也是认知支架：

- commit history 解释近期意图
- 干净 revert 帮助回到可工作状态
- 有描述性的 commit message 能帮助下一个 Agent

### 8.7 结构化状态文件

将下一个会话必须知道的状态放到文件里。

典型候选：

- progress log
- feature list
- known issues
- next-step note
- task queue

对于高度结构化状态，JSON 通常比 Markdown 更安全。

---

## 第九章：Context Rot、Compaction、Memory 与 Search

### 9.1 Context Rot 是真实存在的

Anthropic 当前文章与早期 Chroma 研究，都支持同一个实践结论：

- context 变长会降低检索与聚焦质量
- bloated context 会降低精度
- 只有当新增上下文真正相关且可读时，更多 context 才有价值

### 9.2 Compaction

Compaction 现在已经是主流 Harness 技术。

它的目的很简单：

- 总结仍然重要的内容
- 丢掉低价值残渣
- 用更小、更清晰的状态重新启动

OpenAI 2026 年 1 月的文章和 Anthropic 当前文档，都把 compaction 视为成熟 agent runtime 的一等能力。

### 9.3 工具结果清理与卸载

不是每条工具结果都应该永久留在上下文中。

安全且有用的策略包括：

- 在上下文中只保留摘要
- 将大输出写入文件
- 需要时再让 Agent 重新打开文件

这是保持长会话 context 可用性的最可靠方法之一。

### 9.4 结构化记笔记

Anthropic 更新后的 context engineering 文章在这一点上尤其强。

结构化 note-taking 或 memory 系统能帮助 Agent：

- 保留长时任务进度
- 在 context reset 后延续目标
- 在 compaction 后快速恢复
- 让主上下文保持聚焦

关键不是存下一切，而是存下“未来动作真正需要的部分”。

### 9.5 Just-in-Time Search

把搜索和检索当作运行时导航，而不是一开始就把一切全部塞进来。

高信号模式包括：

- 先搜目录，再搜文件
- 把文件名和目录结构当成路由线索
- 拉切片，不拉全集

### 9.6 Context Awareness 作为运行时能力

Anthropic 当前文档又提出了一个很有价值的新点：**context awareness**。

真正重要的实践含义，不是某个产品细节，而是：

> 更好的 Harness 会把当前 token 预算与 context 状态显式暴露给 Agent，让它可以自适应地调整行为。

这也提示了 Harness 的一个设计方向：

- 让运行时限制对 Agent 可见
- 不要逼 Agent 去猜现在还剩多少预算

---

## 第十章：编排、自主性与规模化

### 10.1 有人值守 vs 无人值守

本地资料明确区分了两种模式：

- **attended parallelization**：人类同时盯着多个活跃 Agent 会话
- **unattended execution**：Agent 从任务一路推进到 PR，中间几乎不需要干预

自主性越高，对 Harness 的要求就越高。

### 10.2 并行化必须依赖隔离

Rohit 的综合文章与 Stripe 的实战经验都反复证明：

- 一个 Agent 对应一个隔离 worktree 或环境
- 不同任务不应共享可变工作区
- 任务结束后要有可预测的清理机制

### 10.3 吞吐量会改变合并哲学

OpenAI 的文章提出了一个不太舒服、但很重要的观点：

当 Agent 吞吐量超过人类注意力时，过去适用于低吞吐量人类开发的流程，可能会变得低效。

这**不**意味着降低质量标准，而是意味着：

- 强化自动化
- 保持改动更小
- 减少不必要等待
- 用更好的自动化处理 flaky 或低信号失败，而不是无限阻塞

### 10.4 推理预算与子任务

LangChain 的工作还给了一个实践启发：

- 在 planning 和 verification 更需要推理时，可以多给推理预算
- 不要默认所有阶段都开最大 reasoning

这本质上是 Harness 决策，而不只是模型参数决策。

### 10.5 Sub-agents

Anthropic 最新 context engineering 指南进一步增强了一个已经在成形的模式：

sub-agent 特别适合隔离以下工作：

- 深度探索
- 专项验证
- 有边界的研究子任务
- 集中修复型工作

主 Agent 只应该接收 distilled summary，而不应该吞掉整个探索轨迹。

---

## 第十一章：重新看 Minimum Viable Harness

### 11.1 第一周

先把最小盒子搭起来：

1. 简短的 `AGENTS.md`
2. build / test / lint 命令
3. pre-commit
4. 至少一个 smoke test
5. 一条 ADR
6. 受保护文件规则

### 11.2 第 2-4 周

提高可靠性：

1. 给一个核心流程加 E2E 或浏览器自动化
2. 增强架构边界
3. 增加 progress / state 工件
4. 如果是长时任务，则增加 feature tracking
5. 增加 stop / verification gate

### 11.3 第 2 个月以后

开始规模化：

1. 增加带修复指导的自定义 lint 规则
2. 增加结构化清理流程
3. 增加 worktree 或远程环境隔离
4. 增加共享工具层
5. 增加基础遥测与质量指标

### 11.4 组织级规模

当多个团队都开始采用 agentic coding 时，应投入建设：

- Harness 模板
- 共享开发环境
- 中央工具发现层
- 策略与安全控制
- 在统一基础之上的团队级定制能力

---

## 第十二章：常见反模式

### 12.1 巨型指令文件

症状：

- 定位慢
- 规则互相冲突
- 真正重要的内容反而被稀释

更好的方法：

- 根目录做地图
- 深层目录做局部规则

### 12.2 人类专属文档

如果真正的决策逻辑都藏在聊天工具和会议里，Agent 就会不断重复违背这些隐性规则。

### 12.3 启动流程薄弱

如果没有标准启动序列，每次会话都会浪费 token 去重新发现同样的状态。

### 12.4 允许 Agent 改规则

如果 Agent 能悄悄改 lint 或 CI 配置，Harness 很快就会塌。

### 12.5 Context Flooding（上下文洪水）

常见来源：

- 搜索输出过大
- 全文件 dump
- 巨量日志直接贴进上下文
- 一开始加载过多全局工具

### 12.6 轻信 Agent 自报完成

如果验证弱，Agent 很容易过早停止。

### 12.7 无限 CI 重试循环

重试次数必须有上限，否则系统会持续消耗：

- token
- 时间
- CI 资源
- 操作员信任

### 12.8 过度建设 Agent 专用系统

如果同样的目标可以通过提升主开发平台能力来实现，就优先走那条路。

---

## 第十三章：仍然开放的问题

有些事情仍未定型。

### 13.1 多大程度的结构应该是确定性的？

结构太少会产出 slop。  
结构太多则可能过拟合今天模型的弱点。

### 13.2 长时 Agent 到底可以靠单一角色走多远？

Anthropic 自己也明确承认：在跨多窗口的长时任务中，多 Agent 专业化架构是否会优于单一 generalist coding agent，仍是开放问题。

### 13.3 这些模式能多大程度迁移到其他领域？

目前最强的工业案例仍集中在 coding-heavy 场景。某些经验显然能迁移到研究和分析任务，但并不是所有模式都可以无损平移。

### 13.4 Brownfield 应该如何最优排序？

这依然是公开经验里讲得最不充分的一块，因为绝大多数成功案例都来自 greenfield 项目，或来自本来就高度标准化的环境。

---

## 第十四章：实践速查

### 14.1 `AGENTS.md` 里该放什么

- install / build / test 命令
- 架构指针
- 关键规则
- 禁止事项
- 完成标准

### 14.2 哪些内容应该外化成状态文件

- progress
- known issues
- task queue
- feature completeness
- next-session handoff

### 14.3 哪些内容应当机械化执行

- lint
- formatting
- type checks
- dependency direction
- protected config
- mandatory validation paths

### 14.4 哪些事情仍然该由人类负责

- 架构方向
- 产品意图
- 质量门槛
- 高影响 tradeoff 的 review

---

## 来源与新鲜度说明

### 已交叉核对的本地资料集

本手册已经与以下本地文件交叉检查：

- `harness-engineering/original/01-harness-engineering-leveraging-codex-in-an-agent-first-world.md`
- `harness-engineering/original/02-harness-engineering.md`
- `harness-engineering/original/03-rohit-harness-is-everything.md`
- `harness-engineering/original/04-langchain-improving-deep-agents.md`
- `harness-engineering/original/04b-viv-anatomy-of-agent-harness.md`
- `harness-engineering/original/05-harness-engineering-the-complete-guide-to-building-systems-that-make-ai-agents-actually-work-2026.md`
- `harness-engineering/original/06-the-emerging-harness-engineering-playbook.md`
- `harness-engineering/original/07-claude-code-codex-harness-engineering-best-practices-for-everyone.md`
- `harness-engineering/original/08-george-harness-engineering-is-cybernetics.md`

### 新增纳入的一手资料

以下资料用于在本地资料集之外刷新本手册：

1. OpenAI，**2026 年 1 月 23 日**  
   _Unrolling the Codex agent loop_  
   https://openai.com/index/unrolling-the-codex-agent-loop/

2. OpenAI，**2026 年 2 月 4 日**  
   _Unlocking the Codex harness: how we built the App Server_  
   https://openai.com/index/unlocking-the-codex-harness/

3. Stripe，**2026 年 2 月 19 日**  
   _Minions: Stripe’s one-shot, end-to-end coding agents—Part 2_  
   https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2

4. Anthropic，**截至 2026 年 3 月 25 日访问的当前文档 / 页面**  
   _Effective context engineering for AI agents_  
   https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

5. Anthropic，**截至 2026 年 3 月 25 日访问的当前文档 / 页面**  
   _Context windows_  
   https://platform.claude.com/docs/en/build-with-claude/context-windows

### 纳入的近期研究

1. Sapunov，**arXiv:2603.00601**，修订于 **2026 年 3 月 18 日**  
   _Theory of Code Space: Do Code Agents Understand Software Architecture?_  
   https://arxiv.org/abs/2603.00601

这篇论文尤其适用于支撑本手册中关于架构理解、部分可观测性，以及外化 belief / state 工件价值的相关论述。

### 关于“新鲜度”的说明

上面列出的定期文章适合作为历史锚点。  
上面列出的当前文档更适合被当作**当前实现指导**，而不是永久不变的原则。

