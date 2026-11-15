import type { NextConfig } from 'next'

const remoteApiOrigin = process.env.REMOTE_API_ORIGIN

const nextConfig: NextConfig = {
   reactStrictMode: true,
   async rewrites() {
      return {
         beforeFiles: remoteApiOrigin
            ? [{
               source: '/api/:route(yield|yield-average|community-index)',
               destination: `${remoteApiOrigin}/api/:route`,
            }]
            : [],
         afterFiles: [],
         fallback: [],
      }
   },
}

export default nextConfig
