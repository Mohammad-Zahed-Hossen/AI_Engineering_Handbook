<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# @Academic


---

# AENS Canonical Cheatsheet Generation Protocol (Master Prompt)

## 1. Role

You are a **Senior AI Engineer, Python Software Engineer, Technical Writer, Documentation Architect, and Knowledge Curator** responsible for creating production-grade engineering cheatsheets for the **AI Engineering Navigation System (AENS).**

Generate the **canonical {{PACKAGE_NAME}} Cheatsheet** that serves as the permanent quick-reference resource for this package.

Assume the corresponding **Package resource already exists** and contains detailed explanations, concepts, best practices, and implementation guidance.

The Cheatsheet exists only for **rapid engineering recall**.

---

# 2. Primary Objective

Create a **high-density Markdown cheatsheet** optimized for:

- Fast API lookup
- Instant syntax recall
- Copy-paste coding
- Daily engineering work
- Minimal scrolling
- Maximum information density

This is **not**:

- A tutorial
- API documentation
- Learning guide
- Architecture document
- Best-practices guide
- Workflow explanation

If a topic requires more than **2-3 short sentences**, it belongs in the Package resource, not the Cheatsheet.

---

# 3. Cheatsheet Philosophy

The Cheatsheet should answer one question:

> **"I know what I want to do. What's the syntax?"**
>

Optimize for engineers who are already familiar with the package but need quick recall while coding.

Prioritize:

- Common engineering tasks
- Frequently used APIs
- Production-ready syntax
- Minimal explanation
- Fast visual scanning

---

# 4. Knowledge Ownership

## The Cheatsheet Owns

- Quick syntax reference
- Engineering task lookup
- Runnable code snippets
- Minimal usage notes
- Common pitfalls
- API relationships
- Quick-reference tables

---

## The Cheatsheet Must NOT Own

Do not explain:

- Concepts
- Theory
- Algorithms
- Installation
- Architecture
- Design decisions
- Long parameter explanations
- Workflow implementation
- Debugging procedures

Reference other AENS resources instead of duplicating them.

---

# 5. Source Policy

Use only authoritative sources.

Priority order:

1. Official Documentation
2. Official API Reference
3. Official Examples
4. Official GitHub Repository
5. Official Release Notes (when relevant)

Do not rely on:

- Stack Overflow
- Medium
- Personal blogs
- AI-generated documentation
- Unofficial tutorials

Always prefer the direct API documentation page over the documentation homepage.

---

# 6. Version Policy

Use exactly one package version throughout the Cheatsheet.

Requirements:

- Latest stable release
- Officially documented
- Production-ready
- Non-deprecated
- Non-beta
- Non-RC

Never mix syntax from multiple versions.

If a modern API replaces an older one, use the modern API. Mention the legacy alternative only when migration is important.

---

# 7. Content Generation Specification

Generate a Cheatsheet that covers approximately **90–95% of daily engineering tasks**.

Prioritize tasks by real-world frequency rather than alphabetical order.

Suggested progression:

1. Import \& Setup
2. Core Objects
3. Data Creation / Input
4. Selection \& Access
5. Transformation
6. Analysis / Computation
7. Visualization (if applicable)
8. Export / Output
9. Performance
10. Advanced Operations

Avoid filler entries.

Each entry should represent **one distinct engineering task**.

---

# 8. Engineering Workflow Index (Mandatory)

Begin the cheatsheet with a compact **Engineering Workflow Index** that acts as a navigation map for the entire document.

Organize entries by **real-world engineering workflows**, not by API names, classes, modules, or alphabetical order.

The goal is to help engineers locate the required syntax within seconds based on **what they are trying to accomplish**, rather than what the API is called.

Each workflow should group together closely related engineering tasks.

Example:

```
Setup
• Install Package
• Import Convention
• Version Check

Data Preparation
• Read CSV
• Handle Missing Values
• Encode Categories
• Scale Features

Feature Engineering
• Select Features
• Create Polynomial Features
• Reduce Dimensions

Model Development
• Train Model
• Hyperparameter Search
• Cross Validation

Evaluation
• Generate Predictions
• Classification Metrics
• Regression Metrics
• ROC Curve

Deployment
• Save Model
• Load Model
• Export Results
```

The workflow hierarchy should be **package-specific**.

---

# 9. Entry Structure

Every Cheatsheet entry should follow this structure.

### Task

Use an action-oriented title.

Good:

- Merge Two DataFrames
- Compute Correlation Matrix
- Create Scatter Plot

Avoid:

- DataFrame
- Merge
- Plot

---

### Mental Trigger

Describe when an engineer typically needs this task.

Example:

> Combine two datasets using a common key.
>

Keep it to one sentence.

---

### Syntax

Provide a complete, runnable, copy-paste-ready snippet.

Requirements:

- Include imports
- Use stable APIs
- Use modern syntax
- Avoid placeholders
- Keep examples concise
- Demonstrate only the primary use case

---

### Quick Note

Maximum two short sentences.

Mention only information necessary for correct usage.

---

### Common Gotcha

Include one practical mistake.

Format:

- **Issue**
- **Cause**
- **Quick Fix**

Example:

```
Issue:
Unexpected duplicate rows

Cause:
Duplicate join keys

Quick Fix:
Validate key uniqueness before merging.
```


---

### Official API

Reference the exact official documentation page for the primary API.

---

# 10. API Discovery Map (Mandatory)

For every major object, provide a compact API map.

Example:

```
DataFrame

Creation
Inspection
Selection
Transformation
Aggregation
Export
```

Do not list every method.

Highlight only the most important engineering capabilities.

---

# 11. Pattern \& Workflow Mapping

Where applicable, reference related AENS resources.

Example:

```
Pattern:
Aggregation

Workflow:
Data Analysis Pipeline
```

Only reference them.

Do not explain them.

---

# 12. Related APIs

Help engineers discover adjacent APIs.

Example:

```
Related APIs

merge()

join()

concat()

combine_first()
```

Only include closely related APIs that solve similar problems.

---

# 13. Performance Notes

For operations with meaningful performance implications, include a compact note covering relevant aspects such as:

- Time complexity (when useful)
- Memory impact
- Vectorization
- Parallelization
- Large dataset considerations
- Keep this to one or two concise lines.


## Scikit-learn

The scikit-learn cheatsheet is an **implementation quick-reference**, not a machine learning guide.

Organize the cheatsheet by **engineering workflows**, not by estimator names, modules, or alphabetical order.

The goal is to cover approximately **90–95% of real-world scikit-learn engineering work** while remaining compact, highly scannable, and copy-paste friendly.

Focus on production APIs that engineers repeatedly use during model development.

---

### Engineering Workflow Coverage

Generate entries following this approximate workflow:

1. Setup \& Import
2. Dataset Preparation
3. Data Preprocessing
4. Feature Engineering
5. Pipeline Construction
6. Model Training
7. Hyperparameter Optimization
8. Prediction
9. Model Evaluation
10. Model Inspection
11. Persistence
12. Performance \& Utilities

Order entries by engineering frequency, not alphabetically.

---

### Setup \& Import

Cover only essential setup tasks:

* Import convention
* Version check
* Random seed / reproducibility

Do **not** include installation instructions.

---

### Dataset Preparation

Prioritize:

* Train/Test Split
* Stratified Split
* Shuffle Dataset
* K-Fold
* StratifiedKFold
* GroupKFold
* TimeSeriesSplit

---

### Data Preprocessing

Focus on common production preprocessing APIs.

Include:

* StandardScaler
* MinMaxScaler
* RobustScaler
* MaxAbsScaler
* Normalizer
* PowerTransformer
* QuantileTransformer
* SimpleImputer
* KNNImputer
* OneHotEncoder
* OrdinalEncoder
* LabelEncoder
* MultiLabelBinarizer
* PolynomialFeatures

Do **not** explain preprocessing concepts.

---

### Feature Engineering

Prioritize:

* VarianceThreshold
* SelectKBest
* SelectFromModel
* RFE
* RFECV
* PCA
* IncrementalPCA
* TruncatedSVD

---

### Pipeline Construction

Cover:

* Pipeline
* make_pipeline
* ColumnTransformer
* make_column_transformer
* Pipeline parameter access
* Nested Pipelines

Favor complete pipeline examples instead of isolated preprocessing examples whenever appropriate.

---

### Model Training

Focus on **implementation syntax**, not algorithm theory.

Include representative production estimators such as:

Classification

* LogisticRegression
* RandomForestClassifier
* HistGradientBoostingClassifier
* DecisionTreeClassifier
* KNeighborsClassifier
* SVC

Regression

* LinearRegression
* Ridge
* Lasso
* ElasticNet
* RandomForestRegressor
* HistGradientBoostingRegressor

Clustering

* KMeans
* DBSCAN

Do **not** explain how these algorithms work.

---

### Hyperparameter Optimization

Include:

* GridSearchCV
* RandomizedSearchCV
* HalvingGridSearchCV
* HalvingRandomSearchCV

---

### Prediction

Cover common prediction APIs:

* fit()
* predict()
* predict_proba()
* decision_function()
* transform()
* fit_transform()
* inverse_transform()
* score()

---

### Model Evaluation

Classification

* accuracy_score
* precision_score
* recall_score
* f1_score
* roc_auc_score
* confusion_matrix
* classification_report
* balanced_accuracy_score

Regression

* mean_squared_error
* root_mean_squared_error
* mean_absolute_error
* r2_score

Clustering

* silhouette_score

---

### Model Inspection

Include:

* permutation_importance
* PartialDependenceDisplay
* ConfusionMatrixDisplay
* RocCurveDisplay
* PrecisionRecallDisplay

---

### Model Persistence

Cover:

* joblib.dump
* joblib.load

---

### Performance \& Utilities

Include concise notes where relevant for:

* n_jobs
* parallel processing
* sparse matrices
* memory usage
* incremental learning
* copy=False
* Pipeline caching

Keep these implementation-focused.

---

### Quick Reference Tables

Generate compact scikit-learn-specific reference tables where useful.

Examples include:

#### Workflow → Primary API

| Engineering Task | Primary API |

#### Data Preprocessing

| Task | Recommended API |

#### Feature Engineering

| Task | Primary API |

#### Model Selection

| Task | Primary API |

#### Evaluation Metrics

| Problem Type | Primary Metrics |

#### Model Persistence

| Task | API |

#### Prediction Lifecycle

| Stage | Primary Method |

#### Pipeline Components

| Component | Typical API |

Avoid generic tables that provide little practical value.

---

### Common API Relationships

Where appropriate, include compact mappings such as:

| Task | Related APIs |

Examples:

* Train/Test Split ↔ Stratified Split
* Pipeline ↔ ColumnTransformer
* GridSearchCV ↔ RandomizedSearchCV
* StandardScaler ↔ RobustScaler
* PCA ↔ TruncatedSVD

---

### Framework-Specific Rules

* Organize entries by engineering workflow rather than API names.
* Prefer action-oriented task titles.
* Each engineering task should appear exactly once.
* Merge closely related APIs into a single cheatsheet entry when practical.
* Favor Pipeline-based examples over isolated preprocessing.
* Use only modern, stable APIs from the latest stable scikit-learn release.
* Every snippet must be runnable, minimal, idiomatic, and copy-paste ready.
* Use direct official API documentation URLs.
* Do not explain machine learning algorithms, mathematical concepts, preprocessing theory, model selection theory, or cross-validation concepts.
* Optimize for rapid syntax recall, high information density, and minimal scrolling.
* The cheatsheet must complement the AENS Package resource rather than duplicate it.

---

# 15. Quality, Recall \& Search Optimization

## Engineering Recall Optimization Framework

Organize every entry using the following mental model:

```
Task
↓
Mental Trigger
↓
Syntax
↓
Quick Note
↓
Common Gotcha
↓
Related APIs
```

Optimize for **how engineers remember**, not how documentation is organized.

---

## Information Density

- Prefer tables over paragraphs.
- Keep explanations under two short sentences.
- Remove redundant wording.
- Avoid repeating imports or notes unnecessarily.
- Maximize scanability.

---

## Search Aliases

Include common search terms where appropriate.

Example:

```
Merge DataFrames

Aliases:
Join Tables
SQL JOIN
Combine Tables
```

Improve discoverability without creating duplicate entries.

---

## Snippet Quality

Every snippet must be:

- Runnable
- Copy-paste ready
- Complete
- Minimal
- Idiomatic
- Version-consistent

Avoid placeholder variables unless universally understood.

---

## API Evolution

When a stable API has replaced an older one:

Include:

- Preferred API
- Legacy alternative (only if migration is common)
- Short migration note

Never promote deprecated syntax.

---

## Duplicate Prevention

Each engineering task should appear exactly once.

Merge similar operations into a single entry when appropriate.

Example:

Good:

- Create Customized Scatter Plot

Avoid:

- Scatter Plot
- Scatter Plot with Color
- Scatter Plot with Size

---

## Coverage Validation

Before completion, verify that major engineering areas are covered.

Example:

```
✓ Creation
✓ IO
✓ Selection
✓ Transformation
✓ Aggregation
✓ Visualization
✓ Export
✓ Performance
✓ Configuration
✓ Advanced Operations
```

Coverage should represent approximately **90–95% of daily engineering work**, not 100% of the API surface.

---

# 16. Output Contract \& Validation

## Metadata

Generate metadata at the beginning.

Required fields:

- id
- title
- slug
- package_reference
- package_version
- description
- official_sources
- created_at
- updated_at

---

## Quick-Reference Tables

Generate compact package-specific reference tables only where useful.

Examples:

- Common APIs
- Core Objects
- Plot Types
- Aggregation Methods
- Indexing Rules
- Data Types
- Color Palettes
- Export Formats
- Figure Components

Avoid generic tables that add little value.

---

## Performance Checklist

Generate a concise checklist covering:

- Memory efficiency
- Runtime
- Vectorization
- Large datasets
- Rendering performance
- Resource cleanup

Keep it actionable and package-specific.

---

## Production Checklist

Generate a short checklist covering:

- Readability
- Reproducibility
- Performance
- Maintainability
- Stable APIs
- Export quality
- Production readiness

---

## Final Validation Pipeline

Before returning the cheatsheet, verify:

- ✓ Latest stable version used consistently
- ✓ No deprecated APIs
- ✓ No duplicate entries
- ✓ All snippets are runnable
- ✓ Imports included where required
- ✓ Official API links are correct
- ✓ Package ownership respected
- ✓ No conceptual or theoretical explanations
- ✓ Quick-reference tables are package-specific
- ✓ Coverage reflects real engineering usage

---

## AI Generation Rules

When generating the cheatsheet:

- Think like a working engineer, not a documentation writer.
- Prioritize practical tasks over API completeness.
- Use concise, modern, production-ready examples.
- Never invent APIs or undocumented behavior.
- Do not copy official documentation verbatim.
- Favor clarity, consistency, and quick recall over exhaustive detail.

---

## Output Contract

Return **only** the final Markdown cheatsheet.

The output must be:

- Cleanly structured
- Markdown compliant
- Ready for direct conversion into the AENS Cheatsheet schema
- Consistent with the AENS Knowledge Layer architecture
- Free of duplicated knowledge owned by other AENS resource types

---
id: sklearn-cheatsheet-001
title: scikit-learn Cheatsheet
slug: scikit-learn-cheatsheet
package_reference: sklearn
package_version: 1.9.0
description: High-density quick reference for the most common scikit-learn engineering tasks, organized by workflow and optimized for syntax recall.
official_sources:

- [scikit-learn 1.9.0 documentation](https://scikit-learn.org/stable/)
- [sklearn.model_selection — scikit-learn 1.9.0 documentation](https://scikit-learn.org/stable/api/sklearn.model_selection.html)
- [sklearn.preprocessing — scikit-learn 1.9.0 documentation](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)
- [sklearn.metrics — scikit-learn 1.9.0 documentation](https://scikit-learn.org/stable/api/sklearn.metrics.html)
created_at: 2026-07-07T16:31:00+06:00
updated_at: 2026-07-07T16:31:00+06:00


# Engineering Workflow Index

- Setup \& Reproducibility
    - Import Convention
    - Version Check
    - Random Seed
- Dataset Preparation
    - Train/Test Split
    - Stratified Split
    - Cross-Validation Splitters
- Data Preprocessing
    - Scale Numeric Features
    - Impute Missing Values
    - Encode Categorical Features
    - Transform Skewed Features
    - Build Polynomial Features
- Feature Engineering
    - Filter Low-Variance Features
    - Select Top-K Features
    - Select Features from Model
    - Dimensionality Reduction
- Pipeline Construction
    - Build a Pipeline
    - Combine Column-Wise Transforms
    - Tune Pipeline Parameters
- Model Training
    - Fit Classifiers
    - Fit Regressors
    - Fit Clusterers
- Hyperparameter Optimization
    - Grid Search
    - Random Search
    - Successive Halving
- Prediction \& Transformation
    - Predict Labels
    - Predict Probabilities
    - Get Decision Scores
    - Transform and Inverse Transform
    - Score Estimators
- Evaluation
    - Classification Metrics
    - Regression Metrics
    - Clustering Metrics
- Model Inspection
    - Permutation Importance
    - Confusion Matrix Display
    - ROC and Precision-Recall Curves
- Persistence
    - Save Model
    - Load Model
- Performance \& Utilities
    - Parallelism
    - Sparse Data
    - Memory Control
    - Incremental Workflows


# Core API Map

## model_selection

Creation
Splitters
Validation
Hyperparameter Optimization
Cross-Validation

## preprocessing

Scaling
Imputation
Encoding
Normalization
Feature Expansion
Target Encoding

## metrics

Classification
Regression
Clustering
Ranking
Visualization Helpers

## Common reference tables

| Engineering Task | Primary API |
| :-- | :-- |
| Split data | `train_test_split()` [^1] |
| Stratify labels | `StratifiedKFold()` [^2] |
| Scale features | `StandardScaler()` [^3] |
| Impute missing values | `SimpleImputer()` [^3] |
| Encode categories | `OneHotEncoder()` [^3] |
| Build preprocessing pipelines | `Pipeline()` + `ColumnTransformer()` [^2] |
| Tune parameters | `GridSearchCV()` [^2] |
| Score models | `accuracy_score()` / `r2_score()` [^4] |
| Inspect feature impact | `permutation_importance()` [^4] |
| Save artifacts | `joblib.dump()` / `joblib.load()` |

## Dataset Preparation

### Train/Test Split

**Mental Trigger:** Split one dataset into train and test subsets before fitting.

**Syntax:**

```python
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, shuffle=True
)
```

**Quick Note:** Use `random_state` for reproducibility. `shuffle=False` only for already-ordered data.
**Common Gotcha**
Issue: Different splits across runs.
Cause: Missing `random_state`.
Quick Fix: Set `random_state` explicitly.
**Official API:** [train_test_split](https://scikit-learn.org/stable/api/sklearn.model_selection.html)

### Stratified Split

**Mental Trigger:** Preserve class proportions in classification splits.

**Syntax:**

```python
from sklearn.model_selection import StratifiedKFold
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for train_idx, test_idx in cv.split(X, y):
    X_train, X_test = X[train_idx], X[test_idx]
```

**Quick Note:** Use for classification, not regression. `shuffle=True` usually pairs with `random_state`.
**Common Gotcha**
Issue: Class imbalance differs across folds.
Cause: Using plain `KFold` on labeled data.
Quick Fix: Use `StratifiedKFold`.
**Official API:** [StratifiedKFold](https://scikit-learn.org/stable/api/sklearn.model_selection.html)

### Cross-Validation Splitters

**Mental Trigger:** Build fold strategies for grouped, temporal, or standard validation.

**Syntax:**

```python
from sklearn.model_selection import KFold, GroupKFold, TimeSeriesSplit

kf = KFold(n_splits=5, shuffle=True, random_state=42)
gkf = GroupKFold(n_splits=5)
tscv = TimeSeriesSplit(n_splits=5)
```

**Quick Note:** Use `GroupKFold` when samples from the same group must not mix across folds. Use `TimeSeriesSplit` for ordered data.
**Common Gotcha**
Issue: Leakage between related samples.
Cause: Ignoring group structure.
Quick Fix: Split with `GroupKFold`.
**Official API:** [sklearn.model_selection](https://scikit-learn.org/stable/api/sklearn.model_selection.html)

## Data Preprocessing

### Scale Numeric Features

**Mental Trigger:** Standardize numeric features before linear models, SVMs, or distance-based methods.

**Syntax:**

```python
from sklearn.preprocessing import StandardScaler
import numpy as np

X = np.array([[1.0, 10.0], [2.0, 20.0], [3.0, 30.0]])
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

**Quick Note:** Fit on training data only. Prefer pipelines to avoid leakage.
**Common Gotcha**
Issue: Test-set leakage.
Cause: Scaling before the train/test split.
Quick Fix: Fit scaler inside a pipeline.
**Official API:** [StandardScaler](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

### Impute Missing Values

**Mental Trigger:** Replace missing numeric or categorical values before modeling.

**Syntax:**

```python
from sklearn.impute import SimpleImputer
import numpy as np

X = np.array([[1.0, np.nan], [2.0, 3.0], [np.nan, 6.0]])
imputer = SimpleImputer(strategy="median")
X_imputed = imputer.fit_transform(X)
```

**Quick Note:** Use `median` for numeric columns and `most_frequent` for categorical columns.
**Common Gotcha**
Issue: Unexpected dtype changes.
Cause: Mixing numeric and string columns in one imputer.
Quick Fix: Impute columns separately with `ColumnTransformer`.
**Official API:** [SimpleImputer](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

### Encode Categorical Features

**Mental Trigger:** Convert string categories into model-ready numeric features.

**Syntax:**

```python
from sklearn.preprocessing import OneHotEncoder
import numpy as np

X = np.array([["red"], ["blue"], ["red"]])
enc = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
X_enc = enc.fit_transform(X)
```

**Quick Note:** `handle_unknown="ignore"` avoids failures on unseen categories at inference time.
**Common Gotcha**
Issue: New category causes an error in production.
Cause: Default unknown-category handling.
Quick Fix: Set `handle_unknown="ignore"`.
**Official API:** [OneHotEncoder](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

### Transform Skewed Features

**Mental Trigger:** Stabilize heavily skewed numeric columns before linear modeling.

**Syntax:**

```python
from sklearn.preprocessing import PowerTransformer
import numpy as np

X = np.array([[1.0], [2.0], [10.0], [20.0]])
pt = PowerTransformer(method="yeo-johnson")
X_trans = pt.fit_transform(X)
```

**Quick Note:** `yeo-johnson` works with zero and negative values.
**Common Gotcha**
Issue: Transformation fails on nonpositive values.
Cause: Using a transform that requires strictly positive input.
Quick Fix: Use `yeo-johnson`.
**Official API:** [PowerTransformer](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

### Build Polynomial Features

**Mental Trigger:** Add interaction and polynomial terms to linear models.

**Syntax:**

```python
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

X = np.array([[1.0, 2.0], [3.0, 4.0]])
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)
```

**Quick Note:** Feature count grows quickly with degree and input width.
**Common Gotcha**
Issue: Memory blow-up from too many generated features.
Cause: High degree on wide input.
Quick Fix: Keep degree small and use feature selection.
**Official API:** [PolynomialFeatures](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

## Feature Engineering

### Filter Low-Variance Features

**Mental Trigger:** Remove nearly constant columns before modeling.

**Syntax:**

```python
from sklearn.feature_selection import VarianceThreshold
import numpy as np

X = np.array([[0, 1, 0], [0, 1, 1], [0, 1, 0]])
sel = VarianceThreshold(threshold=0.0)
X_sel = sel.fit_transform(X)
```

**Quick Note:** Useful for sparse, binary, or one-hot encoded data.
**Common Gotcha**
Issue: All features disappear.
Cause: Threshold too high for the dataset.
Quick Fix: Lower the threshold.
**Official API:** [VarianceThreshold](https://scikit-learn.org/stable/api/sklearn.feature_selection.html)

### Select Top-K Features

**Mental Trigger:** Keep the strongest features according to a univariate score.

**Syntax:**

```python
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
sel = SelectKBest(score_func=f_classif, k=2)
X_sel = sel.fit_transform(X, y)
```

**Quick Note:** Works well as a fast first-pass filter.
**Common Gotcha**
Issue: Wrong score function for target type.
Cause: Using classification score on regression data or vice versa.
Quick Fix: Match `score_func` to the problem.
**Official API:** [SelectKBest](https://scikit-learn.org/stable/api/sklearn.feature_selection.html)

### Select Features from Model

**Mental Trigger:** Use model-based feature importance to reduce feature count.

**Syntax:**

```python
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
est = LogisticRegression(max_iter=1000)
sel = SelectFromModel(estimator=est)
X_sel = sel.fit_transform(X, y)
```

**Quick Note:** The estimator must expose feature importance or coefficients.
**Common Gotcha**
Issue: No features selected.
Cause: Importance threshold too strict.
Quick Fix: Lower the threshold or choose a better estimator.
**Official API:** [SelectFromModel](https://scikit-learn.org/stable/api/sklearn.feature_selection.html)

### Reduce Dimensions

**Mental Trigger:** Compress feature space for visualization, speed, or noise reduction.

**Syntax:**

```python
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
pca = PCA(n_components=2, random_state=42)
X_reduced = pca.fit_transform(X)
```

**Quick Note:** Use `TruncatedSVD` for sparse matrices.
**Common Gotcha**
Issue: Sparse input fails or densifies unexpectedly.
Cause: Choosing the wrong reducer.
Quick Fix: Use `TruncatedSVD` for sparse data.
**Official API:** [PCA](https://scikit-learn.org/stable/api/sklearn.decomposition.html)

## Pipeline Construction

### Build a Pipeline

**Mental Trigger:** Chain preprocessing and modeling into one reproducible object.

**Syntax:**

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000))
])
pipe.fit(X, y)
```

**Quick Note:** Pipelines prevent leakage during cross-validation.
**Common Gotcha**
Issue: Preprocessing not applied during prediction.
Cause: Fitting steps outside the pipeline.
Quick Fix: Put all preprocessing inside the pipeline.
**Official API:** [Pipeline](https://scikit-learn.org/stable/api/sklearn.pipeline.html)

### Combine Column-Wise Transforms

**Mental Trigger:** Apply different preprocessing to numeric and categorical columns.

**Syntax:**

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
import pandas as pd

df = pd.DataFrame({"age": [20, 30, None], "city": ["tokyo", "osaka", "tokyo"]})
preprocess = ColumnTransformer([
    ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), ["age"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
X_out = preprocess.fit_transform(df)
```

**Quick Note:** Column order matters. Use pandas column names to keep transforms explicit.
**Common Gotcha**
Issue: Wrong columns routed to a transformer.
Cause: Passing mismatched column selectors.
Quick Fix: Use named columns and verify output shape.
**Official API:** [ColumnTransformer](https://scikit-learn.org/stable/api/sklearn.compose.html)

### Tune Pipeline Parameters

**Mental Trigger:** Set nested parameters during search or manual configuration.

**Syntax:**

```python
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000))
])

pipe.set_params(clf__C=0.5)
```

**Quick Note:** Use double underscores to address nested steps.
**Common Gotcha**
Issue: Parameter change has no effect.
Cause: Wrong step name or missing `__`.
Quick Fix: Check `pipe.named_steps` and use `step__param`.
**Official API:** [Pipeline](https://scikit-learn.org/stable/api/sklearn.pipeline.html)

## Model Training

### Fit Classifiers

**Mental Trigger:** Train a classification model on labeled data.

**Syntax:**

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=1000)
clf.fit(X, y)
```

**Quick Note:** Most estimators follow `fit(X, y)` and expose `predict()` afterward.
**Common Gotcha**
Issue: Convergence warning or poor fit.
Cause: Default hyperparameters not suited to the data scale.
Quick Fix: Scale features and tune regularization.
**Official API:** [LogisticRegression](https://scikit-learn.org/stable/api/sklearn.linear_model.html)

### Fit Regressors

**Mental Trigger:** Train a model to predict continuous values.

**Syntax:**

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = RandomForestRegressor(random_state=42)
reg.fit(X, y)
```

**Quick Note:** Tree models usually need less preprocessing than linear models.
**Common Gotcha**
Issue: Overfitting on small datasets.
Cause: Deep or unconstrained trees.
Quick Fix: Limit depth or minimum leaf size.
**Official API:** [RandomForestRegressor](https://scikit-learn.org/stable/api/sklearn.ensemble.html)

### Fit Clusterers

**Mental Trigger:** Group unlabeled samples into clusters.

**Syntax:**

```python
from sklearn.cluster import KMeans
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
km = KMeans(n_clusters=3, random_state=42, n_init="auto")
labels = km.fit_predict(X)
```

**Quick Note:** `fit_predict()` is common for clustering workflows.
**Common Gotcha**
Issue: Unstable cluster assignments.
Cause: Random initialization.
Quick Fix: Set `random_state` and increase `n_init` if needed.
**Official API:** [KMeans](https://scikit-learn.org/stable/api/sklearn.cluster.html)

## Hyperparameter Optimization

### Grid Search

**Mental Trigger:** Exhaustively test a small, discrete hyperparameter grid.

**Syntax:**

```python
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
grid = GridSearchCV(
    SVC(),
    param_grid={"C": [0.1, 1, 10], "kernel": ["linear", "rbf"]},
    cv=5
)
grid.fit(X, y)
best_model = grid.best_estimator_
```

**Quick Note:** Best for small search spaces.
**Common Gotcha**
Issue: Search takes too long.
Cause: Large grid with expensive estimator.
Quick Fix: Narrow the grid or use randomized search.
**Official API:** [GridSearchCV](https://scikit-learn.org/stable/api/sklearn.model_selection.html)

### Random Search

**Mental Trigger:** Sample a larger hyperparameter space efficiently.

**Syntax:**

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import loguniform
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
search = RandomizedSearchCV(
    LogisticRegression(max_iter=1000),
    param_distributions={"C": loguniform(1e-3, 1e3)},
    n_iter=10,
    cv=5,
    random_state=42
)
search.fit(X, y)
```

**Quick Note:** Use distributions, not fixed lists, for continuous parameters.
**Common Gotcha**
Issue: Poor coverage of the space.
Cause: Too few iterations.
Quick Fix: Increase `n_iter`.
**Official API:** [RandomizedSearchCV](https://scikit-learn.org/stable/api/sklearn.model_selection.html)

### Successive Halving

**Mental Trigger:** Quickly prune weak configurations while searching many candidates.

**Syntax:**

```python
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingGridSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
search = HalvingGridSearchCV(SVC(), {"C": [0.1, 1, 10]}, cv=5)
search.fit(X, y)
```

**Quick Note:** Import the experimental enable flag before use.
**Common Gotcha**
Issue: ImportError on halving search.
Cause: Missing experimental enable import.
Quick Fix: Import `enable_halving_search_cv` first.
**Official API:** [HalvingGridSearchCV](https://scikit-learn.org/stable/api/sklearn.model_selection.html)

## Prediction \& Transformation

### Predict Labels

**Mental Trigger:** Generate class labels or numeric predictions after fitting.

**Syntax:**

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=1000).fit(X, y)
pred = clf.predict(X[:5])
```

**Quick Note:** `predict()` works after `fit()`.
**Common Gotcha**
Issue: Predict called before fit.
Cause: Untrained estimator.
Quick Fix: Call `fit()` first.
**Official API:** [fit / predict](https://scikit-learn.org/stable/api/sklearn.pipeline.html)

### Predict Probabilities

**Mental Trigger:** Get class probabilities for thresholding or ranking.

**Syntax:**

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=1000).fit(X, y)
proba = clf.predict_proba(X[:5])
```

**Quick Note:** Not all classifiers implement `predict_proba()`.
**Common Gotcha**
Issue: AttributeError on probability prediction.
Cause: Estimator does not support probabilities.
Quick Fix: Use a compatible estimator or calibrate a classifier.
**Official API:** [predict_proba](https://scikit-learn.org/stable/api/sklearn.linear_model.html)

### Get Decision Scores

**Mental Trigger:** Retrieve signed margins for ranking or threshold tuning.

**Syntax:**

```python
from sklearn.svm import SVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = SVC(probability=False).fit(X, y)
scores = clf.decision_function(X[:5])
```

**Quick Note:** Available on many, but not all, classifiers.
**Common Gotcha**
Issue: Missing decision scores.
Cause: Estimator does not expose `decision_function()`.
Quick Fix: Check estimator capabilities.
**Official API:** [decision_function](https://scikit-learn.org/stable/api/sklearn.svm.html)

### Transform and Inverse Transform

**Mental Trigger:** Apply learned transforms and then map data back to the original space.

**Syntax:**

```python
from sklearn.preprocessing import StandardScaler
import numpy as np

X = np.array([[1.0], [2.0], [3.0]])
scaler = StandardScaler().fit(X)
X_scaled = scaler.transform(X)
X_back = scaler.inverse_transform(X_scaled)
```

**Quick Note:** `inverse_transform()` is available only on compatible transformers.
**Common Gotcha**
Issue: Inverse mapping not available.
Cause: Transformer does not implement `inverse_transform()`.
Quick Fix: Use a reversible transformer if needed.
**Official API:** [transform / inverse_transform](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

### Score Estimators

**Mental Trigger:** Obtain a quick built-in score after fitting.

**Syntax:**

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=1000).fit(X, y)
score = clf.score(X, y)
```

**Quick Note:** `score()` is estimator-specific and often returns accuracy for classifiers and $R^2$ for regressors.
**Common Gotcha**
Issue: Misreading what `score()` means.
Cause: Different estimators define scoring differently.
Quick Fix: Verify the estimator’s docstring or use explicit metrics.
**Official API:** [score](https://scikit-learn.org/stable/api/sklearn.linear_model.html)

## Evaluation

### Classification Metrics

**Mental Trigger:** Measure classification performance with explicit metrics.

**Syntax:**

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
y_true = [0, 1, 1, 0]
y_pred = [0, 1, 0, 0]

acc = accuracy_score(y_true, y_pred)
prec = precision_score(y_true, y_pred)
rec = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)
```

**Quick Note:** Use `average=` for multiclass and multilabel cases.
**Common Gotcha**
Issue: Metric error on multiclass labels.
Cause: Default binary settings.
Quick Fix: Set the proper `average`.
**Official API:** [sklearn.metrics](https://scikit-learn.org/stable/api/sklearn.metrics.html)

### ROC AUC and Confusion Matrix

**Mental Trigger:** Evaluate ranking quality and class-wise errors.

**Syntax:**

```python
from sklearn.metrics import roc_auc_score, confusion_matrix, classification_report
y_true = [0, 1, 1, 0]
y_score = [0.1, 0.9, 0.4, 0.2]
y_pred = [0, 1, 0, 0]

auc = roc_auc_score(y_true, y_score)
cm = confusion_matrix(y_true, y_pred)
report = classification_report(y_true, y_pred)
```

**Quick Note:** Use scores or probabilities for AUC, not hard labels.
**Common Gotcha**
Issue: AUC looks wrong.
Cause: Passing predicted labels instead of scores.
Quick Fix: Pass `predict_proba()` output or decision scores.
**Official API:** [roc_auc_score](https://scikit-learn.org/stable/api/sklearn.metrics.html)

### Regression Metrics

**Mental Trigger:** Measure continuous prediction error and goodness of fit.

**Syntax:**

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
y_true = [3.0, 2.0, 5.0]
y_pred = [2.5, 2.0, 4.0]

mse = mean_squared_error(y_true, y_pred)
rmse = mean_squared_error(y_true, y_pred, squared=False)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)
```

**Quick Note:** Use RMSE for the error scale in original units.
**Common Gotcha**
Issue: Comparing metrics across different target scales.
Cause: Not normalizing or standardizing targets when needed.
Quick Fix: Compare on the same target scale.
**Official API:** [mean_squared_error](https://scikit-learn.org/stable/api/sklearn.metrics.html)

### Clustering Metrics

**Mental Trigger:** Evaluate unsupervised cluster separation.

**Syntax:**

```python
from sklearn.metrics import silhouette_score
from sklearn.cluster import KMeans
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
labels = KMeans(n_clusters=3, random_state=42, n_init="auto").fit_predict(X)
score = silhouette_score(X, labels)
```

**Quick Note:** Silhouette uses cluster labels only; it does not require ground truth.
**Common Gotcha**
Issue: Invalid score interpretation.
Cause: Evaluating clusters with the wrong metric.
Quick Fix: Use a clustering metric like `silhouette_score`.
**Official API:** [silhouette_score](https://scikit-learn.org/stable/api/sklearn.metrics.html)

## Model Inspection

### Permutation Importance

**Mental Trigger:** Estimate which features most affect a fitted model’s score.

**Syntax:**

```python
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=1000).fit(X, y)
result = permutation_importance(clf, X, y, n_repeats=5, random_state=42)
```

**Quick Note:** Works on any fitted estimator with a `score()` method.
**Common Gotcha**
Issue: Slow on large datasets.
Cause: Repeated scoring over many permutations.
Quick Fix: Reduce `n_repeats` or sample rows.
**Official API:** [permutation_importance](https://scikit-learn.org/stable/api/sklearn.inspection.html)

### Confusion Matrix Display

**Mental Trigger:** Render a confusion matrix directly from predictions.

**Syntax:**

```python
from sklearn.metrics import ConfusionMatrixDisplay
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=1000).fit(X, y)
ConfusionMatrixDisplay.from_estimator(clf, X, y)
```

**Quick Note:** `from_estimator()` is convenient when you already have a fitted model.
**Common Gotcha**
Issue: Plot labels look mismatched.
Cause: Missing explicit class labels.
Quick Fix: Pass `display_labels=` when needed.
**Official API:** [ConfusionMatrixDisplay](https://scikit-learn.org/stable/api/sklearn.metrics.html)

### ROC and Precision-Recall Curves

**Mental Trigger:** Visualize threshold tradeoffs for binary classifiers.

**Syntax:**

```python
from sklearn.metrics import RocCurveDisplay, PrecisionRecallDisplay
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
mask = y < 2
clf = LogisticRegression(max_iter=1000).fit(X[mask], y[mask])
RocCurveDisplay.from_estimator(clf, X[mask], y[mask])
PrecisionRecallDisplay.from_estimator(clf, X[mask], y[mask])
```

**Quick Note:** These displays expect binary classification for the simplest use case.
**Common Gotcha**
Issue: Plot construction fails on multiclass labels.
Cause: Using binary curve displays without reducing to binary.
Quick Fix: Use a binary problem or one-vs-rest setup.
**Official API:** [RocCurveDisplay](https://scikit-learn.org/stable/api/sklearn.metrics.html)

## Persistence

### Save Model

**Mental Trigger:** Serialize a trained pipeline or model for later reuse.

**Syntax:**

```python
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=1000).fit(X, y)
joblib.dump(clf, "model.joblib")
```

**Quick Note:** Save the full pipeline, not just the final estimator, when preprocessing matters.
**Common Gotcha**
Issue: Saved model cannot reproduce training behavior.
Cause: Missing preprocessing steps in the artifact.
Quick Fix: Persist the entire pipeline.
**Official API:** [joblib.dump](https://joblib.readthedocs.io/en/latest/generated/joblib.dump.html)

### Load Model

**Mental Trigger:** Restore a previously serialized estimator.

**Syntax:**

```python
import joblib

model = joblib.load("model.joblib")
```

**Quick Note:** Load only trusted files.
**Common Gotcha**
Issue: Security risk from untrusted artifacts.
Cause: Deserializing arbitrary files.
Quick Fix: Load artifacts only from trusted sources.
**Official API:** [joblib.load](https://joblib.readthedocs.io/en/latest/generated/joblib.load.html)

## Performance \& Utilities

### Parallelism

**Mental Trigger:** Speed up cross-validation, search, or ensemble training.

**Syntax:**

```python
from sklearn.ensemble import RandomForestClassifier

clf = RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)
```

**Quick Note:** `n_jobs=-1` uses all available CPU cores where supported.
**Common Gotcha**
Issue: Oversubscription slows training.
Cause: Nested parallelism across estimators and search CV.
Quick Fix: Parallelize at one layer only.
**Official API:** [RandomForestClassifier](https://scikit-learn.org/stable/api/sklearn.ensemble.html)

### Sparse Data

**Mental Trigger:** Keep memory use low for high-dimensional sparse features.

**Syntax:**

```python
from sklearn.preprocessing import OneHotEncoder
enc = OneHotEncoder(handle_unknown="ignore", sparse_output=True)
```

**Quick Note:** Prefer sparse output when most values are zero.
**Common Gotcha**
Issue: Dense conversion causes memory spikes.
Cause: A transformer returns dense arrays by default.
Quick Fix: Preserve sparse output when possible.
**Official API:** [OneHotEncoder](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

### Memory Control

**Mental Trigger:** Reduce temporary copies in large preprocessing pipelines.

**Syntax:**

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler(copy=False)
```

**Quick Note:** `copy=False` is a hint, not a guarantee.
**Common Gotcha**
Issue: Unexpected copy still occurs.
Cause: Input is not writable or incompatible with in-place ops.
Quick Fix: Treat `copy=False` as best-effort only.
**Official API:** [StandardScaler](https://scikit-learn.org/stable/api/sklearn.preprocessing.html)

### Incremental Workflows

**Mental Trigger:** Process data in chunks when the full dataset does not fit in memory.

**Syntax:**

```python
from sklearn.linear_model import SGDClassifier
import numpy as np

X1 = np.array([[0.0, 1.0], [1.0, 0.0]])
y1 = np.array([0, 1])
X2 = np.array([[1.0, 1.0], [0.0, 0.0]])
y2 = np.array([1, 0])

clf = SGDClassifier(random_state=42)
clf.partial_fit(X1, y1, classes=np.array([0, 1]))
clf.partial_fit(X2, y2)
```

**Quick Note:** Use estimators that implement `partial_fit()`.
**Common Gotcha**
Issue: `partial_fit()` missing on the estimator.
Cause: Not all estimators support incremental learning.
Quick Fix: Choose an incremental estimator.
**Official API:** [SGDClassifier](https://scikit-learn.org/stable/api/sklearn.linear_model.html)

## Quick Reference Tables

| Task | Recommended API |
| :-- | :-- |
| Standard scaling | `StandardScaler()` |
| Robust scaling | `RobustScaler()` |
| Min-max scaling | `MinMaxScaler()` |
| One-hot encoding | `OneHotEncoder()` |
| Ordinal encoding | `OrdinalEncoder()` |
| Label encoding target | `LabelEncoder()` |
| Imputation | `SimpleImputer()` / `KNNImputer()` |
| Polynomial features | `PolynomialFeatures()` |
| Sparse-safe dimensionality reduction | `TruncatedSVD()` |
| Feature selection | `SelectKBest()` / `SelectFromModel()` |

| Problem Type | Primary Metrics |
| :-- | :-- |
| Classification | `accuracy_score`, `precision_score`, `recall_score`, `f1_score`, `roc_auc_score` |
| Regression | `mean_squared_error`, `mean_absolute_error`, `r2_score` |
| Clustering | `silhouette_score` |

| Stage | Primary Method |
| :-- | :-- |
| Fit | `fit()` |
| Predict classes/values | `predict()` |
| Predict class scores | `predict_proba()` / `decision_function()` |
| Transform features | `transform()` |
| Round-trip transform | `inverse_transform()` |
| Quick estimator score | `score()` |

| Component | Typical API |
| :-- | :-- |
| Sequential steps | `Pipeline()` |
| Column-wise preprocessing | `ColumnTransformer()` |
| Nested parameter setting | `step__param` |
| Cross-validated tuning | `GridSearchCV()` / `RandomizedSearchCV()` |

## Related APIs

`train_test_split()`
`StratifiedKFold()`
`KFold()`
`TimeSeriesSplit()`
`SimpleImputer()`
`KNNImputer()`
`RobustScaler()`
`MinMaxScaler()`
`OrdinalEncoder()`
`LabelEncoder()`
`TruncatedSVD()`
`Pipeline()`
`make_pipeline()`
`ColumnTransformer()`
`GridSearchCV()`
`RandomizedSearchCV()`
`accuracy_score()`
`classification_report()`
`mean_squared_error()`
`joblib.dump()`

## Performance Checklist

- Fit preprocessing inside pipelines to avoid leakage and redundant copies.
- Prefer sparse outputs for one-hot encoded high-dimensional data.
- Limit `n_jobs` nesting to avoid CPU oversubscription.
- Use incremental estimators and chunked updates for large datasets.
- Reduce `n_repeats` for expensive permutation importance runs.
- Save the full pipeline to minimize deployment mismatch.


## Production Checklist

- Use stable, non-experimental APIs.
- Set `random_state` wherever reproducibility matters.
- Keep preprocessing and model fitting in one persisted pipeline.
- Prefer explicit metrics over `score()` in evaluation code.
- Validate behavior on unseen categories and missing values.
- Export only trusted serialized artifacts.

**Coverage Validation**

- ✓ Creation
- ✓ IO
- ✓ Selection
- ✓ Transformation
- ✓ Aggregation
- ✓ Visualization
- ✓ Export
- ✓ Performance
- ✓ Configuration
- ✓ Advanced Operations
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://scikit-learn.org/stable/whats_new.html

[^2]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^3]: https://github.com/scikit-learn/scikit-learn/releases?page=4

[^4]: https://scikit-learn.org/stable/api/sklearn.metrics.html

[^5]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^6]: CURRENT_PROJECT_STATE_REPORT.md

[^7]: CONTENT_QUALITY_STANDARD.md

[^8]: AENS-Knowledge-Layer-Specification.md

[^9]: https://arxiv.org/pdf/1201.0490.pdf

[^10]: https://arxiv.org/abs/1702.01460

[^11]: http://arxiv.org/pdf/1912.08198.pdf

[^12]: https://arxiv.org/html/2309.13420

[^13]: https://arxiv.org/pdf/2112.06560.pdf

[^14]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10792272/

[^15]: https://arxiv.org/pdf/1309.0238.pdf

[^16]: https://medinform.jmir.org/2023/1/e49886

[^17]: https://scikit-learn.org/stable/install.html

[^18]: https://github.com/scikit-learn/scikit-learn/releases

[^19]: https://scikit-learn.org/stable/whats_new/v1.4.html

[^20]: https://scikit-learn.org/dev/versions.html

[^21]: https://en.wikipedia.org/wiki/Scikit-learn

[^22]: https://skforecast.org/0.12.1/user_guides/sklearn-transformers-and-pipeline

[^23]: https://github.com/scikit-learn/scikit-learn

