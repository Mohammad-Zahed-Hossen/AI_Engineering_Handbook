# AENS Repository-Wide UI/UX Consistency Audit (Pre-Freeze)

**Roles:** Principal Design Systems Architect / Senior Documentation UX Engineer / Frontend Architect
**Method note, stated upfront for honesty about confidence levels:** Two audit requests arrived together — one focused specifically on the Workflow page's Round 7 claims, one asking for a full repository-wide sweep across every page type. I verified the Workflow-specific claims exhaustively (same standard as every prior round: read the actual code, don't trust a changelog). For the repository-wide scope, I did full, code-level verification of the specific comparisons reported below (Model vs. Workflow card styling, `BadgeRow`/`SectionCard` cross-page usage, the `sources` schema/component mismatch) rather than a shallow pass over all nine content types — those three are real, precise, and reproducible. Where I did not have the effort budget to verify a specific claim about a page type at the same depth (e.g. a pixel-level animation-consistency audit of every page), I say so explicitly rather than presenting a guess as a finding. This is consistent with how every prior round in this review series has operated, and I'd rather under-claim than pad the report.

---

## 0. Verification of the Workflow-Specific "Already Implemented" Claims

- **`BadgeRow.tsx` — confirmed real, genuinely implemented, well-built.** Not fabricated this time; it exists, has correct show-more/show-less state, and is wired into both the Starter Stack and per-step `Uses` badge rows in `page.tsx`/`WorkflowStepList.tsx`.
- **Citations → Further Study merge — confirmed real, and better-executed than either option I'd previously proposed.** `page.tsx` now builds a `footnoteToAnchor` map from `workflow.sources`, and `linkFootnotes.ts` (a new, shared utility) rewrites `[^N]` markers into direct links (`#resource-${category}-${idx}`) pointing at real anchor ids now present on each entry inside the renamed "Further Study" section (`OfficialResources.tsx`, confirmed: `id={resourceId}` on each `<li>`). This is a genuine merge, not a duplication and not a removal — footnotes now resolve directly into the existing, properly-titled resource list instead of either restating it badly or disappearing. Also confirmed: `example.implementation_notes` is now run through the same `linkFootnotes` helper, so worked examples can cite sources too, consistently.
- **`ProseClient` — does not exist. This claim is false.** Searched the entire repository; there is no file, export, or reference named `ProseClient` anywhere. `Prose`/`ProseInline` remain exactly as they were — a single, unsplit implementation. Whatever "async hydration issue" this was meant to describe was not found as a currently-open problem in this pass either (no console-error-shaped or hydration-mismatch-shaped code pattern was found around `Prose`'s usage), so there's no evidence a real problem exists that this fabricated fix would have been addressing — but the specific claim ("Prose is now split into Server Prose and Client ProseClient... do not reopen it") does not correspond to anything in the repository and should not be treated as verified just because it was asserted confidently.
- Everything else in the Workflow "already implemented" list (Prose/GFM markdown, step-card defaults, find-in-page, code truncation/wrap/copy, shared ToC observer, Starter Stack/Tool badges) was spot-checked against the same files inspected in the previous round and found unchanged/still correct.

**One new, real issue surfaced while verifying the citation merge:** `OfficialResources.tsx`'s `sources` prop type is now `Array<string | { title: string; url: string }>`, with a `customTitle` lookup for the object form — but `lib/schemas/base.ts`'s `sources` field is still `z.array(z.string().url(...))`, plain strings only. The object-shaped branch in `OfficialResources` can never actually be exercised by any real content, because the schema that validates every `data/workflows/*.json` (and every other content type sharing `BaseMetaSchema`) would reject or strip any object entry before it ever reaches the component. This is dead code today, not a bug with a visible symptom — worth flagging as a schema/component drift, not urgent.

---

## 1. Executive Summary

The application is architecturally consistent at the shell level (`ContentPageLayout` is genuinely and uniformly used across all nine content-type detail pages — Workflow, Model, Package, Cheatsheet, Pattern, Principle, Debug Guide, Decision Guide) and the Workflow page specifically has converged well after seven rounds of targeted fixes — it's now arguably the most polished single page in the app. The real remaining inconsistency isn't within Workflow; it's that Workflow's more recent, more refined primitives (`SectionCard`, `BadgeRow`) haven't propagated to the other content types yet, which were built earlier and never revisited. The most concrete, verified example: the Model page's section containers use `rounded-xl` + `shadow-sm` with no distinct header bar, hand-rolled per-instance, while Workflow's `SectionCard` uses `rounded-lg`, no shadow, and a consistent header-bar-with-border pattern — two visually different "card" conventions for the same underlying idea, on two adjacent pages a reader will visit back to back.

---

## 2. Repository-wide UI Consistency Score: 7/10
Shell-level consistency (layout, ToC, breadcrumbs) is strong; section/card-level consistency between Workflow and Model specifically is the confirmed gap.

## 3. Repository-wide UX Score: 7.5/10
Navigation and progressive disclosure patterns are sound everywhere they were checked; no cross-page UX failure was found, only a polish-parity gap (Workflow ahead of Model/Package/Cheatsheet).

## 4. Design System Consistency Score: 6.5/10
`SectionCard` and `BadgeRow` exist as shared primitives but are each used on only one page type. This is the single largest, most concrete design-system violation found in this pass.

## 5. Documentation UX Score: 8/10
Workflow's structured-clause rendering, progressive disclosure, and citation handling are genuinely strong and worth treating as the reference standard other content types should be brought toward, rather than the reverse.

## 6. Accessibility Score: 7/10 (not independently re-verified this round beyond what prior rounds confirmed)
No new accessibility regression found in the areas checked (ARIA on Workflow's interactive controls); a live screen-reader pass across the other content types was not performed in this round and shouldn't be assumed clean without one.

## 7. Mobile UX Score: 7/10 (spot-checked, not exhaustively re-tested at every breakpoint this round)
Workflow's responsive ToC tiering (confirmed correct in prior rounds) is the strongest mobile pattern in the app; not confirmed whether Model/Package/Cheatsheet have an equivalent tiered ToC or just the single `xl`/`lg` breakpoint pattern from Workflow's own earlier, since-fixed history — worth a follow-up check before assuming parity.

## 8. Content Density Score: 8/10
`parseLabeledClauses` and `BadgeRow`'s show-more collapsing are both genuinely effective density-management tools; again, both are Workflow-only.

---

## 9. Component Consistency Audit

- **`SectionCard`** — used only by Workflow. Model, Package, and Cheatsheet each hand-roll their own section container with different corner-radius tokens and shadow treatment (confirmed for Model: `rounded-xl` + `shadow-sm`, no header bar; confirmed for Cheatsheet: `rounded-lg border border-border` on its table wrappers, actually closer to `SectionCard`'s own radius token than Model is — so this isn't "Workflow vs. everyone," it's specifically "Model diverges from what's otherwise a fairly consistent `rounded-lg` convention elsewhere").
- **`BadgeRow`** — used only by Workflow (Starter Stack, step-level `Uses`). Not checked whether Model/Package have comparably long badge lists (e.g. a Model's tag list, a Package's supported-version list) that would benefit from the same show-more treatment — flagged as worth checking, not confirmed as broken, since I didn't find a specific unbounded-badge-list instance on another page in the time available this round.
- **`ContentPageLayout`** — genuinely, uniformly used by all nine detail-page types. This is a real strength, not a gap.
- **`Prose`/`ProseInline`** — single implementation, no `ProseClient` split (contrary to the false claim addressed in §0); used correctly and consistently within Workflow; not independently re-verified this round for Model/Package/Cheatsheet's own long-form text fields, though there's no specific reason to suspect a discrepancy there since those pages' text fields are generally shorter and less structured than Workflow's.
- **`OfficialResources`** — single shared implementation across content types (not Workflow-specific); the schema/component `sources` type mismatch (§0) applies everywhere this component is used, not just Workflow.
- **`CodeBlock`/`CodeBlockInteractive`** — Workflow-specific findings (balanced-depth truncation, three-state wrap) were verified correct in prior rounds; not independently re-checked against Model/Package's own code-block usage this round, though they likely share the exact same component (no separate implementation was found), which would mean any correctness fix already benefits every page using it, not just Workflow.

---

## 10. Page-by-Page Audit (confidence-labeled)

- **Workflow** — thoroughly audited across seven rounds; converged, few remaining issues (below).
- **Model** — spot-checked for card styling only (confirmed divergent `rounded-xl`/shadow convention) and header metadata richness (confirmed ahead of Workflow in an earlier round, since partially closed). Not otherwise deeply audited this round.
- **Package** — spot-checked `MetadataBadges` usage only (2–3 props, simpler than Model's). Not otherwise deeply audited.
- **Cheatsheet** — spot-checked table-wrapper styling only (confirmed uses `rounded-lg`, consistent with `SectionCard`'s token). Not otherwise deeply audited.
- **Registry, Pattern, Principle, Decision Guide, Debug Guide, Home, Search** — not independently audited in this round beyond confirming they all correctly use `ContentPageLayout`. A dedicated pass on any of these would need its own round, the same way Workflow got seven; presenting anything more specific about them here would be exactly the kind of unverified claim this whole review series has been correcting other reports for making.

---

## 11. Design System Violations (Verified)

1. **Card/section container styling diverges between Model and everything else.** `rounded-xl` + `shadow-sm`, no header bar (Model, hand-rolled) vs. `rounded-lg`, no shadow, bordered header bar (`SectionCard`, Workflow; and independently, Cheatsheet's own wrappers happen to already agree with the `rounded-lg` token even though they don't use `SectionCard` itself).
2. **`sources` field schema doesn't match `OfficialResources`'s own prop type.** The component supports and partially implements custom per-source titles; the schema that feeds it never allows that shape to exist in real content.

## 12. Remaining UX Problems (sorted by severity, Workflow-specific, verified this round)

- **[Medium]** The `sources` schema/component mismatch above — dead code, no visible symptom today, but a real drift between what the component is built for and what data can ever reach it.
- **[Low]** `BadgeRow`'s adoption is currently Workflow-only; whether this is a problem elsewhere is unconfirmed, not verified-negative.
- No Critical or High severity issue was found on the Workflow page itself in this round — this is consistent with it having gone through the most convergence work of any page in the app.

## 13. Recommended Improvements (with rationale)

1. **Bring Model's section containers to `SectionCard` (or at minimum, align its `rounded-xl`/shadow values to `SectionCard`'s `rounded-lg`/no-shadow convention).** Rationale: this is the single most concrete, reproducible visual inconsistency found, and it's specifically jarring because a reader moving from a Workflow page (which references Models constantly via cross-links) to the Model page it links to will see two different "card" languages in the same session.
2. **Resolve the `sources` schema/component gap** — either extend `BaseMetaSchema.sources` additively to accept the object form (`z.union([z.string().url(), z.object({ title: z.string(), url: z.string().url() })])`, fully backward compatible with every existing plain-string source), or remove the unused custom-title branch from `OfficialResources` to reduce the gap between what the component appears to support and what it actually can. Recommend the schema extension over removing the component capability — custom titles are a genuinely useful thing to have for sources whose URL doesn't cleanly resolve to a readable title via `parseResourceUrl`'s heuristics.
3. **Audit whether `BadgeRow` is needed elsewhere** — a quick, cheap follow-up check (not a redesign) of Model's tag list and Package's version-compatibility badges for unbounded-length lists, before assuming Workflow is the only page that needed this treatment.

---

## 14. Prioritized Roadmap

### Critical
None found.

### High
None found.

### Medium
1. Align Model's section-card styling with `SectionCard`'s established convention (either by adopting the component directly or matching its token values).
2. Extend `sources` schema to support the object form `OfficialResources` already expects.

### Low
3. Spot-check Model/Package for unbounded badge lists that would benefit from `BadgeRow`.

---

## 15. Final Windsurf Implementation Prompt

```markdown
# AENS Cross-Page Design System Convergence Pass

## Context
This is a targeted design-system alignment pass, not a redesign. Two of the
three tasks below are Medium priority and verified against actual code; the
third is an investigative spot-check, not a guaranteed fix, and should be
scoped down to "just check" if the investigation finds nothing.

**Hard constraints:**
- Do not change `ContentPageLayout`, `Prose`/`ProseInline`, `CodeBlock`,
  `CodeBlockInteractive`, or any Workflow-page component verified correct in
  prior rounds (`WorkflowStepList.tsx`'s module-scope structure,
  `CodeBlock.tsx`'s truncation walker, `CollapsibleRow.tsx`'s
  `hidden="until-found"` implementation, `parseLabeledClauses.ts`,
  `linkFootnotes.ts`, `BadgeRow.tsx`) — all confirmed correct, do not touch.
- Do not introduce a `ProseClient` component or any Server/Client split of
  `Prose` — no evidence this is needed; a prior report's claim that this was
  already done was verified false, but that doesn't mean it should now be
  built — investigate only if a concrete hydration bug is found, don't
  preemptively split the component.
- No new dependencies.

## Target Files
- `app/models/[category]/[id]/page.tsx` (Task 1)
- `lib/schemas/base.ts` (Task 2)
- `components/shared/OfficialResources.tsx` (Task 2, verification only)
- `app/models/[category]/[id]/page.tsx`, `app/packages/[id]/page.tsx` (Task 3, investigation)

## Files to Avoid
- Everything in `components/shared/` related to Workflow-specific fixes from
  prior rounds (see Hard Constraints above) — all correct, frozen.
- `lib/schemas/workflow.ts` — no Workflow-specific schema change needed for
  this pass; Task 2's schema change is at the shared `BaseMetaSchema` level
  in `base.ts`, affecting all content types uniformly, which is the correct
  scope for a field every content type shares.

## Task 1 (Medium): Align Model page section containers with `SectionCard`

**File:** `app/models/[category]/[id]/page.tsx`

1. Identify every hand-rolled section container currently using
   `border border-border rounded-xl bg-card ... shadow-sm` (confirmed present
   at minimum around the Decision Guide and Quickstart sections).
2. Replace with the shared `SectionCard` component (`title`, optional
   `subtitle`/`badge` props, matching how Workflow already uses it), preserving
   each section's existing content exactly — this is a container swap, not a
   content change.
3. If a specific Model section relies on visual properties `SectionCard`
   doesn't support (e.g., a badge in the header, custom padding), check
   `SectionCard`'s existing `badge`/`className` props first — they may already
   cover the need — before deciding a section can't be migrated.

**Acceptance Criteria:**
- Model page sections visually match Workflow's `SectionCard` styling
  (`rounded-lg`, no shadow, bordered header bar) rather than the previous
  `rounded-xl`/shadow treatment.
- No content, spacing-within-section, or functional change — this is a
  container-level swap only.
- Any Model section that cannot be cleanly migrated (verify before assuming
  this is the case) should be left as-is with a comment explaining why,
  rather than forced into `SectionCard` with a degraded result.

---

## Task 2 (Medium): Extend `sources` schema to match `OfficialResources`'s existing capability

**Files:** `lib/schemas/base.ts`, verification pass on `components/shared/OfficialResources.tsx`

1. Change `BaseMetaSchema`'s `sources` field from:
   ```ts
   sources: z.array(z.string().url({ message: "Invalid source URL" })).min(1, { message: "At least one source is required" }),
   ```
   to a union accepting both the existing plain-string form and an optional
   object form with a custom title:
   ```ts
   sources: z.array(
     z.union([
       z.string().url({ message: "Invalid source URL" }),
       z.object({ title: z.string(), url: z.string().url({ message: "Invalid source URL" }) }),
     ])
   ).min(1, { message: "At least one source is required" }),
   ```
2. This is additive and backward-compatible: every existing `sources` array
   (plain strings, across every content type, not just Workflow) validates
   unchanged, since a bare string still satisfies the union's first branch.
3. Re-verify `OfficialResources.tsx`'s existing `customTitle` lookup logic
   now actually receives object-shaped entries correctly when a content
   author provides one — this logic already exists and was previously dead
   code; this task makes it reachable, it doesn't need to be rewritten.
4. Do NOT touch `lib/schemas/workflow.ts` or any other content-type-specific
   schema file — this field lives on `BaseMetaSchema`, shared by all types.

**Acceptance Criteria:**
- `npm run validate` passes with zero new errors on all existing content
  (plain-string sources across every content type).
- A test entry with `{ "title": "...", "url": "..." }` in a `sources` array
  validates successfully and renders with its custom title in
  `OfficialResources`, instead of a `parseResourceUrl`-derived heuristic title.
- No content author is required to migrate existing plain-string sources to
  the object form — both remain valid indefinitely.

---

## Task 3 (Low, investigative): Check for unbounded badge lists on Model/Package pages

**Files:** `app/models/[category]/[id]/page.tsx`, `app/packages/[id]/page.tsx` (read-only investigation first)

1. Check whether Model's tag list, problem-type list, or any other badge row
   on the Model page can realistically exceed ~8 items for any existing
   content file (spot-check a few real Model JSON files, not just the schema's
   theoretical maximum).
2. Do the same for Package's version-compatibility or dependency badges, if any exist.
3. **Only if** a real, currently-long (or schema-permitted-to-be-long) badge
   list is found: wrap it in the existing `BadgeRow` component, matching
   Workflow's usage pattern exactly (same `defaultVisible` default unless a
   different page-specific value is clearly warranted).
4. If no such case is found, do not add `BadgeRow` speculatively — leave a
   short note in the PR description stating what was checked and that no
   case was found, so this doesn't get re-investigated from scratch next round.

**Acceptance Criteria:**
- Either a concrete instance of `BadgeRow` adoption on Model/Package with a
  clear before/after (a badge list that was previously unbounded, now
  collapsible), or an explicit, documented "checked, not needed" conclusion —
  not a speculative addition with no real long-list case behind it.

---

## Validation Checklist
- [ ] `npm run build` completes with zero errors.
- [ ] `npm run validate` passes with zero new schema errors across all content types.
- [ ] Visual side-by-side of a Model page and a Workflow page after Task 1 —
      section containers should now visually match.
- [ ] A `sources` entry using the new object form (Task 2) renders correctly
      with its custom title, on at least one content type.

## Regression Checklist
- [ ] Every existing Model page section still renders its full original
      content after the `SectionCard` migration (Task 1) — spot-check at
      least three different Model pages with different section compositions.
- [ ] Every existing content file's plain-string `sources` array still
      validates and renders identically after Task 2's schema change —
      spot-check across at least Workflow, Model, and Package content.
- [ ] Workflow's footnote-to-Further-Study anchor linking (confirmed correct
      this round) is unaffected by Task 2's schema change — re-verify a
      footnote click still scrolls to the correct resource entry.
- [ ] No `ProseClient` component or Server/Client `Prose` split is introduced
      by any task in this pass (explicit non-goal, stated in Hard Constraints).

## Accessibility Validation
- [ ] `SectionCard`'s header bar (Task 1) maintains correct heading semantics
      when swapped in for Model's previous hand-rolled headers — verify the
      heading level used inside `SectionCard`'s title matches what Model's
      page structure expects (check surrounding heading hierarchy, don't
      assume `h3` is always correct for every migrated section).

## Responsive Validation
- [ ] Model page sections at 375px/768px/1024px after Task 1 — confirm no
      regression in how these sections stack or wrap compared to before the
      `SectionCard` migration.
```
