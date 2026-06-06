# Yield Borg

Charts the Smart Yield rates available on [SwissBorg](https://swissborg.com), updated daily via scheduled jobs. Live at **[yield-borg.vercel.app](https://yield-borg.vercel.app)**.

## Stack

| Layer | Tech |
|---|---|
| Frontend | [Next.js](https://nextjs.org) · [Recharts](https://recharts.org) · [Tailwind CSS](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) |
| Backend | Next.js API routes · [postgres](https://github.com/porsager/postgres) |
| Database | [Neon](https://neon.tech) (PostgreSQL) |
| Hosting | [Vercel](https://vercel.com) |
| Scheduling | [GitHub Actions](https://github.com/features/actions) |
| Analytics | [GoatCounter](https://www.goatcounter.com) |

## Local Setup

```sh
cp .env.development.local.example .env.development.local
# fill in POSTGRES_URL and CRON_KEY (use "dev" for CRON_KEY locally)

pnpm install
pnpm dev        # http://localhost:3000
```

## Docs

- [Architecture](docs/architecture.md) — data pipeline, API routes, cron jobs
