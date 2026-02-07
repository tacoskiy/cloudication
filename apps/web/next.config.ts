import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  transpilePackages: ["@cloudication/shared-types"],

  output: "standalone",
};

export default nextConfig;
