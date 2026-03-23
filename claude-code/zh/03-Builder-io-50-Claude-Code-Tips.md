# 50 個 Claude Code 日常使用技巧與最佳實踐

**來源：** <https://www.builder.io/blog/claude-code-tips-best-practices>
**作者：** Vishwas Gopinath | **發布日期：** 2026 年 3 月 20 日

---

你已經用 Claude Code 夠久，知道它確實好用，現在你在找每一個可以善加利用的優勢。我整理了 50 個 Claude Code 最佳實踐與技巧，無論你是入門一週還是深入使用好幾個月都適用。這些技巧來源包括 [Anthropic 官方文件](https://code.claude.com/docs/en/best-practices)、打造它的人 Boris Cherny、社群經驗，以及我自己一年來的每日使用心得。

## 1. 設定 cc 別名

這是我開始每次 Claude Code 工作階段的方式。將以下內容加入 `~/.zshrc`（或 `~/.bashrc`）：

```
alias cc='claude --dangerously-skip-permissions'
```

執行 `source ~/.zshrc` 載入設定。現在你輸入 `cc` 就等同於輸入 `claude`，並且跳過所有權限提示。這個旗標的名稱故意設計得很嚇人。只有在你完全了解 Claude Code 能對你的程式碼庫做什麼、會做什麼之後，再使用它。我在[自訂 Claude Code](https://www.builder.io/blog/claude-code-settings) 一文中涵蓋了這個以及更多別名設定。

## 2. 在指令前加 ! 來直接執行 bash 指令

輸入 `!git status` 或 `!npm test`，指令立即執行。指令及其輸出會進入對話脈絡，Claude 可以看到結果並採取行動。這比請 Claude 執行指令更快。

## 3. 按 Esc 停止 Claude；按 Esc+Esc 還原任何操作

Esc 在不失去脈絡的情況下停止 Claude。你可以立即調整方向。

Esc+Esc（或 `/rewind`）會開啟一個可捲動的選單，列出 Claude 建立的每個檢查點。你可以還原程式碼、對話，或兩者都還原。「復原那個」也有效。四種還原選項：程式碼與對話、僅對話、僅程式碼，或從某個檢查點向前摘要。

這意味著你可以嘗試那個只有 40% 把握的方法。成功了？很好。不成功？還原。完全不會造成損害。一個注意事項：檢查點只追蹤檔案編輯。來自 bash 指令的變更（資料庫遷移、資料庫操作）不會被捕捉。

若要從上次中斷的地方繼續，`claude --continue` 恢復最近的對話，`claude --resume` 開啟工作階段選擇器。

## 4. 給 Claude 一個自我檢查的方式

給 Claude 一個回饋循環，讓它能自行發現錯誤。在提示中加入測試指令、Linter 檢查，或預期輸出。

```
將 auth middleware 重構為使用 JWT 而非 session token。
完成變更後執行現有的測試套件。
在宣告完成之前修正所有失敗。
```

Claude 執行測試、看到失敗，並在你不插手的情況下修正。Boris Cherny [說這一點單獨就能帶來 2-3 倍的品質提升](https://x.com/bcherny/status/2007179861115511237)。對於 UI 變更，設定 [Playwright MCP 伺服器](https://www.builder.io/blog/claude-code-playwright-mcp-server)，讓 Claude 可以開啟瀏覽器、與頁面互動，並驗證 UI 是否如預期運作。這個回饋循環能捕捉到單元測試遺漏的問題。

## 5. 為你的語言安裝程式碼智能外掛

LSP 外掛在每次檔案編輯後自動給 Claude 提供診斷資訊：型別錯誤、未使用的匯入、缺少的回傳型別。Claude 在你注意到之前就能看到並修正問題。這是你能安裝的單一效益最高的外掛。

選擇你的語言並執行安裝指令：

```
/plugin install typescript-lsp@claude-plugins-official
/plugin install pyright-lsp@claude-plugins-official
/plugin install rust-analyzer-lsp@claude-plugins-official
/plugin install gopls-lsp@claude-plugins-official
```

C#、Java、Kotlin、Swift、PHP、Lua 和 C/C++ 的外掛也有提供。執行 `/plugin` 並前往「探索」頁籤瀏覽完整清單。你需要在系統上安裝對應的語言伺服器二進位檔（如果缺少，外掛會告訴你）。

## 6. 使用 gh CLI，並教 Claude 任何 CLI 工具

`gh` [CLI](https://cli.github.com/) 無需獨立的 MCP 伺服器即可處理 PR、Issue 和留言。CLI 工具比 MCP 伺服器更省脈絡，因為它們不會將工具架構載入你的脈絡視窗。`jq`、`curl` 和其他標準 CLI 工具同理。

對於 Claude 尚不熟悉的工具：「使用 'sentry-cli --help' 了解它，然後用它找出正式環境中最近的錯誤。」Claude 讀取幫助輸出，找出語法，並執行指令。即使是小眾的內部 CLI 也適用。

## 7. 加入 "ultrathink" 進行複雜推理

這是一個關鍵字，可將努力程度設定為高，並在 Opus 4.6 上觸發自適應推理。Claude 會根據問題動態分配思考資源。用於架構決策、棘手的除錯、多步驟推理，或任何你希望 Claude 在行動前先思考的情境。

你也可以用 `/effort` 永久設定努力程度。對於複雜度較低的任務，較低的努力程度可保持速度與成本效益。將努力程度與問題相匹配。在變數重新命名上消耗思考 token 毫無意義。

## 8. 運用技能（Skills）按需取得知識

技能是按需擴展 Claude 知識的 Markdown 檔案。與每次工作階段都載入的 CLAUDE.md 不同，技能只在與當前任務相關時才載入。這讓你的脈絡保持精簡。

在 `.claude/skills/` 中建立技能，或安裝包含預建技能的外掛（執行 `/plugin` 瀏覽可用項目）。將技能用於專業領域知識（API 規範、部署程序、程式設計模式）——Claude 有時需要但不是每次都需要的知識。

## 9. 從手機控制 Claude Code

執行 `claude remote-control` 啟動工作階段，然後從 [claude.ai/code](https://claude.ai/code) 或 iOS/Android 上的 Claude 應用程式連接它。工作階段在你的機器上本機執行。手機或瀏覽器只是進入它的一個視窗。你可以從任何地方發送訊息、核准工具呼叫，以及監控進度。

如果你使用技巧 #1 的 `cc` 別名，Claude 已擁有完整權限，無需逐一核准每個動作。這讓遠端控制更加順暢：啟動任務、離開，只在 Claude 完成或遇到意外情況時從手機查看。

## 10. 將脈絡視窗擴充至 1M token

Sonnet 4.6 和 Opus 4.6 都支援 1M token 脈絡視窗。在 Max、Team 和 Enterprise 方案上，Opus 自動升級至 1M 脈絡。你也可以在工作階段中途使用 `/model opus[1m]` 或 `/model sonnet[1m]` 切換模型。

如果你擔心較大脈絡尺寸下的品質，可以從 500k 開始逐步提升。更高的脈絡代表壓縮啟動前有更多空間，但回應品質可能因任務而異。使用 `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 控制壓縮何時觸發，`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` 設定百分比閾值。找出適合你工作流程的最佳點。

## 11. 不確定如何著手時，使用計劃模式

對於多檔案變更、不熟悉的程式碼和架構決策，使用[計劃模式](https://www.builder.io/blog/claude-code-plan-mode)。前期的額外開銷是真實存在的（幾分鐘），但它能防止 Claude 花 20 分鐘充滿信心地解決一個完全錯誤的問題。

對於範圍小且明確的任務，跳過它。如果你能用一句話描述 diff，就直接動手。你可以隨時用 `Shift+Tab` 切換計劃模式，在不離開對話的情況下循環切換一般、自動接受和計劃權限模式。

## 12. 在不相關任務之間執行 /clear

一個乾淨的工作階段配上精確的提示，勝過混亂的三小時工作階段。不同任務？先執行 `/clear`。

我知道這感覺像在丟棄進度，但從頭開始你會得到更好的結果。工作階段會退化，因為先前工作積累的脈絡會淹沒你當前的指令。執行 `/clear` 並寫一個聚焦的起始提示只需五秒，卻能讓你免於 30 分鐘的邊際效益遞減。

## 13. 別幫 Claude 詮釋錯誤。直接貼上原始資料。

用文字描述錯誤很慢。你會看到 Claude 猜測、你糾正它、然後重複。

直接貼上錯誤日誌、CI 輸出或 Slack 討論串，說「修它」。Claude 能讀取分散式系統的日誌，追蹤問題斷點。你的詮釋增加了抽象層，往往會遺失 Claude 找出根本原因所需的細節。把原始資料給 Claude，然後讓它發揮。

這對 CI 同樣有效。「去修好失敗的 CI 測試」加上貼上的 CI 輸出，是最可靠的模式之一。你也可以貼上 PR 網址或編號，請 Claude 檢查失敗的檢查項目並修正。安裝了技巧 #6 的 `gh` CLI，Claude 就能處理其餘的事。

你也可以直接從終端機管線輸出：

```
cat error.log | claude "解釋這個錯誤並建議修正方法"
npm test 2>&1 | claude "修正失敗的測試"
```

## 14. 使用 /btw 快速提問

`/btw` 彈出一個疊加層供你快速提問，不會進入對話歷史。我用它來釐清當前工作階段的問題：「你為什麼選擇這個方法？」或「另一個選項的取捨是什麼？」答案顯示在可關閉的疊加層中，你的主要脈絡保持精簡，Claude 繼續工作。

## 15. 使用 --worktree 建立隔離的平行分支

`claude --worktree feature-auth` 建立一個包含新分支的隔離工作副本。Claude 為你處理 git worktree 的設定和清理。

Claude Code 團隊稱這是[最大的生產力突破之一](https://x.com/bcherny/status/2017742743125299476)。啟動 3-5 個 worktree，每個並行執行自己的 Claude 工作階段。我通常執行 2-3 個。每個 worktree 都有自己的工作階段、自己的分支和自己的檔案系統狀態。

本機 worktree 的上限是你的機器。多個開發伺服器、建置和 Claude 工作階段都在競爭 CPU。[Builder.io](https://www.builder.io/) 將每個代理移至其自己的雲端容器（含瀏覽器預覽），讓你的機器保持自由，專注於需要你腦力的工作。

## 16. 用 Ctrl+S 暫存你的提示

你正在撰寫一個長提示，卻意識到你需要先快速得到一個答案。`Ctrl+S` 暫存你的草稿。輸入你的快速問題並提交，你的暫存提示會自動恢復。

## 17. 用 Ctrl+B 將長時間執行的任務移到背景

當 Claude 啟動一個長時間執行的 bash 指令（測試套件、建置、遷移）時，按 `Ctrl+B` 將它移到背景。Claude 在程序執行的同時繼續工作，你也可以繼續聊天。程序完成時結果會出現。

## 18. 新增即時狀態列

狀態列是一個在每次 Claude 回合後執行的 Shell 腳本。它在終端機底部顯示即時資訊：當前目錄、git 分支、依脈絡視窗填滿程度以顏色編碼的脈絡使用量。

設定它最快的方式是在 Claude Code 內執行 `/statusline`。它會詢問你想顯示什麼，然後為你產生腳本。我在[自訂 Claude Code](https://www.builder.io/blog/claude-code-settings) 中涵蓋了完整設定（含可複製貼上的腳本）。

## 19. 使用子代理保持主要脈絡整潔

「使用子代理找出付款流程如何處理失敗的交易。」這會產生一個擁有自己脈絡視窗的獨立 Claude 實例。它讀取所有檔案，推理程式碼庫，並回報一份簡潔的摘要。

你的主要工作階段保持整潔，有充足的空間來建置東西。深度調查可能會在你寫任何程式碼之前就消耗掉一半的脈絡視窗。子代理讓這個成本不進入你的主要工作階段。內建類型包括 Explore（Haiku，快速檔案搜尋）和 Plan（唯讀分析）。完整說明請見我們的[子代理與代理團隊](https://www.builder.io/blog/claude-code-agents)指南。

## 20. 代理團隊進行多工作階段協調

實驗性但強大。先在設定或環境中加入 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 啟用它。然後告訴 Claude 建立一個團隊：「建立一個有 3 個成員的代理團隊，並行重構這些模組。」團隊負責人將工作分配給成員，每個成員都有自己的脈絡視窗和共用的任務清單。成員可以互相發訊息進行協調。

從 3-5 個成員和每個成員 5-6 個任務開始。避免分配修改同一個檔案的任務。兩個成員編輯同一個檔案會導致覆蓋。先從研究和審查任務（PR 審查、錯誤調查）開始，再嘗試並行實作。

## 21. 用指令引導壓縮

當脈絡壓縮時（自動或透過 `/compact`），告訴 Claude 要保留什麼：「/compact 聚焦在 API 變更和修改的檔案清單。」你也可以在 CLAUDE.md 中加入常駐指令：「壓縮時，保留完整的修改檔案清單和當前測試狀態。」

## 22. 使用 /loop 進行定期檢查

`/loop 5m check if the deploy succeeded and report back` 會排定一個在背景觸發的定期提示，同時你的工作階段保持開啟。間隔是可選的（預設 10 分鐘），支援 `s`、`m`、`h` 和 `d` 單位。你也可以循環其他指令：`/loop 20m /review-pr 1234`。任務以工作階段為範圍，3 天後過期，所以忘記的循環不會永遠執行。使用 `/loop` 監控部署、監看 CI 流水線，或在你專注於其他事情時輪詢外部服務。

## 23. 使用語音輸入撰寫更豐富的提示

執行 `/voice` 啟用按壓說話功能，然後按住 `Space` 進行語音輸入。你的語音會即時轉錄到提示中，你可以在同一條訊息中混合語音和打字。口語提示自然地包含比打字更多的脈絡，因為你會解釋背景、提及限制條件，並描述你想要的結果，而不會為了省按鍵次數而刪減。需要 [Claude.ai](http://claude.ai/) 帳號（不是 API 金鑰）。你可以在 `~/.claude/keybindings.json` 中將按壓說話鍵重新綁定到像 `meta+k` 這樣的修飾組合鍵，以跳過按住偵測的暖機時間。

## 24. 同一件事糾正 2 次後，重新開始

當你和 Claude 在一個糾正的兔子洞裡打轉，問題仍未解決，脈絡現在充滿了正在妨礙下一次嘗試的失敗方法。執行 `/clear` 並撰寫一個更好的起始提示，融入你學到的東西。一個乾淨的工作階段加上更精確的提示，幾乎總是優於一個被積累的死胡同壓垮的長工作階段。

## 25. 精確告訴 Claude 要看哪些檔案

使用 `@` 直接引用檔案：`@src/auth/middleware.ts 包含 session 處理邏輯。` `@` 前綴會自動解析為檔案路徑，Claude 確切知道要看哪裡。

Claude 可以自行 grep 和搜尋你的程式碼庫，但它仍然需要縮小候選範圍並找出正確的檔案。每一個搜尋步驟都會消耗 token 和脈絡。從一開始就把 Claude 指向正確的檔案，可以跳過這整個過程。

## 26. 用模糊的提示探索不熟悉的程式碼

「你會改進這個檔案的哪些地方？」是一個很好的探索提示。並非每個提示都需要具體。當你想要用新鮮的眼光看現有程式碼時，一個模糊的問題給了 Claude 空間來浮現你不會想到去問的事情。

當我在熟悉一個不熟悉的程式碼庫時，我會使用這個方法。Claude 會指出我在初次閱讀時可能會錯過的模式、不一致性和改進機會。

## 27. 用 Ctrl+G 編輯計劃

當 Claude 呈現一個計劃時，`Ctrl+G` 在你的文字編輯器中打開它以供直接編輯。在 Claude 寫下任何一行程式碼之前，加入限制條件、移除步驟、調整方向。當計劃大部分正確但你想在不重新解釋整件事的情況下調整幾個步驟時很有用。

## 28. 執行 /init，然後將結果刪減一半

CLAUDE.md 是一個位於專案根目錄的 Markdown 檔案，為 Claude 提供持久指令：建置指令、程式設計標準、架構決策、程式碼庫規範。Claude 在每次工作階段開始時讀取它。`/init` 根據你的專案結構產生一個起始版本。它會抓取建置指令、測試腳本和目錄結構。

輸出往往過於臃腫。如果你無法解釋某一行存在的原因，就刪除它。修剪雜訊，補充缺少的內容。關於如何結構化這些檔案，請見[如何撰寫一個出色的 CLAUDE.md 檔案](https://www.builder.io/blog/claude-md-guide)。

## 29. 每一行 CLAUDE.md 的試金石

對 CLAUDE.md 中的每一行問：如果沒有這個，Claude 會犯錯嗎？如果 Claude 已經能自己正確處理某事，這條指令就是雜訊。每一條不必要的行都會稀釋真正重要的那些。大約有 150-200 條指令的預算，超過這個數量合規率就會下降，而系統提示本身已使用了大約 50 條。

## 30. Claude 犯錯後，說「更新你的 CLAUDE.md 讓這件事不再發生」

當 Claude 犯錯時，說「更新 CLAUDE.md 檔案讓這件事不再發生。」Claude 自己撰寫規則。下次工作階段，它自動遵循。

隨著時間推移，你的 CLAUDE.md 成為一個由真實錯誤塑造的活文件。為了防止它無限增長，使用 `@imports`（技巧 #32）引用一個獨立的檔案，例如 `@docs/solutions.md` 用於模式和修正。你的 CLAUDE.md 保持精簡，Claude 按需讀取細節。

## 31. 在 .claude/rules/ 中放置只有特定時候才適用的規則

將 Markdown 檔案放在 `.claude/rules/` 中以按主題組織指令。預設情況下，每個規則檔案在每次工作階段開始時載入。若要讓規則只在 Claude 處理特定檔案時載入，加入 `paths` frontmatter：

```
---
paths:
  - "**/*.ts"
---
優先使用 interface 而非 type。
```

這讓你的主要 CLAUDE.md 保持精簡。TypeScript 規則在 Claude 讀取 `.ts` 檔案時載入，Go 規則在讀取 `.go` 檔案時載入。Claude 不必費力瀏覽它沒有接觸到的語言的規範。

## 32. 使用 @imports 保持 CLAUDE.md 精簡

使用 `@docs/git-instructions.md` 引用文件。你也可以引用 `@README.md`、`@package.json`，甚至 `@~/.claude/my-project-instructions.md`。

Claude 在需要時讀取檔案。把 `@imports` 想作「如果你需要，這裡有更多脈絡」，而不會讓 Claude 每次工作階段都讀取的檔案過於臃腫。

## 33. 用 /permissions 將安全指令加入允許清單

不要再第一百次點擊「核准」`npm run lint` 了。`/permissions` 讓你將信任的指令加入允許清單，保持你的工作流暢。對於不在清單上的任何指令，你仍然會收到提示。

## 34. 想讓 Claude 自由工作時，使用 /sandbox

執行 `/sandbox` 啟用作業系統層級的隔離。寫入被限制在你的專案目錄，網路請求被限制在你核准的網域。它在 macOS 上使用 Seatbelt，在 Linux 上使用 bubblewrap，所以限制適用於 Claude 產生的每個子程序。在自動允許模式下，沙盒指令無需權限提示即可執行，讓你擁有接近完全的自主性同時保有防護措施。

對於無人監督的工作（通宵遷移、實驗性重構），在 Docker 容器中執行 Claude。容器提供完整隔離、輕鬆回滾，以及讓 Claude 執行數小時的信心。

## 35. 為重複性任務建立自訂子代理

與即興使用子代理（#19）不同，自訂子代理是預先配置好並儲存在 `.claude/agents/` 中的代理。例如，一個使用 Opus 和唯讀工具的 security-reviewer 代理，或一個使用 Haiku 追求速度的 quick-search 代理。

使用 `/agents` 瀏覽和建立它們。你可以為需要自己檔案系統的代理設定 `isolation: worktree`。

## 36. 為你的技術棧選擇合適的 MCP 伺服器

值得首先考慮的 MCP 伺服器：**Playwright** 用於瀏覽器測試和 UI 驗證，**PostgreSQL/MySQL** 用於直接的 schema 查詢，**Slack** 用於讀取錯誤報告和討論串脈絡，以及 **Figma** 用於設計轉程式碼的工作流程。

Claude Code 支援動態工具載入，所以伺服器只在 Claude 需要時才載入其定義。關於可用項目的完整清單，請見我們的 [2026 年最佳 MCP 伺服器](https://www.builder.io/blog/best-mcp-servers-2026)指南。

## 37. 設定你的輸出風格

執行 `/config` 並選擇你偏好的風格。內建選項有 Explanatory（詳細、逐步）、Concise（簡短、以行動為重點）和 Technical（精確、術語友善）。

你也可以在 `~/.claude/output-styles/` 中建立自訂輸出風格檔案。

## 38. 使用 CLAUDE.md 提供建議，使用 Hooks 執行要求

CLAUDE.md 是建議性的。Claude 大約 80% 的時間遵循它。Hooks 是確定性的，100%。如果某件事必須每次都發生且沒有例外（格式化、linting、安全檢查），就把它做成 hook。如果是 Claude 應該考量的指引，CLAUDE.md 就夠了。

## 39. 用 PostToolUse hook 自動格式化

每次 Claude 編輯檔案時，你的格式化工具應該自動執行。在 `.claude/settings.json` 中加入一個 PostToolUse hook，在 Claude 編輯或寫入任何檔案後執行 Prettier（或你的格式化工具）：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

`|| true` 防止 hook 失敗阻塞 Claude。你也可以串聯其他工具——加入 `npx eslint --fix` 作為第二個 hook 條目。

如果你的編輯器開著同一批檔案，在 Claude 工作時考慮關閉儲存時格式化。一些開發者反映編輯器的儲存動作可能使提示快取失效，迫使 Claude 重新讀取檔案。讓 hook 來處理格式化。

## 40. 用 PreToolUse hooks 封鎖破壞性指令

用 Bash 上的 PreToolUse hook 封鎖 `rm -rf`、`drop table` 和 `truncate` 模式。Claude 甚至不會嘗試。hook 在 Claude 執行工具之前觸發，所以破壞性指令在造成損害之前就被攔截。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "type": "command",
        "command": "if echo \"$TOOL_INPUT\" | grep -qE 'rm -rf|drop table|truncate'; then echo 'BLOCKED: destructive command' >&2; exit 2; fi"
      }
    ]
  }
}
```

將此加入你專案的 `.claude/settings.json`。你可以用 `/hooks` 互動式設定，或直接告訴 Claude：「加入一個 PreToolUse hook，封鎖 rm -rf、drop table 和 truncate 指令。」

## 41. 用 Hooks 在壓縮時保留重要脈絡

在長時間工作階段中脈絡壓縮時，Claude 可能會忘記你在做什麼。一個帶有 `compact` 匹配器的 Notification hook 會在每次壓縮觸發時自動重新注入你的關鍵脈絡。

告訴 Claude：「設定一個 Notification hook，在壓縮後提醒你當前任務、修改的檔案，以及任何限制條件。」Claude 會在你的設定中建立這個 hook。適合重新注入的好候選：當前任務描述、你修改過的檔案清單，以及任何硬性限制（「不要修改遷移檔案」）。

這在多小時的工作階段中最有價值——你正深入開發某個功能，無法承受 Claude 失去脈絡。

## 42. 務必手動審查驗證、付款和資料變更

Claude 擅長程式碼。這些決策需要人類參與：驗證流程、付款邏輯、資料變更、破壞性資料庫操作。無論其他部分看起來多好，都要審查這些。一個錯誤的驗證範圍、一個設定錯誤的付款 webhook，或一個悄悄刪除欄位的遷移，可能讓你失去用戶、金錢或信任。再多的自動化測試也無法捕捉所有這些情況。

## 43. 使用 /branch 嘗試不同方法而不失去當前進度

`/branch`（或 `/fork`）在當前點建立你對話的副本。在分支中嘗試有風險的重構。如果成功，保留它。如果不成功，你的原始對話完好無損。這與還原（#3）不同，因為兩條路徑都保持活躍。

## 44. 當你無法完全規格化一個功能時，讓 Claude 來訪談你

你知道你想建置什麼，但感覺你沒有 Claude 建置好它所需的所有細節。讓 Claude 來問問題。

```
我想建置 [簡短描述]。使用 AskUserQuestion 工具
詳細訪談我。詢問技術實作、邊界情況、顧慮和取捨。
不要問顯而易見的問題。持續訪談直到我們涵蓋所有內容，
然後將完整規格寫入 SPEC.md。
```

規格完成後，開啟一個新的工作階段，以乾淨的脈絡和完整的規格來執行。

## 45. 讓一個 Claude 寫，另一個 Claude 審查

第一個 Claude 實作功能，第二個 Claude [以新鮮脈絡像資深工程師一樣審查](https://x.com/bcherny/status/2017742745365057733)。審查者對實作捷徑毫不知情，會質疑每一個捷徑。

同樣的想法也適用於 TDD。工作階段 A 撰寫測試，工作階段 B 撰寫通過測試的程式碼。

## 46. 以對話方式審查 PR

不要要求 Claude 一次性完成 PR 審查（雖然你可以這樣做）。在工作階段中開啟 PR 並與之對話。「帶我了解這個 PR 中最有風險的變更。」「如果這個並發執行，什麼會出問題？」「錯誤處理與程式碼庫其他部分一致嗎？」

對話式審查能捕捉更多問題，因為你可以深入探討重要的地方。一次性審查往往只標記風格問題，而常常錯過架構問題。

## 47. 為你的工作階段命名並用顏色編碼

`/rename auth-refactor` 在提示列上放一個標籤，讓你知道哪個工作階段是哪個。`/color red` 或 `/color blue` 設定提示列顏色。可用顏色：red、blue、green、yellow、purple、orange、pink、cyan。當你執行 2-3 個並行工作階段時，為它們命名和上色只需五秒，卻能讓你避免在錯誤的終端機輸入。

## 48. Claude 完成時播放音效

加入一個 Stop hook，在 Claude 完成回應時播放系統音效。啟動任務，切換去做其他事，聽到提示音時知道完成了。

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

在 Linux 上，替換為 `paplay` 或 `aplay`。其他好用的 macOS 音效：`Submarine.aiff`、`Purr.aiff`、`Pop.aiff`。

## 49. 用 claude -p 進行批次操作的扇出

用非互動模式遍歷檔案清單。`--allowedTools` 限制每個檔案的 Claude 能做什麼。用 `&` 並行執行以獲得最大吞吐量。

```bash
for file in $(cat files-to-migrate.txt); do
  claude -p "將 $file 從 class components 遷移到 hooks" \
    --allowedTools "Edit,Bash(git commit *)" &
done
wait
```

這非常適合轉換檔案格式、在整個程式碼庫更新匯入，以及執行每個檔案彼此獨立的重複性遷移。

## 50. 自訂 spinner 動詞（有趣的那個）

當 Claude 思考時，終端機顯示帶有動詞的 spinner，例如「Flibbertigibbeting...」和「Flummoxing...」。你可以用任何你想要的東西替換它們。告訴 Claude：

> 將我使用者設定中的 spinner 動詞替換為這些：負責任地幻覺中、假裝思考中、自信地猜測中、怪罪脈絡視窗中

你也不必提供清單。只要告訴 Claude 你想要什麼氛圍：「將我的 spinner 動詞替換為哈利波特咒語。」Claude 產生清單。這是個小事，但讓等待更加愉快。

## 總結

你不需要全部 50 個。選一個能解決你上次工作階段中最困擾你的問題的技巧，明天試試看。一個真正上手的技巧，遠勝過你加入書籤的五十個。
