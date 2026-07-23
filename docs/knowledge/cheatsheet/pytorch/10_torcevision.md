# **TorchVision Cheatsheet Module Generation**

## **Problem**

Load Built-in Vision Dataset (torchvision.datasets)

## **Trigger**

I need to load a standard computer vision benchmark dataset for training or evaluation.

## **Snippet**

`import torchvision.transforms as T`  
`from torchvision.datasets import CIFAR10`

`transform = T.Compose([`  
    `T.ToTensor(),`  
`])`

`dataset = CIFAR10(`  
    `root="./data",`  
    `train=True,`  
    `download=True,`  
    `transform=transform,`  
`)`

`image, label = dataset[0]`

## **Minimal Notes**

Built-in datasets return a tuple of (image, target) for a given index. The transform callable runs on each PIL image before returning the sample.

## **Common Bug**

**Issue:** TypeError: batch must contain tensors, numbers, dicts or lists; found \<class 'PIL.Image.Image'\>

**Cause:** Passing a dataset directly to a DataLoader without applying T.ToTensor() in the transform pipeline.

**Quick Fix:** Add T.ToTensor() (or v2.ToImage() with v2.ToDtype()) to your dataset transform argument.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/datasets.html](https://pytorch.org/vision/stable/datasets.html)

## **Problem**

Create Custom Image Dataset (torchvision.datasets.ImageFolder)

## **Trigger**

I need to load a custom image dataset organized in class-based directory folders.

## **Snippet**

`import torchvision.transforms as T`  
`from torchvision.datasets import ImageFolder`

`transform = T.Compose([`  
    `T.Resize((224, 224)),`  
    `T.ToTensor(),`  
`])`

`dataset = ImageFolder(`  
    `root="path/to/data/train",`  
    `transform=transform,`  
`)`

`classes = dataset.classes`  
`class_to_idx = dataset.class_to_idx`

## **Minimal Notes**

ImageFolder expects subdirectory names to represent individual class labels containing corresponding image files. Class indices are assigned alphabetically based on subfolder names.

## **Common Bug**

**Issue:** RuntimeError: Found 0 files in subfolders of ...

**Cause:** The root directory path does not contain class-named subdirectories, or images are placed directly in the root folder.

**Quick Fix:** Structure the directory as root/class\_a/img1.jpg and root/class\_b/img2.jpg instead of placing images directly inside root.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/generated/torchvision.datasets.ImageFolder.html](https://pytorch.org/vision/stable/generated/torchvision.datasets.ImageFolder.html)

## **Problem**

Download and Cache Dataset (download=True)

## **Trigger**

I need to automatically download a dataset if missing from disk or reuse existing local files.

## **Snippet**

`import torchvision.transforms as T`  
`from torchvision.datasets import MNIST`

`dataset = MNIST(`  
    `root="./data",`  
    `train=True,`  
    `download=True,`  
    `transform=T.ToTensor(),`  
`)`

## **Minimal Notes**

Setting download=True checks if files exist in root and verifies integrity before downloading. If valid dataset files already exist, the download step is skipped automatically.

## **Common Bug**

**Issue:** HTTPError or corrupt download errors during multi-process DataLoader execution.

**Cause:** Multiple worker processes attempting to download the dataset to the same folder concurrently.

**Quick Fix:** Instantiate the dataset with download=True once in the main process before initializing multi-process DataLoader workers.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/datasets.html](https://pytorch.org/vision/stable/datasets.html)

## **Problem**

Compose Image Transform Pipeline (torchvision.transforms.Compose)

## **Trigger**

I need to chain multiple image transformations sequentially into a single callable transform pipeline.

## **Snippet**

`import torchvision.transforms as T`

`transform_pipeline = T.Compose([`  
    `T.Resize((256, 256)),`  
    `T.CenterCrop((224, 224)),`  
    `T.ToTensor(),`  
    `T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),`  
`])`

## **Minimal Notes**

Transforms in Compose execute sequentially in the exact order specified in the list. Transformations operating on PIL images must precede tensor conversion transforms like ToTensor.

## **Common Bug**

**Issue:** TypeError: img should be PIL Image or Tensor. Got \<class 'torch.Tensor'\> inside PIL-based transform functions.

**Cause:** Placing PIL-only transforms (such as Resize or CenterCrop) after ToTensor() in the Compose sequence.

**Quick Fix:** Arrange PIL image transforms first, followed by ToTensor(), and end with tensor operations like Normalize.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/generated/torchvision.transforms.Compose.html](https://pytorch.org/vision/stable/generated/torchvision.transforms.Compose.html)

## **Problem**

Apply Image Augmentation (RandomCrop, RandomHorizontalFlip, ColorJitter)

## **Trigger**

I need to perform stochastic data augmentations to prevent overfitting during vision model training.

## **Snippet**

`import torchvision.transforms as T`

`train_transform = T.Compose([`  
    `T.RandomResizedCrop(224, scale=(0.8, 1.0)),`  
    `T.RandomHorizontalFlip(p=0.5),`  
    `T.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),`  
    `T.ToTensor(),`  
`])`

## **Minimal Notes**

Stochastic augmentations produce different random transformations each time an image sample is fetched. Validation and test pipelines must omit random augmentations and use deterministic transforms.

## **Common Bug**

**Issue:** Low validation accuracy and non-deterministic behavior during model evaluation.

**Cause:** Applying random augmentations like RandomHorizontalFlip or ColorJitter to the validation or test dataset transform pipeline.

**Quick Fix:** Separate training transforms with random augmentations from evaluation transforms that use deterministic operations like Resize and CenterCrop.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/transforms.html](https://pytorch.org/vision/stable/transforms.html)

## **Problem**

Convert Images to Tensor (ToTensor / PILToTensor)

## **Trigger**

I need to convert PIL images or NumPy arrays into PyTorch image tensors.

## **Snippet**

`from PIL import Image`  
`import torchvision.transforms as T`

`img = Image.new("RGB", (224, 224), color=(255, 0, 0))`

`to_tensor = T.ToTensor()`  
`tensor_scaled = to_tensor(img)`

`to_pil_tensor = T.PILToTensor()`  
`tensor_unscaled = to_pil_tensor(img)`

## **Minimal Notes**

ToTensor() converts PIL images (0-255) to float tensors in \[0.0, 1.0\] with shape (C, H, W). PILToTensor() converts to torch.uint8 in \[0, 255\] without dtype conversion or scaling.

## **Common Bug**

**Issue:** Model loss instability due to inputs containing integers \[0, 255\] instead of normalized floating point values \[0.0, 1.0\].

**Cause:** Using PILToTensor() expecting scaled floats instead of ToTensor().

**Quick Fix:** Use ToTensor() for float scaling to \[0.0, 1.0\], or explicitly cast dtypes using tensor.float() / 255.0 when using PILToTensor().

## **Official Documentation URL**

[https://pytorch.org/vision/stable/generated/torchvision.transforms.ToTensor.html](https://pytorch.org/vision/stable/generated/torchvision.transforms.ToTensor.html)

## **Problem**

Normalize Image Tensor (Normalize)

## **Trigger**

I need to standardize tensor channels using predefined mean and standard deviation vectors.

## **Snippet**

`import torch`  
`import torchvision.transforms as T`

`normalize = T.Normalize(`  
    `mean=[0.485, 0.456, 0.406],`  
    `std=[0.229, 0.224, 0.225],`  
`)`

`image_tensor = torch.rand(3, 224, 224)`  
`normalized_tensor = normalize(image_tensor)`

## **Minimal Notes**

Normalize operates directly on floating point tensors with shape (C, H, W) or (B, C, H, W). Channel values are transformed according to output=stdinput−mean​.

## **Common Bug**

**Issue:** TypeError: img should be Tensor. Got \<class 'PIL.Image.Image'\>

**Cause:** Applying Normalize before converting the PIL Image to a PyTorch tensor with ToTensor().

**Quick Fix:** Ensure ToTensor() precedes Normalize in your transformation pipeline.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/generated/torchvision.transforms.Normalize.html](https://pytorch.org/vision/stable/generated/torchvision.transforms.Normalize.html)

## **Problem**

Load Pretrained Model (torchvision.models)

## **Trigger**

I need to instantiate a vision architecture initialized with modern official pretrained weights.

## **Snippet**

`import torchvision.models as models`

`weights = models.ResNet50_Weights.DEFAULT`  
`model = models.resnet50(weights=weights)`  
`model.eval()`

## **Minimal Notes**

Using Weights.DEFAULT automatically fetches the highest accuracy pretrained weight variant available. Pretrained models must be switched to model.eval() mode for deterministic inference.

## **Common Bug**

**Issue:** UserWarning: The parameter 'pretrained' is deprecated, please use 'weights' instead.

**Cause:** Passing legacy keyword argument pretrained=True to vision model constructors.

**Quick Fix:** Replace pretrained=True with weights=models.ResNet50\_Weights.DEFAULT or specific weight Enum constants.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/models.html](https://pytorch.org/vision/stable/models.html)

## **Problem**

Create Model Without Pretrained Weights (weights=None)

## **Trigger**

I need to instantiate a vision model architecture with random weight initialization for training from scratch.

## **Snippet**

`import torchvision.models as models`

`model = models.resnet18(weights=None)`

## **Minimal Notes**

Passing weights=None initializes network parameters randomly according to architecture default initializers. This avoids downloading pretrained weight checkpoints when training from scratch.

## **Common Bug**

**Issue:** Unintended downloading of heavy checkpoint files over network during architecture initialization.

**Cause:** Omitting the weights argument, which in older API patterns or custom defaults could trigger weight downloads.

**Quick Fix:** Pass weights=None explicitly when initializing models for random parameter training.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/models.html](https://pytorch.org/vision/stable/models.html)

## **Problem**

Load Official Weight Enum (Weights.DEFAULT)

## **Trigger**

I need to select specific published pretrained weight variants or default weights for vision models.

## **Snippet**

`import torchvision.models as models`

`default_weights = models.ResNet50_Weights.DEFAULT`  
`legacy_weights = models.ResNet50_Weights.IMAGENET1K_V1`  
`v2_weights = models.ResNet50_Weights.IMAGENET1K_V2`

`model = models.resnet50(weights=v2_weights)`

## **Minimal Notes**

Weight Enums provide strong typing, metadata access, and exact weight versioning for models. Calling .DEFAULT ensures access to the best available weights as TorchVision updates models.

## **Common Bug**

**Issue:** AttributeError: type object 'ResNet50\_Weights' has no attribute ...

**Cause:** Misspelling the weight variant name or using obsolete weight naming conventions.

**Quick Fix:** Inspect available enum attributes via list(models.ResNet50\_Weights) or use models.ResNet50\_Weights.DEFAULT.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/models.html](https://pytorch.org/vision/stable/models.html)

## **Problem**

Apply Weight-specific Preprocessing (weights.transforms())

## **Trigger**

I need to apply the exact image preprocessing pipeline required by a specific pretrained weight checkpoint.

## **Snippet**

`from PIL import Image`  
`import torchvision.models as models`

`weights = models.EfficientNet_B0_Weights.DEFAULT`  
`preprocess = weights.transforms()`

`img = Image.new("RGB", (300, 300))`  
`input_tensor = preprocess(img).unsqueeze(0)`

## **Minimal Notes**

weights.transforms() returns the exact normalization, resizing, and cropping transforms matching the checkpoint's training setup. This eliminates manual guessing of image dimensions, crop ratios, or mean/std values.

## **Common Bug**

**Issue:** Degraded model accuracy during inference despite using official pretrained weights.

**Cause:** Using standard ResNet normalization parameters \[0.485, 0.456, 0.406\] for models that require different input sizes or scaling routines.

**Quick Fix:** Construct the input preprocessing pipeline directly using weights.transforms() instead of hardcoding manual transforms.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/models.html](https://pytorch.org/vision/stable/models.html)

## **Problem**

Freeze Backbone Layers (requires\_grad=False)

## **Trigger**

I need to disable gradient computation for feature extractor layers during transfer learning.

## **Snippet**

`import torchvision.models as models`

`model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)`

`for param in model.parameters():`  
    `param.requires_grad = False`

## **Minimal Notes**

Setting param.requires\_grad \= False prevents parameter updates and gradient accumulation during backward passes. Freezing backbone weights preserves pretrained feature representations and accelerates training time.

## **Common Bug**

**Issue:** Backbone weights are updated and pretrained features are corrupted during transfer learning training.

**Cause:** Freezing parameters after passing model.parameters() to the optimizer constructor.

**Quick Fix:** Set requires\_grad \= False on layers before instantiating the optimizer, or pass filter(lambda p: p.requires\_grad, model.parameters()) to the optimizer.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/models.html](https://pytorch.org/vision/stable/models.html)

## **Problem**

Replace Classification Head

## **Trigger**

I need to adapt a pretrained model output dimension to match a custom target dataset class count.

## **Snippet**

`import torch.nn as nn`  
`import torchvision.models as models`

`model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)`

`num_features = model.fc.in_features`  
`num_classes = 10`

`model.fc = nn.Linear(num_features, num_classes)`

## **Minimal Notes**

Replacing the final linear layer re-initializes gradients for that layer automatically (requires\_grad=True). Check model attribute names as heads vary between architectures (fc for ResNet, classifier for MobileNet/VGG, heads for ViT).

## **Common Bug**

**Issue:** AttributeError: 'ResNet' object has no attribute 'classifier' or shape mismatch during forward pass.

**Cause:** Accessing the wrong classification head attribute name for the given model architecture family.

**Quick Fix:** Inspect model structure to identify head attribute (model.fc for ResNet, model.classifier for MobileNet/DenseNet/VGG, model.heads for ViT).

## **Official Documentation URL**

[https://pytorch.org/vision/stable/models.html](https://pytorch.org/vision/stable/models.html)

## **Problem**

Fine-tune Selected Layers

## **Trigger**

I need to selectively unfreeze specific deep layers while keeping early feature extractors frozen.

## **Snippet**

`import torch`  
`import torchvision.models as models`

`model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)`

`for param in model.parameters():`  
    `param.requires_grad = False`

`for param in model.layer4.parameters():`  
    `param.requires_grad = True`

`model.fc = torch.nn.Linear(model.fc.in_features, 5)`

`trainable_params = [p for p in model.parameters() if p.requires_grad]`  
`optimizer = torch.optim.AdamW(trainable_params, lr=1e-4)`

## **Minimal Notes**

Fine-tuning deeper layers allows the network to adapt high-level abstract features to custom target domains. Ensure the optimizer receives only parameters where requires\_grad is True to avoid unnecessary computations.

## **Common Bug**

**Issue:** ValueError: optimizer got an empty parameter list or updating unintended frozen parameters.

**Cause:** Passing an unfiltered parameter list containing no trainable parameters to the optimizer.

**Quick Fix:** Filter parameters using \[p for p in model.parameters() if p.requires\_grad\] when instantiating the optimizer.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/models.html](https://pytorch.org/vision/stable/models.html)

## **Problem**

Extract Intermediate Features (torchvision.models.feature\_extraction.create\_feature\_extractor)

## **Trigger**

I need to capture feature activation maps from internal layer nodes of a vision model.

## **Snippet**

`import torch`  
`import torchvision.models as models`  
`from torchvision.models.feature_extraction import create_feature_extractor`

`model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)`

`return_nodes = {`  
    `"layer2": "feat_layer2",`  
    `"layer4": "feat_layer4",`  
`}`

`feature_extractor = create_feature_extractor(model, return_nodes=return_nodes)`

`x = torch.randn(1, 3, 224, 224)`  
`features = feature_extractor(x)`

## **Minimal Notes**

create\_feature\_extractor uses PyTorch FX symbolic tracing to construct a new graph module returning requested intermediate activations. Unused computational graph branches downstream are pruned automatically.

## **Common Bug**

**Issue:** KeyError or FX tracing failure when specifying non-existent node names.

**Cause:** Guessing node names based on module attribute paths instead of tracing the model computation graph.

**Quick Fix:** Use get\_graph\_node\_names(model) to inspect exact node names before passing them to return\_nodes.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/feature\_extraction.html](https://www.google.com/search?q=https://pytorch.org/vision/stable/feature_extraction.html)

## **Problem**

Inspect Available Feature Nodes (get\_graph\_node\_names)

## **Trigger**

I need to discover the exact graph node strings available for feature extraction in a model.

## **Snippet**

`import torchvision.models as models`  
`from torchvision.models.feature_extraction import get_graph_node_names`

`model = models.resnet18(weights=None)`

`train_nodes, eval_nodes = get_graph_node_names(model)`

`print("Eval nodes sample:", eval_nodes[:10])`

## **Minimal Notes**

get\_graph\_node\_names traces the model in both train and eval modes, returning two lists of trace node names. Node names correspond to individual graph execution steps, including functional operations.

## **Common Bug**

**Issue:** Mismatch in node names or structure between training and evaluation forward passes.

**Cause:** Models containing conditional logic or mode-dependent submodules (like Dropout or BatchNorm) during tracing.

**Quick Fix:** Use node names from eval\_nodes when creating feature extractors intended for evaluation or inference pipelines.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/feature\_extraction.html](https://www.google.com/search?q=https://pytorch.org/vision/stable/feature_extraction.html)

## **Problem**

Build Feature Extraction Pipeline

## **Trigger**

I need a complete pipeline to preprocess images, pass them through a feature extractor, and collect embeddings.

## **Snippet**

`import torch`  
`from PIL import Image`  
`import torchvision.models as models`  
`from torchvision.models.feature_extraction import create_feature_extractor`

`weights = models.ResNet50_Weights.DEFAULT`  
`model = models.resnet50(weights=weights).eval()`

`feature_extractor = create_feature_extractor(`  
    `model,`   
    `return_nodes={"avgpool": "embedding"}`  
`)`

`preprocess = weights.transforms()`

`img = Image.new("RGB", (224, 224))`  
`input_tensor = preprocess(img).unsqueeze(0)`

`with torch.no_grad():`  
    `outputs = feature_extractor(input_tensor)`  
    `embedding = outputs["embedding"].flatten(start_dim=1)`

## **Minimal Notes**

Combining weights.transforms(), create\_feature\_extractor, and torch.no\_grad() creates an optimized inference pipeline. Flattening the feature map tensor converts spatial activation maps into 1D feature embeddings per image sample.

## **Common Bug**

**Issue:** Out-of-memory errors or slow performance when extracting features over large image batches.

**Cause:** Forgetting torch.no\_grad() or leaving model in train() mode, causing autograd memory retention.

**Quick Fix:** Set model.eval() and wrap feature extraction calls inside with torch.no\_grad(): block.

## **Official Documentation URL**

[https://pytorch.org/vision/stable/feature\_extraction.html](https://www.google.com/search?q=https://pytorch.org/vision/stable/feature_extraction.html)

---

