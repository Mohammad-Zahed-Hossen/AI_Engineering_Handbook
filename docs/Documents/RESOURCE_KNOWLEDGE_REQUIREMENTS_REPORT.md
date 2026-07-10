# Resource Knowledge Requirements Report

**Document Type:** Internal Engineering Handbook  
**Version:** 1.0  
**Date:** July 4, 2026  
**Purpose:** Definitive guide for knowledge collection before creating AENS resources  
**Audience:** Knowledge Engineers, Researchers, Technical Writers

---

# Executive Summary

This report defines the complete knowledge requirements for every resource type in the AI Engineering Navigation System (AENS). It serves as the master checklist for researchers conducting Deep Research before content creation.

**Key Principles:**
- AENS preserves engineering knowledge, not documentation
- Focus on practitioner knowledge accumulated through years of practice
- Prioritize actionable, implementation-focused information
- Capture mental models, not just syntax
- Include production wisdom, not just tutorial content

**Resource Types Covered:**
1. Package
2. Model
3. Workflow
4. Pattern
5. Debug Guide
6. Cheatsheet
7. Decision Guide
8. Principle
9. Registry

**Total Knowledge Dimensions:** 67 distinct knowledge categories across all resource types

---

# Philosophy of Knowledge Collection

## Core Philosophy

AENS is not a documentation platform. It is a curated knowledge system that preserves engineering wisdom. The difference is critical:

**Documentation answers:** "What does this API do?"  
**AENS answers:** "How do I solve this engineering problem?"

**Documentation provides:** Syntax and parameters  
**AENS provides:** Mental models, decision frameworks, and production wisdom

## Knowledge Hierarchy

```
Level 1: Facts (what)
  - API names, parameters, syntax
  - Version numbers, compatibility
  - Basic definitions

Level 2: Understanding (why)
  - Design rationale
  - Tradeoffs and alternatives
  - Architectural decisions
  - Mental models

Level 3: Practice (how)
  - Production patterns
  - Common pitfalls
  - Performance characteristics
  - Debugging strategies

Level 4: Wisdom (when)
  - When to use vs when to avoid
  - Contextual decision criteria
  - Integration patterns
  - Evolution trajectory
```

**AENS Focus:** Levels 2-4. Level 1 is assumed to be available in official documentation.

## The "Engineer at 2 AM" Test

When deciding what knowledge to collect, ask:

*"An engineer is debugging a production issue at 2 AM. What knowledge would save them hours of investigation?"*

If the answer is "they need to know the API signature," that's documentation.  
If the answer is "they need to know that this API silently fails when X happens," that's AENS knowledge.

## Knowledge Decay

Different types of knowledge decay at different rates:

**Fast-decaying (6-12 months):**
- Version-specific APIs
- Performance benchmarks
- Tool-specific quirks
- Installation instructions

**Medium-decaying (2-5 years):**
- Architecture patterns
- Best practices
- Common pitfalls
- Integration patterns

**Slow-decaying (5+ years):**
- Core concepts
- Fundamental principles
- Mental models
- Design rationales

**AENS Prioritization:** Focus on medium and slow-decaying knowledge. Fast-decaying knowledge should reference official sources.

---

# Complete Knowledge Taxonomy

## Knowledge Dimensions

This section enumerates all possible knowledge dimensions that may be relevant to AENS resources. Each dimension is classified by its typical importance across resource types.

### Identity & Classification
- **Name** - Canonical identifier
- **Aliases** - Alternative names used in industry
- **Short description** - 1-2 sentence summary
- **Long description** - Comprehensive explanation
- **Category** - Classification within domain
- **Domain** - Engineering domain (ML, DL, LLM, etc.)
- **Difficulty** - Prerequisite knowledge level
- **Engineering area** - Specific subfield

### Purpose & Context
- **Problem solved** - What engineering problem this addresses
- **Why it exists** - Historical context and motivation
- **Use cases** - Typical scenarios where applicable
- **Non-use cases** - Scenarios where not applicable
- **Prerequisites** - Required prior knowledge
- **Assumptions** - Underlying assumptions about environment/context

### Core Concepts
- **Mental model** - Conceptual framework for understanding
- **Key concepts** - Foundational terminology
- **Architecture** - High-level structure
- **Internal workflow** - How it works internally
- **Execution flow** - Step-by-step execution
- **Lifecycle** - Creation, usage, destruction phases
- **Input requirements** - What inputs it accepts
- **Output format** - What it produces
- **Invariants** - Properties that always hold

### Implementation
- **Dependencies** - Required libraries, systems
- **Installation** - How to install/setup
- **Configuration** - Required configuration
- **Quick start** - Minimal working example
- **Production example** - Real-world usage
- **API usage** - Common API patterns
- **Common API calls** - Frequently used operations
- **Parameters** - Key parameters and their effects
- **Best practices** - Recommended usage patterns
- **Design patterns** - Architectural patterns used

### Anti-Patterns & Pitfalls
- **Anti-patterns** - Common incorrect usage
- **Common mistakes** - Frequent errors
- **Gotchas** - Subtle behaviors that cause issues
- **Hidden behavior** - Non-obvious behavior
- **Silent failures** - Failures that don't error
- **Edge cases** - Boundary conditions
- **Failure modes** - How it can fail

### Performance & Resources
- **Performance characteristics** - Speed, latency, throughput
- **Memory usage** - Memory requirements
- **Time complexity** - Algorithmic complexity
- **GPU requirements** - GPU needs
- **CPU requirements** - CPU needs
- **Scalability** - How it scales with data/size
- **Optimization strategies** - Performance tuning
- **Bottlenecks** - Performance constraints

### Tradeoffs & Decisions
- **Tradeoffs** - What you give up vs what you gain
- **Advantages** - Strengths
- **Disadvantages** - Weaknesses
- **Alternatives** - Other approaches
- **Comparison table** - Quantitative/qualitative comparison
- **Decision criteria** - How to choose this vs alternatives
- **When to use** - Specific conditions for usage
- **When to avoid** - Specific conditions to avoid

### Compatibility & Evolution
- **Version differences** - Changes across versions
- **Migration notes** - How to upgrade/migrate
- **Breaking changes** - Incompatible changes
- **Compatibility** - What it works with
- **Deprecation timeline** - When features will be removed
- **Evolution trajectory** - Future direction

### Production
- **Deployment** - How to deploy in production
- **Production checklist** - Pre-deployment verification
- **Monitoring** - What to monitor
- **Testing** - How to test
- **Validation** - How to validate correctness
- **Safety considerations** - Safety-critical aspects
- **Security concerns** - Security implications
- **Limitations** - Hard constraints

### Debugging & Troubleshooting
- **Debugging tips** - How to debug issues
- **Common errors** - Frequent error messages
- **Error interpretation** - What errors mean
- **Diagnostic tools** - Tools for diagnosis
- **Recovery strategies** - How to recover from failures

### Learning & Resources
- **Learning order** - Recommended learning sequence
- **Prerequisites** - What to learn first
- **Recommended next** - What to learn after
- **Interview questions** - Common interview topics
- **Real-world use cases** - Industry applications
- **Industry adoption** - Who uses it in production
- **Case studies** - Detailed examples
- **Research papers** - Academic sources
- **Official documentation** - Primary sources
- **Important blog posts** - Secondary sources
- **Community resources** - Forums, discussions
- **Videos** - Video tutorials
- **Books** - Book references

### Relationships
- **Related workflows** - Workflows that use this
- **Related models** - Models that implement this
- **Related packages** - Packages that provide this
- **Related principles** - Principles that govern this
- **Related patterns** - Patterns used by this
- **Related debug guides** - Debug guides for this
- **Related decision guides** - Decisions about this
- **Related registries** - Registries listing this

### Common Misconceptions
- **Frequently misunderstood** - Common confusions
- **Frequently confused with** - Similar concepts
- **FAQ** - Frequently asked questions
- **Myths** - Common false beliefs

---

# Resource-by-Resource Knowledge Requirements

---

## Package

**Purpose:** Implementation knowledge - how to implement X with library Y  
**Knowledge Owned:** Syntax recall, API usage patterns, library-specific implementation details  
**Engineering Value:** Reduces API lookup time, prevents common library-specific mistakes, provides production-ready patterns  
**Typical Examples:** PyTorch, NumPy, Pandas, Transformers, FastAPI, Ray, MLflow

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Canonical name** - Official library name
- [ ] **Latest stable version** - Current production-ready version
- [ ] **Installation method** - pip, conda, source, Docker
- [ ] **Import convention** - Standard import statement
- [ ] **Core mental model** - How the library conceptualizes its domain
- [ ] **Primary use cases** - 3-5 most common scenarios
- [ ] **Common API patterns** - 5-10 most frequently used operations
- [ ] **Key parameters** - Parameters that significantly affect behavior
- [ ] **Common mistakes** - 3-5 errors engineers make
- [ ] **Gotchas** - Subtle behaviors that cause issues
- [ ] **Official documentation URL** - Link to primary docs
- [ ] **GitHub repository** - Link to source code
- [ ] **Prerequisite packages** - Required dependencies

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names used in community
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain (data_processing, deep_learning, etc.)
- [ ] **Category** - Specific category within domain
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to master basics
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Version history** - Major version changes
- [ ] **Compatible versions** - Version ranges supported
- [ ] **Breaking changes** - Known breaking changes
- [ ] **Migration notes** - How to upgrade between versions
- [ ] **Performance characteristics** - Speed, memory, scalability
- [ ] **GPU requirements** - GPU support and requirements
- [ ] **CPU requirements** - CPU needs
- [ ] **Optimization strategies** - Performance tuning tips
- [ ] **Best practices** - Recommended usage patterns
- [ ] **Anti-patterns** - What not to do
- [ ] **Silent failures** - Failures that don't error
- [ ] **Edge cases** - Boundary conditions
- [ ] **Production patterns** - Real-world usage examples
- [ ] **Testing strategies** - How to test code using this library
- [ ] **Debugging tips** - How to debug issues
- [ ] **Common errors** - Frequent error messages and their meanings
- [ ] **Industry adoption** - Who uses it in production
- [ ] **Real-world use cases** - Industry applications
- [ ] **Related packages** - Alternative or complementary packages
- [ ] **Related patterns** - Patterns commonly used with this package
- [ ] **Related debug guides** - Debug guides for common errors
- [ ] **Related decision guides** - Decisions about using this package
- [ ] **Related principles** - Principles that apply to this package
- [ ] **Package-specific debugging** - Library-specific debugging techniques
- [ ] **Important blog posts** - High-quality secondary sources
- [ ] **Community resources** - Forums, Discord, Stack Overflow tags

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier (can be auto-generated)
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Verified against** - Version/date verified against
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references beyond official docs
- [ ] **Learning order** - Recommended sequence within this package
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references
- [ ] **Research papers** - Academic sources if applicable
- [ ] **Conference talks** - Relevant conference presentations
- [ ] **Benchmarks** - Performance benchmarks
- [ ] **Comparison with alternatives** - Quantitative comparison
- [ ] **Deprecation timeline** - When features will be removed
- [ ] **Evolution trajectory** - Future direction

### Writing Checklist

For each task in the package:
- [ ] Task name is clear and action-oriented
- [ ] Mental trigger describes when you need this task
- [ ] Syntax is the minimal working example
- [ ] Example is complete and runnable
- [ ] Important params are limited to 5 most critical
- [ ] Use_when describes concrete scenarios
- [ ] Avoid_when describes concrete anti-patterns
- [ ] Decision_notes explain the rationale
- [ ] Gotchas are specific and actionable
- [ ] Official_docs link to specific API page

Overall:
- [ ] Entries cover 80/20 use cases
- [ ] Snippets include necessary imports
- [ ] Snippets are current with latest API
- [ ] Verified against latest version
- [ ] Clear triggers for each entry

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Installation** - How to install with correct version
- **Import** - Standard import statement
- **Basic usage** - Minimal working example
- **Common operations** - 5-10 most used APIs
- **Key parameters** - Parameters that change behavior significantly
- **Common errors** - 3-5 frequent mistakes
- **Gotchas** - Subtle behaviors

#### Production Knowledge (Recommended)
- **Performance** - Speed, memory, scalability characteristics
- **Best practices** - Production-ready patterns
- **Anti-patterns** - What not to do
- **Optimization** - How to tune performance
- **Testing** - How to test code using this library
- **Debugging** - Library-specific debugging techniques
- **Deployment** - Production deployment considerations

#### Contextual Knowledge (Optional)
- **History** - Why library was created
- **Alternatives** - Other libraries in same space
- **Comparison** - How it compares to alternatives
- **Adoption** - Who uses it in production
- **Evolution** - Future direction

---

## Model

**Purpose:** Algorithm knowledge - which algorithm to use for which problem  
**Knowledge Owned:** Algorithm selection criteria, architectural understanding, problem-type mapping  
**Engineering Value:** Enables correct algorithm selection, prevents misapplication, provides architectural intuition  
**Typical Examples:** BERT, Llama, Gradient Descent, Random Forest, SVM, Transformer

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Canonical name** - Official model name
- [ ] **Problem types** - What problems this model solves
- [ ] **Use when** - Specific conditions for using this model
- [ ] **Avoid when** - Specific conditions to avoid this model
- [ ] **Pros** - At least 3 advantages
- [ ] **Cons** - At least 3 disadvantages
- [ ] **Key hyperparameters** - Most influential parameters (at least 1)
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Official documentation** - Primary source

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Domain** - ML/DL/LLM/etc.
- [ ] **Category** - Specific category within domain
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to understand
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Architecture** - High-level structure
- [ ] **Input requirements** - What inputs it accepts
- [ ] **Output format** - What it produces
- [ ] **Performance characteristics** - Speed, accuracy, resource usage
- [ ] **Scalability** - How it scales with data/size
- [ ] **Training requirements** - Data, compute, time
- [ ] **Inference requirements** - Compute, memory, latency
- [ ] **Best practices** - Recommended usage patterns
- [ ] **Common mistakes** - Frequent errors
- [ ] **Gotchas** - Subtle behaviors
- [ ] **Alternatives** - Other models for same problems
- [ ] **Comparison table** - Quantitative comparison
- [ ] **Industry adoption** - Who uses it in production
- [ ] **Real-world use cases** - Industry applications
- [ ] **Research papers** - Original paper or key papers
- [ ] **Important blog posts** - Explanatory posts
- [ ] **Related packages** - Packages that implement this model
- [ ] **Related workflows** - Workflows that use this model
- [ ] **Related patterns** - Patterns used with this model
- [ ] **Related principles** - Principles that apply

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Verified against** - Version/date verified against
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references
- [ ] **Conference talks** - Relevant presentations
- [ ] **Cost estimates** - Cloud costs if applicable
- [ ] **Team size required** - How many people needed
- [ ] **Maintenance burden** - Ongoing maintenance needs
- [ ] **Evolution trajectory** - Future direction

### Writing Checklist

- [ ] Problem types are specific and actionable
- [ ] Use_when/avoid_when concrete
- [ ] Pros/cons specific (not generic)
- [ ] Key hyperparameters most influential
- [ ] Comparison with alternatives fair
- [ ] Performance characteristics quantitative
- [ ] Training/inference requirements documented
- [ ] Industry adoption data included
- [ ] Real-world use cases provided
- [ ] Cross-links bidirectional

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Problem types** - What problems it solves
- **Selection criteria** - When to choose this model
- **Rejection criteria** - When to avoid this model
- **Advantages** - Specific strengths
- **Disadvantages** - Specific weaknesses
- **Key hyperparameters** - Most influential parameters

#### Contextual Knowledge (Recommended)
- **Architecture** - High-level structure
- **Performance** - Speed, accuracy, resource usage
- **Scalability** - How it scales
- **Training requirements** - Data, compute, time
- **Inference requirements** - Compute, memory, latency
- **Alternatives** - Other models for same problems
- **Comparison** - Quantitative comparison
- **Best practices** - How to use effectively
- **Common mistakes** - Frequent errors

#### Background Knowledge (Optional)
- **History** - Why model was created
- **Math** - Underlying mathematics (high-level)
- **Implementation** - How it works internally
- **Research** - Original paper and key papers
- **Evolution** - Future direction

---

## Workflow

**Purpose:** Process knowledge - how to build X end-to-end  
**Knowledge Owned:** Complete engineering process, step-by-step guidance, decision points  
**Engineering Value:** Provides complete implementation path, prevents getting stuck, captures production wisdom  
**Typical Examples:** Build RAG System, Train Transformer Model, Deploy ML Pipeline, Set Up MLOps

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear workflow name
- [ ] **Category** - Engineering category (e.g., "LLM", "MLOps")
- [ ] **Overview** - High-level description of what this builds
- [ ] **Starter stack** - Minimum required tools/libraries
- [ ] **Steps** - Array of steps (minimum 3, maximum 8)
- For each step:
  - [ ] Step name
  - [ ] Description - What this step accomplishes
  - [ ] Tools - Tools/libraries used
  - [ ] Decisions - Key decisions made
  - [ ] Failure points - Common failure modes

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to complete
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Total time estimate** - How long workflow takes
- [ ] **Skill level required** - Prerequisite skills
- [ ] **Output artifacts** - What gets produced
- [ ] **Success criteria** - How to verify completion
- [ ] **Common pitfalls** - Workflow-level mistakes
- [ ] **Optimization opportunities** - Where to optimize
- [ ] **Alternative approaches** - Other ways to achieve same goal
- [ ] **Related packages** - Packages used in workflow
- [ ] **Related patterns** - Patterns applied in workflow
- [ ] **Related models** - Models used in workflow
- [ ] **Related debug guides** - Debug guides for workflow errors
- [ ] **Related decision guides** - Decisions made in workflow
- [ ] **Research papers** - Academic sources
- [ ] **Important blog posts** - Secondary sources
- [ ] **Industry adoption** - Who uses this workflow

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Verified against** - Version/date verified against
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references
- [ ] **Conference talks** - Relevant presentations
- [ ] **Cost estimates** - Cloud costs if applicable
- [ ] **Team size required** - How many people needed
- [ ] **Maintenance burden** - Ongoing maintenance needs
- [ ] **Evolution trajectory** - Future direction

### Writing Checklist

For each step:
- [ ] Step name is clear and action-oriented
- [ ] Description explains what the step accomplishes
- [ ] Tools are the minimum required
- [ ] Decisions capture key tradeoffs
- [ ] Failure points identify common mistakes
- [ ] Steps are in logical order
- [ ] Steps are actionable
- [ ] Steps build on each other

Overall:
- [ ] Overview clearly states what gets built
- [ ] Starter stack is minimal
- [ ] Steps cover complete end-to-end process
- [ ] Success criteria are measurable
- [ ] Cross-links are bidirectional

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Goal** - What this workflow builds
- **Prerequisites** - What you need before starting
- **Steps** - Complete step-by-step process
- **Tools** - Required libraries and systems
- **Decisions** - Key engineering decisions
- **Failure points** - Where things go wrong

#### Contextual Knowledge (Recommended)
- **Time estimate** - How long it takes
- **Skill level** - Required expertise
- **Output** - What gets produced
- **Success criteria** - How to verify completion
- **Common pitfalls** - Workflow-level mistakes
- **Optimizations** - Where to improve
- **Alternatives** - Other approaches

#### Background Knowledge (Optional)
- **History** - Why this workflow exists
- **Industry adoption** - Who uses it
- **Evolution** - Future direction
- **Cost** - Financial costs if applicable
- **Team** - People required

---

## Cheatsheet

**Purpose:** Syntax recall - what's the syntax for X operation  
**Knowledge Owned:** Quick reference, common operations, API shortcuts  
**Engineering Value:** Reduces lookup time, provides copy-paste ready code, prevents syntax errors  
**Typical Examples:** PyTorch Cheatsheet, NumPy Cheatsheet, Pandas Cheatsheet, SQL Cheatsheet

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear cheatsheet name
- [ ] **Package reference** - Which package this covers
- [ ] **Entries** - Array of entries (minimum 1, maximum 60)
- For each entry:
  - [ ] **Problem** - What problem this solves
  - [ ] **Trigger** - When you need this
  - [ ] **Snippet** - Working code example
  - [ ] **Minimal notes** - 1-2 sentence explanation
  - [ ] **Common bug** - Common mistake to avoid
  - [ ] **Docs URL** - Link to specific API documentation

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to master
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Entry organization** - How entries are grouped
- [ ] **Common patterns** - Frequent code patterns

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references

### Writing Checklist

For each entry:
- [ ] Problem describes a common use case
- [ ] Trigger describes when you need this
- [ ] Snippet is copy-paste ready
- [ ] Minimal notes are 1-2 sentences max
- [ ] Common bug is a specific mistake
- [ ] Docs URL links to specific API page

Overall:
- [ ] Entries cover 80/20 use cases
- [ ] Snippets include necessary imports
- [ ] Snippets are current with latest API
- [ ] Package reference is correct

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Problems** - Common use cases
- **Syntax** - Working code examples
- **Gotchas** - Common mistakes

#### Contextual Knowledge (Recommended)
- **Organization** - How entries are grouped
- **Patterns** - Frequent code patterns
- **Triggers** - When to use each entry

---

## Pattern

**Purpose:** Concept knowledge - engineering concepts and best practices  
**Knowledge Owned:** Conceptual frameworks, design principles, architectural patterns  
**Engineering Value:** Provides mental models, enables correct application, prevents conceptual errors  
**Typical Examples:** Training Loop, Early Stopping, Batch Normalization, Attention Mechanism, Residual Connections

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear pattern name
- [ ] **Concept** - What this pattern is
- [ ] **Applicability** - When to apply this pattern

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to understand
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Anti-patterns** - Common mistakes
- [ ] **Implementation notes** - Practical guidance
- [ ] **Examples** - Concrete examples
- [ ] **Variations** - Common variations
- [ ] **Related packages** - Packages that implement this pattern
- [ ] **Related models** - Models that use this pattern
- [ ] **Related workflows** - Workflows that apply this pattern
- [ ] **Related principles** - Principles that govern this pattern
- [ ] **Important blog posts** - Explanatory posts
- [ ] **Community resources** - Forums, discussions

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references
- [ ] **Conference talks** - Relevant presentations
- [ ] **Historical context** - Why pattern emerged
- [ ] **Mathematical foundation** - Underlying theory (high-level)
- [ ] **Evolution trajectory** - Future direction

### Writing Checklist

- [ ] Concept is clear and concise
- [ ] Applicability describes concrete scenarios
- [ ] Anti-patterns are real mistakes engineers make
- [ ] Implementation notes are practical, not theoretical
- [ ] Examples are concrete and relatable
- [ ] Cross-links are bidirectional

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Concept** - What the pattern is
- **Applicability** - When to apply it

#### Contextual Knowledge (Recommended)
- **Anti-patterns** - Common mistakes
- **Implementation** - How to implement
- **Examples** - Concrete examples
- **Variations** - Common variations

#### Background Knowledge (Optional)
- **History** - Why pattern emerged
- **Theory** - Underlying mathematics/logic
- **Evolution** - Future direction

---

## Debug Guide

**Purpose:** Troubleshooting knowledge - how to fix X error  
**Knowledge Owned:** Error diagnosis, root cause analysis, recovery strategies  
**Engineering Value:** Reduces debugging time, prevents recurring errors, captures diagnostic wisdom  
**Typical Examples:** CUDA Out of Memory, Gradient Explosion, NaN Loss, Convergence Issues, Data Leakage

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear error/problem name
- [ ] **Symptoms** - Observable error messages or behaviors (minimum 1)
- [ ] **Root causes** - Technical causes (minimum 1)
- [ ] **Solutions** - Working fixes (minimum 1)

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names for this error
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to resolve
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Diagnostic steps** - How to diagnose
- [ ] **Prevention strategies** - How to prevent
- [ ] **Related packages** - Packages where this error occurs
- [ ] **Related workflows** - Workflows where this error occurs
- [ ] **Related patterns** - Patterns used in this error
- [ ] **Related models** - Models that trigger this error
- [ ] **Important blog posts** - Explanatory posts
- [ ] **Community resources** - Stack Overflow, GitHub issues

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references
- [ ] **Conference talks** - Relevant presentations
- [ ] **Historical context** - Why this error is common
- [ ] **Frequency** - How often this error occurs
- [ ] **Severity** - Impact of this error
- [ ] **Evolution trajectory** - Future changes

### Writing Checklist

- [ ] Symptoms are observable and specific
- [ ] Root causes are technically accurate
- [ ] Solutions are tested and working
- [ ] Each solution maps to a specific root cause
- [ ] Diagnostic steps are actionable
- [ ] Prevention strategies are practical
- [ ] Context (when it occurs) included
- [ ] Frequency/severity documented
- [ ] Cross-links are bidirectional

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Symptoms** - What you observe
- **Root causes** - Why it happens
- **Solutions** - How to fix it

#### Contextual Knowledge (Recommended)
- **Diagnosis** - How to confirm the issue
- **Prevention** - How to avoid it
- **Related errors** - Similar errors

#### Background Knowledge (Optional)
- **Frequency** - How common it is
- **Severity** - Impact
- **History** - Why it's common

---

## Cheatsheet

**Purpose:** Syntax recall - what's the syntax for X operation  
**Knowledge Owned:** Quick reference, common operations, API shortcuts  
**Engineering Value:** Reduces lookup time, provides copy-paste ready code, prevents syntax errors  
**Typical Examples:** PyTorch Cheatsheet, NumPy Cheatsheet, Pandas Cheatsheet, SQL Cheatsheet

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear cheatsheet name
- [ ] **Package reference** - Which package this covers
- [ ] **Entries** - Array of entries (minimum 1, maximum 60)
- For each entry:
  - [ ] **Problem** - What problem this solves
  - [ ] **Trigger** - When you need this
  - [ ] **Snippet** - Working code example
  - [ ] **Minimal notes** - 1-2 sentence explanation
  - [ ] **Common bug** - Common mistake to avoid
  - [ ] **Docs URL** - Link to specific API documentation

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to master
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Entry organization** - How entries are grouped
- [ ] **Common patterns** - Frequent code patterns

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references

### Writing Checklist

For each entry:
- [ ] Problem describes a common use case
- [ ] Trigger describes when you need this
- [ ] Snippet is copy-paste ready
- [ ] Minimal notes are 1-2 sentences max
- [ ] Common bug is a specific mistake
- [ ] Docs URL links to specific API page

Overall:
- [ ] Entries cover 80/20 use cases
- [ ] Snippets include necessary imports
- [ ] Snippets are current with latest API
- [ ] Package reference is correct

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Problems** - Common use cases
- **Syntax** - Working code examples
- **Gotchas** - Common mistakes

#### Contextual Knowledge (Recommended)
- **Organization** - How entries are grouped
- **Patterns** - Frequent code patterns
- **Triggers** - When to use each entry

---

## Decision Guide

**Purpose:** Decision knowledge - X vs Y, which to choose  
**Knowledge Owned:** Decision frameworks, comparison matrices, recommendation logic  
**Engineering Value:** Enables informed decisions, prevents analysis paralysis, captures decision wisdom  
**Typical Examples:** RAG vs Fine-Tuning, PyTorch vs TensorFlow, SQL vs NoSQL

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear decision guide name
- [ ] **Options** - Array of options (minimum 2)
- [ ] **Evaluation criteria** - Array of criteria (minimum 1)

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to decide
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Comparison table** - Quantitative comparison
- [ ] **Recommendations** - Clear recommendations
- [ ] **Use cases** - When to use each option
- [ ] **Related workflows** - Workflows affected by decision
- [ ] **Related packages** - Packages involved in decision
- [ ] **Related models** - Models involved in decision

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references

### Writing Checklist

- [ ] Options are real alternatives engineers consider
- [ ] Criteria are relevant decision factors
- [ ] Comparison is fair and balanced
- [ ] Recommendation is clear
- [ ] Cross-links are bidirectional

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Options** - What are the alternatives
- **Criteria** - How to evaluate them
- **Comparison** - How they compare

#### Contextual Knowledge (Recommended)
- **Recommendation** - Which to choose when
- **Framework** - How to decide
- **Tradeoffs** - What you give up vs gain

---

## Principle

**Purpose:** Principle knowledge - why things work  
**Knowledge Owned:** Fundamental truths, design axioms, engineering laws  
**Engineering Value:** Provides decision frameworks, prevents architectural mistakes, captures engineering wisdom  
**Typical Examples:** Single Source of Truth, DRY, YAGNI, Separation of Concerns, Fail Fast

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear principle name
- [ ] **Statement** - The principle statement

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Difficulty** - beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to understand
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Implications** - What it means in practice
- [ ] **Examples** - Concrete examples
- [ ] **Anti-patterns** - Violations of this principle
- [ ] **Related concepts** - Related principles/concepts
- [ ] **Important blog posts** - Explanatory posts
- [ ] **Community resources** - Forums, discussions

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references
- [ ] **Conference talks** - Relevant presentations
- [ ] **Historical context** - Origin of principle
- [ ] **Evolution trajectory** - How principle is evolving

### Writing Checklist

- [ ] Statement is concise and memorable
- [ ] Implications are actionable
- [ ] Examples are concrete
- [ ] Anti-patterns are real violations
- [ ] Limitations are specified
- [ ] Cross-links are bidirectional

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Statement** - The principle itself

#### Contextual Knowledge (Recommended)
- **Implications** - What it means in practice
- **Examples** - Concrete applications
- **Anti-patterns** - Violations
- **Limitations** - When it doesn't apply

#### Background Knowledge (Optional)
- **History** - Origin of principle
- **Evolution** - How it's changing

---

## Registry

**Purpose:** Asset listing - what assets exist for X  
**Knowledge Owned:** Asset catalogs, model listings, dataset directories  
**Engineering Value:** Provides discovery layer, enables asset selection, prevents reinvention  
**Typical Examples:** Model Registry, Dataset Registry, Service Registry

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Registry type** - What this registry lists (models, datasets, services)
- [ ] **Entries** - Array of assets (minimum 1)
- For each entry:
  - [ ] **ID** - Unique identifier
  - [ ] **Name** - Asset name
  - [ ] **Task** - What this asset is for
  - [ ] **Description** - Brief description

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to browse
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Entry metadata** - Additional metadata per entry
- [ ] **Entry links** - Links to asset sources
- [ ] **Entry criteria** - Inclusion criteria
- [ ] **Related packages** - Packages that provide these assets
- [ ] **Important blog posts** - Asset recommendations
- [ ] **Community resources** - Asset discovery

#### Optional (Nice to Have)
- [ ] **Slug** - URL-friendly identifier
- [ ] **Created date** - When resource was created
- [ ] **Updated date** - When resource was last updated
- [ ] **Last verified** - When content was verified
- [ ] **Review frequency** - How often to review
- [ ] **Canonical status** - canonical/reference/generated
- [ ] **Lifecycle** - draft/verified/stable/deprecated/archived
- [ ] **Stability** - stable/semi_stable/volatile
- [ ] **Confidence** - verification level
- [ ] **Engineering maturity** - research/experimental/emerging/production_ready/legacy
- [ ] **Owner** - Team or individual responsible
- [ ] **Sources** - Source references
- [ ] **Learning order** - Recommended sequence
- [ ] **Interview questions** - Common interview topics
- [ ] **Videos** - Video tutorials
- [ ] **Books** - Book references

### Writing Checklist

- [ ] Registry type is clear
- [ ] Entries follow consistent format
- [ ] Entry IDs are unique
- [ ] Entry descriptions are informative
- [ ] Entry links are valid
- [ ] Inclusion criteria are specified

### Knowledge Checklist

#### Core Knowledge (Mandatory)
- **Type** - What this registry lists
- **Entries** - Asset catalog

#### Contextual Knowledge (Recommended)
- **Metadata** - Additional asset information
- **Links** - Where to find assets
- **Criteria** - Why entries are included

---

# Implementation Status

## Model Detail Page UX Refactor (v1.2)

**Status:** ✅ Complete

All implementation items from the AENS Model Page Audit Report have been successfully completed:

### Original Audit Report (4 Prompts) - All Implemented

1. **Prompt #1 - Shared Prose/Math Rendering Primitive** ✅
   - Created `components/shared/Prose.tsx` with `Prose` and `ProseInline` components
   - Added dependencies: `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `katex`
   - Imported KaTeX CSS in `app/layout.tsx`
   - All content fields now render through Prose components

2. **Prompt #2 - Quick Start: Syntax Highlighting + Progressive Disclosure** ✅
   - `CodeBlock.tsx` uses Shiki's `codeToHtml` for server-side syntax highlighting
   - `CodeBlockInteractive.tsx` handles collapse/expand with scroll compensation
   - Line numbers via CSS counters in `globals.css`

3. **Prompt #3 - "Updated" Badge → Relative Time** ✅
   - Created `lib/format-date.ts` with `formatRelativeTime` function
   - `MetadataBadges.tsx` shows relative time with ISO tooltip
   - Added "Verified" badge for `lastverified` field

4. **Prompt #4 - Section Defaults, Width, Inline-Code Styling** ✅
   - Core Understanding collapsed by default (`useState(false)`)
   - Teaser added: "6 specifications · N assumptions noted"
   - `.content-prose` max-width applied consistently
   - Inline `code` styling in `globals.css`

### Regression Audit Report (3 Prompts) - All Implemented

1. **Prompt #1 - Shiki to Build/Server Time** ✅
   - `CodeBlock.tsx` is now an async Server Component
   - `CodeBlockInteractive.tsx` handles client interactivity
   - Double-collapse conflict resolved

2. **Prompt #2 - Double-Escaped Newlines** ✅
   - `normalizeContent` function in `Prose.tsx` with defensive regex
   - Validation script updated to check for double-escaped newlines
   - Data correction applied to affected model files

3. **Prompt #3 - KaTeX Scoping + Teaser Fix** ✅
   - `body .katex { font-size: 1em !important; }` in `globals.css`
   - Teaser changed to computed summary instead of raw field concatenation

### Final Polish Audit Report (4 Prompts) - All Implemented

1. **Issue #1 - Interpretability field uses ProseInline** ✅
   - `ModelDecisionStrip.tsx` updated to use `ProseInline` for LaTeX rendering

2. **Issue #2 - Double background CSS override** ✅
   - Scoped CSS rule for Shiki's inline background

3. **Issue #3 - Scroll compensation in CodeBlockInteractive** ✅
   - `useLayoutEffect` with `getBoundingClientRect` tracking
   - `aria-expanded` added to expand/collapse button

4. **Issue #4 - Cross-linking in ModelCollapsibleSections** ✅
   - "Also Worth Knowing" chips link to real pages where available
   - `aria-controls` added to `CollapsibleSection`

### Build Verification

- `npm run build` passes successfully
- All 40 static pages generated
- 0 errors, 23 warnings (only missing content references)

### Git Status

- Pushed to `feature/repository-foundation-v2` branch
- Commit `7af1f7a` with all changes

---

# Appendix: Quick Reference

## Resource Type Quick Reference

| Resource | ML Example | Owns | Never Owns |
|----------|------------|------|------------|
| Principle | Bias-Variance | Theory, math, why | Implementation, APIs |
| Pattern | Cross-Validation | Concept, applicability | Library code, API syntax |
| Model | Random Forest | Algorithm selection | Implementation, APIs |
| Package | scikit-learn | Library API usage | Algorithm theory |
| Workflow | Classification Pipeline | End-to-end process | APIs, theory |
| Cheatsheet | scikit-learn Syntax | Syntax only | Explanations |
| Debug Guide | Data Leakage | Symptom-based troubleshooting | Tutorials |
| Decision Guide | RF vs XGBoost | Trade-off analysis | Implementation |
| Registry | Pre-trained Models | Metadata | Tutorials |

## Dependency Quick Reference

```
Principle (Foundation)
    ↓
Pattern (Concept)
    ↓
Model (Algorithm)
    ↓
Package (Implementation)
    ↓
Workflow (Process)
    ↓
Cheatsheet (Syntax)
    ↓
Debug Guide (Troubleshooting)
    ↓
Decision Guide (Trade-offs)
    ↓
Registry (Metadata)
    ↓
Problem Index (Discovery)
```

## Ownership Quick Reference

| Violation | Example | Correct Location |
|-----------|---------|------------------|
| Algorithm theory in Package | Random Forest explanation in scikit-learn | Move to Model |
| Library code in Pattern | sklearn code in Cross-Validation pattern | Remove, keep pseudo-code |
| Implementation in Model | sklearn.fit() in Random Forest model | Move to Package |
| Explanation in Cheatsheet | Theory in scikit-learn cheatsheet | Remove, keep syntax |
| Technology-first Debug Guide | "scikit-learn errors" debug guide | Rename to "Data Leakage" |
| Workflow in Package | End-to-end process in scikit-learn | Move to Workflow |

## ML-Specific Implementation Order

**Recommended sequence for ML domain integration:**

1. **Research** - Deep research into scikit-learn and ML algorithms
2. **Patterns** - Train-Test Split, Feature Scaling, Pipeline, Cross-Validation, Grid Search
3. **Models** - Logistic Regression, Random Forest
4. **Package** - scikit-learn
5. **Workflows** - Binary Classification
6. **Cheatsheet** - scikit-learn
7. **Debug Guides** - Data Leakage, Overfitting
8. **Decision Guides** - Logistic Regression vs Random Forest
9. **Registry** - Pre-trained Model Registry (if needed)
10. **Problem Index** - ML Problem Taxonomy (if needed)
11. **Principles** - Bias-Variance, No Free Lunch, Overfitting/Underfitting

---

# Implementation Status

## Model Detail Page UX Refactor (v1.2)

**Status:** ✅ Complete

All implementation items from the AENS Model Page Audit Report have been successfully completed:

### Original Audit Report (4 Prompts) - All Implemented

1. **Prompt #1 - Shared Prose/Math Rendering Primitive** ✅
   - Created `components/shared/Prose.tsx` with `Prose` and `ProseInline` components
   - Added dependencies: `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `katex`
   - Imported KaTeX CSS in `app/layout.tsx`
   - All content fields now render through Prose components

2. **Prompt #2 - Quick Start: Syntax Highlighting + Progressive Disclosure** ✅
   - `CodeBlock.tsx` uses Shiki's `codeToHtml` for server-side syntax highlighting
   - `CodeBlockInteractive.tsx` handles collapse/expand with scroll compensation
   - Line numbers via CSS counters in `globals.css`

3. **Prompt #3 - "Updated" Badge → Relative Time** ✅
   - Created `lib/format-date.ts` with `formatRelativeTime` function
   - `MetadataBadges.tsx` shows relative time with ISO tooltip
   - Added "Verified" badge for `lastverified` field

4. **Prompt #4 - Section Defaults, Width, Inline-Code Styling** ✅
   - Core Understanding collapsed by default (`useState(false)`)
   - Teaser added: "6 specifications · N assumptions noted"
   - `.content-prose` max-width applied consistently
   - Inline `code` styling in `globals.css`

### Regression Audit Report (3 Prompts) - All Implemented

1. **Prompt #1 - Shiki to Build/Server Time** ✅
   - `CodeBlock.tsx` is now an async Server Component
   - `CodeBlockInteractive.tsx` handles client interactivity
   - Double-collapse conflict resolved

2. **Prompt #2 - Double-Escaped Newlines** ✅
   - `normalizeContent` function in `Prose.tsx` with defensive regex
   - Validation script updated to check for double-escaped newlines
   - Data correction applied to affected model files

3. **Prompt #3 - KaTeX Scoping + Teaser Fix** ✅
   - `body .katex { font-size: 1em !important; }` in `globals.css`
   - Teaser changed to computed summary instead of raw field concatenation

### Final Polish Audit Report (4 Prompts) - All Implemented

1. **Issue #1 - Interpretability field uses ProseInline** ✅
   - `ModelDecisionStrip.tsx` updated to use `ProseInline` for LaTeX rendering

2. **Issue #2 - Double background CSS override** ✅
   - Scoped CSS rule for Shiki's inline background

3. **Issue #3 - Scroll compensation in CodeBlockInteractive** ✅
   - `useLayoutEffect` with `getBoundingClientRect` tracking
   - `aria-expanded` added to expand/collapse button

4. **Issue #4 - Cross-linking in ModelCollapsibleSections** ✅
   - "Also Worth Knowing" chips link to real pages where available
   - `aria-controls` added to `CollapsibleSection`

### Build Verification

- `npm run build` passes successfully
- All 40 static pages generated
- 0 errors, 23 warnings (only missing content references)

### Git Status

- Pushed to `feature/repository-foundation-v2` branch
- Commit `7af1f7a` with all changes

---

**End of Report**
```
