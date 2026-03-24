# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a research and knowledge aggregation repository. For each topic of interest, we curate the most popular articles/posts/papers, download them in full, translate them, and synthesize comprehensive reports or guides.

## Research Workflow

1. **Create reading list** — Use Grok to find the most popular posts, articles, and papers on a topic. Save as a reading list file (e.g., `reading-list.md`) in a new topic folder.
2. **Download sources** — Download the full content of each item from the reading list into `original/`.
3. **Translate** — Run the translator to generate Chinese translations in `zh/` - optional.
4. **Synthesize** — Generate a comprehensive report or guide from the downloaded sources.
5. **Supplement** — While reviewing the report, add related learning materials and supplementary content to `docs/`.

## Directory Structure

Each topic lives in its own top-level folder (e.g., `claude-code/`, `harness-engineering/`, `microservices/`). Within each topic folder:

- `reading-list.md` — Curated list of sources with engagement metrics
- `original/` — Full downloaded source articles
- `zh/` — Chinese translations
- `summary/` — Summarized versions and synthesized guides
- `docs/` — Supplementary learning materials added during review

All subfolders are required when adding a new topic.

## File Naming

- Use kebab-case with ASCII characters only (e.g., `01-article-title.md`)
- Transliterate CJK or special characters to ASCII

## Content Conventions

- Synthesized guides should cite their sources
- Reading lists should include engagement metrics (likes, upvotes, views) when available
- All content is Markdown
- Always load the full content of the source, not just a simple summary. Refine the format and clean up useless formatting or nonsensical content.

## Fetching Web Content

- For **x.com / Twitter URLs**: use the `x-tract` skill first. If it fails, fall back to `jina-reader`, then default methods (WebFetch, etc.).
- For **all other web pages**: use the `jina-reader` skill to fetch content. If it fails, fall back to default methods (WebFetch, etc.).

## Git Workflow

- Commit directly to `main` (no feature branches required)
- Do not commit without explicit user approval
