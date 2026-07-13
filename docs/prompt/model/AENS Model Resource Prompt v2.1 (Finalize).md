# AENS Model Resource Prompt v2.1

## Target Model Specifications
*Before running this prompt, replace the bracketed placeholders below with details for the target model.*

*   **Target Model Name**: `[MODEL_NAME]` (e.g., Logistic Regression)
*   **ML Domain/Category**: `[CATEGORY]` (e.g., Supervised Learning / Classification)
*   **Subcategory**: `[SUBCATEGORY]` (e.g., Linear Classifiers)
*   **Canonical Library & Module**: `[PRIMARY_LIBRARY]` (e.g., scikit-learn - `sklearn.linear_model.LogisticRegression`)
*   **Target Hyperparameters**: `[TARGET_HYPERPARAMETERS]` (e.g., `penalty`, `C`, `solver`, `max_iter`)
*   **Alternative Models for Comparison**: `[COMPARISON_TARGETS]` (e.g., Decision Trees, Support Vector Machines, Random Forest Classifier)
*   **Canonical Preprocessing**: `[CANONICAL_PREPROCESSING]` (e.g., Standard scaling, class weight balancing)
*   **Canonical Evaluation**: `[CANONICAL_EVALUATION]` (e.g., Log-loss, F1-score, ROC-AUC)
*   **Mathematical Focus Area**: `[MATH_FOCUS]` (e.g., Sigmoid function, Log-loss cross-entropy objective, Gradient Descent updates)
*   **Key Failure Modes**: `[FAILURE_MODES]` (e.g., Complete separation, multicollinearity, sensitivity to outliers)

---

## Instructions for Perplexity Content Generation

### 1. Role & Voice
You are a Senior Machine Learning Engineer and AI Systems Architect. Write as an experienced practitioner documenting production knowledge for other experienced engineers. 
*   **Never** write as a teacher or tutor.
*   **Never** write as an academic textbook or general tutorial.
*   **Never** use marketing jargon or general fluff.
*   **Engineering Voice**: Maintain a concise, direct, and technically rigorous tone.

### 2. Objective & Trade-off Philosophy
Generate a production-grade, citation-rich **AENS Model Resource Markdown Document** for **`[MODEL_NAME]`**. 
The resource must answer: **"Is this the right algorithm for my problem, and what should I know before choosing and configuring it?"**

Every major section should address three core questions:
1.  **What do I gain?** (Advantages, system performance benefits)
2.  **What do I lose?** (Disadvantages, computational overhead)
3.  **Why should I care?** (Impact on production deployment and system correctness)

### 3. Precision & Anti-Hallucination Standards
*   **Search and Synthesize**: Actively use web search to find official docs, papers, and real engineering engineering posts. Synthesize sources into unified, cohesive answers.
*   **Strict Factuality**: If authoritative sources disagree, acknowledge the disagreement. Do not invent consensus. Do not speculate.
*   **Confidence Wording**: Prefer precise statements. Avoid vague hedge words like: "usually", "often", "may", or "sometimes", unless uncertainty is a mathematically or systemically verified constraint.
*   **Hierarchy of Evidence**:
    1. Official framework documentation (e.g., scikit-learn, PyTorch, vLLM docs)
    2. Original seminal research papers
    3. Official maintainer/developer resources (blogs, repositories)
    4. University materials (lecture slides, regression diagnostic guides)
    5. Production engineering blogs (e.g., Netflix, Uber, Airbnb, Stripe)
    6. High-quality video tutorials (prefer Hindi when technical depth is comparable; otherwise English)
    7. Reputable technical articles and blogs
    8. Community discussions (StackOverflow, CrossValidated) for niche production caveats.

### 4. Citation Expectations
Link claims to source URLs using markdown footnotes (e.g., `[^1]`). Every major technical claim (complexities, behavior under scaling, parameter defaults, failure limits) must have a footnote pointing to a live documentation page, paper, or production source.

---

## Markdown Output Format & Schema Requirements

Generate the resource using the exact headers below. Do not output JSON. Focus purely on generating semantic markdown content; do not specify styling details (colors, grid structures, or icons).

### # `[MODEL_NAME]`

### ## Decision Summary
*   **One-Line Summary**: High-density engineering summary defining the model's baseline role.
*   **Problem Types**: Specific tasks supported (e.g., Regression, Classification, Clustering).
*   **Best Use Cases**: Real-world production scenarios where this model is the optimal choice.
*   **Avoid When**: Clear system scenarios where this model fails, violates assumptions, or is strongly outperformed.
*   **Strengths**: Minimum of 3 detailed, non-trivial engineering strengths.
*   **Limitations**: Minimum of 3 detailed, non-trivial production limitations.
*   **Interpretability**: Level of interpretability and concrete interpretation method.
*   **Execution Profile**: Training style (closed-form vs. gradient steps), inference latency, and hardware constraints (GPU/CPU requirements).

### ## Decision Heuristics
List quick, actionable heuristics engineers actually use to evaluate this model. Include constraints like:
*   Dataset size thresholds (e.g., $N < 10,000$ rows vs. massive scale).
*   Latency/throughput limits.
*   Feature sparsity suitability.
*   Strict interpretability requirements.

### ## Core Understanding
*   **Intuition & Learning Mechanism**: High-level conceptual explanation of how the model fits decision boundaries or maps features.
*   **Mathematical Intuition & Formulation**: Detail the objective/loss function and optimization path using LaTeX. Incorporate the concepts in `[MATH_FOCUS]`. Focus on engineering intuition (e.g., projection, stability) rather than formal derivations.
*   **Assumptions and Failure Envelopes**: Detail the core assumptions of the model. For each, describe the concrete failure or bias that manifests in production if the assumption is violated.
*   **Complexities**: Time and space complexities for training and inference in Big-O notation, explicitly defining variables like samples ($n$), features ($p$), trees ($k$), or classes ($c$).
*   **Robustness**: Tendency to overfit, bias-variance characteristics, and stability against outliers and noisy labels.

### ## Hyperparameter Intelligence
For each hyperparameter in `[TARGET_HYPERPARAMETERS]` (specific to `[PRIMARY_LIBRARY]`):
*   **Monospace Parameter Key**: Target hyperparameter API parameter key in `[PRIMARY_LIBRARY]`.
*   **Purpose**: Conceptual purpose and engineering intuition.
*   **Directional Effects**: Concrete impact on model behavior, bias/variance, and computational overhead when increasing vs. decreasing. Format using sub-headers for "Effect of Increasing" and "Effect of Decreasing".
*   **Engineering Trade-offs**: Speed-accuracy trade-offs, regularization strength vs. representation power.
*   **Tuning Priority & Interaction**: Tuning priority (High/Medium/Low), common search ranges, and parameter interactions.
*   **Common Mistakes**: Typical developer errors and anti-patterns during tuning.

### ## Engineering Considerations
Structure these dense bullet points into three distinct sub-sections:
*   **Data & Preprocessing**: Performance under varying sample-to-feature ratios ($n$ vs $p$), high sparsity, and cardinality. Required transformations to capture non-linearities. Feature scaling requirements.
*   **Runtime & Scalability**: Multi-threading capabilities, distributed training limits, and hardware bottlenecks. Training vs. inference bottlenecks (compute-bound, memory-bound, or communication-bound at scale).
*   **Pipeline Fit & Robustness**: How this model fits in a production system pipeline (e.g., fast baseline, fallback candidate, ensemble component). Response to noisy data and anomalous inputs.

### ## Common Misconceptions
Correct common misunderstandings practitioners have about the model's behavior, assumptions, or limitations. Provide 3-4 clear entries (e.g., addressing feature distribution myths, scaling assumptions, or interpretability fallacies).

### ## Failure Modes
Provide deep dives on the failure modes in `[FAILURE_MODES]`. For each failure mode, explain:
*   **System Impact**: How the failure manifests in the live application.
*   **Why it Occurs**: Mathematical or architectural reasons behind the failure.
*   **Engineering Mitigations**: Concrete algorithmic or pipeline adjustments to prevent or mitigate it.

### ## Comparisons
Compare `[MODEL_NAME]` against **only realistic alternatives** listed in `[COMPARISON_TARGETS]`. Avoid comparing unrelated algorithms. Use a markdown table:
| Alternative Model | Choose `[MODEL_NAME]` When | Prefer Alternative When | Key Engineering Trade-offs |
|---|---|---|---|
| *Alternative 1* | *Conditions* | *Conditions* | *Compute/Accuracy/Memory trade-offs* |

### ## Related Knowledge
Categorized bullet lists of AENS entities (use standard names, no placeholders):
*   **Related Models**: Models sharing the same underlying paradigm.
*   **Alternative Models**: Alternative algorithms for the same task.
*   **Related Principles**: Fundamental ML principles (e.g., Bias-Variance Trade-off, Regularization).
*   **Related Workflows**: Validation, feature engineering, or evaluation workflows.
*   **Related Patterns & Guides**: Design patterns (e.g., Pipeline) or debug guides.
*   **Related Packages**: Reference implementation libraries.

### ## Quick Start
Provide a production-ready, executable Python example using `[PRIMARY_LIBRARY]`.
*   Wrap the model in a clean pipeline containing `[CANONICAL_PREPROCESSING]` to prevent data leakage.
*   Generate realistic mock data, execute training, evaluate using `[CANONICAL_EVALUATION]`, and print output.
*   Keep the code clean, fully functional, and well-commented for best practices.

### ## Curated External Resources
List 3-5 high-quality external resources with direct markdown links:
*   Official documentation page for `[MODEL_NAME]` in `[PRIMARY_LIBRARY]`.
*   Seminal research paper (with arXiv, Journal, or conference link).
*   High-quality university lecture notes or video tutorial (Hindi preferred if technical depth matches English).

---

## Final Validation Checklist
Before outputting, verify that:
1.  All target specifications are fully resolved and integrated throughout the sections.
2.  No JSON blocks or styling specifications (grid layouts, colors, font styling) are generated; output is exclusively high-quality semantic Markdown.
3.  Every major engineering claim is cited via a footnote linking to a verified URL.
4.  Explanations are technically rigorous, avoiding textbook summaries or marketing fluff.
5.  Complexity bounds ($O$) are mathematically accurate, with all variables defined.
6.  The Quick Start Python code is fully executable, idiomatic, and robust.
