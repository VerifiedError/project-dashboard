/**
 * FILE-REF: CONFIG-003-20251128
 *
 * @file next.config.js
 * @description Next.js configuration file
 * @category Configuration
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial Next.js configuration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.ngrok.io',
      },
      {
        protocol: 'https',
        hostname: '**.neon.tech',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
