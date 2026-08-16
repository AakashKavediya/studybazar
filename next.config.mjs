/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    qualities: [70, 75, 80, 90],
  },

  // ✅ Rewrites go here at the root level, NOT inside images
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*', 
      },
      // ✅ Add this specifically for Socket.IO to ensure it works
      {
        source: '/api/socket.io/:path*',
        destination: 'http://127.0.0.1:8000/socket.io/:path*',
      },
    ];
  },

  compiler: {
    styledComponents: true,
  },
  reactCompiler: true,
};

export default nextConfig;