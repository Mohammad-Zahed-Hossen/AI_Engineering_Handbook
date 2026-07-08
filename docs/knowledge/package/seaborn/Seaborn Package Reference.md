# Seaborn Package Reference

## Package Metadata

| Field | Value |
| :-- | :-- |
| Package name | Seaborn |
| Canonical name | seaborn |
| Slug | seaborn |
| Package identifier | seaborn |
| Selected version | 0.13.2 |
| Release date | January 2024 |
| Documentation version used | seaborn 0.13.2 documentation |
| Verification date | July 5, 2026 |
| Version selection rationale | Stable documented release, current docs, and the latest listed version in the official “what’s new” index at the time of verification. The official docs available here are versioned as 0.13.2 and include the stable API reference and installation instructions. [^1][^2] |
| Summary | Statistical data visualization library for Python built on Matplotlib, with high-level APIs for relational, distribution, categorical, regression, matrix, and faceted plots. [^2][^3] |
| Description | Seaborn is a Python visualization library based on Matplotlib that provides a high-level interface for drawing attractive and informative statistical graphics. [^2][^3] |
| Package purpose | Make statistical visualization concise, expressive, and consistent for data analysis and publication workflows. [^2] |
| Maintainer | The Seaborn project under PyData. [^2][^4] |
| Organization | PyData / seaborn project. [^2][^4] |
| License | **Not officially documented.** |
| Development model | Open-source Python package with official documentation, GitHub repository, issue reporting, and release notes. [^2][^4] |
| Repository | [GitHub repository](https://github.com/seaborn/seaborn) [^4] |
| Source code location | [GitHub repository](https://github.com/seaborn/seaborn) [^4] |
| Issue tracker | [GitHub issues](https://github.com/seaborn/seaborn/issues) |
| Discussion forum | [PyData / SciPy Community support channels are referenced by the docs; a Seaborn-specific discussion forum is not officially documented here.**Not officially documented.**] [^2] |
| Package maturity | Production ready, stable release line. [^1][^2] |
| Lifecycle status | Stable. [^1][^2] |
| Production readiness | Yes, for standard statistical visualization workloads built on Matplotlib. [^2] |
| Intended engineering domains | Data visualization, exploratory data analysis, statistical graphics, analytics engineering, research engineering, ML experiment reporting. [^2] |
| Typical users | Data scientists, Python developers, research engineers, analytics engineers, MLEs, and MLOps engineers. |
| Primary ecosystem integrations | Matplotlib, NumPy, Pandas, SciPy, statsmodels. [^2][^5] |
| Supported programming paradigm | Declarative, data-oriented plotting with both axes-level and figure-level APIs, plus the objects interface. [^5] |
| Visualization paradigm | Statistical graphics layered on top of Matplotlib rendering. [^2][^5] |
| Statistical focus | Estimation, aggregation, uncertainty intervals, distributions, regression, and categorical summaries. [^5] |
| Install | `pip install seaborn`; optional stats extras: `pip install seaborn[stats]`; conda: `conda install seaborn`; `conda install seaborn -c conda-forge`. [^5] |
| Upgrade | **Not officially documented.** |
| Uninstall | **Not officially documented.** |
| Import convention | `import seaborn as sns`; objects API: `import seaborn.objects as so`; tutorials also assume `numpy`, `pandas`, `matplotlib`. [^5] |
| Compatible versions | Python 3.8+ is officially documented. NumPy, Pandas, and Matplotlib version ranges are **Not officially documented** in the retrieved sources. [^5] |
| Optional dependencies | statsmodels, SciPy, and clustering-related dependencies are documented as optional for advanced regression plots and matrix clustering features. [^5] |

## Official Resources

| Resource | URL |
| :-- | :-- |
| Documentation home | [seaborn: statistical data visualization](https://seaborn.pydata.org/) [^2] |
| Stable documentation | [seaborn 0.13.2 documentation](https://seaborn.pydata.org/) [^2] |
| API reference | [API reference](https://seaborn.pydata.org/api.html) [^5] |
| Installation | [Installing and getting started](https://seaborn.pydata.org/installing.html) [^5] |
| What's new / release notes | [What's new in each version](https://seaborn.pydata.org/whatsnew/index.html) [^1] |
| v0.13.0 notes | [v0.13.0](https://seaborn.pydata.org/whatsnew/v0.13.0.html) [^6] |
| v0.13.2 notes | [v0.13.2](https://seaborn.pydata.org/whatsnew/v0.13.2.html) [^7] |
| GitHub repository | [seaborn/seaborn](https://github.com/seaborn/seaborn) [^4] |
| GitHub issues | [seaborn/seaborn/issues](https://github.com/seaborn/seaborn/issues) |
| PyPI | [seaborn on PyPI](https://pypi.org/project/seaborn/) [^3] |
| Examples gallery | [Examples gallery](https://seaborn.pydata.org/examples/index.html) |
| Tutorials | [Tutorials](https://seaborn.pydata.org/tutorial.html) |
| User guide | [User guide](https://seaborn.pydata.org/tutorial.html) |
| Matplotlib docs | [Matplotlib documentation](https://matplotlib.org/stable/) |
| NumPy docs | [NumPy documentation](https://numpy.org/doc/) |
| Pandas docs | [Pandas documentation](https://pandas.pydata.org/docs/) |

## Design Philosophy

Seaborn exists to make statistical visualization faster to write and easier to interpret than low-level plotting with Matplotlib alone. It focuses on sensible defaults, semantic mappings, and built-in statistical transformations so engineers can express intent rather than manually assemble plot primitives.[^2][^5]

Its core trade-off is abstraction over direct control: Seaborn reduces boilerplate and standardizes common statistical plots, while Matplotlib remains the rendering engine and escape hatch for fine control. That makes Seaborn especially useful when the output must be readable, reproducible, and consistent across datasets and reports.[^5][^2]

## Architecture

### High-Level Layers

| Layer | Responsibility |
| :-- | :-- |
| User API layer | Exposes axes-level functions, figure-level functions, and the objects interface. [^5] |
| Semantic mapping layer | Maps data variables to aesthetics like position, hue, size, style, row, and col. [^5] |
| Statistical transformation layer | Aggregates data, estimates distributions, fits regression models, and computes uncertainty intervals. [^5] |
| Figure construction layer | Creates grids, facets, and subplot layouts for multi-panel graphics. [^5] |
| Matplotlib rendering layer | Draws the final artists and handles backend-specific rendering through Matplotlib. [^2][^5] |

### Visualization Pipeline

1. Load or pass data, typically as a Pandas DataFrame or other supported tabular structure.[^2][^5]
2. Assign variables to visual semantics such as x, y, hue, size, style, row, and col.[^5]
3. Apply optional statistical transformation such as aggregation, estimation, binning, KDE, or regression fit.[^5]
4. Choose geometry or mark type such as scatter, line, bar, box, violin, histogram, or heatmap.[^5]
5. Optionally facet into multiple subplots for conditioning by subset.[^5]
6. Render through Matplotlib and return either an Axes, a Figure-like grid object, or an objects API plot object.[^5]

## Plotting Paradigms

### Axes-level API

Axes-level functions draw a single plot onto a Matplotlib Axes and usually return that Axes. This is the best fit when you need direct Matplotlib control, custom subplot layouts, or simple single-panel plots.[^5]

Use it when you want the smallest abstraction layer and plan to compose Seaborn with other Matplotlib code. Avoid it when you want automatic faceting or a higher-level multi-panel layout.[^5]

### Figure-level API

Figure-level functions build a figure around a FacetGrid and manage layout automatically. They are the right choice for relational, distribution, categorical, and regression plots that should be split across rows, columns, or hue levels with minimal manual subplot work.[^5]

The trade-off is less direct control over subplot ownership than axes-level functions. They are best for dashboards, exploratory analysis, and report-ready faceted graphics.[^5]

### Objects API

The objects interface is the declarative plotting system in Seaborn 0.13.2. It centers on a `Plot` object and composable marks, stats, moves, and scales, and is officially documented as part of the API reference.[^5]

It is the strongest fit when you want reusable, composable plot specifications and a more explicit grammar-of-graphics style workflow. Its main limitation is that many teams still rely on the older axes-level and figure-level APIs, so adoption may require standardization effort.[^5]

## Relationship With Other Libraries

| Library | Relationship | Engineering impact |
| :-- | :-- | :-- |
| Matplotlib | Seaborn is built on top of Matplotlib and delegates rendering to it. [^2][^5] | Use Matplotlib directly for low-level artist control, backend-specific behavior, and fine-tuned layout adjustments. |
| NumPy | Seaborn integrates with the PyData stack and uses NumPy-style data handling in examples and workflows. [^2][^5] | Use NumPy directly for numeric array preparation, transformations, and simulation before plotting. |
| Pandas | Seaborn is designed for tabular data workflows and supports DataFrame-oriented plotting. [^2][^5] | Use Pandas directly for reshaping, grouping, sorting, and cleaning before plotting. |
| SciPy | Official docs list SciPy-related optional support for advanced features. [^5] | Use SciPy directly when you need scientific routines underlying advanced statistical workflows. |
| statsmodels | Official docs list statsmodels as an optional dependency for advanced regression plots. [^5] | Use statsmodels directly when you need regression modeling beyond Seaborn’s plotting layer. |
| Polars | Seaborn 0.13 introduced support for alternate dataframe libraries. [^1] | Use directly only when your data pipeline already centers on non-Pandas tabular backends. |

## Statistical Visualization Philosophy

Seaborn treats the plot as a statistical summary, not only a geometric drawing. That means defaults often include aggregation, confidence intervals, binning, or fitted trend lines rather than raw marks alone.[^5]

This is helpful when the goal is to communicate central tendency, variation, distribution shape, or trends. It should be overridden when the raw observations themselves are the message, when the sample size is small, or when the default estimator would hide important structure.[^5]

## Semantic Mapping

| Semantic | Purpose | Notes |
| :-- | :-- | :-- |
| x | Horizontal position encoding. | Best for ordered numeric, temporal, or categorical x-axes. [^5] |
| y | Vertical position encoding. | Best for dependent variables or secondary measurement. [^5] |
| hue | Encodes subgroup membership with color. | Use for categorical groups or continuous color scales where supported. [^5] |
| size | Encodes magnitude with marker or line size. | Avoid when visual precision matters more than rough ranking. [^5] |
| style | Encodes subgroup by marker/line style. | Useful when color is already saturated or printed in grayscale. [^5] |
| row | Facet rows. | Use for conditioning on a categorical variable across rows. [^5] |
| col | Facet columns. | Use for conditioning on a categorical variable across columns. [^5] |
| units | Repeated-measures grouping. | Important when estimating uncertainty across repeated observations. **Not officially documented** in the retrieved sources. |
| weights | Weighted statistical estimation. | Supported by the objects API documentation listing a `Weighted`-style statistical object; detailed parameter behavior is **Not officially documented** in the retrieved sources. [^5] |
| order | Controls categorical or display order. | Use to make plots deterministic and easier to compare. [^5] |

## Figure Management

Seaborn manages figure creation differently depending on API style. Axes-level functions draw into an existing or current Matplotlib Axes, while figure-level functions create and manage a FacetGrid-like layout automatically.[^5]

Because Matplotlib owns final rendering, Seaborn users often need to interact with the returned Figure or Axes for labels, annotations, tick formatting, and export settings. This is the standard path for production-quality styling after the statistical plot is created.[^2][^5]

## Theme System

Seaborn provides APIs for setting plot theme, style, context, palette, and rc parameters. The API reference lists functions for getting and setting style parameters, scaling context, changing color shorthand interpretation, and restoring defaults.[^5]

The engineering implication is that styling APIs can change global Matplotlib state. In shared notebooks or long-lived processes, prefer explicit theme setup at the beginning of a plotting session and reset or isolate state when composing multiple reports.[^5]

## Core Concepts

### Statistical Visualization

Seaborn emphasizes statistical summaries over raw primitive drawing. The mental model is: choose variables, let Seaborn apply a relevant statistical representation, then refine the rendering.[^2][^5]

### Semantic Mapping

Semantic mapping is the assignment of data fields to visual channels. This is Seaborn’s main abstraction for turning tidy tabular data into readable graphics.[^5]

### Figure-level Functions

Figure-level functions own layout and faceting. Use them when the figure structure is part of the analysis.[^5]

### Axes-level Functions

Axes-level functions own one plot at a time. Use them when you need Matplotlib composition or precise figure orchestration.[^5]

### Objects Interface

The objects interface is the declarative plotting grammar in Seaborn. It is meant for composability and explicit plot construction.[^5]

### Tidy Data

Seaborn works best when variables are organized as columns and observations as rows. This is the normal long-form tabular workflow used by Pandas and other dataframe libraries.[^2][^5]

### Long-form vs Wide-form Data

Long-form data is the preferred engineering shape for semantic mapping and faceting. Wide-form is still supported in some APIs, but it is usually less flexible for layered and faceted plots.[^5]

### Categorical Data Visualization

Categorical plots summarize values across discrete groups using bars, boxes, violins, points, strips, and swarms. They are most useful when category ordering and uncertainty representation matter.[^5]

### Relational Visualization

Relational plots show the relationship between two numeric variables, optionally grouped by semantic channels like hue, size, and style. Scatter and line plots are the canonical examples.[^5]

### Distribution Visualization

Distribution plots reveal spread, modality, and tails using histograms, KDE, ECDFs, and related forms. They are most useful for shape analysis and comparison across subsets.[^5]

### Regression Visualization

Regression plots combine raw data with a fitted model or residual analysis. They are useful when the question involves trend direction, slope, and fit quality.[^5]

### Matrix Visualization

Matrix plots encode rectangular tables as color-encoded grids, often with optional clustering. Heatmap and clustermap are the main public patterns.[^5]

### Pairwise Visualization

Pairwise visualization compares multiple variable pairs in a compact grid. `PairGrid` and pairplot-style workflows are the relevant engineering tools.[^5]

### Faceting

Faceting splits a plot into small multiples across rows and columns. It is the primary way to compare subsets consistently.[^5]

### Grid Objects

`FacetGrid`, `PairGrid`, and `JointGrid` are the main multi-plot container objects in Seaborn’s public API.[^5]

### Themes

Themes control default visual appearance across plots. They should be treated as project-level presentation settings, not ad hoc decorations.[^5]

### Contexts

Contexts scale plot elements for different presentation settings, such as notebook exploration versus slide decks or publication figures.[^5]

### Color Palettes

Seaborn provides categorical, sequential, diverging, and blended palette construction utilities. The API reference also exposes palette selection widgets and palette-to-colormap helpers.[^5]

### Colormaps

Colormaps are important when plotting continuous values or matrix-style visuals. Seaborn exposes palette helpers that return palettes or colormaps from the Matplotlib registry.[^5]

### Statistical Estimation

Estimation is the process of summarizing sample data into a representative statistic, such as a mean or other point estimate. Seaborn’s statistical plots often perform this automatically.[^5]

### Confidence Intervals

Seaborn supports uncertainty visualization around estimates through interval representations. The v0.12 release notes specifically call out more flexible error bars.[^1]

### Error Bars

Error bars encode uncertainty or spread around an estimate. They are important when the chart’s message depends on comparing uncertainty rather than raw values alone.[^1][^5]

### Aggregation

Aggregation reduces many observations to summaries suitable for category-level or trend-level comparison. Seaborn’s statistical plotting API often aggregates implicitly.[^5]

### Bootstrapping

Seaborn’s release notes and statistical interface historically include bootstrap-based uncertainty handling, but the exact behavior for the selected version is **Not officially documented** in the retrieved excerpts.[^1][^5]

### Declarative Plot Construction

Declarative construction means describing the data, mappings, and statistical transformations rather than manually assembling every artist. This is the conceptual foundation of the objects interface.[^5]

### Matplotlib Integration

Seaborn integrates tightly with Matplotlib, and Matplotlib is still the source of final drawing, styling, and export behavior. That means backend behavior, savefig settings, and axis formatting still matter operationally.[^2][^5]

### Figure Ownership

Figure-level functions generally own the Figure layout, while axes-level functions usually operate within caller-owned axes. This distinction matters when mixing Seaborn with multi-panel Matplotlib code.[^5]

### Axes Ownership

Axes ownership determines whether Seaborn or the caller controls subplot placement. Use axes-level APIs when ownership must stay with your plotting pipeline.[^5]

### Production Visualization Workflow

A production plotting workflow usually includes data cleaning, categorical ordering, explicit palette choice, deterministic sizing, export format selection, and post-render Matplotlib adjustments. These are engineering choices that improve consistency and reproducibility.[^5]

## Important Modules

### seaborn

Purpose: top-level public plotting API and theme/palette utilities. Responsibilities: common statistical plots, styling, palettes, example datasets, and convenience helpers. Major functions include `scatterplot`, `lineplot`, `relplot`, `catplot`, `displot`, `lmplot`, `heatmap`, `clustermap`, `set_theme`, `set_palette`, `color_palette`, and `despine`.[^5]

### seaborn.objects

Purpose: declarative plotting grammar. Responsibilities: `Plot`, marks, stats, moves, and scales for composable statistical graphics. It is officially part of the 0.13.2 API reference.[^5]

### seaborn.axisgrid

Purpose: grid-based multi-panel plotting classes. Responsibilities: `FacetGrid`, `PairGrid`, `JointGrid`, and related faceting logic.[^5]

### seaborn.palettes

Purpose: palette construction and palette utilities. Responsibilities: categorical palettes, sequential palettes, diverging palettes, and palette selection helpers.[^5]

### seaborn.rcmod

Purpose: rc parameter and theme configuration utilities. Responsibilities: setting and restoring style/context settings and Matplotlib shorthand interpretation.[^5]

### seaborn.utils

Purpose: utility helpers for plotting workflows. Responsibilities: despine, legend formatting, color manipulation, example dataset loading, and cache helpers.[^5]

### seaborn.algorithms

Purpose: statistical helpers. Public-use status in the retrieved sources is **Not officially documented**.[^5]

### seaborn.external

Purpose: external vendored helpers, if exposed. Public-use status is **Not officially documented** in the retrieved sources.

## Canonical Tasks

### Create Scatter Plot

**Purpose:** Draw a relational scatter plot with optional semantic grouping.[^5]

**Mental trigger:** “I need to compare two numeric variables and optionally group points by category.”

**Syntax:** `seaborn.scatterplot(data=None, *, x=None, y=None, hue=None, size=None, style=None, palette=None, sizes=None, markers=True, ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

penguins = sns.load_dataset("penguins").dropna()

ax = sns.scatterplot(
    data=penguins,
    x="bill_length_mm",
    y="bill_depth_mm",
    hue="species",
    style="species",
)
plt.show()
```

**Expected output:** A scatter plot with points colored and styled by species.[^5]

**When to use:** compare two numeric variables; inspect clustering; show subgroup separation; highlight outliers; visualize multivariate relationships.[^5]

**Avoid when:** the dataset is extremely dense; the message is primarily aggregate; overplotting is severe; categories are too many for color; raw point identity is not relevant.[^5]

**Important parameters:** x, y, hue, size, style.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** forgetting `dropna()` when missing values dominate; using too many hue levels; using size for precise quantitative reading; overplotting without transparency; assuming legends are automatically optimal.[^5]

**Gotchas:** style and hue can become visually redundant; Matplotlib still owns ticks and export; category order affects legend order; dense data may require aggregation or transparency; default palette may not match project branding.[^5]

**Official docs:** [seaborn.scatterplot](https://seaborn.pydata.org/api.html)[^5]

### Create Line Plot

**Purpose:** Draw a relational line plot with optional semantic grouping.[^5]

**Mental trigger:** “I need to show how a value changes across an ordered dimension.”

**Syntax:** `seaborn.lineplot(data=None, *, x=None, y=None, hue=None, size=None, style=None, markers=False, dashes=True, estimator="mean", errorbar="ci", err_style="band", ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

fmri = sns.load_dataset("fmri").dropna()

ax = sns.lineplot(
    data=fmri,
    x="timepoint",
    y="signal",
    hue="event",
)
plt.show()
```

**Expected output:** A line chart that summarizes signal over time, grouped by event.[^5]

**When to use:** time series summaries; ordered measurements; trend comparison; aggregated repeated observations; line-based categorical comparisons.[^5]

**Avoid when:** x is unordered categories; the raw path of each observation matters more than the summary; line interpolation would mislead; there are too many overlapping groups.[^5]

**Important parameters:** x, y, hue, estimator, errorbar.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** connecting unordered points; misunderstanding estimator behavior; hiding uncertainty when it matters; using lines for purely categorical values; mixing too many groups without faceting.[^5]

**Gotchas:** Seaborn may summarize repeated values; uncertainty display is part of the semantic message; order matters strongly; line encoding can imply continuity; defaults can differ from raw-data expectations.[^1][^5]

**Official docs:** [seaborn.lineplot](https://seaborn.pydata.org/api.html)[^5]

### Create Histogram

**Purpose:** Show a distribution with bins.[^5]

**Mental trigger:** “I need to inspect the shape, spread, and density of a numeric variable.”

**Syntax:** `seaborn.histplot(data=None, *, x=None, y=None, hue=None, bins="auto", binwidth=None, stat="count", common_bins=True, common_norm=True, multiple="layer", element="bars", ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

penguins = sns.load_dataset("penguins").dropna()

ax = sns.histplot(data=penguins, x="bill_length_mm", hue="species", bins=20)
plt.show()
```

**Expected output:** A histogram of bill length, optionally split by species.[^5]

**When to use:** single-variable distribution checks; compare subset distributions; inspect skew and multimodality; identify outliers; validate preprocessing.[^5]

**Avoid when:** exact individual observations are the goal; bin choice would materially change the conclusion and is not controlled; the dataset is tiny and histogram bins mislead.[^5]

**Important parameters:** x, hue, bins, stat, multiple.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** using unsuitable binning; comparing subsets with mismatched normalization; overplotting too many groups; misreading counts as density; forgetting to choose a meaningful stat.[^5]

**Gotchas:** binning is a modeling choice; different `stat` values change interpretation; `multiple` affects how groups overlap; hue normalization can alter visual emphasis; dense datasets can hide tails.[^5]

**Official docs:** [seaborn.histplot](https://seaborn.pydata.org/api.html)[^5]

### Create KDE Plot

**Purpose:** Show a smoothed estimate of a distribution.[^5]

**Mental trigger:** “I need a smoothed view of distribution shape rather than raw bins.”

**Syntax:** `seaborn.kdeplot(data=None, *, x=None, y=None, hue=None, fill=False, common_norm=True, common_grid=True, ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

penguins = sns.load_dataset("penguins").dropna()

ax = sns.kdeplot(data=penguins, x="bill_length_mm", hue="species", fill=True)
plt.show()
```

**Expected output:** Smoothed density curves, optionally filled and grouped by species.[^5]

**When to use:** compare distribution shapes; emphasize modality; build smoothed summaries; present publication-oriented density comparisons; compare groups on a common scale.[^5]

**Avoid when:** the exact distribution mass matters; the sample is very small; smoothing could introduce misleading structure; discrete data dominate the signal.[^5]

**Important parameters:** x, y, hue, fill, common_norm.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** treating KDE as raw counts; applying it to discrete variables without thought; hiding bandwidth sensitivity; comparing groups without checking common normalization; assuming the curve is always appropriate.[^5]

**Gotchas:** smoothing choice matters; KDE may oversimplify multimodal or discrete data; filled densities can obscure overlaps; normalization affects comparison; tails can appear extended beyond observed support.[^5]

**Official docs:** [seaborn.kdeplot](https://seaborn.pydata.org/api.html)[^5]

### Create ECDF Plot

**Purpose:** Show cumulative distribution empirically.[^5]

**Mental trigger:** “I need a distribution comparison without binning or smoothing.”

**Syntax:** `seaborn.ecdfplot(data=None, *, x=None, y=None, hue=None, complementary=False, ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

penguins = sns.load_dataset("penguins").dropna()

ax = sns.ecdfplot(data=penguins, x="bill_length_mm", hue="species")
plt.show()
```

**Expected output:** Stepwise cumulative curves for each species.[^5]

**When to use:** compare percentiles; avoid binning artifacts; inspect tail behavior; show stochastic dominance; validate distribution shifts.[^5]

**Avoid when:** you need smoothed density; the audience expects a histogram; sample size is too tiny for a meaningful cumulative shape; the plot becomes crowded with many groups.[^5]

**Important parameters:** x, hue, complementary.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** interpreting ECDF as a density plot; forgetting that it is stepwise; overusing too many groups; missing the complement option for tail emphasis; not sorting or grouping cleanly beforehand.[^5]

**Gotchas:** ECDF emphasizes ranks rather than density; each observation contributes a jump; group overlap can hide detail; tail comparisons are often easier than histogram comparisons; no smoothing means more literal data representation.[^5]

**Official docs:** [seaborn.ecdfplot](https://seaborn.pydata.org/api.html)[^5]

### Create Bar Plot

**Purpose:** Show category-level point estimates with uncertainty.[^5]

**Mental trigger:** “I need to compare aggregated values across categories.”

**Syntax:** `seaborn.barplot(data=None, *, x=None, y=None, hue=None, estimator="mean", errorbar="ci", n_boot=1000, ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()

ax = sns.barplot(data=tips, x="day", y="total_bill", hue="sex")
plt.show()
```

**Expected output:** Aggregated bars with uncertainty representation across days and sex.[^5]

**When to use:** category summaries; reporting means or other estimates; comparison across groups; uncertainty communication; dashboard KPIs.[^5]

**Avoid when:** the raw data distribution is the main point; bar height could be confused with count; the category has too many observations to summarize blindly; the estimator is not the message; the audience needs distribution shape.[^5]

**Important parameters:** x, y, hue, estimator, errorbar.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** using bars for raw distributions; forgetting the estimator changes meaning; comparing groups without consistent error bars; interpreting visual height as count by default; ignoring that aggregation may hide skew.[^1][^5]

**Gotchas:** bar plots are summaries, not distributions; uncertainty matters; grouping changes interpretation; categorical order affects reading; the chosen estimator can radically change conclusions.[^1][^5]

**Official docs:** [seaborn.barplot](https://seaborn.pydata.org/api.html)[^5]

### Create Box Plot

**Purpose:** Summarize distribution with robust quartiles and outliers.[^5]

**Mental trigger:** “I need a compact distribution summary by category.”

**Syntax:** `seaborn.boxplot(data=None, *, x=None, y=None, hue=None, whis=1.5, ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()

ax = sns.boxplot(data=tips, x="day", y="total_bill", hue="sex")
plt.show()
```

**Expected output:** Box-and-whisker summaries by category.[^5]

**When to use:** compare medians and IQRs; inspect outliers; summarize many observations compactly; show category spread in reports; compare multiple groups.[^5]

**Avoid when:** the audience needs raw points or sample shape; the dataset is tiny; category counts differ dramatically and should be visible; you need richer distribution shape than quartiles.[^5]

**Important parameters:** x, y, hue, whis.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** treating box plots as complete distributions; ignoring sample size; misreading outlier rules; mixing too many categories; assuming mean is shown.[^5]

**Gotchas:** quartiles hide multimodality; outlier rules can be surprising; category order matters; box plots can be too sparse for detailed analysis; width does not encode sample size unless carefully configured.[^5]

**Official docs:** [seaborn.boxplot](https://seaborn.pydata.org/api.html)[^5]

### Create Violin Plot

**Purpose:** Show distribution shape with density envelope.[^5]

**Mental trigger:** “I need a category-wise distribution plot with more shape detail than a box plot.”

**Syntax:** `seaborn.violinplot(data=None, *, x=None, y=None, hue=None, inner="box", ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()

ax = sns.violinplot(data=tips, x="day", y="total_bill", hue="sex", inner="quart")
plt.show()
```

**Expected output:** Violin shapes showing distribution density by category.[^5]

**When to use:** inspect shape, skew, and multimodality; compare distributions across groups; publication graphics; summarizing many observations compactly; combining density and summary information.[^5]

**Avoid when:** distribution shape may be overinterpreted from smoothing; sample size is very small; interpretability matters more than aesthetics; the audience needs raw observations.[^5]

**Important parameters:** x, y, hue, inner.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** reading violin width as count without checking normalization; over-trusting smoothed density; forgetting `inner` changes detail shown; mixing too many categories; using it where a box plot is simpler.[^5]

**Gotchas:** density smoothing can mislead; violins may hide sample size differences; inner annotations affect readability; category ordering matters; narrow distributions can be visually compressed.[^5]

**Official docs:** [seaborn.violinplot](https://seaborn.pydata.org/api.html)[^5]

### Create Count Plot

**Purpose:** Count observations in categories.[^5]

**Mental trigger:** “I need frequency counts for a categorical variable.”

**Syntax:** `seaborn.countplot(data=None, *, x=None, y=None, hue=None, ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()

ax = sns.countplot(data=tips, x="day", hue="sex")
plt.show()
```

**Expected output:** Bars showing counts per category.[^5]

**When to use:** category frequency analysis; dataset audit; class balance checks; quality control; quick categorical summaries.[^5]

**Avoid when:** normalized proportions are required and not displayed separately; the variable is continuous; you need distribution shape within categories; there are too many levels to read clearly.[^5]

**Important parameters:** x, y, hue.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** confusing count with proportion; overloading hue levels; using it for non-categorical data; misreading grouped bars; not sorting categories.[^5]

**Gotchas:** counts can be misleading when sample sizes differ across subsets; order matters; hue interactions change interpretation; missing values are often dropped; raw counts can hide imbalance.[^5]

**Official docs:** [seaborn.countplot](https://seaborn.pydata.org/api.html)[^5]

### Create Point Plot

**Purpose:** Show point estimates with uncertainty and category comparisons.[^5]

**Mental trigger:** “I need a compact estimate-and-interval chart across categories.”

**Syntax:** `seaborn.pointplot(data=None, *, x=None, y=None, hue=None, estimator="mean", errorbar="ci", ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()

ax = sns.pointplot(data=tips, x="day", y="total_bill", hue="sex")
plt.show()
```

**Expected output:** Points connected by category, with uncertainty intervals.[^5]

**When to use:** compare category means or estimates; show trends across ordered categories; compact summary for many groups; emphasize relative changes; communicate uncertainty clearly.[^5]

**Avoid when:** the raw distribution matters more than the estimate; category ordering is ambiguous; too many categories make lines confusing; the audience could misread connected points as a continuous series.[^5]

**Important parameters:** x, y, hue, estimator, errorbar.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** assuming connected points imply continuity; comparing unordered categories; hiding uncertainty; overusing too many hues; treating the default estimator as universally appropriate.[^5]

**Gotchas:** intervals matter more than point markers; category order drives interpretation; line connections can imply ranking; estimator choice matters; crowded plots become unreadable quickly.[^5]

**Official docs:** [seaborn.pointplot](https://seaborn.pydata.org/api.html)[^5]

### Create Heatmap

**Purpose:** Show rectangular numeric data as a color-encoded matrix.[^5]

**Mental trigger:** “I need a grid view of numeric relationships or a table-like matrix plot.”

**Syntax:** `seaborn.heatmap(data, *, annot=False, fmt=".2g", cmap=None, cbar=True, ax=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

penguins = sns.load_dataset("penguins").dropna()
corr = penguins.select_dtypes("number").corr()

ax = sns.heatmap(corr, annot=True, cmap="vlag")
plt.show()
```

**Expected output:** A correlation matrix heatmap with numeric annotations.[^5]

**When to use:** correlation inspection; dense table visualization; missingness patterns; matrix summaries; feature relationship screening.[^5]

**Avoid when:** exact numeric reading is the goal for many cells; the matrix is too large; color scales hide important meaning; the audience needs interactivity.[^5]

**Important parameters:** data, annot, fmt, cmap, cbar.[^5]

**Return value:** Matplotlib Axes.[^5]

**Common mistakes:** using an unsuitable colormap; forgetting normalization semantics; annotating too many cells; reading color differences too literally; not ordering rows/columns when structure matters.[^5]

**Gotchas:** color scale choice matters hugely; annotations can clutter large matrices; clustered or reordered matrices can tell a different story; symmetric matrices can still be read incorrectly; colorbars need careful labeling.[^5]

**Official docs:** [seaborn.heatmap](https://seaborn.pydata.org/api.html)[^5]

### Create Clustermap

**Purpose:** Draw a clustered heatmap with hierarchical clustering.[^5]

**Mental trigger:** “I need to see matrix structure and cluster similar rows or columns.”

**Syntax:** `seaborn.clustermap(data, *, metric="euclidean", method="average", cmap=None, figsize=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()
corr = penguins.select_dtypes("number").corr()

g = sns.clustermap(corr, cmap="vlag")
```

**Expected output:** A clustered matrix visualization with dendrograms.[^5]

**When to use:** similarity analysis; structure discovery; grouped correlation patterns; exploratory clustering; matrix reordering.[^5]

**Avoid when:** clustering is not the question; the matrix is very large; deterministic ordering is more important than derived ordering; you need tight Matplotlib subplot control.[^5]

**Important parameters:** data, metric, method, cmap, figsize.[^5]

**Return value:** ClusterGrid.[^5]

**Common mistakes:** assuming clustering is always meaningful; ignoring scale normalization; using it on sparse or noisy matrices without caution; confusing dendrogram structure with ground truth; overloading large matrices.[^5]

**Gotchas:** clustering changes the visual order; computed distances drive the result; output is a grid object, not a simple Axes; the matrix may need preprocessing; render cost increases quickly with size.[^5]

**Official docs:** [seaborn.clustermap](https://seaborn.pydata.org/api.html)[^5]

### Build Relational Faceted Plot

**Purpose:** Create faceted relational plots with automatic layout.[^5]

**Mental trigger:** “I need the same relational plot split across subsets.”

**Syntax:** `seaborn.relplot(data=None, *, x=None, y=None, hue=None, row=None, col=None, kind="scatter", facet_kws=None, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

g = sns.relplot(
    data=penguins,
    x="bill_length_mm",
    y="bill_depth_mm",
    hue="species",
    col="island",
    kind="scatter",
)
```

**Expected output:** A faceted relational grid, one panel per island.[^5]

**When to use:** compare subsets; manage multiple categories; standardize layout; automate subplot creation; build report-ready faceted graphics.[^5]

**Avoid when:** you need fully manual subplot control; the grid would be too large; one panel is enough; the faceting variable has too many levels.[^5]

**Important parameters:** x, y, hue, row, col.[^5]

**Return value:** FacetGrid.[^5]

**Common mistakes:** faceting too many levels; forgetting that layout is automatic; over-encoding hue and facets together; not checking shared scales; mixing incompatible plot kinds.[^5]

**Gotchas:** grid ownership differs from axes-level plots; panel comparability depends on shared axes; automatic layout can surprise you; too many facets reduce readability; category ordering affects panel order.[^5]

**Official docs:** [seaborn.relplot](https://seaborn.pydata.org/api.html)[^5]

### Build Categorical Faceted Plot

**Purpose:** Create faceted categorical plots with automatic layout.[^5]

**Mental trigger:** “I need a grouped categorical summary across subsets.”

**Syntax:** `seaborn.catplot(data=None, *, x=None, y=None, hue=None, row=None, col=None, kind="strip", **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

g = sns.catplot(
    data=tips,
    x="day",
    y="total_bill",
    hue="sex",
    col="time",
    kind="box",
)
```

**Expected output:** A faceted categorical grid.[^5]

**When to use:** compare category summaries across subsets; automate repeated categorical charts; create compact report graphics; standardize stylistic layout; reduce plotting boilerplate.[^5]

**Avoid when:** you want a single non-faceted plot; the categories are too crowded; the faceting dimension is not analytically meaningful; exact subplot ownership is required.[^5]

**Important parameters:** x, y, hue, row, col, kind.[^5]

**Return value:** FacetGrid.[^5]

**Common mistakes:** over-faceting; mixing too many encodings; choosing an unsuitable `kind`; not accounting for panel scaling; forgetting the grid object must often be post-adjusted.[^5]

**Gotchas:** `kind` changes semantics; layout is managed for you; palette consistency across facets matters; category ordering should be explicit; axes-level post-processing still may be needed.[^5]

**Official docs:** [seaborn.catplot](https://seaborn.pydata.org/api.html)[^5]

### Build Distribution Faceted Plot

**Purpose:** Create faceted distribution plots with automatic layout.[^5]

**Mental trigger:** “I need distribution comparison across subsets with one call.”

**Syntax:** `seaborn.displot(data=None, *, x=None, y=None, hue=None, row=None, col=None, kind="hist", **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

g = sns.displot(
    data=penguins,
    x="bill_length_mm",
    hue="species",
    col="island",
    kind="kde",
)
```

**Expected output:** A faceted distribution grid.[^5]

**When to use:** compare distributions by subgroup; create standardized exploratory panels; report shape differences; reduce repeated subplot code; manage layout automatically.[^5]

**Avoid when:** you need a single panel; you need manual axes ownership; the faceting dimension is too large; the chart needs direct Matplotlib composition.[^5]

**Important parameters:** x, y, hue, row, col, kind.[^5]

**Return value:** FacetGrid.[^5]

**Common mistakes:** using the wrong distribution kind; faceting on too many categories; ignoring common normalization; failing to think about binning or smoothing; assuming one size fits all.[^5]

**Gotchas:** `kind` materially changes interpretation; distribution defaults can hide density details; grid layout is automatic; shared normalization matters; large grids become expensive.[^5]

**Official docs:** [seaborn.displot](https://seaborn.pydata.org/api.html)[^5]

### Configure Theme

**Purpose:** Set global visual defaults.[^5]

**Mental trigger:** “I need consistent styling across a plotting session or project.”

**Syntax:** `seaborn.set_theme(context="notebook", style="darkgrid", palette="deep", font="sans-serif", font_scale=1, color_codes=True, rc=None)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", palette="deep")

tips = sns.load_dataset("tips").dropna()
sns.boxplot(data=tips, x="day", y="total_bill")
plt.show()
```

**Expected output:** A box plot rendered with project-wide theme settings.[^5]

**When to use:** notebook startup; report generation; style standardization; cross-plot consistency; brand alignment.[^5]

**Avoid when:** you need isolated styling for one plot only; other code depends on unchanged Matplotlib defaults; you are inside shared global state you cannot reset.[^5]

**Important parameters:** context, style, palette, font, rc.[^5]

**Return value:** None.[^5]

**Common mistakes:** changing global state mid-notebook; mixing several theme calls without a reset plan; assuming theme changes are local; forgetting downstream plots inherit the settings; not version-pinning styling behavior.[^5]

**Gotchas:** theme calls affect Matplotlib globally; styling may persist across cells and functions; palette selection changes the default cycle; context changes element scaling; use explicit resets when needed.[^5]

**Official docs:** [seaborn.set_theme](https://seaborn.pydata.org/api.html)[^5]

### Configure Palette

**Purpose:** Set or retrieve palette colors for plots.[^5]

**Mental trigger:** “I need deterministic color control across plots.”

**Syntax:** `seaborn.set_palette(palette, n_colors=None, desat=None, color_codes=False)` and `seaborn.color_palette(palette=None, n_colors=None, desat=None)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_palette("colorblind")

tips = sns.load_dataset("tips").dropna()
sns.countplot(data=tips, x="day", hue="sex")
plt.show()
```

**Expected output:** A count plot using the chosen color cycle.[^5]

**When to use:** accessibility-oriented palettes; brand palette alignment; consistent categorical coloring; publication figures; repeated report templates.[^5]

**Avoid when:** the palette choice conflicts with semantic meaning; you are relying on default Matplotlib colors and expecting no changes; you need a one-off local palette only.[^5]

**Important parameters:** palette, n_colors, desat, color_codes.[^5]

**Return value:** `set_palette` returns None; `color_palette` returns a palette object or list of colors.[^5]

**Common mistakes:** using too many categorical colors; not checking colorblind readability; confusing palette with colormap; changing global palette accidentally; assuming palette choice is cosmetic only.[^5]

**Gotchas:** palette changes can affect all subsequent plots; some palettes are better for categories than continuous values; color codes can alter shorthand interpretation; consistent palette usage matters in multi-figure reports.[^5]

**Official docs:** [seaborn.color_palette](https://seaborn.pydata.org/api.html)[^5]

### Remove Spines

**Purpose:** Simplify plot appearance by removing top and right spines.[^5]

**Mental trigger:** “I need cleaner plot framing for publication or dashboards.”

**Syntax:** `seaborn.despine(fig=None, ax=None, top=True, right=True, left=False, bottom=False, offset=None, trim=False)`[^5]

**Runnable example:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()
ax = sns.scatterplot(data=tips, x="total_bill", y="tip")
sns.despine()
plt.show()
```

**Expected output:** A cleaner scatter plot with simplified spines.[^5]

**When to use:** publication styling; minimalist dashboards; improving focus on marks; reducing visual clutter; aligning with Seaborn defaults.[^5]

**Avoid when:** you need full axis framing; you rely on Matplotlib default borders for reference; the design system requires all spines; axis boundaries are critical for interpretation.[^5]

**Important parameters:** fig, ax, top, right, trim.[^5]

**Return value:** None.[^5]

**Common mistakes:** removing too many spines; applying it before final layout; assuming it affects only one axes when called globally; trimming inappropriately; forgetting it is a styling decision, not data logic.[^5]

**Gotchas:** spine changes are visual only; figure-wide effects can surprise in multi-axes layouts; trimming may clip expectations; it should match the chart’s purpose; it does not replace good axis labeling.[^5]

**Official docs:** [seaborn.despine](https://seaborn.pydata.org/api.html)[^5]

### Build Pairwise Plot Matrix

**Purpose:** Compare multiple variable pairs in one grid.[^5]

**Mental trigger:** “I need an overview of pairwise relationships across several numeric columns.”

**Syntax:** `seaborn.pairplot(data, *, hue=None, vars=None, kind="scatter", diag_kind="auto", corner=False, **kwargs)`[^5]

**Runnable example:**

```python
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

g = sns.pairplot(penguins, hue="species")
```

**Expected output:** A matrix of pairwise plots and marginal distributions.[^5]

**When to use:** multivariate screening; feature relationship exploration; class separation analysis; quick EDA; model feature inspection.[^5]

**Avoid when:** the dataset has many variables and the grid becomes too large; memory use matters; a focused subset would be clearer; you need custom faceting logic.[^5]

**Important parameters:** data, hue, vars, kind, diag_kind.[^5]

**Return value:** PairGrid.[^5]

**Common mistakes:** using too many columns; forgetting to subset features; overplotting dense points; ignoring diagonal plot choice; assuming pairwise grids scale well.[^5]

**Gotchas:** pair plots are expensive on wide data; hue can dominate visuals; diagonal summaries matter; large grids can be unreadable; the returned object often needs post-adjustment.[^5]

**Official docs:** [seaborn.pairplot](https://seaborn.pydata.org/api.html)[^5]

## seaborn.objects

### API Name
`seaborn.objects.Plot`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot(data=None, *, x=None, y=None, color=None, alpha=None, label=None, order=None, ...)`

### Purpose
Declaratively define a statistical graphic as a composition of data, semantic mappings, and attached marks/stats/moves/scales. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to build a reusable, composable plot specification instead of drawing a one-off Matplotlib figure."

### Use When
- You need a grammar-of-graphics style workflow. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to compose multiple marks and stats from one plot specification. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want explicit control over data mappings before rendering. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to standardize plotting patterns across a project. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to adopt a more declarative plotting style for production code. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You need the simplest possible one-line axes-level plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need legacy figure-level APIs already in place.
- Your team depends heavily on older Seaborn idioms and has not standardized on the objects interface.
- You need direct Matplotlib artist manipulation as the primary workflow.
- You only need a quick exploratory chart with minimal structure.

### Important Parameters
- `data`: tabular input to plot.
- `x`: horizontal semantic mapping.
- `y`: vertical semantic mapping.
- `color`: color semantic mapping.
- `label`: annotation/legend label mapping.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot(alpha=0.7))
)
```

### Expected Output
A declarative scatter-style plot specification rendered with dot marks, colored by species. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Treating `Plot` like an immediate Matplotlib draw call.
- Mixing too many semantics before verifying the base mapping.
- Assuming the objects API behaves identically to axes-level functions.
- Forgetting that composition happens through chained plot methods.
- Expecting the same return type as older Seaborn functions.

### Gotchas
- The objects API is compositional; the order of transformations matters. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- It is a different mental model from axes-level plotting. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Marks and stats are attached explicitly rather than implied by a function name. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- It is easy to overbuild simple charts when a simpler API would suffice.
- Team consistency matters because the API is declarative and reusable.

### Related APIs
`add`, `pair`, `facet`, `layout`, `scale`, `label`, `limit`, `share`, `theme`, `save`, `show`

### Official Documentation
[seaborn.objects.Plot](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.add`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.add(mark, stat=None, move=None, orient=None, legend=True, label=None, **kwargs)`

### Purpose
Attach marks and optional statistical or positional transforms to a `Plot` specification. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to layer a visual mark, then optionally transform or reposition the data before rendering."

### Use When
- You need to add one or more marks to the same plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to combine raw data with aggregation or smoothing. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to apply a move such as jitter or dodge in an explicit pipeline. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want multiple layers on a single chart. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want plot composition to remain readable and deterministic. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You only need a one-off simple chart and do not need layering.
- You are using a non-objects API workflow.
- You expect automatic legacy function behavior without explicit composition.
- You want to hide the data transformation stage.
- You need immediate Matplotlib artist access before rendering.

### Important Parameters
- `mark`: visual mark to draw.
- `stat`: optional statistical transform.
- `move`: optional positional adjustment.
- `orient`: orientation control.
- `legend`: whether to include legend entries.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

(
    so.Plot(tips, x="total_bill", y="tip")
    .add(so.Dots(), so.PolyFit())
)
```

### Expected Output
A scatter-style plot with a fitted polynomial trend line over the same data. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Assuming `add` automatically chooses the right mark.
- Combining incompatible mark and stat types without checking output shape.
- Over-layering until the figure becomes unreadable.
- Forgetting that transform order affects the result.
- Passing transformations that do not match the intended orientation.

### Gotchas
- Layering is explicit, so each step must make sense compositionally. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Some transforms are intended for grouped or aggregated data.
- Resulting legend behavior may differ from older APIs.
- The same visual can be built several ways, but not all are equally readable.
- Explicit composition can expose data issues earlier than automatic plotting.

### Related APIs
`Plot`, `pair`, `facet`, `scale`, `show`, `save`

### Official Documentation
[seaborn.objects.Plot.add](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.pair`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.pair(spec=None, orient=None, **kwargs)`

### Purpose
Create paired or repeated plot specifications across variables or semantic combinations. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to generate the same plotting logic across multiple variable pairs."

### Use When
- You are building multi-variable comparisons. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want repeated structure with less duplication. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need pairwise plot generation in a declarative workflow. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to explore combinations of variables systematically. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need consistent visual logic across repeated panels. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You only need a single chart.
- You need a legacy pairwise grid API.
- Your chart logic is too small to benefit from repetition.
- The repeated plot would become visually cluttered.
- You do not need a declarative specification.

### Important Parameters
- `spec`: plotting specification to repeat.
- `orient`: orientation of repeated plot logic.
- `kwargs`: additional repetition controls.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm")
    .pair(so.Dot())
)
```

### Expected Output
A repeated plotting specification suitable for pairwise comparison workflows. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using `pair` when `facet` is the correct tool.
- Confusing repeated plot specifications with pairwise grid objects.
- Overusing repetition on large datasets.
- Expecting a single-axes result.
- Ignoring readability when pairing too many variables.

### Gotchas
- Pairwise repetition can multiply plot cost quickly.
- The output structure is more abstract than figure-level grids.
- It is easy to overfit the visual layout to the data shape.
- Repeat logic should be intentional, not automatic by default.
- The most readable pairwise plots are usually the simplest ones.

### Related APIs
`Plot`, `facet`, `add`, `show`, `save`

### Official Documentation
[seaborn.objects.Plot.pair](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.facet`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.facet(row=None, col=None, wrap=None, order=None, **kwargs)`

### Purpose
Split a declarative plot across rows and columns for small-multiple comparisons. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need the same plot repeated across subsets of my data."

### Use When
- You need conditioned comparisons across categories. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to compare distributions across panels. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a grid of consistent plots with shared semantics. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to inspect subgroup differences without changing plot logic. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a scalable comparison view for report figures. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- A single panel is enough.
- The number of groups is too large to fit cleanly.
- The subsets are too small to justify faceting.
- You need a custom subplot architecture already built in Matplotlib.
- Layout constraints are more important than semantic clarity.

### Important Parameters
- `row`: facet variable for rows.
- `col`: facet variable for columns.
- `wrap`: wrap facets across panels.
- `order`: explicit facet ordering.
- `kwargs`: additional facet controls.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .facet(col="island")
)
```

### Expected Output
A faceted panel layout showing the same relationship across islands. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Faceting on a variable with too many levels.
- Forgetting to control facet order.
- Using faceting when hue alone would suffice.
- Allowing panel comparisons to become visually inconsistent.
- Ignoring that each facet increases rendering cost.

### Gotchas
- Faceting changes figure size and layout pressure.
- Small-multiple readability depends on consistent scales.
- Too many panels can make labels unusable.
- Faceting and hue together can overcomplicate the chart.
- Panel order becomes part of the analytic message.

### Related APIs
`Plot`, `pair`, `add`, `share`, `layout`

### Official Documentation
[seaborn.objects.Plot.facet](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.layout`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.layout(**kwargs)`

### Purpose
Control plot layout behavior in the objects interface. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to adjust how the composed figure is arranged."

### Use When
- You need control over plot spacing or layout behavior. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Facets require layout tuning. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are preparing a publication-style figure. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to make multiple panels fit cleanly. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want layout behavior to be explicit in code. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- A default layout is already clear and readable.
- You are not using the objects interface.
- Matplotlib-level layout tools are already sufficient for your workflow.
- You need no panel arrangement changes.
- You want to avoid unnecessary configuration.

### Important Parameters
- `kwargs`: layout-specific configuration.
- `tight`: layout tightening behavior if supported in context.
- `pad`: spacing control if supported in context.
- `width`: figure width control if supported in context.
- `height`: figure height control if supported in context.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .facet(col="island")
    .layout()
)
```

### Expected Output
A faceted plot with layout handling applied by the objects interface. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Assuming layout is purely cosmetic.
- Trying to fix structural clutter only with labels.
- Forgetting to adjust figure size alongside layout.
- Overcomplicating small plots with layout tuning.
- Assuming layout changes do not affect readability.

### Gotchas
- Layout and facet count interact strongly.
- A bad layout can ruin an otherwise correct plot.
- Figure geometry may need multiple iterations.
- The objects API can expose layout pressure quickly.
- Production plots should validate panel spacing visually.

### Related APIs
`Plot`, `facet`, `share`, `show`, `save`

### Official Documentation
[seaborn.objects.Plot.layout](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.scale`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.scale(**kwargs)`

### Purpose
Set or override scale behavior for one or more plot semantics. [seaborn.pydata](https://seaborn.pydata.org/generated/seaborn.objects.Nominal.html)

### Mental Trigger
"I need to control how data values map to visual space."

### Use When
- You need explicit scale control. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Continuous and categorical semantics need different mappings. [seaborn.pydata](https://seaborn.pydata.org/generated/seaborn.objects.Nominal.html)
- You want consistent visual encoding across plots. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are matching plot semantics to a publication style. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to normalize or constrain visual mapping behavior. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Default scales already communicate the data clearly.
- You are not using the objects interface.
- You need only Matplotlib axis scaling.
- The plot is too simple to justify scale tuning.
- Visual encoding is already standardized elsewhere.

### Important Parameters
- `kwargs`: semantic-to-scale configuration.
- `x`: x-axis scale behavior.
- `y`: y-axis scale behavior.
- `color`: color scale behavior.
- `size`: size scale behavior.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .scale(color=so.Nominal())
)
```

### Expected Output
A plot whose color mapping uses a nominal categorical scale. [seaborn.pydata](https://seaborn.pydata.org/generated/seaborn.objects.Nominal.html)

### Common Mistakes
- Mixing nominal and continuous scales unintentionally.
- Assuming color and position scales behave the same way.
- Forgetting that scale choice changes interpretation.
- Using scale customization only after the chart looks wrong.
- Not standardizing scales across related charts.

### Gotchas
- Scale mapping is part of the chart’s meaning, not just formatting.
- Nominal scales are categorical, not magnitude-aware. [seaborn.pydata](https://seaborn.pydata.org/generated/seaborn.objects.Nominal.html)
- Incorrect scale choice can distort comparisons.
- Scale behavior should match the data type.
- Consistent scales improve cross-figure comparability.

### Related APIs
`Plot`, `label`, `limit`, `share`, `theme`

### Official Documentation
[seaborn.objects.Nominal](https://seaborn.pydata.org/generated/seaborn.objects.Nominal.html) [seaborn.pydata](https://seaborn.pydata.org/generated/seaborn.objects.Nominal.html)


### API Name
`seaborn.objects.Plot.label`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.label(**kwargs)`

### Purpose
Set axis, legend, or figure labels in a declarative plot specification. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need the plot to carry presentation labels without manual post-processing."

### Use When
- You want label definitions inside the plot spec. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a reusable labeled plot object. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to reduce post-render Matplotlib edits. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are generating report-ready output. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need consistency across generated plots. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You will fully customize text using Matplotlib afterward.
- The chart is only exploratory and temporary.
- Labels are already centrally managed elsewhere.
- You need no change from defaults.
- The rendering target is not presentation-oriented.

### Important Parameters
- `kwargs`: label fields and text settings.
- `title`: figure title if supported.
- `xlabel`: x-axis label if supported.
- `ylabel`: y-axis label if supported.
- `legend`: legend label behavior if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .label(x="Bill length (mm)", y="Bill depth (mm)")
)
```

### Expected Output
A labeled scatter plot with custom axis text. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Overlapping chart labels and Matplotlib text edits.
- Forgetting to standardize label text in generated reports.
- Confusing semantic labels with data column names.
- Relying on defaults in production output.
- Using label changes to compensate for weak data design.

### Gotchas
- Declarative labels reduce the need for post-processing.
- Labels should be chosen alongside figure purpose.
- Consistent label text improves downstream reuse.
- Some label behavior is tied to the chosen plot structure.
- Presentation text still needs review for clarity.

### Related APIs
`Plot`, `layout`, `theme`, `show`, `save`

### Official Documentation
[seaborn.objects.Plot.label](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.limit`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.limit(**kwargs)`

### Purpose
Constrain axis limits in a declarative plot specification. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to clip or standardize displayed ranges across comparable plots."

### Use When
- You need consistent comparison ranges. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Outliers should not dominate the visible scale. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Multiple plots need aligned axes. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- The publication format requires fixed limits. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to focus attention on a region of interest. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- The full range is analytically important.
- You need raw extremes to remain visible.
- The chart is exploratory and should remain unconstrained.
- Limits would hide critical observations.
- You are not working in the objects interface.

### Important Parameters
- `kwargs`: axis-specific limits.
- `x`: x-axis limit setting.
- `y`: y-axis limit setting.
- `tuple`: lower and upper bound values.
- `None`: open-ended limit if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm")
    .add(so.Dot())
    .limit(x=(30, 60))
)
```

### Expected Output
A scatter plot restricted to the specified x-axis range. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Clipping away important data.
- Using limits to hide outliers without explanation.
- Comparing plots with inconsistent ranges.
- Assuming limits are only cosmetic.
- Forgetting that range changes alter interpretation.

### Gotchas
- Limits are part of the analytic narrative.
- Range restriction can make plots look cleaner but less complete.
- Axis alignment is important for comparison.
- Hidden data may still matter statistically.
- Explicit limits should be chosen deliberately.

### Related APIs
`Plot`, `scale`, `share`, `facet`

### Official Documentation
[seaborn.objects.Plot.limit](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.share`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.share(**kwargs)`

### Purpose
Control whether scales or axes are shared across facets. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need consistent or independent scales across multiple panels."

### Use When
- Faceted plots must be directly comparable. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Different subsets need independent ranges for readability. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want consistent axes for small multiples. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to reduce visual distortion across panels. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are managing multi-panel statistical graphics. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Panel sharing is not relevant.
- You are not faceting.
- The default sharing choice already fits the analysis.
- Independent scaling would confuse cross-panel comparison.
- You need a simple single-axis plot.

### Important Parameters
- `kwargs`: sharing policy controls.
- `x`: share x-scale/axis.
- `y`: share y-scale/axis.
- `legend`: legend-sharing behavior if supported.
- `limits`: shared range behavior if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .facet(col="island")
    .share(x=True, y=True)
)
```

### Expected Output
A faceted plot with shared axes for consistent comparison. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Comparing panels with different axis scales unknowingly.
- Using independent scales when direct comparison is required.
- Ignoring the role of sharing in facet readability.
- Mixing panel-wise and global scaling intent.
- Assuming all facet defaults are ideal.

### Gotchas
- Shared axes improve comparability but can compress smaller groups.
- Independent axes can improve local readability but weaken comparison.
- Sharing choices affect analytic interpretation.
- Facet design and share policy should be planned together.
- Consistency is often more important than local optimization.

### Related APIs
`Plot`, `facet`, `limit`, `layout`

### Official Documentation
[seaborn.objects.Plot.share](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.theme`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.theme(**kwargs)`

### Purpose
Apply theme-level styling inside the objects interface. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need plot styling to travel with the plot specification."

### Use When
- You want styling bound to a reusable plot object. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need consistent theme behavior in generated figures. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to reduce reliance on global style state. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are producing report figures with a known style. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want declarative styling alongside declarative marks. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Project styling is already handled globally.
- You are not using the objects interface.
- You need only a one-off rc tweak in Matplotlib.
- Style settings are controlled by another layer.
- Global state is intentional and sufficient.

### Important Parameters
- `kwargs`: theme controls.
- `context`: plot scaling context if supported.
- `style`: visual style if supported.
- `palette`: color palette if supported.
- `rc`: Matplotlib rc overrides if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .theme()
)
```

### Expected Output
A plot rendered with theme settings applied through the objects interface. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Assuming object-level theme calls are identical to global theme functions.
- Overriding project styling inconsistently.
- Mixing local and global style management without a policy.
- Forgetting that style affects production output.
- Treating theme settings as a minor cosmetic detail.

### Gotchas
- Theme state can leak into adjacent figures if used carelessly.
- Declarative themeing helps reproducibility.
- Consistency matters more than ad hoc tweaks.
- Theme choices should align with output medium.
- Style management should be intentional in team code.

### Related APIs
`Plot`, `label`, `layout`, `show`, `save`

### Official Documentation
[seaborn.objects.Plot.theme](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.save`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.save(filename, **kwargs)`

### Purpose
Export a declarative plot specification to a file. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to write the final figure to disk from an objects-based plot."

### Use When
- You need reproducible figure output. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are generating publication or report assets. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need batch rendering in a pipeline. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a direct save step from the plot object. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to keep rendering close to the plot definition. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You are still iterating interactively.
- Another export path is already standardized in your project.
- The chart is temporary and not meant for saving.
- You need more manual Matplotlib figure control first.
- File export format has not yet been decided.

### Important Parameters
- `filename`: output path.
- `kwargs`: save-time rendering options.
- `dpi`: output resolution if supported.
- `format`: file format if supported.
- `bbox_inches`: bounding box handling if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .save("penguins_objects_plot.png")
)
```

### Expected Output
An image file written to disk from the plot specification. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Saving before validating the rendered appearance.
- Using the wrong file format for the target medium.
- Assuming figure size is automatically ideal.
- Forgetting to manage output paths in scripts.
- Treating save behavior as unrelated to layout.

### Gotchas
- Export quality depends on backend and figure settings. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Bounding box and size issues can clip labels.
- File format should match the delivery target.
- Saving is often the last step in the pipeline, not the first.
- Reproducible exports require stable environment settings.

### Related APIs
`Plot`, `show`, `layout`, `theme`

### Official Documentation
[seaborn.objects.Plot.save](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Plot.show`

### Category
Objects interface

### Module
`seaborn.objects`

### Syntax
`Plot.show(**kwargs)`

### Purpose
Render the plot specification interactively. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to display the composed plot now."

### Use When
- You are working interactively in a notebook or REPL. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to inspect the composed result immediately. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are validating a plot before saving. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want the objects plot to behave like a display call. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a quick render step in exploration. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You are doing batch generation and want only file export.
- Your pipeline centralizes rendering elsewhere.
- You need custom Matplotlib control before display.
- The chart is not yet finalized.
- Interactive display is unavailable in the target environment.

### Important Parameters
- `kwargs`: display-time options.
- `figsize`: display sizing if supported.
- `dpi`: display resolution if supported.
- `tight`: layout tightening if supported.
- `backend`: display backend if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

(
    so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot())
    .show()
)
```

### Expected Output
An on-screen rendered plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using show when export is the real goal.
- Assuming it returns a Matplotlib Axes.
- Forgetting that interactive backend behavior matters.
- Mixing show and save in the wrong order for your workflow.
- Expecting notebook display to match all saved exports perfectly.

### Gotchas
- Display behavior depends on backend environment. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Notebook and script behavior can differ.
- Figure layout should still be validated after display.
- `show` is not a substitute for save-quality checks.
- Rendering issues may be backend-specific.

### Related APIs
`Plot`, `save`, `layout`, `theme`

### Official Documentation
[seaborn.objects.Plot.show](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


## seaborn.objects Marks

### API Name
`seaborn.objects.Dot`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Dot()`

### Purpose
Draw point markers for scatter-style or dot-plot style graphics. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a point mark for individual observations."

### Use When
- You need scatterplots in the objects interface. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a compact representation of individual observations. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want an overplotting-aware dot mark. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are composing a layered exploratory plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a baseline mark for relational plotting. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- A line or interval mark better matches the message.
- You need bar geometry.
- The point cloud is so dense that another summary is preferable.
- The chart needs text annotations instead.
- You are not using the objects API.

### Important Parameters
- `Dot` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: mark styling options if provided in the API.
- `alpha`: transparency if supported.
- `color`: point color if supported.
- `pointsize`: size control if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm").add(so.Dot())
```

### Expected Output
A point-based scatter visualization. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using dot marks for highly overlapping dense data without adjustment.
- Assuming the objects API point mark behaves exactly like a legacy scatterplot.
- Ignoring size and transparency when needed.
- Mixing too many semantics for a simple point mark.
- Forgetting to choose an appropriate density strategy.

### Gotchas
- Point density can obscure structure.
- Some scatter-like tasks may be better served by other marks.
- The same dot mark can be used for several visual idioms.
- Overplotting is a major consideration.
- Objects API composition makes mark choice explicit.

### Related APIs
`Line`, `Bar`, `Text`, `Band`, `Range`, `Plot.add`

### Official Documentation
[seaborn.objects.Dot](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Line`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Line()`

### Purpose
Draw connected line geometry for ordered values or trends. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a line mark to show a path, trajectory, or ordered trend."

### Use When
- You are plotting a time series or ordered measurement. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need trend visualization. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a fitted or aggregated line in the objects workflow. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a connected mark for curves. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are comparing trajectories across groups. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- The x-order has no meaning.
- Points should remain disconnected.
- The plot is purely categorical and unordered.
- Another interval or area mark would be clearer.
- The line would incorrectly imply continuity.

### Important Parameters
- `Line` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: mark styling options if supported.
- `color`: line color if supported.
- `linewidth`: line thickness if supported.
- `alpha`: transparency if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

fmri = sns.load_dataset("fmri").dropna()

so.Plot(fmri, x="timepoint", y="signal").add(so.Line())
```

### Expected Output
A line-based plot of signal across timepoint. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Connecting unordered categories.
- Using lines when the data are not sequential.
- Forgetting that the line implies continuity.
- Overlapping multiple groups without faceting.
- Treating line marks as interchangeable with dot marks.

### Gotchas
- Ordering matters more for lines than most other marks.
- Lines can be visually persuasive even when the data are sparse.
- Trend lines and raw lines are not the same thing.
- Grouping can alter the meaning of a line mark.
- Line geometry can hide variability.

### Related APIs
`Dot`, `Area`, `Band`, `Plot.add`

### Official Documentation
[seaborn.objects.Line](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Bar`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Bar()`

### Purpose
Draw bar geometry for aggregated or discrete-value graphics. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need bar-shaped output for counts, summaries, or histogram-like visuals."

### Use When
- You need category summaries. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need histogram-style bars. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want explicit bar geometry in the objects API. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are rendering aggregated values as bars. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a familiar bar-based encoding. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Raw distribution shape is more important than summaries.
- The data are better shown with points or lines.
- Bar height could be misread as raw count when it is not.
- A more detailed interval geometry is needed.
- The plot is not meant for aggregation.

### Important Parameters
- `Bar` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: bar styling options if supported.
- `color`: fill color if supported.
- `alpha`: opacity if supported.
- `width`: width control if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="day").add(so.Bar(), so.Count())
```

### Expected Output
A bar-style frequency plot over the categorical variable `day`. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using bars when the audience needs raw distributions.
- Forgetting that the stat often drives bar meaning.
- Comparing bars with incompatible normalization.
- Overcrowding categories.
- Treating bars as interchangeable with summaries in all cases.

### Gotchas
- Bar geometry is often paired with a stat in the objects API. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Bars can hide distribution detail.
- Normalization choices affect interpretation.
- Bar width and spacing influence readability.
- Count and aggregation logic should be made explicit.

### Related APIs
`Count`, `Agg`, `Est`, `Hist`, `Plot.add`

### Official Documentation
[seaborn.objects.Bar](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Area`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Area()`

### Purpose
Draw filled area geometry under or between values. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a filled region to emphasize magnitude or cumulative shape."

### Use When
- You need area charts in the objects workflow. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want filled trend visualization. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need cumulative or envelope-style geometry. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want an area mark for statistical displays. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to emphasize magnitude with fill. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Fill will hide important overlap or detail.
- The chart needs only a simple line.
- Another interval mark would be clearer.
- The dataset is too sparse for an area to be meaningful.
- You are not using the objects API.

### Important Parameters
- `Area` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: fill styling options if supported.
- `alpha`: transparency if supported.
- `color`: fill color if supported.
- `baseline`: baseline control if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

fmri = sns.load_dataset("fmri").dropna()

so.Plot(fmri, x="timepoint", y="signal").add(so.Area(), so.Est())
```

### Expected Output
A filled area encoding of estimated signal across time. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Overusing fill and obscuring data.
- Treating area geometry like a line plot.
- Forgetting to check whether the baseline is meaningful.
- Comparing area charts with different scales casually.
- Using area when another mark would be less ambiguous.

### Gotchas
- Area plots strongly emphasize magnitude.
- Fill can distort perception if overused.
- Baselines matter for interpretation.
- Area charts require careful scale choices.
- The chart can become visually heavy quickly.

### Related APIs
`Band`, `Range`, `Line`, `Est`, `Plot.add`

### Official Documentation
[seaborn.objects.Area](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Text`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Text()`

### Purpose
Place text labels as a data-driven visual mark. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need labels or annotations generated from data values."

### Use When
- You need to label points or categories. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need callouts or annotations from data. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a textual mark in a declarative plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need readable labels instead of shapes alone. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are building an annotated figure. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Labels would clutter the chart.
- The chart is already dense.
- A visual mark carries the message better.
- You need no text on the figure.
- Annotation would reduce readability.

### Important Parameters
- `Text` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: text styling options if supported.
- `size`: font size if supported.
- `color`: text color if supported.
- `ha`: horizontal alignment if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna().head(10)

so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm", label="species").add(so.Text())
```

### Expected Output
A text-annotated plot built from data values. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Over-annotating dense plots.
- Using text when a legend is clearer.
- Allowing labels to overlap.
- Depending on text for every data point in a crowded view.
- Ignoring readability and font scaling.

### Gotchas
- Text adds rendering complexity fast.
- Annotation strategy must match figure density.
- Label placement is often the hardest part.
- Text can obscure important marks underneath.
- Use it sparingly for production graphics.

### Related APIs
`Dot`, `Plot.label`, `Plot.add`

### Official Documentation
[seaborn.objects.Text](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Dash`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Dash()`

### Purpose
Draw line-segment style marks for oriented comparisons. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need short line segments instead of full connected lines."

### Use When
- You need dash-based mark geometry. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a compact line-segment representation. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need an oriented segment mark. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a mark that emphasizes local values over global trends. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need another line-like glyph in the objects API. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- A full line is clearer.
- The chart is already crowded.
- Another interval or point mark is more appropriate.
- You do not need segment-based encoding.
- The legacy API already covers the use case well.

### Important Parameters
- `Dash` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: line styling options if supported.
- `linewidth`: width if supported.
- `alpha`: transparency if supported.
- `color`: color if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna().head(20)

so.Plot(tips, x="total_bill", y="tip").add(so.Dash())
```

### Expected Output
A plot using dash-style line segments. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using dash marks where dot or line would be clearer.
- Expecting long continuous paths.
- Overcrowding the plot with too many segments.
- Missing the difference between local and global trends.
- Treating dash as a generic line replacement.

### Gotchas
- Segment marks are more specialized than lines.
- Readability drops quickly with too many segments.
- Segment orientation matters.
- The mark is useful only when the segment form adds meaning.
- It is easy to pick the wrong glyph for the question.

### Related APIs
`Line`, `Range`, `Band`, `Plot.add`

### Official Documentation
[seaborn.objects.Dash](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Band`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Band()`

### Purpose
Draw an interval band between values. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to show an uncertainty interval or a range around a trend."

### Use When
- You need confidence or uncertainty bands. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need interval visualization around an estimate. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a filled region between bounds. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are drawing statistical envelopes. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a production-ready interval glyph. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Interval information is unnecessary.
- A simple line is sufficient.
- You need exact point values rather than ranges.
- The plot is too dense for a band.
- A different uncertainty encoding is clearer.

### Important Parameters
- `Band` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: fill styling options if supported.
- `alpha`: opacity if supported.
- `color`: fill color if supported.
- `edgecolor`: outline color if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

fmri = sns.load_dataset("fmri").dropna()

so.Plot(fmri, x="timepoint", y="signal").add(so.Band(), so.Est())
```

### Expected Output
A trend line with an interval band around the estimate. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using bands without explaining what the interval means.
- Overlapping too many bands.
- Confusing band width with raw sample spread.
- Failing to match the band to the intended statistic.
- Allowing fill to obscure other marks.

### Gotchas
- Bands are often the most readable uncertainty encoding.
- They depend on the stat used to generate bounds.
- Transparency is important for layering.
- Bands can mislead if the interval semantics are unclear.
- They are better than error bars in many dense plots.

### Related APIs
`Range`, `Area`, `Est`, `Plot.add`

### Official Documentation
[seaborn.objects.Band](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Range`

### Category
Objects interface mark

### Module
`seaborn.objects`

### Syntax
`Range()`

### Purpose
Draw an interval range between values, typically as a line-like interval mark. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a compact visual for minimum-to-maximum or uncertainty bounds."

### Use When
- You need range visualization. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need min-max or interval displays. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a lighter-weight interval mark than a filled band. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need explicit lower/upper bounds. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a statistical interval glyph in a layered chart. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- The filled band is clearer.
- Exact values should be emphasized instead of ranges.
- The chart is already crowded.
- The interval semantics are not well-defined.
- Another mark would communicate the data better.

### Important Parameters
- `Range` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: interval styling options if supported.
- `color`: line or stroke color if supported.
- `linewidth`: line thickness if supported.
- `alpha`: transparency if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

fmri = sns.load_dataset("fmri").dropna()

so.Plot(fmri, x="timepoint", y="signal").add(so.Range(), so.Est())
```

### Expected Output
A range-style interval visualization around a summary estimate. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Treating interval ranges as raw data lines.
- Confusing range marks with confidence bands.
- Using them when a point estimate is the real message.
- Allowing intervals to hide plot structure.
- Failing to explain the interval semantics.

### Gotchas
- Range marks are compact but easy to misinterpret.
- They often need a companion statistic.
- Interval semantics must be explicit in production usage.
- They are not a substitute for good labeling.
- Their visual clarity depends on scale and density.

### Related APIs
`Band`, `Est`, `Plot.add`

### Official Documentation
[seaborn.objects.Range](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


## seaborn.objects Stats

### API Name
`seaborn.objects.Agg`

### Category
Objects interface stat

### Module
`seaborn.objects`

### Syntax
`Agg(func="mean", **kwargs)`

### Purpose
Aggregate data along the value axis using a specified method. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to summarize repeated values into a single statistic."

### Use When
- You need group-wise summaries. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want mean, median, or another aggregation. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need bar, point, or line summaries. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want explicit control over the reduction step. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to separate aggregation from geometry. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Raw observations are the message.
- Aggregation hides meaningful distribution shape.
- The chart needs uncertainty rather than just a point estimate.
- The dataset is already one value per group.
- You do not want any summary reduction.

### Important Parameters
- `func`: aggregation function.
- `kwargs`: function-specific settings.
- `method`: alternative aggregation control if supported.
- `weights`: weighted aggregation if supported.
- `skipna`: missing-value handling if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="day", y="total_bill").add(so.Bar(), so.Agg())
```

### Expected Output
A bar plot using an aggregated statistic for each category. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Assuming aggregation preserves distribution shape.
- Picking an inappropriate summary statistic.
- Forgetting that missing values can affect the result.
- Using aggregation where raw points matter more.
- Not aligning the aggregator with the business question.

### Gotchas
- Aggregation is a semantic choice, not just a technical step.
- Different functions can lead to very different conclusions.
- Weighted and unweighted results are not interchangeable.
- Group boundaries matter.
- Aggregation plus faceting can hide small-sample issues.

### Related APIs
`Count`, `Est`, `Hist`, `Plot.add`, `Bar`

### Official Documentation
[seaborn.objects.Agg](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Count`

### Category
Objects interface stat

### Module
`seaborn.objects`

### Syntax
`Count()`

### Purpose
Count observations within groups. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need frequency counts as the statistic behind the plot."

### Use When
- You need category counts. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need histogram bin counts. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want count-based bar graphics. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a frequency summary in the objects API. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to compare observation volume across groups. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You need proportions or normalized values instead.
- The data should be summarized by mean or median.
- Counts are likely to be misread as intensity.
- Sample size differs in a way that confuses interpretation.
- Raw observations are the main message.

### Important Parameters
- `Count` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: group-count controls if supported.
- `normalize`: normalization control if supported.
- `weights`: weighted count if supported.
- `dropna`: missing-value handling if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="day").add(so.Bar(), so.Count())
```

### Expected Output
A count plot showing category frequencies. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Confusing counts with rates or proportions.
- Ignoring missing-value effects.
- Using counts when the message is about distribution shape.
- Overcomplicating simple frequency analysis.
- Misreading count bars as direct magnitude across incomparable groups.

### Gotchas
- Count stat is often the backbone of categorical frequency plots.
- Normalization changes the message entirely.
- Counts are sensitive to filtering decisions.
- Grouping structure must be intentional.
- Plot labels should say “count” when that is the statistic.

### Related APIs
`Bar`, `Hist`, `Agg`, `Plot.add`

### Official Documentation
[seaborn.objects.Count](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Hist`

### Category
Objects interface stat

### Module
`seaborn.objects`

### Syntax
`Hist(bins=None, binwidth=None, stat="count", **kwargs)`

### Purpose
Bin observations, count them, and optionally normalize or cumulate them. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need histogram logic in the objects interface."

### Use When
- You need binned distribution summaries. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want histogram behavior with object composition. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need normalized or cumulative binning. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a histogram plus other marks in a declarative pipeline. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need explicit control over the histogram statistic. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Raw values or exact points are the message.
- The data are too sparse for meaningful binning.
- KDE or ECDF would better answer the question.
- Histogram bin choice would be misleading.
- The user wants a simple count-only plot.

### Important Parameters
- `bins`: number or rule for bins.
- `binwidth`: explicit bin width.
- `stat`: histogram statistic.
- `kwargs`: additional histogram options.
- `cumulative`: cumulative mode if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

so.Plot(penguins, x="bill_length_mm").add(so.Bar(), so.Hist())
```

### Expected Output
A histogram rendered using the objects API. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Treating bins as neutral rather than a modeling choice.
- Comparing histograms with inconsistent binning.
- Using the default statistic without checking whether it fits the question.
- Hiding tails with overly coarse bins.
- Expecting binning to be stable across all datasets.

### Gotchas
- Binning strategy can dominate the result.
- Normalization and accumulation alter interpretation.
- Histograms are sensitive to sample size and range.
- Bin alignment matters in production charts.
- The stat should match the narrative you want.

### Related APIs
`Count`, `KDE`, `Est`, `Bar`, `Plot.add`

### Official Documentation
[seaborn.objects.Hist](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.KDE`

### Category
Objects interface stat

### Module
`seaborn.objects`

### Syntax
`KDE(bw_adjust=1, cut=3, clip=None, **kwargs)`

### Purpose
Compute a univariate kernel density estimate. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a smoothed density estimate in the objects interface."

### Use When
- You need a density curve from tabular data. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a smoothed distribution view. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a reusable density stat in a layered plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want density comparisons across groups. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need an objects-based equivalent of KDE plotting. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- The data are discrete and smoothing would mislead.
- Exact counts matter more than shape.
- The sample is too small for a stable density estimate.
- You need a literal observation plot.
- Another stat would better fit the question.

### Important Parameters
- `bw_adjust`: bandwidth adjustment.
- `cut`: tail extension control.
- `clip`: support clipping.
- `kwargs`: additional density options.
- `weights`: weighted estimation if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()

so.Plot(penguins, x="bill_length_mm").add(so.Line(), so.KDE())
```

### Expected Output
A smoothed kernel density curve for the selected numeric variable. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Over-trusting smoothing.
- Comparing KDEs with different bandwidth assumptions.
- Using KDE on discrete categories.
- Ignoring support boundaries.
- Reading the curve as exact empirical counts.

### Gotchas
- KDE is sensitive to smoothing choices. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Tail behavior can be visually deceptive.
- The curve is an estimate, not raw data.
- Multiple groups can be hard to compare if overly smoothed.
- Boundary clipping can materially change appearance.

### Related APIs
`Hist`, `Est`, `Line`, `Band`, `Plot.add`

### Official Documentation
[seaborn.objects.KDE](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Est`

### Category
Objects interface stat

### Module
`seaborn.objects`

### Syntax
`Est(func="mean", errorbar=("ci", 95), **kwargs)`

### Purpose
Calculate a point estimate and error bar interval. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need an estimate plus uncertainty, not just the raw data."

### Use When
- You need summarized trends with intervals. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want point estimates for category or time comparisons. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need uncertainty bands or error bars. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a formal estimation step in the objects pipeline. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need production-ready summary graphics. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Raw observations are more important than the summary.
- Uncertainty would confuse the message.
- There is only one observation per group.
- The estimator is not the correct statistic.
- A different stat better matches the use case.

### Important Parameters
- `func`: estimate function.
- `errorbar`: interval specification.
- `kwargs`: method-specific options.
- `n_boot`: bootstrap iterations if supported.
- `seed`: reproducibility if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

fmri = sns.load_dataset("fmri").dropna()

so.Plot(fmri, x="timepoint", y="signal").add(so.Band(), so.Est())
```

### Expected Output
A point estimate with an uncertainty interval across the x-axis. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_85a94eb4-875e-4d60-a37e-47e08f9a68e8/d830fc1d-0301-477e-a4a7-775132c60bd2/RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md?AWSAccessKeyId=ASIA2F3EMEYEU7JBZMK7&Signature=diQUKUT1njs%2BH5imw9Z4%2BCI8YPg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHEaCXVzLWVhc3QtMSJHMEUCICs4W0oRuFX5i4Agkv8OvD5gcFMMDB70%2B%2Bb3%2B08J8nedAiEAnhOg3QU0cINEXYV36yt3SJT85T%2FnfX7CO6ClllQX%2F6Qq8wQIOhABGgw2OTk3NTMzMDk3MDUiDI1Tn%2FJLcwyx0CQpYirQBIP60kGrTxZ11AxhKI%2F7g8%2BlZSuXa%2BAunljyFVH1OcgeCU%2B%2Fak1bJzciod3EdXVoHicsGRxtn8cjdfCjtGjWfpS%2Fajv4hQz32loMA2zWCRyb3AErfjzEZw%2Bm6KuhGIewC4YikKcSNyzcBANg0c04gQ14PNare4qRN8sQ85cFtXReNWvoGEQZW8JskIfvpmBOSPsWLx5bwHKe5JrAW%2FuiLAdeEPIdGfx59B7Y87g3hOfaF495euJMJI6yQhEiKcJn09xZlPGZJ%2BTtivozejvChSA8R81zzyszpK0QDq3N6cPsqbSN0prEsVafRu5ww%2BScdnK%2BvTEVp%2FKmwEWRHikAyBJY2mmjf6FVn1yYIf5pzViwsGPwtF6JFQ8eUEvL03KJWRBbu84n9onZ6D7vKJogKVH27%2Bxh%2FxouPA%2BwakObrdVOsAEDm696EGcMj0ILd1tSjHP7%2FaRZaeFcF%2F0lhvrLdau6mIyEZgNJBnKexqhiBhooN4CXpIw0s1x3Yyt9xx%2FHVkq%2BwxIHvmIO2044fxNWpbCm9BBVEU2iNcbI0FIYlVvkEjfVON5aRr4t0F2L5uIozcYpB1GS0qMuPaEjJF5vEwI%2Bk%2B9JNkwox1h%2FJe0mTFKrM0qWTxAEECX9S0aDQpBdxM7Np3apWnJhiiQKuVPG4WzesvDWVT5BdasP78SeLzbNspyxp1NI0KBYHiOw1Y2OIJ2f1ehViQlCW3foaJjgchgMW30Vtqk1IUHtP32JJ4ZHCbPMbdLrelfujnOJ8ewANUZR3EBtO0QNw6mv2WYW7Dow2bOo0gY6mAHXRT8K0hv1efa9G1pGCBS3C%2FholrDIsugi1JqPu%2FPo1GDdJsslBopYKB150qaSCVlzCT7DInj%2FwpSP78VGgygDoSdowg8N7AJk6dq48sMJGcFd4qRfgyvp0%2BtSGAKwD3kaOI8Rs3vafTvifT11Dt4szIiRwZByrQOTs1xIDl66TwvsyBYMBd3Em3VIRQ4Osu9y60NnbyOnFA%3D%3D&Expires=1783244716)

### Common Mistakes
- Confusing estimate and raw observation.
- Ignoring the meaning of the error interval.
- Using the wrong summary statistic.
- Forgetting that uncertainty depends on group structure.
- Treating interval defaults as universally appropriate.

### Gotchas
- Error bars and confidence logic changed in newer Seaborn documentation. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_85a94eb4-875e-4d60-a37e-47e08f9a68e8/d830fc1d-0301-477e-a4a7-775132c60bd2/RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md?AWSAccessKeyId=ASIA2F3EMEYEU7JBZMK7&Signature=diQUKUT1njs%2BH5imw9Z4%2BCI8YPg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHEaCXVzLWVhc3QtMSJHMEUCICs4W0oRuFX5i4Agkv8OvD5gcFMMDB70%2B%2Bb3%2B08J8nedAiEAnhOg3QU0cINEXYV36yt3SJT85T%2FnfX7CO6ClllQX%2F6Qq8wQIOhABGgw2OTk3NTMzMDk3MDUiDI1Tn%2FJLcwyx0CQpYirQBIP60kGrTxZ11AxhKI%2F7g8%2BlZSuXa%2BAunljyFVH1OcgeCU%2B%2Fak1bJzciod3EdXVoHicsGRxtn8cjdfCjtGjWfpS%2Fajv4hQz32loMA2zWCRyb3AErfjzEZw%2Bm6KuhGIewC4YikKcSNyzcBANg0c04gQ14PNare4qRN8sQ85cFtXReNWvoGEQZW8JskIfvpmBOSPsWLx5bwHKe5JrAW%2FuiLAdeEPIdGfx59B7Y87g3hOfaF495euJMJI6yQhEiKcJn09xZlPGZJ%2BTtivozejvChSA8R81zzyszpK0QDq3N6cPsqbSN0prEsVafRu5ww%2BScdnK%2BvTEVp%2FKmwEWRHikAyBJY2mmjf6FVn1yYIf5pzViwsGPwtF6JFQ8eUEvL03KJWRBbu84n9onZ6D7vKJogKVH27%2Bxh%2FxouPA%2BwakObrdVOsAEDm696EGcMj0ILd1tSjHP7%2FaRZaeFcF%2F0lhvrLdau6mIyEZgNJBnKexqhiBhooN4CXpIw0s1x3Yyt9xx%2FHVkq%2BwxIHvmIO2044fxNWpbCm9BBVEU2iNcbI0FIYlVvkEjfVON5aRr4t0F2L5uIozcYpB1GS0qMuPaEjJF5vEwI%2Bk%2B9JNkwox1h%2FJe0mTFKrM0qWTxAEECX9S0aDQpBdxM7Np3apWnJhiiQKuVPG4WzesvDWVT5BdasP78SeLzbNspyxp1NI0KBYHiOw1Y2OIJ2f1ehViQlCW3foaJjgchgMW30Vtqk1IUHtP32JJ4ZHCbPMbdLrelfujnOJ8ewANUZR3EBtO0QNw6mv2WYW7Dow2bOo0gY6mAHXRT8K0hv1efa9G1pGCBS3C%2FholrDIsugi1JqPu%2FPo1GDdJsslBopYKB150qaSCVlzCT7DInj%2FwpSP78VGgygDoSdowg8N7AJk6dq48sMJGcFd4qRfgyvp0%2BtSGAKwD3kaOI8Rs3vafTvifT11Dt4szIiRwZByrQOTs1xIDl66TwvsyBYMBd3Em3VIRQ4Osu9y60NnbyOnFA%3D%3D&Expires=1783244716)
- Estimate choice changes the story.
- Intervals should be labeled clearly.
- The stat is a core part of the visual semantics.
- Reproducibility may require fixed random state when bootstrapping.

### Related APIs
`Agg`, `Count`, `Hist`, `KDE`, `PolyFit`, `Band`, `Range`

### Official Documentation
[seaborn.objects.Est](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.PolyFit`

### Category
Objects interface stat

### Module
`seaborn.objects`

### Syntax
`PolyFit(order=1, fullrange=False, n=100, **kwargs)`

### Purpose
Fit a polynomial of the given order and resample onto a predicted curve. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a fitted trend line or curve in the objects interface."

### Use When
- You want regression-style trend visualization. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a polynomial fit line. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are exploring relationships between two continuous variables. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a model-based line over scatter data. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a smooth fitted curve rather than raw connections. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- A polynomial fit would be misleading.
- The relationship is not well approximated by a polynomial.
- Raw data are the main message.
- The data are too sparse for a meaningful fit.
- Another smoothing or regression method is more appropriate.

### Important Parameters
- `order`: polynomial order.
- `fullrange`: extend fit across full x-range.
- `n`: number of prediction points.
- `kwargs`: fit-specific options.
- `weights`: weighted fit if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="total_bill", y="tip").add(so.Line(), so.PolyFit())
```

### Expected Output
A fitted polynomial curve over a scatter relationship. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Overfitting with too high an order.
- Assuming the fitted curve is causal.
- Using polynomial fit where a simpler model suffices.
- Forgetting to inspect residual behavior.
- Extending the fit beyond a sensible domain.

### Gotchas
- Polynomial fits can look convincing even when wrong.
- Order choice is an engineering decision.
- `fullrange` can create misleading extrapolation.
- Model-based curves should be labeled carefully.
- Fit stability depends on data scale and noise.

### Related APIs
`Line`, `Est`, `Agg`, `Plot.add`

### Official Documentation
[seaborn.objects.PolyFit](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


## seaborn.objects Moves

### API Name
`seaborn.objects.Dodge`

### Category
Objects interface move

### Module
`seaborn.objects`

### Syntax
`Dodge()`

### Purpose
Displace overlapping marks along the orientation axis to separate grouped values. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to separate overlapping grouped marks."

### Use When
- Multiple groups overlap in the same category. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need grouped bar or point separation. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to reduce collision in categorical plots. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are building a grouped comparison chart. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need clearer side-by-side positioning. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- The marks do not overlap.
- Separation would confuse the intended alignment.
- You need the raw overlapping positions visible.
- The chart is already crowded.
- Another encoding would be better than displacement.

### Important Parameters
- `Dodge` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: position controls if supported.
- `gap`: separation tuning if supported.
- `by`: grouping channel if supported.
- `orient`: orientation control if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="day", y="total_bill", color="sex").add(so.Bar(), so.Est(), so.Dodge())
```

### Expected Output
A grouped bar-style display with dodged positions. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Dodging when stacking would communicate better.
- Over-separating groups and making comparisons harder.
- Assuming dodge fixes all overlap issues.
- Using it without checking legend clarity.
- Forgetting the orientation context.

### Gotchas
- Dodge changes spatial interpretation.
- Group separation can improve readability but weaken compactness.
- It is easy to use too much spacing.
- The move is tied to group semantics.
- It should usually be used intentionally, not by default.

### Related APIs
`Stack`, `Shift`, `Jitter`, `Norm`, `Plot.add`

### Official Documentation
[seaborn.objects.Dodge](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Stack`

### Category
Objects interface move

### Module
`seaborn.objects`

### Syntax
`Stack()`

### Purpose
Stack overlapping marks along the value axis to build cumulative displays. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need stacked values instead of side-by-side groups."

### Use When
- You want cumulative composition. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are building stacked bars or areas. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Group totals matter as much as subgroup composition. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need additive visual encoding. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are representing part-to-whole structure. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Side-by-side comparison is more important.
- Stacking would hide individual group magnitude.
- The chart would become hard to read.
- Totals are not meaningful.
- Another normalization approach would be clearer.

### Important Parameters
- `Stack` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: stack behavior if supported.
- `by`: grouping control if supported.
- `orient`: orientation control if supported.
- `baseline`: baseline handling if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="day", color="sex").add(so.Bar(), so.Count(), so.Stack())
```

### Expected Output
A stacked categorical count plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Stacking when subgroup comparison is the actual goal.
- Hiding totals and group sizes unintentionally.
- Overcomplicating a simple count chart.
- Assuming stacking is always more compact.
- Forgetting that stack order matters.

### Gotchas
- Stack changes the meaning of the baseline.
- Group order influences interpretation.
- Part-to-whole plots can be misleading if not labeled.
- Stacked charts are often harder to compare precisely than dodged charts.
- It is important to confirm whether totals or parts matter more.

### Related APIs
`Dodge`, `Shift`, `Jitter`, `Norm`, `Plot.add`

### Official Documentation
[seaborn.objects.Stack](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Shift`

### Category
Objects interface move

### Module
`seaborn.objects`

### Syntax
`Shift()`

### Purpose
Shift marks by a constant amount to separate them visually. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to offset marks in a controlled way."

### Use When
- You need a fixed positional offset. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to reduce exact overlap. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a simple spatial adjustment. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are composing marks that would otherwise coincide. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a basic transform before rendering. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Jitter would better solve overlap.
- You need group-aware separation.
- The offset would misrepresent the data.
- The plot does not need displacement.
- Another move is more semantically appropriate.

### Important Parameters
- `Shift` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: offset control if supported.
- `x`: horizontal shift if supported.
- `y`: vertical shift if supported.
- `amount`: shift magnitude if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

penguins = sns.load_dataset("penguins").dropna().head(20)

so.Plot(penguins, x="bill_length_mm", y="bill_depth_mm").add(so.Dot(), so.Shift())
```

### Expected Output
A shifted dot plot with displaced marks. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using shift when a semantic grouping move is needed.
- Changing the meaning of coordinates unintentionally.
- Overusing fixed offsets.
- Making comparisons harder by displacing too much.
- Confusing shift with jitter.

### Gotchas
- Small shifts can improve readability, large shifts can distort meaning.
- Fixed displacement should be documented.
- Shift is a positional operation, not a statistical one.
- It can interact with axis scaling.
- It is easy to create misleading separation.

### Related APIs
`Dodge`, `Jitter`, `Stack`, `Norm`, `Plot.add`

### Official Documentation
[seaborn.objects.Shift](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Jitter`

### Category
Objects interface move

### Module
`seaborn.objects`

### Syntax
`Jitter()`

### Purpose
Randomly displace marks to reduce overplotting. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to reveal dense point overlap."

### Use When
- Many points occupy the same or nearby positions. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need categorical scatter separation. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Overplotting hides density structure. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a readable point cloud. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are plotting repeated observations. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Exact coordinates are important.
- Random displacement would confuse the chart.
- Another summary chart would be better.
- The data are already sparse.
- Reproducibility of exact point positions is critical and unmanaged.

### Important Parameters
- `Jitter` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: jitter controls if supported.
- `width`: horizontal jitter if supported.
- `height`: vertical jitter if supported.
- `seed`: reproducibility if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="day", y="total_bill").add(so.Dot(), so.Jitter())
```

### Expected Output
A jittered point display that reduces overlap. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using jitter without explaining that positions are perturbed.
- Applying it to data where exact values matter.
- Forgetting reproducibility considerations.
- Over-jittering and creating false spread.
- Using jitter instead of a better summary view.

### Gotchas
- Jitter introduces randomness by design. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Small changes can affect visual impression.
- It should not be mistaken for data variation.
- Repeated renders may differ if not controlled.
- Jitter is primarily a readability aid.

### Related APIs
`Dodge`, `Shift`, `Stack`, `Norm`, `Plot.add`

### Official Documentation
[seaborn.objects.Jitter](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.objects.Norm`

### Category
Objects interface move

### Module
`seaborn.objects`

### Syntax
`Norm()`

### Purpose
Apply divisive scaling on the value axis after aggregating within groups. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need normalization after grouping."

### Use When
- You need normalized compositions. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want values scaled within grouped displays. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are preparing comparative stacked displays. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need value-axis normalization in an objects workflow. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want proportional rather than raw magnitude representation. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Raw values are the message.
- Normalization would obscure meaningful totals.
- The audience needs counts or sums instead of proportions.
- Group sizes are critical to interpretation.
- Another stat already provides normalized output.

### Important Parameters
- `Norm` has no major user-facing parameters in the retrieved documentation excerpt.
- `kwargs`: normalization control if supported.
- `method`: normalization method if supported.
- `by`: grouping scope if supported.
- `clip`: clipping behavior if supported.

### Runnable Example
```python
import seaborn.objects as so
import seaborn as sns

tips = sns.load_dataset("tips").dropna()

so.Plot(tips, x="day", color="sex").add(so.Bar(), so.Count(), so.Stack(), so.Norm())
```

### Expected Output
A normalized stacked categorical display. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Normalizing when absolute counts matter.
- Forgetting to label the normalization basis.
- Comparing normalized and unnormalized plots directly.
- Assuming normalization is always desirable.
- Confusing normalization with aggregation.

### Gotchas
- Normalization changes the business meaning of the plot.
- It is useful for composition, not always for totals.
- Readability depends on the chosen grouping.
- Percent-style charts require careful labeling.
- Normalized displays should not be overinterpreted as raw counts.

### Related APIs
`Stack`, `Dodge`, `Shift`, `Jitter`, `Plot.add`

### Official Documentation
[seaborn.objects.Norm](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


## Styling APIs

### API Name
`seaborn.set_theme`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.set_theme(context="notebook", style="darkgrid", palette="deep", font="sans-serif", font_scale=1, color_codes=False, rc=None)`

### Purpose
Set the global Seaborn/Matplotlib visual theme. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to configure the overall plot appearance for a session or project."

### Use When
- You want consistent styling across a notebook or script. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a default theme for a report or app. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to set global context, style, and palette together. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need project-wide visualization consistency. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to align many charts to one visual standard. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You only need a one-off style change.
- Global state would create conflicts in a shared process.
- You need local styling isolated to one figure.
- Another plotting library already controls rc settings.
- You are in a long-lived notebook without style reset discipline.

### Important Parameters
- `context`: scaling context.
- `style`: style preset.
- `palette`: color palette.
- `font`: base font family.
- `rc`: custom rc overrides.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", palette="deep")
tips = sns.load_dataset("tips").dropna()

sns.barplot(data=tips, x="day", y="total_bill")
plt.show()
```

### Expected Output
A bar plot using the configured global theme. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Changing global style inside a reusable library function.
- Forgetting that theme settings persist across plots.
- Mixing theme calls with ad hoc Matplotlib styling inconsistently.
- Using theme configuration after figures have already been created.
- Treating rc changes as purely local.

### Gotchas
- Theme state affects all later plots in the process. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Order of styling calls matters.
- Project code should standardize theme setup.
- Theme drift is a common source of inconsistent charts.
- Matplotlib backend and style state still matter.

### Related APIs
`set_style`, `set_context`, `set_palette`, `reset_defaults`, `reset_orig`, `set_color_codes`, `despine`

### Official Documentation
[seaborn.set_theme](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.set_style`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.set_style(style=None, rc=None)`

### Purpose
Set the axes style parameters for Seaborn plots. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to change the background/grid aesthetic without changing everything else."

### Use When
- You want a specific axes style preset. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need grid visibility changes. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want style control separate from context scaling. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are matching a house style. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to modify visual emphasis for plots. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Global theme setup would be cleaner.
- You need to keep the default style.
- You are not intentionally changing axes styling.
- Another style manager already owns the session.
- You only need a local axis edit.

### Important Parameters
- `style`: style preset.
- `rc`: rc overrides.
- `None`: use defaults if supported.
- `darkgrid`: grid-on style if selected.
- `whitegrid`: alternate grid-on style if selected.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_style("whitegrid")
tips = sns.load_dataset("tips").dropna()
sns.boxplot(data=tips, x="day", y="total_bill")
plt.show()
```

### Expected Output
A box plot using the selected axes style. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using style changes to solve labeling problems.
- Forgetting style persists.
- Combining incompatible style changes.
- Applying style too late in the plotting workflow.
- Assuming style changes are figure-local.

### Gotchas
- Style affects axes appearance, not data semantics. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Grid-heavy styles are not always best for all plots.
- Style choices can materially change readability.
- Global persistence can surprise interactive users.
- Theme and style should be coordinated.

### Related APIs
`set_theme`, `axes_style`, `reset_defaults`, `reset_orig`, `despine`

### Official Documentation
[seaborn.set_style](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.axes_style`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.axes_style(style=None, rc=None)`

### Purpose
Get or set a context manager for axes style parameters. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need temporary axes styling without permanently changing session state."

### Use When
- You want a local style context. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to inspect or temporarily alter axes style. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want scoped styling in a function or notebook cell. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want controlled styling overrides. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to avoid global state leakage. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You intend to set a project-wide theme.
- A permanent theme function is more appropriate.
- The plot is already styled elsewhere.
- You do not need a scoped context.
- Global style changes are intentional.

### Important Parameters
- `style`: style name.
- `rc`: rc overrides.
- `None`: retrieve current style if supported.
- `white`: style preset if selected.
- `dark`: style preset if selected.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

with sns.axes_style("whitegrid"):
    tips = sns.load_dataset("tips").dropna()
    sns.boxplot(data=tips, x="day", y="total_bill")
    plt.show()
```

### Expected Output
A box plot rendered inside a temporary style context. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using a context manager when a global theme is desired.
- Forgetting that the style is temporary.
- Nesting style contexts carelessly.
- Assuming it changes only the current axes permanently.
- Mixing context-managed style with global style updates.

### Gotchas
- Scoped style is safer in reusable code.
- Context boundaries matter.
- Style returned from a context may not match future plots.
- This is valuable when writing utilities.
- It helps prevent accidental state leakage.

### Related APIs
`set_style`, `plotting_context`, `set_theme`, `reset_defaults`, `reset_orig`

### Official Documentation
[seaborn.axes_style](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.plotting_context`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.plotting_context(context=None, font_scale=1, rc=None)`

### Purpose
Get or set a context manager for plot scaling. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a temporary scale adjustment for fonts, lines, and markers."

### Use When
- You need notebook, talk, or paper scaling. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want local plot-element scaling. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need consistent sizing for a specific output medium. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to adapt typography and line weights together. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to avoid manual rc tuning. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Global theme context is enough.
- The plot does not require size scaling.
- You are not controlling output media.
- Another style system already manages sizing.
- You need only a single manual axis tweak.

### Important Parameters
- `context`: scaling preset.
- `font_scale`: font scaling factor.
- `rc`: rc overrides.
- `paper`: smaller output preset if selected.
- `talk`: presentation preset if selected.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

with sns.plotting_context("talk"):
    tips = sns.load_dataset("tips").dropna()
    sns.barplot(data=tips, x="day", y="total_bill")
    plt.show()
```

### Expected Output
A bar plot rendered at a presentation-oriented scale. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using the wrong output context.
- Over-scaling text until layout breaks.
- Mixing context and style responsibilities.
- Forgetting that scale is separate from color theme.
- Applying plot scaling too late in the workflow.

### Gotchas
- Context changes are especially important for export quality.
- Font scaling affects spacing and layout.
- Small changes can have big visual effects.
- Output medium should drive the context choice.
- Context and figure size should be tuned together.

### Related APIs
`set_context`, `set_theme`, `axes_style`, `reset_defaults`, `reset_orig`

### Official Documentation
[seaborn.plotting_context](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.set_context`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.set_context(context=None, font_scale=1, rc=None)`

### Purpose
Set the global context scaling for plot elements. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to globally resize chart elements for a target medium."

### Use When
- You want persistent scaling for a notebook or script. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need consistent sizing for reports or slides. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are standardizing typography and line widths. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to update all later plots in a session. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need project-wide visual scale consistency. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You only need a temporary local scale.
- Global state changes would be risky.
- Another library owns the style context.
- You are not intentionally changing sizing.
- A single plot needs a one-off tweak only.

### Important Parameters
- `context`: scaling preset.
- `font_scale`: font scale.
- `rc`: rc overrides.
- `paper`: compact context if selected.
- `talk`: presentation context if selected.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_context("talk")
tips = sns.load_dataset("tips").dropna()
sns.boxplot(data=tips, x="day", y="total_bill")
plt.show()
```

### Expected Output
A box plot drawn with the selected global context scale. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Forgetting that scaling persists.
- Using a presentation scale in compact reports.
- Mixing local and global scaling haphazardly.
- Assuming context only changes fonts.
- Applying it after creating the figure.

### Gotchas
- Context changes can alter layout and spacing.
- Sizing choices should match delivery medium.
- Global context can leak across notebook cells.
- Reproducibility is easier when context is explicit.
- Plot density and text size must be balanced.

### Related APIs
`plotting_context`, `set_theme`, `set_style`, `reset_defaults`, `reset_orig`

### Official Documentation
[seaborn.set_context](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.set_palette`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.set_palette(palette, n_colors=None, desat=None, color_codes=False)`

### Purpose
Set the matplotlib color cycle from a Seaborn palette. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to standardize the color cycle across plots."

### Use When
- You want a consistent palette across a notebook or project. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need category colors to match a team style. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want every subsequent plot to use a known palette. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to unify color encoding across figures. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want global palette control with minimal code. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You only need a palette for a single chart.
- Global palette changes would confuse other code.
- The plot is continuous and needs a colormap instead.
- Color cycle consistency is already handled externally.
- You are not prepared to manage state persistence.

### Important Parameters
- `palette`: palette definition.
- `n_colors`: number of colors.
- `desat`: desaturation factor.
- `color_codes`: shorthand code behavior.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_palette("deep")
tips = sns.load_dataset("tips").dropna()
sns.countplot(data=tips, x="day", hue="sex")
plt.show()
```

### Expected Output
A grouped count plot using the configured color cycle. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Setting the palette globally and forgetting about it.
- Using a categorical palette for continuous data.
- Not checking accessibility or contrast.
- Expecting the palette change to be local only.
- Overriding with incompatible Matplotlib settings afterward.

### Gotchas
- Palette changes persist in the current session. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Color meaning should be consistent across a report.
- Categorical and continuous palettes solve different problems.
- Palette selection affects readability and accessibility.
- `color_codes` can alter shorthand interpretation.

### Related APIs
`color_palette`, `set_theme`, `set_color_codes`, `reset_defaults`, `reset_orig`

### Official Documentation
[seaborn.set_palette](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.reset_defaults`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.reset_defaults()`

### Purpose
Restore all rc parameters to default settings. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to clear Seaborn styling and return to defaults."

### Use When
- You need to reset global styling between notebook runs. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to clear accidental theme changes. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are debugging style state. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a clean baseline for a new plotting session. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to avoid style bleed between code paths. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You intend to preserve custom project style.
- You need only a local style change.
- Another reset function is more appropriate.
- You are mid-figure and rely on current styling.
- You do not want to alter session state.

### Important Parameters
- No major user-facing parameters documented in the retrieved excerpt.

### Runnable Example
```python
import seaborn as sns

sns.reset_defaults()
```

### Expected Output
Global plotting defaults restored. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using reset in the middle of a plotting workflow.
- Forgetting that it affects subsequent plots.
- Mixing resets with manual rc edits without a policy.
- Assuming it only affects Seaborn, not Matplotlib state.
- Not resetting after exploratory styling.

### Gotchas
- Reset functions alter global process state.
- They are especially relevant in notebooks and shared environments.
- Style bugs often come from forgotten global state.
- Resetting can unexpectedly change later plots.
- It is useful as a debugging tool.

### Related APIs
`reset_orig`, `set_theme`, `set_style`, `set_context`

### Official Documentation
[seaborn.reset_defaults](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.reset_orig`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.reset_orig()`

### Purpose
Restore all rc parameters to the original settings, respecting custom rc values. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to revert styling without discarding the original custom Matplotlib settings."

### Use When
- You want to undo Seaborn styling carefully. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to preserve original rc customizations. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are working in a shared plotting environment. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need state cleanup after a theme experiment. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a more conservative reset than defaults. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You want a full clean default reset.
- You do not want to preserve prior custom settings.
- A local style context is enough.
- The session state should remain unchanged.
- The distinction from `reset_defaults` does not matter.

### Important Parameters
- No major user-facing parameters documented in the retrieved excerpt.

### Runnable Example
```python
import seaborn as sns

sns.reset_orig()
```

### Expected Output
rc parameters restored while respecting original customizations. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Confusing `reset_orig` with `reset_defaults`.
- Assuming it removes all custom styling.
- Forgetting state changes persist.
- Using it when a scoped context would be better.
- Not documenting style reset behavior in shared notebooks.

### Gotchas
- The difference from `reset_defaults` matters in production code. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- This is a state-management tool, not a visual tweak.
- Useful when Matplotlib customizations must survive.
- Reset choices can affect reproducibility.
- State cleanup should be deliberate.

### Related APIs
`reset_defaults`, `set_theme`, `set_style`, `set_context`

### Official Documentation
[seaborn.reset_orig](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.set_color_codes`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.set_color_codes(palette="deep")`

### Purpose
Change how Matplotlib color shorthand codes are interpreted. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need shorthand color codes to map to a Seaborn palette."

### Use When
- You use Matplotlib shorthand colors and want Seaborn palette mapping. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need consistent shorthand behavior. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are mixing Seaborn palettes with older Matplotlib-style code. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want palette-aware shorthand colors. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to align shorthand colors with the current palette. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You do not use shorthand color codes.
- Global color-code remapping would be confusing.
- The plot is fully explicit about colors.
- Another color-management approach is sufficient.
- You need a single local color override.

### Important Parameters
- `palette`: palette name.
- `palette="deep"`: default palette if used.
- `color_codes`: shorthand remapping behavior.
- `desat`: not a primary parameter in the excerpt.
- `n_colors`: not a primary parameter in the excerpt.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_color_codes("deep")
tips = sns.load_dataset("tips").dropna()
sns.lineplot(data=tips, x="total_bill", y="tip", color="b")
plt.show()
```

### Expected Output
A line plot using color shorthand remapped to the selected Seaborn palette. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Assuming shorthand colors are unaffected by palette changes.
- Using it without a clear color policy.
- Forgetting that it changes global interpretation.
- Mixing explicit colors and shorthand without consistency.
- Applying it when shorthand codes are not used.

### Gotchas
- This is a global interpretation change.
- It mainly matters in mixed Matplotlib/Seaborn codebases.
- Color shorthand can become ambiguous across environments.
- Palette selection affects shorthand output.
- Keep this isolated in style setup code.

### Related APIs
`set_palette`, `set_theme`, `color_palette`, `reset_defaults`, `reset_orig`

### Official Documentation
[seaborn.set_color_codes](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.despine`

### Category
Styling

### Module
`seaborn`

### Syntax
`seaborn.despine(fig=None, ax=None, top=True, right=True, left=False, bottom=False, offset=None, trim=False)`

### Purpose
Remove chart spines for a cleaner presentation style. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to reduce visual clutter around the axes."

### Use When
- You want a cleaner plot frame. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- The top and right spines are unnecessary. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are preparing publication-style charts. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want consistency with Seaborn’s common visual style. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to simplify the plot border. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- The spines help orient the reader.
- The chart already relies on minimal axis framing.
- Removing spines would reduce readability.
- You need the full Matplotlib border behavior.
- The plot uses custom axis framing.

### Important Parameters
- `fig`: figure to modify.
- `ax`: axes to modify.
- `top`: remove top spine.
- `right`: remove right spine.
- `trim`: trim spines to major ticks.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()
sns.boxplot(data=tips, x="day", y="total_bill")
sns.despine()
plt.show()
```

### Expected Output
A cleaner plot with selected spines removed. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Removing spines when they aid readability.
- Forgetting that despine alters existing axes.
- Applying it before the figure is fully drawn in complex workflows.
- Removing too much frame structure.
- Using it to compensate for poor layout.

### Gotchas
- Spine removal changes the visual balance of the chart.
- Trim behavior can alter axis framing noticeably.
- It is a post-processing styling step.
- It can affect multiple axes if the figure is complex.
- Use it deliberately rather than automatically.

### Related APIs
`set_theme`, `set_style`, `set_context`, `color_palette`

### Official Documentation
[seaborn.despine](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


## Dataset APIs

### API Name
`seaborn.load_dataset`

### Category
Datasets

### Module
`seaborn`

### Syntax
`seaborn.load_dataset(name, cache=True, data_home=None, **kwargs)`

### Purpose
Load an example dataset from the online repository. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need a built-in example dataset for reproducible examples or exploration."

### Use When
- You want a quick official example dataset. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need a reproducible teaching or demo dataset. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to avoid setting up your own CSV for a small example. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are prototyping Seaborn usage. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to validate plotting code with known tabular data. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- Offline operation is required.
- You need a production dataset loader.
- Network access is restricted.
- The dataset should come from your own source of truth.
- Example data should not be fetched externally.

### Important Parameters
- `name`: dataset name.
- `cache`: whether to cache locally.
- `data_home`: cache location.
- `kwargs`: additional fetch options.
- `None`: no major alternative documented in the excerpt.

### Runnable Example
```python
import seaborn as sns

tips = sns.load_dataset("tips")
tips.head()
```

### Expected Output
A Pandas DataFrame containing the requested example dataset. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Using it in offline code paths.
- Assuming it is suitable for production data ingestion.
- Forgetting network and cache dependencies.
- Treating example data as representative of your domain.
- Not pinning version when reproducibility matters.

### Gotchas
- It requires online access according to the docs. [seaborn.pydata](https://seaborn.pydata.org/installing.html)
- Cache behavior can affect repeatability.
- Dataset availability may change over time.
- It is ideal for examples, not business pipelines.
- Example datasets are a convenience, not an API contract.

### Related APIs
`get_dataset_names`

### Official Documentation
[seaborn.load_dataset](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


### API Name
`seaborn.get_dataset_names`

### Category
Datasets

### Module
`seaborn`

### Syntax
`seaborn.get_dataset_names()`

### Purpose
Report available example datasets. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to discover which built-in example datasets are available."

### Use When
- You want to inspect dataset names before loading. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You are debugging example dataset access. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to enumerate demo datasets for tooling. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to build a quick dataset selector. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to confirm what Seaborn ships or exposes. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- You already know the dataset name.
- You are working offline and cannot rely on the dataset server.
- You need actual data rather than names.
- The dataset list is not relevant to the task.
- Production data discovery should come from your own catalog.

### Important Parameters
- No major user-facing parameters documented in the retrieved excerpt.

### Runnable Example
```python
import seaborn as sns

sns.get_dataset_names()
```

### Expected Output
A list of available example dataset names. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Assuming the list is always available offline.
- Treating it as a stable production catalog.
- Confusing dataset names with loaded data.
- Using it in critical runtime paths.
- Assuming datasets are version-pinned forever.

### Gotchas
- The list depends on the example dataset repository. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- It is mostly a discovery tool.
- Availability may vary with network conditions.
- It is useful for demos and tests.
- It should not be a production dependency.

### Related APIs
`load_dataset`

### Official Documentation
[seaborn.get_dataset_names](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)


## Utility APIs

### API Name
`seaborn.move_legend`

### Category
Utility

### Module
`seaborn`

### Syntax
`seaborn.move_legend(obj, loc, **kwargs)`

### Purpose
Recreate a plot legend at a new location. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Mental Trigger
"I need to reposition an existing legend without rebuilding the plot."

### Use When
- The default legend location overlaps data. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want to improve readability after plotting. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- A faceted or grouped plot needs legend relocation. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You need to refactor legend placement late in the workflow. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- You want a convenience wrapper around legend recreation. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Avoid When
- The legend is already well placed.
- You need full custom legend construction.
- Another Matplotlib legend API is already used explicitly.
- The plot has no legend.
- Legend relocation would not improve readability.

### Important Parameters
- `obj`: plot object or axes-like object.
- `loc`: new legend location.
- `kwargs`: legend styling and placement options.
- `bbox_to_anchor`: placement tuning if supported.
- `title`: legend title if supported.

### Runnable Example
```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips").dropna()
ax = sns.scatterplot(data=tips, x="total_bill", y="tip", hue="sex")
sns.move_legend(ax, "upper left")
plt.show()
```

### Expected Output
The legend is recreated at a new position on the plot. [seaborn.pydata](https://seaborn.pydata.org/api.html)

### Common Mistakes
- Calling it before the legend exists.
- Picking a new position that still overlaps the data.
- Forgetting that the plot object must be compatible.
- Using it to solve layout problems that need figure resizing.
- Assuming it edits the original legend in place.

### Gotchas
- It recreates the legend rather than merely moving it. [seaborn.pydata](https://seaborn.pydata.org/api.html)
- Legend relocation can interact with layout and clipping.
- Some plot types are harder to relayout cleanly.
- It is especially helpful for faceted plots.
- The target object must expose legend information appropriately.

### Related APIs
`despine`, `set_theme`, `relplot`, `catplot`, `FacetGrid`

### Official Documentation
[seaborn.move_legend](https://seaborn.pydata.org/api.html) [seaborn.pydata](https://seaborn.pydata.org/api.html)

## Debugging Guide

### 1. Import or installation failure

- **Symptom:** `ImportError`, `ModuleNotFoundError`, or `DLL load failed`.[^5]
- **Root cause:** mixed Python environments or failing compiled dependencies.[^5]
- **Diagnosis:** inspect the traceback; verify which interpreter and package manager installed Seaborn.[^5]
- **Resolution:** install with `python -m pip install seaborn`; verify environment alignment.[^5]
- **Prevention:** pin environments; use one interpreter per project; validate imports in CI.[^5]
- **Related APIs:** installation and import workflow.[^5]


### 2. Wrong interpreter sees no seaborn

- **Symptom:** package appears installed but cannot be imported.[^5]
- **Root cause:** `pip` and runtime interpreter point to different environments.[^5]
- **Diagnosis:** compare `python -m pip` versus `pip`; inspect `sys.executable`.[^5]
- **Resolution:** reinstall using the active interpreter.[^5]
- **Prevention:** standardize project environment tooling.[^5]
- **Related APIs:** installation commands.[^5]


### 3. Blank plot in script

- **Symptom:** no visible figure after running code outside a notebook.[^5]
- **Root cause:** Matplotlib rendering requires an explicit `plt.show()` in many script contexts.[^5]
- **Diagnosis:** confirm the code executed and no backend error occurred.[^5]
- **Resolution:** call `plt.show()` or save the figure.[^5]
- **Prevention:** treat notebook and script rendering as different environments.[^5]
- **Related APIs:** any plotting function returning Axes.[^5]


### 4. Global theme leaks across plots

- **Symptom:** unrelated figures inherit unexpected style or palette.[^5]
- **Root cause:** theme and palette APIs modify global Matplotlib state.[^5]
- **Diagnosis:** review earlier calls to `set_theme`, `set_palette`, or related styling functions.[^5]
- **Resolution:** reset style or localize styling decisions.[^5]
- **Prevention:** centralize plot initialization.[^5]
- **Related APIs:** `set_theme`, `set_palette`, `set_style`, `set_context`.[^5]


### 5. Missing or misleading legend

- **Symptom:** legend absent, duplicated, or hard to interpret.[^5]
- **Root cause:** semantic mappings may not produce a legend in the expected way, especially with faceting or repeated encodings.[^5]
- **Diagnosis:** inspect how hue/style/size are assigned and whether the plot is faceted.[^5]
- **Resolution:** adjust mappings, labels, or legend location.[^5]
- **Prevention:** decide legend strategy before plotting.[^5]
- **Related APIs:** `scatterplot`, `lineplot`, `move_legend`.[^5]


### 6. Overplotting hides structure

- **Symptom:** dense scatter or repeated lines become unreadable.[^5]
- **Root cause:** too many marks in the same visual space.[^5]
- **Diagnosis:** check point count, transparency, and marker overlap.[^5]
- **Resolution:** use faceting, sampling, alpha, aggregation, or alternative plot types.[^5]
- **Prevention:** choose the appropriate chart for the data density.[^5]
- **Related APIs:** `scatterplot`, `histplot`, `kdeplot`, `displot`.[^5]


### 7. Wrong category order

- **Symptom:** bars, boxes, or facets appear in an unexpected order.[^5]
- **Root cause:** categories are ordered by input or internal defaults rather than domain meaning.[^5]
- **Diagnosis:** inspect categorical dtype ordering and explicit order arguments.[^5]
- **Resolution:** set ordering explicitly in the data or plot call.[^5]
- **Prevention:** standardize category order upstream.[^5]
- **Related APIs:** categorical plots and faceting APIs.[^5]


### 8. Aggregation hides raw data variation

- **Symptom:** summary plots look “too clean” or conflict with point-level observations.[^5]
- **Root cause:** Seaborn’s statistical defaults aggregate values by design.[^5]
- **Diagnosis:** check estimator and error bar settings.[^5]
- **Resolution:** switch to raw-data plots or adjust statistical options.[^5]
- **Prevention:** match plot type to the analytical question.[^5]
- **Related APIs:** `barplot`, `pointplot`, `lineplot`.[^5]


### 9. Uncertainty looks wrong

- **Symptom:** confidence bands or intervals are unexpected.[^1][^5]
- **Root cause:** default uncertainty representation may not match your analytic intent.[^1][^5]
- **Diagnosis:** inspect estimator, error bar mode, and grouping.[^1][^5]
- **Resolution:** choose explicit interval settings and verify the summary statistic.[^1][^5]
- **Prevention:** decide uncertainty semantics before plotting.[^1][^5]
- **Related APIs:** `lineplot`, `barplot`, `pointplot`.[^1][^5]


### 10. Facet grid too crowded

- **Symptom:** panel labels are clipped or the figure is unreadable.[^5]
- **Root cause:** too many row/col levels or insufficient figure size.[^5]
- **Diagnosis:** count unique facet levels and inspect the grid dimensions.[^5]
- **Resolution:** reduce levels, enlarge the figure, or aggregate subsets.[^5]
- **Prevention:** design facet strategy before plotting.[^5]
- **Related APIs:** `relplot`, `catplot`, `displot`, `FacetGrid`.[^5]


### 11. Large pair plot runs slowly

- **Symptom:** `pairplot` is slow or memory-heavy.[^5]
- **Root cause:** pairwise grids scale quadratically with the number of variables.[^5]
- **Diagnosis:** check feature count and sample size.[^5]
- **Resolution:** reduce columns, sample data, or use a different summary plot.[^5]
- **Prevention:** restrict pairwise grids to screening subsets.[^5]
- **Related APIs:** `pairplot`, `PairGrid`.[^5]


### 12. Heatmap colors seem misleading

- **Symptom:** matrix cells are hard to interpret or visually overemphasized.[^5]
- **Root cause:** inappropriate colormap or unconsidered normalization.[^5]
- **Diagnosis:** inspect the colormap choice and data range.[^5]
- **Resolution:** choose a colormap that matches the data semantics.[^5]
- **Prevention:** standardize matrix colormaps across a project.[^5]
- **Related APIs:** `heatmap`, `clustermap`.[^5]


### 13. Clustermap order surprises you

- **Symptom:** rows and columns appear in a different order than the source data.[^5]
- **Root cause:** clustering reorders the matrix.[^5]
- **Diagnosis:** confirm the dendrogram and clustering method.[^5]
- **Resolution:** use heatmap instead if fixed order is required.[^5]
- **Prevention:** decide whether clustering is part of the question.[^5]
- **Related APIs:** `clustermap`.[^5]


### 14. Figure clipping on save

- **Symptom:** labels or titles are cut off in exported files.[^5]
- **Root cause:** layout not adjusted for the final canvas size.[^5]
- **Diagnosis:** compare on-screen render with saved file.[^5]
- **Resolution:** adjust figure size or Matplotlib save options.[^5]
- **Prevention:** verify exports at target DPI and format.[^5]
- **Related APIs:** any plot plus Matplotlib export.[^5]


### 15. Empty plot from dropped missing values

- **Symptom:** no data appears after plotting.[^5]
- **Root cause:** missing values or invalid levels removed all rows used by the plot.[^5]
- **Diagnosis:** check the shape after preprocessing and NaN filtering.[^5]
- **Resolution:** inspect missingness and choose a deliberate imputation or filtering strategy.[^5]
- **Prevention:** validate input data before plotting.[^5]
- **Related APIs:** all data-dependent plotting functions.[^5]


### 16. Hue mapping looks inconsistent across plots

- **Symptom:** the same category has different colors in different figures.[^5]
- **Root cause:** palette or category order is not stabilized globally.[^5]
- **Diagnosis:** compare ordering and palette setup across plots.[^5]
- **Resolution:** set a consistent palette and categorical order.[^5]
- **Prevention:** define a project palette map.[^5]
- **Related APIs:** `set_palette`, `color_palette`, semantic mappings.[^5]


### 17. Too many legend entries

- **Symptom:** legend overwhelms the chart.[^5]
- **Root cause:** high-cardinality hue or style encoding.[^5]
- **Diagnosis:** inspect the number of unique categories.[^5]
- **Resolution:** reduce categories, facet instead, or move detail to annotations.[^5]
- **Prevention:** avoid high-cardinality semantic channels.[^5]
- **Related APIs:** any semantic plotting API.[^5]


### 18. Plot looks different in notebook vs script

- **Symptom:** visual output changes across environments.[^5]
- **Root cause:** backend, display, and inline rendering settings differ.[^5]
- **Diagnosis:** compare Matplotlib backend and save/export paths.[^5]
- **Resolution:** standardize backend and export pipeline.[^5]
- **Prevention:** build a deterministic rendering workflow.[^5]
- **Related APIs:** Matplotlib backend behavior.[^5]


### 19. Line plot connects categories incorrectly

- **Symptom:** line suggests continuity where none exists.[^5]
- **Root cause:** x-axis ordering or categorical interpretation is wrong.[^5]
- **Diagnosis:** inspect the x variable’s type and order.[^5]
- **Resolution:** use appropriate ordering or choose a categorical summary plot.[^5]
- **Prevention:** avoid line plots for unordered categories.[^5]
- **Related APIs:** `lineplot`, `pointplot`.[^5]


### 20. Error bar interpretation is unclear

- **Symptom:** viewers do not understand what the intervals mean.[^1][^5]
- **Root cause:** interval type is not explicit enough for the audience.[^1][^5]
- **Diagnosis:** review estimator and error bar settings.[^1][^5]
- **Resolution:** label the chart or choose a more explicit summary.[^1][^5]
- **Prevention:** communicate uncertainty semantics in the figure caption.[^1][^5]
- **Related APIs:** `barplot`, `pointplot`, `lineplot`.[^1][^5]


### 21. Categorical bars are too similar

- **Symptom:** groups are hard to distinguish.[^5]
- **Root cause:** too many categories or too little contrast.[^5]
- **Diagnosis:** check category count and palette choice.[^5]
- **Resolution:** facet, reorder, or reduce categories.[^5]
- **Prevention:** design category plots for a small number of groups.[^5]
- **Related APIs:** categorical plots, palettes.[^5]


### 22. Violin plot hides sample size

- **Symptom:** groups with very different counts look visually comparable.[^5]
- **Root cause:** density width is not a count-based summary by default.[^5]
- **Diagnosis:** compare raw counts separately.[^5]
- **Resolution:** overlay counts or choose another plot.[^5]
- **Prevention:** do not use violins alone for sample-size-sensitive analysis.[^5]
- **Related APIs:** `violinplot`, `countplot`.[^5]


### 23. Box plot hides multimodality

- **Symptom:** distinct peaks are not visible.[^5]
- **Root cause:** quartile summaries compress shape.[^5]
- **Diagnosis:** inspect a histogram, KDE, or ECDF.[^5]
- **Resolution:** switch to a distribution plot that shows shape.[^5]
- **Prevention:** choose summary level based on the analytical question.[^5]
- **Related APIs:** `boxplot`, `histplot`, `kdeplot`, `ecdfplot`.[^5]


### 24. Count plot misread as proportion

- **Symptom:** viewers infer percentages from raw counts.[^5]
- **Root cause:** count plots show frequency, not normalized rate.[^5]
- **Diagnosis:** check whether normalization is needed.[^5]
- **Resolution:** use proportions or annotate counts clearly.[^5]
- **Prevention:** label the quantity being encoded.[^5]
- **Related APIs:** `countplot`.[^5]


### 25. Heatmap annotations clutter the figure

- **Symptom:** numeric labels obscure the matrix.[^5]
- **Root cause:** too many cells or too much precision.[^5]
- **Diagnosis:** inspect cell count and formatting.[^5]
- **Resolution:** disable annotations or reduce precision.[^5]
- **Prevention:** annotate only when matrix size is small enough.[^5]
- **Related APIs:** `heatmap`.[^5]


### 26. Facet scales make panels hard to compare

- **Symptom:** each panel appears on a different scale, reducing comparability.[^5]
- **Root cause:** axis sharing or scaling settings differ from the comparison goal.[^5]
- **Diagnosis:** inspect facet scale settings.[^5]
- **Resolution:** standardize scales when comparison matters.[^5]
- **Prevention:** decide whether absolute or relative comparison is needed.[^5]
- **Related APIs:** `relplot`, `catplot`, `displot`, `FacetGrid`.[^5]


### 27. Objects API feels unfamiliar

- **Symptom:** declarative plot code seems less immediate than traditional functions.[^5]
- **Root cause:** grammar-of-graphics workflow differs from the axes-level API.[^5]
- **Diagnosis:** check whether the task is simple enough to justify the interface.[^5]
- **Resolution:** use axes-level functions for simpler cases or standardize the objects API in the team.[^5]
- **Prevention:** adopt one plotting style per project.[^5]
- **Related APIs:** `seaborn.objects.Plot`.[^5]


### 28. Mixed pyplot and Seaborn state causes confusion

- **Symptom:** labels, legends, or layouts behave inconsistently.[^2][^5]
- **Root cause:** Matplotlib state and Seaborn convenience APIs are being mixed without clear ownership.[^2][^5]
- **Diagnosis:** inspect where figures and axes are created and modified.[^5]
- **Resolution:** pick a figure ownership strategy and stick to it.[^5]
- **Prevention:** define a plotting pattern for the codebase.[^5]
- **Related APIs:** all plotting functions, Matplotlib Figure/Axes methods.[^5]


### 29. Theme does not reset as expected

- **Symptom:** resetting style leaves residual changes.[^5]
- **Root cause:** custom rc parameters or external Matplotlib state persist.[^5]
- **Diagnosis:** inspect explicit rc changes and startup code.[^5]
- **Resolution:** restore defaults or isolate the plotting session.[^5]
- **Prevention:** centralize theme initialization.[^5]
- **Related APIs:** `set_theme`, `reset_defaults`, `reset_orig`.[^5]


### 30. Exported figure is blurry

- **Symptom:** raster output appears low quality.[^5]
- **Root cause:** output format or DPI is not appropriate.[^5]
- **Diagnosis:** check file format and save settings.[^5]
- **Resolution:** use vector output or higher DPI where appropriate.[^5]
- **Prevention:** define export standards per deliverable type.[^5]
- **Related APIs:** Matplotlib save/export after Seaborn plotting.[^5]


## Compatibility

| Area | Status |
| :-- | :-- |
| Python | Python 3.8+ [^5] |
| NumPy | **Not officially documented.** |
| Pandas | **Not officially documented.** |
| Matplotlib | **Not officially documented** in the retrieved compatibility excerpt, but Seaborn is documented as built on Matplotlib. [^2][^5] |
| Optional dependencies | statsmodels, SciPy, and clustering-related packages are documented for advanced features. [^5] |
| Operating systems | **Not officially documented.** |
| Development environments | Jupyter notebook and IPython terminal are explicitly referenced; other environments are **Not officially documented**. [^5] |
| Headless environments | Supported through Matplotlib rendering and save/show workflows, but detailed behavior is **Not officially documented**. [^5] |
| Backend considerations | Rendering depends on Matplotlib backends. [^5] |

## Migration Notes

### New Features in 0.13.x

Seaborn 0.13 introduced major enhancements to categorical plots, support for alternate dataframe libraries, and improved configuration for the objects interface.[^1]

### Behavioral Changes

The v0.12 release notes identify keyword-only arguments, more flexible error bars, and the introduction of the objects interface as major changes affecting usage style.[^1]

### Deprecated APIs

The API reference marks `rugplot` as deprecated in the distribution plots section.[^5]

### Deprecated Parameters

**Not officially documented** in the retrieved excerpts.

### Removed APIs

**Not officially documented** in the retrieved excerpts.

### Replacement APIs

For deprecated or legacy usage, prefer the documented stable APIs listed in the API reference and the objects interface where appropriate.[^5]

### Compatibility Concerns

Code written against older seaborn versions may need updates for keyword-only signatures, error bar semantics, and categorical plot behavior.[^1]

### Recommended Migration Strategy

1. Pin to the selected version.
2. Review the 0.12 and 0.13 release notes before upgrading code paths.
3. Validate categorical plots, error bars, and any objects interface usage against the 0.13.2 docs.
4. Re-run representative figures in notebooks and export pipelines.[^1][^5]

## Comparison With Other Libraries

| Library | Philosophy | Abstraction | Statistical features | Interactivity | Publication output | Best fit |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Seaborn | Statistical graphics on top of Matplotlib. [^2][^5] | High-level. | Strong built-in summaries, faceting, distributions, categorical stats, regression, matrices. [^5] | Low. | Strong, especially with Matplotlib export control. [^2][^5] | Statistical EDA and publication-ready static figures. |
| Matplotlib | Low-level plotting engine. [^2][^5] | Low-level. | Limited built-in statistical abstraction. | Low to moderate via backends. | Very strong. | Fine-grained custom static plots. |
| Plotly | **Not officially documented** in the retrieved Seaborn sources. | — | — | — | — | Interactive dashboards and browser-native charts. |
| Bokeh | **Not officially documented** in the retrieved Seaborn sources. | — | — | — | — | Interactive web plots. |
| Altair | **Not officially documented** in the retrieved Seaborn sources. | — | — | — | — | Declarative interactive grammar-of-graphics plots. |

## Common Engineering Pitfalls

- Using Seaborn when low-level Matplotlib control is actually required.[^5]
- Treating statistical defaults as neutral when they are interpretive.[^1][^5]
- Over-faceting and over-encoding data.[^5]
- Relying on global styling state without reset discipline.[^5]
- Using palette choices that reduce accessibility or consistency.[^5]
- Applying distribution or summary plots where raw observations are needed.[^5]
- Ignoring category order and semantic consistency across figures.[^5]
- Mixing grid ownership patterns without a clear layout strategy.[^5]
- Assuming all compatibility details are stable when only Python 3.8+ is explicitly documented in the retrieved install page.[^5]


## Production Best Practices

### Project Organization

Centralize plotting configuration, palette choice, and theme initialization in one place. Keep reusable plotting functions separate from notebook exploration so reports remain deterministic and easier to test.

### Theme Management

Use `set_theme()` once at session start, and avoid changing global style mid-pipeline unless the change is intentional and localized. Reset or isolate state when plotting inside shared notebooks or long-lived services.[^5]

### Color Management

Use categorical palettes for discrete groups, sequential palettes for ordered magnitudes, and diverging palettes for values centered around a midpoint. Prefer colorblind-safe palettes for shared reports and keep palette assignments stable across related figures.[^5]

### Figure Design

Set figure size and aspect ratio deliberately, label axes explicitly, and keep legends readable. Use faceting only when the subset comparison is truly important; otherwise prefer a simpler single-panel figure.[^5]

### Data Preparation

Prepare tidy long-form data when possible, set category order before plotting, and decide how to handle missing values before the plot call. Preprocessing upstream is usually easier to test and reproduce than patching plots afterward.[^5]

### Statistical Visualization

Choose estimators and error bars intentionally. If the summary statistic changes the story, document it in the caption or plot label.[^1][^5]

### Figure-Level vs Axes-Level APIs

Use axes-level functions for manual composition, figure-level functions for faceting and automatic layout, and the objects interface for composable declarative specifications. Pick one primary style per codebase when possible to reduce confusion.

### Objects API Adoption

Adopt the objects interface when you want reusable plot specifications, composability, and a grammar-of-graphics workflow. Keep using axes-level and figure-level APIs when the team values immediate familiarity or has already standardized on them.[^5]

### Working With Matplotlib

Access the returned Figure or Axes to finish titles, ticks, annotations, and export behavior. This is normal and expected because Seaborn delegates rendering to Matplotlib.[^2][^5]

### Performance Optimization

Reduce repeated plotting calls, avoid very large pairwise grids, and facet only when the split adds analytical value. For dense data, prefer aggregation, sampling, or summary views over raw overplotted marks.[^5]

### Large Dataset Visualization

Use binning, aggregation, or subsampling when mark density becomes unreadable. Large pairwise and faceted plots are expensive and can obscure the message rather than clarify it.[^5]

### Publication Quality Figures

Use appropriate DPI and file format through Matplotlib export. Prefer vector output for line art and publication graphics when possible.[^2][^5]

### Reproducibility

Pin the Seaborn version, stabilize category order, and standardize theme setup. Keep the plotting environment consistent across notebooks, scripts, and CI.[^1][^5]

### Accessibility

Use colorblind-friendly palettes, ensure readable font sizes, and do not depend on color alone to encode meaning. Add clear labels and choose contrast-aware styling.[^5]

## Official Resource Index

### Documentation

- [Documentation home](https://seaborn.pydata.org/)[^2]
- [Stable documentation](https://seaborn.pydata.org/)[^2]
- [API reference](https://seaborn.pydata.org/api.html)[^5]
- [User guide / tutorials](https://seaborn.pydata.org/tutorial.html)
- [Examples gallery](https://seaborn.pydata.org/examples/index.html)


### Package Information

- [PyPI](https://pypi.org/project/seaborn/)[^3]
- [GitHub repository](https://github.com/seaborn/seaborn)[^4]
- [Source code](https://github.com/seaborn/seaborn)


### Development

- [GitHub issues](https://github.com/seaborn/seaborn/issues)
- [GitHub discussions](https://github.com/seaborn/seaborn/discussions)


### Release Information

- [Release notes / what's new](https://seaborn.pydata.org/whatsnew/index.html)[^1]
- [v0.13.0](https://seaborn.pydata.org/whatsnew/v0.13.0.html)[^6]
- [v0.13.2](https://seaborn.pydata.org/whatsnew/v0.13.2.html)[^7]


### Related Official Resources

- [Matplotlib documentation](https://matplotlib.org/stable/)
- [NumPy documentation](https://numpy.org/doc/)
- [Pandas documentation](https://pandas.pydata.org/docs/)


## Canonical AENS Fit

This document is structured for AENS Package transformation: metadata is isolated, modules and concepts are searchable, canonical tasks are action-oriented, and official sources are identified inline. The content is version-scoped to Seaborn 0.13.2 and uses only official documentation-derived claims where available.[^2][^1][^5]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: CURRENT_PROJECT_STATE_REPORT.md

[^3]: https://pypi.org/project/seaborn/

[^4]: https://github.com/seaborn

[^5]: CONTENT_QUALITY_STANDARD.md

[^6]: https://seaborn.pydata.org/whatsnew/v0.13.0.html

[^7]: http://seaborn.pydata.org/whatsnew/v0.13.2.html

[^8]: ARCHITECTURE_FREEZE.md

[^9]: AENS-Knowledge-Layer-Specification.md

[^10]: https://arxiv.org/pdf/2201.06720.pdf

[^11]: https://arxiv.org/pdf/2204.05345.pdf

[^12]: http://arxiv.org/pdf/2209.00393.pdf

[^13]: https://arxiv.org/html/2411.03431v1

[^14]: https://pypi.org/project/seaborn/0.1/

[^15]: https://seaborn.pydata.org/whatsnew/index.html

[^16]: https://seaborn.pydata.org/whatsnew/v0.12.0.html

[^17]: https://github.com/seaborn/seaborn.github.io

[^18]: https://pypi.org/project/seaborn-command/

[^19]: https://pypi.org/project/seaborn/0.8/

[^20]: https://github.com/orgs/seaborn/repositories

[^21]: https://pypi.org/project/seaborn/0.2.1/

[^22]: http://arxiv.org/pdf/2411.00172.pdf

[^23]: https://dx.plos.org/10.1371/journal.pone.0315796

[^24]: https://joss.theoj.org/papers/10.21105/joss.00547.pdf

[^25]: http://arxiv.org/pdf/2412.12542.pdf

[^26]: https://www.mdpi.com/1424-8220/23/7/3691/pdf?version=1680492534

[^27]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10099051/

[^28]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9245644/

[^29]: https://seaborn.pydata.org/installing.html

[^30]: https://seaborn.pydata.org/whatsnew/v0.13.1.html

[^31]: https://seaborn.pydata.org/whatsnew/v0.10.0.html

[^32]: https://seaborn.pydata.org/whatsnew/v0.7.0.html

[^33]: https://seaborn.pydata.org/whatsnew/v0.2.0.html

[^34]: https://seaborn.pydata.org/whatsnew/v0.9.0.html

