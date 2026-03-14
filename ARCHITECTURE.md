# Architecture

## Entities

### todos
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, defaultRandom() |
| title | text | Not null |
| completed | boolean | Default false |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

## Routes

| Route | Purpose |
|-------|---------|
| `GET /api/todos` | Electric shape proxy — syncs todos to client |
| `POST /api/mutations/todos` | Insert a new todo |
| `PATCH /api/mutations/todos/:id` | Update title/completed |
| `DELETE /api/mutations/todos/:id` | Delete a todo |
| `/` | Main todo UI |

## Key Files

- `src/db/schema.ts` — Drizzle table definition
- `src/db/zod-schemas.ts` — Zod schemas derived from Drizzle
- `src/db/collections/todos.ts` — Electric-backed TanStack DB collection
- `src/routes/index.tsx` — Todo page (ssr: false, preloads collection)
- `src/routes/api/todos.ts` — Shape proxy route
- `src/routes/api/mutations/todos.ts` — Insert handler
- `src/routes/api/mutations/todos.$id.ts` — Update/Delete handler
