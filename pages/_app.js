import App from 'next/app'
import { SWRConfig } from 'swr'
import { Cookies, CookiesProvider } from 'react-cookie'
import '../styles/globals.css'


export default function MyApp({ Component, pageProps, cookies }) {
   const isBrowser = typeof window !== 'undefined'
   return (
      <SWRConfig value={{ fetcher: (url) => fetch(url).then(res => res.json()) }}>
         <CookiesProvider cookies={isBrowser ? undefined : new Cookies(cookies)}>
            <Component {...pageProps} />
         </CookiesProvider>
      </SWRConfig>
   )
}

MyApp.getInitialProps = async (appContext) => {
   const appProps = await App.getInitialProps(appContext)
   return { ...appProps, cookies: appContext.ctx.req?.cookies }
}
