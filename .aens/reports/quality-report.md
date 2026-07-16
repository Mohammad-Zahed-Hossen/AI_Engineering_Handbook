# AENS Knowledge Quality Report

## Quality Summary

* **Overall Score**: 98%
* **Knowledge Density Score**: 100%
* **Navigation Score**: 89%
* **Ownership Score**: 100%
* **Search Discovery Score**: 100%
* **Completeness Score**: 100%

### Statistics

* **Total Files**: 139
* **Errors (Fail-the-Build)**: 0
* **Warnings**: 16
* **Broken Reference Links**: 0
* **Orphaned Pages**: 15
* **Empty/Placeholder Sections**: 0

## Detailed Issues

| Code | Severity | Category | File Path | Message | Suggested Fix | Priority |
|---|---|---|---|---|---|---|
| **KQV006** | MEDIUM | navigation | `data/decision-guides/batch-vs-online-inference.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: pattern/batch-inference, workflow/model-deployment-batch-real-time. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/cnn-vs-vision-transformer.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: workflow/image-classification-pipeline, model/vit, workflow/object-detection-pipeline. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/dense-vs-sparse-retrieval.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: workflow/build-rag-system, decision_guide/postgresql-vs-vector-db, decision_guide/rag-vs-fine-tuning. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/kafka-vs-rabbitmq.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: pattern/batch-inference. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/kubernetes-vs-docker-compose.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: workflow/agentic-tool-use-system. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/lora-vs-qlora.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: workflow/fine-tune-an-llm-with-lora-qlora, decision_guide/rag-vs-fine-tuning, registry_family/deepseek. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/mlflow-vs-weights-and-biases.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: workflow/deep-learning-experiment-lifecycle, workflow/hyperparameter-optimization-workflow, workflow/model-selection-baseline-benchmarking. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/postgresql-vs-vector-db.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: decision_guide/dense-vs-sparse-retrieval, workflow/vector-database-setup-indexing-strategy. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/pytorch-vs-tensorflow.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: debug_guide/gpu-not-detected, debug_guide/checkpoint-load-error, debug_guide/dataloader-hang. | 5 |
| **KQV006** | MEDIUM | navigation | `data/decision-guides/rag-vs-fine-tuning.json` | Orphaned page: No other pages link to this decision_guide page. | Add a reference link pointing to this page from: registry_family/llama-3, debug_guide/tokenizer-mismatch, decision_guide/dense-vs-sparse-retrieval. | 5 |
| **KQV006** | MEDIUM | navigation | `data/models/llm/phi.json` | Orphaned page: No other pages link to this model page. | Add a reference link pointing to this page from: model/deepseek, model/gemma, model/gpt. | 5 |
| **KQV006** | MEDIUM | navigation | `data/models/llm/t5.json` | Orphaned page: No other pages link to this model page. | Add a reference link pointing to this page from: model/deepseek, model/gemma, model/gpt. | 5 |
| **KQV006** | MEDIUM | navigation | `data/workflows/image-classification-pipeline.json` | Orphaned page: No other pages link to this workflow page. | Add a reference link pointing to this page from: decision_guide/cnn-vs-vision-transformer, model/vit, workflow/object-detection-pipeline. | 5 |
| **KQV006** | MEDIUM | navigation | `data/workflows/object-detection-pipeline.json` | Orphaned page: No other pages link to this workflow page. | Add a reference link pointing to this page from: decision_guide/cnn-vs-vision-transformer, workflow/image-classification-pipeline, decision_guide/pytorch-vs-tensorflow. | 5 |
| **KQV006** | MEDIUM | navigation | `data/workflows/prompt-evaluation-regression-testing.json` | Orphaned page: No other pages link to this workflow page. | Add a reference link pointing to this page from: workflow/rag-evaluation-harness, workflow/model-selection-baseline-benchmarking. | 5 |
| **KQV002** | LOW | navigation | `data/workflows/object-detection-pipeline.json` | Zero outgoing links: this page has no related content or navigation links. | Add relevant reference entries inside `related_content` list. | 3 |
