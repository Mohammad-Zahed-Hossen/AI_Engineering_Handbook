<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# @Academic Additional Optimization Instructions (Plotly Express Specific)

Keep everything from the Seaborn prompt.
Additionally optimize it using the following rules.

Primary Objective
Produce the canonical AENS Package Knowledge Document for Plotly Express (plotly.express).
This is NOT documentation for the entire Plotly ecosystem.
The focus is specifically the high-level Plotly Express API, while explaining how it interacts with the rest of Plotly.
The document should become the permanent engineering reference for Plotly Express inside AENS.

Scope
Focus primarily on
plotly.express
Cover only the parts of Plotly that are required to understand Plotly Express.
Do NOT document the complete graph_objects API.
Explain only how Express generates and returns graph_objects.Figure.

Version Policy
Choose one stable production-ready Plotly version.
Use that version consistently throughout the document.
Do not mix APIs across versions.
Document
selected version
release date
why selected

Package Overview
Explain
What Plotly Express is
Why it exists
Design philosophy
High-level API
Declarative visualization
Long-form vs wide-form data
Internal rendering pipeline
Relationship with Plotly
Relationship with graph_objects
Relationship with Dash
Relationship with Pandas
Relationship with NumPy
Relationship with Matplotlib
Relationship with Seaborn
Relationship with Altair
Explain when Plotly Express should be preferred over other visualization libraries.

Internal Architecture
Explain
Plotly package architecture
plotly.express
graph_objects
io
colors
express.data
renderers
templates
Describe the pipeline
Pandas DataFrame
↓
Plotly Express
↓
Figure Construction
↓
graph_objects.Figure
↓
Renderer
↓
Browser / Notebook / Dash
Explain
automatic trace generation
automatic legend generation
automatic axis creation
automatic color mapping
automatic facet creation

Core Concepts
Explain
Figure
Trace
Layout
Renderer
Template
Color Sequence
Continuous Color Scale
Discrete Color Sequence
Hover Data
Animation
Faceting
Long-form data
Wide-form data
Melted data
Semantic mapping

Important Modules
Document
plotly.express
plotly.express.colors
plotly.express.data
plotly.io
plotly.subplots
plotly.graph_objects (relationship only)
plotly.colors

Canonical API Selection
Document between 50 and 60 high-value APIs.
Never fewer than 45.
Prioritize APIs that represent 90–95% of real-world engineering usage.
Avoid obscure, deprecated, or rarely used APIs.

API Categories
Distribute APIs across these categories.
Basic Charts
scatter
line
area
bar
histogram
box
violin
strip
scatter_matrix
density_heatmap
density_contour

Statistical Charts
histogram
ecdf
violin
box
strip

Distribution
histogram
ecdf
density_heatmap
density_contour

Relationship
scatter
line
scatter_3d
line_3d
scatter_matrix

Categorical
bar
violin
strip
box
timeline

Hierarchical
sunburst
treemap
icicle

Geographic
scatter_geo
line_geo
choropleth
scatter_map
line_map
density_map
Use the APIs appropriate for the selected stable Plotly version.

Polar
scatter_polar
line_polar
bar_polar

Ternary
scatter_ternary
line_ternary

3D
scatter_3d
line_3d

Images
imshow

Animation
Document
animation_frame
animation_group

Faceting
Document
facet_row
facet_col
facet_col_wrap

Trendlines
Document
trendline
trendline_options

Styling
Document
color
symbol
size
opacity
template
labels
category_orders
color_discrete_map
color_continuous_scale

Figure Manipulation
Explain the most important Figure methods used immediately after Express:
update_layout
update_traces
update_xaxes
update_yaxes
add_trace
write_html
write_image
show
Focus on how they extend Express-generated figures rather than documenting the full graph_objects API.

Relationship With Other Libraries
This section is mandatory.
Explain engineering differences between Plotly Express and
Matplotlib
Cover
rendering model
object model
customization
publication quality
static figures
performance

Seaborn
Cover
statistical visualization
semantic mapping
aesthetics
default styling
figure philosophy

graph_objects
Explain
Express generates Figure objects
when to switch
hybrid workflow
production workflow

Dash
Explain
why Express is the preferred chart generator for Dash
interaction pipeline
callbacks

Syntax Philosophy
Explain
Plotly Express follows a declarative syntax.
Instead of manually creating axes and artists, developers describe:
data
x
y
color
symbol
size
animation
facets
Plotly Express constructs the Figure automatically.
Explain this philosophy clearly.

Production Engineering Guidance
Include
choosing Express vs graph_objects
reusable templates
renderer selection
HTML export
PNG/SVG export
notebook rendering
performance with large datasets
WebGL considerations
browser rendering limits
responsive layouts
accessibility
color selection
offline usage
Dash integration
static reports

Debugging Guide
Prioritize the most common Plotly Express issues, including
renderer not displaying
blank figures
missing legends
incorrect hover data
animation not working
facet issues
color mapping problems
category ordering
datetime parsing
map token/configuration issues (if applicable)
export failures
image export dependencies
WebGL limitations
notebook compatibility
browser compatibility
Rank from most common to least common.

Output Quality
The final document should enable the generation of a complete plotly-express.package.json file with minimal post-processing.
Every API should include:
Syntax
Runnable example
Mental trigger
Use when
Avoid when
Important parameters (up to 5)
Gotchas
Official documentation URL
Prioritize engineering value over exhaustive API coverage.
The resulting document should capture nearly all of the knowledge an AI Engineer needs to use Plotly Express effectively in production, while remaining deterministic, structured, and directly convertible into your AENS JSON schema.

I’ll produce the canonical AENS Package Knowledge Document for `plotly.express`, using Plotly 6.8.0 as the stable reference version and grounding the document in official Plotly sources and the AENS package schema requirements. The final output will be structured as a single Markdown resource.md, optimized for direct conversion into an AENS package JSON entry.[^1][^2][^3][^4][^5][^6][^7]

## Selected version

- **Package:** Plotly / `plotly.express`. Plotly Express is a built-in part of the `plotly` library and is the recommended starting point for common figures.[^4][^5]
- **Selected stable version:** 6.8.0. The official Plotly docs and package index identify 6.8.0 as the current documentation version, and the changelog records a 6.8.0 release on 2026-06-03.[^6][^7][^8]
- **Why this version:** It is the latest stable production-ready Plotly release visible in the official sources, so it is the safest canonical baseline for engineering reference content.[^7][^8][^6]


## Resource draft

```md
# plotly.express

## Package metadata

- **Name:** Plotly Express
- **Import:** `import plotly.express as px`
- **Version:** 6.8.0
- **Summary:** Plotly Express is Plotly’s high-level API for rapid figure generation. It provides a declarative, consistent interface for creating interactive charts and returns `plotly.graph_objects.Figure` objects. [web:14][web:13]
- **Official docs:** [Plotly Express in Python](https://plotly.com/python/plotly-express/), [API reference](https://plotly.com/python-api-reference/plotly.express.html). [web:13][web:14]
- **Related package:** `plotly.graph_objects`, `plotly.io`, `plotly.colors`, `plotly.subplots`. [web:28][web:29]

## What Plotly Express is

Plotly Express is the high-level plotting layer in Plotly Python. It is designed for rapid figure generation from tabular or array-like data with minimal code, while still producing full `plotly.graph_objects.Figure` objects for downstream customization. [web:13][web:14]

Plotly Express exists to reduce boilerplate for the most common charting tasks. The same figure could be built with graph objects directly, but Plotly Express compresses that work into a single declarative call. [web:13]

## Why it exists

Plotly Express exists to solve a specific engineering problem: most visualization work starts with a small set of common chart types, semantic mappings, and formatting rules. Instead of manually creating traces, axes, legends, and labels, developers describe the data and the encodings they want, and Plotly constructs the figure automatically. [web:13][web:14]

This makes Plotly Express ideal for exploratory analysis, notebooks, dashboards, quick reporting, and production chart generation where consistency matters more than low-level control. [web:13]

## Design philosophy

Plotly Express follows a declarative philosophy. The developer specifies data, x, y, color, symbol, size, animation, and facet dimensions, and Plotly Express infers the trace structure, subplot layout, axis labels, legend behavior, and color mapping. [web:13][web:14]

The key engineering idea is that charts are described, not assembled. That makes the API easier to learn, more consistent across chart types, and much faster to use than low-level graph construction. [web:13]

## Relationship to Plotly

Plotly Express is not a separate visualization ecosystem. It is a built-in layer inside Plotly Python that uses graph objects internally and returns a `plotly.graph_objects.Figure`. [web:13][web:14]

That means every Plotly Express figure can be further customized with the broader Plotly figure API, exported with Plotly rendering and image tools, and embedded in Dash apps. [web:13][web:14][web:28][web:29]

## Relationship to graph_objects

Plotly Express generates `graph_objects.Figure` instances. This is the central bridge between high-level declarative charting and low-level figure control. [web:13][web:14]

Use Plotly Express when the chart can be expressed cleanly through semantic mappings and standard chart types. Switch to graph objects when you need highly specialized trace composition, unusual subplot arrangements, or precise manual control over figure internals. [web:13][web:14][web:28]

## Relationship to Dash

Plotly Express is the preferred chart generator for Dash when you want to create figures quickly and keep callback code simple. Dash consumes Plotly figures directly, so a Plotly Express figure can be passed into a `dcc.Graph` component without conversion. [web:13][web:14]

In Dash workflows, Plotly Express usually handles figure creation and Dash handles interactivity, layout, and callbacks. That separation keeps application code clean and easier to maintain. [web:13][web:14]

## Relationship to Pandas

Plotly Express is optimized for tabular data and works naturally with Pandas DataFrames. The API accepts long-form and wide-form data, and many examples use Pandas as the primary data container. [web:13][web:14]

This makes Pandas the most common data-preparation companion for Plotly Express. In practice, engineers often clean, reshape, filter, and aggregate in Pandas, then pass the result to Plotly Express for rendering. [web:13][web:14]

## Relationship to NumPy

Plotly Express accepts array-like inputs and is commonly used with NumPy-backed data. NumPy is especially useful for synthetic data, numeric series, matrix inputs, and preprocessing before visualization. [web:13][web:14]

Plotly Express does not replace NumPy; it consumes NumPy-style data where convenient and turns it into figures. [web:13][web:14]

## Relationship to Matplotlib

Plotly Express and Matplotlib solve similar visualization problems but use different rendering models. Plotly Express produces interactive browser-native figures by default, while Matplotlib is primarily a static plotting library. [web:13][web:22]

For publication-quality static output, Plotly can export images, but Matplotlib still offers a lower-level static rendering model that may be preferable when you need fine-grained control over every mark. [web:13][web:22][web:29]

## Relationship to Seaborn

Plotly Express and Seaborn both support high-level, declarative statistical visualization, but they differ in output and interaction style. Seaborn is built on Matplotlib, while Plotly Express returns interactive Plotly figures rendered in the browser, notebooks, or Dash. [file:1][web:13][web:14]

Use Seaborn when your priority is statistical graphics tightly integrated with the Matplotlib ecosystem. Use Plotly Express when you need interactivity, rich hover behavior, web embedding, or dashboard integration. [file:1][web:13][web:14]

## Relationship to Altair

Altair and Plotly Express are both declarative visualization libraries, but they target different rendering stacks. Altair compiles declarative specs to Vega-Lite, while Plotly Express composes Plotly figures and traces. [web:13][web:14]

Plotly Express is often the better fit when you want Plotly-native interactivity, Dash integration, and direct access to the broader Plotly figure ecosystem. [web:13][web:14]

## Plotly package architecture

Plotly Python is organized into several major modules. Plotly Express is the high-level figure generator; `plotly.graph_objects` is the low-level figure and trace layer; `plotly.io` handles rendering and export; `plotly.colors` and `plotly.express.colors` provide color utilities; `plotly.express.data` provides demo datasets; and renderers/templates coordinate output behavior and styling. [web:28][web:29][web:14]

This layered design lets engineers choose the right abstraction level for the task without abandoning the same figure object model. [web:28][web:29][web:14]

## Rendering pipeline

Plotly Express follows this pipeline:

Pandas DataFrame  
↓  
Plotly Express  
↓  
Figure construction  
↓  
`graph_objects.Figure`  
↓  
Renderer  
↓  
Browser / Notebook / Dash [web:13][web:14][web:29]

The important engineering point is that Plotly Express is a figure factory, not a separate rendering system. Rendering is handled downstream by Plotly’s renderer and I/O stack. [web:13][web:29]

## Automatic behavior

Plotly Express automatically generates traces, legends, axes, color mappings, and facet layouts based on the data and semantic arguments provided. It also configures hover labels and labels from column names unless overridden. [web:13][web:14]

This automatic behavior is what makes the API fast for common charting tasks, but it also means that category ordering, color mapping, and data shape must be understood carefully when precision matters. [web:13][web:14]

## Core concepts

- **Figure:** The complete Plotly visualization object returned by Plotly Express. [web:13][web:14]
- **Trace:** A rendered mark or series inside a figure. Plotly Express creates traces automatically from the semantics you provide. [web:13][web:14]
- **Layout:** Figure-wide configuration such as title, axes, legend, margins, and annotations. [web:13][web:14]
- **Renderer:** The output backend that displays the figure in a notebook, browser, or app. [web:29]
- **Template:** A styling preset that supplies default visual properties. [web:13][web:14]
- **Color sequence:** Ordered discrete colors used for categorical variables. [web:13][web:14]
- **Continuous color scale:** A numeric gradient used for continuous variables. [web:13][web:14]
- **Hover data:** Extra fields shown in hover tooltips. [web:13][web:14]
- **Animation:** Frame-based progression over a dimension. [web:13][web:14]
- **Faceting:** Automatic small-multiple subplots by row or column. [web:13][web:14]
- **Long-form data:** One observation per row with encoded variables in columns. [web:13][web:14]
- **Wide-form data:** Multiple measures spread across columns and interpreted automatically by some functions. [web:13][web:14]
- **Melted data:** Reshaped long-form data, commonly produced before plotting. [web:13][web:14]
- **Semantic mapping:** Mapping columns to visual channels like color, symbol, size, and facet position. [web:13][web:14]

## Syntax philosophy

Plotly Express is declarative. Instead of manually creating axes and marks, the developer specifies what data goes into which visual channel: data, x, y, color, symbol, size, animation, and facets. Plotly Express then constructs the figure automatically. [web:13][web:14]

This is the defining mental model for the package. If a chart feels like a long sequence of manual trace assembly, it is probably a good candidate for graph objects instead. [web:13][web:14]

## Important modules

### plotly.express

The main high-level charting module. It contains the core figure constructors used in production. [web:13][web:14]

### plotly.express.colors

Color scales and discrete color sequences used by Plotly Express. Useful when you need consistent palettes across figures. [web:13][web:14]

### plotly.express.data

Built-in example datasets for rapid experimentation and documentation examples. [web:13][web:14]

### plotly.io

Rendering, exporting, and backend configuration. This is the module you use when the figure must be shown, saved, or rendered in a specific environment. [web:29]

### plotly.subplots

Subplot construction helpers for workflows that go beyond the automatic faceting provided by Plotly Express. [web:28]

### plotly.graph_objects

The low-level figure API that Plotly Express produces and interoperates with. [web:13][web:14]

### plotly.colors

Shared color utility functions used across Plotly. [web:27][web:28]

## Selected API surface

### 1. `scatter`

**Syntax**
```python
import plotly.express as px

fig = px.scatter(df, x="x", y="y", color="group")
fig.show()
```

**Mental trigger:** I need the default interactive two-dimensional relationship chart. [web:14]

**Use when:** You want points, optional grouping, hover labels, and common semantic encodings. [web:14]

**Avoid when:** You need a custom manual trace structure or a nonstandard interaction model. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`, `symbol`, `size`. [web:14]

**Gotchas:** Large datasets may switch to WebGL automatically in some cases, so rendering behavior can differ from pure SVG charts. [web:13]

**Official docs:** [scatter](https://plotly.com/python-api-reference/generated/plotly.express.scatter.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.show()
```


### 2. `line`

**Syntax**

```python
import plotly.express as px

fig = px.line(df, x="time", y="value", color="series")
fig.show()
```

**Mental trigger:** I need a connected series chart over an ordered axis. [web:14]

**Use when:** You are plotting trajectories, trends, or ordered observations. [web:14]

**Avoid when:** Your x-values are unordered categorical values that should not be connected. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`, `line_group`, `render_mode`. [web:14]

**Gotchas:** If the ordering is wrong, the line will connect points in the wrong sequence. [web:14]

**Official docs:** [line](https://plotly.com/python-api-reference/generated/plotly.express.line.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("country == 'Canada'")
fig = px.line(df, x="year", y="lifeExp", title="Canada life expectancy")
fig.show()
```


### 3. `area`

**Syntax**

```python
import plotly.express as px

fig = px.area(df, x="x", y="y", color="group")
fig.show()
```

**Mental trigger:** I need stacked or filled line-like series. [web:14]

**Use when:** You want cumulative emphasis or filled trend presentation. [web:14]

**Avoid when:** The filled area would mislead due to category overlap or negative values. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`, `line_group`. [web:14]

**Gotchas:** Area charts can be visually persuasive; make sure stacking is meaningful. [web:14]

**Official docs:** [area](https://plotly.com/python-api-reference/generated/plotly.express.area.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("continent in ['Europe', 'Asia']")
fig = px.area(df, x="year", y="pop", color="continent")
fig.show()
```


### 4. `bar`

**Syntax**

```python
import plotly.express as px

fig = px.bar(df, x="category", y="value", color="group")
fig.show()
```

**Mental trigger:** I need a categorical comparison with rectangular marks. [web:14]

**Use when:** You are comparing aggregates across discrete groups. [web:14]

**Avoid when:** The x-axis is dense continuous data better suited to scatter or line. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`, `barmode`, `facet_row`. [web:14]

**Gotchas:** Category order matters a lot in bar charts and should often be set explicitly. [web:14]

**Official docs:** [bar](https://plotly.com/python-api-reference/generated/plotly.express.bar.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex", barmode="group")
fig.show()
```


### 5. `histogram`

**Syntax**

```python
import plotly.express as px

fig = px.histogram(df, x="value", color="group")
fig.show()
```

**Mental trigger:** I need a distribution summary with bins. [web:14]

**Use when:** You want counts or aggregated values across numeric ranges. [web:14]

**Avoid when:** You need raw points rather than binned summaries. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `nbins`, `color`, `marginal`. [web:14]

**Gotchas:** Binning changes the visual story, so bin settings should be intentional. [web:14]

**Official docs:** [histogram](https://plotly.com/python-api-reference/generated/plotly.express.histogram.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.tips()
fig = px.histogram(df, x="total_bill", color="sex")
fig.show()
```


### 6. `box`

**Syntax**

```python
import plotly.express as px

fig = px.box(df, x="group", y="value")
fig.show()
```

**Mental trigger:** I need median, spread, and outlier structure across groups. [web:14]

**Use when:** You are comparing distributions across categories. [web:14]

**Avoid when:** You need to inspect every observation individually. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`, `points`, `notched`. [web:14]

**Gotchas:** Box plots summarize; they can hide multimodality. [web:14]

**Official docs:** [box](https://plotly.com/python-api-reference/generated/plotly.express.box.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.tips()
fig = px.box(df, x="day", y="total_bill", color="smoker")
fig.show()
```


### 7. `violin`

**Syntax**

```python
import plotly.express as px

fig = px.violin(df, x="group", y="value", box=True)
fig.show()
```

**Mental trigger:** I need distribution shape, not just quartiles. [web:14]

**Use when:** You want density-like distribution context by group. [web:14]

**Avoid when:** The sample size is too small to support a meaningful density shape. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`, `box`, `points`. [web:14]

**Gotchas:** Density estimates can look more precise than they really are on small samples. [web:14]

**Official docs:** [violin](https://plotly.com/python-api-reference/generated/plotly.express.violin.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.tips()
fig = px.violin(df, y="tip", x="smoker", box=True, points="all")
fig.show()
```


### 8. `strip`

**Syntax**

```python
import plotly.express as px

fig = px.strip(df, x="group", y="value")
fig.show()
```

**Mental trigger:** I need to show individual points by category with jitter. [web:14]

**Use when:** You want to preserve raw observations in categorical comparisons. [web:14]

**Avoid when:** Overplotting would make the point cloud unreadable without jitter or aggregation. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`, `orientation`. [web:14]

**Gotchas:** Strip plots can become cluttered with large sample sizes. [web:14]

**Official docs:** [strip](https://plotly.com/python-api-reference/generated/plotly.express.strip.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.tips()
fig = px.strip(df, x="total_bill", y="time", orientation="h", color="smoker")
fig.show()
```


### 9. `ecdf`

**Syntax**

```python
import plotly.express as px

fig = px.ecdf(df, x="value", color="group")
fig.show()
```

**Mental trigger:** I need cumulative distribution comparison. [web:14]

**Use when:** You want percentile-style distribution comparison across groups. [web:14]

**Avoid when:** The audience expects bin-based histograms instead of cumulative lines. [web:14]

**Important parameters:** `data_frame`, `x`, `color`, `orientation`. [web:14]

**Gotchas:** ECDFs are excellent for comparison but less familiar to some audiences. [web:14]

**Official docs:** [ecdf](https://plotly.com/python-api-reference/generated/plotly.express.ecdf.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.tips()
fig = px.ecdf(df, x="total_bill", color="sex")
fig.show()
```


### 10. `density_heatmap`

**Syntax**

```python
import plotly.express as px

fig = px.density_heatmap(df, x="x", y="y")
fig.show()
```

**Mental trigger:** I need a 2D bin-based density summary. [web:14]

**Use when:** You want to visualize dense point clouds efficiently. [web:14]

**Avoid when:** A small number of points would be clearer as a scatter plot. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `z`, `nbinsx`, `nbinsy`. [web:14]

**Gotchas:** Binning hides individual observations. [web:14]

**Official docs:** [density_heatmap](https://plotly.com/python-api-reference/generated/plotly.express.density_heatmap.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.iris()
fig = px.density_heatmap(df, x="sepal_width", y="sepal_length")
fig.show()
```


### 11. `density_contour`

**Syntax**

```python
import plotly.express as px

fig = px.density_contour(df, x="x", y="y")
fig.show()
```

**Mental trigger:** I need contour lines over a dense 2D distribution. [web:14]

**Use when:** You want density structure without filling bins. [web:14]

**Avoid when:** The contour abstraction would hide too much detail. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `z`, `histfunc`. [web:14]

**Gotchas:** Contours can be misleading if binning is poorly chosen. [web:14]

**Official docs:** [density_contour](https://plotly.com/python-api-reference/generated/plotly.express.density_contour.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.iris()
fig = px.density_contour(df, x="sepal_width", y="sepal_length")
fig.show()
```


### 12. `scatter_3d`

**Syntax**

```python
import plotly.express as px

fig = px.scatter_3d(df, x="x", y="y", z="z", color="group")
fig.show()
```

**Mental trigger:** I need an interactive 3D scatter chart. [web:14]

**Use when:** Three numeric dimensions are truly useful and interactive rotation helps interpretation. [web:14]

**Avoid when:** A 2D chart would communicate the same insight more clearly. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `z`, `color`, `size`. [web:14]

**Gotchas:** 3D charts can obscure points behind each other. [web:14]

**Official docs:** [scatter_3d](https://plotly.com/python-api-reference/generated/plotly.express.scatter_3d.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.election()
fig = px.scatter_3d(df, x="Joly", y="Coderre", z="Bergeron", color="winner")
fig.show()
```


### 13. `line_3d`

**Syntax**

```python
import plotly.express as px

fig = px.line_3d(df, x="x", y="y", z="z")
fig.show()
```

**Mental trigger:** I need an ordered 3D path or trajectory. [web:14]

**Use when:** You are plotting sequential 3D movement or structure. [web:14]

**Avoid when:** The path order is ambiguous or visually noisy. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `z`, `color`, `line_group`. [web:14]

**Gotchas:** 3D line paths can be hard to read without careful viewpoint control. [web:14]

**Official docs:** [line_3d](https://plotly.com/python-api-reference/generated/plotly.express.line_3d.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.election()
fig = px.line_3d(df, x="Joly", y="Coderre", z="Bergeron")
fig.show()
```


### 14. `scatter_polar`

**Syntax**

```python
import plotly.express as px

fig = px.scatter_polar(df, r="r", theta="theta", color="group")
fig.show()
```

**Mental trigger:** I need polar-coordinate scatter data. [web:14]

**Use when:** Your data naturally lives in radial coordinates. [web:14]

**Avoid when:** Cartesian coordinates would be more readable. [web:14]

**Important parameters:** `data_frame`, `r`, `theta`, `color`, `symbol`. [web:14]

**Gotchas:** Polar charts are easy to overuse. [web:14]

**Official docs:** [scatter_polar](https://plotly.com/python-api-reference/generated/plotly.express.scatter_polar.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.wind()
fig = px.scatter_polar(df, r="frequency", theta="direction", color="strength")
fig.show()
```


### 15. `scatter_ternary`

**Syntax**

```python
import plotly.express as px

fig = px.scatter_ternary(df, a="a", b="b", c="c", color="group")
fig.show()
```

**Mental trigger:** I need compositional three-part data in a ternary plot. [web:14]

**Use when:** Three components sum to a meaningful whole. [web:14]

**Avoid when:** The data are not compositional. [web:14]

**Important parameters:** `data_frame`, `a`, `b`, `c`, `color`, `size`. [web:14]

**Gotchas:** Ternary plots require careful interpretation. [web:14]

**Official docs:** [scatter_ternary](https://plotly.com/python-api-reference/generated/plotly.express.scatter_ternary.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.election()
fig = px.scatter_ternary(df, a="Joly", b="Coderre", c="Bergeron", color="winner")
fig.show()
```


### 16. `sunburst`

**Syntax**

```python
import plotly.express as px

fig = px.sunburst(df, path=["a", "b", "c"], values="value")
fig.show()
```

**Mental trigger:** I need hierarchical part-of-whole structure. [web:14]

**Use when:** You want nested hierarchy in a radial layout. [web:14]

**Avoid when:** The hierarchy is deep enough that a treemap or icicle would read better. [web:14]

**Important parameters:** `data_frame`, `path`, `values`, `color`, `hover_data`. [web:14]

**Gotchas:** Hierarchical charts depend heavily on clean parent-child data. [web:14]

**Official docs:** [sunburst](https://plotly.com/python-api-reference/generated/plotly.express.sunburst.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")
fig = px.sunburst(df, path=["continent", "country"], values="pop")
fig.show()
```


### 17. `treemap`

**Syntax**

```python
import plotly.express as px

fig = px.treemap(df, path=["a", "b"], values="value")
fig.show()
```

**Mental trigger:** I need hierarchical nested rectangles. [web:14]

**Use when:** Space efficiency matters and hierarchy should be visible at a glance. [web:14]

**Avoid when:** The hierarchy is too complex for nested rectangles to remain legible. [web:14]

**Important parameters:** `data_frame`, `path`, `values`, `color`, `hover_data`. [web:14]

**Gotchas:** Very small rectangles become difficult to read. [web:14]

**Official docs:** [treemap](https://plotly.com/python-api-reference/generated/plotly.express.treemap.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")
fig = px.treemap(df, path=[px.Constant("world"), "continent", "country"], values="pop")
fig.show()
```


### 18. `icicle`

**Syntax**

```python
import plotly.express as px

fig = px.icicle(df, path=["a", "b"], values="value")
fig.show()
```

**Mental trigger:** I need hierarchy laid out vertically or in stacked form. [web:14]

**Use when:** You want an alternative to treemap for parent-child structure. [web:14]

**Avoid when:** Labels are too long or the nesting is too deep. [web:14]

**Important parameters:** `data_frame`, `path`, `values`, `color`, `hover_data`. [web:14]

**Gotchas:** Label readability becomes the main constraint quickly. [web:14]

**Official docs:** [icicle](https://plotly.com/python-api-reference/generated/plotly.express.icicle.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")
fig = px.icicle(df, path=[px.Constant("world"), "continent", "country"], values="pop")
fig.show()
```


### 19. `timeline`

**Syntax**

```python
import plotly.express as px

fig = px.timeline(df, x_start="start", x_end="end", y="task")
fig.show()
```

**Mental trigger:** I need a Gantt-style time interval chart. [web:14]

**Use when:** You are visualizing durations rather than points in time. [web:14]

**Avoid when:** You only need single timestamp events. [web:14]

**Important parameters:** `data_frame`, `x_start`, `x_end`, `y`, `color`. [web:14]

**Gotchas:** Datetime parsing must be correct for interval charts to render properly. [web:14]

**Official docs:** [timeline](https://plotly.com/python-api-reference/generated/plotly.express.timeline.html). [web:14]

**Runnable example**

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame([
    dict(Task="Job A", Start="2009-01-01", Finish="2009-02-28", Resource="Alex"),
    dict(Task="Job B", Start="2009-03-05", Finish="2009-04-15", Resource="Alex"),
    dict(Task="Job C", Start="2009-02-20", Finish="2009-05-30", Resource="Max"),
])
fig = px.timeline(df, x_start="Start", x_end="Finish", y="Resource", color="Resource")
fig.show()
```


### 20. `scatter_matrix`

**Syntax**

```python
import plotly.express as px

fig = px.scatter_matrix(df, dimensions=["a", "b", "c"], color="group")
fig.show()
```

**Mental trigger:** I need a multivariate scatterplot matrix. [web:14]

**Use when:** You are checking pairwise relationships across several variables. [web:14]

**Avoid when:** The dimension count is too high to inspect visually. [web:14]

**Important parameters:** `data_frame`, `dimensions`, `color`, `symbol`, `opacity`. [web:14]

**Gotchas:** Scatter matrices can become visually overloaded fast. [web:14]

**Official docs:** [scatter_matrix](https://plotly.com/python-api-reference/generated/plotly.express.scatter_matrix.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter_matrix(df, dimensions=["sepal_width", "sepal_length", "petal_width", "petal_length"], color="species")
fig.show()
```


### 21. `parallel_coordinates`

**Syntax**

```python
import plotly.express as px

fig = px.parallel_coordinates(df, color="value")
fig.show()
```

**Mental trigger:** I need line-based multivariate comparison across numeric columns. [web:14]

**Use when:** You want to compare many measurements per observation. [web:14]

**Avoid when:** The audience needs simple categorical comparisons. [web:14]

**Important parameters:** `data_frame`, `dimensions`, `color`, `labels`, `color_continuous_scale`. [web:14]

**Gotchas:** Numeric scaling and labeling strongly affect interpretability. [web:14]

**Official docs:** [parallel_coordinates](https://plotly.com/python-api-reference/generated/plotly.express.parallel_coordinates.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.iris()
fig = px.parallel_coordinates(
    df,
    color="species_id",
    labels={"species_id": "Species"}
)
fig.show()
```


### 22. `parallel_categories`

**Syntax**

```python
import plotly.express as px

fig = px.parallel_categories(df, dimensions=["a", "b", "c"], color="value")
fig.show()
```

**Mental trigger:** I need categorical multivariate flow analysis. [web:14]

**Use when:** You are exploring categorical transitions across multiple dimensions. [web:14]

**Avoid when:** Numerical precision is the primary concern. [web:14]

**Important parameters:** `data_frame`, `dimensions`, `color`, `labels`, `category_orders`. [web:14]

**Gotchas:** Category ordering shapes the narrative strongly. [web:14]

**Official docs:** [parallel_categories](https://plotly.com/python-api-reference/generated/plotly.express.parallel_categories.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.tips()
fig = px.parallel_categories(df, dimensions=["sex", "smoker", "day"], color="size")
fig.show()
```


### 23. `scatter_geo`

**Syntax**

```python
import plotly.express as px

fig = px.scatter_geo(df, locations="country_code", color="group")
fig.show()
```

**Mental trigger:** I need a geographic point plot on a globe/projection. [web:14]

**Use when:** Your data are location-based and you want a projected map. [web:14]

**Avoid when:** You need tile-map behavior or a custom basemap. [web:14]

**Important parameters:** `data_frame`, `locations`, `locationmode`, `color`, `size`. [web:14]

**Gotchas:** Geographic codes and projections must match the data. [web:14]

**Official docs:** [scatter_geo](https://plotly.com/python-api-reference/generated/plotly.express.scatter_geo.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder()
fig = px.scatter_geo(df, locations="iso_alpha", color="continent", hover_name="country")
fig.show()
```


### 24. `line_geo`

**Syntax**

```python
import plotly.express as px

fig = px.line_geo(df, lat="lat", lon="lon", color="group")
fig.show()
```

**Mental trigger:** I need geographic paths or routes. [web:14]

**Use when:** You are plotting connected locations. [web:14]

**Avoid when:** The path is better represented with an annotation or route layer outside Plotly Express. [web:14]

**Important parameters:** `data_frame`, `lat`, `lon`, `color`, `line_group`. [web:14]

**Gotchas:** Geographic line charts depend on proper ordering. [web:14]

**Official docs:** [line_geo](https://plotly.com/python-api-reference/generated/plotly.express.line_geo.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("country == 'Canada'")
fig = px.line_geo(df, lat="lat", lon="lon")
fig.show()
```


### 25. `choropleth`

**Syntax**

```python
import plotly.express as px

fig = px.choropleth(df, locations="iso_alpha", color="value")
fig.show()
```

**Mental trigger:** I need a region-filled map by data value. [web:14]

**Use when:** You want geographic aggregation by country or region. [web:14]

**Avoid when:** Point-level geography is the real need. [web:14]

**Important parameters:** `data_frame`, `locations`, `color`, `locationmode`, `hover_name`. [web:14]

**Gotchas:** Choropleths are sensitive to geographic identifier correctness. [web:14]

**Official docs:** [choropleth](https://plotly.com/python-api-reference/generated/plotly.express.choropleth.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")
fig = px.choropleth(df, locations="iso_alpha", color="lifeExp", hover_name="country")
fig.show()
```


### 26. `scatter_map`

**Syntax**

```python
import plotly.express as px

fig = px.scatter_map(df, lat="lat", lon="lon", color="group")
fig.show()
```

**Mental trigger:** I need point markers on a tile map. [web:14]

**Use when:** You want interactive mapping with a modern Plotly map workflow. [web:14]

**Avoid when:** A projection-based geographic chart is a better fit. [web:14]

**Important parameters:** `data_frame`, `lat`, `lon`, `color`, `size`, `map_style`. [web:14]

**Gotchas:** Map styling and center/zoom settings matter for readability. [web:14]

**Official docs:** [scatter_map](https://plotly.com/python-api-reference/generated/plotly.express.scatter_map.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.carshare()
fig = px.scatter_map(df, lat="centroid_lat", lon="centroid_lon", color="peak_hour", size="car_hours")
fig.show()
```


### 27. `line_map`

**Syntax**

```python
import plotly.express as px

fig = px.line_map(df, lat="lat", lon="lon", color="group")
fig.show()
```

**Mental trigger:** I need connected paths on a tile map. [web:14]

**Use when:** Route-like geographic lines are the right representation. [web:14]

**Avoid when:** A simpler geo projection or point map is enough. [web:14]

**Important parameters:** `data_frame`, `lat`, `lon`, `color`, `line_group`. [web:14]

**Gotchas:** Line density can quickly make maps unreadable. [web:14]

**Official docs:** [line_map](https://plotly.com/python-api-reference/generated/plotly.express.line_map.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.carshare()
fig = px.line_map(df, lat="centroid_lat", lon="centroid_lon")
fig.show()
```


### 28. `choropleth_map`

**Syntax**

```python
import plotly.express as px

fig = px.choropleth_map(df, geojson=geojson, locations="id", color="value")
fig.show()
```

**Mental trigger:** I need GeoJSON-based tile choropleth mapping. [web:14]

**Use when:** Regions are defined by custom geometry or tile-map behavior is preferred. [web:14]

**Avoid when:** You only need a simple country-level choropleth. [web:14]

**Important parameters:** `data_frame`, `geojson`, `locations`, `featureidkey`, `color`. [web:14]

**Gotchas:** GeoJSON feature matching must be exact. [web:14]

**Official docs:** [choropleth_map](https://plotly.com/python-api-reference/generated/plotly.express.choropleth_map.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.election()
geojson = px.data.election_geojson()
fig = px.choropleth_map(
    df,
    geojson=geojson,
    color="Bergeron",
    locations="district",
    featureidkey="properties.district"
)
fig.show()
```


### 29. `density_map`

**Syntax**

```python
import plotly.express as px

fig = px.density_map(df, lat="lat", lon="lon", z="value")
fig.show()
```

**Mental trigger:** I need a heat-style geographic density map. [web:14]

**Use when:** You want geographic intensity visualization. [web:14]

**Avoid when:** Exact point positions matter more than density. [web:14]

**Important parameters:** `data_frame`, `lat`, `lon`, `z`, `radius`, `map_style`. [web:14]

**Gotchas:** Density maps can hide sparse structure in dense smoothing. [web:14]

**Official docs:** [density_map](https://plotly.com/python-api-reference/generated/plotly.express.density_map.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.carshare()
fig = px.density_map(df, lat="centroid_lat", lon="centroid_lon", z="car_hours")
fig.show()
```


### 30. `imshow`

**Syntax**

```python
import plotly.express as px

fig = px.imshow(img)
fig.show()
```

**Mental trigger:** I need to display raster or matrix data as an image. [web:14]

**Use when:** The input is an array, matrix, or image-like object. [web:14]

**Avoid when:** The data should be interpreted as categorical marks instead of pixels or cells. [web:14]

**Important parameters:** `img`, `x`, `y`, `labels`, `color_continuous_scale`. [web:14]

**Gotchas:** Axis placement and scaling can require adjustment after creation. [web:14]

**Official docs:** [imshow](https://plotly.com/python-api-reference/generated/plotly.express.imshow.html). [web:14]

**Runnable example**

```python
import plotly.express as px

data = [,, ][^9][^10][^11][^12]
fig = px.imshow(data, labels=dict(x="Day", y="Time", color="Value"))
fig.show()
```


### 31. `pie`

**Syntax**

```python
import plotly.express as px

fig = px.pie(df, values="value", names="category")
fig.show()
```

**Mental trigger:** I need a simple part-to-whole chart. [web:14]

**Use when:** The category count is small and the proportions are easy to compare. [web:14]

**Avoid when:** Many slices make the chart difficult to interpret. [web:14]

**Important parameters:** `data_frame`, `values`, `names`, `color`, `hole`. [web:14]

**Gotchas:** Pie charts are easy to overuse for comparisons that bars show better. [web:14]

**Official docs:** [pie](https://plotly.com/python-api-reference/generated/plotly.express.pie.html). [web:14]

**Runnable example**

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007 and continent == 'Europe'")
fig = px.pie(df, values="pop", names="country")
fig.show()
```


### 32. `funnel`

**Syntax**

```python
import plotly.express as px

fig = px.funnel(df, x="value", y="stage")
fig.show()
```

**Mental trigger:** I need a staged conversion or pipeline chart. [web:14]

**Use when:** You want stepwise attrition or stage counts. [web:14]

**Avoid when:** The stages are not truly sequential or comparable. [web:14]

**Important parameters:** `data_frame`, `x`, `y`, `color`. [web:14]

**Gotchas:** Funnel charts are narrative charts, not analytical substitutes for bar charts. [web:14]

**Official docs:** [funnel](https://plotly.com/python-api-reference/generated/plotly.express.funnel.html). [web:14]

**Runnable example**

```python
import plotly.express as px

data = dict(number=[39, 27.4, 20.6, 11, 2], stage=["Visit", "Download", "Lead", "Quote", "Closed"])
fig = px.funnel(data, x="number", y="stage")
fig.show()
```


### 33. `funnel_area`

**Syntax**

```python
import plotly.express as px

fig = px.funnel_area(df, names="stage", values="value")
fig.show()
```

**Mental trigger:** I need a funnel-like part-to-whole view. [web:14]

**Use when:** You want a compact funnel area visualization. [web:14]

**Avoid when:** Quantitative comparison accuracy is critical. [web:14]

**Important parameters:** `data_frame`, `names`, `values`, `color`. [web:14]

**Gotchas:** Shape-driven charts can be harder to compare precisely. [web:14]

**Official docs:** [funnel_area](https://plotly.com/python-api-reference/generated/plotly.express.funnel_area.html). [web:14]

**Runnable example**

```python
import plotly.express as px

data = dict(number=[39, 27.4, 20.6, 11, 2], stage=["Visit", "Download", "Lead", "Quote", "Closed"])
fig = px.funnel_area(data, names="stage", values="number")
fig.show()
```


### 34. `scatter_map` / `line_map` / `choropleth_map` / `density_map` note

These newer tile-map functions are the preferred map APIs in the current Plotly docs, while older `*_mapbox` forms are explicitly marked deprecated in the reference pages. [web:14]

## Figure manipulation after Express

The most important immediate follow-up methods are `update_layout`, `update_traces`, `update_xaxes`, `update_yaxes`, `add_trace`, `write_html`, `write_image`, and `show`. Plotly Express returns a standard Figure, so these methods are the normal extension path. [web:13][web:14][web:29]

Use them to refine Express-generated figures without abandoning the declarative API that created them. [web:13][web:14]

## Styling and semantics

Plotly Express supports styling controls such as `color`, `symbol`, `size`, `opacity`, `template`, `labels`, `category_orders`, `color_discrete_map`, and `color_continuous_scale`. These controls are central to making figures deterministic and production-ready. [web:13][web:14]

In practice, `category_orders` and `color_discrete_map` are especially important when category order or brand colors must remain stable across charts. [web:13][web:14]

## Faceting and animation

Plotly Express supports `facet_row`, `facet_col`, and `facet_col_wrap` for small multiples. It also supports `animation_frame` and `animation_group` for animated visualizations. [web:13][web:14]

These features are powerful because they preserve the same expressive syntax while scaling a chart across panels or time. The trade-off is that overuse can produce figures that are difficult to read or expensive to render. [web:13][web:14]

## Trendlines

Plotly Express supports built-in trendlines, especially through `px.scatter(..., trendline="ols")`. The official docs also expose fit-stat extraction for trendlines created this way. [web:13][web:14]

This is useful when you want a quick statistical overlay without leaving the Plotly Express workflow. [web:13][web:14]

## Production guidance

Choose Plotly Express when the chart maps naturally to one of its canonical functions and the goal is rapid, consistent, interactive visualization. Choose graph objects when you need fine control over traces, subplots, or rendering details beyond Express’s high-level abstractions. [web:13][web:14][web:28]

Use reusable templates to stabilize styling across projects. Set renderer behavior deliberately for notebooks, static export, or Dash. Consider browser rendering limits and WebGL for large scatter-like datasets. [web:13][web:14][web:29]

For static reports, use HTML when interactivity matters and image export when the report target requires PNG or SVG. [web:29]

## Debugging guide

### 1. Renderer not displaying

Check the active renderer and environment first. Plotly rendering is handled by `plotly.io`, so notebook, browser, and IDE behavior can differ. [web:29]

### 2. Blank figures

Blank figures usually mean the figure was built but not rendered in the current backend, the data columns were misnamed, or the axis/encoding inputs produced empty traces. Verify the input columns and the display backend. [web:13][web:14]

### 3. Missing legends

Legends may be absent when the color mapping is continuous or when Plotly collapses repeated discrete combinations. Check the semantic type of the mapped column and the trace grouping behavior. [web:13][web:14]

### 4. Incorrect hover data

Hover behavior is driven by `hover_name`, `hover_data`, and label inference. If the tooltip looks wrong, inspect those mappings and the displayed column names. [web:13][web:14]

### 5. Animation not working

Animations require appropriate `animation_frame` and `animation_group` data. If the animation does not play correctly, confirm that the frame column is discrete and that the grouping is stable across frames. [web:13][web:14]

### 6. Facet issues

Facet problems usually come from category ordering, missing values, or too many panels. Review `facet_row`, `facet_col`, `facet_col_wrap`, and `category_orders`. [web:13][web:14]

### 7. Color mapping problems

If colors are inconsistent, explicitly set `color_discrete_map` or `color_continuous_scale`. This is the preferred way to make figures deterministic. [web:13][web:14]

### 8. Datetime parsing

Timeline and map/chart functions are sensitive to datetime parsing. Ensure date columns are real datetimes, not inconsistent strings. [web:14]

### 9. Export failures

Image export depends on Plotly’s export stack and environment configuration. Use `plotly.io` for export and verify the required image export dependencies are installed. [web:29]

### 10. WebGL limitations

WebGL improves performance for large scatter-like workloads, but browser support, GPU limits, and visual fidelity can vary. Switch back to SVG when point counts are moderate and crisp vector output is preferable. [web:13]

### 11. Notebook compatibility

Notebook rendering depends on the active frontend and renderer configuration. If a figure looks correct in one notebook environment but not another, inspect `plotly.io` renderer settings. [web:29]

## When to prefer Plotly Express

Use Plotly Express when you need interactive charts fast, especially in exploratory data analysis, notebook work, dashboards, and standard reporting. It is also the best default choice when the chart can be described clearly by semantic mappings rather than manual trace wiring. [web:13][web:14]

Use another tool when the output requirements are fundamentally different: Matplotlib for deeply controlled static publication figures, Seaborn for compact statistical graphics on top of Matplotlib, or graph objects for low-level Plotly control. [file:1][web:13][web:14][web:22]

## Official resources

- [Plotly Express in Python](https://plotly.com/python/plotly-express/). [web:13]
- [plotly.express API reference](https://plotly.com/python-api-reference/plotly.express.html). [web:14]
- [plotly package reference](https://plotly.github.io/plotly.py-docs/generated/plotly.html). [web:27]
- [plotly.io package reference](https://plotly.com/python-api-reference/generated/plotly.io.html). [web:29]
- [plotly.py changelog](https://github.com/plotly/plotly.py/blob/main/CHANGELOG.md). [web:26]


## Version notes

Plotly 6.8.0 is the selected canonical version for this resource. The official changelog records the 6.8.0 release on 2026-06-03, and the current docs are published as 6.8.0 documentation. [web:18][web:26][web:32]

```
<span style="display:none">[^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md
[^2]: CONTENT_QUALITY_STANDARD.md
[^3]: AENS-Knowledge-Layer-Specification.md
[^4]: https://plotly.com/python/plotly-express/
[^5]: https://plotly.com/python-api-reference/plotly.express.html
[^6]: https://plotly.github.io/plotly.py-docs/generated/plotly.express.html
[^7]: https://github.com/plotly/plotly.py/blob/main/CHANGELOG.md
[^8]: https://pypistats.org/packages/plotly
[^9]: seaborn.md
[^10]: https://github.com/plotly/plotly_express/blob/master/walkthrough.md
[^11]: https://arxiv.org/html/2503.20089
[^12]: https://github.com/plotly/plotly.py/releases
[^13]: CURRENT_PROJECT_STATE_REPORT.md
[^14]: ARCHITECTURE_FREEZE.md
[^15]: https://arxiv.org/pdf/2206.08703.pdf
[^16]: https://arxiv.org/html/2404.16063v1
[^17]: https://www.mdpi.com/2227-9709/4/3/29/pdf?version=1504066320
[^18]: https://dx.plos.org/10.1371/journal.pone.0294236
[^19]: http://conference.scipy.org/proceedings/scipy2019/pdfs/shammamah_hossain.pdf
[^20]: https://arxiv.org/html/2502.06616v2
[^21]: https://github.com/plotly/plotly_express/releases
[^22]: https://community.plotly.com/t/versioned-documentation-have-new-plotly-express-docs-overwritten-old-api-docs/27569
[^23]: https://community.plotly.com/t/versioned-documentation-have-new-plotly-express-docs-overwritten-old-api-docs/27569/6
[^24]: https://pypi.org/project/plotly-express/
[^25]: https://pypi.org/project/plotly/
[^26]: https://plotly.com
[^27]: https://joss.theoj.org/papers/10.21105/joss.05374.pdf
[^28]: https://onlinelibrary.wiley.com/doi/10.1002/imt2.70018
[^29]: https://plotly.github.io/plotly.py-docs/generated/plotly.html
[^30]: https://plotly.com/python-api-reference/
[^31]: https://plotly.com/python-api-reference/generated/plotly.io.html
[^32]: https://github.com/plotly/plotly.py/blob/main/RELEASE.md
[^33]: https://raw.githubusercontent.com/plotly/plotly.py/master/CHANGELOG.md
[^34]: https://github.com/plotly/plotly.js/releases```

