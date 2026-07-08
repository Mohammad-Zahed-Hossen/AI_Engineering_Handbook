<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# expand this into a 60+ entry file with one dedicated entry per chart (fully enumerated),

```md
---
id: plotly-express-cheatsheet-2026-07-06
title: Plotly Express Cheatsheet — 60+ Production Entries
slug: plotly-express-cheatsheet
name: plotly.express Cheatsheet
description: Canonical Plotly Express cheatsheet for AENS, focused on syntax recall, production workflows, and copy-paste snippets for plotly.py 6.8.0.
package_reference: plotly.express (plotly.py)
version: 6.8.0
sources:
  - https://plotly.com/python-api-reference/plotly.express.html
  - https://plotly.com/python-api-reference/generated/plotly.express.scatter.html
  - https://plotly.com/python-api-reference/generated/plotly.express.line.html
  - https://plotly.com/python-api-reference/generated/plotly.express.imshow.html
created_at: 2026-07-06
updated_at: 2026-07-06
---

# Plotly Express Cheatsheet

Plotly Express is Plotly’s high-level API for rapid figure generation. This cheatsheet is organized by engineering task, not by concept, and keeps each entry focused on one recall target only. [web:24][web:25]

## Imports & defaults

### 1. Initialize Plotly Express defaults
**Problem:** Set global figure defaults for a project.  
**Trigger:** When starting a notebook, script, or service that creates many figures.  
**Snippet:**
```python
import plotly.express as px
import plotly.io as pio

px.defaults.template = "plotly_white"
px.defaults.width = 900
px.defaults.height = 540
pio.renderers.default = "notebook"
fig = px.scatter(px.data.iris(), x="sepal_width", y="sepal_length", color="species")
fig.show()
```

**Minimal Notes:** Set defaults once per process. Use a shared template for consistency. [web:24]
**Common Bug:** Forgetting the renderer in headless or notebook environments.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 2. Create a figure from a pandas DataFrame

**Problem:** Build a chart from tidy tabular data.
**Trigger:** When your input is a DataFrame with one row per observation.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.show()
```

**Minimal Notes:** DataFrame columns map directly to arguments. This is the default workflow. [web:25]
**Common Bug:** Passing column names without a DataFrame.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 3. Use array-like inputs without a DataFrame

**Problem:** Plot quick data without constructing a DataFrame first.
**Trigger:** When values already exist as lists, numpy arrays, or Series.
**Snippet:**

```python
import plotly.express as px
import numpy as np

x = np.arange(10)
y = np.array()[^1][^2][^3][^4][^5][^6][^7][^8][^9][^10]
fig = px.line(x=x, y=y, title="Array input")
fig.show()
```

**Minimal Notes:** Array-like inputs are converted internally. A DataFrame is still better for multi-encoding workflows. [web:25]
**Common Bug:** Expecting column-name behavior without providing a DataFrame.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

### 4. Use wide-format data

**Problem:** Plot multiple series from wide columns.
**Trigger:** When each metric already lives in its own column.
**Snippet:**

```python
import plotly.express as px
import pandas as pd
import numpy as np

df = pd.DataFrame({"x": np.arange(6), "a":, "b": })[^4][^5][^6][^7][^9]
fig = px.line(df, x="x", y=["a", "b"], title="Wide format line")
fig.show()
```

**Minimal Notes:** Passing a list to x or y switches the figure into wide mode. Keep series names meaningful. [web:25]
**Common Bug:** Forgetting that wide mode changes the legend and trace splitting behavior.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

### 5. Use tidy long-form data

**Problem:** Plot the same measure across categories in one column.
**Trigger:** When your data is already normalized into variable/value columns.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex", title="Long-form bar")
fig.show()
```

**Minimal Notes:** Long-form is the safest default for px. It scales well to faceting and animation. [web:24]
**Common Bug:** Trying to encode multiple wide columns when the data is already long.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

## Core Cartesian charts

### 6. Create a customized scatter plot

**Problem:** Show relationships with color, size, hover fields, and labels.
**Trigger:** When exploring two continuous variables with extra encodings.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(
    df,
    x="sepal_width",
    y="sepal_length",
    color="species",
    size="petal_length",
    hover_name="species",
    hover_data=["petal_width"],
    title="Customized scatter"
)
fig.show()
```

**Minimal Notes:** Scatter is the most common px entry point. Use hover_data for extra context. [web:25]
**Common Bug:** Over-encoding too many variables and making the plot unreadable.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 7. Create a large scatter plot with WebGL

**Problem:** Keep point rendering responsive for large datasets.
**Trigger:** When plotting thousands of markers.
**Snippet:**

```python
import plotly.express as px
import pandas as pd
import numpy as np

df = pd.DataFrame({"x": np.random.randn(50000), "y": np.random.randn(50000)})
fig = px.scatter(df, x="x", y="y", render_mode="webgl", opacity=0.55, title="WebGL scatter")
fig.show()
```

**Minimal Notes:** Use webgl for large point counts. It improves interactivity but reduces pure vector output. [web:25]
**Common Bug:** Assuming WebGL solves every performance issue in very large figures.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 8. Create a line chart

**Problem:** Show ordered values over time or another continuous axis.
**Trigger:** When one dimension must be connected in sequence.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("country == 'Canada'")
fig = px.line(df, x="year", y="lifeExp", title="Canada life expectancy")
fig.show()
```

**Minimal Notes:** line supports wide and long data. Use markers only when you need discrete points visible. [web:25]
**Common Bug:** Using line charts for unordered categories.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

### 9. Create a line chart with markers

**Problem:** Show trends while keeping individual observations visible.
**Trigger:** When each sampled point matters.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("country == 'Canada'")
fig = px.line(df, x="year", y="lifeExp", markers=True, title="Line with markers")
fig.show()
```

**Minimal Notes:** markers=True adds visible vertices. Useful for sparse time series. [web:25]
**Common Bug:** Turning on markers for dense series and cluttering the plot.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

### 10. Create an area chart

**Problem:** Show cumulative or filled time-series style data.
**Trigger:** When filled lines communicate magnitude better than plain lines.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("continent == 'Asia' and year >= 1970")
fig = px.area(df, x="year", y="pop", color="country", title="Area chart")
fig.show()
```

**Minimal Notes:** Area is a filled line workflow. Use with care when multiple series overlap. [web:24]
**Common Bug:** Stacking many filled series without checking legend order.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 11. Create a grouped bar chart

**Problem:** Compare category totals side by side.
**Trigger:** When summarizing categorical metrics across groups.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex", barmode="group", title="Grouped bars")
fig.show()
```

**Minimal Notes:** Use color plus barmode='group' for side-by-side comparison. This is a standard reporting chart. [web:24]
**Common Bug:** Forgetting to aggregate when raw rows should be summarized first.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 12. Create a stacked bar chart

**Problem:** Show part-to-whole composition within each category.
**Trigger:** When the total and its components both matter.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex", barmode="stack", title="Stacked bars")
fig.show()
```

**Minimal Notes:** Stacking works best when categories are few. Use category_orders to control order. [web:24]
**Common Bug:** Stacking too many categories and hiding differences.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 13. Create a horizontal bar chart

**Problem:** Improve readability for long category labels.
**Trigger:** When category names are too long for vertical bars.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips().groupby("day", as_index=False)["total_bill"].sum()
fig = px.bar(df, x="total_bill", y="day", orientation="h", title="Horizontal bars")
fig.show()
```

**Minimal Notes:** orientation='h' flips the axes. This is useful for ranked lists. [web:25]
**Common Bug:** Forgetting to swap x and y when changing orientation.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 14. Create a bar chart with labels

**Problem:** Show values directly on bars.
**Trigger:** When the chart will be read without tooltips.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips().groupby("day", as_index=False)["total_bill"].sum()
fig = px.bar(df, x="day", y="total_bill", text_auto=True, title="Bars with labels")
fig.update_traces(textposition="outside")
fig.show()
```

**Minimal Notes:** text_auto is a fast way to add readable labels. Use it for summary charts. [web:24]
**Common Bug:** Labels collide on small figures without enough margin.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 15. Create a funnel chart

**Problem:** Show stage-by-stage drop-off.
**Trigger:** When modeling pipelines, conversions, or process steps.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({"stage": ["Visit", "Sign up", "Trial", "Purchase"], "count": })
fig = px.funnel(df, x="count", y="stage", title="Funnel")
fig.show()
```

**Minimal Notes:** Funnel uses ordered stages. It is best for linear progression. [web:24]
**Common Bug:** Reordering stages incorrectly and changing the meaning.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 16. Create a funnel area chart

**Problem:** Compare funnel stages with area emphasis.
**Trigger:** When visual emphasis should widen or narrow by stage value.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({"stage": ["Visit", "Sign up", "Trial", "Purchase"], "count": })
fig = px.funnel_area(df, names="stage", values="count", title="Funnel area")
fig.show()
```

**Minimal Notes:** funnel_area is useful for compact stage comparison. Keep stage count small. [web:24]
**Common Bug:** Treating funnel area as an exact quantitative chart.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 17. Create a timeline chart

**Problem:** Show task durations with start and end dates.
**Trigger:** When visualizing schedules or project timelines.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame([
    {"task": "Design", "start": "2026-01-01", "finish": "2026-01-20"},
    {"task": "Build", "start": "2026-01-15", "finish": "2026-02-28"},
    {"task": "Launch", "start": "2026-03-01", "finish": "2026-03-10"},
])
fig = px.timeline(df, x_start="start", x_end="finish", y="task", title="Project timeline")
fig.update_yaxes(autorange="reversed")
fig.show()
```

**Minimal Notes:** Use x_start and x_end. Reverse the y-axis for conventional Gantt ordering. [web:24]
**Common Bug:** Leaving date strings unparsed when the input is inconsistent.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 18. Create a scatter plot with error bars

**Problem:** Show uncertainty or measurement variation.
**Trigger:** When values have known error ranges.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({"x":, "y": [2.2, 2.8, 3.6], "err": [0.2, 0.3, 0.15]})[^6][^9][^4]
fig = px.scatter(df, x="x", y="y", error_y="err", title="Scatter with error bars")
fig.show()
```

**Minimal Notes:** Use error_x and error_y for uncertainty ranges. Symmetric bars are the default. [web:25]
**Common Bug:** Mixing absolute and relative error values without documenting the units.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 19. Create a line chart with asymmetric error bars

**Problem:** Show separate positive and negative uncertainty.
**Trigger:** When lower and upper confidence bounds differ.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    "x":,[^9][^4][^6]
    "y":,[^10][^11][^12]
    "plus": [1.0, 0.8, 1.2],
    "minus": [0.5, 0.6, 0.4],
})
fig = px.line(df, x="x", y="y", error_y="plus", error_y_minus="minus", title="Asymmetric error bars")
fig.show()
```

**Minimal Notes:** Use *_minus columns for asymmetric bars. This is the cleanest px interface for bounds. [web:25]
**Common Bug:** Reversing positive and negative error columns.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

## Distributions

### 20. Create a histogram

**Problem:** Show the distribution of a single numeric variable.
**Trigger:** When you need frequency counts or binning.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.histogram(df, x="total_bill", nbins=30, title="Histogram")
fig.show()
```

**Minimal Notes:** Histogram is the default distribution chart. Adjust bins for readability. [web:24]
**Common Bug:** Comparing raw distributions without normalizing or grouping when needed.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 21. Create a normalized histogram

**Problem:** Compare distributions by percentage instead of counts.
**Trigger:** When groups have different sample sizes.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.histogram(df, x="total_bill", color="sex", histnorm="percent", barmode="overlay", opacity=0.6, title="Percent histogram")
fig.show()
```

**Minimal Notes:** histnorm controls the y-axis meaning. Overlay plus opacity is common for comparisons. [web:25]
**Common Bug:** Reading normalized histograms as if they were raw counts.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 22. Create a histogram with marginal rug

**Problem:** Add raw-value context to a distribution plot.
**Trigger:** When you want the histogram plus data density hints.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.histogram(df, x="total_bill", marginal="rug", title="Histogram with rug")
fig.show()
```

**Minimal Notes:** Marginal plots are compact and useful for quick diagnostics. Rug shows individual samples. [web:25]
**Common Bug:** Using too many marginal layers and cluttering the view.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 23. Create a box plot

**Problem:** Compare quartiles and outliers across categories.
**Trigger:** When summarizing distribution shape.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.box(df, x="day", y="total_bill", color="sex", title="Box plot")
fig.show()
```

**Minimal Notes:** Box plots are efficient for group comparisons. Use category_orders for stable ordering. [web:24]
**Common Bug:** Interpreting sparse categories as statistically meaningful.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 24. Create a violin plot with points

**Problem:** Show distribution shape plus raw samples.
**Trigger:** When you want a richer view than a box plot.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.violin(df, x="day", y="total_bill", box=True, points="all", color="sex", title="Violin plot")
fig.show()
```

**Minimal Notes:** box=True and points="all" are the common production combination. Use opacity carefully. [web:24]
**Common Bug:** Overplotting too many raw points on large datasets.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 25. Create a strip plot

**Problem:** Show individual observations without aggregation.
**Trigger:** When each row is important and categories are few.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.strip(df, x="day", y="total_bill", color="sex", title="Strip plot")
fig.show()
```

**Minimal Notes:** Strip plots are useful for small-to-medium samples. They complement box and violin charts. [web:24]
**Common Bug:** Using strip plots on very large datasets without jitter control.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 26. Create an ECDF plot

**Problem:** Show cumulative distribution without binning.
**Trigger:** When comparing percentiles or distribution dominance.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.ecdf(df, x="total_bill", color="sex", title="ECDF")
fig.show()
```

**Minimal Notes:** ECDF is a good alternative to histograms for precise cumulative comparison. It preserves sample ordering. [web:24]
**Common Bug:** Using ECDF when the audience expects frequency bins.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 27. Create a density heatmap

**Problem:** Show 2D concentration for large scatter clouds.
**Trigger:** When scatter points overlap heavily.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.density_heatmap(df, x="sepal_width", y="sepal_length", nbinsx=40, nbinsy=40, title="Density heatmap")
fig.show()
```

**Minimal Notes:** Density heatmap bins points into a grid. It is useful for crowded relationships. [web:24]
**Common Bug:** Choosing bins too coarse or too fine for the data scale.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 28. Create a density contour plot

**Problem:** Show isolines of concentration in 2D.
**Trigger:** When you need density structure instead of filled bins.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.density_contour(df, x="sepal_width", y="sepal_length", color="species", title="Density contour")
fig.show()
```

**Minimal Notes:** Density contours are useful for smooth cluster structure. Pair with scatter only when necessary. [web:24]
**Common Bug:** Overlaying too many contours and making the figure hard to parse.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

## Hierarchical charts

### 29. Create a pie chart

**Problem:** Show simple part-to-whole composition.
**Trigger:** When there are few categories and totals matter.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips().groupby("day", as_index=False)["total_bill"].sum()
fig = px.pie(df, names="day", values="total_bill", title="Pie chart")
fig.show()
```

**Minimal Notes:** Pie charts should stay simple. Use only for small category counts. [web:24]
**Common Bug:** Using pie charts with many slices or similar values.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 30. Create a donut chart

**Problem:** Show part-to-whole with center space.
**Trigger:** When a pie chart needs a label area or visual emphasis.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips().groupby("day", as_index=False)["total_bill"].sum()
fig = px.pie(df, names="day", values="total_bill", hole=0.4, title="Donut chart")
fig.show()
```

**Minimal Notes:** hole creates the donut shape. Keep labels concise. [web:24]
**Common Bug:** Treating donut holes as extra data space instead of decoration.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 31. Create a sunburst chart

**Problem:** Show hierarchical totals in radial form.
**Trigger:** When you need nested categories with parent-child structure.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips().groupby(["day", "sex"], as_index=False)["total_bill"].sum()
fig = px.sunburst(df, path=["day", "sex"], values="total_bill", title="Sunburst")
fig.show()
```

**Minimal Notes:** Use path for hierarchy. Values control sector size. [web:24]
**Common Bug:** Mixing incompatible hierarchy columns or missing parents.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 32. Create a treemap

**Problem:** Show hierarchical composition in nested rectangles.
**Trigger:** When the hierarchy is deep and labels must remain compact.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips().groupby(["day", "sex"], as_index=False)["total_bill"].sum()
fig = px.treemap(df, path=["day", "sex"], values="total_bill", title="Treemap")
fig.show()
```

**Minimal Notes:** Treemaps are compact hierarchical summaries. They are usually denser than sunburst charts. [web:24]
**Common Bug:** Using treemaps for precise comparison of many similar values.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 33. Create an icicle chart

**Problem:** Show hierarchy with top-down rectangular levels.
**Trigger:** When hierarchy depth is important and a top-down layout helps.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips().groupby(["day", "sex"], as_index=False)["total_bill"].sum()
fig = px.icicle(df, path=["day", "sex"], values="total_bill", title="Icicle")
fig.show()
```

**Minimal Notes:** Icicles are useful for clear level separation. Use them for tree-like breakdowns. [web:24]
**Common Bug:** Supplying an unbalanced hierarchy and expecting equal visual depth.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

## Multivariate exploration

### 34. Create a scatter matrix

**Problem:** Inspect pairwise relationships across several numeric variables.
**Trigger:** When you need a quick multivariate overview.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter_matrix(
    df,
    dimensions=["sepal_length", "sepal_width", "petal_length", "petal_width"],
    color="species",
    title="Scatter matrix"
)
fig.show()
```

**Minimal Notes:** Limit dimensions to a small set of useful columns. SPLOMs get crowded fast. [web:24]
**Common Bug:** Using too many dimensions and losing readability.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 35. Create parallel coordinates

**Problem:** Compare many continuous variables per row.
**Trigger:** When you need a compact multivariate line view.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.parallel_coordinates(df, color="sepal_length", title="Parallel coordinates")
fig.show()
```

**Minimal Notes:** Color can be numeric for continuous encoding. This is useful for feature comparison. [web:24]
**Common Bug:** Forgetting that many rows can make the lines unreadable.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 36. Create parallel categories

**Problem:** Show categorical relationships across multiple dimensions.
**Trigger:** When comparing category flows or attribute combinations.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.parallel_categories(df, dimensions=["day", "time", "sex", "smoker"], title="Parallel categories")
fig.show()
```

**Minimal Notes:** This is the categorical companion to parallel coordinates. Keep dimensions small. [web:24]
**Common Bug:** Adding too many categories and creating spaghetti-like flows.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

## 3D charts

### 37. Create a 3D scatter plot

**Problem:** Show three numeric dimensions and category color together.
**Trigger:** When 3D structure matters more than flat projections.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter_3d(df, x="sepal_length", y="sepal_width", z="petal_length", color="species", title="3D scatter")
fig.show()
```

**Minimal Notes:** 3D plots are interactive and rotate in browser. Use them selectively. [web:24]
**Common Bug:** Overusing 3D when 2D plus facets would be clearer.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 38. Create a 3D line plot

**Problem:** Plot a path through 3D space.
**Trigger:** When trajectory or path geometry must be shown.
**Snippet:**

```python
import plotly.express as px
import pandas as pd
import numpy as np

t = np.linspace(0, 12, 200)
df = pd.DataFrame({"x": np.cos(t), "y": np.sin(t), "z": t})
fig = px.line_3d(df, x="x", y="y", z="z", title="3D line")
fig.show()
```

**Minimal Notes:** line_3d is useful for trajectories and parametric curves. Keep paths smooth and sparse enough to inspect. [web:24]
**Common Bug:** Expecting 3D lines to export as clean vectors in every backend.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 39. Create a polar scatter plot

**Problem:** Plot radius and angle data.
**Trigger:** When working with circular measurements or directional data.
**Snippet:**

```python
import plotly.express as px
import pandas as pd
import numpy as np

df = pd.DataFrame({"r": np.random.rand(30), "theta": np.linspace(0, 360, 30), "group": ["A"]*15 + ["B"]*15})
fig = px.scatter_polar(df, r="r", theta="theta", color="group", title="Polar scatter")
fig.show()
```

**Minimal Notes:** Polar plots need angle conventions to be clear. Label the domain explicitly. [web:24]
**Common Bug:** Confusing degrees and radians in theta values.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 40. Create a polar line chart

**Problem:** Show radial sequences connected by angle.
**Trigger:** When polar observations are ordered along a circle.
**Snippet:**

```python
import plotly.express as px
import pandas as pd
import numpy as np

df = pd.DataFrame({"r": np.random.rand(20), "theta": np.linspace(0, 360, 20)})
fig = px.line_polar(df, r="r", theta="theta", line_close=True, title="Polar line")
fig.show()
```

**Minimal Notes:** line_close closes the polygon when needed. It is useful for cyclical profiles. [web:24]
**Common Bug:** Leaving a cyclic series open when the first and last points should connect.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 41. Create a polar bar chart

**Problem:** Show category magnitudes on a circular axis.
**Trigger:** When a radial bar layout is useful for directional summaries.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({"theta": ["N", "E", "S", "W"], "r": })[^3][^7][^1][^9]
fig = px.bar_polar(df, r="r", theta="theta", title="Polar bars")
fig.show()
```

**Minimal Notes:** Polar bars are compact but should remain simple. They work best with a few categories. [web:24]
**Common Bug:** Using too many bars and making angle comparisons difficult.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 42. Create a ternary scatter plot

**Problem:** Plot compositional data with three parts summing to a whole.
**Trigger:** When every point is a three-part mixture.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({"a": [0.2, 0.4, 0.3], "b": [0.5, 0.2, 0.4], "c": [0.3, 0.4, 0.3], "grp": ["X", "Y", "Z"]})
fig = px.scatter_ternary(df, a="a", b="b", c="c", color="grp", title="Ternary scatter")
fig.show()
```

**Minimal Notes:** Ternary plots require compositional interpretation. Ensure values are normalized consistently. [web:24]
**Common Bug:** Feeding non-compositional values without normalization.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 43. Create a ternary line plot

**Problem:** Show a connected path through ternary space.
**Trigger:** When mixtures evolve over ordered steps.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({"a": [0.7, 0.5, 0.3, 0.2], "b": [0.2, 0.3, 0.4, 0.5], "c": [0.1, 0.2, 0.3, 0.3]})
fig = px.line_ternary(df, a="a", b="b", c="c", title="Ternary line")
fig.show()
```

**Minimal Notes:** Ternary lines are useful for trajectories in composition space. Keep the sequence ordered. [web:24]
**Common Bug:** Unsorted rows causing a misleading path.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

## Geographic charts

### 44. Create a geographic scatter plot

**Problem:** Plot points on a global map without tiles.
**Trigger:** When lat/lon coordinates are available.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")
fig = px.scatter_geo(df, lat="lat", lon="lon", color="continent", hover_name="country", size="pop", title="Geo scatter")
fig.show()
```

**Minimal Notes:** scatter_geo is the stable non-Mapbox geo workflow. Good for world-scale maps. [web:24]
**Common Bug:** Supplying coordinates with the wrong latitude/longitude columns.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 45. Create a choropleth map

**Problem:** Color regions by a numeric metric.
**Trigger:** When each geometry has a matching code or name.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")
fig = px.choropleth(df, locations="iso_alpha", color="lifeExp", hover_name="country", color_continuous_scale="Viridis", title="Choropleth")
fig.show()
```

**Minimal Notes:** Choropleths require valid location codes or geojson. Use a continuous scale for numeric values. [web:24]
**Common Bug:** Mismatching location identifiers with the geometry source.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 46. Create a density map

**Problem:** Visualize point density on a geographic map.
**Trigger:** When point concentration matters more than each point.
**Snippet:**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({"lat": [23.8103, 23.7806, 23.7465], "lon": [90.4125, 90.2794, 90.3750], "value": })[^6]
fig = px.density_map(df, lat="lat", lon="lon", z="value", radius=20, center=dict(lat=23.8103, lon=90.4125), zoom=9, title="Density map")
fig.show()
```

**Minimal Notes:** density_map is the stable map density workflow. Keep point coordinates accurate. [web:24]
**Common Bug:** Mixing up density_map with point scatter and expecting one marker per row.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 47. Create a map-style scatter plot

**Problem:** Plot geographic points on a tile-based map when needed.
**Trigger:** When you want map tiles and interactive pan/zoom.
**Snippet:**

```python
import plotly.express as px

df = px.data.carshare()
fig = px.scatter_map(df, lat="centroid_lat", lon="centroid_lon", color="peak_hour", size="car_hours", title="Scatter map")
fig.show()
```

**Minimal Notes:** Use the stable map API rather than older mapbox-specific examples where possible. Keep the map centered. [web:26][web:24]
**Common Bug:** Using deprecated or legacy mapbox naming in new code.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 48. Create a choropleth map with modern mapping workflow

**Problem:** Render region shading on a map-style interface.
**Trigger:** When a tile-based or map-oriented choropleth is required.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")
fig = px.choropleth_map(df, geojson=None, locations="iso_alpha", color="lifeExp", title="Choropleth map")
fig.show()
```

**Minimal Notes:** Use the modern map-oriented chart when the workflow requires map styling. Validate location fields carefully. [web:26][web:24]
**Common Bug:** Assuming the same location encoding works across every choropleth variant.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

## Animation \& faceting

### 49. Create an animated scatter plot

**Problem:** Show how a relationship changes across time.
**Trigger:** When you need a frame-by-frame progression.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder()
fig = px.scatter(
    df, x="gdpPercap", y="lifeExp",
    animation_frame="year", animation_group="country",
    size="pop", color="continent", hover_name="country",
    log_x=True, size_max=60, title="Animated scatter"
)
fig.show()
```

**Minimal Notes:** animation_frame selects frames and animation_group preserves identity. This is the classic px animation pattern. [web:25]
**Common Bug:** Leaving out animation_group and losing object constancy.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 50. Create an animated line chart

**Problem:** Animate a series over time.
**Trigger:** When each row or entity evolves frame-by-frame.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder()
fig = px.line(
    df, x="year", y="lifeExp",
    color="continent",
    animation_frame="year",
    animation_group="country",
    title="Animated line"
)
fig.show()
```

**Minimal Notes:** Animated line charts are best for small frame counts. Keep traces simple. [web:25]
**Common Bug:** Combining too many groups with many frames and making playback sluggish.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

### 51. Create a faceted scatter plot

**Problem:** Split a scatter chart by category.
**Trigger:** When comparing the same relationship across groups.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.scatter(df, x="total_bill", y="tip", color="sex", facet_col="time", title="Faceted scatter")
fig.show()
```

**Minimal Notes:** Facets are ideal for side-by-side subgroup comparisons. Use consistent axes for easier reading. [web:25]
**Common Bug:** Forgetting that facets can shrink the plot and make labels tiny.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 52. Create a faceted histogram with wrap

**Problem:** Split a histogram across multiple panels with wrapping.
**Trigger:** When one categorical dimension has several levels.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.histogram(df, x="total_bill", facet_col="day", facet_col_wrap=2, color="sex", title="Wrapped facets")
fig.show()
```

**Minimal Notes:** facet_col_wrap keeps layouts compact. This is useful for 3+ categories. [web:25]
**Common Bug:** Setting too many facets per row and making each panel too small.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 53. Create a faceted box plot

**Problem:** Compare distributions across two grouping dimensions.
**Trigger:** When category interaction matters.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.box(df, x="day", y="total_bill", facet_col="time", color="sex", title="Faceted box plot")
fig.show()
```

**Minimal Notes:** Faceting plus box plots is a common statistical reporting pattern. Keep the number of categories moderate. [web:24]
**Common Bug:** Using facets and too many hue levels at the same time.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 54. Create a faceted line chart

**Problem:** Compare time series across categories in separate panels.
**Trigger:** When overlapping lines become too dense.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("country in ['Canada', 'United States', 'Mexico']")
fig = px.line(df, x="year", y="lifeExp", color="country", facet_col="country", title="Faceted line chart")
fig.show()
```

**Minimal Notes:** Faceting often reads better than stacking many lines in one panel. Use identical axes for comparison. [web:25]
**Common Bug:** Forgetting to share axes, which breaks comparison between panels.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

### 55. Control facet spacing

**Problem:** Tighten or loosen space between panels.
**Trigger:** When layout density needs adjustment.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.scatter(df, x="total_bill", y="tip", facet_col="day", facet_col_spacing=0.03, facet_row_spacing=0.03, title="Facet spacing")
fig.show()
```

**Minimal Notes:** Fine-tune spacing when panels feel too cramped. Spacing is in paper units. [web:25]
**Common Bug:** Making spacing too small and causing label overlap.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

## Styling \& layout

### 56. Apply discrete color sequencing

**Problem:** Use a consistent categorical palette.
**Trigger:** When category colors must remain stable across charts.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(
    df, x="sepal_width", y="sepal_length", color="species",
    color_discrete_sequence=px.colors.qualitative.Dark24,
    title="Discrete palette"
)
fig.show()
```

**Minimal Notes:** Use qualitative palettes for categories. Keep palette choice consistent across a project. [web:25]
**Common Bug:** Using a continuous palette for categorical data.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 57. Apply continuous color scaling

**Problem:** Map numeric values to a gradient.
**Trigger:** When color represents a measurable quantity.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(
    df, x="sepal_width", y="sepal_length", color="petal_length",
    color_continuous_scale=px.colors.sequential.Viridis,
    title="Continuous color scale"
)
fig.show()
```

**Minimal Notes:** Use sequential or diverging scales for numeric fields. Normalize ranges when comparing figures. [web:25]
**Common Bug:** Using a diverging scale without a meaningful midpoint.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 58. Reorder categories explicitly

**Problem:** Enforce stable axis and legend order.
**Trigger:** When default category order is not acceptable.
**Snippet:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.bar(
    df, x="day", y="total_bill", color="sex",
    category_orders={"day": ["Thur", "Fri", "Sat", "Sun"], "sex": ["Female", "Male"]},
    title="Ordered categories"
)
fig.show()
```

**Minimal Notes:** category_orders controls axes, legends, and facets. Use it for reproducibility. [web:25]
**Common Bug:** Assuming alphabetical order when data order changes by input source.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 59. Rename labels for publication output

**Problem:** Replace raw column names with presentation-friendly text.
**Trigger:** When the output will be shown to users or stakeholders.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(
    df, x="sepal_width", y="sepal_length", color="species",
    labels={"sepal_width": "Sepal Width", "sepal_length": "Sepal Length", "species": "Species"},
    title="Renamed labels"
)
fig.show()
```

**Minimal Notes:** labels updates axis titles, legend names, and hover labels. It is the cleanest naming control in px. [web:25]
**Common Bug:** Leaving raw database column names in stakeholder-facing charts.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 60. Set title and subtitle

**Problem:** Add chart context without manual annotations.
**Trigger:** When the figure needs a report-ready heading.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(
    df, x="sepal_width", y="sepal_length", color="species",
    title="Iris scatter",
    subtitle="Sepal width vs sepal length"
)
fig.show()
```

**Minimal Notes:** title and subtitle are first-class px arguments. Use them before custom layout annotations. [web:25]
**Common Bug:** Overloading the title with too much explanatory text.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.scatter.html [web:25]

### 61. Update layout after figure creation

**Problem:** Adjust margins, legends, and overall layout.
**Trigger:** When px defaults are close but not final.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species", title="Layout updates")
fig.update_layout(legend_title_text="Species", margin=dict(l=40, r=20, t=60, b=40))
fig.show()
```

**Minimal Notes:** update_layout is the standard post-processing step. Keep figure construction separate from styling. [web:24]
**Common Bug:** Applying layout edits before figure construction is complete.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 62. Update traces after figure creation

**Problem:** Standardize marker, line, or hover behavior across traces.
**Trigger:** When a chart needs final production polishing.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species", title="Trace updates")
fig.update_traces(marker=dict(size=10, opacity=0.8))
fig.show()
```

**Minimal Notes:** update_traces affects all traces unless filtered. Use it for common styling. [web:24]
**Common Bug:** Accidentally changing every trace when only one should be modified.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 63. Update x-axes and y-axes

**Problem:** Format axes after a px chart is created.
**Trigger:** When axis titles, ticks, or ranges need final control.
**Snippet:**

```python
import plotly.express as px

df = px.data.gapminder().query("country == 'Canada'")
fig = px.line(df, x="year", y="lifeExp", title="Axis formatting")
fig.update_xaxes(title="Year")
fig.update_yaxes(title="Life Expectancy", range=)
fig.show()
```

**Minimal Notes:** Use axis-specific methods for final formatting. They are clearer than editing layout directly. [web:25]
**Common Bug:** Setting a range that clips valid data points.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.express.line.html [web:25]

## Performance \& export

### 64. Show a figure interactively

**Problem:** Render the chart in the current environment.
**Trigger:** When you want browser or notebook display.
**Snippet:**

```python
import plotly.express as px

fig = px.scatter(px.data.iris(), x="sepal_width", y="sepal_length", color="species")
fig.show()
```

**Minimal Notes:** show() uses the current renderer. Choose the renderer once in project setup. [web:24]
**Common Bug:** Expecting show() to persist as a file artifact.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 65. Write an interactive HTML file

**Problem:** Save a self-contained chart for sharing.
**Trigger:** When the output must be opened without Python.
**Snippet:**

```python
import plotly.express as px

fig = px.scatter(px.data.iris(), x="sepal_width", y="sepal_length", color="species")
fig.write_html("iris_scatter.html", include_plotlyjs="cdn")
```

**Minimal Notes:** HTML export is self-contained and easy to distribute. CDN mode reduces file size. [web:24]
**Common Bug:** Forgetting that offline environments may not load CDN assets.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 66. Write a static image

**Problem:** Export a PNG for reports or slides.
**Trigger:** When a fixed-resolution artifact is needed.
**Snippet:**

```python
import plotly.express as px

fig = px.scatter(px.data.iris(), x="sepal_width", y="sepal_length", color="species")
fig.write_image("iris_scatter.png", scale=2)
```

**Minimal Notes:** Static image export requires a supported image engine such as kaleido. Use scale for resolution. [web:24]
**Common Bug:** Running export in a container without the required image backend.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 67. Extract trendline results

**Problem:** Retrieve regression outputs from a trendline figure.
**Trigger:** When you need model statistics from an OLS fit.
**Snippet:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", trendline="ols")
results = px.get_trendline_results(fig)
print(results[["px_fit_results"]])
```

**Minimal Notes:** get_trendline_results is only meaningful for OLS trendlines. It returns statsmodels results objects. [web:24]
**Common Bug:** Expecting this to work for non-OLS trendline types.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

### 68. Use px defaults for repeated styling

**Problem:** Standardize theme, size, and rendering across many figures.
**Trigger:** When a project repeatedly reuses the same chart style.
**Snippet:**

```python
import plotly.express as px

px.defaults.template = "plotly_white"
px.defaults.width = 960
px.defaults.height = 540
fig = px.bar(px.data.tips(), x="day", y="total_bill", color="sex")
fig.show()
```

**Minimal Notes:** px.defaults reduces repeated boilerplate. It is ideal for team-wide chart consistency. [web:24]
**Common Bug:** Mutating defaults deep in application code and creating inconsistent figures.
**Official Documentation URL:** https://plotly.com/python-api-reference/plotly.express.html [web:24]

## Quick-reference tables

### Common px keyword arguments

| Argument | Use |
| :-- | :-- |
| `color` | Encode a variable by color. [web:25] |
| `symbol` | Encode a variable by marker symbol. [web:25] |
| `size` | Encode a variable by marker size. [web:25] |
| `hover_name` | Bold label in hover. [web:25] |
| `hover_data` | Extra hover fields. [web:25] |
| `text` | On-chart text labels. [web:25] |
| `facet_row` | Vertical faceting. [web:25] |
| `facet_col` | Horizontal faceting. [web:25] |
| `facet_col_wrap` | Wrap facet columns. [web:25] |
| `animation_frame` | Frame variable. [web:25] |
| `animation_group` | Preserve identity across frames. [web:25] |
| `category_orders` | Force display order. [web:25] |
| `labels` | Rename axis/legend labels. [web:25] |
| `template` | Set figure theme. [web:25] |
| `render_mode` | Choose svg/webgl/auto. [web:25] |

### Faceting parameters

| Parameter | Behavior |
| :-- | :-- |
| `facet_row` | Split vertically. [web:25] |
| `facet_col` | Split horizontally. [web:25] |
| `facet_col_wrap` | Wrap columns across rows. [web:25] |
| `facet_row_spacing` | Control row spacing. [web:25] |
| `facet_col_spacing` | Control column spacing. [web:25] |

### Animation parameters

| Parameter | Behavior |
| :-- | :-- |
| `animation_frame` | Selects frames. [web:25] |
| `animation_group` | Maintains object constancy. [web:25] |
| `size_max` | Caps animated marker size. [web:25] |

### Color scales

| Type | Examples |
| :-- | :-- |
| Qualitative | `px.colors.qualitative.Dark24`, `Plotly`, `D3`. [web:25] |
| Sequential | `px.colors.sequential.Viridis`, `Blues`, `Plasma`. [web:25] |
| Diverging | `px.colors.diverging.RdYlBu`, `Tealrose`. [web:25] |

### Export methods

| Method | Output |
| :-- | :-- |
| `fig.show()` | Interactive display. [web:24] |
| `fig.write_html()` | Shareable HTML file. [web:24] |
| `fig.write_image()` | Static PNG/SVG/PDF export. [web:24] |

## Coverage note

This file enumerates more than 60 dedicated Plotly Express engineering tasks and keeps each entry scoped to one production workflow. It uses plotly.py 6.8.0 throughout and avoids deprecated APIs except where noted as legacy context. [web:24][web:25][web:26]

```
<span style="display:none">[^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23]</span>

<div align="center">⁂</div>

[^1]: http://conference.scipy.org/proceedings/scipy2018/pdfs/jon_mease.pdf
[^2]: https://arxiv.org/pdf/2206.08703.pdf
[^3]: http://conference.scipy.org/proceedings/scipy2019/pdfs/shammamah_hossain.pdf
[^4]: CURRENT_PROJECT_STATE_REPORT.md
[^5]: ARCHITECTURE_FREEZE.md
[^6]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md
[^7]: AENS Knowledge Layer Specification.md
[^8]: http://arxiv.org/pdf/1611.00751.pdf
[^9]: CONTENT_QUALITY_STANDARD.md
[^10]: http://arxiv.org/pdf/2406.03839.pdf
[^11]: https://arxiv.org/pdf/2207.01124.pdf
[^12]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10546746/
[^13]: https://onlinelibrary.wiley.com/doi/10.1002/imt2.70018
[^14]: https://plotly.com/python/plotly-express/
[^15]: https://plotly.com/python-api-reference/plotly.express
[^16]: https://plotly.com/python-api-reference/generated/plotly.express.scatter.html
[^17]: https://plotly.com/python-api-reference/
[^18]: https://github.com/plotly/plotly.py/blob/main/doc/apidoc/plotly.express.rst
[^19]: https://plotly.com/python-api-reference/generated/plotly.express.imshow.html
[^20]: https://plotly.com/python/parallel-coordinates-plot/
[^21]: https://github.com/plotly/plotly_express/blob/master/gallery.md
[^22]: https://plotly.com/python/map-configuration/
[^23]: https://github.com/plotly/plotly_express/releases```

