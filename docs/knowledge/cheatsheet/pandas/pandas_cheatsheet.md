---
id: pandas
title: Pandas Cheatsheet
slug: pandas-cheatsheet
name: Pandas Cheatsheet
description: High-density Pandas syntax recall for daily data analysis tasks in pandas 3.0.4.
package_reference: pandas
version: 3.0.4
sources:

- https://pandas.pydata.org/docs/
- https://pandas.pydata.org/docs/reference/index.html
- https://pandas.pydata.org/docs/reference/frame.html
- https://pandas.pydata.org/docs/reference/io.html
created_at: 2026-07-06
updated_at: 2026-07-06
***

## Entries

### 1. Import Pandas

- **Problem:** Import the library with the standard alias.
- **Trigger:** When starting any Pandas script or notebook.
- **Snippet:**

```python
import pandas as pd
```

- **Minimal Notes:** `pd` is the standard alias used across examples and docs.
- **Common Bug:** Using a different alias and then copy-pasting code that assumes `pd`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/


### 2. Create a DataFrame from a dict

- **Problem:** Build a tabular object from in-memory data.
- **Trigger:** When converting Python dictionaries into analysis-ready tables.
- **Snippet:**

```python
import pandas as pd

data = {"name": ["A", "B"], "score": [90, 85]}
df = pd.DataFrame(data)
print(df)
```

- **Minimal Notes:** Dict keys become columns. Values must align in length.
- **Common Bug:** Column arrays with different lengths.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 3. Create a Series

- **Problem:** Build a one-dimensional labeled array.
- **Trigger:** When working with a single column, vector, or metric.
- **Snippet:**

```python
import pandas as pd

s = pd.Series([10, 20, 30], name="value")
print(s)
```

- **Minimal Notes:** A Series is the base object for many column-wise operations.
- **Common Bug:** Forgetting that a Series keeps an index.
- **Official Documentation URL:** https://pandas.pydata.org/docs/


### 4. Read CSV

- **Problem:** Load tabular data from a CSV file.
- **Trigger:** When ingesting exported data or common flat files.
- **Snippet:**

```python
import pandas as pd

df = pd.read_csv("data.csv")
print(df.head())
```

- **Minimal Notes:** `read_csv` is the default entry point for most datasets.
- **Common Bug:** Wrong delimiter or encoding.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/io.html


### 5. Read Excel

- **Problem:** Load spreadsheet data.
- **Trigger:** When data comes from `.xlsx` or `.xls` files.
- **Snippet:**

```python
import pandas as pd

df = pd.read_excel("data.xlsx", sheet_name=0)
print(df.head())
```

- **Minimal Notes:** Sheet selection matters when workbooks contain multiple tabs.
- **Common Bug:** Picking the wrong sheet name or index.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/io.html


### 6. Inspect shape and columns

- **Problem:** Check table dimensions and schema quickly.
- **Trigger:** When validating an input dataset before transformation.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.shape)
print(df.columns)
print(df.dtypes)
```

- **Minimal Notes:** Use this before joins, pivots, and exports.
- **Common Bug:** Assuming column names or dtypes without checking.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 7. Preview rows

- **Problem:** Inspect the first or last records.
- **Trigger:** When sanity-checking loaded data.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": range(5)})
print(df.head(3))
print(df.tail(2))
```

- **Minimal Notes:** Previewing rows is faster than printing the whole frame.
- **Common Bug:** Looking at only the top rows and missing later corruption.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 8. Select columns

- **Problem:** Extract one or more columns.
- **Trigger:** When narrowing a table to relevant fields.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
print(df["score"])
print(df[["name", "score"]])
```

- **Minimal Notes:** Single brackets return a Series; double brackets return a DataFrame.
- **Common Bug:** Using the wrong bracket form and getting the wrong object type.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 9. Select rows by label

- **Problem:** Filter by index label.
- **Trigger:** When your index has meaningful labels.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 85]}, index=["a", "b"])
print(df.loc["a"])
print(df.loc[["a", "b"]])
```

- **Minimal Notes:** `.loc` is label-based and includes the endpoint for slices.
- **Common Bug:** Mixing label-based and position-based indexing.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 10. Select rows by position

- **Problem:** Filter by integer position.
- **Trigger:** When the row order matters more than labels.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 85, 88]})
print(df.iloc[^0])
print(df.iloc[:2])
```

- **Minimal Notes:** `.iloc` is position-based and follows Python slicing rules.
- **Common Bug:** Treating `.iloc` like `.loc`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 11. Filter rows with a condition

- **Problem:** Keep rows that match a boolean rule.
- **Trigger:** When selecting records by threshold or category.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B", "C"], "score": [90, 70, 88]})
filtered = df[df["score"] >= 85]
print(filtered)
```

- **Minimal Notes:** Boolean masks are the standard filtering pattern.
- **Common Bug:** Missing parentheses around combined conditions.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 12. Use query syntax

- **Problem:** Filter using a string expression.
- **Trigger:** When a compact expression reads better than chained masks.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B", "C"], "score": [90, 70, 88]})
result = df.query("score >= 85")
print(result)
```

- **Minimal Notes:** `query` is useful for readable filters on multiple conditions.
- **Common Bug:** Quoting column names incorrectly or relying on local variables without `@`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 13. Sort values

- **Problem:** Order rows by one or more columns.
- **Trigger:** When ranking, reviewing, or preparing top-N results.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B", "C"], "score": [90, 70, 88]})
print(df.sort_values("score", ascending=False))
```

- **Minimal Notes:** Sorting is stable enough for most analysis workflows, but tie behavior still matters.
- **Common Bug:** Sorting the wrong column or forgetting `ascending=False`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 14. Rename columns

- **Problem:** Standardize or clean column names.
- **Trigger:** When aligning a dataset to a target schema.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"old_name": [1, 2]})
df = df.rename(columns={"old_name": "new_name"})
print(df)
```

- **Minimal Notes:** `rename` is safer than mutating column labels manually.
- **Common Bug:** Forgetting to assign the result back when `inplace=False`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 15. Add or replace a column

- **Problem:** Create a derived field.
- **Trigger:** When engineering features or cleaning values.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 70, 88]})
df["passed"] = df["score"] >= 80
print(df)
```

- **Minimal Notes:** Column assignment is the most common transformation pattern.
- **Common Bug:** Assigning a misaligned Series and getting unexpected NaNs.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 16. Apply a function to a column

- **Problem:** Transform values in a Series.
- **Trigger:** When the operation is row-independent and vectorized methods are unavailable.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["alice", "bob"]})
df["name"] = df["name"].apply(str.upper)
print(df)
```

- **Minimal Notes:** Prefer vectorized string or numeric methods when available.
- **Common Bug:** Using `apply` for work that has a faster built-in vectorized method.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 17. Replace values

- **Problem:** Map or normalize existing values.
- **Trigger:** When cleaning labels or standardizing categories.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"grade": ["A+", "A", "B+"]})
df["grade"] = df["grade"].replace({"A+": "A", "B+": "B"})
print(df)
```

- **Minimal Notes:** `replace` handles simple value-to-value mappings cleanly.
- **Common Bug:** Expecting substring replacement instead of exact value replacement.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 18. Handle missing values

- **Problem:** Detect, remove, or fill NA values.
- **Trigger:** When data has gaps, nulls, or incomplete records.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, None, 3], "b": [None, 5, 6]})
print(df.isna())
print(df.dropna())
print(df.fillna(0))
```

- **Minimal Notes:** Use `isna`, `dropna`, and `fillna` as the core missing-data trio.
- **Common Bug:** Filling numeric columns with strings and changing dtypes unexpectedly.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 19. Group by and aggregate

- **Problem:** Summarize data by category.
- **Trigger:** When computing totals, counts, or means per group.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 20, 30]})
result = df.groupby("team", as_index=False).agg(avg_score=("score", "mean"))
print(result)
```

- **Minimal Notes:** Named aggregations keep results readable and stable.
- **Common Bug:** Forgetting `as_index=False` and getting grouped keys in the index.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 20. Count values

- **Problem:** Measure category frequency.
- **Trigger:** When checking class balance or label distribution.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(["A", "B", "A", "C", "A"])
print(s.value_counts())
```

- **Minimal Notes:** `value_counts` is a fast first pass for categorical data.
- **Common Bug:** Ignoring missing values when they matter analytically.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 21. Compute descriptive statistics

- **Problem:** Get summary statistics for numeric columns.
- **Trigger:** When profiling a dataset or checking data quality.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 70, 88], "age": [20, 21, 22]})
print(df.describe())
```

- **Minimal Notes:** `describe` is the fastest way to get a numeric summary.
- **Common Bug:** Expecting non-numeric columns to be summarized the same way by default.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 22. Compute correlations

- **Problem:** Measure linear relationships between numeric columns.
- **Trigger:** When checking feature correlation or redundancy.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"x": [1, 2, 3], "y": [2, 4, 6], "z": [3, 1, 2]})
print(df.corr(numeric_only=True))
```

- **Minimal Notes:** Correlation only makes sense for numeric fields.
- **Common Bug:** Including non-numeric columns and getting errors or ignored data.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 23. Drop duplicates

- **Problem:** Remove repeated rows.
- **Trigger:** When records were appended multiple times or deduplication is required.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "A", "B"], "score": [1, 1, 2]})
print(df.drop_duplicates())
```

- **Minimal Notes:** Use `subset` when duplicate identity is defined by only some columns.
- **Common Bug:** Assuming rows are duplicates when only one field matches.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 24. Merge two tables

- **Problem:** Join related datasets by key.
- **Trigger:** When combining fact and lookup tables.
- **Snippet:**

```python
import pandas as pd

left = pd.DataFrame({"id": [1, 2], "name": ["A", "B"]})
right = pd.DataFrame({"id": [1, 2], "score": [90, 85]})
merged = left.merge(right, on="id", how="inner")
print(merged)
```

- **Minimal Notes:** `merge` is the standard database-style join API.
- **Common Bug:** Joining on keys with different dtypes.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 25. Concatenate tables

- **Problem:** Stack or combine objects along an axis.
- **Trigger:** When appending partitions or combining similar frames.
- **Snippet:**

```python
import pandas as pd

a = pd.DataFrame({"id": [1, 2]})
b = pd.DataFrame({"id": [3, 4]})
result = pd.concat([a, b], ignore_index=True)
print(result)
```

- **Minimal Notes:** `concat` is useful for both row-wise and column-wise assembly.
- **Common Bug:** Forgetting `ignore_index=True` when stacking rows.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 26. Pivot data

- **Problem:** Reshape long data into a wide matrix.
- **Trigger:** When turning keyed records into a cross-tab style table.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"date": ["2026-01-01", "2026-01-01", "2026-01-02"], "metric": ["a", "b", "a"], "value": [1, 2, 3]}
)
result = df.pivot(index="date", columns="metric", values="value")
print(result)
```

- **Minimal Notes:** `pivot` requires unique index/column combinations.
- **Common Bug:** Duplicate combinations causing a reshape failure.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 27. Pivot table with aggregation

- **Problem:** Reshape and aggregate duplicated combinations.
- **Trigger:** When `pivot` fails because repeated keys exist.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"date": ["2026-01-01", "2026-01-01", "2026-01-02"], "metric": ["a", "a", "a"], "value": [1, 2, 3]}
)
result = df.pivot_table(index="date", columns="metric", values="value", aggfunc="sum")
print(result)
```

- **Minimal Notes:** `pivot_table` is the safer reshape choice for repeated keys.
- **Common Bug:** Using `pivot` where aggregation is required.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 28. Melt wide data to long format

- **Problem:** Unpivot a table into tidy form.
- **Trigger:** When transforming feature columns into row records.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "x": [10, 20], "y": [30, 40]})
result = df.melt(id_vars="id", var_name="metric", value_name="value")
print(result)
```

- **Minimal Notes:** `melt` is the standard inverse of wide-format feature tables.
- **Common Bug:** Forgetting to preserve identifier columns with `id_vars`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 29. Resample time series

- **Problem:** Aggregate data on a new time frequency.
- **Trigger:** When moving from daily to weekly, hourly to daily, or similar intervals.
- **Snippet:**

```python
import pandas as pd

idx = pd.date_range("2026-01-01", periods=5, freq="D")
df = pd.DataFrame({"value": [1, 2, 3, 4, 5]}, index=idx)
print(df.resample("2D").sum())
```

- **Minimal Notes:** Resampling requires a datetime-like index or column setup.
- **Common Bug:** Trying to resample before converting the index to datetime.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 30. Export to CSV

- **Problem:** Save a DataFrame to a CSV file.
- **Trigger:** When sharing data with tools that expect flat files.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_csv("output.csv", index=False)
```

- **Minimal Notes:** `index=False` is often the right default for export files.
- **Common Bug:** Accidentally exporting the index as an extra column.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 31. Export to Excel

- **Problem:** Write tabular output to a spreadsheet.
- **Trigger:** When delivering results to Excel-based workflows.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_excel("output.xlsx", index=False)
```

- **Minimal Notes:** Use Excel export when downstream users work in spreadsheets.
- **Common Bug:** Missing optional Excel writer dependencies in the environment.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 32. Export to Parquet

- **Problem:** Save efficient columnar data.
- **Trigger:** When storing larger tables for fast reloads.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_parquet("output.parquet", index=False)
```

- **Minimal Notes:** Parquet is usually better than CSV for analytics pipelines.
- **Common Bug:** Assuming a Parquet engine is available without checking dependencies.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 33. Read Parquet

- **Problem:** Load a columnar dataset.
- **Trigger:** When ingesting analytics or data-pipeline outputs.
- **Snippet:**

```python
import pandas as pd

df = pd.read_parquet("output.parquet")
print(df.head())
```

- **Minimal Notes:** Parquet preserves dtypes better than CSV in many workflows.
- **Common Bug:** Mixing engines or versions that interpret nested types differently.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/io.html


### 34. Convert dtypes

- **Problem:** Infer better column types.
- **Trigger:** When object columns should become numeric, string, or nullable types.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": ["1", "2"], "b": [1, None]})
print(df.convert_dtypes())
```

- **Minimal Notes:** This is useful after parsing messy input.
- **Common Bug:** Leaving numeric-looking text as object dtype.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 35. Set and reset index

- **Problem:** Change the row index structure.
- **Trigger:** When promoting columns to an index or flattening a hierarchical index.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "name": ["A", "B"]})
indexed = df.set_index("id")
print(indexed)
print(indexed.reset_index())
```

- **Minimal Notes:** Index changes affect later joins, slicing, and grouping.
- **Common Bug:** Losing a key column during index manipulation.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 36. Transpose a DataFrame

- **Problem:** Swap rows and columns.
- **Trigger:** When orientation needs to be flipped for inspection or downstream tools.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.T)
```

- **Minimal Notes:** Transpose changes the interpretation of labels and dtypes.
- **Common Bug:** Expecting the result to preserve original column types cleanly.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


## Quick reference

### Common APIs

| Task | Primary API | Notes |
| :-- | :-- | :-- |
| Create table | `pd.DataFrame(...)` | Most common constructor. |
| Create vector | `pd.Series(...)` | One-dimensional labeled data. |
| Read CSV | `pd.read_csv(...)` | Default flat-file loader. |
| Join tables | `DataFrame.merge(...)` | Database-style merge. |
| Group and aggregate | `DataFrame.groupby(...).agg(...)` | Use named aggregations for clarity. |
| Missing values | `isna`, `dropna`, `fillna` | Core cleaning trio. |
| Reshape | `pivot`, `pivot_table`, `melt` | Most common reshape tools. |
| Time series | `resample(...)` | Needs datetime-like index. |
| Export | `to_csv`, `to_excel`, `to_parquet` | Pick format by downstream needs. |

### Core objects

| Object | Role |
| :-- | :-- |
| `DataFrame` | Two-dimensional table. |
| `Series` | One-dimensional labeled data. |
| `Index` | Row or column labels. |

### Common errors

| Error | Cause | Solution |
| :-- | :-- | :-- |
| Shape mismatch | Arrays or Series have incompatible lengths. | Align lengths before construction or assignment. |
| KeyError | Label does not exist. | Check `columns`, `index`, or spelling. |
| ValueError: columns overlap | Duplicate column names in join/concat. | Rename or use suffixes. |
| Duplicate entries during pivot | Repeated index/column combinations. | Use `pivot_table` with an aggregation function. |
| Unexpected NaNs after assignment | Index alignment mismatch. | Reindex or assign arrays with matching order. |

### Performance checklist

- Use vectorized operations instead of Python loops.
- Prefer `merge` and `concat` over manual row-wise assembly.
- Use `category` for repeated low-cardinality text.
- Prefer Parquet over CSV for large datasets.
- Avoid repeated `.append`-style patterns; build lists and concatenate once.
- Drop unused columns early to reduce memory pressure.
- Use `read_csv` options to parse only needed columns when possible.
- Consider chunked processing for very large inputs.


### Production checklist

- Verify dtypes before joins, groupbys, and exports.
- Normalize missing-value handling early.
- Keep index strategy intentional and consistent.
- Use explicit sort order when results must be deterministic.
- Write reproducible exports with `index=False` when appropriate.
- Validate merged row counts after joins.
- Prefer stable, documented APIs only.
- Test file paths, encodings, and delimiters in the target environment.
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: CURRENT_PROJECT_STATE_REPORT.md

[^3]: CONTENT_QUALITY_STANDARD.md

[^4]: ARCHITECTURE_FREEZE.md

[^5]: AENS-Knowledge-Layer-Specification.md

[^6]: https://www.qeios.com/read/GFSQFL/pdf

[^7]: https://zenodo.org/record/3961230/files/pandera.pdf

[^8]: http://arxiv.org/pdf/2501.08207.pdf

[^9]: https://arxiv.org/pdf/2312.11122.pdf

[^10]: https://academic.oup.com/bioinformatics/article-pdf/32/21/3363/7889719/btw422.pdf

[^11]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5079480/

[^12]: https://arxiv.org/pdf/2210.03519.pdf

[^13]: https://pandas.pydata.org/docs/

[^14]: https://pandas.pydata.org/docs/reference/index.html

[^15]: https://pandas.pydata.org/docs/user_guide/index.html

[^16]: https://pandas.pydata.org/docs/dev/whatsnew/v3.0.4.html

[^17]: https://pandas.pydata.org/docs/reference/io.html

[^18]: https://pandas.pydata.org/docs/whatsnew/index.html

[^19]: https://pandas.pydata.org/docs/whatsnew/v3.0.3.html

[^20]: https://pandas.pydata.org/docs/reference/frame.html

[^21]: https://pandas.pydata.org/pandas-docs/version/1.0.1/reference/api/pandas.DataFrame.index.html

[^22]: https://pandas.pydata.org/docs/reference/api/pandas.Series.describe.html

