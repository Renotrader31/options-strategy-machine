/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000/:path*'
          : '/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'polygon.io',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['axios'],
  },
}

module.exports = nextConfig
