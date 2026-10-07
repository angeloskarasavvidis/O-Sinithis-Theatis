import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPostBySlug } from "@/lib/posts";
import { sanitizePostHtml } from "@/lib/sanitize";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import ArticleView from "./ArticleView";

type Props = { params: Promise<{ slug: string }> };

// generateMetadata and the page both need the post; cache() makes that one query per request
const getPost = cache((slug: string) => fetchPostBySlug(decodeURIComponent(slug)));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Το άρθρο δεν βρέθηκε" };

  const description = post.excerpt || post.subtitle;
  const path = `/posts/${encodeURIComponent(post.slug)}`;
  return {
    title: post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "el_GR",
      images: [{ url: post.image, alt: post.title }],
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description, images: [post.image] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.subtitle,
    image: [post.image],
    datePublished: post.date,
    inLanguage: "el",
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      {/* the body is sanitised here, so the HTML sent to browsers and crawlers is already safe */}
      <ArticleView initialPost={{ ...post, content: sanitizePostHtml(post.content) }} shareUrl={url} />
    </>
  );
}
