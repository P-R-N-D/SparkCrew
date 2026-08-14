import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/core/:path*",
        destination: "http://127.0.0.1:8000/core/:path*",
      },
      {
        source: "/agent/:path*",
        destination: "http://127.0.0.1:8000/agent/:path*",
      },
    ];
  },
};

export default nextConfig;
