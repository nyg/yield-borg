import Head from 'next/head'
import Script from 'next/script'
import MenuLink from './lib/menu-link'
import ExternalLink from './lib/external-link'


export default function Layout({ children, name }) {
   return (
      <div className="flex flex-col min-h-screen px-6 pb-12 max-w-7xl mx-auto">

         <Head>
            <title>{`${name} — Yield Borg`}</title>
            <meta name="description" content="Track the evolution of SwissBorg Smart Yields" />
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
         </Head>

         <Script data-goatcounter="/api/count" src="/count.js" />

         <header className="px-3 pb-2 mt-4 flex items-baseline gap-x-3 border-b border-border">
            <h1 className="text-xl font-semibold tracking-tight">Yield Borg</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
               SwissBorg Smart Yield tracker
            </p>
            <span className="grow" />
            <MenuLink href="/">Smart Yield</MenuLink>
            <MenuLink href="/community-index">Community Index</MenuLink>
            <span className="text-xs text-muted-foreground">•</span>
            <MenuLink href="https://github.com/nyg/yield-borg">GitHub</MenuLink>
         </header>

         <main className="grow mt-8">
            {children}
         </main>

      </div>
   )
}
