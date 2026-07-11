<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Build RAG System

## Overview

This workflow wires a production-grade Retrieval-Augmented Generation (RAG) pipeline that produces a queryable, tenant-isolated vector index plus a runtime prompt-assembly service backed by a generation engine. It covers deterministic document ingestion, late-chunked global contextual embeddings, hybrid sparse+dense retrieval with RRF fusion, cross-encoder reranking, and production serving with vLLM for low-latency generation. The integration complexity arises from preserving provenance and metadata across chunking/embedding boundaries while meeting sub-second tail-latency and safe incremental indexing guarantees.[^1][^2][^3]

## Starter Stack

- pytorch
- transformers
- sentence-transformers
- faiss-cpu
- chonkie
- langchain (orchestration only)
- safetensors
- PyPDFLoader (from langchain loaders)
- BeautifulSoup
- vLLM
- BM25 implementation (e.g., rank_bm25 or Pyserini)
- SQLRecordManager (or equivalent SQL-backed record manager for incremental indexing)
- Ragas, TruLens (evaluation)


## Steps

### Step 1: Document Parsing and Metadata Extraction

* What: Parse raw document bytes into normalized text fragments and extract structural metadata (title, authors, section headers, page/byte offsets, MIME, language) without changing tokenization or content order.
    * Input Artifact: [raw_files: list of bytes + filename + mime]
    * Output Artifact: [parsed_documents: list of {doc_id, text, structure_tree, orig_offset}]
    * Required Metadata: [doc_id, filename, mime, extraction_timestamp, source_uri]
    * Primary Consumer: Document Segmentation \& Chunking
    * Pipeline Contract: “Preserve exact source offsets and produce stable doc_id that survives retries and re-ingestion.”
* Tools: PyPDFLoader, BeautifulSoup, langchain loaders (orchestration for running loaders).
* Decision:
    - Default: Use PyPDFLoader for PDFs and BeautifulSoup for HTML; produce canonical UTF-8 normalized text with preserved byte offsets. Why: precise offsets are required for provenance and highlight mapping in downstream QA UI. Prevents: loss of provenance that causes untraceable hallucinations. Deviation trigger: when source corpus is scanned images (OCR-heavy) — switch to OCR pipeline with verified OCR confidence thresholds.
* Uses:
    - packages: pytorch, langchain, beautifulsoup4, pypdf
    - models: none
    - cheatsheets: parsing-best-practices
* Failure Points:
    - Failure: Partial or failed PDF text extraction. Trigger: encrypted PDFs or malformed objects > page parse error. Downstream Effect: missing passages in index, context recall drop. Detection: ingestion error counters, mismatch between expected page count and parsed pages metric.
    - Failure: Normalization-induced character loss (e.g., ligatures). Trigger: aggressive NFKC normalization on non-UTF8 source. Downstream Effect: token mismatches between query and doc; retrieval misses. Detection: per-document tokenization checksum vs original byte-length.


### Step 2: Document Segmentation and Chunking Strategy

* What: Convert parsed_documents into overlapping chunks while preserving structural boundaries and mapping back to original offsets; produce chunk-level metadata for provenance.
    * Input Artifact: [parsed_documents: {doc_id, text, structure_tree}]
    * Output Artifact: [chunks: list of {chunk_id, doc_id, start_offset, end_offset, text, section_label, token_count}]
    * Required Metadata: [doc_id, start_offset, end_offset, section_label, original_checksum]
    * Primary Consumer: Global Contextualized Embeddings via Late Chunking
    * Pipeline Contract: “Chunks must be addressable to original offsets and be idempotent under re-chunking.”
* Tools: RecursiveCharacterTextSplitter, Chonkie
* Decision:
    - Default: Use RecursiveCharacterTextSplitter tuned to 1) target ~1,000–2,048 token chunks with 20–30% overlap, and 2) prefer section boundaries (headers) when available; use chonkie for token-aware segmentation when token counts are critical. Why: trade-off between retrieval granularity and context preservation; preserves cross-paragraph signals while limiting index size. Prevents: context fragmentation that leads to partial answers and high reranking cost. Deviation trigger: documents dominated by short micro-documents (e.g., logs) — switch to smaller fixed-size chunks (64–256 tokens) and zero overlap.
* Uses:
    - packages: chonkie, sentence-transformers, langchain
    - models: none
    - cheatsheets: chunking-guidelines
* Failure Points:
    - Failure: Silent chunk misalignment (chunks break mid-entity). Trigger: splitter configured on characters only with multibyte characters; token_count mismatches. Downstream Effect: cross-chunk coreference loss; reduced answer faithfulness. Detection: chunk tokenization-consistency check and entity-boundary checks (NER across boundaries).
    - Failure: Explosion of chunks. Trigger: converting a very long single-document without header info with too-small chunk_size and high overlap (e.g., 512 tokens with 50% overlap on multi-100k token doc). Downstream Effect: index bloat, slow ingestion, higher search latency. Detection: chunk-per-document distribution metric and ingestion time per-document.


### Step 3: Global Contextualized Embeddings via Late Chunking

* What: Produce token-level or long-context embeddings across the entire document (late chunking), then pool per chunk so embeddings encode global context beyond local chunk boundaries.
    * Input Artifact: [chunks + parsed_documents]
    * Output Artifact: [chunk_embeddings: list of {chunk_id, vector(dim), pooling_method}]
    * Required Metadata: [chunk_id, doc_id, pool_offsets, model_id, context_window_size]
    * Primary Consumer: Vector Store Indexing and Hybrid Setup
    * Pipeline Contract: “Query and document embeddings must share the same model/version and vector space; embedding metadata must record model_id and context_window used.”
* Tools: sentence-transformers, chonkie, pytorch; long-context embedder (example: jina-embeddings-v3 style model supporting 8192 tokens) for late chunking.[^4][^2][^1]
* Decision:
    - Default: Use a long-context embedding model (8192-token window) and late chunking: first compute token-level or full-document model activations, then apply per-chunk mean or attentive pooling. Why: preserves cross-paragraph information and increases context recall for long docs; prevents embedding-space fragmentation. Deviation trigger: when embed latency budget per document < 100ms and model cannot be quantized to meet it — fall back to early chunking with local-context embedder. Prevents: retrieval failures from context loss and inconsistent embeddings.
* Uses:
    - packages: sentence-transformers, chonkie, pytorch, safetensors
    - models: jina-embeddings-v3, nomic-embed-text-v1 (candidate)
    - cheatsheets: long-context-embedding-ops
* Failure Points:
    - Failure: Memory blow-up during full-document embedding. Trigger: embedding documents > model_context_tokens (e.g., >8192) without streaming or tiling. Downstream Effect: ingestion OOM, incomplete indexing. Detection: host OOM metrics, per-job memory usage, embedding-job failure logs.
    - Failure: Model-version drift between index and query-time. Trigger: index built with model-v1 but queries embed with model-v2 after rolling update. Downstream Effect: degraded retrieval (space mismatch), increased reranker load. Detection: embedding_model_id mismatch check in query pipeline and increase in retrieval failure rate.


### Step 4: Vector Store Indexing and Hybrid Setup

* What: Index chunk_embeddings into FAISS-backed dense vector index and maintain a sparse index (BM25) on the same chunk text; expose hybrid retrieval API that returns BM25 and dense candidates for RRF fusion.
    * Input Artifact: [chunk_embeddings, chunks (text + metadata)]
    * Output Artifact: [vector_index (FAISS shard), sparse_index (BM25), namespace metadata]
    * Required Metadata: [chunk_id, doc_id, embedding_model_id, shard_id, namespace]
    * Primary Consumer: Candidate Reranking with Cross-Encoders
    * Pipeline Contract: “Dense and sparse candidates must be returned with stable chunk_id and original metadata; indexes must support incremental updates and per-namespace isolation.”
* Tools: FAISS (reference), optional Qdrant/Milvus/Pinecone for managed deployments; BM25 (rank_bm25 or Pyserini); SQLRecordManager for incremental persistence.
* Decision:
    - Default: Use FAISS + on-disk IVF/PQ with a separate BM25 sparse index and perform client-side RRF fusion combining top-k from each. Why: FAISS is the proven reference for low-latency local dense retrieval and allows offline control over quantization; BM25 supplies keyword robustness; RRF fusion yields empirically better recall on mixed query types. Deviation trigger: when multi-node, HA, and geo-distributed requirements exist—migrate to sharded Qdrant/Milvus with HNSW and replication. Prevents: single-replica FAISS failure and keyword-only misses.
* Uses:
    - packages: faiss-cpu, rank_bm25, SQLRecordManager, pinecone (optional)
    - models: none
    - cheatsheets: faiss-ops, bm25-ops
* Failure Points:
    - Failure: Index inconsistency after partial incremental update. Trigger: process crash during bulk upsert leaving FAISS files partially written. Downstream Effect: missing vectors, search errors, silent retrieval accuracy loss. Detection: index checksum and record-count reconciliation between SQLRecordManager and FAISS metadata.
    - Failure: Quantization-precision regression. Trigger: switching to aggressive OPQ/PQ bits without re-evaluating MRR. Downstream Effect: recall drop, more reranker load. Detection: offline MRR/regression tests on golden queries, and increase in reranker latency/CPU.


### Step 5: Candidate Reranking with Cross-Encoders

* What: Take top-N candidates from hybrid retrieval and compute cross-encoder relevance scores to produce a final ordered candidate list and filtered context window for generation.
    * Input Artifact: [candidates: list of {chunk_id, text, dense_score, sparse_score}]
    * Output Artifact: [reranked_candidates: ordered list with cross_score and cumulative_token_count]
    * Required Metadata: [candidate_origin, retrieval_scores, reranker_model_id]
    * Primary Consumer: Context Injection and Response Generation
    * Pipeline Contract: “Reranker output must preserve chunk provenance and cumulative token accounting for prompt assembly.”
* Tools: sentence-transformers cross-encoder or transformers cross-attention ranking models.
* Decision:
    - Default: Use a cross-encoder (Bi-Encoder retrieval for narrowing to ~100 candidates, cross-encoder for top-20 rerank) running quantized on GPU/CPU with batched inference. Why: cross-encoders substantially improve precision and reduce hallucination risk by scoring joint query-document relevance. Deviation trigger: strict latency SLO <200ms for rerank—switch to a lightweight cross-encoder or score-only distilled model. Prevents: low-precision candidate lists causing generation hallucinations.
* Uses:
    - packages: sentence-transformers, transformers, safetensors
    - models: cross-encoder-ms-marco (candidate)
    - cheatsheets: reranker-operational
* Failure Points:
    - Failure: Reranker stalls (GPU memory / batch explosion). Trigger: unbounded candidate batch due to upstream returning 10k candidates. Downstream Effect: generation waits for reranker; request timeout. Detection: per-request rerank duration metric and queue length, and backpressure counters.
    - Failure: Score inversion between dense and cross-encoder (ordering changes unpredictably). Trigger: cross-encoder trained on different relevance definition than retrieval fusion. Downstream Effect: reduced user satisfaction, inconsistent results. Detection: offline label concordance checks and sudden NDCG change.


### Step 6: Context Injection and Response Generation

* What: Assemble final prompt using reranked candidates (respecting token budget and provenance), inject system and user context, and forward to vLLM (or transformers) for generation with safety and decoding constraints.
    * Input Artifact: [reranked_candidates, user_query, system_prompt_templates, token_budget]
    * Output Artifact: [generated_response: {text, used_chunks, token_usage, generation_trace}]
    * Required Metadata: [used_chunk_ids, provenance_map, generation_model_id, decoding_params]
    * Primary Consumer: Evaluation and QA UI
    * Pipeline Contract: “Generated output must include used_chunks provenance and token accounting; model and prompt template versions must be recorded.”
* Tools: transformers for smaller models; vLLM for low-latency speculative decoding, dynamic batching, and quantized weights.
* Decision:
    - Default: Serve generation through vLLM with speculative decoding and dynamic batching using INT8/INT4 quantized models where possible; enforce a hard token budget with chunk-level truncation by descending reranker score. Why: vLLM's speculative decoding and batching provide best-in-class latency/throughput trade-offs for many-serving scenarios. Deviation trigger: if model requires full FP16 fidelity for specific hallucination-sensitive tasks—use GPU FP16 transformer serving. Prevents: tail latency spikes and throughput collapse under burst traffic.
* Uses:
    - packages: vLLM, transformers, safetensors
    - models: llama-family or other tuned generator (candidate)
    - cheatsheets: generation-ops
* Failure Points:
    - Failure: Context overflow/truncation. Trigger: cumulative token count of selected chunks exceeds model context or prompt budget. Downstream Effect: silent truncation of crucial evidence, leading to hallucinations. Detection: generation_trace token_budget_exceeded flag and proportion of responses with missing provenance.
    - Failure: Speculative decoding divergence. Trigger: aggressive speculative ratio under high temperature resulting in incoherent outputs. Downstream Effect: decreased response quality. Detection: generation quality sampling and perplexity drift metrics.


### Step 7: System Evaluation and Quality Checks

* What: Run automated and periodic tests to measure Context Precision/Recall, Faithfulness, and Answer Relevance using golden query suites and logs-based sampling; feed metrics back into data pipelines.
    * Input Artifact: [generated_responses, golden_dataset, telemetry]
    * Output Artifact: [evaluation_report: {offline_metrics, production_metrics, drift_alerts}]
    * Required Metadata: [dataset_ids, model_versions, eval_timestamp]
    * Primary Consumer: Pipeline owners, retraining/reindexing workflows
    * Pipeline Contract: “Evaluation must tie metrics to exact model_id, index_snapshot_id, and records used for each response.”
* Tools: Ragas (for structured RAG evaluation) and TruLens for behavioral monitoring.
* Decision:
    - Default: Maintain continuous evaluation with Ragas for offline metric computation and TruLens for online behavior/fidelity monitoring; run golden-slate regression tests on every index/model change. Why: keeps retrieval/generation fidelity traceable and enables targeted rollbacks. Deviation trigger: when SLA forbids production-sampled ground-truth queries (privacy) — use synthetic query augmentation and stricter offline tests. Prevents: silent degradation after model or index change.
* Uses:
    - packages: ragas, trulens-ai, pandas (for reports)
    - models: none
    - cheatsheets: evaluation-guides
* Failure Points:
    - Failure: Metric drift unnoticed. Trigger: evaluation job failure or stale golden dataset. Downstream Effect: undetected quality regressions in production. Detection: evaluation job success heartbeat and golden-dataset freshness monitor.
    - Failure: Data leakage between eval and training. Trigger: using production queries with ground truth that also exist in training. Downstream Effect: inflated metrics. Detection: dataset hash intersection tests and data provenance audits.


## Worked Examples

### Example: Hybrid Search RAG with RRF

* Description: Combine BM25 sparse scores and FAISS dense scores using Reciprocal Rank Fusion (RRF) to create a high-recall candidate set that is then cross-encoded and used for context assembly. This handles mixed informational and keyword-heavy queries.
* Language: python
* Code:

```python
# python - hybrid retrieval with RRF fusion (conceptual integration script)
from rank_bm25 import BM25Okapi
import faiss, numpy as np
from sentence_transformers import SentenceTransformer
from collections import defaultdict

# inputs: tokenized_corpus (list[list[str]]), chunk_texts (list[str]), dense_embeddings (np.array)
bm25 = BM25Okapi(tokenized_corpus)
dense_index = faiss.IndexFlatIP(dense_embeddings.shape[^1])
dense_index.add(dense_embeddings)

def rrf(scores_list, k=50, rrf_k=60):
    # scores_list: list of lists of (doc_id, score) ordered desc
    agg = defaultdict(float)
    for ranklist in scores_list:
        for rank, (doc_id, _) in enumerate(ranklist, start=1):
            agg[doc_id] += 1.0 / (rrf_k + rank)
    # return top-k doc_ids by aggregated score
    return sorted(agg.items(), key=lambda x: -x[^1])[:k]

def hybrid_query(query, top_k=100):
    q_tokens = query.split()
    bm25_scores = bm25.get_scores(q_tokens)
    bm25_list = [(i, float(s)) for i,s in enumerate(bm25_scores)]
    bm25_list.sort(key=lambda x: -x[^1])

    q_vec = SentenceTransformer('all-mpnet-base-v2').encode([query])[^0]
    D, I = dense_index.search(np.array([q_vec]).astype('float32'), top_k)
    dense_list = [(int(i), float(D[0,idx])) for idx,i in enumerate(I[^0])]

    fused = rrf([bm25_list[:top_k], dense_list[:top_k]], k=top_k, rrf_k=60)
    return [doc_id for doc_id,score in fused]
```

* Implementation Notes: RRF k parameter defaults to 60 as the aggregation constant; retrieve top-100 from each engine before fusion; preserve original chunk metadata for the top-k for reranker input; compute BM25 on preprocessed tokens matching embedding tokenization where possible to reduce tokenization mismatch.


### Example: Late Chunking Implementation

* Description: Use a long-context embedder to compute document-level token activations, then mean-pool per precomputed chunk boundaries to produce chunk embeddings that encode cross-chunk context. This preserves referential links across paragraphs without duplicating embedding work.
* Language: python
* Code:

```python
# python - late chunking conceptual snippet
from chonkie import TokenWindowizer  # conceptual; use chonkie tokenizer utilities
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('jina-embeddings-v3')  # long-context embedder
token_windows = TokenWindowizer(window=8192, stride=8192)  # produce token windows per doc

def late_chunk_embeddings(doc_text, chunk_boundaries):
    # token_windows returns token-level mappings for the entire doc as windows
    token_activations = []
    for token_block in token_windows(doc_text):
        activations = model.encode(token_block['text'], show_progress_bar=False, convert_to_numpy=True)
        token_activations.extend(activations)  # align activations to token indices
    # chunk_boundaries: list of (start_token, end_token)
    chunk_vecs = []
    for s,e in chunk_boundaries:
        vec = np.mean(token_activations[s:e], axis=0)
        chunk_vecs.append(vec)
    return np.vstack(chunk_vecs)
```

* Implementation Notes: Use model context window (8192) as block size; ensure tokenization mapping between chunk boundaries and model tokens is deterministic; quantize embeddings to float16 for FAISS storage if disk/ram limited.


## Common Failure Points

- Failure: Model/Index Version Mismatch
    - Origin: Rolling update without coordinated index rebuild.
    - Trigger: index built with embedding-model:v1 while serving uses embedding-model:v2.
    - Immediate symptom: sharp drop in retrieval metrics (MRR/NDCG) and increased reranker runtimes.
    - Downstream propagation: higher generation hallucinations, more user re-queries.
    - Why debugging is difficult: surface logs show “no errors” — only subtle metric drift; requires cross-referencing index metadata and embedder versions.
    - Recommended detection: compare embedding_model_id in query metadata to index snapshot metadata on every request; alert on mismatch rate >0.1%.[^1]
- Failure: Silent Context Truncation at Generation
    - Origin: Prompt assembly not enforcing cumulative token budget with provenance tracking.
    - Trigger: selecting reranked chunks whose cumulative tokens exceed model context.
    - Immediate symptom: responses that omit referenced evidence; provenance lists shorter than expected.
    - Downstream propagation: faithfulness metrics fall; user complaints.
    - Why debugging is difficult: truncation is silent at model-level; logs show full candidate list but generation_trace shows truncated input.
    - Recommended detection: generation_trace token_budget_exceeded flag and percentage of responses with provenance mismatch.
- Failure: Index Partial Writes and Corruption
    - Origin: Bulk upsert interrupted (OOM / process kill) leaving index files inconsistent with SQLRecordManager.
    - Trigger: ingestion time spike or resource OOM during large batch >10k chunks.
    - Immediate symptom: search returns fewer vectors than expected or crashes on lookup.
    - Downstream propagation: retrieval errors, degraded recall, user-visible gaps.
    - Why debugging is difficult: FAISS file partially written still mounts, producing silent incorrect behavior.
    - Recommended detection: daily reconciliation job comparing SQLRecordManager count vs FAISS index.count and CRC checksums.
- Failure: Reranker-induced Latency Deadlock
    - Origin: Upstream returns unbounded candidate list; reranker uses synchronous batching and blocks generation.
    - Trigger: sudden spike of complex queries returning >5k candidates.
    - Immediate symptom: request latency > SLA and queue growth.
    - Downstream propagation: system-wide request queueing and timeouts.
    - Why debugging is difficult: root cause appears in reranker, but symptoms look like general latency spike.
    - Recommended detection: monitor per-stage tail latencies and queue lengths; assert max_candidates_allowed at retrieval stage.


## Production Profile

### Production Deployment

- Benefit: Use SQLRecordManager (or equivalent) for incremental index bookkeeping and idempotent ingest; namespace isolation by tenant for multi-tenancy and RBAC.
Trade-off: requires transactional coordination between SQL writes and FAISS file commits.
When not to use it: single-user prototypes where index rebuilds are cheap.
Operational impact: adds a small write-latency but enables safe rollbacks and per-namespace pruning.


### Scaling \& Throughput

- Benefit: Migrate from single-file FAISS to sharded HNSW in Qdrant/Milvus when index size or QPS exceeds single-node capabilities. Use dynamic batching and vLLM speculative decoding for generation throughput.
Trade-off: operational complexity and network overhead in vector RPCs.
When not to use it: low-QPS single-region deployments.
Operational impact: reduces per-query latency at scale, increases operational cost.


### Cost \& Efficiency

- Benefit: Quantize embeddings and generation models (INT8/INT4) where acceptable to reduce GPU memory and enable CPU inference for reranking.
Trade-off: slight accuracy loss; requires offline evaluation.
When not to use it: tasks requiring highest fidelity (e.g., legal text notarization).
Operational impact: lowers cloud GPU hours, increases CPU usage for some components.


### Latency \& Performance

- Benefit: Targeted budget: 50–100ms embedding (per-query or cached), 80–200ms vector search, 100–300ms reranking, 500ms–2s generation (model dependent); use cached query embeddings and warmed vLLM pools.
Trade-off: meeting aggressive budgets requires pre-warmed GPUs and higher cost.
When not to use it: batch offline analytic retrieval.
Operational impact: requires autoscaling policies tuned for tail-loads and warm pools.


### Observability \& Monitoring

- Benefit: Track: per-stage latency percentiles, candidate counts, token budget violations, embedding_model_id alignment rate, index vs SQL record reconciliation, golden-query NDCG.
Trade-off: more metrics to store and alert on.
When not to use it: none — observability is required.
Operational impact: enables fast detection of integration failures described above.


## Evaluation Checklist

- Offline quality metrics: Context Precision (fraction of injected chunks that contain ground-truth answer) and Context Recall (ground-truth evidence coverage), measured on a labeled golden set with NDCG and MRR baselines.[^1]
- Online serving metrics: 95th/99th percentile end-to-end latency within SLO (e.g., P95 < 1.5s for typical generation flows) and per-stage latency budgets (embedding, retrieval, rerank, generation) as described in Production Profile.[^3]
- Operational health metrics: index vs SQL record reconciliation (counts equal), per-node memory headroom (>10% free on startup), and percentage of responses with provenance attached.
- Regression detection metrics: daily run of golden-slate tests with alert on >3% drop in Context Precision or MRR vs baseline.
- Safety/faithfulness checks: sample and run automated truthfulness heuristics (Ragas scripts) and flag model outputs with low evidence overlap.


## Sources

- Late Chunking: "Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models".[^2][^1]
- Jina embeddings and long-context embedding guidance (jina.ai posts).[^5][^2]
- Long-context embedding model release notes (jina-embeddings-v3).[^4]
- vLLM speculative decoding and dynamic speculative decoding docs.[^6][^3]
- Related late-chunking community examples and code notes.[^7]

(Each of the numbered citations above maps to the URLs listed here 1:1.)

## Suggested Meta

* Tags: rag, retrieval, embeddings, late-chunking, vllm, faiss
* Aliases: rag-pipeline, rag-late-chunking
* Keywords: late-chunking, rrf, hybrid-search, cross-encoder, vector-indexing
* Search Tokens: RAG hybrid retrieval, late chunking 8192, rrf bm25 faiss, vllm speculative decoding
* Difficulty: expert
* Domain: llm
* Engineering Area: retrieval, inference, orchestration
* Estimated Reading Time: 14
* Prerequisites: sentence-transformers, faiss-cpu, pytorch, transformers, chonkie
* Recommended Next: large-context-serving, index-sharding-patterns, generation-safety-patterns
* Next Links: serve-vllm, shard-vector-index
* Cross-Links:
    - related_models: jina-embeddings-v3, nomic-embed-text-v1, cross-encoder-ms-marco
    - related_packages: faiss-cpu, chonkie, sentence-transformers, vllm
    - related_debug_guides: index-corruption-debug, reranker-latency-debug
    - related_patterns: hybrid-search-rrf, late-chunking

***
Final validation notes: Category is rag; every Step contains the required contract fields; Decisions specify defaults, rationales, deviation triggers, and failures prevented; per-step failure modes and pipeline-level failures include detection methods; worked examples use only starter stack tools; sources reconcile to the cited URLs above.[^2][^3][^7][^4][^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^8][^9]</span>

<div align="center">⁂</div>

[^1]: http://arxiv.org/pdf/2409.04701.pdf

[^2]: https://jina.ai/news/late-chunking-in-long-context-embedding-models/

[^3]: https://docs.vllm.ai/en/latest/features/speculative_decoding/

[^4]: https://arxiv.org/pdf/2409.10173.pdf

[^5]: https://jina.ai/news/what-late-chunking-really-is-and-what-its-not-part-ii/

[^6]: https://docs.vllm.ai/en/latest/features/speculative_decoding/dynamic_speculative_decoding/

[^7]: https://ossaihub.com/code/late-chunking-jina/

[^8]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^9]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^10]: CONTENT_QUALITY_STANDARD.md

[^11]: ARCHITECTURE_FREEZE.md

[^12]: AENS Knowledge Layer Specification.md

[^13]: https://arxiv.org/pdf/2402.01613.pdf

[^14]: https://aclanthology.org/2023.nlposs-1.2.pdf

[^15]: http://arxiv.org/pdf/2405.13226.pdf

[^16]: https://arxiv.org/html/2502.01803

[^17]: https://arxiv.org/html/2410.11119v1

[^18]: http://arxiv.org/pdf/2402.17463.pdf

[^19]: https://docs.vllm.ai/en/v0.8.0/features/spec_decode.html

[^20]: https://jina.ai/zh-TW/news/migration-from-jina-embeddings-v2-to-v3/

[^21]: https://jina.ai/ja/news/migration-from-jina-embeddings-v2-to-v3/

[^22]: https://jina.ai/zh-TW/news/late-chunking-in-long-context-embedding-models/

[^23]: https://jina.ai/news/still-need-chunking-when-long-context-models-can-do-it-all/

