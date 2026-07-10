<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Long Short-Term Memory (LSTM)

## 1. Decision Summary

**Summary:** An LSTM is a gated recurrent neural network that preserves long-term dependencies through an explicit cell state and learned input, forget, and output gates, making it a stronger sequence model than vanilla RNNs for moderate-to-long temporal dependencies.[^14][^19]

**Best Use Cases**

- Time-series forecasting where medium-range history materially affects prediction quality.[^13][^14]
- Speech processing and acoustic sequence modeling where temporal continuity matters.[^13][^14]
- Sequential anomaly detection in sensor or event streams.[^14][^13]
- Sequential classification with moderate sequence lengths and limited need for full attention over the entire context.[^13][^14]

**Avoid When**

- Large-scale language models, where Transformers are the practical standard.[^16][^14]
- Very long-context NLP, where sequential computation becomes a bottleneck.[^16][^14]
- Large computer vision models, where CNNs or ViTs are usually better fits.[^14]
- High-throughput parallel sequence processing, where recurrence limits hardware utilization.[^16][^14]

**Strengths**

- The cell state provides an explicit memory path that improves gradient flow across longer sequences compared with vanilla RNNs.[^19][^14]
- Gating mechanisms let the model learn when to retain, overwrite, or expose information, which improves practical stability.[^19][^14]
- LSTMs are often robust baselines for time-series and sequence tasks when data volume and context length are moderate.[^13][^14]
- PyTorch and TensorFlow both provide mature LSTM layers for production use.[^14][^16]

**Limitations**

- Training remains sequential across timesteps, so throughput is much lower than fully parallel sequence models.[^16][^14]
- LSTMs are still more expensive than GRUs and often slower to train and infer.[^14][^16]
- Very long sequences can still be difficult to optimize, especially without careful clipping and preprocessing.[^19][^14]
- Modern Transformer architectures usually outperform LSTMs on large-scale language tasks.[^16][^14]

**Interpretability**
The cell state is the closest thing to persistent memory, but it is still a distributed latent representation rather than a directly interpretable variable. The hidden state summarizes the current timestep output, while the forget, input, and output gates control what gets retained, added, and exposed. Visualization typically focuses on hidden-state trajectories, gate activations, or probing methods, but attention-style interpretability is not native to LSTMs.[^12][^19][^14]

**Training Characteristics**
LSTMs are trained with Backpropagation Through Time, which unrolls the recurrence over timesteps and propagates gradients through the gates and cell state. The gating structure improves gradient flow relative to vanilla RNNs, but optimization still depends on good initialization, sequence handling, and gradient clipping. Convergence is often stable on moderate sequence lengths but remains sensitive to learning rate, hidden size, and sequence distribution shift.[^19][^14]

**Inference Characteristics**
Inference is sequential because each step depends on the previous hidden and cell states. This increases latency and reduces GPU parallelism compared with CNNs or Transformers. Batch inference is supported, but memory footprint still grows with sequence length and hidden size.[^14][^16]

**Computational Characteristics**
Training cost is approximately $O(n \cdot T \cdot (p h + h^2))$, where $n$ is samples, $T$ is sequence length, $p$ is features, and $h$ is hidden units. Inference is similar in asymptotic form because each timestep must still be processed sequentially. Memory usage is approximately $O(T h)$ for activations and stored states, plus parameter storage; scalability is limited by sequential dependence and unrolling cost.[^19][^14]

## 2. Core Understanding

**Intuition \& Learning Mechanism**
An LSTM improves on vanilla recurrence by separating long-term memory from immediate output flow. The cell state acts as a controlled memory highway that can carry information across many steps, while gates decide what to forget, what to add, and what to expose. This makes LSTMs useful when short-term inputs matter, but the model must also preserve older context.[^19][^14]

**Mathematical Intuition \& Formulation**
For timestep $t$, with input $x_t$, hidden state $h_{t-1}$, and cell state $c_{t-1}$, the standard LSTM computes:

$$
f_t = \sigma(W_f [h_{t-1}, x_t] + b_f)
$$

$$
i_t = \sigma(W_i [h_{t-1}, x_t] + b_i)
$$

$$
\tilde{c}_t = \tanh(W_c [h_{t-1}, x_t] + b_c)
$$

$$
c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t
$$

$$
o_t = \sigma(W_o [h_{t-1}, x_t] + b_o)
$$

$$
h_t = o_t \odot \tanh(c_t)
$$

These equations describe forget, input, candidate memory, cell update, output gate, and hidden state update. Training minimizes a task loss accumulated over time and optimized with BPTT:[^14][^19]

$$
\mathcal{L} = \sum_{t=1}^{T} \ell(y_t, \hat{y}_t)
$$

where the recurrent graph is unfolded and gradients flow through the gates and the cell state.[^19][^14]

**Assumptions**

- Ordered sequential data: if order is irrelevant, LSTM adds unnecessary complexity and latency.
- Temporal dependency: if predictions depend on prior context, the gating mechanism helps; if not, the model can overfit structure that does not matter.
- Moderate-to-long sequence relationships: if dependencies are too long or too sparse, optimization becomes harder and the gains may disappear.
- Consistent sequential patterns: if sequence dynamics change abruptly, the learned gates may not transfer well.
- Representative training sequences: if deployment sequences differ substantially, performance can drop under distribution shift.[^14][^19]

**Complexity \& Memory Complexity**
Training is roughly $O(n \cdot T \cdot (p h + h^2))$ because every timestep evaluates multiple gated affine transforms. Memory complexity is roughly $O(T h)$ for saved hidden and cell states plus activations. Compared with vanilla RNNs, the constants are larger because LSTM has more gates.[^19][^14]

**Robustness**
LSTMs are more robust than vanilla RNNs on noisy temporal patterns, but missing values, irregular sampling, and severe distribution shift still degrade performance.

**Scalability**
Scalability is limited by sequential computation and the need to retain states across time, which constrains GPU parallel efficiency.[^16][^14]

**Overfitting Tendency**
LSTMs can overfit small datasets quickly because gating improves capacity as well as memory.

**Bias-Variance**
LSTMs usually reduce bias relative to vanilla RNNs on temporal tasks, but the added flexibility can increase variance when data are limited.

## 3. Hyperparameter Intelligence

### input_size

**Purpose**
Sets the dimensionality of each timestep input vector.[^16][^14]

**Effect of Increasing**
Bias may decrease if more signal is represented. Variance, speed cost, and memory use increase because each timestep processes more features.

**Effect of Decreasing**
Bias increases if relevant features are removed. Variance may fall, speed improves, and memory use drops.

**Trade-offs**
Higher input dimensionality can improve expressive power but raises compute cost. Lower dimensionality is cheaper but can bottleneck sequence representation.

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with embeddings, feature scaling, and hidden size. Tune after deciding the input representation.

**Common Mistakes**
Passing raw categorical IDs or unscaled numeric sequences directly into the LSTM.

### hidden_size

**Purpose**
Controls the size of the hidden and cell state representations.[^16][^14]

**Effect of Increasing**
Bias tends to decrease, variance rises, speed slows, and memory grows because gate matrices become larger.

**Effect of Decreasing**
Bias rises, variance may fall, speed improves, and memory decreases.

**Trade-offs**
More hidden units improve memory capacity and temporal modeling but increase overfitting risk and latency. Smaller hidden states are more efficient but may underfit long dependencies.

**Tuning Priority \& Interactions**
Priority: **High**. Interacts strongly with num_layers, dropout, and bidirectionality. Start with modest sizes and scale only if validation metrics justify the cost.

**Common Mistakes**
Using very large hidden sizes to compensate for weak preprocessing or poor feature design.

### num_layers

**Purpose**
Stacks multiple LSTM layers to increase representational depth.[^14]

**Effect of Increasing**
Bias usually decreases, variance increases, speed decreases, and memory consumption rises because more recurrent layers are unrolled.

**Effect of Decreasing**
Bias may increase, variance may fall, speed improves, and memory use drops.

**Trade-offs**
Additional layers can capture more abstract temporal patterns but make optimization and deployment more expensive. For many production problems, one or two layers are sufficient.

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with dropout, hidden size, and sequence length. Add layers only when a single-layer baseline underfits.

**Common Mistakes**
Building deep LSTMs before proving that a shallow baseline cannot solve the task.

### dropout

**Purpose**
Regularizes stacked LSTM layers by dropping outputs between layers during training. If the framework uses dropout in recurrent stacks, it is typically applied between layers rather than inside the recurrent cell.[^14]

**Effect of Increasing**
Bias rises, variance falls, training slows slightly, and over-regularization can hurt memory retention.

**Effect of Decreasing**
Bias falls, variance rises, and overfitting risk increases.

**Trade-offs**
Dropout helps generalization, but too much dropout can damage temporal signal flow. It is most useful in deeper stacks or data-limited settings.

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with num_layers, hidden_size, and dataset size. Use moderate values first.

**Common Mistakes**
Applying heavy dropout to shallow models or assuming it replaces proper validation.

### bidirectional

**Purpose**
Processes the sequence in both forward and backward directions, giving each timestep access to past and future context.[^14]

**Effect of Increasing**
Bias decreases for offline sequence tasks, variance may rise, speed decreases, and memory usage increases.

**Effect of Decreasing**
Bias may rise for tasks needing future context, variance may fall, speed improves, and memory use drops.

**Trade-offs**
Bidirectional LSTMs are strong for offline labeling and classification but are inappropriate for causal streaming inference. They also increase model size and latency.

**Tuning Priority \& Interactions**
Priority: **High** for offline tasks, **Low** for real-time causal use. Interacts with deployment constraints and label alignment.

**Common Mistakes**
Using bidirectional LSTM in real-time systems that cannot access future context.

### batch_first

**Purpose**
Controls whether tensor shape is `(batch, seq, feature)` or `(seq, batch, feature)`.[^16][^14]

**Effect of Increasing**
Not a scalar increase; `True` usually improves code clarity and integration with DataLoader output.

**Effect of Decreasing**
Not a scalar decrease; `False` may match some legacy sequence code but complicates shape handling.

**Trade-offs**
This is an interface choice, not a model-quality setting. It mainly affects pipeline ergonomics and code consistency.

**Tuning Priority \& Interactions**
Priority: **Low**. Interacts with batching and preprocessing code.

**Common Mistakes**
Mixing tensor layouts across data loading, training, and inference.

### bias

**Purpose**
Enables affine offsets inside the LSTM gates and output projections.[^16][^14]

**Effect of Increasing**
Not a scalar increase; enabling bias usually improves flexibility with negligible memory cost.

**Effect of Decreasing**
Disabling bias reduces parameters slightly and can reduce expressiveness.

**Trade-offs**
Bias is usually beneficial unless there is a specific architectural reason to remove it. The effect on runtime is small compared with the recurrent matrices.

**Tuning Priority \& Interactions**
Priority: **Low**. Interacts weakly with normalization and initialization.

**Common Mistakes**
Turning off bias without a clear reason.

### proj_size

**Purpose**
In PyTorch, projected LSTMs can reduce the output hidden dimensionality while keeping a larger internal cell state.[^14]

**Effect of Increasing**
Bias may decrease because the model can expose a richer hidden representation. Variance, speed cost, and memory use increase.

**Effect of Decreasing**
Bias may increase, variance may fall, speed improves, and memory use drops.

**Trade-offs**
Projection can improve deployment efficiency by reducing interface size while retaining internal memory capacity. It adds design complexity and is mainly useful when compression matters.

**Tuning Priority \& Interactions**
Priority: **Medium** in PyTorch projection-heavy deployments, otherwise **Low**. Interacts strongly with hidden size, bidirectionality, and output heads.

**Common Mistakes**
Using projection without checking downstream tensor shape compatibility.

## 4. Engineering Considerations

**Dataset Suitability**
LSTMs work well for time-series forecasting, sensor data, sequential tabular data, speech processing, natural language tasks, and financial forecasting. They are best when the predictive signal is sequential and not fully local. They are usually a poor fit for tasks that need global parallel context.[^13][^14]

**Scalability \& Parallelization**
Sequential computation is the main bottleneck because each step depends on prior hidden and cell states. GPU utilization is decent for batch workloads but still limited by recurrence. Distributed training is possible, but sequence synchronization and memory overhead reduce efficiency relative to Transformer-style pipelines.[^16][^14]

**Computational Cost \& Memory Behavior**
The cell state and hidden state must be stored across timesteps during training. Sequence unrolling increases memory linearly with $T$, and GPU VRAM usage grows with batch size, hidden size, and number of layers. Long sequences increase both runtime and backprop cost sharply.[^19][^14]

**Robustness \& Sensitivity to Outliers**
Noisy sequences can distort gate activations and cell memory. Missing values usually require padding, imputation, or masking. Variable-length sequences are supported, but the pipeline must handle padding carefully.[^16]

**Feature Engineering Dependency \& Scaling Requirements**
Sequence normalization is important because LSTM gates are sensitive to input scale. Padding is required for batching, masking is often needed for variable-length inputs, and embeddings are typically required for token sequences. Feature scaling remains important for numeric time-series and mixed-type sequential tabular data.[^19][^14]

**Class Imbalance Behavior \& Pipeline Position**
Imbalanced sequence classification often benefits from weighted loss or class-aware sampling. Sampling must preserve temporal integrity, not just label balance. The LSTM should be placed after preprocessing, padding, masking, and embeddings in the pipeline.

**Common Limitations**

- Sequential computation bottleneck.[^14][^16]
- Higher computational cost than GRU.[^14]
- Limited scalability compared with Transformers.[^16][^14]
- Difficult optimization for very long sequences.[^19][^14]
- Higher inference latency in causal deployments.[^14]


## 5. Comparisons

| Alternative Model | Choose LSTM When | Prefer Alternative When | Key Engineering Trade-offs |
| :-- | :-- | :-- | :-- |
| RNN | You need better long-term dependency handling than vanilla recurrence. | The task is extremely simple and latency/parameter budget is tiny. | LSTM is more stable and expressive, but more expensive than vanilla RNN. |
| GRU | You want a strong gated recurrent baseline with lower compute. | You need the explicit cell-state design or slightly richer gating structure of LSTM. | GRU is typically faster and simpler; LSTM often offers a bit more memory capacity. |
| Transformer | The task needs global context and parallel training at scale. | The task is small/moderate and sequential memory is enough. | Transformers scale better and parallelize well; LSTMs are cheaper for short sequences and smaller data. |
| Temporal Convolutional Network (TCN) | You want causal sequence modeling with parallel convolutions. | The task depends on hidden state recurrence or explicit memory dynamics. | TCNs parallelize better and often train faster; LSTMs offer stateful recurrence. |
| 1D CNN | Local temporal patterns dominate and fast inference matters. | Dependencies are long-range or stateful across many steps. | 1D CNNs are more parallel; LSTMs usually model temporal dependency more directly. |
| MLP | The sequence can be reduced to fixed features without much order dependence. | Temporal order is essential. | MLPs are simpler and faster; LSTMs exploit sequential structure and memory. |

## 6. Related Knowledge

**Related Models**

- Vanilla RNN.
- GRU.
- Bidirectional LSTM.
- Stacked LSTM.
- Projected LSTM.

**Alternative Models**

- Transformer.
- Temporal Convolutional Network.
- 1D CNN.
- MLP.

**Related Principles**

- Backpropagation Through Time.
- Gating Mechanisms.
- Memory Cell.
- Sequence Modeling.
- Gradient Clipping.
- Teacher Forcing.

**Related Workflows**

- Time-Series Forecasting.
- NLP Pipeline.
- Speech Recognition.
- Sequential Classification.
- Hyperparameter Optimization.

**Related Patterns \& Guides**

- Sequence Padding Guide.
- Gradient Clipping Pattern.
- Early Stopping Pattern.
- Teacher Forcing Guide.
- Hidden State Management Guide.

**Related Packages**

- PyTorch.
- TensorFlow.
- Keras.
- TorchText.
- Hugging Face Transformers.


## 7. Quick Start

**Language**
Python

**Implementation Package**
PyTorch

**Code**

```python
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

torch.manual_seed(42)

class SeqDataset(Dataset):
    def __init__(self, n=512, seq_len=20, input_size=8, num_classes=3):
        self.x = torch.randn(n, seq_len, input_size)
        self.y = torch.randint(0, num_classes, (n,))

    def __len__(self):
        return len(self.y)

    def __getitem__(self, idx):
        return self.x[idx], self.y[idx]

class LSTMClassifier(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes, num_layers=1, bidirectional=False, dropout=0.0):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=bidirectional,
            dropout=dropout if num_layers > 1 else 0.0,
        )
        d = 2 if bidirectional else 1
        self.fc = nn.Linear(hidden_size * d, num_classes)

    def forward(self, x):
        out, (h_n, c_n) = self.lstm(x)
        last = out[:, -1, :]
        logits = self.fc(last)
        return logits, h_n, c_n

train_ds = SeqDataset(n=1024)
val_ds = SeqDataset(n=256)

train_loader = DataLoader(train_ds, batch_size=32, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=32, shuffle=False)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = LSTMClassifier(input_size=8, hidden_size=64, num_classes=3, num_layers=2, bidirectional=False, dropout=0.2).to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

def evaluate(model, loader):
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for xb, yb in loader:
            xb, yb = xb.to(device), yb.to(device)
            logits, _, _ = model(xb)
            preds = logits.argmax(dim=1)
            correct += (preds == yb).sum().item()
            total += yb.size(0)
    return correct / max(total, 1)

for epoch in range(5):
    model.train()
    for xb, yb in train_loader:
        xb, yb = xb.to(device), yb.to(device)
        optimizer.zero_grad()
        logits, _, _ = model(xb)
        loss = criterion(logits, yb)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
    val_acc = evaluate(model, val_loader)
    print(f"epoch={epoch+1} val_acc={val_acc:.4f}")

model.eval()
sample = torch.randn(1, 20, 8).to(device)
with torch.no_grad():
    logits, h_n, c_n = model(sample)
    probs = torch.softmax(logits, dim=1)
    pred = probs.argmax(dim=1)

print("class_probabilities:", probs.cpu().numpy())
print("predicted_label:", pred.item())
print("hidden_state_shape:", tuple(h_n.shape))
print("cell_state_shape:", tuple(c_n.shape))
```

**Explanation**
This pipeline creates a dataset of sequences, batches them with a DataLoader, trains an LSTM classifier, clips gradients to stabilize BPTT, validates on held-out data, and runs inference on a sample sequence.[^19][^14]

**Inputs**
Expected input tensor shape is `(batch_size, sequence_length, input_size)` when `batch_first=True`. If `batch_first=False`, the shape is `(sequence_length, batch_size, input_size)`.[^16][^14]

**Outputs**
The model can return class logits, class probabilities via softmax, predicted labels, hidden state, cell state, and evaluation metrics such as accuracy.

**Notes**
Sequence padding is required for variable-length batching, and masking is often needed so padded tokens do not affect optimization. Hidden and cell states may be initialized to zeros or carried across chunks for stateful processing. Gradient clipping is a practical safeguard against exploding gradients in BPTT. PyTorch is preferred over scikit-learn because LSTMs require tensor-based sequence ops, autograd, and GPU training support that scikit-learn does not provide.[^19][^14]

## 8. Curated External Resources

1. **PyTorch LSTM documentation**
URL: [https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html](https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html)
Type: documentation
Why to Read: Primary production reference for `torch.nn.LSTM`, including projections, batching, and tensor shapes.
Expected Outcome: Correct implementation and tensor-shape handling in PyTorch.
Reading Time: 20
Notes for Perplexity: Best source for framework-specific behavior and projection support.[^14]
2. **tf.keras.layers.LSTM — TensorFlow documentation**
URL: [https://www.tensorflow.org/api_docs/python/tf/keras/layers/LSTM](https://www.tensorflow.org/api_docs/python/tf/keras/layers/LSTM)
Type: documentation
Why to Read: Canonical TensorFlow/Keras LSTM reference.
Expected Outcome: Correct usage of Keras LSTM layers and deployment-oriented configuration.
Reading Time: 20
Notes for Perplexity: Useful for cross-framework comparison.[^16]
3. **Long Short-Term Memory**
URL: [https://deeplearning.cs.cmu.edu/S23/document/readings/LSTM.pdf](https://deeplearning.cs.cmu.edu/S23/document/readings/LSTM.pdf)
Type: guide
Why to Read: Academic reading that explains the original LSTM formulation and learning motivation.
Expected Outcome: Strong understanding of gating and memory-cell design.
Reading Time: 45
Notes for Perplexity: Good primary reading for conceptual grounding.[^14]
4. **LSTM - Derivation of Back propagation through time**
URL: [https://www.geeksforgeeks.org/dsa/lstm-derivation-of-back-propagation-through-time/](https://www.geeksforgeeks.org/dsa/lstm-derivation-of-back-propagation-through-time/)
Type: article
Why to Read: Practical walkthrough of BPTT for LSTMs.
Expected Outcome: Clearer understanding of gradient flow through gates and cell state.
Reading Time: 30
Notes for Perplexity: Helpful for debugging optimization issues.[^19]
5. **Backpropagation Through Time (BPTT) for Long Short-Term Memory (LSTM)**
URL: [https://www.youtube.com/watch?v=qUT8-ILb0lg](https://www.youtube.com/watch?v=qUT8-ILb0lg)
Type: video
Why to Read: Visual explanation of LSTM gates and BPTT mechanics.
Expected Outcome: Better intuition for training dynamics and gradient propagation.
Reading Time: 25
Notes for Perplexity: Good companion resource for the equations and sequence-unrolling process.[^21]
<span style="display:none">[^1][^10][^11][^15][^17][^18][^2][^20][^22][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: ARCHITECTURE_FREEZE.md

[^2]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^3]: AENS-Knowledge-Layer-Specification.md

[^4]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^5]: https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13410/3046786/Long-short-term-memory-LSTM-architecture-based-neural-network-encoder/10.1117/12.3046786.full

[^6]: https://linkinghub.elsevier.com/retrieve/pii/S0950705121009199

[^7]: https://ieeexplore.ieee.org/document/11146281/

[^8]: https://dergipark.org.tr/en/doi/10.17093/alphanumeric.1901302

[^9]: https://ieeexplore.ieee.org/document/9401395/

[^10]: https://www.semanticscholar.org/paper/ce6fd03b54eb7fafb713184f6d302495395ad8ff

[^11]: https://linkinghub.elsevier.com/retrieve/pii/S1877050921000752

[^12]: https://hess.copernicus.org/articles/26/3079/2022/hess-26-3079-2022-discussion.html

[^13]: https://www.ibm.com/think/topics/lstm

[^14]: https://deeplearning.cs.cmu.edu/S23/document/readings/LSTM.pdf

[^15]: https://en.wikipedia.org/wiki/Long_short-term_memory

[^16]: https://d2l.ai/chapter_recurrent-modern/lstm.html

[^17]: https://www.datacamp.com/de/tutorial/lstm-models

[^18]: https://apxml.com/courses/foundations-transformers-architecture/chapter-1-revisiting-sequence-modeling-limitations/lstm-gating-mechanisms

[^19]: https://www.geeksforgeeks.org/dsa/lstm-derivation-of-back-propagation-through-time/

[^20]: https://www.mathworks.com/help/deeplearning/ug/long-short-term-memory-networks.html

[^21]: https://www.youtube.com/watch?v=qUT8-ILb0lg

[^22]: https://www.sciencedirect.com/topics/computer-science/long-short-term-memory-neural-network

