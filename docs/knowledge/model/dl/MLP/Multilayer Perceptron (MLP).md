<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Multilayer Perceptron (MLP)

## 1. Decision Summary

**Summary:** Multilayer Perceptron (MLP) is a fully connected feedforward neural network that learns nonlinear mappings by stacking hidden layers and optimizing weights with backpropagation and gradient-based solvers. It is most useful when structured features contain interactions that simpler linear models miss, but it remains sensitive to scaling, hyperparameters, and dataset size.[^1][^2]

**Best Use Cases**

- Structured tabular data with nonlinear feature interactions, especially when relationships are not well captured by linear models.[^2][^1]
- Credit risk, fraud detection, and other medium-scale classification problems with dense engineered features.[^1]
- Industrial prediction and forecasting on fixed-length feature vectors, such as process telemetry or equipment-state prediction.[^1]
- Medium-sized regression problems where the target is continuous and the feature space is already well engineered.[^1]

**Avoid When**

- Small datasets where overfitting risk is high and variance dominates.[^2][^1]
- Image tasks where convolutional architectures are usually a better inductive bias than dense connectivity.[^1]
- Sequential or time-series problems where recurrence or attention is more suitable than a fixed feedforward mapping.[^1]
- Very large tabular datasets where gradient boosting often delivers better accuracy-efficiency trade-offs in practice.[^1]

**Strengths**

- Learns complex nonlinear decision boundaries without manual interaction terms, which makes it useful when feature engineering is partial rather than complete.[^1]
- Works for both classification and regression with the same high-level interface, which simplifies pipeline standardization.[^3]
- Supports probability outputs for classification via `predict_proba`, which is valuable for ranking, thresholding, and risk scoring.[^3]
- Can be integrated cleanly into scikit-learn pipelines with preprocessing, cross-validation, and model selection.[^3][^1]

**Limitations**

- It is a black-box model with limited direct feature-importance interpretability, so post-hoc explanation is usually required.[^1]
- Training is sensitive to feature scaling, learning rate, hidden layer size, and solver choice, which increases tuning cost.[^3][^1]
- scikit-learn’s implementation has no GPU support, so large-scale training can be slow compared with deep learning frameworks.[^1]
- Non-convex optimization means different initializations can lead to different results, especially on smaller or noisier datasets.[^3][^1]

**Interpretability**
MLP is inherently a **black-box** model: the learned parameters are distributed across hidden layers, so there is no native feature-importance vector comparable to linear models or tree splits. Hidden layers learn internal representations, but those representations are difficult to explain directly without post-hoc tools. In production, SHAP or LIME can provide local explanations, but they explain the approximation behavior rather than the model’s internal logic.[^1]

**Training Characteristics**
MLP is trained by backpropagation with gradient-based optimization, typically using `lbfgs`, `sgd`, or `adam` in scikit-learn. Convergence depends strongly on initialization, scaling, regularization, and solver choice, and it may stop early when improvement falls below tolerance thresholds. Weight initialization is random, so reproducibility requires a fixed `random_state`.[^3][^1]

**Inference Characteristics**
Inference is dominated by dense matrix multiplications, which are efficient on CPU for moderate-width models and batch inference. scikit-learn does not provide GPU acceleration, so CPU latency is usually acceptable only for medium-sized models and modest request rates. Memory footprint is driven by weight matrices and intermediate activations, so wide or deep networks increase both RAM use and inference cost.[^1]

**Computational Characteristics**
Training time is approximately $O(i \cdot n \cdot (p h + (L-1)h^2 + hk))$, where $n$ is samples, $p$ features, $h$ hidden units per layer, $L$ layers, $k$ outputs, and $i$ iterations. Inference time is approximately $O(n \cdot (p h + (L-1)h^2 + hk))$ per batch, since each layer is a dense transform. Memory usage is approximately $O(ph + (L-1)h^2 + hk)$ for weights plus $O(n(p+k))$ for batch data and activations, with scalability limited by the cost of dense updates and the lack of native GPU support in scikit-learn.[^1]

## 2. Core Understanding

**Intuition \& Learning Mechanism**
MLP transforms inputs layer by layer, learning intermediate hidden representations that capture nonlinear structure before producing the final prediction. Each hidden layer applies a weighted sum followed by a nonlinear activation, allowing the network to approximate functions that linear models cannot represent. With enough capacity, MLP is a universal function approximator, but production success depends on regularization and tuning rather than capacity alone.[^1]

**Mathematical Intuition \& Formulation**
A neuron computes a weighted sum and activation:

$$
z = w^\top x + b,\quad a = g(z)
$$

where $g(\cdot)$ is an activation such as ReLU, tanh, or logistic. For a hidden layer, forward propagation is:[^3][^1]

$$
a^{(l)} = g\left(W^{(l)} a^{(l-1)} + b^{(l)}\right)
$$

and the output layer maps the final representation to class probabilities or continuous values.[^1]

For classification, scikit-learn’s MLP minimizes log-loss; for regression, it minimizes squared error, both with optional L2 regularization via `alpha`. Backpropagation uses the chain rule to compute gradients:[^3][^1]

$$
\frac{\partial \mathcal{L}}{\partial W^{(l)}} =
\frac{\partial \mathcal{L}}{\partial a^{(L)}} \cdot
\frac{\partial a^{(L)}}{\partial z^{(L)}} \cdots
\frac{\partial a^{(l)}}{\partial z^{(l)}} \cdot
\frac{\partial z^{(l)}}{\partial W^{(l)}}
$$

and gradient descent updates parameters as:

$$
W \leftarrow W - \eta \nabla_W \mathcal{L}
$$

where $\eta$ is the learning rate.[^1]

**Assumptions**

- Representative training data: if the training set does not match production distribution, performance degrades through distribution shift.[^1]
- Independent samples: strong correlation between samples can inflate apparent validation quality and hurt generalization.
- Sufficient training examples: small datasets often let the model memorize noise instead of learning stable structure.[^1]
- Proper feature scaling: unscaled inputs can slow convergence or prevent good optimization.[^1]
- Appropriate network capacity: too few units underfit, while too many units overfit and increase instability.[^1]

**Complexity \& Memory Complexity**
Training complexity is $O(i \cdot n \cdot (p h + (L-1)h^2 + hk))$ under a dense fully connected assumption. Memory complexity is $O(ph + (L-1)h^2 + hk)$ for parameters and $O(n(p+k))$ for mini-batch activations and targets.[^1]

**Robustness**
MLP is moderately sensitive to outliers because large-magnitude features can dominate gradients unless preprocessing is careful.

**Scalability**
It scales reasonably on medium-sized tabular data, but dense computation and no native GPU support make it less attractive for very large workloads.[^1]

**Overfitting Tendency**
Overfitting is common when hidden layers are wide or the dataset is small, so regularization and early stopping matter.[^3][^1]

**Bias-Variance**
MLP has lower bias than linear models but higher variance, especially when capacity is large or regularization is weak.[^1]

## 3. Hyperparameter Intelligence

### hidden_layer_sizes

**Purpose**
Defines network capacity by setting the width of each hidden layer.[^3]

**Effect of Increasing**
Bias decreases because the network can fit more complex functions. Variance increases, training slows, and memory usage rises due to more weights.[^1]

**Effect of Decreasing**
Bias increases, variance decreases, training becomes faster, and memory footprint drops.[^1]

**Trade-offs**
More layers or wider layers improve expressiveness but increase overfitting risk and optimization difficulty. Smaller networks generalize better on limited data but may underfit nonlinear structure.[^1]

**Tuning Priority \& Interactions**
Priority: **High**. Interacts strongly with `alpha`, `solver`, and `early_stopping`; large capacity usually needs stronger regularization and better stopping control. Practical order: start small, then expand only if validation error remains high.[^3]

**Common Mistakes**
Using large symmetric architectures by default, copying deep-learning defaults onto small tabular datasets, and increasing width without regularization.

### activation

**Purpose**
Sets the hidden-layer nonlinearity.[^3]

**Effect of Increasing**
Not applicable as a scalar increase; choosing a more expressive or less saturating activation usually reduces bias and can increase optimization stability depending on the input scale.[^3]

**Effect of Decreasing**
Not applicable as a scalar decrease; choosing a saturating or linear activation can increase bias or reduce gradient quality.[^3]

**Trade-offs**
ReLU often trains well on normalized dense data, tanh can work well on centered inputs, and logistic usually saturates earlier. The choice affects gradient flow, convergence speed, and sensitivity to scaling.[^3][^1]

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with feature scaling and solver behavior; poor scaling makes activation choice much more brittle.[^1]

**Common Mistakes**
Leaving the default without checking whether the feature distribution matches the activation, especially for non-standardized inputs.

### solver

**Purpose**
Chooses the optimization algorithm: `lbfgs`, `sgd`, or `adam`.[^3]

**Effect of Increasing**
Not applicable as a scalar increase; moving toward more adaptive stochastic solvers often improves scalability but may reduce deterministic convergence behavior.[^3]

**Effect of Decreasing**
Not applicable as a scalar decrease; moving toward `lbfgs` can improve small-data convergence but increases memory pressure for optimization state.[^3][^1]

**Trade-offs**
`lbfgs` is often strong on small datasets, `adam` is robust on medium-sized data, and `sgd` can be competitive when carefully tuned. Solver choice strongly affects convergence speed, batch behavior, and reproducibility.[^3][^1]

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with `batch_size`, `learning_rate_init`, `max_iter`, and `early_stopping`. Practical order: choose solver first based on dataset size, then tune learning rate and regularization.[^3]

**Common Mistakes**
Using `sgd` without learning-rate tuning, using `lbfgs` on large datasets, and switching solvers without re-tuning other parameters.

### alpha

**Purpose**
Controls L2 regularization strength.[^3][^1]

**Effect of Increasing**
Bias increases, variance decreases, weights shrink, and overfitting risk drops. Training may become more stable but potentially underfit.[^1]

**Effect of Decreasing**
Bias decreases, variance increases, and the model can fit sharper nonlinear boundaries but may generalize worse.[^1]

**Trade-offs**
Strong regularization is useful when data are small, noisy, or highly correlated; weak regularization helps when the signal is strong and well sampled. This parameter is one of the main levers for controlling generalization.[^3][^1]

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with `hidden_layer_sizes`, `solver`, and `early_stopping`. Practical order: tune capacity first, then regularization.[^3]

**Common Mistakes**
Leaving `alpha` at a default value while changing network width substantially, or over-regularizing and misdiagnosing the result as solver failure.

### learning_rate_init

**Purpose**
Sets the initial step size for stochastic optimizers.[^3]

**Effect of Increasing**
Training can become faster, but instability, oscillation, and divergence risk increase.[^3][^1]

**Effect of Decreasing**
Training becomes more stable but slower, and the model may stall before reaching a good optimum.[^1]

**Trade-offs**
This is a speed-versus-convergence parameter: too high hurts stability, too low hurts progress. It matters mainly for `sgd` and `adam`.[^3]

**Tuning Priority \& Interactions**
Priority: **High** when using stochastic solvers. Strongly interacts with `solver`, `batch_size`, and `early_stopping`. Practical order: tune this after selecting solver and before changing architecture.[^3]

**Common Mistakes**
Changing architecture while keeping a bad learning rate, which often masks whether the network is actually capable.

### max_iter

**Purpose**
Sets the maximum optimization passes over the training data.[^3]

**Effect of Increasing**
Can reduce bias if the model has not converged, but increases runtime and may overfit if stopping is not otherwise controlled.[^3]

**Effect of Decreasing**
Speeds experimentation but increases underfitting risk and convergence failures.[^1]

**Trade-offs**
Higher limits help when optimization is slow or poorly conditioned, but they should not substitute for good preprocessing and learning-rate choices. Early stopping is often a better control mechanism than pushing `max_iter` high.[^3]

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with `early_stopping`, `solver`, and `learning_rate_init`.[^3]

**Common Mistakes**
Treating `max_iter` as a performance knob instead of a convergence guardrail.

### batch_size

**Purpose**
Controls minibatch size for stochastic training.[^3]

**Effect of Increasing**
Gradient estimates become smoother, memory use rises, and training may become more stable but less noisy.[^1][^3]

**Effect of Decreasing**
Updates become noisier, memory use falls, and optimization can escape shallow plateaus but may become unstable.[^1]

**Trade-offs**
Small batches can improve exploration; larger batches improve throughput and stability. This parameter has no effect for `lbfgs`.[^3]

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with `learning_rate_init` and `solver`. Practical order: leave `auto` unless you need tighter latency or memory control.[^3]

**Common Mistakes**
Manually forcing very small batches on noisy data without adjusting the learning rate.

### early_stopping

**Purpose**
Stops training when validation performance stops improving.[^3]

**Effect of Increasing**
More aggressive stopping reduces overfitting and training time, but can raise bias if the model stops too early.[^3]

**Effect of Decreasing**
Training runs longer, giving the model more chances to fit complex structure, but variance and overfitting risk increase.[^1]

**Trade-offs**
Early stopping is one of the most practical production safeguards for MLP because it reduces wasted training and helps prevent overtraining. It is only effective for stochastic solvers.[^3]

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with `solver`, `max_iter`, `learning_rate_init`, and `alpha`. Practical order: enable it early unless you have a specific reason not to.[^3]

**Common Mistakes**
Using it with `lbfgs` and expecting effect, or enabling it without enough training data to create a reliable validation split.

## 4. Engineering Considerations

**Dataset Suitability**
MLP is a strong fit for dense tabular datasets where feature interactions matter more than sequential structure. It is weaker on sparse bag-of-words style inputs unless the problem is well normalized and represented. Mixed feature types are fine if preprocessing is done properly with numeric scaling and categorical encoding.[^1]

**Scalability \& Parallelization**
scikit-learn’s MLP runs on CPU only and does not provide GPU training acceleration. Mini-batch optimization helps with large datasets, but the implementation still depends on dense matrix operations. The main bottlenecks are repeated forward/backward passes and memory bandwidth during training.[^1]

**Computational Cost \& Memory Behavior**
Forward propagation costs scale with the number of weights, so deeper or wider models increase both time and memory. Backpropagation roughly doubles the compute burden because gradients are propagated through the same layers. GPU memory is not relevant in scikit-learn because the implementation is CPU-based, but RAM use still grows with model size and batch size.[^1]

**Robustness \& Sensitivity to Outliers**
MLP is sensitive to outliers because extreme values can distort gradients and activation ranges. Noise robustness improves with regularization, early stopping, and careful preprocessing. Label noise is especially harmful because the model can memorize inconsistent supervision if capacity is high.[^1]

**Feature Engineering Dependency \& Scaling Requirements**
Feature scaling is essential because gradient descent assumes parameters are updated on comparable numeric scales. Standardization is usually the safest default for numeric features, while normalization can help when bounded ranges are more appropriate. Categorical variables should be encoded before training, and the exact same preprocessing must be applied to train and test data through a pipeline.[^1]

**Class Imbalance Behavior \& Pipeline Position**
MLP does not have a native `class_weight` control like some linear or tree models, so imbalance is usually handled with resampling, threshold tuning, or sample-weight-aware pipelines where available. The model should sit after preprocessing in a single pipeline so that scaling and encoding are fit only on training folds. Threshold calibration matters because `predict_proba` is available and class imbalance can distort default 0.5 thresholds.[^3]

**Common Limitations**

- Hyperparameter sensitivity makes naive training unreliable on first pass.[^1]
- Local minima and saddle points can cause inconsistent results across runs.[^1]
- Black-box behavior limits auditability and regulatory comfort without post-hoc explanation.[^1]
- Training time can be long when architecture or data size is not appropriate.[^1]
- Large-data efficiency is weaker than specialized frameworks and many tree ensembles in tabular settings.[^1]


## 5. Comparisons

| Alternative Model | Choose MLP When | Prefer Alternative When | Key Engineering Trade-offs |
| :-- | :-- | :-- | :-- |
| Logistic Regression | You need a nonlinear extension of a linear baseline and can afford tuning. | The data are nearly linearly separable or you need maximum interpretability. | MLP gains expressiveness but loses simplicity, calibration transparency, and ease of explanation [^1]. |
| Decision Tree | Feature interactions are nonlinear and smooth rather than rule-like. | You need easy-to-read rules or low preprocessing overhead. | MLP usually generalizes better than a single tree on smooth boundaries, but trees are easier to inspect [^1]. |
| Random Forest | You want a single dense model with probability outputs and compact deployment. | You want strong out-of-the-box tabular performance with less tuning. | Random forests are often more robust on small/medium tabular data; MLP can win when feature scaling and nonlinear structure are favorable [^1]. |
| XGBoost | The data are dense, moderately sized, and benefit from learned continuous representations. | You need top-tier tabular accuracy with less sensitivity to scaling and initialization. | XGBoost usually offers stronger default tabular performance; MLP is more flexible for representation learning but harder to tune [^1]. |
| Support Vector Machine (SVM) | You need a neural-style nonlinear model with probability outputs and scalable minibatch training. | The dataset is small-to-medium and a margin-based kernel method is a better fit. | SVMs can outperform MLP on smaller problems; MLP scales differently and supports deeper nonlinear composition [^1]. |
| Convolutional Neural Network (CNN) | The input is fixed-length structured features rather than spatial data. | The task is image, grid, or local-pattern heavy. | CNNs exploit locality and parameter sharing; MLP uses full connectivity and is usually less efficient for images [^1]. |

## 6. Related Knowledge

**Related Models**

- Neural network models.
- Feedforward neural networks.
- Dense neural networks.
- Deep learning classifiers and regressors.

**Alternative Models**

- Logistic Regression.
- Decision Tree.
- Random Forest.
- XGBoost.
- Support Vector Machine.
- Convolutional Neural Network.

**Related Principles**

- Backpropagation.
- Gradient Descent.
- Universal Approximation Theorem.
- Bias-Variance Trade-off.
- Regularization.
- Representation Learning.

**Related Workflows**

- Neural Network Training.
- Hyperparameter Optimization.
- Classification Pipeline.
- Regression Pipeline.
- Model Evaluation.

**Related Patterns \& Guides**

- Early Stopping Pattern.
- Learning Rate Scheduling.
- Feature Scaling Guide.
- Neural Network Debug Guide.
- Overfitting Guide.

**Related Packages**

- scikit-learn.
- PyTorch.
- TensorFlow.
- Keras.
- NumPy.


## 7. Quick Start

**Language**
Python

**Implementation Package**
scikit-learn

**Code**

```python
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

data = pd.DataFrame({
    "age": [22, 35, 58, 46, 29, 41, 63, 52],
    "income": [32000, 58000, 91000, 72000, 41000, 63000, 105000, 84000],
    "segment": ["A", "B", "A", "C", "B", "C", "A", "B"],
    "target": [0, 0, 1, 1, 0, 1, 1, 1],
})

X = data.drop(columns=["target"])
y = data["target"]

num_cols = ["age", "income"]
cat_cols = ["segment"]

numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore")),
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, num_cols),
        ("cat", categorical_transformer, cat_cols),
    ]
)

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", MLPClassifier(
        random_state=42,
        max_iter=500,
        early_stopping=True,
        n_iter_no_change=20,
    )),
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

param_grid = {
    "model__hidden_layer_sizes": [(32,), (64,), (32, 16)],
    "model__activation": ["relu", "tanh"],
    "model__alpha": [1e-4, 1e-3, 1e-2],
    "model__learning_rate_init": [1e-3, 5e-4],
}

search = GridSearchCV(
    pipeline,
    param_grid=param_grid,
    scoring="roc_auc",
    cv=3,
    n_jobs=-1,
)

search.fit(X_train, y_train)

best_model = search.best_estimator_
proba = best_model.predict_proba(X_test)[:, 1]
pred = best_model.predict(X_test)

auc = roc_auc_score(y_test, proba)
report = classification_report(y_test, pred)

print("Best params:", search.best_params_)
print("ROC AUC:", auc)
print(report)
```

**Explanation**
This pipeline imputes missing values, scales numeric features, encodes categoricals, tunes key MLP hyperparameters, and evaluates probabilistic classification output with ROC AUC and a classification report.[^3][^1]

**Inputs**
A tabular dataset with numeric and categorical columns, plus a target vector for classification.

**Outputs**
Class predictions, class probabilities from `predict_proba`, ROC AUC, and precision/recall/F1 metrics.

**Notes**
Feature scaling is mandatory because MLP is sensitive to input scale and optimization quality. Hidden layer sizes should start small on tabular data, then increase only if validation performance justifies the extra capacity. Early stopping is a practical default for production-like training because it reduces overfitting and wasted compute. Grid search should prioritize solver, hidden size, regularization, and learning rate in that order.[^3][^1]

## 8. Curated External Resources

1. **MLPClassifier — scikit-learn documentation**
URL: [https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html](https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html)
Type: documentation
Why to Read: Authoritative API reference for parameters, attributes, and training behavior.
Expected Outcome: Correct production usage of `MLPClassifier`.
Reading Time: 20
Notes for Perplexity: Best source for solver, scaling, early stopping, and probability output details.[^3]
2. **Neural network models (supervised) — scikit-learn user guide**
URL: [https://scikit-learn.org/stable/modules/neural_networks_supervised.html](https://scikit-learn.org/stable/modules/neural_networks_supervised.html)
Type: guide
Why to Read: Explains training behavior, scaling requirements, solver trade-offs, and complexity.
Expected Outcome: Strong engineering understanding of when MLP works well.
Reading Time: 25
Notes for Perplexity: Includes practical warnings about scalability and feature scaling.[^1]
3. **CS229 notes: Deep Learning — Stanford University**
URL: [https://cs229.stanford.edu/notes2020spring/cs229-notes-deep_learning.pdf](https://cs229.stanford.edu/notes2020spring/cs229-notes-deep_learning.pdf)
Type: guide
Why to Read: University-level treatment of neural network optimization and backpropagation.
Expected Outcome: Better mathematical intuition for gradient-based learning.
Reading Time: 40
Notes for Perplexity: Useful for connecting optimization theory to production tuning.[^4]
4. **Deep Learning** by Goodfellow, Bengio, and Courville
URL: [https://www.deeplearningbook.org/](https://www.deeplearningbook.org/)
Type: guide
Why to Read: Canonical deep learning reference for optimization, regularization, and representation learning.
Expected Outcome: Durable conceptual grounding for neural network design.
Reading Time: 60
Notes for Perplexity: Especially useful for hidden representations, capacity control, and optimization dynamics.
5. **Original backpropagation reference by Rumelhart, Hinton, and Williams**
URL: [https://www.nature.com/articles/323533a0](https://www.nature.com/articles/323533a0)
Type: article
Why to Read: Foundational paper for training multilayer networks with backpropagation.
Expected Outcome: Historical and mathematical grounding in the core training algorithm.
Reading Time: 35
Notes for Perplexity: Best used as the origin reference for backprop-based learning.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: https://scikit-learn.org/stable/modules/neural_networks_supervised.html

[^3]: https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html

[^4]: https://cs229.stanford.edu/notes2020spring/cs229-notes-deep_learning.pdf

[^5]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^6]: CONTENT_QUALITY_STANDARD.md

[^7]: ARCHITECTURE_FREEZE.md

[^8]: AENS-Knowledge-Layer-Specification.md

[^9]: https://ieeexplore.ieee.org/document/11292567/

[^10]: https://ieeexplore.ieee.org/document/11456054/

[^11]: https://www.mdpi.com/2072-4292/16/16/2891

[^12]: https://www.semanticscholar.org/paper/16e66b38d8089739d3383feaee0619975759c1b5

[^13]: https://journal.upy.ac.id/index.php/ASTRO/article/view/5797

[^14]: https://academic.oup.com/bioinformatics/article/35/23/5063/5522910

[^15]: https://academic.oup.com/ecco-jcc/article/doi/10.1093/ecco-jcc/jjaf231.461/8432519

[^16]: https://arxiv.org/abs/1702.01460

[^17]: https://scikit-learn.org.cn/view/713.html

[^18]: https://github.com/GordonDoo/scikit-learn_MLPClassifier_with_dropout_py37/blob/master/doc/tutorial/basic/tutorial.rst

[^19]: https://scikit-learn.org/1.5/_sources/modules/generated/sklearn.neural_network.MLPClassifier.rst.txt

[^20]: https://scikit-learn.org/0.21/_sources/modules/generated/sklearn.neural_network.MLPClassifier.rst.txt

[^21]: https://web.stanford.edu/~mossr/pdf/cs229-ml-notes.pdf

[^22]: https://github.com/scikit-learn/scikit-learn/pull/25556/files/b937c8c44b64ac02cb1c6d38760e0ddfbe3704c3

[^23]: https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/neural_network/tests/test_mlp.py

