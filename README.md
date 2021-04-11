# Yield Borg

Yield Borg shows a simple chart of the different APYs available on the SwissBorg platform. Yield Borg is currently deployed on Vercel: [yield-borg.vercel.app](https://yield-borg.vercel.app).

## Tech Stack

* [Next.js](https://nextjs.org) app hosted on [Vercel](https://vercel.com)
* [Redis](https://redis.io) database hosted on [Upstash](https://www.upstash.com)
* Other dependencies: [Recharts](https://recharts.org/), [Tailwind CSS](https://tailwindcss.com)
* [Github Actions](https://github.com/features/actions) to check for new yields every hour
* Privacy-friendly [GoatCounter](https://www.goatcounter.com) for web analytics

## Local installation

```sh
# this file contains environment variables such as REDIS_URL and CRON_KEY
mv .env.development.local.example .env.development.local

# import some data into your development Redis database
npm run import-db

# install dependencies and run app (available on localhost:3000)
npm install
npm run dev
```

## TODO

* Improve style (tooltip, smartphones, etc.)
* Complete historical data for USDC (asked SwissBorg…)
* Add a table with monthly average yields
* Add cron job for community index
* Add settings page to choose
    * line type of chart
    * scale for yields (genesis premium, community premium, no premium)