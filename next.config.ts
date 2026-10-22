import type { NextConfig } from "next";

/**
 * GitHub Pages is a static host, so the build is a plain export.
 * Local dev leaves the base path empty. The pages build sets
 * NEXT_PUBLIC_BASE_PATH=/full-flow-rocket-anatomy.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
