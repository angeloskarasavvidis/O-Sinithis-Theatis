"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Trash2, Pencil } from "lucide-react";
import { Post } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostsContext";
import EditPostModal from "@/components/admin/EditPostModal";

const postTypeColors: Record<string, string> = {
  Κριτική: "bg-[#009DF8] text-white",
  Αφιέρωμα: "bg-amber-500 text-white",
  Νέα: "bg-zinc-900 text-white",
  Συνέντευξη: "bg-violet-600 text-white",
};

export default function PostCard({ post }: { post: Post }) {
  const { isLoggedIn } = useAuth();
  const { removePost } = usePosts();
  const [showEdit, setShowEdit] = useState(false);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (confirm(`Διαγραφή: "${post.title}";`)) {
      removePost(post.id);
    }
  }

  return (
    <div className="group bg-white overflow-hidden relative flex flex-col border border-zinc-300 hover:border-zinc-500 hover:bg-zinc-50 transition-colors">
      <Link href={`/posts/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className={`absolute top-0 left-0 font-inter text-xs font-semibold uppercase tracking-widest px-3 py-1.5 ${postTypeColors[post.postType] ?? "bg-zinc-700 text-white"}`}>
          {post.postType}
        </span>
        {post.rating && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-zinc-900/80 text-yellow-400 font-inter text-sm font-semibold px-2 py-0.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            {post.rating}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {post.genre?.[0] && (
          <span className="font-inter text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
            {post.genre[0]}
          </span>
        )}

        <Link href={`/posts/${post.slug}`} className="flex-1">
          <h3 className="font-serif font-bold italic text-xl leading-tight text-zinc-900 group-hover:text-[#009DF8] transition-colors line-clamp-3 mb-3">
            {post.title}
          </h3>
        </Link>

        <p className="font-inter text-sm text-zinc-700 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
          <span className="font-inter text-xs uppercase tracking-widest text-zinc-500">
            {new Date(post.date).toLocaleDateString("el-GR")}
          </span>
          <span className="font-inter text-xs uppercase tracking-widest text-zinc-500">
            {post.readingTime} λεπτά
          </span>
        </div>
      </div>

      {isLoggedIn && (
        <div className="absolute top-8 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); setShowEdit(true); }}
            className="p-1.5 bg-zinc-800 text-white hover:bg-[#009DF8]"
            title="Επεξεργασία"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-red-600 text-white hover:bg-red-700"
            title="Διαγραφή"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {showEdit && <EditPostModal post={post} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
