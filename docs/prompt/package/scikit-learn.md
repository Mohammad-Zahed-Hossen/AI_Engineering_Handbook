# Generate Production-Ready AENS Package Resource for scikit-learn

I am building an AI Engineering knowledge system (AENS).

This is **NOT** a documentation website.

It is also **NOT** a tutorial.

I need you to generate a **production-ready Markdown file** that I can later convert almost directly into my JSON package format.

The goal is to build a package page that helps engineers quickly find and recall the correct **scikit-learn API** while implementing machine learning systems.

---

# Objective

Create a single file:

```
scikit-learn.md
```

This file should contain approximately **90–110 carefully selected implementation tasks** that cover the APIs responsible for the vast majority of real-world scikit-learn usage.

Do **not** attempt to document the entire library.

Follow the **80/20 principle**.

Skip APIs that are:

- experimental
- deprecated
- legacy
- highly specialized
- niche research utilities
- rarely used in production

Prioritize APIs engineers repeatedly use in:

- Machine Learning
- Data Science
- AI Engineering
- Model Development
- Model Evaluation
- Feature Engineering
- Data Preprocessing
- Hyperparameter Optimization
- Production ML Pipelines

---

# AENS Ownership Rules (Strict)

This Package owns **implementation knowledge only**.

Include:

- library APIs
- implementation syntax
- parameters
- return values
- engineering usage
- production notes
- package conventions
- package-specific gotchas

Do **NOT** explain:

- machine learning theory
- algorithm mathematics
- algorithm selection
- feature scaling concepts
- cross-validation concepts
- bias-variance tradeoff
- end-to-end ML workflows
- debugging procedures

Those belong to other AENS resource types.

---

# What I Need

First generate package-level information.

Include:

- id
- title
- slug
- description
- name
- latest stable version
- supported Python versions
- summary
- install command
- import convention
- important namespaces
- official repository
- official documentation
- license
- maintainers
- created_at
- updated_at

---

# Package Architecture

Briefly describe the purpose of the major namespaces.

Include:

```
sklearn.base

sklearn.pipeline

sklearn.compose

sklearn.preprocessing

sklearn.impute

sklearn.model_selection

sklearn.metrics

sklearn.feature_selection

sklearn.linear_model

sklearn.ensemble

sklearn.tree

sklearn.svm

sklearn.cluster

sklearn.neighbors

sklearn.decomposition

sklearn.calibration

sklearn.inspection

sklearn.multiclass
```

Only explain what each namespace is used for.

Do not document every class.

---

# Generate Package Tasks

Generate approximately **90–110 implementation tasks**.

Each task should represent a real engineering operation rather than simply documenting a class.

Prefer action-oriented task names.

---

## Dataset Preparation

Examples include:

- Split Dataset
- Stratified Train-Test Split
- Shuffle Dataset
- K-Fold Split
- Stratified K-Fold
- Group K-Fold

---

## Missing Values

Include tasks such as:

- Fill Missing Values
- Mean Imputation
- Median Imputation
- Most Frequent Imputation
- Constant Imputation

---

## Feature Scaling

Include implementation tasks using:

- StandardScaler
- MinMaxScaler
- RobustScaler
- MaxAbsScaler
- Normalizer

Do not explain scaling theory.

---

## Feature Encoding

Include:

- OneHotEncoder
- OrdinalEncoder
- LabelEncoder
- MultiLabelBinarizer
- LabelBinarizer

---

## Feature Engineering

Include:

- Polynomial Features
- Feature Selection
- Variance Threshold
- SelectKBest
- PCA
- TruncatedSVD

---

## Pipelines

Include:

- Create Pipeline
- Create ColumnTransformer
- Nested Pipeline
- make_pipeline
- make_column_transformer

---

## Model Training

Include implementation tasks for common estimators such as:

- Train LogisticRegression
- Train LinearRegression
- Train Ridge
- Train Lasso
- Train ElasticNet
- Train DecisionTreeClassifier
- Train DecisionTreeRegressor
- Train RandomForestClassifier
- Train RandomForestRegressor
- ExtraTrees
- Train GradientBoosting
- Train HistGradientBoosting
- Train AdaBoost
- Train KNeighborsClassifier
- Train KNeighborsRegressor
- Train SVC
- Train SVR
- Train GaussianNB
- Train MultinomialNB
- Train BernoulliNB
- Train KMeans
- Train DBSCAN

Do **not** explain algorithm theory.

Focus on implementation.

---

## Hyperparameter Search

Include:

- GridSearchCV
- RandomizedSearchCV
- HalvingGridSearchCV
- HalvingRandomSearchCV

---

## Model Evaluation

Include APIs such as:

- accuracy_score
- precision_score
- recall_score
- f1_score
- roc_auc_score
- confusion_matrix
- classification_report
- balanced_accuracy_score
- precision_recall_curve
- roc_curve
- mean_squared_error
- mean_absolute_error
- root_mean_squared_error
- r2_score

---

## Model Validation

Include:

- cross_val_score
- cross_validate
- validation_curve
- learning_curve

---

## Prediction

Include:

- predict
- predict_proba
- decision_function
- transform
- fit_transform
- inverse_transform
- score

---

## Model Persistence

Include:

- joblib.dump
- joblib.load

---

## Feature Inspection

Include:

- permutation_importance
- Partial Dependence
- ConfusionMatrixDisplay
- PrecisionRecallDisplay
- RocCurveDisplay

---

## Utilities

Include useful implementation APIs that engineers frequently use.

---

# Every Task Must Follow This Structure

## Task

Use an action-oriented title.

Example:

```
Standardize Numerical Features
```

---

## Problem Solved

One sentence describing the practical engineering problem.

---

## Mental Trigger

One short sentence.

Example:

> My numerical features have different scales.
> 

---

## Syntax

Provide the complete API signature.

Example

```python
StandardScaler(copy=True, with_mean=True, with_std=True)
```

---

## Important Parameters

List only the parameters engineers commonly modify.

Maximum five.

---

## Return Value

Describe the returned object.

---

## Example

Provide a complete runnable example.

Every example must:

- include imports
- use only scikit-learn (plus NumPy where necessary)
- execute successfully
- use modern APIs
- be copy-paste ready

---

## Use When

Describe practical engineering situations.

---

## Avoid When

Explain when another API is preferable.

---

## Gotchas

Provide **3–5** implementation-specific pitfalls.

Examples include:

- forgetting `fit()`
- data leakage caused by preprocessing order
- sparse vs dense outputs
- random_state reproducibility
- estimator cloning
- parameter naming inside pipelines
- feature_names_in_
- metadata routing
- version-specific behavior

---

## Performance Notes

Mention:

- memory considerations
- parallelization (`n_jobs`)
- scalability
- sparse matrix behavior

Only when relevant.

---

## Related APIs

List closely related APIs.

---

## Official Documentation

Provide the **direct API documentation URL**.

Never use the homepage.

---

# Official Sources

Use the following priority order:

1. Official scikit-learn documentation
2. Official scikit-learn API Reference
3. Official User Guide
4. Official GitHub repository
5. Official release notes

Do not rely primarily on blogs or third-party tutorials.

---

# Quality Requirements

- Base all content on the latest stable scikit-learn release.
- Every example must run without modification.
- Use modern APIs only.
- Avoid deprecated features unless still commonly encountered.
- Do not copy official documentation text.
- Write concise, engineer-focused explanations.
- Prioritize production usage over academic examples.
- Keep explanations implementation-focused.
- Avoid long conceptual discussions.
- Avoid machine learning theory.
- Prefer practical engineering examples over toy demonstrations.

---

# Output Format

Produce a single clean Markdown document.

Use consistent heading hierarchy.

Keep formatting uniform throughout.

Do **not** output JSON.

Do **not** output YAML.

Do **not** explain your reasoning.

Generate only the completed **`scikit-learn.md`** document.