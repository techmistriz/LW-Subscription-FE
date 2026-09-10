export const siteConfig = {
  name: "Lex Witness",
  url: process.env.NEXT_PUBLIC_API_BASE_URL || "https://lwsubscription.vercel.app",
  postsImageBaseUrl:
    process.env.NEXT_PUBLIC_POSTS_BASE_URL || "https://admin.lexwitness.com/uploads/posts/",
  authorImageBaseUrl: process.env.NEXT_PUBLIC_ADMIN_IMAGE_URL || "",
  defaultOgImage: "/default-og-image.jpg",
} as const;