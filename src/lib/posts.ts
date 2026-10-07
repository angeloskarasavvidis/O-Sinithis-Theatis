import { createClient } from "@supabase/supabase-js";
import { Post } from "@/types";

export function rowToPost(row: Record<string, unknown>): Post {
  return {
    id:          String(row.id),
    slug:        row.slug as string,
    title:       row.title as string,
    subtitle:    row.subtitle as string,
    excerpt:     row.excerpt as string,
    content:     (row.content as string | undefined) ?? "",
    author:      row.author as string,
    date:        row.date as string,
    readingTime: row.reading_time as number,
    genre:       row.genre as string[],
    director:    row.director as string,
    year:        row.year as number,
    postType:    row.post_type as Post["postType"],
    rating:      (row.rating as number | null) ?? undefined,
    image:       row.image as string,
    featured:    row.featured as boolean,
    tags:        row.tags as string[],
    badge:       (row.badge as Post["badge"] | null) ?? undefined,
    // server reads go through the public key, which can only see published posts
    status:      row.status === "draft" ? "draft" : "published",
  };
}

// Everything except the article body, which is only needed on the article page.
const SUMMARY_COLUMNS =
  "id,slug,title,subtitle,excerpt,author,date,reading_time,genre,director,year,post_type,rating,image,featured,tags,badge";

// How long server-rendered pages may serve cached post data, in seconds.
const REVALIDATE_SECONDS = 60;

// A read-only client for server rendering: no session, and requests cached briefly by Next.
function serverClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS } }),
    },
  });
}

/** All posts without their body, newest first. Returns [] if the database cannot be reached. */
export async function fetchPostSummaries(): Promise<Post[]> {
  const { data, error } = await serverClient()
    .from("posts")
    .select(SUMMARY_COLUMNS)
    .order("date", { ascending: false });
  if (error || !data) {
    if (error) console.error("[posts] could not load posts:", error.message);
    return [];
  }
  return (data as unknown as Record<string, unknown>[]).map(rowToPost);
}

/** The current slug of the post with this id, or null. Used to redirect retired addresses. */
export async function fetchSlugById(id: string): Promise<string | null> {
  const { data } = await serverClient().from("posts").select("slug").eq("id", id).maybeSingle();
  return (data?.slug as string | undefined) ?? null;
}

/** One full post, or null if there is none with this slug. */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await serverClient().from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) console.error("[posts] could not load post:", error.message);
  return data ? rowToPost(data) : null;
}
