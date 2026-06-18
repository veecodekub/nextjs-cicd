import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Runtime-only backend URL. Keep this out of NEXT_PUBLIC_* so the image can be promoted unchanged.
const backendUrl = process.env.API_URL || "http://localhost:3000";
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/nextjs-cicd",
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
