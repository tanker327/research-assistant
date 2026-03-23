---
title: "Claude Code / Codex 用户 Harness Engineering 最佳实践"
original_title: "Claude Code / Codex ユーザーのための誰でもわかるHarness Engineeringベストプラクティス"
source: "https://nyosegawa.com/posts/harness-engineering-best-practices-2026/"
author: "逆瀬川ちゃん (@gyakuse)"
published: 2026-03-09
created: 2026-03-21
tags:
  - harness-engineering
  - claude-code
  - codex
  - coding-agent
  - best-practices
---

# Claude Code / Codex 用户 Harness Engineering 最佳实践

## 1. 文章概述

本文是截至2026年3月关于 Harness Engineering 最全面的实践指南。Harness Engineering 的概念源自 Mitchell Hashimoto，指的是让 Coding Agent（如 Claude Code、Codex）在尽可能少的人工干预下自主稳定运行的一整套工程体系——包括 AGENTS.md 的持续改进，以及 Agent 用于自我验证的工具链。核心思想是：**模型不是关键，系统才是关键**；同一模型在不同 Harness 下的表现差异可达22分，而更换模型仅变化1分。

文章覆盖7大主题：仓库卫生、确定性工具与架构护栏、AGENTS.md/CLAUDE.md 设计、计划与执行分离、E2E 测试策略、会话间状态管理、平台特定策略（Codex vs Claude Code），并附带反模式清单和最小可行 Harness（MVH）路线图。作者也坦诚指出，Harness Engineering 可能在数月到一年内因 LLM 能力提升而变得不再重要，但对当下的开发者而言至关重要。

## 2. 核心观点

- **Harness 投资具有复利效应**：添加一条 linter 规则就能在之后所有 Agent 会话中防止同类错误；添加一个测试就能在之后所有会话中检测回归
- **模型不如系统重要**：Morph 的分析显示，同一模型换 Harness 可使 SWE-bench 分数变动22分，换模型仅变1分
- **用机制而非提示词来保障质量**："请你跑测试"与"用 Hook 强制跑测试"之间，是"大多数时候"与"每一次"的差别
- **反馈越快越好**：PostToolUse Hook（毫秒）> Pre-commit（秒）> CI（分钟）> 人工 Review（小时），尽可能把检查推到更快的层级
- **工程师角色转变**：从"生产正确代码"转向"设计让 Agent 确实生产正确代码的环境"
- **不要为 Agent 构建专用基础设施**（Stripe 教训）：构建优秀的开发者基础设施，Agent 会自动受益
- **Harness Engineering 可能是短命领域**：随着 LLM 能力增强，可能数月后就不再需要

## 3. 关键概念

### Harness Engineering 定义
让 Coding Agent 在最少人工干预下自主稳定运行的整套工程体系。包括持续改进的指令文件（AGENTS.md/CLAUDE.md）、确定性验证工具链、自动反馈循环等。本质是 Agent 的"辅助轮"。

### 仓库卫生（Repository Hygiene）
Agent 会将仓库内发现的所有文本视为同等权威的信息源，无法区分"3个月前的旧笔记"和最新事实。因此：
- **应放入仓库的**：可执行制品（代码、测试、linter 配置、类型定义、Schema、CI 配置）和 ADR（Architecture Decision Records）
- **不应放入仓库的**：描述性文档（"系统当前是这样运作的"）、手写 API 说明、架构概要——这些必然腐败，Agent 会把过时信息当真

### Context Rot（上下文腐败）
Chroma 研究证实，18个前沿模型均随上下文长度增加而性能下降。仓库中残留的无关/过时信息本身就是性能退化的原因。

### 确定性工具（Deterministic Tools）
Linter、Formatter、Type Checker、结构测试——不会腐败，设定变更会立即被 CI 检测到。用机械化强制取代提示词依赖。

### Hooks 系统（Claude Code 特有）
Agent 生命周期中特定节点自动执行的 Shell 命令/子 Agent，类似 Git Hooks 但作用于 Claude Code 的所有操作（文件写入、bash 执行、Agent 判断）的 before/after。

### ADR（Architecture Decision Records）
具有不变性原则——记录"某时做了某决定及原因"，不修改只替换（supersede）。带时间戳和状态（Accepted/Superseded/Deprecated），Agent 可结构化判断有效性。

### Plankton 模式
高级 PostToolUse Hook 模式：运行20+个 linter，按违规复杂度路由到 Haiku/Sonnet/Opus 子进程修复。三阶段：静默自动格式化(解决40-50%问题) -> 结构化 JSON 化残余违规 -> 子进程修复。

### MCP Tax（MCP 税）
Playwright MCP 等工具的26+工具定义消耗上下文窗口，每次操作返回完整 Accessibility Tree（复杂站点3000+节点），典型任务消耗约114K tokens。

## 4. 实践方法

### 4.1 仓库卫生实践

**清理策略**：
- 将"黄金准则"编码为机械化规则（linter 规则），而非文档
- 定期运行"垃圾收集 Agent"（后台 Codex 任务检测偏差并开 PR），但检查基准必须依赖确定性规则，不能依赖 Agent 判断
- 每次 Agent 犯错就添加一个防止该错误的测试——测试不会撒谎，文档会腐败

**ADR 实践**：
- 用 ADR 保全决定历史，Agent 通过 grep 发现也是安全的
- 用 archgate 模式将每个 ADR 关联一个 `.rules.ts` 文件，实现"为什么"（ADR）与"做什么"（linter 规则）的绑定

### 4.2 确定性工具与 Hooks 反馈循环

**四种 Hook 模式**：
1. **Safety Gates（PreToolUse）**：阻止破坏性命令（`rm -rf`、`drop table`）、禁止编辑机密文件（`.env`）。Exit 2 阻止，stderr 反馈给 Agent
2. **Quality Loops（PostToolUse）**：文件编辑后自动运行 linter/formatter/测试，结果通过 `hookSpecificOutput.additionalContext` JSON 注入 Agent 上下文，驱动自我修正
3. **Completion Gates（Stop）**：Agent 宣称完成时运行测试验证，测试不过不让停。需用 `stop_hook_active` 标志防无限循环
4. **Observability（全事件）**：监控 Agent 意图（PreToolUse）、结果（PostToolUse）、即将丢失的上下文（PreCompact）

**PostToolUse 自动 Lint 实现要点**：
- 先运行自动修复（`biome format`、`oxlint --fix`），再将残余违规通过 `hookSpecificOutput.additionalContext` JSON 返回给 Claude
- 普通 stdout 不会被当作 `additionalContext`，必须返回符合文档规范的 JSON

**Linter 配置保护**：
- 用 PreToolUse Hook 阻止 Agent 修改 linter 配置文件（`.eslintrc`、`biome.json`、`pyproject.toml` 等）
- Agent 面对 linter 错误时频繁被观察到修改配置而非修复代码

**错误消息即修复指令**（OpenAI 团队的巧妙手法）：
- 自定义 linter 的错误消息不仅指出违规，还包含修复方法、ADR 链接、代码示例
- 结构：`ERROR: [什么错了] → WHY: [为什么有此规则] → FIX: [具体修复步骤] → EXAMPLE: [好/坏代码对比]`
- 核心洞察：Agent 无法忽略 linter 错误（CI 不过），但可以忽略文档——所以把规则文档写在错误消息里

**Pre-commit Hook**：
- 用 Lefthook（Go 制，高速），人类可 `--no-verify` 跳过，但在 Claude Code 设置中禁止 Agent 使用 `--no-verify`
- 设计双重标准：对人类保持灵活性，对 Agent 保持严格性

**多层反馈架构**（每种语言）：
- PostToolUse（毫秒）：自动格式化 + 快速 lint
- Pre-commit（秒）：全文件 lint + 类型检查
- CI（分钟）：深度分析 + 完整测试套件
- 自定义规则：架构边界强制

### 4.3 AGENTS.md / CLAUDE.md 设计

**写什么**：路由指令（`npm test` 运行、ADR 在 `/docs/adr/`）、禁止事项清单（每项引用 ADR 或 linter 规则）、最少的构建/测试/部署命令

**不写什么**：系统现状说明、技术栈解释（Agent 能读 package.json）、冗长的编码风格指南（交给 linter）

**大小目标**：理想50行以下。Anthropic 官方说200行以下是上限，但 IFScale 研究显示150-200条指示时 primacy bias 显著，性能开始退化。Claude Code 系统提示本身含约50条指示，用户 CLAUDE.md 100行就已达150条总指示。

**实践设计**：
- 根文件50行以下，仅含最少事实和指向 Skills/Rules 的指针
- 详细信息按需加载（Skills、`.claude/rules/`、子目录 AGENTS.md）
- Vercel 将40KB压缩到8KB仍保持100%通过率
- 每行自问："删掉这行 Agent 会出错吗？" 答案为 No 则删除
- 指针型设计的额外好处：指针失效时会产生404式错误，腐败可被机械检测

### 4.4 计划与执行分离

- 让 Agent 先制定计划，人类审核/批准后再执行（Boris Tane, Cloudflare）
- 明确指示"一次只做一个功能"，避免 Agent 的"一次搞定所有"倾向
- 用 E2E 测试验证完成状态，而非信任 Agent 的"完成"宣言

### 4.5 E2E 测试策略（各应用类型）

**Web 应用（三种工具对比）**：
- **Playwright MCP**：生态最成熟，v1.56+ 含三个子 Agent（Planner/Generator/Healer），但 MCP Tax 严重（约114K tokens/任务）。适合测试套件"生成"
- **Playwright CLI**：token 效率是 MCP 的4倍（约27K tokens），将快照保存到文件系统而非上下文窗口。Claude Code/Codex E2E 测试主力
- **agent-browser（Vercel Labs）**：token 效率最高（MCP 的5.7倍），用元素引用（`@e1`）避免 CSS 选择器脆弱性，但较新，文档薄

**通用原则**：
1. 优先使用结构化文本输出（JSON、Accessibility Tree、CLI stdout）
2. 验证必须确定性——不要把 Agent 自身放进 CI
3. 闭合反馈循环：build -> run -> verify -> fix

**移动应用**：XcodeBuildMCP（iOS）、mobile-mcp（跨平台）、Detox（React Native）、Maestro（原型）

**CLI/TUI**：bats-core（Bash 测试，TAP 兼容）、pexpect（交互式 CLI）

**API/后端**：Hurl（纯文本 HTTP 请求+断言，Rust 制，Agent 友好度最高）、Pact（微服务契约测试）、Testcontainers（DB 集成测试）

**桌面应用**：Electron 用 Playwright/WebdriverIO + 各种 MCP Server；Tauri 有平台限制；原生桌面用 TestDriver.ai（Computer-Use SDK）或各平台 Accessibility API MCP

**基础设施/DevOps**：terraform test + Conftest/OPA（策略检查）+ container-structure-test + kubeconform

**AI/ML 管道**：6层测试——数据质量（GX/dbt）、模型评估（lm-evaluation-harness/LightEval）、应用质量（DeepEval/promptfoo/RAGAS）、Agent 评估、安全性（PyRIT/Guardrails AI）、可观测性

**动画/过渡验证**（4层策略）：
1. `getAnimations()` API 等待动画完成后断言
2. CLS（Cumulative Layout Shift）测量
3. 动画冻结 + 截图对比（Chromatic/Percy/Argos）
4. 低 FPS 帧捕获让 Agent 直接视觉验证（2秒动画×5fps=10帧，数千 tokens）

### 4.6 会话间状态管理

- **标准化启动例程**：每个会话开始时确认工作目录、读取 Git 日志和进度文件、选择下一优先任务、启动开发服务器并验证
- **Git 作为会话桥梁**：每次会话结束时用描述性 commit message 提交，下次会话的 `git log --oneline -20` 是最可靠的"发生了什么"记录
- **用 JSON 记录进度**（而非 Markdown）：模型不当编辑 JSON 的概率低于 Markdown。长期项目考虑用测试套件本身替代功能列表

### 4.7 Codex vs Claude Code 平台策略

**架构差异**：
- **Codex = "密室型"**：代码副本在云端沙箱（网络隔离容器）中运行，支持多任务异步并行
- **Claude Code = "工作台型"**：直接在开发者本地环境操作，通过 Hooks 在工具执行前后插入确定性控制

**Claude Code 独有优势**：完整的 Hooks 系统（PreToolUse/PostToolUse/Stop/PreCompact）、PostToolUse 质量循环、MCP Tool Search（上下文消耗减少85%）、Agent Teams、Plan Mode + Extended Thinking

**Codex 独有优势**：云端沙箱并行执行、异步任务队列、Automations 定期调度、App Server 协议、实时转向（Steering）、Agents SDK 集成

**Codex 当前限制**：没有 PreToolUse/PostToolUse 级别的 Hook，只有 `notify`（仅 `agent-turn-complete` 事件）。社区强烈要求（475+ upvote），OpenAI 回应正在开发更通用的事件 Hook

**混合策略**：Claude Code 做计划/设计 -> Codex 并行执行 -> Claude Code 做 Review/改进

**决策框架**：
- 优先质量 -> Claude Code 为主（Hooks 无替代方案）
- 优先吞吐量 -> Codex 为主（异步沙箱无替代方案）
- 两者兼顾 -> Claude Code 构建 Harness -> Codex 规模化执行

### 4.8 最小可行 Harness（MVH）路线图

**第1周**：创建 AGENTS.md/CLAUDE.md（50行以下指针）、Pre-commit Hook（Lefthook）运行 linter/formatter/类型检查、PostToolUse Hook 自动格式化、写第一个 ADR

**第2-4周**：每次 Agent 犯错就加测试或 linter 规则、建立计划->审批->执行工作流、引入 E2E 测试工具、Stop Hook 强制测试通过、标准化会话启动例程

**第2-3月**：构建自定义 linter（错误消息含修复指令+ADR引用）、ADR 与 linter 规则绑定（archgate）、从仓库移除描述性文档替换为测试和 ADR、PreToolUse Safety Gate

**第3月+**：Plankton 模式等高级反馈循环、垃圾收集流程、多 Agent 并行、定量测量 Harness 效果（PR/天、返工率、Review 指摘率）

## 5. 工具推荐

### Linter / Formatter
| 语言 | 推荐工具 | 特点 |
|------|---------|------|
| TypeScript/JS | **Oxlint**（lint）+ **Biome**（format） | Rust 制，ESLint 的50-100倍速 |
| Python | **Ruff** | Rust 制，集成 Flake8/isort/Black 全功能，一个二进制 |
| Go | **golangci-lint** | 50+ linter 并行，缓存加速 |
| Rust | **Clippy**（pedantic + deny allow_attributes） | 结构性阻止 Agent 静默 lint 警告 |
| Swift | **SwiftLint** | 200+ 规则，`--autocorrect` |
| Kotlin | **detekt** + **ktfmt** | ktfmt 比 ktlint 快40% |
| 多语言自定义规则 | **ast-grep** | YAML+JS 模式定义，AST 级别匹配 |

### E2E 测试
- **Web**: Playwright CLI（主力）、agent-browser（Vercel Labs）、Playwright MCP（测试生成）
- **Mobile**: XcodeBuildMCP、mobile-mcp、Detox、Maestro MCP、Appium MCP
- **CLI**: bats-core、pexpect
- **API**: Hurl、Pact、grpcurl、Testcontainers
- **Desktop**: Playwright（Electron）、WebdriverIO、TestDriver.ai、Terminator（Windows）
- **Infra**: terraform test、Conftest+OPA、Terratest、container-structure-test、kubeconform

### AI/ML 评估
- **数据质量**: GX Core/Cloud、dbt Tests、Soda Core、Elementary
- **模型评估**: lm-evaluation-harness、LightEval
- **应用质量**: DeepEval、promptfoo、RAGAS
- **安全性**: PyRIT、Guardrails AI、NeMo Guardrails
- **可观测性**: Arize、WhyLabs、Evidently AI、Langfuse

### 其他
- **Pre-commit**: Lefthook（Go 制，高速）
- **ADR 工具**: archgate（ADR + 可执行规则绑定）
- **自定义 ESLint 规则**: eslint-plugin-local-rules（无需 npm 发布）
- **视觉回归**: Chromatic、Percy、Argos CI

## 6. 核心金句

> 「エンジニアの仕事は『正しいコードを生産すること』から『エージェントが正しいコードを確実に生産する環境を設計すること』に移行しています。」
> — 工程师的工作正从"生产正确的代码"转向"设计让 Agent 确实生产正确代码的环境"。

> 「CLAUDE.mdに『リンターを実行せよ』と書くことと、Hookでリンターを実行することの間には『ほぼ毎回』と『例外なく毎回』の差があります。この差はプロダクションシステムでは致命的になります。」
> — 在 CLAUDE.md 中写"请运行 linter"与用 Hook 运行 linter 之间，是"几乎每次"与"绝无例外每次"的差别。在生产系统中这个差别是致命的。

> 「同じモデルでもハーネスを変えるとSWE-benchスコアが22ポイント変動しますが、モデルの交換では1ポイントしか変わりません。」
> — 同一模型换 Harness 可使 SWE-bench 分数变动22分，而更换模型仅变1分。

> 「エージェント専用インフラを構築するな。優れた開発者インフラを構築せよ。エージェントは自動的にその恩恵を受ける。」
> — 不要构建 Agent 专用基础设施。构建优秀的开发者基础设施，Agent 会自动受益。（Stripe）

> 「エージェントにとってリポジトリ内で発見できる古い情報は、最新の真実と区別できない。」
> — 对 Agent 来说，仓库中可发现的旧信息与最新事实无法区分。

> 「計画と実行の分離は、私が行う最も重要な単一のことだ。」
> — 计划与执行的分离，是我所做的最重要的一件事。（Boris Tane, Cloudflare）

## 7. 要点总结

1. **Harness Engineering 的核心是"用机制而非提示词来强制质量"**——Linter、Hooks、测试、ADR 的组合产生复利效应
2. **反馈速度决定质量**——尽可能将检查推到更快的层级（PostToolUse > Pre-commit > CI > 人工 Review）
3. **仓库是 Agent 的世界**——保持仓库卫生、移除会腐败的描述性文档、用测试和 ADR 替代
4. **AGENTS.md/CLAUDE.md 应是指针而非百科全书**——50行以下，指向可执行的规则和工具
5. **E2E 测试给 Agent 装上"眼睛"**——对各类应用（Web/Mobile/CLI/API/Desktop/Infra/AI）都有对应的工具链
6. **平台选择要看 Harness 能力**——Claude Code 的 Hooks 系统在质量控制上无可替代，Codex 在并行吞吐上无可替代，混合使用是当前最优策略
7. **从 MVH 开始，逐步构建**——不必一次导入所有实践，每次 Agent 犯错就强化一点 Harness
8. **这个领域可能是短命的**——但在2026年当下，掌握 Harness Engineering 是提升 AI 辅助开发效率的关键差异化能力
