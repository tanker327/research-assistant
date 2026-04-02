# Best Practices for Using AI Coding Agents

Source: https://www.augmentcode.com/blog/best-practices-for-using-ai-coding-agents

Agents are a fascinating technology. They're so new and powerful that we're still discovering their capabilities and novel ways to use them effectively.

In this blog post, we outline best practices for using Augment Agent that we've discovered both internally and with our fantastic group of early testers. To make it easily digestible, we've organized it as a FAQ.

## Preamble

Many recent advancements in AI mirror how humans actually work:

- **More time, better results** — Like humans, AI performs better when given time to think.
- **Using tools** — AI becomes more capable with better tools at its disposal — just like humans do.
- **Learning from feedback** — AI improves through feedback loops, much like humans learn from experience.
- **Motivated by rewards** — Like humans, AI can be motivated to perform better if offered money.

This is particularly true for Agents. The key to working effectively with them is to **treat it as collaboration with your fellow engineer** (less experienced, but very smart). Everything else naturally follows from this approach.

## What Are Agents Good For?

At Augment, we see engineers start using Agent for virtually everything — from frontend and backend development to reviewing PRs, writing documentation and design docs, and helping with brainstorming.

At the same time, it's pretty clear that there are some tasks in which getting value from agents might be much easier than in others. Here are the scenarios where we've found Agent excels:

- Fixing bugs that are reproducible and "testable"
- Implementing features with clear specifications (from tickets or design docs) or well-defined requirements
- Brainstorming and prototyping new ideas
- Doing deep exploration of complex codebases
- Addressing PR review comments

This list keeps growing as Augment's developers and users discover new applications daily. We encourage you to experiment — the sky's the limit.

## How Should I Give the Agent a Task?

After you start using the Agent, you'll quickly develop your own approach. For now, here are some strategies we've found to work extremely well:

### Prompts should be detailed and not too short

This is especially true for complex tasks. Attempting to complete a complex task with just a few words in the prompt will almost certainly fail.

### Provide the Agent with comprehensive background information

- Explain not only the final goal but also reasoning behind, additional constraints, etc.
- Share relevant documentation such as tickets, GitHub issues, or PRs by utilizing integrations.

  `✅ ... First read ticket AU-1858 and search for Authentication design doc on notion ...`

- Include helpful examples for reference.

  `❌ ... Implement tests for class 'ImageProcessor' ...`

  `✅ ... Implement tests for class 'ImageProcessor'. Check 'text_processor.py' for test organization examples ...`

- Specify relevant keywords and file locations.

  `❌ ... Enable JSON parser for chat backend ...`

  `✅ ... Enable JSON parser for chat backend. It should be used in 'LLMOutputParsing' class, somewhere in 'services' subfolder ...`

### Break complex tasks into smaller, digestible pieces (one at a time)

- `❌ ... Read the ticket BC-986, implement the settings menu, write tests and update docs ...`
- `✅ ... Read the ticket BC-986 ... → implement the settings menu → write tests and update docs`

### For complex tasks, first discuss and refine the plan with the Agent

- `❌ ... Expose time zone selection in settings menu ...`
- `✅ ... I need to expose time zone selection in settings menu. First come up with a plan and don't jump to implementation before I approve the plan ...`

### Agent excels at iterating on test results and code execution output — take advantage of this!

- `❌ ... Implement tests for class 'TextGenerator' ... → (manually running test) → (copy pasting output to Agent) → ... Tests didn't work ...`
- `✅ ... Implement tests for class 'TextGenerator' and run them to make sure they work ...`

### Don't hesitate to try the Agent on tasks you're unfamiliar with

Let it explore and take the first pass — you'll discover lots of new things along the way.

- `❌` *(oh, I don't know how to do this task, how can I delegate it to Agent then?)*
- `✅ ... So I need to implement this new filtering algorithm. Please, explore the code and suggest some ideas how it can be done ...`

### Provide positive feedback when the Agent does a good job

This helps reinforce that it's on the right track.

- `✅ ... Cool, that's almost right! Now let's just handle this corner case ...`

## What If the Agent Is Not Doing What I Want?

This happens occasionally, but don't worry — it's almost always fixable!

You have two options:

1. If the Agent is completely off track, start a new Agent session.
2. If the Agent is only slightly off but has made useful progress, guide it in the right direction within the same session.

Regardless of which option you choose, the best approach is to understand what might have confused the Agent and genuinely help it.

Other tips:

- Use the checkpointing system whenever Agent did an incorrect file edit.
- Be strategic about creating new Agent sessions:
  - `❌` Always using a single Agent session
  - `✅` Create new sessions for distinct logical tasks

- Embrace iterative development:
  - `❌` *The model didn't solve my task in one shot — I guess it's no good*
  - `✅` Break complex tasks into manageable pieces

- Language — if you're working in a language other than English, consider switching to English since it dominates modern LLM training data.
- If the Agent struggles with a framework's syntax, direct it to look up the official documentation on the internet.

## What If I Don't Trust the Agent?

That's totally ok! As with humans, trust doesn't come out of nowhere — it has to be earned!

If you're concerned about the Agent running potentially dangerous commands on your machine, start by using non-auto mode.

If the Agent makes incorrect file modifications, you can always rely on the checkpointing system to revert changes.

If you're unsure about the Agent's capabilities:

- Begin with using the Agent in "question-answering" mode to verify its understanding of your codebase. For example: `Explain to me how authorization works in support website`. *Note: Since the Agent tends to be action-oriented, make sure to specify "This is just a question, don't edit files".*
- Then experiment with simple, self-contained tasks:
  - `... Implement more tests like this ...`
  - `... Combine these functions in a class with static methods ...`

As you see positive results, your confidence in the Agent will naturally grow!

## What Should I Do While the Agent Is Running?

Like many areas in tech, working with agents is a skill that develops over time. Internally, we recognize three general skill levels when it comes to using agents — and at each level, users tend to engage with the Agent differently while it's running.

## How Do I Review Agent-Written Code?

The code review workflow remains largely similar to reviewing code written without using agents.

Here are some tips to make the review process more efficient:

- When implementing large changes with an Agent, avoid accumulating review debt by reviewing changes after each sub-task.
- Feel free to ask the Agent clarifying questions about its code.
  - Note: Since Agents are action-oriented, they may interpret questions as commands. For example, "Why did you do X?" might be interpreted as "Don't do X." To prevent this, preface questions with "Just a question:"
- For multiple code improvements, leave comments like `#TODO(agent): use utility function here` and then ask the Agent to implement all `#TODO` comments at once rather than fixing issues individually.
- Request the Agent to run `git diff` to verify completeness and check for cleanup needs.
- Take advantage of the Agent's ability to iterate on code through testing. Have it write tests, run them, and verify proper functionality.

## Conclusion

This blog post compiles best practices that we've found work well with Augment Agent. However, we're certain this is just a drop in the ocean compared to all the techniques yet to be discovered. We're excited to hear what you've learned — share your best practices with us in our community. Happy coding!
