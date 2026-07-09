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
- **Industry adoption** - Who uses it
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
- [ ] **Difficulty** - Beginner/intermediate/advanced
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
- [ ] **Anti-patterns** - Common incorrect usage
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
- [ ] Related_workflows link to relevant workflows
- [ ] Related_cheatsheets link to relevant cheatsheets

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

### Application Fields

**Stored in JSON:**
- All identity fields (name, version, description, etc.)
- All metadata (tags, keywords, search_tokens, etc.)
- All tasks (task, syntax, example, gotchas, etc.)
- All relationships (related_content)
- All package-specific fields (install, import_as, etc.)

**Generated automatically:**
- Navigation entries (from _nav.json)
- Search index entries (from buildSearchIndex)

**Calculated:**
- Estimated reading time (from content length)

**Metadata:**
- All BaseMetaSchema fields
- Package-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Task names and descriptions
- Gotchas and decision_notes

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships with other resources

**Navigation:**
- Sidebar navigation entry
- Package listing page

**UI only:**
- Task display formatting
- Code syntax highlighting
- Example rendering

**Not stored:**
- User-specific annotations
- User-specific favorites
- Usage analytics

**Should never be stored:**
- Transient API responses
- Cached external documentation
- User-generated content

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Official documentation - API reference, tutorials, guides
- GitHub repository - README, examples, issues
- Release notes - Version changes, breaking changes

**Secondary Sources (Recommended):**
- Official blog posts - Deep dives, best practices
- Conference talks - Authoritative presentations
- Engineering blogs - Production experience from major companies

**Tertiary Sources (Optional):**
- Stack Overflow - Common issues and solutions
- Reddit - Community discussions
- YouTube - Video tutorials
- Books - Comprehensive references

**Avoid:**
- Marketing materials
- Outdated tutorials (check dates)
- Vendor-specific comparisons without verification
- AI-generated content without verification

### Common Research Mistakes

1. **Focusing on API syntax instead of mental models** - Documentation covers syntax; AENS needs understanding
2. **Ignoring production wisdom** - Tutorial examples often skip production concerns
3. **Not checking version currency** - Information may be outdated
4. **Missing library-specific gotchas** - Every library has unique pitfalls
5. **Over-collecting trivial information** - Focus on high-value knowledge
6. **Under-collecting error scenarios** - Errors are where engineers need help most
7. **Not verifying information** - Cross-check multiple sources
8. **Ignoring community consensus** - Check what practitioners actually do

### Quality Expectations

**Minimum Viable Package:**
- 5-10 common tasks
- Working code examples
- At least 3 gotchas
- Official documentation links
- Installation instructions

**Gold Standard Package:**
- Document all high-value public APIs required to cover approximately 90–95% of production usage (exact count depends on the package, e.g., 80–100 APIs for NumPy, 35–45 for Seaborn)
- Production-ready examples
- Performance characteristics
- Optimization strategies
- Testing guidance
- Debugging tips
- Comprehensive cross-links
- Verified against latest version

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
- [ ] **Difficulty** - Beginner/intermediate/advanced
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
- [ ] **Benchmarks** - Performance benchmarks
- [ ] **Deprecation timeline** - When model will be obsolete
- [ ] **Evolution trajectory** - Future direction
- [ ] **Historical context** - Why model was created
- [ ] **Mathematical foundation** - Underlying math (high-level)
- [ ] **Implementation details** - How it's implemented internally

### Writing Checklist

- [ ] Problem types are specific and actionable
- [ ] Use_when describes concrete scenarios
- [ ] Avoid_when describes concrete anti-patterns
- [ ] Pros are specific advantages, not generic praise
- [ ] Cons are specific disadvantages, not generic criticism
- [ ] Key hyperparameters are the most influential
- [ ] Comparison with alternatives is fair and balanced
- [ ] Performance characteristics are quantitative when possible
- [ ] Cross-links are bidirectional

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

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Problem types, use_when, avoid_when
- Pros, cons, key_hyperparameters
- All relationships

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Model-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Problem types
- Pros and cons

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Model category pages
- Model listing pages

**UI only:**
- Comparison tables
- Performance charts

**Not stored:**
- User-specific annotations
- Usage analytics

**Should never be stored:**
- Transient benchmark results
- Cached model weights
- Training logs

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Original research paper - First-hand description
- Official documentation - Authoritative implementation docs
- GitHub repository - Implementation details, examples

**Secondary Sources (Recommended):**
- Survey papers - Comparative analysis
- Engineering blogs - Production experience
- Conference talks - Authoritative presentations

**Tertiary Sources (Optional):**
- Textbooks - Comprehensive references
- Video lectures - Educational content
- Blog posts - Explanatory content

**Avoid:**
- Marketing materials
- Outdated papers (check citation counts)
- Vendor-specific comparisons without verification
- AI-generated summaries without verification

### Common Research Mistakes

1. **Focusing on math instead of engineering** - AENS needs practical selection criteria, not derivations
2. **Ignoring production constraints** - Academic papers often ignore real-world limitations
3. **Not comparing with alternatives** - Engineers need to choose between options
4. **Over-collecting implementation details** - Focus on selection, not implementation
5. **Under-collecting rejection criteria** - Knowing when NOT to use is as important as when to use
6. **Not verifying performance claims** - Cross-check multiple sources
7. **Ignoring industry adoption** - What works in practice vs theory
8. **Missing hyperparameter guidance** - Engineers need to know what parameters matter

### Quality Expectations

**Minimum Viable Model:**
- Clear problem types
- Specific use_when/avoid_when
- At least 3 pros and 3 cons
- At least 1 key hyperparameter
- Official documentation link

**Gold Standard Model:**
- Comprehensive problem type coverage
- Quantitative performance characteristics
- Detailed comparison with alternatives with explicit VS headers and choose/prefer trade-offs
- Detailed hyperparameter guidance mapped to exact library parameters (mono tags) with Expand/Collapse All triggers and side-by-side comparative increase/decrease columns
- Premium model detail page structure (difficulty, stability, confidence, maturity badges, with interpretability in its own callout)
- Unified 2x2 grid Decision Board & Tradeoffs grid with TOC link retention (anchor IDs intact)
- Core understanding metrics rendered in a visual 3-column specs-sheet grid with Lucide icons and mathematical callouts
- Grouped engineering considerations (Preprocessing, Runtime, and Pipeline Fit)
- Comprehensive cross-links
- Verified against latest research

---

## Workflow

**Purpose:** Process knowledge - how to build X end-to-end  
**Knowledge Owned:** Complete engineering process, step-by-step guidance, decision points  
**Engineering Value:** Provides complete implementation path, prevents getting stuck, captures production wisdom  
**Typical Examples:** Build RAG System, Train Transformer Model, Deploy ML Pipeline, Set Up MLOps

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear workflow name
- [ ] **Category** - Engineering category (LLM, MLOps, etc.)
- [ ] **Overview** - High-level description of what this builds
- [ ] **Starter stack** - Minimum required tools/libraries
- [ ] **Steps** - Array of steps (minimum 3, maximum 8)
- [ ] For each step:
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
- [ ] **Difficulty** - Beginner/intermediate/advanced
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
- [ ] **Learning order** - Recommended sequence within workflow
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

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Category, overview, starter_stack
- All steps with sub-fields
- All relationships

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Workflow-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Overview
- Step names and descriptions

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Workflow listing pages
- Category pages

**UI only:**
- Step visualization
- Progress tracking

**Not stored:**
- User-specific progress
- User-specific annotations
- Execution logs

**Should never be stored:**
- Transient execution state
- Cached intermediate results
- User-generated workflow variants

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Official documentation - Authoritative guides
- GitHub repositories - Reference implementations
- Engineering blogs - Production experience from major companies

**Secondary Sources (Recommended):**
- Conference talks - Authoritative presentations
- Technical papers - Academic sources
- Case studies - Real-world implementations

**Tertiary Sources (Optional):**
- Video tutorials - Educational content
- Community forums - Discussion and tips
- Books - Comprehensive references

**Avoid:**
- Marketing materials
- Outdated tutorials (check dates)
- Vendor-specific guides without verification
- AI-generated workflows without verification

### Common Research Mistakes

1. **Missing critical steps** - Workflows must be complete end-to-end
2. **Over-complicating starter stack** - Keep dependencies minimal
3. **Not identifying failure points** - Engineers get stuck at predictable points
4. **Skipping decision rationale** - Engineers need to know why decisions were made
5. **Not defining success criteria** - How do you know it's done?
6. **Ignoring alternatives** - There's rarely only one way
7. **Underestimating time** - Be realistic about time estimates
8. **Not verifying steps** - Each step should be tested

### Quality Expectations

**Minimum Viable Workflow:**
- Clear goal
- Minimal starter stack
- 3-5 actionable steps
- Tools identified for each step
- Failure points identified

**Gold Standard Workflow:**
- Comprehensive end-to-end process
- Detailed decision rationale
- Specific failure points with recovery
- Success criteria
- Time and skill estimates
- Optimization opportunities
- Alternative approaches
- Comprehensive cross-links
- Verified by running through

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
- [ ] **Difficulty** - Beginner/intermediate/advanced
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
- [ ] **Research papers** - Academic sources
- [ ] **Important blog posts** - Explanatory posts

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

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Concept, applicability
- Anti-patterns, implementation notes
- All relationships

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Pattern-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Concept
- Applicability

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Pattern listing pages

**UI only:**
- Concept visualization
- Example rendering

**Not stored:**
- User-specific annotations
- Usage analytics

**Should never be stored:**
- Transient implementation code
- Cached examples

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Original source - Where pattern was first described
- Official documentation - Authoritative implementation
- Engineering blogs - Production experience

**Secondary Sources (Recommended):**
- Survey papers - Comparative analysis
- Conference talks - Authoritative presentations
- Textbooks - Comprehensive references

**Tertiary Sources (Optional):**
- Video lectures - Educational content
- Blog posts - Explanatory content
- Community forums - Discussion

**Avoid:**
- Marketing materials
- Outdated sources (check dates)
- AI-generated explanations without verification

### Common Research Mistakes

1. **Being too theoretical** - Patterns need practical applicability
2. **Missing anti-patterns** - Knowing what NOT to do is critical
3. **Not providing examples** - Abstract concepts need concrete examples
4. **Over-complicating** - Patterns should be simple and memorable
5. **Under-specifying applicability** - When exactly to apply
6. **Not linking to implementations** - Engineers need to see it in code
7. **Ignoring variations** - Patterns have common variations
8. **Not verifying with practice** - Check if pattern is actually used

### Quality Expectations

**Minimum Viable Pattern:**
- Clear concept definition
- Specific applicability criteria
- At least 1 anti-pattern
- Practical implementation notes

**Gold Standard Pattern:**
- Memorable concept name
- Concrete applicability scenarios
- Comprehensive anti-patterns
- Detailed implementation guidance
- Multiple examples
- Common variations
- Comprehensive cross-links
- Verified against production usage

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
- [ ] **Difficulty** - Beginner/intermediate/advanced
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
- [ ] **Related models** - Models that trigger this error
- [ ] **Related workflows** - Workflows where this error occurs
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

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Symptoms, root_causes, solutions
- All relationships

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Debug guide-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Symptoms
- Root causes

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Debug guide listing pages

**UI only:**
- Symptom visualization
- Solution formatting

**Not stored:**
- User-specific error logs
- User-specific solutions

**Should never be stored:**
- Transient error messages
- Cached diagnostic output

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Official documentation - Error documentation
- GitHub issues - Real error reports and solutions
- Stack Overflow - Common errors and solutions

**Secondary Sources (Recommended):**
- Engineering blogs - Production debugging experience
- Conference talks - Debugging war stories
- Community forums - Discussion and solutions

**Tertiary Sources (Optional):**
- Video tutorials - Debugging walkthroughs
- Blog posts - Explanatory content

**Avoid:**
- Outdated solutions (check dates)
- Vendor-specific workarounds without verification
- AI-generated solutions without verification

### Common Research Mistakes

1. **Symptoms not specific enough** - Must be observable error messages
2. **Root causes not technical** - "user error" is not a root cause
3. **Solutions not tested** - Every solution must work
4. **Missing diagnostic steps** - How do you confirm it's this error?
5. **Not mapping solutions to causes** - Each solution should fix a specific cause
6. **Ignoring prevention** - Best debug guides prevent recurrence
7. **Not checking frequency** - Focus on common errors
8. **Under-collecting context** - When does this error occur?

### Quality Expectations

**Minimum Viable Debug Guide:**
- Specific symptoms
- At least 1 root cause
- At least 1 working solution
- Solutions map to causes

**Gold Standard Debug Guide:**
- Comprehensive symptom coverage
- Multiple root causes
- Multiple solutions per cause
- Diagnostic steps
- Prevention strategies
- Context (when it occurs)
- Frequency and severity
- Comprehensive cross-links
- Verified solutions tested in production

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

For each entry:
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
- [ ] **Difficulty** - Beginner/intermediate/advanced
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

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Package reference
- All entries with sub-fields

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Cheatsheet-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Entry problems
- Entry triggers

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Cheatsheet listing pages

**UI only:**
- Code syntax highlighting
- Entry grouping
- Search filtering

**Not stored:**
- User-specific favorites
- Usage analytics

**Should never be stored:**
- Transient code execution
- Cached API responses

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Official documentation - API reference
- GitHub repository - Examples and usage
- Package README - Quick reference

**Secondary Sources (Recommended):**
- Official blog posts - Usage patterns
- Conference talks - Best practices

**Tertiary Sources (Optional):**
- Community forums - Tips and tricks
- Video tutorials - Walkthroughs

**Avoid:**
- Outdated API references (check version)
- Marketing materials
- AI-generated code without verification

### Common Research Mistakes

1. **Snippets not copy-paste ready** - Must include imports and be runnable
2. **Notes too long** - This is a cheatsheet, not a tutorial
3. **Missing common bugs** - Engineers make predictable mistakes
4. **Not covering 80/20** - Focus on most common operations
5. **Links to homepage instead of API** - Link to specific API page
6. **Not verifying syntax** - Check against latest version
7. **Over-collecting trivial operations** - Focus on high-value operations
8. **Under-specifying triggers** - When exactly do you need this?

### Quality Expectations

**Minimum Viable Cheatsheet:**
- At least 5 entries
- Working code snippets
- Common bugs identified
- Official docs links

**Gold Standard Cheatsheet:**
- 15-60 entries covering 80/20 use cases
- Copy-paste ready snippets with imports
- Specific common bugs
- Organized by use case
- Comprehensive cross-links
- Verified against latest version
- Clear triggers for each entry

---

## Decision Guide

**Purpose:** Decision knowledge - X vs Y, which to choose  
**Knowledge Owned:** Decision criteria, comparison frameworks, tradeoff analysis  
**Engineering Value:** Enables informed decisions, prevents analysis paralysis, captures decision wisdom  
**Typical Examples:** RAG vs Fine-Tuning, PyTorch vs TensorFlow, SQL vs NoSQL, Batch vs Online Learning

### Research Checklist

#### Mandatory (Must Collect)
- [ ] **Title** - Clear decision name
- [ ] **Options** - Array of options (minimum 2)
- [ ] **Evaluation criteria** - Array of criteria (minimum 1)

For each option:
- [ ] **Name** - Option name
- [ ] **Description** - What this option is
- [ ] **Pros** - Advantages
- [ ] **Cons** - Disadvantages
- [ ] **Best for** - When to choose this option

#### Recommended (Should Collect)
- [ ] **Aliases** - Alternative names
- [ ] **Short description** - 1-2 sentence summary
- [ ] **Long description** - Comprehensive explanation
- [ ] **Domain** - Engineering domain
- [ ] **Category** - Specific category
- [ ] **Difficulty** - Beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to decide
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Recommendation** - Which option to choose and when
- [ ] **Decision framework** - How to make this decision
- [ ] **Comparison table** - Quantitative comparison
- [ ] **Related packages** - Packages involved in decision
- [ ] **Related models** - Models involved in decision
- [ ] **Related workflows** - Workflows affected by decision
- [ ] **Important blog posts** - Comparative analyses
- [ ] **Research papers** - Academic comparisons

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
- [ ] **Historical context** - Why this decision is common
- [ ] **Evolution trajectory** - How options are evolving

### Writing Checklist

- [ ] Options are real alternatives engineers consider
- [ ] Evaluation criteria are relevant decision factors
- [ ] Comparison is fair and balanced
- [ ] Recommendation is clear and justified
- [ ] Decision framework is actionable
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

#### Background Knowledge (Optional)
- **History** - Why this decision is common
- **Evolution** - How options are changing

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Options with sub-fields
- Evaluation criteria
- All relationships

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Decision guide-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Option names
- Evaluation criteria

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Decision guide listing pages

**UI only:**
- Comparison table rendering
- Decision framework visualization

**Not stored:**
- User-specific decisions
- Decision history

**Should never be stored:**
- Transient decision state
- Cached comparison results

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Official documentation - Authoritative comparisons
- Engineering blogs - Production experience with each option
- Research papers - Academic comparisons

**Secondary Sources (Recommended):**
- Conference talks - Expert opinions
- Case studies - Real-world decisions
- Community forums - Practitioner experiences

**Tertiary Sources (Optional):**
- Video lectures - Comparative analysis
- Books - Comprehensive references

**Avoid:**
- Marketing materials (vendor bias)
- Outdated comparisons (check dates)
- AI-generated comparisons without verification
- Single-source opinions (need multiple perspectives)

### Common Research Mistakes

1. **Options not real alternatives** - Must be actual choices engineers make
2. **Criteria not relevant** - Must be factors engineers care about
3. **Comparison not balanced** - Avoid bias toward one option
4. **Missing recommendation** - Engineers need guidance, not just data
5. **Not providing framework** - How should they decide for themselves?
6. **Ignoring context** - When does each option make sense?
7. **Under-collecting tradeoffs** - Every choice has tradeoffs
8. **Not verifying with practice** - Check what practitioners actually choose

### Quality Expectations

**Minimum Viable Decision Guide:**
- At least 2 real options
- At least 1 evaluation criterion
- Fair comparison
- Clear recommendation

**Gold Standard Decision Guide:**
- Comprehensive option coverage
- Multiple evaluation criteria
- Quantitative comparison table
- Clear recommendation with justification
- Actionable decision framework
- Context-specific guidance
- Comprehensive cross-links
- Verified against production experience

---

## Principle

**Purpose:** Principle knowledge - engineering principles and axioms  
**Knowledge Owned:** Fundamental principles, design axioms, engineering truths  
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
- [ ] **Difficulty** - Beginner/intermediate/advanced
- [ ] **Engineering area** - Specific subfield
- [ ] **Tags** - Relevant search tags
- [ ] **Keywords** - Search keywords
- [ ] **Search tokens** - Alternative search terms
- [ ] **Estimated reading time** - Time to understand
- [ ] **Prerequisites** - Required prior knowledge
- [ ] **Recommended next** - What to learn after
- [ ] **Implications** - What this means in practice
- [ ] **Examples** - Concrete examples
- [ ] **Anti-patterns** - Violations of this principle
- [ ] **Limitations** - When this principle doesn't apply
- [ ] **Related packages** - Packages that follow this principle
- [ ] **Related patterns** - Patterns that embody this principle
- [ ] **Related workflows** - Workflows that apply this principle
- [ ] **Important blog posts** - Explanatory posts
- [ ] **Books** - Book references

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
- [ ] **Conference talks** - Relevant presentations
- [ ] **Historical context** - Origin of principle
- [ ] **Evolution trajectory** - How principle is evolving

### Writing Checklist

- [ ] Statement is concise and memorable
- [ ] Implications are actionable
- [ ] Examples are concrete and relatable
- [ ] Anti-patterns are real violations
- [ ] Limitations are specified (principles aren't universal)
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

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Statement
- Implications, examples, anti-patterns
- All relationships

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Principle-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Statement

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Principle listing pages

**UI only:**
- Statement highlighting
- Example rendering

**Not stored:**
- User-specific annotations
- Usage analytics

**Should never be stored:**
- Transient principle applications
- Cached examples

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Original source - Where principle was first stated
- Authoritative books - Software engineering classics
- Engineering blogs - Production applications

**Secondary Sources (Recommended):**
- Conference talks - Expert perspectives
- Case studies - Real-world applications
- Community forums - Discussion and refinement

**Tertiary Sources (Optional):**
- Video lectures - Educational content
- Blog posts - Explanatory content

**Avoid:**
- Marketing materials
- Misattributed principles (verify origin)
- AI-generated principles without verification

### Common Research Mistakes

1. **Statement not memorable** - Principles should be concise and catchy
2. **Missing implications** - What does this mean in practice?
3. **Not providing examples** - Abstract principles need concrete examples
4. **Ignoring limitations** - No principle is universal
5. **Under-specifying anti-patterns** - How is it violated?
6. **Not verifying origin** - Who first stated this principle?
7. **Over-complicating** - Principles should be simple
8. **Not linking to practice** - How is this applied?

### Quality Expectations

**Minimum Viable Principle:**
- Clear, memorable statement
- At least 1 implication
- At least 1 example

**Gold Standard Principle:**
- Memorable, concise statement
- Comprehensive implications
- Multiple concrete examples
- Anti-patterns identified
- Limitations specified
- Historical context
- Comprehensive cross-links
- Verified against production practice

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

For each entry:
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
- **Criteria** - Inclusion criteria

### Application Fields

**Stored in JSON:**
- All identity fields
- All metadata
- Registry type
- All entries with sub-fields

**Generated automatically:**
- Navigation entries
- Search index entries

**Metadata:**
- All BaseMetaSchema fields
- Registry-specific metadata

**Search index:**
- Name, aliases, keywords, search_tokens
- Entry names
- Entry tasks

**Knowledge graph:**
- related_content relationships
- Bidirectional relationships

**Navigation:**
- Registry listing pages

**UI only:**
- Entry filtering
- Entry sorting
- Link rendering

**Not stored:**
- User-specific favorites
- Usage analytics

**Should never be stored:**
- Transient asset metadata
- Cached asset listings

### Research Source Recommendations

**Primary Sources (Mandatory):**
- Official registries - Hugging Face, PyPI, etc.
- Official documentation - Asset catalogs
- GitHub repositories - Asset sources

**Secondary Sources (Recommended):**
- Engineering blogs - Asset recommendations
- Conference talks - Asset showcases
- Community forums - Asset discussions

**Tertiary Sources (Optional):**
- Video tutorials - Asset walkthroughs
- Blog posts - Asset reviews

**Avoid:**
- Outdated asset listings (check dates)
- Marketing materials
- AI-generated recommendations without verification

### Common Research Mistakes

1. **Entries not consistent** - Follow consistent format
2. **Missing entry links** - Where do users get the asset?
3. **No inclusion criteria** - Why are these entries included?
4. **Outdated entries** - Verify assets still exist
5. **Under-specifying task** - What is each asset for?
6. **Not verifying links** - Check that links work
7. **Over-collecting trivial entries** - Focus on high-value assets
8. **Missing metadata** - Users need to compare assets

### Quality Expectations

**Minimum Viable Registry:**
- Clear registry type
- At least 5 entries
- Consistent entry format
- Working entry links

**Gold Standard Registry:**
- Comprehensive entry coverage
- Detailed entry metadata
- Clear inclusion criteria
- Entry comparison features
- Verified entry links
- Comprehensive cross-links
- Verified against latest sources

---

# Cross-Resource Knowledge Matrix

This matrix shows which knowledge dimensions apply to which resource types.

| Knowledge Dimension | Package | Model | Workflow | Pattern | Debug Guide | Cheatsheet | Decision Guide | Principle | Registry |
|---------------------|---------|-------|----------|---------|-------------|------------|----------------|-----------|----------|
| **Identity** |
| Name | M | M | M | M | M | M | M | M | M |
| Aliases | R | R | R | R | R | R | R | R | R |
| Short description | R | M | R | R | R | R | R | R | R |
| Long description | R | M | R | R | R | R | R | R | R |
| **Purpose** |
| Problem solved | R | M | M | - | - | - | - | - | - |
| Why it exists | O | O | O | O | O | - | O | O | - |
| Use cases | M | M | M | M | - | M | - | - | - |
| Non-use cases | M | M | M | M | - | M | - | - | - |
| **Context** |
| Prerequisites | M | R | M | R | R | R | R | R | R |
| Assumptions | R | R | R | R | R | - | R | R | - |
| **Core Concepts** |
| Mental model | M | R | R | M | - | - | - | - | - |
| Key concepts | R | R | R | M | - | - | - | - | - |
| Architecture | R | R | R | - | - | - | - | - | - |
| Internal workflow | - | R | M | - | - | - | - | - | - |
| Execution flow | - | R | M | - | - | - | - | - | - |
| Lifecycle | R | R | R | - | - | - | - | - | - |
| Input requirements | R | M | M | - | - | - | - | - | - |
| Output format | R | M | M | - | - | - | - | - | - |
| **Implementation** |
| Dependencies | M | - | M | - | - | - | - | - | - |
| Installation | M | - | - | - | - | - | - | - | - |
| Configuration | R | R | R | - | - | - | - | - | - |
| Quick start | M | - | M | - | - | - | - | - | - |
| Production example | R | - | R | R | - | - | - | - | - |
| API usage | M | - | - | - | - | M | - | - | - |
| Common API calls | M | - | - | - | - | M | - | - | - |
| Parameters | M | M | - | - | - | - | - | - | - |
| Best practices | R | R | R | R | - | - | - | - | - |
| Design patterns | R | R | R | M | - | - | - | - | - |
| **Anti-Patterns** |
| Anti-patterns | R | R | R | M | - | - | - | M | - |
| Common mistakes | M | R | R | M | - | M | - | M | - |
| Gotchas | M | R | R | R | - | M | - | - | - |
| Hidden behavior | R | R | R | - | R | - | - | - | - |
| Silent failures | R | - | R | - | R | - | - | - | - |
| Edge cases | R | R | R | - | R | - | - | - | - |
| Failure modes | - | - | M | - | M | - | - | - | - |
| **Performance** |
| Performance characteristics | R | R | R | - | - | - | - | - | - |
| Memory usage | R | R | R | - | - | - | - | - | - |
| Time complexity | - | R | - | - | - | - | - | - | - |
| GPU requirements | R | R | R | - | - | - | - | - | - |
| CPU requirements | R | R | R | - | - | - | - | - | - |
| Scalability | R | R | R | - | - | - | - | - | - |
| Optimization strategies | R | R | R | - | - | - | - | - | - |
| Bottlenecks | R | R | R | - | - | - | - | - | - |
| **Tradeoffs** |
| Tradeoffs | R | R | R | R | - | - | M | - | - |
| Advantages | - | M | - | - | - | - | R | - | - |
| Disadvantages | - | M | - | - | - | - | R | - | - |
| Alternatives | R | R | R | - | - | - | M | - | - |
| Comparison table | - | R | - | - | - | - | R | - | - |
| Decision criteria | - | M | - | - | - | - | M | - | - |
| When to use | M | M | M | M | - | M | M | - | - |
| When to avoid | M | M | M | M | - | M | M | - | - |
| **Compatibility** |
| Version differences | R | R | R | R | R | R | R | - | R |
| Migration notes | R | R | R | R | R | R | R | - | - |
| Breaking changes | R | R | R | R | R | R | R | - | - |
| Compatibility | R | R | R | R | R | R | R | - | - |
| Deprecation timeline | R | R | R | R | R | R | R | - | R |
| Evolution trajectory | O | O | O | O | O | O | O | O | O |
| **Production** |
| Deployment | R | - | R | - | - | - | - | - | - |
| Production checklist | R | - | R | - | - | - | - | - | - |
| Monitoring | R | - | R | - | - | - | - | - | - |
| Testing | R | R | R | - | - | - | - | - | - |
| Validation | R | R | R | - | - | - | - | - | - |
| Safety considerations | R | R | R | - | R | - | - | - | - |
| Security concerns | R | R | R | - | R | - | - | - | - |
| Limitations | R | R | R | R | R | - | R | R | R |
| **Debugging** |
| Debugging tips | R | R | R | - | - | - | - | - | - |
| Common errors | R | R | R | - | - | - | - | - | - |
| Error interpretation | - | - | - | - | M | - | - | - | - |
| Diagnostic tools | R | R | R | - | R | - | - | - | - |
| Recovery strategies | - | - | R | - | M | - | - | - | - |
| **Learning** |
| Learning order | O | O | O | O | O | O | O | O | O |
| Prerequisites | M | R | M | R | R | R | R | R | R |
| Recommended next | R | R | R | R | R | R | R | R | R |
| Interview questions | O | O | O | O | O | O | O | O | O |
| Real-world use cases | R | R | R | R | R | - | R | - | - |
| Industry adoption | R | R | R | R | R | - | R | - | - |
| Case studies | R | R | R | R | R | - | R | - | - |
| Research papers | O | R | O | O | O | - | R | O | - |
| Official documentation | M | M | M | M | M | M | M | M | M |
| Important blog posts | R | R | R | R | R | - | R | R | R |
| Community resources | R | R | R | R | R | - | R | R | R |
| Videos | O | O | O | O | O | O | O | O | O |
| Books | O | O | O | O | O | O | O | O | O |
| **Relationships** |
| Related workflows | R | R | - | R | R | - | R | R | - |
| Related models | R | - | R | R | - | - | R | - | - |
| Related packages | - | R | R | R | R | M | R | R | R |
| Related principles | R | R | R | R | - | - | - | - | - |
| Related patterns | R | R | R | - | - | - | - | R | - |
| Related debug guides | R | R | R | - | - | - | - | - | - |
| Related decision guides | R | R | R | - | - | - | - | - | - |
| Related registries | - | - | - | - | - | - | - | - | - |
| **Misconceptions** |
| Frequently misunderstood | R | R | R | R | R | - | R | R | - |
| Frequently confused with | R | R | R | R | R | - | R | R | - |
| FAQ | R | R | R | R | R | - | R | R | - |
| Myths | R | R | R | R | R | - | R | R | - |

**Legend:**
- M = Mandatory
- R = Recommended
- O = Optional
- - = Not applicable

---

# Mandatory Knowledge Matrix

This matrix shows only the mandatory knowledge fields for each resource type. These are the minimum requirements for a viable resource.

| Resource Type | Mandatory Fields |
|---------------|------------------|
| **Package** | Name, version, installation, import, core mental model, primary use cases, common API patterns, key parameters, common mistakes, gotchas, official docs, GitHub repo, prerequisite packages |
| **Model** | Name, problem types, use when, avoid when, pros, cons, key hyperparameters, short description, long description, official documentation |
| **Workflow** | Title, category, overview, starter stack, steps (min 3), for each step: name, description, tools, decisions, failure points |
| **Pattern** | Title, concept, applicability |
| **Debug Guide** | Title, symptoms (min 1), root causes (min 1), solutions (min 1) |
| **Cheatsheet** | Title, package reference, entries (min 1), for each entry: problem, trigger, snippet, minimal notes, common bug, docs URL |
| **Decision Guide** | Title, options (min 2), evaluation criteria (min 1), for each option: name, description, pros, cons, best for |
| **Principle** | Title, statement |
| **Registry** | Registry type, entries (min 1), for each entry: ID, name, task, description |

---

# Optional Knowledge Matrix

This matrix shows knowledge fields that are optional but can enhance resource quality.

| Resource Type | Optional Fields |
|---------------|-----------------|
| **Package** | Slug, created/updated dates, last verified, review frequency, verified against, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books, research papers, conference talks, benchmarks, comparison with alternatives, deprecation timeline, evolution trajectory, historical context, mathematical foundation, implementation details |
| **Model** | Slug, created/updated dates, last verified, review frequency, verified against, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books, conference talks, benchmarks, deprecation timeline, evolution trajectory, historical context, mathematical foundation, implementation details |
| **Workflow** | Slug, created/updated dates, last verified, review frequency, verified against, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books, conference talks, cost estimates, team size required, maintenance burden, evolution trajectory |
| **Pattern** | Slug, created/updated dates, last verified, review frequency, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books, conference talks, historical context, mathematical foundation, evolution trajectory |
| **Debug Guide** | Slug, created/updated dates, last verified, review frequency, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books, conference talks, historical context, frequency, severity, evolution trajectory |
| **Cheatsheet** | Slug, created/updated dates, last verified, review frequency, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books |
| **Decision Guide** | Slug, created/updated dates, last verified, review frequency, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books, conference talks, historical context, evolution trajectory |
| **Principle** | Slug, created/updated dates, last verified, review frequency, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books, conference talks, historical context, evolution trajectory |
| **Registry** | Slug, created/updated dates, last verified, review frequency, canonical status, lifecycle, stability, confidence, engineering maturity, owner, sources, learning order, interview questions, videos, books |

---

# Metadata vs Knowledge Mapping

This section clarifies which fields are metadata (administrative) vs knowledge (content).

## Metadata Fields (Administrative)

These fields describe the resource itself, not the engineering knowledge it contains:

- **Identity:** id, title, name, slug
- **Classification:** domain, category, difficulty, engineering_area
- **Discovery:** tags, aliases, keywords, search_tokens
- **Lifecycle:** created_at, updated_at, last_verified, review_frequency, verified_against, lifecycle, stability, confidence, engineering_maturity, canonical_status
- **Ownership:** owner
- **Sources:** sources, github_repo, docs_url

**Purpose:** Enable discovery, navigation, lifecycle management, and governance.

## Knowledge Fields (Content)

These fields contain the actual engineering knowledge:

- **Package:** install, import_as, summary, tasks, alternatives, package_specific_debugging, migration_notes
- **Model:** category (domain), problem_types, decisionsummary (summary, bestusecases, avoidwhen, strengths, limitations, interpretability, training/inference/computational characteristics), coreunderstanding (intuition, learningmechanism, assumptions, mathematicalintuition, complexity, memorycomplexity, robustness, scalability, overfittingtendency, biasvariance), hyperparameters, engineeringconsiderations, comparisons, relatedknowledge, quickstart, learning_resources
- **Workflow:** type, category, overview, starter_stack, steps
- **Pattern:** concept, applicability, anti_patterns, implementation_notes
- **Debug Guide:** symptoms, root_causes, solutions
- **Cheatsheet:** entries
- **Decision Guide:** options, evaluation_criteria
- **Principle:** statement, implications
- **Registry:** entries

**Purpose:** Deliver engineering value to practitioners.

## Relationship Fields

These fields connect knowledge across resources:

- **related_content:** Array of ContentRef with relationship_type

**Purpose:** Enable knowledge graph navigation and discovery.

---

# Research Source Recommendations

## Primary Sources (Mandatory for Most Resources)

These are the most authoritative sources and should be consulted first:

1. **Official Documentation**
   - API references
   - Official tutorials
   - Authoritative guides
   - Release notes
   - **When to use:** Always
   - **Reliability:** Highest
   - **Currency:** High (if maintained)

2. **GitHub Repositories**
   - README files
   - Examples
   - Issue trackers
   - Source code
   - **When to use:** For implementation details, common issues
   - **Reliability:** High
   - **Currency:** High

3. **Original Research Papers**
   - First-hand description of algorithms/models
   - **When to use:** For models, patterns, principles
   - **Reliability:** Highest
   - **Currency:** Varies (check citation count and date)

## Secondary Sources (Recommended)

These provide practical context and production wisdom:

1. **Engineering Blogs**
   - Company engineering blogs (Google AI, Meta AI, Netflix Tech Blog, etc.)
   - Personal blogs of practitioners
   - **When to use:** For production experience, best practices
   - **Reliability:** High (if from reputable sources)
   - **Currency:** High

2. **Conference Talks**
   - NeurIPS, ICML, CVPR, KDD, etc.
   - PyCon, TensorFlow Dev Summit, etc.
   - **When to use:** For expert opinions, cutting-edge developments
   - **Reliability:** High
   - **Currency:** High

3. **Survey Papers**
   - Comprehensive comparisons
   - Literature reviews
   - **When to use:** For model comparisons, pattern overviews
   - **Reliability:** High
   - **Currency:** Medium (check date)

## Tertiary Sources (Optional)

These provide supplementary information:

1. **Stack Overflow**
   - Common issues and solutions
   - **When to use:** For common errors, debugging tips
   - **Reliability:** Medium (verify with multiple answers)
   - **Currency:** High

2. **Reddit**
   - Community discussions
   - r/MachineLearning, r/Python, etc.
   - **When to use:** For community consensus, practical tips
   - **Reliability:** Low-Medium (verify with other sources)
   - **Currency:** High

3. **YouTube**
   - Video tutorials
   - Conference recordings
   - **When to use:** For visual explanations, walkthroughs
   - **Reliability:** Medium (check creator credibility)
   - **Currency:** High

4. **Books**
   - Comprehensive references
   - **When to use:** For foundational knowledge, deep dives
   - **Reliability:** High (if from reputable publishers)
   - **Currency:** Low-Medium (check edition date)

## Sources to Avoid

1. **Marketing Materials**
   - Vendor comparisons without verification
   - Product announcements
   - **Reason:** Bias toward specific solutions

2. **Outdated Content**
   - Tutorials from >2 years ago (for fast-moving fields)
   - Papers with low citation counts
   - **Reason:** Information may be obsolete

3. **AI-Generated Content**
   - Without verification
   - **Reason:** May contain hallucinations or inaccuracies

4. **Single-Source Opinions**
   - Without cross-verification
   - **Reason:** May be biased or incorrect

## Source Verification Checklist

Before using any source:
- [ ] Check publication date (is it current?)
- [ ] Check author credibility (are they authoritative?)
- [ ] Cross-check with other sources (is it consistent?)
- [ ] Check for bias (is there a conflict of interest?)
- [ ] Verify claims (can they be substantiated?)

---

# Common Research Mistakes

## 1. Focusing on Syntax Instead of Mental Models

**Mistake:** Collecting API signatures and parameter lists without understanding the underlying mental model.

**Why it's wrong:** Documentation covers syntax. AENS needs understanding.

**Correct approach:** Focus on how engineers should think about the tool/library/model, not just how to call it.

## 2. Ignoring Production Wisdom

**Mistake:** Relying only on tutorials and examples, which often skip production concerns.

**Why it's wrong:** Production is where engineers encounter the hardest problems.

**Correct approach:** Prioritize production experience from engineering blogs, case studies, and GitHub issues.

## 3. Not Checking Version Currency

**Mistake:** Using outdated information without verifying it's current.

**Why it's wrong:** Fast-moving fields (ML, DL, LLM) change rapidly.

**Correct approach:** Always check publication dates and verify against latest official documentation.

## 4. Missing Library-Specific Gotchas

**Mistake:** Treating all libraries/models as generic, missing unique pitfalls.

**Why it's wrong:** Every tool has unique behaviors that cause issues.

**Correct approach:** Look for library-specific warnings, common issues, and community discussions.

## 5. Over-Collecting Trivial Information

**Mistake:** Collecting too much low-value information (e.g., every API parameter).

**Why it's wrong:** Dilutes focus, increases maintenance burden.

**Correct approach:** Focus on high-value knowledge: 80/20 rule, common pitfalls, production wisdom.

## 6. Under-Collecting Error Scenarios

**Mistake:** Focusing on happy paths, ignoring failure modes.

**Why it's wrong:** Engineers need help most when things go wrong.

**Correct approach:** Collect symptoms, root causes, and solutions for common errors.

## 7. Not Verifying Information

**Mistake:** Relying on single sources without cross-verification.

**Why it's wrong:** Single sources may be biased or incorrect.

**Correct approach:** Cross-check with multiple authoritative sources.

## 8. Ignoring Community Consensus

**Mistake:** Relying on theoretical best practices without checking what practitioners actually do.

**Why it's wrong:** Theory doesn't always match practice.

**Correct approach:** Check community forums, GitHub issues, and engineering blogs for real-world usage.

## 9. Missing Context

**Mistake:** Collecting information without specifying when it applies.

**Why it's wrong:** Knowledge without context is dangerous.

**Correct approach:** Always specify use_when, avoid_when, prerequisites, and assumptions.

## 10. Under-Specifying Decision Criteria

**Mistake:** Saying "use X when appropriate" without defining "appropriate."

**Why it's wrong:** Engineers need concrete decision criteria.

**Correct approach:** Provide specific, actionable conditions for when to use vs avoid.

---

# Gold Standard Resource Checklist

This checklist defines the quality bar for gold-standard resources across all types.

## Universal Checklist (All Resource Types)

- [ ] All mandatory fields completed
- [ ] All code examples tested and working
- [ ] All external links verified and current
- [ ] All version references accurate
- [ ] Writing style follows guidelines (direct, technical, concise)
- [ ] No placeholder text or TODO comments
- [ ] All cross-links bidirectional
- [ ] All relationships use appropriate types
- [ ] Validation passes with 0 errors
- [ ] Peer-reviewed (if applicable)

## Package-Specific

- [ ] Document all high-value public APIs required to cover approximately 90–95% of production usage (exact count depends on the package)
- [ ] Each task has working code example
- [ ] Each task identifies gotchas
- [ ] Installation instructions current
- [ ] Performance characteristics documented
- [ ] Optimization strategies included
- [ ] Production patterns provided
- [ ] Testing guidance included
- [ ] Debugging tips specific to package
- [ ] Verified against latest version

## Model-Specific

- [ ] Problem types specific and actionable
- [ ] Use_when/avoid_when concrete
- [ ] Pros/cons specific (not generic)
- [ ] Key hyperparameters most influential
- [ ] Comparison with alternatives fair
- [ ] Performance characteristics quantitative
- [ ] Training/inference requirements documented
- [ ] Scalability analysis included
- [ ] Industry adoption data included
- [ ] Real-world use cases provided

## Workflow-Specific

- [ ] Complete end-to-end process
- [ ] Steps in logical order
- [ ] Each step actionable
- [ ] Decision rationale detailed
- [ ] Failure points specific
- [ ] Success criteria measurable
- [ ] Time/skill estimates realistic
- [ ] Starter stack minimal
- [ ] Optimization opportunities identified
- [ ] Alternative approaches documented

## Pattern-Specific

- [ ] Concept memorable and concise
- [ ] Applicability concrete
- [ ] Anti-patterns real mistakes
- [ ] Implementation notes practical
- [ ] Examples concrete
- [ ] Variations documented
- [ ] Cross-links comprehensive
- [ ] Verified against production usage

## Debug Guide-Specific

- [ ] Symptoms observable and specific
- [ ] Root causes technically accurate
- [ ] Solutions tested and working
- [ ] Solutions map to causes
- [ ] Diagnostic steps actionable
- [ ] Prevention strategies practical
- [ ] Context (when it occurs) included
- [ ] Frequency/severity documented
- [ ] Verified solutions tested in production

## Cheatsheet-Specific

- [ ] 15-60 entries covering 80/20 use cases
- [ ] Snippets copy-paste ready
- [ ] Snippets include imports
- [ ] Minimal notes 1-2 sentences max
- [ ] Common bugs specific
- [ ] Docs URLs link to specific API pages
- [ ] Organized by use case
- [ ] Verified against latest version

## Decision Guide-Specific

- [ ] Options real alternatives
- [ ] Evaluation criteria relevant
- [ ] Comparison fair and balanced
- [ ] Recommendation clear and justified
- [ ] Decision framework actionable
- [ ] Context-specific guidance included
- [ ] Quantitative comparison table
- [ ] Verified against production experience

## Principle-Specific

- [ ] Statement memorable and concise
- [ ] Implications actionable
- [ ] Examples concrete
- [ ] Anti-patterns real violations
- [ ] Limitations specified
- [ ] Historical context included
- [ ] Verified against production practice

## Registry-Specific

- [ ] Registry type clear
- [ ] Entries comprehensive
- [ ] Entry format consistent
- [ ] Entry metadata detailed
- [ ] Entry links verified
- [ ] Inclusion criteria specified
- [ ] Verified against latest sources

---

# Final Knowledge Collection Workflow

## Phase 1: Preparation

1. **Define Resource**
   - Determine resource type
   - Identify canonical name
   - Verify it's within AENS scope (flagship resource, not random documentation)

2. **Gather Primary Sources**
   - Official documentation
   - GitHub repository
   - Original research paper (if applicable)

3. **Initial Assessment**
   - Verify resource is current and actively maintained
   - Check industry adoption
   - Confirm it's a flagship resource (not obscure)

## Phase 2: Deep Research

4. **Collect Mandatory Knowledge**
   - Follow resource-specific mandatory checklist
   - Focus on high-value knowledge dimensions
   - Prioritize production wisdom over tutorial content

5. **Collect Recommended Knowledge**
   - Follow resource-specific recommended checklist
   - Focus on contextual knowledge that enhances understanding
   - Include practical examples and use cases

6. **Verify Information**
   - Cross-check with multiple sources
   - Verify code examples work
   - Check version currency
   - Validate technical claims

## Phase 3: Synthesis

7. **Organize Knowledge**
   - Structure according to schema
   - Ensure logical flow
   - Remove redundancy
   - Focus on actionable information

8. **Write Content**
   - Follow writing style guidelines
   - Be direct and technical
   - Use concrete examples
   - Specify context (when to use/avoid)

9. **Establish Relationships**
   - Identify related resources
   - Create bidirectional relationships
   - Use appropriate relationship types
   - Verify references exist

## Phase 4: Validation

10. **Self-Review**
    - Check against mandatory checklist
    - Verify all code examples work
    - Ensure no placeholder text
    - Confirm cross-links are bidirectional

11. **Schema Validation**
    - Run `npm run validate`
    - Fix any schema errors
    - Address any warnings
    - Ensure 0 errors

12. **Peer Review** (if applicable)
    - Have another engineer review
    - Verify technical accuracy
    - Check completeness
    - Validate cross-links

## Phase 5: Publication

13. **Final Verification**
    - Run validation one more time
    - Check all links work
    - Verify version references
    - Confirm metadata complete

14. **Commit**
    - Commit with descriptive message
    - Reference related resources
    - Note any special considerations

15. **Update Navigation**
    - Run `npm run build:nav` if needed
    - Verify navigation updates
    - Check search index

## Quality Gates

**Gate 1: Research Completeness**
- All mandatory knowledge collected
- All recommended knowledge collected (if time permits)
- Information verified with multiple sources

**Gate 2: Content Quality**
- Writing style follows guidelines
- Code examples tested and working
- No placeholder text
- Context specified (when to use/avoid)

**Gate 3: Schema Compliance**
- Validation passes with 0 errors
- All required fields present
- Bidirectional relationships established

**Gate 4: Cross-Link Integrity**
- All related_content references exist
- Bidirectional relationships verified
- Relationship types appropriate

---

# Conclusion

This report defines the complete knowledge requirements for creating AENS resources. It serves as the definitive handbook for knowledge engineers conducting Deep Research before content creation.

**Key Takeaways:**

1. **Focus on Engineering Knowledge, Not Documentation**
   - AENS preserves wisdom, not syntax
   - Prioritize mental models, decision frameworks, production wisdom
   - Level 2-4 knowledge (understanding, practice, wisdom) over Level 1 (facts)

2. **Follow the "Engineer at 2 AM" Test**
   - What knowledge would save an engineer at 2 AM?
   - Focus on high-value, actionable information
   - Prioritize error scenarios and production concerns

3. **Use the Checklists**
   - Mandatory fields are minimum requirements
   - Recommended fields enhance quality
   - Gold standard resources exceed minimums

4. **Verify Everything**
   - Cross-check multiple sources
   - Test code examples
   - Check version currency
   - Validate technical claims

5. **Establish Bidirectional Relationships**
   - Every relationship should have a reciprocal
   - Use appropriate relationship types
   - Verify references exist

**Next Steps:**

1. Use this report as the master checklist for all future resource creation
2. Adapt the research workflow to your team's process
3. Update this report as AENS evolves
4. Train knowledge engineers on these requirements

**Contact:**

For questions or clarifications about knowledge requirements, consult the Architecture Freeze document or contact the Knowledge Architecture team.

---

**Document Version:** 1.2  
**Last Updated:** July 9, 2026  
**Next Review:** July 9, 2027

