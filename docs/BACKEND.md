# Backend Development (Database & API)

We use [**Supabase**][supabase-docs] for the back end.  
Supabase provides a managed **PostgreSQL database** with a built-in **edge function API layer**.

The back end is defined with the following subfolders in the [`/supabase`](/supabase/) directory:

- [`/functions`](/supabase/functions/): Edge functions (API endpoints).
- [`/schemas`](/supabase/schemas/): Database tables, functions, etc.
- [`/migrations`](/supabase/migrations/): Auto-generated migrations (do not edit manually).

---

## Prerequisites

- [OrbStack][orbstack] (macOS) or [Docker Desktop][docker-desktop] (Windows) (required for DB + edge functions)
- [Deno][deno] (required for edge functions)

Recommended VS Code extensions:

- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`
- `denoland.vscode-deno`

---

## Local Development

Docs: [Supabase Local Development](supabase-local-development)

> ℹ️ OrbStack or Docker Desktop must be running.

Start the local back end with `npx supabase start`.

The output shows service URLs:

- **Studio Url**: http://127.0.0.1:54323
  - Open in a browser to inspect the local database, edge functions, and logs.
- **API URL**: http://127.0.0.1:54321

Stop the local back end with `npx supabase stop`.

While developing edge functions, run `npx supabase functions serve` in another
terminal. This serves the functions locally and picks up newly added function
folders such as `/auth`.

---

## Database

Docs: [Database Guides][database-docs]

> ℹ️ Some tables must load in dependency order. Table files are numbered to ensure this.

To make changes to the database:

1. Add or update `*.sql` files in [`/schemas`](/supabase/schemas/).
2. Stop the back end with `npx supabase stop`, if running.
3. Generate a migration with `npx supabase db diff -f <migration-name>`.
4. Start the back end with `npx supabase start`.
5. Apply the migration to the local DB with `npx supabase migration up`.

> ℹ️ If data structures have changed, regenerate TS types for edge functions with `npm run gen-be-types`. The generated types are found at [`/functions/_shared/types.gen.ts`](/supabase/functions/_shared/types.gen.ts).

---

## Edge Functions

Docs: [Edge Function Guides][edge-function-docs]

To make changes to edge functions, add or update `*.ts` files in [`/functions`](/supabase/functions/).

> ℹ️ Changes will hot-reload if the local back end is running.

> ⚠️ Do not install NPM packages. Edge functions use **Deno**, not Node.

Each directory in [`/functions`](/supabase/functions/) is a controller (top-level route). Each `index.ts` defines its sub-routes. The DB is accessed via the Supabase client.

To see edge-function console logs, run `npx supabase functions serve`.

---

## Config

Docs: [Supabase Config](https://supabase.com/docs/guides/local-development/cli/config)

Restart the local Supabase instance to pick up local config changes.

---

## Reset

Reset the local DB (clears data and applies migrations) with `npx supabase db reset`.

---

## Emails

Emails sent while running local development are not actually sent, but you can view the emails that would have been sent at http://127.0.0.1:54324/.

---

## Seed Data

`supabase/seed.sql` creates three local users. Each account uses the password `password123`.

- `jonny@example.com`
- `nathan@example.com`
- `waifu@example.com`

[supabase-docs]: https://supabase.com/docs
[orbstack]: https://orbstack.dev/
[docker-desktop]: https://docs.docker.com/desktop/setup/install/windows-install/
[deno]: https://docs.deno.com/runtime/getting_started/installation/
[supabase-local-development]: https://supabase.com/docs/guides/local-development
[edge-function-docs]: https://supabase.com/docs/guides/functions
[database-docs]: https://supabase.com/docs/guides/database/overview
