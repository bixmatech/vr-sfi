/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  }
};

module.exports = nextConfig;