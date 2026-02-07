import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  transpilePackages: ["@cloudication/shared-types"],
};

export default nextConfig;
