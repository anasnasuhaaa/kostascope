import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
          bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;