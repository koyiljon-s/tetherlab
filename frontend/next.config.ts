import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Work around the missing default in Next 16.3.5's dev configuration.
    instantInsights: {
      validationLevel: "warning",
    },
  },
  turbopack: {
    // Keep Turbopack inside this app instead of inferring the repository root.
    root: __dirname,
  },
};

export default nextConfig;
