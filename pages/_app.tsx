import '../styles/global.css'

import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'

async function fetcher(url: string) {
   const response = await fetch(url)
   const result = await response.json()
   if (!response.ok) {
      return Promise.reject(result?.error || 'An unexpected error happened.')
   }
   return result
}

export default function MyApp({ Component, pageProps }: AppProps) {
   return (
      <SWRConfig value={{ fetcher }}>
         <Component {...pageProps} />
      </SWRConfig>
   )
}
