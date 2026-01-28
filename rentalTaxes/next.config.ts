import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@electric-sql/pglite-react", // Optional
    "@electric-sql/pglite-repl",
    "@electric-sql/pglite",
  ],
  devIndicators: false,
};

export default nextConfig;
