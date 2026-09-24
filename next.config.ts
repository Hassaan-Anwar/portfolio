import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["amuser-rebate-viable.ngrok-free.dev"],
  async headers() {
    return [
      {
        source: '/audio/:all*(svg|jpg|png|mp3|ogg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
} as any;

export default nextConfig;
