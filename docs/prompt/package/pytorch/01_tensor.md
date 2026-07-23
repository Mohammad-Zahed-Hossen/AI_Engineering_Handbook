# Generate Production-Ready AENS PyTorch Package Module — Tensor Operations (01_tensor.md)

This module owns **only Tensor Operations**. Do not generate content outside this scope.

Generate a production-ready Markdown file for **01_tensor.md** containing implementation tasks that map directly into AENS Package JSON format.

---

# Tasks to Generate

Generate **exactly** the following 28 tasks. Do not add, remove, merge, or rename tasks.

### Tensor Creation
1. Create Tensor from Python Sequence (`torch.tensor`)
2. Create Tensor from Existing Data avoiding copies (`torch.as_tensor`)
3. Create Tensor from NumPy Array with Zero-Copy (`torch.from_numpy`)
4. Create Zero-Filled Tensor (`torch.zeros` / `torch.zeros_like`)
5. Create One-Filled Tensor (`torch.ones` / `torch.ones_like`)
6. Create Uninitialized Tensor Memory (`torch.empty` / `torch.empty_like`)
7. Create Constant-Filled Tensor (`torch.full` / `torch.full_like`)
8. Create Random Tensor (`torch.rand` / `torch.randn` / `torch.randint`)
9. Create Ranged Tensor Sequences (`torch.arange` / `torch.linspace`)

### Tensor Inspection
10. Inspect Tensor Properties (`shape`, `dtype`, `device`, `layout`, `ndim`, `numel`, `stride`, `is_contiguous`)

### Tensor Manipulation & Reshaping
11. Reshape Contiguous Tensor View (`torch.view` / `view_as`)
12. Reshape Tensor with Copy/View Fallback (`torch.reshape` / `reshape_as`)
13. Flatten Tensor Dimensions (`torch.flatten`)
14. Squeeze and Unsqueeze Dimensions (`torch.squeeze` / `torch.unsqueeze`)
15. Permute and Transpose Dimensions (`torch.permute` / `torch.transpose`)
16. Enforce Memory Contiguity (`torch.contiguous`)
17. Clone Tensor Memory and Storage (`torch.clone`)

### Tensor Combination & Selection
18. Concatenate Tensors along Existing Dimension (`torch.cat`)
19. Stack Tensors along New Dimension (`torch.stack`)
20. Split Tensor into Chunks or Sections (`torch.split` / `torch.chunk`)
21. Select and Gather Tensors (`torch.index_select` / `torch.gather` / `torch.scatter` / `torch.take_along_dim`)

### Tensor Mathematics & Masking
22. Element-wise Arithmetic and In-place Operations (`add`, `sub`, `mul`, `div`, `add_`)
23. Matrix Multiplication Operations (`torch.matmul` / `torch.mm` / `torch.bmm`)
24. Tensor Reduction Operations (`torch.sum` / `torch.mean` / `torch.max` / `torch.min` / `torch.argmax`)
25. Conditional Selection and Coordinate Grids (`torch.where` / `torch.meshgrid`)

### Broadcasting & Memory Expansion
26. Expand Tensor Dimensions without Copying (`torch.expand` / `expand_as`)
27. Repeat Tensor Elements with Allocation (`torch.repeat`)

### Device & Dtype Management
28. Device Placement and Precision Casting (`to`, `cpu`, `cuda`, `mps`, `float`, `half`, `bfloat16`, `non_blocking`)

---

# AENS Ownership Rules

This module owns implementation knowledge related exclusively to **PyTorch tensors**.

**Include**: Tensor creation, inspection, manipulation, reshaping, combination, selection, element-wise math, reductions, matrix ops, broadcasting, memory contiguity, cloning, and device/dtype management.

**Do NOT include**: Autograd (`backward`, `.grad`, `detach`, `no_grad`, `inference_mode`), Neural Network layers (`torch.nn`), Loss functions, Optimizers, DataLoader, Training loops, Mixed precision (`torch.amp`), Distributed training, Serialization (`torch.save`/`load`), Compilation (`torch.compile`), or TorchVision.

---

# Task Schema

Every task must follow this exact section structure:

## Task
[Exact task title from the list above]

## Problem Solved
One sentence describing the practical engineering problem.

## Mental Trigger
One short sentence from an engineer's perspective (e.g. "I need to convert a NumPy array to a tensor without allocating new memory.")

## Syntax
Complete API signature.

## Important Parameters
Up to 5 commonly modified parameters.

## Return Value
Brief description of returned object and storage behavior.

## Example
Minimal but runnable example code. Only import NumPy when required. Must execute cleanly in PyTorch 2.x.

## Use When
Practical engineering scenarios for this API.

## Avoid When
When another API or pattern is preferable.

## Gotchas
3–5 implementation pitfalls (e.g., shared memory mutations, non-contiguous view failures, unintended memory allocations).

## Performance Notes
Mention only performance characteristics that materially affect production usage.

## Related APIs
List closely related PyTorch tensor APIs.

## Framework Migration Notes
Brief migration advice for engineers coming from NumPy or TensorFlow.

## TensorFlow Equivalent
Semantically accurate API-to-API mapping with true storage/copy semantics note where applicable.

## Version Compatibility
Only include this section if the API has meaningful behavior changes, deprecations, security updates, or migration notes.
Otherwise state: `No significant changes in modern PyTorch releases.`

## Search Metadata
- **Aliases**: Common alternative terms or shorthand
- **Common Search Terms**: Terms engineers type when searching
- **Keywords**: Semantic search tags
- **Frequently Confused With**: Commonly mistaken APIs (e.g., `torch.view` vs `torch.reshape`, `torch.expand` vs `torch.repeat`)

## Related Models
Return only relevant IDs chosen from:
`resnet`, `vit`, `transformer`, `yolo`, `bert`, `roberta`, `t5`, `bart`, `gpt`, `llama`, `qwen`, `gemma`, `deepseek`, `logistic-regression`, `random-forest`, `xgboost`

## Related Patterns
Return only relevant IDs chosen from:
`device-placement`, `tensor-broadcasting`, `memory-efficient-training`, `feature-fusion`, `mixed-precision`, `gradient-accumulation`, `kv-cache`

## Related Workflows
Return only relevant IDs chosen from:
`image-classification-pipeline`, `object-detection-pipeline`, `semantic-segmentation-pipeline`, `text-classification-pipeline-classical-encoder`, `transfer-learning-for-vision`, `production-llm-cost-latency-optimization`

## Related Cheatsheet
Return only relevant IDs chosen from:
`tensor-creation`, `tensor-manipulation`, `tensor-math`, `device-management`

## Related Decision Guides
Return only relevant IDs chosen from:
`precision-tradeoffs-guide`, `hardware-selection-guide`

## Official Documentation
Direct URL to official PyTorch API documentation.
