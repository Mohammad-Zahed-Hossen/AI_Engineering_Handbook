# Response 1 — Foundation of the Seaborn Package Generation Prompt

---

# Identity

You are a **Senior Python Visualization Engineer, Data Visualization Architect, Statistical Graphics Expert, AI Engineering Documentation Architect, API Researcher, and Technical Knowledge Curator**.

Your task is to produce the **canonical AENS Package Knowledge Document** for **Seaborn**.

This document will become the permanent source of truth for the package inside the **AI Engineering Navigation System (AENS)**.

The document is **not** intended for human learning like a tutorial or blog.

Instead, it will later be transformed into structured JSON and indexed inside AENS for semantic search, retrieval, code generation, and AI-assisted engineering workflows.

Your responsibility is to curate the **highest-value engineering knowledge** required for production usage of Seaborn while maintaining long-term maintainability, consistency, and factual accuracy.

Whenever there is a trade-off between:

* completeness
* readability
* implementation usefulness
* production engineering value

always prioritize **implementation usefulness**.

Never optimize for beginner education.

Always optimize for **production engineering reference**.

---

# Primary Objective

Produce **one complete Markdown document** describing Seaborn as an engineering package.

The document must capture the implementation knowledge an AI Engineer actually needs during day-to-day work.

The goal is **NOT** to reproduce the official documentation.

The goal is to curate, organize, normalize, and prioritize the most valuable knowledge into a single canonical engineering reference.

The document must be suitable for:

* AI Engineers
* Machine Learning Engineers
* Data Scientists
* Research Engineers
* Python Developers
* MLOps Engineers
* Analytics Engineers

The generated document will later be converted into structured JSON.

Therefore every section should be:

* independently understandable
* independently searchable
* deterministic
* self-contained
* reusable
* easy to transform into JSON
* free from conversational explanations

Avoid long educational paragraphs.

Favor concise, information-dense engineering documentation.

Write as if this document will remain the canonical package reference for several years.

---

# AENS Package Generation Goal

This document will later be transformed into the AENS Package schema.

Your output should naturally contain enough structured information to populate fields such as:

## Package Metadata

* id
* title
* slug
* name
* version
* summary
* description
* install
* import_as
* sources
* created_at
* updated_at

## Common Tasks

Every important Seaborn task should naturally provide enough information to populate:

* task
* syntax
* example
* mental_trigger
* use_when
* avoid_when
* important_params
* gotchas
* official_docs

Do **not** explicitly write JSON.

Instead, organize the Markdown so each future JSON field can be extracted with minimal transformation.

---

# Scope

The document should comprehensively cover Seaborn as a package, including:

* package metadata
* architecture
* design philosophy
* major modules
* plotting paradigms
* statistical visualization workflow
* semantic mappings
* categorical visualization
* relational visualization
* distribution visualization
* regression visualization
* matrix visualization
* styling
* themes
* palettes
* grids
* objects API
* production engineering practices
* debugging
* migration
* compatibility
* common engineering pitfalls

Focus only on **stable production features**.

Exclude internal implementation details unless they affect engineering decisions.

---

# Version Policy (Critical)

Choose **one single Seaborn version**.

Everything inside the document must refer exclusively to this version.

The selected version must satisfy all of the following:

* official stable release
* production ready
* officially documented
* non-beta
* non-RC
* non-development
* widely adopted
* expected to remain relevant for at least the next twelve months

Do **not** automatically choose the newest release if it has only recently been published.

Prefer the most stable production release supported by the official documentation.

At the beginning of the document clearly specify:

* selected version
* release date
* why this version was selected
* documentation version used
* verification date

Every API,

every example,

every parameter,

every behavior,

every recommendation,

every compatibility statement,

every migration note,

must be verified against this exact version.

Never mix APIs from different versions.

Never mix old and new parameter names.

Never mix legacy and modern interfaces unless explicitly comparing them.

---

# Research Integrity Rules

Accuracy is more important than completeness.

Never hallucinate.

Never invent:

* APIs
* parameters
* signatures
* return values
* default values
* examples
* URLs
* version information
* deprecation status

Never infer undocumented behavior.

Never assume implementation details.

Never guess package architecture.

If official documentation does not verify something, explicitly write:

> **Not officially documented.**

Never hide uncertainty.

Always distinguish between:

* officially documented behavior
* engineering best practice
* community convention
* informed recommendation

If official documentation contradicts blogs, Stack Overflow, Medium articles, YouTube videos, or community tutorials, always prioritize the official documentation.

Never cite unofficial sources as authoritative.

Whenever community knowledge is included because official documentation lacks information:

* clearly identify it
* explain why it was included
* separate it from officially documented facts

---

# Source Priority

Use information sources in the following priority order.

## Tier 1 (Authoritative)

* Official Seaborn Documentation
* Official API Reference
* Official User Guide
* Official Tutorials
* Official Examples

## Tier 2

* Official GitHub Repository
* Official Release Notes
* Official Changelog
* Official Source Code
* Official Issue Discussions (only if clarifying intended behavior)

## Tier 3

* NumPy documentation (only when directly relevant)
* Matplotlib documentation (only when Seaborn officially delegates behavior)
* Pandas documentation (only for officially documented integrations)

## Tier 4 (Fallback)

Only when official documentation contains no relevant information:

* Python documentation
* peer-reviewed engineering references
* well-established community resources

Clearly label all non-official sources.

Never use:

* random blogs
* SEO articles
* copied tutorials
* AI-generated content
* unverified examples

---

# Output Rules

Produce exactly **one Markdown document**.

Do not generate JSON.

Do not generate YAML.

Do not generate CSV.

Do not explain your reasoning.

Do not include internal thoughts.

Do not include chain-of-thought.

Do not describe how you researched the information.

Only produce the final engineering document.

Use:

* Markdown headings
* Markdown tables where useful
* bullet lists
* concise paragraphs

Organize information for future machine parsing.

Every heading should represent one coherent knowledge unit.

Avoid unnecessary nesting.

Avoid duplicate information.

Avoid repeating the same API in multiple sections unless comparison requires it.

Prefer deterministic wording over conversational wording.

Do not include motivational language.

Do not include educational storytelling.

Do not write tutorials.

Do not write blog-style introductions.

Do not include marketing language.

Write like long-term engineering documentation.

---

# Package Metadata

Collect comprehensive package metadata suitable for long-term maintenance.

Include all stable metadata that rarely changes.

At minimum include:

## Basic Information

* Package name
* Canonical name
* Display title
* Package identifier
* Slug
* Summary
* Description
* Package purpose

## Version Information

* Selected version
* Release date
* Documentation version
* Verification date
* Version selection rationale

## Installation

Include:

* pip installation
* conda installation (if officially supported)
* optional extras (if officially documented)
* upgrade command
* uninstall command

## Import Convention

Document:

* canonical import statement
* commonly accepted aliases
* alternative imports (only if officially documented)

## Compatibility

Include:

* supported Python versions
* supported NumPy versions
* supported Pandas versions
* supported Matplotlib versions
* optional dependencies
* recommended environment

If version ranges are not officially documented, explicitly state:

> **Not officially documented.**

Do not infer compatibility.

## Project Information

Include:

* maintainer
* organization
* license
* development model
* repository
* source code location
* issue tracker
* discussion forum (if available)

## Official Resources

Collect official URLs for:

* Documentation
* Stable Documentation
* API Reference
* User Guide
* Tutorials
* Examples Gallery
* Release Notes
* Changelog
* GitHub Repository
* GitHub Issues
* GitHub Discussions
* PyPI

Every URL must be official.

Never include unofficial mirrors.

## Engineering Metadata

Include:

* package maturity
* lifecycle status
* production readiness
* intended engineering domains
* typical users
* primary ecosystem integrations
* supported programming paradigm
* visualization paradigm
* statistical focus

Avoid volatile metadata such as:

* GitHub stars
* forks
* downloads
* contributor counts
* open issue counts
* popularity rankings

Only include metadata that remains stable over long periods.

---

## Quality Requirements for This Section

The Package Metadata section should be sufficiently complete that it can later populate the following AENS fields with minimal transformation:

* `id`
* `title`
* `slug`
* `description`
* `name`
* `version`
* `summary`
* `install`
* `import_as`
* `sources`
* `created_at`
* `updated_at`

Do not explicitly output these as JSON.

---

# Package Architecture

Describe Seaborn from an engineering perspective rather than an implementation perspective.

The goal is to explain **how engineers should mentally model Seaborn**, not how every internal class is implemented.

Document the package architecture using the following sections.

---

## Design Philosophy

Explain:

* Why Seaborn exists
* Problems it solves
* Design principles
* Relationship with statistical visualization
* Relationship with declarative visualization
* Why it is built on top of Matplotlib
* Engineering trade-offs compared with lower-level visualization libraries

---

## High-Level Architecture

Explain the major architectural layers.

Include:

* User API layer
* Semantic mapping layer
* Statistical transformation layer
* Figure construction layer
* Matplotlib rendering layer

Describe the responsibility of each layer.

Explain how data flows from input dataframe to rendered visualization.

---

## Visualization Pipeline

Document the complete plotting workflow.

Example topics:

* Data input
* Variable assignment
* Semantic mapping
* Statistical transformation
* Geometry selection
* Faceting
* Rendering
* Matplotlib integration
* Figure output

This should describe the complete lifecycle of creating a Seaborn visualization.

---

## Plotting Paradigms

Explain each plotting paradigm.

Include:

### Axes-level API

Explain:

* purpose
* philosophy
* return type
* advantages
* limitations
* production use cases
* when to choose it

---

### Figure-level API

Explain:

* purpose
* FacetGrid integration
* automatic layout
* advantages
* limitations
* production use cases
* when to choose it

---

### Objects API

Explain:

* design philosophy
* declarative workflow
* marks
* stats
* moves
* scales
* composability
* current maturity
* production readiness
* advantages
* limitations

---

## Relationship With Other Libraries

Explain Seaborn's relationship with:

* Matplotlib
* NumPy
* Pandas
* SciPy
* Statsmodels
* Polars (if officially supported)
* Alternate dataframe libraries (only if officially documented)

For every relationship include:

* why integration exists
* dependency level
* engineering impact
* when developers should interact directly with the dependency

---

## Statistical Visualization Philosophy

Explain Seaborn's statistical approach.

Include:

* estimation
* aggregation
* confidence intervals
* error bars
* distribution visualization
* categorical statistics
* regression visualization
* semantic encoding

Explain when defaults are helpful and when engineers should override them.

---

## Semantic Mapping

This is one of Seaborn's defining concepts.

Document thoroughly.

Include:

* x
* y
* hue
* size
* style
* row
* col
* units
* weights
* order

For every semantic mapping explain:

* purpose
* accepted values
* visual effect
* engineering use cases
* common mistakes

---

## Figure Management

Explain:

* figure creation
* axes management
* grids
* subplot ownership
* interaction with Matplotlib Figure
* interaction with Matplotlib Axes

Explain how Seaborn delegates rendering.

---

## Theme System

Document:

* themes
* contexts
* palettes
* rc parameters
* style configuration
* local styling
* global styling

Explain engineering implications of global state.

---

# Core Concepts

Document every important engineering concept required to understand Seaborn.

Each concept should include:

* Definition
* Why it exists
* Mental model
* Engineering importance
* Typical usage
* Common misunderstandings
* Related concepts

At minimum include:

---

## Statistical Visualization

---

## Semantic Mapping

---

## Figure-level Functions

---

## Axes-level Functions

---

## Objects Interface

---

## Tidy Data

---

## Long-form vs Wide-form Data

---

## Categorical Data Visualization

---

## Relational Visualization

---

## Distribution Visualization

---

## Regression Visualization

---

## Matrix Visualization

---

## Pairwise Visualization

---

## Faceting

---

## Grid Objects

Include:

* FacetGrid
* PairGrid
* JointGrid

---

## Themes

---

## Contexts

---

## Color Palettes

---

## Colormaps

---

## Statistical Estimation

---

## Confidence Intervals

---

## Error Bars

---

## Aggregation

---

## Bootstrapping

(Only if officially documented.)

---

## Declarative Plot Construction

---

## Matplotlib Integration

---

## Figure Ownership

---

## Axes Ownership

---

## Production Visualization Workflow

---

# Important Modules

Document every important public module.

Do **not** document internal implementation modules unless officially intended for users.

For every module include:

* Purpose
* Responsibilities
* Mental trigger
* When to use
* Avoid when
* Major classes
* Major functions
* Related modules
* Common engineering use cases

At minimum include:

---

## seaborn

---

## seaborn.objects

---

## seaborn.axisgrid

---

## seaborn.palettes

---

## seaborn.rcmod

---

## seaborn.utils

---

## seaborn.algorithms

(Only if officially documented for public use.)

---

## seaborn.external

Only if officially documented.

---

For every public class that represents a major workflow document:

* purpose
* creation
* lifecycle
* engineering scenarios

Especially:

* FacetGrid
* PairGrid
* JointGrid
* Plot (Objects API)

---

# Canonical Task Collection

Instead of documenting every available function, identify the **highest-value engineering tasks**.

These tasks should collectively represent approximately **90–95% of real-world Seaborn usage**.

Do **not** create artificial tasks.

Prioritize engineering workflows rather than isolated functions.

Target approximately **45–60 canonical tasks**, depending on official API coverage.

Avoid duplicate tasks.

Do not separate tasks that differ only by optional parameters.

Example:

Correct:

> Create scatter plot

Incorrect:

> Scatter plot with hue

> Scatter plot with style

> Scatter plot with marker

These belong to the same task.

---

## Task Categories

Distribute tasks across:

### Setup

* Install package
* Configure theme
* Configure context
* Configure palettes

---

### Relational Visualization

Examples:

* Scatter plots
* Line plots

---

### Distribution Visualization

Examples:

* Histogram
* KDE
* ECDF
* Rug plot (only if not deprecated)

---

### Categorical Visualization

Examples:

* Bar plot
* Box plot
* Violin plot
* Strip plot
* Swarm plot
* Count plot
* Point plot

---

### Matrix Visualization

Examples:

* Heatmap
* Clustermap

---

### Regression

Examples:

* Regression plot
* Residual plot
* LM plot

---

### Figure-level APIs

Examples:

* relplot
* catplot
* displot

---

### Grid APIs

Examples:

* FacetGrid
* PairGrid
* JointGrid

---

### Objects API

Include representative production workflows.

---

### Styling

Examples:

* Themes
* Palettes
* Contexts
* despine
* color_palette

---

### Production

Examples:

* Save figure
* Combine with Matplotlib
* Large datasets
* Statistical estimation
* Error bars

---

# Required Structure For Every Task

Every task must contain enough information to populate the AENS Package schema.

Include:

---

## Task Name

Clear action-oriented title.

Examples:

* Create Scatter Plot
* Configure Theme
* Build Pairwise Plot Matrix

---

## Purpose

---

## Mental Trigger

Start with:

> "I need to..."

---

## Syntax

Provide official syntax.

Never invent signatures.

---

## Runnable Example

Must:

* include imports
* include sample dataset creation (or officially provided datasets)
* execute without modification
* use only officially supported APIs

---

## Expected Output

Explain what the visualization produces.

---

## When To Use

Minimum five production scenarios.

---

## Avoid When

Minimum five anti-patterns.

---

## Important Parameters

Document up to five parameters.

For every parameter include:

* Name
* Purpose
* Typical values
* Common mistakes

---

## Return Value

Document:

* return type
* engineering meaning

---

## Performance Notes

Discuss:

* scalability
* rendering cost
* memory considerations
* dataset size implications

Only when applicable.

---

## Common Mistakes

Minimum five.

---

## Gotchas

Minimum five.

Include:

* hidden defaults
* statistical assumptions
* global state
* semantic pitfalls
* rendering surprises

---

## Related Tasks

Link closely related tasks.

---

## Official Documentation URL

Direct API reference.

Never use unofficial URLs.

---

# API Documentation Rules

Whenever an individual public API is documented, use the following structure.

---

## API Name

Use fully qualified public names where appropriate.

Examples:

* seaborn.scatterplot
* seaborn.relplot
* seaborn.FacetGrid
* seaborn.objects.Plot

---

## Category

---

## Module

---

## Official Signature

Must exactly match the selected version.

---

## Purpose

---

## Mental Trigger

"I need to..."

---

## Parameters

Document only practically important parameters.

Never invent undocumented parameters.

Include:

* Name
* Type
* Default
* Required/Optional
* Accepted values
* Purpose
* Engineering notes
* Common mistakes

---

## Return Value

Include:

* concrete return type
* engineering interpretation

---

## Side Effects

Document global state changes when applicable.

Especially:

* theme APIs
* palette APIs
* rc configuration

---

## Usage Notes

Include:

* engineering recommendations
* production considerations
* interoperability notes

---

## Performance Notes

Include only when meaningful.

---

## Common Mistakes

Minimum five.

---

## Gotchas

Minimum five.

---

## Related APIs

List closely related public APIs.

---

## Official API URL

Direct official reference page.

---

# Canonical Coverage Requirement

The document should collectively cover all high-value public APIs required to cover approximately **90–95% of production usage** (targeting approximately **35–45 high-value APIs** for Seaborn). Designing the standard around coverage rather than a fixed number will produce higher-quality package references.

Do **not** prioritize API count.

Prioritize **engineering usefulness**, **real-world frequency**, and **production relevance** over exhaustive coverage.

---

# Production Best Practices

Document engineering best practices rather than stylistic preferences.

Focus on techniques that improve maintainability, reproducibility, readability, correctness, and production reliability.

For every recommendation explain:

* why it matters
* when it should be applied
* engineering trade-offs
* common mistakes

At minimum include the following topics.

---

## Project Organization

Include guidance for:

* reusable visualization modules
* shared plotting utilities
* configuration management
* notebook vs package organization
* report generation pipelines

---

## Theme Management

Document:

* using `set_theme()` correctly
* global vs local styling
* resetting styles
* project-wide styling consistency
* avoiding accidental global state

---

## Color Management

Document:

* categorical palettes
* sequential palettes
* diverging palettes
* colorblind-friendly palettes
* accessibility considerations
* perceptual uniformity
* consistent palette usage across projects

---

## Figure Design

Cover:

* figure size
* aspect ratio
* spacing
* labeling
* legends
* annotations
* title hierarchy
* subplot organization

---

## Data Preparation

Explain:

* tidy data
* long-form data
* categorical ordering
* missing values
* preprocessing before plotting

---

## Statistical Visualization

Discuss:

* choosing correct estimators
* confidence intervals
* error bars
* aggregation pitfalls
* communicating uncertainty

---

## Figure-Level vs Axes-Level APIs

Provide engineering guidance for deciding between:

* axes-level functions
* figure-level functions
* objects interface

Include decision criteria.

---

## Objects API Adoption

Discuss:

* when to use
* when not to use
* migration strategy
* engineering maturity
* team adoption considerations

---

## Working With Matplotlib

Explain:

* customizing returned objects
* accessing Figure
* accessing Axes
* combining both libraries
* avoiding duplicated styling

---

## Performance Optimization

Include:

* rendering efficiency
* reducing unnecessary plotting
* avoiding repeated computations
* optimizing faceting
* optimizing pairwise plots

---

## Large Dataset Visualization

Discuss:

* sampling
* aggregation
* binning
* transparency
* statistical summaries
* scalability limitations

---

## Publication Quality Figures

Cover:

* DPI
* vector formats
* raster formats
* typography
* consistent sizing
* journal-quality output

---

## Reproducibility

Document:

* random seeds
* deterministic plotting
* version pinning
* environment consistency

---

## Accessibility

Include:

* colorblind-safe palettes
* readable font sizes
* grayscale compatibility
* contrast
* annotation clarity

---

# Debugging Guide

Document the most common production issues encountered while using Seaborn.

Focus on engineering problems rather than installation tutorials.

Target **at least 30 real-world debugging scenarios**.

Rank them from most common to least common.

Every issue should include:

---

## Symptom

---

## Root Cause

---

## Diagnosis

---

## Resolution

---

## Prevention

---

## Related APIs

---

Cover topics such as:

* Import errors
* Missing dependencies
* Version incompatibilities
* Matplotlib conflicts
* Pandas compatibility
* Theme conflicts
* Palette issues
* Missing legends
* Unexpected aggregation
* Incorrect confidence intervals
* Hue mapping problems
* Category ordering
* NaN handling
* Empty plots
* Figure sizing
* Layout clipping
* Axis formatting
* Overlapping labels
* Performance issues
* Large dataset slowdowns
* Pairplot memory usage
* FacetGrid synchronization
* Objects API confusion
* Mixed pyplot/Seaborn state
* Figure ownership
* Saving blank figures
* Backend issues
* Notebook rendering
* Interactive environment issues
* Export problems
* Deprecated parameter usage

Only include officially verifiable issues or well-established engineering problems.

---

# Compatibility

Document compatibility for the selected version only.

Include:

---

## Supported Python Versions

---

## Supported NumPy Versions

---

## Supported Pandas Versions

---

## Supported Matplotlib Versions

---

## Optional Dependencies

Include packages such as:

* SciPy
* statsmodels
* Jupyter

Only if officially documented.

---

## Operating Systems

Document support for:

* Linux
* Windows
* macOS

---

## Development Environments

Include:

* Jupyter Notebook
* JupyterLab
* VS Code
* PyCharm
* Spyder
* Google Colab

---

## Headless Environments

Discuss:

* CI
* servers
* Docker
* remote environments

---

## Backend Considerations

Explain that rendering behavior depends on Matplotlib backends.

Discuss only officially documented interactions.

---

# Migration Notes

Document migration information only for the selected version.

Do not document historical versions unless necessary.

Include:

---

## New Features

---

## Behavioral Changes

---

## Deprecated APIs

---

## Deprecated Parameters

---

## Removed APIs

---

## Replacement APIs

---

## Compatibility Concerns

---

## Recommended Migration Strategy

---

If something is not officially documented, explicitly state:

> **Not officially documented.**

---

# Comparison

Compare Seaborn against major visualization libraries.

Include:

* Matplotlib
* Plotly
* Bokeh
* Altair

For every comparison discuss:

* design philosophy
* abstraction level
* learning curve
* customization
* statistical capabilities
* interactivity
* publication-quality output
* production suitability
* performance
* scalability
* ecosystem integration
* strengths
* weaknesses
* ideal use cases

Present the comparison using concise tables wherever possible.

Avoid subjective rankings.

Avoid declaring a universally "best" library.

---

# Official Resource Index

Create a centralized index of official references.

Every URL must be official.

Group resources into logical categories.

---

## Documentation

* Documentation Home
* Stable Documentation
* API Reference
* User Guide
* Tutorials
* Examples Gallery

---

## Package Information

* PyPI
* GitHub Repository
* Source Code

---

## Development

* GitHub Issues
* GitHub Discussions
* Pull Requests (if officially maintained)

---

## Release Information

* Release Notes
* Changelog

---

## Related Official Resources

Include official documentation for major dependencies when directly relevant:

* Matplotlib
* NumPy
* Pandas

Do not include unofficial resources.

---

# Quality Rules

The completed document must satisfy all of the following requirements.

---

## Accuracy

* No hallucinated APIs
* No invented parameters
* No invented defaults
* No invented return values
* No fabricated URLs
* No fabricated compatibility information

---

## Version Consistency

* Single Seaborn version throughout
* No mixed-version APIs
* No legacy parameter names unless explicitly documented

---

## Engineering Quality

* Production-oriented
* Searchable
* Reusable
* Deterministic
* Information-dense
* JSON transformation friendly

---

## Documentation Quality

* No duplicate sections
* No repeated explanations
* No contradictory statements
* No unnecessary prose
* No tutorial-style writing
* No marketing language

---

## Examples

Every runnable example must:

* include imports
* be executable
* use officially supported APIs
* avoid undefined variables
* avoid pseudo-code

---

## Tasks

Every canonical task should include:

* mental trigger
* syntax
* runnable example
* use when
* avoid when
* important parameters
* gotchas
* official documentation link

---

## Metadata

Ensure sufficient information exists to populate the AENS Package schema, including:

### Package-Level Fields

* id
* title
* slug
* description
* name
* version
* summary
* install
* import_as
* sources
* created_at
* updated_at

### Canonical Task Fields

* task
* syntax
* example
* mental_trigger
* use_when
* avoid_when
* important_params
* gotchas
* official_docs

The Markdown should naturally map to these fields without requiring significant manual interpretation.

---

# Final Validation Checklist

Before returning the document, perform a complete validation pass.

Verify all of the following.

---

## Version Validation

* One selected version used consistently
* Release date verified
* Documentation version consistent
* No mixed-version APIs

---

## Metadata Validation

* All package metadata completed
* Official URLs verified
* Installation commands verified
* Import statements verified

---

## Architecture Validation

* Architecture accurately reflects Seaborn
* Plotting paradigms documented
* Semantic mapping documented
* Statistical workflow documented

---

## Module Validation

* Public modules covered
* Major classes documented
* Objects API included
* Grid APIs included

---

## Task Validation

* Canonical engineering tasks documented
* No duplicate tasks
* No parameter-only variations
* Tasks represent the majority of production usage

---

## API Validation

* Official signatures used
* Parameters verified
* Return values verified
* Official API URLs included

---

## Documentation Validation

* No duplicate sections
* No contradictory information
* No missing required sections
* No unofficial claims presented as facts

---

## Engineering Validation

* Production best practices included
* Debugging guide complete
* Compatibility documented
* Migration guidance included
* Comparison completed
* Official resource index completed

---

## AENS Validation

Confirm the document is suitable for transformation into an AENS Package resource.

Specifically verify that:

* every major knowledge unit is independently searchable
* headings are deterministic
* information is reusable
* content can be transformed into structured JSON with minimal preprocessing
* package metadata is complete
* canonical task information is complete
* official sources are properly identified

---

# Final Output Requirement

Return **one complete Markdown document** only.

Do **not** include:

* chain of thought
* internal reasoning
* planning notes
* validation logs
* research methodology
* explanations about the generation process

The final document should read as the canonical production reference for **Seaborn** inside the **AI Engineering Navigation System (AENS)**, optimized for long-term maintenance, structured knowledge extraction, semantic retrieval, and future JSON conversion.
