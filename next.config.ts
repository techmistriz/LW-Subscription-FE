/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.lexwitness.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "admin.lexwitness.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "portal.demoserver.co.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lexwitness.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "lexwitness.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
      
    ],
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/category/:slug",
        destination: "/category/:slug",
      },
    ];
  },
};

export default nextConfig;
