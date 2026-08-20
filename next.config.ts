import type { NextConfig } from "next";

/**
 * Local dev/prod: normal server build.
 * GitHub Pages (EXPORT=1): static export with basePath matching the repo name.
 */
const isExport = process.env.EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport
    ? {
        output: "export",
        basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "/saadat",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;