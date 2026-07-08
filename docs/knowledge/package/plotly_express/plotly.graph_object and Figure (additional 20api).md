<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# I already have documentation for approximately 35 Plotly APIs, mostly covering the major plotly.express chart constructors.

DO NOT generate duplicate APIs.
Instead, generate 20 additional, highly useful APIs that are commonly used in production projects but are NOT already covered.
Prioritize APIs from both:
plotly.graph_objects
plotly.graph_objects.Figure
Remaining important plotly.express utilities (only if not already included)

Existing APIs (DO NOT INCLUDE)
These are already documented:
px.scatter
px.line
px.area
px.bar
px.histogram
px.box
px.violin
px.strip
px.ecdf
px.density_heatmap
px.density_contour
px.scatter_3d
px.line_3d
px.scatter_polar
px.scatter_ternary
px.sunburst
px.treemap
px.icicle
px.timeline
px.scatter_matrix
px.parallel_coordinates
px.parallel_categories
px.scatter_geo
px.line_geo
px.choropleth
px.scatter_map
px.line_map
px.choropleth_map
px.density_map
px.imshow
px.pie
px.funnel
px.funnel_area
If an API already appears above, skip it completely.

Preferred API Categories
Prioritize APIs in this order.

1. Figure Customization APIs (Highest Priority)
Examples include
Figure.update_layout()
Figure.update_traces()
Figure.update_xaxes()
Figure.update_yaxes()
Figure.update_annotations()
Figure.update_shapes()
Figure.add_trace()
Figure.add_annotation()
Figure.add_shape()
Figure.add_hline()
Figure.add_vline()
Figure.add_hrect()
Figure.add_vrect()
Figure.for_each_trace()
Figure.for_each_annotation()
Figure.select_traces()
Figure.write_html()
Figure.write_image()
Figure.to_html()
Figure.to_json()
2. graph_objects Trace Constructors
Generate only the most commonly used traces such as
go.Scatter
go.Bar
go.Histogram
go.Box
go.Violin
go.Heatmap
go.Surface
go.Mesh3d
go.Candlestick
go.Waterfall
go.Indicator
go.Table
go.Sankey
go.Parcoords
go.Parcats
go.Volume
go.Isosurface
go.Cone
go.Streamtube
Only include traces that are genuinely common in engineering practice.
3. Figure Factory / Subplots
High priority:
make_subplots()
go.Figure()
Figure.add_traces()
4. Plotly IO APIs
Examples
plotly.io.write_html()
plotly.io.to_html()
plotly.io.show()
plotly.io.renderers.default
Only include APIs that developers actually use.

For every API collect
Exactly the same schema used throughout my knowledge base.
Required fields
task
syntax
example
mental_trigger
use_when
avoid_when
important_params (max 5)
gotchas
official_docs
Also include
decision_notes
containing
Category
Module
Return Value
Expected Output
Relationship with Plotly Express
Relationship with graph_objects
Relationship with Matplotlib
Relationship with Seaborn
Performance Notes
Common Mistakes
Related APIs

Code Requirements
Every example must
run successfully
be self-contained
use current Plotly syntax
target Plotly 6.x stable
import every dependency explicitly
avoid deprecated APIs
use official recommendations

Important Requirements
For every API explain
Why developers use it
How it fits into the Plotly ecosystem
Whether it belongs to
Plotly Express
graph_objects
Figure
plotly.io
Whether it is usually called
before figure creation
during figure creation
after figure creation
Whether it is
beginner
intermediate
advanced
Common migration advice from Matplotlib
Equivalent Seaborn workflow (if applicable)
Internal relationship with Plotly Express. For example:
px.scatter() returns a go.Figure.
Figure.update_layout() modifies that object.
Figure.add_trace() appends new traces.
go.Scatter is the lower-level primitive used internally by Plotly Express.

Selection Criteria
Only include APIs that satisfy ALL of the following:
Used frequently in production dashboards
Common in Dash applications
Frequently used in Plotly documentation
Recommended in official Plotly examples
Useful for data science, analytics, ML, and business dashboards
Stable in Plotly 6.x
Not deprecated
Not experimental
Avoid obscure, legacy, or rarely used APIs.

Output Format
Produce exactly 20 unique APIs.
Do not repeat any existing API.
Order them by real-world usefulness, from most frequently used to least.
Prefer quality over novelty. If there are fewer than 20 genuinely valuable APIs remaining, fill the remainder with high-impact Figure and graph_objects APIs rather than obscure chart constructors.

Below are 20 additional Plotly APIs that are high-value in production and not duplicated from your existing list. I ordered them by real-world usefulness, with Figure customization first, then core trace constructors, then subplots and IO.[^11][^12][^13][^14]

## 1) `Figure.update_layout()`

- **task:** Update figure-wide layout after creating a Plotly Express or graph_objects figure.[^12][^11]
- **syntax:** `fig.update_layout(title="...", template="plotly_white")`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.update_layout(title="Iris scatter", template="plotly_white", legend_title_text="Species")
fig.show()
```

- **mental_trigger:** I need to change title, margins, legend, axes defaults, or overall figure styling.[^11][^12]
- **use_when:** After any figure creation, especially for publication styling, dashboards, and branded templates.[^12][^11]
- **avoid_when:** You need to change individual trace styling only.[^11][^12]
- **important_params:** `title`, `template`, `legend`, `margin`, `annotations`.
- **gotchas:** Layout changes apply to the whole figure, so be careful not to overwrite existing settings unintentionally.[^12][^11]
- **official_docs:** [plotly.graph_objects.Figure.update_layout](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.update_layout.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Updated figure layout.
    - **Relationship with Plotly Express:** Common post-processing step on `px.*` figures.
    - **Relationship with graph_objects:** Core figure-level mutation API.
    - **Relationship with Matplotlib:** Similar to adjusting `fig.suptitle` or `rcParams`, but declarative and interactive.
    - **Relationship with Seaborn:** Similar to calling `set_theme` plus figure-level tweaks after plotting.
    - **Performance Notes:** Cheap; layout updates are usually lightweight.
    - **Common Mistakes:** Accidentally replacing nested layout objects with incomplete dictionaries.
    - **Related APIs:** `update_traces`, `update_xaxes`, `update_yaxes`, `show`.


## 2) `Figure.update_traces()`

- **task:** Bulk-update trace properties after figure creation.[^11][^12]
- **syntax:** `fig.update_traces(marker_size=10, selector=dict(type="scatter"))`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.update_traces(marker=dict(size=12, line=dict(width=1, color="black")))
fig.show()
```

- **mental_trigger:** I need to change styling or behavior for all traces of a type.[^12][^11]
- **use_when:** Adding consistent marker sizes, hover formatting, line width, or opacity across traces.[^11][^12]
- **avoid_when:** Only one trace needs to change and a selector is unnecessary.[^12][^11]
- **important_params:** `selector`, `row`, `col`, `overwrite`, `patch`.
- **gotchas:** Selectors matter; without them, you may update more traces than intended.[^11][^12]
- **official_docs:** [plotly.graph_objects.Figure.update_traces](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.update_traces.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Trace properties changed across selected traces.
    - **Relationship with Plotly Express:** The normal way to refine `px.*` output without rebuilding the chart.
    - **Relationship with graph_objects:** Mutates traces produced either manually or by Express.
    - **Relationship with Matplotlib:** Similar in spirit to post-hoc artist edits, but at figure level.
    - **Relationship with Seaborn:** Comparable to customizing artists after a seaborn plot is drawn on Matplotlib axes.
    - **Performance Notes:** Efficient for bulk styling; avoid repeated updates in loops when one call is enough.
    - **Common Mistakes:** Forgetting that multiple trace types may exist in the same figure.
    - **Related APIs:** `update_layout`, `for_each_trace`, `select_traces`, `add_trace`.


## 3) `Figure.update_xaxes()`

- **task:** Update x-axis properties after figure creation.[^12][^11]
- **syntax:** `fig.update_xaxes(title_text="X axis", showgrid=True)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.update_xaxes(title_text="Sepal width", gridcolor="lightgray")
fig.show()
```

- **mental_trigger:** I need to control x-axis scale, ticks, grid, or formatting.[^11][^12]
- **use_when:** Cleaning up axes after Express-generated charts or subplots.[^12][^11]
- **avoid_when:** The chart has no meaningful x-axis customization.[^11][^12]
- **important_params:** `title_text`, `range`, `tickformat`, `showgrid`, `type`.
- **gotchas:** Axis updates can apply to multiple subplots unless scoped carefully.[^12][^11]
- **official_docs:** [plotly.graph_objects.Figure.update_xaxes](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.update_xaxes.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Updated x-axis appearance/behavior.
    - **Relationship with Plotly Express:** Common after `px.line`, `px.scatter`, and faceted figures.
    - **Relationship with graph_objects:** Works on any figure with x-axes.
    - **Relationship with Matplotlib:** Similar to axis-level setters like `set_xlim`, `set_xlabel`, and tick formatting.
    - **Relationship with Seaborn:** Similar to adjusting axes after a seaborn plot.
    - **Performance Notes:** Very cheap.
    - **Common Mistakes:** Applying a date axis format to a categorical axis.
    - **Related APIs:** `update_yaxes`, `update_layout`, `add_hline`, `add_vline`.


## 4) `Figure.update_yaxes()`

- **task:** Update y-axis properties after figure creation.[^11][^12]
- **syntax:** `fig.update_yaxes(title_text="Y axis", rangemode="tozero")`
- **example:**

```python
import plotly.express as px

df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex", barmode="group")
fig.update_yaxes(title_text="Total bill", rangemode="tozero")
fig.show()
```

- **mental_trigger:** I need to format or constrain the y-axis.[^12][^11]
- **use_when:** Formatting numeric axes, fixing ranges, or improving readability.[^11][^12]
- **avoid_when:** The chart is already readable and no axis tweak is needed.[^12][^11]
- **important_params:** `title_text`, `range`, `tickformat`, `showgrid`, `rangemode`.
- **gotchas:** `rangemode="tozero"` is useful for bars but not always for every chart type.[^11][^12]
- **official_docs:** [plotly.graph_objects.Figure.update_yaxes](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.update_yaxes.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Updated y-axis appearance/behavior.
    - **Relationship with Plotly Express:** Typical post-processing step for Express charts.
    - **Relationship with graph_objects:** Standard axis-level figure method.
    - **Relationship with Matplotlib:** Similar to `set_ylim` and `set_ylabel`.
    - **Relationship with Seaborn:** Similar to modifying axis properties on the underlying Matplotlib axes.
    - **Performance Notes:** Very cheap.
    - **Common Mistakes:** Forcing a zero baseline on charts where it distorts interpretation.
    - **Related APIs:** `update_xaxes`, `update_layout`, `add_hline`, `add_vrect`.


## 5) `Figure.add_trace()`

- **task:** Append a new trace to an existing figure.[^12][^11]
- **syntax:** `fig.add_trace(go.Scatter(...))`
- **example:**

```python
import plotly.express as px
import plotly.graph_objects as go

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.add_trace(go.Scatter(x=[2, 4], y=[4, 8], mode="lines", name="Reference"))
fig.show()
```

- **mental_trigger:** I need to overlay a manual series on top of an Express-generated chart.[^11][^12]
- **use_when:** Adding reference lines, benchmarks, model predictions, or special annotations as traces.[^12][^11]
- **avoid_when:** The chart can be built entirely through Plotly Express alone.[^11][^12]
- **important_params:** `trace`, `row`, `col`, `secondary_y`.
- **gotchas:** Trace type and axis compatibility must match the existing figure layout.[^12][^11]
- **official_docs:** [plotly.graph_objects.Figure.add_trace](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.add_trace.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** One more trace in the figure.
    - **Relationship with Plotly Express:** Common hybrid workflow after `px.*`.
    - **Relationship with graph_objects:** Primary manual composition method.
    - **Relationship with Matplotlib:** Similar to adding another artist or line to an axes.
    - **Relationship with Seaborn:** Similar to overlaying extra Matplotlib artists after a seaborn plot.
    - **Performance Notes:** Fine for occasional overlays; many repeated additions are slower than constructing traces upfront.
    - **Common Mistakes:** Forgetting to align x/y scales or subplot positions.
    - **Related APIs:** `add_traces`, `add_hline`, `add_vline`, `update_traces`.


## 6) `Figure.add_hline()`

- **task:** Add a horizontal reference line to a figure.[^12]
- **syntax:** `fig.add_hline(y=0)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length")
fig.add_hline(y=6, line_dash="dash", line_color="red")
fig.show()
```

- **mental_trigger:** I need a threshold or baseline across the plot.[^12]
- **use_when:** Marking targets, averages, or cutoff values.[^12]
- **avoid_when:** The baseline should be encoded in the data instead of the chart chrome.[^12]
- **important_params:** `y`, `line_dash`, `line_color`, `annotation_text`, `annotation_position`.
- **gotchas:** Works best when the y-axis is numeric and the line has a clear meaning.[^12]
- **official_docs:** [plotly.graph_objects.Figure.add_hline](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.add_hline.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** A reference line across the plot.
    - **Relationship with Plotly Express:** Commonly added after an Express chart.
    - **Relationship with graph_objects:** Convenience layer over shape/annotation configuration.
    - **Relationship with Matplotlib:** Similar to `ax.axhline`.
    - **Relationship with Seaborn:** Similar to adding a threshold line after a seaborn plot.
    - **Performance Notes:** Cheap.
    - **Common Mistakes:** Using it on a categorical axis without checking placement.
    - **Related APIs:** `add_vline`, `add_shape`, `add_annotation`, `update_layout`.


## 7) `Figure.add_vline()`

- **task:** Add a vertical reference line to a figure.[^12]
- **syntax:** `fig.add_vline(x=0)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length")
fig.add_vline(x=3, line_dash="dash", line_color="green")
fig.show()
```

- **mental_trigger:** I need a timestamp, threshold, or divider on the x-axis.[^12]
- **use_when:** Marking events, boundaries, or decision points.[^12]
- **avoid_when:** A vertical line would overload a dense categorical chart.[^12]
- **important_params:** `x`, `line_dash`, `line_color`, `annotation_text`, `annotation_position`.
- **gotchas:** As with `add_hline`, axis type and domain matter.[^12]
- **official_docs:** [plotly.graph_objects.Figure.add_vline](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.add_vline.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** A vertical reference line.
    - **Relationship with Plotly Express:** Common overlay on Express charts.
    - **Relationship with graph_objects:** Convenience wrapper around shapes.
    - **Relationship with Matplotlib:** Similar to `ax.axvline`.
    - **Relationship with Seaborn:** Similar to adding an event marker line on a seaborn figure.
    - **Performance Notes:** Cheap.
    - **Common Mistakes:** Expecting it to behave like a data trace instead of a layout shape.
    - **Related APIs:** `add_hline`, `add_shape`, `add_annotation`, `update_layout`.


## 8) `Figure.add_hrect()`

- **task:** Add a horizontal rectangular band to a figure.[^12]
- **syntax:** `fig.add_hrect(y0=1, y1=2)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length")
fig.add_hrect(y0=5.5, y1=6.5, fillcolor="rgba(255,0,0,0.1)", line_width=0)
fig.show()
```

- **mental_trigger:** I need to highlight a y-range, not just a single threshold.[^12]
- **use_when:** Showing acceptable bands, alert zones, or confidence regions.[^12]
- **avoid_when:** A line is enough and a band would distract.[^12]
- **important_params:** `y0`, `y1`, `fillcolor`, `line_width`, `annotation_text`.
- **gotchas:** Transparent fill colors are usually better than opaque ones.[^12]
- **official_docs:** [plotly.graph_objects.Figure.add_hrect](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.add_hrect.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Highlighted horizontal zone.
    - **Relationship with Plotly Express:** Often layered onto Express charts.
    - **Relationship with graph_objects:** Shape-based figure helper.
    - **Relationship with Matplotlib:** Similar to `ax.axhspan`.
    - **Relationship with Seaborn:** Similar to shading a reference band on a seaborn plot.
    - **Performance Notes:** Cheap.
    - **Common Mistakes:** Overusing colored bands until the chart becomes unreadable.
    - **Related APIs:** `add_vrect`, `add_hline`, `add_shape`, `update_layout`.


## 9) `Figure.add_vrect()`

- **task:** Add a vertical rectangular band to a figure.[^12]
- **syntax:** `fig.add_vrect(x0=1, x1=2)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length")
fig.add_vrect(x0=3, x1=3.5, fillcolor="rgba(0,0,255,0.1)", line_width=0)
fig.show()
```

- **mental_trigger:** I need to highlight an x-range such as a time window or interval.[^12]
- **use_when:** Marking ranges of interest, experiment windows, or policy periods.[^12]
- **avoid_when:** A line or annotation is sufficient.[^12]
- **important_params:** `x0`, `x1`, `fillcolor`, `line_width`, `annotation_text`.
- **gotchas:** Range rectangles are most useful when axis scale is meaningful and stable.[^12]
- **official_docs:** [plotly.graph_objects.Figure.add_vrect](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.add_vrect.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Highlighted vertical zone.
    - **Relationship with Plotly Express:** Common post-processing step.
    - **Relationship with graph_objects:** Shape helper for interval highlighting.
    - **Relationship with Matplotlib:** Similar to `ax.axvspan`.
    - **Relationship with Seaborn:** Similar to shading a time window after plotting.
    - **Performance Notes:** Cheap.
    - **Common Mistakes:** Using it as a substitute for data segmentation.
    - **Related APIs:** `add_hrect`, `add_vline`, `add_shape`, `update_layout`.


## 10) `Figure.add_annotation()`

- **task:** Add custom annotation text to a figure.[^11][^12]
- **syntax:** `fig.add_annotation(text="Note", x=1, y=2)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length")
fig.add_annotation(x=3.2, y=6.5, text="Interesting cluster", showarrow=True)
fig.show()
```

- **mental_trigger:** I need to label a point, zone, or callout.[^12]
- **use_when:** Highlighting important observations, thresholds, or story points.[^12]
- **avoid_when:** Labels should be encoded directly in the data or legend.[^12]
- **important_params:** `text`, `x`, `y`, `showarrow`, `arrowhead`.
- **gotchas:** Annotation coordinates must match the axis type and domain.[^12]
- **official_docs:** [plotly.graph_objects.Figure.add_annotation](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.add_annotation.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Text callout attached to a figure location.
    - **Relationship with Plotly Express:** Common after Express charts for story-telling or debugging.
    - **Relationship with graph_objects:** Native annotation API.
    - **Relationship with Matplotlib:** Similar to `ax.annotate`.
    - **Relationship with Seaborn:** Similar to calling `annotate` on the underlying axes.
    - **Performance Notes:** Cheap, but many annotations can clutter the chart.
    - **Common Mistakes:** Forgetting `showarrow=True` when expecting a pointer.
    - **Related APIs:** `add_hline`, `add_vline`, `add_shape`, `update_layout`.


## 11) `Figure.add_shape()`

- **task:** Add a custom geometric shape to a figure.[^12]
- **syntax:** `fig.add_shape(type="rect", x0=..., x1=..., y0=..., y1=...)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length")
fig.add_shape(type="line", x0=2, x1=4, y0=4, y1=8, line=dict(color="red", dash="dash"))
fig.show()
```

- **mental_trigger:** I need a custom overlay that is not just a line or band.[^12]
- **use_when:** Drawing boundaries, boxes, arrows, or arbitrary overlays.[^12]
- **avoid_when:** A purpose-built helper like `add_hline` or `add_vrect` is enough.[^12]
- **important_params:** `type`, `x0`, `x1`, `y0`, `y1`.
- **gotchas:** Shapes live in layout space, not as data traces.[^12]
- **official_docs:** [plotly.graph_objects.Figure.add_shape](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.add_shape.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Custom geometric overlay.
    - **Relationship with Plotly Express:** Frequently used to extend Express charts.
    - **Relationship with graph_objects:** Core layout-shape API.
    - **Relationship with Matplotlib:** Similar to adding patches or spans.
    - **Relationship with Seaborn:** Similar to overlaying shapes on axes.
    - **Performance Notes:** Cheap.
    - **Common Mistakes:** Using data coordinates incorrectly when the axis type is categorical or date-based.
    - **Related APIs:** `add_hline`, `add_vline`, `add_hrect`, `add_vrect`.


## 12) `Figure.for_each_trace()`

- **task:** Apply a function to each trace in a figure.[^12]
- **syntax:** `fig.for_each_trace(lambda t: ...)`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.for_each_trace(lambda t: t.update(marker=dict(size=10)))
fig.show()
```

- **mental_trigger:** I need conditional or repetitive changes across traces.[^12]
- **use_when:** Updating multiple traces with custom logic without manual loops.[^12]
- **avoid_when:** A single `update_traces` call can do the job.[^12]
- **important_params:** `fn`, `selector`, `row`, `col`.
- **gotchas:** The callback mutates traces in place, so side effects matter.[^12]
- **official_docs:** [plotly.graph_objects.Figure.for_each_trace](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.for_each_trace.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** The same figure object.
    - **Expected Output:** Each selected trace updated by a callback.
    - **Relationship with Plotly Express:** Useful for polishing Express output.
    - **Relationship with graph_objects:** Iterative trace-level customization.
    - **Relationship with Matplotlib:** Similar to looping over artists and editing them.
    - **Relationship with Seaborn:** Similar to iterating through axes artists after plotting.
    - **Performance Notes:** Fine for modest figures; avoid heavy Python work per trace.
    - **Common Mistakes:** Writing callbacks that assume only one trace type exists.
    - **Related APIs:** `update_traces`, `select_traces`, `for_each_annotation`.


## 13) `Figure.select_traces()`

- **task:** Retrieve traces matching a selector.[^12]
- **syntax:** `list(fig.select_traces(selector=dict(type="scatter")))`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
selected = list(fig.select_traces())
print(len(selected))
```

- **mental_trigger:** I need to inspect or filter traces programmatically.[^12]
- **use_when:** Debugging figures, testing trace counts, or targeting selected traces.[^12]
- **avoid_when:** You only need to style all traces in one shot.[^12]
- **important_params:** `selector`, `row`, `col`.
- **gotchas:** The result is an iterator, so convert it to a list if you need to reuse it.[^12]
- **official_docs:** [plotly.graph_objects.Figure.select_traces](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.select_traces.html)
- **decision_notes:**
    - **Category:** Figure customization.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** Iterator over matching traces.
    - **Expected Output:** Selected trace objects.
    - **Relationship with Plotly Express:** Helpful for inspecting Express-generated trace structure.
    - **Relationship with graph_objects:** Trace-query utility.
    - **Relationship with Matplotlib:** Similar to inspecting artists on an axes.
    - **Relationship with Seaborn:** Similar to checking artists or collections after plotting.
    - **Performance Notes:** Cheap for moderate figures.
    - **Common Mistakes:** Assuming it returns a list.
    - **Related APIs:** `for_each_trace`, `update_traces`, `add_trace`.


## 14) `Figure.write_html()`

- **task:** Export a figure to a standalone HTML file.[^14]
- **syntax:** `fig.write_html("chart.html")`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.write_html("iris_scatter.html")
```

- **mental_trigger:** I need a shareable interactive chart file.[^14]
- **use_when:** Delivering reports, archiving interactive visuals, or embedding offline dashboards.[^14]
- **avoid_when:** The output must be a static image only.[^14]
- **important_params:** `file`, `include_plotlyjs`, `full_html`, `auto_open`.
- **gotchas:** File size can grow if you embed Plotly.js repeatedly in many exports.[^14]
- **official_docs:** [plotly.graph_objects.Figure.write_html](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.write_html.html)
- **decision_notes:**
    - **Category:** Figure export.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** None.
    - **Expected Output:** HTML file on disk.
    - **Relationship with Plotly Express:** Typical export path for `px.*` figures.
    - **Relationship with graph_objects:** Native figure export method.
    - **Relationship with Matplotlib:** Similar to saving output, but preserves interactivity.
    - **Relationship with Seaborn:** Similar to exporting a seaborn figure, but richer and interactive.
    - **Performance Notes:** Good for single figures; repeated bulk export should manage JS inclusion carefully.
    - **Common Mistakes:** Expecting the HTML file to be small if self-contained.
    - **Related APIs:** `to_html`, `write_image`, `to_json`, `show`.


## 15) `Figure.write_image()`

- **task:** Export a figure as a static image.[^14]
- **syntax:** `fig.write_image("chart.png")`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.write_image("iris_scatter.png")
```

- **mental_trigger:** I need PNG, SVG, PDF, or another static export format.[^14]
- **use_when:** Reports, papers, slide decks, or print-oriented deliverables.[^14]
- **avoid_when:** You need full interactivity in the output.[^14]
- **important_params:** `file`, `format`, `width`, `height`, `scale`.
- **gotchas:** Static image export depends on the image export stack being available.[^14]
- **official_docs:** [plotly.graph_objects.Figure.write_image](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.write_image.html)
- **decision_notes:**
    - **Category:** Figure export.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** None.
    - **Expected Output:** Raster or vector image file.
    - **Relationship with Plotly Express:** The standard static export path for `px.*` figures.
    - **Relationship with graph_objects:** Native figure export method.
    - **Relationship with Matplotlib:** Comparable to `savefig`, but from an interactive figure.
    - **Relationship with Seaborn:** Similar to exporting a seaborn chart for publication.
    - **Performance Notes:** Export cost can be significant for very large or complex figures.
    - **Common Mistakes:** Missing required export dependencies.
    - **Related APIs:** `write_html`, `to_html`, `show`, `to_json`.


## 16) `Figure.to_html()`

- **task:** Convert a figure to an HTML string.[^14]
- **syntax:** `html = fig.to_html()`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
html = fig.to_html(full_html=False, include_plotlyjs="cdn")
print(html[:120])
```

- **mental_trigger:** I need to embed a Plotly figure into an existing web page or document pipeline.[^14]
- **use_when:** Building custom HTML reports or server-rendered pages.[^14]
- **avoid_when:** A file export is simpler than string handling.[^14]
- **important_params:** `full_html`, `include_plotlyjs`, `div_id`, `config`.
- **gotchas:** Large figures produce large HTML strings.[^14]
- **official_docs:** [plotly.graph_objects.Figure.to_html](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.to_html.html)
- **decision_notes:**
    - **Category:** Figure export.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** HTML string.
    - **Expected Output:** Serializable HTML markup for embedding.
    - **Relationship with Plotly Express:** Common for embedding `px.*` charts.
    - **Relationship with graph_objects:** Native serialization method.
    - **Relationship with Matplotlib:** Similar to saving a figure, but returns embeddable markup.
    - **Relationship with Seaborn:** Equivalent output goal, but with browser-native interactivity.
    - **Performance Notes:** Good for single embeds; watch payload size.
    - **Common Mistakes:** Forgetting that `include_plotlyjs="cdn"` requires network access.
    - **Related APIs:** `write_html`, `to_json`, `show`, `write_image`.


## 17) `Figure.to_json()`

- **task:** Serialize a figure to JSON.[^14]
- **syntax:** `json_str = fig.to_json()`
- **example:**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
json_str = fig.to_json()
print(json_str[:120])
```

- **mental_trigger:** I need to store, transport, or inspect the figure structure programmatically.[^14]
- **use_when:** Caching, testing, figure diffing, or API transport.[^14]
- **avoid_when:** You only need visual output.[^14]
- **important_params:** `pretty`, `validate`, `remove_uids`, `engine`.
- **gotchas:** JSON serialization is useful for state, not rendering.[^14]
- **official_docs:** [plotly.graph_objects.Figure.to_json](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.to_json.html)
- **decision_notes:**
    - **Category:** Figure export.
    - **Module:** `plotly.graph_objects.Figure`.
    - **Return Value:** JSON string.
    - **Expected Output:** Serialized figure specification.
    - **Relationship with Plotly Express:** Useful for storing or comparing Express-generated figures.
    - **Relationship with graph_objects:** Native serialization method.
    - **Relationship with Matplotlib:** Similar to saving a figure specification, not an image.
    - **Relationship with Seaborn:** No direct equivalent; typically used for interactivity/serialization instead of rendering.
    - **Performance Notes:** Lightweight compared with image export.
    - **Common Mistakes:** Treating JSON output as a rendered artifact.
    - **Related APIs:** `to_html`, `write_html`, `write_image`, `show`.


## 18) `go.Figure()`

- **task:** Create an empty figure or build one from traces/layout.[^13][^12]
- **syntax:** `fig = go.Figure()`
- **example:**

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(x=[1, 2, 3], y=[2, 1, 4], mode="lines+markers"))
fig.show()
```

- **mental_trigger:** I need to build a chart manually rather than through Plotly Express.[^13][^12]
- **use_when:** Starting a low-level graph_objects workflow or composing custom traces.[^13][^12]
- **avoid_when:** A standard Express chart already solves the task cleanly.[^11][^12]
- **important_params:** `data`, `layout`, `frames`, `skip_invalid`, `validate`.
- **gotchas:** Manual figures require more explicit setup than Express.[^13][^12]
- **official_docs:** [plotly.graph_objects.Figure](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html)
- **decision_notes:**
    - **Category:** Figure construction.
    - **Module:** `plotly.graph_objects`.
    - **Return Value:** `Figure`.
    - **Expected Output:** Empty or prepopulated figure container.
    - **Relationship with Plotly Express:** Express returns this object.
    - **Relationship with graph_objects:** Core container type.
    - **Relationship with Matplotlib:** Similar to creating a Figure object before adding axes/artists.
    - **Relationship with Seaborn:** Less direct; Seaborn usually abstracts this away.
    - **Performance Notes:** Minimal overhead.
    - **Common Mistakes:** Starting with graph_objects when Express would have been simpler.
    - **Related APIs:** `add_trace`, `update_layout`, `add_traces`, `show`.


## 19) `go.Scatter`

- **task:** Create a low-level scatter trace.[^13][^12]
- **syntax:** `go.Scatter(x=[...], y=[...], mode="markers")`
- **example:**

```python
import plotly.graph_objects as go

fig = go.Figure(
    go.Scatter(
        x=[1, 2, 3],
        y=[2, 1, 4],
        mode="markers+lines",
        name="Series"
    )
)
fig.show()
```

- **mental_trigger:** I need direct control over a scatter trace.[^13][^12]
- **use_when:** Building custom overlays, composite charts, or traces not covered by Express.[^13][^12]
- **avoid_when:** The chart maps cleanly to `px.scatter` and no low-level control is needed.[^11][^12]
- **important_params:** `x`, `y`, `mode`, `name`, `marker`.
- **gotchas:** Unlike Express, you must specify trace behavior more explicitly.[^13][^12]
- **official_docs:** [plotly.graph_objects.Scatter](https://plotly.com/python-api-reference/generated/plotly.graph_objects.Scatter.html)
- **decision_notes:**
    - **Category:** Trace constructor.
    - **Module:** `plotly.graph_objects`.
    - **Return Value:** Trace object.
    - **Expected Output:** Scatter trace to place inside a figure.
    - **Relationship with Plotly Express:** One of the primitive trace types Express often produces internally.
    - **Relationship with graph_objects:** Core trace primitive.
    - **Relationship with Matplotlib:** Similar to creating line/marker artists directly.
    - **Relationship with Seaborn:** Similar to lower-level plot construction after semantic mapping is resolved.
    - **Performance Notes:** Efficient, but you are responsible for trace-level configuration.
    - **Common Mistakes:** Forgetting `mode` when expecting markers or lines to appear.
    - **Related APIs:** `go.Figure`, `go.Bar`, `go.Histogram`, `Figure.add_trace`.


## 20) `make_subplots()`

- **task:** Create a subplot grid for multiple traces or mixed chart layouts.[^13]
- **syntax:** `fig = make_subplots(rows=1, cols=2)`
- **example:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(rows=1, cols=2, subplot_titles=("Left", "Right"))
fig.add_trace(go.Scatter(x=[1, 2, 3], y=[1, 4, 2]), row=1, col=1)
fig.add_trace(go.Bar(x=["A", "B", "C"], y=[3, 1, 2]), row=1, col=2)
fig.show()
```

- **mental_trigger:** I need multiple coordinated charts in one figure.[^13]
- **use_when:** Dashboards, multi-panel reports, or hybrid layouts that Express faceting cannot express well.[^13][^12]
- **avoid_when:** A single Plotly Express facet function already gives the layout you need.[^11][^12]
- **important_params:** `rows`, `cols`, `shared_xaxes`, `shared_yaxes`, `subplot_titles`.
- **gotchas:** Subplots require axis-aware trace placement and can be more manual than Express faceting.[^13][^12]
- **official_docs:** [plotly.subplots.make_subplots](https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html)
- **decision_notes:**
    - **Category:** Figure composition.
    - **Module:** `plotly.subplots`.
    - **Return Value:** Figure with subplot grid.
    - **Expected Output:** Multi-panel figure.
    - **Relationship with Plotly Express:** Use when facetting is not enough or when combining heterogeneous traces.
    - **Relationship with graph_objects:** Core helper for manual multi-axes layout.
    - **Relationship with Matplotlib:** Similar to `plt.subplots`.
    - **Relationship with Seaborn:** Similar to building a custom FacetGrid-style layout, but more manual.
    - **Performance Notes:** Good for moderate grids; large grids increase layout complexity.
    - **Common Mistakes:** Adding traces to the wrong row/column.
    - **Related APIs:** `go.Figure`, `add_trace`, `update_xaxes`, `update_yaxes`.

If you want, I can turn this into a fully formatted AENS resource markdown block with consistent fields and cross-link style matching your existing Plotly package document.
<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: seaborn.md

[^2]: AENS-Knowledge-Layer-Specification.md

[^3]: CURRENT_PROJECT_STATE_REPORT.md

[^4]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^5]: https://arxiv.org/pdf/2104.01032.pdf

[^6]: http://conference.scipy.org/proceedings/scipy2018/pdfs/jon_mease.pdf

[^7]: https://arxiv.org/pdf/2206.08703.pdf

[^8]: http://conference.scipy.org/proceedings/scipy2019/pdfs/shammamah_hossain.pdf

[^9]: https://joss.theoj.org/papers/10.21105/joss.01774.pdf

[^10]: http://conference.scipy.org/proceedings/scipy2015/pdfs/luke_campagnola-vispy.pdf

[^11]: https://plotly.com/python/plotly-express/

[^12]: https://plotly.com/python-api-reference/plotly.express.html

[^13]: https://plotly.com/python-api-reference/

[^14]: https://plotly.com/python-api-reference/generated/plotly.io.html

