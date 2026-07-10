<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Transformer

## 1. Decision Summary

**Summary:** The Transformer is an attention-based neural architecture that models long-range dependencies with self-attention instead of recurrence or convolution, making it the default choice for scalable sequence modeling and modern foundation-model pipelines.[^5][^16]

**Best Use Cases**

- Large language models and instruction-tuned systems where parallel pretraining and long-context modeling matter.[^16][^5]
- Machine translation and other encoder-decoder sequence-to-sequence tasks.[^16]
- Document understanding, extraction, and multimodal fusion over text-heavy or mixed-structure inputs.[^6][^11]
- Vision or speech systems that benefit from global token interactions rather than local recurrence.[^9][^12]

**Avoid When**

- Very small datasets, where the model capacity and data hunger are usually unjustified.[^16]
- Low-latency edge deployments with strict memory limits, because attention and KV cache costs are high.[^8][^16]
- Tiny tabular datasets, where classical ML often wins on simplicity and compute efficiency.
- Simple regression/classification tasks where a smaller model is sufficient.

**Strengths**

- Captures global dependencies directly with self-attention, which improves long-range context modeling.[^5][^16]
- Parallelizes well during training because tokens do not need recurrent step-by-step processing.[^16]
- Scales effectively with large datasets, large batches, and distributed hardware.[^6][^8]
- Transfers well through pretraining and fine-tuning, which makes it a strong backbone for many tasks.[^7][^11]

**Limitations**

- Self-attention has quadratic cost in sequence length, which becomes expensive for long contexts.[^19][^16]
- Deployment can be memory-heavy because attention activations and KV caches grow with context length.[^8][^16]
- Attention maps are not full explanations; they can help inspection but do not prove causal feature importance.[^7][^16]
- Transformers can be brittle under distribution shift, prompt noise, or long-context degradation.[^11][^8]

**Interpretability**
Attention weights show which tokens interact strongly, and multi-head attention exposes several relationship subspaces in parallel. Hidden representations are useful for probing, but they are still learned abstractions rather than human-readable features. Attention is only a partial signal for attribution, so it should not be treated as a complete explanation mechanism.[^14][^7][^16]

**Training Characteristics**
Transformers are trained end-to-end with gradient descent over large corpora, often using pretraining followed by fine-tuning or instruction tuning. Optimization is usually stable when paired with AdamW, warmup, dropout, residual connections, and layer normalization. Training benefits from sequence parallelism, but data scale and compute demands are high.[^11][^5][^7][^16]

**Inference Characteristics**
Encoder-only inference is highly parallel, while decoder-only or encoder-decoder generation is autoregressive and token-by-token. KV cache reduces repeated attention work during decoding but increases memory footprint with sequence length. GPU deployment is usually preferred for throughput, while CPU is mainly viable for smaller models or low-QPS serving.[^8][^16]

**Computational Characteristics**
Self-attention is $O(n^2 d)$ in time and $O(n^2)$ in attention memory per layer for sequence length $n$ and hidden size $d$. With $L$ layers, training and inference scale roughly with $O(L n^2 d)$ for the attention-heavy portion, plus FFN costs of $O(L n d \cdot \text{ffn\_dim})$. Memory scales with activations, parameters, and KV cache, and the quadratic term is the main bottleneck for long sequences.[^19][^16]

## 2. Core Understanding

**Intuition \& Learning Mechanism**
Self-attention lets each token build a weighted view of all other tokens in the sequence, so context is learned directly rather than propagated through recurrence. Multi-head attention runs several attention subspaces in parallel, which helps the model capture different dependency types at once. Positional encoding supplies order information because self-attention alone is permutation-invariant. Feed-forward networks transform each token independently after attention, while residual connections and layer normalization stabilize deep training.[^20][^14][^5][^16]

**Mathematical Intuition \& Formulation**
Given input $X \in \mathbb{R}^{n \times d}$, the model projects queries, keys, and values:

$$
Q = XW_Q,\quad K = XW_K,\quad V = XW_V
$$

Scaled dot-product attention is:

$$
\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

Multi-head attention is:

$$
\text{MHA}(X) = \text{Concat}(head_1,\dots,head_h)W_O
$$

where each head is an attention operation with its own projections. Positional encoding is added to token embeddings, commonly with sinusoidal terms in the original architecture. A Transformer layer is typically:[^22][^20][^16]

$$
Y = \text{LayerNorm}(X + \text{MHA}(X))
$$

$$
Z = \text{LayerNorm}(Y + \text{FFN}(Y))
$$

This residual-plus-normalization structure improves optimization stability and allows deep stacking.[^16]

**Assumptions**

- Large training datasets: if violated, the model overfits quickly or fails to learn robust attention patterns.
- Sequence representation: if inputs are not tokenizable or meaningful as ordered sequences, attention structure is less useful.
- Positional encoding availability: without it, order-sensitive tasks lose essential information and become permutation ambiguous.[^14][^20]
- Adequate compute resources: weak hardware makes training and serving impractical because of quadratic attention cost.[^19][^8]
- Sufficient model capacity: if too small, the model underfits long-range dependencies and multimodal interactions.

**Complexity \& Memory Complexity**
For sequence length $n$, hidden size $d$, heads $h$, and layers $L$, the dominant attention cost is $O(L n^2 d)$, with FFN cost roughly $O(L n d \cdot \text{ffn\_dim})$. Memory is $O(L n^2)$ for full attention maps during training and $O(L n d)$ for activations, plus KV cache during decoding. Scalability is strong for short to medium sequences but degrades sharply as $n$ grows because of the quadratic attention term.[^19][^16]

**Robustness**
Transformers are reasonably robust to varied sequence patterns, but token noise, adversarial prompting, and distribution shift can still destabilize outputs.[^7][^11]

**Scalability**
Scales very well with data parallelism and large compute clusters, which is one reason they dominate large-scale pretraining.[^5][^6]

**Overfitting Tendency**
They can overfit small datasets or narrow domains because high-capacity attention blocks memorize patterns quickly.

**Bias-Variance**
Increasing depth and width lowers bias but raises variance and deployment cost; stronger regularization and smaller models do the opposite.

## 3. Hyperparameter Intelligence

### d_model

**Purpose**
Sets the token representation width throughout attention and feed-forward blocks.

**Effect of Increasing**
Bias decreases, variance rises, speed slows, memory increases, and model capacity increases.

**Effect of Decreasing**
Bias rises, variance falls, speed improves, memory decreases, and representation quality drops if too small.

**Trade-offs**
Higher $d_{model}$ improves expressiveness but increases compute across every sublayer. Lower values are easier to deploy but can bottleneck attention quality.

**Tuning Priority \& Interactions**
Priority: **High**. Strongly interacts with num_heads and ffn_dim.

**Common Mistakes**
Choosing a width that does not divide cleanly by the number of heads or is too small for the task.

### num_heads

**Purpose**
Controls how many attention subspaces are learned in parallel.

**Effect of Increasing**
Bias often decreases, variance can increase, speed may drop, memory rises, and model capacity improves if $d_{model}$ is sufficient.

**Effect of Decreasing**
Bias can rise, variance may drop, speed improves, memory decreases, and representation diversity weakens.

**Trade-offs**
More heads can help capture heterogeneous relations, but too many heads can dilute per-head dimensionality and hurt efficiency.

**Tuning Priority \& Interactions**
Priority: **High**. Interacts directly with d_model and attention cost.

**Common Mistakes**
Using many heads with too small a d_model, which makes each head too narrow to learn useful structure.

### num_layers

**Purpose**
Determines depth and hierarchical feature composition.

**Effect of Increasing**
Bias decreases, variance rises, speed slows, memory increases, and capacity grows.

**Effect of Decreasing**
Bias rises, variance falls, speed improves, memory decreases, and long-range abstraction weakens.

**Trade-offs**
Deeper models usually improve performance up to a point, but they increase optimization difficulty and serving cost.

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with dropout, learning_rate, and batch_size.

**Common Mistakes**
Adding depth before verifying that optimization is stable and data scale is sufficient.

### ffn_dim

**Purpose**
Defines the intermediate expansion size in the token-wise feed-forward block.

**Effect of Increasing**
Bias decreases, variance rises, speed slows, memory increases, and model capacity improves.

**Effect of Decreasing**
Bias rises, variance falls, speed improves, memory decreases, and representation quality may suffer.

**Trade-offs**
A larger FFN often drives strong gains, but it can dominate parameter count and deployment cost.

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with d_model and num_layers.

**Common Mistakes**
Oversizing FFN while neglecting attention stability and regularization.

### dropout

**Purpose**
Regularizes attention and feed-forward activations.

**Effect of Increasing**
Bias rises, variance falls, speed may slightly decrease, memory is mostly unchanged, and model capacity is reduced.

**Effect of Decreasing**
Bias falls, variance rises, speed may improve slightly, memory is unchanged, and overfitting risk rises.

**Trade-offs**
Useful for small or noisy datasets, but excessive dropout hurts convergence and undercuts scale benefits.

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with num_layers, batch_size, and learning_rate.

**Common Mistakes**
Using too much dropout on already data-starved tasks and then blaming underfitting on architecture.

### learning_rate

**Purpose**
Controls optimization step size and stability.

**Effect of Increasing**
Bias may decrease faster early, variance and instability rise, speed improves initially, memory is unchanged, and model capacity is not directly changed.

**Effect of Decreasing**
Training becomes more stable, speed slows, memory is unchanged, and convergence can become more reliable.

**Trade-offs**
Transformers are sensitive to learning rate, so warmup and decay schedules are often necessary for stable training.

**Tuning Priority \& Interactions**
Priority: **High**. Strongly interacts with batch_size and optimizer.

**Common Mistakes**
Using a fixed rate without warmup on deep Transformer stacks.

### batch_size

**Purpose**
Affects gradient noise, throughput, and hardware utilization.

**Effect of Increasing**
Bias usually unchanged, variance of gradients decreases, speed can improve on GPU/TPU, memory increases, and model capacity is unaffected.

**Effect of Decreasing**
Gradient noise rises, speed may slow, memory decreases, and representation quality may become less stable.

**Trade-offs**
Larger batches are throughput-friendly but may require learning-rate retuning and more VRAM.

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with learning_rate, dropout, and distributed training.

**Common Mistakes**
Scaling batch size without adjusting the schedule or monitoring generalization.

### max_sequence_length

**Purpose**
Sets the context window available to the model.

**Effect of Increasing**
Bias decreases for long-context tasks, variance may rise, speed slows, memory grows sharply, and model capacity for context improves.

**Effect of Decreasing**
Bias rises on long-context tasks, variance can drop, speed improves, memory decreases, and representation quality on long dependencies weakens.

**Trade-offs**
Longer context improves accuracy for documents and conversations but increases quadratic attention cost and deployment pressure.

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with memory, KV cache, and attention complexity.

**Common Mistakes**
Raising context length without checking VRAM, latency, or long-context degradation effects.

## 4. Engineering Considerations

**Dataset Suitability**
Transformers are well suited to large text corpora, long documents, machine translation, speech sequences, vision datasets, and multimodal datasets. They are especially effective when structured sequence context matters more than local recurrence.[^12][^6][^11]

**Scalability \& Parallelization**
They benefit strongly from GPU acceleration, TPU training, distributed training, data parallelism, model parallelism, and mixed precision. Large-scale pretraining is one of their core strengths, but it also requires serious infrastructure. Parallel token processing during training is a major engineering advantage over RNN-style models.[^6][^5][^16]

**Computational Cost \& Memory Behavior**
Self-attention memory grows quadratically with sequence length, which makes long-context workloads expensive. GPU VRAM usage is driven by activations, attention maps, and KV cache during inference. The main bottlenecks are long sequences, large batch sizes, and wide hidden states.[^19][^16]

**Robustness \& Sensitivity to Outliers**
Transformers can handle noisy tokens reasonably well, but they remain sensitive to distribution shift, adversarial prompts, and long-context degradation. Robustness improves with strong pretraining, data diversity, regularization, and careful prompt or input sanitation.[^11][^7]

**Feature Engineering Dependency \& Scaling Requirements**
Manual feature engineering is minimal compared with classical ML, but tokenization, embeddings, and positional encoding are mandatory inputs to the model. Preprocessing quality matters because poor tokenization or padding strategy directly affects attention efficiency and output quality.[^20][^14]

**Class Imbalance Behavior \& Pipeline Position**
Transformers are commonly used in pretraining, fine-tuning, and instruction tuning pipelines rather than from-scratch small-data training. They adapt well to downstream tasks through transfer learning, which reduces the need for task-specific model design.[^7][^11]

**Common Limitations**

- Quadratic attention complexity.[^16][^19]
- Large compute requirements.[^5][^6]
- Hallucination risk in generative settings.[^7]
- Long-context memory bottlenecks.[^19][^16]
- Heavy deployment cost.[^8][^16]


## 5. Comparisons

| Alternative Model | Choose Transformer When | Prefer Alternative When | Key Engineering Trade-offs |
| :-- | :-- | :-- | :-- |
| RNN | You need strong parallel training and long-range dependency modeling. | You need a lightweight recurrent baseline for very short sequences. | Transformer is faster to train and better at global context; RNN is simpler and cheaper. |
| LSTM | You need scalable sequence modeling with modern hardware parallelism. | You need a smaller recurrent model for limited compute. | Transformer usually wins on scale; LSTM can be more efficient for tiny tasks. |
| GRU | You need better context modeling than gated recurrence can provide. | You need a compact recurrent architecture. | Transformer is more expressive; GRU is lighter and easier to deploy. |
| CNN | You need global token interactions rather than local receptive fields. | The task is mostly local-pattern based and sequence length is small. | Transformer captures long-range relations better; CNN can be cheaper and more locality-biased. |
| Mamba (State Space Model) | You want a proven baseline with mature tooling and broad ecosystem support. | Long-sequence efficiency is more important than standard attention behavior. | Transformer is more established; Mamba-style models can scale more efficiently on long contexts. |
| Linear Attention Transformer | You want the standard Transformer design and robust ecosystem compatibility. | You need reduced long-sequence complexity. | Linear attention lowers complexity; standard Transformer often has stronger mature support and simplicity. |

## 6. Related Knowledge

**Related Models**

- BERT.
- GPT.
- T5.
- ViT.
- Transformer-XL.

**Alternative Models**

- RNN.
- LSTM.
- GRU.
- CNN.
- Mamba.

**Related Principles**

- Self-Attention.
- Multi-Head Attention.
- Positional Encoding.
- Residual Learning.
- Layer Normalization.
- Transfer Learning.
- Scaling Laws.

**Related Workflows**

- Language Modeling.
- Machine Translation.
- Fine-Tuning.
- Pretraining.
- Instruction Tuning.
- Retrieval-Augmented Generation.

**Related Patterns \& Guides**

- Transformer Scaling Guide.
- Fine-Tuning Guide.
- Attention Visualization Guide.
- Context Window Optimization.
- GPU Memory Optimization Guide.

**Related Packages**

- PyTorch.
- TensorFlow.
- Hugging Face Transformers.
- Accelerate.
- DeepSpeed.
- FlashAttention.


## 7. Quick Start

**Language**
Python

**Implementation Package**
PyTorch

**Code**

```python
import math
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

torch.manual_seed(42)

class ToyTextDataset(Dataset):
    def __init__(self, n=2000, seq_len=24, vocab_size=100):
        self.x = torch.randint(1, vocab_size, (n, seq_len))
        self.y = torch.roll(self.x, shifts=-1, dims=1)
        self.y[:, -1] = 0

    def __len__(self):
        return self.x.size(0)

    def __getitem__(self, idx):
        return self.x[idx], self.y[idx]

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=512):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        pos = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer("pe", pe.unsqueeze(0))

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]

class TransformerLM(nn.Module):
    def __init__(self, vocab_size, d_model=128, num_heads=4, num_layers=2, ffn_dim=256, dropout=0.1, max_seq_len=512):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, d_model)
        self.pos = PositionalEncoding(d_model, max_seq_len)
        layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=num_heads,
            dim_feedforward=ffn_dim,
            dropout=dropout,
            batch_first=True,
        )
        self.encoder = nn.TransformerEncoder(layer, num_layers=num_layers)
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, x, src_key_padding_mask=None):
        h = self.embed(x) * math.sqrt(self.embed.embedding_dim)
        h = self.pos(h)
        h = self.encoder(h, src_key_padding_mask=src_key_padding_mask)
        logits = self.head(h)
        return h, logits

def make_padding_mask(x, pad_id=0):
    return x.eq(pad_id)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
vocab_size = 100
train_ds = ToyTextDataset(n=4000, seq_len=24, vocab_size=vocab_size)
val_ds = ToyTextDataset(n=800, seq_len=24, vocab_size=vocab_size)
train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=64)

model = TransformerLM(vocab_size=vocab_size, d_model=128, num_heads=4, num_layers=2, ffn_dim=256, dropout=0.1, max_seq_len=512).to(device)
criterion = nn.CrossEntropyLoss(ignore_index=0)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

def run_eval(model, loader):
    model.eval()
    total_loss, total_tokens = 0.0, 0
    with torch.no_grad():
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            mask = make_padding_mask(x)
            h, logits = model(x, src_key_padding_mask=mask)
            loss = criterion(logits.reshape(-1, vocab_size), y.reshape(-1))
            total_loss += loss.item()
            total_tokens += 1
    return total_loss / max(total_tokens, 1)

for epoch in range(5):
    model.train()
    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        mask = make_padding_mask(x)
        optimizer.zero_grad()
        h, logits = model(x, src_key_padding_mask=mask)
        loss = criterion(logits.reshape(-1, vocab_size), y.reshape(-1))
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
    scheduler.step()
    val_loss = run_eval(model, val_loader)
    print(f"epoch={epoch+1} val_loss={val_loss:.4f}")

def generate(model, prompt, steps=10):
    model.eval()
    x = prompt.clone().to(device)
    with torch.no_grad():
        for _ in range(steps):
            _, logits = model(x)
            next_token = torch.argmax(logits[:, -1, :], dim=-1, keepdim=True)
            x = torch.cat([x, next_token], dim=1)
    return x

prompt = torch.tensor([[1, 5, 9, 2]], dtype=torch.long)
sample = generate(model, prompt, steps=8)
print("generated_tokens:", sample.detach().cpu().tolist())
```

**Explanation**
This example builds a tokenized sequence model with embeddings, positional encoding, a Transformer encoder stack, cross-entropy training, and autoregressive token generation. It demonstrates the standard production path: tokenize inputs, mask padding, train with AdamW and a scheduler, then generate by repeatedly feeding back predicted tokens.[^20][^16]

**Inputs**
Expected input tensor shape is `(batch_size, sequence_length)`. Tokenization converts raw text into token IDs, and attention masks or padding masks prevent the model from attending to padding positions.

**Outputs**
The model produces hidden states, attention-driven token representations, logits over the vocabulary, predicted tokens during generation, and loss values.

**Notes**
Tokenization and padding strategy matter because they directly affect the attention pattern and effective context window. Mixed precision is often used in production to reduce VRAM use and improve throughput. PyTorch is preferred over scikit-learn because Transformers require autograd, custom sequence layers, masking, and large-scale GPU-friendly training rather than classical tabular estimators.

## 8. Curated External Resources

1. **Attention Is All You Need**
URL: [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)
Type: guide
Why to Read: The original paper defining the Transformer architecture, self-attention, and multi-head attention.
Expected Outcome: Canonical understanding of the architecture and its motivation.
Reading Time: 60
Notes for Perplexity: Primary source for the original encoder-decoder Transformer.[^16]
2. **PyTorch Transformer Documentation**
URL: [https://pytorch.org/docs/stable/generated/torch.nn.Transformer.html](https://pytorch.org/docs/stable/generated/torch.nn.Transformer.html)
Type: documentation
Why to Read: Official implementation reference for production PyTorch usage.
Expected Outcome: Correct API-level understanding of encoder-decoder Transformer modules.
Reading Time: 20
Notes for Perplexity: Use for the canonical PyTorch module.[^16]
3. **TensorFlow MultiHeadAttention Documentation**
URL: [https://www.tensorflow.org/api_docs/python/tf/keras/layers/MultiHeadAttention](https://www.tensorflow.org/api_docs/python/tf/keras/layers/MultiHeadAttention)
Type: documentation
Why to Read: Official Keras attention layer reference for TensorFlow implementations.
Expected Outcome: Practical understanding of attention-layer construction in TF/Keras.
Reading Time: 20
Notes for Perplexity: Secondary framework reference.[^20]
4. **Stanford CS224N: Self-Attention and Transformers**
URL: [https://web.stanford.edu/class/cs224n/](https://web.stanford.edu/class/cs224n/)
Type: guide
Why to Read: Strong course material for sequence modeling, attention, and NLP practice.
Expected Outcome: Better intuition for architecture behavior and training choices.
Reading Time: 45
Notes for Perplexity: Good practitioner-level academic reference.
5. **Positional Encoding in Transformers | Deep Learning**
URL: [https://www.youtube.com/watch?v=LBsyiaEki_8](https://www.youtube.com/watch?v=LBsyiaEki_8)
Type: video
Why to Read: Clear explanation of why positional encoding is needed and how it works.
Expected Outcome: Strong intuition for order information in self-attention.
Reading Time: 35
Notes for Perplexity: Useful for implementation intuition.[^22][^19]
<span style="display:none">[^1][^10][^13][^15][^17][^18][^2][^21][^3][^4]</span>

<div align="center">⁂</div>

[^1]: ARCHITECTURE_FREEZE.md

[^2]: AENS-Knowledge-Layer-Specification.md

[^3]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^4]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^5]: https://www.nature.com/articles/s41598-024-55483-x

[^6]: https://www.nature.com/articles/s41598-025-22752-2

[^7]: https://ieeexplore.ieee.org/document/11024027/

[^8]: https://arxiv.org/abs/2509.18424

[^9]: https://www.tandfonline.com/doi/full/10.1080/15502287.2025.2499263

[^10]: https://linkinghub.elsevier.com/retrieve/pii/S0360835224004224

[^11]: https://ieeexplore.ieee.org/document/11117009/

[^12]: https://iopscience.iop.org/article/10.1088/2057-1976/ad7594

[^13]: https://www.datacamp.com/tutorial/how-transformers-work

[^14]: https://www.youtube.com/watch?v=dWkm4nFikgM

[^15]: https://medium.com/@lixue421/understanding-positional-encoding-in-transformers-2c7336728be5

[^16]: https://myengineeringpath.dev/genai-engineer/transformer-architecture/

[^17]: https://blog.davemdavis.net/2026/01/16/the-transformer-architecture/

[^18]: https://medium.com/@lokaregns/understanding-positional-encoding-in-transformers-38b21cbc1662

[^19]: https://www.youtube.com/watch?v=LBsyiaEki_8

[^20]: https://www.geeksforgeeks.org/nlp/positional-encoding-in-transformers/

[^21]: https://www.youtube.com/watch?v=lZeaEqixmjY

[^22]: https://www.youtube.com/watch?v=kLHQGN6xmM0

