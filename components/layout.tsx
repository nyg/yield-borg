import { cn } from 'cn'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Script from 'next/script'
import type { ReactNode } from 'react'

const pages = [
   { href: '/', label: 'Smart Yields' },
   { href: '/community-index', label: 'Community Index' },
]

const footerLink = 'inline-block py-2 underline-offset-4 hover:text-foreground hover:underline'

type LayoutProps = {
   name: string
   description: string
   children: ReactNode
}

export default function Layout({ name, description, children }: LayoutProps) {
   const { pathname } = useRouter()

   return (
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 sm:px-6">

         <Head>
            <title>{`${name} — Yield Borg`}</title>
            <meta name="description" content="Track the evolution of SwissBorg Smart Yields" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
         </Head>

         <Script data-goatcounter="/api/count" src="/count.js" />

         <header className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b py-3">
            <Link href="/" className="text-lg font-semibold tracking-tight">Yield <span className="text-primary">Borg</span></Link>
            <nav aria-label="Main" className="-mx-2.5 flex gap-1">
               {pages.map(page => (
                  <Link
                     key={page.href} href={page.href}
                     aria-current={pathname === page.href ? 'page' : undefined}
                     className={cn(
                        'flex items-center rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors',
                        'hover:text-foreground pointer-coarse:min-h-11',
                        'aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-accent-foreground'
                     )}>
                     {page.label}
                  </Link>
               ))}
            </nav>
         </header>

         <main className="grow space-y-4 py-6">
            <div className="space-y-1">
               <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
               <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
         </main>

         <footer className="flex flex-wrap items-center gap-x-6 border-t py-2 text-xs text-muted-foreground">
            <span>
               Data from <a href="https://swissborg.com" target="_blank" rel="noreferrer" className={footerLink}>SwissBorg</a>
            </span>
            <a href="https://github.com/nyg/yield-borg" target="_blank" rel="noreferrer" className={footerLink}>
               Source on GitHub
            </a>
         </footer>

      </div>
   )
}
