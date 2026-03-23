# My Top 6 Tips & Ways of Using Claude Code Efficiently

**Source:** [https://www.youtube.com/watch?v=WwdIYp5fuxY](https://www.youtube.com/watch?v=WwdIYp5fuxY)
**Channel:** Academind (Maximilian Schwarzmuller)
**Date Captured:** 2026-03-22

---

## Description

Claude Code is a great agentic engineering tool. But as with all tools, using it correctly is key to getting good results.

Related course: [Claude Code - The Practical Guide](https://acad.link/claude-code)

---

## Summary of the 6 Tips

### 1. Don't Loop / Don't ROLF -- Stay in Control

- Avoid running Claude Code in unattended loops (the "ROLF" pattern where you hand off a detailed product document and let the AI work through it autonomously).
- Planning matters, but the AI working through a plan on its own produces unconvincing results.
- Stay in control at every step. AI is a tool for developers, not a replacement for developer oversight.

### 2. Use Plan Mode

- Cycle through modes with the keyboard shortcut; Plan Mode is built in.
- In Plan Mode, Claude Code gathers information, explores the codebase, and creates a plan before executing changes.
- **Benefits:**
  - Saves bad prompts -- it may ask clarifying follow-up questions.
  - Shows you what the AI wants to do before it does it.
  - You can (and should) **edit and tweak the plan** before accepting it.
- Don't blindly accept the plan. Review it, adjust it, then approve. This is far better than letting it execute and then fixing problems afterward, which burns more tokens and wastes time.

### 3. Use Agents and Skills

- **Custom Sub-Agents:** Claude Code can launch sub-agents with their own dedicated context windows, saving tokens in the main context. These agents can specialize in certain tasks.
  - Example: A "Docs Explorer" agent optimized for browsing documentation, equipped with web search and the Context7 MCP.
- **Context7 MCP:** An MCP server that gives AI agents easier access to third-party library and language documentation. One of the few MCPs worth using (most are token-inefficient).
- **Skills:** Project-specific skill files that describe best practices and preferences (e.g., Next.js coding patterns).
  - Skills are lazily discovered -- loaded only when needed, not always in full context.
  - Open source skill collections exist (e.g., Vercel's skills), but crafting your own with personal preferences and patterns is valuable.
  - Skills give the AI extra context and instructions to increase the chances of good results.

### 4. Explicit Over Implicit

- Don't hope the AI will do what you want -- tell it explicitly.
- If you know what you want, spell it out. For example, explicitly instruct it to use a specific agent (like Docs Explorer) to look up documentation before implementing.
- There is no downside to being explicit about something the AI might have done anyway. It increases certainty that the output matches your expectations.

### 5. Trust, But Verify

- Even with good prompts and the right context, don't blindly trust results.
- **Review the code carefully.** Accept what's good, improve what's bad (including code that works but doesn't follow your preferred patterns).
- **Give the AI tools for self-verification:**
  - Unit tests and E2E tests
  - Linting commands
  - Playwright MCP for browser-based verification (use sparingly -- very token-heavy)
- Caveat: AI may write tests that simply pass by adjusting tests to match code rather than the other way around. You still need to review.
- You have responsibility for the code. "AI wrote it" is not an excuse.

### 6. You're Still Allowed to Write Code

- Using AI is not an either/or choice. You should still write code yourself.
- Trivial changes (e.g., adjusting a margin from 0.5rem to 1rem) don't need AI -- just do it yourself and save tokens.
- Always understand the codebase. Don't hand off too much to AI and lose touch with the code.
- Coding is fun. Modern autocomplete in Cursor/VS Code makes manual coding easier than ever.
- If AI can't figure something out, step in and do it yourself.

---

## Key Themes

- **Control:** The developer should always remain in control of the process.
- **Intentionality:** Be deliberate about prompts, plans, and instructions.
- **Verification:** Never assume AI output is correct -- always review.
- **Efficiency:** Save tokens and time by being explicit, using plan mode, and handling trivial tasks manually.
- **Balance:** AI is a powerful tool, but it augments -- not replaces -- developer skills.

---

## Full Transcript

[00:00] Over the last couple of months, like many others, I've used Claude Code a lot. I've used it to help me build projects like Build My Graphics, some other projects which are yet to launch, and lots of internal tools. I'm not using it for live coding, to be very clear about that, but I'll get back to how I use it because that's exactly what this video is about. I wanna share my top Claude Code usage strategy, my six top usage strategies.

[00:33] The six things I would recommend doing when you're using Claude Code to get good results. Now it's worth noting that I'm using Claude Code with the Max Plan, which gives you 20X the usage. Obviously, heavily subsidized by Anthropic, but you get lots of usage out of Claude Code here, and if you're not running Claude Code in a loop, in a Rolf loop, and there's been lots of hype about that, usage out of it.

[01:03] And that's actually already my first point: I don't loop, I don't Rolf, I stay in control. And that's important to me. I know there's lots of hype these days about running Claude Code in a loop. We have that entire Rolf Wiggum thing here, where the idea is that you have a detailed product document, in the end a document that details all the different steps you need to take to build the product you wanna build, and you hand that document off to Claude Code in a loop, a simple bash loop, for example, where you run Claude Code over and over again with a prompt where you tell it to look into the document, pick the next step, tackle that step, and then work its way through the document until it's done.

[01:54] And the idea simply is that by having a detailed plan, you get good results. Now I will totally agree that a detailed plan matters. Planning matters. I totally agree with that. It absolutely does matter, no matter what you're building. But I'm not a fan of the AI working its way through a plan on its own. Instead, I like to stay in control, as I mentioned. That is really important to me. I feel like AI can be a very helpful tool for developers. I believe every developer should use AI as a tool, but I don't feel like it can really give me good results if I let it run on its own.

[02:48] That's why I'm absolutely not into live coding. I tried the Rolf loop; I'm not just saying. For me, the results were not convincing. I wanna stay in control.

[03:01] And kind of related to that, my second point is use plan mode, because plan mode is amazing. In Claude Code, you can cycle through different modes and there is a plan mode built into Claude Code. And the idea behind that mode is simply that it does not go ahead and execute changes right away, or that it does something based on your prompt right away. But that instead first it gathers information, it explores the code base, it tries to understand your prompt. It may also look up documentation. And then it makes a plan, and then you approve that plan or not. It may even ask you some questions if more clarification is needed.

[03:50] Now plan mode, therefore, is really helpful for a couple of different reasons. For one, it can save bad prompts. So if you're writing poor prompts, plan mode can help you here because it can kind of help you get to a better prompt. By asking follow-up questions, it might clarify things that might not be clear from your prompt. But of course, you should try to write good prompts in first place, because that's important. AI is a tool. The output will only be as good as your input. And even then, there is randomness involved, let's be honest. But if you're throwing bad, unprecise prompts with missing context at the AI, you will not get great results out of it. So good prompts with good context engineering, so with the right context being provided, matter.

[04:47] But of course, you definitely have plan mode as a little savior that can come in. But that's still just one advantage of plan mode. Another advantage of plan mode is that it shows you what the AI wants to do, and that is really valuable in my experience. Because it's far too easy to just blindly trust the AI to do something and that it does the right thing. But hey, it's AI. It's not necessarily going to do the right thing.

[05:31] And the great thing about plan mode is that even if you don't get follow-up questions, prompt maybe already was good enough, I still get a plan. And I know a lot of developers that will just blindly accept that plan, so that will just hit enter and let it do its thing, but don't be that kind of developer. Take a look at that plan. It tells you what it wants to do. If you asked it to fix an issue or find a solution for a bug, it will tell you what it thinks causes the issue.

[06:16] And then, here's the shocking part: you should feel free to edit that plan. So don't blindly accept it; edit and tweak the plan if needed. You can and should do that. It's nothing you have to just accept and get done with and then fix any problems that might occur thereafter. Instead, take a look at the plan, tweak it to your likings, and then accept it. And that's a way better approach than just letting it do its thing, just to then find out that you don't like what it did to fix. That burns more tokens, is more work, wastes time, and fixing code with AI is not a lot of fun.

[07:45] The third point here is that I use agents and skills. Claude Code allows you to build custom sub-agents. The idea here is that Claude Code can launch these sub-agents with their own dedicated context window to save tokens in the main context window so that you don't run out of context space there, and those agents can then specialize in certain tasks. And one agent I like to build is a Docs Explorer agent, which is simply an agent optimized for browsing documentation. And I give that agent certain tools like web search or the Context7 MCP.

[08:36] The Context7 MCP, in case you don't know, is a MCP server that gives AI agents easier access to the documentation of third-party libraries or languages you might be working with. I'm not a huge MCP fan. I feel like they're token inefficient. AI is not that good at using MCPs in my experience, and I prefer built-in tools and I don't need that many tools anyways. But the Context7 MCP is pretty amazing and I built my own Docs Explorer agent which has the specific task of using web search and this agent to browse for documentation.

[09:19] And in addition to that custom agent, I also equip Claude Code with skills that are project dependent or specific. So for example, if I'm working in a Next.js project, I might give it some skill that describes some best practices I want it to use in relation to Next.js to ensure that it uses or writes Next.js code that is in line with my expectations and my preferences.

[09:49] And it's worth noting here that there also are open source initiatives like Vercel's skills that make it easy to install specific skills into projects and load openly shared open source skills into a project, like the React best practices shared by Vercel. I will also do that in many projects but I still like to craft my own skills with my very own preferences, patterns, and simply rules that come from my experience as a developer that I want the AI to use. Because the idea behind the skills is that the AI will read those skill files when needed. They are lazily discovered. They're not always loaded in full into the context. Instead they're loaded when needed, and then that skill can give the AI extra context, extra instructions, which should increase the chances of getting good results.

[10:49] We're always talking about increasing our chances because it's still AI, there is randomness. You can't be sure that it does stuff the way you want it to do, but you can try to increase the chances. That's the entire game of using AI as a developer in my experience.

[11:09] And that's therefore my fourth point here, explicit over implicit. With that I simply mean that the AI may do something the way I want it to do, but I can't be sure about it. So I'm rather explicit. So for example, if I'm using the BetterAuth library in a project and I want to use authentication via Google, I write that explicitly. But I'll also say something like use the Docs Explorer agent, which is the custom agent I wrote which is good at exploring documentation, to explore the relevant BetterAuth docs before implementing because I've seen it too often that AI will just head off and do something and then I see that it didn't do what I wanted it to do, and that it, for example, has access to certain agents but it just won't use them even though in theory it should.

[12:03] And I don't want that. I'm not getting anything out of saying the AI is pretty bad. It didn't do what I want it to do. It's a tool that can be amazing, kind of. And therefore, don't hope that it does something or don't wait for it to fail just so that then you can be convinced that AI is not good. Instead, know that it is good at generating lots of code quickly and use that as its strength and give it the necessary instructions it needs to increase the chances of getting the output you want, essentially.

[12:46] I rather tell it explicitly what I want it to do, if I know what I want it to do, than that I hope that it does that. I have no problem with telling the AI something which it maybe would've done anyways if I can then be sure that it will do what I want it to do.

[13:15] My fifth point is kind of related to this: trust, but verify. AI is great, and if you give it a good prompt, if you are specific, if you provide the right context, depending on the problem that was tackled, you have good chances of getting decent results. But don't blindly trust that. You are in control, so you should verify the results. You should not blindly trust them. Carefully review the code. Don't just think that it's correct. Think about it critically. Don't dismiss it as AI-generated, it's certainly bad. Instead, accept what's good and try to improve what's bad. And bad can also be something that maybe is okay, maybe works, but isn't using a pattern or an approach you want to use.

[14:11] But also give the AI tools of self-verification. Give it tools for self-verifying, because that can vastly improve results. Stuff like unit tests, E2E tests, and also potentially, depending on what you're building, Playwright MCP, for example. The idea here simply is that the AI can do these things on its own. You might wanna tell it, as I mentioned in explicit over implicit, but it can run tests. It can run linting commands. And it can also access the browser with tools like the Playwright MCP, though you wanna be careful here. That is token heavy, so that burns a lot of tokens and you don't wanna use that all the time.

[15:15] But giving the AI tools that help it to evaluate the results on its own can vastly improve the quality of the output. It's still not a guarantee. For example, the AI may write tests that simply pass and it might adjust the tests to the code instead of the other way around, so you wanna be careful. But still, this can lead to better results and it does still not mean that you should not review the code. You wanna do that. You're in control and you have responsibility for the code. You can't say, "AI wrote it, it's bad." Sorry. You are in control.

[15:56] And then the last one: you're still allowed to write code. Shocking, I know, but with AI, with AI tools, it's not an either/or choice. You're still allowed to write code and you should still write code. I'm not going to ask AI, "Please increase the margin of this box from .5 rem to one rem." I can do that myself. And if you review the code, if you understand the code the AI generated, which you should, getting back into the code base shouldn't be too difficult.

[16:34] And don't get me wrong, I've fallen into the trap of handing off too much work to the AI and of not fully understanding the code base. I'm not doing that anymore. I make sure that I always understand the code base and that I'm always able to get back in there because I am a developer. I can read code, I can write code, and I can still write code even when I'm using AI. So if AI can't figure something out, if you have a trivial change where you burn tokens, I mean, those tokens cost money, just do it yourself. And by the way, coding is fun, at least for me, so I love getting into the code and writing code myself from time to time, and it's never been easier with great autocomplete in Cursor or VS Code.
