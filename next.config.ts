import type { NextConfig } from "next";

/**
 * Next.js Configuration Options:
 * 
 * 1. typescript.ignoreBuildErrors: Set to false to ensure that production builds
 *    will fail loudly if any TypeScript compilation errors are encountered. This
 *    guards the deployment pipeline against shipping type-unsafe code.
 * 
 * 2. output: Left unset to allow dynamic rendering features on Vercel, rather than
 *    forcing static export ('export') which disables full server-side features.
 */
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
