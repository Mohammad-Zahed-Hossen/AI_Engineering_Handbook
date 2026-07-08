# Windsurf Prompt — Model Schema Enrichment (Additive, Approved Scope Only)

## Context

AENS architecture was frozen on July 4, 2026 (`docs/Documents/ARCHITECTURE_FREEZE.md`). A larger 6-section Model page rewrite was proposed and reviewed; it was **rejected** except for one section (hyperparameter intelligence) and three small scalar fields. This prompt implements ONLY that approved, additive scope. It does not touch Decision Guides, Debug Guides, Workflows, or Patterns, and it does not restructure the Model page layout.

Do not implement anything beyond what is listed below. Do not add "Practical Engineering," "Model Selection Knowledge," or "LLM-era Engineering Knowledge" sections — these were explicitly rejected as duplicating Decision Guide / Debug Guide / Workflow ownership.

## Objectives

1. Extend `HyperParameterSchema` with four new **optional** fields: `increasing_effect`, `decreasing_effect`, `trade_off`, `tuning_priority`.
2. Add three new **optional** scalar fields to `ModelSchema`: `gpu_requirement`, `online_learning`, `multi_output`.
3. Update `ModelCollapsibleSections.tsx` to conditionally render the new hyperparameter fields when present, without breaking the existing single-field layout for models that don't have them yet.
4. Do not modify any existing JSON data files — all new fields are optional, so no data migration is required in this pass.

## Constraints

- All new fields MUST be `.optional()` in Zod. No existing model JSON file should fail validation after this change.
- Do not touch `lib/schemas/base.ts`, `lib/schemas/decision-guide.ts`, `lib/schemas/debug-guide.ts`, or any other content type's schema.
- Do not add new content types, new nav entries, or new relationship types.
- Do not run `scripts/migrate-to-v2.ts` — this is not a breaking migration.
- Do not change the Model page's section order or add new top-level sections (Decision Guide grid, Pros/Cons, Performance Overview, Quick Start stay exactly as they are).
- Preserve mobile collapsible-section behavior established in the prior mobile-UX pass — do not regress touch target sizing or scroll depth.

## Implementation Steps

1. In `lib/schemas/model.ts`, extend `HyperParameterSchema`:
   ```ts
   export const HyperParameterSchema = z.object({
     name: z.string(),
     default: z.union([z.string(), z.number(), z.null()]),
     note: z.string(),
     increasing_effect: z.string().optional(),
     decreasing_effect: z.string().optional(),
     trade_off: z.string().optional(),
     tuning_priority: z.enum(['high', 'medium', 'low']).optional(),
   });
   ```
2. In the same file, add to `ModelSchema` (after `interpretability`):
   ```ts
   gpu_requirement: z.enum(['none', 'recommended', 'required']).optional(),
   online_learning: z.boolean().optional(),
   multi_output: z.boolean().optional(),
   ```
3. Run `npm run validate` and confirm 0 errors against existing data — this proves backward compatibility before touching any UI.
4. In `components/shared/ModelCollapsibleSections.tsx`, update the hyperparameter rendering (both mobile card view and desktop table view) to conditionally show `increasing_effect`, `decreasing_effect`, `trade_off`, and `tuning_priority` only when present on a given hyperparameter object. Do not restructure the table — add optional rows/lines within the existing card/table cell, collapsed or omitted entirely when the fields are absent.
5. If `gpu_requirement`, `online_learning`, or `multi_output` are present on a model, surface them as additional badges within the existing "Performance Overview" grid in `ModelCollapsibleSections.tsx` (same 2x4 / 4-column badge grid pattern already used for Training/Inference/Memory/Interpretability) — do not create a new section for them.
6. Do not modify any files under `data/models/`. Content enrichment (actually filling in the new fields for the 34 existing models) is a separate future pass, not part of this implementation step.

## Validation Steps

- `npm run validate` passes with 0 errors.
- `npm run build` completes successfully for all existing model pages.
- Spot-check `data/models/ml/random-forest.json` (which has only one hyperparameter and none of the new fields) renders identically to before this change — no empty fields, no layout shift, no broken badges.
- Confirm TypeScript compiles with no errors (`types/model.ts` requires no manual edits — verify the inferred types update correctly).

## Regression Checklist

- [ ] All existing model JSON files still validate.
- [ ] Model page layout/section order unchanged for models without the new fields.
- [ ] Mobile collapsible behavior (touch targets, scroll depth) unchanged from prior mobile-UX pass.
- [ ] No new content types, nav entries, or relationship types introduced.
- [ ] No changes to Decision Guide, Debug Guide, Workflow, or Pattern schemas/pages.
- [ ] `scripts/migrate-to-v2.ts` was not run and is not required.

## Expected Outcome

The Model page gains richer, per-hyperparameter tuning guidance and three useful decision-support badges, entirely additively. Every one of the 34 existing model files remains valid without edits. No other content type, ownership boundary, or navigation structure is affected. Content authoring (filling in the new optional fields) is left as a separate, later task.
