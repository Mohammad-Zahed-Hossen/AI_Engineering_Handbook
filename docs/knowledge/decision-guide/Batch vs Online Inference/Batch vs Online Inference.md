<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Batch vs Online Inference

## Overview

Batch inference is the right default when throughput, amortized compute cost, and predictable offline processing dominate, while online inference is the right default when user-facing latency SLAs and immediate responses dominate. The practical distinction is whether the system can tolerate queued, scheduled execution or must pay the overhead of always-on serving, autoscaling, and request isolation.[^1][^2][^3]

## Problem

The engineering decision is whether to standardize on batch inference for maximum throughput or online inference for minimal latency in production model serving. The trade-off is between resource efficiency and cost amortization on one side, and real-time responsiveness and user experience on the other.[^2][^3][^1]

## Engineering Context

### Assumptions

* You have a trained model ready for production deployment.
* You have infrastructure resources, cloud or on-premise.
* Request patterns and latency requirements are known or estimable.
* Cost optimization is a consideration but not the sole driver.


### Scope

This guide compares batch and online inference paradigms. It covers serving architecture, scheduling, autoscaling, and cost optimization.

### Out of Scope

* Model training or fine-tuning decisions.
* Specific cloud provider managed services unless paradigm-specific.
* Model compression techniques as primary topics.
* Edge-only deployment.


## Evaluation Criteria

| Criterion | Weight | Description |
| :-- | --: | :-- |
| Latency SLA | 1.0 | User-facing response time requirements. |
| Throughput Efficiency | 0.9 | Requests processed per unit compute. |
| Cost Structure | 0.9 | Capital and operational expenditure patterns. |
| Infrastructure Complexity | 0.7 | Setup, maintenance, and operational burden. |
| Fault Isolation | 0.6 | Impact scope of failures and retry semantics. |
| Scalability Pattern | 0.7 | How each paradigm handles traffic growth. |

## Options

### Option 1: Batch Inference

* **Name:** Batch Inference
* **ID:** batch-inference
* **Strengths:**
    * Maximum throughput through request amortization and GPU saturation.
    * Predictable compute scheduling and reserved capacity pricing.
    * Simpler failure handling with full-batch retry semantics.
    * Optimal for large-scale offline processing such as ETL and analytics.
    * No autoscaling cold-start latency.
* **Weaknesses:**
    * High latency is unacceptable for user-facing applications.
    * Resource waste if batch sizes are undersubscribed.
    * Queue backlog risk during traffic spikes.
    * No real-time feedback or interactive user experience.
* **Best For:** Offline analytics, recommendation system feature generation, nightly report generation, large-scale data processing, non-interactive ML pipelines.
* **Avoid When:** User-facing applications, real-time decision systems, or latency SLA below 1 second.
* **Infrastructure Required:**
    * Job scheduler such as Airflow, Kubeflow, or AWS Batch.
    * Object storage for input and output.
    * GPU or CPU cluster with reserved capacity.
    * Queue system for request accumulation.
* **Operational Cost:** Low per-inference, but requires reserved capacity.
* **Maintenance Cost:** Low.
* **Scaling Complexity:** Medium.
* **Failure Modes:**
    * Partial batch failures requiring full reprocessing.
    * Queue overflow during peak accumulation.
    * Straggler tasks delaying entire batch completion.
* **Hidden Costs:**
    * Storage costs for queued requests and results.
    * Idle compute during low-traffic periods.
    * Data freshness staleness in downstream systems.


### Option 2: Online Inference

* **Name:** Online Inference
* **ID:** online-inference
* **Strengths:**
    * Real-time latency for user-facing applications.
    * Immediate feedback and interactive user experience.
    * Autoscaling elasticity for traffic variability.
    * Per-request isolation and granular error handling.
    * Dynamic batching and continuous batching for throughput optimization.
* **Weaknesses:**
    * Higher per-inference cost due to autoscaling overhead.
    * Cold-start latency during scale-up events.
    * Complex autoscaling, load balancing, and circuit breaker logic.
    * Resource fragmentation from variable request sizes.
    * Strict SLA pressure requiring overprovisioning.
* **Best For:** Real-time APIs, chatbots, recommendation serving, fraud detection, autonomous systems, interactive applications.
* **Avoid When:** Latency is flexible, request volume is predictable and large, or cost per inference must be minimized.
* **Infrastructure Required:**
    * Inference server such as Triton, TorchServe, TF Serving, or vLLM.
    * Load balancer and API gateway.
    * Autoscaling group or Kubernetes HPA/VPA.
    * Monitoring and alerting stack.
    * Connection pooling and keep-alive management.
* **Operational Cost:** High.
* **Maintenance Cost:** High.
* **Scaling Complexity:** High.
* **Failure Modes:**
    * Autoscaling lag causing request timeouts during traffic spikes.
    * Cold-start latency from scale-to-zero configurations.
    * Cascade failures from downstream dependency timeouts.
    * GPU memory exhaustion from concurrent large requests.
* **Hidden Costs:**
    * Overprovisioning for SLA headroom.
    * Load balancer and networking costs.
    * Autoscaling hysteresis and thrashing.
    * Connection management overhead.


## Comparison Table

| Aspect | Batch Inference | Online Inference |
| :-- | :-- | :-- |
| Latency | Minutes to hours | Milliseconds to seconds |
| Throughput | Very high through amortization | Moderate per-request overhead |
| Cost per Inference | Low with reserved capacity | Higher with autoscaling overhead |
| User Experience | Non-interactive | Real-time and interactive |
| Resource Utilization | High during scheduled runs | Variable and demand-driven |
| Failure Scope | Full batch retry | Per-request retry and circuit break |
| Autoscaling | Manual or scheduled | Automatic or reactive |
| Infrastructure | Scheduler, queue, and workers | Load balancer, inference server, and autoscaler |
| Data Freshness | Stale between runs | Fresh and immediate |
| Operational Model | Data engineering heavy | SRE and platform engineering heavy |

## Decision Matrix

| Criterion | Importance | Winner | Reason |
| :-- | --: | :-- | :-- |
| Latency SLA | Critical | Online | Real-time applications require immediate response. [^1] |
| Throughput Efficiency | High | Batch | Batch amortization increases utilization and throughput per unit compute. [^2][^1] |
| Cost Structure | High | Batch | Reserved compute and amortization usually reduce per-inference cost. [^2][^1] |
| Infrastructure Complexity | Medium | Batch | Scheduling and queueing are simpler than full online autoscaling stacks. [^3] |
| Fault Isolation | Medium | Online | Per-request failure scope is narrower than full-batch retry. [^1] |
| Scalability Pattern | Medium | Depends | Batch fits predictable windows; online fits elastic, traffic-driven demand. [^2][^1] |

## Constraint-Based Recommendations

| Condition | Recommended Option | Reason |
| :-- | :-- | :-- |
| Latency SLA below 1 second | Online Inference | Batch cannot satisfy real-time response constraints. [^1] |
| User-facing application | Online Inference | Interactive experience depends on immediate responses. [^1] |
| Nightly ETL or feature generation | Batch Inference | High-throughput scheduled runs are the natural fit. [^1] |
| Cost per inference is the primary constraint | Batch Inference | Amortized compute typically lowers unit cost. [^2][^1] |
| Traffic is highly variable and unpredictable | Online Inference | Autoscaling better absorbs demand swings. [^1] |
| Request volume above 10K/min with flexible latency | Batch Inference | Queue-based amortization dominates when latency is flexible. [^1] |
| Fraud detection or real-time decisioning | Online Inference | Staleness is unacceptable in time-sensitive scoring. [^1] |
| Model evaluation or A/B testing at scale | Batch Inference | Large evaluation sets are more efficiently processed offline. [^1] |

## Tradeoff Analysis

| Criterion | Batch Inference | Online Inference |
| :-- | --: | --: |
| Latency SLA | 1 | 5 |
| Throughput Efficiency | 5 | 3 |
| Cost Structure | 5 | 2 |
| Infrastructure Complexity | 4 | 2 |
| Fault Isolation | 2 | 4 |
| Scalability Pattern | 3 | 4 |

## Recommendations

Recommendation: Choose batch inference for offline pipelines, feature generation, backfills, and large-scale evaluation jobs.
Confidence: High
Evidence: MLPerf-style offline scenarios, queue-based amortization, and benchmarked batch-serving patterns consistently favor throughput-first execution.[^1][^2]

Recommendation: Choose online inference for user-facing APIs, strict latency SLAs, fraud detection, and interactive systems.
Confidence: High
Evidence: Official inference serving stacks are optimized for request-response latency, autoscaling, and per-request isolation.[^3][^1]

Recommendation: Use **Depends** when the workload has both predictable large-volume processing and meaningful freshness requirements.
Confidence: Medium
Evidence: The right answer depends on whether the system is constrained more by latency or by freshness and throughput.[^2][^1]

## Use Cases

* Real-time recommendation API: Online inference with autoscaling.
* Nightly user embedding generation: Batch inference with Spark.
* Chatbot response generation: Online inference with continuous batching.
* Fraud detection pipeline: Online inference for real-time scoring.
* Monthly churn prediction: Batch inference for full customer base.
* Image classification API: Online inference with dynamic batching.
* Document embedding batch job: Batch inference for corpus indexing.


## Common Engineering Mistakes

* Forcing batch inference into user-facing applications due to cost concerns.
* Using online inference for large-scale offline analytics without considering cost.
* Ignoring cold-start latency in autoscaling configurations.
* Underestimating queue backlog growth in batch systems.
* Overprovisioning online inference without traffic-based autoscaling policies.
* Not implementing circuit breakers in online serving.
* Assuming batch inference is always cheaper.
* Neglecting data freshness requirements when choosing batch over online.


## Decision Tree

1. **Question:** Is your application user-facing or does it require real-time response?
    * **Yes Path:** Online Inference
    * **No Path:** Next question
2. **Question:** Is your request volume predictable and above 10K requests per processing window?
    * **Yes Path:** Batch Inference
    * **No Path:** Next question
3. **Question:** Is latency flexibility above 5 minutes acceptable?
    * **Yes Path:** Batch Inference
    * **No Path:** Online Inference

## Hybrid Strategy

### When Both Win

Use both when the system requires real-time serving for active users and batch processing for analytics, feature generation, or retraining. Many production stacks split online serving from offline pipelines rather than trying to force one paradigm to cover both.[^1][^2]

### Architecture Overview

Use online inference for real-time API serving with autoscaling, and batch inference for nightly feature generation, model evaluation, and backfills. Share the same model artifacts across both paths to reduce divergence.[^3][^1]

### Benefits

* Real-time user experience through the online path.
* Cost-efficient large-scale processing through the batch path.
* Consistent model versions across both paths.
* Reduced online load by precomputing batch features.


### Costs

* Dual infrastructure maintenance.
* Data synchronization between online and batch stores.
* Consistency management for model versions.
* Two operational models, typically spanning SRE and data engineering.


### Tradeoffs

* Increased system complexity.
* Potential model version drift.
* Higher total infrastructure footprint.
* Need for a feature store to bridge online and batch features.


## Migration Path

1. **Start with:** Online inference for immediate user-facing requirements.
2. **Evaluate:** Traffic patterns, latency requirements, and cost structure.
3. **Introduce:** Batch inference for offline analytics and feature generation.
4. **Integrate:** A feature store to unify online and batch feature access.
5. **Optimize:** Right-size online autoscaling and batch scheduling independently.

## Production Examples

* Netflix: Batch inference for recommendation feature generation; online for real-time personalization.
* Google Search: Batch for index scoring; online for query-time ranking.
* Uber: Online inference for ETA and pricing; batch for fraud model retraining.
* OpenAI API: Online inference with continuous batching for LLM serving.[^2]
* Stripe: Online inference for fraud detection with strict latency SLAs.
* Spotify: Batch inference for playlist generation; online for real-time recommendations.


## Further Study

### Research Papers

- Clipper: A Low-Latency Online Prediction Serving System.[^1]
- PRETZEL: Opening the Black Box of Machine Learning Prediction Serving Systems.[^1]
- vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention.[^1]
- TensorFlow Extended (TFX): A TensorFlow-based production-scale machine learning platform.[^1]
- Dynamic Batching: Scheduling GPUs for ML Inference.[^3]


### Official Documentation

- MLPerf Inference benchmarks and result pages.[^4][^1]
- NVIDIA Triton Inference Server batchers documentation.[^3]
- TorchServe documentation.[^1]
- TensorFlow Serving documentation.[^1]
- vLLM documentation.[^2]
- AWS SageMaker inference documentation.[^1]


### Benchmarks

- MLPerf Inference benchmarks for datacenter and edge.[^4][^2][^1]
- MLPerf Inference v6.0 results.[^2]
- MLPerf Inference edge benchmark results.[^4]
- NVIDIA MLPerf benchmark overview.[^5]


### Engineering Blogs

- Netflix Tech Blog: ML platform and inference.
- Uber Engineering: Michelangelo inference platform.
- Google Cloud Blog: Optimizing ML inference.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://docs.mlcommons.org/inference/

[^2]: https://mlcommons.org/2026/04/mlperf-inference-v6-0-results/

[^3]: https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html

[^4]: https://mlcommons.org/benchmarks/inference-edge/

[^5]: https://www.nvidia.com/en-us/data-center/resources/mlperf-benchmarks/

[^6]: https://ieeexplore.ieee.org/document/11382721/

[^7]: https://www.semanticscholar.org/paper/75255f28322ed89110812641ad69a6bf5ab02978

[^8]: https://ieeexplore.ieee.org/document/9969373/

[^9]: https://ieeexplore.ieee.org/document/10403070/

[^10]: https://ieeexplore.ieee.org/document/9286169/

[^11]: https://www.semanticscholar.org/paper/26a990681e11ca5c8cd41904e6da09790a308f73

[^12]: https://dl.acm.org/doi/10.1145/3799238

[^13]: https://www.semanticscholar.org/paper/799a6c5d972d7b0c52f4ba388e8c2ac7703d4623

[^14]: https://github.com/basetenlabs/triton-inference-server/blob/main/docs/user_guide/model_configuration.md

[^15]: https://triton-inference-server.github.io/pytriton/0.2.4/binding_configuration/

[^16]: https://docs.nvidia.com/deeplearning/triton-inference-server/archives/triton_inference_server_1120/triton-inference-server-guide/docs/optimization.html

[^17]: https://mlcommons.org/2025/04/mlperf-inference-v5-0-results/

[^18]: https://infohub.delltechnologies.com/en-us/p/mlperf-tm-inference-4-0-on-dell-poweredge-server-with-intel-r-5th-generation-xeon-r-cpu/

