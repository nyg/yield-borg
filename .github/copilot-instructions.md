# Copilot Instructions — Yield Borg

## Build & Run Commands

```sh
pnpm install        # install dependencies
pnpm dev            # dev server on localhost:3000
pnpm build          # production build
pnpm lint           # ESLint (next lint)
```

No test framework is configured.

## Environment Variables

Copy `.env.development.local.example` to `.env.development.local` and fill in:

- `POSTGRES_URL` — Neon PostgreSQL connection string
- `CRON_KEY` — Bearer token protecting `/api/cron/*` routes (use `dev` locally)

`GOAT_KEY` is used in production for GoatCounter analytics (optional locally).

## Architecture

Next.js Pages Router app deployed on Vercel with a Neon PostgreSQL database.

**Data pipeline:**

```
SwissBorg static API → Cron jobs (/api/cron/*) → PostgreSQL → Public API routes (/api/*) → SWR on frontend → Recharts
```

- **Cron routes** (`pages/api/cron/`) fetch data from SwissBorg's GatsbyJS static JSON endpoints using `got`, then insert into Postgres. They run on schedules via GitHub Actions workflows.
- **Public API routes** (`pages/api/yield.js`, `yield-average.js`, `community-index.js`) query the database and return JSON consumed by the frontend.
- **Frontend pages** use SWR hooks (`useSWR('/api/...')`) for data fetching. Chart settings (yield rate, time frame, line type) are persisted in browser cookies via `react-cookie`.

### Cron Authentication

`proxy.js` in the project root is a Next.js middleware that intercepts all `/api/cron/*` requests. It validates `Authorization: Bearer <CRON_KEY>` and redirects failures to `/api/unauthenticated` (401).

## Code Conventions

### Style (enforced by ESLint)

- **3-space indentation**
- **No semicolons**
- **Single quotes** for strings

### Database Access

Direct SQL via the `postgres` template tag library — no ORM. The singleton connection is exported as `pgSql` from `db/db.js`:

```js
import { pgSql } from '../../db/db'
const rows = await pgSql`SELECT * FROM yields WHERE date > ${since}`
```

Parameters are automatically escaped by the template tag.

### Data Fetching

- **Frontend:** SWR with a global fetcher configured in `_app.js` (`fetch → res.json()`).
- **API → External:** `got` for HTTP calls to SwissBorg APIs.
- **API → DB:** `pgSql` template tags (see above).

### Frontend State

All persistent UI state (selected yield rate, line type, time frame, asset visibility) is stored in cookies with a 10-year maxAge. Asset names are normalized by removing special characters before use as cookie keys.

### Formatting & Dates

`utils/format.js` wraps `Intl.DateTimeFormat` and `Intl.NumberFormat` with locale auto-detection. Dates are stored as JS Date objects in Postgres and converted to Unix timestamps (milliseconds) for Recharts.

### Component Organization

- `components/shared/` — Layout shell, navigation, footer
- `components/yield/` — Chart, settings, tooltip, averages table, info panel
- Pages compose these components; data fetching lives in the leaf components (e.g., `yield-chart.js` fetches its own data via SWR), not in page-level `getServerSideProps`.

### Chart Colors

`utils/config.js` exports a 13-color palette array. Colors are assigned to assets by index (modulo array length). The same file exports yield rate multipliers for SwissBorg tiers (genesis, pioneer, community, explorer, standard).
