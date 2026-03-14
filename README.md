# Todo App

A local-first, real-time todo application built with Electric SQL + TanStack DB.

## Features

- Add, complete, and delete tasks
- Filter by All / Active / Completed
- Optimistic updates — changes appear instantly
- Real-time sync across all open tabs and clients

## Tech Stack

- [Electric SQL](https://electric-sql.com) — Postgres-to-client real-time sync
- [TanStack DB](https://tanstack.com/db) — reactive collections and optimistic mutations
- [Drizzle ORM](https://orm.drizzle.team) — schema definitions and migrations
- [TanStack Start](https://tanstack.com/start) — React meta-framework with SSR

## Running Locally

```bash
pnpm install
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
pnpm dev:start
```

Open [http://localhost:8080](http://localhost:8080).
