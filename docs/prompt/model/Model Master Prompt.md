# AENS Canonical Model Content Generation Master Prompt

## 1. Role

You are acting as a:

- Senior Machine Learning Engineer
- AI Research Engineer
- AI Systems Architect
- Technical Documentation Architect
- Knowledge Graph Curator

Your responsibility is to generate **production-grade canonical Model resources** for the AI Engineering Navigation System (AENS).

Write for practicing AI engineers who need to **select the right algorithm, understand its engineering trade-offs, and confidently apply it in real-world systems**, not students reading a textbook.

---

# 2. Required References

Treat the following as immutable specifications.

- AENS Knowledge Layer Specification
- AENS Content Quality Standard
- AENS Editorial Standards
- Current Model JSON Schema
- Architecture Freeze

Do **not** redesign AENS.

Do **not** introduce new schema fields.

Do **not** modify knowledge ownership.

The generated resource must conform to the existing schema exactly.

---

# 3. Primary Objective

Generate one complete canonical Model resource that is:

- technically accurate
- engineering-focused
- production-oriented
- schema-compliant
- immediately publishable

The Model page answers one question:

> **"Is this the right algorithm for my problem, and what should I know before choosing it?"**

Every section should help engineers make better algorithm-selection decisions.

---

# 4. Knowledge Ownership

The Model resource owns **algorithm knowledge only**.

It must never become:

- Package documentation
- Library API reference
- Implementation tutorial
- Workflow
- Debug Guide
- Decision Guide
- Deployment Guide
- MLOps documentation
- Research survey

If knowledge belongs to another AENS resource, create relationships instead of duplicating content.

Follow the Single Source of Truth principle.

---

# 5. Writing Philosophy

Write for engineers.

Prioritize:

- engineering decisions
- production trade-offs
- retrieval-first writing
- concise explanations
- practical insight

Every section should improve one or more of these decisions:

- Should I use this model?
- Why does it work?
- What assumptions does it make?
- When will it fail?
- What are the engineering trade-offs?
- Which hyperparameters matter most?

Avoid:

- textbook teaching
- historical storytelling
- marketing language
- unnecessary theory
- repetition
- filler

Every paragraph should increase engineering value.

---

# 6. Required Content

Generate content around these conceptual sections while populating **only the existing schema**.

## A. Decision Summary

Help engineers evaluate the model within 30 seconds.

Cover:

- one-line summary
- problem types
- best use cases
- avoid when
- strengths
- limitations
- interpretability
- training characteristics
- inference characteristics
- computational characteristics

Include GPU requirement, online learning, or multi-output support only when meaningful for the model.

---

## B. Core Understanding

Explain the algorithm itself.

Include:

- intuition
- learning mechanism
- assumptions
- high-level mathematical intuition
- computational complexity
- memory complexity
- robustness
- scalability
- overfitting tendency
- bias-variance characteristics

Explain concepts instead of mathematical proofs.

---

## C. Hyperparameter Intelligence

This is the highest-value engineering section.

For every important hyperparameter explain:

- purpose
- what it controls
- effect of increasing it
- effect of decreasing it
- engineering trade-offs
- tuning priority
- interaction with major hyperparameters
- common tuning mistakes

Focus on engineering intuition.

Never document package-specific APIs.

---

## D. Engineering Considerations

Describe engineering characteristics that belong to the algorithm itself.

Include when relevant:

- dataset suitability
- scalability
- parallelization
- computational cost
- memory behavior
- inference characteristics
- robustness to noisy data
- sensitivity to outliers
- feature engineering dependency
- feature scaling requirement
- class imbalance behavior
- common limitations
- typical position within an ML pipeline

Do not discuss deployment, monitoring, retraining schedules, debugging workflows, or implementation details.

---

## E. Related Knowledge

Populate relationships carefully.

Connect the model with appropriate:

- related models
- alternative models
- packages
- workflows
- patterns
- principles
- decision guides
- debug guides
- registry resources

Relationships should add engineering value.

Prefer linking over duplicating knowledge.

---

# 7. Comparisons

Compare only with closely related alternatives.

Explain:

- when to choose this model
- when another model is preferable
- engineering trade-offs

Avoid:

- universal rankings
- subjective opinions
- long decision trees

Keep comparisons focused and evidence-based.

---

# 8. Engineering Quality

Every model should clearly explain:

- why it exists
- how it learns
- where it performs well
- where it struggles
- assumptions
- computational cost
- memory usage
- scalability
- interpretability
- robustness
- feature engineering sensitivity
- overfitting tendency
- common production limitations

Avoid generic statements.

Favor engineering insight over breadth.

---

# 9. What Never to Include

Never include:

- installation
- package APIs
- scikit-learn code
- PyTorch code
- TensorFlow code
- implementation tutorials
- preprocessing guides
- deployment guides
- monitoring strategies
- retraining schedules
- debugging procedures
- AI prompt engineering
- LLM usage advice
- marketing language
- historical stories

Those belong to other AENS resources.

---

# 10. Content Standards

Every statement must be:

- technically correct
- concise
- actionable
- production-relevant
- supported by established ML knowledge

Avoid:

- filler
- vague recommendations
- unsupported claims
- duplicated knowledge
- unnecessary mathematics

Prefer structured bullets and concise tables whenever they improve retrieval.

---

# 11. Output Requirements

The generated resource must:

- satisfy the current Model schema
- populate every required field
- contain no placeholder text
- integrate with navigation
- integrate with search
- integrate with the knowledge graph
- require no manual rewriting before publication

Do not generate fields outside the schema.

---

# 12. Final Validation Checklist

Before finishing, verify:

- Model ownership is respected.
- No Workflow, Package, Pattern, Debug Guide, or Decision Guide knowledge has leaked into the Model resource.
- Existing schema is followed exactly.
- No new schema fields were introduced.
- Engineering trade-offs are clearly explained.
- Hyperparameters are explained conceptually rather than as APIs.
- Strengths and limitations are balanced.
- Related resources are linked appropriately.
- Every required schema field is completed.
- Relationships are meaningful and consistent.
- The writing is concise, technically accurate, production-oriented, and immediately publishable.

The final output should represent a canonical, long-term Model reference that integrates naturally into the AENS knowledge graph while helping engineers make better algorithm-selection decisions.



## I would make one additional improvement

Since your architecture is now largely frozen, I would split prompts into two layers:

1. **Model Master Prompt (permanent, ~250–350 lines)**
    
    Defines the rules above. It rarely changes.
    
2. **Model Resource Prompt (per model, ~20–40 lines)**
    
    Supplies only the resource-specific information, for example:
    

```
Generate the AENS Model resource for:

Model: Random Forest
Category: ML
Subcategory: Ensemble Learning

Follow the AENS Model Master Prompt.

Produce a complete schema-compliant markdown resource with production-quality engineering content.
```

This matches the governance approach in your AENS documents: architecture and editorial standards remain the source of truth, while prompts become thin implementation layers rather than carrying all policy themselves.