Here is the rewritten optimized prompt for **CNN vs Vision Transformer**, maintaining the exact same schema, section ordering, and field names from the LoRA vs QLoRA template:

---

# AENS Decision Guide Resource Prompt — CNN vs Vision Transformer

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal Computer Vision Engineer** responsible for making production-grade architecture decisions for image understanding and visual perception systems.

Generate the decision guide resource using the exact target specifications, architectural baseline, and instructions below.

---

## AENS Knowledge Ingestion Pipeline Integration

This prompt is designed to work with the AENS Production Knowledge Ingestion Pipeline. After Perplexity generates the Markdown content, use the `knowledge_ingestion_prompt (Finalize).md` to convert it to JSON.

**Schema Mapping Reference:**
* The generated Markdown will be converted to JSON matching `lib/schemas/decision-guide.ts`
* All sections below map directly to schema fields
* Preserve exact structure for lossless JSON transformation

---

# Target Decision Guide Specifications

* **Target Decision Guide Name:** `CNN vs Vision Transformer`
* **Decision Guide Category:** `vision`
* **Problem Statement:** Choosing the optimal neural network architecture between Convolutional Neural Networks (CNNs) and Vision Transformers (ViTs) for production computer vision tasks across classification, detection, segmentation, and video understanding.
* **Core Decision Options:**
  1. **CNN** - Convolutional architectures with inductive biases for locality and translation equivariance
  2. **Vision Transformer (ViT)** - Self-attention-based architectures with global receptive fields and patch-based tokenization
* **Primary Engineering Trade-offs:**
  * Inductive bias vs representation flexibility
  * Data efficiency vs scaling potential
  * Compute efficiency vs model capacity
  * Deployment optimization vs accuracy ceiling
  * Interpretability vs emergent capabilities

---

# Canonical Reference Implementation

Treat this decision guide as comparing the following baseline production vision systems:

### CNN
* **Framework:** PyTorch / TensorFlow
* **Architecture:** ResNet, EfficientNet, ConvNeXt, RegNet
* **Compute Profile:** O(H·W·K²·C_in·C_out) per layer with local receptive fields
* **Use Case:** When data efficiency, deployment optimization, and hardware compatibility are paramount

### Vision Transformer
* **Framework:** PyTorch (timm, Hugging Face)
* **Architecture:** ViT, Swin Transformer, DeiT, DINOv2
* **Compute Profile:** O(N²·D) self-attention with global receptive fields, N = (H·W)/P² patches
* **Use Case:** When large-scale pretraining data is available and maximum accuracy on complex visual tasks is required

---

# Instructions for Perplexity Content Generation

## 1. Role & Voice

> You are a **Principal Computer Vision Engineer** responsible for designing production-grade visual perception systems for classification, detection, segmentation, and video understanding.

Document internal architecture decisions for experienced AI platform engineers.

Never explain:
* what a convolution is
* what self-attention means at a basic level
* how image classification works
* beginner API concepts

Every paragraph should help an engineer make architecture selection, training infrastructure, and deployment optimization decisions.

---

## 2. Objective & Trade-off Philosophy

The resource must answer:

> **"When should I choose CNNs over Vision Transformers for production computer vision, and what are the concrete engineering trade-offs in accuracy, data efficiency, compute cost, deployment, and scaling?"**

Every section should address:

### Decision Matrix
Every evaluation criterion must include:
* **Default** - The recommended approach
* **Alternative** - The other option
* **Trade-off** - What is being traded
* **Scale Trigger** - When the trade-off becomes significant
* **Failure Prevented** - What failure mode this prevents

### Uncertainty Handling
For criteria where evidence is mixed or context-dependent, use **"Depends"** as the winner and provide explicit justification. Not every comparison has a clear winner.

### Quantitative Evidence
Prefer quantitative values whenever supported by primary sources:
* Instead of "More data efficient" → "Requires ~10× less pretraining data to match accuracy on ImageNet"
* Instead of "Faster inference" → "~2-5× faster on edge devices with INT8 quantization"
* Instead of "Better accuracy" → "Achieves 88.6% top-1 on ImageNet vs 87.3% for comparable CNN"

### Evidence vs Recommendation
Separate **Engineering Evidence** (what the data shows) from **Engineering Recommendation** (what to do). Evidence must be traceable; recommendations may include confidence levels.

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

Prefer evidence in this order:
1. ViT paper (Google Research, ICLR 2021)
2. ConvNeXt paper (Meta AI, CVPR 2022)
3. DeiT paper (Facebook AI, ICLR 2021)
4. EfficientNet paper (Google, ICML 2019)
5. ImageNet benchmark leaderboards (Papers With Code)
6. MLPerf Inference benchmarks
7. Conference proceedings (CVPR, ICCV, ECCV, NeurIPS)
8. Engineering blogs only when authored by primary contributors

Avoid:
* Medium
* personal blogs
* AI-generated summaries
* SEO articles

Every engineering recommendation must be traceable to a reputable source.

---

## 4. Citation Expectations

Use Markdown footnotes.

Every engineering claim must reference:
* research papers
* official documentation
* ImageNet/MLPerf benchmarks
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

## 6. Production Engineering Tradeoffs

For each option, explicitly address these production engineering dimensions:

* **Implementation Complexity** - How difficult is it to set up and configure?
* **Operational Burden** - What ongoing maintenance is required?
* **Maintenance Burden** - How hard is it to update or modify?
* **Failure Recovery** - How easy is it to debug and recover from failures?
* **Observability** - What metrics and monitoring are available?
* **Long-term Scalability** - How does it handle growth?
* **Vendor Dependency** - What external dependencies exist?
* **Engineering Team Requirements** - What skills are needed?

---

## 7. Confidence Levels

For each recommendation, include a confidence level:

* **High** - Multiple primary sources agree, reproducible evidence
* **Medium** - Some evidence, but context-dependent or limited studies
* **Low** - Limited evidence, mostly theoretical or anecdotal

Format:
```
Recommendation: Choose CNNs for edge deployment and data-constrained environments.
Confidence: High
Evidence: ConvNeXt paper, MLPerf edge benchmarks, EfficientNet studies
```

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# CNN vs Vision Transformer

## Overview

Provide a 2-4 sentence overview describing the computer vision architecture decision between CNNs and Vision Transformers, focusing on inductive biases, data efficiency, scaling behavior, and production deployment considerations.

---

## Problem

State the engineering decision problem: When building production computer vision systems, choosing between CNNs with strong inductive biases and Vision Transformers with global attention involves critical trade-offs in data requirements, compute efficiency, accuracy scaling, and deployment constraints.

---

## Engineering Context

### Assumptions
* You are selecting a backbone architecture for image or video understanding
* You have access to GPU training infrastructure
* Dataset size and quality vary across tasks
* Deployment targets range from edge to cloud

### Scope
This guide compares CNNs and Vision Transformers for computer vision tasks. It covers classification, object detection, segmentation, and feature extraction.

### Out of Scope
* Pure NLP or multi-modal architectures
* Generative models (diffusion, GANs)
* Non-deep-learning computer vision (SIFT, HOG)
* Specific framework implementations

---

## Evaluation Criteria

List 4-6 evaluation criteria with weights (0-1) and descriptions:

1. **Data Efficiency** (weight: 1.0) - Performance with limited training data
2. **Compute Efficiency** (weight: 0.9) - FLOPs, memory, and inference latency
3. **Accuracy Scaling** (weight: 0.9) - Performance ceiling with large data and compute
4. **Deployment Optimization** (weight: 0.8) - Edge compatibility, quantization, pruning
5. **Training Stability** (weight: 0.7) - Ease of convergence and hyperparameter sensitivity
6. **Transfer Learning** (weight: 0.7) - Pretrained model availability and fine-tuning efficiency

---

## Options

### Option 1: CNN

* **Name:** CNN (Convolutional Neural Network)
* **ID:** cnn
* **Strengths:**
  * Strong inductive biases (locality, translation equivariance) enable data-efficient training
  * Mature deployment stack (TensorRT, ONNX, CoreML, OpenVINO)
  * Excellent hardware optimization and INT8 quantization support
  * Lower memory footprint and FLOPs for equivalent capacity
  * Proven track record across all vision tasks
* **Weaknesses:**
  * Limited receptive field without dilated convolutions or attention hybrids
  * Lower accuracy ceiling on very large datasets compared to ViTs
  * Less effective at capturing long-range spatial relationships
  * Architectural design requires more manual tuning (depth, width, resolution)
* **Best For:** Edge deployment, data-constrained environments, real-time inference, resource-limited hardware
* **Avoid When:** Maximum accuracy on large-scale data is required and compute budget is unconstrained
* **Infrastructure Required:**
  * GPU training cluster
  * Standard deep learning framework (PyTorch/TensorFlow)
  * Deployment optimization tools (TensorRT, ONNX Runtime)
* **Operational Cost:** Low to moderate - mature optimization tooling
* **Maintenance Cost:** Low - well-understood failure modes
* **Scaling Complexity:** Medium - data parallelism standard
* **Failure Modes:**
  * Overfitting on small datasets despite inductive biases
  * Receptive field limitations on large images
  * Vanishing gradients in very deep architectures
* **Hidden Costs:**
  * Manual architecture search for optimal depth/width
  * Multi-scale feature fusion engineering
  * Domain-specific adaptation effort

### Option 2: Vision Transformer

* **Name:** Vision Transformer (ViT)
* **ID:** vision-transformer
* **Strengths:**
  * Global receptive field via self-attention captures long-range dependencies
  * Superior scaling with data and model size (power-law behavior)
  * Unified architecture across vision tasks (classification, detection, segmentation)
  * Strong self-supervised pretraining capabilities (MAE, DINO, iBOT)
  * Competitive or superior accuracy on large-scale benchmarks
* **Weaknesses:**
  * Requires large pretraining datasets (~14M+ images) for strong performance
  * Higher compute and memory requirements (quadratic attention cost)
  * Less mature edge deployment and quantization support
  * More sensitive to hyperparameters (learning rate, warmup, augmentation)
  * Patch tokenization loses fine-grained spatial information
* **Best For:** Large-scale pretraining, complex scene understanding, multi-task learning, research environments
* **Avoid When:** Edge deployment, real-time inference, or data is limited (<1M images)
* **Infrastructure Required:**
  * Large GPU cluster for pretraining
  * High-memory GPUs (attention is memory-intensive)
  * Distributed training infrastructure
  * Self-supervised pretraining pipeline (optional)
* **Operational Cost:** High - large compute for pretraining and fine-tuning
* **Maintenance Cost:** Moderate - evolving architecture variants
* **Scaling Complexity:** High - requires careful attention to memory and distributed training
* **Failure Modes:**
  * Poor convergence without sufficient data or careful hyperparameter tuning
  * Attention map collapse or uniform attention
  * Memory exhaustion on high-resolution inputs
  * Overfitting without strong regularization
* **Hidden Costs:**
  * Large-scale pretraining compute investment
  * Self-supervised pretraining pipeline engineering
  * Hyperparameter search for stable training
  * Deployment optimization for non-standard ops

---

## Comparison Table

| Aspect | CNN | Vision Transformer |
|--------|-----|-------------------|
| Inductive Bias | Strong (locality, equivariance) | Minimal (must learn spatial structure) |
| Data Efficiency | High (works with 1K-100K images) | Low (requires 1M-14M+ images) |
| Receptive Field | Local, hierarchical | Global from first layer |
| Compute (FLOPs) | Lower for equivalent capacity | Higher due to attention |
| Memory | Lower | Higher (quadratic in patch count) |
| Edge Deployment | Mature (TensorRT, CoreML) | Emerging (less optimized) |
| Quantization | Excellent INT8 support | Mixed results, attention sensitive |
| Accuracy Ceiling | Strong, but lower than ViT at scale | Higher with sufficient data |
| Pretraining | Supervised on ImageNet | Self-supervised (MAE, DINO) or supervised JFT |

---

## Decision Matrix

| Criterion | Importance | Winner | Reason |
|-----------|------------|--------|--------|
| Data Efficiency | Critical | CNN | Strong inductive biases enable learning from limited data |
| Compute Efficiency | High | CNN | Lower FLOPs and memory; mature kernel optimization |
| Accuracy Scaling | High | ViT | Superior power-law scaling with data and model size |
| Deployment Optimization | High | CNN | Mature edge stack, INT8 quantization, hardware support |
| Training Stability | Medium | CNN | More robust to hyperparameters and initialization |
| Transfer Learning | Medium | Depends | CNN for standard fine-tuning; ViT for self-supervised pretraining |

---

## Constraint-Based Recommendations

| Condition | Recommended Option | Reason |
|-----------|-------------------|--------|
| Dataset < 100K images | CNN | Data efficiency of inductive biases is critical |
| Edge / mobile deployment | CNN | Mature optimization stack and lower latency |
| Maximum accuracy on large data | ViT | Scaling behavior and global receptive field |
| Real-time inference (FPS critical) | CNN | Lower latency and better hardware utilization |
| Self-supervised pretraining available | ViT | MAE/DINO pretraining unlocks ViT potential |
| Limited compute budget | CNN | Lower FLOPs and memory per forward pass |
| Multi-task learning (detection + segmentation) | ViT | Unified backbone across tasks (Mask2Former, DINO) |
| Interpretability requirements | CNN | Filter visualization and gradient-based methods mature |

---

## Tradeoff Analysis

Rate each option on a scale of 1-5 for each criterion:

| Criterion | CNN | Vision Transformer |
|-----------|-----|-------------------|
| Data Efficiency | 5 | 2 |
| Compute Efficiency | 5 | 2 |
| Accuracy Scaling | 3 | 5 |
| Deployment Optimization | 5 | 2 |
| Training Stability | 4 | 3 |
| Transfer Learning | 4 | 4 |

---

## Recommendations

Provide clear guidance on when to choose each approach based on the evaluation criteria and constraints.

---

## Use Cases

* **Mobile app vision features:** CNN with EfficientNet-Mobile or MobileNet
* **Medical imaging with limited data:** CNN with strong augmentation and transfer learning
* **Large-scale image search:** ViT with DINOv2 embeddings
* **Autonomous vehicle perception:** CNN for real-time detection; ViT for offline scene understanding
* **Satellite imagery analysis:** ViT for global context; CNN for local feature extraction
* **Retail product recognition:** CNN for edge deployment on in-store cameras
* **Content moderation at scale:** ViT for accuracy on diverse content

---

## Common Engineering Mistakes

* Choosing ViT for small datasets without massive pretraining
* Ignoring deployment target when selecting architecture
* Assuming ViT always outperforms CNN without considering data scale
* Not leveraging self-supervised pretraining for ViTs
* Overlooking CNN hybrid architectures (ConvNeXt, CoAtNet) that blend both approaches
* Quantizing ViT attention layers without accuracy validation
* Using default ImageNet-pretrained weights for domain-specific tasks without fine-tuning
* Neglecting input resolution impact on ViT patch count and memory

---

## Decision Tree

A series of questions leading to a recommendation:

1. **Question:** Is your deployment target edge or mobile devices?
   * **Yes Path:** CNN
   * **No Path:** Next question
2. **Question:** Do you have >1M labeled images or access to large-scale self-supervised pretraining?
   * **Yes Path:** Next question
   * **No Path:** CNN
3. **Question:** Is maximum accuracy the primary metric, with latency secondary?
   * **Yes Path:** Vision Transformer
   * **No Path:** CNN (or hybrid)

---

## Hybrid Strategy

### When Both Win
When you need the data efficiency and deployment maturity of CNNs with the accuracy scaling of ViTs, or when using hybrid architectures that combine convolutional stems with transformer blocks.

### Architecture Overview
Use CNN backbones for early feature extraction and edge deployment, with ViT layers for global context aggregation in cloud-based processing. Alternatively, adopt ConvNeXt or CoAtNet as unified hybrid architectures.

### Benefits
* CNN stem provides strong local features and stable training
* Transformer blocks capture global relationships
* Maintains deployment compatibility while improving accuracy
* Reduces data requirements compared to pure ViT

### Costs
* More complex architecture design
* Dual optimization targets (local + global)
* Less standardized than pure CNN or pure ViT

### Tradeoffs
* Increased model complexity
* Harder to optimize for specific hardware
* May underperform pure approaches if not carefully designed

---

## Migration Path

1. **Start with:** CNN baseline (ResNet/EfficientNet) for rapid prototyping and deployment
2. **Evaluate:** Dataset size, compute budget, and accuracy requirements
3. **Experiment with:** ViT if data and compute allow; use self-supervised pretraining
4. **Validate:** Accuracy gains justify compute and deployment costs
5. **Scale up:** Hybrid architectures (ConvNeXt, CoAtNet) for best-of-both-worlds

---

## Production Examples

* **Google Photos:** CNN-based classification and detection at scale
* **Meta AI (DINOv2):** ViT for self-supervised visual features
* **Tesla Autopilot:** CNN backbone for real-time perception
* **OpenAI CLIP:** ViT for vision-language alignment
* **Apple CoreML:** CNN-optimized models for on-device inference
* **Microsoft Azure Vision:** ViT for cloud-based image analysis

---

## Further Study

### Research Papers
* An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (ViT, ICLR 2021)
* A ConvNet for the 2020s (ConvNeXt, CVPR 2022)
* Training data-efficient image transformers & distillation through attention (DeiT, ICLR 2021)
* EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks (ICML 2019)
* Masked Autoencoders Are Scalable Vision Learners (MAE, CVPR 2022)
* Emerging Properties in Self-Supervised Vision Transformers (DINO, ICCV 2021)

### Official Documentation
* timm (PyTorch Image Models) Documentation
* Hugging Face Transformers Vision Documentation
* TensorFlow Vision Documentation
* PyTorch Vision Documentation

### Benchmarks
* ImageNet Benchmark Leaderboard (Papers With Code)
* MLPerf Inference Benchmarks
* COCO Object Detection Leaderboard

### Engineering Blogs
* Google Research Blog: Vision Transformer
* Meta AI Research Blog: ConvNeXt and DINOv2
* PyTorch Blog: Vision Models Best Practices

---

## Suggested Meta

* **Tags:** cnn, vision-transformer, vit, computer-vision, image-classification, object-detection, backbone-architecture
* **Aliases:** cnn-vs-vit, convnet-vs-transformer, vision-backbone-decision, resnet-vs-vit
* **Keywords:** convolutional-neural-network, vision-transformer, self-attention, inductive-bias, image-recognition, backbone, efficientnet, convnext, dinov2
* **Search Tokens:** cnn vs transformer vision, resnet vs vit, convolution vs attention images, vision backbone selection
* **Difficulty:** intermediate
* **Domain:** computer-vision
* **Engineering Area:** training, inference, deployment
* **Estimated Reading Time:** 15-20 minutes
* **Prerequisites:** deep-learning-basics, image-processing, model-deployment
* **Recommended Next:** object-detection, image-segmentation, model-quantization, edge-deployment
* **Cross-Links:**
  * related_models: resnet, efficientnet, vit, convnext, swin-transformer, dinov2
  * related_packages: pytorch, torchvision, timm, transformers, tensorrt
  * related_workflows: train-vision-model, deploy-vision-model, optimize-vision-model
  * related_patterns: mixed-precision-training, batch-inference, distributed-data-parallel

---

---

# Schema Mapping Reference for JSON Conversion

After Perplexity generates the Markdown, use the `knowledge_ingestion_prompt (Finalize).md` to convert to JSON. The following mapping rules ensure lossless transformation:

## Markdown to JSON Field Mapping

| Markdown Section | JSON Schema Field | Notes |
|------------------|-------------------|-------|
| Overview | `one_sentence_summary` | Single sentence summary |
| Problem | `problem` | The engineering decision problem |
| Assumptions | `assumptions[]` | Array of assumption strings |
| Scope | `scope` | String field |
| Out of Scope | `out_of_scope[]` | Array of strings |
| Evaluation Criteria | `evaluation_criteria[]` | Each with `criterion`, `weight`, `description` |
| Options → Name | `options[].name` | Option display name |
| Options → ID | `options[].id` | Reference ID (e.g., "cnn", "vision-transformer") |
| Options → Strengths | `options[].strengths[]` | Array of strings |
| Options → Weaknesses | `options[].weaknesses[]` | Array of strings |
| Options → Best For | `options[].best_for` | String |
| Options → Avoid When | `options[].avoid_when` | String |
| Options → Infrastructure | `options[].infrastructure_required[]` | Array of strings |
| Options → Operational Cost | `options[].operational_cost` | String |
| Options → Maintenance Cost | `options[].maintenance_cost` | String |
| Options → Scaling Complexity | `options[].scaling_complexity` | "low", "medium", or "high" |
| Options → Failure Modes | `options[].failure_modes[]` | Array of strings |
| Options → Hidden Costs | `options[].hidden_costs[]` | Array of strings |
| Comparison Table | `comparison_table` | Key-value object |
| Decision Matrix | `decision_matrix[]` | Each with `criterion`, `importance`, `winner`, `reason` |
| Constraint-Based Recommendations | `constraint_recommendations[]` | Each with `condition`, `recommended_option`, `reason` |
| Tradeoff Analysis | `tradeoff_analysis[]` | Each with `criterion`, `ratings` object |
| Recommendations | `recommendations` | String with guidance |
| Use Cases | `use_cases[]` | Array of strings |
| Common Engineering Mistakes | `common_mistakes[]` | Array of strings |
| Decision Tree | `decision_tree[]` | Each with `question`, `yes_path`, `no_path`, `outcome` |
| Hybrid Strategy → When Both Win | `hybrid_strategy.when_both_wins` | String |
| Hybrid Strategy → Architecture | `hybrid_strategy.architecture_overview` | String |
| Hybrid Strategy → Benefits | `hybrid_strategy.benefits[]` | Array of strings |
| Hybrid Strategy → Costs | `hybrid_strategy.costs[]` | Array of strings |
| Hybrid Strategy → Tradeoffs | `hybrid_strategy.tradeoffs[]` | Array of strings |
| Migration Path | `migration_path[]` | Each with `step`, `description` |
| Production Examples | `production_examples[]` | Each with `system`, `why` |

## Required Base Metadata Fields

The following fields must be populated in the JSON (from BaseMetaSchema):
* `id` - Use "cnn-vs-vision-transformer"
* `title` - "CNN vs Vision Transformer"
* `slug` - "cnn-vs-vision-transformer"
* `description` - Brief description of the decision guide
* `name` - "CNN vs Vision Transformer"
* `category` - "vision"
* `created_at` - Current date (YYYY-MM-DD)
* `updated_at` - Current date (YYYY-MM-DD)
* `sources` - Array of source URLs (minimum 1)
* `tags` - Array of tags
* `keywords` - Array of keywords
* `search_tokens` - Array of search tokens
* `domain` - "computer-vision"
* `difficulty` - "intermediate"
* `engineering_area` - "training, inference, deployment"
* `estimated_reading_time` - Number in minutes
* `prerequisites` - Array of prerequisite workflow IDs
* `last_verified` - Date
* `review_frequency` - "quarterly"
* `canonical_status` - "canonical"
* `lifecycle` - "stable"
* `stability` - "stable"
* `confidence` - "production_proven"
* `engineering_maturity` - "production_ready"

## JSON Conversion Rules

1. **Tables:** Convert markdown tables to JSON objects/arrays preserving all rows and columns
2. **Lists:** Convert bulleted lists to JSON string arrays
3. **Code Blocks:** Preserve exactly as-is, only JSON-escape necessary characters
4. **URLs:** Copy exactly, no modification
5. **No Invention:** Do not create data not present in Markdown
6. **No Omission:** Do not omit any information from Markdown
7. **Order Preservation:** Maintain original order of array items

---

# Final Validation Checklist

Before outputting, verify that:

1. Decision guide category is exactly **vision**.
2. Output is semantic Markdown only.
3. At least 2 options are present with complete information.
4. Every evaluation criterion includes weight and description.
5. Decision matrix includes all required fields.
6. Every option includes strengths, weaknesses, best_for, avoid_when.
7. Comparison table is present.
8. Tradeoff analysis includes ratings for all options.
9. Constraint-based recommendations are provided.
10. Decision tree is present (if applicable).
11. Hybrid strategy is documented.
12. Migration path is provided.
13. Production examples are included.
14. Every engineering claim is footnoted.
15. Every footnote appears exactly once in **Further Study**.
16. All suggested AENS IDs use real-world common naming.
17. The output focuses on production computer vision architecture decisions rather than API documentation or introductory explanations.