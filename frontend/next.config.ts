import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production"

const nextConfig: NextConfig = {
  output: "export",
  /* config options here */
  basePath: isProd ? "/titanic-eda" : "",
  assetPrefix: isProd ? "/titanic-eda/" : "",
};

export default nextConfig;
