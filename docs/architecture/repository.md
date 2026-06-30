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

```text
.
├─ .gitignore
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
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ not-found.tsx
│  ├─ page.tsx
│  ├─ cheatsheets/
│  │  └─ [id]/
│  │     └─ page.tsx
│  ├─ models/
│  │  ├─ [category]/
│  │  │  ├─ [id]/
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  ├─ packages/
│  │  └─ [id]/
│  │     └─ page.tsx
│  ├─ registry/
│  │  └─ [task]/
│  │     └─ page.tsx
│  └─ workflows/
│     └─ [id]/
│        └─ page.tsx
├─ components/
│  ├─ layout/
│  │  ├─ DarkModeToggle.tsx
│  │  ├─ MobileSidebarTrigger.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ ThemeInitializer.tsx
│  │  └─ TopBar.tsx
│  ├─ shared/
│  │  ├─ AlternativesList.tsx
│  │  ├─ BackToTop.tsx
│  │  ├─ Breadcrumbs.tsx
│  │  ├─ CheatsheetEntry.tsx
│  │  ├─ CodeBlock.tsx
│  │  ├─ ContentPageLayout.tsx
│  │  ├─ ContentTypeBadge.tsx
│  │  ├─ ContinueReadingSection.tsx
│  │  ├─ FilterBar.tsx
│  │  ├─ MetadataBadges.tsx
│  │  ├─ ModelCollapsibleSections.tsx
│  │  ├─ OfficialResources.tsx
│  │  ├─ PackageTaskList.tsx
│  │  ├─ PageVisitTracker.tsx
│  │  ├─ QuickSetupSection.tsx
│  │  ├─ ReadingProgress.tsx
│  │  ├─ ReadingSessionTracker.tsx
│  │  ├─ RecentKnowledgeSection.tsx
│  │  ├─ RelatedContent.tsx
│  │  ├─ ScrollRestore.tsx
│  │  ├─ SearchBox.tsx
│  │  ├─ SectionCard.tsx
│  │  ├─ StatusBadge.tsx
│  │  ├─ StickyActionBar.tsx
│  │  ├─ TableOfContents.tsx
│  │  └─ WorkflowStepList.tsx
│  └─ ui/
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ separator.tsx
│     └─ sheet.tsx
├─ data/
│  ├─ cheatsheets/
│  │  ├─ _nav.json
│  │  └─ *.json
│  ├─ models/
│  │  ├─ dl/
│  │  │  ├─ _nav.json
│  │  │  └─ *.json
│  │  ├─ llm/
│  │  │  ├─ _nav.json
│  │  │  └─ *.json
│  │  └─ ml/
│  │     ├─ _nav.json
│  │     └─ *.json
│  ├─ packages/
│  │  ├─ _nav.json
│  │  └─ *.json
│  ├─ registry/
│  │  ├─ embeddings.json
│  │  ├─ llms.json
│  │  ├─ multimodal.json
│  │  ├─ ocr.json
│  │  ├─ rerankers.json
│  │  ├─ speech.json
│  │  └─ vision.json
│  ├─ search/
│  │  ├─ concept-groups.json
│  │  ├─ search.config.json
│  │  └─ synonyms.json
│  └─ workflows/
│     ├─ _nav.json
│     └─ *.json
├─ docs/
│  ├─ AENS Skill Design Specification (SDS).md
│  ├─ AGENTS.md
│  ├─ AI Engineer Navigation System (AENS).md
│  ├─ CLAUDE.md
│  ├─ CONTENT_ADDING.md
│  ├─ content_guidelines.md
│  ├─ PROJECT_RULES.md
│  ├─ validate_content.md
│  ├─ archive/
│  │  ├─ AENS — Final UX Implementation Prompts (Pre-Freeze).md
│  │  ├─ AENS Home Page — Information Architecture Report.md
│  │  ├─ AENS Home Page — Reconciled Pre-Freeze Plan.md
│  │  ├─ AENS Home Page — UX Architecture Report.md
│  │  ├─ AENS Mobile Cognitive Interface Audit.md
│  │  ├─ AENS Mobile UI UX Freeze Audit - V2.md
│  │  ├─ AENS UX Inspection - Continue Reading System.md
│  │  ├─ AENS_Models_Workflows_Fix_Prompts.md
│  │  ├─ AENS_PreFreeze_Fix_Prompts.md
│  │  ├─ AENS_Search_Implementation_Prompts.md
│  │  ├─ aens_skill_implementation_plan.svg
│  │  ├─ AENS_System_Audit_Report (windsurf).md
│  │  ├─ AENS_UI_Pareto_Prompts.md
│  │  ├─ AENS_V2_Search_Architecture.md
│  │  ├─ AI Engineer Navigation System - Knowledge Architecture Audit Report.md
│  │  ├─ ARCHITECTURAL_REVIEW.md
│  │  ├─ Claude_Archi_Review.md
│  │  ├─ Claude_Infrastructure_Audit.md
│  │  ├─ Codeblock Overflow Investigation Report.md
│  │  ├─ Final Architecture Fixing Report.md
│  │  └─ On_this_page (Sticky) issue.md
├─ lib/
│  ├─ config/
│  │  └─ registry.ts
│  ├─ data.ts
│  ├─ hooks/
│  │  ├─ useLocalStorage.ts
│  │  └─ useReadingSession.ts
│  ├─ resources.ts
│  ├─ route-params.ts
│  ├─ schemas/
│  │  ├─ cheatsheet.ts
│  │  ├─ index.ts
│  │  ├─ meta.ts
│  │  ├─ model.ts
│  │  ├─ package.ts
│  │  ├─ registry.ts
│  │  └─ workflow.ts
│  ├─ search/
│  │  ├─ engine.ts
│  │  ├─ inverted-index.ts
│  │  ├─ related-search.ts
│  │  ├─ search-types.ts
│  │  ├─ synonym-expander.ts
│  │  └─ tokenizer.ts
│  ├─ search.ts
│  ├─ session-tracking.ts
│  └─ utils.ts
├─ public/
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ scripts/
│  ├─ build-nav-index.ts
│  └─ validate-content.ts
└─ types/
   ├─ cheatsheet.ts
   ├─ index.ts
   ├─ meta.ts
   ├─ model.ts
   ├─ package.ts
   ├─ registry.ts
   └─ workflow.ts
```

