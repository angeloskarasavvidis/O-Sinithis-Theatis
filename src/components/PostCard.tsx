"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Star, Trash2 } from "lucide-react";
import { Post } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostsContext";

const postTypeColors: Record<string, string> = {
  Κριτική: "border-blue-400 text-blue-600",
  Αφιέρωμα: "border-amber-400 text-amber-600",
  Νέα: "border-sky-400 text-sky-600",
  Συνέντευξη: "border-indigo-400 text-indigo-600",
};

const badgeColors: Record<string, string> = {
  "NEW REVIEW": "bg-blue-500",
  TRENDING: "bg-rose-500",
  EDITORIAL: "bg-amber-500",
  EXCLUSIVE: "bg-purple-500",
};

export default function PostCard({ post }: { post: Post }) {
  const { isLoggedIn } = useAuth();
  const { removePost } = usePosts();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (confirm(`Διαγραφή: "${post.title}";`)) {
      removePost(post.id);
    }
  }

  return (
    <div className="group bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-[#009DF8]/0 group-hover:bg-[#009DF8]/60 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
              Διαβάστε Περισσότερα
            </span>
          </div>

          {post.badge && (
            <span className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded ${badgeColors[post.badge]}`}>
              {post.badge}
            </span>
          )}

          {post.rating && (
            <span className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400" />
              {post.rating}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold border px-2 py-0.5 rounded ${postTypeColors[post.postType] || "border-zinc-300 text-zinc-500"}`}>
            {post.postType}
          </span>
          {post.genre.slice(0, 1).map((g) => (
            <span key={g} className="text-xs text-zinc-400">{g}</span>
          ))}
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h3 className="font-bold text-zinc-800 hover:text-[#009DF8] transition-colors line-clamp-2 mb-1">
            {post.title}
          </h3>
        </Link>
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{post.excerpt}</p>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.date).toLocaleDateString("el-GR")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} λεπτά
          </span>
        </div>
      </div>

      {isLoggedIn && (
        <button
          onClick={handleDelete}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-full"
          title="Διαγραφή"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
