# 06 — Official Resource Policy

**Stability:** Foundation (changes rarely — update only if a source category or priority decision changes)
**Loaded by:** All author skills, Version Auditor, Content Auditor

---

## Purpose of this document

Every URL in AENS must earn its place. This document defines which sources are acceptable, which are preferred, how to choose between competing sources, and what to do when the ideal source doesn't exist. It prevents AENS from accumulating links to blogs, tutorials, and aggregator sites that rot, move, and contradict each other.

The guiding principle: AENS is a navigation layer to official resources. It is not a curated list of the best blog posts about a topic.

---

## Source priority order

When multiple sources could document the same fact, choose by this priority. Higher priority always wins over lower priority when both are available.

```
1. Official documentation site
2. Official GitHub repository
3. Official model card (HuggingFace Hub)
4. Original research paper (arXiv, ACL Anthology, OpenReview, NeurIPS)
5. Vendor documentation (OpenAI, Anthropic, Cohere, Google AI)
6. Nothing — omit the field rather than use a low-quality source
```

Levels 1–5 are acceptable. Anything below level 5 requires explicit justification and is generally rejected.

---

## Level 1 — Official documentation site

The authoritative human-readable reference maintained by the project team.

**Acceptable:**
- `https://numpy.org/doc/stable/`
- `https://pytorch.org/docs/stable/`
- `https://scikit-learn.org/stable/`
- `https://huggingface.co/docs/transformers/`
- `https://pandas.pydata.org/docs/`

**The specific page rule:** Every `official_docs` and `docs_url` field must link to the specific function, class, or method page — not the documentation homepage or a section index.

```
WRONG:  "https://numpy.org/doc/stable/"
WRONG:  "https://numpy.org/doc/stable/reference/routines.html"
RIGHT:  "https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html"

WRONG:  "https://scikit-learn.org/stable/"
RIGHT:  "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html"
```

This rule exists because the `official_docs` field is a navigation target — the engineer clicks it expecting to land on exactly the right page. A homepage adds another search step that defeats the purpose.

**The `sources` array is different:** The `sources` field at the package or model root level can link to the documentation homepage or repository root, since it represents "where this content came from" rather than "where to go next."

```json
"sources": ["https://numpy.org"]         ← acceptable for sources[]
"official_docs": "https://numpy.org"     ← NOT acceptable for official_docs
```

---

## Level 2 — Official GitHub repository

The canonical source repository maintained by the project team or model authors.

**When to use:** When no dedicated documentation site exists, or as a supplementary source in `sources[]` alongside the documentation URL.

**How to identify:** The repository linked from the official documentation or PyPI page. Not a fork. Not a mirror. Not a community reimplementation.

**What to link:** The repository root, not a specific commit, branch, or file path. Commit-pinned URLs break when the repository restructures.

```
WRONG:  "https://github.com/numpy/numpy/blob/main/numpy/linalg/linalg.py"
RIGHT:  "https://github.com/numpy/numpy"
```

The `github_repo` field on BaseMeta is the correct place for this URL. It must start with `https://github.com` — this is enforced by Zod.

---

## Level 3 — Official model card

The model card on HuggingFace Hub maintained by the model authors.

**When to use:** For models that have a HuggingFace presence — embedding models, LLMs, vision models, speech models. The model card is the primary source for model size, embedding dimension, supported languages, and usage examples.

**Format:**
```
https://huggingface.co/{Author}/{ModelName}
```

Examples:
```
https://huggingface.co/BAAI/bge-large-en-v1.5
https://huggingface.co/meta-llama/Meta-Llama-3-8B
https://huggingface.co/thenlper/gte-large
```

**What not to link:** Model card URLs with query parameters, specific file paths within the repository, or non-HuggingFace mirrors of the model card.

---

## Level 4 — Research paper

The original paper introducing or describing the model or method.

**Acceptable paper sources, in order of preference:**
- arXiv: `https://arxiv.org/abs/{paper-id}`
- ACL Anthology: `https://aclanthology.org/{paper-id}`
- OpenReview: `https://openreview.net/forum?id={paper-id}`
- NeurIPS proceedings: `https://papers.nips.cc/...`
- ICML/ICLR proceedings

**Not acceptable as primary source:** Semantic Scholar, Papers With Code, ResearchGate, Academia.edu, or any site that aggregates papers without hosting the authoritative version.

**When to include:** For models and workflows where the paper is the primary reference (attention mechanisms, RAG, specific model architectures). Do not include a paper just because one exists — include it only if the paper is the right "where to go next" resource for the engineer.

Papers go in `sources[]`, not in `official_docs`. The `official_docs` field is for documentation, not papers.

---

## Level 5 — Vendor documentation

Documentation for hosted API services: OpenAI, Anthropic, Cohere, Google AI, Mistral, etc.

**Acceptable:**
- `https://platform.openai.com/docs/`
- `https://docs.anthropic.com/`
- `https://docs.cohere.com/`

**The same specific-page rule applies:** Link to the specific API reference page, not the vendor documentation homepage.

**When to use:** For Registry entries and Model entries covering proprietary API models where no open-source documentation exists.

---

## What is never acceptable

Regardless of quality, these source types must not appear in any AENS content:

**Blog posts and Medium articles** — they move, go stale, and are not authoritative. The one exception: a blog post written by the original model authors announcing or explaining their model, where no other official documentation exists. Even then, prefer linking the paper or model card if available.

**Stack Overflow and forums** — correct answers become incorrect as APIs change. Never use as a source.

**Third-party tutorial sites** — Towards Data Science, Analytics Vidhya, Kaggle notebooks, and similar. These are learning resources, not reference documentation.

**YouTube videos** — not linkable as a source URL in a structured field.

**Wikipedia** — describes concepts at too high a level to be useful for implementation reference.

**Unofficial documentation mirrors** — devdocs.io, readthedocs.io mirrors of unofficial forks, and similar. Use the project's official documentation site instead. Note: many projects host their official docs *on* readthedocs.io — check whether the subdomain belongs to the official project.

**Search result URLs** — `https://www.google.com/search?q=numpy+reshape` is never a source.

**Archived pages (Wayback Machine)** — indicates the original source is gone; find a current replacement or omit.

---

## Handling missing official sources

**Scenario: No dedicated documentation site exists.**
Use GitHub repository as level 1. Link to the README or the `docs/` directory if structured documentation exists within the repository.

**Scenario: Documentation is behind a login wall.**
Link to the public-facing documentation index if one exists. Do not link to authenticated pages. If no public documentation exists, link only the GitHub repository.

**Scenario: The model has no HuggingFace card.**
Use the vendor's own model reference page, the original paper, or the GitHub model card file if the repository contains one.

**Scenario: No official source of any kind exists.**
Omit the `official_docs` field entirely rather than link a blog post. For `sources[]`, link the best available source with a note — but if no URL-valid source exists, note this as a gap for future verification rather than inventing a source.

**Scenario: Official documentation URL returns 404.**
Do not include the broken URL. Search for the current URL — documentation sites frequently restructure. If the current URL cannot be found, omit the field and flag the entry for verification.

---

## Version-specific URLs

When linking to versioned documentation (e.g., scikit-learn 1.4 vs. 1.5), prefer the stable or latest URL that automatically tracks the current release:

```
PREFER:   "https://scikit-learn.org/stable/..."
AVOID:    "https://scikit-learn.org/1.4/..."
```

Version-pinned URLs become stale when a new release ships. The `stable` or `latest` path stays current without maintenance.

Exception: when a specific version introduced a breaking change and the entry is documenting version-specific behaviour. In that case, pin the URL and note the version in `decision_notes`.

---

## The `sources[]` field vs. navigation fields

These two uses of URLs serve different purposes and have different standards:

| Field | Purpose | Granularity required |
|---|---|---|
| `sources[]` | "Where did this content come from?" | Homepage or repository root is acceptable |
| `official_docs` | "Where should the engineer go for more detail?" | Specific function page required |
| `docs_url` | "Where is the documentation for this operation?" | Specific function page required |
| `github_repo` | "Where is the source code?" | Repository root only |

Never put a blog URL in `official_docs` or `docs_url`. Never put a function-level URL in `github_repo`. Keep the semantic role of each field distinct.

---

## Pre-output checklist for sources

Before finalising any content item:

- [ ] Every URL in `sources[]` is a valid `https://` URL (Zod enforces this — plain text strings fail)
- [ ] `official_docs` and `docs_url` link to a specific function/method page, not a homepage
- [ ] `github_repo` starts with `https://github.com/` and points to the repository root
- [ ] No blog posts, Medium articles, tutorial sites, or forum links in any field
- [ ] For model entries: HuggingFace model card URL is in `sources[]` if the model has one
- [ ] For paper references: arXiv or proceedings URL is in `sources[]`, not in `official_docs`
- [ ] All URLs resolve (not 404, not redirecting to a homepage)
- [ ] Version-specific URLs use `/stable/` or `/latest/` paths where available
