import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    // Determine the backend URL based on the environment
    const backendUrl = process.env.API_BASE_URL;

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
