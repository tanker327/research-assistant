# GitHub：shanraisshan/claude-code-best-practice

**來源：** https://github.com/shanraisshan/claude-code-best-practice

---

# claude-code-best-practice
熟能生巧，讓 Claude 更完美

![updated with Claude Code](https://img.shields.io/badge/updated_with_Claude_Code-v2.1.81%20(Mar%2022%2C%202026%209%3A20%20PM%20PKT)-white?style=flat&labelColor=555) <a href="https://github.com/shanraisshan/claude-code-best-practice/stargazers"><img src="https://img.shields.io/github/stars/shanraisshan/claude-code-best-practice?style=flat&label=%E2%98%85&labelColor=555&color=white" alt="GitHub Stars"></a><br>

[![Best Practice](!/tags/best-practice.svg)](best-practice/) [![Implemented](!/tags/implemented.svg)](implementation/) [![Orchestration Workflow](!/tags/orchestration-workflow.svg)](orchestration-workflow/orchestration-workflow.md) [![Boris](!/tags/boris-cherny.svg)](#-tips-and-tricks) ![Click on these badges below to see the actual sources](!/tags/click-badges.svg)<br>
<img src="a.svg" height="14"> = 代理人（Agents） · <img src="c.svg" height="14"> = 指令（Commands） · <img src="s.svg" height="14"> = 技能（Skills）

<p align="center">
  <img src="!/claude-jumping.svg" alt="Claude Code 吉祥物跳躍" width="120" height="100"><br>
  <a href="https://github.com/trending"><img src="!/root/github-trending-day.svg" alt="GitHub 當日熱門第一名倉庫"></a>
</p>

<p align="center">
  <img src="!/root/boris-slider.gif" alt="Boris Cherny 談論 Claude Code" width="600"><br>
  Boris Cherny 在 X 上（<a href="https://x.com/bcherny/status/2007179832300581177">推文一</a> · <a href="https://x.com/bcherny/status/2017742741636321619">推文二</a> · <a href="https://x.com/bcherny/status/2021699851499798911">推文三</a>）
</p>


## 🧠 概念

| 功能 | 位置 | 說明 |
|---------|----------|-------------|
| <img src="a.svg" height="14"> [**子代理人（Subagents）**](https://code.claude.com/docs/en/sub-agents) | `.claude/agents/<name>.md` | [![Best Practice](!/tags/best-practice.svg)](best-practice/claude-subagents.md) [![Implemented](!/tags/implemented.svg)](implementation/claude-subagents-implementation.md) 在全新隔離上下文中運作的自主執行者，擁有自訂工具、權限、模型、記憶體及持久身份 |
| <img src="c.svg" height="14"> [**指令（Commands）**](https://code.claude.com/docs/en/slash-commands) | `.claude/commands/<name>.md` | [![Best Practice](!/tags/best-practice.svg)](best-practice/claude-commands.md) [![Implemented](!/tags/implemented.svg)](implementation/claude-commands-implementation.md) 注入現有上下文的知識，是用戶可呼叫的簡單提示模板，用於工作流程編排 |
| <img src="s.svg" height="14"> [**技能（Skills）**](https://code.claude.com/docs/en/skills) | `.claude/skills/<name>/SKILL.md` | [![Best Practice](!/tags/best-practice.svg)](best-practice/claude-skills.md) [![Implemented](!/tags/implemented.svg)](implementation/claude-skills-implementation.md) 注入現有上下文的知識，可設定、可預載、可自動探索，支援上下文分叉與漸進式揭露 · [官方技能](https://github.com/anthropics/skills/tree/main/skills) |
| [**工作流程（Workflows）**](https://code.claude.com/docs/en/common-workflows) | [`.claude/commands/weather-orchestrator.md`](.claude/commands/weather-orchestrator.md) | [![Orchestration Workflow](!/tags/orchestration-workflow.svg)](orchestration-workflow/orchestration-workflow.md) |
| [**鉤子（Hooks）**](https://code.claude.com/docs/en/hooks) | `.claude/hooks/` | [![Best Practice](!/tags/best-practice.svg)](https://github.com/shanraisshan/claude-code-hooks) [![Implemented](!/tags/implemented.svg)](https://github.com/shanraisshan/claude-code-hooks) 使用者定義的處理器（腳本、HTTP、提示、代理人），在特定事件觸發時於代理迴圈外執行 · [指南](https://code.claude.com/docs/en/hooks-guide) |
| [**MCP 伺服器**](https://code.claude.com/docs/en/mcp) | `.claude/settings.json`、`.mcp.json` | [![Best Practice](!/tags/best-practice.svg)](best-practice/claude-mcp.md) [![Implemented](!/tags/implemented.svg)](.mcp.json) 模型上下文協定，連接外部工具、資料庫與 API |
| [**插件（Plugins）**](https://code.claude.com/docs/en/plugins) | 可發布的套件 | 技能、子代理人、鉤子與 MCP 伺服器的組合包 · [市集](https://code.claude.com/docs/en/discover-plugins) · [建立市集](https://code.claude.com/docs/en/plugin-marketplaces) |
| [**設定（Settings）**](https://code.claude.com/docs/en/settings) | `.claude/settings.json` | [![Best Practice](!/tags/best-practice.svg)](best-practice/claude-settings.md) [![Implemented](!/tags/implemented.svg)](.claude/settings.json) 階層式設定系統 · [權限](https://code.claude.com/docs/en/permissions) · [模型設定](https://code.claude.com/docs/en/model-config) · [輸出樣式](https://code.claude.com/docs/en/output-styles) · [沙箱](https://code.claude.com/docs/en/sandboxing) · [快捷鍵](https://code.claude.com/docs/en/keybindings) · [快速模式](https://code.claude.com/docs/en/fast-mode) |
| [**狀態列（Status Line）**](https://code.claude.com/docs/en/statusline) | `.claude/settings.json` | [![Best Practice](!/tags/best-practice.svg)](https://github.com/shanraisshan/claude-code-status-line) [![Implemented](!/tags/implemented.svg)](.claude/settings.json) 可自訂的狀態欄，顯示上下文用量、模型、費用與工作階段資訊 |
| [**記憶體（Memory）**](https://code.claude.com/docs/en/memory) | `CLAUDE.md`、`.claude/rules/`、`~/.claude/rules/`、`~/.claude/projects/<project>/memory/` | [![Best Practice](!/tags/best-practice.svg)](best-practice/claude-memory.md) [![Implemented](!/tags/implemented.svg)](CLAUDE.md) 透過 CLAUDE.md 檔案與 `@path` 匯入保存持久上下文 · [自動記憶體](https://code.claude.com/docs/en/memory) · [規則](https://code.claude.com/docs/en/memory#organize-rules-with-clauderules) |
| [**檢查點（Checkpointing）**](https://code.claude.com/docs/en/checkpointing) | 自動（基於 git） | 自動追蹤檔案編輯，支援回溯（`Esc Esc` 或 `/rewind`）與針對性摘要 |
| [**CLI 啟動旗標**](https://code.claude.com/docs/en/cli-reference) | `claude [flags]` | [![Best Practice](!/tags/best-practice.svg)](best-practice/claude-cli-startup-flags.md) 啟動 Claude Code 的命令列旗標、子指令與環境變數 · [互動模式](https://code.claude.com/docs/en/interactive-mode) |
| **AI 術語** | | [![Best Practice](!/tags/best-practice.svg)](https://github.com/shanraisshan/claude-code-codex-cursor-gemini/blob/main/reports/ai-terms.md) 代理工程 · 上下文工程 · 氛圍程式設計 |
| [**最佳實踐**](https://code.claude.com/docs/en/best-practices) | | 官方最佳實踐 · [提示工程](https://github.com/anthropics/prompt-eng-interactive-tutorial) · [擴充 Claude Code](https://code.claude.com/docs/en/features-overview) |

### 🔥 熱門功能

| 功能 | 位置 | 說明 |
|---------|----------|-------------|
| [**頻道（Channels）**](https://code.claude.com/docs/en/channels) ![beta](!/tags/beta.svg) | `--channels`、基於插件 | 從 Telegram、Discord 或 Webhook 推送事件至正在執行的工作階段，Claude 在你不在時自動回應 · [參考資料](https://code.claude.com/docs/en/channels-reference) |
| [**程式碼審查（Code Review）**](https://code.claude.com/docs/en/code-review) ![beta](!/tags/beta.svg) | GitHub App（受管） | [![Best Practice](!/tags/best-practice.svg)](https://x.com/claudeai/status/2031088171262554195) 多代理人 PR 分析，能發現錯誤、安全漏洞與迴歸問題 · [部落格](https://claude.com/blog/code-review) |
| [**排程任務（Scheduled Tasks）**](https://code.claude.com/docs/en/scheduled-tasks) | `/loop`、cron 工具 | [![Best Practice](!/tags/best-practice.svg)](https://x.com/bcherny/status/2030193932404150413) [![Implemented](!/tags/implemented.svg)](implementation/claude-scheduled-tasks-implementation.md) 以循環排程執行提示（最多 3 天），設定一次性提醒，輪詢部署與建置 |
| [**語音輸入（Voice Dictation）**](https://code.claude.com/docs/en/voice-dictation) ![beta](!/tags/beta.svg) | `/voice` | [![Best Practice](!/tags/best-practice.svg)](https://x.com/trq212/status/2028628570692890800) 支援 20 種語言的按壓即說語音輸入，可重新綁定啟動鍵 |
| [**簡化與批次（Simplify & Batch）**](https://x.com/bcherny/status/2027534984534544489) | `/simplify`、`/batch` | [![Best Practice](!/tags/best-practice.svg)](https://x.com/bcherny/status/2027534984534544489) 用於程式碼品質與批量操作的內建技能，simplify 重構以提升複用性與效率，batch 對多個檔案執行指令 |
| [**代理人團隊（Agent Teams）**](https://code.claude.com/docs/en/agent-teams) ![beta](!/tags/beta.svg) | 內建（環境變數） | [![Best Practice](!/tags/best-practice.svg)](https://x.com/bcherny/status/2019472394696683904) [![Implemented](!/tags/implemented.svg)](implementation/claude-agent-teams-implementation.md) 多個代理人在同一程式碼庫上平行運作，共享任務協調 |
| [**遠端控制（Remote Control）**](https://code.claude.com/docs/en/remote-control) | `/remote-control`、`/rc` | [![Best Practice](!/tags/best-practice.svg)](https://x.com/noahzweben/status/2032533699116355819) 從任何裝置（手機、平板或瀏覽器）繼續本地工作階段 · [無頭模式](https://code.claude.com/docs/en/headless) |
| [**Git 工作樹（Git Worktrees）**](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) | 內建 | [![Best Practice](!/tags/best-practice.svg)](https://x.com/bcherny/status/2025007393290272904) 用於平行開發的隔離 git 分支，每個代理人擁有自己的工作副本 |
| [**Ralph Wiggum 迴圈**](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) | 插件 | [![Best Practice](!/tags/best-practice.svg)](https://github.com/ghuntley/how-to-ralph-wiggum) [![Implemented](!/tags/implemented.svg)](https://github.com/shanraisshan/novel-llm-26) 長時間執行任務的自主開發迴圈，持續迭代直到完成 |

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

<a id="orchestration-workflow"></a>

## <a href="orchestration-workflow/orchestration-workflow.md"><img src="!/tags/orchestration-workflow-hd.svg" alt="編排工作流程"></a>

請參閱 [orchestration-workflow](orchestration-workflow/orchestration-workflow.md) 以了解 <img src="c.svg" height="14"> **指令** → <img src="a.svg" height="14"> **代理人** → <img src="s.svg" height="14"> **技能** 模式的實作細節。


<p align="center">
  <img src="orchestration-workflow/orchestration-workflow.svg" alt="指令技能代理人架構流程" width="100%">
</p>

<p align="center">
  <img src="orchestration-workflow/orchestration-workflow.gif" alt="編排工作流程示範" width="600">
</p>

![如何使用](!/tags/how-to-use.svg)

```bash
claude
/weather-orchestrator
```

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

## ⚙️ 開發工作流程

所有主要工作流程都收斂於相同的架構模式：**研究 → 規劃 → 執行 → 審查 → 發布**

| 名稱 | ★ | 獨特性 | 規劃 | <img src="a.svg" height="14"> | <img src="c.svg" height="14"> | <img src="s.svg" height="14"> |
|------|---|------------|------|---|---|---|
| [Superpowers](https://github.com/obra/superpowers) | 103k | ![TDD-first](https://img.shields.io/badge/TDD--first-ddf4ff) ![Iron Laws](https://img.shields.io/badge/Iron_Laws-ddf4ff) ![whole-plan review](https://img.shields.io/badge/whole--plan_review-ddf4ff) | <img src="s.svg" height="14"> [writing-plans](https://github.com/obra/superpowers/tree/main/skills/writing-plans) | 5 | 3 | 14 |
| [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) | 93k | ![instinct scoring](https://img.shields.io/badge/instinct_scoring-ddf4ff) ![AgentShield](https://img.shields.io/badge/AgentShield-ddf4ff) ![multi-lang rules](https://img.shields.io/badge/multi--lang_rules-ddf4ff) | <img src="a.svg" height="14"> [planner](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 28 | 59 | 116 |
| [Spec Kit](https://github.com/github/spec-kit) | 79k | ![spec-driven](https://img.shields.io/badge/spec--driven-ddf4ff) ![constitution](https://img.shields.io/badge/constitution-ddf4ff) ![22+ tools](https://img.shields.io/badge/22%2B_tools-ddf4ff) | <img src="c.svg" height="14"> [speckit.plan](https://github.com/github/spec-kit/blob/main/templates/commands/plan.md) | 0 | 9+ | 0 |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 42k | ![full SDLC](https://img.shields.io/badge/full_SDLC-ddf4ff) ![agent personas](https://img.shields.io/badge/agent_personas-ddf4ff) ![22+ platforms](https://img.shields.io/badge/22%2B_platforms-ddf4ff) | <img src="s.svg" height="14"> [bmad-create-prd](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/bmm-skills/2-plan-workflows/bmad-create-prd) | 0 | 0 | 42 |
| [Get Shit Done](https://github.com/gsd-build/get-shit-done) | 38k | ![fresh 200K contexts](https://img.shields.io/badge/fresh_200K_contexts-ddf4ff) ![wave execution](https://img.shields.io/badge/wave_execution-ddf4ff) ![XML plans](https://img.shields.io/badge/XML_plans-ddf4ff) | <img src="a.svg" height="14"> [gsd-planner](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-planner.md) | 18 | 52 | 0 |
| [gstack](https://github.com/garrytan/gstack) | 34k | ![role personas](https://img.shields.io/badge/role_personas-ddf4ff) ![/codex review](https://img.shields.io/badge/%2Fcodex_review-ddf4ff) ![parallel sprints](https://img.shields.io/badge/parallel_sprints-ddf4ff) | <img src="s.svg" height="14"> [plan-eng-review](https://github.com/garrytan/gstack/tree/main/plan-eng-review) | 0 | 0 | 21 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 33k | ![delta specs](https://img.shields.io/badge/delta_specs-ddf4ff) ![brownfield](https://img.shields.io/badge/brownfield-ddf4ff) ![artifact DAG](https://img.shields.io/badge/artifact_DAG-ddf4ff) | <img src="c.svg" height="14"> [opsx:propose](https://github.com/Fission-AI/OpenSpec/blob/main/src/commands/workflow/new-change.ts) | 0 | 11 | 11 |
| [HumanLayer](https://github.com/humanlayer/humanlayer) | 10k | ![RPI](https://img.shields.io/badge/RPI-ddf4ff) ![context engineering](https://img.shields.io/badge/context_engineering-ddf4ff) ![300k+ LOC](https://img.shields.io/badge/300k%2B_LOC-ddf4ff) | <img src="c.svg" height="14"> [create_plan](https://github.com/humanlayer/humanlayer/blob/main/.claude/commands/create_plan.md) | 6 | 27 | 0 |

### 其他
- [跨模型工作流程（Claude Code + Codex）](development-workflows/cross-model-workflow/cross-model-workflow.md) [![Implemented](!/tags/implemented.svg)](development-workflows/cross-model-workflow/cross-model-workflow.md)
- [RPI](development-workflows/rpi/rpi-workflow.md) [![Implemented](!/tags/implemented.svg)](development-workflows/rpi/rpi-workflow.md)
- [Ralph Wiggum 迴圈](https://www.youtube.com/watch?v=eAtvoGlpeRU) [![Implemented](!/tags/implemented.svg)](https://github.com/shanraisshan/novel-llm-26)
- [Andrej Karpathy（OpenAI 創始成員）工作流程](https://x.com/karpathy/status/2015883857489522876)
- [Peter Steinberger（OpenClaw 創作者）工作流程](https://youtu.be/8lF7HmQ_RgY?t=2582)
- Boris Cherny（Claude Code 創作者）工作流程 — [13 個技巧](tips/claude-boris-13-tips-03-jan-26.md) · [10 個技巧](tips/claude-boris-10-tips-01-feb-26.md) · [12 個技巧](tips/claude-boris-12-tips-12-feb-26.md) [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny)

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

## 💡 技巧與竅門（84 則）

🚫👶 = 不要過度手把手

[提示](#tips-prompting) · [規劃](#tips-planning) · [CLAUDE.md](#tips-claudemd) · [代理人](#tips-agents) · [指令](#tips-commands) · [技能](#tips-skills) · [鉤子](#tips-hooks) · [工作流程](#tips-workflows) · [進階](#tips-workflows-advanced) · [除錯](#tips-debugging) · [工具](#tips-utilities) · [日常](#tips-daily)

![Community](!/tags/community.svg)

<a id="tips-prompting"></a>■ **提示（3 則）**

| 技巧 | 來源 |
|-----|--------|
| 挑戰 Claude——「考考我這些改動，在我通過你的測試之前不要建立 PR。」或「向我證明這是可行的」，並讓 Claude 比較 main 分支與你的分支差異 🚫👶 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742752566632544) |
| 在一個平庸的修復之後——「把你現在知道的一切都放進去，捨棄這個方案，實作更優雅的解決方案」 🚫👶 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742752566632544) |
| Claude 大多數時候能自行修復 bug——貼上 bug，說「修復它」，不要微管理怎麼做 🚫👶 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742750473720121) |

<a id="tips-planning"></a>■ **規劃/規格（6 則）**

| 技巧 | 來源 |
|-----|--------|
| 一律從[規劃模式](https://code.claude.com/docs/en/common-workflows)開始 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179845336527000) |
| 從最小規格或提示開始，要求 Claude 使用 [AskUserQuestion](https://code.claude.com/docs/en/cli-reference) 工具訪問你，然後開新工作階段執行規格 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2005315275026260309) |
| 務必制定分階段、有閘門的計畫，每個階段包含多項測試（單元測試、自動化測試、整合測試） | |
| 啟動第二個 Claude 以資深工程師身份審查你的計畫，或使用[跨模型](development-workflows/cross-model-workflow/cross-model-workflow.md)進行審查 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742745365057733) |
| 移交工作前要撰寫詳細規格並減少模糊性——你越具體，輸出品質越好 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742752566632544) |
| 原型優先於 PRD——建立 20-30 個版本，而非撰寫規格；建置成本低，因此要多多嘗試 | [![Boris](!/tags/boris-cherny.svg)](https://youtu.be/julbw1JuAz0?t=3630) [![Video](!/tags/video.svg)](https://youtu.be/julbw1JuAz0?t=3630) |

<a id="tips-claudemd"></a>■ **CLAUDE.md（7 則）**

| 技巧 | 來源 |
|-----|--------|
| [CLAUDE.md](https://code.claude.com/docs/en/memory) 每個檔案應控制在[200 行](https://code.claude.com/docs/en/memory#write-effective-instructions)以下。[humanlayer 僅用了 60 行](https://www.humanlayer.dev/blog/writing-a-good-claude-md)（[仍非 100% 保證有效](https://www.reddit.com/r/ClaudeCode/comments/1qn9pb9/claudemd_says_must_use_agent_claude_ignores_it_80/)） | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179840848597422) [![Dex](!/tags/dex.svg)](https://www.humanlayer.dev/blog/writing-a-good-claude-md) |
| 將特定領域的 CLAUDE.md 規則包裝在 [\<important if="..."\> 標籤](https://www.hlyr.dev/blog/stop-claude-from-ignoring-your-claude-md)中，防止隨著檔案增長 Claude 忽略它們 | [![Dex](!/tags/dex.svg)](https://www.hlyr.dev/blog/stop-claude-from-ignoring-your-claude-md) |
| 在 monorepo 中使用[多個 CLAUDE.md](best-practice/claude-memory.md)——祖先與後代載入 | |
| 使用 [.claude/rules/](https://code.claude.com/docs/en/memory#organize-rules-with-clauderules) 拆分大型指令 | |
| [memory.md](https://code.claude.com/docs/en/memory)、constitution.md 無法保證任何事情 | |
| 任何開發者都應該能啟動 Claude，說「執行測試」，並在第一次嘗試就成功——如果做不到，你的 CLAUDE.md 缺少必要的設定/建置/測試指令 | [![Dex](!/tags/dex.svg)](https://x.com/dexhorthy/status/2034713765401551053) |
| 保持程式碼庫整潔並完成遷移——部分遷移的框架會讓模型困惑，可能選擇錯誤的模式 | [![Boris](!/tags/boris-cherny.svg)](https://youtu.be/julbw1JuAz0?t=1112) [![Video](!/tags/video.svg)](https://youtu.be/julbw1JuAz0?t=1112) |

<a id="tips-agents"></a><img src="a.svg" height="14"> **代理人（4 則）**

| 技巧 | 來源 |
|-----|--------|
| 使用功能特定的[子代理人](https://code.claude.com/docs/en/sub-agents)（額外上下文）搭配[技能](https://code.claude.com/docs/en/skills)（漸進式揭露），而非通用的 QA 或後端工程師 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179850139000872) |
| 說「使用子代理人」以投入更多運算力處理問題——將任務卸載給子代理人以保持主上下文乾淨專注 🚫👶 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742755737555434) |
| 使用[代理人團隊搭配 tmux](https://code.claude.com/docs/en/agent-teams) 和 [git 工作樹](https://x.com/bcherny/status/2025007393290272904)進行平行開發 | |
| 善用[測試時間運算](https://code.claude.com/docs/en/sub-agents)——分開的上下文視窗能讓結果更好；一個代理人可能造成 bug，另一個（相同模型）能找出它們 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2031151689219321886) |

<a id="tips-commands"></a><img src="c.svg" height="14"> **指令（3 則）**

| 技巧 | 來源 |
|-----|--------|
| 在工作流程中使用[指令](https://code.claude.com/docs/en/slash-commands)而非[子代理人](https://code.claude.com/docs/en/sub-agents) | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179847949500714) |
| 為每天重複多次的「內部循環」工作流程使用[斜線指令](https://code.claude.com/docs/en/slash-commands)——省去重複提示，指令存放於 `.claude/commands/` 並納入 git 版控 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179847949500714) |
| 如果你每天做某件事超過一次，就把它變成[技能](https://code.claude.com/docs/en/skills)或[指令](https://code.claude.com/docs/en/slash-commands)——建立 `/techdebt`、上下文傾印或分析指令 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742748984742078) |

<a id="tips-skills"></a><img src="s.svg" height="14"> **技能（9 則）**

| 技巧 | 來源 |
|-----|--------|
| 使用 [context: fork](https://code.claude.com/docs/en/skills) 在隔離子代理人中執行技能——主上下文只看到最終結果，不看中間的工具呼叫。agent 欄位可設定子代理人類型 | [![Lydia](!/tags/lydia.svg)](https://x.com/lydiahallie/status/2033603164398883042) |
| 在 monorepo 中使用[子資料夾中的技能](reports/claude-skills-for-larger-mono-repos.md) | |
| 技能是資料夾，不是檔案——使用 references/、scripts/、examples/ 子目錄進行[漸進式揭露](https://code.claude.com/docs/en/skills) | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 在每個技能中建立 Gotchas（常見陷阱）章節——這是最高信號含量的內容，隨時間累積 Claude 的失誤點 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 技能描述欄位是觸發條件，不是摘要——為模型而寫（「我何時應該啟動這個？」） | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 不要在技能中陳述顯而易見的事——專注於推動 Claude 偏離其預設行為的內容 🚫👶 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 不要在技能中限制 Claude 的自主性——提供目標與約束，而非規定的逐步指令 🚫👶 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 在技能中加入腳本和函式庫，讓 Claude 能組合而非重新建構樣板程式碼 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 在 SKILL.md 中嵌入 `` !`command` `` 以將動態 shell 輸出注入提示——Claude 在呼叫時執行它，模型只看到結果 | [![Lydia](!/tags/lydia.svg)](https://x.com/lydiahallie/status/2034337963820327017) |

<a id="tips-hooks"></a>■ **鉤子（5 則）**

| 技巧 | 來源 |
|-----|--------|
| 在技能中使用[按需鉤子](https://code.claude.com/docs/en/skills)——/careful 阻擋破壞性指令，/freeze 阻擋特定目錄外的編輯 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 使用 PreToolUse 鉤子[追蹤技能使用量](https://code.claude.com/docs/en/skills)，找出熱門或觸發率不足的技能 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |
| 使用 [PostToolUse 鉤子](https://code.claude.com/docs/en/hooks)自動格式化程式碼——Claude 生成格式良好的程式碼，鉤子處理最後 10% 以避免 CI 失敗 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179852047335529) |
| 透過鉤子將[權限請求](https://code.claude.com/docs/en/hooks)路由至 Opus——讓它掃描攻擊並自動批准安全的請求 🚫👶 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742755737555434) |
| 使用 [Stop 鉤子](https://code.claude.com/docs/en/hooks)在回合結束時提示 Claude 繼續或驗證其工作 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2021701059253874861) |

<a id="tips-workflows"></a>■ **工作流程（8 則）**

| 技巧 | 來源 |
|-----|--------|
| 避免代理人進入愚笨區，在最多 50% 時手動執行 [/compact](https://code.claude.com/docs/en/interactive-mode)。切換至新任務時使用 [/clear](https://code.claude.com/docs/en/cli-reference) 重置上下文 | |
| 對於較小的任務，原始 Claude Code 優於任何工作流程 | |
| 使用 [/model](https://code.claude.com/docs/en/model-config) 選擇模型與推理方式，[/context](https://code.claude.com/docs/en/interactive-mode) 查看上下文用量，[/usage](https://code.claude.com/docs/en/costs) 檢查方案限制，[/extra-usage](https://code.claude.com/docs/en/interactive-mode) 設定超額計費，[/config](https://code.claude.com/docs/en/settings) 配置設定——規劃模式用 Opus，程式碼用 Sonnet，兩全其美 | [![Cat](!/tags/cat-wu.svg)](https://x.com/_catwu/status/1955694117264261609) |
| 在 [/config](https://code.claude.com/docs/en/settings) 中始終開啟[思考模式](https://code.claude.com/docs/en/model-config)（查看推理過程）並將[輸出樣式](https://code.claude.com/docs/en/output-styles)設為 Explanatory（查看帶有 ★ 洞察框的詳細輸出），以更好地理解 Claude 的決策 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179838864666847) |
| 在提示中使用 ultrathink 關鍵字進行[高強度推理](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking#tips-and-best-practices) | |
| [/rename](https://code.claude.com/docs/en/cli-reference) 重要工作階段（例如 [TODO - 重構任務]）並於稍後 [/resume](https://code.claude.com/docs/en/cli-reference) 繼續——同時執行多個 Claude 時為每個實例標上標籤 | [![Cat](!/tags/cat-wu.svg)](https://every.to/podcast/how-to-use-claude-code-like-the-people-who-built-it) |
| 當 Claude 偏離軌道時，使用 [Esc Esc 或 /rewind](https://code.claude.com/docs/en/checkpointing) 復原，而非在同一上下文中嘗試修復 | |
| 頻繁提交——盡量每小時至少提交一次，任務完成後立即提交 | |

<a id="tips-workflows-advanced"></a>■ **進階工作流程（7 則）**

| 技巧 | 來源 |
|-----|--------|
| 大量使用 ASCII 圖表來理解你的架構 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742759218794768) |
| 使用 [/loop](https://code.claude.com/docs/en/scheduled-tasks) 進行循環監控——輪詢部署、照看 PR、檢查建置（執行最多 3 天） | |
| 使用 [Ralph Wiggum 插件](https://github.com/shanraisshan/novel-llm-26)進行長時間自主任務 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179858435281082) |
| 使用萬用字元語法的 [/permissions](https://code.claude.com/docs/en/permissions)（Bash(npm run *)、Edit(/docs/**)），而非 dangerously-skip-permissions | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2007179854077407667) |
| 使用 [/sandbox](https://code.claude.com/docs/en/sandboxing) 以檔案和網路隔離減少權限提示——內部減少了 84% | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2021700506465579443) [![Cat](!/tags/cat-wu.svg)](https://creatoreconomy.so/p/inside-claude-code-how-an-ai-native-actually-works-cat-wu) |
| 在同事的 PR 上標記 [@claude](https://github.com/apps/claude)，自動為反覆出現的審查意見生成 lint 規則——將自己從程式碼審查中解放出來 🚫👶 | [![Boris](!/tags/boris-cherny.svg)](https://youtu.be/julbw1JuAz0?t=2715) [![Video](!/tags/video.svg)](https://youtu.be/julbw1JuAz0?t=2715) |
| 投資[產品驗證](https://code.claude.com/docs/en/skills)技能（signup-flow-driver、checkout-verifier）——值得花一週時間打磨 | [![Thariq](!/tags/thariq.svg)](https://x.com/trq212/status/2033949937936085378) |

<a id="tips-debugging"></a>■ **除錯（7 則）**

| 技巧 | 來源 |
|-----|--------|
| 養成截圖習慣，每當遇到任何問題時與 Claude 分享 | |
| 使用 MCP（[Chrome 中的 Claude](https://code.claude.com/docs/en/chrome)、[Playwright](https://github.com/microsoft/playwright-mcp)、[Chrome DevTools](https://developer.chrome.com/blog/chrome-devtools-mcp)）讓 Claude 自行查看 Chrome 主控台日誌 | |
| 一律要求 Claude 將你想查看日誌的終端機以背景任務執行，以便更好地除錯 | |
| [/doctor](https://code.claude.com/docs/en/cli-reference) 診斷安裝、驗證和設定問題 | |
| 壓縮時的錯誤可透過使用 [/model](https://code.claude.com/docs/en/model-config) 選擇 1M token 模型，然後執行 [/compact](https://code.claude.com/docs/en/interactive-mode) 來解決 | |
| 使用[跨模型](development-workflows/cross-model-workflow/cross-model-workflow.md)進行 QA——例如使用 [Codex](https://github.com/shanraisshan/codex-cli-best-practice) 進行計畫和實作審查 | |
| 代理式搜尋（glob + grep）優於 RAG——Claude Code 嘗試並放棄了向量資料庫，因為程式碼會失去同步且權限複雜 | [![Boris](!/tags/boris-cherny.svg)](https://youtu.be/julbw1JuAz0?t=3095) [![Video](!/tags/video.svg)](https://youtu.be/julbw1JuAz0?t=3095) |

<a id="tips-utilities"></a>■ **工具（5 則）**

| 技巧 | 來源 |
|-----|--------|
| 使用 [iTerm](https://iterm2.com/)/[Ghostty](https://ghostty.org/)/[tmux](https://github.com/tmux/tmux) 終端機，而非 IDE（[VS Code](https://code.visualstudio.com/)/[Cursor](https://www.cursor.com/)） | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2017742753971769626) |
| 使用 [Wispr Flow](https://wisprflow.ai) 進行語音提示（10 倍生產力） | |
| 使用 [claude-code-hooks](https://github.com/shanraisshan/claude-code-hooks) 獲取 Claude 的反饋 | |
| 使用[狀態列](https://github.com/shanraisshan/claude-code-status-line)了解上下文狀況並快速壓縮 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2021700784019452195) |
| 探索 [settings.json](best-practice/claude-settings.md) 功能，如[計畫目錄](best-practice/claude-settings.md#plans-directory)、[轉圈動詞](best-practice/claude-settings.md#display--ux)，打造個性化體驗 | [![Boris](!/tags/boris-cherny.svg)](https://x.com/bcherny/status/2021701145023197516) |

<a id="tips-daily"></a>■ **日常（3 則）**

| 技巧 | 來源 |
|-----|--------|
| 每日[更新](https://code.claude.com/docs/en/setup) Claude Code，並以閱讀[更新日誌](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)開始新的一天 | |
| 關注 [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/)、[r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/) | ![Reddit](https://img.shields.io/badge/-FF4500?style=flat&logo=reddit&logoColor=white) |
| 關注 [Boris](https://x.com/bcherny)、[Thariq](https://x.com/trq212)、[Cat](https://x.com/_catwu)、[Lydia](https://x.com/lydiahallie)、[Noah](https://x.com/noahzweben)、[Anthony](https://x.com/amorriscode)、[Alex](https://x.com/alexalbert__)、[Kenneth](https://x.com/neilhtennek)、[Claude](https://x.com/claudeai) | ![X](https://img.shields.io/badge/-000?style=flat&logo=x&logoColor=white) |

![Boris Cherny + Team](!/tags/boris-team.svg)

| 文章 / 推文 | 來源 |
|-----------------|--------|
| [從建構 Claude Code 中學到的教訓：我們如何使用技能（Thariq）\| 17/Mar/26](tips/claude-thariq-tips-17-mar-26.md) | [文章](https://x.com/trq212/status/2033949937936085378) |
| [程式碼審查與測試時間運算（Boris）\| 10/Mar/26](tips/claude-boris-2-tips-10-mar-26.md) | [推文](https://x.com/bcherny/status/2031089411820228645) |
| /loop——排程循環任務最多 3 天（Boris）\| 2026 年 3 月 7 日 | [推文](https://x.com/bcherny/status/2030193932404150413) |
| AskUserQuestion + ASCII Markdown（Thariq）\| 2026 年 2 月 28 日 | [推文](https://x.com/trq212/status/2027543858289250472) |
| 像代理人一樣觀察——建構 Claude Code 的心得（Thariq）\| 2026 年 2 月 28 日 | [文章](https://x.com/trq212/status/2027463795355095314) |
| Git 工作樹——Boris 使用的 5 種方式 \| 2026 年 2 月 21 日 | [推文](https://x.com/bcherny/status/2025007393290272904) |
| 從建構 Claude Code 中學到的教訓：提示快取就是一切（Thariq）\| 2026 年 2 月 20 日 | [文章](https://x.com/trq212/status/2024574133011673516) |
| [人們自訂 Claude 的 12 種方式（Boris）\| 12/Feb/26](tips/claude-boris-12-tips-12-feb-26.md) | [推文](https://x.com/bcherny/status/2021699851499798911) |
| [使用 Claude Code 的 10 個團隊技巧（Boris）\| 01/Feb/26](tips/claude-boris-10-tips-01-feb-26.md) | [推文](https://x.com/bcherny/status/2017742741636321619) |
| [我如何使用 Claude Code——13 個來自我意外樸素設置的技巧（Boris）\| 03/Jan/26](tips/claude-boris-13-tips-03-jan-26.md) | [推文](https://x.com/bcherny/status/2007179832300581177) |
| 要求 Claude 使用 AskUserQuestion 工具訪問你（Thariq）\| 28/Dec/25 | [推文](https://x.com/trq212/status/2005315275026260309) |
| 始終使用規劃模式，給 Claude 一個驗證方式，使用 /code-review（Boris）\| 27/Dec/25 | [推文](https://x.com/bcherny/status/2004711722926616680) |

![Videos / Podcasts](!/tags/videos-podcasts.svg)

| 影片 / Podcast | YouTube |
|-----------------|---------|
| 與 Boris Cherny 一起建構 Claude Code（Boris）\| 2026 年 3 月 4 日 \| The Pragmatic Engineer | [YouTube](https://youtu.be/julbw1JuAz0) |
| Claude Code 負責人：程式設計被解決後會發生什麼（Boris）\| 2026 年 2 月 19 日 \| Lenny's Podcast | [YouTube](https://youtu.be/We7BZVKbCVw) |
| 與其創作者 Boris Cherny 深入了解 Claude Code（Boris）\| 2026 年 2 月 17 日 \| Y Combinator | [YouTube](https://youtu.be/PQU9o_5rHC4) |
| Claude Code 創作者 Boris Cherny 談促進職涯發展之道（Boris）\| 2025 年 12 月 15 日 \| Ryan Peterman | [YouTube](https://youtu.be/AmdLVWMdjOk) |
| 從建構它的工程師那裡了解 Claude Code 的秘密（Cat）\| 2025 年 10 月 29 日 \| Every | [YouTube](https://youtu.be/IDSAMqip6ms) |

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

## ☠️ 新創公司 / 企業

| Claude 功能 | 取代了 |
|-|-|
|[**程式碼審查（Code Review）**](https://code.claude.com/docs/en/code-review)|[Greptile](https://greptile.com)、[CodeRabbit](https://coderabbit.ai)、[Devin Review](https://devin.ai)、[OpenDiff](https://opendiff.com)、[Cursor BugBot](https://bugbot.dev)|
|[**語音輸入（Voice Dictation）**](https://code.claude.com/docs/en/voice-dictation)|[Wispr Flow](https://wisprflow.ai)、[SuperWhisper](https://superwhisper.com/)|
|[**遠端控制（Remote Control）**](https://code.claude.com/docs/en/remote-control)|[OpenClaw](https://openclaw.ai/)
|[**協作（Cowork）**](https://claude.com/blog/cowork-research-preview)|[OpenAI Operator](https://openai.com/operator)、[AgentShadow](https://agentshadow.ai)
|[**任務（Tasks）**](https://x.com/trq212/status/2014480496013803643)|[Beads](https://github.com/steveyegge/beads)
|[**規劃模式（Plan Mode）**](https://code.claude.com/docs/en/common-workflows)|[Agent OS](https://github.com/buildermethods/agent-os)|
|[**技能 / 插件（Skills / Plugins）**](https://code.claude.com/docs/en/plugins)|YC AI 包裝新創公司（[reddit](https://reddit.com/r/ClaudeAI/comments/1r6bh4d/claude_code_skills_are_basically_yc_ai_startup/)）|

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

<a id="billion-dollar-questions"></a>
![Billion-Dollar Questions](!/tags/billion-dollar-questions.svg)

*如果你有答案，請告知我：shanraisshan@gmail.com*

**記憶體與指令（4 個問題）**

1. 你的 CLAUDE.md 中究竟應該放什麼——以及應該省略什麼？
2. 如果你已經有了 CLAUDE.md，還需要單獨的 constitution.md 或 rules.md 嗎？
3. 你應該多久更新一次 CLAUDE.md？如何判斷它已經過時了？
4. 為什麼 Claude 仍然忽略 CLAUDE.md 中的指令——即使指令用全大寫字母寫著 MUST？（[reddit](https://reddit.com/r/ClaudeCode/comments/1qn9pb9/claudemd_says_must_use_agent_claude_ignores_it_80/)）

**代理人、技能與工作流程（6 個問題）**

1. 何時應該使用指令、代理人還是技能——何時原始的 Claude Code 更好？
2. 隨著模型改進，你應該多久更新一次你的代理人、指令和工作流程？
3. 給你的子代理人一個詳細的人設能提升品質嗎？研究/QA 子代理人的「完美人設/提示」是什麼樣的？
4. 你應該依賴 Claude Code 的內建規劃模式，還是建立自己的規劃指令/代理人來強制執行團隊的工作流程？
5. 如果你有個人技能（例如 /implement 搭配你的程式碼風格），如何整合社群技能（例如 /simplify）而不發生衝突——當它們意見相左時誰優先？
6. 我們到了嗎？我們能將現有程式碼庫轉換為規格、刪除程式碼，然後讓 AI 從這些規格單獨重新生成完全相同的程式碼嗎？

**規格與文件（3 個問題）**

1. 你的倉庫中的每個功能都應該有一個 Markdown 檔案形式的規格嗎？
2. 你需要多久更新一次規格，以免在實作新功能時它們變得過時？
3. 在實作新功能時，你如何處理對其他功能規格的連鎖影響？

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

## 報告

<p align="center">
  <a href="reports/claude-agent-sdk-vs-cli-system-prompts.md"><img src="https://img.shields.io/badge/Agent_SDK_vs_CLI-555?style=for-the-badge" alt="Agent SDK vs CLI"></a>
  <a href="reports/claude-in-chrome-v-chrome-devtools-mcp.md"><img src="https://img.shields.io/badge/Browser_Automation_MCP-555?style=for-the-badge" alt="瀏覽器自動化 MCP"></a>
  <a href="reports/claude-global-vs-project-settings.md"><img src="https://img.shields.io/badge/Global_vs_Project_Settings-555?style=for-the-badge" alt="全域設定 vs 專案設定"></a>
  <a href="reports/claude-skills-for-larger-mono-repos.md"><img src="https://img.shields.io/badge/Skills_in_Monorepos-555?style=for-the-badge" alt="Monorepo 中的技能"></a>
  <br>
  <a href="reports/claude-agent-memory.md"><img src="https://img.shields.io/badge/Agent_Memory-555?style=for-the-badge" alt="代理人記憶體"></a>
  <a href="reports/claude-advanced-tool-use.md"><img src="https://img.shields.io/badge/Advanced_Tool_Use-555?style=for-the-badge" alt="進階工具使用"></a>
  <a href="reports/claude-usage-and-rate-limits.md"><img src="https://img.shields.io/badge/Usage_&_Rate_Limits-555?style=for-the-badge" alt="用量與速率限制"></a>
  <a href="reports/claude-agent-command-skill.md"><img src="https://img.shields.io/badge/Agents_vs_Commands_vs_Skills-555?style=for-the-badge" alt="代理人 vs 指令 vs 技能"></a>
  <br>
  <a href="reports/llm-day-to-day-degradation.md"><img src="https://img.shields.io/badge/LLM_Degradation-555?style=for-the-badge" alt="LLM 性能退化"></a>
</p>

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

![如何使用](!/tags/how-to-use.svg)

```
1. 像閱讀課程一樣閱讀這個倉庫，在嘗試使用前先了解指令、代理人、技能和鉤子是什麼。
2. 複製這個倉庫並試玩範例，嘗試 /weather-orchestrator、聆聽鉤子音效、執行代理人團隊，這樣你可以看到實際運作方式。
3. 前往你自己的專案，要求 Claude 建議應該從這個倉庫加入哪些最佳實踐，將這個倉庫作為參考提供給它，讓它了解什麼是可能的。
```

<p align="center">
  <img src="!/claude-jumping.svg" alt="區塊分隔" width="60" height="50">
</p>

<p align="center">
  <a href="https://github.com/trending?since=monthly"><img src="!/root/github-trending.png" alt="GitHub 熱門" width="1200"></a><br>
  2026 年 3 月在 Github 上熱門趨勢
</p>

## 其他倉庫

<a href="https://github.com/shanraisshan/claude-code-hooks"><img src="!/claude-speaking.svg" alt="Claude Code Hooks" width="40" height="40" align="center"></a> <a href="https://github.com/shanraisshan/claude-code-hooks"><strong>claude-code-hooks</strong></a> · <a href="https://github.com/shanraisshan/codex-cli-best-practice"><img src="!/codex-jumping.svg" alt="Codex CLI" width="40" height="40" align="center"></a> <a href="https://github.com/shanraisshan/codex-cli-best-practice"><strong>codex-cli-best-practice</strong></a> · <a href="https://github.com/shanraisshan/codex-cli-hooks"><img src="!/codex-speaking.svg" alt="Codex CLI Hooks" width="40" height="40" align="center"></a> <a href="https://github.com/shanraisshan/codex-cli-hooks"><strong>codex-cli-hooks</strong></a>

## 開發者

![Developed by](!/tags/developed-by.svg)

> | 工作流程 | 說明 |
> |----------|-------------|
> | /workflows:development-workflows | 透過平行研究所有 8 個工作流程倉庫，更新開發工作流程表格與跨工作流程分析報告 |
> | /workflows:best-practice:workflow-concepts | 以最新 Claude Code 功能和概念更新 README 概念章節 |
> | /workflows:best-practice:workflow-claude-settings | 追蹤 Claude Code 設定報告變更並找出需要更新的內容 |
> | /workflows:best-practice:workflow-claude-subagents | 追蹤 Claude Code 子代理人報告變更並找出需要更新的內容 |
> | /workflows:best-practice:workflow-claude-commands | 追蹤 Claude Code 指令報告變更並找出需要更新的內容 |
> | /workflows:best-practice:workflow-claude-skills | 追蹤 Claude Code 技能報告變更並找出需要更新的內容 |

[![Claude for OSS](!/tags/claude-for-oss.svg)](https://claude.com/contact-sales/claude-for-oss)
[![Claude Community Ambassador](!/tags/claude-community-ambassador.svg)](https://claude.com/community/ambassadors)
[![Claude Certified Architect](!/tags/claude-certified-architect.svg)](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)
[![Anthropic Academy](!/tags/anthropic-academy.svg)](https://anthropic.skilljar.com/)
