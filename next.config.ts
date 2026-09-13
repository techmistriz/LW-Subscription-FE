import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This keeps the maintenance switch available to both the proxy and the
  // root layout at build/start time.
  env: {
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
  },

  images: {
    // IMPORTANT FIX
    unoptimized: true,

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
        protocol: "https",
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

    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    const isMaintenanceMode =
      process.env.MAINTENANCE_MODE?.trim().toLowerCase() === "true";

    if (isMaintenanceMode) {
      return [
        {
          // Keep the maintenance route and Next.js assets reachable so this
          // redirect does not loop and the page can render correctly.
          source: "/:path((?!maintenance$|_next/|favicon\\.ico$).*)",
          destination: "/maintenance",
          permanent: false,
        },
      ];
    }

    return [
      {
        source: "/maintenance",
        destination: "/",
        permanent: false,
      },
      {
        source: "/category/:category/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
