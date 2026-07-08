<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Pandas Cheatsheet2

## Metadata

| field | value |
| :-- | :-- |
| id | pandas_cheatsheet2 |
| title | Pandas Cheatsheet2 |
| slug | pandas-cheatsheet2 |
| name | Pandas Cheatsheet2 |
| description | Canonical copy-paste cheatsheet for core Pandas syntax and production workflows. |
| package_reference | pandas |
| version | 3.0.4 |
| sources | [Pandas homepage](https://pandas.pydata.org/), [API reference](https://pandas.pydata.org/docs/reference/index.html), [User Guide](https://pandas.pydata.org/docs/user_guide/index.html), [DataFrame API](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html), [Release notes](https://pandas.pydata.org/docs/whatsnew/index.html) |
| created_at | 2026-07-06T19:06:00+06:00 |
| updated_at | 2026-07-06T19:06:00+06:00 |

## Core Objects

| Object | Use | Constructor |
| :-- | :-- | :-- |
| DataFrame | 2D tabular data. | `pd.DataFrame(...)` |
| Series | 1D labeled data. | `pd.Series(...)` |
| Index | Immutable labels. | `pd.Index(...)` |
| RangeIndex | Efficient integer index. | `pd.RangeIndex(...)` |
| MultiIndex | Hierarchical labels. | `pd.MultiIndex.from_frame(...)` |
| DatetimeIndex | Datetime labels. | `pd.DatetimeIndex(...)` |
| TimedeltaIndex | Duration labels. | `pd.TimedeltaIndex(...)` |
| PeriodIndex | Period labels. | `pd.PeriodIndex(...)` |
| Categorical | Finite categories. | `pd.Categorical(...)` |
| NA | Nullable missing sentinel. | `pd.NA` |

## Top-Level Constructors

| API | Typical use |
| :-- | :-- |
| `pd.DataFrame` | Build tabular data. |
| `pd.Series` | Build labeled vectors. |
| `pd.Index` | Build labels. |
| `pd.array` | Build nullable extension arrays. |
| `pd.concat` | Combine objects along an axis. |
| `pd.merge` | Relational joins. |
| `pd.merge_asof` | Nearest-key ordered joins. |
| `pd.merge_ordered` | Ordered merges with optional fill. |
| `pd.date_range` | Regular datetime sequences. |
| `pd.bdate_range` | Business-day datetime sequences. |
| `pd.timedelta_range` | Regular timedelta sequences. |
| `pd.period_range` | Regular period sequences. |
| `pd.interval_range` | Interval sequences. |
| `pd.to_datetime` | Parse datetimes. |
| `pd.to_numeric` | Parse numeric values. |
| `pd.to_timedelta` | Parse durations. |
| `pd.json_normalize` | Flatten nested JSON. |
| `pd.unique` | Unique values. |
| `pd.isna` / `pd.notna` | Missing-value checks. |
| `pd.factorize` | Encode uniques as integer codes. |
| `pd.cut` / `pd.qcut` | Binning. |
| `pd.crosstab` | Frequency tables. |
| `pd.pivot_table` | Aggregated reshaping. |

## Entry 1: Inspect DataFrame

**Problem:** See shape, types, missingness, and sample rows fast.
**Trigger:** You just loaded a dataset and need a first-pass audit.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")

print(df.head())
print(df.tail())
print(df.shape)
print(df.columns)
print(df.dtypes)
print(df.info())
print(df.describe(include="all"))
print(df.isna().sum())
```

**Minimal Notes:** `info()` is the fastest way to check dtypes and non-null counts. `describe(include="all")` gives a broad summary for mixed-type frames.
**Common Bug:** Relying on `head()` only and missing dtype or null issues.
**Official Documentation URL:** [DataFrame.info](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.info.html)

## Entry 2: Load tabular data

**Problem:** Read CSV, Excel, JSON, or Parquet with correct schema and memory efficiency.
**Trigger:** You need production-style ingestion from common file formats.
**Snippet:**

```python
import pandas as pd

csv_df = pd.read_csv(
    "sales.csv",
    usecols=["order_id", "customer_id", "order_date", "amount"],
    dtype={"order_id": "string", "customer_id": "string", "amount": "float64"},
    parse_dates=["order_date"],
    na_values=["", "NA", "null"],
)
excel_df = pd.read_excel("sales.xlsx", sheet_name=0)
json_df = pd.read_json("sales.json", lines=True)
parquet_df = pd.read_parquet("sales.parquet")
```

**Minimal Notes:** Specify `dtype`, `usecols`, and `parse_dates` early to reduce downstream cleanup. Use the format-specific reader instead of converting through CSV.
**Common Bug:** Letting Pandas infer everything and ending up with object dtypes or slow reads.
**Official Documentation URL:** [read_csv](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html)

## Entry 3: Read SQL and write back

**Problem:** Load from or export to a database table.
**Trigger:** Your source of truth is a relational database.
**Snippet:**

```python
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///example.db")

df = pd.read_sql("SELECT order_id, amount FROM sales", engine)
df.to_sql("sales_export", engine, if_exists="replace", index=False)
```

**Minimal Notes:** `read_sql` and `to_sql` are the standard round-trip APIs for database workflows. Prefer explicit column selection and controlled writes.
**Common Bug:** Writing the DataFrame index as an unintended database column.
**Official Documentation URL:** [read_sql](https://pandas.pydata.org/docs/reference/api/pandas.read_sql.html)

## Entry 4: Inspect values and sample rows

**Problem:** Check representative records, value distribution, and row counts.
**Trigger:** You need a quick data sanity check.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")

sample = df.sample(n=5, random_state=42)
print(df["status"].value_counts(dropna=False))
print(df["customer_id"].nunique(dropna=True))
print(df["status"].mode())
```

**Minimal Notes:** `sample` is useful for spot-checking records. `value_counts()` and `nunique()` are fast for distribution checks.
**Common Bug:** Sampling without `random_state` and getting non-reproducible results.
**Official Documentation URL:** [DataFrame.sample](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sample.html)

## Entry 5: Select columns

**Problem:** Keep only the columns you need.
**Trigger:** You want a smaller working frame.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
subset = df[["order_id", "amount"]]
```

**Minimal Notes:** Column selection is the simplest way to reduce memory and focus operations.
**Common Bug:** Using a single bracket and accidentally selecting a Series.
**Official Documentation URL:** [DataFrame.__getitem__](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.__getitem__.html)

## Entry 6: Select with loc, iloc, at, iat

**Problem:** Use label-based or position-based indexing precisely.
**Trigger:** You need row/column slices or scalar access.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [10, 20, 30], "b": [100, 200, 300]}, index=["x", "y", "z"])

label_slice = df.loc["x":"y", ["a", "b"]]
pos_slice = df.iloc[0:2, 0:1]
scalar_label = df.at["y", "a"]
scalar_pos = df.iat[1, 0]
```

**Minimal Notes:** `loc` is label-based and inclusive on slices; `iloc` is position-based. Use `at` and `iat` for scalar reads/writes.
**Common Bug:** Mixing label and position semantics or assuming `iloc` accepts labels.
**Official Documentation URL:** [DataFrame.loc](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)

## Entry 7: Query rows with expressions

**Problem:** Filter with readable boolean expressions.
**Trigger:** You want SQL-like row filtering.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"amount": [50, 200, 150], "status": ["paid", "paid", "open"]})
high_value = df.query("amount > 100 and status == 'paid'")
```

**Minimal Notes:** `query` keeps chained filters easier to read. It is especially useful for compact business rules.
**Common Bug:** Forgetting that `query` still obeys Python operator precedence inside expressions.
**Official Documentation URL:** [DataFrame.query](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.query.html)

## Entry 8: Boolean helpers and range filters

**Problem:** Filter by membership or numeric range.
**Trigger:** You need set-based or interval-based selection.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"score": [10, 35, 70], "status": ["new", "paid", "open"]})
filtered = df[df["status"].isin(["paid", "open"]) & df["score"].between(20, 80)]
```

**Minimal Notes:** `isin` and `between` are vectorized and easy to read.
**Common Bug:** Using chained comparisons incorrectly with Series objects.
**Official Documentation URL:** [Series.isin](https://pandas.pydata.org/docs/reference/api/pandas.Series.isin.html)

## Entry 9: Filter by time window

**Problem:** Select rows by clock time or first/last valid timestamps.
**Trigger:** You work with intraday or sparse time series.
**Snippet:**

```python
import pandas as pd

idx = pd.date_range("2026-07-01", periods=6, freq="6H")
df = pd.DataFrame({"value": range(6)}, index=idx)

business_hours = df.between_time("09:00", "17:00")
first_ts = df.first_valid_index()
last_ts = df.last_valid_index()
```

**Minimal Notes:** `between_time` works on a DatetimeIndex. `first_valid_index` and `last_valid_index` help with sparse series.
**Common Bug:** Calling time-based index methods on a non-datetime index.
**Official Documentation URL:** [DataFrame.between_time](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.between_time.html)

## Entry 10: Sort rows and indexes

**Problem:** Order records deterministically.
**Trigger:** You need reproducible outputs or top-ranked rows.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"customer_id": [2, 1, 1], "score": [10, 30, 20]})
sorted_df = df.sort_values(["customer_id", "score"], ascending=[True, False])
sorted_idx = sorted_df.set_index("customer_id").sort_index()
```

**Minimal Notes:** Sort before deduplication when recency or priority matters.
**Common Bug:** Sorting by strings when you expected numeric or datetime order.
**Official Documentation URL:** [DataFrame.sort_values](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_values.html)

## Entry 11: Rank and top-N

**Problem:** Rank values or extract top records per group.
**Trigger:** You need leaderboard-style outputs.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"team": ["a", "a", "b"], "score": [10, 30, 20]})
df["rank"] = df["score"].rank(method="dense", ascending=False)
top2 = df.nlargest(2, "score")
bottom2 = df.nsmallest(2, "score")
```

**Minimal Notes:** `nlargest` and `nsmallest` are faster than full sorts for small top-N selections.
**Common Bug:** Using `sort_values().head()` when only top-N is needed on large data.
**Official Documentation URL:** [DataFrame.nlargest](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.nlargest.html)

## Entry 12: Rename, insert, pop, and drop columns

**Problem:** Manage frame schema explicitly.
**Trigger:** You need controlled column lifecycle operations.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
df = df.rename(columns={"a": "x"})
df.insert(1, "y", [10, 20])
removed = df.pop("b")
df = df.drop(columns=["x"])
```

**Minimal Notes:** Use `insert` for stable column placement and `pop` when you want the removed data.
**Common Bug:** Mutating temporary slices and assuming the parent frame changed.
**Official Documentation URL:** [DataFrame.insert](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.insert.html)

## Entry 13: Assign and update values

**Problem:** Create derived features or update existing values safely.
**Trigger:** You need copy-safe transformations.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"amount": [100, 200, 300]})
df = df.assign(amount_usd=lambda x: x["amount"] * 1.08)

patch = pd.DataFrame({"amount": [^999]}, index=[^1])
df.update(patch)
```

**Minimal Notes:** `assign` is chain-friendly. `update` writes aligned non-null values into matching labels.
**Common Bug:** Expecting `update` to add new rows or columns.
**Official Documentation URL:** [DataFrame.update](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.update.html)

## Entry 14: Replace, map, and apply

**Problem:** Transform scalar values, map labels, or run row/column functions.
**Trigger:** You need targeted value replacement or a function-based transform.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"status": ["new", "open", "paid"], "amount": [10, 20, 30]})
df["status"] = df["status"].replace({"new": "fresh"})
df["status_code"] = df["status"].map({"fresh": 1, "open": 2, "paid": 3})
df["amount_plus_1"] = df["amount"].apply(lambda x: x + 1)
```

**Minimal Notes:** Prefer vectorized operations first. Use `map` for one-to-one label lookup and `apply` only when needed.
**Common Bug:** Using `apply` for simple arithmetic that should be vectorized.
**Official Documentation URL:** [Series.map](https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html)

## Entry 15: Use DataFrame.map for elementwise replacement

**Problem:** Apply a scalar-to-scalar function across a DataFrame.
**Trigger:** You need elementwise transformation, not row logic.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
squared = df.map(lambda x: x * x)
```

**Minimal Notes:** `DataFrame.map` is the current elementwise API. Use it instead of old `applymap` patterns.
**Common Bug:** Using elementwise mapping when a vectorized column operation is much faster.
**Official Documentation URL:** [DataFrame.map](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.map.html)

## Entry 16: Pipe method chains

**Problem:** Keep transformations readable and composable.
**Trigger:** You want pipeline-style code without temporary variables.
**Snippet:**

```python
import pandas as pd

def add_margin(frame: pd.DataFrame) -> pd.DataFrame:
    return frame.assign(margin=lambda x: x["revenue"] - x["cost"])

df = pd.DataFrame({"revenue": [100, 200], "cost": [60, 150]})
result = (
    df.pipe(add_margin)
      .query("margin > 20")
)
```

**Minimal Notes:** `pipe` helps when a transformation is reusable or conditional.
**Common Bug:** Inlining long transformation chains without clear step boundaries.
**Official Documentation URL:** [DataFrame.pipe](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pipe.html)

## Entry 17: Missing values

**Problem:** Detect, drop, fill, interpolate, and combine sparse data.
**Trigger:** Your data has gaps.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, None, 3], "b": [None, 2, 3]})
df["a"] = df["a"].fillna(0)
df["b"] = df["b"].ffill()
clean = df.dropna(subset=["a"])
combined = df["a"].combine_first(df["b"])
```

**Minimal Notes:** `fillna`, `ffill`, `bfill`, `dropna`, and `combine_first` cover most missing-data workflows.
**Common Bug:** Filling numeric data with strings and silently changing dtype to object.
**Official Documentation URL:** [DataFrame.fillna](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.fillna.html)

## Entry 18: Missing-data diagnostics and dtype recovery

**Problem:** Recover from object dtypes and dirty null-heavy inputs.
**Trigger:** You inherited messy columns or mixed types.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"x": ["1", "2", None, "4"], "y": [1, None, 3, 4]})
df = df.infer_objects(copy=False)
df = df.convert_dtypes(dtype_backend="numpy_nullable")
df["x"] = pd.to_numeric(df["x"], errors="coerce")
```

**Minimal Notes:** `convert_dtypes()` is the preferred modern first step. `dtype_backend="pyarrow"` is useful when Arrow-backed dtypes are desired and supported.
**Common Bug:** Leaving messy data as object dtype and pushing the problem downstream.
**Official Documentation URL:** [DataFrame.convert_dtypes](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.convert_dtypes.html)

## Entry 19: Remove duplicates

**Problem:** Deduplicate records and keep the right row.
**Trigger:** You suspect repeated rows or keys.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"order_id": [1, 1, 2], "updated_at": pd.to_datetime(["2026-01-01", "2026-02-01", "2026-01-15"])}
)
deduped = df.sort_values("updated_at").drop_duplicates(subset=["order_id"], keep="last")
```

**Minimal Notes:** Sort before `drop_duplicates` when recency matters.
**Common Bug:** Dropping full-row duplicates when duplicate keys matter more than exact row equality.
**Official Documentation URL:** [DataFrame.drop_duplicates](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html)

## Entry 20: Compare frames and validate equality

**Problem:** Detect changes between datasets or test outputs.
**Trigger:** You need regression checks or debug diffs.
**Snippet:**

```python
import pandas as pd
from pandas.testing import assert_frame_equal

left = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
right = pd.DataFrame({"a": [1, 2], "b": [3, 5]})

diff = left.compare(right, keep_shape=True, keep_equal=False)
assert_frame_equal(left, left.copy())
```

**Minimal Notes:** `compare` is useful for debugging row/column deltas. `assert_frame_equal` is the standard testing utility.
**Common Bug:** Assuming visually similar frames are equal without checking dtypes or index labels.
**Official Documentation URL:** [DataFrame.compare](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.compare.html)

## Entry 21: Convert dtypes and nullable types

**Problem:** Normalize columns to modern nullable dtypes.
**Trigger:** You need consistent missing-value semantics.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv").convert_dtypes(dtype_backend="numpy_nullable")
df["amount"] = df["amount"].astype("Float64")
df["flag"] = df["flag"].astype("boolean")
```

**Minimal Notes:** Prefer nullable dtypes over legacy object columns. Use Arrow-backed dtypes when your pipeline benefits from them.
**Common Bug:** Leaving numeric data as object dtype and slowing all downstream operations.
**Official Documentation URL:** [DataFrame.convert_dtypes](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.convert_dtypes.html)

## Entry 22: Parse datetimes and time deltas

**Problem:** Convert text to timestamps or durations.
**Trigger:** You need time-series operations.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"order_date": ["2026-01-01", "2026-02-01"], "latency": ["5 min", "8 min"]}
)
df["order_date"] = pd.to_datetime(df["order_date"], utc=True, errors="coerce")
df["latency"] = pd.to_timedelta(df["latency"], errors="coerce")
```

**Minimal Notes:** `errors="coerce"` is useful for dirty input. Parse time values before arithmetic.
**Common Bug:** Comparing naive and timezone-aware timestamps.
**Official Documentation URL:** [to_datetime](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html)

## Entry 23: Datetime accessors

**Problem:** Extract date parts or normalize timestamps.
**Trigger:** You need year, month, weekday, or timezone-aware operations.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"ts": pd.to_datetime(["2026-01-01", "2026-07-06"], utc=True)})
df["year"] = df["ts"].dt.year
df["month"] = df["ts"].dt.month
df["weekday"] = df["ts"].dt.weekday
df["date_only"] = df["ts"].dt.normalize()
```

**Minimal Notes:** `.dt` is the vectorized datetime accessor. Use `floor`, `ceil`, and `round` for time bucketing.
**Common Bug:** Calling `.dt` on object dtype values that are not parsed datetimes.
**Official Documentation URL:** [Series.dt](https://pandas.pydata.org/docs/reference/series.html#datetimelike-properties)

## Entry 24: Timezone localization and conversion

**Problem:** Attach or convert timezones correctly.
**Trigger:** You work with timestamps across regions.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"ts": pd.date_range("2026-01-01", periods=3, freq="D")})
df["ts_utc"] = df["ts"].dt.tz_localize("UTC")
df["ts_oslo"] = df["ts_utc"].dt.tz_convert("Europe/Oslo")
```

**Minimal Notes:** `tz_localize` attaches a timezone; `tz_convert` changes it.
**Common Bug:** Calling `tz_convert` on naive timestamps.
**Official Documentation URL:** [Series.dt.tz_localize](https://pandas.pydata.org/docs/reference/api/pandas.Series.dt.tz_localize.html)

## Entry 25: Date ranges, business days, and offsets

**Problem:** Generate aligned time indexes and business calendars.
**Trigger:** You need scheduled periods or trading-day-like sequences.
**Snippet:**

```python
import pandas as pd

days = pd.date_range("2026-01-01", periods=5, freq="D")
biz = pd.bdate_range("2026-01-01", periods=5)
next_month = days + pd.offsets.MonthBegin(1)
```

**Minimal Notes:** Use frequency-aware constructors for repeatable time indexes. Offsets make calendar arithmetic explicit.
**Common Bug:** Hand-rolling date increments and missing weekends or month-boundary behavior.
**Official Documentation URL:** [date_range](https://pandas.pydata.org/docs/reference/api/pandas.date_range.html)

## Entry 26: Set and manage indexes

**Problem:** Move keys into the index or restore them back to columns.
**Trigger:** You need alignment, hierarchical indexing, or time-series indexing.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"customer_id": [1, 2], "amount": [10, 20]})
indexed = df.set_index("customer_id")
restored = indexed.reset_index()
```

**Minimal Notes:** Explicit index strategy helps joins, resampling, and alignment.
**Common Bug:** Forgetting which key is stored in the index and which is a column.
**Official Documentation URL:** [DataFrame.set_index](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.set_index.html)

## Entry 27: MultiIndex operations

**Problem:** Work with hierarchical row or column labels.
**Trigger:** You need grouped axes or nested keys.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"region": ["NO", "NO", "SE"], "year": [2025, 2026, 2026], "value": [1, 2, 3]}
).set_index(["region", "year"])

no_rows = df.xs("NO", level="region")
reordered = df.reorder_levels(["year", "region"]).sort_index()
```

**Minimal Notes:** `xs`, `swaplevel`, `reorder_levels`, and `droplevel` are the main MultiIndex tools.
**Common Bug:** Sorting or slicing a MultiIndex without knowing the active level order.
**Official Documentation URL:** [MultiIndex](https://pandas.pydata.org/docs/reference/api/pandas.MultiIndex.html)

## Entry 28: Query, eval, and expression columns

**Problem:** Keep complex filters and computed expressions readable.
**Trigger:** You want compact, chain-friendly logic.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
filtered = df.query("a > 1 and b < 30")
df["c"] = df.eval("a + b")
```

**Minimal Notes:** `query` and `eval` can make pipeline code easier to scan.
**Common Bug:** Expecting `eval` to replace proper schema or validation checks.
**Official Documentation URL:** [DataFrame.eval](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.eval.html)

## Entry 29: Alignment and index-safe arithmetic

**Problem:** Combine objects by label, not position.
**Trigger:** You need aligned arithmetic or paired transforms.
**Snippet:**

```python
import pandas as pd

a = pd.Series([1, 2], index=["x", "y"])
b = pd.Series([10, 20], index=["y", "z"])

left, right = a.align(b, join="outer")
sum_series = left.fillna(0) + right.fillna(0)
```

**Minimal Notes:** Alignment is label-based, not positional.
**Common Bug:** Assuming two objects line up by row order.
**Official Documentation URL:** [Series.align](https://pandas.pydata.org/docs/reference/api/pandas.Series.align.html)

## Entry 30: Join relational datasets

**Problem:** Join two tables on keys with cardinality checks.
**Trigger:** You need relational enrichment.
**Snippet:**

```python
import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 2], "amount": [10, 20]})
customers = pd.DataFrame({"customer_id": [1, 2], "country": ["NO", "SE"]})

merged = orders.merge(customers, on="customer_id", how="left", validate="one_to_one")
```

**Minimal Notes:** Use `validate` to catch key cardinality errors early.
**Common Bug:** Merge explosions from duplicate keys on either side.
**Official Documentation URL:** [DataFrame.merge](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html)

## Entry 31: Time-based joins

**Problem:** Join ordered time series by nearest key or ordered key.
**Trigger:** You need as-of or ordered alignment.
**Snippet:**

```python
import pandas as pd

left = pd.DataFrame(
    {"ts": pd.to_datetime(["2026-01-01 10:00", "2026-01-01 10:05"]), "value": [1, 2]}
).sort_values("ts")
right = pd.DataFrame(
    {"ts": pd.to_datetime(["2026-01-01 09:59", "2026-01-01 10:03"]), "ref": [100, 200]}
).sort_values("ts")

asof_join = pd.merge_asof(left, right, on="ts", direction="backward")
ordered_join = pd.merge_ordered(left, right, on="ts", fill_method="ffill")
```

**Minimal Notes:** Both frames must be sorted for `merge_asof`. `merge_ordered` is useful for ordered data with optional filling.
**Common Bug:** Calling `merge_asof` on unsorted keys.
**Official Documentation URL:** [merge_asof](https://pandas.pydata.org/docs/reference/api/pandas.merge_asof.html)

## Entry 32: Concatenate and compare datasets

**Problem:** Stack batches or compare related tables.
**Trigger:** You need batch assembly or difference detection.
**Snippet:**

```python
import pandas as pd

a = pd.DataFrame({"id": [1, 2], "value": [10, 20]})
b = pd.DataFrame({"id": [3, 4], "value": [30, 40]})

combined = pd.concat([a, b], ignore_index=True)
diff = a.compare(a.copy())
```

**Minimal Notes:** Use `concat` for batch append patterns, not repeated concatenation in loops. `compare` helps debug differences.
**Common Bug:** Assuming `concat` performs a keyed join.
**Official Documentation URL:** [concat](https://pandas.pydata.org/docs/reference/api/pandas.concat.html)

## Entry 33: Group and aggregate

**Problem:** Summarize data by one or more keys.
**Trigger:** You need totals, counts, or custom summaries.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"region": ["NO", "NO", "SE"], "amount": [10, 15, 20]})
summary = (
    df.groupby("region", as_index=False, observed=True, dropna=False)
    .agg(total_amount=("amount", "sum"), avg_amount=("amount", "mean"))
)
```

**Minimal Notes:** Named aggregations keep output columns readable. `observed=True` helps with categorical group keys.
**Common Bug:** Forgetting `as_index=False` and getting grouped keys in the index.
**Official Documentation URL:** [DataFrame.groupby](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html)

## Entry 34: Group transforms and cumulative features

**Problem:** Add group-level metrics back to each row.
**Trigger:** You need per-row features like group mean or share.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"region": ["NO", "NO", "SE"], "amount": [10, 15, 20]})
g = df.groupby("region")
df["region_avg"] = g["amount"].transform("mean")
df["region_cumcount"] = g.cumcount()
df["region_total_rank"] = g["amount"].rank(method="dense", ascending=False)
```

**Minimal Notes:** `transform` preserves row count and aligns back to the original frame. `cumcount` and grouped `rank` are common feature-engineering tools.
**Common Bug:** Using `agg` when you actually need same-length output.
**Official Documentation URL:** [GroupBy.cumcount](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.GroupBy.cumcount.html)

## Entry 35: Group filtering and selection

**Problem:** Keep or pick rows from specific groups.
**Trigger:** You need first/last/nth or conditional group filtering.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"region": ["NO", "NO", "SE"], "amount": [10, 15, 20]})
g = df.groupby("region")
top_row = g.nth(0)
first_rows = g.first()
large_groups = g.filter(lambda x: len(x) >= 2)
```

**Minimal Notes:** `first`, `last`, `nth`, `size`, and `filter` cover most group-level row selection tasks.
**Common Bug:** Using `apply` for simple row picking logic.
**Official Documentation URL:** [GroupBy.filter](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.filter.html)

## Entry 36: Pivot and pivot table

**Problem:** Convert long data to wide layout with and without aggregation.
**Trigger:** You need matrix-style output or aggregated reshaping.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"date": ["2026-01-01", "2026-01-01", "2026-01-02"], "metric": ["sales", "sales", "sales"], "value": [10, 15, 12]}
)

table = df.pivot_table(index="date", columns="metric", values="value", aggfunc="sum", fill_value=0)
```

**Minimal Notes:** Use `pivot` for unique combinations and `pivot_table` for duplicate cells.
**Common Bug:** Using `pivot` when duplicates require aggregation.
**Official Documentation URL:** [DataFrame.pivot_table](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot_table.html)

## Entry 37: Melt and wide-to-long

**Problem:** Normalize wide data into tidy rows.
**Trigger:** You need a long format for analysis or plotting.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "sales_q1": [10, 20], "sales_q2": [15, 25]})
long = df.melt(id_vars=["id"], var_name="quarter", value_name="sales")
```

**Minimal Notes:** `melt` is the standard inverse of wide-to-long reshaping. `wide_to_long` is useful for systematic column prefixes.
**Common Bug:** Forgetting to preserve identifier columns in `id_vars`.
**Official Documentation URL:** [DataFrame.melt](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.melt.html)

## Entry 38: Stack and unstack

**Problem:** Move index levels between rows and columns.
**Trigger:** You are working with hierarchical indexes.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"region": ["NO", "NO"], "metric": ["sales", "visits"], "value": [10, 50]}
).set_index(["region", "metric"])

wide = df.unstack("metric")
long = wide.stack("metric")
```

**Minimal Notes:** `stack` and `unstack` are common in multi-indexed workflows.
**Common Bug:** Mixing index level names and positions incorrectly.
**Official Documentation URL:** [DataFrame.unstack](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.unstack.html)

## Entry 39: Explode list-like columns

**Problem:** Turn list values into one row per element.
**Trigger:** You have nested list data in a column.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "tags": [["a", "b"], ["c"]]})
exploded = df.explode("tags", ignore_index=True)
```

**Minimal Notes:** `explode` is common after JSON parsing or tokenization.
**Common Bug:** Exploding columns that still contain mixed scalar and list values.
**Official Documentation URL:** [DataFrame.explode](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.explode.html)

## Entry 40: Rolling metrics

**Problem:** Compute moving statistics.
**Trigger:** You need trailing window features.
**Snippet:**

```python
import pandas as pd

s = pd.Series([10, 20, 30, 40, 50])
rolling_mean = s.rolling(window=3, min_periods=1).mean()
```

**Minimal Notes:** `rolling` is the usual choice for moving averages and volatility.
**Common Bug:** Forgetting `min_periods` and getting leading NaNs.
**Official Documentation URL:** [Series.rolling](https://pandas.pydata.org/docs/reference/api/pandas.Series.rolling.html)

## Entry 41: Grouped rolling features

**Problem:** Compute rolling windows within groups.
**Trigger:** You need per-entity time-series features.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {
        "customer_id": [1, 1, 1, 2, 2],
        "ts": pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-01", "2026-01-02"]),
        "amount": [10, 20, 30, 40, 50],
    }
).sort_values(["customer_id", "ts"])

df["rolling_2"] = (
    df.groupby("customer_id")["amount"]
      .rolling(2, min_periods=1)
      .mean()
      .reset_index(level=0, drop=True)
)
```

**Minimal Notes:** Sort before grouped rolling. Reset the grouped index after the rolling operation.
**Common Bug:** Forgetting to sort within each group before applying a rolling window.
**Official Documentation URL:** [SeriesGroupBy.rolling](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.SeriesGroupBy.rolling.html)

## Entry 42: Expanding and EWM smoothing

**Problem:** Compute cumulative and exponentially weighted statistics.
**Trigger:** You need growing-history or smoothed features.
**Snippet:**

```python
import pandas as pd

s = pd.Series([10, 20, 30, 40, 50])
exp_mean = s.expanding(min_periods=1).mean()
ewm_mean = s.ewm(alpha=0.3, adjust=False).mean()
```

**Minimal Notes:** `expanding` uses all prior rows; `ewm` is common for trend tracking and online metrics.
**Common Bug:** Using `rolling` when you actually need full-history accumulation.
**Official Documentation URL:** [Series.expanding](https://pandas.pydata.org/docs/reference/api/pandas.Series.expanding.html)

## Entry 43: Resample time series

**Problem:** Change time frequency and aggregate.
**Trigger:** Your index is datetime-like.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"ts": pd.date_range("2026-01-01", periods=6, freq="H"), "value": [1, 2, 3, 4, 5, 6]}
).set_index("ts")

hourly = df.resample("3H").sum()
```

**Minimal Notes:** `resample` is the time-series equivalent of groupby by time bins.
**Common Bug:** Resampling a non-datetime index.
**Official Documentation URL:** [DataFrame.resample](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.resample.html)

## Entry 44: Asfreq and frequency conversion

**Problem:** Reindex time series to a fixed frequency.
**Trigger:** You need a regular grid without aggregation.
**Snippet:**

```python
import pandas as pd

s = pd.Series([1, 2, 3], index=pd.to_datetime(["2026-01-01", "2026-01-03", "2026-01-04"]))
regular = s.asfreq("D")
```

**Minimal Notes:** `asfreq` is for frequency conversion and alignment, not aggregation.
**Common Bug:** Using `resample` when you only need a structural frequency change.
**Official Documentation URL:** [Series.asfreq](https://pandas.pydata.org/docs/reference/api/pandas.Series.asfreq.html)

## Entry 45: Shift and lag features

**Problem:** Build lagged or lead features.
**Trigger:** You need previous or future values.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"value": [10, 20, 30, 40]})
df["lag_1"] = df["value"].shift(1)
df["lead_1"] = df["value"].shift(-1)
df["pct_change"] = df["value"].pct_change()
```

**Minimal Notes:** `shift` is the core lag/lead primitive. `pct_change` is a common derived metric.
**Common Bug:** Mixing shifted data with unshifted labels and leaking future information.
**Official Documentation URL:** [DataFrame.shift](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.shift.html)

## Entry 46: Numeric summaries and statistics

**Problem:** Compute descriptive stats, correlation, covariance, and quantiles.
**Trigger:** You need quick statistical profiling.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"x": [1, 2, 3, 4], "y": [2, 4, 6, 8]})
print(df.describe())
print(df.corr(numeric_only=True))
print(df.cov(numeric_only=True))
print(df.quantile([0.25, 0.5, 0.75], numeric_only=True))
```

**Minimal Notes:** `describe`, `corr`, `cov`, and `quantile` cover most exploratory stats.
**Common Bug:** Expecting correlation on non-numeric columns without cleaning dtypes first.
**Official Documentation URL:** [DataFrame.describe](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html)

## Entry 47: Cumulative numeric operations

**Problem:** Build running totals and running extrema.
**Trigger:** You need cumulative features.
**Snippet:**

```python
import pandas as pd

s = pd.Series([3, 1, 4, 2])
cum = pd.DataFrame({"s": s}).assign(
    cumsum=s.cumsum(),
    cummin=s.cummin(),
    cummax=s.cummax(),
    cumprod=s.cumprod(),
)
```

**Minimal Notes:** Cumulative APIs are useful for trend and threshold features.
**Common Bug:** Applying cumulative logic to unsorted data and getting misleading results.
**Official Documentation URL:** [Series.cumsum](https://pandas.pydata.org/docs/reference/api/pandas.Series.cumsum.html)

## Entry 48: Value analysis and duplicates

**Problem:** Inspect frequency, uniqueness, and duplicate records.
**Trigger:** You need cardinality or quality checks.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"status": ["new", "new", "paid", "open"]})
counts = df["status"].value_counts(dropna=False)
dupe_rows = df.duplicated(keep=False)
dupe_values = df["status"].duplicated(keep=False)
```

**Minimal Notes:** `duplicated` is the standard duplicate detector for rows or columns.
**Common Bug:** Confusing value duplication with whole-row duplication.
**Official Documentation URL:** [DataFrame.duplicated](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html)

## Entry 49: String cleanup and regex extraction

**Problem:** Clean and parse text columns.
**Trigger:** You need normalization or token extraction.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"email": [" Alice@Example.com ", "bob@test.org"]})
df["email_clean"] = df["email"].str.strip().str.lower()
df["domain"] = df["email_clean"].str.extract(r"@(.+)$")
df["first_token"] = df["email_clean"].str.split("@").str[^0]
```

**Minimal Notes:** Chain `.str` methods for vectorized string operations. `extractall` is useful when you expect multiple regex matches.
**Common Bug:** Applying Python string methods directly to a Series.
**Official Documentation URL:** [Series.str.extract](https://pandas.pydata.org/docs/reference/api/pandas.Series.str.extract.html)

## Entry 50: String partitioning and Unicode normalization

**Problem:** Split structured strings and normalize text variants.
**Trigger:** You need stable text processing across encodings and separators.
**Snippet:**

```python
import pandas as pd
import unicodedata

df = pd.DataFrame({"path": ["a/b/c", "x/y/z"], "text": ["café", "naïve"]})
parts = df["path"].str.partition("/")
df["text_norm"] = df["text"].map(lambda x: unicodedata.normalize("NFKC", x))
```

**Minimal Notes:** `partition` is useful when only the first delimiter matters. Unicode normalization helps stabilize text keys.
**Common Bug:** Treating visually identical Unicode strings as equal without normalization.
**Official Documentation URL:** [Series.str.partition](https://pandas.pydata.org/docs/reference/api/pandas.Series.str.partition.html)

## Entry 51: Categorical management

**Problem:** Control category sets, ordering, and codes.
**Trigger:** You need predictable label behavior and smaller memory use.
**Snippet:**

```python
import pandas as pd

s = pd.Series(pd.Categorical(["low", "high", "low"], categories=["low", "medium", "high"], ordered=True))
s = s.cat.set_categories(["low", "medium", "high", "critical"], ordered=True)
s = s.cat.remove_unused_categories()
codes = s.cat.codes
```

**Minimal Notes:** Use ordered categories for explicit sort semantics. Remove unused categories after filtering.
**Common Bug:** Sorting or comparing unordered categories and getting unexpected results.
**Official Documentation URL:** [Categorical accessor](https://pandas.pydata.org/docs/user_guide/categorical.html#categorical-accessor)

## Entry 52: Build dummy variables

**Problem:** One-hot encode categorical columns.
**Trigger:** You need model-ready indicator columns.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"city": ["Oslo", "Bergen", "Oslo"]})
encoded = pd.get_dummies(df, columns=["city"], dtype="int64")
decoded = pd.from_dummies(encoded.filter(like="city_"))
```

**Minimal Notes:** `get_dummies` is the standard encoder; `from_dummies` helps reverse the transformation in simple cases.
**Common Bug:** One-hot encoding without controlling dtype or category drift between train and inference.
**Official Documentation URL:** [get_dummies](https://pandas.pydata.org/docs/reference/api/pandas.get_dummies.html)

## Entry 53: Build and use Index objects

**Problem:** Create, sort, slice, and align indexes directly.
**Trigger:** You need index-level manipulation without changing data columns.
**Snippet:**

```python
import pandas as pd

idx = pd.Index(["b", "a", "c"])
sorted_idx = idx.sort_values()

df = pd.DataFrame({"value": [10, 20, 30]}, index=idx)
aligned = df.reindex(sorted_idx)
```

**Minimal Notes:** Index objects are immutable and central to alignment semantics.
**Common Bug:** Treating the index as if it were a normal mutable column.
**Official Documentation URL:** [Index](https://pandas.pydata.org/docs/reference/api/pandas.Index.html)

## Entry 54: Slicing with IndexSlice and xs

**Problem:** Work with MultiIndex rows or columns cleanly.
**Trigger:** You need targeted extraction from hierarchical axes.
**Snippet:**

```python
import pandas as pd

idx = pd.MultiIndex.from_tuples([("NO", 2025), ("NO", 2026), ("SE", 2026)], names=["region", "year"])
df = pd.DataFrame({"value": [1, 2, 3]}, index=idx)

no = df.xs("NO", level="region")
slc = df.loc[pd.IndexSlice["NO", :], :]
```

**Minimal Notes:** `xs` is a concise cross-section tool. `IndexSlice` makes MultiIndex selection readable.
**Common Bug:** Mixing tuple indexing with level names without confirming the index structure.
**Official Documentation URL:** [DataFrame.xs](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.xs.html)

## Entry 55: Sort and reshape MultiIndex

**Problem:** Reorder hierarchical axes or remove a level.
**Trigger:** You need cleaner MultiIndex outputs.
**Snippet:**

```python
import pandas as pd

idx = pd.MultiIndex.from_product([["NO", "SE"], [2025, 2026]], names=["region", "year"])
df = pd.DataFrame({"value": [1, 2, 3, 4]}, index=idx)

df = df.sort_index()
df = df.swaplevel("region", "year").sort_index()
df = df.droplevel("region")
```

**Minimal Notes:** `sort_index`, `swaplevel`, and `droplevel` are core MultiIndex maintenance tools.
**Common Bug:** Operating on a MultiIndex without sorting it first.
**Official Documentation URL:** [DataFrame.sort_index](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_index.html)

## Entry 56: Use between, clip, where, and mask

**Problem:** Apply conditional value rules.
**Trigger:** You need bounded values or conditional replacement.
**Snippet:**

```python
import pandas as pd

s = pd.Series([5, 15, 25, 35])
bounded = s.clip(lower=10, upper=30)
inside = s.where(s.between(10, 30), other=pd.NA)
outside = s.mask(s.between(10, 30), other=0)
```

**Minimal Notes:** `where` keeps values where the condition is true; `mask` does the inverse.
**Common Bug:** Swapping `where` and `mask` logic.
**Official Documentation URL:** [Series.clip](https://pandas.pydata.org/docs/reference/api/pandas.Series.clip.html)

## Entry 57: Numeric elementwise operations

**Problem:** Compute rounding, differences, and percentage changes.
**Trigger:** You need feature engineering on numeric sequences.
**Snippet:**

```python
import pandas as pd

s = pd.Series([10.123, 11.456, 12.789])
out = pd.DataFrame({
    "round_1": s.round(1),
    "diff_1": s.diff(),
    "pct_change_1": s.pct_change(),
})
```

**Minimal Notes:** These are fast vectorized transforms for numeric pipelines.
**Common Bug:** Using Python loops for operations Pandas already vectorizes.
**Official Documentation URL:** [Series.round](https://pandas.pydata.org/docs/reference/api/pandas.Series.round.html)

## Entry 58: Read and write clipboard, pickle, and columnar formats

**Problem:** Move data between tools or persist Python-native structures.
**Trigger:** You need quick local transfer or fast round-trips.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
df.to_clipboard(index=False)
df.to_pickle("frame.pkl")
df.to_feather("frame.feather")
df.to_orc("frame.orc")
```

**Minimal Notes:** Use clipboard for ad hoc transfers, pickle for Python-only round trips, and Feather/ORC for fast columnar IO.
**Common Bug:** Treating pickle as a cross-language format or secure interchange format.
**Official Documentation URL:** [DataFrame.to_pickle](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_pickle.html)

## Entry 59: Read and write HTML and XML tables

**Problem:** Extract or publish tabular web data.
**Trigger:** Your data source or sink is HTML or XML.
**Snippet:**

```python
import pandas as pd

tables = pd.read_html("https://example.com/table.html")
df = tables[^0]

xml_df = pd.read_xml("data.xml", xpath=".//row")
```

**Minimal Notes:** `read_html` and `read_xml` are useful for structured web tables.
**Common Bug:** Assuming every page table has a stable schema.
**Official Documentation URL:** [read_html](https://pandas.pydata.org/docs/reference/api/pandas.read_html.html)

## Entry 60: Visual checks with plot, hist, box, scatter, and bar

**Problem:** Make fast exploratory plots.
**Trigger:** You need a visual sanity check.
**Snippet:**

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({"x": [1, 2, 3, 4], "y": [10, 15, 13, 18], "group": ["a", "a", "b", "b"]})
ax1 = df.plot(x="x", y="y", kind="line", title="Line")
ax2 = df["y"].plot(kind="hist", bins=4, title="Hist")
ax3 = df.plot(x="x", y="y", kind="scatter", title="Scatter")
plt.tight_layout()
plt.show()
```

**Minimal Notes:** `.plot` is good for fast diagnostics and simple summaries. Keep visual checks lightweight.
**Common Bug:** Expecting publication-quality control from the default plot accessor.
**Official Documentation URL:** [DataFrame.plot](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.html)

## Entry 61: Memory inspection and optimization

**Problem:** Find large columns or reduce memory usage.
**Trigger:** You need to scale a frame without wasting RAM.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
print(df.memory_usage(deep=True))
print(df.info(memory_usage="deep"))
df["status"] = df["status"].astype("category")
df = df.convert_dtypes(dtype_backend="numpy_nullable")
```

**Minimal Notes:** `deep=True` matters for object columns. Categoricals and nullable dtypes often reduce memory materially.
**Common Bug:** Underestimating memory because object/string storage is not counted deeply.
**Official Documentation URL:** [DataFrame.memory_usage](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.memory_usage.html)

## Entry 62: Chunked reading and scalable ingestion

**Problem:** Read large files in bounded memory.
**Trigger:** Your input is too large for a single in-memory read.
**Snippet:**

```python
import pandas as pd

chunks = pd.read_csv("large.csv", chunksize=100_000, usecols=["id", "amount"])
total = 0
for chunk in chunks:
    total += chunk["amount"].sum()
```

**Minimal Notes:** Chunked reading is the standard fallback for large CSV inputs. Combine with `usecols` and `dtype` when possible.
**Common Bug:** Loading a huge file all at once and relying on swap or memory pressure.
**Official Documentation URL:** [read_csv](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html)

## Entry 63: Safe method chaining pipeline

**Problem:** Build a deterministic transformation pipeline.
**Trigger:** You want readable, testable data preparation steps.
**Snippet:**

```python
import pandas as pd

def build_features(frame: pd.DataFrame) -> pd.DataFrame:
    return (
        frame.convert_dtypes()
        .assign(amount_usd=lambda x: x["amount"] * 1.08)
        .query("amount_usd > 100")
        .sort_values(["customer_id", "order_date"])
    )

df = pd.DataFrame({"customer_id": [1, 2], "amount": [90, 120], "order_date": pd.to_datetime(["2026-01-01", "2026-01-02"])})
result = build_features(df)
```

**Minimal Notes:** Method chaining reduces temporary state and makes pipelines easier to review.
**Common Bug:** Mixing chained transformations with hidden in-place mutations.
**Official Documentation URL:** [DataFrame.pipe](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pipe.html)

## Entry 64: Debug frames with assertions and equality checks

**Problem:** Validate outputs during development and tests.
**Trigger:** You need fast correctness checks.
**Snippet:**

```python
import pandas as pd
from pandas.testing import assert_frame_equal, assert_series_equal

left = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
right = pd.DataFrame({"a": [1, 2], "b": [3, 4]})

assert left.equals(right)
assert_frame_equal(left, right)
assert_series_equal(left["a"], right["a"])
```

**Minimal Notes:** `equals` is a quick boolean check; testing utilities give stricter diffs.
**Common Bug:** Checking values only and missing dtype or index mismatches.
**Official Documentation URL:** [DataFrame.equals](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.equals.html)

## Entry 65: Debug duplicates and alignment issues

**Problem:** Find duplicate keys or misaligned index behavior.
**Trigger:** A join, assignment, or reshape produced unexpected results.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 1, 2], "value": [10, 20, 30]})
print(df.duplicated(subset=["id"], keep=False))
print(df.index.duplicated(keep=False))
print(df.compare(df.copy(), keep_shape=True))
```

**Minimal Notes:** Diagnose duplicates before merge, pivot, or dedup steps.
**Common Bug:** Assuming silent index alignment will behave like row order.
**Official Documentation URL:** [Index.duplicated](https://pandas.pydata.org/docs/reference/api/pandas.Index.duplicated.html)

## Performance Checklist

- Specify `dtype` on read when possible.
- Use `usecols` to read fewer columns.
- Prefer vectorized `.str`, `.dt`, arithmetic, `groupby`, and `transform` over Python loops.
- Avoid `iterrows`; prefer vectorized code or `itertuples` for row-wise iteration.
- Prefer `apply` only when no vectorized alternative exists.
- Convert repeated text columns to `category` when cardinality is low.
- Use nullable or Arrow-backed dtypes for cleaner missing-data handling.
- Use `memory_usage(deep=True)` and `info(memory_usage="deep")` to find expensive columns.
- Prefer `concat` for batch append patterns and avoid repeated concatenation in loops.
- Prefer `merge(..., validate=...)` for safe joins.
- Prefer Parquet or Feather for large analytical outputs.
- Prefer deterministic sort order before deduplication or top-N selection.
- Be copy-on-write aware and avoid unnecessary intermediate copies.


## Production Checklist

- Lock schema early with explicit dtypes.
- Normalize timestamps and timezones consistently.
- Manage index explicitly with `set_index`, `reset_index`, and `ignore_index`.
- Validate joins with `validate=`.
- Avoid chained assignment; assign back to the frame.
- Check nulls and duplicates before modeling or export.
- Prefer deterministic sort order before deduplication.
- Use copy-safe transformations and clear column names.
- Validate output equality and schema in tests.
- Review memory usage before scaling pipelines.
- Confirm export formats preserve required dtypes and missing values.
- Keep method chains readable and deterministic.
- Avoid hidden reliance on row order when labels matter.


## Quick Reference Tables

### Selection APIs

| Task | API |
| :-- | :-- |
| Select columns | `df[["a", "b"]]` |
| Select rows by label | `df.loc[...]` |
| Select rows by position | `df.iloc[...]` |
| Select scalar by label | `df.at[...]` |
| Select scalar by position | `df.iat[...]` |
| Cross-section | `df.xs(...)` |
| Filter by condition | `df[mask]` |
| Query by expression | `df.query("a > 1")` |
| Sample rows | `df.sample(...)` |

### Indexing APIs

| Task | API |
| :-- | :-- |
| Set index | `df.set_index(...)` |
| Reset index | `df.reset_index(...)` |
| Sort index | `df.sort_index(...)` |
| Reindex | `df.reindex(...)` |
| Align labels | `obj.align(...)` |
| MultiIndex create | `pd.MultiIndex.from_*` |
| Swap levels | `df.swaplevel(...)` |
| Reorder levels | `df.reorder_levels(...)` |
| Drop a level | `df.droplevel(...)` |
| Cross-section | `df.xs(...)` |

### Missing Value APIs

| Task | API |
| :-- | :-- |
| Detect missing | `pd.isna`, `pd.notna` |
| Fill missing | `fillna` |
| Forward fill | `ffill` |
| Backward fill | `bfill` |
| Interpolate | `interpolate` |
| Drop missing | `dropna` |
| Combine fallback | `combine_first` |

### Reshaping APIs

| Task | API |
| :-- | :-- |
| Stack | `stack` |
| Unstack | `unstack` |
| Melt | `melt` |
| Pivot | `pivot` |
| Pivot table | `pivot_table` |
| Wide to long | `wide_to_long` |
| Explode | `explode` |
| Crosstab | `crosstab` |
| Dummies | `get_dummies` / `from_dummies` |

### Merge APIs

| Task | API |
| :-- | :-- |
| Inner join | `merge(..., how="inner")` |
| Left join | `merge(..., how="left")` |
| Right join | `merge(..., how="right")` |
| Outer join | `merge(..., how="outer")` |
| Ordered merge | `merge_ordered(...)` |
| As-of merge | `merge_asof(...)` |
| Concatenate | `concat(...)` |
| Join on index | `df.join(...)` |
| Align | `obj.align(...)` |
| Compare | `df.compare(...)` |

### GroupBy APIs

| Task | API |
| :-- | :-- |
| Aggregate | `groupby(...).agg(...)` |
| Transform | `groupby(...).transform(...)` |
| Filter groups | `groupby(...).filter(...)` |
| Apply custom function | `groupby(...).apply(...)` |
| Count rows | `groupby(...).size()` |
| Count non-null | `groupby(...).count()` |
| First / last | `groupby(...).first()`, `groupby(...).last()` |
| Nth row | `groupby(...).nth(...)` |
| Group number | `groupby(...).ngroup()` |
| Cumulative count | `groupby(...).cumcount()` |
| Rolling within groups | `groupby(...).rolling(...)` |

### Window APIs

| Task | API |
| :-- | :-- |
| Rolling mean | `rolling(...).mean()` |
| Rolling sum | `rolling(...).sum()` |
| Rolling apply | `rolling(...).apply(...)` |
| Expanding mean | `expanding(...).mean()` |
| EWM mean | `ewm(...).mean()` |

### Datetime APIs

| Task | API |
| :-- | :-- |
| Parse datetimes | `pd.to_datetime(...)` |
| Parse durations | `pd.to_timedelta(...)` |
| Date range | `pd.date_range(...)` |
| Business date range | `pd.bdate_range(...)` |
| Time delta range | `pd.timedelta_range(...)` |
| Period range | `pd.period_range(...)` |
| Localize / convert | `.dt.tz_localize(...)`, `.dt.tz_convert(...)` |
| Extract year/month | `.dt.year`, `.dt.month` |
| Floor / ceil / round | `.dt.floor(...)`, `.dt.ceil(...)`, `.dt.round(...)` |
| Normalize date | `.dt.normalize()` |
| Format string | `.dt.strftime(...)` |
| Shift | `.shift(...)` |
| Frequency convert | `.asfreq(...)` |
| Resample | `.resample(...)` |

### String APIs

| Task | API |
| :-- | :-- |
| Lower / upper | `.str.lower()`, `.str.upper()` |
| Strip | `.str.strip()` |
| Contains | `.str.contains(...)` |
| Match | `.str.match(...)` |
| Replace | `.str.replace(...)` |
| Split | `.str.split(...)` |
| Partition | `.str.partition(...)` |
| Extract regex | `.str.extract(...)` |
| Extract all | `.str.extractall(...)` |
| Length | `.str.len()` |
| Normalize Unicode | `unicodedata.normalize(...)` |

### Categorical APIs

| Task | API |
| :-- | :-- |
| Convert | `astype("category")` |
| Categories | `.cat.categories` |
| Codes | `.cat.codes` |
| Reorder | `.cat.reorder_categories(...)` |
| Set categories | `.cat.set_categories(...)` |
| Rename | `.cat.rename_categories(...)` |
| Remove unused | `.cat.remove_unused_categories()` |
| Remove categories | `.cat.remove_categories(...)` |
| Ordered categories | `ordered=True` |
| Groupby optimization | `observed=True` |

### IO APIs

| Task | API |
| :-- | :-- |
| CSV read/write | `read_csv`, `to_csv` |
| Excel read/write | `read_excel`, `to_excel` |
| JSON read/write | `read_json`, `to_json` |
| Parquet read/write | `read_parquet`, `to_parquet` |
| Feather read/write | `read_feather`, `to_feather` |
| ORC read/write | `read_orc`, `to_orc` |
| HTML tables | `read_html` |
| XML | `read_xml` |
| SQL read/write | `read_sql`, `to_sql` |
| Pickle read/write | `read_pickle`, `to_pickle` |
| Clipboard | `read_clipboard`, `to_clipboard` |

### Performance APIs

| Task | API |
| :-- | :-- |
| Memory usage | `memory_usage(deep=True)` |
| Info with memory | `info(memory_usage="deep")` |
| Vectorized iteration | `itertuples()` |
| Avoid row loops | prefer vectorization |
| Schema conversion | `convert_dtypes(...)` |
| Categorical storage | `astype("category")` |
| Fast top-N | `nlargest`, `nsmallest` |
| Chunked reads | `read_csv(..., chunksize=...)` |

### Debugging APIs

| Task | API |
| :-- | :-- |
| Equality check | `equals(...)` |
| Frame diff | `compare(...)` |
| Testing equality | `assert_frame_equal(...)` |
| Series equality | `assert_series_equal(...)` |
| Duplicate rows | `duplicated(...)` |
| Duplicate index | `index.duplicated(...)` |
| Display types | `info()`, `dtypes` |

## Sources

- [Pandas homepage](https://pandas.pydata.org/)
- [API reference](https://pandas.pydata.org/docs/reference/index.html)
- [User Guide](https://pandas.pydata.org/docs/user_guide/index.html)
- [DataFrame API](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)
- [Release notes](https://pandas.pydata.org/docs/whatsnew/index.html)
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: Pandas-Cheatsheet.md

[^2]: https://www.qeios.com/read/GFSQFL/pdf

[^3]: https://arxiv.org/pdf/2312.11122.pdf

[^4]: http://arxiv.org/pdf/2501.08207.pdf

[^5]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10903647/

[^6]: https://academic.oup.com/bioinformatics/article-pdf/32/21/3363/7889719/btw422.pdf

[^7]: https://arxiv.org/pdf/2103.02145.pdf

[^8]: http://arxiv.org/pdf/2303.16146.pdf

[^9]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html

[^10]: https://pandas.pydata.org/docs/reference/api/pandas.merge_ordered.html

[^11]: https://pandas.pydata.org/docs/reference/api/pandas.merge_asof.html

[^12]: https://pandas.pydata.org/docs/user_guide/indexing.html

[^13]: https://pandas.pydata.org/docs/user_guide/pyarrow.html

[^14]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.convert_dtypes.html

[^15]: https://pandas.pydata.org/docs/user_guide/merging.html

[^16]: https://arrow.apache.org/docs/python/pandas.html

[^17]: https://github.com/pandas-dev/pandas/issues/51433

[^18]: https://stackoverflow.com/questions/63630670/pandas-groupby-merge-asof

