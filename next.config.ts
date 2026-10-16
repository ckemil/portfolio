import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
