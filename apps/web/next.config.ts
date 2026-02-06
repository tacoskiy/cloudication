import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../../"),
  experimental: {
    externalDir: true,
  },

  /**
   * 本番 Docker / standalone 対応
   */
  output: "standalone",
};

export default nextConfig;
