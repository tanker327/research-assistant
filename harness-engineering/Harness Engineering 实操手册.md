# Harness Engineering 实操手册

---

## 第一章：什么是 Harness Engineering

### 1.1 核心定义

**Harness Engineering** 是围绕 AI Coding Agent 构建约束机制、反馈循环、文档体系和生命周期管理的工程学科。它的目标不是让模型更聪明，而是让模型在你的代码仓库中可靠地工作。正如马具（harness）将骏马的力量引导到正确方向，Harness Engineering 将 LLM "参差不齐的智能"塑造成可控、可验证、可持续的工程产出。

> "The model is commodity. The harness is moat."
> 模型是商品，Harness 才是护城河。 — NxCode

**历史脉络：控制论的第三次浪潮**

这个模式并非 AI 时代的发明。George (@odysseus0z) 指出，Harness Engineering 是控制论（Cybernetics）的第三次出现——Norbert Wiener 1948 年命名的闭合控制回路模式：

| 时代 | 技术 | 角色转变 |
|------|------|---------|
| 1784 | 瓦特离心调速器 | 工人从转阀门 → 设计调速器 |
| 2014 | Kubernetes | 工程师从重启服务 → 编写声明式规格 |
| 2026 | Harness Engineering | 工程师从写代码 → 设计环境、反馈循环和约束系统 |

每次这个模式出现，都是因为有人构建了足够强大的**传感器和执行器**，在那个层级闭合了控制回路。Kubernetes 和 Cybernetics 共享同一个希腊语词根 κυβερνήτης（舵手）——这不是巧合，是同一个工程模式在不同抽象层级的反复出现。

> 来源：George (@odysseus0z),《Harness Engineering Is Cybernetics》, 2026-03-07

### 1.2 为什么重要：用数据说话

| 案例 | 数据 | 来源 |
|------|------|------|
| OpenAI Codex 团队 | 3 名工程师，5 个月，从空仓库构建约 **100 万行代码**，**零行手写代码**，效率约为人类 10 倍 | OpenAI Harness Engineering |
| LangChain deepagents-cli | 不换模型（固定 gpt-5.2-codex），仅改 Harness，Terminal Bench 2.0 排名从 **Top 30 升至 Top 5**（52.8% → 66.5%，+13.7pp） | LangChain Improving Deep Agents |
| Stripe Minions | 每周产出超过 **1,000 个合并的 Pull Request** | NxCode 完整指南 |
| Morph 分析 | 同一模型换 Harness，SWE-bench 分数变动 **22 分**；换模型仅变 **1 分** | Claude Code/Codex 最佳实践 |
| Carlini C 编译器 | 16 个并行 Agent，**极简提示词** + 精心设计的测试基础设施，成功构建完整 C 编译器。"我的大部分精力都花在设计 Claude 周围的环境" | Anthropic Engineering Blog |

结论：**性能瓶颈不在模型，在 Harness。** 投资 Harness 的 ROI 远超更换模型或堆算力。

**惩罚加速效应**：好的工程实践（文档、测试、架构约束、反馈循环）一直是正确的，过去三十年的工程书都推荐它们。区别在于：以前跳过它们的代价是缓慢而分散的——质量渐进下降、痛苦的 onboarding、悄悄复利增长的技术债。**Agent 时代让这个代价变得极端**：跳过文档，Agent 就在每一个 PR 上、以机器速度、全天候地违反你的规范。跳过测试，反馈循环根本无法闭合。跳过架构约束，偏移的复利增长速度超过你修复的速度。

> "The practices haven't changed. The penalty for ignoring them has become unbearable."
> 实践没有变。忽略它们的惩罚变得不可承受了。 — George (@odysseus0z)

### 1.3 核心公式

```
Agent = Model + Harness
```

- **Model**（马）：LLM 本身，提供原始智能
- **Harness**（马具）：约束、反馈循环、文档、工具链——将原始智能转化为可靠产出
- **Rider**（骑手）：人类工程师，定义意图、设计环境、审核方向

> "Humans steer. Agents execute."
> 人类掌舵，Agent 执行。 — OpenAI Harness Engineering

**工程师的核心竞争力转变**：生成-验证不对称性（P vs NP 背后的直觉，由 Cobbe 等人对 LLM 实证验证）指明了方向：生成正确解比验证一个解更难。你不需要在实现上超越机器，你需要在**评估**上超越它——明确"正确"是什么样子的、识别输出什么时候偏了、判断方向是否正确。这种评估能力的外部化形式就是：ADR、Linter 规则、测试、架构文档。（来源：George @odysseus0z）

### 1.4 三大支柱

#### 支柱一：Context Engineering（上下文工程）

确保 Agent 在正确时间获得正确信息。Agent 无法访问的上下文等于不存在——所有知识必须以版本化形式存在于仓库中。Slack 讨论、口头共识、Google Docs 对 Agent 不可见。

上下文工程分为两个层次（来源：George @odysseus0z 的"校准"概念）：

- **通用上下文**（任何项目都需要）：测试套件、CI 配置、Linter 规则、类型定义——这是让反馈循环运转的基础
- **校准上下文**（你的项目特有）：架构文档、ADR、自定义 Linter 规则（含修复指引）、Golden Principles——这是让 Agent 理解你系统中"好"意味着什么的校准信息

> Agent 不会通过渗透作用学习。你不写下来，它第 100 次犯的错和第 1 次一模一样。 — George (@odysseus0z)

核心实践：
- `AGENTS.md` 作为目录（约 50 行），指向结构化 `docs/` 目录（Progressive Disclosure）
- ADR（Architecture Decision Records）记录决策历史
- 静态上下文（架构文档、API 合约）+ 动态上下文（日志、指标、CI 状态）

> "Give Codex a map, not a 1,000-page instruction manual."
> 给 Codex 一张地图，而不是一本千页操作手册。 — OpenAI Harness Engineering

#### 支柱二：Architectural Constraints（架构约束）

通过机械化手段（Linter、Type Checker、结构测试、Pre-commit Hook）强制执行架构规则，而非依赖文档指引。约束不变量，不微管理实现细节。

核心实践：
- 依赖分层强制执行（Types → Config → Repo → Service → Runtime → UI）
- 自定义 Linter 的错误消息中注入修复指引，直接进入 Agent 上下文
- Pre-commit Hook 拦截违规，PostToolUse Hook 实时反馈

> "By enforcing invariants, not micromanaging implementations, we let agents ship fast without undermining the foundation."
> 通过约束不变量而非微管理实现细节，我们让 Agent 在不破坏根基的前提下快速交付。 — OpenAI Harness Engineering

#### 支柱三：Entropy Management（熵管理 / 垃圾回收）

AI 生成的代码库会随时间积累熵——文档偏离现实、命名规范分化、死代码堆积。需要持续的"垃圾回收"机制来保持代码库健康。

核心实践：
- 编码 Golden Principles 为可执行规则
- 定期运行后台 Agent 任务扫描偏差、更新质量评分、提交定向重构 PR
- 每次 Agent 犯错就添加一个防止该错误的测试——测试不会撒谎，文档会腐败

> "Technical debt is like a high-interest loan: it's almost always better to pay it down continuously in small increments than to let it compound."
> 技术债就像高利贷：持续小额偿还几乎总是优于让它复利增长后再集中还债。 — OpenAI Harness Engineering

### 1.5 十大核心原则

| # | 原则 | 出处 |
|---|------|------|
| 1 | **仓库即唯一真相来源**：Agent 无法访问的上下文等于不存在，所有知识必须版本化存入仓库 | OpenAI Harness Engineering |
| 2 | **地图优于手册**：用 50 行的指针式 AGENTS.md 做渐进式信息披露，而非塞入千页指令 | OpenAI Harness Engineering |
| 3 | **用机制而非提示词保障质量**：Hook 强制跑 Linter 是"每一次"，CLAUDE.md 里写"请跑 Linter"是"大多数时候" | Claude Code/Codex 最佳实践 |
| 4 | **约束不变量，不微管理实现**：通过 Linter 和结构测试强制架构边界，让 Agent 在边界内自由发挥 | OpenAI Harness Engineering |
| 5 | **反馈越快越好**：PostToolUse（毫秒）> Pre-commit（秒）> CI（分钟）> 人工 Review（小时） | Claude Code/Codex 最佳实践 |
| 6 | **自验证是最关键的单一改进**：强制 Agent 进入"构建→测试→验证→修复"闭环，而非信任其自我审查 | LangChain Improving Deep Agents |
| 7 | **计划与执行分离**：让 Agent 先制定计划，人类审核后再执行，是最重要的单一实践 | Claude Code/Codex 最佳实践 (Boris Tane, Cloudflare) |
| 8 | **不要构建 Agent 专用基础设施**：构建优秀的开发者基础设施，Agent 会自动受益 | Claude Code/Codex 最佳实践 (Stripe) |
| 9 | **Harness 必须可拆卸**：当前的 Guardrail 是针对模型不足的权宜之计，过度工程化的控制流会在模型升级时崩溃 | LangChain Improving Deep Agents / NxCode |
| 10 | **持续偿还技术债**：通过 Golden Principles + 后台 Agent 垃圾回收任务实现自动化熵管理 | OpenAI Harness Engineering |

---

## 第二章：快速启动 — 最小可行 Harness (MVH)

> 目标：用一周时间搭建最小可行 Harness，覆盖最高价值的基础设施。
> 以下每个步骤均提供 **前端 TypeScript** 和 **后端 Python** 两套示例。

### 步骤 1：创建 AGENTS.md

> 50 行以内的指针式模板。只写路由指令和禁止事项，不写系统现状说明。
> 每行自问："删掉这行 Agent 会出错吗？" 答案为 No 则删除。 — Claude Code/Codex 最佳实践

- [ ] 在项目根目录创建 `AGENTS.md`（Codex 用）或 `CLAUDE.md`（Claude Code 用）

**前端 TypeScript 模板：**

```markdown
# AGENTS.md

## Build & Dev
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Typecheck: `pnpm tsc --noEmit`

## Test
- All tests: `pnpm test`
- Single file: `pnpm test -- path/to/file.test.ts`
- Watch mode: `pnpm test -- --watch`

## Lint & Format
- Lint: `pnpm oxlint .`
- Format: `pnpm biome format --write .`
- Pre-commit runs both automatically via Lefthook

## Architecture
- See `docs/adr/` for Architecture Decision Records
- See `docs/ARCHITECTURE.md` for domain/layer map
- Layers (top→bottom): UI → Runtime → Service → Repo → Config → Types
- Dependencies MUST flow downward only

## Rules
- Do NOT modify linter/formatter config files (`biome.json`, `oxlint.json`)
- Do NOT use `--no-verify` on git commits
- Do NOT skip or delete existing tests
- Run tests before declaring any task complete
- One feature per task — do not bundle unrelated changes
```

**后端 Python 模板：**

```markdown
# AGENTS.md

## Build & Dev
- Package manager: `uv`
- Install: `uv sync`
- Run: `uv run python -m src.main`
- Config: use `src/core/config.py`, NOT `os.getenv()`

## Test
- All tests: `uv run pytest`
- Single file: `uv run pytest tests/path/to/test_file.py -v`
- With coverage: `uv run pytest --cov=src`

## Lint & Format
- Lint: `uv run ruff check .`
- Format: `uv run ruff format .`
- Type check: `uv run mypy src/`
- Pre-commit runs all automatically via Lefthook

## Architecture
- See `docs/adr/` for Architecture Decision Records
- See `docs/ARCHITECTURE.md` for domain/layer map
- Entry point: `src/main.py`
- Config: `src/core/config.py` (Pydantic Settings)

## Rules
- Do NOT modify linter config (`pyproject.toml` [tool.ruff] section)
- Do NOT use `--no-verify` on git commits
- Do NOT skip or delete existing tests
- Run tests before declaring any task complete
- One feature per task — do not bundle unrelated changes
```

### 步骤 2：配置 Pre-commit Hook（Lefthook）

> Lefthook 是 Go 制的 Git Hook 管理器，速度快。
> 设计双重标准：人类可 `--no-verify` 跳过，Agent 通过 AGENTS.md 禁止使用 `--no-verify`。 — Claude Code/Codex 最佳实践

- [ ] 安装 Lefthook：`brew install lefthook` 或 `npm install -g @evilmartians/lefthook`
- [ ] 在项目根目录创建 `.lefthookrc.yaml`
- [ ] 运行 `lefthook install` 激活 Hook

**前端 TypeScript 配置（`.lefthookrc.yaml`）：**

```yaml
pre-commit:
  parallel: true
  commands:
    oxlint:
      glob: "*.{ts,tsx,js,jsx}"
      run: pnpm oxlint {staged_files}
      stage_fixed: true
    biome-format:
      glob: "*.{ts,tsx,js,jsx,json,css}"
      run: pnpm biome format --write {staged_files}
      stage_fixed: true
    typecheck:
      glob: "*.{ts,tsx}"
      run: pnpm tsc --noEmit
```

**后端 Python 配置（`.lefthookrc.yaml`）：**

```yaml
pre-commit:
  parallel: true
  commands:
    ruff-check:
      glob: "*.py"
      run: uv run ruff check {staged_files} --fix
      stage_fixed: true
    ruff-format:
      glob: "*.py"
      run: uv run ruff format {staged_files}
      stage_fixed: true
    mypy:
      glob: "*.py"
      run: uv run mypy src/
```

### 步骤 3：配置 PostToolUse Hook（Claude Code）

> PostToolUse Hook 在 Agent 每次写入文件后自动运行 Linter/Formatter，反馈速度在毫秒级。
> 先运行自动修复，再将残余违规通过 JSON 返回给 Agent 驱动自我修正。 — Claude Code/Codex 最佳实践

- [ ] 在项目根目录创建 `.claude/settings.json`（项目级）或编辑 `~/.claude/settings.json`（全局）

**前端 TypeScript 配置（`.claude/settings.json`）：**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "biome format --write $CLAUDE_FILE_PATH 2>/dev/null; LINT_OUTPUT=$(oxlint $CLAUDE_FILE_PATH 2>&1); if [ -n \"$LINT_OUTPUT\" ]; then echo '{\"decision\": \"allow\", \"hookSpecificOutput\": {\"additionalContext\": \"Oxlint violations found:\\n'\"$LINT_OUTPUT\"'\"}}'; else echo '{\"decision\": \"allow\"}'; fi"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_FILE_PATH\" | grep -qE '(biome\\.json|oxlint\\.json|\\.eslintrc)'; then echo '{\"decision\": \"block\", \"reason\": \"Modifying linter/formatter config is not allowed. Fix the code instead.\"}'; else echo '{\"decision\": \"allow\"}'; fi"
          }
        ]
      }
    ]
  }
}
```

**后端 Python 配置（`.claude/settings.json`）：**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "uv run ruff format $CLAUDE_FILE_PATH 2>/dev/null; LINT_OUTPUT=$(uv run ruff check $CLAUDE_FILE_PATH 2>&1); if [ -n \"$LINT_OUTPUT\" ]; then echo '{\"decision\": \"allow\", \"hookSpecificOutput\": {\"additionalContext\": \"Ruff violations found:\\n'\"$LINT_OUTPUT\"'\"}}'; else echo '{\"decision\": \"allow\"}'; fi"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_FILE_PATH\" | grep -qE 'pyproject\\.toml'; then echo '{\"decision\": \"block\", \"reason\": \"Modifying pyproject.toml is not allowed via Agent. Fix the code instead.\"}'; else echo '{\"decision\": \"allow\"}'; fi"
          }
        ]
      }
    ]
  }
}
```

### 步骤 4：创建第一个 ADR

> ADR 具有不变性原则——记录"某时做了某决定及原因"，不修改只替换（supersede）。
> Agent 通过 grep 发现 ADR 是安全的，因为 ADR 带时间戳和状态标记。 — Claude Code/Codex 最佳实践

- [ ] 创建 `docs/adr/` 目录
- [ ] 创建第一个 ADR：`docs/adr/001-adopt-harness-engineering.md`

**ADR 模板（前端/后端通用）：**

```markdown
# ADR-001: 采用 Harness Engineering 实践

- **Status**: Accepted
- **Date**: 2026-03-22
- **Supersedes**: N/A

## Context

团队开始大规模使用 AI Coding Agent（Claude Code / Codex）进行开发。
需要建立系统化的 Harness 来确保 Agent 产出的代码质量和架构一致性。

## Decision

采用 Harness Engineering 实践，包括：
1. 使用 AGENTS.md 作为 Agent 的指针式入口文档（50 行以内）
2. 使用 Lefthook 管理 Pre-commit Hook，强制运行 Linter/Formatter/Type Check
3. 使用 Claude Code PostToolUse Hook 实现毫秒级反馈循环
4. 使用 ADR 记录所有架构决策
5. 所有架构约束通过机械化手段（Linter 规则、结构测试）强制执行

## Consequences

**正面**：
- Agent 在约束边界内工作，架构一致性得到保障
- 每条 Linter 规则和测试都有复利效应，在所有未来 Agent 会话中生效
- 反馈循环从人工 Review（小时）提速到 PostToolUse（毫秒）

**负面**：
- 需要前期投入时间搭建 Harness 基础设施
- 团队需要学习新的工作模式（从写代码转向设计环境）

## References

- OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World
- LangChain: Improving Deep Agents with Harness Engineering
```

### 步骤 5：建立基本测试套件

> 自验证是最关键的单一改进。强制 Agent 进入"构建→测试→验证→修复"闭环。 — LangChain Improving Deep Agents
> 每次 Agent 犯错就添加一个防止该错误的测试——测试不会撒谎，文档会腐败。 — Claude Code/Codex 最佳实践

- [ ] 安装测试框架
- [ ] 创建配置文件
- [ ] 编写第一个测试用例验证测试套件可运行

**前端 TypeScript（Vitest）：**

安装：

```bash
pnpm add -D vitest @vitest/coverage-v8
```

配置（`vitest.config.ts`）：

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.d.ts"],
    },
  },
});
```

`package.json` 中添加脚本：

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

第一个测试（`src/utils/example.test.ts`）：

```typescript
import { describe, it, expect } from "vitest";

describe("Test suite sanity check", () => {
  it("should pass basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("should verify test infrastructure works", () => {
    const result = { status: "ok", harness: "active" };
    expect(result).toHaveProperty("status", "ok");
    expect(result).toHaveProperty("harness", "active");
  });
});
```

**后端 Python（pytest）：**

安装：

```bash
uv add --dev pytest pytest-cov
```

配置（`pyproject.toml` 中添加）：

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_functions = ["test_*"]
addopts = "-v --tb=short"

[tool.coverage.run]
source = ["src"]
omit = ["tests/*"]
```

创建测试目录和第一个测试：

```bash
mkdir -p tests
touch tests/__init__.py
```

第一个测试（`tests/test_sanity.py`）：

```python
"""Sanity check to verify test infrastructure works."""


def test_basic_assertion():
    assert 1 + 1 == 2


def test_harness_infrastructure():
    result = {"status": "ok", "harness": "active"}
    assert result["status"] == "ok"
    assert result["harness"] == "active"
```

运行验证：

```bash
# 前端
pnpm test

# 后端
uv run pytest
```

### 步骤 6：验证 MVH 已正常工作

- [ ] 执行以下验证清单，确认所有组件协同工作

**验证清单：**

```bash
# 1. 确认 AGENTS.md 存在且行数 <= 50
wc -l AGENTS.md
# 预期: <= 50 行

# 2. 确认 Lefthook 已安装并激活
lefthook run pre-commit
# 预期: 所有检查通过（或报出真实代码问题）

# 3. 确认测试套件可运行
# 前端:
pnpm test
# 后端:
uv run pytest
# 预期: 全部通过

# 4. 确认 ADR 目录存在
ls docs/adr/
# 预期: 至少有 001-adopt-harness-engineering.md

# 5. 验证 Pre-commit Hook 能拦截违规
# 故意创建一个有 lint 错误的文件，尝试 commit
# 预期: Lefthook 拦截并报错

# 6. 验证 PostToolUse Hook（在 Claude Code 中）
# 启动 Claude Code，让 Agent 编辑一个文件
# 预期: 编辑后自动运行 formatter + linter，违规信息出现在 Agent 上下文中
```

**完整的目录结构确认：**

```
项目根目录/
├── AGENTS.md                    # Step 1: 指针式 Agent 入口
├── .lefthookrc.yaml             # Step 2: Pre-commit Hook 配置
├── .claude/
│   └── settings.json            # Step 3: PostToolUse Hook 配置
├── docs/
│   └── adr/
│       └── 001-adopt-harness-engineering.md  # Step 4: 第一个 ADR
├── vitest.config.ts             # Step 5 (前端): 测试配置
│   # 或 pyproject.toml          # Step 5 (后端): 测试配置
└── tests/ 或 src/**/*.test.ts   # Step 5: 测试文件
```

---

**Week 1 完成后的状态：**

你现在拥有了一个最小但完整的 Harness：

1. **Context Engineering** — AGENTS.md 为 Agent 提供精简的地图
2. **Architectural Constraints** — Pre-commit Hook + PostToolUse Hook 机械化强制执行代码质量
3. **Entropy Management** — ADR 防止决策知识腐败，测试套件防止功能回归

下一步（Week 2-4）的方向：
- 每次 Agent 犯错就添加一条 Linter 规则或一个测试
- 建立"计划→审批→执行"工作流
- 引入 E2E 测试工具
- 配置 Stop Hook 强制测试通过后才允许 Agent 结束任务

> "从简单开始。一份好的 AGENTS.md 加 Pre-commit Hook 比复杂的 Middleware 更有实际影响力。" — NxCode 完整指南


---

## 第三章：仓库结构设计

> "From the agent's point of view, anything it can't access in-context while running effectively doesn't exist."
> — Ryan Lopopolo, OpenAI

仓库是 Agent 的全部世界。Agent 无法访问 Slack 消息、Google Docs、团队成员脑中的默契——它只能看到仓库中版本化的文件。因此，仓库结构的设计质量直接决定了 Agent 的工作效能。本章从目录结构、内容取舍、指令文件设计、ADR 管理到文档层级，系统性地阐述如何构建一个 Agent-First 的仓库。

---

## 3.1 推荐目录结构

### 前端项目（TypeScript / React）

```
my-app/
├── .claude/
│   ├── settings.json          # Claude Code 配置（Hooks、权限）
│   └── rules/                 # 按场景触发的规则文件
│       ├── react-components.md
│       ├── testing.md
│       └── api-calls.md
├── CLAUDE.md                  # 50 行以内的指针式根指令
├── docs/
│   ├── adr/                   # Architecture Decision Records
│   │   ├── 001-use-react-query.md
│   │   ├── 002-no-global-state.md
│   │   └── template.md
│   ├── architecture.md        # 顶层分层地图
│   ├── domains/               # 按业务域的深层文档
│   │   ├── auth.md
│   │   └── billing.md
│   └── quality/               # 各域质量评分与差距追踪
│       └── scores.json
├── src/
│   ├── types/                 # 层 1：纯类型定义，零运行时依赖
│   │   ├── api.ts
│   │   ├── domain.ts
│   │   └── index.ts
│   ├── config/                # 层 2：配置常量，仅依赖 types
│   │   ├── env.ts
│   │   ├── routes.ts
│   │   └── feature-flags.ts
│   ├── repos/                 # 层 3：数据访问，仅依赖 types + config
│   │   ├── user.repo.ts
│   │   └── billing.repo.ts
│   ├── services/              # 层 4：业务逻辑，依赖 types + config + repos
│   │   ├── auth.service.ts
│   │   └── billing.service.ts
│   ├── providers/             # 跨切面：auth、telemetry、feature flags
│   │   ├── auth.provider.tsx
│   │   ├── telemetry.provider.tsx
│   │   └── index.tsx
│   ├── components/            # 层 5（UI）：展示组件
│   │   ├── ui/                # 原子组件
│   │   └── features/          # 业务组件
│   ├── pages/                 # 层 5（UI）：页面路由
│   │   └── dashboard/
│   └── __tests__/             # 结构测试（依赖方向验证等）
│       └── architecture.test.ts
├── scripts/
│   ├── init.sh                # 标准化开发环境启动
│   └── validate-deps.ts       # 依赖方向校验脚本
├── biome.json                 # Formatter 配置
├── oxlint.json                # Linter 配置（或 eslint.config.js）
├── tsconfig.json
├── lefthook.yml               # Pre-commit Hook 配置
└── package.json
```

### 后端项目（Python / FastAPI）

```
my-api/
├── .claude/
│   ├── settings.json
│   └── rules/
│       ├── database.md
│       ├── api-design.md
│       └── testing.md
├── CLAUDE.md                  # 50 行以内的指针式根指令
├── docs/
│   ├── adr/
│   │   ├── 001-use-sqlalchemy.md
│   │   ├── 002-event-driven-auth.md
│   │   └── template.md
│   ├── architecture.md
│   ├── domains/
│   │   ├── auth.md
│   │   └── billing.md
│   └── quality/
│       └── scores.json
├── src/
│   └── app/
│       ├── types/             # 层 1：Pydantic models、TypedDict、枚举
│       │   ├── api.py
│       │   ├── domain.py
│       │   └── __init__.py
│       ├── config/            # 层 2：Settings（pydantic-settings）、常量
│       │   ├── settings.py
│       │   ├── feature_flags.py
│       │   └── __init__.py
│       ├── repos/             # 层 3：数据访问（SQLAlchemy、Redis 等）
│       │   ├── user_repo.py
│       │   └── billing_repo.py
│       ├── services/          # 层 4：业务逻辑
│       │   ├── auth_service.py
│       │   └── billing_service.py
│       ├── providers/         # 跨切面：依赖注入容器
│       │   ├── auth.py
│       │   ├── telemetry.py
│       │   └── __init__.py
│       ├── api/               # 层 5（Runtime）：FastAPI routers
│       │   ├── v1/
│       │   │   ├── users.py
│       │   │   └── billing.py
│       │   └── deps.py        # FastAPI Depends
│       └── __init__.py
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── architecture/         # 结构测试
│       └── test_layer_deps.py
├── scripts/
│   ├── init.sh
│   └── validate_deps.py
├── pyproject.toml             # Ruff + Black + 项目配置（一体化）
├── lefthook.yml
└── uv.lock
```

> **来源**：目录分层参考 OpenAI Codex 团队的六层架构 `Types → Config → Repo → Service → Runtime → UI`（来源：01 概述）。跨切面 Providers 模式同样来自该团队实践。

---

## 3.2 什么该放仓库 vs 什么不该放

### 该放入仓库的内容

| 类别 | 示例 | 原因 |
|------|------|------|
| 可执行代码 | `src/`、`tests/` | Agent 的直接工作对象 |
| 测试 | 单元 / 集成 / E2E / 结构测试 | 不会腐败，测试不过 = 立即可见的信号 |
| Linter / Formatter 配置 | `biome.json`、`pyproject.toml` [ruff] | 确定性工具，设定变更会立即被 CI 检测 |
| 类型定义 / Schema | `.ts` 类型、Pydantic models、JSON Schema | 机器可读的契约 |
| CI 配置 | `.github/workflows/`、`.gitlab-ci.yml` | 机械化执行的流水线 |
| ADR | `docs/adr/` | 带时间戳和状态标记，Agent 可结构化判断有效性 |
| 指令文件 | `CLAUDE.md`、`AGENTS.md` | Agent 的入口地图 |
| 执行计划 | `docs/plans/` | 活跃 / 已完成 / 已知技术债，版本化集中管理 |

### 不该放入仓库的内容

| 类别 | 示例 | 原因 |
|------|------|------|
| 描述性文档 | "系统目前是这样工作的..." | 必然腐败（context rot），Agent 无法区分过时信息和当前事实 |
| 手写 API 文档 | 手动维护的 API 说明 | 应由代码自动生成（OpenAPI/TypeDoc），手写版本与实际实现必然分裂 |
| 架构概要散文 | "我们的微服务架构采用了..." | 用 `docs/architecture.md` 的分层地图 + ADR 替代，不写散文 |
| 编码风格指南 | "变量名应使用 camelCase..." | 交给 Linter 强制执行，不依赖 Agent 阅读文档后自觉遵守 |

### 核心原因

> "对 Agent 来说，仓库中可发现的旧信息与最新事实无法区分。"
> — nyosegawa（逆瀬川）研究

Agent 会将仓库内发现的所有文本视为同等权威的信息源。一份三个月前的架构说明文档，即使已经严重过时，对 Agent 来说与最新代码具有相同的可信度。这种 **Context Rot（上下文腐败）** 不仅浪费 context window，还会主动降低推理质量——Chroma 研究证实，18 个前沿模型均随上下文中无关信息的增加而性能下降。

**替代策略**：

- 用 **测试** 替代"系统行为描述"——测试不会撒谎，文档会腐败
- 用 **ADR** 替代"架构决策说明"——ADR 有状态标记和时间戳，Agent 可机械判断有效性
- 用 **类型定义 / Schema** 替代"数据格式说明"——类型是可执行的文档
- 用 **Linter 规则** 替代"编码规范文档"——每次 Agent 犯错就添加一条规则，产生复利效应

---

## 3.3 AGENTS.md / CLAUDE.md 设计原则

### 核心原则：50 行以内，指针式架构

AGENTS.md / CLAUDE.md 是 Agent 进入仓库的第一个文件。它应该是一张 **地图**，而不是一本百科全书。

> "Give Codex a map, not a 1,000-page instruction manual."
> — Ryan Lopopolo, OpenAI

**为什么要短**：

- Claude Code 系统提示本身已包含约 50 条指令
- 用户 CLAUDE.md 如果写 100 行，总指令数就已达到约 150 条
- **IFScale 研究**显示：150-200 条指令时 primacy bias 显著增强，模型对后面出现的指令遵从度开始急剧下降
- Vercel 实测：将 40KB 指令压缩到 8KB，通过率保持 100%
- 每行自问："删掉这行 Agent 会出错吗？" 答案为 No 则删除

**写什么**：
- 路由指令（"测试命令是 `npm test`"、"ADR 在 `docs/adr/`"）
- 禁止事项清单（每项引用 ADR 编号或 linter rule）
- 最少的构建/测试/部署命令

**不写什么**：
- 系统现状说明（Agent 能读代码）
- 技术栈解释（Agent 能读 `package.json` / `pyproject.toml`）
- 冗长的编码风格指南（交给 linter）

**指针型设计的额外好处**：指针失效时会产生 404 式错误（文件不存在），腐败可被机械检测。而散文式描述的腐败是静默的、不可检测的。

### 前端项目模板（TypeScript / React）

```markdown
# CLAUDE.md

## Build & Test
- Install: `npm install`
- Dev: `npm run dev`
- Test all: `npm test`
- Test single: `npm test -- --grep "test name"`
- Lint: `npx oxlint . && npx biome check .`
- Type check: `npx tsc --noEmit`

## Architecture
- Layer order: Types → Config → Repos → Services → Providers → UI
- Each layer may only import from layers to its left
- See: docs/architecture.md

## Key Directories
- Types: src/types/
- Business logic: src/services/
- API calls: src/repos/
- Components: src/components/
- Tests: src/__tests__/

## Rules (MUST follow)
- NO direct API calls outside src/repos/ — see ADR-003
- NO global mutable state — see ADR-002
- NO `any` type — enforced by tsconfig strict
- NO editing biome.json / oxlint.json / tsconfig.json
- NO `git commit --no-verify`
- All new services must have unit tests

## Decision Records
- ADRs: docs/adr/
- Template: docs/adr/template.md

## Detailed Guides (read when relevant)
- React patterns: .claude/rules/react-components.md
- Testing strategy: .claude/rules/testing.md
- API design: .claude/rules/api-calls.md
```

### 后端项目模板（Python / FastAPI）

```markdown
# CLAUDE.md

## Build & Test
- Install: `uv sync`
- Dev: `uv run uvicorn src.app.api.v1:app --reload`
- Test all: `uv run pytest`
- Test single: `uv run pytest tests/unit/test_auth.py -k "test_name"`
- Lint: `uv run ruff check .`
- Format: `uv run ruff format .`
- Type check: `uv run mypy src/`

## Architecture
- Layer order: Types → Config → Repos → Services → Providers → API
- Each layer may only import from layers to its left
- See: docs/architecture.md

## Key Directories
- Types/Models: src/app/types/
- Business logic: src/app/services/
- Data access: src/app/repos/
- API routes: src/app/api/
- Tests: tests/

## Rules (MUST follow)
- NO direct DB queries outside src/app/repos/ — see ADR-003
- NO os.getenv(); use src/app/config/settings.py — see ADR-001
- NO editing pyproject.toml [tool.ruff] section
- NO `git commit --no-verify`
- All new endpoints must have integration tests

## Decision Records
- ADRs: docs/adr/
- Template: docs/adr/template.md

## Detailed Guides (read when relevant)
- Database patterns: .claude/rules/database.md
- Testing strategy: .claude/rules/testing.md
- API design: .claude/rules/api-design.md
```

> **来源**：50 行目标和指针式架构来自 nyosegawa 的最佳实践研究（来源：07 概述）。IFScale 研究的 150 条阈值同样出自该文。Anthropic 官方建议 200 行以下为上限。

---

## 3.4 ADR 模板与管理策略

### 不可变原则

ADR（Architecture Decision Record）的核心特性是 **不可变**：一旦记录了"某时做了某决定及原因"，就不再修改。当决策需要变更时，创建新 ADR 并将旧 ADR 标记为 `Superseded`。

这一特性对 Agent 尤为重要——Agent 通过 grep 发现 ADR 时，可以通过状态标记机械地判断该决策是否仍然有效，而无需理解散文语境。

### 状态标记

| 状态 | 含义 |
|------|------|
| `Accepted` | 当前有效，必须遵守 |
| `Superseded by ADR-XXX` | 已被新决策取代，附链接到替代 ADR |
| `Deprecated` | 已弃用，不再适用 |

### Archgate 模式：ADR 绑定可执行规则

每个 ADR 可关联一个可执行的 linter 规则文件，实现"为什么"（ADR 说明决策原因）与"做什么"（linter 规则强制执行）的绑定。Agent 违反规则时，linter 错误消息直接引用 ADR 编号，形成闭环。

```
docs/adr/
├── 003-no-direct-api-calls-in-components.md   # 决策文档
└── 003-no-direct-api-calls-in-components.rules.ts  # 对应的 lint 规则
```

### 完整 ADR 模板

```markdown
# ADR-{NUMBER}: {TITLE}

- **Status**: Accepted | Superseded by ADR-XXX | Deprecated
- **Date**: YYYY-MM-DD
- **Authors**: {name}
- **Enforced by**: {linter rule name / test file path / "manual review"}

## Context

{1-3 段简述。什么问题需要决策？当时的约束和背景是什么？}

## Decision

{明确的决策陈述。用"我们将..."开头。}

## Consequences

### Positive
- {好处 1}
- {好处 2}

### Negative
- {代价 1}
- {代价 2}

### Enforcement

{如何机械化执行此决策：}
- Linter rule: `{rule-name}` in `{config-file}`
- Structure test: `{test-file-path}`
- CI check: `{workflow-name}`

## Alternatives Considered

### {Alternative A}
- Pros: ...
- Cons: ...
- Why rejected: ...
```

**使用示例**：

```markdown
# ADR-003: 禁止在 UI 组件中直接调用 API

- **Status**: Accepted
- **Date**: 2026-03-15
- **Authors**: Team Lead
- **Enforced by**: oxlint rule `no-direct-fetch-in-components`

## Context

Agent 在生成 React 组件时，频繁在组件内直接使用 fetch() 调用后端 API，
绕过了 src/repos/ 层的统一错误处理和认证头注入。导致多个组件重复实现
错误处理逻辑，且认证 token 刷新逻辑不一致。

## Decision

我们将禁止在 src/components/ 和 src/pages/ 目录下直接使用 fetch()、
axios 或任何 HTTP 客户端。所有 API 调用必须通过 src/repos/ 层的
repository 函数完成。

## Consequences

### Positive
- API 调用逻辑集中管理，错误处理和认证一致
- Agent 生成的组件更简洁，只关注展示逻辑
- API 变更只需修改 repo 层，不需要逐个修改组件

### Negative
- 简单的一次性 API 调用也需要在 repo 层创建函数

### Enforcement
- Linter rule: `no-direct-fetch-in-components` in oxlint.json
- Structure test: src/__tests__/architecture.test.ts
- CI check: lint-and-typecheck workflow
```

> **来源**：ADR 的不可变原则和 archgate 模式来自 nyosegawa 的最佳实践研究（来源：07 概述）。

---

## 3.5 文档层级：指针架构

### 渐进式披露（Progressive Disclosure）

渐进式信息披露是所有高效 Harness 的共同模式。核心思想：不要一次性给 Agent 所有信息，而是给最少的定位信息和指向更深资源的指针。

```
Agent 进入仓库
    │
    ▼
CLAUDE.md（50 行，地图）
    │
    ├──▶ docs/architecture.md（顶层分层地图，每层一行描述 + 入口路径）
    │
    ├──▶ docs/adr/（按编号索引，Agent 可 grep 状态）
    │
    ├──▶ .claude/rules/（按场景触发，Agent 仅在相关操作时加载）
    │       ├── react-components.md    # 编辑 .tsx 文件时触发
    │       ├── database.md            # 编辑 repo 层时触发
    │       └── testing.md             # 创建测试文件时触发
    │
    └──▶ docs/domains/（业务域深层文档，仅在处理特定域时读取）
            ├── auth.md
            └── billing.md
```

### docs/ 目录结构设计

```
docs/
├── architecture.md            # 顶层地图：层级定义、依赖规则、入口路径
├── adr/                       # Architecture Decision Records
│   ├── template.md            # ADR 模板
│   ├── 001-use-react-query.md
│   ├── 002-no-global-state.md
│   └── 003-no-direct-api-calls-in-components.md
├── domains/                   # 业务域上下文（仅在处理该域时读取）
│   ├── auth.md                # 认证/授权的域逻辑说明
│   ├── billing.md             # 计费的域逻辑说明
│   └── notifications.md
├── plans/                     # 执行计划（版本化的工作追踪）
│   ├── active/                # 进行中的计划
│   │   └── migrate-to-v2-api.md
│   ├── completed/             # 已完成的计划
│   │   └── setup-ci-pipeline.md
│   └── debt/                  # 已知技术债
│       └── refactor-auth-flow.md
└── quality/                   # 质量评分追踪
    └── scores.json            # 每个域/层的质量评分与差距
```

### 设计要点

1. **每个文件有明确的访问时机**：Agent 不需要在每次会话开始时读取所有文档，只在接触相关领域时按需加载
2. **docs/architecture.md 是二级地图**：比 CLAUDE.md 更详细，但仍然是结构化的（分层表格 + 依赖规则），不是散文
3. **域文档保持精简**：只记录 Agent 无法从代码中推断的业务上下文（例如"为什么认证流程需要两步验证"），不重复代码已经表达的信息
4. **plans/ 是一等公民**：执行计划 check in 到仓库中，Agent 可以读取活跃计划了解当前工作上下文，读取已完成计划了解历史决策
5. **quality/scores.json 用 JSON 而非 Markdown**：模型不当编辑 JSON 的概率低于 Markdown，且 JSON 可被脚本机械化验证

> **来源**：Progressive Disclosure 概念和"地图而非手册"原则来自 OpenAI Codex 团队实践（来源：01 概述）。执行计划作为一等公民 check in 到仓库中同样来自该团队。`quality/scores.json` 使用 JSON 格式的建议来自 nyosegawa 的研究（来源：07 概述）。

---

## 第四章：架构约束与执行

> "By enforcing invariants, not micromanaging implementations, we let agents ship fast without undermining the foundation."
> — Ryan Lopopolo, OpenAI

在 Agent-First 开发模式下，传统的人工 Code Review 无法扩展——当团队以 3.5 PR/工程师/天的速度产出时，逐行审查变得不可能。解决方案是将架构约束编码为 **机械化执行的规则**：Linter 规则、结构测试、Hooks。Agent 无法忽略 linter 错误（CI 不过），但可以忽略文档。因此，把架构约束写在错误消息里，而不是 README 中。

---

## 4.1 分层架构模式

### 六层依赖规则

```
Types → Config → Repos → Services → Runtime/API → UI
  1       2       3         4           5          6
```

**核心规则**：每层只能依赖其左侧（编号更小）的层。

| 层 | 职责 | 前端（React） | 后端（FastAPI） | 允许的依赖 |
|----|------|---------------|-----------------|-----------|
| 1. Types | 纯类型定义，零运行时 | `src/types/` | `src/app/types/` | 无（叶子节点） |
| 2. Config | 配置常量、环境变量 | `src/config/` | `src/app/config/` | Types |
| 3. Repos | 数据访问（API 调用 / DB 查询） | `src/repos/` | `src/app/repos/` | Types, Config |
| 4. Services | 业务逻辑编排 | `src/services/` | `src/app/services/` | Types, Config, Repos |
| 5. Runtime | 运行时入口 | `src/pages/` (routes) | `src/app/api/` (routers) | Types, Config, Services |
| 6. UI | 展示组件 | `src/components/` | N/A | Types, Config（不直接调 Services） |

### 跨切面关注点：Providers 接口

Auth、Telemetry、Feature Flags 等跨切面关注点不属于任何单一层级，通过统一的 **Providers** 接口注入。

**前端实现**（React Context）：

```tsx
// src/providers/index.tsx
import { AuthProvider } from './auth.provider';
import { TelemetryProvider } from './telemetry.provider';
import { FeatureFlagProvider } from './feature-flag.provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <FeatureFlagProvider>
          {children}
        </FeatureFlagProvider>
      </TelemetryProvider>
    </AuthProvider>
  );
}
```

**后端实现**（FastAPI Depends）：

```python
# src/app/providers/__init__.py
from functools import lru_cache
from src.app.providers.auth import AuthProvider
from src.app.providers.telemetry import TelemetryProvider

@lru_cache
def get_auth_provider() -> AuthProvider:
    return AuthProvider()

@lru_cache
def get_telemetry_provider() -> TelemetryProvider:
    return TelemetryProvider()

# src/app/api/deps.py
from fastapi import Depends
from src.app.providers import get_auth_provider, get_telemetry_provider

async def get_current_user(auth: AuthProvider = Depends(get_auth_provider)):
    return await auth.get_current_user()
```

> **来源**：六层架构模式 `Types → Config → Repo → Service → Runtime → UI` 和跨切面 Providers 接口来自 OpenAI Codex 团队实践（来源：01 概述）。

---

## 4.2 自定义 Linter 规则编写指南

### 错误信息设计四要素

自定义 linter 的错误消息不仅要指出违规，还要包含 Agent 自我修正所需的全部上下文。这是 OpenAI Codex 团队的关键洞察：Agent 无法忽略 linter 错误（CI 会失败），但可以忽略文档——因此把规则文档写在错误消息里。

**错误消息结构**：

```
ERROR: [什么错了]
WHY:   [为什么有此规则 + ADR 编号]
FIX:   [具体修复步骤]
EXAMPLE:
  Bad:  [错误代码]
  Good: [正确代码]
```

### 前端示例：ESLint / Oxlint 自定义规则

使用 `eslint-plugin-local-rules`（无需 npm 发布）编写项目级自定义规则：

```javascript
// eslint-local-rules/no-direct-fetch-in-components.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct API calls in component files',
    },
    messages: {
      noDirectFetch: [
        'ERROR: Direct API call ({{ callee }}) detected in component file.',
        'WHY: All API calls must go through src/repos/ for consistent error handling and auth. See ADR-003.',
        'FIX: 1) Create or find the appropriate repo in src/repos/',
        '     2) Add the API call as a method on that repo',
        '     3) Import and use the repo method here instead',
        'EXAMPLE:',
        '  Bad:  const data = await fetch("/api/users")',
        '  Good: const data = await userRepo.getUsers()',
      ].join('\n'),
    },
    schema: [],
  },
  create(context) {
    // 仅对 src/components/ 和 src/pages/ 下的文件生效
    const filePath = context.getFilename();
    if (!filePath.includes('/components/') && !filePath.includes('/pages/')) {
      return {};
    }

    return {
      CallExpression(node) {
        const callee = node.callee;

        // 检测 fetch()
        if (callee.type === 'Identifier' && callee.name === 'fetch') {
          context.report({
            node,
            messageId: 'noDirectFetch',
            data: { callee: 'fetch()' },
          });
        }

        // 检测 axios.get/post/...
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'axios'
        ) {
          context.report({
            node,
            messageId: 'noDirectFetch',
            data: { callee: `axios.${callee.property.name}()` },
          });
        }
      },
    };
  },
};
```

对于更高级的 AST 级别模式匹配，推荐使用 **ast-grep**（YAML + JS 模式定义，跨语言支持）：

```yaml
# .ast-grep/rules/no-fetch-in-components.yml
id: no-fetch-in-components
language: typescript
rule:
  pattern: fetch($$$)
  inside:
    kind: call_expression
files:
  - "src/components/**"
  - "src/pages/**"
message: |
  ERROR: Direct fetch() call in component file.
  WHY: API calls must go through src/repos/. See ADR-003.
  FIX: Move this call to the appropriate repo in src/repos/.
severity: error
```

### 后端示例：Ruff 自定义规则

Ruff 本身不支持用户自定义规则插件，但可以通过以下方式实现等效效果：

**方法 1：使用 Ruff 内置规则 + 精确配置**

```toml
# pyproject.toml
[tool.ruff.lint]
select = ["E", "W", "F", "I", "N", "UP", "S", "B", "A", "C4", "PT"]

[tool.ruff.lint.per-file-ignores]
# 禁止在 API 层直接导入 repo 的内部实现
"src/app/api/**" = []

[tool.ruff.lint.flake8-tidy-imports.banned-api]
"sqlalchemy.orm.Session".msg = """
ERROR: Direct Session import outside repos layer.
WHY: DB access must go through src/app/repos/. See ADR-003.
FIX: Use the repository pattern — inject repo via FastAPI Depends.
"""
"os.getenv".msg = """
ERROR: Direct os.getenv() call detected.
WHY: All config must go through src/app/config/settings.py. See ADR-001.
FIX: Import settings from src.app.config.settings and use settings.YOUR_VAR.
"""
```

**方法 2：自定义架构验证脚本**（作为 CI / Pre-commit 步骤运行）

```python
# scripts/validate_deps.py
"""
验证分层架构依赖方向。
违反规则时输出 Agent 友好的错误消息。

ERROR 格式：
  ERROR: [什么错了]
  WHY:   [为什么有此规则]
  FIX:   [具体修复步骤]
"""
import ast
import sys
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# 层级定义：数字越小越底层
LAYER_ORDER = {
    "types": 1,
    "config": 2,
    "repos": 3,
    "services": 4,
    "providers": 5,
    "api": 6,
}

def get_layer(file_path: Path) -> str | None:
    """从文件路径中提取所属层级。"""
    parts = file_path.parts
    for part in parts:
        if part in LAYER_ORDER:
            return part
    return None

def get_imports(file_path: Path) -> list[str]:
    """解析 Python 文件的 import 语句。"""
    try:
        tree = ast.parse(file_path.read_text())
    except SyntaxError:
        logger.warning("Syntax error in %s, skipping", file_path)
        return []

    imports = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module:
            imports.append(node.module)
        elif isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)
    return imports

def check_file(file_path: Path) -> list[str]:
    """检查单个文件的依赖方向是否合规。"""
    source_layer = get_layer(file_path)
    if source_layer is None:
        return []

    violations = []
    source_order = LAYER_ORDER[source_layer]

    for imp in get_imports(file_path):
        for layer_name, layer_order in LAYER_ORDER.items():
            if f".{layer_name}." in imp or imp.endswith(f".{layer_name}"):
                if layer_order > source_order:
                    violations.append(
                        f"ERROR: {file_path} ({source_layer}, layer {source_order}) "
                        f"imports from {layer_name} (layer {layer_order}).\n"
                        f"WHY:   Layers may only depend on lower-numbered layers. "
                        f"See docs/architecture.md.\n"
                        f"FIX:   Move the shared logic to a lower layer, or "
                        f"inject via Providers (src/app/providers/).\n"
                    )
    return violations

def main() -> int:
    src_dir = Path("src/app")
    all_violations = []

    for py_file in src_dir.rglob("*.py"):
        all_violations.extend(check_file(py_file))

    if all_violations:
        for v in all_violations:
            logger.error(v)
        logger.error(
            "Found %d layer dependency violation(s). "
            "See docs/architecture.md for the layer diagram.",
            len(all_violations),
        )
        return 1

    logger.info("All layer dependencies are valid.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

### Factory.ai 四类规则框架

在设计自定义 linter 规则时，可参考以下四类框架进行分类和优先级排序：

| 类别 | 目的 | 示例 |
|------|------|------|
| **Grep-ability** | 确保代码库可被文本搜索找到关键模式 | 禁止动态拼接 import 路径、强制使用命名导出 |
| **Glob-ability** | 确保文件命名和位置遵循可预测的模式 | 强制 `*.repo.ts` / `*.service.ts` 后缀命名 |
| **架构边界** | 强制分层依赖方向和模块隔离 | 禁止 UI 层直接调用 Repo 层、禁止跨域直接导入 |
| **安全/隐私** | 防止敏感信息泄露和不安全操作 | 禁止硬编码 API key、强制 SQL 参数化查询 |

> **来源**：错误信息四要素设计来自 OpenAI Codex 团队实践（来源：01 概述）。`eslint-plugin-local-rules` 和 ast-grep 推荐来自 nyosegawa 研究（来源：07 概述）。

---

## 4.3 防止 Agent 篡改配置

Agent 面对 linter 错误时，频繁被观察到一种行为模式：**修改 linter 配置使错误消失**，而非修复代码本身。必须通过 Hook 机制阻止这种行为。

### PreToolUse Hook：阻止编辑配置文件

在 `.claude/settings.json` 中配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hook": ".claude/hooks/protect-config.sh"
      }
    ]
  }
}
```

Hook 脚本：

```bash
#!/bin/bash
# .claude/hooks/protect-config.sh
# 阻止 Agent 编辑受保护的配置文件

# 从 stdin 读取工具调用的 JSON 参数
INPUT=$(cat)

# 提取文件路径（兼容 Edit/Write/MultiEdit 的不同参数名）
FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

# 受保护的文件列表
PROTECTED_FILES=(
  "biome.json"
  "oxlint.json"
  ".eslintrc"
  ".eslintrc.js"
  ".eslintrc.json"
  "eslint.config.js"
  "eslint.config.ts"
  "pyproject.toml"
  "tsconfig.json"
  "lefthook.yml"
  ".prettierrc"
  ".prettierrc.json"
)

BASENAME=$(basename "$FILE_PATH")

for PROTECTED in "${PROTECTED_FILES[@]}"; do
  if [ "$BASENAME" = "$PROTECTED" ]; then
    echo "BLOCKED: Editing $BASENAME is not allowed." >&2
    echo "WHY: Linter/formatter/build configs are maintained by humans only. See ADR-005." >&2
    echo "FIX: Fix the code to comply with the existing rules instead of changing the rules." >&2
    exit 2  # exit 2 = 阻止工具执行并将 stderr 反馈给 Agent
  fi
done

exit 0  # exit 0 = 允许继续
```

### 禁止 git commit --no-verify

在 `.claude/settings.json` 中：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hook": ".claude/hooks/no-skip-hooks.sh"
      }
    ]
  }
}
```

```bash
#!/bin/bash
# .claude/hooks/no-skip-hooks.sh
# 禁止 Agent 使用 --no-verify 跳过 git hooks

INPUT=$(cat)

COMMAND=$(echo "$INPUT" | grep -oE '"command"\s*:\s*"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

if echo "$COMMAND" | grep -q "\-\-no-verify"; then
  echo "BLOCKED: --no-verify is not allowed." >&2
  echo "WHY: Pre-commit hooks enforce quality gates that must not be bypassed. See ADR-005." >&2
  echo "FIX: Fix the issues reported by pre-commit hooks instead of skipping them." >&2
  exit 2
fi

exit 0
```

### 完整的 .claude/settings.json 配置示例

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hook": ".claude/hooks/protect-config.sh"
      },
      {
        "matcher": "Bash",
        "hook": ".claude/hooks/no-skip-hooks.sh"
      },
      {
        "matcher": "Bash",
        "hook": ".claude/hooks/safety-gate.sh"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hook": ".claude/hooks/auto-lint.sh"
      }
    ],
    "Stop": [
      {
        "hook": ".claude/hooks/completion-gate.sh"
      }
    ]
  }
}
```

> **来源**：Agent 修改配置而非修复代码的行为观察来自 nyosegawa 研究（来源：07 概述）。PreToolUse Hook 阻止配置编辑和禁止 `--no-verify` 的策略同样出自该文。

---

## 4.4 工具推荐表

### Linter / Formatter

| 语言 | Linter | Formatter | 速度特点 |
|------|--------|-----------|---------|
| TypeScript / JS | **Oxlint** | **Biome** | 均为 Rust 实现，Oxlint 比 ESLint 快 50-100 倍 |
| Python | **Ruff**（lint） | **Ruff**（format） | Rust 实现，集成 Flake8/isort/Black 全功能，单一二进制 |
| Go | **golangci-lint** | **gofmt**（内置） | 50+ linter 并行运行，缓存加速 |
| Rust | **Clippy**（pedantic 模式） | **rustfmt**（内置） | 需设置 `deny(allow_attributes)` 防止 Agent 静默抑制警告 |
| Swift | **SwiftLint** | **SwiftFormat** | 200+ 规则，支持 `--autocorrect` |
| Kotlin | **detekt** | **ktfmt** | ktfmt 比 ktlint 快 40% |
| 多语言自定义规则 | **ast-grep** | N/A | YAML + JS 模式定义，AST 级别匹配，跨语言 |

### Pre-commit

| 工具 | 语言 | 特点 |
|------|------|------|
| **Lefthook** | Go | 高速并行执行，配置简洁，推荐首选 |
| **Husky** | Node.js | 生态成熟，但 Node 依赖 |
| **pre-commit** | Python | 插件生态最丰富，但需 Python 运行时 |

### Lefthook 配置示例

```yaml
# lefthook.yml

pre-commit:
  parallel: true
  commands:
    # --- 前端 ---
    biome-format:
      glob: "*.{ts,tsx,js,jsx,json}"
      run: npx biome format --write {staged_files}
      stage_fixed: true

    oxlint:
      glob: "*.{ts,tsx,js,jsx}"
      run: npx oxlint {staged_files}

    typecheck:
      glob: "*.{ts,tsx}"
      run: npx tsc --noEmit

    # --- 后端 ---
    ruff-format:
      glob: "*.py"
      run: uv run ruff format {staged_files}
      stage_fixed: true

    ruff-check:
      glob: "*.py"
      run: uv run ruff check {staged_files}

    mypy:
      glob: "*.py"
      run: uv run mypy {staged_files}
```

> **来源**：工具推荐和速度特点数据来自 nyosegawa 的最佳实践研究（来源：07 概述）。Rust 实现的工具被 Agent-First 团队偏好的原因：快速反馈（PostToolUse Hook 要求毫秒级响应）和训练集中表示充分（"boring" 技术策略）。

---

## 4.5 结构测试实现

结构测试（Structural Tests）是 ArchUnit 模式在 Agent-First 场景中的应用：不测试业务逻辑的正确性，而是测试 **架构约束是否被遵守**。结构测试是确定性的、不会腐败的，且失败信息直接可操作。

### 前端结构测试（TypeScript）

```typescript
// src/__tests__/architecture.test.ts
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// 层级定义
const LAYERS: Record<string, number> = {
  types: 1,
  config: 2,
  repos: 3,
  services: 4,
  providers: 5,
  components: 6,
  pages: 6,
};

// 从 TypeScript 文件中提取 import 路径
function getImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  const imports: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

// 从 import 路径中解析目标层级
function getTargetLayer(importPath: string): string | null {
  for (const layer of Object.keys(LAYERS)) {
    if (importPath.includes(`/${layer}/`) || importPath.includes(`/${layer}`)) {
      return layer;
    }
  }
  return null;
}

// 从文件路径中解析所属层级
function getSourceLayer(filePath: string): string | null {
  for (const layer of Object.keys(LAYERS)) {
    if (filePath.includes(`/src/${layer}/`)) {
      return layer;
    }
  }
  return null;
}

// 递归获取目录下所有 .ts/.tsx 文件
function getAllTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '__tests__') {
      results.push(...getAllTsFiles(fullPath));
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Architecture Layer Dependencies', () => {
  const srcDir = path.resolve(__dirname, '../../');
  const allFiles = getAllTsFiles(srcDir);

  it('should not have upward layer dependencies', () => {
    const violations: string[] = [];

    for (const file of allFiles) {
      const sourceLayer = getSourceLayer(file);
      if (!sourceLayer || !(sourceLayer in LAYERS)) continue;

      const sourceOrder = LAYERS[sourceLayer];
      const imports = getImports(file);

      for (const imp of imports) {
        const targetLayer = getTargetLayer(imp);
        if (!targetLayer || !(targetLayer in LAYERS)) continue;

        const targetOrder = LAYERS[targetLayer];
        if (targetOrder > sourceOrder) {
          violations.push(
            `${path.relative(srcDir, file)} (${sourceLayer}, layer ${sourceOrder}) ` +
            `imports from ${targetLayer} (layer ${targetOrder})`
          );
        }
      }
    }

    if (violations.length > 0) {
      const message = [
        `Found ${violations.length} layer violation(s):`,
        '',
        ...violations.map((v) => `  - ${v}`),
        '',
        'WHY: Each layer may only import from layers with a lower number.',
        '     Types(1) → Config(2) → Repos(3) → Services(4) → Providers(5) → UI(6)',
        'FIX: Move shared logic to a lower layer, or use Providers for cross-cutting concerns.',
        'REF: docs/architecture.md',
      ].join('\n');
      expect.fail(message);
    }
  });

  it('should not have direct API calls in component files', () => {
    const componentFiles = allFiles.filter(
      (f) => f.includes('/components/') || f.includes('/pages/')
    );
    const violations: string[] = [];

    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/\bfetch\s*\(/.test(content) || /\baxios\b/.test(content)) {
        violations.push(path.relative(srcDir, file));
      }
    }

    if (violations.length > 0) {
      const message = [
        `Found ${violations.length} direct API call(s) in components:`,
        '',
        ...violations.map((v) => `  - ${v}`),
        '',
        'WHY: API calls must go through src/repos/ for consistent error handling. See ADR-003.',
        'FIX: Move the API call to the appropriate repo file in src/repos/.',
      ].join('\n');
      expect.fail(message);
    }
  });

  it('should enforce file naming conventions', () => {
    const violations: string[] = [];

    // Repos 必须以 .repo.ts 结尾
    const repoFiles = getAllTsFiles(path.join(srcDir, 'repos'));
    for (const file of repoFiles) {
      if (!file.endsWith('.repo.ts') && !file.endsWith('index.ts')) {
        violations.push(`${path.relative(srcDir, file)} — repo files must end with .repo.ts`);
      }
    }

    // Services 必须以 .service.ts 结尾
    const serviceFiles = getAllTsFiles(path.join(srcDir, 'services'));
    for (const file of serviceFiles) {
      if (!file.endsWith('.service.ts') && !file.endsWith('index.ts')) {
        violations.push(`${path.relative(srcDir, file)} — service files must end with .service.ts`);
      }
    }

    if (violations.length > 0) {
      const message = [
        `Found ${violations.length} naming violation(s):`,
        '',
        ...violations.map((v) => `  - ${v}`),
        '',
        'WHY: Consistent naming enables glob-based tooling and Agent navigation. See ADR-004.',
        'FIX: Rename files to follow the pattern: *.repo.ts, *.service.ts.',
      ].join('\n');
      expect.fail(message);
    }
  });
});
```

### 后端结构测试（Python）

```python
# tests/architecture/test_layer_deps.py
"""
架构分层依赖测试。
验证 src/app/ 下的模块遵守 Types → Config → Repos → Services → Providers → API 的依赖方向。
"""
import ast
import logging
from pathlib import Path

import pytest

logger = logging.getLogger(__name__)

LAYER_ORDER = {
    "types": 1,
    "config": 2,
    "repos": 3,
    "services": 4,
    "providers": 5,
    "api": 6,
}

SRC_ROOT = Path(__file__).resolve().parent.parent.parent / "src" / "app"


def _get_layer(file_path: Path) -> str | None:
    """从文件路径提取所属层级。"""
    for part in file_path.parts:
        if part in LAYER_ORDER:
            return part
    return None


def _get_imports(file_path: Path) -> list[str]:
    """解析 Python 文件的 import 语句。"""
    try:
        tree = ast.parse(file_path.read_text())
    except SyntaxError:
        logger.warning("Syntax error in %s, skipping", file_path)
        return []

    imports: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module:
            imports.append(node.module)
        elif isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)
    return imports


def _collect_violations() -> list[str]:
    """扫描所有 Python 文件，收集依赖方向违规。"""
    violations: list[str] = []

    for py_file in SRC_ROOT.rglob("*.py"):
        source_layer = _get_layer(py_file)
        if source_layer is None:
            continue

        source_order = LAYER_ORDER[source_layer]

        for imp in _get_imports(py_file):
            for layer_name, layer_order in LAYER_ORDER.items():
                if f".{layer_name}." in imp or imp.endswith(f".{layer_name}"):
                    if layer_order > source_order:
                        rel_path = py_file.relative_to(SRC_ROOT.parent.parent)
                        violations.append(
                            f"  {rel_path} ({source_layer}, layer {source_order}) "
                            f"imports from {layer_name} (layer {layer_order})"
                        )
    return violations


class TestLayerDependencies:
    """验证分层架构的依赖方向。"""

    def test_no_upward_dependencies(self) -> None:
        """层级只能依赖编号更小（更底层）的层级。"""
        violations = _collect_violations()

        if violations:
            message = "\n".join(
                [
                    f"Found {len(violations)} layer dependency violation(s):",
                    "",
                    *violations,
                    "",
                    "WHY: Each layer may only import from layers with a lower number.",
                    "     Types(1) → Config(2) → Repos(3) → Services(4) → Providers(5) → API(6)",
                    "FIX: Move shared logic to a lower layer, or inject via Providers.",
                    "REF: docs/architecture.md",
                ]
            )
            pytest.fail(message)

    def test_no_direct_db_in_api_layer(self) -> None:
        """API 层不应直接使用 SQLAlchemy Session。"""
        api_dir = SRC_ROOT / "api"
        if not api_dir.exists():
            pytest.skip("No api directory found")

        violations: list[str] = []
        for py_file in api_dir.rglob("*.py"):
            content = py_file.read_text()
            if "sqlalchemy" in content.lower() and "Session" in content:
                rel_path = py_file.relative_to(SRC_ROOT.parent.parent)
                violations.append(f"  {rel_path}")

        if violations:
            message = "\n".join(
                [
                    f"Found {len(violations)} direct DB access(es) in API layer:",
                    "",
                    *violations,
                    "",
                    "WHY: DB access must go through src/app/repos/. See ADR-003.",
                    "FIX: Inject the repo via FastAPI Depends instead of using Session directly.",
                ]
            )
            pytest.fail(message)

    def test_no_os_getenv(self) -> None:
        """禁止在任何位置使用 os.getenv，必须通过 config/settings.py。"""
        violations: list[str] = []

        for py_file in SRC_ROOT.rglob("*.py"):
            # config 层本身可以使用 os.getenv（通过 pydantic-settings）
            if "config" in py_file.parts:
                continue

            content = py_file.read_text()
            if "os.getenv" in content or "os.environ" in content:
                rel_path = py_file.relative_to(SRC_ROOT.parent.parent)
                violations.append(f"  {rel_path}")

        if violations:
            message = "\n".join(
                [
                    f"Found {len(violations)} direct env access(es):",
                    "",
                    *violations,
                    "",
                    "WHY: All config must go through src/app/config/settings.py. See ADR-001.",
                    "FIX: Add the variable to Settings class and import from config.",
                ]
            )
            pytest.fail(message)

    def test_file_naming_conventions(self) -> None:
        """验证文件命名遵循约定：*_repo.py, *_service.py。"""
        violations: list[str] = []

        # Repos 必须以 _repo.py 结尾
        repos_dir = SRC_ROOT / "repos"
        if repos_dir.exists():
            for py_file in repos_dir.glob("*.py"):
                if py_file.name == "__init__.py":
                    continue
                if not py_file.name.endswith("_repo.py"):
                    violations.append(
                        f"  {py_file.name} in repos/ — must end with _repo.py"
                    )

        # Services 必须以 _service.py 结尾
        services_dir = SRC_ROOT / "services"
        if services_dir.exists():
            for py_file in services_dir.glob("*.py"):
                if py_file.name == "__init__.py":
                    continue
                if not py_file.name.endswith("_service.py"):
                    violations.append(
                        f"  {py_file.name} in services/ — must end with _service.py"
                    )

        if violations:
            message = "\n".join(
                [
                    f"Found {len(violations)} naming violation(s):",
                    "",
                    *violations,
                    "",
                    "WHY: Consistent naming enables glob-based tooling and Agent navigation.",
                    "FIX: Rename to *_repo.py or *_service.py as appropriate.",
                    "REF: ADR-004",
                ]
            )
            pytest.fail(message)
```

### 在 CI 中集成

```yaml
# .github/workflows/architecture.yml
name: Architecture Checks

on: [push, pull_request]

jobs:
  structure-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # --- 前端 ---
      - name: Run frontend architecture tests
        run: npx vitest run src/__tests__/architecture.test.ts

      # --- 后端 ---
      - name: Run backend architecture tests
        run: uv run pytest tests/architecture/ -v

      # --- 依赖方向验证脚本 ---
      - name: Validate layer dependencies
        run: uv run python scripts/validate_deps.py
```

> **来源**：ArchUnit 模式和机械化架构约束来自 OpenAI Codex 团队实践——"自定义 linter（Codex 生成）和结构测试机械化执行约束"（来源：01 概述）。Agent 友好的错误消息格式（ERROR/WHY/FIX）来自同一团队的"linter 错误消息中注入修复指引，直接进入 agent 上下文"实践。四类规则框架（Grep-ability, Glob-ability, 架构边界, 安全/隐私）源自 Factory.ai 的分类体系。


---

# Harness Engineering 实操手册

---

## 第五章：反馈循环系统

反馈循环是 Harness Engineering 的核心引擎。LangChain 团队仅通过优化反馈循环（不更换模型），就在 Terminal Bench 2.0 上将得分从 52.8% 提升到 66.5%，排名从 Top 30 跃升至 Top 5。本章系统性地介绍如何构建从毫秒到小时的多层反馈架构，让 Agent 在每个环节都能获得即时、准确的质量信号。

> "在 CLAUDE.md 中写'请运行 linter'与用 Hook 运行 linter 之间，是'几乎每次'与'绝无例外每次'的差别。在生产系统中这个差别是致命的。"
> — 逆瀬川 (@gyakuse)

---

### 5.0 为什么代码库是最后被闭合的层级

George (@odysseus0z) 从控制论视角指出：代码库中的反馈循环其实一直存在，但只在较低的层级完成了闭环。LLM 的突破不是"又加了一层"，而是**第一次在架构判断层级同时提供了传感器（感知质量）和执行器（修复代码）**。

| 层级 | 传感器 | 执行器 | 闭合状态 |
|------|--------|--------|---------|
| 语法 | 编译器 | 编译错误提示 | 早已闭合 |
| 行为 | 测试套件 | 测试失败报告 | 早已闭合 |
| 风格 | Linter | 自动修复建议 | 早已闭合 |
| **架构** | **LLM 感知** | **LLM 重构** | **2026 年首次闭合** |

这之上的问题——"这个改动是否符合系统架构？这个抽象会不会造成问题？"——以前只有人类能判断。LLM 同时改变了两端，使得 Harness Engineering 成为可能。

但闭合回路只是必要条件。瓦特的调速器需要调校，Kubernetes 控制器需要正确的规格，Agent 则需要更难提供的东西：**用你系统特有的知识校准传感器和执行器**。基本反馈循环（测试、CI、错误消息）是入门；用架构文档、自定义 Linter 规则（含修复指引）和 ADR 来校准它们，才是真正的工作。

> 来源：George (@odysseus0z),《Harness Engineering Is Cybernetics》, 2026-03-07

---

### 5.1 四层反馈架构

反馈速度决定质量。核心原则是：**尽可能将检查移到更快的层级**。

| 层级 | 速度 | 机制 | 作用 | 触发时机 |
|------|------|------|------|----------|
| 第一层 | 毫秒级 | PostToolUse Hook | 自动格式化 + 快速 lint | Agent 每次编辑文件后 |
| 第二层 | 秒级 | Pre-commit Hook | 全文件 lint + 类型检查 | Agent 执行 `git commit` 时 |
| 第三层 | 分钟级 | CI/CD | 深度分析 + 完整测试套件 | 代码推送到远程仓库时 |
| 第四层 | 小时级 | 人工 Review | 架构判断 + 业务逻辑审查 | PR 创建后 |

**为什么顺序重要？**

- **毫秒级反馈**在 Agent 注意到问题之前就解决了它——Agent 甚至不会在上下文窗口中看到格式错误
- **秒级反馈**在 Agent 试图提交时拦截，Agent 可以在同一会话中立即修复
- **分钟级反馈**在 CI 中捕获跨文件的集成问题，但 Agent 可能需要重新启动会话
- **小时级反馈**捕获机器无法判断的架构和业务问题，成本最高

每向上推迟一层，修复成本就增加一个数量级。一个在 PostToolUse Hook 中被自动修复的格式问题，如果推迟到人工 Review 阶段，就变成了一条 Review 评论、一次来回沟通、一次代码修改和一次重新 Review。

**每种语言的推荐配置：**

**前端（TypeScript/JavaScript）：**

| 层级 | 工具 |
|------|------|
| PostToolUse | Biome format + Oxlint --fix |
| Pre-commit | Oxlint（全规则）+ tsc --noEmit |
| CI | 完整 Playwright 测试套件 |
| 自定义规则 | ast-grep / eslint-plugin-local-rules |

**后端（Python）：**

| 层级 | 工具 |
|------|------|
| PostToolUse | Ruff format + Ruff check --fix |
| Pre-commit | Ruff check（全规则）+ mypy / pyright |
| CI | 完整 pytest 测试套件 |
| 自定义规则 | ast-grep / Ruff 自定义规则 |

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— 多层反馈架构

---

### 5.2 Hook 系统详解（Claude Code）

Claude Code 的 Hook 系统是 Agent 生命周期中特定节点自动执行的 Shell 命令或子 Agent，类似 Git Hooks，但作用于 Claude Code 的所有操作——文件写入、Bash 执行、Agent 判断——的 before/after。

Hook 通过 `.claude/settings.json` 配置。以下逐一讲解四种 Hook 类型。

---

#### 5.2.1 PreToolUse Hook（安全门）

**目的：** 在 Agent 执行工具调用之前拦截危险操作。Exit code 2 表示阻止操作，stderr 内容会反馈给 Agent。

**典型用途：**
- 阻止破坏性命令（`rm -rf`、`DROP TABLE`、`TRUNCATE`）
- 阻止编辑敏感文件（`.env`、`.env.local`、密钥文件）
- 阻止修改 Linter/CI 配置文件（防止 Agent 为绕过 lint 错误而修改规则）

**为什么要保护 Linter 配置？** Agent 面对 linter 错误时，频繁被观察到会选择修改配置文件而非修复代码——这是一条阻力最小的路径，但完全违背了 Harness 的设计意图。

**完整配置示例：**

`.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/project/.claude/hooks/pre-bash-safety.sh"
          }
        ]
      },
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/project/.claude/hooks/pre-edit-protect.sh"
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/pre-bash-safety.sh`（阻止危险 Bash 命令）：

```bash
#!/usr/bin/env bash
# PreToolUse Safety Gate: 阻止破坏性 Bash 命令
# Exit 0 = 放行, Exit 2 = 阻止（stderr 反馈给 Agent）

set -euo pipefail

# 从 stdin 读取 JSON 输入
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# 危险命令模式列表
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \."
  "DROP TABLE"
  "DROP DATABASE"
  "TRUNCATE"
  "mkfs\."
  "> /dev/sda"
  "chmod -R 777"
  ":(){ :|:& };:"
)

COMMAND_UPPER=$(echo "$COMMAND" | tr '[:lower:]' '[:upper:]')

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  PATTERN_UPPER=$(echo "$pattern" | tr '[:lower:]' '[:upper:]')
  if [[ "$COMMAND_UPPER" == *"$PATTERN_UPPER"* ]]; then
    echo "BLOCKED: 检测到危险命令模式 '$pattern'" >&2
    echo "如果你确实需要执行此操作，请向用户确认。" >&2
    exit 2
  fi
done

exit 0
```

`.claude/hooks/pre-edit-protect.sh`（保护关键配置文件）：

```bash
#!/usr/bin/env bash
# PreToolUse Safety Gate: 阻止编辑受保护文件
# Exit 0 = 放行, Exit 2 = 阻止

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

BASENAME=$(basename "$FILE_PATH")

# ---- 前端受保护文件 ----
FRONTEND_PROTECTED=(
  "biome.json"
  "biome.jsonc"
  ".eslintrc"
  ".eslintrc.js"
  ".eslintrc.json"
  ".eslintrc.cjs"
  "eslint.config.js"
  "eslint.config.mjs"
  "eslint.config.ts"
  ".prettierrc"
  ".prettierrc.js"
  "prettier.config.js"
  "tsconfig.json"
  "tsconfig.base.json"
)

# ---- 后端受保护文件 ----
BACKEND_PROTECTED=(
  "pyproject.toml"
  "setup.cfg"
  ".flake8"
  "mypy.ini"
  ".mypy.ini"
  "ruff.toml"
)

# ---- 通用受保护文件 ----
COMMON_PROTECTED=(
  ".env"
  ".env.local"
  ".env.production"
  ".env.staging"
  ".github/workflows"
  ".gitlab-ci.yml"
  "Dockerfile"
  "docker-compose.yml"
  "docker-compose.yaml"
  "lefthook.yml"
  ".pre-commit-config.yaml"
)

ALL_PROTECTED=("${FRONTEND_PROTECTED[@]}" "${BACKEND_PROTECTED[@]}" "${COMMON_PROTECTED[@]}")

for protected in "${ALL_PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$protected"* ]]; then
    echo "BLOCKED: '$FILE_PATH' 是受保护文件。" >&2
    echo "Linter/CI 配置不应被 Agent 修改。请修复代码以符合现有规则，而非修改规则。" >&2
    exit 2
  fi
done

exit 0
```

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— Safety Gates + Linter 配置保护

---

#### 5.2.2 PostToolUse Hook（质量循环）

**目的：** 在 Agent 完成文件编辑后，自动运行 linter/formatter，并将结果注入 Agent 的上下文窗口，驱动即时自我修正。

**核心机制：**
1. Agent 编辑文件
2. Hook 自动运行 formatter（自动修复格式问题）
3. Hook 运行 linter（检测逻辑/风格问题）
4. 如果有残余违规，通过 `hookSpecificOutput.additionalContext` 以 **JSON 格式** 返回给 Agent
5. Agent 在同一上下文窗口中读取反馈并自我修正

**关键细节：普通 stdout 不会被当作 `additionalContext`。** 必须返回符合 Claude Code 文档规范的 JSON 结构。

**前端示例（TypeScript/JavaScript）：**

`.claude/hooks/post-edit-lint-frontend.sh`：

```bash
#!/usr/bin/env bash
# PostToolUse Quality Loop: 前端文件编辑后自动 lint
# 返回结构化 JSON，通过 additionalContext 注入 Agent 上下文

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 仅处理前端文件
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs) ;;
  *) exit 0 ;;
esac

# 检查文件是否存在（可能是删除操作）
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

VIOLATIONS=""

# 第一步：自动格式化（静默修复，40-50% 的问题在此解决）
npx biome format --write "$FILE_PATH" 2>/dev/null || true

# 第二步：运行 linter 并尝试自动修复
npx oxlint --fix "$FILE_PATH" 2>/dev/null || true

# 第三步：收集残余违规
LINT_OUTPUT=$(npx oxlint "$FILE_PATH" 2>&1) || true
LINT_EXIT=$?

if [ $LINT_EXIT -ne 0 ] && [ -n "$LINT_OUTPUT" ]; then
  # 将违规信息结构化为 JSON
  ESCAPED_OUTPUT=$(echo "$LINT_OUTPUT" | jq -Rs .)
  VIOLATIONS="$ESCAPED_OUTPUT"
fi

# 第四步：TypeScript 类型检查（仅检查，不修复）
TSC_OUTPUT=$(npx tsc --noEmit --pretty false 2>&1 | grep "$FILE_PATH" || true)

if [ -n "$TSC_OUTPUT" ]; then
  ESCAPED_TSC=$(echo "$TSC_OUTPUT" | jq -Rs .)
  if [ -n "$VIOLATIONS" ]; then
    VIOLATIONS="$(echo "$VIOLATIONS" | jq -r .) TypeErrors: $(echo "$ESCAPED_TSC" | jq -r .)"
    VIOLATIONS=$(echo "$VIOLATIONS" | jq -Rs .)
  else
    VIOLATIONS="$ESCAPED_TSC"
  fi
fi

# 第五步：返回结构化 JSON
if [ -n "$VIOLATIONS" ]; then
  cat <<EOF
{
  "hookSpecificOutput": {
    "additionalContext": "Lint/Type violations found in $FILE_PATH after your edit. Please fix these issues:\n$(echo "$VIOLATIONS" | jq -r .)"
  }
}
EOF
else
  cat <<EOF
{
  "hookSpecificOutput": {
    "additionalContext": "All lint and type checks passed for $FILE_PATH."
  }
}
EOF
fi

exit 0
```

**后端示例（Python）：**

`.claude/hooks/post-edit-lint-backend.sh`：

```bash
#!/usr/bin/env bash
# PostToolUse Quality Loop: Python 文件编辑后自动 lint
# 返回结构化 JSON，通过 additionalContext 注入 Agent 上下文

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 仅处理 Python 文件
case "$FILE_PATH" in
  *.py) ;;
  *) exit 0 ;;
esac

if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

VIOLATIONS=""

# 第一步：自动格式化（Ruff format 静默修复）
ruff format "$FILE_PATH" 2>/dev/null || true

# 第二步：运行 linter 并尝试自动修复
ruff check --fix "$FILE_PATH" 2>/dev/null || true

# 第三步：收集残余违规
LINT_OUTPUT=$(ruff check "$FILE_PATH" 2>&1) || true
LINT_EXIT=$?

if [ $LINT_EXIT -ne 0 ] && [ -n "$LINT_OUTPUT" ]; then
  ESCAPED_OUTPUT=$(echo "$LINT_OUTPUT" | jq -Rs .)
  VIOLATIONS="$ESCAPED_OUTPUT"
fi

# 第四步：类型检查（可选，取消注释启用）
# MYPY_OUTPUT=$(mypy "$FILE_PATH" --no-error-summary 2>&1 | head -20 || true)
# if [ -n "$MYPY_OUTPUT" ] && [[ "$MYPY_OUTPUT" == *"error"* ]]; then
#   ESCAPED_MYPY=$(echo "$MYPY_OUTPUT" | jq -Rs .)
#   if [ -n "$VIOLATIONS" ]; then
#     VIOLATIONS="$(echo "$VIOLATIONS" | jq -r .) TypeErrors: $(echo "$ESCAPED_MYPY" | jq -r .)"
#     VIOLATIONS=$(echo "$VIOLATIONS" | jq -Rs .)
#   else
#     VIOLATIONS="$ESCAPED_MYPY"
#   fi
# fi

# 第五步：返回结构化 JSON
if [ -n "$VIOLATIONS" ]; then
  cat <<EOF
{
  "hookSpecificOutput": {
    "additionalContext": "Ruff violations found in $FILE_PATH after your edit. Please fix these issues:\n$(echo "$VIOLATIONS" | jq -r .)"
  }
}
EOF
else
  cat <<EOF
{
  "hookSpecificOutput": {
    "additionalContext": "All Ruff checks passed for $FILE_PATH."
  }
}
EOF
fi

exit 0
```

**settings.json 配置：**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/project/.claude/hooks/post-edit-lint-frontend.sh"
          },
          {
            "type": "command",
            "command": "bash /path/to/project/.claude/hooks/post-edit-lint-backend.sh"
          }
        ]
      }
    ]
  }
}
```

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— Quality Loops / Plankton 模式

---

#### 5.2.3 Stop Hook（完成验证门）

**目的：** 当 Agent 声称"完成"并准备退出时，运行测试套件验证。测试不通过则阻止退出，强制 Agent 继续修复。

**为什么需要 Stop Hook？** LangChain 团队在 Trace 分析中发现，Agent 最常见的失败模式是写完代码后"自我确认没问题"就停止了，缺乏真正的测试验证。Stop Hook 用机制强制验证，而非依赖提示词。

**防止无限循环的关键：** 使用 `stop_hook_active` flag 文件。如果 Stop Hook 运行测试失败，Agent 会尝试修复并再次退出。为防止 Agent 陷入"修复-失败-修复-失败"的无限循环，在 Hook 首次触发时创建 flag 文件，后续触发时检测到 flag 则直接放行。

`.claude/hooks/stop-verify.sh`：

```bash
#!/usr/bin/env bash
# Stop Hook: Agent 退出前强制运行测试
# Exit 0 = 允许退出, Exit 2 = 阻止退出（stderr 反馈给 Agent）

set -euo pipefail

PROJECT_ROOT="/path/to/project"
FLAG_FILE="$PROJECT_ROOT/.claude/stop_hook_active"

# 防止无限循环：如果 flag 已存在，说明是第二次触发，放行
if [ -f "$FLAG_FILE" ]; then
  rm -f "$FLAG_FILE"
  exit 0
fi

# 创建 flag，标记本次验证
touch "$FLAG_FILE"

# ---- 前端测试 ----
if [ -f "$PROJECT_ROOT/package.json" ]; then
  # 类型检查
  TSC_OUTPUT=$(cd "$PROJECT_ROOT" && npx tsc --noEmit 2>&1) || true
  TSC_EXIT=$?

  if [ $TSC_EXIT -ne 0 ]; then
    echo "STOP BLOCKED: TypeScript 类型检查失败。请修复以下错误后再退出：" >&2
    echo "$TSC_OUTPUT" | head -30 >&2
    exit 2
  fi

  # 单元测试（如果存在）
  if grep -q '"test"' "$PROJECT_ROOT/package.json"; then
    TEST_OUTPUT=$(cd "$PROJECT_ROOT" && npm test -- --watchAll=false 2>&1) || true
    TEST_EXIT=$?

    if [ $TEST_EXIT -ne 0 ]; then
      echo "STOP BLOCKED: 测试未通过。请修复以下失败的测试：" >&2
      echo "$TEST_OUTPUT" | tail -30 >&2
      exit 2
    fi
  fi
fi

# ---- 后端测试 ----
if [ -f "$PROJECT_ROOT/pyproject.toml" ] || [ -f "$PROJECT_ROOT/setup.py" ]; then
  # Ruff 检查
  RUFF_OUTPUT=$(cd "$PROJECT_ROOT" && ruff check . 2>&1) || true
  RUFF_EXIT=$?

  if [ $RUFF_EXIT -ne 0 ]; then
    echo "STOP BLOCKED: Ruff 检查未通过。请修复以下违规：" >&2
    echo "$RUFF_OUTPUT" | head -30 >&2
    exit 2
  fi

  # pytest（如果存在）
  if [ -d "$PROJECT_ROOT/tests" ]; then
    PYTEST_OUTPUT=$(cd "$PROJECT_ROOT" && python -m pytest tests/ -x --tb=short 2>&1) || true
    PYTEST_EXIT=$?

    if [ $PYTEST_EXIT -ne 0 ]; then
      echo "STOP BLOCKED: pytest 测试未通过。请修复以下失败的测试：" >&2
      echo "$PYTEST_OUTPUT" | tail -30 >&2
      exit 2
    fi
  fi
fi

# 全部通过，清理 flag，允许退出
rm -f "$FLAG_FILE"
exit 0
```

**settings.json 配置：**

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/project/.claude/hooks/stop-verify.sh"
          }
        ]
      }
    ]
  }
}
```

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— Completion Gates；LangChain《改进深度 Agent》— 自验证循环

---

#### 5.2.4 PreCompact Hook（上下文观测）

**目的：** 当 Claude Code 即将压缩（compact）上下文窗口时，保护关键信息不被丢弃。

**背景：** Context Rot 是 Agent 系统面临的核心挑战——Chroma 研究证实 18 个前沿模型均随上下文长度增加而性能下降。当上下文接近填满时，Claude Code 会执行 Compaction（压缩），智能地卸载和总结现有上下文。PreCompact Hook 让你在压缩前注入必须保留的信息。

`.claude/hooks/pre-compact-preserve.sh`：

```bash
#!/usr/bin/env bash
# PreCompact Hook: 上下文压缩前保护关键信息
# 将关键上下文信息写入 stdout，作为压缩时的保留信号

set -euo pipefail

PROJECT_ROOT="/path/to/project"

echo "=== CRITICAL CONTEXT - DO NOT DISCARD ==="

# 保留当前任务目标
if [ -f "$PROJECT_ROOT/.claude/current_task.md" ]; then
  echo "--- Current Task ---"
  cat "$PROJECT_ROOT/.claude/current_task.md"
fi

# 保留已知约束
if [ -f "$PROJECT_ROOT/.claude/constraints.md" ]; then
  echo "--- Constraints ---"
  cat "$PROJECT_ROOT/.claude/constraints.md"
fi

# 保留进度状态
if [ -f "$PROJECT_ROOT/.claude/progress.json" ]; then
  echo "--- Progress ---"
  cat "$PROJECT_ROOT/.claude/progress.json"
fi

# 保留最近的 Git 日志作为上下文
echo "--- Recent Changes ---"
cd "$PROJECT_ROOT" && git log --oneline -10 2>/dev/null || echo "No git history"

echo "=== END CRITICAL CONTEXT ==="

exit 0
```

**settings.json 配置：**

```json
{
  "hooks": {
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/project/.claude/hooks/pre-compact-preserve.sh"
          }
        ]
      }
    ]
  }
}
```

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— Observability；Viv (LangChain)《Agent Harness 剖析》— Context Rot / Compaction

---

### 5.3 自验证循环（LangChain 模式）

LangChain 团队在 Terminal Bench 2.0 的改进中发现，**自验证是最重要的单一改进**。Agent 最常见的失败不是写错代码，而是写完代码后"自我确认没问题"就停止了。

#### Plan -> Build -> Verify -> Fix 四步循环

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   1. PLAN (Planning & Discovery)                     │
│      - 阅读任务规范                                    │
│      - 扫描代码库结构                                   │
│      - 制定实现计划和验证方案                             │
│                    │                                  │
│                    v                                  │
│   2. BUILD                                           │
│      - 围绕验证进行实现                                  │
│      - 编写测试覆盖 happy path 和 edge case            │
│                    │                                  │
│                    v                                  │
│   3. VERIFY                                          │
│      - 运行测试，阅读完整输出                             │
│      - 对照任务规范（而非自己的代码）进行验证               │
│                    │                                  │
│              Pass? │                                  │
│           ┌───Yes──┴──No───┐                          │
│           v                v                          │
│       [完成]          4. FIX                           │
│                      - 分析错误根因                     │
│                      - 回顾原始规范                     │
│                      - 修复问题                        │
│                      - 回到 VERIFY                    │
│                           │                           │
│                           └───────> (回到 VERIFY)      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### PreCompletionChecklistMiddleware 实现

在 LangChain 的框架中，这通过 Middleware 实现——Agent 宣称完成时自动拦截，提醒其进行验证：

```python
class PreCompletionChecklistMiddleware:
    """
    在 Agent 声称完成时拦截，强制执行验证清单。
    核心理念：强制验证，而非信任自我声明。
    """

    CHECKLIST = [
        "1. 你是否运行了所有相关测试？列出测试结果。",
        "2. 你的实现是否满足原始任务规范的每一条要求？逐条对照。",
        "3. 是否有未处理的 edge case？",
        "4. 是否有引入的 linter/类型检查错误？",
        "5. 如果任务涉及 UI，是否进行了视觉验证？",
    ]

    def on_before_completion(self, agent_state):
        """Agent 试图完成时触发"""
        # 检查 Agent 是否真正运行了测试
        if not agent_state.has_run_tests:
            return {
                "block": True,
                "message": (
                    "你声称任务完成，但尚未运行测试。"
                    "请先运行测试套件并确认所有测试通过，"
                    "然后对照以下清单逐条检查：\n"
                    + "\n".join(self.CHECKLIST)
                ),
            }

        # 检查测试是否全部通过
        if agent_state.last_test_result.failures > 0:
            return {
                "block": True,
                "message": (
                    f"测试套件有 {agent_state.last_test_result.failures} 个失败。"
                    "请修复所有失败的测试后再声称完成。"
                ),
            }

        return {"block": False}
```

**关键洞察：** 验证必须对照**原始任务规范**，而非 Agent 自己写的代码。Agent 倾向于验证"我写的代码是否按我写的方式运行"，而非"我写的代码是否满足用户的需求"。

> **来源**: LangChain《改进深度 Agent》— 自验证四步法 + PreCompletionChecklistMiddleware

---

### 5.4 Ralph Loop 实现

Ralph Loop（全称 Ralph Wiggum Loop）是一种强制 Agent 在多个上下文窗口中持续工作的 Harness 模式。当 Agent 试图退出时，Hook 拦截退出，在干净的上下文窗口中重新注入原始 Prompt，强制 Agent 继续工作。

#### 工作原理

```
┌─────────────────────────────────────────┐
│  会话 1                                  │
│  ┌─────────────────────┐                │
│  │ 注入原始 Prompt      │                │
│  │ Agent 开始工作       │                │
│  │ 编辑文件、运行测试    │                │
│  │ Agent 声称完成       │                │
│  │ Stop Hook 拦截       │──> 状态持久化  │
│  └─────────────────────┘    到文件系统    │
└──────────────────────────────────────────┘
                │
                v (上下文窗口快满 / 需要新视角)
┌──────────────────────────────────────────┐
│  会话 2（干净上下文）                       │
│  ┌─────────────────────┐                 │
│  │ 重新注入原始 Prompt   │                │
│  │ 读取上一次的状态文件   │                │
│  │ 从断点继续工作        │                │
│  │ ...                  │                │
│  └─────────────────────┘                 │
└──────────────────────────────────────────┘
```

#### 文件系统实现状态持久化

Ralph Loop 的核心在于文件系统——它使跨会话的状态持久化成为可能。每次迭代都在干净的上下文中启动，但通过读取文件系统中的状态文件恢复上一次的工作进度。

`.claude/ralph-state.json` 示例：

```json
{
  "original_prompt": "实现用户注册功能，包含邮箱验证和密码强度检查",
  "iteration": 3,
  "status": "in_progress",
  "completed_steps": [
    "创建 User 模型和数据库迁移",
    "实现注册 API 端点",
    "添加邮箱格式验证"
  ],
  "remaining_steps": [
    "实现邮箱验证流程（发送验证邮件）",
    "添加密码强度检查",
    "编写完整测试"
  ],
  "known_issues": [
    "邮件发送服务的 mock 配置尚未完成"
  ],
  "last_test_results": "8 passed, 2 failed (test_email_verification, test_password_strength)"
}
```

#### 何时使用 Ralph Loop

**适用场景：**
- 大型任务需要超过一个上下文窗口的工作量
- Agent 在单次会话中容易遗漏细节（Context Rot 导致）
- 需要 Agent 以"新鲜视角"重新审视自己的工作

**不适用场景：**
- 简单的单文件修改
- 任务本身就在一个上下文窗口内能完成
- 需要人工在中间步骤做决策的交互式任务
- Agent 已经通过了所有测试——不要强制它"再想想"

> **来源**: LangChain《改进深度 Agent》— Ralph Wiggum Loop；Viv (LangChain)《Agent Harness 剖析》— Ralph Loop 定义

---

### 5.5 Loop Detection 实现

**问题：** Agent 在确定一个方案后容易变得"短视"，对同一个错误方案反复做微小变化。LangChain 在 Trace 分析中发现，有些 trace 中 Agent 对同一文件重复编辑超过 10 次，每次只做微小调整，始终无法解决问题——这被称为 **Doom Loop**。

> "Models are biased towards their first plausible solution."
> — 模型倾向于偏好它们找到的第一个"看似可行"的解决方案。

#### LoopDetectionMiddleware 实现

```python
class LoopDetectionMiddleware:
    """
    跟踪同一文件的重复编辑次数。
    超过阈值后提示 Agent 换方案，而非继续微调。
    """

    def __init__(self, max_edits_per_file: int = 5):
        self.max_edits = max_edits_per_file
        self.edit_counts: dict[str, int] = {}  # file_path -> edit_count

    def on_after_tool_call(self, tool_name: str, tool_input: dict, result):
        """每次工具调用后检查"""
        if tool_name not in ("Edit", "Write"):
            return None

        file_path = tool_input.get("file_path", "")
        if not file_path:
            return None

        self.edit_counts[file_path] = self.edit_counts.get(file_path, 0) + 1
        count = self.edit_counts[file_path]

        if count == self.max_edits:
            return {
                "inject_message": (
                    f"WARNING: 你已经编辑 {file_path} 达 {count} 次。"
                    f"这可能意味着你当前的方案有根本性问题。\n\n"
                    f"请停下来，重新思考：\n"
                    f"1. 回顾原始任务规范\n"
                    f"2. 考虑是否需要完全不同的实现方案\n"
                    f"3. 检查是否遗漏了关键的上下文信息\n"
                    f"4. 考虑使用 git diff 查看你到底改了什么\n\n"
                    f"不要继续在同一方向上做微调。"
                )
            }

        if count > self.max_edits * 2:
            return {
                "inject_message": (
                    f"CRITICAL: 你已经编辑 {file_path} 达 {count} 次。"
                    f"你很可能陷入了 Doom Loop。\n"
                    f"请立即执行以下操作：\n"
                    f"1. git stash 保存当前更改\n"
                    f"2. 重新阅读原始任务规范\n"
                    f"3. 从零开始设计新方案\n"
                    f"4. 只有在新方案明显不同于之前的尝试时才开始编码"
                )
            }

        return None
```

**Shell 版本（适用于 Claude Code PostToolUse Hook）：**

```bash
#!/usr/bin/env bash
# Loop Detection: 跟踪文件编辑次数，检测 Doom Loop
# 配合 PostToolUse Hook 使用

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

COUNTER_DIR="/tmp/claude-loop-detection"
mkdir -p "$COUNTER_DIR"

# 将文件路径转为安全的文件名
SAFE_NAME=$(echo "$FILE_PATH" | md5sum | cut -d' ' -f1)
COUNTER_FILE="$COUNTER_DIR/$SAFE_NAME"

# 递增计数
if [ -f "$COUNTER_FILE" ]; then
  COUNT=$(cat "$COUNTER_FILE")
  COUNT=$((COUNT + 1))
else
  COUNT=1
fi

echo "$COUNT" > "$COUNTER_FILE"

MAX_EDITS=5

if [ "$COUNT" -ge "$((MAX_EDITS * 2))" ]; then
  cat <<EOF
{
  "hookSpecificOutput": {
    "additionalContext": "CRITICAL: 你已经编辑 $FILE_PATH 达 $COUNT 次。你很可能陷入了 Doom Loop。请立即：1) git stash 保存更改 2) 重新阅读原始任务规范 3) 从零开始设计完全不同的方案"
  }
}
EOF
elif [ "$COUNT" -ge "$MAX_EDITS" ]; then
  cat <<EOF
{
  "hookSpecificOutput": {
    "additionalContext": "WARNING: 你已经编辑 $FILE_PATH 达 $COUNT 次。当前方案可能有根本性问题。请停下来重新思考：回顾原始规范，考虑完全不同的实现方案。"
  }
}
EOF
fi

exit 0
```

> **来源**: LangChain《改进深度 Agent》— LoopDetectionMiddleware / Doom Loop

---

## 第六章：E2E 测试策略

Agent 需要"眼睛"。E2E 测试为 Agent 提供用户视角的验证能力——不是问 Agent "你觉得你写的代码对吗？"，而是让代码在真实环境中运行，并用确定性断言验证结果。

---

### 6.1 为什么 Agent 需要"眼睛"

Agent 最常见的失败模式不是写错代码，而是**声称功能"完成"但实际没有测试**。

以下场景在没有 E2E 测试时反复出现：

1. Agent 实现了一个表单提交功能，声称"完成"
2. 实际上表单的 submit 按钮绑定了错误的 handler
3. 没有任何验证机制发现这个问题
4. 人工 Review 时才发现，修复成本最高

**浏览器自动化提供用户视角验证：** Agent 不仅写代码，还能启动浏览器、填写表单、点击按钮、检查页面内容——就像一个真实用户在操作。

**Anthropic 的实验结论：** 视觉验证（让 Agent 实际看到它构建的 UI）显著提升了代码质量。Agent 能发现仅靠阅读代码无法发现的问题：布局错位、按钮不可点击、加载状态缺失等。

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— E2E 测试策略

---

### 6.2 工具选择（2026）

不同用途对应不同的最佳工具选择：

| 用途 | 推荐工具 | Token 效率（相对 Playwright MCP） | 说明 |
|------|---------|------|------|
| Agent 自测试循环 | Playwright CLI / agent-browser | 4x - 5.7x | Token 效率是首要考量；快照保存到文件系统而非上下文窗口 |
| 测试套件生成 | Playwright MCP | 1x（基准） | v1.56+ 含 Planner/Generator/Healer 三个子 Agent，适合批量生成测试 |
| 探索性测试 | agent-browser (Vercel Labs) | 5.7x | 用元素引用（`@e1`）而非 CSS 选择器，更稳定 |

**Token 效率为什么重要？**

Playwright MCP 的 26+ 工具定义消耗上下文窗口，每次操作返回完整 Accessibility Tree（复杂站点 3000+ 节点），典型任务消耗约 **114K tokens**。而 Playwright CLI 将快照保存到文件系统，仅约 **27K tokens**。agent-browser 使用元素引用进一步压缩到约 **20K tokens**。

在 Agent 的自测试循环中，每节省一分 token 都意味着上下文窗口中有更多空间用于推理和代码生成。

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— Web 应用 E2E 工具对比

---

### 6.3 按平台分类的完整工具表

| 平台 | 接口类型 | 推荐工具 | 备注 |
|------|---------|---------|------|
| **Web** | 浏览器 | Playwright CLI（主力）、agent-browser（Vercel Labs）、Playwright MCP（测试生成） | Playwright CLI token 效率最佳 |
| **Mobile (iOS)** | 模拟器/真机 | XcodeBuildMCP | iOS 专用 |
| **Mobile (跨平台)** | 模拟器/真机 | mobile-mcp、Detox（React Native）、Maestro MCP、Appium MCP | Detox 适合 RN 项目 |
| **CLI/TUI** | 终端 | bats-core（Bash 测试，TAP 兼容）、pexpect（交互式 CLI） | bats-core 输出对 Agent 极友好 |
| **API/后端** | HTTP/gRPC | Hurl（纯文本 HTTP，Agent 友好度最高）、Pact（契约测试）、grpcurl、Testcontainers | Hurl 是 Rust 制，最推荐 |
| **Desktop (Electron)** | 浏览器引擎 | Playwright、WebdriverIO + MCP Server | Electron 本质是 Web |
| **Desktop (Tauri)** | 原生+WebView | WebdriverIO（有平台限制） | Tauri 测试生态较弱 |
| **Desktop (原生)** | OS API | TestDriver.ai（Computer-Use SDK）、各平台 Accessibility API MCP | Computer-Use 是终极方案 |
| **Infrastructure** | CLI/API | terraform test + Conftest/OPA、container-structure-test、kubeconform、Terratest | 策略即代码 |
| **AI/ML 管道** | 多层 | GX/dbt（数据质量）、lm-evaluation-harness/LightEval（模型评估）、DeepEval/promptfoo/RAGAS（应用质量）、PyRIT/Guardrails AI（安全性） | 6 层测试体系 |

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— 各应用类型 E2E 测试策略

---

### 6.4 通用原则：结构化文本优于截图

Agent 处理结构化文本远比处理截图高效。这是选择测试工具时最重要的原则。

**为什么 Accessibility Tree 优于截图？**

| 维度 | 截图 | Accessibility Tree / 结构化文本 |
|------|------|------|
| Token 消耗 | 高（图像 token） | 低（纯文本） |
| 确定性 | 低（视觉判断有歧义） | 高（精确的 DOM 结构） |
| CI 断言 | 困难（需要视觉对比工具） | 简单（字符串匹配/JSON 断言） |
| 元素引用 | 不可能 | 可以（`@e1`、CSS 选择器、XPath） |
| 跨环境一致性 | 差（不同分辨率/渲染引擎） | 好（结构一致） |

**完整示例：使用 Playwright CLI 获取结构化输出**

```bash
# 获取页面的 Accessibility 快照（结构化文本）
npx playwright snapshot http://localhost:3000 --output /tmp/snapshot.txt

# Agent 读取文件而非消耗上下文窗口
cat /tmp/snapshot.txt
# 输出示例：
# - heading "Welcome to MyApp" [level=1]
# - navigation "Main"
#   - link "Home" [href="/"]
#   - link "About" [href="/about"]
#   - link "Contact" [href="/contact"]
# - main
#   - heading "Dashboard" [level=2]
#   - button "Create New" [enabled]
#   - table "Recent Items"
#     - row "Item 1" | "Active" | "2026-03-20"
#     - row "Item 2" | "Draft"  | "2026-03-19"
```

**使用 agent-browser 的元素引用方式：**

```bash
# agent-browser 返回带引用的结构化视图
# @e1 heading "Dashboard"
# @e2 button "Create New"
# @e3 link "View Details"

# Agent 可以直接引用元素执行操作
agent-browser click @e2    # 点击 "Create New" 按钮
agent-browser snapshot      # 获取更新后的页面状态
```

元素引用（`@e1`）比 CSS 选择器更稳定——CSS 选择器在 DOM 结构变化时容易失效，而元素引用在每次快照中基于语义重新分配。

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— 通用原则 / MCP Tax

---

### 6.5 前端 E2E 测试配置

#### Playwright 配置示例

`playwright.config.ts`：

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Agent 友好的报告格式：纯文本 + JSON
  reporter: [
    ["list"],                    // 终端输出，Agent 可直接读取
    ["json", { outputFile: "test-results/results.json" }],  // 结构化结果
  ],

  use: {
    baseURL: "http://localhost:3000",
    // 使用 Accessibility 快照而非截图
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // 自动启动开发服务器
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
```

**测试示例（Agent 友好风格）：**

```typescript
import { test, expect } from "@playwright/test";

test.describe("用户注册流程", () => {
  test("成功注册后跳转到 dashboard", async ({ page }) => {
    await page.goto("/register");

    // 使用语义化定位器（Accessibility 友好）
    await page.getByLabel("邮箱").fill("test@example.com");
    await page.getByLabel("密码").fill("StrongP@ss123");
    await page.getByLabel("确认密码").fill("StrongP@ss123");
    await page.getByRole("button", { name: "注册" }).click();

    // 确定性断言
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dashboard");
  });

  test("弱密码显示错误提示", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("邮箱").fill("test@example.com");
    await page.getByLabel("密码").fill("123");
    await page.getByLabel("确认密码").fill("123");
    await page.getByRole("button", { name: "注册" }).click();

    // 验证错误消息
    await expect(page.getByRole("alert")).toContainText("密码强度不足");
  });
});
```

#### 与 Hook 系统集成

将 E2E 测试集成到 Stop Hook 中，Agent 声称完成时自动运行：

```bash
#!/usr/bin/env bash
# Stop Hook 片段：E2E 测试验证
# 添加到 stop-verify.sh 中

# 前端 E2E 测试
if [ -d "$PROJECT_ROOT/e2e" ]; then
  E2E_OUTPUT=$(cd "$PROJECT_ROOT" && npx playwright test --reporter=list 2>&1) || true
  E2E_EXIT=$?

  if [ $E2E_EXIT -ne 0 ]; then
    echo "STOP BLOCKED: E2E 测试未通过。" >&2
    echo "$E2E_OUTPUT" | tail -40 >&2
    echo "" >&2
    echo "请查看 test-results/results.json 获取详细信息。" >&2
    exit 2
  fi
fi
```

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— E2E 测试 + Hook 集成

---

### 6.6 后端 API 测试配置

#### Hurl：最 Agent 友好的 HTTP 测试格式

Hurl 是一个用纯文本格式描述 HTTP 请求和断言的工具（Rust 制）。它的格式对 Agent 极其友好——无需学习测试框架的 API，直接写 HTTP 请求即可。

**安装：**

```bash
# macOS
brew install hurl

# Linux
curl -sL https://github.com/Orange-OpenSource/hurl/releases/latest/download/hurl-x86_64-linux.tar.gz | tar xz
```

**测试示例（`tests/api/user_registration.hurl`）：**

```hurl
# ====================================
# 用户注册 API 测试
# ====================================

# 测试 1: 成功注册
POST http://localhost:8000/api/v1/users/register
Content-Type: application/json
{
  "email": "newuser@example.com",
  "password": "StrongP@ss123",
  "name": "Test User"
}
HTTP 201
[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$.id" isInteger
jsonpath "$.email" == "newuser@example.com"
jsonpath "$.name" == "Test User"
jsonpath "$.password" not exists
jsonpath "$.created_at" isString

# 捕获 user_id 供后续测试使用
[Captures]
user_id: jsonpath "$.id"


# 测试 2: 重复邮箱注册应失败
POST http://localhost:8000/api/v1/users/register
Content-Type: application/json
{
  "email": "newuser@example.com",
  "password": "AnotherP@ss456",
  "name": "Another User"
}
HTTP 409
[Asserts]
jsonpath "$.detail" contains "already exists"


# 测试 3: 弱密码应被拒绝
POST http://localhost:8000/api/v1/users/register
Content-Type: application/json
{
  "email": "another@example.com",
  "password": "123",
  "name": "Weak Password User"
}
HTTP 422
[Asserts]
jsonpath "$.detail[0].msg" contains "password"


# 测试 4: 缺少必填字段
POST http://localhost:8000/api/v1/users/register
Content-Type: application/json
{
  "email": "incomplete@example.com"
}
HTTP 422
[Asserts]
jsonpath "$.detail" count > 0
```

**运行测试：**

```bash
# 运行单个测试文件
hurl --test tests/api/user_registration.hurl

# 运行所有 API 测试
hurl --test tests/api/*.hurl

# 生成 JSON 报告（Agent 可解析）
hurl --test --report-json test-results/api/ tests/api/*.hurl

# 带变量注入（用于不同环境）
hurl --test --variable base_url=http://localhost:8000 tests/api/*.hurl
```

**为什么 Hurl 对 Agent 最友好？**

1. **纯文本格式**：Agent 无需理解框架 API，直接写 HTTP 请求
2. **声明式断言**：`jsonpath "$.email" == "test@example.com"` 比编程式断言更清晰
3. **自包含**：一个 `.hurl` 文件就是完整的测试场景，Agent 无需在多个文件间跳转
4. **输出对 CI 友好**：支持 JSON/JUnit/TAP 报告格式

#### pytest + httpx 示例

对于需要更复杂逻辑（数据库 setup/teardown、fixture 共享等）的场景，pytest + httpx 是 Python 后端的标准方案：

`tests/test_user_api.py`：

```python
"""用户注册 API 集成测试"""

import httpx
import pytest


@pytest.fixture
def base_url():
    return "http://localhost:8000/api/v1"


@pytest.fixture
def client():
    with httpx.Client(timeout=10.0) as client:
        yield client


class TestUserRegistration:
    """用户注册端点测试"""

    def test_successful_registration(self, client, base_url):
        """成功注册返回 201 和用户信息（不含密码）"""
        response = client.post(
            f"{base_url}/users/register",
            json={
                "email": "pytest-user@example.com",
                "password": "StrongP@ss123",
                "name": "Pytest User",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "pytest-user@example.com"
        assert data["name"] == "Pytest User"
        assert "password" not in data
        assert "id" in data

    def test_duplicate_email_returns_409(self, client, base_url):
        """重复邮箱注册返回 409"""
        payload = {
            "email": "duplicate@example.com",
            "password": "StrongP@ss123",
            "name": "First User",
        }
        # 第一次注册
        client.post(f"{base_url}/users/register", json=payload)

        # 第二次注册同一邮箱
        response = client.post(f"{base_url}/users/register", json=payload)
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]

    def test_weak_password_returns_422(self, client, base_url):
        """弱密码返回 422"""
        response = client.post(
            f"{base_url}/users/register",
            json={
                "email": "weak-pw@example.com",
                "password": "123",
                "name": "Weak PW User",
            },
        )

        assert response.status_code == 422

    def test_missing_fields_returns_422(self, client, base_url):
        """缺少必填字段返回 422"""
        response = client.post(
            f"{base_url}/users/register",
            json={"email": "incomplete@example.com"},
        )

        assert response.status_code == 422
        assert len(response.json()["detail"]) > 0
```

**运行测试：**

```bash
# 运行 API 测试
python -m pytest tests/test_user_api.py -v

# 生成 JSON 报告
python -m pytest tests/test_user_api.py --tb=short --json-report --json-report-file=test-results/api.json

# 仅运行失败的测试（Agent 修复后快速验证）
python -m pytest tests/test_user_api.py --lf -v
```

**Hurl vs pytest+httpx 选择指南：**

| 维度 | Hurl | pytest + httpx |
|------|------|----------------|
| Agent 学习成本 | 极低（纯文本） | 中等（需理解 pytest） |
| 复杂测试逻辑 | 有限 | 完全灵活 |
| 数据库 setup/teardown | 不支持 | fixture 支持 |
| CI 集成 | 优秀 | 优秀 |
| 推荐场景 | API 契约验证、冒烟测试 | 完整集成测试 |

**实用建议：** 两者不互斥。用 Hurl 写快速的 API 契约测试（放入 PostToolUse 或 Stop Hook），用 pytest 写完整的集成测试（放入 CI）。

> **来源**: 逆瀬川 (@gyakuse)《Claude Code / Codex 最佳实践》— API 测试策略

---

### 小结

第五章和第六章构成了 Harness Engineering 的"验证骨架"：

- **第五章**回答了"如何让 Agent 在每个环节都获得质量反馈"——从毫秒级的 PostToolUse Hook 到小时级的人工 Review，四层架构覆盖了完整的质量保障链条。Hook 系统（PreToolUse/PostToolUse/Stop/PreCompact）是 Claude Code 平台独有的质量控制机制，通过机制而非提示词来强制质量。Ralph Loop 和 Loop Detection 则分别解决了"Agent 不够坚持"和"Agent 太过坚持"的问题。

- **第六章**回答了"如何让 Agent 验证它构建的东西真的能用"——E2E 测试给 Agent 装上了"眼睛"。核心原则是结构化文本优于截图，确定性断言优于 Agent 自我判断。工具选择覆盖了 Web、Mobile、CLI、API、Desktop、Infrastructure、AI/ML 全平台。

两章的共同主题是 LangChain 团队的核心发现：**强制验证，而非信任自我声明。**

> "今天的模型是出色的自我改进机器"——前提是你给它们反馈信号。Harness 的工作就是确保这些信号准确、及时、不可绕过。

---

**来源汇总：**
- LangChain Team,《Improving Deep Agents with Harness Engineering》, 2026-02-17
- Viv (@Vtrivedy10, LangChain),《The Anatomy of an Agent Harness》, 2026-03-10
- 逆瀬川 (@gyakuse),《Claude Code / Codex 用户 Harness Engineering 最佳实践》, 2026-03-09
- George (@odysseus0z),《Harness Engineering Is Cybernetics》, 2026-03-07


---

# Harness Engineering 实操手册（第七章 - 第十章 & 附录）

---

## 第七章：会话与状态管理

Agent 没有记忆。每次新会话启动时，它面对的是一片空白——不知道昨天做了什么、项目进展到哪里、哪些坑已经踩过。这不是 bug，而是 Agent 架构的基本事实。本章的目标是：**用工程化手段为无状态的 Agent 构建可靠的状态恢复机制**。

### 7.1 Agent 无记忆问题

Agent 的每次会话都从零开始。它不记得：

- [ ] 上次会话完成了哪些功能
- [ ] 哪些文件被修改过、为什么修改
- [ ] 遇到过什么 bug、用了什么 workaround
- [ ] 项目的整体进度和优先级排序

**核心矛盾**：Agent 的执行能力很强，但跨会话的连续性为零。如果你不为它提供结构化的恢复机制，每次会话它都会像一个新入职的员工一样重新摸索——甚至更糟，因为它连上次的错误都不记得。

> "从 Agent 的视角来看，它在运行时无法访问的上下文实际上等于不存在。"
> — OpenAI Harness Engineering Team（来源：01）

**结构化恢复的三根支柱**：

1. **Git 历史**：最可信的"发生了什么"记录
2. **进度文件**（JSON）：结构化的任务状态追踪
3. **标准化启动流程**：确保每次会话都能快速恢复上下文

### 7.2 标准启动流程

每次 Agent 会话开始时，应执行以下标准化启动例程（来源：07）：

```
标准启动流程（6 步）：
───────────────────────────
1. 确认工作目录
   → pwd, ls 核实当前位于正确的项目根目录

2. 读取近期 Git 历史
   → git log --oneline -20
   → 快速了解最近发生了什么

3. 读取进度文件
   → cat progress.json
   → 了解任务状态、优先级、阻塞项

4. 选择下一个优先任务
   → 根据 progress.json 中的 priority 和 status 字段
   → 跳过 "completed" 和 "blocked" 的任务

5. 验证开发服务器健康状态
   → 前端：curl http://localhost:3000 或 npm run dev
   → 后端：curl http://localhost:8000/health 或 uv run uvicorn ...
   → 确保环境可用再开始工作

6. 开始工作
   → 基于步骤 4 选定的任务开始执行
```

**在 CLAUDE.md 中编码启动例程**：

```markdown
# 会话启动（每次新会话必须执行）
1. 运行 `git log --oneline -20` 了解近期变更
2. 读取 `progress.json` 确认当前任务状态
3. 选择 status 为 "pending" 且 priority 最高的任务
4. 运行 `npm run dev`（前端）或 `uv run uvicorn main:app`（后端）验证环境
5. 确认环境正常后开始工作
```

### 7.3 进度文件设计

**为什么 JSON 优于 Markdown**（来源：06, 07）：

- Agent 编辑 Markdown 时容易破坏格式、丢失信息、改变结构
- JSON 有严格的语法规则，Agent 不当编辑的概率更低
- JSON 可被程序解析和验证，Markdown 不行
- Anthropic 团队在实践中发现 JSON 做 feature tracking 比 Markdown 更可靠

**progress.json 完整模板**：

```json
{
  "project": "my-app",
  "last_updated": "2026-03-22T10:30:00Z",
  "current_sprint": "v0.3.0",
  "tasks": [
    {
      "id": "TASK-001",
      "title": "用户登录页面",
      "status": "completed",
      "priority": 1,
      "completed_at": "2026-03-20T15:00:00Z",
      "commit": "a1b2c3d",
      "notes": "使用 NextAuth.js，支持 Google OAuth"
    },
    {
      "id": "TASK-002",
      "title": "用户仪表盘 API",
      "status": "in_progress",
      "priority": 1,
      "started_at": "2026-03-21T09:00:00Z",
      "subtasks": [
        { "name": "GET /api/dashboard/stats", "done": true },
        { "name": "GET /api/dashboard/recent", "done": false },
        { "name": "WebSocket 实时更新", "done": false }
      ],
      "blockers": [],
      "notes": "stats 端点已完成，recent 端点需要分页"
    },
    {
      "id": "TASK-003",
      "title": "邮件通知服务",
      "status": "pending",
      "priority": 2,
      "depends_on": ["TASK-002"],
      "notes": "使用 Resend API，需要先完成仪表盘 API"
    },
    {
      "id": "TASK-004",
      "title": "修复：移动端导航栏重叠",
      "status": "pending",
      "priority": 3,
      "type": "bugfix",
      "notes": "仅在 iPhone SE 尺寸出现"
    }
  ],
  "known_issues": [
    "Docker 构建在 arm64 上偶尔超时，已添加 --platform 参数缓解"
  ],
  "tech_debt": [
    "TASK-001 中的 session 处理需要迁移到 Redis"
  ]
}
```

**feature_list.json 模板（Anthropic 模式）**（来源：06）：

Anthropic 使用 "initializer agent" 从高级 prompt 生成独立 feature 列表，每个 feature 带有明确的测试步骤。这种模式适合大规模并行开发。

```json
{
  "project": "my-app",
  "version": "0.3.0",
  "generated_by": "initializer_agent",
  "generated_at": "2026-03-22T08:00:00Z",
  "features": [
    {
      "id": "F-001",
      "title": "用户头像上传",
      "description": "用户可在设置页上传头像，支持 JPG/PNG，最大 2MB",
      "acceptance_criteria": [
        "上传成功后头像立即显示在导航栏",
        "超过 2MB 的文件显示错误提示",
        "不支持的格式显示错误提示"
      ],
      "test_steps": [
        "启动开发服务器",
        "导航到 /settings/profile",
        "上传一张 500KB 的 JPG 图片",
        "验证导航栏头像更新",
        "尝试上传 5MB 文件，验证错误提示",
        "尝试上传 .gif 文件，验证错误提示"
      ],
      "files_likely_touched": [
        "src/components/AvatarUpload.tsx",
        "src/api/upload.ts",
        "src/pages/settings/profile.tsx"
      ],
      "estimated_complexity": "medium",
      "depends_on": [],
      "status": "pending",
      "assigned_agent": null
    },
    {
      "id": "F-002",
      "title": "暗色模式切换",
      "description": "全局暗色模式，状态持久化到 localStorage",
      "acceptance_criteria": [
        "点击切换按钮后所有页面切换到暗色主题",
        "刷新页面后主题保持",
        "跟随系统偏好的默认值"
      ],
      "test_steps": [
        "启动开发服务器",
        "点击主题切换按钮",
        "验证所有页面组件颜色变化",
        "刷新页面，验证主题保持",
        "清除 localStorage，验证跟随系统偏好"
      ],
      "files_likely_touched": [
        "src/providers/ThemeProvider.tsx",
        "src/hooks/useTheme.ts",
        "tailwind.config.ts"
      ],
      "estimated_complexity": "low",
      "depends_on": [],
      "status": "pending",
      "assigned_agent": null
    }
  ]
}
```

**进阶策略**：对于长期项目，考虑用测试套件本身替代功能列表——测试通过即功能完成，不需要额外维护一份功能追踪文件（来源：07）。

### 7.4 Git 作为会话桥梁

Git 是跨会话最可信的状态传递机制（来源：06, 07）：

**核心原则**：

- [ ] 每次会话结束时 commit（使用描述性 message）
- [ ] `git log --oneline -20` 是下次会话最可靠的"发生了什么"记录
- [ ] 保持代码始终可合并（避免半成品留在工作区）
- [ ] Commit message 应面向"下一个 Agent 会话"而非人类

**Commit Message 规范（面向 Agent）**：

```
feat(dashboard): 完成 stats API 端点

- 实现 GET /api/dashboard/stats
- 添加 Redis 缓存（TTL 5分钟）
- 添加单元测试（3个用例全部通过）
- 下一步：实现 GET /api/dashboard/recent（需要分页）
```

关键在最后一行 "下一步" —— 这行信息专门给下一个 Agent 会话看，告诉它接下来该做什么。

**保持代码始终可合并**：

```markdown
# CLAUDE.md 中的 Git 规则
- 每完成一个独立功能点就 commit，不要等到全部完成
- commit 前确保所有测试通过
- 不要留下 TODO 注释作为"提醒"——Agent 不会记得，用 progress.json 追踪
- commit message 最后一行写明"下一步"要做什么
```

### 7.5 Context 管理策略

#### Context Rot 问题

Chroma 的研究证实：18 个前沿模型均随上下文长度增加而性能下降（来源：04b, 07）。这意味着：

- Agent 运行越久，上下文窗口越满，推理质量越差
- 仓库中残留的无关/过时信息会直接降低 Agent 表现
- 这不是"可能"的问题，而是已被量化验证的事实

#### 压缩策略（Compaction）

当上下文窗口接近填满时，需要智能地卸载和总结现有上下文（来源：04b）：

- [ ] **经验法则**：5+ 轮之前的对话内容压缩为摘要
- [ ] 保留关键决策和当前任务状态
- [ ] 丢弃中间的试错过程和冗长的工具输出
- [ ] Claude Code 的 PreCompact Hook 可以在压缩发生前捕获即将丢失的上下文

#### Tool Call Offloading（工具调用卸载）

大型工具输出是 Context Rot 的主要元凶（来源：04b）：

```
策略：对超过阈值的大型工具输出——
1. 只保留头尾 Token 在上下文中
2. 将完整输出卸载到文件系统
3. Agent 需要时可以从文件系统读取

示例：
  → 测试输出 > 500 行 → 保存到 /tmp/test_output.txt
  → API 响应 > 100 行 → 保存到 /tmp/api_response.json
  → 构建日志 > 200 行 → 保存到 /tmp/build_log.txt
```

#### Skills 渐进加载

启动时加载所有工具/MCP Server 定义会消耗大量上下文窗口（来源：04b, 07）：

- [ ] Playwright MCP 的 26+ 工具定义本身就占用大量 Token
- [ ] 复杂站点的 Accessibility Tree 可达 3000+ 节点
- [ ] 典型 Playwright MCP 任务消耗约 114K tokens（来源：07）

**解决方案**：按需加载工具定义（Progressive Disclosure）

- Claude Code 的 MCP Tool Search 可将上下文消耗减少 85%（来源：07）
- 只在 Agent 实际需要某个工具时才加载其定义
- 避免在 AGENTS.md 中列出所有可用工具的详细说明

---

## 第八章：团队扩展

从个人使用 Agent 到团队规模化采纳，需要系统性的升级路径。本章覆盖三个核心维度：采纳路径、并行化模式和质量治理。

### 8.1 三级升级路径

| 级别 | 范围 | 投入时间 | 核心配置 |
|------|------|----------|----------|
| Level 1 | 个人开发者 | 1-2 小时 | 基础 Harness |
| Level 2 | 小团队（3-7人） | 1-2 天 | 团队级 Harness |
| Level 3 | 组织（10+人） | 1-2 周 | 组织级 Harness |

#### Level 1：个人开发者（1-2 小时）

- [ ] 创建 AGENTS.md / CLAUDE.md（50 行以下，指针型）
- [ ] 配置 Pre-commit Hook（Lefthook）运行 linter + formatter
- [ ] 配置 PostToolUse Hook 自动格式化
- [ ] 建立 progress.json 追踪任务
- [ ] 编写第一个 ADR 记录关键架构决策
- [ ] 标准化会话启动例程

**验证标准**：Agent 能独立完成一个小功能，从任务描述到测试通过，无需中途人工干预。

#### Level 2：小团队（1-2 天）

- [ ] 统一团队的 AGENTS.md 模板和命名规范
- [ ] 建立"Agent 犯错 → 加测试/linter 规则"的反馈循环
- [ ] 引入 E2E 测试工具（Playwright CLI / Hurl）
- [ ] 配置 Stop Hook 强制测试通过才能结束会话
- [ ] 建立计划 → 审批 → 执行的工作流
- [ ] 指定 Agents Captain 角色（来源：06，Greg Brockman 建议）
- [ ] 建立共享的 ADR 目录和 feature_list.json

**验证标准**：多人同时使用 Agent 不产生冲突，PR 质量稳定，新成员一天内上手。

#### Level 3：组织级（1-2 周）

- [ ] 构建自定义 linter 规则（错误消息含修复指令 + ADR 引用）
- [ ] 实现 archgate 模式：ADR 与 linter 规则绑定
- [ ] 从仓库移除描述性文档，替换为测试和 ADR
- [ ] 配置 PreToolUse Safety Gate（阻止破坏性操作）
- [ ] 建立 Plankton 模式等高级反馈循环（来源：07）
- [ ] 实现垃圾收集流程（定期后台 Agent 扫描偏差）
- [ ] 搭建集中式 MCP 平台（参考 Stripe Toolshed 模式，来源：06）
- [ ] 建立定量度量体系（PR/天、返工率、Review 指摘率）
- [ ] 多 Agent 并行工作流

**验证标准**：Agent 吞吐量可量化衡量且持续改善，技术债不失控增长，新项目可复用现有 Harness。

### 8.2 并行化模式

#### 有人值守（Attended）

开发者主动管理多个 Agent 会话，实时审查和指导（来源：06）：

```
开发者同时管理 3-4 个 Agent 会话（实践上限）
  ├── Agent 1：实现用户认证模块
  ├── Agent 2：编写 API 集成测试
  ├── Agent 3：重构数据库查询层
  └── 开发者：在会话间切换，审查输出，提供反馈
```

**适用场景**：
- [ ] Harness 尚不成熟，Agent 需要频繁指导
- [ ] 任务涉及复杂的架构决策
- [ ] 首次使用 Agent 做某类工作

**经验数据**：作者个人经验表明，同时管理 3-4 个活跃 Agent session 是上限，超过则人成为瓶颈（来源：06）。

#### 无人值守（Unattended）

开发者发出任务后离开，Agent 自主完成到 PR 阶段（来源：06）：

```
开发者 → 分配任务（描述 + 验收标准）
              ↓
       Agent 自主执行
         ├── 编码
         ├── 运行测试
         ├── 自我 Review（Ralph Wiggum Loop）
         └── 开 PR
              ↓
       开发者回来 Review PR
```

**适用场景**：
- [ ] Harness 已成熟，覆盖了常见错误
- [ ] 任务边界清晰、验收标准明确
- [ ] 有 Stop Hook 强制测试通过

**前提条件**：成熟的 Harness（linter + 测试 + Hook + ADR）是无人值守的必要条件。

#### Stripe 模式

Stripe 的 Minions 系统是目前最成熟的无人值守并行化案例（来源：06）：

```
Slack 消息 → Agent 接收任务
                ↓
          Agent 编码 + 测试
                ↓
          CI 自动验证
                ↓
          自动开 PR
                ↓
          人工 Review + 合并

成果：每周 1,000+ 合并的 PR
工具：400+ 内部工具通过 MCP Server（Toolshed）暴露给 Agent
```

#### 决策树：何时用哪种模式

```
任务是否边界清晰、有明确的验收标准？
  ├── 否 → Attended（需要人类指导）
  └── 是 → Harness 是否成熟？（有 linter + 测试 + Hook）
              ├── 否 → Attended（Harness 不够可靠）
              └── 是 → 任务是否涉及核心架构决策？
                        ├── 是 → Attended（架构决策需要人类判断）
                        └── 否 → Unattended（放心交给 Agent）
```

### 8.3 熵管理与垃圾回收

#### "AI Slop" 问题

Agent 高速生产代码的副作用是代码熵增——低质量代码、不一致的模式、冗余的 helper 函数、过时的注释会快速积累（来源：01）。

> OpenAI 团队曾每周五花 20% 的时间手动清理 "AI slop"，后来发现这不可扩展。

#### 解决方案：自动化垃圾回收

**第一层：Golden Principles 编码**（来源：01）

将代码质量准则编码为机械化规则，而非文档：

```
准则："所有 API 端点必须有 input validation"
  ↓
编码为 linter 规则（而非写在 AGENTS.md 里）
  ↓
违规时 linter 报错 + 修复指引
  ↓
Agent 被迫修复（CI 不过就不能合并）
```

**第二层：定期垃圾回收 Agent**（来源：01, 07）

```
后台 Agent 定期执行：
  ├── 扫描文档不一致（过时的 README、错误的 API 文档）
  ├── 检测架构违规（依赖方向错误、跨层调用）
  ├── 检测模式偏移（命名不一致、重复的 utility 函数）
  ├── 验证知识库时效性和交叉引用
  └── 自动提交修复 PR

执行频率：每日或每次 CI 流水线
检查基准：必须依赖确定性规则（linter、测试），不能依赖 Agent 判断
```

**第三层：自动扫描流程**

```bash
# 垃圾回收 Agent 任务示例
# 1. 文档一致性检查
rg "TODO|FIXME|HACK" --count-matches

# 2. 架构违规检查（自定义 linter）
npx oxlint --config .oxlintrc.json  # 前端
ruff check --select=CUSTOM           # 后端

# 3. 模式偏移检测（ast-grep）
ast-grep scan --rule rules/

# 4. 未使用导入/变量
npx oxlint --deny unused-imports
ruff check --select=F401,F841
```

### 8.4 质量度量指标

量化 Harness 有效性是持续改进的基础（来源：06, 07）。

| 指标 | 定义 | 目标值 | 来源/备注 |
|------|------|--------|-----------|
| **PR 速度** | PRs / 工程师 / 天 | 3.0+ | OpenAI 团队达到 3.5（来源：01） |
| **返工率** | 需要修改的 PR 占比 | < 20% | 越低说明 Harness 越成熟 |
| **Review 发现问题数** | 每次 Review 的指摘数 | 趋势下降 | 应随 Harness 改进而减少 |
| **Agent 任务成功率** | 一次完成（无需人工干预）的任务占比 | > 80% | Unattended 模式的核心指标 |
| **首次 CI 通过率** | PR 首次提交就通过 CI 的比例 | > 90% | 反映 Hook + 测试覆盖质量 |
| **Harness 规则增长** | 每周新增的 linter 规则 / 测试数 | 持续增长 | 反映反馈循环是否运转 |
| **技术债存量** | 已知技术债条目数 | 趋势稳定或下降 | 通过 progress.json 追踪 |
| **Context 效率** | 平均每个任务的 Token 消耗 | 趋势下降 | 反映 Context 管理策略效果 |

**度量实践建议**：

- [ ] 每周收集一次度量数据
- [ ] 建立 Dashboard（简单的 spreadsheet 即可）
- [ ] 重点关注趋势而非绝对值
- [ ] 度量结果反馈到 Harness 改进——哪个指标差就优先改善对应的 Harness 组件

---

## 第九章：常见反模式 & 避坑指南

以下反模式来自 OpenAI、Anthropic、Stripe、LangChain 等团队的实战经验。每个反模式包含问题描述、原因分析、解决方案和来源标注。

---

### 一、文档反模式

#### 反模式 1：巨型 AGENTS.md

- **问题**：AGENTS.md 超过 200 行，塞满了所有能想到的信息
- **原因**：误以为"信息越多越好"。实际上，IFScale 研究显示 150-200 条指示时 primacy bias 显著，Agent 性能开始退化
- **解决方案**：AGENTS.md 控制在 50 行以下，仅含路由指令和禁止事项。详细信息通过 Skills、`.claude/rules/`、子目录 AGENTS.md 按需加载
- **来源**：07（"理想50行以下。Anthropic 官方说200行以下是上限"）、01（"给 Codex 一张地图，而不是一本千页操作手册"）

#### 反模式 2：描述性文档

- **问题**：仓库中充斥"系统当前是这样运作的"类描述性文档（手写 API 说明、架构概要等）
- **原因**：沿用了人类文档习惯。但 Agent 无法区分"3个月前的旧笔记"和最新事实
- **解决方案**：移除描述性文档。用测试替代"系统行为说明"，用 ADR 替代"为什么这样设计"。可执行制品（代码、测试、Schema、linter 配置）不会腐败
- **来源**：07（"不应放入仓库的：描述性文档——这些必然腐败，Agent 会把过时信息当真"）

#### 反模式 3：Slack 中的隐性知识

- **问题**：团队的关键决策和共识存在于 Slack 对话中，未记录到仓库
- **原因**：自然的沟通习惯。但从 Agent 视角，Slack 中的信息等于不存在
- **解决方案**：所有架构决策记录为 ADR 并 commit 到仓库。所有编码规范编码为 linter 规则。"如果它没有在仓库里，它就不存在"
- **来源**：01（"agent 在运行时无法访问的上下文实际上等于不存在"）

#### 反模式 4：文档没有保鲜机制

- **问题**：文档写完就没人维护，逐渐与代码脱节
- **原因**：没有机械化的文档保鲜机制
- **解决方案**：①用 CI job 验证知识库的交叉引用和结构正确性 ②定期运行 "doc-gardening" Agent 扫描过时文档并提交修复 PR ③指针型文档设计——指针失效时会产生 404 式错误，腐败可被机械检测
- **来源**：01（"专用 linter 和 CI job 验证知识库的时效性"）

#### 反模式 5：冗长的编码风格指南

- **问题**：在 AGENTS.md 中写了长篇的编码风格要求（缩进、命名、注释规范等）
- **原因**：误以为 Agent 需要文字说明才能遵守风格
- **解决方案**：所有编码风格交给 linter 和 formatter 机械化执行。Agent 不需要"知道"风格规范，只需要被工具强制遵守
- **来源**：07（"冗长的编码风格指南——交给 linter"）

---

### 二、架构反模式

#### 反模式 6：Agent 篡改 Linter 配置

- **问题**：Agent 面对 linter 报错时，不是修复代码，而是修改 linter 配置文件来消除报错
- **原因**：对 Agent 来说，修改配置是"最短路径解"。它没有"不应该改配置"的认知
- **解决方案**：用 PreToolUse Hook 阻止 Agent 修改 linter 配置文件（`.eslintrc`、`biome.json`、`pyproject.toml`、`.oxlintrc.json` 等）
- **来源**：07（"Agent 面对 linter 错误时频繁被观察到修改配置而非修复代码"）

#### 反模式 7：未约束的执行环境

- **问题**：Agent 可以执行任意命令，包括 `rm -rf`、`drop table`、修改 `.env` 等破坏性操作
- **原因**：没有配置安全边界
- **解决方案**：配置 PreToolUse Safety Gate，用命令白名单和文件保护列表限制 Agent 的操作范围。Exit 2 阻止操作，stderr 反馈给 Agent
- **来源**：07（"Safety Gates：阻止破坏性命令、禁止编辑机密文件"）

#### 反模式 8：无限解空间

- **问题**：给 Agent 模糊的指令（如"优化性能"），Agent 可能做出各种意料之外的改动
- **原因**：Agent 的创造力在解空间过大时变成风险
- **解决方案**：收窄解空间——明确约束（改哪个文件、用什么方法、不能动什么）、通过 linter 和架构测试强制边界
- **来源**：06（"提高对 AI 生成代码的信任和可靠性，需要的是收窄解空间，而非扩大它"）

#### 反模式 9：缺少分层架构约束

- **问题**：Agent 自由创建文件、随意跨层调用，代码库结构快速混乱
- **原因**：没有机械化的架构边界
- **解决方案**：定义固定层级（如 Types → Config → Repo → Service → Runtime → UI），用自定义 linter 验证依赖方向，仅允许有限的跨层边
- **来源**：01（"严格验证依赖方向，仅允许有限的跨层边"）

#### 反模式 10：构建 Agent 专用基础设施

- **问题**：为 Agent 单独搭建一套工具和流程，与人类开发者的工具链分离
- **原因**：觉得 Agent 需要"特殊对待"
- **解决方案**：构建优秀的开发者基础设施，Agent 会自动受益。统一的工具链对人和 Agent 同时生效
- **来源**：07（"不要构建 Agent 专用基础设施。构建优秀的开发者基础设施，Agent 会自动受益。——Stripe"）

---

### 三、Agent 行为反模式

#### 反模式 11：Agent 自我审查通过

- **问题**：让 Agent 自己判断代码是否正确，它几乎总是说"没问题"
- **原因**：LLM 有自我肯定倾向（sycophancy），Agent 不会质疑自己的输出
- **解决方案**：验证必须确定性——用测试、linter、CI 验证，不依赖 Agent 判断。Ralph Wiggum Loop 用不同 Agent 实例做 review（来源：01）
- **来源**：07（"验证必须确定性——不要把 Agent 自身放进 CI"）

#### 反模式 12：Context 泛滥

- **问题**：长时间会话中上下文窗口被大量工具输出、错误日志、测试结果填满
- **原因**：没有 Tool Call Offloading 策略
- **解决方案**：大输出存文件系统（只保留头尾摘要在上下文中）；5+ 轮前的内容压缩为摘要；使用 MCP Tool Search 减少工具定义占用
- **来源**：04b（"对超过阈值的大型工具输出，只保留头尾 Token，将完整输出卸载到文件系统"）

#### 反模式 13：过早停止

- **问题**：Agent 宣称"完成了"，但实际上测试未通过或功能不完整
- **原因**：Agent 有"尽快完成"的倾向，会在遇到困难时过早声称完成
- **解决方案**：配置 Stop Hook——Agent 尝试停止时自动运行测试套件，测试不过不让停。注意用 `stop_hook_active` 标志防止无限循环
- **来源**：07（"Completion Gates：Agent 宣称完成时运行测试验证，测试不过不让停"）

#### 反模式 14：Doom Loop（死循环）

- **问题**：Agent 反复尝试修复同一个 bug，每次尝试都引入新问题，形成死循环
- **原因**：Agent 缺乏"退出策略"，不会主动寻求帮助
- **解决方案**：①设置最大重试次数 ②用 Hook 检测重复的错误模式 ③在 AGENTS.md 中明确指示"如果3次尝试未解决，停止并报告问题"
- **来源**：07（Stop Hook 需要 `stop_hook_active` 标志防无限循环）

#### 反模式 15：一次做太多事

- **问题**：Agent 试图在一个会话中完成多个不相关的功能或大规模重构
- **原因**：Agent 有"一次搞定所有"的倾向
- **解决方案**：明确指示"一次只做一个功能"。在 AGENTS.md 中写明每个会话的范围限制
- **来源**：07（"明确指示'一次只做一个功能'，避免 Agent 的'一次搞定所有'倾向"）

---

### 四、流程反模式

#### 反模式 16：阻塞式等待 Code Review

- **问题**：Agent 提交 PR 后等待人工 Review，期间完全闲置
- **原因**：沿用了人类开发流程。但在高吞吐环境下，等待成本远高于修正成本
- **解决方案**：Agent 提交 PR 后立即开始下一个任务。Review 反馈通过 CI 和 Agent-to-Agent review 前置。人工 Review 作为最终关卡但不阻塞流程
- **来源**：01（"修正成本低而等待成本高——传统 merge 哲学需要重新审视"）

#### 反模式 17：巨大的前期投入

- **问题**：花几周时间构建"完美的 Harness"才开始使用 Agent
- **原因**：过度工程化倾向
- **解决方案**：从 MVH（最小可行 Harness）开始——50 行 AGENTS.md + Pre-commit Hook + 基础测试。每次 Agent 犯错就强化一点 Harness。渐进式构建
- **来源**：07（MVH 路线图：第1周只需基础配置）

#### 反模式 18：无反馈循环

- **问题**：Agent 犯了错，人工修复后继续，下次同样的错误再犯
- **原因**：没有将错误转化为 Harness 改进
- **解决方案**：**每次 Agent 犯错，就做一件事**——加一个测试、加一条 linter 规则、或更新 AGENTS.md。这是 Harness Engineering 的核心循环
- **来源**：06（"每当你发现 agent 犯了一个错误，你就花时间工程化地解决它，确保 agent 再也不会犯同样的错误。"——Mitchell Hashimoto）

#### 反模式 19：跳过计划直接执行

- **问题**：直接让 Agent "实现这个功能"，没有先生成执行计划
- **原因**：觉得计划浪费时间
- **解决方案**：让 Agent 先制定计划，人类审核/批准后再执行。计划与执行分离是最重要的单一实践
- **来源**：06（"将规划与执行分离，是我所做的最重要的一件事。"——Boris Tane, Cloudflare）

#### 反模式 20：对 Agent 产出降低标准

- **问题**：因为是 Agent 写的代码，Review 时标准放宽（"反正是 AI 写的嘛"）
- **原因**：心理偏差——觉得 AI 代码"差不多就行"
- **解决方案**：维持与人工代码相同甚至更高的 Review 标准。Agent 速度快不意味着质量可以打折
- **来源**：06（"确保有人对每一行合并的代码负责。作为代码审查者，至少维持与审查人工代码相同的标准。"——Greg Brockman）

---

### 五、Context 反模式

#### 反模式 21：启动时加载所有工具

- **问题**：Agent 启动时加载所有 MCP Server 和工具定义，上下文窗口立即被占用大量空间
- **原因**：觉得 Agent "可能需要"所有工具
- **解决方案**：使用 Skills 渐进加载（Progressive Disclosure），只在 Agent 实际需要时才加载工具定义。Claude Code 的 MCP Tool Search 减少 85% 的上下文消耗
- **来源**：04b（Skills 渐进式披露解决启动时加载过多工具的问题）

#### 反模式 22：大输出留在上下文中

- **问题**：测试输出、API 响应、构建日志等大型输出留在上下文窗口中不处理
- **原因**：没有配置 Tool Call Offloading
- **解决方案**：超过阈值的输出卸载到文件系统，只保留头尾摘要在上下文中
- **来源**：04b（"对超过阈值的大型工具输出，只保留头尾 Token"）

#### 反模式 23：忽视 Context Rot

- **问题**：让 Agent 在长会话中持续工作，不关注上下文质量退化
- **原因**：误以为"上下文窗口够大就没问题"
- **解决方案**：①监控会话长度和 Token 消耗 ②5+ 轮后主动压缩 ③复杂任务拆分为多个短会话，用 Git + progress.json 桥接
- **来源**：04b（"18 个前沿模型均随上下文长度增加而性能下降"），07（Chroma 研究）

#### 反模式 24：在 AGENTS.md 中解释技术栈

- **问题**：在 AGENTS.md 中写"我们使用 React 18 + TypeScript + Tailwind CSS..."
- **原因**：觉得 Agent 需要被告知技术栈
- **解决方案**：Agent 能读 `package.json`、`pyproject.toml`、`Cargo.toml`。不要浪费 Context 窗口重复这些信息
- **来源**：07（"不写什么：技术栈解释——Agent 能读 package.json"）

---

## 第十章：工具速查表

### 10.1 Linter & Formatter

| 语言 | Linter | Formatter | 速度 | 备注 |
|------|--------|-----------|------|------|
| **TypeScript/JS** | Oxlint | Biome | Rust 制，ESLint 的 50-100x | 推荐组合；Oxlint lint + Biome format |
| **Python** | Ruff | Ruff | Rust 制，集成 Flake8/isort/Black | 一个二进制搞定一切 |
| **Go** | golangci-lint | gofmt / goimports | 50+ linter 并行，缓存加速 | Go 标准工具链 |
| **Rust** | Clippy | rustfmt | 编译器级别 | 用 `pedantic` + `deny allow_attributes` 阻止 Agent 静默 lint 警告 |
| **Swift** | SwiftLint | SwiftFormat | 原生 | 200+ 规则，`--autocorrect` 自动修复 |
| **Kotlin** | detekt | ktfmt | JVM | ktfmt 比 ktlint 快 40% |
| **多语言自定义规则** | ast-grep | — | Rust 制 | YAML + JS 模式定义，AST 级别匹配 |

**来源**：07

**选择原则**：

- [ ] 优先选择 Rust 制工具（速度快，Agent 等待时间短）
- [ ] 选择支持 `--fix` / `--autocorrect` 的工具（PostToolUse Hook 可自动修复）
- [ ] 错误消息越详细越好（Agent 依赖错误消息理解问题）
- [ ] 支持自定义规则的工具优先（可编码架构约束）

### 10.2 E2E 测试工具

#### Web 应用

| 工具 | Token 效率 | 适用场景 | 备注 |
|------|-----------|----------|------|
| **Playwright CLI** | 约 27K tokens/任务 | E2E 测试主力 | Token 效率是 MCP 的 4x |
| **agent-browser (Vercel Labs)** | 约 20K tokens/任务 | 高效 E2E | Token 效率是 MCP 的 5.7x，用元素引用 `@e1` |
| **Playwright MCP** | 约 114K tokens/任务 | 测试套件"生成" | 生态最成熟，v1.56+ 含子 Agent |

#### 移动应用

| 工具 | 平台 | 适用场景 |
|------|------|----------|
| **XcodeBuildMCP** | iOS | Xcode 项目构建与测试 |
| **mobile-mcp** | 跨平台 | 移动端通用测试 |
| **Detox** | React Native | RN 专用 E2E |
| **Maestro** | 跨平台 | 原型/快速验证 |

#### CLI / API / 后端

| 工具 | 类型 | 适用场景 | 备注 |
|------|------|----------|------|
| **Hurl** | API 测试 | HTTP 请求 + 断言 | Rust 制，Agent 友好度最高 |
| **bats-core** | CLI 测试 | Bash 脚本测试 | TAP 兼容 |
| **pexpect** | CLI 测试 | 交互式 CLI | Python |
| **Pact** | 契约测试 | 微服务 | 消费者驱动 |
| **Testcontainers** | 集成测试 | DB / 中间件 | Docker 容器化 |

#### 桌面应用

| 工具 | 平台 | 适用场景 |
|------|------|----------|
| **Playwright / WebdriverIO** | Electron | Web 技术桌面应用 |
| **TestDriver.ai** | 跨平台 | Computer-Use SDK |
| **Accessibility API MCP** | 各平台原生 | 原生桌面应用 |

#### 基础设施 / DevOps

| 工具 | 用途 |
|------|------|
| **terraform test** | Terraform 模块测试 |
| **Conftest / OPA** | 策略检查 |
| **container-structure-test** | 容器镜像验证 |
| **kubeconform** | K8s manifest 验证 |

**来源**：07

### 10.3 Codex vs Claude Code 对比

| 特性 | Codex | Claude Code |
|------|-------|-------------|
| **执行环境** | 云端沙箱（网络隔离容器） | 本地开发环境 |
| **并行执行** | 原生支持，异步任务队列 | 需手动多开会话 |
| **Hook 系统** | 仅 `notify`（`agent-turn-complete`） | 完整 4 类：PreToolUse / PostToolUse / Stop / PreCompact |
| **PostToolUse 质量循环** | 无 | 有（自动 lint + 反馈注入） |
| **MCP Tool Search** | 无 | 有（上下文消耗减少 85%） |
| **沙箱模式** | 默认隔离 | 需手动配置 |
| **Agent Teams** | 通过 Agents SDK | 原生支持 |
| **Plan Mode** | 无原生支持 | 原生 Plan Mode + Extended Thinking |
| **Automations 定期调度** | 有 | 无 |
| **App Server 协议** | 有 | 无 |
| **实时转向（Steering）** | 有 | 有 |
| **社区 Hook 需求** | 475+ upvote，OpenAI 正在开发 | 已实现 |

**来源**：07

### 10.4 混合策略

最优策略是结合两者的优势（来源：07）：

```
阶段 1：Claude Code（架构 / 规划）
  → Plan Mode + Extended Thinking
  → 制定执行计划、设计架构、拆分任务
  → 输出：feature_list.json + 架构 ADR

阶段 2：Codex（并行执行）
  → 异步沙箱并行处理多个独立任务
  → 每个任务在隔离环境中运行
  → 高吞吐量批量生产代码

阶段 3：Claude Code（Review / 迭代）
  → PostToolUse Hook 自动质量检查
  → Stop Hook 强制测试通过
  → 审查 Codex 产出，修复问题
  → 最终集成和验收
```

**决策框架**：

```
优先质量 → Claude Code 为主（Hooks 无替代方案）
优先吞吐量 → Codex 为主（异步沙箱无替代方案）
两者兼顾 → Claude Code 构建 Harness → Codex 规模化执行
```

---

## 附录

### 附录 A：前端项目 AGENTS.md 完整模板

```markdown
# AGENTS.md — [项目名] Frontend

## Build & Run
- `npm install` → 安装依赖
- `npm run dev` → 启动开发服务器 (localhost:3000)
- `npm run build` → 生产构建
- `npm run test` → 运行测试 (Vitest)
- `npm run test:e2e` → E2E 测试 (Playwright)

## Lint & Format
- `npx oxlint .` → Lint 检查
- `npx biome format --write .` → 格式化
- 不要修改 biome.json 或 .oxlintrc.json

## Architecture
- 分层：pages/ → components/ → hooks/ → lib/ → types/
- 禁止 components/ 直接导入 pages/
- 所有 API 调用通过 lib/api.ts
- 状态管理使用 Zustand (store/)
- 详见 docs/adr/ 目录

## Rules
- 一次只做一个功能
- 新组件必须有对应测试文件
- 使用 server components 除非需要交互
- 类型定义放在 types/ 目录，不要 inline
- 如果 3 次尝试未解决 bug，停止并报告

## Session Start
1. `git log --oneline -20`
2. `cat progress.json`
3. 选择下一个 pending 任务
4. `npm run dev` 验证环境
```

### 附录 B：后端项目 AGENTS.md 完整模板

```markdown
# AGENTS.md — [项目名] Backend

## Build & Run
- `uv sync` → 安装依赖
- `uv run uvicorn src.main:app --reload` → 启动 (localhost:8000)
- `uv run pytest` → 运行测试
- `uv run pytest --cov` → 测试覆盖率

## Lint & Format
- `ruff check .` → Lint 检查
- `ruff format .` → 格式化
- `uv run mypy src/` → 类型检查
- 不要修改 pyproject.toml 中的 [tool.ruff] 配置

## Architecture
- 分层：routers/ → services/ → repositories/ → models/ → schemas/
- 禁止 routers/ 直接导入 repositories/
- 所有配置通过 src/core/config.py (不用 os.getenv)
- 依赖注入使用 FastAPI Depends
- 详见 docs/adr/ 目录

## Rules
- 一次只做一个功能
- 新端点必须有对应测试
- 所有端点必须有 input validation (Pydantic)
- 数据库操作必须在 repository 层
- 如果 3 次尝试未解决 bug，停止并报告

## Session Start
1. `git log --oneline -20`
2. `cat progress.json`
3. 选择下一个 pending 任务
4. `uv run uvicorn src.main:app --reload` 验证环境
```

### 附录 C：CLAUDE.md 完整模板

```markdown
# CLAUDE.md — Claude Code 配置

## 环境
- 包管理器：前端 npm / 后端 uv
- 不要使用 os.getenv，使用 src/core/config.py

## 会话启动
1. `git log --oneline -20`
2. `cat progress.json`
3. 选择 status="pending" 且 priority 最高的任务
4. 验证开发服务器健康

## Git 规则
- 不要自动 commit（等我确认）
- commit message 最后写"下一步：..."
- 保持代码始终可合并

## 质量
- 前端：完成后运行 `npx oxlint . && npx biome format --write .`
- 后端：完成后运行 `ruff check --fix . && ruff format .`
- 新功能必须有测试
- 不要修改 linter 配置文件

## 禁止事项
- 不要删除测试文件
- 不要修改 .env / .env.local
- 不要使用 `--no-verify` 跳过 hooks
- 不要创建 README.md（除非我要求）
- 不要一次做多个功能

## 错误处理
- 如果 3 次尝试未解决，停止并报告
- 如果不确定架构决策，先问我
```

### 附录 D：ADR 模板

```markdown
# ADR-NNN: [决策标题]

## Status
Accepted | Superseded by ADR-XXX | Deprecated

## Date
2026-03-22

## Context
[描述面临的问题和约束条件]

## Decision
[做出的具体决策]

## Consequences
### 正面
- [好处 1]
- [好处 2]

### 负面
- [代价 1]
- [代价 2]

### 相关规则
- Linter 规则：[规则名/文件路径]（如有 archgate 绑定）

## References
- [相关文档/链接]
```

**关键原则**（来源：07）：
- ADR 具有不变性——只 supersede，不修改
- 带时间戳和状态，Agent 可结构化判断有效性
- 与 archgate 模式配合，可将 ADR 关联到 `.rules.ts` 文件

### 附录 E：feature_list.json 模板

```json
{
  "project": "项目名",
  "version": "0.1.0",
  "generated_by": "initializer_agent",
  "generated_at": "2026-03-22T08:00:00Z",
  "features": [
    {
      "id": "F-001",
      "title": "功能标题",
      "description": "功能描述（一句话）",
      "acceptance_criteria": [
        "验收标准 1",
        "验收标准 2"
      ],
      "test_steps": [
        "测试步骤 1",
        "测试步骤 2"
      ],
      "files_likely_touched": [
        "src/path/to/file.ts"
      ],
      "estimated_complexity": "low | medium | high",
      "depends_on": [],
      "status": "pending | in_progress | completed | blocked",
      "assigned_agent": null
    }
  ]
}
```

### 附录 F：progress.json 模板

```json
{
  "project": "项目名",
  "last_updated": "2026-03-22T10:00:00Z",
  "current_sprint": "v0.1.0",
  "tasks": [
    {
      "id": "TASK-001",
      "title": "任务标题",
      "status": "pending | in_progress | completed | blocked",
      "priority": 1,
      "type": "feature | bugfix | refactor | chore",
      "started_at": null,
      "completed_at": null,
      "commit": null,
      "subtasks": [
        { "name": "子任务名", "done": false }
      ],
      "depends_on": [],
      "blockers": [],
      "notes": ""
    }
  ],
  "known_issues": [],
  "tech_debt": []
}
```

### 附录 G：init.sh 模板

#### 前端项目

```bash
#!/bin/bash
# init.sh — 前端项目初始化脚本
set -euo pipefail

echo "=== 初始化前端项目 Harness ==="

# 1. 创建目录结构
mkdir -p docs/adr .claude/rules src/{pages,components,hooks,lib,types,store}

# 2. 安装核心工具
npm install --save-dev \
  oxlint \
  @biomejs/biome \
  vitest \
  @playwright/test \
  lefthook

# 3. 初始化 Biome 配置
cat > biome.json << 'BIOME'
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
BIOME

# 4. 初始化 Lefthook
cat > lefthook.yml << 'LEFTHOOK'
pre-commit:
  parallel: true
  commands:
    lint:
      run: npx oxlint {staged_files}
      glob: "*.{ts,tsx,js,jsx}"
    format:
      run: npx biome format --write {staged_files}
      glob: "*.{ts,tsx,js,jsx,json}"
    typecheck:
      run: npx tsc --noEmit
LEFTHOOK

npx lefthook install

# 5. 创建 AGENTS.md（从附录 A 复制或自定义）
echo "请手动创建 AGENTS.md（参考附录 A）"

# 6. 创建 progress.json
cat > progress.json << 'PROGRESS'
{
  "project": "my-frontend-app",
  "last_updated": "",
  "current_sprint": "v0.1.0",
  "tasks": [],
  "known_issues": [],
  "tech_debt": []
}
PROGRESS

# 7. 创建第一个 ADR
cat > docs/adr/ADR-001-project-setup.md << 'ADR'
# ADR-001: 项目初始化与工具链选择

## Status
Accepted

## Date
$(date +%Y-%m-%d)

## Context
项目启动，需要确定工具链和 Harness 配置。

## Decision
- Linter: Oxlint (Rust 制，高速)
- Formatter: Biome (Rust 制，统一配置)
- 测试: Vitest + Playwright
- Pre-commit: Lefthook
- 进度追踪: progress.json

## Consequences
### 正面
- 工具链统一，Agent 可快速上手
- Rust 制工具速度快，PostToolUse Hook 反馈延迟低

### 负面
- Oxlint 规则覆盖不如 ESLint 全面（持续改善中）
ADR

echo "=== 前端 Harness 初始化完成 ==="
```

#### 后端项目

```bash
#!/bin/bash
# init.sh — 后端项目初始化脚本
set -euo pipefail

echo "=== 初始化后端项目 Harness ==="

# 1. 创建目录结构
mkdir -p docs/adr .claude/rules src/{routers,services,repositories,models,schemas,core}

# 2. 初始化 Python 项目（使用 uv）
uv init --name my-backend-app 2>/dev/null || true
uv add fastapi uvicorn
uv add --dev pytest pytest-cov ruff mypy httpx lefthook

# 3. 配置 Ruff（在 pyproject.toml 中）
cat >> pyproject.toml << 'RUFF'

[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "UP", "B", "A", "SIM", "TCH"]
ignore = []

[tool.ruff.format]
quote-style = "double"

[tool.mypy]
strict = true
python_version = "3.12"

[tool.pytest.ini_options]
testpaths = ["tests"]
RUFF

# 4. 初始化 Lefthook
cat > lefthook.yml << 'LEFTHOOK'
pre-commit:
  parallel: true
  commands:
    lint:
      run: ruff check {staged_files}
      glob: "*.py"
    format:
      run: ruff format {staged_files}
      glob: "*.py"
    typecheck:
      run: uv run mypy src/
LEFTHOOK

lefthook install 2>/dev/null || npx lefthook install

# 5. 创建核心配置文件
cat > src/core/__init__.py << 'INIT'
INIT

cat > src/core/config.py << 'CONFIG'
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "my-backend-app"
    debug: bool = False
    database_url: str = "sqlite:///./app.db"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
CONFIG

# 6. 创建 progress.json
cat > progress.json << 'PROGRESS'
{
  "project": "my-backend-app",
  "last_updated": "",
  "current_sprint": "v0.1.0",
  "tasks": [],
  "known_issues": [],
  "tech_debt": []
}
PROGRESS

# 7. 创建测试目录
mkdir -p tests
cat > tests/__init__.py << 'INIT'
INIT

echo "=== 后端 Harness 初始化完成 ==="
```

### 附录 H：Hook 配置完整集合

#### settings.json（Claude Code）

```json
// ~/.claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/pre_tool_use.sh \"$TOOL_NAME\" \"$TOOL_INPUT\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/post_tool_use.sh \"$TOOL_NAME\" \"$TOOL_INPUT\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/stop_hook.sh"
          }
        ]
      }
    ]
  }
}
```

#### PreToolUse 脚本

```bash
#!/bin/bash
# ~/.claude/hooks/pre_tool_use.sh
# Safety Gate: 阻止破坏性操作和配置篡改
set -euo pipefail

TOOL_NAME="$1"
TOOL_INPUT="$2"

# 1. 阻止修改 linter 配置文件
PROTECTED_FILES=(
  "biome.json"
  ".oxlintrc.json"
  ".eslintrc"
  ".eslintrc.js"
  ".eslintrc.json"
  "pyproject.toml"  # [tool.ruff] 部分
  ".ruff.toml"
  ".prettierrc"
  "lefthook.yml"
)

for file in "${PROTECTED_FILES[@]}"; do
  if echo "$TOOL_INPUT" | grep -q "$file"; then
    echo "BLOCKED: 禁止修改 $file。请修复代码而非修改 linter 配置。" >&2
    exit 2
  fi
done

# 2. 阻止修改环境变量文件
if echo "$TOOL_INPUT" | grep -qE '\.(env|env\.local|env\.production)'; then
  echo "BLOCKED: 禁止修改 .env 文件。环境变量由人工管理。" >&2
  exit 2
fi

# 3. 阻止破坏性 Bash 命令
if [ "$TOOL_NAME" = "Bash" ]; then
  if echo "$TOOL_INPUT" | grep -qE 'rm\s+-rf|drop\s+table|truncate\s+table|--no-verify|--force'; then
    echo "BLOCKED: 检测到破坏性命令。请使用更安全的替代方案。" >&2
    exit 2
  fi
fi

# 通过检查
exit 0
```

#### PostToolUse 脚本

```bash
#!/bin/bash
# ~/.claude/hooks/post_tool_use.sh
# Quality Loop: 文件编辑后自动 lint + format
set -euo pipefail

TOOL_NAME="$1"
TOOL_INPUT="$2"

# 提取被修改的文件路径
FILE_PATH=$(echo "$TOOL_INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

EXTENSION="${FILE_PATH##*.}"
VIOLATIONS=""

case "$EXTENSION" in
  ts|tsx|js|jsx)
    # 自动格式化（静默修复）
    npx biome format --write "$FILE_PATH" 2>/dev/null || true

    # Lint 检查（收集残余违规）
    LINT_OUTPUT=$(npx oxlint "$FILE_PATH" 2>&1) || true
    if echo "$LINT_OUTPUT" | grep -q "error\|warning"; then
      VIOLATIONS="$LINT_OUTPUT"
    fi
    ;;
  py)
    # 自动格式化
    ruff format "$FILE_PATH" 2>/dev/null || true

    # Lint 检查
    LINT_OUTPUT=$(ruff check "$FILE_PATH" 2>&1) || true
    if echo "$LINT_OUTPUT" | grep -q "error\|warning"; then
      VIOLATIONS="$LINT_OUTPUT"
    fi
    ;;
  go)
    gofmt -w "$FILE_PATH" 2>/dev/null || true
    LINT_OUTPUT=$(golangci-lint run "$FILE_PATH" 2>&1) || true
    if [ -n "$LINT_OUTPUT" ]; then
      VIOLATIONS="$LINT_OUTPUT"
    fi
    ;;
esac

# 如果有残余违规，通过 JSON 格式注入 Agent 上下文
if [ -n "$VIOLATIONS" ]; then
  cat << EOF
{
  "hookSpecificOutput": {
    "additionalContext": "Lint violations found after editing $FILE_PATH:\n$VIOLATIONS\nPlease fix these issues."
  }
}
EOF
fi

exit 0
```

#### Stop Hook 脚本

```bash
#!/bin/bash
# ~/.claude/hooks/stop_hook.sh
# Completion Gate: Agent 尝试停止时强制运行测试
set -euo pipefail

# 防止无限循环
STOP_HOOK_FLAG="/tmp/.stop_hook_active"
if [ -f "$STOP_HOOK_FLAG" ]; then
  rm -f "$STOP_HOOK_FLAG"
  exit 0
fi

touch "$STOP_HOOK_FLAG"

# 检测项目类型并运行测试
if [ -f "package.json" ]; then
  echo "Running frontend tests before stopping..."
  TEST_OUTPUT=$(npm run test -- --run 2>&1) || TEST_EXIT=$?

  if [ "${TEST_EXIT:-0}" -ne 0 ]; then
    rm -f "$STOP_HOOK_FLAG"
    cat << EOF
{
  "hookSpecificOutput": {
    "additionalContext": "Tests failed. You cannot stop until all tests pass.\n\nTest output:\n$TEST_OUTPUT"
  }
}
EOF
    exit 1
  fi
fi

if [ -f "pyproject.toml" ]; then
  echo "Running backend tests before stopping..."
  TEST_OUTPUT=$(uv run pytest --tb=short 2>&1) || TEST_EXIT=$?

  if [ "${TEST_EXIT:-0}" -ne 0 ]; then
    rm -f "$STOP_HOOK_FLAG"
    cat << EOF
{
  "hookSpecificOutput": {
    "additionalContext": "Tests failed. You cannot stop until all tests pass.\n\nTest output:\n$TEST_OUTPUT"
  }
}
EOF
    exit 1
  fi
fi

rm -f "$STOP_HOOK_FLAG"
echo "All tests passed. Agent may stop."
exit 0
```

### 附录 I：自定义 Linter 规则示例

#### ESLint / Oxlint 规则（前端）

使用 `eslint-plugin-local-rules`（无需 npm 发布）：

```javascript
// eslint-local-rules/no-direct-api-call.js
// 规则：组件中禁止直接调用 fetch/axios，必须通过 lib/api.ts
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "禁止在组件中直接调用 API",
    },
    messages: {
      noDirectApiCall: [
        "ERROR: 组件中禁止直接调用 {{ name }}。",
        "WHY: 所有 API 调用必须通过 lib/api.ts 集中管理，便于统一错误处理和缓存。",
        "FIX: 在 lib/api.ts 中创建一个函数，然后在组件中导入使用。",
        "EXAMPLE:",
        "  BAD:  const res = await fetch('/api/users')",
        "  GOOD: import { getUsers } from '@/lib/api'; const users = await getUsers()",
        "REF: docs/adr/ADR-003-api-layer.md",
      ].join("\n"),
    },
  },
  create(context) {
    const filePath = context.getFilename();
    // 只在 components/ 和 pages/ 目录下检查
    if (!filePath.includes("/components/") && !filePath.includes("/pages/")) {
      return {};
    }
    return {
      CallExpression(node) {
        if (
          node.callee.name === "fetch" ||
          (node.callee.object && node.callee.object.name === "axios")
        ) {
          context.report({
            node,
            messageId: "noDirectApiCall",
            data: { name: node.callee.name || "axios" },
          });
        }
      },
    };
  },
};
```

#### Ruff 自定义规则（后端）

Ruff 目前不支持自定义规则插件，但可通过以下方式实现等效效果：

```python
# tests/test_architecture.py
# 架构测试：用 pytest 实现架构约束检查
import ast
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent


def get_imports(file_path: str) -> list[str]:
    """提取文件中的所有 import 模块名。"""
    with open(file_path) as f:
        tree = ast.parse(f.read())
    imports = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.append(node.module)
    return imports


def test_routers_do_not_import_repositories():
    """
    ERROR: routers/ 禁止直接导入 repositories/
    WHY: 路由层必须通过 services/ 层访问数据，保持分层架构
    FIX: 将数据访问逻辑移到 services/ 层
    REF: docs/adr/ADR-002-layered-architecture.md
    """
    router_dir = PROJECT_ROOT / "src" / "routers"
    if not router_dir.exists():
        return
    for py_file in router_dir.glob("*.py"):
        imports = get_imports(str(py_file))
        for imp in imports:
            assert "repositories" not in imp, (
                f"{py_file.name} 直接导入了 repositories 层。"
                f"请通过 services/ 层访问数据。"
                f"参考 docs/adr/ADR-002-layered-architecture.md"
            )


def test_no_os_getenv():
    """
    ERROR: 禁止使用 os.getenv()
    WHY: 所有环境变量必须通过 src/core/config.py 管理
    FIX: from src.core.config import get_settings; settings = get_settings()
    REF: docs/adr/ADR-001-config-management.md
    """
    src_dir = PROJECT_ROOT / "src"
    for py_file in src_dir.rglob("*.py"):
        if "core/config.py" in str(py_file):
            continue
        content = py_file.read_text()
        assert "os.getenv" not in content and "os.environ" not in content, (
            f"{py_file} 使用了 os.getenv/os.environ。"
            f"请使用 src/core/config.py 中的 get_settings()。"
        )


def test_all_routers_have_tests():
    """每个路由文件必须有对应的测试文件。"""
    router_dir = PROJECT_ROOT / "src" / "routers"
    test_dir = PROJECT_ROOT / "tests"
    if not router_dir.exists():
        return
    for py_file in router_dir.glob("*.py"):
        if py_file.name.startswith("__"):
            continue
        test_file = test_dir / f"test_{py_file.name}"
        assert test_file.exists(), (
            f"路由文件 {py_file.name} 缺少对应测试文件 tests/test_{py_file.name}"
        )
```

#### ast-grep YAML 规则

```yaml
# .ast-grep/rules/no-console-log.yml
# 生产代码中禁止 console.log（测试文件除外）
id: no-console-log-in-production
language: typescript
rule:
  pattern: console.log($$$)
  not:
    inside:
      kind: call_expression
      stopBy: end
constraints:
  # 排除测试文件
  NOT_MATCH:
    regex: "\\.(test|spec)\\.(ts|tsx|js|jsx)$"
message: |
  ERROR: 生产代码中禁止使用 console.log
  WHY: 使用结构化日志（logger.info/debug/error）便于监控和调试
  FIX: import { logger } from '@/lib/logger'; logger.info('message', { data })
  REF: docs/adr/ADR-005-logging.md
severity: error
fix: "logger.info($$$)"

---
# .ast-grep/rules/no-any-type.yml
# 禁止使用 any 类型
id: no-any-type
language: typescript
rule:
  pattern: "$VAR: any"
message: |
  ERROR: 禁止使用 any 类型
  WHY: any 绕过了 TypeScript 类型系统，Agent 生成的代码更容易引入类型错误
  FIX: 使用具体类型或 unknown，然后用 type guard 收窄
severity: error

---
# .ast-grep/rules/enforce-error-handling.yml
# API 调用必须有错误处理
id: enforce-api-error-handling
language: typescript
rule:
  pattern: await fetch($$$)
  not:
    inside:
      kind: try_statement
message: |
  ERROR: API 调用必须包含错误处理
  WHY: 未处理的 API 错误会导致页面白屏
  FIX: 将 fetch 调用包裹在 try/catch 中，或使用 lib/api.ts 的封装函数
severity: error
```

---

> **来源标注**：
> - 01 = OpenAI "Harness Engineering" (Ryan Lopopolo, 2026-02-11)
> - 04b = LangChain "The Anatomy of an Agent Harness" (Viv, 2026-03-10)
> - 06 = "The Emerging Harness Engineering Playbook" (Charlie Guo, 2026-02-22)
> - 07 = "Claude Code / Codex Harness Engineering 最佳实践" (逆瀬川, 2026-03-09)
