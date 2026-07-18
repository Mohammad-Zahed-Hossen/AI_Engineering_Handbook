const synonyms: Record<string, string[]> = {
  // Model & Architecture Abbreviations
  'llm': ['large language model'],
  'cnn': ['convolutional neural network'],
  'rnn': ['recurrent neural network'],
  'lstm': ['long short-term memory'],
  'gru': ['gated recurrent unit'],
  'mlp': ['multilayer perceptron'],
  'gnn': ['graph neural network'],
  'vit': ['vision transformer'],
  'vae': ['variational autoencoder'],
  'svm': ['support vector machine'],
  'knn': ['k-nearest neighbors'],
  'pca': ['principal component analysis'],
  'ols': ['ordinary least squares'],

  // Paradigms & Techniques
  'rag': ['retrieval augmented generation'],
  'lora': ['low rank adaptation'],
  'qlora': ['quantized low rank adaptation'],
  'dpo': ['direct preference optimization'],
  'rlhf': ['reinforcement learning from human feedback'],
  'amp': ['automatic mixed precision'],
  'ddp': ['distributed data parallel'],
  'kv': ['key value cache'],
  'moe': ['mixture of experts'],

  // Package aliases / shorthand
  'np': ['numpy'],
  'pd': ['pandas'],
  'sk': ['scikit-learn', 'sklearn'],
  'hf': ['huggingface', 'transformers'],

  // Common term equivalences
  'caching': ['kv-cache'],
  'precision': ['mixed-precision'],

  // Model family names (for search expansion)
  'llama': ['llama-3'],
  'qwen': ['qwen3'],
  'deepseek': ['deepseek-r1'],
  'gemma': ['google-gemma'],
  'phi': ['phi-3'],
  'mistral': ['mistral-llm'],

  // Missing abbreviations from audit
  'nn': ['neural network'],
  'cv': ['computer vision'],
};

const conceptGroups: Record<string, string[]> = {
  'rag': ['build-rag-system', 'database-decision-for-rag', 'ann-indexing-workflow', 'prompt-caching', 'vector-database-decision'],
  'fine-tuning': ['fine-tune-an-llm-with-lora-qlora', 'full-fine-tuning-a-pretrained-transformer', 'instruction-tuning-rlhf-lite-dpo', 'lora-training'],
  'parallel': ['ddp-pattern', 'distributed-data-parallel-pattern', 'distributed-data-parallel', 'gradient-all-reduce'],
  'attention': ['flash-attention', 'flashattention', 'fused-attention', 'kv-cache', 'key-value-cache', 'prompt-caching'],
  'caching': ['prompt-caching', 'kv-cache', 'key-value-cache'],
  'precision': ['mixed-precision', 'automatic-mixed-precision', 'amp'],
  'batch-inference': ['batch-inference'],
  'batch inference': ['batch-inference']
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