# Spec-Driven Development — Thoughtworks Technology Radar

**Source:** https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development
**Published:** November 5, 2025
**Radar Ring:** Assess

---

## Overview

Spec-driven development is an emerging approach to AI-assisted coding workflows. The methodology typically initiates with a structured functional specification that is progressively decomposed into smaller components, solutions, and actionable tasks. Specifications may be presented as single documents, multiple documents, or structured artifacts addressing various functional dimensions.

## Description

Spec-driven development generally refers to workflows that begin with a structured functional specification, then proceed through multiple steps to break it down into smaller pieces. The specification can be documented in multiple formats to capture different functional aspects of a system.

## Notable Tools and Implementations

Three tools have recently demonstrated distinct interpretations of spec-driven development:

- **Amazon's Kiro** — Guides users through requirements, design, and tasks creation stages.
- **GitHub's spec-kit** — Implements a three-step process with enhanced orchestration, configurable prompts, and a "constitution" defining immutable principles.
- **Tessl Framework** — Takes a radical approach where the specification itself becomes the maintained artifact rather than the code (in private beta as of September 2025).

## Assessment

While the space shows promise, current workflows remain elaborate and opinionated. Implementation challenges include:

- Tools behave differently depending on task size and type.
- Generated spec files can be difficult to review.
- It is unclear who the intended users are for PRDs or user stories produced by these tools.
- There is a risk of relearning the "bitter lesson" — that handcrafting detailed rules for AI may not scale effectively.
