<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Variational Autoencoder (VAE)

## 1. Decision Summary

**Summary:** A Variational Autoencoder is a probabilistic encoder-decoder generative model that learns a continuous latent distribution, optimizes an ELBO objective, and supports both compact representation learning and controlled data generation.[^14][^15]

**Best Use Cases**

- Image generation and latent-space interpolation where smooth sampling matters.[^16][^14]
- Representation learning for downstream models that benefit from structured embeddings.[^15][^19]
- Data augmentation when you need plausible synthetic samples from a learned data manifold.[^8][^14]
- Anomaly detection by comparing inputs against reconstruction behavior and latent uncertainty.[^6][^11]

**Avoid When**

- High-fidelity image synthesis, where GANs or diffusion models usually produce sharper outputs.[^18][^8]
- Autoregressive language modeling, where sequence likelihood is better handled by token-level generative architectures.
- Deterministic feature compression, where a standard autoencoder is simpler and more direct.[^19][^18]
- Tasks that require exact reconstruction, because VAEs trade fidelity for a structured latent prior.[^16][^18]

**Strengths**

- Learns a smooth, sampleable latent manifold, which makes interpolation and generation practical.[^14][^16]
- Regularized latent structure improves representation robustness and reduces arbitrary latent collapse compared with unconstrained encoders.[^15][^19]
- Supports unsupervised or weakly supervised pipelines for augmentation, anomaly detection, and feature learning.[^11][^6]
- Fits naturally into end-to-end gradient-based training via the reparameterization trick.[^20][^22]

**Limitations**

- Reconstructions are often blurry compared with GANs and diffusion models.[^8][^18]
- Posterior collapse and KL vanishing can reduce latent usage, especially with a strong decoder.[^12]
- The Gaussian prior can be too restrictive for complex multimodal data distributions.[^17][^14]
- Latent samples are probabilistic rather than deterministic, which can be undesirable for exact compression tasks.[^19][^16]

**Interpretability**
The encoder outputs latent distribution parameters, usually mean and log-variance, rather than a single deterministic vector. The mean and variance describe uncertainty in the latent code, and sampling from that distribution defines the generative path. The latent manifold is continuous and can be traversed smoothly, but individual latent dimensions are still hard to interpret directly.[^14][^15][^16][^19]

**Training Characteristics**
VAE training jointly optimizes reconstruction and regularization through the evidence lower bound (ELBO). The KL term pushes the approximate posterior toward the prior, while the reconstruction term preserves input information. The reparameterization trick makes stochastic sampling differentiable for backpropagation.[^22][^17][^20][^15][^19][^14]

**Inference Characteristics**
Encoder inference returns latent distribution parameters and often a sampled latent code; decoder inference generates reconstructions or new samples from prior draws. Latency is higher than a plain autoencoder because sampling and distribution parameterization add overhead. CPU deployment is feasible for small models, but GPU is better for larger latent spaces, convolutional encoders, and batched generation.[^6][^11][^16][^14]

**Computational Characteristics**
Training complexity is approximately $O(n \cdot \text{network cost})$, with dense models dominated by matrix multiplications over $p$, $h$, and $z$. Inference is approximately $O(n \cdot \text{encoder cost} + n \cdot \text{decoder cost})$, with extra sampling overhead relative to deterministic models. Memory use is driven by activations for backpropagation plus the storage of mean and log-variance heads, and scalability depends heavily on model depth and batch size.

## 2. Core Understanding

**Intuition \& Learning Mechanism**
A VAE is a probabilistic encoder-decoder model: the encoder produces a distribution in latent space, the latent sample is drawn from that distribution, and the decoder reconstructs or generates data from that sample. The key engineering idea is that the model does not merely compress; it learns a structured latent distribution that can be sampled at inference time. This makes the latent space useful for both representation and generation.[^15][^16][^19][^14]

**Mathematical Intuition \& Formulation**
Let $x$ be the input, $z$ the latent variable, $q_\phi(z|x)$ the encoder distribution, $p_\theta(x|z)$ the decoder likelihood, and $p(z)$ the prior. The approximate posterior is typically Gaussian:

$$
q_\phi(z|x) = \mathcal{N}(z;\mu_\phi(x), \sigma_\phi^2(x)I)
$$

The prior is usually:

$$
p(z) = \mathcal{N}(0, I)
$$

The ELBO objective is:

$$
\log p_\theta(x) \ge \mathbb{E}_{q_\phi(z|x)}[\log p_\theta(x|z)] - D_{KL}(q_\phi(z|x)\|p(z))
$$

The reconstruction term is often implemented as MSE for continuous data or BCE for normalized binary-like inputs. The reparameterization trick writes:[^17][^15]

$$
z = \mu + \sigma \odot \epsilon,\quad \epsilon \sim \mathcal{N}(0, I)
$$

so gradients can flow through $\mu$ and $\sigma$ during optimization.[^20][^22]

**Assumptions**

- Continuous latent space: if the true data structure is highly discrete or combinatorial, a Gaussian latent can be a poor fit and generations may be vague.
- Gaussian latent prior: if the latent distribution is strongly multimodal, the prior can over-regularize and reduce sample quality.
- Independent latent variables: if dimensions are highly dependent, diagonal covariance can underfit latent structure.
- Representative training distribution: if training data is biased, the learned latent manifold will reflect that bias and generalize poorly.
- Decoder expressive enough for reconstruction: if too weak, the ELBO is dominated by poor reconstructions and latent learning degrades.

**Complexity \& Memory Complexity**
Training cost scales roughly with $n$, $p$, $h$, and $z$, with dense layers contributing $O(nph + nhz)$-style costs depending on depth. Memory complexity includes parameter storage $O(ph + hz)$, activations $O(h + z)$ per sample, and extra tensors for mean, log-variance, and sampled latents. Latent sampling adds a small runtime overhead but can materially increase memory pressure in large convolutional or sequence models.

**Robustness**
VAEs are moderately robust to noise because the latent distribution and KL term discourage brittle encodings, but they still degrade under heavy corruption or domain shift.[^12][^18]

**Scalability**
Scales well with mini-batching and GPU acceleration, and distributed training is practical for large image or sequence datasets.

**Overfitting Tendency**
Overfitting appears when the encoder-decoder becomes too expressive and the KL term is too weak, allowing memorization and posterior collapse avoidance at the expense of sample quality.

**Bias-Variance**
Increasing regularization raises bias but lowers variance; reducing KL pressure improves reconstruction fidelity but can increase overfitting and weaken latent organization.

## 3. Hyperparameter Intelligence

### latent_dim

**Purpose**
Controls latent capacity and the amount of compressed information preserved in the probabilistic code.

**Effect of Increasing**
Bias decreases, variance rises, speed can slow slightly, memory increases, and latent regularization becomes harder because the model can store more detail.

**Effect of Decreasing**
Bias rises, variance falls, speed improves slightly, memory drops, and latent regularization becomes easier but expressiveness decreases.

**Trade-offs**
A larger latent space improves reconstruction and diversity but weakens compression and can reduce sampling discipline. A smaller latent space improves regularization and disentanglement pressure but may underfit.

**Tuning Priority \& Interactions**
Priority: **High**. Strongly interacts with beta and hidden_dims.

**Common Mistakes**
Choosing latent_dim too large and then assuming poor samples are a decoder issue.

### hidden_dims

**Purpose**
Defines encoder and decoder capacity, which governs representational power and reconstruction quality.

**Effect of Increasing**
Bias decreases, variance rises, speed slows, memory increases, and the model may overpower the KL term.

**Effect of Decreasing**
Bias rises, variance falls, speed improves, memory decreases, and the decoder may become too weak to support good ELBO optimization.

**Trade-offs**
Deeper/wider models improve fidelity but can trigger posterior collapse if the decoder becomes too strong. Smaller networks are easier to regularize but may produce poor reconstructions.

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with beta, latent_dim, and reconstruction_loss.

**Common Mistakes**
Scaling decoder depth without checking whether the latent variables are still used.

### beta

**Purpose**
Weights the KL term relative to reconstruction loss.

**Effect of Increasing**
Bias increases, variance usually decreases, speed can be similar or slightly slower to converge, memory is unchanged, and latent regularization strengthens.

**Effect of Decreasing**
Bias decreases, variance rises, speed may improve in early reconstruction fit, memory is unchanged, and latent expressiveness increases but structure weakens.

**Trade-offs**
Higher beta improves disentanglement and latent organization but sacrifices reconstruction fidelity. Lower beta improves fidelity but can reduce the usefulness of the latent prior.

**Tuning Priority \& Interactions**
Priority: **High**. Directly interacts with latent_dim, hidden_dims, and reconstruction_loss.

**Common Mistakes**
Setting beta too high too early and causing posterior collapse or useless latents.

### learning_rate

**Purpose**
Controls optimization stability for ELBO maximization.

**Effect of Increasing**
Bias may reduce faster early, variance and instability rise, speed increases initially, memory is unchanged, and latent regularization can become noisier.

**Effect of Decreasing**
Training becomes more stable, speed slows, memory is unchanged, and convergence may become more reliable.

**Trade-offs**
Too high can destabilize KL/reconstruction balance; too low can stall latent learning.

**Tuning Priority \& Interactions**
Priority: **High**. Strongly interacts with optimizer and batch_size.

**Common Mistakes**
Using a learning rate tuned for deterministic AEs and expecting the same behavior with stochastic latents.

### batch_size

**Purpose**
Determines gradient estimate stability and hardware utilization.

**Effect of Increasing**
Bias usually unchanged, variance of gradients decreases, speed can improve on GPU, memory increases, and latent regularization becomes smoother across batches.

**Effect of Decreasing**
Gradient noise rises, speed can fall, memory drops, and the latent objective may become noisier.

**Trade-offs**
Large batches improve throughput but can reduce the stochasticity that sometimes helps generalization. Smaller batches can help optimization but increase wall-clock time.

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with learning_rate and beta scheduling.

**Common Mistakes**
Picking a batch size that makes KL behavior unstable across steps.

### optimizer

**Purpose**
Defines how parameters are updated during ELBO optimization.

**Effect of Increasing**
Not a scalar increase; adaptive optimizers typically improve convergence speed and reduce tuning sensitivity.

**Effect of Decreasing**
Simpler optimizers can be cheaper per step but less forgiving.

**Trade-offs**
Adam is a strong default for VAEs because it handles mixed-scale gradients from reconstruction and KL terms well. More specialized optimizers may help in constrained settings but usually require additional tuning.[^19][^15]

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with learning_rate and beta.

**Common Mistakes**
Changing optimizer without retuning the learning rate and KL schedule.

### epochs

**Purpose**
Sets the number of full passes over the dataset.

**Effect of Increasing**
Bias decreases, variance can rise, speed decreases, memory stays the same, and latent regularization has more time to settle.

**Effect of Decreasing**
Underfitting risk rises, reconstruction quality may suffer, and latent structure may never stabilize.

**Trade-offs**
More epochs help only if validation ELBO still improves. Early stopping is often safer than a fixed long schedule.

**Tuning Priority \& Interactions**
Priority: **Medium**. Interacts with learning_rate, beta, and hidden_dims.

**Common Mistakes**
Stopping before the latent distribution has stabilized, then blaming the architecture.

### reconstruction_loss

**Purpose**
Selects the reconstruction objective matched to data type and output range.

**Effect of Increasing**
Higher reconstruction emphasis lowers bias on fidelity, may raise variance, can speed visible reconstruction improvement, and reduces the relative impact of latent regularization.

**Effect of Decreasing**
Higher relative KL pressure improves latent organization but can hurt fidelity and expressive reconstruction.

**Trade-offs**
MSE is common for continuous data; BCE is often used for normalized binary-like pixels. The loss choice strongly affects output sharpness, calibration, and latent usage.[^17][^15]

**Tuning Priority \& Interactions**
Priority: **High**. Interacts with beta, input scaling, and output activation.

**Common Mistakes**
Using BCE on poorly normalized continuous data or MSE on outputs that are better treated probabilistically.

## 4. Engineering Considerations

**Dataset Suitability**
VAEs are strong choices for images, medical imaging, scientific datasets, feature learning, data generation, and moderate-dimensional continuous data. They are especially useful when you need a structured latent manifold rather than just compression.[^8][^14][^19]

**Scalability \& Parallelization**
GPU acceleration is a major advantage because the encoder, decoder, and sampling path are all tensor-heavy. Distributed training works well for large datasets, and mixed precision can reduce memory use. Mini-batching remains the standard approach for practical training.

**Computational Cost \& Memory Behavior**
Encoder-decoder activations dominate memory usage, and the mean/log-variance heads add extra tensors per batch. Latent variable storage is usually small, but sampling overhead can matter in large generative or sequence models. VRAM consumption is driven mostly by model width, image resolution, and batch size.

**Robustness \& Sensitivity to Outliers**
VAEs are moderately robust to noise due to the KL regularizer, but they can still be sensitive to domain shift and outliers. Latent uncertainty can help signal unfamiliar inputs, but reconstructions may still look plausible for some anomalies, so detection thresholds must be validated carefully.[^11][^18][^6][^12]

**Feature Engineering Dependency \& Scaling Requirements**
VAEs require less manual feature engineering than classical methods, but they still depend on normalization and preprocessing. Proper scaling is essential for stable ELBO optimization and meaningful latent structure. The learned latent representation often becomes the main feature product for downstream models.[^15][^17]

**Class Imbalance Behavior \& Pipeline Position**
Training is unsupervised, so class imbalance is usually handled indirectly through data selection rather than labels. In production, VAEs often sit upstream of downstream supervised models or anomaly filters. They are also useful in synthetic data generation pipelines where latent sampling expands minority coverage.

**Common Limitations**

- Blurry reconstructions.[^18][^8]
- Posterior collapse.[^12]
- KL vanishing.[^12]
- Gaussian prior limitations.[^14][^17]
- Inferior visual quality compared with GANs and diffusion models.[^18][^8]


## 5. Comparisons

| Alternative Model | Choose Variational Autoencoder When | Prefer Alternative When | Key Engineering Trade-offs |
| :-- | :-- | :-- | :-- |
| Autoencoder (AE) | You need a probabilistic latent space and sampleable generative behavior. | You need deterministic compression or pure reconstruction. | VAE adds latent regularization and sampling; AE is simpler and often reconstructs more sharply. |
| β-VAE | You want the standard probabilistic formulation with a simpler tuning surface. | You need stronger disentanglement control. | β-VAE emphasizes latent factor separation more aggressively but may reduce fidelity. |
| GAN | You want stable latent inference and a probabilistic encoder. | You need sharp, high-fidelity samples. | VAE is easier to train and encode; GANs usually produce sharper outputs but are harder to optimize. |
| Diffusion Model | You need a lighter latent-generative setup or faster conceptual simplicity. | You need state-of-the-art sample quality. | VAE is cheaper and simpler; diffusion models usually win on image quality and realism. |
| Normalizing Flow | You want a latent-variable model with exact likelihood or invertibility. | You can accept approximate likelihood for simpler architecture and faster implementation. | Flows offer exact density modeling but often at higher architectural and compute complexity. |
| Transformer-based Generative Models | You want continuous latent compression with probabilistic regularization. | You need sequence-first or highly expressive token generation. | VAEs are better for latent structure and compression; Transformers excel at autoregressive sequence modeling. |

## 6. Related Knowledge

**Related Models**

- Autoencoder.
- Conditional VAE.
- β-VAE.
- VQ-VAE.
- Hierarchical VAE.

**Alternative Models**

- GAN.
- Diffusion Model.
- Normalizing Flow.
- Transformer-based Generative Model.
- AutoRegressive Model.

**Related Principles**

- Variational Inference.
- ELBO Optimization.
- Latent Variable Modeling.
- KL Divergence.
- Representation Learning.
- Bayesian Deep Learning.

**Related Workflows**

- Generative Modeling.
- Representation Learning.
- Data Augmentation.
- Anomaly Detection.
- Dimensionality Reduction.

**Related Patterns \& Guides**

- Encoder-Decoder Pattern.
- Latent Space Visualization Guide.
- Generative Model Selection Guide.
- Posterior Collapse Debug Guide.
- Deep Learning Optimization Guide.

**Related Packages**

- PyTorch.
- TensorFlow.
- Keras.
- TorchVision.
- Pyro.


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

class ToyImageDataset(Dataset):
    def __init__(self, n=4096, input_dim=784):
        x = torch.randn(n, input_dim)
        x = (x - x.mean(dim=0)) / (x.std(dim=0) + 1e-6)
        self.x = x

    def __len__(self):
        return self.x.size(0)

    def __getitem__(self, idx):
        return self.x[idx]

class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU()
        )
        self.fc_mu = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, input_dim),
            nn.Sigmoid()
        )

    def encode(self, x):
        h = self.encoder(x)
        mu = self.fc_mu(h)
        logvar = self.fc_logvar(h)
        return mu, logvar

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z):
        return self.decoder(z)

    def forward(self, x):
        mu, logvar = self.encode(x)
        z = self.reparameterize(mu, logvar)
        recon = self.decode(z)
        return recon, mu, logvar, z

def vae_loss(recon, x, mu, logvar, beta=1.0):
    recon_loss = nn.functional.binary_cross_entropy(recon, x, reduction='sum') / x.size(0)
    kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp()) / x.size(0)
    elbo = -(recon_loss + beta * kl_loss)
    return recon_loss + beta * kl_loss, elbo, recon_loss, kl_loss

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
train_ds = ToyImageDataset(n=5000, input_dim=784)
val_ds = ToyImageDataset(n=1000, input_dim=784)

train_loader = DataLoader(train_ds, batch_size=128, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=128, shuffle=False)

model = VAE(input_dim=784, hidden_dim=400, latent_dim=20).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

def evaluate(model, loader, beta=1.0):
    model.eval()
    total_elbo = total_kl = total_recon = 0.0
    total_n = 0
    with torch.no_grad():
        for x in loader:
            x = x.to(device)
            recon, mu, logvar, z = model(x)
            loss, elbo, recon_loss, kl_loss = vae_loss(recon, x, mu, logvar, beta=beta)
            bs = x.size(0)
            total_elbo += elbo.item() * bs
            total_kl += kl_loss.item() * bs
            total_recon += recon_loss.item() * bs
            total_n += bs
    return {
        "elbo": total_elbo / total_n,
        "kl": total_kl / total_n,
        "recon": total_recon / total_n
    }

beta = 1.0
for epoch in range(10):
    model.train()
    for x in train_loader:
        x = x.to(device)
        optimizer.zero_grad()
        recon, mu, logvar, z = model(x)
        loss, elbo, recon_loss, kl_loss = vae_loss(recon, x, mu, logvar, beta=beta)
        loss.backward()
        optimizer.step()

    metrics = evaluate(model, val_loader, beta=beta)
    print(f"epoch={epoch+1} val_elbo={metrics['elbo']:.4f} val_kl={metrics['kl']:.4f} val_recon={metrics['recon']:.4f}")

model.eval()
with torch.no_grad():
    x = torch.randn(8, 784).to(device)
    recon, mu, logvar, z = model(x)

    prior_z = torch.randn(8, 20).to(device)
    generated = model.decode(prior_z)

    anomaly_score = ((x - recon) ** 2).mean(dim=1)

print("mu_shape:", tuple(mu.shape))
print("logvar_shape:", tuple(logvar.shape))
print("z_shape:", tuple(z.shape))
print("recon_shape:", tuple(recon.shape))
print("generated_shape:", tuple(generated.shape))
print("anomaly_score:", anomaly_score.detach().cpu().numpy())
```

**Explanation**
This pipeline trains a VAE by maximizing ELBO, which combines reconstruction quality and latent regularization. The encoder produces mean and log-variance, the reparameterization trick makes sampling differentiable, and the decoder can reconstruct inputs or generate new samples from the prior.[^22][^20][^19][^15]

**Inputs**
Expected input tensor shape is `(batch_size, input_features)` for a fully connected VAE. For images, tensors are typically flattened before entering the model, while convolutional VAEs keep spatial structure and replace the dense encoder-decoder blocks.

**Outputs**
The model returns a mean vector, log variance, latent sample, reconstruction, ELBO, KL loss, and reconstruction loss.

**Notes**
Input normalization is important for stable training and meaningful reconstructions. Beta controls the trade-off between fidelity and latent regularization, and KL annealing is a common mitigation for posterior collapse. GPU utilization improves with moderate batch sizes and larger latent networks. PyTorch is preferred over scikit-learn because VAEs require differentiable sampling, custom loss composition, and autograd-driven stochastic optimization.[^20][^19]

## 8. Curated External Resources

1. **Auto-Encoding Variational Bayes**
URL: [https://arxiv.org/abs/1312.6114](https://arxiv.org/abs/1312.6114)
Type: guide
Why to Read: Original VAE paper defining the ELBO-based formulation and reparameterization trick.
Expected Outcome: Canonical understanding of VAE objective and latent-variable training.
Reading Time: 45
Notes for Perplexity: Primary research source.[^19]
2. **Intro to Autoencoders | TensorFlow Core**
URL: [https://www.tensorflow.org/tutorials/generative/autoencoder](https://www.tensorflow.org/tutorials/generative/autoencoder)
Type: documentation
Why to Read: Official TensorFlow/Keras reference for autoencoder-style generative modeling patterns.
Expected Outcome: Practical framework grounding for Keras-based implementations.
Reading Time: 25
Notes for Perplexity: Useful secondary framework reference.[^23]
3. **Deep Learning Book — latent variable models and variational inference**
URL: [https://www.deeplearningbook.org/](https://www.deeplearningbook.org/)
Type: guide
Why to Read: Foundational theory for probabilistic latent-variable modeling and deep generative models.
Expected Outcome: Better understanding of why ELBO and approximate inference work.
Reading Time: 50
Notes for Perplexity: Strong background source.
4. **Variational autoencoders - Matthew N. Bernstein**
URL: [https://mbernste.github.io/posts/vae/](https://mbernste.github.io/posts/vae/)
Type: article
Why to Read: Engineer-friendly explanation of VAE math and a practical PyTorch implementation.
Expected Outcome: Clear link between theory and implementation.
Reading Time: 35
Notes for Perplexity: Good practical bridge.[^19]
5. **Variational Autoencoder [VAE] from scratch | Intuition + Coding**
URL: [https://www.youtube.com/watch?v=VUwAGLM6K_8](https://www.youtube.com/watch?v=VUwAGLM6K_8)
Type: video
Why to Read: Concise lecture-style explanation of why VAEs differ from standard autoencoders.
Expected Outcome: Strong intuition for latent sampling and generative use.
Reading Time: 40
Notes for Perplexity: Useful for visual intuition and posterior collapse context.[^18]
<span style="display:none">[^1][^10][^13][^2][^21][^3][^4][^5][^7][^9]</span>

<div align="center">⁂</div>

[^1]: ARCHITECTURE_FREEZE.md

[^2]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^3]: AENS-Knowledge-Layer-Specification.md

[^4]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^5]: https://ieeexplore.ieee.org/document/10943202/

[^6]: https://ieeexplore.ieee.org/document/10126296/

[^7]: https://arxiv.org/abs/2603.23547

[^8]: https://www.itm-conferences.org/10.1051/itmconf/20257002001

[^9]: https://arxiv.org/abs/2602.22239

[^10]: https://www.semanticscholar.org/paper/caa79798cc75619b0a35fd583760b19c19f04297

[^11]: https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/cim2.70032

[^12]: https://ieeexplore.ieee.org/document/11102290/

[^13]: https://en.wikipedia.org/wiki/Variational_autoencoder

[^14]: https://www.ibm.com/think/topics/variational-autoencoder

[^15]: https://medium.com/@jimwang3589/variational-autoencoder-vae-7609893c80f4

[^16]: https://maurocomi.com/blog/vae.html

[^17]: https://www.edureka.co/blog/variational-autoencoder-architecture/

[^18]: https://www.youtube.com/watch?v=VUwAGLM6K_8

[^19]: https://mbernste.github.io/posts/vae/

[^20]: https://metricgate.com/blogs/reparameterization-trick-explained/

[^21]: https://www.youtube.com/watch?v=1RPdu_5FCfk

[^22]: https://apxml.com/courses/applied-autoencoders-feature-extraction/chapter-6-variational-autoencoders-structured-latent-spaces/reparameterization-trick-explained

[^23]: https://www.tensorflow.org/tutorials/generative/autoencoder

