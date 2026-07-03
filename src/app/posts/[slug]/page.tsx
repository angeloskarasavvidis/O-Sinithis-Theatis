"use client";

import { use, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Trash2, Pencil, Film, Tag, Copy, Check } from "lucide-react";
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

const postTypeAccent: Record<string, string> = {
  Κριτική: "border-blue-500",
  Αφιέρωμα: "border-amber-500",
  Νέα: "border-sky-500",
  Συνέντευξη: "border-indigo-500",
};

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { posts, removePost } = usePosts();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const accentBorder = postTypeAccent[post.postType] || "border-[#009DF8]";

  function handleDelete() {
    if (confirm(`Διαγραφή: "${post!.title}";`)) {
      removePost(post!.id);
      router.push("/posts");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="font-manrope">

      {/* Hero: split layout */}
      <div className={`grid md:grid-cols-[2fr_3fr] border-t-4 ${accentBorder}`}>

        {/* Left panel */}
        <div className="bg-zinc-900 text-white p-8 md:p-14 flex flex-col justify-between min-h-[420px] md:min-h-[560px]">
          <div>
            <Link href="/posts" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Επιστροφή
            </Link>
            <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6 ${postTypeColors[post.postType] || "bg-zinc-100 text-zinc-600"}`}>
              {post.postType}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-5">{post.title}</h1>
            {post.subtitle && <p className="text-zinc-400 text-lg leading-relaxed">{post.subtitle}</p>}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#009DF8]/20 flex items-center justify-center text-[#009DF8] font-bold text-base shrink-0">
                {post.author?.[0] ?? "Α"}
              </div>
              <div>
                <div className="font-semibold text-base">{post.author}</div>
                <div className="text-zinc-400 text-sm flex items-center gap-2">
                  <span>{new Date(post.date).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span>·</span>
                  <span>{post.readingTime} λεπτά ανάγνωση</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-6">
              {post.rating && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
                  <Star className="w-4 h-4 fill-yellow-400" />{post.rating}/10
                </span>
              )}
              {isLoggedIn && (
                <>
                  <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-400 px-3 py-1.5 rounded-lg transition-colors">
                    <Pencil className="w-3 h-3" />Επεξεργασία
                  </button>
                  <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 className="w-3 h-3" />Διαγραφή
                  </button>
                </>
              )}
            </div>

            {/* Social sharing */}
            <div className="border-t border-zinc-700 pt-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 block mb-3">Κοινοποίηση</span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-400 hover:text-[#1877F2] border border-zinc-700 hover:border-[#1877F2] px-3 py-1.5 rounded-lg transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  X / Twitter
                </a>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#009DF8] border border-zinc-700 hover:border-[#009DF8] px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? <><Check className="w-3 h-3" />Αντιγράφηκε!</> : <><Copy className="w-3 h-3" />Αντιγραφή</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: image */}
        <div className="relative h-64 md:h-auto min-h-[300px]">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Metadata box */}
        {(post.director || post.year || post.genre.length > 0 || post.postType) && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-8 flex flex-wrap gap-6 text-sm">
            {post.director && (
              <div>
                <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide flex items-center gap-1 mb-1"><Film className="w-3 h-3" />Σκηνοθέτης</span>
                <span className="font-medium text-zinc-800">{post.director}</span>
              </div>
            )}
            {post.year && (
              <div>
                <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide mb-1 block">Έτος</span>
                <span className="font-medium text-zinc-800">{post.year}</span>
              </div>
            )}
            {post.genre.length > 0 && (
              <div>
                <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide mb-1 block">Είδος</span>
                <span className="font-medium text-zinc-800">{post.genre.join(", ")}</span>
              </div>
            )}
            {post.postType && (
              <div>
                <span className="text-zinc-400 uppercase text-xs font-semibold tracking-wide mb-1 block">Τύπος</span>
                <span className="font-medium text-zinc-800">{post.postType}</span>
              </div>
            )}
          </div>
        )}

        {/* Article content */}
        <div
          className="prose prose-lg prose-zinc max-w-none mb-8 prose-drop-cap [&_blockquote]:border-l-4 [&_blockquote]:border-[#009DF8] [&_blockquote]:pl-4 [&_blockquote]:text-zinc-500 [&_blockquote]:italic [&_strong]:text-zinc-900 [&_em]:text-zinc-700 [&_p]:leading-relaxed [&_p]:mb-4 text-zinc-700"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        {/* Tags */}
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

        {/* Related posts */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold text-zinc-800 mb-6">Σχετικά Άρθρα</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </div>

      {showEdit && <EditPostModal post={post} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
