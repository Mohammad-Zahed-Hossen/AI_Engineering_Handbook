### Setup & Reproducibility

**Task**
Set global scikit-learn configuration.

**Mental Trigger**
You want to control output formatting, metadata routing, or estimator display settings for a notebook or script.

**Syntax**

```python
from sklearn import set_config, get_config, config_context

set_config(display="diagram")
cfg = get_config()

with config_context(display="text"):
    pass
```

**Quick Note**
Use `set_config()` for process-wide settings and `config_context()` for local overrides. `get_config()` returns the current active configuration.

**Common Gotcha**
Issue: Settings leak into unrelated code.
Cause: Using `set_config()` when a temporary override is enough.
Quick Fix: Use `config_context()` for scoped changes.

**Official API**
[sklearn.set_config](https://scikit-learn.org/stable/api/sklearn.html)

**Related APIs**
`get_config()`
`config_context()`
`show_versions()`

**Task**
Show installed scikit-learn versions and dependency info.

**Mental Trigger**
You need to verify the runtime environment before debugging or reproducing a result.

**Syntax**

```python
from sklearn import show_versions

show_versions()
```

**Quick Note**
Useful for environment audits and reproducibility checks.

**Common Gotcha**
Issue: Results differ across machines.
Cause: Different library versions or BLAS backends.
Quick Fix: Capture the full version report before comparing runs.

**Official API**
[sklearn.show_versions](https://scikit-learn.org/stable/api/sklearn.html)

**Related APIs**
`get_config()`
`set_config()`
`config_context()`

***

### Dataset Utilities

**Task**
Load common benchmark datasets from OpenML.

**Mental Trigger**
You want a standardized dataset by name or ID without manual download handling.

**Syntax**

```python
from sklearn.datasets import fetch_openml

data = fetch_openml(name="iris", as_frame=True, parser="auto")
X, y = data.data, data.target
```

**Quick Note**
`as_frame=True` is convenient for tabular workflows. Dataset availability depends on OpenML.

**Common Gotcha**
Issue: Unexpected categorical dtypes or schema changes.
Cause: OpenML datasets may load with frame-based typing.
Quick Fix: Inspect `data.frame` and normalize dtypes before training.

**Official API**
[fetch_openml](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_openml.html)

**Related APIs**
`load_iris()`
`load_digits()`
`make_classification()`
`make_regression()`
`make_blobs()`

**Task**
Generate a synthetic classification dataset.

**Mental Trigger**
You need a quick labeled dataset for model testing, examples, or benchmarks.

**Syntax**

```python
from sklearn.datasets import make_classification

X, y = make_classification(
    n_samples=200,
    n_features=20,
    n_informative=5,
    n_redundant=2,
    random_state=42
)
```

**Quick Note**
Use this for classifier smoke tests and pipeline validation.

**Common Gotcha**
Issue: Hard-to-learn data or class imbalance.
Cause: Unchecked default generation settings.
Quick Fix: Tune informative features, class separation, and class weights explicitly.

**Official API**
[make_classification](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_classification.html)

**Related APIs**
`make_regression()`
`make_blobs()`
`fetch_openml()`

**Task**
Generate a synthetic regression dataset.

**Mental Trigger**
You need a quick continuous target for regression experiments or examples.

**Syntax**

```python
from sklearn.datasets import make_regression

X, y = make_regression(
    n_samples=200,
    n_features=20,
    n_informative=5,
    noise=10.0,
    random_state=42
)
```

**Quick Note**
Good for verifying regression pipelines and metrics end to end.

**Common Gotcha**
Issue: Noisy targets make model comparison unstable.
Cause: High `noise` relative to signal.
Quick Fix: Lower noise or increase informative features.

**Official API**
[make_regression](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_regression.html)

**Related APIs**
`make_classification()`
`make_blobs()`
`fetch_openml()`

**Task**
Generate clustered samples for clustering demos.

**Mental Trigger**
You need a quick unlabeled dataset to test clustering behavior.

**Syntax**

```python
from sklearn.datasets import make_blobs

X, y = make_blobs(
    n_samples=200,
    centers=3,
    n_features=2,
    random_state=42
)
```

**Quick Note**
Useful for clustering, separation plots, and model smoke tests.

**Common Gotcha**
Issue: Clusters are too easy or too hard.
Cause: Poorly chosen separation or cluster count.
Quick Fix: Adjust `centers`, `cluster_std`, and `n_features`.

**Official API**
[make_blobs](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_blobs.html)

**Related APIs**
`make_classification()`
`make_regression()`
`fetch_openml()`

***

### Dataset Splitting

**Task**
Create repeated shuffled splits for validation.

**Mental Trigger**
You want repeated train/test partitions instead of a single split.

**Syntax**

```python
from sklearn.model_selection import ShuffleSplit

cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=42)
```

**Quick Note**
Each split is independent and randomized.

**Common Gotcha**
Issue: Results vary too much across runs.
Cause: Missing `random_state`.
Quick Fix: Set `random_state` for reproducibility.

**Official API**
[ShuffleSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.ShuffleSplit.html)

**Related APIs**
`StratifiedShuffleSplit()`
`RepeatedKFold()`
`RepeatedStratifiedKFold()`
`PredefinedSplit()`

**Task**
Create stratified shuffled splits.

**Mental Trigger**
You need randomized splits while preserving class proportions.

**Syntax**

```python
from sklearn.model_selection import StratifiedShuffleSplit

cv = StratifiedShuffleSplit(n_splits=5, test_size=0.2, random_state=42)
```

**Quick Note**
Use this instead of plain shuffle splitting for classification.

**Common Gotcha**
Issue: Class proportions drift across splits.
Cause: Using non-stratified splitters.
Quick Fix: Switch to `StratifiedShuffleSplit`.

**Official API**
[StratifiedShuffleSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedShuffleSplit.html)

**Related APIs**
`ShuffleSplit()`
`RepeatedStratifiedKFold()`
`PredefinedSplit()`

**Task**
Create repeated K-fold validation splits.

**Mental Trigger**
You want more stable cross-validation estimates than a single K-fold pass.

**Syntax**

```python
from sklearn.model_selection import RepeatedKFold

cv = RepeatedKFold(n_splits=5, n_repeats=3, random_state=42)
```

**Quick Note**
Repeating folds reduces variance in score estimates.

**Common Gotcha**
Issue: Too many model fits.
Cause: Repeats multiply total training cost.
Quick Fix: Reduce repeats or use a cheaper estimator.

**Official API**
[RepeatedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RepeatedKFold.html)

**Related APIs**
`RepeatedStratifiedKFold()`
`KFold()`
`StratifiedKFold()`

**Task**
Create repeated stratified K-fold validation splits.

**Mental Trigger**
You want repeated CV for classification while preserving label balance.

**Syntax**

```python
from sklearn.model_selection import RepeatedStratifiedKFold

cv = RepeatedStratifiedKFold(n_splits=5, n_repeats=3, random_state=42)
```

**Quick Note**
This is a common default for classification model selection.

**Common Gotcha**
Issue: Leakage across repeated folds with grouped data.
Cause: Ignoring sample grouping.
Quick Fix: Use a group-aware splitter instead.

**Official API**
[RepeatedStratifiedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RepeatedStratifiedKFold.html)

**Related APIs**
`RepeatedKFold()`
`StratifiedKFold()`
`GroupKFold()`

**Task**
Use predefined fold assignments.

**Mental Trigger**
You already have a fold index and want scikit-learn to respect it.

**Syntax**

```python
from sklearn.model_selection import PredefinedSplit

test_fold = [-1, -1, 0, 0, 1, 1]
cv = PredefinedSplit(test_fold)
```

**Quick Note**
`-1` marks samples always in training.

**Common Gotcha**
Issue: Invalid fold labels or unexpected split counts.
Cause: Incorrect `test_fold` construction.
Quick Fix: Verify the fold vector before evaluation.

**Official API**
[PredefinedSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.PredefinedSplit.html)

**Related APIs**
`ShuffleSplit()`
`KFold()`
`GroupKFold()`

***

### Cross Validation

**Task**
Compute cross-validated scores.

**Mental Trigger**
You need a quick model score across folds without manual loops.

**Syntax**

```python
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
scores = cross_val_score(LogisticRegression(max_iter=1000), X, y, cv=5)
```

**Quick Note**
Use `scoring=` to override the estimator default score.

**Common Gotcha**
Issue: Data leakage inflates scores.
Cause: Preprocessing outside a pipeline.
Quick Fix: Wrap preprocessing and model in a pipeline.

**Official API**
[cross_val_score](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html)

**Related APIs**
`cross_validate()`
`cross_val_predict()`
`validation_curve()`
`learning_curve()`

**Task**
Get multiple cross-validation outputs in one run.

**Mental Trigger**
You need train and test scores, fit times, or estimator outputs per fold.

**Syntax**

```python
from sklearn.model_selection import cross_validate
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
out = cross_validate(LogisticRegression(max_iter=1000), X, y, cv=5, return_train_score=True)
```

**Quick Note**
`cross_validate()` exposes more diagnostics than `cross_val_score()`.

**Common Gotcha**
Issue: Missing expected keys in the result.
Cause: Not enabling extra return flags.
Quick Fix: Set `return_train_score=True` or `return_estimator=True` when needed.

**Official API**
[cross_validate](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html)

**Related APIs**
`cross_val_score()`
`cross_val_predict()`
`validation_curve()`
`learning_curve()`

**Task**
Generate out-of-fold predictions.

**Mental Trigger**
You want predictions for every sample using only models that did not train on that sample.

**Syntax**

```python
from sklearn.model_selection import cross_val_predict
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
pred = cross_val_predict(LogisticRegression(max_iter=1000), X, y, cv=5)
```

**Quick Note**
Useful for stacking and unbiased prediction analysis.

**Common Gotcha**
Issue: Output looks like normal predictions but is fold-wise.
Cause: Misinterpreting out-of-fold predictions as a final fitted-model output.
Quick Fix: Fit a final model separately for deployment.

**Official API**
[cross_val_predict](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_predict.html)

**Related APIs**
`cross_validate()`
`cross_val_score()`
`validation_curve()`

**Task**
Inspect model performance across one hyperparameter value range.

**Mental Trigger**
You want to see whether a parameter is underfitting or overfitting the model.

**Syntax**

```python
from sklearn.model_selection import validation_curve
from sklearn.svm import SVC
from sklearn.datasets import load_iris
import numpy as np

X, y = load_iris(return_X_y=True)
train_scores, test_scores = validation_curve(
    SVC(),
    X, y,
    param_name="C",
    param_range=np.logspace(-3, 2, 6),
    cv=5
)
```

**Quick Note**
This is useful for parameter sensitivity checks.

**Common Gotcha**
Issue: Curve is noisy or misleading.
Cause: Too few folds or a bad parameter range.
Quick Fix: Use a sensible log-scale range and enough CV splits.

**Official API**
[validation_curve](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.validation_curve.html)

**Related APIs**
`learning_curve()`
`GridSearchCV()`
`RandomizedSearchCV()`

**Task**
Measure performance as training set size increases.

**Mental Trigger**
You want to diagnose whether more data will likely help.

**Syntax**

```python
from sklearn.model_selection import learning_curve
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
sizes, train_scores, test_scores = learning_curve(
    LogisticRegression(max_iter=1000),
    X, y,
    cv=5
)
```

**Quick Note**
Useful for spotting high bias versus high variance behavior.

**Common Gotcha**
Issue: Runtime is high on large datasets.
Cause: Repeating many fits across many sample sizes.
Quick Fix: Use fewer points in `train_sizes`.

**Official API**
[learning_curve](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.learning_curve.html)

**Related APIs**
`validation_curve()`
`cross_validate()`
`cross_val_score()`

***

### Preprocessing

**Task**
Scale features robustly against outliers.

**Mental Trigger**
Your numeric features contain outliers and standard scaling is too sensitive.

**Syntax**

```python
from sklearn.preprocessing import RobustScaler
import numpy as np

X = np.array([[1.0], [2.0], [100.0]])
X_scaled = RobustScaler().fit_transform(X)
```

**Quick Note**
Uses median and IQR, so it is less sensitive to extreme values.

**Common Gotcha**
Issue: Features are still on different scales.
Cause: Using the wrong scaler for the data distribution.
Quick Fix: Try `RobustScaler` instead of `StandardScaler`.

**Official API**
[RobustScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html)

**Related APIs**
`StandardScaler()`
`MinMaxScaler()`
`MaxAbsScaler()`

**Task**
Scale features into a fixed range.

**Mental Trigger**
You need bounded feature values for some models or downstream logic.

**Syntax**

```python
from sklearn.preprocessing import MinMaxScaler
import numpy as np

X = np.array([[1.0], [2.0], [3.0]])
X_scaled = MinMaxScaler().fit_transform(X)
```

**Quick Note**
Outputs values within the default $[0, 1]$ range.

**Common Gotcha**
Issue: Out-of-range values appear at inference.
Cause: New data exceeds the training range.
Quick Fix: Validate inputs or clip explicitly.

**Official API**
[MinMaxScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html)

**Related APIs**
`StandardScaler()`
`RobustScaler()`
`MaxAbsScaler()`

**Task**
Scale sparse or signed data without centering.

**Mental Trigger**
You have sparse input and need scale-preserving normalization.

**Syntax**

```python
from sklearn.preprocessing import MaxAbsScaler
import numpy as np

X = np.array([[1.0, 0.0], [0.0, -2.0], [3.0, 0.0]])
X_scaled = MaxAbsScaler().fit_transform(X)
```

**Quick Note**
This preserves sparsity better than centering-based scalers.

**Common Gotcha**
Issue: Sparse matrix becomes dense.
Cause: Using a scaler that centers data.
Quick Fix: Use `MaxAbsScaler`.

**Official API**
[MaxAbsScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html)

**Related APIs**
`StandardScaler()`
`RobustScaler()`
`Normalizer()`

**Task**
Normalize samples to unit norm.

**Mental Trigger**
You want each row scaled independently, often for text or cosine-similarity workflows.

**Syntax**

```python
from sklearn.preprocessing import Normalizer
import numpy as np

X = np.array([[3.0, 4.0], [1.0, 2.0]])
X_norm = Normalizer().fit_transform(X)
```

**Quick Note**
`Normalizer` scales rows, not columns.

**Common Gotcha**
Issue: Expected feature standardization but got row-wise scaling.
Cause: Confusing `Normalizer` with `StandardScaler`.
Quick Fix: Use the right transformer for your axis.

**Official API**
[Normalizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html)

**Related APIs**
`StandardScaler()`
`MinMaxScaler()`
`MaxAbsScaler()`

**Task**
Discretize continuous features into bins.

**Mental Trigger**
You want bucketed numeric features for rules, histograms, or tree-friendly preprocessing.

**Syntax**

```python
from sklearn.preprocessing import KBinsDiscretizer
import numpy as np

X = np.array([[1.0], [2.0], [10.0], [20.0]])
kb = KBinsDiscretizer(n_bins=3, encode="ordinal", strategy="quantile")
X_binned = kb.fit_transform(X)
```

**Quick Note**
`encode="ordinal"` gives compact numeric bin IDs.

**Common Gotcha**
Issue: Sparse output or unexpected encoding.
Cause: Default encoding choice.
Quick Fix: Pick `ordinal` or `onehot` explicitly.

**Official API**
[KBinsDiscretizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.KBinsDiscretizer.html)

**Related APIs**
`Binarizer()`
`QuantileTransformer()`
`PolynomialFeatures()`

**Task**
Apply a custom function to features.

**Mental Trigger**
You need a simple lambda-style transform without writing a full estimator.

**Syntax**

```python
from sklearn.preprocessing import FunctionTransformer
import numpy as np

X = np.array([[1.0], [2.0], [3.0]])
ft = FunctionTransformer(np.log1p)
X_t = ft.fit_transform(X)
```

**Quick Note**
Useful for lightweight, reusable custom transforms.

**Common Gotcha**
Issue: Inverse transform is unavailable or incorrect.
Cause: Non-invertible custom function.
Quick Fix: Use a reversible function if you need inversion.

**Official API**
[FunctionTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.FunctionTransformer.html)

**Related APIs**
`PowerTransformer()`
`QuantileTransformer()`
`Binarizer()`

**Task**
Convert numeric features to binary indicators.

**Mental Trigger**
You need threshold-based feature binarization.

**Syntax**

```python
from sklearn.preprocessing import Binarizer
import numpy as np

X = np.array([[0.2], [0.7], [1.5]])
X_bin = Binarizer(threshold=0.5).fit_transform(X)
```

**Quick Note**
Useful for turning continuous inputs into rule-like flags.

**Common Gotcha**
Issue: Too many zeros or ones.
Cause: Poor threshold choice.
Quick Fix: Tune `threshold` to the feature scale.

**Official API**
[Binarizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Binarizer.html)

**Related APIs**
`KBinsDiscretizer()`
`FunctionTransformer()`
`LabelBinarizer()`

**Task**
Expand features with spline basis functions.

**Mental Trigger**
You want smooth nonlinear feature engineering for a numeric variable.

**Syntax**

```python
from sklearn.preprocessing import SplineTransformer
import numpy as np

X = np.array([[0.0], [0.5], [1.0], [1.5]])
st = SplineTransformer(n_knots=4, degree=3)
X_spline = st.fit_transform(X)
```

**Quick Note**
Useful for smooth nonlinear regression features.

**Common Gotcha**
Issue: Too many generated columns.
Cause: High knot count or degree.
Quick Fix: Keep the basis compact.

**Official API**
[SplineTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.SplineTransformer.html)

**Related APIs**
`PolynomialFeatures()`
`FunctionTransformer()`
`PowerTransformer()`

**Task**
Encode targets or categories as one-vs-rest indicators.

**Mental Trigger**
You need binary indicator columns for a target or multiclass label set.

**Syntax**

```python
from sklearn.preprocessing import LabelBinarizer

y = ["cat", "dog", "cat"]
lb = LabelBinarizer()
Y = lb.fit_transform(y)
```

**Quick Note**
This is commonly used for target preprocessing.

**Common Gotcha**
Issue: Binary and multiclass outputs differ in shape.
Cause: `LabelBinarizer` adapts output format to target type.
Quick Fix: Check output dimensionality before downstream use.

**Official API**
[LabelBinarizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelBinarizer.html)

**Related APIs**
`LabelEncoder()`
`MultiLabelBinarizer()`
`OneHotEncoder()`

**Task**
Encode multilabel targets into binary indicator arrays.

**Mental Trigger**
You have samples with multiple labels per row.

**Syntax**

```python
from sklearn.preprocessing import MultiLabelBinarizer

y = [("red", "round"), ("blue",), ("red", "round")]
mlb = MultiLabelBinarizer()
Y = mlb.fit_transform(y)
```

**Quick Note**
Useful for multilabel classification and recommendation targets.

**Common Gotcha**
Issue: Missing expected classes.
Cause: Class set inferred only from training input.
Quick Fix: Inspect `classes_` after fitting.

**Official API**
[MultiLabelBinarizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MultiLabelBinarizer.html)

**Related APIs**
`LabelBinarizer()`
`OneHotEncoder()`
`LabelEncoder()`

**Task**
Encode categories by ordinal order.

**Mental Trigger**
You need integer-coded categories for ordered or tree-based models.

**Syntax**

```python
from sklearn.preprocessing import OrdinalEncoder
import numpy as np

X = np.array([["low"], ["medium"], ["high"]])
enc = OrdinalEncoder()
X_ord = enc.fit_transform(X)
```

**Quick Note**
Set category order explicitly when ordinal meaning matters.

**Common Gotcha**
Issue: Wrong implied ordering.
Cause: Default category sorting may not match business order.
Quick Fix: Pass `categories=` explicitly.

**Official API**
[OrdinalEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html)

**Related APIs**
`OneHotEncoder()`
`LabelEncoder()`
`MultiLabelBinarizer()`

**Task**
Encode a 1D target label vector.

**Mental Trigger**
You need integer class labels for a model or metric.

**Syntax**

```python
from sklearn.preprocessing import LabelEncoder

y = ["spam", "ham", "spam"]
le = LabelEncoder()
y_enc = le.fit_transform(y)
```

**Quick Note**
Use for target labels, not feature columns.

**Common Gotcha**
Issue: Applying it to feature columns creates arbitrary ordinal meaning.
Cause: `LabelEncoder` is for targets, not general feature encoding.
Quick Fix: Use `OneHotEncoder` or `OrdinalEncoder` for features.

**Official API**
[LabelEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)

**Related APIs**
`OrdinalEncoder()`
`LabelBinarizer()`
`OneHotEncoder()`

**Task**
Quantile-transform features into a normal or uniform distribution.

**Mental Trigger**
You want to reduce skew or make features more Gaussian-like.

**Syntax**

```python
from sklearn.preprocessing import QuantileTransformer
import numpy as np

X = np.array([[1.0], [2.0], [10.0], [20.0]])
qt = QuantileTransformer(output_distribution="normal", random_state=42)
X_q = qt.fit_transform(X)
```

**Quick Note**
Works well when outliers or long tails distort scaling.

**Common Gotcha**
Issue: Output looks heavily compressed.
Cause: Too few quantiles or small sample size.
Quick Fix: Increase `n_quantiles` when appropriate.

**Official API**
[QuantileTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.QuantileTransformer.html)

**Related APIs**
`PowerTransformer()`
`RobustScaler()`
`StandardScaler()`

***

### Missing Imputers

**Task**
Impute missing values with nearest neighbors.

**Mental Trigger**
You want a data-aware imputer that leverages similar rows.

**Syntax**

```python
from sklearn.impute import KNNImputer
import numpy as np

X = np.array([[1.0, np.nan], [2.0, 3.0], [np.nan, 6.0]])
X_imp = KNNImputer(n_neighbors=2).fit_transform(X)
```

**Quick Note**
Works best when similar rows are meaningful and features are scaled.

**Common Gotcha**
Issue: Poor imputations on unscaled data.
Cause: Distance-based method is sensitive to feature scale.
Quick Fix: Scale numeric features before `KNNImputer`.

**Official API**
[KNNImputer](https://scikit-learn.org/stable/modules/generated/sklearn.impute.KNNImputer.html)

**Related APIs**
`SimpleImputer()`
`IterativeImputer()`
`MissingIndicator()`

**Task**
Mark which values were missing.

**Mental Trigger**
You want a separate missingness signal for modeling or auditing.

**Syntax**

```python
from sklearn.impute import MissingIndicator
import numpy as np

X = np.array([[1.0, np.nan], [np.nan, 3.0]])
mi = MissingIndicator()
mask = mi.fit_transform(X)
```

**Quick Note**
Useful when missingness itself carries signal.

**Common Gotcha**
Issue: Indicator shape differs from the input shape.
Cause: Indicator returns only missing-feature columns by default.
Quick Fix: Inspect the mask layout before stacking.

**Official API**
[MissingIndicator](https://scikit-learn.org/stable/modules/generated/sklearn.impute.MissingIndicator.html)

**Related APIs**
`SimpleImputer()`
`KNNImputer()`
`IterativeImputer()`

**Task**
Use iterative multivariate imputation.

**Mental Trigger**
You want model-based imputation instead of simple summary statistics.

**Syntax**

```python
from sklearn.experimental import enable_iterative_imputer  # noqa: F401
from sklearn.impute import IterativeImputer
import numpy as np

X = np.array([[1.0, np.nan], [2.0, 3.0], [np.nan, 6.0]])
X_imp = IterativeImputer(random_state=42).fit_transform(X)
```

**Quick Note**
Still marked experimental in import style, so check version behavior carefully.

**Common Gotcha**
Issue: Import error or unstable behavior.
Cause: Experimental API requirements.
Quick Fix: Enable the experimental import first and verify version support.

**Official API**
[IterativeImputer](https://scikit-learn.org/stable/modules/generated/sklearn.impute.IterativeImputer.html)

**Related APIs**
`SimpleImputer()`
`KNNImputer()`
`MissingIndicator()`

***

### Feature Selection

**Task**
Recursively eliminate weak features.

**Mental Trigger**
You want wrapper-based feature selection around an estimator.

**Syntax**

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
rfe = RFE(LogisticRegression(max_iter=1000), n_features_to_select=2)
X_sel = rfe.fit_transform(X, y)
```

**Quick Note**
This retrains the estimator multiple times.

**Common Gotcha**
Issue: Slow feature selection.
Cause: Repeated estimator fits.
Quick Fix: Use a simpler estimator or fewer target features.

**Official API**
[RFE](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.RFE.html)

**Related APIs**
`RFECV()`
`SelectFromModel()`
`SelectKBest()`

**Task**
Choose the best feature count with cross-validation.

**Mental Trigger**
You want recursive feature elimination with automatic CV-based tuning.

**Syntax**

```python
from sklearn.feature_selection import RFECV
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
sel = RFECV(LogisticRegression(max_iter=1000), cv=5)
X_sel = sel.fit_transform(X, y)
```

**Quick Note**
This is more expensive than plain RFE but more automatic.

**Common Gotcha**
Issue: Very slow runtime.
Cause: Nested fits across feature subsets and folds.
Quick Fix: Reduce CV folds or start with fewer features.

**Official API**
[RFECV](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.RFECV.html)

**Related APIs**
`RFE()`
`SequentialFeatureSelector()`
`SelectFromModel()`

**Task**
Select features with forward or backward search.

**Mental Trigger**
You want greedy wrapper feature selection using a scoring estimator.

**Syntax**

```python
from sklearn.feature_selection import SequentialFeatureSelector
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
sfs = SequentialFeatureSelector(LogisticRegression(max_iter=1000), n_features_to_select=2)
X_sel = sfs.fit_transform(X, y)
```

**Quick Note**
Good when you want a direct feature subset, not just rankings.

**Common Gotcha**
Issue: Runtime becomes expensive on wide data.
Cause: Repeated forward/backward evaluation.
Quick Fix: Use it after a coarse filter step.

**Official API**
[SequentialFeatureSelector](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SequentialFeatureSelector.html)

**Related APIs**
`RFE()`
`RFECV()`
`SelectFromModel()`

**Task**
Select features by percentile.

**Mental Trigger**
You want a fast univariate selection rule based on a percentage cutoff.

**Syntax**

```python
from sklearn.feature_selection import SelectPercentile, f_classif
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
sel = SelectPercentile(score_func=f_classif, percentile=25)
X_sel = sel.fit_transform(X, y)
```

**Quick Note**
Useful when you know the rough fraction of features to keep.

**Common Gotcha**
Issue: Too many or too few features remain.
Cause: Percentile chosen without checking score distribution.
Quick Fix: Inspect feature scores first.

**Official API**
[SelectPercentile](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectPercentile.html)

**Related APIs**
`SelectKBest()`
`GenericUnivariateSelect()`
`mutual_info_classif()`

**Task**
Use a configurable univariate selector.

**Mental Trigger**
You want a single selector that can behave like multiple univariate selection strategies.

**Syntax**

```python
from sklearn.feature_selection import GenericUnivariateSelect, f_classif
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
sel = GenericUnivariateSelect(score_func=f_classif, mode="percentile", param=25)
X_sel = sel.fit_transform(X, y)
```

**Quick Note**
This is useful for search-based tuning of selection strategy.

**Common Gotcha**
Issue: Wrong selector mode for the intended cutoff.
Cause: Misconfigured `mode` or `param`.
Quick Fix: Match mode to the selection rule you want.

**Official API**
[GenericUnivariateSelect](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.GenericUnivariateSelect.html)

**Related APIs**
`SelectKBest()`
`SelectPercentile()`
`mutual_info_regression()`

**Task**
Score classification features by mutual information.

**Mental Trigger**
You need a nonparametric feature relevance score for classification.

**Syntax**

```python
from sklearn.feature_selection import mutual_info_classif
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
scores = mutual_info_classif(X, y, random_state=42)
```

**Quick Note**
Useful for nonlinear relationships.

**Common Gotcha**
Issue: Scores vary slightly between runs.
Cause: Stochastic estimation.
Quick Fix: Set `random_state`.

**Official API**
[mutual_info_classif](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.mutual_info_classif.html)

**Related APIs**
`SelectKBest()`
`GenericUnivariateSelect()`
`mutual_info_regression()`

**Task**
Score regression features by mutual information.

**Mental Trigger**
You need a nonparametric feature relevance score for continuous targets.

**Syntax**

```python
from sklearn.feature_selection import mutual_info_regression
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
scores = mutual_info_regression(X, y, random_state=42)
```

**Quick Note**
Useful for nonlinear regression feature screening.

**Common Gotcha**
Issue: Results vary across runs.
Cause: Randomized estimation.
Quick Fix: Set `random_state`.

**Official API**
[mutual_info_regression](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.mutual_info_regression.html)

**Related APIs**
`SelectKBest()`
`GenericUnivariateSelect()`
`mutual_info_classif()`

***

### Dimensionality Reduction

**Task**
Update PCA incrementally on batches.

**Mental Trigger**
Your dataset is too large for a full in-memory PCA fit.

**Syntax**

```python
from sklearn.decomposition import IncrementalPCA
import numpy as np

X1 = np.random.RandomState(42).randn(50, 10)
X2 = np.random.RandomState(43).randn(50, 10)

ipca = IncrementalPCA(n_components=3)
ipca.partial_fit(X1)
ipca.partial_fit(X2)
X_red = ipca.transform(X2)
```

**Quick Note**
Useful for large datasets or streaming workflows.

**Common Gotcha**
Issue: Results differ from full PCA.
Cause: Incremental approximation and batch effects.
Quick Fix: Use consistent batch sizes and accept approximation.

**Official API**
[IncrementalPCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.IncrementalPCA.html)

**Related APIs**
`PCA()`
`TruncatedSVD()`
`NMF()`

**Task**
Apply kernel PCA for nonlinear embedding.

**Mental Trigger**
You want nonlinear dimensionality reduction with a kernelized approach.

**Syntax**

```python
from sklearn.decomposition import KernelPCA
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
kpca = KernelPCA(n_components=2, kernel="rbf", gamma=0.1)
X_red = kpca.fit_transform(X)
```

**Quick Note**
Useful when linear PCA is too restrictive.

**Common Gotcha**
Issue: Runtime or memory grows quickly.
Cause: Kernel methods scale poorly with sample count.
Quick Fix: Use on smaller datasets or approximate alternatives.

**Official API**
[KernelPCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.KernelPCA.html)

**Related APIs**
`PCA()`
`TruncatedSVD()`
`FastICA()`

**Task**
Factorize nonnegative data into additive components.

**Mental Trigger**
You need sparse, parts-based decomposition on nonnegative inputs.

**Syntax**

```python
from sklearn.decomposition import NMF
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
X_pos = X - X.min()
nmf = NMF(n_components=2, random_state=42, max_iter=500)
W = nmf.fit_transform(X_pos)
```

**Quick Note**
Input must be nonnegative.

**Common Gotcha**
Issue: Model fails on negative values.
Cause: NMF requires nonnegative data.
Quick Fix: Shift or transform data to nonnegative space.

**Official API**
[NMF](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.NMF.html)

**Related APIs**
`PCA()`
`TruncatedSVD()`
`FastICA()`

**Task**
Extract statistically independent components.

**Mental Trigger**
You want source separation or independent latent signals.

**Syntax**

```python
from sklearn.decomposition import FastICA
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
ica = FastICA(n_components=2, random_state=42)
X_ica = ica.fit_transform(X)
```

**Quick Note**
Often used for signal-like feature separation.

**Common Gotcha**
Issue: Convergence warnings or unstable output.
Cause: Poorly scaled or noisy input.
Quick Fix: Scale data first and tune iterations.

**Official API**
[FastICA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.FastICA.html)

**Related APIs**
`PCA()`
`KernelPCA()`
`NMF()`

***

### Pipeline

**Task**
Create a reusable pipeline constructor.

**Mental Trigger**
You want a concise way to chain steps without naming them all manually.

**Syntax**

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
pipe.fit(X, y)
```

**Quick Note**
Step names are auto-generated from class names.

**Common Gotcha**
Issue: Parameter names are harder to address.
Cause: Auto-generated step names.
Quick Fix: Use `Pipeline` when you need explicit step names.

**Official API**
[make_pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html)

**Related APIs**
`Pipeline()`
`make_column_transformer()`
`FeatureUnion()`

**Task**
Build a column-wise transformer with automatic naming.

**Mental Trigger**
You want quick per-column preprocessing without manually naming each transformer.

**Syntax**

```python
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import pandas as pd

df = pd.DataFrame({"age": [20, 30], "city": ["tokyo", "osaka"]})
ct = make_column_transformer(
    (StandardScaler(), ["age"]),
    (OneHotEncoder(handle_unknown="ignore"), ["city"])
)
X_out = ct.fit_transform(df)
```

**Quick Note**
Useful for compact tabular preprocessing setups.

**Common Gotcha**
Issue: Hard to tune nested parameters later.
Cause: Auto-generated transformer names.
Quick Fix: Use `ColumnTransformer` for explicit names.

**Official API**
[make_column_transformer](https://scikit-learn.org/stable/modules/generated/sklearn.compose.make_column_transformer.html)

**Related APIs**
`ColumnTransformer()`
`make_pipeline()`
`Pipeline()`

**Task**
Combine feature sets from multiple transformers.

**Mental Trigger**
You need to concatenate outputs from separate feature branches.

**Syntax**

```python
from sklearn.pipeline import FeatureUnion
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
fu = FeatureUnion([("pca", PCA(n_components=2)), ("scale", StandardScaler())])
X_out = fu.fit_transform(X, y)
```

**Quick Note**
Useful when parallel feature branches are needed.

**Common Gotcha**
Issue: Output shape is unexpected.
Cause: Branches are concatenated, not selected.
Quick Fix: Check each transformer’s output dimensions.

**Official API**
[FeatureUnion](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.FeatureUnion.html)

**Related APIs**
`Pipeline()`
`ColumnTransformer()`
`make_pipeline()`

**Task**
Cache pipeline steps to speed repeated fits.

**Mental Trigger**
You repeatedly refit the same expensive preprocessing pipeline.

**Syntax**

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from joblib import Memory
import tempfile

mem = Memory(location=tempfile.mkdtemp(), verbose=0)
pipe = Pipeline(
    [("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=1000))],
    memory=mem
)
```

**Quick Note**
Caching helps when upstream steps are expensive and repeated.

**Common Gotcha**
Issue: Cached results do not refresh as expected.
Cause: Reusing stale cache entries.
Quick Fix: Clear the cache when inputs or code change.

**Official API**
[Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)

**Related APIs**
`FeatureUnion()`
`make_pipeline()`
`joblib.Memory`

**Task**
Control output container formats.

**Mental Trigger**
You want pandas or polars outputs from transformers where supported.

**Syntax**

```python
from sklearn import set_config
from sklearn.preprocessing import StandardScaler
import pandas as pd

df = pd.DataFrame({"x": [1.0, 2.0], "y": [3.0, 4.0]})
set_config(transform_output="pandas")
out = StandardScaler().fit_transform(df)
```

**Quick Note**
Useful when you want labeled columns after transformation.

**Common Gotcha**
Issue: Downstream code expects arrays instead of DataFrames.
Cause: Global output config changed.
Quick Fix: Reset config or convert explicitly.

**Official API**
[set_config](https://scikit-learn.org/stable/api/sklearn.html)

**Related APIs**
`Pipeline()`
`ColumnTransformer()`
`make_pipeline()`

***

### Classification Models

**Task**
Train a decision tree classifier.

**Mental Trigger**
You want a simple, interpretable tree-based classifier.

**Syntax**

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = DecisionTreeClassifier(random_state=42)
clf.fit(X, y)
```

**Quick Note**
Trees need little preprocessing but can overfit easily.

**Common Gotcha**
Issue: Overfitting on training data.
Cause: Unrestricted tree growth.
Quick Fix: Limit depth or leaf size.

**Official API**
[DecisionTreeClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html)

**Related APIs**
`RandomForestClassifier()`
`ExtraTreesClassifier()`
`HistGradientBoostingClassifier()`

**Task**
Train an extra-trees classifier.

**Mental Trigger**
You want a strong randomized tree ensemble for tabular classification.

**Syntax**

```python
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = ExtraTreesClassifier(random_state=42)
clf.fit(X, y)
```

**Quick Note**
Often competitive with random forests on tabular data.

**Common Gotcha**
Issue: Too many trees slow training.
Cause: Large ensemble size.
Quick Fix: Tune `n_estimators` and parallelism.

**Official API**
[ExtraTreesClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html)

**Related APIs**
`RandomForestClassifier()`
`DecisionTreeClassifier()`
`GradientBoostingClassifier()`

**Task**
Train a gradient boosting classifier.

**Mental Trigger**
You want boosting-based tabular classification with strong performance.

**Syntax**

```python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = GradientBoostingClassifier(random_state=42)
clf.fit(X, y)
```

**Quick Note**
Works well on many structured datasets.

**Common Gotcha**
Issue: Training is slower than expected.
Cause: Sequential boosting.
Quick Fix: Reduce tree depth or number of estimators.

**Official API**
[GradientBoostingClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html)

**Related APIs**
`HistGradientBoostingClassifier()`
`AdaBoostClassifier()`
`RandomForestClassifier()`

**Task**
Train an AdaBoost classifier.

**Mental Trigger**
You want a classic boosting ensemble with simple base learners.

**Syntax**

```python
from sklearn.ensemble import AdaBoostClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = AdaBoostClassifier(random_state=42)
clf.fit(X, y)
```

**Quick Note**
Often used as a lightweight ensemble baseline.

**Common Gotcha**
Issue: Weak performance on noisy data.
Cause: Sensitivity to label noise and weak learners.
Quick Fix: Compare against stronger tree ensembles.

**Official API**
[AdaBoostClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostClassifier.html)

**Related APIs**
`GradientBoostingClassifier()`
`RandomForestClassifier()`
`DummyClassifier()`

**Task**
Train a Gaussian Naive Bayes classifier.

**Mental Trigger**
You need a fast probabilistic classifier with minimal setup.

**Syntax**

```python
from sklearn.naive_bayes import GaussianNB
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = GaussianNB()
clf.fit(X, y)
```

**Quick Note**
Very fast and simple for numeric features.

**Common Gotcha**
Issue: Poor accuracy on correlated features.
Cause: Strong independence assumptions.
Quick Fix: Compare with a tree or linear model.

**Official API**
[GaussianNB](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html)

**Related APIs**
`MultinomialNB()`
`SGDClassifier()`
`DummyClassifier()`

**Task**
Train a multinomial Naive Bayes classifier.

**Mental Trigger**
You need a Naive Bayes model for counts or sparse text features.

**Syntax**

```python
from sklearn.naive_bayes import MultinomialNB
import numpy as np

X = np.array([[2, 1, 0], [0, 1, 3], [1, 0, 1]])
y = np.array([0, 1, 0])
clf = MultinomialNB()
clf.fit(X, y)
```

**Quick Note**
Best suited to nonnegative count-like features.

**Common Gotcha**
Issue: Negative inputs cause issues.
Cause: Multinomial NB expects nonnegative counts/features.
Quick Fix: Use count-like features or another classifier.

**Official API**
[MultinomialNB](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html)

**Related APIs**
`GaussianNB()`
`SGDClassifier()`
`LabelBinarizer()`

**Task**
Train a stochastic gradient descent classifier.

**Mental Trigger**
You want a linear classifier that scales to large or sparse datasets.

**Syntax**

```python
from sklearn.linear_model import SGDClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = SGDClassifier(random_state=42)
clf.fit(X, y)
```

**Quick Note**
Common for large-scale linear classification.

**Common Gotcha**
Issue: Unstable convergence.
Cause: Unscaled features or poor learning settings.
Quick Fix: Scale data and tune the loss/penalty.

**Official API**
[SGDClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDClassifier.html)

**Related APIs**
`PassiveAggressiveClassifier()`
`Perceptron()`
`SGDRegressor()`

**Task**
Train a passive-aggressive classifier.

**Mental Trigger**
You need an online linear classifier for fast updates.

**Syntax**

```python
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = PassiveAggressiveClassifier(random_state=42)
clf.fit(X, y)
```

**Quick Note**
Useful for streaming or large sparse settings.

**Common Gotcha**
Issue: Model updates are too aggressive.
Cause: Hyperparameters not tuned for the data scale.
Quick Fix: Tune `C` and loss settings.

**Official API**
[PassiveAggressiveClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.PassiveAggressiveClassifier.html)

**Related APIs**
`SGDClassifier()`
`Perceptron()`
`SGDRegressor()`

**Task**
Train a perceptron classifier.

**Mental Trigger**
You want a minimal online linear classifier baseline.

**Syntax**

```python
from sklearn.linear_model import Perceptron
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = Perceptron(random_state=42)
clf.fit(X, y)
```

**Quick Note**
Simple and fast for linearly separable data.

**Common Gotcha**
Issue: Low accuracy on non-separable data.
Cause: Perceptron is a simple linear classifier.
Quick Fix: Try a stronger linear or tree-based model.

**Official API**
[Perceptron](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Perceptron.html)

**Related APIs**
`SGDClassifier()`
`PassiveAggressiveClassifier()`
`DummyClassifier()`

**Task**
Use a dummy classification baseline.

**Mental Trigger**
You need a baseline to compare real classifiers against.

**Syntax**

```python
from sklearn.dummy import DummyClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
clf = DummyClassifier(strategy="most_frequent")
clf.fit(X, y)
```

**Quick Note**
Good for sanity checks and baseline metrics.

**Common Gotcha**
Issue: Baseline is accidentally too strong or too weak.
Cause: Wrong strategy for the task.
Quick Fix: Choose a baseline that matches your evaluation goal.

**Official API**
[DummyClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html)

**Related APIs**
`DummyRegressor()`
`LogisticRegression()`
`DecisionTreeClassifier()`

***

### Regression Models

**Task**
Train a linear regression model.

**Mental Trigger**
You need a baseline linear model for continuous prediction.

**Syntax**

```python
from sklearn.linear_model import LinearRegression
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = LinearRegression()
reg.fit(X, y)
```

**Quick Note**
Fast baseline for dense tabular regression.

**Common Gotcha**
Issue: Multicollinearity makes coefficients unstable.
Cause: Correlated features.
Quick Fix: Try regularized regression.

**Official API**
[LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)

**Related APIs**
`Ridge()`
`Lasso()`
`ElasticNet()`

**Task**
Train ridge regression.

**Mental Trigger**
You want linear regression with L2 regularization.

**Syntax**

```python
from sklearn.linear_model import Ridge
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = Ridge(alpha=1.0)
reg.fit(X, y)
```

**Quick Note**
Common default for regularized linear regression.

**Common Gotcha**
Issue: Underfitting from over-regularization.
Cause: `alpha` too large.
Quick Fix: Tune `alpha` with validation.

**Official API**
[Ridge](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)

**Related APIs**
`RidgeCV()`
`Lasso()`
`ElasticNet()`

**Task**
Tune ridge regression with cross-validation.

**Mental Trigger**
You want an automatic search over ridge regularization strength.

**Syntax**

```python
from sklearn.linear_model import RidgeCV
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = RidgeCV(alphas=[0.1, 1.0, 10.0])
reg.fit(X, y)
```

**Quick Note**
Useful when you want a compact regularization search.

**Common Gotcha**
Issue: Chosen alpha is not ideal for your metric.
Cause: Default CV objective mismatch.
Quick Fix: Validate against your production metric.

**Official API**
[RidgeCV](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.RidgeCV.html)

**Related APIs**
`Ridge()`
`LassoCV()`
`ElasticNetCV()`

**Task**
Train lasso regression.

**Mental Trigger**
You want linear regression with L1 sparsity.

**Syntax**

```python
from sklearn.linear_model import Lasso
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = Lasso(alpha=0.1, max_iter=10000)
reg.fit(X, y)
```

**Quick Note**
Often used for sparse coefficient selection.

**Common Gotcha**
Issue: Nonconvergence warnings.
Cause: Too few iterations or unscaled data.
Quick Fix: Scale features and increase `max_iter`.

**Official API**
[Lasso](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html)

**Related APIs**
`LassoCV()`
`Ridge()`
`ElasticNet()`

**Task**
Tune lasso with cross-validation.

**Mental Trigger**
You want automatic selection of L1 regularization strength.

**Syntax**

```python
from sklearn.linear_model import LassoCV
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = LassoCV(cv=5, random_state=42)
reg.fit(X, y)
```

**Quick Note**
Good for sparse linear baselines with tuned regularization.

**Common Gotcha**
Issue: Slow training on wide data.
Cause: CV over many alpha values.
Quick Fix: Reduce alpha grid or features.

**Official API**
[LassoCV](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LassoCV.html)

**Related APIs**
`Lasso()`
`RidgeCV()`
`ElasticNetCV()`

**Task**
Train elastic net regression.

**Mental Trigger**
You want a mix of L1 and L2 regularization.

**Syntax**

```python
from sklearn.linear_model import ElasticNet
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = ElasticNet(alpha=0.1, l1_ratio=0.5, max_iter=10000)
reg.fit(X, y)
```

**Quick Note**
Useful when pure ridge or lasso is too restrictive.

**Common Gotcha**
Issue: Hard-to-tune regularization balance.
Cause: Unset or poorly chosen `l1_ratio`.
Quick Fix: Tune `alpha` and `l1_ratio` jointly.

**Official API**
[ElasticNet](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html)

**Related APIs**
`ElasticNetCV()`
`Lasso()`
`Ridge()`

**Task**
Tune elastic net with cross-validation.

**Mental Trigger**
You want automatic search over both ridge-like and lasso-like strength.

**Syntax**

```python
from sklearn.linear_model import ElasticNetCV
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = ElasticNetCV(cv=5, random_state=42)
reg.fit(X, y)
```

**Quick Note**
Common default for regularized linear regression search.

**Common Gotcha**
Issue: Slow fit on large feature spaces.
Cause: CV over multiple alpha and l1 values.
Quick Fix: Reduce the search grid or preprocess features first.

**Official API**
[ElasticNetCV](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNetCV.html)

**Related APIs**
`ElasticNet()`
`LassoCV()`
`RidgeCV()`

**Task**
Train an SGD regressor.

**Mental Trigger**
You want a scalable linear regressor for large or sparse data.

**Syntax**

```python
from sklearn.linear_model import SGDRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = SGDRegressor(random_state=42)
reg.fit(X, y)
```

**Quick Note**
Useful for large-scale or online regression.

**Common Gotcha**
Issue: Diverging or poor fit.
Cause: Unscaled features or unsuitable learning settings.
Quick Fix: Scale features and tune loss/penalty.

**Official API**
[SGDRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDRegressor.html)

**Related APIs**
`SGDClassifier()`
`PassiveAggressiveClassifier()`
`LinearRegression()`

**Task**
Train a random forest regressor.

**Mental Trigger**
You want a strong nonparametric regressor for tabular data.

**Syntax**

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = RandomForestRegressor(random_state=42)
reg.fit(X, y)
```

**Quick Note**
Handles nonlinear relationships with minimal preprocessing.

**Common Gotcha**
Issue: Slow inference or large model size.
Cause: Too many deep trees.
Quick Fix: Reduce tree count or depth.

**Official API**
[RandomForestRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html)

**Related APIs**
`ExtraTreesRegressor()`
`GradientBoostingRegressor()`
`HistGradientBoostingRegressor()`

**Task**
Train an extra-trees regressor.

**Mental Trigger**
You want a randomized tree ensemble for regression.

**Syntax**

```python
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = ExtraTreesRegressor(random_state=42)
reg.fit(X, y)
```

**Quick Note**
Often competitive and fast on tabular regression.

**Common Gotcha**
Issue: Overfitting on small datasets.
Cause: Very flexible trees and high variance.
Quick Fix: Tune depth and leaf constraints.

**Official API**
[ExtraTreesRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesRegressor.html)

**Related APIs**
`RandomForestRegressor()`
`GradientBoostingRegressor()`
`HistGradientBoostingRegressor()`

**Task**
Train a gradient boosting regressor.

**Mental Trigger**
You want boosting-based regression for structured data.

**Syntax**

```python
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = GradientBoostingRegressor(random_state=42)
reg.fit(X, y)
```

**Quick Note**
Strong baseline for many tabular regression tasks.

**Common Gotcha**
Issue: Training is slower than expected.
Cause: Sequential boosting.
Quick Fix: Reduce tree complexity or number of estimators.

**Official API**
[GradientBoostingRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingRegressor.html)

**Related APIs**
`HistGradientBoostingRegressor()`
`RandomForestRegressor()`
`ExtraTreesRegressor()`

**Task**
Train a histogram gradient boosting regressor.

**Mental Trigger**
You want a fast boosting regressor for larger tabular datasets.

**Syntax**

```python
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = HistGradientBoostingRegressor(random_state=42)
reg.fit(X, y)
```

**Quick Note**
Often faster than classic gradient boosting on larger data.

**Common Gotcha**
Issue: Unexpected behavior with categorical handling or missing values.
Cause: Unconfigured input types.
Quick Fix: Verify feature preprocessing and model settings.

**Official API**
[HistGradientBoostingRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingRegressor.html)

**Related APIs**
`HistGradientBoostingClassifier()`
`RandomForestRegressor()`
`GradientBoostingRegressor()`

**Task**
Use a dummy regression baseline.

**Mental Trigger**
You need a baseline regressor for comparison.

**Syntax**

```python
from sklearn.dummy import DummyRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = DummyRegressor(strategy="mean")
reg.fit(X, y)
```

**Quick Note**
Useful for sanity checks and baseline error rates.

**Common Gotcha**
Issue: Baseline seems too good or too bad.
Cause: Wrong dummy strategy.
Quick Fix: Pick the baseline that matches your evaluation goal.

**Official API**
[DummyRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyRegressor.html)

**Related APIs**
`DummyClassifier()`
`LinearRegression()`
`Ridge()`

***

### Clustering

**Task**
Run density-based clustering.

**Mental Trigger**
You need clusters plus noise detection without specifying cluster count.

**Syntax**

```python
from sklearn.cluster import DBSCAN
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
labels = DBSCAN(eps=0.5, min_samples=5).fit_predict(X)
```

**Quick Note**
Good when cluster count is unknown and noise matters.

**Common Gotcha**
Issue: Everything becomes one cluster or noise.
Cause: Bad `eps` or unscaled features.
Quick Fix: Scale features and tune `eps`.

**Official API**
[DBSCAN](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html)

**Related APIs**
`KMeans()`
`AgglomerativeClustering()`
`Birch()`

**Task**
Run agglomerative clustering.

**Mental Trigger**
You want hierarchical bottom-up clustering.

**Syntax**

```python
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
labels = AgglomerativeClustering(n_clusters=3).fit_predict(X)
```

**Quick Note**
Useful for hierarchical structure and dendrogram-style grouping.

**Common Gotcha**
Issue: Results vary heavily with scaling.
Cause: Distance-based clustering on unscaled features.
Quick Fix: Scale features first.

**Official API**
[AgglomerativeClustering](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html)

**Related APIs**
`DBSCAN()`
`Birch()`
`SpectralClustering()`

**Task**
Run Birch clustering.

**Mental Trigger**
You need scalable clustering on large datasets.

**Syntax**

```python
from sklearn.cluster import Birch
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
labels = Birch(n_clusters=3).fit_predict(X)
```

**Quick Note**
Designed to be more scalable than some hierarchical methods.

**Common Gotcha**
Issue: Cluster quality degrades on complex shapes.
Cause: Birch favors compact clusters.
Quick Fix: Compare with DBSCAN or spectral clustering.

**Official API**
[Birch](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.Birch.html)

**Related APIs**
`KMeans()`
`DBSCAN()`
`AgglomerativeClustering()`

**Task**
Run mini-batch k-means.

**Mental Trigger**
You want k-means with faster updates on larger datasets.

**Syntax**

```python
from sklearn.cluster import MiniBatchKMeans
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
km = MiniBatchKMeans(n_clusters=3, random_state=42, batch_size=32)
labels = km.fit_predict(X)
```

**Quick Note**
Useful when standard k-means is too slow.

**Common Gotcha**
Issue: Cluster quality is unstable.
Cause: Small batch size or poor initialization.
Quick Fix: Increase `batch_size` or `n_init`.

**Official API**
[MiniBatchKMeans](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.MiniBatchKMeans.html)

**Related APIs**
`KMeans()`
`Birch()`
`DBSCAN()`

**Task**
Run spectral clustering.

**Mental Trigger**
You want graph-based clustering on non-convex structures.

**Syntax**

```python
from sklearn.cluster import SpectralClustering
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
labels = SpectralClustering(n_clusters=3, random_state=42, affinity="nearest_neighbors").fit_predict(X)
```

**Quick Note**
Useful for nonlinear cluster boundaries.

**Common Gotcha**
Issue: Slow or memory-heavy behavior.
Cause: Graph construction and eigen decomposition.
Quick Fix: Use on smaller datasets or simpler methods.

**Official API**
[SpectralClustering](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.SpectralClustering.html)

**Related APIs**
`DBSCAN()`
`AgglomerativeClustering()`
`KMeans()`

***

### Model Selection

**Task**
Enumerate hyperparameter combinations.

**Mental Trigger**
You want to inspect or loop over a manual parameter grid.

**Syntax**

```python
from sklearn.model_selection import ParameterGrid

grid = ParameterGrid({"C": [0.1, 1, 10], "kernel": ["linear", "rbf"]})
params = list(grid)
```

**Quick Note**
Useful for small search spaces and custom loops.

**Common Gotcha**
Issue: Too many combinations.
Cause: Grid size grows multiplicatively.
Quick Fix: Narrow the grid before iterating.

**Official API**
[ParameterGrid](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.ParameterGrid.html)

**Related APIs**
`ParameterSampler()`
`GridSearchCV()`
`RandomizedSearchCV()`

**Task**
Sample hyperparameters randomly.

**Mental Trigger**
You want a lightweight manual random search or custom search loop.

**Syntax**

```python
from sklearn.model_selection import ParameterSampler
from scipy.stats import loguniform

dist = {"C": loguniform(1e-3, 1e3), "kernel": ["linear", "rbf"]}
samples = list(ParameterSampler(dist, n_iter=5, random_state=42))
```

**Quick Note**
Useful when you want random draws without running a full CV search wrapper.

**Common Gotcha**
Issue: Sampling is not reproducible.
Cause: Missing `random_state`.
Quick Fix: Set `random_state` explicitly.

**Official API**
[ParameterSampler](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.ParameterSampler.html)

**Related APIs**
`ParameterGrid()`
`RandomizedSearchCV()`
`GridSearchCV()`

***

### Hyperparameter Search

**Task**
Run successive-halving randomized search.

**Mental Trigger**
You want to search many parameter settings while aggressively pruning weak ones.

**Syntax**

```python
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingRandomSearchCV
from sklearn.svm import SVC
from scipy.stats import loguniform
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
search = HalvingRandomSearchCV(
    SVC(),
    param_distributions={"C": loguniform(1e-3, 1e3)},
    cv=5,
    random_state=42
)
search.fit(X, y)
```

**Quick Note**
Enable the experimental module before importing the search class.

**Common Gotcha**
Issue: Import fails or the class is unavailable.
Cause: Missing experimental enable import.
Quick Fix: Import `enable_halving_search_cv` first.

**Official API**
[HalvingRandomSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.HalvingRandomSearchCV.html)

**Related APIs**
`HalvingGridSearchCV()`
`RandomizedSearchCV()`
`GridSearchCV()`

***

### Metrics

**Task**
Compute balanced accuracy and Matthews correlation.

**Mental Trigger**
You need classification metrics that handle imbalance better than raw accuracy.

**Syntax**

```python
from sklearn.metrics import balanced_accuracy_score, matthews_corrcoef

y_true = [0, 1, 1, 0]
y_pred = [0, 1, 0, 0]

ba = balanced_accuracy_score(y_true, y_pred)
mcc = matthews_corrcoef(y_true, y_pred)
```

**Quick Note**
Both metrics are useful when classes are imbalanced.

**Common Gotcha**
Issue: Accuracy looks good while minority performance is poor.
Cause: Using raw accuracy alone.
Quick Fix: Add imbalance-aware metrics.

**Official API**
[balanced_accuracy_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html)

**Related APIs**
`accuracy_score()`
`classification_report()`
`matthews_corrcoef()`

**Task**
Compute log loss and top-k accuracy.

**Mental Trigger**
You want probability-sensitive classification metrics.

**Syntax**

```python
from sklearn.metrics import log_loss, top_k_accuracy_score

y_true = [0, 1, 2]
y_proba = [[0.7, 0.2, 0.1], [0.1, 0.7, 0.2], [0.2, 0.3, 0.5]]

ll = log_loss(y_true, y_proba)
top2 = top_k_accuracy_score(y_true, y_proba, k=2)
```

**Quick Note**
Use probability outputs, not hard labels, for these metrics.

**Common Gotcha**
Issue: Metric input shape or type errors.
Cause: Passing class labels instead of probabilities.
Quick Fix: Use `predict_proba()` output.

**Official API**
[log_loss](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html)

**Related APIs**
`roc_auc_score()`
`top_k_accuracy_score()`
`classification_report()`

**Task**
Compute regression error and variance metrics.

**Mental Trigger**
You need standard regression metrics beyond MSE and MAE.

**Syntax**

```python
from sklearn.metrics import root_mean_squared_error, mean_absolute_percentage_error, explained_variance_score, median_absolute_error

y_true = [3.0, 2.0, 5.0]
y_pred = [2.5, 2.0, 4.0]

rmse = root_mean_squared_error(y_true, y_pred)
mape = mean_absolute_percentage_error(y_true, y_pred)
evs = explained_variance_score(y_true, y_pred)
medae = median_absolute_error(y_true, y_pred)
```

**Quick Note**
These help compare errors on different scales and robustness levels.

**Common Gotcha**
Issue: Percentage error blows up near zero targets.
Cause: MAPE is unstable around zero.
Quick Fix: Prefer a scale-based metric when targets are near zero.

**Official API**
[root_mean_squared_error](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.root_mean_squared_error.html)

**Related APIs**
`mean_squared_error()`
`mean_absolute_error()`
`r2_score()`

**Task**
Compute clustering agreement metrics.

**Mental Trigger**
You want to compare predicted clusters against reference labels.

**Syntax**

```python
from sklearn.metrics import adjusted_rand_score, adjusted_mutual_info_score

y_true = [0, 0, 1, 1]
y_pred = [1, 1, 0, 0]

ari = adjusted_rand_score(y_true, y_pred)
ami = adjusted_mutual_info_score(y_true, y_pred)
```

**Quick Note**
Useful when cluster labels are permutations of one another.

**Common Gotcha**
Issue: Raw label matching looks wrong.
Cause: Cluster IDs are arbitrary.
Quick Fix: Use permutation-invariant clustering metrics.

**Official API**
[adjusted_rand_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.adjusted_rand_score.html)

**Related APIs**
`silhouette_score()`
`adjusted_mutual_info_score()`
`confusion_matrix()`

***

### Inspection

**Task**
Plot partial dependence for a fitted model.

**Mental Trigger**
You want to inspect the marginal effect of one or two features.

**Syntax**

```python
from sklearn.inspection import PartialDependenceDisplay
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
model = RandomForestRegressor(random_state=42).fit(X, y)
PartialDependenceDisplay.from_estimator(model, X, [0, 1])
```

**Quick Note**
Best for fitted tree-based or compatible models.

**Common Gotcha**
Issue: Plot looks misleading with correlated features.
Cause: Partial dependence assumes feature independence.
Quick Fix: Interpret carefully or use alternative inspection methods.

**Official API**
[PartialDependenceDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html)

**Related APIs**
`permutation_importance()`
`DecisionBoundaryDisplay()`
`ConfusionMatrixDisplay()`

**Task**
Plot classifier decision regions.

**Mental Trigger**
You want a 2D visualization of classification boundaries.

**Syntax**

```python
from sklearn.inspection import DecisionBoundaryDisplay
from sklearn.svm import SVC
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
X2 = X[:, :2]
clf = SVC().fit(X2, y)
DecisionBoundaryDisplay.from_estimator(clf, X2, response_method="predict")
```

**Quick Note**
Works best in two dimensions.

**Common Gotcha**
Issue: Plot is unreadable in high dimensions.
Cause: Decision boundaries are visualized only in 2D.
Quick Fix: Reduce to two features or use dimensionality reduction first.

**Official API**
[DecisionBoundaryDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.inspection.DecisionBoundaryDisplay.html)

**Related APIs**
`PartialDependenceDisplay()`
`ConfusionMatrixDisplay()`
`RocCurveDisplay()`

**Task**
Compute calibration curve data.

**Mental Trigger**
You want to inspect whether predicted probabilities are calibrated.

**Syntax**

```python
from sklearn.calibration import calibration_curve
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
mask = y < 2
proba = LogisticRegression(max_iter=1000).fit(X[mask], y[mask]).predict_proba(X[mask])[:, 1]
frac_pos, mean_pred = calibration_curve(y[mask], proba, n_bins=5)
```

**Quick Note**
Use binary classification probabilities for the simplest workflow.

**Common Gotcha**
Issue: Curve is noisy with few samples.
Cause: Too many bins for too little data.
Quick Fix: Reduce `n_bins`.

**Official API**
[calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html)

**Related APIs**
`CalibrationDisplay()`
`predict_proba()`
`log_loss()`

**Task**
Display calibration curves directly.

**Mental Trigger**
You want a ready-made plot for probability calibration.

**Syntax**

```python
from sklearn.calibration import CalibrationDisplay
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
mask = y < 2
clf = LogisticRegression(max_iter=1000).fit(X[mask], y[mask])
CalibrationDisplay.from_estimator(clf, X[mask], y[mask], n_bins=5)
```

**Quick Note**
Convenient wrapper around calibration analysis.

**Common Gotcha**
Issue: Multiclass use is not straightforward.
Cause: Basic calibration display is simplest for binary tasks.
Quick Fix: Reduce to a binary view or calibrate per class.

**Official API**
[CalibrationDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibrationDisplay.html)

**Related APIs**
`calibration_curve()`
`RocCurveDisplay()`
`PrecisionRecallDisplay()`

***

### Persistence

**Task**
Cache expensive intermediate computations.

**Mental Trigger**
You want to memoize results across repeated function calls or pipeline fits.

**Syntax**

```python
from joblib import Memory
import tempfile

mem = Memory(location=tempfile.mkdtemp(), verbose=0)
```

**Quick Note**
Useful for expensive repeated preprocessing or feature generation.

**Common Gotcha**
Issue: Cache grows unexpectedly.
Cause: Leaving temporary artifacts unmanaged.
Quick Fix: Clear or relocate the cache when done.

**Official API**
[joblib.Memory](https://joblib.readthedocs.io/en/latest/generated/joblib.Memory.html)

**Related APIs**
`Pipeline(memory=...)`
`joblib.dump()`
`joblib.load()`

**Task**
Clone estimators safely.

**Mental Trigger**
You want a fresh unfitted copy of an existing estimator.

**Syntax**

```python
from sklearn.base import clone
from sklearn.linear_model import LogisticRegression

est = LogisticRegression(max_iter=1000)
est2 = clone(est)
```

**Quick Note**
`clone()` copies parameters, not fitted state.

**Common Gotcha**
Issue: Expected learned coefficients are missing.
Cause: Cloning does not preserve fitted attributes.
Quick Fix: Refit the cloned estimator.

**Official API**
[clone](https://scikit-learn.org/stable/modules/generated/sklearn.base.clone.html)

**Related APIs**
`joblib.Memory`
`joblib.dump()`
`Pipeline()`

***

### Utilities

**Task**
Compute class weights for imbalance handling.

**Mental Trigger**
You need automatic weighting for imbalanced classification.

**Syntax**

```python
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

classes = np.array([0, 1])
y = np.array([0, 0, 0, 1])
weights = compute_class_weight(class_weight="balanced", classes=classes, y=y)
```

**Quick Note**
Useful for weighted loss settings and imbalanced training.

**Common Gotcha**
Issue: Wrong class list causes errors.
Cause: `classes` does not match labels in `y`.
Quick Fix: Pass the exact class array.

**Official API**
[compute_class_weight](https://scikit-learn.org/stable/modules/generated/sklearn.utils.class_weight.compute_class_weight.html)

**Related APIs**
`compute_sample_weight()`
`balanced_accuracy_score()`
`DummyClassifier()`

**Task**
Compute per-sample weights.

**Mental Trigger**
You want weights for each row, not just each class.

**Syntax**

```python
from sklearn.utils.class_weight import compute_sample_weight
import numpy as np

y = np.array([0, 0, 0, 1])
w = compute_sample_weight(class_weight="balanced", y=y)
```

**Quick Note**
Useful when your training loop accepts sample weights.

**Common Gotcha**
Issue: Weighting does not change results.
Cause: Estimator ignores `sample_weight`.
Quick Fix: Confirm the estimator supports sample weights.

**Official API**
[compute_sample_weight](https://scikit-learn.org/stable/modules/generated/sklearn.utils.class_weight.compute_sample_weight.html)

**Related APIs**
`compute_class_weight()`
`resample()`
`class_weight`

**Task**
Bootstrap or rebalance data by resampling.

**Mental Trigger**
You need to upsample, downsample, or bootstrap a dataset.

**Syntax**

```python
from sklearn.utils import resample
import numpy as np

X = np.array([[^1], [^2], [^3], [^4]])
y = np.array([0, 0, 1, 1])
X_res, y_res = resample(X, y, replace=True, random_state=42)
```

**Quick Note**
Useful for bootstrapping and simple imbalance correction.

**Common Gotcha**
Issue: Original class distribution is not preserved.
Cause: Plain resampling without stratification logic.
Quick Fix: Resample by class if you need balance.

**Official API**
[resample](https://scikit-learn.org/stable/modules/generated/sklearn.utils.resample.html)

**Related APIs**
`compute_sample_weight()`
`compute_class_weight()`
`ShuffleSplit()`

**Task**
Create a reproducible random state.

**Mental Trigger**
You need a consistent random seed helper for legacy and utility code.

**Syntax**

```python
from sklearn.utils import check_random_state

rng = check_random_state(42)
values = rng.rand(3)
```

**Quick Note**
Useful when an API expects a NumPy random-state object.

**Common Gotcha**
Issue: Mixed random APIs create inconsistent results.
Cause: Using both global and local RNG sources.
Quick Fix: Pass the same seeded random state through your code.

**Official API**
[check_random_state](https://scikit-learn.org/stable/modules/generated/sklearn.utils.check_random_state.html)

**Related APIs**
`random_state=`
`resample()`
`ParameterSampler()`

**Task**  
Control random seeding for reproducible scikit-learn runs.

**Mental Trigger**  
You need deterministic splits, sampling, or model initialization across repeated experiments.

**Syntax**
```python
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.utils import check_random_state

rng = check_random_state(42)
X = np.arange(10).reshape(5, 2)
y = np.arange(5)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=rng)
```

**Quick Note**  
Use a fixed seed or `check_random_state()` when an API expects a NumPy-style random generator. Setting consistent randomness is the standard way to make scikit-learn behavior reproducible. [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.utils.check_random_state.html)

**Common Gotcha**  
Issue: Runs still change even after seeding.  
Cause: Different parts of the pipeline use different random sources or omit `random_state`.  
Quick Fix: Pass the same `random_state` through every estimator and splitter that supports it. [stackoverflow](https://stackoverflow.com/questions/52746279/how-to-get-absolutely-reproducible-results-with-scikit-learn)

**Official API**  
[check_random_state](https://scikit-learn.org/stable/modules/generated/sklearn.utils.check_random_state.html)

**Related APIs**  
`train_test_split()`  
`ShuffleSplit()`  
`StratifiedShuffleSplit()`  
`ParameterSampler()`

<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^2]: AENS-Knowledge-Layer-Specification.md

[^3]: CONTENT_QUALITY_STANDARD.md

[^4]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^5]: CURRENT_PROJECT_STATE_REPORT.md

[^6]: https://arxiv.org/pdf/1201.0490.pdf

[^7]: http://arxiv.org/pdf/2401.07950.pdf

[^8]: https://arxiv.org/pdf/1309.0238.pdf

[^9]: https://arxiv.org/html/2309.13420

[^10]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10792272/

[^11]: https://www.aclweb.org/anthology/D19-1546.pdf

[^12]: https://medinform.jmir.org/2023/1/e49886

[^13]: https://pubs.acs.org/doi/10.1021/acsomega.3c05207

[^14]: https://github.com/mpolinowski/python-scikitlearn-cheatsheet

[^15]: https://www.geeksforgeeks.org/blogs/scikit-learn-cheatsheet/

[^16]: https://github.com/thegeekyb0y/sklearn-cheat

[^17]: https://github.com/musja007/scikit-learn-cheat-sheet

[^18]: https://www.kdnuggets.com/publications/sheets/Scikit-Learn_Cheatsheet_for_Machine_Learning.pdf

[^19]: https://scikit-learn.org/0.21/_downloads/scikit-learn-docs.pdf

[^20]: https://scikit-learn.org/stable/getting_started.html

[^21]: https://scikit-learn.org/stable/user_guide.html

[^22]: https://github.com/mkjmkumar/Machine-Learning-and-Python-Cheat-Sheet/blob/master/Scikit Learn Cheat Sheet.pdf

[^23]: https://www.datacamp.com/cheat-sheet/scikit-learn-cheat-sheet-python-machine-learning

