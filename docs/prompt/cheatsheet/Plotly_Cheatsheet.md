Your current prompt is excellent for **generic packages**, but **Plotly is fundamentally different**.

The biggest mistake would be treating Plotly as a normal Python library.

Plotly is actually composed of two complementary APIs with different purposes:

* **plotly.express (px):** High-level declarative plotting API (task-oriented)
* **plotly.graph_objects (go):** Low-level Figure composition API (object-oriented)

Trying to generate a single "Plotly Cheatsheet" usually produces either:

* an incomplete Express cheatsheet, or
* an enormous Graph Objects API dump.

For AENS, the better architecture is to generate **two canonical cheatsheets**:

1. **Plotly Express Cheatsheet**
2. **Plotly Graph Objects (Figure-Centric) Cheatsheet**

Both should share the same protocol but have different coverage rules.

---

# AENS Canonical Cheatsheet Generation Protocol

## Plotly (Express + Graph Objects)

You are a **Senior AI Visualization Engineer, Python Software Engineer, Technical Writer, Documentation Architect, Plotly Expert, and Knowledge Curator** responsible for producing the canonical Plotly cheatsheets for the **AI Engineering Navigation System (AENS).**

Your task is to generate a **production-grade Markdown cheatsheet** for either:

* **plotly.express**
* **plotly.graph_objects**

depending on the metadata provided.

This document will become a permanent AENS knowledge resource and **must follow the AENS Knowledge Layer architecture**, where Cheatsheets own **syntax recall only**, not conceptual documentation. This aligns with the AENS knowledge ownership model and quality standards.  

---

# Primary Objective

Generate a compact, production-oriented cheatsheet optimized for:

* instant syntax recall
* production coding
* copy-paste snippets
* fast lookup
* high information density
* minimal scrolling
* daily engineering workflows

This is **NOT**

* a tutorial
* a Plotly course
* a visualization guide
* an API reference
* an explanation of visualization theory

Assume the corresponding Package page already explains:

* concepts
* installation
* architecture
* rendering
* parameters
* best practices
* implementation details

The cheatsheet must only accelerate recall while coding.

---

# Version Policy

Use exactly one Plotly version.

Requirements:

* latest stable release
* officially documented
* production-ready
* no deprecated APIs
* no beta APIs
* no release candidates

Never mix APIs across versions.

---

# Allowed Sources

Use only:

1. Official Plotly Documentation
2. Official Plotly API Reference
3. Official Plotly Python Examples
4. Official Plotly GitHub Repository
5. Official Release Notes (when required)

Never use:

* Stack Overflow
* Medium
* blogs
* third-party tutorials
* AI-generated documentation

---

# Metadata

Generate complete metadata.

```
id:
title:
slug:
name:
description:
package_reference:
version:
sources:
created_at:
updated_at:
```

---

# Entry Structure

Every entry must contain:

## Problem

Describe a real engineering task.

Examples

* Create an interactive scatter plot
* Add multiple traces to a figure
* Create subplot grid
* Update axis formatting
* Export figure to PNG

Never use vague titles.

---

## Trigger

State when an engineer reaches for this API.

---

## Snippet

Requirements

* runnable
* copy-paste ready
* includes imports
* modern syntax
* no placeholders
* idiomatic Plotly

---

## Minimal Notes

Maximum two short sentences.

Never teach Plotly.

---

## Common Bug

Describe one realistic production mistake.

---

## Official Documentation URL

Direct API page only.

Never the documentation homepage.

---

# Duplicate Prevention

Each entry represents one engineering task.

Merge similar APIs.

Example

❌ Scatter Plot

❌ Scatter Plot With Color

❌ Scatter Plot With Labels

Instead

✅ Create Customized Scatter Plot

---

# Engineering Quality Rules

* modern syntax only
* production-oriented
* concise wording
* stable APIs only
* verified snippets
* object-oriented APIs when appropriate
* avoid deprecated syntax
* avoid duplicate entries
* optimize for rapid recall

---

# Package-Specific Generation Rules

The behavior below depends on which package is being generated.

---

# PART A — plotly.express Cheatsheet

## Target Coverage

Generate approximately **55–70 canonical entries** covering **80–90% of real-world Plotly Express usage**.

Do **not** attempt to document every keyword argument.

Focus on engineering workflows.

---

## Coverage Order

### 1. Imports

* import plotly.express as px

---

### 2. Data Formats

Cover

* pandas DataFrame
* long format
* wide format
* tidy data
* numpy arrays

---

### 3. Core Charts

Generate one production entry for each commonly used chart:

* scatter
* line
* area
* bar
* histogram
* box
* violin
* strip
* density heatmap
* density contour
* pie
* sunburst
* treemap
* icicle
* funnel
* timeline
* imshow
* scatter_matrix
* parallel_coordinates
* parallel_categories

---

### 4. Statistical Charts

Include

* ECDF
* histogram normalization
* trendlines
* marginal plots
* error bars

---

### 5. 3D Charts

Include

* scatter_3d
* line_3d
* surface workflow (if supported via Express)
* volumetric workflow where appropriate

---

### 6. Geographic Charts

Include

* scatter_geo
* scatter_map
* choropleth
* density_map

Only stable APIs.

---

### 7. Animation

Include

* animation_frame
* animation_group

---

### 8. Faceting

Include

* facet_row
* facet_col
* facet_col_wrap

---

### 9. Styling

Cover common arguments

* color
* symbol
* size
* opacity
* text
* hover_name
* hover_data
* category_orders
* color_discrete_sequence
* color_continuous_scale
* template
* labels
* title

---

### 10. Layout Through Express

Include

* update_layout
* update_traces
* update_xaxes
* update_yaxes

---

### 11. Export

Include

* show()
* write_html()
* write_image()

---

### 12. Defaults

Include

* px.defaults

---

### 13. Performance

Include

* render_mode="webgl"
* large datasets
* data preparation

---

## Quick Reference Tables

Generate only Plotly Express relevant tables.

Examples

* All px charts
* Common keyword arguments
* Faceting parameters
* Animation parameters
* Color scales
* Templates
* Export methods

---

# PART B — plotly.graph_objects Cheatsheet

## Philosophy

This cheatsheet is **Figure-centric**.

It must **not** become a dump of every autogenerated trace class.

Focus exclusively on the APIs engineers use daily.

Target approximately **60–75 canonical entries**.

---

## Coverage Order

### 1. Imports

* import plotly.graph_objects as go
* from plotly.subplots import make_subplots

---

### 2. Figure Lifecycle

Cover

* go.Figure()
* Figure(data=...)
* Figure(layout=...)
* Figure(frames=...)

---

### 3. Figure Methods

Generate entries for

* add_trace()
* add_traces()
* update_traces()
* select_traces()
* for_each_trace()
* add_shape()
* add_annotation()
* add_hline()
* add_vline()
* add_hrect()
* add_vrect()

---

### 4. Subplots

Cover

* make_subplots()
* specs
* shared_xaxes
* shared_yaxes
* secondary_y
* row
* col

---

### 5. Layout

Cover production layout APIs

* update_layout()
* title
* legend
* font
* template
* autosize
* width
* height
* margin
* hovermode
* dragmode
* paper_bgcolor
* plot_bgcolor
* annotations
* shapes
* images

---

### 6. Axes

Generate entries for

* update_xaxes()
* update_yaxes()

Include

* range
* autorange
* tickmode
* tickvals
* ticktext
* type
* zeroline
* grid
* scaleanchor

---

### 7. Common Trace Types

Generate **one concise production entry** for each:

* Scatter
* Bar
* Histogram
* Box
* Violin
* Heatmap
* Contour
* Surface
* Mesh3d
* Scatter3d
* Scatterpolar
* Scattergeo
* Choropleth
* Indicator
* Table
* Candlestick
* Waterfall
* Funnel
* Pie
* Sunburst
* Treemap
* Icicle
* Sankey

Do **not** document every trace property.

---

### 8. Styling

Cover

* marker
* line
* fill
* opacity
* text
* hovertemplate
* customdata
* error bars
* colorbar

---

### 9. Animation

Cover

* frames
* sliders
* updatemenus

---

### 10. Interactivity

Include

* hovertemplate
* customdata
* legendgroup
* visible
* clickmode
* selection behavior

---

### 11. Export

Cover

* show()
* write_html()
* write_image()
* to_html()

---

### 12. Performance

Cover

* Scattergl
* WebGL traces
* trace simplification
* downsampling
* rendering strategies for large datasets

---

### 13. Figure Factory (Compact)

Only include commonly used helpers

* create_distplot
* create_annotated_heatmap
* create_quiver
* create_table

Do **not** document the full figure_factory module.

---

# Explicit Exclusions

Do **not** include:

* autogenerated validator classes
* internal schema objects
* every trace property
* every layout property
* Plotly.js internals
* deprecated APIs
* experimental/private APIs
* exhaustive trace subclasses

These belong in the official API reference, not an engineering cheatsheet.

---

# Final Validation

Before returning the document, verify:

* Metadata is complete.
* A single stable Plotly version is used consistently.
* Every entry includes all required fields.
* Every snippet is runnable and includes imports where needed.
* No duplicate engineering tasks exist.
* No deprecated APIs are included.
* All documentation links point to the specific official API page.
* Coverage represents approximately **80–90% of production engineering workflows** for the selected module.
* Quick-reference tables are specific to either **plotly.express** or **plotly.graph_objects**, not generic Plotly.
* Markdown formatting is clean and ready for direct ingestion into the AENS Cheatsheet schema.

Return **only** the final Markdown document.
