import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "xyjnkhudrirkhppczccs.supabase.co",
      },
    ],
  },
};

export default nextConfig;
