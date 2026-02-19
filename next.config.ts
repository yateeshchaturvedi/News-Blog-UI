import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:category(cicd|containers|kubernetes|cloud|iac|observability)",
        destination: "/news/:category",
      },
      {
        source: "/:category(cicd|containers|kubernetes|cloud|iac|observability)/:id",
        destination: "/news/:category/:id",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
