import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next 16 writes AGENTS.md / CLAUDE.md into the project root on every dev
  // start; this project does not ship them.
  agentRules: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
  },

  async redirects() {
    // Simple path-only legacy routes. Query-string routes (catagory.php?id=…)
    // are handled by route handlers, which can read the id.
    return [
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/about.php', destination: '/company', permanent: true },
      { source: '/infrastructure.php', destination: '/infrastructure', permanent: true },
      { source: '/enquiry.php', destination: '/request-quote', permanent: true },
      { source: '/contact.php', destination: '/contact', permanent: true },
      { source: '/sitemap.html', destination: '/sitemap.xml', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
