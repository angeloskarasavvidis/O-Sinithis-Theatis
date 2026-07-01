"use client";

import { use, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Star, Trash2, Pencil, User, Film, Tag } from "lucide-react";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard";
import EditPostModal from "@/components/admin/EditPostModal";

const postTypeColors: Record<string, string> = {
  Κριτική: "bg-blue-100 text-blue-700",
  Αφιέρωμα: "bg-amber-100 text-amber-700",
  Νέα: "bg-sky-100 text-sky-700",
  Συνέντευξη: "bg-indigo-100 text-indigo-700",
};

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { posts, removePost } = usePosts();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);

  const post = posts.find((p) => p.slug === slug);

  const safeContent = useMemo(() => {
    if (typeof window === "undefined") return post?.content ?? "";
    return DOMPurify.sanitize(post?.content ?? "");
  }, [post?.content]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-800 mb-4">Το άρθρο δεν βρέθηκε</h1>
        <Link href="/posts" className="text-[#009DF8] hover:underline">← Επιστροφή στα άρθρα</Link>
      </div>
    );
  }

  const related = posts.filter((p) => p.id !== post.id && p.genre.some((g) => post.genre.includes(g))).slice(0, 3);

  function handleDelete() {
    if (confirm(`Διαγραφή: "${post!.title}";`)) {
      removePost(post!.id);
      router.push("/posts");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-manrope font-medium">
      <div className="flex items-center justify-between mb-6">
        <Link href="/posts" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-[#009DF8] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Επιστροφή
        </Link>
        {isLoggedIn && (
          <div className="flex gap-2">
            <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 border border-zinc-200 hover:border-zinc-400 px-3 py-1.5 rounded-lg transition-colors">
              <Pencil className="w-4 h-4" />
              Επεξεργασία
            </button>
            <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
              Διαγραφή
            </button>
          </div>
        )}
      </div>

      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 800px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${postTypeColors[post.postType] || "bg-zinc-100 text-zinc-600"}`}>
        {post.postType}
      </span>

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-800 mb-2">{post.title}</h1>
      <p className="text-lg text-zinc-500 mb-6">{post.subtitle}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-8 pb-8 border-b border-zinc-200">
        <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>
        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}</span>
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readingTime} λεπτά ανάγνωση</span>
        {post.rating && (
          <span className="flex items-center gap-1 text-yellow-600 font-semibold"><Star className="w-4 h-4 fill-yellow-500" />{post.rating}/10</span>
        )}
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-8 flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide flex items-center gap-1 mb-1"><Film className="w-3 h-3" />Σκηνοθέτης</span>
          <span className="font-medium text-zinc-800">{post.director}</span>
        </div>
        <div>
          <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide mb-1 block">Έτος</span>
          <span className="font-medium text-zinc-800">{post.year}</span>
        </div>
        <div>
          <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide mb-1 block">Είδος</span>
          <span className="font-medium text-zinc-800">{post.genre.join(", ")}</span>
        </div>
        <div>
          <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide mb-1 block">Τύπος</span>
          <span className="font-medium text-zinc-800">{post.postType}</span>
        </div>
      </div>

      <div
        className="prose prose-zinc max-w-none mb-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#009DF8] [&_blockquote]:pl-4 [&_blockquote]:text-zinc-500 [&_blockquote]:italic [&_strong]:text-zinc-900 [&_em]:text-zinc-700 [&_p]:leading-relaxed [&_p]:mb-4 text-zinc-700"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12 pt-6 border-t border-zinc-200">
          <Tag className="w-4 h-4 text-zinc-400 mt-0.5" />
          {post.tags.map((t) => (
            <Link key={t} href={`/posts?search=${encodeURIComponent(t)}`}
              className="text-xs px-3 py-1 border border-zinc-200 rounded-full text-zinc-600 hover:border-[#009DF8] hover:text-[#009DF8] transition-colors">
              {t}
            </Link>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-serif font-bold text-zinc-800 mb-6">Σχετικά Άρθρα</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
      {showEdit && <EditPostModal post={post} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
