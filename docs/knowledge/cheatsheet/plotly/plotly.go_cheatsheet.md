---
id: plotly-graph-objects-cheatsheet-2026-07-06
title: Plotly Graph Objects Cheatsheet — 70 Production Entries
slug: plotly-graph-objects-cheatsheet
name: plotly.graph_objects Cheatsheet
description: Canonical Plotly Graph Objects cheatsheet for AENS, focused on figure-centric syntax recall, production workflows, and copy-paste snippets for plotly.py 6.8.0.
package_reference: plotly.graph_objects (plotly.py)
version: 6.8.0
sources:
  - https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html
  - https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html
  - https://plotly.github.io/plotly.py-docs/generated/plotly.graph_objects.Scattergl.html
  - https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html
  - https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.add_traces.html
created_at: 2026-07-06
updated_at: 2026-07-06
---

# Plotly Graph Objects Cheatsheet

Plotly graph_objects is the figure-centric, low-level Plotly API for composing production figures, subplots, traces, annotations, and layout. This cheatsheet is organized by engineering task and keeps each entry narrow for fast recall. [web:35][web:40][web:37]

## Imports

### 1. Import graph_objects
**Problem:** Start a graph_objects workflow.  
**Trigger:** When you need manual figure composition instead of a high-level interface.  
**Snippet:**
```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = go.Figure()
fig.show()
```

**Minimal Notes:** Use go for traces and Figure, and make_subplots for subplot grids. This is the standard import pair. [web:35][web:40]
**Common Bug:** Forgetting make_subplots when targeting multiple panels.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Figure lifecycle

### 2. Create an empty figure

**Problem:** Initialize a blank figure for manual trace assembly.
**Trigger:** When building a plot step-by-step.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.show()
```

**Minimal Notes:** This is the most common base object in graph_objects. Add traces and layout afterward. [web:35]
**Common Bug:** Assuming a blank figure has default axes, titles, or data.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 3. Create a figure with initial data

**Problem:** Start a figure from one or more trace objects.
**Trigger:** When the chart has a known base trace set.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(data=[
    go.Scatter(x=, y=, mode="lines+markers", name="series")[^1][^2][^3]
])
fig.show()
```

**Minimal Notes:** data accepts trace instances or trace dicts. This is the simplest object-oriented bootstrap. [web:35]
**Common Bug:** Passing raw arrays to data instead of trace objects.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 4. Create a figure with layout only

**Problem:** Define presentation settings before data arrives.
**Trigger:** When a template or dashboard shell is created first.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(layout=go.Layout(title="Empty shell", template="plotly_white"))
fig.show()
```

**Minimal Notes:** layout can be provided up front. Add traces later. [web:35]
**Common Bug:** Expecting layout-only figures to render meaningful content.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 5. Create an animated figure from frames

**Problem:** Build a figure with explicit animation frames.
**Trigger:** When animation structure must be controlled manually.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(
    data=[go.Scatter(x=, y=, mode="markers")],
    frames=[
        go.Frame(data=[go.Scatter(x=, y=)], name="f1"),[^1]
        go.Frame(data=[go.Scatter(x=, y=)], name="f2"),[^2][^1]
    ],
)
fig.show()
```

**Minimal Notes:** frames holds frame definitions used by sliders and updatemenus. Keep frame data small. [web:35]
**Common Bug:** Creating frames without controls to step through them.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Trace management

### 6. Add a single trace

**Problem:** Attach one trace to an existing figure.
**Trigger:** When building a figure incrementally.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(x=, y=, mode="lines+markers", name="line"))[^3][^2][^1]
fig.show()
```

**Minimal Notes:** add_trace is the standard single-trace method. It is row/col aware for subplot figures. [web:37][web:43]
**Common Bug:** Adding a trace to the wrong subplot because row and col were omitted.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.add_traces.html [web:43]

### 7. Add multiple traces at once

**Problem:** Insert a batch of traces efficiently.
**Trigger:** When several series belong to the same figure update.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_traces([
    go.Scatter(x=, y=, name="A"),[^2][^3][^1]
    go.Bar(x=["a", "b", "c"], y=, name="B"),[^3][^1][^2]
])
fig.show()
```

**Minimal Notes:** add_traces is useful for batch composition. It is cleaner than repeated add_trace calls. [web:43]
**Common Bug:** Adding mismatched trace types without checking subplot compatibility.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.add_traces.html [web:43]

### 8. Update all traces

**Problem:** Apply a consistent patch to every trace.
**Trigger:** When standardizing appearance across a figure.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_traces([
    go.Scatter(x=, y=, mode="markers", name="A"),[^1][^2][^3]
    go.Scatter(x=, y=, mode="markers", name="B"),[^2][^3][^1]
])
fig.update_traces(marker=dict(size=12, opacity=0.8))
fig.show()
```

**Minimal Notes:** update_traces broadcasts a patch across matching traces. Combine with selector for precision. [web:35][web:42]
**Common Bug:** Changing every trace when only one series should be affected.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 9. Update selected traces

**Problem:** Modify only traces that match a filter.
**Trigger:** When traces differ by type, name, or index.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure([
    go.Scatter(x=, y=, name="line"),[^3][^1][^2]
    go.Bar(x=, y=, name="bars"),[^1][^2][^3]
])
fig.update_traces(selector=dict(type="scatter"), line=dict(width=3))
fig.show()
```

**Minimal Notes:** selector narrows the patch to trace subsets. This is safer than global updates. [web:35][web:42]
**Common Bug:** Using a selector that matches no traces and silently changing nothing.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 10. Select traces for inspection

**Problem:** Pull out traces matching criteria.
**Trigger:** When code needs to inspect or modify only a subset.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure([
    go.Scatter(x=, y=, name="A"),[^2][^3][^1]
    go.Scatter(x=, y=, name="B"),[^3][^1][^2]
])
selected = fig.select_traces(selector=dict(type="scatter"))
print(len(list(selected)))
```

**Minimal Notes:** select_traces is useful for programmatic figure logic. It pairs well with update_traces. [web:35]
**Common Bug:** Assuming select_traces returns a single trace instead of an iterable.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 11. Iterate over traces

**Problem:** Apply custom logic to every trace.
**Trigger:** When updates cannot be expressed as one patch.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure([
    go.Scatter(x=, y=, name="A"),[^1][^2][^3]
    go.Scatter(x=, y=, name="B"),[^2][^3][^1]
])
fig.for_each_trace(lambda t: t.update(visible=True))
fig.show()
```

**Minimal Notes:** for_each_trace is the ergonomic loop helper. Use it for conditional styling. [web:35]
**Common Bug:** Mutating traces while expecting return values from the callback.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Subplots

### 12. Create a basic subplot grid

**Problem:** Place multiple charts into one figure.
**Trigger:** When comparing related views in a dashboard-like layout.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(rows=2, cols=1)
fig.add_trace(go.Scatter(x=, y=, name="top"), row=1, col=1)[^3][^1][^2]
fig.add_trace(go.Bar(x=, y=, name="bottom"), row=2, col=1)[^1][^2][^3]
fig.show()
```

**Minimal Notes:** make_subplots returns a Figure with prepared subplot axes. Add traces with row and col. [web:40]
**Common Bug:** Adding traces to a subplot grid without specifying row and col.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 13. Share x-axes across rows

**Problem:** Link x-axis zooming across stacked plots.
**Trigger:** When time alignment must stay synchronized.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(rows=2, cols=1, shared_xaxes=True)
fig.add_trace(go.Scatter(x=, y=), row=1, col=1)[^2][^3][^1]
fig.add_trace(go.Scatter(x=, y=), row=2, col=1)[^3][^1][^2]
fig.show()
```

**Minimal Notes:** shared_xaxes keeps the x domain aligned. Use it for time-series panels. [web:40]
**Common Bug:** Using separate x-axes when synchronized zoom is expected.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 14. Share y-axes across columns

**Problem:** Compare traces using the same y scale.
**Trigger:** When magnitudes must be visually comparable.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(rows=1, cols=2, shared_yaxes=True)
fig.add_trace(go.Scatter(x=, y=), row=1, col=1)[^1][^2][^3]
fig.add_trace(go.Scatter(x=, y=), row=1, col=2)[^4][^5][^2][^3][^1]
fig.show()
```

**Minimal Notes:** shared_yaxes is important for consistent comparisons. It prevents misleading scale differences. [web:40]
**Common Bug:** Comparing panels with different y scaling unintentionally.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 15. Add a secondary y-axis subplot

**Problem:** Overlay series with different units.
**Trigger:** When one subplot needs a right-side scale.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(specs=[[{"secondary_y": True}]])
fig.add_trace(go.Scatter(x=, y=, name="left"), secondary_y=False)[^6][^7][^8][^2][^3][^1]
fig.add_trace(go.Bar(x=, y=, name="right"), secondary_y=True)[^2][^3][^1]
fig.show()
```

**Minimal Notes:** secondary_y is only valid in xy subplots. Use it for heterogeneous units. [web:40][web:43]
**Common Bug:** Adding a secondary axis without configuring specs correctly.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 16. Use mixed subplot types

**Problem:** Combine Cartesian, polar, 3D, and domain-based views.
**Trigger:** When one figure needs multiple visualization modalities.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(
    rows=2, cols=2,
    specs=[[{"type": "xy"}, {"type": "polar"}],
           [{"type": "scene"}, {"type": "domain"}]]
)
fig.add_trace(go.Scatter(x=, y=), row=1, col=1)[^3][^1][^2]
fig.add_trace(go.Scatterpolar(r=, theta=), row=1, col=2)[^1][^2][^3]
fig.add_trace(go.Scatter3d(x=, y=, z=), row=2, col=1)[^2][^3][^1]
fig.add_trace(go.Pie(labels=["A", "B"], values=), row=2, col=2)[^9]
fig.show()
```

**Minimal Notes:** specs controls subplot type per cell. Domain subplots are used for pie and similar traces. [web:40][web:35]
**Common Bug:** Assigning a trace to the wrong subplot type.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 17. Control subplot spacing

**Problem:** Tune whitespace between panels.
**Trigger:** When figure density needs adjustment.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(rows=2, cols=2, horizontal_spacing=0.05, vertical_spacing=0.08)
fig.add_trace(go.Scatter(x=, y=), row=1, col=1)[^3][^1][^2]
fig.add_trace(go.Scatter(x=, y=), row=1, col=2)[^1][^2][^3]
fig.add_trace(go.Scatter(x=, y=), row=2, col=1)[^2][^3][^1]
fig.add_trace(go.Scatter(x=, y=), row=2, col=2)[^4][^3][^1][^2]
fig.show()
```

**Minimal Notes:** Use spacing controls before resorting to manual layout edits. Smaller gaps increase density. [web:40]
**Common Bug:** Making panel gaps so small that labels overlap.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 18. Add subplot titles

**Problem:** Label each panel clearly.
**Trigger:** When a multi-panel figure needs immediate readability.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(rows=1, cols=2, subplot_titles=("Left panel", "Right panel"))
fig.add_trace(go.Scatter(x=, y=), row=1, col=1)[^3][^1][^2]
fig.add_trace(go.Scatter(x=, y=), row=1, col=2)[^1][^2][^3]
fig.show()
```

**Minimal Notes:** subplot_titles is the fastest panel labeling path. Use it for comparison layouts. [web:40]
**Common Bug:** Repeating titles in both subplot_titles and layout title unnecessarily.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 19. Create inset axes

**Problem:** Overlay a zoomed-in subplot on top of another plot.
**Trigger:** When detail needs to be highlighted without a second page.
**Snippet:**

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

fig = make_subplots(insets=[{"cell": (1, 1), "l": 0.65, "b": 0.55, "w": 0.3, "h": 0.3}])
fig.add_trace(go.Scatter(x=, y=), row=1, col=1)[^2][^3][^1]
fig.add_trace(go.Scatter(x=, y=[2.1, 2.2, 2.4], xaxis="x2", yaxis="y2"))[^3][^1][^2]
fig.show()
```

**Minimal Notes:** Insets are for compact overlays. Keep the inset content focused. [web:40]
**Common Bug:** Using an inset for too much data and obscuring the base plot.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

## Layout

### 20. Update layout

**Problem:** Change figure-wide presentation properties.
**Trigger:** When titles, legends, and margins need final control.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^1][^2][^3]
fig.update_layout(
    title="Production figure",
    template="plotly_white",
    width=900,
    height=500,
    margin=dict(l=40, r=20, t=60, b=40)
)
fig.show()
```

**Minimal Notes:** update_layout is the main figure styling entry. It supports recursive updates. [web:42]
**Common Bug:** Overwriting layout settings accidentally when repeatedly calling update_layout.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 21. Configure title and subtitle

**Problem:** Add figure-level context.
**Trigger:** When the output needs a report-ready heading.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^2][^3][^1]
fig.update_layout(
    title=dict(text="Main title", x=0.5),
    template="plotly_white"
)
fig.show()
```

**Minimal Notes:** Title is usually configured in layout. Use x to center it when needed. [web:42][web:41]
**Common Bug:** Using multiple competing title systems in one figure.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 22. Configure legend placement

**Problem:** Position and orient the legend cleanly.
**Trigger:** When default legend placement blocks data.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure([
    go.Scatter(x=, y=, name="A"),[^3][^1][^2]
    go.Scatter(x=, y=, name="B"),[^1][^2][^3]
])
fig.update_layout(
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)
fig.show()
```

**Minimal Notes:** Legend can be moved out of the plotting area. Horizontal legends are common in reports. [web:41][web:42]
**Common Bug:** Leaving the legend inside a crowded plot and covering data.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 23. Set fonts globally

**Problem:** Enforce typography across the figure.
**Trigger:** When charts need consistent publication styling.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^2][^3][^1]
fig.update_layout(font=dict(family="Arial", size=14, color="black"))
fig.show()
```

**Minimal Notes:** font affects titles, axes, and legend text. Use one project-wide font choice. [web:41][web:42]
**Common Bug:** Mixing incompatible fonts between exported images and browser rendering.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 24. Set templates

**Problem:** Apply a reusable figure theme.
**Trigger:** When multiple charts need the same style baseline.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^3][^1][^2]
fig.update_layout(template="plotly_white")
fig.show()
```

**Minimal Notes:** Templates reduce repeated layout code. They are preferred in production workflows. [web:41][web:42]
**Common Bug:** Mixing template styling with many one-off overrides.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 25. Set figure size

**Problem:** Control width and height for notebooks or exports.
**Trigger:** When layout dimensions must be deterministic.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^1][^2][^3]
fig.update_layout(width=1000, height=600)
fig.show()
```

**Minimal Notes:** Set size explicitly for consistent exports. Avoid relying on renderer defaults. [web:41][web:42]
**Common Bug:** Ignoring the target aspect ratio until export time.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 26. Set margins and background

**Problem:** Adjust figure whitespace and canvas colors.
**Trigger:** When preparing figures for dashboards or slides.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^2][^3][^1]
fig.update_layout(
    margin=dict(l=30, r=30, t=50, b=30),
    paper_bgcolor="white",
    plot_bgcolor="#F8F8F8"
)
fig.show()
```

**Minimal Notes:** paper_bgcolor affects the whole canvas; plot_bgcolor affects the plotting area. Use both deliberately. [web:41][web:42]
**Common Bug:** Making the plot background and paper background clash visually.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 27. Set hover behavior globally

**Problem:** Control hover behavior across traces.
**Trigger:** When interactive readouts need consistency.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=, mode="markers"))[^3][^1][^2]
fig.update_layout(hovermode="x unified")
fig.show()
```

**Minimal Notes:** hovermode changes how hover labels are grouped. Unified hover is common for time series. [web:41][web:42]
**Common Bug:** Using the wrong hovermode for dense multi-trace figures.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 28. Set drag mode

**Problem:** Configure how users interact with the plot.
**Trigger:** When panning or zooming behavior matters.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=, mode="markers"))[^1][^2][^3]
fig.update_layout(dragmode="zoom")
fig.show()
```

**Minimal Notes:** dragmode can be tuned for exploration workflows. Default behavior depends on the renderer. [web:41][web:42]
**Common Bug:** Accidentally setting dragmode in a way that blocks expected zooming.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

## Axes

### 29. Update x-axis range and type

**Problem:** Control x-axis scale and visible window.
**Trigger:** When the axis must be linear, logarithmic, date-based, or range-limited.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^6][^2][^3][^1]
fig.update_xaxes(type="log", range=, title="Log x")[^2]
fig.show()
```

**Minimal Notes:** update_xaxes is the cleanest axis API. Use it instead of raw layout edits. [web:41][web:42]
**Common Bug:** Using log axes with zero or negative values.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 30. Update y-axis range and autorange

**Problem:** Adjust y-axis view and auto scaling.
**Trigger:** When zoom behavior or plot extents need control.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^5][^4][^3][^1][^2]
fig.update_yaxes(range=, autorange=False, title="Value")[^10]
fig.show()
```

**Minimal Notes:** autorange=False makes ranges deterministic. This is useful for dashboards. [web:41][web:42]
**Common Bug:** Forgetting to disable autorange when a fixed range is intended.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 31. Configure ticks explicitly

**Problem:** Control axis tick values and labels.
**Trigger:** When categories or milestones must appear exactly.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^11][^12][^6][^3][^1][^2]
fig.update_xaxes(tickmode="array", tickvals=, ticktext=["one", "two", "three"])[^3][^1][^2]
fig.show()
```

**Minimal Notes:** tickmode='array' gives full control. Use it for custom labeling. [web:41][web:42]
**Common Bug:** Setting ticktext without matching tickvals.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 32. Add grid and zero lines

**Problem:** Improve axis readability and reference context.
**Trigger:** When precise comparisons require visual guides.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=[-1, 0, 1], y=))[^2][^3]
fig.update_xaxes(showgrid=True, zeroline=True)
fig.update_yaxes(showgrid=True, zeroline=True)
fig.show()
```

**Minimal Notes:** Grid and zero lines help with interpretation. Keep them subtle in production output. [web:41][web:42]
**Common Bug:** Overpowering the data with heavy grid styling.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 33. Lock axis scale and aspect

**Problem:** Preserve equal scaling between x and y.
**Trigger:** When geometry must be visually accurate.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=, mode="markers"))[^1][^2]
fig.update_yaxes(scaleanchor="x", scaleratio=1)
fig.show()
```

**Minimal Notes:** scaleanchor is essential for equal-aspect plots. Use it for spatial or metric comparisons. [web:41][web:42]
**Common Bug:** Forgetting that equal-aspect scaling can distort layout expectations.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

## Annotations and shapes

### 34. Add an annotation

**Problem:** Label a specific point or region.
**Trigger:** When commentary must be embedded in the plot.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=, mode="markers"))[^3][^1][^2]
fig.add_annotation(x=2, y=1, text="Peak", showarrow=True, arrowhead=2)
fig.show()
```

**Minimal Notes:** add_annotation is the direct way to place callouts. Use showarrow only when pointing matters. [web:35]
**Common Bug:** Anchoring annotation coordinates to the wrong axis reference.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 35. Add a horizontal line

**Problem:** Mark a threshold across the full plot width.
**Trigger:** When a target, baseline, or limit must be visible.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^1][^2][^3]
fig.add_hline(y=2, line_dash="dash", line_color="red")
fig.show()
```

**Minimal Notes:** add_hline is the fastest threshold marker. It is layout-aware and subplot-friendly. [web:35]
**Common Bug:** Using a regular shape line when hline is simpler and clearer.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 36. Add a vertical line

**Problem:** Mark a key x position.
**Trigger:** When event times or cutoffs need emphasis.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^2][^3][^1]
fig.add_vline(x=2, line_dash="dash", line_color="blue")
fig.show()
```

**Minimal Notes:** add_vline is ideal for event markers. Keep labels concise. [web:35]
**Common Bug:** Drawing the line in the wrong axis space on subplot figures.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 37. Add a horizontal rectangle

**Problem:** Highlight a y-range band.
**Trigger:** When tolerance or target bands matter.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^3][^1][^2]
fig.add_hrect(y0=1.2, y1=2.2, fillcolor="green", opacity=0.2, line_width=0)
fig.show()
```

**Minimal Notes:** hrect is useful for ranges and acceptable zones. Use low opacity. [web:35]
**Common Bug:** Making the fill too opaque and hiding the traces.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 38. Add a vertical rectangle

**Problem:** Highlight an x-range band.
**Trigger:** When a time window or region needs emphasis.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^1][^2][^3]
fig.add_vrect(x0=1.2, x1=2.2, fillcolor="orange", opacity=0.2, line_width=0)
fig.show()
```

**Minimal Notes:** vrect is the x-range companion to hrect. It is commonly used for windows and periods. [web:35]
**Common Bug:** Using a shape instead of vrect when the intent is a range band.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 39. Add an arbitrary shape

**Problem:** Draw custom geometry beyond lines and rectangles.
**Trigger:** When the figure needs a precise overlay.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^2][^3][^1]
fig.add_shape(type="circle", x0=1.4, x1=2.0, y0=1.0, y1=2.0, line=dict(color="purple"))
fig.show()
```

**Minimal Notes:** add_shape covers custom overlays. Use coordinate references carefully. [web:35]
**Common Bug:** Drawing shapes in paper coordinates when data coordinates were intended.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Common trace types

### 40. Create a scatter trace

**Problem:** Plot markers or lines on Cartesian axes.
**Trigger:** When most 2D plots begin as a scatter trace.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=, mode="lines+markers", name="series"))[^3][^1][^2]
fig.show()
```

**Minimal Notes:** Scatter is the foundation trace for many XY figures. Use mode to control mark style. [web:35]
**Common Bug:** Forgetting mode and getting the default trace appearance.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 41. Create a bar trace

**Problem:** Show categorical magnitudes.
**Trigger:** When values belong to named categories.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Bar(x=["A", "B", "C"], y=, name="bars"))[^1][^2][^3]
fig.show()
```

**Minimal Notes:** Bar traces are the standard category comparison trace. Use orientation for horizontal bars. [web:35]
**Common Bug:** Forgetting that stacked or grouped behavior depends on layout barmode.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 42. Create a histogram trace

**Problem:** Bin raw numeric data directly in graph_objects.
**Trigger:** When the figure needs built-in frequency binning.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Histogram(x=, nbinsx=5))[^5][^4][^2][^3][^1]
fig.show()
```

**Minimal Notes:** Histogram bins data in the trace itself. This is useful for quick distributions. [web:35]
**Common Bug:** Comparing histograms without controlling bin settings.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 43. Create a box trace

**Problem:** Show quartiles and outliers in one trace.
**Trigger:** When distribution shape is important.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Box(y=, name="box"))[^13][^10][^4][^2][^3][^1]
fig.show()
```

**Minimal Notes:** Box traces are concise summary traces. They work well in grouped figures. [web:35]
**Common Bug:** Interpreting a box trace with too few observations as robust.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 44. Create a violin trace

**Problem:** Show distribution density with shape detail.
**Trigger:** When a box plot is too coarse.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Violin(y=, box_visible=True, meanline_visible=True, name="violin"))[^10][^13][^4][^2][^3][^1]
fig.show()
```

**Minimal Notes:** Violin traces expose distribution shape. Adding box_visible is common for production use. [web:35]
**Common Bug:** Drawing too many violins and crowding the axis.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 45. Create a heatmap trace

**Problem:** Show matrix values in a 2D grid.
**Trigger:** When correlation or intensity matrices are needed.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Heatmap(z=[, ], colorscale="Viridis"))[^2][^3][^1]
fig.show()
```

**Minimal Notes:** Heatmaps are the main matrix trace. Control colorscale for readability. [web:35]
**Common Bug:** Not labeling axes for matrix interpretation.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 46. Create a contour trace

**Problem:** Draw contour lines for a scalar field.
**Trigger:** When isolines are more useful than filled cells.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Contour(z=[,, ], contours_coloring="lines"))[^3][^1][^2]
fig.show()
```

**Minimal Notes:** Contour is the line-based scalar field trace. Pair with heatmap only when needed. [web:35]
**Common Bug:** Overcomplicating the contour settings for a simple overview.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 47. Create a surface trace

**Problem:** Render a 3D surface from a matrix.
**Trigger:** When a continuous response surface needs 3D display.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Surface(z=[,, ]))[^1][^2][^3]
fig.show()
```

**Minimal Notes:** Surface traces are intended for 3D scene figures. Keep meshes reasonably sized. [web:35]
**Common Bug:** Using too many grid points and slowing rendering.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 48. Create a mesh3d trace

**Problem:** Render a triangular 3D mesh.
**Trigger:** When the object is defined by vertices and faces.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Mesh3d(
    x=,[^1]
    y=,[^1]
    z=,[^1]
    i=,[^1]
    j=,[^2][^3][^1]
    k=,[^3][^2][^1]
))
fig.show()
```

**Minimal Notes:** Mesh3d is for volumetric surface meshes. Index arrays define faces. [web:35]
**Common Bug:** Mismatching face indices and vertex counts.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 49. Create a 3D scatter trace

**Problem:** Plot points in 3D space.
**Trigger:** When three coordinates are required.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter3d(x=, y=, z=, mode="markers"))[^2][^3][^1]
fig.show()
```

**Minimal Notes:** Scatter3d belongs to scene subplots. It is the default 3D point trace. [web:35]
**Common Bug:** Adding a 3D trace to a 2D subplot.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 50. Create a polar scatter trace

**Problem:** Plot radial and angular coordinates.
**Trigger:** When directional data must be shown in a circular frame.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatterpolar(r=, theta=, mode="lines+markers"))[^3][^2][^1]
fig.show()
```

**Minimal Notes:** Scatterpolar belongs in polar subplots. Keep angular units consistent. [web:40][web:35]
**Common Bug:** Mixing degrees and radians without normalization.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html [web:40]

### 51. Create a geographic scatter trace

**Problem:** Plot points on a geographic projection.
**Trigger:** When lat/lon data must be displayed on a world map.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scattergeo(lat=[23.81, 22.36], lon=[90.41, 91.80], mode="markers"))
fig.show()
```

**Minimal Notes:** Scattergeo is the stable geographic point trace. Use it for map-based point data. [web:35]
**Common Bug:** Swapping latitude and longitude columns.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 52. Create a choropleth trace

**Problem:** Shade regions by value.
**Trigger:** When region identifiers and values map to a geography.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Choropleth(
    locations=["USA", "CAN", "MEX"],
    z=,[^7][^11][^6]
    locationmode="ISO-3",
    colorscale="Viridis"
))
fig.show()
```

**Minimal Notes:** Choropleth requires correct location codes and a color scale. Use z for the numeric field. [web:35]
**Common Bug:** Using the wrong locationmode for your identifiers.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 53. Create an indicator trace

**Problem:** Show a KPI or single numeric status.
**Trigger:** When dashboard summaries need a compact metric tile.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Indicator(mode="number+delta", value=82, delta={"reference": 75}, title={"text": "Conversion"}))
fig.show()
```

**Minimal Notes:** Indicator traces are ideal for KPI display. Keep the number of indicators small. [web:35]
**Common Bug:** Using an indicator when time-series context is still required.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 54. Create a table trace

**Problem:** Display structured tabular output inside a figure.
**Trigger:** When a chart needs an embedded report table.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Table(
    header=dict(values=["A", "B"]),
    cells=dict(values=[, ["x", "y", "z"]])[^2][^3][^1]
))
fig.show()
```

**Minimal Notes:** Table is a domain trace. It works well in dashboards and summaries. [web:35]
**Common Bug:** Using Table for large datasets instead of a data grid.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 55. Create a candlestick chart

**Problem:** Show OHLC price movements.
**Trigger:** When financial time-series data is open-high-low-close.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Candlestick(
    x=["2026-01-01", "2026-01-02", "2026-01-03"],
    open=,[^14][^15][^6]
    high=,[^8][^15][^16]
    low=,[^13][^14][^6]
    close=[^15][^8][^14]
))
fig.show()
```

**Minimal Notes:** Candlestick is the standard OHLC trace. Use datetime axes when possible. [web:35]
**Common Bug:** Misordering open, high, low, and close arrays.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 56. Create a waterfall chart

**Problem:** Show cumulative increases and decreases.
**Trigger:** When a sequence of deltas leads to a total.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Waterfall(
    x=["Revenue", "Costs", "Taxes", "Profit"],
    y=[100, -40, -10, 50]
))
fig.show()
```

**Minimal Notes:** Waterfall is the standard delta trace. Use it for financial or operational decomposition. [web:35]
**Common Bug:** Mixing pre-aggregated totals and step changes incorrectly.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 57. Create a funnel trace

**Problem:** Show a staged pipeline with decreasing values.
**Trigger:** When a process narrows through stages.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Funnel(y=["Visit", "Signup", "Trial", "Paid"], x=))
fig.show()
```

**Minimal Notes:** Funnel traces are compact for progression analysis. Keep the stage order deliberate. [web:35]
**Common Bug:** Reordering stages and changing the funnel meaning.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 58. Create a pie trace

**Problem:** Show simple composition.
**Trigger:** When the number of categories is small.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Pie(labels=["A", "B", "C"], values=))[^12][^11]
fig.show()
```

**Minimal Notes:** Pie is for simple part-to-whole summaries. Use it sparingly. [web:35]
**Common Bug:** Using pie charts for many categories.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 59. Create a sunburst trace

**Problem:** Show hierarchy in a radial layout.
**Trigger:** When tree structure must be compactly displayed.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Sunburst(labels=["A", "B", "C"], parents=["", "A", "A"], values=))[^10][^4][^6]
fig.show()
```

**Minimal Notes:** Sunburst is a domain trace for hierarchy. Parent relationships must be correct. [web:35]
**Common Bug:** Building inconsistent parent-child relationships.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 60. Create a treemap trace

**Problem:** Show hierarchy as nested rectangles.
**Trigger:** When dense hierarchical structure needs a compact display.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Treemap(labels=["A", "B", "C"], parents=["", "A", "A"], values=))[^4][^6][^10]
fig.show()
```

**Minimal Notes:** Treemap is useful for compact hierarchical summaries. Keep labels short. [web:35]
**Common Bug:** Overloading the treemap with too many sibling nodes.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 61. Create an icicle trace

**Problem:** Show hierarchy in a top-down layout.
**Trigger:** When hierarchical levels need visual separation.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Icicle(labels=["A", "B", "C"], parents=["", "A", "A"], values=))[^6][^10][^4]
fig.show()
```

**Minimal Notes:** Icicle is the rectangular hierarchy companion to sunburst. It works well for level inspection. [web:35]
**Common Bug:** Expecting it to behave like a flat categorical bar chart.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 62. Create a sankey diagram

**Problem:** Show weighted flow between nodes.
**Trigger:** When movement between stages or systems matters.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Sankey(
    node=dict(label=["A", "B", "C"]),
    link=dict(source=, target=, value=)[^5][^3][^2][^1]
))
fig.show()
```

**Minimal Notes:** Sankey is ideal for flow and allocation analysis. Keep node labels clear. [web:35]
**Common Bug:** Mismatching source and target indices.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Styling

### 63. Style marker appearance

**Problem:** Control point size, color, and symbol.
**Trigger:** When trace styling must match a design system.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(
    x=, y=,[^3][^2][^1]
    mode="markers",
    marker=dict(size=12, color="royalblue", symbol="circle")
))
fig.show()
```

**Minimal Notes:** marker is the main point-style container. Keep palette choices consistent. [web:35]
**Common Bug:** Setting incompatible symbol or size values for the intended trace.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 64. Style line appearance

**Problem:** Control stroke width, dash, and color.
**Trigger:** When line encoding must be visually distinct.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(
    x=, y=,[^2][^3][^1]
    mode="lines",
    line=dict(width=3, dash="dash", color="black")
))
fig.show()
```

**Minimal Notes:** line styling belongs on line-capable traces. Use dash patterns sparingly. [web:35]
**Common Bug:** Applying line styling to traces that do not draw lines.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 65. Control fill and opacity

**Problem:** Shade the area under or between traces.
**Trigger:** When the chart needs stronger area emphasis.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(
    x=, y=,[^3][^2][^1]
    fill="tozeroy",
    opacity=0.5,
    mode="lines"
))
fig.show()
```

**Minimal Notes:** fill and opacity work well together. Keep opacity low enough to preserve context. [web:35]
**Common Bug:** Making filled regions too opaque and hiding geometry.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 66. Use hovertemplate

**Problem:** Define precise hover text.
**Trigger:** When default hover text is too verbose or incomplete.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(
    x=,[^2][^3][^1]
    y=,[^3][^1][^2]
    customdata=["a", "b", "c"],
    hovertemplate="x=%{x}<br>y=%{y}<br>tag=%{customdata}<extra></extra>"
))
fig.show()
```

**Minimal Notes:** hovertemplate overrides hoverinfo. Use <extra></extra> to hide the secondary box. [web:43]
**Common Bug:** Leaving the default extra box visible when it is not wanted.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.add_traces.html [web:43]

### 67. Attach customdata

**Problem:** Carry extra per-point metadata for interaction or callbacks.
**Trigger:** When hover or click logic needs hidden fields.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(
    x=,[^1][^2][^3]
    y=,[^2][^3][^1]
    customdata=[["u1"], ["u2"], ["u3"]],
    hovertemplate="id=%{customdata}<extra></extra>"
))
fig.show()
```

**Minimal Notes:** customdata is the standard payload channel for interactivity. It pairs naturally with hovertemplate. [web:43]
**Common Bug:** Assuming customdata is visible without referencing it in templates or callbacks.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.add_traces.html [web:43]

### 68. Control colorbars

**Problem:** Tune numeric color legends for continuous traces.
**Trigger:** When color mapping needs explicit labeling or placement.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(
    x=, y=,[^3][^1][^2]
    mode="markers",
    marker=dict(
        size=12,
        color=,[^11][^12][^6]
        colorscale="Viridis",
        colorbar=dict(title="Value")
    )
))
fig.show()
```

**Minimal Notes:** colorbar belongs to continuous color encodings. Label it clearly. [web:35]
**Common Bug:** Leaving an unlabeled colorbar in stakeholder-facing output.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Interactivity

### 69. Set legend grouping

**Problem:** Tie traces together for legend toggling.
**Trigger:** When multiple traces should hide and show as a unit.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure([
    go.Scatter(x=, y=, name="A1", legendgroup="A"),[^1][^2][^3]
    go.Scatter(x=, y=, name="A2", legendgroup="A")[^2][^3][^1]
])
fig.show()
```

**Minimal Notes:** legendgroup is useful for linked trace families. It improves legend hygiene. [web:43]
**Common Bug:** Forgetting to give grouped traces the same legendgroup.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.add_traces.html [web:43]

### 70. Control visibility states

**Problem:** Hide a trace while keeping it in the legend.
**Trigger:** When a trace should be optional at load time.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure([
    go.Scatter(x=, y=, name="visible"),[^3][^1][^2]
    go.Scatter(x=, y=, name="hidden", visible="legendonly"),[^1][^2][^3]
])
fig.show()
```

**Minimal Notes:** visible='legendonly' hides the trace but preserves legend access. This is common in dashboards. [web:35]
**Common Bug:** Using invisible traces when the legend item should still be available.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 71. Control click mode

**Problem:** Configure legend and point-click interactions.
**Trigger:** When the app depends on chart click behavior.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=, mode="markers"))[^2][^3][^1]
fig.update_layout(clickmode="event+select")
fig.show()
```

**Minimal Notes:** clickmode affects selection and click events. Use it when building interactive workflows. [web:41][web:42]
**Common Bug:** Assuming clicks and selections are enabled by default for every renderer.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

### 72. Enable selection-friendly traces

**Problem:** Prepare a scatter for point selection workflows.
**Trigger:** When downstream code needs selected points.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=, mode="markers"))[^3][^1][^2]
fig.update_traces(selected=dict(marker=dict(opacity=1.0)), unselected=dict(marker=dict(opacity=0.2)))
fig.update_layout(dragmode="lasso")
fig.show()
```

**Minimal Notes:** selected and unselected styles matter in analytical apps. Use lasso or box selection deliberately. [web:35][web:42]
**Common Bug:** Styling selection but forgetting to enable a selection dragmode.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html [web:42]

## Export \& rendering

### 73. Show a figure

**Problem:** Render the current figure interactively.
**Trigger:** When you need notebook or browser display.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^1][^2][^3]
fig.show()
```

**Minimal Notes:** show uses the configured renderer. It is the standard display method. [web:35]
**Common Bug:** Expecting show to create a saved file automatically.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 74. Write HTML output

**Problem:** Save an interactive standalone file.
**Trigger:** When the chart must be shared without Python.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^2][^3][^1]
fig.write_html("figure.html", include_plotlyjs="cdn")
```

**Minimal Notes:** HTML export is the safest share format. CDN mode reduces file size. [web:35]
**Common Bug:** Using CDN output in offline environments.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 75. Write a static image

**Problem:** Export a PNG or other static asset.
**Trigger:** When reports or slide decks need fixed images.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^3][^1][^2]
fig.write_image("figure.png", scale=2)
```

**Minimal Notes:** Static image export requires a supported export backend. Use scale to increase resolution. [web:35]
**Common Bug:** Attempting image export without the required renderer/backend installed.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 76. Convert to HTML string

**Problem:** Embed a figure in a custom app or template.
**Trigger:** When the output needs to be injected into HTML.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(go.Scatter(x=, y=))[^1][^2][^3]
html = fig.to_html(include_plotlyjs="cdn", full_html=False)
print(html[:200])
```

**Minimal Notes:** to_html is useful for integration pipelines. It returns a string, not a file. [web:35]
**Common Bug:** Treating to_html like a file-writing method.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Animation controls

### 77. Add animation sliders

**Problem:** Let users navigate between frames.
**Trigger:** When frame playback needs direct control.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(
    data=[go.Scatter(x=, y=, mode="markers")],
    frames=[
        go.Frame(data=[go.Scatter(x=, y=)], name="1"),[^1]
        go.Frame(data=[go.Scatter(x=, y=)], name="2"),[^2][^1]
    ],
    layout=go.Layout(
        sliders=[{
            "steps": [
                {"args": [["1"], {"frame": {"duration": 0}, "mode": "immediate"}], "label": "1", "method": "animate"},
                {"args": [["2"], {"frame": {"duration": 0}, "mode": "immediate"}], "label": "2", "method": "animate"},
            ]
        }]
    )
)
fig.show()
```

**Minimal Notes:** sliders map frame names to actions. Keep step labels short. [web:35]
**Common Bug:** Naming frames inconsistently with slider step targets.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 78. Add play/pause buttons

**Problem:** Control animation playback.
**Trigger:** When users need to start or stop an animated figure.
**Snippet:**

```python
import plotly.graph_objects as go

fig = go.Figure(
    data=[go.Scatter(x=, y=, mode="markers")],
    frames=[go.Frame(data=[go.Scatter(x=, y=)], name="f1")],[^1]
    layout=go.Layout(
        updatemenus=[{
            "buttons": [
                {"label": "Play", "method": "animate", "args": [None]},
                {"label": "Pause", "method": "animate", "args": [[None], {"frame": {"duration": 0}, "mode": "immediate"}]},
            ]
        }]
    )
)
fig.show()
```

**Minimal Notes:** updatemenus is the standard animation control surface. Keep button actions explicit. [web:35]
**Common Bug:** Building controls without matching frame names or animation args.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Performance

### 79. Use Scattergl for large point sets

**Problem:** Improve performance for dense scatter plots.
**Trigger:** When SVG scatter becomes too slow.
**Snippet:**

```python
import plotly.graph_objects as go
import numpy as np

n = 50000
fig = go.Figure(go.Scattergl(x=np.random.randn(n), y=np.random.randn(n), mode="markers"))
fig.show()
```

**Minimal Notes:** Scattergl uses WebGL rendering. It is the standard large-scatter option. [web:38]
**Common Bug:** Assuming Scattergl is always better than Scatter for every chart.
**Official Documentation URL:** https://plotly.github.io/plotly.py-docs/generated/plotly.graph_objects.Scattergl.html [web:38]

### 80. Reduce plotting cost with simpler traces

**Problem:** Keep large figures responsive.
**Trigger:** When many traces or points slow down rendering.
**Snippet:**

```python
import plotly.graph_objects as go
import numpy as np

x = np.arange(10000)
y = np.sin(x / 100.0)
fig = go.Figure(go.Scatter(x=x[::10], y=y[::10], mode="lines"))
fig.show()
```

**Minimal Notes:** Downsampling is often the fastest optimization. Simplify traces before adding more layout complexity. [web:38][web:37]
**Common Bug:** Trying to render every raw point when a sampled view is enough.
**Official Documentation URL:** https://plotly.github.io/plotly.py-docs/generated/plotly.graph_objects.Scattergl.html [web:38]

### 81. Preserve rendering strategy for large datasets

**Problem:** Choose a stable approach for high-volume figures.
**Trigger:** When interactive performance matters in production.
**Snippet:**

```python
import plotly.graph_objects as go
import numpy as np

n = 100000
fig = go.Figure(go.Scattergl(x=np.random.randn(n), y=np.random.randn(n), mode="markers", marker=dict(opacity=0.4)))
fig.update_layout(template="plotly_white")
fig.show()
```

**Minimal Notes:** WebGL is a rendering strategy, not a full data-management solution. Combine it with aggregation when needed. [web:38]
**Common Bug:** Relying on WebGL while leaving data volume and hover payload unchanged.
**Official Documentation URL:** https://plotly.github.io/plotly.py-docs/generated/plotly.graph_objects.Scattergl.html [web:38]

## Figure factory

### 82. Create a distribution plot

**Problem:** Build a compact distribution figure from sample data.
**Trigger:** When a quick legacy helper is acceptable.
**Snippet:**

```python
import plotly.figure_factory as ff

fig = ff.create_distplot([], ["sample"])[^4][^5][^3][^2][^1]
fig.show()
```

**Minimal Notes:** Figure factory helpers are compact utilities, not the main API. Use them only when they fit the task. [web:35]
**Common Bug:** Treating figure_factory as the preferred long-term composition API.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 83. Create an annotated heatmap

**Problem:** Show a matrix with text labels.
**Trigger:** When cell values must be visible directly.
**Snippet:**

```python
import plotly.figure_factory as ff

fig = ff.create_annotated_heatmap([, ], x=["A", "B"], y=["R1", "R2"])[^4][^3][^2][^1]
fig.show()
```

**Minimal Notes:** Annotated heatmaps are useful for small matrices. Keep text readable. [web:35]
**Common Bug:** Using annotated heatmaps for large matrices and overwhelming the view.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 84. Create a quiver plot

**Problem:** Visualize vector direction and magnitude.
**Trigger:** When flow fields or directional vectors matter.
**Snippet:**

```python
import plotly.figure_factory as ff

fig = ff.create_quiver(x=, y=, u=[1, -1], v=)[^1]
fig.show()
```

**Minimal Notes:** Quiver is a compact vector-field helper. It is useful for directional data. [web:35]
**Common Bug:** Using quiver when a scatter or line trace is sufficient.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

### 85. Create a table with figure factory

**Problem:** Generate a quick table figure.
**Trigger:** When a simple table helper is enough.
**Snippet:**

```python
import plotly.figure_factory as ff

fig = ff.create_table([, ["a", "b", "c"]])[^3][^2][^1]
fig.show()
```

**Minimal Notes:** The helper is compact and fast for simple tables. Prefer go.Table for direct trace work. [web:35]
**Common Bug:** Using figure_factory tables for highly customized reporting layouts.
**Official Documentation URL:** https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html [web:35]

## Quick-reference tables

### Common Figure methods

| Method | Use |
| :-- | :-- |
| `add_trace()` | Add one trace. [web:43] |
| `add_traces()` | Add many traces. [web:43] |
| `update_traces()` | Patch trace properties. [web:42] |
| `select_traces()` | Filter traces. [web:35] |
| `for_each_trace()` | Iterate over traces. [web:35] |
| `add_annotation()` | Add annotations. [web:35] |
| `add_shape()` | Add shapes. [web:35] |
| `add_hline()` | Add horizontal line. [web:35] |
| `add_vline()` | Add vertical line. [web:35] |
| `add_hrect()` | Add horizontal range band. [web:35] |
| `add_vrect()` | Add vertical range band. [web:35] |
| `update_layout()` | Update figure layout. [web:42] |
| `update_xaxes()` | Update x-axis. [web:42] |
| `update_yaxes()` | Update y-axis. [web:42] |
| `show()` | Render interactively. [web:35] |
| `write_html()` | Save HTML. [web:35] |
| `write_image()` | Save static image. [web:35] |
| `to_html()` | Return HTML string. [web:35] |

### Common subplot options

| Option | Meaning |
| :-- | :-- |
| `rows`, `cols` | Grid size. [web:40] |
| `shared_xaxes` | Share x-axis ranges. [web:40] |
| `shared_yaxes` | Share y-axis ranges. [web:40] |
| `specs` | Subplot type per cell. [web:40] |
| `secondary_y` | Enable right-side y-axis in xy subplot. [web:40] |
| `subplot_titles` | Per-panel titles. [web:40] |

### Common layout fields

| Field | Use |
| :-- | :-- |
| `title` | Figure title. [web:42] |
| `legend` | Legend placement and style. [web:42] |
| `font` | Global font styling. [web:42] |
| `template` | Theme template. [web:42] |
| `width`, `height` | Figure size. [web:42] |
| `margin` | Outside spacing. [web:42] |
| `hovermode` | Hover grouping. [web:42] |
| `dragmode` | Interaction mode. [web:42] |
| `paper_bgcolor` | Canvas background. [web:42] |
| `plot_bgcolor` | Plot area background. [web:42] |

### Common trace styling fields

| Field | Use |
| :-- | :-- |
| `marker` | Point styling. [web:35] |
| `line` | Line styling. [web:35] |
| `fill` | Area fill. [web:35] |
| `opacity` | Transparency. [web:35] |
| `text` | On-chart text. [web:35] |
| `hovertemplate` | Custom hover content. [web:43] |
| `customdata` | Extra hidden payload. [web:43] |
| `legendgroup` | Linked legend behavior. [web:43] |
| `visible` | Trace visibility state. [web:35] |

## Coverage note

This file enumerates 80+ production graph_objects tasks, centered on figure lifecycle, subplots, layout, axes, traces, interactivity, animation, export, performance, and compact figure_factory helpers. It uses plotly.py 6.8.0 throughout and stays on stable documented APIs. [web:35][web:40][web:38]

```
<span style="display:none">[^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md
[^2]: CURRENT_PROJECT_STATE_REPORT.md
[^3]: CONTENT_QUALITY_STANDARD.md
[^4]: ARCHITECTURE_FREEZE.md
[^5]: AENS Knowledge Layer Specification.md
[^6]: http://arxiv.org/pdf/2406.03839.pdf
[^7]: https://github.com/plotly/plotly_express/releases
[^8]: https://plotly.com/python-api-reference/generated/plotly.express.scatter
[^9]: https://plotly.com/python-api-reference/generated/plotly.subplots.make_subplots.html
[^10]: http://conference.scipy.org/proceedings/scipy2018/pdfs/jon_mease.pdf
[^11]: https://github.com/plotly/plotly.py/releases
[^12]: https://plotly.com/python/map-configuration/
[^13]: http://arxiv.org/pdf/1611.00751.pdf
[^14]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10546746/
[^15]: https://arxiv.org/pdf/2207.01124.pdf
[^16]: https://plotly.com/python/plotly-express/
[^17]: https://arxiv.org/pdf/2206.08703.pdf
[^18]: http://arxiv.org/pdf/1910.00279.pdf
[^19]: http://conference.scipy.org/proceedings/scipy2019/pdfs/shammamah_hossain.pdf
[^20]: https://arxiv.org/pdf/1508.04633.pdf
[^21]: https://academic.oup.com/bioinformatics/article-pdf/37/3/422/37219026/btaa692.pdf
[^22]: https://arxiv.org/html/2503.20089
[^23]: https://plotly.com/python-api-reference/generated/plotly.graph_objects.Figure.html
[^24]: https://plotly.github.io/plotly.py-docs/generated/plotly.html
[^25]: https://plotly.com/python/creating-and-updating-figures/
[^26]: https://plotly.github.io/plotly.py-docs/generated/plotly.graph_objects.Scattergl.html
[^27]: https://docs.hodp.org/docs/plotly/
[^28]: https://plotly.com/python-api-reference/generated/plotly.graph_objects.Layout.html
[^29]: https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.update_layout.html
[^30]: https://plotly.com/python-api-reference/generated/generated/plotly.graph_objects.Figure.add_traces.html
[^31]: https://pytutorial.com/python-plotly-graph-objects-visualization-guide/```

