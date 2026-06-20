import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // // Only use static export for production builds to avoid strict generateStaticParams checks in dev
  // output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5056',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      }
    ],
  },
};

export default nextConfig;
