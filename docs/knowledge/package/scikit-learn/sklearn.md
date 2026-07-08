scikit-learn
Package Info
Field	Value
id	package:scikit-learn
title	scikit-learn
slug	scikit-learn
description	Core Python machine learning package for preprocessing, model training, validation, and evaluation.
name	scikit-learn
latest stable version	1.9.0 
scikit-learn
+1
supported Python versions	Python 3.10 or newer for scikit-learn 1.7+; stable docs currently list 1.9.0 
MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md
scikit-learn
summary	scikit-learn provides a consistent estimator API for common ML workflows, with strong support for preprocessing, pipelines, model selection, metrics, and classical ML estimators. 
MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md
install command	pip install -U scikit-learn 
MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md
import convention	import sklearn and from sklearn import ...
important namespaces	sklearn.base, sklearn.pipeline, sklearn.compose, sklearn.preprocessing, sklearn.impute, sklearn.model_selection, sklearn.metrics, sklearn.feature_selection, sklearn.linear_model, sklearn.ensemble, sklearn.tree, sklearn.svm, sklearn.cluster, sklearn.neighbors, sklearn.decomposition, sklearn.calibration, sklearn.inspection, sklearn.multiclass
official repository	
scikit-learn/scikit-learn
 
github
official documentation	
Installing scikit-learn
 
MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md
license	BSD-3-Clause 
arxiv
+1
maintainers	scikit-learn core contributors, maintained in the official GitHub repository 
github
created_at	2007-08-01
updated_at	2026-07-07




Package Summary
scikit-learn is the standard Python package for classical machine learning implementation, especially when you need a stable estimator interface, fast experimentation, and production-friendly composition. Its core value is consistency: estimators expose fit, transformers expose transform, and composite objects let you build repeatable preprocessing and training pipelines.
MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

Namespace Architecture
sklearn.base: Core estimator interfaces, mixins, cloning, and developer-facing base classes.

sklearn.pipeline: Sequential composition of preprocessing and estimators.

sklearn.compose: Column-wise transformation and heterogeneous feature handling.

sklearn.preprocessing: Scaling, encoding, normalization, and feature transforms.

sklearn.impute: Missing-value replacement strategies.

sklearn.model_selection: Dataset splitting, validation, and hyperparameter search.

sklearn.metrics: Classification and regression evaluation metrics.

sklearn.feature_selection: Univariate and model-based feature filtering.

sklearn.linear_model: Linear models for regression and classification.

sklearn.ensemble: Bagging, boosting, and forest-based estimators.

sklearn.tree: Decision tree estimators and tree utilities.

sklearn.svm: Support vector machines for classification and regression.

sklearn.cluster: Unsupervised clustering estimators.

sklearn.neighbors: Nearest-neighbor classifiers, regressors, and search utilities.

sklearn.decomposition: Dimensionality reduction and matrix factorization.

sklearn.calibration: Probability calibration utilities.

sklearn.inspection: Model inspection, interpretation, and partial dependence.

sklearn.multiclass: Multiclass wrappers for estimators that are naturally binary.

Installation Notes
Use the official wheel install for most production environments. The documentation recommends isolated environments and notes that plotting and some examples require Matplotlib and optional ecosystem packages such as pandas or scikit-image.
MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

Package Conventions
Estimators are usually instantiated with hyperparameters, then fitted with fit().

Transformers expose transform() and often fit_transform().

Predictors usually expose predict(), and classifiers may also expose predict_proba() or decision_function().

Composite estimators use nested parameter naming with double underscores, such as pipeline__step__param.

Randomized components should set random_state for reproducibility.

Tasks
Split Dataset
Task
Split Dataset

Problem Solved
Create separate training and test subsets for model development and final evaluation.

Mental Trigger
I need a holdout set.

Syntax

python
train_test_split(*arrays, test_size=None, train_size=None, random_state=None, shuffle=True, stratify=None)
Important Parameters
test_size

train_size

random_state

shuffle

stratify

Return Value
A list of split arrays in train/test order.

Example

python
import numpy as np
from sklearn.model_selection import train_test_split

X = np.arange(12).reshape(6, 2)
y = np.array([0, 0, 1, 1, 0, 1])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.33, random_state=42, stratify=y
)
Use When
Use for a simple holdout evaluation split.

Avoid When
Use cross-validation when you need repeated validation.

Gotchas
shuffle=True by default.

stratify should usually match class labels for classification.

Setting random_state is important for reproducible splits.

Output order follows the input array order.

Small datasets can produce unstable splits.

Performance Notes
Operates in memory on the provided arrays.

Related APIs
StratifiedKFold, GroupKFold, ShuffleSplit

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html

Task
Stratified Train-Test Split

Problem Solved
Preserve class proportions in train and test partitions.

Mental Trigger
My classes are imbalanced.

Syntax

python
train_test_split(*arrays, test_size=None, train_size=None, random_state=None, shuffle=True, stratify=y)
Important Parameters
stratify

test_size

random_state

shuffle

Return Value
Train/test splits with class proportions approximately preserved.

Example

python
import numpy as np
from sklearn.model_selection import train_test_split

X = np.arange(20).reshape(10, 2)
y = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0, stratify=y
)
Use When
Use for classification data with imbalanced labels.

Avoid When
Avoid when labels are continuous regression targets.

Gotchas
Stratification requires enough samples per class.

Extremely small classes may make splitting fail.

stratify is not for regression targets.

Random seed still affects sample selection within each class.

Preserve label distribution only approximately, not exactly.

Performance Notes
No special scalability features beyond the array sizes involved.

Related APIs
StratifiedKFold, StratifiedShuffleSplit, train_test_split

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html

Task
Shuffle Dataset

Problem Solved
Randomize row order before splitting or training.

Mental Trigger
My data is sorted.

Syntax

python
shuffle(*arrays, random_state=None, n_samples=None)
Important Parameters
random_state

n_samples

Return Value
Shuffled arrays in the same relative alignment.

Example

python
import numpy as np
from sklearn.utils import shuffle

X = np.array([[1], [2], [3], [4]])
y = np.array([10, 20, 30, 40])

X_s, y_s = shuffle(X, y, random_state=42)
Use When
Use before splitting time-independent datasets.

Avoid When
Avoid for chronological or sequence data.

Gotchas
All arrays must have the same first dimension.

Shuffling breaks temporal ordering.

random_state is needed for reproducibility.

Returns copies, not views, in typical use.

Do not shuffle targets independently from features.

Performance Notes
Works in memory and can be costly on large arrays.

Related APIs
train_test_split, ShuffleSplit

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.utils.shuffle.html

Task
Create K-Fold Split

Problem Solved
Generate repeated train/validation folds for cross-validation.

Mental Trigger
I need multiple validation splits.

Syntax

python
KFold(n_splits=5, *, shuffle=False, random_state=None)
Important Parameters
n_splits

shuffle

random_state

Return Value
A cross-validation splitter that yields train and test indices.

Example

python
import numpy as np
from sklearn.model_selection import KFold

X = np.arange(12).reshape(6, 2)
kf = KFold(n_splits=3, shuffle=True, random_state=42)

for train_idx, test_idx in kf.split(X):
    pass
Use When
Use for standard cross-validation on IID data.

Avoid When
Avoid without shuffling if the data order matters.

Gotchas
shuffle=False by default.

random_state only matters when shuffle=True.

Each sample appears exactly once in the test fold.

Fold sizes can differ by at most one.

Use a splitter object, not a fitted estimator.

Performance Notes
Lightweight index generation only.

Related APIs
StratifiedKFold, GroupKFold, cross_val_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html

Task
Create Stratified K-Fold

Problem Solved
Generate folds while keeping class proportions aligned.

Mental Trigger
I need balanced class folds.

Syntax

python
StratifiedKFold(n_splits=5, *, shuffle=False, random_state=None)
Important Parameters
n_splits

shuffle

random_state

Return Value
A splitter that yields stratified train/test indices.

Example

python
import numpy as np
from sklearn.model_selection import StratifiedKFold

X = np.arange(20).reshape(10, 2)
y = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
for train_idx, test_idx in skf.split(X, y):
    pass
Use When
Use for classification model validation.

Avoid When
Avoid for regression targets.

Gotchas
Requires class labels, not continuous values.

Each fold should preserve proportions approximately.

Very small minority classes may limit feasible splits.

shuffle=False keeps input order within class groups.

random_state only applies when shuffling.

Performance Notes
Splitter is cheap; the downstream estimator cost dominates.

Related APIs
KFold, StratifiedShuffleSplit, cross_validate

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html

Task
Create Group K-Fold

Problem Solved
Keep all samples from the same group in either train or test folds.

Mental Trigger
My samples are grouped.

Syntax

python
GroupKFold(n_splits=5, *, shuffle=False, random_state=None)
Important Parameters
n_splits

shuffle

random_state

Return Value
A group-aware cross-validation splitter.

Example

python
import numpy as np
from sklearn.model_selection import GroupKFold

X = np.arange(12).reshape(6, 2)
y = np.array([0, 1, 0, 1, 0, 1])
groups = np.array([1, 1, 2, 2, 3, 3])

gkf = GroupKFold(n_splits=3)
for train_idx, test_idx in gkf.split(X, y, groups):
    pass
Use When
Use when repeated entities must not leak across folds.

Avoid When
Avoid if groups are not available.

Gotchas
Group labels must be passed to split.

Samples from the same group never split across folds.

shuffle behavior depends on version support.

Fold balance is constrained by group sizes.

Do not confuse groups with classes.

Performance Notes
Index splitting is cheap; group balancing can be constrained.

Related APIs
StratifiedGroupKFold, LeaveOneGroupOut, cross_validate

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html

Missing Values
Task
Fill Missing Values

Problem Solved
Replace missing entries before estimators that do not accept them.

Mental Trigger
My data has NaNs.

Syntax

python
SimpleImputer(*, missing_values=np.nan, strategy='mean', fill_value=None, copy=True, add_indicator=False, keep_empty_features=False)
Important Parameters
strategy

fill_value

add_indicator

keep_empty_features

missing_values

Return Value
A fitted imputer that outputs completed arrays.

Example

python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0, np.nan], [2.0, 3.0], [np.nan, 5.0]])
imp = SimpleImputer(strategy="mean")
X_filled = imp.fit_transform(X)
Use When
Use for common numeric or categorical missing-value replacement.

Avoid When
Avoid if the estimator can handle missing values directly.

Gotchas
fit learns fill statistics from training data only.

Missingness indicators can add extra columns.

Empty features need explicit handling.

Numeric and categorical columns usually need separate imputers.

Leakage happens if you fit on all data before splitting.

Performance Notes
Dense output is typical unless used in sparse-friendly contexts.

Related APIs
KNNImputer, IterativeImputer, Pipeline

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html

Task
Mean Imputation

Problem Solved
Fill numeric missing values with the column mean.

Mental Trigger
My numeric columns need a simple default.

Syntax

python
SimpleImputer(strategy='mean')
Important Parameters
strategy

Return Value
An imputer that replaces missing values with the mean.

Example

python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0], [np.nan], [3.0]])
X_out = SimpleImputer(strategy="mean").fit_transform(X)
Use When
Use for numeric features with roughly stable distributions.

Avoid When
Avoid for non-numeric columns.

Gotchas
Mean is computed per feature.

Outliers can shift the mean.

Fit only on training data.

Works on numeric columns, not strings.

Output dtype may change.

Performance Notes
Simple and fast.

Related APIs
median, most_frequent, SimpleImputer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html

Task
Median Imputation

Problem Solved
Fill numeric missing values with the column median.

Mental Trigger
My numeric data has outliers.

Syntax

python
SimpleImputer(strategy='median')
Important Parameters
strategy

Return Value
An imputer that replaces missing values with the median.

Example

python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0], [100.0], [np.nan]])
X_out = SimpleImputer(strategy="median").fit_transform(X)
Use When
Use for numeric data where robust defaults are preferred.

Avoid When
Avoid for categorical columns.

Gotchas
Median is computed independently for each feature.

Fits only on observed training values.

Requires numeric input.

Missing indicators can be added separately.

Do not impute before splitting.

Performance Notes
Fast on dense arrays.

Related APIs
SimpleImputer, RobustScaler

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html

Task
Most Frequent Imputation

Problem Solved
Fill missing values with the most common category or value.

Mental Trigger
My categorical column is sparse.

Syntax

python
SimpleImputer(strategy='most_frequent')
Important Parameters
strategy

Return Value
An imputer that replaces each missing value with the most frequent value.

Example

python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([["a"], [None], ["a"]], dtype=object)
X_out = SimpleImputer(strategy="most_frequent").fit_transform(X)
Use When
Use for categorical or discrete columns.

Avoid When
Avoid if a domain-specific constant is better.

Gotchas
Ties are resolved by ordering rules.

Strings and mixed types may become object arrays.

Missing values must match missing_values.

Fit on training data only.

Category frequency can shift in production.

Performance Notes
Can be slower on object arrays than numeric arrays.

Related APIs
OneHotEncoder, OrdinalEncoder, SimpleImputer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html

Task
Constant Imputation

Problem Solved
Replace missing values with a fixed sentinel.

Mental Trigger
I need a domain-specific placeholder.

Syntax

python
SimpleImputer(strategy='constant', fill_value=None)
Important Parameters
fill_value

strategy

Return Value
An imputer that fills all missing values with the configured constant.

Example

python
import numpy as np
from sklearn.impute import SimpleImputer

X = np.array([[1.0], [np.nan], [3.0]])
X_out = SimpleImputer(strategy="constant", fill_value=-1).fit_transform(X)
Use When
Use when missingness has a meaningful sentinel.

Avoid When
Avoid when the sentinel could be confused with a valid value.

Gotchas
Pick a placeholder that will not collide with real values.

Works for both numeric and categorical data.

Output type may change.

Fit still matters for schema consistency.

Consider adding a missing indicator.

Performance Notes
Low overhead.

Related APIs
SimpleImputer, MissingIndicator

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html

Feature Scaling
Task
Standardize Numerical Features

Problem Solved
Center and scale numeric columns to unit variance.

Mental Trigger
My features are on different scales.

Syntax

python
StandardScaler(*, copy=True, with_mean=True, with_std=True)
Important Parameters
with_mean

with_std

copy

Return Value
A transformer that standardizes features.

Example

python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0, 2.0], [3.0, 4.0]])
X_scaled = StandardScaler().fit_transform(X)
Use When
Use for many linear models, SVMs, and distance-based estimators.

Avoid When
Avoid centering sparse matrices.

Gotchas
Fit on training data only.

with_mean=False is required for sparse inputs.

Scaling parameters depend on observed training data.

Do not scale targets with this transformer.

Pipelines prevent leakage.

Performance Notes
Sparse centering is unsupported; use sparse-safe configuration.

Related APIs
MinMaxScaler, RobustScaler, Pipeline

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html

Task
Scale Features to Range

Problem Solved
Map numeric features into a fixed interval.

Mental Trigger
I need bounded feature values.

Syntax

python
MinMaxScaler(feature_range=(0, 1), *, copy=True, clip=False)
Important Parameters
feature_range

clip

copy

Return Value
A transformer that scales each feature to the configured range.

Example

python
import numpy as np
from sklearn.preprocessing import MinMaxScaler

X = np.array([[1.0, 2.0], [3.0, 6.0]])
X_scaled = MinMaxScaler().fit_transform(X)
Use When
Use for bounded inputs or when a fixed range is required.

Avoid When
Avoid when outliers dominate the observed min and max.

Gotchas
Transform uses training min and max.

Outliers can compress most values.

clip=True clips unseen values at transform time.

Fit on training data only.

Feature ranges apply per column.

Performance Notes
Simple and fast.

Related APIs
StandardScaler, RobustScaler, MaxAbsScaler

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html

Task
Scale Features Robustly

Problem Solved
Scale using statistics less sensitive to outliers.

Mental Trigger
My numeric data has outliers.

Syntax

python
RobustScaler(*, with_centering=True, with_scaling=True, quantile_range=(25.0, 75.0), copy=True, unit_variance=False)
Important Parameters
quantile_range

with_centering

with_scaling

unit_variance

copy

Return Value
A transformer that scales features using median and interquartile range.

Example

python
import numpy as np
from sklearn.preprocessing import RobustScaler

X = np.array([[1.0], [2.0], [100.0]])
X_scaled = RobustScaler().fit_transform(X)
Use When
Use when outliers make mean/std scaling unstable.

Avoid When
Avoid if you need strict zero-mean unit-variance scaling.

Gotchas
Centering sparse matrices is not supported.

Training data statistics define the transform.

Very small samples can make quantiles noisy.

Output is still feature-wise.

Fit on training data only.

Performance Notes
Quantile calculations add cost compared with simpler scalers.

Related APIs
StandardScaler, MinMaxScaler, MaxAbsScaler

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html

Task
Scale Sparse Features by Max Abs

Problem Solved
Scale features by their maximum absolute value without centering.

Mental Trigger
My matrix is sparse.

Syntax

python
MaxAbsScaler(*, copy=True)
Important Parameters
copy

Return Value
A transformer that scales each feature by its max absolute value.

Example

python
import numpy as np
from sklearn.preprocessing import MaxAbsScaler

X = np.array([[0.0, -2.0], [3.0, 4.0]])
X_scaled = MaxAbsScaler().fit_transform(X)
Use When
Use for sparse or sign-preserving scaled features.

Avoid When
Avoid if centering is required.

Gotchas
Works well with sparse inputs.

Does not center features.

Fit on training data only.

Values are scaled independently per column.

Zero-only columns stay zero.

Performance Notes
Sparse-friendly and memory efficient.

Related APIs
StandardScaler, MinMaxScaler, Normalizer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html

Task
Normalize Sample Vectors

Problem Solved
Scale each row vector to unit norm.

Mental Trigger
Each sample is a vector of counts or weights.

Syntax

python
Normalizer(norm='l2', *, copy=True)
Important Parameters
norm

copy

Return Value
A transformer that normalizes each sample independently.

Example

python
import numpy as np
from sklearn.preprocessing import Normalizer

X = np.array([[3.0, 4.0], [1.0, 0.0]])
X_norm = Normalizer().fit_transform(X)
Use When
Use for text-like vectors and similarity-based models.

Avoid When
Avoid when feature-wise scaling is required.

Gotchas
Normalization is per row, not per column.

Sparse inputs are supported.

It does not learn dataset statistics.

Do not confuse with standardization.

Norm choice changes output geometry.

Performance Notes
Efficient on sparse matrices.

Related APIs
StandardScaler, MaxAbsScaler, normalize

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html

Feature Encoding
Task
One-Hot Encode Categories

Problem Solved
Convert categorical columns into binary indicator features.

Mental Trigger
My categorical values are strings or labels.

Syntax

python
OneHotEncoder(*, categories='auto', drop=None, sparse_output=True, dtype=np.float64, handle_unknown='error', min_frequency=None, max_categories=None, feature_name_combiner='concat')
Important Parameters
handle_unknown

drop

sparse_output

min_frequency

max_categories

Return Value
A fitted encoder that outputs encoded feature matrices.

Example

python
import numpy as np
from sklearn.preprocessing import OneHotEncoder

X = np.array([["red"], ["blue"], ["red"]])
enc = OneHotEncoder(sparse_output=False)
X_enc = enc.fit_transform(X)
Use When
Use for nominal categorical features.

Avoid When
Avoid when ordinal order is meaningful.

Gotchas
Unknown categories need explicit handling.

Output is sparse by default.

drop can reduce collinearity.

Fit on training categories only.

Feature names depend on learned categories.

Performance Notes
Sparse output is usually more memory efficient for high-cardinality features.

Related APIs
OrdinalEncoder, ColumnTransformer, make_column_transformer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html

Task
Ordinal Encode Ordered Categories

Problem Solved
Map ordered categories to integer codes.

Mental Trigger
The category order matters.

Syntax

python
OrdinalEncoder(*, categories='auto', dtype=np.float64, handle_unknown='error', unknown_value=None, encoded_missing_value=np.nan, min_frequency=None, max_categories=None)
Important Parameters
categories

handle_unknown

unknown_value

encoded_missing_value

Return Value
A fitted encoder that converts categories to ordinal integers.

Example

python
import numpy as np
from sklearn.preprocessing import OrdinalEncoder

X = np.array([["low"], ["medium"], ["high"]])
enc = OrdinalEncoder(categories=[["low", "medium", "high"]])
X_enc = enc.fit_transform(X)
Use When
Use for ordered categorical variables.

Avoid When
Avoid for nominal categories where order is arbitrary.

Gotchas
Category order must be explicit when domain order matters.

Unknown categories need configured handling.

Integer codes can imply fake numeric distance.

Missing values have separate handling.

Works column-wise on 2D input.

Performance Notes
Lightweight encoder.

Related APIs
OneHotEncoder, LabelEncoder, ColumnTransformer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html

Task
Encode Class Labels

Problem Solved
Convert target labels into integer indices.

Mental Trigger
My target labels are strings.

Syntax

python
LabelEncoder()
Important Parameters
None commonly modified

Return Value
A fitted encoder for 1D target labels.

Example

python
from sklearn.preprocessing import LabelEncoder

y = ["spam", "ham", "spam"]
enc = LabelEncoder()
y_int = enc.fit_transform(y)
Use When
Use to encode classification targets.

Avoid When
Avoid for feature columns.

Gotchas
Intended for y, not X.

Class ordering is learned automatically.

Unseen labels at transform time are not supported.

Often unnecessary if the estimator already accepts string labels.

Do not use for one-hot feature encoding.

Performance Notes
Very small overhead.

Related APIs
LabelBinarizer, MultiLabelBinarizer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html

Task
Binarize Multi-Label Targets

Problem Solved
Convert sets of labels into a multi-hot indicator matrix.

Mental Trigger
Each sample has multiple labels.

Syntax

python
MultiLabelBinarizer(classes=None, sparse_output=False)
Important Parameters
classes

sparse_output

Return Value
A fitted binarizer that converts iterable label collections into indicator arrays.

Example

python
from sklearn.preprocessing import MultiLabelBinarizer

y = [("red", "small"), ("blue",), ("red", "large")]
mlb = MultiLabelBinarizer()
Y = mlb.fit_transform(y)
Use When
Use for multi-label classification targets.

Avoid When
Avoid for standard single-label targets.

Gotchas
Input must be an iterable of iterables.

Class order is learned from data unless supplied.

Sparse output can save memory for many labels.

Do not confuse with LabelBinarizer.

Unseen labels are not supported during transform.

Performance Notes
Sparse output helps when label space is large.

Related APIs
LabelBinarizer, LabelEncoder, OneHotEncoder

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MultiLabelBinarizer.html

Task
Binarize Single-Label Targets

Problem Solved
Convert class labels to a binary indicator representation.

Mental Trigger
I need binary target encoding.

Syntax

python
LabelBinarizer(*, neg_label=0, pos_label=1, sparse_output=False)
Important Parameters
neg_label

pos_label

sparse_output

Return Value
A fitted binarizer for binary or multiclass targets.

Example

python
from sklearn.preprocessing import LabelBinarizer

y = ["cat", "dog", "cat"]
lb = LabelBinarizer()
Y = lb.fit_transform(y)
Use When
Use when a binary matrix representation is needed for labels.

Avoid When
Avoid for feature encoding.

Gotchas
Intended for targets, not feature columns.

Output shape differs for binary vs multiclass cases.

Unseen labels are not supported.

Not the same as OneHotEncoder.

May be unnecessary for many estimators.

Performance Notes
Minimal overhead.

Related APIs
LabelEncoder, MultiLabelBinarizer, OneHotEncoder

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelBinarizer.html

Feature Engineering
Task
Generate Polynomial Features

Problem Solved
Expand numeric inputs with interaction and power terms.

Mental Trigger
I need explicit feature interactions.

Syntax

python
PolynomialFeatures(degree=2, *, interaction_only=False, include_bias=True, order='C')
Important Parameters
degree

interaction_only

include_bias

order

Return Value
A transformer that expands the feature matrix.

Example

python
import numpy as np
from sklearn.preprocessing import PolynomialFeatures

X = np.array([[1.0, 2.0]])
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)
Use When
Use for explicit interaction terms in linear models.

Avoid When
Avoid on very wide inputs unless feature growth is acceptable.

Gotchas
Feature count grows quickly with degree.

Dense output is common and can be large.

Interaction terms can explode memory.

Fit on training data only.

Feature ordering matters for inspection.

Performance Notes
Can be memory intensive for many features.

Related APIs
SplineTransformer, SelectKBest, Pipeline

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html

Task
Remove Low-Variance Features

Problem Solved
Drop features with little to no variance.

Mental Trigger
Some features are almost constant.

Syntax

python
VarianceThreshold(threshold=0.0)
Important Parameters
threshold

Return Value
A selector that removes low-variance columns.

Example

python
import numpy as np
from sklearn.feature_selection import VarianceThreshold

X = np.array([[1, 0, 3], [1, 1, 3], [1, 0, 3]])
X_sel = VarianceThreshold().fit_transform(X)
Use When
Use as a simple unsupervised filter.

Avoid When
Avoid if all columns are intentionally low-variance.

Gotchas
Constant columns are removed by default.

Sparse input support depends on data layout.

Does not use target labels.

Fit on training data only.

Threshold choice affects feature count directly.

Performance Notes
Fast filter step.

Related APIs
SelectKBest, PCA, FeatureSelection

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.VarianceThreshold.html

Task
Select Top Features by Score

Problem Solved
Keep the best-scoring features under a chosen statistical test.

Mental Trigger
I need a quick feature filter.

Syntax

python
SelectKBest(score_func=f_classif, k=10)
Important Parameters
score_func

k

Return Value
A selector that keeps the top-k scored features.

Example

python
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif

X = np.array([[1, 2], [2, 1], [3, 5], [4, 4]])
y = np.array([0, 0, 1, 1])

sel = SelectKBest(score_func=f_classif, k=1)
X_sel = sel.fit_transform(X, y)
Use When
Use for supervised univariate feature filtering.

Avoid When
Avoid when feature interactions matter more than individual columns.

Gotchas
Requires y during fitting.

Score functions differ for classification and regression.

k='all' keeps all features.

Only evaluates features independently.

Best used inside a pipeline.

Performance Notes
Cheap compared with model-based selection.

Related APIs
SelectPercentile, chi2, mutual_info_classif

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectKBest.html

Task
Reduce Dimensionality with PCA

Problem Solved
Project features into a lower-dimensional orthogonal basis.

Mental Trigger
I need compact numeric representations.

Syntax

python
PCA(n_components=None, *, copy=True, whiten=False, svd_solver='auto', tol=0.0, iterated_power='auto', n_oversamples=10, power_iteration_normalizer='auto', random_state=None)
Important Parameters
n_components

whiten

svd_solver

random_state

Return Value
A fitted PCA transformer with component vectors and explained variance metadata.

Example

python
import numpy as np
from sklearn.decomposition import PCA

X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
X_pca = PCA(n_components=1).fit_transform(X)
Use When
Use for dense numeric dimensionality reduction.

Avoid When
Avoid if interpretability of original features is essential.

Gotchas
Input should usually be centered beforehand.

whiten=True changes downstream scale.

random_state matters for some solvers.

Sparse data usually needs another method.

Fit on training data only.

Performance Notes
Solver choice affects speed and memory.

Related APIs
TruncatedSVD, IncrementalPCA, FeatureAgglomeration

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html

Task
Reduce Sparse Data with TruncatedSVD

Problem Solved
Reduce dimensionality without centering sparse matrices.

Mental Trigger
My input is sparse.

Syntax

python
TruncatedSVD(n_components=2, *, algorithm='randomized', n_iter=5, n_oversamples=10, power_iteration_normalizer='auto', random_state=None, tol=0.0)
Important Parameters
n_components

algorithm

random_state

n_iter

Return Value
A fitted dimensionality-reduction transformer for sparse or dense matrices.

Example

python
import numpy as np
from sklearn.decomposition import TruncatedSVD

X = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]], dtype=float)
X_red = TruncatedSVD(n_components=2, random_state=0).fit_transform(X)
Use When
Use for sparse text or count data.

Avoid When
Avoid if true centering is required.

Gotchas
Unlike PCA, it does not center data.

Works well with sparse input.

random_state affects randomized solver output.

Component signs can vary.

Fit on training data only.

Performance Notes
Often preferable to PCA for large sparse matrices.

Related APIs
PCA, NMF, IncrementalPCA

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html

Pipelines
Task
Create Pipeline

Problem Solved
Chain preprocessing and estimators into a single reusable object.

Mental Trigger
I need one object for preprocessing and modeling.

Syntax

python
Pipeline(steps, *, memory=None, verbose=False)
Important Parameters
steps

memory

verbose

Return Value
A composite estimator that executes steps in sequence.

Example

python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
Use When
Use to prevent leakage and keep preprocessing tied to the model.

Avoid When
Avoid only when a simple standalone transformer or estimator is enough.

Gotchas
Step names must be unique.

Nested parameter access uses double underscores.

Later steps can only see outputs from earlier ones.

Pipeline cloning affects fitted state during search.

Fit the pipeline, not isolated preprocessing, for training workflows.

Performance Notes
Helpful for caching repeated transforms with memory.

Related APIs
make_pipeline, ColumnTransformer, GridSearchCV

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html

Task
Create ColumnTransformer

Problem Solved
Apply different transforms to different column subsets.

Mental Trigger
My table has mixed column types.

Syntax

python
ColumnTransformer(transformers, *, remainder='drop', sparse_threshold=0.3, n_jobs=None, transformer_weights=None, verbose=False, verbose_feature_names_out=True, force_int_remainder_cols='deprecated')
Important Parameters
transformers

remainder

sparse_threshold

n_jobs

verbose_feature_names_out

Return Value
A transformer that concatenates column-wise outputs.

Example

python
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

X = np.array([[1.0, "a"], [2.0, "b"]], dtype=object)

ct = ColumnTransformer([
    ("num", StandardScaler(), [0]),
    ("cat", OneHotEncoder(sparse_output=False), [1])
])
X_out = ct.fit_transform(X)
Use When
Use for mixed numeric and categorical feature sets.

Avoid When
Avoid for single-type feature matrices.

Gotchas
Column selection must match your input schema.

Output can become sparse or dense depending on threshold.

Feature name behavior matters for downstream inspection.

Misordered columns can silently break transforms.

Refit after schema changes.

Performance Notes
Parallelism is available across transformers via n_jobs.

Related APIs
Pipeline, make_column_transformer, set_output

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html

Task
Create Nested Pipeline

Problem Solved
Combine column-wise preprocessing with a downstream estimator.

Mental Trigger
I need preprocessing plus model training in one graph.

Syntax

python
Pipeline(steps, *, memory=None, verbose=False)
Important Parameters
steps

memory

verbose

Return Value
A nested estimator that can include a ColumnTransformer step.

Example

python
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

X = np.array([[1.0, "a"], [2.0, "b"], [3.0, "a"]], dtype=object)
y = np.array([0, 1, 0])

pre = ColumnTransformer([
    ("num", StandardScaler(), [0]),
    ("cat", OneHotEncoder(sparse_output=False), [1])
])

pipe = Pipeline([
    ("pre", pre),
    ("clf", LogisticRegression())
])
pipe.fit(X, y)
Use When
Use for end-to-end model fitting with mixed features.

Avoid When
Avoid when each transform must be managed independently.

Gotchas
Feature selection and encoding must occur inside the pipeline.

Parameters use nested names like pre__num__with_mean.

Fit only once on training data.

Inspect transformed output shapes carefully.

Cloning resets fitted state in search procedures.

Performance Notes
Supports caching and parallel preprocessing.

Related APIs
ColumnTransformer, Pipeline, GridSearchCV

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html

Task
Create Pipeline Without Verbose Step Names

Problem Solved
Build a pipeline quickly with auto-generated step names.

Mental Trigger
I want concise pipeline syntax.

Syntax

python
make_pipeline(*steps, memory=None, verbose=False)
Important Parameters
steps

memory

verbose

Return Value
A pipeline with automatically named steps.

Example

python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = make_pipeline(StandardScaler(), LogisticRegression())
Use When
Use for simple, readable pipeline construction.

Avoid When
Avoid when explicit step names are needed for search grids.

Gotchas
Auto-generated names depend on class names.

Parameter grids must use generated names.

Less explicit than Pipeline.

Works best for straightforward sequences.

Nested transformers still use double-underscore naming.

Performance Notes
Same execution characteristics as Pipeline.

Related APIs
Pipeline, make_column_transformer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html

Task
Create Column Transformer Quickly

Problem Solved
Build a column-wise transformer with compact syntax.

Mental Trigger
I want a concise column transform.

Syntax

python
make_column_transformer(*transformers, remainder='drop', sparse_threshold=0.3, n_jobs=None, verbose=False, verbose_feature_names_out=True)
Important Parameters
transformers

remainder

sparse_threshold

n_jobs

Return Value
A ColumnTransformer with auto-generated names.

Example

python
import numpy as np
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

X = np.array([[1.0, "a"], [2.0, "b"]], dtype=object)
ct = make_column_transformer(
    (StandardScaler(), [0]),
    (OneHotEncoder(sparse_output=False), [1])
)
X_out = ct.fit_transform(X)
Use When
Use for compact mixed-type preprocessing.

Avoid When
Avoid when explicit transformer names are important.

Gotchas
Step names are auto-generated.

Parameter grids must use generated names.

Column order must match your selectors.

Sparse output can appear unexpectedly.

Refit after schema changes.

Performance Notes
Supports parallel execution across column transformers.

Related APIs
ColumnTransformer, make_pipeline

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.compose.make_column_transformer.html

Model Training
Task
Train Logistic Regression

Problem Solved
Fit a linear classifier for binary or multiclass prediction.

Mental Trigger
I need a strong linear classifier.

Syntax

python
LogisticRegression(penalty='l2', *, dual=False, tol=0.0001, C=1.0, fit_intercept=True, intercept_scaling=1, class_weight=None, random_state=None, solver='lbfgs', max_iter=100, multi_class='auto', verbose=0, warm_start=False, n_jobs=None, l1_ratio=None)
Important Parameters
C

solver

max_iter

class_weight

random_state

Return Value
A fitted classifier with predict and often predict_proba.

Example

python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0.0, 0.0], [1.0, 1.0], [1.0, 0.0], [0.0, 1.0]])
y = np.array([0, 1, 1, 0])

clf = LogisticRegression().fit(X, y)
pred = clf.predict(X)
Use When
Use for tabular classification baselines and production scoring.

Avoid When
Avoid when nonlinearity dominates and a linear boundary is insufficient.

Gotchas
Scaling often helps optimization.

max_iter may need to increase for convergence.

Solver choice constrains penalty support.

Feature order at prediction must match training.

predict_proba is available only for certain configurations.

Performance Notes
n_jobs is limited by solver support; sparse input may require specific solvers.

Related APIs
RidgeClassifier, LinearSVC, SGDClassifier

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html

Task
Train Linear Regression

Problem Solved
Fit a linear predictor for continuous targets.

Mental Trigger
I need a baseline regression model.

Syntax

python
LinearRegression(*, fit_intercept=True, copy_X=True, n_jobs=None, positive=False)
Important Parameters
fit_intercept

copy_X

n_jobs

positive

Return Value
A fitted regressor with coefficients and intercept.

Example

python
import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1.0], [2.0], [3.0]])
y = np.array([2.0, 4.0, 6.0])

reg = LinearRegression().fit(X, y)
pred = reg.predict([[4.0]])
Use When
Use for simple interpretable regression baselines.

Avoid When
Avoid when regularization is needed.

Gotchas
Works best with well-conditioned features.

Multicollinearity can make coefficients unstable.

positive=True restricts coefficients to non-negative values.

Fit on training data only.

n_jobs matters only in certain cases.

Performance Notes
Usually fast; sparse and multi-target cases may vary.

Related APIs
Ridge, Lasso, ElasticNet

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html

Task
Train Ridge Regression

Problem Solved
Fit a linear model with L2 regularization.

Mental Trigger
I need a regularized linear regressor.

Syntax

python
Ridge(alpha=1.0, *, fit_intercept=True, copy_X=True, max_iter=None, tol=0.0001, solver='auto', positive=False, random_state=None)
Important Parameters
alpha

solver

max_iter

tol

random_state

Return Value
A fitted ridge regressor.

Example

python
import numpy as np
from sklearn.linear_model import Ridge

X = np.array([[1.0], [2.0], [3.0]])
y = np.array([1.0, 2.0, 2.9])

reg = Ridge(alpha=1.0).fit(X, y)
Use When
Use when you want stable coefficients and regularization.

Avoid When
Avoid when sparse exact feature selection is required.

Gotchas
Solver choice affects speed and numeric behavior.

alpha controls regularization strength.

Scaling improves comparability across coefficients.

Fit on training data only.

positive=True restricts coefficients.

Performance Notes
Solver-dependent; some solvers scale better on large data.

Related APIs
Lasso, ElasticNet, LinearRegression

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html

Task
Train Lasso Regression

Problem Solved
Fit a sparse linear model with L1 regularization.

Mental Trigger
I want feature sparsity.

Syntax

python
Lasso(alpha=1.0, *, fit_intercept=True, copy_X=True, max_iter=1000, tol=0.0001, warm_start=False, positive=False, random_state=None, selection='cyclic')
Important Parameters
alpha

max_iter

tol

positive

selection

Return Value
A fitted L1-regularized regressor.

Example

python
import numpy as np
from sklearn.linear_model import Lasso

X = np.array([[1.0, 0.0], [2.0, 1.0], [3.0, 1.0]])
y = np.array([1.0, 2.0, 3.0])

reg = Lasso(alpha=0.1).fit(X, y)
Use When
Use when sparse coefficient vectors are useful.

Avoid When
Avoid if all features should remain in the model.

Gotchas
Needs feature scaling in many cases.

max_iter may need tuning.

Strong regularization can zero out many coefficients.

Coordinate descent settings affect convergence.

Fit on training data only.

Performance Notes
Sparse solutions can reduce downstream storage.

Related APIs
ElasticNet, Ridge, SGDRegressor

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html

Task
Train ElasticNet

Problem Solved
Combine L1 and L2 regularization in one linear regressor.

Mental Trigger
I need a compromise between Ridge and Lasso.

Syntax

python
ElasticNet(alpha=1.0, *, l1_ratio=0.5, fit_intercept=True, copy_X=True, max_iter=1000, tol=0.0001, warm_start=False, positive=False, random_state=None, selection='cyclic')
Important Parameters
alpha

l1_ratio

max_iter

tol

selection

Return Value
A fitted elastic-net regressor.

Example

python
import numpy as np
from sklearn.linear_model import ElasticNet

X = np.array([[1.0, 0.0], [2.0, 1.0], [3.0, 1.0]])
y = np.array([1.0, 2.0, 3.0])

reg = ElasticNet(alpha=0.1, l1_ratio=0.7).fit(X, y)
Use When
Use when you want shrinkage plus some sparsity.

Avoid When
Avoid if pure Ridge or pure Lasso is a better fit.

Gotchas
Feature scaling matters.

l1_ratio controls the blend.

max_iter can require tuning.

selection affects solver behavior.

Fit on training data only.

Performance Notes
Coordinate descent behavior can vary with sparsity and scale.

Related APIs
Lasso, Ridge, SGDRegressor

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html

Task
Train Decision Tree Classifier

Problem Solved
Fit a tree-based classifier with simple threshold rules.

Mental Trigger
I need a nonlinear classifier.

Syntax

python
DecisionTreeClassifier(*, criterion='gini', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None, min_impurity_decrease=0.0, class_weight=None, ccp_alpha=0.0)
Important Parameters
max_depth

min_samples_leaf

max_features

random_state

class_weight

Return Value
A fitted decision tree classifier.

Example

python
import numpy as np
from sklearn.tree import DecisionTreeClassifier

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = DecisionTreeClassifier(random_state=0).fit(X, y)
Use When
Use for interpretable tree rules and nonlinear baselines.

Avoid When
Avoid without pruning or constraints on noisy data.

Gotchas
Trees can overfit easily.

random_state affects tie-breaking and splits.

Feature scaling is usually unnecessary.

Class imbalance can matter.

Fit on training data only.

Performance Notes
Tree growth can become expensive on wide or deep datasets.

Related APIs
DecisionTreeRegressor, RandomForestClassifier, ExtraTreesClassifier

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html

Task
Train Decision Tree Regressor

Problem Solved
Fit a tree-based regressor for nonlinear numeric targets.

Mental Trigger
I need nonlinear regression rules.

Syntax

python
DecisionTreeRegressor(*, criterion='squared_error', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None, min_impurity_decrease=0.0, ccp_alpha=0.0)
Important Parameters
max_depth

min_samples_leaf

max_features

random_state

ccp_alpha

Return Value
A fitted decision tree regressor.

Example

python
import numpy as np
from sklearn.tree import DecisionTreeRegressor

X = np.array([[0.0], [1.0], [2.0]])
y = np.array([0.0, 1.0, 4.0])

reg = DecisionTreeRegressor(random_state=0).fit(X, y)
Use When
Use for nonlinear tabular regression.

Avoid When
Avoid when smooth extrapolation is important.

Gotchas
Trees do not extrapolate well outside observed ranges.

Overfitting is common without constraints.

random_state controls split reproducibility.

Feature scaling is typically unnecessary.

Fit on training data only.

Performance Notes
Tree depth impacts memory and speed.

Related APIs
DecisionTreeClassifier, RandomForestRegressor, ExtraTreesRegressor

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html

Task
Train Random Forest Classifier

Problem Solved
Fit an ensemble of decision trees for classification.

Mental Trigger
I need a robust tree ensemble.

Syntax

python
RandomForestClassifier(n_estimators=100, *, criterion='gini', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features='sqrt', max_leaf_nodes=None, min_impurity_decrease=0.0, bootstrap=True, oob_score=False, n_jobs=None, random_state=None, verbose=0, warm_start=False, class_weight=None, ccp_alpha=0.0, max_samples=None, monotonic_cst=None)
Important Parameters
n_estimators

max_depth

max_features

n_jobs

random_state

Return Value
A fitted random forest classifier.

Example

python
import numpy as np
from sklearn.ensemble import RandomForestClassifier

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = RandomForestClassifier(random_state=0).fit(X, y)
Use When
Use for strong general-purpose tabular classification.

Avoid When
Avoid when model interpretability must be simple.

Gotchas
n_jobs enables parallel tree training.

random_state affects bootstrapping and splits.

Large forests can be memory-heavy.

Feature importances are not causal explanations.

Fit on training data only.

Performance Notes
Parallel training can help significantly.

Related APIs
ExtraTreesClassifier, DecisionTreeClassifier, HistGradientBoostingClassifier

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html

Task
Train Random Forest Regressor

Problem Solved
Fit an ensemble of trees for numeric prediction.

Mental Trigger
I need a strong tree ensemble for regression.

Syntax

python
RandomForestRegressor(n_estimators=100, *, criterion='squared_error', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=1.0, max_leaf_nodes=None, min_impurity_decrease=0.0, bootstrap=True, oob_score=False, n_jobs=None, random_state=None, verbose=0, warm_start=False, ccp_alpha=0.0, max_samples=None, monotonic_cst=None)
Important Parameters
n_estimators

max_depth

max_features

n_jobs

random_state

Return Value
A fitted random forest regressor.

Example

python
import numpy as np
from sklearn.ensemble import RandomForestRegressor

X = np.array([[0.0], [1.0], [2.0], [3.0]])
y = np.array([0.0, 1.0, 4.0, 9.0])

reg = RandomForestRegressor(random_state=0).fit(X, y)
Use When
Use for nonlinear tabular regression.

Avoid When
Avoid if training latency must be very low.

Gotchas
Forests can consume substantial memory.

n_jobs can improve training throughput.

Prediction is an average across trees.

random_state controls reproducibility.

Fit on training data only.

Performance Notes
Parallelizable and often strong out of the box.

Related APIs
ExtraTreesRegressor, DecisionTreeRegressor, HistGradientBoostingRegressor

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html

Task
Train Extra Trees Classifier

Problem Solved
Fit an extremely randomized tree ensemble for classification.

Mental Trigger
I want a fast tree ensemble variant.

Syntax

python
ExtraTreesClassifier(n_estimators=100, *, criterion='gini', max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features='sqrt', max_leaf_nodes=None, min_impurity_decrease=0.0, bootstrap=False, oob_score=False, n_jobs=None, random_state=None, verbose=0, warm_start=False, class_weight=None, ccp_alpha=0.0, max_samples=None, monotonic_cst=None)
Important Parameters
n_estimators

max_features

bootstrap

n_jobs

random_state

Return Value
A fitted extra-trees classifier.

Example

python
import numpy as np
from sklearn.ensemble import ExtraTreesClassifier

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = ExtraTreesClassifier(random_state=0).fit(X, y)
Use When
Use for strong bagged-tree baselines.

Avoid When
Avoid when deterministic tree splits are required without seeding.

Gotchas
Randomized split thresholds increase stochasticity.

n_jobs improves throughput.

bootstrap=False by default.

random_state matters.

Large ensembles can be memory-intensive.

Performance Notes
Often faster than random forests.

Related APIs
RandomForestClassifier, ExtraTreesRegressor

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html

Task
Train Gradient Boosting

Problem Solved
Fit an additive tree ensemble for classification or regression.

Mental Trigger
I need boosting with trees.

Syntax

python
GradientBoostingClassifier(*, loss='log_loss', learning_rate=0.1, n_estimators=100, subsample=1.0, criterion='friedman_mse', min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_depth=3, min_impurity_decrease=0.0, init=None, random_state=None, max_features=None, verbose=0, max_leaf_nodes=None, warm_start=False, validation_fraction=0.1, n_iter_no_change=None, tol=0.0001, ccp_alpha=0.0)
Important Parameters
learning_rate

n_estimators

max_depth

subsample

random_state

Return Value
A fitted gradient boosting classifier.

Example

python
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = GradientBoostingClassifier(random_state=0).fit(X, y)
Use When
Use for boosted tree classification on tabular data.

Avoid When
Avoid when you need very fast large-scale training.

Gotchas
Sensitive to learning-rate and tree-depth settings.

random_state affects subsampling and splits.

n_iter_no_change can trigger early stopping.

Feature scaling is usually unnecessary.

Fit on training data only.

Performance Notes
Can be slower than histogram-based boosting on large data.

Related APIs
HistGradientBoostingClassifier, AdaBoostClassifier, RandomForestClassifier

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html

Task
Train Histogram Gradient Boosting

Problem Solved
Fit a fast gradient boosting model optimized for larger tabular datasets.

Mental Trigger
I need a modern boosted-tree baseline.

Syntax

python
HistGradientBoostingClassifier(loss='log_loss', *, learning_rate=0.1, max_iter=100, max_leaf_nodes=31, max_depth=None, min_samples_leaf=20, max_bins=255, categorical_features=None, monotonic_cst=None, interaction_cst=None, warm_start=False, early_stopping='auto', scoring='loss', validation_fraction=0.1, n_iter_no_change=10, tol=1e-07, verbose=0, random_state=None, class_weight=None)
Important Parameters
max_iter

learning_rate

max_depth

early_stopping

random_state

Return Value
A fitted histogram-based gradient boosting classifier.

Example

python
import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = HistGradientBoostingClassifier(random_state=0).fit(X, y)
Use When
Use for larger tabular datasets.

Avoid When
Avoid if you need exact tree introspection comparable to simple trees.

Gotchas
Works well with modern scikit-learn defaults.

Early stopping can shorten training.

categorical_features needs careful configuration.

random_state matters.

Fit on training data only.

Performance Notes
Usually more scalable than classic gradient boosting.

Related APIs
HistGradientBoostingRegressor, GradientBoostingClassifier, RandomForestClassifier

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingClassifier.html

Task
Train AdaBoost

Problem Solved
Fit a boosting ensemble using a weak learner base estimator.

Mental Trigger
I need a classic boosting method.

Syntax

python
AdaBoostClassifier(*, estimator=None, n_estimators=50, learning_rate=1.0, algorithm='deprecated', random_state=None)
Important Parameters
estimator

n_estimators

learning_rate

random_state

Return Value
A fitted AdaBoost classifier.

Example

python
import numpy as np
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),
    random_state=0
).fit(X, y)
Use When
Use for lightweight boosting experiments.

Avoid When
Avoid if you want the strongest modern boosted-tree default.

Gotchas
estimator replaces older base-estimator naming.

Weak learners are common.

Random seed influences training.

Performance depends heavily on base estimator choice.

Fit on training data only.

Performance Notes
Often less scalable than histogram-based boosting.

Related APIs
GradientBoostingClassifier, HistGradientBoostingClassifier

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostClassifier.html

Task
Train K-Nearest Neighbors Classifier

Problem Solved
Predict class labels from the nearest training samples.

Mental Trigger
I need a distance-based classifier.

Syntax

python
KNeighborsClassifier(n_neighbors=5, *, weights='uniform', algorithm='auto', leaf_size=30, p=2, metric='minkowski', metric_params=None, n_jobs=None)
Important Parameters
n_neighbors

weights

metric

n_jobs

p

Return Value
A fitted k-nearest neighbors classifier.

Example

python
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = KNeighborsClassifier(n_neighbors=3).fit(X, y)
Use When
Use for local similarity-based prediction.

Avoid When
Avoid on very large datasets with slow inference requirements.

Gotchas
Scaling is often important.

Prediction cost grows with training set size.

n_jobs can help query throughput.

Metric choice changes behavior substantially.

Fit is cheap; predict is often expensive.

Performance Notes
Memory stores the training set; prediction can be costly.

Related APIs
KNeighborsRegressor, NearestNeighbors, RadiusNeighborsClassifier

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html

Task
Train K-Nearest Neighbors Regressor

Problem Solved
Predict numeric targets by local neighbor averaging.

Mental Trigger
I need a distance-based regressor.

Syntax

python
KNeighborsRegressor(n_neighbors=5, *, weights='uniform', algorithm='auto', leaf_size=30, p=2, metric='minkowski', metric_params=None, n_jobs=None)
Important Parameters
n_neighbors

weights

metric

n_jobs

p

Return Value
A fitted k-nearest neighbors regressor.

Example

python
import numpy as np
from sklearn.neighbors import KNeighborsRegressor

X = np.array([[0.0], [1.0], [2.0]])
y = np.array([0.0, 1.0, 4.0])

reg = KNeighborsRegressor(n_neighbors=2).fit(X, y)
Use When
Use for local regression baselines.

Avoid When
Avoid when extrapolation is required.

Gotchas
Scaling often changes results materially.

Prediction can be expensive on large training sets.

weights='distance' changes averaging.

Metric choice matters.

Fit on training data only.

Performance Notes
Large training sets increase latency and memory usage.

Related APIs
KNeighborsClassifier, NearestNeighbors

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html

Task
Train Support Vector Classifier

Problem Solved
Fit a margin-based classifier with kernel options.

Mental Trigger
I need a flexible SVM classifier.

Syntax

python
SVC(C=1.0, kernel='rbf', degree=3, gamma='scale', coef0=0.0, shrinking=True, probability=False, tol=0.001, cache_size=200, class_weight=None, verbose=False, max_iter=-1, decision_function_shape='ovr', break_ties=False, random_state=None)
Important Parameters
C

kernel

gamma

probability

class_weight

Return Value
A fitted support vector classifier.

Example

python
import numpy as np
from sklearn.svm import SVC

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = SVC(probability=True, random_state=0).fit(X, y)
Use When
Use for medium-sized classification problems.

Avoid When
Avoid on very large datasets unless you accept higher training cost.

Gotchas
Scaling is usually necessary.

probability=True increases training cost.

Kernel and gamma choices heavily affect behavior.

Prediction can be expensive with many support vectors.

Fit on training data only.

Performance Notes
Kernel methods can scale poorly with sample count.

Related APIs
SVR, LinearSVC, NuSVC

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html

Task
Train Support Vector Regressor

Problem Solved
Fit a margin-based regressor with kernel support.

Mental Trigger
I need nonlinear regression with SVMs.

Syntax

python
SVR(kernel='rbf', degree=3, gamma='scale', coef0=0.0, tol=0.001, C=1.0, epsilon=0.1, shrinking=True, cache_size=200, verbose=False, max_iter=-1)
Important Parameters
kernel

C

epsilon

gamma

max_iter

Return Value
A fitted support vector regressor.

Example

python
import numpy as np
from sklearn.svm import SVR

X = np.array([[0.0], [1.0], [2.0]])
y = np.array([0.0, 1.0, 4.0])

reg = SVR().fit(X, y)
Use When
Use for medium-sized nonlinear regression.

Avoid When
Avoid for very large datasets.

Gotchas
Scaling is usually necessary.

epsilon changes the insensitive tube.

Kernel choice drives runtime and accuracy.

Prediction cost grows with support vectors.

Fit on training data only.

Performance Notes
Kernel training and inference can be costly.

Related APIs
SVC, LinearSVR

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html

Task
Train Gaussian Naive Bayes

Problem Solved
Fit a fast probabilistic classifier for numeric features.

Mental Trigger
I need a simple generative classifier.

Syntax

python
GaussianNB(*, priors=None, var_smoothing=1e-09)
Important Parameters
priors

var_smoothing

Return Value
A fitted Gaussian Naive Bayes classifier.

Example

python
import numpy as np
from sklearn.naive_bayes import GaussianNB

X = np.array([[0.0, 1.0], [1.0, 0.0], [0.9, 1.1], [1.1, 0.9]])
y = np.array([0, 1, 0, 1])

clf = GaussianNB().fit(X, y)
Use When
Use for fast baselines on numeric features.

Avoid When
Avoid if feature distributions are far from Gaussian and accuracy is critical.

Gotchas
Assumes numeric features.

Very fast but often limited in expressiveness.

var_smoothing affects numerical stability.

Fit on training data only.

Probabilities can be overconfident.

Performance Notes
Very lightweight.

Related APIs
MultinomialNB, BernoulliNB

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html

Task
Train Multinomial Naive Bayes

Problem Solved
Fit a classifier for count-like nonnegative features.

Mental Trigger
My inputs are counts or tf-like values.

Syntax

python
MultinomialNB(*, alpha=1.0, force_alpha=True, fit_prior=True, class_prior=None)
Important Parameters
alpha

force_alpha

fit_prior

class_prior

Return Value
A fitted multinomial naive Bayes classifier.

Example

python
import numpy as np
from sklearn.naive_bayes import MultinomialNB

X = np.array([[2, 0], [0, 2], [1, 1]])
y = np.array([0, 1, 0])

clf = MultinomialNB().fit(X, y)
Use When
Use for counts, token frequencies, and similar nonnegative inputs.

Avoid When
Avoid for negative-valued features.

Gotchas
Inputs should be nonnegative.

Smoothing affects unseen feature handling.

Fit on training data only.

Often paired with sparse text features.

force_alpha controls minimum smoothing behavior.

Performance Notes
Efficient on sparse matrices.

Related APIs
BernoulliNB, GaussianNB, ComplementNB

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html

Task
Train Bernoulli Naive Bayes

Problem Solved
Fit a classifier for binary feature indicators.

Mental Trigger
My features are binary presence flags.

Syntax

python
BernoulliNB(*, alpha=1.0, force_alpha=True, binarize=0.0, fit_prior=True, class_prior=None)
Important Parameters
alpha

binarize

fit_prior

class_prior

Return Value
A fitted Bernoulli naive Bayes classifier.

Example

python
import numpy as np
from sklearn.naive_bayes import BernoulliNB

X = np.array([[1, 0], [0, 1], [1, 1]])
y = np.array([0, 1, 0])

clf = BernoulliNB().fit(X, y)
Use When
Use for binary indicator features.

Avoid When
Avoid for continuous-valued inputs unless binarization is desired.

Gotchas
Feature values are interpreted as binary events.

Binarization threshold matters.

Fit on training data only.

Sparse binary inputs are often efficient.

Probability estimates can be simple but weak.

Performance Notes
Compact and fast.

Related APIs
MultinomialNB, GaussianNB

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.BernoulliNB.html

Task
Train K-Means Clustering

Problem Solved
Group samples into a fixed number of clusters.

Mental Trigger
I need centroid-based clustering.

Syntax

python
KMeans(n_clusters=8, *, init='k-means++', n_init='auto', max_iter=300, tol=0.0001, verbose=0, random_state=None, copy_x=True, algorithm='lloyd')
Important Parameters
n_clusters

init

n_init

random_state

algorithm

Return Value
A fitted clustering estimator with cluster labels and centroids.

Example

python
import numpy as np
from sklearn.cluster import KMeans

X = np.array([[0.0, 0.0], [0.1, 0.2], [5.0, 5.0], [5.1, 4.9]])
km = KMeans(n_clusters=2, random_state=0).fit(X)
labels = km.labels_
Use When
Use for partitioning dense numeric data into k groups.

Avoid When
Avoid when cluster shapes are highly irregular.

Gotchas
n_init='auto' is the modern default behavior.

Scaling often matters.

random_state improves reproducibility.

Clusters are sensitive to initialization.

Fit on training data only.

Performance Notes
Repeated initializations increase runtime.

Related APIs
MiniBatchKMeans, DBSCAN, AgglomerativeClustering

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html

Task
Train DBSCAN

Problem Solved
Detect density-based clusters and noise points.

Mental Trigger
I need clustering with outlier detection.

Syntax

python
DBSCAN(eps=0.5, *, min_samples=5, metric='euclidean', metric_params=None, algorithm='auto', leaf_size=30, p=None, n_jobs=None)
Important Parameters
eps

min_samples

metric

n_jobs

algorithm

Return Value
A fitted clustering estimator with labels_ including noise points.

Example

python
import numpy as np
from sklearn.cluster import DBSCAN

X = np.array([[0.0, 0.0], [0.1, 0.2], [5.0, 5.0], [5.1, 4.9]])
db = DBSCAN(eps=0.5, min_samples=2).fit(X)
labels = db.labels_
Use When
Use when clusters may have arbitrary shapes and noise matters.

Avoid When
Avoid when you need a predefined number of clusters.

Gotchas
Sensitive to eps.

Feature scaling can strongly affect results.

labels_ == -1 marks noise.

Neighbor search can be expensive.

Fit on training data only.

Performance Notes
May become costly on large high-dimensional data.

Related APIs
KMeans, OPTICS, NearestNeighbors

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html

Hyperparameter Search
Task
Search Parameters by Grid

Problem Solved
Evaluate a fixed set of parameter combinations.

Mental Trigger
I know the candidate settings.

Syntax

python
GridSearchCV(estimator, param_grid, *, scoring=None, n_jobs=None, refit=True, cv=None, verbose=0, pre_dispatch='2*n_jobs', error_score=nan, return_train_score=False)
Important Parameters
estimator

param_grid

scoring

cv

n_jobs

Return Value
A fitted search object with best_estimator_ and best_params_.

Example

python
import numpy as np
from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

search = GridSearchCV(LogisticRegression(), {"C": [0.1, 1.0]}, cv=2)
search.fit(X, y)
Use When
Use when parameter space is small and discrete.

Avoid When
Avoid when the search space is large.

Gotchas
Parameter names must match estimator attributes.

Use pipeline step prefixes for nested objects.

Search refits the best model by default.

Cross-validation folds affect selection.

Parallel jobs can increase memory use.

Performance Notes
n_jobs can speed evaluation but increases resource use.

Related APIs
RandomizedSearchCV, HalvingGridSearchCV, cross_validate

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html

Task
Search Parameters Randomly

Problem Solved
Sample parameter combinations from distributions or lists.

Mental Trigger
My parameter space is large.

Syntax

python
RandomizedSearchCV(estimator, param_distributions, *, n_iter=10, scoring=None, n_jobs=None, refit=True, cv=None, verbose=0, pre_dispatch='2*n_jobs', random_state=None, error_score=nan, return_train_score=False)
Important Parameters
param_distributions

n_iter

random_state

cv

n_jobs

Return Value
A fitted randomized search object.

Example

python
import numpy as np
from sklearn.model_selection import RandomizedSearchCV
from sklearn.svm import SVC

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

search = RandomizedSearchCV(SVC(), {"C": [0.1, 1, 10]}, n_iter=2, random_state=0, cv=2)
search.fit(X, y)
Use When
Use for broad exploration with limited budget.

Avoid When
Avoid when reproducibility without a seed matters.

Gotchas
Sampling depends on the provided distributions.

random_state controls repeatability.

Search results vary with n_iter.

Nested parameter names still apply.

Parallelization increases memory pressure.

Performance Notes
Often more efficient than exhaustive grids.

Related APIs
GridSearchCV, HalvingRandomSearchCV

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html

Task
Search Parameters with Successive Halving

Problem Solved
Allocate more budget to promising candidates progressively.

Mental Trigger
I need a budget-aware search.

Syntax

python
HalvingGridSearchCV(estimator, param_grid, *, factor=3, resource='n_samples', max_resources='auto', min_resources='exhaust', aggressive_elimination=False, cv=5, scoring=None, refit=True, error_score=nan, return_train_score=False, random_state=None, n_jobs=None, verbose=0)
Important Parameters
param_grid

factor

resource

cv

n_jobs

Return Value
A fitted halving search object.

Example

python
import numpy as np
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingGridSearchCV
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

search = HalvingGridSearchCV(LogisticRegression(), {"C": [0.1, 1.0]}, cv=2)
search.fit(X, y)
Use When
Use when you need faster pruning over a discrete grid.

Avoid When
Avoid if the candidate set is tiny.

Gotchas
Requires the experimental import in current stable releases.

Resource allocation changes across iterations.

Nested estimator names still apply.

Search behavior depends on factor.

Not always the right default for small problems.

Performance Notes
Can save compute by discarding weak candidates early.

Related APIs
HalvingRandomSearchCV, GridSearchCV

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingGridSearchCV.html

Task
Search Randomly with Successive Halving

Problem Solved
Combine randomized sampling with iterative budget allocation.

Mental Trigger
I want randomized search with pruning.

Syntax

python
HalvingRandomSearchCV(estimator, param_distributions, *, n_candidates='exhaust', factor=3, resource='n_samples', max_resources='auto', min_resources='smallest', aggressive_elimination=False, cv=5, scoring=None, refit=True, error_score=nan, return_train_score=False, random_state=None, n_jobs=None, verbose=0)
Important Parameters
param_distributions

n_candidates

factor

random_state

cv

Return Value
A fitted halving randomized search object.

Example

python
import numpy as np
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingRandomSearchCV
from sklearn.svm import SVC

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

search = HalvingRandomSearchCV(SVC(), {"C": [0.1, 1, 10]}, random_state=0, cv=2)
search.fit(X, y)
Use When
Use for exploratory search with compute limits.

Avoid When
Avoid if you need deterministic exhaustive coverage.

Gotchas
Requires the experimental import in current stable releases.

Random seed affects sampled candidates.

Search budget changes across rounds.

Param names must match the estimator.

Not all estimators benefit equally.

Performance Notes
Efficient for wide search spaces.

Related APIs
HalvingGridSearchCV, RandomizedSearchCV

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingRandomSearchCV.html

Model Evaluation
Task
Measure Accuracy

Problem Solved
Compute the fraction of correct classifications.

Mental Trigger
I need a simple classification score.

Syntax

python
accuracy_score(y_true, y_pred, *, normalize=True, sample_weight=None)
Important Parameters
normalize

sample_weight

Return Value
A scalar score.

Example

python
import numpy as np
from sklearn.metrics import accuracy_score

y_true = np.array([0, 1, 1])
y_pred = np.array([0, 0, 1])
score = accuracy_score(y_true, y_pred)
Use When
Use for a basic classification metric.

Avoid When
Avoid as the only metric on imbalanced data.

Gotchas
Can hide poor minority-class performance.

normalize=False returns counts.

Works on multiclass targets too.

Sample weights change the result.

Not suitable for regression.

Performance Notes
Very cheap.

Related APIs
balanced_accuracy_score, f1_score, classification_report

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html

Task
Measure Precision

Problem Solved
Measure how many predicted positives are correct.

Mental Trigger
False positives are expensive.

Syntax

python
precision_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')
Important Parameters
average

pos_label

zero_division

sample_weight

Return Value
A scalar precision score.

Example

python
import numpy as np
from sklearn.metrics import precision_score

y_true = np.array([0, 1, 1, 0])
y_pred = np.array([0, 1, 0, 0])
score = precision_score(y_true, y_pred)
Use When
Use when false positives matter.

Avoid When
Avoid without understanding the averaging mode.

Gotchas
Averaging mode changes meaning.

zero_division handles no-positive cases.

Binary default assumes positive label 1.

Multiclass use requires explicit averaging.

Works only for classification.

Performance Notes
Cheap to compute.

Related APIs
recall_score, f1_score, classification_report

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html

Task
Measure Recall

Problem Solved
Measure how many actual positives are found.

Mental Trigger
Missing positives is expensive.

Syntax

python
recall_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')
Important Parameters
average

pos_label

zero_division

sample_weight

Return Value
A scalar recall score.

Example

python
import numpy as np
from sklearn.metrics import recall_score

y_true = np.array([0, 1, 1, 0])
y_pred = np.array([0, 1, 0, 0])
score = recall_score(y_true, y_pred)
Use When
Use when false negatives matter.

Avoid When
Avoid without choosing the correct averaging strategy.

Gotchas
Binary default uses label 1.

Average mode changes the interpretation.

zero_division matters when no positives are predicted.

Sample weights alter the result.

Not for regression.

Performance Notes
Very cheap.

Related APIs
precision_score, f1_score, balanced_accuracy_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html

Task
Measure F1 Score

Problem Solved
Combine precision and recall into one metric.

Mental Trigger
I need one balanced classification score.

Syntax

python
f1_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')
Important Parameters
average

pos_label

zero_division

sample_weight

Return Value
A scalar F1 score.

Example

python
import numpy as np
from sklearn.metrics import f1_score

y_true = np.array([0, 1, 1, 0])
y_pred = np.array([0, 1, 0, 0])
score = f1_score(y_true, y_pred)
Use When
Use when precision and recall both matter.

Avoid When
Avoid if class imbalance requires a different metric.

Gotchas
Depends on both precision and recall.

Averaging mode must match your task.

zero_division handles edge cases.

Binary default assumes positive label 1.

Not for regression.

Performance Notes
Very cheap.

Related APIs
precision_score, recall_score, classification_report

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html

Task
Measure ROC AUC

Problem Solved
Evaluate ranking quality across decision thresholds.

Mental Trigger
I need threshold-independent discrimination quality.

Syntax

python
roc_auc_score(y_true, y_score, *, average='macro', sample_weight=None, max_fpr=None, multi_class='raise', labels=None)
Important Parameters
y_score

average

multi_class

max_fpr

sample_weight

Return Value
A scalar area-under-curve score.

Example

python
import numpy as np
from sklearn.metrics import roc_auc_score

y_true = np.array([0, 1, 1, 0])
y_score = np.array([0.1, 0.8, 0.7, 0.2])
score = roc_auc_score(y_true, y_score)
Use When
Use for ranking and probability-quality evaluation.

Avoid When
Avoid if only hard class labels are available.

Gotchas
Requires scores, not class labels.

Multiclass handling requires explicit configuration.

max_fpr is for standardized partial AUC.

Sample weights affect the area.

Not all estimators expose usable scores.

Performance Notes
Lightweight.

Related APIs
roc_curve, RocCurveDisplay, average_precision_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html

Task
Build Confusion Matrix

Problem Solved
Summarize classification outcomes by true and predicted labels.

Mental Trigger
I need error counts by class.

Syntax

python
confusion_matrix(y_true, y_pred, *, labels=None, sample_weight=None, normalize=None)
Important Parameters
labels

sample_weight

normalize

Return Value
A 2D array of counts or normalized counts.

Example

python
import numpy as np
from sklearn.metrics import confusion_matrix

y_true = np.array([0, 1, 1, 0])
y_pred = np.array([0, 1, 0, 0])
cm = confusion_matrix(y_true, y_pred)
Use When
Use to inspect classification error patterns.

Avoid When
Avoid when a single scalar metric is sufficient.

Gotchas
Label order matters.

Normalization changes interpretation.

Class imbalance can dominate raw counts.

Works for multiclass too.

Use with displays for easier reading.

Performance Notes
Cheap to compute.

Related APIs
ConfusionMatrixDisplay, classification_report

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html

Task
Generate Classification Report

Problem Solved
Print precision, recall, F1, and support in one summary.

Mental Trigger
I want a per-class metric table.

Syntax

python
classification_report(y_true, y_pred, *, labels=None, target_names=None, sample_weight=None, digits=2, output_dict=False, zero_division='warn')
Important Parameters
labels

target_names

output_dict

zero_division

sample_weight

Return Value
A formatted string or dictionary of metric values.

Example

python
import numpy as np
from sklearn.metrics import classification_report

y_true = np.array([0, 1, 1, 0])
y_pred = np.array([0, 1, 0, 0])
report = classification_report(y_true, y_pred)
Use When
Use for quick per-class evaluation.

Avoid When
Avoid when you need only a single scalar objective.

Gotchas
Output formatting is not ideal for programmatic logic unless output_dict=True.

Label order and names matter.

zero_division controls division edge cases.

Aggregates can hide minority class behavior.

Not for regression.

Performance Notes
Very cheap.

Related APIs
precision_score, recall_score, f1_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html

Task
Measure Balanced Accuracy

Problem Solved
Average recall across classes to reduce class-imbalance bias.

Mental Trigger
My classes are imbalanced.

Syntax

python
balanced_accuracy_score(y_true, y_pred, *, sample_weight=None, adjusted=False)
Important Parameters
sample_weight

adjusted

Return Value
A scalar balanced accuracy score.

Example

python
import numpy as np
from sklearn.metrics import balanced_accuracy_score

y_true = np.array([0, 0, 1, 1])
y_pred = np.array([0, 1, 1, 1])
score = balanced_accuracy_score(y_true, y_pred)
Use When
Use for imbalanced classification.

Avoid When
Avoid if class-weighted loss already captures your objective precisely.

Gotchas
Better than plain accuracy for imbalance.

adjusted=True changes the baseline.

Works for multiclass.

Sample weights affect the score.

Still only one view of model quality.

Performance Notes
Cheap.

Related APIs
accuracy_score, recall_score, confusion_matrix

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html

Task
Compute Precision-Recall Curve

Problem Solved
Generate precision and recall values across thresholds.

Mental Trigger
I need threshold tradeoff points.

Syntax

python
precision_recall_curve(y_true, probas_pred, *, pos_label=None, sample_weight=None, drop_intermediate=False)
Important Parameters
pos_label

sample_weight

drop_intermediate

Return Value
Precision, recall, and threshold arrays.

Example

python
import numpy as np
from sklearn.metrics import precision_recall_curve

y_true = np.array([0, 1, 1, 0])
scores = np.array([0.1, 0.8, 0.7, 0.2])
precision, recall, thresholds = precision_recall_curve(y_true, scores)
Use When
Use for threshold selection in imbalanced classification.

Avoid When
Avoid if you only need a single hard-label metric.

Gotchas
Requires score values, not labels.

Threshold array length differs from precision/recall arrays.

drop_intermediate may reduce points.

Positive label handling matters.

Pair with displays for visualization.

Performance Notes
Lightweight.

Related APIs
PrecisionRecallDisplay, average_precision_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html

Task
Compute ROC Curve

Problem Solved
Generate true-positive and false-positive rates across thresholds.

Mental Trigger
I need threshold curve data.

Syntax

python
roc_curve(y_true, y_score, *, pos_label=None, sample_weight=None, drop_intermediate=True)
Important Parameters
pos_label

sample_weight

drop_intermediate

Return Value
False positive rates, true positive rates, and thresholds.

Example

python
import numpy as np
from sklearn.metrics import roc_curve

y_true = np.array([0, 1, 1, 0])
scores = np.array([0.1, 0.8, 0.7, 0.2])
fpr, tpr, thresholds = roc_curve(y_true, scores)
Use When
Use for threshold analysis and ROC plotting.

Avoid When
Avoid if score distributions are not meaningful.

Gotchas
Requires score values.

Thresholds are returned in descending score order.

drop_intermediate simplifies the curve.

Positive-label conventions matter.

Works best with binary classification.

Performance Notes
Cheap.

Related APIs
roc_auc_score, RocCurveDisplay

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html

Task
Measure Mean Squared Error

Problem Solved
Compute average squared prediction error for regression.

Mental Trigger
I need a standard regression loss.

Syntax

python
mean_squared_error(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average')
Important Parameters
sample_weight

multioutput

Return Value
A scalar or array of errors.

Example

python
import numpy as np
from sklearn.metrics import mean_squared_error

y_true = np.array([1.0, 2.0, 3.0])
y_pred = np.array([1.1, 1.9, 2.8])
mse = mean_squared_error(y_true, y_pred)
Use When
Use for standard regression evaluation.

Avoid When
Avoid if large errors should not dominate so strongly.

Gotchas
Penalizes larger errors more heavily.

multioutput changes aggregation behavior.

Sample weights affect the result.

Not robust to outliers.

Not a classification metric.

Performance Notes
Cheap.

Related APIs
mean_absolute_error, root_mean_squared_error, r2_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html

Task
Measure Mean Absolute Error

Problem Solved
Compute average absolute regression error.

Mental Trigger
I need a robust regression error metric.

Syntax

python
mean_absolute_error(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average')
Important Parameters
sample_weight

multioutput

Return Value
A scalar or array of absolute errors.

Example

python
import numpy as np
from sklearn.metrics import mean_absolute_error

y_true = np.array([1.0, 2.0, 3.0])
y_pred = np.array([1.1, 1.9, 2.8])
mae = mean_absolute_error(y_true, y_pred)
Use When
Use when absolute deviations are easier to interpret.

Avoid When
Avoid if squared-error penalties are required.

Gotchas
Less sensitive to outliers than MSE.

multioutput affects aggregation.

Sample weights are supported.

Not for classification.

No direct threshold interpretation.

Performance Notes
Cheap.

Related APIs
mean_squared_error, root_mean_squared_error, r2_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html

Task
Measure Root Mean Squared Error

Problem Solved
Compute error in the original target units while preserving squared-loss sensitivity.

Mental Trigger
I want RMSE, not MSE.

Syntax

python
root_mean_squared_error(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average')
Important Parameters
sample_weight

multioutput

Return Value
A scalar or array of root mean squared errors.

Example

python
import numpy as np
from sklearn.metrics import root_mean_squared_error

y_true = np.array([1.0, 2.0, 3.0])
y_pred = np.array([1.1, 1.9, 2.8])
rmse = root_mean_squared_error(y_true, y_pred)
Use When
Use when you want error in target units.

Avoid When
Avoid if you need a linear absolute-error measure.

Gotchas
Returned value is in the same units as the target.

Sensitive to large errors.

multioutput changes aggregation.

Sample weights affect the result.

Regression only.

Performance Notes
Cheap.

Related APIs
mean_squared_error, mean_absolute_error

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.root_mean_squared_error.html

Task
Measure R2 Score

Problem Solved
Measure proportion of variance explained by predictions.

Mental Trigger
I need a relative regression score.

Syntax

python
r2_score(y_true, y_pred, *, sample_weight=None, multioutput='uniform_average', force_finite=True)
Important Parameters
sample_weight

multioutput

force_finite

Return Value
A scalar R2 score.

Example

python
import numpy as np
from sklearn.metrics import r2_score

y_true = np.array([1.0, 2.0, 3.0])
y_pred = np.array([1.0, 2.1, 2.9])
score = r2_score(y_true, y_pred)
Use When
Use for general regression evaluation.

Avoid When
Avoid as the only metric if target scale matters.

Gotchas
Can be negative.

force_finite changes behavior on constant targets.

Multioutput handling matters.

Sample weights affect the score.

Not a loss function.

Performance Notes
Cheap.

Related APIs
mean_squared_error, mean_absolute_error, explained_variance_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html

Model Validation
Task
Cross-Validate a Model

Problem Solved
Estimate generalization performance over repeated folds.

Mental Trigger
I need a validation score.

Syntax

python
cross_val_score(estimator, X, y=None, *, groups=None, scoring=None, cv=None, n_jobs=None, verbose=0, params=None, pre_dispatch='2*n_jobs', error_score=nan)
Important Parameters
estimator

scoring

cv

n_jobs

groups

Return Value
An array of test scores, one per split.

Example

python
import numpy as np
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

scores = cross_val_score(LogisticRegression(), X, y, cv=2)
Use When
Use for quick validation over multiple folds.

Avoid When
Avoid when you need detailed fold-by-fold outputs beyond scores.

Gotchas
The estimator is cloned for each split.

Group-aware splitters require groups.

Preprocessing must usually be inside a pipeline.

Parallelization increases memory use.

Scores depend on the chosen splitter.

Performance Notes
n_jobs can speed evaluation.

Related APIs
cross_validate, GridSearchCV, learning_curve

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html

Task
Cross-Validate with Multiple Metrics

Problem Solved
Collect several validation metrics and timing information in one run.

Mental Trigger
I need more than one score.

Syntax

python
cross_validate(estimator, X, y=None, *, groups=None, scoring=None, cv=None, n_jobs=None, verbose=0, params=None, pre_dispatch='2*n_jobs', return_train_score=False, return_estimator=False, return_indices=False, error_score=nan)
Important Parameters
scoring

cv

return_train_score

return_estimator

n_jobs

Return Value
A dictionary of arrays containing scores and optional estimators or indices.

Example

python
import numpy as np
from sklearn.model_selection import cross_validate
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

out = cross_validate(LogisticRegression(), X, y, cv=2, scoring=["accuracy"])
Use When
Use when you need train/test metrics and timings.

Avoid When
Avoid if a single metric is enough.

Gotchas
Returned keys depend on options used.

Returning estimators increases memory use.

Preprocessing should be inside the estimator.

scoring can be a string, list, or dict.

Cloning resets fitted state across folds.

Performance Notes
More expensive than cross_val_score if extra outputs are requested.

Related APIs
cross_val_score, GridSearchCV, validation_curve

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html

Task
Plot Validation Curve Data

Problem Solved
Evaluate how scores change as one hyperparameter varies.

Mental Trigger
I need a parameter sweep.

Syntax

python
validation_curve(estimator, X, y, *, param_name, param_range, groups=None, cv=None, scoring=None, n_jobs=None, pre_dispatch='all', verbose=0, error_score=nan, fit_params=None, params=None)
Important Parameters
param_name

param_range

cv

scoring

n_jobs

Return Value
Train and validation scores for each parameter value.

Example

python
import numpy as np
from sklearn.model_selection import validation_curve
from sklearn.svm import SVC

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

train_scores, test_scores = validation_curve(
    SVC(), X, y, param_name="C", param_range=[0.1, 1, 10], cv=2
)
Use When
Use to inspect a single hyperparameter trend.

Avoid When
Avoid for large hyperparameter grids.

Gotchas
Only one parameter varies at a time.

Cloning means no reuse of fitted state.

Preprocessing should be in a pipeline.

param_name must match the estimator.

Results depend on the CV splitter.

Performance Notes
Parallelization can help on expensive estimators.

Related APIs
learning_curve, GridSearchCV, cross_validate

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.validation_curve.html

Task
Plot Learning Curve Data

Problem Solved
Measure score growth as training set size increases.

Mental Trigger
I need to see sample-size effects.

Syntax

python
learning_curve(estimator, X, y, *, groups=None, train_sizes=np.linspace(0.1, 1.0, 5), cv=None, scoring=None, exploit_incremental_learning=False, n_jobs=None, pre_dispatch='all', verbose=0, shuffle=False, random_state=None, error_score=nan, params=None)
Important Parameters
train_sizes

cv

scoring

shuffle

random_state

Return Value
Train sizes and training/validation scores for each size.

Example

python
import numpy as np
from sklearn.model_selection import learning_curve
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

sizes, train_scores, test_scores = learning_curve(
    LogisticRegression(), X, y, cv=2, train_sizes=[0.5, 1.0]
)
Use When
Use to inspect whether more data is likely to help.

Avoid When
Avoid if you just need a final evaluation number.

Gotchas
The estimator is refit many times.

shuffle only matters for how subsets are sampled.

Preprocessing should be inside a pipeline.

Large datasets can make it expensive.

Scores depend on the chosen metric and splitter.

Performance Notes
Can be costly; use n_jobs carefully.

Related APIs
validation_curve, cross_validate

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.learning_curve.html

Prediction
Task
Predict Labels

Problem Solved
Generate the primary output from a fitted estimator.

Mental Trigger
I need model outputs.

Syntax

python
estimator.predict(X)
Important Parameters
X

Return Value
Predicted labels or numeric values, depending on the estimator.

Example

python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = LogisticRegression().fit(X, y)
pred = clf.predict(X)
Use When
Use after fitting an estimator.

Avoid When
Avoid before fitting.

Gotchas
Input shape must match training feature layout.

Many estimators require numeric arrays.

Transforming preprocessing must match training.

Some estimators return class labels, others numeric targets.

Use pipelines to keep preprocessing aligned.

Performance Notes
Inference cost varies by estimator.

Related APIs
predict_proba, decision_function, score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.base.BaseEstimator.html

Task
Predict Probabilities

Problem Solved
Return class probability estimates for classifiers.

Mental Trigger
I need calibrated-like class probabilities.

Syntax

python
estimator.predict_proba(X)
Important Parameters
X

Return Value
Array of probability estimates per class.

Example

python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = LogisticRegression().fit(X, y)
proba = clf.predict_proba(X)
Use When
Use for thresholding and ranking tasks.

Avoid When
Avoid if the estimator does not support probabilities.

Gotchas
Not every classifier implements it.

Class order follows classes_.

Output shape is (n_samples, n_classes).

Probabilities are model-dependent, not always calibrated.

Fit must happen first.

Performance Notes
Can be more expensive than predict.

Related APIs
decision_function, roc_curve, precision_recall_curve

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html

Task
Compute Decision Scores

Problem Solved
Get signed confidence scores for ranking or thresholding.

Mental Trigger
I need raw model scores.

Syntax

python
estimator.decision_function(X)
Important Parameters
X

Return Value
A score array or vector.

Example

python
import numpy as np
from sklearn.svm import SVC

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = SVC().fit(X, y)
scores = clf.decision_function(X)
Use When
Use for ranking or custom thresholds.

Avoid When
Avoid if probability estimates are required and unsupported.

Gotchas
Output meaning varies by estimator.

Score scale is not a probability scale.

Not all estimators implement it.

Binary and multiclass shapes can differ.

Fit before calling.

Performance Notes
Often cheaper than probability prediction.

Related APIs
predict_proba, roc_curve, CalibratedClassifierCV

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html

Task
Transform Features

Problem Solved
Apply a fitted transformer to input data.

Mental Trigger
I need the transformed matrix.

Syntax

python
transform(X)
Important Parameters
X

Return Value
Transformed feature matrix or array.

Example

python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0], [2.0], [3.0]])
scaler = StandardScaler().fit(X)
X_scaled = scaler.transform(X)
Use When
Use after fitting a transformer.

Avoid When
Avoid before fitting or on incompatible data.

Gotchas
Fit state must exist.

Shape and type can change.

Output may be sparse or dense.

Column order must match training.

Some transformers require 2D input.

Performance Notes
Transform cost depends on the transformer.

Related APIs
fit_transform, inverse_transform, Pipeline

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html

Task
Fit and Transform

Problem Solved
Fit a transformer and immediately apply it.

Mental Trigger
I need one-step preprocessing.

Syntax

python
fit_transform(X, y=None, **fit_params)
Important Parameters
X

y

Return Value
Transformed data after fitting.

Example

python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0], [2.0], [3.0]])
X_scaled = StandardScaler().fit_transform(X)
Use When
Use for preprocessing during training.

Avoid When
Avoid for test data transformations.

Gotchas
Do not use on validation/test sets as a fit step.

Not every estimator has a native fit_transform.

Equivalent to fit(...).transform(...) for transformers.

May accept y for supervised transformers.

Use inside pipelines to avoid leakage.

Performance Notes
Convenient but still subject to transformer cost.

Related APIs
transform, Pipeline

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html

Task
Invert a Transform

Problem Solved
Map transformed data back to the original feature space.

Mental Trigger
I need to undo preprocessing.

Syntax

python
inverse_transform(X)
Important Parameters
X

Return Value
Recovered data in the original feature space, when supported.

Example

python
import numpy as np
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0], [2.0], [3.0]])
scaler = StandardScaler().fit(X)
X_back = scaler.inverse_transform(scaler.transform(X))
Use When
Use for reconstructing original-scale data.

Avoid When
Avoid if the transformer is not invertible.

Gotchas
Not all transformers support inversion.

Precision loss can occur.

Output may not exactly equal the input.

Must be fitted.

Shape must match the transformed representation.

Performance Notes
Usually lightweight.

Related APIs
transform, PCA, FunctionTransformer

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html

Task
Score a Fitted Estimator

Problem Solved
Compute the estimator’s built-in evaluation score on given data.

Mental Trigger
I need the estimator’s default score.

Syntax

python
estimator.score(X, y=None, sample_weight=None)
Important Parameters
X

y

sample_weight

Return Value
A scalar score.

Example

python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

clf = LogisticRegression().fit(X, y)
score = clf.score(X, y)
Use When
Use for the estimator’s default evaluation rule.

Avoid When
Avoid if you need a custom metric.

Gotchas
The score definition varies by estimator.

Default scoring may not match your business metric.

Preprocessing must be consistent with training.

Can hide poor class-specific behavior.

Not a substitute for explicit metrics.

Performance Notes
Usually cheap.

Related APIs
accuracy_score, r2_score, cross_val_score

Official Documentation
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html

Model Persistence
Task
Save a Trained Artifact

Problem Solved
Persist fitted estimators to disk.

Mental Trigger
I need to serialize my model.

Syntax
python
joblib.dump(value, filename, compress=0, protocol=None)
Important Parameters
value

filename

compress

protocol

Return Value
A list of saved file names.

Example
python
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = np.array([0, 1, 1, 0])

model = LogisticRegression().fit(X, y)
joblib.dump(model, "model.joblib")
Use When
Use for storing fitted scikit-learn objects.

Avoid When
Avoid for untrusted data sources.

Gotchas
Deserialize only trusted artifacts.

Saved objects depend on library versions.

Pipelines and preprocessors should be saved together.

Compression trades speed for file size.

Always version your model artifacts.

Performance Notes
Compression affects save/load latency.

Related APIs
joblib.load, Pipeline

Official Documentation
https://joblib.readthedocs.io/en/stable/generated/joblib.dump.html

Task
Load a Trained Artifact

Problem Solved
Restore a persisted estimator or pipeline from disk.

Mental Trigger
I need to reuse a saved model.

Syntax
python
joblib.load(filename, mmap_mode=None)
Important Parameters
filename

mmap_mode

Return Value
The loaded Python object.

Example
python
import joblib

model = joblib.load("model.joblib")
Use When
Use to restore trained models for inference.

Avoid When
Avoid with untrusted files.

Gotchas
Version mismatches can break compatibility.

Trust boundary matters for pickle-based loading.

Load the same preprocessing bundle you saved.

Memory mapping has specific use cases.

File paths must exist and be readable.

Performance Notes
Loading large arrays can be expensive.

Related APIs
joblib.dump, Pipeline

Official Documentation
https://joblib.readthedocs.io/en/stable/generated/joblib.load.html

Feature Inspection
Task
Measure Permutation Importance

Problem Solved
Estimate feature importance by score degradation after shuffling.

Mental Trigger
I need model-agnostic importance.

Syntax
python
permutation_importance(estimator, X, y, *, scoring=None, n_repeats=5, n_jobs=None, random_state=None, sample_weight=None, max_samples=1.0)
Important Parameters
scoring

n_repeats

n_jobs

random_state

max_samples

Return Value
A result object with importances and their variability.

Exality.
Exa
