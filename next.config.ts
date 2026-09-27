import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/lumera",
  trailingSlash: true,
  allowedDevOrigins: process.env.LUMERA_ALLOWED_ORIGINS
    ? process.env.LUMERA_ALLOWED_ORIGINS.split(",")
    : ["*"],
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@fontsource/vazirmatn"],
  },
};

export default nextConfig;
