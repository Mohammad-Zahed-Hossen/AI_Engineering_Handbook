# AI Engineer Navigation System (AENS)

## Project Constitution v1.0

### Purpose

The purpose of this project is NOT to replace official documentation.

The purpose is NOT to replace ChatGPT, Claude, Gemini, Perplexity, books, blogs, courses, papers, YouTube videos, or handwritten notes.

The purpose is NOT to become a personal Wikipedia.

The purpose is NOT to store all AI knowledge.

The purpose is:

> To become an AI Engineer Navigation System that helps quickly remember, choose, compare, and implement AI-related tools, packages, models, and workflows.

This system exists to reduce friction during real engineering work.

---

# Core Philosophy

The system should:

* Trigger memory
* Accelerate decisions
* Accelerate implementation
* Reduce context switching
* Provide fast navigation to official resources

The system should NOT:

* Re-teach entire concepts
* Store full documentation
* Store complete theory notes
* Store complete course notes
* Store handwritten learning journals
* Duplicate what LLMs already explain well

---

# The Golden Rule

For every piece of content ask:

"Will this help me during actual AI engineering work?"

If YES → Keep it.

If NO → Do not store it.

---

# Content Types

The system contains only four primary content types.

1. Packages
2. Models
3. Workflows
4. Cheatsheets

Everything else is secondary.

---

# PACKAGE ARCHITECTURE

Purpose:

Help answer:

"How do I perform a task?"

NOT:

"What is this package?"

---

Each package contains:

## Package Overview

* Purpose
* Core Use Cases
* Official Documentation
* GitHub Repository
* Alternatives

---

## Common Tasks

Example:

NumPy

* Create Array
* Reshape Array
* Matrix Multiplication
* Matrix Inverse
* Broadcasting

Pandas

* Load CSV
* Merge Tables
* Group Data
* Aggregate Data
* Handle Missing Values

PyTorch

* Create Tensor
* Build Layer
* Create Dataset
* Train Model
* Save Checkpoint

Tasks are more important than functions.

Humans remember problems.

Humans do not remember API names.

---

## Syntax Entry Structure

Every syntax entry should contain:

### Task

Example:

Load CSV File

---

### Mental Trigger

Example:

CSV → DataFrame

SQL JOIN → pd.merge()

Tensor Shape Change → reshape()

---

### Syntax

Example:

pd.read_csv()

---

### Most Important Parameters

Only parameters commonly used in real projects.

Usually 3-6.

Do NOT store every parameter.

---

### One Practical Example

One good example.

Not ten examples.

Not a tutorial.

---

### Decision Notes

Use When:
...

Avoid When:
...

---

### Official Documentation

Direct documentation link.

---

# MODEL ARCHITECTURE

Purpose:

Help answer:

"Which model should I choose?"

NOT:

"Explain the entire architecture."

---

Each model contains:

## Identity

* Name
* Type
* Category
* Official Source

---

## Mental Trigger

One-line memory trigger.

Examples:

BGE-M3 → Multilingual retrieval workhorse

Whisper → Speech-to-text standard

YOLO → Real-time object detection

---

## Best For

Short list.

---

## Avoid When

Short list.

---

## Key Tradeoffs

Speed vs Accuracy

Small vs Large

CPU vs GPU

Inference Cost

Context Length

Language Support

---

## Competitors

Related alternatives.

---

## Official Resources

* Hugging Face
* Paper
* GitHub
* Official Documentation

---

## Decision Notes

Why choose this model over alternatives?

This is more important than architecture details.

---

# WORKFLOW ARCHITECTURE

Purpose:

Help answer:

"How do I build this system?"

---

Examples:

* RAG
* Fine-Tuning
* OCR Pipeline
* Training Pipeline
* Evaluation Pipeline
* Recommendation System

---

Each workflow contains:

## Goal

What are we building?

---

## Workflow Map

Visual step flow.

Example:

PDF
↓
Chunk
↓
Embed
↓
Vector DB
↓
Retrieve
↓
LLM

---

## Step Breakdown

For each step:

* Purpose
* Common Packages
* Common Models
* Example Syntax
* Documentation Links

---

## Common Failure Points

Optional.

Very high value.

---

# CHEATSHEET ARCHITECTURE

Purpose:

Emergency Lookup.

Not learning.

Not tutorials.

Not explanations.

---

Examples:

PyTorch Training Loop

NumPy Matrix Operations

Pandas Data Cleaning

Scikit-Learn Pipeline

Git Commands

Linux Commands

---

Structure:

* Minimal explanation
* Minimal text
* Maximum utility

---

# Content Quality Rules

Every content item should maximize:

1. Recall
2. Decision Making
3. Implementation Speed

Every content item should minimize:

1. Theory
2. Redundant explanations
3. Documentation duplication

---

# Official Documentation Principle

Official documentation is the source of truth.

The handbook is the navigation layer.

The handbook should guide users toward official documentation when deeper information is needed.

Never attempt to replace official documentation.

---

# What Should Never Be Stored

* Entire textbooks
* Entire documentation pages
* Full tutorials
* Full course notes
* Large theory explanations
* Daily learning journals
* Long personal reflections

These belong elsewhere.

---

# Success Metric

The project is successful if:

An AI Engineer can open the system and within 30 seconds:

* Find the right package
* Find the right syntax
* Find the right model
* Find the right workflow
* Jump to official documentation

without opening 20 browser tabs.

That is the mission.


---
# Prompt
I am building an AI Engineer Navigation System, NOT a note-taking app, documentation clone, personal Wikipedia, learning journal, or knowledge archive.

Before answering, internalize these principles:

1. The system exists to help AI engineers quickly remember, choose, compare, and implement tools during real work.

2. The system is a navigation layer above official documentation, not a replacement for documentation.

3. Content should maximize:

   * Recall
   * Decision making
   * Implementation speed
   * Fast navigation to official resources

4. Content should minimize:

   * Long explanations
   * Theory duplication
   * Documentation duplication
   * Tutorial-style teaching

5. The four primary content types are:

   * Packages
   * Models
   * Workflows
   * Cheatsheets

6. Every content item should answer one of three questions:

   * How do I do this?
   * Which option should I choose?
   * Where do I go next?

7. If your suggestion increases maintenance burden, duplicates what modern LLMs already do well, or turns the system into a knowledge archive, challenge the idea and propose a leaner alternative.

8. Prefer mental triggers, decision notes, workflow maps, implementation examples, comparisons, and official resource links over generic explanations.

Now evaluate my request from the perspective of building an AI Engineer Navigation System and provide recommendations consistent with this architecture.
