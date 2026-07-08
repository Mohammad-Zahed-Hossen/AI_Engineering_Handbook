<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# AENS Cheatsheet Metadata

| Field | Value |
| :-- | :-- |
| id | matplotlib |
| title | Matplotlib Cheatsheet |
| slug | matplotlib-cheatsheet |
| name | Matplotlib Cheatsheet |
| description | High-density Matplotlib reference for common production plotting tasks in AENS. |
| package_reference | matplotlib |
| version | 3.10.3 |
| sources | [https://matplotlib.org/stable/index.html](https://matplotlib.org/stable/index.html), [https://matplotlib.org/stable/users/release_notes.html](https://matplotlib.org/stable/users/release_notes.html), [https://github.com/matplotlib/matplotlib](https://github.com/matplotlib/matplotlib) |
| created_at | 2026-07-05 |
| updated_at | 2026-07-05 |

# Matplotlib Cheatsheet

## 1. Create a basic line plot

| Field | Value |
| :-- | :-- |
| Problem | Create a simple line plot. |
| Trigger | When plotting a continuous trend from ordered x values. |
| Snippet | ```python |

import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [2, 3, 5, 4]

fig, ax = plt.subplots()
ax.plot(x, y)
plt.show()

``` |
| Minimal Notes | Use `plot` for connected data points. `subplots()` is the preferred OO starting point. |
| Common Bug | Plotting unsorted x values and misreading the line order. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html) |

## 2. Style a line plot

| Field | Value |
|---|---|
| Problem | Create a styled line plot with markers and line settings. |
| Trigger | When the default line styling is too plain for presentation or debugging. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [2, 3, 5, 4]

fig, ax = plt.subplots()
ax.plot(x, y, color="tab:blue", marker="o", linestyle="-", linewidth=2, markersize=6)
plt.show()
``` |
| Minimal Notes | `color`, `marker`, and `linestyle` cover most day-to-day styling needs. |
| Common Bug | Mixing `fmt` strings with keyword style arguments in a confusing way. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html) |

## 3. Multiple lines on one axes

| Field | Value |
|---|---|
| Problem | Plot several series on the same axes. |
| Trigger | When comparing trends across categories or models. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y1 = [2, 3, 5, 4]
y2 = [1, 4, 4, 6]

fig, ax = plt.subplots()
ax.plot(x, y1, label="A")
ax.plot(x, y2, label="B")
ax.legend()
plt.show()
``` |
| Minimal Notes | Call `plot` repeatedly on the same `ax`. Add a legend only when labels matter. |
| Common Bug | Forgetting labels, which leaves the legend empty. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html) |

## 4. Scatter plot

| Field | Value |
|---|---|
| Problem | Create a scatter plot. |
| Trigger | When visualizing the relationship between two continuous variables. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [2, 1, 4, 3]

fig, ax = plt.subplots()
ax.scatter(x, y, s=60, alpha=0.8)
plt.show()
``` |
| Minimal Notes | `scatter` is for points, not connected lines. `alpha` helps with overplotting. |
| Common Bug | Using `plot(..., marker="o")` when a true scatter with size or color encoding is needed. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html) |

## 5. Scatter plot with color mapping

| Field | Value |
|---|---|
| Problem | Color points by a third variable. |
| Trigger | When one scatter plot needs an additional numeric dimension. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [2, 1, 4, 3]
c = [10, 20, 30, 40]

fig, ax = plt.subplots()
sc = ax.scatter(x, y, c=c, cmap="viridis", s=80)
fig.colorbar(sc, ax=ax)
plt.show()
``` |
| Minimal Notes | Pass numeric data to `c` and attach a colorbar for interpretation. |
| Common Bug | Using categorical strings in `c` without mapping them first. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html) |

## 6. Vertical bar chart

| Field | Value |
|---|---|
| Problem | Create a vertical bar chart. |
| Trigger | When comparing discrete quantities across categories. |
| Snippet | ```python
import matplotlib.pyplot as plt

labels = ["A", "B", "C"]
values = [5, 7, 4]

fig, ax = plt.subplots()
ax.bar(labels, values)
plt.show()
``` |
| Minimal Notes | Bar charts work best for ordered categorical comparisons. |
| Common Bug | Using a bar chart for too many categories and making it unreadable. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html) |

## 7. Horizontal bar chart

| Field | Value |
|---|---|
| Problem | Create a horizontal bar chart. |
| Trigger | When category labels are long or many categories need a compact layout. |
| Snippet | ```python
import matplotlib.pyplot as plt

labels = ["Long label A", "Long label B", "Long label C"]
values = [5, 7, 4]

fig, ax = plt.subplots()
ax.barh(labels, values)
plt.show()
``` |
| Minimal Notes | `barh` is often easier to read than vertical bars for long labels. |
| Common Bug | Forgetting to sort categories when rank order matters. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.barh.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.barh.html) |

## 8. Grouped bars

| Field | Value |
|---|---|
| Problem | Create grouped bars for multiple series. |
| Trigger | When comparing several categories across the same discrete labels. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

labels = ["A", "B", "C"]
x = np.arange(len(labels))
w = 0.35
v1 = [5, 7, 4]
v2 = [6, 3, 5]

fig, ax = plt.subplots()
ax.bar(x - w/2, v1, width=w, label="S1")
ax.bar(x + w/2, v2, width=w, label="S2")
ax.set_xticks(x, labels)
ax.legend()
plt.show()
``` |
| Minimal Notes | Use numeric x positions and offset each series. |
| Common Bug | Overlapping bars because the width offsets are not adjusted. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html) |

## 9. Stacked bars

| Field | Value |
|---|---|
| Problem | Create stacked bars. |
| Trigger | When showing part-to-whole composition across categories. |
| Snippet | ```python
import matplotlib.pyplot as plt

labels = ["A", "B", "C"]
v1 = [3, 4, 2]
v2 = [2, 3, 2]

fig, ax = plt.subplots()
ax.bar(labels, v1, label="Base")
ax.bar(labels, v2, bottom=v1, label="Add-on")
ax.legend()
plt.show()
``` |
| Minimal Notes | Use `bottom` to stack bars on top of each other. |
| Common Bug | Stacking values without ensuring both series align by category. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html) |

## 10. Histogram

| Field | Value |
|---|---|
| Problem | Create a histogram. |
| Trigger | When inspecting the distribution of a numeric variable. |
| Snippet | ```python
import matplotlib.pyplot as plt

data = [1, 2, 2, 3, 3, 3, 4, 5, 5]

fig, ax = plt.subplots()
ax.hist(data, bins=5)
plt.show()
``` |
| Minimal Notes | `bins` strongly affects interpretation. Keep binning consistent when comparing datasets. |
| Common Bug | Comparing histograms with different bin edges. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html) |

## 11. Overlaid histograms

| Field | Value |
|---|---|
| Problem | Compare multiple distributions in one histogram plot. |
| Trigger | When distributions need a quick side-by-side comparison. |
| Snippet | ```python
import matplotlib.pyplot as plt

a = [1, 2, 2, 3, 4, 4, 5]
b = [2, 3, 3, 4, 5, 5, 6]

fig, ax = plt.subplots()
ax.hist(a, bins=5, alpha=0.5, label="A")
ax.hist(b, bins=5, alpha=0.5, label="B")
ax.legend()
plt.show()
``` |
| Minimal Notes | Use transparency and shared bins to make overlaps readable. |
| Common Bug | Using different bin ranges and drawing misleading comparisons. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html) |

## 12. Density histogram

| Field | Value |
|---|---|
| Problem | Plot normalized distributions. |
| Trigger | When comparing shape instead of raw counts. |
| Snippet | ```python
import matplotlib.pyplot as plt

data = [1, 2, 2, 3, 3, 3, 4, 5, 5]

fig, ax = plt.subplots()
ax.hist(data, bins=5, density=True)
plt.show()
``` |
| Minimal Notes | `density=True` makes area integrate to 1. |
| Common Bug | Reading density histograms as raw counts. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html) |

## 13. Pie chart

| Field | Value |
|---|---|
| Problem | Create a pie chart. |
| Trigger | When showing part-to-whole composition with a small number of categories. |
| Snippet | ```python
import matplotlib.pyplot as plt

sizes = [40, 35, 25]
labels = ["A", "B", "C"]

fig, ax = plt.subplots()
ax.pie(sizes, labels=labels, autopct="%1.1f%%")
ax.set_aspect("equal")
plt.show()
``` |
| Minimal Notes | Keep pie charts simple and use `set_aspect("equal")` for a true circle. |
| Common Bug | Using too many slices, which makes comparison difficult. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.pie.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.pie.html) |

## 14. Box plot

| Field | Value |
|---|---|
| Problem | Create a box plot. |
| Trigger | When comparing distributions, outliers, and spread across groups. |
| Snippet | ```python
import matplotlib.pyplot as plt

data = [[1, 2, 3, 4], [2, 3, 5, 6], [1, 2, 2, 3]]

fig, ax = plt.subplots()
ax.boxplot(data)
plt.show()
``` |
| Minimal Notes | Box plots are compact summaries of spread and outliers. |
| Common Bug | Feeding ragged data without knowing group order. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.boxplot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.boxplot.html) |

## 15. Violin plot

| Field | Value |
|---|---|
| Problem | Create a violin plot. |
| Trigger | When distribution shape matters more than quartiles alone. |
| Snippet | ```python
import matplotlib.pyplot as plt

data = [[1, 2, 3, 4], [2, 3, 5, 6], [1, 2, 2, 3]]

fig, ax = plt.subplots()
ax.violinplot(data)
plt.show()
``` |
| Minimal Notes | Violin plots show density shape and are useful when quartiles hide structure. |
| Common Bug | Treating violin plots as a replacement for small-sample inference. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.violinplot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.violinplot.html) |

## 16. Error bars

| Field | Value |
|---|---|
| Problem | Plot values with symmetric uncertainty. |
| Trigger | When measurements have standard deviations, confidence bands, or experimental error. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3]
y = [2, 3, 4]
yerr = [0.2, 0.3, 0.1]

fig, ax = plt.subplots()
ax.errorbar(x, y, yerr=yerr, fmt="o-", capsize=4)
plt.show()
``` |
| Minimal Notes | `errorbar` is the standard choice for uncertainty on points or lines. |
| Common Bug | Passing uncertainty with the wrong shape or units. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.errorbar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.errorbar.html) |

## 17. Heatmap from matrix

| Field | Value |
|---|---|
| Problem | Display a numeric matrix as a heatmap. |
| Trigger | When comparing values across a 2D grid or correlation matrix. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

data = np.array([[1, 2, 3], [4, 5, 6]])

fig, ax = plt.subplots()
im = ax.imshow(data, cmap="viridis")
fig.colorbar(im, ax=ax)
plt.show()
``` |
| Minimal Notes | `imshow` is the common fast path for matrix-style heatmaps. |
| Common Bug | Forgetting a colorbar, which makes the color scale ambiguous. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html) |

## 18. Annotated heatmap

| Field | Value |
|---|---|
| Problem | Display a heatmap with text labels on each cell. |
| Trigger | When the exact values in a small matrix must be readable. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

data = np.array([[1, 2], [3, 4]])

fig, ax = plt.subplots()
im = ax.imshow(data, cmap="Blues")
for i in range(data.shape[^0]):
    for j in range(data.shape[^1]):
        ax.text(j, i, data[i, j], ha="center", va="center")
fig.colorbar(im, ax=ax)
plt.show()
``` |
| Minimal Notes | Cell annotations are practical only for small matrices. |
| Common Bug | Adding text to large grids and creating an unreadable wall of labels. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html) |

## 19. Show an image

| Field | Value |
|---|---|
| Problem | Display an image array. |
| Trigger | When rendering photographs, masks, or pixel data. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

img = np.random.rand(100, 100, 3)

fig, ax = plt.subplots()
ax.imshow(img)
ax.axis("off")
plt.show()
``` |
| Minimal Notes | `imshow` handles image arrays directly. Hide axes for pure image display. |
| Common Bug | Displaying RGB data with the wrong value range or channel order. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html) |

## 20. Colormap control

| Field | Value |
|---|---|
| Problem | Choose a colormap for numeric encoding. |
| Trigger | When color should represent magnitude, rank, or deviation. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

data = np.random.rand(10, 10)

fig, ax = plt.subplots()
im = ax.imshow(data, cmap="magma")
fig.colorbar(im, ax=ax)
plt.show()
``` |
| Minimal Notes | Use perceptually sensible colormaps for numeric data. |
| Common Bug | Using a rainbow map for continuous data. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html) |

## 21. Add a colorbar

| Field | Value |
|---|---|
| Problem | Attach a colorbar to a plot. |
| Trigger | When color is used as a numeric scale and needs decoding. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

data = np.random.rand(5, 5)

fig, ax = plt.subplots()
im = ax.imshow(data, cmap="viridis")
fig.colorbar(im, ax=ax)
plt.show()
``` |
| Minimal Notes | Colorbars should usually be tied to the specific mappable object. |
| Common Bug | Adding a colorbar to the wrong axes in multi-axes figures. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.colorbar.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.colorbar.html) |

## 22. Add a legend

| Field | Value |
|---|---|
| Problem | Display a legend. |
| Trigger | When multiple plotted elements need labels. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3], label="Up")
ax.plot([1, 2, 3], [3, 2, 1], label="Down")
ax.legend()
plt.show()
``` |
| Minimal Notes | Labels must be set on artists before calling `legend()`. |
| Common Bug | Calling `legend()` with unlabeled artists and getting an empty box. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.legend.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.legend.html) |

## 23. Title and axis labels

| Field | Value |
|---|---|
| Problem | Add title and axis labels. |
| Trigger | When a plot must be self-explanatory outside the notebook. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.set_title("Trend")
ax.set_xlabel("Step")
ax.set_ylabel("Value")
plt.show()
``` |
| Minimal Notes | Titles and labels should describe units, not just variables. |
| Common Bug | Omitting units and making the plot ambiguous. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html) |

## 24. Grid and minor grid

| Field | Value |
|---|---|
| Problem | Add grid lines. |
| Trigger | When reading values from a chart benefits from visual guides. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.grid(True, which="major", linestyle="--", alpha=0.4)
plt.show()
``` |
| Minimal Notes | Grid lines should support reading, not dominate the figure. |
| Common Bug | Using heavy grid styling that competes with the data. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.grid.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.grid.html) |

## 25. Tick label customization

| Field | Value |
|---|---|
| Problem | Control tick labels explicitly. |
| Trigger | When default ticks are too dense, too sparse, or need custom text. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.set_xticks([1, 2, 3], ["One", "Two", "Three"])
plt.show()
``` |
| Minimal Notes | `set_xticks(..., labels=...)` is a clean way to relabel discrete positions. |
| Common Bug | Setting labels without matching tick positions. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xticks.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xticks.html) |

## 26. Rotate tick labels

| Field | Value |
|---|---|
| Problem | Rotate axis tick labels. |
| Trigger | When labels overlap or are too long. |
| Snippet | ```python
import matplotlib.pyplot as plt

labels = ["Very long label A", "Very long label B", "Very long label C"]
values = [1, 2, 3]

fig, ax = plt.subplots()
ax.bar(labels, values)
ax.tick_params(axis="x", labelrotation=45)
plt.tight_layout()
plt.show()
``` |
| Minimal Notes | Rotation is often enough to recover readability without redesigning the chart. |
| Common Bug | Rotating labels but forgetting layout adjustment. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.tick_params.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.tick_params.html) |

## 27. Log scale

| Field | Value |
|---|---|
| Problem | Use a logarithmic axis scale. |
| Trigger | When values span several orders of magnitude. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 10, 100], [1, 2, 3])
ax.set_xscale("log")
plt.show()
``` |
| Minimal Notes | Log scales help with multiplicative structure and long-tailed data. |
| Common Bug | Applying log scale to data containing zero or negative values. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xscale.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xscale.html) |

## 28. Twin y-axis

| Field | Value |
|---|---|
| Problem | Plot two series with different y scales on the same x axis. |
| Trigger | When two measures share x values but need separate units. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y1 = [1, 4, 2, 5]
y2 = [10, 20, 15, 25]

fig, ax1 = plt.subplots()
ax2 = ax1.twinx()
ax1.plot(x, y1, color="tab:blue")
ax2.plot(x, y2, color="tab:red")
plt.show()
``` |
| Minimal Notes | Use twin axes sparingly because scale differences can mislead. |
| Common Bug | Making the plot hard to interpret by overusing dual axes. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.twinx.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.twinx.html) |

## 29. Shared axes subplots

| Field | Value |
|---|---|
| Problem | Create subplots with shared x or y axes. |
| Trigger | When comparing panels with aligned scales. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 1, sharex=True)
axs.plot([1, 2, 3], [1, 2, 3])
axs[^1].plot([1, 2, 3], [3, 2, 1])
plt.show()
``` |
| Minimal Notes | Shared axes reduce duplication and improve cross-panel comparison. |
| Common Bug | Accidentally hiding necessary tick labels across panels. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html) |

## 30. Simple subplot grid

| Field | Value |
|---|---|
| Problem | Create a grid of subplots. |
| Trigger | When showing multiple related plots at once. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 2)
axs[0, 0].plot([1, 2], [1, 2])
axs[0, 1].plot([1, 2], [2, 1])
axs[1, 0].plot([1, 2], [1, 3])
axs[1, 1].plot([1, 2], [3, 1])
plt.show()
``` |
| Minimal Notes | `subplots` is the standard way to create small-multiple grids. |
| Common Bug | Confusing the returned `axes` shape for 1x1, 1xN, and Nx1 layouts. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html) |

## 31. Figure with constrained layout

| Field | Value |
|---|---|
| Problem | Prevent label and title overlap. |
| Trigger | When complex subplot layouts need automatic spacing management. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 2, constrained_layout=True)
for ax in axs.flat:
    ax.plot([1, 2, 3], [1, 2, 3])
plt.show()
``` |
| Minimal Notes | `constrained_layout=True` often works better than manual spacing tweaks. |
| Common Bug | Combining manual layout adjustments with constrained layout unnecessarily. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html) |

## 32. Manual subplot spacing

| Field | Value |
|---|---|
| Problem | Adjust subplot spacing manually. |
| Trigger | When automatic layout still leaves too much or too little room. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 2)
fig.subplots_adjust(wspace=0.4, hspace=0.4)
plt.show()
``` |
| Minimal Notes | `subplots_adjust` is useful for precise control when needed. |
| Common Bug | Over-adjusting spacing and wasting figure area. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.subplots_adjust.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.subplots_adjust.html) |

## 33. Custom subplot geometry with GridSpec

| Field | Value |
|---|---|
| Problem | Build non-uniform subplot layouts. |
| Trigger | When panels need different sizes or asymmetrical placement. |
| Snippet | ```python
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

fig = plt.figure()
gs = GridSpec(2, 2, figure=fig)
ax1 = fig.add_subplot(gs[0, :])
ax2 = fig.add_subplot(gs[1, 0])
ax3 = fig.add_subplot(gs[1, 1])
ax1.plot([1, 2, 3], [1, 2, 3])
ax2.plot([1, 2, 3], [3, 2, 1])
ax3.plot([1, 2, 3], [2, 2, 2])
plt.show()
``` |
| Minimal Notes | `GridSpec` is the clean route for asymmetric figure layouts. |
| Common Bug | Using `subplot` calls where a layout manager is a better fit. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.gridspec.GridSpec.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.gridspec.GridSpec.html) |

## 34. Add a custom axes region

| Field | Value |
|---|---|
| Problem | Place an axes at an exact figure position. |
| Trigger | When you need manual control over axes placement. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_axes([0.1, 0.1, 0.8, 0.8])
ax.plot([1, 2, 3], [1, 2, 3])
plt.show()
``` |
| Minimal Notes | `add_axes` uses figure-relative coordinates. |
| Common Bug | Misjudging the normalized coordinate system. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.add_axes.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.add_axes.html) |

## 35. Add a single subplot explicitly

| Field | Value |
|---|---|
| Problem | Add one subplot to a figure with explicit subplot indexing. |
| Trigger | When you want a direct OO handle without creating a full grid upfront. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)
ax.plot([1, 2, 3], [1, 2, 3])
plt.show()
``` |
| Minimal Notes | `add_subplot` is useful for lightweight manual figure construction. |
| Common Bug | Forgetting that subplot codes define rows, columns, and position. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.add_subplot.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.add_subplot.html) |

## 36. Figure size

| Field | Value |
|---|---|
| Problem | Control figure dimensions. |
| Trigger | When plots need consistent output size for notebooks or publication. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot([1, 2, 3], [1, 2, 3])
plt.show()
``` |
| Minimal Notes | `figsize` is one of the first knobs to set for readable output. |
| Common Bug | Exporting figures at notebook default sizes and getting cramped labels. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html) |

## 37. High-DPI export

| Field | Value |
|---|---|
| Problem | Save a high-resolution image file. |
| Trigger | When the figure will be embedded in slides, docs, or reports. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
fig.savefig("figure.png", dpi=300)
``` |
| Minimal Notes | Use a higher DPI for raster output when print or zoom quality matters. |
| Common Bug | Raising DPI without considering file size and rendering cost. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html) |

## 38. Transparent export

| Field | Value |
|---|---|
| Problem | Save a figure with a transparent background. |
| Trigger | When placing a plot on a colored slide or page background. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
fig.savefig("figure.png", transparent=True)
``` |
| Minimal Notes | Transparency is useful for overlays and design systems. |
| Common Bug | Forgetting that transparent backgrounds can hurt readability on some backgrounds. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html) |

## 39. SVG export

| Field | Value |
|---|---|
| Problem | Save a vector graphic. |
| Trigger | When you need scalable output for web or design workflows. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
fig.savefig("figure.svg")
``` |
| Minimal Notes | SVG preserves sharp edges and text scaling. |
| Common Bug | Expecting raster-like file sizes from vector exports. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html) |

## 40. PDF export

| Field | Value |
|---|---|
| Problem | Save a PDF for print or documentation. |
| Trigger | When vector output is needed in a portable document format. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
fig.savefig("figure.pdf")
``` |
| Minimal Notes | PDF is a common publication and report format. |
| Common Bug | Ignoring font embedding and post-processing expectations. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html) |

## 41. Set plot style

| Field | Value |
|---|---|
| Problem | Apply a built-in plotting style. |
| Trigger | When you need a consistent visual theme quickly. |
| Snippet | ```python
import matplotlib.pyplot as plt

plt.style.use("seaborn-v0_8")
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
plt.show()
``` |
| Minimal Notes | Style sheets are the fastest way to standardize a plot look. |
| Common Bug | Using a style globally without realizing it affects later plots. |
| Official Documentation URL | [https://matplotlib.org/stable/api/style_api.html](https://matplotlib.org/stable/api/style_api.html) |

## 42. Update rcParams

| Field | Value |
|---|---|
| Problem | Set global Matplotlib defaults. |
| Trigger | When many plots need the same fonts, sizes, or line settings. |
| Snippet | ```python
import matplotlib.pyplot as plt

plt.rcParams["figure.figsize"] = (8, 4)
plt.rcParams["axes.grid"] = True
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
plt.show()
``` |
| Minimal Notes | `rcParams` is the main place for session-wide defaults. |
| Common Bug | Changing global defaults and unintentionally affecting unrelated plots. |
| Official Documentation URL | [https://matplotlib.org/stable/api/matplotlib_configuration_api.html#matplotlib.rcParams](https://matplotlib.org/stable/api/matplotlib_configuration_api.html#matplotlib.rcParams) |

## 43. Dark theme plot

| Field | Value |
|---|---|
| Problem | Create a plot that works on dark backgrounds. |
| Trigger | When the target environment uses dark UI or presentation themes. |
| Snippet | ```python
import matplotlib.pyplot as plt

plt.style.use("dark_background")
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2], color="cyan")
plt.show()
``` |
| Minimal Notes | Dark themes need deliberate contrast choices for text and lines. |
| Common Bug | Using colors with insufficient contrast on dark backgrounds. |
| Official Documentation URL | [https://matplotlib.org/stable/api/style_api.html](https://matplotlib.org/stable/api/style_api.html) |

## 44. Close figures

| Field | Value |
|---|---|
| Problem | Release figure resources. |
| Trigger | When generating many figures in loops or batch jobs. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
plt.close(fig)
``` |
| Minimal Notes | Closing figures prevents memory growth in long-running processes. |
| Common Bug | Leaving figures open in batch plotting scripts. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.close.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.close.html) |

## 45. Batch plot reuse pattern

| Field | Value |
|---|---|
| Problem | Reuse a figure and axes inside a loop. |
| Trigger | When generating many similar plots efficiently. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
for i in range(3):
    ax.clear()
    ax.plot([1, 2, 3], [i, i + 1, i + 2])
    fig.canvas.draw_idle()
plt.close(fig)
``` |
| Minimal Notes | Reusing one figure is faster than creating a new one each iteration. |
| Common Bug | Forgetting to clear old artists before redrawing the next iteration. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.clear.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.clear.html) |

## 46. Save with tight bounding box

| Field | Value |
|---|---|
| Problem | Save a figure with minimal extra whitespace. |
| Trigger | When export should trim empty margins around labels and titles. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
fig.savefig("figure.png", bbox_inches="tight")
``` |
| Minimal Notes | `bbox_inches="tight"` is often the easiest way to trim exports. |
| Common Bug | Cropping too aggressively and clipping annotations. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html) |

## 47. Scatter with size encoding

| Field | Value |
|---|---|
| Problem | Encode a third variable with marker size. |
| Trigger | When one scatter plot must show magnitude as well as position. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [2, 1, 4, 3]
sizes = [20, 80, 200, 120]

fig, ax = plt.subplots()
ax.scatter(x, y, s=sizes, alpha=0.7)
plt.show()
``` |
| Minimal Notes | `s` uses points squared, so size perception is not linear. |
| Common Bug | Passing raw values to `s` without considering how marker area scales. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html) |

## 48. Text on plot

| Field | Value |
|---|---|
| Problem | Add text directly to a plot. |
| Trigger | When a chart needs labels, notes, or value callouts. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.text(2, 4, "peak", ha="left", va="bottom")
plt.show()
``` |
| Minimal Notes | Text is positioned in data coordinates by default. |
| Common Bug | Placing text in data space but expecting screen-space positioning. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html) |

## 49. Annotate a point

| Field | Value |
|---|---|
| Problem | Annotate a point with an arrow and label. |
| Trigger | When a specific observation needs emphasis. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.annotate("important", xy=(2, 4), xytext=(2.3, 4.5),
            arrowprops=dict(arrowstyle="->"))
plt.show()
``` |
| Minimal Notes | `annotate` is better than `text` when you need an arrow or offset label. |
| Common Bug | Forgetting to offset the text and overlapping the target point. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.annotate.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.annotate.html) |

## 50. Reference lines

| Field | Value |
|---|---|
| Problem | Draw horizontal or vertical reference lines. |
| Trigger | When highlighting thresholds, baselines, or targets. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 2])
ax.axhline(3, color="red", linestyle="--")
ax.axvline(2, color="gray", linestyle=":")
plt.show()
``` |
| Minimal Notes | Reference lines provide simple visual thresholds. |
| Common Bug | Adding too many reference lines and cluttering the plot. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.axhline.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.axhline.html) |

## 51. Filled region between lines

| Field | Value |
|---|---|
| Problem | Shade the area between two curves. |
| Trigger | When showing confidence intervals, ranges, or uncertainty bands. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y1 = [1, 2, 2, 3]
y2 = [2, 3, 3, 4]

fig, ax = plt.subplots()
ax.fill_between(x, y1, y2, alpha=0.3)
plt.show()
``` |
| Minimal Notes | `fill_between` is the standard interval shading tool. |
| Common Bug | Passing unsorted x values and getting a broken shaded region. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html) |

## 52. Stem plot

| Field | Value |
|---|---|
| Problem | Create a stem plot. |
| Trigger | When discrete samples need emphasis on individual magnitudes. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [2, 5, 3, 4]

fig, ax = plt.subplots()
ax.stem(x, y)
plt.show()
``` |
| Minimal Notes | Stem plots are useful for discrete signals or sparse series. |
| Common Bug | Using stem plots for dense data where they become cluttered. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.stem.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.stem.html) |

## 53. Step plot

| Field | Value |
|---|---|
| Problem | Plot values as a step function. |
| Trigger | When values change at discrete intervals. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [1, 3, 2, 4]

fig, ax = plt.subplots()
ax.step(x, y, where="mid")
plt.show()
``` |
| Minimal Notes | Step plots are better than line plots for sampled state changes. |
| Common Bug | Using the wrong `where` alignment and shifting the visual change point. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.step.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.step.html) |

## 54. Fill under curve

| Field | Value |
|---|---|
| Problem | Fill the area under a line. |
| Trigger | When emphasizing cumulative area or integrated magnitude. |
| Snippet | ```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [1, 2, 3, 2]

fig, ax = plt.subplots()
ax.plot(x, y)
ax.fill_between(x, y, alpha=0.2)
plt.show()
``` |
| Minimal Notes | Filled areas can strengthen visual emphasis, but use them sparingly. |
| Common Bug | Filling under multiple lines without checking overlap readability. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html) |

## 55. Preserve aspect ratio

| Field | Value |
|---|---|
| Problem | Make plot units use equal scaling. |
| Trigger | When geometric shape or distance must not be distorted. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([0, 1], [0, 1])
ax.set_aspect("equal")
plt.show()
``` |
| Minimal Notes | Equal aspect is essential for circles, maps, and geometry. |
| Common Bug | Distorted shapes because the default aspect stretches axes. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_aspect.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_aspect.html) |

## 56. Remove spines

| Field | Value |
|---|---|
| Problem | Hide selected axes spines. |
| Trigger | When a cleaner, presentation-style chart is needed. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
plt.show()
``` |
| Minimal Notes | Spine cleanup can improve readability for modern chart styles. |
| Common Bug | Removing spines without checking whether they still support the plot context. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.spines.Spine.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.spines.Spine.html) |

## 57. Subplot mosaic

| Field | Value |
|---|---|
| Problem | Create a named multi-panel layout. |
| Trigger | When a figure needs clearly addressed panels with custom arrangement. |
| Snippet | ```python
import matplotlib.pyplot as plt

fig, axs = plt.subplot_mosaic([["A", "B"], ["C", "B"]])
axs["A"].plot([1, 2], [1, 2])
axs["B"].plot([1, 2], [2, 1])
axs["C"].plot([1, 2], [1, 3])
plt.show()
``` |
| Minimal Notes | Mosaic layouts are readable and convenient for named panel structures. |
| Common Bug | Choosing a mosaic when a simple grid would be easier to maintain. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html) |

## 58. Contour plot

| Field | Value |
|---|---|
| Problem | Plot contour lines for a surface. |
| Trigger | When a 2D scalar field needs level-based visualization. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-2, 2, 50)
y = np.linspace(-2, 2, 50)
X, Y = np.meshgrid(x, y)
Z = X**2 + Y**2

fig, ax = plt.subplots()
ax.contour(X, Y, Z)
plt.show()
``` |
| Minimal Notes | Contours are useful when isolines matter more than filled color regions. |
| Common Bug | Passing 1D arrays that do not match the grid shape. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contour.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contour.html) |

## 59. Filled contour plot

| Field | Value |
|---|---|
| Problem | Plot filled contour levels. |
| Trigger | When a smooth 2D scalar field needs color-filled levels. |
| Snippet | ```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-2, 2, 50)
y = np.linspace(-2, 2, 50)
X, Y = np.meshgrid(x, y)
Z = X**2 + Y**2

fig, ax = plt.subplots()
cf = ax.contourf(X, Y, Z, cmap="viridis")
fig.colorbar(cf, ax=ax)
plt.show()
``` |
| Minimal Notes | `contourf` is a standard option for smooth scalar fields. |
| Common Bug | Forgetting the colorbar and leaving level values unclear. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contourf.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.contourf.html) |

## 60. Interactive plotting in notebooks

| Field | Value |
|---|---|
| Problem | Use interactive notebook plotting behavior. |
| Trigger | When running in a notebook and needing inline interactive updates. |
| Snippet | ```python
import matplotlib.pyplot as plt

plt.ion()
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
fig.canvas.draw_idle()
plt.show()
``` |
| Minimal Notes | Interactive mode can help during exploratory work and live updates. |
| Common Bug | Leaving interactive mode on in scripts and getting unexpected rendering behavior. |
| Official Documentation URL | [https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ion.html](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.ion.html) |

# Common Plot Types

| API | Purpose | Most Important Parameters |
|---|---|---|
| `Axes.plot` | Line plot | `x`, `y`, `color`, `linestyle`, `marker`, `linewidth` |
| `Axes.scatter` | Scatter plot | `x`, `y`, `s`, `c`, `cmap`, `alpha` |
| `Axes.bar` | Vertical bars | `x`, `height`, `width`, `bottom`, `label` |
| `Axes.barh` | Horizontal bars | `y`, `width`, `height`, `left`, `label` |
| `Axes.hist` | Histogram | `x`, `bins`, `range`, `density`, `alpha` |
| `Axes.pie` | Pie chart | `x`, `labels`, `autopct`, `explode`, `startangle` |
| `Axes.boxplot` | Box plot | `x`, `labels`, `vert`, `whis`, `showfliers` |
| `Axes.violinplot` | Violin plot | `dataset`, `showmeans`, `showmedians`, `points` |
| `Axes.errorbar` | Error bars | `x`, `y`, `yerr`, `xerr`, `fmt`, `capsize` |
| `Axes.imshow` | Image or heatmap | `X`, `cmap`, `aspect`, `interpolation`, `vmin`, `vmax` |

# Marker Reference

| Marker | Meaning |
|---|---|
| `o` | Circle |
| `.` | Point |
| `,` | Pixel |
| `x` | X mark |
| `+` | Plus |
| `s` | Square |
| `D` | Diamond |
| `^` | Triangle up |
| `v` | Triangle down |
| `*` | Star |

# Line Styles

| Style | Meaning |
|---|---|
| `-` | Solid |
| `--` | Dashed |
| `-.` | Dash-dot |
| `:` | Dotted |

# Named Colors

| Color | Typical Use |
|---|---|
| `tab:blue` | Default categorical series |
| `tab:orange` | Second categorical series |
| `tab:green` | Third categorical series |
| `tab:red` | Alert or emphasis |
| `black` | Text and axes |
| `white` | Light-on-dark backgrounds |
| `gray` | Neutral guides |
| `C0` to `C9` | Cycle colors |

# Recommended Colormaps

| Type | Colormaps |
|---|---|
| Sequential | `viridis`, `plasma`, `magma`, `cividis` |
| Diverging | `coolwarm`, `RdBu`, `seismic` |
| Categorical | `tab10`, `tab20`, `Set1`, `Set2` |
| Cyclic | `twilight`, `twilight_shifted` |

# rcParams Quick Reference

| Setting | Use |
|---|---|
| `figure.figsize` | Default figure size |
| `figure.dpi` | Default raster resolution |
| `savefig.dpi` | Export resolution |
| `savefig.bbox` | Default bounding box behavior |
| `axes.grid` | Default grid visibility |
| `axes.titlesize` | Title size |
| `axes.labelsize` | Axis label size |
| `xtick.labelsize` | X tick label size |
| `ytick.labelsize` | Y tick label size |
| `lines.linewidth` | Default line width |
| `lines.markersize` | Default marker size |
| `font.size` | Global font size |
| `legend.fontsize` | Legend font size |
| `figure.facecolor` | Figure background |
| `axes.facecolor` | Axes background |

# savefig Parameters

| Parameter | Purpose |
|---|---|
| `fname` | Output file path |
| `dpi` | Raster resolution |
| `format` | Output format override |
| `bbox_inches` | Tighten bounding box |
| `pad_inches` | Extra padding around figure |
| `transparent` | Transparent background |
| `facecolor` | Figure background color |
| `edgecolor` | Figure edge color |
| `metadata` | Embedded file metadata |
| `quality` | JPEG quality when relevant |

# Figure Layout Options

| API | Purpose | Best For |
|---|---|---|
| `subplot` | Quick shorthand subplot creation | Small, simple figures |
| `subplots` | Create figure and grid of axes | Most daily plotting tasks |
| `GridSpec` | Flexible asymmetric layouts | Complex dashboards and reports |
| `add_subplot` | Add one subplot to a figure | Manual OO figure assembly |
| `add_axes` | Absolute axes placement | Custom placements and inset-style control |

# pyplot vs Object-Oriented API

| API | Advantages | Limitations | Recommended Use Cases |
|---|---|---|---|
| `pyplot` | Fast, concise, familiar | State can be implicit and brittle | Quick exploration, small scripts |
| Object-oriented | Explicit, scalable, testable | Slightly more verbose | Production code, reusable plotting functions, multi-axes figures |

# Performance Checklist

| Area | Recommendations |
|---|---|
| Large datasets | Downsample, rasterize dense artists, avoid unnecessary markers |
| Memory management | Reuse axes when possible, close figures after saving |
| Rendering performance | Prefer simple artists, reduce overdraw, limit alpha-heavy layers |
| Export quality | Use vector formats for line art, high DPI for raster images |
| Reusing figures | Clear axes between iterations instead of recreating figures repeatedly |
| Closing figures | Call `plt.close(fig)` in loops and batch jobs |

# Common Errors

| Error | Cause | Solution |
|---|---|---|
| Blank figure | Forgot to call a plotting method or displayed the wrong figure | Verify the active axes and call `plt.show()` or save the correct figure |
| Empty legend | Artists have no labels | Set `label=` before `legend()` |
| Cropped labels | Tight layout not applied or export box too small | Use `constrained_layout=True` or `bbox_inches="tight"` |
| Overlapping tick labels | Too many ticks or labels too long | Rotate labels, reduce tick count, enlarge figure |
| Memory growth in loops | Figures not closed | Call `plt.close(fig)` after each export |
| Log scale errors | Zero or negative values on log axes | Filter or transform data before applying log scale |
| Colorbar mismatch | Colorbar attached to the wrong mappable | Pass the artist returned by `imshow`, `scatter`, or `contourf` |
| Distorted shapes | Aspect ratio left at default | Set `ax.set_aspect("equal")` when geometry matters |

# Production Checklist

- Use one consistent style and color system across the project.
- Prefer readable labels, units, and legends over decorative elements.
- Choose colorblind-safe palettes for categorical data.
- Match figure size to the target medium before export.
- Use vector formats for diagrams and high-DPI PNG for raster delivery.
- Keep layouts stable with `constrained_layout` or explicit spacing control.
- Remove clutter: unnecessary spines, redundant ticks, and overused annotations.
- Reuse figures in loops and close them after saving.
- Record versions, seeds, and data sources for reproducibility.
- Verify the plot remains readable in both light and dark themes.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md
[^2]: CURRENT_PROJECT_STATE_REPORT.md
[^3]: CONTENT_QUALITY_STANDARD.md
[^4]: ARCHITECTURE_FREEZE.md
[^5]: AENS-Knowledge-Layer-Specification.md
[^6]: https://matplotlib.org/stable/users/release_notes.html
[^7]: https://github.com/matplotlib/matplotlib/releases
[^8]: https://matplotlib.org/stable/users/release_notes
[^9]: https://github.com/orgs/matplotlib/repositories
[^10]: https://tacaswell.github.io/matplotlib/index.html
[^11]: https://matplotlib.org/stable/index.html
[^12]: https://github.com/matplotlib/matplotlib.github.com/blob/main/versions.html
[^13]: https://matplotlib.org/
[^14]: https://github.com/matplotlib/matplotlib
[^15]: https://github.com/matplotlib/matplotlib.github.com```

