# **PyTorch Loss Functions Cheatsheet**

## **Problem**

Compute Cross Entropy Loss (nn.CrossEntropyLoss)

## **Trigger**

Use when training multi-class classification models directly on unnormalized network outputs (raw logits).

## **Snippet**

`import torch`  
`import torch.nn as nn`

`# Batch size 3, 5 classes`  
`logits = torch.tensor([[2.0, 1.0, 0.1, 0.5, -0.2],`  
                       `[0.5, 3.1, 0.2, 0.1, 0.0],`  
                       `[0.1, 0.2, 2.8, 0.4, 0.5]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1, 2], dtype=torch.long)`

`criterion = nn.CrossEntropyLoss()`  
`loss = criterion(logits, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

nn.CrossEntropyLoss combines nn.LogSoftmax and nn.NLLLoss into a single, numerically stable class. Inputs must be raw logits, and target class indices must be integer tensors of dtype torch.long.

## **Common Bug**

**Issue:** RuntimeError: expected scalar type Long but found Float or target value mismatch errors.

**Cause:** Passing target labels as floating-point class indices instead of long integers.

**Quick Fix:** Format class index targets as torch.long (or pass class probability floats matching input shape when training with soft target distributions).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

## **Problem**

Compute Binary Cross Entropy with Logits (nn.BCEWithLogitsLoss)

## **Trigger**

Use when measuring loss for binary classification or multi-label classification using raw, unscaled output logits.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`# Batch size 3, 2 binary attributes`  
`logits = torch.tensor([[1.5, -0.8],`  
                       `[-0.2, 2.1],`  
                       `[0.8, -1.2]], dtype=torch.float32)`  
`targets = torch.tensor([[1.0, 0.0],`  
                        `[0.0, 1.0],`  
                        `[1.0, 0.0]], dtype=torch.float32)`

`criterion = nn.BCEWithLogitsLoss()`  
`loss = criterion(logits, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Combines a Sigmoid layer and BCELoss into a single class for superior numerical stability via the log-sum-exp trick. Inputs and targets must share identical shapes and torch.float32 data types.

## **Common Bug**

**Issue:** Loss values are inaccurate or negative gradients occur during training.

**Cause:** Applying an explicit torch.sigmoid() to network predictions before passing them into nn.BCEWithLogitsLoss.

**Quick Fix:** Remove the explicit Sigmoid activation from your neural network output layer when using this loss.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html)

## **Problem**

Compute Binary Cross Entropy (nn.BCELoss)

## **Trigger**

Use for binary or multi-label classification when network outputs are already normalized probabilities between 0 and 1\.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`probs = torch.tensor([[0.82, 0.31],`  
                      `[0.15, 0.89],`  
                      `[0.69, 0.23]], dtype=torch.float32)`  
`targets = torch.tensor([[1.0, 0.0],`  
                        `[0.0, 1.0],`  
                        `[1.0, 0.0]], dtype=torch.float32)`

`criterion = nn.BCELoss()`  
`loss = criterion(probs, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Inputs must lie strictly within the range \[0, 1\] after being transformed by a Sigmoid function. Prefer nn.BCEWithLogitsLoss over nn.BCELoss to avoid log-of-zero numerical instability.

## **Common Bug**

**Issue:** RuntimeError: value cannot be converted to type float without overflow or NaN loss values.

**Cause:** Input probabilities contain values slightly outside \[0, 1\] or raw unnormalized logits were supplied.

**Quick Fix:** Pass inputs through Sigmoid first, or switch directly to nn.BCEWithLogitsLoss using raw logits.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.BCELoss.html](https://pytorch.org/docs/stable/generated/torch.nn.BCELoss.html)

## **Problem**

Compute Negative Log Likelihood Loss (nn.NLLLoss)

## **Trigger**

Use for multi-class classification when your model explicitly outputs log-probabilities (e.g., via nn.LogSoftmax).

## **Snippet**

`import torch`  
`import torch.nn as nn`

`log_probs = torch.tensor([[-0.22, -2.30, -3.21],`  
                          `[-1.60, -0.22, -2.30]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1], dtype=torch.long)`

`criterion = nn.NLLLoss()`  
`loss = criterion(log_probs, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Expects log-probabilities as inputs rather than raw logits or standard probabilities. Targets must be class index integers of dtype torch.long.

## **Common Bug**

**Issue:** Loss value output is negative or yields incorrect gradient optimization behavior.

**Cause:** Passing raw logits or standard probabilities normalized by nn.Softmax instead of nn.LogSoftmax.

**Quick Fix:** Apply nn.LogSoftmax(dim=-1) to model outputs before passing to NLLLoss, or switch directly to nn.CrossEntropyLoss.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.NLLLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.NLLLoss.html)

## **Problem**

Compute Mean Squared Error Loss (nn.MSELoss)

## **Trigger**

Use for continuous regression tasks where larger errors should be penalized quadratically.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([[2.5, 0.0], [1.1, -0.5]], dtype=torch.float32)`  
`targets = torch.tensor([[3.0, -0.5], [1.0, 0.0]], dtype=torch.float32)`

`criterion = nn.MSELoss()`  
`loss = criterion(predictions, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Measures element-wise mean squared error between predictions and targets. Predictions and targets must have matching shapes and floating-point data types.

## **Common Bug**

**Issue:** UserWarning: Using a target size that is different to the input size leading to unexpected broadcast loss calculations.

**Cause:** Passing a target tensor with shape (N,) while model predictions have shape (N, 1).

**Quick Fix:** Reshape targets using targets.view\_as(predictions) or targets.unsqueeze(-1) before computing loss.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.MSELoss.html](https://pytorch.org/docs/stable/generated/torch.nn.MSELoss.html)

## **Problem**

Compute Mean Absolute Error Loss (nn.L1Loss)

## **Trigger**

Use for regression tasks when you need robustness against outliers compared to quadratic penalization.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([[2.5, 0.0], [1.1, -0.5]], dtype=torch.float32)`  
`targets = torch.tensor([[3.0, -0.5], [1.0, 0.0]], dtype=torch.float32)`

`criterion = nn.L1Loss()`  
`loss = criterion(predictions, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Measures element-wise absolute difference, producing constant gradient magnitudes regardless of error size. Inputs and targets must share identical shapes.

## **Common Bug**

**Issue:** Loss output is higher than expected due to unintended array broadcasting.

**Cause:** Passing target tensor shape (N,) when prediction shape is (N, 1).

**Quick Fix:** Align tensor shapes explicitly using targets \= targets.reshape(predictions.shape) prior to computing loss.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.L1Loss.html](https://pytorch.org/docs/stable/generated/torch.nn.L1Loss.html)

## **Problem**

Compute Huber Loss (nn.HuberLoss)

## **Trigger**

Use for regression tasks to combine MSE smoothness for small errors with L1 robustness for large outliers.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([1.5, 3.0, 10.0], dtype=torch.float32)`  
`targets = torch.tensor([1.0, 3.2, 2.0], dtype=torch.float32)`

`criterion = nn.HuberLoss(delta=1.0)`  
`loss = criterion(predictions, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Uses squared error when absolute error is below delta and absolute error above delta. The delta parameter controls sensitivity to outliers.

## **Common Bug**

**Issue:** Loss behaves like standard L1 loss or MSE loss continuously without desired hybrid behavior.

**Cause:** Setting delta inappropriately relative to the scale of the target variable.

**Quick Fix:** Scale target values or tune the delta parameter to match the scale where data points transition into outliers.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.HuberLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.HuberLoss.html)

## **Problem**

Compute Smooth L1 Loss (nn.SmoothL1Loss)

## **Trigger**

Use for bounding box regression and object detection models where stable gradient behavior is required.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`predictions = torch.tensor([0.5, 1.2, 5.0], dtype=torch.float32)`  
`targets = torch.tensor([0.0, 1.0, 1.0], dtype=torch.float32)`

`criterion = nn.SmoothL1Loss(beta=1.0)`  
`loss = criterion(predictions, targets)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Behaves like L2 loss for absolute errors below beta and L1 loss above beta. When beta=1.0, it is mathematically equivalent to nn.HuberLoss(delta=1.0).

## **Common Bug**

**Issue:** Unstable gradients when absolute error values are small.

**Cause:** Leaving beta at older legacy default values or setting beta close to zero.

**Quick Fix:** Set beta explicitly (e.g., beta=1.0 or beta=1/9 depending on bounding box encoding scale).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.SmoothL1Loss.html](https://pytorch.org/docs/stable/generated/torch.nn.SmoothL1Loss.html)

## **Problem**

Compute Connectionist Temporal Classification Loss (nn.CTCLoss)

## **Trigger**

Use for alignment-free sequence prediction tasks such as speech recognition or optical character recognition (OCR).

## **Snippet**

`import torch`  
`import torch.nn as nn`

`T = 50      # Input sequence length`  
`C = 20      # Number of classes (including blank=0)`  
`N = 2       # Batch size`  
`S = 30      # Target sequence length`

`# Log-probabilities tensor of shape (T, N, C)`  
`log_probs = torch.randn(T, N, C).log_softmax(2).detach().requires_grad_()`

`# Targets of shape (N, S) with class indices (excluding blank 0)`  
`targets = torch.randint(low=1, high=C, size=(N, S), dtype=torch.long)`

`input_lengths = torch.full(size=(N,), fill_value=T, dtype=torch.long)`  
`target_lengths = torch.randint(low=10, high=S, size=(N,), dtype=torch.long)`

`criterion = nn.CTCLoss(blank=0)`  
`loss = criterion(log_probs, targets, input_lengths, target_lengths)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Expects input log-probabilities of shape (T, N, C) by default unless zero\_infinity=True or batch\_first=True is specified. Target values must exclude the blank index token (default index 0).

## **Common Bug**

**Issue:** RuntimeError: Expected tensor for argument \#1 'log\_probs' to have scalar type Float or infinite loss returned.

**Cause:** Input sequence length T is shorter than target sequence length for a batch item, or blank token indices overlap target classes.

**Quick Fix:** Ensure input\_lengths\[i\] \>= target\_lengths\[i\] and pass zero\_infinity=True to handle transient edge cases cleanly.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.CTCLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CTCLoss.html)

## **Problem**

Compute KL Divergence Loss (nn.KLDivLoss)

## **Trigger**

Use when measuring probability distribution divergence in tasks like knowledge distillation or variational autoencoders (VAEs).

## **Snippet**

`import torch`  
`import torch.nn as nn`

`# Log-probabilities for model predictions`  
`log_probs = torch.tensor([[-0.5, -1.2, -2.1],`  
                          `[-0.1, -2.5, -3.0]], dtype=torch.float32)`

`# Target probability distribution`  
`target_probs = torch.tensor([[0.6, 0.3, 0.1],`  
                             `[0.8, 0.1, 0.1]], dtype=torch.float32)`

`criterion = nn.KLDivLoss(reduction='batchmean')`  
`loss = criterion(log_probs, target_probs)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Input tensor must contain log-probabilities (e.g., from nn.LogSoftmax), while target tensor contains probabilities. Always use reduction='batchmean' to align with mathematical KL divergence definitions.

## **Common Bug**

**Issue:** KL divergence loss returns negative or mathematically incorrect values.

**Cause:** Passing raw probabilities to inputs or using default reduction='mean' which averages over all elements rather than batch items.

**Quick Fix:** Apply torch.log\_softmax to input predictions and initialize nn.KLDivLoss(reduction='batchmean').

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.KLDivLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.KLDivLoss.html)

## **Problem**

Compute Cosine Embedding Loss (nn.CosineEmbeddingLoss)

## **Trigger**

Use for metric learning or representation learning to pull similar vectors together and push dissimilar vectors apart.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`input1 = torch.tensor([[0.5, 0.1, -0.2], [1.0, 0.0, 0.5]], dtype=torch.float32)`  
`input2 = torch.tensor([[0.4, 0.2, -0.1], [-1.0, 0.2, 0.0]], dtype=torch.float32)`

`# Target 1 for similar pairs, -1 for dissimilar pairs`  
`target = torch.tensor([1.0, -1.0], dtype=torch.float32)`

`criterion = nn.CosineEmbeddingLoss(margin=0.0)`  
`loss = criterion(input1, input2, target)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Measures similarity using cosine distance. Target values must be 1 (similar pair) or \-1 (dissimilar pair) of floating-point dtype.

## **Common Bug**

**Issue:** RuntimeError: Expected object of scalar type Float but got Long on target tensor.

**Cause:** Supplying target flags as integer values (\[1, \-1\] with torch.long) instead of floats.

**Quick Fix:** Ensure target tensor is instantiated with dtype=torch.float32.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.CosineEmbeddingLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CosineEmbeddingLoss.html)

## **Problem**

Compute Triplet Margin Loss (nn.TripletMarginLoss)

## **Trigger**

Use in metric learning models to ensure an anchor is closer to a positive sample than a negative sample by a specified margin.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`anchor = torch.tensor([[1.0, 2.0, 3.0], [0.5, 0.1, 0.2]], dtype=torch.float32)`  
`positive = torch.tensor([[1.1, 2.1, 2.9], [0.6, 0.0, 0.3]], dtype=torch.float32)`  
`negative = torch.tensor([[2.0, 0.0, 0.0], [-0.5, 1.0, 0.8]], dtype=torch.float32)`

`criterion = nn.TripletMarginLoss(margin=1.0, p=2.0)`  
`loss = criterion(anchor, positive, negative)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Computes relative similarity using vector distances. Anchor, positive, and negative inputs must all have identical shape (N, D).

## **Common Bug**

**Issue:** Model embeddings collapse or gradient vanishes during early training stages.

**Cause:** Trivial negative sampling where all negative samples are easily distinguishable, making loss zero.

**Quick Fix:** Implement hard or semi-hard triplet mining to feed non-trivial triplets into the loss function.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.TripletMarginLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.TripletMarginLoss.html)

## **Problem**

Compute Margin Ranking Loss (nn.MarginRankingLoss)

## **Trigger**

Use for learning-to-rank tasks or pairwise ranking models to enforce that one input scores higher than another by a margin.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`input1 = torch.tensor([2.5, 1.0, 0.8], dtype=torch.float32)`  
`input2 = torch.tensor([1.2, 1.5, 0.2], dtype=torch.float32)`

`# 1 if input1 should rank higher than input2, -1 if lower`  
`target = torch.tensor([1.0, -1.0, 1.0], dtype=torch.float32)`

`criterion = nn.MarginRankingLoss(margin=0.5)`  
`loss = criterion(input1, input2, target)`  
`print(f"Loss: {loss.item():.4f}")`

## **Minimal Notes**

Computes margin ranking loss between two inputs. Target values must strictly contain 1 or \-1 values as floating-point tensors.

## **Common Bug**

**Issue:** Ranking loss calculation returns incorrect results or error regarding target values.

**Cause:** Using 0 and 1 for target labels instead of 1 and \-1.

**Quick Fix:** Set target values strictly to 1.0 (input1 should be ranked higher) or \-1.0 (input2 should be ranked higher).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.MarginRankingLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.MarginRankingLoss.html)

## **Problem**

Configure Loss Reduction (reduction='none' | 'mean' | 'sum')

## **Trigger**

Use when you need element-wise losses for custom sample weighting, gradient accumulation, or per-sample inspection.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`logits = torch.tensor([[1.5, 0.5], [0.1, 2.3]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1], dtype=torch.long)`

`# Returns unreduced per-sample loss tensor`  
`loss_none = nn.CrossEntropyLoss(reduction='none')(logits, targets)`

`# Returns average loss over batch`  
`loss_mean = nn.CrossEntropyLoss(reduction='mean')(logits, targets)`

`# Returns summed loss over batch`  
`loss_sum = nn.CrossEntropyLoss(reduction='sum')(logits, targets)`

`print(f"None: {loss_none}\nMean: {loss_mean:.4f}\nSum: {loss_sum:.4f}")`

## **Minimal Notes**

reduction='none' preserves element-wise loss dimensions matching batch size. Default across PyTorch losses is reduction='mean'.

## **Common Bug**

**Issue:** Backpropagating on reduction='none' tensor throws scalar output error.

**Cause:** Calling .backward() directly on a multi-element loss tensor without specifying gradient weights or reducing first.

**Quick Fix:** Reduce the tensor via .mean() or .sum() before calling .backward(), or pass matching gradient tensor weights.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

## **Problem**

Apply Class Weights (weight)

## **Trigger**

Use to handle severe class imbalance in classification tasks by penalizing errors on underrepresented classes.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`# 3 classes: assign higher weight to rare class 2`  
`class_weights = torch.tensor([1.0, 1.0, 5.0], dtype=torch.float32)`

`logits = torch.tensor([[2.0, 0.5, 0.1], [0.2, 0.1, 1.8]], dtype=torch.float32)`  
`targets = torch.tensor([0, 2], dtype=torch.long)`

`criterion = nn.CrossEntropyLoss(weight=class_weights)`  
`loss = criterion(logits, targets)`  
`print(f"Weighted Loss: {loss.item():.4f}")`

## **Minimal Notes**

Weights tensor must be a 1D FloatTensor with size equal to the number of classes C. The loss is normalized by the weighted sum of target occurrences when using reduction='mean'.

## **Common Bug**

**Issue:** RuntimeError: weight tensor should be defined on the same device as the input or shape mismatch.

**Cause:** Passing class weights tensor on CPU while logits and targets are on GPU, or incorrect weight tensor length.

**Quick Fix:** Ensure class\_weights \= class\_weights.to(device) matches target device and contains exactly C elements.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

## **Problem**

Ignore Target Classes (ignore\_index)

## **Trigger**

Use during sequence tagging, segmentation, or padded NLP batches to exclude padding or void tokens from loss and gradient calculations.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`# Batch size 2, sequence length 3, 4 classes. Target index -100 is ignored.`  
`logits = torch.randn(2, 4, 3, dtype=torch.float32)`  
`targets = torch.tensor([[1, 2, -100], [0, -100, 3]], dtype=torch.long)`

`criterion = nn.CrossEntropyLoss(ignore_index=-100)`  
`loss = criterion(logits, targets)`  
`print(f"Loss (padding ignored): {loss.item():.4f}")`

## **Minimal Notes**

ignore\_index specifies a target integer value that contributes zero gradient and is omitted from loss averaging. Default ignore\_index in nn.CrossEntropyLoss is \-100.

## **Common Bug**

**Issue:** IndexError: Target \-100 is out of bounds when calculating classification metrics or loss.

**Cause:** Using ignore\_index target values in accuracy calculations without filtering them out first.

**Quick Fix:** Mask target tensors using mask \= targets \!= \-100 before calculating custom evaluation metrics like accuracy.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

## **Problem**

Apply Label Smoothing (label\_smoothing)

## **Trigger**

Use to regularize classification models by preventing overconfidence in logit predictions and improving generalization.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`logits = torch.tensor([[3.0, 0.1, -1.0], [0.2, 2.5, 0.0]], dtype=torch.float32)`  
`targets = torch.tensor([0, 1], dtype=torch.long)`

`# Smooth target distributions by blending 10% uniform noise`  
`criterion = nn.CrossEntropyLoss(label_smoothing=0.1)`  
`loss = criterion(logits, targets)`  
`print(f"Smoothed Loss: {loss.item():.4f}")`

## **Minimal Notes**

Blends hard target one-hot vectors with uniform class distributions based on smoothing value epsilon in \[0.0, 1.0\]. Supported natively in nn.CrossEntropyLoss.

## **Common Bug**

**Issue:** ValueError: label\_smoothing must be between 0.0 and 1.0.

**Cause:** Passing smoothing values outside the valid range or passing a negative float.

**Quick Fix:** Keep label\_smoothing values in a realistic regularization range such as 0.1 or 0.05.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

---

