# Adding Content

## Packages
1. Create `/data/packages/{id}.json` 
2. Follow the schema in `/lib/schemas/package.ts` 
3. Run `npm run validate` 

## Models
1. Create `/data/models/{ml|dl|llm}/{id}.json` 
2. Follow the schema in `/lib/schemas/model.ts` 
3. Run `npm run validate` 

## Workflows
1. Create `/data/workflows/{id}.json` 
2. Follow the schema in `/lib/schemas/workflow.ts` 
3. Run `npm run validate` 

## Cheatsheets
1. Create `/data/cheatsheets/{id}.json` 
2. Follow the schema in `/lib/schemas/cheatsheet.ts` 
3. Run `npm run validate` 

## Registry
1. Open the relevant `/data/registry/{task}.json` array file
2. Add a new entry following the schema in `/lib/schemas/registry.ts` 
3. Run `npm run validate` 

## Rules
- ID must be kebab-case matching the filename: `^[a-z0-9][a-z0-9-]*[a-z0-9]$` 
- `sources` must contain at least one valid URL
- `created_at` and `updated_at` must be `YYYY-MM-DD` 
- `alternatives` must use ContentRef format: `{ "id": "...", "type": "..." }` 
- Auto-discovery is active — no index files to update
- `npm run validate` runs automatically on `npm run build` 
