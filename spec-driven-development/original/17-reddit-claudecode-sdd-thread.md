# Has anyone tried the Spec Driven Development

**Source:** https://www.reddit.com/r/ClaudeCode/comments/1rg0b9i/has_anyone_tried_the_spec_driven_development/
**Subreddit:** r/ClaudeCode
**Flair:** Question
**Author:** u/please-dont-deploy
**Posted:** 2026-02-27 07:36 UTC
**Score:** 2 (57% upvoted)

---

## Original Post

I kind of agree with Birgitta's take, there's a reason why things like MDD are not widely adopted, and it's not necessarily bc we didn't have LLMs. In her words "Especially with the more elaborate approaches that create lots of files, I can't help but think of the German compound word "Verschlimmbesserung": Are we making something worse in the attempt of making it better?"

Having said so, the need is real, so I wonder if anyone gave it a serious go (ie at least in a team of 10ppl)

what I think rn:

(a) SDD sounds extremely interesting, and for those with formal training, it sounds like a scholastic silver bullet.

(b) The flawed assumption is thinking you can give requirements and those requirements can be enforced... forever... LLMs are non-deterministic, hence

(c) You still need all the infra in your SDLC to ensure things "work as expected", and if you have a large team,

(d) Specs will get outdated, and you'll need to update them.

(e) Specs are written in human language, and nothing makes it so spec 1 cannot be contradicted by spec 50.

would love to hear why I'm wrong!

Reference article: https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html

---

## Comments

> **u/Entire-Oven-9732** | 4 points
>
> You assume you need to the spec correct up front, that is incorrect.
>
> The spec is there to be refined and iterated on, the point is, the thing you want the software to do is recorded in the spec, always.
>
> The architecture, frameworks, code samples - put them in the spec. Anything changes? Put it in the spec.
>
> If your entire src code was deleted and all your claude memory deleted, you could open a clean claude-code session, point at the spec, and tell claude to implement it.
>
> So long as you kept your spec sufficiently detailed and updated, claude will produce a very similar codebase from scratch (using the spec).
>
> Invest in the spec, the code looks after itself.

>> **u/please-dont-deploy** | 1 point
>>
>> But isn't that like coding in natural language? And also assuming that the LLM will generate the same code twice?
>>
>> What I struggle to see in the former is how you ensure two different specs don't contradict themselves, and together with the latter, it's clear to me that you still need extensive testing.
>>
>> If your testing is going to be the actual gridlock for flaws, then you can just do "TDD" for some definition of TDD, and save yourself from all the headache of maintaining potentially flawed specs.
>>
>> Right?

>>> **u/Entire-Oven-9732** | 1 point
>>>
>>> With TDD, how are you writing your tests?
>>> What's the source of truth for your assertions?
>>>
>>> You write your tests from 'requirements' - give it a name, any name you like - i call it a spec.
>>>
>>> Ultimately you have to define what you want to build, my personal belief is - if you put all the effort into that 'spec' artifact, in collaboration with your ai - then the easier it is for your ai to implement it.

>>>> **u/please-dont-deploy** | 1 point
>>>>
>>>> Actually this explains it perfectly and it was front page on HN yesterday.
>>>>
>>>> https://gist.github.com/dollspace-gay/d8d3bc3ecf4188df049d7a4726bb2a00#file-vsdd-md

---

> **u/Select-Ad-3806** | 3 points
>
> i'm writing microspecs as things evolve - otherwise known as prompts!

>> **u/Imaginary-Garbage731** | 1 point
>>
>> another md file? or just keep it in specs.md?

---

> **u/themessymiddle** | 3 points
>
> I only saw your post today - but I'm of the same mind as you. How I've been approaching it so far is by version controlling primitives like capabilities, architecture, data flow, etc. — a little bit more compact and intentional than version controlling the natural language specs.

>> **u/please-dont-deploy** | 2 points
>>
>> I'm now checking entire.io... very early on, but I wonder if they could help each other.

>>> **u/themessymiddle** | 2 points
>>>
>>> Totally, imo there's a whole slew of new primitives needed for agent-speed development.

---

> **u/cmas72** | 2 points
>
> All examples seem to start from nothing and use SDD to have AI make the code, but how do you progress after that?
>
> If I have to work on a bug X or a change Y, do I have to add my change/spec to the existing SDD and rerun the AI for a full new code generation?
>
> I have to deal with the spec PR merge on top of the code PR merge?
>
> Spec becomes the new source of truth? How can I limit the AI to only focus on my spec changes/additions and not rebuild a full app from the total spec?
>
> With a mature app, multi container, already deployed and running, how to use SDD in a team for evolution and not revert back to basic prompting?

---

> **u/AdmRL_** | 1 point
>
> The flawed assumption is viewing yourself as the developer and the agent as some sort of PA — that is inherently inefficient.
>
> SDD works, and is becoming increasingly popular when you reframe the relationship so you're the architect, product manager and project manager, and the agent is the dev. LLMs are more than capable of generating code that does the job you want, in the majority of cases when people start code reviewing their agents output they get bogged down in stylistic choices and things that aren't adding value — there's a reason Product Managers often tend not to be former developers and instead tend to come from non-technical backgrounds and it's because UX, meeting outcome expectations and similar are *significantly* more important to success/failure than stylistic code choices.
>
> The only time you should really be concerning yourself with code is when it's security related or critical to outcomes, and even then it's just making sure it's not exposing anything and is actually achieving the targets you're expected to deliver.

>> **u/AceHighness** | 1 point
>>
>> I'm no expert, but I do see exactly what you point out there, experienced developers trying to code with an LLM and getting stuck in eternal loops of setting up agents and optimizing them and still it doesn't come out quite right (stylistically).

>> **u/please-dont-deploy** | 1 point
>>
>> I'm not worried about the code, I am worried about the final business functionality introduced.
>>
>> Do you know of teams of more than 10 engineers using this approach?
>>
>> I keep wondering how they ensure the spec really gets implemented, and if they end up doing what PMs did in the past — reviewing changes manually (i.e. manual QA).
>>
>> I'm asking that because then manual QA becomes the real bottleneck to accelerate.

---

> **u/Just_Plate_1289** | 1 point
>
> In real-world development, plans frequently need to be adjusted to accommodate evolving requirements. However, once specifications and SDD are confirmed, they are difficult to change. This raises two important questions:
>
> 1. **Who defines the specifications?**
> 2. **How can we ensure that the development plan gains consensus across the team?**

>> **u/please-dont-deploy** | 1 point
>>
>> Maybe it would help me if you describe a specific type of project you are thinking of, and how the spec would stay fixed.
>>
>> In my experience, data definitions change constantly, maybe you add a column, you tweak a formula, you incorporate new steps in a funnel.
>>
>> UX also evolves constantly, you try certain flows, you add new features, etc.
>>
>> Alas, even payment systems evolve quite rapidly nowadays.
>>
>> In all these cases, there are always parts that are more static than others, but usually those are the exception.

---

> **u/Imaginary-Garbage731** | 1 point
>
> what is MDD?

>> **u/please-dont-deploy** | 1 point
>>
>> Model driven development

---

> **u/JaySym_** | 1 point
>
> I've been trying it on and off, and I think the interesting part is real, but the silver bullet version is not.
>
> The useful version of spec driven development for me is not "write requirements once and the model obeys forever." It is more like keeping a living artifact for what the task is supposed to do, what constraints matter, and what has changed as you learn more.
>
> If you treat the spec like a frozen contract, it falls apart fast. I still think all your points hold. Specs drift, they contradict each other, and none of this replaces tests, review, or engineering judgment. If the surrounding SDLC is weak, adding specs does not magically fix that.
>
> Where it has helped me is on bigger tasks where context starts leaking out across chats and half-made plans. I've been experimenting with Intent from AugmentCode for that kind of work because it keeps the spec close to the implementation and makes it easier to update the source of truth as the task evolves. That part has felt useful. Not because the model becomes smarter, just because the workflow gets less messy.
>
> So my take is basically: helpful as structure, bad as ideology.

---

> **u/StatusPhilosopher258** | 1 point
>
> SDD only works if specs are living + enforced, not static docs. You still need tests/CI to handle LLM randomness, and drift is inevitable without any guardrails. I generally use traycer for orchestration.

---

> **u/casamia123** | 1 point
>
> Great points — especially (b) and (d).
>
> The core issue with SDD is that it's essentially **waterfall in disguise**. Write detailed specs upfront, hand them to an LLM, hope for correct output. But specs get outdated, contradict each other, and LLMs are non-deterministic. No amount of spec rigor solves that.
>
> Real software development is fundamentally **iterative**. I've been working on a different approach called **REAP** (Recursive Evolutionary Autonomous Pipeline) inspired by evolutionary biology. Instead of front-loading specs, it treats development as "generations" — each with a small goal going through a lightweight lifecycle. The project's knowledge ("Genome") **evolves incrementally**, not defined all at once.
>
> To your points: **(b)** Genome mutates every generation, not enforced forever. **(d)** Staleness is addressed by design — genome stays fresh through each cycle. **(e)** Instead of 50 contradicting specs, a single compact living map.
>
> Don't write the perfect blueprint. Build a system that **evolves**.
>
> - GitHub: https://github.com/c-d-cc/reap
> - Document: https://reap.cc

>> **u/Actual-Interest-2365** | 1 point
>>
>> > The core issue with SDD is that it's essentially **waterfall in disguise** ... But specs get outdated
>>
>> No, this is a totally wrong misconception of SDD with an also wrong deduction. I would even argue, that SDD is one of the most agile processes available.
>>
>> Yes, you start with a specification. But nobody forces you to model the complete final application upfront. It is enough to start with a good-enough spec to begin your project.
>>
>> The lifecycle in SDD is as follows:
>>
>> 1. Write a Spec of your application
>> 2. Give it to an LLM and let it check the spec for contradictions, missing details etc.
>> 3. Fix the problems. Go back to 2., until the spec feels good enough for you (the AI will always find something to complain, but there is no need to over-engineer your spec).
>> 4. Let the Coding-AI implement your app.
>>
>> Now comes the interesting part. What happens when you get new requirements?
>>
>> 1. Update your spec. It is in the GIT-Repository, so you now have open uncommitted changes there.
>> 2. You go to your Coding-AI and say something like "Read and understand the uncommitted GIT changes. These are changes of the specification for this application. Implement these changes in the code". The AI will now update your code according to the spec changes.
>>
>> How does testing/debugging work?
>>
>> If you spend some extra minutes in your spec to clearly define preconditions and postconditions for the actions in the system, the Coding-AI can directly extract the UnitTest cases from this. If you still find any bugs in the app, check whether these are due to an ambiguity or missing detail in the spec (for me, this is the most often case). If so, update the spec and let the AI implement the change. If not, extend the spec by specifying a desired unit test and let the AI implement it. And only if even then there is a bug, you go personally into the code. In all other cases, your fingers stay away from the code!
>>
>> So SDD is not waterfall. It is an iterative process, where you constantly update the spec and let the AI implement the changes. SDD just means that you go from spec to code, instead of writing code first and then creating some kind of documentation (which will outdate at some time).
>>
>> Why do I think that SDD is extremely agile? Because a spec is easy to read and understand (or at least it should be). You should modularize your codebase in components/microservices, where each of these modules has its own spec. This should be in a size so that a spec is readable in under an hour (maybe 10K-20K LOC in code). Then this is the time you need to onboard a new developer to one of your modules. So you can adjust the headcount in your project with every scrum-sprint, depending on whether things go fast enough for you or you need more manpower somewhere else. This is not possible in traditional coding styles, where you need a huge amount of time to onboard new people, because they either have to read and understand a lot of code or someone has to explain it to them (mostly both).

>>> **u/casamia123** | 1 point
>>>
>>> Thanks for the detailed walkthrough. But I think there's a key distinction being missed:
>>>
>>> **SDD iterates on the *spec*, not on the *whole process*.** Your cycle is: update spec → tell AI to implement the diff → repeat. That's iteration on one artifact, with code following as a derivative. But there's no structured retrospective, no mechanism for the process itself to learn and evolve. Agile isn't just making changes iteratively — it's the system learning *how* to build better from each cycle.
>>>
>>> **Who validates the spec itself?** You describe a loop: write spec → AI checks it → fix → repeat until "good enough." But the AI is checking the spec against *itself* for internal consistency. How do you know the spec actually matches reality? Without working software as a feedback signal, you could be polishing a perfectly consistent spec that solves the wrong problem. That's an echo chamber, not validation.
>>>
>>> **"Your fingers stay away from the code" is a risk, not a feature.** The best design insights often come *from* building. When code is always a derivative of spec, you lose the feedback loop where implementation reveals what the spec got wrong conceptually. Real systems have emergent behavior that no spec predicts.
>>>
>>> **Spec consistency doesn't scale automatically.** You suggest modularizing into components with separate specs. But cross-module interactions and shared assumptions are exactly where specs silently rot. Who validates that Module A's postconditions still match Module B's preconditions after both evolved independently?
>>>
>>> Curious — try giving both our comments to an LLM and ask it to evaluate the arguments. I'd genuinely like to see what it says.

>>>> **u/Actual-Interest-2365** | 1 point
>>>>
>>>> > Agile isn't just making changes iteratively — it's the system learning *how* to build better from each cycle.
>>>>
>>>> I totally agree. But my post would have been much longer if I would have to go into the details on how SDD affects the complete development process from idea to shipment. My point was just that SDD has some new features that allow a much better process than we ever had (in my opinion).
>>>>
>>>> > **Who validates the spec itself?**
>>>>
>>>> A reviewer. In normal development processes, someone writes the code and someone else reviews the code. The same must happen with the specs in SDD: someone writes/changes the spec, someone else reviews the changes. Giving the spec to an AI is just a first self-check, which is in my experience very valuable. And if you develop software on your own, there is obviously only the AI for review.
>>>>
>>>> > **"Your fingers stay away from the code" is a risk, not a feature.**
>>>>
>>>> I disagree. I even suspect that at some point in time, it will be seen as a security risk when humans touch the code, because they make too many errors. I have lately created software with SDD where the AI generated 6000 LOC. I currently know of only 3 bugs and two of them were clearly due to imprecise spec. That's an insanely good quality, which I could have never achieved as a senior developer. Give OpenAI/Anthropic/... some more years of Coding-Agent improvement and the error rate will drop even further (if a good spec is provided).
>>>>
>>>> > When code is always a derivative of spec, you lose the feedback loop where implementation reveals what the spec got wrong conceptually.
>>>>
>>>> Maybe. But winning on one side nearly always means you lose something on the other side. You just have to decide which is more valuable for you. In the end, you always have to test the final product intensively and I would say: if you are happy with the software and the QA is happy with the software, then the spec and what the AI made out of it will most likely be good enough for shipping to the customer. And this is what matters.
>>>>
>>>> Focusing too much on code can also make you blind to higher level conceptual problems, which may be even more obvious when your complete focus is on the high level by writing the spec.
>>>>
>>>> > But cross-module interactions and shared assumptions are exactly where specs silently rot.
>>>>
>>>> I absolutely agree. But companies like Uber or Netflix have many thousands of microservices running together. So somehow this problem is solved. Unfortunately I do not know how they do it.
