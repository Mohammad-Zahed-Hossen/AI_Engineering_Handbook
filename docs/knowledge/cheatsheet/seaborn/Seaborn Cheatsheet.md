<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Seaborn Cheatsheet

## Metadata

- **id:** seaborn_cheatsheet
- **title:** Seaborn Cheatsheet
- **slug:** seaborn-cheatsheet
- **name:** Seaborn Cheatsheet
- **description:** High-density syntax recall for Seaborn 0.13.2 focused on common engineering workflows, modern APIs, and copy-paste-ready plotting patterns.[^1]
- **package_reference:** Seaborn Package Reference
- **version:** 0.13.2
- **sources:** [seaborn API reference](https://seaborn.pydata.org/api.html), [Seaborn example gallery](https://seaborn.pydata.org/examples/index.html), [Seaborn package reference](file:1)
- **created_at:** 2026-07-06
- **updated_at:** 2026-07-06


## Setup

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Install Seaborn for production plotting. | You need a stable, documented Seaborn install. | ```python |  |  |  |

# pip install seaborn

# conda install seaborn -c conda-forge

import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

``` | Use the pinned stable release line for consistency. Seaborn 0.13.2 is the documented stable version used here. [^1] | Mixing seaborn versions across notebooks and deployment. | [Installing and getting started](https://seaborn.pydata.org/installing.html) |
| Start a plotting session with a consistent theme. | You want all plots to share the same visual style. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", context="notebook", palette="deep")
``` | Set the theme once near the top of the script or notebook. This helps keep dashboards and reports visually consistent. [^1] | Forgetting that theme settings affect global Matplotlib state. | [set_theme](https://seaborn.pydata.org/api.html#seaborn.set_theme) |
| Load example data quickly. | You need a built-in dataset for a prototype or demo. | ```python
import seaborn as sns

df = sns.load_dataset("penguins")
print(df.head())
``` | Built-in datasets are useful for examples, but they are not a production data source. [^1] | Using example datasets in a runtime path that must work offline. | [load_dataset](https://seaborn.pydata.org/api.html#seaborn.load_dataset) |

## Theme and color

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Switch between common themes. | You want a clean default style or presentation style. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")
sns.set_theme(style="darkgrid")
sns.set_theme(style="white")
sns.set_theme(style="dark")
sns.set_theme(style="ticks")
``` | Choose the theme that matches the amount of grid guidance you want. `whitegrid` is often the default for analytical charts. [^1] | Using `darkgrid` when the plot is already dense and busy. | [set_style](https://seaborn.pydata.org/api.html#seaborn.set_style) |
| Adjust scaling for talk, paper, or notebook output. | Figure elements need to be larger or smaller without manual resizing everywhere. | ```python
import seaborn as sns

sns.set_context("paper")
sns.set_context("notebook")
sns.set_context("talk")
sns.set_context("poster")
``` | Use context to scale text and line widths as a group. It is faster than tuning each element individually. [^1] | Enlarging the figure but forgetting to scale label sizes. | [set_context](https://seaborn.pydata.org/api.html#seaborn.set_context) |
| Apply a palette for categorical plots. | You want readable, consistent series colors. | ```python
import seaborn as sns

sns.set_palette("deep")
sns.set_palette("muted")
sns.set_palette("pastel")
sns.set_palette("bright")
sns.set_palette("dark")
sns.set_palette("colorblind")
``` | Use `colorblind` when accessibility matters. Use categorical palettes for discrete groups. [^1] | Using a continuous palette for discrete categories. | [set_palette](https://seaborn.pydata.org/api.html#seaborn.set_palette) |
| Build a palette for continuous data. | You need a gradient for counts, densities, or heatmaps. | ```python
import seaborn as sns

palettes = ["viridis", "magma", "rocket", "flare", "crest"]
cmap = sns.color_palette("viridis", as_cmap=True)
``` | Sequential colormaps are usually better for ordered numeric values. Use a perceptually uniform palette when possible. [^1] | Picking a rainbow-like gradient for ordered data. | [color_palette](https://seaborn.pydata.org/api.html#seaborn.color_palette) |

## Scatter plots

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Create a basic scatter plot from a DataFrame. | You want to inspect a numeric relationship quickly. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.scatterplot(data=df, x="bill_length_mm", y="bill_depth_mm")
plt.show()
``` | Use this when raw point positions matter. For dense data, add transparency or sample first. [^1] | Forgetting to drop NaNs in the columns used for axes. | [scatterplot](https://seaborn.pydata.org/api.html#seaborn.scatterplot) |
| Encode groups with color. | You want subgroup comparison in one figure. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.scatterplot(data=df, x="bill_length_mm", y="bill_depth_mm", hue="species")
plt.show()
``` | `hue` is the fastest way to compare classes on the same axes. Keep the legend readable. [^1] | Mapping the wrong column to `hue` and losing the intended grouping. | [scatterplot](https://seaborn.pydata.org/api.html#seaborn.scatterplot) |
| Encode magnitude and subgroup together. | You need one plot with color, size, and marker variation. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.scatterplot(
    data=df,
    x="bill_length_mm",
    y="bill_depth_mm",
    hue="species",
    size="body_mass_g",
    style="island",
    alpha=0.8
)
plt.show()
``` | Use `size` and `style` only when they add real signal. Too many semantics can make the plot hard to read. [^1] | Overloading one plot with too many visual encodings. | [scatterplot](https://seaborn.pydata.org/api.html#seaborn.scatterplot) |
| Plot connected trends across ordered values. | You need a line chart for time or ordered x values. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("flights")
sns.lineplot(data=df, x="year", y="passengers")
plt.show()
``` | Seaborn aggregates repeated x values by default in many line workflows. Use it for trend detection, not raw point auditing. [^1] | Expecting a line plot to show every individual observation exactly. | [lineplot](https://seaborn.pydata.org/api.html#seaborn.lineplot) |
| Compare multiple time series on one axis. | You need one line per group. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("fmri").dropna()
sns.lineplot(data=df, x="timepoint", y="signal", hue="region", style="event")
plt.show()
``` | Combine `hue` and `style` for readable multi-series trends. Keep the number of groups modest. [^1] | Too many lines with similar colors and no clear ordering. | [lineplot](https://seaborn.pydata.org/api.html#seaborn.lineplot) |

## Distribution plots

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Create a histogram. | You need to inspect the shape of one numeric column. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.histplot(data=df, x="bill_length_mm", bins=20)
plt.show()
``` | Histogram bin choice matters. Tune `bins` or `binwidth` when the default hides structure. [^1] | Using too few bins and flattening the distribution. | [histplot](https://seaborn.pydata.org/api.html#seaborn.histplot) |
| Add a KDE curve to a histogram. | You want a smooth density view with the counts. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.histplot(data=df, x="bill_length_mm", bins=20, kde=True)
plt.show()
``` | This is useful for quick shape checks. Make sure the density overlay does not hide extremes. [^1] | Reading the KDE as if it were raw counts. | [histplot](https://seaborn.pydata.org/api.html#seaborn.histplot) |
| Compare distributions with KDE. | You need smooth density comparison across groups. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.kdeplot(data=df, x="bill_length_mm", hue="species", fill=True, common_norm=False, alpha=0.3)
plt.show()
``` | `common_norm=False` keeps group shapes easier to compare. Filled KDEs work best with a small number of groups. [^1] | Forgetting that normalization can hide group scale differences. | [kdeplot](https://seaborn.pydata.org/api.html#seaborn.kdeplot) |
| Inspect cumulative distribution quickly. | You want percentile-style comparison instead of bins. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.ecdfplot(data=df, x="bill_length_mm", hue="species")
plt.show()
``` | ECDFs are good when exact ordering matters. They avoid bin-selection issues entirely. [^1] | Using ECDF when the audience expects counts per bin. | [ecdfplot](https://seaborn.pydata.org/api.html#seaborn.ecdfplot) |
| Add a rug for small-sample inspection. | You want to show the exact observation locations. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.histplot(data=df, x="bill_length_mm", bins=20)
sns.rugplot(data=df, x="bill_length_mm", color="black", alpha=0.2)
plt.show()
``` | Rug marks help when sample size is small or exact values matter. Avoid them on very dense data. [^1] | Cluttering the axis with rugs on large datasets. | [rugplot](https://seaborn.pydata.org/api.html#seaborn.rugplot) |

## Categorical plots

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Compare category averages. | You need a simple aggregated comparison by category. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.barplot(data=df, x="day", y="total_bill", hue="sex", errorbar="ci")
plt.show()
``` | `barplot` is for summaries, not raw values. Choose the estimator and error bars intentionally. [^1] | Treating the bar height as a single raw observation. | [barplot](https://seaborn.pydata.org/api.html#seaborn.barplot) |
| Count observations per category. | You want category frequency instead of a numeric summary. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.countplot(data=df, x="day", hue="sex")
plt.show()
``` | `countplot` is the fastest way to inspect class balance. It is especially useful before modeling. [^1] | Using a count plot when the x axis is already continuous. | [countplot](https://seaborn.pydata.org/api.html#seaborn.countplot) |
| Show category distributions with a box plot. | You need median, quartiles, and outlier visibility. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.boxplot(data=df, x="day", y="total_bill", hue="sex")
plt.show()
``` | Box plots are compact and good for side-by-side comparison. They work well when you need robust summary structure. [^1] | Expecting a box plot to reveal multimodality clearly. | [boxplot](https://seaborn.pydata.org/api.html#seaborn.boxplot) |
| Show category distributions with a violin plot. | You want shape information in addition to quartiles. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.violinplot(data=df, x="day", y="total_bill", hue="sex", cut=0)
plt.show()
``` | Use `cut=0` to avoid extending beyond the observed range. Violin plots are useful when distribution shape matters. [^1] | Interpreting smoothed tails as observed data. | [violinplot](https://seaborn.pydata.org/api.html#seaborn.violinplot) |
| Show distribution details for larger datasets. | You need finer quantiles than a box plot provides. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.boxenplot(data=df, x="day", y="total_bill", hue="sex")
plt.show()
``` | Boxen plots are helpful when sample size is large. They expose more distribution detail than a standard box plot. [^1] | Using boxen plots on tiny samples where the extra detail is unstable. | [boxenplot](https://seaborn.pydata.org/api.html#seaborn.boxenplot) |
| Compare raw observations within categories. | You need to inspect spread and overlap directly. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.stripplot(data=df, x="day", y="total_bill", hue="sex", dodge=True, alpha=0.5)
plt.show()
``` | `stripplot` is good for seeing actual points. Jitter or dodge helps reduce overlap. [^1] | Overplotting hides repeated values and dense regions. | [stripplot](https://seaborn.pydata.org/api.html#seaborn.stripplot) |
| Show non-overlapping raw observations. | You want point visibility without overlap. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.swarmplot(data=df, x="day", y="total_bill", hue="sex", dodge=True, size=3)
plt.show()
``` | Use swarm plots when category sizes are small to moderate. They become slow on large datasets. [^1] | Using swarm plots on large datasets and getting heavy overlap or slow rendering. | [swarmplot](https://seaborn.pydata.org/api.html#seaborn.swarmplot) |
| Show group means and uncertainty. | You want a point estimate by category. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.pointplot(data=df, x="day", y="total_bill", hue="sex", errorbar="ci")
plt.show()
``` | Point plots are compact for trend-like category comparisons. They are useful in dashboards with limited space. [^1] | Reading line connections as a real continuous trend when categories are unordered. | [pointplot](https://seaborn.pydata.org/api.html#seaborn.pointplot) |

## Matrix and correlation

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Create a correlation heatmap. | You need a fast view of feature relationships. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
num = df.select_dtypes("number")
corr = num.corr(numeric_only=True)
sns.heatmap(corr, cmap="vlag", center=0)
plt.show()
``` | Correlation heatmaps are a standard EDA starting point. Use a diverging palette centered at zero. [^1] | Forgetting to filter to numeric columns before calling `corr()`. | [heatmap](https://seaborn.pydata.org/api.html#seaborn.heatmap) |
| Add annotations to a heatmap. | You want exact values visible in a small matrix. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
corr = df.select_dtypes("number").corr(numeric_only=True)
sns.heatmap(corr, cmap="vlag", center=0, annot=True, fmt=".2f")
plt.show()
``` | Use annotations only for small matrices. Dense labels quickly become unreadable. [^1] | Annotating a large matrix and creating label clutter. | [heatmap](https://seaborn.pydata.org/api.html#seaborn.heatmap) |
| Cluster rows and columns by similarity. | You want structure in a matrix, not just raw values. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
data = df.select_dtypes("number").corr(numeric_only=True)
sns.clustermap(data, cmap="vlag", center=0, figsize=(6, 6))
plt.show()
``` | `clustermap` is useful for discovering groups of related variables. It creates its own figure-level layout. [^1] | Passing non-numeric data into clustering workflows. | [clustermap](https://seaborn.pydata.org/api.html#seaborn.clustermap) |

## Regression and joint views

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Fit a simple regression line. | You need a quick linear relationship view. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.regplot(data=df, x="total_bill", y="tip")
plt.show()
``` | `regplot` is the quickest regression check for two numeric variables. It is useful before deeper modeling. [^1] | Using it on highly nonlinear data and overtrusting the line. | [regplot](https://seaborn.pydata.org/api.html#seaborn.regplot) |
| Inspect regression residuals. | You want to check model fit errors visually. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.residplot(data=df, x="total_bill", y="tip")
plt.show()
``` | Residual plots help identify nonlinearity and heteroscedasticity. Use them as a model diagnostic, not a final chart. [^1] | Interpreting a residual plot without checking model assumptions. | [residplot](https://seaborn.pydata.org/api.html#seaborn.residplot) |
| Combine scatter, regression, and marginals. | You need bivariate structure with univariate context. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.jointplot(data=df, x="total_bill", y="tip", kind="reg")
plt.show()
``` | `jointplot` is ideal for compact exploratory analysis. It is the fastest way to inspect the relationship plus marginals together. [^1] | Using a joint plot for very large data without sampling or aggregation. | [jointplot](https://seaborn.pydata.org/api.html#seaborn.jointplot) |

## Pairwise and grids

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Inspect pairwise feature relationships. | You need a matrix of pair plots for a numeric dataset. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.pairplot(df, hue="species", corner=True)
plt.show()
``` | `pairplot` is a fast EDA tool for numeric columns. `corner=True` reduces redundant upper-triangle plots. [^1] | Running pair plots on too many columns and creating an unreadable grid. | [pairplot](https://seaborn.pydata.org/api.html#seaborn.pairplot) |
| Build a customized pair grid. | You need more control than `pairplot` gives. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
g = sns.PairGrid(df, vars=["bill_length_mm", "bill_depth_mm", "flipper_length_mm"], hue="species")
g.map_diag(sns.histplot)
g.map_offdiag(sns.scatterplot, alpha=0.7)
g.add_legend()
plt.show()
``` | Use `PairGrid` when each panel needs different plotting logic. It is more flexible than `pairplot`. [^1] | Forgetting to call `add_legend()` after mapping hue. | [PairGrid](https://seaborn.pydata.org/api.html#seaborn.PairGrid) |
| Build a bivariate plot with marginals. | You want one focused pair relationship with side distributions. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
g = sns.JointGrid(data=df, x="total_bill", y="tip")
g.plot_joint(sns.scatterplot)
g.plot_marginals(sns.histplot, kde=True)
plt.show()
``` | `JointGrid` gives direct control over the center and marginal axes. Use it when `jointplot` is too rigid. [^1] | Misplacing plot types on the wrong axes in a custom grid. | [JointGrid](https://seaborn.pydata.org/api.html#seaborn.JointGrid) |

## Figure-level APIs

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Split a scatter plot into facets. | You want the same chart repeated by category. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.relplot(data=df, x="bill_length_mm", y="bill_depth_mm", hue="species", col="sex")
plt.show()
``` | `relplot` is the figure-level wrapper for relational plots. Use it when faceting is part of the task. [^1] | Using axes-level scatter when you really need automatic faceting. | [relplot](https://seaborn.pydata.org/api.html#seaborn.relplot) |
| Split distributions by category. | You need faceted histograms or KDE views. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
sns.displot(data=df, x="bill_length_mm", hue="species", col="sex", kind="hist", bins=20)
plt.show()
``` | `displot` is the figure-level entry point for distribution workflows. It is the easiest way to facet distributions. [^1] | Expecting `displot` to behave like a single Axes plot. | [displot](https://seaborn.pydata.org/api.html#seaborn.displot) |
| Compare categorical summaries across facets. | You need a faceted categorical comparison. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.catplot(data=df, x="day", y="total_bill", hue="sex", col="smoker", kind="box")
plt.show()
``` | `catplot` is the figure-level wrapper for categorical plots. Use it for repeated panels across subsets. [^1] | Building many manual subplots when `catplot` would be simpler. | [catplot](https://seaborn.pydata.org/api.html#seaborn.catplot) |
| Add regression to faceted data. | You want one regression panel per subset. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.lmplot(data=df, x="total_bill", y="tip", hue="sex", col="smoker")
plt.show()
``` | `lmplot` is the figure-level regression wrapper. It is convenient when subgroup splits matter. [^1] | Using `regplot` when you need multi-panel regression by group. | [lmplot](https://seaborn.pydata.org/api.html#seaborn.lmplot) |

## Faceting and layout

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Build a faceted custom grid. | You need row and column conditioning with custom mapping. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
g = sns.FacetGrid(df, row="sex", col="species", margin_titles=True)
g.map_dataframe(sns.scatterplot, x="bill_length_mm", y="bill_depth_mm")
g.add_legend()
plt.show()
``` | `FacetGrid` is the base layout tool for conditional plotting. Use it when you need full control over mapping. [^1] | Forgetting that `map_dataframe` expects column names from the provided DataFrame. | [FacetGrid](https://seaborn.pydata.org/api.html#seaborn.FacetGrid) |

## Styling and annotation

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Remove extra chart spines. | You want a cleaner publication-style plot. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
ax = sns.scatterplot(data=df, x="total_bill", y="tip")
sns.despine()
plt.show()
``` | `despine()` is a quick cleanup step after plotting. It works well for many analytical charts. [^1] | Calling `despine()` before the axes exist. | [despine](https://seaborn.pydata.org/api.html#seaborn.despine) |
| Move a legend to a better position. | The legend overlaps data or gets clipped. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
ax = sns.scatterplot(data=df, x="bill_length_mm", y="bill_depth_mm", hue="species")
sns.move_legend(ax, "upper left", bbox_to_anchor=(1, 1))
plt.show()
``` | Use `move_legend()` when the default legend placement is poor. This is common in faceted and dense plots. [^1] | Leaving the legend inside the plotting area and obscuring data. | [move_legend](https://seaborn.pydata.org/api.html#seaborn.move_legend) |
| Set titles, labels, ticks, and limits. | You need final presentation polish. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
ax = sns.scatterplot(data=df, x="total_bill", y="tip")
ax.set_title("Tip vs Total Bill")
ax.set_xlabel("Total Bill")
ax.set_ylabel("Tip")
ax.set_xlim(0, 60)
ax.tick_params(axis="x", rotation=45)
plt.show()
``` | Use Matplotlib methods on the returned Axes for final polish. This is the standard integration pattern with Seaborn. [^1] | Forgetting to rotate dense tick labels. | [Matplotlib Axes methods](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.html) |
| Add a simple annotation. | You need to label an important point or region. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
ax = sns.scatterplot(data=df, x="total_bill", y="tip")
ax.annotate("high bill", xy=(50, 10), xytext=(35, 12), arrowprops=dict(arrowstyle="->"))
plt.show()
``` | Use annotations sparingly and only for important callouts. They are best for emphasis, not decoration. [^1] | Placing annotations so they overlap with the data. | [Matplotlib annotate](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.annotate.html) |

## Integration patterns

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Plot directly from Pandas. | Your data already lives in a DataFrame. | ```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({"x": [1, 2, 3, 4], "y": [1.1, 1.9, 3.2, 3.8], "group": ["A", "A", "B", "B"]})
sns.scatterplot(data=df, x="x", y="y", hue="group")
plt.show()
``` | Seaborn is optimized for tidy tabular data. This is the most common production workflow. [^1] | Passing wide data when the function expects long-form columns. | [scatterplot](https://seaborn.pydata.org/api.html#seaborn.scatterplot) |
| Plot from NumPy arrays. | You have numeric arrays rather than a DataFrame. | ```python
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(1, 11)
y = np.array([1.2, 1.8, 2.4, 3.1, 3.6, 4.0, 4.8, 5.3, 5.9, 6.2])
sns.lineplot(x=x, y=y)
plt.show()
``` | NumPy arrays are fine for quick numeric plots. Add a DataFrame when you need semantic mappings. [^1] | Forgetting that some workflows are easier with named columns. | [lineplot](https://seaborn.pydata.org/api.html#seaborn.lineplot) |
| Use an existing Matplotlib Axes. | You want Seaborn inside a multi-panel Matplotlib figure. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
fig, ax = plt.subplots(figsize=(6, 4))
sns.scatterplot(data=df, x="total_bill", y="tip", hue="sex", ax=ax)
ax.set_title("Embedded Seaborn Plot")
plt.show()
``` | Passing `ax=` is the standard way to embed Seaborn in custom Matplotlib layouts. It keeps figure orchestration under your control. [^1] | Assuming Seaborn will create the axes you want when you already own the figure layout. | [scatterplot](https://seaborn.pydata.org/api.html#seaborn.scatterplot) |

## Export and rendering

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Save a publication-quality figure. | You need a PNG or PDF artifact. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
ax = sns.scatterplot(data=df, x="total_bill", y="tip")
plt.tight_layout()
plt.savefig("figure.png", dpi=300, bbox_inches="tight")
plt.savefig("figure.pdf", bbox_inches="tight")
plt.show()
``` | Use PNG for raster output and PDF/SVG for vector graphics. `bbox_inches="tight"` helps prevent clipping. [^1] | Exporting before tightening layout or moving the legend. | [Matplotlib savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html) |
| Export with transparency. | You need the plot on a colored background or slide deck. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips").dropna()
sns.scatterplot(data=df, x="total_bill", y="tip")
plt.savefig("transparent.png", dpi=300, transparent=True, bbox_inches="tight")
plt.show()
``` | Transparency is useful for slides and compositing. Verify contrast against the target background. [^1] | Using transparency with low-contrast labels that become unreadable. | [Matplotlib savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html) |

## Performance

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Plot a very large dataset efficiently. | You have millions of rows or heavy overplotting. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("diamonds").dropna()
sample = df.sample(n=min(5000, len(df)), random_state=42)
sns.scatterplot(data=sample, x="carat", y="price", alpha=0.3, linewidth=0)
plt.show()
``` | Sample first when the raw point cloud is too dense. For heavy scatter plots, reduce point size and use transparency. [^1] | Plotting every row and turning the chart into a dark blob. | [scatterplot](https://seaborn.pydata.org/api.html#seaborn.scatterplot) |
| Reduce rendering cost for dense layers. | You need many points but still want a usable plot. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("diamonds").dropna()
sample = df.sample(n=8000, random_state=42)
ax = sns.scatterplot(data=sample, x="carat", y="price", alpha=0.25, s=10, linewidth=0)
plt.savefig("dense_plot.pdf", bbox_inches="tight")
plt.show()
``` | Prefer aggregation, sampling, or summary views over raw overplotting. Use vector output carefully for dense point clouds. [^1] | Repeatedly redrawing the same figure in loops without reuse or caching. | [^1] |

## Quick reference

### Plot selection guide

| Goal | Recommended plot |
|---|---|
| Relationship between two numeric variables | `scatterplot` |
| Ordered trend or time series | `lineplot` |
| One numeric distribution | `histplot`, `kdeplot`, `ecdfplot` |
| Compare category summaries | `barplot`, `pointplot` |
| Compare category distributions | `boxplot`, `violinplot`, `boxenplot` |
| Category counts | `countplot` |
| Feature correlation | `heatmap` |
| Hierarchical matrix structure | `clustermap` |
| Pairwise feature scan | `pairplot`, `PairGrid` |
| Bivariate view with marginals | `jointplot`, `JointGrid` |
| Faceted comparison | `relplot`, `displot`, `catplot`, `lmplot`, `FacetGrid` |

### Distribution plots

| Plot | Best for |
|---|---|
| `histplot` | Counts and bins |
| `kdeplot` | Smooth density shape |
| `ecdfplot` | Percentile-style comparison |
| `rugplot` | Exact observation locations |

### Categorical plots

| Plot | Best for |
|---|---|
| `barplot` | Aggregated category comparison |
| `countplot` | Category frequency |
| `boxplot` | Median, quartiles, outliers |
| `violinplot` | Shape plus summary |
| `boxenplot` | Large-sample distribution detail |
| `stripplot` | Raw points with jitter |
| `swarmplot` | Non-overlapping raw points |
| `pointplot` | Compact summary with uncertainty |

### Relational plots

| Plot | Best for |
|---|---|
| `scatterplot` | Two numeric variables with optional semantics |
| `lineplot` | Ordered or time-based trends |

### Figure-level vs axes-level APIs

| Figure-level | Axes-level |
|---|---|
| `relplot` | `scatterplot`, `lineplot` |
| `displot` | `histplot`, `kdeplot`, `ecdfplot`, `rugplot` |
| `catplot` | `barplot`, `countplot`, `boxplot`, `violinplot`, `boxenplot`, `stripplot`, `swarmplot`, `pointplot` |
| `lmplot` | `regplot`, `residplot` |

### Color palettes

| Palette | Best for |
|---|---|
| `deep` | General categorical use |
| `muted` | Softer categorical palettes |
| `pastel` | Light categorical plots |
| `bright` | High-contrast categorical plots |
| `dark` | Darker categorical sets |
| `colorblind` | Accessibility |
| `viridis` | Sequential numeric data |
| `magma` | Sequential numeric data |
| `rocket` | Sequential numeric data |
| `flare` | Sequential numeric data |
| `crest` | Sequential numeric data |

### Themes

| Theme | Best for |
|---|---|
| `whitegrid` | Analytical charts with readable structure |
| `darkgrid` | Dense exploratory charts |
| `white` | Clean publication look |
| `dark` | Dark-background figures |
| `ticks` | Minimal framing with visible ticks |

### Frequently used parameters

| Parameter | Use |
|---|---|
| `data` | Source DataFrame or table |
| `x`, `y` | Axis variables |
| `hue` | Group encoding by color |
| `style` | Group encoding by marker or line style |
| `size` | Group or magnitude encoding by size |
| `palette` | Color palette selection |
| `estimator` | Summary function for aggregated plots |
| `errorbar` | Uncertainty interval style |
| `bins` | Histogram bin count or strategy |
| `kde` | Overlay KDE on histogram |
| `fill` | Filled area for KDE or similar plots |
| `alpha` | Transparency |
| `linewidth` | Line or marker edge width |
| `marker` | Marker style |
| `ax` | Target Matplotlib Axes |

### Common API mapping

| Task | API |
|---|---|
| Basic relational plot | `scatterplot`, `lineplot` |
| Faceted relational plot | `relplot` |
| Histogram | `histplot` |
| Density plot | `kdeplot` |
| CDF plot | `ecdfplot` |
| Category summary | `barplot`, `pointplot` |
| Category frequency | `countplot` |
| Category distribution | `boxplot`, `violinplot`, `boxenplot` |
| Raw categorical points | `stripplot`, `swarmplot` |
| Correlation matrix | `heatmap` |
| Clustered matrix | `clustermap` |
| Regression check | `regplot` |
| Residual check | `residplot` |
| Pairwise scan | `pairplot`, `PairGrid` |
| Bivariate + marginals | `jointplot`, `JointGrid` |
| Faceted categorical plot | `catplot` |
| Faceted distribution plot | `displot` |
| Faceted regression plot | `lmplot` |

### Common errors

| Error | Cause | Solution |
|---|---|---|
| Missing or empty plot. | NaNs or wrong column names in `data`, `x`, or `y`. | Validate column names and drop missing values for the plotted fields. |
| Legend obscures data. | Default legend placement collides with plotted points. | Use `move_legend()` or Matplotlib legend placement. |
| Overlapping labels. | Too many tick labels or dense categories. | Rotate ticks, reduce categories, or widen the figure. |
| Wrong grouping colors. | `hue` points to the wrong column or to a numeric field unintentionally. | Check variable type and intended semantics before plotting. |
| Unreadable dense scatter. | Too many rows or too much overplotting. | Sample data, reduce marker size, or use alpha and aggregation. |
| Clipped annotations or legends. | Layout was not tightened before export. | Use `tight_layout()` and `bbox_inches="tight"`. |

### Performance checklist

- Plot millions of rows with sampling or aggregation first.
- Prefer summary plots over raw point clouds when the dataset is dense.
- Use `alpha`, small markers, and `linewidth=0` for scatter-heavy charts.
- Reuse figures and axes instead of redrawing in loops.
- Avoid large pairwise grids unless they answer a real question.
- Use rasterization or vector export intentionally based on output density.
- Reduce repeated rendering and unnecessary faceting.
- Keep memory use low by selecting only the columns needed for the plot.

### Production checklist

- Labels are readable and specific.
- Palette is accessible and colorblind-safe where needed.
- Figure size matches the output medium.
- Legend placement does not clip or cover data.
- Title and axis labels are present.
- Export DPI is appropriate for the target medium.
- Theme is consistent across charts.
- Results are reproducible with fixed sampling or ordering where needed.

## Official docs

- [API reference](https://seaborn.pydata.org/api.html)
- [Example gallery](https://seaborn.pydata.org/examples/index.html)
- [Installing and getting started](https://seaborn.pydata.org/installing.html)
<span style="display:none">[^2][^3][^4][^5][^6]</span>

<div align="center">⁂</div>

[^1]: Seaborn-Package-Reference.md
[^2]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md
[^3]: CURRENT_PROJECT_STATE_REPORT.md
[^4]: CONTENT_QUALITY_STANDARD.md
[^5]: ARCHITECTURE_FREEZE.md
[^6]: AENS-Knowledge-Layer-Specification.md```

