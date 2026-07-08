<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Matplotlib Canonical AENS Package Knowledge Document

## Version policy

- **Selected version:** Matplotlib 3.10.3.[^1]
- **Release date:** Available as the stable documentation version on the official site; the release-notes index for 3.10 includes 3.10.3 coverage, and the stable docs currently resolve to 3.10.3.[^2][^1]
- **Why this version:** It is the current stable documentation target, production-ready, non-beta, non-RC, non-development, and officially documented on the project site.[^1][^2]


## Package metadata

| Field | Value |
| :-- | :-- |
| Package name | Matplotlib [^1] |
| Canonical name | Matplotlib [^1] |
| Import name | `matplotlib` [^1] |
| Latest stable production version | 3.10.3 [^1] |
| Release date | 3.10.3 is the current stable docs version; release-note index includes 3.10.3 coverage [^1][^2] |
| Supported Python versions | Not officially documented in the fetched stable homepage content [^1] |
| License | Not officially documented in the fetched stable homepage content [^1] |
| Maintainer / Organization | Matplotlib project/community [^1][^3] |
| Package purpose | Static, animated, and interactive visualization in Python [^1] |
| Primary engineering domains | Data visualization, scientific computing, exploratory analysis, reporting [^1] |
| Installation command (pip) | `pip install matplotlib` [^1] |
| Installation command (conda) | `conda install -c conda-forge matplotlib` [^1] |
| Standard import statement | `import matplotlib.pyplot as plt` [^1] |
| Official GitHub repository | [matplotlib/matplotlib](https://github.com/matplotlib/matplotlib/) [^3] |
| GitHub Issues URL | Not officially documented in fetched sources |
| GitHub Discussions URL | Not officially documented in fetched sources |
| Official Documentation URL | [https://matplotlib.org/stable/index.html](https://matplotlib.org/stable/index.html) [^1] |
| Stable Documentation URL | [https://matplotlib.org/stable/index.html](https://matplotlib.org/stable/index.html) [^1] |
| Official API Reference URL | [https://matplotlib.org/stable/api/](https://matplotlib.org/stable/api/) |
| Official Examples Gallery URL | [https://matplotlib.org/stable/gallery/](https://matplotlib.org/stable/gallery/) |
| Official Tutorials URL | [https://matplotlib.org/stable/tutorials/](https://matplotlib.org/stable/tutorials/) |
| Official Release Notes URL | [https://matplotlib.org/stable/users/release_notes.html](https://matplotlib.org/stable/users/release_notes.html) [^2] |
| Official Changelog URL | [https://matplotlib.org/stable/users/release_notes.html](https://matplotlib.org/stable/users/release_notes.html) [^2] |
| PyPI URL | [https://pypi.org/project/matplotlib/](https://pypi.org/project/matplotlib/) |
| Source code URL | [https://github.com/matplotlib/matplotlib](https://github.com/matplotlib/matplotlib) [^3] |

## Package overview

Matplotlib is the foundational Python plotting library for producing static, animated, and interactive figures. Its design is centered on the figure/axes/artist hierarchy, which gives engineers fine-grained control over every visual element. It is best understood as a low-level, highly configurable rendering system rather than a declarative charting layer.[^1]

The library is commonly used when publication-quality output, exact control, or backend flexibility matters more than convenience. It integrates naturally with NumPy-style arrays and is frequently used alongside Pandas for data shaping and Seaborn for statistical defaults, while Plotly is typically chosen when web-native interactivity is the priority.[^1]

## Architecture

Matplotlib’s practical mental model is: data is drawn into an `Axes`, `Axes` live inside a `Figure`, and both are composed of `Artist` objects. Rendering happens through a backend, so output behavior depends on whether the target is a notebook, GUI window, raster file, or vector file.[^1]

The `pyplot` interface is stateful and optimized for quick work, while the object-oriented API is preferred for maintainable production code. The library’s flexibility comes from this dual interface, but that same flexibility is also a common source of confusion when stateful and object-oriented styles are mixed in one codebase.

## Library relationships

Matplotlib is often the final rendering layer after NumPy or Pandas transforms data into a plottable form. Seaborn builds on Matplotlib and adds statistical defaults, while Plotly and Bokeh target richer browser interactivity. For many production workflows, Matplotlib remains the most predictable option when export fidelity, backend stability, and plot customization are the primary concerns.[^1]

## Important modules

| Module | Purpose | Mental trigger | When to use | Avoid when | Major classes/functions | Related modules |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `pyplot` | Stateful plotting interface [^1] | I need quick plotting in one script or notebook. | Fast exploration, simple figures, interactive sessions. | Large multi-figure apps, library code, reusable plotting systems. | `plot`, `subplots`, `figure`, `show`, `savefig`. | `figure`, `axes`, `style`, `backend`. |
| `figure` | Figure container and figure-level layout [^1] | I need to control the whole canvas. | Multi-panel figures, page layouts, export control. | One-off exploratory plots that do not need layout control. | `Figure`, `add_subplot`, `subplots`. | `axes`, `artist`, `transforms`. |
| `axes` | Plotting area and chart methods [^1] | I need to draw data into a specific panel. | Production plotting, subplot management, axis-specific formatting. | Global-state plotting patterns. | `Axes`, `plot`, `scatter`, `bar`, `hist`. | `figure`, `ticker`, `colors`, `lines`. |
| `artist` | Base rendering object [^1] | I need to customize a visual element directly. | Advanced styling, introspection, custom drawing. | Simple chart building. | `Artist`, `set_visible`, `set_alpha`. | `figure`, `axes`, `patches`, `lines`. |
| `colors` | Color parsing and normalization [^1] | I need to manage palettes or color values. | Consistent theming, colormap normalization, categorical colors. | Logic unrelated to color mapping. | `to_rgb`, `to_rgba`, `Normalize`, `ListedColormap`. | `cm`, `style`. |
| `cm` | Colormap utilities [^1] | I need a colormap. | Heatmaps, scalar-to-color mapping, continuous data. | Pure categorical color selection. | `get_cmap`, colormap classes. | `colors`, `image`. |
| `ticker` | Tick locators and formatters [^1] | I need precise axis ticks. | Financial axes, dates, scientific notation, dense plots. | Default axes where auto ticks are sufficient. | `MaxNLocator`, `AutoMinorLocator`, `FuncFormatter`. | `axes`, `dates`. |
| `patches` | Filled geometric shapes [^1] | I need shapes or annotations with geometry. | Bars, boxes, highlights, custom overlays. | Basic line plotting. | `Rectangle`, `Circle`, `Polygon`, `Patch`. | `axes`, `artist`. |
| `lines` | Line primitives [^1] | I need direct control over line artists. | Custom styling, legend handles, advanced line behavior. | Standard line charts with `plot`. | `Line2D`. | `axes`, `legend`. |
| `collections` | Efficient grouped artists [^1] | I need many marks efficiently. | Scatter-like workloads, polygons, spans, large repeated elements. | Single-object annotations. | `PathCollection`, `LineCollection`. | `axes`, `path`. |
| `transforms` | Coordinate systems and transforms [^1] | I need coordinates in data, axes, or figure space. | Annotation positioning, custom drawing, layout reasoning. | Simple default plots. | `Transform`, `Bbox`. | `axes`, `figure`, `artist`. |
| `animation` | Animated output [^1] | I need frames over time. | Time series motion, teaching visuals, media export. | Static reporting. | `FuncAnimation`, writers. | `backend`, `figure`. |
| `widgets` | Interactive controls [^1] | I need sliders, buttons, or selectors. | Notebook demos, lightweight interactivity. | Headless batch rendering. | `Slider`, `Button`, `CheckButtons`. | `pyplot`, `backend`. |
| `style` | Style sheets and rc defaults [^1] | I need consistent theming. | Team-wide chart consistency, brand styling. | One-off ad hoc formatting. | `use`, style context managers. | `colors`, `rcParams`. |
| `backend` | Rendering backend selection [^1] | I need to control display/export behavior. | Desktop GUI, notebook, headless, file export. | Plot semantics. | Backend modules and configuration. | `pyplot`, `figure`. |
| `dates` | Date handling for axes | I need date axes. | Time series plots with readable date formatting. | Non-temporal data. | Date locators/formatters. | `ticker`, `axes`. |
| `path` | Path geometry utilities | I need custom vector geometry. | Custom markers, clipping, advanced drawing. | Ordinary charts. | `Path`. | `patches`, `artist`. |
| `text` | Text rendering and annotation support [^1] | I need labels, annotations, or typography. | Titles, labels, callouts, figure notes. | Data marks only. | `Text`, `Annotation`. | `axes`, `artist`. |

## Canonical APIs

The 60 APIs below are selected for high-frequency production use and broad coverage across figure creation, axes management, plotting marks, layout, styling, export, interactivity, and rendering.

### 1. `matplotlib.pyplot.subplots`

- **Category:** Figure creation
- **Module:** `pyplot`
- **Signature:** `subplots(nrows=1, ncols=1, *, sharex=False, sharey=False, squeeze=True, width_ratios=None, height_ratios=None, subplot_kw=None, gridspec_kw=None, **fig_kw)`
- **Purpose:** Create a figure and a grid of axes in one call.
- **Mental Trigger:** I need to create a figure with one or more panels quickly.
- **When To Use:** 1) Standard report figures. 2) Multi-panel comparisons. 3) Notebook exploration. 4) Side-by-side model diagnostics. 5) Shared-axis layouts.
- **Avoid When:** 1) You need fine control over a pre-existing figure. 2) You are writing library code that should avoid stateful globals. 3) You only need a single axis and already have a figure. 4) You need a custom nested layout. 5) You are constructing figures from reusable components.
- **Parameters:** `nrows`, `ncols`, `sharex`, `sharey`, `squeeze`, `subplot_kw`, `gridspec_kw`, `fig_kw`.
- **Return Value:** `(Figure, Axes or ndarray of Axes)`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(4, 3))
ax.plot([1, 2, 3], [1, 4, 9])
fig.tight_layout()
fig.savefig("subplots_example.png")
```

- **Expected Output:** A single line chart saved to file.
- **Performance Notes:** Efficient for common layouts; layout cost grows with more axes.
- **Common Mistakes:** Forgetting that a single axis may be returned as a scalar; mixing stateful and OO APIs; misusing shared axes; calling `plt.show()` before saving; relying on implicit current figure.
- **Gotchas:** `squeeze=False` changes return shape; sharing axes affects tick labels; `fig_kw` passes through to `figure`; layout settings may interact with `tight_layout`; object unpacking differs between 1x1 and multi-axis grids.
- **Related APIs:** `figure`, `subplot_mosaic`, `add_subplot`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html)


### 2. `matplotlib.pyplot.figure`

- **Category:** Figure creation
- **Module:** `pyplot`
- **Signature:** `figure(num=None, figsize=None, dpi=None, *, facecolor=None, edgecolor=None, frameon=True, FigureClass=<class 'matplotlib.figure.Figure'>, clear=False, **kwargs)`
- **Purpose:** Create or activate a figure.
- **Mental Trigger:** I need a top-level canvas.
- **When To Use:** 1) Start a new plot window. 2) Set figure size. 3) Reuse a figure by number. 4) Control figure-level styling. 5) Build multi-axes layouts manually.
- **Avoid When:** 1) You already have a figure from `subplots`. 2) You want purely object-oriented plotting. 3) You are inside reusable library code with explicit figure injection. 4) You need direct subplot creation only. 5) You want minimal global state.
- **Parameters:** `num`, `figsize`, `dpi`, `facecolor`, `edgecolor`, `frameon`, `FigureClass`, `clear`.
- **Return Value:** `Figure`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig = plt.figure(figsize=(4, 3), dpi=150)
ax = fig.add_subplot(111)
ax.plot([0, 1], [0, 1])
fig.savefig("figure_example.png")
```

- **Expected Output:** A 1:1 line figure saved to disk.
- **Performance Notes:** `dpi` strongly affects render cost and file size.
- **Common Mistakes:** Creating multiple unintended figures; forgetting to attach axes; using `figure` when `subplots` is simpler; not closing figures in batch jobs; confusing figure size with axis size.
- **Gotchas:** `num` can reuse an existing figure; `clear=True` removes prior contents; `dpi` affects on-screen and saved output; figure face color can affect export appearance; backends may interpret sizing differently.
- **Related APIs:** `subplots`, `savefig`, `clf`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.figure.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.figure.html)


### 3. `matplotlib.pyplot.subplot_mosaic`

- **Category:** Figure creation
- **Module:** `pyplot`
- **Signature:** `subplot_mosaic(mosaic, *, sharex=False, sharey=False, width_ratios=None, height_ratios=None, empty_sentinel='.', subplot_kw=None, gridspec_kw=None, per_subplot_kw=None, figsize=None, layout=None, **fig_kw)`
- **Purpose:** Create a labeled layout from a mosaic specification.
- **Mental Trigger:** I need a readable named layout.
- **When To Use:** 1) Complex dashboard figures. 2) Named subplot composition. 3) Reusable analysis layouts. 4) Layouts where panel identity matters. 5) Non-rectangular placement logic.
- **Avoid When:** 1) One-panel charts. 2) Very simple grids. 3) You want minimal syntax overhead. 4) You do not need named axes. 5) You are targeting older code conventions without need.
- **Parameters:** `mosaic`, `sharex`, `sharey`, `width_ratios`, `height_ratios`, `subplot_kw`, `gridspec_kw`, `figsize`.
- **Return Value:** `(Figure, dict of Axes)`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, axd = plt.subplot_mosaic([["a", "b"], ["c", "b"]], figsize=(5, 4))
axd["a"].plot([1, 2, 3], [1, 2, 3])
axd["b"].bar([1, 2, 3], [3, 2, 1])
axd["c"].scatter([1, 2, 3], [2, 2, 4])
fig.tight_layout()
fig.savefig("subplot_mosaic_example.png")
```

- **Expected Output:** A labeled multi-panel figure.
- **Performance Notes:** Layout complexity is dominated by the number of axes, not the mosaic syntax.
- **Common Mistakes:** Reusing labels unintentionally; forgetting that labels map to shared axes; using invalid mosaic shapes; overcomplicating simple figures; assuming a list return instead of a dict.
- **Gotchas:** Mosaic labels define axis identity; repeated labels merge panels; empty cells require `empty_sentinel`; layout shape is inferred from the input; returned object is keyed by labels.
- **Related APIs:** `subplots`, `GridSpec`, `figure`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html)


### 4. `matplotlib.pyplot.plot`

- **Category:** Line plots
- **Module:** `pyplot`
- **Signature:** `plot(*args, scalex=True, scaley=True, data=None, **kwargs)`
- **Purpose:** Draw one or more line series.
- **Mental Trigger:** I need a line chart.
- **When To Use:** 1) Trend visualization. 2) Time series lines. 3) Continuous function plots. 4) Baseline comparison plots. 5) Lightweight multi-series charts.
- **Avoid When:** 1) You need discrete bars. 2) You need point-only charts without connecting lines. 3) You need dense unaggregated scatter for huge datasets. 4) You need filled distributions. 5) You need geometry-based rendering.
- **Parameters:** `*args`, `scalex`, `scaley`, `data`, `**kwargs`.
- **Return Value:** List of `Line2D`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9], marker="o")
fig.savefig("plot_example.png")
```

- **Expected Output:** A simple line chart with markers.
- **Performance Notes:** Line rendering is usually lightweight; many points or many series increase draw time.
- **Common Mistakes:** Swapping x and y; forgetting markers for sparse series; overplotting too many lines; assuming `plot` sorts data; using it for categorical bars.
- **Gotchas:** Multiple argument patterns are accepted; style kwargs affect the returned line artists; line plotting does not aggregate data; empty inputs still create artists; lines are clipped by axes limits.
- **Related APIs:** `Axes.plot`, `scatter`, `step`, `fill_between`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.plot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.plot.html)


### 5. `matplotlib.pyplot.scatter`

- **Category:** Scatter plots
- **Module:** `pyplot`
- **Signature:** `scatter(x, y, s=None, c=None, marker=None, cmap=None, norm=None, vmin=None, vmax=None, alpha=None, linewidths=None, *, edgecolors=None, plotnonfinite=False, data=None, **kwargs)`
- **Purpose:** Draw point markers with optional size and color encoding.
- **Mental Trigger:** I need a scatter plot.
- **When To Use:** 1) Correlation inspection. 2) Cluster visualization. 3) Outlier spotting. 4) Size/color encoded points. 5) Feature relationship analysis.
- **Avoid When:** 1) You need connected trends. 2) You have extremely large raw point clouds without downsampling. 3) You need bars or histograms. 4) You want categorical group summaries. 5) You need exact line paths.
- **Parameters:** `x`, `y`, `s`, `c`, `marker`, `cmap`, `norm`, `alpha`.
- **Return Value:** `PathCollection`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.scatter([1, 2, 3], [3, 1, 4], s=[20, 40, 60], c=[0.2, 0.5, 0.9], cmap="viridis")
fig.savefig("scatter_example.png")
```

- **Expected Output:** A colored scatter plot.
- **Performance Notes:** Large point counts can be expensive; use rasterization or aggregation when appropriate.
- **Common Mistakes:** Confusing `s` with radius instead of area; passing color arrays with incompatible shapes; overusing edge colors on tiny markers; plotting point clouds without alpha; forgetting colormap normalization.
- **Gotchas:** `s` is marker area; `c` can mean a sequence of values or colors depending on shape/type; marker edge rendering can change appearance; `plotnonfinite` controls non-finite handling; legend behavior differs from line plots.
- **Related APIs:** `plot`, `hexbin`, `hist2d`, `PathCollection`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html)


### 6. `matplotlib.pyplot.hist`

- **Category:** Histograms
- **Module:** `pyplot`
- **Signature:** `hist(x, bins=None, range=None, density=False, weights=None, cumulative=False, bottom=None, histtype='bar', align='mid', orientation='vertical', rwidth=None, log=False, color=None, label=None, stacked=False, *, data=None, **kwargs)`
- **Purpose:** Compute and draw a histogram.
- **Mental Trigger:** I need a distribution summary.
- **When To Use:** 1) Value distribution inspection. 2) Data quality checks. 3) Skewness checks. 4) Comparing distributions. 5) Quick density approximation.
- **Avoid When:** 1) You need exact sample-level detail. 2) You need categorical counts. 3) You have extremely many bins without reason. 4) You need a cumulative line instead. 5) You need precise quantile visualization.
- **Parameters:** `x`, `bins`, `range`, `density`, `weights`, `histtype`, `orientation`, `stacked`.
- **Return Value:** `(n, bins, patches)`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.hist([1, 1, 2, 2, 2, 3, 4], bins=4)
fig.savefig("hist_example.png")
```

- **Expected Output:** A histogram bar chart.
- **Performance Notes:** Binning is usually cheap; plotting many bins or many series increases rendering cost.
- **Common Mistakes:** Choosing too many bins; comparing raw counts when densities are needed; using histograms for categorical data; ignoring bin alignment; stacking dissimilar distributions without care.
- **Gotchas:** Histogram output includes counts and bin edges; `density=True` changes the y-axis meaning; bin choice strongly affects interpretation; `stacked=True` changes visual semantics; bins can be explicit arrays.
- **Related APIs:** `ax.hist`, `bar`, `stairs`, `ecdf`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hist.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hist.html)


### 7. `matplotlib.pyplot.bar`

- **Category:** Bar charts
- **Module:** `pyplot`
- **Signature:** `bar(x, height, width=0.8, bottom=None, *, align='center', data=None, **kwargs)`
- **Purpose:** Draw vertical bars.
- **Mental Trigger:** I need a categorical comparison chart.
- **When To Use:** 1) Category comparison. 2) Aggregated metric display. 3) Counts by group. 4) Discrete ranking visuals. 5) Simple part-to-whole comparisons.
- **Avoid When:** 1) Categories are too many to read. 2) The data are continuous rather than discrete. 3) You need precise distribution shape. 4) You need stacked time series without careful design. 5) You want a scatter or line view.
- **Parameters:** `x`, `height`, `width`, `bottom`, `align`.
- **Return Value:** `BarContainer`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(["A", "B", "C"], [3, 5, 2])
fig.savefig("bar_example.png")
```

- **Expected Output:** A vertical bar chart.
- **Performance Notes:** Small to medium bar counts are cheap; many bars can crowd the axis and slow rendering.
- **Common Mistakes:** Using bars for continuous trends; too many categories; mismatched x labels; unordered categories; excessive decoration.
- **Gotchas:** `height` is not automatically aggregated; bar width is in x-axis units; label spacing matters; bars can be stacked or aligned differently; color cycles apply per bar group.
- **Related APIs:** `barh`, `hist`, `stackplot`, `bar_label`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.bar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.bar.html)


### 8. `matplotlib.pyplot.pie`

- **Category:** Pie charts
- **Module:** `pyplot`
- **Signature:** `pie(x, explode=None, labels=None, colors=None, autopct=None, pctdistance=0.6, shadow=False, labeldistance=1.1, startangle=0, radius=1, counterclock=True, wedgeprops=None, textprops=None, center=(0, 0), frame=False, rotatelabels=False, *, normalize=True, hatch=None, data=None)`
- **Purpose:** Draw a pie chart.
- **Mental Trigger:** I need a part-to-whole view and the number of slices is small.
- **When To Use:** 1) Very small category counts. 2) Simple composition visuals. 3) When proportions are the main message. 4) When labels are short. 5) When exact comparison is not the main task.
- **Avoid When:** 1) Many slices. 2) Close-value comparisons. 3) Precise ranking is needed. 4) Long labels are expected. 5) The viewer needs accurate angle comparison.
- **Parameters:** `x`, `labels`, `colors`, `autopct`, `startangle`, `counterclock`, `normalize`, `wedgeprops`.
- **Return Value:** `(patches, texts, autotexts)`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.pie([30, 20, 50], labels=["A", "B", "C"])
fig.savefig("pie_example.png")
```

- **Expected Output:** A basic pie chart.
- **Performance Notes:** Rendering is usually cheap; readability degrades quickly as slice count rises.
- **Common Mistakes:** Using too many slices; relying on pie for exact comparison; omitting labels; using inconsistent normalization; cluttering with effects.
- **Gotchas:** Slice order affects reading; labels and percentages can overlap; `normalize` changes interpretation; `startangle` can improve readability; pies are often less informative than bars.
- **Related APIs:** `bar`, `ax.pie`, `wedgeprops`, `legend`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pie.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pie.html)


### 9. `matplotlib.pyplot.boxplot`

- **Category:** Box plots
- **Module:** `pyplot`
- **Signature:** `boxplot(x, notch=None, sym=None, vert=None, whis=None, positions=None, widths=None, patch_artist=None, bootstrap=None, usermedians=None, conf_intervals=None, meanline=None, showmeans=None, showcaps=None, showbox=None, showfliers=None, boxprops=None, tick_labels=None, flierprops=None, medianprops=None, meanprops=None, capprops=None, whiskerprops=None, manage_ticks=True, autorange=False, zorder=None, capwidths=None, *, data=None)`
- **Purpose:** Draw summary statistics and outliers.
- **Mental Trigger:** I need a compact distribution comparison.
- **When To Use:** 1) Comparing groups. 2) Outlier inspection. 3) Distribution shape summary. 4) Publication-style statistical plots. 5) Many group comparisons with limited space.
- **Avoid When:** 1) Sample size is tiny and misleading. 2) Exact distribution detail is required. 3) The audience needs raw data points only. 4) The distribution is highly multimodal and box summary hides structure. 5) You want a histogram-like shape.
- **Parameters:** `x`, `whis`, `positions`, `widths`, `showfliers`, `patch_artist`, `manage_ticks`, `autorange`.
- **Return Value:** Dictionary of artists.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.boxplot([[1, 2, 3, 4], [2, 3, 5, 8]])
fig.savefig("boxplot_example.png")
```

- **Expected Output:** A two-box comparison plot.
- **Performance Notes:** Generally cheap; large numbers of groups increase clutter rather than compute cost.
- **Common Mistakes:** Misreading whiskers; hiding fliers without reason; using box plots for very small samples; assuming mean is shown by default; overloading the figure with categories.
- **Gotchas:** Whisker rules matter; median is not mean; `showfliers` affects visible outliers; tick labels may need manual management; orientation controls readability.
- **Related APIs:** `violinplot`, `hist`, `stripplot` in other libraries, `errorbar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.boxplot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.boxplot.html)


### 10. `matplotlib.pyplot.violinplot`

- **Category:** Violin plots
- **Module:** `pyplot`
- **Signature:** `violinplot(dataset, positions=None, vert=True, widths=0.5, showmeans=False, showextrema=True, showmedians=False, quantiles=None, points=100, bw_method=None, *, data=None)`
- **Purpose:** Draw density-shaped distribution summaries.
- **Mental Trigger:** I need to compare distributions with shape detail.
- **When To Use:** 1) Group distribution comparison. 2) Seeing multimodality. 3) Comparing spread plus density. 4) Statistical reports. 5) When box plots are too coarse.
- **Avoid When:** 1) Very small samples. 2) The audience is unfamiliar with density plots. 3) You need direct data points. 4) Many groups would overcrowd the chart. 5) Exact numerical comparison matters more than shape.
- **Parameters:** `dataset`, `positions`, `vert`, `widths`, `showmeans`, `showextrema`, `showmedians`, `quantiles`.
- **Return Value:** Dictionary of artists.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.violinplot([[1, 2, 2, 3, 4], [2, 3, 4, 5, 7]])
fig.savefig("violin_example.png")
```

- **Expected Output:** A two-violin distribution comparison.
- **Performance Notes:** Density estimation adds cost relative to box plots.
- **Common Mistakes:** Overtrusting the shape with tiny samples; leaving out medians or quantiles; using too many violins; confusing density width with raw count; comparing unlike sample sizes without context.
- **Gotchas:** Kernel smoothing affects appearance; widths are visual, not counts; `vert` controls orientation; extrema markers can be enabled or disabled; violin shape is a summary, not raw data.
- **Related APIs:** `boxplot`, `hist`, `density`, `fill_between`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.violinplot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.violinplot.html)


### 11. `matplotlib.pyplot.imshow`

- **Category:** Images / heatmaps
- **Module:** `pyplot`
- **Signature:** `imshow(X, cmap=None, norm=None, *, aspect=None, interpolation=None, alpha=None, vmin=None, vmax=None, origin=None, extent=None, interpolation_stage=None, filternorm=True, filterrad=4.0, resample=None, url=None, data=None, **kwargs)`
- **Purpose:** Display array data as an image.
- **Mental Trigger:** I need to show matrix-like data or pixel data.
- **When To Use:** 1) Heatmaps. 2) Image arrays. 3) Attention maps. 4) Correlation matrices. 5) Dense grid data.
- **Avoid When:** 1) The matrix is sparse and labels matter more than pixels. 2) You need exact cell boundaries with annotations. 3) You want categorical rectangles with custom axes. 4) You need a line or scatter view. 5) The array size is too large for readable display.
- **Parameters:** `X`, `cmap`, `norm`, `aspect`, `interpolation`, `origin`, `extent`, `vmin`.
- **Return Value:** `AxesImage`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
import numpy as np
fig, ax = plt.subplots()
ax.imshow(np.array([[1, 2], [3, 4]]), cmap="viridis")
fig.savefig("imshow_example.png")
```

- **Expected Output:** A 2x2 heatmap image.
- **Performance Notes:** Large arrays can be memory-heavy; interpolation choices affect render time and output appearance.
- **Common Mistakes:** Forgetting axis labels for matrix data; using the wrong origin; misreading aspect ratio; applying smoothing unintentionally; confusing image display with aggregation.
- **Gotchas:** `origin` changes orientation; `aspect` can distort cells; interpolation affects appearance; color scaling may need explicit `vmin`/`vmax`; axis coordinates may not match array indices.
- **Related APIs:** `matshow`, `pcolormesh`, `colorbar`, `hexbin`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.imshow.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.imshow.html)


### 12. `matplotlib.pyplot.matshow`

- **Category:** Images / matrices
- **Module:** `pyplot`
- **Signature:** `matshow(Z, fignum=None, **kwargs)`
- **Purpose:** Display a matrix with matrix-friendly defaults.
- **Mental Trigger:** I need a quick matrix visualization.
- **When To Use:** 1) Correlation matrices. 2) Confusion matrices. 3) Small numeric grids. 4) Quick inspection of 2D arrays. 5) Debugging matrix structure.
- **Avoid When:** 1) You need customized image behavior. 2) You need complex subplot integration. 3) You need dense production heatmaps with tailored axes. 4) You need non-matrix image semantics. 5) You want full control over `imshow` settings.
- **Parameters:** `Z`, `fignum`, `**kwargs`.
- **Return Value:** `AxesImage`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
import numpy as np
fig = plt.figure()
plt.matshow(np.array([[1, 0], [0, 1]]), fignum=fig.number)
fig.savefig("matshow_example.png")
```

- **Expected Output:** A simple matrix plot.
- **Performance Notes:** Thin convenience wrapper; behavior follows the underlying image machinery.
- **Common Mistakes:** Treating it as a general-purpose heatmap API; losing subplot control; forgetting it creates/uses a figure context; relying on defaults when labels matter; misreading orientation.
- **Gotchas:** `matshow` is convenience-oriented; matrix aspect defaults differ from some image use cases; figure activation behavior can surprise users; it is less flexible than `imshow`; axis ticks may need explicit formatting.
- **Related APIs:** `imshow`, `pcolormesh`, `colorbar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.matshow.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.matshow.html)


### 13. `matplotlib.pyplot.pcolormesh`

- **Category:** Images / grids
- **Module:** `pyplot`
- **Signature:** `pcolormesh(*args, alpha=None, norm=None, cmap=None, vmin=None, vmax=None, shading=None, antialiased=False, data=None, **kwargs)`
- **Purpose:** Draw a quadrilateral mesh colored by values.
- **Mental Trigger:** I need a grid heatmap with cell geometry.
- **When To Use:** 1) Gridded scalar fields. 2) Uneven cell boundaries. 3) Heatmaps with custom geometry. 4) Scientific contour-style backgrounds. 5) Large structured grids.
- **Avoid When:** 1) You want simple matrix display without geometry. 2) You need a basic table-like heatmap. 3) Your data are not grid-based. 4) You need point markers. 5) You want an annotation-heavy confusion matrix with cell text.
- **Parameters:** `alpha`, `norm`, `cmap`, `vmin`, `vmax`, `shading`, `antialiased`.
- **Return Value:** `QuadMesh`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
import numpy as np
fig, ax = plt.subplots()
ax.pcolormesh(np.array([[1, 2], [3, 4]]), cmap="viridis", shading="auto")
fig.savefig("pcolormesh_example.png")
```

- **Expected Output:** A colored grid mesh.
- **Performance Notes:** Often better than many separate patches for large grids.
- **Common Mistakes:** Using incompatible array shapes; misunderstanding shading; confusing mesh boundaries; omitting color scaling control; choosing the wrong API for matrix-like data.
- **Gotchas:** `shading` changes cell interpretation; coordinate arrays affect geometry; `QuadMesh` differs from image semantics; grid edges may matter; color normalization can dominate interpretation.
- **Related APIs:** `imshow`, `contourf`, `colorbar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pcolormesh.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pcolormesh.html)


### 14. `matplotlib.pyplot.contour`

- **Category:** Contours
- **Module:** `pyplot`
- **Signature:** `contour(*args, **kwargs)`
- **Purpose:** Draw contour lines of a 2D scalar field.
- **Mental Trigger:** I need level curves.
- **When To Use:** 1) Scientific scalar fields. 2) Surface level visualization. 3) Field analysis. 4) Overlaying isolines on images. 5) Comparing thresholds.
- **Avoid When:** 1) You need filled regions only. 2) The field is too noisy for contours. 3) You need exact raw values. 4) A simple heatmap is enough. 5) The grid is too sparse for meaningful levels.
- **Parameters:** `*args`, `levels`, `colors`, `cmap`, `norm`, `alpha`, `linewidths`.
- **Return Value:** `ContourSet`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(-2, 2, 20)
y = np.linspace(-2, 2, 20)
X, Y = np.meshgrid(x, y)
Z = X**2 + Y**2
fig, ax = plt.subplots()
ax.contour(X, Y, Z, levels=5)
fig.savefig("contour_example.png")
```

- **Expected Output:** Several contour lines.
- **Performance Notes:** Dense grids and many levels increase cost; contouring is heavier than image display.
- **Common Mistakes:** Passing unsorted or malformed grids; using too many levels; choosing contours for noisy data; forgetting axis scaling; confusing contour lines with filled areas.
- **Gotchas:** Level choice strongly affects readability; contours depend on interpolation across the grid; labels may be needed for interpretation; axes aspect can matter; `ContourSet` contains multiple artists.
- **Related APIs:** `contourf`, `clabel`, `imshow`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.contour.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.contour.html)


### 15. `matplotlib.pyplot.contourf`

- **Category:** Filled contours
- **Module:** `pyplot`
- **Signature:** `contourf(*args, **kwargs)`
- **Purpose:** Draw filled contour regions.
- **Mental Trigger:** I need area-filled level visualization.
- **When To Use:** 1) Scalar field shading. 2) Smooth heat-style contours. 3) Region-based level plots. 4) Scientific visualizations. 5) Background fields for overlays.
- **Avoid When:** 1) You need exact line levels only. 2) The field is too sparse. 3) The viewer needs matrix cell boundaries. 4) You want a simple heatmap. 5) The color bands would obscure structure.
- **Parameters:** `*args`, `levels`, `cmap`, `colors`, `alpha`, `extend`, `norm`.
- **Return Value:** `QuadContourSet`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(-2, 2, 20)
y = np.linspace(-2, 2, 20)
X, Y = np.meshgrid(x, y)
Z = np.sin(X**2 + Y**2)
fig, ax = plt.subplots()
ax.contourf(X, Y, Z, levels=10, cmap="viridis")
fig.savefig("contourf_example.png")
```

- **Expected Output:** A filled contour plot.
- **Performance Notes:** Heavier than `imshow` for dense grids; many levels increase rendering cost.
- **Common Mistakes:** Choosing too many bands; using low-contrast colormaps; forgetting a colorbar; masking structure with opacity; using it where matrix display is better.
- **Gotchas:** Filled contours interpolate between level boundaries; level spacing matters; `extend` controls out-of-range treatment; colorbar semantics depend on levels; contour fill can hide detail.
- **Related APIs:** `contour`, `imshow`, `colorbar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.contourf.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.contourf.html)


### 16. `matplotlib.pyplot.colorbar`

- **Category:** Color mapping
- **Module:** `pyplot`
- **Signature:** `colorbar(mappable=None, cax=None, ax=None, **kwargs)`
- **Purpose:** Add a color scale legend for a mappable artist.
- **Mental Trigger:** I need to explain color encoding.
- **When To Use:** 1) Heatmaps. 2) Scatter plots with numeric color. 3) Image plots. 4) Contour plots. 5) Any continuous color mapping.
- **Avoid When:** 1) Color is categorical and a legend is clearer. 2) No mappable exists. 3) The color meaning is already obvious and redundant. 4) The figure is too cramped. 5) You need a discrete key instead.
- **Parameters:** `mappable`, `cax`, `ax`, `**kwargs`.
- **Return Value:** `Colorbar`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
import numpy as np
fig, ax = plt.subplots()
im = ax.imshow(np.array([[1, 2], [3, 4]]), cmap="viridis")
fig.colorbar(im, ax=ax)
fig.savefig("colorbar_example.png")
```

- **Expected Output:** A heatmap with a matching colorbar.
- **Performance Notes:** Minimal overhead relative to the underlying plot.
- **Common Mistakes:** Adding a colorbar to categorical colors; attaching it to the wrong axis; omitting it for continuous encodings; mis-scaling data; crowding the layout.
- **Gotchas:** The colorbar must match a mappable; colorbar layout can affect figure size; shared colorbars need careful axis association; normalization controls the legend scale; multiple plots may need one shared scale.
- **Related APIs:** `imshow`, `scatter`, `contourf`, `Normalize`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.colorbar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.colorbar.html)


### 17. `matplotlib.pyplot.legend`

- **Category:** Legends
- **Module:** `pyplot`
- **Signature:** `legend(*args, **kwargs)`
- **Purpose:** Add a legend describing plotted artists.
- **Mental Trigger:** I need to identify plotted series.
- **When To Use:** 1) Multi-series charts. 2) Categorical color encodings. 3) Publication figures. 4) Interactive exploratory plots. 5) Annotated comparisons.
- **Avoid When:** 1) Labels are already directly on marks. 2) The figure becomes cluttered. 3) Series are too numerous to distinguish. 4) A colorbar is more appropriate. 5) The legend would obscure data.
- **Parameters:** `*args`, `loc`, `bbox_to_anchor`, `ncol`, `frameon`, `title`, `fontsize`, `handles`.
- **Return Value:** `Legend`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3], label="trend")
ax.legend()
fig.savefig("legend_example.png")
```

- **Expected Output:** A line plot with a legend.
- **Performance Notes:** Usually cheap, but large legends can slow layout and increase visual clutter.
- **Common Mistakes:** Forgetting labels; using a legend where direct labels are better; placing it over data; overstuffing it with many entries; mismatching handles and labels.
- **Gotchas:** Legend order follows artists or explicit handles; location affects layout; some artists need proxy handles; legends can be outside axes; styling may differ by backend.
- **Related APIs:** `Axes.legend`, `colorbar`, `annotate`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.legend.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.legend.html)


### 18. `matplotlib.pyplot.title`

- **Category:** Text
- **Module:** `pyplot`
- **Signature:** `title(label, fontdict=None, loc=None, pad=None, *, y=None, **kwargs)`
- **Purpose:** Set the axes title.
- **Mental Trigger:** I need a chart headline.
- **When To Use:** 1) Report figures. 2) Notebook exploration. 3) Panel labeling. 4) Exported charts. 5) Presentation visuals.
- **Avoid When:** 1) The title is too long. 2) The title duplicates the file name or surrounding context. 3) The figure already uses a figure-level title. 4) The panel needs a subtitle instead. 5) You need structured annotation inside the plot area.
- **Parameters:** `label`, `fontdict`, `loc`, `pad`, `y`.
- **Return Value:** `Text`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2], [1, 4])
ax.set_title("Example Title")
fig.savefig("title_example.png")
```

- **Expected Output:** A chart with a title.
- **Performance Notes:** Negligible cost.
- **Common Mistakes:** Overlong titles; duplicating axis labels; placing titles too close to the plot; mixing figure and axes titles unintentionally; using inconsistent capitalization.
- **Gotchas:** Title position interacts with layout; long titles may be clipped; `loc` changes alignment; `pad` affects spacing; figure-level and axes-level titles are different.
- **Related APIs:** `suptitle`, `xlabel`, `ylabel`, `text`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.title.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.title.html)


### 19. `matplotlib.pyplot.xlabel`

- **Category:** Text
- **Module:** `pyplot`
- **Signature:** `xlabel(xlabel, fontdict=None, labelpad=None, *, loc=None, **kwargs)`
- **Purpose:** Set the x-axis label.
- **Mental Trigger:** I need to name the horizontal axis.
- **When To Use:** 1) Every non-trivial chart. 2) Units labeling. 3) Time axis descriptions. 4) Feature names. 5) Publication figures.
- **Avoid When:** 1) The axis is intentionally unlabeled for a composite figure. 2) The label would duplicate surrounding annotation. 3) The plot is a pure diagram. 4) The axis is shared and already labeled elsewhere. 5) The label would crowd the figure.
- **Parameters:** `xlabel`, `fontdict`, `labelpad`, `loc`.
- **Return Value:** `Text`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2], [1, 4])
ax.set_xlabel("Time")
fig.savefig("xlabel_example.png")
```

- **Expected Output:** A chart with an x-axis label.
- **Performance Notes:** Negligible cost.
- **Common Mistakes:** Missing units; inconsistent label naming; putting labels on shared axes redundantly; mismatched language/style; using overly long labels.
- **Gotchas:** `labelpad` changes spacing; label placement can be controlled; shared axes often need one visible label only; formatting can differ by backend; long labels can trigger layout adjustments.
- **Related APIs:** `ylabel`, `set_xlabel`, `xlabel`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.xlabel.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.xlabel.html)


### 20. `matplotlib.pyplot.ylabel`

- **Category:** Text
- **Module:** `pyplot`
- **Signature:** `ylabel(ylabel, fontdict=None, labelpad=None, *, loc=None, **kwargs)`
- **Purpose:** Set the y-axis label.
- **Mental Trigger:** I need to name the vertical axis.
- **When To Use:** 1) Every non-trivial chart. 2) Units labeling. 3) Outcome metrics. 4) Time-varying response variables. 5) Publication figures.
- **Avoid When:** 1) The label is redundant. 2) The figure is a diagram with no axis semantics. 3) Shared subplots already communicate it. 4) The chart is too narrow for a rotated label. 5) A figure caption is enough.
- **Parameters:** `ylabel`, `fontdict`, `labelpad`, `loc`.
- **Return Value:** `Text`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2], [1, 4])
ax.set_ylabel("Value")
fig.savefig("ylabel_example.png")
```

- **Expected Output:** A chart with a y-axis label.
- **Performance Notes:** Negligible cost.
- **Common Mistakes:** Wrong units; duplicating labels across shared axes; using vertical space poorly; inconsistent label capitalization; omitting labels in final exports.
- **Gotchas:** Label rotation and spacing matter; shared-axis figures may need selective labeling; long labels can conflict with layout; `loc` changes placement; label pad can affect exported geometry.
- **Related APIs:** `xlabel`, `set_ylabel`, `ylabel`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ylabel.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ylabel.html)


### 21. `matplotlib.pyplot.text`

- **Category:** Text / annotation
- **Module:** `pyplot`
- **Signature:** `text(x, y, s, fontdict=None, **kwargs)`
- **Purpose:** Place text at data coordinates.
- **Mental Trigger:** I need to label a specific point or region.
- **When To Use:** 1) Point labels. 2) Inline notes. 3) Metric callouts. 4) Figure annotations. 5) Contextual labels in charts.
- **Avoid When:** 1) The plot would become cluttered. 2) You need arrows or callout geometry. 3) You need axis labels instead. 4) You need many repeated labels. 5) The annotation belongs in the caption.
- **Parameters:** `x`, `y`, `s`, `fontdict`.
- **Return Value:** `Text`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.text(2, 4, "peak")
fig.savefig("text_example.png")
```

- **Expected Output:** A chart with an inline text label.
- **Performance Notes:** Many text objects can slow rendering and make the figure unreadable.
- **Common Mistakes:** Using the wrong coordinate system; overcrowding the plot; making text too small; forgetting contrast; placing text outside view limits.
- **Gotchas:** Coordinates are data-based by default; text can be clipped; transforms may be needed for axes-relative placement; rotation and alignment matter; text can influence layout.
- **Related APIs:** `annotate`, `title`, `xlabel`, `ylabel`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.text.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.text.html)


### 22. `matplotlib.pyplot.annotate`

- **Category:** Annotation
- **Module:** `pyplot`
- **Signature:** `annotate(text, xy, xytext=None, xycoords='data', textcoords=None, arrowprops=None, annotation_clip=None, **kwargs)`
- **Purpose:** Add text with optional arrows and coordinate control.
- **Mental Trigger:** I need a callout tied to a target point.
- **When To Use:** 1) Highlight outliers. 2) Explain peaks. 3) Mark events. 4) Add directional context. 5) Create labeled callouts.
- **Avoid When:** 1) Simple text is enough. 2) Many arrows would clutter the chart. 3) The note belongs outside the plot. 4) You need a legend instead. 5) The target is ambiguous.
- **Parameters:** `text`, `xy`, `xytext`, `xycoords`, `textcoords`, `arrowprops`, `annotation_clip`.
- **Return Value:** `Annotation`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.annotate("max", xy=(2, 4), xytext=(2.2, 4.2), arrowprops=dict(arrowstyle="->"))
fig.savefig("annotate_example.png")
```

- **Expected Output:** A labeled point with an arrow.
- **Performance Notes:** A few annotations are inexpensive; many arrows and texts add clutter and draw cost.
- **Common Mistakes:** Wrong coordinate system; arrow overlaps; label placement too close to marks; unreadable text; excessive annotations.
- **Gotchas:** `xycoords` and `textcoords` can differ; arrows require careful offset tuning; annotations can be clipped by bounds; placement may need transforms; `annotation_clip` changes visibility rules.
- **Related APIs:** `text`, `arrow`, `axes.annotate`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.annotate.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.annotate.html)


### 23. `matplotlib.pyplot.grid`

- **Category:** Grid
- **Module:** `pyplot`
- **Signature:** `grid(visible=None, which='major', axis='both', **kwargs)`
- **Purpose:** Toggle grid lines.
- **Mental Trigger:** I need reference lines for reading values.
- **When To Use:** 1) Quantitative comparison. 2) Dense axis reading. 3) Reporting figures. 4) Time series plots. 5) Scientific charts.
- **Avoid When:** 1) Grid lines distract from marks. 2) The chart is already busy. 3) The figure is decorative. 4) You need minimal visual noise. 5) Grid lines compete with annotations.
- **Parameters:** `visible`, `which`, `axis`.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.grid(True)
fig.savefig("grid_example.png")
```

- **Expected Output:** A line plot with grid lines.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Overusing major and minor grids together; making the grid too prominent; enabling grids on every plot without need; confusing axis and figure grid; relying on grids instead of labels.
- **Gotchas:** Grid styling can differ by axis and backend; minor grid lines require minor ticks; grid visibility may be overridden by style sheets; `axis` can limit which direction is affected; grid can affect perceived density.
- **Related APIs:** `tick_params`, `minorticks_on`, `rcParams`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.grid.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.grid.html)


### 24. `matplotlib.pyplot.xticks`

- **Category:** Tick management
- **Module:** `pyplot`
- **Signature:** `xticks(ticks=None, labels=None, *, minor=False, **kwargs)`
- **Purpose:** Get or set x-ticks and labels.
- **Mental Trigger:** I need custom x-axis tick labels.
- **When To Use:** 1) Categorical labels. 2) Date formatting overrides. 3) Sparse tick display. 4) Rotated labels. 5) Manual axis clarity.
- **Avoid When:** 1) Auto ticks are good enough. 2) The tick count is very large. 3) You are formatting date axes better via locators/formatters. 4) Labeling every point would clutter the plot. 5) You need reusable axis logic.
- **Parameters:** `ticks`, `labels`, `minor`.
- **Return Value:** Tick positions or labels when used as a getter; otherwise `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.set_xticks([1, 2, 3], ["one", "two", "three"])
fig.savefig("xticks_example.png")
```

- **Expected Output:** A plot with custom x tick labels.
- **Performance Notes:** Many custom ticks increase layout work.
- **Common Mistakes:** Overcrowding ticks; using raw `xticks` instead of axis methods in OO code; mislabeling positions; rotating labels inconsistently; using it for large numeric axes.
- **Gotchas:** Tick positions and labels must match; manual ticks override auto behavior; minor ticks are separate; large label sets can clip; date axes are often better handled via dedicated locators.
- **Related APIs:** `yticks`, `ticker`, `tick_params`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.xticks.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.xticks.html)


### 25. `matplotlib.pyplot.yticks`

- **Category:** Tick management
- **Module:** `pyplot`
- **Signature:** `yticks(ticks=None, labels=None, *, minor=False, **kwargs)`
- **Purpose:** Get or set y-ticks and labels.
- **Mental Trigger:** I need custom y-axis tick labels.
- **When To Use:** 1) Manual scale annotation. 2) Categorical y-axis labels. 3) Sparse tick display. 4) Horizontal bar charts. 5) Readability tuning.
- **Avoid When:** 1) Default ticks already communicate the scale well. 2) The plot is dense. 3) You need formatters for reusable logic. 4) You want automatic tick placement. 5) Label spacing is already tight.
- **Parameters:** `ticks`, `labels`, `minor`.
- **Return Value:** Tick positions or labels when used as a getter; otherwise `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.set_yticks([1, 2, 4], ["low", "mid", "high"])
fig.savefig("yticks_example.png")
```

- **Expected Output:** A plot with custom y tick labels.
- **Performance Notes:** Many labeled ticks can slow layout and reduce legibility.
- **Common Mistakes:** Misaligned ticks and labels; using too many custom labels; rotating labels badly; overriding useful autoscaling; forgetting minor-vs-major distinction.
- **Gotchas:** Label positions must match tick values; formatter-based approaches are often cleaner for reusable code; axes limits can hide ticks; manual ticks can conflict with autoscaling; dense labels can overlap.
- **Related APIs:** `xticks`, `tick_params`, `ticker`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.yticks.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.yticks.html)


### 26. `matplotlib.pyplot.xlim`

- **Category:** Axis limits
- **Module:** `pyplot`
- **Signature:** `xlim(left=None, right=None, *, emit=True, auto=False, xmin=None, xmax=None)`
- **Purpose:** Get or set x-axis limits.
- **Mental Trigger:** I need to frame the horizontal range explicitly.
- **When To Use:** 1) Zooming into a region. 2) Standardizing comparisons. 3) Excluding outliers visually. 4) Aligning subplot ranges. 5) Fixing axis bounds for exports.
- **Avoid When:** 1) Autoscaling is sufficient. 2) You might hide important data unintentionally. 3) You need data-driven bounds with uncertainty. 4) Axis clipping would mislead. 5) You are not sure of the intended viewing window.
- **Parameters:** `left`, `right`, `emit`, `auto`, `xmin`, `xmax`.
- **Return Value:** Current `(left, right)` or `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.set_xlim(1, 3)
fig.savefig("xlim_example.png")
```

- **Expected Output:** A plot with a constrained x-range.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Hiding data; setting inverted limits accidentally; using limits instead of data filtering; inconsistent limits across comparisons; forgetting that the visible window affects perception.
- **Gotchas:** Limits can invert axes when reversed; autoscale behavior can override manual assumptions; hidden data still exist; axis limits affect tick generation; shared axes propagate changes.
- **Related APIs:** `ylim`, `axis`, `autoscale`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.xlim.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.xlim.html)


### 27. `matplotlib.pyplot.ylim`

- **Category:** Axis limits
- **Module:** `pyplot`
- **Signature:** `ylim(bottom=None, top=None, *, emit=True, auto=False, ymin=None, ymax=None)`
- **Purpose:** Get or set y-axis limits.
- **Mental Trigger:** I need to frame the vertical range explicitly.
- **When To Use:** 1) Zooming into value ranges. 2) Standardizing comparisons. 3) Fixing plot height scale. 4) Sharing ranges across subplots. 5) Export consistency.
- **Avoid When:** 1) Autoscaling is enough. 2) You may clip outliers accidentally. 3) You need honest full-range displays. 4) Limits would distort the visual message. 5) You are not sure what should be visible.
- **Parameters:** `bottom`, `top`, `emit`, `auto`, `ymin`, `ymax`.
- **Return Value:** Current `(bottom, top)` or `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.set_ylim(0, 5)
fig.savefig("ylim_example.png")
```

- **Expected Output:** A plot with a constrained y-range.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Hiding important values; using tight limits that mislead; inconsistent scaling between panels; reversing axis direction unintentionally; expecting autoscale after manual limits without resetting.
- **Gotchas:** Reversed limits are allowed; shared axes affect all linked plots; clipping is visual, not data removal; tick density changes with bounds; manual bounds can be overridden by later plotting calls.
- **Related APIs:** `xlim`, `axis`, `autoscale`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ylim.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ylim.html)


### 28. `matplotlib.pyplot.axis`

- **Category:** Axis management
- **Module:** `pyplot`
- **Signature:** `axis(arg=None, /, *, emit=True, strict=False, xmin=None, xmax=None, ymin=None, ymax=None)`
- **Purpose:** Configure axis limits and aspect-related display behavior.
- **Mental Trigger:** I need compact control over axis framing.
- **When To Use:** 1) Quick equal/aspect adjustments. 2) Turning axes on or off. 3) Setting bounds in one call. 4) Simple plot framing. 5) Utility scripts.
- **Avoid When:** 1) You need clear, explicit OO code. 2) You want precise per-axis control. 3) You are building a reusable library API. 4) You need complex aspect/layout logic. 5) You need readability over brevity.
- **Parameters:** `arg`, `emit`, `strict`, `xmin`, `xmax`, `ymin`, `ymax`.
- **Return Value:** Current axis limits or status.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.axis("tight")
fig.savefig("axis_example.png")
```

- **Expected Output:** A plot with automatically tightened framing.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Using it when `set_xlim`/`set_ylim` is clearer; accidentally turning axes off; overusing string modes; confusing aspect with limits; relying on implicit side effects.
- **Gotchas:** String modes change multiple settings; axis status can hide frame elements; `strict` affects validation; it is easier to misuse than dedicated methods; behavior may vary by context.
- **Related APIs:** `set_xlim`, `set_ylim`, `set_aspect`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axis.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axis.html)


### 29. `matplotlib.pyplot.tight_layout`

- **Category:** Layout
- **Module:** `pyplot`
- **Signature:** `tight_layout(pad=1.08, h_pad=None, w_pad=None, rect=None)`
- **Purpose:** Adjust subplot spacing automatically.
- **Mental Trigger:** I need to reduce label overlap.
- **When To Use:** 1) Exported reports. 2) Subplots with titles and labels. 3) Notebook figures that overlap. 4) Quick spacing correction. 5) Legacy layout cleanup.
- **Avoid When:** 1) You already use a more explicit layout system. 2) Complex nested layouts need careful control. 3) You need deterministic manual spacing. 4) Tight layout interferes with design. 5) The figure uses many decorative artists.
- **Parameters:** `pad`, `h_pad`, `w_pad`, `rect`.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, axs = plt.subplots(2, 1)
axs[^0].set_title("Top")
axs[^1].set_xlabel("X")
fig.tight_layout()
fig.savefig("tight_layout_example.png")
```

- **Expected Output:** A less crowded two-panel figure.
- **Performance Notes:** Layout solving adds cost; generally small but noticeable for many axes.
- **Common Mistakes:** Calling it too early; assuming it solves every overlap; using it with incompatible complex layouts; forgetting to call before saving; mixing it with other layout engines without understanding interactions.
- **Gotchas:** It may adjust text positions; some artists are not considered; results can change after adding labels later; it can conflict with manual spacing; figure size affects the final result.
- **Related APIs:** `constrained_layout`, `subplots_adjust`, `savefig`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.tight_layout.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.tight_layout.html)


### 30. `matplotlib.pyplot.subplots_adjust`

- **Category:** Layout
- **Module:** `pyplot`
- **Signature:** `subplots_adjust(left=None, bottom=None, right=None, top=None, wspace=None, hspace=None)`
- **Purpose:** Manually tune subplot spacing.
- **Mental Trigger:** I need explicit control over margins and gaps.
- **When To Use:** 1) Fine-tuning dense reports. 2) Legacy scripts. 3) Manual spacing workflows. 4) Keeping control over label room. 5) Figure templates.
- **Avoid When:** 1) Automatic layout is sufficient. 2) You want minimal maintenance burden. 3) The figure structure changes frequently. 4) You need a fully declarative layout system. 5) You are already using another layout manager.
- **Parameters:** `left`, `bottom`, `right`, `top`, `wspace`, `hspace`.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, axs = plt.subplots(2, 2)
fig.subplots_adjust(wspace=0.4, hspace=0.4)
fig.savefig("subplots_adjust_example.png")
```

- **Expected Output:** A grid with larger gaps.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Overcompressing the layout; conflicting with automatic layout engines; using it blindly; not accounting for label lengths; hardcoding spacing across varying figure sizes.
- **Gotchas:** Margins are figure-relative; it affects all subplots; it is easy to overfit one output size; layout changes can alter export appearance; best used sparingly in production templates.
- **Related APIs:** `tight_layout`, `constrained_layout`, `figure.subplotpars`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots_adjust.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots_adjust.html)


### 31. `matplotlib.pyplot.savefig`

- **Category:** Saving figures
- **Module:** `pyplot`
- **Signature:** `savefig(fname, *, transparent=None, dpi='figure', format=None, metadata=None, bbox_inches=None, pad_inches=0.1, facecolor='auto', edgecolor='auto', backend=None, **kwargs)`
- **Purpose:** Save the current figure to a file.
- **Mental Trigger:** I need export output.
- **When To Use:** 1) Reports. 2) Publication figures. 3) Batch generation. 4) Dashboards with file artifacts. 5) Archival outputs.
- **Avoid When:** 1) You have not finalized the figure. 2) The current figure may not be the intended one. 3) You need a specific figure object and can call `fig.savefig` directly. 4) You are relying on display-only checks. 5) You need reproducible file settings but have not specified them.
- **Parameters:** `fname`, `transparent`, `dpi`, `format`, `metadata`, `bbox_inches`, `pad_inches`, `facecolor`.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
fig.savefig("savefig_example.png", dpi=150, bbox_inches="tight")
```

- **Expected Output:** An image file saved to disk.
- **Performance Notes:** Export cost depends on figure complexity, dpi, and output format.
- **Common Mistakes:** Saving the wrong figure; forgetting `bbox_inches="tight"` when labels clip; using low dpi for print; not specifying format when filename is ambiguous; exporting before layout is finalized.
- **Gotchas:** Vector and raster outputs behave differently; transparency can vary by backend; metadata support depends on format; `dpi='figure'` uses figure settings; save-time layout can differ from display-time layout.
- **Related APIs:** `Figure.savefig`, `tight_layout`, `subplots_adjust`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html)


### 32. `matplotlib.pyplot.show`

- **Category:** Display / interactive utilities
- **Module:** `pyplot`
- **Signature:** `show(*, block=None)`
- **Purpose:** Display all open figures.
- **Mental Trigger:** I need to render plots to an interactive frontend.
- **When To Use:** 1) Local scripts with a GUI backend. 2) Interactive notebooks when needed. 3) Desktop exploration. 4) Manual visual checks. 5) Demo sessions.
- **Avoid When:** 1) Headless batch jobs. 2) You only need to save files. 3) Library code should not force display. 4) Notebook environments already auto-display. 5) You need deterministic noninteractive export.
- **Parameters:** `block`.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [1, 4, 2])
plt.show()
```

- **Expected Output:** The figure appears in the active UI or notebook output.
- **Performance Notes:** Display latency depends on backend and environment.
- **Common Mistakes:** Calling it in headless environments; using it instead of `savefig`; expecting it to return image data; forcing blocking behavior in scripts; relying on it in automated pipelines.
- **Gotchas:** Behavior depends on backend; notebook auto-display can make it redundant; blocking semantics vary; it does not replace saving; interactive backends may differ in closing behavior.
- **Related APIs:** `savefig`, `pause`, backend selection.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.show.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.show.html)


### 33. `matplotlib.pyplot.close`

- **Category:** Resource management
- **Module:** `pyplot`
- **Signature:** `close(fig=None)`
- **Purpose:** Close a figure and release resources.
- **Mental Trigger:** I need to clean up figures in a batch process.
- **When To Use:** 1) Loop-based figure generation. 2) Memory-sensitive scripts. 3) Server-side rendering. 4) Notebook cleanup. 5) Long-running jobs.
- **Avoid When:** 1) The figure is still needed. 2) You are unsure which figure is active. 3) You depend on later inspection. 4) The script is short and single-use. 5) You are closing figures unintentionally.
- **Parameters:** `fig`.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2], [1, 4])
fig.savefig("close_example.png")
plt.close(fig)
```

- **Expected Output:** Figure saved, then released from memory.
- **Performance Notes:** Important for preventing memory growth in batch rendering.
- **Common Mistakes:** Forgetting to close in loops; closing the wrong figure; closing before save; assuming garbage collection is enough; leaving interactive figures open.
- **Gotchas:** `fig=None` closes the current figure; closing does not delete saved files; open figures accumulate memory; active figure tracking can surprise users; batch jobs should be explicit.
- **Related APIs:** `figure`, `savefig`, `clf`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.close.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.close.html)


### 34. `matplotlib.pyplot.clf`

- **Category:** Resource management
- **Module:** `pyplot`
- **Signature:** `clf()`
- **Purpose:** Clear the current figure.
- **Mental Trigger:** I need to reuse a figure canvas.
- **When To Use:** 1) Reusing a single figure object. 2) Batch updates. 3) Interactive experiments. 4) Resetting plotting state. 5) Cleanup without closing the window.
- **Avoid When:** 1) You want a fresh object. 2) You are working with multiple figures. 3) You need explicit control over axes lifecycle. 4) You might accidentally erase needed content. 5) Library code should avoid global state.
- **Parameters:** None.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
plt.figure()
plt.plot([1, 2], [1, 4])
plt.clf()
plt.plot([1, 2], [4, 1])
plt.savefig("clf_example.png")
```

- **Expected Output:** A cleared and redrawn figure.
- **Performance Notes:** Useful when reusing the same canvas, though object recreation may still be clearer.
- **Common Mistakes:** Clearing too early; confusing clear with close; using it when new figures are better; losing axes references; relying on hidden state after clearing.
- **Gotchas:** It clears the current figure only; axes references become stale; it may not reset backend windows; stateful code becomes fragile; explicit OO patterns are safer.
- **Related APIs:** `close`, `figure`, `cla`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.clf.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.clf.html)


### 35. `matplotlib.pyplot.cla`

- **Category:** Resource management
- **Module:** `pyplot`
- **Signature:** `cla()`
- **Purpose:** Clear the current axes.
- **Mental Trigger:** I need to reuse one subplot.
- **When To Use:** 1) Updating a single axis. 2) Interactive plotting. 3) Repainting charts. 4) Animation-like manual updates. 5) Stateful exploration.
- **Avoid When:** 1) You need a new axes object. 2) The figure has multiple important axes. 3) You want clear code structure. 4) You are already using a fresh `subplots` call. 5) You may accidentally erase annotations or legends.
- **Parameters:** None.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2], [1, 4])
ax.cla()
ax.plot([1, 2], [4, 1])
fig.savefig("cla_example.png")
```

- **Expected Output:** The axis is cleared and redrawn.
- **Performance Notes:** Efficient for axis reuse but can complicate state management.
- **Common Mistakes:** Clearing the wrong axis; forgetting that limits and labels reset; retaining stale references; using it in place of new axes when clarity matters; losing legends unexpectedly.
- **Gotchas:** Current axes context matters; clearing removes artists and axis settings; references to old artists become invalid for display purposes; reusable dashboards may prefer explicit redraw logic; stateful behavior can be surprising.
- **Related APIs:** `clf`, `close`, `Axes.clear`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.cla.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.cla.html)


### 36. `matplotlib.pyplot.style.use`

- **Category:** Styles / themes
- **Module:** `style`
- **Signature:** `use(style)`
- **Purpose:** Apply a style sheet globally.
- **Mental Trigger:** I need a consistent visual theme.
- **When To Use:** 1) Team standards. 2) Brand-aligned figures. 3) Notebook theming. 4) Reproducible styling. 5) Batch report generation.
- **Avoid When:** 1) You only need local temporary styling. 2) You want a very small targeted override. 3) Global state should remain untouched. 4) Multiple unrelated visual themes share a process. 5) You are composing figures from independent libraries.
- **Parameters:** `style`.
- **Return Value:** `None`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
plt.style.use("default")
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
fig.savefig("style_use_example.png")
```

- **Expected Output:** A chart rendered under the selected style.
- **Performance Notes:** Negligible at runtime; important for consistency rather than speed.
- **Common Mistakes:** Applying styles too late; mixing many style overrides; depending on environment defaults; assuming style sheets are portable across versions; not locking theme settings for reports.
- **Gotchas:** Styles change `rcParams`; they affect subsequent figures; context managers may be safer for local overrides; some styles are version-sensitive; global styling can leak across plots.
- **Related APIs:** `rcParams`, `style.context`, `savefig`.
- **Official API URL:** [https://matplotlib.org/stable/api/style_api.html](https://matplotlib.org/stable/api/style_api.html)


### 37. `matplotlib.pyplot.rcParams`

- **Category:** Styles / configuration
- **Module:** `matplotlib`
- **Signature:** Mapping-like configuration object
- **Purpose:** Store and modify runtime defaults.
- **Mental Trigger:** I need project-wide plotting defaults.
- **When To Use:** 1) Reproducible themes. 2) Notebook session configuration. 3) Publication defaults. 4) Global font and size tuning. 5) Consistent export settings.
- **Avoid When:** 1) You only need one-off changes. 2) Local styling should be isolated. 3) You are writing reusable library code that should avoid side effects. 4) You are unsure of downstream impact. 5) A context manager would be safer.
- **Parameters:** Not applicable as a function; use mapping keys.
- **Return Value:** Mutable configuration mapping.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
plt.rcParams["figure.dpi"] = 120
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
fig.savefig("rcparams_example.png")
```

- **Expected Output:** A plot rendered using the modified default.
- **Performance Notes:** No direct render cost; affects future figures globally.
- **Common Mistakes:** Mutating global defaults in shared notebooks; not resetting after experiments; changing style late; using it for local plot-specific settings; assuming configuration is isolated.
- **Gotchas:** Changes persist within the process; some keys affect layout unexpectedly; library code should minimize global mutation; environment defaults may differ; style sheets may override previous settings.
- **Related APIs:** `style.use`, `style.context`, `rc_context`.
- **Official API URL:** [https://matplotlib.org/stable/tutorials/introductory/customizing.html](https://matplotlib.org/stable/tutorials/introductory/customizing.html)


### 38. `matplotlib.pyplot.rc_context`

- **Category:** Styles / configuration
- **Module:** `matplotlib`
- **Signature:** `rc_context(rc=None, fname=None)`
- **Purpose:** Temporarily override rc parameters.
- **Mental Trigger:** I need scoped style changes.
- **When To Use:** 1) Local styling in reusable code. 2) Temporary export overrides. 3) Notebook experiments. 4) Tests that should not leak config. 5) Controlled theming blocks.
- **Avoid When:** 1) You need permanent settings. 2) You are already using style sheets globally. 3) The override should persist across many cells. 4) You want the simplest possible code and no style isolation is needed. 5) You need direct artist-level formatting.
- **Parameters:** `rc`, `fname`.
- **Return Value:** Context manager.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
with plt.rc_context({"figure.dpi": 100}):
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3], [1, 4, 2])
    fig.savefig("rc_context_example.png")
```

- **Expected Output:** A figure rendered with temporary settings.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Assuming it mutates global state permanently; nesting contexts carelessly; forgetting which settings were temporary; mixing with direct `rcParams` edits; using it for artist-specific styling.
- **Gotchas:** Configuration reverts after the context; it is ideal for tests and local overrides; file-based rc loading is supported; global changes made inside still affect the active process if not scoped carefully; context choice matters in notebooks.
- **Related APIs:** `rcParams`, `style.context`, `style.use`.
- **Official API URL:** [https://matplotlib.org/stable/api/matplotlib_configuration_api.html\#matplotlib.rc_context](https://matplotlib.org/stable/api/matplotlib_configuration_api.html#matplotlib.rc_context)


### 39. `matplotlib.pyplot.subplots` `sharex` / `sharey` behavior

- **Category:** Axis sharing
- **Module:** `axes`
- **Signature:** Included in `subplots`
- **Purpose:** Link axis scaling across panels.
- **Mental Trigger:** I need matched scales for fair comparison.
- **When To Use:** 1) Small multiples. 2) Faceted comparisons. 3) Time-series panels. 4) Comparative diagnostics. 5) Consistent zoom across panels.
- **Avoid When:** 1) Panels need independent scale interpretation. 2) Shared ticks create clutter. 3) Different units are plotted together. 4) You need per-panel labels everywhere. 5) Alignment matters less than flexibility.
- **Parameters:** `sharex`, `sharey`.
- **Return Value:** Same as `subplots`.
- **Runnable Example:**

```python
import matplotlib.pyplot as plt
fig, axs = plt.subplots(2, 1, sharex=True)
axs[^0].plot([1, 2, 3], [1, 2, 3])
axs[^1].plot([1, 2, 3], [3, 2, 1])
fig.savefig("sharexy_example.png")
```

- **Expected Output:** Two aligned panels with a shared x-axis.
- **Performance Notes:** Efficient; improves comparison readability.
- **Common Mistakes:** Sharing axes across incompatible scales; hiding labels unintentionally; assuming sharing copies data limits instead of linking them; combining with manual limit changes without care; overcrowding tick labels.
- **Gotchas:** Shared axes propagate limit changes; only outer labels may be shown; zooming one panel can affect others; sharing is a layout and interaction decision, not just a formatting one; mixed units are a poor fit.
- **Related APIs:** `subplots`, `twinx`, `twiny`, `set_xlim`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html)


### 40. `matplotlib.axes.Axes.plot`

- **Category:** Line plots
- **Module:** `axes`
- **Signature:** `plot(*args, scalex=True, scaley=True, data=None, **kwargs)`
- **Purpose:** Draw line series on a specific axes object.
- **Mental Trigger:** I need the object-oriented line API.
- **When To Use:** 1) Production code. 2) Multi-axis figures. 3) Library code. 4) Reusable components. 5) Explicit subplot targeting.
- **Avoid When:** 1) Simple one-off notebook sketches where `pyplot` is enough. 2) You do not have an axes reference. 3) You are mixing global and local styles carelessly. 4) You need only one quick plot. 5) You want stateful convenience over clarity.
- **Parameters:** Same as `plot`.
- **Return Value:** List of `Line2D`.
- **Runnable Example:** same as item 4, replacing `ax.plot`.
- **Expected Output:** Line chart on the given axes.
- **Performance Notes:** Equivalent to pyplot version; OO code scales better in maintainability.
- **Common Mistakes:** Using the wrong axes; forgetting the returned line list; mixing current axes with explicit axes; calling on stale axes; assuming `pyplot` and `Axes` methods are different rendering engines.
- **Gotchas:** The method and pyplot wrapper are functionally similar; return value is a list even for one line; styling works through kwargs; the current axes can diverge from your intended axes; explicit axes references reduce ambiguity.
- **Related APIs:** `plot`, `Axes.scatter`, `Axes.fill_between`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html)


### 41. `matplotlib.axes.Axes.scatter`

- **Category:** Scatter plots
- **Module:** `axes`
- **Signature:** `scatter(x, y, s=None, c=None, marker=None, cmap=None, norm=None, vmin=None, vmax=None, alpha=None, linewidths=None, *, edgecolors=None, plotnonfinite=False, data=None, **kwargs)`
- **Purpose:** Draw scatter points on a specific axes object.
- **Mental Trigger:** I need explicit axes targeting for a scatter plot.
- **When To Use:** 1) OO plotting. 2) Faceted dashboards. 3) Custom subplot arrangements. 4) Reusable rendering code. 5) Multiple axes in one figure.
- **Avoid When:** 1) You are doing quick one-off plotting with no axis reference. 2) You want lines instead of points. 3) Point clouds are too large and unprocessed. 4) You need a histogram or heatmap. 5) The plot semantics are not point-based.
- **Parameters:** Same as `scatter`.
- **Return Value:** `PathCollection`.
- **Runnable Example:** same as item 5, replacing `ax.scatter`.
- **Expected Output:** A scatter plot on the chosen axis.
- **Performance Notes:** Same as pyplot scatter.
- **Common Mistakes:** Using the wrong axes in multi-panel layouts; passing incompatible color arrays; overplotting; ignoring marker area semantics; forgetting to add a colorbar when using numeric colors.
- **Gotchas:** The OO API does not change the underlying scatter semantics; return object supports later updates; axis-specific colorbars require explicit attachment; layout and transform context matters; large collections can be rasterized if needed.
- **Related APIs:** `scatter`, `plot`, `hexbin`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html)


### 42. `matplotlib.axes.Axes.bar`

- **Category:** Bar charts
- **Module:** `axes`
- **Signature:** `bar(x, height, width=0.8, bottom=None, *, align='center', data=None, **kwargs)`
- **Purpose:** Draw bars on a specific axes object.
- **Mental Trigger:** I need OO bar plotting.
- **When To Use:** 1) Reusable chart components. 2) Multi-panel figures. 3) Explicit axis targeting. 4) Production plotting. 5) Report generation.
- **Avoid When:** 1) No axes reference is available. 2) The figure is simple enough for pyplot. 3) Continuous data are being shown. 4) The plot would contain too many categories. 5) A line chart is more appropriate.
- **Parameters:** Same as `bar`.
- **Return Value:** `BarContainer`.
- **Runnable Example:** same as item 7, replacing `ax.bar`.
- **Expected Output:** A bar chart on a chosen axes.
- **Performance Notes:** Same as pyplot bar.
- **Common Mistakes:** Wrong axis target; too many categories; using raw values instead of summaries; poor label ordering; unnecessary styling complexity.
- **Gotchas:** Container return can be used for labels; alignment matters; width units are data-axis units; bar plots in shared axes need careful spacing; stacked and grouped designs require explicit planning.
- **Related APIs:** `barh`, `bar_label`, `hist`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html)


### 43. `matplotlib.axes.Axes.hist`

- **Category:** Histograms
- **Module:** `axes`
- **Signature:** Same practical histogram signature as pyplot histogram
- **Purpose:** Draw histogram on an explicit axes.
- **Mental Trigger:** I need a histogram in OO style.
- **When To Use:** 1) Subplots. 2) Reusable plotting functions. 3) Object-oriented workflows. 4) Comparative panels. 5) Batch reporting.
- **Avoid When:** 1) No axes reference exists. 2) A count plot or summary plot is better. 3) The data are categorical. 4) You need too many bins. 5) You want exact data points.
- **Parameters:** Same as `hist`.
- **Return Value:** `(n, bins, patches)`.
- **Runnable Example:** same as item 6, replacing `ax.hist`.
- **Expected Output:** Histogram on the specified axes.
- **Performance Notes:** Same as pyplot hist.
- **Common Mistakes:** Same as pyplot hist, plus wrong target axis.
- **Gotchas:** Same as pyplot hist.
- **Related APIs:** `hist`, `stairs`, `bar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html)


### 44. `matplotlib.axes.Axes.imshow`

- **Category:** Images
- **Module:** `axes`
- **Signature:** Same practical image signature as pyplot image display
- **Purpose:** Display array data on an explicit axes.
- **Mental Trigger:** I need matrix/image rendering in OO style.
- **When To Use:** 1) Subplots. 2) Multi-panel heatmaps. 3) Explicit axis control. 4) Model diagnostics. 5) Production report figures.
- **Avoid When:** 1) You are not targeting a specific axes. 2) Simple convenience plotting is enough. 3) The array is not image-like. 4) The plot needs cell labels more than color gradients. 5) You need a different grid representation.
- **Parameters:** Same as `imshow`.
- **Return Value:** `AxesImage`.
- **Runnable Example:** same as item 11, replacing `ax.imshow`.
- **Expected Output:** Image/heatmap on the target axes.
- **Performance Notes:** Same as pyplot imshow.
- **Common Mistakes:** Same as pyplot imshow, plus using the wrong axes.
- **Gotchas:** Same as pyplot imshow.
- **Related APIs:** `pcolormesh`, `colorbar`, `matshow`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html)


### 45. `matplotlib.axes.Axes.contour`

- **Category:** Contours
- **Module:** `axes`
- **Signature:** Same practical contour signature as pyplot contour
- **Purpose:** Draw contour lines on a specific axes.
- **Mental Trigger:** I need contours in a subplot.
- **When To Use:** 1) Multi-panel scientific figures. 2) Explicit axis control. 3) Composite visualizations. 4) Publication outputs. 5) Field comparison plots.
- **Avoid When:** 1) No axes reference exists. 2) A simple heatmap is enough. 3) The grid is too sparse. 4) The chart needs cell boundaries more than isolines. 5) You want convenience over control.
- **Parameters:** Same as `contour`.
- **Return Value:** `ContourSet`.
- **Runnable Example:** same as item 14, replacing `ax.contour`.
- **Expected Output:** Contour lines on a chosen axes.
- **Performance Notes:** Same as pyplot contour.
- **Common Mistakes:** Same as pyplot contour, plus targeting the wrong axes.
- **Gotchas:** Same as pyplot contour.
- **Related APIs:** `contourf`, `clabel`, `imshow`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contour.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contour.html)


### 46. `matplotlib.axes.Axes.contourf`

- **Category:** Filled contours
- **Module:** `axes`
- **Signature:** Same practical filled contour signature as pyplot contourf
- **Purpose:** Draw filled contours on a specific axes.
- **Mental Trigger:** I need filled level regions in a subplot.
- **When To Use:** 1) Composite figures. 2) Scientific panels. 3) Explicit axis control. 4) Background fields. 5) Publication plots.
- **Avoid When:** 1) No axes reference exists. 2) Color bands would obscure the story. 3) The field is too sparse. 4) A heatmap is clearer. 5) You need simple points or lines.
- **Parameters:** Same as `contourf`.
- **Return Value:** `QuadContourSet`.
- **Runnable Example:** same as item 15, replacing `ax.contourf`.
- **Expected Output:** Filled contour regions on the target axes.
- **Performance Notes:** Same as pyplot contourf.
- **Common Mistakes:** Same as pyplot contourf.
- **Gotchas:** Same as pyplot contourf.
- **Related APIs:** `contour`, `imshow`, `colorbar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contourf.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contourf.html)


### 47. `matplotlib.axes.Axes.legend`

- **Category:** Legends
- **Module:** `axes`
- **Signature:** `legend(*args, **kwargs)`
- **Purpose:** Add a legend to a specific axes.
- **Mental Trigger:** I need series labels on one subplot.
- **When To Use:** 1) Multi-panel layouts. 2) Explicit axis control. 3) Reusable plot functions. 4) Publication figures. 5) Subplot-specific labeling.
- **Avoid When:** 1) The figure-level legend is better. 2) Labels already appear directly on the marks. 3) The legend would block data. 4) Too many series exist. 5) A colorbar is the better semantic key.
- **Parameters:** Same practical legend parameters as pyplot.
- **Return Value:** `Legend`.
- **Runnable Example:** same as item 17, replacing `ax.legend`.
- **Expected Output:** Legend attached to the given axes.
- **Performance Notes:** Same as pyplot legend.
- **Common Mistakes:** Same as pyplot legend, plus placing it on the wrong axes.
- **Gotchas:** Same as pyplot legend.
- **Related APIs:** `legend`, `figure.legend`, `colorbar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.legend.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.legend.html)


### 48. `matplotlib.axes.Axes.set_title`

- **Category:** Text
- **Module:** `axes`
- **Signature:** `set_title(label, fontdict=None, loc=None, pad=None, *, y=None, **kwargs)`
- **Purpose:** Set the title on a specific axes.
- **Mental Trigger:** I need a subplot title.
- **When To Use:** 1) Multi-panel comparisons. 2) Per-axis labeling. 3) Report figures. 4) Sectioned layouts. 5) Clear panel differentiation.
- **Avoid When:** 1) A figure-level title is sufficient. 2) The title duplicates context. 3) You need concise labeling only. 4) The layout is too dense. 5) You are relying on captions instead.
- **Parameters:** Same as `title`.
- **Return Value:** `Text`.
- **Runnable Example:** same as item 18, replacing `ax.set_title`.
- **Expected Output:** A titled subplot.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Duplicated subplot titles; long titles in tight grids; inconsistent capitalization; using figure title and axes title redundantly; layout clipping.
- **Gotchas:** Same as `title`, plus subplot-specific spacing.
- **Related APIs:** `set_xlabel`, `set_ylabel`, `suptitle`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html)


### 49. `matplotlib.axes.Axes.set_xlabel`

- **Category:** Text
- **Module:** `axes`
- **Signature:** `set_xlabel(xlabel, fontdict=None, labelpad=None, *, loc=None, **kwargs)`
- **Purpose:** Set x-label on a specific axes.
- **Mental Trigger:** I need subplot-level x-axis text.
- **When To Use:** 1) OO plotting. 2) Shared subplot grids. 3) Explicit axis control. 4) Production figures. 5) Custom panel layouts.
- **Avoid When:** 1) No axes reference exists. 2) The label belongs at figure level. 3) The subplot grid is too crowded. 4) The label is redundant. 5) A caption is sufficient.
- **Parameters:** Same as `xlabel`.
- **Return Value:** `Text`.
- **Runnable Example:** same as item 19, replacing `ax.set_xlabel`.
- **Expected Output:** A labeled subplot x-axis.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Same as `xlabel`.
- **Gotchas:** Same as `xlabel`.
- **Related APIs:** `xlabel`, `set_ylabel`, `set_title`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlabel.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlabel.html)


### 50. `matplotlib.axes.Axes.set_ylabel`

- **Category:** Text
- **Module:** `axes`
- **Signature:** `set_ylabel(ylabel, fontdict=None, labelpad=None, *, loc=None, **kwargs)`
- **Purpose:** Set y-label on a specific axes.
- **Mental Trigger:** I need subplot-level vertical axis text.
- **When To Use:** 1) OO plotting. 2) Shared subplot grids. 3) Explicit axis control. 4) Production figures. 5) Custom layouts.
- **Avoid When:** 1) The label should live elsewhere. 2) The panel is too small. 3) The label is redundant. 4) You are using figure-level annotation. 5) The chart already communicates the meaning elsewhere.
- **Parameters:** Same as `ylabel`.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

# Matplotlib Canonical AENS Package Knowledge Document Addendum

## Scope

This addendum adds additional high-use APIs that were not included in the main 50-API section. It is intended to be appended to the canonical Matplotlib package document for AENS.

## Added APIs

### 51. `matplotlib.pyplot.suptitle`

- **Category:** Text / layout
- **Module:** `pyplot`
- **Signature:** `suptitle(t, **kwargs)`
- **Purpose:** Add a centered figure-level title.
- **Mental Trigger:** I need one title for the whole figure.
- **When To Use:** 1) Multi-panel figures. 2) Report pages. 3) Experiment comparison layouts. 4) Notebook dashboards. 5) Figures with multiple subplot titles.
- **Avoid When:** 1) A single axes title is sufficient. 2) The figure is too crowded. 3) You need a caption outside the plot area. 4) The title repeats subplot titles unnecessarily. 5) Layout is already tight.
- **Parameters:** `t`, `**kwargs`.
- **Return Value:** `Text`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, axs = plt.subplots(2, 1)
fig.suptitle("Summary Figure")
fig.savefig("suptitle_example.png")
```
- **Expected Output:** A figure with a top-level title.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Clipping the title with poor layout; duplicating subplot titles; using too much text; forgetting to reserve space; mixing with manual margins.
- **Gotchas:** `suptitle` is figure-level, not axes-level; it can interact with layout engines; vertical placement may need adjustment; long titles can overlap with subplots; text properties are configurable.
- **Related APIs:** `title`, `tight_layout`, `constrained_layout`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.suptitle.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.suptitle.html)

### 52. `matplotlib.pyplot.gca`

- **Category:** Axes management
- **Module:** `pyplot`
- **Signature:** `gca()`
- **Purpose:** Get the current axes.
- **Mental Trigger:** I need the active subplot object.
- **When To Use:** 1) Incremental plotting in notebooks. 2) Legacy pyplot workflows. 3) Quick inspection. 4) Post-creation tweaking. 5) Interactive commands.
- **Avoid When:** 1) You already have an explicit axes variable. 2) Reusable library code should avoid stateful lookup. 3) Multiple figures are open and current axes is ambiguous. 4) You want deterministic control. 5) You are building maintainable production plotting code.
- **Parameters:** None.
- **Return Value:** `Axes`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
current = plt.gca()
current.set_title("Current Axes")
fig.savefig("gca_example.png")
```
- **Expected Output:** The current axes are retrieved and modified.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Depending on current state in complex scripts; retrieving the wrong axes; mixing with explicit object references; using it across figure changes; assuming it creates a new axes every time.
- **Gotchas:** The "current" axes depends on state; `gca` may create axes in some contexts; it is convenient but fragile in large codebases; backend behavior can affect active state; explicit references are safer.
- **Related APIs:** `gcf`, `subplots`, `sca`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.gca.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.gca.html)

### 53. `matplotlib.pyplot.gcf`

- **Category:** Figure management
- **Module:** `pyplot`
- **Signature:** `gcf()`
- **Purpose:** Get the current figure.
- **Mental Trigger:** I need the active figure object.
- **When To Use:** 1) Interactive inspection. 2) Notebook debugging. 3) Saving the current state. 4) Legacy pyplot workflows. 5) Figure-level tweaks after plotting.
- **Avoid When:** 1) You already have the figure handle. 2) There are multiple figures and current state is ambiguous. 3) Reusable code should not depend on global state. 4) You need deterministic figure selection. 5) You are managing figure lifecycles explicitly.
- **Parameters:** None.
- **Return Value:** `Figure`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
current_fig = plt.gcf()
current_fig.savefig("gcf_example.png")
```
- **Expected Output:** The current figure is returned and saved.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Saving the wrong figure; relying on current state after other plotting code ran; mixing explicit and implicit objects; using it in reusable APIs; assuming it creates a figure unconditionally.
- **Gotchas:** Current figure can change unexpectedly; figure state is backend-sensitive; explicit handles are safer in production; notebook execution order matters; object references are preferable.
- **Related APIs:** `gca`, `figure`, `savefig`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.gcf.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.gcf.html)

### 54. `matplotlib.pyplot.sca`

- **Category:** Axes management
- **Module:** `pyplot`
- **Signature:** `sca(ax)`
- **Purpose:** Set the current axes.
- **Mental Trigger:** I need to direct subsequent pyplot calls to a specific subplot.
- **When To Use:** 1) Legacy stateful scripts. 2) Quick interactive switching. 3) Incremental subplot editing. 4) Notebook exploration. 5) Compatibility with older code.
- **Avoid When:** 1) You can call methods on axes explicitly. 2) The codebase aims for clarity. 3) Multiple state changes would become hard to track. 4) You need maintainable library code. 5) You are using nested layout systems.
- **Parameters:** `ax`.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, (ax1, ax2) = plt.subplots(1, 2)
plt.sca(ax2)
plt.plot([1, 2], [2, 1])
fig.savefig("sca_example.png")
```
- **Expected Output:** The second subplot becomes active and receives the plot.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Drawing on the wrong axes; assuming method calls are isolated after `sca`; mixing with explicit object code; forgetting current state changes; using it when direct method calls are simpler.
- **Gotchas:** It changes pyplot's active target; subsequent functions can target the selected axes; it is easy to misuse in multi-panel figures; explicit axes method calls are safer; current state is global per figure context.
- **Related APIs:** `gca`, `gcf`, `plot`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.sca.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.sca.html)

### 55. `matplotlib.pyplot.ion`

- **Category:** Interactive utilities
- **Module:** `pyplot`
- **Signature:** `ion()`
- **Purpose:** Enable interactive mode.
- **Mental Trigger:** I need plots to update live.
- **When To Use:** 1) Interactive debugging. 2) REPL sessions. 3) Notebook-like live exploration. 4) GUI-driven workflows. 5) Rapid chart iteration.
- **Avoid When:** 1) Batch scripts. 2) Headless export jobs. 3) Reproducible rendering pipelines that should remain deterministic. 4) You need blocking display behavior. 5) You want no GUI side effects.
- **Parameters:** None.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
plt.ion()
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
```
- **Expected Output:** Interactive updates are enabled.
- **Performance Notes:** Can increase UI overhead in live sessions.
- **Common Mistakes:** Leaving interactive mode on in scripts; expecting it to save figures; mixing it with batch jobs; forgetting that backend behavior changes; assuming it affects plot semantics.
- **Gotchas:** Interactivity depends on backend; updates may appear automatically; not all environments support live UI; disabling may be needed after debugging; display timing differs by frontend.
- **Related APIs:** `ioff`, `show`, `pause`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ion.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ion.html)

### 56. `matplotlib.pyplot.ioff`

- **Category:** Interactive utilities
- **Module:** `pyplot`
- **Signature:** `ioff()`
- **Purpose:** Disable interactive mode.
- **Mental Trigger:** I need deterministic non-interactive rendering.
- **When To Use:** 1) Batch exports. 2) Scripted notebooks. 3) Reproducible pipelines. 4) Suppressing live UI updates. 5) Headless plotting.
- **Avoid When:** 1) You need live feedback. 2) You are actively exploring plots in a GUI. 3) The session expects automatic redraws. 4) You rely on interactive widgets. 5) You are debugging visually.
- **Parameters:** None.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
plt.ioff()
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
```
- **Expected Output:** Interactive updates are disabled.
- **Performance Notes:** Helps avoid UI work in batch settings.
- **Common Mistakes:** Forgetting to re-enable interactivity later; expecting visible updates; using it in notebook contexts that rely on interactive redraws; confusing it with backend selection; assuming it affects saved output directly.
- **Gotchas:** Mode affects plotting behavior, not data; it is backend-sensitive; scripts may still need `show`; notebooks can handle display separately; toggle state can persist in session.
- **Related APIs:** `ion`, `show`, `pause`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ioff.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ioff.html)

### 57. `matplotlib.pyplot.pause`

- **Category:** Interactive utilities
- **Module:** `pyplot`
- **Signature:** `pause(interval)`
- **Purpose:** Run the GUI event loop briefly.
- **Mental Trigger:** I need the interface to refresh during a loop.
- **When To Use:** 1) Live demos. 2) Animation-like updates. 3) Debugging interactive loops. 4) Monitoring progressive changes. 5) Manual event processing.
- **Avoid When:** 1) Batch exports. 2) Non-interactive environments. 3) Deterministic test code. 4) Faster explicit redraw logic exists. 5) You do not need UI updates.
- **Parameters:** `interval`.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
plt.pause(0.1)
```
- **Expected Output:** The GUI event loop processes briefly.
- **Performance Notes:** Introduces intentional waiting and UI overhead.
- **Common Mistakes:** Using it in non-GUI environments; making loops unnecessarily slow; relying on it for production timing; using it instead of proper animation tools; forgetting that backend support varies.
- **Gotchas:** It is primarily for interactive backends; event loop behavior depends on frontend; it can block briefly; it is not a replacement for animation classes; useful mainly for debugging and demos.
- **Related APIs:** `ion`, `show`, `draw`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pause.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pause.html)

### 58. `matplotlib.pyplot.draw`

- **Category:** Output
- **Module:** `pyplot`
- **Signature:** `draw()`
- **Purpose:** Redraw the current figure.
- **Mental Trigger:** I need to refresh the canvas now.
- **When To Use:** 1) Interactive updates. 2) GUI event handling. 3) Manual refresh after artist changes. 4) Callback-driven plotting. 5) Debugging live plots.
- **Avoid When:** 1) Saving a static figure is enough. 2) You are in a headless batch job. 3) Automatic redraw already occurs. 4) You are trying to change data rather than appearance. 5) You want animation frame control instead.
- **Parameters:** None.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
plt.draw()
```
- **Expected Output:** The current canvas redraws.
- **Performance Notes:** Can be expensive if called repeatedly in tight loops.
- **Common Mistakes:** Calling it too often; expecting it to save output; using it without a visible backend; confusing it with `show`; drawing before updating artists.
- **Gotchas:** It redraws the current figure, not necessarily all figures; backend support matters; state changes must happen before draw; it does not block like `show`; interactive mode can affect perceived timing.
- **Related APIs:** `show`, `pause`, `draw_idle`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.draw.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.draw.html)

### 59. `matplotlib.pyplot.draw_idle`

- **Category:** Output
- **Module:** `pyplot`
- **Signature:** `draw_idle()`
- **Purpose:** Schedule a redraw when the GUI is idle.
- **Mental Trigger:** I need efficient refresh behavior in an interactive backend.
- **When To Use:** 1) Callback-based updates. 2) GUI tools. 3) Slider-driven visuals. 4) Efficient repeated changes. 5) Non-blocking refresh scheduling.
- **Avoid When:** 1) You need immediate redraw completion. 2) Batch scripts. 3) Non-interactive backends. 4) You are not using event-driven updates. 5) A direct `draw` is sufficient.
- **Parameters:** None.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
plt.draw_idle()
```
- **Expected Output:** A redraw is queued for the active GUI loop.
- **Performance Notes:** Better than repeated immediate redraws in event-driven UIs.
- **Common Mistakes:** Expecting immediate visual completion; using it in headless code; calling it without an interactive loop; replacing explicit redraw logic blindly; ignoring backend behavior.
- **Gotchas:** Idle redraws depend on the event loop; multiple calls may coalesce; backend support matters; it is designed for efficiency, not determinism; use with widgets and callbacks.
- **Related APIs:** `draw`, `pause`, `ion`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.draw_idle.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.draw_idle.html)

### 60. `matplotlib.pyplot.rc`

- **Category:** Styles / configuration
- **Module:** `pyplot`
- **Signature:** `rc(group, **kwargs)`
- **Purpose:** Set runtime configuration parameters.
- **Mental Trigger:** I need to change plotting defaults.
- **When To Use:** 1) Theme customization. 2) Team-wide styling. 3) Temporary default changes. 4) Publication settings. 5) Notebook-wide formatting.
- **Avoid When:** 1) You only need one-off styling on a single artist. 2) You want per-project style sheets instead. 3) You need minimal side effects. 4) The code should remain local and explicit. 5) You are changing many defaults in a brittle way.
- **Parameters:** `group`, `**kwargs`.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
plt.rc("lines", linewidth=2)
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
fig.savefig("rc_example.png")
```
- **Expected Output:** A plot using updated default line width.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Changing global state unintentionally; forgetting to reset defaults; mixing `rc` and direct style settings incoherently; applying project styling too late; not documenting theme changes.
- **Gotchas:** rc settings affect later plots; group names must match configuration groups; the change is session-global; styles can override rc defaults; `rc_context` is safer for temporary changes.
- **Related APIs:** `rcParams`, `style.use`, `rc_context`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.rc.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.rc.html)

### 61. `matplotlib.pyplot.style.context`

- **Category:** Styles / themes
- **Module:** `style`
- **Signature:** `context(style, after_reset=False)`
- **Purpose:** Apply styles temporarily within a context manager.
- **Mental Trigger:** I need scoped theme changes without global side effects.
- **When To Use:** 1) Temporary notebook styling. 2) Test isolation. 3) Generating multiple figures with different themes. 4) Experimental styling. 5) Reusable plotting functions.
- **Avoid When:** 1) Permanent project defaults should be changed centrally. 2) You only need a single artist override. 3) Global style changes are already controlled elsewhere. 4) The style is simple and fixed. 5) Nested contexts would be confusing.
- **Parameters:** `style`, `after_reset`.
- **Return Value:** Context manager.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
with plt.style.context("default"):
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3], [1, 4, 2])
    fig.savefig("style_context_example.png")
```
- **Expected Output:** A figure rendered under a temporary style.
- **Performance Notes:** Minimal overhead.
- **Common Mistakes:** Expecting style changes to persist; using it to hide global style problems; combining too many styles in a nested way; forgetting to save inside the context if needed; assuming all styles are compatible.
- **Gotchas:** Context exit restores prior style state; `after_reset` changes behavior; useful for scoped reproducibility; style files can be layered; backend output can still vary slightly.
- **Related APIs:** `style.use`, `rc_context`, `rc`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.style.context.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.style.context.html)

### 62. `matplotlib.pyplot.get_cmap`

- **Category:** Color maps
- **Module:** `pyplot`
- **Signature:** `get_cmap(name=None, lut=None)`
- **Purpose:** Retrieve a colormap instance.
- **Mental Trigger:** I need a named colormap for encoding values.
- **When To Use:** 1) Heatmaps. 2) Continuous color encoding. 3) Palette inspection. 4) Custom color mapping. 5) Reusable visualization code.
- **Avoid When:** 1) You need categorical colors instead. 2) A specific style already controls color mapping. 3) The chosen map is semantically inappropriate. 4) You want to hardcode ad hoc colors. 5) The application needs accessibility review before selection.
- **Parameters:** `name`, `lut`.
- **Return Value:** `Colormap`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
cmap = plt.get_cmap("viridis")
fig, ax = plt.subplots()
ax.imshow([[0, 1], [2, 3]], cmap=cmap)
fig.savefig("get_cmap_example.png")
```
- **Expected Output:** An image rendered with the selected colormap.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Using a visually misleading colormap; failing to match map to data semantics; confusing continuous and discrete usage; assuming colormap selection alone makes a plot readable; not considering accessibility.
- **Gotchas:** Named colormaps are versioned with Matplotlib; `lut` discretizes lookup behavior; returned maps can be used across plot types; the same map may look different with different normalization; perceptual uniformity matters.
- **Related APIs:** `cm`, `imshow`, `scatter`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.get_cmap.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.get_cmap.html)

### 63. `matplotlib.pyplot.set_cmap`

- **Category:** Color maps
- **Module:** `pyplot`
- **Signature:** `set_cmap(cmap)`
- **Purpose:** Set the default colormap for the current image context.
- **Mental Trigger:** I need to change the default color mapping.
- **When To Use:** 1) Notebook exploration. 2) Global heatmap style adjustments. 3) Rapid theme trials. 4) Consistent image defaults. 5) Session-wide palette changes.
- **Avoid When:** 1) You only need one plot changed. 2) You are trying to control categorical colors. 3) Reproducibility requires explicit per-plot settings. 4) You need local style isolation. 5) You want minimal global state mutation.
- **Parameters:** `cmap`.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
plt.set_cmap("viridis")
fig, ax = plt.subplots()
ax.imshow([[1, 2], [3, 4]])
fig.savefig("set_cmap_example.png")
```
- **Expected Output:** Subsequent image-like plots use the selected colormap.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Forgetting it changes session state; expecting it to affect already-rendered artists; using it for non-image plots; relying on global defaults in production; mixing with explicit cmap arguments.
- **Gotchas:** It affects subsequent plots, not past ones; explicit colormap kwargs override it; it is session-wide within pyplot; style sheets may reset it; image plots are the main target.
- **Related APIs:** `get_cmap`, `rc`, `style.use`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.set_cmap.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.set_cmap.html)

### 64. `matplotlib.pyplot.viridis`

- **Category:** Color maps
- **Module:** `pyplot`
- **Signature:** `viridis()`
- **Purpose:** Set the current colormap to viridis.
- **Mental Trigger:** I need a safe default perceptual colormap quickly.
- **When To Use:** 1) Standardized heatmaps. 2) Notebook exploration. 3) Quick defaults. 4) Continuous scalar plots. 5) Accessible palette baselines.
- **Avoid When:** 1) You need a different semantic colormap. 2) The data are categorical. 3) The project style already defines color usage. 4) You need explicit code clarity over convenience. 5) You are not working with scalar-mapped visuals.
- **Parameters:** None.
- **Return Value:** `None`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
plt.viridis()
fig, ax = plt.subplots()
ax.imshow([[1, 2], [3, 4]])
fig.savefig("viridis_example.png")
```
- **Expected Output:** Image plots use the viridis colormap.
- **Performance Notes:** Negligible.
- **Common Mistakes:** Treating it as a plot function; using it for categories; assuming it permanently modifies all plot types; applying it after plotting; depending on it for explicit reproducibility without version pinning.
- **Gotchas:** It is a convenience shortcut; it changes the current image colormap context; explicit cmap arguments still win; style or rc settings may override later; it is most relevant for image-like artists.
- **Related APIs:** `set_cmap`, `get_cmap`, `imshow`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.viridis.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.viridis.html)

### 65. `matplotlib.pyplot.errorbar`

- **Category:** Line plots / uncertainty
- **Module:** `pyplot`
- **Signature:** `errorbar(x, y, yerr=None, xerr=None, fmt='', ecolor=None, elinewidth=None, capsize=None, barsabove=False, lolims=False, uplims=False, xlolims=False, xuplims=False, errorevery=1, capthick=None, *, data=None, **kwargs)`
- **Purpose:** Plot values with error bars.
- **Mental Trigger:** I need uncertainty or variability on a chart.
- **When To Use:** 1) Experimental measurements. 2) Model metric uncertainty. 3) Repeated trial summaries. 4) Scientific reporting. 5) Approximate confidence displays.
- **Avoid When:** 1) The uncertainty is not meaningful. 2) Error bars would overwhelm the figure. 3) You need full distribution detail instead. 4) Sample size is too small to summarize well. 5) A band or violin plot would communicate better.
- **Parameters:** `x`, `y`, `yerr`, `xerr`, `fmt`, `ecolor`, `capsize`, `errorevery`.
- **Return Value:** `ErrorbarContainer`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.errorbar([1, 2, 3], [2, 4, 3], yerr=[0.2, 0.5, 0.3], fmt="o")
fig.savefig("errorbar_example.png")
```
- **Expected Output:** Points with vertical error bars.
- **Performance Notes:** Fine for small datasets; many bars can create clutter and render cost.
- **Common Mistakes:** Using error bars without statistical meaning; misinterpreting standard deviation as confidence interval; overcrowding the chart; forgetting units; passing mismatched error array shapes.
- **Gotchas:** `yerr` and `xerr` accept scalar or shaped inputs; caps are optional; asymmetric errors are supported; the `fmt` string controls point style; too many bars reduce readability.
- **Related APIs:** `fill_between`, `plot`, `bar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.errorbar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.errorbar.html)

### 66. `matplotlib.pyplot.fill_between`

- **Category:** Line plots / filled regions
- **Module:** `pyplot`
- **Signature:** `fill_between(x, y1, y2=0, where=None, interpolate=False, step=None, *, data=None, **kwargs)`
- **Purpose:** Fill the area between two curves or between a curve and a baseline.
- **Mental Trigger:** I need an interval band or shaded region.
- **When To Use:** 1) Confidence intervals. 2) Threshold highlighting. 3) Area-under-curve shading. 4) Ranged time series. 5) Overlap comparisons.
- **Avoid When:** 1) You need discrete bars. 2) The filled region would obscure too much data. 3) A line-only plot is clearer. 4) The baseline is not meaningful. 5) You need exact area values rather than visual emphasis.
- **Parameters:** `x`, `y1`, `y2`, `where`, `interpolate`, `step`.
- **Return Value:** `PolyCollection`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
x = [1, 2, 3]
y = [2, 4, 3]
ax.plot(x, y)
ax.fill_between(x, [1, 3, 2], [3, 5, 4], alpha=0.2)
fig.savefig("fill_between_example.png")
```
- **Expected Output:** A line with a shaded band.
- **Performance Notes:** Efficient for moderate spans; dense data with many fills can slow rendering.
- **Common Mistakes:** Filling the wrong baseline; using opaque fills that obscure data; mismatching x ordering; forgetting transparency; overusing shaded areas.
- **Gotchas:** `where` selectively fills regions; interpolation changes boundaries; step semantics matter; color and alpha strongly affect readability; the filled artist is a collection.
- **Related APIs:** `errorbar`, `fill_betweenx`, `stackplot`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.fill_between.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.fill_between.html)

### 67. `matplotlib.pyplot.axvline`

- **Category:** Spans
- **Module:** `pyplot`
- **Signature:** `axvline(x=0, ymin=0, ymax=1, **kwargs)`
- **Purpose:** Draw a vertical reference line spanning the axes.
- **Mental Trigger:** I need a vertical marker.
- **When To Use:** 1) Threshold markers. 2) Event markers. 3) Decision boundaries. 4) Reference annotations. 5) Trend alignment cues.
- **Avoid When:** 1) You need a finite segment in data coordinates. 2) A text annotation is enough. 3) The chart is already too cluttered. 4) The reference line has no analytical meaning. 5) You need a horizontal marker instead.
- **Parameters:** `x`, `ymin`, `ymax`, `**kwargs`.
- **Return Value:** `Line2D`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.axvline(2, color="red", linestyle="--")
fig.savefig("axvline_example.png")
```
- **Expected Output:** A vertical reference line.
- **Performance Notes:** Very cheap.
- **Common Mistakes:** Using it for data series; placing too many markers; confusing axes-relative ymin/ymax with data limits; forgetting color contrast; overusing decoration.
- **Gotchas:** `ymin` and `ymax` are axes fractions, not data values; line spans the visible axes region; style kwargs affect the line artist; use sparingly for clarity; can be layered with other artists.
- **Related APIs:** `axhline`, `axvspan`, `vlines`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axvline.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axvline.html)

### 68. `matplotlib.pyplot.axhline`

- **Category:** Spans
- **Module:** `pyplot`
- **Signature:** `axhline(y=0, xmin=0, xmax=1, **kwargs)`
- **Purpose:** Draw a horizontal reference line spanning the axes.
- **Mental Trigger:** I need a horizontal marker.
- **When To Use:** 1) Zero baselines. 2) Threshold lines. 3) Target values. 4) Mean or reference levels. 5) Control chart markers.
- **Avoid When:** 1) The line should be limited to a data segment. 2) You need another chart type. 3) The figure is already crowded. 4) There is no analytical reason for the line. 5) You need vertical orientation.
- **Parameters:** `y`, `xmin`, `xmax`, `**kwargs`.
- **Return Value:** `Line2D`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.axhline(2, color="green", linestyle=":")
fig.savefig("axhline_example.png")
```
- **Expected Output:** A horizontal reference line.
- **Performance Notes:** Very cheap.
- **Common Mistakes:** Confusing axes fractions with data coordinates; adding too many reference lines; using it as data; poor contrast against the plot; assuming it updates with scale changes.
- **Gotchas:** `xmin` and `xmax` are axes fractions; it spans the axes area, not data extent; style and z-order matter; it is ideal for thresholds; can be combined with annotations.
- **Related APIs:** `axvline`, `axhspan`, `hlines`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axhline.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axhline.html)

### 69. `matplotlib.pyplot.hist2d`

- **Category:** 2D histograms
- **Module:** `pyplot`
- **Signature:** `hist2d(x, y, bins=10, range=None, density=False, weights=None, cmin=None, cmax=None, *, data=None, **kwargs)`
- **Purpose:** Plot a 2D histogram as a density grid.
- **Mental Trigger:** I need a binned 2D density view.
- **When To Use:** 1) Large scatter clouds. 2) Density approximation. 3) Correlation structure exploration. 4) Overplotting reduction. 5) Heatmap-like point density summaries.
- **Avoid When:** 1) You need exact point positions. 2) The dataset is small enough for scatter. 3) Bin choice would dominate interpretation. 4) You need labeled categorical grids. 5) The data are irregular and binning is misleading.
- **Parameters:** `x`, `y`, `bins`, `range`, `density`, `weights`, `cmin`, `cmax`.
- **Return Value:** `(H, xedges, yedges, image)`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
x = [1, 1, 2, 2, 3, 3, 3]
y = [1, 2, 2, 3, 3, 4, 4]
fig, ax = plt.subplots()
ax.hist2d(x, y, bins=3)
fig.savefig("hist2d_example.png")
```
- **Expected Output:** A 2D density grid.
- **Performance Notes:** Useful for large datasets because it bins before rendering.
- **Common Mistakes:** Using too few or too many bins; reading counts as individual points; forgetting that binning changes meaning; failing to compare binning choices; using it for sparse datasets.
- **Gotchas:** Bin edges define meaning; `density=True` changes scaling; values depend on binning strategy; colorbar is often needed; masked bins can disappear with `cmin`/`cmax`.
- **Related APIs:** `hexbin`, `imshow`, `pcolormesh`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hist2d.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hist2d.html)

### 70. `matplotlib.pyplot.hexbin`

- **Category:** 2D density plots
- **Module:** `pyplot`
- **Signature:** `hexbin(x, y, C=None, gridsize=100, bins=None, xscale='linear', yscale='linear', extent=None, cmap=None, norm=None, vmin=None, vmax=None, alpha=None, linewidths=None, *, data=None, reduce_C_function=<function mean>, mincnt=None, marginals=False, **kwargs)`
- **Purpose:** Plot hexagonal binned density or aggregated values.
- **Mental Trigger:** I need density for very dense scatter data.
- **When To Use:** 1) Large point clouds. 2) Overplotting mitigation. 3) Spatial density visualization. 4) Aggregated 2D summaries. 5) Large-scale exploratory analysis.
- **Avoid When:** 1) You need exact coordinates. 2) Point count is small. 3) Rectangular bins are preferred for a matrix. 4) The user expects ordinary scatter markers. 5) You need fine categorical labels.
- **Parameters:** `x`, `y`, `C`, `gridsize`, `bins`, `extent`, `reduce_C_function`, `mincnt`.
- **Return Value:** `PolyCollection`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
x = [1, 1, 2, 2, 3, 3, 4, 4]
y = [1, 2, 2, 3, 3, 4, 4, 5]
fig, ax = plt.subplots()
ax.hexbin(x, y, gridsize=4)
fig.savefig("hexbin_example.png")
```
- **Expected Output:** A hexagonal density plot.
- **Performance Notes:** Often better than scatter for large dense point sets.
- **Common Mistakes:** Choosing a poor grid size; misreading aggregated values; omitting a colorbar; using it on sparse data; comparing hexbin outputs with different binning settings.
- **Gotchas:** Binning choices strongly affect appearance; `C` enables aggregation beyond counts; `reduce_C_function` controls aggregation; `marginals` adds marginal histograms; hexbin is ideal for dense clouds.
- **Related APIs:** `hist2d`, `scatter`, `imshow`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hexbin.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hexbin.html)

### 71. `matplotlib.pyplot.step`

- **Category:** Line plots
- **Module:** `pyplot`
- **Signature:** `step(x, y, *args, where='pre', data=None, **kwargs)`
- **Purpose:** Draw a stepwise constant line.
- **Mental Trigger:** I need a piecewise constant series.
- **When To Use:** 1) Event count timelines. 2) Cumulative process states. 3) Discrete state changes. 4) Histogram-like traces. 5) Threshold-based processes.
- **Avoid When:** 1) You need smooth interpolation. 2) The data are continuous. 3) Ordinary line plots are clearer. 4) You need filled regions instead. 5) The step semantics are not meaningful.
- **Parameters:** `x`, `y`, `where`.
- **Return Value:** List of `Line2D`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.step([1, 2, 3], [1, 4, 2], where="mid")
fig.savefig("step_example.png")
```
- **Expected Output:** A stepwise line chart.
- **Performance Notes:** Similar to line plots.
- **Common Mistakes:** Using the wrong `where` setting; applying it to smooth signals; forgetting that step shape changes interpretation; mismatching x/y lengths; using it when `plot` is clearer.
- **Gotchas:** `where` affects visual semantics; steps are better for discrete transitions; can be combined with markers; axis limits may emphasize plateaus; it is not interpolation.
- **Related APIs:** `plot`, `stairs`, `fill_between`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.step.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.step.html)

### 72. `matplotlib.pyplot.stairs`

- **Category:** Histograms / step fills
- **Module:** `pyplot`
- **Signature:** `stairs(values, edges=None, *, orientation='vertical', baseline=0, fill=False, data=None, **kwargs)`
- **Purpose:** Draw a staircase plot from precomputed values and edges.
- **Mental Trigger:** I already have binned data and need to render it.
- **When To Use:** 1) Prebinned histograms. 2) Density plots from prior computation. 3) Lightweight rendering of discrete intervals. 4) Reproducible statistical visuals. 5) Cases where bin edges matter explicitly.
- **Avoid When:** 1) You need automatic bin computation. 2) Raw sample data should be summarized inside Matplotlib. 3) You want a smooth line. 4) The audience expects bars rather than bins. 5) You need point-level detail.
- **Parameters:** `values`, `edges`, `orientation`, `baseline`, `fill`.
- **Return Value:** `StepPatch`.
- **Runnable Example:**
```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.stairs([1, 3, 2], [0, 1, 2, 3])
fig.savefig("stairs_example.png")
```
- **Expected Output:** A staircase-style plot.
- **Performance Notes:** Efficient for precomputed binned data.
- **Common Mistakes:** Providing mismatched values and edges; using it when raw histograms are needed; confusing it with `step`; ignoring bin edge semantics; overfilling dense plots.
- **Gotchas:** Edges define the bin boundaries; it is useful for histogram-like rendering without recomputing bins; `baseline` affects the visual fill area; orientation matters; precomputed data improves reproducibility.
- **Related APIs:** `hist`, `step`, `bar`.
- **Official API URL:** [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.stairs.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.stairs.html)

## Selection note

This addendum adds 22 additional high-use APIs (51-72) without duplicating the main 50-API section.


[^1]: https://matplotlib.org/stable/index.html

[^2]: https://matplotlib.org/stable/users/release_notes.html

[^3]: https://github.com/matplotlib/matplotlib/

[^4]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^5]: CURRENT_PROJECT_STATE_REPORT.md

[^6]: CONTENT_QUALITY_STANDARD.md

[^7]: ARCHITECTURE_FREEZE.md

[^8]: AENS-Knowledge-Layer-Specification.md

[^9]: https://joss.theoj.org/papers/10.21105/joss.00547.pdf

[^10]: https://arxiv.org/html/2503.20089

[^11]: http://arxiv.org/pdf/2406.03839.pdf

[^12]: http://arxiv.org/pdf/1611.00751.pdf

[^13]: https://matplotlib.org/stable/users/release_notes

[^14]: https://github.com/matplotlib/matplotlib.github.com/blob/main/versions.html

[^15]: https://en.wikipedia.org/wiki/Matplotlib

[^16]: https://matplotlib.org/

[^17]: https://matplotlib.org/stable/release/prev_whats_new/whats_new_3.10.0.html

[^18]: https://matplotlib.org/stable/devel/release_guide.html

[^19]: https://github.com/matplotlib/matplotlib/releases
