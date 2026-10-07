"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Post } from "@/types";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import HeroSlider from "@/components/HeroSlider";
import AddPostModal from "@/components/admin/AddPostModal";
import RatingStub from "@/components/RatingStub";

const postTypeColors: Record<string, string> = {
  Κριτική: "bg-black text-white",
  Αφιέρωμα: "bg-black text-[#F2AA48]",
  Νέα: "bg-white text-black",
  Συνέντευξη: "bg-[#F2AA48] text-black",
};

const ALL_GENRES = ["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Ιστορική", "Φαντασία", "Ρομαντική", "Εγκληματική", "Φεστιβάλ"];

function SectionTitle({ label, href, linkLabel }: { label: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="font-display uppercase font-black text-5xl md:text-6xl bg-black text-[#F2AA48] px-3 pt-1.5 pb-1 leading-none">
        {label}
      </h2>
      <span className="flex-1 h-[3px] bg-black" />
      {href && (
        <Link
          href={href}
          className="hidden sm:block font-sans text-xs font-semibold uppercase tracking-widest text-black/75 hover:text-white transition-colors duration-300 whitespace-nowrap"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" });
}

function TypeLabel({ post }: { post: Post }) {
  return (
    <span className={`font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1.5 ${postTypeColors[post.postType] ?? "bg-zinc-700 text-white"}`}>
      {post.postType}
    </span>
  );
}

/* Latest: one large lead story next to a compact list */
function LatestPosts({ posts }: { posts: Post[] }) {
  const [lead, ...rest] = posts;
  if (!lead) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Link
        href={`/posts/${lead.slug}`}
        className="group relative block min-h-[380px] md:min-h-[460px] overflow-hidden border-[3px] border-black lg:col-span-2"
      >
        <Image
          src={lead.image}
          alt={lead.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <TypeLabel post={lead} />
            {lead.rating && (
              <RatingStub rating={lead.rating} size="md" />
            )}
          </div>
          <h3 className="font-display uppercase font-black text-4xl md:text-6xl leading-tight text-white group-hover:text-[#F2AA48] transition-colors duration-300 text-balance mb-3">
            {lead.title}
          </h3>
          <p className="font-sans text-zinc-300 leading-relaxed line-clamp-2 max-w-xl mb-4">{lead.excerpt}</p>
          <span className="font-sans text-xs uppercase tracking-widest text-zinc-400">
            {formatDate(lead.date)} · {lead.readingTime} λεπτά
          </span>
        </div>
      </Link>

      <div className="flex flex-col divide-y-[3px] divide-black">
        {rest.map((p) => (
          <Link key={p.id} href={`/posts/${p.slug}`} className="group flex gap-4 py-4 first:pt-0 last:pb-0">
            <div className="relative w-28 sm:w-36 lg:w-28 xl:w-32 aspect-[4/3] shrink-0 overflow-hidden border-[3px] border-black">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="144px"
              />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-black/60 mb-1.5">
                {[p.postType, p.genre?.[0]].filter(Boolean).join(" · ")}
              </span>
              <h3 className="font-display uppercase font-bold text-2xl leading-tight text-black group-hover:text-white transition-colors duration-300 line-clamp-2">
                {p.title}
              </h3>
              <span className="font-sans text-xs uppercase tracking-widest text-black/60 mt-auto pt-2">
                {formatDate(p.date)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* Top picks: numbered ranking, highest rating first */
function TopRatedList({ posts }: { posts: Post[] }) {
  return (
    <ol className="border-t-[3px] border-black">
      {posts.map((p, i) => (
        <li key={p.id} className="border-b-[3px] border-black">
          <Link href={`/posts/${p.slug}`} className="group flex items-center gap-4 md:gap-8 py-5 md:py-6">
            <span className="font-display uppercase font-black text-6xl md:text-8xl leading-none text-black w-10 md:w-20 shrink-0 text-center">
              {i + 1}
            </span>
            <div className="relative w-24 md:w-48 aspect-[16/10] shrink-0 overflow-hidden border-[3px] border-black">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 96px, 192px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-sans text-[11px] md:text-xs uppercase tracking-[0.2em] text-black/60">
                {[p.director, p.year].filter(Boolean).join(" · ")}
              </span>
              <h3 className="font-display uppercase font-bold text-2xl md:text-4xl leading-tight text-black group-hover:underline underline-offset-4 decoration-[3px] line-clamp-2 mt-1">
                {p.title}
              </h3>
              <p className="hidden md:block font-sans text-sm text-black/75 line-clamp-1 mt-2">{p.subtitle || p.excerpt}</p>
            </div>
            <span className="shrink-0 flex items-baseline gap-1 font-display font-black text-4xl md:text-6xl text-black">
              {p.rating}
              <span className="font-sans font-semibold text-xs md:text-sm text-black/60">/10</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/* Features: wide image-led tiles */
function EditorialTiles({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((p, i) => {
        const wide = i === 0 && posts.length % 2 === 1;
        return (
          <Link
            key={p.id}
            href={`/posts/${p.slug}`}
            className={`group relative block overflow-hidden border-[3px] border-black aspect-[16/10] ${wide ? "md:col-span-2 md:aspect-[21/8]" : ""}`}
          >
            <Image
              src={p.image}
              alt={p.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#F2AA48]">
                {[p.director, p.year].filter(Boolean).join(" · ")}
              </span>
              <h3 className={`font-display uppercase font-black leading-tight text-white text-balance mt-2 ${wide ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"}`}>
                {p.title}
              </h3>
              {p.subtitle && <p className="font-sans text-sm md:text-base text-zinc-300 line-clamp-1 mt-2">{p.subtitle}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { posts, loading } = usePosts();
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const featured = posts.slice(0, 4);
  const topRated = posts
    .filter((p) => p.rating && p.rating >= 9)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);
  const editorials = posts.filter((p) => p.postType === "Αφιέρωμα").slice(0, 5);
  const latest = posts.slice(0, 5);

  return (
    <div>
      {/* Hero */}
      {loading
        ? <div className="h-[480px] md:h-[580px] bg-black/20 animate-pulse" />
        : featured.length > 0 && <HeroSlider posts={featured} />
      }

      <div className="max-w-7xl mx-auto px-4 pt-12">

        {/* Admin button */}
        {isLoggedIn && (
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest bg-[#F2AA48] text-black border-[3px] border-black press px-5 py-2.5"
            >
              <Plus className="w-4 h-4" />
              Νέα Ανάρτηση
            </button>
          </div>
        )}

        {/* Latest posts */}
        <section className="mb-16">
          <SectionTitle label="Τελευταίες Αναρτήσεις" href="/posts" linkLabel="Όλα τα άρθρα" />
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="min-h-[380px] md:min-h-[460px] bg-black/20 animate-pulse lg:col-span-2" />
              <div className="hidden lg:block bg-black/20 animate-pulse" />
            </div>
          ) : (
            <LatestPosts posts={latest} />
          )}
        </section>

      </div>

      {/* Top rated: full-width orange band */}
      {!loading && topRated.length > 0 && (
        <section className="bg-[#F2AA48] border-y-[3px] border-black py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <SectionTitle label="Κορυφαίες Επιλογές" />
            <TopRatedList posts={topRated} />
          </div>
        </section>
      )}

      {/* Genre strip */}
      <section className="overflow-hidden relative bg-black py-10 md:py-12">
        {/* Typographic watermark */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none">
          <div className="flex whitespace-nowrap animate-marquee-slow opacity-[0.07]">
            {[...ALL_GENRES, ...ALL_GENRES, ...ALL_GENRES].map((g, i) => (
              <span key={i} className="font-display uppercase font-black text-[90px] text-white mx-6">{g}</span>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h2 className="font-display font-bold text-3xl uppercase tracking-widest text-[#F2AA48] mb-6">Είδη</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map((g) => (
              <Link
                key={g}
                href={`/posts?genre=${encodeURIComponent(g)}`}
                className="font-sans text-sm font-semibold uppercase tracking-widest px-5 py-2.5 border-2 border-[#F2AA48] text-[#F2AA48] hover:bg-[#F2AA48] hover:text-black transition-colors duration-300"
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">

        {/* Editorials */}
        {!loading && editorials.length > 0 && (
          <section className="mb-4">
            <SectionTitle label="Αφιερώματα" />
            <EditorialTiles posts={editorials} />
          </section>
        )}
      </div>

      {showModal && <AddPostModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
