export const siteConfig = {
  name: "Lex Witness",

  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://admin.lexwitness.com/api/v1",

  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lwsubscription.vercel.app",

  magazinesImageBaseUrl: process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "",

  postsImageBaseUrl: process.env.NEXT_PUBLIC_POSTS_BASE_URL || "",

  authorImageBaseUrl: process.env.NEXT_PUBLIC_ADMIN_IMAGE_URL || "",

  editorialImageBaseUrl: process.env.NEXT_PUBLIC_EDITORIAL_IMAGE_URL || "",

  bannerBaseUrl: process.env.NEXT_PUBLIC_BANNER_BASE_URL || "",

  defaultOgImage: "/default-og-image.jpg",
} as const;
