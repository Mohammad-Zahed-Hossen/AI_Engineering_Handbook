<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Naive Bayes

## 1. Decision Summary

Naive Bayes is a fast probabilistic classifier that applies Bayes’ theorem with a conditional independence assumption, making it especially effective as a production baseline for sparse, high-dimensional, and text-heavy classification problems.[^1][^2]

### Summary

Naive Bayes estimates class posteriors from priors and feature likelihoods, then predicts the class with the highest posterior probability under a naive conditional-independence model.[^2][^1]

### Best Use Cases

- Email spam filtering and abuse detection, where sparse token counts often dominate signal.[^3][^1]
- Document and text classification, including topic labeling and intent classification.[^4][^3]
- Sentiment analysis on bag-of-words or TF-IDF features.[^5][^1]
- Fast baseline classifiers for very high-dimensional sparse data where latency and simplicity matter.[^1][^2]


### Avoid When

- Features are strongly correlated, because independence violations can distort posterior estimates.[^4][^1]
- The decision boundary is highly nonlinear or depends on feature interactions.[^2][^1]
- Maximum predictive accuracy is the main objective and more expressive models are feasible.[^1][^2]
- Rich interaction modeling or calibrated probabilities are critical without extra calibration steps.[^6][^1]


### Strengths

- Extremely fast training and inference because parameter estimation is mostly closed-form and lightweight.[^2][^1]
- Works very well on sparse, high-dimensional features common in NLP and text classification.[^4][^1]
- Strong engineering baseline for quick iteration, ablation testing, and deployment on CPU-only systems.[^1][^2]


### Limitations

- Independence violations can materially reduce accuracy when correlated features carry redundant evidence.[^4][^1]
- Raw posterior probabilities are often poorly calibrated relative to more discriminative models.[^6][^1]
- Variant choice matters; Gaussian, Multinomial, Bernoulli, Complement, and Categorical NB assume different data types and can fail under mismatch.[^2][^1]


### Interpretability

Naive Bayes exposes class priors, feature likelihoods, and posterior probabilities, so engineers can inspect which classes are favored and why a prediction was made.[^1][^2]
This makes it useful for probabilistic decision making, especially when you need thresholding, ranking, or auditability rather than only hard labels.[^6][^1]

### Training Characteristics

Training is typically closed-form or near closed-form, with very low optimization overhead compared with iterative linear models or tree ensembles.[^2][^1]
Different estimators estimate different sufficient statistics: GaussianNB fits mean/variance, MultinomialNB and ComplementNB fit class-feature counts, BernoulliNB fits binary feature probabilities, and CategoricalNB fits category-wise counts.[^6][^2]
In practice, this means training is usually fast enough for repeated retraining and grid search on CPU.[^1][^2]

### Inference Characteristics

Prediction latency is very low because inference is mostly a small number of arithmetic operations per feature and class.[^2][^1]
Memory use is compact, making the model suitable for batch scoring and high-throughput services with limited compute.[^6][^1]
CPU efficiency is strong because no tree traversal, kernel evaluation, or iterative optimization is required.[^1][^2]

### Computational Characteristics

- Training: $O(npk)$ in the common dense case; sparse text variants are often closer to proportional to the number of nonzero feature values.[^2][^1]
- Prediction: $O(p k)$ per sample for standard implementations, with sparse inputs reducing effective work.[^1][^2]
- Memory usage: $O(pk)$ for class-conditional parameters plus class priors and small auxiliary state.[^6][^2]
- Scalability: scales well with large $n$ and very large $p$ when features are sparse and the variant matches the data distribution.[^2][^1]


## 2. Core Understanding

### Intuition \& Learning Mechanism

Naive Bayes models class membership by combining a prior belief about each class with the likelihood of observing the features under that class.[^1][^2]
The key simplification is the conditional independence assumption: features are treated as independent given the class, which turns joint likelihood estimation into a product of per-feature terms.[^4][^1]
Prediction is MAP classification: choose the class with the largest posterior probability after observing the input.[^2][^1]

### Mathematical Intuition \& Formulation

Bayes’ theorem gives:

$$
P(y \mid x) = \frac{P(x \mid y) P(y)}{P(x)}
$$

For classification, the denominator is constant across classes, so the decision rule is:

$$
\hat{y} = \arg\max_y P(y \mid x) = \arg\max_y P(x \mid y) P(y)
$$

Under conditional independence:

$$
P(x \mid y) = \prod_{j=1}^{p} P(x_j \mid y)
$$

so the model becomes efficient and tractable even for very large feature spaces.[^4][^1]

### Assumptions

- Conditional feature independence: if violated heavily, duplicate or correlated evidence can overcount signal and hurt accuracy.[^4][^1]
- Representative training data: if training priors differ from production priors, predicted posteriors and thresholds can drift.[^6][^1]
- Correct probability distribution: GaussianNB assumes normal features, MultinomialNB assumes counts or nonnegative term weights, BernoulliNB assumes binary indicators, and CategoricalNB assumes categorical values.[^6][^2]
- Stable class priors: if class proportions shift, `fit_prior` and `class_prior` choices can become misaligned with deployment reality.[^6][^2]


### Complexity \& Memory Complexity

For $n$ samples, $p$ features, and $k$ classes, Naive Bayes is typically $O(npk)$ to train and $O(pk)$ to score a sample, with sparse text workloads often cheaper in practice.[^1][^2]
Memory is $O(pk)$ for the learned per-class parameters, plus modest overhead for priors and smoothing state.[^2][^6]

- Robustness: robust to sparse high-dimensional inputs, but sensitive to distribution mismatch, correlation, and outliers in GaussianNB.[^6][^1]
- Scalability: excellent on CPU and distributed batch preprocessing pipelines, especially for bag-of-words style features.[^1][^2]
- Overfitting Tendency: usually low variance and modest overfitting risk, but probability estimates can still be miscalibrated and overconfident.[^6][^1]
- Bias-Variance: high-bias, low-variance behavior is typical because the independence assumption simplifies the hypothesis class.[^4][^1]


## 3. Hyperparameter Intelligence

### `var_smoothing` — GaussianNB

**Purpose**
Adds a small fraction of the largest feature variance to each variance estimate to improve numerical stability in `GaussianNB`.[^6]

**Effect of Increasing**

- Bias: increases slightly because variance estimates become more regularized.
- Variance: decreases by reducing sensitivity to tiny variances.
- Speed: negligible effect.
- Memory: negligible effect.

**Effect of Decreasing**

- Bias: decreases slightly.
- Variance: increases because the model becomes more sensitive to small or unstable variances.
- Speed: negligible effect.
- Memory: negligible effect.

**Trade-offs**
Higher values improve stability when a feature has near-zero variance, but too much smoothing blunts class separation and can harm discrimination.[^6]

**Tuning Priority \& Interactions**

- Priority: High for GaussianNB.
- Variant compatibility: GaussianNB only.[^6]
- Practical tuning: start with the default, then increase only if you see instability, divide-by-zero warnings, or overly sharp posteriors.

**Common Mistakes**
Using a Gaussian model on non-Gaussian count data and trying to fix the mismatch only with `var_smoothing`.[^1][^6]

### `alpha` — MultinomialNB, BernoulliNB, ComplementNB

**Purpose**
Laplace/Lidstone smoothing for feature likelihood estimates in count or binary Naive Bayes variants.[^2][^6]

**Effect of Increasing**

- Bias: increases.
- Variance: decreases.
- Speed: negligible effect.
- Memory: negligible effect.

**Effect of Decreasing**

- Bias: decreases.
- Variance: increases.
- Speed: negligible effect.
- Memory: negligible effect.

**Trade-offs**
More smoothing improves robustness on rare features and small datasets, but too much smoothing can wash out strong discriminative tokens.[^2][^6]

**Tuning Priority \& Interactions**

- Priority: High for text classification.
- Variant compatibility: MultinomialNB, BernoulliNB, ComplementNB.[^2]
- Practical tuning: sweep small values around the default first; larger values can help extreme sparsity.

**Common Mistakes**
Leaving `alpha` too low on tiny datasets, which can produce brittle likelihoods for rare terms.[^2][^6]

### `force_alpha` — MultinomialNB, BernoulliNB, ComplementNB

**Purpose**
Controls whether extremely small `alpha` values are accepted as-is or coerced to avoid numerical issues in newer scikit-learn versions.[^2]

**Effect of Increasing**

- Bias: no direct statistical effect.
- Variance: no direct statistical effect.
- Speed: negligible.
- Memory: negligible.

**Effect of Decreasing**

- Bias: no direct statistical effect.
- Variance: no direct statistical effect.
- Speed: negligible.
- Memory: negligible.

**Trade-offs**
This is mainly a numerical-stability and reproducibility control, not a modeling knob.[^2]

**Tuning Priority \& Interactions**

- Priority: Medium when using recent scikit-learn releases.
- Variant compatibility: MultinomialNB, BernoulliNB, ComplementNB.[^2]
- Practical tuning: keep the default unless you have a reason to preserve very small alpha values exactly.

**Common Mistakes**
Treating it like a regularization parameter instead of a stability flag.[^2]

### `fit_prior` — all estimators with class priors

**Purpose**
Learns class priors from training data when enabled, rather than assuming uniform priors.[^6][^2]

**Effect of Increasing**

- Bias: can reduce bias if training priors match production.
- Variance: may increase sensitivity to prior drift.
- Speed: negligible.
- Memory: negligible.

**Effect of Decreasing**

- Bias: can increase if class frequencies are highly imbalanced.
- Variance: may decrease slightly by using fixed priors.
- Speed: negligible.
- Memory: negligible.

**Trade-offs**
Learning priors helps when the training set reflects the target distribution, but fixed priors can be better when the dataset is sampled or artificially balanced.[^6][^2]

**Tuning Priority \& Interactions**

- Priority: Medium.
- Variant compatibility: all Naive Bayes classifiers exposing priors.[^6][^2]
- Practical tuning: disable only when training class proportions are known to be unrepresentative.

**Common Mistakes**
Using balanced training data with `fit_prior=True` and assuming the learned priors match production reality.[^2]

### `class_prior` — all estimators with priors

**Purpose**
Manually sets class probabilities when you want to override empirical priors.[^6][^2]

**Effect of Increasing**

- Bias: shifts decision boundaries toward the specified classes.
- Variance: can lower variance if priors are stable and known.
- Speed: negligible.
- Memory: negligible.

**Effect of Decreasing**

- Bias: shifts the model away from the specified classes.
- Variance: may increase if priors are poorly chosen.
- Speed: negligible.
- Memory: negligible.

**Trade-offs**
Useful for prior correction, but incorrect priors can dominate the posterior and reduce recall for minority classes.[^6]

**Tuning Priority \& Interactions**

- Priority: High only when you have a trustworthy deployment prior.
- Variant compatibility: all estimators with prior support.[^2][^6]
- Practical tuning: use when class imbalance in the sample is known to differ from production.

**Common Mistakes**
Hard-coding priors from a stale dataset and never updating them after the target distribution changes.[^6]

### `binarize` — BernoulliNB

**Purpose**
Thresholds numeric inputs into binary indicators before fitting or scoring in `BernoulliNB`.[^2]

**Effect of Increasing**

- Bias: may increase if too many values collapse to zero.
- Variance: may decrease because inputs become simpler.
- Speed: negligible.
- Memory: negligible.

**Effect of Decreasing**

- Bias: may decrease if more values remain active.
- Variance: may increase.
- Speed: negligible.
- Memory: negligible.

**Trade-offs**
Choosing the threshold affects whether weak signals are treated as present or absent, which can strongly change text and event features.[^2]

**Tuning Priority \& Interactions**

- Priority: Medium for BernoulliNB.
- Variant compatibility: BernoulliNB only.[^2]
- Practical tuning: use when inputs are counts or TF-IDF scores that need binarization.

**Common Mistakes**
Applying BernoulliNB to already sparse binary features without checking whether the threshold is meaningful.[^2]

### `priors` — GaussianNB

**Purpose**
Specifies class priors explicitly for `GaussianNB`.[^6]

**Effect of Increasing**

- Bias: shifts toward the corresponding class.
- Variance: can reduce variance if priors are correct.
- Speed: negligible.
- Memory: negligible.

**Effect of Decreasing**

- Bias: shifts away from the corresponding class.
- Variance: may increase if priors are inaccurate.
- Speed: negligible.
- Memory: negligible.

**Trade-offs**
This is most useful when class frequencies are known from domain constraints rather than training sample counts.[^6]

**Tuning Priority \& Interactions**

- Priority: Medium.
- Variant compatibility: GaussianNB.[^6]
- Practical tuning: use for prior correction and cost-sensitive deployment setups.

**Common Mistakes**
Using `priors` and `fit_prior` together without understanding that the explicit prior should dominate the learned prior logic.[^6]

### `sample_weight` — all estimators that support weighted fitting

**Purpose**
Reweights samples during fitting to reflect importance, cost sensitivity, or imbalance handling.[^2]

**Effect of Increasing**

- Bias: can decrease for emphasized classes or regions.
- Variance: may increase if weights are extreme.
- Speed: slightly lower due to weighted accumulation overhead.
- Memory: negligible.

**Effect of Decreasing**

- Bias: less emphasis on weighted samples.
- Variance: may decrease if weights become more uniform.
- Speed: slightly better.
- Memory: negligible.

**Trade-offs**
Useful for cost-sensitive learning, but extreme weights can destabilize estimated likelihoods and class priors.[^2]

**Tuning Priority \& Interactions**

- Priority: Medium.
- Variant compatibility: estimators that expose weighted fit support.[^2]
- Practical tuning: use alongside class imbalance analysis, not as a substitute for correct prior handling.

**Common Mistakes**
Overusing large weights to compensate for feature mismatch instead of fixing preprocessing or variant choice.

## 4. Engineering Considerations

### Dataset Suitability

Naive Bayes is strongest on sparse text features, token counts, and one-hot/categorical representations where conditional independence is a reasonable approximation.[^1][^2]
It is a good fit for high-dimensional datasets because training cost grows gently and the model remains compact.[^1][^2]
Small datasets also benefit from the strong inductive bias and smoothing, though variant selection becomes more important.[^6][^2]
Choose the variant to match feature semantics: GaussianNB for continuous numeric features, MultinomialNB for counts or nonnegative weights, BernoulliNB for binary indicators, ComplementNB for imbalanced text classes, and CategoricalNB for categorical inputs.[^6][^2]

### Scalability \& Parallelization

CPU efficiency is a major advantage because fitting and scoring rely on simple aggregations and log-probability arithmetic.[^1][^2]
Batch inference is straightforward and predictable, which makes Naive Bayes easy to place behind streaming or queue-based scoring systems.[^1][^6]
Memory efficiency is strong because the learned state is small relative to tree ensembles or large-margin models with support vectors.[^6][^2]
In production, the model scales best when preprocessing is also lightweight and sparse-friendly.

### Computational Cost \& Memory Behavior

Parameter storage is compact: class priors plus per-class feature statistics dominate the footprint.[^2][^6]
Training is efficient because it avoids gradient descent and often only requires one pass or a small number of statistic updates.[^1][^2]
Prediction is fast because the model evaluates per-feature log-likelihoods rather than complex nonlinear structures.[^1][^2]
Hardware utilization is usually CPU-bound and benefits more from vectorized preprocessing than from specialized accelerators.

### Robustness \& Sensitivity to Outliers

GaussianNB is the most sensitive variant to outliers because a few extreme values can distort mean and variance estimates.[^6]
MultinomialNB and BernoulliNB are usually more robust for text-like data because counts and binary indicators are less affected by single large magnitudes.[^2][^6]
Rare-feature behavior is controlled by smoothing, so alpha choice matters when tokens or categories appear infrequently.[^6][^2]
If distribution mismatch is severe, switching variants is usually more effective than fine-tuning hyperparameters.

### Feature Engineering Dependency \& Scaling Requirements

Scaling is generally unnecessary because the model is driven by likelihood estimation rather than distance metrics or margin geometry.[^1][^2]
Tokenization matters for text tasks because the model expects a clean, consistent feature representation such as counts or TF-IDF.[^3][^1]
Count features are the natural input for MultinomialNB, while BernoulliNB expects binary indicators and may binarize numeric inputs internally.[^2]
TF-IDF is compatible in practice, but it works best when the resulting values are nonnegative and the variant choice matches the data semantics.[^3][^2]

### Class Imbalance Behavior \& Pipeline Position

Naive Bayes can handle imbalance reasonably well if priors and sample weights are configured deliberately, but it may still favor the majority class when priors are learned directly from skewed data.[^6][^2]
Probability calibration can drift under imbalance, so threshold tuning is often necessary before deployment.[^1][^6]
Place Naive Bayes after deterministic preprocessing and before any threshold calibration or business-rule layer so posterior probabilities remain usable.[^1][^6]
For imbalanced text problems, ComplementNB is often preferred over plain MultinomialNB because it is designed for such settings.[^2]

### Common Limitations

The conditional independence assumption is the core structural limitation and is the main reason Naive Bayes underperforms on feature-interaction-heavy problems.[^4][^1]
Probability calibration is often weaker than discrimination, so raw probabilities should not be treated as perfectly calibrated risk estimates without validation.[^1][^6]
Correlated features can cause double-counting of evidence and overconfident predictions.[^4][^1]
Distribution mismatch between the estimator variant and the real data often causes more damage than tuning alone can repair.[^6][^2]

## 5. Comparisons

| Alternative Model | Choose Naive Bayes When | Prefer Alternative When | Key Engineering Trade-offs |
| :-- | :-- | :-- | :-- |
| Logistic Regression | You need a very fast baseline for sparse text and simple probabilistic scoring [^1][^3]. | You need better calibration, stronger discriminative performance, or correlated features [^1][^6]. | NB is faster and simpler; logistic regression usually models decision boundaries better. |
| Decision Tree | Inputs are high-dimensional sparse and you want a compact linear-time baseline [^1][^2]. | You need nonlinear splits and interpretable feature rules at the expense of stability [^1][^2]. | Trees capture interactions; NB is usually cheaper and more stable on sparse text. |
| Random Forest | You want minimal latency and a compact model for text classification [^1][^2]. | You need higher accuracy on structured data and can afford more compute [^7][^1]. | Random forests handle interactions better; NB is lighter and easier to deploy. |
| Support Vector Machine (SVM) | You want a fast, simple baseline or probability-like scoring in a sparse setting [^1][^2]. | You need a stronger margin-based classifier for high-accuracy text or numeric problems [^1][^2]. | SVMs can outperform NB but often cost more to train and tune. |
| K-Nearest Neighbors (KNN) | You want cheap training and compact inference logic [^1][^2]. | You can tolerate slower inference for better local decision boundaries [^8][^1]. | NB has far lower inference cost; KNN can adapt better to local structure. |
| XGBoost | You need a production baseline with tiny training cost and explainable probabilities [^1][^2]. | You need strong tabular performance and can manage more tuning and compute cost [^1][^2]. | XGBoost is typically more accurate; NB is far simpler and faster. |

## 6. Related Knowledge

### Related Models

- GaussianNB.
- MultinomialNB.
- BernoulliNB.
- ComplementNB.
- CategoricalNB.[^2]


### Alternative Models

- Logistic Regression.
- Decision Tree.
- Random Forest.
- Support Vector Machine.
- K-Nearest Neighbors.
- XGBoost.[^1][^2]


### Related Principles

- Bayes’ Theorem.
- Conditional Probability.
- Probability Theory.
- Maximum A Posteriori Estimation.
- Bias-Variance Trade-off.[^4][^1]


### Related Workflows

- Text Classification Pipeline.
- Document Classification.
- Feature Engineering.
- Model Evaluation.
- Hyperparameter Optimization.[^3][^1]


### Related Patterns \& Guides

- Cross Validation.
- NLP Pipeline.
- Probability Calibration Guide.
- Feature Engineering Guide.
- Class Imbalance Guide.[^1][^6]


### Related Packages

- scikit-learn.
- NumPy.
- SciPy.
- NLTK.
- spaCy.[^1][^2]


## 7. Quick Start

### Language

Python

### Implementation Package

scikit-learn

### Code

```python
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.naive_bayes import GaussianNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import roc_auc_score, classification_report
from sklearn.datasets import fetch_openml
from sklearn.compose import make_column_selector as selector

data = fetch_openml("titanic", version=1, as_frame=True)
df = data.frame.copy()
y = df["survived"].astype(int)
X = df.drop(columns=["survived"])

numeric_features = X.select_dtypes(include=["number"]).columns
categorical_features = X.select_dtypes(exclude=["number"]).columns

numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
])

categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore")),
])

preprocess = ColumnTransformer([
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features),
])

model = Pipeline([
    ("preprocess", preprocess),
    ("nb", GaussianNB()),
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

param_grid = {
    "nb__var_smoothing": [1e-9, 1e-8, 1e-7]
}

search = GridSearchCV(
    model,
    param_grid=param_grid,
    scoring="roc_auc",
    cv=5,
    n_jobs=-1
)

search.fit(X_train, y_train)
best_model = search.best_estimator_

y_proba = best_model.predict_proba(X_test)[:, 1]
y_pred = best_model.predict(X_test)

auc = roc_auc_score(y_test, y_proba)
report = classification_report(y_test, y_pred)

print("Best params:", search.best_params_)
print("ROC AUC:", auc)
print(report)
```


### Explanation

This pipeline imputes missing values, encodes categorical columns, and trains GaussianNB inside a scikit-learn workflow.[^1][^6]
It uses `GridSearchCV` to tune `var_smoothing` and evaluates the model with probabilistic and classification metrics.[^1][^6]

### Inputs

A tabular dataset with numeric and categorical columns, plus a binary or multiclass target column.[^1][^6]

### Outputs

Predicted class labels, predicted probabilities, ROC AUC, and a classification report suitable for deployment checks.[^1][^6]

### Notes

Choose GaussianNB only if the numeric features are reasonably continuous; use MultinomialNB for count-like features and BernoulliNB for binary features.[^6][^2]
For deployment, inspect calibration and threshold behavior before exposing raw probabilities to downstream decision systems.[^1][^6]

## 8. Curated External Resources

| Title | URL | Type | Why to Read | Expected Outcome | Reading Time (integer minutes) | Notes for Perplexity |
| :-- | :-- | :-- | :-- | :-- | --: | :-- |
| scikit-learn Naive Bayes user guide | [scikit-learn.org/stable/modules/naive_bayes.html](https://scikit-learn.org/stable/modules/naive_bayes.html) | documentation | Canonical implementation overview and variant distinctions [^1][^2]. | Understand estimator selection and core API behavior. | 20 | Best first-stop official reference. |
| GaussianNB API reference | [scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html](https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html) | documentation | Precise parameter and method reference for production use [^6]. | Understand `var_smoothing`, priors, and inference methods. | 15 | Useful when wiring code and tuning stability. |
| Stanford CS229 notes on Naive Bayes | [cs229.stanford.edu/notes-spring2019/cs229-notes2.pdf](https://cs229.stanford.edu/notes-spring2019/cs229-notes2.pdf) | guide | Strong mathematical and conceptual treatment from a top ML course [^4]. | Reinforce MAP reasoning and independence assumptions. | 30 | Good academic grounding without excessive depth. |
| Introduction to Statistical Learning | [karlin.mff.cuni.cz/~pesta/NMFM334/StatLearning/Book2nd/ISLRv2_website.pdf](https://www.karlin.mff.cuni.cz/~pesta/NMFM334/StatLearning/Book2nd/ISLRv2_website.pdf) | book | Broad classification context and model comparison framing [^9]. | Understand where Naive Bayes fits among classifiers. | 35 | Use for comparative intuition and workflow context. |
| Stanford CS229 lecture on GDA and Naive Bayes | [youtube.com/watch?v=yieIOW9Kaw4](https://www.youtube.com/watch?v=yieIOW9Kaw4) | video | Clear lecture-style explanation from an authoritative course source [^10]. | Gain an accessible mental model of Naive Bayes and smoothing. | 45 | Best as a reinforcement resource after reading docs. |

<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23]</span>

<div align="center">⁂</div>

[^1]: https://scikit-learn.org/stable/modules/naive_bayes.html

[^2]: https://scikit-learn.org/dev/api/sklearn.naive_bayes.html

[^3]: https://ieeexplore.ieee.org/document/11241309/

[^4]: https://cs229.stanford.edu/notes-spring2019/cs229-notes2.pdf

[^5]: https://oajiem.com/index.php/24/article/view/175

[^6]: https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html

[^7]: https://journal.sekawan-org.id/index.php/jtim/article/view/747

[^8]: https://jpti-upiyptk.org/ojs/index.php/jpti/article/view/228

[^9]: https://www.karlin.mff.cuni.cz/~pesta/NMFM334/StatLearning/Book2nd/ISLRv2_website.pdf

[^10]: https://www.youtube.com/watch?v=yieIOW9Kaw4

[^11]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^12]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^13]: CONTENT_QUALITY_STANDARD.md

[^14]: ARCHITECTURE_FREEZE.md

[^15]: AENS-Knowledge-Layer-Specification.md

[^16]: https://journal.ubpkarawang.ac.id/index.php/TeknikInformatikaSistemInfor/article/view/5824

[^17]: http://dergipark.org.tr/tr/doi/10.47495/okufbed.1543982

[^18]: https://journals.lww.com/10.4103/ijehe.ijehe_21_24

[^19]: https://ieeexplore.ieee.org/document/10724583/

[^20]: https://cs229.stanford.edu/lectures-spring2022/main_notes.pdf

[^21]: https://r4ds.github.io/bookclub-islr/a-comparison-of-classification-methods.html

[^22]: https://cs229.stanford.edu/proj2019aut/data/assignment_308832_raw/26646659.pdf

[^23]: https://www.datacamp.com/tutorial/naive-bayes-scikit-learn

