"use client";

import { use } from "react";
import AdminGate from "@/components/admin/AdminGate";
import PostEditor from "@/components/admin/PostEditor";
import NotFoundPanel from "@/components/NotFoundPanel";
import { usePosts } from "@/context/PostsContext";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { posts, ready } = usePosts();
  const post = posts.find((p) => p.id === decodeURIComponent(id));

  return (
    <AdminGate>
      {/* article bodies only arrive with the full load, so wait for it before opening the editor */}
      {!ready ? (
        <div className="max-w-7xl mx-auto px-4 py-8"><div className="h-96 bg-black/20 animate-pulse" aria-busy="true" /></div>
      ) : post ? (
        <PostEditor key={post.id} post={post} />
      ) : (
        <NotFoundPanel message="Η ανάρτηση που θέλεις να επεξεργαστείς δεν υπάρχει." />
      )}
    </AdminGate>
  );
}
