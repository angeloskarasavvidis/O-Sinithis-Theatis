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
  Κριτική: "bg-white text-black",
  Αφιέρωμα: "bg-[#F2AA48] text-black",
  Νέα: "bg-white text-black",
  Συνέντευξη: "bg-[#F2AA48] text-black",
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
        <h1 className="text-2xl font-bold text-black mb-4">Το άρθρο δεν βρέθηκε</h1>
        <Link href="/posts" className="text-black font-semibold underline hover:text-white">← Επιστροφή στα άρθρα</Link>
      </div>
    );
  }

  const related = posts.filter((p) => p.id !== post.id && p.genre.some((g) => post.genre.includes(g))).slice(0, 3);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

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
    <div className="font-sans">

      {/* Hero: split layout */}
      <div className={`grid md:grid-cols-[2fr_3fr] border-b-[3px] border-black`}>

        {/* Left panel */}
        <div className="bg-black text-white p-8 md:p-14 flex flex-col justify-between min-h-[420px] md:min-h-[560px]">
          <div>
            <Link href="/posts" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Επιστροφή
            </Link>
            <span className={`inline-block font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1.5 mb-6 ${postTypeColors[post.postType] || "bg-zinc-800 text-zinc-200"}`}>
              {post.postType}
            </span>
            <h1 className="text-5xl lg:text-7xl font-display uppercase font-black leading-[0.95] mb-5">{post.title}</h1>
            {post.subtitle && <p className="text-zinc-400 text-lg leading-relaxed">{post.subtitle}</p>}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-[#F2AA48] flex items-center justify-center text-black font-bold text-base shrink-0">
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
                <span className="flex items-center gap-1 text-[#F2AA48] font-semibold text-sm">
                  <Star className="w-4 h-4 fill-[#F2AA48]" />{post.rating}/10
                </span>
              )}
              {isLoggedIn && (
                <>
                  <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-400 px-3 py-1.5 transition-colors duration-300">
                    <Pencil className="w-3 h-3" />Επεξεργασία
                  </button>
                  <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-400 px-3 py-1.5 transition-colors duration-300">
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
                  className="text-xs font-semibold text-zinc-400 hover:text-[#1877F2] border border-zinc-700 hover:border-[#1877F2] px-3 py-1.5 transition-colors duration-300"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-400 px-3 py-1.5 transition-colors duration-300"
                >
                  X / Twitter
                </a>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#F2AA48] border border-zinc-700 hover:border-[#F2AA48] px-3 py-1.5 transition-colors duration-300"
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
      <div className="max-w-2xl mx-auto px-4 pt-10 md:pt-14 pb-12">

        {/* Metadata strip */}
        {(post.director || post.year || post.genre.length > 0 || post.postType) && (
          <div className="border-y-[3px] border-black py-5 mb-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            {post.director && (
              <div>
                <span className="font-sans text-black/70 uppercase text-xs font-bold tracking-[0.2em] flex items-center gap-1 mb-1"><Film className="w-3 h-3" />Σκηνοθέτης</span>
                <span className="font-semibold text-black">{post.director}</span>
              </div>
            )}
            {post.year && (
              <div>
                <span className="font-sans text-black/70 uppercase text-xs font-bold tracking-[0.2em] mb-1 block">Έτος</span>
                <span className="font-semibold text-black">{post.year}</span>
              </div>
            )}
            {post.genre.length > 0 && (
              <div>
                <span className="font-sans text-black/70 uppercase text-xs font-bold tracking-[0.2em] mb-1 block">Είδος</span>
                <span className="font-semibold text-black">{post.genre.join(", ")}</span>
              </div>
            )}
            {post.postType && (
              <div>
                <span className="font-sans text-black/70 uppercase text-xs font-bold tracking-[0.2em] mb-1 block">Τύπος</span>
                <span className="font-semibold text-black">{post.postType}</span>
              </div>
            )}
          </div>
        )}

        {/* Article content */}
        <div
          className="mb-10 text-lg leading-[1.8] text-black [&_p]:mb-6 [&>p:first-of-type]:text-xl [&>p:first-of-type]:md:text-2xl [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:text-black [&_strong]:text-black [&_b]:text-black [&_em]:text-black [&_a]:text-black [&_a]:underline [&_a]:font-semibold [&_a]:underline-offset-4 [&_h2]:font-display [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-4xl [&_h2]:leading-tight [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:font-bold [&_h3]:uppercase [&_h3]:text-3xl [&_h3]:text-black [&_h3]:mt-10 [&_h3]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:pl-5 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-2xl [&_blockquote]:leading-snug [&_blockquote]:text-black [&_img]:w-full [&_img]:my-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-6 border-t-[3px] border-black">
            <Tag className="w-4 h-4 text-black mt-1" />
            {post.tags.map((t) => (
              <Link key={t} href={`/posts?search=${encodeURIComponent(t)}`}
                className="font-sans text-xs uppercase tracking-widest px-3 py-1 border-2 border-black font-semibold text-black hover:bg-black hover:text-[#F2AA48] transition-colors duration-300">
                {t}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display uppercase font-black text-4xl md:text-5xl bg-black text-[#F2AA48] px-3 pt-1.5 pb-1 leading-none">Σχετικά Άρθρα</h2>
            <span className="flex-1 h-[3px] bg-black" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      {showEdit && <EditPostModal post={post} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
