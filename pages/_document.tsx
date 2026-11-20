import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
   return (
      <Html lang="en">
         <Head>
            <meta name="color-scheme" content="light dark" />
            <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7fbf9" />
            <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09110e" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <body>
            <Main />
            <NextScript />
         </body>
      </Html>
   )
}
