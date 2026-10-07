import type { MetadataRoute } from "next";
import { fetchPostSummaries } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPostSummaries();
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/posts`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
