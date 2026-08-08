# **TensorFlow Autograd API Documentation**

# **TensorFlow Automatic Differentiation and Computation Graph Operations (02\_autograd.md)**

## **1\. Record Operations with tf.GradientTape**

### **Problem Solved**

Tracks forward-pass operations on tensors inside a context manager to build an execution graph for automatic differentiation.

### **Mental Trigger**

I need to record tensor operations so I can compute derivatives with respect to trainable variables.

### **Primary APIs**

> * tf.GradientTape  
> * tf.Variable

### **Syntax**

`with tf.GradientTape() as tape:`  
    `y = f(x)`  
`grad = tape.gradient(y, x)`

### **Important Parameters**

> * persistent: Boolean flag indicating whether to keep the tape resources after a single gradient() call. Default is False.  
> * watch\_accessed\_variables: Boolean flag controlling automatic tracking of all tf.Variable instances accessed inside the scope. Default is True.

### **Return Value**

Returns a tf.GradientTape context manager instance. When exited, recorded operations can be queried using tape.gradient().

### **Example**

`import tensorflow as tf`

`x = tf.Variable(3.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `y = x ** 2 + 2 * x + 1`

`grad = tape.gradient(y, x)`  
`print(f"Gradient dy/dx at x=3.0: {grad.numpy()}") # Output: 8.0`

### **Use When**

Executing forward passes in custom training loops where loss gradients must be calculated relative to model parameters.

### **Avoid When**

Performing inference or evaluation passes where gradient tracking consumes unnecessary memory and compute.

### **Gotchas**

> * Tape resources are released immediately after the first tape.gradient() call unless persistent=True is specified.  
> * Passing Python constants or immutable tf.Tensor objects without explicitly calling tape.watch() yields None for gradients.  
> * Performing operations outside the with tf.GradientTape() block prevents those operations from being recorded.

### **Performance Notes**

> * Allocates additional memory during the forward pass to cache intermediate activation tensors required for backpropagation.  
> * Minimal overhead when executed inside a compiled @tf.function.

### **Related APIs**

> * tf.GradientTape.watch  
> * tf.Variable

### **PyTorch Equivalent**

Standard PyTorch autograd graph tracking during forward pass (enabled when tensors have requires\_grad=True).

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tf.GradientTape, automatic differentiation context, autograd recorder  
> * **Common Search Terms**: tensorflow record gradients, gradienttape basic usage, tf2 tape gradient  
> * **Keywords**: autograd, gradienttape, reverse-mode differentiation, computation graph  
> * **Frequently Confused With**: GradientTape vs tf.function

### **Related Models**

> * resnet  
> * transformer  
> * logistic-regression

### **Related Patterns**

> * memory-efficient-training  
> * gradient-accumulation

### **Related Workflows**

> * image-classification-pipeline  
> * transfer-learning-for-vision

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape](https://www.tensorflow.org/api_docs/python/tf/GradientTape)

## **2\. Watch Non-Trainable Tensors (GradientTape.watch)**

### **Problem Solved**

Forces tf.GradientTape to track operations on immutable tf.Tensor objects or non-trainable variables that are not watched automatically.

### **Mental Trigger**

I need to compute gradients with respect to an input data tensor rather than a model trainable variable.

### **Primary APIs**

> * tf.GradientTape.watch

### **Syntax**

`with tf.GradientTape() as tape:`  
    `tape.watch(tensor_x)`  
    `y = f(tensor_x)`

### **Important Parameters**

> * tensor: A tf.Tensor or list of tf.Tensor objects to explicitly record on the tape.

### **Return Value**

Returns None. Mutates the tape context to begin recording operations on the specified tensors.

### **Example**

`import tensorflow as tf`

`x = tf.constant(4.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `tape.watch(x)`  
    `y = tf.sin(x)`

`grad = tape.gradient(y, x)`  
`print(f"Gradient d(sin(x))/dx at x=4.0: {grad.numpy()}") # Output: cos(4.0)`

### **Use When**

Computing input gradients for adversarial attack generation, feature attribution methods like Integrated Gradients, or physics-informed neural networks.

### **Avoid When**

Working solely with tf.Variable objects inside a tape where watch\_accessed\_variables=True already handles tracking automatically.

### **Gotchas**

> * tape.watch() must be called **before** the operations involving the target tensor are executed inside the tape context.  
> * Watching high-dimensional input tensors increases tape memory consumption significantly by retaining input activations.

### **Performance Notes**

> * Incurs memory overhead proportional to tensor size because intermediate activations dependent on watched tensors must be retained.

### **Related APIs**

> * tf.GradientTape  
> * tf.constant

### **PyTorch Equivalent**

tensor.requires\_grad\_(True) or retain\_grad()

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tape.watch, watch constant tensor, record tf.Tensor  
> * **Common Search Terms**: how to compute gradient of input tensor tensorflow, tf gradienttape watch constant  
> * **Keywords**: watch, non-trainable, constant tensor, adversarial gradients  
> * **Frequently Confused With**: tape.watch vs watch\_accessed\_variables

### **Related Models**

> * resnet  
> * vit

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * image-classification-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#watch](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23watch)

## **3\. Control Automatic Variable Watching (watch\_accessed\_variables)**

### **Problem Solved**

Disables automatic tracking of all accessed tf.Variable objects inside tf.GradientTape to enforce selective variable recording.

### **Mental Trigger**

I want fine-grained control over which trainable variables are tracked to avoid tracking unwanted variables and reduce memory footprint.

### **Primary APIs**

> * tf.GradientTape

### **Syntax**

`with tf.GradientTape(watch_accessed_variables=False) as tape:`  
    `tape.watch(specific_var)`  
    `y = f(specific_var, skipped_var)`

### **Important Parameters**

> * watch\_accessed\_variables: Set to False to prevent the tape from automatically watching every accessed tf.Variable.

### **Return Value**

Returns a tf.GradientTape instance with automatic variable watching disabled.

### **Example**

`import tensorflow as tf`

`v1 = tf.Variable(2.0, dtype=tf.float32)`  
`v2 = tf.Variable(5.0, dtype=tf.float32)`

`with tf.GradientTape(watch_accessed_variables=False) as tape:`  
    `tape.watch(v1)`  
    `y = v1 * v2`

`grad_v1, grad_v2 = tape.gradient(y, [v1, v2])`  
`print(f"grad_v1: {grad_v1.numpy()}, grad_v2: {grad_v2}") # Output: grad_v1: 5.0, grad_v2: None`

### **Use When**

Implementing GANs, multi-task learning, or sub-network training where only a subset of variables must be updated in a given step.

### **Avoid When**

Standard training loops where all trainable variables in a model should receive gradients.

### **Gotchas**

> * Variables not explicitly watched with tape.watch() will produce None when calling tape.gradient().  
> * Disabling variable watching does not prevent custom operations inside the tape from executing normally.

### **Performance Notes**

> * Reduces tape graph size and memory footprint by skipping graph construction for ignored variables.

### **Related APIs**

> * tf.GradientTape.watch

### **PyTorch Equivalent**

Setting param.requires\_grad \= False on selective parameters prior to forward execution.

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: watch\_accessed\_variables, disable autowatch, selective tape watching  
> * **Common Search Terms**: tf gradienttape don't watch all variables, disable variable watch tensorflow  
> * **Keywords**: selective tracking, watch\_accessed\_variables, sub-graph optimization  
> * **Frequently Confused With**: watch\_accessed\_variables vs tf.stop\_gradient

### **Related Models**

> * gan  
> * transformer

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * transfer-learning-for-vision

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#\_\_init](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23__init)\_\_

## **4\. Use Persistent GradientTape (persistent=True)**

### **Problem Solved**

Retains execution graph resources after tape.gradient() is invoked, enabling multiple gradient evaluations from a single forward pass.

### **Mental Trigger**

I need to evaluate gradients for multiple independent outputs or targets from a single forward execution graph.

### **Primary APIs**

> * tf.GradientTape  
> * del tape

### **Syntax**

`with tf.GradientTape(persistent=True) as tape:`  
    `y1 = f1(x)`  
    `y2 = f2(x)`  
`g1 = tape.gradient(y1, x)`  
`g2 = tape.gradient(y2, x)`  
`del tape`

### **Important Parameters**

> * persistent: Set to True to allow multiple calls to tape.gradient().

### **Return Value**

Returns a persistent tf.GradientTape instance. Requires manual garbage collection using del tape.

### **Example**

`import tensorflow as tf`

`x = tf.Variable(3.0, dtype=tf.float32)`

`with tf.GradientTape(persistent=True) as tape:`  
    `y1 = x ** 2`  
    `y2 = x ** 3`

`dy1_dx = tape.gradient(y1, x)`  
`dy2_dx = tape.gradient(y2, x)`

`print(f"dy1/dx: {dy1_dx.numpy()}, dy2/dx: {dy2_dx.numpy()}") # Output: 6.0, 27.0`

`# Explicitly free memory`  
`del tape`

### **Use When**

Computing separate gradients for actor and critic losses, multi-objective optimization, or independent regularization terms.

### **Avoid When**

Standard single-loss training loops. Using persistent tapes without releasing them causes severe memory leaks.

### **Gotchas**

> * Python garbage collection does not automatically release internal graph memory until del tape is executed.  
> * Forgetting to delete a persistent tape inside a long-running training loop results in an eventual Out-Of-Memory (OOM) crash.

### **Performance Notes**

> * Holds intermediate activation tensors in memory until del tape is called, significantly increasing peak memory usage.

### **Related APIs**

> * tf.GradientTape.gradient

### **PyTorch Equivalent**

loss.backward(retain\_graph=True)

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: persistent=True, reusable gradient tape, multiple gradient calls  
> * **Common Search Terms**: call tape gradient multiple times tensorflow, persistent gradienttape memory leak  
> * **Keywords**: persistent, multi-gradient, del tape, retain graph  
> * **Frequently Confused With**: Persistent GradientTape vs standard non-persistent GradientTape

### **Related Models**

> * transformer  
> * yolo

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * object-detection-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#\_\_init](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23__init)\_\_

## **5\. Compute Gradients (GradientTape.gradient)**

### **Problem Solved**

Calculates derivatives of target tensors with respect to source variables using reverse-mode automatic differentiation.

### **Mental Trigger**

I need to evaluate the symbolic derivative of my loss with respect to my model weights.

### **Primary APIs**

> * tf.GradientTape.gradient  
> * tf.UnconnectedGradients

### **Syntax**

`grads = tape.gradient(target, sources, output_gradients=None, unconnected_gradients=tf.UnconnectedGradients.NONE)`

### **Important Parameters**

> * target: A tf.Tensor or nested structure of tensors to differentiate.  
> * sources: A tf.Variable or nested structure of variables/tensors acting as differentiation inputs.  
> * output\_gradients: Optional vector-jacobian products passed in for custom backward passes.  
> * unconnected\_gradients: Specifies behavior when target and sources are disconnected (NONE or ZERO). Default is NONE.

### **Return Value**

Returns a tensor or nested structure of tensors matching the structure of sources. Contains None for unconnected variables when unconnected\_gradients=NONE.

### **Example**

`import tensorflow as tf`

`w = tf.Variable(2.0, dtype=tf.float32)`  
`b = tf.Variable(1.0, dtype=tf.float32)`  
`x = tf.constant(3.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `y = w * x + b`

`grads = tape.gradient(y, [w, b])`  
`print(f"dw: {grads[0].numpy()}, db: {grads[1].numpy()}") # Output: dw: 3.0, db: 1.0`

### **Use When**

Extracting computed gradients to pass into an optimizer (optimizer.apply\_gradients) or performing custom gradient manipulation.

### **Avoid When**

Executing higher-order differentiation without nesting tapes properly.

### **Gotchas**

> * Calling gradient() on a non-persistent tape destroys the tape context immediately.  
> * If target is not a scalar, TensorFlow automatically sums the elements of target before taking the gradient, unless output\_gradients is provided.

### **Performance Notes**

> * Performs reverse-mode traversal of the recorded computation graph. Execution time scales with graph depth and source tensor count.

### **Related APIs**

> * tf.GradientTape  
> * tf.UnconnectedGradients

### **PyTorch Equivalent**

torch.autograd.grad() or loss.backward()

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tape.gradient, calculate gradients, autograd evaluation  
> * **Common Search Terms**: tensorflow compute gradients, tape gradient target sources, tf2 gradient computation  
> * **Keywords**: reverse-mode differentiation, target, sources, output\_gradients  
> * **Frequently Confused With**: tape.gradient vs tape.jacobian

### **Related Models**

> * resnet  
> * bert  
> * logistic-regression

### **Related Patterns**

> * gradient-accumulation

### **Related Workflows**

> * image-classification-pipeline  
> * text-classification-pipeline-classical-encoder

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#gradient](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23gradient)

## **6\. Compute Multiple Gradients**

### **Problem Solved**

Evaluates derivatives for a list or structure of multiple target outputs with respect to a single source variable in a unified call.

### **Mental Trigger**

I have multiple loss components and need to compute gradients for each component relative to a specific parameter.

### **Primary APIs**

> * tf.GradientTape.gradient

### **Syntax**

`grads = tape.gradient([target1, target2], source)`

### **Important Parameters**

> * target: A list or tuple of target tensors.  
> * sources: A single tensor or structure of source tensors.

### **Return Value**

Returns gradients corresponding to the sum of targets with respect to each source.

### **Example**

`import tensorflow as tf`

`x = tf.Variable(2.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `loss1 = x ** 2`  
    `loss2 = 3 * x`

`# Computes gradient of (loss1 + loss2) wrt x`  
`grad_sum = tape.gradient([loss1, loss2], x)`  
`print(f"Combined gradient: {grad_sum.numpy()}") # Output: 2*2 + 3 = 7.0`

### **Use When**

Computing composite loss gradients where targets are combined additively before backpropagation.

### **Avoid When**

Target gradients must be kept strictly isolated without implicit summation (use a persistent tape with separate gradient() calls instead).

### **Gotchas**

> * Passing a list of targets implicitly sums their gradients together. It does not return a list of individual target gradients.

### **Performance Notes**

> * Efficiently traverses the graph once for the combined sum rather than performing multiple reverse passes.

### **Related APIs**

> * tf.GradientTape.gradient

### **PyTorch Equivalent**

Passing a tuple of target tensors to torch.autograd.grad(..., grad\_outputs=...)

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: multiple target gradients, list targets tape.gradient, combined loss gradients  
> * **Common Search Terms**: tensorflow gradient of multiple losses, tf gradienttape list of targets  
> * **Keywords**: composite loss, multi-target autograd, gradient summation  
> * **Frequently Confused With**: Multiple target list vs persistent tape separate evaluation

### **Related Models**

> * yolo  
> * transformer

### **Related Patterns**

> * gradient-accumulation

### **Related Workflows**

> * object-detection-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#gradient](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23gradient)

## **7\. Compute Gradients for Multiple Variables**

### **Problem Solved**

Computes partial derivatives of a scalar loss with respect to complex nested structures (lists, dicts, tuples) of source variables.

### **Mental Trigger**

I need to compute loss gradients for all trainable parameters in my model layer tree in a single call.

### **Primary APIs**

> * tf.GradientTape.gradient  
> * tf.Module.trainable\_variables

### **Syntax**

`grads = tape.gradient(loss, model.trainable_variables)`

### **Important Parameters**

> * target: A scalar target loss tensor.  
> * sources: A list, dictionary, or nested structure of tf.Variable objects.

### **Return Value**

Returns a structure matching sources (e.g., list of tensors or dict of tensors) containing the corresponding calculated gradients.

### **Example**

`import tensorflow as tf`

`var_dict = {`  
    `'w': tf.Variable(3.0, dtype=tf.float32),`  
    `'b': tf.Variable(1.0, dtype=tf.float32)`  
`}`  
`x = tf.constant(2.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `y = var_dict['w'] * x + var_dict['b']`

`grads = tape.gradient(y, var_dict)`  
`print(f"Grad w: {grads['w'].numpy()}, Grad b: {grads['b'].numpy()}") # Output: Grad w: 2.0, Grad b: 1.0`

### **Use When**

Mapping gradients directly to nested variable representations across complex layer hierarchies.

### **Avoid When**

Passing non-nested generator objects that cannot be mirrored in the returned structure.

### **Gotchas**

> * The returned gradient structure strictly mirrors the input sources layout. If sources is a dict, returned gradients form a dict with identical keys.

### **Performance Notes**

> * Batches reverse pass computation across all requested variables efficiently in a single graph traversal.

### **Related APIs**

> * tf.GradientTape.gradient

### **PyTorch Equivalent**

torch.autograd.grad(loss, model.parameters())

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: dictionary gradient computation, nested structure gradients, trainable\_variables gradients  
> * **Common Search Terms**: tensorflow gradient for dict of variables, tf2 model trainable variables gradient  
> * **Keywords**: nested structure, variable dict, model parameters  
> * **Frequently Confused With**: Single variable gradient vs variable structure gradient

### **Related Models**

> * resnet  
> * bert  
> * llama

### **Related Patterns**

> * gradient-accumulation

### **Related Workflows**

> * image-classification-pipeline  
> * transfer-learning-for-vision

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#gradient](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23gradient)

## **8\. Handle Unconnected Gradients (unconnected\_gradients)**

### **Problem Solved**

Controls whether tape.gradient() returns None or a zero tensor when target and source variables have no graph connectivity.

### **Mental Trigger**

My loss function does not connect to every model variable, but my optimizer requires explicit zero tensors instead of None.

### **Primary APIs**

> * tf.UnconnectedGradients  
> * tf.GradientTape.gradient

### **Syntax**

`grad = tape.gradient(loss, var, unconnected_gradients=tf.UnconnectedGradients.ZERO)`

### **Important Parameters**

> * unconnected\_gradients: Accepts tf.UnconnectedGradients.NONE (default) or tf.UnconnectedGradients.ZERO.

### **Return Value**

Returns tf.UnconnectedGradients.ZERO as a zero tensor matching the shape and dtype of the source variable, or None if NONE is chosen.

### **Example**

`import tensorflow as tf`

`v1 = tf.Variable(2.0, dtype=tf.float32)`  
`v2 = tf.Variable(5.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `y = v1 ** 2 # v2 is unconnected to y`

`grad_none = tape.gradient(y, v2, unconnected_gradients=tf.UnconnectedGradients.NONE)`  
`grad_zero = tape.gradient(y, v2, unconnected_gradients=tf.UnconnectedGradients.ZERO)`

`print(f"NONE mode: {grad_none}") # Output: None`  
`print(f"ZERO mode: {grad_zero.numpy()}") # Output: 0.0`

### **Use When**

Building robust training loops where conditional execution branches leave certain variables disconnected, preventing NoneType errors in optimizers.

### **Avoid When**

Debugging graph connectivity issues where None is explicitly required to diagnose broken graph links.

### **Gotchas**

> * Using unconnected\_gradients=tf.UnconnectedGradients.ZERO masks broken computation graphs by silently replacing missing gradients with zeros.

### **Performance Notes**

> * Allocates zero-filled tensors for disconnected variables, slightly increasing memory footprint compared to returning None.

### **Related APIs**

> * tf.UnconnectedGradients  
> * tf.GradientTape.gradient

### **PyTorch Equivalent**

Manual handling after torch.autograd.grad() by checking if g is None: g \= torch.zeros\_like(p)

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tf.UnconnectedGradients, handle none gradients, replace none with zero tf  
> * **Common Search Terms**: tensorflow gradient none fix, tf unconnected\_gradients zero, gradient tape returns none  
> * **Keywords**: unconnected\_gradients, ZERO, NONE, disconnected variable  
> * **Frequently Confused With**: Disconnected gradient vs zero-valued gradient

### **Related Models**

> * transformer  
> * gan

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * production-llm-cost-latency-optimization

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/UnconnectedGradients](https://www.tensorflow.org/api_docs/python/tf/UnconnectedGradients)

## **9\. Compute Jacobian (GradientTape.jacobian)**

### **Problem Solved**

Calculates the full matrix of all first-order partial derivatives for vector-valued outputs with respect to vector-valued inputs.

### **Mental Trigger**

I need to evaluate the full Jacobian matrix mapping an N-dimensional output to an M-dimensional input.

### **Primary APIs**

> * tf.GradientTape.jacobian

### **Syntax**

`jac = tape.jacobian(target, sources, unconnected_gradients=tf.UnconnectedGradients.NONE, experimental_use_pfor=True)`

### **Important Parameters**

> * target: Output tensor of shape \[Y\_1, ..., Y\_n\].  
> * sources: Input tensor or structure of shape \[X\_1, ..., X\_m\].  
> * experimental\_use\_pfor: Boolean indicating whether to use parallel for loops (pfor) to accelerate computation. Default is True.

### **Return Value**

Returns a tensor of shape \[Y\_1, ..., Y\_n, X\_1, ..., X\_m\] containing the exact first-order partial derivatives.

### **Example**

`import tensorflow as tf`

`x = tf.Variable([2.0, 3.0], dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `y = tf.stack([x[0]**2, x[0]*x[1], x[1]**3]) # Output shape [3]`

`jac = tape.jacobian(y, x)`  
`print(f"Jacobian shape: {jac.shape}") # Output: (3, 2)`  
`print(f"Jacobian matrix:\n{jac.numpy()}")`  
`# [[4.0, 0.0],`  
`#  [3.0, 2.0],`  
`#  [0.0, 27.0]]`

### **Use When**

Analyzing sensitivity matrices, computing dynamical system state transitions, or constructing custom optimization algorithms (e.g., Gauss-Newton).

### **Avoid When**

Scalar loss backpropagation. Use tape.gradient() instead because full Jacobians are computationally prohibitive for large models.

### **Gotchas**

> * Computing Jacobians on high-dimensional feature maps (e.g., intermediate CNN activations) causes massive memory usage.  
> * experimental\_use\_pfor=True can fail for operations lacking vectorization implementations, falling back to sequential execution.

### **Performance Notes**

> * Uses parallel loop vectorization (pfor) when enabled. Computational time and memory scale quadratically with tensor dimensions.

### **Related APIs**

> * tf.GradientTape.batch\_jacobian  
> * tf.GradientTape.gradient

### **PyTorch Equivalent**

torch.autograd.functional.jacobian()

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tape.jacobian, full jacobian matrix, vector-to-vector derivative  
> * **Common Search Terms**: tensorflow compute jacobian matrix, tf gradienttape jacobian example, vector autograd tensorflow  
> * **Keywords**: jacobian, partial derivatives, pfor, sensitivity matrix  
> * **Frequently Confused With**: tape.jacobian vs tape.batch\_jacobian

### **Related Models**

> * resnet  
> * logistic-regression

### **Related Patterns**

> * tensor-broadcasting

### **Related Workflows**

> * image-classification-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#jacobian](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23jacobian)

## **10\. Compute Batch Jacobian (GradientTape.batch\_jacobian)**

### **Problem Solved**

Computes sample-wise Jacobians across a batch dimension efficiently without calculating redundant cross-batch sample derivatives.

### **Mental Trigger**

I need individual sample-level Jacobians for a batch of inputs without paying the cost of full cross-sample derivatives.

### **Primary APIs**

> * tf.GradientTape.batch\_jacobian

### **Syntax**

`batch_jac = tape.batch_jacobian(target, source, experimental_use_pfor=True)`

### **Important Parameters**

> * target: Tensor of shape \[B, Y\_1, ..., Y\_n\] where B is the batch dimension.  
> * source: Tensor of shape \[B, X\_1, ..., X\_m\] matching the batch dimension B.  
> * experimental\_use\_pfor: Uses vectorized parallel-for execution when set to True.

### **Return Value**

Returns a tensor of shape \[B, Y\_1, ..., Y\_n, X\_1, ..., X\_m\]. Cross-terms where sample i targets depend on sample j inputs are ignored.

### **Example**

`import tensorflow as tf`

`# Batch of 2 samples, each of dimension 3`  
`x = tf.Variable([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `y = x ** 2 # Elementwise square along batch`

`batch_jac = tape.batch_jacobian(y, x)`  
`print(f"Batch Jacobian shape: {batch_jac.shape}") # Output: (2, 3, 3)`  
`print(f"Sample 0 Jacobian:\n{batch_jac[0].numpy()}")`  
`# [[2.0, 0.0, 0.0],`  
`#  [0.0, 4.0, 0.0],`  
`#  [0.0, 0.0, 6.0]]`

### **Use When**

Evaluating per-sample sensitivity, sample-wise gradient norms, or differential privacy metrics across mini-batches.

### **Avoid When**

Outputs depend across batch elements (e.g., global Batch Normalization layers without frozen statistics).

### **Gotchas**

> * Target and source tensors must share identical leading batch dimension sizes B.

### **Performance Notes**

> * Bypasses evaluation of *B*×(*B*−1) zero-value cross-sample blocks, offering dramatic speedup over tape.jacobian().

### **Related APIs**

> * tf.GradientTape.jacobian

### **PyTorch Equivalent**

Using torch.vmap combined with torch.autograd.functional.jacobian

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tape.batch\_jacobian, per-sample jacobian, vectorized sample jacobian  
> * **Common Search Terms**: tensorflow per sample jacobian, tf batch\_jacobian example, sample-wise sensitivity tensorflow  
> * **Keywords**: batch\_jacobian, sample-wise, batch dimension, pfor  
> * **Frequently Confused With**: batch\_jacobian vs jacobian

### **Related Models**

> * resnet  
> * vit

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * image-classification-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#batch\_jacobian](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23batch_jacobian)

## **11\. Compute Higher-order Gradients (Nested GradientTape)**

### **Problem Solved**

Computes second-order or higher-order derivatives (such as Hessians or gradient penalties) by nesting tf.GradientTape contexts.

### **Mental Trigger**

I need to compute the derivative of a gradient (e.g., WGAN-GP gradient penalty or Hessian-vector products).

### **Primary APIs**

> * tf.GradientTape (nested contexts)

### **Syntax**

`with tf.GradientTape() as outer_tape:`  
    `with tf.GradientTape() as inner_tape:`  
        `y = f(x)`  
    `first_grad = inner_tape.gradient(y, x)`  
`second_grad = outer_tape.gradient(first_grad, x)`

### **Important Parameters**

> * Nested tape scoping ensures operations in the inner gradient computation are tracked on the outer tape.

### **Return Value**

Returns high-order derivative tensors representing second (or higher) derivatives.

### **Example**

`import tensorflow as tf`

`x = tf.Variable(3.0, dtype=tf.float32)`

`with tf.GradientTape() as outer_tape:`  
    `with tf.GradientTape() as inner_tape:`  
        `y = x ** 3 # y = x^3`  
    `dy_dx = inner_tape.gradient(y, x) # dy/dx = 3*x^2 = 27`  
`d2y_dx2 = outer_tape.gradient(dy_dx, x) # d^2y/dx^2 = 6*x = 18`

`print(f"First derivative dy/dx: {dy_dx.numpy()}") # Output: 27.0`  
`print(f"Second derivative d2y/dx2: {d2y_dx2.numpy()}") # Output: 18.0`

### **Use When**

Implementing Wasserstein GAN with Gradient Penalty (WGAN-GP), Model-Agnostic Meta-Learning (MAML), or second-order optimization algorithms.

### **Avoid When**

First-order optimization routines due to exponential computation and memory costs.

### **Gotchas**

> * The inner tape evaluation inner\_tape.gradient() must occur **inside** the with outer\_tape: context block to track first-order operations.  
> * Non-differentiable operations in the inner forward pass will produce None for second derivatives.

### **Performance Notes**

> * Memory consumption scales rapidly because intermediate computational graphs for derivatives must be preserved.

### **Related APIs**

> * tf.GradientTape.gradient

### **PyTorch Equivalent**

Calling torch.autograd.grad(..., create\_graph=True)

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: nested gradienttape, second order derivatives, hessian tensorflow  
> * **Common Search Terms**: how to compute second derivative tensorflow, tf nested gradienttape example, gradient penalty autograd  
> * **Keywords**: higher-order, nested tape, second derivative, Hessian, WGAN-GP  
> * **Frequently Confused With**: Single tape vs nested tapes

### **Related Models**

> * gan  
> * transformer

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * transfer-learning-for-vision

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape](https://www.tensorflow.org/api_docs/python/tf/GradientTape)

## **12\. Define Custom Gradient (tf.custom\_gradient)**

### **Problem Solved**

Allows users to override the default automatic differentiation behavior of a function with custom forward and backward pass math.

### **Mental Trigger**

The standard autograd derivative is numerically unstable (e.g., log(0)), or I need custom gradient logic.

### **Primary APIs**

> * @tf.custom\_gradient

### **Syntax**

`@tf.custom_gradient`  
`def my_op(x):`  
    `def grad(dy):`  
        `return dy * custom_derivative(x)`  
    `return forward_output, grad`

### **Important Parameters**

> * Decorates a function returning a tuple (forward\_output, grad\_fn).  
> * grad\_fn receives upstream gradients dy and returns downstream gradients matching input argument shapes.

### **Return Value**

Returns the forward pass computation result while registering the custom backward function with TensorFlow autograd.

### **Example**

`import tensorflow as tf`

`@tf.custom_gradient`  
`def log1pexp(x):`  
    `# Forward pass: log(1 + exp(x))`  
    `e = tf.exp(x)`  
    `y = tf.math.log(1.0 + e)`  
      
    `def grad(dy):`  
        `# Numerically stable derivative: 1 / (1 + exp(-x))`  
        `return dy * (1.0 / (1.0 + tf.exp(-x)))`  
      
    `return y, grad`

`x = tf.Variable(100.0, dtype=tf.float32) # Standard exp(100) overflows float32`  
`with tf.GradientTape() as tape:`  
    `y = log1pexp(x)`

`grad = tape.gradient(y, x)`  
`print(f"Numerically stable custom gradient: {grad.numpy()}") # Output: 1.0`

### **Use When**

Preventing numerical underflow/overflow (e.g., custom Softmax or log-sum-exp implementations) or implementing non-differentiable ops with surrogate gradients.

### **Avoid When**

Standard TensorFlow operations already provide stable, optimized derivatives.

### **Gotchas**

> * The number and structure of tensors returned by grad\_fn must exactly match the arguments accepted by the decorated forward function.  
> * Forgetting to multiply downstream calculations by upstream gradient dy breaks chain rule backpropagation.

### **Performance Notes**

> * Replaces automatically generated backpropagation subgraphs with optimized user-defined CUDA/C++ mathematical operations.

### **Related APIs**

> * tf.stop\_gradient  
> * tf.identity

### **PyTorch Equivalent**

Subclassing torch.autograd.Function and overriding forward() and backward() static methods.

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: @tf.custom\_gradient, custom backward pass, override autograd  
> * **Common Search Terms**: custom gradient tensorflow 2, tf custom\_gradient example, stable backward pass tensorflow  
> * **Keywords**: custom\_gradient, numerical stability, surrogate gradient, chain rule  
> * **Frequently Confused With**: @tf.custom\_gradient vs tf.stop\_gradient

### **Related Models**

> * transformer  
> * deepseek

### **Related Patterns**

> * mixed-precision

### **Related Workflows**

> * production-llm-cost-latency-optimization

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/custom\_gradient](https://www.tensorflow.org/api_docs/python/tf/custom_gradient)

## **13\. Override Gradient Behavior**

### **Problem Solved**

Modifies intermediate gradient flows by injecting transformations like clipping, quantization, or straight-through estimators inside backward passes.

### **Mental Trigger**

I need to implement a Straight-Through Estimator (STE) or clip intermediate gradients without altering forward calculations.

### **Primary APIs**

> * @tf.custom\_gradient  
> * tf.clip\_by\_norm  
> * tf.identity

### **Syntax**

`@tf.custom_gradient`  
`def ste_quantizer(x):`  
    `y = tf.round(x) # Non-differentiable forward pass`  
    `def grad(dy):`  
        `return dy # Pass gradient through unchanged (STE)`  
    `return y, grad`

### **Important Parameters**

> * None. Logic is encapsulated within the custom grad function.

### **Return Value**

Returns modified forward activation while altering backpropagated gradient values during autograd traversal.

### **Example**

`import tensorflow as tf`

`@tf.custom_gradient`  
`def straight_through_threshold(x):`  
    `# Forward step function (threshold at 0)`  
    `y = tf.cast(x > 0.0, dtype=tf.float32)`  
      
    `def grad(dy):`  
        `# Identity gradient pass-through`  
        `return dy`  
          
    `return y, grad`

`x = tf.Variable(-0.5, dtype=tf.float32)`  
`with tf.GradientTape() as tape:`  
    `y = straight_through_threshold(x)`

`grad = tape.gradient(y, x)`  
`print(f"Forward output: {y.numpy()}, Straight-Through Gradient: {grad.numpy()}")`  
`# Output: Forward output: 0.0, Straight-Through Gradient: 1.0`

### **Use When**

Training quantized neural networks (QNNs), binary neural networks (BNNs), or discrete decision layers using Straight-Through Estimators.

### **Avoid When**

Standard continuous differentiable layers where exact backpropagation math is required.

### **Gotchas**

> * Oversimplified surrogate gradients can lead to optimization divergence if backward approximations mismatch forward dynamics too severely.

### **Performance Notes**

> * Eliminates computation of zero derivatives for non-differentiable operations by substituting simple pass-through tensor operations.

### **Related APIs**

> * tf.custom\_gradient  
> * tf.stop\_gradient

### **PyTorch Equivalent**

Using torch.autograd.Function for straight-through estimators or registering tensor backward hooks using register\_hook().

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: straight through estimator tf, gradient modification, override backward pass  
> * **Common Search Terms**: straight through estimator tensorflow example, custom gradient clipping tf2  
> * **Keywords**: straight-through estimator, quantization, surrogate gradient, custom backward  
> * **Frequently Confused With**: Custom gradient vs gradient clipping in optimizers

### **Related Models**

> * vit  
> * bert

### **Related Patterns**

> * mixed-precision

### **Related Workflows**

> * production-llm-cost-latency-optimization

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/custom\_gradient](https://www.tensorflow.org/api_docs/python/tf/custom_gradient)

## **14\. Stop Gradient Flow (tf.stop\_gradient)**

### **Problem Solved**

Treats a tensor as a constant during automatic differentiation, stopping backpropagation through its historical computation graph.

### **Mental Trigger**

I want to freeze gradient propagation into a teacher network, target Q-network, or intermediate feature representation.

### **Primary APIs**

> * tf.stop\_gradient

### **Syntax**

`detached_tensor = tf.stop_gradient(input_tensor)`

### **Important Parameters**

> * input: A tf.Tensor whose computational history should be detached from autograd graph tracking.

### **Return Value**

Returns a tf.Tensor with identical content and shape as input, but detached from any upstream computational graph.

### **Example**

`import tensorflow as tf`

`w = tf.Variable(2.0, dtype=tf.float32)`  
`x = tf.constant(3.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `intermediate = w * x`  
    `# Detach intermediate from graph`  
    `stopped_intermediate = tf.stop_gradient(intermediate)`  
    `y = stopped_intermediate ** 2`

`grad = tape.gradient(y, w)`  
`print(f"Gradient wrt w after stop_gradient: {grad}") # Output: None`

### **Use When**

Implementing Deep Q-Learning target updates, actor-critic algorithms, teacher-student distillation loss terms, or self-supervised contrastive learning (e.g., SimSiam).

### **Avoid When**

Gradient must flow continuously back to earlier model layers.

### **Gotchas**

> * tf.stop\_gradient returns a new tensor handle. Passing the original un-detached tensor in subsequent equations allows gradient flow to continue.

### **Performance Notes**

> * Reduces peak memory by allowing early garbage collection of intermediate activation graphs upstream of the stopped boundary.

### **Related APIs**

> * tf.identity  
> * tf.GradientTape

### **PyTorch Equivalent**

tensor.detach()

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tf.stop\_gradient, detach tensor tensorflow, freeze graph branch  
> * **Common Search Terms**: how to detach tensor in tensorflow, tf stop\_gradient example, freeze target network gradient tf2  
> * **Keywords**: stop\_gradient, detach, freeze weights, target network  
> * **Frequently Confused With**: tf.stop\_gradient vs trainable=False on Keras layers

### **Related Models**

> * resnet  
> * gpt

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * transfer-learning-for-vision

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/stop\_gradient](https://www.tensorflow.org/api_docs/python/tf/stop_gradient)

## **15\. Execute Without Gradient Recording**

### **Problem Solved**

Temporarily pauses gradient tracking inside an active tf.GradientTape block to perform auxiliary computations without adding them to the graph.

### **Mental Trigger**

I am inside a GradientTape block but want to execute side computations, metrics, or logging without tracking overhead.

### **Primary APIs**

> * tf.GradientTape.stop\_recording

### **Syntax**

`with tf.GradientTape() as tape:`  
    `y = f(x)`  
    `with tape.stop_recording():`  
        `# Untracked side operations`  
        `metric = compute_metric(y)`

### **Important Parameters**

> * Context manager block that accepts no explicit arguments.

### **Return Value**

Context manager that temporarily suspends operation recording on the enclosing tf.GradientTape.

### **Example**

`import tensorflow as tf`

`x = tf.Variable(3.0, dtype=tf.float32)`

`with tf.GradientTape() as tape:`  
    `y = x ** 2`  
    `with tape.stop_recording():`  
        `# Side operation inside tape scope`  
        `logging_val = x * 10.0`  
    `z = y + logging_val # logging_val treated as constant`

`grad_x = tape.gradient(z, x)`  
`print(f"dz/dx (excludes logging_val path): {grad_x.numpy()}") # Output: 2*3 = 6.0`

### **Use When**

Computing intermediate monitoring metrics, running diagnostic checks, or executing state updates within custom layer tape execution blocks.

### **Avoid When**

Entire code blocks can be moved completely outside the with tf.GradientTape(): scope.

### **Gotchas**

> * Tensors created inside stop\_recording() acts as constants if used in subsequent tracked computations.

### **Performance Notes**

> * Saves memory and graph execution latency by omitting untracked intermediate operation nodes from the tape.

### **Related APIs**

> * tf.GradientTape  
> * tf.stop\_gradient

### **PyTorch Equivalent**

with torch.no\_grad(): block nested inside a forward pass.

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tape.stop\_recording, pause gradient tape, suspend autograd recording  
> * **Common Search Terms**: pause gradienttape recording tensorflow, tf2 stop\_recording example, temporarily disable gradient tape  
> * **Keywords**: stop\_recording, context manager, pause autograd, untracked ops  
> * **Frequently Confused With**: tape.stop\_recording() vs tf.stop\_gradient()

### **Related Models**

> * transformer  
> * resnet

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * image-classification-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#stop\_recording](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23stop_recording)

## **16\. Inspect Gradient Availability**

### **Problem Solved**

Queries watched variables and detects disconnected graph branches to debug None gradient return values.

### **Mental Trigger**

tape.gradient() returned None, and I need to inspect which variables were actively watched by the tape.

### **Primary APIs**

> * tf.GradientTape.watched\_variables

### **Syntax**

`watched_vars = tape.watched_variables()`

### **Important Parameters**

> * None. Called directly on an active tf.GradientTape instance.

### **Return Value**

Returns a tuple of all tf.Variable objects currently tracked by the tape instance in order of access.

### **Example**

`import tensorflow as tf`

`v1 = tf.Variable(1.0, name="v1")`  
`v2 = tf.Variable(2.0, name="v2")`

`with tf.GradientTape(watch_accessed_variables=False) as tape:`  
    `tape.watch(v1)`  
    `y = v1 * 2.0`  
    `# v2 is not watched`

`watched = tape.watched_variables()`  
`print(f"Watched variable names: {[v.name for v in watched]}") # Output: ['v1:0']`

### **Use When**

Debugging custom training steps where variable updates fail unexpectedly due to missing gradient graph linkages.

### **Avoid When**

Production training loops (calling inspect methods incurs unnecessary runtime inspection overhead).

### **Gotchas**

> * watched\_variables() only reports variables that were both accessed and watched. It does not guarantee a mathematical graph connection exists between those variables and the loss target.

### **Performance Notes**

> * Diagnostic inspection tool only. Should be stripped from high-performance production code.

### **Related APIs**

> * tf.GradientTape.watch

### **PyTorch Equivalent**

Checking tensor.requires\_grad and tensor.grad\_fn on candidate tensors.

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: tape.watched\_variables, inspect watched variables, debug none gradients  
> * **Common Search Terms**: tensorflow inspect watched variables, why gradient is none tensorflow, debug gradienttape variables  
> * **Keywords**: watched\_variables, debugging, none gradient, inspection  
> * **Frequently Confused With**: watched\_variables() vs active graph tracing inspection

### **Related Models**

> * resnet  
> * bert

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * image-classification-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape\#watched\_variables](https://www.google.com/search?q=https://www.tensorflow.org/api_docs/python/tf/GradientTape%23watched_variables)

## **17\. Inference Without GradientTape**

### **Problem Solved**

Runs forward model passes without instantiating tf.GradientTape contexts to minimize latency and eliminate memory overhead.

### **Mental Trigger**

I am running inference or validation evaluation and must execute the model with zero autograd memory footprint.

### **Primary APIs**

> * Direct functional/layer execution without tf.GradientTape

### **Syntax**

`predictions = model(inputs, training=False)`

### **Important Parameters**

> * training=False: Flag passed to models or layers to enforce evaluation behavior (e.g., frozen Dropout and Batch Normalization stats).

### **Return Value**

Returns model output tensors generated without tracking intermediate tape history.

### **Example**

`import tensorflow as tf`

`# Mock layer execution`  
`w = tf.Variable([[2.0], [3.0]], dtype=tf.float32)`  
`x = tf.constant([[1.0, 2.0]], dtype=tf.float32)`

`# Forward pass executed directly without tape wrapper`  
`y_pred = tf.matmul(x, w)`  
`print(f"Inference output: {y_pred.numpy()}") # Output: [[8.0]]`

### **Use When**

Running validation passes, test set evaluation, or production serving pipelines.

### **Avoid When**

Executing training steps where weight updates are required.

### **Gotchas**

> * Omitting tf.GradientTape prevents calculating gradients later for that execution pass.

### **Performance Notes**

> * Provides maximum execution speed and minimum memory consumption by skipping activation caching completely.

### **Related APIs**

> * tf.keras.Model.\_\_call\_\_

### **PyTorch Equivalent**

with torch.no\_grad(): or with torch.inference\_mode(): context blocks.

### **Version Compatibility**

In TensorFlow 2.x, eager execution does not track gradients unless explicitly wrapped in a tf.GradientTape context.

### **Search Metadata**

> * **Aliases**: tf2 inference mode, execution without tape, zero autograd overhead  
> * **Common Search Terms**: tensorflow run inference without gradients, tf no grad equivalent, disable gradient tracking tensorflow  
> * **Keywords**: inference, no\_grad, zero overhead, forward pass  
> * **Frequently Confused With**: training=False vs omitting tf.GradientTape

### **Related Models**

> * resnet  
> * vit  
> * llama

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * production-llm-cost-latency-optimization

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * hardware-selection-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape](https://www.tensorflow.org/api_docs/python/tf/GradientTape)

## **18\. Differentiate Between Training and Inference Contexts**

### **Problem Solved**

Structures model execution pipelines to handle conditional gradient recording and layer behavior between training and evaluation phases cleanly.

### **Mental Trigger**

I need a unified function structure that switches dynamically between training (with autograd) and inference modes.

### **Primary APIs**

> * tf.GradientTape  
> * Python conditional execution (if training:)

### **Syntax**

`def forward_step(x, training=True):`  
    `if training:`  
        `with tf.GradientTape() as tape:`  
            `out = model(x, training=True)`  
        `return out, tape`  
    `else:`  
        `out = model(x, training=False)`  
        `return out, None`

### **Important Parameters**

> * training: Boolean flag indicating whether to instantiate gradient recording and enable training-specific operations.

### **Return Value**

Returns model outputs along with an active tape during training, or output alone during inference.

### **Example**

`import tensorflow as tf`

`x = tf.constant([[1.0, 2.0]], dtype=tf.float32)`  
`w = tf.Variable([[0.5], [0.5]], dtype=tf.float32)`

`def step(inputs, is_training=True):`  
    `if is_training:`  
        `with tf.GradientTape() as tape:`  
            `outputs = tf.matmul(inputs, w)`  
        `return outputs, tape`  
    `return tf.matmul(inputs, w), None`

`# Training call`  
`train_out, tape = step(x, is_training=True)`  
`grad = tape.gradient(train_out, w)`  
`print(f"Train Grad:\n{grad.numpy()}")`

`# Inference call`  
`infer_out, _ = step(x, is_training=False)`  
`print(f"Infer Out: {infer_out.numpy()}")`

### **Use When**

Building unified custom trainer classes, evaluation suites, or multi-phase pipeline runners.

### **Avoid When**

Separate dedicated function implementations for training and evaluation are cleaner and easier to maintain.

### **Gotchas**

> * Ensure layer flags (like training=True/False in Dropout or BatchNorm) match the gradient tape wrapping context.

### **Performance Notes**

> * Ensures zero gradient allocation overhead during evaluation branches.

### **Related APIs**

> * tf.GradientTape

### **PyTorch Equivalent**

Combining model.train() / model.eval() with with torch.no\_grad():

### **Version Compatibility**

No significant changes in TensorFlow 2.x.

### **Search Metadata**

> * **Aliases**: training vs inference context, conditional autograd, tf step conditional tape  
> * **Common Search Terms**: tensorflow switch training inference gradient, tf2 conditional gradienttape  
> * **Keywords**: training context, inference context, conditional execution, dropout mode  
> * **Frequently Confused With**: Model training argument vs GradientTape context existence

### **Related Models**

> * resnet  
> * bert

### **Related Patterns**

> * memory-efficient-training

### **Related Workflows**

> * image-classification-pipeline

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape](https://www.tensorflow.org/api_docs/python/tf/GradientTape)

## **19\. Compute Gradients Inside tf.function**

### **Problem Solved**

Compiles automatic differentiation graphs into optimized static graph traces for accelerated GPU/TPU execution.

### **Mental Trigger**

I want to speed up my custom autograd training loop using static graph compilation with @tf.function.

### **Primary APIs**

> * @tf.function  
> * tf.GradientTape

### **Syntax**

`@tf.function`  
`def train_step(x, y):`  
    `with tf.GradientTape() as tape:`  
        `pred = model(x)`  
        `loss = loss_fn(y, pred)`  
    `grads = tape.gradient(loss, model.trainable_variables)`  
    `return loss, grads`

### **Important Parameters**

> * @tf.function(jit\_compile=True): Optionally enables XLA compilation for further acceleration of autograd operations.

### **Return Value**

Returns compiled graph execution results (loss and gradients) with symbolic execution speedups.

### **Example**

`import tensorflow as tf`

`v = tf.Variable(2.0, dtype=tf.float32)`

`@tf.function`  
`def compiled_train_step(x):`  
    `with tf.GradientTape() as tape:`  
        `y = v * x`  
    `grad = tape.gradient(y, v)`  
    `return y, grad`

`x_in = tf.constant(5.0, dtype=tf.float32)`  
`y_val, g_val = compiled_train_step(x_in)`  
`print(f"Compiled output: y={y_val.numpy()}, grad={g_val.numpy()}") # Output: y=10.0, grad=5.0`

### **Use When**

Optimizing custom training loops for maximum production speed across GPUs, TPUs, or distributed clusters.

### **Avoid When**

Debugging autograd logic. Debugging python code inside compiled graph tracing is significantly harder.

### **Gotchas**

> * Variables must be created **outside** the @tf.function block. Creating tf.Variable objects inside a @tf.function decorated method raises a ValueError.  
> * Python side effects (like standard print()) execute only once during initial graph tracing.

### **Performance Notes**

> * Replaces Python execution overhead with fused XLA graph kernels, substantially increasing throughput.

### **Related APIs**

> * @tf.function  
> * tf.GradientTape

### **PyTorch Equivalent**

torch.compile() wrapping model training steps.

### **Version Compatibility**

Default graph execution model in TensorFlow 2.x when performance compilation is requested.

### **Search Metadata**

> * **Aliases**: gradienttape in tf.function, compiled autograd, static graph gradients  
> * **Common Search Terms**: how to use gradienttape inside tf.function, tf.function compute gradients fast, tf2 compiled train step  
> * **Keywords**: tf.function, tracing, graph compilation, XLA, train\_step  
> * **Frequently Confused With**: Eager GradientTape vs @tf.function compiled GradientTape

### **Related Models**

> * resnet  
> * transformer  
> * llama

### **Related Patterns**

> * memory-efficient-training  
> * mixed-precision

### **Related Workflows**

> * image-classification-pipeline  
> * production-llm-cost-latency-optimization

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/function](https://www.tensorflow.org/api_docs/python/tf/function)

## **20\. Automatic Differentiation Best Practices**

### **Problem Solved**

Structures production automatic differentiation pipelines to minimize memory footprint, prevent memory leaks, avoid invalid gradient updates, and maximize GPU utilization.

### **Mental Trigger**

I want to ensure my custom gradient pipeline is production-ready, memory-efficient, and free of autograd bugs.

### **Primary APIs**

> * tf.GradientTape  
> * tf.stop\_gradient  
> * tf.UnconnectedGradients

### **Syntax**

`# 1. Scope tape strictly around forward operations`  
`with tf.GradientTape() as tape:`  
    `loss = compute_loss(model, inputs)`

`# 2. Compute gradients immediately`  
`grads = tape.gradient(loss, model.trainable_variables, unconnected_gradients=tf.UnconnectedGradients.ZERO)`

`# 3. Explicitly free persistent tape if used`  
`# del persistent_tape`

### **Important Parameters**

> * unconnected\_gradients=tf.UnconnectedGradients.ZERO: Prevents None bugs in gradient processing pipelines.

### **Return Value**

N/A. Architectural patterns for robust automatic differentiation.

### **Example**

`import tensorflow as tf`

`class CleanTrainer(tf.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.w = tf.Variable(2.0, name="w")`

    `@tf.function`  
    `def train_step(self, x, y_true):`  
        `# Keep tape context minimal`  
        `with tf.GradientTape() as tape:`  
            `y_pred = self.w * x`  
            `loss = tf.reduce_mean(tf.square(y_true - y_pred))`  
              
        `grads = tape.gradient(`  
            `loss,`   
            `self.trainable_variables,`  
            `unconnected_gradients=tf.UnconnectedGradients.ZERO`  
        `)`  
        `return loss, grads`

`trainer = CleanTrainer()`  
`loss, grads = trainer.train_step(tf.constant(3.0), tf.constant(10.0))`  
`print(f"Clean step loss: {loss.numpy()}, grad: {grads[0].numpy()}")`

### **Use When**

Designing production training software, custom model frameworks, or library architectures in TensorFlow 2.21.0.

### **Avoid When**

Writing quick single-file exploratory scripts where code longevity and memory optimization are unnecessary.

### **Gotchas**

> * Wrapping non-differentiable setup code inside tf.GradientTape increases memory overhead unnecessarily.  
> * Forgetting to call del tape on persistent tapes creates cumulative long-term memory leaks.  
> * Using NumPy operations inside a GradientTape context silently breaks autograd tracking.

### **Performance Notes**

> * Keeping tape scopes tight minimizes active memory allocation windows for intermediate tensors.

### **Related APIs**

> * tf.GradientTape  
> * tf.custom\_gradient

### **PyTorch Equivalent**

Clean autograd practices: tight torch.enable\_grad() scopes, calling .detach(), and releasing graph references.

### **Version Compatibility**

Applies to modern TensorFlow 2.21.0 production standards.

### **Search Metadata**

> * **Aliases**: autograd best practices, efficient gradienttape, production tensorflow autograd  
> * **Common Search Terms**: tensorflow autograd best practices, optimize gradienttape memory, clean tf2 gradient loop  
> * **Keywords**: best practices, memory management, leak prevention, tight scoping  
> * **Frequently Confused With**: Ad-hoc experimental scripts vs production autograd patterns

### **Related Models**

> * resnet  
> * transformer  
> * llama

### **Related Patterns**

> * memory-efficient-training  
> * gradient-accumulation

### **Related Workflows**

> * image-classification-pipeline  
> * production-llm-cost-latency-optimization

### **Related Cheatsheet**

autograd

### **Related Decision Guides**

> * precision-tradeoffs-guide  
> * hardware-selection-guide

### **Official Documentation**

[https://www.tensorflow.org/api\_docs/python/tf/GradientTape](https://www.tensorflow.org/api_docs/python/tf/GradientTape)

---

