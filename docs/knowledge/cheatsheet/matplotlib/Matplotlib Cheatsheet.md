<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Matplotlib Cheatsheet

## Metadata

- id: matplotlib.cheatsheet.canonical
- title: Matplotlib Canonical Cheatsheet
- slug: matplotlib-canonical-cheatsheet
- name: Matplotlib Cheatsheet
- description: Canonical syntax recall for daily Matplotlib engineering work with production-ready, copy-paste snippets and compact lookup tables.
- package_reference: Matplotlib
- version: 3.11.0
- sources:
    - [Official Matplotlib release notes](https://matplotlib.org/stable/users/release_notes.html)
    - [Matplotlib Figure API](https://matplotlib.org/stable/api/figure_api.html)
    - [Matplotlib Axes API](https://matplotlib.org/stable/api/axes_api.html)
    - [Matplotlib gallery](https://matplotlib.org/stable/gallery/index.html)
    - [Matplotlib GitHub repository](https://github.com/matplotlib/matplotlib)
- created_at: 2026-07-06
- updated_at: 2026-07-06


## Imports

### 1. Import pyplot and NumPy

**Problem:** Start a standard Matplotlib script with NumPy data.
**Trigger:** You need plotting plus array creation in one file.
**Snippet:**

```python
import numpy as np
import matplotlib.pyplot as plt
```

**Minimal notes:** This is the default import pair for most scripts. Use `plt` for figure creation and `np` for data generation.
**Common bug:** Forgetting `import numpy as np` before using sample data.
**Official Documentation URL:** [matplotlib.pyplot](https://matplotlib.org/stable/api/pyplot_api.html)

### 2. Import Matplotlib core

**Problem:** Configure Matplotlib without pyplot.
**Trigger:** You need backend, rcParams, or non-plot utilities.
**Snippet:**

```python
import matplotlib as mpl
```

**Minimal notes:** Use `matplotlib` for package-level settings and metadata. Keep plotting code in `pyplot` or OO objects.
**Common bug:** Using `plt.rcParams` in code that should only depend on the core package.
**Official Documentation URL:** [matplotlib](https://matplotlib.org/stable/api/index.html)

### 3. Use NumPy arrays with plotting

**Problem:** Plot computed arrays directly.
**Trigger:** Your data is already in NumPy form.
**Snippet:**

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 200)
y = np.sin(x)
fig, ax = plt.subplots()
ax.plot(x, y)
plt.show()
```

**Minimal notes:** Matplotlib accepts NumPy arrays natively. Most scientific plots start this way.
**Common bug:** Passing mismatched array lengths for `x` and `y`.
**Official Documentation URL:** [plot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html)

## Figure lifecycle

### 4. Create a figure

**Problem:** Open a single canvas for manual Axes placement.
**Trigger:** You need explicit figure control before adding axes.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig = plt.figure(figsize=(8, 4), dpi=150, layout="constrained")
ax = fig.add_subplot(111)
ax.plot([1, 2, 3], [1, 4, 9])
plt.show()
```

**Minimal notes:** Use `Figure` when you need direct control over size or canvas layout. Prefer `subplots()` when starting a normal multi-panel figure.
**Common bug:** Creating a figure but never adding an Axes.
**Official Documentation URL:** [figure](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.figure.html)

### 5. Create subplots

**Problem:** Build a figure with one or more Axes at once.
**Trigger:** You need the standard OO workflow for one-panel or grid layouts.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(6, 4), layout="constrained")
ax.plot([1, 2, 3], [2, 3, 5])
ax.set_title("Single panel")
plt.show()
```

**Minimal notes:** This is the most common production entry point. For multiple panels, `axs` is returned as an array.
**Common bug:** Treating the returned Axes array like a single Axes object.
**Official Documentation URL:** [subplots](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html)

### 6. Use subfigures

**Problem:** Split one figure into nested figure regions.
**Trigger:** You need independent layouts inside a larger page.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure(layout="constrained", figsize=(10, 4))
subfigs = fig.subfigures(1, 2, wspace=0.07)
x = np.linspace(0, 1, 50)

ax1 = subfigs[^0].subplots()
ax1.plot(x, x**2)
ax1.set_title("Left")

ax2 = subfigs[^1].subplots()
ax2.plot(x, np.sqrt(x))
ax2.set_title("Right")

plt.show()
```

**Minimal notes:** Use subfigures for complex dashboard-style layouts. They behave like nested figures.
**Common bug:** Using subfigures when a simple subplot grid would be easier.
**Official Documentation URL:** [subfigures](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.subfigures.html)

### 7. Build a GridSpec layout

**Problem:** Place Axes with uneven row or column spans.
**Trigger:** You need a figure with asymmetric panel sizes.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig = plt.figure(layout="constrained", figsize=(8, 5))
gs = fig.add_gridspec(2, 2)

ax1 = fig.add_subplot(gs[0, :])
ax2 = fig.add_subplot(gs[1, 0])
ax3 = fig.add_subplot(gs[1, 1])

ax1.set_title("Top spans both columns")
plt.show()
```

**Minimal notes:** `GridSpec` is the low-level layout tool for spans. Use it when `subplots()` is not enough.
**Common bug:** Mixing `GridSpec` and manual `add_axes()` positions in the same layout.
**Official Documentation URL:** [add_gridspec](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.add_gridspec.html)

### 8. Build a mosaic layout

**Problem:** Name panels instead of indexing them manually.
**Trigger:** You want readable layout code for dashboards.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, axd = plt.subplot_mosaic([["top", "top"], ["left", "right"]],
                              figsize=(8, 5), layout="constrained")
axd["top"].set_title("Top")
axd["left"].plot([1, 2, 3], [1, 4, 2])
axd["right"].plot([1, 2, 3], [2, 1, 3])
plt.show()
```

**Minimal notes:** Mosaic layouts improve readability in multi-panel figures. They are ideal when panels have semantic names.
**Common bug:** Reusing the same label unintentionally and overwriting a panel.
**Official Documentation URL:** [subplot_mosaic](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html)

### 9. Show a figure

**Problem:** Render the current figure in a script or notebook.
**Trigger:** You want the GUI or notebook backend to display output.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
plt.show()
```

**Minimal notes:** In scripts, `show()` is the normal display step. In notebooks it may be implicit, but calling it is still safe.
**Common bug:** Forgetting `show()` in script-based workflows.
**Official Documentation URL:** [show](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.show.html)

### 10. Close a figure

**Problem:** Free memory after generating plots.
**Trigger:** You create many figures in a loop or batch job.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
plt.close(fig)
```

**Minimal notes:** Closing figures prevents memory growth in long-running jobs. Close figures you no longer need.
**Common bug:** Leaving hundreds of figures open in automation or notebook loops.
**Official Documentation URL:** [close](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.close.html)

## Basic plots

### 11. Create a line plot

**Problem:** Plot a continuous trend or series.
**Trigger:** You need the default chart for numeric sequences.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 200)
y = np.sin(x)
fig, ax = plt.subplots()
ax.plot(x, y, label="sin(x)", linewidth=2)
ax.legend()
plt.show()
```

**Minimal notes:** `plot()` is the workhorse for line charts. Add labels early if a legend is needed.
**Common bug:** Using `plot()` without specifying the x-values when order matters.
**Official Documentation URL:** [plot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html)

### 12. Create a scatter plot

**Problem:** Show point-wise relationships or clusters.
**Trigger:** You need to visualize unconnected observations.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(size=200)
y = 0.5 * x + rng.normal(size=200)

fig, ax = plt.subplots()
ax.scatter(x, y, s=25, alpha=0.7)
plt.show()
```

**Minimal notes:** Use `scatter()` for point clouds and categorical jitter plots. Control size and alpha for dense data.
**Common bug:** Passing huge markers without alpha, which hides structure.
**Official Documentation URL:** [scatter](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html)

### 13. Create a bar chart

**Problem:** Compare discrete categories.
**Trigger:** You need vertical bars for counts, totals, or ranking.
**Snippet:**

```python
import matplotlib.pyplot as plt

labels = ["A", "B", "C"]
values = [10, 14, 8]

fig, ax = plt.subplots()
ax.bar(labels, values, color=["#4C78A8", "#F58518", "#54A24B"])
ax.set_ylabel("Value")
plt.show()
```

**Minimal notes:** `bar()` is the default categorical comparison plot. Keep category labels short to avoid overlap.
**Common bug:** Using numeric categories without setting tick labels clearly.
**Official Documentation URL:** [bar](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html)

### 14. Create a horizontal bar chart

**Problem:** Compare categories with long labels.
**Trigger:** Vertical labels would be hard to read.
**Snippet:**

```python
import matplotlib.pyplot as plt

labels = ["Long label A", "Long label B", "Long label C"]
values = [10, 14, 8]

fig, ax = plt.subplots()
ax.barh(labels, values, color="#4C78A8")
ax.set_xlabel("Value")
plt.show()
```

**Minimal notes:** `barh()` is better when labels are lengthy. It also works well for rankings.
**Common bug:** Forgetting to invert the y-axis when you want the highest value at the top.
**Official Documentation URL:** [barh](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.barh.html)

### 15. Create a histogram

**Problem:** Show the distribution of a numeric variable.
**Trigger:** You need frequency or density bins.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
data = rng.normal(size=1000)

fig, ax = plt.subplots()
ax.hist(data, bins=30, edgecolor="white")
ax.set_xlabel("Value")
ax.set_ylabel("Count")
plt.show()
```

**Minimal notes:** `hist()` is the standard distribution overview. Bin count changes the visual shape a lot.
**Common bug:** Comparing histograms with different bin edges.
**Official Documentation URL:** [hist](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html)

### 16. Create a pie chart

**Problem:** Show part-to-whole proportions.
**Trigger:** You have a small number of categories that sum to a whole.
**Snippet:**

```python
import matplotlib.pyplot as plt

sizes = [40, 35, 25]
labels = ["A", "B", "C"]

fig, ax = plt.subplots()
ax.pie(sizes, labels=labels, autopct="%1.1f%%", startangle=90)
ax.set_aspect("equal")
plt.show()
```

**Minimal notes:** Use pie charts sparingly and only for simple proportions. Equal aspect keeps the circle round.
**Common bug:** Omitting `ax.set_aspect("equal")` and getting an oval.
**Official Documentation URL:** [pie](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.pie.html)

### 17. Create a box plot

**Problem:** Compare distributions with quartiles and outliers.
**Trigger:** You need compact summary statistics across groups.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
data = [rng.normal(loc, 1, 200) for loc in [0, 1, 2]]

fig, ax = plt.subplots()
ax.boxplot(data, labels=["G1", "G2", "G3"])
ax.set_ylabel("Value")
plt.show()
```

**Minimal notes:** `boxplot()` is useful for side-by-side group summaries. Use it when medians and spread matter.
**Common bug:** Forgetting to pass grouped sequences rather than one flattened array.
**Official Documentation URL:** [boxplot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.boxplot.html)

### 18. Create a violin plot

**Problem:** Compare group distributions with shape information.
**Trigger:** You need more detail than a box plot provides.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
data = [rng.normal(loc, 1, 200) for loc in [0, 1, 2]]

fig, ax = plt.subplots()
ax.violinplot(data, showmeans=True, showmedians=True)
ax.set_xticks([1, 2, 3], ["G1", "G2", "G3"])
ax.set_ylabel("Value")
plt.show()
```

**Minimal notes:** Violin plots show density shape as well as spread. They work well for distribution comparison across groups.
**Common bug:** Not setting tick labels for the violin positions.
**Official Documentation URL:** [violinplot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.violinplot.html)

### 19. Create a stem plot

**Problem:** Show discrete impulses or sample amplitudes.
**Trigger:** Your data is naturally sampled at individual points.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(0, 10)
y = np.array([1, 3, 2, 5, 4, 2, 1, 3, 2, 4])

fig, ax = plt.subplots()
ax.stem(x, y)
plt.show()
```

**Minimal notes:** Stem plots emphasize each sample location. They are common in signal processing and integer-indexed data.
**Common bug:** Using stem for dense continuous series where a line plot is clearer.
**Official Documentation URL:** [stem](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.stem.html)

### 20. Create a step plot

**Problem:** Show piecewise constant values or state changes.
**Trigger:** Your series changes at discrete boundaries.
**Snippet:**

```python
import matplotlib.pyplot as plt

x = [0, 1, 2, 3, 4]
y = [1, 1, 3, 3, 2]

fig, ax = plt.subplots()
ax.step(x, y, where="mid")
ax.set_ylim(0, 4)
plt.show()
```

**Minimal notes:** Step plots are ideal for sampled states and histogram-like trends. The `where` argument controls alignment.
**Common bug:** Picking the wrong `where` value and shifting the visual transition.
**Official Documentation URL:** [step](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.step.html)

### 21. Create a stack plot

**Problem:** Show how multiple series add up over time.
**Trigger:** You need cumulative area comparison.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(5)
y1 = np.array([1, 2, 1, 3, 2])
y2 = np.array([2, 1, 2, 1, 2])

fig, ax = plt.subplots()
ax.stackplot(x, y1, y2, labels=["A", "B"])
ax.legend(loc="upper left")
plt.show()
```

**Minimal notes:** `stackplot()` is good for part-to-whole over an ordered x-axis. Keep the number of series small.
**Common bug:** Stacking data that should actually be compared separately.
**Official Documentation URL:** [stackplot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.stackplot.html)

### 22. Create an area fill plot

**Problem:** Shade the region under or between curves.
**Trigger:** You need emphasis on an interval or magnitude.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 200)
y = np.sin(x)

fig, ax = plt.subplots()
ax.plot(x, y, color="black")
ax.fill_between(x, 0, y, alpha=0.3)
plt.show()
```

**Minimal notes:** `fill_between()` is the common area chart primitive. It also works for confidence bands.
**Common bug:** Forgetting to plot the line, which makes the filled area harder to read.
**Official Documentation URL:** [fill_between](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html)

### 23. Create an error bar plot

**Problem:** Show measured values with uncertainty.
**Trigger:** You have standard deviations, confidence intervals, or measurement error.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(5)
y = np.array([2.0, 2.5, 3.1, 2.8, 3.4])
err = np.array([0.2, 0.3, 0.1, 0.25, 0.15])

fig, ax = plt.subplots()
ax.errorbar(x, y, yerr=err, fmt="o", capsize=4)
plt.show()
```

**Minimal notes:** `errorbar()` is the standard uncertainty overlay. Use symmetric or asymmetric errors as needed.
**Common bug:** Plotting error bars with the wrong units or scale.
**Official Documentation URL:** [errorbar](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.errorbar.html)

## Statistical and scientific plots

### 24. Create a hexbin plot

**Problem:** Visualize dense 2D point clouds.
**Trigger:** A scatter plot is too overplotted.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(size=5000)
y = x * 0.5 + rng.normal(size=5000)

fig, ax = plt.subplots()
hb = ax.hexbin(x, y, gridsize=40, cmap="viridis")
fig.colorbar(hb, ax=ax)
plt.show()
```

**Minimal notes:** Hexbin compresses dense scatter data into bins. Add a colorbar for counts or density.
**Common bug:** Using hexbin on small datasets where scatter is clearer.
**Official Documentation URL:** [hexbin](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hexbin.html)

### 25. Create contour lines

**Problem:** Show level curves of a 2D scalar field.
**Trigger:** You need isolines for scientific data.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)

fig, ax = plt.subplots()
cs = ax.contour(X, Y, Z, levels=10)
ax.clabel(cs, inline=True, fontsize=8)
plt.show()
```

**Minimal notes:** `contour()` is the base isoline plot. Label contours only when the plot stays readable.
**Common bug:** Passing 1D arrays instead of a meshgrid for gridded data.
**Official Documentation URL:** [contour](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contour.html)

### 26. Create filled contours

**Problem:** Show continuous scalar fields with filled levels.
**Trigger:** You need a heatmap-like scientific surface.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)

fig, ax = plt.subplots()
cf = ax.contourf(X, Y, Z, levels=20, cmap="coolwarm")
fig.colorbar(cf, ax=ax)
plt.show()
```

**Minimal notes:** `contourf()` is the filled version of contour plotting. Pair it with a colorbar.
**Common bug:** Using too many levels and losing interpretability.
**Official Documentation URL:** [contourf](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contourf.html)

### 27. Display an image

**Problem:** Render a matrix or raster array.
**Trigger:** You have image-like 2D data or pixel grids.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

img = np.random.default_rng(0).random((50, 50))

fig, ax = plt.subplots()
im = ax.imshow(img, cmap="viridis", origin="lower")
fig.colorbar(im, ax=ax)
plt.show()
```

**Minimal notes:** `imshow()` is the standard raster display API. Always check `origin` when orientation matters.
**Common bug:** Forgetting that image row 0 is often drawn at the top by default.
**Official Documentation URL:** [imshow](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html)

### 28. Display a matrix as an image

**Problem:** Show array structure with row and column indexing.
**Trigger:** You want a matrix view rather than generic image semantics.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

mat = np.arange(16).reshape(4, 4)

fig, ax = plt.subplots()
im = ax.matshow(mat, cmap="Blues")
fig.colorbar(im, ax=ax)
plt.show()
```

**Minimal notes:** `matshow()` is a convenience wrapper for matrix visualization. It is useful for small tables and matrices.
**Common bug:** Using it for large arrays where labels become unreadable.
**Official Documentation URL:** [matshow](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.matshow.html)

### 29. Create a pseudocolor mesh

**Problem:** Visualize values on a rectangular grid.
**Trigger:** Your data is on cell corners or a grid surface.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 1, 40)
y = np.linspace(0, 1, 30)
X, Y = np.meshgrid(x, y)
Z = np.sin(4 * np.pi * X) * np.cos(3 * np.pi * Y)

fig, ax = plt.subplots()
pc = ax.pcolormesh(X, Y, Z, shading="auto", cmap="viridis")
fig.colorbar(pc, ax=ax)
plt.show()
```

**Minimal notes:** `pcolormesh()` is often faster than contouring for gridded data. Use `shading="auto"` for modern defaults.
**Common bug:** Dimension mismatch between grid coordinates and cell values.
**Official Documentation URL:** [pcolormesh](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.pcolormesh.html)

### 30. Create a quiver plot

**Problem:** Plot vector fields with arrows.
**Trigger:** You need direction and magnitude on a grid.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x, y = np.meshgrid(np.arange(0, 5), np.arange(0, 5))
u = np.cos(x)
v = np.sin(y)

fig, ax = plt.subplots()
ax.quiver(x, y, u, v)
plt.show()
```

**Minimal notes:** `quiver()` is the standard arrow-field plot. Scale and normalization matter for readability.
**Common bug:** Letting arrows overlap so densely that direction is unclear.
**Official Documentation URL:** [quiver](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.quiver.html)

### 31. Create a stream plot

**Problem:** Show flow lines for a vector field.
**Trigger:** You want continuous trajectories instead of arrows.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-2, 2, 40)
y = np.linspace(-2, 2, 40)
X, Y = np.meshgrid(x, y)
U = -Y
V = X

fig, ax = plt.subplots()
ax.streamplot(X, Y, U, V, density=1.2)
plt.show()
```

**Minimal notes:** `streamplot()` is better when the field is dense. It emphasizes flow over local vectors.
**Common bug:** Feeding irregular grids that are not compatible with streamplot expectations.
**Official Documentation URL:** [streamplot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.streamplot.html)

### 32. Create a 2D histogram

**Problem:** Show density over two numeric variables.
**Trigger:** Scatter is too noisy and you need aggregated counts.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(size=5000)
y = x * 0.4 + rng.normal(size=5000)

fig, ax = plt.subplots()
h = ax.hist2d(x, y, bins=40, cmap="magma")
fig.colorbar(h[^3], ax=ax)
plt.show()
```

**Minimal notes:** Use `hist2d()` for dense bivariate data. It is useful when count density matters more than individual points.
**Common bug:** Forgetting that `hist2d()` returns multiple objects, not just the image.
**Official Documentation URL:** [hist2d](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist2d.html)

## Axes customization

### 33. Set title and labels

**Problem:** Add semantic context to a plot.
**Trigger:** You need axis labels and a title before publication.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
ax.set_title("Trend")
ax.set_xlabel("Time")
ax.set_ylabel("Value")
plt.show()
```

**Minimal notes:** Set labels on the Axes, not globally. Titles and labels should be short and specific.
**Common bug:** Forgetting units in axis labels.
**Official Documentation URL:** [set_title](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html)

### 34. Set axis limits

**Problem:** Control visible data range.
**Trigger:** Autoscaling shows too much or too little data.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
ax.set_xlim(0, 4)
ax.set_ylim(0, 10)
plt.show()
```

**Minimal notes:** Use explicit limits for consistent comparisons across figures. Limits also help focus on a region of interest.
**Common bug:** Setting limits before all data is added and then being surprised by autoscale behavior.
**Official Documentation URL:** [set_xlim](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlim.html)

### 35. Customize ticks and tick labels

**Problem:** Show exactly the tick positions and names you need.
**Trigger:** Default tick placement is not suitable for the story.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [2, 3, 5])
ax.set_xticks([1, 2, 3], ["one", "two", "three"])
ax.set_yticks([2, 4, 6])
plt.show()
```

**Minimal notes:** Use `set_xticks()` and `set_yticks()` for direct control. Pair them with readable labels.
**Common bug:** Calling `set_xticklabels()` without first fixing tick locations.
**Official Documentation URL:** [set_xticks](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xticks.html)

### 36. Rotate tick labels

**Problem:** Prevent tick label overlap.
**Trigger:** Category names or dates are long.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.bar(["Category A", "Category B", "Category C"], [3, 5, 2])
ax.tick_params(axis="x", rotation=30)
plt.show()
```

**Minimal notes:** Rotation is the quickest fix for crowded x-axis labels. Use it with layout management.
**Common bug:** Rotating labels but not adjusting figure size or layout.
**Official Documentation URL:** [tick_params](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.tick_params.html)

### 37. Set axis scale

**Problem:** Use logarithmic or other non-linear scaling.
**Trigger:** Your data spans multiple orders of magnitude.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.logspace(0, 3, 100)
y = x**2

fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_xscale("log")
ax.set_yscale("log")
plt.show()
```

**Minimal notes:** Use scale changes for multiplicative data. Log scales are common in science and engineering plots.
**Common bug:** Applying log scale to data containing zeros or negatives.
**Official Documentation URL:** [set_xscale](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xscale.html)

### 38. Add grid lines

**Problem:** Improve value reading from the plot.
**Trigger:** You need reference lines for estimation.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
ax.grid(True, which="major", axis="both", linestyle="--", alpha=0.4)
plt.show()
```

**Minimal notes:** Grid lines should be subtle, not dominant. Use them to support reading rather than decorate.
**Common bug:** Making grid lines darker than the data.
**Official Documentation URL:** [grid](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.grid.html)

### 39. Set aspect ratio

**Problem:** Preserve geometry or equal scaling.
**Trigger:** Shapes, distances, or slopes must be visually accurate.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([0, 1], [0, 1])
ax.set_aspect("equal", adjustable="box")
plt.show()
```

**Minimal notes:** `equal` is common for maps, circles, and geometry plots. Aspect control prevents distortion.
**Common bug:** Using default aspect for shapes that need equal units.
**Official Documentation URL:** [set_aspect](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_aspect.html)

### 40. Add a secondary y-axis

**Problem:** Show a second scale derived from the primary y-axis.
**Trigger:** You need a transformed companion axis on the right.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()
x = np.linspace(0, 10, 100)
ax.plot(x, x**2)
secax = ax.secondary_yaxis("right", functions=(lambda y: y / 2, lambda y: y * 2))
secax.set_ylabel("Half scale")
plt.show()
```

**Minimal notes:** Use `secondary_yaxis()` for mathematically related scales. Keep the transform simple and invertible.
**Common bug:** Using a secondary axis for unrelated units.
**Official Documentation URL:** [secondary_yaxis](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.secondary_yaxis.html)

### 41. Add twin y-axis

**Problem:** Overlay a second series with a different y-scale.
**Trigger:** Two quantities share x but have different units.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
fig, ax1 = plt.subplots()
ax2 = ax1.twinx()

ax1.plot(x, np.sin(x), color="tab:blue", label="sin")
ax2.plot(x, 100 * np.cos(x), color="tab:orange", label="100 cos")
ax1.set_ylabel("sin")
ax2.set_ylabel("100 cos")
plt.show()
```

**Minimal notes:** `twinx()` creates a second y-axis sharing x. Use it when dual units are truly necessary.
**Common bug:** Overloading one plot with too many unrelated scales.
**Official Documentation URL:** [twinx](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.twinx.html)

### 42. Add twin x-axis

**Problem:** Overlay a second x-scale at the top.
**Trigger:** You need paired horizontal units or transformed coordinates.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
fig, ax1 = plt.subplots()
ax2 = ax1.twiny()

ax1.plot(x, np.sin(x))
ax1.set_xlabel("Primary x")
ax2.set_xlabel("Secondary x")
plt.show()
```

**Minimal notes:** `twiny()` shares y while adding a second x axis. It is less common than `twinx()`.
**Common bug:** Forgetting that the top axis has its own tick setup.
**Official Documentation URL:** [twiny](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.twiny.html)

## Legends and text

### 43. Add a legend

**Problem:** Identify plotted series automatically or explicitly.
**Trigger:** More than one artist needs a label.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 5, 50)
fig, ax = plt.subplots()
ax.plot(x, x, label="linear")
ax.plot(x, x**2, label="quadratic")
ax.legend()
plt.show()
```

**Minimal notes:** Legends use artist labels by default. Label the artists at creation time whenever possible.
**Common bug:** Calling `legend()` before assigning any labels.
**Official Documentation URL:** [legend](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.legend.html)

### 44. Place a figure legend

**Problem:** Create one legend for multiple axes.
**Trigger:** A multi-panel figure shares the same series labels.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 5, 50)
fig, axs = plt.subplots(1, 2, figsize=(8, 3), layout="constrained")
l1, = axs[^0].plot(x, x, label="linear")
l2, = axs[^1].plot(x, x**2, label="quadratic")
fig.legend(handles=[l1, l2], loc="outside upper right")
plt.show()
```

**Minimal notes:** `fig.legend()` is useful for shared legends across panels. Use `constrained_layout` for outside placement.
**Common bug:** Putting a separate legend in every subplot when one shared legend is enough.
**Official Documentation URL:** [legend](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.legend.html)

### 45. Create a custom legend

**Problem:** Build a legend from proxy artists.
**Trigger:** The plotted object does not generate the legend you want.
**Snippet:**

```python
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9], color="tab:blue")

handles = [
    Line2D([^0], [^0], color="tab:blue", lw=2, label="Measured"),
    Line2D([^0], [^0], color="tab:orange", lw=2, linestyle="--", label="Target"),
]
ax.legend(handles=handles)
plt.show()
```

**Minimal notes:** Proxy artists are useful when the real plot elements are too complex. Build the legend you need, not the one Matplotlib guesses.
**Common bug:** Using actual data objects when a proxy artist would be simpler.
**Official Documentation URL:** [Line2D](https://matplotlib.org/stable/api/_as_gen/matplotlib.lines.Line2D.html)

### 46. Add text to an Axes

**Problem:** Place free text at a specific data coordinate.
**Trigger:** You need a simple label on the plot.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
ax.text(2, 5, "Peak region", fontsize=10)
plt.show()
```

**Minimal notes:** `text()` is for labels and short annotations. Choose coordinates carefully.
**Common bug:** Confusing data coordinates with axes coordinates.
**Official Documentation URL:** [text](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html)

### 47. Annotate a point with an arrow

**Problem:** Call out a specific data point.
**Trigger:** You need a label connected to a plotted value.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
ax.annotate("max", xy=(3, 9), xytext=(2.2, 8),
            arrowprops=dict(arrowstyle="->"))
plt.show()
```

**Minimal notes:** `annotate()` is the standard callout API. It handles arrows and offset labels together.
**Common bug:** Placing annotation text directly on top of the data point.
**Official Documentation URL:** [annotate](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.annotate.html)

### 48. Render mathematical expressions

**Problem:** Include formula-like text in labels or annotations.
**Trigger:** You need TeX-style math in a figure.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9], label=r"$y = x^2$")
ax.set_title(r"Model: $f(x)$")
ax.legend()
plt.show()
```

**Minimal notes:** Use raw strings for math text. Math rendering works in titles, labels, and annotations.
**Common bug:** Forgetting raw string prefixes and escaping backslashes incorrectly.
**Official Documentation URL:** [mathtext](https://matplotlib.org/stable/users/explain/text/mathtext.html)

### 49. Use LaTeX rendering

**Problem:** Render full LaTeX text in a figure.
**Trigger:** You need document-quality math or serif typography.
**Snippet:**

```python
import matplotlib as mpl
import matplotlib.pyplot as plt

mpl.rcParams["text.usetex"] = False

fig, ax = plt.subplots()
ax.set_title(r"Inline math: $\alpha + \beta$")
ax.plot([1, 2, 3], [1, 4, 9])
plt.show()
```

**Minimal notes:** Native mathtext is usually enough and avoids external LaTeX dependencies. Enable full LaTeX only when your environment supports it.
**Common bug:** Turning on `text.usetex` in environments without a LaTeX installation.
**Official Documentation URL:** [text.usetex](https://matplotlib.org/stable/tutorials/text/usetex.html)

## Layout and composition

### 50. Use tight layout

**Problem:** Reduce overlapping labels automatically.
**Trigger:** Labels, titles, or tick labels crowd the figure edges.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 1)
axs[^0].set_title("Top panel")
axs[^1].set_xlabel("X axis")
fig.tight_layout()
plt.show()
```

**Minimal notes:** `tight_layout()` is a quick spacing fix. It works well for many simple figures.
**Common bug:** Using it when a more complex layout engine is needed.
**Official Documentation URL:** [tight_layout](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.tight_layout.html)

### 51. Use constrained layout

**Problem:** Let Matplotlib manage figure spacing robustly.
**Trigger:** You want automatic spacing for multi-panel figures.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 2, layout="constrained")
for ax in axs.ravel():
    ax.plot([1, 2, 3], [1, 4, 9])
plt.show()
```

**Minimal notes:** `layout="constrained"` is the modern default choice for many figures. It handles titles, labels, and colorbars well.
**Common bug:** Combining constrained layout with manual spacing tweaks that fight the engine.
**Official Documentation URL:** [constrained_layout](https://matplotlib.org/stable/tutorials/intermediate/constrainedlayout_guide.html)

### 52. Adjust subplot spacing manually

**Problem:** Fine-tune panel gaps yourself.
**Trigger:** The default spacing is close, but not perfect.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 2, figsize=(6, 4))
fig.subplots_adjust(wspace=0.3, hspace=0.4, left=0.08, right=0.98, top=0.92)
plt.show()
```

**Minimal notes:** `subplots_adjust()` is the manual spacing tool. Use it when automated layout is not enough.
**Common bug:** Overusing manual margins and breaking responsiveness.
**Official Documentation URL:** [subplots_adjust](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.subplots_adjust.html)

### 53. Share axes across subplots

**Problem:** Keep scales aligned across panels.
**Trigger:** You compare multiple plots on the same x or y scale.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 1, sharex=True, figsize=(6, 4), layout="constrained")
axs[^0].plot([1, 2, 3], [1, 4, 9])
axs[^1].plot([1, 2, 3], [2, 3, 5])
plt.show()
```

**Minimal notes:** Shared axes help comparisons and reduce label clutter. Use them for small multiples.
**Common bug:** Accidentally hiding needed tick labels on shared subplots.
**Official Documentation URL:** [sharex](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.sharex.html)

### 54. Add an inset Axes

**Problem:** Show a zoomed detail inside a main plot.
**Trigger:** You need a close-up view without a separate figure.
**Snippet:**

```python
import matplotlib.pyplot as plt
from mpl_toolkits.axes_grid1.inset_locator import inset_axes

fig, ax = plt.subplots()
ax.plot([1, 2, 3, 4], [1, 4, 9, 16])

axins = inset_axes(ax, width="40%", height="40%", loc="upper left")
axins.plot([1, 2, 3], [1, 4, 9])
plt.show()
```

**Minimal notes:** Insets are useful for detail views and zoom windows. Keep inset content simple.
**Common bug:** Making the inset too large and obscuring the main plot.
**Official Documentation URL:** [inset_axes](https://matplotlib.org/stable/api/_as_gen/mpl_toolkits.axes_grid1.inset_locator.inset_axes.html)

## Styling and colormaps

### 55. Apply a style sheet

**Problem:** Switch the global visual theme.
**Trigger:** You need a consistent publication or house style.
**Snippet:**

```python
import matplotlib.pyplot as plt

plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
plt.show()
```

**Minimal notes:** Styles are the fastest way to change defaults. Apply them before creating figures.
**Common bug:** Mixing multiple style changes without knowing which one wins.
**Official Documentation URL:** [style.use](https://matplotlib.org/stable/api/style_api.html#matplotlib.style.use)

### 56. Update rcParams

**Problem:** Set defaults for the whole session or script.
**Trigger:** You want repeatable styling across many plots.
**Snippet:**

```python
import matplotlib as mpl
import matplotlib.pyplot as plt

mpl.rcParams.update({
    "figure.dpi": 150,
    "axes.grid": True,
    "lines.linewidth": 2,
})

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
plt.show()
```

**Minimal notes:** `rcParams` are session-wide defaults. Set only the parameters you need.
**Common bug:** Mutating global defaults in shared notebook state and affecting later plots.
**Official Documentation URL:** [rcParams](https://matplotlib.org/stable/tutorials/introductory/customizing.html)

### 57. Use a temporary style context

**Problem:** Apply styling only inside a block.
**Trigger:** You want local changes without global side effects.
**Snippet:**

```python
import matplotlib.pyplot as plt

with plt.style.context("ggplot"):
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3], [1, 4, 9])
    plt.show()
```

**Minimal notes:** Context managers keep style changes contained. This is safer in reusable code.
**Common bug:** Leaving global style changes active after the plot is created.
**Official Documentation URL:** [style.context](https://matplotlib.org/stable/api/style_api.html#matplotlib.style.context)

### 58. Select line and marker styles

**Problem:** Tune the appearance of a plotted series.
**Trigger:** You need publication-friendly line emphasis.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9], color="tab:blue", linestyle="--", marker="o", linewidth=2, alpha=0.8)
plt.show()
```

**Minimal notes:** Line style, marker, width, color, and alpha cover most appearance needs. Keep styling consistent across series.
**Common bug:** Overusing markers on dense line charts.
**Official Documentation URL:** [plot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html)

### 59. Use a property cycler

**Problem:** Cycle through a custom set of colors or styles.
**Trigger:** You have multiple series and want consistent styling.
**Snippet:**

```python
import matplotlib.pyplot as plt
from cycler import cycler

fig, ax = plt.subplots()
ax.set_prop_cycle(cycler(color=["#4C78A8", "#F58518", "#54A24B"]))
for i in range(3):
    ax.plot([1, 2, 3], [j + i for j in [1, 4, 9]])
plt.show()
```

**Minimal notes:** Property cycling keeps multi-series plots visually organized. It is especially useful for repeated dashboards.
**Common bug:** Manually setting every series color and losing consistency.
**Official Documentation URL:** [set_prop_cycle](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_prop_cycle.html)

### 60. Use built-in colormaps

**Problem:** Choose a standard color gradient.
**Trigger:** You need a named colormap for an image or contour plot.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

data = np.random.default_rng(0).random((20, 20))
fig, ax = plt.subplots()
im = ax.imshow(data, cmap="viridis")
fig.colorbar(im, ax=ax)
plt.show()
```

**Minimal notes:** Use named built-in colormaps for portability and clarity. Prefer perceptually uniform maps for scalar data.
**Common bug:** Using rainbow-style maps for data that needs ordered perception.
**Official Documentation URL:** [colormaps](https://matplotlib.org/stable/users/explain/colors/colormaps.html)

### 61. Normalize a colormap

**Problem:** Map values into a specific color scaling range.
**Trigger:** You need linear, logarithmic, or centered color mapping.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import Normalize

data = np.linspace(0, 100, 100).reshape(10, 10)

fig, ax = plt.subplots()
im = ax.imshow(data, cmap="viridis", norm=Normalize(vmin=0, vmax=100))
fig.colorbar(im, ax=ax)
plt.show()
```

**Minimal notes:** Normalization controls how data maps into colors. Use it explicitly when figures must be comparable.
**Common bug:** Comparing two heatmaps with different implicit scaling.
**Official Documentation URL:** [Normalize](https://matplotlib.org/stable/api/_as_gen/matplotlib.colors.Normalize.html)

### 62. Use discrete color bins

**Problem:** Show binned or categorical scalar levels.
**Trigger:** Continuous shading is too detailed for the message.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import BoundaryNorm

data = np.random.default_rng(0).random((20, 20)) * 4
bounds = [0, 1, 2, 3, 4]
norm = BoundaryNorm(bounds, ncolors=256)

fig, ax = plt.subplots()
im = ax.imshow(data, cmap="viridis", norm=norm)
fig.colorbar(im, ax=ax, boundaries=bounds)
plt.show()
```

**Minimal notes:** Discrete bins make thresholds explicit. They are useful for regimes or severity levels.
**Common bug:** Forgetting to align the colorbar boundaries with the bin edges.
**Official Documentation URL:** [BoundaryNorm](https://matplotlib.org/stable/api/_as_gen/matplotlib.colors.BoundaryNorm.html)

## Date and time axes

### 63. Plot datetime values

**Problem:** Render time-series with actual dates.
**Trigger:** Your x-axis uses Python datetime objects.
**Snippet:**

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta

dates = [datetime(2026, 1, 1) + timedelta(days=i) for i in range(10)]
values = [i * i for i in range(10)]

fig, ax = plt.subplots()
ax.plot(dates, values)
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %d"))
fig.autofmt_xdate()
plt.show()
```

**Minimal notes:** Matplotlib handles datetime objects directly. Formatters and locators control readability.
**Common bug:** Letting date labels overlap on dense time axes.
**Official Documentation URL:** [DateFormatter](https://matplotlib.org/stable/api/dates_api.html#matplotlib.dates.DateFormatter)

### 64. Control date locators

**Problem:** Choose date tick spacing explicitly.
**Trigger:** Default date ticks are too sparse or too dense.
**Snippet:**

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta

dates = [datetime(2026, 1, 1) + timedelta(days=i) for i in range(90)]
values = [i % 10 for i in range(90)]

fig, ax = plt.subplots()
ax.plot(dates, values)
ax.xaxis.set_major_locator(mdates.MonthLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b"))
fig.autofmt_xdate()
plt.show()
```

**Minimal notes:** Locators choose tick positions and formatters choose labels. Use both together for clean time axes.
**Common bug:** Setting only the formatter and leaving poor tick spacing in place.
**Official Documentation URL:** [MonthLocator](https://matplotlib.org/stable/api/dates_api.html#matplotlib.dates.MonthLocator)

## Multiple axes and special placement

### 65. Use a broken-axis workflow

**Problem:** Show disjoint ranges without wasting space.
**Trigger:** One outlier range compresses the important region.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(6, 4),
                               gridspec_kw={"height_ratios": [1, 2]}, layout="constrained")
x = np.arange(10)
y = np.array([1, 2, 3, 4, 50, 51, 52, 53, 54, 55])

ax1.plot(x, y)
ax2.plot(x, y)
ax1.set_ylim(48, 56)
ax2.set_ylim(0, 5)
plt.show()
```

**Minimal notes:** A broken-axis effect is usually built from stacked axes. Keep the break visually obvious to avoid misreading.
**Common bug:** Using a broken axis without marking the discontinuity.
**Official Documentation URL:** [subplots](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html)

### 66. Add a colorbar

**Problem:** Interpret scalar color mapping.
**Trigger:** You use `imshow`, `contourf`, `pcolormesh`, or similar.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

data = np.random.default_rng(0).random((20, 20))
fig, ax = plt.subplots()
im = ax.imshow(data, cmap="viridis")
fig.colorbar(im, ax=ax, label="Intensity")
plt.show()
```

**Minimal notes:** Colorbars should be attached to the mappable object. Label the scale when the values matter.
**Common bug:** Creating a colorbar without passing the actual image or contour object.
**Official Documentation URL:** [colorbar](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.colorbar.html)

### 67. Add an inset indicator

**Problem:** Mark the zoomed region on the parent plot.
**Trigger:** You have an inset and need to show where it came from.
**Snippet:**

```python
import matplotlib.pyplot as plt
from mpl_toolkits.axes_grid1.inset_locator import inset_axes, mark_inset

fig, ax = plt.subplots()
ax.plot([1, 2, 3, 4], [1, 4, 9, 16])

axins = inset_axes(ax, width="40%", height="40%", loc="upper left")
axins.plot([1, 2, 3], [1, 4, 9])
mark_inset(ax, axins, loc1=2, loc2=4)
plt.show()
```

**Minimal notes:** Indicators connect inset and source region. They are common in publication figures.
**Common bug:** Forgetting to set the inset limits before drawing the connector.
**Official Documentation URL:** [mark_inset](https://matplotlib.org/stable/api/_as_gen/mpl_toolkits.axes_grid1.inset_locator.mark_inset.html)

## Export and file output

### 68. Save as PNG

**Problem:** Export a raster figure for reports or slides.
**Trigger:** You need a pixel-based image file.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(6, 4), dpi=150)
ax.plot([1, 2, 3], [1, 4, 9])
fig.savefig("figure.png", dpi=300)
```

**Minimal notes:** PNG is the common default for raster export. Set `dpi` explicitly for predictable output quality.
**Common bug:** Saving with low DPI and getting blurry text.
**Official Documentation URL:** [savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html)

### 69. Save as SVG

**Problem:** Export scalable vector graphics for editing or web.
**Trigger:** You need crisp line art at any zoom level.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
fig.savefig("figure.svg")
```

**Minimal notes:** SVG is useful for web and vector editors. It preserves scalable text and paths.
**Common bug:** Expecting SVG to behave like a raster image in every viewer.
**Official Documentation URL:** [savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html)

### 70. Save as PDF

**Problem:** Export a vector figure for papers and print.
**Trigger:** You need publication-ready document output.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
fig.savefig("figure.pdf")
```

**Minimal notes:** PDF is the standard vector export for many journals. It is often the safest archival format.
**Common bug:** Rasterizing the whole figure accidentally when vector output is desired.
**Official Documentation URL:** [savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html)

### 71. Save with transparent background

**Problem:** Place a figure over another background.
**Trigger:** You need a logo, overlay, or web asset.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
fig.savefig("figure.png", transparent=True)
```

**Minimal notes:** Transparency is useful for overlays and slides. Check that text remains readable on the target background.
**Common bug:** Exporting transparent figures with low-contrast labels.
**Official Documentation URL:** [savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html)

### 72. Save with tight bounding box

**Problem:** Trim extra whitespace around the figure.
**Trigger:** You need compact export output.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
fig.savefig("figure.png", bbox_inches="tight")
```

**Minimal notes:** `bbox_inches="tight"` is common for papers and reports. It trims surrounding whitespace.
**Common bug:** Cropping away annotation text placed near the edges.
**Official Documentation URL:** [savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html)

### 73. Add metadata when saving

**Problem:** Embed author or title information in output files.
**Trigger:** You need tracked or publication metadata.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
fig.savefig("figure.pdf", metadata={"Title": "Example Figure", "Author": "AENS"})
```

**Minimal notes:** Metadata is supported on several output formats. Use it for document management and provenance.
**Common bug:** Assuming every format stores the same metadata keys.
**Official Documentation URL:** [savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html)

## Performance and memory

### 74. Rasterize dense artists in vector output

**Problem:** Keep vector exports small and fast.
**Trigger:** Your figure has huge scatter or heatmap layers.
**Snippet:**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(size=200000)
y = rng.normal(size=200000)

fig, ax = plt.subplots()
sc = ax.scatter(x, y, s=1, rasterized=True)
fig.savefig("dense.pdf")
plt.show()
```

**Minimal notes:** Rasterization is useful inside PDF or SVG when a layer is too dense. Keep text and axes vector while rasterizing only heavy artists.
**Common bug:** Rasterizing the entire figure instead of only the dense layer.
**Official Documentation URL:** [set_rasterized](https://matplotlib.org/stable/api/_as_gen/matplotlib.artist.Artist.set_rasterized.html)

### 75. Simplify paths for large plots

**Problem:** Reduce draw cost for long line series.
**Trigger:** You plot very dense polylines.
**Snippet:**

```python
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np

mpl.rcParams["path.simplify"] = True
mpl.rcParams["path.simplify_threshold"] = 0.5

x = np.linspace(0, 1000, 200000)
y = np.sin(x)

fig, ax = plt.subplots()
ax.plot(x, y)
plt.show()
```

**Minimal notes:** Path simplification can speed up rendering for dense lines. Keep the threshold conservative.
**Common bug:** Simplifying too aggressively and altering important detail.
**Official Documentation URL:** [path.simplify](https://matplotlib.org/stable/users/explain/artists/performance.html)

### 76. Reuse figures in loops

**Problem:** Generate many similar plots efficiently.
**Trigger:** You are batch-rendering charts.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
for i in range(3):
    ax.clear()
    ax.plot([1, 2, 3], [j + i for j in [1, 4, 9]])
    fig.canvas.draw()
```

**Minimal notes:** Reusing the same figure can be faster than recreating it repeatedly. Clear the Axes between draws.
**Common bug:** Forgetting to clear the Axes and accumulating old lines.
**Official Documentation URL:** [clear](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.clear.html)

### 77. Use interactive callbacks efficiently

**Problem:** Update plots in response to user actions.
**Trigger:** You need live interaction or GUI-driven plots.
**Snippet:**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
line, = ax.plot([1, 2, 3], [1, 4, 9])

def on_click(event):
    if event.inaxes == ax:
        line.set_ydata([1, 2, 3])
        fig.canvas.draw_idle()

fig.canvas.mpl_connect("button_press_event", on_click)
plt.show()
```

**Minimal notes:** Use `draw_idle()` for event-driven updates. Keep callback work small.
**Common bug:** Doing heavy computation directly inside GUI event handlers.
**Official Documentation URL:** [mpl_connect](https://matplotlib.org/stable/api/backend_bases_api.html#matplotlib.backend_bases.FigureCanvasBase.mpl_connect)

## Animation and interactivity

### 78. Create a FuncAnimation

**Problem:** Animate changing plot data over time.
**Trigger:** You need frame-by-frame updates from a function.
**Snippet:**

```python
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import numpy as np

fig, ax = plt.subplots()
x = np.linspace(0, 2 * np.pi, 200)
line, = ax.plot(x, np.sin(x))

def update(frame):
    line.set_ydata(np.sin(x + frame / 10))
    return line,

ani = FuncAnimation(fig, update, frames=60, interval=30, blit=True)
plt.show()
```

**Minimal notes:** `FuncAnimation` is the standard dynamic animation API. Return the modified artists for blitting.
**Common bug:** Not retaining a reference to the animation object.
**Official Documentation URL:** [FuncAnimation](https://matplotlib.org/stable/api/_as_gen/matplotlib.animation.FuncAnimation.html)

### 79. Create an ArtistAnimation

**Problem:** Animate a sequence of prebuilt frames.
**Trigger:** Your frames already exist as artists.
**Snippet:**

```python
import matplotlib.pyplot as plt
from matplotlib.animation import ArtistAnimation

fig, ax = plt.subplots()
frames = []
for i in range(3):
    art = ax.plot([1, 2, 3], [1 + i, 4 + i, 9 + i], color="tab:blue")
    frames.append(art)

ani = ArtistAnimation(fig, frames, interval=300, blit=True)
plt.show()
```

**Minimal notes:** `ArtistAnimation` is suitable when frames are already available. It is less flexible than `FuncAnimation`.
**Common bug:** Generating too many artists and using excessive memory.
**Official Documentation URL:** [ArtistAnimation](https://matplotlib.org/stable/api/_as_gen/matplotlib.animation.ArtistAnimation.html)

### 80. Save an animation

**Problem:** Export an animation to a file.
**Trigger:** You need MP4 or GIF output from a Matplotlib animation.
**Snippet:**

```python
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import numpy as np

fig, ax = plt.subplots()
x = np.linspace(0, 2 * np.pi, 200)
line, = ax.plot(x, np.sin(x))

def update(frame):
    line.set_ydata(np.sin(x + frame / 10))
    return line,

ani = FuncAnimation(fig, update, frames=30, interval=30, blit=True)
ani.save("anim.gif", writer="pillow", fps=20)
```

**Minimal notes:** Choose the writer based on your environment. Saving animation usually requires an installed encoder or Pillow.
**Common bug:** Trying to save without a supported writer installed.
**Official Documentation URL:** [save](https://matplotlib.org/stable/api/_as_gen/matplotlib.animation.Animation.html#matplotlib.animation.Animation.save)

## Quick reference tables

### Figure and Axes

| Task | Preferred API | Notes |
| :-- | :-- | :-- |
| Create a standard plot | `plt.subplots()` | Best default OO entry point. |
| Create a custom canvas | `plt.figure()` + `fig.add_subplot()` | Use when layout is manual. |
| Add panels with spans | `fig.add_gridspec()` | Best for asymmetric layouts. |
| Create nested layouts | `fig.subfigures()` | Good for grouped sections. |

### Common plot functions

| Task | Axes method |
| :-- | :-- |
| Line | `ax.plot()` |
| Scatter | `ax.scatter()` |
| Bar | `ax.bar()` |
| Horizontal bar | `ax.barh()` |
| Histogram | `ax.hist()` |
| Pie | `ax.pie()` |
| Box | `ax.boxplot()` |
| Violin | `ax.violinplot()` |
| Step | `ax.step()` |
| Stem | `ax.stem()` |
| Error bars | `ax.errorbar()` |

### Layout APIs

| Task | API |
| :-- | :-- |
| Automatic spacing | `layout="constrained"` |
| Quick spacing fix | `fig.tight_layout()` |
| Manual panel spacing | `fig.subplots_adjust()` |
| Named panel layouts | `plt.subplot_mosaic()` |
| Spanning panels | `fig.add_gridspec()` |

### Legend locations

| Location | Typical use |
| :-- | :-- |
| `upper right` | Default when plot area is free. |
| `upper left` | Common for trend plots. |
| `lower right` | Good when upper area is dense. |
| `outside right upper` | Multi-panel figures with constrained layout. |
| `outside upper right` | Shared figure legend above axes. |

### Tick locators and formatters

| Task | API |
| :-- | :-- |
| Monthly ticks | `mdates.MonthLocator()` |
| Date labels | `mdates.DateFormatter()` |
| Manual ticks | `ax.set_xticks()` / `ax.set_yticks()` |
| Tick appearance | `ax.tick_params()` |

### Color and colormap tools

| Task | API |
| :-- | :-- |
| Continuous mapping | `cmap="viridis"` |
| Linear scaling | `Normalize()` |
| Threshold bins | `BoundaryNorm()` |
| Colorbar | `fig.colorbar()` |
| Discrete levels | `contourf(..., levels=...)` |

### Export formats

| Format | Use |
| :-- | :-- |
| PNG | Raster reports and slides. |
| SVG | Web and vector editing. |
| PDF | Papers and print. |
| TIFF | Publication workflows that require it. |

## Common errors

| Error | Cause | Solution |
| :-- | :-- | :-- |
| Figure not displayed | Missing `show()` in script workflow. | Call `plt.show()` after building the figure. |
| Overlapping labels | Figure too small or layout not managed. | Use `layout="constrained"` or `fig.tight_layout()`. |
| Empty legend | Artists have no labels. | Add labels when creating the artists. |
| Incorrect axis limits | Limits set too early or too narrowly. | Set limits after plotting and verify units. |
| Memory leak from unclosed figures | Many figures left open in loops. | Call `plt.close(fig)` after saving or displaying. |
| Blurry exported images | Low DPI or wrong export size. | Increase `dpi` and figure size before saving. |
| Backend errors | Unsupported GUI backend or missing display. | Use a suitable backend for the environment. |

## Performance checklist

- Prefer `Axes` methods over repeated stateful pyplot calls.
- Close figures after saving in batch jobs.
- Rasterize dense scatter, image, or contour layers in vector exports.
- Simplify long line paths when plots are visually unchanged.
- Reuse a figure in loops when generating many similar charts.
- Use a suitable backend for interactive sessions and scripts.
- Keep callbacks lightweight in interactive plots.
- Prefer smaller datasets or downsample before plotting when possible.


## Production checklist

- Use the OO API by default.
- Set explicit figure size and DPI for final output.
- Use readable labels, units, and titles.
- Keep layouts consistent with `constrained_layout` or a controlled alternative.
- Choose colorblind-safe, distinguishable colors.
- Verify exports in the target format before release.
- Save vector formats for publication when appropriate.
- Avoid duplicate legends, ambiguous scales, and overdecorated plots.
- Close figures in automation and notebooks when done.
- Keep snippets stable, runnable, and import complete.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^2][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: CURRENT_PROJECT_STATE_REPORT.md

[^3]: CONTENT_QUALITY_STANDARD.md

[^4]: ARCHITECTURE_FREEZE.md

[^5]: AENS-Knowledge-Layer-Specification.md

[^6]: http://arxiv.org/pdf/1910.00279.pdf

[^7]: https://matplotlib.org/stable/release/release_notes.html

[^8]: https://matplotlib.org/stable/users/release_notes

[^9]: https://matplotlib.org/stable/users/release_notes.html

[^10]: https://matplotlib.org/stable/release/prev_whats_new/whats_new_3.11.0.html

[^11]: https://matplotlib.org/stable/release/prev_whats_new/whats_new_3.10.0.html

[^12]: https://chrisholdgraf.com/matplotlib/api/_as_gen/matplotlib.figure.Figure.html

[^13]: https://github.com/matplotlib/matplotlib.github.com/blob/main/versions.html

[^14]: https://matplotlib.org/stable/release/prev_whats_new/whats_new_3.8.0.html

[^15]: https://matplotlib.org/stable/release/prev_whats_new/whats_new_3.5.0.html

[^16]: https://matplotlib.org/stable/index.html

