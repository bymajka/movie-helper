import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        // TMDb uses paths like /t/p/w500/... or /t/p/original/...
        // Use /** to match any size and file
        pathname: '/t/p/**',
      }
    ]
  }
};

export default nextConfig;
