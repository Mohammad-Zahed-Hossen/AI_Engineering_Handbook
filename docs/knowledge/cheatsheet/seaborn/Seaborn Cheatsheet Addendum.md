<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Seaborn Cheatsheet Addendum

## Metadata

- **id:** seaborn_cheatsheet_addendum_01
- **title:** Seaborn Cheatsheet Addendum
- **slug:** seaborn-cheatsheet-addendum
- **name:** Seaborn Cheatsheet Addendum
- **description:** Additional high-density Seaborn 0.13.2 syntax recall entries focused on official modern APIs not covered in the first cheatsheet.[^1]
- **package_reference:** Seaborn Package Reference
- **version:** 0.13.2
- **sources:** [Seaborn API reference](https://seaborn.pydata.org/api.html), [Seaborn package reference](file:1)
- **created_at:** 2026-07-06
- **updated_at:** 2026-07-06


## Quick Reference

### Figure-level vs axes-level APIs

| Figure-level | Axes-level |
| :-- | :-- |
| `relplot` | `scatterplot`, `lineplot` |
| `displot` | `histplot`, `kdeplot`, `ecdfplot`, `rugplot` |
| `catplot` | `barplot`, `countplot`, `boxplot`, `violinplot`, `boxenplot`, `stripplot`, `swarmplot`, `pointplot` |
| `lmplot` | `regplot`, `residplot` |

### Color utilities

| Utility | Best for |
| :-- | :-- |
| `set_palette` | Global categorical palette |
| `set_color_codes` | Matplotlib color shorthand remapping |
| `color_palette` | Palette list or colormap |
| `husl_palette` | Evenly spaced categorical hues |
| `hls_palette` | Evenly spaced hues in HLS space |
| `cubehelix_palette` | Sequential palette with luminance control |
| `dark_palette` | Sequential palette from dark to a color |
| `light_palette` | Sequential palette from light to a color |
| `diverging_palette` | Two-sided diverging palette |
| `blend_palette` | Custom palette interpolation |
| `xkcd_palette` | Named xkcd colors |
| `crayon_palette` | Named crayon colors |
| `mpl_palette` | Matplotlib registry palettes |

### Theme utilities

| Theme utility | Best for |
| :-- | :-- |
| `set_theme` | One-call style setup |
| `set_style` | Axes/grid style only |
| `set_context` | Scale text and elements |
| `axes_style` | Read or temporarily set style |
| `plotting_context` | Read or temporarily set context |
| `reset_defaults` | Restore seaborn defaults |
| `reset_orig` | Restore original Matplotlib rcParams |
| `despine` | Remove top/right spines |
| `move_legend` | Reposition legend |

### Utility functions

| Utility | Best for |
| :-- | :-- |
| `load_dataset` | Example data loading |
| `get_dataset_names` | List available example datasets |
| `set_hls_values` | Fine color adjustment |
| `saturate` | Increase saturation of a color |
| `desaturate` | Reduce saturation of a color |

## Theme utilities

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Read or temporarily apply style settings. | You need to inspect or scope plot style changes. | ```python |  |  |  |

import seaborn as sns
import matplotlib.pyplot as plt

with sns.axes_style("whitegrid"):
ax = sns.scatterplot(data=sns.load_dataset("tips").dropna(), x="total_bill", y="tip")
plt.show()
```| `axes_style()` is useful when you want a local style scope. It avoids permanently changing the global theme state. [^1] | Forgetting that theme changes can leak across plots in the same session. | [axes_style](https://seaborn.pydata.org/api.html#seaborn.axes_style) | | Read or temporarily apply context scaling. | You need a scoped change to font and line sizing. |```python
import seaborn as sns
import matplotlib.pyplot as plt

with sns.plotting_context("talk"):
ax = sns.lineplot(data=sns.load_dataset("flights"), x="year", y="passengers")
plt.show()

``` | Use context scaling for figures intended for slides or print. This is cleaner than manual global resizing. [^1] | Applying large fonts without resizing the figure. | [plotting_context](https://seaborn.pydata.org/api.html#seaborn.plotting_context) |
| Reset theme state after experimentation. | You need to return to default visual settings. | ```python
import seaborn as sns

sns.reset_defaults()
sns.reset_orig()
``` | `reset_defaults()` returns seaborn defaults; `reset_orig()` restores original Matplotlib settings. Use one intentionally. [^1] | Forgetting to reset after exploratory theme changes. | [reset_defaults](https://seaborn.pydata.org/api.html#seaborn.reset_defaults) |
| Remap Matplotlib color codes. | You want Seaborn’s shorthand colors in Matplotlib plots. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme()
sns.set_color_codes("deep")
plt.plot([1, 2, 3], [1, 4, 9], color="b")
plt.show()
``` | This helps align Matplotlib shorthand colors with a Seaborn palette. It is useful when mixing both libraries. [^1] | Assuming Matplotlib shorthand colors always match your active palette. | [set_color_codes](https://seaborn.pydata.org/api.html#seaborn.set_color_codes) |

## Color utilities

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Build a custom palette from named colors. | You need exact control over a categorical palette. | ```python
import seaborn as sns

palette = sns.color_palette(["#4C72B0", "#55A868", "#C44E52", "#8172B2"])
print(palette)
``` | Use explicit hex values when brand colors matter. This is common in production dashboards. [^1] | Using too many colors with weak contrast. | [color_palette](https://seaborn.pydata.org/api.html#seaborn.color_palette) |
| Make a diverging palette for centered data. | You need a palette around a midpoint like zero. | ```python
import seaborn as sns

palette = sns.diverging_palette(220, 20, as_cmap=True)
print(palette)
``` | Diverging palettes work well for deltas and centered matrices. They are a strong fit for heatmaps and residual views. [^1] | Using a sequential palette for data that has positive and negative values. | [diverging_palette](https://seaborn.pydata.org/api.html#seaborn.diverging_palette) |
| Generate a sequential palette. | You need ordered shading for numeric intensity. | ```python
import seaborn as sns

palette = sns.light_palette("seagreen", as_cmap=True)
print(palette)
``` | Sequential palettes are better when magnitude changes in one direction. Use them for counts, density, and rank-like values. [^1] | Using dark text over a too-dark sequential palette. | [light_palette](https://seaborn.pydata.org/api.html#seaborn.light_palette) |
| Adjust saturation of a color. | You want a toned-down or stronger version of one color. | ```python
import seaborn as sns

print(sns.desaturate("steelblue", .5))
print(sns.saturate("steelblue"))
``` | These helpers are useful for making emphasis colors and muted companions. They keep palette harmony better than arbitrary color picks. [^1] | Tweaking saturation without checking contrast. | [desaturate](https://seaborn.pydata.org/api.html#seaborn.desaturate) |
| Fine-tune a color in HLS space. | You need a precise lighten/darken adjustment. | ```python
import seaborn as sns

print(sns.set_hls_values("teal", l=.7, s=.8))
``` | This is useful when a palette needs a controlled highlight color. It is more predictable than trial-and-error edits. [^1] | Changing lightness too far and losing readability. | [set_hls_values](https://seaborn.pydata.org/api.html#seaborn.set_hls_values) |

## Objects interface

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| Build a declarative scatter plot. | You want the modern composable plotting API. | ```python
import seaborn.objects as so
import seaborn as sns

df = sns.load_dataset("penguins").dropna()
(
    so.Plot(df, x="bill_length_mm", y="bill_depth_mm", color="species")
    .add(so.Dot(), so.Jitter(0.2))
)
``` | The objects interface is good for reusable plot specifications. It is the modern declarative layer in Seaborn 0.13.2. [^1] | Forgetting that the objects interface is separate from axes-level functions. | [Plot](https://seaborn.pydata.org/api.html#seaborn.Plot) |
| Build a histogram with the objects API. | You need explicit control over a binned distribution. | ```python
import seaborn.objects as so
import seaborn as sns

df = sns.load_dataset("penguins").dropna()
(
    so.Plot(df, x="bill_length_mm")
    .add(so.Bar(), so.Hist())
)
``` | `Hist` is the declarative histogram stat in the objects API. It is useful when combining bins with other marks. [^1] | Mixing up `so.Bar()` and `so.Hist()` responsibilities. | [Hist](https://seaborn.pydata.org/api.html#seaborn.Hist) |
| Build a smooth density estimate. | You want a declarative KDE workflow. | ```python
import seaborn.objects as so
import seaborn as sns

df = sns.load_dataset("penguins").dropna()
(
    so.Plot(df, x="bill_length_mm")
    .add(so.Line(), so.KDE())
)
``` | `KDE` gives an explicit density transform in the objects interface. It is useful when you want the same composition model across plot types. [^1] | Using a density estimate where the sample size is too small for a stable curve. | [KDE](https://seaborn.pydata.org/api.html#seaborn.KDE) |
| Build a declarative categorical summary. | You want bars with an explicit estimator workflow. | ```python
import seaborn.objects as so
import seaborn as sns

df = sns.load_dataset("tips").dropna()
(
    so.Plot(df, x="day", y="total_bill", color="sex")
    .add(so.Bar(), so.Est(errorbar="ci"))
)
``` | `Est` is the declarative estimator/error-bar stat. It is the objects API equivalent of summary-style categorical plots. [^1] | Forgetting that summary bars show estimates, not raw observations. | [Est](https://seaborn.pydata.org/api.html#seaborn.Est) |
| Build a declarative regression-like fit. | You need a fitted trend in the objects API. | ```python
import seaborn.objects as so
import seaborn as sns

df = sns.load_dataset("tips").dropna()
(
    so.Plot(df, x="total_bill", y="tip")
    .add(so.Dot(alpha=0.4))
    .add(so.Line(color="crimson"), so.PolyFit(order=1))
)
``` | `PolyFit` is useful for explicit polynomial fitting in the declarative pipeline. It gives a modern alternative to ad hoc trend fitting. [^1] | Fitting a high-order polynomial and overinterpreting the curve. | [PolyFit](https://seaborn.pydata.org/api.html#seaborn.PolyFit) |
| Handle dense scatter with positional nudging. | You need to reduce overlap in crowded point plots. | ```python
import seaborn.objects as so
import seaborn as sns

df = sns.load_dataset("tips").dropna()
(
    so.Plot(df, x="day", y="total_bill", color="sex")
    .add(so.Dot(), so.Dodge())
)
``` | `Dodge` helps separate overlapping groups along the categorical axis. It is useful for comparative plots with repeated categories. [^1] | Using dodge when the categories already have no overlap. | [Dodge](https://seaborn.pydata.org/api.html#seaborn.Dodge) |

## Utility functions

| Problem | Trigger | Snippet | Minimal notes | Common bug | Official docs |
|---|---|---|---|---|---|
| List available built-in datasets. | You need to know what demo data can be loaded. | ```python
import seaborn as sns

print(sns.get_dataset_names())
``` | This is useful for examples and validation scripts. Treat it as discovery data, not a production catalog. [^1] | Assuming the dataset list is offline-stable or exhaustive for your use case. | [get_dataset_names](https://seaborn.pydata.org/api.html#seaborn.get_dataset_names) |
| Load a dataset and cache it locally. | You need a documented sample dataset for a prototype. | ```python
import seaborn as sns

df = sns.load_dataset("iris")
print(df.head())
``` | Built-in datasets are convenient for demos and quick checks. They should not be the primary data source in production. [^1] | Relying on the online dataset fetch in an offline environment. | [load_dataset](https://seaborn.pydata.org/api.html#seaborn.load_dataset) |
| Reuse a legend in a new location. | You need to move a legend after plotting. | ```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins").dropna()
ax = sns.scatterplot(data=df, x="bill_length_mm", y="bill_depth_mm", hue="species")
sns.move_legend(ax, "upper left", bbox_to_anchor=(1, 1))
plt.show()
``` | Use `move_legend()` when the legend needs to sit outside the axes. This is common in dashboards with tight plotting areas. [^1] | Moving the legend without adjusting the saved figure bounding box. | [move_legend](https://seaborn.pydata.org/api.html#seaborn.move_legend) |

## Common API mapping

| Task | API |
|---|---|
| Scoped style changes | `axes_style`, `plotting_context` |
| Reset visual defaults | `reset_defaults`, `reset_orig` |
| Global color shorthand remapping | `set_color_codes` |
| Explicit palette building | `color_palette`, `husl_palette`, `hls_palette`, `cubehelix_palette` |
| Sequential palette generation | `light_palette`, `dark_palette` |
| Diverging palette generation | `diverging_palette` |
| Palette interpolation | `blend_palette` |
| Accessible palette selection | `color_palette("colorblind")` |
| Color adjustment | `saturate`, `desaturate`, `set_hls_values` |
| Legend repositioning | `move_legend` |
| Example dataset discovery | `get_dataset_names` |
| Example dataset loading | `load_dataset` |

## Common errors

| Error | Cause | Solution |
|---|---|---|
| Plot state changes leak into later figures. | Theme settings were applied globally in a shared session. | Use context managers or reset seaborn state before the next plot. |
| Legend is clipped in export. | The legend sits outside the axes without tight bounding boxes. | Use `bbox_inches="tight"` and confirm final legend placement. |
| Data loads but plot is empty. | Wrong columns, NaNs, or mismatched semantics. | Validate column names and remove missing values in plotted fields. |
| Figures look unreadable in dashboards. | Default size and context do not match the output medium. | Set `context`, `figsize`, and export DPI together. |
| Density or regression looks unstable. | Too few points or poor bin/fitting settings. | Sample, simplify, or choose a summary view aligned to the data size. |

## Performance checklist

- Sample first for millions of rows unless the raw point cloud is essential.
- Prefer aggregation views over raw scatter when overplotting dominates.
- Use rasterization or lower alpha for dense point clouds.
- Reuse figures and axes instead of recreating them in loops.
- Avoid repeated rendering of the same plot in notebook cells.
- Drop unused columns before plotting to reduce memory pressure.
- Export to vector formats for line art and use higher DPI only when needed.
- Tighten layout before saving to prevent clipping and repeated export fixes.

## Production checklist

- Labels are readable and specific.
- Color palette is accessible and consistent.
- A colorblind-safe palette is used when categories matter.
- Figure size matches the target display medium.
- Legend placement does not cover data.
- Titles and axis labels are present.
- Export DPI matches the output requirement.
- Theme is consistent across the report or dashboard.
- Sampling and ordering are reproducible.


<div align="center">⁂</div>

[^1]: Seaborn-Package-Reference.md```

