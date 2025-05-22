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
      '*'
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },

  // Experimental features
  experimental: {
    serverActions: true,
    optimizeCss: true
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
  ],

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }

      // Performance settings
      config.performance = {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      }
    }

    return config
  }
}

export default nextConfig
