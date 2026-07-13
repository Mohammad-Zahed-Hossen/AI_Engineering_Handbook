# AENS Workflow Resource Prompt — Model Selection & Baseline Benchmarking (Production Schema Aligned)

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal Machine Learning Engineer** responsible for designing production-grade model selection and benchmark evaluation pipelines.

Generate the workflow resource using the exact target specifications, architectural baseline, and instructions below.

---

# Target Workflow Specifications

* **Target Workflow Name:** `Model Selection & Baseline Benchmarking`

* **Workflow Category:** `machine-learning`

* **Starter Stack:** `scikit-learn`, `xgboost`, `lightgbm`, `catboost`, `pandas`, `numpy`, `mlflow`, `optuna`, `joblib`, `evaluate`

* **Optional Stack:** `feature-engine`, `imbalanced-learn`, `ray`, `dask`, `onnx`, `evidently`

* **Core Pipeline Steps:**

  1. **Problem Definition & Evaluation Strategy**
     (Tools: `pandas`, `scikit-learn`)
  2. **Dataset Profiling & Baseline Preparation**
     (Tools: `pandas`, `numpy`)
  3. **Baseline Model Construction**
     (Tools: `scikit-learn`)
  4. **Candidate Model Training**
     (Tools: `scikit-learn`, `XGBoost`, `LightGBM`, `CatBoost`)
  5. **Cross-Validation & Comparative Evaluation**
     (Tools: `scikit-learn`, `evaluate`)
  6. **Hyperparameter Optimization & Benchmark Refinement**
     (Tools: `Optuna`, `scikit-learn`)
  7. **Model Ranking, Selection & Experiment Tracking**
     (Tools: `MLflow`, `joblib`)
  8. **Benchmark Reporting & Production Recommendation**
     (Tools: `MLflow`, `GitHub Actions`)

* **Production Profiling Targets:**

  * Baseline reproducibility
  * Cross-validation stability
  * Benchmark fairness
  * Metric reproducibility
  * Hyperparameter optimization efficiency
  * Experiment reproducibility
  * Model ranking consistency
  * Training efficiency
  * Statistical significance of comparisons
  * Cost efficiency
  * Production readiness

* **Worked Examples Focus:**

  * **Customer Churn Benchmark Suite:** Comparing Logistic Regression, Random Forest, XGBoost, LightGBM, and CatBoost using identical preprocessing and evaluation.
  * **Credit Risk Baseline Benchmarking:** Building statistically reproducible benchmark experiments for regulatory model comparison.
  * **Production Model Selection Pipeline:** Automated benchmark generation with MLflow tracking, Optuna refinement, and deployment recommendations.

* **Canonical Evaluation Criteria:**

  * Accuracy
  * Precision
  * Recall
  * F1 Score
  * ROC-AUC
  * PR-AUC
  * Log Loss
  * Cross-Validation Mean
  * Cross-Validation Standard Deviation
  * Training Time
  * Inference Latency
  * Model Size

---

# Canonical Reference Implementation

Treat this workflow as implementing the following baseline production model benchmarking workflow unless there is a compelling engineering reason to deviate.

### Framework

* Scikit-learn

### Candidate Models

* Logistic Regression
* Random Forest
* XGBoost
* LightGBM
* CatBoost

### Hyperparameter Optimization

* Optuna

### Experiment Tracking

* MLflow

### Data Processing

* Pandas
* NumPy

### Evaluation

* Scikit-learn Metrics

### Deployment

* Docker

Do **not** replace Scikit-learn or MLflow with custom benchmarking frameworks unless a strong engineering justification is provided.

---

# Canonical Pipeline Architecture

Assume this workflow implements the following production benchmarking architecture.

Problem Definition

→ Dataset Profiling

→ Baseline Model

→ Candidate Training

→ Comparative Evaluation

→ Hyperparameter Optimization

→ Model Selection

→ Benchmark Reporting

Do not reorder or introduce additional major stages unless they represent universally accepted production model benchmarking architecture.

---

# Instructions for Perplexity Content Generation

## 1. Role & Voice

> You are a **Principal Machine Learning Engineer** responsible for designing production-grade model selection and benchmark evaluation pipelines.

Document internal benchmarking infrastructure for experienced ML engineers.

Never explain:

* what supervised learning is
* what benchmarking is
* how gradient boosting works
* beginner API concepts

Every paragraph should help an engineer make model architecture, evaluation, and deployment decisions.

---

## 2. Objective & Trade-off Philosophy

The resource must answer:

> **"How do I build a production-grade model selection and baseline benchmarking workflow that guarantees statistically reliable comparisons, reproducible evaluation, scalable experimentation, and production-ready model selection across multiple candidate algorithms?"**

Every section should address:

### Decision Matrix

Every workflow step must include:

* Default
* Alternative
* Trade-off
* Scale Trigger
* Failure Prevented

A Decision Matrix lacking any of these fields is incomplete.

---

### Failure Envelopes

Every step must document:

* Failure
* Trigger
* Downstream Effect
* Detection
* Recovery Strategy

Pipeline-level failures must additionally include:

* Origin
* Immediate Symptom
* Downstream Propagation
* Why Debugging is Difficult
* Recommended Detection Method

---

### Composition over APIs

Focus on:

* benchmark design
* baseline establishment
* candidate model comparison
* evaluation consistency
* statistical validation
* hyperparameter optimization
* experiment tracking
* model ranking
* reproducibility

Avoid:

* ML tutorials
* API syntax
* parameter documentation
* framework introductions

---

### Problem Definition

Include:

* prediction objective
* business constraints
* benchmark scope
* evaluation metric selection
* baseline definition

---

### Dataset Preparation

Include:

* immutable train/validation/test split
* stratification
* preprocessing consistency
* leakage prevention
* reproducible preprocessing

---

### Baseline Modeling

Include:

* simple baseline models
* heuristic baselines
* statistical baselines
* reproducibility
* interpretation

---

### Candidate Models

Include:

* linear models
* tree ensembles
* gradient boosting
* calibration
* reproducibility

---

### Comparative Evaluation

Include:

* cross validation
* statistical comparison
* confidence intervals
* ranking consistency
* error analysis

---

### Hyperparameter Optimization

Include:

* search space design
* Optuna studies
* pruning
* reproducibility
* computational budget

---

### Model Selection

Include:

* ranking criteria
* business constraints
* deployment readiness
* model lineage
* reproducibility

---

### Benchmark Reporting

Include:

* experiment summary
* benchmark tables
* reproducibility report
* deployment recommendation
* audit trail

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

Prefer evidence in this order:

1. Peer-reviewed papers
2. Official documentation
3. Scikit-learn documentation
4. XGBoost documentation
5. LightGBM documentation
6. CatBoost documentation
7. Optuna documentation
8. MLflow documentation
9. Model evaluation research papers
10. Conference proceedings
11. University publications
12. Engineering blogs authored by framework creators or primary contributors.

Avoid:

* Medium
* personal blogs
* AI-generated summaries
* SEO articles

Every engineering recommendation must be traceable to a reputable source.

---

### Pipeline Invariants

Identify invariants such as:

* train/validation/test partitions remain immutable
* preprocessing remains identical across models
* evaluation metrics remain consistent
* random seeds remain reproducible
* benchmark datasets remain unchanged
* experiment metadata preserves provenance
* model ranking derives from identical evaluation conditions

Explain downstream failures when invariants are violated.

---

### Verifiability

If evidence cannot be verified:

1. omit the claim
2. use `[unverified]` only as a last resort

---

### Candidate Cross References

All AENS IDs must use real-world names.

Examples:

* scikit-learn
* xgboost
* lightgbm
* catboost
* optuna
* mlflow
* evaluate

Never invent AENS-specific slugs.

---

## 4. Citation Expectations

Use Markdown footnotes.

Every engineering claim must reference:

* benchmark evaluation papers
* statistical learning papers
* official framework documentation
* reproducibility research
* model evaluation papers
* engineering reports

Every citation must appear exactly once inside **Further Study**.

No orphan citations.

---

## 5. Hard Anti-Pattern Bans

Never include:

* introductions about AI
* beginner explanations
* motivational writing
* API references
* history lessons
* obvious advice
* generic monitoring recommendations
* duplicated documentation

---

## 6. Density & Code Standards

* **Density Limits**: Worked Example Description: 2–3 sentences max; Production Profile subsections: 2–4 sentences max; Implementation Notes: 2–4 sentences max.
* **Code Authenticity**: Code examples must use authentic APIs from Scikit-learn, XGBoost, LightGBM, CatBoost, Optuna, MLflow, Pandas, NumPy, Joblib, and Evaluate. Never invent wrapper APIs.
* **Step Snippets**: Every workflow step must contain a concrete 5–12 line Python snippet illustrating only the interface contract implemented by that stage.
* **Tools Alignment**: Code examples should showcase the actual libraries listed in each step's **Tools** section.

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# Model Selection & Baseline Benchmarking

## Overview

Provide a 2–4 sentence overview describing the production model benchmarking infrastructure being constructed, baseline establishment, comparative evaluation, reproducible experimentation, candidate ranking, statistical validation, and deployment recommendation.

---

## Starter Stack

Provide only canonical production libraries.

---

## Steps

Generate **exactly 8 sequential workflow steps**.

For each step include exactly the same schema as the original workflow prompt:

* What
* Input Interface Contract
* Output Interface Contract
* Required Metadata
* Pipeline Contract
* Tools
* Decision Matrix
* Uses
* Failure Points
* Production Metrics:
  • Primary Metric
  • Expected Range
  • Alert Threshold
* Minimal Integration Example:
  • 5–12 lines
  • Demonstrate only the interface contract implemented by this step
  • Not a complete runnable script
  • No project scaffolding
  • No installation code
  • Use only libraries declared in Starter Stack or this Step

The interface contracts must define:

* Artifact
* Type
* Ownership
* Persistence
* Consumer

The 8 steps must be:

1. Problem Definition & Evaluation Strategy
2. Dataset Profiling & Baseline Preparation
3. Baseline Model Construction
4. Candidate Model Training
5. Cross-Validation & Comparative Evaluation
6. Hyperparameter Optimization & Benchmark Refinement
7. Model Ranking, Selection & Experiment Tracking
8. Benchmark Reporting & Production Recommendation

---

## Worked Examples

Provide **exactly three** worked examples:

### Example 1

Customer Churn Benchmark Suite

### Example 2

Credit Risk Baseline Benchmarking

### Example 3

Production Model Selection Pipeline

Each example contains:

* Description
* Language
* Code (15–40 lines)
* Implementation Notes

---

## Common Failure Points

Document **3–5 pipeline-wide failures**.

Each must include:

* Origin
* Trigger
* Immediate Symptom
* Downstream Propagation
* Why Debugging is Difficult
* Recommended Detection Method
* Recovery Strategy

Focus on benchmark failures such as:

* inconsistent preprocessing
* train-test contamination
* unfair model comparison
* metric inconsistency
* unstable cross-validation
* statistical overfitting
* hyperparameter search bias
* experiment reproducibility failure

---

## Production Profile

Include:

### Production Deployment

MLflow + Scikit-learn + Docker

### Scaling & Throughput

parallel benchmark execution, distributed hyperparameter optimization

### Cost & Efficiency

early pruning, experiment reuse, artifact caching

### Latency & Performance

training time, inference latency, benchmark execution efficiency

### Observability & Monitoring

MLflow experiments, benchmark reproducibility, evaluation consistency, model ranking metrics

Each subsection must discuss:

* Benefit
* Trade-off
* When not to use it
* Operational impact

---

## Evaluation Checklist

Provide measurable success criteria covering:

* Cross-validation stability
* ROC-AUC
* Precision
* Recall
* F1 Score
* Benchmark reproducibility
* Statistical significance
* Hyperparameter optimization efficiency
* Training time
* Deployment readiness

---

## Further Study

Organize URLs into:

### Official Documentation

### Research Papers

### Engineering Blogs

### University Courses

### Videos

Every URL must correspond exactly to one footnote.

Populate them with production benchmarking resources including:

* Scikit-learn
* XGBoost
* LightGBM
* CatBoost
* Optuna
* MLflow
* Evaluate
* Statistical Learning references
* Benchmark evaluation papers
* Model comparison research
* Reproducible ML research

---

## Suggested Meta

Generate:

* Tags
* Aliases
* Keywords
* Search Tokens
* Difficulty
* Domain
* Engineering Area
* Estimated Reading Time
* Prerequisites
* Recommended Next
* Next Links
* Cross-Links

Cross-links include:

* related_models
* related_packages
* related_debug_guides
* related_patterns

All identifiers must be real-world candidate IDs requiring manual verification.

Tags should be: model-selection, benchmarking, scikit-learn, mlflow, evaluation

Aliases should be: baseline-benchmarking, production-model-selection

Keywords should be: model selection, benchmark, cross validation, optuna, mlflow

Search Tokens should be: model selection workflow, baseline benchmarking, production benchmark pipeline, model comparison workflow, reproducible benchmarking

Difficulty should be: advanced

Domain should be: machine-learning

Engineering Area should be: evaluation, experimentation, model-selection

Cross-links should reference real-world candidate IDs such as:

* related_models: logistic-regression, random-forest, xgboost, lightgbm, catboost
* related_packages: scikit-learn, xgboost, lightgbm, catboost, optuna, mlflow, evaluate
* related_patterns: baseline-modeling, benchmark-evaluation, cross-validation, model-selection
* related_debug_guides: feature-leakage, unfair-model-comparison, unstable-cross-validation, benchmark-reproducibility

---

# Final Validation Checklist

Before outputting, verify that:

1. Workflow category is exactly **machine-learning**.
2. Output is semantic Markdown only.
3. Exactly **8 workflow steps** are present.
4. Every step includes a complete Decision Matrix.
5. Every step contains complete interface contracts.
6. Every step contains Production Metrics.
7. Every step contains a Minimal Integration Example.
8. Every failure analysis includes all required fields.
9. Problem definition and evaluation strategy are explicitly covered.
10. Baseline model construction and dataset profiling are explicitly covered.
11. Candidate model benchmarking and comparative evaluation are explicitly covered.
12. Hyperparameter optimization and model ranking are discussed.
13. Benchmark KPIs (ROC-AUC, F1, cross-validation stability, statistical significance, training time, benchmark reproducibility) are explicitly analyzed.
14. Every engineering claim is footnoted.
15. Every footnote appears exactly once in **Further Study**.
16. All code snippets use authentic APIs from Scikit-learn, XGBoost, LightGBM, CatBoost, Optuna, MLflow, Pandas, NumPy, Joblib, and Evaluate.
17. All suggested AENS IDs use real-world common naming.
18. Density constraints are respected.
19. The output focuses on production model selection, baseline benchmarking, statistically valid comparative evaluation, reproducible experimentation, candidate ranking, deployment recommendation, and benchmark reporting rather than API documentation or introductory explanations.