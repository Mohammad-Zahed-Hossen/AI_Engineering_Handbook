# AENS v2 — Architecture Freeze Decision Document
**Version: Final**
**Status: Ready to Freeze**

---

## Reconciliation Methodology

Where both reviewers agreed independently, that signal is treated as high-confidence. Where only one reviewer raised a concern, it was evaluated against the core constraint: *single maintainer, execution-first, personal second brain*. Kimi's review is architecturally more ambitious. Claude's review is more conservative. The correct answer lives closer to Claude's conservatism, filtered through Kimi's sharper structural observations.

---

## Section 1 — Must Implement Before Freeze

---

**Blocker 1: Version Stamps on All Volatile Artifacts**

Every Package page, Model page, Registry entry, and code block must carry a "Last verified against version X" field. This is a single metadata field. It costs almost nothing to add. Without it, content silently becomes wrong and the entire system's trustworthiness collapses. This is non-negotiable.

Algorithms, mathematical concepts, and architectural patterns (Gradient Descent, Bias-Variance Tradeoff, Transformer architecture) are timeless and do not require version stamps. APIs, SDKs, library interfaces, and deployment tooling (PyTorch, LangChain, OpenAI SDK, vLLM, CUDA) are volatile and require stamps on every code block and specification where the version affects correctness.

Implementation scope: one metadata field per page, one field per code block where the API is version-sensitive. Nothing more.

---

**Blocker 2: Hard Boundary Between Cheatsheet and Package Common Tasks**

The rule is now defined as follows and must be encoded in the schema:

Package Common Tasks: top 15 APIs maximum, full context — parameters, gotchas, mental trigger, example.

Cheatsheet: top 30 APIs maximum, minimal context — syntax, one-line description, link to Package page.

They serve different depths, not different content. Cheatsheets are for when you already know what you need and just need the syntax. Common Tasks are for when you need to understand what to use and how. This boundary is enforced at schema level, not at author discipline level.

---

**Blocker 3: Pipeline-Level Failure Patterns in Workflow Pages**

Step-level debugging catches component failures. It does not catch compound failures — retrieval drift, embedding-generation mismatch, context window overflow from chained agents. A Workflow page must include a "Pipeline Failure Patterns" section above the step-level debugging. This section captures failure modes that only emerge when components interact. It is distinct from per-step Common Failures and is mandatory for every Workflow page.

---

**Blocker 4: Production Notes — Layered Ownership Model**

Production Notes are not owned by a single content type. Each layer owns only its own concern. The ownership is defined as follows and is non-overlapping by definition:

**Workflow pages own:** Production Strategy, deployment architecture, scaling, monitoring, latency budgets, caching strategy, and operational guidance. These are concerns that only exist at the pipeline level and cannot be answered by a package or model in isolation.

**Model pages own:** Concise model-specific production considerations — thread safety, serialization format, quantization behavior, incremental training limitations, ONNX compatibility. These facts are intrinsic to the model and do not change based on which workflow uses it.

**Package pages own:** Concise package-specific production considerations — `torch.compile` behavior, inference mode, CUDA graphs, pinned memory, memory copy semantics. These facts are intrinsic to the package and do not change based on which workflow uses it.

The test for ownership is simple: if the production fact is true regardless of workflow context, it belongs on the Model or Package page. If it only makes sense in the context of a deployment pipeline, it belongs on the Workflow page. No content appears in more than one location.

---

**Blocker 5: `confirmed_env` Block in Workflow Prerequisites**

Every Workflow Prerequisites section gets a `confirmed_env` block: Python version, key package versions, verified date. One paragraph. This resolves the dependency conflict problem without introducing a new content type or maintenance surface.

---

## Section 2 — Mandatory Architectural Constraints

*These were previously listed as content governance guidance. They are promoted to mandatory architectural constraints. Violation of these limits is an architectural defect, not an editorial preference.*

**Package Common Tasks:** 15 entries maximum. When this limit is reached, the page is split into focused sub-pages (e.g., NumPy — Array Operations, NumPy — Linear Algebra). The parent page becomes an index.

**Workflow Steps:** 8 steps maximum. When this limit is reached, the workflow is decomposed into sub-workflows with a parent orchestration page. A workflow with 12 steps is two workflows pretending to be one.

**Cheatsheet Entries:** 30 entries maximum. When this limit is reached, a new cheatsheet is created with a narrower scope.

**Registry Entries per Category:** Unlimited, but each entry must meet the full deployment catalog specification. A partial entry does not ship.

These constraints exist because unbounded growth is how execution-first reference systems silently become documentation websites. The limit is the architecture.

---

## Section 3 — Implement After Freeze

These are real improvements. They don't threaten the core architecture if absent at freeze, and should be added as the system matures.

**Prompt Templates as Workflow Subsections.** Belongs inside LLM and Agentic Workflow pages as a dedicated subsection. Earns promotion to a top-level content type through use, not anticipation.

**Cross-Reference Entry Points Documentation.** Workflow is the primary entry point but not the only valid one. Document in Architecture Principles that Package, Model, and Registry pages are valid cold-entry points and must carry enough self-contained context to orient an engineer who arrived there directly. Do not restructure the navigation hierarchy to accommodate this.

**Evaluation Benchmarks in Model Pages.** Expand the Model Evaluation section to include one benchmark table: accuracy on canonical tasks, latency at standard batch sizes, memory footprint. Stable enough to maintain, empirically anchors the "is this model good enough?" question.

---

## Section 4 — Explicitly Rejected

**Rejected: Data as a First-Class Content Tier.** For a single engineer building ML, LLM, RAG, and Agentic systems, data preprocessing is a step inside Workflows, not a separate knowledge domain. Data handling lives in Workflow Prerequisites and Implementation steps.

**Rejected: Experiment and Reproducibility as a Content Tier.** Experiment tracking is a tooling concern (MLflow, Weights & Biases), not an architecture concern for AENS. Workflow pages note which tracking approach applies in Production Strategy. A dedicated tier describes tools that already have their own documentation.

**Rejected: Unified Decision Framework as Standalone Pages.** Decision Guides derive most of their value from co-location with the content they govern. An engineer reading a Model page should not navigate away to find "use when / avoid when" for that model. They stay where they are.

**Rejected: Typed Cross-Links.** Maintaining link type accuracy across hundreds of cross-references introduces a correctness burden that will either be ignored or maintained incorrectly. Generic "Related Content" sections, maintained honestly, are more reliable than typed links maintained poorly.

**Rejected: Troubleshooting Index as a Top-Level Content Type.** A global error index maintained manually is not viable for one person. The correct solution is consistent Debugging sections inside Package pages, Pipeline Failure Patterns inside Workflow pages, and search. The search layer handles the cross-cutting problem. The architecture does not need to.

**Rejected: Hardware Profiles as a Dedicated Content Tier.** Per-model hardware specs live in Registry entries. Per-task hardware requirements live in Workflow Prerequisites. A third Hardware tier would be a third home for the same information.

**Rejected: Security and Compliance as a Content Section.** These are policy decisions, not reference content in the AENS sense. They belong in a short, separate policy note outside the content architecture.

**Rejected: Snippet Library as a Content Tier.** The `confirmed_env` block on Workflow pages combined with well-written Implementation steps is the correct answer. A Snippet tier creates a third representation of content already covered by Cheatsheets and Workflow Implementation steps.

---

## Section 5 — Final Architecture Principles

*These govern every future decision. They take precedence over any individual feature request.*

---

**Principle 1: Execution Over Education**
Every section earns its place by answering "what do I need right now to solve the problem in front of me." If a section primarily teaches rather than enables, it does not belong in AENS.

---

**Principle 2: Single Owner, Single Source**
Every piece of information has exactly one home. Other pages reference it; they do not duplicate it. Production strategy lives in Workflow pages. Model-specific production facts live in Model pages. Package-specific production facts live in Package pages. When ownership is ambiguous, apply the test: is this fact true regardless of workflow context? If yes, it belongs on the Model or Package page. If it only makes sense inside a pipeline, it belongs on the Workflow page.

---

**Principle 3: Version Every Volatile Artifact**
Any content coupled to a library version, model version, or API version carries a verification stamp. Algorithms and mathematical concepts are timeless and exempt. APIs, SDKs, library interfaces, and deployment tooling are volatile and are never published without a version stamp. Content without a version stamp on a volatile artifact is implicitly claiming to be timeless. That claim is wrong and will corrupt the system.

---

**Principle 4: Depth Is Earned, Not Assumed**
Content types are not added speculatively. A content type earns top-level status by proving it cannot be adequately served inside an existing type. Prompt Templates start inside Workflow pages. If they outgrow that home, they earn promotion. Experiment tracking lives in tooling documentation. If AENS grows to need it natively, it earns a section then.

---

**Principle 5: Size Budgets Are Mandatory Architectural Constraints**
Package Common Tasks: 15 maximum. Workflow Steps: 8 maximum. Cheatsheet Entries: 30 maximum. When these limits are reached, content is split, not expanded. These are not editorial preferences. Violation of these limits is an architectural defect. This is the primary mechanism that keeps AENS scannable rather than encyclopedic. An unbounded page is a page that has started becoming a documentation website.

---

**Principle 6: The Hierarchy Is the Learning Path, Not the Only Entry Point**
Problem → Workflow → Model → Package → Cheatsheet → Registry is the primary navigation hierarchy. It is not the only valid entry point. Package, Model, and Registry pages must be self-orienting for engineers who arrive cold. The hierarchy is not restructured to accommodate all entry points — it is acknowledged that multiple valid entry points exist, and pages are written accordingly.

---

**Principle 7: Maintenance Cost Is a First-Class Architectural Criterion**
Any feature that creates ongoing maintenance burden disproportionate to its value is rejected, regardless of architectural elegance. This system is designed to be maintained by one person, in spare cycles, for years. Elegance that cannot survive that constraint is the wrong kind of elegance.

---

**Principle 8: Search-First Architecture**
Every page must be independently discoverable without relying on navigation. Every page carries: a canonical title, common aliases (alternative names engineers actually use), tags (domain, task type, content type), common error messages where applicable, and common terminology that an engineer might search for mid-problem. Navigation helps. Search must never depend on navigation. An engineer who lands in AENS with a `RuntimeError` string or a package name they only half-remember must be able to reach the correct page through search alone. Searchability is designed in at the page level, not bolted on at the system level.

---

## Architecture Freeze Status

**Verdict: Ready to Freeze**

The five blockers are resolved. Page size budgets are promoted to mandatory constraints. Eight governing principles are defined. Production Notes ownership is unambiguous. Search is a first-class architectural requirement.

No further structural changes are permitted after this point. Future additions are evaluated against the eight principles above and added as extensions, not revisions.

**The architecture is frozen. Proceed to schema design.**