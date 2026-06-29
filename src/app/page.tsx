"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import HeroSlider from "@/components/HeroSlider";
import PostCard from "@/components/PostCard";
import AddPostModal from "@/components/admin/AddPostModal";

const ALL_GENRES = ["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Ιστορική", "Φαντασία", "Ρομαντική", "Εγκληματική", "Φεστιβάλ"];

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="w-1 h-8 bg-[#009DF8] shrink-0" />
      <h2 className="font-serif font-black italic text-4xl md:text-5xl text-zinc-900 leading-none">
        {label}
      </h2>
      <span className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

export default function HomePage() {
  const { posts } = usePosts();
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const featured = posts.filter((p) => p.featured);
  const topRated = posts.filter((p) => p.rating && p.rating >= 9);
  const editorials = posts.filter((p) => p.postType === "Αφιέρωμα");
  const latest = posts.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      {featured.length > 0 && <HeroSlider posts={featured} />}

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Admin button */}
        {isLoggedIn && (
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 font-inter text-sm font-semibold uppercase tracking-widest bg-zinc-900 text-white px-5 py-2.5 hover:bg-[#009DF8] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Νέα Ανάρτηση
            </button>
          </div>
        )}

        {/* Latest posts */}
        <section className="mb-16">
          <SectionTitle label="Τελευταίες Αναρτήσεις" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        {/* Top rated */}
        {topRated.length > 0 && (
          <section className="mb-16">
            <SectionTitle label="Κορυφαίες Επιλογές" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topRated.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* Genre strip */}
        <section className="mb-16 -mx-4 overflow-hidden relative bg-zinc-900 py-10">
          {/* Typographic watermark */}
          <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none">
            <div className="flex whitespace-nowrap animate-marquee-slow opacity-[0.07]">
              {[...ALL_GENRES, ...ALL_GENRES, ...ALL_GENRES].map((g, i) => (
                <span key={i} className="font-serif font-black italic text-[90px] text-white mx-6">{g}</span>
              ))}
            </div>
          </div>

          <div className="relative z-10 px-8">
            <h2 className="font-serif text-2xl uppercase tracking-widest text-zinc-500 mb-6">Είδη</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((g) => (
                <Link
                  key={g}
                  href={`/posts?genre=${encodeURIComponent(g)}`}
                  className="font-inter text-sm font-semibold uppercase tracking-widest px-5 py-2.5 border border-zinc-700 text-zinc-300 hover:bg-[#009DF8] hover:border-[#009DF8] hover:text-white transition-colors"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Editorials */}
        {editorials.length > 0 && (
          <section className="mb-4">
            <SectionTitle label="Αφιερώματα" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {editorials.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {showModal && <AddPostModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
