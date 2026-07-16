# Data Folder Directory Structure

```
data/
├── cheatsheets/
│   ├── _nav.json
│   ├── matplotlib.json
│   ├── numpy.json
│   ├── pandas.json
│   ├── plotly-express.json
│   ├── plotly-go.json
│   ├── scikit-learn.json
│   └── seaborn.json
├── debug-guides/
│   ├── _nav.json
│   ├── checkpoint-load-error.json
│   ├── cuda-out-of-memory.json
│   ├── dataloader-hang.json
│   ├── gpu-not-detected.json
│   ├── model-not-learning.json
│   ├── nan-loss-exploding-gradients.json
│   └── tokenizer-mismatch.json
├── decision-guides/
│   ├── _nav.json
│   ├── batch-vs-online-inference.json
│   ├── cnn-vs-vision-transformer.json
│   ├── dense-vs-sparse-retrieval.json
│   ├── kafka-vs-rabbitmq.json
│   ├── kubernetes-vs-docker-compose.json
│   ├── lora-vs-qlora.json
│   ├── mlflow-vs-weights-and-biases.json
│   ├── postgresql-vs-vector-db.json
│   ├── pytorch-vs-tensorflow.json
│   └── rag-vs-fine-tuning.json
├── models/
│   ├── dl/
│   │   ├── _categories.json
│   │   ├── _nav.json
│   │   ├── auto-encoders.json
│   │   ├── cnn.json
│   │   ├── gnn.json
│   │   ├── gru.json
│   │   ├── lstm.json
│   │   ├── mlp.json
│   │   ├── rnn.json
│   │   ├── transformer.json
│   │   ├── vae.json
│   │   └── vit.json
│   ├── llm/
│   │   ├── _categories.json
│   │   ├── _nav.json
│   │   ├── bert.json
│   │   ├── deepseek.json
│   │   ├── gemma.json
│   │   ├── gpt.json
│   │   ├── llama.json
│   │   ├── mistral.json
│   │   ├── phi.json
│   │   ├── qwen.json
│   │   ├── roberta.json
│   │   └── t5.json
│   └── ml/
│       ├── _categories.json
│       ├── _nav.json
│       ├── dbscan.json
│       ├── decision-tree.json
│       ├── k-means-clustering.json
│       ├── knn.json
│       ├── linear-regression.json
│       ├── logistic-regression.json
│       ├── naive-bayes.json
│       ├── pca.json
│       ├── random-forest.json
│       └── svm.json
├── packages/
│   ├── _nav.json
│   ├── matplotlib.json
│   ├── numpy.json
│   ├── pandas.json
│   ├── plotly-express.json
│   ├── pytorch.json
│   ├── scikit-learn.json
│   └── seaborn.json
├── patterns/
│   ├── _nav.json
│   ├── batch-inference.json
│   ├── checkpointing.json
│   ├── distributed-data-parallel.json
│   ├── early-stopping.json
│   ├── flash-attention.json
│   ├── gradient-accumulation.json
│   ├── gradient-checkpointing.json
│   ├── kv-cache.json
│   ├── learning-rate-scheduling.json
│   ├── mixed-precision.json
│   ├── prompt-caching.json
│   ├── streaming-inference.json
│   └── training-loop.json
├── principles/
│   ├── _nav.json
│   ├── bayesian-inference.json
│   ├── bias-variance-tradeoff.json
│   ├── fail-fast.json
│   ├── gradient-descent.json
│   ├── idempotency.json
│   ├── information-bottleneck.json
│   ├── kiss.json
│   ├── maximum-likelihood-estimation.json
│   ├── modularity-and-composability.json
│   ├── pareto-principle.json
│   ├── regularization.json
│   ├── separation-of-concerns.json
│   └── single-source-of-truth.json
├── problem-index/
│   └── taxonomy.json
├── registered-aliases.json
├── registered-tags.json
├── registry/
│   └── families/
│       ├── deepseek/
│       │   ├── _index.json
│       │   ├── coder-6-7b-33b.json
│       │   ├── r1-70b.json
│       │   ├── r1-0528.json
│       │   ├── r1-distill.json
│       │   ├── r1-reasoner.json
│       │   ├── v3-1-chat-hybrid.json
│       │   └── v3-2-chat.json
│       ├── llama-3/
│       │   ├── _index.json
│       │   ├── 3-1-8b-instruct.json
│       │   ├── 3-1-70b-instruct.json
│       │   ├── 3-1-405b-instruct.json
│       │   ├── 3-2-3b-instruct.json
│       │   ├── 3-2-vision-11b-instruct.json
│       │   ├── 3-3-70b.json
│       │   ├── code-llama-34b-instruct.json
│       │   └── llama-guard-3-8b.json
│       └── qwen-3/
│           ├── _index.json
│           ├── 3-0.6b.json
│           ├── 3-1.7b.json
│           ├── 3-3b.json
│           ├── 3-4b.json
│           ├── 3-8b.json
│           ├── 3-30b-a3b-instruct.json
│           ├── 3-235b-a22b-instruct.json
│           ├── qwen-coder-latest.json
│           └── qwen-vl-latest.json
└── workflows/
    ├── _nav.json
    ├── agentic-tool-use-system.json
    ├── build-rag-system.json
    ├── ci-cd-for-ml-models.json
    ├── data-validation-drift-detection.json
    ├── deep-learning-experiment-lifecycle.json
    ├── feature-engineering-pipeline.json
    ├── fine-tune-an-llm-with-lora-qlora.json
    ├── full-fine-tuning-a-pretrained-transformer.json
    ├── hyperparameter-optimization-workflow.json
    ├── image-classification-pipeline.json
    ├── instruction-tuning-rlhf-lite-dpo.json
    ├── llm-application-serving.json
    ├── model-deployment-batch-real-time.json
    ├── model-monitoring-observability.json
    ├── model-selection-baseline-benchmarking.json
    ├── multi-agent-orchestration.json
    ├── named-entity-recognition-pipeline.json
    ├── object-detection-pipeline.json
    ├── production-llm-cost-latency-optimization.json
    ├── prompt-evaluation-regression-testing.json
    ├── rag-evaluation-harness.json
    ├── tabular-ml-model-development-lifecycle.json
    ├── text-classification-pipeline-classical-encoder.json
    ├── transfer-learning-for-vision.json
    └── vector-database-setup-indexing-strategy.json