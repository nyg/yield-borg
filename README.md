# Yield Borg

Charts the Smart Yield rates, the Community Index and the platform figures of [SwissBorg](https://swissborg.com). Live at **[yield-borg.vercel.app](https://yield-borg.vercel.app)**.

Scheduled GitHub Actions call the cron API routes, which store the figures SwissBorg publishes in PostgreSQL: yields and platform figures every day, the Community Index every week.

## Stack

TypeScript, [Next.js](https://nextjs.org), [shadcn/ui](https://ui.shadcn.com), [Recharts](https://recharts.org), [Neon](https://neon.tech) PostgreSQL, hosted on [Vercel](https://vercel.com).

## Local setup

```sh
cp .env.development.local.example .env.development.local
pnpm install
pnpm dev        # http://localhost:3000
```

Fill in `POSTGRES_URL` and `CRON_KEY` in `.env.development.local`. Without a database, set `REMOTE_API_ORIGIN=https://yield-borg.vercel.app` instead to chart the data of the live site.

## Docs

- [Architecture](docs/architecture.md): data pipeline, API routes, cron jobs
- [AGENTS.md](AGENTS.md): commands and code conventions
