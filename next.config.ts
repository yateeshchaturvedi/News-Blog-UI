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
};

export default nextConfig;
