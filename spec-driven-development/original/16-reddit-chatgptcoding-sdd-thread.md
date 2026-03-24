# Does anyone use spec-driven development?

**Source:** https://www.reddit.com/r/ChatGPTCoding/comments/1otf3xc/does_anyone_use_specdriven_development/
**Subreddit:** r/ChatGPTCoding
**Author:** u/PitchSuch
**Score:** 78 upvotes

---

## Original Post

By spec driven development I mean writing specifications that become the source of truth and start coding with AI from there. There are tools like spec-kit from Microsoft and GitHub.

I use a similar approach, but with no tool: I generate the high level specification with a LLM, I generate the architecture of the application using a LLM, and from these I generate a todo list and a set of prompts to be executed by an agent (like the one in Cursor).

It kind of works, still is not perfect. Anyway, having a structure is much better than vibe coding.

---

## Comments

---

**u/funbike** (score: 26)

1. Idea -> User Stories. User Stories + Existing Gherkin -> (new) Gherkin
2. Idea + User Stories + Gherkin + (Existing) schema -> (new) **Schema**
3. New Gherkin + New Schema -> **Functional Tests**
4. Functional Tests + New Schema -> **Code**

It sounds like a lot, but I have a `prompts/` directory that makes this easy and semi-automated. I review each step to ensure it hasn't gone off the rails.

> **u/brandall10** (score: 6)
>
> Interesting idea about bringing Gherkin to the mix. Can you clarify what Schema is in this scenario? I'm assuming it's not the product db schema.

> **u/umlal** (score: 2)
>
> I'm doing SDLC security and have never heard of Gherkin, but it sounds really viable when it comes to threat modeling and business logic testing. Supplementing what AI DAST is missing IMO. I'd love to jump on board but I've never seen any company use this.
>
> > **u/tshawkins** (score: 1)
> >
> > It's great for generating test cases because it formalises success criteria.

> **u/ExpressBudget-** (score: 1)
>
> Sounds super clean and scalable. Curious how consistent the outputs are over time though.

---

**u/Trotskyist** (score: 11)

Yes, this has been my approach since May-ish. You have to review and adjust, though. You can't just generate a spec and then copy/paste without looking at anything.

> **u/PitchSuch** (score: 1)
>
> That's for sure, everything that deals with AI coding needs reviewing and adjusting. But I wonder if it is a good enough approach.
>
> > **u/BrilliantEmotion4461** (score: 1)
> >
> > One way to optimize review is to use more than one model. ChatGPT is really good at checking Claude's work while Claude is more proactive than ChatGPT given similar information. Or even opening a new session. I'm waiting for Gemini 3 to come out to finally have the three magi AI setup I've always wanted.
>
> > **u/opbmedia** (score: 0)
> >
> > The more detailed the instruction the easier it is to review. You can probably even use another AI agent to review per the spec, then have a human go over markups. Or use a human reviewer. But it does work faster this way.
> >
> > > **u/unlikely_ending** (score: 1)
> > >
> > > Yeah I get the AI to review my specs, repeatedly until no issues remain.
> > >
> > > > **u/tshawkins** (score: 2)
> > > >
> > > > Asking it to create a list of clarifications it needs, either inconsistencies or things not fully defined, helps too.
> > > >
> > > > > **u/unlikely_ending** (score: 1)
> > > > >
> > > > > Yep. I usually ask it to specifically look for mistakes, internal inconsistencies, and completeness; and to take it easy on the word polishing!

---

**u/Thin_Beat_9072** (score: 11)

Yeah you can spend a couple of days making specs in markdowns, folder structure, everything. Then implement them to build what you want. Building takes less than 10 minutes while it takes days to spec out all the details. Now you have the spec to repeat this like a blueprint. You would debug the blueprint not the actual app. Fix/debug the spec not the code being written, IMO.

> **u/EmeraldPolder** (score: 9)
>
> "Debug the blueprint" is a great idea. I often find myself vibing out a feature, course correcting until it's right, then asking the LLM to generate a prompt that would lead to this state more directly. Then I drop the commit and start over with the "better" prompt. I'm afraid that iterating too many changes writes too much code and leaves behind undesirable artefacts.

---

**u/Exotic-Sale-3003** (score: 18)

Yes, people who build software for a living have long realized having requirements before you start is helpful. Same with things like testing, intentional design of data schemas, and more.

> **u/rm-rf-rm** (score: 4)
>
> And this is true for every industry — hardware, contract manufacturing, hiring a marketing firm, government RFQs. It's sad to see that for many people in software, this seems like a foreign approach. Like you said, most good professionals have at least a basic requirements and planning phase before coding.

> **u/metaconcept** (score: 1)
>
> I prefer not having any requirements before I start coding. #YOLO.
>
> > **u/ramhog69** (score: 3)
> >
> > LEROY JENKINS!!

---

**u/zhambe** (score: 6)

People speedrunning an entire senior dev career storyarc in these comments. Love it!

---

**u/CuTe_M0nitor** (score: 6)

Yes and it produces production ready code. Spec kit worked best for me.

---

**u/opbmedia** (score: 6)

In my undergrad software engineering course, we were made to write a full feature software program without writing code — they are just all human readable instructions. So I got used to writing spec that way. And if you take that spec and feed it to any of the AI coders it generates good enough first drafts. Because logic came from me and the code comes from the AI translator.

---

**u/MXBT9W9QX96** (score: 4)

I use it and swear by it. I'm having too much success using it to go back to not using it.

---

**u/lacisghost** (score: 5)

Yes.

---

**u/prokaktyc** (score: 6)

I'm trying Kiro right now and its spec development so far is good, but I will report when I actually finish an app.

---

**u/Massive-Ad5320** (score: 3)

I mean, yeah. For anything more complex than a quick script, I start by generating a PRD, and once I'm happy with that, I use that as the source of truth for the coder.

---

**u/shanraisshan** (score: 3)

We take inspiration from "agent-os" by builder method and "spec-kit" by GitHub for spec driven development.

---

**u/unlikely_ending** (score: 3)

Yeah, I do these days.

I always wrote specs, but now my specs are the authoritative source, and I get the AI to write the code. I find this approach pretty effective.

I still make sure I understand every line of code it generates though.

---

**u/johns10davenport** (score: 4)

Overall you should be using a spec to keep LLMs grounded. I contend with the Microsoft approach. We shouldn't be using LLMs to define and orchestrate the process. We should use procedural code with a human in the loop to keep the LLM on the rails.

---

**u/AceHighness** (score: 2)

I have not heard of anyone actually using the Microsoft solution, but in theory it's the ultimate way.

> **u/who_am_i_to_say_so** (score: 2)
>
> I'm skeptical because Microsoft. Just personally. They do offer some good techniques, though. Don't they also do trunk based development?

> **u/PitchSuch** (score: 1)
>
> I plan to test it.
>
> > **u/AceHighness** (score: 2)
> >
> > I'd love to hear your experience.

---

**u/kingky0te** (score: 2)

Yes, through Agent OS. It's been an incredible boon to my workflow, in that even when I don't directly leverage it, it still affects how I analyze what I'm currently working on.

> **u/petrus4** (score: 2)
>
> Agent OS references:
> - https://github.com/buildermethods/agent-os/blob/main/profiles/default/agents/product-planner.md
> - https://www.youtube.com/watch?v=Fs72G3fIlog
>
> I still view writing for oneself to be the highest ideal, truthfully; but if you either can't or won't, then copying from a professional is the next best thing.

---

**u/Red_Jannix** (score: 2)

Coincidentally, I just tried it with Kiro. Helps me get through the design/planning phase to come up with questions I hadn't really thought about. I do need to start AI coding with it now though.

---

**u/aviboy2006** (score: 2)

I used specs driven development using Kiro IDE which works amazingly. I delivered two small projects using specs driven approach. It helps us to evaluate the plan and execute properly with a list of user stories, task breakdown, and executing tasks one by one. Cursor plan mode also works in a similar way but specs driven approach and plan mode are different.

---

**u/KnightofWhatever** (score: 3)

Spec-driven AI workflows are clearly gaining traction but context retention is still the missing piece.

Until LLMs can track evolving specs the way senior engineers do — balancing constraints with intent — human-in-the-loop orchestration stays essential. This isn't about replacing developers. It's about closing the gap between what we mean and what gets built. The faster we translate intent into working code the more creative and iterative the process becomes.

---

**u/Verzuchter** (score: 1)

Been implementing this for quite some time now, mostly using tests as the basis for functionality. Success is iffy, as iterations go off the rails quite quickly. Best to not iterate in one session, but start a new session after each iteration to limit hallucination or going back to a previous unwanted state.

---

**u/ExpressBudget-** (score: 1)

Yeah I've been trying something similar. LLM-generated specs and tasks really help keep things focused. Still rough around the edges but way better than just winging it.

---

**u/CMDR-Bugsbunny** (score: 1)

Wait, so you're asking if a developer is:

- Creating a spec and then testing the output from the AI to ensure it meets the use case(s) — providing human value

OR

- Just pumping out code from the AI with minimal one-shot prompting and hoping it works — monkey in the loop pushing buttons?

Hmmm, which one will be obsolete in the near future?

---

**u/tshawkins** (score: 1)

I'm the same. I will often give the LLM a link to an online manual for a similar product and ask it to make a gap analysis between my SPEC.md and the competitive product. I usually start with a skeleton spec, and then iterate with the LLM to flesh it out. Having the spec helps to stop vibe coding from drifting your product vision/spec away from what you want to deliver.

---

**u/cheekyrandos** (score: 1)

Yes I have my own system. GitHub spec kit is trash.

> **u/CoolmanWilkins** (score: 1)
>
> Lol, I searched for "spec kit is trash" and this came up. Glad someone agrees. I just haven't had time to create my own system yet.

---

**u/enterme2** (score: 1)

I usually ask Copilot to create an implementation plan in markdown for a feature I want to add. Then use it as context and progress update. Does it count as spec-driven?

---

**u/RepoBirdAI** (score: 1)

Yes, I just built out autospec to make it easier for Claude Code users: https://github.com/ariel-frischer/autospec

It improved code quality through structure, principles and guidance. Takes longer and more tokens but 1000% worth it over spaghetti slop code.

---

**u/Past_Physics2936** (score: 1)

Excuse the shameless self promotion but I'm building a tool that makes it easier to build "specs" for spec-driven development and I'm looking for early testers: https://autokapp.org/

If anyone is willing to provide detailed feedback, sign up for the beta and contact me privately. I'm hand-picking at this point because there are definitely some sharp corners.

---

**u/t0rt0ff** (score: 1)

Definitely, use it daily. Using [Devplan](https://devplan.com) (I am one of the founders, feel free to reach out). If combined with proper workflow and running agents in parallel, it does produce production ready code. The main idea: spend a little more time on planning coupled with repo analysis, create specs, start a proper coding workflow with the agent (research, plan, code, review), and then humans come in and review. The quality of the output is much higher. You don't have to merge specs into a repo if you have external storage.

---

**u/hancengiz** (score: 1)

I use the Amazon AI-DLC methodology and I built a framework that implements it and made it open source. I see this as the future of software development — not just specs, but I think even scrum needs to change or be replaced, because the software development process is changing.

References:
- AI-DLC whitepaper: https://arxiv.org/pdf/2408.03416
- AI-DLC implementation: https://prod.d13rzhkk8cj2z0.amplifyapp.com/
- My project (open source, with VS Code extension): https://www.reddit.com/r/ClaudeCode/comments/1pxsebr/specsmd_aidlc_implementation_with_vs_code/

---

**u/StatusPhilosopher258** (score: 1)

Yes, I have used spec driven development but generally using it with tools like Traycer. It is much better than doing it without any tool.

---

**u/KonradFreeman** (score: 1)

I just so happen to be a proponent of this method myself and have been writing blog posts about it for a bit.

- Coding a basic blog using this method: https://danielkliewer.com/blog/2025-11-03-document-driven-development-nextjs-blog
- More detail on the approach: https://danielkliewer.com/blog/2025-11-03-the-revolution-will-be-documented

---

**u/ChineseCracker** (score: 1)

You should use Kiro. It's free.

> **u/lam3001** (score: 6)
>
> Not sure why you were downvoted because Kiro was created for this purpose — but on the other hand speckit is newer and seems more robust.

---

**u/trafalmadorianistic** (score: 0)

No way! You mean writing down what you want to create, in great detail, actually results in better output? Like the same way having good requirements and specifications given to a dev team also results in better code? What a surprise. Shocked that using words to express intent and behaviour gives the LLM more information to use.

> **u/wringtonpete** (score: 6)
>
> Holy man buns! Are you seriously proposing that spending the time to think through the requirements and then documenting a set of specifications before coding is better than my stream of consciousness vibe coding approach? You'll be expecting me to write unit tests next.

> **u/robogame_dev** (score: 4)
>
> Be ready for everyone to reinvent all the existing coding best practices, only now "for AI." Settle in, it'll be a while.
>
> > **u/trafalmadorianistic** (score: 2)
> >
> > The way it's been hyped up is so misleading. It's a tool, not a mystical genie. Absolutely mind-boggling how I got downvoted on such an obvious point.
> >
> > > **u/robogame_dev** (score: 2)
> > >
> > > People don't know what they don't know — not as much industry experience in this subreddit.
> > >
> > > > **u/trafalmadorianistic** (score: 1)
> > > > >
> > > > > This area of tech is so active — every week there's something new coming out, and you have to keep up and see what's useful and what is froth.

---

**u/JameEagan** (score: 0)

I've been using [Stately.ai](https://stately.ai) to build complex state machines and then let AI run with that. Haven't let it work on anything serious yet but it does a pretty good job when it has direction like that.
