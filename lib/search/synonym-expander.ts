const synonyms: Record<string, string[]> = {
  // Model & Architecture Abbreviations
  'llm': ['large language model', 'large language models', 'foundation model'],
  'cnn': ['convolutional neural network', 'convolutional network', 'convnet'],
  'rnn': ['recurrent neural network', 'vanilla rnn'],
  'lstm': ['long short-term memory'],
  'gru': ['gated recurrent unit'],
  'mlp': ['multilayer perceptron', 'multi-layer perceptron', 'dense neural network'],
  'gnn': ['graph neural network', 'message passing neural network'],
  'vit': ['vision transformer'],
  'vae': ['variational autoencoder', 'variational auto-encoder'],
  'svm': ['support vector machine', 'support vector classifier', 'svc'],
  'knn': ['k-nearest neighbors', 'k nearest neighbors', 'k-nn'],
  'pca': ['principal component analysis'],
  'ols': ['ordinary least squares'],

  // Paradigms & Techniques
  'rag': ['retrieval augmented generation', 'retrieval-augmented generation'],
  'lora': ['low-rank adaptation', 'low rank adaptation'],
  'qlora': ['quantized low-rank adaptation', 'quantized low rank adaptation'],
  'dpo': ['direct preference optimization'],
  'rlhf': ['reinforcement learning from human feedback'],
  'amp': ['automatic mixed precision', 'mixed precision'],
  'ddp': ['distributed data parallel'],
  'kv': ['key value', 'key-value', 'key-value cache'],
  'moe': ['mixture of experts'],
  
  // Package aliases / shorthand (some packages)
  'lr': ['learning rate', 'logistic regression', 'linear regression'],
  'tf': ['tensorflow'],
  'pt': ['pytorch'],
  'np': ['numpy'],
  'pd': ['pandas'],
  'plt': ['matplotlib', 'pyplot'],
  'sns': ['seaborn'],
  'sk': ['scikit-learn', 'sklearn'],
  'hf': ['huggingface', 'transformers'],
  'opt': ['optimization', 'optimizer'],
  
  // Common term equivalences
  'attention': ['self-attention', 'multi-head attention', 'flashattention'],
  'parallel': ['parallelization', 'distributed-data-parallel', 'ddp-pattern'],
  'checkpointing': ['activation-checkpointing', 'gradient-checkpointing'],
  'precision': ['mixed-precision', 'automatic-mixed-precision', 'fp16', 'bf16'],
  'caching': ['prompt-caching', 'kv-cache', 'key-value-cache'],
  
  // Model family names (for search expansion)
  'deepseek': ['deepseek', 'deepseek-llm', 'deepseek-r1', 'deepseek-v3'],
  'qwen': ['qwen', 'qwen2', 'qwen2.5', 'qwen3', 'tongyi-qianwen'],
  'llama': ['llama', 'llama-3', 'llama-3.1', 'llama-3.2', 'llama-3.3', 'meta-llama'],
  'gemma': ['gemma', 'google-gemma', 'gemma-llm'],
  'phi': ['phi', 'phi-1', 'phi-2', 'phi-3', 'phi-3.5', 'phi-4', 'microsoft-phi'],
  'mistral': ['mistral', 'mistral-llm', 'mistral-foundation-model', 'mistral-ai'],
  
  // Additional common abbreviations
  'sft': ['supervised fine-tuning', 'supervised-fine-tuning'],
  'icl': ['in-context learning'],
  'cot': ['chain of thought', 'chain-of-thought'],
  'rag-benchmark': ['rag-evaluation', 'rag-harness', 'rag-regression'],
  'vllm': ['vllm', 'volumetric-llm', 'large language model serving'],
  'trl': ['transformers reinforcement learning', 'transformers-reinforcement-learning']
};

const conceptGroups: Record<string, string[]> = {
  'rag': ['build-rag-system', 'database-decision-for-rag', 'ann-indexing-workflow', 'prompt-caching', 'vector-database-decision'],
  'fine-tuning': ['fine-tune-an-llm-with-lora-qlora', 'full-fine-tuning-a-pretrained-transformer', 'instruction-tuning-rlhf-lite-dpo', 'lora-training'],
  'parallel': ['ddp-pattern', 'distributed-data-parallel-pattern', 'distributed-data-parallel', 'gradient-all-reduce'],
  'attention': ['flash-attention', 'flashattention', 'fused-attention', 'kv-cache', 'key-value-cache', 'prompt-caching'],
  'caching': ['prompt-caching', 'kv-cache', 'key-value-cache'],
  'precision': ['mixed-precision', 'automatic-mixed-precision', 'amp']
};

function normalizeToken(token: string): string {
  return token.toLowerCase().trim();
}

export function expandQuery(query: string): {
  expandedTokens: string[];
  conceptGroupIds: string[];
} {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return { expandedTokens: [], conceptGroupIds: [] };
  }

  const tokens = normalizedQuery
    .split(/[^a-z0-9]+/)
    .map(token => token.trim())
    .filter(Boolean);

  const expandedTokens = new Set<string>();
  const conceptGroupIds = new Set<string>();

  tokens.forEach(token => {
    expandedTokens.add(token);

    const aliasValues = synonyms[token];
    if (aliasValues) {
      aliasValues.forEach(value => expandedTokens.add(normalizeToken(value)));
    }

    const conceptValue = conceptGroups[token];
    if (conceptValue) {
      conceptValue.forEach(entry => {
        expandedTokens.add(normalizeToken(entry));
        conceptGroupIds.add(entry);
      });
    }
  });

  const fullQuery = normalizedQuery.replace(/\s+/g, ' ');
  if (conceptGroups[fullQuery]) {
    conceptGroups[fullQuery].forEach(entry => {
      expandedTokens.add(normalizeToken(entry));
      conceptGroupIds.add(entry);
    });
  }

  return {
    expandedTokens: Array.from(expandedTokens),
    conceptGroupIds: Array.from(conceptGroupIds),
  };
}
