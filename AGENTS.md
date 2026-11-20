# Agent Instructions — Yield Borg

## Build & Run Commands

```sh
pnpm install             # install dependencies
pnpm dev                 # dev server on localhost:3000
pnpm build               # production build
pnpm lint                # ESLint with --fix
pnpm exec tsc --noEmit   # type-check
```

No test framework is configured.

## Environment Variables

Copy `.env.development.local.example` to `.env.development.local` and fill in:

- `POSTGRES_URL` — Neon PostgreSQL connection string
- `CRON_KEY` — Bearer token protecting `/api/cron/*` routes (use `dev` locally)
- `REMOTE_API_ORIGIN` — optional, for development without a database: `/api/yield`, `/api/yield-average` and `/api/community-index` are then served by that deployed instance

`GOAT_KEY` is used in production for GoatCounter analytics (optional locally).

## Architecture

Next.js Pages Router app in TypeScript, deployed on Vercel with a Neon PostgreSQL database.

**Data pipeline:**

```
SwissBorg static API → Cron jobs (/api/cron/*) → PostgreSQL → Public API routes (/api/*) → SWR on frontend → Recharts
```

- **Cron routes** (`pages/api/cron/`) fetch data from SwissBorg's GatsbyJS static JSON endpoints using `got`, then insert into Postgres. They run on schedules via GitHub Actions workflows.
- **Public API routes** (`pages/api/yield.ts`, `yield-average.ts`, `community-index.ts`) query the database and return JSON consumed by the frontend. Their response types live in `types/api.ts`.
- **Frontend pages** use SWR hooks (`useSWR('/api/...')`) for data fetching.

### Cron Authentication

`proxy.ts` in the project root is a Next.js middleware that intercepts all `/api/cron/*` requests. It validates `Authorization: Bearer <CRON_KEY>` and redirects failures to `/api/unauthenticated` (401). Every request fails while `CRON_KEY` is unset.

## Code Conventions

### TypeScript

Strict mode with `noUncheckedIndexedAccess`. TypeScript stays on version 6 until `typescript-eslint` loads under version 7.

Postgres returns `numeric` columns as strings and the API routes pass them through, so the frontend converts values with `Number()`.

### Style (enforced by ESLint)

- **3-space indentation**
- **No semicolons**
- **Single quotes** for strings

Write a quote inside a Tailwind class string as a double quote: `'[&_line[stroke="#ccc"]]:stroke-border'`. An escaped single quote (`\'`) reaches Tailwind as is and breaks the generated CSS.

### shadcn/ui

Components live in `components/ui/` and are added with `pnpm exec shadcn add <name>`. They import `cn` from the `cn` package. After adding one, run `pnpm lint`, apply the quote rule above, and restore any pinned version the CLI changed in `package.json`.

### Database Access

Direct SQL via the `postgres` template tag library — no ORM. The singleton connection is exported as `pgSql` from `lib/db.ts`, and is `null` when `POSTGRES_URL` is unset:

```ts
import { pgSql } from '@/lib/db'
const rows = await pgSql<YieldRow[]>`SELECT * FROM yields WHERE date > ${since}`
```

Parameters are automatically escaped by the template tag.

### Data Fetching

- **Frontend:** SWR with a global fetcher configured in `_app.tsx` (`fetch → res.json()`).
- **API → External:** `got` for HTTP calls to SwissBorg APIs.
- **API → DB:** `pgSql` template tags (see above).

### Frontend State

Preferences (time frame, yield rate, selected strategies) are stored in `localStorage` under `yieldborg.*` and read through `hooks/use-preference.ts`. The server render and the hydration render use the defaults; `useHydrated()` tells when the stored values apply.

### Formatting & Dates

`utils/format.ts` wraps `Intl.DateTimeFormat` and `Intl.NumberFormat` with the `en-GB` locale. Dates are calendar days: the API sends them as Unix timestamps (milliseconds) at midnight UTC, and they are formatted in UTC.

### Component Organization

- `components/ui/` — shadcn/ui components
- `components/yield/` — chart, settings, tooltip, strategy list, averages table
- `components/community-index/` — community index chart
- Pages compose these components; data fetching lives in the leaf components, not in page-level `getServerSideProps`. The chart and the strategy list share the yields through `hooks/use-yields.ts`.

### Chart Colors

`styles/global.css` defines eight series colors, `--chart-1` to `--chart-8`, with light and dark values validated for color-blind separation. A selected strategy keeps its color slot until deselected (`hooks/use-asset-selection.ts`), and `utils/series-style.ts` maps a slot to a color, plus a dash pattern past the eighth slot.

Dark mode follows the system setting through `prefers-color-scheme`; there is no `.dark` class.

`utils/swissborg-config.ts` exports the yield rate multipliers for the SwissBorg ranks (standard, bronze, silver, gold, platinum and above) and the strategies selected by default.
