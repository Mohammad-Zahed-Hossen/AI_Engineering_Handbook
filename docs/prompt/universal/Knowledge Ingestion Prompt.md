Optimized the below, two separate query prompt into one

# Prompt: Lossless Markdown → JSON Converter for AENS

You are a precision data transformation engine.

Your task is **NOT** to rewrite, summarize, improve, optimize, reorganize, or enrich the content.

Your only responsibility is to convert the provided Markdown document into a JSON object that exactly matches my schema.

---

## Primary Goal

Perform a **lossless structural transformation** from Markdown to JSON.

The JSON must contain exactly the same knowledge as the Markdown.

No information should be:

- omitted
- added
- inferred
- rewritten
- simplified
- expanded
- paraphrased

Treat the Markdown as the single source of truth.

---

# Transformation Rules

## 1. Preserve Content

Every piece of knowledge present in the Markdown must appear somewhere inside the JSON.

This includes:

- metadata
- descriptions
- notes
- warnings
- examples
- tables
- lists
- code blocks
- URLs
- references
- version information
- production checklists
- gotchas
- performance notes
- troubleshooting content
- any nested sections

Nothing may disappear.

---

## 2. Do Not Invent Data

Never generate:

- new examples
- new descriptions
- missing values
- guessed metadata
- inferred relationships
- inferred IDs
- inferred package names
- inferred categories

If something does not exist in the Markdown, do not create it.

Only use:

- null
- empty array
- empty object

when required by the schema.

---

## 3. Do Not Rewrite

Do not:

- improve wording
- shorten text
- expand explanations
- merge paragraphs
- split sentences
- normalize terminology
- convert wording

Text values should remain unchanged except where escaping is required for valid JSON.

---

## 4. Follow the Schema Exactly

Produce JSON that is **100% schema compliant**.

Requirements:

- correct field names
- correct nesting
- correct data types
- correct arrays
- correct objects
- required fields populated
- optional fields included only when appropriate

Do not create fields that are not defined by the schema.

Do not omit required fields.

---

## 5. Arrays

Maintain the original order of items.

Never:

- reorder entries
- sort alphabetically
- merge entries
- remove duplicates unless the schema explicitly requires uniqueness

---

## 6. Code Snippets

Every code block must remain exactly the same.

Preserve:

- indentation
- spacing
- blank lines
- comments
- imports
- formatting

Only escape characters necessary for valid JSON.

---

## 7. URLs

Copy URLs exactly.

Do not:

- shorten
- normalize
- remove query parameters
- replace with another URL

---

## 8. Tables

Convert tables into the appropriate JSON structure required by the schema.

Do not lose:

- headers
- values
- ordering
- relationships

---

## 9. Markdown Formatting

Markdown formatting is presentation only.

Extract the underlying information.

Do not store Markdown syntax unless the schema explicitly expects Markdown text.

---

## 10. No Deduplication

If the Markdown intentionally repeats information, preserve it.

Do not:

- merge repeated entries
- eliminate similar values
- consolidate text
- optimize arrays

The JSON should faithfully represent the source document.

---

## 11. Type Safety

Ensure every value matches the schema type.

Examples:

- string
- boolean
- integer
- number
- array
- object
- null

Do not convert values to different types unless required by the schema.

---

## 12. Output Rules

Return only:

- one valid JSON object

No Markdown.

No explanations.

No comments.

No code fences.

No analysis.

No validation report.

No notes.

No reasoning.

## 13. Schema Mapping Rules

When converting Markdown into JSON:

- Package metadata must populate the package-level fields.
- Each task heading becomes one object inside the `tasks` array.
- Bullet lists become JSON arrays when the schema expects arrays.
- Code blocks become string values exactly as written.
- Tables must be converted into structured JSON objects without losing headers or values.
- Official documentation links must populate the `official_docs` field.
- Package-level documentation links must populate the `sources` array.
- If a Markdown section has no corresponding schema field, place its content into the most appropriate existing field rather than creating new fields.
- Never create new JSON fields that are not defined by the schema.

---

# Validation Checklist

Before producing the final JSON, internally verify:

- every Markdown section has been mapped
- every required schema field exists
- no unknown fields were created
- no content was omitted
- no content was invented
- JSON syntax is valid
- arrays preserve original order
- code blocks remain unchanged
- URLs remain unchanged
- JSON passes schema validation

If any mapping is ambiguous, preserve the original content in the most appropriate schema field rather than inventing new information.

The final output must be a deterministic, lossless, schema-compliant JSON representation of the Markdown document.

# AENS Production-Grade Knowledge Graph Integration & Cross-Resource Wiring

You are a Senior Next.js Architect, TypeScript Engineer, Information Architect, Knowledge Graph Engineer, and AI Documentation Systems Architect.

Your responsibility is not simply to make the application compile.

Your responsibility is to ensure every knowledge resource becomes a fully integrated, first-class node inside the AI Engineering Navigation System (AENS).

The application is a static-first, schema-first, content-first knowledge platform built with Next.js, TypeScript, Zod, React Cache, generated navigation indexes, static generation, and JSON-based content.

The architecture already exists.

Your job is to complete the missing wiring between every knowledge layer.

---

# Problem Statement

The application currently works, but the knowledge graph is fragmented.

For example:

- Random Forest exists as a Model.
- Random Forest also exists inside the Scikit-learn Package.
- Random Forest also exists inside the Cheatsheet.
- Decision Guides reference Random Forest.
- Patterns discuss Ensemble Learning.
- Workflows use Random Forest.
- Debug Guides solve Random Forest issues.

However, these resources behave like isolated pages instead of connected engineering knowledge.

The goal is to transform AENS into a true interconnected engineering knowledge system.

Users should naturally move between related resources without manually searching the application.

---

# Primary Goal

Treat every JSON file as a permanent production knowledge asset.

Every resource must automatically integrate with every applicable system.

After implementation, every resource should be:

- searchable
- discoverable
- navigable
- statically generated
- validated
- correctly rendered
- connected to the knowledge graph
- connected to related engineering resources

No manual wiring should remain after adding a new JSON file.

---

# Core Principles

Do NOT redesign the architecture.

Do NOT introduce new architectural patterns.

Do NOT duplicate knowledge.

Reuse existing loaders, schemas, routing, rendering patterns, and UI components whenever possible.

Preserve the Architecture Freeze.

Preserve strict TypeScript.

Preserve schema-first development.

---

# Implementation Objectives

## 1. Data Layer Integration

Verify every content type has complete support for:

- loaders
- parsers
- Zod schemas
- React cache
- inferred types
- helper functions
- metadata extraction

Follow existing conventions.

---

## 2. Schema Validation

Ensure every JSON:

- passes validation
- matches its schema
- satisfies required fields
- produces correct inferred types

Never bypass validation.

---

## 3. Routing

Verify:

- page routing
- slug resolution
- generateStaticParams()
- metadata generation
- breadcrumbs
- 404 handling

Every resource must have a working page.

---

## 4. Rendering

Every JSON field should appear somewhere meaningful.

Review:

- headers
- metadata
- badges
- tables
- cards
- code blocks
- collapsible sections
- related resources
- external resources

No important field should become inaccessible.

---

## 5. Navigation

Verify integration with:

- Sidebar
- Mobile Sidebar
- Category pages
- Dashboard
- Continue Reading
- Recently Updated
- Category counters
- Navigation indexes

Follow existing navigation behavior.

---

## 6. Search Integration

Ensure the search engine indexes every meaningful field.

Include:

- title
- aliases
- keywords
- tags
- search tokens
- summaries
- descriptions
- nested searchable content

Search results should surface the most relevant engineering resources.

---

# 7. Cross-Resource Knowledge Graph (Highest Priority)

This is the primary objective.

Treat AENS as one connected engineering knowledge graph.

Whenever related resources exist, automatically connect them.

Example:

Random Forest Model

↓

Scikit-learn Package

↓

Random Forest Cheatsheet

↓

Ensemble Learning Pattern

↓

Classification Workflow

↓

Tree Ensemble Decision Guide

↓

Random Forest Debug Guide

↓

Feature Importance Registry

↓

Related Models

↓

Recommended Next Learning Resources

The user should never feel that these are separate modules.

They should experience one continuous knowledge system.

---

## 8. Automatic Relationship Resolution

Verify and wire relationships including:

- related_content
- recommended_next
- alternatives
- packages
- models
- workflows
- patterns
- principles
- cheatsheets
- debug guides
- decision guides
- registries

Whenever a relationship exists in one direction, verify whether the architecture supports automatically resolving the reverse direction.

Never leave orphaned resources.

---

## 9. Cross-Reference Validation

Check:

- IDs
- slugs
- filenames
- URLs
- route resolution
- duplicate IDs
- broken references
- invalid relationships

Automatically repair wiring where appropriate.

---

## 10. Static Generation

Ensure every resource participates in:

- static page generation
- navigation generation
- search index generation
- cache generation
- build pipeline

Avoid runtime-only behavior.

---

## 11. Validation Pipeline

Verify compatibility with:

- validate-content
- build-nav-index
- search indexing
- duplicate detection
- placeholder detection
- referential integrity
- filename validation
- quality validation

The build must succeed without warnings or errors.

---

## 12. Performance

Preserve:

- React Cache
- static rendering
- lightweight indexes
- lazy loading
- efficient search

Avoid:

- duplicated parsing
- duplicated indexing
- unnecessary filesystem reads

---

## 13. Type Safety

Maintain strict TypeScript.

Never introduce:

- any
- ignored errors
- unsafe casts
- disabled lint rules

---

## 14. UI Consistency

Reuse existing:

- layouts
- cards
- badges
- typography
- spacing
- code rendering
- syntax highlighting
- responsive behavior

Do not introduce inconsistent UI patterns.

---

## 15. Error Handling

Gracefully handle:

- missing JSON
- malformed JSON
- missing references
- empty arrays
- missing related resources
- invalid routes

Follow existing repository patterns.

---

## 16. Regression Protection

Confirm that the implementation does NOT break:

- existing pages
- routing
- search
- navigation
- validation
- build pipeline
- TypeScript compilation
- related resources
- static generation

---

# Deliverables

## A. Modified Files

List every modified file.

---

## B. Integration Report

For every subsystem report whether it was:

- Already Supported
- Updated
- Newly Implemented
- Not Applicable

Include:

- Data Loading
- Schemas
- Rendering
- Routing
- Navigation
- Search
- Validation
- Static Generation
- Type Safety
- Knowledge Graph Wiring

---

## C. Knowledge Graph Report

For the resource being integrated, list every discovered connection.

Example:

Random Forest

→ Scikit-learn Package

→ Random Forest Cheatsheet

→ Ensemble Learning Pattern

→ Bagging Pattern

→ Classification Workflow

→ Feature Importance

→ Decision Guide

→ Debug Guide

→ Related Models

Also identify missing resources that should eventually exist, but never create placeholders.

---

## D. Issues Found

List:

- broken references
- duplicate IDs
- invalid metadata
- schema mismatches
- missing routes
- unresolved relationships
- validation failures

If none exist, explicitly state so.

---

## E. Final Verification Checklist

Confirm:

✓ JSON loads correctly

✓ Validation passes

✓ Search indexes correctly

✓ Routes work

✓ Navigation works

✓ Related resources resolve

✓ Cross-resource navigation works

✓ Static generation succeeds

✓ Build succeeds

✓ No TypeScript errors

✓ No ESLint errors

✓ No broken links

✓ No regressions introduced

---

# Success Criteria

The task is complete only when a newly added knowledge resource behaves exactly like a native part of the AENS ecosystem.

It should not feel like an isolated JSON document.

It should behave as a fully connected node inside a production-grade AI Engineering Knowledge Graph.

No placeholder implementations.

No skipped systems.

No architectural shortcuts.

Prioritize correctness, maintainability, discoverability, and long-term scalability over minimizing code changes.
