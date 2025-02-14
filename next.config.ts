import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kuchi-images.s3.sa-east-1.amazonaws.com', // Adicione o domínio correto
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
