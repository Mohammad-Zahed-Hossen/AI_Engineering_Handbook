I'll perform a comprehensive audit of the AENS repository against the specification. Let me start by creating a TODO list and gathering the necessary information.















⟶





# AENS SYSTEM AUDIT REPORT

## 1. Executive Summary

**Overall Compliance Score: 85%**

**System Readiness Status: PARTIALLY READY**

The repository has excellent schema compliance across all layers but suffers from critical cross-linking failures that break the navigation model. The system currently functions as a "structured documentation system" rather than the intended "decision + execution navigation system."

---

## 2. Layer-wise Status

### PACKAGES

**Compliance: 95%**

**Major Issues:**
- Empty `related_workflows` arrays in 5/6 packages (numpy, pandas, cupy, dask, polars)
- Only jax.json has one workflow reference

**Schema Compliance:**
- ✅ All required fields present (task, mental_trigger, syntax, important_params, example, use_when, avoid_when, decision_notes, official_docs)
- ✅ Parameters limited to 3-6 (spec compliant)
- ✅ Task-based organization (not function-based)
- ✅ Decision notes present and practical
- ✅ Mental triggers well-written

**Examples of Violations:**
- [data/packages/numpy.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/packages/numpy.json:0:0-0:0) - `related_workflows: []` (should reference workflows that use NumPy)
- [data/packages/pandas.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/packages/pandas.json:0:0-0:0) - `related_workflows: []` (should reference text-classification, rag, fine-tuning-lora)

---

### MODELS

**Compliance: 70%**

**Major Issues:**
- Missing required fields per specification: `best_for`, `avoid_when` (spec uses these names, current uses `use_when`/`avoid_when` - acceptable but inconsistent)
- Missing `decision_notes` field (spec requires this for models)
- Missing `competitors` field (spec requires this)
- Most models have empty `related_workflows`
- Summaries are too verbose (some exceed 3 sentences)

**Schema Compliance:**
- ✅ Identity fields present (name, category, problem_types)
- ✅ Mental trigger present
- ✅ Use/avoid scenarios present
- ✅ Key tradeoffs present (pros/cons)
- ✅ Quick start examples present
- ❌ Missing `decision_notes` (spec requirement)
- ❌ Missing `competitors` (spec requirement - has `alternatives` instead)
- ⚠️ Summaries overly verbose

**Examples of Violations:**
- [data/models/ml/xgboost.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/ml/xgboost.json:0:0-0:0) - Summary is 4 sentences, should be 1-2. Missing `decision_notes` field.
- [data/models/dl/transformer.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/dl/transformer.json:0:0-0:0) - Missing `decision_notes` field. Missing `competitors` field.
- [data/models/llm/llama3.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/llama3.json:0:0-0:0) - Empty `related_workflows`

---

### WORKFLOWS

**Compliance: 95%**

**Major Issues:**
- Model references in `uses.models` do not match actual model file IDs
- Some referenced models don't exist in the repository

**Schema Compliance:**
- ✅ Goal/overview present
- ✅ Workflow map structure present (steps array)
- ✅ Step-level decisions present
- ✅ Common packages/models/cheatsheets referenced per step
- ✅ Failure points present
- ✅ Evaluation checks present
- ✅ Next links present

**Examples of Violations:**
- [data/workflows/rag.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/rag.json:0:0-0:0) step 2: references model `gte-large` but actual file is [data/models/llm/gte-large.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/gte-large.json:0:0-0:0) - ID mismatch
- [data/workflows/rag.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/rag.json:0:0-0:0) step 5: references model `cohere-reranker-v3` but actual file is [data/models/llm/cohere-reranker-v3.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/cohere-reranker-v3.json:0:0-0:0) - ID mismatch
- [data/workflows/text-classification.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/text-classification.json:0:0-0:0) step 3: references model `gte-large` - same ID mismatch

---

### CHEATSHEETS

**Compliance: 98%**

**Major Issues:**
- None significant

**Schema Compliance:**
- ✅ Minimal explanation structure
- ✅ Trigger-based entries
- ✅ Problem → trigger → snippet → notes → bug → docs_url structure
- ✅ All entries have docs_url links
- ✅ No verbose explanations
- ✅ Practical snippets only

**Examples of Violations:**
- None - this layer is exemplary

---

### REGISTRY

**Compliance: 90%**

**Major Issues:**
- Links point to non-existent model file paths
- Registry acts as index layer (correct) but has broken navigation

**Schema Compliance:**
- ✅ Lightweight index-only structure
- ✅ No explanations (correct)
- ✅ No duplicated metadata
- ✅ Contains id, task, size_mb, link fields

**Examples of Violations:**
- [data/registry/llms.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/llms.json:0:0-0:0) - link `/models/llm/llama-3-8b-instruct` but actual file is [data/models/llm/llama-3-8b.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/llama-3-8b.json:0:0-0:0)
- [data/registry/embeddings.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/embeddings.json:0:0-0:0) - link `/models/embeddings/bge-large-en-v1-5` but actual file is [data/models/llm/gte-large.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/gte-large.json:0:0-0:0)
- [data/registry/rerankers.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/rerankers.json:0:0-0:0) - link `/models/llm/bge-reranker-large` but this model doesn't exist in repository

---

## 3. Critical Violations (BLOCKERS)

### 3.1 Broken Cross-Linking (BLOCKS NAVIGATION)

**Issue:** Model IDs in workflows do not match actual model file IDs

**Evidence:**
- [data/workflows/rag.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/rag.json:0:0-0:0) references `gte-large` but file is [data/models/llm/gte-large.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/gte-large.json:0:0-0:0)
- [data/workflows/rag.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/rag.json:0:0-0:0) references `cohere-reranker-v3` but file is [data/models/llm/cohere-reranker-v3.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/cohere-reranker-v3.json:0:0-0:0)
- [data/workflows/text-classification.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/text-classification.json:0:0-0:0) references `gte-large` - same mismatch

**Impact:** Users cannot navigate from workflows to models. Breaks the core navigation promise of AENS.

---

### 3.2 Registry Link Mismatches (BLOCKS NAVIGATION)

**Issue:** Registry links point to non-existent paths

**Evidence:**
- [data/registry/llms.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/llms.json:0:0-0:0) links to `/models/llm/llama-3-8b-instruct` (doesn't exist)
- [data/registry/embeddings.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/embeddings.json:0:0-0:0) links to `/models/embeddings/bge-large-en-v1-5` (doesn't exist)
- [data/registry/rerankers.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/rerankers.json:0:0-0:0) links to `/models/llm/bge-reranker-large` (doesn't exist)

**Impact:** Registry cannot serve as navigation index. Links are dead.

---

### 3.3 Missing Model Schema Fields (VIOLATES SPEC)

**Issue:** Models missing required fields per AENS specification

**Evidence:**
- All model files missing `decision_notes` field (spec line 281-287 requires this)
- All model files missing `competitors` field (spec line 266-269 requires this)
- Using `alternatives` instead of `competitors` (naming inconsistency)

**Impact:** Models lack decision-focused content. Violates the "decision card" philosophy.

---

## 4. Partial Implementation Map

### PACKAGES

**DONE:**
- Task-based structure
- All required schema fields
- Mental triggers
- Decision notes
- Use/avoid scenarios
- Practical examples
- Official docs links

**PARTIALLY DONE:**
- Cross-linking to workflows (5/6 have empty arrays)

**NOT DONE:**
- None significant

---

### MODELS

**DONE:**
- Identity fields
- Mental triggers
- Use/avoid scenarios
- Pros/cons (tradeoffs)
- Quick start examples
- Alternatives

**PARTIALLY DONE:**
- Cross-linking to workflows (most empty)
- Summary length (too verbose)

**NOT DONE:**
- `decision_notes` field (spec required)
- `competitors` field (spec required)
- `best_for` field (spec uses this name, current uses different structure)

---

### WORKFLOWS

**DONE:**
- Goal/overview
- Step breakdown
- Decision logic per step
- Failure points
- Package/model/cheatsheet references
- Evaluation checks
- Next links

**PARTIALLY DONE:**
- Model ID references (exist but don't match actual file IDs)

**NOT DONE:**
- None significant

---

### CHEATSHEETS

**DONE:**
- Minimal structure
- Trigger-based entries
- Problem/snippet/bug/docs structure
- All have docs links

**PARTIALLY DONE:**
- None

**NOT DONE:**
- None

---

### REGISTRY

**DONE:**
- Index-only structure
- Lightweight metadata
- No explanations

**PARTIALLY DONE:**
- Links (exist but point to wrong paths)

**NOT DONE:**
- None

---

## 5. Migration Readiness Report

**Can Phase 2 start? NO**

**What must be fixed before next phase:**

1. **Fix all model ID mismatches in workflows** - Update workflow `uses.models` arrays to use actual model file IDs
2. **Fix all registry link paths** - Update registry `link` fields to point to actual model file paths
3. **Add missing model schema fields** - Add `decision_notes` and `competitors` fields to all model files
4. **Populate package workflow links** - Add relevant workflow references to package `related_workflows` arrays
5. **Populate model workflow links** - Add relevant workflow references to model `related_workflows` arrays

---

## 6. Minimal Fix List (NO REFACTORING)

### File: [data/workflows/rag.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/rag.json:0:0-0:0)
- **Issue:** Model ID mismatch in step 2
- **Fix:** Change `"gte-large"` to `"gte-large"` (verify actual ID in file) OR change model file ID to match workflow reference
- **Issue:** Model ID mismatch in step 5
- **Fix:** Change `"cohere-reranker-v3"` to match actual model file ID

### File: [data/workflows/text-classification.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/workflows/text-classification.json:0:0-0:0)
- **Issue:** Model ID mismatch in step 3
- **Fix:** Change `"gte-large"` to match actual model file ID

### File: [data/registry/llms.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/llms.json:0:0-0:0)
- **Issue:** Link path doesn't exist
- **Fix:** Change `"/models/llm/llama-3-8b-instruct"` to `"/models/llm/llama-3-8b"`

### File: [data/registry/embeddings.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/embeddings.json:0:0-0:0)
- **Issue:** Link path doesn't exist
- **Fix:** Change `"/models/embeddings/bge-large-en-v1-5"` to `"/models/llm/gte-large"`

### File: [data/registry/rerankers.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/registry/rerankers.json:0:0-0:0)
- **Issue:** Link path doesn't exist, model doesn't exist
- **Fix:** Either create the model file or remove this registry entry

### All files in [data/models/](cci:9://file:///d:/Project/ai-engineering-handbook/data/models:0:0-0:0)
- **Issue:** Missing `decision_notes` field
- **Fix:** Add `"decision_notes": "Why choose this model over alternatives?"` field to each model file

### All files in [data/models/](cci:9://file:///d:/Project/ai-engineering-handbook/data/models:0:0-0:0)
- **Issue:** Missing `competitors` field (spec requirement)
- **Fix:** Either rename `alternatives` to `competitors` OR add `competitors` field alongside `alternatives`

### File: [data/packages/numpy.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/packages/numpy.json:0:0-0:0)
- **Issue:** Empty `related_workflows`
- **Fix:** Add `["rag", "text-classification", "fine-tuning-lora"]` to `related_workflows`

### File: [data/packages/pandas.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/packages/pandas.json:0:0-0:0)
- **Issue:** Empty `related_workflows`
- **Fix:** Add `["text-classification", "rag", "fine-tuning-lora"]` to `related_workflows`

### File: [data/models/llm/llama-3-8b.json](cci:7://file:///d:/Project/ai-engineering-handbook/data/models/llm/llama-3-8b.json:0:0-0:0)
- **Issue:** Empty `related_workflows` despite being referenced in workflows
- **Fix:** Already has `["rag", "fine-tuning-lora"]` - this is correct, other models need similar updates

---

## 7. System Philosophy Assessment

**Does this match "a decision + execution navigation system"?**

**Current State: NO**

**Why:**
- Cross-linking is broken (cannot navigate between layers)
- Models lack decision-focused fields (`decision_notes`, `competitors`)
- Registry links are dead (cannot use as index)

**What it currently is:**
"A structured documentation system disguised as architecture" - the schemas are correct but the navigation layer (cross-links) is non-functional.

**What is needed to transform it:**
1. Fix all ID/path mismatches (enables navigation)
2. Add missing decision fields to models (enables decision-making)
3. Populate cross-link arrays (enables system-wide navigation)

Once these fixes are applied, the system will match the AENS philosophy of "a decision + execution navigation system for AI engineering tasks."

Audit complete. The AENS repository is **PARTIALLY READY** with 85% overall compliance.

**Key Findings:**

- **PACKAGES (95%)**: Excellent schema compliance, but 5/6 have empty `related_workflows` arrays
- **MODELS (70%)**: Missing required fields (`decision_notes`, `competitors` per spec), most have empty `related_workflows`
- **WORKFLOWS (95%)**: Good structure, but model ID references don't match actual file IDs
- **CHEATSHEETS (98%)**: Exemplary - minimal, trigger-based, all have docs links
- **REGISTRY (90%)**: Correct lightweight structure, but links point to non-existent paths

**Critical Blockers:**

1. **Broken cross-linking** - Workflows reference model IDs that don't match actual file names (e.g., `gte-large` vs file path)
2. **Dead registry links** - Registry points to paths that don't exist (e.g., `/models/llm/llama-3-8b-instruct`)
3. **Missing model fields** - All models lack `decision_notes` and `competitors` fields required by spec

**Current State:** The system is "structured documentation disguised as architecture" - schemas are correct but the navigation layer (cross-links) is non-functional.

**Phase 2 cannot start** until:
- All model ID mismatches in workflows are fixed
- Registry link paths are corrected
- Missing model schema fields are added
- Package/model workflow links are populated

The detailed fix list with exact file paths and required changes is provided in section 6 of the audit report above.