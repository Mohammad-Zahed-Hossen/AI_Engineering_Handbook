<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# K-Means Clustering

## 1. Decision Summary

K-Means is an iterative centroid-based clustering algorithm that partitions unlabeled data into $k$ compact clusters by minimizing within-cluster variance, with fast CPU-friendly optimization but strong sensitivity to scaling, initialization, and spherical-cluster assumptions.[^1][^2]

### Summary

K-Means clusters data by alternating assignment to the nearest centroid and centroid recomputation until convergence, optimizing a within-cluster sum-of-squares objective.[^2][^1]

### Best Use Cases

- Customer segmentation with continuous behavioral features and a known need for a small number of operational segments.[^3][^1]
- User behavior clustering for product analytics, cohort discovery, and feature flag targeting.[^1][^2]
- Feature engineering via cluster labels, centroid distances, or cluster memberships for downstream supervised models.[^2][^1]
- Image compression and vector quantization where compact centroid representations are useful.[^1][^2]


### Avoid When

- Clusters are arbitrarily shaped or lie on manifolds rather than around centroids.[^3][^1]
- Outliers are heavy and should not pull centroids toward anomalous points.[^3][^1]
- Cluster density or variance differs substantially across groups.[^2][^1]
- Features are categorical-only or Euclidean distance is not meaningful without transformation.[^1][^2]


### Strengths

- Extremely fast and scalable for large dense numeric datasets, especially with good initialization.[^2][^1]
- Simple operational output: centroid coordinates, labels, inertia, and nearest-centroid distance are easy to explain to stakeholders.[^1]
- Works well as a preprocessing step for segmentation, prototype selection, compression, and feature generation.[^2][^1]


### Limitations

- Requires specifying $k$, so the model depends on a prior choice that may not be obvious in production.[^1][^2]
- Converges to a local optimum and can vary across random starts, especially on sparse or noisy data.[^2][^1]
- Assumes Euclidean, roughly spherical, similarly sized clusters, which often fails on real-world nonconvex data.[^1][^2]


### Interpretability

Cluster centroids are the learned prototypes, cluster assignments are the discrete segment labels, and inertia measures total squared distance to each point’s assigned centroid.[^1]
Business interpretation usually comes from comparing centroid feature profiles and naming segments after dominant characteristics rather than treating labels as intrinsic categories.[^3][^1]

### Training Characteristics

Training uses Lloyd’s alternating optimization: assign points to the nearest centroid, then recompute centroids as cluster means, repeating until convergence.[^2][^1]
Initialization matters a lot; `k-means++` usually improves convergence quality over pure random seeding, while multiple restarts reduce the chance of poor local minima.[^1]
Convergence is monotonic in the objective but not guaranteed to find a global optimum.[^2][^1]

### Inference Characteristics

Prediction is a nearest-centroid assignment, so latency is typically very low and CPU-friendly.[^1]
Batch prediction is straightforward because distances can be computed efficiently over many samples at once.[^1]
Memory footprint is small compared with many alternative clustering methods, though `algorithm='elkan'` uses extra memory.[^1]

### Computational Characteristics

- Training: average $O(nki)$, where $n$ is samples, $k$ is clusters, and $i$ is iterations.[^1]
- Prediction: $O(nk p)$ for $n$ samples with $p$ features in the standard nearest-centroid computation.[^1]
- Memory usage: $O(kp)$ for centroids, plus extra workspace for some algorithms such as Elkan.[^1]
- Scalability: strong on large numeric datasets; for very large $n$, MiniBatchKMeans is often preferred.[^1]


## 2. Core Understanding

### Intuition \& Learning Mechanism

K-Means forms clusters by repeatedly assigning each point to the nearest centroid and then moving each centroid to the mean of the assigned points.[^2]
This is an alternating optimization loop that reduces within-cluster distance at each step until the objective stabilizes.[^2]
The output is a partition of the input space into Voronoi-like regions around centroids, which makes the model simple and deterministic after fitting.[^2][^1]

### Mathematical Intuition \& Formulation

Using Euclidean distance:

$$
d(x, \mu_j) = \|x - \mu_j\|_2
$$

where $\mu_j$ is the centroid of cluster $j$.[^2]

Within-Cluster Sum of Squares:

$$
\mathrm{WCSS} = \sum_{j=1}^{k}\sum_{x_i \in C_j}\|x_i - \mu_j\|_2^2
$$

Inertia in scikit-learn is the same squared-distance objective up to weighting details:

$$
J = \sum_{i=1}^{n}\|x_i - \mu_{c(i)}\|_2^2
$$

with $c(i)$ the assigned cluster index.[^2][^1]

Lloyd optimization alternates:

1. Assignment step: $c(i) := \arg\min_j \|x_i - \mu_j\|_2$
2. Update step: $\mu_j := \frac{1}{|C_j|}\sum_{x_i \in C_j} x_i$ [^2].

Convergence is reached when centroid movement falls below tolerance or `max_iter` is hit.[^1]

### Assumptions

- Approximately spherical clusters: violations lead to poor cluster boundaries and unstable centroids.[^2][^1]
- Similar cluster variance: large variance differences can cause K-Means to over-split broad clusters or underfit tight ones.[^1]
- Similar cluster size: strong imbalance can bias centroid placement toward larger groups.[^1]
- Euclidean distance is meaningful: if feature geometry does not match Euclidean distance, assignments become unreliable.[^2]
- Proper feature scaling: unscaled features dominate the distance calculation and distort clustering.[^3][^1]


### Complexity \& Memory Complexity

For $n$ samples, $p$ features, $k$ clusters, and $i$ iterations, the average training cost is $O(nkpi)$ in the fully vectorized dense case, with scikit-learn noting average complexity as $O(knT)$ and sparse or structured cases often behaving better in practice.[^1]
Memory is $O(kp)$ for centroids plus working buffers, with Elkan requiring additional $O(nk)$ space.[^1]

- Robustness: moderate to low; outliers, scaling errors, and initialization noise can materially move centroids.[^3][^1]
- Scalability: strong for numeric CPU workloads, weaker for very large dense datasets unless mini-batch methods are used.[^1]
- Overfitting Tendency: not a supervised overfitting issue, but overly large $k$ can fragment clusters and fit noise.[^2][^1]
- Bias-Variance: high bias, low variance after convergence when $k$ is small; variance rises with unstable initialization or excessive $k$.[^2][^1]


## 3. Hyperparameter Intelligence

### `n_clusters`

**Purpose**
Sets the number of centroids and therefore the number of output clusters.[^1]

**Effect of Increasing**

- Cluster quality: can reduce inertia and capture finer structure.
- Speed: slower.
- Memory: slightly higher due to more centroid storage.
- Stability: may decrease if clusters become too small or noisy.

**Effect of Decreasing**

- Cluster quality: can underfit true structure.
- Speed: faster.
- Memory: lower.
- Stability: often higher, but at the cost of coarser segmentation.

**Trade-offs**
More clusters improve granularity but increase computation and risk overfragmentation.[^2][^1]

**Tuning Priority \& Interactions**

- Priority: High.
- Interactions: strongly interacts with `init`, `n_init`, and `max_iter`.
- Practical tuning order: estimate a plausible range first, then validate with elbow and silhouette analysis.

**Common Mistakes**
Choosing $k$ only by habit or by business round numbers without validation.

### `init`

**Purpose**
Defines centroid initialization strategy such as `k-means++` or `random`.[^1]

**Effect of Increasing**

- Cluster quality: not a numeric monotonic direction, but better initialization usually improves quality.
- Speed: often faster convergence with `k-means++`.
- Memory: negligible.
- Stability: improves.

**Effect of Decreasing**

- Cluster quality: random initialization tends to be less reliable.
- Speed: may require more iterations.
- Memory: negligible.
- Stability: worsens.

**Trade-offs**
Better initialization usually costs little and pays off in faster, more stable convergence.[^2][^1]

**Tuning Priority \& Interactions**

- Priority: High.
- Interactions: works with `n_init`; random `init` usually benefits from more restarts.
- Practical tuning order: prefer `k-means++` unless you have a custom seeding strategy.

**Common Mistakes**
Using random initialization with too few restarts and blaming the dataset for unstable results.

### `n_init`

**Purpose**
Controls the number of independent runs with different initial seeds; the best inertia result is kept.[^1]

**Effect of Increasing**

- Cluster quality: usually improves or becomes more reliable.
- Speed: slower.
- Memory: slightly higher during repeated runs.
- Stability: improves.

**Effect of Decreasing**

- Cluster quality: more sensitive to bad local minima.
- Speed: faster.
- Memory: lower.
- Stability: worse.

**Trade-offs**
More restarts increase robustness against local minima at a direct runtime cost.[^2][^1]

**Tuning Priority \& Interactions**

- Priority: High.
- Interactions: most important when `init='random'` or data are noisy/sparse.
- Practical tuning order: use a higher value when clustering quality matters more than one-off fit time.

**Common Mistakes**
Leaving the default unchanged on difficult datasets and assuming one run is representative.

### `max_iter`

**Purpose**
Sets the maximum number of Lloyd iterations per run.[^1]

**Effect of Increasing**

- Cluster quality: may improve if convergence has not yet occurred.
- Speed: slower.
- Memory: unchanged.
- Stability: can improve if the model had not converged.

**Effect of Decreasing**

- Cluster quality: can stop too early and produce inconsistent labels and centroids.
- Speed: faster.
- Memory: unchanged.
- Stability: can worsen.

**Trade-offs**
Useful as a safety bound, but too small a value can truncate optimization before centroids stabilize.[^1]

**Tuning Priority \& Interactions**

- Priority: Medium.
- Interactions: works with `tol`; low tolerance may require more iterations.
- Practical tuning order: keep the default unless convergence diagnostics show premature stopping.

**Common Mistakes**
Reducing `max_iter` to save time without checking whether the final centroids are stable.

### `tol`

**Purpose**
Sets the relative tolerance for centroid movement to declare convergence.[^1]

**Effect of Increasing**

- Cluster quality: may stop earlier and slightly reduce quality.
- Speed: faster.
- Memory: unchanged.
- Stability: may decrease marginally.

**Effect of Decreasing**

- Cluster quality: may improve if the current solution was not stable.
- Speed: slower.
- Memory: unchanged.
- Stability: improves.

**Trade-offs**
Tighter tolerance improves convergence precision but may yield diminishing returns.[^1]

**Tuning Priority \& Interactions**

- Priority: Medium.
- Interactions: with `max_iter`, the two form the convergence budget.
- Practical tuning order: lower only when you need extra precision and can pay the runtime cost.

**Common Mistakes**
Setting tolerance so strict that runtime rises without meaningful cluster improvement.

### `algorithm`

**Purpose**
Chooses between `lloyd` and `elkan`; `elkan` can skip some distance computations but uses more memory.[^1]

**Effect of Increasing**

- Cluster quality: not directly improved by the algorithm choice.
- Speed: `elkan` can be faster on well-separated clusters.
- Memory: higher with `elkan`.
- Stability: similar, but depends on data geometry.

**Effect of Decreasing**

- Cluster quality: no direct effect.
- Speed: `lloyd` is often simpler and sometimes more predictable.
- Memory: lower with `lloyd`.
- Stability: similar.

**Trade-offs**
`elkan` trades extra memory for fewer distance computations, while `lloyd` is the classical default and more memory-light.[^1]

**Tuning Priority \& Interactions**

- Priority: Medium.
- Interactions: meaningful mainly with cluster separation and dataset size.
- Practical tuning order: start with `lloyd`; test `elkan` when clusters are well separated and memory is available.

**Common Mistakes**
Using `elkan` on memory-constrained systems without accounting for its extra $O(nk)$ workspace.[^1]

### `random_state`

**Purpose**
Fixes the random seed for reproducible centroid initialization and restart behavior.[^1]

**Effect of Increasing**

- Cluster quality: no direct systematic change.
- Speed: no meaningful change.
- Memory: no meaningful change.
- Stability: reproducibility improves.

**Effect of Decreasing**

- Cluster quality: no direct systematic change.
- Speed: no meaningful change.
- Memory: no meaningful change.
- Stability: reproducibility worsens.

**Trade-offs**
Does not improve the clustering objective by itself, but it is essential for experiment repeatability.[^1]

**Tuning Priority \& Interactions**

- Priority: High for production and experiment tracking.
- Interactions: affects `init` and `n_init` outcomes.
- Practical tuning order: always set it when comparing runs.

**Common Mistakes**
Treating different random seeds as model drift when they are just initialization variability.

### `copy_x`

**Purpose**
Controls whether the input data is copied before centering and distance computation.[^1]

**Effect of Increasing**

- Cluster quality: usually unchanged.
- Speed: may be slightly slower due to copying.
- Memory: higher.
- Stability: can improve numeric cleanliness.

**Effect of Decreasing**

- Cluster quality: usually unchanged.
- Speed: can be slightly better.
- Memory: lower if a copy is avoided.
- Stability: small numerical differences may appear.

**Trade-offs**
A memory-saving choice with a small risk of numerical differences; important mainly in constrained pipelines.[^1]

**Tuning Priority \& Interactions**

- Priority: Low.
- Interactions: can be overridden by data layout or sparse format requirements.
- Practical tuning order: leave default unless memory pressure is relevant.

**Common Mistakes**
Changing it to save memory without verifying whether the data layout still forces a copy.

## 4. Engineering Considerations

### Dataset Suitability

K-Means works best on numeric data with compact, separable structure and moderate feature dimensionality.[^2][^1]
Dense datasets are the most natural fit, though sparse inputs can work if Euclidean distances still make sense.[^1]
High-dimensional data often requires dimensionality reduction because distance concentration can weaken centroid quality.[^3]
If clusters are not roughly convex and similar in scale, another clustering method is often a better production choice.[^3][^1]

### Scalability \& Parallelization

K-Means is CPU-efficient and often benefits from vectorized linear algebra more than from complex parallel strategies.[^1]
MiniBatchKMeans is the standard alternative when scale becomes large enough that full batch updates are too slow.[^1]
For large-scale clustering, the main bottleneck is repeated distance computation against all centroids rather than centroid storage.[^1]
When throughput matters, batch scoring is usually easy to deploy because prediction is just nearest-centroid assignment.[^1]

### Computational Cost \& Memory Behavior

Memory consumption is dominated by storing centroids plus any algorithm-specific buffers.[^1]
The distance computation step is the primary runtime cost and scales with both the number of samples and clusters.[^2][^1]
Centroid storage is small, which makes serving and model distribution lightweight.[^1]
CPU utilization is typically predictable and friendly to standard production hosts.

### Robustness \& Sensitivity to Outliers

Outliers can drag centroids away from dense regions and distort cluster shapes, especially in Euclidean space.[^3][^1]
Noise increases cluster instability because the assignment step can flip points near cluster boundaries.[^1]
Initialization sensitivity is a real operational concern, which is why multiple restarts are often worth the cost.[^2][^1]
If your data has heavy contamination, a density-based or robust alternative is often safer.

### Feature Engineering Dependency \& Scaling Requirements

Feature scaling is mandatory in most practical cases because Euclidean distance is scale-sensitive and unscaled features dominate the objective.[^3][^1]
PCA before clustering can help when dimensionality is high or when correlated features make Euclidean distance noisy.[^3]
Feature selection can also improve clustering by removing irrelevant dimensions that inflate distances without adding structure.
For deployment, ensure the same preprocessing pipeline is used at training and inference time.

### Class Imbalance Behavior \& Pipeline Position

Class imbalance is not directly applicable because K-Means is unsupervised, but cluster-size imbalance still matters operationally.[^2][^1]
A few large clusters and many tiny clusters can be valid, but it can also signal poor scaling or a bad $k$ choice.
K-Means usually sits early in a pipeline as a preprocessing or segmentation step before supervised learning or downstream decision rules.[^1]
In production, cluster labels are often used as derived features rather than as final business decisions.

### Common Limitations

- Need to specify $k$, which is often the hardest engineering decision.[^2][^1]
- Local minima can produce inconsistent solutions across runs.[^2][^1]
- Euclidean distance assumption limits applicability to non-Euclidean or categorical feature spaces.[^3][^1]
- Poor performance on non-convex clusters is common because centroids cannot follow curved geometry.[^3][^1]
- Sensitivity to initialization means production results should be validated across seeds.[^1]


## 5. Comparisons

| Alternative Model | Choose K-Means When | Prefer Alternative When | Key Engineering Trade-offs |
| :-- | :-- | :-- | :-- |
| DBSCAN | You need fast centroid-based segmentation on numeric data [^1][^2]. | You need arbitrary-shaped clusters or explicit noise handling [^1][^3]. | K-Means is simpler and faster; DBSCAN handles outliers and shape better. |
| Hierarchical Clustering | You want a scalable partitioning baseline with fixed $k$ and cheap prediction [^1]. | You need a dendrogram or multi-resolution clustering structure [^1]. | K-Means is more scalable; hierarchical methods provide richer structure but cost more. |
| Gaussian Mixture Models (GMM) | You want hard assignments and a simple centroid interpretation [^1][^2]. | You need soft probabilistic cluster memberships and ellipsoidal clusters [^1]. | K-Means is cheaper; GMM is more expressive but heavier. |
| Spectral Clustering | You need a fast, direct baseline for large numeric data [^1]. | You have non-convex structure that requires graph-based separation [^1]. | K-Means is operationally simpler; spectral methods capture complex geometry better. |
| Mean Shift | You know $k$ in advance and want predictable runtime [^1]. | You want automatic cluster-count discovery from density modes [^1]. | K-Means is cheaper and more controllable; Mean Shift is more flexible but slower. |
| Birch | You need straightforward batch clustering with a compact final model [^1]. | You need incremental, very large-scale clustering with hierarchical compression [^1]. | K-Means is simpler; Birch is better for streaming or huge datasets. |

## 6. Related Knowledge

### Related Models

- MiniBatchKMeans.
- BisectingKMeans.
- GaussianMixture.
- AgglomerativeClustering.
- DBSCAN.[^3][^1]


### Alternative Models

- DBSCAN.
- Hierarchical Clustering.
- Gaussian Mixture Models.
- Spectral Clustering.
- Mean Shift.
- Birch.[^1]


### Related Principles

- Distance Metrics.
- Cluster Validity.
- Elbow Method.
- Silhouette Analysis.
- Curse of Dimensionality.[^3][^1]


### Related Workflows

- Clustering Workflow.
- Customer Segmentation.
- Exploratory Data Analysis.
- Feature Engineering.
- Dimensionality Reduction.[^3][^1]


### Related Patterns \& Guides

- PCA Pipeline.
- Feature Scaling Pattern.
- Cluster Evaluation Guide.
- Unsupervised Learning Workflow.
- Data Preprocessing Guide.[^3][^1]


### Related Packages

- scikit-learn.
- SciPy.
- NumPy.
- Yellowbrick.
- HDBSCAN.[^1]


## 7. Quick Start

### Language

Python

### Implementation Package

scikit-learn

### Code

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from sklearn.datasets import make_blobs

X_num, _ = make_blobs(n_samples=1200, centers=4, cluster_std=1.35, random_state=42)
df = pd.DataFrame(X_num, columns=["f1", "f2"])

preprocess = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ]), ["f1", "f2"]),
])

X = df.copy()

elbow_inertia = []
silhouette_vals = []
k_values = range(2, 11)

X_processed = preprocess.fit_transform(X)

for k in k_values:
    km = KMeans(n_clusters=k, init="k-means++", n_init=10, random_state=42, algorithm="lloyd")
    labels = km.fit_predict(X_processed)
    elbow_inertia.append(km.inertia_)
    silhouette_vals.append(silhouette_score(X_processed, labels))

param_grid = {
    "cluster__n_clusters": [3, 4, 5, 6],
    "cluster__init": ["k-means++", "random"],
    "cluster__n_init": [^10],
    "cluster__max_iter": [^300],
    "cluster__tol": [1e-4],
    "cluster__algorithm": ["lloyd"],
    "cluster__random_state": [^42],
}

pipe = Pipeline([
    ("preprocess", preprocess),
    ("cluster", KMeans(random_state=42)),
])

grid = GridSearchCV(
    pipe,
    param_grid=param_grid,
    scoring="silhouette_score",
    cv=[(slice(None), slice(None))],
    refit=True,
    n_jobs=-1
)

def silhouette_scorer(estimator, X_eval, y=None):
    Xt = estimator.named_steps["preprocess"].transform(X_eval)
    labels = estimator.named_steps["cluster"].fit_predict(Xt)
    return silhouette_score(Xt, labels)

grid.scoring = silhouette_scorer
grid.fit(X)

best_model = grid.best_estimator_
X_best = best_model.named_steps["preprocess"].transform(X)
best_labels = best_model.named_steps["cluster"].fit_predict(X_best)

sil = silhouette_score(X_best, best_labels)
dbi = davies_bouldin_score(X_best, best_labels)
chi = calinski_harabasz_score(X_best, best_labels)

print("Best params:", grid.best_params_)
print("Silhouette:", sil)
print("Davies-Bouldin:", dbi)
print("Calinski-Harabasz:", chi)
print("Inertia:", best_model.named_steps["cluster"].inertia_)
print("Cluster centers:\n", best_model.named_steps["cluster"].cluster_centers_)

plt.figure(figsize=(7, 4))
plt.plot(list(k_values), elbow_inertia, marker="o")
plt.xlabel("k")
plt.ylabel("Inertia")
plt.title("Elbow Method")
plt.tight_layout()
plt.savefig("elbow_method.png", dpi=160)

plt.figure(figsize=(7, 4))
plt.plot(list(k_values), silhouette_vals, marker="o")
plt.xlabel("k")
plt.ylabel("Silhouette Score")
plt.title("Silhouette Evaluation")
plt.tight_layout()
plt.savefig("silhouette_evaluation.png", dpi=160)
```


### Explanation

This pipeline imputes missing values, scales numeric features, and runs K-Means inside a reproducible scikit-learn workflow.[^1]
It also computes inertia across several $k$ values for the elbow method and uses silhouette scoring to compare candidate cluster counts.[^3][^1]

### Inputs

A numeric tabular dataset, ideally with scaled continuous features and a reasonably compact cluster structure.[^2][^1]

### Outputs

Cluster labels, cluster centers, inertia, silhouette score, Davies-Bouldin score, and Calinski-Harabasz score, plus elbow and silhouette plots.[^1]

### Notes

Feature scaling is essential because distance calculations are scale-sensitive and K-Means uses Euclidean geometry.[^3][^1]
`GridSearchCV` is not always ideal for clustering because there is no ground-truth target, so custom unsupervised scorers like silhouette are usually required.[^1]
Initialization strategy matters, so prefer `k-means++` first and use `random_state` for reproducibility.[^1]
For production, validate stability across multiple seeds and compare metrics, not just inertia.[^3][^2][^1]

## 8. Curated External Resources

| Title | URL | Type | Why to Read | Expected Outcome | Reading Time (integer minutes) | Notes for Perplexity |
| :-- | :-- | :-- | :-- | :-- | --: | :-- |
| scikit-learn KMeans API | [scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html) | documentation | Canonical parameter, attribute, and complexity reference [^1]. | Understand exact scikit-learn behavior and defaults. | 20 | Best first source for production implementation details. |
| Stanford CS229: The k-means clustering algorithm | [cs229.stanford.edu/notes2020spring/cs229-notes7a.pdf](https://cs229.stanford.edu/notes2020spring/cs229-notes7a.pdf) | guide | Clear derivation of Lloyd’s algorithm and local-optimum behavior [^2]. | Reinforce the optimization loop and convergence intuition. | 25 | Strong academic reference. |
| CS229 clustering lecture notes | [cs229.stanford.edu/notes2022fall/kmeans.pdf](https://cs229.stanford.edu/notes2022fall/kmeans.pdf) | guide | Practical clustering framing and assignment/update loop [^3]. | Understand how K-Means is presented in a Stanford ML course. | 20 | Useful for intuition and assumptions. |
| The Elements of Statistical Learning, Chapter on Unsupervised Learning | [](https://danhalligan.github.io/ISLRv2-solutions/unsupervised-learning.html) | guide | Broad unsupervised learning context and model comparison framing [^4]. | Place K-Means within the unsupervised learning toolbox. | 30 | Good for conceptual adjacency and alternatives. |
| Stanford CS229 lecture video on clustering | [youtube.com](https://www.youtube.com/) | video | A lecture-style reinforcement resource for the algorithm and its trade-offs. | Build a durable mental model of centroid-based clustering. | 40 | Choose an official Stanford lecture upload when using this slot. |

<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html

[^2]: https://cs229.stanford.edu/notes2020spring/cs229-notes7a.pdf

[^3]: https://cs229.stanford.edu/notes2022fall/kmeans.pdf

[^4]: https://danhalligan.github.io/ISLRv2-solutions/unsupervised-learning.html

[^5]: https://www.semanticscholar.org/paper/ad4fd2c149f220a62441576af92a8a669fe81246

[^6]: https://www.semanticscholar.org/paper/7fd672653caaf3876b7fea945c65b250eeaad912

[^7]: https://www.semanticscholar.org/paper/7d4fd750d87ab72a0efdaa83e74d06f13597cd60

[^8]: http://sitito.cs.msu.ru/index.php/SITITO/article/view/1057

[^9]: https://www.semanticscholar.org/paper/e60d730228a51a5390dfb559c14427c11f7e1205

[^10]: https://journal.ilmudata.co.id/index.php/RIGGS/article/view/3879

[^11]: https://www.semanticscholar.org/paper/c162fb5f54dae3689908fe1b2615fa680172f9b5

[^12]: https://ieeexplore.ieee.org/document/11368433/

[^13]: https://cs229.stanford.edu/proj2014/Alfred Xue, Colin Wei, KMeansSL.pdf

[^14]: https://cs229.stanford.edu/main_notes.pdf

[^15]: https://github.com/davrot/pytutorial/blob/main/scikit-learn/kmeans/README.md

[^16]: https://dev.to/bijenpatel/islr-chapter-10-unsupervised-learning-2gpe

[^17]: https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/cluster/_kmeans.py

[^18]: https://deep-learning-study.tistory.com/815

