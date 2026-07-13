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



1. Import & Setup

2. Core Objects

3. Data Creation / Input

4. Selection & Access

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



# 11. Pattern & Workflow Mapping



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



1. Setup & Import

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

12. Performance & Utilities



Order entries by engineering frequency, not alphabetically.



---



### Setup & Import



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



### Performance & Utilities



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









# 15. Quality, Recall & Search Optimization



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



# 16. Output Contract & Validation



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