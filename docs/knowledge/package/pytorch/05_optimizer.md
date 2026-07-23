# **PyTorch Optimizer and Scheduler Tasks**

## **Task**

Optimize Model with Stochastic Gradient Descent (optim.SGD)

## **Problem Solved**

Updates model parameters using stochastic gradient descent with optional momentum, dampening, and Nesterov acceleration to minimize loss.

## **Mental Trigger**

I need a classic, memory-efficient optimizer with momentum for training computer vision models or fine-tuning stable baselines.

## **Syntax**

`torch.optim.SGD(`  
    `params,`  
    `lr=required,`  
    `momentum=0,`  
    `dampening=0,`  
    `weight_decay=0,`  
    `nesterov=False,`  
    `*,`  
    `maximize=False,`  
    `foreach=None,`  
    `differentiable=False,`  
    `fused=None`  
`)`

## **Important Parameters**

> * lr (float): Learning rate. Required parameter.  
> * momentum (float, default=0): Momentum factor accelerating SGD in the relevant direction and dampening oscillations.  
> * weight\_decay (float, default=0): Weight decay factor (*L*2​ penalty).  
> * nesterov (bool, default=False): Enables Nesterov momentum. Requires momentum \> 0 and dampening \= 0\.  
> * fused (bool, default=None): Executes a fused CUDA kernel for faster parameter updates when training on GPU.

## **Return Value**

An instance of torch.optim.SGD initialized with specified parameter groups and hyperparameters.

## **Example**

`import torch`  
`import torch.nn as nn`

`# Define a minimal model and synthetic data`  
`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9, weight_decay=1e-4)`

`x = torch.randn(4, 10)`  
`y = torch.randint(0, 2, (4,))`  
`criterion = nn.CrossEntropyLoss()`

`# Single optimization step`  
`optimizer.zero_grad()`  
`loss = criterion(model(x), y)`  
`loss.backward()`  
`optimizer.step()`

## **Use When**

> * Training standard vision models like ResNet from scratch where SGD with momentum often generalizes better than adaptive optimizers.  
> * You need minimal memory overhead per parameter (SGD retains at most one buffer for momentum).

## **Avoid When**

> * Training architectures with sparse gradients or complex loss landscapes, such as Transformers or LLMs.  
> * Quick prototyping where adaptive learning rate algorithms require less initial learning rate tuning.

## **Gotchas**

> * Setting nesterov=True without setting momentum \> 0 causes an explicit runtime error.  
> * *L*2​ regularization in PyTorch SGD acts directly as weight decay on gradients, which can interact unexpectedly with momentum buffers if dampening is non-zero.  
> * lr must be explicitly provided; unlike Adam, SGD does not have a default learning rate in PyTorch.

## **Performance Notes**

> * Low memory overhead: requires zero extra state memory without momentum, and only 1 state buffer per parameter when momentum is enabled.  
> * Using fused=True on CUDA significantly speeds up the update step by avoiding multiple kernel launches.

## **Related APIs**

> * torch.optim.Adam  
> * torch.optim.AdamW  
> * torch.optim.RMSprop

## **Framework Migration Notes**

In TensorFlow/Keras, tf.keras.optimizers.SGD handles both standard momentum and Nesterov momentum similarly. However, PyTorch SGD requires setting dampening=0 when nesterov=True.

## **TensorFlow Equivalent**

`optim.SGD → tf.keras.optimizers.SGD`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: SGD, Stochastic Gradient Descent, PyTorch SGD  
> * **Common Search Terms**: pytorch sgd momentum, nesterov sgd pytorch, sgd weight decay  
> * **Keywords**: optimizer, sgd, momentum, nesterov, vision  
> * **Frequently Confused With**: optim.Adam (adaptive rates vs fixed rate with momentum), optim.AdamW (decoupled weight decay vs *L*2​ regularization)

## **Related Models**

resnet, yolo, logistic-regression

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.SGD.html](https://pytorch.org/docs/stable/generated/torch.optim.SGD.html)

## **Task**

Optimize Model with Adam (optim.Adam)

## **Problem Solved**

Computes adaptive learning rates for each parameter using first and second moment estimates of gradients.

## **Mental Trigger**

I need an adaptive optimizer that works out-of-the-box for general deep learning tasks without heavy hyperparameter tuning.

## **Syntax**

`torch.optim.Adam(`  
    `params,`  
    `lr=0.001,`  
    `betas=(0.9, 0.999),`  
    `eps=1e-08,`  
    `weight_decay=0,`  
    `amsgrad=False,`  
    `*,`  
    `foreach=None,`  
    `maximize=False,`  
    `capturable=False,`  
    `differentiable=False,`  
    `fused=None`  
`)`

## **Important Parameters**

> * lr (float, default=1e-3): Learning rate.  
> * betas (Tuple\[float, float\], default=(0.9, 0.999)): Coefficients used for computing running averages of gradient and its square.  
> * eps (float, default=1e-8): Term added to denominator for numerical stability.  
> * weight\_decay (float, default=0): *L*2​ penalty coefficient added directly to gradients.  
> * amsgrad (bool, default=False): Uses the AMSGrad variant keeping the maximum of past squared gradients.

## **Return Value**

An instance of torch.optim.Adam initialized with target parameters and adaptive learning rate state.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.Adam(model.parameters(), lr=1e-3, betas=(0.9, 0.999), eps=1e-8)`

`x = torch.randn(4, 10)`  
`y = torch.randint(0, 2, (4,))`  
`criterion = nn.CrossEntropyLoss()`

`optimizer.zero_grad()`  
`loss = criterion(model(x), y)`  
`loss.backward()`  
`optimizer.step()`

## **Use When**

> * Training dense neural networks or MLPs where gradient scales vary significantly across layers.  
> * Prototyping baseline models where manual learning rate tuning for SGD is too slow.

## **Avoid When**

> * Training models with weight decay applied, where AdamW should be used instead.  
> * Memory-constrained training environments, as Adam maintains two state buffers per parameter.

## **Gotchas**

> * Using weight\_decay in standard Adam applies *L*2​ regularization directly to gradients, which suppresses the effective weight decay rate for parameters with large gradient history.  
> * Adam memory usage is high: requires double the memory of parameter tensors to store *mt*​ (first moment) and *vt*​ (second moment) buffers.

## **Performance Notes**

> * High memory overhead: requires 2 additional state tensors per trainable parameter (e.g., 8 bytes per parameter in FP32).  
> * fused=True on CUDA leverages multi-tensor updates to minimize overhead from launch latencies.

## **Related APIs**

> * torch.optim.AdamW  
> * torch.optim.Adamax  
> * torch.optim.RMSprop

## **Framework Migration Notes**

Matches tf.keras.optimizers.Adam. In PyTorch, if weight decay is needed, explicitly prefer torch.optim.AdamW.

## **TensorFlow Equivalent**

`optim.Adam → tf.keras.optimizers.Adam`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Adam, Adaptive Moment Estimation  
> * **Common Search Terms**: pytorch adam optimizer, adam learning rate, adam eps setting  
> * **Keywords**: optimizer, adam, adaptive, first-moment, second-moment  
> * **Frequently Confused With**: optim.AdamW (standard *L*2​ penalty vs decoupled weight decay)

## **Related Models**

bert, roberta, t5, gpt

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

text-classification-pipeline-classical-encoder, transfer-learning-for-vision

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.Adam.html](https://pytorch.org/docs/stable/generated/torch.optim.Adam.html)

## **Task**

Optimize Model with AdamW (optim.AdamW)

## **Problem Solved**

Decouples weight decay regularization from gradient updates in Adam, ensuring proper regularization regardless of gradient magnitude scaling.

## **Mental Trigger**

I need an optimizer for Transformers or modern neural networks that applies true weight decay alongside adaptive gradient scaling.

## **Syntax**

`torch.optim.AdamW(`  
    `params,`  
    `lr=0.001,`  
    `betas=(0.9, 0.999),`  
    `eps=1e-08,`  
    `weight_decay=0.01,`  
    `amsgrad=False,`  
    `*,`  
    `maximize=False,`  
    `foreach=None,`  
    `capturable=False,`  
    `differentiable=False,`  
    `fused=None`  
`)`

## **Important Parameters**

> * lr (float, default=1e-3): Learning rate.  
> * betas (Tuple\[float, float\], default=(0.9, 0.999)): Moving average coefficients for first and second moments.  
> * weight\_decay (float, default=1e-2): Decoupled weight decay coefficient applied directly to parameters.  
> * eps (float, default=1e-8): Stability constant added to denominator.  
> * fused (bool, default=None): Fused CUDA implementation for accelerating model step times.

## **Return Value**

An instance of torch.optim.AdamW configured for decoupled weight decay optimization.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Sequential(`  
    `nn.Linear(768, 768),`  
    `nn.ReLU(),`  
    `nn.Linear(768, 10)`  
`)`

`# Exclude bias and LayerNorm parameters from weight decay`  
`no_decay = ['bias', 'LayerNorm.weight', 'norm.weight']`  
`optimizer_grouped_parameters = [`  
    `{`  
        `'params': [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)],`  
        `'weight_decay': 0.01,`  
    `},`  
    `{`  
        `'params': [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay)],`  
        `'weight_decay': 0.0,`  
    `},`  
`]`

`optimizer = torch.optim.AdamW(optimizer_grouped_parameters, lr=5e-5)`

## **Use When**

> * Training or fine-tuning Transformer-based models (BERT, ViT, LLaMA, GPT).  
> * Using non-zero weight decay with adaptive optimizers to ensure correct regularization strength.

## **Avoid When**

> * Training sparse parameters where Adagrad or standard SGD is better suited.  
> * Memory constraints forbid maintaining two moment state tensors per parameter.

## **Gotchas**

> * Setting weight\_decay=0 makes AdamW mathematically equivalent to standard Adam.  
> * Applying weight decay to bias parameters or layer normalization weights can lead to underfitting or instability; always separate them into parameter groups with weight\_decay=0.

## **Performance Notes**

> * Shares memory requirements with Adam: stores 2 additional FP32 tensors per parameter.  
> * fused=True yields significant execution speedups on NVIDIA GPUs when supported.

## **Related APIs**

> * torch.optim.Adam  
> * torch.optim.SGD

## **Framework Migration Notes**

Replaces tf.keras.optimizers.AdamW. Make sure to pass non-zero weight\_decay to benefit from the decoupled formulation.

## **TensorFlow Equivalent**

`optim.AdamW → tf.keras.optimizers.AdamW`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: AdamW, Decoupled Weight Decay Adam  
> * **Common Search Terms**: pytorch adamw, adam vs adamw, adamw transformer weight decay  
> * **Keywords**: adamw, decoupled-weight-decay, transformer, llm, vit  
> * **Frequently Confused With**: optim.Adam (Adam calculates *L*2​ decay inside gradient update; AdamW subtracts decay directly from weights)

## **Related Models**

vit, transformer, bert, roberta, t5, bart, gpt, llama, qwen, gemma, deepseek

## **Related Patterns**

learning-rate-scheduling, memory-efficient-training

## **Related Workflows**

text-classification-pipeline-classical-encoder, transfer-learning-for-vision, production-llm-cost-latency-optimization

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide, hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.AdamW.html](https://pytorch.org/docs/stable/generated/torch.optim.AdamW.html)

## **Task**

Optimize Model with RMSprop (optim.RMSprop)

## **Problem Solved**

Divides learning rate by an exponentially decaying average of squared gradients to resolve rapidly diminishing learning rates in non-stationary problems.

## **Mental Trigger**

I need an adaptive optimizer for recurrent networks or reinforcement learning tasks where loss landscapes change over time.

## **Syntax**

`torch.optim.RMSprop(`  
    `params,`  
    `lr=0.01,`  
    `alpha=0.99,`  
    `eps=1e-08,`  
    `weight_decay=0,`  
    `momentum=0,`  
    `centered=False,`  
    `foreach=None,`  
    `maximize=False,`  
    `differentiable=False`  
`)`

## **Important Parameters**

> * lr (float, default=1e-2): Learning rate.  
> * alpha (float, default=0.99): Smoothing constant for moving average of squared gradients.  
> * eps (float, default=1e-8): Term added to denominator for numerical stability.  
> * momentum (float, default=0): Momentum factor.  
> * centered (bool, default=False): If True, computes centered RMSprop where gradients are normalized by estimation of variance.

## **Return Value**

An instance of torch.optim.RMSprop initialized with parameters and exponential moving average buffers.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.GRU(10, 20, batch_first=True)`  
`optimizer = torch.optim.RMSprop(model.parameters(), lr=0.001, alpha=0.99, momentum=0.9)`

`x = torch.randn(2, 5, 10)`  
`out, _ = model(x)`  
`loss = out.sum()`

`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

## **Use When**

> * Training Recurrent Neural Networks (RNNs, LSTMs, GRUs).  
> * Implementing Reinforcement Learning algorithms (e.g., A2C, DQN).

## **Avoid When**

> * Fine-tuning large language models or modern vision transformers where AdamW is standard.  
> * Gradient updates require explicit decoupled weight decay.

## **Gotchas**

> * Default learning rate is 0.01, which is much higher than Adam's default (0.001) and often causes divergence if not reduced.  
> * Setting centered=True provides more stable training, but requires storing an extra buffer for average gradients.

## **Performance Notes**

> * Memory overhead: Stores 1 extra state buffer (square gradient average) when uncentered, 2 state buffers when centered or when momentum is non-zero.

## **Related APIs**

> * torch.optim.Adam  
> * torch.optim.Adagrad

## **Framework Migration Notes**

Matches tf.keras.optimizers.RMSprop. Parameter alpha in PyTorch maps to rho in TensorFlow RMSprop.

## **TensorFlow Equivalent**

`optim.RMSprop → tf.keras.optimizers.RMSprop`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: RMSprop, Root Mean Squared Propagation  
> * **Common Search Terms**: pytorch rmsprop, rmsprop vs adam, rmsprop alpha parameter  
> * **Keywords**: optimizer, rmsprop, recurrent, reinforcement-learning  
> * **Frequently Confused With**: optim.Adagrad (Adagrad accumulates all squared gradients; RMSprop uses an exponential moving average)

## **Related Models**

logistic-regression

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.RMSprop.html](https://pytorch.org/docs/stable/generated/torch.optim.RMSprop.html)

## **Task**

Optimize Model with Adagrad (optim.Adagrad)

## **Problem Solved**

Adapts the learning rate individually to parameters, performing larger updates for infrequent parameters and smaller updates for frequent parameters.

## **Mental Trigger**

I need an optimizer specifically designed for sparse data, sparse features, or text embedding layers where gradients are frequently zero.

## **Syntax**

`torch.optim.Adagrad(`  
    `params,`  
    `lr=0.01,`  
    `lr_decay=0,`  
    `weight_decay=0,`  
    `initial_accumulator_value=0,`  
    `eps=1e-10,`  
    `*,`  
    `foreach=None,`  
    `maximize=False,`  
    `differentiable=False,`  
    `fused=None`  
`)`

## **Important Parameters**

> * lr (float, default=1e-2): Learning rate.  
> * lr\_decay (float, default=0): Learning rate decay rate.  
> * weight\_decay (float, default=0): Weight decay (*L*2​ penalty).  
> * initial\_accumulator\_value (float, default=0): Starting value for sum of squared gradients.  
> * eps (float, default=1e-10): Term added to denominator for numerical stability.

## **Return Value**

An instance of torch.optim.Adagrad targeting the designated parameter tensors.

## **Example**

`import torch`  
`import torch.nn as nn`

`embedding = nn.EmbeddingBag(1000, 16, mode='sum')`  
`optimizer = torch.optim.Adagrad(embedding.parameters(), lr=0.05)`

`input_ids = torch.tensor([1, 2, 4, 5], dtype=torch.long)`  
`offsets = torch.tensor([0, 2], dtype=torch.long)`

`optimizer.zero_grad()`  
`output = embedding(input_ids, offsets)`  
`loss = output.sum()`  
`loss.backward()`  
`optimizer.step()`

## **Use When**

> * Training models with sparse embeddings or bag-of-words text inputs.  
> * Handling extreme sparse gradient features where parameter updates happen infrequently.

## **Avoid When**

> * Training deep continuous neural networks (CNNs, Transformers) over many epochs, because accumulated squared gradients continually grow in the denominator, forcing the learning rate to shrink to zero.

## **Gotchas**

> * Learning rate monotonically decreases during training because accumulated squared gradients only accumulate positive values in the denominator.  
> * Default learning rate (0.01) is often too low or too high depending on the sparsity scale.

## **Performance Notes**

> * Low state overhead compared to Adam: maintains only 1 accumulated squared gradient tensor per parameter.

## **Related APIs**

> * torch.optim.Adamax  
> * torch.optim.RMSprop

## **Framework Migration Notes**

Matches tf.keras.optimizers.Adagrad.

## **TensorFlow Equivalent**

`optim.Adagrad → tf.keras.optimizers.Adagrad`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Adagrad, Adaptive Gradient Algorithm  
> * **Common Search Terms**: pytorch adagrad, adagrad sparse gradients, adagrad embedding optimizer  
> * **Keywords**: optimizer, adagrad, sparse, embeddings  
> * **Frequently Confused With**: optim.RMSprop (RMSprop prevents learning rate decay to zero by using a moving average instead of monotonic sum)

## **Related Models**

logistic-regression

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.Adagrad.html](https://pytorch.org/docs/stable/generated/torch.optim.Adagrad.html)

## **Task**

Optimize Model with Adamax (optim.Adamax)

## **Problem Solved**

A variant of Adam based on the infinity norm (*L*∞​), stabilizing gradient updates when parameters receive large sporadic gradients.

## **Mental Trigger**

I need a variant of Adam that is more resilient to extreme gradient spikes or large embedding updates.

## **Syntax**

`torch.optim.Adamax(`  
    `params,`  
    `lr=0.002,`  
    `betas=(0.9, 0.999),`  
    `eps=1e-08,`  
    `weight_decay=0,`  
    `*,`  
    `foreach=None,`  
    `maximize=False,`  
    `differentiable=False`  
`)`

## **Important Parameters**

> * lr (float, default=2e-3): Learning rate.  
> * betas (Tuple\[float, float\], default=(0.9, 0.999)): Coefficients for computing running average of gradient and maximum gradient magnitude.  
> * eps (float, default=1e-8): Numerical stability term.  
> * weight\_decay (float, default=0): *L*2​ regularization penalty.

## **Return Value**

An instance of torch.optim.Adamax.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.Adamax(model.parameters(), lr=0.002, betas=(0.9, 0.999))`

`x = torch.randn(4, 10)`  
`y = torch.randint(0, 2, (4,))`  
`criterion = nn.CrossEntropyLoss()`

`optimizer.zero_grad()`  
`loss = criterion(model(x), y)`  
`loss.backward()`  
`optimizer.step()`

## **Use When**

> * Training models where gradients exhibit extreme norm outliers or instability under Adam.  
> * Processing models with large scale embeddings or sparse updates requiring bound variance.

## **Avoid When**

> * Fine-tuning standard Pretrained Language Models (LLMs) or Vision Transformers where AdamW hyperparameter defaults are heavily benchmarked.

## **Gotchas**

> * Default learning rate is 0.002 (unlike Adam's 0.001).  
> * Does not decouple weight decay automatically like AdamW.

## **Performance Notes**

> * Stores 2 moment tensors per parameter, similar to standard Adam memory footprints.

## **Related APIs**

> * torch.optim.Adam  
> * torch.optim.AdamW

## **Framework Migration Notes**

Matches tf.keras.optimizers.Adamax.

## **TensorFlow Equivalent**

`optim.Adamax → tf.keras.optimizers.Adamax`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Adamax, Adam Infinity Norm  
> * **Common Search Terms**: pytorch adamax, adamax vs adam, infinity norm adam  
> * **Keywords**: optimizer, adamax, infinity-norm, adaptive  
> * **Frequently Confused With**: optim.Adam (Adam uses *L*2​ norm for variance estimation, Adamax uses *L*∞​ norm)

## **Related Models**

bert, gpt

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.Adamax.html](https://pytorch.org/docs/stable/generated/torch.optim.Adamax.html)

## **Task**

Reset Accumulated Gradients (optimizer.zero\_grad)

## **Problem Solved**

Clears parameter gradients (.grad attributes) before computing backpropagation for the current iteration, preventing unexpected gradient accumulation across iterations.

## **Mental Trigger**

I am starting a new optimization iteration and must wipe old gradients before calling loss.backward().

## **Syntax**

`optimizer.zero_grad(set_to_none=True)`

## **Important Parameters**

> * set\_to\_none (bool, default=True in modern workflows): When set to True, sets .grad to None instead of filling existing tensors with zeros, saving memory bandwidth and execution overhead.

## **Return Value**

None. Mutates parameter .grad attributes in place.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(5, 1)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.01)`

`x = torch.randn(2, 5)`  
`loss = model(x).sum()`

`# Reset gradients explicitly setting them to None for optimal performance`  
`optimizer.zero_grad(set_to_none=True)`  
`loss.backward()`  
`optimizer.step()`

## **Use When**

> * Before calling loss.backward() in every training step (unless intentionally implementing gradient accumulation).

## **Avoid When**

> * Accumulating gradients across multiple micro-batches (call zero\_grad only once every *N* steps after optimizer.step()).

## **Gotchas**

> * Forgetting to call zero\_grad() causes gradients from consecutive batches to sum together, rapidly causing exploding gradients.  
> * If set\_to\_none=True is used, .grad is None until backward() is called. Downstream code checking .grad.shape before backward() will raise an AttributeError.

## **Performance Notes**

> * set\_to\_none=True avoids memory write operations (deallocates or sets references to None) and improves update step efficiency.

## **Related APIs**

> * torch.Tensor.backward  
> * torch.optim.Optimizer.step

## **Framework Migration Notes**

In PyTorch, gradients accumulate by default. In TensorFlow/Keras, GradientTape computes gradients explicitly without manual reset unless low-level custom loops are used.

## **TensorFlow Equivalent**

`optimizer.zero_grad → Preparation step before tape.gradient() (conceptually)`

## **Version Compatibility**

set\_to\_none=True became available in PyTorch 1.7 and is recommended for PyTorch 2.x.

## **Search Metadata**

> * **Aliases**: zero\_grad, clear gradients, reset gradients  
> * **Common Search Terms**: pytorch zero\_grad set\_to\_none, when to call zero\_grad, gradient accumulation zero\_grad  
> * **Keywords**: zero\_grad, gradient, memory, parameter, backward  
> * **Frequently Confused With**: optimizer.step (zeroing gradients vs executing the weight update)

## **Related Models**

resnet, bert, llama

## **Related Patterns**

gradient-accumulation, memory-efficient-training

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.zero\_grad.html](https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.zero_grad.html)

## **Task**

Update Model Parameters (optimizer.step)

## **Problem Solved**

Applies accumulated parameter gradients to update model weight values according to the optimizer's specific update rule.

## **Mental Trigger**

I calculated gradients with loss.backward() and now need to update my model weights.

## **Syntax**

`optimizer.step(closure=None)`

## **Important Parameters**

> * closure (Callable, optional): A closure function that re-evaluates the model and returns the loss. Required by second-order optimizers like LBFGS.

## **Return Value**

Optional loss value if a closure function is provided; otherwise returns None.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(5, 1)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.01)`

`x = torch.randn(2, 5)`  
`target = torch.randn(2, 1)`  
`criterion = nn.MSELoss()`

`# Zero grad -> Forward -> Backward -> Step`  
`optimizer.zero_grad(set_to_none=True)`  
`output = model(x)`  
`loss = criterion(output, target)`  
`loss.backward()`

`# Perform parameter update`  
`optimizer.step()`

## **Use When**

> * Updating model parameters at every batch step, or after completing a gradient accumulation cycle.

## **Avoid When**

> * Parameter .grad attributes are None or contain NaN/Inf values (e.g., during mixed precision scaling, check scaler.step() or clip gradients first).

## **Gotchas**

> * Calling optimizer.step() before loss.backward() results in a no-op because .grad attributes are empty or unset.  
> * Calling scheduler.step() before optimizer.step() triggers PyTorch user warnings in recent versions. Always execute optimizer.step() before scheduler.step().

## **Performance Notes**

> * optimizer.step() performance scales linearly with parameter count. Using fused=True or foreach=True optimizers minimizes launch overhead on CUDA devices.

## **Related APIs**

> * torch.optim.Optimizer.zero\_grad  
> * torch.nn.utils.clip\_grad\_norm\_

## **Framework Migration Notes**

Maps to optimizer.apply\_gradients(zip(grads, vars)) in TensorFlow low-level training routines.

## **TensorFlow Equivalent**

`optimizer.step → optimizer.apply_gradients`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: step, update weights, optimizer step  
> * **Common Search Terms**: pytorch optimizer step, optimizer.step order, scheduler before step  
> * **Keywords**: step, update, parameters, gradient, optimizer  
> * **Frequently Confused With**: scheduler.step (updating weights vs updating learning rate)

## **Related Models**

resnet, bert, llama

## **Related Patterns**

gradient-accumulation, learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.step.html](https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.step.html)

## **Task**

Configure Multiple Parameter Groups

## **Problem Solved**

Assigns different hyperparameters (such as distinct learning rates or weight decay factors) to different subsets of model parameters within a single optimizer instance.

## **Mental Trigger**

I need to optimize different parts of my model (e.g., backbone vs head, weights vs biases) with different learning rates or weight decay settings.

## **Syntax**

`optimizer = torch.optim.AdamW([`  
    `{'params': group1_params, 'lr': 1e-4, 'weight_decay': 0.01},`  
    `{'params': group2_params, 'lr': 1e-3, 'weight_decay': 0.0}`  
`])`

## **Important Parameters**

> * params (iterable of Tensors or dicts): Parameter dicts containing a required 'params' key mapped to an iterable of parameters, alongside overriding hyperparameter keys.

## **Return Value**

An instance of torch.optim.Optimizer configured with an internal param\_groups list.

## **Example**

`import torch`  
`import torch.nn as nn`

`class CustomModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.backbone = nn.Linear(10, 10)`  
        `self.head = nn.Linear(10, 2)`

`model = CustomModel()`

`# Define parameter groups with distinct learning rates`  
`param_groups = [`  
    `{'params': model.backbone.parameters(), 'lr': 1e-4},`  
    `{'params': model.head.parameters(), 'lr': 1e-2}`  
`]`

`optimizer = torch.optim.AdamW(param_groups, weight_decay=0.01)`

`# Verify groups`  
`for i, group in enumerate(optimizer.param_groups):`  
    `print(f"Group {i}: params_count={len(group['params'])}, lr={group['lr']}")`

## **Use When**

> * Transfer learning: fine-tuning a pretrained backbone with a lower learning rate while training a new head with a higher learning rate.  
> * Disabling weight decay for biases and LayerNorm/BatchNorm weights while applying it to 2D weight matrices.

## **Avoid When**

> * All model parameters share uniform learning rates and weight decay settings.

## **Gotchas**

> * Every model parameter must appear at most once across all parameter groups. Overlapping parameters cause gradient updates to be applied multiple times or corrupt state.  
> * If a hyperparameter key is omitted from a group dictionary, it falls back to the top-level optimizer keyword default.

## **Performance Notes**

> * Modest administrative overhead. Having dozens of distinct parameter groups adds negligible computational time during optimizer.step().

## **Related APIs**

> * torch.optim.Optimizer.add\_param\_group

## **Framework Migration Notes**

In TensorFlow/Keras, parameter-specific hyperparameters usually require custom training steps or wrappers. PyTorch natively supports this through dictionary lists in Optimizer.\_\_init\_\_.

## **TensorFlow Equivalent**

`No direct equivalent. Custom training loops required in TensorFlow.`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Parameter Groups, Optimizer Param Groups, Layer-wise Learning Rates  
> * **Common Search Terms**: pytorch param\_groups, different learning rate for layers pytorch, exclude bias from weight decay  
> * **Keywords**: param\_groups, parameter-groups, fine-tuning, transfer-learning  
> * **Frequently Confused With**: model.parameters() (passing all parameters uniformly vs splitting into dictionaries)

## **Related Models**

resnet, vit, bert, roberta, llama

## **Related Patterns**

learning-rate-scheduling, memory-efficient-training

## **Related Workflows**

transfer-learning-for-vision, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/optim.html\#per-parameter-options](https://www.google.com/search?q=https://pytorch.org/docs/stable/optim.html%23per-parameter-options)

## **Task**

Freeze and Exclude Parameters from Optimization

## **Problem Solved**

Prevents specific parameter tensors from receiving gradient updates by setting requires\_grad=False and omitting them from the optimizer parameter list, saving compute and memory.

## **Mental Trigger**

I am doing transfer learning or feature extraction and want to freeze the pretrained layers completely.

## **Syntax**

`for param in model.backbone.parameters():`  
    `param.requires_grad = False`

`optimizer = torch.optim.AdamW(`  
    `filter(lambda p: p.requires_grad, model.parameters()),`  
    `lr=1e-3`  
`)`

## **Important Parameters**

> * filter(predicate, iterable): Python standard filter function used to extract parameters where requires\_grad evaluates to True.

## **Return Value**

An optimizer instance containing references only to trainable parameters.

## **Example**

`import torch`  
`import torch.nn as nn`

`class TransferModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.feature_extractor = nn.Linear(10, 10)`  
        `self.classifier = nn.Linear(10, 2)`

`model = TransferModel()`

`# Freeze feature extractor`  
`for param in model.feature_extractor.parameters():`  
    `param.requires_grad = False`

`# Pass only trainable parameters to optimizer`  
`trainable_params = [p for p in model.parameters() if p.requires_grad]`  
`optimizer = torch.optim.SGD(trainable_params, lr=0.01)`

`print(f"Total params: {len(list(model.parameters()))}, Trainable params in optimizer: {len(optimizer.param_groups[0]['params'])}")`

## **Use When**

> * Feature extraction in vision or NLP where base backbone weights must remain frozen.  
> * Parameter-Efficient Fine-Tuning (PEFT / LoRA) where frozen base weights do not require optimizer state memory.

## **Avoid When**

> * Full fine-tuning where all parameters require end-to-end gradient updates.

## **Gotchas**

> * If you set requires\_grad=False *after* creating the optimizer, the optimizer still holds references to those parameters in its state and will waste memory tracking them. Always filter before initializing the optimizer.  
> * Unfrozen layers placed after frozen layers still require standard backpropagation to compute upstream gradients.

## **Performance Notes**

> * Excluding frozen parameters from the optimizer eliminates memory allocations for momentum and moment buffers (e.g., saving 8 bytes per parameter for Adam).

## **Related APIs**

> * torch.Tensor.requires\_grad\_  
> * torch.nn.Module.requires\_grad\_

## **Framework Migration Notes**

In TensorFlow, setting layer.trainable \= False dynamically excludes weights from compile step updates. In PyTorch, filtering must explicitly pass p.requires\_grad to the optimizer.

## **TensorFlow Equivalent**

`layer.trainable = False → param.requires_grad = False + filter in optimizer`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Freeze layers, exclude parameters, freeze weights pytorch  
> * **Common Search Terms**: pytorch freeze parameters optimizer, requires\_grad false optimizer, filter trainable parameters  
> * **Keywords**: freeze, requires\_grad, transfer-learning, peft, lora  
> * **Frequently Confused With**: torch.no\_grad() (disabling autograd globally vs disabling parameter updates permanently)

## **Related Models**

resnet, vit, bert, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

transfer-learning-for-vision, production-llm-cost-latency-optimization

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/notes/autograd.html\#excluding-subgraphs-from-backward](https://www.google.com/search?q=https://pytorch.org/docs/stable/notes/autograd.html%23excluding-subgraphs-from-backward)

## **Task**

Apply Different Learning Rates to Parameter Groups

## **Problem Solved**

Modifies learning rates across parameter groups dynamically or statically during or after initialization.

## **Mental Trigger**

I want to inspect or adjust individual learning rates per parameter group during my custom training loop.

## **Syntax**

`for param_group in optimizer.param_groups:`  
    `param_group['lr'] = new_lr`

## **Important Parameters**

> * param\_group\['lr'\] (float): The specific learning rate scalar assigned to a parameter group dictionary.

## **Return Value**

None. Updates param\_groups dictionaries in place.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Sequential(`  
    `nn.Linear(10, 5),`  
    `nn.Linear(5, 2)`  
`)`

`optimizer = torch.optim.SGD([`  
    `{'params': model[0].parameters(), 'lr': 0.01},`  
    `{'params': model[1].parameters(), 'lr': 0.1}`  
`])`

`# Scale down learning rates by factor of 0.5 manually`  
`for i, param_group in enumerate(optimizer.param_groups):`  
    `param_group['lr'] *= 0.5`  
    `print(f"Group {i} updated LR: {param_group['lr']}")`

## **Use When**

> * Implementing custom learning rate warmup or decay policies that cannot be represented by standard lr\_scheduler classes.  
> * Adjusting layer-wise learning rate decay (LLRD) for deep Transformers.

## **Avoid When**

> * Standard PyTorch schedulers (e.g., CosineAnnealingLR) already provide the needed decay schedule.

## **Gotchas**

> * Overwriting param\_group\['lr'\] directly while an lr\_scheduler is active will cause the scheduler to overwrite your manual changes on its next .step().  
> * Ensure every group intended for rate modification is explicitly targeted by key or index.

## **Performance Notes**

> * In-place list mutation with negligible compute footprint.

## **Related APIs**

> * torch.optim.lr\_scheduler  
> * torch.optim.Optimizer.add\_param\_group

## **Framework Migration Notes**

Directly accesses the internal param\_groups list, a pattern native to PyTorch.

## **TensorFlow Equivalent**

`optimizer.learning_rate.assign(new_lr) → param_group['lr'] = new_lr`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Change learning rate, custom lr schedule, set learning rate manually  
> * **Common Search Terms**: pytorch change lr dynamically, modify param\_groups lr, set optimizer learning rate  
> * **Keywords**: learning-rate, param\_groups, dynamic-lr, optimization  
> * **Frequently Confused With**: lr\_scheduler.step() (automated scheduling vs direct manual dictionary assignment)

## **Related Models**

bert, roberta, vit, llama

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

transfer-learning-for-vision, production-llm-cost-latency-optimization

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/optim.html](https://pytorch.org/docs/stable/optim.html)

## **Task**

Save and Restore Optimizer State (optimizer.state\_dict / load\_state\_dict)

## **Problem Solved**

Serializes and restores optimizer state buffers (such as momentum and step counters) to ensure exact training resumption across checkpoints.

## **Mental Trigger**

I am saving a training checkpoint to disk and must save the optimizer's momentum and step state alongside model weights.

## **Syntax**

`# Save state`  
`state = optimizer.state_dict()`

`# Load state`  
`optimizer.load_state_dict(state)`

## **Important Parameters**

> * state\_dict (dict): Dictionary containing optimizer hyperparameters (param\_groups) and current optimization state buffers (state).

## **Return Value**

optimizer.state\_dict() returns a Python dictionary containing full optimizer state. load\_state\_dict() returns None.

## **Example**

`import torch`  
`import torch.nn as nn`  
`import tempfile`

`model = nn.Linear(5, 2)`  
`optimizer = torch.optim.Adam(model.parameters(), lr=0.001)`

`# Perform dummy step to populate optimizer state buffers`  
`x = torch.randn(2, 5)`  
`loss = model(x).sum()`  
`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

`# Save optimizer checkpoint`  
`checkpoint_path = tempfile.mktemp()`  
`torch.save({'optimizer_state': optimizer.state_dict()}, checkpoint_path)`

`# Restore optimizer state into a new optimizer instance`  
`new_optimizer = torch.optim.Adam(model.parameters(), lr=0.001)`  
`checkpoint = torch.load(checkpoint_path, weights_only=True)`  
`new_optimizer.load_state_dict(checkpoint['optimizer_state'])`

`print(f"Restored state step counter: {new_optimizer.state[model.weight]['step']}")`

## **Use When**

> * Saving regular training checkpoints for fault-tolerant cluster training or job resumption.  
> * Pre-allocating training states across distributed GPU ranks.

## **Avoid When**

> * Saving model weights exclusively for inference (inference does not require optimizer states).

## **Gotchas**

> * Always move model parameters to the target device (e.g., model.to('cuda')) *before* calling optimizer.load\_state\_dict(). Otherwise, optimizer state tensors remain on CPU.  
> * Loading state dict into an optimizer with a different model architecture or mismatched parameter group structure will raise a ValueError.

## **Performance Notes**

> * Saving optimizer state dicts for Adam doubles checkpoint file size relative to model weights because Adam stores 2 state float tensors per parameter.

## **Related APIs**

> * torch.save  
> * torch.load  
> * nn.Module.state\_dict

## **Framework Migration Notes**

Similar to saving checkpoint objects in TensorFlow via tf.train.Checkpoint.

## **TensorFlow Equivalent**

`ckpt.save() / ckpt.restore() → optimizer.state_dict() / optimizer.load_state_dict()`

## **Version Compatibility**

Use torch.load(..., weights\_only=True) in modern PyTorch releases to avoid unsafe unpickling security risks.

## **Search Metadata**

> * **Aliases**: save optimizer, load optimizer state, optimizer checkpointing  
> * **Common Search Terms**: pytorch load\_state\_dict optimizer, resume training optimizer state, optimizer state\_dict cuda device  
> * **Keywords**: state\_dict, load\_state\_dict, checkpointing, serialization, momentum  
> * **Frequently Confused With**: model.state\_dict() (model weight dictionary vs optimizer state dictionary)

## **Related Models**

resnet, bert, llama, gpt

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.state\_dict.html](https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.state_dict.html)

## **Task**

Apply Step Learning Rate Scheduler (lr\_scheduler.StepLR)

## **Problem Solved**

Decays the learning rate of each parameter group by gamma every step\_size epochs.

## **Mental Trigger**

I want to drop my learning rate by a fixed factor (e.g., multiply by 0.1) every fixed number of epochs (e.g., every 30 epochs).

## **Syntax**

`torch.optim.lr_scheduler.StepLR(`  
    `optimizer,`  
    `step_size,`  
    `gamma=0.1,`  
    `last_epoch=-1,`  
    `verbose='deprecated'`  
`)`

## **Important Parameters**

> * optimizer (Optimizer): Wrapped optimizer instance.  
> * step\_size (int): Period of learning rate decay in epoch count.  
> * gamma (float, default=0.1): Multiplicative factor of learning rate decay.  
> * last\_epoch (int, default=-1): The index of last epoch when resuming training.

## **Return Value**

An instance of StepLR tracking the specified optimizer.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.1)`  
`scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=2, gamma=0.1)`

`for epoch in range(5):`  
    `optimizer.step()`  
    `scheduler.step()`  
    `print(f"Epoch {epoch+1} LR: {scheduler.get_last_lr()[0]:.4f}")`

## **Use When**

> * Classical vision model training (e.g., standard ResNet baselines) where step decay at fixed epoch intervals is standard practice.

## **Avoid When**

> * Smoother continuous decay schedules (like Cosine Annealing) achieve better final convergence.  
> * Learning rate decay should be tied to validation metric performance rather than epoch count.

## **Gotchas**

> * Always call scheduler.step() *after* optimizer.step(). Calling it before optimizer.step() results in skipping the initial learning rate step.  
> * Calling get\_lr() directly is discouraged; use scheduler.get\_last\_lr() to fetch current rates reliably.

## **Performance Notes**

> * Negligible overhead. Performs basic scalar multiplication at epoch boundaries.

## **Related APIs**

> * torch.optim.lr\_scheduler.MultiStepLR  
> * torch.optim.lr\_scheduler.ExponentialLR

## **Framework Migration Notes**

Equivalent to tf.keras.optimizers.schedules.ExponentialDecay with discrete staircase steps.

## **TensorFlow Equivalent**

`lr_scheduler.StepLR → tf.keras.optimizers.schedules.ExponentialDecay(staircase=True)`

## **Version Compatibility**

The verbose argument is deprecated in PyTorch 2.2+; inspect learning rates via get\_last\_lr() instead.

## **Search Metadata**

> * **Aliases**: StepLR, step decay, step learning rate scheduler  
> * **Common Search Terms**: pytorch StepLR example, StepLR epoch placement, step\_size gamma pytorch  
> * **Keywords**: step-lr, scheduler, step\_size, gamma, decay  
> * **Frequently Confused With**: lr\_scheduler.MultiStepLR (fixed equal interval decay vs custom non-uniform epoch milestones)

## **Related Models**

resnet, yolo

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.StepLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.StepLR.html)

## **Task**

Apply Multi-Step Learning Rate Scheduler (lr\_scheduler.MultiStepLR)

## **Problem Solved**

Decays the learning rate by gamma once the epoch number reaches one of the specified milestone thresholds.

## **Mental Trigger**

I want to drop the learning rate at custom non-equidistant epoch milestones (e.g., at epoch 80, epoch 120, and epoch 150).

## **Syntax**

`torch.optim.lr_scheduler.MultiStepLR(`  
    `optimizer,`  
    `milestones,`  
    `gamma=0.1,`  
    `last_epoch=-1,`  
    `verbose='deprecated'`  
`)`

## **Important Parameters**

> * optimizer (Optimizer): Wrapped optimizer.  
> * milestones (iterable of ints): List of epoch indices when learning rate drops occur. Must be sorted.  
> * gamma (float, default=0.1): Multiplicative decay factor.  
> * last\_epoch (int, default=-1): Index of last epoch when resuming training.

## **Return Value**

An instance of MultiStepLR.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.1)`  
`# Drop LR at epoch 2 and epoch 4`  
`scheduler = torch.optim.lr_scheduler.MultiStepLR(optimizer, milestones=[2, 4], gamma=0.1)`

`for epoch in range(5):`  
    `optimizer.step()`  
    `scheduler.step()`  
    `print(f"Epoch {epoch+1} LR: {scheduler.get_last_lr()[0]:.4f}")`

## **Use When**

> * Domain-specific training regimes where standard equal step intervals perform worse than scheduled late drops.

## **Avoid When**

> * Epoch progression is non-deterministic or when continuous scheduling policies (e.g., Cosine) provide better generalization.

## **Gotchas**

> * milestones list elements must be strictly increasing integers. Unsorted lists result in skipped decay points.

## **Performance Notes**

> * Negligible overhead. Performs milestone comparison check once per epoch.

## **Related APIs**

> * torch.optim.lr\_scheduler.StepLR  
> * torch.optim.lr\_scheduler.CosineAnnealingLR

## **Framework Migration Notes**

In TensorFlow, implemented using tf.keras.optimizers.schedules.PiecewiseConstantDecay.

## **TensorFlow Equivalent**

`lr_scheduler.MultiStepLR → tf.keras.optimizers.schedules.PiecewiseConstantDecay`

## **Version Compatibility**

The verbose argument is deprecated in PyTorch 2.2+.

## **Search Metadata**

> * **Aliases**: MultiStepLR, multistep decay, milestone learning rate  
> * **Common Search Terms**: pytorch MultiStepLR milestones, drop lr at specific epochs pytorch  
> * **Keywords**: multistep, milestones, scheduler, decay, learning-rate  
> * **Frequently Confused With**: lr\_scheduler.StepLR (StepLR uses equal interval steps; MultiStepLR accepts custom milestone lists)

## **Related Models**

resnet, yolo

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.MultiStepLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.MultiStepLR.html)

## **Task**

Apply Exponential Learning Rate Scheduler (lr\_scheduler.ExponentialLR)

## **Problem Solved**

Decays the learning rate of each parameter group continuously by a multiplicative factor gamma at every epoch step.

## **Mental Trigger**

I want a smooth exponential drop in learning rate at every single epoch.

## **Syntax**

`torch.optim.lr_scheduler.ExponentialLR(`  
    `optimizer,`  
    `gamma,`  
    `last_epoch=-1,`  
    `verbose='deprecated'`  
`)`

## **Important Parameters**

> * optimizer (Optimizer): Wrapped optimizer.  
> * gamma (float): Multiplicative factor of learning rate decay per epoch step (e.g., 0.95).  
> * last\_epoch (int, default=-1): Index of last epoch when resuming training.

## **Return Value**

An instance of ExponentialLR.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.Adam(model.parameters(), lr=0.01)`  
`scheduler = torch.optim.lr_scheduler.ExponentialLR(optimizer, gamma=0.9)`

`for epoch in range(4):`  
    `optimizer.step()`  
    `scheduler.step()`  
    `print(f"Epoch {epoch+1} LR: {scheduler.get_last_lr()[0]:.5f}")`

## **Use When**

> * Continuous decay is desired over discrete step drops, particularly in smooth convergence setups or long training runs.

## **Avoid When**

> * High decay rates (e.g., gamma=0.1) are used, which shrink the learning rate to near-zero within very few epochs.

## **Gotchas**

> * gamma values must be close to 1.0 (e.g., 0.95–0.99). A small gamma causes premature decay before convergence.

## **Performance Notes**

> * Negligible overhead. Performs scalar multiplication step per epoch.

## **Related APIs**

> * torch.optim.lr\_scheduler.StepLR  
> * torch.optim.lr\_scheduler.CosineAnnealingLR

## **Framework Migration Notes**

Maps to tf.keras.optimizers.schedules.ExponentialDecay with continuous updates (staircase=False).

## **TensorFlow Equivalent**

`lr_scheduler.ExponentialLR → tf.keras.optimizers.schedules.ExponentialDecay(staircase=False)`

## **Version Compatibility**

The verbose parameter is deprecated in PyTorch 2.2+.

## **Search Metadata**

> * **Aliases**: ExponentialLR, exponential decay scheduler  
> * **Common Search Terms**: pytorch ExponentialLR example, smooth learning rate decay pytorch  
> * **Keywords**: exponential, decay, scheduler, continuous, learning-rate  
> * **Frequently Confused With**: lr\_scheduler.StepLR (StepLR drops at intervals; ExponentialLR drops exponentially every step)

## **Related Models**

resnet, bert

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.ExponentialLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.ExponentialLR.html)

## **Task**

Apply Cosine Annealing Scheduler (lr\_scheduler.CosineAnnealingLR)

## **Problem Solved**

Modulates the learning rate using a cosine schedule between eta\_max (initial rate) and eta\_min over T\_max epochs or steps.

## **Mental Trigger**

I want a smooth cosine decay schedule that gently decreases learning rate to near zero at the end of training.

## **Syntax**

`torch.optim.lr_scheduler.CosineAnnealingLR(`  
    `optimizer,`  
    `T_max,`  
    `eta_min=0,`  
    `last_epoch=-1,`  
    `verbose='deprecated'`  
`)`

## **Important Parameters**

> * optimizer (Optimizer): Wrapped optimizer.  
> * T\_max (int): Maximum number of iterations or epochs until minimum learning rate is reached.  
> * eta\_min (float, default=0): Minimum learning rate floor.  
> * last\_epoch (int, default=-1): Index of last epoch when resuming training.

## **Return Value**

An instance of CosineAnnealingLR.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)`

`# Schedule over 10 total epochs with minimum LR of 1e-6`  
`epochs = 10`  
`scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)`

`for epoch in range(epochs):`  
    `optimizer.step()`  
    `scheduler.step()`  
    `print(f"Epoch {epoch+1} LR: {scheduler.get_last_lr()[0]:.6f}")`

## **Use When**

> * Training Vision Transformers, Modern CNNs, or LLMs where smooth continuous decay provides optimal generalization.

## **Avoid When**

> * Total training step budget (T\_max) is unknown or dynamically changing during training.

## **Gotchas**

> * If training continues beyond T\_max steps, the cosine curve restarts and increases the learning rate back toward initial lr. Set T\_max exactly equal to total planned epochs/steps.  
> * T\_max can represent total epochs (if stepping per epoch) or total batch steps (if stepping per batch); keep the step call location consistent.

## **Performance Notes**

> * Negligible compute overhead. Evaluates simple mathematical trigonometric expression per step.

## **Related APIs**

> * torch.optim.lr\_scheduler.CosineAnnealingWarmRestarts  
> * torch.optim.lr\_scheduler.OneCycleLR

## **Framework Migration Notes**

Maps to tf.keras.optimizers.schedules.CosineDecay.

## **TensorFlow Equivalent**

`lr_scheduler.CosineAnnealingLR → tf.keras.optimizers.schedules.CosineDecay`

## **Version Compatibility**

The verbose argument is deprecated in PyTorch 2.2+.

## **Search Metadata**

> * **Aliases**: CosineAnnealingLR, cosine decay, cosine scheduler pytorch  
> * **Common Search Terms**: pytorch CosineAnnealingLR T\_max, cosine decay learning rate example, eta\_min cosine schedule  
> * **Keywords**: cosine, annealing, scheduler, decay, transformer, vision  
> * **Frequently Confused With**: CosineAnnealingWarmRestarts (single decay wave vs repeating restart cycles), OneCycleLR (cosine decay only vs warmup phase followed by decay)

## **Related Models**

resnet, vit, transformer, yolo, bert, roberta, llama

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.CosineAnnealingLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.CosineAnnealingLR.html)

## **Task**

Apply Reduce-on-Plateau Scheduler (lr\_scheduler.ReduceLROnPlateau)

## **Problem Solved**

Reduces the learning rate by a factor when a monitored validation metric stops improving for a specified number of evaluation patience epochs.

## **Mental Trigger**

I want my learning rate to drop automatically whenever my validation loss stops decreasing.

## **Syntax**

`torch.optim.lr_scheduler.ReduceLROnPlateau(`  
    `optimizer,`  
    `mode='min',`  
    `factor=0.1,`  
    `patience=10,`  
    `threshold=0.0001,`  
    `threshold_mode='rel',`  
    `cooldown=0,`  
    `min_lr=0,`  
    `eps=1e-08,`  
    `verbose='deprecated'`  
`)`

## **Important Parameters**

> * optimizer (Optimizer): Wrapped optimizer.  
> * mode (str, default='min'): One of 'min' (decay when metric stops decreasing) or 'max' (decay when metric stops increasing).  
> * factor (float, default=0.1): Factor by which learning rate will be reduced (*new*\_*lr*\=*lr*×*factor*).  
> * patience (int, default=10): Number of evaluation checks with no improvement before learning rate is reduced.  
> * min\_lr (float or list, default=0): Lower bound on learning rate scalar.

## **Return Value**

An instance of ReduceLROnPlateau.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.1)`  
`scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=2)`

`# Simulated validation loss curve plateauing`  
`val_losses = [1.0, 0.8, 0.8, 0.8, 0.8]`

`for epoch, val_loss in enumerate(val_losses):`  
    `optimizer.step()`  
    `# Must pass validation metric to scheduler.step()`  
    `scheduler.step(val_loss)`  
    `print(f"Epoch {epoch+1} Val Loss: {val_loss:.1f}, LR: {optimizer.param_groups[0]['lr']:.4f}")`

## **Use When**

> * Long training regimes where automated metric-driven rate drops eliminate trial-and-error fixed schedule tuning.

## **Avoid When**

> * Batch-level scheduling or deterministic cosine schedules are required.

## **Gotchas**

> * Unlike all other schedulers, ReduceLROnPlateau.step() **requires** a validation metric argument (e.g., scheduler.step(val\_loss)). Calling scheduler.step() without arguments raises a TypeError.  
> * ReduceLROnPlateau does not subclass \_LRScheduler, so methods like get\_last\_lr() do not exist; read optimizer.param\_groups\[0\]\['lr'\] directly.

## **Performance Notes**

> * Minimal overhead. Executes simple comparative checks against metric history array.

## **Related APIs**

> * torch.optim.lr\_scheduler.StepLR

## **Framework Migration Notes**

Maps to tf.keras.callbacks.ReduceLROnPlateau in TensorFlow/Keras.

## **TensorFlow Equivalent**

`lr_scheduler.ReduceLROnPlateau → tf.keras.callbacks.ReduceLROnPlateau`

## **Version Compatibility**

The verbose argument is deprecated in PyTorch 2.2+.

## **Search Metadata**

> * **Aliases**: ReduceLROnPlateau, reduce lr on plateau, adaptive metric scheduler  
> * **Common Search Terms**: pytorch ReduceLROnPlateau example, step validation loss plateau, patience metric scheduler  
> * **Keywords**: plateau, patience, val\_loss, adaptive, metric, scheduler  
> * **Frequently Confused With**: Standard \_LRScheduler subclasses (ReduceLROnPlateau requires passing metric value to step())

## **Related Models**

resnet, yolo, logistic-regression

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline, semantic-segmentation-pipeline

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.ReduceLROnPlateau.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.ReduceLROnPlateau.html)

## **Task**

Apply One-Cycle Learning Rate Policy (lr\_scheduler.OneCycleLR)

## **Problem Solved**

Warms up learning rate from an initial low value to a peak max\_lr, then decays it to a tiny minimum value, enabling Super-Convergence and faster training.

## **Mental Trigger**

I want to train my model fast using Leslie Smith's 1cycle policy with learning rate warmup and cosine decay per batch step.

## **Syntax**

`torch.optim.lr_scheduler.OneCycleLR(`  
    `optimizer,`  
    `max_lr,`  
    `total_steps=None,`  
    `epochs=None,`  
    `steps_per_epoch=None,`  
    `pct_start=0.3,`  
    `anneal_strategy='cos',`  
    `cycle_momentum=True,`  
    `base_momentum=0.85,`  
    `max_momentum=0.95,`  
    `div_factor=25.0,`  
    `final_div_factor=10000.0,`  
    `last_epoch=-1,`  
    `verbose='deprecated'`  
`)`

## **Important Parameters**

> * optimizer (Optimizer): Wrapped optimizer.  
> * max\_lr (float or list): Upper learning rate boundary in the cycle.  
> * total\_steps (int, optional): Total number of batch steps in training.  
> * steps\_per\_epoch (int, optional): Number of batch steps per epoch (required if total\_steps is omitted).  
> * epochs (int, optional): Number of training epochs.  
> * pct\_start (float, default=0.3): Percentage of cycle spent increasing learning rate.

## **Return Value**

An instance of OneCycleLR.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)`

`# OneCycleLR is updated every BATCH step, not epoch`  
`epochs = 2`  
`steps_per_epoch = 3`  
`scheduler = torch.optim.lr_scheduler.OneCycleLR(`  
    `optimizer,`  
    `max_lr=0.1,`  
    `steps_per_epoch=steps_per_epoch,`  
    `epochs=epochs`  
`)`

`for epoch in range(epochs):`  
    `for step in range(steps_per_epoch):`  
        `optimizer.step()`  
        `scheduler.step() # Called inside step loop!`  
        `print(f"Step {epoch*steps_per_epoch + step + 1} LR: {scheduler.get_last_lr()[0]:.4f}")`

## **Use When**

> * Fast model training where Super-Convergence allows training in far fewer total epochs.  
> * Fine-tuning vision models or training small-to-medium models from scratch efficiently.

## **Avoid When**

> * Continual learning or open-ended training where total step count is non-deterministic.

## **Gotchas**

> * OneCycleLR.step() **must be called after every batch step**, not once per epoch. Calling it per epoch leads to index out-of-bounds or premature schedule exhaustion.  
> * Setting cycle\_momentum=True with optimizers that do not support momentum (like standard Adam without momentum attributes) raises an error; set cycle\_momentum=False for those optimizers.

## **Performance Notes**

> * Negligible step cost. Updates both momentum and learning rate attributes per iteration.

## **Related APIs**

> * torch.optim.lr\_scheduler.CosineAnnealingLR  
> * torch.optim.lr\_scheduler.CyclicLR

## **Framework Migration Notes**

No native single-class equivalent in TensorFlow Keras; requires custom schedule implementation or TensorFlow Addons.

## **TensorFlow Equivalent**

`No direct native Keras equivalent.`

## **Version Compatibility**

The verbose parameter is deprecated in PyTorch 2.2+.

## **Search Metadata**

> * **Aliases**: OneCycleLR, 1cycle policy, super convergence scheduler  
> * **Common Search Terms**: pytorch OneCycleLR example, OneCycleLR steps\_per\_epoch, max\_lr onecycle pytorch  
> * **Keywords**: onecycle, super-convergence, warmup, schedule, momentum  
> * **Frequently Confused With**: lr\_scheduler.CosineAnnealingLR (OneCycle incorporates explicit warmup phase and momentum annealing alongside LR decay)

## **Related Models**

resnet, vit, yolo, bert

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.OneCycleLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.OneCycleLR.html)

## **Task**

Inspect and Modify Optimizer Learning Rates

## **Problem Solved**

Provides explicit techniques to query, print, and adjust individual or global learning rates directly from an active optimizer instance.

## **Mental Trigger**

I want to print the current learning rate for logging or debug why my learning rate is not changing.

## **Syntax**

`# Inspect current learning rates across all parameter groups`  
`current_lrs = [group['lr'] for group in optimizer.param_groups]`

`# Modify learning rate for group 0`  
`optimizer.param_groups[0]['lr'] = new_learning_rate`

## **Important Parameters**

> * param\_groups (list of dicts): Internal list holding parameter references and active hyperparameters per group.

## **Return Value**

A Python list of float learning rates when inspecting, or None when modifying in place.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(5, 2)`  
`optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)`

`# Function to query current learning rates`  
`def get_lrs(opt):`  
    `return [g['lr'] for g in opt.param_groups]`

`print(f"Initial LR: {get_lrs(optimizer)}")`

`# Adjust learning rate dynamically`  
`for g in optimizer.param_groups:`  
    `g['lr'] = 5e-4`

`print(f"Modified LR: {get_lrs(optimizer)}")`

## **Use When**

> * Implementing custom metric logging callbacks (e.g., streaming rates to TensorBoard or Weights & Biases).  
> * Debugging learning rate behavior when combined with external schedulers.

## **Avoid When**

> * Manually altering rates while an active \_LRScheduler controls rates on every epoch step.

## **Gotchas**

> * Inspecting scheduler.get\_last\_lr() returns the rate calculated during the previous scheduler step, which may differ from optimizer.param\_groups\[0\]\['lr'\] if manual modifications occurred afterward.

## **Performance Notes**

> * Zero performance cost. Accesses in-memory list elements directly.

## **Related APIs**

> * torch.optim.lr\_scheduler

## **Framework Migration Notes**

In PyTorch, learning rates are plain Python float variables stored in optimizer.param\_groups\[i\]\['lr'\]. In TensorFlow, they are often tracked as tf.Variable objects.

## **TensorFlow Equivalent**

`optimizer.learning_rate.numpy() → optimizer.param_groups[0]['lr']`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: get learning rate, print current lr, inspect optimizer lr  
> * **Common Search Terms**: how to get current learning rate pytorch, print learning rate optimizer, modify param\_groups lr  
> * **Keywords**: learning-rate, inspect, debug, param\_groups, logging  
> * **Frequently Confused With**: scheduler.get\_last\_lr() (reading scheduler state vs reading true live optimizer state)

## **Related Models**

resnet, bert, llama

## **Related Patterns**

learning-rate-scheduling

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/optim.html](https://pytorch.org/docs/stable/optim.html)

## **Task**

Perform Gradient Clipping Before Optimizer Step (nn.utils.clip\_grad\_norm\_ / clip\_grad\_value\_)

## **Problem Solved**

Clips gradient norms or individual gradient values before updating parameters, preventing exploding gradients in deep architectures, RNNs, and LLMs.

## **Mental Trigger**

My model loss is outputting NaN or exploding during training, and I need to cap gradient magnitudes.

## **Syntax**

`# Clip by total L2 norm across parameters`  
`torch.nn.utils.clip_grad_norm_(`  
    `parameters,`  
    `max_norm,`  
    `norm_type=2.0,`  
    `error_if_nonfinite=False,`  
    `foreach=None`  
`)`

`# Clip by elementwise value threshold`  
`torch.nn.utils.clip_grad_value_(`  
    `parameters,`  
    `clip_value`  
`)`

## **Important Parameters**

> * parameters (Iterable\[Tensor\]): Tensors with computed gradients to clip.  
> * max\_norm (float): Maximum norm threshold for gradient clipping.  
> * norm\_type (float, default=2.0): Type of *p*\-norm used (e.g., 2 for *L*2​ norm, float('inf') for *L*∞​).  
> * clip\_value (float): Maximum allowable elementwise threshold value.  
> * error\_if\_nonfinite (bool, default=False): Raises an error if total norm is NaN or Inf.

## **Return Value**

clip\_grad\_norm\_ returns the total norm of parameters as a single float scalar Tensor before clipping. clip\_grad\_value\_ returns None.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.1)`

`x = torch.randn(4, 10)`  
`y = torch.randint(0, 2, (4,))`  
`criterion = nn.CrossEntropyLoss()`

`optimizer.zero_grad(set_to_none=True)`  
`loss = criterion(model(x), y)`  
`loss.backward()`

`# Clip gradient norms to max 1.0 BEFORE optimizer step`  
`total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)`  
`optimizer.step()`

`print(f"Gradient norm before clipping: {total_norm:.4f}")`

## **Use When**

> * Training Transformers, LLMs, or RNNs prone to unstable gradient spikes.  
> * Mixed precision training where gradient scaling prevents extreme unbounded gradients.

## **Avoid When**

> * Optimizing simple convex or stable shallow networks where gradient clipping slows convergence unnecessarily.

## **Gotchas**

> * **Order matters strictly**: Always call clip\_grad\_norm\_ **after** loss.backward() and **before** optimizer.step(). Calling it after optimizer.step() has zero effect on parameter updates.  
> * When using mixed precision (torch.amp.GradScaler), unscale gradients using scaler.unscale\_(optimizer) *before* calling clip\_grad\_norm\_.

## **Performance Notes**

> * Involves computing norms across all model parameters, incurring GPU memory access costs. foreach=True leverages multi-tensor kernels to reduce latency.

## **Related APIs**

> * torch.optim.Optimizer.step  
> * torch.Tensor.backward

## **Framework Migration Notes**

Maps to tf.clip\_by\_global\_norm in TensorFlow low-level training routines.

## **TensorFlow Equivalent**

`nn.utils.clip_grad_norm_ → tf.clip_by_global_norm`

## **Version Compatibility**

error\_if\_nonfinite was introduced in PyTorch 1.9 to catch exploding instabilities early.

## **Search Metadata**

> * **Aliases**: clip\_grad\_norm\_, gradient clipping, clip gradients pytorch  
> * **Common Search Terms**: pytorch clip\_grad\_norm\_ placement, gradient clipping max\_norm, clip\_grad\_norm\_ vs clip\_grad\_value\_  
> * **Keywords**: gradient-clipping, max\_norm, exploding-gradients, transformer, stabilization  
> * **Frequently Confused With**: clip\_grad\_value\_ (clip\_grad\_norm\_ scales all gradients proportionally based on vector norm; clip\_grad\_value\_ hard-clamps individual element values independently)

## **Related Models**

bert, roberta, t5, bart, gpt, llama, qwen, gemma, deepseek

## **Related Patterns**

gradient-accumulation, mixed-precision, memory-efficient-training

## **Related Workflows**

text-classification-pipeline-classical-encoder, production-llm-cost-latency-optimization

## **Related Cheatsheet**

optimizers

## **Related Decision Guides**

precision-tradeoffs-guide, hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.utils.clip\_grad\_norm\_.html](https://pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html)

---

