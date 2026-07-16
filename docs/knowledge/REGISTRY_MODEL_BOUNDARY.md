# Registry vs Model Boundary

**Status:** Authoritative Documentation  
**Source:** AENS Registry Architecture Review  
**Purpose:** Clarify the distinction between Registry and Model content types

---

## Overview

Both the **Registry** and **Model** content types describe AI models, but they serve different purposes and audiences within the AENS knowledge architecture.

## Model Content Type

**Purpose:** Decision support for model selection and understanding

- **Audience:** Practitioners choosing which model to use for a problem
- **Focus:** Model capabilities, strengths, limitations, and use cases
- **Key Fields:**
  - `decisionsummary` - When to use, when to avoid, strengths, limitations
  - `problem_types` - What problems the model solves
  - `hyperparameters` - Configuration parameters
  - `category` - Model category (ml/dl/llm)
- **Question Answered:** "Which model should I use for my problem?"

## Registry Content Type

**Purpose:** Deployment and operational metadata for model families

- **Audience:** Engineers deploying and operating models
- **Focus:** Hardware requirements, download locations, runtime compatibility, licensing
- **Key Fields:**
  - `hardware` - GPU memory, RAM, disk space requirements
  - `deployment` - Supported runtimes, quantization options
  - `downloads` - Where to get the model weights
  - `ecosystem` - Framework and tool compatibility
  - `license_info` - Commercial use, redistribution rights
  - `engineering_snapshot` - Production readiness, deployment complexity
- **Question Answered:** "How do I deploy and run this model?"

## Relationship Between Registry and Model

- **Model entries** can link to **Registry families** via `relatedcontent` for deployment details
- **Registry families** can link to **Model entries** via `related_models` for capability comparisons
- Both should use bidirectional relationship fields for proper navigation

## When to Use Each

| Scenario | Use |
|----------|-----|
| Choosing a model for a task | Model |
| Understanding model capabilities | Model |
| Finding model weights to download | Registry |
| Determining hardware requirements | Registry |
| Checking runtime compatibility | Registry |
| Understanding licensing terms | Registry |
| Comparing model strengths/weaknesses | Model |
| Planning production deployment | Registry |

## Data Duplication Policy

- **Model data** should NOT duplicate Registry deployment details
- **Registry data** should NOT duplicate Model capability analysis
- Cross-links should be established via typed relationships
- Each content type owns its specific domain of knowledge

## Example: Llama 3

- **Model (llm/llama-3-70b):** "Use for long-context RAG, avoid for resource-constrained edge deployment"
- **Registry (registry/families/llama-3):** "Requires 80GB GPU, supports vLLM and Transformers, commercial use allowed"