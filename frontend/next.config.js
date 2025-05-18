/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.co', 'pravatar.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pravatar.co',
        pathname: '**',
      }
    ],
  },
  serverExternalPackages: [],
};

module.exports = nextConfig;
