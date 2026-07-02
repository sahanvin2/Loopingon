import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "*.backblazeb2.com",
      },
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lbrggticuwyqmdtllxsh.supabase.co",
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
  output: "standalone",
};

export default nextConfig;
