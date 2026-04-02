# AI That Audits Your Code: Building an Automated Code Review Agent

Source: https://kurkowski.substack.com/p/ai-that-audits-your-code-building

---

Welcome back to the AI Weekly Challenge! After last week's adventure with the [AI Agent Factory](https://kurkowski.substack.com/p/ai-that-builds-ai-crafting-your-own), I'm excited to share this week's challenge where we're tackling another practical problem: **automated code review**.

In my commercial work, I frequently find myself reviewing entire repositories. The most time-consuming part? Identifying the most urgent issues while teams wait for feedback. This got me thinking after seeing an interesting LinkedIn post about using LLMs with their ever-increasing token limits to review single files.

I decided to take this concept further. Why not automate the entire process, define specific review perspectives, and create a tool that would streamline my workflow? Plus, this could help developers level up their skills - we often don't see our own mistakes and tend to repeat them across projects.

What you'll find in this article:

- My thinking process and approach to this real-world problem
- Architecture of an AI code audit system
- Working code you can use on your own projects
- Insights into how this tool can help developers grow

## The Evolution of the Idea

When I started thinking about this challenge, I was facing a very practical problem: how to speed up code reviews without sacrificing quality. Here's how my thinking evolved:

I started by experimenting with scripts that would pack entire repository into single text file and feeding it into ChatGPT to talk about the codebase. Through these experiments, I began to notice patterns emerging - particularly around different perspectives that could be applied to code analysis.

My next step was to build a simple agent with just two core functions:

- A node for fetching and processing repository code
- A basic question-answering system that worked with the code in its state

I then decided to automate everything I would normally do in a manual code review by adding specialized perspectives and creating a comprehensive reporting system.

Initially, I worked in Jupyter notebooks for rapid prototyping. As the agent became more complex, I transitioned to LangGraph Studio, which made debugging the flow much easier.

## System Architecture

The system I built has several key components:

### 1. Repository Ingestion Engine

This component is responsible for:

- Mapping the repository structure
- Identifying file types and languages
- Handling GitHub repositories via API
- Intelligently chunking large repositories to work within token limits
- Filtering out binary files and irrelevant content (like node_modules)

### 2. Multi-Perspective Analysis Engine

This is where the magic happens. Instead of just one generic review, the system applies five specialized "lenses" to the code:

- **Architectural Lens**: Evaluates overall design patterns, component organization, and modularity
- **Business Domain Lens**: Assesses how well the code aligns with business requirements and domain model clarity
- **Code Quality Lens**: Checks for clean code principles, complexity, readability, and testing quality
- **Security Lens**: Identifies potential vulnerabilities, authentication issues, and unsafe practices
- **Modernization Lens**: Analyzes technical debt and opportunities for adopting newer technologies

All of this happens at the same time thanks to LangGraph branch splitting.

### 3. Report Generation

Unlike a simple issue sorter, this component:

- Combines insights from all five perspectives
- Creates a comprehensive, cohesive final report
- Presents findings in a structured, actionable format
- Highlights patterns and cross-cutting concerns

### 4. Interactive Q&A

What makes this more than just a static analysis tool is the ability to:

- Ask follow-up questions about specific issues
- Request explanations or solutions
- Dig deeper into problem areas with context-aware responses

## Implementation Details

The implementation uses LangGraph for its agent architecture.

Each perspective is a specialized analysis that focuses on specific aspects of the code, with dedicated prompts that guide the LLM to examine the codebase through a particular lens.

## Key Learnings

Building this code audit agent revealed several insights:

### Context Window Challenges

Even with 100K+ token context windows, I still ran into limitations when analyzing large repositories. The solution was a smart chunking strategy that groups related files and provides repository structure to maintain global context.

### Language-Specific Analysis Quality

I discovered significant differences in how well LLMs analyze different programming languages:

- **Excellent**: Python, JavaScript, TypeScript
- **Very Good**: Java, C#, Ruby
- **Good**: Go, PHP
- **Less Reliable**: C, C++, Rust (especially for complex memory management issues)

### Specialized Perspectives Matter

Having separate analysis passes for different aspects produced significantly better results than a single generic review. Each perspective had specialized prompts that made the LLM focus deeply on specific aspects.

## Real-World Results

When applied to real-world projects, the results were impressive. On a medium-sized web application:

1. The security lens identified potential SQL injection vulnerabilities that had passed human review
2. The code quality lens found numerous instances of duplicate code that could be refactored
3. The architectural lens identified several components that violated Single Responsibility Principle

The most valuable aspect was the speed - what would normally take me hours of careful reading was condensed into minutes, with a comprehensive report highlighting the most critical issues.

## Practical Applications

This AI code audit system has numerous practical applications:

- Pre-commit checks to catch issues before they enter the codebase
- Learning tool to understand best practices and common pitfalls
- Personal code quality assistant
- Integration into CI/CD pipelines for automated review
- Standardizing code review processes
- Reducing review fatigue among team members

## Future Improvements

The system could be expanded to include:

- **Custom Perspective Creation**: Allow teams to define their own review lenses
- **Codebase Evolution Analysis**: Track how code health changes over time
- **Automated Fix Suggestions**: Not just identifying issues but proposing solutions

## Key Takeaways

Building this AI code audit agent taught me several important lessons:

1. **LLMs excel at pattern recognition in code**: They can spot issues humans might miss due to familiarity blindness.
2. **Parallel processing with specialized perspectives works better**: Breaking down the complex task of code review into specialized perspectives dramatically improved results.
3. **The "human + AI" workflow is key**: The system works best not as a replacement for human review but as an augmentation, handling the tedious aspects while surfacing important issues for human attention.

Try the code yourself -- repo link [here](https://github.com/kurkowski93/ai-code-audit). Just add .env file and open entire folder in [LangGraph Studio](https://github.com/langchain-ai/langgraph-studio).

If you build something cool or have additional perspectives you'd like to see included, let me know in the comments!
