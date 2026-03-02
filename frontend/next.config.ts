import path from "path";
import { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  env: {
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  experimental: {
    serverActions: {
      // Isso permite que o servidor aceite requisições vindas da URL do GitHub
      allowedOrigins: ["localhost:3000", "*.app.github.dev", "*.github.dev"],
    },
  },
};

export default withFlowbiteReact(nextConfig);

