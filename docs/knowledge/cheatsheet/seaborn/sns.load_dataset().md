<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Prompt: Generate a Comprehensive sns.load_dataset() Reference Table for the AENS Seaborn Cheatsheet

Your task is to generate a production-quality reference table for the sns.load_dataset() section of the AENS Seaborn Cheatsheet.
This section is intended for quick dataset discovery, allowing engineers to immediately know which built-in dataset to use for examples, experimentation, debugging, or learning.
This is not a tutorial. Keep descriptions concise while maximizing useful information.
Objective
Generate a Markdown table documenting every officially available Seaborn built-in dataset that can be loaded using:
sns.load_dataset("<dataset_name>")

Use the latest stable Seaborn release and include only official datasets.
Do not omit any dataset.
Output Format
Create a Markdown table with the following columns:
DatasetCategoryRows × ColumnsPrimary VariablesTypical Use CasesExample
Column Requirements
Dataset
The exact dataset name used with:
sns.load_dataset("dataset_name")

Example:
tips
penguins
iris
diamonds

Category
Identify the dataset domain.
Examples:
Tabular
Classification
Regression
Time Series
Categorical
Statistical
Multivariate
Geospatial (if applicable)
Rows × Columns
Approximate dataset dimensions.
Example:
150 × 5
344 × 7
53940 × 10

Primary Variables
List the most important columns only.
Example:
species, bill_length_mm, body_mass_g

Avoid listing every column if there are many.
Typical Use Cases
Provide 2–5 concise engineering use cases.
Examples:
Scatter plots
Pair plots
Classification examples
Correlation analysis
Distribution visualization
Regression
Categorical comparison
Time series visualization
Statistical plotting
Keep this concise.
Example
Show exactly how to load the dataset.
Example:
sns.load_dataset("tips")

No additional code.
Ordering
Order datasets by practical usage frequency.
Recommended order:
tips
penguins
iris
diamonds
titanic
mpg
flights
exercise
planets
fmri
dots
attention
healthexp
car_crashes
taxis
brain_networks
anagrams
anscombe
seaice
dowjones
other official datasets (if available)
Do not order alphabetically.
Accuracy Requirements
For every dataset, verify:
Official dataset name
Current availability in the latest stable Seaborn version
Approximate dataset dimensions
Correct primary variables
Appropriate engineering use cases
Use only official Seaborn documentation and repository.
Do not use third-party sources.
Additional Section
After the table, generate a compact Dataset Selection Guide.
Example format:
If you want to...Recommended Dataset(s)
Learn categorical plots
tips, titanic
Practice pairplot
iris, penguins
Regression examples
mpg, tips
Distribution plots
penguins, diamonds
Correlation heatmaps
flights, car_crashes
Time series plots
flights, seaice
Large dataset performance testing
diamonds, taxis
Statistical visualization
anscombe, fmri
Keep this to 8–12 rows.
Quality Requirements
Cover all official sns.load_dataset() datasets.
Ensure names exactly match what sns.load_dataset() accepts.
Keep descriptions concise and high-density.
Optimize for fast lookup, not teaching.
Return only valid Markdown.


| Dataset | Category | Rows × Columns | Primary Variables | Typical Use Cases | Example |
| :-- | :-- | --: | :-- | :-- | :-- |
| tips | Categorical / Tabular | 244 × 7 | total_bill, tip, sex, smoker, day, time, size | Categorical plots, bar plots, box plots, regression, distribution checks | `sns.load_dataset("tips")` |
| penguins | Multivariate / Classification | 344 × 7 | species, island, bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g, sex | Scatter plots, pair plots, clustering, feature relationships, classification examples | `sns.load_dataset("penguins")` |
| iris | Classification / Multivariate | 150 × 5 | sepal_length, sepal_width, petal_length, petal_width, species | Pair plots, classification demos, correlation analysis, feature separation | `sns.load_dataset("iris")` |
| diamonds | Large Tabular / Regression | 53940 × 10 | carat, cut, color, clarity, price, x, y, z | Large-scale scatter plots, sampling tests, regression, performance testing | `sns.load_dataset("diamonds")` |
| titanic | Classification / Tabular | 891 × 15 | survived, pclass, sex, age, sibsp, parch, fare, embarked | Categorical comparison, missing-data exploration, survival analysis, feature analysis | `sns.load_dataset("titanic")` |
| mpg | Regression / Tabular | 398 × 9 | mpg, cylinders, displacement, horsepower, weight, acceleration, model_year, origin | Regression, relationship plots, feature correlation, distribution comparison | `sns.load_dataset("mpg")` |
| flights | Time Series / Tabular | 144 × 3 | year, month, passengers | Time series plots, heatmaps, seasonal trend visualization | `sns.load_dataset("flights")` |
| exercise | Categorical / Longitudinal | 90 × 6 | id, diet, pulse, time, kind, kind2 | Repeated-measures plots, categorical comparisons, faceting, line plots | `sns.load_dataset("exercise")` |
| planets | Time Series / Multivariate | 1035 × 6 | method, number, orbital_period, mass, distance, year | Time trends, method comparison, distribution plots, feature exploration | `sns.load_dataset("planets")` |
| fmri | Time Series / Experimental | 1064 × 5 | timepoint, signal, event, region, subject | Multi-line plots, faceting, repeated-measures analysis, regression-style trends | `sns.load_dataset("fmri")` |
| dots | Experimental / Categorical | 848 × 5 | align, choice, time, coherence, firing_rate | Line plots, categorical comparison, stimulus-response analysis | `sns.load_dataset("dots")` |
| attention | Experimental / Repeated Measures | 180 × 5 | subject, attention, solutions, score, group | Repeated-measures comparison, categorical plots, faceting | `sns.load_dataset("attention")` |
| healthexp | Time Series / Comparative | 273 × 4 | country, year, spending_usd, life_expectancy | Trend comparison, line plots, country comparisons, time series analysis | `sns.load_dataset("healthexp")` |
| car_crashes | Multivariate / Correlation | 51 × 8 | total, speeding, alcohol, not_distracted, no_previous, ins_premium, ins_losses, abbrev | Correlation heatmaps, scatter plots, feature analysis | `sns.load_dataset("car_crashes")` |
| taxis | Tabular / Regression | 6433 × 14 | pickup, dropoff, fare, tip, distance, passenger_count, payment, color | Large-data scatter plots, regression, performance testing, feature analysis | `sns.load_dataset("taxis")` |
| brain_networks | Multivariate / Matrix | 904 × 62 | network metadata, node features, connectivity values | Heatmaps, correlation analysis, high-dimensional matrix inspection | `sns.load_dataset("brain_networks")` |
| anagrams | Experimental / Repeated Measures | 252 × 5 | subidr, attnr, num1, num2, num3 | Repeated-measures plots, categorical comparison, small-sample experiments | `sns.load_dataset("anagrams")` |
| anscombe | Statistical / Benchmark | 44 × 3 | dataset, x, y | Regression examples, statistical visualization, identical-summary comparison | `sns.load_dataset("anscombe")` |
| seaice | Time Series / Environmental | 163 × 9 | time, extent, year, month, day, latitude, longitude | Seasonal time series, environmental analysis, line plots, faceting | `sns.load_dataset("seaice")` |
| dowjones | Time Series / Financial | 105 × 2 | date, value | Financial time series, line plots, trend inspection | `sns.load_dataset("dowjones")` |
| geyser | Statistical / Bivariate | 272 × 2 | duration, waiting | Scatter plots, joint plots, clustering demos, distribution analysis | `sns.load_dataset("geyser")` |
| glue | Multivariate / Benchmark | 13 × 6 | model, score, task, metric, value, baseline | Benchmark comparison, bar plots, model evaluation examples | `sns.load_dataset("glue")` |

### Dataset Selection Guide

| If you want to... | Recommended Dataset(s) |
| :-- | :-- |
| Learn categorical plots | tips, titanic |
| Practice pair plots | iris, penguins |
| Run regression examples | mpg, tips, geyser |
| Compare distributions | penguins, diamonds, iris |
| Build correlation heatmaps | car_crashes, brain_networks |
| Plot time series | flights, healthexp, seaice, dowjones, fmri |
| Test large-data performance | diamonds, taxis |
| Show repeated-measures analysis | fmri, attention, exercise, anagrams |
| Practice faceting | penguins, fmri, tips, exercise |
| Create benchmark/statistical examples | anscombe, glue |
| Explore environmental data | seaice, healthexp |
| Inspect matrix-style structure | brain_networks, car_crashes |

<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/html/2411.03431v1

[^2]: http://arxiv.org/pdf/2411.00172.pdf

[^3]: https://aclanthology.org/2021.emnlp-demo.21.pdf

[^4]: https://jmir.org/api/download?alt_name=jmir_v23i6e26139_app3.pdf\&filename=4f835833dda40371a37d7bc0c7fd7269.pdf

[^5]: http://arxiv.org/pdf/2404.14361.pdf

[^6]: https://www.mdpi.com/1424-8220/23/7/3691/pdf?version=1680492534

[^7]: https://dx.plos.org/10.1371/journal.pone.0315796

[^8]: http://arxiv.org/pdf/2308.07766.pdf

[^9]: https://seaborn.pydata.org/generated/seaborn.load_dataset.html

[^10]: https://seaborn.pydata.org/generated/seaborn.get_dataset_names.html

[^11]: https://github.com/mwaskom/seaborn-data

[^12]: https://github.com/mwaskom/seaborn/blob/master/seaborn/utils.py

[^13]: https://seaborn.pydata.org/tutorial/data_structure.html

[^14]: https://seaborn.pydata.org/tutorial/introduction.html

[^15]: https://seaborn.pydata.org/archive/0.11/tutorial/function_overview.html

[^16]: https://seaborn.pydata.org/examples/anscombes_quartet.html

[^17]: https://seaborn.pydata.org/genindex.html

[^18]: https://seaborn.pydata.org/installing.html

