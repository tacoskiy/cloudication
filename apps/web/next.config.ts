import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    root: __dirname,
  },

  output: "standalone",

  transpilePackages: ["@cloudication/shared-types"],
};

export default nextConfig;
