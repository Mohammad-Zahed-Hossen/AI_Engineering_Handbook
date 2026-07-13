# AENS Workflow Resource Prompt — Agentic Tool-Use System (Production Schema Aligned)

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal AI Agent Systems Engineer** responsible for designing production-grade tool-using LLM systems that reliably reason, invoke external tools, maintain execution state, and recover from failures.

Generate the workflow resource using the exact target specifications, architectural baseline, and instructions below.

---

# Target Workflow Specifications

* **Target Workflow Name:** `Agentic Tool-Use System`

* **Workflow Category:** `agentic-systems`

* **Starter Stack:** `langgraph`, `langchain`, `transformers`, `openai`, `pydantic`, `fastapi`, `redis`, `duckduckgo-search`, `tavily-python`, `httpx`

* **Optional Stack:** `smolagents`, `mcp`

* **Core Pipeline Steps:**

  1. **Task Intake & Goal Validation**
     (Tools: `Pydantic`, `FastAPI`)
  2. **Planning & Reasoning**
     (Tools: `LangGraph`, `LangChain`, `Transformers`)
  3. **Tool Discovery & Selection**
     (Tools: `LangChain Tools`, `MCP`, `HTTP clients`)
  4. **Tool Invocation & Execution**
     (Tools: `httpx`, `Python Tool`, `OpenAI Tool Calling`)
  5. **Observation Processing & State Update**
     (Tools: `LangGraph`, `Redis`)
  6. **Iterative Planning Loop**
     (Tools: `LangGraph`, `Transformers`)
  7. **Final Answer Construction**
     (Tools: `Pydantic`, `Transformers`)
  8. **Tracing, Monitoring & Production Operations**
     (Tools: `OpenTelemetry`, `LangSmith`, `Prometheus`)

* **Production Profiling Targets:**

  * Tool success rate above 95%
  * Tool execution latency below 5 seconds
  * Planning latency below 2 seconds
  * Average reasoning iterations under 10
  * Agent completion rate above 90%
  * Recovery success rate above 85%
  * External API latency below 3 seconds
  * State persistence reliability above 99%
  * Maximum tool depth under 50
  * Human handoff rate below 5%

* **Worked Examples Focus:**

  * **ReAct Research Agent:** Agent that decomposes research questions, searches multiple sources, and synthesizes findings with proper citations.
  * **Multi-Tool API Agent:** Agent that orchestrates multiple API tools to complete complex data integration tasks.
  * **Production Customer Support Agent with Persistent State:** Agent that maintains conversation context across sessions, handles tool failures gracefully, and escalates to humans when needed.

* **Canonical Evaluation Criteria:**

  * Task Completion Rate
  * Tool Success Rate
  * Tool Selection Accuracy
  * Planning Accuracy
  * Average Tool Calls
  * Execution Latency
  * Recovery Rate
  * Agent Success Rate
  * Hallucinated Tool Calls
  * Human Escalation Rate
  * External API Failure Rate
  * Cost per Completed Task

---

# Canonical Reference Implementation

Treat this workflow as implementing the following baseline production agent system unless there is a compelling engineering reason to deviate.

### Framework

* PyTorch
* Hugging Face Transformers

### Agent Runtime

* LangGraph
* LangChain

### Tool Layer

* OpenAI Tool Calling
* httpx

### State

* Redis

### Observability

* LangSmith
* OpenTelemetry
* Prometheus

### Deployment

* Docker
* Kubernetes

---

# Canonical Pipeline Architecture

Assume this workflow implements the following production agent pipeline.

User Task

→ Goal Validation

→ Planning

→ Tool Selection

→ Tool Execution

→ Observation Processing

→ Iterative Reasoning

→ Final Response

→ Monitoring

Do not reorder, remove, or introduce additional major pipeline stages unless they represent universally accepted production agent architecture.

---

# Instructions for Perplexity Content Generation

## 1. Role & Voice

> You are a **Principal AI Agent Systems Engineer** responsible for designing production-grade tool-using LLM systems that reliably reason, invoke external tools, maintain execution state, and recover from failures.

Document internal agent infrastructure for experienced AI platform engineers.

Never explain:

* what an LLM is
* what tool use means
* how agents work
* beginner API concepts

Every paragraph should help an engineer make deployment or agent architecture decisions.

---

## 2. Objective & Trade-off Philosophy

The resource must answer:

> **"How do I build a production-grade tool-using LLM system that plans tasks, selects appropriate tools, executes external actions safely, manages execution state, and reliably completes multi-step objectives under production workloads?"**

Every section should address:

### Decision Matrix

Every workflow step must include:

* Default
* Alternative
* Trade-off
* Scale Trigger
* Failure Prevented

A Decision Matrix lacking any of these fields is incomplete.

---

### Failure Envelopes

Every step must document:

* Failure
* Trigger
* Downstream Effect
* Detection
* Recovery Strategy

Pipeline-level failures must additionally include:

* Origin
* Immediate Symptom
* Downstream Propagation
* Why Debugging is Difficult
* Recommended Detection Method

---

### Composition over APIs

Focus on:

* task lifecycle
* planning and reasoning
* tool orchestration
* state management
* tool execution
* iterative loops
* observability
* failure recovery

Avoid:

* API syntax
* HTTP tutorials
* parameter documentation
* framework introductions

---

### Agentic Systems Special Rules

Because this workflow focuses on production agent systems, the following sections are **mandatory**:

#### Task Planning

Include:

* plan generation
* reasoning depth
* termination criteria

---

#### Tool Selection

Include:

* tool routing
* tool schemas
* selection heuristics

---

#### Tool Execution

Include:

* timeouts
* retries
* idempotency
* rate limiting

---

#### State Management

Include:

* scratchpad
* working memory
* conversation state
* checkpointing

---

#### Agent Safety

Include:

* permission boundaries
* tool validation
* confirmation gates
* human approval

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

Prefer evidence in this order:

1. Peer-reviewed papers
2. Official documentation
3. Agent system benchmark papers
4. Conference proceedings
5. University publications
6. Engineering blogs only when authored by framework creators or primary contributors.

Avoid:

* Medium
* personal blogs
* AI-generated summaries
* SEO articles

Every engineering recommendation must be traceable to a reputable source.

---

### Pipeline Invariants

Identify invariants such as:

* tool schema remains version compatible
* execution state survives retries
* tool outputs preserve provenance
* every observation belongs to exactly one execution step
* agent state remains deterministic after checkpoint recovery
* external side effects are idempotent
* planning loop terminates safely

Explain downstream failures when invariants are violated.

---

### Verifiability

If evidence cannot be verified:

1. omit the claim
2. use `[unverified]` only as a last resort

---

### Candidate Cross References

All AENS IDs must use real-world names.

Examples:

* langgraph
* langchain
* transformers
* redis
* llama
* mistral
* gemma
* qwen

Never invent AENS-specific slugs.

---

## 4. Citation Expectations

Use Markdown footnotes.

Every engineering claim must reference:

* research papers
* official documentation
* agent system benchmark papers
* engineering reports

Every citation must appear exactly once inside **Further Study**.

No orphan citations.

---

## 5. Hard Anti-Pattern Bans

Never include:

* introductions about AI
* beginner explanations
* motivational writing
* API references
* history lessons
* obvious advice
* generic monitoring recommendations
* duplicated documentation

---

## 6. Density & Code Standards

* **Density Limits**: Worked Example Description: 2–3 sentences max; Production Profile subsections: 2–4 sentences max; Implementation Notes: 2–4 sentences max.
* **Code Authenticity**: Code examples must never use dummy/placeholder comments or invented wrapper APIs. Use actual interfaces from LangGraph, LangChain, Transformers, Redis, OpenTelemetry, and Prometheus.
* **Step Snippets**: Every workflow step must contain a concrete 5–12 line Python snippet illustrating only the interface contract implemented by that stage.
* **Tools Alignment**: Code examples should showcase the actual libraries listed in each step's **Tools** section.

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# Agentic Tool-Use System

## Overview

Provide a 2–4 sentence overview describing the agent infrastructure being constructed, the production tool-using systems it enables, and why planning, tool orchestration, state management, and reliability become difficult under real production workloads.

---

## Starter Stack

Provide only canonical production libraries.

---

## Steps

Generate **exactly 8 sequential workflow steps**.

For each step include exactly the same schema as the original workflow prompt:

* What
* Input Interface Contract
* Output Interface Contract
* Required Metadata
* Pipeline Contract
* Tools
* Decision Matrix
* Uses
* Failure Points
* Production Metrics:
  • Primary Metric
  • Expected Range
  • Alert Threshold
* Minimal Integration Example:
  • 5–12 lines
  • Demonstrate only the interface contract implemented by this step
  • Not a complete runnable script
  • No project scaffolding
  • No installation code
  • Use only libraries declared in Starter Stack or this Step

The interface contracts must define:

* Artifact
* Type
* Ownership
* Persistence
* Consumer

The 8 steps must be:

1. Task Intake & Goal Validation
2. Planning & Reasoning
3. Tool Discovery & Selection
4. Tool Invocation & Execution
5. Observation Processing & State Update
6. Iterative Planning Loop
7. Final Answer Construction
8. Tracing, Monitoring & Production Operations

---

## Worked Examples

Provide **exactly three** worked examples:

### Example 1

ReAct Research Agent

### Example 2

Multi-Tool API Agent

### Example 3

Production Customer Support Agent with Persistent State

Each example contains:

* Description
* Language
* Code (15–40 lines)
* Implementation Notes

---

## Common Failure Points

Document **3–5 pipeline-wide failures**.

Each must include:

* Origin
* Trigger
* Immediate Symptom
* Downstream Propagation
* Why Debugging is Difficult
* Recommended Detection Method
* Recovery Strategy

Focus on agent failures such as:

* Infinite reasoning loop
* Tool hallucination
* Tool schema mismatch
* State corruption
* External API timeout
* Retry storm
* Recursive tool invocation
* Permission escalation

---

## Production Profile

Include:

### Production Deployment

LangGraph + FastAPI + Kubernetes

### Scaling & Throughput

Parallel tool execution, distributed agents

### Cost & Efficiency

Reasoning depth, tool caching, model routing

### Latency & Performance

Planning latency, tool latency, execution depth

### Observability & Monitoring

LangSmith traces, tool success metrics, execution graphs

Each subsection must discuss:

* Benefit
* Trade-off
* When not to use it
* Operational impact

---

## Evaluation Checklist

Provide measurable success criteria covering:

* Task completion rate
* Planning correctness
* Tool selection accuracy
* Tool execution latency
* Recovery success
* Maximum recursion depth
* State persistence
* Human escalation rate

---

## Further Study

Organize URLs into:

### Official Documentation

### Research Papers

### Engineering Blogs

### University Courses

### Videos

Every URL must correspond exactly to one footnote.

Populate them with agent-specific resources (LangGraph, LangChain, OpenTelemetry, Kubernetes, Redis, ReAct papers, etc.).

---

## Suggested Meta

Generate:

* Tags
* Aliases
* Keywords
* Search Tokens
* Difficulty
* Domain
* Engineering Area
* Estimated Reading Time
* Prerequisites
* Recommended Next
* Next Links
* Cross-Links

Cross-links include:

* related_models
* related_packages
* related_debug_guides
* related_patterns

All identifiers must be real-world candidate IDs requiring manual verification.

Tags should be: agentic-ai, tool-use, langgraph, reasoning, orchestration

Aliases should be: react-agent, tool-calling-agent

Keywords should be: langgraph, tool calling, reasoning loop, planning, execution

Search Tokens should be: agent workflow, tool use system, react agent, langgraph workflow

Difficulty should be: advanced

Domain should be: llm

Engineering Area should be: agents, orchestration, reasoning

Cross-links should reference real-world candidate IDs such as:

* related_models: llama, qwen, gemma, mistral
* related_packages: langgraph, langchain, transformers, redis, httpx
* related_patterns: react, planner-executor, tool-calling, state-machine, checkpointing
* related_debug_guides: tool-loop, tool-timeout, state-corruption, hallucinated-tool-call

---

# Final Validation Checklist

Before outputting, verify that:

1. Workflow category is exactly **agentic-systems**.
2. Output is semantic Markdown only.
3. Exactly **8 workflow steps** are present.
4. Every step includes a complete Decision Matrix.
5. Every step contains complete interface contracts.
6. Every step contains Production Metrics.
7. Every step contains a Minimal Integration Example.
8. Every failure analysis includes all required fields.
9. Task planning is explicitly covered.
10. Tool selection and execution are explicitly covered.
11. State management and checkpointing are explicitly covered.
12. Agent safety and human handoff are discussed.
13. Agent KPIs (task completion, tool success rate, planning accuracy) are explicitly analyzed.
14. Every engineering claim is footnoted.
15. Every footnote appears exactly once in **Further Study**.
16. All code snippets use authentic library APIs (LangGraph, LangChain, Redis, OpenTelemetry, etc.).
17. All suggested AENS IDs use real-world common naming.
18. Density constraints are respected.
19. The output focuses on production agent architecture, tool orchestration, state management, and operational reliability rather than API documentation or introductory explanations.