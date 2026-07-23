---
id: architecture-repository
title: Repository Structure
type: architecture
status: active
owner: system
canonical: true
version: 2.0
related:
  - architecture-overview
  - architecture-data-flow
ai_priority: 4
---

# Directory Structure

```
├─ .gitignore
├─ aens.config.json
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ tsconfig.json
├─ app/
│  ├─ error.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ not-found.tsx
│  ├─ page.tsx
│  ├─ api/
│  │  └─ registry/
│  │     └─ search/
│  │        └─ route.ts
│  ├─ cheatsheets/
│  │  ├─ [id]/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ debug-guides/
│  │  ├─ [id]/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ decision-guides/
│  │  ├─ [id]/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ models/
│  │  ├─ [category]/
│  │  │  ├─ [id]/
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ packages/
│  │  ├─ [id]/
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ PackageListClient.tsx
│  ├─ patterns/
│  │  ├─ [id]/
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ PatternFilterClient.tsx
│  ├─ principles/
│  │  ├─ [id]/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ problem-index/
│  │  ├─ page.tsx
│  │  └─ ProblemIndexDashboard.tsx
│  ├─ registry/
│  │  ├─ [task]/
│  │  │  └─ page.tsx
│  │  ├─ families/
│  │  │  ├─ [family]/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [variant]/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  └─ workflows/
│     ├─ [id]/
│     │  └─ page.tsx
│     └─ page.tsx
├─ components/
│  ├─ layout/
│  │  ├─ DarkModeToggle.tsx
│  │  ├─ MobileSidebarTrigger.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ TopBar.tsx
│  ├─ principles/
│  │  ├─ AppearsInGroup.tsx
│  │  ├─ DecisionChecklist.tsx
│  │  ├─ EngineeringConsequenceCard.tsx
│  │  ├─ MentalModelDisplay.tsx
│  │  ├─ MisconceptionRow.tsx
│  │  └─ TradeoffComparison.tsx
│  ├─ registry/
│  │  ├─ DeploymentProfiles.tsx
│  │  ├─ DeploymentSummaryCard.tsx
│  │  ├─ EngineeringContinuation.tsx
│  │  ├─ EngineeringDecisionCards.tsx
│  │  ├─ FamilyCard.tsx
│  │  ├─ PaginationControls.tsx
│  │  ├─ PerformanceDimensions.tsx
│  │  ├─ QuickLinksCard.tsx
│  │  ├─ RegistryBadge.tsx
│  │  ├─ RegistryFamilyView.tsx
│  │  ├─ RegistryFilter.tsx
│  │  ├─ RelatedResources.tsx
│  │  ├─ RuntimeDecisionCard.tsx
│  │  ├─ RuntimeMatrix.tsx
│  │  ├─ VariantCard.tsx
│  │  └─ VariantComparisonTable.tsx
│  ├─ shared/
│  │  ├─ AlternativesList.tsx
│  │  ├─ AntiPatternCard.tsx
│  │  ├─ BackToTop.tsx
│  │  ├─ BadgeRow.tsx
│  │  ├─ Breadcrumbs.tsx
│  │  ├─ CheatsheetEntry.tsx
│  │  ├─ CodeBlock.tsx
│  │  ├─ CodeBlockInteractive.tsx
│  │  ├─ CollapsibleRow.tsx
│  │  ├─ CollapsibleSection.tsx
│  │  ├─ ConstraintRecommendations.tsx
│  │  ├─ ContentPageLayout.tsx
│  │  ├─ ContentTypeBadge.tsx
│  │  ├─ DataTable.tsx
│  │  ├─ DebugChecklist.tsx
│  │  ├─ DebugDecisionTree.tsx
│  │  ├─ DebugOverviewCard.tsx
│  │  ├─ DebugSolutionList.tsx
│  │  ├─ DecisionFlow.tsx
│  │  ├─ DecisionGuideSummary.tsx
│  │  ├─ DecisionMatrix.tsx
│  │  ├─ DecisionOptionGrid.tsx
│  │  ├─ DecisionSummary.tsx
│  │  ├─ DecisionTree.tsx
│  │  ├─ DiagnosticCommandList.tsx
│  │  ├─ ExpandableText.tsx
│  │  ├─ FilterBar.tsx
│  │  ├─ HiddenCosts.tsx
│  │  ├─ HybridStrategy.tsx
│  │  ├─ LearningResources.tsx
│  │  ├─ MetadataBadges.tsx
│  │  ├─ MigrationPath.tsx
│  │  ├─ ModelCategoryComparison.tsx
│  │  ├─ ModelCollapsibleSections.tsx
│  │  ├─ ModelDecisionStrip.tsx
│  │  ├─ ModelHubExplorer.tsx
│  │  ├─ ModelListFilter.tsx
│  │  ├─ OfficialResources.tsx
│  │  ├─ PackageTaskList.tsx
│  │  ├─ PageVisitTracker.tsx
│  │  ├─ PatternSnapshot.tsx
│  │  ├─ ProductionExamples.tsx
│  │  ├─ Prose.tsx
│  │  ├─ QuickIdentificationChecklist.tsx
│  │  ├─ QuickSetupSection.tsx
│  │  ├─ ReadingProgress.tsx
│  │  ├─ ReadingSessionTracker.tsx
│  │  ├─ RecentActivity.tsx
│  │  ├─ RecommendedNextSection.tsx
│  │  ├─ RelatedContent.tsx
│  │  ├─ RelatedPatternGraph.tsx
│  │  ├─ RelationshipSection.tsx
│  │  ├─ ScrollRestore.tsx
│  │  ├─ SearchBox.tsx
│  │  ├─ SectionCard.tsx
│  │  ├─ SectionSummary.tsx
│  │  ├─ StatusBadge.tsx
│  │  ├─ StickyActionBar.tsx
│  │  ├─ TableOfContents.tsx
│  │  ├─ TradeoffHeatmap.tsx
│  │  ├─ TradeoffTable.tsx
│  │  ├─ VariationCard.tsx
│  │  ├─ VerificationChecklist.tsx
│  │  ├─ VisualizationEquivalents.tsx
│  │  ├─ VisualTrainingLoop.tsx
│  │  └─ WorkflowStepList.tsx
│  └─ ui/
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ separator.tsx
│     └─ sheet.tsx
├─ data/
│  ├─ DIRECTORY_STRUCTURE.md
│  ├─ registered-aliases.json
│  ├─ registered-tags.json
│  ├─ cheatsheets/
│  │  ├─ _nav.json
│  │  ├─ matplotlib.json
│  │  ├─ numpy.json
│  │  ├─ pandas.json
│  │  ├─ plotly-express.json
│  │  ├─ plotly-go.json
│  │  ├─ scikit-learn.json
│  │  └─ seaborn.json
│  ├─ debug-guides/
│  │  ├─ _nav.json
│  │  ├─ checkpoint-load-error.json
│  │  ├─ cuda-out-of-memory.json
│  │  ├─ dataloader-hang.json
│  │  ├─ gpu-not-detected.json
│  │  ├─ model-not-learning.json
│  │  ├─ nan-loss-exploding-gradients.json
│  │  └─ tokenizer-mismatch.json
│  ├─ decision-guides/
│  │  ├─ _nav.json
│  │  ├─ batch-vs-online-inference.json
│  │  ├─ cnn-vs-vision-transformer.json
│  │  ├─ dense-vs-sparse-retrieval.json
│  │  ├─ kafka-vs-rabbitmq.json
│  │  ├─ kubernetes-vs-docker-compose.json
│  │  ├─ lora-vs-qlora.json
│  │  ├─ mlflow-vs-weights-and-biases.json
│  │  ├─ postgresql-vs-vector-db.json
│  │  ├─ pytorch-vs-tensorflow.json
│  │  └─ rag-vs-fine-tuning.json
│  ├─ models/
│  │  ├─ dl/
│  │  │  ├─ _categories.json
│  │  │  ├─ _nav.json
│  │  │  ├─ auto-encoders.json
│  │  │  ├─ cnn.json
│  │  │  ├─ gnn.json
│  │  │  ├─ gru.json
│  │  │  ├─ lstm.json
│  │  │  ├─ mlp.json
│  │  │  ├─ rnn.json
│  │  │  ├─ transformer.json
│  │  │  ├─ vae.json
│  │  │  └─ vit.json
│  │  ├─ llm/
│  │  │  ├─ _categories.json
│  │  │  ├─ _nav.json
│  │  │  ├─ bert.json
│  │  │  ├─ deepseek.json
│  │  │  ├─ gemma.json
│  │  │  ├─ gpt.json
│  │  │  ├─ llama.json
│  │  │  ├─ mistral.json
│  │  │  ├─ phi.json
│  │  │  ├─ qwen.json
│  │  │  ├─ roberta.json
│  │  │  └─ t5.json
│  │  └─ ml/
│  │     ├─ _categories.json
│  │     ├─ _nav.json
│  │     ├─ dbscan.json
│  │     ├─ decision-tree.json
│  │     ├─ k-means-clustering.json
│  │     ├─ knn.json
│  │     ├─ linear-regression.json
│  │     ├─ logistic-regression.json
│  │     ├─ naive-bayes.json
│  │     ├─ pca.json
│  │     ├─ random-forest.json
│  │     └─ svm.json
│  ├─ packages/
│  │  ├─ _nav.json
│  │  ├─ matplotlib.json
│  │  ├─ numpy.json
│  │  ├─ pandas.json
│  │  ├─ plotly-express.json
│  │  ├─ pytorch.json
│  │  ├─ scikit-learn.json
│  │  └─ seaborn.json
│  ├─ patterns/
│  │  ├─ _nav.json
│  │  ├─ batch-inference.json
│  │  ├─ checkpointing.json
│  │  ├─ distributed-data-parallel.json
│  │  ├─ early-stopping.json
│  │  ├─ flash-attention.json
│  │  ├─ gradient-accumulation.json
│  │  ├─ gradient-checkpointing.json
│  │  ├─ kv-cache.json
│  │  ├─ learning-rate-scheduling.json
│  │  ├─ mixed-precision.json
│  │  ├─ prompt-caching.json
│  │  ├─ streaming-inference.json
│  │  └─ training-loop.json
│  ├─ principles/
│  │  ├─ _nav.json
│  │  ├─ bayesian-inference.json
│  │  ├─ bias-variance-tradeoff.json
│  │  ├─ fail-fast.json
│  │  ├─ gradient-descent.json
│  │  ├─ idempotency.json
│  │  ├─ information-bottleneck.json
│  │  ├─ kiss.json
│  │  ├─ maximum-likelihood-estimation.json
│  │  ├─ modularity-and-composability.json
│  │  ├─ pareto-principle.json
│  │  ├─ regularization.json
│  │  ├─ separation-of-concerns.json
│  │  └─ single-source-of-truth.json
│  ├─ problem-index/
│  │  └─ taxonomy.json
│  ├─ registry/
│  │  └─ families/
│  │     ├─ deepseek/
│  │     │  ├─ _index.json
│  │     │  ├─ coder-6-7b-33b.json
│  │     │  ├─ r1-70b.json
│  │     │  ├─ r1-0528.json
│  │     │  ├─ r1-distill.json
│  │     │  ├─ r1-reasoner.json
│  │     │  ├─ v3-1-chat-hybrid.json
│  │     │  └─ v3-2-chat.json
│  │     ├─ llama-3/
│  │     │  ├─ _index.json
│  │     │  ├─ 3-1-8b-instruct.json
│  │     │  ├─ 3-1-70b-instruct.json
│  │     │  ├─ 3-1-405b-instruct.json
│  │     │  ├─ 3-2-3b-instruct.json
│  │     │  ├─ 3-2-vision-11b-instruct.json
│  │     │  ├─ 3-3-70b.json
│  │     │  ├─ code-llama-34b-instruct.json
│  │     │  └─ llama-guard-3-8b.json
│  │     └─ qwen-3/
│  │        ├─ _index.json
│  │        ├─ 3-0.6b.json
│  │        ├─ 3-1.7b.json
│  │        ├─ 3-3b.json
│  │        ├─ 3-4b.json
│  │        ├─ 3-8b.json
│  │        ├─ 3-30b-a3b-instruct.json
│  │        ├─ 3-235b-a22b-instruct.json
│  │        ├─ qwen-coder-latest.json
│  │        └─ qwen-vl-latest.json
│  └─ workflows/
│     ├─ _nav.json
│     ├─ agentic-tool-use-system.json
│     ├─ build-rag-system.json
│     ├─ ci-cd-for-ml-models.json
│     ├─ data-validation-drift-detection.json
│     ├─ deep-learning-experiment-lifecycle.json
│     ├─ feature-engineering-pipeline.json
│     ├─ fine-tune-an-llm-with-lora-qlora.json
│     ├─ full-fine-tuning-a-pretrained-transformer.json
│     ├─ hyperparameter-optimization-workflow.json
│     ├─ image-classification-pipeline.json
│     ├─ instruction-tuning-rlhf-lite-dpo.json
│     ├─ llm-application-serving.json
│     ├─ model-deployment-batch-real-time.json
│     ├─ model-monitoring-observability.json
│     ├─ model-selection-baseline-benchmarking.json
│     ├─ multi-agent-orchestration.json
│     ├─ named-entity-recognition-pipeline.json
│     ├─ object-detection-pipeline.json
│     ├─ production-llm-cost-latency-optimization.json
│     ├─ prompt-evaluation-regression-testing.json
│     ├─ rag-evaluation-harness.json
│     ├─ tabular-ml-model-development-lifecycle.json
│     ├─ text-classification-pipeline-classical-encoder.json
│     ├─ transfer-learning-for-vision.json
│   │  └─ vector-database-setup-indexing-strategy.json
├─ docs/
│  ├─ AENS_CANONICAL_SPECIFICATION.md
│  ├─ AGENTS.md
│  ├─ AI_CONTEXT.md
│  ├─ ARCHITECTURE_REDESIGN_REPORT.md
│  ├─ CLAUDE.md
│  ├─ DEPENDENCY_GRAPH.md
│  ├─ Documents/
│  │  ├─ AENS Knowledge Layer Specification.md
│  │  └─ directory_structure.md
│  ├─ adr/
│  │  ├─ 001-content-schema-specification-approach.md
│  │  ├─ 002-category-assignment-strategy.md
│  │  ├─ 003-search-behavior-specification.md
│  │  └─ 004-model-id-format.md
│  ├─ architecture/
│  │  ├─ components.md
│  │  ├─ data-flow.md
│  │  ├─ design-principles.md
│  │  ├─ navigation.md
│  │  ├─ overview.md
│  │  ├─ repository.md
│  │  └─ search.md
│  ├─ archive/
│  │  └─ historical/
│  ├─ engineering/
│  │  ├─ content-schema.md
│  │  ├─ project-rules.md
│  │  └─ validation.md
│  ├─ guides/
│  │  ├─ adding-cheatsheet.md
│  │  ├─ adding-debug-guide.md
│  │  ├─ adding-decision-guide.md
│  │  ├─ adding-model.md
│  │  ├─ adding-package.md
│  │  ├─ adding-pattern.md
│  │  ├─ adding-principle.md
│  │  ├─ adding-registry.md
│  │  ├─ adding-workflow.md
│  │  ├─ All Schema.md
│  │  ├─ relationship-system.md
│  │  └─ validation-workflow.md
│  ├─ knowledge/
│  ├─ prompt/
│  └─ reference/
│  └─ report/
├─ lib/
│  ├─ config/
│  │  ├─ loader.ts
│  │  └─ workflows.ts
│  ├─ data.ts
│  ├─ format-date.ts
│  ├─ format-registry.ts
│  ├─ format-time.ts
│  ├─ hooks/
│  │  ├─ useLocalStorage.ts
│  │  └─ useReadingSession.ts
│  ├─ pagination.ts
│  ├─ relationships.ts
│  ├─ resources.ts
│  ├─ route-params.ts
│  ├─ schemas/
│  │  ├─ base.ts
│  │  ├─ cheatsheet.ts
│  │  ├─ debug-guide.ts
│  │  ├─ decision-guide.ts
│  │  ├─ index.ts
│  │  ├─ model.ts
│  │  ├─ package.ts
│  │  ├─ pattern.ts
│  │  ├─ principle.ts
│  │  ├─ registry.ts
│  │  └─ workflow.ts
│  ├─ search/
│  │  ├─ engine.ts
│  │  ├─ intent-detection.ts
│  │  ├─ inverted-index.ts
│  │  ├─ query-assistance.ts
│  │  ├─ ranking.ts
│  │  ├─ related-search.ts
│  │  ├─ snippets.ts
│  │  ├─ synonym-expander.ts
│  │  ├─ tokenizer.ts
│  │  └─ typo-tolerance.ts
│  ├─ search-types.ts
│  ├─ session-tracking.ts
│  ├─ text/
│  │  └─ parseLabeledClauses.ts
│  ├─ theme.ts
│  ├─ utils.ts
│  └─ validator/
│     ├─ context.ts
│     ├─ engine.ts
│     ├─ report.ts
│     └─ rules/
│        ├─ base.ts
│        ├─ cross-ref.ts
│        ├─ empty.ts
│        ├─ orphans.ts
│        ├─ registry.ts
│        ├─ related.ts
│        └─ schema.ts
├─ public/
│  ├─ AENS_LOGO.png
│  ├─ AENS_LOGO.svg
│  ├─ apple-touch-icon.png
│  ├─ favicon.ico
│  ├─ icon-192-maskable.png
│  ├─ icon-192.png
│  ├─ icon-512-maskable.png
│  ├─ icon-512.png
│  ├─ manifest.json
│  └─ search-index.json
├─ scripts/
│  ├─ archive/
│  │  └─ migrate-to-v2.ts
│  ├─ build-nav-index.ts
│  ├─ search-audit.ts
│  ├─ sync-cross-refs.ts
│  └─ validate-content.ts
├─ schema/
│  ├─ config.schema.json
│  └─ v2/
│     └─ .gitkeep
├─ tests/
│  ├─ relationships.test.ts
│  ├─ search-enhancements.test.ts
│  ├─ tokenizer.test.ts
│  └─ validator/
│     ├─ engine.test.ts
│     └─ rules.test.ts
└─ types/
   ├─ cheatsheet.ts
   ├─ config.ts
   ├─ debug-guide.ts
   ├─ decision-guide.ts
   ├─ index.ts
   ├─ meta.ts
   ├─ model.ts
   ├─ package.ts
   ├─ pattern.ts
   ├─ principle.ts
   ├─ problem.ts
   ├─ registry.ts
   └─ workflow.ts