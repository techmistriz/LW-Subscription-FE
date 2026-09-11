import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getPosts } from "@/services/post.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const postsResponse = await getPosts({
    page: 1,
    per_page: 1000,
  });

  const posts = postsResponse?.data || [];

  const articleUrls: MetadataRoute.Sitemap = posts
    .filter((post: { slug?: string }) => post.slug)
    .map(
      (post: {
        slug: string;
        updated_at?: string;
        published_at?: string;
        publish_date?: string;
        date?: string;
      }) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified:
          post.updated_at ||
          post.published_at ||
          post.publish_date ||
          post.date ||
          new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }),
    );

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/magazines`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...articleUrls];
}
