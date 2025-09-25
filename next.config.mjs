/**
 * Next.js configuration during migration phase.
 * We keep Vite/Express running until parity, then remove legacy stack.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is enabled by default in Next 13+; removing deprecated experimental flag.
  reactStrictMode: true,
  typescript: {
    // During migration we may have type errors referencing legacy paths; don't block builds initially.
    ignoreBuildErrors: true,
  },
  eslint: {
    // We'll re-enable once pages fully migrated.
    ignoreDuringBuilds: true,
  },
  // Allow ngrok and other dev origins for cross-origin requests
  allowedDevOrigins: [
    '4af482d17f59.ngrok-free.app',
    'localhost:3000',
    '10.20.38.218:3000'
  ]
};

export default nextConfig;
