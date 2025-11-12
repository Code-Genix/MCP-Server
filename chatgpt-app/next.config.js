/** @type {import('next').NextConfig} */

const nextConfig = {
  // Asset prefix for iframe rendering in ChatGPT
  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NODE_ENV === 'production'
      ? undefined
      : 'http://localhost:3001',
};

module.exports = nextConfig;
