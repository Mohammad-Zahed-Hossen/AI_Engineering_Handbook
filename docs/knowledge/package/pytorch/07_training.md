# **PyTorch Training Utilities Markdown Generation**

# **Training Utilities & Model Lifecycle (07\_training.md)**

## **Task**

Switch Model to Training Mode (model.train)

## **Problem Solved**

Configures submodules and neural network layers to execute training-specific behaviors, such as applying dropout probability and updating running mean and variance statistics in normalization layers.

## **Mental Trigger**

I need to ensure my model updates its internal training statistics and enables dropout during forward passes.

## **Syntax**

`torch.nn.Module.train(mode=True)`

## **Important Parameters**

> * **mode** (bool, default=True): Sets whether to activate training mode (True) or evaluation mode (False).

## **Return Value**

> * **self** (torch.nn.Module): Returns the module instance itself to enable method chaining.

## **Example**

`import torch`  
`import torch.nn as nn`

`class SampleModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.conv = nn.Conv2d(3, 16, kernel_size=3)`  
        `self.bn = nn.BatchNorm2d(16)`  
        `self.dropout = nn.Dropout(p=0.5)`

    `def forward(self, x):`  
        `return self.dropout(self.bn(self.conv(x)))`

`model = SampleModel()`

`# Recursively switch all submodules to training mode`  
`model.train()`

`print(f"Model training state: {model.training}")`  
`print(f"BatchNorm training state: {model.bn.training}")`  
`print(f"Dropout training state: {model.dropout.training}")`

## **Use When**

> * Beginning a new training epoch or training step.  
> * Resuming model training after running a validation or evaluation phase.

## **Avoid When**

> * Performing evaluation, validation, inference, or generating predictions on test datasets.

## **Gotchas**

> * Calling model.train() does not clear or reset parameter gradients.  
> * Custom submodules will only respond to train() if they inherit from torch.nn.Module.  
> * Submodules registered dynamically as plain Python list attributes rather than nn.ModuleList will fail to update their training state when model.train() is called.

## **Performance Notes**

> * Modifies an internal boolean flag recursively across the module hierarchy in Python, introducing zero GPU synchronization or kernel launch overhead.

## **Related APIs**

> * torch.nn.Module.eval  
> * torch.nn.Module.training

## **Framework Migration Notes**

> * In TensorFlow/Keras, training state is typically passed explicitly as a boolean argument training=True during the call execution. In PyTorch, state is set imperatively on the module prior to the forward pass.

## **TensorFlow Equivalent**

`model(inputs, training=True)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: train(), enable training mode, enable dropout  
> * **Common Search Terms**: how to set pytorch model to train, model.train vs eval, enable batchnorm updates  
> * **Keywords**: train, Dropout, BatchNorm, training  
> * **Frequently Confused With**: torch.enable\_grad, torch.set\_grad\_enabled

## **Related Models**

resnet, vit, transformer, yolo, bert, roberta

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.train](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.train)

## **Task**

Switch Model to Evaluation Mode (model.eval)

## **Problem Solved**

Disables training-specific module behaviors, freezing Batch Normalization running statistics and deactivating Dropout layers to ensure deterministic and consistent predictions during inference.

## **Mental Trigger**

I need to evaluate or run inference on my model without altering running stats or dropping features randomly.

## **Syntax**

`torch.nn.Module.eval()`

## **Important Parameters**

None. model.eval() is a convenience wrapper equivalent to calling model.train(False).

## **Return Value**

> * **self** (torch.nn.Module): Returns the module instance itself to enable method chaining.

## **Example**

`import torch`  
`import torch.nn as nn`

`class Classifier(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`  
        `self.dropout = nn.Dropout(p=0.5)`

    `def forward(self, x):`  
        `return self.fc(self.dropout(x))`

`model = Classifier()`

`# Switch module hierarchy to evaluation mode`  
`model.eval()`

`x = torch.randn(1, 10)`  
`out_first_pass = model(x)`  
`out_second_pass = model(x)`

`# Outputs are identical because dropout is disabled in eval mode`  
`assert torch.allclose(out_first_pass, out_second_pass)`  
`print("Evaluation mode active. Deterministic predictions confirmed.")`

## **Use When**

> * Running validation loops during training.  
> * Executing offline inference, model evaluation, or production deployment.  
> * Extracting features or embeddings from frozen pretrained backbones.

## **Avoid When**

> * Executing training steps where parameters and normalization statistics must adapt to training batches.

## **Gotchas**

> * model.eval() does not disable gradient computation or reduce GPU memory usage. Gradient tracking must be separately managed using torch.no\_grad() or torch.inference\_mode().  
> * Forgetting to call model.eval() during inference causes BatchNorm layers to update running statistics based on single evaluation batches, causing incorrect predictions.  
> * If custom layers do not check self.training in their forward implementation, model.eval() will have no effect on their custom operational logic.

## **Performance Notes**

> * Execution speed improves during inference in eval mode because Dropout kernels are bypassed entirely and BatchNorm layers use cached running statistics instead of computing batch metrics.

## **Related APIs**

> * torch.nn.Module.train  
> * torch.no\_grad  
> * torch.inference\_mode

## **Framework Migration Notes**

> * Equivalent to executing Keras model calls with training=False. In PyTorch, setting evaluation mode must be done explicitly on the parent module instance before passing inputs.

## **TensorFlow Equivalent**

`model(inputs, training=False)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: eval(), disable dropout, evaluation mode  
> * **Common Search Terms**: how to evaluate pytorch model, pytorch model eval vs no grad, disable batchnorm updates  
> * **Keywords**: eval, inference, Dropout, BatchNorm  
> * **Frequently Confused With**: torch.no\_grad, torch.inference\_mode

## **Related Models**

resnet, vit, transformer, yolo, bert, roberta, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline, text-classification-pipeline-classical-encoder, transfer-learning-for-vision

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.eval](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.eval)

## **Task**

Toggle Module Training State (Module.training)

## **Problem Solved**

Provides a boolean attribute on torch.nn.Module instances that reflects whether the module is currently in training mode (True) or evaluation mode (False), enabling custom layer conditional logic.

## **Mental Trigger**

I need my custom layer to execute different logic during training versus evaluation.

## **Syntax**

`module.training`

## **Important Parameters**

None. training is a boolean attribute managed internally by train() and eval().

## **Return Value**

> * **bool**: Returns True if the module is in training mode, and False if it is in evaluation mode.

## **Example**

`import torch`  
`import torch.nn as nn`

`class CustomNoiseLayer(nn.Module):`  
    `def __init__(self, std=0.1):`  
        `super().__init__()`  
        `self.std = std`

    `def forward(self, x):`  
        `# Conditionally add Gaussian noise only during training phase`  
        `if self.training:`  
            `noise = torch.randn_like(x) * self.std`  
            `return x + noise`  
        `return x`

`layer = CustomNoiseLayer()`

`layer.train()`  
`print(f"Is training: {layer.training}")`  
`train_out = layer(torch.ones(2, 2))`

`layer.eval()`  
`print(f"Is training: {layer.training}")`  
`eval_out = layer(torch.ones(2, 2))`

`print("Train output changed by noise:", not torch.equal(train_out, torch.ones(2, 2)))`  
`print("Eval output unchanged:", torch.equal(eval_out, torch.ones(2, 2)))`

## **Use When**

> * Writing custom network layers that require different forward pass behaviors during training and inference.  
> * Inspecting or logging the operational status of submodules inside complex custom models.

## **Avoid When**

> * Manually assigning module.training \= True directly without using model.train(), because direct attribute assignment will not propagate recursively to child submodules.

## **Gotchas**

> * Setting module.training \= False directly on a container module only changes that single container's attribute and leaves child layers unchanged. Always use model.train() or model.eval().  
> * Inspecting self.training inside JIT-compiled models or TorchScript without proper annotation can cause unexpected compilation trace behaviors.

## **Performance Notes**

> * Direct boolean check with zero runtime overhead or computational latency.

## **Related APIs**

> * torch.nn.Module.train  
> * torch.nn.Module.eval

## **Framework Migration Notes**

> * Corresponds to inspecting the internal training flag or checking the boolean status passed to call(self, inputs, training=None) in Keras custom layers.

## **TensorFlow Equivalent**

`# Inside Keras Layer call method:`  
`if training:`  
    `...`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: self.training, module training flag, check train mode  
> * **Common Search Terms**: how to check if pytorch model is in train mode, custom layer train eval condition, module.training attribute  
> * **Keywords**: training, attribute, custom layer, conditional execution  
> * **Frequently Confused With**: torch.is\_grad\_enabled

## **Related Models**

resnet, vit, transformer

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module)

## **Task**

Clip Gradient Norm (torch.nn.utils.clip\_grad\_norm\_)

## **Problem Solved**

Rescales parameter gradients so that their combined L2 (or p-norm) vector norm does not exceed a designated threshold, preventing exploding gradients and training instability.

## **Mental Trigger**

I need to prevent unstable gradients from causing training divergence by bounding the overall gradient norm.

## **Syntax**

`torch.nn.utils.clip_grad_norm_(`  
    `parameters,`  
    `max_norm,`  
    `norm_type=2.0,`  
    `error_if_nonfinite=False,`  
    `foreach=None`  
`)`

## **Important Parameters**

> * **parameters** (Iterable\[Tensor\] or Tensor): An iterable of Tensors or a single Tensor with gradients that will be normalized in-place.  
> * **max\_norm** (float or int): The maximum target norm threshold for the gradients.  
> * **norm\_type** (float or int, default=2.0): Type of the p-norm. Can be 2.0 for L2 norm, 1.0 for L1 norm, or inf for infinity norm.  
> * **error\_if\_nonfinite** (bool, default=False): If True, throws an error if the total norm of gradients becomes NaN or Inf.  
> * **foreach** (bool, optional): If True, uses fast CUDA multi-tensor foreach implementation. Defaults to True when available on CUDA devices.

## **Return Value**

> * **torch.Tensor**: A scalar tensor representing the total norm of the parameters calculated prior to clipping.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(5, 1)`  
`x = torch.randn(4, 5)`  
`target = torch.randn(4, 1)`

`# Forward and backward pass`  
`output = model(x)`  
`loss = nn.functional.mse_loss(output, target)`  
`loss.backward()`

`# Clip parameter gradients to maximum L2 norm of 1.0`  
`max_allowed_norm = 1.0`  
`total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=max_allowed_norm)`

`print(f"Pre-clipping total gradient norm: {total_norm.item():.4f}")`

`# Re-calculate norm to verify clipping succeeded`  
`clipped_norm = torch.norm(`  
    `torch.stack([torch.norm(p.grad.detach(), 2.0) for p in model.parameters()]), 2.0`  
`)`  
`print(f"Post-clipping calculated norm: {clipped_norm.item():.4f}")`  
`assert clipped_norm.item() <= max_allowed_norm + 1e-5`

## **Use When**

> * Training recurrent neural networks (RNNs, LSTMs, GRUs) or Transformers susceptible to exploding gradients.  
> * Optimizing deep architectures with large learning rates or mixed precision training.

## **Avoid When**

> * Training stable shallow networks where gradient scaling distorts standard optimization trajectories.  
> * Performing gradient accumulation without scaling parameters across accumulated iterations properly.

## **Gotchas**

> * clip\_grad\_norm\_ must be called after loss.backward() and prior to calling optimizer.step().  
> * Calling clip\_grad\_norm\_ when using mixed precision (torch.amp / GradScaler) must occur after unscaling gradients via scaler.unscale\_(optimizer).  
> * Generators passed as model.parameters() are exhausted upon evaluation. If passed twice, the second evaluation operates on an empty iterator.

## **Performance Notes**

> * Computes a global reduction over all parameter gradient tensors, triggering a GPU device synchronization step unless foreach=True is enabled on supported hardware.

## **Related APIs**

> * torch.nn.utils.clip\_grad\_value\_  
> * torch.optim.Optimizer.step

## **Framework Migration Notes**

> * Equivalent to tf.clip\_by\_global\_norm in TensorFlow. Unlike TensorFlow which returns clipped tensors requiring manual assignment, PyTorch updates gradient tensors in-place.

## **TensorFlow Equivalent**

`gradients, _ = tf.clip_by_global_norm(gradients, clip_norm=max_norm)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: clip\_grad\_norm\_, clip global norm, gradient norm clipping  
> * **Common Search Terms**: how to clip gradients pytorch, max grad norm transformer, prevent exploding gradients  
> * **Keywords**: clip\_grad\_norm\_, gradients, exploding gradients, optimization  
> * **Frequently Confused With**: torch.nn.utils.clip\_grad\_value\_

## **Related Models**

transformer, bert, roberta, t5, bart, gpt, llama, qwen, gemma, deepseek

## **Related Patterns**

memory-efficient-training, mixed-precision, gradient-accumulation

## **Related Workflows**

text-classification-pipeline-classical-encoder, production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.utils.clip\_grad\_norm\_.html](https://pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html)

## **Task**

Clip Gradient Values (torch.nn.utils.clip\_grad\_value\_)

## **Problem Solved**

Clamps individual element-wise parameter gradients directly to a specified scalar range \[-clip\_value, clip\_value\], capping extreme gradient values regardless of total global norm.

## **Mental Trigger**

I need to clamp every individual gradient component to stay within a strict numeric range.

## **Syntax**

`torch.nn.utils.clip_grad_value_(parameters, clip_value)`

## **Important Parameters**

> * **parameters** (Iterable\[Tensor\] or Tensor): An iterable of Tensors or a single Tensor with gradients to be clipped in-place.  
> * **clip\_value** (float or int): The maximum allowed absolute scalar value. Gradients are clamped to the closed interval \[-clip\_value, clip\_value\].

## **Return Value**

> * **None**: Modifies the .grad attributes of the input parameters in-place.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(3, 1)`  
`x = torch.randn(2, 3) * 10`  
`target = torch.randn(2, 1) * 10`

`output = model(x)`  
`loss = nn.functional.mse_loss(output, target)`  
`loss.backward()`

`print("Gradients before clipping:")`  
`for p in model.parameters():`  
    `print(p.grad)`

`# Clamp every individual gradient value to interval [-0.5, 0.5]`  
`torch.nn.utils.clip_grad_value_(model.parameters(), clip_value=0.5)`

`print("\nGradients after value clipping:")`  
`for p in model.parameters():`  
    `print(p.grad)`  
    `assert torch.all(p.grad <= 0.5) and torch.all(p.grad >= -0.5)`

## **Use When**

> * Specific outlier features create massive localized gradients in specific parameter weight matrices.  
> * Enforcing strict numeric bounded constraints on gradients during specialized reinforcement learning or GAN training.

## **Avoid When**

> * Training models where preserving the relative directional angle of the full gradient vector is critical (use clip\_grad\_norm\_ instead).

## **Gotchas**

> * Value clipping changes the orientation angle of the gradient vector by distorting individual dimensions unevenly, whereas norm clipping preserves vector direction.  
> * Passing clip\_value \<= 0 can lead to inverted gradient updates or zeros across all parameters.  
> * Must be called after backward() and before optimizer.step().

## **Performance Notes**

> * Performs simple point-wise element clamping on CUDA memory buffers with lower reduction overhead than global norm calculation.

## **Related APIs**

> * torch.nn.utils.clip\_grad\_norm\_  
> * torch.clamp\_

## **Framework Migration Notes**

> * Maps directly to tf.clip\_by\_value applied across gradient lists in TensorFlow.

## **TensorFlow Equivalent**

`gradients = [tf.clip_by_value(g, -clip_value, clip_value) for g in gradients]`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: clip\_grad\_value\_, value clipping, clamp gradients  
> * **Common Search Terms**: pytorch clamp gradients, clip grad value vs norm, elementwise gradient clipping  
> * **Keywords**: clip\_grad\_value\_, gradients, clamp, optimization  
> * **Frequently Confused With**: torch.nn.utils.clip\_grad\_norm\_

## **Related Models**

transformer, gpt, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.utils.clip\_grad\_value\_.html](https://pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_value_.html)

## **Task**

Detect Exploding and Vanishing Gradients (Gradient Inspection)

## **Problem Solved**

Inspects layer-by-layer gradient statistics to identify zero, extremely small, or infinite/NaN gradients across neural network modules during training execution.

## **Mental Trigger**

I need to inspect layer-wise gradient statistics to pinpoint exploding or vanishing gradients during backpropagation.

## **Syntax**

`# Custom inspection loop over named parameters`  
`for name, param in model.named_parameters():`  
    `if param.grad is not None:`  
        `grad_norm = param.grad.detach().norm(2).item()`  
        `has_nan = torch.isnan(param.grad).any().item()`  
        `has_inf = torch.isinf(param.grad).any().item()`

## **Important Parameters**

None. Relies on iterating over model.named\_parameters() and analyzing the .grad attributes.

## **Return Value**

> * **dict**: Custom telemetry dictionary mapping module parameter names to gradient statistics (norm, mean, standard deviation, NaN/Inf presence).

## **Example**

`import torch`  
`import torch.nn as nn`

`def inspect_gradients(model: nn.Module) -> dict:`  
    `stats = {}`  
    `for name, param in model.named_parameters():`  
        `if param.requires_grad:`  
            `if param.grad is None:`  
                `stats[name] = {"status": "NO_GRADIENT"}`  
            `else:`  
                `grad_data = param.grad.detach()`  
                `norm = torch.norm(grad_data, 2).item()`  
                `has_nan = torch.isnan(grad_data).any().item()`  
                `has_inf = torch.isinf(grad_data).any().item()`  
                  
                `status = "HEALTHY"`  
                `if has_nan or has_inf:`  
                    `status = "EXPLODED_NAN_INF"`  
                `elif norm > 100.0:`  
                    `status = "EXPLODING"`  
                `elif norm < 1e-7:`  
                    `status = "VANISHING"`  
                      
                `stats[name] = {`  
                    `"norm": norm,`  
                    `"min": grad_data.min().item(),`  
                    `"max": grad_data.max().item(),`  
                    `"status": status`  
                `}`  
    `return stats`

`# Demonstrate inspection on deep linear chain`  
`layers = [nn.Linear(10, 10) for _ in range(5)]`  
`model = nn.Sequential(*layers)`  
`x = torch.randn(2, 10)`  
`loss = model(x).sum()`  
`loss.backward()`

`grad_report = inspect_gradients(model)`  
`for layer_name, info in grad_report.items():`  
    `print(f"{layer_name} -> Norm: {info['norm']:.6f} | Status: {info['status']}")`

## **Use When**

> * Diagnosing training loss stagnation, sudden loss spikes, or NaN loss values.  
> * Verifying proper gradient flow across custom residual connections or novel layer architectures.

## **Avoid When**

> * Running production high-throughput training loops without conditional diagnostic guards, as calculating detailed norms introduces memory read overhead.

## **Gotchas**

> * Accessing param.grad before calling loss.backward() returns None.  
> * Detaching gradient tensors via .detach() is necessary prior to computing norms or converting values to Python floats to prevent extending the autograd graph.  
> * Parameters with requires\_grad=False will have param.grad \= None.

## **Performance Notes**

> * Computing layer-wise norms requires memory reads for every parameter tensor, creating CPU-GPU synchronization points if .item() is called sequentially per parameter.

## **Related APIs**

> * torch.nn.utils.clip\_grad\_norm\_  
> * torch.isnan  
> * torch.isinf

## **Framework Migration Notes**

> * Similar to registering custom gradient logging callbacks or writing custom tf.gradient\_tape inspection loops in TensorFlow.

## **TensorFlow Equivalent**

`# Manual gradient evaluation using tf.GradientTape`  
`grads = tape.gradient(loss, model.trainable_variables)`  
`for g, v in zip(grads, model.trainable_variables):`  
    `tf.print(v.name, tf.norm(g))`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: gradient inspection, check gradient flow, detect nan loss  
> * **Common Search Terms**: how to debug nan loss pytorch, check exploding gradient, inspect module gradients  
> * **Keywords**: gradient, exploding, vanishing, nan, inf, debug  
> * **Frequently Confused With**: torch.autograd.detect\_anomaly

## **Related Models**

resnet, vit, transformer, bert, llama, deepseek

## **Related Patterns**

memory-efficient-training, mixed-precision

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.named\_parameters](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.named_parameters)

## **Task**

Save Model Checkpoint (torch.save)

## **Problem Solved**

Serializes PyTorch modules, tensors, state dictionaries, or general Python objects to disk for model deployment and state persistence.

## **Mental Trigger**

I need to persist my model weights to disk so I can deploy or resume training later.

## **Syntax**

`torch.save(`  
    `obj,`  
    `f,`  
    `pickle_module=pickle,`  
    `pickle_protocol=DEFAULT_PROTOCOL,`  
    `_use_new_zipfile_serialization=True`  
`)`

## **Important Parameters**

> * **obj** (Any): The saved object (typically a model.state\_dict() dictionary or full checkpoint dictionary).  
> * **f** (str, Path, or file-like object): File path or write buffer where object bytes will be stored.  
> * **pickle\_module** (module, default=pickle): Python module used for serializing metadata.  
> * **pickle\_protocol** (int, default=4): Protocol level for Python pickle serialization.

## **Return Value**

> * **None**: Writes serialized object bytes directly to the specified destination.

## **Example**

`from pathlib import Path`  
`import torch`  
`import torch.nn as nn`

`class LinearModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(4, 1)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = LinearModel()`  
`checkpoint_path = Path("model_weights.pt")`

`# Save only state_dict (recommended best practice)`  
`torch.save(model.state_dict(), checkpoint_path)`

`print(f"Model saved successfully to {checkpoint_path}")`  
`if checkpoint_path.exists():`  
    `checkpoint_path.unlink() # Cleanup local file`

## **Use When**

> * Saving model parameter weights at the end of training epochs.  
> * Exporting final trained models for downstream evaluation or serving.

## **Avoid When**

> * Saving whole module instances (torch.save(model, path)) directly for production, as this binds the checkpoint file strictly to project directory structures and exact class definitions.

## **Gotchas**

> * Saving full model objects instead of state\_dict breaks when refactoring code or changing project folder structures.  
> * Saving tensor references on GPU hardware directly can cause torch.load to consume GPU memory unnecessarily upon reloading if map\_location is not specified.  
> * Storage writes are synchronous by default and may block training execution during large model saves.

## **Performance Notes**

> * Uses zip archive format for storage. Large models (1B+ parameters) require significant I/O throughput; consider offloading checkpoint saving to asynchronous background threads.

## **Related APIs**

> * torch.load  
> * torch.nn.Module.state\_dict

## **Framework Migration Notes**

> * Equivalent to model.save\_weights() in Keras or tf.saved\_model export mechanisms. PyTorch emphasizes saving lightweight state dictionaries over entire model definitions.

## **TensorFlow Equivalent**

`model.save_weights("checkpoint.ckpt")`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: torch.save, save weights, save checkpoint  
> * **Common Search Terms**: how to save pytorch model, torch save state\_dict, export pytorch weights  
> * **Keywords**: torch.save, checkpoint, serialization, state\_dict  
> * **Frequently Confused With**: torch.onnx.export

## **Related Models**

resnet, vit, transformer, yolo, bert, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline, text-classification-pipeline-classical-encoder, transfer-learning-for-vision

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.save.html](https://pytorch.org/docs/stable/generated/torch.save.html)

## **Task**

Load Model Checkpoint (torch.load)

## **Problem Solved**

Deserializes saved PyTorch checkpoint files from disk into Python memory and maps tensors onto specific target devices.

## **Mental Trigger**

I need to restore saved weights or training objects from disk into my PyTorch environment safely.

## **Syntax**

`torch.load(`  
    `f,`  
    `map_location=None,`  
    `weights_only=True,`  
    `mmap=None`  
`)`

## **Important Parameters**

> * **f** (str, Path, or file-like object): The file path or read buffer to load.  
> * **map\_location** (str, torch.device, or callable, optional): Dynamically re-maps storage locations (e.g., mapping GPU saved tensors directly to CPU).  
> * **weights\_only** (bool, default=True in PyTorch 2.6+): When True, restricts unpickling strictly to primitive types, tensors, and state dictionaries to prevent arbitrary code execution vulnerabilities.  
> * **mmap** (bool, optional): Memory-maps the file from disk to enable fast zero-copy loading of large model checkpoints.

## **Return Value**

> * **Any**: The deserialized object dictionary, state dictionary, or PyTorch tensor collection.

## **Example**

`from pathlib import Path`  
`import torch`  
`import torch.nn as nn`

`model = nn.Linear(4, 1)`  
`checkpoint_path = Path("temp_checkpoint.pt")`

`# Save a reference checkpoint`  
`torch.save(model.state_dict(), checkpoint_path)`

`# Safe loading using weights_only=True and device remap`  
`loaded_state_dict = torch.load(`  
    `checkpoint_path,`  
    `map_location=torch.device("cpu"),`  
    `weights_only=True`  
`)`

`# Populate module parameters`  
`model.load_state_dict(loaded_state_dict)`  
`print("Checkpoint loaded and state dict applied cleanly.")`

`if checkpoint_path.exists():`  
    `checkpoint_path.unlink() # Cleanup`

## **Use When**

> * Restoring model weights for inference, validation, or finetuning.  
> * Transferring model checkpoints across machines with different GPU device configurations.

## **Avoid When**

> * Loading untrusted .pt or .pth files from public sources with weights\_only=False, as standard Python pickle deserialization can execute arbitrary code.

## **Gotchas**

> * Loading a GPU-saved checkpoint on a CPU-only machine without setting map\_location="cpu" causes a runtime CUDA device error.  
> * Using weights\_only=True fails when loading complex custom Python class instances saved directly in the file.  
> * load\_state\_dict requires exact key matching unless strict=False is passed explicitly.

## **Performance Notes**

> * Setting mmap=True enables memory-mapped reading, allowing near-instant tensor allocation for multi-gigabyte files without holding duplicate RAM copies.

## **Related APIs**

> * torch.save  
> * torch.nn.Module.load\_state\_dict

## **Framework Migration Notes**

> * Equivalent to model.load\_weights() in Keras. Handles device remap explicitly through map\_location.

## **TensorFlow Equivalent**

`model.load_weights("checkpoint.ckpt")`

## **Version Compatibility**

Starting in PyTorch 2.6, weights\_only=True is the default setting for improved security.

## **Search Metadata**

> * **Aliases**: torch.load, load weights, restore checkpoint  
> * **Common Search Terms**: how to load pytorch checkpoint, torch load map\_location cpu, weights\_only true pytorch  
> * **Keywords**: torch.load, checkpoint, deserialization, map\_location  
> * **Frequently Confused With**: torch.nn.Module.load\_state\_dict

## **Related Models**

resnet, vit, transformer, yolo, bert, llama, deepseek

## **Related Patterns**

memory-efficient-training, device-placement

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision, production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.load.html](https://pytorch.org/docs/stable/generated/torch.load.html)

## **Task**

Save and Restore Complete Training State (state\_dict, optimizer, scheduler, epoch)

## **Problem Solved**

Preserves complete training runtime metadata (model weights, optimizer momentum, learning rate scheduler steps, epoch counts, best loss metrics) to enable exact training restoration after interruptions.

## **Mental Trigger**

I need to save everything required to seamlessly resume training from an exact checkpoint.

## **Syntax**

`# Save complete state dictionary`  
`checkpoint = {`  
    `"epoch": epoch,`  
    `"model_state_dict": model.state_dict(),`  
    `"optimizer_state_dict": optimizer.state_dict(),`  
    `"scheduler_state_dict": scheduler.state_dict(),`  
    `"loss": loss_value,`  
`}`  
`torch.save(checkpoint, path)`

`# Restore state dictionary`  
`checkpoint = torch.load(path, weights_only=True)`  
`model.load_state_dict(checkpoint["model_state_dict"])`  
`optimizer.load_state_dict(checkpoint["optimizer_state_dict"])`  
`scheduler.load_state_dict(checkpoint["scheduler_state_dict"])`  
`start_epoch = checkpoint["epoch"] + 1`

## **Important Parameters**

None. Pattern relies on constructing a clean Python dictionary structure around native state\_dict() calls.

## **Return Value**

> * **dict**: Combined state dictionary containing all components needed for training recovery.

## **Example**

`from pathlib import Path`  
`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`# Setup dummy components`  
`model = nn.Linear(2, 1)`  
`optimizer = optim.Adam(model.parameters(), lr=0.01)`  
`scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5)`

`ckpt_file = Path("full_training_state.pt")`

`# Simulate saving epoch state`  
`current_epoch = 3`  
`current_loss = 0.125`

`training_checkpoint = {`  
    `"epoch": current_epoch,`  
    `"model_state": model.state_dict(),`  
    `"optimizer_state": optimizer.state_dict(),`  
    `"scheduler_state": scheduler.state_dict(),`  
    `"loss": current_loss,`  
`}`  
`torch.save(training_checkpoint, ckpt_file)`

`# Simulate restoring training on new instance`  
`new_model = nn.Linear(2, 1)`  
`new_optimizer = optim.Adam(new_model.parameters(), lr=0.01)`  
`new_scheduler = optim.lr_scheduler.StepLR(new_optimizer, step_size=5)`

`checkpoint = torch.load(ckpt_file, weights_only=True)`  
`new_model.load_state_dict(checkpoint["model_state"])`  
`new_optimizer.load_state_dict(checkpoint["optimizer_state"])`  
`new_scheduler.load_state_dict(checkpoint["scheduler_state"])`  
`resumed_epoch = checkpoint["epoch"] + 1`

`print(f"Resuming training state successfully at Epoch {resumed_epoch}")`

`if ckpt_file.exists():`  
    `ckpt_file.unlink() # Cleanup`

## **Use When**

> * Implementing fault-tolerant training jobs on preemptible cloud instances or spot nodes.  
> * Saving periodic multi-epoch checkpoints to pick the best performing epoch state post-hoc.

## **Avoid When**

> * Exporting models solely for production inference where storing optimizer momentum buffers wastes disk space.

## **Gotchas**

> * Saving model.state\_dict() without optimizer.state\_dict() causes Adam and momentum-based optimizers to lose moving-average buffers, disrupting convergence upon resumption.  
> * Instantiating optimizers before restoring model.state\_dict() can create parameter reference mismatches if model structures changed.  
> * LR schedulers must be restored along with optimizers to prevent learning rate jumps.

## **Performance Notes**

> * Storing optimizer states doubles or triples disk space requirements relative to storing model weights alone, because stateful optimizers like Adam keep two extra float32 momentum tensors per parameter.

## **Related APIs**

> * torch.nn.Module.state\_dict  
> * torch.optim.Optimizer.state\_dict  
> * torch.optim.lr\_scheduler.LRScheduler.state\_dict

## **Framework Migration Notes**

> * Similar to saving full checkpoint managers using tf.train.Checkpoint in TensorFlow to store tracked model, optimizer, and step objects together.

## **TensorFlow Equivalent**

`ckpt = tf.train.Checkpoint(step=tf.Variable(1), optimizer=opt, model=net)`  
`ckpt.save("path/to/ckpt")`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: resume training state, full checkpoint, save optimizer state  
> * **Common Search Terms**: how to resume training pytorch, save model and optimizer state dict, complete pytorch checkpoint  
> * **Keywords**: state\_dict, resume, optimizer, scheduler, checkpoint  
> * **Frequently Confused With**: saving model weights only

## **Related Models**

resnet, vit, transformer, yolo, bert, llama, deepseek

## **Related Patterns**

memory-efficient-training, gradient-accumulation

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline, text-classification-pipeline-classical-encoder, transfer-learning-for-vision, production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.state\_dict](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.state_dict)

## **Task**

Initialize Model Parameters (torch.nn.init)

## **Problem Solved**

Applies statistical weight initialization schemes (Xavier, Kaiming, Uniform, Normal, Orthogonal) to network parameter tensors to ensure stable variance during forward passes and prevent early vanishing/exploding gradients.

## **Mental Trigger**

I need to initialize my model weights using Kaiming or Xavier initialization to avoid immediate vanishing/exploding activations.

## **Syntax**

`torch.nn.init.kaiming_uniform_(tensor, a=0, mode='fan_in', nonlinearity='leaky_relu')`  
`torch.nn.init.xavier_uniform_(tensor, gain=1.0)`  
`torch.nn.init.constant_(tensor, val)`  
`torch.nn.init.zeros_(tensor)`

## **Important Parameters**

> * **tensor** (Tensor): An in-place mutable PyTorch parameter tensor.  
> * **a** (float, default=0): Negative slope of leaky ReLU activation function.  
> * **mode** (str, default='fan\_in'): Either 'fan\_in' (preserves forward pass variance magnitude) or 'fan\_out' (preserves backward pass variance).  
> * **nonlinearity** (str, default='leaky\_relu'): Activation function name, adjusting the calculation gain factor automatically.

## **Return Value**

> * **torch.Tensor**: The modified parameter tensor updated in-place.

## **Example**

`import torch`  
`import torch.nn as nn`

`linear_layer = nn.Linear(20, 10)`

`# Apply Kaiming (He) uniform initialization for ReLU activations`  
`nn.init.kaiming_uniform_(linear_layer.weight, nonlinearity='relu')`

`# Initialize bias parameters explicitly to zero`  
`nn.init.zeros_(linear_layer.bias)`

`print(f"Weight matrix mean: {linear_layer.weight.mean().item():.4f}")`  
`print(f"Weight matrix std: {linear_layer.weight.std().item():.4f}")`  
`print(f"Bias elements: {linear_layer.bias.detach().numpy()}")`

## **Use When**

> * Instantiating non-standard custom layers or building networks from scratch without pretrained weights.  
> * Overriding PyTorch's default uniform layer initializations for deep architectures.

## **Avoid When**

> * Loading pretrained backbone models, as overwriting weights destroys pretrained representations.

## **Gotchas**

> * Functions in torch.nn.init operate in-place and end with an underscore (e.g., kaiming\_uniform\_). Calling functional alternatives without underscores does not update parameter values.  
> * Choosing an incorrect nonlinearity gain setting (e.g., specifying 'sigmoid' for a ReLU network) leads to improper activation scaling.  
> * Overwriting biases with non-zero initial distributions can lead to early optimization divergence.

## **Performance Notes**

> * In-place CPU/GPU memory operations that run instantly during layer construction before training begins.

## **Related APIs**

> * torch.nn.Module.apply  
> * torch.nn.init.kaiming\_normal\_  
> * torch.nn.init.xavier\_normal\_

## **Framework Migration Notes**

> * Maps to tf.keras.initializers (such as HeUniform, GlorotNormal). In PyTorch, initializers are applied imperatively on target parameter tensors rather than passed as class arguments during layer construction.

## **TensorFlow Equivalent**

`layer = tf.keras.layers.Dense(10, kernel_initializer='he_uniform', bias_initializer='zeros')`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: torch.nn.init, kaiming initialization, xavier initialization, weight init  
> * **Common Search Terms**: how to initialize weights pytorch, kaiming uniform pytorch, xavier normal init  
> * **Keywords**: init, kaiming, xavier, weights, initialization  
> * **Frequently Confused With**: standard normal distribution generation (torch.randn)

## **Related Models**

resnet, vit, transformer, yolo

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/nn.init.html](https://pytorch.org/docs/stable/nn.init.html)

## **Task**

Apply Custom Initialization across Modules (Module.apply)

## **Problem Solved**

Traverses all submodules recursively within a parent torch.nn.Module hierarchy, invoking a specified custom function on each module to apply consistent parameter initialization across an entire network.

## **Mental Trigger**

I need to recursively walk through all submodules in my model and apply customized weight initialization logic based on layer type.

## **Syntax**

`torch.nn.Module.apply(fn)`

## **Important Parameters**

> * **fn** (Callable\[\[nn.Module\], None\]): A function taking a torch.nn.Module submodule instance as its sole argument.

## **Return Value**

> * **self** (torch.nn.Module): Returns the parent module instance to enable method chaining.

## **Example**

`import torch`  
`import torch.nn as nn`

`class CustomCNN(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.conv = nn.Conv2d(3, 16, 3)`  
        `self.bn = nn.BatchNorm2d(16)`  
        `self.fc = nn.Linear(16 * 6 * 6, 10)`

    `def forward(self, x):`  
        `return self.fc(self.bn(self.conv(x)).flatten(1))`

`def init_weights(m):`  
    `if isinstance(m, nn.Conv2d):`  
        `nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')`  
        `if m.bias is not None:`  
            `nn.init.zeros_(m.bias)`  
    `elif isinstance(m, nn.BatchNorm2d):`  
        `nn.init.ones_(m.weight)`  
        `nn.init.zeros_(m.bias)`  
    `elif isinstance(m, nn.Linear):`  
        `nn.init.xavier_normal_(m.weight)`  
        `nn.init.zeros_(m.bias)`

`model = CustomCNN()`

`# Apply custom initialization function recursively across all submodules`  
`model.apply(init_weights)`

`print("Custom module initialization applied successfully.")`

## **Use When**

> * Enforcing uniform weight initialization rules across deep heterogeneous model hierarchies.  
> * Re-initializing model weights systematically between cross-validation folds.

## **Avoid When**

> * Working with complex models containing specialized submodules that require distinct initialization procedures handled individually.

## **Gotchas**

> * apply visits container modules (like nn.Sequential or parent classes) as well as leaf layers. Ensure class checks inside fn filter strictly for target layer instances (like isinstance(m, nn.Linear)).  
> * Forgetting to verify whether biases exist (m.bias is not None) raises AttributeError on layers initialized with bias=False.  
> * Calling apply(init\_weights) on pretrained model architectures wipes out all pretrained representations.

## **Performance Notes**

> * Performs simple recursive Python object traversal over local module references. Executes quickly at model construction time.

## **Related APIs**

> * torch.nn.Module.children  
> * torch.nn.Module.modules  
> * torch.nn.init

## **Framework Migration Notes**

> * Replaces manual loop iteration over Keras layer lists. In PyTorch, model.apply() handles recursive submodule iteration automatically.

## **TensorFlow Equivalent**

`for layer in model.layers:`  
    `if hasattr(layer, 'kernel_initializer'):`  
        `...`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: model.apply, recursive initialization, module apply weights  
> * **Common Search Terms**: how to apply weight init to all layers pytorch, model apply custom init, initialize pytorch model recursively  
> * **Keywords**: apply, submodule, initialization, recursive  
> * **Frequently Confused With**: torch.nn.Module.map

## **Related Models**

resnet, vit, transformer, yolo

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.apply](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.apply)

## **Task**

Set Random Seeds for Reproducibility (torch.manual\_seed, CUDA, Python, NumPy)

## **Problem Solved**

Seeds pseudo-random number generators across Python, NumPy, PyTorch CPU, and PyTorch CUDA backend subsystems to make random operations (data shuffling, weight initialization, dropout masks) reproducible across execution runs.

## **Mental Trigger**

I need to lock random number generators so my training runs produce identical results across executions.

## **Syntax**

`random.seed(seed)`  
`np.random.seed(seed)`  
`torch.manual_seed(seed)`  
`torch.cuda.manual_seed_all(seed)`

## **Important Parameters**

> * **seed** (int): Non-negative integer value used to initialize internal pseudo-random states across engines.

## **Return Value**

> * **torch.Generator**: Returns the PyTorch CPU random number generator object.

## **Example**

`import random`  
`import numpy as np`  
`import torch`

`def set_seed(seed: int = 42):`  
    `random.seed(seed)`  
    `np.random.seed(seed)`  
    `torch.manual_seed(seed)`  
    `torch.cuda.manual_seed_all(seed)`  
    `print(f"Global random seed explicitly fixed to: {seed}")`

`set_seed(42)`

`# Generate pseudo-random samples across libraries`  
`val_torch = torch.randn(2)`  
`val_np = np.random.randn(2)`

`print(f"PyTorch sample: {val_torch.tolist()}")`  
`print(f"NumPy sample:   {val_np.tolist()}")`

## **Use When**

> * Debugging unexpected optimization failures or NaN losses.  
> * Setting up reproducible scientific research experiments and benchmark comparisons.  
> * Ensuring consistent train-test dataset split generation across runs.

## **Avoid When**

> * Running randomized data augmentation or multi-trial hyperparameter searches where independent stochastic variation is required.

## **Gotchas**

> * Calling torch.manual\_seed seeds CPU operations and single-GPU CUDA operations, but multi-GPU training requires explicit invocation of torch.cuda.manual\_seed\_all(seed).  
> * DataLoader multi-process workers inherit identical random states if worker\_init\_fn is not explicitly set, leading to repeated augmentation patterns across dataloader workers.  
> * Setting seeds alone does not guarantee total bitwise numerical determinism on CUDA GPU operations without configuring deterministic algorithms.

## **Performance Notes**

> * Low-overhead state assignment that occurs instantaneously during program launch.

## **Related APIs**

> * torch.use\_deterministic\_algorithms  
> * torch.cuda.manual\_seed\_all  
> * torch.initial\_seed

## **Framework Migration Notes**

> * Equivalent to tf.keras.utils.set\_random\_seed(seed) which configures Python, NumPy, and TensorFlow random engines concurrently.

## **TensorFlow Equivalent**

`tf.keras.utils.set_random_seed(seed)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: set\_seed, reproducible seed, fixed seed  
> * **Common Search Terms**: how to fix random seed pytorch, pytorch set seed numpy python, reproducible training pytorch  
> * **Keywords**: seed, reproducibility, random, manual\_seed  
> * **Frequently Confused With**: torch.use\_deterministic\_algorithms

## **Related Models**

resnet, vit, transformer, bert, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.manual\_seed.html](https://pytorch.org/docs/stable/generated/torch.manual_seed.html)

## **Task**

Configure Deterministic Execution (torch.use\_deterministic\_algorithms, cuDNN settings)

## **Problem Solved**

Forces PyTorch, CUDA, and cuDNN backends to execute only bitwise deterministic algorithms, disabling non-deterministic parallel atomic operations to ensure identical numerical results across identical hardware setups.

## **Mental Trigger**

I need strict bitwise reproducibility across training runs, even if it degrades CUDA kernel performance.

## **Syntax**

`torch.use_deterministic_algorithms(mode=True, warn_only=False)`  
`torch.backends.cudnn.deterministic = True`  
`torch.backends.cudnn.benchmark = False`

## **Important Parameters**

> * **mode** (bool, default=True): Enforces deterministic algorithm usage when True.  
> * **warn\_only** (bool, default=False): If True, operations without deterministic implementations throw a runtime warning instead of throwing an error exception.  
> * **torch.backends.cudnn.deterministic** (bool): Forces cuDNN convolution algorithms to pick deterministic implementations.  
> * **torch.backends.cudnn.benchmark** (bool): Set to False to prevent cuDNN from benchmarking and selecting fast non-deterministic convolution kernels dynamically.

## **Return Value**

> * **None**: Sets global execution behavior flags inside the PyTorch runtime.

## **Example**

`import os`  
`import torch`

`def enable_strict_determinism(warn_only: bool = False):`  
    `# Set environment variable for CUDA memory allocation determinism`  
    `os.environ["CUBLAS_WORKSPACE_CONFIG"] = ":4096:8"`  
      
    `# Configure PyTorch flags`  
    `torch.use_deterministic_algorithms(True, warn_only=warn_only)`  
    `torch.backends.cudnn.deterministic = True`  
    `torch.backends.cudnn.benchmark = False`  
    `print("Strict deterministic algorithm execution enabled.")`

`enable_strict_determinism(warn_only=True)`

`# Test simple deterministic execution`  
`x = torch.randn(10, 10, device="cpu")`  
`y = torch.mm(x, x)`  
`print("Deterministic operation executed cleanly.")`

## **Use When**

> * Performing strict regression testing where output floating-point values must match bit-for-bit across runs.  
> * Isolating subtle numerical bugs or verifying security-critical models.

## **Avoid When**

> * Optimizing models for high throughput or low latency production inference where small floating-point non-determinism is acceptable.

## **Gotchas**

> * Some PyTorch CUDA operations (such as index\_add\_, scatter\_add\_, or CTCLoss) lack deterministic CUDA kernel implementations and throw a RuntimeError unless warn\_only=True is enabled.  
> * CUDA operations require setting the environment variable CUBLAS\_WORKSPACE\_CONFIG=:4096:8 or :16:8 before starting the Python process to ensure deterministic cuBLAS behavior.  
> * Deterministic execution limits kernel parallelization and causes execution slowdowns.

## **Performance Notes**

> * Enabling deterministic operations can reduce training speed by 10% to 50% depending on layer selection, because fast atomic addition operations on GPU hardware are disabled.

## **Related APIs**

> * torch.manual\_seed  
> * torch.are\_deterministic\_algorithms\_enabled

## **Framework Migration Notes**

> * Maps to tf.config.experimental.enable\_op\_determinism() in TensorFlow.

## **TensorFlow Equivalent**

`tf.config.experimental.enable_op_determinism()`

## **Version Compatibility**

warn\_only parameter added in PyTorch 1.11 to allow non-deterministic operations to issue warnings rather than breaking execution immediately.

## **Search Metadata**

> * **Aliases**: strict determinism, use\_deterministic\_algorithms, cudnn deterministic  
> * **Common Search Terms**: how to make pytorch fully deterministic, cublas\_workspace\_config pytorch, deterministic cudnn  
> * **Keywords**: deterministic, cudnn, benchmark, reproducibility  
> * **Frequently Confused With**: setting random seed alone

## **Related Models**

resnet, vit, transformer, bert

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.use\_deterministic\_algorithms.html](https://pytorch.org/docs/stable/generated/torch.use_deterministic_algorithms.html)

## **Task**

Profile Training Performance (torch.profiler)

## **Problem Solved**

Measures execution duration, host CPU usage, CUDA kernel execution timing, and memory allocation across PyTorch execution steps to locate compute bottlenecks.

## **Mental Trigger**

I need to profile my training step to see whether execution time is bottlenecked by CPU operations or GPU kernels.

## **Syntax**

`with torch.profiler.profile(`  
    `activities=[`  
        `torch.profiler.ProfilerActivity.CPU,`  
        `torch.profiler.ProfilerActivity.CUDA,`  
    `],`  
    `schedule=torch.profiler.schedule(wait=1, warmup=1, active=3, repeat=1),`  
    `on_trace_ready=trace_handler,`  
    `record_shapes=False,`  
    `profile_memory=False,`  
    `with_stack=False`  
`) as prof:`  
    `...`

## **Important Parameters**

> * **activities** (Iterable\[ProfilerActivity\]): Devices to profile (ProfilerActivity.CPU, ProfilerActivity.CUDA).  
> * **schedule** (callable, optional): Profiler step controller returned by torch.profiler.schedule() defining wait, warmup, and active cycles.  
> * **record\_shapes** (bool, default=False): Collects dimensions and shapes of input operator tensors.  
> * **profile\_memory** (bool, default=False): Tracks tensor memory allocations and deallocations.  
> * **with\_stack** (bool, default=False): Records Python stack traces for corresponding C++ operators.

## **Return Value**

> * **torch.profiler.profile**: Profiler context manager instance providing key\_averages() and step() methods.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Sequential(`  
    `nn.Linear(1000, 500),`  
    `nn.ReLU(),`  
    `nn.Linear(500, 10)`  
`)`  
`x = torch.randn(64, 1000)`

`# Profile execution over CPU operations`  
`with torch.profiler.profile(`  
    `activities=[torch.profiler.ProfilerActivity.CPU],`  
    `record_shapes=True,`  
    `profile_memory=True`  
`) as prof:`  
    `out = model(x)`  
    `loss = out.sum()`  
    `loss.backward()`

`# Print formatted execution statistics table sorted by total CPU execution time`  
`print(prof.key_averages().table(sort_by="cpu_time_total", row_limit=5))`

## **Use When**

> * Identifying performance bottlenecks, unexpected CPU-GPU synchronization stalls, or high memory overhead during model training.  
> * Benchmarking custom layer execution performance against standard PyTorch implementations.

## **Avoid When**

> * Running normal production training, as collecting profiler metadata introduces performance overhead and increases memory usage.

## **Gotchas**

> * Forgeting to call prof.step() during loop iterations when using a step schedule leaves the profiler stuck in the initial wait state, producing empty traces.  
> * Enabling with\_stack=True or record\_shapes=True introduces runtime measurement overhead that can distort execution timings.  
> * Profiling single steps without a warmup phase measures temporary kernel cold-start compilation latency rather than steady-state training performance.

## **Performance Notes**

> * Profiling introduces CPU overhead and extra memory trace allocations. Set profile\_memory=False and with\_stack=False when benchmarking pure kernel timing.

## **Related APIs**

> * torch.profiler.tensorboard\_trace\_handler  
> * torch.cuda.Event

## **Framework Migration Notes**

> * Equivalent to tf.profiler context tracing in TensorFlow.

## **TensorFlow Equivalent**

`tf.profiler.experimental.start('logdir')`  
`# Execution ops`  
`tf.profiler.experimental.stop()`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: torch.profiler, model profiler, pytorch profiler  
> * **Common Search Terms**: how to profile pytorch training, debug gpu bottleneck pytorch, measure memory usage pytorch profiler  
> * **Keywords**: profiler, cpu\_time, cuda\_time, memory, bottleneck  
> * **Frequently Confused With**: standard Python cProfile

## **Related Models**

resnet, vit, transformer, yolo, bert, llama, deepseek

## **Related Patterns**

memory-efficient-training, mixed-precision, device-placement

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/profiler.html](https://pytorch.org/docs/stable/profiler.html)

## **Task**

Export and Analyze Profiling Traces (torch.profiler.tensorboard\_trace\_handler)

## **Problem Solved**

Exports collected PyTorch profiler performance execution traces to disk in Chrome Trace JSON format for visualization in TensorBoard or chrome://tracing.

## **Mental Trigger**

I need to save profiling traces to disk so I can inspect visual timelines in TensorBoard or standard trace viewers.

## **Syntax**

`torch.profiler.tensorboard_trace_handler(dir_name, worker_name=None, use_gzip=False)`

## **Important Parameters**

> * **dir\_name** (str or Path): Destination directory path where trace log files will be exported.  
> * **worker\_name** (str, optional): Unique string identifier for distributed workers (defaults to process hostname).  
> * **use\_gzip** (bool, default=False): Compresses trace output files using gzip format to reduce saved log size.

## **Return Value**

> * **callable**: A trace event handler callback passed directly to on\_trace\_ready in torch.profiler.profile.

## **Example**

`from pathlib import Path`  
`import torch`  
`import torch.nn as nn`

`log_dir = Path("./log_traces")`

`model = nn.Linear(100, 10)`  
`x = torch.randn(32, 100)`

`# Configure profile trace handler callback`  
`trace_handler = torch.profiler.tensorboard_trace_handler(str(log_dir))`

`with torch.profiler.profile(`  
    `activities=[torch.profiler.ProfilerActivity.CPU],`  
    `schedule=torch.profiler.schedule(wait=1, warmup=1, active=2),`  
    `on_trace_ready=trace_handler`  
`) as prof:`  
    `for step in range(4):`  
        `out = model(x)`  
        `loss = out.sum()`  
        `loss.backward()`  
        `prof.step() # Advance profiler schedule`

`print(f"Profiling trace written successfully to directory: {log_dir}")`

## **Use When**

> * Visualizing execution operator timelines, GPU kernel overlaps, and memory allocation profiles in TensorBoard.  
> * Inspecting distributed multi-GPU communication stalls across node workers.

## **Avoid When**

> * High-frequency logging where generating large JSON trace files consumes excessive disk storage.

## **Gotchas**

> * If prof.step() is not called inside the training loop, the schedule handler will not trigger on\_trace\_ready, leaving trace files unwritten.  
> * Inspecting trace JSON files directly in text editors is impractical due to large file sizes; open files in TensorBoard or chrome://tracing instead.  
> * Non-existent trace export directories cause runtime errors if permissions are restricted.

## **Performance Notes**

> * Exporting trace files involves converting internal event buffers into JSON strings, causing a small disk write delay when the profiler completes.

## **Related APIs**

> * torch.profiler.profile  
> * torch.profiler.schedule

## **Framework Migration Notes**

> * Generates trace output files compatible with TensorBoard Profiler plugins, similar to trace loggers generated by TensorFlow Profiler.

## **TensorFlow Equivalent**

`tf.keras.callbacks.TensorBoard(log_dir=log_dir, profile_batch='2, 5')`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: tensorboard trace handler, export chrome trace, export profiler json  
> * **Common Search Terms**: how to view pytorch profile tensorboard, export pytorch trace file, chrome tracing pytorch  
> * **Keywords**: profiler, tensorboard, chrome://tracing, trace\_handler  
> * **Frequently Confused With**: standard TensorBoard summary writers (SummaryWriter)

## **Related Models**

resnet, vit, transformer, llama

## **Related Patterns**

memory-efficient-training, device-placement

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/profiler.html\#torch.profiler.tensorboard\_trace\_handler](https://www.google.com/search?q=https://pytorch.org/docs/stable/profiler.html%23torch.profiler.tensorboard_trace_handler)

## **Task**

Register Forward Hooks (register\_forward\_hook)

## **Problem Solved**

Attaches a custom diagnostic callback to an nn.Module that runs automatically after every forward call, inspecting or modifying output activations without altering source code.

## **Mental Trigger**

I need to capture feature activations after a specific module runs its forward pass without modifying the module's code.

## **Syntax**

`module.register_forward_hook(hook, *, prepend=False, with_kwargs=False, always_call=False)`

## **Important Parameters**

> * **hook** (callable): A callback function matching signature hook(module, input, output) \-\> None or modified\_output.  
> * **prepend** (bool, default=False): If True, adds this hook to the beginning of the execution hook list instead of the end.  
> * **always\_call** (bool, default=False): If True, executes the hook even if forward raises an exception.

## **Return Value**

> * **RemovableHandle**: A handle object used to unregister the hook by calling handle.remove().

## **Example**

`import torch`  
`import torch.nn as nn`

`class Model(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.layer = nn.Linear(5, 3)`

    `def forward(self, x):`  
        `return self.layer(x)`

`model = Model()`  
`captured_activations = []`

`# Define hook callback`  
`def capture_hook(module, input, output):`  
    `captured_activations.append(output.detach())`

`# Register hook on inner layer`  
`handle = model.layer.register_forward_hook(capture_hook)`

`x = torch.randn(2, 5)`  
`_ = model(x)`

`print(f"Captured output tensor shape: {captured_activations[0].shape}")`

`# Unregister hook to prevent memory leaks`  
`handle.remove()`

## **Use When**

> * Extracting intermediate feature maps for visualization, probing, or transfer learning.  
> * Injecting output activation modifications dynamically during forward execution.

## **Avoid When**

> * Modifying activations without returning new tensors explicitly from the hook callback function.

## **Gotchas**

> * Storing returned output tensors directly inside global Python lists without calling .detach() retains references to the autograd computation graph, causing major GPU memory leaks.  
> * Forgetting to call handle.remove() keeps hook references active, causing redundant executions on subsequent forward passes.  
> * Modifying input or output arguments in-place inside hooks can break backpropagation gradient calculations silently.

## **Performance Notes**

> * Hook callback logic runs synchronously on the main execution thread immediately after module computation, introducing small overhead based on callback complexity.

## **Related APIs**

> * torch.nn.Module.register\_forward\_pre\_hook  
> * torch.nn.Module.register\_full\_backward\_hook  
> * torch.utils.hooks.RemovableHandle

## **Framework Migration Notes**

> * Replaces modifying model call() methods or subclassing intermediate Keras models to expose sub-layer feature tensors.

## **TensorFlow Equivalent**

`# Exposing intermediate outputs using Keras Functional API`  
`intermediate_model = tf.keras.Model(inputs=model.input, outputs=model.get_layer('layer_name').output)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: register\_forward\_hook, forward hook, activation hook  
> * **Common Search Terms**: how to extract feature maps pytorch, hook intermediate layer activations, pytorch module hook  
> * **Keywords**: hook, forward, activations, RemovableHandle  
> * **Frequently Confused With**: register\_forward\_pre\_hook

## **Related Models**

resnet, vit, transformer, yolo, bert

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.register\_forward\_hook](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.register_forward_hook)

## **Task**

Register Forward Pre-Hooks (register\_forward\_pre\_hook)

## **Problem Solved**

Attaches a callback function to an nn.Module that executes prior to running the module's forward function, enabling input inspection or argument transformation before processing.

## **Mental Trigger**

I need to inspect or modify the input tensors passed into a module before its forward execution occurs.

## **Syntax**

`module.register_forward_pre_hook(hook, *, prepend=False, with_kwargs=False)`

## **Important Parameters**

> * **hook** (callable): A callback function matching signature hook(module, args) \-\> None or modified\_args.  
> * **prepend** (bool, default=False): If True, prepends this hook to execute prior to other previously registered pre-hooks.  
> * **with\_kwargs** (bool, default=False): If True, hook receives keyword arguments: hook(module, args, kwargs).

## **Return Value**

> * **RemovableHandle**: A handle object used to remove the hook by calling handle.remove().

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(4, 2)`

`def pre_hook_logging(module, inputs):`  
    `print(f"Pre-hook intercepted input tensor with shape: {inputs[0].shape}")`

`# Register pre-hook on linear module`  
`handle = model.register_forward_pre_hook(pre_hook_logging)`

`x = torch.randn(3, 4)`  
`_ = model(x)`

`# Unregister hook when diagnostic completes`  
`handle.remove()`

## **Use When**

> * Sanitizing, norm-scaling, or inspecting layer input tensors before processing.  
> * Dynamically tracking layer input dimensions or timing module execution setup steps.

## **Avoid When**

> * Modifying inputs when downstream modules depend on fixed positional tensor structures without updating keyword arguments appropriately.

## **Gotchas**

> * Input arguments are provided inside a tuple (args). If modifying inputs inside the hook, return them formatted strictly as a tuple: return (modified\_input,).  
> * Returning single tensors directly instead of tuples from pre-hooks raises a TypeError during forward execution.  
> * Forgetting to call handle.remove() causes pre-hooks to execute repeatedly across subsequent iterations.

## **Performance Notes**

> * Low execution overhead. If input transformations are returned, new tensor allocations will consume extra GPU memory buffers.

## **Related APIs**

> * torch.nn.Module.register\_forward\_hook  
> * torch.nn.Module.register\_full\_backward\_hook

## **Framework Migration Notes**

> * No direct equivalent in TensorFlow; requires custom layer wrapping or subclassing execution method logic.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

with\_kwargs parameter added in PyTorch 2.0 to support keyword argument interception in pre-hooks.

## **Search Metadata**

> * **Aliases**: register\_forward\_pre\_hook, forward pre hook, input hook  
> * **Common Search Terms**: pytorch hook module inputs, modify input before forward pass, pre forward hook  
> * **Keywords**: pre\_hook, forward, inputs, RemovableHandle  
> * **Frequently Confused With**: register\_forward\_hook

## **Related Models**

resnet, vit, transformer

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.register\_forward\_pre\_hook](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.register_forward_pre_hook)

## **Task**

Register Full Backward Hooks (register\_full\_backward\_hook)

## **Problem Solved**

Intercepts input and output gradient tensors flowing through a module during backpropagation, enabling gradient inspection, metric tracking, or gradient transformation.

## **Mental Trigger**

I need to inspect or alter gradients flowing through a specific module during backpropagation.

## **Syntax**

`module.register_full_backward_hook(hook, prepend=False)`

## **Important Parameters**

> * **hook** (callable): A callback matching signature hook(module, grad\_input, grad\_output) \-\> None or modified\_grad\_input.  
> * **prepend** (bool, default=False): If True, prepends this backward hook before existing registered backward hooks.

## **Return Value**

> * **RemovableHandle**: A handle object used to unregister the hook by calling handle.remove().

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(3, 1)`

`def grad_inspection_hook(module, grad_input, grad_output):`  
    `print("Backward hook triggered.")`  
    `print(f" Output gradient norm: {grad_output[0].norm().item():.4f}")`  
    `if grad_input[0] is not None:`  
        `print(f" Input gradient norm:  {grad_input[0].norm().item():.4f}")`

`# Register full backward hook`  
`handle = model.register_full_backward_hook(grad_inspection_hook)`

`x = torch.randn(2, 3)`  
`loss = model(x).sum()`  
`loss.backward()`

`# Always unregister hooks when completed`  
`handle.remove()`

## **Use When**

> * Tracking gradient norms across specific modules during backpropagation to debug gradient issues.  
> * Implementing custom gradient modification techniques (like Grad-CAM or selective gradient masking).

## **Avoid When**

> * Using deprecated register\_backward\_hook, which handles complex submodules and non-Tensor outputs unpredictably.

## **Gotchas**

> * grad\_input and grad\_output are tuples containing gradients matching positional inputs and outputs. Elements can be None for arguments that do not require gradients.  
> * Modifying grad\_input inside the hook requires returning a new tuple matching the exact tuple length and structure expected by PyTorch.  
> * Modifying gradients in-place without returning a new tuple will fail to update autograd graph gradients.

## **Performance Notes**

> * Backward hooks execute during autograd backward passes, adding synchronous evaluation overhead to gradient calculations.

## **Related APIs**

> * torch.nn.Module.register\_forward\_hook  
> * torch.Tensor.register\_hook

## **Framework Migration Notes**

> * Replaces custom gradient override functions or tf.RegisterGradient declarations in TensorFlow.

## **TensorFlow Equivalent**

`@tf.custom_gradient`  
`def custom_op(x):`  
    `...`

## **Version Compatibility**

register\_full\_backward\_hook replaced the legacy, deprecated register\_backward\_hook to provide reliable behavior across complex container modules.

## **Search Metadata**

> * **Aliases**: register\_full\_backward\_hook, backward hook, gradient hook  
> * **Common Search Terms**: how to inspect gradients with hook pytorch, register full backward hook example, debug gradients backward pass  
> * **Keywords**: backward, hook, gradients, autograd, grad\_input, grad\_output  
> * **Frequently Confused With**: deprecated register\_backward\_hook, torch.Tensor.register\_hook

## **Related Models**

resnet, vit, transformer, bert, llama, deepseek

## **Related Patterns**

memory-efficient-training, mixed-precision

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

training

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.register\_full\_backward\_hook](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.register_full_backward_hook)

---

