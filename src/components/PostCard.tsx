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
  Κριτική: "bg-black text-white",
  Αφιέρωμα: "bg-black text-[#F2AA48]",
  Νέα: "bg-white text-black",
  Συνέντευξη: "bg-[#F2AA48] text-black",
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
    <>
    <div className="group bg-[#F2AA48] text-black overflow-hidden relative flex flex-col border-[3px] border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all duration-300 ease-out">
      <Link href={`/posts/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden border-b-[3px] border-black">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className={`absolute top-0 left-0 font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1.5 ${postTypeColors[post.postType] ?? "bg-zinc-700 text-white"}`}>
          {post.postType}
        </span>
        {post.rating && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black text-[#F2AA48] font-sans text-sm font-semibold px-2 py-0.5">
            <Star className="w-3.5 h-3.5 fill-[#F2AA48]" />
            {post.rating}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {post.genre?.[0] && (
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-black/70 mb-2">
            {post.genre[0]}
          </span>
        )}

        <Link href={`/posts/${post.slug}`} className="flex-1">
          <h3 className="font-display uppercase font-bold text-3xl leading-none text-black group-hover:underline underline-offset-4 decoration-[3px] line-clamp-3 mb-3">
            {post.title}
          </h3>
        </Link>

        <p className="font-sans text-sm text-black/80 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>

        <div className="flex items-center justify-between pt-3 border-t-2 border-black">
          <span className="font-sans text-xs uppercase tracking-widest text-black/70">
            {new Date(post.date).toLocaleDateString("el-GR")}
          </span>
          <span className="font-sans text-xs uppercase tracking-widest text-black/70">
            {post.readingTime} λεπτά
          </span>
        </div>
      </div>

      {isLoggedIn && (
        <div className="absolute top-8 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); setShowEdit(true); }}
            className="p-1.5 bg-black text-white hover:bg-white hover:text-black"
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
    </div>

    {/* Outside the card: its hover translate would otherwise trap the fixed overlay inside it. */}
    {showEdit && <EditPostModal post={post} onClose={() => setShowEdit(false)} />}
    </>
  );
}
