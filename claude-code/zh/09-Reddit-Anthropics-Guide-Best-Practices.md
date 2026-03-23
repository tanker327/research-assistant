# Anthropic 的 Claude Code 指南：代理式程式開發最佳實踐

**來源：** https://www.reddit.com/r/ClaudeAI/comments/1k5slll/anthropics_guide_to_claude_code_best_practices/
**作者：** u/mariusvoila
**子論壇：** r/ClaudeAI

---

## 文章內容

剛透過 [Alex Albert 的推文](https://x.com/alexalbert__/status/1914333320877584397) 看到這篇很棒的文章，覺得大家應該會感興趣：

[Claude Code：代理式程式開發最佳實踐](https://www.anthropic.com/engineering/claude-code-best-practices)

文章涵蓋的內容包括：

- 設定 CLAUDE.md 來引導 Claude 在你的程式庫中的行為
- Claude 如何使用你的程式庫與 CLAUDE.md 來理解你的專案
- 建立能使用工具的代理（例如，可以呼叫函式或 API 的 Claude）
- 成功的提示詞格式範例，適用於修復錯誤、重構、功能開發等場景
- 在多輪對話中使用 Claude Code 進行除錯與迭代

### 重點摘要

Anthropic 建議將你的程式庫結構化，讓 Claude 具備「代理能力」——也就是讓它更像一個能理解你的目標、工具和情境的智慧助理。許多強大之處來自於撰寫一份清晰、詳細的 CLAUDE.md，用以說明你的程式碼功能以及 Claude 應如何提供協助。這篇部落格文章包含了實際案例與效果良好的提示詞範本。

---

## 熱門留言

### u/ottomaniacc（評分：22）

我在一個中型專案上測試了 Claude Code。光是初始化就花了 $0.7。然後叫它執行我用 task-master 建立的任務，又花了 $1.3。

所以，不用了謝謝。我還是用我的 Claude 訂閱搭配 Claude Desktop 和 MCP 就好。

> **u/pandavr**（評分：7）：這是史上最被低估的留言。

### u/Lilo_n_Ivy（評分：16）

你是說那個同一個 Claude——就算我在提示詞裡明確要求它在回答前先查看 GitHub 裡同步到專案知識庫的檔案，它照樣不看的那個 Claude？你要我相信，同一個 Claude 只因為檔案名字裡有它的名字，就真的會去查看 GitHub 上的檔案？好吧好吧好吧……

> **u/cheffromspace**（評分：10）：Claude Code 有它的獨特之處。我沒有遇到這些問題。要麼就是我的運氣好，要麼就是你哪裡做錯了。

> **u/mariusvoila**（評分：7）：我不是要質疑你的親身經歷，但我個人從未遇過 GitHub 整合方面的問題。我最糟的經驗是在非常大型的程式庫上，某些檔案會超出上下文視窗，但除此之外，對我來說都運作得很順暢。

> **u/MrBuyNowPayLater**（評分：3）：我也幾乎每天都會遇到這種情況。有時 Claude 會按照提示詞的指示去參考專案知識庫或附加的檔案，有時又不會。這種掙扎是真實存在的。

> **u/pandavr**（評分：1）：知識庫的內容並不會完整地加入你的提示詞中。正因如此，有些情況下 Claude 似乎會遵循知識庫，有些則不會。相反地，如果你直接叫 Claude 去讀某個檔案，其內容就會成為對話的一部分並被納入考量。另外，你的描述方式也很重要。

### u/cheffromspace（評分：2）

他們有 `/review` 指令可以在 GitHub 中審查 PR，我也不確定 `--print` 旗標是什麼時候加進來的，但它讓 Claude Code 的腳本化程度大幅提升！我在測試我的 MCP 伺服器時，讓 Claude 跑了一遍測試腳本，還找到了一些錯誤。我知道它是個 MCP 客戶端，但沒想到你也可以把它當成伺服器來跑？我一直有在看版本說明，也一直提醒自己要去研究，但我一直忽略了這些新功能。他們做了很多好東西，而且出貨速度很快！這解鎖了許多我夢寐以求的可能性。

### u/bloudraak（評分：1）

我在 Claude Code 中使用 Claude.md，裡面包含了不要在提交記錄中標注 AI 的指示。

我發現的問題是：Claude Code 常常還是會在提交記錄中標注 AI，尤其是在對話被壓縮之後。所以它並不是每次都會讀取並遵循 Claude.md 的指示。

### u/lukaszlenart（評分：1）

這篇文章讀起來很有意思，不過我覺得關於如何使用「提示詞改進工具」來優化我的 CLAUDE.md，缺少更具體的範例。能否再詳細說明一下？我指的是「b. 調整你的 CLAUDE.md 檔案」這個章節中的這句話：

> 在 Anthropic，我們偶爾會將 CLAUDE.md 檔案透過[提示詞改進工具](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-improver)來處理，並經常調整指示（例如加上「IMPORTANT」或「YOU MUST」這類強調語氣）以提高遵循度。

### u/gsummit18（評分：3）

完全沒有任何理由使用 Claude Code。它很貴，而且你幾乎沒有什麼掌控權。有很多更好的替代方案。

> **u/Kashasaurus**（評分：10）：它確實比較貴。但我覺得它比 Cursor 好多了。
