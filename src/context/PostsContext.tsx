"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Post } from "@/types";
import { supabase } from "@/lib/supabase";
import { rowToPost } from "@/lib/posts";

interface PostsContextType {
  posts: Post[];
  /** true only when there is nothing to show yet */
  loading: boolean;
  /** true once the full posts (with article bodies) have been loaded in the browser */
  ready: boolean;
  addPost: (post: Post) => Promise<string | null>;
  updatePost: (post: Post) => Promise<string | null>;
  removePost: (id: string) => Promise<void>;
}

const PostsContext = createContext<PostsContextType | null>(null);

// `initialPosts` are rendered on the server (without article bodies) so pages have content in
// their HTML. The browser then loads the full, current list and replaces them.
export function PostsProvider({ children, initialPosts = [] }: { children: ReactNode; initialPosts?: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [ready, setReady] = useState(false);

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
          setReady(true);
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
    <PostsContext.Provider value={{ posts, loading, ready, addPost, updatePost, removePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider");
  return ctx;
}
