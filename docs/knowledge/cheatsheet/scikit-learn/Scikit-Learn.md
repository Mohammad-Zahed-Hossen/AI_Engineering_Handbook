<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# {PACKAGE_NAME}=scikit-learn

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

Keep this to one or two concise lines.

Do not provide optimization tutorials.

---

---

# Scikit-learn Canonical Generation Rules (AENS)

## Objective

Generate the **canonical Scikit-learn Cheatsheet** covering approximately **90–100 engineering tasks** representing **95–98% of real-world Scikit-learn workflows**.

The objective is **engineering recall**, not API completeness.

One engineering task may include multiple closely related APIs.

Never create separate entries for trivial API variations.

---

# Coverage Requirements

The final cheatsheet should contain approximately **90–100 engineering tasks** distributed across the Scikit-learn ecosystem.

Target distribution:


| Area | Approx. Tasks |
| :-- | --: |
| Setup \& Configuration | 4 |
| Dataset Utilities | 4 |
| Data Splitting | 8 |
| Preprocessing | 18 |
| Feature Engineering | 10 |
| Classification | 14 |
| Regression | 10 |
| Clustering | 8 |
| Model Evaluation | 10 |
| Model Selection | 8 |
| Pipelines \& Composition | 8 |
| Persistence \& Utilities | 6 |

Do not artificially reach 100 entries. Merge closely related workflows where appropriate.

---

# Mandatory Module Coverage

The cheatsheet must include practical engineering workflows from:

* sklearn.datasets
* sklearn.model_selection
* sklearn.preprocessing
* sklearn.compose
* sklearn.pipeline
* sklearn.impute
* sklearn.feature_selection
* sklearn.decomposition
* sklearn.linear_model
* sklearn.tree
* sklearn.ensemble
* sklearn.neighbors
* sklearn.svm
* sklearn.naive_bayes
* sklearn.cluster
* sklearn.metrics
* sklearn.inspection
* sklearn.calibration
* sklearn.dummy
* sklearn.multiclass
* sklearn.multioutput
* sklearn.utils
* sklearn.base

Only include modules used in production workflows.

---

# Estimator Coverage

Cover the estimators engineers most frequently use.

### Classification

Include workflows for:

* LogisticRegression
* SGDClassifier
* PassiveAggressiveClassifier
* DecisionTreeClassifier
* RandomForestClassifier
* ExtraTreesClassifier
* HistGradientBoostingClassifier
* AdaBoostClassifier
* BaggingClassifier
* VotingClassifier
* StackingClassifier
* SVC
* LinearSVC
* KNeighborsClassifier
* GaussianNB
* MultinomialNB
* MLPClassifier
* DummyClassifier

---

### Regression

Include:

* LinearRegression
* Ridge
* Lasso
* ElasticNet
* SGDRegressor
* HuberRegressor
* RANSACRegressor
* DecisionTreeRegressor
* RandomForestRegressor
* ExtraTreesRegressor
* HistGradientBoostingRegressor
* AdaBoostRegressor
* BaggingRegressor
* SVR
* KNeighborsRegressor
* DummyRegressor

---

### Clustering

Include:

* KMeans
* MiniBatchKMeans
* DBSCAN
* OPTICS
* AgglomerativeClustering
* Birch
* SpectralClustering

---

# Mandatory Engineering Workflows

Include practical syntax for:

### Dataset

* load_* datasets
* fetch_openml
* make_classification
* make_regression

---

### Data Splitting

Include:

* train_test_split
* KFold
* StratifiedKFold
* GroupKFold
* TimeSeriesSplit
* ShuffleSplit
* StratifiedShuffleSplit
* RepeatedKFold

---

### Preprocessing

Include:

* StandardScaler
* MinMaxScaler
* RobustScaler
* MaxAbsScaler
* Normalizer
* QuantileTransformer
* PowerTransformer
* KBinsDiscretizer
* PolynomialFeatures
* OneHotEncoder
* OrdinalEncoder
* LabelEncoder
* FunctionTransformer
* Binarizer
* SimpleImputer

---

### Feature Engineering

Include:

* ColumnTransformer
* make_column_selector
* set_output
* get_feature_names_out

---

### Feature Selection

Include:

* SelectKBest
* SelectFromModel
* VarianceThreshold
* RFE
* RFECV
* mutual_info_classif
* mutual_info_regression

---

### Dimensionality Reduction

Include:

* PCA
* IncrementalPCA
* TruncatedSVD
* KernelPCA
* FastICA
* NMF

---

### Metrics

Include workflows for:

* accuracy
* balanced_accuracy
* precision
* recall
* f1
* roc_auc
* log_loss
* matthews_corrcoef
* cohen_kappa_score
* MAE
* MSE
* RMSE
* R²
* silhouette_score
* davies_bouldin_score
* calinski_harabasz_score

---

### Visualization Helpers

Include:

* ConfusionMatrixDisplay
* RocCurveDisplay
* PrecisionRecallDisplay
* CalibrationDisplay
* DecisionBoundaryDisplay

---

### Hyperparameter Search

Include:

* GridSearchCV
* RandomizedSearchCV
* HalvingGridSearchCV
* HalvingRandomSearchCV

---

### Cross Validation

Include:

* cross_val_score
* cross_validate
* cross_val_predict
* learning_curve
* validation_curve

---

### Inspection

Include:

* permutation_importance
* PartialDependenceDisplay

---

### Calibration

Include:

* CalibratedClassifierCV

---

### Pipelines

Include:

* Pipeline
* make_pipeline
* pipeline parameter naming (`clf__max_depth`)
* Pipeline(memory=...)
* FeatureUnion (briefly)

---

### Persistence

Include:

* joblib
* pickle
* skops (brief reference)

---

### Utilities

Include:

* clone
* check_is_fitted
* set_config
* config_context
* compute_class_weight

---

# Documentation Policy

Every engineering task **must** include:

* Exact official API documentation URL
* Never link to "Getting Started"
* Never link to module overview pages
* Never reuse unrelated URLs

Each URL must point directly to the primary API used in that task.

---

# Metadata Validation

Before writing metadata:

* Verify the package version exists.
* Never invent versions.
* Use the latest stable official release only.
* Ensure metadata and snippets use the same version.

---

# Engineering Tables

Generate compact reference tables for:

* Estimator Selection
* Estimator Capability Matrix
* Which estimators require feature scaling
* Which estimators support `predict_proba`
* Which estimators support sparse input
* Which estimators support missing values
* Common Scorers
* Cross-validation strategies
* Preprocessing transformer selection
* Feature selection methods
* Hyperparameter search comparison
* Pipeline parameter naming examples
* Common estimator parameters

---

# Quality Validation

Before returning the cheatsheet, verify:

* Approximately **90–100 engineering tasks**.
* No duplicated workflows.
* No invented APIs.
* No deprecated syntax.
* Every snippet is runnable.
* Every snippet uses modern APIs.
* Every task contains a direct official API link.
* Version metadata is valid.
* Coverage spans all major production modules.
* The cheatsheet represents **95–98% of daily Scikit-learn engineering work**, rather than attempting to document the entire library.
* The output is optimized for fast scanning, copy-paste usage, and long-term maintenance within the AENS Knowledge Layer.

---

## Framework-Specific Rules

- Emphasize production APIs over rarely used utilities.
- Prefer modern, stable APIs.
- Group similar APIs into a single engineering task.
- Avoid exhaustive API listings.
- Optimize for daily engineering work rather than complete API coverage.

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

@Academic

---
id: sklearn.cheatsheet
title: scikit-learn Cheatsheet
slug: scikit-learn-cheatsheet
package_reference: scikit-learn
package_version: 1.9.0
description: High-density quick-reference for common scikit-learn engineering tasks, syntax, and API recall.
official_sources:

- [scikit-learn API Reference](https://scikit-learn.org/stable/modules/classes.html)
- [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)
created_at: 2026-07-07T21:02:00+06:00
updated_at: 2026-07-07T21:02:00+06:00
***

# Engineering Workflow Index

## Setup

- Import package.
- Check version.
- Configure output and reproducibility.
- Clone estimators and check fitted state.


## Data and Datasets

- Load built-in datasets.
- Fetch OpenML datasets.
- Generate synthetic classification data.
- Generate synthetic regression data.


## Data Splitting

- Split train/test sets.
- Use k-fold and repeated CV.
- Use stratified, grouped, and time-series splits.
- Use shuffle-based splitters.


## Preprocessing

- Scale, normalize, bin, transform, and encode features.
- Impute missing values.
- Build polynomial features.
- Convert or binarize values.


## Feature Engineering

- Select columns by dtype.
- Combine heterogeneous transforms.
- Build pipelines with named steps.
- Export feature names.


## Feature Selection

- Filter features.
- Wrapper selection.
- Embedded selection.
- Mutual information ranking.


## Dimensionality Reduction

- Reduce dimensions with PCA-family methods.
- Decompose sparse or non-negative data.


## Classification

- Fit common classifiers.
- Predict labels and probabilities.
- Handle multi-class and multi-output cases.
- Calibrate probabilities.


## Regression

- Fit common regressors.
- Predict continuous targets.
- Handle multi-output regression.


## Clustering

- Run partitioning, density, hierarchical, and spectral clustering.
- Evaluate cluster quality.


## Evaluation

- Compute classification, regression, and clustering metrics.
- Plot confusion matrices, ROC, PR, calibration, and decision boundaries.


## Model Selection

- Cross-validate.
- Search hyperparameters.
- Inspect learning and validation curves.


## Inspection

- Measure permutation importance.
- Plot partial dependence.


## Pipelines and Composition

- Chain preprocessing and estimators.
- Tune nested parameters.
- Persist composite workflows.


## Persistence and Utilities

- Save and load models.
- Set global config.
- Compute class weights.
- Use dummy baselines.


# Core Objects

| Object | Main use |
| :-- | :-- |
| `Estimator` | Unified fit/predict API. |
| `Transformer` | `fit`, `transform`, `fit_transform`. |
| `Pipeline` | Sequential preprocessing + model. |
| `ColumnTransformer` | Different transforms per column set. |
| `GridSearchCV` | Exhaustive hyperparameter search. |
| `Cross-validator` | Split data for evaluation. |

# API Map

## `Pipeline`

Creation -  Fitting -  Prediction -  Parameter access -  Persistence -  Metadata routing

## `ColumnTransformer`

Column selection -  Parallel transforms -  Remainder handling -  Feature names -  Sparse/dense output

## `StandardScaler`

Fit -  Transform -  Inverse transform -  Sample weights -  Output control

## `OneHotEncoder`

Fit -  Transform -  Handle unknowns -  Sparse/dense output -  Feature names

## `PCA`

Fit -  Transform -  Inverse transform -  Dimensionality reduction -  Explained variance

## `GridSearchCV`

Fit -  Score -  Rank parameters -  Refitting -  Cross-validation results

## `KMeans`

Fit -  Predict -  Cluster centers -  Inertia -  Initialization

## `LogisticRegression`

Fit -  Predict -  Probabilities -  Decision function -  Coefficients

## `RandomForestClassifier`

Fit -  Predict -  Feature importance -  Trees -  Out-of-bag

## `RandomForestRegressor`

Fit -  Predict -  Feature importance -  Trees -  Out-of-bag

## `DummyClassifier`

Fit -  Predict -  Baselines -  Strategies -  Probability outputs

# Estimator Selection

| Need | Preferred estimators |
| :-- | :-- |
| Fast linear baseline | `LogisticRegression`, `Ridge`, `SGDClassifier`, `SGDRegressor` |
| Strong tabular default | `RandomForestClassifier`, `RandomForestRegressor`, `HistGradientBoostingClassifier`, `HistGradientBoostingRegressor` |
| Sparse high-dimensional text | `LinearSVC`, `SGDClassifier`, `MultinomialNB` |
| Small/medium nonlinear data | `SVC`, `KNeighborsClassifier`, `KNeighborsRegressor` |
| Interpretable tree rules | `DecisionTreeClassifier`, `DecisionTreeRegressor` |
| Clustering tabular data | `KMeans`, `MiniBatchKMeans`, `DBSCAN` |

# Capability Matrix

| Estimator | `predict_proba` | Sparse input | Missing values | Needs scaling |
| :-- | --: | --: | --: | --: |
| `LogisticRegression` | Yes | Yes | No | Yes |
| `LinearSVC` | No | Yes | No | Yes |
| `SVC` | Yes | Yes | No | Yes |
| `RandomForestClassifier` | Yes | Limited | Yes | No |
| `HistGradientBoostingClassifier` | Yes | No | Yes | No |
| `KNeighborsClassifier` | Yes | Limited | No | Yes |
| `GaussianNB` | Yes | No | No | Usually yes |
| `MultinomialNB` | Yes | Yes | No | No |
| `DummyClassifier` | Yes | Yes | Yes | No |

# Common Scorers

| Task | Metric function |
| :-- | :-- |
| Accuracy | `accuracy_score` |
| Balanced accuracy | `balanced_accuracy_score` |
| Precision | `precision_score` |
| Recall | `recall_score` |
| F1 | `f1_score` |
| ROC AUC | `roc_auc_score` |
| Log loss | `log_loss` |
| MCC | `matthews_corrcoef` |
| Cohen kappa | `cohen_kappa_score` |
| MAE | `mean_absolute_error` |
| MSE | `mean_squared_error` |
| RMSE | `mean_squared_error(..., squared=False)` |
| R² | `r2_score` |
| Silhouette | `silhouette_score` |
| Davies-Bouldin | `davies_bouldin_score` |
| Calinski-Harabasz | `calinski_harabasz_score` |

# Cross-Validation Strategies

| Splitter | Best for |
| :-- | :-- |
| `KFold` | General regression/classification. |
| `StratifiedKFold` | Classification with class balance. |
| `GroupKFold` | Grouped samples. |
| `TimeSeriesSplit` | Ordered temporal data. |
| `ShuffleSplit` | Repeated random splits. |
| `StratifiedShuffleSplit` | Stratified random splits. |
| `RepeatedKFold` | More stable CV estimates. |

# Preprocessing Transformer Selection

| Goal | Transformer |
| :-- | :-- |
| Standardize features | `StandardScaler` |
| Scale to [^1] | `MinMaxScaler` |
| Robust to outliers | `RobustScaler` |
| Preserve sparsity range | `MaxAbsScaler` |
| Normalize samples | `Normalizer` |
| Gaussianize distribution | `PowerTransformer`, `QuantileTransformer` |
| Discretize numeric values | `KBinsDiscretizer` |
| Create interactions | `PolynomialFeatures` |
| Encode categories | `OneHotEncoder`, `OrdinalEncoder` |
| Encode target labels | `LabelEncoder` |
| Custom transform | `FunctionTransformer` |
| Threshold values | `Binarizer` |
| Fill missing values | `SimpleImputer` |

# Feature Selection Methods

| Method | Best for |
| :-- | :-- |
| `VarianceThreshold` | Remove constant or near-constant features. |
| `SelectKBest` | Quick univariate filtering. |
| `RFE` | Wrapper selection with estimator ranking. |
| `RFECV` | Wrapper selection with CV. |
| `SelectFromModel` | Embedded feature selection. |
| `mutual_info_classif` | Nonlinear classification ranking. |
| `mutual_info_regression` | Nonlinear regression ranking. |

# Hyperparameter Search

| Search | Use when |
| :-- | :-- |
| `GridSearchCV` | Small search spaces. |
| `RandomizedSearchCV` | Large search spaces. |
| `HalvingGridSearchCV` | Resource-aware grid search. |
| `HalvingRandomSearchCV` | Resource-aware random search. |

# Pipeline Parameter Naming

| Pattern | Meaning |
| :-- | :-- |
| `clf__max_depth` | `max_depth` on step named `clf`. |
| `preprocess__num__scaler__with_mean` | Nested parameter in pipeline/column transformer. |
| `model__C` | `C` on final model step. |

# Common Estimator Parameters

| Parameter | Meaning |
| :-- | :-- |
| `random_state` | Reproducibility. |
| `max_iter` | Optimization limit. |
| `n_estimators` | Ensemble size. |
| `max_depth` | Tree depth cap. |
| `alpha` | Regularization strength or smoothing depending on estimator. |
| `C` | Inverse regularization strength. |
| `class_weight` | Class imbalance handling. |
| `n_jobs` | Parallel workers where supported. |

# Setup and Configuration

## Import scikit-learn

**Mental Trigger:** Start any scikit-learn script or notebook.

```python
import sklearn
from sklearn.linear_model import LogisticRegression

print(sklearn.__version__)
model = LogisticRegression()
```

**Quick Note:** Keep imports explicit for readability. Version checks help avoid silent API drift.

**Common Gotcha**

- **Issue:** Importing from stale examples.
- **Cause:** Mixing old module paths with the current release.
- **Quick Fix:** Verify against the current official API page.

**Official API:** [scikit-learn package](https://scikit-learn.org/stable/modules/classes.html)

## Configure global output

**Mental Trigger:** Standardize estimator display and dataframe output in one place.

```python
from sklearn import set_config, config_context
from sklearn.preprocessing import StandardScaler
import pandas as pd

set_config(transform_output="pandas")
X = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
scaled = StandardScaler().fit_transform(X)

with config_context(transform_output="default"):
    scaled_default = StandardScaler().fit_transform(X)
```

**Quick Note:** `set_config` changes global behavior. `config_context` scopes it temporarily.

**Common Gotcha**

- **Issue:** Unexpected output type.
- **Cause:** Global config changed earlier in the session.
- **Quick Fix:** Reset or use `config_context`.

**Official API:** [set_config](https://scikit-learn.org/stable/modules/generated/sklearn.set_config.html)

## Clone an estimator

**Mental Trigger:** Reuse an estimator structure without reusing fitted state.

```python
from sklearn.base import clone
from sklearn.linear_model import Ridge

est = Ridge(alpha=1.0)
copy_est = clone(est)
```

**Quick Note:** `clone` copies parameters only, not learned attributes.

**Common Gotcha**

- **Issue:** Accidentally reusing fitted state.
- **Cause:** Reassigning the same estimator object.
- **Quick Fix:** Clone before each independent fit.

**Official API:** [clone](https://scikit-learn.org/stable/modules/generated/sklearn.base.clone.html)

## Check fitted state

**Mental Trigger:** Guard against calling prediction before fitting.

```python
from sklearn.utils.validation import check_is_fitted
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
model = LogisticRegression(max_iter=200).fit(X, y)
check_is_fitted(model)
```

**Quick Note:** Use after `fit` in custom code or wrappers.

**Common Gotcha**

- **Issue:** Attribute error during prediction.
- **Cause:** Model was not fit or fit failed earlier.
- **Quick Fix:** Call `fit` first and validate trained state.

**Official API:** [check_is_fitted](https://scikit-learn.org/stable/modules/generated/sklearn.utils.validation.check_is_fitted.html)

# Data and Datasets

## Load built-in datasets

**Mental Trigger:** Need a small canonical dataset for experiments or demos.

```python
from sklearn.datasets import load_iris

data = load_iris(as_frame=True)
X = data.data
y = data.target
```

**Quick Note:** `as_frame=True` returns pandas objects. Most `load_*` functions follow the same pattern.

**Common Gotcha**

- **Issue:** Confusing target shape or names.
- **Cause:** Default return is not a DataFrame.
- **Quick Fix:** Use `as_frame=True` when you want labeled columns.

**Official API:** [load_iris](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_iris.html)

## Fetch OpenML dataset

**Mental Trigger:** Need a larger or community-standard benchmark dataset.

```python
from sklearn.datasets import fetch_openml

X, y = fetch_openml(name="adult", as_frame=True, return_X_y=True)
```

**Quick Note:** OpenML fetches remote datasets and may take time on first run.

**Common Gotcha**

- **Issue:** Slow first download.
- **Cause:** Remote dataset retrieval and caching.
- **Quick Fix:** Cache locally and reuse the cached copy.

**Official API:** [fetch_openml](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_openml.html)

## Generate synthetic classification data

**Mental Trigger:** Need controlled classification data for testing pipelines.

```python
from sklearn.datasets import make_classification

X, y = make_classification(
    n_samples=1000,
    n_features=20,
    n_informative=5,
    n_redundant=2,
    random_state=42,
)
```

**Quick Note:** Use `random_state` for reproducibility.

**Common Gotcha**

- **Issue:** Trivial or degenerate data.
- **Cause:** Bad class/feature settings.
- **Quick Fix:** Increase informative features or class separation.

**Official API:** [make_classification](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_classification.html)

## Generate synthetic regression data

**Mental Trigger:** Need controlled regression data for model checks.

```python
from sklearn.datasets import make_regression

X, y = make_regression(
    n_samples=1000,
    n_features=20,
    n_informative=5,
    noise=10.0,
    random_state=42,
)
```

**Quick Note:** `noise` makes the problem less perfectly linear.

**Common Gotcha**

- **Issue:** Unrealistically easy regression.
- **Cause:** Zero or tiny noise.
- **Quick Fix:** Add noise when testing realistic workflows.

**Official API:** [make_regression](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_regression.html)

# Data Splitting

## Split train and test sets

**Mental Trigger:** Need a holdout set for final evaluation.

```python
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True, as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
```

**Quick Note:** Use `stratify=y` for classification. Keep `random_state` fixed.

**Common Gotcha**

- **Issue:** Class imbalance in split.
- **Cause:** Random split without stratification.
- **Quick Fix:** Add `stratify=y` when classes matter.

**Official API:** [train_test_split](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)

## Use k-fold cross-validation

**Mental Trigger:** Need a standard CV splitter for model evaluation.

```python
from sklearn.model_selection import KFold

cv = KFold(n_splits=5, shuffle=True, random_state=42)
```

**Quick Note:** Shuffle only when sample order is not meaningful.

**Common Gotcha**

- **Issue:** Unstable fold results.
- **Cause:** No shuffling on ordered data.
- **Quick Fix:** Shuffle when order is arbitrary.

**Official API:** [KFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html)

## Use stratified k-fold cross-validation

**Mental Trigger:** Need class-balanced folds for classification.

```python
from sklearn.model_selection import StratifiedKFold

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
```

**Quick Note:** Prefer this for classification tasks.

**Common Gotcha**

- **Issue:** Fold class distribution drifts.
- **Cause:** Non-stratified splitter.
- **Quick Fix:** Use `StratifiedKFold` for classification.

**Official API:** [StratifiedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html)

## Use grouped cross-validation

**Mental Trigger:** Samples from the same subject/customer/device must stay together.

```python
from sklearn.model_selection import GroupKFold
import numpy as np

groups = np.array([1, 1, 2, 2, 3, 3])
cv = GroupKFold(n_splits=3)
```

**Quick Note:** Pass `groups` to `split` or to CV helpers that accept it.

**Common Gotcha**

- **Issue:** Leakage across groups.
- **Cause:** Group members split into different folds.
- **Quick Fix:** Use grouped splitters whenever group identity matters.

**Official API:** [GroupKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html)

## Use time-series splits

**Mental Trigger:** Need ordered validation for temporal data.

```python
from sklearn.model_selection import TimeSeriesSplit

cv = TimeSeriesSplit(n_splits=5)
```

**Quick Note:** This preserves order and avoids future-to-past leakage.

**Common Gotcha**

- **Issue:** Look-ahead bias.
- **Cause:** Random shuffling on temporal data.
- **Quick Fix:** Use time-aware splitters only.

**Official API:** [TimeSeriesSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html)

## Use shuffle-based splits

**Mental Trigger:** Need repeated random holdout evaluation.

```python
from sklearn.model_selection import ShuffleSplit

cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=42)
```

**Quick Note:** Good for quick variability checks.

**Common Gotcha**

- **Issue:** Overlapping test sets.
- **Cause:** Random repeated sampling.
- **Quick Fix:** Use a single holdout for strict separation.

**Official API:** [ShuffleSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.ShuffleSplit.html)

## Use stratified shuffle splits

**Mental Trigger:** Need repeated random splits with preserved class ratios.

```python
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
cv = StratifiedShuffleSplit(n_splits=5, test_size=0.2, random_state=42)
```

**Quick Note:** Useful for imbalanced classification benchmarking.

**Common Gotcha**

- **Issue:** Skewed class ratios in random splits.
- **Cause:** Plain shuffle split.
- **Quick Fix:** Stratify the split when target balance matters.

**Official API:** [StratifiedShuffleSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedShuffleSplit.html)

## Use repeated k-fold cross-validation

**Mental Trigger:** Need a more stable estimate than one CV run.

```python
from sklearn.model_selection import RepeatedKFold

cv = RepeatedKFold(n_splits=5, n_repeats=3, random_state=42)
```

**Quick Note:** Repeats reduce variance in score estimates.

**Common Gotcha**

- **Issue:** Too much evaluation cost.
- **Cause:** Many repeated fits.
- **Quick Fix:** Use fewer repeats for expensive models.

**Official API:** [RepeatedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RepeatedKFold.html)

# Preprocessing

## Standardize features

**Mental Trigger:** Model is sensitive to feature scale.

```python
from sklearn.preprocessing import StandardScaler
import numpy as np

X = np.array([[1.0, 10.0], [2.0, 20.0], [3.0, 30.0]])
X_scaled = StandardScaler().fit_transform(X)
```

**Quick Note:** Fit on training data only inside a pipeline.

**Common Gotcha**

- **Issue:** Data leakage.
- **Cause:** Fitting scaler on full dataset.
- **Quick Fix:** Fit scaler only on training folds.

**Official API:** [StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)

## Scale to a fixed range

**Mental Trigger:** Need bounded feature values.

```python
from sklearn.preprocessing import MinMaxScaler
import numpy as np

X = np.array([[1.0, 10.0], [2.0, 20.0], [3.0, 30.0]])
X_scaled = MinMaxScaler().fit_transform(X)
```

**Quick Note:** Preserves relative ordering within each feature.

**Common Gotcha**

- **Issue:** Outliers squash most values.
- **Cause:** Min-max scaling is range-sensitive.
- **Quick Fix:** Use `RobustScaler` if outliers are present.

**Official API:** [MinMaxScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html)

## Scale robustly with outliers

**Mental Trigger:** Data has heavy tails or extreme values.

```python
from sklearn.preprocessing import RobustScaler
import numpy as np

X = np.array([[1.0, 10.0], [2.0, 20.0], [100.0, 300.0]])
X_scaled = RobustScaler().fit_transform(X)
```

**Quick Note:** Uses median and IQR, not mean and variance.

**Common Gotcha**

- **Issue:** Overreacting to outliers with standard scaling.
- **Cause:** Mean/variance are outlier-sensitive.
- **Quick Fix:** Use `RobustScaler` for skewed or outlier-heavy data.

**Official API:** [RobustScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html)

## Preserve sparsity with max-abs scaling

**Mental Trigger:** Scale sparse features without densifying them.

```python
from sklearn.preprocessing import MaxAbsScaler
from scipy import sparse

X = sparse.csr_matrix([[0, 1], [2, 0], [0, 3]])
X_scaled = MaxAbsScaler().fit_transform(X)
```

**Quick Note:** Good for sparse matrices and signed data.

**Common Gotcha**

- **Issue:** Memory blow-up.
- **Cause:** Dense scaling on sparse matrices.
- **Quick Fix:** Use `MaxAbsScaler` for sparse input.

**Official API:** [MaxAbsScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html)

## Normalize samples

**Mental Trigger:** Need unit-length rows, often for text or similarity tasks.

```python
from sklearn.preprocessing import Normalizer
import numpy as np

X = np.array([[1.0, 2.0], [3.0, 4.0]])
X_norm = Normalizer().fit_transform(X)
```

**Quick Note:** Normalization acts row-wise, not feature-wise.

**Common Gotcha**

- **Issue:** Confusing normalization with standardization.
- **Cause:** Applying the wrong axis logic.
- **Quick Fix:** Use `Normalizer` for sample vectors, not column scaling.

**Official API:** [Normalizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html)

## Gaussianize skewed features

**Mental Trigger:** Numeric distributions are highly skewed.

```python
from sklearn.preprocessing import PowerTransformer
import numpy as np

X = np.array([[1.0, 10.0], [2.0, 20.0], [4.0, 40.0]])
X_trans = PowerTransformer().fit_transform(X)
```

**Quick Note:** Useful before linear models or distance-based models.

**Common Gotcha**

- **Issue:** Invalid transform on non-positive data with some methods.
- **Cause:** Method assumptions on input values.
- **Quick Fix:** Check method choice and data domain first.

**Official API:** [PowerTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PowerTransformer.html)

## Rank-gauss transform features

**Mental Trigger:** Need non-parametric distribution mapping.

```python
from sklearn.preprocessing import QuantileTransformer
import numpy as np

X = np.array([[1.0, 10.0], [2.0, 20.0], [3.0, 30.0]])
X_trans = QuantileTransformer(output_distribution="normal", random_state=42).fit_transform(X)
```

**Quick Note:** Can distort distances if used carelessly.

**Common Gotcha**

- **Issue:** Overfitting to small samples.
- **Cause:** Quantile mapping uses empirical ranks.
- **Quick Fix:** Use on sufficiently large datasets.

**Official API:** [QuantileTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.QuantileTransformer.html)

## Discretize numeric features

**Mental Trigger:** Need bins instead of raw continuous values.

```python
from sklearn.preprocessing import KBinsDiscretizer
import numpy as np

X = np.array([[1.0], [2.0], [3.0], [4.0]])
X_binned = KBinsDiscretizer(n_bins=3, encode="onehot-dense", strategy="quantile").fit_transform(X)
```

**Quick Note:** Useful for coarse bucketization or monotonic effects.

**Common Gotcha**

- **Issue:** Too many sparse empty bins.
- **Cause:** Wrong binning strategy.
- **Quick Fix:** Match strategy to data distribution.

**Official API:** [KBinsDiscretizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.KBinsDiscretizer.html)

## Create polynomial features

**Mental Trigger:** Need interaction terms for linear models.

```python
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

X = np.array([[1.0, 2.0], [3.0, 4.0]])
X_poly = PolynomialFeatures(degree=2, include_bias=False).fit_transform(X)
```

**Quick Note:** Feature count grows quickly with degree.

**Common Gotcha**

- **Issue:** Feature explosion.
- **Cause:** High degree or many input columns.
- **Quick Fix:** Keep degree low or use feature selection.

**Official API:** [PolynomialFeatures](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html)

## One-hot encode categories

**Mental Trigger:** Convert categorical input for linear or tree-based models.

```python
from sklearn.preprocessing import OneHotEncoder
import numpy as np

X = np.array([["red"], ["blue"], ["red"]])
enc = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
X_enc = enc.fit_transform(X)
```

**Quick Note:** `handle_unknown="ignore"` prevents runtime errors on new labels.

**Common Gotcha**

- **Issue:** Unseen categories crash inference.
- **Cause:** Default unknown-category behavior.
- **Quick Fix:** Set `handle_unknown="ignore"`.

**Official API:** [OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)

## Ordinal-encode categories

**Mental Trigger:** Need integer-coded categories with a defined order.

```python
from sklearn.preprocessing import OrdinalEncoder
import numpy as np

X = np.array([["low"], ["medium"], ["high"]])
enc = OrdinalEncoder(categories=[["low", "medium", "high"]])
X_enc = enc.fit_transform(X)
```

**Quick Note:** Use only when order is meaningful.

**Common Gotcha**

- **Issue:** Implied order where none exists.
- **Cause:** Treating nominal categories as ordinal.
- **Quick Fix:** Use `OneHotEncoder` for nominal features.

**Official API:** [OrdinalEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html)

## Label-encode targets

**Mental Trigger:** Convert class labels to integers for target arrays.

```python
from sklearn.preprocessing import LabelEncoder

y = ["spam", "ham", "spam"]
le = LabelEncoder()
y_enc = le.fit_transform(y)
```

**Quick Note:** Intended for targets, not feature columns.

**Common Gotcha**

- **Issue:** Misusing for feature encoding.
- **Cause:** `LabelEncoder` is target-oriented.
- **Quick Fix:** Use `OneHotEncoder` or `OrdinalEncoder` for features.

**Official API:** [LabelEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)

## Apply a custom function

**Mental Trigger:** Need a lightweight custom transform in a pipeline.

```python
from sklearn.preprocessing import FunctionTransformer
import numpy as np

def log1p_clip(X):
    return np.log1p(np.clip(X, a_min=0, a_max=None))

transformer = FunctionTransformer(log1p_clip)
X_out = transformer.fit_transform(np.array([[1.0, 2.0], [3.0, 4.0]]))
```

**Quick Note:** Good for small, stateless transformations.

**Common Gotcha**

- **Issue:** Pipeline incompatibility.
- **Cause:** Function changes shape unexpectedly.
- **Quick Fix:** Preserve sample count and feature alignment.

**Official API:** [FunctionTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.FunctionTransformer.html)

## Binarize values

**Mental Trigger:** Need hard thresholding for numeric data.

```python
from sklearn.preprocessing import Binarizer
import numpy as np

X = np.array([[0.2, 0.8], [1.5, -0.1]])
X_bin = Binarizer(threshold=0.5).fit_transform(X)
```

**Quick Note:** Applies an elementwise threshold.

**Common Gotcha**

- **Issue:** Threshold applied to wrong scale.
- **Cause:** Unscaled numeric inputs.
- **Quick Fix:** Choose threshold after checking feature ranges.

**Official API:** [Binarizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Binarizer.html)

## Impute missing values

**Mental Trigger:** Data contains NaN or missing categorical values.

```python
from sklearn.impute import SimpleImputer
import numpy as np

X = np.array([[1.0, np.nan], [2.0, 3.0], [np.nan, 4.0]])
imp = SimpleImputer(strategy="median")
X_imp = imp.fit_transform(X)
```

**Quick Note:** Fit imputers on training data only.

**Common Gotcha**

- **Issue:** Leakage through imputation.
- **Cause:** Computing statistics on full dataset.
- **Quick Fix:** Place imputer inside a pipeline.

**Official API:** [SimpleImputer](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html)

# Feature Engineering

## Select columns by type

**Mental Trigger:** Need automatic column routing in mixed-type tabular data.

```python
from sklearn.compose import make_column_selector
selector = make_column_selector(dtype_include="number")
```

**Quick Note:** Use with `ColumnTransformer` for robust tabular pipelines.

**Common Gotcha**

- **Issue:** Wrong columns selected.
- **Cause:** Mismatched dtypes.
- **Quick Fix:** Inspect dataframe dtypes before building the selector.

**Official API:** [make_column_selector](https://scikit-learn.org/stable/modules/generated/sklearn.compose.make_column_selector.html)

## Apply different transforms to columns

**Mental Trigger:** Numeric and categorical features need different preprocessing.

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import pandas as pd

X = pd.DataFrame({"age": [20, 30], "city": ["a", "b"]})
ct = ColumnTransformer(
    [
        ("num", StandardScaler(), ["age"]),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), ["city"]),
    ]
)
X_out = ct.fit_transform(X)
```

**Quick Note:** This is the standard tabular preprocessing pattern.

**Common Gotcha**

- **Issue:** Feature name confusion.
- **Cause:** Mixed output types and encoders.
- **Quick Fix:** Use `set_output` or `get_feature_names_out`.

**Official API:** [ColumnTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html)

## Control transformer output as pandas

**Mental Trigger:** Need DataFrame outputs with preserved names.

```python
from sklearn.preprocessing import StandardScaler
import pandas as pd

X = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
scaler = StandardScaler().set_output(transform="pandas")
X_out = scaler.fit_transform(X)
```

**Quick Note:** Works on many transformers and pipelines.

**Common Gotcha**

- **Issue:** Losing column names.
- **Cause:** Default NumPy output.
- **Quick Fix:** Call `set_output(transform="pandas")`.

**Official API:** [set_output](https://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.set_output.html)

## Get output feature names

**Mental Trigger:** Need transformed column names after preprocessing.

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import pandas as pd

X = pd.DataFrame({"age": [20, 30], "city": ["a", "b"]})
ct = ColumnTransformer(
    [
        ("num", StandardScaler(), ["age"]),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), ["city"]),
    ]
).fit(X)
names = ct.get_feature_names_out()
```

**Quick Note:** Helpful for debugging and downstream feature tracking.

**Common Gotcha**

- **Issue:** Name mismatches after encoding.
- **Cause:** Transformed features expand into multiple columns.
- **Quick Fix:** Inspect feature names after fitting.

**Official API:** [get_feature_names_out](https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.get_feature_names_out.html)

# Feature Selection

## Filter low-variance features

**Mental Trigger:** Need to remove constant or near-constant columns.

```python
from sklearn.feature_selection import VarianceThreshold
import numpy as np

X = np.array([[1, 0], [1, 1], [1, 2]])
X_sel = VarianceThreshold(threshold=0.0).fit_transform(X)
```

**Quick Note:** Fast unsupervised filter before modeling.

**Common Gotcha**

- **Issue:** Removing too many sparse indicators.
- **Cause:** Threshold too aggressive.
- **Quick Fix:** Start with `threshold=0.0`.

**Official API:** [VarianceThreshold](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.VarianceThreshold.html)

## Select top-k features

**Mental Trigger:** Need a quick univariate feature filter.

```python
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
X_sel = SelectKBest(mutual_info_classif, k=2).fit_transform(X, y)
```

**Quick Note:** Useful for rough ranking before a stronger model.

**Common Gotcha**

- **Issue:** Wrong scoring function for target type.
- **Cause:** Mixing classification and regression criteria.
- **Quick Fix:** Use `mutual_info_classif` or `mutual_info_regression` appropriately.

**Official API:** [SelectKBest](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectKBest.html)

## Select features with a model

**Mental Trigger:** Need embedded feature selection from trained coefficients or importances.

```python
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
sel = SelectFromModel(LogisticRegression(max_iter=200)).fit(X, y)
X_sel = sel.transform(X)
```

**Quick Note:** Works well with sparse or linear models.

**Common Gotcha**

- **Issue:** No features selected.
- **Cause:** Threshold too strict.
- **Quick Fix:** Lower the threshold or use a stronger estimator.

**Official API:** [SelectFromModel](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectFromModel.html)

## Recursive feature elimination

**Mental Trigger:** Need wrapper-based feature ranking.

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
rfe = RFE(LogisticRegression(max_iter=200), n_features_to_select=2)
X_sel = rfe.fit_transform(X, y)
```

**Quick Note:** Iteratively removes the weakest features.

**Common Gotcha**

- **Issue:** Slow runtime.
- **Cause:** Repeated refits.
- **Quick Fix:** Use on small/medium feature sets only.

**Official API:** [RFE](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.RFE.html)

## Recursive feature elimination with CV

**Mental Trigger:** Need CV-backed feature count selection.

```python
from sklearn.feature_selection import RFECV
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
from sklearn.model_selection import StratifiedKFold

X, y = load_iris(return_X_y=True)
cv = StratifiedKFold(5, shuffle=True, random_state=42)
rfecv = RFECV(LogisticRegression(max_iter=200), cv=cv)
X_sel = rfecv.fit_transform(X, y)
```

**Quick Note:** More expensive than `RFE`, but more defensible.

**Common Gotcha**

- **Issue:** Long training times.
- **Cause:** Nested repeated fitting.
- **Quick Fix:** Reduce folds or feature count.

**Official API:** [RFECV](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.RFECV.html)

# Dimensionality Reduction

## Run PCA

**Mental Trigger:** Need orthogonal compression of dense numeric data.

```python
from sklearn.decomposition import PCA
import numpy as np

X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
X_pca = PCA(n_components=1, random_state=42).fit_transform(X)
```

**Quick Note:** Standard choice for dense, centered numeric matrices.

**Common Gotcha**

- **Issue:** Poor results on unscaled features.
- **Cause:** Large-magnitude columns dominate variance.
- **Quick Fix:** Scale before PCA when units differ.

**Official API:** [PCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html)

## Run incremental PCA

**Mental Trigger:** Need PCA-style reduction on larger datasets.

```python
from sklearn.decomposition import IncrementalPCA
import numpy as np

X = np.random.RandomState(42).randn(100, 10)
ipca = IncrementalPCA(n_components=3, batch_size=20)
X_red = ipca.fit_transform(X)
```

**Quick Note:** Processes data in chunks.

**Common Gotcha**

- **Issue:** Batch-size instability.
- **Cause:** Too-small chunks.
- **Quick Fix:** Use a reasonable batch size.

**Official API:** [IncrementalPCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.IncrementalPCA.html)

## Run truncated SVD

**Mental Trigger:** Need low-rank reduction on sparse text-like matrices.

```python
from sklearn.decomposition import TruncatedSVD
from scipy import sparse
import numpy as np

X = sparse.csr_matrix(np.array([[1, 0, 2], [0, 1, 0], [3, 0, 1]]))
X_red = TruncatedSVD(n_components=2, random_state=42).fit_transform(X)
```

**Quick Note:** Works without centering sparse input.

**Common Gotcha**

- **Issue:** Densifying sparse matrices.
- **Cause:** Using PCA where SVD is needed.
- **Quick Fix:** Prefer `TruncatedSVD` for sparse matrices.

**Official API:** [TruncatedSVD](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html)

## Run kernel PCA

**Mental Trigger:** Need nonlinear dimensionality reduction.

```python
from sklearn.decomposition import KernelPCA
import numpy as np

X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
X_kpca = KernelPCA(n_components=1, kernel="rbf", gamma=0.1).fit_transform(X)
```

**Quick Note:** Useful for nonlinear manifolds on small data.

**Common Gotcha**

- **Issue:** Slow scaling.
- **Cause:** Kernel methods scale poorly with sample count.
- **Quick Fix:** Use on smaller datasets.

**Official API:** [KernelPCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.KernelPCA.html)

## Run ICA

**Mental Trigger:** Need latent source separation.

```python
from sklearn.decomposition import FastICA
import numpy as np

X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
X_ica = FastICA(n_components=1, random_state=42).fit_transform(X)
```

**Quick Note:** Best when components are statistically independent.

**Common Gotcha**

- **Issue:** Instability across runs.
- **Cause:** Random initialization.
- **Quick Fix:** Set `random_state`.

**Official API:** [FastICA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.FastICA.html)

## Run NMF

**Mental Trigger:** Need additive parts-based decomposition on non-negative data.

```python
from sklearn.decomposition import NMF
import numpy as np

X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
X_nmf = NMF(n_components=1, init="nndsvda", random_state=42).fit_transform(X)
```

**Quick Note:** Input must be non-negative.

**Common Gotcha**

- **Issue:** Negative input errors or poor convergence.
- **Cause:** Data violates NMF constraints.
- **Quick Fix:** Shift or transform data to non-negative values.

**Official API:** [NMF](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.NMF.html)

# Classification

## Fit logistic regression

**Mental Trigger:** Need a fast, interpretable linear classifier.

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=200).fit(X, y)
y_pred = clf.predict(X)
```

**Quick Note:** Often a strong baseline for tabular classification.

**Common Gotcha**

- **Issue:** Convergence warnings.
- **Cause:** Insufficient iterations or unscaled inputs.
- **Quick Fix:** Scale features and raise `max_iter`.

**Official API:** [LogisticRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)

## Fit SGD classifier

**Mental Trigger:** Need scalable linear classification on large sparse data.

```python
from sklearn.linear_model import SGDClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = SGDClassifier(loss="log_loss", random_state=42).fit(X, y)
```

**Quick Note:** Good for large or streaming-style workloads.

**Common Gotcha**

- **Issue:** Sensitive to feature scaling.
- **Cause:** Gradient-based optimization.
- **Quick Fix:** Scale input features.

**Official API:** [SGDClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDClassifier.html)

## Fit passive-aggressive classifier

**Mental Trigger:** Need online-style linear classification with fast updates.

```python
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = PassiveAggressiveClassifier(random_state=42).fit(X, y)
```

**Quick Note:** Useful for large sparse problems.

**Common Gotcha**

- **Issue:** Unstable performance.
- **Cause:** Aggressive online updates.
- **Quick Fix:** Scale features and tune regularization.

**Official API:** [PassiveAggressiveClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.PassiveAggressiveClassifier.html)

## Fit a decision tree classifier

**Mental Trigger:** Need interpretable rules and nonlinear splits.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = DecisionTreeClassifier(random_state=42).fit(X, y)
```

**Quick Note:** Easy to inspect, easy to overfit.

**Common Gotcha**

- **Issue:** Deep overfitting.
- **Cause:** Unrestricted tree growth.
- **Quick Fix:** Set `max_depth`, `min_samples_leaf`, or prune.

**Official API:** [DecisionTreeClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html)

## Fit a random forest classifier

**Mental Trigger:** Need a robust default classifier for tabular data.

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = RandomForestClassifier(n_estimators=200, random_state=42).fit(X, y)
```

**Quick Note:** Strong general-purpose model with feature importance.

**Common Gotcha**

- **Issue:** Slow training on large forests.
- **Cause:** Many trees with deep splits.
- **Quick Fix:** Reduce tree count or depth.

**Official API:** [RandomForestClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)

## Fit an extra-trees classifier

**Mental Trigger:** Need a high-variance, often strong tree ensemble.

```python
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = ExtraTreesClassifier(n_estimators=200, random_state=42).fit(X, y)
```

**Quick Note:** Often faster than random forests on some tabular data.

**Common Gotcha**

- **Issue:** Less interpretability.
- **Cause:** More randomized splits.
- **Quick Fix:** Use feature importance or simpler models for explanations.

**Official API:** [ExtraTreesClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html)

## Fit a histogram gradient boosting classifier

**Mental Trigger:** Need a strong modern gradient-boosted tabular classifier.

```python
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = HistGradientBoostingClassifier(random_state=42).fit(X, y)
```

**Quick Note:** Good default for many structured-data classification tasks.

**Common Gotcha**

- **Issue:** Unexpected missing-value behavior assumptions.
- **Cause:** Different trees handle NaNs differently.
- **Quick Fix:** Verify estimator-specific missing-value support.

**Official API:** [HistGradientBoostingClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingClassifier.html)

## Fit an AdaBoost classifier

**Mental Trigger:** Need boosting with simple weak learners.

```python
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),
    n_estimators=100,
    random_state=42,
).fit(X, y)
```

**Quick Note:** Often paired with shallow trees.

**Common Gotcha**

- **Issue:** Weak improvement over baseline.
- **Cause:** Weak learner too weak or noisy data.
- **Quick Fix:** Tune base estimator and learning rate.

**Official API:** [AdaBoostClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostClassifier.html)

## Fit a bagging classifier

**Mental Trigger:** Need bootstrap aggregation around a base estimator.

```python
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=20,
    random_state=42,
).fit(X, y)
```

**Quick Note:** Reduces variance of unstable learners.

**Common Gotcha**

- **Issue:** Slow if the base estimator is already expensive.
- **Cause:** Many repeated fits.
- **Quick Fix:** Use a cheaper base estimator or fewer bags.

**Official API:** [BaggingClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.BaggingClassifier.html)

## Fit a voting classifier

**Mental Trigger:** Need to combine multiple trained classifiers.

```python
from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = VotingClassifier(
    estimators=[
        ("lr", LogisticRegression(max_iter=200)),
        ("dt", DecisionTreeClassifier(random_state=42)),
    ],
    voting="soft",
).fit(X, y)
```

**Quick Note:** Soft voting needs probability-supporting estimators.

**Common Gotcha**

- **Issue:** Soft voting fails to work as expected.
- **Cause:** A member estimator lacks `predict_proba`.
- **Quick Fix:** Use compatible estimators or hard voting.

**Official API:** [VotingClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.VotingClassifier.html)

## Fit a stacking classifier

**Mental Trigger:** Need a meta-model over multiple base classifiers.

```python
from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = StackingClassifier(
    estimators=[
        ("lr", LogisticRegression(max_iter=200)),
        ("dt", DecisionTreeClassifier(random_state=42)),
    ],
    final_estimator=LogisticRegression(max_iter=200),
).fit(X, y)
```

**Quick Note:** Stacking usually benefits from out-of-fold training.

**Common Gotcha**

- **Issue:** Leakage in meta-features.
- **Cause:** Improper stacking setup.
- **Quick Fix:** Use the built-in stacking estimator.

**Official API:** [StackingClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.StackingClassifier.html)

## Fit an SVC

**Mental Trigger:** Need a kernelized classifier for smaller datasets.

```python
from sklearn.svm import SVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = SVC(probability=True, random_state=42).fit(X, y)
```

**Quick Note:** Often powerful but slower on large datasets.

**Common Gotcha**

- **Issue:** Slow training.
- **Cause:** Kernel methods scale poorly.
- **Quick Fix:** Use linear models for large data.

**Official API:** [SVC](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html)

## Fit a linear SVC

**Mental Trigger:** Need a fast linear margin classifier.

```python
from sklearn.svm import LinearSVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LinearSVC(random_state=42).fit(X, y)
```

**Quick Note:** Good for large sparse data.

**Common Gotcha**

- **Issue:** No probability output.
- **Cause:** LinearSVC does not expose `predict_proba`.
- **Quick Fix:** Use calibration if probabilities are needed.

**Official API:** [LinearSVC](https://scikit-learn.org/stable/modules/generated/sklearn.svm.LinearSVC.html)

## Fit a k-nearest neighbors classifier

**Mental Trigger:** Need a simple similarity-based classifier.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = KNeighborsClassifier(n_neighbors=5).fit(X, y)
```

**Quick Note:** Sensitive to feature scaling.

**Common Gotcha**

- **Issue:** Poor accuracy on unscaled data.
- **Cause:** Distance calculations are scale-dependent.
- **Quick Fix:** Scale features first.

**Official API:** [KNeighborsClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html)

## Fit Gaussian Naive Bayes

**Mental Trigger:** Need a fast probabilistic baseline for continuous features.

```python
from sklearn.naive_bayes import GaussianNB
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = GaussianNB().fit(X, y)
```

**Quick Note:** Strong baseline when class-conditional Gaussianity is reasonable.

**Common Gotcha**

- **Issue:** Poor calibration or unrealistic assumptions.
- **Cause:** Feature independence and Gaussian assumptions.
- **Quick Fix:** Compare against a discriminative baseline.

**Official API:** [GaussianNB](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html)

## Fit multinomial Naive Bayes

**Mental Trigger:** Need a sparse count-based classifier for text-like data.

```python
from sklearn.naive_bayes import MultinomialNB
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = MultinomialNB().fit(X, y)
```

**Quick Note:** Best on non-negative counts or frequencies.

**Common Gotcha**

- **Issue:** Invalid input domain.
- **Cause:** Negative feature values.
- **Quick Fix:** Use count/frequency features or another model.

**Official API:** [MultinomialNB](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html)

## Fit an MLP classifier

**Mental Trigger:** Need a flexible neural baseline inside scikit-learn.

```python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = MLPClassifier(hidden_layer_sizes=(50,), max_iter=500, random_state=42).fit(X, y)
```

**Quick Note:** Scale features before training.

**Common Gotcha**

- **Issue:** Convergence problems.
- **Cause:** Unscaled inputs or low iteration cap.
- **Quick Fix:** Standardize features and increase `max_iter`.

**Official API:** [MLPClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html)

## Use a dummy classifier

**Mental Trigger:** Need a baseline for comparison.

```python
from sklearn.dummy import DummyClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = DummyClassifier(strategy="most_frequent", random_state=42).fit(X, y)
```

**Quick Note:** Always compare real models against a trivial baseline.

**Common Gotcha**

- **Issue:** Misreading a baseline as a useful model.
- **Cause:** Baseline scores can look acceptable on skewed data.
- **Quick Fix:** Treat as a floor, not a solution.

**Official API:** [DummyClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html)

## Calibrate classifier probabilities

**Mental Trigger:** Need better probability estimates from a classifier.

```python
from sklearn.calibration import CalibratedClassifierCV
from sklearn.svm import LinearSVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = CalibratedClassifierCV(LinearSVC(random_state=42)).fit(X, y)
```

**Quick Note:** Useful when the base classifier lacks good probabilities.

**Common Gotcha**

- **Issue:** Overconfident probabilities.
- **Cause:** Raw decision scores are not calibrated.
- **Quick Fix:** Calibrate on held-out folds.

**Official API:** [CalibratedClassifierCV](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibratedClassifierCV.html)

# Regression

## Fit linear regression

**Mental Trigger:** Need a simple continuous baseline.

```python
from sklearn.linear_model import LinearRegression
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = LinearRegression().fit(X, y)
```

**Quick Note:** Good for linear relationships and quick baselines.

**Common Gotcha**

- **Issue:** Poor fit on nonlinear data.
- **Cause:** Linear functional form.
- **Quick Fix:** Try transformed features or nonlinear models.

**Official API:** [LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)

## Fit ridge regression

**Mental Trigger:** Need regularized linear regression.

```python
from sklearn.linear_model import Ridge
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = Ridge(alpha=1.0).fit(X, y)
```

**Quick Note:** Good default when multicollinearity exists.

**Common Gotcha**

- **Issue:** Underfitting.
- **Cause:** Regularization too strong.
- **Quick Fix:** Lower `alpha`.

**Official API:** [Ridge](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)

## Fit lasso regression

**Mental Trigger:** Need sparse linear regression with feature selection.

```python
from sklearn.linear_model import Lasso
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = Lasso(alpha=0.1, max_iter=5000).fit(X, y)
```

**Quick Note:** Can drive coefficients to zero.

**Common Gotcha**

- **Issue:** Non-convergence.
- **Cause:** Too few iterations or poorly scaled data.
- **Quick Fix:** Scale features and increase `max_iter`.

**Official API:** [Lasso](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html)

## Fit elastic net regression

**Mental Trigger:** Need a blend of ridge and lasso.

```python
from sklearn.linear_model import ElasticNet
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = ElasticNet(alpha=0.1, l1_ratio=0.5, max_iter=5000).fit(X, y)
```

**Quick Note:** Useful when correlated predictors matter.

**Common Gotcha**

- **Issue:** Weak feature sparsity or fit.
- **Cause:** Poor alpha/L1 balance.
- **Quick Fix:** Tune `alpha` and `l1_ratio`.

**Official API:** [ElasticNet](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html)

## Fit SGD regressor

**Mental Trigger:** Need scalable regression on large data.

```python
from sklearn.linear_model import SGDRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = SGDRegressor(random_state=42, max_iter=1000, tol=1e-3).fit(X, y)
```

**Quick Note:** Good for large and sparse regression tasks.

**Common Gotcha**

- **Issue:** Noisy convergence.
- **Cause:** Step sizes and scaling.
- **Quick Fix:** Scale features and tune learning settings.

**Official API:** [SGDRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDRegressor.html)

## Fit huber regression

**Mental Trigger:** Need robust linear regression with outliers.

```python
from sklearn.linear_model import HuberRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = HuberRegressor().fit(X, y)
```

**Quick Note:** More robust than ordinary least squares.

**Common Gotcha**

- **Issue:** Slow convergence on unscaled data.
- **Cause:** Gradient optimization sensitivity.
- **Quick Fix:** Scale features first.

**Official API:** [HuberRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.HuberRegressor.html)

## Fit RANSAC regression

**Mental Trigger:** Need a robust model in the presence of outliers.

```python
from sklearn.linear_model import RANSACRegressor, LinearRegression
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = RANSACRegressor(estimator=LinearRegression(), random_state=42).fit(X, y)
```

**Quick Note:** Uses repeated sampling to ignore outliers.

**Common Gotcha**

- **Issue:** Unstable results.
- **Cause:** Random sampling behavior.
- **Quick Fix:** Set `random_state`.

**Official API:** [RANSACRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.RANSACRegressor.html)

## Fit a decision tree regressor

**Mental Trigger:** Need an interpretable nonlinear regressor.

```python
from sklearn.tree import DecisionTreeRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = DecisionTreeRegressor(random_state=42).fit(X, y)
```

**Quick Note:** Easy to overfit, but simple to explain.

**Common Gotcha**

- **Issue:** Highly variable predictions.
- **Cause:** Deep tree growth.
- **Quick Fix:** Regularize tree depth or leaf size.

**Official API:** [DecisionTreeRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html)

## Fit a random forest regressor

**Mental Trigger:** Need a strong general-purpose tabular regressor.

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = RandomForestRegressor(n_estimators=200, random_state=42).fit(X, y)
```

**Quick Note:** Strong baseline for nonlinear tabular regression.

**Common Gotcha**

- **Issue:** Large memory use.
- **Cause:** Many deep trees.
- **Quick Fix:** Reduce `n_estimators` or tree depth.

**Official API:** [RandomForestRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html)

## Fit an extra-trees regressor

**Mental Trigger:** Need a randomized ensemble regressor.

```python
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = ExtraTreesRegressor(n_estimators=200, random_state=42).fit(X, y)
```

**Quick Note:** Often a good high-variance ensemble baseline.

**Common Gotcha**

- **Issue:** Less stable feature importances.
- **Cause:** Stronger randomness.
- **Quick Fix:** Use repeated evaluation.

**Official API:** [ExtraTreesRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesRegressor.html)

## Fit a histogram gradient boosting regressor

**Mental Trigger:** Need a modern boosted tree regressor.

```python
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = HistGradientBoostingRegressor(random_state=42).fit(X, y)
```

**Quick Note:** Strong on structured data.

**Common Gotcha**

- **Issue:** Performance depends on good hyperparameters.
- **Cause:** Boosted trees are sensitive to tuning.
- **Quick Fix:** Tune depth, learning rate, and iterations.

**Official API:** [HistGradientBoostingRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingRegressor.html)

## Fit an AdaBoost regressor

**Mental Trigger:** Need boosting for regression with weak base learners.

```python
from sklearn.ensemble import AdaBoostRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = AdaBoostRegressor(
    estimator=DecisionTreeRegressor(max_depth=3),
    n_estimators=100,
    random_state=42,
).fit(X, y)
```

**Quick Note:** Pair with shallow trees for common use.

**Common Gotcha**

- **Issue:** Marginal gains over simpler models.
- **Cause:** Weak learner mismatch.
- **Quick Fix:** Tune the base estimator carefully.

**Official API:** [AdaBoostRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostRegressor.html)

## Fit a bagging regressor

**Mental Trigger:** Need variance reduction for an unstable regressor.

```python
from sklearn.ensemble import BaggingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = BaggingRegressor(
    estimator=DecisionTreeRegressor(),
    n_estimators=20,
    random_state=42,
).fit(X, y)
```

**Quick Note:** Helps stabilize noisy base regressors.

**Common Gotcha**

- **Issue:** Expensive repeated fitting.
- **Cause:** Large ensemble size.
- **Quick Fix:** Reduce bags or choose a cheaper base estimator.

**Official API:** [BaggingRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.BaggingRegressor.html)

## Fit SVR

**Mental Trigger:** Need kernel regression on small/medium datasets.

```python
from sklearn.svm import SVR
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = SVR().fit(X, y)
```

**Quick Note:** Kernel choice strongly affects behavior.

**Common Gotcha**

- **Issue:** Slow on large datasets.
- **Cause:** Kernel scaling limits.
- **Quick Fix:** Use linear or tree-based models on large data.

**Official API:** [SVR](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html)

## Fit k-nearest neighbors regressor

**Mental Trigger:** Need a local similarity-based regressor.

```python
from sklearn.neighbors import KNeighborsRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = KNeighborsRegressor(n_neighbors=5).fit(X, y)
```

**Quick Note:** Sensitive to scaling and feature relevance.

**Common Gotcha**

- **Issue:** Poor performance on mixed-scale data.
- **Cause:** Euclidean distances dominate.
- **Quick Fix:** Standardize features first.

**Official API:** [KNeighborsRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html)

## Use a dummy regressor

**Mental Trigger:** Need a regression baseline.

```python
from sklearn.dummy import DummyRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = DummyRegressor(strategy="mean").fit(X, y)
```

**Quick Note:** Baseline for MAE, MSE, and R² comparisons.

**Common Gotcha**

- **Issue:** Baseline mistaken for actual predictive power.
- **Cause:** Strong mean target structure.
- **Quick Fix:** Compare against domain-appropriate metrics.

**Official API:** [DummyRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyRegressor.html)

# Clustering

## Fit KMeans

**Mental Trigger:** Need centroid-based clustering.

```python
from sklearn.cluster import KMeans
import numpy as np

X = np.array([[1, 2], [1, 4], [5, 8], [8, 8]])
labels = KMeans(n_clusters=2, random_state=42, n_init="auto").fit_predict(X)
```

**Quick Note:** Scale features before distance-based clustering.

**Common Gotcha**

- **Issue:** Poor clusters due to feature scale.
- **Cause:** Distances dominated by large-range features.
- **Quick Fix:** Standardize input first.

**Official API:** [KMeans](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)

## Fit MiniBatchKMeans

**Mental Trigger:** Need scalable KMeans for large datasets.

```python
from sklearn.cluster import MiniBatchKMeans
import numpy as np

X = np.random.RandomState(42).randn(1000, 10)
labels = MiniBatchKMeans(n_clusters=3, random_state=42).fit_predict(X)
```

**Quick Note:** Faster and lighter than full KMeans.

**Common Gotcha**

- **Issue:** Slightly lower cluster quality.
- **Cause:** Mini-batch approximation.
- **Quick Fix:** Use for speed, not exactness.

**Official API:** [MiniBatchKMeans](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.MiniBatchKMeans.html)

## Fit DBSCAN

**Mental Trigger:** Need density-based clustering with noise handling.

```python
from sklearn.cluster import DBSCAN
import numpy as np

X = np.array([[1, 2], [1, 2.1], [10, 10], [10.1, 10]])
labels = DBSCAN(eps=0.5, min_samples=2).fit_predict(X)
```

**Quick Note:** Does not require a preset cluster count.

**Common Gotcha**

- **Issue:** All points become noise or one cluster.
- **Cause:** Poor `eps` choice.
- **Quick Fix:** Tune `eps` with scaled features.

**Official API:** [DBSCAN](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html)

## Fit OPTICS

**Mental Trigger:** Need density clustering with varying density.

```python
from sklearn.cluster import OPTICS
import numpy as np

X = np.array([[1, 2], [1, 2.1], [10, 10], [10.1, 10]])
labels = OPTICS(min_samples=2).fit_predict(X)
```

**Quick Note:** More flexible than DBSCAN in some settings.

**Common Gotcha**

- **Issue:** Hard-to-interpret outputs.
- **Cause:** Density-based clustering complexity.
- **Quick Fix:** Inspect reachability and labels carefully.

**Official API:** [OPTICS](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.OPTICS.html)

## Fit agglomerative clustering

**Mental Trigger:** Need hierarchical clustering.

```python
from sklearn.cluster import AgglomerativeClustering
import numpy as np

X = np.array([[1, 2], [1, 4], [5, 8], [8, 8]])
labels = AgglomerativeClustering(n_clusters=2).fit_predict(X)
```

**Quick Note:** Good when hierarchy matters.

**Common Gotcha**

- **Issue:** Omitted distance scaling causes poor merges.
- **Cause:** Raw feature distances dominate.
- **Quick Fix:** Standardize features first.

**Official API:** [AgglomerativeClustering](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html)

## Fit Birch

**Mental Trigger:** Need incremental clustering on larger data.

```python
from sklearn.cluster import Birch
import numpy as np

X = np.random.RandomState(42).randn(100, 2)
labels = Birch(n_clusters=3).fit_predict(X)
```

**Quick Note:** Can be useful for large-scale clustering.

**Common Gotcha**

- **Issue:** Sensitive to threshold settings.
- **Cause:** Tree branching depends on compactness criteria.
- **Quick Fix:** Tune `threshold` and `branching_factor`.

**Official API:** [Birch](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.Birch.html)

## Fit spectral clustering

**Mental Trigger:** Need graph-based clustering for non-convex structures.

```python
from sklearn.cluster import SpectralClustering
import numpy as np

X = np.array([[1, 2], [1, 4], [5, 8], [8, 8]])
labels = SpectralClustering(n_clusters=2, random_state=42, affinity="nearest_neighbors").fit_predict(X)
```

**Quick Note:** Better for complex cluster shapes, slower than KMeans.

**Common Gotcha**

- **Issue:** Poor scaling on large sample counts.
- **Cause:** Graph construction and eigendecomposition cost.
- **Quick Fix:** Use on smaller datasets.

**Official API:** [SpectralClustering](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.SpectralClustering.html)

# Model Evaluation

## Compute classification metrics

**Mental Trigger:** Need a standard classification score set.

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

y_true = [0, 1, 1, 0]
y_pred = [0, 1, 0, 0]
acc = accuracy_score(y_true, y_pred)
prec = precision_score(y_true, y_pred)
rec = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)
```

**Quick Note:** Choose averaging carefully for multiclass or multilabel problems.

**Common Gotcha**

- **Issue:** Metric errors on multiclass data.
- **Cause:** Default binary averaging.
- **Quick Fix:** Set `average=` explicitly.

**Official API:** [accuracy_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)

## Compute balanced classification scores

**Mental Trigger:** Need metrics robust to class imbalance.

```python
from sklearn.metrics import balanced_accuracy_score, matthews_corrcoef, cohen_kappa_score

y_true = [0, 1, 1, 0]
y_pred = [0, 1, 0, 0]
bal_acc = balanced_accuracy_score(y_true, y_pred)
mcc = matthews_corrcoef(y_true, y_pred)
kappa = cohen_kappa_score(y_true, y_pred)
```

**Quick Note:** Useful when raw accuracy is misleading.

**Common Gotcha**

- **Issue:** Imbalanced classes hide poor minority performance.
- **Cause:** Accuracy overweights the majority class.
- **Quick Fix:** Use imbalance-aware metrics.

**Official API:** [balanced_accuracy_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html)

## Compute probability-based metrics

**Mental Trigger:** Need ROC AUC or log loss from predicted probabilities.

```python
from sklearn.metrics import roc_auc_score, log_loss

y_true = [0, 1, 1, 0]
y_prob = [0.1, 0.9, 0.7, 0.2]
auc = roc_auc_score(y_true, y_prob)
loss = log_loss(y_true, y_prob)
```

**Quick Note:** Use probabilities, not labels, for these metrics.

**Common Gotcha**

- **Issue:** Wrong input format.
- **Cause:** Passing labels into probability metrics.
- **Quick Fix:** Use `predict_proba` outputs.

**Official API:** [roc_auc_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html)

## Compute regression metrics

**Mental Trigger:** Need standard regression evaluation.

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

y_true = [3.0, 2.0, 5.0]
y_pred = [2.5, 2.0, 4.0]
mae = mean_absolute_error(y_true, y_pred)
mse = mean_squared_error(y_true, y_pred)
rmse = mean_squared_error(y_true, y_pred, squared=False)
r2 = r2_score(y_true, y_pred)
```

**Quick Note:** RMSE is just MSE with `squared=False`.

**Common Gotcha**

- **Issue:** Comparing metrics across incompatible scales.
- **Cause:** Target units not standardized.
- **Quick Fix:** Interpret regression metrics in domain units.

**Official API:** [mean_absolute_error](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)

## Compute clustering metrics

**Mental Trigger:** Need intrinsic cluster quality scores.

```python
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
import numpy as np

X = np.array([[1, 2], [1, 4], [5, 8], [8, 8]])
labels = np.array([0, 0, 1, 1])
sil = silhouette_score(X, labels)
db = davies_bouldin_score(X, labels)
ch = calinski_harabasz_score(X, labels)
```

**Quick Note:** Use these only when labels are meaningful.

**Common Gotcha**

- **Issue:** Misleading cluster scores on poor embeddings.
- **Cause:** Raw features may not reflect structure.
- **Quick Fix:** Compare multiple metrics and inspect clusters visually.

**Official API:** [silhouette_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.silhouette_score.html)

## Plot confusion matrix

**Mental Trigger:** Need a visual error breakdown for classification.

```python
from sklearn.metrics import ConfusionMatrixDisplay
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, stratify=y)
clf = LogisticRegression(max_iter=200).fit(X_train, y_train)
ConfusionMatrixDisplay.from_estimator(clf, X_test, y_test)
```

**Quick Note:** Great for spotting class-specific confusion.

**Common Gotcha**

- **Issue:** Misread axes or normalization.
- **Cause:** Plot defaults vary.
- **Quick Fix:** Check the display options before interpreting values.

**Official API:** [ConfusionMatrixDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ConfusionMatrixDisplay.html)

## Plot ROC curve

**Mental Trigger:** Need threshold-sensitive binary classifier visualization.

```python
from sklearn.metrics import RocCurveDisplay
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
mask = y != 2
X, y = X[mask], y[mask]
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, stratify=y)
clf = LogisticRegression(max_iter=200).fit(X_train, y_train)
RocCurveDisplay.from_estimator(clf, X_test, y_test)
```

**Quick Note:** Requires probabilities or decision scores.

**Common Gotcha**

- **Issue:** Invalid multiclass use.
- **Cause:** ROC curve example expects binary setup unless specialized.
- **Quick Fix:** Use binary labels or one-vs-rest logic.

**Official API:** [RocCurveDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.RocCurveDisplay.html)

## Plot precision-recall curve

**Mental Trigger:** Need PR evaluation for imbalanced classification.

```python
from sklearn.metrics import PrecisionRecallDisplay
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
mask = y != 2
X, y = X[mask], y[mask]
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, stratify=y)
clf = LogisticRegression(max_iter=200).fit(X_train, y_train)
PrecisionRecallDisplay.from_estimator(clf, X_test, y_test)
```

**Quick Note:** More informative than ROC in heavily imbalanced settings.

**Common Gotcha**

- **Issue:** Misleading comparison with accuracy.
- **Cause:** Different threshold behavior.
- **Quick Fix:** Use PR curve for rare positives.

**Official API:** [PrecisionRecallDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.PrecisionRecallDisplay.html)

## Plot calibration curve

**Mental Trigger:** Need to inspect predicted probability calibration.

```python
from sklearn.calibration import CalibrationDisplay
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
mask = y != 2
X, y = X[mask], y[mask]
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, stratify=y)
clf = LogisticRegression(max_iter=200).fit(X_train, y_train)
CalibrationDisplay.from_estimator(clf, X_test, y_test)
```

**Quick Note:** Useful for probability quality checks.

**Common Gotcha**

- **Issue:** Good classification but poor calibration.
- **Cause:** Decision quality and probability quality are different.
- **Quick Fix:** Calibrate separately if probabilities matter.

**Official API:** [CalibrationDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibrationDisplay.html)

## Plot decision boundary

**Mental Trigger:** Need to visualize a 2D classifier boundary.

```python
from sklearn.inspection import DecisionBoundaryDisplay
from sklearn.svm import SVC
from sklearn.datasets import load_iris
import numpy as np

X, y = load_iris(return_X_y=True)
X2 = X[:, :2]
clf = SVC(kernel="linear").fit(X2, y)
DecisionBoundaryDisplay.from_estimator(clf, X2, response_method="predict")
```

**Quick Note:** Works best with two input features.

**Common Gotcha**

- **Issue:** Hard-to-read plots in high dimensions.
- **Cause:** Boundary plots are 2D projections.
- **Quick Fix:** Reduce to two features for visualization only.

**Official API:** [DecisionBoundaryDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.inspection.DecisionBoundaryDisplay.html)

# Model Selection

## Compute cross-validated scores

**Mental Trigger:** Need one metric across folds.

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
cv = StratifiedKFold(5, shuffle=True, random_state=42)
scores = cross_val_score(LogisticRegression(max_iter=200), X, y, cv=cv, scoring="accuracy")
```

**Quick Note:** Quickest standard CV helper.

**Common Gotcha**

- **Issue:** Leakage from preprocessing outside CV.
- **Cause:** Transformations done before cross-validation.
- **Quick Fix:** Wrap preprocessing in a pipeline.

**Official API:** [cross_val_score](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html)

## Compute multiple CV metrics

**Mental Trigger:** Need richer evaluation than a single score.

```python
from sklearn.model_selection import cross_validate, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
cv = StratifiedKFold(5, shuffle=True, random_state=42)
results = cross_validate(
    LogisticRegression(max_iter=200),
    X, y,
    cv=cv,
    scoring={"acc": "accuracy", "f1": "f1_macro"},
    return_train_score=True,
)
```

**Quick Note:** Returns per-fold metrics and fit times.

**Common Gotcha**

- **Issue:** Misreading score keys.
- **Cause:** Custom scorer names become result keys.
- **Quick Fix:** Check the returned dictionary keys.

**Official API:** [cross_validate](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html)

## Get out-of-fold predictions

**Mental Trigger:** Need predictions for stacking, calibration, or error analysis.

```python
from sklearn.model_selection import cross_val_predict, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
cv = StratifiedKFold(5, shuffle=True, random_state=42)
y_pred = cross_val_predict(LogisticRegression(max_iter=200), X, y, cv=cv)
```

**Quick Note:** Predictions are generated from held-out folds.

**Common Gotcha**

- **Issue:** Misusing out-of-fold predictions as final model output.
- **Cause:** They are CV predictions, not a refit on all data.
- **Quick Fix:** Fit a final model separately if needed.

**Official API:** [cross_val_predict](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_predict.html)

## Plot learning curves

**Mental Trigger:** Need to diagnose data size vs bias/variance behavior.

```python
from sklearn.model_selection import learning_curve
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
train_sizes, train_scores, test_scores = learning_curve(
    LogisticRegression(max_iter=200),
    X, y,
    cv=5,
    train_sizes=[0.1, 0.5, 1.0],
)
```

**Quick Note:** Useful for spotting underfitting and overfitting patterns.

**Common Gotcha**

- **Issue:** Noisy curves.
- **Cause:** Too few folds or unstable data.
- **Quick Fix:** Use more folds or repeated CV.

**Official API:** [learning_curve](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.learning_curve.html)

## Plot validation curves

**Mental Trigger:** Need to tune one hyperparameter across a range.

```python
from sklearn.model_selection import validation_curve
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
import numpy as np

X, y = load_iris(return_X_y=True)
param_range = np.logspace(-3, 2, 6)
train_scores, test_scores = validation_curve(
    LogisticRegression(max_iter=200),
    X, y,
    param_name="C",
    param_range=param_range,
    cv=5,
)
```

**Quick Note:** Helps identify over- or under-regularization.

**Common Gotcha**

- **Issue:** Tuning the wrong parameter scale.
- **Cause:** Linear spacing on log-scale hyperparameters.
- **Quick Fix:** Use logarithmic ranges for `C`, `alpha`, and similar parameters.

**Official API:** [validation_curve](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.validation_curve.html)

## Run grid search

**Mental Trigger:** Need exhaustive search over a small parameter grid.

```python
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
grid = GridSearchCV(SVC(), {"C": [0.1, 1, 10], "kernel": ["linear", "rbf"]}, cv=5)
grid.fit(X, y)
```

**Quick Note:** Good when the grid is small and meaningful.

**Common Gotcha**

- **Issue:** Search takes too long.
- **Cause:** Large grid and expensive estimator.
- **Quick Fix:** Reduce the grid or switch to randomized search.

**Official API:** [GridSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html)

## Run randomized search

**Mental Trigger:** Need broad hyperparameter exploration.

```python
from sklearn.model_selection import RandomizedSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_iris
from scipy.stats import loguniform

X, y = load_iris(return_X_y=True)
search = RandomizedSearchCV(
    SVC(),
    {"C": loguniform(1e-3, 1e3), "gamma": loguniform(1e-4, 1e0)},
    n_iter=10,
    cv=5,
    random_state=42,
)
search.fit(X, y)
```

**Quick Note:** Better for large spaces than grid search.

**Common Gotcha**

- **Issue:** Poor parameter coverage.
- **Cause:** Too few iterations.
- **Quick Fix:** Increase `n_iter` or narrow the search space.

**Official API:** [RandomizedSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html)

## Run successive halving grid search

**Mental Trigger:** Need resource-aware search with a grid.

```python
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingGridSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
search = HalvingGridSearchCV(SVC(), {"C": [0.1, 1, 10]}, cv=5)
search.fit(X, y)
```

**Quick Note:** Requires the experimental import in current releases.

**Common Gotcha**

- **Issue:** Import error.
- **Cause:** Halving search is experimental.
- **Quick Fix:** Enable the experimental namespace first.

**Official API:** [HalvingGridSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingGridSearchCV.html)

## Run successive halving random search

**Mental Trigger:** Need resource-aware randomized search.

```python
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingRandomSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_iris
from scipy.stats import loguniform

X, y = load_iris(return_X_y=True)
search = HalvingRandomSearchCV(
    SVC(),
    {"C": loguniform(1e-3, 1e3)},
    cv=5,
    random_state=42,
)
search.fit(X, y)
```

**Quick Note:** Good when both search space and compute are limited.

**Common Gotcha**

- **Issue:** Too aggressive pruning.
- **Cause:** Early resource allocation can eliminate good candidates.
- **Quick Fix:** Tune the halving settings carefully.

**Official API:** [HalvingRandomSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingRandomSearchCV.html)

# Pipelines and Composition

## Build a preprocessing pipeline

**Mental Trigger:** Need to prevent leakage and keep training steps together.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=200)),
])
pipe.fit(X, y)
```

**Quick Note:** Pipelines are the default safe pattern for preprocessing + model fitting.

**Common Gotcha**

- **Issue:** Leakage from manual preprocessing.
- **Cause:** Transforming before train/test split or CV.
- **Quick Fix:** Put transforms inside the pipeline.

**Official API:** [Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)

## Create a pipeline quickly

**Mental Trigger:** Need a compact pipeline without naming each step manually.

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=200))
```

**Quick Note:** Step names are auto-generated.

**Common Gotcha**

- **Issue:** Harder parameter access.
- **Cause:** Auto-generated names can be less explicit.
- **Quick Fix:** Use `Pipeline` when you need stable step names.

**Official API:** [make_pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html)

## Tune nested pipeline parameters

**Mental Trigger:** Need to search hyperparameters inside a pipeline.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
pipe = Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=200))])
grid = GridSearchCV(pipe, {"clf__C": [0.1, 1, 10]}, cv=5)
grid.fit(X, y)
```

**Quick Note:** Double underscores address nested parameters.

**Common Gotcha**

- **Issue:** Parameter not found.
- **Cause:** Wrong step prefix.
- **Quick Fix:** Use `step__param` naming exactly.

**Official API:** [Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)

## Cache pipeline steps

**Mental Trigger:** Need to reuse expensive transforms during search.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from joblib import Memory
import tempfile

memory = Memory(location=tempfile.mkdtemp())
pipe = Pipeline(
    [("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=200))],
    memory=memory,
)
```

**Quick Note:** Caching helps when intermediate steps are expensive and repeated.

**Common Gotcha**

- **Issue:** Recomputing the same transforms.
- **Cause:** No pipeline cache.
- **Quick Fix:** Use `memory=` with a cache backend.

**Official API:** [Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)

## Combine feature branches

**Mental Trigger:** Need parallel feature paths before concatenation.

```python
from sklearn.pipeline import FeatureUnion
from sklearn.decomposition import PCA, TruncatedSVD

union = FeatureUnion([
    ("pca", PCA(n_components=2)),
    ("svd", TruncatedSVD(n_components=2, random_state=42)),
])
```

**Quick Note:** Use when separate feature generators should be merged.

**Common Gotcha**

- **Issue:** Feature duplication or redundancy.
- **Cause:** Parallel transforms may overlap heavily.
- **Quick Fix:** Use only when branches add distinct information.

**Official API:** [FeatureUnion](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.FeatureUnion.html)

# Inspection

## Measure permutation importance

**Mental Trigger:** Need model-agnostic feature importance.

```python
from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, stratify=y)
clf = RandomForestClassifier(random_state=42).fit(X_train, y_train)
result = permutation_importance(clf, X_test, y_test, n_repeats=10, random_state=42)
```

**Quick Note:** Works on any fitted estimator with a scoring metric.

**Common Gotcha**

- **Issue:** Slow computation.
- **Cause:** Repeated scoring over many features.
- **Quick Fix:** Reduce repeats or sample features.

**Official API:** [permutation_importance](https://scikit-learn.org/stable/modules/generated/sklearn.inspection.permutation_importance.html)

## Plot partial dependence

**Mental Trigger:** Need a global view of feature effect on predictions.

```python
from sklearn.inspection import PartialDependenceDisplay
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = RandomForestRegressor(random_state=42).fit(X, y)
PartialDependenceDisplay.from_estimator(reg, X, [0, 1])
```

**Quick Note:** Best for fitted models and a small number of features.

**Common Gotcha**

- **Issue:** Misreading correlated-feature effects.
- **Cause:** Partial dependence averages across the data.
- **Quick Fix:** Validate with domain knowledge and other diagnostics.

**Official API:** [PartialDependenceDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html)

# Persistence and Utilities

## Save and load with joblib

**Mental Trigger:** Need to persist scikit-learn models efficiently.

```python
from joblib import dump, load
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=200).fit(X, y)
dump(clf, "model.joblib")
loaded = load("model.joblib")
```

**Quick Note:** Preferred for scikit-learn estimators and pipelines.

**Common Gotcha**

- **Issue:** Loading fails after code changes.
- **Cause:** Version or environment mismatch.
- **Quick Fix:** Save the environment and version alongside the artifact.

**Official API:** [joblib.dump](https://joblib.readthedocs.io/en/latest/generated/joblib.dump.html)

## Save and load with pickle

**Mental Trigger:** Need Python-native serialization for quick local workflows.

```python
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = LogisticRegression(max_iter=200).fit(X, y)
with open("model.pkl", "wb") as f:
    pickle.dump(clf, f)
with open("model.pkl", "rb") as f:
    loaded = pickle.load(f)
```

**Quick Note:** Use carefully with trusted artifacts only.

**Common Gotcha**

- **Issue:** Security risk from untrusted files.
- **Cause:** Pickle executes arbitrary code on load.
- **Quick Fix:** Only load trusted artifacts.

**Official API:** [pickle](https://docs.python.org/3/library/pickle.html)

## Compute class weights

**Mental Trigger:** Need to compensate for imbalanced classes.

```python
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

classes = np.array([0, 1])
y = np.array([0, 0, 0, 1])
weights = compute_class_weight(class_weight="balanced", classes=classes, y=y)
```

**Quick Note:** Useful for weighted classifiers or sample weighting.

**Common Gotcha**

- **Issue:** Wrong class ordering.
- **Cause:** Classes must match the estimator's label set.
- **Quick Fix:** Pass the exact class array.

**Official API:** [compute_class_weight](https://scikit-learn.org/stable/modules/generated/sklearn.utils.class_weight.compute_class_weight.html)

## Use a dummy model for baselines

**Mental Trigger:** Need a benchmark floor for classification or regression.

```python
from sklearn.dummy import DummyClassifier, DummyRegressor
```

**Quick Note:** Always compare against a trivial baseline before trusting results.

**Common Gotcha**

- **Issue:** Inflated model confidence.
- **Cause:** No baseline comparison.
- **Quick Fix:** Measure real gains over a dummy model.

**Official API:** [DummyClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html)

# Performance Notes

- Scale features before gradient-based and distance-based estimators.
- Use sparse-aware transformers and linear models for text-like sparse data.
- Prefer `Pipeline` and CV helpers to avoid leakage and repeated manual work.
- Use `MiniBatchKMeans`, `SGD*`, or `HistGradientBoosting*` for larger datasets when appropriate.
- Keep ensembles and kernel methods on a tight budget for memory and runtime.
- Cache repeated preprocessing during grid search with `Pipeline(memory=...)`.


# Production Checklist

- Use stable APIs only.
- Keep preprocessing inside pipelines.
- Set `random_state` for reproducibility.
- Compare against a dummy baseline.
- Validate on a holdout set and cross-validation.
- Save fitted artifacts with version metadata.
- Inspect feature names after transformations.
- Choose metrics that match the business objective.


# Coverage Validation

✓ Setup
✓ Dataset Utilities
✓ Data Splitting
✓ Preprocessing
✓ Feature Engineering
✓ Feature Selection
✓ Dimensionality Reduction
✓ Classification
✓ Regression
✓ Clustering
✓ Model Evaluation
✓ Model Selection
✓ Pipelines \& Composition
✓ Inspection
✓ Persistence \& Utilities
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^23][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^2]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^3]: CURRENT_PROJECT_STATE_REPORT.md

[^4]: CONTENT_QUALITY_STANDARD.md

[^5]: AENS-Knowledge-Layer-Specification.md

[^6]: https://www.geeksforgeeks.org/blogs/scikit-learn-cheatsheet/

[^7]: https://github.com/mpolinowski/python-scikitlearn-cheatsheet

[^8]: https://www.kdnuggets.com/publications/sheets/Scikit-Learn_Cheatsheet_for_Machine_Learning.pdf

[^9]: https://scikit-learn.org/stable/getting_started.html

[^10]: https://bytepane.com/cheatsheet/scikit-learn/

[^11]: https://scikit-learn-laboratory.readthedocs.io/_/downloads/en/latest/pdf/

[^12]: https://scikit-learn.org/stable/user_guide.html

[^13]: https://labex.io/cheatsheets/sklearn

[^14]: https://arxiv.org/abs/1201.0490

[^15]: https://www.datacamp.com/cheat-sheet/scikit-learn-cheat-sheet-python-machine-learning

[^16]: https://arxiv.org/pdf/1201.0490.pdf

[^17]: https://arxiv.org/pdf/1309.0238.pdf

[^18]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10792272/

[^19]: http://arxiv.org/pdf/2407.08597.pdf

[^20]: http://arxiv.org/pdf/2410.09596.pdf

[^21]: https://publications.eai.eu/index.php/sis/article/download/4067/2810

[^22]: http://arxiv.org/pdf/2411.08932.pdf

[^23]: http://arxiv.org/pdf/2302.00288.pdf

