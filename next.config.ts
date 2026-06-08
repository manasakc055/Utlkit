import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/Utlkit",
  assetPrefix: "/Utlkit/",
};

export default nextConfig;
