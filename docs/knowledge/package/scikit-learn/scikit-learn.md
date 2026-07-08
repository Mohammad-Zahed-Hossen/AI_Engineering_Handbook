<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# scikit-learn

## Package Metadata

- **id:** package:scikit-learn
- **title:** scikit-learn Package
- **slug:** scikit-learn
- **name:** scikit-learn
- **description:** Core Python machine learning library for preprocessing, model training, evaluation, selection, and inspection.[^1][^2]
- **latest stable version:** 1.9.0[^3][^2]
- **supported Python versions:** Python 3.11+[^2][^3]
- **summary:** scikit-learn is a production-oriented machine learning library with a consistent estimator API for preprocessing, model selection, classification, regression, clustering, and inspection.[^4][^2]
- **install command:** `pip install -U scikit-learn`[^2]
- **import convention:** `import sklearn` and direct imports from submodules such as `from sklearn.model_selection import train_test_split`[^2]
- **important namespaces:** `sklearn.base`, `sklearn.pipeline`, `sklearn.compose`, `sklearn.preprocessing`, `sklearn.impute`, `sklearn.model_selection`, `sklearn.metrics`, `sklearn.feature_selection`, `sklearn.linear_model`, `sklearn.ensemble`, `sklearn.tree`, `sklearn.svm`, `sklearn.cluster`, `sklearn.neighbors`, `sklearn.decomposition`, `sklearn.calibration`, `sklearn.inspection`, `sklearn.multiclass`[^5][^2]
- **official repository:** [https://github.com/scikit-learn/scikit-learn](https://github.com/scikit-learn/scikit-learn)[^4][^2]
- **official documentation:** [https://scikit-learn.org/stable/](https://scikit-learn.org/stable/)[^1][^2]
- **license:** BSD-3-Clause[^4][^2]
- **maintainers:** scikit-learn developers; PyPI lists maintainers including adrin, GaelVaroquaux, glemaitre, jeremiedbb, jnothman, lesteve, ogrisel, t3kcit, and thomasjpfan.[^3][^2]
- **created_at:** 2007[^4][^2]
- **updated_at:** 2026-07-07[^6][^3]


## Namespace Architecture

### sklearn.base

Defines the estimator interface and common base classes used across the library.[^5][^2]

### sklearn.pipeline

Combines preprocessing and estimators into a single fitted object for reusable training and inference.[^5][^2]

### sklearn.compose

Builds column-wise transformations and estimator compositions for heterogeneous tabular data.[^5][^2]

### sklearn.preprocessing

Provides data transformation APIs for scaling, encoding, normalization, and feature construction.[^2][^5]

### sklearn.impute

Provides strategies for filling missing values in numeric and categorical data.[^5][^2]

### sklearn.model_selection

Contains splitters, cross-validation, search, and validation utilities for model assessment and tuning.[^2][^5]

### sklearn.metrics

Provides metrics, scoring functions, and plotting helpers for evaluating model outputs.[^5][^2]

### sklearn.feature_selection

Contains utilities for selecting informative features and filtering low-utility features.[^2][^5]

### sklearn.linear_model

Contains linear estimators for regression and classification.[^5][^2]

### sklearn.ensemble

Contains ensemble estimators for bagging, boosting, and voting-style models.[^2][^5]

### sklearn.tree

Contains decision tree estimators for classification and regression.[^5][^2]

### sklearn.svm

Contains support vector machine estimators for classification, regression, and novelty detection.[^2][^5]

### sklearn.cluster

Contains unsupervised clustering estimators.[^5][^2]

### sklearn.neighbors

Contains nearest-neighbor estimators for classification, regression, and similarity queries.[^2][^5]

### sklearn.decomposition

Contains dimensionality reduction and matrix decomposition estimators.[^5][^2]

### sklearn.calibration

Contains probability calibration utilities for classifiers.[^2][^5]

### sklearn.inspection

Contains model inspection utilities such as permutation importance and partial dependence.[^7][^8]

### sklearn.multiclass

Contains strategies for extending binary classifiers to multiclass and multilabel tasks.[^5][^2]

## Task Catalog

### Split Dataset

- **Task:** Split Dataset
- **Problem Solved:** Create a basic train/test partition for model development and final evaluation.
- **Mental Trigger:** I need a quick train/test split.
- **Syntax:** `train_test_split(*arrays, test_size=None, train_size=None, random_state=None, shuffle=True, stratify=None)`
- **Important Parameters:** `test_size`, `train_size`, `random_state`, `shuffle`, `stratify`
- **Return Value:** Lists or arrays split into training and test subsets.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import train_test_split

X = np.arange(20).reshape(-1, 1)
y = np.arange(20)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

- **Use When:** You need a straightforward holdout split.
- **Avoid When:** You need grouped, time-aware, or repeated validation.
- **Gotchas:** Random shuffling affects reproducibility; `stratify` is only for classification targets; the function returns aligned splits; leave preprocessing inside a pipeline to avoid leakage; `test_size` and `train_size` interact.
- **Performance Notes:** Handles large arrays efficiently but copies output subsets.
- **Related APIs:** `Stratified Train-Test Split`, `Shuffle Dataset`, `cross_val_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)


### Stratified Train-Test Split

- **Task:** Stratified Train-Test Split
- **Problem Solved:** Preserve class proportions in a train/test split.
- **Mental Trigger:** My classes are imbalanced.
- **Syntax:** `train_test_split(*arrays, test_size=None, train_size=None, random_state=None, shuffle=True, stratify=y)`
- **Important Parameters:** `test_size`, `random_state`, `stratify`, `shuffle`
- **Return Value:** Stratified training and test subsets.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import train_test_split

X = np.arange(12).reshape(-1, 1)
y = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y
)
```

- **Use When:** Class balance should be approximately preserved.
- **Avoid When:** Targets are continuous or grouped.
- **Gotchas:** Requires enough samples per class; shuffling is usually required; stratification does not solve imbalance; reproducibility still depends on `random_state`; multi-output stratification is limited.
- **Performance Notes:** Similar cost to a standard split.
- **Related APIs:** `train_test_split`, `StratifiedKFold`, `balanced_accuracy_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)


### Shuffle Dataset

- **Task:** Shuffle Dataset
- **Problem Solved:** Randomize sample order before splitting or training.
- **Mental Trigger:** I need randomized sample order.
- **Syntax:** `shuffle(*arrays, random_state=None, n_samples=None)`
- **Important Parameters:** `random_state`, `n_samples`
- **Return Value:** Shuffled arrays with preserved alignment.
- **Example:**

```python
import numpy as np
from sklearn.utils import shuffle

X = np.arange(6).reshape(-1, 1)
y = np.array([0, 1, 0, 1, 0, 1])

X_shuf, y_shuf = shuffle(X, y, random_state=42)
```

- **Use When:** You need randomized sample ordering.
- **Avoid When:** Data has temporal ordering that must be preserved.
- **Gotchas:** All arrays must have matching first dimensions; shuffling before splitting can break time-based assumptions; `random_state` controls reproducibility; sparse inputs may be returned in sparse form; the function does not stratify.
- **Performance Notes:** Useful for lightweight preprocessing; avoids estimator-side shuffling dependencies.
- **Related APIs:** `train_test_split`, `StratifiedKFold`, `KFold`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.utils.shuffle.html](https://scikit-learn.org/stable/modules/generated/sklearn.utils.shuffle.html)


### K-Fold Split

- **Task:** K-Fold Split
- **Problem Solved:** Generate repeated train/validation partitions for cross-validation.
- **Mental Trigger:** I need cross-validation folds.
- **Syntax:** `KFold(n_splits=5, *, shuffle=False, random_state=None)`
- **Important Parameters:** `n_splits`, `shuffle`, `random_state`
- **Return Value:** A splitter object that yields train and test indices.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import KFold

X = np.arange(10).reshape(-1, 1)
kf = KFold(n_splits=5, shuffle=True, random_state=42)

for train_idx, test_idx in kf.split(X):
    pass
```

- **Use When:** You want standard repeated evaluation on the same dataset.
- **Avoid When:** Classes must be stratified or groups must not mix.
- **Gotchas:** Shuffle must be enabled for randomized folds; folds are index-based, not data copies; the last folds may differ by one sample; leakage can happen if preprocessing is outside a pipeline; `random_state` only matters when shuffling is enabled.
- **Performance Notes:** Efficient for large datasets because it yields indices.
- **Related APIs:** `StratifiedKFold`, `GroupKFold`, `cross_val_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html)


### Stratified K-Fold

- **Task:** Stratified K-Fold
- **Problem Solved:** Create cross-validation folds with roughly preserved class proportions.
- **Mental Trigger:** I need balanced CV folds.
- **Syntax:** `StratifiedKFold(n_splits=5, *, shuffle=False, random_state=None)`
- **Important Parameters:** `n_splits`, `shuffle`, `random_state`
- **Return Value:** A cross-validation splitter with stratified folds.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import StratifiedKFold

X = np.arange(12).reshape(-1, 1)
y = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1])

skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=0)
for train_idx, test_idx in skf.split(X, y):
    pass
```

- **Use When:** Classification targets are imbalanced.
- **Avoid When:** The target is continuous or groups are required.
- **Gotchas:** Each class must have enough samples; folds are approximate, not exact, matches of class ratios; `shuffle=True` is often needed for randomized splits; preprocessing must still happen inside folds; group membership is ignored.
- **Performance Notes:** Index generation is efficient.
- **Related APIs:** `KFold`, `RepeatedStratifiedKFold`, `cross_validate`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html)


### Group K-Fold

- **Task:** Group K-Fold
- **Problem Solved:** Keep samples from the same group in the same fold.
- **Mental Trigger:** Grouped samples must not leak across folds.
- **Syntax:** `GroupKFold(n_splits=5)`
- **Important Parameters:** `n_splits`
- **Return Value:** A splitter that respects group boundaries.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import GroupKFold

X = np.arange(8).reshape(-1, 1)
y = np.arange(8)
groups = np.array([0, 0, 1, 1, 2, 2, 3, 3])

gkf = GroupKFold(n_splits=4)
for train_idx, test_idx in gkf.split(X, y, groups):
    pass
```

- **Use When:** Samples share an entity such as user, patient, or device.
- **Avoid When:** Group identity is irrelevant.
- **Gotchas:** You must pass `groups` to `split`; class balance is not enforced; folds can be uneven; leakage occurs if groups are ignored; group-based CV is not a substitute for temporal validation.
- **Performance Notes:** Fast index-based splitter.
- **Related APIs:** `StratifiedGroupKFold`, `KFold`, `cross_validate`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html)


### Fill Missing Values

- **Task:** Fill Missing Values
- **Problem Solved:** Replace missing entries with a learned or fixed value before modeling.
- **Mental Trigger:** My data has NaNs.
- **Syntax:** `SimpleImputer(*, missing_values=np.nan, strategy='mean', fill_value=None, copy=True, add_indicator=False)`
- **Important Parameters:** `strategy`, `fill_value`, `add_indicator`, `copy`
- **Return Value:** An imputer that fills missing values during `fit`/`transform`.
- **Example:**

```python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0, np.nan], [3.0, 4.0], [np.nan, 6.0]])
imp = SimpleImputer(strategy="mean")
X_filled = imp.fit_transform(X)
```

- **Use When:** You need a simple numeric or categorical missing-value strategy.
- **Avoid When:** Missingness needs a more specialized modeling approach.
- **Gotchas:** Fit on training data only; strategy must match data type; `add_indicator=True` changes output width; sparse handling depends on input and strategy; `copy=False` may still copy in some cases.
- **Performance Notes:** Efficient for typical tabular preprocessing.
- **Related APIs:** `Mean Imputation`, `Median Imputation`, `MissingIndicator`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html)


### Mean Imputation

- **Task:** Mean Imputation
- **Problem Solved:** Fill missing numeric values with the column mean.
- **Mental Trigger:** I want average-based numeric imputation.
- **Syntax:** `SimpleImputer(strategy='mean')`
- **Important Parameters:** `strategy`
- **Return Value:** A fitted imputer that stores per-column means.
- **Example:**

```python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0, np.nan], [3.0, 4.0], [5.0, 6.0]])
imp = SimpleImputer(strategy="mean")
X_out = imp.fit_transform(X)
```

- **Use When:** Numeric columns have mild missingness.
- **Avoid When:** Outliers or skew make the mean unstable.
- **Gotchas:** Do not fit on test data; not suitable for strings; output dtype may change; columns with all missing values need careful handling; downstream scaling should usually happen after imputation.
- **Performance Notes:** Lightweight and fast.
- **Related APIs:** `Median Imputation`, `SimpleImputer`, `StandardScaler`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html)


### Median Imputation

- **Task:** Median Imputation
- **Problem Solved:** Fill missing numeric values with the column median.
- **Mental Trigger:** I need robust numeric imputation.
- **Syntax:** `SimpleImputer(strategy='median')`
- **Important Parameters:** `strategy`
- **Return Value:** A fitted imputer with stored medians.
- **Example:**

```python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0, np.nan], [100.0, 4.0], [5.0, 6.0]])
imp = SimpleImputer(strategy="median")
X_out = imp.fit_transform(X)
```

- **Use When:** Numeric values contain outliers.
- **Avoid When:** Missingness is categorical or requires domain rules.
- **Gotchas:** Fit only on training data; median is undefined for non-numeric data; output width stays the same unless indicators are added; columns with all missing values can be problematic; transform order matters in pipelines.
- **Performance Notes:** Similar cost to mean imputation.
- **Related APIs:** `Mean Imputation`, `SimpleImputer`, `RobustScaler`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html)


### Most Frequent Imputation

- **Task:** Most Frequent Imputation
- **Problem Solved:** Fill missing values with the most common observed category or value.
- **Mental Trigger:** I need mode-based imputation.
- **Syntax:** `SimpleImputer(strategy='most_frequent')`
- **Important Parameters:** `strategy`
- **Return Value:** A fitted imputer that stores the most frequent value per column.
- **Example:**

```python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([["red"], [None], ["red"], ["blue"]], dtype=object)
imp = SimpleImputer(strategy="most_frequent")
X_out = imp.fit_transform(X)
```

- **Use When:** Categorical columns need simple filling.
- **Avoid When:** Missingness should remain explicit or is highly structured.
- **Gotchas:** Works on object or categorical-like data; ties are resolved by internal ordering; fit only on training data; `None` and `np.nan` handling depends on `missing_values`; imputation can mask informative missingness.
- **Performance Notes:** Efficient for standard tabular data.
- **Related APIs:** `Constant Imputation`, `OrdinalEncoder`, `OneHotEncoder`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html)


### Constant Imputation

- **Task:** Constant Imputation
- **Problem Solved:** Fill missing values with a fixed sentinel or domain value.
- **Mental Trigger:** I need a specific fill value.
- **Syntax:** `SimpleImputer(strategy='constant', fill_value=None)`
- **Important Parameters:** `fill_value`, `strategy`
- **Return Value:** A fitted imputer that replaces missing values with the chosen constant.
- **Example:**

```python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0, np.nan], [np.nan, 2.0]])
imp = SimpleImputer(strategy="constant", fill_value=-1)
X_out = imp.fit_transform(X)
```

- **Use When:** Missing values need an explicit sentinel.
- **Avoid When:** Numerical averaging or mode filling is more appropriate.
- **Gotchas:** Choose sentinels carefully to avoid colliding with valid values; output dtype may change; fit on training data only; indicators may be useful; constant filling can distort downstream scaling.
- **Performance Notes:** Fast and predictable.
- **Related APIs:** `SimpleImputer`, `MissingIndicator`, `OneHotEncoder`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html)


### Standardize Numerical Features

- **Task:** Standardize Numerical Features
- **Problem Solved:** Scale numeric columns to zero mean and unit variance.
- **Mental Trigger:** My features need standard scaling.
- **Syntax:** `StandardScaler(*, copy=True, with_mean=True, with_std=True)`
- **Important Parameters:** `with_mean`, `with_std`, `copy`
- **Return Value:** A scaler that transforms arrays using stored means and standard deviations.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0, 2.0], [3.0, 6.0], [5.0, 10.0]])
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

- **Use When:** Numeric columns need centering and variance normalization.
- **Avoid When:** Dense centering is inappropriate for sparse matrices.
- **Gotchas:** `with_mean=True` is incompatible with sparse input; fit on training data only; outliers affect the mean and variance; the scaler stores `mean_` and `scale_`; feature ordering must stay consistent.
- **Performance Notes:** Efficient on dense arrays; preserve sparsity by disabling centering when needed.
- **Related APIs:** `RobustScaler`, `MinMaxScaler`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)


### Scale to Range

- **Task:** Scale to Range
- **Problem Solved:** Map features into a fixed interval such as $[0, 1]$.
- **Mental Trigger:** I need bounded feature values.
- **Syntax:** `MinMaxScaler(feature_range=(0, 1), *, copy=True, clip=False)`
- **Important Parameters:** `feature_range`, `clip`, `copy`
- **Return Value:** A scaler that applies min-max normalization.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import MinMaxScaler

X = np.array([[1.0, 10.0], [3.0, 20.0], [5.0, 30.0]])
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)
```

- **Use When:** A bounded output range is useful.
- **Avoid When:** Outliers dominate the extrema.
- **Gotchas:** Sensitive to extreme values; fit on training data only; values outside the training range can map outside the target interval unless clipped; sparse behavior differs by input type; feature range must be ordered.
- **Performance Notes:** Lightweight for tabular data.
- **Related APIs:** `StandardScaler`, `MaxAbsScaler`, `Normalizer`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html)


### Robust Scale Features

- **Task:** Robust Scale Features
- **Problem Solved:** Scale features using statistics that are less sensitive to outliers.
- **Mental Trigger:** My data has heavy outliers.
- **Syntax:** `RobustScaler(*, with_centering=True, with_scaling=True, quantile_range=(25.0, 75.0), copy=True, unit_variance=False)`
- **Important Parameters:** `with_centering`, `with_scaling`, `quantile_range`, `unit_variance`
- **Return Value:** A scaler based on medians and quantiles.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import RobustScaler

X = np.array([[1.0], [2.0], [100.0]])
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)
```

- **Use When:** Outliers should have limited influence.
- **Avoid When:** You need mean/variance standardization.
- **Gotchas:** Centering sparse matrices is not allowed; quantiles depend on training data; scaling is feature-wise; outliers are not removed, only reduced in influence; `unit_variance=True` changes scaling behavior.
- **Performance Notes:** More expensive than simple scaling on large dense data.
- **Related APIs:** `StandardScaler`, `QuantileTransformer`, `MaxAbsScaler`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html)


### Preserve Sparsity with MaxAbsScaler

- **Task:** Preserve Sparsity with MaxAbsScaler
- **Problem Solved:** Scale features while keeping sparse matrices sparse.
- **Mental Trigger:** I need sparse-safe scaling.
- **Syntax:** `MaxAbsScaler(*, copy=True)`
- **Important Parameters:** `copy`
- **Return Value:** A scaler that divides by the maximum absolute value per feature.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import MaxAbsScaler

X = np.array([[1.0, -2.0], [3.0, 4.0]])
scaler = MaxAbsScaler()
X_scaled = scaler.fit_transform(X)
```

- **Use When:** Input is sparse or non-negative scaling must preserve zeros.
- **Avoid When:** Mean centering is required.
- **Gotchas:** No centering is performed; zero entries remain zero; fit only on training data; feature-wise maxima are stored; output type can reflect sparse input.
- **Performance Notes:** Good choice for sparse high-dimensional data.
- **Related APIs:** `StandardScaler`, `RobustScaler`, `Normalizer`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html)


### Normalize Samples

- **Task:** Normalize Samples
- **Problem Solved:** Scale each sample vector to a fixed norm.
- **Mental Trigger:** I need row-wise normalization.
- **Syntax:** `Normalizer(*, norm='l2', copy=True)`
- **Important Parameters:** `norm`, `copy`
- **Return Value:** A transformer that normalizes each sample independently.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import Normalizer

X = np.array([[3.0, 4.0], [1.0, 0.0]])
norm = Normalizer()
X_norm = norm.fit_transform(X)
```

- **Use When:** Vector length matters more than absolute magnitude.
- **Avoid When:** Feature-wise scaling is needed instead.
- **Gotchas:** Normalization is row-wise, not column-wise; sparse and dense behavior differ; fit has no learned statistics; use the same pipeline during inference; `l1`, `l2`, and `max` norms behave differently.
- **Performance Notes:** Very fast and sparse-friendly.
- **Related APIs:** `StandardScaler`, `MaxAbsScaler`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html)


### One-Hot Encode Categories

- **Task:** One-Hot Encode Categories
- **Problem Solved:** Convert categorical columns into binary indicator columns.
- **Mental Trigger:** I need dummy variables.
- **Syntax:** `OneHotEncoder(*, categories='auto', drop=None, sparse_output=True, dtype=np.float64, handle_unknown='error', min_frequency=None, max_categories=None, feature_name_combiner='concat')`
- **Important Parameters:** `drop`, `sparse_output`, `handle_unknown`, `min_frequency`, `max_categories`
- **Return Value:** An encoder that produces one-hot encoded columns.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import OneHotEncoder

X = np.array([["red"], ["blue"], ["red"]])
enc = OneHotEncoder(sparse_output=False)
X_enc = enc.fit_transform(X)
```

- **Use When:** Nominal categorical features need model-ready numeric encoding.
- **Avoid When:** Categories are ordinal or cardinality is extremely high without grouping.
- **Gotchas:** Unknown categories need explicit handling; sparse output is the default; fit on training data only; category order is learned from data; dropping categories changes interpretability.
- **Performance Notes:** Sparse output is often preferable for high-cardinality data.
- **Related APIs:** `OrdinalEncoder`, `ColumnTransformer`, `LabelBinarizer`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)


### Ordinal Encode Categories

- **Task:** Ordinal Encode Categories
- **Problem Solved:** Convert ordered categories into integer codes.
- **Mental Trigger:** My categories have a defined order.
- **Syntax:** `OrdinalEncoder(*, categories='auto', dtype=np.float64, handle_unknown='error', unknown_value=None, encoded_missing_value=np.nan, min_frequency=None, max_categories=None)`
- **Important Parameters:** `categories`, `handle_unknown`, `unknown_value`, `encoded_missing_value`
- **Return Value:** An encoder that maps categories to integers.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import OrdinalEncoder

X = np.array([["low"], ["medium"], ["high"]])
enc = OrdinalEncoder(categories=[["low", "medium", "high"]])
X_enc = enc.fit_transform(X)
```

- **Use When:** Category order is meaningful.
- **Avoid When:** Categories are nominal and should not be ordered.
- **Gotchas:** Integer codes imply order to many estimators; unknown categories need explicit configuration; fit on training data only; category ordering is learned unless specified; missing values require deliberate handling.
- **Performance Notes:** Compact representation with minimal memory use.
- **Related APIs:** `OneHotEncoder`, `LabelEncoder`, `ColumnTransformer`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html)


### Encode Target Labels

- **Task:** Encode Target Labels
- **Problem Solved:** Convert target classes to integer labels.
- **Mental Trigger:** My target labels are strings.
- **Syntax:** `LabelEncoder()`
- **Important Parameters:** None commonly modified.
- **Return Value:** An encoder that maps target labels to integers.
- **Example:**

```python
from sklearn.preprocessing import LabelEncoder

y = ["cat", "dog", "cat"]
enc = LabelEncoder()
y_enc = enc.fit_transform(y)
```

- **Use When:** You need encoded class targets for downstream workflows.
- **Avoid When:** Encoding feature columns, where `OneHotEncoder` or `OrdinalEncoder` is usually more appropriate.
- **Gotchas:** Intended for targets, not feature columns; class order is lexicographic by default; unseen labels at transform time are unsupported; inverse mapping depends on fitted classes; keep label encoding outside feature pipelines.
- **Performance Notes:** Very lightweight.
- **Related APIs:** `LabelBinarizer`, `MultiLabelBinarizer`, `classes_`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)


### Binarize Labels

- **Task:** Binarize Labels
- **Problem Solved:** Convert a single multiclass target into a binary indicator matrix or binary labels.
- **Mental Trigger:** I need label binarization.
- **Syntax:** `LabelBinarizer(*, neg_label=0, pos_label=1, sparse_output=False)`
- **Important Parameters:** `neg_label`, `pos_label`, `sparse_output`
- **Return Value:** A binarizer for target labels.
- **Example:**

```python
from sklearn.preprocessing import LabelBinarizer

y = ["cat", "dog", "cat"]
lb = LabelBinarizer()
Y = lb.fit_transform(y)
```

- **Use When:** A binary or multiclass indicator representation is needed.
- **Avoid When:** Working with feature columns or multilabel sets.
- **Gotchas:** Binary and multiclass outputs have different shapes; unseen labels are unsupported; fit on training targets only; output shape can change with classes; sparse output may affect downstream APIs.
- **Performance Notes:** Efficient for small label sets.
- **Related APIs:** `LabelEncoder`, `MultiLabelBinarizer`, `roc_auc_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelBinarizer.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelBinarizer.html)


### Binarize Multilabel Targets

- **Task:** Binarize Multilabel Targets
- **Problem Solved:** Convert iterable label sets into a multi-hot matrix.
- **Mental Trigger:** My samples can have multiple labels.
- **Syntax:** `MultiLabelBinarizer(*, classes=None, sparse_output=False)`
- **Important Parameters:** `classes`, `sparse_output`
- **Return Value:** A binarizer that produces multilabel indicator matrices.
- **Example:**

```python
from sklearn.preprocessing import MultiLabelBinarizer

y = [("red", "blue"), ("blue",), ("green", "red")]
mlb = MultiLabelBinarizer()
Y = mlb.fit_transform(y)
```

- **Use When:** Targets are sets of labels per sample.
- **Avoid When:** You have a single-label classification target.
- **Gotchas:** Class order is learned unless specified; unseen labels at transform time are unsupported; fit on training targets only; output shape depends on class count; sparse output is useful for many labels.
- **Performance Notes:** Sparse output can save memory for wide label spaces.
- **Related APIs:** `LabelBinarizer`, `OneHotEncoder`, `classification_report`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MultiLabelBinarizer.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MultiLabelBinarizer.html)


### Add Polynomial Features

- **Task:** Add Polynomial Features
- **Problem Solved:** Create interaction and power terms from numeric inputs.
- **Mental Trigger:** I need feature expansion.
- **Syntax:** `PolynomialFeatures(degree=2, *, interaction_only=False, include_bias=True, order='C')`
- **Important Parameters:** `degree`, `interaction_only`, `include_bias`, `order`
- **Return Value:** A transformer that expands input features.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import PolynomialFeatures

X = np.array([[1.0, 2.0], [3.0, 4.0]])
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)
```

- **Use When:** Linear models need nonlinear feature combinations.
- **Avoid When:** Feature explosion would be too large.
- **Gotchas:** Feature count grows quickly; dense output can be large; the bias column may be redundant; feature names become more complex; fit on training data only.
- **Performance Notes:** Can increase memory and compute substantially.
- **Related APIs:** `Pipeline`, `PCA`, `SelectKBest`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html)


### Remove Low-Variance Features

- **Task:** Remove Low-Variance Features
- **Problem Solved:** Drop features that vary too little to be useful.
- **Mental Trigger:** Some columns are nearly constant.
- **Syntax:** `VarianceThreshold(threshold=0.0)`
- **Important Parameters:** `threshold`
- **Return Value:** A selector that removes features below the variance threshold.
- **Example:**

```python
import numpy as np
from sklearn.feature_selection import VarianceThreshold

X = np.array([[1, 0, 3], [1, 1, 3], [1, 0, 3]])
sel = VarianceThreshold(threshold=0.0)
X_sel = sel.fit_transform(X)
```

- **Use When:** You want a quick filter for near-constant columns.
- **Avoid When:** Variance alone is not a meaningful quality signal.
- **Gotchas:** Threshold must match input scale; fit only on training data; sparse inputs are handled differently; constant columns may trigger reduced dimensionality; feature names may be lost unless tracked separately.
- **Performance Notes:** Fast prefiltering step.
- **Related APIs:** `SelectKBest`, `PCA`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.VarianceThreshold.html](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.VarianceThreshold.html)


### Select Top Features

- **Task:** Select Top Features
- **Problem Solved:** Keep the best-scoring features according to a statistical test.
- **Mental Trigger:** I need a simple univariate feature filter.
- **Syntax:** `SelectKBest(score_func=f_classif, k=10)`
- **Important Parameters:** `score_func`, `k`
- **Return Value:** A selector that keeps the top-scoring features.
- **Example:**

```python
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif

X = np.array([[1, 2, 3], [2, 4, 6], [3, 6, 9]])
y = np.array([0, 1, 0])
sel = SelectKBest(score_func=f_classif, k=2)
X_sel = sel.fit_transform(X, y)
```

- **Use When:** You want a quick univariate ranking.
- **Avoid When:** Feature interactions matter more than individual signal.
- **Gotchas:** `score_func` must accept `X, y`; fit on training data only; `k` must not exceed feature count; selected features depend on the scoring function; scores may be undefined for some inputs.
- **Performance Notes:** Generally efficient for wide tabular data.
- **Related APIs:** `VarianceThreshold`, `SelectPercentile`, `mutual_info_classif`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectKBest.html](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectKBest.html)


### Reduce Dimensionality with PCA

- **Task:** Reduce Dimensionality with PCA
- **Problem Solved:** Compress numeric features into fewer orthogonal components.
- **Mental Trigger:** I need a compact representation.
- **Syntax:** `PCA(n_components=None, *, copy=True, whiten=False, svd_solver='auto', tol=0.0, iterated_power='auto', n_oversamples=10, power_iteration_normalizer='auto', random_state=None)`
- **Important Parameters:** `n_components`, `whiten`, `svd_solver`, `random_state`
- **Return Value:** A fitted PCA transformer with component projections.
- **Example:**

```python
import numpy as np
from sklearn.decomposition import PCA

X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
pca = PCA(n_components=1)
X_red = pca.fit_transform(X)
```

- **Use When:** You need dimensionality reduction for dense numeric data.
- **Avoid When:** Interpretability of original features must be preserved.
- **Gotchas:** Scale input before PCA when appropriate; fit only on training data; output is data-dependent; solver choice affects performance and numerical behavior; whitening changes the transformed scale.
- **Performance Notes:** Solver choice matters for large matrices.
- **Related APIs:** `TruncatedSVD`, `SelectKBest`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html)


### Reduce Sparse Dimensionality with TruncatedSVD

- **Task:** Reduce Sparse Dimensionality with TruncatedSVD
- **Problem Solved:** Compress sparse or high-dimensional matrices without centering.
- **Mental Trigger:** My input is sparse.
- **Syntax:** `TruncatedSVD(n_components=2, *, algorithm='randomized', n_iter=5, n_oversamples=10, power_iteration_normalizer='auto', random_state=None, tol=0.0)`
- **Important Parameters:** `n_components`, `algorithm`, `random_state`
- **Return Value:** A transformer that projects data into lower-dimensional latent space.
- **Example:**

```python
import numpy as np
from sklearn.decomposition import TruncatedSVD

X = np.array([[1.0, 0.0, 2.0], [0.0, 3.0, 0.0], [4.0, 0.0, 5.0]])
svd = TruncatedSVD(n_components=2, random_state=0)
X_red = svd.fit_transform(X)
```

- **Use When:** Data is sparse or centering would be expensive.
- **Avoid When:** You specifically need centered PCA.
- **Gotchas:** Input is not centered; fit only on training data; explained variance differs from PCA conventions; randomness affects reproducibility; feature interpretation becomes latent.
- **Performance Notes:** Often the practical choice for sparse text-like matrices.
- **Related APIs:** `PCA`, `NMF`, `Normalizer`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html)


### Create a Pipeline

- **Task:** Create a Pipeline
- **Problem Solved:** Chain preprocessing and modeling into one reusable estimator.
- **Mental Trigger:** I need one object for multiple steps.
- **Syntax:** `Pipeline(steps, *, memory=None, verbose=False, transform_input=None)`
- **Important Parameters:** `steps`, `memory`, `verbose`
- **Return Value:** A composite estimator that applies each step in sequence.
- **Example:**

```python
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("clf", LogisticRegression())
])
pipe.fit(X, y)
```

- **Use When:** Preprocessing and estimation must be packaged together.
- **Avoid When:** A single estimator is sufficient.
- **Gotchas:** Step names are used for parameter access; fit the full pipeline to avoid leakage; intermediate steps must implement `transform`; parameter grids must prefix step names; cloning occurs during fitting.
- **Performance Notes:** `memory` can cache expensive transformers.
- **Related APIs:** `make_pipeline`, `ColumnTransformer`, `GridSearchCV`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)


### Create a ColumnTransformer

- **Task:** Create a ColumnTransformer
- **Problem Solved:** Apply different preprocessing to different subsets of columns.
- **Mental Trigger:** My columns need different transforms.
- **Syntax:** `ColumnTransformer(transformers, *, remainder='drop', sparse_threshold=0.3, n_jobs=None, transformer_weights=None, verbose=False, verbose_feature_names_out=True, force_int_remainder_cols='deprecated')`
- **Important Parameters:** `transformers`, `remainder`, `sparse_threshold`, `n_jobs`, `verbose_feature_names_out`
- **Return Value:** A transformer that concatenates per-column outputs.
- **Example:**

```python
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

X = np.array([
    [1.0, "red"],
    [2.0, "blue"],
    [3.0, "red"]
], dtype=object)

ct = ColumnTransformer([
    ("num", StandardScaler(), [^0]),
    ("cat", OneHotEncoder(sparse_output=False), [^1])
])
X_out = ct.fit_transform(X)
```

- **Use When:** Numeric and categorical columns need different preprocessing.
- **Avoid When:** All columns receive the same transform.
- **Gotchas:** Column order matters; names or indices must match the input schema; sparse and dense outputs can interact with `sparse_threshold`; fit only on training data; output feature names depend on transformer settings.
- **Performance Notes:** `n_jobs` can parallelize independent transforms.
- **Related APIs:** `Pipeline`, `make_column_transformer`, `OneHotEncoder`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html](https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html)


### Create a Nested Pipeline

- **Task:** Create a Nested Pipeline
- **Problem Solved:** Compose a preprocessing pipeline inside a larger estimator graph.
- **Mental Trigger:** I need structured multi-step preprocessing.
- **Syntax:** `Pipeline(steps, *, memory=None, verbose=False, transform_input=None)`
- **Important Parameters:** `steps`, `memory`
- **Return Value:** A pipeline that can be embedded in `ColumnTransformer` or another pipeline.
- **Example:**

```python
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import LogisticRegression

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([0, 0, 1, 1])

inner = Pipeline([
    ("scale", StandardScaler()),
    ("poly", PolynomialFeatures(include_bias=False))
])

pipe = Pipeline([
    ("prep", inner),
    ("clf", LogisticRegression())
])
pipe.fit(X, y)
```

- **Use When:** A preprocessing block should be reused as a single step.
- **Avoid When:** You only need a single transform.
- **Gotchas:** Step names are nested in parameter grids; cloning applies at fit time; every intermediate step must transform; fit order matters; debugging step names can be harder in deep graphs.
- **Performance Notes:** Caching can help if the inner steps are expensive.
- **Related APIs:** `Pipeline`, `ColumnTransformer`, `make_pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)


### Build a Pipeline with Automatic Names

- **Task:** Build a Pipeline with Automatic Names
- **Problem Solved:** Create a pipeline without manually naming every step.
- **Mental Trigger:** I want a quick pipeline constructor.
- **Syntax:** `make_pipeline(*steps, memory=None, verbose=False, transform_input=None)`
- **Important Parameters:** `steps`, `memory`, `verbose`
- **Return Value:** A `Pipeline` with auto-generated step names.
- **Example:**

```python
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

pipe = make_pipeline(StandardScaler(), LogisticRegression())
pipe.fit(X, y)
```

- **Use When:** Fast prototyping is more important than custom step names.
- **Avoid When:** You need explicit step names for complex parameter grids.
- **Gotchas:** Auto-generated names may be less readable; parameter grid keys depend on generated names; cloned estimators are still separate instances; fit all preprocessing inside the pipeline; nested pipelines can become harder to inspect.
- **Performance Notes:** Equivalent runtime to `Pipeline`.
- **Related APIs:** `Pipeline`, `GridSearchCV`, `set_params`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html)


### Build a Column Transformer with Automatic Names

- **Task:** Build a Column Transformer with Automatic Names
- **Problem Solved:** Create a column-wise transformer with less boilerplate.
- **Mental Trigger:** I want automatic column-transform syntax.
- **Syntax:** `make_column_transformer(*transformers, remainder='drop', sparse_threshold=0.3, n_jobs=None, verbose=False, verbose_feature_names_out=True)`
- **Important Parameters:** `transformers`, `remainder`, `sparse_threshold`, `n_jobs`
- **Return Value:** A `ColumnTransformer` with generated names.
- **Example:**

```python
import numpy as np
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

X = np.array([[1.0, "red"], [2.0, "blue"]], dtype=object)

ct = make_column_transformer(
    (StandardScaler(), [^0]),
    (OneHotEncoder(sparse_output=False), [^1])
)
ct.fit_transform(X)
```

- **Use When:** You want a concise tabular preprocessing definition.
- **Avoid When:** You need explicit step names for a large production grid.
- **Gotchas:** Generated names affect parameter access; column references must still be correct; fit only on training data; output feature names may change with verbosity settings; sparse concatenation may surprise downstream estimators.
- **Performance Notes:** `n_jobs` can parallelize transformers.
- **Related APIs:** `ColumnTransformer`, `Pipeline`, `make_pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.compose.make_column_transformer.html](https://scikit-learn.org/stable/modules/generated/sklearn.compose.make_column_transformer.html)


### Train Logistic Regression

- **Task:** Train Logistic Regression
- **Problem Solved:** Fit a linear classifier for binary or multiclass prediction.
- **Mental Trigger:** I need a fast baseline classifier.
- **Syntax:** `LogisticRegression(penalty='l2', *, dual=False, tol=0.0001, C=1.0, fit_intercept=True, intercept_scaling=1, class_weight=None, random_state=None, solver='lbfgs', max_iter=100, multi_class='deprecated', verbose=0, warm_start=False, n_jobs=None, l1_ratio=None)`
- **Important Parameters:** `C`, `solver`, `max_iter`, `class_weight`, `random_state`
- **Return Value:** A fitted classifier with `predict`, `predict_proba`, and `score`.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression()
clf.fit(X, y)
```

- **Use When:** You need a standard discriminative classifier.
- **Avoid When:** The data is not linearly separable and feature engineering is limited.
- **Gotchas:** Some solvers need scaled data; `max_iter` may need to be increased; multiclass behavior depends on the solver; `class_weight='balanced'` changes optimization; randomness affects some solvers.
- **Performance Notes:** `n_jobs` is solver-dependent and often limited in effect.
- **Related APIs:** `LinearRegression`, `Ridge`, `SVC`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)


### Train Linear Regression

- **Task:** Train Linear Regression
- **Problem Solved:** Fit an ordinary least squares regressor.
- **Mental Trigger:** I need a basic continuous predictor.
- **Syntax:** `LinearRegression(*, fit_intercept=True, copy_X=True, n_jobs=None, positive=False)`
- **Important Parameters:** `fit_intercept`, `n_jobs`, `positive`
- **Return Value:** A fitted regressor with coefficients and intercept.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1.0], [2.0], [3.0]])
y = np.array([2.0, 4.0, 6.0])

reg = LinearRegression()
reg.fit(X, y)
```

- **Use When:** You need a simple regression baseline.
- **Avoid When:** Strong regularization or nonlinear structure is required.
- **Gotchas:** Assumes dense linear relationships; fit on training data only; `positive=True` changes constraints; sample weights alter fitting; collinearity can affect coefficients.
- **Performance Notes:** Can parallelize only in some configurations.
- **Related APIs:** `Ridge`, `Lasso`, `ElasticNet`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)


### Train Ridge Regression

- **Task:** Train Ridge Regression
- **Problem Solved:** Fit a linear model with L2 regularization.
- **Mental Trigger:** I need a regularized linear regressor.
- **Syntax:** `Ridge(alpha=1.0, *, fit_intercept=True, copy_X=True, max_iter=None, tol=0.0001, solver='auto', positive=False, random_state=None)`
- **Important Parameters:** `alpha`, `solver`, `max_iter`, `random_state`
- **Return Value:** A fitted ridge regressor.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import Ridge

X = np.array([[1.0], [2.0], [3.0]])
y = np.array([1.0, 2.0, 3.0])

reg = Ridge(alpha=1.0)
reg.fit(X, y)
```

- **Use When:** Multicollinearity or overfitting needs control.
- **Avoid When:** Sparse coefficients are required.
- **Gotchas:** Solver choice matters for large data; fit on training data only; `alpha` scale matters; `positive=True` changes constraints; `random_state` affects some solvers.
- **Performance Notes:** Solver behavior influences scalability.
- **Related APIs:** `Lasso`, `ElasticNet`, `LinearRegression`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)


### Train Lasso

- **Task:** Train Lasso
- **Problem Solved:** Fit a linear model with L1 regularization.
- **Mental Trigger:** I need sparse coefficients.
- **Syntax:** `Lasso(alpha=1.0, *, fit_intercept=True, precompute=False, copy_X=True, max_iter=1000, tol=0.0001, warm_start=False, positive=False, random_state=None, selection='cyclic')`
- **Important Parameters:** `alpha`, `max_iter`, `tol`, `selection`, `random_state`
- **Return Value:** A fitted sparse linear regressor.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import Lasso

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([1.0, 2.0, 3.0, 4.0])

reg = Lasso(alpha=0.1)
reg.fit(X, y)
```

- **Use When:** Feature sparsity is useful.
- **Avoid When:** You need stable coefficients with correlated predictors.
- **Gotchas:** Features should usually be scaled; `max_iter` may need tuning; `alpha` controls sparsity strength; convergence warnings matter; fit on training data only.
- **Performance Notes:** Coordinate descent can be efficient but may need many iterations.
- **Related APIs:** `Ridge`, `ElasticNet`, `LinearRegression`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html)


### Train Elastic Net

- **Task:** Train Elastic Net
- **Problem Solved:** Fit a linear model combining L1 and L2 regularization.
- **Mental Trigger:** I need a mixed-penalty linear model.
- **Syntax:** `ElasticNet(alpha=1.0, *, l1_ratio=0.5, fit_intercept=True, precompute=False, max_iter=1000, copy_X=True, tol=0.0001, warm_start=False, positive=False, random_state=None, selection='cyclic')`
- **Important Parameters:** `alpha`, `l1_ratio`, `max_iter`, `tol`, `random_state`
- **Return Value:** A fitted elastic-net regressor.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import ElasticNet

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([1.0, 2.0, 3.0, 4.0])

reg = ElasticNet(alpha=0.1, l1_ratio=0.5)
reg.fit(X, y)
```

- **Use When:** You want both shrinkage and sparsity.
- **Avoid When:** A pure ridge or lasso model is enough.
- **Gotchas:** Scaling usually matters; convergence may require more iterations; `l1_ratio` changes sparsity behavior; fit on training data only; correlated features affect coefficient stability.
- **Performance Notes:** Coordinate descent scales well on many tabular problems.
- **Related APIs:** `Lasso`, `Ridge`, `SGDRegressor`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html)


### Train Decision Tree Classifier

- **Task:** Train Decision Tree Classifier
- **Problem Solved:** Fit a tree-based classifier with rule-based splits.
- **Mental Trigger:** I need an interpretable tree baseline.
- **Syntax:** `DecisionTreeClassifier(*, criterion='gini', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None, class_weight=None, ccp_alpha=0.0)`
- **Important Parameters:** `criterion`, `max_depth`, `min_samples_leaf`, `random_state`, `class_weight`
- **Return Value:** A fitted decision tree classifier.
- **Example:**

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = DecisionTreeClassifier(random_state=0)
clf.fit(X, y)
```

- **Use When:** You need a nonlinear tree baseline.
- **Avoid When:** High variance is unacceptable without regularization.
- **Gotchas:** Trees can overfit easily; `random_state` controls tie-breaking and splits; feature scaling is usually unnecessary; class weights affect split criteria; pruning parameters interact.
- **Performance Notes:** Training cost grows with data size and depth.
- **Related APIs:** `DecisionTreeRegressor`, `RandomForestClassifier`, `ExtraTreesClassifier`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html)


### Train Decision Tree Regressor

- **Task:** Train Decision Tree Regressor
- **Problem Solved:** Fit a tree-based regressor for nonlinear continuous prediction.
- **Mental Trigger:** I need a nonlinear regressor.
- **Syntax:** `DecisionTreeRegressor(*, criterion='squared_error', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None, ccp_alpha=0.0)`
- **Important Parameters:** `criterion`, `max_depth`, `min_samples_leaf`, `random_state`, `ccp_alpha`
- **Return Value:** A fitted decision tree regressor.
- **Example:**

```python
import numpy as np
from sklearn.tree import DecisionTreeRegressor

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0.0, 1.0, 1.5, 3.0])

reg = DecisionTreeRegressor(random_state=0)
reg.fit(X, y)
```

- **Use When:** You need a nonlinear regression baseline.
- **Avoid When:** You need smooth extrapolation.
- **Gotchas:** Trees do not extrapolate well; `random_state` affects reproducibility; overfitting is common without limits; pruning can help control depth; scaling usually is not required.
- **Performance Notes:** Depth and sample size dominate runtime.
- **Related APIs:** `DecisionTreeClassifier`, `RandomForestRegressor`, `GradientBoostingRegressor`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html)


### Train Random Forest Classifier

- **Task:** Train Random Forest Classifier
- **Problem Solved:** Fit an ensemble classifier using many randomized decision trees.
- **Mental Trigger:** I need a strong general-purpose classifier.
- **Syntax:** `RandomForestClassifier(n_estimators=100, *, criterion='gini', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features='sqrt', max_leaf_nodes=None, bootstrap=True, oob_score=False, n_jobs=None, random_state=None, verbose=0, warm_start=False, class_weight=None, ccp_alpha=0.0, max_samples=None)`
- **Important Parameters:** `n_estimators`, `max_depth`, `n_jobs`, `random_state`, `class_weight`
- **Return Value:** A fitted forest classifier.
- **Example:**

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = RandomForestClassifier(n_estimators=10, random_state=0)
clf.fit(X, y)
```

- **Use When:** You need a robust default classifier.
- **Avoid When:** Latency and model size must be minimal.
- **Gotchas:** More trees increase memory; `random_state` affects reproducibility; `n_jobs` can improve training speed; feature importance from trees can be misleading; preprocessing is often still needed for missing values and categorical features.
- **Performance Notes:** Parallel training is supported with `n_jobs`.
- **Related APIs:** `ExtraTreesClassifier`, `GradientBoostingClassifier`, `BaggingClassifier`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)


### Train Random Forest Regressor

- **Task:** Train Random Forest Regressor
- **Problem Solved:** Fit an ensemble regressor using randomized trees.
- **Mental Trigger:** I need a strong regression baseline.
- **Syntax:** `RandomForestRegressor(n_estimators=100, *, criterion='squared_error', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=1.0, max_leaf_nodes=None, bootstrap=True, oob_score=False, n_jobs=None, random_state=None, verbose=0, warm_start=False, ccp_alpha=0.0, max_samples=None)`
- **Important Parameters:** `n_estimators`, `max_depth`, `n_jobs`, `random_state`, `max_samples`
- **Return Value:** A fitted forest regressor.
- **Example:**

```python
import numpy as np
from sklearn.ensemble import RandomForestRegressor

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0.0, 1.0, 1.5, 3.0])

reg = RandomForestRegressor(n_estimators=10, random_state=0)
reg.fit(X, y)
```

- **Use When:** You need a nonlinear regressor with strong defaults.
- **Avoid When:** Model size or prediction latency is tightly constrained.
- **Gotchas:** Trees do not extrapolate; `n_jobs` can help training; random state affects reproducibility; feature importance may be unstable; `oob_score` only works with bootstrap.
- **Performance Notes:** Parallelizable and memory-intensive at larger tree counts.
- **Related APIs:** `RandomForestClassifier`, `ExtraTreesRegressor`, `HistGradientBoostingRegressor`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html)


### Train Extra Trees

- **Task:** Train Extra Trees
- **Problem Solved:** Fit a highly randomized tree ensemble for classification or regression.
- **Mental Trigger:** I need a fast randomized forest.
- **Syntax:** `ExtraTreesClassifier(...)` and `ExtraTreesRegressor(...)`
- **Important Parameters:** `n_estimators`, `max_depth`, `n_jobs`, `random_state`, `class_weight`
- **Return Value:** A fitted extra-trees ensemble.
- **Example:**

```python
import numpy as np
from sklearn.ensemble import ExtraTreesClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = ExtraTreesClassifier(n_estimators=10, random_state=0)
clf.fit(X, y)
```

- **Use When:** You want faster randomized tree ensembles.
- **Avoid When:** You need carefully interpretable split rules.
- **Gotchas:** Randomization affects reproducibility; `n_jobs` helps; model size grows with tree count; feature importance may still be unstable; preprocessing requirements are similar to other tree ensembles.
- **Performance Notes:** Often fast and parallelizable.
- **Related APIs:** `RandomForestClassifier`, `RandomForestRegressor`, `BaggingClassifier`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html)


### Train Gradient Boosting

- **Task:** Train Gradient Boosting
- **Problem Solved:** Fit a boosted tree ensemble for classification or regression.
- **Mental Trigger:** I need a boosting baseline.
- **Syntax:** `GradientBoostingClassifier(...)` and `GradientBoostingRegressor(...)`
- **Important Parameters:** `learning_rate`, `n_estimators`, `max_depth`, `random_state`, `subsample`
- **Return Value:** A fitted gradient boosting ensemble.
- **Example:**

```python
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = GradientBoostingClassifier(random_state=0)
clf.fit(X, y)
```

- **Use When:** You want strong tabular performance with classical boosting.
- **Avoid When:** You need fast training on very large datasets.
- **Gotchas:** Sensitive to hyperparameters; random state matters when subsampling; feature scaling usually is not required; overfitting can happen with too many trees; fit on training data only.
- **Performance Notes:** Not as scalable as histogram-based boosting.
- **Related APIs:** `HistGradientBoostingClassifier`, `AdaBoostClassifier`, `RandomForestClassifier`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html)


### Train Histogram Gradient Boosting

- **Task:** Train Histogram Gradient Boosting
- **Problem Solved:** Fit a fast boosted tree model for large tabular datasets.
- **Mental Trigger:** I need a scalable boosting model.
- **Syntax:** `HistGradientBoostingClassifier(...)` and `HistGradientBoostingRegressor(...)`
- **Important Parameters:** `learning_rate`, `max_depth`, `max_iter`, `random_state`, `early_stopping`
- **Return Value:** A fitted histogram-based gradient boosting model.
- **Example:**

```python
import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = HistGradientBoostingClassifier(random_state=0)
clf.fit(X, y)
```

- **Use When:** You need a fast modern tree booster on tabular data.
- **Avoid When:** You require the exact API behavior of classical gradient boosting.
- **Gotchas:** Supports missing values differently from older tree ensembles; random state affects splits and boosting; early stopping changes training behavior; categorical handling requires explicit configuration; fit on training data only.
- **Performance Notes:** Designed for better scalability than classical gradient boosting.
- **Related APIs:** `GradientBoostingClassifier`, `RandomForestClassifier`, `AdaBoostClassifier`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingClassifier.html)


### Train AdaBoost

- **Task:** Train AdaBoost
- **Problem Solved:** Fit a boosted ensemble using weak learners.
- **Mental Trigger:** I need boosting with simple base learners.
- **Syntax:** `AdaBoostClassifier(estimator=None, *, n_estimators=50, learning_rate=1.0, algorithm='deprecated', random_state=None)` and `AdaBoostRegressor(...)`
- **Important Parameters:** `estimator`, `n_estimators`, `learning_rate`, `random_state`
- **Return Value:** A fitted AdaBoost model.
- **Example:**

```python
import numpy as np
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1, random_state=0),
    random_state=0
)
clf.fit(X, y)
```

- **Use When:** You want a classic boosting ensemble.
- **Avoid When:** You need the strongest modern tabular booster.
- **Gotchas:** The default base estimator behavior has changed over versions; random state affects reproducibility; weak learner choice matters; large `n_estimators` can overfit; fit on training data only.
- **Performance Notes:** Usually smaller than large random forests.
- **Related APIs:** `GradientBoostingClassifier`, `HistGradientBoostingClassifier`, `BaggingClassifier`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostClassifier.html)


### Train K-Nearest Neighbors Classifier

- **Task:** Train K-Nearest Neighbors Classifier
- **Problem Solved:** Fit a distance-based classifier.
- **Mental Trigger:** I need a local similarity model.
- **Syntax:** `KNeighborsClassifier(n_neighbors=5, *, weights='uniform', algorithm='auto', leaf_size=30, p=2, metric='minkowski', metric_params=None, n_jobs=None)`
- **Important Parameters:** `n_neighbors`, `weights`, `algorithm`, `p`, `n_jobs`
- **Return Value:** A fitted nearest-neighbor classifier.
- **Example:**

```python
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = KNeighborsClassifier(n_neighbors=3)
clf.fit(X, y)
```

- **Use When:** Local neighborhood structure matters.
- **Avoid When:** Prediction latency must be very low at scale.
- **Gotchas:** Feature scaling is usually critical; prediction can be expensive; training stores the dataset; `n_jobs` helps some queries; metric choice changes behavior.
- **Performance Notes:** Training is cheap, inference can be costly.
- **Related APIs:** `KNeighborsRegressor`, `NearestNeighbors`, `StandardScaler`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html)


### Train K-Nearest Neighbors Regressor

- **Task:** Train K-Nearest Neighbors Regressor
- **Problem Solved:** Fit a distance-based regressor.
- **Mental Trigger:** I need local interpolation.
- **Syntax:** `KNeighborsRegressor(n_neighbors=5, *, weights='uniform', algorithm='auto', leaf_size=30, p=2, metric='minkowski', metric_params=None, n_jobs=None)`
- **Important Parameters:** `n_neighbors`, `weights`, `algorithm`, `p`, `n_jobs`
- **Return Value:** A fitted nearest-neighbor regressor.
- **Example:**

```python
import numpy as np
from sklearn.neighbors import KNeighborsRegressor

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0.0, 1.0, 1.5, 3.0])

reg = KNeighborsRegressor(n_neighbors=2)
reg.fit(X, y)
```

- **Use When:** Nearby points should have similar outputs.
- **Avoid When:** The dataset is large and low-latency inference is required.
- **Gotchas:** Scale features before use; prediction cost grows with training size; stored training data can be memory heavy; metric choice matters; weights influence smoothing.
- **Performance Notes:** Consider approximate-neighbor alternatives outside scikit-learn if scale is extreme.
- **Related APIs:** `KNeighborsClassifier`, `NearestNeighbors`, `MinMaxScaler`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html)


### Train SVC

- **Task:** Train SVC
- **Problem Solved:** Fit a support vector classifier.
- **Mental Trigger:** I need a kernel classifier.
- **Syntax:** `SVC(C=1.0, *, kernel='rbf', degree=3, gamma='scale', coef0=0.0, shrinking=True, probability=False, tol=0.001, cache_size=200, class_weight=None, verbose=False, max_iter=-1, decision_function_shape='ovr', break_ties=False, random_state=None)`
- **Important Parameters:** `C`, `kernel`, `gamma`, `probability`, `class_weight`
- **Return Value:** A fitted classifier exposing `predict` and optionally `predict_proba`.
- **Example:**

```python
import numpy as np
from sklearn.svm import SVC

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = SVC(probability=True, random_state=0)
clf.fit(X, y)
```

- **Use When:** You need a kernelized classifier.
- **Avoid When:** Training data is very large.
- **Gotchas:** Scaling is often required; `probability=True` adds cost; `random_state` affects probability calibration in that mode; kernel choice matters; fit on training data only.
- **Performance Notes:** Can be expensive on larger datasets.
- **Related APIs:** `SVR`, `LinearSVC`, `StandardScaler`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html)


### Train SVR

- **Task:** Train SVR
- **Problem Solved:** Fit a support vector regressor.
- **Mental Trigger:** I need a kernel regressor.
- **Syntax:** `SVR(C=1.0, *, epsilon=0.1, kernel='rbf', degree=3, gamma='scale', coef0=0.0, shrinking=True, tol=0.001, cache_size=200, verbose=False, max_iter=-1)`
- **Important Parameters:** `C`, `epsilon`, `kernel`, `gamma`, `cache_size`
- **Return Value:** A fitted regressor with `predict`.
- **Example:**

```python
import numpy as np
from sklearn.svm import SVR

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0.0, 1.0, 1.5, 3.0])

reg = SVR()
reg.fit(X, y)
```

- **Use When:** You need kernelized regression.
- **Avoid When:** Data is large or simple linear regression is adequate.
- **Gotchas:** Scaling is usually required; `epsilon` controls the insensitive zone; fit on training data only; probability outputs are unavailable; runtime can grow quickly with sample size.
- **Performance Notes:** Memory and compute can increase sharply with dataset size.
- **Related APIs:** `SVC`, `LinearSVR`, `KNeighborsRegressor`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html)


### Train Gaussian Naive Bayes

- **Task:** Train Gaussian Naive Bayes
- **Problem Solved:** Fit a fast probabilistic classifier for continuous features.
- **Mental Trigger:** I need a simple probabilistic baseline.
- **Syntax:** `GaussianNB(*, priors=None, var_smoothing=1e-09)`
- **Important Parameters:** `priors`, `var_smoothing`
- **Return Value:** A fitted classifier with class likelihood estimates.
- **Example:**

```python
import numpy as np
from sklearn.naive_bayes import GaussianNB

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([0, 0, 1, 1])

clf = GaussianNB()
clf.fit(X, y)
```

- **Use When:** You need a fast baseline on continuous features.
- **Avoid When:** Feature independence assumptions are too restrictive for the task.
- **Gotchas:** Sensitive to feature distributions; fit on training data only; `var_smoothing` can stabilize numerics; `predict_proba` is available; sparse input handling is limited.
- **Performance Notes:** Very fast and lightweight.
- **Related APIs:** `MultinomialNB`, `BernoulliNB`, `CalibratedClassifierCV`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html)


### Train Multinomial Naive Bayes

- **Task:** Train Multinomial Naive Bayes
- **Problem Solved:** Fit a probabilistic classifier for count or nonnegative feature data.
- **Mental Trigger:** I need a count-based classifier.
- **Syntax:** `MultinomialNB(*, alpha=1.0, force_alpha=True, fit_prior=True, class_prior=None)`
- **Important Parameters:** `alpha`, `force_alpha`, `fit_prior`, `class_prior`
- **Return Value:** A fitted multinomial naive Bayes classifier.
- **Example:**

```python
import numpy as np
from sklearn.naive_bayes import MultinomialNB

X = np.array([[2, 1], [1, 3], [4, 0], [0, 5]])
y = np.array([0, 0, 1, 1])

clf = MultinomialNB()
clf.fit(X, y)
```

- **Use When:** Features are nonnegative counts or frequencies.
- **Avoid When:** Features can be negative.
- **Gotchas:** Negative inputs are invalid; fit on training data only; smoothing affects rare features; class priors change predictions; sparse matrices are commonly used.
- **Performance Notes:** Efficient for high-dimensional sparse data.
- **Related APIs:** `BernoulliNB`, `GaussianNB`, `OneHotEncoder`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html)


### Train Bernoulli Naive Bayes

- **Task:** Train Bernoulli Naive Bayes
- **Problem Solved:** Fit a probabilistic classifier for binary features.
- **Mental Trigger:** I need a binary-feature baseline.
- **Syntax:** `BernoulliNB(*, alpha=1.0, force_alpha=True, binarize=0.0, fit_prior=True, class_prior=None)`
- **Important Parameters:** `alpha`, `binarize`, `fit_prior`, `class_prior`
- **Return Value:** A fitted Bernoulli naive Bayes classifier.
- **Example:**

```python
import numpy as np
from sklearn.naive_bayes import BernoulliNB

X = np.array([[1, 0], [0, 1], [1, 1], [0, 0]])
y = np.array([0, 1, 0, 1])

clf = BernoulliNB()
clf.fit(X, y)
```

- **Use When:** Features are binary or can be binarized.
- **Avoid When:** Inputs are continuous without binarization.
- **Gotchas:** Inputs may be binarized internally; fit on training data only; smoothing matters on sparse features; class priors influence outputs; negative values are not appropriate.
- **Performance Notes:** Lightweight and suitable for sparse binary matrices.
- **Related APIs:** `MultinomialNB`, `LabelBinarizer`, `OneHotEncoder`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.BernoulliNB.html](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.BernoulliNB.html)


### Cluster with K-Means

- **Task:** Cluster with K-Means
- **Problem Solved:** Partition samples into k clusters.
- **Mental Trigger:** I need centroid-based clustering.
- **Syntax:** `KMeans(n_clusters=8, *, init='k-means++', n_init='auto', max_iter=300, tol=0.0001, verbose=0, random_state=None, copy_x=True, algorithm='lloyd')`
- **Important Parameters:** `n_clusters`, `init`, `n_init`, `max_iter`, `random_state`
- **Return Value:** A fitted clustering estimator with labels and centroids.
- **Example:**

```python
import numpy as np
from sklearn.cluster import KMeans

X = np.array([[0.0], [1.0], [2.0], [10.0], [11.0]])
km = KMeans(n_clusters=2, random_state=0)
km.fit(X)
```

- **Use When:** You need a fast, standard clustering baseline.
- **Avoid When:** Clusters are non-spherical or density-based.
- **Gotchas:** Scaling affects distance-based results; `n_init` controls stability; random state affects initialization; labels are arbitrary; fit on transformed features when appropriate.
- **Performance Notes:** Can be expensive on large dense data but generally efficient.
- **Related APIs:** `MiniBatchKMeans`, `DBSCAN`, `PCA`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)


### Cluster with DBSCAN

- **Task:** Cluster with DBSCAN
- **Problem Solved:** Find clusters based on local density and mark noise points.
- **Mental Trigger:** I need density-based clustering.
- **Syntax:** `DBSCAN(eps=0.5, *, min_samples=5, metric='euclidean', metric_params=None, algorithm='auto', leaf_size=30, p=None, n_jobs=None)`
- **Important Parameters:** `eps`, `min_samples`, `metric`, `n_jobs`
- **Return Value:** A fitted density-based clustering estimator.
- **Example:**

```python
import numpy as np
from sklearn.cluster import DBSCAN

X = np.array([[0.0], [0.1], [0.2], [3.0], [3.1]])
db = DBSCAN(eps=0.3, min_samples=2)
db.fit(X)
```

- **Use When:** Cluster shapes are irregular or noise is expected.
- **Avoid When:** You need a fixed number of clusters.
- **Gotchas:** Parameter tuning is sensitive; scaling affects distance behavior; labels may include `-1` for noise; `n_jobs` can help neighbor search; fit on training data only.
- **Performance Notes:** Can become expensive for large high-dimensional data.
- **Related APIs:** `KMeans`, `NearestNeighbors`, `OPTICS`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html)


### Tune with Grid Search

- **Task:** Tune with Grid Search
- **Problem Solved:** Exhaustively search a parameter grid for the best model settings.
- **Mental Trigger:** I need systematic hyperparameter search.
- **Syntax:** `GridSearchCV(estimator, param_grid, *, scoring=None, n_jobs=None, refit=True, cv=None, verbose=0, pre_dispatch='2*n_jobs', error_score=nan, return_train_score=False)`
- **Important Parameters:** `estimator`, `param_grid`, `scoring`, `cv`, `n_jobs`
- **Return Value:** A fitted search object with `best_estimator_`, `best_params_`, and `cv_results_`.
- **Example:**

```python
import numpy as np
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

search = GridSearchCV(SVC(), {"C": [0.1, 1.0], "kernel": ["linear", "rbf"]}, cv=2)
search.fit(X, y)
```

- **Use When:** The search space is small and discrete.
- **Avoid When:** You need faster approximate search over many settings.
- **Gotchas:** Parameter names must match estimator names; preprocessing should be in the pipeline; cross-validation strategy affects results; parallelism can increase memory; refitting happens on the full training set when enabled.
- **Performance Notes:** Compute cost grows multiplicatively with grid size and folds.
- **Related APIs:** `RandomizedSearchCV`, `HalvingGridSearchCV`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html)


### Tune with Randomized Search

- **Task:** Tune with Randomized Search
- **Problem Solved:** Search hyperparameters by sampling from distributions.
- **Mental Trigger:** I need a cheaper hyperparameter search.
- **Syntax:** `RandomizedSearchCV(estimator, param_distributions, *, n_iter=10, scoring=None, n_jobs=None, refit=True, cv=None, verbose=0, random_state=None, error_score=nan, return_train_score=False)`
- **Important Parameters:** `param_distributions`, `n_iter`, `scoring`, `cv`, `random_state`
- **Return Value:** A fitted randomized search object.
- **Example:**

```python
import numpy as np
from sklearn.svm import SVC
from sklearn.model_selection import RandomizedSearchCV

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

search = RandomizedSearchCV(SVC(), {"C": [0.1, 1.0, 10.0]}, n_iter=2, cv=2, random_state=0)
search.fit(X, y)
```

- **Use When:** The search space is large or continuous.
- **Avoid When:** You need deterministic coverage of all combinations.
- **Gotchas:** Distributions should match parameter semantics; random state affects sampled configurations; preprocessing belongs in a pipeline; `n_iter` too small can miss good settings; parallel runs can consume memory.
- **Performance Notes:** Often much cheaper than exhaustive grid search.
- **Related APIs:** `GridSearchCV`, `HalvingRandomSearchCV`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html)


### Tune with Successive Halving Grid Search

- **Task:** Tune with Successive Halving Grid Search
- **Problem Solved:** Search a grid while aggressively pruning poor candidates.
- **Mental Trigger:** I need faster model selection than full grid search.
- **Syntax:** `HalvingGridSearchCV(estimator, param_grid, *, factor=3, resource='n_samples', max_resources='auto', min_resources='exhaust', aggressive_elimination=False, cv=5, scoring=None, refit=True, n_jobs=None, verbose=0, random_state=None, error_score=nan, return_train_score=False)`
- **Important Parameters:** `param_grid`, `factor`, `resource`, `cv`, `n_jobs`
- **Return Value:** A fitted halving search object with best parameters and results.
- **Example:**

```python
import numpy as np
from sklearn.svm import SVC
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingGridSearchCV

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

search = HalvingGridSearchCV(SVC(), {"C": [0.1, 1.0, 10.0]}, cv=2)
search.fit(X, y)
```

- **Use When:** You want adaptive pruning during search.
- **Avoid When:** You need a simple exhaustive search.
- **Gotchas:** Requires experimental enabling import; the resource parameter must be meaningful; preprocessing should be in a pipeline; candidate elimination is approximate; refitting happens after selection.
- **Performance Notes:** Can save substantial compute compared with full grid search.
- **Related APIs:** `HalvingRandomSearchCV`, `GridSearchCV`, `RandomizedSearchCV`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingGridSearchCV.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingGridSearchCV.html)


### Tune with Successive Halving Random Search

- **Task:** Tune with Successive Halving Random Search
- **Problem Solved:** Sample and prune hyperparameter candidates efficiently.
- **Mental Trigger:** I need adaptive random hyperparameter search.
- **Syntax:** `HalvingRandomSearchCV(estimator, param_distributions, *, n_candidates='exhaust', factor=3, resource='n_samples', max_resources='auto', min_resources='exhaust', aggressive_elimination=False, cv=5, scoring=None, refit=True, n_jobs=None, verbose=0, random_state=None, error_score=nan, return_train_score=False)`
- **Important Parameters:** `param_distributions`, `n_candidates`, `factor`, `cv`, `random_state`
- **Return Value:** A fitted halving random search object.
- **Example:**

```python
import numpy as np
from sklearn.svm import SVC
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingRandomSearchCV

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

search = HalvingRandomSearchCV(SVC(), {"C": [0.1, 1.0, 10.0]}, cv=2, random_state=0)
search.fit(X, y)
```

- **Use When:** You want a compute-efficient search over a large space.
- **Avoid When:** Exhaustive evaluation is cheap enough.
- **Gotchas:** Experimental import is required; randomness affects candidate sampling; the chosen resource must work for the estimator; pipeline parameter naming still applies; pruning can discard promising late-blooming candidates.
- **Performance Notes:** Often the most efficient built-in search for large grids.
- **Related APIs:** `HalvingGridSearchCV`, `RandomizedSearchCV`, `GridSearchCV`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingRandomSearchCV.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingRandomSearchCV.html)


### Score Classification

- **Task:** Score Classification
- **Problem Solved:** Compute the fraction of correctly classified samples.
- **Mental Trigger:** I need a quick classification score.
- **Syntax:** `accuracy_score(y_true, y_pred, *, normalize=True, sample_weight=None)`
- **Important Parameters:** `normalize`, `sample_weight`
- **Return Value:** A float accuracy score or count if `normalize=False`.
- **Example:**

```python
from sklearn.metrics import accuracy_score

y_true = [0, 1, 1]
y_pred = [0, 0, 1]
score = accuracy_score(y_true, y_pred)
```

- **Use When:** Accuracy is an appropriate summary metric.
- **Avoid When:** Class imbalance makes accuracy misleading.
- **Gotchas:** Can hide minority-class errors; sample weights change interpretation; use only on aligned targets; threshold choice affects predictions; not suitable as a sole metric for imbalanced problems.
- **Performance Notes:** Very fast.
- **Related APIs:** `balanced_accuracy_score`, `classification_report`, `confusion_matrix`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)


### Score Precision

- **Task:** Score Precision
- **Problem Solved:** Measure the fraction of predicted positives that are correct.
- **Mental Trigger:** False positives are costly.
- **Syntax:** `precision_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')`
- **Important Parameters:** `average`, `pos_label`, `zero_division`, `sample_weight`
- **Return Value:** A precision score.
- **Example:**

```python
from sklearn.metrics import precision_score

y_true = [0, 1, 1]
y_pred = [0, 1, 0]
score = precision_score(y_true, y_pred)
```

- **Use When:** Precision matters more than recall.
- **Avoid When:** You need a threshold-independent ranking metric.
- **Gotchas:** `average` must match the task shape; zero predicted positives can cause warnings; binary defaults may not suit multiclass data; thresholds matter; label alignment is important.
- **Performance Notes:** Very fast.
- **Related APIs:** `recall_score`, `f1_score`, `precision_recall_curve`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)


### Score Recall

- **Task:** Score Recall
- **Problem Solved:** Measure the fraction of actual positives that are found.
- **Mental Trigger:** Missing positives is costly.
- **Syntax:** `recall_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')`
- **Important Parameters:** `average`, `pos_label`, `zero_division`, `sample_weight`
- **Return Value:** A recall score.
- **Example:**

```python
from sklearn.metrics import recall_score

y_true = [0, 1, 1]
y_pred = [0, 1, 0]
score = recall_score(y_true, y_pred)
```

- **Use When:** Coverage of positives is important.
- **Avoid When:** Ranking or probability quality matters more.
- **Gotchas:** Average mode must fit the problem type; thresholds affect results; missing predicted positives can distort interpretation; binary defaults may mislead in multiclass tasks; warnings can appear for undefined cases.
- **Performance Notes:** Very fast.
- **Related APIs:** `precision_score`, `f1_score`, `balanced_accuracy_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)


### Score F1

- **Task:** Score F1
- **Problem Solved:** Compute the harmonic mean of precision and recall.
- **Mental Trigger:** I need a single balance metric.
- **Syntax:** `f1_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')`
- **Important Parameters:** `average`, `pos_label`, `zero_division`, `sample_weight`
- **Return Value:** An F1 score.
- **Example:**

```python
from sklearn.metrics import f1_score

y_true = [0, 1, 1]
y_pred = [0, 1, 0]
score = f1_score(y_true, y_pred)
```

- **Use When:** You want a single precision/recall tradeoff metric.
- **Avoid When:** You need separate precision and recall visibility.
- **Gotchas:** Thresholds matter; averaging choices are task-specific; zero division may warn; class imbalance can still complicate interpretation; do not compare across incompatible averaging modes.
- **Performance Notes:** Very fast.
- **Related APIs:** `precision_score`, `recall_score`, `classification_report`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)


### Score ROC AUC

- **Task:** Score ROC AUC
- **Problem Solved:** Measure ranking quality using ROC area under the curve.
- **Mental Trigger:** I need threshold-free classification ranking.
- **Syntax:** `roc_auc_score(y_true, y_score, *, average='macro', sample_weight=None, max_fpr=None, multi_class='raise', labels=None)`
- **Important Parameters:** `average`, `multi_class`, `labels`, `sample_weight`
- **Return Value:** A scalar ROC AUC score.
- **Example:**

```python
import numpy as np
from sklearn.metrics import roc_auc_score

y_true = np.array([0, 0, 1, 1])
y_score = np.array([0.1, 0.4, 0.35, 0.8])
score = roc_auc_score(y_true, y_score)
```

- **Use When:** Model ranking quality matters more than a fixed threshold.
- **Avoid When:** You only have hard class predictions.
- **Gotchas:** Use scores, not labels, where required; multiclass settings need explicit configuration; class imbalance can complicate interpretation; tied scores affect curves; `max_fpr` is specialized.
- **Performance Notes:** Efficient for typical classification sizes.
- **Related APIs:** `roc_curve`, `precision_recall_curve`, `average_precision_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html)


### Build a Confusion Matrix

- **Task:** Build a Confusion Matrix
- **Problem Solved:** Tabulate correct and incorrect class predictions by class pair.
- **Mental Trigger:** I need prediction counts by class.
- **Syntax:** `confusion_matrix(y_true, y_pred, *, labels=None, sample_weight=None, normalize=None)`
- **Important Parameters:** `labels`, `normalize`, `sample_weight`
- **Return Value:** An array of confusion counts or normalized rates.
- **Example:**

```python
from sklearn.metrics import confusion_matrix

y_true = [0, 1, 1]
y_pred = [0, 0, 1]
cm = confusion_matrix(y_true, y_pred)
```

- **Use When:** You need error breakdown by class.
- **Avoid When:** A scalar summary is sufficient.
- **Gotchas:** Label ordering matters; normalization changes interpretation; class labels must align; sample weights alter counts; multiclass matrices can be large.
- **Performance Notes:** Very fast.
- **Related APIs:** `ConfusionMatrixDisplay`, `classification_report`, `accuracy_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html)


### Generate Classification Report

- **Task:** Generate Classification Report
- **Problem Solved:** Produce precision, recall, and F1 summaries in one call.
- **Mental Trigger:** I need a compact classification summary.
- **Syntax:** `classification_report(y_true, y_pred, *, labels=None, target_names=None, sample_weight=None, digits=2, output_dict=False, zero_division='warn')`
- **Important Parameters:** `target_names`, `output_dict`, `zero_division`, `digits`
- **Return Value:** A formatted text report or dictionary.
- **Example:**

```python
from sklearn.metrics import classification_report

y_true = [0, 1, 1]
y_pred = [0, 0, 1]
report = classification_report(y_true, y_pred)
```

- **Use When:** You need standard classification metrics together.
- **Avoid When:** You need a metric for optimization.
- **Gotchas:** Reporting does not fix class imbalance; averaging lines can be misread; output formatting depends on `output_dict`; label names must match ordering; zero-division handling matters.
- **Performance Notes:** Very fast.
- **Related APIs:** `precision_score`, `recall_score`, `f1_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html)


### Score Balanced Accuracy

- **Task:** Score Balanced Accuracy
- **Problem Solved:** Measure average recall across classes.
- **Mental Trigger:** My classes are imbalanced.
- **Syntax:** `balanced_accuracy_score(y_true, y_pred, *, sample_weight=None, adjusted=False)`
- **Important Parameters:** `adjusted`, `sample_weight`
- **Return Value:** A balanced accuracy score.
- **Example:**

```python
from sklearn.metrics import balanced_accuracy_score

y_true = [0, 0, 1, 1]
y_pred = [0, 1, 1, 1]
score = balanced_accuracy_score(y_true, y_pred)
```

- **Use When:** Class imbalance makes accuracy misleading.
- **Avoid When:** You need probability ranking.
- **Gotchas:** Thresholds still matter; class counts can affect interpretation; adjusted scores change the scale; sample weights alter class influence; compare only across compatible label sets.
- **Performance Notes:** Very fast.
- **Related APIs:** `accuracy_score`, `recall_score`, `classification_report`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html)


### Plot Precision-Recall Curve Data

- **Task:** Plot Precision-Recall Curve Data
- **Problem Solved:** Compute precision-recall curve points for threshold analysis.
- **Mental Trigger:** I need threshold tradeoff data.
- **Syntax:** `precision_recall_curve(y_true, probas_pred, *, pos_label=None, sample_weight=None, drop_intermediate=False)`
- **Important Parameters:** `pos_label`, `sample_weight`, `drop_intermediate`
- **Return Value:** Precision, recall, and thresholds arrays.
- **Example:**

```python
import numpy as np
from sklearn.metrics import precision_recall_curve

y_true = np.array([0, 0, 1, 1])
y_score = np.array([0.1, 0.4, 0.35, 0.8])
precision, recall, thresholds = precision_recall_curve(y_true, y_score)
```

- **Use When:** You need threshold curves for binary classification.
- **Avoid When:** You only need a scalar score.
- **Gotchas:** Requires scores, not hard labels; binary task assumptions are common; thresholds length differs from precision/recall arrays; class ordering matters; plotting is separate from the computation.
- **Performance Notes:** Efficient for standard binary classification sizes.
- **Related APIs:** `PrecisionRecallDisplay`, `roc_curve`, `average_precision_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html)


### Plot ROC Curve Data

- **Task:** Plot ROC Curve Data
- **Problem Solved:** Compute ROC curve points for threshold analysis.
- **Mental Trigger:** I need ROC threshold tradeoff data.
- **Syntax:** `roc_curve(y_true, y_score, *, pos_label=None, sample_weight=None, drop_intermediate=True)`
- **Important Parameters:** `pos_label`, `sample_weight`, `drop_intermediate`
- **Return Value:** False positive rates, true positive rates, and thresholds arrays.
- **Example:**

```python
import numpy as np
from sklearn.metrics import roc_curve

y_true = np.array([0, 0, 1, 1])
y_score = np.array([0.1, 0.4, 0.35, 0.8])
fpr, tpr, thresholds = roc_curve(y_true, y_score)
```

- **Use When:** You need threshold curves for binary classification.
- **Avoid When:** You only need one summary metric.
- **Gotchas:** Needs scores or probabilities; thresholds array is offset relative to curve arrays; class labels must be compatible; drop_intermediate changes curve density; plotting is not automatic.
- **Performance Notes:** Efficient for ordinary evaluation workloads.
- **Related APIs:** `RocCurveDisplay`, `roc_auc_score`, `precision_recall_curve`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html)


### Measure Mean Squared Error

- **Task:** Measure Mean Squared Error
- **Problem Solved:** Quantify average squared prediction error.
- **Mental Trigger:** I need a regression loss metric.
- **Syntax:** `mean_squared_error(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average', squared=True)`
- **Important Parameters:** `sample_weight`, `multioutput`, `squared`
- **Return Value:** A scalar or per-output MSE value.
- **Example:**

```python
from sklearn.metrics import mean_squared_error

y_true = [1.0, 2.0, 3.0]
y_pred = [1.1, 1.9, 2.8]
mse = mean_squared_error(y_true, y_pred)
```

- **Use When:** You need a standard regression error metric.
- **Avoid When:** You want absolute-error interpretability.
- **Gotchas:** Sensitive to large errors; `squared=False` changes output to RMSE-like behavior in older APIs, while separate RMSE is now available; averaging mode matters for multioutput tasks; sample weights alter scale; compare on the same target scale.
- **Performance Notes:** Very fast.
- **Related APIs:** `mean_absolute_error`, `root_mean_squared_error`, `r2_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)


### Measure Mean Absolute Error

- **Task:** Measure Mean Absolute Error
- **Problem Solved:** Quantify average absolute prediction error.
- **Mental Trigger:** I need a robust regression metric.
- **Syntax:** `mean_absolute_error(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average')`
- **Important Parameters:** `sample_weight`, `multioutput`
- **Return Value:** A scalar or per-output MAE value.
- **Example:**

```python
from sklearn.metrics import mean_absolute_error

y_true = [1.0, 2.0, 3.0]
y_pred = [1.1, 1.9, 2.8]
mae = mean_absolute_error(y_true, y_pred)
```

- **Use When:** You need error in original units.
- **Avoid When:** You want to penalize large misses more heavily.
- **Gotchas:** Multioutput averaging matters; sample weights alter interpretation; target scale affects magnitude; compare only on the same target units; outliers affect MSE more than MAE.
- **Performance Notes:** Very fast.
- **Related APIs:** `mean_squared_error`, `root_mean_squared_error`, `r2_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)


### Measure Root Mean Squared Error

- **Task:** Measure Root Mean Squared Error
- **Problem Solved:** Quantify regression error in target units using squared-error penalty.
- **Mental Trigger:** I need RMSE in original units.
- **Syntax:** `root_mean_squared_error(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average')`
- **Important Parameters:** `sample_weight`, `multioutput`
- **Return Value:** A scalar or per-output RMSE value.
- **Example:**

```python
from sklearn.metrics import root_mean_squared_error

y_true = [1.0, 2.0, 3.0]
y_pred = [1.1, 1.9, 2.8]
rmse = root_mean_squared_error(y_true, y_pred)
```

- **Use When:** You want the scale of the target with MSE-style penalty.
- **Avoid When:** You need linear penalty on errors only.
- **Gotchas:** Requires a recent scikit-learn version; compare on identical target scales; sample weights affect the result; multioutput averaging matters; RMSE is still sensitive to large errors.
- **Performance Notes:** Very fast.
- **Related APIs:** `mean_squared_error`, `mean_absolute_error`, `r2_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.root_mean_squared_error.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.root_mean_squared_error.html)


### Measure R2 Score

- **Task:** Measure R2 Score
- **Problem Solved:** Compare a regression model against a mean baseline.
- **Mental Trigger:** I need a standard regression goodness-of-fit score.
- **Syntax:** `r2_score(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average', force_finite=True)`
- **Important Parameters:** `sample_weight`, `multioutput`, `force_finite`
- **Return Value:** An $R^2$ score.
- **Example:**

```python
from sklearn.metrics import r2_score

y_true = [1.0, 2.0, 3.0]
y_pred = [1.1, 1.9, 2.8]
score = r2_score(y_true, y_pred)
```

- **Use When:** You need a baseline-relative regression score.
- **Avoid When:** Error in target units is more useful.
- **Gotchas:** Can be negative; not comparable across different targets; `force_finite` affects edge cases; sample weights matter; multioutput averaging changes interpretation.
- **Performance Notes:** Very fast.
- **Related APIs:** `mean_squared_error`, `mean_absolute_error`, `explained_variance_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html)


### Validate with Cross-Validation Scores

- **Task:** Validate with Cross-Validation Scores
- **Problem Solved:** Evaluate an estimator across repeated folds and return per-fold scores.
- **Mental Trigger:** I need quick CV scores.
- **Syntax:** `cross_val_score(estimator, X, y=None, *, groups=None, scoring=None, cv=None, n_jobs=None, verbose=0, params=None, pre_dispatch='2*n_jobs', error_score=nan)`
- **Important Parameters:** `estimator`, `scoring`, `cv`, `n_jobs`, `groups`
- **Return Value:** An array of scores, one per fold.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

scores = cross_val_score(LogisticRegression(), X, y, cv=2)
```

- **Use When:** You need a quick fold-wise evaluation.
- **Avoid When:** You need multiple metrics or estimator diagnostics.
- **Gotchas:** Estimator is cloned for each fold; preprocessing should be in a pipeline; `groups` handling depends on the CV splitter; scoring defaults may not match your goal; parallelism can increase memory use.
- **Performance Notes:** `n_jobs` enables parallel folds.
- **Related APIs:** `cross_validate`, `validation_curve`, `learning_curve`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html)


### Validate with Cross-Validation Metrics

- **Task:** Validate with Cross-Validation Metrics
- **Problem Solved:** Evaluate multiple metrics across folds and collect estimator timings and scores.
- **Mental Trigger:** I need more than one CV metric.
- **Syntax:** `cross_validate(estimator, X, y=None, *, groups=None, scoring=None, cv=None, n_jobs=None, verbose=0, params=None, pre_dispatch='2*n_jobs', return_train_score=False, return_estimator=False, return_indices=False, error_score=nan)`
- **Important Parameters:** `scoring`, `cv`, `return_train_score`, `return_estimator`, `n_jobs`
- **Return Value:** A dictionary of per-fold results.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import cross_validate
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

result = cross_validate(
    LogisticRegression(),
    X, y,
    cv=2,
    scoring=["accuracy", "f1"]
)
```

- **Use When:** You need multiple metrics or fold diagnostics.
- **Avoid When:** A single score is enough.
- **Gotchas:** Returned keys depend on requested options; estimators are cloned; preprocessing still belongs in a pipeline; storing estimators can increase memory use; `scoring` names must be valid.
- **Performance Notes:** Parallel folds can increase memory pressure.
- **Related APIs:** `cross_val_score`, `validation_curve`, `learning_curve`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html)


### Draw a Validation Curve

- **Task:** Draw a Validation Curve
- **Problem Solved:** Evaluate model performance across a parameter range.
- **Mental Trigger:** I need score vs parameter behavior.
- **Syntax:** `validation_curve(estimator, X, y, *, param_name, param_range, groups=None, cv=None, scoring=None, n_jobs=None, pre_dispatch='all', verbose=0, error_score=nan, fit_params=None, params=None)`
- **Important Parameters:** `estimator`, `param_name`, `param_range`, `cv`, `scoring`
- **Return Value:** Train and validation score arrays across parameter values.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import validation_curve
from sklearn.svm import SVC

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

train_scores, test_scores = validation_curve(
    SVC(), X, y, param_name="C", param_range=[0.1, 1.0, 10.0], cv=2
)
```

- **Use When:** You need to inspect one hyperparameter at a time.
- **Avoid When:** You need full search over multiple parameters.
- **Gotchas:** Parameter name must be valid; preprocessing should be inside a pipeline; returned arrays have fold and parameter dimensions; `scoring` should match the task; large ranges can be expensive.
- **Performance Notes:** Cost scales with folds and parameter values.
- **Related APIs:** `learning_curve`, `cross_validate`, `GridSearchCV`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.validation_curve.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.validation_curve.html)


### Draw a Learning Curve

- **Task:** Draw a Learning Curve
- **Problem Solved:** Measure performance as training set size increases.
- **Mental Trigger:** I need a data-size sensitivity curve.
- **Syntax:** `learning_curve(estimator, X, y, *, groups=None, train_sizes=np.linspace(0.1, 1.0, 5), cv=None, scoring=None, exploit_incremental_learning=False, n_jobs=None, pre_dispatch='all', verbose=0, shuffle=False, random_state=None, error_score=nan, params=None)`
- **Important Parameters:** `train_sizes`, `cv`, `scoring`, `shuffle`, `random_state`
- **Return Value:** Train and validation scores at multiple training-set sizes.
- **Example:**

```python
import numpy as np
from sklearn.model_selection import learning_curve
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

sizes, train_scores, test_scores = learning_curve(
    LogisticRegression(), X, y, cv=2, train_sizes=[0.5, 1.0]
)
```

- **Use When:** You need to see whether more data may help.
- **Avoid When:** You only need a single validation score.
- **Gotchas:** Estimator cloning applies; preprocessing should be pipelined; `train_sizes` are fractions or counts; shuffle may affect size sampling; `exploit_incremental_learning` only applies to compatible estimators.
- **Performance Notes:** Can be expensive on large datasets.
- **Related APIs:** `validation_curve`, `cross_validate`, `GridSearchCV`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.learning_curve.html](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.learning_curve.html)


### Make Predictions

- **Task:** Make Predictions
- **Problem Solved:** Generate class labels or regression outputs from a fitted estimator.
- **Mental Trigger:** I have a fitted model and need outputs.
- **Syntax:** `estimator.predict(X)`
- **Important Parameters:** Input `X`
- **Return Value:** Predicted labels, classes, or regression values depending on estimator type.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
pred = clf.predict(X)
```

- **Use When:** You need the estimator’s primary output.
- **Avoid When:** You need probabilities, decision scores, or transformed features.
- **Gotchas:** Requires a fitted estimator; input schema must match training; pipelines apply all transforms before prediction; output shape depends on estimator; class labels are discrete.
- **Performance Notes:** Inference cost depends on model complexity.
- **Related APIs:** `predict_proba`, `decision_function`, `score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html](https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html)


### Predict Probabilities

- **Task:** Predict Probabilities
- **Problem Solved:** Return class membership probabilities.
- **Mental Trigger:** I need calibrated class probabilities from a model.
- **Syntax:** `estimator.predict_proba(X)`
- **Important Parameters:** Input `X`
- **Return Value:** Probability estimates per class.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
proba = clf.predict_proba(X)
```

- **Use When:** You need probabilities for ranking or thresholding.
- **Avoid When:** The estimator does not support probability output.
- **Gotchas:** Not all estimators implement it; probabilities may be poorly calibrated; shape is `(n_samples, n_classes)`; input must be fitted and schema-compatible; probability outputs can be costly for some models.
- **Performance Notes:** May be slower than `predict` depending on estimator.
- **Related APIs:** `decision_function`, `CalibratedClassifierCV`, `roc_auc_score`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html](https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html)


### Get Decision Scores

- **Task:** Get Decision Scores
- **Problem Solved:** Return raw decision values for ranking or thresholding.
- **Mental Trigger:** I need model scores, not labels.
- **Syntax:** `estimator.decision_function(X)`
- **Important Parameters:** Input `X`
- **Return Value:** Signed distances or scores, depending on the estimator.
- **Example:**

```python
import numpy as np
from sklearn.svm import SVC

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = SVC().fit(X, y)
scores = clf.decision_function(X)
```

- **Use When:** You need raw ranking scores.
- **Avoid When:** You specifically need calibrated probabilities.
- **Gotchas:** Not every classifier implements it; score scale is estimator-specific; binary and multiclass outputs differ; input must be fitted and compatible; thresholds are model dependent.
- **Performance Notes:** Usually cheaper than probability estimation.
- **Related APIs:** `predict_proba`, `roc_curve`, `precision_recall_curve`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html](https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html)


### Transform Features

- **Task:** Transform Features
- **Problem Solved:** Apply a fitted transformer to produce encoded or derived features.
- **Mental Trigger:** I need transformed inputs.
- **Syntax:** `transform(X)`
- **Important Parameters:** Input `X`
- **Return Value:** Transformed feature matrix.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0], [2.0], [3.0]])
scaler = StandardScaler().fit(X)
X2 = scaler.transform(X)
```

- **Use When:** You need model inputs after preprocessing.
- **Avoid When:** The estimator only supports `predict`.
- **Gotchas:** Transformer must be fitted first; feature order must match; output shape may differ from input; sparse and dense types may change; pipelines call `transform` automatically on intermediate steps.
- **Performance Notes:** Cost depends on transformer complexity.
- **Related APIs:** `fit_transform`, `inverse_transform`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.html](https://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.html)


### Fit and Transform

- **Task:** Fit and Transform
- **Problem Solved:** Learn transformation parameters and apply the transform in one step.
- **Mental Trigger:** I need a single preprocessing call.
- **Syntax:** `fit_transform(X, y=None, **fit_params)`
- **Important Parameters:** `X`, `y`
- **Return Value:** Transformed output after fitting.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0], [2.0], [3.0]])
scaler = StandardScaler()
X2 = scaler.fit_transform(X)
```

- **Use When:** You are fitting preprocessing on training data.
- **Avoid When:** You already fit the transformer or need separate training and inference passes.
- **Gotchas:** Avoid fitting on test data; output may be sparse or dense; available only on estimators implementing both methods; can hide leakage if used on the full dataset; behavior varies by estimator.
- **Performance Notes:** Often slightly more convenient than separate calls.
- **Related APIs:** `transform`, `inverse_transform`, `Pipeline`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.html](https://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.html)


### Inverse Transform Features

- **Task:** Inverse Transform Features
- **Problem Solved:** Map transformed data back to the original representation when supported.
- **Mental Trigger:** I need to undo a transform.
- **Syntax:** `inverse_transform(X)`
- **Important Parameters:** Input `X`
- **Return Value:** Data mapped back to the original feature space.
- **Example:**

```python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0], [2.0], [3.0]])
scaler = StandardScaler().fit(X)
X2 = scaler.transform(X)
X_back = scaler.inverse_transform(X2)
```

- **Use When:** You need to recover original-scale values.
- **Avoid When:** The transformer is not invertible.
- **Gotchas:** Not all transformers support inversion; information loss can make inversion approximate; fitted state is required; feature ordering must match; sparse/dense behavior may differ.
- **Performance Notes:** Usually cheap relative to fitting.
- **Related APIs:** `transform`, `fit_transform`, `StandardScaler`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.html](https://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.html)


### Score an Estimator

- **Task:** Score an Estimator
- **Problem Solved:** Compute the estimator’s default evaluation score on given data.
- **Mental Trigger:** I need the estimator’s built-in score.
- **Syntax:** `estimator.score(X, y, sample_weight=None)`
- **Important Parameters:** `X`, `y`, `sample_weight`
- **Return Value:** A scalar score defined by the estimator type.
- **Example:**

```python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
score = clf.score(X, y)
```

- **Use When:** The estimator’s default metric matches your need.
- **Avoid When:** You need a specific custom metric.
- **Gotchas:** The meaning of score varies by estimator; it can hide class imbalance; requires a fitted estimator; pipelines delegate scoring to the final estimator; use explicit metrics for production evaluation.
- **Performance Notes:** Usually cheap.
- **Related APIs:** `accuracy_score`, `cross_val_score`, `classification_report`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html](https://scikit-learn.org/stable/modules/generated/sklearn.base.ClassifierMixin.html)


### Persist Models with Joblib

- **Task:** Persist Models with Joblib
- **Problem Solved:** Save a fitted estimator to disk and reload it later.
- **Mental Trigger:** I need to store a trained model.
- **Syntax:** `joblib.dump(value, filename, compress=0, protocol=None)` and `joblib.load(filename, mmap_mode=None)`
- **Important Parameters:** `filename`, `compress`, `protocol`, `mmap_mode`
- **Return Value:** `dump` returns file paths; `load` returns the stored Python object.
- **Example:**

```python
import numpy as np
import joblib
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
joblib.dump(clf, "model.joblib")
loaded = joblib.load("model.joblib")
```

- **Use When:** You need local Python object persistence for scikit-learn models.
- **Avoid When:** You need language-neutral serialization.
- **Gotchas:** Load only trusted artifacts; version mismatches can break compatibility; large arrays may require memory planning; persisted pipelines include preprocessing state; always validate loaded objects before use.
- **Performance Notes:** Compression trades space for CPU; memory mapping can help large arrays.
- **Related APIs:** `Pipeline`, `joblib.load`, `joblib.dump`.
- **Official Documentation:** [https://joblib.readthedocs.io/en/latest/generated/joblib.dump.html](https://joblib.readthedocs.io/en/latest/generated/joblib.dump.html)


### Inspect Permutation Importance

- **Task:** Inspect Permutation Importance
- **Problem Solved:** Measure feature importance by score degradation after shuffling.
- **Mental Trigger:** I need model-agnostic importance.
- **Syntax:** `permutation_importance(estimator, X, y, *, scoring=None, n_repeats=5, n_jobs=None, random_state=None, sample_weight=None, max_samples=1.0)`
- **Important Parameters:** `scoring`, `n_repeats`, `n_jobs`, `random_state`, `max_samples`
- **Return Value:** A result object with importances and variability.
- **Example:**

```python
import numpy as np
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
result = permutation_importance(clf, X, y, random_state=0)
```

- **Use When:** You need model-agnostic feature importance on fitted estimators.
- **Avoid When:** The estimator is unfitted or the evaluation set is too small for stable estimates.
- **Gotchas:** Importance depends on the chosen scoring metric; correlated features can dilute or split importance; repeated shuffles add variance; use held-out data for more trustworthy results; `max_samples` changes the evaluation subset.
- **Performance Notes:** Can be expensive because it repeats scoring many times; `n_jobs` may help.
- **Related APIs:** `Partial Dependence`, `RandomForestClassifier`, `feature_importances_`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.inspection.permutation_importance.html](https://scikit-learn.org/stable/modules/generated/sklearn.inspection.permutation_importance.html)


### Inspect Partial Dependence

- **Task:** Inspect Partial Dependence
- **Problem Solved:** Estimate how model predictions change as selected features vary.
- **Mental Trigger:** I need feature effect curves.
- **Syntax:** `PartialDependenceDisplay.from_estimator(estimator, X, features, *, kind='average', subsample=1000, random_state=None, grid_resolution=100, percentiles=(0.05, 0.95), method='auto', n_jobs=None, verbose=0, line_kw=None, ice_lines_kw=None, pd_line_kw=None, contour_kw=None, ax=None, centered=False, feature_names=None, target=None, response_method='auto')`
- **Important Parameters:** `features`, `kind`, `grid_resolution`, `percentiles`, `method`
- **Return Value:** A display object for partial dependence plots.
- **Example:**

```python
import numpy as np
from sklearn.inspection import PartialDependenceDisplay
from sklearn.ensemble import RandomForestClassifier

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = RandomForestClassifier(random_state=0).fit(X, y)
disp = PartialDependenceDisplay.from_estimator(clf, X, [^0])
```

- **Use When:** You need a feature effect visualization from a fitted estimator.
- **Avoid When:** The model is not fitted or the feature set is too large for interpretation.
- **Gotchas:** Results depend on the model and data distribution; correlated features can mislead interpretation; not all estimators support all methods; subsampling affects stability; the display API is separate from the underlying estimator.
- **Performance Notes:** Can be expensive for many features or large grids.
- **Related APIs:** `permutation_importance`, `PDP`-style inspection, `PCA`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html](https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html)


### Show a Confusion Matrix Display

- **Task:** Show a Confusion Matrix Display
- **Problem Solved:** Create a rendered visualization from confusion matrix values.
- **Mental Trigger:** I need a plotted confusion matrix.
- **Syntax:** `ConfusionMatrixDisplay(confusion_matrix, *, display_labels=None)` and `ConfusionMatrixDisplay.from_estimator(estimator, X, y, *, labels=None, sample_weight=None, normalize=None, display_labels=None, include_values=True, xticks_rotation='horizontal', values_format=None, cmap='viridis', ax=None, colorbar=True, im_kw=None, text_kw=None)`
- **Important Parameters:** `display_labels`, `normalize`, `values_format`, `cmap`
- **Return Value:** A display object for plotting confusion matrices.
- **Example:**

```python
import numpy as np
from sklearn.metrics import ConfusionMatrixDisplay
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
disp = ConfusionMatrixDisplay.from_estimator(clf, X, y)
```

- **Use When:** You need a visual confusion matrix.
- **Avoid When:** You only need numeric counts.
- **Gotchas:** Requires a fitted estimator for `from_estimator`; labels must be consistent; normalization changes displayed values; plotting libraries are required for rendering; class order matters.
- **Performance Notes:** Rendering cost is usually modest.
- **Related APIs:** `confusion_matrix`, `classification_report`, `RocCurveDisplay`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ConfusionMatrixDisplay.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ConfusionMatrixDisplay.html)


### Show a Precision-Recall Display

- **Task:** Show a Precision-Recall Display
- **Problem Solved:** Create a rendered precision-recall curve from a classifier or score array.
- **Mental Trigger:** I need a PR curve plot.
- **Syntax:** `PrecisionRecallDisplay.from_estimator(estimator, X, y, *, response_method='auto', name=None, ax=None, pos_label=None, sample_weight=None, drop_intermediate=False, plot_chance_level=False, chance_level_kw=None, despine=False, **kwargs)` and `PrecisionRecallDisplay.from_predictions(y_true, y_pred, *, sample_weight=None, pos_label=None, response_method='auto', name=None, ax=None, plot_chance_level=False, chance_level_kw=None, despine=False, **kwargs)`
- **Important Parameters:** `response_method`, `pos_label`, `plot_chance_level`, `drop_intermediate`
- **Return Value:** A display object for precision-recall plots.
- **Example:**

```python
import numpy as np
from sklearn.metrics import PrecisionRecallDisplay
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
disp = PrecisionRecallDisplay.from_estimator(clf, X, y)
```

- **Use When:** You need a plotted precision-recall curve.
- **Avoid When:** You only need underlying metric arrays.
- **Gotchas:** Requires scores or estimator support; binary task assumptions are common; baseline prevalence matters; plotting is separate from metric computation; `response_method` must match estimator outputs.
- **Performance Notes:** Plotting is typically inexpensive.
- **Related APIs:** `precision_recall_curve`, `roc_curve`, `RocCurveDisplay`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.PrecisionRecallDisplay.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.PrecisionRecallDisplay.html)


### Show a ROC Curve Display

- **Task:** Show a ROC Curve Display
- **Problem Solved:** Create a rendered ROC curve from predictions or estimator scores.
- **Mental Trigger:** I need a ROC plot.
- **Syntax:** `RocCurveDisplay.from_estimator(estimator, X, y, *, sample_weight=None, drop_intermediate=True, response_method='auto', name=None, ax=None, pos_label=None, curve_kwargs=None, chance_level_kw=None, despine=False, **kwargs)` and `RocCurveDisplay.from_predictions(y_true, y_pred, *, sample_weight=None, drop_intermediate=True, pos_label=None, name=None, ax=None, chance_level_kw=None, despine=False, **kwargs)`
- **Important Parameters:** `response_method`, `drop_intermediate`, `pos_label`, `sample_weight`
- **Return Value:** A display object for ROC plots.
- **Example:**

```python
import numpy as np
from sklearn.metrics import RocCurveDisplay
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = LogisticRegression().fit(X, y)
disp = RocCurveDisplay.from_estimator(clf, X, y)
```

- **Use When:** You need a plotted ROC curve.
- **Avoid When:** You only need a scalar AUC value.
- **Gotchas:** Needs score-like outputs for meaningful curves; class ordering matters; `drop_intermediate` changes displayed point density; plotting depends on a display backend; binary and multiclass behavior differ.
- **Performance Notes:** Rendering is cheap relative to model evaluation.
- **Related APIs:** `roc_curve`, `roc_auc_score`, `PrecisionRecallDisplay`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.RocCurveDisplay.html](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.RocCurveDisplay.html)


## Utilities

### Fit a Baseline Estimator

- **Task:** Fit a Baseline Estimator
- **Problem Solved:** Train a minimal estimator to verify data flow and API compatibility.
- **Mental Trigger:** I need a quick sanity-check model.
- **Syntax:** `DummyClassifier(strategy='prior', random_state=None, constant=None)` and `DummyRegressor(strategy='mean', constant=None, quantile=None)`
- **Important Parameters:** `strategy`, `constant`, `random_state`
- **Return Value:** A baseline estimator that can be used for comparison.
- **Example:**

```python
import numpy as np
from sklearn.dummy import DummyClassifier

X = np.array([[0.0], [1.0], [2.0]])
y = np.array([0, 1, 0])

clf = DummyClassifier(strategy="most_frequent")
clf.fit(X, y)
```

- **Use When:** You need a lower-bound baseline.
- **Avoid When:** You need meaningful predictive performance.
- **Gotchas:** These models are for validation, not production predictions; output depends on the chosen strategy; fit on training data only; class imbalance can make baselines look deceptively strong; random state only matters for some strategies.
- **Performance Notes:** Extremely fast and cheap.
- **Related APIs:** `cross_val_score`, `accuracy_score`, `mean_squared_error`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html)


### Calibrate Classifier Probabilities

- **Task:** Calibrate Classifier Probabilities
- **Problem Solved:** Wrap a classifier to improve probability calibration.
- **Mental Trigger:** My predicted probabilities need calibration.
- **Syntax:** `CalibratedClassifierCV(estimator=None, *, method='sigmoid', cv=None, n_jobs=None, ensemble='auto')`
- **Important Parameters:** `estimator`, `method`, `cv`, `n_jobs`, `ensemble`
- **Return Value:** A calibrated classifier with `predict_proba`.
- **Example:**

```python
import numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 1, 1])

clf = CalibratedClassifierCV(LogisticRegression(), method="sigmoid", cv=2)
clf.fit(X, y)
```

- **Use When:** You need better probability estimates from a classifier.
- **Avoid When:** The model already produces well-calibrated probabilities and extra cost is unnecessary.
- **Gotchas:** Calibration requires careful CV handling; estimator cloning occurs; data leakage is easy if calibration data is reused improperly; `method` choice matters; probabilities may still be imperfect.
- **Performance Notes:** Adds training cost due to calibration folds.
- **Related APIs:** `predict_proba`, `roc_auc_score`, `brier_score_loss`.
- **Official Documentation:** [https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibratedClassifierCV.html](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibratedClassifierCV.html)


## Official Sources

- Official documentation: [https://scikit-learn.org/stable/](https://scikit-learn.org/stable/)[^1]
- Stable release documentation: [https://scikit-learn.org/stable/](https://scikit-learn.org/stable/)[^1]
- GitHub repository: [https://github.com/scikit-learn/scikit-learn](https://github.com/scikit-learn/scikit-learn)[^4]
- PyPI package page: [https://pypi.org/project/scikit-learn/](https://pypi.org/project/scikit-learn/)[^3]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^9]</span>

<div align="center">⁂</div>

[^1]: https://scikit-learn.org/dev/_sources/versions.rst.txt

[^2]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^3]: https://pypi.org/project/scikit-learn/

[^4]: https://github.com/scikit-learn/scikit-learn

[^5]: https://scikit-learn.org/stable/user_guide.html

[^6]: https://github.com/scikit-learn/scikit-learn/releases

[^7]: https://scikit-learn.org/stable/modules/permutation_importance.html

[^8]: https://scikit-learn.org/stable/auto_examples/inspection/plot_permutation_importance.html

[^9]: https://arxiv.org/pdf/1201.0490.pdf

[^10]: https://arxiv.org/abs/1702.01460

[^11]: http://arxiv.org/pdf/1912.08198.pdf

[^12]: https://arxiv.org/pdf/1309.0238.pdf

[^13]: https://arxiv.org/pdf/2112.06560.pdf

[^14]: https://arxiv.org/html/2309.13420

[^15]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10792272/

[^16]: https://medinform.jmir.org/2023/1/e49886

[^17]: https://scikit-learn.org/dev/versions.html

[^18]: https://scikit-learn.org/stable/whats_new.html

[^19]: https://scikit-learn.sourceforge.net/stable/documentation.html

