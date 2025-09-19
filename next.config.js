 1	/** @type {import('next').NextConfig} */
     2	const nextConfig = {
     3	  reactStrictMode: true,
     4	  swcMinify: true,
     5	  env: {
     6	    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
     7	  },
     8	  async rewrites() {
     9	    return [
    10	      {
    11	        source: '/api/:path*',
    12	        destination: process.env.NODE_ENV === 'development' 
    13	          ? 'http://localhost:8000/:path*'
    14	          : '/api/:path*',
    15	      },
    16	    ];
    17	  },
    18	  images: {
    19	    remotePatterns: [
    20	      {
    21	        protocol: 'https',
    22	        hostname: 'polygon.io',
    23	      },
    24	    ],
    25	  },
    26	  experimental: {
    27	    serverComponentsExternalPackages: ['axios'],
    28	  },
    29	}
    30	
    31	module.exports = nextConfig
