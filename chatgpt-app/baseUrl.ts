/**
 * Base URL Configuration
 * Auto-detects environment (local/Vercel) for correct asset loading
 */

export const baseURL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.NODE_ENV === 'production'
        ? 'https://your-domain.com' // Replace with your domain
        : 'http://localhost:3001';

export default baseURL;


