/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: process.env.NODE_ENV !== 'production',  // Disable React's strict mode in production
  //productionBrowserSourceMaps: true, // Enable source maps in production
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
