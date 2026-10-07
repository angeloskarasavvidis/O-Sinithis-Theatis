import type { Metadata } from "next";
import PostsBrowser from "./PostsBrowser";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

const TYPE_PAGES: Record<string, { title: string; description: string }> = {
  Κριτική: { title: "Κριτικές", description: "Όλες οι κριτικές ταινιών του Συνήθη Θεατή." },
  Αφιέρωμα: { title: "Αφιερώματα", description: "Αφιερώματα σε ταινίες και δημιουργούς από τον Συνήθη Θεατή." },
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { postType } = await searchParams;
  const typePage = typeof postType === "string" ? TYPE_PAGES[postType] : undefined;
  if (typePage) {
    return {
      ...typePage,
      alternates: { canonical: `/posts?postType=${encodeURIComponent(postType as string)}` },
    };
  }
  return {
    title: "Άρθρα",
    description: "Όλες οι κριτικές, τα αφιερώματα και τα νέα του Συνήθη Θεατή.",
    alternates: { canonical: "/posts" },
  };
}

// Reading the query string here renders the page per request, so the filtered list of
// articles is part of the HTML instead of appearing only after the browser runs the script.
export default async function PostsPage({ searchParams }: Props) {
  await searchParams;
  return <PostsBrowser />;
}
