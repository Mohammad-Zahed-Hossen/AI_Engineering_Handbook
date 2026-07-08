---
id: pandas
title: Pandas Cheatsheet
name: Pandas Cheatsheet
slug: pandas-cheatsheet
description: High-density Pandas syntax recall for production data analysis workflows in pandas 3.0.4.
package_reference: pandas
version: 3.0.4
sources:

- https://pandas.pydata.org/docs/
- https://pandas.pydata.org/docs/reference/index.html
- https://pandas.pydata.org/docs/reference/frame.html
- https://pandas.pydata.org/docs/reference/series.html
- https://pandas.pydata.org/docs/reference/groupby.html
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


### 2. Inspect package objects

- **Problem:** Check the core public API surface.
- **Trigger:** When you need to confirm whether a function or class is part of the public namespace.
- **Snippet:**

```python
import pandas as pd

print(pd.DataFrame)
print(pd.Series)
print(pd.Index)
```

- **Minimal Notes:** The public `pandas.*` namespace is the supported API surface.
- **Common Bug:** Reaching into internal modules instead of using public objects.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/index.html


### 3. Create a DataFrame from a dict

- **Problem:** Build a table from in-memory Python data.
- **Trigger:** When converting dictionaries or JSON-like records into analysis-ready tables.
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


### 4. Create a Series

- **Problem:** Build a one-dimensional labeled array.
- **Trigger:** When working with a single field, metric, or vector.
- **Snippet:**

```python
import pandas as pd

s = pd.Series([10, 20, 30], name="value")
print(s)
```

- **Minimal Notes:** Series keeps an index and supports vectorized methods.
- **Common Bug:** Forgetting that a Series preserves labels and alignment.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 5. Create an Index

- **Problem:** Build an explicit label index.
- **Trigger:** When you need stable labels for rows or keys.
- **Snippet:**

```python
import pandas as pd

idx = pd.Index(["a", "b", "c"], name="key")
print(idx)
```

- **Minimal Notes:** Index objects are the label backbone for Series and DataFrame.
- **Common Bug:** Using mutable Python lists where immutable labels are needed.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/index.html


### 6. Read CSV

- **Problem:** Load tabular data from a CSV file.
- **Trigger:** When ingesting the most common flat-file format.
- **Snippet:**

```python
import pandas as pd

df = pd.read_csv("data.csv")
print(df.head())
```

- **Minimal Notes:** Use this as the default entry point for external tabular data.
- **Common Bug:** Wrong delimiter, header row, or encoding.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/io.html


### 7. Read Excel

- **Problem:** Load spreadsheet data.
- **Trigger:** When input comes from `.xlsx` workbooks.
- **Snippet:**

```python
import pandas as pd

df = pd.read_excel("data.xlsx", sheet_name=0)
print(df.head())
```

- **Minimal Notes:** Sheet selection matters when workbooks contain multiple tabs.
- **Common Bug:** Picking the wrong sheet name or index.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/io.html


### 8. Read Parquet

- **Problem:** Load columnar analytics data.
- **Trigger:** When working with data pipeline outputs or large files.
- **Snippet:**

```python
import pandas as pd

df = pd.read_parquet("data.parquet")
print(df.head())
```

- **Minimal Notes:** Parquet usually preserves dtypes better than CSV.
- **Common Bug:** Missing a working Parquet engine in the environment.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/io.html


### 9. Inspect shape and dtypes

- **Problem:** Check table dimensions and schema quickly.
- **Trigger:** When validating input before joins, pivots, or exports.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.shape)
print(df.columns)
print(df.dtypes)
```

- **Minimal Notes:** Use this before any nontrivial transformation.
- **Common Bug:** Assuming column names or dtypes without verifying them.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 10. Preview rows

- **Problem:** Inspect the first or last records.
- **Trigger:** When sanity-checking loaded data.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": range(5)})
print(df.head(3))
print(df.tail(2))
```

- **Minimal Notes:** Row previews are faster than printing full tables.
- **Common Bug:** Inspecting only the top rows and missing issues later in the file.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 11. Select columns

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


### 12. Select by label

- **Problem:** Access rows and columns by label.
- **Trigger:** When your index or columns are meaningful identifiers.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 85]}, index=["a", "b"])
print(df.loc["a"])
print(df.loc[["a", "b"]])
```

- **Minimal Notes:** `.loc` is label-based and supports label slicing.
- **Common Bug:** Mixing label-based `.loc` with position-based `.iloc`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 13. Select by position

- **Problem:** Access rows and columns by integer position.
- **Trigger:** When the physical order matters more than labels.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 85, 88]})
print(df.iloc[^0])
print(df.iloc[:2])
```

- **Minimal Notes:** `.iloc` follows Python slicing rules.
- **Common Bug:** Treating `.iloc` like `.loc`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 14. Fast scalar access

- **Problem:** Read or set one scalar value quickly.
- **Trigger:** When working with a single known row/column label or integer position.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 85]}, index=["a", "b"])
print(df.at["a", "score"])
print(df.iat[1, 0])
```

- **Minimal Notes:** Use `.at` for labels and `.iat` for integer positions.
- **Common Bug:** Using `.loc` or `.iloc` for repeated scalar access.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 15. Filter rows with a condition

- **Problem:** Keep rows that satisfy a boolean rule.
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


### 16. Use query syntax

- **Problem:** Filter with an expression string.
- **Trigger:** When a compact filter reads better than chained boolean masks.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B", "C"], "score": [90, 70, 88]})
result = df.query("score >= 85")
print(result)
```

- **Minimal Notes:** `query` is useful for readable multi-condition filters.
- **Common Bug:** Forgetting `@` for local Python variables in expressions.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 17. Sort values

- **Problem:** Order rows by one or more columns.
- **Trigger:** When ranking, reviewing, or preparing top-N results.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B", "C"], "score": [90, 70, 88]})
print(df.sort_values("score", ascending=False))
```

- **Minimal Notes:** Sorting is a common step before export or reporting.
- **Common Bug:** Sorting the wrong column or forgetting descending order.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 18. Rename columns

- **Problem:** Standardize or clean column names.
- **Trigger:** When aligning a dataset to a target schema.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"old_name": [1, 2]})
df = df.rename(columns={"old_name": "new_name"})
print(df)
```

- **Minimal Notes:** `rename` is safer than manual label mutation.
- **Common Bug:** Forgetting to assign the result when not using `inplace=True`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 19. Add or replace a column

- **Problem:** Create a derived field.
- **Trigger:** When engineering features or cleaning values.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 70, 88]})
df["passed"] = df["score"] >= 80
print(df)
```

- **Minimal Notes:** Column assignment is one of the most common Pandas operations.
- **Common Bug:** Assigning a misaligned Series and getting unexpected NaNs.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 20. Assign multiple derived columns

- **Problem:** Add several columns in one chain.
- **Trigger:** When building features without breaking the pipeline.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 70, 88]})
df = df.assign(passed=df["score"] >= 80, doubled=df["score"] * 2)
print(df)
```

- **Minimal Notes:** `assign` helps keep transformation chains readable.
- **Common Bug:** Expecting `assign` to modify the original object in place.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 21. Drop columns or rows

- **Problem:** Remove unwanted labels or records.
- **Trigger:** When cleaning schema or excluding invalid rows.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.drop(columns=["b"]))
print(df.drop(index=[^0]))
```

- **Minimal Notes:** Use explicit `columns=` or `index=` for clarity.
- **Common Bug:** Dropping the wrong axis.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 22. Replace values

- **Problem:** Map or normalize existing values.
- **Trigger:** When standardizing labels or fixing known codes.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"grade": ["A+", "A", "B+"]})
df["grade"] = df["grade"].replace({"A+": "A", "B+": "B"})
print(df)
```

- **Minimal Notes:** `replace` handles simple exact mappings cleanly.
- **Common Bug:** Expecting substring replacement instead of exact-value replacement.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 23. Handle missing values

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

- **Minimal Notes:** `isna`, `dropna`, and `fillna` are the core missing-data tools.
- **Common Bug:** Filling numeric columns with strings and changing dtypes unexpectedly.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 24. Convert dtypes

- **Problem:** Infer or normalize better column types.
- **Trigger:** After parsing messy input or object-heavy tables.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": ["1", "2"], "b": [1, None]})
print(df.convert_dtypes())
```

- **Minimal Notes:** This is useful after ingestion when object columns need cleanup.
- **Common Bug:** Leaving numeric-looking text as object dtype.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 25. Merge two tables

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
- **Common Bug:** Joining keys with different dtypes.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 26. Concatenate tables

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


### 27. Join on index

- **Problem:** Combine aligned tables using index labels.
- **Trigger:** When lookup data is already indexed by the join key.
- **Snippet:**

```python
import pandas as pd

left = pd.DataFrame({"name": ["A", "B"]}, index=[1, 2])
right = pd.DataFrame({"score": [90, 85]}, index=[1, 2])
result = left.join(right, how="inner")
print(result)
```

- **Minimal Notes:** `join` is convenient for index-based alignment.
- **Common Bug:** Expecting `join` to use a column key by default.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 28. Group by and aggregate

- **Problem:** Summarize data by category.
- **Trigger:** When computing totals, counts, or means per group.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 20, 30]})
result = df.groupby("team", as_index=False).agg(avg_score=("score", "mean"))
print(result)
```

- **Minimal Notes:** Named aggregations keep grouped output readable.
- **Common Bug:** Forgetting `as_index=False` and getting grouped keys in the index.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/groupby.html


### 29. Group by and transform

- **Problem:** Add group-level statistics back to each row.
- **Trigger:** When normalizing or comparing records within groups.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 20, 30]})
df["team_mean"] = df.groupby("team")["score"].transform("mean")
print(df)
```

- **Minimal Notes:** `transform` preserves row count.
- **Common Bug:** Using `agg` when row-level alignment is required.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/groupby.html


### 30. Group by and filter

- **Problem:** Keep or drop whole groups by a rule.
- **Trigger:** When removing sparse or low-quality groups.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 20, 30]})
result = df.groupby("team").filter(lambda g: len(g) >= 2)
print(result)
```

- **Minimal Notes:** `filter` applies a criterion to each group.
- **Common Bug:** Expecting `filter` to work row-by-row.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/groupby.html


### 31. Count values

- **Problem:** Measure category frequency.
- **Trigger:** When checking label distribution or class balance.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(["A", "B", "A", "C", "A"])
print(s.value_counts())
```

- **Minimal Notes:** This is a fast first pass for categorical data.
- **Common Bug:** Ignoring missing values when they matter analytically.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 32. Compute descriptive statistics

- **Problem:** Get summary statistics for numeric columns.
- **Trigger:** When profiling a dataset or checking data quality.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 70, 88], "age": [20, 21, 22]})
print(df.describe())
```

- **Minimal Notes:** `describe` gives a quick numeric overview.
- **Common Bug:** Expecting non-numeric columns to summarize the same way by default.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 33. Compute correlations

- **Problem:** Measure linear relationships between numeric columns.
- **Trigger:** When checking feature correlation or redundancy.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"x": [1, 2, 3], "y": [2, 4, 6], "z": [3, 1, 2]})
print(df.corr(numeric_only=True))
```

- **Minimal Notes:** Correlation is only meaningful for numeric data.
- **Common Bug:** Including non-numeric columns and getting errors or ignored values.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 34. Drop duplicates

- **Problem:** Remove repeated rows.
- **Trigger:** When records were appended multiple times or deduplication is required.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "A", "B"], "score": [1, 1, 2]})
print(df.drop_duplicates())
```

- **Minimal Notes:** Use `subset` when identity depends on specific columns.
- **Common Bug:** Assuming rows are duplicates when only one field matches.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 35. Sort index

- **Problem:** Order rows or columns by index labels.
- **Trigger:** When normalizing index order after joins or reshaping.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [90, 85]}, index=["b", "a"])
print(df.sort_index())
```

- **Minimal Notes:** Sorting the index is useful after concat or join operations.
- **Common Bug:** Sorting values when you meant to sort labels.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 36. Set and reset index

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

- **Minimal Notes:** Index changes affect joins, slicing, and grouping.
- **Common Bug:** Losing a key column during index manipulation.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 37. Pivot data

- **Problem:** Reshape long data into a wide matrix.
- **Trigger:** When turning keyed records into a matrix-style table.
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


### 38. Pivot table with aggregation

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


### 39. Melt wide data to long format

- **Problem:** Unpivot a table into tidy form.
- **Trigger:** When transforming feature columns into row records.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "x": [10, 20], "y": [30, 40]})
result = df.melt(id_vars="id", var_name="metric", value_name="value")
print(result)
```

- **Minimal Notes:** `melt` is the standard inverse of wide-format tables.
- **Common Bug:** Forgetting to preserve identifier columns with `id_vars`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 40. Stack and unstack

- **Problem:** Move between wide and hierarchical representations.
- **Trigger:** When working with MultiIndex reshaping workflows.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]}, index=["x", "y"])
stacked = df.stack()
print(stacked)
print(stacked.unstack())
```

- **Minimal Notes:** `stack` and `unstack` are common with MultiIndex data.
- **Common Bug:** Expecting `unstack` to work without a suitable index level.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 41. Resample time series

- **Problem:** Aggregate data on a new time frequency.
- **Trigger:** When moving from daily to weekly or hourly to daily data.
- **Snippet:**

```python
import pandas as pd

idx = pd.date_range("2026-01-01", periods=5, freq="D")
df = pd.DataFrame({"value": [1, 2, 3, 4, 5]}, index=idx)
print(df.resample("2D").sum())
```

- **Minimal Notes:** Resampling requires a datetime-like index or column setup.
- **Common Bug:** Trying to resample before converting the index to datetime.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/groupby.html


### 42. Rolling window

- **Problem:** Compute moving statistics.
- **Trigger:** When smoothing metrics or calculating sliding aggregates.
- **Snippet:**

```python
import pandas as pd

s = pd.Series([1, 2, 3, 4, 5])
print(s.rolling(3).mean())
```

- **Minimal Notes:** Rolling windows preserve order and are common in time series.
- **Common Bug:** Forgetting the initial NaNs caused by window size.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 43. Expanding window

- **Problem:** Compute cumulative statistics over time.
- **Trigger:** When each step should include all prior observations.
- **Snippet:**

```python
import pandas as pd

s = pd.Series([1, 2, 3, 4, 5])
print(s.expanding().mean())
```

- **Minimal Notes:** Expanding windows grow from the start of the series.
- **Common Bug:** Using expanding when a fixed-size window is needed.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 44. Exponentially weighted statistics

- **Problem:** Compute decay-weighted metrics.
- **Trigger:** When recent observations should matter more than older ones.
- **Snippet:**

```python
import pandas as pd

s = pd.Series([1, 2, 3, 4, 5])
print(s.ewm(span=3).mean())
```

- **Minimal Notes:** EWM is useful for smooth tracking without a fixed window.
- **Common Bug:** Confusing `span`, `com`, `halflife`, and `alpha`.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 45. Datetime accessors

- **Problem:** Extract date parts from datetime values.
- **Trigger:** When grouping or filtering by year, month, day, or weekday.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(pd.to_datetime(["2026-01-01", "2026-02-15"]))
print(s.dt.year)
print(s.dt.month)
print(s.dt.day_name())
```

- **Minimal Notes:** `Series.dt` exposes datetimelike fields and methods.
- **Common Bug:** Calling `.dt` on non-datetime columns.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 46. Timezone localization and conversion

- **Problem:** Attach or convert timezones on datetime data.
- **Trigger:** When normalizing timestamps across regions.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(pd.to_datetime(["2026-01-01 10:00", "2026-01-01 11:00"]))
localized = s.dt.tz_localize("UTC")
print(localized.dt.tz_convert("Asia/Dhaka"))
```

- **Minimal Notes:** Localize naive timestamps before converting time zones.
- **Common Bug:** Calling `tz_convert` on naive datetimes.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 47. String methods

- **Problem:** Clean or parse text fields vectorially.
- **Trigger:** When working with names, identifiers, or free-form text.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(["  Alice ", "Bob", None])
print(s.str.strip().str.lower())
```

- **Minimal Notes:** `Series.str` avoids Python loops for common text tasks.
- **Common Bug:** Assuming string methods work on non-string dtypes without conversion.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 48. String contains and extract

- **Problem:** Match patterns or capture parts of text.
- **Trigger:** When parsing IDs, filenames, or tokens.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(["user-100", "user-200", "admin-300"])
print(s.str.contains(r"^user-"))
print(s.str.extract(r"([a-z]+)-(\d+)"))
```

- **Minimal Notes:** Regex-based string methods are common in data cleaning.
- **Common Bug:** Forgetting that regex metacharacters must be escaped when needed.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 49. Categorical conversion and categories

- **Problem:** Use efficient categorical labels.
- **Trigger:** When a column has repeated low-cardinality values.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(["A", "B", "A", "C"]).astype("category")
print(s.cat.categories)
print(s.cat.codes)
```

- **Minimal Notes:** Categorical data is useful for repeated labels and controlled ordering.
- **Common Bug:** Expecting free-form new categories without adding them first.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 50. Reorder or rename categories

- **Problem:** Control categorical label order or names.
- **Trigger:** When category order affects reporting or sorting.
- **Snippet:**

```python
import pandas as pd

s = pd.Series(["low", "medium", "high"], dtype="category")
s = s.cat.reorder_categories(["low", "medium", "high"], ordered=True)
print(s)
```

- **Minimal Notes:** Ordered categoricals are useful for rankings and priority levels.
- **Common Bug:** Reordering categories without ensuring all values are included.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 51. MultiIndex creation and slicing

- **Problem:** Work with hierarchical labels.
- **Trigger:** When data has multiple index dimensions.
- **Snippet:**

```python
import pandas as pd

idx = pd.MultiIndex.from_tuples([("A", 1), ("A", 2), ("B", 1)], names=["group", "item"])
df = pd.DataFrame({"value": [10, 20, 30]}, index=idx)
print(df.loc["A"])
```

- **Minimal Notes:** MultiIndex is common in grouped or reshaped outputs.
- **Common Bug:** Slicing a MultiIndex without understanding level order.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 52. Reset MultiIndex levels

- **Problem:** Flatten hierarchical labels back to columns.
- **Trigger:** When exporting or merging after grouped reshaping.
- **Snippet:**

```python
import pandas as pd

idx = pd.MultiIndex.from_tuples([("A", 1), ("B", 2)], names=["group", "item"])
df = pd.DataFrame({"value": [10, 20]}, index=idx)
print(df.reset_index())
```

- **Minimal Notes:** Resetting index is the common way to flatten grouped output.
- **Common Bug:** Losing index names during round-trip transformations.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 53. Compute top and bottom values

- **Problem:** Get extreme values efficiently.
- **Trigger:** When inspecting top-N or bottom-N rows by metric.
- **Snippet:**

```python
import pandas as pd

s = pd.Series([10, 50, 30, 20])
print(s.nlargest(2))
print(s.nsmallest(2))
```

- **Minimal Notes:** These methods are faster than full sorting for small N.
- **Common Bug:** Sorting the whole series when only top values are needed.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 54. Rank values

- **Problem:** Compute order-based ranks.
- **Trigger:** When ranking records or breaking ties numerically.
- **Snippet:**

```python
import pandas as pd

s = pd.Series([100, 80, 80, 50])
print(s.rank(method="average", ascending=False))
```

- **Minimal Notes:** Rank method controls tie handling.
- **Common Bug:** Using the wrong tie strategy for reporting.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 55. Correlate two Series

- **Problem:** Compute correlation between two vectors.
- **Trigger:** When comparing paired measurements directly.
- **Snippet:**

```python
import pandas as pd

s1 = pd.Series([1, 2, 3, 4])
s2 = pd.Series([2, 4, 6, 8])
print(s1.corr(s2))
```

- **Minimal Notes:** Series correlation is useful for simple pairwise checks.
- **Common Bug:** Comparing vectors with misaligned indexes.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 56. Plot a Series

- **Problem:** Create a quick chart from tabular data.
- **Trigger:** When doing fast inspection or reporting.
- **Snippet:**

```python
import pandas as pd
import matplotlib.pyplot as plt

s = pd.Series([1, 3, 2, 4], index=["a", "b", "c", "d"])
ax = s.plot(kind="line")
plt.show()
```

- **Minimal Notes:** Pandas plotting is a thin wrapper around Matplotlib.
- **Common Bug:** Forgetting to display or save the figure in non-interactive environments.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 57. Plot grouped data

- **Problem:** Visualize grouped distributions or trends.
- **Trigger:** When inspecting categories or group-level patterns quickly.
- **Snippet:**

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({"team": ["A", "A", "B", "B"], "score": [10, 15, 7, 12]})
df.groupby("team")["score"].mean().plot(kind="bar")
plt.show()
```

- **Minimal Notes:** Plot grouped summaries instead of raw row-level noise.
- **Common Bug:** Plotting the wrong level of aggregation.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/groupby.html


### 58. Export to CSV

- **Problem:** Save a DataFrame to a CSV file.
- **Trigger:** When sharing data with tools that expect flat files.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_csv("output.csv", index=False)
```

- **Minimal Notes:** `index=False` is usually the right choice for exports.
- **Common Bug:** Accidentally exporting the index as an extra column.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 59. Export to Excel

- **Problem:** Write tabular output to a spreadsheet.
- **Trigger:** When delivering results to Excel-based workflows.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_excel("output.xlsx", index=False)
```

- **Minimal Notes:** Excel is useful for downstream business workflows.
- **Common Bug:** Missing optional writer dependencies.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 60. Export to Parquet

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


### 61. Export to JSON

- **Problem:** Serialize tabular data for APIs or text-based interchange.
- **Trigger:** When the downstream system expects JSON.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
print(df.to_json(orient="records"))
```

- **Minimal Notes:** Choose `orient` to match the consumer format.
- **Common Bug:** Picking an orient that the downstream parser does not expect.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 62. Persist to SQL

- **Problem:** Write a DataFrame to a relational database table.
- **Trigger:** When loading results into a SQL warehouse or database.
- **Snippet:**

```python
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///:memory:")
df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_sql("results", engine, index=False, if_exists="replace")
print(pd.read_sql("results", engine))
```

- **Minimal Notes:** `to_sql` is common for operational handoff to relational storage.
- **Common Bug:** Forgetting that the target table may already exist.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 63. Copy to clipboard

- **Problem:** Send tabular output to the system clipboard.
- **Trigger:** When moving results into spreadsheets or chat tools.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_clipboard(index=False)
```

- **Minimal Notes:** Useful for quick manual handoff during analysis.
- **Common Bug:** Clipboard support failing in headless or remote environments.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 64. Serialize to pickle

- **Problem:** Store a Python-native Pandas object.
- **Trigger:** When you need a quick local round-trip and control the environment.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "B"], "score": [90, 85]})
df.to_pickle("frame.pkl")
```

- **Minimal Notes:** Pickle is convenient but environment-specific.
- **Common Bug:** Using pickle for untrusted data or cross-version interchange.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 65. Compare objects

- **Problem:** Inspect differences between two aligned Series or DataFrames.
- **Trigger:** When validating transformations or regression outputs.
- **Snippet:**

```python
import pandas as pd

df1 = pd.DataFrame({"a": [1, 2]})
df2 = pd.DataFrame({"a": [1, 3]})
print(df1.compare(df2))
```

- **Minimal Notes:** `compare` is useful for debugging changed values.
- **Common Bug:** Comparing objects with mismatched labels and expecting a clean diff.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 66. Align objects

- **Problem:** Reindex two objects to a common axis.
- **Trigger:** When arithmetic or assignment depends on label matching.
- **Snippet:**

```python
import pandas as pd

s1 = pd.Series([1, 2], index=["a", "b"])
s2 = pd.Series([10, 20], index=["b", "c"])
a1, a2 = s1.align(s2, join="outer")
print(a1)
print(a2)
```

- **Minimal Notes:** Alignment is a core Pandas behavior for label-aware operations.
- **Common Bug:** Assuming positional matching when labels actually drive alignment.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/series.html


### 67. Truncate by index range

- **Problem:** Keep a continuous label slice.
- **Trigger:** When narrowing time-series or sorted index ranges.
- **Snippet:**

```python
import pandas as pd

idx = pd.date_range("2026-01-01", periods=5, freq="D")
df = pd.DataFrame({"value": range(5)}, index=idx)
print(df.truncate(before="2026-01-02", after="2026-01-04"))
```

- **Minimal Notes:** Truncation is useful for label-bounded subsets.
- **Common Bug:** Using unsorted indexes and getting unexpected slices.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 68. Drop duplicates in place-free style

- **Problem:** Clean repeated rows without mutating unexpectedly.
- **Trigger:** When chaining transformations in production code.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"name": ["A", "A", "B"], "score": [1, 1, 2]})
clean = df.drop_duplicates(ignore_index=True)
print(clean)
```

- **Minimal Notes:** Prefer returned objects over implicit mutation in pipelines.
- **Common Bug:** Relying on `inplace=True` and losing composability.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/frame.html


### 69. Compute windowed counts per group

- **Problem:** Combine groupby and rolling logic.
- **Trigger:** When time-series analysis is grouped by entity.
- **Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"team": ["A", "A", "A", "B", "B"], "value": [1, 2, 3, 4, 5]}
)
result = df.groupby("team")["value"].rolling(2).mean()
print(result)
```

- **Minimal Notes:** Grouped windows return hierarchical indexes.
- **Common Bug:** Forgetting to reset or drop the extra index level after rolling.
- **Official Documentation URL:** https://pandas.pydata.org/docs/reference/groupby.html


## Quick reference

### Common APIs

| Task | Primary API | Notes |
| :-- | :-- | :-- |
| Create table | `pd.DataFrame(...)` | Most common constructor. |
| Create vector | `pd.Series(...)` | One-dimensional labeled data. |
| Create labels | `pd.Index(...)` | Immutable axis labels. |
| Read CSV | `pd.read_csv(...)` | Default flat-file loader. |
| Join tables | `DataFrame.merge(...)` | Database-style merge. |
| Index join | `DataFrame.join(...)` | Index-based alignment. |
| Group and aggregate | `DataFrame.groupby(...).agg(...)` | Use named aggregations. |
| Missing values | `isna`, `dropna`, `fillna` | Core cleaning trio. |
| Reshape | `pivot`, `pivot_table`, `melt`, `stack`, `unstack` | Main reshape tools. |
| Time series | `resample`, `rolling`, `expanding`, `ewm` | Core windowing APIs. |
| Export | `to_csv`, `to_excel`, `to_parquet`, `to_json` | Pick by downstream need. |

### Core objects

| Object | Role |
| :-- | :-- |
| `DataFrame` | Two-dimensional table. |
| `Series` | One-dimensional labeled data. |
| `Index` | Row or column labels. |
| `MultiIndex` | Hierarchical labels. |
| `Categorical` | Low-cardinality encoded labels. |

### Common accessors

| Accessor | Use |
| :-- | :-- |
| `.dt` | Datetime and timedelta fields/methods. |
| `.str` | Vectorized string methods. |
| `.cat` | Categorical operations. |
| `.plot` | Pandas plotting wrapper. |
| `.sparse` | Sparse-series helpers. |

### Common methods

| Area | Methods |
| :-- | :-- |
| Selection | `loc`, `iloc`, `at`, `iat`, `head`, `tail` |
| Cleaning | `drop`, `replace`, `dropna`, `fillna`, `drop_duplicates` |
| Analysis | `describe`, `corr`, `value_counts`, `rank`, `nlargest`, `nsmallest` |
| Shape | `assign`, `rename`, `set_index`, `reset_index`, `sort_index`, `sort_values` |
| IO | `read_csv`, `read_excel`, `read_parquet`, `to_csv`, `to_excel`, `to_parquet` |

### GroupBy methods

| Method | Use |
| :-- | :-- |
| `agg` | Aggregate groups. |
| `transform` | Return row-aligned group results. |
| `filter` | Keep or drop whole groups. |
| `apply` | Flexible per-group function. |
| `size` | Group sizes. |
| `count` | Non-null counts. |
| `first` / `last` | Boundary values per group. |

### Indexing cheat table

| Need | Use |
| :-- | :-- |
| Label-based row/column selection | `.loc` |
| Position-based row/column selection | `.iloc` |
| Fast scalar by label | `.at` |
| Fast scalar by position | `.iat` |
| Column selection | `df["col"]`, `df[["a", "b"]]` |

### Datetime and string helpers

| Task | API |
| :-- | :-- |
| Parse datetimes | `pd.to_datetime(...)` |
| Extract year/month/day | `.dt.year`, `.dt.month`, `.dt.day` |
| Convert time zones | `.dt.tz_localize(...)`, `.dt.tz_convert(...)` |
| Trim text | `.str.strip()` |
| Case normalization | `.str.lower()`, `.str.upper()` |
| Pattern matching | `.str.contains(...)`, `.str.extract(...)` |

### Common errors

| Error | Cause | Solution |
| :-- | :-- | :-- |
| Shape mismatch | Arrays or Series have incompatible lengths. | Align lengths before construction or assignment. |
| KeyError | Label does not exist. | Check `columns`, `index`, or spelling. |
| ValueError: columns overlap | Duplicate column names in join or concat. | Rename columns or use suffixes. |
| Duplicate entries during pivot | Repeated index/column combinations. | Use `pivot_table` with an aggregation function. |
| Unexpected NaNs after assignment | Index alignment mismatch. | Reindex or assign arrays with matching order. |
| TypeError on `.dt` or `.str` | Accessor used on wrong dtype. | Convert the column to datetime or string first. |
| Merge explosion | Duplicate keys on one or both sides. | Validate join cardinality before merging. |

### Performance checklist

- Prefer vectorized operations over Python loops.
- Use `merge` and `concat` instead of row-wise assembly.
- Use `category` for repeated low-cardinality text.
- Prefer Parquet over CSV for large datasets.
- Avoid repeated incremental appends; build lists and concatenate once.
- Drop unused columns early to reduce memory pressure.
- Use `read_csv` options to load only needed columns when possible.
- Consider chunked processing for large inputs.
- Use `nlargest`/`nsmallest` instead of full sorts for small-N selection.
- Reset or drop unnecessary indexes after heavy reshaping.


### Production checklist

- Verify dtypes before joins, groupbys, and exports.
- Normalize missing-value handling early.
- Keep index strategy intentional and consistent.
- Use explicit sort order when results must be deterministic.
- Write reproducible exports with `index=False` when appropriate.
- Validate merged row counts after joins.
- Prefer stable, documented APIs only.
- Test file paths, encodings, delimiters, and sheet names in the target environment.
- Use named aggregations for readable groupby outputs.
- Convert timestamp columns before datetime accessors or resampling.
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.qeios.com/read/GFSQFL/pdf

[^2]: https://zenodo.org/record/3961230/files/pandera.pdf

[^3]: https://arxiv.org/pdf/2312.11122.pdf

[^4]: http://arxiv.org/pdf/2303.16146.pdf

[^5]: https://www.mdpi.com/2076-3271/7/3/52/pdf

[^6]: https://www.frontiersin.org/articles/10.3389/fmicb.2019.00471/pdf

[^7]: https://arxiv.org/pdf/2203.10744.pdf

[^8]: https://pandas.pydata.org/docs/reference/groupby.html

[^9]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html

[^10]: https://pandas.pydata.org/docs/reference/index.html

[^11]: https://pandas.pydata.org/pandas-docs/stable/whatsnew/v3.0.4.html

[^12]: http://pandas.pydata.org/docs/reference/api/pandas.api.typing.SeriesGroupBy.apply.html

[^13]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html

[^14]: https://pandas.pydata.org/docs/reference/series.html

[^15]: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.core.groupby.SeriesGroupBy.groups.html

[^16]: http://pandas.pydata.org/docs/reference/api/pandas.api.typing.SeriesGroupBy.first.html

[^17]: https://pandas.pydata.org/docs/whatsnew/index.html

