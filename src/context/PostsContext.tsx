"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Post } from "@/types";
import postsData from "@/data/posts.json";

interface PostsContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  removePost: (id: string) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("osth_posts");
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      setPosts(postsData as Post[]);
    }
  }, []);

  function addPost(post: Post) {
    setPosts((prev) => {
      const next = [post, ...prev];
      localStorage.setItem("osth_posts", JSON.stringify(next));
      return next;
    });
  }

  function removePost(id: string) {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem("osth_posts", JSON.stringify(next));
      return next;
    });
  }

  return (
    <PostsContext.Provider value={{ posts, addPost, removePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider");
  return ctx;
}
