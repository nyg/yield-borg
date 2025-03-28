import Head from 'next/head'
import Script from 'next/script'
import ActiveLink from './active-link'
import FooterImageLink from './footer-image-link'


export default function Layout({ children, name }) {

   return (
      <div>
         <Script data-goatcounter="/api/count" src="/count.js" />

         <Head>
            <title>{`${name} – Yield Borg`}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="viewport-fit=cover" />
         </Head>

         <main className="min-h-screen ios:min-h-fill flex flex-col text-gray-600">
            <header className="bg-gray-100">
               <div className="pt-4 pb-4 pl-16">
                  <h1 className="text-3xl text-gray-800 font-bold inline-block mr-4">Yield Borg</h1>
                  <p className="text-xs text-gray-600 italic inline-block">showing the evolution of the different <a href="http://swissborg.com/smart-yield-account">SwissBorg</a> Smart Yields</p>
               </div>
            </header>

            <nav className="bg-gray-200">
               <div className="pt-2 pb-2">
                  <div className="m-auto flex flex-row w-2/5 text-center text-sm space-x-4">
                     <ActiveLink href="/">Smart Yield</ActiveLink>
                     <ActiveLink href="/community-index">Community Index</ActiveLink>
                  </div>
               </div>
            </nav>

            <section className="text-sm grow">
               <div className="space-y-8 pt-6 pb-6">
                  {children}
               </div>
            </section>

            <footer className="bg-gray-100">
               <div className="pt-2 pb-2 text-center leading-3">
                  <FooterImageLink href="https://github.com/nyg/yield-borg" src="/github.png" alt="github" />
                  <FooterImageLink href="https://yield-borg.goatcounter.com" src="/goatcounter.png" alt="goatcounter" />
               </div>
            </footer>
         </main>
      </div >
   )
}
