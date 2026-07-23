# **PyTorch Optimizer and Scheduler Cheatsheet**

## **Problem**

Optimize with Stochastic Gradient Descent (optim.SGD)

## **Trigger**

Use SGD when optimizing basic convex or non-convex models, often with momentum or Nesterov acceleration for computer vision baselines.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9, weight_decay=1e-4)`

`x = torch.randn(4, 10)`  
`loss = model(x).sum()`

`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

## **Minimal Notes**

Momentum accelerates gradient vectors in the right directions, reducing oscillating updates. Setting nesterov=True requires momentum \> 0 and dampening \= 0\.

## **Common Bug**

**Issue:** ValueError: Nesterov momentum requires a momentum and zero dampening

**Cause:** Setting nesterov=True without enabling momentum or while leaving default non-zero dampening.

**Quick Fix:** Set momentum=0.9 and dampening=0 when passing nesterov=True.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.SGD.html](https://pytorch.org/docs/stable/generated/torch.optim.SGD.html)

## **Problem**

Optimize with Adam (optim.Adam)

## **Trigger**

Use Adam for rapid convergence on complex architectures or dynamic tasks without extensive manual learning rate tuning.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.Adam(model.parameters(), lr=1e-3, betas=(0.9, 0.999), eps=1e-8)`

`x = torch.randn(4, 10)`  
`loss = model(x).sum()`

`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

## **Minimal Notes**

Adam computes adaptive learning rates for each parameter using first and second moment estimates. L2 regularization in Adam is coupled with gradient updates rather than decoupled weight decay.

## **Common Bug**

**Issue:** Poor generalization when using weight\_decay in Adam for transformers or deep networks.

**Cause:** optim.Adam applies L2 penalty directly to gradients instead of performing true decoupled weight decay.

**Quick Fix:** Switch to optim.AdamW if weight decay is needed with adaptive momentum.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.Adam.html](https://pytorch.org/docs/stable/generated/torch.optim.Adam.html)

## **Problem**

Optimize with AdamW (optim.AdamW)

## **Trigger**

Use AdamW as the default adaptive optimizer for transformers and modern deep learning models requiring weight decay.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)`

`x = torch.randn(4, 10)`  
`loss = model(x).sum()`

`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

## **Minimal Notes**

AdamW implements decoupled weight decay, which decouples parameter decay from gradient momentum updates. This leads to superior regularization and generalization performance compared to standard Adam.

## **Common Bug**

**Issue:** Unintended weight decay applied to bias or layer normalization parameters.

**Cause:** Passing model.parameters() directly applies weight\_decay to all parameters in the model.

**Quick Fix:** Group parameters and set weight\_decay=0.0 for 1D parameters like biases and LayerNorm scales.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.AdamW.html](https://pytorch.org/docs/stable/generated/torch.optim.AdamW.html)

## **Problem**

Optimize with RMSprop (optim.RMSprop)

## **Trigger**

Use RMSprop when training recurrent neural networks or handling non-stationary objectives where moving averages of squared gradients stabilize updates.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.RMSprop(model.parameters(), lr=0.01, alpha=0.99, momentum=0.9)`

`x = torch.randn(4, 10)`  
`loss = model(x).sum()`

`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

## **Minimal Notes**

The alpha parameter controls the smoothing constant for the moving average of squared gradients. Setting centered=True normalizes gradients by an estimate of their variance.

## **Common Bug**

**Issue:** Loss explodes or updates become NaN during training with sparse gradients.

**Cause:** Default eps=1e-8 may be too small, causing division by near-zero moving averages.

**Quick Fix:** Increase eps to 1e-5 or lower the learning rate lr.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.RMSprop.html](https://pytorch.org/docs/stable/generated/torch.optim.RMSprop.html)

## **Problem**

Optimize with Adagrad (optim.Adagrad)

## **Trigger**

Use Adagrad for sparse data features (such as text embeddings) where infrequent features require larger learning rate updates.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Embedding(100, 16)`  
`optimizer = optim.Adagrad(model.parameters(), lr=0.01, lr_decay=0.0, weight_decay=0.0)`

`x = torch.tensor([1, 5, 20])`  
`loss = model(x).sum()`

`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

## **Minimal Notes**

Adagrad accumulates the sum of squared historical gradients to scale learning rates per-parameter. The effective learning rate continually shrinks as training progresses, which can stall late-stage learning.

## **Common Bug**

**Issue:** Training progress completely stalls early in training.

**Cause:** Accumulated historical squared gradients grow too large, causing the effective learning rate to vanish.

**Quick Fix:** Increase initial lr or switch to an adaptive optimizer with exponentially decaying memory like optim.Adam.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.Adagrad.html](https://pytorch.org/docs/stable/generated/torch.optim.Adagrad.html)

## **Problem**

Optimize with LBFGS (optim.LBFGS)

## **Trigger**

Use LBFGS for deterministic optimization on small-scale, memory-constrained structural or scientific modeling tasks.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.LBFGS(model.parameters(), lr=1.0, max_iter=20)`

`x = torch.randn(4, 10)`

`def closure():`  
    `optimizer.zero_grad()`  
    `output = model(x)`  
    `loss = output.sum()`  
    `loss.backward()`  
    `return loss`

`optimizer.step(closure)`

## **Minimal Notes**

LBFGS is a quasi-Newton second-order optimization method that requires a callable closure to re-evaluate the model and loss function multiple times per step. It requires significant memory per parameter to track approximate Hessian history.

## **Common Bug**

**Issue:** TypeError: step() missing 1 required positional argument: 'closure'

**Cause:** Calling optimizer.step() without passing a closure evaluation function.

**Quick Fix:** Define a closure function that clears gradients, calculates loss, executes loss.backward(), and returns loss, then pass it to optimizer.step(closure).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.LBFGS.html](https://pytorch.org/docs/stable/generated/torch.optim.LBFGS.html)

## **Problem**

Create Optimizer Parameter Groups (param\_groups)

## **Trigger**

Use parameter groups to apply distinct hyperparameters (like learning rates or weight decay) to different sets of module parameters.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Sequential(`  
    `nn.Linear(10, 20),`  
    `nn.ReLU(),`  
    `nn.Linear(20, 2)`  
`)`

`optimizer = optim.Adam([`  
    `{'params': model[0].parameters(), 'lr': 1e-4},`  
    `{'params': model[2].parameters(), 'lr': 1e-3}`  
`], lr=1e-2)`

`print(optimizer.param_groups[0]['lr'])`  
`print(optimizer.param_groups[1]['lr'])`

## **Minimal Notes**

optimizer.param\_groups is a list of dictionaries containing individual parameter dicts alongside hyperparameter values. Top-level hyperparameter arguments passed to the optimizer constructor act as defaults for groups that do not specify them.

## **Common Bug**

**Issue:** ValueError: some parameters appear in more than one parameter group

**Cause:** Assigning the same parameter tensor to multiple parameter group dictionaries.

**Quick Fix:** Ensure parameter sets passed to each dictionary in the param\_groups list are mutually exclusive.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/optim.html\#per-parameter-options](https://www.google.com/search?q=https://pytorch.org/docs/stable/optim.html%23per-parameter-options)

## **Problem**

Configure Different Learning Rates per Layer

## **Trigger**

Use layer-wise learning rate decay or differential rates when fine-tuning pretrained models.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`class Net(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.backbone = nn.Linear(10, 10)`  
        `self.head = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.head(self.backbone(x))`

`model = Net()`  
`optimizer = optim.AdamW([`  
    `{'params': model.backbone.parameters(), 'lr': 1e-5},`  
    `{'params': model.head.parameters(), 'lr': 1e-3}`  
`])`

`for group in optimizer.param_groups:`  
    `print(group['lr'])`

## **Minimal Notes**

Setting lower learning rates on early backbone layers prevents catastrophic forgetting of pretrained representations during transfer learning. Schedulers update all groups proportionally unless customized.

## **Common Bug**

**Issue:** Backbone weights change drastically and ruin pretrained features during transfer learning.

**Cause:** Using a single global high learning rate across the entire model instead of configuring separate parameter groups.

**Quick Fix:** Separate backbone and head parameters into distinct parameter groups with lower lr assigned to the backbone.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/optim.html\#per-parameter-options](https://www.google.com/search?q=https://pytorch.org/docs/stable/optim.html%23per-parameter-options)

## **Problem**

Exclude Parameters from Weight Decay

## **Trigger**

Use parameter filtering to exclude 1D tensors (biases, batch norm / layer norm weights) from weight decay to prevent underfitting and training instability.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Sequential(`  
    `nn.Linear(10, 10),`  
    `nn.BatchNorm1d(10),`  
    `nn.Linear(10, 2)`  
`)`

`decay_params = [p for p in model.parameters() if p.ndim >= 2]`  
`no_decay_params = [p for p in model.parameters() if p.ndim < 2]`

`optimizer = optim.AdamW([`  
    `{'params': decay_params, 'weight_decay': 0.01},`  
    `{'params': no_decay_params, 'weight_decay': 0.0}`  
`], lr=1e-3)`

## **Minimal Notes**

Standard regularization practices dictate applying weight decay only to 2D+ weight matrices (like convolutions and linear weights) while excluding biases and normalization parameters.

## **Common Bug**

**Issue:** ValueError: optimizer got an empty parameter list

**Cause:** Failing to correctly list or filter parameters, resulting in an empty list passed to a parameter group.

**Quick Fix:** Ensure comprehension predicates correctly capture parameters and that no parameter group list is empty.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/optim.html\#per-parameter-options](https://www.google.com/search?q=https://pytorch.org/docs/stable/optim.html%23per-parameter-options)

## **Problem**

Apply Step Learning Rate Scheduler (StepLR)

## **Trigger**

Use StepLR to decay the learning rate by a multiplicative factor gamma at fixed epoch intervals (step\_size).

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import StepLR`

`model = nn.Linear(10, 2)`  
`optimizer = optim.SGD(model.parameters(), lr=0.1)`  
`scheduler = StepLR(optimizer, step_size=30, gamma=0.1)`

`for epoch in range(1, 40):`  
    `optimizer.step()`  
    `scheduler.step()`

`print(scheduler.get_last_lr())`

## **Minimal Notes**

scheduler.step() must be called after optimizer.step() at the end of each epoch. gamma defines the reduction multiplier.

## **Common Bug**

**Issue:** Learning rate drops on epoch 0 before model training starts or fails to step properly.

**Cause:** Calling scheduler.step() before optimizer.step() or at the start of the epoch loop.

**Quick Fix:** Always execute optimizer.step() first, followed by scheduler.step() at the end of the epoch loop iteration.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.StepLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.StepLR.html)

## **Problem**

Apply Multi-Step Learning Rate Scheduler (MultiStepLR)

## **Trigger**

Use MultiStepLR to drop the learning rate at specific non-uniform milestone epochs during training.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import MultiStepLR`

`model = nn.Linear(10, 2)`  
`optimizer = optim.SGD(model.parameters(), lr=0.1)`  
`scheduler = MultiStepLR(optimizer, milestones=[30, 80], gamma=0.1)`

`for epoch in range(1, 100):`  
    `optimizer.step()`  
    `scheduler.step()`

`print(scheduler.get_last_lr())`

## **Minimal Notes**

The milestones argument accepts a list of increasing epoch indices at which the learning rate drops. This scheduler is common in classical ImageNet training regimes.

## **Common Bug**

**Issue:** Learning rate does not decrease at expected milestones.

**Cause:** milestones list is unsorted or milestones are provided as relative step counts instead of absolute epoch numbers.

**Quick Fix:** Provide milestones as an ascending list of integers corresponding to exact absolute epoch counts.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.MultiStepLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.MultiStepLR.html)

## **Problem**

Apply Cosine Annealing Scheduler (CosineAnnealingLR)

## **Trigger**

Use CosineAnnealingLR to smoothly decay the learning rate to a minimum value following a cosine curve across total training steps.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import CosineAnnealingLR`

`model = nn.Linear(10, 2)`  
`optimizer = optim.AdamW(model.parameters(), lr=1e-3)`  
`scheduler = CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)`

`for epoch in range(1, 101):`  
    `optimizer.step()`  
    `scheduler.step()`

`print(scheduler.get_last_lr())`

## **Minimal Notes**

T\_max represents the maximum number of iterations or epochs until eta\_min is reached. Setting eta\_min slightly above 0 prevents total optimization stalling at final steps.

## **Common Bug**

**Issue:** Learning rate increases unexpectedly midway or reaches eta\_min prematurely.

**Cause:** Mismatch between T\_max and total training epochs or stepping the scheduler multiple times per epoch.

**Quick Fix:** Set T\_max exactly equal to total planned training epochs when stepping once per epoch.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.CosineAnnealingLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.CosineAnnealingLR.html)

## **Problem**

Apply Cosine Annealing with Warm Restarts (CosineAnnealingWarmRestarts)

## **Trigger**

Use CosineAnnealingWarmRestarts (SGDR) to periodically reset the learning rate to escape local minima during long training runs.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import CosineAnnealingWarmRestarts`

`model = nn.Linear(10, 2)`  
`optimizer = optim.AdamW(model.parameters(), lr=1e-3)`  
`scheduler = CosineAnnealingWarmRestarts(optimizer, T_0=10, T_mult=2, eta_min=1e-6)`

`for epoch in range(1, 31):`  
    `optimizer.step()`  
    `scheduler.step()`

`print(scheduler.get_last_lr())`

## **Minimal Notes**

T\_0 sets the number of iterations for the first restart period. T\_mult scales the period duration after each restart.

## **Common Bug**

**Issue:** Learning rate resets at unexpected epoch counts.

**Cause:** Passing fractional step values or misunderstanding how T\_mult scales restart periods.

**Quick Fix:** Account for period expansion when calculating total epochs (e.g., T\_0=10, T\_mult=2 resets at epoch 10, 30, 70).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.CosineAnnealingWarmRestarts.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.CosineAnnealingWarmRestarts.html)

## **Problem**

Apply Exponential Learning Rate Scheduler (ExponentialLR)

## **Trigger**

Use ExponentialLR to decay the learning rate exponentially by a constant factor gamma at every epoch step.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import ExponentialLR`

`model = nn.Linear(10, 2)`  
`optimizer = optim.SGD(model.parameters(), lr=0.1)`  
`scheduler = ExponentialLR(optimizer, gamma=0.95)`

`for epoch in range(1, 10):`  
    `optimizer.step()`  
    `scheduler.step()`

`print(scheduler.get_last_lr())`

## **Minimal Notes**

Learning rate is multiplied by gamma every epoch. Choose gamma close to 1.0 (e.g., 0.95 to 0.99) to avoid decaying the rate too rapidly.

## **Common Bug**

**Issue:** Learning rate decays to near-zero within a few epochs.

**Cause:** Setting gamma too low (e.g., 0.1 instead of 0.95).

**Quick Fix:** Use high decimal values like gamma=0.98 for gentle continuous exponential decay.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.ExponentialLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.ExponentialLR.html)

## **Problem**

Apply Linear Learning Rate Scheduler (LinearLR)

## **Trigger**

Use LinearLR to linearly scale the learning rate up (warmup) or down (decay) over a fixed number of initial steps.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import LinearLR`

`model = nn.Linear(10, 2)`  
`optimizer = optim.AdamW(model.parameters(), lr=1e-3)`  
`scheduler = LinearLR(optimizer, start_factor=0.1, end_factor=1.0, total_iters=10)`

`for step in range(10):`  
    `optimizer.step()`  
    `scheduler.step()`

`print(scheduler.get_last_lr())`

## **Minimal Notes**

start\_factor and end\_factor are multiplicative factors applied to the initial optimizer learning rate. total\_iters specifies the total duration of the linear transition.

## **Common Bug**

**Issue:** Learning rate continues linearly scaling beyond the intended warmup or decay window.

**Cause:** Continuing to call scheduler.step() past total\_iters without capping or chaining schedulers.

**Quick Fix:** After total\_iters, LinearLR maintains end\_factor; chain it with another scheduler using SequentialLR if subsequent decay is needed.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.LinearLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.LinearLR.html)

## **Problem**

Apply Sequential Learning Rate Scheduling (SequentialLR)

## **Trigger**

Use SequentialLR to chain multiple schedulers (e.g., linear warmup followed by cosine annealing decay) sequentially during training.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import LinearLR, CosineAnnealingLR, SequentialLR`

`model = nn.Linear(10, 2)`  
`optimizer = optim.AdamW(model.parameters(), lr=1e-3)`

`sched1 = LinearLR(optimizer, start_factor=0.1, total_iters=10)`  
`sched2 = CosineAnnealingLR(optimizer, T_max=90, eta_min=1e-6)`

`scheduler = SequentialLR(optimizer, schedulers=[sched1, sched2], milestones=[10])`

`for epoch in range(100):`  
    `optimizer.step()`  
    `scheduler.step()`

`print(scheduler.get_last_lr())`

## **Minimal Notes**

milestones defines the exact step counts where control transitions to the next scheduler in the schedulers list. Individual sub-schedulers do not need manual stepping; step only the outer SequentialLR.

## **Common Bug**

**Issue:** ValueError: milestone should be smaller than T\_max or incorrect sub-scheduler stepping behavior.

**Cause:** Calling step() on individual sub-schedulers directly instead of only calling scheduler.step().

**Quick Fix:** Pass sub-schedulers to SequentialLR and call scheduler.step() solely on the parent SequentialLR instance.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.SequentialLR.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.SequentialLR.html)

## **Problem**

Reduce Learning Rate on Plateau (ReduceLROnPlateau)

## **Trigger**

Use ReduceLROnPlateau to dynamically drop learning rate when a validation metric (e.g., loss or accuracy) stops improving.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`  
`from torch.optim.lr_scheduler import ReduceLROnPlateau`

`model = nn.Linear(10, 2)`  
`optimizer = optim.SGD(model.parameters(), lr=0.1)`  
`scheduler = ReduceLROnPlateau(optimizer, mode='min', factor=0.1, patience=5)`

`val_loss = 0.5`  
`for epoch in range(10):`  
    `optimizer.step()`  
    `scheduler.step(val_loss)`

`print(optimizer.param_groups[0]['lr'])`

## **Minimal Notes**

Unlike other schedulers, ReduceLROnPlateau.step() strictly requires passing a validation metric value. get\_last\_lr() is unavailable; inspect optimizer.param\_groups\[0\]\['lr'\] directly.

## **Common Bug**

**Issue:** TypeError: step() missing 1 required positional argument: 'metrics' or AttributeError: 'ReduceLROnPlateau' object has no attribute 'get\_last\_lr'

**Cause:** Calling scheduler.step() without passing the validation loss metric, or calling scheduler.get\_last\_lr().

**Quick Fix:** Pass validation metric to scheduler.step(val\_loss) and inspect current learning rate via optimizer.param\_groups\[0\]\['lr'\].

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.lr\_scheduler.ReduceLROnPlateau.html](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.ReduceLROnPlateau.html)

## **Problem**

Reset Gradients (optimizer.zero\_grad)

## **Trigger**

Use zero\_grad to clear parameter .grad attributes before executing the backward pass to prevent gradient accumulation across iterations.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.AdamW(model.parameters(), lr=1e-3)`

`x = torch.randn(4, 10)`  
`loss = model(x).sum()`

`optimizer.zero_grad(set_to_none=True)`  
`loss.backward()`

## **Minimal Notes**

Setting set\_to\_none=True deallocates gradient tensor memory instead of writing zero values, reducing memory overhead and improving execution speed.

## **Common Bug**

**Issue:** Gradients accumulate across batches leading to explosive parameter updates and instability.

**Cause:** Forgetting to call optimizer.zero\_grad() before loss.backward() inside the training loop.

**Quick Fix:** Always call optimizer.zero\_grad(set\_to\_none=True) prior to calling loss.backward().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.zero\_grad.html](https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.zero_grad.html)

## **Problem**

Update Model Parameters (optimizer.step)

## **Trigger**

Use optimizer.step to update model weights based on computed .grad attributes after calling backward().

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.SGD(model.parameters(), lr=0.01)`

`x = torch.randn(4, 10)`  
`loss = model(x).sum()`

`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

## **Minimal Notes**

optimizer.step() iterates over all parameter groups and updates tensors in-place using their accumulated .grad values and optimizer state.

## **Common Bug**

**Issue:** Model parameters do not update during training iteration.

**Cause:** Calling optimizer.step() before loss.backward(), meaning parameter .grad attributes are None or zero.

**Quick Fix:** Ensure execution order is strictly: optimizer.zero\_grad(), loss.backward(), and then optimizer.step().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.step.html](https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.step.html)

## **Problem**

Save and Restore Optimizer State (optimizer.state\_dict / load\_state\_dict)

## **Trigger**

Use state\_dict and load\_state\_dict to serialize and restore optimizer hyperparameters and momentum buffers for checkpointing and resuming training.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.AdamW(model.parameters(), lr=1e-3)`

`x = torch.randn(4, 10)`  
`loss = model(x).sum()`  
`optimizer.zero_grad()`  
`loss.backward()`  
`optimizer.step()`

`state = optimizer.state_dict()`

`new_optimizer = optim.AdamW(model.parameters(), lr=1e-3)`  
`new_optimizer.load_state_dict(state)`

## **Minimal Notes**

An optimizer's state\_dict contains hyperparameters and momentum/step buffers for each parameter. The model structure must match when loading a restored optimizer state dict.

## **Common Bug**

**Issue:** ValueError: loaded state dict contains a parameter group that doesn't match the size of optimizer's group

**Cause:** Restoring optimizer state dict into an optimizer instance constructed with a different model architecture or parameter group layout.

**Quick Fix:** Instantiate the optimizer with the exact same model architecture and parameter group layout before calling load\_state\_dict().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.load\_state\_dict.html](https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.load_state_dict.html)

---

