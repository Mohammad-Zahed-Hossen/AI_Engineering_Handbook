# 10 — Maintenance Policy

**Stability:** Foundation (changes only when the maintenance strategy itself changes — not when individual content changes)
**Loaded by:** Content Updater, Version Auditor, Architecture Advisor

---

## Purpose of this document

AENS is a system maintained by one person, indefinitely. Every architectural and content decision must be sustainable at that scale. This document defines how content ages, how it gets updated, when it gets retired, and how the system itself evolves without accumulating technical debt that makes maintenance intractable over time.

The guiding constraint: **maintenance burden must never exceed what one engineer can sustain alongside their primary work.**

---

## Content lifecycle

Every entry in AENS passes through four stages. Understanding which stage an entry is in determines what action is appropriate.

```
Current → Stale → Deprecated → Retired
```

**Current:** The entry accurately reflects the latest stable release. All URLs resolve. Version numbers match PyPI or the model card. Cross-links point to existing entries.

**Stale:** The entry was accurate when written but has not been verified against the current release. A stale entry may still be correct — or it may contain outdated parameter names, changed defaults, or broken URLs. Stale entries are candidates for the next update cycle, not immediate action.

**Deprecated:** The underlying tool, model, or pattern is no longer recommended for new projects. The entry may still be accurate but the subject itself is superseded. Deprecated entries are kept but marked — they serve engineers maintaining existing systems.

**Retired:** The entry is removed from `data/`. The subject is so outdated that keeping the entry creates more confusion than having no entry at all. Retirement is rare and deliberate.

---

## When entries become stale

An entry becomes stale when any of the following is true:

- More than 6 months have passed since `updated_at` for a fast-moving library (PyTorch, Transformers, LangChain)
- More than 12 months have passed since `updated_at` for a stable library (NumPy, scikit-learn, SciPy)
- A major version increment has been released (X.0.0) since the entry was last verified
- A new model supersedes a Registry entry's recommended checkpoint

An entry does not become stale just because time has passed — it becomes stale because the likelihood of inaccuracy has increased to a point where verification is warranted. Stable libraries with infrequent breaking changes age more slowly than fast-moving ones.

---

## Update triggers

Updates are initiated by one of three triggers:

**Scheduled review:** Once per quarter, run the Version Auditor across all entries. Identify stale entries. Prioritise by how frequently the entry is likely to be consulted — Package entries for foundational libraries (NumPy, PyTorch) before niche utilities.

**Reactive update:** When actively using a library and noticing that an AENS entry is wrong, update it immediately. This is the lowest-friction update path and produces the most reliable content — corrections made during real work are grounded in observed failures, not speculative staleness.

**Breaking change alert:** When a major version of a library ships with breaking changes (e.g. NumPy 2.0, scikit-learn 1.4, Transformers 4.x), trigger an immediate targeted review of all Package and Cheatsheet entries for that library. Do not wait for the scheduled cycle.

---

## What gets updated vs. what gets rewritten

**Update (change specific fields):** When parameter defaults change, a new recommended model checkpoint is available, a URL moves, or a gotcha no longer applies. Use `Content Updater`. Change `updated_at`. Do not change `created_at`. Change only the fields that are actually wrong — do not rewrite surrounding content that is still accurate.

**Rewrite (replace the entry):** When an API is redesigned, a library's primary paradigm changes, or the engineering decisions in `use_when`/`avoid_when` no longer reflect how the tool is used in practice. A rewrite changes `created_at` to the rewrite date, resets the content from scratch against current documentation, and re-runs the full quality checklist.

The distinction matters for maintenance burden. An update takes minutes. A rewrite takes the same effort as the original entry. Treat rewrites as new content creation, not maintenance.

---

## Deprecation policy

An entry is deprecated when the subject — not the entry — is deprecated.

**Deprecate when:**
- The library's PyPI page shows a "Deprecated" notice or links to a successor
- The GitHub repository is archived
- The official documentation redirects to a successor project
- The model is no longer maintained and a clearly superior successor exists

**How to handle deprecated entries:**
Do not delete deprecated entries immediately. Engineers maintaining existing systems need them. Instead:

1. Add a note to `summary` indicating the deprecation: e.g. `"Deprecated in favour of [successor]. Kept for reference on existing projects."`
2. Add the successor to `alternatives[]`
3. Stop updating the deprecated entry's version number — it reflects the last supported version
4. Set a review date 12 months out. If the entry has not been consulted (no reactive updates, no notes) by that date, retire it.

**Do not deprecate based on personal preference.** An entry is deprecated only when the upstream project signals deprecation. A library you no longer prefer is still Current if the project is actively maintained.

---

## Retirement policy

Retirement is the permanent removal of an entry from `data/`. It is rare.

**Retire when:**
- The entry has been deprecated for more than 12 months
- The subject library or model is no longer installable or runnable on current hardware/OS
- The entry contains so many stale fields that it is more likely to mislead than help
- A successor entry exists and covers all the use cases of the retired entry

**How to retire:**
1. Verify no other entries contain cross-links pointing to this entry's ID
2. Remove those cross-links from the referencing entries (update their `updated_at`)
3. Delete the file from `data/`
4. Run `npm run validate` to confirm no broken references remain

Do not retire entries that are still cited in `uses.*` or `related_*` fields elsewhere without first removing those references. A broken cross-link is worse than a stale entry.

---

## Schema evolution

The Zod schemas in `lib/schemas/` are the system's single source of truth. When schemas change, content must change. This is the highest-friction maintenance task.

**Adding a new optional field to a schema:**
No immediate content migration required. New entries include the field. Existing entries can omit it (Zod optional fields pass validation without the field). Update relevant schema reference files in `references/schemas/` to document the new field. Add the field to the canonical field order in `04-json-conventions.md`.

**Adding a new required field to a schema:**
All existing entries of that type must be updated before `npm run validate` passes. This is a migration. Plan it: identify all affected files, update them in a single session, validate, commit. Do not leave the system in a partially-migrated state.

**Changing an existing field's type or enum values:**
A breaking change. All entries using the old value become invalid. Treat this as a migration:
1. Update the schema
2. Update `02-content-taxonomy.md` and `04-json-conventions.md` to reflect the new values
3. Update all affected entries
4. Run `npm run validate`
5. Update the relevant schema reference file in `references/schemas/`

**Removing a field from a schema:**
Fields removed from the schema will be rejected by strict Zod parsing or silently ignored depending on the parser configuration. Check `lib/schemas/*.ts` for `.strict()` usage. If strict mode is enabled, remove the field from all existing entries before deploying the schema change.

**Never change the Zod schema and defer the content migration.** A schema-content mismatch that passes `npm run validate` today may fail tomorrow when the parser configuration changes. Migrations are synchronous.

---

## Adding a new content type

New content types are the highest-impact architectural change. They require:

1. A new Zod schema in `lib/schemas/`
2. A new TypeScript type in `types/`
3. A new data directory in `data/`
4. A new schema reference file in `.claude/skills/references/schemas/`
5. Updates to `02-content-taxonomy.md` (add the type, update the decision tree)
6. Updates to `04-json-conventions.md` (add canonical field order)
7. Updates to `05-naming-conventions.md` (add ID derivation rules)
8. Updates to `08-cross-linking.md` (define allowed link directions)
9. Updates to `09-quality-checklist.md` (add a new section)
10. At least two example entries in `.claude/skills/references/examples/`
11. A new author skill or an updated existing skill

Do not create a new content type without completing all eleven steps. A content type that exists in `data/` but has no schema reference, no quality checklist section, and no example entries will produce inconsistent content every time a skill authors it.

**The bar for a new content type is high:** the information must not fit any of the five existing types, and it must be information the engineer will consult repeatedly during real work — not a one-off reference.

---

## Reference file maintenance

The foundation references (`01` through `10`) change rarely and deliberately. The schema references change when schemas evolve. The example library grows continuously.

**When to update a foundation reference:**
- A rule is contradicted by a real production failure (the rule was wrong or incomplete)
- A new content type is added (update taxonomy, conventions, cross-linking, checklist)
- A new failure pattern is observed that no existing rule addresses

**When not to update a foundation reference:**
- To add nuance or elaboration that doesn't change behaviour
- To document exceptions that haven't actually occurred
- To align with a personal stylistic preference

Foundation references are not living documents in the sense of continuous improvement. They are constitutions — they change rarely and with clear justification. Every proposed change to a foundation reference should answer: "what production failure does this prevent?"

**Schema references** should be updated whenever the corresponding Zod schema changes. They are the human-readable documentation of the schema. A schema reference that diverges from the Zod schema is actively harmful — skills will produce content that fails validation.

**Example files** should be updated whenever a better production example exists. The example library is the one reference that should grow continuously. When a new entry is created that is notably clean and comprehensive, add it to `references/examples/` as a reference implementation.

---

## Cross-link integrity over time

As entries are added, updated, and retired, cross-links drift. An entry that was a valid cross-link target when added may be retired later, leaving dangling references.

**On every retirement:** audit all cross-link fields across `data/` for references to the retired ID. This is the Link Integrity Auditor's primary function. Run it before finalising any retirement.

**On every major addition:** check whether existing entries should now link to the new entry. A new workflow entry may deserve links from several Package task entries that have `related_workflows: []`. The addition is incomplete until the bidirectional link ecosystem is consistent.

**Quarterly:** run the Link Integrity Auditor as part of the scheduled review cycle, even without a specific trigger. Cross-link drift is slow and invisible until it accumulates.

---

## Maintenance burden guardrails

These rules exist to prevent maintenance from becoming a second job.

**One entry at a time.** When a scheduled review identifies 15 stale entries, do not attempt to update all 15 in one session. Update the 3 most critical ones and defer the rest to the next session. Incomplete updates are better than burnout.

**Reactive updates are the primary mechanism.** The most reliable content updates come from noticing an error during real work. Scheduled reviews catch what reactive updates miss. Do not create a maintenance schedule so demanding that it makes reactive updates feel like extra burden — that inverts the priority.

**Deprecate rather than update when the entry is rarely used.** If an entry covers a tool the engineer no longer uses in active projects, deprecating it is lower-effort than keeping it current. The deprecation note is more honest than a nominally-updated entry that hasn't been verified in practice.

**The system exists to serve the engineer, not the other way around.** If maintaining AENS at full fidelity costs more time than it saves, the scope is too large. Retire low-value entries aggressively before the maintenance burden becomes unsustainable. A focused system of 50 high-quality entries is more valuable than 200 entries of mixed quality.
