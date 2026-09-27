import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // در محیط‌های پیش‌نمایش (پورت پروکسی‌شده) HMR و منابع dev باید قابل دسترسی باشند
  allowedDevOrigins: process.env.LUMERA_ALLOWED_ORIGINS
    ? process.env.LUMERA_ALLOWED_ORIGINS.split(",")
    : ["*"],
  poweredByHeader: false,
  images: {
    // تصاویر پروژه به‌صورت محلی و بهینه در public/img سرو می‌شوند؛
    // از next/image برای کنترل کامل روی RTL و لود تدریجی استفاده نمی‌کنیم.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@fontsource/vazirmatn"],
  },
};

export default nextConfig;
