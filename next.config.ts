import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jaalyantra.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      }
    ],
  },
};

export default nextConfig;
