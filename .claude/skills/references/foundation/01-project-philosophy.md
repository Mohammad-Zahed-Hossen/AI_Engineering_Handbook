# 01 — Project Philosophy

**Stability:** Foundation (changes very rarely — treat as constitution)
**Loaded by:** All skills

---

## What AENS is

AENS is a personal AI engineering navigation system for one user, used continuously over many years.

It is a **navigation layer** above official documentation — not a replacement for it.

It exists to answer three questions during real engineering work:

- How do I do this?
- Which option should I choose?
- Where do I go next?

---

## What AENS is not

AENS is not:

- Documentation (official docs do this better)
- A personal Wikipedia (LLMs do this better)
- A learning journal (belongs elsewhere)
- A tutorial website (not the goal)
- A SaaS product or multi-user system
- A knowledge archive

If a proposed content item could be replaced by asking an LLM, it probably does not belong in AENS.

---

## The golden rule

Before adding any content, ask:

> "Will this help me during actual AI engineering work?"

YES → keep it.
NO → do not store it.

If the answer requires qualifying with "maybe" or "eventually," the answer is NO.

---

## What the system must do

Every content item must do at least one of:

1. **Trigger memory** — restore a forgotten pattern faster than a search engine
2. **Accelerate decisions** — compare options with engineering tradeoffs, not marketing claims
3. **Accelerate implementation** — provide syntax, parameters, and examples ready to run
4. **Navigate to official resources** — link directly to the right documentation page, not a homepage

If a content item does none of these, it does not belong in AENS.

---

## What content must never do

Content must never:

- Re-teach a concept from scratch
- Duplicate what official documentation already says well
- Store complete theory explanations
- Store full tutorials
- Store course notes or reading notes
- Provide generic descriptions without engineering decisions
- Use marketing language ("powerful," "state-of-the-art," "cutting-edge")

---

## Content types

AENS contains exactly five content types. Nothing else.

| Type | Primary question answered |
|---|---|
| Package | How do I perform this task with this library? |
| Model | Which model should I choose for this problem? |
| Workflow | How do I build this kind of system? |
| Cheatsheet | What is the exact syntax for this operation? |
| Registry | Which specific model ID should I use for this task? |

Every content item belongs to exactly one of these types.

If a new piece of information does not fit any of these five, it does not belong in AENS.

---

## Engineering priorities

When making any content or architecture decision, resolve conflicts in this order:

1. **Maintainability** — will this still make sense in two years?
2. **Recall speed** — can the engineer find it in under 30 seconds?
3. **Decision quality** — does it help choose the right option?
4. **Implementation speed** — does it reduce time to working code?
5. **Content density** — is every line earning its place?

Lower priorities never override higher ones.

---

## What never belongs in AENS

The following must never be stored regardless of how relevant they seem:

- Entire textbook chapters or documentation pages
- Full tutorials or course notes
- Long theoretical explanations
- Daily learning journals or personal reflections
- Blog posts or Medium articles reproduced verbatim
- Generic descriptions without technical decisions
- Anything that only makes sense while learning, not while working

---

## Success definition

AENS is successful if an AI engineer can open the system and within 30 seconds:

- Find the right package or model
- Find the exact syntax or parameter
- Make a confident implementation decision
- Jump to the correct official documentation page

without opening 20 browser tabs.

That is the only success metric that matters.

---

## Relationship to official documentation

Official documentation is always the source of truth.

AENS is the navigation layer that helps reach the right page in official docs faster.

When AENS content conflicts with official documentation, official documentation wins.

Every content item should include at least one direct link to official documentation — not a homepage, the specific page that answers the question.

---

## Single-user design constraints

AENS is designed for exactly one user.

This means:

- No authentication, no multi-user features
- No external API calls or database
- Static generation only (all content is local JSON files)
- Content reflects one engineer's actual working needs — not a curriculum, not a comprehensive reference
- Maintenance burden must be low enough for one person to sustain indefinitely
- Zero API cost, zero infrastructure cost

Any architectural decision that increases ongoing maintenance burden for one person must be rejected unless the value is exceptional and clear.
