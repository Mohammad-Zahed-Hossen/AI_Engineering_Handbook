Below is the production-ready AENS source document for the Pandas package, structured for near-direct conversion into JSON and focused on the most reused daily tabular-data operations. It uses the current stable pandas documentation set, which is version 3.0.4, and the standard installation/import pattern is `pip install pandas` plus `import pandas as pd`.[^1][^2]

# pandas

## Package Metadata

- id: pandas
- title: Pandas Package
- slug: pandas
- name: pandas
- version: 3.0.4
- summary: Python library for labeled tabular data structures and data analysis tools.
- description: Core Python package for daily tabular data manipulation, cleaning, transformation, aggregation, and time-series workflows.
- install: `pip install pandas`
- importas: `import pandas as pd`
- official_documentation_sources:
    - [Main documentation](https://pandas.pydata.org/docs/)[^2]
    - [API reference](https://pandas.pydata.org/docs/reference/index.html)[^3]
    - [Installation](https://pandas.pydata.org/docs/getting_started/install.html)[^1]
- created_at: 2026-07-05T00:00:00Z
- updated_at: 2026-07-05T00:00:00Z


## Create DataFrame

Mental Trigger

I need a labeled 2D table to organize tabular data.

Syntax

`pd.DataFrame(data=None, index=None, columns=None, dtype=None, copy=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Ava", "Ben", "Chen"],
    "score": [91, 84, 77]
})
print(df)
```

Important Parameters

- data.
- index.
- columns.
- dtype.
- copy.

Use When

- Building a table from lists, dicts, arrays, or records.
- Creating a small test dataset.
- Normalizing structured in-memory data.
- Converting intermediate Python data into a table.

Avoid When

- You only need one-dimensional labeled data.
- You need a sparse or specialized array structure.
- You are repeatedly constructing frames inside a loop.

Gotchas

- Mixed input types can force object dtype.
- Copy behavior depends on the input structure.
- Column order follows insertion order for dict inputs.
- Missing keys produce NaN.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)[^4]

## Create Series

Mental Trigger

I need a single labeled column of values.

Syntax

`pd.Series(data=None, index=None, dtype=None, name=None, copy=None)`

Example

```python
import pandas as pd

s = pd.Series([10, 20, 30], name="score")
print(s)
```

Important Parameters

- data.
- index.
- dtype.
- name.
- copy.

Use When

- Representing a single feature or measurement.
- Creating a derived column before attaching it to a DataFrame.
- Working with indexed one-dimensional data.
- Performing vectorized operations on one variable.

Avoid When

- You need row/column structure.
- You need relational joins or table reshaping.
- You want a plain Python list.

Gotchas

- Series index alignment affects arithmetic.
- Scalars broadcast differently than lists.
- `NaN` may force float dtype.
- Name is metadata, not a column label.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.html)[^5]

## Read CSV File

Mental Trigger

I need to load delimited text data into a DataFrame.

Syntax

`pd.read_csv(filepath_or_buffer, sep=',', header='infer', index_col=None, usecols=None, dtype=None)`

Example

```python
import pandas as pd
from io import StringIO

data = StringIO("name,score\nAva,91\nBen,84\n")
df = pd.read_csv(data)
print(df)
```

Important Parameters

- filepath_or_buffer.
- sep.
- header.
- usecols.
- dtype.

Use When

- Ingesting spreadsheets exported as CSV.
- Loading log extracts and flat files.
- Reading local or remote comma-separated data.
- Selecting only needed columns at load time.

Avoid When

- The file is hierarchical or nested JSON.
- You need typed binary columnar storage.
- Delimiters vary unpredictably within the file.

Gotchas

- Type inference can surprise you on mixed columns.
- Missing values may change inferred dtypes.
- Date parsing should be verified explicitly.
- Large files benefit from `usecols` and explicit dtypes.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html)[^6]

## Read Excel File

Mental Trigger

I need to load spreadsheet data from an Excel workbook.

Syntax

`pd.read_excel(io, sheet_name=0, header=0, usecols=None, dtype=None, engine=None)`

Example

```python
import pandas as pd
from io import BytesIO

buffer = BytesIO()
with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
    pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]}).to_excel(writer, index=False)

buffer.seek(0)
df = pd.read_excel(buffer)
print(df)
```

Important Parameters

- io.
- sheet_name.
- usecols.
- dtype.
- engine.

Use When

- Reading analyst workbooks.
- Loading multi-sheet reporting files.
- Importing structured Excel exports.
- Restricting reads to specific sheets or columns.

Avoid When

- CSV or Parquet is available instead.
- Workbook formatting is the main data source.
- You need high-throughput repeated ingestion.

Gotchas

- Engine availability depends on installed optional dependencies.
- Sheet naming and positions can be ambiguous.
- Excel dates and empty cells may infer unexpected types.
- Merged cells can affect structure.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.read_excel.html](https://pandas.pydata.org/docs/reference/api/pandas.read_excel.html)

## Read Parquet File

Mental Trigger

I need fast columnar I/O with preserved types.

Syntax

`pd.read_parquet(path, engine=None, columns=None, storage_options=None)`

Example

```python
import pandas as pd
import tempfile
import os

df0 = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
path = tempfile.mktemp(suffix=".parquet")
df0.to_parquet(path, index=False)

df = pd.read_parquet(path)
print(df)
os.remove(path)
```

Important Parameters

- path.
- engine.
- columns.
- storage_options.
- filters.

Use When

- Persisting analytical tables efficiently.
- Preserving schema and types across reloads.
- Loading large datasets selectively.
- Re-reading data in pipeline stages.

Avoid When

- Human-editable interchange is required.
- You need to inspect raw text easily.
- Parquet support dependencies are unavailable.

Gotchas

- Backend availability affects supported features.
- Partitioned layouts behave differently than single files.
- Column pruning depends on engine support.
- Index handling should be explicit.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.read_parquet.html](https://pandas.pydata.org/docs/reference/api/pandas.read_parquet.html)

## Read JSON File

Mental Trigger

I need to load JSON records into a table.

Syntax

`pd.read_json(path_or_buf, orient=None, lines=False, dtype=None, convert_dates=True)`

Example

```python
import pandas as pd
from io import StringIO

data = StringIO('[{"name":"Ava","score":91},{"name":"Ben","score":84}]')
df = pd.read_json(data)
print(df)
```

Important Parameters

- path_or_buf.
- orient.
- lines.
- dtype.
- convert_dates.

Use When

- Reading API responses saved as JSON.
- Loading newline-delimited JSON logs.
- Converting nested records into rows.
- Pulling structured events into analysis tables.

Avoid When

- The source is naturally columnar.
- The JSON structure is deeply nested without normalization.
- CSV or Parquet is simpler and more stable.

Gotchas

- `orient` must match the file layout.
- `lines=True` expects one JSON object per line.
- Date conversion can alter raw text fields.
- Nested structures may remain object dtype.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.read_json.html](https://pandas.pydata.org/docs/reference/api/pandas.read_json.html)

## View First Rows

Mental Trigger

I need a quick preview of the top of a table.

Syntax

`DataFrame.head(n=5)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"], "score": [91, 84, 77]})
print(df.head(2))
```

Important Parameters

- n.

Use When

- Checking data load success.
- Inspecting columns and sample values.
- Debugging transformations.
- Sharing a compact preview.

Avoid When

- You need random sampling.
- The top rows are not representative.
- You need the full dataset.

Gotchas

- It returns a view-like result, not a copy guarantee.
- Small tables may hide structural issues.
- `n` larger than size just returns all rows.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.head.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.head.html)

## View Last Rows

Mental Trigger

I need to inspect the bottom of a table.

Syntax

`DataFrame.tail(n=5)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"], "score": [91, 84, 77]})
print(df.tail(2))
```

Important Parameters

- n.

Use When

- Checking appended rows.
- Verifying export or ingest truncation.
- Inspecting recent records.
- Debugging time-ordered data.

Avoid When

- The table is unordered.
- You need a random sample.
- The dataset is too small to be informative.

Gotchas

- Only works as expected when row order matters.
- Negative values have special behavior.
- Not a substitute for proper sorting.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.tail.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.tail.html)

## Inspect Shape

Mental Trigger

I need to know row and column counts fast.

Syntax

`DataFrame.shape`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
print(df.shape)
```

Important Parameters

- none.

Use When

- Checking dataset size.
- Validating filters or joins.
- Monitoring pipeline outputs.
- Writing quick sanity checks.

Avoid When

- You need row labels or column names.
- You need memory usage or type information.

Gotchas

- Shape includes all rows, including those with missing values.
- It does not imply uniqueness.
- It does not reveal columns' semantic structure.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.shape.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.shape.html)

## Inspect Columns

Mental Trigger

I need the column names in order.

Syntax

`DataFrame.columns`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava"], "score": [^91]})
print(df.columns)
```

Important Parameters

- none.

Use When

- Checking available fields.
- Selecting or renaming columns.
- Building dynamic pipelines.
- Validating schema expectations.

Avoid When

- You need data values.
- You need row-level inspection.
- Schema may be duplicate or ambiguous.

Gotchas

- Columns are an Index object.
- Duplicate names can exist.
- Order matters for some operations.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.columns.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.columns.html)

## Inspect Dtypes

Mental Trigger

I need to see column data types.

Syntax

`DataFrame.dtypes`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava"], "score": [^91]})
print(df.dtypes)
```

Important Parameters

- none.

Use When

- Auditing schema.
- Debugging numeric, datetime, or object columns.
- Preparing type conversions.
- Checking ingestion results.

Avoid When

- You need actual values.
- You only need a single column's dtype.

Gotchas

- Object dtype often hides mixed content.
- Nullable extension dtypes may behave differently than NumPy dtypes.
- Inference may vary by load path.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dtypes.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dtypes.html)

## Inspect Memory Usage

Mental Trigger

I need to estimate table memory cost.

Syntax

`DataFrame.memory_usage(index=True, deep=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
print(df.memory_usage(deep=True))
```

Important Parameters

- index.
- deep.

Use When

- Finding large object columns.
- Comparing memory footprint before and after cleanup.
- Optimizing large datasets.
- Auditing indexes and string-heavy columns.

Avoid When

- You only need row counts.
- The table is tiny.
- You need execution time measurements.

Gotchas

- `deep=True` is needed for object columns.
- Memory accounting is approximate for some dtypes.
- Index memory can be significant.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.memory_usage.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.memory_usage.html)

## Summary Statistics

Mental Trigger

I need a compact numeric summary of a dataset.

Syntax

`DataFrame.describe(percentiles=None, include=None, exclude=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"score": [91, 84, 77, 88]})
print(df.describe())
```

Important Parameters

- percentiles.
- include.
- exclude.
- datetime_is_numeric.

Use When

- Checking distributions quickly.
- Looking for outliers or missingness clues.
- Summarizing numeric columns.
- Creating exploratory reports.

Avoid When

- You need exact row-level values.
- Data is mostly categorical without `include='all'`.
- You want custom metrics.

Gotchas

- Output changes by dtype.
- Categorical columns require explicit inclusion.
- Some statistics exclude missing values.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html)

## Unique Values

Mental Trigger

I need the distinct values in a column.

Syntax

`Series.unique()`

Example

```python
import pandas as pd

s = pd.Series(["red", "blue", "red"])
print(s.unique())
```

Important Parameters

- none.

Use When

- Checking category cardinality.
- Debugging unexpected values.
- Preparing categorical analysis.
- Discovering data cleanup needs.

Avoid When

- You need counts.
- You need sorted output.
- The series is extremely large and full materialization is costly.

Gotchas

- Order reflects first appearance.
- Missing values may appear as distinct entries.
- Return type depends on dtype.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.unique.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.unique.html)

## Value Counts

Mental Trigger

I need frequency counts for categorical values.

Syntax

`Series.value_counts(normalize=False, sort=True, ascending=False, dropna=True)`

Example

```python
import pandas as pd

s = pd.Series(["red", "blue", "red", None])
print(s.value_counts(dropna=False))
```

Important Parameters

- normalize.
- sort.
- ascending.
- dropna.

Use When

- Finding dominant categories.
- Checking class imbalance.
- Identifying rare values.
- Measuring missingness frequency.

Avoid When

- You need row-level detail.
- The values are already numeric and continuous.
- You need grouped cross-tabulation.

Gotchas

- Missing values are excluded unless `dropna=False`.
- Sorting is descending by default.
- Ties may not be stable in presentation order.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.value_counts.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.value_counts.html)

## Select Column

Mental Trigger

I need one column as a Series.

Syntax

`df["col"]`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
s = df["score"]
print(s)
```

Important Parameters

- column key.

Use When

- Working with one variable.
- Vectorizing calculations.
- Passing a single field into another function.
- Checking column contents quickly.

Avoid When

- You need to preserve a DataFrame.
- You may have duplicate column names.
- You need multiple columns.

Gotchas

- Returns a Series, not a DataFrame.
- Duplicate column names can create ambiguity.
- Missing keys raise `KeyError`.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.__getitem__.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.__getitem__.html)

## Select Multiple Columns

Mental Trigger

I need a smaller table with chosen fields.

Syntax

`df[["col1", "col2"]]`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84], "city": ["SEA", "NYC"]})
subset = df[["name", "score"]]
print(subset)
```

Important Parameters

- column list.

Use When

- Reducing to a working set of features.
- Preparing export or display.
- Controlling pipeline schema.
- Reordering columns.

Avoid When

- You need row filtering too.
- Column names may be dynamic and missing.
- You want label-based slicing on rows.

Gotchas

- Missing columns raise `KeyError`.
- Result is a DataFrame, not a copy guarantee.
- Selection order follows the list you pass.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.__getitem__.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.__getitem__.html)

## Select Rows by Position

Mental Trigger

I need rows by integer position.

Syntax

`df.iloc[row_indexer, col_indexer]`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"], "score": [91, 84, 77]})
print(df.iloc[0:2, :])
```

Important Parameters

- row_indexer.
- col_indexer.
- slices.
- lists.
- booleans.

Use When

- Taking positional slices.
- Selecting by row number in a stable order.
- Extracting the first or last rows.
- Building deterministic tests.

Avoid When

- Index labels matter.
- You need semantic label selection.
- The index is not simple or not ordered.

Gotchas

- End slice is exclusive.
- Out-of-bounds scalar access raises errors.
- Works by position, not index labels.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html)

## Select Rows by Label

Mental Trigger

I need rows by index label.

Syntax

`df.loc[row_indexer, col_indexer]`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]}, index=["r1", "r2"])
print(df.loc["r1", :])
```

Important Parameters

- row_indexer.
- col_indexer.
- labels.
- slices.
- booleans.

Use When

- The index encodes meaning.
- Selecting named rows or row ranges.
- Filtering by aligned boolean masks.
- Working with MultiIndex labels.

Avoid When

- You only know integer positions.
- Index labels are duplicated and ambiguous.
- The index has not been set intentionally.

Gotchas

- Label slices are inclusive.
- Missing labels raise `KeyError`.
- Boolean masks align on index labels.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)

## Boolean Filter Rows

Mental Trigger

I need only rows matching a condition.

Syntax

`df[mask]`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"], "score": [91, 84, 77]})
filtered = df[df["score"] >= 85]
print(filtered)
```

Important Parameters

- mask.
- operator precedence.
- parentheses.

Use When

- Removing unwanted records.
- Selecting records by threshold.
- Filtering before aggregation.
- Creating cohort subsets.

Avoid When

- The condition is hard to read.
- You need many string-like predicates.
- You need safer expression parsing.

Gotchas

- Mask length must match the frame.
- Missing booleans can drop rows.
- Always parenthesize compound conditions.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)

## Query Rows

Mental Trigger

I need filter logic in an expression string.

Syntax

`DataFrame.query(expr, inplace=False, **kwargs)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"], "score": [91, 84, 77]})
result = df.query("score >= 85")
print(result)
```

Important Parameters

- expr.
- inplace.
- engine.
- parser.
- local_dict.

Use When

- Filtering with readable expressions.
- Building dynamic queries.
- Combining multiple conditions concisely.
- Passing filters from configuration.

Avoid When

- You need arbitrary Python code.
- Column names are awkward without quoting.
- You need maximum explicitness for debugging.

Gotchas

- Variable names in expressions can be confusing.
- Not all Python syntax is supported.
- String quoting inside expressions can be tricky.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.query.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.query.html)

## Slice Ranges

Mental Trigger

I need a contiguous subset of rows or columns.

Syntax

`df[start:stop]`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"], "score": [91, 84, 77]})
print(df[0:2])
```

Important Parameters

- start.
- stop.
- step.

Use When

- Taking a simple contiguous subset by position.
- Quick inspection of leading records.
- Creating small samples for debugging.

Avoid When

- You need label-based row selection.
- Index order is not meaningful.
- More explicit `.iloc` would reduce ambiguity.

Gotchas

- Slice semantics depend on the axis and index context.
- It is often clearer to use `.iloc`.
- Not ideal for production logic with labels.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html)

## Detect Missing Values

Mental Trigger

I need to find null or NaN entries.

Syntax

`DataFrame.isna()`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", None], "score": [91, None]})
print(df.isna())
```

Important Parameters

- none.

Use When

- Counting missingness.
- Building cleanup masks.
- Validating input completeness.
- Identifying sparse columns.

Avoid When

- You want non-null values directly.
- The dataset uses sentinel values instead of nulls.
- You need imputation immediately.

Gotchas

- `NaN != NaN`, so equality checks fail.
- Works across pandas missing-value sentinels.
- Nullable dtypes may propagate `pd.NA` differently.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.isna.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.isna.html)

## Fill Missing Values

Mental Trigger

I need to replace nulls with a value or strategy.

Syntax

`DataFrame.fillna(value=None, method=None, axis=None, inplace=False, limit=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", None], "score": [91, None]})
filled = df.fillna({"name": "unknown", "score": 0})
print(filled)
```

Important Parameters

- value.
- method.
- axis.
- inplace.
- limit.

Use When

- Imputing defaults.
- Forward- or backward-filling time-ordered data.
- Preparing data for modeling or export.
- Normalizing sparse fields.

Avoid When

- Missingness itself is meaningful.
- You need to keep original nulls.
- There is no documented business rule for replacement.

Gotchas

- `inplace` can complicate chaining.
- Type coercion may occur.
- Method-based fills depend on ordering.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.fillna.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.fillna.html)

## Drop Missing Values

Mental Trigger

I need to remove rows or columns with nulls.

Syntax

`DataFrame.dropna(axis=0, how='any', subset=None, inplace=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", None], "score": [91, None]})
clean = df.dropna()
print(clean)
```

Important Parameters

- axis.
- how.
- subset.
- inplace.
- thresh.

Use When

- Cleaning incomplete records.
- Keeping only fully populated rows.
- Dropping unusable columns.
- Preparing strict downstream inputs.

Avoid When

- Missingness is expected and informative.
- You can impute safely.
- Too much data would be lost.

Gotchas

- Defaults may remove more than intended.
- `subset` restricts the inspected columns.
- Row loss can silently bias data.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dropna.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dropna.html)

## Replace Values

Mental Trigger

I need direct value substitution.

Syntax

`DataFrame.replace(to_replace=None, value=None, inplace=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"status": ["ok", "N/A", "ok"]})
clean = df.replace("N/A", None)
print(clean)
```

Important Parameters

- to_replace.
- value.
- regex.
- inplace.
- limit.

Use When

- Standardizing placeholders.
- Rewriting sentinel values.
- Normalizing categorical text.
- Cleaning known bad values.

Avoid When

- You need pattern-specific parsing better handled elsewhere.
- Transformations should be type-aware.
- The change belongs in ingestion rather than cleanup.

Gotchas

- Broad replacements can affect more than one column.
- Regex replacement can be expensive or surprising.
- Replacement may alter dtype.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.replace.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.replace.html)

## Rename Columns

Mental Trigger

I need clearer or standardized names.

Syntax

`DataFrame.rename(columns=None, index=None, inplace=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"first name": ["Ava"], "final score": [^91]})
renamed = df.rename(columns={"first name": "first_name", "final score": "final_score"})
print(renamed)
```

Important Parameters

- columns.
- index.
- inplace.
- errors.
- copy.

Use When

- Normalizing naming conventions.
- Standardizing imported schemas.
- Making names code-friendly.
- Preparing merge keys.

Avoid When

- The data contract already uses stable names.
- You need a full schema rewrite with validation elsewhere.

Gotchas

- `inplace` is not generally a performance shortcut.
- Renaming only changes labels, not values.
- Missing keys can be ignored or error depending on settings.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rename.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rename.html)

## Drop Columns

Mental Trigger

I need to remove one or more fields.

Syntax

`DataFrame.drop(labels=None, axis=0, columns=None, inplace=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava"], "score": [^91], "temp": [^1]})
clean = df.drop(columns=["temp"])
print(clean)
```

Important Parameters

- labels.
- axis.
- columns.
- inplace.
- errors.

Use When

- Removing temporary fields.
- Trimming analysis output.
- Dropping redundant columns.
- Simplifying export schemas.

Avoid When

- You only need a projected subset.
- The dropped field might be needed later.
- You are chaining many structural changes unsafely.

Gotchas

- `axis=1` is easy to misread; `columns=` is clearer.
- Dropping nonexistent columns can raise.
- Copies may be created depending on context.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html)

## Drop Duplicates

Mental Trigger

I need to remove repeated records.

Syntax

`DataFrame.drop_duplicates(subset=None, keep='first', inplace=False, ignore_index=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ava", "Ben"], "score": [91, 91, 84]})
unique_rows = df.drop_duplicates()
print(unique_rows)
```

Important Parameters

- subset.
- keep.
- inplace.
- ignore_index.
- ignore.

Use When

- De-duplicating event or lookup tables.
- Keeping the latest or first occurrence.
- Cleaning repeated imports.
- Preparing unique keys.

Avoid When

- “Duplicate” requires business logic beyond exact row equality.
- You need groupwise deduplication with custom ranking.
- Retaining all copies matters.

Gotchas

- Equality is row-wise across selected columns.
- NaNs are treated specially.
- Sorting before deduplication often matters.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html)

## Change Dtype

Mental Trigger

I need a column in the correct type.

Syntax

`DataFrame.astype(dtype, copy=True, errors='raise')`

Example

```python
import pandas as pd

df = pd.DataFrame({"score": ["91", "84"]})
typed = df.astype({"score": "int64"})
print(typed.dtypes)
```

Important Parameters

- dtype.
- copy.
- errors.

Use When

- Converting strings to numbers.
- Preparing categorical or datetime-like data.
- Normalizing schema before analysis.
- Reducing memory with appropriate dtypes.

Avoid When

- Parsing requires custom coercion logic.
- Invalid values are common and should be handled more carefully.
- Direct casting would fail on dirty data.

Gotchas

- Strict casts can raise.
- Nullable and NumPy dtypes behave differently.
- `astype` does not parse dates from arbitrary strings.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.astype.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.astype.html)

## Sort Rows

Mental Trigger

I need records in a defined order.

Syntax

`DataFrame.sort_values(by, ascending=True, inplace=False, na_position='last')`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"], "score": [91, 84, 77]})
sorted_df = df.sort_values(by="score", ascending=False)
print(sorted_df)
```

Important Parameters

- by.
- ascending.
- inplace.
- na_position.
- kind.

Use When

- Ranking records.
- Preparing deterministic output.
- Sorting before deduplication or export.
- Reviewing top or bottom values.

Avoid When

- Original order is meaningful.
- You only need a stable subset.
- The data is already pre-sorted and trusted.

Gotchas

- Missing values are positioned separately.
- Multi-column sorts can be subtle.
- Sorting may not preserve ties unless stable sort is chosen.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_values.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_values.html)

## Sort Columns

Mental Trigger

I need column order changed.

Syntax

`DataFrame.sort_index(axis=1)`

Example

```python
import pandas as pd

df = pd.DataFrame({"b": [^2], "a": [^1]})
print(df.sort_index(axis=1))
```

Important Parameters

- axis.
- ascending.
- inplace.
- kind.

Use When

- Normalizing column order.
- Creating predictable exports.
- Comparing schemas.
- Improving readability.

Avoid When

- Column order is semantically meaningful.
- You need custom column placement.
- You only want selected fields.

Gotchas

- This sorts labels, not values.
- Duplicate labels can complicate results.
- Axis confusion is common.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_index.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_index.html)

## Apply Function

Mental Trigger

I need a custom function over rows, columns, or a Series.

Syntax

`DataFrame.apply(func, axis=0, raw=False, result_type=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"score": [91, 84, 77]})
result = df["score"].apply(lambda x: x + 1)
print(result)
```

Important Parameters

- func.
- axis.
- raw.
- result_type.
- by_row.

Use When

- Applying a custom transformation.
- Working with non-vectorizable logic.
- Performing row-wise feature construction carefully.
- Reusing a function across columns.

Avoid When

- A vectorized expression exists.
- Speed matters and pure Python is unnecessary.
- You are tempted to use it for simple arithmetic.

Gotchas

- `axis=1` row-wise apply is slower.
- Return shape can be tricky.
- `apply` often hides avoidable performance problems.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html)

## Map Values

Mental Trigger

I need one-to-one replacement on a Series.

Syntax

`Series.map(arg, na_action=None)`

Example

```python
import pandas as pd

s = pd.Series(["A", "B", "A"])
mapped = s.map({"A": "Apple", "B": "Banana"})
print(mapped)
```

Important Parameters

- arg.
- na_action.

Use When

- Translating codes to labels.
- Remapping categorical values.
- Creating readable output columns.
- Applying a small lookup dictionary.

Avoid When

- The mapping logic is many-to-one.
- You need row-wise conditions.
- Unknown keys should be silently accepted.

Gotchas

- Missing keys become NaN.
- Mapping a function and mapping a dict behave differently.
- Results may change dtype.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html)

## Assign New Column

Mental Trigger

I need to create derived columns safely.

Syntax

`DataFrame.assign(**kwargs)`

Example

```python
import pandas as pd

df = pd.DataFrame({"score": [91, 84, 77]})
new_df = df.assign(pass_fail=lambda x: x["score"] >= 85)
print(new_df)
```

Important Parameters

- kwargs.
- callable values.

Use When

- Building chained transformations.
- Creating multiple derived fields.
- Avoiding temporary variables.
- Keeping expression pipelines readable.

Avoid When

- You need in-place mutation for side effects.
- The transformation is too complex for a chain.
- You are modifying a view with unclear ownership.

Gotchas

- Returns a new DataFrame.
- Callable arguments receive the whole DataFrame.
- Later assigned columns can depend on earlier ones in the same call.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html)

## Vectorized Arithmetic

Mental Trigger

I need fast column-wise math.

Syntax

`df["new"] = df["a"] + df["b"]`

Example

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
df["total"] = df["a"] + df["b"]
print(df)
```

Important Parameters

- operands.
- alignment.
- broadcasting.

Use When

- Computing derived measures.
- Combining numeric columns.
- Scaling values.
- Applying row-wise formulas without loops.

Avoid When

- The logic is irregular and non-vectorizable.
- You are tempted to loop over rows.
- Alignment is uncertain across different indexes.

Gotchas

- Index alignment can change results.
- Mixed dtypes may produce object output.
- Missing values propagate through arithmetic.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)

## Group By Aggregate

Mental Trigger

I need summary statistics by category.

Syntax

`DataFrame.groupby(by, as_index=True).agg(aggfunc)`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "A", "B"],
    "score": [91, 84, 77]
})
result = df.groupby("team", as_index=False).agg(mean_score=("score", "mean"))
print(result)
```

Important Parameters

- by.
- as_index.
- agg.
- sort.
- observed.

Use When

- Summarizing by category.
- Computing per-group metrics.
- Building reporting tables.
- Producing KPI rollups.

Avoid When

- You only need raw filtered rows.
- The grouping key is too granular.
- Group semantics are ambiguous.

Gotchas

- `as_index=False` is often easier for downstream joins.
- Multiple aggregations can produce MultiIndex columns.
- Missing groups may vanish unless categories are handled carefully.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html)

## Group By Transform

Mental Trigger

I need a groupwise result aligned to original rows.

Syntax

`DataFrame.groupby(by).transform(func)`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "A", "B"],
    "score": [91, 84, 77]
})
df["team_mean"] = df.groupby("team")["score"].transform("mean")
print(df)
```

Important Parameters

- func.
- by.
- axis.
- engine.

Use When

- Adding group-normalized features.
- Computing per-row group statistics.
- Broadcasting group metrics back onto records.
- Creating z-scores or deviations.

Avoid When

- You need one row per group only.
- The transformation does not preserve shape.
- A merge would be clearer.

Gotchas

- Output must align to the original index.
- Misuse can create confusing shapes.
- Transform is not the same as aggregate.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.transform.html](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.transform.html)

## Group By Filter

Mental Trigger

I need only groups that satisfy a condition.

Syntax

`DataFrame.groupby(by).filter(func)`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "A", "B"],
    "score": [91, 84, 77]
})
result = df.groupby("team").filter(lambda g: g["score"].mean() >= 85)
print(result)
```

Important Parameters

- func.
- dropna.
- by.

Use When

- Removing weak groups.
- Keeping cohorts meeting a threshold.
- Pre-filtering before modeling or reporting.
- Applying group-level business rules.

Avoid When

- A simple row filter is enough.
- You need a group summary table.
- Group functions are expensive on huge data.

Gotchas

- The function receives each group as a DataFrame.
- Filter preserves original rows from accepted groups.
- Performance can be poor if the predicate is complex.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.filter.html](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.filter.html)

## Merge Two DataFrames

Mental Trigger

I need to join tables on one or more keys.

Syntax

`pd.merge(left, right, on=None, how='inner', left_on=None, right_on=None)`

Example

```python
import pandas as pd

left = pd.DataFrame({"id": [1, 2], "name": ["Ava", "Ben"]})
right = pd.DataFrame({"id": [1, 2], "score": [91, 84]})
merged = pd.merge(left, right, on="id", how="inner")
print(merged)
```

Important Parameters

- on.
- how.
- left_on.
- right_on.
- validate.

Use When

- Combining fact and lookup tables.
- Enriching rows with metadata.
- Joining denormalized datasets.
- Reconstructing wide analysis tables.

Avoid When

- Keys are not unique and duplication is unwanted.
- You only need vertical stacking.
- A relational join is not the right model.

Gotchas

- Duplicate keys can multiply rows.
- Null join keys behave differently than SQL expectations.
- Validate join cardinality when possible.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html)[^7]

## Join on Index

Mental Trigger

I need to combine tables using their indexes.

Syntax

`DataFrame.join(other, on=None, how='left', lsuffix='', rsuffix='', sort=False)`

Example

```python
import pandas as pd

left = pd.DataFrame({"name": ["Ava", "Ben"]}, index=[1, 2])
right = pd.DataFrame({"score": [91, 84]}, index=[1, 2])
joined = left.join(right, how="inner")
print(joined)
```

Important Parameters

- other.
- how.
- on.
- lsuffix.
- rsuffix.

Use When

- Index values are the natural key.
- Joining many aligned tables.
- Enriching an indexed frame.
- Keeping left index structure.

Avoid When

- Join keys live in regular columns.
- Index meaning is accidental.
- Key cardinality is unclear.

Gotchas

- Index alignment matters.
- Overlapping columns need suffixes.
- Many-to-many joins can expand unexpectedly.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.join.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.join.html)

## Concatenate DataFrames

Mental Trigger

I need to stack or combine objects along an axis.

Syntax

`pd.concat(objs, axis=0, join='outer', ignore_index=False)`

Example

```python
import pandas as pd

a = pd.DataFrame({"name": ["Ava"], "score": [^91]})
b = pd.DataFrame({"name": ["Ben"], "score": [^84]})
combined = pd.concat([a, b], ignore_index=True)
print(combined)
```

Important Parameters

- objs.
- axis.
- join.
- ignore_index.
- keys.

Use When

- Appending batches.
- Combining same-shaped tables.
- Building multi-source panels.
- Stacking partitions.

Avoid When

- You need key-based relational matching.
- Schema mismatch should be controlled explicitly.
- `merge` or `join` would be clearer.

Gotchas

- Axis choice changes the meaning completely.
- Indexes may be retained unless ignored.
- Column union can introduce missing values.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.concat.html](https://pandas.pydata.org/docs/reference/api/pandas.concat.html)

## Pivot Table

Mental Trigger

I need a grouped summary in matrix form.

Syntax

`DataFrame.pivot_table(values=None, index=None, columns=None, aggfunc='mean', fill_value=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "A", "B"],
    "quarter": ["Q1", "Q2", "Q1"],
    "score": [91, 84, 77]
})
table = df.pivot_table(values="score", index="team", columns="quarter", aggfunc="mean")
print(table)
```

Important Parameters

- values.
- index.
- columns.
- aggfunc.
- fill_value.

Use When

- Creating report matrices.
- Summarizing by two dimensions.
- Aggregating duplicates into a grid.
- Producing spreadsheet-like summaries.

Avoid When

- You need a pure reshape without aggregation.
- Duplicates must be preserved exactly.
- The table is too sparse and hard to read.

Gotchas

- Duplicate combinations require aggregation.
- Missing combinations become NaN.
- Multi-level outputs are common.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot_table.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot_table.html)

## Pivot Long to Wide

Mental Trigger

I need a one-to-one reshape from long to wide.

Syntax

`DataFrame.pivot(index=None, columns=None, values=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "B"],
    "metric": ["score", "score"],
    "value": [91, 84]
})
wide = df.pivot(index="team", columns="metric", values="value")
print(wide)
```

Important Parameters

- index.
- columns.
- values.

Use When

- Reshaping records without aggregation.
- Converting tidy long data into wide format.
- Preparing simple matrix layouts.
- Reindexing categorical structure.

Avoid When

- Duplicate key combinations exist.
- You need aggregation.
- The data is already wide enough.

Gotchas

- Duplicate index/column pairs raise errors.
- Output often gains hierarchical labels.
- Missing combinations become NaN.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot.html)

## Melt Wide to Long

Mental Trigger

I need to unpivot columns into rows.

Syntax

`DataFrame.melt(id_vars=None, value_vars=None, var_name=None, value_name='value')`

Example

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "B"], "score_q1": [91, 84], "score_q2": [88, 79]})
long = df.melt(id_vars=["team"], var_name="quarter", value_name="score")
print(long)
```

Important Parameters

- id_vars.
- value_vars.
- var_name.
- value_name.
- ignore_index.

Use When

- Normalizing wide survey or report data.
- Preparing visualization-ready tidy data.
- Collapsing repeated measure columns.
- Converting spreadsheet-style tables to long format.

Avoid When

- The table is already tidy.
- Column identities should stay separate.
- Aggregation is what you really need.

Gotchas

- The result can be much larger than the input.
- Non-id columns are stacked into rows.
- Column names become data values.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.melt.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.melt.html)

## Stack Columns

Mental Trigger

I need to move columns into the index hierarchy.

Syntax

`DataFrame.stack(level=-1, dropna=True)`

Example

```python
import pandas as pd

df = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
stacked = df.stack()
print(stacked)
```

Important Parameters

- level.
- dropna.
- future_stack.

Use When

- Moving wide data into a longer indexed form.
- Working with MultiIndex columns.
- Preparing hierarchical reshapes.
- Feeding index-based workflows.

Avoid When

- A plain `melt` is simpler.
- You want explicit column names in the output.
- MultiIndex complexity is unnecessary.

Gotchas

- Output becomes a Series or DataFrame depending on structure.
- Index nesting may surprise downstream code.
- Missing values may be dropped.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.stack.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.stack.html)

## Unstack Rows

Mental Trigger

I need to move an index level into columns.

Syntax

`DataFrame.unstack(level=-1, fill_value=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "quarter": ["Q1", "Q2", "Q1"], "score": [91, 84, 77]})
indexed = df.set_index(["team", "quarter"])
wide = indexed.unstack("quarter")
print(wide)
```

Important Parameters

- level.
- fill_value.
- sort.

Use When

- Converting grouped index data to a matrix.
- Exposing hierarchical row labels as columns.
- Reformatting MultiIndex outputs.

Avoid When

- The data is not indexed meaningfully.
- You do not want hierarchical columns.
- A pivot or pivot_table is simpler.

Gotchas

- Missing combinations produce NaN.
- MultiIndex structure can be awkward.
- Requires a suitable index level.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.unstack.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.unstack.html)

## Convert Datetime

Mental Trigger

I need text dates parsed into datetime objects.

Syntax

`pd.to_datetime(arg, errors='raise', utc=False, format=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"date": ["2026-01-01", "2026-01-15"]})
df["date"] = pd.to_datetime(df["date"])
print(df.dtypes)
```

Important Parameters

- arg.
- errors.
- utc.
- format.
- cache.

Use When

- Parsing date strings.
- Preparing time-series operations.
- Standardizing timestamps.
- Comparing dates safely.

Avoid When

- The source already has trusted datetime dtype.
- Invalid strings should remain visible.
- Locale or mixed formats are uncontrolled.

Gotchas

- Ambiguous date formats can parse incorrectly.
- Timezone handling changes comparison behavior.
- Invalid parsing may coerce or raise depending on settings.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html)

## Date Filtering

Mental Trigger

I need rows within a time range.

Syntax

`df[(df["ts"] >= start) & (df["ts"] < end)]`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "ts": pd.to_datetime(["2026-01-01", "2026-02-01"]),
    "value": [10, 20]
})
filtered = df[(df["ts"] >= "2026-01-15") & (df["ts"] < "2026-03-01")]
print(filtered)
```

Important Parameters

- start.
- end.
- inclusive logic.
- timezone alignment.

Use When

- Restricting events to a window.
- Building reporting periods.
- Selecting operational slices.
- Preparing time-based aggregates.

Avoid When

- Index-based slicing is more natural.
- The datetime column is still text.
- Timezones are inconsistent.

Gotchas

- String comparisons are unsafe unless parsed.
- Timezone-aware and naive timestamps do not mix cleanly.
- Inclusive/exclusive boundaries must be deliberate.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html)

## Resample Time Series

Mental Trigger

I need to aggregate data into time bins.

Syntax

`DataFrame.resample(rule, on=None, label=None, closed=None).agg(func)`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "ts": pd.to_datetime(["2026-01-01 01:00", "2026-01-01 13:00", "2026-01-02 02:00"]),
    "value": [10, 20, 30]
})
result = df.resample("D", on="ts").sum()
print(result)
```

Important Parameters

- rule.
- on.
- label.
- closed.
- origin.

Use When

- Summing by day, week, or month.
- Creating fixed-frequency metrics.
- Downsampling event streams.
- Comparing periods consistently.

Avoid When

- The data is not time-indexed or time-addressable.
- Irregular grouping is enough.
- You need non-time categorical grouping.

Gotchas

- Requires a datetime-like axis or `on=`.
- Bin boundaries matter.
- Missing periods may appear in output.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.resample.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.resample.html)

## Rolling Window

Mental Trigger

I need moving-window statistics.

Syntax

`DataFrame.rolling(window, min_periods=None, center=False).mean()`

Example

```python
import pandas as pd

s = pd.Series([1, 2, 3, 4, 5])
print(s.rolling(window=3).mean())
```

Important Parameters

- window.
- min_periods.
- center.
- win_type.
- method.

Use When

- Computing moving averages.
- Smoothing noisy signals.
- Calculating lagging features.
- Detecting local trends.

Avoid When

- A cumulative metric is sufficient.
- The window definition is unclear.
- Very small samples make the statistic meaningless.

Gotchas

- Initial windows return NaN until enough data exists.
- Window alignment affects interpretation.
- Time-based windows behave differently from row-count windows.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rolling.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rolling.html)

## Set Index

Mental Trigger

I need one or more columns to become the row index.

Syntax

`DataFrame.set_index(keys, drop=True, append=False, inplace=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "name": ["Ava", "Ben"]})
indexed = df.set_index("id")
print(indexed)
```

Important Parameters

- keys.
- drop.
- append.
- inplace.
- verify_integrity.

Use When

- Using a natural key for lookup.
- Preparing joins on index.
- Building time-series or hierarchical tables.
- Making labels part of structure.

Avoid When

- The column is not unique enough.
- You still need the column frequently in its original form.
- Positional access is more important than labels.

Gotchas

- Duplicate keys can create ambiguous indexes.
- `drop=False` keeps the original column.
- Index choice affects later alignment.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.set_index.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.set_index.html)

## Reset Index

Mental Trigger

I need to turn the index back into columns.

Syntax

`DataFrame.reset_index(drop=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben"]}, index=[101, 102])
reset = df.reset_index()
print(reset)
```

Important Parameters

- drop.
- level.
- col_level.
- col_fill.

Use When

- Flattening after grouping or reshaping.
- Restoring a clean tabular form.
- Preparing export to CSV or Excel.
- Removing accidental index meaning.

Avoid When

- The index is intentionally part of the model.
- You want to preserve labels only.
- The resulting column name collisions are unresolved.

Gotchas

- The index becomes a column unless dropped.
- MultiIndex flattening can be surprising.
- Generated column names may collide with existing ones.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.reset_index.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.reset_index.html)

## Categorical Dtype

Mental Trigger

I need efficient repeated labels or ordered categories.

Syntax

`Series.astype("category")`

Example

```python
import pandas as pd

s = pd.Series(["low", "medium", "low", "high"])
cat = s.astype("category")
print(cat)
```

Important Parameters

- categories.
- ordered.
- dtype.
- observed.
- copy.

Use When

- Repeating the same labels many times.
- Defining ordered levels.
- Reducing memory use.
- Grouping or sorting discrete states.

Avoid When

- Labels are all unique.
- Category order is unknown and important.
- You need free-text values.

Gotchas

- Unseen categories can behave differently in merges or comparisons.
- Ordering must be explicit if it matters.
- Category codes are not the same as labels.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Categorical.html](https://pandas.pydata.org/docs/reference/api/pandas.Categorical.html)

## Efficient Filtering

Mental Trigger

I need faster, cleaner row selection on large tables.

Syntax

`mask = (df["col"] >= value) & (df["other"].isin(items))`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "score": [91, 84, 77, 88],
    "team": ["A", "B", "A", "C"]
})
mask = (df["score"] >= 85) & (df["team"].isin(["A", "C"]))
print(df.loc[mask])
```

Important Parameters

- boolean masks.
- isin.
- query.
- precomputed masks.
- dtype.

Use When

- Reusing the same filter multiple times.
- Avoiding row-wise Python loops.
- Combining membership and threshold checks.
- Filtering before joins or groupby.

Avoid When

- Readability suffers from overly complex masks.
- You need expression parsing from text.
- The logic is really row-wise custom Python.

Gotchas

- Parentheses are required for compound conditions.
- `.isin()` is typically better than chained equality checks.
- Boolean masks can consume significant memory.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.isin.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.isin.html)

## Avoid Iterrows

Mental Trigger

I am about to loop over rows.

Syntax

`for row in df.itertuples(index=False): ...`

Example

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
total = 0
for row in df.itertuples(index=False):
    total += row.a + row.b
print(total)
```

Important Parameters

- index.
- name.
- columns.
- itertuples.
- vectorization.

Use When

- You truly need sequential row processing.
- A vectorized solution is not practical.
- You want a faster row iterator than `iterrows`.

Avoid When

- A vectorized expression can solve the problem.
- You need reliable dtypes from row objects.
- You are using row loops for simple arithmetic.

Gotchas

- `iterrows()` returns Series rows and is slow.
- `itertuples()` is usually faster and preserves names better.
- Iteration should be the exception, not the default.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iterrows.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iterrows.html)

## Save CSV

Mental Trigger

I need to export a table as CSV.

Syntax

`DataFrame.to_csv(path_or_buf, index=True, encoding=None, na_rep='', columns=None)`

Example

```python
import pandas as pd
import tempfile
import os

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
path = tempfile.mktemp(suffix=".csv")
df.to_csv(path, index=False)
print(pd.read_csv(path))
os.remove(path)
```

Important Parameters

- path_or_buf.
- index.
- encoding.
- na_rep.
- columns.

Use When

- Sharing data with external systems.
- Creating audit artifacts.
- Exporting analysis results.
- Moving data into simple pipelines.

Avoid When

- You need schema preservation and typed storage.
- The data is huge and CSV is too slow or large.
- Nested types matter.

Gotchas

- Index is written unless disabled.
- CSV does not preserve dtypes well.
- Delimiters and encoding should be chosen deliberately.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_csv.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_csv.html)

## Save Excel

Mental Trigger

I need to export a DataFrame to an Excel workbook.

Syntax

`DataFrame.to_excel(excel_writer, sheet_name='Sheet1', index=True, columns=None, engine=None)`

Example

```python
import pandas as pd
import tempfile
import os

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
path = tempfile.mktemp(suffix=".xlsx")
df.to_excel(path, index=False)
print(pd.read_excel(path))
os.remove(path)
```

Important Parameters

- excel_writer.
- sheet_name.
- index.
- columns.
- engine.

Use When

- Producing business-friendly exports.
- Creating multi-sheet reports.
- Sending tables to spreadsheet users.
- Formatting deliverables in common office workflows.

Avoid When

- You need typed, compact, machine-oriented storage.
- CSV or Parquet is sufficient.
- Workbook size becomes unwieldy.

Gotchas

- Requires optional Excel writer dependencies.
- Formatting options are not the same as full Excel authoring.
- Index export is on by default.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_excel.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_excel.html)

## Save Parquet

Mental Trigger

I need efficient persisted tabular storage.

Syntax

`DataFrame.to_parquet(path, engine=None, compression='snappy', index=None)`

Example

```python
import pandas as pd
import tempfile
import os

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
path = tempfile.mktemp(suffix=".parquet")
df.to_parquet(path, index=False)
print(pd.read_parquet(path))
os.remove(path)
```

Important Parameters

- path.
- engine.
- compression.
- index.
- partition_cols.

Use When

- Storing analytical datasets compactly.
- Preserving types across reloads.
- Speeding up repeated reads.
- Building data lake pipelines.

Avoid When

- Humans need to inspect or edit the file directly.
- Missing backend support is an issue.
- The workflow expects text interchange.

Gotchas

- Backend and compression choices matter.
- Index handling should be explicit.
- Parquet is not ideal for manual debugging.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_parquet.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_parquet.html)

## Save JSON

Mental Trigger

I need to export records as JSON.

Syntax

`DataFrame.to_json(path_or_buf=None, orient=None, lines=False, date_format=None)`

Example

```python
import pandas as pd
import tempfile
import os

df = pd.DataFrame({"name": ["Ava", "Ben"], "score": [91, 84]})
path = tempfile.mktemp(suffix=".json")
df.to_json(path, orient="records", lines=True)
print(pd.read_json(path, lines=True))
os.remove(path)
```

Important Parameters

- path_or_buf.
- orient.
- lines.
- date_format.
- force_ascii.

Use When

- Producing API-style output.
- Writing log-friendly newline-delimited JSON.
- Exchanging nested-ish records.
- Feeding JSON-based systems.

Avoid When

- Columnar performance matters more.
- The consumer expects schema-rich storage.
- The file will be read mostly by humans.

Gotchas

- `orient` must match reader expectations.
- Datetime formatting can differ from source.
- JSON is less compact and typed than Parquet.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html)

## Grouped Aggregation with Multiple Metrics

Mental Trigger

I need more than one summary metric per group.

Syntax

`DataFrame.groupby(by).agg({"col": ["mean", "max"]})`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "A", "B"],
    "score": [91, 84, 77]
})
result = df.groupby("team").agg(mean_score=("score", "mean"), max_score=("score", "max"))
print(result)
```

Important Parameters

- named aggregation.
- multiple functions.
- as_index.
- observed.
- sort.

Use When

- Building reporting datasets.
- Producing compact KPI tables.
- Comparing multiple metrics at once.
- Reducing repeated scans.

Avoid When

- A single summary metric is enough.
- Downstream code cannot handle MultiIndex outputs.
- Readability is more important than compactness.

Gotchas

- Old-style aggregation can create awkward column indexes.
- Named aggregation is usually clearer.
- Function names become part of output labels.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.agg.html](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.agg.html)

## Convert Categorical to Codes

Mental Trigger

I need numeric codes for category levels.

Syntax

`Series.cat.codes`

Example

```python
import pandas as pd

s = pd.Series(["low", "medium", "low", "high"], dtype="category")
print(s.cat.codes)
```

Important Parameters

- categories.
- ordered.
- codes.
- dtype.
- categories ordering.

Use When

- Compressing repeated labels.
- Building ordinal features.
- Interfacing with systems needing integer codes.
- Checking internal category order.

Avoid When

- You need human-readable values.
- The category order is not stable.
- Loss of label meaning would be dangerous.

Gotchas

- Codes are not portable without categories.
- Missing values get code `-1`.
- Reordering categories changes codes.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.cat.codes.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.cat.codes.html)

## Efficient Numeric Operations

Mental Trigger

I need speed and scalability for column math.

Syntax

`df["x"] = df["a"].to_numpy() + df["b"].to_numpy()`

Example

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
df["sum"] = df["a"] + df["b"]
print(df)
```

Important Parameters

- vectorized ops.
- to_numpy.
- dtype.
- alignment.
- broadcasting.

Use When

- Performing repeated arithmetic on large tables.
- Avoiding Python-level loops.
- Keeping transformations simple and explicit.
- Building feature columns.

Avoid When

- You need custom per-row Python logic.
- Alignment across indexes is unclear.
- You are converting to NumPy too early without need.

Gotchas

- NumPy conversion drops index alignment.
- Vectorized pandas ops often preserve labels safely.
- Object dtype severely reduces performance.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_numpy.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_numpy.html)

## Missing Data Interpolation

Mental Trigger

I need to estimate missing numeric values from neighbors.

Syntax

`DataFrame.interpolate(method='linear', axis=0, limit_direction=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"value": [1.0, None, 3.0, None, 5.0]})
print(df.interpolate())
```

Important Parameters

- method.
- axis.
- limit_direction.
- limit_area.
- order.

Use When

- Filling gaps in ordered numeric data.
- Smoothing sampled measurements.
- Preparing time-like sequences.
- Using a principled gap estimate.

Avoid When

- Missing values are categorical.
- There is no ordering assumption.
- You need exact factual values only.

Gotchas

- Interpolation assumes structure in the ordering.
- Not all dtypes support every method.
- Overuse can invent misleading data.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.interpolate.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.interpolate.html)

## Time Delta Arithmetic

Mental Trigger

I need durations between timestamps.

Syntax

`df["delta"] = df["end"] - df["start"]`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "start": pd.to_datetime(["2026-01-01", "2026-01-03"]),
    "end": pd.to_datetime(["2026-01-02", "2026-01-06"])
})
df["delta"] = df["end"] - df["start"]
print(df)
```

Important Parameters

- timestamp columns.
- timezone.
- freq.
- normalize.
- unit.

Use When

- Measuring elapsed time.
- Computing SLAs.
- Building latency features.
- Comparing event intervals.

Avoid When

- One side is not datetime-like.
- Timezone semantics are inconsistent.
- You need calendar-aware business logic instead of raw durations.

Gotchas

- Results are timedeltas, not numbers.
- Timezone mismatches can error.
- Conversion to hours or days may be needed explicitly.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html)

## MultiIndex Basics

Mental Trigger

I need hierarchical labels on rows or columns.

Syntax

`DataFrame.set_index(["a", "b"])`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "A", "B"],
    "quarter": ["Q1", "Q2", "Q1"],
    "score": [91, 84, 77]
})
mi = df.set_index(["team", "quarter"])
print(mi)
```

Important Parameters

- keys.
- append.
- drop.
- verify_integrity.
- names.

Use When

- Representing hierarchical dimensions.
- Preparing advanced reshaping.
- Storing grouped output cleanly.
- Handling nested labels.

Avoid When

- Simpler flat columns are enough.
- The hierarchy is unstable.
- Downstream systems expect flat schemas.

Gotchas

- MultiIndex adds complexity quickly.
- Resetting often becomes necessary.
- Label-based selection is more subtle.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.MultiIndex.html](https://pandas.pydata.org/docs/reference/api/pandas.MultiIndex.html)

## Export Selected Columns

Mental Trigger

I need a clean subset for downstream use.

Syntax

`df[cols].to_csv(...)`

Example

```python
import pandas as pd
import tempfile
import os

df = pd.DataFrame({"name": ["Ava"], "score": [^91], "temp": [^1]})
path = tempfile.mktemp(suffix=".csv")
df[["name", "score"]].to_csv(path, index=False)
print(pd.read_csv(path))
os.remove(path)
```

Important Parameters

- selected columns.
- index.
- encoding.
- na_rep.
- header.

Use When

- Exporting only approved fields.
- Minimizing file size.
- Publishing controlled extracts.
- Avoiding accidental sensitive data.

Avoid When

- You need the full source schema.
- The column set is not explicit.
- Schema validation should happen earlier.

Gotchas

- Selection order is preserved.
- Missing columns raise errors.
- Export does not validate business meaning.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_csv.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_csv.html)

## Nullable Integer Dtype

Mental Trigger

I need integers that can still hold missing values.

Syntax

`Series.astype("Int64")`

Example

```python
import pandas as pd

s = pd.Series([1, None, 3], dtype="Int64")
print(s)
print(s.dtype)
```

Important Parameters

- dtype.
- missing values.
- copy.
- errors.
- storage.

Use When

- Keeping integer semantics with nulls.
- Avoiding float upcasting.
- Modeling IDs or counts with missingness.
- Standardizing schema cleanliness.

Avoid When

- You do not need null support.
- A plain float is acceptable.
- Downstream tools do not understand extension dtypes.

Gotchas

- `Int64` is pandas nullable integer, not NumPy int64.
- `pd.NA` behavior differs from `NaN`.
- Arithmetic can propagate nullable results.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.IntegerArray.html](https://pandas.pydata.org/docs/reference/api/pandas.IntegerArray.html)

Below is the remaining task draft in the same AENS package format, extending the Pandas package coverage toward the requested 70–80 high-value workflows. The entries stay aligned with current official pandas 3.0.4 API pages and implementation details from the reference docs. [pandas.pydata](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html)

# Detect Duplicate Rows

Mental Trigger

I need a boolean mask for repeated records before cleaning.

Syntax

`DataFrame.duplicated(subset=None, keep='first')`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "brand": ["Yum Yum", "Yum Yum", "Indomie"],
    "style": ["cup", "cup", "pack"],
    "rating": [4.0, 4.0, 3.5]
})
print(df.duplicated())
```

Important Parameters

- subset.
- keep.
- first.
- last.
- False.

Use When

- Auditing repeated rows.
- Marking records for removal.
- Detecting duplicate keys.
- Pre-checking joins and imports.

Avoid When

- Duplicate meaning requires custom business logic.
- You only need the deduplicated result.
- Exact row equality is not the correct definition.

Gotchas

- The first duplicate is usually marked False.
- `keep=False` marks all duplicates True.
- Null handling can still be non-obvious.
- Subset changes the duplication definition.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html) [pandas.pydata](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html)

# Select Duplicate Labels

Mental Trigger

I need to find repeated index labels or column labels.

Syntax

`Index.duplicated(keep='first')`

Example

```python
import pandas as pd

idx = pd.Index(["a", "a", "b", "c", "c"])
print(idx.duplicated())
```

Important Parameters

- keep.
- first.
- last.
- False.
- index values.

Use When

- Auditing repeated index labels.
- Detecting accidental duplicate column names.
- Validating reshape or join assumptions.
- Debugging label-based ambiguity.

Avoid When

- You are checking row equality instead of labels.
- The table has no index relevance.
- You need row-level deduplication.

Gotchas

- Label duplication is different from row duplication.
- Duplicate labels can break downstream assumptions.
- Keep behavior matches other duplicated APIs.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Index.duplicated.html](https://pandas.pydata.org/docs/reference/api/pandas.Index.duplicated.html)

# Find Non-Null Rows

Mental Trigger

I need only rows or values that are present.

Syntax

`DataFrame.notna()`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", None], "score": [91, None]})
print(df.notna())
```

Important Parameters

- none.

Use When

- Building presence masks.
- Filtering complete values.
- Combining with null-handling logic.
- Auditing sparse columns.

Avoid When

- You need a replacement strategy.
- Missingness itself is the key signal.
- The data uses custom sentinels instead of nulls.

Gotchas

- It is the logical inverse of `isna`.
- Boolean masks still need careful alignment.
- Nullable dtypes can behave differently than plain NumPy values.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.notna.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.notna.html)

# Forward Fill Missing Data

Mental Trigger

I need to carry the last known value forward.

Syntax

`DataFrame.ffill(axis=None, inplace=False, limit=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"value": [1, None, None, 4]})
print(df.ffill())
```

Important Parameters

- axis.
- inplace.
- limit.
- downcast.
- limit_area.

Use When

- Filling time-ordered records.
- Propagating last observation.
- Repairing short gaps in sequences.
- Preparing stateful datasets.

Avoid When

- Missing values should remain missing.
- The order is not meaningful.
- Forward propagation would create misleading data.

Gotchas

- Order matters a lot.
- Long runs of missing values can persist with limit.
- It is not suitable for arbitrary categorical imputation.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.ffill.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.ffill.html)

# Backward Fill Missing Data

Mental Trigger

I need to carry the next known value backward.

Syntax

`DataFrame.bfill(axis=None, inplace=False, limit=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"value": [None, None, 3, 4]})
print(df.bfill())
```

Important Parameters

- axis.
- inplace.
- limit.
- downcast.
- limit_area.

Use When

- Filling leading gaps.
- Looking ahead to the next valid record.
- Cleaning short time-series gaps.
- Preparing datasets where future state is acceptable.

Avoid When

- Future values should not influence current records.
- The order is not meaningful.
- You need a safer business rule than look-ahead fill.

Gotchas

- It uses following values, not previous ones.
- The fill direction can be easy to confuse with `ffill`.
- Overuse can leak future information in modeling.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.bfill.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.bfill.html)

# Drop Index Duplicates

Mental Trigger

I need unique index labels.

Syntax

`Index.drop_duplicates(keep='first')`

Example

```python
import pandas as pd

idx = pd.Index(["a", "a", "b", "c", "c"])
print(idx.drop_duplicates())
```

Important Parameters

- keep.
- first.
- last.
- False.

Use When

- Cleaning repeated labels.
- Preparing a stable index.
- Auditing accidental reindexing.
- Simplifying hierarchical structures.

Avoid When

- You need to preserve duplicate labels.
- The problem is row-level duplicate records.
- Index uniqueness is not needed.

Gotchas

- This affects labels, not record values.
- Duplicate labels can be legitimate in some workflows.
- Keep strategy changes which label survives.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Index.drop_duplicates.html](https://pandas.pydata.org/docs/reference/api/pandas.Index.drop_duplicates.html)

# Set Column as Nullable Integer

Mental Trigger

I need integers with missing values preserved cleanly.

Syntax

`Series.astype("Int64")`

Example

```python
import pandas as pd

s = pd.Series([1, None, 3], dtype="Int64")
print(s)
print(s.dtype)
```

Important Parameters

- dtype.
- missing values.
- copy.
- errors.
- nullable integer dtype.

Use When

- IDs or counts may be missing.
- You want integer semantics without float upcasting.
- Building clean schema for downstream systems.
- Avoiding object dtype for sparse integers.

Avoid When

- Missing values are impossible.
- Downstream tools cannot handle pandas extension dtypes.
- Float representation is acceptable.

Gotchas

- `Int64` is pandas nullable integer, not NumPy int64.
- `pd.NA` behavior differs from `NaN`.
- Arithmetic propagates nullable results.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.IntegerArray.html](https://pandas.pydata.org/docs/reference/api/pandas.IntegerArray.html)

# Convert to NumPy Array

Mental Trigger

I need raw array values for NumPy-compatible code.

Syntax

`DataFrame.to_numpy(dtype=None, copy=False, na_value=<no_default>)`

Example

```python
import pandas as pd

df = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
print(df.to_numpy())
```

Important Parameters

- dtype.
- copy.
- na_value.
- ndarray conversion.
- common dtype.

Use When

- Passing data to NumPy APIs.
- Running numerical kernels.
- Dropping labels intentionally.
- Interfacing with libraries expecting arrays.

Avoid When

- Index/column labels matter.
- Alignment must be preserved.
- Mixed dtypes would become object arrays and hurt performance.

Gotchas

- Labels are lost.
- Mixed dtypes can force object output.
- `copy=False` does not guarantee a view.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_numpy.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_numpy.html) [pandas.pydata](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_numpy.html)

# Transpose DataFrame

Mental Trigger

I need to flip rows and columns.

Syntax

`DataFrame.transpose(*args, copy=<no_default>)`

Example

```python
import pandas as pd

df = pd.DataFrame({"col1": [1, 2], "col2": [3, 4]})
print(df.transpose())
```

Important Parameters

- args.
- copy.
- mixed dtype behavior.
- extension types.
- returned object.

Use When

- Inspecting a small wide table.
- Re-orienting a matrix-like table.
- Comparing fields across rows.
- Swapping axis interpretation.

Avoid When

- The table is large.
- Mixed dtypes matter.
- Downstream code depends on the original orientation.

Gotchas

- Mixed dtypes typically become object dtype.
- A new object is returned.
- The `copy` keyword is ignored in pandas 3.0 and later.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.transpose.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.transpose.html) [pandas.pydata](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.transpose.html)

# DataFrame Property T

Mental Trigger

I need the shorthand transpose accessor.

Syntax

`DataFrame.T`

Example

```python
import pandas as pd

df = pd.DataFrame({"col1": [1, 2], "col2": [3, 4]})
print(df.T)
```

Important Parameters

- none.

Use When

- Quick transpose access.
- Inspecting a small matrix.
- Writing concise exploratory code.

Avoid When

- Readability benefits from the explicit method call.
- You need to emphasize copy or method semantics.
- Data is large and transposition is expensive.

Gotchas

- It is the property form of transpose.
- Behavior matches `transpose()`.
- Mixed dtypes can coerce to object.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.T.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.T.html) [pandas.pydata](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.T.html)

# Select by Datetime Index

Mental Trigger

I need a time slice from a datetime-indexed table.

Syntax

`df.loc[start:end]`

Example

```python
import pandas as pd

df = pd.DataFrame(
    {"value": [10, 20, 30]},
    index=pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-03"])
)
print(df.loc["2026-01-02":"2026-01-03"])
```

Important Parameters

- start.
- end.
- sorted index.
- timezone.
- label-based slicing.

Use When

- Slicing time-series data.
- Getting reporting periods.
- Filtering calendar windows.
- Working with timestamp indexes.

Avoid When

- The index is not datetime-like.
- The index is unsorted and semantics are unclear.
- A column-based filter is simpler.

Gotchas

- Label slicing is inclusive.
- Sorting affects expectations.
- Timezone-aware and naive timestamps should not be mixed casually.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)

# Set Ordered Categories

Mental Trigger

I need category order to control comparisons and sorting.

Syntax

`Series.astype(CategoricalDtype(categories=[...], ordered=True))`

Example

```python
import pandas as pd
from pandas.api.types import CategoricalDtype

cat_type = CategoricalDtype(categories=["low", "medium", "high"], ordered=True)
s = pd.Series(["high", "low", "medium"], dtype=cat_type)
print(s.sort_values())
```

Important Parameters

- categories.
- ordered.
- dtype.
- copy.
- category order.

Use When

- Priority or severity levels matter.
- Sorting should follow business order.
- Category comparison must be consistent.
- Building categorical features with stable order.

Avoid When

- Order is not meaningful.
- Labels change frequently.
- Free-text fields should remain unconstrained.

Gotchas

- Unseen values become missing on conversion.
- Ordering changes comparison behavior.
- Category definitions must stay stable across pipelines.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.CategoricalDtype.html](https://pandas.pydata.org/docs/reference/api/pandas.CategoricalDtype.html)

# Drop Rows by Index

Mental Trigger

I need to remove known index labels.

Syntax

`DataFrame.drop(index=labels, errors='raise')`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", "Ben", "Chen"]}, index=[101, 102, 103])
print(df.drop(index=[102]))
```

Important Parameters

- index.
- labels.
- errors.
- inplace.
- level.

Use When

- Removing specific bad records.
- Dropping stale index keys.
- Pruning validation rows.
- Cleaning known labels.

Avoid When

- Condition-based filtering is needed.
- You are removing by position instead of label.
- The index is not meaningful.

Gotchas

- Index labels are not positions.
- Missing labels may raise unless configured otherwise.
- Copy behavior still depends on context.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html)

# Rename Index Labels

Mental Trigger

I need to rename row labels without changing values.

Syntax

`DataFrame.rename(index=None, columns=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"score": [91, 84]}, index=["r1", "r2"])
print(df.rename(index={"r1": "row1", "r2": "row2"}))
```

Important Parameters

- index.
- columns.
- inplace.
- errors.
- copy.

Use When

- Making row labels readable.
- Standardizing imported indexes.
- Aligning label conventions.
- Renaming both axes consistently.

Avoid When

- You need to change the data, not labels.
- The index has no semantic meaning.
- Downstream systems rely on original labels.

Gotchas

- Only labels change.
- Duplicate labels can remain confusing.
- Behavior with `inplace` should not be treated as a shortcut.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rename.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rename.html)

# Duplicate Row Mask by Subset

Mental Trigger

I need duplicates defined by only a few columns.

Syntax

`DataFrame.duplicated(subset=[...], keep='first')`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "brand": ["Yum Yum", "Yum Yum", "Indomie", "Indomie"],
    "style": ["cup", "cup", "cup", "pack"],
    "rating": [4.0, 4.0, 3.5, 5.0]
})
print(df.duplicated(subset=["brand", "style"]))
```

Important Parameters

- subset.
- keep.
- first.
- last.
- False.

Use When

- Duplicate meaning is key-based, not full-row.
- De-duplicating by business key.
- Auditing upstream ingestion.
- Validating uniqueness assumptions.

Avoid When

- You need full-row duplicate detection.
- The subset is not a valid business identity.
- You need all duplicates removed immediately.

Gotchas

- Subset choice changes the result dramatically.
- `keep=False` can mark everything in a duplicate group.
- Sorting may matter before deduplication.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html) [pandas.pydata](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html)

# Remove Duplicate Rows by Key

Mental Trigger

I need the unique records for a business key.

Syntax

`DataFrame.drop_duplicates(subset=[...], keep='first')`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "brand": ["Yum Yum", "Yum Yum", "Indomie"],
    "style": ["cup", "cup", "pack"],
    "rating": [4.0, 4.0, 3.5]
})
print(df.drop_duplicates(subset=["brand", "style"]))
```

Important Parameters

- subset.
- keep.
- first.
- last.
- ignore_index.

Use When

- Consolidating repeated ingests.
- Keeping one record per key.
- Cleaning duplicated fact tables.
- Preparing reference tables.

Avoid When

- Duplicate resolution requires ranking or timestamps.
- The key definition is unstable.
- You need to inspect duplicates before removal.

Gotchas

- Key order affects output only indirectly.
- NaNs are treated consistently with pandas duplicate logic.
- `keep='last'` can be more appropriate after sorting.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html)

# Remove Duplicate Index Labels

Mental Trigger

I need index labels to be unique.

Syntax

`Index.drop_duplicates(keep='first')`

Example

```python
import pandas as pd

idx = pd.Index(["a", "a", "b", "c", "c"])
print(idx.drop_duplicates())
```

Important Parameters

- keep.
- first.
- last.
- False.
- index values.

Use When

- Cleaning repeated labels.
- Simplifying repeated index structure.
- Preparing unique lookup keys.
- Auditing label quality.

Avoid When

- Duplicate labels are intentionally allowed.
- Row values are the real problem.
- You need to preserve repeated positions.

Gotchas

- This is label-level, not row-level, cleaning.
- Results depend on keep strategy.
- Duplicate labels can be valid in some analyses.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Index.drop_duplicates.html](https://pandas.pydata.org/docs/reference/api/pandas.Index.drop_duplicates.html)

# Check Non-Null Values

Mental Trigger

I need a presence mask for valid data.

Syntax

`DataFrame.notna()`

Example

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ava", None], "score": [91, None]})
print(df.notna())
```

Important Parameters

- none.

Use When

- Selecting non-missing rows.
- Validating completeness.
- Combining with boolean logic.
- Counting present observations.

Avoid When

- Missingness is the focus.
- You want imputation instead of a mask.
- The table uses domain-specific sentinels.

Gotchas

- It is the inverse of `isna`.
- Boolean alignment still matters.
- Nullable types may produce different scalar behavior.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.notna.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.notna.html)

# Forward Fill Values

Mental Trigger

I need the last valid observation carried forward.

Syntax

`DataFrame.ffill(axis=None, inplace=False, limit=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"value": [1, None, None, 4]})
print(df.ffill())
```

Important Parameters

- axis.
- inplace.
- limit.
- downcast.
- limit_area.

Use When

- Filling time-ordered data.
- Carrying state forward.
- Repairing short gaps.
- Preparing streaming-style records.

Avoid When

- Future values must not influence current records.
- The order is meaningless.
- Long gaps should remain visible.

Gotchas

- Order is critical.
- `limit` restricts propagation.
- It may create misleading continuity if overused.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.ffill.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.ffill.html)

# Backward Fill Values

Mental Trigger

I need the next valid observation carried backward.

Syntax

`DataFrame.bfill(axis=None, inplace=False, limit=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"value": [None, None, 3, 4]})
print(df.bfill())
```

Important Parameters

- axis.
- inplace.
- limit.
- downcast.
- limit_area.

Use When

- Filling leading gaps.
- Backfilling sparse sequences.
- Repairing short missing stretches.
- Using next-observation carryback.

Avoid When

- Future leakage is unacceptable.
- The order is not meaningful.
- You need conservative missing handling.

Gotchas

- It uses subsequent values.
- Easy to confuse with forward fill.
- Can leak future information into earlier records.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.bfill.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.bfill.html)

# Interpolate Missing Numbers

Mental Trigger

I need estimated values between known numeric points.

Syntax

`DataFrame.interpolate(method='linear', axis=0, limit_direction=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"value": [1.0, None, 3.0, None, 5.0]})
print(df.interpolate())
```

Important Parameters

- method.
- axis.
- limit_direction.
- limit_area.
- order.

Use When

- Estimating numeric gaps.
- Smoothing sampled sequences.
- Filling ordered measurement data.
- Preparing time-like data.

Avoid When

- The values are categorical.
- There is no meaningful ordering.
- Inventing values would be risky.

Gotchas

- Assumes structure in the ordering.
- Can produce misleading values.
- Method support varies by dtype and shape.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.interpolate.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.interpolate.html)

# Extract Array From Series

Mental Trigger

I need raw values from a Series for NumPy code.

Syntax

`Series.to_numpy(dtype=None, copy=False, na_value=<no_default>)`

Example

```python
import pandas as pd

s = pd.Series([1, 2, 3])
print(s.to_numpy())
```

Important Parameters

- dtype.
- copy.
- na_value.
- ndarray conversion.
- labels lost.

Use When

- Calling NumPy or SciPy functions.
- Using label-free numerical operations.
- Passing arrays to ML code.
- Optimizing simple numeric kernels.

Avoid When

- Index alignment matters.
- Labels must be preserved.
- Mixed dtypes would become object arrays.

Gotchas

- Labels are dropped.
- Mixed types can force object output.
- `copy=False` does not guarantee zero-copy.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.to_numpy.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.to_numpy.html)

# Create Indicator Column

Mental Trigger

I need a boolean or flag column derived from logic.

Syntax

`df["flag"] = condition`

Example

```python
import pandas as pd

df = pd.DataFrame({"score": [91, 84, 77]})
df["pass"] = df["score"] >= 85
print(df)
```

Important Parameters

- condition.
- vectorization.
- dtype.
- alignment.
- broadcasting.

Use When

- Adding rule-based features.
- Building segmentation flags.
- Preparing filters for later use.
- Encoding threshold logic.

Avoid When

- The logic is row-wise Python.
- The condition depends on side effects.
- You need a temporary mask only.

Gotchas

- Boolean columns can be nullable.
- Alignment matters if condition comes from another object.
- Chained assignment can still cause confusion.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)

# Apply Row Wise Logic

Mental Trigger

I need custom logic across each row and vectorization is not enough.

Syntax

`DataFrame.apply(func, axis=1)`

Example

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [10, 20]})
print(df.apply(lambda r: r["a"] + r["b"], axis=1))
```

Important Parameters

- func.
- axis.
- raw.
- result_type.
- by_row.

Use When

- The transformation truly depends on multiple columns.
- A vectorized expression is impractical.
- You need quick prototyping of row logic.

Avoid When

- A vectorized expression exists.
- Performance matters significantly.
- The logic can be expressed by column operations.

Gotchas

- Row-wise apply is slow.
- Dtype handling can be awkward.
- Output shape may be surprising.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html)

# Iterate as Tuples

Mental Trigger

I need a row iterator and care about speed.

Syntax

`DataFrame.itertuples(index=False)`

Example

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
for row in df.itertuples(index=False):
    print(row.a + row.b)
```

Important Parameters

- index.
- name.
- columns.
- tuples.
- namedtuple behavior.

Use When

- Sequential processing is unavoidable.
- You need better performance than `iterrows`.
- You want row access with named fields.

Avoid When

- Vectorization is possible.
- You need guaranteed pandas dtypes per row.
- Row loops are being used for simple arithmetic.

Gotchas

- Still slower than vectorized operations.
- `iterrows()` is usually worse.
- Named tuples are not full DataFrame rows.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.itertuples.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.itertuples.html)

# Filter by Membership

Mental Trigger

I need rows where values belong to a set.

Syntax

`Series.isin(values)`

Example

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "B", "A", "C"]})
print(df[df["team"].isin(["A", "C"])])
```

Important Parameters

- values.
- set-like input.
- iterable.
- membership.
- boolean mask.

Use When

- Filtering allowed categories.
- Matching a shortlist of keys.
- Applying inclusion rules.
- Building cohort subsets.

Avoid When

- Substring matching is intended.
- Pattern matching is needed.
- The value list is enormous and unmanaged.

Gotchas

- It checks exact membership, not partial matches.
- Missing values are not in the set.
- Often faster and clearer than long OR chains.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.isin.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.isin.html)

# Replace by Mapping

Mental Trigger

I need a dictionary-driven one-to-one remap.

Syntax

`Series.map(mapping)`

Example

```python
import pandas as pd

s = pd.Series(["A", "B", "A"])
print(s.map({"A": "Apple", "B": "Banana"}))
```

Important Parameters

- mapping.
- function.
- na_action.
- dict lookup.
- missing keys.

Use When

- Translating codes to labels.
- Replacing values with a lookup table.
- Building readable categories.
- Performing compact remaps.

Avoid When

- Many-to-one logic is needed.
- You need conditions rather than lookups.
- Missing keys should stay unchanged without extra handling.

Gotchas

- Missing mappings become NaN.
- Function and dict behavior differ.
- It is a Series operation, not a DataFrame-wide general rewrite.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html)

# Create New Columns

Mental Trigger

I need a clean chained way to build derived fields.

Syntax

`DataFrame.assign(new_col=lambda df: ...)`

Example

```python
import pandas as pd

df = pd.DataFrame({"score": [91, 84, 77]})
print(df.assign(pass_fail=lambda x: x["score"] >= 85))
```

Important Parameters

- kwargs.
- callable values.
- return new frame.
- chaining.
- column creation order.

Use When

- Building transformation pipelines.
- Creating multiple derived columns.
- Avoiding temporary variables.
- Keeping code readable.

Avoid When

- You need mutation for side effects.
- The logic is too complex for chaining.
- You are modifying a view with unclear ownership.

Gotchas

- Returns a new DataFrame.
- Later columns can depend on earlier ones.
- Callable receives the whole frame.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html)

# Vectorized Column Math

Mental Trigger

I need column-wise arithmetic at scale.

Syntax

`df["new"] = df["a"] + df["b"]`

Example

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
df["total"] = df["a"] + df["b"]
print(df)
```

Important Parameters

- operands.
- alignment.
- broadcasting.
- dtypes.
- missing values.

Use When

- Computing totals or deltas.
- Building feature columns.
- Replacing loops with expressions.
- Doing repeated arithmetic.

Avoid When

- Row-wise custom Python is necessary.
- Alignment across indexes is uncertain.
- Object dtype is dominating performance.

Gotchas

- Index alignment affects the result.
- Missing values propagate.
- Mixed types can reduce speed and clarity.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)

# Group By Mean and Sum

Mental Trigger

I need a standard grouped reduction.

Syntax

`DataFrame.groupby(by).agg({"col": ["mean", "sum"]})`

Example

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [91, 84, 77]})
print(df.groupby("team").agg(mean_score=("score", "mean"), total_score=("score", "sum")))
```

Important Parameters

- by.
- agg.
- as_index.
- sort.
- observed.

Use When

- Building summary tables.
- Producing reporting metrics.
- Comparing groups quickly.
- Combining multiple reductions.

Avoid When

- You only need one statistic.
- Downstream code cannot handle structured output well.
- Grouping semantics are unclear.

Gotchas

- Named aggregation is usually cleaner.
- Multiple metrics may create hierarchical columns in older styles.
- Categories can affect group presence.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.agg.html](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.agg.html)

# Convert To Categorical

Mental Trigger

I need to compress repeated labels and preserve discrete states.

Syntax

`Series.astype("category")`

Example

```python
import pandas as pd

s = pd.Series(["low", "medium", "low", "high"])
print(s.astype("category"))
```

Important Parameters

- categories.
- ordered.
- copy.
- dtype.
- observed.

Use When

- Repeated string labels appear often.
- Memory reduction matters.
- Sorted or ordered categories are useful.
- Grouping on discrete states.

Avoid When

- Almost every value is unique.
- Ordering is unstable.
- Free-form text should remain free-form.

Gotchas

- Category order matters for comparisons.
- Unseen categories may convert to missing.
- Codes are not meaningful without the category mapping.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Categorical.html](https://pandas.pydata.org/docs/reference/api/pandas.Categorical.html)

# Convert Categorical to Codes

Mental Trigger

I need stable integer codes from categories.

Syntax

`Series.cat.codes`

Example

```python
import pandas as pd

s = pd.Series(["low", "medium", "low", "high"], dtype="category")
print(s.cat.codes)
```

Important Parameters

- categories.
- ordered.
- codes.
- missing value code.
- category order.

Use When

- Feeding integer-only systems.
- Creating ordinal features.
- Inspecting category internals.
- Saving compact state.

Avoid When

- Human readability matters.
- Category order is not stable.
- Codes would be mistaken for meaning.

Gotchas

- Missing values usually map to -1.
- Codes depend on category order.
- Reordering categories changes codes.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.Series.cat.codes.html](https://pandas.pydata.org/docs/reference/api/pandas.Series.cat.codes.html)

# Convert Column To Datetime

Mental Trigger

I need to parse text dates into timestamp values.

Syntax

`pd.to_datetime(arg, errors='raise', utc=False, format=None)`

Example

```python
import pandas as pd

df = pd.DataFrame({"date": ["2026-01-01", "2026-01-15"]})
df["date"] = pd.to_datetime(df["date"])
print(df.dtypes)
```

Important Parameters

- arg.
- errors.
- utc.
- format.
- cache.

Use When

- Preparing time-series data.
- Parsing date strings.
- Standardizing timestamps.
- Enabling date arithmetic.

Avoid When

- Input is already a reliable datetime dtype.
- Invalid dates should remain explicit raw text.
- Mixed or ambiguous formats are uncontrolled.

Gotchas

- Ambiguous strings can parse unexpectedly.
- Timezone behavior matters.
- Parsing rules can differ from naive string assumptions.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html)

# Time Delta Calculations

Mental Trigger

I need elapsed time between two timestamps.

Syntax

`df["end"] - df["start"]`

Example

```python
import pandas as pd

df = pd.DataFrame({
    "start": pd.to_datetime(["2026-01-01", "2026-01-03"]),
    "end": pd.to_datetime(["2026-01-02", "2026-01-06"])
})
df["delta"] = df["end"] - df["start"]
print(df)
```

Important Parameters

- start.
- end.
- timezone.
- unit conversion.
- timedelta output.

Use When

- Measuring latency or duration.
- Computing SLAs.
- Comparing intervals.
- Building recency features.

Avoid When

- One side is not datetime-like.
- Calendar-aware business rules are needed.
- Timezones are inconsistent.

Gotchas

- Output is a Timedelta, not a plain number.
- Timezone mismatch can error.
- Explicit unit conversion may be necessary.

Official Documentation

[https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html)


<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://pandas.pydata.org/docs/getting_started/install.html

[^2]: https://pandas.pydata.org/docs/

[^3]: https://pandas.pydata.org/docs/reference/index.html

[^4]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html

[^5]: https://pandas.pydata.org/docs/reference/api/pandas.Series.html

[^6]: https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html

[^7]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html

[^8]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^9]: CURRENT_PROJECT_STATE_REPORT.md

[^10]: CONTENT_QUALITY_STANDARD.md

[^11]: ARCHITECTURE_FREEZE.md

[^12]: AENS-Knowledge-Layer-Specification.md

[^13]: http://arxiv.org/pdf/2501.08207.pdf

[^14]: https://github.com/pandas-dev/pandas/releases

[^15]: https://pypi.org/project/pandas/

[^16]: https://pandas.pydata.org/pandas-docs/version/1.5.3/getting_started/install.html

[^17]: https://pandas.pydata.org/pandas-docs/stable/whatsnew/v2.2.3.html

[^18]: https://pandas.pydata.org/docs/whatsnew/index.html

[^19]: https://pandas.pydata.org/docs/dev/whatsnew/v2.3.3.html

[^20]: https://zenodo.org/record/3961230/files/pandera.pdf

[^21]: https://arxiv.org/pdf/2001.00888.pdf

[^22]: https://arxiv.org/pdf/2401.15463.pdf

[^23]: https://www.qeios.com/read/GFSQFL/pdf

[^24]: https://arxiv.org/pdf/2312.11122.pdf

[^25]: http://conference.scipy.org/proceedings/scipy2021/pdfs/fred_reiss.pdf

[^26]: https://pandas.pydata.org/docs/dev/reference/api/pandas.DataFrame.__dataframe__.html

[^27]: https://pandas.pydata.org/pandas-docs/version/1.0.1/reference/api/pandas.DataFrame.index.html

[^28]: https://pandas.pydata.org/pandas-docs/version/0.18.1/api.html

[^29]: https://pandas.github.net.cn/docs/reference/api/pandas.DataFrame.html

[^30]: https://pandas.pydata.org/pandas-docs/version/1.0.5/reference/api/pandas.DataFrame.swapaxes.html

[^31]: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.dt.html

[^32]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.T.html

