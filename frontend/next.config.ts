import path from "path";
import { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  // --- INÍCIO DA SOLUÇÃO DO CORS (PROXY) ---
  async rewrites() {
    return [
      {
        // Quando o frontend chamar /api-backend/...
        source: '/api-backend/:path*',
        // ...o Next vai buscar escondido lá no Render:
        destination: 'https://loca-space.onrender.com/:path*',
      },
    ];
  },
  // --- FIM DA SOLUÇÃO DO CORS ---

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