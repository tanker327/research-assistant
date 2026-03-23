---
title: "Claude Code / Codex 用户通俗易懂的 Harness Engineering 最佳实践"
source: "https://nyosegawa.com/posts/harness-engineering-best-practices-2026/"
author:
  - "[[逆瀬川酱的博客]]"
published: 2026-03-09
created: 2026-03-21
description: "全面解析 Coding Agent 时代的 Harness Engineering 最佳实践，涵盖仓库卫生、确定性工具、E2E 测试策略、平台选型等方方面面"
tags:
  - "clippings"
  - "逆瀬川酱的博客"
  - "nyosegawa.com"
date: "2026-03-21T14:17:34-04:00"
---
# Claude Code / Codex 用户通俗易懂的 Harness Engineering 最佳实践

----

大家好！我是逆瀬川酱 ([@gyakuse](https://x.com/gyakuse))！

今天我想系统性地总结一下截至2026年3月的 Harness Engineering（约束工程）最佳实践。

## 什么是 Harness Engineering

### 追溯定义

追溯 [Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey) 最初的定义，Harness Engineering 指的是人类对 AGENTS.md 的持续改进，以及供 Agent 自我验证其工作正确性的工具集。

现在它往往被作为更广泛的概念来讨论。简单来说，它指的是让 Coding Agent 尽可能在无人干预的情况下自主运行，并使输出保持稳定的一切手段。通俗地说，就是 Coding Agent 的辅助轮。重要的不是模型，而是系统——同一个模型仅靠更换 Harness 就能产生截然不同的结果。

工程师的工作正在从"编写正确的代码"转向"设计让 Agent 可靠地生成正确代码的环境"。

### 关于这个领域的寿命

话说回来，如果设想理想的 Coding Agent，可以预见 Harness 在未来将变得越来越不必要。我们需要意识到，Harness 的存在源于当前 LLM 能力和 Coding Agent 的不完善。

Harness Engineering 几个月后可能就不再是一个特别重要的领域。它可能被 Coding Agent 本身所吸收，开发者和组织无需再刻意关注；也可能随着 LLM 能力的提升，Harness 体系本身（或其中一部分）变得不再必要。

这些也许是等上几个月、最多一年就能解决的问题。但对于生活在2026年3月的我们来说，这无疑是一个重要的领域。

### 对 Harness 的投资产生复利效应

对 Harness 的投资会产生复利效应。添加一条 Linter 规则，此后所有会话中该错误都会被阻止；添加一个测试，此后所有会话中该回归都会被检测到。

本文将全面解析7个主题、反模式，以及明天就能开始实施的最小可行 Harness（MVH）。

![Harness Engineering 全景](https://nyosegawa.com/img/harness-engineering-best-practices-2026/harness-overview.png)

## 1: 仓库卫生：以腐化为前提来设计

Agent（Claude Code、Codex 等）会在仓库中自由地使用 grep、find、cat 扫描，并将发现的文本一视同仁地视为权威信息源。Agent 没有"这是三个月前的笔记，现在已经过时了"这种直觉。因此仓库中所有文本的时效性都至关重要。

### 应该放置的内容

仓库中应该放置可执行的制品：代码、测试、Linter 配置、类型定义、Schema 定义、CI 配置。这些内容可以被机械地判定"正确还是错误"，一旦腐化就会在执行时被检测到。

另一个应该放置的是 Architecture Decision Records（ADR）。ADR 记录"在某个时间点做出了这个决定，原因如下"，内容不做修改而是替换（supersede）。由于时间戳和状态（Accepted / Superseded / Deprecated）是明确标注的，Agent 可以结构化地判断其有效性。

### 不应该放置的内容

反过来，"当前系统是这样的"这类说明文档、设计概述、手写的 API 说明、架构概览图的说明文字不应该放在仓库中。这些内容必然跟不上代码的演进而腐化，从而产生 Agent 将腐化信息当作事实采纳的风险。

[OpenAI 团队的教训](https://openai.com/index/harness-engineering/) ——"对于 Agent 来说，上下文中无法访问的东西就不存在"——其反面是："对于 Agent 来说，仓库中发现的旧信息与最新事实无法区分"。[Chroma 的研究](https://www.morphllm.com/context-rot) 确认了所有18个前沿模型都会随着上下文长度增加而性能下降，在仓库中保留无关或过时的信息本身就是性能退化的根源。

### 仓库的卫生管理

OpenAI 团队发现 Agent 会复制仓库中的现有模式（包括不一致和非最优的模式）。最初他们每周五（占工作时间的20%）用来清理 AI 生成的劣质代码，但这种方式无法规模化。

解决方案是将"黄金准则"编码到仓库中，作为有主见的机械化规则来强制执行。定期运行垃圾回收 Agent（在后台检测偏差并提交重构 PR 的 Codex 任务）。

但需要注意：垃圾回收 Agent 本身也会受到上下文腐化的影响，存在递归风险。检查标准应依赖确定性规则（Linter、类型检查、结构测试），而不要依赖 Agent 的"判断"。

### 测试比文档更耐腐化

测试一旦执行就无法说谎。"这个功能是这样工作的"这种描述性文档会腐化，但"验证这个功能是否这样工作的测试"一旦失效就会变红。尽可能将规格、预期行为、约束以测试的形式来表达。

[Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey) 的洞见是，Agent 是"目标导向"的，即使破坏当前任务范围之外的东西也要达成眼前目标。在纯人工开发中足够的测试覆盖率，在与 Agent 协作开发时是不够的。每当 Agent 犯错时就添加防止该错误的测试。一旦添加的测试将适用于所有未来的 Agent 会话。

### 用 ADR 保存决策历史

由于 ADR 的[不可变原则](https://adr.github.io/)，即使 Agent 通过 grep 发现也是安全的。当过去的决策被替换时，状态会明确标注，因此 Agent 可以结构化地判别当前有效的决策。

### 追求现实可行的方案

即便如此，我们还是想要 README.md。docs 里有文档也很好。对 Agent 来说，有了测试和 ADR 就基本够用了，所以也许文档应该管理在 grep、find、cat 扫描范围之外（例如在另一个仓库或另一个系统中）。

好，我们理解了保持仓库整洁的重要性。那么具体来说，如何通过机械化手段来强制保证 Agent 的输出质量呢？

## 2: 用确定性工具和架构护栏强制保证质量

### 不要让 LLM 做 Linter 的工作

[HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md) 的原则简洁地抓住了要点："LLM 相比传统 Linter 和 Formatter 既昂贵又缓慢。在确定性工具可用的场景中应始终使用确定性工具。"

Linter、Formatter、类型检查器、结构测试不会腐化。配置变更时 CI 会崩溃从而立即被检测到。不要仅依赖 Prompt 指令来保证 Agent 的输出质量，而是交由机械化强制执行，这样可靠性会以复利方式提升。

在 CLAUDE.md 中写"请运行 Linter"与通过 Hook 运行 Linter 之间，存在"几乎每次"与"无一例外每次"的差距。这个差距在生产系统中是致命的。在第47次会话的长调试链中，上下文窗口的大部分已被消耗，Agent 写完文件就继续前进。Linter 被遗忘了。

### 反馈循环的设计：活用 Hooks

[Claude Code Hooks](https://code.claude.com/docs/en/hooks-guide) 是在 Agent 生命周期的特定节点自动执行的 Shell 命令、Prompt 或子 Agent。就像 Git Hook 在 git 操作的 before/after 运行一样，Claude Code Hooks 在 Claude Code 的任何操作（文件写入、bash 执行、Agent 决策）的 before/after 运行。

以下所有实现示例均以在 `.claude/settings.json` 或 `.claude/settings.local.json` 中定义的 settings-based hooks 为前提。agent/skill 的 frontmatter hooks 有不同的行为差异，本文不作为主要讨论对象。

最强大的模式是质量反馈循环：

1. Agent 写代码（PostToolUse 事件触发）
2. Hook 自动运行 Linter、类型检查器、测试套件
3. 如果检测到错误，将符合文档规范的 JSON 通过 stdout 返回，其中的 `hookSpecificOutput.additionalContext` 注入到 Agent 的上下文中
4. Agent 在下一次操作中自我修正错误
5. 无需人工干预，每次文件写入时都重复这个循环

这里的关键是，PostToolUse Hook 仅仅将普通 stdout 输出并不会被当作 `additionalContext` 处理。要进行反馈注入，Hook 需要返回包含 `hookSpecificOutput.additionalContext` 的 JSON。

像"handler.ts 第42行、第78行、第103行有3个 TypeScript 错误"这样通过 JSON 注入反馈的 Hook，比单纯阻止操作的 Hook 有用得多。阻止只是停止处理，而反馈注入能推进到修复。

![Hooks 反馈循环](https://nyosegawa.com/img/harness-engineering-best-practices-2026/hooks-feedback-loop.png)

### 4种 Hook 模式

- Safety Gates（PreToolUse）：阻止破坏性命令（`rm -rf`、`drop table`），禁止编辑敏感文件（`.env`）。以 Exit 2 阻止，stderr 中的原因会反馈给 Agent
- Quality Loops（PostToolUse）：文件编辑后自动运行 Linter、Formatter、测试。将结果作为 `hookSpecificOutput.additionalContext` 注入，驱动 Agent 自我修正
- Completion Gates（Stop）：当 Agent 宣布完成时通过运行测试进行验证。在测试通过之前不让 Agent 停止。但要检查 `stop_hook_active` 标志以防止无限循环
- Observability（所有事件）：通过 PreToolUse 监控 Agent 的意图，PostToolUse 监控结果，PreCompact 监控即将丢失的上下文，将这些信息送入监控管道

### 实现示例：通过 PostToolUse 自动 Lint（TypeScript/JavaScript）

```json
Copy{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/post-ts-lint.sh"
          }
        ]
      }
    ]
  }
}
```
```bash
Copy#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
file="$(jq -r '.tool_input.file_path // .tool_input.path // empty' <<< "$input")"

case "$file" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

npx biome format --write "$file" >/dev/null 2>&1 || true
npx oxlint --fix "$file" >/dev/null 2>&1 || true
diag="$(npx oxlint "$file" 2>&1 | head -20)"

if [ -n "$diag" ]; then
  jq -Rn --arg msg "$diag" '{
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: $msg
    }
  }'
fi
```

这个示例有两个要点：第一是先执行自动修复（`biome format`、`oxlint --fix`），只将剩余的违规返回给 Claude。第二是反馈不是通过普通 stdout，而是通过包含 `hookSpecificOutput.additionalContext` 的 JSON 返回。

Python、Go、Rust 也可以用同样的形式编写。先执行高速自动修复，只将剩余违规作为 `additionalContext` 返回。

截至2026年3月，相比 ESLint+Prettier，Oxlint+Biome（TypeScript）、Ruff（Python）、gofumpt+golangci-lint（Go）更适合 PostToolUse Hook。原因是速度。PostToolUse Hook 需要在毫秒到秒级别内完成，Rust 制工具比 Node.js 制工具快50到100倍。

### Plankton 模式（高级）

[Plankton 模式](https://github.com/affaan-m/everything-claude-code) 在 PostToolUse Hook 中运行 Formatter 和20多个 Linter，将剩余违规收集为结构化 JSON。根据违规的复杂度，路由到 Haiku/Sonnet/Opus 的子进程进行修复。

分3个阶段运行：(1) 静默自动格式化（消除40-50%的问题）→ (2) 将剩余违规结构化为 JSON → (3) 委派给子进程修复。重要的防御措施是包含 config protection Hook，防止 Agent 通过修改 Linter 配置来让测试通过。

### 各语言 Linter 选型指南（2026年3月）

以 PostToolUse Hook 中使用为前提，从速度、自动修复能力、自定义规则支持三个维度严格筛选。

#### TypeScript/JavaScript：Oxlint（Lint）+ Biome（格式化）

[Oxlint](https://voidzero.dev/posts/announcing-oxlint-1-stable) 是 VoidZero（Vite 团队）开发的 Rust 制 Linter。2025年6月发布了 v1.0 稳定版。比 ESLint 快50到100倍，Shopify 的 Lint 时间从75分钟缩短到10秒。搭载520多条 ESLint 兼容规则，通过 JavaScript 插件系统，现有 ESLint 插件只需最小修改即可运行。Shopify、Airbnb、Mercedes-Benz、Linear、Framer 已在生产环境采用。

[Biome](https://biomejs.dev/blog/biome-v2/) 是 Rust 制的集成 Lint + Formatter。比 ESLint+Prettier 快10到25倍。v2.0（2025年6月）通过 GritQL 插件支持自定义规则，v2.1+ 搭载了领域特定配置（React、Next.js、测试）。

使用方式上，PostToolUse Hook 中用 Oxlint 做 Lint → Biome 做格式化。ESLint 对于 PostToolUse 来说太慢了，但为了自定义架构规则，仍值得在 pre-commit Hook 和 CI 中保留。

#### Python：Ruff（唯一选择）

[Ruff](https://github.com/astral-sh/ruff) 是 Rust 制的。将 Flake8、isort、pyupgrade、pydocstyle、Black 的全部功能统一到一个二进制文件中。900多条规则。即使在大型代码库中，PostToolUse Hook 也能在亚秒级完成。

局限性是无法添加自定义规则。架构边界的强制需要配合使用 ast-grep 或 pylint 的自定义检查器。

#### Go：golangci-lint

[golangci-lint](https://golangci-lint.run/) 是并行运行50多个 Linter 的元 Linter。通过缓存，即使在大型代码库中也能在秒级完成。`--fix` 标志支持35个 Linter 的自动修复。Kubernetes、Prometheus、Terraform 已采用。

推荐启用的 Linter：staticcheck、gosec、errcheck、revive、govet、gofumpt、gci、modernize。

#### Rust：Clippy（pedantic + 禁止 allow\_attributes）

[rust-magic-linter 模式](https://github.com/vicnaum/rust-magic-linter) 在 `Cargo.toml` 中启用 pedantic clippy，并通过 `allow_attributes = "deny"` 使 Agent 在结构上不可能用 `#[allow(clippy::...)]` 来静默 Lint。

```toml
Copy[lints.clippy]
pedantic = { level = "warn", priority = -1 }
unwrap_used = "deny"
expect_used = "deny"
allow_attributes = "deny"
dbg_macro = "deny"
```

#### Swift / Kotlin

[SwiftLint](https://github.com/realm/SwiftLint) 提供200多条规则，支持正则和 AST 自定义规则，支持 `--autocorrect`。[detekt](https://github.com/detekt/detekt) 是 Kotlin 的静态分析工具。ktfmt 是比 ktlint 快40%的 Formatter。

#### Linter 对比表

| 工具 | 语言 | 相比 ESLint 的速度 | 自定义规则 | 自动修复 | PostToolUse 适用性 |
| --- | --- | --- | --- | --- | --- |
| Oxlint | JS/TS | 50-100x | JS 插件（ESLint 兼容） | Yes | 最佳 |
| Biome | JS/TS/JSON/CSS | 10-25x | GritQL 插件 | Yes（lint+format） | 良好 |
| Ruff | Python | 10-100x vs Flake8 | 不可 | Yes | 最佳 |
| golangci-lint | Go | \- | 通过子 Linter | 35个 Linter | 良好 |
| Clippy | Rust | \- | 无 | 部分 | 良好 |
| ast-grep | 多语言 | \- | YAML+JS 模式 | Yes（rewrite） | 用于自定义规则 |

### 自定义 Linter 策略：面向 Agent 的规则设计

#### Factory.ai 的4个类别

[Factory.ai](https://factory.ai/news/using-linters-to-direct-agents) 开源发布的 eslint-plugin 将面向 Agent 的 Lint 规则分为4个类别：

1. Grep-ability（搜索友好性）：强制使用 named export 而非默认导出。一致的错误类型和显式的 DTO。提高 Agent 通过 grep 扫描代码库时的命中精度
2. Glob-ability（布局可预测性）：保持文件结构可预测。使 Agent 能够可靠地放置、发现和重构文件
3. 架构边界：阻止跨层导入。通过特定领域的 allowlist/denylist 强制依赖方向
4. 安全/隐私：阻止明文 Secret，强制输入 Schema 验证，禁止 `eval` / `new Function`

#### 自定义规则的实现工具选型

TypeScript/JavaScript 中可以用 [eslint-plugin-local-rules](https://github.com/cletusw/eslint-plugin-local-rules) 在仓库内放置项目特定规则（无需 npm 发布）。通过 ESLint 的访问者模式进行 AST 遍历，在 `meta.messages` 中编写面向 Agent 的修复指示。

多语言方面，[ast-grep](https://ast-grep.github.io/) 是最佳选择。用与代码同构的模式（不是正则表达式，而是看起来像代码的语法模式）定义规则。同时支持 YAML 定义和 JavaScript API，覆盖 Python、Go、Rust、TypeScript 等主要语言。

基于 AST（抽象语法树）的规则比基于正则表达式的规则可靠性高得多。正则表达式会在注释或字符串字面量中产生误报。除了文件名和导入路径的简单检查之外，应始终使用 AST。

### 将错误消息变成修复指示

[OpenAI 团队最巧妙的手法](https://openai.com/index/harness-engineering/) 就是这个。自定义 Linter 的错误消息不仅指出违规，还向 Agent 传达修复方法。工具在运行的同时"教育" Agent。这样每次违规时就不再需要人工介入。

所有自定义 Linter 的错误消息应遵循以下结构：

```
CopyERROR: [什么是错误的]
  [哪个文件:行号]
  WHY: [为什么有这条规则，ADR 链接]
  FIX: [具体修复步骤，如有代码示例则包含]
  EXAMPLE:
    // Bad:
    import { db } from '../infra/database';
    // Good:
    import { DatabaseProvider } from '../domain/providers';
```

举几个具体例子：

- 依赖方向违规（OpenAI 模式）："ServiceA 不能直接依赖 Infrastructure 层。请在 Domain 层（src/domain/providers/）定义 Provider 接口，在 Infrastructure 层（src/infra/providers/）实现（参见 ADR-007）"
- [DTO 配置违规](https://understandingdata.com/posts/custom-eslint-rules-determinism/)："不允许使用内联 Zod Schema。DTO 应放在 src/dtos/\[domain\]/\[action\].dto.ts"
- [TypeScript any 使用](https://medium.com/@montes.makes/lint-against-the-machine-a-field-guide-to-catching-ai-coding-agent-anti-patterns-3c4ef7baeb9e)："禁止使用 `any` 类型。如果不确定正确类型，请使用 `unknown` 并通过类型守卫缩小范围。AI Agent 在类型推断失败时倾向于逃避到 `any`"

核心洞见是：Agent 无法忽略 Linter 的错误消息（因为 CI 不会通过），但可以忽略文档。因此规则的文档应该写在错误消息中。

### 通过 pre-commit Hook 提供即时反馈

不仅在 CI（远程执行）中运行 Linter、Formatter、类型检查，也应在 pre-commit Hook（本地即时执行）中运行。对 Agent 来说的"即时反馈"，起着与人类的编译错误相同的作用。

[Lefthook](https://liambx.com/blog/ai-agent-lint-enforcement-lefthook-claude-code) 是 Go 制的，速度很快。可以通过 `lefthook-local.yml` 分离个人设置，人类可以用 `git commit --no-verify` 跳过。对于 Agent，通过 Claude Code 设置禁止执行 `git commit --no-verify`，从而在结构上使 Hook 绕过不可能。为人类设计灵活性，为 Agent 设计严格性——这是双重标准的设计。

注意事项：Claude Code Action（通过 GitHub API 的提交）会绕过本地 Git Hook。可以通过在 PreToolUse Hook 中在 MCP 操作之前插入 Lint 进程来应对。

### 将 ADR 与可执行规则结合

[archgate](https://github.com/archgate/cli) 的方法是为每个 ADR 配备一个 `.rules.ts` 伴随文件，将架构决策编码为可执行的检查。ADR（不可变的"为什么"）与 Linter 规则（可执行的"做什么"）的结合，同时满足了抗腐化的两个条件。

### Linter 配置保护：防止 Agent "篡改规则"

Agent 面对 Linter 错误时，经常被观察到会修改 Linter 配置来消除错误，而不是修复代码。以下 PreToolUse Hook 可以防止这种情况：

```json
Copy{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=$(jq -r \".tool_input.file_path // .tool_input.path\" <<< \"$(cat)\"); PROTECTED=\".eslintrc eslint.config biome.json pyproject.toml .prettierrc tsconfig.json lefthook.yml .golangci.yml Cargo.toml .swiftlint.yml .pre-commit-config.yaml\"; for p in $PROTECTED; do case \"$FILE\" in *$p*) echo \"BLOCKED: $FILE is a protected config file. Fix the code, not the linter config.\" >&2; exit 2;; esac; done'"
          }
        ]
      }
    ]
  }
}
```

此外在 Claude Code 设置中禁止 `git commit --no-verify`，从结构上使 Agent 绕过 Git Hook 成为不可能。

### AI 生成代码特有的 Lint 反模式

[OX Security 和 Snyk 的调查](https://medium.com/@montes.makes/lint-against-the-machine-a-field-guide-to-catching-ai-coding-agent-anti-patterns-3c4ef7baeb9e) 显示，AI 生成代码存在与人类代码不同的特有反模式：

1. TypeScript any 滥用：Agent 在类型推断失败时会逃避到 `any`。应将 `@typescript-eslint/no-explicit-any` 设为 error 级别强制执行
2. 代码重复：Agent 不搜索代码库就生成新代码。用 jscpd 或 Plankton 的重复检测来发现
3. 幽灵文件：Agent 不修改现有文件，而是创建名称相似的新文件。通过 Linter 强制文件命名规范和目录结构
4. 注释泛滥：OX Security 的调查在90到100%的 AI 生成仓库中观察到"Comments Everywhere"模式。应考虑检查注释比率
5. 安全漏洞：据 Snyk 统计，AI 生成代码中36到40%包含安全漏洞。应将 gosec（Go）、Ruff S 规则（Python）、eslint-plugin-security（JS/TS）设为必须

### 各语言推荐 Linter 技术栈

#### TypeScript/Node.js 项目

| 层级 | 工具 | 用途 |
| --- | --- | --- |
| PostToolUse（ms） | Biome format → Oxlint | 自动格式化、高速 Lint |
| pre-commit（s） | Lefthook → Oxlint + tsc --noEmit | 全文件 Lint + 类型检查 |
| CI（min） | ESLint（自定义架构规则）+ 测试套件 | 深度分析 |
| 自定义规则 | eslint-plugin-local-rules or ast-grep | 架构边界 |
| 配置保护 | PreToolUse Hook | 防止编辑配置文件 |

#### Python 项目

| 层级 | 工具 | 用途 |
| --- | --- | --- |
| PostToolUse（ms） | Ruff check --fix → Ruff format | 自动修复 + 格式化 |
| pre-commit（s） | Lefthook → Ruff + mypy | 全量 Lint + 类型检查 |
| CI（min） | Ruff + mypy + pytest | 全量分析 + 测试 |
| 自定义规则 | ast-grep or pylint custom checkers | 架构边界 |

#### Go 项目

| 层级 | 工具 | 用途 |
| --- | --- | --- |
| PostToolUse（ms） | gofumpt + golangci-lint（高速子集） | 格式化 + 高速 Lint |
| pre-commit（s） | Lefthook → golangci-lint --fix | 全量 Lint + 自动修复 |
| CI（min） | golangci-lint（完整配置）+ go test | 全量分析 + 测试 |

#### Rust 项目

| 层级 | 工具 | 用途 |
| --- | --- | --- |
| PostToolUse（ms） | rustfmt | 格式化 |
| pre-commit（s） | Lefthook → cargo clippy（pedantic, deny allow\_attributes） | 全量 Lint |
| CI（min） | cargo clippy + cargo test | 全量分析 + 测试 |

### 反馈速度决定质量

反馈循环的质量与速度成正比。

- 最快（毫秒）：PostToolUse Hook → Formatter 自动执行。Agent 还没察觉到违规时修复就已完成
- 快（秒）：pre-commit Hook → Linter、类型检查。提交前发现问题
- 慢（分钟）：CI/CD Pipeline → 完整测试套件。合并前发现问题
- 最慢（小时到天）：人工代码审查。合并后发现问题

Harness Engineering 的目标是将尽可能多的检查移到更快的层级。只在 CI 运行的 Linter 移到 pre-commit Hook，只在 pre-commit Hook 运行的 Formatter 移到 PostToolUse Hook。

![反馈速度层级](https://nyosegawa.com/img/harness-engineering-best-practices-2026/feedback-speed-layers.png)

### 将架构作为护栏

[Birgitta Böckeler（Thoughtworks）](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) 的观察是：要提高 AI 生成代码的可靠性，悖论性地需要的不是扩大解空间，而是约束它。对人类来说可能感觉拘束的规则，对 Agent 来说是复利式的质量提升。

[OpenAI 团队](https://openai.com/index/harness-engineering/) 的实践是将每个业务领域划分为固定的层级集合，严格验证依赖方向。横切关注点（认证、遥测、Feature Flag）仅通过单一的显式接口（Providers）注入。这些约束通过自定义 Linter 和结构测试进行机械化强制。

未来，技术栈和代码库结构的选择标准可能不再是灵活性，而是"Harness 友好度"。静态类型语言比动态类型语言能为 Agent 提供更多结构性反馈。标准化的模式能提高 Agent 一致且正确生成代码的概率。

我们已经看到了确定性工具的重要性。那么如何将这些规则传达给 Agent 呢？让我们进入 AGENTS.md/CLAUDE.md 的设计。

## 3: 将 AGENTS.md / CLAUDE.md 设计为指针

### 应该写的内容

- 路由指示：`npm test` 运行测试，ADR 在 `/docs/adr/` 中，架构规则用 `archgate check` 验证
- 禁止事项列表：每一项都引用 ADR 或 Linter 规则
- 构建、测试、部署的最基本命令

### 不应该写的内容

- 系统现状说明（代码和测试才是真相之源）
- 技术栈解释（Agent 可以读取 package.json 或 go.mod）
- 冗长的编码风格指南（交给 Linter 和 Formatter）

### 大小参考

越短越好。理想情况下50行以下。

[Anthropic 的官方文档](https://code.claude.com/docs/en/memory) 明确写了"200行以下"，但这是上限而不是目标。指示越多，遵守率越低。[IFScale](https://arxiv.org/abs/2507.11538) 的研究表明，在150到200条指示时，primacy bias（对开头指示的偏向）变得显著，性能开始退化。应该解读为"从150开始就会崩溃"，而不是"150以内没问题"。

Claude Code 的系统 Prompt 本身[包含约50条指示](https://www.humanlayer.dev/blog/writing-a-good-claude-md)，所以如果用户的 CLAUDE.md（Codex 的情况是 AGENTS.md）有100行，Agent 就要处理总共150条指示。再加上长大的上下文文件，重要指示就会被埋没。

实践性设计：

- 根文件力求50行以下。只放仓库的最基本事实、可用 Skill 和 MCP 连接的指针（[Addy Osmani](https://addyosmani.com/blog/agents-md/)）
- 详细内容按需加载。通过 Skills、`.claude/rules/` 文件、子目录级 AGENTS.md 分拆
- 积极压缩。[Vercel](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) 将40KB压缩到8KB仍保持100%的通过率
- 对每一行提问："如果删掉这行，Agent 会出错吗？"答案为否就删除

### 指针腐化时的情况

指针型设计有一个附带优势。当指针所指向的文件路径不存在时，会产生相当于404的错误，腐化可以被机械地检测到。描述性文档的腐化是悄无声息地进行的，但坏掉的指针会大声失败。

到这里我们看完了 Agent 指示的设计。接下来思考如何让 Agent 实际执行任务——计划与执行的分离。

## 4: 分离计划与执行

### 计划阶段

[Boris Tane（Cloudflare）](https://boristane.com/blog/how-i-use-claude-code/) 这样说："计划与执行的分离是我做的最重要的一件事。它避免了无用功，保持了对架构决策的控制，并以最少的 Token 消耗产出比直接跳入代码好得多的结果。"

先让 Agent 制定计划，人类审查批准后再进入执行。很多 AI 编程工具搭载"plan mode"就是为此。

### 任务粒度

[Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) 的洞见是 Agent 倾向于一次性做完所有事情（一次性问题）。通过明确指示"一次只处理一个功能"来规避这个问题。将大目标分解为小的组成部分，完成每个部分后再进入下一个。

### 通过测试验证完成

Agent 倾向于宣布功能"完成"，但实际上往往没有通过 E2E 测试。通过明确指示使用浏览器自动化工具等进行 E2E 测试，完成判断的精度会大幅提升（已在 Anthropic 的实验中确认）。

说到"通过测试验证完成"，那么 E2E 测试应该如何设计呢？让我们来整理一下。

## 5: E2E 测试策略：赋予 Agent 观察各类应用的"眼睛"

如果 Agent 没有"看到"自己编写的代码的手段，它就会在编译通过后就宣布"完成"。通过结合浏览器自动化工具，Agent 可以实际操作 UI，从与人类用户相同的视角进行验证。[Anthropic 的长时间运行 Agent 实验](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) 中引入 Puppeteer MCP 进行浏览器自动化后，性能得到了显著改善。Agent 能够自主发现和修复仅从代码看不到的 Bug。

### Web 应用：工具对比（3种方案）

Anthropic 原始研究使用了 Puppeteer MCP，但 Playwright 生态系统快速发展，截至2026年3月 Playwright 系已成为主流。

#### 1\. Playwright MCP（Microsoft 官方）

提供基于可访问性树的交互，可以通过 role/name 直接引用和操作元素。在所有主要 Agent（Claude Code、Codex、Cursor、GitHub Copilot）上运行。

优势是生态系统最成熟。[Playwright v1.56+](https://shipyard.build/blog/playwright-agents-claude-code/) 搭载3个专用子 Agent（Planner、Generator、Healer）。Planner 制定探索计划，Generator 生成测试代码，Healer 在 UI 变更时自动修复选择器。可在 CI 中作为标准 Playwright 测试进行 Headless 执行。

缺点是 MCP 税（MCP Tax）很严重。26个以上的工具定义消耗上下文窗口，每次操作都返回完整的可访问性树（复杂站点超过3000个节点）。典型的浏览器自动化任务消耗约114,000 Token。在长会话中上下文腐化变得显著，精度下降。

适用场景是用于测试套件的"生成"，将生成的 Playwright 测试文件在 CI 中独立执行的工作流最为现实。

#### 2\. Playwright CLI（@playwright/cli）

与 Playwright MCP 基于相同基础，但使用 Shell 命令而非 MCP 协议进行操作。

优势是 [Token 效率约为 MCP 的4倍](https://www.awesome-testing.com/2026/03/playwright-cli-skills-and-isolated-agentic-testing)。同一任务 MCP 消耗约114,000 Token，而 CLI 约27,000 Token。将可访问性快照和截图保存到文件系统，不会注入上下文窗口。

适用场景是 Claude Code 和 Codex 中 E2E 测试的主力工具。应优先使用 CLI 版而非 MCP 版。在上下文窗口紧张的长会话中效果尤为显著。

#### 3\. agent-browser（Vercel Labs）

构建于 Playwright 之上的 CLI，特点是面向 Agent 设计的快照 + 元素引用（ref）模式。

优势是 [Token 效率最高](https://www.pulumi.com/blog/self-verifying-ai-agents-vercels-agent-browser-in-the-ralph-wiggum-loop/)。同样6个测试，Playwright MCP 消耗约31K 字符，而 agent-browser 约5.5K（5.7倍的测试效率）。通过元素引用（`@e1`、`@e2`...）避免了 CSS 选择器的脆弱性。Rust CLI 无需 Node.js 冷启动。

缺点是发布仅2个月还比较粗糙。Windows 支持有多个未解决 Issue，文档较薄，有些场景需要阅读源代码。

#### 推荐：按用途选型

| 用途 | 推荐工具 | 原因 |
| --- | --- | --- |
| 自测试循环 | agent-browser or Playwright CLI | Token 效率至关重要 |
| 测试套件生成 | Playwright MCP + 子 Agent | Planner/Generator/Healer 的3 Agent 架构 |
| 探索性测试 | agent-browser | ref 方式在选择器抗脆弱性上有优势 |

![E2E 测试工具选型](https://nyosegawa.com/img/harness-engineering-best-practices-2026/e2e-test-tools.png)

### 普遍原则：可访问性树是通用接口

回顾 Web 应用的成功模式，Playwright MCP 和 agent-browser 都是通过可访问性树与 UI 交互的。通过结构化文本而非截图来读取 UI，可以直接通过 role/name 操作元素，输出是确定性的，CI 中的断言也很容易。

这个原则不限于 Web。macOS、Windows、Linux 各自都有原生的可访问性 API（NSAccessibility、UIAutomation、AT-SPI2），可以将任何 GUI 应用作为可访问性树以结构化文本形式读取。

### 可访问性树 vs 截图：使用场景

可访问性树适合的场景：

- 程序化操作：元素被赋予 role/name/state，可以像 `click element[name='Submit']` 这样操作。无需猜测坐标，稳定可靠
- 确定性测试：同一页面始终返回相同的树。CI 中的 diff 和断言很容易
- 操作自动化：表单输入、导航、按钮点击等定型操作

截图适合的场景：

- 视觉 Bug 检测：布局崩坏、CSS 问题、元素重叠、颜色/字体/边距问题
- 视觉回归测试："这个页面看起来正确吗？"的判断
- Canvas/图表/地图/图片：可访问性树无法表达的富内容
- 空间布局把握：元素位置关系、对齐、响应式行为

所有应用类型共通的设计原则：

1. 优先使用结构化文本输出：向 Agent "展示"的手段应尽可能是结构化文本（JSON、可访问性树、CLI 的标准输出）
2. 使验证确定性化：将 Agent 生成的测试做成可确定性执行的形式。不要将 Agent 本身放入 CI
3. 关闭反馈循环：构建 Agent 能自主运转 build → run → verify → fix 循环的环境

### 移动应用 E2E 测试

#### 现状（2026年3月）

[Xcode 26.3 引入了 MCP 原生支持](https://www.apple.com/newsroom/2026/02/xcode-26-point-3-unlocks-the-power-of-agentic-coding/)，Claude Agent 和 Codex 可以直接在 Xcode 内运行。Agent 可以自主进行 XCTest 的生成、执行和失败修复，还能通过 Xcode Previews 的截图进行视觉验证。iOS 开发中的 Agent E2E 测试已从"实验性"转为"生产就绪"。

#### 推荐工具栈

| 工具 | 目标 | 特点 |
| --- | --- | --- |
| [XcodeBuildMCP](https://github.com/getsentry/XcodeBuildMCP) | iOS（Xcode 26.3） | 已被 Sentry 收购，59个 MCP 工具。将构建错误结构化为 JSON 返回 |
| [iOS Simulator MCP Server](https://lobehub.com/mcp/joshuayoes-ios-simulator-mcp) | iOS Simulator | 通过 Facebook 的 IDB 工具。请使用 v1.3.3 以上版本（存在命令注入漏洞） |
| [mobile-mcp](https://github.com/mobile-next/mobile-mcp) | iOS/Android | 平台无关的 MCP。通过原生可访问性树进行交互 |
| [Appium MCP](https://github.com/appium/appium-mcp) | iOS/Android | 面向现有 Appium 基础设施。维护成本最多降低90% |
| [Detox](https://github.com/wix/Detox) | React Native | Wix 出品的灰盒测试。监控异步处理以防止 Flake |
| [Maestro MCP](https://maestro.dev/) | 移动全般 | YAML 脚本。搭建轻量适合原型 |

#### 移动 E2E 的设计决策

| 决策维度 | 推荐 |
| --- | --- |
| iOS 专用项目 | XcodeBuildMCP + Xcode 26.3 原生集成 |
| Android 专用项目 | mobile-mcp or Appium MCP |
| 跨平台（React Native） | Detox（测试生成）+ mobile-mcp（探索性测试） |
| 原型/冒烟测试 | Maestro MCP |
| 有现有 Appium 基础设施 | Appium MCP |

移动端同样适用 Web 的"生成与执行分离"原则。让 Agent 用 MCP 工具生成测试，将生成的 XCTest/Detox/Espresso 测试在 CI 中确定性地执行。

### CLI/TUI 应用 E2E 测试

CLI 工具是 Agent 最容易自然测试的应用类型。由于 Agent 本身可以执行 Shell 命令，不需要 UI 层的桥接。

[bats-core（Bash Automated Testing System）](https://github.com/bats-core/bats-core) 最适合 Bash 脚本测试。TAP 兼容的输出使 CI 集成简便，每个测试用例在独立进程中执行因此没有状态泄漏。

```bash
Copy# test/mycli.bats
@test "help flag shows usage" {
  run ./mycli --help
  [ "$status" -eq 0 ]
  [[ "$output" == *"Usage:"* ]]
}

@test "invalid input returns error" {
  run ./mycli --invalid-flag
  [ "$status" -ne 0 ]
  [[ "$output" == *"unknown flag"* ]]
}
```

最佳实践是将脚本的主逻辑移到 `run_main` 函数中，用 `if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then run_main; fi` 包裹。这样可以从 bats 作为 source 加载并按函数单元进行测试。

pexpect/expect 用于交互式 CLI 的测试。可以程序化控制 Prompt 响应、超时、密码输入等交互操作。

面向 CLI 的 Stop Hook 示例：

```json
Copy{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [ -f ./test/cli.bats ]; then bats ./test/cli.bats 2>&1 | tail -20; fi'"
          }
        ]
      }
    ]
  }
}
```

### API/后端 E2E 测试

仅靠单元测试验证后端变更是不够的。当 Agent 修改了 API 端点时，需要 E2E 测试来实际发送 HTTP 请求并验证响应。

[Hurl](https://hurl.dev/)（Orange/libcurl 基础）是用纯文本定义 HTTP 请求和断言的 CLI 工具。基于 Rust 编写的轻量二进制文件，与 Agent 的兼容性极佳。纯文本格式使 Agent 容易读写，生成的 Hurl 文件可以在 CI 中确定性地执行。

```
Copy# test/api/users.hurl
POST http://localhost:3000/api/users
Content-Type: application/json
{
  "name": "Test User",
  "email": "test@example.com"
}
HTTP 201
[Asserts]
jsonpath "$.id" exists
jsonpath "$.name" == "Test User"

GET http://localhost:3000/api/users/{{id}}
HTTP 200
[Asserts]
jsonpath "$.email" == "test@example.com"
```

[Pact](https://docs.pact.io/)（契约测试）验证微服务间的 API 契约。Pact v4.0.0（2026年）新增 GraphQL 支持、异步消息处理改进、MatchersV2 提升类型安全性。推荐让 Agent 生成 Pact 的 Consumer 测试并在 CI 中执行 Provider 验证的工作流。

gRPC 测试方面，除了通过 Pact 的契约测试外，还可以让 Agent 直接使用 `grpcurl`（从 CLI 调用 gRPC 服务的 curl 等价物）进行 gRPC 端点的冒烟测试。

数据库集成测试方面，使用 [Testcontainers](https://testcontainers.com/) 启动测试用 DB 容器，自动化 Migration → Seed → 测试 → 销毁的循环。

| 工具 | 用途 | 与 Agent 的兼容性 |
| --- | --- | --- |
| Hurl | HTTP API E2E 测试 | 最高（纯文本、CLI、确定性） |
| Pact | 微服务契约测试 | 高（适合测试生成 → CI 执行模式） |
| grpcurl | gRPC 冒烟测试 | 高（CLI 基础） |
| Testcontainers | DB 集成测试 | 中（需要搭建但 CI 集成已成熟） |

### 桌面应用 E2E 测试

#### Electron 应用

Electron 应用测试有传统型和 MCP 型两种方案。

**传统型 E2E 测试：**

- **Playwright**（`_electron.launch()`）：实验性（experimental）但使用最广泛。支持 Electron v12.2.0+，可使用 Page API 的全部功能。支持主进程代码执行、视频录制、截图
- **WebdriverIO**（[wdio-electron-service](https://github.com/webdriverio-community/wdio-electron-service) v9.2.1）：作为已废弃的 Spectron 的继承者最为成熟。自动检测 Electron Forge 和 Electron Builder 的打包路径。支持 Linux CI 的 Headless Xvfb 执行

**MCP 驱动的 AI Agent 测试：**

Electron MCP Server 领域较为碎片化，存在9个以上的项目。还没有占主导地位的标准。

| 项目 | Stars | 方案 |
| --- | --- | --- |
| [amafjarkasi/electron-mcp-server](https://github.com/amafjarkasi/electron-mcp-server) | 60 | CDP（port 9222）、进程管理、JS 执行 |
| [circuit-mcp](https://github.com/icefort-ai/circuit-mcp) | 54 | Web（29工具）+Desktop/Electron（32工具）、可访问性优先、自动快照 |
| [kanishka-namdeo/electron-mcp](https://github.com/kanishka-namdeo/electron-mcp) | 0 | 44工具（6类别）、CDP+Playwright、代码录制→测试输出 |
| [robertn702/playwright-mcp-electron](https://github.com/robertn702/playwright-mcp-electron) | 5 | Playwright MCP 官方 Fork + Electron 专用工具（`electron_evaluate` 等） |

**官方 Playwright MCP**（[microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) 28.5k stars）也在开发 Electron 支持。已确认有 `ElectronContextFactory` 和 `--electron-app` 标志的实现提交，但尚未达到稳定发布。一旦官方支持实现，生态系统很可能会收敛。

所有 MCP Server 的共同点是都通过 Chromium DevTools Protocol（CDP）连接 Electron，并基于可访问性树进行 UI 操作。Electron 可以通过 `app.setAccessibilitySupportEnabled(true)` 以编程方式启用 Chromium 可访问性树。

#### Tauri 应用

**官方 tauri-driver：** 在 Windows/Linux 上支持 WebDriver 接口。**macOS 不支持**（因为不存在 Apple WKWebView 的 WebDriver）。可通过 WebdriverIO 或 Selenium 进行 E2E 测试。

**macOS 的替代方案：**

- [tauri-webdriver](https://github.com/Choochmeque/tauri-webdriver)（Choochmeque）：跨平台 W3C WebDriver Server。通过 `tauri-plugin-webdriver` 嵌入支持 macOS/Windows/Linux。2026年2月发布，非常新
- [Tauri-WebDriver](https://danielraffel.me/2026/02/14/i-built-a-webdriver-for-wkwebview-tauri-apps-on-macos/)（Daniel Raffel）：macOS 专用。JS Bridge + CLI（`tauri-wd`）架构，附带 MCP 集成
- [@crabnebula/tauri-driver](https://docs.crabnebula.dev/plugins/tauri-e2e-tests/)（CrabNebula）：macOS 测试需要付费订阅

**Tauri 的 MCP Server：**

- [tauri-plugin-mcp](https://github.com/P3GLEG/tauri-plugin-mcp)（80 stars）：Tauri 插件 + MCP Server。截图、DOM 操作、点击、输入等10个工具。IPC/TCP 通信
- [tauri-mcp](https://github.com/dirvine/tauri-mcp)（28 stars）：进程管理、窗口操作、输入模拟、IPC 等12个工具。Windows/macOS/Linux（X11）支持

#### 原生桌面应用

[TestDriver.ai](https://testdriver.ai/)（v7.4.5、217 stars）是基于 Computer-Use SDK 的 E2E 测试。自有的微调 AI 模型通过截图理解 UI，通过硬件仿真操作鼠标和键盘。测试用 JavaScript/TypeScript（Vitest）编写，通过自然语言 Prompt 指示操作。可通过 GitHub Actions（[testdriverai/action](https://github.com/testdriverai/action)）自动配置临时 Mac1 VM 进行 CI 执行。由于不需要选择器或 Test ID，特别适合 VS Code 扩展、Chrome 扩展、OAuth 流程等难以测试的领域。

#### 各平台可访问性 API

2025-2026年间，基于 MCP 的桌面自动化工具开始快速成熟。

| 平台 | 可访问性 API | 面向 Agent 的工具 |
| --- | --- | --- |
| macOS | NSAccessibility / AXUIElement | [macos-ui-automation-mcp](https://github.com/mb-dev/macos-ui-automation-mcp)（25 stars、PyObjC）、[mcp-server-macos-use](https://github.com/mediar-ai/mcp-server-macos-use)（Swift、基于可访问性树）等 |
| Windows | UIAutomation | [Terminator](https://github.com/mediar-ai/terminator)（1.3k stars、"Playwright for Windows"、Rust/TS/Python 支持、MCP 集成） |
| Linux | AT-SPI2 (pyatspi) | [kwin-mcp](https://github.com/isac322/kwin-mcp)（KDE Plasma 6 Wayland、29工具、隔离 KWin 会话） |
| Electron（全平台） | Chromium Accessibility | circuit-mcp、Playwright MCP Fork 等（参见上方 Electron 章节） |

特别是 Windows 的 [Terminator](https://github.com/mediar-ai/terminator) 利用 UIAutomation API，声称95%的操作成功率和纯视觉方案100倍的速度，展示了桌面可访问性自动化的成熟。

### 基础设施/DevOps E2E 测试

基础设施的变更与应用代码变更一样由 Agent 执行，但错误的影响是巨大的（破坏生产环境、制造安全漏洞）。确定性工具的验证在这里尤为重要。

#### Terraform

[terraform test](https://developer.hashicorp.com/terraform/language/tests)（原生测试框架）可在 Terraform v1.6+ 中使用。由于用 HCL 编写，Agent 可以自然地读写。

[Conftest + OPA](https://github.com/open-policy-agent/conftest) 对 `terraform plan` 的输出执行策略检查。通过 Rego 编写的策略，确定性地强制执行"禁止创建公共 S3 Bucket"、"生产环境实例大小下限"等护栏。

[Terratest](https://terratest.gruntwork.io/) 是用 Go 编写的集成测试框架。在沙盒环境中创建实际基础设施，自动测试后销毁。

#### Docker

[container-structure-test](https://github.com/GoogleContainerTools/container-structure-test)（Google）是以 YAML/JSON 定义的容器镜像结构验证测试。

```yaml
Copy# container-structure-test.yaml
schemaVersion: "2.0.0"
commandTests:
  - name: "node version"
    command: "node"
    args: ["--version"]
    expectedOutput: ["v20\\..*"]
fileExistenceTests:
  - name: "app entrypoint exists"
    path: "/app/index.js"
    shouldExist: true
metadataTest:
  exposedPorts: ["3000"]
  cmd: ["node", "index.js"]
```

#### Kubernetes

[kubeconform](https://github.com/yannh/kubeconform) 验证 Kubernetes Manifest 的 Schema。无需运行环境，速度快。Conftest 也可以对 Kubernetes Manifest 应用 OPA 策略。

#### 基础设施 E2E 的设计决策

如果允许 Agent 进行基础设施变更，以下护栏不可或缺：

1. PreToolUse Hook 阻止直接对生产环境执行 `terraform apply` 或 `kubectl apply`
2. Stop Hook 运行 `terraform test`、`conftest test`、`kubeconform`，测试通过前不让 Agent 完成
3. 将 `terraform plan` 的输出通过 Conftest 进行策略检查，构建 AI → CI 验证 → OPA 审批 → 合并 → ArgoCD 应用的流程
4. 将 container-structure-test 的 Docker 镜像结构验证设为 CI 必须

### AI/ML Pipeline E2E 测试

当 Agent 构建或修改 AI/ML Pipeline 时，不仅需要验证代码的正确性，还需要验证数据质量、模型性能以及整个 Pipeline 的完整性。测试分为**数据质量**、**模型评估（Benchmark）**、**应用质量（LLM）**、**Agent 评估**、**安全性/护栏**、**可观测性/漂移检测**6个层级。

#### 数据 Pipeline 测试

[GX（Great Expectations）](https://greatexpectations.io/) 是基于 Python 的数据质量验证框架（v1.14.0、11.2k stars）。[GX Core 1.0](https://greatexpectations.io/blog/introducing-gx-core-1-0/)（2024年8月）从根本上刷新了架构，重新设计为 Data Source / Data Asset / Batch Definition 的3层结构。[GX Cloud](https://greatexpectations.io/gx-cloud/)（托管 SaaS）可使用 ExpectAI（AI 辅助 Expectation 自动生成）和异常检测。

[dbt Tests](https://docs.getdbt.com/docs/build/data-tests) 是基于 SQL 的数据变换测试（dbt Core v1.11.7）。dbt 1.8+ 将[单元测试](https://docs.getdbt.com/docs/build/unit-tests)作为一等功能添加，`tests:` 键更名为 `data_tests:`。dbt 的测试最佳实践是"所有模型的主键加 `unique` + `not_null`"、"测试源数据的前提假设"、"[基于风险的方法](https://www.datafold.com/blog/7-dbt-testing-best-practices/)"，而非统一的数值目标。[dbt-expectations](https://hub.getdbt.com/metaplane/dbt_expectations/latest/)（目前由 [Metaplane](https://github.com/metaplane/dbt-expectations) 维护，v0.10.10）以 dbt 宏的形式提供 GX 风格的 Expectation。

另外，dbt Labs 在2025年10月[宣布与 Fivetran 合并](https://www.getdbt.com/blog/dbt-labs-and-fivetran-sign-definitive-agreement-to-merge)（等待监管审批）。Fivetran 在2025年9月还[收购了 SQLMesh 的开发商 Tobiko Data](https://www.fivetran.com/press/fivetran-acquires-tobiko-data-to-power-the-next-generation-of-advanced-ai-ready-data-transformation)，主要数据变换 OSS 正在归入同一阵营。

数据质量的竞品包括 [Soda Core](https://github.com/sodadata/soda-core)（v4.1.1、基于 YAML/SodaCL 语言、已转向"Data Contracts engine"）和 [Elementary](https://github.com/elementary-data/elementary)（dbt 原生的数据可观测性）。

#### 模型评估（Benchmark）

[lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)（EleutherAI）是 LLM 学术 Benchmark 评估的事实标准，被 HuggingFace Open LLM Leaderboard 作为后端采用，NVIDIA 也将其集成到 NGC 容器和 NeMo Microservices 中。（2026年1月）CLI 改为子命令化（`lm-eval run`、`lm-eval ls tasks`、`lm-eval validate`）并支持 YAML 配置文件。同版本引入了轻量核心化的破坏性变更，`pip install lm_eval` 不再包含后端，需要显式安装 `lm_eval[hf]` / `lm_eval[vllm]` / `lm_eval[api]` 等。

[LightEval](https://github.com/huggingface/lighteval)（Hugging Face、2.3k stars）是 Hugging Face 开发的轻量评估框架，支持1000多个任务，与 TGI 和 Inference Endpoints 的原生集成优秀。最初受 lm-evaluation-harness 影响开发，适合 HF 生态内的评估工作流。不过 Open LLM Leaderboard v2 本身仍使用 lm-evaluation-harness（HF Fork 版）作为后端。

两者与其说是竞争不如说是互补关系，lm-evaluation-harness 在学术可重现性和标准化方面强，LightEval 在 HF 生态集成方面强。对于应用层评估和 CI/CD 集成，两者都不太适合，需要其他工具。

#### 应用质量评估（LLM）

LLM 应用的质量评估工具在2025-2026年间快速成熟。

[DeepEval](https://github.com/confident-ai/deepeval)（Confident AI、14.0k stars）是兼容 pytest 的 LLM 评估框架，提供60多个指标（RAG、Agent、对话、安全性）。原生支持 [CI/CD 集成](https://deepeval.com/docs/evaluation-unit-testing-in-ci-cd)，可通过 `deepeval test run` 命令直接从 GitHub Actions 等执行。

[promptfoo](https://github.com/promptfoo/promptfoo)（10.9k stars）通过 YAML 声明式配置提供 Prompt 测试、红队测试、漏洞扫描，[CI/CD 集成](https://www.promptfoo.dev/docs/integrations/ci-cd/)优秀。特色是50多个漏洞插件的自动红队测试。

[RAGAS](https://docs.ragas.io/) 是 RAG 专用的评估框架，提供 Context Precision/Recall、Faithfulness、Answer Relevancy 等指标。截至2026年也已支持 Agent 工作流、工具使用和 SQL 的评估。

#### 持续评估（Continuous Evaluation）

作为2026年的企业标准，[持续评估](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)正在建立。预部署阶段在 CI/CD 中嵌入基于阈值的质量门（例：faithfulness >= 0.85、幻觉率 <= 5%），后部署阶段进行漂移检测和生产流量的持续评分的模式已经固化。LLM-as-Judge 成为自动评估的标准方法，[LangChain 的调查](https://www.langchain.com/state-of-agent-engineering) 显示53.3%的组织采用 LLM-as-Judge，89%实施了 Agent 可观测性，而离线评估的实施率仅为52.4%。

#### 安全性测试/护栏

LLM 的安全性测试需要专用工具。

[Microsoft PyRIT](https://github.com/Azure/PyRIT)（3.4k stars）是企业级红队测试工具，已作为 AI Red Teaming Agent 集成到 [Azure AI Foundry](https://devblogs.microsoft.com/foundry/ai-red-teaming-agent-preview/) 中。提供20多种攻击策略和 Attack Success Rate（ASR）指标。

[Guardrails AI](https://github.com/guardrails-ai/guardrails) 是 LLM 输出验证框架，从 Hub 组合预构建的 Validator 来配置 Input/Output Guards。[Guardrails Index](https://guardrailsai.com/)（2025年2月）是首个在6个类别中比较24个护栏的 Benchmark。

[NVIDIA NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) 是可编程的护栏工具包，支持输入、对话和检索的 Rail。

Anthropic 开发了 [Constitutional Classifiers](https://www.anthropic.com/research/constitutional-classifiers)，在超过3000小时的专家红队测试中未发现通用越狱。生产环境中的拒绝率增加仅0.38%，推理开销为23.7%。

监管方面，**EU AI Act** 的高风险 AI 完全义务化[定于2026年8月2日生效](https://sombrainc.com/blog/ai-regulations-2026-eu-ai-act)，质量管理、风险管理和合规评估中的对抗测试将成为强制要求。[NIST AI RMF](https://www.nist.gov/artificial-intelligence/ai-risk-management-framework) 的 TEVV（Testing, Evaluation, Verification, Validation）也作为结构化评估方法确立。

#### 总结

| 层级 | 测试工具 | 自动化模式 |
| --- | --- | --- |
| 数据质量 | GX Core/Cloud, Soda Core, Elementary, dbt Tests | Pipeline 执行时断言、Data Contracts |
| 模型性能（Benchmark） | lm-evaluation-harness, LightEval, HELM, Inspect AI | 基线比较、YAML 声明式配置 |
| 应用质量（LLM） | DeepEval, promptfoo, RAGAS | pytest/CI 集成、LLM-as-Judge |
| Agent 评估 | Maxim AI, LangSmith, Arize Phoenix, Langfuse | Tracing + 离线/在线 Eval |
| 安全性/护栏 | PyRIT, promptfoo, Guardrails AI, NeMo Guardrails | CI/CD Gating、Constitutional Classifiers |
| 可观测性/漂移检测 | Arize, WhyLabs, Evidently AI, Langfuse | 实时监控、自动告警 |

### 通用 E2E 原则总结

整理所有应用类型共通的模式。

![通用 E2E 模式](https://nyosegawa.com/img/harness-engineering-best-practices-2026/universal-e2e-pattern.png)

各应用类型的结构化文本接口汇总如下：

| 应用类型 | 结构化文本接口 |
| --- | --- |
| Web | 可访问性树（Playwright/agent-browser） |
| Mobile | 可访问性树（mobile-mcp/XcodeBuild） |
| CLI | 标准输出/错误输出（bats/pexpect） |
| API | HTTP 响应（Hurl） |
| Desktop | 可访问性树（Terminator/circuit-mcp/macos-ui-automation-mcp） |
| Infra | Plan 输出/Schema（terraform test/conftest） |
| AI/ML | 评估指标（lm-eval-harness/LightEval/GE） |

共通原则是将验证结果作为反馈返回给 Agent，关闭自我修正的循环。

### 动画/过渡效果的验证策略

截图和可访问性树都表达的是某一瞬间的静态状态。动画、过渡、滚动联动 UI 等具有时间轴的行为无法通过这些来验证。

#### 分层验证策略

| Layer | 时机 | 方法 |
| --- | --- | --- |
| Layer 1 | PostToolUse（ms） | 用 `getAnimations()` API 保证动画完成 |
| Layer 2 | PostToolUse（ms） | 测量 CLS（Cumulative Layout Shift） |
| Layer 3 | CI（s） | 冻结动画 + 快照比较 |
| Layer 4 | Stop Hook | 以5fps拍摄帧序列 → Agent 直接观看 |

#### Layer 1：通过 getAnimations() API 进行确定性验证

使用 Web Animations API 的 `getAnimations()` 等待动画完成后再执行断言。可以消除依赖时间的 `waitForTimeout`。

```typescript
Copy// Playwright 中的动画完成等待模式
async function waitForAnimationsComplete(page: Page, selector: string) {
  await page.locator(selector).evaluate((el) => {
    return Promise.all(
      el.getAnimations({ subtree: true }).map((a) => a.finished)
    );
  });
}

// 使用示例：模态框的开闭动画
test('modal opens with animation', async ({ page }) => {
  await page.click('[data-testid="open-modal"]');
  const modal = page.locator('[role="dialog"]');
  await waitForAnimationsComplete(page, '[role="dialog"]');
  await expect(modal).toBeVisible();
  await expect(modal).toHaveScreenshot('modal-open.png');
});
```

#### Layer 2：CLS（Cumulative Layout Shift）测量

使用 PerformanceObserver API 测量布局偏移，超过阈值时使测试失败。

```typescript
Copyasync function measureCLS(page: Page, action: () => Promise<void>): Promise<number> {
  await page.evaluate(() => {
    (window as any).__clsScore = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          (window as any).__clsScore += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await action();
  return page.evaluate(() => (window as any).__clsScore);
}

test('accordion animation has no layout shift', async ({ page }) => {
  const cls = await measureCLS(page, async () => {
    await page.click('[data-testid="accordion-toggle"]');
    await waitForAnimationsComplete(page, '.accordion-content');
  });
  expect(cls).toBeLessThan(0.1); // "good" CLS threshold
});
```

#### Layer 3：视觉回归（动画冻结）

[Chromatic](https://www.chromatic.com/docs/animations/)、[Percy](https://www.browserstack.com/docs/percy/)、[Argos CI](https://argos-ci.com/) 通过 `animation: none !important` 冻结 CSS 动画并禁用过渡，然后进行截图比较。

```
Copy/* Chromatic/Percy 自动注入的样式（概念） */
*, *::before, *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

#### Layer 4：低 FPS 帧捕获的 Agent 视觉验证

多模态 Coding Agent 可以直接观看图片。利用这个能力，以低 FPS（约5fps）捕获动画帧，让 Agent 作为帧序列来阅读，可以验证"动作"。

2秒动画 x 5fps = 10帧。每帧被视觉编码器处理为数百 Token，总计也就数千 Token，成本在实用范围内。

```typescript
Copyasync function captureAnimationFrames(
  page: Page,
  action: () => Promise<void>,
  options: { fps?: number; durationMs?: number; outputDir?: string } = {}
) {
  const { fps = 5, durationMs = 2000, outputDir = 'test-results/animation-frames' } = options;
  const interval = 1000 / fps;
  const totalFrames = Math.ceil(durationMs / interval);
  const frames: string[] = [];

  await fs.mkdir(outputDir, { recursive: true });

  const capturePromise = (async () => {
    for (let i = 0; i < totalFrames; i++) {
      const path = \`${outputDir}/frame-${String(i).padStart(3, '0')}.png\`;
      await page.screenshot({ path, fullPage: false });
      frames.push(path);
      await page.waitForTimeout(interval);
    }
  })();

  await action();
  await capturePromise;
  return frames;
}
```

#### 集成到反馈循环中

每次都执行帧捕获会很重，但限定为"只在有可能影响动画的变更时"执行就很实用。用 `git diff` 判定变更范围。

```json
Copy{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'git diff --name-only HEAD | grep -qE \"\\.(css|scss|less)$|animation|transition|motion|framer\" && npx playwright test --grep @animation --reporter=line 2>&1 | tail -30 || echo \"No animation-related changes, skipping.\"'"
          }
        ]
      }
    ]
  }
}
```

移动端的动画验证方面，iOS 可以用 `XCTOSSignpostMetric` 测量动画卡顿和掉帧，Android 可以用 `dumpsys gfxinfo` 获取类似的帧统计。

E2E 测试策略到此已全面覆盖。接下来让我们进入跨会话状态管理的话题。

## 6: 设计会话间的状态管理

### 问题的结构

Agent 的每个会话不持有前一个会话的记忆。就像轮班制工厂每次都来一个没有任何交接的新工人。

### 标准化启动例程

[Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) 的模式是每个会话开始时 Agent 执行以下操作：

1. 确认工作目录
2. 读取 Git 日志和进度文件
3. 从功能列表中选择下一个最高优先级任务
4. 启动开发服务器并进行基本功能连通测试

通过这个例程，即使前一个会话在损坏状态下结束，也能立即检测和修复。

### 使用 Git 作为会话间的桥梁

每个会话结束时附带描述性的提交消息进行 Git 提交。下一个会话的 `git log --oneline -20` 就是最可靠的"发生了什么"的记录。Git 日志与代码变更一一对应，因此与描述性文档不同，结构上不容易腐化。

### 使用 JSON 记录进度

Anthropic 的经验是功能列表和进度记录用 JSON 比 Markdown 更合适。模型不恰当地编辑/覆盖 JSON 格式数据的可能性低于 Markdown。但这是面向短期项目的方法，在长期项目中需要考虑功能列表本身腐化的风险，应考虑将测试套件本身作为功能列表的替代。

会话管理之后，作为最后一个原则，让我们来看平台特定的 Harness 策略。

## 7: 理解平台特定的 Harness 策略：Codex vs Claude Code

### Harness 比模型更重要

[Morph 的分析](https://www.morphllm.com/best-ai-model-for-coding) 令人震惊。同一模型更换 Harness 后 SWE-bench 分数变动22分，而更换模型只变动1分。决定生产力的不是平台选择本身，而是能在多大程度上将所选平台的独有功能整合到 Harness 中。

### 架构的根本差异

[Codex 是"密室型"](https://muraco.ai/en/articles/harness-engineering-claude-code-codex/)。将代码副本带入云端沙盒（网络隔离容器），独立工作后返回完成的 Diff。可以异步并行执行多个任务。

Claude Code 是"工作坊型"。直接进入开发者的环境，在本地进行文件编辑和命令执行。通过 Hooks 系统，可以在工具执行的 before/after 插入确定性控制。

![Codex vs Claude Code 架构对比](https://nyosegawa.com/img/harness-engineering-best-practices-2026/codex-vs-claude-code.png)

### Codex 特有的 Harness 功能

| 功能 | 说明 | 对 Harness 的影响 |
| --- | --- | --- |
| 云端沙盒执行 | 在网络隔离容器中并行执行任务 | AGENTS.md 的指示在沙盒内忠实再现，可以实现排除本地环境差异的 Harness 设计 |
| 异步任务队列 | 通过 `codex cloud exec` 同时在后台执行多个任务 | 一个 AGENTS.md 可以并行投入多个任务，加速 Harness 的验证周期 |
| [Automations](https://developers.openai.com/codex/app/automations/) | 定期执行任务的自动调度（目前为应用运行期间的本地执行） | 可以将基于 AGENTS.md 的 Linter 运行和代码质量扫描设为定期任务 |
| [App Server 协议](https://openai.com/index/unlocking-the-codex-harness/) | 双向 JSON-RPC 统一所有客户端界面（CLI、VSCode、Web） | 从任何客户端都应用相同的 AGENTS.md 和沙盒配置 |
| [实时 Steering](https://developers.openai.com/codex/app-server/) | 通过 `turn/steer` 方法向运行中的 Agent 发送追加指示 | 可以在长时间任务中途补正 Harness 指示，减少任务重新执行成本 |
| [Agents SDK 集成](https://developers.openai.com/codex/guides/agents-sdk/) | 通过 `codex mcp-server` 将 Codex CLI 作为 MCP Server 公开 | 可以从外部编排器以编程方式调用 Codex 任务 |
| [`notify` Hook](https://developers.openai.com/codex/config-advanced/) | 任务完成时执行外部命令（JSON Payload） | 目前唯一的事件 Hook。仅支持 `agent-turn-complete` 事件 |

Codex 尚不存在像 Claude Code 的 PreToolUse/PostToolUse 那样"在工具执行前后介入"的机制。唯一的类 Hook 功能是 [`notify`](https://developers.openai.com/codex/config-advanced/)，在 `~/.codex/config.toml` 中如下配置：

```toml
Copynotify = ["python3", "/path/to/notify.py"]
```

`notify` 在 `agent-turn-complete` 事件触发时调用外部命令，传递包含 `type`、`thread-id`、`input-messages`、`last-assistant-message` 等的 JSON Payload。用于桌面通知或 Slack Webhook 足够了，但无法用于在工具执行前运行 Linter 这样的质量门。

[GitHub Discussion #2150](https://github.com/openai/codex/discussions/2150) 有83人以上请求 Claude Code 相当的 Hooks 系统，[Issue #2109](https://github.com/openai/codex/issues/2109) 获得了475以上的 Upvote。OpenAI 在 [Issue #12524](https://github.com/openai/codex/issues/12524) 中回复"正在开发更通用的事件 Hook 功能，现有的 `notify` 未来计划废弃"。社区也提交了完整 Hooks 系统的 [PR](https://github.com/openai/codex/pull/9796)，但以"目前不接受 feature contribution"为由被关闭。

那么 Codex 用户如何应对呢？当前的方法是"预防型"。在 AGENTS.md 中明文规定规则，通过 pre-commit Hook 和 Linter 在基础设施层面强制质量。无法像 Claude Code 那样构建"每次文件编辑都运行 Linter"的响应式循环，因此是任务完成后批量运行 Lint → 如有违规则向 Codex 重新投递修复任务的批处理工作流。也有像 [codex-subagents-mcp](https://github.com/leonardsellem/codex-subagents-mcp) 这样通过 MCP Server 生成专门子 Agent（Reviewer、Debugger、安全审计）的尝试，但这也是使用 MCP 的 Delegate 调用而非 notify Hook，与工具执行前后的介入不同。

这个差异从 Harness Engineering 角度来看是决定性的。与下面 Claude Code 特有功能表对比后，差异一目了然。

### Claude Code 特有的 Harness 功能

| 功能 | 说明 | 对 Harness 的影响 |
| --- | --- | --- |
| [Hooks 系统](https://code.claude.com/docs/en/hooks) | PreToolUse/PostToolUse/Stop/PreCompact 等生命周期 Hook | 最大的差异化要素。在每次工具执行中强制确定性质量门 |
| PreToolUse Blocking | 在工具执行前确定性地阻止操作 | 机械地强制 `.env` 编辑禁止、`rm -rf` 防止等安全策略 |
| PostToolUse 质量循环 | 每次文件编辑 → Linter → JSON additionalContext 注入 → 自我修正 | 弥合"几乎每次"与"无一例外每次"的差距 |
| PreCompact Hook | [压缩前保护重要信息](https://institute.sfeir.com/en/claude-code/claude-code-context-management/optimization/) | 减轻长会话中的信息损失 |
| [MCP Tool Search](https://code.claude.com/docs/en/mcp) | 按需加载工具描述，[上下文消耗最多减少85%](https://www.anthropic.com/engineering/advanced-tool-use) | 防止连接大量 MCP Server 时的性能退化 |
| [Agent Teams（实验性）](https://code.claude.com/docs/en/agent-teams) | 多个会话间的直接通信与协作 | 团队成员之间的直接消息 |
| [Plan Mode](https://stevekinney.com/courses/ai-development/claude-code-plan-mode) + [Extended Thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) | 只读计划模式（Token 减少40-60%）+ 动态思考深度调整 | 在复杂设计决策中提升推理质量 |

### 两者都可以但方法不同的部分

Linter 集成：Codex 在任务完成时批量运行 Lint。Claude Code 通过 settings-based PostToolUse Hook 在每次文件编辑时运行 Lint → 作为符合文档规范的 JSON 的 `additionalContext` 注入 → 自我修正循环。Claude Code 的粒度更细（文件级别 vs 任务级别）。

E2E 测试：测试生成适合 Claude Code（通过反馈循环提升质量），测试并行执行适合 Codex（沙盒中的异步执行）。

多 Agent：大规模 Pipeline 适合 Codex（通过 Agents SDK + MCP 的基于角色的编排），探索性协作适合 Claude Code（Agent Teams）。

### 混合策略：用 Claude Code 计划，用 Codex 执行

截至2026年，许多专业人士采用 [Claude Code 计划/设计 → Codex 并行执行 → Claude Code 审查/改进](https://northflank.com/blog/claude-code-vs-openai-codex) 的混合架构。

共享 Harness 层（两个平台共用）：

- [AGENTS.md（AAIF 标准，Codex、Cursor、Devin、Gemini CLI、GitHub Copilot 等主要 Coding Agent 都会读取的通用格式）](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)。Claude Code 中对应的文件是 CLAUDE.md，AGENTS.md 不会被原生读取。如果同时管理两者，在 CLAUDE.md 中通过 [`@AGENTS.md` 引用来包含](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Skills（SKILL.md，Anthropic 作为开放标准发布，OpenAI 也采用了相同格式）](https://code.claude.com/docs/en/skills)
- MCP 配置
- ADR、Linter/Formatter 配置、测试套件

平台特定层：

- CLAUDE.md + `.claude/settings.json`：Claude Code 特有的 Hooks 配置、Plan Mode 指示、生命周期 Hook 定义
- Codex Automations 配置：定期任务调度
- `~/.codex/AGENTS.override.md`：发布冻结或事故响应时临时覆盖 AGENTS.md 的高优先级配置

### 决策框架

| 最优先事项 | 推荐 | 原因 |
| --- | --- | --- |
| 质量 | 以 Claude Code 为主 | Hooks 提供的确定性质量门没有其他替代手段 |
| 吞吐量 | 以 Codex 为主 | 异步沙盒中的并行执行没有其他替代手段 |
| 两者兼顾 | 用 Claude Code 构建 Harness → 用 Codex 规模化执行 | Harness 的质量决定规模化时的可靠性 |

## 反模式

到这里我们看完了最佳实践，让我们也确认一下不应该做的事情。

1. 仅依赖 Prompt：仅对 Agent 写"请写测试后再提交"是不够的。应通过 pre-commit Hook 强制执行测试。不是靠请求而是靠机制来解决
2. 在仓库中积累说明文档：与其在 README 中写"这个服务依赖 X 和 Y"，不如用类型定义和 Schema 表达依赖关系并通过结构测试验证，这样更不容易腐化
3. 让 AGENTS.md/CLAUDE.md 变得臃肿：WPBoilerplate（WordPress 插件样板）的 [AGENTS.md 超过1000行](https://addyosmani.com/blog/agents-md/)。在第一个问题提出之前就消耗了大量上下文。应力求50行以下
4. 构建 Agent 专用基础设施：[Stripe 的教训](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents) 最具普适性："不要构建 Agent 专用基础设施。构建优秀的开发者基础设施。Agent 会自动享受其收益"
5. 在没有 Harness 的情况下扩展：没有 Harness 就增加 Agent 数量，[产生的不是复利式的杠杆而是复利式的认知债务](https://thenewstack.io/vibe-coding-agentic-engineering/)。先用一个 Agent 打磨 Harness，然后再扩展

## 最小可行 Harness（MVH：Minimum Viable Harness）

上述原则不需要一次性全部引入。按以下顺序逐步构建。

![MVH 路线图](https://nyosegawa.com/img/harness-engineering-best-practices-2026/mvh-roadmap.png)

### Week 1

- 创建 AGENTS.md/CLAUDE.md（仅作为指针，力求50行以下）
- 在 pre-commit Hook（推荐 Lefthook）中运行 Linter、Formatter、类型检查
- 配置 PostToolUse Hook 的自动格式化（参考原则2的 JSON 示例）
- 编写第一个 ADR

### Week 2-4

- 每当 Agent 犯错时添加测试或 Linter 规则
- 建立计划 → 批准 → 执行的工作流
- 引入 E2E 测试工具（Playwright CLI or agent-browser）
- 在 Stop Hook 中将测试通过设为完成条件
- 标准化会话间的启动例程

### Month 2-3

- 构建自定义 Linter 并在错误消息中包含修复指示（带 ADR 引用）
- 开始将 ADR 与 Linter 规则关联（archgate 模式）
- 逐步从仓库中移除描述性文档，替换为测试和 ADR
- 在 PreToolUse Hook 中设置安全门（敏感文件保护、破坏性命令阻止）

### Month 3+

- 考虑 Plankton 模式等高级反馈循环
- 引入垃圾回收流程（基于确定性规则）
- 尝试同时运行多个 Agent，掌握自己的管理上限
- 定量测量 Harness 的效果（PR/天、返工率、审查指出率）

## 总结

- Harness Engineering 的核心是"用机制而非 Prompt 来强制保证质量"。Linter、Hooks、测试、ADR 的组合产生复利效应
- 反馈越快越好。按 PostToolUse Hook（ms）> pre-commit（s）> CI（min）> 人工审查（h）的顺序，将检查尽可能移到更快的层级
- 不需要一次性全部引入。从 MVH 开始，每当 Agent 犯错时强化 Harness

## 2026-03-11 修正

发布后根据 Claude Code Hooks 追加测试，对 Hooks 章节的描述进行了部分修正。本文的 Hooks 示例以放在 `.claude/settings.json` 或 `.claude/settings.local.json` 中的 settings-based hooks 为前提。此外，将 PostToolUse 中向 Claude 返回反馈的方式修正为返回包含 `hookSpecificOutput.additionalContext` 的符合文档规范的 JSON，而非普通 stdout。frontmatter hooks 和 plugin/marketplace 的行为差异作为另行验证对象分离处理。追加测试使用的复现实验仓库在 [https://github.com/nyosegawa/claude-hook-experiment](https://github.com/nyosegawa/claude-hook-experiment)。

## References

### 一手资料

- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) (OpenAI Engineering Blog)
- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey) (Mitchell Hashimoto)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (Anthropic Engineering)
- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) (Birgitta Böckeler / Thoughtworks)
- [The Emerging 'Harness Engineering' Playbook](https://www.ignorance.ai/p/the-emerging-harness-engineering) (Charlie Guo)
- [Minions: Stripe's one-shot, end-to-end coding agents](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents) (Stripe)
- [Minions Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2) (Stripe)

### Claude Code / Codex

- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide) (Anthropic)
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) (Anthropic)
- [Claude Code Memory](https://code.claude.com/docs/en/memory) (Anthropic)
- [Agent Teams](https://code.claude.com/docs/en/agent-teams) (Anthropic)
- [MCP Tool Search](https://code.claude.com/docs/en/mcp) (Anthropic)
- [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) (Anthropic)
- [Introducing Codex](https://openai.com/index/introducing-codex/) (OpenAI)
- [Codex Automations](https://developers.openai.com/codex/app/automations/) (OpenAI)
- [Codex App Server](https://openai.com/index/unlocking-the-codex-harness/) (OpenAI)
- [Codex Agents SDK](https://developers.openai.com/codex/guides/agents-sdk/) (OpenAI)

### Linter 工具

- [Oxlint 1.0](https://voidzero.dev/posts/announcing-oxlint-1-stable) (VoidZero)
- [Biome v2.0](https://biomejs.dev/blog/biome-v2/) (Biome)
- [Ruff](https://github.com/astral-sh/ruff) (Astral)
- [golangci-lint](https://golangci-lint.run/)
- [rust-magic-linter](https://github.com/vicnaum/rust-magic-linter) (vicnaum)
- [SwiftLint](https://github.com/realm/SwiftLint) (Realm)
- [detekt](https://github.com/detekt/detekt)
- [Factory.ai ESLint Plugin](https://factory.ai/news/using-linters-to-direct-agents) (Factory.ai)
- [eslint-plugin-local-rules](https://github.com/cletusw/eslint-plugin-local-rules)
- [ast-grep](https://ast-grep.github.io/)
- [Lint Against the Machine](https://medium.com/@montes.makes/lint-against-the-machine-a-field-guide-to-catching-ai-coding-agent-anti-patterns-3c4ef7baeb9e) (Montes)

### E2E 测试

- [Playwright Agents](https://shipyard.build/blog/playwright-agents-claude-code/) (Shipyard)
- [Playwright CLI Agentic Testing](https://www.awesome-testing.com/2026/03/playwright-cli-skills-and-isolated-agentic-testing) (Awesome Testing)
- [agent-browser](https://github.com/vercel-labs/agent-browser) (Vercel Labs)
- [agent-browser + Pulumi](https://www.pulumi.com/blog/self-verifying-ai-agents-vercels-agent-browser-in-the-ralph-wiggum-loop/) (Pulumi)
- [XcodeBuildMCP](https://github.com/getsentry/XcodeBuildMCP) (Sentry)
- [mobile-mcp](https://github.com/mobile-next/mobile-mcp) (Mobile Next)
- [Appium MCP](https://github.com/appium/appium-mcp)
- [Detox](https://github.com/wix/Detox) (Wix)
- [Maestro](https://maestro.dev/)
- [bats-core](https://github.com/bats-core/bats-core)
- [Hurl](https://hurl.dev/) (Orange)
- [Pact](https://docs.pact.io/)
- [Testcontainers](https://testcontainers.com/)
- [circuit-mcp](https://github.com/icefort-ai/circuit-mcp)
- [Playwright MCP (Electron 支持开发中)](https://github.com/microsoft/playwright-mcp)
- [wdio-electron-service](https://github.com/webdriverio-community/wdio-electron-service)
- [tauri-plugin-mcp](https://github.com/P3GLEG/tauri-plugin-mcp)
- [TestDriver.ai](https://testdriver.ai/)
- [Terminator](https://github.com/mediar-ai/terminator)
- [macos-ui-automation-mcp](https://github.com/mb-dev/macos-ui-automation-mcp)
- [kwin-mcp](https://github.com/isac322/kwin-mcp)

### 基础设施 / DevOps

- [Terraform Test](https://developer.hashicorp.com/terraform/language/tests) (HashiCorp)
- [Conftest](https://github.com/open-policy-agent/conftest) (OPA)
- [Terratest](https://terratest.gruntwork.io/) (Gruntwork)
- [container-structure-test](https://github.com/GoogleContainerTools/container-structure-test) (Google)
- [kubeconform](https://github.com/yannh/kubeconform)

### AI/ML

#### 数据质量

- [GX Core / GX Cloud](https://greatexpectations.io/) (Great Expectations)
- [Soda Core](https://github.com/sodadata/soda-core) (Soda)
- [Elementary](https://github.com/elementary-data/elementary) (Elementary Data)
- [dbt Tests / Unit Tests](https://docs.getdbt.com/docs/build/data-tests) (dbt Labs)
- [dbt-expectations](https://hub.getdbt.com/metaplane/dbt_expectations/latest/) (Metaplane)

#### 模型评估/Benchmark

- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) (EleutherAI)
- [LightEval](https://github.com/huggingface/lighteval) (Hugging Face)
- [HELM](https://github.com/stanford-crfm/helm) (Stanford CRFM)
- [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai) (UK AISI)

#### LLM 评估/CI/CD 集成

- [DeepEval](https://github.com/confident-ai/deepeval) (Confident AI)
- [promptfoo](https://github.com/promptfoo/promptfoo)
- [RAGAS](https://docs.ragas.io/)
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic)
- [State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering) (LangChain)

#### 安全性/护栏

- [PyRIT](https://github.com/Azure/PyRIT) (Microsoft)
- [Guardrails AI](https://github.com/guardrails-ai/guardrails)
- [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) (NVIDIA)
- [Constitutional Classifiers](https://www.anthropic.com/research/constitutional-classifiers) (Anthropic)
- [EU AI Act Guide 2026](https://sombrainc.com/blog/ai-regulations-2026-eu-ai-act)

#### 可观测性/漂移检测

- [Evidently AI](https://github.com/evidentlyai/evidently)
- [Langfuse](https://github.com/langfuse/langfuse)
- [Arize Phoenix](https://github.com/Arize-AI/phoenix)

### 其他

- [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md) (HumanLayer)
- [How Many Instructions Can LLMs Follow at Once?](https://arxiv.org/abs/2507.11538)
- [Stop Using /init for AGENTS.md](https://addyosmani.com/blog/agents-md/) (Addy Osmani)
- [AGENTS.md outperforms skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) (Vercel)
- [archgate](https://github.com/archgate/cli)
- [ADR](https://adr.github.io/) (Michael Nygard)
- [Lefthook + Claude Code](https://liambx.com/blog/ai-agent-lint-enforcement-lefthook-claude-code)
- [Plankton / everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- [What Is Context Rot?](https://www.morphllm.com/context-rot) (Morph)
- [Best AI Model for Coding](https://www.morphllm.com/best-ai-model-for-coding) (Morph)
- [Harness Engineering 101](https://muraco.ai/en/articles/harness-engineering-claude-code-codex/) (muraco.ai)
- [Claude Code vs OpenAI Codex](https://northflank.com/blog/claude-code-vs-openai-codex) (Northflank)
- [AAIF](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) (Linux Foundation)
- [Xcode 26.3 Agentic Coding](https://www.apple.com/newsroom/2026/02/xcode-26-point-3-unlocks-the-power-of-agentic-coding/) (Apple)
- [From vibes to engineering](https://thenewstack.io/vibe-coding-agentic-engineering/) (The New Stack)
- [Chromatic Animation Docs](https://www.chromatic.com/docs/animations/)
- [iOS Simulator MCP Server](https://lobehub.com/mcp/joshuayoes-ios-simulator-mcp)