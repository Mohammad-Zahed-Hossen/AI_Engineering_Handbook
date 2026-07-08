# Relationship System

The package relationship system is a lightweight, typed navigation layer for package tasks.

## Adding a relationship

Add a `relationships` array to any package task entry:

```json
{
  "task": "Draw Histogram",
  "relationships": [
    {
      "type": "equivalent",
      "target": "Create Histogram",
      "package": "seaborn",
      "reason": "Seaborn wraps Matplotlib histogram concepts in a statistical API."
    }
  ]
}
```

## Supported relationship types

- `equivalent`
- `alternative`
- `interactive_equivalent`
- `static_equivalent`
- `advanced_version`
- `simpler_version`
- `used_with`
- `migration_target`

## Rules

- `type`, `target`, `package`, and `reason` are required.
- `target` should match a task `task` or `resource_id` in the target package.
- Self references are warned about.
- Duplicate relationships are warned about.

## Rendering

Relationships are rendered inside the existing expandable package task cards under the "Related APIs & Alternatives" section.
