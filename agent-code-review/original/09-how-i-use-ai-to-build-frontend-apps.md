# How I Use AI to Build Frontend Apps: My Candid, Messy Process

Source: https://dev.to/goose_oss/how-i-use-ai-to-build-frontend-apps-my-candid-messy-process-3ehk

---

I've noticed that some of the pushback against using AI to code stems from people not knowing **how** to use it. I know, I know you've heard the "skill issue" joke before, and it sounds annoying, but it's kind of true.

I also see a spectrum of people who are trying to accept using AI, but they don't seem to ever take the time to "chisel," as Patrick Erichson phrased it, or **refine** what the AI agent outputs. They definitely submit AI slop, and it makes me cringe.

And I know what you're thinking: *Isn't AI supposed to make me faster? If I have to edit the code, then how is that making me faster?*

It's faster on ideation, not necessarily quality. I think a lot of times, as engineers, we spend time thinking about the *how* because we don't want to waste time and investment on something that ends up not looking good or providing a good user experience. But with AI, you can quickly prototype ideas and choose the best one.

I want to show people how I do it. I've tried on livestreams, but I'm not successful. I think this is because I'm shy or embarrassed about my process. People typically use "plan mode" and do all these fancy-pants strategies with their AI agents. I am messy, but my messiness really does work. And I think more people could learn from my process (different things work for different people).

Here's my final output: [https://nokeyboardsallowed.dev/](https://nokeyboardsallowed.dev/)

---

## The Goal: A Last-Minute Landing Page

Here was my goal: I had to build a landing page for a Hackathon site. This was fairly easy to conceptualize without AI, except that I'm not great at design. I kept spending hours trying out different things, then abandoning them for things I perceived as higher priority or more enjoyable.

Sometimes, by the time I would get to a good idea, it would be 5 PM, and my crying, very wiggly baby would be home. I'd have to say goodbye to any more time I'd spend on it. Weeks went by, and the due date was approaching. In that particular moment, I also needed to hop on a plane in a few hours, so I didn't have a lot of time to work on it. (Side note: I don't know how people code with slow plane wifi).

So I brought in some "design expertise", but I really, really did not want LLM lavender.

---

## Part 1: Brainstorming with Claude Sonnet

The first thing I did was chat with [Claude](http://claude.ai/). I used **Claude Sonnet 4** to help me brainstorm what I would do and come up with a quality prompt to give an AI agent so that I'd be less frustrated with the output.

*This is an abridged version because the conversation was pretty long.*

First, I gave Claude some context:

> **Me:** need to make a hackathon landing page. help me brainstorm. the hackathon challenge will be this so im thinking we can have a hackathon landing page that reflects the theme in some type of way but lets brainstorm ideas first before we build. This is the challenge.
>
> **The Challenge:** Build an app using unconventional inputs. Voice commands, gestures, facial expressions, anything other than the traditional keyboard and mouse.

Claude offered five visual theme ideas, but I had already thought of those. I was just priming Claude with the context, laying the foundation. So, I came to Claude with a follow-up idea that I thought could push us forward. I wanted the hackathon landing page to be a demonstration of what a possible submission could be.

> **Me:** i was thinking theres a regular mode and then an unconventional mode..if that makes sense..unconventional mode could have a web cam or something with gestures

Of course, Claude glazed me:

> **Claude:** OH that's BRILLIANT! So like a meta experience where the landing page itself demonstrates the challenge!

Claude proposed the following:

- **Regular Mode:** Traditional navigation
- **Unconventional Mode:** Webcam + gesture controls with MediaPipe/TensorFlow.js

But I got the vibe that Claude might interpret "regular mode" to be a plain site. I wanted that even if people didn't enable unconventional mode, the site would still look pretty and like I tried. Both modes should be impressive in their own way, so I said:

> **Me:** but i dont want the regular mode to look too boring..you know..

Claude came to terms with the idea, and I prompted:

> **Me:** build pls

I wanted to see if my ideas actually aligned with Claude's.

### The Iteration Process

Then, I came up with a random idea, but I didn't know how to implement it. I liked what it created, but I wanted to explore what an additional layer could look like.

> **Me:** could we explore this idea but with a more cli/terminal feel..help me brainstorm

Claude gave me 8 ideas. I couldn't decide, so I asked Claude:

> **Me:** which is best to you

Claude chose, and then I prompted it to build what it was imagining.

I liked what it built... kinda. But it went so far away from what we initially built, and it didn't have a professional polish, so I prompted:

> **Me:** how can we combine ideas from before with the professional interface because i actually still liked that

It showed me a possible way to combine it, but I still was displeased, so I prompted it:

> **Me:** i feel like the terminal mode and the professional mode can be more closely integrated

Claude gave me 8 ideas, and I asked Claude "which is best to you" again. But I disagreed with its choice. So I told it that I liked a different option. I had a specific vision, and I wasn't going to turn off my brain or not critically think just because an AI tool said something. In fact, in these moments, I've never had more confidence. I'm typically a little worried about hurting human beings' feelings, but AI tools don't have feelings, so I freely disagree with them.

### Finalizing the Prompt

I liked its new build, but I had more feedback. The hackathon page was supposed to include subagents, and while it did, it misrepresented how our subagents worked, which was understandable (I don't think it's familiar with the concept), so I explained:

> **Me:** i think there should be more output of what the subagents are doing in the background. here's an example of how people use them..I can have subagents with roles like Planner, Project Manager, Architect, Frontend Dev, Backend Dev, QA Engineer, Tech Writer. Each with specific roles in the development lifecycle

It got to a place that I liked, so now I could give specific iterative feedback on small things like:

- **Me:** "maybe the developer view should be open by default"
- **Me:** "The color scheme of the subagents panel should match the rest of the website"
- **Me:** "can you keep goose lowercase..and goose is an open source AI agent..not an ai framework"

Then I asked Claude to come up with a final prompt that I could give an AI agent:

> **Me:** okay let's write out a prompt for this entire thing then keep the prompt super simple to allow the ai agent to be creative and do its thing. dont be too pedantic..but give it the information needed

Here's what it gave me:

```
Build a hackathon landing page with a unique dual-experience design that demonstrates
the hackathon's core concept through the page itself.

HACKATHON CONTEXT:
This hackathon challenges participants to build apps using unconventional inputs (voice,
gestures, facial expressions, etc.) instead of keyboard and mouse. Participants must use
goose, an AI agent that can use specialized subagent teams.

CORE DESIGN PHILOSOPHY:
The landing page should be a meta-demonstration of the challenge. It needs two distinct
modes that visitors can toggle between:

MODE 1 - PROFESSIONAL/POLISHED:
- A modern, impressive landing page that's already visually striking on its own
- Don't make this boring or plain - it should have personality and wow-factor
- Should hint at interactivity and the unconventional theme
- Use contemporary web design trends and create something that feels premium
- Include smooth animations, micro-interactions, and life/motion throughout

MODE 2 - UNCONVENTIONAL INPUTS:
- When activated, demonstrates gesture/voice control capabilities
- Shows webcam feed with hand tracking visualization
- Displays gesture control instructions
- Simulates (or actually implements) gesture-based navigation
- The UI can transform or add overlays to show this alternative interaction mode

THE KEY INSIGHT:
Mode 1 shouldn't be a "boring regular website" - both modes should be impressive in
different ways. Think of Mode 1 as a beautiful sports car parked (professional, polished,
stunning) and Mode 2 as actually driving it (interactive, gesture-controlled, immersive).

REQUIRED CONTENT SECTIONS:
1. Hero - Introduce the hackathon with impact
2. The Challenge - Explain the unconventional inputs requirement, no keyboard/mouse allowed
3. The Tool (goose) - Explain that participants must use goose AI framework to create
   specialized subagent teams
4. Call to Action - Registration

5. THE SUBAGENT PANEL:
Include a side panel (open by default) that shows goose subagents actively working. This
simulates a real development workflow with specialized agents:
- Planner (defines vision)
- Project Manager (breaks down tasks)
- Architect (sets up structure)
- Frontend Developer (builds UI)
- Backend Developer (API logic)
- QA Engineer (tests)
- Tech Writer (documentation)

Show these agents actually working through tasks with activity logs and status updates.
Make it feel like you're watching a development team collaborate in real-time.

TECHNICAL IMPLEMENTATION:
- Toggle button to switch between modes (make it prominent and enticing)
- When in unconventional mode: show webcam preview, gesture tracking visualization,
  control instructions
- Smooth transitions between modes
- Consider using MediaPipe or TensorFlow.js for actual hand tracking if you want it
  functional
- The page should work gracefully even if webcam permission is denied

CREATIVE FREEDOM:
You have complete freedom on:
- Visual style and aesthetic direction (cyberpunk, minimalist, brutalist, glassmorphic,
  whatever you think fits)
- Color palette
- Typography choices
- Animation style
- Layout structure
- How the two modes relate to each other visually
- The transition between modes

THE GOAL:
Create a landing page where the experience itself teaches visitors what the hackathon is
about. Someone should visit this page and immediately understand "unconventional inputs"
through interaction, not just reading. Make both modes compelling in their own right -
don't sacrifice one for the other.

WHAT SUCCESS LOOKS LIKE:
- Visitors are impressed by Mode 1 and think "this is slick"
- Visitors are intrigued by the mode toggle and want to try it
- Visitors switch to Mode 2 and think "oh THAT'S what unconventional inputs means"
- The page feels cohesive even with two different modes
- The page is memorable and makes people excited about the hackathon

Build something that pushes boundaries and shows creativity while being functional
and accessible.
```

Then, I copied and pasted the prompt into Loveable, ChatGPT, and [goose](https://block.github.io/goose). I compared the output for all three. Loveable had the best design.

---

## Part 2: Building the UI with Loveable

I don't know what combination of LLMs + system prompt they have, but it's great. I went to Loveable because I knew it would come out super polished.

Loveable gave me what I wanted, so I exported the code locally to my computer so I could continue working with it via goose.

---

## Part 3: Working with goose (My Codebase Agent)

When I'm working with goose, I have a [`goosehints`](https://block.github.io/goose/docs/guides/using-goosehints) file that says **make a commit for every change**. I also set up the Git repo for the working directory and connected it locally and remotely. This way, if there's something I don't like, I can easily roll back.

I moved to goose because I know it can see the whole landscape of my codebase and it has information about itself since it's `goose`. I used Claude Sonnet 4 as the LLM for goose.

### Getting Familiar

I told goose to get familiar with the app by prompting it to look through the codebase and look at what was running on `localhost:8000`.

> **goose:** Pushed back and said it can't look at `localhost:8000`.
>
> **Me:** I pushed back again and reminded it that yes it can with the chrome dev tools mcp server.

Of course, it said I was absolutely right! goose gave me a summary of what the site was about, so that was perfect that it knew and I didn't have to explain.

### Adding Features and Iterating on Placement

I told it my next steps:

> **Me:** Because we're challenging them to use new technology, I want to link them to our documentation. How do you think I should do that?
>
> Here's our main docs: `https://block.github.io/goose/docs/category/guides`
>
> Here's our installation: `https://block.github.io/goose/docs/getting-started/installation`
>
> Here's our subagents docs: `https://block.github.io/goose/docs/guides/subagents`
>
> Where do you think I should add this? Should I just have one link to main docs, or should I include all three? How should it look design wise?

goose took a maximalist approach: it created a comprehensive "Get Started" section with:

- Three resource cards (Documentation, Installation, Subagents)
- Primary styling for main docs
- Quick start flow for hackathon participants
- Positioned between Challenge and Registration

I thought it was too much, so I suggested:

> **Me:** I was thinking one singular button that says read the docs would've worked

Then I asked for placement advice:

> **Me:** What do you think of the placement? Take a look at the entire site, it's on localhost 8080.
>
> **goose:** (After some technical back-and-forth getting Chrome DevTools working) Analyzed the full page flow:
>
> - Current placement: Button after "The Challenge" section
> - Suggested improvement: **Move to "Meet goose" section instead**
> - Reasoning: Better flow: Hero -> Meet goose + Docs -> Video -> Challenge -> Registration; Natural progression: Introduce tool -> Learn tool -> See it -> Apply it; Higher conversion: People read docs when curious about tool, not when focused on challenge.

I asked goose to make it mobile responsive and implement dark mode and light mode themes.

### The Debugging Dance

Then I asked it to add the ability to respond to voice input. I suggested we use MediaPipe. It agreed and then reminded me that I should actually use the browser's Web Speech API.

We then went back and forth on debugging the functionality together. Well, more like goose did the debugging and I reported that it didn't work.

> **Me:** Voice control stopped working
>
> **goose:** (Fixes permissions)
>
> **Me:** No, it's flickering and spazzing
>
> **goose:** (Checks console, finds restart loop)
>
> **goose:** (First fix attempt)
>
> **Me:** Still not listening
>
> **goose:** (Checks console again, more investigation)
>
> **goose:** (Second fix attempt)
>
> **Me:** Still says ready but doesn't react
>
> **goose:** (Final solution: Decides to just use a manual Start/Stop button)
>
> **Result:** Voice control works, but with manual activation.

---

## Adding Easter Eggs

Then, I just started adding features and easter eggs for fun. For this step, I didn't manually edit the code much because I knew this was just a simple frontend with no backend complexities that needed to be managed, and this site would only be used for a month. However, I made sure there were no bugs that showed up in the console or any buggy user experience. If there were state management issues, I shared them and made suggestions for how goose should fix, and sometimes goose countered with better suggestions.

In the end, I had a landing page that I could control using my voice or hand gestures. I completed the project in half a day. This was immense progress, considering I'd been trying to build the site since August, repeatedly abandoning it after losing focus due to broken attempts. Despite having to pause for family and packing, the AI-driven approach sped up my experience immensely. My specific workflow for this build was a messy but effective iterative process: Claude for brainstorming the perfect prompt, Loveable for nailing the visual polish, and finally goose to rapidly iterate on the code.

*What does your AI workflow look like?*
