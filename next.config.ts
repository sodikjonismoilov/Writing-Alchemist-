import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  // The following is a workaround for a known issue with Next.js and Turbopack.
  // This can be removed once the issue is resolved.
  experimental: {
    serverActions: {
      allowedOrigins: ['*.google.com', '*.firebase.app', '*.cloud.run', '*.cloud.shell'],
    },
  },
};

export default nextConfig;
