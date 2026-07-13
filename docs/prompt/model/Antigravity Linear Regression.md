# AENS Standard Model Generation Protocol: Linear Regression

You are a **Senior Machine Learning Engineer, AI Researcher, Technical Writer, Knowledge Architect, and Documentation Curator**.
Your task is to generate a production-grade **AENS Model Resource** for **Linear Regression**.

You must produce **exactly two separate code blocks** in your output:
1. **Markdown Format (`Linear_Regression.md`)**: A citation-rich, high-density reference document matching the style of the reference model (Random Forest).
2. **JSON Format (`linear-regression.json`)**: A strictly validated, schema-compliant JSON file.

---

## Technical Domain Focus: Linear Regression (OLS)
For this resource, focus on Ordinary Least Squares (OLS) Linear Regression. Do not write generic explanations; optimize for an experienced engineer looking to use or deploy this in a production ML pipeline.
* **Mathematical Intuition**: Detail the OLS objective (minimizing Residual Sum of Squares: $\sum (y_i - \hat{y}_i)^2$), and the closed-form normal equation: $\theta = (X^T X)^{-1} X^T y$. Explain the numerical instability caused by multicollinearity (where the determinant of $X^T X$ approaches zero, causing coefficient variance to blow up).
* **Core Assumptions**: Explicitly explain Linearity, Independence of errors, Homoscedasticity (constant variance of residuals), Normality of errors, and No Multicollinearity.
* **Complexities**: Detail training time complexity ($O(p^2 n + p^3)$ for solving normal equations or SVD solvers) and inference complexity ($O(p)$) where $p$ is the number of features and $n$ is the number of samples.
* **Failure Modes**: Cover Extrapolation limits (infinitely extrapolates linear trends, potentially producing physically impossible values like negative sales), Multicollinearity, High Outlier sensitivity, and Non-linear structures.
* **Scikit-learn Hyperparameters**: Detail `fit_intercept`, `positive` (forcing non-negative coefficients), `copy_X`, and `n_jobs`.

---

## Output 1: Markdown Resource (`Linear_Regression.md`)
Generate a markdown file structured exactly under these headings. Use concise, information-dense bullet points and short paragraphs. Incorporate footnotes (e.g., `[^1]`) to link claims to verified documentation pages or research sources.

### Decision Summary
* **One-line summary**: A high-density summary outlining the model as a simple, highly interpretable baseline.
* **Problem types**: Supervised regression problems with linear or linearized relationships.
* **Best use cases**: Baselines, financial forecasting, pricing models, problems requiring strict coefficient interpretability.
* **Avoid when**: Relationships are highly non-linear, feature count exceeds samples ($p > n$), or extreme collinearity exists.
* **Strengths**: Instant inference, zero-tuning required, mathematically closed-form, direct feature coefficient interpretability (at least 3 strengths).
* **Limitations**: High sensitivity to outliers, cannot model non-linear boundaries natively, high risk of collinearity instability (at least 3 limitations).
* **Interpretability**: Direct interpretation of beta coefficients ($\beta$) as unit changes in target variable per unit feature change.
* **Training/Inference/Computational characteristics**: Direct, non-iterative closed-form training.

### Core Understanding
* **Intuition and learning mechanism**: Minimizing RSS, fitting a hyperplane through feature space.
* **Mathematical Intuition & Formulation**: Monospace code-block or mathematical description of the Normal Equation and the projection matrix.
* **Assumptions and failure envelopes**: Detail the 5 assumptions of classical linear regression.
* **Complexities**: Training time and space complexity ($O(p^2n + p^3)$) and model footprint.
* **Robustness and overfitting tendency**: High variance when $p \approx n$, low robustness to outliers.

### Hyperparameter Intelligence
Detail the scikit-learn hyperparameters:
* **fit_intercept**: Purpose, effect of setting True/False, tradeoffs, tuning priority, interactions, common mistakes.
* **positive**: Purpose (forcing non-negative weights), tradeoffs, priority, interactions, common mistakes.

### Engineering Considerations
* **Dataset suitability**: High sensitivity to scale and correlation.
* **Feature engineering dependency**: Highly dependent on feature transformations (log, box-cox, polynomial features) to model non-linear signals.
* **Feature scaling**: Not strictly required for OLS prediction, but highly recommended for coefficient interpretation, gradient solvers, or when regularizing.
* **Class imbalance**: Behavior when target values are highly skewed.
* **Scalability and parallelization**: Multi-target regression parallelization via joblib.
* **Typical pipeline position**: Quick baseline model used before transitioning to Ridge, Lasso, or tree-based ensembles.

### Computational Characteristics
* Training complexity, inference complexity, memory complexity, scalability limitations under high feature dimensions.

### Failure Modes
* Detailed explanation of Collinearity, Non-linearity, Outliers, and Extrapolation hazards.

### Comparisons (engineering focus)
Direct comparisons detailing when to choose OLS vs alternative:
* **Ridge Regression** (L2 penalty for multicollinearity control)
* **Lasso Regression** (L1 penalty for sparse feature selection)
* **Elastic Net** (Balanced L1/L2 regularizer)
* **Random Forest Regressor** (Non-linear, robust alternative)

### Related Knowledge
* Bullet lists of related models, principles, workflows, and packages.

### Quick Start (scikit-learn)
* Provide a production-ready, executable Python example using `sklearn.linear_model.LinearRegression` wrapped in a `Pipeline` with `StandardScaler` to prevent leakage. Include metrics evaluations (`mean_squared_error`, `r2_score`).

### Curated External Resources
* Curated links to official API documentation, Scikit-learn Linear Models User Guide, and reputable university references on regression diagnostics.

---

## Output 2: JSON Resource (`linear-regression.json`)
You must output a single, strictly valid JSON block. The keys in the JSON MUST follow the exact casing and type requirements specified in the schema below to avoid validator errors.

### Strict Schema Key Specification:
* **All lowercase keys**:
  - `id`: "linear-regression"
  - `title`: "Linear Regression"
  - `name`: "Linear Regression"
  - `slug`: "linear-regression"
  - `description`: "A fundamental regression model..."
  - `createdat`: ISO 8601 string (e.g., "2026-07-09T22:10:00+06:00")
  - `updatedat`: ISO 8601 string
  - `lastverified`: ISO 8601 string
  - `reviewfrequency`: "annual"
  - `verifiedagainst`: "canonical model knowledge as of 2026-07-09"
  - `engineeringmaturity`: "production"
  - `estimatedreadingtime`: Integer (e.g., 8)
  - `githubrepo`: "https://github.com/scikit-learn/scikit-learn"
  - `problemtypes`: Array of strings
  - `decisionsummary`: Object containing:
    - `summary`: string
    - `bestusecases`: array of strings
    - `avoidwhen`: array of strings
    - `strengths`: array of strings (minimum 3)
    - `limitations`: array of strings (minimum 3)
    - `interpretability`: string
    - `trainingcharacteristics`: string
    - `inferencecharacteristics`: string
    - `computationalcharacteristics`: string
  - `coreunderstanding`: Object containing:
    - `intuition`: string
    - `learningmechanism`: string
    - `assumptions`: array of strings
    - `mathematicalintuition`: string
    - `complexity`: string
    - `memorycomplexity`: string
    - `robustness`: string
    - `scalability`: string
    - `overfittingtendency`: string
    - `biasvariance`: string
  - `engineeringconsiderations`: Object containing:
    - `datasetsuitability`: array of strings
    - `scalability`: array of strings
    - `parallelization`: string
    - `computationalcost`: string
    - `memorybehavior`: string
    - `inferencecharacteristics`: string
    - `robustness`: array of strings
    - `sensitivitytooutliers`: string
    - `featureengineeringdependency`: string
    - `featurescalingrequirement`: string
    - `classimbalancebehavior`: string
    - `commonlimitations`: array of strings
    - `pipelineposition`: string
  - `relatedknowledge`: Object containing:
    - `relatedmodels`: array of strings (NO underscore)
    - `alternative_models`: array of strings (WITH underscore)
    - `related_principles`: array of strings (WITH underscore)
    - `related_workflows`: array of strings (WITH underscore)
    - `related_patterns`: array of strings (WITH underscore)
    - `related_packages`: array of strings (WITH underscore)
    - `related_guides`: array of strings (WITH underscore)
    - `related_registry`: array of strings (WITH underscore)

* **Snake Case / Underscored keys**:
  - `learning_resources`: Array of objects. Each resource has:
    - `title`: string
    - `url`: valid URL string
    - `type`: "article" | "video" | "course" | "guide" | "documentation" | "tutorial"
    - `why_to_read`: string
    - `expected_outcome`: string
    - `reading_time`: integer (optional)

* **Exact Comparison Card Fields**:
  - `comparisons`: Array of objects. Each comparison object contains:
    - `model`: string (e.g., "Ridge Regression")
    - `choose_this_when`: string (WITH underscores)
    - `prefer_other_when`: string (WITH underscores)
    - `tradeoffs`: string

* **Quick Start Format**:
  - `quickstart`: Object containing:
    - `language`: "python"
    - `implementation_package`: "scikit-learn"
    - `code`: string (single multiline string containing the Python code)
    - `explanation`: string
    - `inputs`: string
    - `outputs`: string
    - `notes`: string

* **Related Content Relationships**:
  - `relatedcontent`: Array of objects. Each object contains:
    - `type`: "model" | "principle" | "pattern" | "package" | "workflow" | "decision_guide"
    - `id`: string (id of target resource)
    - `relationship`: string (e.g., "alternative", "uses", "implemented-by")

* **Governance and Metadata**:
  - `lifecycle`: "stable"
  - `stability`: "stable"
  - `confidence`: "verified"
  - `domain`: "ml"
  - `category`: "regression"
  - `difficulty`: "beginner"
  - `engineeringarea`: "supervised learning"
  - `prerequisites`: Array of strings
  - `recommendednext`: Array of strings
  - `sources`: Array of objects, each containing:
    - `title`: string
    - `url`: string (URL of source)
  - `tags`: Array of strings
  - `aliases`: Array of strings
  - `keywords`: Array of strings
  - `searchtokens`: Array of strings

Ensure there is zero placeholder text (no "TODO", "TBD", or filler sentences) in either output. Make technical claims precise and cite the appropriate scikit-learn standard documentation URLs where possible.
```

---