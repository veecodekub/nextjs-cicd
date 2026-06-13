import type { NextConfig } from "next";

// ดึงค่าจาก ENV หรือ fallback ไปที่ localhost:3000 หากไม่ได้ตั้งค่าไว้
const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
console.log("backendUrl", backendUrl);

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/nextjs-cicd",
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
