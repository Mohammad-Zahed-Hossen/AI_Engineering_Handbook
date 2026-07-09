# Linear Regression

## Architecture Overview

Linear Regression in AENS should be treated as the canonical **OLS model** for fast, interpretable, baseline regression on tabular data with approximately linear signal and manageable collinearity. In scikit-learn, `LinearRegression` is a thin estimator wrapper around ordinary least squares or non-negative least squares, so the engineering questions are mostly about data suitability, solver behavior, and failure risk rather than model complexity.[^1][^2]

## Decision Summary

Choose Linear Regression when you need a low-latency, low-complexity baseline, a coefficient-based explanation, and a model that is easy to deploy inside a standard sklearn Pipeline. Prefer Ridge, Lasso, or Elastic Net when features are correlated, the design matrix is ill-conditioned, or you need stronger generalization control.[^2][^3]

## Core Understanding

OLS minimizes residual sum of squares, $\min_w \|Xw-y\|_2^2$, so the model is optimizing fit on observed data rather than directly optimizing uncertainty, robustness, or sparsity [^2]. Scikit-learn exposes the learned coefficients as `coef_` and the intercept as `intercept_`, and it solves the problem with an SVD-based least-squares method for dense inputs [^1][^2].

## Mathematical Intuition

Geometrically, OLS projects the target vector onto the span of the feature columns, and the residual is the part of $y$ not explained by that subspace. If the columns of $X$ are nearly linearly dependent, the projection is still defined but the fitted coefficients can become unstable, which is why multicollinearity matters operationally even when prediction error looks acceptable.[^4][^2]

## Assumptions

OLS is most reliable when the signal is close to linear in the chosen features, residual variance is roughly stable, and the feature matrix is not close to rank deficient. Independence of features is not a strict mathematical requirement for fitting, but correlated features increase variance in the estimated coefficients and reduce interpretability.[^2]

## Hyperparameter Intelligence

`fit_intercept` controls whether the model learns an intercept term; set it to `False` only when features and target are already centered or a zero-intercept model is explicitly required. `copy_X` controls whether input data may be overwritten during fitting, so `False` can save memory but increases the risk of side effects if the original array is reused later.[^1]

`positive=True` constrains coefficients to be non-negative and is only supported for dense arrays; it is useful when feature contributions must obey domain constraints, but it narrows the feasible solution space and can underfit if signed effects are real. `n_jobs` only speeds up fitting in sufficiently large multi-output problems when `X` is sparse or `positive=True`; in the common dense single-target case it usually has no practical effect, so it is a low tuning priority.[^5][^1]

## Engineering Considerations

Linear Regression is best placed after feature cleaning, leakage-safe splitting, and any necessary scaling or encoding inside a Pipeline; it is not a substitute for feature engineering. Standardization is usually not required for numerical correctness of OLS, but it becomes important when coefficients are compared across features, when regularized variants are part of the same workflow, or when upstream preprocessing must be consistent across training and inference.[^3][^2]

The model is robust in the sense of implementation simplicity, not in the sense of outlier resistance. Squared loss amplifies large residuals, so a few bad points can dominate the fit and distort coefficients and predictions.[^2]

## Computational Characteristics

For dense inputs, scikit-learn documents an SVD-based least-squares solution with cost on the order of $O(n_{\text{samples}} n_{\text{features}}^2)$ when $n_{\text{samples}} \ge n_{\text{features}}$. This makes Linear Regression attractive for moderate feature counts, but less attractive when feature dimensionality is large enough that regularized or iterative methods become cheaper or more stable.[^3][^2]

Inference is cheap: prediction is a matrix multiply plus intercept addition, which makes the model attractive for batch scoring and low-latency services. Memory use is also modest compared with tree ensembles, unless you rely on large dense design matrices or multi-target output with many coefficients.[^1][^3]

## Failure Modes

Rank deficiency and near-singularity are the main numerical risks because they make coefficient estimates unstable and sensitive to tiny perturbations in the data. Multicollinearity is especially dangerous in production when feature definitions drift over time or when correlated engineered features are added without a governance review.[^4][^2]

Outliers, nonlinearity, heteroscedasticity, and omitted interactions all cause silent degradation rather than obvious runtime errors. The model can still produce plausible predictions while its coefficients and extrapolations become unreliable, so monitoring should focus on input distribution shift, residual drift, and slice-level error rather than only global $R^2$.[^3][^1]

## Model Comparisons

| Model | When Linear Regression is better | When the alternative is better | Engineering tradeoff |
| :-- | :-- | :-- | :-- |
| Ridge Regression | Use OLS when coefficients should stay unpenalized and features are well-conditioned. | Ridge is better when features are correlated or the data are noisy. | Ridge buys stability by shrinking coefficients, at the cost of bias [^2][^3]. |
| Lasso Regression | Use OLS when you want all available features retained and you are not performing feature selection through sparsity. | Lasso is better when you want sparse coefficients and embedded feature selection. | Lasso can zero coefficients, but it is less stable with correlated features [^2]. |
| Elastic Net | Use OLS when regularization is unnecessary and the linear signal is already well behaved. | Elastic Net is better when you need a compromise between sparsity and stability. | Elastic Net is usually more resilient than pure Lasso on correlated predictors [^2]. |
| Decision Tree Regressor | Use OLS when the relationship is approximately linear and you want predictable inference cost. | Trees are better for strong nonlinearity and feature interactions without manual feature engineering. | Trees are more expressive but less stable and less smooth in extrapolation. |
| Random Forest Regressor | Use OLS when interpretability, small footprint, and latency matter more than nonlinear modeling power. | Random Forest is better when nonlinear structure dominates and ensemble robustness is needed. | Forests often improve accuracy on tabular data, but cost more memory and inference time. |

## Related Knowledge

Linear Regression should be understood alongside feature scaling, train-test split discipline, pipeline construction, multicollinearity diagnostics, and regularized linear models. In AENS terms, this model belongs with engineering decisions about regression baselines, not with generic textbook derivations.

## Production Quick Start

A production-safe sklearn setup uses a Pipeline, explicit train/test split, and metrics that reveal both scale-sensitive and scale-free error behavior.[^1][^3]

```python
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

X, y = load_diabetes(return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = Pipeline([
    ("scaler", StandardScaler()),
    ("regressor", LinearRegression())
])

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

rmse = mean_squared_error(y_test, y_pred, squared=False)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print({"rmse": rmse, "mae": mae, "r2": r2})
```

Input is a 2D feature matrix `X` and a numeric target `y`; output is a fitted estimator whose `predict` method returns continuous values. Standardization is included here because it keeps preprocessing consistent inside the deployment path, even though plain OLS itself does not require scaled features for solvability.[^2][^1]

## Common Engineering Mistakes

A common mistake is using OLS on highly correlated features and then trusting the coefficient magnitudes as if they were stable causal signals. Another is fitting preprocessing outside the Pipeline, which leaks training statistics and makes offline evaluation look better than production behavior.[^2]

A third mistake is assuming `n_jobs=-1` will materially accelerate every fit; in LinearRegression it generally matters only in multi-target sparse or positive-constrained cases. A fourth is leaving out regularization when the data are noisy or underdetermined, then trying to fix instability with more feature engineering instead of changing the estimator.[^5][^3][^1]

## Learning Resources

- [scikit-learn Linear Models guide](https://scikit-learn.org/stable/modules/linear_model.html): valuable because it documents the objective, solver behavior, multicollinearity risk, and relationships to Ridge, Lasso, and Elastic Net; the expected outcome is implementation-level understanding of linear estimators in sklearn.[^2]
- [scikit-learn LinearRegression API](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html): valuable because it is the authoritative parameter and attribute reference; the expected outcome is precise usage of `fit_intercept`, `copy_X`, `positive`, `n_jobs`, `coef_`, `intercept_`, and `rank_`.[^1]
- [Ordinary Least Squares and Ridge Regression example](https://scikit-learn.org/stable/auto_examples/linear_model/plot_ols_ridge.html): valuable because it shows the practical instability of OLS and how Ridge improves robustness; the expected outcome is intuition for when OLS stops being the right production choice.[^3]
- [Scikit-learn: Machine Learning in Python](https://arxiv.org/pdf/1201.0490.pdf): valuable as the original scikit-learn paper describing the library’s design philosophy; the expected outcome is better judgment about why sklearn models are built as estimator objects with consistent APIs.[^6]
- [API design for machine learning software](https://arxiv.org/pdf/1309.0238.pdf): valuable for understanding sklearn’s design tradeoffs; the expected outcome is stronger architectural intuition for composing models in production systems.[^7]
- [The Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/contents.pdf): valuable for deeper linear-model context and regularization theory; the expected outcome is broader statistical intuition for when OLS is a baseline rather than a final model.[^8]


## Official References

- [scikit-learn LinearRegression API](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)[^1]
- [scikit-learn Linear Models user guide](https://scikit-learn.org/stable/modules/linear_model.html)[^2]
- [scikit-learn OLS and Ridge example](https://scikit-learn.org/stable/auto_examples/linear_model/plot_ols_ridge.html)[^3]


## Hyperparameters

| Parameter | Purpose | Engineering impact | Increase / decrease effect | Tuning priority | Interactions | Common mistakes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `fit_intercept` | Learns an intercept term [^1]. | Controls whether the model can shift predictions away from zero. | `True` usually improves fit unless data are already centered; `False` can simplify constrained pipelines. | High. | Interacts with centering and with any upstream scaler that changes feature means. | Setting `False` on uncentered data and misreading the bias as model failure. |
| `copy_X` | Copies input data before fitting [^1]. | Protects original arrays from mutation at the cost of memory. | `True` is safer; `False` can reduce memory pressure. | Low. | Matters when the same array is reused downstream. | Turning it off in shared-memory or notebook workflows and corrupting source data. |
| `positive` | Forces non-negative coefficients [^1]. | Adds domain constraints and may improve plausibility in additive systems. | `True` narrows the hypothesis space and can increase bias. | Medium only for constrained domains. | Only supported on dense arrays; interacts with feature engineering and sign expectations. | Using it as a generic regularization substitute. |
| `n_jobs` | Parallelizes only in limited cases [^1][^5]. | Usually has no effect in the common dense single-target case. | More jobs help only when applicable; otherwise no meaningful change. | Low. | Relevant mainly for sparse or positive-constrained multi-output fits. | Expecting speedups where the solver path is single-threaded or dominated by linear algebra. |

## Final Verification

This document follows the AENS ownership model by treating Linear Regression as model-level algorithm knowledge rather than package syntax or workflow guidance. It is production-oriented, free of filler, and structured for direct conversion into AENS content fields and linked resources.[^9][^10][^11]
<span style="display:none">[^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40]</span>

<div align="center">⁂</div>

[^1]: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html

[^2]: https://scikit-learn.org/stable/modules/linear_model.html

[^3]: https://scikit-learn.org/stable/auto_examples/linear_model/plot_ols_ridge.html

[^4]: https://www.stat.cmu.edu/~larry/=stat401/lecture-17.pdf

[^5]: https://github.com/scikit-learn/scikit-learn/issues/21254

[^6]: https://arxiv.org/pdf/1201.0490.pdf

[^7]: https://arxiv.org/pdf/1309.0238.pdf

[^8]: https://hastie.su.domains/ElemStatLearn/contents.pdf

[^9]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^10]: CONTENT_QUALITY_STANDARD.md

[^11]: AENS-Knowledge-Layer-Specification.md

[^12]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^13]: ARCHITECTURE_FREEZE.md

[^14]: https://academic.oup.com/ecco-jcc/article/doi/10.1093/ecco-jcc/jjaf231.461/8432519

[^15]: http://arxiv.org/pdf/1912.08198.pdf

[^16]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10106967/

[^17]: https://joss.theoj.org/papers/10.21105/joss.00124.pdf

[^18]: http://arxiv.org/pdf/1811.00542.pdf

[^19]: https://arxiv.org/html/2309.13420

[^20]: https://zenn.dev/seiwan/articles/sklearn_learn_1_1_1?locale=en

[^21]: https://zenn.dev/seiwan/articles/sklearn_learn_1_1_1

[^22]: https://scikit-learn.org/1.5/auto_examples/linear_model/plot_ols.html

[^23]: https://scikit-learn.org/stable/api/sklearn.linear_model.html

[^24]: https://github.com/christianversloot/machine-learning-articles/blob/main/performing-linear-regression-with-python-and-scikit-learn.md

[^25]: https://medium.com/@basics.machinelearning/linear-regression-in-scikit-learn-vs-statsmodel-74fb730b1877

[^26]: https://www.geeksforgeeks.org/machine-learning/ordinary-least-squares-and-ridge-regression-variance-in-scikit-learn/

[^27]: https://www.worldscientific.com/doi/abs/10.1142/S0217595919500167

[^28]: https://www.semanticscholar.org/paper/43f3bb750092273a9c3052449a2b3081c1dc3ed6

[^29]: https://www.semanticscholar.org/paper/4c9251f2a204580381ff6b8b9e13cba1ec9e5898

[^30]: https://pajols.org/volume-6-issue-2/603-2/

[^31]: https://www.semanticscholar.org/paper/1aa40183d74208f154970a616186bc95f722b369

[^32]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10241929/

[^33]: https://journal.nsps.org.ng/index.php/jnsps/article/download/664/148

[^34]: http://arxiv.org/pdf/2402.17103.pdf

[^35]: https://en.wikipedia.org/wiki/Ordinary_least_squares

[^36]: https://www.scribd.com/document/994174721/10

[^37]: https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/linear_model/_base.py

[^38]: https://scikit-learn.dev.org.tw/1.6/modules/generated/sklearn.linear_model.LinearRegression.html

[^39]: https://periodicos.fgv.br/public/journals/5/cover_article_1911_en_US.pdf

[^40]: https://www.scribd.com/document/808299736/Econometrics-I-chapter-3

