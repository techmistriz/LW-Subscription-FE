import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/edit-profile/",
        "/sign-in/",
        "/register/",
        "/forget-password/",
        "/reset-password/",
        "/thankyou/",
        "/invoice/",
      ],
    },

    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
