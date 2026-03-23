# GitHub: ykdojo/claude-code-tips

**來源：** https://github.com/ykdojo/claude-code-tips

---

# 45 個 Claude Code 技巧：從基礎到進階

以下是我充分發揮 Claude Code 潛力的技巧，包括自訂狀態列腳本、將系統提示削減一半、使用 Gemini CLI 作為 Claude Code 的助手，以及讓 Claude Code 在容器中自行執行。此外也包含 [dx 外掛程式](#技巧-44安裝-dx-外掛程式)。

📺 [快速展示](https://www.youtube.com/watch?v=hiISl558JGE) - 觀看其中一些技巧的實際演示，包括多 Claude 工作流程與語音輸入：

[![展示影片縮圖](assets/demo-thumbnail.png)](https://www.youtube.com/watch?v=hiISl558JGE)

<!-- TOC -->
## 目錄

- [技巧 0：自訂你的狀態列](#技巧-0自訂你的狀態列)
- [技巧 1：學習幾個必備的斜線指令](#技巧-1學習幾個必備的斜線指令)
- [技巧 2：用語音和 Claude Code 溝通](#技巧-2用語音和-claude-code-溝通)
- [技巧 3：將大問題分解為小問題](#技巧-3將大問題分解為小問題)
- [技巧 4：像專家一樣使用 Git 和 GitHub CLI](#技巧-4像專家一樣使用-git-和-github-cli)
- [技巧 5：AI 上下文就像牛奶；越新鮮越精簡越好！](#技巧-5ai-上下文就像牛奶越新鮮越精簡越好)
- [技巧 6：從終端機中取得輸出內容](#技巧-6從終端機中取得輸出內容)
- [技巧 7：設定終端機別名以快速存取](#技巧-7設定終端機別名以快速存取)
- [技巧 8：主動壓縮你的上下文](#技巧-8主動壓縮你的上下文)
- [技巧 9：完成自主任務的撰寫-測試循環](#技巧-9完成自主任務的撰寫-測試循環)
- [技巧 10：Cmd+A 和 Ctrl+A 是你的好朋友](#技巧-10cmda-和-ctrla-是你的好朋友)
- [技巧 11：使用 Gemini CLI 作為封鎖網站的備用方案](#技巧-11使用-gemini-cli-作為封鎖網站的備用方案)
- [技巧 12：投資你自己的工作流程](#技巧-12投資你自己的工作流程)
- [技巧 13：搜尋你的對話歷史](#技巧-13搜尋你的對話歷史)
- [技巧 14：使用終端機分頁進行多工處理](#技巧-14使用終端機分頁進行多工處理)
- [技巧 15：精簡系統提示](#技巧-15精簡系統提示)
- [技巧 16：使用 Git Worktree 進行平行分支工作](#技巧-16使用-git-worktree-進行平行分支工作)
- [技巧 17：長時間執行任務的手動指數退避](#技巧-17長時間執行任務的手動指數退避)
- [技巧 18：Claude Code 作為寫作助手](#技巧-18claude-code-作為寫作助手)
- [技巧 19：Markdown 超讚](#技巧-19markdown-超讚)
- [技巧 20：使用 Notion 在貼上時保留連結](#技巧-20使用-notion-在貼上時保留連結)
- [技巧 21：使用容器執行長時間高風險任務](#技巧-21使用容器執行長時間高風險任務)
- [技巧 22：精進 Claude Code 使用技巧的最佳方法就是使用它](#技巧-22精進-claude-code-使用技巧的最佳方法就是使用它)
- [技巧 23：複製/分叉與半複製對話](#技巧-23複製分叉與半複製對話)
- [技巧 24：使用 realpath 取得絕對路徑](#技巧-24使用-realpath-取得絕對路徑)
- [技巧 25：了解 CLAUDE.md vs 技能 vs 斜線指令 vs 外掛程式](#技巧-25了解-claudemd-vs-技能-vs-斜線指令-vs-外掛程式)
- [技巧 26：互動式 PR 審查](#技巧-26互動式-pr-審查)
- [技巧 27：Claude Code 作為研究工具](#技巧-27claude-code-作為研究工具)
- [技巧 28：掌握驗證輸出結果的不同方式](#技巧-28掌握驗證輸出結果的不同方式)
- [技巧 29：Claude Code 作為 DevOps 工程師](#技巧-29claude-code-作為-devops-工程師)
- [技巧 30：保持 CLAUDE.md 簡潔並定期審查](#技巧-30保持-claudemd-簡潔並定期審查)
- [技巧 31：Claude Code 作為通用介面](#技巧-31claude-code-作為通用介面)
- [技巧 32：關鍵在於選擇正確的抽象層次](#技巧-32關鍵在於選擇正確的抽象層次)
- [技巧 33：審計你已核准的指令](#技巧-33審計你已核准的指令)
- [技巧 34：撰寫大量測試（並使用 TDD）](#技巧-34撰寫大量測試並使用-tdd)
- [技巧 35：在未知領域更加勇敢；迭代式問題解決](#技巧-35在未知領域更加勇敢迭代式問題解決)
- [技巧 36：在背景執行 bash 指令與子代理](#技巧-36在背景執行-bash-指令與子代理)
- [技巧 37：個人化軟體的時代已到來](#技巧-37個人化軟體的時代已到來)
- [技巧 38：導覽與編輯你的輸入框](#技巧-38導覽與編輯你的輸入框)
- [技巧 39：花時間規劃，同時也要快速原型驗證](#技巧-39花時間規劃同時也要快速原型驗證)
- [技巧 40：簡化過度複雜的程式碼](#技巧-40簡化過度複雜的程式碼)
- [技巧 41：自動化的自動化](#技巧-41自動化的自動化)
- [技巧 42：分享你的知識並在力所能及之處做出貢獻](#技巧-42分享你的知識並在力所能及之處做出貢獻)
- [技巧 43：持續學習！](#技巧-43持續學習)
- [技巧 44：安裝 dx 外掛程式](#技巧-44安裝-dx-外掛程式)
- [技巧 45：快速設定腳本](#技巧-45快速設定腳本)

<!-- /TOC -->

## 技巧 0：自訂你的狀態列

你可以自訂 Claude Code 底部的狀態列來顯示有用資訊。我的設定會顯示：模型名稱、目前目錄、git 分支（如果有的話）、未提交的檔案數量、與遠端的同步狀態，以及 token 使用量的視覺化進度條。第二行還會顯示我的上一條訊息，讓我記得對話內容：

```
Opus 4.5 | 📁claude-code-tips | 🔀main (scripts/context-bar.sh uncommitted, synced 12m ago) | ██░░░░░░░░ 18% of 200k tokens
💬 This is good. I don't think we need to change the documentation as long as we don't say that the default color is orange el...
```

這對於掌握上下文使用量以及記住你在做什麼特別有幫助。該腳本還支援 10 種顏色主題（橙色、藍色、青綠色、綠色、薰衣草色、玫瑰色、金色、石板色、青色或灰色）。

![顏色預覽選項](scripts/color-preview.png)

若要進行設定，你可以使用[這個範例腳本](scripts/context-bar.sh)，並查看[設定說明](scripts/README.md)。

## 技巧 1：學習幾個必備的斜線指令

Claude Code 有許多內建斜線指令（輸入 `/` 即可查看所有指令）。以下是幾個值得了解的指令：

### /usage

查看你的速率限制：

```
 Current session
 █████████▌                                         19% used
 Resets 12:59am (America/Vancouver)

 Current week (all models)
 █████████████████████▌                             43% used
 Resets Feb 3 at 1:59pm (America/Vancouver)

 Current week (Sonnet only)
 ███████████████████▌                               39% used
 Resets 8:59am (America/Vancouver)
```

如果你想密切監控使用量，可以在分頁中保持開啟，使用 Tab 再 Shift+Tab，或 ← 再 → 來重新整理。

### /chrome

切換 Claude 的原生瀏覽器整合：

```
> /chrome
Chrome integration enabled
```

### /mcp

管理 MCP（模型上下文協定）伺服器：

```
 Manage MCP servers
 1 server

 ❯ 1. playwright  ✔ connected · Enter to view details

 MCP Config locations (by scope):
  • User config (available in all your projects):
    • /Users/yk/.claude.json
```

### /stats

以 GitHub 風格的活動圖表查看你的使用統計：

```
      Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec Jan
      ··········································▒█░▓░█░▓▒▒
  Mon ·········································▒▒██▓░█▓█░█
      ·········································░▒█▒▓░█▒█▒█
  Wed ········································░▓▒█▓▓░▒▓▒██
      ········································░▓░█▓▓▓▓█░▒█
  Fri ········································▒░░▓▒▒█▓▓▓█
      ········································▒▒░▓░░▓▒▒░░

      Less ░ ▒ ▓ █ More

  Favorite model: Opus 4.5        Total tokens: 17.6m

  Sessions: 4.1k                  Longest session: 20h 40m 45s
  Active days: 79/80              Longest streak: 75 days
  Most active day: Jan 26         Current streak: 74 days

  You've used ~24x more tokens than War and Peace
```

### /clear

清除對話並重新開始。

## 技巧 2：用語音和 Claude Code 溝通

我發現用語音溝通比用手打字快得多。在本機上使用語音轉錄系統對此非常有幫助。

在我的 Mac 上，我嘗試了幾個不同的選項：
- [superwhisper](https://superwhisper.com/)
- [MacWhisper](https://goodsnooze.gumroad.com/l/macwhisper)
- [Super Voice Assistant](https://github.com/ykdojo/super-voice-assistant)（開源，支援 Parakeet v2/v3）

你可以透過使用託管服務來獲得更高的準確度，但我發現本機模型對這個用途已經足夠強大。即使轉錄中出現錯誤或打字錯誤，Claude 也足夠聰明，能理解你想說的意思。有時你需要更清楚地說某些詞語，但整體而言本機模型已經夠用。

例如，在這張截圖中你可以看到，Claude 能夠將 "ExcelElanishMark" 和 "advast" 等誤識別的詞語正確解讀為 "exclamation mark" 和 "Advanced"：

![語音轉錄錯誤被正確解讀](assets/voice-transcription-mistakes.png)

我認為最好的理解方式是：就像你在跟朋友溝通。當然，你可以透過文字溝通，這對某些人或透過電子郵件來說可能更容易，完全沒問題，這也是大多數人使用 Claude Code 的方式。但如果你想溝通得更快，為什麼不打個快速電話呢？你可以直接發送語音訊息，不需要真的和 Claude Code 通話，只要發送一堆語音訊息就好。對我來說這更快，因為我過去幾年練習了很多說話的技藝。不過我認為對大多數人來說也會更快。

常見的反對意見是「如果你在有其他人的房間裡怎麼辦？」我只是使用耳機輕聲耳語——我個人喜歡 Apple EarPods（不是 AirPods）。它們價格實惠，品質夠好，你只需要靜靜地耳語進去。我在別人面前這樣做過，效果很好。在辦公室裡，人們本來就會說話——與其跟同事說話，你是在安靜地跟你的語音轉錄系統說話。我認為這完全沒有問題。這個方法效果非常好，甚至在飛機上也能使用。飛機夠吵，其他人不會聽到你說話，但只要你靠近麥克風說話，你的本機模型仍然可以理解你說的話。（事實上，我正是用這個方法在一次飛行中寫下這一段文字的。）

**更新：** Claude Code 現在有[內建語音模式](https://x.com/bcherny/status/2032238378389840018)。我測試過，效果不錯，但我個人仍然使用本機模型，因為我覺得它更快。

## 技巧 3：將大問題分解為小問題

這是最重要的概念之一。這和傳統軟體工程完全相同——最優秀的軟體工程師已經知道如何做到這一點，同樣的原則也適用於 Claude Code。

如果你發現 Claude Code 無法一次性解決一個困難的問題或程式碼任務，請讓它把問題分解成多個較小的問題。看看它是否能解決其中的某個部分。如果還是太難，就看它能否解決更小的子問題。持續這樣做，直到所有問題都能解決。

本質上，不要直接從 A 到 B：

![直接方式](assets/breakdown-direct.png)

而是從 A 到 A1 到 A2 到 A3，然後到 B：

![逐步方式](assets/breakdown-steps.png)

一個好的例子是我在建立自己的語音轉錄系統時。我需要建立一個系統，讓使用者可以選擇並下載模型、使用鍵盤快捷鍵、開始轉錄、將轉錄的文字放在使用者游標位置，並將所有這些包裝在一個漂亮的 UI 中。這很多。所以我把它分解成更小的任務。首先，我建立了一個只會下載模型的可執行檔，什麼都不做。然後我建立了另一個只會錄製語音的可執行檔，什麼都不做。再建立另一個只會轉錄預錄音頻的可執行檔。我就這樣一個一個地完成它們，最後再把它們組合在一起。

與此密切相關的是：你的問題解決技能和軟體工程技能在代理程式編碼和 Claude Code 的世界中仍然非常重要。它能夠自行解決許多問題，但當你將你的一般問題解決和軟體工程技能應用於它時，它會變得更加強大。

## 技巧 4：像專家一樣使用 Git 和 GitHub CLI

直接讓 Claude 處理你的 Git 和 GitHub CLI 任務。這包括提交（這樣你就不必手動撰寫提交訊息）、分支、拉取和推送。

我個人允許自動拉取，但不允許自動推送，因為推送風險較高——如果拉取出了問題，不會污染遠端。

對於 GitHub CLI（`gh`），你可以做很多事情。我在使用 Claude Code 後開始做更多的一件事是建立草稿 PR。這讓 Claude Code 以低風險處理 PR 建立過程——你可以在標記為可審查之前審查所有內容。

事實證明，`gh` 非常強大。你甚至可以透過它發送任意 GraphQL 查詢。例如，你甚至可以找到 GitHub PR 描述被編輯的確切時間：

```
⏺ Bash(gh api graphql -f query='
      query {
        repository(owner: "...", name: "...") {
          pullRequest(number: ...) {
            userContentEdits(first: 100) {
              nodes { editedAt editor { login } }
            }
          }
        }
      }')

⏺ Here's the full edit history for your PR description:

  | #  | Edited At (UTC)     | Editor |
  |----|---------------------|--------|
  | 1  | 2025-12-01 00:08:34 | ykdojo |
  | 2  | 2025-12-01 15:57:21 | ykdojo |
  | 3  | 2025-12-01 16:24:33 | ykdojo |
  | 4  | 2025-12-01 16:27:00 | ykdojo |
  | 5  | 2025-12-04 00:40:02 | ykdojo |
  ...
```

### 停用提交/PR 歸屬

預設情況下，Claude Code 會在提交中添加 `Co-Authored-By` 尾部資訊，並在 PR 中添加歸屬頁腳。你可以透過在 `~/.claude/settings.json` 中添加以下內容來停用兩者：

```json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```

將兩者都設為空字串會完全移除歸屬資訊。這取代了舊的 `includeCoAuthoredBy` 設定，該設定現已棄用。

## 技巧 5：AI 上下文就像牛奶；越新鮮越精簡越好！

當你與 Claude Code 開始一個新對話時，它表現得最好，因為它不需要處理對話早期部分的所有先前上下文的複雜性。但隨著你談話的時間越來越長，上下文變得越來越長，效能往往會下降。

因此，最好為每個新主題開始一個新對話，或者在效能開始下降時這樣做。

## 技巧 6：從終端機中取得輸出內容

有時你想複製並貼上 Claude Code 的輸出，但直接從終端機複製並不總是乾淨。以下是幾種更輕鬆取得內容的方法：

- **`/copy` 指令**：最簡單的選項——只需輸入 `/copy` 即可將 Claude 的上一個回應以 markdown 格式複製到剪貼簿
- **直接使用剪貼簿**：在 Mac 或 Linux 上，請 Claude 使用 `pbcopy` 將輸出直接發送到你的剪貼簿
- **寫入檔案**：讓 Claude 將內容放入一個檔案，然後讓它在 VS Code（或你喜歡的編輯器）中打開，這樣你就可以從那裡複製。你也可以指定行號，讓 Claude 打開它剛剛編輯的特定行。對於 markdown 檔案，一旦在 VS Code 中打開，你可以使用 Cmd+Shift+P（或 Linux/Windows 上的 Ctrl+Shift+P）並選擇「Markdown: Open Preview」來查看渲染版本
- **打開 URL**：如果有一個你想自己查看的 URL，讓 Claude 在你的瀏覽器中打開它。在 Mac 上，你可以讓它使用 `open` 指令，但一般來說，要求在你喜愛的瀏覽器中打開應該在任何平台上都可以運作
- **GitHub Desktop**：你可以讓 Claude 在 GitHub Desktop 中打開目前的儲存庫。當它在非根目錄中工作時特別有用——例如，如果你讓它在不同的目錄中建立一個 git worktree，而你還沒有從那裡打開 Claude Code

你也可以將其中一些組合使用。例如，如果你想編輯 GitHub PR 描述，不要讓 Claude 直接編輯（它可能會弄亂），你可以先讓它將內容複製到本機檔案中。讓它進行編輯，自己檢查結果，一旦看起來不錯，讓它複製貼上回 GitHub PR。這效果非常好。或者如果你想自己做，你可以讓它在 VS Code 中打開，或透過 pbcopy 給你，這樣你就可以手動複製貼上。

當然，你可以自己執行這些指令，但如果你發現自己重複這樣做，讓 Claude 代你執行這些指令是很有幫助的。

## 技巧 7：設定終端機別名以快速存取

由於我因為 Claude Code 而更常使用終端機，我發現設定短別名很有幫助，這樣我就可以快速啟動東西。以下是我使用的別名：

- `c` 代表 Claude Code（這是我最常用的）
- `ch` 代表帶有 Chrome 整合的 Claude Code
- `gb` 代表 GitHub Desktop
- `co` 代表 VS Code
- `q` 代表前往我存放大多數專案的專案目錄。從那裡我可以手動 cd 進入個別資料夾來處理該專案，或者我可以直接用 `c` 啟動 Claude Code，讓它基本上可以存取它需要存取的任何專案

要設定這些別名，在你的 shell 設定檔（`~/.zshrc` 或 `~/.bashrc`）中添加如下這些行：

```bash
alias c='claude'
alias ch='claude --chrome'
alias gb='github'
alias co='code'
alias q='cd ~/Desktop/projects'
```

設定好這些別名後，你可以將它們與標誌組合使用：`c -c` 繼續你的上一個對話，`c -r` 顯示最近對話列表以繼續。這些也適用於 `ch`（`ch -c`、`ch -r`），用於 Chrome 工作階段。

## 技巧 8：主動壓縮你的上下文

Claude Code 中有一個 `/compact` 指令，可以總結你的對話以釋放上下文空間。當可用上下文全部填滿時，也會自動進行壓縮。Opus 4.5 的總可用上下文視窗目前為 200k，其中 45k 保留用於自動壓縮。系統提示、工具、記憶體和動態上下文大約會自動填滿總計 200k 的 10%。但我發現主動進行壓縮並手動調整效果更好。我透過 `/config` 關閉了自動壓縮，這樣我就能為主對話保留更多上下文，並對何時以及如何進行壓縮有更多控制。

我的做法是在重新開始之前請 Claude 撰寫一份交接文件。類似這樣：

> 將計畫的其餘部分放在 system-prompt-extraction 資料夾中，命名為 HANDOFF.md。說明你嘗試了什麼、哪些有效、哪些無效，這樣下一個擁有新鮮上下文的代理可以只載入該檔案，不需要其他任何東西，就能開始並完成這個任務。

Claude 會建立一個總結目前工作狀態的檔案：

```
⏺ Write(experiments/system-prompt-extraction/HANDOFF.md)
  ⎿  Wrote 129 lines to experiments/system-prompt-extraction/HANDOFF.md
     # System Prompt Slimming - Handoff Document
     ## Goal
     Reduce Claude Code's system prompt by ~45% (currently at 11%, need ~34% more).
     ## Current Progress
     ### What's Been Done
     - **Backup/restore system**: `backup-cli.sh` and `restore-cli.sh` with SHA256 verification
     - **Patch system**: `patch-cli.js` that restores from backup then applies patches
     ...
```

Claude 撰寫完後，快速審查一下。如果有遺漏的內容，請求修改：

> 你有加入關於迭代測試而不是嘗試一次性完成所有事情的說明嗎？

然後開始一個新的對話。對於新代理，你可以像這樣只給出檔案路徑，就應該可以正常運作：

```
> experiments/system-prompt-extraction/HANDOFF.md
```

在後續對話中，你可以讓代理為下一個代理更新文件。

我也建立了一個 `/handoff` 斜線指令來自動化這個過程——它會檢查是否存在 HANDOFF.md，如果存在則讀取它，然後建立或更新它，包含目標、進度、有效的方法、無效的方法以及後續步驟。你可以在 [skills 資料夾](skills/handoff/SKILL.md)中找到它，或透過 [dx 外掛程式](#技巧-44安裝-dx-外掛程式)安裝它。

**替代方案：使用計畫模式**

另一個選項是使用計畫模式。透過 `/plan` 或 Shift+Tab 進入計畫模式。讓 Claude 收集所有相關上下文並為下一個代理建立全面的計畫：

> 我剛啟用了計畫模式。把你需要的所有上下文都帶過去。下一個代理不會有任何其他上下文，所以你需要相當全面。

Claude 會探索程式碼庫、收集上下文並撰寫詳細計畫。完成後，你會看到如下選項：

```
Would you like to proceed?

❯ 1. Yes, clear context and auto-accept edits (shift+tab)
  2. Yes, auto-accept edits
  3. Yes, manually approve edits
  4. Type here to tell Claude what to change
```

選項 1 會清除先前的上下文，並以計畫重新開始。新的 Claude 實例只看到計畫，因此它可以專注於任務，而不受舊對話的包袱拖累。它也會獲得舊轉錄檔案的連結，以防需要查找特定細節。

## 技巧 9：完成自主任務的撰寫-測試循環

如果你想讓 Claude Code 自主執行某些事情，比如 `git bisect`，你需要給它一個驗證結果的方法。關鍵是完成撰寫-測試循環：撰寫程式碼、執行它、檢查輸出，然後重複。

例如，假設你正在處理 Claude Code 本身，你注意到 `/compact` 停止工作並開始拋出 400 錯誤。找到導致此問題的確切提交的經典工具是 `git bisect`。好消息是你可以讓 Claude Code 在它自己身上執行 bisect，但它需要一種測試每個提交的方法。

對於像 Claude Code 這樣涉及互動式終端機的任務，你可以使用 tmux。模式是：

1. 啟動一個 tmux 工作階段
2. 向它發送指令
3. 捕獲輸出
4. 驗證它是你期望的結果

以下是測試 `/context` 是否正常運作的簡單範例：

```bash
tmux kill-session -t test-session 2>/dev/null
tmux new-session -d -s test-session
tmux send-keys -t test-session 'claude' Enter
sleep 2
tmux send-keys -t test-session '/context' Enter
sleep 1
tmux capture-pane -t test-session -p
```

一旦你有了這樣的測試，Claude Code 就可以執行 `git bisect` 並自動測試每個提交，直到找到破壞功能的那個提交。

這也是一個例子，說明你的軟體工程技能仍然很重要。如果你是軟體工程師，你可能知道像 `git bisect` 這樣的工具。這些知識在與 AI 合作時仍然非常有價值——你只是以新的方式應用它。

另一個例子是簡單地撰寫測試。在讓 Claude Code 撰寫一些程式碼後，如果你想測試它，你可以讓它也為自己撰寫測試。讓它自行執行並在可能的情況下修復問題。當然，它並不總是朝著正確的方向前進，有時你需要監督它，但它能夠自行完成令人驚訝的大量程式碼任務。

### 創意性測試策略

有時你需要對如何完成撰寫-測試循環有所創意。例如，如果你正在建立一個網頁應用程式，你可以使用 Playwright MCP、Chrome DevTools MCP，或 Claude 的原生瀏覽器整合（透過 `/chrome`）。我還沒試過 Chrome DevTools，但我試過 Playwright 和 Claude 的原生整合。整體而言，Playwright 通常效果更好。它確實使用大量上下文，但 200k 的上下文視窗通常足夠完成單一任務或幾個較小的任務。

這兩者之間的主要差異似乎是 Playwright 專注於無障礙樹（關於頁面元素的結構化資料）而不是截取螢幕截圖。它確實有截取螢幕截圖的能力，但通常不會用它來採取行動。另一方面，Claude 的原生瀏覽器整合更側重於截取螢幕截圖並按特定坐標點擊元素。它有時會點擊到隨機的東西，而且整個過程可能很慢。

這可能會隨著時間的推移而改善，但預設情況下，我會對大多數視覺上不密集的任務選擇 Playwright。只有當我需要使用已登入的狀態而不必提供憑證（因為它在你自己的瀏覽器設定檔中執行），或者需要按坐標視覺化點擊東西時，我才會使用 Claude 的原生瀏覽器整合。

這就是為什麼我預設停用 Claude 的原生瀏覽器整合，並透過之前定義的 `ch` 快捷鍵來使用它。這樣 Playwright 處理大多數瀏覽器任務，我只在特別需要時才啟用 Claude 的原生整合。

此外，你可以讓它使用無障礙樹參照而不是坐標。以下是我在 CLAUDE.md 中放置的內容：

```markdown
# Claude for Chrome

- Use `read_page` to get element refs from the accessibility tree
- Use `find` to locate elements by description
- Click/interact using `ref`, not coordinates
- NEVER take screenshots unless explicitly requested by the user
```

在我的個人經驗中，我也遇到過這樣的情況：我在處理一個 Python 函式庫（[Daft](https://github.com/Eventual-Inc/Daft)），需要在 Google Colab 上測試我在本機建立的版本。問題是在 Google Colab 上建立帶有 Rust 後端的 Python 函式庫很困難——似乎效果不太好。所以我需要在本機實際建立一個 wheel，然後手動上傳，這樣我才能在 Google Colab 上執行它。我也嘗試了 monkey patching，在短期內效果很好，在我等待整個 wheel 在本機建立之前。我想出了這些測試策略，並透過與 Claude Code 的來回討論來執行它們。

我遇到的另一個情況是我需要在 Windows 上測試某些東西，但我沒有執行 Windows 的機器。同一個儲存庫上的 CI 測試失敗，因為我們在 Windows 上的 Rust 有一些問題，而我沒有辦法在本機測試。所以我需要建立一個包含所有更改的草稿 PR，以及另一個包含相同更改加上在非主分支上啟用 Windows CI 執行的草稿 PR。我指示 Claude Code 完成所有這些，然後我直接在那個新分支上測試 CI。

## 技巧 10：Cmd+A 和 Ctrl+A 是你的好朋友

我幾年前就開始說這個了：在 AI 的世界裡，Cmd+A 和 Ctrl+A 是好朋友。這也適用於 Claude Code。

有時你想給 Claude Code 一個 URL，但它無法直接存取。也許它是一個私人頁面（不是敏感資料，只是無法公開存取），或者像是 Claude Code 難以抓取的 Reddit 貼文。在這些情況下，你可以直接全選你看到的所有內容（Mac 上的 Cmd+A，其他平台上的 Ctrl+A），複製它，然後直接貼到 Claude Code 中。這是一個相當強大的方法。

這對於終端機輸出也非常有效。當我有來自 Claude Code 本身或任何其他 CLI 應用程式的輸出時，我可以使用相同的技巧：全選、複製，然後貼回 CC。非常有幫助。

有些頁面預設不適合全選——但有一些技巧可以先讓它們處於更好的狀態。例如，對於 Gmail 郵件串，點擊「列印全部」以獲取列印預覽（但取消實際列印）。該頁面以展開狀態顯示郵件串中的所有電子郵件，因此你可以乾淨地 Cmd+A 整個對話。對於詢問 YouTube 影片問題或總結它，你可以點擊 YouTube 影片上的「顯示字幕」，然後執行 Cmd+A 或 Ctrl+A。

這適用於任何 AI，不僅僅是 Claude Code。

## 技巧 11：使用 Gemini CLI 作為封鎖網站的備用方案

Claude Code 的 WebFetch 工具無法存取某些網站，例如 Reddit。但你可以透過建立一個技能來解決這個問題，告訴 Claude 使用 Gemini CLI 作為備用方案。Gemini 具有網路存取能力，可以從 Claude 無法直接存取的網站抓取內容。

這使用了技巧 9 中相同的 tmux 模式——啟動一個工作階段、發送指令、捕獲輸出。技能檔案放在 `~/.claude/skills/reddit-fetch/SKILL.md` 中。查看 [skills/reddit-fetch/SKILL.md](skills/reddit-fetch/SKILL.md) 了解完整內容。

技能的 token 效率更高，因為 Claude Code 只在需要時才載入它們。如果你想要更簡單的方案，你可以在 `~/.claude/CLAUDE.md` 中放置一個精簡版本，但這樣每次對話都會載入，無論你是否需要它。

我透過讓 Claude Code 查看 Reddit 上如何看待 Claude Code 技能來測試這個功能——有點 meta。它與 Gemini 來回交流了一段時間，所以不快，但報告品質令人驚訝地好。顯然，你需要安裝 Gemini CLI 才能讓這個功能運作。你也可以透過 [dx 外掛程式](#技巧-44安裝-dx-外掛程式)安裝這個技能。

## 技巧 12：投資你自己的工作流程

就個人而言，我從頭開始用 Swift 建立了自己的語音轉錄應用程式。我用 Claude Code 從頭開始建立了自己的自訂狀態列，這個是用 bash。我還建立了自己的系統來簡化 Claude Code 壓縮 JavaScript 檔案中的系統提示。

但你不必像那樣過度。只要好好維護你自己的 CLAUDE.md，確保它盡可能簡潔，同時又能幫助你實現目標——這些都很有幫助。當然，學習這些技巧、學習這些工具，以及一些最重要的功能。

所有這些都是對你用來建構任何你想建構的東西的工具的投資。我認為至少花一點時間在這上面是很重要的。

## 技巧 13：搜尋你的對話歷史

你可以讓 Claude Code 查詢你過去的對話，它會幫你找到並搜尋它們。你的對話歷史儲存在 `~/.claude/projects/` 本機，資料夾名稱基於專案路徑（斜線變成破折號）。

例如，位於 `/Users/yk/Desktop/projects/claude-code-tips` 的專案的對話將儲存在：

```
~/.claude/projects/-Users-yk-Desktop-projects-claude-code-tips/
```

每個對話都是一個 `.jsonl` 檔案。你可以使用基本的 bash 指令搜尋它們：

```bash
# 尋找所有提到 "Reddit" 的對話
grep -l -i "reddit" ~/.claude/projects/-Users-yk-Desktop-projects-*/*.jsonl

# 尋找今天關於某個主題的對話
find ~/.claude/projects/-Users-yk-Desktop-projects-*/*.jsonl -mtime 0 -exec grep -l -i "keyword" {} \;

# 從對話中提取只有使用者訊息的部分（需要 jq）
cat ~/.claude/projects/.../conversation-id.jsonl | jq -r 'select(.type=="user") | .message.content'
```

或者直接問 Claude Code：「我們今天談到了什麼關於 X 的事情？」它會為你搜尋歷史記錄。

## 技巧 14：使用終端機分頁進行多工處理

執行多個 Claude Code 實例時，保持組織有序比任何特定的技術設定（如 Git worktree）更重要。我建議一次最多專注於三到四個任務。

我個人的方法是我稱之為「瀑布」的方式——每當我開始一個新任務，我就在右邊打開一個新分頁。然後我從左到右、從左到右地掃描，從最舊的任務到最新的。總體方向保持一致，除非我需要查看某些任務、獲取通知等。

以下是我的設定通常的樣子：

![顯示多工作流程的終端機分頁](assets/multitasking-terminal-tabs.png)

在這個例子中：
1. **最左邊的分頁** - 一個執行我的語音轉錄系統的持久分頁（始終在這裡）
2. **第二個分頁** - 設定 Docker 容器
3. **第三個分頁** - 檢查本機機器上的磁碟使用量
4. **第四個分頁** - 處理一個工程專案
5. **第五個分頁（目前）** - 正在撰寫這個技巧

## 技巧 15：精簡系統提示

Claude Code 的系統提示和工具定義在你開始工作之前就佔用了大約 19k token（約 10% 的 200k 上下文）。我建立了一個補丁系統，將其減少到大約 9k token——節省了大約 10,000 token（約 50% 的開銷）。

| 元件 | 之前 | 之後 | 節省 |
|-----------|--------|-------|---------|
| 系統提示 | 3.0k | 1.8k | 1,200 tokens |
| 系統工具 | 15.6k | 7.4k | 8,200 tokens |
| **總計** | **~19k** | **~9k** | **~10k tokens (~50%)** |

以下是補丁前後 `/context` 的樣子：

**未補丁（~20k, 10%）**

![未補丁的上下文](assets/context-unpatched.png)

**已補丁（~10k, 5%）**

![已補丁的上下文](assets/context-patched.png)

這些補丁透過從壓縮的 CLI 套件中修剪冗長的範例和多餘的文字，同時保留所有必要的說明。

我已對此進行了廣泛測試，效果很好。感覺更原始——更強大，但也許稍微少了一些規範，這是有道理的，因為系統說明更短。以這種方式使用時感覺更像一個專業工具。我真的很喜歡從較低的上下文開始，因為在填滿之前你有更多空間，這讓你可以稍微延長對話。這絕對是這個策略最好的部分。

查看 [system-prompt 資料夾](system-prompt/)了解補丁腳本和完整的修剪詳情。

**為什麼使用補丁？** Claude Code 有標誌可以讓你從檔案提供簡化的系統提示（`--system-prompt` 或 `--system-prompt-file`），所以那是另一種方法。但對於工具描述，沒有官方選項可以自訂它們。補丁 CLI 套件是唯一的方法。由於我的補丁系統以一種統一的方式處理所有事情，我現在保持這種方式。我可能會在未來使用標誌重新實現系統提示部分。

**支援的安裝：** npm 和原生二進位（macOS 和 Linux）。

**重要**：如果你想保留已補丁的系統提示，請透過在 `~/.claude/settings.json` 中添加以下內容來停用自動更新：

```json
{
  "env": {
    "DISABLE_AUTOUPDATER": "1"
  }
}
```

這適用於所有 Claude Code 工作階段，無論 shell 類型（互動式、非互動式、tmux）。你可以在準備好對新版本重新應用補丁時手動更新。

### 延遲載入 MCP 工具

如果你使用 MCP 伺服器，它們的工具定義預設會載入到每個對話中——即使你不使用它們。這可能會增加顯著的開銷，尤其是配置了多個伺服器時。

啟用延遲載入，讓 MCP 工具只在需要時才載入：

```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "true"
  }
}
```

將這個添加到 `~/.claude/settings.json`。Claude 將按需搜尋和載入 MCP 工具，而不是從一開始就全部載入。從版本 2.1.7 起，當 MCP 工具描述超過上下文視窗的 10% 時，這會自動發生。

## 技巧 16：使用 Git Worktree 進行平行分支工作

如果你同時在同一個專案中處理多件事，而又不想讓它們發生衝突，Git worktree 是一個很好的方法。你可以直接讓 Claude Code 建立一個 git worktree 並在那裡開始工作——你不必擔心具體的語法。

基本概念是你可以在不同的目錄中處理不同的分支。它本質上是一個分支加上一個目錄。

你可以在多工技巧中討論的瀑布方法之上添加這個 Git worktree 層次。

### 什麼是 git worktree？

git worktree 就像任何其他 git 分支一樣，但有一個專門指定給它的新目錄。

因此，如果你正在處理，比如說，主分支和 feature-branch-1，那麼如果沒有 git worktree，你一次只能處理其中一個，因為你的專案資料夾一次只能設定到一個分支。

然而，使用 git worktree，你可以繼續在原始專案資料夾中處理主分支（或任何其他分支），同時在一個新資料夾中處理 feature-branch-1。

![顯示在不同目錄中平行分支工作的 Git worktree 圖表](assets/git-worktrees.png)

## 技巧 17：長時間執行任務的手動指數退避

在等待長時間執行的任務（如 Docker 建立或 GitHub CI）時，你可以讓 Claude Code 進行手動指數退避。指數退避是軟體工程中的常見技術，但你也可以在這裡應用它。讓 Claude Code 以遞增的休眠間隔檢查狀態——一分鐘、然後兩分鐘、然後四分鐘，依此類推。它不是以傳統意義上程式化的方式進行——AI 是手動進行的——但效果相當不錯。

這樣代理可以持續檢查狀態，一旦完成就通知你。

（對於 GitHub CI，`gh run watch` 存在，但它持續輸出許多行，浪費 token。使用 `gh run view <run-id> | grep <job-name>` 的手動指數退避實際上更節省 token。這也是一種通用技術，即使在沒有專用等待指令的情況下也能很好地運作。）

例如，如果你有一個在背景執行的 Docker 建立：

![手動指數退避檢查 Docker 建立進度](assets/manual-exponential-backoff.png)

它會持續執行，直到任務完成。

## 技巧 18：Claude Code 作為寫作助手

Claude Code 是一個出色的寫作助手和夥伴。我用它來寫作的方式是：首先給它所有關於我想寫什麼的上下文，然後用我的語音給它詳細的說明。這給了我第一稿。如果還不夠好，我會再試幾次。

然後我逐行仔細審查。我說好，讓我們一起看看。我喜歡這行，原因是這樣的。我覺得這行需要移到那裡。這行需要以這種特定的方式改變。我也可能詢問參考資料。

所以這是一種來回的過程，也許左邊是終端機，右邊是程式碼編輯器：

![使用 Claude Code 的並排寫作工作流程](assets/writing-assistant-side-by-side.png)

這往往效果非常好。

## 技巧 19：Markdown 超讚

通常當人們寫新文件時，他們可能會使用像 Google Docs 或 Notion 這樣的東西。但我現在誠實地認為，最有效的方式是 markdown。

即使在 AI 出現之前，Markdown 就已經相當不錯了，但特別是對於 Claude Code 來說，因為如我所說它在寫作方面效率很高，這在我看來提高了 markdown 的價值。無論你何時想寫部落格文章，甚至 LinkedIn 貼文，你都可以直接跟 Claude Code 說話，讓它以 markdown 格式儲存，然後從那裡繼續。

關於這個的一個快速技巧：如果你想將 markdown 內容複製貼上到不容易接受它的平台，你可以先將它貼到一個新的 Notion 檔案中，然後從 Notion 複製到其他平台。Notion 將其轉換為其他平台可以接受的格式。如果普通貼上不起作用，試試 Command + Shift + V 以不帶格式貼上。

## 技巧 20：使用 Notion 在貼上時保留連結

事實證明，反向操作也有效。如果你有來自其他地方的帶連結的文字，比如來自 Slack，你可以複製它。如果你直接貼到 Claude Code 中，它不會顯示連結。但如果你先把它放在 Notion 文件中，然後從那裡複製，你就會得到 markdown 格式，當然 Claude Code 可以讀取。

## 技巧 21：使用容器執行長時間高風險任務

常規工作階段更適合有條不紊的工作，你控制給予的權限並更仔細地審查輸出。容器化環境非常適合使用 `--dangerously-skip-permissions` 的工作階段，在那裡你不必為每件小事授予許可。你可以讓它自行執行一段時間。

這對於研究或實驗很有用，這些事情需要很長時間，可能有些風險。一個好的例子是技巧 11 中的 Reddit 研究工作流程，其中 reddit-fetch 技能透過 tmux 與 Gemini CLI 來回交流。在你的主要系統上無監督地執行這個是有風險的，但在容器中，如果出了問題，它是被包含的。

另一個例子是我如何在這個儲存庫中建立[系統提示補丁腳本](system-prompt/)。當 Claude Code 的新版本出來時，我需要為壓縮的 CLI 套件更新補丁。我不是在我的主機機器上使用 `--dangerously-skip-permissions` 執行 Claude Code（它可以存取所有東西），而是在容器中執行它。Claude Code 可以探索壓縮的 JavaScript、找到變數映射，並建立新的補丁檔案，而不必我核准每件小事。

事實上，它幾乎能夠自行完成遷移。它嘗試應用補丁，發現一些與新版本不相容，迭代修復它們，甚至根據它學到的東西改進了[說明文件](system-prompt/UPGRADING.md)以供未來的實例使用。

我甚至建立了 [SafeClaw](https://github.com/ykdojo/safeclaw) 來讓執行容器化 Claude Code 工作階段變得更容易。它讓你能夠啟動多個隔離的工作階段，每個都有一個網頁終端機，並從儀表板管理它們。它使用了這個儲存庫的幾個自訂設定，包括優化的系統提示、[DX 外掛程式](#技巧-44安裝-dx-外掛程式)和[狀態列](#技巧-0自訂你的狀態列)。

### 進階：在容器中編排工作者 Claude Code

你可以進一步讓你的本機 Claude Code 控制另一個在容器內執行的 Claude Code 實例。訣竅是使用 tmux 作為控制層：

1. 你的本機 Claude Code 啟動一個 tmux 工作階段
2. 在那個 tmux 工作階段中，它執行或連接到容器
3. 在容器內，Claude Code 以 `--dangerously-skip-permissions` 執行
4. 你的外部 Claude Code 使用 `tmux send-keys` 發送提示，使用 `capture-pane` 讀取輸出

這給你一個完全自主的「工作者」Claude Code，可以執行實驗性或長時間執行的任務，而不必你核准每個行動。完成後，你的本機 Claude Code 可以拉取結果。如果出了問題，一切都被沙盒在容器中。

### 進階：多模型編排

除了 Claude Code，你還可以在容器中執行不同的 AI CLI——Codex、Gemini CLI 或其他。我嘗試了 OpenAI Codex 進行程式碼審查，效果很好。重點不是你不能直接在主機機器上執行這些 CLI——你顯然可以。價值在於 Claude Code 的 UI/UX 足夠流暢，你可以直接跟它說話，讓它處理編排：啟動不同的模型、在容器和主機之間傳送資料。不需要手動切換終端機和複製貼上，Claude Code 成為協調所有事情的中央介面。

## 技巧 22：精進 Claude Code 使用技巧的最佳方法就是使用它

最近我看到一個世界級的攀岩者接受另一個攀岩者的訪問。她被問到「你如何精進攀岩技巧？」她簡單地說「透過攀岩。」

我對這個問題也有同感。當然，有一些補充性的事情你可以做，比如觀看影片、閱讀書籍、學習技巧。但使用 Claude Code 是學習如何使用它的最佳方式。一般來說，使用 AI 是學習如何使用 AI 的最佳方式。

我喜歡把它想成是十億 token 規則，而不是一萬小時規則。如果你想在 AI 方面變得更好，真正對其工作原理有良好的直覺，最好的方法是消耗大量的 token。現在這是可以實現的。我發現，特別是使用 Opus 4.5，它足夠強大，但又足夠實惠，你可以同時執行多個工作階段。你不必過多擔心 token 使用量，這讓你自由了很多。

## 技巧 23：複製/分叉與半複製對話

有時你想從對話中的某個特定點嘗試不同的方法，而不丟失你原來的線索。[clone-conversation 腳本](scripts/clone-conversation.sh)讓你可以用新的 UUID 複製對話，這樣你就可以分叉出去。

**內建替代方案（近期版本）：** Claude Code 現在有原生分叉功能：
- `/fork` - 在對話中從目前工作階段進行分叉
- `--fork-session` - 與 `--resume` 或 `--continue` 一起使用（例如，`claude -c --fork-session`）

由於 `--fork-session` 沒有縮短形式，你可以將這個函式添加到你的 `~/.zshrc` 或 `~/.bashrc` 中，使用 `--fs` 作為快捷鍵：

```bash
claude() {
  local args=()
  for arg in "$@"; do
    if [[ "$arg" == "--fs" ]]; then
      args+=("--fork-session")
    else
      args+=("$arg")
    fi
  done
  command claude "${args[@]}"
}
```

這會攔截所有 `claude` 指令，將 `--fs` 展開為 `--fork-session`，並將其他所有內容原樣傳遞。也適用於別名（請參見[技巧 7](#技巧-7設定終端機別名以快速存取)）：`c -c --fs`、`ch -c --fs` 等。

下面的複製腳本早於這些內建選項，但下面的半複製腳本仍然是獨特的，用於減少上下文。

第一條訊息帶有 `[CLONED <timestamp>]` 標籤（例如，`[CLONED Jan 7 14:30]`），這在 `claude -r` 列表和對話內部都會顯示。

要手動設定它，請為這兩個檔案建立符號連結：
```bash
ln -s /path/to/this/repo/scripts/clone-conversation.sh ~/.claude/scripts/clone-conversation.sh
ln -s /path/to/this/repo/skills/clone ~/.claude/skills/clone
```

或者透過 [dx 外掛程式](#技巧-44安裝-dx-外掛程式)安裝——不需要符號連結。

然後在任何對話中輸入 `/clone`（或使用外掛程式時輸入 `/dx:clone`），Claude 會處理找到工作階段 ID 並執行腳本的工作。

我對此進行了廣泛測試，複製效果非常好。

### 半複製以減少上下文

當對話變得太長時，[half-clone-conversation 腳本](scripts/half-clone-conversation.sh)只保留後半部分。這減少了 token 使用量，同時保留了你近期的工作。第一條訊息帶有 `[HALF-CLONE <timestamp>]` 標籤（例如，`[HALF-CLONE Jan 7 14:30]`）。

要手動設定它，請為這兩個檔案建立符號連結：
```bash
ln -s /path/to/this/repo/scripts/half-clone-conversation.sh ~/.claude/scripts/half-clone-conversation.sh
ln -s /path/to/this/repo/skills/half-clone ~/.claude/skills/half-clone
```

或者透過 [dx 外掛程式](#技巧-44安裝-dx-外掛程式)安裝——不需要符號連結。

### 使用鉤子自動建議半複製

可選地，你可以使用[鉤子](https://docs.anthropic.com/en/docs/claude-code/hooks)在上下文變得太長時自動觸發 `/half-clone`。[check-context 腳本](scripts/check-context.sh)在每次 Claude 回應後執行，並檢查上下文使用量。如果超過 85%，它告訴 Claude 執行 `/half-clone`，這將建立一個只有後半部分的新對話，讓新代理可以從那裡繼續。

要設定它，首先複製腳本：
```bash
cp /path/to/this/repo/scripts/check-context.sh ~/.claude/scripts/check-context.sh
chmod +x ~/.claude/scripts/check-context.sh
```

然後將鉤子添加到你的 `~/.claude/settings.json`：
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/check-context.sh"
          }
        ]
      }
    ]
  }
}
```

這需要停用自動壓縮（`/config` > Auto-compact > false），否則 Claude Code 可能在鉤子有機會觸發之前就壓縮上下文。觸發時，鉤子會阻止 Claude 停止並告訴它執行 `/half-clone`。與自動壓縮相比的優點是，半複製是確定性且快速的——它保留你的實際訊息不變，而不是對它們進行總結。

### 複製腳本的建議權限

兩個複製腳本都需要讀取 `~/.claude`（用於對話檔案和歷史記錄）。為了避免來自任何專案的權限提示，請將此添加到你的全域設定（`~/.claude/settings.json`）：
```json
{
  "permissions": {
    "allow": ["Read(~/.claude)"]
  }
}
```

## 技巧 24：使用 realpath 取得絕對路徑

當你需要告訴 Claude Code 關於不同資料夾中的檔案時，使用 `realpath` 來取得完整的絕對路徑：

```bash
realpath some/relative/path
```

## 技巧 25：了解 CLAUDE.md vs 技能 vs 斜線指令 vs 外掛程式

這些是有些相似的功能，我一開始覺得它們相當令人困惑。我一直在拆解它們並盡力理解它們，所以我想分享我學到的東西。

**CLAUDE.md** 是最簡單的。它是一堆被視為預設提示的檔案，無論如何都會載入到每個對話的開頭。它的優點是簡單性。你可以解釋特定專案中的專案是什麼（`./CLAUDE.md`）或全域設定（`~/.claude/CLAUDE.md`）。

**技能**（Skills）就像結構更好的 CLAUDE.md 檔案。它們可以在相關時由 Claude 自動呼叫，也可以由使用者手動用斜線呼叫（例如，`/my-skill`）。例如，你可以有一個技能，當你詢問如何用某種語言發音一個詞時，它會以適當格式打開一個 Google 翻譯連結。如果這些說明在技能中，它們只在需要時才載入。如果它們在 CLAUDE.md 中，它們就已經在那裡佔用空間了。所以技能理論上更節省 token。

**斜線指令**（Slash Commands）類似於技能，因為它們是分別打包說明的方式。它們可以由使用者手動呼叫，也可以由 Claude 本身呼叫。如果你需要更精確的東西，在正確的時間按照你自己的節奏呼叫，斜線指令是要使用的工具。

技能和斜線指令在功能上非常相似。差異在於設計意圖——技能主要是為 Claude 設計的，而斜線指令主要是為使用者設計的。然而，它們最終[合併了它們](https://www.reddit.com/r/ClaudeAI/comments/1q92wwv/merged_commands_and_skills_in_213_update/)，正如我[建議這個更改](https://github.com/anthropics/claude-code/issues/13115)一樣。

**外掛程式**（Plugins）是將技能、斜線指令、代理、鉤子和 MCP 伺服器打包在一起的方式。但外掛程式不必使用所有這些。Anthropic 的官方 `frontend-design` 外掛程式本質上只是一個技能，僅此而已。它可以作為獨立的技能發布，但外掛程式格式使其更易於安裝。

例如，我建立了一個叫做 `dx` 的外掛程式，它將這個儲存庫的斜線指令和技能捆綁在一起。你可以在[安裝 dx 外掛程式](#技巧-44安裝-dx-外掛程式)部分看到它是如何工作的。

## 技巧 26：互動式 PR 審查

Claude Code 非常適合 PR 審查。程序很簡單：你讓它使用 `gh` 指令獲取 PR 資訊，然後你可以按照你想要的方式進行審查。

你可以進行一般審查，或逐個檔案、逐步進行。你控制節奏。你控制你想深入研究的細節程度和複雜性。也許你只是想了解大致結構，或者也許你想讓它也執行測試。

關鍵區別在於 Claude Code 充當互動式 PR 審查者，而不僅僅是一次性機器。一些 AI 工具擅長一次性審查（包括最新的 GPT 模型），但使用 Claude Code 你可以進行對話。

## 技巧 27：Claude Code 作為研究工具

Claude Code 非常適合任何種類的研究。它本質上是 Google 替代品或深度研究替代品，但在幾個不同的方面更先進。無論你是在研究某些 GitHub Actions 失敗的原因（我最近一直在做很多這樣的事情），在 Reddit 上做情感或市場分析，探索你的程式碼庫，還是探索公開資訊以找到某些東西——它都能做到。

關鍵是給它正確的資訊片段以及關於如何存取這些資訊片段的說明。可能是 `gh` 終端機指令存取，或者容器方法（技巧 21），或者透過 Gemini CLI 存取 Reddit（技巧 11），或者透過 Slack MCP 等 MCP 存取私人資訊，或者 Cmd+A / Ctrl+A 方法（技巧 10）——無論如何。此外，如果 Claude Code 在載入某些 URL 時遇到問題，你可以嘗試使用 Playwright MCP 或 Claude 的原生瀏覽器整合（請參見技巧 9）。對於科學研究，我建立了一個 [paper-search](https://github.com/ykdojo/paper-search) 外掛程式用於搜尋學術論文。

事實上，我甚至能夠[使用 Claude Code 做研究省下了 10,000 美元](content/how-i-saved-10k-with-claude-code.md)。

## 技巧 28：掌握驗證輸出結果的不同方式

驗證輸出的一種方式（如果是程式碼的話）是讓它撰寫測試，並確保測試總體上看起來不錯。這是一種方式，但你當然也可以在 Claude Code UI 中隨時檢查它生成的程式碼。另一件事是你可以使用視覺化 Git 客戶端，例如 GitHub Desktop。我個人使用它。它不是一個完美的產品，但對於快速檢查更改已經足夠好。如我在本文前面可能提到的，讓它生成 PR 也是一個很好的方式。讓它建立草稿 PR，在將其轉換為真正的 PR 之前檢查內容。

另一個是讓它檢查自己，它自己的工作。如果它給你某種輸出，比如來自某些研究，你可以說「你確定嗎？你能再次檢查一下嗎？」我最喜歡的提示之一是說「仔細檢查所有內容，你所產生的每一個聲明，最後製作一個你能夠驗證的表格」——這似乎效果非常好。

## 技巧 29：Claude Code 作為 DevOps 工程師

我特意想為此建立一個單獨的技巧，因為它對我來說真的很了不起。每當有 GitHub Actions CI 失敗時，我只是把它給 Claude Code 說「深入研究這個問題，嘗試找到根本原因。」有時它給你表面的答案，但如果你繼續追問——它是由特定提交、特定 PR 引起的，還是一個不穩定的問題？——它真的幫助你深入挖掘這些難以手動挖掘的棘手問題。你需要滾動查看大量日誌，手動這樣做會非常痛苦，但 Claude Code 能夠處理很多這樣的工作。

我將這個工作流程打包為一個 `/gha` 斜線指令——只需用任何 GitHub Actions URL 執行 `/gha <url>`，它就會自動調查失敗、檢查不穩定性、識別破壞提交並建議修復。你可以在 [skills 資料夾](skills/gha/SKILL.md)中找到它，或透過 [dx 外掛程式](#技巧-44安裝-dx-外掛程式)安裝它。

一旦你確定了特定問題是什麼，你就可以建立一個草稿 PR，並完成我之前提到的一些技巧——檢查輸出，確保它看起來不錯，讓它驗證自己的輸出，然後將其轉換為真正的 PR 以實際解決問題。對我個人來說，這一直效果非常好。

## 技巧 30：保持 CLAUDE.md 簡潔並定期審查

保持 CLAUDE.md 簡單和盡可能簡潔非常重要。你可以從完全沒有 CLAUDE.md 開始。如果你發現自己一遍又一遍地告訴 Claude Code 同樣的事情，那麼你可以把它添加到 CLAUDE.md。我知道有一個選項可以透過 `#` 符號來做到這一點，但我更喜歡直接讓 Claude Code 將其添加到專案級別的 CLAUDE.md 或全域 CLAUDE.md，它會知道該編輯什麼。

![保持簡單的梗圖](assets/keep-it-simple-meme.jpg)

定期審查你的 CLAUDE.md 檔案也很重要，因為它們可能隨著時間的推移而過時。某些時候有意義的說明可能不再相關，或者你可能有應該記錄的新模式。我建立了一個叫做 [`review-claudemd`](skills/review-claudemd/SKILL.md) 的技能，分析你最近的對話並為你的 CLAUDE.md 檔案建議改進。

## 技巧 31：Claude Code 作為通用介面

我以前認為，有了 Claude Code，CLI 就像新的 IDE，在某種程度上仍然如此。我認為當你想要對你的專案進行快速編輯等時，它是一個很好的首選地方。但根據你的專案的嚴重性，你想要比僅僅停留在感覺編碼層次更謹慎地對待輸出。

但也同樣正確的是，更一般的情況是，Claude Code 真的是你電腦、數位世界、任何你擁有的數位問題的通用介面。在許多情況下，你可以讓它解決問題。例如，如果你需要對你的影片進行快速編輯，你可以直接讓它這樣做——它可能會通過 ffmpeg 或類似的東西弄清楚怎麼做。如果你想轉錄你本機有的一堆音頻或影片檔案，你可以直接讓它這樣做——它可能會建議使用 Python 透過 Whisper 來做。如果你想分析你在 CSV 檔案中有的一些資料，它可能會建議使用 Python 或 JavaScript 來視覺化它。當然，有了網路存取——Reddit、GitHub、MCP——可能性是無限的。

它也非常適合你想要在本機電腦上執行的任何操作。例如，如果你的儲存空間不足，你可以直接讓它給你一些關於如何清理的建議。它會查看你的本機資料夾和檔案，嘗試找到什麼佔用了大量空間，然後給你關於如何清理它們的建議——也許刪除特別大的檔案。在我的案例中，我有一些應該清理的 Final Cut Pro 檔案，真的很大。Claude Code 告訴了我。也許它會告訴你使用 `docker system prune` 清理未使用的 Docker 映像和容器。或者也許它會告訴你清理一些你從未意識到還在那裡的快取。無論你想在電腦上做什麼，Claude Code 現在是我首先去的地方。

我認為這有點有趣，因為電腦起初是一個文字介面。而我們在某種程度上，正在回到這個你可以同時開啟三四個分頁的文字介面，如我之前提到的。對我來說，這真的很令人興奮。感覺就像你有了第二個大腦。但由於它的結構方式，因為它只是一個終端機分頁，你可以打開第三個大腦、第四個大腦、第五個大腦、第六個大腦。隨著模型變得越來越強大，你可以委派給這些東西的思考比例——不是重要的事情，而是你不想做的事情或你覺得無聊或太繁瑣的事情——你可以讓它們來處理。如我所提到的，一個很好的例子是深入研究 GitHub Actions。誰想做那件事？但事實證明，這些代理非常擅長那些無聊的任務。

## 技巧 32：關鍵在於選擇正確的抽象層次

如我之前提到的，有時停留在感覺編碼層次是可以的。如果你在處理一次性專案或程式碼庫的非關鍵部分，你不必擔心每一行程式碼。但其他時候，你想深入一點——查看檔案結構和函式、個別程式碼行，甚至檢查依賴項。

![感覺編碼頻譜](assets/vibe-coding-spectrum.png)

關鍵是它不是二元的。有些人說感覺編碼是不好的，因為你不知道你在做什麼，但有時完全沒問題。但其他時候，確實有幫助深入研究，使用你的軟體工程技能，在細粒度的層次理解程式碼，或者複製貼上程式碼庫的部分或特定錯誤日誌，向 Claude Code 提問具體問題。

這有點像你在探索一個巨大的冰山。如果你想停留在感覺編碼層次，你可以從遠處飛越頂部查看它。然後你可以靠近一點。你可以進入潛水模式。你可以越來越深入，以 Claude Code 作為你的嚮導。

## 技巧 33：審計你已核准的指令

我最近看到[這篇貼文](https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/)，有人的 Claude Code 執行了 `rm -rf tests/ patches/ plan/ ~/` 並清除了他們的家目錄。很容易將其視為感覺編碼者的錯誤，但這種錯誤可能發生在任何人身上。所以定期審計你已核准的指令很重要。為了使其更容易，我建立了 **cc-safe**——一個 CLI，可以掃描你的 `.claude/settings.json` 檔案以查找有風險的已核准指令。

它偵測如下模式：
- `sudo`、`rm -rf`、`Bash`、`chmod 777`、`curl | sh`
- `git reset --hard`、`npm publish`、`docker run --privileged`
- 更多——它具有容器感知能力，因此 `docker exec` 指令會被跳過

它遞歸地掃描所有子目錄，因此你可以將它指向你的專案資料夾，一次性檢查所有內容。你可以手動執行它，或讓 Claude Code 為你執行：

```bash
npm install -g cc-safe
cc-safe ~/projects
```

或者直接使用 npx 執行：

```bash
npx cc-safe .
```

GitHub：[cc-safe](https://github.com/ykdojo/cc-safe)

## 技巧 34：撰寫大量測試（並使用 TDD）

隨著你用 Claude Code 撰寫更多程式碼，犯錯誤變得更容易。PR 審查和視覺化 Git 客戶端有助於發現問題（如我之前提到的），但隨著程式碼庫增大，撰寫測試至關重要。

你可以讓 Claude Code 為它自己的程式碼撰寫測試。有些人說 AI 無法測試它自己的工作，但事實證明它可以——類似於人腦的工作方式。當你撰寫測試時，你是在以不同的方式思考同一個問題。同樣的原則也適用於 AI。

我發現 TDD（測試驅動開發）與 Claude Code 配合得非常好：

1. 先撰寫測試
2. 確保它們失敗
3. 提交測試
4. 撰寫程式碼使它們通過

這實際上是我建立 [cc-safe](https://github.com/ykdojo/cc-safe) 的方式。透過先撰寫失敗測試並在實現之前提交它們，你為程式碼應該做什麼建立了一個明確的契約。Claude Code 然後有一個具體的目標要達到，你可以透過執行測試來驗證實現是否正確。

如果你想更加確定，請自己審查測試，確保它們不做任何愚蠢的事情，比如只是返回 true。

## 技巧 35：在未知領域更加勇敢；迭代式問題解決

自從我開始更密集地使用 Claude Code 以來，我注意到自己在未知領域變得越來越勇敢。

例如，當我開始在 [Daft](https://github.com/Eventual-Inc/Daft) 工作時，我注意到我們的前端程式碼有一個問題。我不是 React 專家，但我決定無論如何都要深入研究它。我只是開始對程式碼庫和問題提問。最終我能夠解決它，因為我知道如何用 Claude Code 迭代地解決問題。

最近也發生了類似的事情。我正在為 Daft 的使用者建立指南，遇到了一些非常具體的問題：cloudpickle 在 Pydantic 的 Google Colab 上不工作，以及一個關於 Python 和一點 Rust 的單獨問題，即使在終端機中正常工作，東西在 JupyterLab 中也無法正確列印。我以前從未使用過 Rust。

我本可以直接建立一個問題，讓其他工程師處理它。但我想，讓我深入研究程式碼庫。Claude Code 提出了一個初始解決方案，但它不是那麼好。所以我放慢了速度。一位同事建議我們只是停用那個部分，但我不想要任何迴歸。我們能找到更好的解決方案嗎？

接下來是一個協作和迭代的過程。Claude Code 建議了潛在的根本原因和解決方案。我對那些進行了實驗。有些結果是死路，所以我們朝著不同的方向前進。在整個過程中，我控制著我的節奏。有時我走得更快，比如讓它探索不同的解決方案空間或程式碼庫的部分。有時我走得更慢，問「這行確切是什麼意思？」控制抽象層次，控制速度。

最終我找到了一個相當優雅的解決方案。教訓是：即使在未知的世界裡，你用 Claude Code 能做的事情也比你想象的要多得多。

## 技巧 36：在背景執行 bash 指令與子代理

當你在 Claude Code 中有一個長時間執行的 bash 指令時，你可以按 Ctrl+B 讓它在背景執行。Claude Code 知道如何管理背景程序——它可以稍後使用 BashOutput 工具檢查它們。

當你意識到一個指令比預期花費更長的時間，而你想讓 Claude 同時做其他事情時，這很有用。然後你可以讓它使用技巧 17 中提到的指數退避方法來檢查進度，或者讓它在程序執行時完全做其他事情。

Claude Code 也有能力在背景執行子代理。如果你需要進行長時間執行的研究，或者讓代理定期檢查某些內容，你不必讓它在前台持續執行。只需讓 Claude Code 在背景執行代理或任務，它會在你繼續其他工作的同時處理它。

### 策略性地使用子代理

除了在背景執行事情之外，當你有一個大任務需要分解時，子代理很有用。例如，如果你有一個巨大的程式碼庫需要分析，你可以讓子代理以不同的方式分析它，或者並行地查看程式碼庫的不同部分。只需讓 Claude 生成多個子代理來處理不同的部分。

你可以透過直接詢問來自訂子代理：
- **數量** - 讓 Claude 生成你想要的數量
- **背景 vs 前台** - 讓它們在背景執行，或按 Ctrl+B
- **使用哪個模型** - 根據每個任務的複雜性，請求 Opus、Sonnet 或 Haiku（子代理預設使用 Sonnet）

## 技巧 37：個人化軟體的時代已到來

我們正在進入個人化、自訂軟體的時代。自從 AI 出現以來——一般是 ChatGPT，但特別是 Claude Code——我注意到我能夠建立更多軟體，有時只是為了自己，有時是為了小專案。

如我在本文前面提到的，我建立了一個我每天使用的自訂轉錄工具，用它來與 Claude Code 對話。我建立了自訂 Claude Code 本身的方法。我也用 Python 更快地完成了大量資料視覺化和資料分析任務。

這是另一個例子：[korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server)，一個有近 1,000 顆星的流行 Slack MCP，被設計為在 Docker 容器中執行。我在自己的 Docker 容器（Docker-in-Docker 複雜性）中順暢使用它時遇到了麻煩。我沒有與那個設定搏鬥，而是直接讓 Claude Code 直接使用 Slack 的 Node SDK 撰寫一個 CLI。效果非常好。

這是一個令人興奮的時代。無論你想完成什麼，你都可以讓 Claude Code 來做。如果規模足夠小，你可以在一兩個小時內建立它。我甚至建立了一個[投影片組模板](https://ykdojo.github.io/claude-code-tips/content/spectrum-slides.html)——一個包含 CSS 和 JavaScript 的單一 HTML 檔案，讓你可以在其中嵌入一個互動式、持久的終端機程序。

## 技巧 38：導覽與編輯你的輸入框

Claude Code 的輸入框被設計為模擬常見的終端機/readline 快捷鍵，如果你習慣在終端機中工作，這會感覺很自然。以下是一些有用的快捷鍵：

**導覽：**
- `Ctrl+A` - 跳到行首
- `Ctrl+E` - 跳到行尾
- `Option+Left/Right`（Mac）或 `Alt+Left/Right` - 按詞向後/向前跳

**編輯：**
- `Ctrl+W` - 刪除上一個詞
- `Ctrl+U` - 從游標刪除到行首
- `Ctrl+K` - 從游標刪除到行尾
- `Ctrl+C` / `Ctrl+L` - 清除當前輸入
- `Ctrl+G` - 在外部編輯器中打開你的提示（對於貼上長文字很有用，因為直接貼到終端機可能很慢）

如果你熟悉 bash、zsh 或其他 shell，你會感覺如魚得水。

對於 `Ctrl+G`，編輯器由你的 `EDITOR` 環境變數決定。你可以在你的 shell 設定（`~/.zshrc` 或 `~/.bashrc`）中設定它：

```bash
export EDITOR=vim      # 或 nano, code, nvim 等
```

或者在 `~/.claude/settings.json` 中（需要重新啟動）：

```json
{
  "env": {
    "EDITOR": "vim"
  }
}
```

**輸入換行（多行輸入）：**

最快的方法在任何地方都可以使用，不需要任何設定：輸入 `\` 後跟 Enter 來建立換行。對於鍵盤快捷鍵，在 Claude Code 中執行 `/terminal-setup`。在 Mac Terminal.app 上，我使用 Option+Enter。

**貼上圖片：**
- `Ctrl+V`（Mac/Linux）或 `Alt+V`（Windows）- 從剪貼簿貼上圖片

注意：在 Mac 上，是 `Ctrl+V`，不是 `Cmd+V`。

## 技巧 39：花時間規劃，同時也要快速原型驗證

你想花足夠的時間規劃，讓 Claude Code 知道要建立什麼以及如何建立它。這意味著要盡早做出高層次的決定：使用什麼技術、如何構建專案、每個功能應該放在哪裡、哪些檔案應該放什麼。盡可能早地做出好的決定是重要的。

有時原型驗證對此有幫助。只需快速建立一個簡單的原型，你就可以說「好，這個技術適用於這個特定目的」或者「這個其他技術效果更好。」

例如，我最近在實驗建立一個差異查看器。我首先嘗試了一個使用 tmux 和 lazygit 的簡單 bash 原型，然後嘗試使用 Ink 和 Node 製作我自己的 git 查看器。我在不同的事情上遇到了很多麻煩，最終沒有發布這些結果。但我透過這個專案重新認識到的是規劃和原型驗證的重要性。我發現，只是在讓它撰寫程式碼之前稍微更好地規劃，你就能更好地引導它。你仍然需要在整個編碼過程中引導它，但讓它先稍微規劃一下真的很有幫助。

你可以按 Shift+Tab 切換到計畫模式來使用它。或者你可以只讓 Claude Code 在撰寫任何程式碼之前制定一個計畫。

## 技巧 40：簡化過度複雜的程式碼

我發現 Claude Code 有時過度複雜，撰寫了太多程式碼。它做了你沒有要求的更改。它似乎只是有撰寫更多程式碼的傾向。如果你遵循了本指南中的其他技巧，程式碼可能可以正確工作，但它將難以維護和難以檢查。如果你不夠審查它，可能會是一場惡夢。

所以有時你想檢查程式碼並讓它簡化事情。你可以自己修復事情，但你也可以直接讓它簡化。你可以問「你為什麼做了這個特定的更改？」或「你為什麼添加了這行？」

有些人說如果你只透過 AI 撰寫程式碼，你將永遠無法理解它。但那只有在你沒有問足夠問題的情況下才成立。如果你確保理解每一件事，你實際上可以比其他方式更快地理解程式碼，因為你可以向 AI 詢問它。特別是當你在大型專案上工作時。

請注意，這也適用於散文。Claude Code 經常嘗試在最後一段中總結前面的段落，或在最後一句中總結前面的句子。它可能會變得相當重複。有時是有幫助的，但大多數時候你需要讓它刪除或簡化它。

## 技巧 41：自動化的自動化

說到底，這一切都是關於自動化的自動化。我的意思是，我發現這是不僅變得更有生產力，而且讓過程更有趣的最佳方式。至少對我來說，這整個自動化的自動化過程真的很有趣。

我個人從 ChatGPT 開始，想要自動化在終端機中複製貼上和執行 ChatGPT 給我的指令的過程。我透過建立一個叫做 [Kaguya](https://github.com/ykdojo/kaguya) 的 ChatGPT 外掛程式自動化了整個過程。從那時起，我一直在朝著越來越多的自動化方向努力。

如今，幸運的是，我們甚至不必建立這樣的工具，因為像 Claude Code 這樣的工具存在並且效果非常好。隨著我越來越多地使用它，我發現自己在想，如果我能自動化打字的過程會怎麼樣？所以我使用 Claude Code 本身建立了我的語音轉錄應用程式，如我之前提到的。

然後我開始想，我有時會發現自己在重複自己。所以我會把那些東西放在 CLAUDE.md 中。然後我會想，好，有時我重複執行同樣的指令。我如何自動化那個？也許我可以讓 Claude Code 來做。或者也許我可以把它們放在技能中。或者也許我甚至可以讓它建立一個腳本，這樣我就不必一遍又一遍地重複同樣的過程。

我認為最終那就是我們前進的方向。每當你發現自己一遍又一遍地重複同樣的任務或同樣的指令，重複幾次是可以的，但如果你一遍又一遍地重複，那就考慮一種方式來自動化整個過程。

## 技巧 42：分享你的知識並在力所能及之處做出貢獻

這個技巧與其他技巧有點不同。我發現，透過盡可能多地學習，你能夠與你周圍的人分享你的知識。也許透過這樣的貼文，也許甚至是書籍、課程、影片。我最近也在 [Daft 為我的同事進行了一次內部分享](https://www.daft.ai/blog/how-we-use-ai-coding-agents)。這一直很有回報。

每當我分享技巧時，我經常得到資訊的回饋。例如，當我分享我縮短系統提示和工具描述的技巧（技巧 15）時，有些人告訴我關於 `--system-prompt` 標誌，你可以用它作為替代方案。另一次，我分享了斜線指令和技能之間的差異（技巧 25），我從那篇 Reddit 帖子的評論中學到了新東西。

所以分享你的知識不僅僅是建立你的品牌或鞏固你的學習。它也是關於透過這個過程學習新東西。它並不總是單向的。

說到貢獻，我一直在向 Claude Code 儲存庫發送問題。我想，好吧，如果他們聽，太好了。如果他們不聽，完全沒問題。我沒有任何期望。但在版本 2.0.67 中，我注意到他們採納了我報告的多個建議：

- 修復了在 `/permissions` 中刪除許可規則後滾動位置重置的問題
- 在 `/permissions` 指令中添加了搜尋功能

團隊能夠如此快速地回應功能請求和錯誤報告，這真的很了不起。但這是有道理的，因為他們正在使用 Claude Code 來建立 Claude Code 本身。

## 技巧 43：持續學習！

有幾種有效的方式可以持續學習關於 Claude Code 的知識：

**直接詢問 Claude Code 本身** - 如果你對 Claude Code 有問題，直接問它。Claude Code 有一個專門用於回答關於其自身功能、斜線指令、設定、鉤子、MCP 伺服器等問題的專業子代理。

**查看發行說明** - 輸入 `/release-notes` 以查看你目前版本的新功能。這是了解最新功能的最佳方式。

**從社群學習** - [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/) 子版塊是向其他使用者學習並了解人們使用什麼工作流程的好地方。

**關注 Ado 的技巧** - Ado（[@adocomplete](https://x.com/adocomplete)）是 Anthropic 的 DevRel，在 2025 年 12 月整個月在他的「Claude 降臨曆」系列中每天發布 Claude Code 技巧。雖然這個特定系列已經結束，但他繼續在 X 上分享有用的技巧。

- [Twitter/X：Claude 降臨曆貼文](https://x.com/search?q=from%3Aadocomplete%20advent%20of%20claude&src=typed_query&f=live)
- [LinkedIn：Claude 降臨曆貼文](https://www.linkedin.com/search/results/content/?fromMember=%5B%22ACoAAAFdD3IBYHwKSh6FsyGqOh1SpbrZ9ZHTjnI%22%5D&keywords=advent%20of%20claude&origin=FACETED_SEARCH&sid=zDV&sortBy=%22date_posted%22)

## 技巧 44：安裝 dx 外掛程式

這個儲存庫也是一個叫做 `dx`（開發者體驗）的 Claude Code 外掛程式。它將上述技巧中的幾個工具捆綁到一個安裝中：

| 技能 | 描述 |
|-------|-------------|
| `/dx:gha <url>` | 分析 GitHub Actions 失敗（技巧 29） |
| `/dx:handoff` | 建立上下文連續性的交接文件（技巧 8） |
| `/dx:clone` | 複製對話以分叉（技巧 23） |
| `/dx:half-clone` | 半複製以減少上下文（技巧 23） |
| `/dx:reddit-fetch` | 透過 Gemini CLI 抓取 Reddit 內容（技巧 11） |
| `/dx:review-claudemd` | 審查對話以改進 CLAUDE.md 檔案（技巧 30） |

**使用兩個指令安裝：**

```bash
claude plugin marketplace add ykdojo/claude-code-tips
claude plugin install dx@ykdojo
```

安裝後，這些指令可以作為 `/dx:clone`、`/dx:half-clone`、`/dx:handoff` 和 `/dx:gha` 使用。`reddit-fetch` 技能會在你詢問 Reddit URL 時自動呼叫。`review-claudemd` 技能會分析你最近的對話，並為你的 CLAUDE.md 檔案建議改進。對於複製指令，請參見[建議的權限](#複製腳本的建議權限)。

**建議的配套工具：** [Playwright MCP](https://github.com/microsoft/playwright-mcp) 用於瀏覽器自動化——使用 `claude mcp add -s user playwright npx @playwright/mcp@latest` 添加

## 技巧 45：快速設定腳本

如果你想同時設定本儲存庫的多個建議，有一個設定腳本可以處理其中許多：

```bash
bash <(curl -s https://raw.githubusercontent.com/ykdojo/claude-code-tips/main/scripts/setup.sh)
```

腳本向你展示它將配置的所有內容，並讓你跳過任何項目：

```
INSTALLS:
  1. DX plugin - slash commands (/dx:gha, /dx:clone, /dx:handoff) and skills (reddit-fetch)
  2. cc-safe - scans your settings for risky approved commands like 'rm -rf' or 'sudo'

SETTINGS (~/.claude/settings.json):
  3. Status line - shows model, git branch, uncommitted files, token usage at bottom of screen
  4. Disable auto-updates - prevents Claude Code from auto-updating (useful for system prompt patches)
  5. Lazy-load MCP tools - only loads MCP tool definitions when needed, saves context
  6. Read(~/.claude) permission - allows clone/half-clone commands to read conversation history
  7. Read(//tmp/**) permission - allows reading temporary files without prompts
  8. Disable attribution - removes Co-Authored-By from commits and attribution from PRs

SHELL CONFIG (~/.zshrc or ~/.bashrc):
  9. Aliases: c=claude, ch=claude --chrome, cs=claude --dangerously-skip-permissions
 10. Fork shortcut: --fs expands to --fork-session (e.g., claude -c --fs)

Skip any? [e.g., 1 4 7 or Enter for all]:
```

---

📺 **相關演講**：[Claude Code 大師班](https://youtu.be/9UdZhTnMrTA) - 來自 31 個月代理程式編碼的經驗教訓和專案示例

📝 **故事**：[我如何透過 Claude Code 找到全職工作](content/how-i-got-a-job-with-claude-code.md)

📰 **電子報**：[紀律與技巧的代理程式編碼](https://agenticcoding.substack.com/) - 將代理程式編碼的實踐提升到新的水準
