import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: '/gratis-handboek',
        destination: '/actiehandboek',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
