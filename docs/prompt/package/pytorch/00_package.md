# Generate Production-Ready AENS Package Resource for PyTorch (00_package.md)

I am building an AI Engineering knowledge system (AENS).

This is **NOT** a documentation website.

It is also **NOT** a tutorial.

I need you to generate a **production-ready Markdown file** that can later be converted almost directly into my AENS Package JSON format.

This file is **only the package-level metadata and architecture** for PyTorch.

It is **NOT** responsible for implementation APIs or tasks.

---

# Objective

Create a single file:

```
00_package.md
```

This document serves as the root metadata for the PyTorch Package.

It introduces the framework, defines its architecture, documents namespaces, explains package-level conventions, and establishes global engineering guidance.

**Do not generate implementation tasks.**

**Do not generate examples.**

**Do not document individual APIs.**

Those belong to later Package modules.

---

# AENS Ownership Rules (Strict)

This document owns only package-level knowledge.

Include:

* package metadata
* framework overview
* installation
* import conventions
* namespace overview
* architecture
* package-wide conventions
* package-wide best practices
* package-wide gotchas
* official resources
* version compatibility

Do **NOT** include:

* implementation tasks
* API syntax
* runnable examples
* individual classes
* individual functions
* neural network theory
* deep learning concepts
* model architecture explanations
* training workflows
* debugging guides
* decision guides
* package cheatsheets

Those belong to other AENS resource types or later PyTorch Package modules.

---

# Required Output Structure

Maintain **exactly** the following section order.

Do not rename sections.

Do not insert additional top-level sections.

---

# Package Information

Generate the following fields.

Maintain the same field names.

Include:

* id
* title
* slug
* description
* name
* latest stable version
* supported Python versions
* summary
* install command
* import convention
* important namespaces
* official repository
* official documentation
* license
* maintainers
* created_at
* updated_at

Requirements

* Use the latest stable PyTorch 2.x release.
* Use official package metadata whenever possible.
* Keep descriptions concise and engineer-focused.
* Avoid marketing language.

---

# Installation

Document:

* recommended pip installation
* CUDA installation guidance (reference only)
* CPU installation
* verification command
* optional TorchVision and TorchAudio installation
* version compatibility considerations

Do not explain CUDA.

Do not explain hardware selection.

Do not provide troubleshooting.

---

# Import Convention

Document the standard import style used across modern PyTorch projects.

Include:

* recommended imports
* alias conventions
* common namespace imports
* package organization conventions

Do not explain API behavior.

---

# Namespace Overview

Briefly explain the responsibility of each major namespace.

Include exactly these namespaces.

```
torch

torch.nn

torch.nn.functional

torch.optim

torch.utils.data

torch.cuda

torch.autograd

torch.amp

torch.distributed

torch.fx

torch.func

torchvision
```

For each namespace include:

* primary responsibility
* common engineering usage
* relationship with other namespaces

Limit each description to approximately 2–4 sentences.

Do not document classes or functions.

---

# Version Compatibility

Provide a concise engineer-oriented compatibility summary.

Include:

* supported Python versions
* latest stable release
* semantic versioning policy
* backward compatibility expectations
* important PyTorch 2.x modernization
* major deprecated legacy features
* migration considerations from older releases

Mention examples such as:

* Variable
* .data
* legacy AMP
* legacy distributed launch utilities

Do not explain API details.

---

# Architecture

Describe the package architecture at a high level.

Focus on:

* tensor computation
* automatic differentiation
* neural network construction
* optimization
* data loading
* distributed execution
* compilation
* inference
* model serialization
* TorchVision integration

Describe how the namespaces interact conceptually.

Do not explain individual APIs.

Do not explain neural network theory.

---

# Package-level Best Practices

Generate approximately **10–15** concise engineering recommendations.

Examples include:

* prefer `state_dict()` serialization
* keep tensors on consistent devices
* prefer `torch.inference_mode()` for inference
* use deterministic algorithms when reproducibility matters
* prefer modular `nn.Module` design
* avoid unnecessary tensor copies
* separate data loading from training logic
* organize checkpoints consistently

Focus on package-wide engineering practices.

Avoid implementation details.

---

# Package-level Gotchas

Generate approximately **10–15** common package-wide pitfalls.

Examples include:

* CPU/GPU device mismatch
* dtype inconsistency
* forgetting `model.eval()`
* forgetting `optimizer.zero_grad()`
* non-deterministic training behavior
* hidden memory growth
* serialization compatibility
* mixed precision misuse

Describe each in one concise paragraph.

Do not propose debugging procedures.

---

# Official Resources

Provide the official resources only.

Include:

* Official Documentation
* API Reference
* Tutorials
* Get Started Guide
* Installation Guide
* GitHub Repository
* Release Notes
* Migration Guide

Use only official PyTorch resources.

Do not include blogs.

Do not include third-party tutorials.

Do not include community websites.

---

# Official Sources

Use the following priority order.

1. Official PyTorch Documentation
2. Official API Reference
3. Official Tutorials
4. Official GitHub Repository
5. Official Release Notes
6. Official Migration Documentation

Do not rely primarily on third-party sources.

---

# Quality Requirements

* Base all content on the latest stable PyTorch 2.x release.
* Keep explanations concise and implementation-oriented.
* Do not copy official documentation text.
* Avoid tutorial-style writing.
* Avoid marketing language.
* Avoid historical discussion unless directly relevant to compatibility.
* Avoid machine learning theory.
* Avoid implementation examples.
* Avoid documenting individual APIs.
* Keep terminology consistent with official PyTorch documentation.

---

# Output Format

Produce a single clean Markdown document.

Maintain exactly the section ordering defined above.

Maintain consistent heading hierarchy.

Do not output JSON.

Do not output YAML.

Do not explain your reasoning.

Do not generate implementation tasks.

Do not generate runnable examples.

Generate only the completed **`00_package.md`** document.
