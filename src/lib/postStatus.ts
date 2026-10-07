import { Post } from "@/types";

export type PostState = "draft" | "scheduled" | "live";

/** Where a post stands at the moment `now` (milliseconds): a draft, published with a future date, or visible to readers. */
export function postState(post: Post, now: number): PostState {
  if (post.status === "draft") return "draft";
  return new Date(post.date).getTime() > now ? "scheduled" : "live";
}
