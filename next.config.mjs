/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for improved error handling
  reactStrictMode: true,
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add this to prevent trailing slash redirects
  trailingSlash: false,
  
  // Configure images to allow all domains used in the project
  images: {
    domains: [
      'v0.blob.com', 
      'localhost', 
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'public.blob.vercel-storage.com',
      'vercel-storage.com',
      'opengraph.b-cdn.net',
      'blob.v0.dev',
      'gxciioabwrkahdfe.public.blob.vercel-storage.com'
    ],
    // Set unoptimized to true globally to ensure images display correctly
    unoptimized: true,
    // Disable the image optimizer completely
    loader: 'default',
    disableStaticImages: false,
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  
  // Disable unnecessary features
  poweredByHeader: false,
  
  // HTTP/2 server push configuration
  experimental: {
    // Enable HTTP/2 server push for critical assets
    // This is commented out as it's not fully supported in all Next.js versions
    // http2ServerPush: true,
  },
  
  // Remove all custom headers for now
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

// Export the final config
export default nextConfig;
