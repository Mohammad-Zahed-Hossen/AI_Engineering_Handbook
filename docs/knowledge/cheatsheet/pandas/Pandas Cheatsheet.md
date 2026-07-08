# Pandas Cheatsheet

## Metadata

| field | value |
| :-- | :-- |
| id | pandas_cheatsheet |
| title | Pandas Cheatsheet |
| slug | pandas-cheatsheet |
| name | Pandas Cheatsheet |
| description | Canonical copy-paste cheatsheet for core Pandas syntax and production workflows. |
| package_reference | pandas |
| version | 3.0.4 |
| sources | [Pandas homepage](https://pandas.pydata.org/), [API reference](https://pandas.pydata.org/docs/reference/index.html), [User Guide](https://pandas.pydata.org/docs/user_guide/index.html), [DataFrame API](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html), [Release notes](https://pandas.pydata.org/docs/whatsnew/index.html) |
| created_at | 2026-07-06T18:23:00+06:00 |
| updated_at | 2026-07-06T18:23:00+06:00 |

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
| `pd.date_range` | Regular datetime sequences. |
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
print(df.info())
print(df.describe(include="all"))
print(df.isna().sum())
```

**Minimal Notes:** `info()` is the fastest way to check dtypes and non-null counts. `describe(include="all")` gives a broad summary for mixed-type frames.
**Common Bug:** Relying on `head()` only and missing dtype or null issues.
**Official Documentation URL:** [DataFrame.info](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.info.html)

## Entry 2: Load CSV

**Problem:** Read CSV with correct schema and memory efficiency.
**Trigger:** You need production-style CSV ingestion.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv(
    "sales.csv",
    usecols=["order_id", "customer_id", "order_date", "amount"],
    dtype={"order_id": "string", "customer_id": "string", "amount": "float64"},
    parse_dates=["order_date"],
    na_values=["", "NA", "null"],
)
```

**Minimal Notes:** Specify `dtype`, `usecols`, and `parse_dates` early to reduce downstream cleanup.
**Common Bug:** Letting Pandas infer everything and ending up with object dtypes or slow reads.
**Official Documentation URL:** [read_csv](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html)

## Entry 3: Load Excel / Parquet / JSON

**Problem:** Read common analytics formats.
**Trigger:** Your source is not CSV.
**Snippet:**

```python
import pandas as pd

xls = pd.read_excel("sales.xlsx", sheet_name="Sheet1")
parquet_df = pd.read_parquet("sales.parquet")
json_df = pd.read_json("sales.json", lines=True)
```

**Minimal Notes:** Use the format-specific reader instead of converting through CSV. `lines=True` is common for newline-delimited JSON.
**Common Bug:** Using the wrong JSON mode for NDJSON files.
**Official Documentation URL:** [read_excel](https://pandas.pydata.org/docs/reference/api/pandas.read_excel.html)

## Entry 4: Select columns

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

## Entry 5: Filter rows

**Problem:** Keep rows matching a condition.
**Trigger:** You need an in-memory query.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
high_value = df[(df["amount"] > 1000) & (df["status"] == "paid")]
```

**Minimal Notes:** Use `&` and `|` with parentheses, not `and` / `or`.
**Common Bug:** Missing parentheses in boolean indexing.
**Official Documentation URL:** [Boolean indexing](https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing)

## Entry 6: Sort data

**Problem:** Order rows by one or more columns.
**Trigger:** You need ranking or presentation order.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
sorted_df = df.sort_values(["customer_id", "order_date"], ascending=[True, False])
```

**Minimal Notes:** `sort_values` is stable enough for most workflows and supports per-column sort direction.
**Common Bug:** Sorting by strings when you expected numeric or datetime order.
**Official Documentation URL:** [DataFrame.sort_values](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_values.html)

## Entry 7: Rename columns

**Problem:** Standardize or clean column names.
**Trigger:** You need canonical names for downstream code.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
df = df.rename(columns={"Order ID": "order_id", "Order Date": "order_date"})
```

**Minimal Notes:** `rename` is safer than manual reassignment when changing only some columns.
**Common Bug:** Renaming a temporary slice and assuming the parent frame changed.
**Official Documentation URL:** [DataFrame.rename](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rename.html)

## Entry 8: Assign new columns

**Problem:** Create derived features.
**Trigger:** You need transformations without breaking chaining.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
df = df.assign(
    amount_usd=lambda x: x["amount"] * 1.08,
    is_large_order=lambda x: x["amount"] > 1000,
)
```

**Minimal Notes:** `assign` is chain-friendly and avoids some copy confusion.
**Common Bug:** Reusing mutated state instead of creating a clear transformation step.
**Official Documentation URL:** [DataFrame.assign](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html)

## Entry 9: Drop rows or columns

**Problem:** Remove unwanted data.
**Trigger:** You need to exclude fields or bad records.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
df = df.drop(columns=["temporary_flag"])
df = df.drop(index=[0, 1])
```

**Minimal Notes:** Prefer explicit `columns=` and `index=` for readability.
**Common Bug:** Confusing row labels with positional indices.
**Official Documentation URL:** [DataFrame.drop](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html)

## Entry 10: Handle missing values

**Problem:** Detect, drop, or fill nulls.
**Trigger:** Your data has gaps.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
df["amount"] = df["amount"].fillna(0)
df["status"] = df["status"].ffill()
clean = df.dropna(subset=["order_id", "amount"])
```

**Minimal Notes:** `fillna`, `ffill`, `bfill`, and `dropna` cover most missing-data workflows.
**Common Bug:** Filling missing numeric data with strings and changing dtype to object.
**Official Documentation URL:** [DataFrame.fillna](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.fillna.html)

## Entry 11: Remove duplicates

**Problem:** Deduplicate records.
**Trigger:** You suspect repeated rows or keys.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
deduped = df.drop_duplicates(subset=["order_id"], keep="last")
```

**Minimal Notes:** Use `subset` to define the business key. `keep="last"` is useful after sorting by recency.
**Common Bug:** Dropping full-row duplicates when duplicate keys matter more than exact row equality.
**Official Documentation URL:** [DataFrame.drop_duplicates](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html)

## Entry 12: Convert dtypes

**Problem:** Normalize columns to better types.
**Trigger:** You need nullable integers, booleans, or strings.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
df = df.convert_dtypes()
df["amount"] = df["amount"].astype("Float64")
```

**Minimal Notes:** `convert_dtypes()` is a fast first pass for modern nullable dtypes. `astype()` is for explicit control.
**Common Bug:** Leaving numeric data as object dtype and slowing all downstream operations.
**Official Documentation URL:** [DataFrame.convert_dtypes](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.convert_dtypes.html)

## Entry 13: Parse datetimes

**Problem:** Convert text to timestamps.
**Trigger:** You need time-series operations.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
df["order_date"] = pd.to_datetime(df["order_date"], utc=True, errors="coerce")
```

**Minimal Notes:** `errors="coerce"` is useful for dirty input. `utc=True` avoids timezone ambiguity.
**Common Bug:** Comparing naive and timezone-aware timestamps.
**Official Documentation URL:** [to_datetime](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html)

## Entry 14: Timezone conversion

**Problem:** Localize or convert timestamps.
**Trigger:** Your timestamps cross timezones.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"ts": pd.date_range("2026-01-01", periods=3, freq="D")})
df["ts"] = df["ts"].dt.tz_localize("UTC")
df["ts_local"] = df["ts"].dt.tz_convert("Europe/Oslo")
```

**Minimal Notes:** `tz_localize` attaches a timezone; `tz_convert` changes it.
**Common Bug:** Calling `tz_convert` on naive timestamps.
**Official Documentation URL:** [Series.dt.tz_localize](https://pandas.pydata.org/docs/reference/api/pandas.Series.dt.tz_localize.html)

## Entry 15: String cleanup

**Problem:** Clean and search text columns.
**Trigger:** You need text normalization or extraction.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"email": [" Alice@Example.com ", "bob@test.org"]})
df["email_clean"] = df["email"].str.strip().str.lower()
df["domain"] = df["email_clean"].str.extract(r"@(.+)$")
```

**Minimal Notes:** Chain `.str` methods for vectorized string operations.
**Common Bug:** Applying Python string methods directly to a Series.
**Official Documentation URL:** [Series.str](https://pandas.pydata.org/docs/reference/series.html#string-handling)

## Entry 16: Categorical encoding

**Problem:** Store repeated labels efficiently.
**Trigger:** You have low-cardinality string columns.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"tier": ["gold", "silver", "gold"]})
df["tier"] = df["tier"].astype("category")
df["tier"] = df["tier"].cat.reorder_categories(["silver", "gold"], ordered=True)
```

**Minimal Notes:** Categoricals improve memory and can enforce ordering.
**Common Bug:** Comparing unordered categoricals and expecting business sort order.
**Official Documentation URL:** [Categorical dtype](https://pandas.pydata.org/docs/user_guide/categorical.html)

## Entry 17: Merge datasets

**Problem:** Join two tables on keys.
**Trigger:** You need relational data enrichment.
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

## Entry 18: Concatenate frames

**Problem:** Stack similar tables vertically or horizontally.
**Trigger:** You need to combine batches or split outputs.
**Snippet:**

```python
import pandas as pd

a = pd.DataFrame({"id": [1, 2], "value": [10, 20]})
b = pd.DataFrame({"id": [3, 4], "value": [30, 40]})

combined = pd.concat([a, b], ignore_index=True)
```

**Minimal Notes:** Use `ignore_index=True` when row identity does not matter.
**Common Bug:** Assuming `concat` performs a keyed join.
**Official Documentation URL:** [concat](https://pandas.pydata.org/docs/reference/api/pandas.concat.html)

## Entry 19: Group and aggregate

**Problem:** Summarize data by one or more keys.
**Trigger:** You need totals, counts, or custom summaries.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"region": ["NO", "NO", "SE"], "amount": [10, 15, 20]}
)

summary = (
    df.groupby("region", as_index=False)
    .agg(total_amount=("amount", "sum"), avg_amount=("amount", "mean"))
)
```

**Minimal Notes:** Named aggregations keep output columns readable.
**Common Bug:** Forgetting `as_index=False` and getting grouped keys in the index.
**Official Documentation URL:** [DataFrame.groupby](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html)

## Entry 20: Group transforms

**Problem:** Add group-level metrics back to each row.
**Trigger:** You need per-row features like group mean or share.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"region": ["NO", "NO", "SE"], "amount": [10, 15, 20]}
)

df["region_avg"] = df.groupby("region")["amount"].transform("mean")
df["share_of_region"] = df["amount"] / df["region_avg"]
```

**Minimal Notes:** `transform` preserves row count and aligns back to the original frame.
**Common Bug:** Using `agg` when you actually need same-length output.
**Official Documentation URL:** [GroupBy.transform](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.SeriesGroupBy.transform.html)

## Entry 21: Pivot data

**Problem:** Convert long data to wide layout.
**Trigger:** You need matrix-style output.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"date": ["2026-01-01", "2026-01-01", "2026-01-02"], "metric": ["sales", "visits", "sales"], "value": [10, 50, 12]}
)

wide = df.pivot(index="date", columns="metric", values="value")
```

**Minimal Notes:** `pivot` requires unique index/column pairs.
**Common Bug:** Duplicate keys causing `pivot` to fail.
**Official Documentation URL:** [DataFrame.pivot](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot.html)

## Entry 22: Pivot table

**Problem:** Aggregate while reshaping.
**Trigger:** Your long data has duplicates per cell.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"date": ["2026-01-01", "2026-01-01", "2026-01-02"], "metric": ["sales", "sales", "sales"], "value": [10, 15, 12]}
)

table = df.pivot_table(index="date", columns="metric", values="value", aggfunc="sum", fill_value=0)
```

**Minimal Notes:** `pivot_table` handles duplicate combinations through aggregation.
**Common Bug:** Using `pivot` when duplicates require aggregation.
**Official Documentation URL:** [DataFrame.pivot_table](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot_table.html)

## Entry 23: Melt wide to long

**Problem:** Normalize wide data into tidy rows.
**Trigger:** You need a long format for analysis or plotting.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "sales_q1": [10, 20], "sales_q2": [15, 25]})
long = df.melt(id_vars=["id"], var_name="quarter", value_name="sales")
```

**Minimal Notes:** `melt` is the standard inverse of wide-to-long reshaping.
**Common Bug:** Forgetting to preserve identifier columns in `id_vars`.
**Official Documentation URL:** [DataFrame.melt](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.melt.html)

## Entry 24: Stack and unstack

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

## Entry 25: Rolling metrics

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

## Entry 26: Expanding metrics

**Problem:** Compute cumulative window statistics.
**Trigger:** You need metrics over all prior rows.
**Snippet:**

```python
import pandas as pd

s = pd.Series([10, 20, 30, 40, 50])
exp_mean = s.expanding(min_periods=1).mean()
```

**Minimal Notes:** `expanding` uses all data up to each point.
**Common Bug:** Using `rolling` when you actually need full-history accumulation.
**Official Documentation URL:** [Series.expanding](https://pandas.pydata.org/docs/reference/api/pandas.Series.expanding.html)

## Entry 27: EWM smoothing

**Problem:** Smooth noisy series with exponential weighting.
**Trigger:** You need decayed averages or trend tracking.
**Snippet:**

```python
import pandas as pd

s = pd.Series([10, 20, 30, 40, 50])
ewm_mean = s.ewm(alpha=0.3, adjust=False).mean()
```

**Minimal Notes:** `ewm` is common for smoothing and online-style metrics.
**Common Bug:** Misunderstanding `adjust` and expecting the same values as a simple moving average.
**Official Documentation URL:** [Series.ewm](https://pandas.pydata.org/docs/reference/api/pandas.Series.ewm.html)

## Entry 28: Resample time series

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

## Entry 29: Interpolate missing time series

**Problem:** Fill gaps in ordered numeric data.
**Trigger:** You have sparse series with intermediate gaps.
**Snippet:**

```python
import pandas as pd

s = pd.Series([1.0, None, None, 4.0])
filled = s.interpolate(method="linear")
```

**Minimal Notes:** Interpolation is best for continuous ordered data, especially time series.
**Common Bug:** Using interpolation on unordered categorical data.
**Official Documentation URL:** [Series.interpolate](https://pandas.pydata.org/docs/reference/api/pandas.Series.interpolate.html)

## Entry 30: Datetime accessors

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

**Minimal Notes:** `.dt` is the vectorized datetime accessor.
**Common Bug:** Calling `.dt` on object dtype values that are not parsed datetimes.
**Official Documentation URL:** [Series.dt](https://pandas.pydata.org/docs/reference/series.html#datetimelike-properties)

## Entry 31: Categorical accessor

**Problem:** Inspect or modify category metadata.
**Trigger:** You need ordering or category cleanup.
**Snippet:**

```python
import pandas as pd

s = pd.Series(pd.Categorical(["low", "high", "low"], categories=["low", "medium", "high"], ordered=True))
print(s.cat.categories)
print(s.cat.codes)
s = s.cat.remove_categories(["medium"])
```

**Minimal Notes:** `.cat` exposes category-specific operations.
**Common Bug:** Trying `.cat` on a non-categorical Series.
**Official Documentation URL:** [Categorical accessor](https://pandas.pydata.org/docs/user_guide/categorical.html#categorical-accessor)

## Entry 32: Plot quick checks

**Problem:** Make fast exploratory plots.
**Trigger:** You need a visual sanity check.
**Snippet:**

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({"x": [1, 2, 3, 4], "y": [10, 15, 13, 18]})
ax = df.plot(x="x", y="y", kind="line", title="Quick check")
plt.tight_layout()
plt.show()
```

**Minimal Notes:** `.plot` is good for fast diagnostics and simple summaries.
**Common Bug:** Expecting publication-quality control from the default plot accessor.
**Official Documentation URL:** [DataFrame.plot](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.html)

## Entry 33: Memory inspection

**Problem:** Find large columns or frames.
**Trigger:** You need to reduce RAM use.
**Snippet:**

```python
import pandas as pd

df = pd.read_csv("sales.csv")
print(df.memory_usage(deep=True))
print(df.info(memory_usage="deep"))
```

**Minimal Notes:** `deep=True` matters for object columns.
**Common Bug:** Underestimating memory because object/string storage is not counted deeply.
**Official Documentation URL:** [DataFrame.memory_usage](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.memory_usage.html)

## Entry 34: Export CSV

**Problem:** Write a result table to CSV safely.
**Trigger:** You need a shareable flat-file output.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "value": [10, 20]})
df.to_csv("output.csv", index=False)
```

**Minimal Notes:** `index=False` is usually the right default for exchange files.
**Common Bug:** Accidentally exporting the index as an extra column.
**Official Documentation URL:** [DataFrame.to_csv](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_csv.html)

## Entry 35: Export Parquet

**Problem:** Save columnar analytics data.
**Trigger:** You need compact, fast IO.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "value": [10, 20]})
df.to_parquet("output.parquet", index=False)
```

**Minimal Notes:** Parquet is usually better than CSV for large analytics pipelines.
**Common Bug:** Ignoring dtype preservation and schema consistency.
**Official Documentation URL:** [DataFrame.to_parquet](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_parquet.html)

## Entry 36: JSON normalization

**Problem:** Flatten nested JSON records.
**Trigger:** Your input has nested dict/list structures.
**Snippet:**

```python
import pandas as pd

records = [
    {"id": 1, "user": {"name": "Alice", "country": "NO"}},
    {"id": 2, "user": {"name": "Bob", "country": "SE"}},
]
df = pd.json_normalize(records)
```

**Minimal Notes:** `json_normalize` is the standard way to flatten nested mappings.
**Common Bug:** Attempting manual nested extraction for large payloads.
**Official Documentation URL:** [json_normalize](https://pandas.pydata.org/docs/reference/api/pandas.json_normalize.html)

## Entry 37: Missing-value checks

**Problem:** Build null masks.
**Trigger:** You need to filter or count missing data.
**Snippet:**

```python
import pandas as pd

s = pd.Series([1, None, 3])
mask = pd.isna(s)
not_missing = pd.notna(s)
```

**Minimal Notes:** Use `isna` / `notna` instead of comparing to `None`.
**Common Bug:** Comparing directly with `== None` or `!= None`.
**Official Documentation URL:** [isna](https://pandas.pydata.org/docs/reference/api/pandas.isna.html)

## Entry 38: Numeric coercion

**Problem:** Convert messy text to numeric values.
**Trigger:** Your numeric column contains strings or bad values.
**Snippet:**

```python
import pandas as pd

s = pd.Series(["10", "20", "bad", "30"])
nums = pd.to_numeric(s, errors="coerce")
```

**Minimal Notes:** `errors="coerce"` turns invalid values into NaN for cleanup.
**Common Bug:** Leaving dirty values as strings and breaking arithmetic.
**Official Documentation URL:** [to_numeric](https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html)

## Entry 39: Choose latest row per key

**Problem:** Keep the most recent record per entity.
**Trigger:** You have repeated keys with timestamps.
**Snippet:**

```python
import pandas as pd

df = pd.DataFrame(
    {"customer_id": [1, 1, 2], "updated_at": pd.to_datetime(["2026-01-01", "2026-02-01", "2026-01-15"]), "status": ["old", "new", "active"]}
)

latest = df.sort_values("updated_at").drop_duplicates("customer_id", keep="last")
```

**Minimal Notes:** Sort before `drop_duplicates` when recency matters.
**Common Bug:** Dropping duplicates without defining which row should survive.
**Official Documentation URL:** [drop_duplicates](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html)

## Entry 40: Align data

**Problem:** Bring Series or DataFrames onto the same index.
**Trigger:** You need matching labels before arithmetic or assignment.
**Snippet:**

```python
import pandas as pd

a = pd.Series([1, 2], index=["x", "y"])
b = pd.Series([10, 20], index=["y", "z"])

left, right = a.align(b, join="outer")
```

**Minimal Notes:** Alignment is label-based, not positional.
**Common Bug:** Assuming two objects line up by row order.
**Official Documentation URL:** [Series.align](https://pandas.pydata.org/docs/reference/api/pandas.Series.align.html)

## Performance Checklist

- Specify `dtype` on read when possible.
- Use `usecols` to read fewer columns.
- Prefer vectorized `.str`, `.dt`, arithmetic, and `groupby` operations over Python loops.
- Convert repeated text columns to `category` when cardinality is low.
- Use nullable or Arrow-backed dtypes for cleaner missing-data handling.
- Use `memory_usage(deep=True)` and `info(memory_usage="deep")` to find expensive columns.
- Prefer `concat` for batch append patterns and `merge(..., validate=...)` for safe joins.
- Prefer Parquet for large analytical outputs.


## Production Checklist

- Lock schema early with explicit dtypes.
- Normalize timestamps and timezones consistently.
- Manage index explicitly with `reset_index`, `set_index`, and `ignore_index`.
- Validate joins with `validate=`.
- Avoid chained assignment; assign back to the frame.
- Check nulls and duplicates before modeling or export.
- Prefer deterministic sort order before deduplication.
- Use copy-safe transformations and clear column names.


## Quick Reference Tables

### Selection APIs

| Task | API |
| :-- | :-- |
| Select columns | `df[["a", "b"]]` |
| Select rows by label | `df.loc[...]` |
| Select rows by position | `df.iloc[...]` |
| Select single scalar | `df.at[...]`, `df.iat[...]` |
| Filter by condition | `df[mask]` |
| Query by expression | `df.query("a > 1")` |

### Indexing APIs

| Task | API |
| :-- | :-- |
| Set index | `df.set_index(...)` |
| Reset index | `df.reset_index(...)` |
| Sort index | `df.sort_index(...)` |
| Reindex | `df.reindex(...)` |
| Align labels | `obj.align(...)` |
| MultiIndex create | `pd.MultiIndex.from_*` |

### Missing Value APIs

| Task | API |
| :-- | :-- |
| Detect missing | `pd.isna`, `pd.notna` |
| Fill missing | `fillna` |
| Forward fill | `ffill` |
| Backward fill | `bfill` |
| Interpolate | `interpolate` |
| Drop missing | `dropna` |

### Reshaping APIs

| Task | API |
| :-- | :-- |
| Stack | `stack` |
| Unstack | `unstack` |
| Melt | `melt` |
| Pivot | `pivot` |
| Pivot table | `pivot_table` |
| Wide to long | `wide_to_long` |

### Merge APIs

| Task | API |
| :-- | :-- |
| Inner join | `merge(..., how="inner")` |
| Left join | `merge(..., how="left")` |
| Right join | `merge(..., how="right")` |
| Outer join | `merge(..., how="outer")` |
| Concatenate | `concat(...)` |
| Join on index | `df.join(...)` |

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

### Window APIs

| Task | API |
| :-- | :-- |
| Rolling mean | `rolling(...).mean()` |
| Rolling sum | `rolling(...).sum()` |
| Expanding mean | `expanding(...).mean()` |
| EWM mean | `ewm(...).mean()` |

### Datetime APIs

| Task | API |
| :-- | :-- |
| Parse datetimes | `pd.to_datetime(...)` |
| Date range | `pd.date_range(...)` |
| Time delta | `pd.to_timedelta(...)` |
| Extract year/month | `.dt.year`, `.dt.month` |
| Floor / ceil | `.dt.floor(...)`, `.dt.ceil(...)` |
| Localize / convert | `.dt.tz_localize(...)`, `.dt.tz_convert(...)` |

### String APIs

| Task | API |
| :-- | :-- |
| Lower / upper | `.str.lower()`, `.str.upper()` |
| Strip | `.str.strip()` |
| Contains | `.str.contains(...)` |
| Replace | `.str.replace(...)` |
| Split | `.str.split(...)` |
| Extract regex | `.str.extract(...)` |
| Length | `.str.len()` |

### Categorical APIs

| Task | API |
| :-- | :-- |
| Convert | `astype("category")` |
| Categories | `.cat.categories` |
| Codes | `.cat.codes` |
| Reorder | `.cat.reorder_categories(...)` |
| Rename | `.cat.rename_categories(...)` |
| Remove categories | `.cat.remove_categories(...)` |

## Sources

- [Pandas homepage](https://pandas.pydata.org/)
- [API reference](https://pandas.pydata.org/docs/reference/index.html)
- [User Guide](https://pandas.pydata.org/docs/user_guide/index.html)
- [DataFrame API](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)
- [Release notes](https://pandas.pydata.org/docs/whatsnew/index.html)
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: CURRENT_PROJECT_STATE_REPORT.md

[^3]: CONTENT_QUALITY_STANDARD.md

[^4]: ARCHITECTURE_FREEZE.md

[^5]: AENS-Knowledge-Layer-Specification.md

[^6]: http://arxiv.org/pdf/2303.16146.pdf

[^7]: https://karger.com/article/doi/10.1159/000534061

[^8]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9447625/

[^9]: https://zenodo.org/record/3961230/files/pandera.pdf

[^10]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8385147/

[^11]: https://arxiv.org/pdf/2312.11122.pdf

[^12]: https://www.frontiersin.org/articles/10.3389/fped.2023.1170379/pdf?isPublishedV2=False

[^13]: https://pandas.pydata.org/docs/whatsnew/index.html

[^14]: https://pandas.pydata.org/docs/whatsnew/v3.0.0.html

[^15]: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html

[^16]: https://pandas.pydata.org/pandas-docs/stable/whatsnew/

[^17]: https://pandas.pydata.org/docs/dev/index.html

[^18]: https://pandas.pydata.org/docs/reference/index.html

[^19]: https://pandas.pydata.org/docs/user_guide/index.html

[^20]: https://pandas.pydata.org/

[^21]: https://pandas.pydata.org/docs/dev/reference/api/pandas.DataFrame.__dataframe__.html

[^22]: https://github.com/pandas-dev/pandas/releases

