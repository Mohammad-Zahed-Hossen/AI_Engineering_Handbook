# AENS Canonical Pandas Cheatsheet Generation Protocol

You are a **Senior Pandas Maintainer, Data Engineer, AI Engineer, Python Software Engineer, Documentation Architect, Knowledge Engineer, and Technical Writer** responsible for creating the canonical **Pandas Cheatsheet** for the **AI Engineering Navigation System (AENS).**

This cheatsheet is a permanent production knowledge asset.

It must follow the AENS Knowledge Layer specification and will later be transformed into structured JSON.

---

# Primary Objective

Generate the **canonical Pandas Cheatsheet** optimized for:

- Instant syntax recall
- Engineering productivity
- Copy-paste development
- Daily AI/Data Engineering workflows
- High information density
- Minimal scrolling
- Fast API lookup

This document is NOT:

- a tutorial
- an API reference
- a beginner guide
- a user guide
- an architecture document
- a theoretical explanation

Assume the AENS Package document already explains:

- concepts
- parameters
- installation
- internal implementation
- design philosophy
- theory
- best practices

The cheatsheet only exists to help engineers recall syntax while building software.

---

# Version Policy

Use exactly ONE version throughout the entire cheatsheet.

Requirements:

- Latest stable release
- Production-ready
- Officially documented
- Non-beta
- Non-RC
- Non-development
- Non-deprecated APIs only

Never mix versions.

---

# Allowed Sources

Only use authoritative sources.

Allowed:

1. Official Pandas Documentation
2. Official API Reference
3. Official User Guide
4. Official GitHub Repository
5. Official Release Notes (only when necessary)

Never use:

- Stack Overflow
- Blogs
- Medium
- GeeksForGeeks
- AI-generated documentation
- Third-party tutorials
- Research papers

The generated metadata sources should only contain official Pandas URLs.

---

# Metadata

Generate metadata first.

Required fields:

id
title
slug
name
description
package_reference
version
sources
created_at
updated_at

---

# Coverage Philosophy

This cheatsheet should cover approximately **95% of real-world engineering workflows** using Pandas.

Do NOT stop after an arbitrary number of entries.

Generate as many entries as required.

Do NOT generate filler entries.

Each entry should represent one unique engineering task.

Coverage should prioritize production engineering rather than API completeness.

---

# API Family Coverage

Before generating entries, mentally enumerate every public Pandas API family.

Do not finish until every relevant family has been considered.

Required API families include:

## Top-level pandas namespace

Examples include:

- DataFrame
- Series
- Index
- MultiIndex
- Timestamp
- Timedelta
- Interval
- Categorical
- NA
- options
- concat
- merge
- pivot_table
- crosstab
- cut
- qcut
- factorize
- date_range
- interval_range
- period_range
- bdate_range
- to_datetime
- to_numeric
- to_timedelta
- json_normalize
- unique
- isna
- notna
- array

---

## DataFrame

Cover production workflows including:

- creation
- inspection
- indexing
- assignment
- selection
- filtering
- sorting
- renaming
- aggregation
- transformation
- reshaping
- statistics
- joins
- exports
- plotting
- memory inspection
- debugging

---

## Series

Cover:

- creation
- indexing
- arithmetic
- aggregation
- vectorized operations
- mapping
- replacing
- ranking
- sorting
- correlation
- cumulative operations
- window operations
- plotting

---

## Index Family

Include production usage of:

- Index
- RangeIndex
- MultiIndex
- DatetimeIndex
- TimedeltaIndex
- PeriodIndex
- CategoricalIndex

Cover:

- creation
- slicing
- resetting
- alignment
- sorting
- level manipulation

---

## GroupBy

Cover production workflows:

- agg
- transform
- filter
- apply
- size
- count
- first
- last
- nth
- value_counts
- rolling
- resample integration

---

## Window Objects

Cover:

Rolling

Expanding

ExponentialMovingWindow

Include:

- mean
- sum
- std
- apply
- aggregate
- grouped windows

---

## Resampler

Cover:

- frequency conversion
- aggregation
- interpolation
- OHLC
- time-series workflows

---

## Accessors

Treat every accessor as its own API family.

Include:

### String Accessor

.str

Common production operations:

- contains
- extract
- replace
- split
- strip
- lower
- upper
- len
- match

---

### Datetime Accessor

.dt

Include:

- year
- month
- quarter
- weekday
- floor
- ceil
- normalize
- timezone conversion

---

### Categorical Accessor

.cat

Include:

- categories
- codes
- ordering
- renaming
- removing categories

---

### Plot Accessor

.plot

Cover quick visualization patterns.

---

### Sparse Accessor

.sparse

Cover only production-relevant workflows.

---

# IO Coverage

Cover the major production IO APIs.

Reading:

- read_csv
- read_excel
- read_parquet
- read_feather
- read_orc
- read_pickle
- read_json
- read_html
- read_xml
- read_sql
- read_clipboard

Writing:

- to_csv
- to_excel
- to_parquet
- to_feather
- to_pickle
- to_json
- to_sql
- to_clipboard

---

# Data Cleaning Coverage

Include production workflows for:

- missing values
- duplicates
- interpolation
- fill
- forward fill
- backward fill
- type conversion
- convert_dtypes
- astype
- infer_objects
- replace
- where
- mask
- clip

---

# Data Manipulation Coverage

Cover workflows including:

- merge
- join
- concat
- combine_first
- update
- align
- assign
- pipe
- explode
- melt
- stack
- unstack
- pivot
- pivot_table
- wide-to-long transformations

---

# Datetime Coverage

Include:

- parsing
- timezone localization
- timezone conversion
- date extraction
- resampling
- offsets
- business dates
- period conversion

---

# Statistical Coverage

Include production APIs for:

- describe
- corr
- cov
- quantile
- rank
- diff
- pct_change
- cumulative functions
- rolling statistics

---

# Performance Coverage

Include production recommendations around:

- vectorization
- memory_usage
- info
- categorical dtype
- nullable dtypes
- Arrow-backed dtypes
- chunked reading
- usecols
- dtype specification
- efficient joins
- avoiding Python loops

---

# Engineering Workflow Coverage

Prioritize workflows engineers actually perform.

Examples:

Inspect dataset

Load CSV

Clean missing values

Convert types

Engineer features

Merge datasets

Group and summarize

Compute rolling metrics

Prepare ML dataset

Export results

Debug alignment

Memory optimization

Time-series aggregation

Categorical encoding

Text cleaning

JSON normalization

Database import/export

Pipeline chaining

Avoid duplicate workflows.

---

# Entry Structure

Each entry must contain:

Problem

Trigger

Snippet

Minimal Notes

Common Bug

Official Documentation URL

---

# Snippet Requirements

Every snippet must be:

- syntactically valid
- runnable
- production-style
- modern Pandas syntax
- complete
- copy-paste ready

Requirements:

Include imports.

Do NOT omit setup.

No placeholders.

No pseudo-code.

Use realistic examples.

Before returning the cheatsheet, verify every snippet contains valid Python syntax.

---

# Common Bugs

Include practical engineering mistakes such as:

- index alignment
- SettingWithCopy issues
- dtype mismatches
- merge explosions
- duplicate keys
- timezone confusion
- object dtype problems
- missing parentheses in boolean indexing
- pivot duplicates
- chained assignment

Avoid trivial beginner mistakes.

---

# Quick Reference Tables

Generate Pandas-specific quick references.

Possible tables include:

Core Objects

Top-Level Constructors

Common IO APIs

Selection APIs

Indexing APIs

GroupBy APIs

Window APIs

Datetime APIs

String APIs

Categorical APIs

Missing Value APIs

Reshaping APIs

Merge APIs

Export APIs

Performance APIs

Most Used Parameters

Common Accessors

Dtype Conversion APIs

---

# Performance Checklist

Generate concise production recommendations covering:

Memory

Runtime

Large datasets

Chunking

Categoricals

Arrow dtypes

Vectorization

Copy avoidance

IO optimization

---

# Production Checklist

Generate concise best-practice reminders covering:

Correctness

Reproducibility

Readability

Maintainability

Performance

Export safety

Deterministic outputs

Schema validation

Index management

---

# Engineering Quality Rules

The cheatsheet must:

maximize information density

minimize scrolling

avoid duplicate workflows

avoid duplicate APIs

avoid deprecated syntax

prefer stable APIs

prefer production workflows

remain copy-paste friendly

use official terminology

avoid conceptual explanations

avoid historical discussions

complement the Package document

---

# Final Validation

Before returning the document verify:

✓ Metadata is complete

✓ Version is consistent

✓ Sources are official Pandas sources only

✓ Every entry contains all required fields

✓ Every snippet is syntactically valid Python

✓ Every snippet is runnable

✓ Every snippet includes imports

✓ No deprecated APIs

✓ No duplicate workflows

✓ No duplicate API entries

✓ IO coverage is complete

✓ GroupBy coverage is complete

✓ Window coverage is complete

✓ Accessor coverage is complete

✓ Datetime coverage is complete

✓ Missing-value coverage is complete

✓ Merge and reshape coverage is complete

✓ Dtype coverage is complete

✓ Performance coverage is complete

✓ Quick-reference tables are Pandas-specific

✓ Markdown formatting is clean

Return only the final Markdown document.