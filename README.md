# Yield Borg

Yield Borg shows a simple chart of the different APYs available on the SwissBorg platform. Yield Borg is currently deployed on Vercel: [yield-borg.vercel.app](https://yield-borg.vercel.app).

## Tech Stack

* [Next.js](https://nextjs.org) app hosted on [Vercel](https://vercel.com)
* [Redis](https://redis.io) database hosted on [Upstash](https://www.upstash.com)
* Other dependencies: [Recharts](https://recharts.org/), [Tailwind CSS](https://tailwindcss.com)
* [Github Actions](https://github.com/features/actions) to check for new yields every hour
* Privacy-friendly [GoatCounter](https://www.goatcounter.com) for web analytics

## TODO

* Improve style
* Complete historical data for USDC
* Add a table with monthly average yields
