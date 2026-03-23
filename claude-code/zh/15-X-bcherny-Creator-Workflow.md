# 我如何使用 Claude Code——由其創建者親述

**作者：** Boris Cherny (@bcherny)
**來源：** https://x.com/bcherny/status/2007179832300581177
**日期：** 2026 年 1 月 2 日

---

## 串文（Thread）

**1/**
我是 Boris，我創建了 Claude Code。很多人問過我是如何使用 Claude Code 的，所以我想稍微展示一下我的設置。

我的設置可能出乎意料地平凡！Claude Code 開箱即用效果很好，所以我個人不太對它進行客製化。使用 Claude Code 沒有唯一正確的方式：我們刻意將它構建成你可以隨心所欲地使用、客製化和改造的形式。Claude Code 團隊中的每個人使用它的方式都截然不同。

那麼，開始吧。

**2/**
我在終端機中並行運行 5 個 Claude。我將分頁標記為 1 到 5，並使用系統通知來得知何時有 Claude 需要輸入。

**3/**
我同時在 claude.ai/code 上並行運行 5 到 10 個 Claude，與本地的 Claude 並行使用。在終端機寫程式時，我常常會將本地工作階段移交給網頁端（使用 `&`），或手動在 Chrome 中啟動工作階段，有時也會用 `--teleport` 來回切換。我每天早上也會從手機（Claude iOS App）啟動幾個工作階段，並在一天中陸續查看進度。

**4/**
我所有事情都使用附帶思考模式的 Opus 4.5。它是我用過最好的程式撰寫模型，儘管它比 Sonnet 更大、更慢，但由於需要更少的引導且工具使用能力更強，最終幾乎總是比使用較小模型還要快。

**5/**
我們團隊在 Claude Code 代碼庫中共用一份 `CLAUDE.md`。我們將它提交到 git 中，整個團隊每週貢獻數次。每當我們看到 Claude 做了不正確的事情，就會將其加入 `CLAUDE.md`，這樣 Claude 下次就知道不要重蹈覆轍。其他團隊維護各自的 `CLAUDE.md`，每個團隊有責任保持自己的版本是最新的。

**6/**
在代碼審查期間，我常常在同事的 PR 上標記 `@.claude`，要求作為 PR 的一部分將某些內容添加到 `CLAUDE.md`。我們使用 Claude Code 的 GitHub Action（`/install-github-action`）來實現這一點。這是我們版本的 @danshipper 所提出的「複利工程（Compounding Engineering）」。

**7/**
大多數工作階段從計劃模式開始（按兩次 Shift+Tab）。如果我的目標是撰寫一個 Pull Request，我會使用計劃模式，與 Claude 來回溝通直到我認可它的計劃。之後，我切換到自動接受編輯模式，Claude 通常能一次完成。一個好的計劃真的非常重要！

**8/**
我為每一個每天會重複做多次的「內循環」工作流程使用斜線命令（slash commands）。這讓我避免重複提示，也讓 Claude 能夠使用這些工作流程。命令被提交到 git 並存放在 `.claude/commands/` 中。例如，Claude 和我每天使用 `/commit-push-pr` 斜線命令數十次。這個命令使用內嵌的 bash 指令來預先計算 git 狀態和其他幾項資訊，讓命令快速運行並避免與模型來回交互。

**9/**
我定期使用幾個子代理：`code-simplifier` 在 Claude 完成工作後簡化程式碼，`verify-app` 包含端對端測試 Claude Code 的詳細指令，等等。與斜線命令類似，我將子代理視為自動化大多數 PR 中最常見工作流程的工具。

**10/**
我們使用 `PostToolUse` 鉤子（hook）來格式化 Claude 的程式碼。Claude 通常開箱即可生成格式良好的程式碼，而鉤子處理最後 10% 的部分，以避免後續在 CI 中出現格式錯誤。

**11/**
我不使用 `--dangerously-skip-permissions`。取而代之，我使用 `/permissions` 來預先允許我知道在我的環境中是安全的常見 bash 命令，以避免不必要的權限提示。其中大多數已提交到 `.claude/settings.json` 並與團隊共用。

**12/**
Claude Code 為我使用所有工具。它常常搜尋並發布到 Slack（通過 MCP 伺服器）、運行 BigQuery 查詢來回答分析問題（使用 `bq` CLI）、從 Sentry 抓取錯誤日誌等。Slack MCP 設定已提交到我們的 `.mcp.json` 並與團隊共用。

**13/**
對於執行時間非常長的任務，我會選擇以下方式：(a) 提示 Claude 在完成後用背景代理驗證其工作，(b) 使用代理停止鉤子（agent Stop hook）更確定性地做到這一點，或 (c) 使用 `ralph-wiggum` 外掛（最初由 @GeoffreyHuntley 構思）。我也會在沙盒中使用 `--permission-mode=dontAsk` 或 `--dangerously-skip-permissions`，以避免工作階段中的權限提示，讓 Claude 可以不受阻礙地工作。

**14/**
最後一個提示：要從 Claude Code 獲得出色結果，最重要的事情可能是——給 Claude 一種驗證其工作的方式。如果 Claude 有這個回饋循環，最終結果的質量將提升 2 到 3 倍。Claude 使用 Claude Chrome 擴充功能測試我提交到 claude.ai/code 的每一個變更。它開啟瀏覽器，測試 UI，並不斷迭代直到程式碼正常運作且使用者體驗令人滿意。驗證方式因領域而異，可能簡單到只是運行一個 bash 命令、運行一套測試，或在瀏覽器或手機模擬器中測試應用程式。務必投入精力讓這個環節穩如磐石。

**15/**
希望這對你有所幫助！你使用 Claude Code 的技巧是什麼？你想接下來聽到什麼？

---

**互動數據：** 54,209 個讚 | 6,996 次轉推 | 1,305 則回覆
