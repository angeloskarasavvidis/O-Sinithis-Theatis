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

export default function HomePage() {
  const { posts } = usePosts();
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const featured = posts.filter((p) => p.featured);
  const topRated = posts.filter((p) => p.rating && p.rating >= 9);
  const editorials = posts.filter((p) => p.postType === "Αφιέρωμα");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isLoggedIn && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#009DF8] text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#007fd0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Νέα Ανάρτηση
          </button>
        </div>
      )}

      {featured.length > 0 && (
        <section className="mb-12">
          <HeroSlider posts={featured} />
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold text-zinc-800 mb-6 flex items-center gap-3">
          Τελευταίες Αναρτήσεις
          <span className="flex-1 h-px bg-zinc-200" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.slice(0, 8).map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      {topRated.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-zinc-800 mb-6 flex items-center gap-3">
            Κορυφαίες Επιλογές
            <span className="flex-1 h-px bg-zinc-200" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRated.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-bold text-zinc-700 mb-4">Είδη</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_GENRES.map((g) => (
            <Link
              key={g}
              href={`/posts?genre=${encodeURIComponent(g)}`}
              className="px-4 py-1.5 bg-white border border-zinc-200 rounded-full text-sm text-zinc-600 hover:border-[#009DF8] hover:text-[#009DF8] transition-colors"
            >
              {g}
            </Link>
          ))}
        </div>
      </section>

      {editorials.length > 0 && (
        <section className="bg-zinc-100 rounded-2xl p-8 mb-4">
          <h2 className="text-2xl font-serif font-bold text-zinc-800 mb-6">Αφιερώματα</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editorials.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {showModal && <AddPostModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
