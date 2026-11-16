import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.alshuaibi.family",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "family-box.aksapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
