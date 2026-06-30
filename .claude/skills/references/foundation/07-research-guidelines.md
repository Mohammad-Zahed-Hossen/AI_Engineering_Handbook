# 07 — Research Guidelines

**Stability:** Foundation (changes when new source patterns emerge or existing sources change structure)
**Loaded by:** All author skills, Version Auditor, Content Updater

---

## Purpose of this document

This document defines how to research content before writing it. It answers: where do I find the version number, the embedding dimension, the correct GitHub URL, the right paper? It also defines how to resolve conflicts when sources disagree, and what to do when information cannot be verified.

Research quality determines content quality. An entry with a wrong version number or a stale API signature is worse than no entry — it sends the engineer in the wrong direction during real work.

---

## The research-first rule

Never write a field value from memory or inference. Every factual claim in an AENS entry must come from a source that was consulted during the session that produced the entry.

This applies to:
- Version numbers
- Embedding dimensions
- Parameter names and defaults
- Model sizes
- GitHub URLs
- Documentation URLs
- Performance benchmarks

If a fact cannot be verified from a source consulted in the current session, either omit the field or mark it explicitly as needing verification in a comment to the user — never guess and present the guess as fact.

---

## Finding the current version

### Python packages

**Primary source:** PyPI

```
https://pypi.org/project/{package-name}/
```

The version shown at the top of the PyPI page is the current stable release. Use this. Do not use the version shown in a tutorial, a GitHub README badge (these lag), or a search result snippet.

```
https://pypi.org/project/numpy/          → current NumPy version
https://pypi.org/project/scikit-learn/   → current scikit-learn version
https://pypi.org/project/torch/          → current PyTorch version
```

**Secondary source:** Official GitHub releases page

```
https://github.com/{org}/{repo}/releases
```

Use this when the PyPI page is ambiguous (e.g. multiple packages with similar names) or when you need to confirm the release date alongside the version number.

**Never use:** `pip show {package}` output cited from a Stack Overflow answer, a tutorial's requirements.txt, or a Conda package listing — these reflect the author's environment, not the current release.

### Models on HuggingFace

Model versions are typically expressed through the model card revision or the commit hash on the Hub. For AENS purposes:

- The model ID (e.g. `BAAI/bge-large-en-v1.5`) is itself the version identifier
- Check the model card at `https://huggingface.co/{Author}/{ModelName}` for the canonical ID
- If the model has multiple revisions, use the default branch (main) unless a specific version is architecturally significant

### API models (OpenAI, Anthropic, etc.)

Use the vendor's official model list page:

```
https://platform.openai.com/docs/models
https://docs.anthropic.com/en/docs/about-claude/models
```

Copy the model ID string exactly as shown. These strings are case-sensitive and must match exactly for API calls to work.

---

## Finding the GitHub repository

### From PyPI

Every well-maintained package links its repository from the PyPI page. Look for:
- "Homepage" link
- "Source Code" link
- "Repository" link in the project links sidebar

PyPI package page → Project links → Repository URL.

If multiple links appear, prefer the one pointing to `github.com/{org}/{repo}` over any other hosting service.

### From the documentation site

Documentation sites typically link to GitHub in the footer, the "Contributing" page, or the top navigation bar.

### Verification

Once you have a GitHub URL, verify it is the official repository and not a fork:
- The repository should have substantially more stars than any fork
- It should be under the official organization account (e.g. `numpy/numpy`, not `some-user/numpy`)
- The PyPI page or documentation site should link to the same URL

---

## Finding embedding dimensions and model sizes

### Embedding dimensions

**Primary source:** The model card on HuggingFace Hub. Look for a table or bullet list in the model card describing output dimensions.

**Secondary source:** The model's configuration file on the Hub:

```
https://huggingface.co/{Author}/{ModelName}/blob/main/config.json
```

The `hidden_size` field in `config.json` is the embedding dimension for transformer-based models.

**Tertiary source:** The original paper, typically in the model architecture table.

If sources conflict: the `config.json` value is authoritative for what the model actually produces. The paper may describe an earlier version.

### Model sizes (size_mb)

**Primary source:** The model card, which typically lists the size in GB or MB.

**Secondary source:** The HuggingFace Hub repository's file listing — sum the `.safetensors` or `.bin` files:

```
https://huggingface.co/{Author}/{ModelName}/tree/main
```

**Unit conversion:** AENS stores `size_mb` as megabytes (integer). Convert from GB: multiply by 1024. Round to the nearest integer. Do not store fractional megabytes.

```
1.34 GB → 1340 MB → "size_mb": 1340
0.67 GB → 686 MB  → "size_mb": 686
```

If the model card says "approximately 1.3GB," use the file listing sum for the precise value rather than the approximation.

---

## Finding documentation URLs

### For Python packages

The function-level documentation URL pattern is consistent across major packages:

**NumPy / SciPy:**
```
https://numpy.org/doc/stable/reference/generated/numpy.{function}.html
https://docs.scipy.org/doc/scipy/reference/generated/scipy.{module}.{function}.html
```

**pandas:**
```
https://pandas.pydata.org/docs/reference/api/pandas.{Class}.{method}.html
```

**scikit-learn:**
```
https://scikit-learn.org/stable/modules/generated/sklearn.{module}.{Class}.html
```

**PyTorch:**
```
https://pytorch.org/docs/stable/{module}.html#{torch.module.function}
```

**HuggingFace Transformers:**
```
https://huggingface.co/docs/transformers/main/en/model_doc/{model-name}
```

When the URL pattern is not obvious, navigate to the function from the documentation search rather than constructing the URL manually. A constructed URL that returns 404 is worse than omitting the field.

### Verifying a documentation URL

A documentation URL is valid if:
- It returns HTTP 200 (not a redirect to a homepage, not a 404)
- The page title or heading matches the function being documented
- The page shows the function signature you are documenting

If a documentation URL redirects to the library homepage, the function may have been renamed or removed in the current version. Find the current equivalent before using the URL.

---

## Finding papers

### When a paper is the primary reference

For model entries where the architecture was introduced in a paper, find the paper through:

1. The model card on HuggingFace — most model cards link the paper directly
2. The GitHub repository README — papers are typically cited here
3. arXiv search: `https://arxiv.org/search/?searchtype=all&query={model+name}`
4. Semantic Scholar (for finding the paper ID, not for linking as a source)

Once found, link the arXiv abstract page (`https://arxiv.org/abs/{id}`), not the PDF directly.

### Verifying the paper is the correct one

Check that:
- The paper title matches the model or method being documented
- The authors include the model's creators (cross-check with the model card)
- The arXiv ID is for the original paper, not a follow-up or survey that cites it

When a model has both an original paper and a technical report (common for LLMs), prefer the original paper. If the technical report contains the architectural details and the paper does not, include both in `sources[]`.

---

## Resolving conflicting sources

Conflicts arise frequently between a model card, a paper, a GitHub README, and a documentation site. Resolve by this priority:

**For version numbers:** PyPI is authoritative for Python packages. The HuggingFace model ID string is authoritative for Hub models.

**For parameter names and defaults:** The source code is the ground truth. If the documentation says `n_estimators` defaults to 10 but the current source code and PyPI release default to 100, the source code wins. Note the discrepancy in `decision_notes` if it's significant.

**For model sizes:** `config.json` and the file listing sum are authoritative over the model card's narrative description.

**For embedding dimensions:** `config.json` `hidden_size` is authoritative over the paper, which may describe an earlier version.

**For performance benchmarks:** Do not include benchmarks from a single source without noting that benchmarks vary by dataset and hardware. Prefer benchmarks published by a neutral third party (MTEB, OpenLLM Leaderboard) over the model card's self-reported numbers. If only self-reported numbers exist, do not present them as objective fact.

**When two authoritative sources conflict and cannot be reconciled:** Note the conflict in `decision_notes`. State which value you used and why. Do not silently pick one.

---

## Handling deprecated and unmaintained projects

### Python packages

Signs a package is deprecated or unmaintained:
- PyPI page shows "Deprecated" banner
- GitHub repository is archived
- Last release is more than 2 years ago with no activity
- README links to a successor project

If a package is deprecated but still widely used (e.g. a package that was replaced by a newer version but old code still references it), document this explicitly in `summary` and add the successor to `alternatives[]`.

If a package is unmaintained with no clear successor, question whether it belongs in AENS at all. AENS is for tools an engineer will actually use in new projects.

### Models

Signs a model version is superseded:
- A newer version exists on the same HuggingFace organization
- The model card links to a newer recommended version
- The model is no longer in the top results on MTEB or similar leaderboards

For superseded models, update the Registry entry to the current recommended version. For Model entries covering an architecture family, note the current recommended checkpoint in `decision_notes`.

---

## What to do when research is incomplete

If a required field cannot be verified from a primary source:

**Option 1 — Omit the field:** For optional fields, omit rather than guess. An absent field signals "not yet documented." A wrong value signals "this is correct" and misleads the engineer.

**Option 2 — Use the best available value with a note:** If the field is required and the best available value is from a secondary source or is potentially stale, include the value but flag it in a comment to the user: "version sourced from GitHub README, not PyPI — verify before publishing."

**Never:** Present a value as verified when it was inferred, guessed, or taken from a source that was not consulted in the current session.

---

## Research depth by content type

Not every entry requires the same research depth. Match effort to the field's role.

**Package entries:** Research the current PyPI version, the specific function signatures from documentation (not from memory), and the direct function documentation URLs. Parameter defaults must come from the current documentation or source — they change between minor versions.

**Model entries:** Research the model card for capabilities and limitations, the paper for architecture context, and at least one neutral benchmark for comparative claims in `use_when` / `avoid_when`. Do not rely solely on the model card's self-reported benchmarks.

**Workflow entries:** Research the current recommended versions of all packages in `starter_stack`. Verify that the API patterns in `steps[].decision` match the current library versions — workflows go stale faster than package or model entries.

**Cheatsheet entries:** Research the specific function URL for `docs_url`. Verify the snippet runs against the current version — syntax changes between major versions more often than function availability.

**Registry entries:** Research the exact model ID string on HuggingFace, the current size in MB from the file listing, and whether the linked model detail page exists in `data/models/`.
