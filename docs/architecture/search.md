---
id: architecture-search
title: Search Architecture
type: architecture
status: active
owner: system
canonical: true
version: 2.0
related:
  - architecture-overview
  - architecture-data-flow
ai_priority: 3
---

# Search Architecture

**Date**: 2026-06-29
**Version**: 2.0

---

## Overview

AENS uses a custom search engine with tokenization, inverted indexing, and synonym expansion, combined with Fuse.js for fuzzy matching as a fallback. The search is designed to handle code syntax (e.g., `np.linalg.inv`), package aliases (e.g., `np` → `numpy`), and concept-based discovery.

---

## Tokenization

**Location**: `lib/search/tokenizer.ts`

### Tokenization Rules

1. **Dot-split**: `np.linalg.inv` → `["np", "linalg", "inv"]`
2. **Prefix segments**: `["np", "np.linalg", "np.linalg.inv"]`
3. **Package alias expansion**: `np` → also `numpy`, `torch` → also `pytorch`
4. **CamelCase split**: `CrossEntropyLoss` → `["Cross", "Entropy", "Loss", "cross", "entropy", "loss"]`
5. **Snake/kebab split**: `learning_rate` → `["learning", "rate"]`
6. **Abbreviation expansion**: `svd` → `["singular", "value", "decomposition"]`
7. **Deduplicate and lowercase**: All tokens stored lowercase

### Hardcoded Maps

**Package Aliases**:
- np ↔ numpy
- torch ↔ pytorch
- pd ↔ pandas
- sklearn ↔ scikit-learn
- tf ↔ tensorflow

**Abbreviation Expansions**:
- inv → inverse
- svd → singular value decomposition
- lstm → long short term memory
- rnn → recurrent neural network
- cnn → convolutional neural network

---

## Inverted Index

**Location**: `lib/search/inverted-index.ts`

### Structure

```typescript
interface InvertedIndex {
  tokenMap: Map<string, Set<string>>;  // token → Set<docId>
  docMap: Map<string, SearchResult>;   // docId → SearchResult
}
```

### Building

1. Collect tokens from all searchable fields
2. For each token, add docId to tokenMap
3. Store full document in docMap

### Querying

1. Split query into tokens
2. Look up each token in tokenMap
3. Score matches: `matchedTokenCount / totalQueryTokens`
4. Support prefix matching (token starts with query) with 0.7 weight
5. Return sorted results

---

## Synonym Expansion

**Location**: `lib/search/synonym-expander.ts`

### Data Sources

- `data/search/synonyms.json`: Token → synonym mappings
- `data/search/concept-groups.json`: Concept → member IDs

### Process

1. Split query into tokens
2. For each token, look up synonyms
3. For each token, look up concept groups
4. Return expanded tokens + concept group IDs

### Example

Query "embedding" → expands to:
- Tokens: ["embedding", "vector", "representation"]
- Concept group IDs: IDs of all embedding models

---

## Ranking

**Location**: `lib/search/engine.ts`

### Scoring Factors

- **Exact name match**: 1.0
- **Name prefix match**: 0.98
- **Name contains**: 0.90
- **Summary contains**: 0.85
- **Concept group membership**: 0.96
- **Inverted index match**: 0-0.95 (based on token overlap)
- **Fuse.js fuzzy match**: 0-0.45

### Aggregation

1. Query inverted index with expanded tokens
2. Boost exact/prefix/contains matches
3. Boost concept group members
4. Run Fuse.js fuzzy matching as fallback
5. Take max score from all sources
6. Sort by score descending
7. Return top N results

---

## Related Search

**Location**: `lib/search/related-search.ts`

### Scoring Factors

- Same type: +2
- Same category: +2
- Shared keywords: +1 per shared keyword
- Same parent_name: +1.5

### Use Cases

- Find related content based on current item
- Find content by concept group
- Get concepts for a given result

---

## Search Configuration

**Location**: `data/search/`

### Files

- `synonyms.json`: Token → synonym array mappings
- `concept-groups.json`: Concept → member ID array mappings

---

## Search Lifecycle

```
1. Build Time
   lib/search.ts: buildSearchIndex() [cached]
   ├─ Load all content
   ├─ Tokenize fields
   ├─ Build inverted index
   └─ Return SearchResult[]

2. Runtime
   Root layout calls buildSearchIndex() [cached]
   ↓
   SearchBox receives index
   ↓
   User types query
   ↓
   SearchBox calls engine.search(query)
   ├─ Synonym expansion
   ├─ Inverted index query
   ├─ Fuse.js fuzzy match
   └─ Score aggregation
   ↓
   SearchBox renders results
   ↓
   User clicks result → Navigate to page
```

---

## New Content Entry

When new content is added:
1. JSON file created in data/
2. `npm run build:nav` updates _nav.json
3. Next build regenerates search index
4. New content becomes searchable

---

## Searchable Fields

### Packages
- name
- summary
- tasks[].syntax (code syntax)
- tasks[].task (task description)

### Models
- name
- summary
- problem_type
- quick_start (code snippet)

### Workflows
- name
- summary
- steps[].what (step description)

### Cheatsheets
- name
- summary
- entries[].snippet (code snippet)
- entries[].problem (problem description)

### Registry
- id
- task

---

## Related Documentation

- **System Overview**: See `architecture/overview.md`
- **Data Flow**: See `architecture/data-flow.md`
- **Navigation Architecture**: See `architecture/navigation.md`
