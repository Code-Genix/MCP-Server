/** @type {import('next').NextConfig} */

// Import baseURL for asset prefix
const baseURL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.NODE_ENV === 'production'
        ? 'https://your-domain.com'
        : 'http://localhost:3001';

const nextConfig = {
  // Critical: Ensures assets load correctly when rendered in ChatGPT iframe
  assetPrefix: baseURL,
};

module.exports = nextConfig;
