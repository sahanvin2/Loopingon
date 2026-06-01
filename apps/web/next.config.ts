import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "*.cdn.loopingon.com",
      },
      {
        protocol: "https",
        hostname: "cdn.loopingon.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;
