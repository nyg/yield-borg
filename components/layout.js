import Head from 'next/head'
import Image from 'next/image'
import ActiveLink from './active-link'

export default function Layout({ children, name }) {

  return (
    <div>
      <Head>
        <title>{name} – Yield Borg</title>
        <link rel="icon" href="/favicon.ico" />
        <script data-goatcounter="/api/count" async src="/count.js"></script>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>

      <main className="flex flex-col h-screen text-gray-600">

        <header className="bg-gray-100">
          <div className="lg:max-w-4xl pt-10 pb-10 pl-16">
            <h1 className="text-4xl text-gray-800 font-bold">Yield Borg</h1>
            <p className="text-sm">Chart showing the evolution of the different <a href="http://swissborg.com/smart-yield-account">SwissBorg</a> Smart Yields</p>
          </div>
        </header>

        <nav className="bg-gray-200">
          <div className="lg:max-w-4xl pt-3 pb-3">
            <div className="m-auto flex flex-row w-2/5 text-center text-sm space-x-6">
              <ActiveLink href="/">Smart Yield</ActiveLink>
              <ActiveLink href="/community-index">Community Index</ActiveLink>
            </div>
          </div>
        </nav>

        <div className="text-sm">
          <div className="lg:max-w-4xl lg:pl-2 lg:pr-2">
            {children}
          </div>
        </div>

        <footer className="bg-gray-100 mt-auto">
          <div className="lg:max-w-4xl space-x-6 pt-6 pb-3 text-center">
            <a href="https://github.com/nyg/yield-borg">
              <Image src="/gh-dark.png" alt="github" width="24" height="24" />
            </a>
            <a href="https://yield-borg.goatcounter.com">
              <Image src="/goatcounter.png" alt="goatcounter" width="24" height="24" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}