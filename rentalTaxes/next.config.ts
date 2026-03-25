import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@electric-sql/pglite-react", // Optional
    "@electric-sql/pglite-repl",
    "@electric-sql/pglite",
  ],
  devIndicators: false,
  output: "export",
};

export default nextConfig;
