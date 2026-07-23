# **PyTorch Loss Functions AENS Module**

# **Response: 04\_loss.md — PyTorch Loss Functions**

## **Task**

Compute Cross Entropy Loss (nn.CrossEntropyLoss)

## **Problem Solved**

Measures the divergence between unnormalized model predictions (logits) and target labels for multi-class classification tasks.

## **Mental Trigger**

I need a numerically stable loss for multi-class classification using unnormalized logits.

## **Syntax**

`torch.nn.CrossEntropyLoss(`  
    `weight=None,`  
    `size_average=None,`  
    `ignore_index=-100,`  
    `reduce=None,`  
    `reduction='mean',`  
    `label_smoothing=0.0`  
`)`

## **Important Parameters**

> * **weight**: A manual rescaling weight given to each class as a 1D tensor of shape (C,).  
> * **ignore\_index**: Specifies a target value that is ignored and does not contribute to the input gradient.  
> * **reduction**: Specifies the reduction to apply to the output ('none', 'mean', 'sum').  
> * **label\_smoothing**: A float in \[0.0, 1.0\] specifying the amount of label smoothing regularization.

## **Return Value**

A scalar float tensor if reduction='mean' or 'sum', or a tensor matching target shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`logits = torch.tensor([[2.1, 0.5, -0.8], [0.1, 3.2, 0.4]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1], dtype=torch.int64)`

`criterion = nn.CrossEntropyLoss()`  
`loss = criterion(logits, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training multi-class classification models where each input belongs to exactly one class.  
> * Computing loss directly from raw model logits without applying softmax manually.  
> * Regularizing classification models via label smoothing to prevent overconfidence.

## **Avoid When**

> * Outputting probabilities that have already passed through a Softmax layer (use nn.NLLLoss with LogSoftmax instead).  
> * Working with multi-label problems where classes are not mutually exclusive (use nn.BCEWithLogitsLoss).

## **Gotchas**

> * Applying nn.Softmax before CrossEntropyLoss causes incorrect gradients because CrossEntropyLoss implicitly applies LogSoftmax internally.  
> * Passing target tensors with floating-point class index dtypes causes type errors. Class index targets must be torch.int64 (Long).  
> * Expecting target tensor shape to match logits shape when using class index targets. Target shape must omit the class dimension C.  
> * Using label\_smoothing \> 0.0 with class index targets and expecting one-hot matrix output without checking internal broadcasting behavior.

## **Performance Notes**

> * PyTorch fuses the softmax calculation with the cross-entropy computation in CUDA kernels, significantly improving numerical stability and throughput.  
> * Unreduced losses (reduction='none') retain intermediate memory, which increases peak VRAM usage during training.

## **Related APIs**

> * torch.nn.functional.cross\_entropy  
> * torch.nn.NLLLoss  
> * torch.nn.LogSoftmax

## **Framework Migration Notes**

When migrating from TensorFlow/Keras, nn.CrossEntropyLoss combines both tf.keras.losses.SparseCategoricalCrossentropy(from\_logits=True) and label smoothing functionality into a single module.

## **TensorFlow Equivalent**

`nn.CrossEntropyLoss → tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: CrossEntropy, SoftmaxLoss, CE Loss  
> * **Common Search Terms**: pytorch cross entropy loss, multiclass classification loss, logit cross entropy  
> * **Keywords**: cross-entropy, logits, multi-class, label-smoothing, classification  
> * **Frequently Confused With**: nn.NLLLoss, nn.BCELoss

## **Related Models**

resnet, vit, transformer, bert, roberta, llama

## **Related Patterns**

mixed-precision, gradient-accumulation

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder, transfer-learning-for-vision

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

## **Task**

Compute Binary Cross Entropy Loss (nn.BCELoss)

## **Problem Solved**

Measures the binary cross-entropy between target probabilities and predicted probabilities for binary classification tasks.

## **Mental Trigger**

I need binary classification loss when my model already outputs probabilities between 0 and 1\.

## **Syntax**

`torch.nn.BCELoss(`  
    `weight=None,`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **weight**: A manual rescaling weight given to the loss of each batch element as a tensor matching input shape.  
> * **reduction**: Specifies the reduction to apply ('none', 'mean', 'sum').

## **Return Value**

A scalar float tensor by default, or a tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`probabilities = torch.tensor([0.8, 0.2, 0.9], dtype=torch.float32)`  
`targets = torch.tensor([1.0, 0.0, 1.0], dtype=torch.float32)`

`criterion = nn.BCELoss()`  
`loss = criterion(probabilities, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Working with pipeline architectures that explicitly require probability outputs in \[0, 1\] prior to loss evaluation.  
> * Calculating custom probability bounds or operating inside constrained sub-networks.

## **Avoid When**

> * Training standard binary classification neural networks from raw logits (use nn.BCEWithLogitsLoss instead for numerical stability).

## **Gotchas**

> * Input probabilities outside the \[0.0, 1.0\] range trigger runtime assertions or yield NaN values due to unconstrained log evaluation.  
> * Target dtype must match prediction dtype (torch.float32), passing integer targets causes type errors.  
> * BCELoss is vulnerable to underflow when probabilities approach 0.0 or 1.0 unless clamped manually.

## **Performance Notes**

> * Lacks the fused log-sum-exp kernel optimization present in BCEWithLogitsLoss, making it slower and numerically less stable on CUDA hardware.

## **Related APIs**

> * torch.nn.BCEWithLogitsLoss  
> * torch.nn.functional.binary\_cross\_entropy  
> * torch.sigmoid

## **Framework Migration Notes**

Maps to TensorFlow's BinaryCrossentropy with from\_logits=False.

## **TensorFlow Equivalent**

`nn.BCELoss → tf.keras.losses.BinaryCrossentropy(from_logits=False)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: BCE, BinaryCrossEntropy  
> * **Common Search Terms**: pytorch bce loss, binary loss probabilities, sigmoid cross entropy  
> * **Keywords**: bce, binary-classification, probabilities, sigmoid  
> * **Frequently Confused With**: nn.BCEWithLogitsLoss, nn.CrossEntropyLoss

## **Related Models**

logistic-regression, resnet

## **Related Patterns**

mixed-precision

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.BCELoss.html](https://pytorch.org/docs/stable/generated/torch.nn.BCELoss.html)

## **Task**

Compute Binary Cross Entropy with Logits (nn.BCEWithLogitsLoss)

## **Problem Solved**

Combines a Sigmoid layer and Binary Cross Entropy loss in one single class for numerical stability in binary and multi-label classification.

## **Mental Trigger**

I need a stable loss function for binary or multi-label classification directly from unnormalized logits.

## **Syntax**

`torch.nn.BCEWithLogitsLoss(`  
    `weight=None,`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean',`  
    `pos_weight=None`  
`)`

## **Important Parameters**

> * **weight**: Rescaling weight array matching the target batch shape.  
> * **pos\_weight**: Weight of positive examples to balance precision and recall. Must be a 1D or broadcastable tensor.  
> * **reduction**: Specifies output reduction behavior ('none', 'mean', 'sum').

## **Return Value**

A scalar float tensor if reduction='mean' or 'sum', or a tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`logits = torch.tensor([1.5, -2.0, 3.0], dtype=torch.float32)`  
`targets = torch.tensor([1.0, 0.0, 1.0], dtype=torch.float32)`

`pos_weight = torch.tensor([1.5])`  
`criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)`  
`loss = criterion(logits, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Performing binary classification from raw, unnormalized model outputs.  
> * Training multi-label classification models where each target sample can belong to multiple independent classes.  
> * Handling positive/negative class imbalance via the pos\_weight parameter.

## **Avoid When**

> * Model output targets are mutually exclusive across classes (use nn.CrossEntropyLoss).  
> * Predictions are already transformed by torch.sigmoid.

## **Gotchas**

> * Applying torch.sigmoid to network outputs before passing them into BCEWithLogitsLoss leads to double sigmoid application and incorrect loss values.  
> * Target tensors must be floating-point tensors matching the shape of input logits, not long/integer label tensors.  
> * pos\_weight size must match the number of target classes to broadcast correctly across batch dimensions.

## **Performance Notes**

> * Employs the log-sum-exp trick to prevent numerical overflow/underflow during exponentiation.  
> * Native CUDA kernels fuse the sigmoid activation and cross-entropy reduction steps, minimizing memory bandwidth bottlenecks.

## **Related APIs**

> * torch.nn.BCELoss  
> * torch.nn.functional.binary\_cross\_entropy\_with\_logits

## **Framework Migration Notes**

Maps directly to TensorFlow's BinaryCrossentropy with from\_logits=True.

## **TensorFlow Equivalent**

`nn.BCEWithLogitsLoss → tf.keras.losses.BinaryCrossentropy(from_logits=True)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: BCEWithLogits, Numerically Stable BCE  
> * **Common Search Terms**: pytorch bce with logits, multi-label classification loss, pos\_weight bce  
> * **Keywords**: bce, logits, sigmoid, multi-label, pos\_weight  
> * **Frequently Confused With**: nn.BCELoss, nn.CrossEntropyLoss

## **Related Models**

resnet, yolo, bert, roberta, logistic-regression

## **Related Patterns**

mixed-precision, gradient-accumulation

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html)

## **Task**

Compute Negative Log Likelihood Loss (nn.NLLLoss)

## **Problem Solved**

Computes negative log likelihood loss between log-probabilities and target indices, useful for models that explicitly output log-probabilities.

## **Mental Trigger**

My model explicitly outputs log-probabilities (like LogSoftmax) and I need to calculate classification loss.

## **Syntax**

`torch.nn.NLLLoss(`  
    `weight=None,`  
    `size_average=None,`  
    `ignore_index=-100,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **weight**: 1D manual class weighting tensor of shape (C,).  
> * **ignore\_index**: Specifies a target class index to ignore in gradient updates.  
> * **reduction**: Reduction mode ('none', 'mean', 'sum').

## **Return Value**

A scalar float tensor if reduced, or a tensor matching target shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`log_probs = torch.tensor([[-0.2, -1.8, -3.1], [-2.5, -0.1, -2.9]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1], dtype=torch.int64)`

`criterion = nn.NLLLoss()`  
`loss = criterion(log_probs, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Model final layers explicitly use nn.LogSoftmax due to architectural constraints or custom output requirements.  
> * Implementing sequence generation tasks where log-probabilities are extracted at each decoding step.

## **Avoid When**

> * Inputs are raw logits (use nn.CrossEntropyLoss instead to leverage fused CUDA operations).  
> * Inputs are standard unlogged probabilities in range \[0, 1\].

## **Gotchas**

> * Input tensors must contain log-probabilities (negative numbers), passing unlogged probabilities produces negative loss values.  
> * Target indices must be integers (torch.int64) within range \[0, C-1\].

## **Performance Notes**

> * NLLLoss simply gathers negative values at specified target indices.  
> * Computing LogSoftmax and NLLLoss separately is slower than calling a single fused CrossEntropyLoss.

## **Related APIs**

> * torch.nn.LogSoftmax  
> * torch.nn.CrossEntropyLoss  
> * torch.nn.functional.nll\_loss

## **Framework Migration Notes**

Equivalent to using tf.keras.losses.SparseCategoricalCrossentropy(from\_logits=False) on log-probability tensors or taking elementwise gathering in TensorFlow.

## **TensorFlow Equivalent**

`nn.NLLLoss → tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: NLL, Negative Log Likelihood  
> * **Common Search Terms**: pytorch nll loss, log softmax loss, negative log likelihood  
> * **Keywords**: nll, log-softmax, classification, target-indices  
> * **Frequently Confused With**: nn.CrossEntropyLoss, nn.KLDivLoss

## **Related Models**

bert, gpt, t5

## **Related Patterns**

mixed-precision

## **Related Workflows**

text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.NLLLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.NLLLoss.html)

## **Task**

Compute Multi-Class Margin Loss (nn.MultiMarginLoss)

## **Problem Solved**

Computes a multi-class hinge loss (margin-based classification) optimizing margins between the correct target class score and non-target class scores.

## **Mental Trigger**

I need a margin-based SVM-like hinge loss for multi-class classification problems.

## **Syntax**

`torch.nn.MultiMarginLoss(`  
    `p=1,`  
    `margin=1.0,`  
    `weight=None,`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **p**: Norm degree for margin computation. Must be 1 or 2 (default is 1).  
> * **margin**: Margin value threshold (default is 1.0).  
> * **weight**: 1D class weighting tensor of shape (C,).  
> * **reduction**: Reduction behavior ('none', 'mean', 'sum').

## **Return Value**

A scalar float tensor if reduced, or tensor of shape (N,) if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`logits = torch.tensor([[1.5, 0.2, -0.5], [0.1, 2.3, 0.8]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1], dtype=torch.int64)`

`criterion = nn.MultiMarginLoss(p=1, margin=1.0)`  
`loss = criterion(logits, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training large-margin classifier models (e.g., neural SVMs).  
> * Requiring clear separation margins between decision boundaries for multi-class tasks.

## **Avoid When**

> * Training standard probabilistic neural networks where calibrated output probabilities are required.

## **Gotchas**

> * Input must be a 2D tensor of shape (N, C). Higher dimensional inputs are not supported natively without flattening.  
> * Parameter p only accepts values 1 or 2, supplying other values throws runtime errors.

## **Performance Notes**

> * Evaluates pairwise differences across all non-target classes for each sample, making its complexity scale linearly with class count *C*.

## **Related APIs**

> * torch.nn.MultiLabelMarginLoss  
> * torch.nn.MarginRankingLoss

## **Framework Migration Notes**

No direct equivalent in standard Keras/TensorFlow loss modules.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: MultiClassHingeLoss, SVM Loss  
> * **Common Search Terms**: pytorch multiclass margin loss, hinge loss multiclass, svm neural net loss  
> * **Keywords**: hinge, margin, svm, multiclass  
> * **Frequently Confused With**: nn.MultiLabelMarginLoss, nn.MarginRankingLoss

## **Related Models**

logistic-regression, resnet

## **Related Patterns**

mixed-precision

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.MultiMarginLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.MultiMarginLoss.html)

## **Task**

Compute Multi-Label Margin Loss (nn.MultiLabelMarginLoss)

## **Problem Solved**

Computes a hinge loss for multi-label classification tasks where an input sample can belong to multiple target classes simultaneously.

## **Mental Trigger**

I need a margin-based hinge loss for samples that have variable numbers of correct labels.

## **Syntax**

`torch.nn.MultiLabelMarginLoss(`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **reduction**: Reduction mode to apply across the batch ('none', 'mean', 'sum').

## **Return Value**

A scalar float tensor if reduced, or tensor of shape (N,) if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`logits = torch.tensor([[0.1, 2.5, 3.1, -0.4], [1.2, -0.5, 0.2, 2.0]], dtype=torch.float32)`  
`targets = torch.tensor([[2, 1, -1, -1], [0, 3, -1, -1]], dtype=torch.int64)`

`criterion = nn.MultiLabelMarginLoss()`  
`loss = criterion(logits, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Optimizing multi-label ranking models using a hinge-based criterion.  
> * Target label arrays have variable lengths padded with negative integers (specifically \-1).

## **Avoid When**

> * Optimizing multi-label targets using binary probabilities (use nn.BCEWithLogitsLoss).

## **Gotchas**

> * Targets must be integer class indices padded with \-1 to signal the end of valid target classes for that sample.  
> * Unpadded targets or using float probabilities instead of index sequences generates incorrect loss computations.

## **Performance Notes**

> * Computes sum of differences between non-target scores and target scores, leading to quadratic pairing checks per sample in worst cases.

## **Related APIs**

> * torch.nn.MultiMarginLoss  
> * torch.nn.BCEWithLogitsLoss

## **Framework Migration Notes**

No direct equivalent in standard TensorFlow.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: MultiLabelHinge  
> * **Common Search Terms**: pytorch multilabel margin loss, margin loss multiple labels, multi label hinge  
> * **Keywords**: multilabel, margin, hinge, ranking  
> * **Frequently Confused With**: nn.MultiMarginLoss, nn.BCEWithLogitsLoss

## **Related Models**

resnet, bert

## **Related Patterns**

mixed-precision

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.MultiLabelMarginLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.MultiLabelMarginLoss.html)

## **Task**

Compute Mean Squared Error Loss (nn.MSELoss)

## **Problem Solved**

Measures the mean squared difference (*L*2​ norm squared) between element predictions and target regression values.

## **Mental Trigger**

I need a standard loss function for continuous regression tasks.

## **Syntax**

`torch.nn.MSELoss(`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **reduction**: Reduction mode applied to the output ('none', 'mean', 'sum').

## **Return Value**

Scalar float tensor by default, or tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([2.5, 0.0, 1.4], dtype=torch.float32)`  
`targets = torch.tensor([3.0, -0.5, 1.0], dtype=torch.float32)`

`criterion = nn.MSELoss()`  
`loss = criterion(predictions, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training standard continuous regression models where target variables are Gaussian distributed.  
> * Penalizing large errors more heavily than small errors due to quadratic scaling.

## **Avoid When**

> * Datasets contain extreme outliers that disproportionately distort model gradients (use nn.HuberLoss or nn.L1Loss).

## **Gotchas**

> * Predictions and targets must have matching shapes. Broadcasting between (N, 1\) and (N,) can silently fail to error and yield invalid scalar loss.  
> * Dtypes must match (torch.float32 or torch.float64). Mixing floats and integers causes runtime errors.

## **Performance Notes**

> * Highly optimized elementwise CUDA kernel operations with minimal compute overhead.

## **Related APIs**

> * torch.nn.L1Loss  
> * torch.nn.SmoothL1Loss  
> * torch.nn.functional.mse\_loss

## **Framework Migration Notes**

Directly matches TensorFlow's MeanSquaredError.

## **TensorFlow Equivalent**

`nn.MSELoss → tf.keras.losses.MeanSquaredError`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: MSE, L2 Loss  
> * **Common Search Terms**: pytorch mse loss, mean squared error, l2 regression loss  
> * **Keywords**: mse, l2, regression, squared-error  
> * **Frequently Confused With**: nn.L1Loss, nn.SmoothL1Loss

## **Related Models**

resnet, xgboost

## **Related Patterns**

mixed-precision

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.MSELoss.html](https://pytorch.org/docs/stable/generated/torch.nn.MSELoss.html)

## **Task**

Compute Mean Absolute Error Loss (nn.L1Loss)

## **Problem Solved**

Measures the average absolute difference (*L*1​ norm) between elementwise predictions and target values.

## **Mental Trigger**

I need a regression loss function that is robust against outliers.

## **Syntax**

`torch.nn.L1Loss(`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **reduction**: Reduction mode applied ('none', 'mean', 'sum').

## **Return Value**

Scalar float tensor by default, or tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([2.5, 0.0, 1.4], dtype=torch.float32)`  
`targets = torch.tensor([3.0, -0.5, 1.0], dtype=torch.float32)`

`criterion = nn.L1Loss()`  
`loss = criterion(predictions, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Dataset regression targets contain significant noise or extreme outliers.  
> * L1 regularization behavior is required directly on target predictions.

## **Avoid When**

> * Smooth differentiability around zero error is required for fine-grained convergence (use nn.SmoothL1Loss or nn.HuberLoss).

## **Gotchas**

> * Derivatives at zero error are discontinuous, which can cause oscillation around optimal values during late training stages.  
> * Unintended broadcasting occurs if input shape is (N, 1\) and target shape is (N,).

## **Performance Notes**

> * Elementwise absolute value evaluation is lightweight and fast on GPU devices.

## **Related APIs**

> * torch.nn.MSELoss  
> * torch.nn.SmoothL1Loss  
> * torch.nn.functional.l1\_loss

## **Framework Migration Notes**

Directly matches TensorFlow's MeanAbsoluteError.

## **TensorFlow Equivalent**

`nn.L1Loss → tf.keras.losses.MeanAbsoluteError`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: MAE, L1 Loss  
> * **Common Search Terms**: pytorch l1 loss, mean absolute error, mae regression  
> * **Keywords**: l1, mae, absolute-error, regression, robust  
> * **Frequently Confused With**: nn.MSELoss, nn.SmoothL1Loss

## **Related Models**

resnet, yolo

## **Related Patterns**

mixed-precision

## **Related Workflows**

object-detection-pipeline

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.L1Loss.html](https://pytorch.org/docs/stable/generated/torch.nn.L1Loss.html)

## **Task**

Compute Smooth L1 Loss (nn.SmoothL1Loss)

## **Problem Solved**

Uses squared error for small absolute errors below a threshold and absolute error for large errors, combining benefits of *L*1​ and *L*2​ losses.

## **Mental Trigger**

I need a loss that behaves like MSE for small errors and L1 for large errors.

## **Syntax**

`torch.nn.SmoothL1Loss(`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean',`  
    `beta=1.0`  
`)`

## **Important Parameters**

> * **beta**: Threshold parameter defining the transition point from *L*2​ to *L*1​ loss (default is 1.0).  
> * **reduction**: Reduction mode ('none', 'mean', 'sum').

## **Return Value**

Scalar float tensor by default, or tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([0.2, 2.5], dtype=torch.float32)`  
`targets = torch.tensor([0.0, 0.5], dtype=torch.float32)`

`criterion = nn.SmoothL1Loss(beta=1.0)`  
`loss = criterion(predictions, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training object detection bounding box regressors (e.g., Fast R-CNN, Faster R-CNN).  
> * Requiring stability against outliers while preserving smooth gradients near zero.

## **Avoid When**

> * Unscaled standard Huber loss formulation is explicitly required by academic specifications (use nn.HuberLoss).

## **Gotchas**

> * Changing beta alters the scaling of gradients for large errors unless compensated.  
> * Setting beta=0 makes SmoothL1Loss degenerate into standard L1Loss.

## **Performance Notes**

> * Computes conditional branches elementwise inside CUDA kernels without memory movement overhead.

## **Related APIs**

> * torch.nn.HuberLoss  
> * torch.nn.L1Loss  
> * torch.nn.MSELoss

## **Framework Migration Notes**

Maps to tf.keras.losses.Huber(delta=beta) with identical mathematical properties.

## **TensorFlow Equivalent**

`nn.SmoothL1Loss → tf.keras.losses.Huber(delta=beta)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Fast R-CNN Loss, Smooth L1  
> * **Common Search Terms**: pytorch smooth l1 loss, bounding box regression loss, smooth l1 vs huber  
> * **Keywords**: smooth-l1, beta, huber, regression, object-detection  
> * **Frequently Confused With**: nn.HuberLoss, nn.L1Loss

## **Related Models**

yolo, resnet

## **Related Patterns**

mixed-precision

## **Related Workflows**

object-detection-pipeline

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.SmoothL1Loss.html](https://pytorch.org/docs/stable/generated/torch.nn.SmoothL1Loss.html)

## **Task**

Compute Huber Loss (nn.HuberLoss)

## **Problem Solved**

Computes Huber loss, a robust regression loss function less sensitive to outliers than MSE.

## **Mental Trigger**

I need standard Huber loss with a configurable delta threshold for robust regression.

## **Syntax**

`torch.nn.HuberLoss(`  
    `reduction='mean',`  
    `delta=1.0`  
`)`

## **Important Parameters**

> * **delta**: Threshold parameter where loss transitions from quadratic to linear (default is 1.0).  
> * **reduction**: Output reduction mode ('none', 'mean', 'sum').

## **Return Value**

Scalar float tensor by default, or tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([1.0, 3.5], dtype=torch.float32)`  
`targets = torch.tensor([1.2, 1.0], dtype=torch.float32)`

`criterion = nn.HuberLoss(delta=1.0)`  
`loss = criterion(predictions, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training robust regression models requiring strict adherence to standard mathematical Huber definitions.  
> * Handling variable noise distributions across target variables.

## **Avoid When**

> * Working with legacy object detection architectures that specifically expect SmoothL1Loss beta-scaling conventions.

## **Gotchas**

> * HuberLoss scales the linear region differently than SmoothL1Loss when delta \!= 1.0.  
> * delta must strictly be a positive floating-point number.

## **Performance Notes**

> * Fused CUDA implementation avoids extra branch allocations during forward and backward passes.

## **Related APIs**

> * torch.nn.SmoothL1Loss  
> * torch.nn.MSELoss  
> * torch.nn.functional.huber\_loss

## **Framework Migration Notes**

Directly maps to TensorFlow's tf.keras.losses.Huber(delta=delta).

## **TensorFlow Equivalent**

`nn.HuberLoss → tf.keras.losses.Huber(delta=delta)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Huber  
> * **Common Search Terms**: pytorch huber loss, robust regression loss, huber delta  
> * **Keywords**: huber, delta, robust, regression  
> * **Frequently Confused With**: nn.SmoothL1Loss, nn.MSELoss

## **Related Models**

resnet, yolo, xgboost

## **Related Patterns**

mixed-precision

## **Related Workflows**

object-detection-pipeline

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.HuberLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.HuberLoss.html)

## **Task**

Compute Connectionist Temporal Classification Loss (nn.CTCLoss)

## **Problem Solved**

Calculates loss between continuous sequence probabilities and target sequences without explicit alignment supervision.

## **Mental Trigger**

I need sequence alignment loss for speech recognition or OCR without frame-level labels.

## **Syntax**

`torch.nn.CTCLoss(`  
    `blank=0,`  
    `reduction='mean',`  
    `zero_infinity=False`  
`)`

## **Important Parameters**

> * **blank**: Index of the blank label in the vocabulary (default is 0).  
> * **reduction**: Reduction mode ('none', 'mean', 'sum').  
> * **zero\_infinity**: Whether to zero out infinite losses caused by impossibly short target lengths.

## **Return Value**

Scalar float tensor by default, or tensor of shape (N,) if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`T, N, C = 50, 2, 20`  
`log_probs = torch.randn(T, N, C).log_softmax(2)`

`targets = torch.tensor([[1, 2, 3, 4], [2, 3, 1, 0]], dtype=torch.int64)`  
`input_lengths = torch.tensor([50, 50], dtype=torch.int64)`  
`target_lengths = torch.tensor([4, 3], dtype=torch.int64)`

`criterion = nn.CTCLoss(blank=0, zero_infinity=True)`  
`loss = criterion(log_probs, targets, input_lengths, target_lengths)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training end-to-end speech recognition models (e.g., Wav2Letter).  
> * Training optical character recognition (OCR) or scene text recognition networks.

## **Avoid When**

> * Frame-level explicit alignments are already available in training datasets.

## **Gotchas**

> * Input log probabilities shape must be (T, N, C) (Time, Batch, Classes) by default unless zero\_infinity or explicit flags alter shape expectations.  
> * input\_lengths must be greater than or equal to target\_lengths for every sample, otherwise alignment fails and produces infinite loss.  
> * Forgetting zero\_infinity=True can result in NaN gradients destabilizing training if target sequences exceed input sequence bounds.

## **Performance Notes**

> * Uses dynamic programming backends in C++ / CUDA. Fused dynamic programming kernels consume considerable workspace memory for long time steps *T*.

## **Related APIs**

> * torch.nn.functional.ctc\_loss

## **Framework Migration Notes**

Maps directly to tf.nn.ctc\_loss in TensorFlow.

## **TensorFlow Equivalent**

`nn.CTCLoss → tf.nn.ctc_loss`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: CTC Loss, Connectionist Temporal Classification  
> * **Common Search Terms**: pytorch ctc loss, ocr sequence loss, speech recognition loss  
> * **Keywords**: ctc, sequence, ocr, speech, alignment  
> * **Frequently Confused With**: nn.CrossEntropyLoss

## **Related Models**

transformer

## **Related Patterns**

mixed-precision, gradient-accumulation

## **Related Workflows**

text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.CTCLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CTCLoss.html)

## **Task**

Compute KL Divergence Loss (nn.KLDivLoss)

## **Problem Solved**

Measures Kullback-Leibler divergence between continuous probability distributions.

## **Mental Trigger**

I need to measure how much one probability distribution diverges from a target distribution (e.g., knowledge distillation, VAEs).

## **Syntax**

`torch.nn.KLDivLoss(`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean',`  
    `log_target=False`  
`)`

## **Important Parameters**

> * **reduction**: Reduction mode ('none', 'mean', 'batchmean', 'sum').  
> * **log\_target**: Specifies whether target tensor is passed in log space (default is False).

## **Return Value**

Scalar float tensor by default, or tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`log_probs = torch.tensor([[-1.2, -0.4], [-0.8, -0.6]], dtype=torch.float32)`  
`targets = torch.tensor([[0.3, 0.7], [0.4, 0.6]], dtype=torch.float32)`

`criterion = nn.KLDivLoss(reduction='batchmean')`  
`loss = criterion(log_probs, targets)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training teacher-student models for knowledge distillation.  
> * Optimizing variational autoencoders (VAEs) or probabilistic output layers.

## **Avoid When**

> * Inputs are raw logits rather than log-probabilities (apply nn.LogSoftmax first).

## **Gotchas**

> * Input tensor MUST be log-probabilities (e.g. output from LogSoftmax). Passing raw probabilities generates mathematically invalid divergence values.  
> * PyTorch standard reduction='mean' does not match true mathematical KL divergence over batches. Use reduction='batchmean' to align with mathematical expectations.  
> * If log\_target=False, target values must be valid probabilities summing to 1 across class dimensions.

## **Performance Notes**

> * Elementwise evaluation is fast, but failing to pass log targets directly can require redundant log operations.

## **Related APIs**

> * torch.nn.LogSoftmax  
> * torch.nn.functional.kl\_div

## **Framework Migration Notes**

Maps to TensorFlow's tf.keras.losses.KLDivergence().

## **TensorFlow Equivalent**

`nn.KLDivLoss → tf.keras.losses.KLDivergence()`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: KL Loss, Kullback-Leibler Divergence  
> * **Common Search Terms**: pytorch kl divergence loss, distillation loss, kldiv batchmean  
> * **Keywords**: kl-divergence, distillation, vae, log-probabilities, batchmean  
> * **Frequently Confused With**: nn.NLLLoss, nn.CrossEntropyLoss

## **Related Models**

bert, gpt, vit

## **Related Patterns**

mixed-precision

## **Related Workflows**

text-classification-pipeline-classical-encoder, production-llm-cost-latency-optimization

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.KLDivLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.KLDivLoss.html)

## **Task**

Compute Cosine Embedding Loss (nn.CosineEmbeddingLoss)

## **Problem Solved**

Measures whether two input vectors are similar or dissimilar using cosine distance based on a ground truth binary flag.

## **Mental Trigger**

I need a loss function to measure visual or textual vector embedding similarity using cosine distance.

## **Syntax**

`torch.nn.CosineEmbeddingLoss(`  
    `margin=0.0,`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **margin**: Margin value between 0 and 1 (default is 0.0).  
> * **reduction**: Reduction mode ('none', 'mean', 'sum').

## **Return Value**

Scalar float tensor by default, or 1D tensor of shape (N,) if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`x1 = torch.tensor([[1.0, 2.0, 3.0], [0.5, 0.1, 2.0]], dtype=torch.float32)`  
`x2 = torch.tensor([[1.1, 2.1, 2.9], [-0.5, 0.2, 0.1]], dtype=torch.float32)`  
`y = torch.tensor([1, -1], dtype=torch.int64)`

`criterion = nn.CosineEmbeddingLoss(margin=0.5)`  
`loss = criterion(x1, x2, y)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training Siamese networks for metric learning or pair similarity.  
> * Learning vector representations where directional orientation matters more than magnitude.

## **Avoid When**

> * Distances require Euclidean geometry measures rather than cosine orientation.

## **Gotchas**

> * Target indicator values *y* must strictly be 1 (similar) or \-1 (dissimilar). Passing 0 leads to incorrect loss masking.  
> * Inputs *x*1​ and *x*2​ must have identical shapes.

## **Performance Notes**

> * Cosine distance calculation requires normalizing inputs internally, which involves inverse square root operations. Pre-normalizing input embeddings can reduce compute overhead.

## **Related APIs**

> * torch.nn.functional.cosine\_similarity  
> * torch.nn.TripletMarginLoss  
> * torch.nn.MarginRankingLoss

## **Framework Migration Notes**

No direct single module equivalent in standard TensorFlow loss libraries.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Cosine Distance Loss, Pairwise Cosine Loss  
> * **Common Search Terms**: pytorch cosine embedding loss, siamese similarity loss, cosine distance metric  
> * **Keywords**: cosine, similarity, embeddings, siamese, metric-learning  
> * **Frequently Confused With**: nn.MarginRankingLoss, nn.TripletMarginLoss

## **Related Models**

bert, roberta, resnet

## **Related Patterns**

mixed-precision

## **Related Workflows**

text-classification-pipeline-classical-encoder, transfer-learning-for-vision

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.CosineEmbeddingLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CosineEmbeddingLoss.html)

## **Task**

Compute Triplet Margin Loss (nn.TripletMarginLoss)

## **Problem Solved**

Computes triplet loss given anchor, positive, and negative embedding tensors to enforce distance margins in embedding spaces.

## **Mental Trigger**

I need to pull anchor-positive embeddings closer together while pushing anchor-negative embeddings apart.

## **Syntax**

`torch.nn.TripletMarginLoss(`  
    `margin=1.0,`  
    `p=2.0,`  
    `eps=1e-06,`  
    `swap=False,`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **margin**: Non-negative threshold margin for separation (default is 1.0).  
> * **p**: Norm degree for distance estimation (default is 2.0).  
> * **swap**: Enables distance swap comparison between positive and negative embeddings.  
> * **reduction**: Reduction mode ('none', 'mean', 'sum').

## **Return Value**

Scalar float tensor by default, or 1D tensor of shape (N,) if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`anchor = torch.tensor([[1.0, 2.0]], dtype=torch.float32)`  
`positive = torch.tensor([[1.1, 2.1]], dtype=torch.float32)`  
`negative = torch.tensor([[4.0, 5.0]], dtype=torch.float32)`

`criterion = nn.TripletMarginLoss(margin=1.0, p=2.0)`  
`loss = criterion(anchor, positive, negative)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training face recognition, metric learning, or fine-grained visual search models.  
> * Building relative embedding representations using triplet mining strategies.

## **Avoid When**

> * Ground truth data consists of pairwise binary labels rather than explicit triplets.

## **Gotchas**

> * Anchor, positive, and negative tensors must have identical shapes.  
> * Collapsing representations occur if hard-negative mining is omitted during data selection.

## **Performance Notes**

> * Involves computing pairwise distances across three input tensors simultaneously; memory scale grows linearly with embedding dimension size *D*.

## **Related APIs**

> * torch.nn.CosineEmbeddingLoss  
> * torch.nn.MarginRankingLoss  
> * torch.nn.functional.triplet\_margin\_loss

## **Framework Migration Notes**

Maps conceptually to TensorFlow Addons tfa.losses.TripletSemiHardLoss or custom Keras triplet implementations.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Triplet Loss  
> * **Common Search Terms**: pytorch triplet margin loss, triplet loss face recognition, anchor positive negative loss  
> * **Keywords**: triplet, anchor, positive, negative, metric-learning  
> * **Frequently Confused With**: nn.CosineEmbeddingLoss, nn.MarginRankingLoss

## **Related Models**

resnet, vit, bert

## **Related Patterns**

mixed-precision

## **Related Workflows**

transfer-learning-for-vision, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.TripletMarginLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.TripletMarginLoss.html)

## **Task**

Compute Margin Ranking Loss (nn.MarginRankingLoss)

## **Problem Solved**

Measures ranking loss between two inputs given a target label indicating which input should rank higher.

## **Mental Trigger**

I need a pairwise ranking loss to optimize relative order between two scoring inputs.

## **Syntax**

`torch.nn.MarginRankingLoss(`  
    `margin=0.0,`  
    `size_average=None,`  
    `reduce=None,`  
    `reduction='mean'`  
`)`

## **Important Parameters**

> * **margin**: Non-negative ranking margin threshold (default is 0.0).  
> * **reduction**: Reduction mode ('none', 'mean', 'sum').

## **Return Value**

Scalar float tensor by default, or tensor matching input shape if reduction='none'.

## **Example**

`import torch`  
`import torch.nn as nn`

`input1 = torch.tensor([2.5, 1.2], dtype=torch.float32)`  
`input2 = torch.tensor([1.0, 3.0], dtype=torch.float32)`  
`target = torch.tensor([1, -1], dtype=torch.int64)`

`criterion = nn.MarginRankingLoss(margin=0.5)`  
`loss = criterion(input1, input2, target)`

`print(f"Loss: {loss.item():.4f}")`

## **Use When**

> * Training ranking models (e.g., search relevance ranking, recommendation systems).  
> * Optimizing pairwise score preferences.

## **Avoid When**

> * Task requires absolute regression value targets rather than relative preference scores.

## **Gotchas**

> * Target values *y* must strictly be 1 or \-1. Passing values like 0 creates mathematically invalid rank penalties.  
> * input1, input2, and target must all share identical shapes.

## **Performance Notes**

> * Highly efficient elementwise subtraction and clamping kernel operation on CUDA devices.

## **Related APIs**

> * torch.nn.CosineEmbeddingLoss  
> * torch.nn.TripletMarginLoss

## **Framework Migration Notes**

No direct standard equivalent in core TensorFlow loss package.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Pairwise Ranking Loss  
> * **Common Search Terms**: pytorch margin ranking loss, learning to rank loss, pairwise ranking loss  
> * **Keywords**: ranking, margin, pairwise, preference  
> * **Frequently Confused With**: nn.MarginRankingLoss, nn.CosineEmbeddingLoss

## **Related Models**

bert, roberta

## **Related Patterns**

mixed-precision

## **Related Workflows**

text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.MarginRankingLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.MarginRankingLoss.html)

## **Task**

Configure Loss Reduction Behavior (reduction='none' | 'mean' | 'sum')

## **Problem Solved**

Controls how unreduced per-element or per-sample losses are aggregated across batches for custom loss masking, normalization, or sample weighting.

## **Mental Trigger**

I need per-sample losses to apply dynamic masks or custom normalization prior to aggregating.

## **Syntax**

`torch.nn.modules.loss._Loss(`  
    `reduction='none' | 'mean' | 'sum'`  
`)`

## **Important Parameters**

> * **reduction**: String parameter accepting 'none' (no reduction), 'mean' (sum divided by element count), or 'sum' (sum across elements).

## **Return Value**

Unreduced loss tensor matching input dimensions when set to 'none', or a scalar tensor when set to 'mean' or 'sum'.

## **Example**

`import torch`  
`import torch.nn as nn`

`logits = torch.tensor([[2.0, 0.5], [0.1, 1.5]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1], dtype=torch.int64)`  
`sample_mask = torch.tensor([1.0, 0.0], dtype=torch.float32)`

`criterion = nn.CrossEntropyLoss(reduction='none')`  
`unreduced_loss = criterion(logits, targets)`

`masked_loss = (unreduced_loss * sample_mask).sum() / sample_mask.sum()`  
`print(f"Masked Loss: {masked_loss.item():.4f}")`

## **Use When**

> * Implementing sequence padding masks where loss from padding tokens must be excluded manually.  
> * Performing per-sample loss re-weighting, hard example mining, or multi-task loss balance.

## **Avoid When**

> * Standard batch mean reduction without custom masking is sufficient for training.

## **Gotchas**

> * Using reduction='none' consumes significantly more memory during backward passes because full gradient shapes are retained in memory.  
> * Manually calculating mean across masked tensors using standard tensor.mean() divides by total elements instead of valid non-masked elements.

## **Performance Notes**

> * 'mean' and 'sum' reductions perform atomic accumulation in GPU kernels, avoiding secondary tensor creation overhead.

## **Related APIs**

> * torch.nn.CrossEntropyLoss  
> * torch.nn.BCEWithLogitsLoss  
> * torch.nn.MSELoss

## **Framework Migration Notes**

Maps to reduction=tf.keras.losses.Reduction.NONE | SUM | SUM\_OVER\_BATCH\_SIZE in TensorFlow.

## **TensorFlow Equivalent**

`reduction='none' → tf.keras.losses.Reduction.NONE`  
`reduction='sum' → tf.keras.losses.Reduction.SUM`  
`reduction='mean' → tf.keras.losses.Reduction.SUM_OVER_BATCH_SIZE`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Loss Reduction Mode, Loss Aggregation  
> * **Common Search Terms**: pytorch reduction none, loss per sample, pytorch custom loss masking  
> * **Keywords**: reduction, none, mean, sum, masking  
> * **Frequently Confused With**: Custom sample weighting arguments

## **Related Models**

bert, gpt, yolo, resnet

## **Related Patterns**

mixed-precision, gradient-accumulation

## **Related Workflows**

object-detection-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/nn.html\#loss-functions](https://www.google.com/search?q=https://pytorch.org/docs/stable/nn.html%23loss-functions)

## **Task**

Apply Class and Sample Weighting (weight, pos\_weight, ignore\_index)

## **Problem Solved**

Handles severe class imbalance, positive class emphasis, and padding token suppression directly within PyTorch loss modules.

## **Mental Trigger**

I need to handle severe class imbalance or ignore padding tokens during loss computation.

## **Syntax**

`# For Multi-class Cross Entropy`  
`torch.nn.CrossEntropyLoss(weight=class_weights, ignore_index=pad_idx)`

`# For Binary / Multi-label BCE`  
`torch.nn.BCEWithLogitsLoss(pos_weight=pos_weights)`

## **Important Parameters**

> * **weight**: Rescaling tensor of shape (C,) assigning manual weight to each class.  
> * **pos\_weight**: Rescaling tensor for positive classes in binary cross entropy.  
> * **ignore\_index**: Class index value skipped completely during loss calculation and backpropagation.

## **Return Value**

Scalar float tensor representing the weighted reduced loss value across valid elements.

## **Example**

`import torch`  
`import torch.nn as nn`

`# Class weighting & ignore_index in CrossEntropyLoss`  
`class_weights = torch.tensor([0.2, 0.8], dtype=torch.float32)`  
`ce_criterion = nn.CrossEntropyLoss(weight=class_weights, ignore_index=-100)`

`logits = torch.tensor([[2.0, 0.5], [0.1, 1.5], [1.0, 1.0]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1, -100], dtype=torch.int64)`  
`ce_loss = ce_criterion(logits, targets)`

`# Positive class weighting in BCEWithLogitsLoss`  
`pos_weight = torch.tensor([3.0], dtype=torch.float32)`  
`bce_criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)`

`bce_logits = torch.tensor([1.2, -0.5], dtype=torch.float32)`  
`bce_targets = torch.tensor([1.0, 0.0], dtype=torch.float32)`  
`bce_loss = bce_criterion(bce_logits, bce_targets)`

`print(f"CE Loss: {ce_loss.item():.4f}, BCE Loss: {bce_loss.item():.4f}")`

## **Use When**

> * Training on datasets with heavy class imbalance (e.g., fraud detection, rare medical anomalies).  
> * Processing variable-length sequences where padding tokens (e.g. index \-100) must not contribute to gradients.

## **Avoid When**

> * Dataset classes are balanced and uniform loss weighting is appropriate.

## **Gotchas**

> * Target entries set to ignore\_index must be integer indices within class range or equal to ignore\_index. Passing negative values other than ignore\_index throws index errors.  
> * weight tensors must reside on the same GPU device and share floating-point dtype with model inputs.  
> * Normalization behavior with class weights reduces by weighted denominator sum rather than raw batch size, which can alter learning rate scaling expectations.

## **Performance Notes**

> * ignore\_index masking is performed inside the CUDA kernel without extra memory allocation.

## **Related APIs**

> * torch.nn.CrossEntropyLoss  
> * torch.nn.BCEWithLogitsLoss  
> * torch.nn.NLLLoss

## **Framework Migration Notes**

weight and ignore\_index correspond conceptually to sample\_weight matrices or masked loss layers in TensorFlow. pos\_weight corresponds to pos\_weight in tf.nn.sigmoid\_cross\_entropy\_with\_logits.

## **TensorFlow Equivalent**

`CrossEntropyLoss(weight) → tf.keras.losses.CategoricalCrossentropy() with sample_weight`  
`BCEWithLogitsLoss(pos_weight) → tf.nn.sigmoid_cross_entropy_with_logits(pos_weight=pos_weight)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Class Weights, Positive Weighting, Mask Index  
> * **Common Search Terms**: pytorch class weights cross entropy, ignore\_index cross entropy, pos\_weight bce logits  
> * **Keywords**: weights, pos\_weight, ignore\_index, class-imbalance, padding  
> * **Frequently Confused With**: Custom manual tensor masking

## **Related Models**

resnet, bert, yolo, logistic-regression

## **Related Patterns**

mixed-precision, gradient-accumulation

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder, semantic-segmentation-pipeline

## **Related Cheatsheet**

loss-functions

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

---