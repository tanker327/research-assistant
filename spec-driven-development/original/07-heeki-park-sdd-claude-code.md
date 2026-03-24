# Using Spec-Driven Development with Claude Code

**Source:** https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29
**Author:** Heeki Park
**Published:** March 1, 2026
**Read time:** 11 min

---

I no longer write code by hand. I wouldn't call myself a proper software development engineer by trade, nor have I deployed large-scale software systems. I am a solutions architect and have written mostly prototypes and small-scale applications. Still, those experiences, combined with reading, research, and schooling, have shaped my rudimentary software engineering approaches that I now take to AI tools like Claude Code.

I give this context because I want to say that my build approach isn't just giving into the vibes. There is a structured approach to documenting requirements, generating specifications, and reviewing the code that is generated. When deploying on AWS, there is [design thinking](https://heeki.medium.com/accelerating-serverless-development-with-blueprints-and-governance-7ea9c06463a9) to how resources are organized and deployed based on frequency of change.

As such, I spend a lot of time in the planning phase of the project, rather than jumping right into code generation. Defining and documenting requirements early on leads to better outputs and a less frustrating overall experience. You might say this is true of any software engineering project before AI tools even hit the scene.

That said, the Pandora's box of AI tools has been opened, and now we need to pump the brakes on vibe coding before we add more tech debt to our backlog. Spec-driven development can act as those brakes, reinforcing good software engineering practices while also taking advantage of the productivity gains from generative AI.

## Understanding Spec-Driven Development

When I first started hearing about spec-driven development, I initially wondered if this was just about documenting the requirements first before proceeding with the implementation. Didn't we already have that all documented in Confluence, which we could then pull in via MCP? However, one also recognizes that even well-documented projects are subject to scope creep, feature divergence, gold plating, and tech debt from quick fixes.

Spec-driven development _can_ help address some of those issues, but it depends on how it is applied. Birgitta Böckeler wrote an excellent [blog post](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) that outlines three levels of spec-driven development.

1. **spec-first:** well thought-out spec is written first, then used in the AI-assisted development workflow
2. **spec-anchored:** spec is kept even after the task is complete, for evolution and maintenance of the respective feature
3. **spec-as-source:** spec is the main source file over time, only the spec is edited by the human, human never touches the code

I think my general inclination is mostly toward spec-first approaches. It's very easy to start by iterating on a singular specification for the project and putting together a great design and implementation plan. It's equally easy to go off and start implementing, leaving that one specification in the dust, especially as one gets deeper into the project. Perhaps that's not even spec-first but instead _spec-once_ development.

Spec-once development is where the specification launches the project but is later forgotten. However, I think the value in spec-driven development is the fact that the developer is forced to think deeply about the use case requirements, document architectural considerations, and outline implementation approaches. It also indicates that there could be many specification documents for different features. Furthermore, with the latter definitions of spec-driven, it forces the developer to constantly revisit those requirements and feed them back into the specification(s).

Spec-driven development as a continuous feedback loop is the ideal: requirements inform the spec, the spec drives implementation, and learnings from implementation feed back into the spec.

## Planning and Drafting the Specification

For concrete practice, I wanted to better understand the nuts and bolts of how an interceptor worked with AgentCore Gateway. While [documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-types.html) provides examples of input and output payloads with the interceptor function, I wanted to dig in firsthand.

My normal flow for these prototyping endeavors is:

1. Conduct due diligence by reading documentation and other relevant sources
2. Plan out the resources required for deployment in AWS
3. Start building small, testable modules

The research phase happens regardless, but I use those same phases when building out my initial prompt for Claude Code.

**Phase 1 — Research:** I read the CloudFormation [documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-gateway.html#cfn-bedrockagentcore-gateway-interceptorconfigurations) to understand the properties and parameters required to configure the relevant resources. I also directed Claude Code to go and ingest the documentation so that it operated on the same context and used the relevant resource properties.

**Phase 2 — Architecture:** I spent time thinking through how I would build out the stack, considering resource dependencies, modular testing, and overall project flow. I broke the overall project down into two sub-projects with the appropriate phases for each:

- **Sub-project 1 (Stack 1):** A single phase for the interceptor — a Lambda function added to the Gateway resource via the `InterceptorConfigurations` property. Made this a separate stack so I could test and iterate using [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli.html).

- **Sub-project 2:** Three phases to build stepwise:
  - *Stack 2:* Create the MCP server and deploy it on AgentCore Runtime. Test locally and then use the same test on the deployed endpoint.
  - *Stack 3:* Create the AgentCore Gateway resource and set up the MCP server in AgentCore Runtime as the target. Set up a credential provider configuration to ensure that AgentCore Gateway uses OAuth2 when connecting to the MCP server. Test the end-to-end stack.
  - *Stack 3 updates:* Integrate the interceptor at the Gateway, which injects a custom header passed along to the MCP server. Added more logging to see the headers passed throughout the call stack and ultimately returned to the test client.

At the top level, I specified that my preference is the new [AgentCore CLI](https://github.com/aws/agentcore-cli), which is currently in public preview and aims to replace the [starter toolkit](https://github.com/aws/bedrock-agentcore-starter-toolkit). However, because it is in public preview, it doesn't yet support all the resources and configurations. In those scenarios, I directed it to not use the `boto3` SDK (in retrospect, I should have positively stated that it should fall back to using CloudFormation).

**Phase 3 — Iteration and Review:** I made sure that there is plenty of iteration in a planning phase, writing all the plans as a specification. I spent time reviewing the specification to ensure that the design, architecture, and implementation plan aligned with my expectations.

## Tidbits on Working with Claude Code

**The default context window of 200k tokens was fine for my purposes.**

[Context windows](https://code.claude.com/docs/en/how-claude-code-works#the-context-window) define how much information can be included in each round trip with Claude. The information includes relevant code, steering documents, available tools with their associated descriptions, data retrieved from tool calls, skills, conversation history, etc.

The default context window limit on paid Claude plans is [200k](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans) tokens, which in my experience with the Pro subscription, also applies to Claude Code. The extended context window of [1m](https://support.claude.com/en/articles/12386420-claude-code-faq#h_6fd7d6ab56) tokens is currently available only for users with the Max 20x subscription.

What about using Bedrock directly? You can swap by setting `CLAUDE_CODE_USE_BEDROCK=1` before starting up Claude Code. Bedrock has Claude Opus 4.6, Sonnet 4.6, Sonnet 4.5, and Sonnet 4, all of which support 1m token context windows in beta. To get access to that extended context window, you need to inject a custom header: `"anthropic-beta: context-1m-2025-08-07"`. However, Claude Code manages interactions with the API and as far as I am aware, there is no way to add the beta flag — hence, 200k tokens it is.

In heavy usage scenarios when hitting the context window limit, Claude Code automatically compacts the conversation history. The compaction process took 3–5 minutes on the low end and 10–12 minutes on the high end.

**Opus hits subscription plan usage limits really fast compared to Sonnet.**

With subscription plans, the [usage limits](https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits) are defined as the "conversation budget" — determining how many messages you can send. It is influenced by the conversation history, features used, and the chosen model. In my anecdotal experience with the Pro subscription, I ran into sliding window usage limits within 45 minutes to an hour of heavy Opus 4.6 use. When switching over to Sonnet 4.6, I did not hit any usage limits, even after a few hours of heavy usage.

**Instruct Claude Code to ask clarifying questions using selectable inputs.**

This way, Claude Code presents a set of options that you can navigate via a menu of choices, with the last option left for open user input if needed. I generally found that the presented options were sufficient. This makes the back-and-forth much easier and faster. At the end, you get a nice summary of the questions asked and the selected responses.

**I found myself trusting the actions of Claude Code more and more over time.**

For each action that Claude Code takes, it generally presents three options: 1/ yes, 2/ yes and don't ask again for this subset of actions, 3/ no. I initially started by mostly choosing yes and closely observing each action. Over time, I found many actions to be fairly innocuous, especially read-only actions. I even found myself auto-allowing writes to code files as I trusted the outputs more. That said, I still haven't gotten to the point of going full YOLO mode with the `--dangerously-skip-permissions` flag.

**Running multiple Claude Code sessions using `tmux` is enjoyable.**

I initially did this as I had one session with my subscription plan and two alternate sessions using Bedrock. However, I realized I didn't need to do that when I saw how easy it was to enable API access and resume the prior session:

```bash
/exit
export CLAUDE_CODE_USE_BEDROCK=1
claude --resume <session_id>
```

Regardless, multiple parallel sessions will be useful when experimenting with agent teams: `tmux -CC` in iTerm2 works great for this.

**An amusing discovery:** When Claude Code was trying to research an approach to solving a problem, it used web search to retrieve additional information — and tried to fetch my own blog post. Unfortunately, Claude Code failed to pull the post, as Medium appears to block agents from retrieving content from its platform.

## Lessons Learned

**Time spent in upfront planning pays dividends for implementation efficiency and output quality.**

In earlier projects, I would write a few quick sentences as part of the initial prompt and get generating as soon as possible. I found myself course correcting a lot and occasionally wondering if I needed to start from scratch. While I didn't one-shot this project, I found most of my follow-up interactions were small tweaks rather than wholesale changes to the entire project. Furthermore, I frequently took learnings from the project and integrated them into my `CLAUDE.md` steering document and even ended up creating a `SKILL.md` at the end of the project. Custom skills creation will likely be a significant accelerator for future projects.

**Build stepwise in small, easily testable chunks.**

The upfront planning makes it easier to test and correct functionality. This [article](https://www.cjroth.com/blog/2026-02-18-building-an-elite-engineering-culture) discusses approaches for building an elite engineering culture, covering the use of [stacked pull requests](https://www.stacking.dev/) — smaller, more easily reviewable PRs with dependencies on each other.

**Flexibility and workarounds are often required.**

I really like the new AgentCore CLI. However, as it's still in public preview, none of the functionality needed for implementation was supported. I ended up going the CloudFormation route. I also found that I couldn't create credential providers using CloudFormation and had to use `boto3` to [create](https://github.com/heeki/agents/blob/5762abad2d0f87376317944891970b2792010c8d/interceptors/gateway/setup_oauth.py#L21) it. From there, I was able to [inject](https://github.com/heeki/agents/blob/5762abad2d0f87376317944891970b2792010c8d/interceptors/gateway/iac/gateway.yaml#L155) the provider ARN as a [property](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-bedrockagentcore-gatewaytarget-oauthcredentialprovider.html#cfn-bedrockagentcore-gatewaytarget-oauthcredentialprovider-providerarn) for the Gateway target.

**Build security in sooner rather than later.**

I added the last layer of OAuth 2 for ingress to the Gateway at the end, and it resulted in having to redeploy the entire stack. The Gateway `AuthorizerType` property cannot be changed in place — it requires the resource to be replaced entirely. Because I had to create the credential provider via `boto3`, this required a multi-step delete-and-recreate process. Claude Code handled this with relative ease, but in enterprise deployment pipelines it could be more painful.

**Regularly revisit and update documentation.**

At each step, if I needed to course correct and tweak the design, I made sure to update the specification. While I mainly applied a spec-first approach, I continually revisited the specification and tried to move closer to spec-anchored. It kept me grounded, revisiting original intent and modifying as appropriate.

## Conclusion

This space is moving so fast. I have been spending more and more time in Claude Code and figuring out how to use the latest capabilities and techniques. I encourage you to think of your own small project idea and get hands on, regardless of your background, because with these tools, [anyone can build](https://heeki.medium.com/reimagining-who-can-build-0a5e8f14b114).

The frontier keeps charging ahead. I have another bigger project idea in mind, where I aim to apply [agent teams](https://code.claude.com/docs/en/agent-teams) for the build. This project likely has far more than I can interactively build, so I want to explore how I might do this with agent teammates to whom I assign issues from a backlog.

## Resources

- https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
- https://github.com/heeki/agents/tree/main/interceptors
- https://x.com/bcherny/status/2017742741636321619
- https://www.cjroth.com/blog/2026-02-18-building-an-elite-engineering-culture
- https://builder.aws.com/content/39vdJOeWD0pbA7hpKpW1a2tBw8x/extending-claude-code-with-plugins-and-skills-for-aws-development
