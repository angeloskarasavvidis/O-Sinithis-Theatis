"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Post } from "@/types";
import { supabase } from "@/lib/supabase";

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  addPost: (post: Post) => Promise<string | null>;
  updatePost: (post: Post) => Promise<string | null>;
  removePost: (id: string) => Promise<void>;
}

const PostsContext = createContext<PostsContextType | null>(null);

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id:          String(row.id),
    slug:        row.slug as string,
    title:       row.title as string,
    subtitle:    row.subtitle as string,
    excerpt:     row.excerpt as string,
    content:     row.content as string,
    author:      row.author as string,
    date:        row.date as string,
    readingTime: row.reading_time as number,
    genre:       row.genre as string[],
    director:    row.director as string,
    year:        row.year as number,
    postType:    row.post_type as Post["postType"],
    rating:      row.rating as number | undefined,
    image:       row.image as string,
    featured:    row.featured as boolean,
    tags:        row.tags as string[],
    badge:       row.badge as Post["badge"] | undefined,
  };
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // clear any stale localStorage from the old version of the app
    localStorage.removeItem("osth_posts");

    supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("[PostsContext] Supabase error:", error.message);
        } else if (data) {
          setPosts(data.map(rowToPost));
        }
        setLoading(false);
      });
  }, []);

  async function addPost(post: Post): Promise<string | null> {
    const row = {
      id:           post.id,
      slug:         post.slug,
      title:        post.title,
      subtitle:     post.subtitle,
      excerpt:      post.excerpt,
      content:      post.content,
      author:       post.author,
      date:         post.date,
      reading_time: post.readingTime,
      genre:        post.genre,
      director:     post.director,
      year:         post.year,
      post_type:    post.postType,
      rating:       post.rating ?? null,
      image:        post.image,
      featured:     post.featured,
      tags:         post.tags,
      badge:        post.badge ?? null,
    };
    const { error } = await supabase.from("posts").insert(row);
    if (!error) setPosts((prev) => [post, ...prev]);
    return error ? error.message : null;
  }

  async function updatePost(post: Post): Promise<string | null> {
    const row = {
      slug:         post.slug,
      title:        post.title,
      subtitle:     post.subtitle,
      excerpt:      post.excerpt,
      content:      post.content,
      author:       post.author,
      date:         post.date,
      reading_time: post.readingTime,
      genre:        post.genre,
      director:     post.director,
      year:         post.year,
      post_type:    post.postType,
      rating:       post.rating ?? null,
      image:        post.image,
      featured:     post.featured,
      tags:         post.tags,
      badge:        post.badge ?? null,
    };
    const { data, error } = await supabase.from("posts").update(row).eq("id", post.id).select();
    if (!error) setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    return error ? error.message : null;
  }

  async function removePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <PostsContext.Provider value={{ posts, loading, addPost, updatePost, removePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider");
  return ctx;
}
