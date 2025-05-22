/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core settings
  reactStrictMode: true,
  
  // Build settings
  eslint: {
    // Only run ESLint on production builds
    ignoreDuringBuilds: true
  },
  typescript: {
    // Only run TypeScript type checking on production builds
    ignoreBuildErrors: true
  },

  // Image settings
  images: {
    domains: [
      'webfuzsion.co.uk',
      'www.webfuzsion.co.uk',
      'opengraph.b-cdn.net',
      'blob.v0.dev',
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },

  // Experimental features
  experimental: {
    serverActions: true,
  },

  // Server settings
  serverExternalPackages: [
    'sharp',
    'framer-motion',
    'nodemailer',
    'react-email',
    '@react-email/components',
  ],

  // Headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
}

export default nextConfig
