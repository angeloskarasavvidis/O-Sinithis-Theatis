"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, SlidersHorizontal, X } from "lucide-react";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard";
import AddPostModal from "@/components/admin/AddPostModal";

const PAGE_SIZE = 9;

type Filters = {
  search: string;
  genre: string;
  director: string;
  year: string;
  postType: string;
  sort: string;
};

function FilterPanel({ filters, setFilters, setPage, allGenres, allDirectors, allYears }: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  allGenres: string[];
  allDirectors: string[];
  allYears: number[];
}) {
  function update(key: keyof Filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    if (key !== "sort") setPage(1);
  }

  return (
    <div className="space-y-5 text-sm">
      <div>
        <label className="block font-semibold text-zinc-600 uppercase text-xs tracking-wide mb-1.5">Αναζήτηση</label>
        <input
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Τίτλος, περιεχόμενο..."
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-[#009DF8]"
        />
      </div>
      <div>
        <label className="block font-semibold text-zinc-600 uppercase text-xs tracking-wide mb-1.5">Είδος</label>
        <select value={filters.genre} onChange={(e) => update("genre", e.target.value)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-[#009DF8]">
          <option value="">Όλα</option>
          {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold text-zinc-600 uppercase text-xs tracking-wide mb-1.5">Σκηνοθέτης</label>
        <select value={filters.director} onChange={(e) => update("director", e.target.value)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-[#009DF8]">
          <option value="">Όλοι</option>
          {allDirectors.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold text-zinc-600 uppercase text-xs tracking-wide mb-1.5">Έτος</label>
        <select value={filters.year} onChange={(e) => update("year", e.target.value)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-[#009DF8]">
          <option value="">Όλα</option>
          {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold text-zinc-600 uppercase text-xs tracking-wide mb-1.5">Τύπος</label>
        <select value={filters.postType} onChange={(e) => update("postType", e.target.value)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-[#009DF8]">
          <option value="">Όλοι</option>
          {["Κριτική", "Αφιέρωμα", "Νέα", "Συνέντευξη"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold text-zinc-600 uppercase text-xs tracking-wide mb-1.5">Ταξινόμηση</label>
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-[#009DF8]">
          <option value="date">Ημερομηνία</option>
          <option value="rating">Βαθμολογία</option>
        </select>
      </div>
    </div>
  );
}

function PostsContent() {
  const { posts } = usePosts();
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    genre: searchParams.get("genre") || "",
    director: "",
    year: "",
    postType: "",
    sort: "date",
  });

  const allGenres = useMemo(() => [...new Set(posts.flatMap((p) => p.genre))].sort(), [posts]);
  const allDirectors = useMemo(() => [...new Set(posts.map((p) => p.director))].sort(), [posts]);
  const allYears = useMemo(() => [...new Set(posts.map((p) => p.year))].sort((a, b) => b - a), [posts]);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (filters.search) result = result.filter((p) => p.title.toLowerCase().includes(filters.search.toLowerCase()) || p.excerpt.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.genre) result = result.filter((p) => p.genre.includes(filters.genre));
    if (filters.director) result = result.filter((p) => p.director === filters.director);
    if (filters.year) result = result.filter((p) => p.year === Number(filters.year));
    if (filters.postType) result = result.filter((p) => p.postType === filters.postType);
    if (filters.sort === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return result;
  }, [posts, filters]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const activeFilters = Object.entries(filters)
    .filter(([k, v]) => v && k !== "sort")
    .map(([k, v]) => ({ key: k, value: v }));

  function clearFilter(key: string) {
    setFilters((f) => ({ ...f, [key]: "" }));
    setPage(1);
  }

  const panelProps = { filters, setFilters, setPage, allGenres, allDirectors, allYears };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-manrope">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold text-zinc-800">Όλα τα Άρθρα</h1>
        <div className="flex gap-2">
          <button onClick={() => setDrawerOpen(true)} className="md:hidden flex items-center gap-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-600">
            <SlidersHorizontal className="w-4 h-4" /> Φίλτρα
          </button>
          {isLoggedIn && (
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#009DF8] text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#007fd0] transition-colors">
              <Plus className="w-4 h-4" /> Νέα Ανάρτηση
            </button>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(({ key, value }) => (
            <span key={key} className="flex items-center gap-1 bg-[#009DF8]/10 text-[#009DF8] text-xs px-3 py-1 rounded-full">
              {value}
              <button onClick={() => clearFilter(key)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button onClick={() => setFilters({ search: "", genre: "", director: "", year: "", postType: "", sort: "date" })}
            className="text-xs text-zinc-400 hover:text-zinc-700 underline">Καθαρισμός</button>
        </div>
      )}

      <div className="flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sticky top-4">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        <div className="flex-1">
          <p className="text-sm text-zinc-400 mb-4">{filtered.length} αποτελέσματα</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">Δεν βρέθηκαν αποτελέσματα.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={() => setPage((p) => p + 1)} className="px-8 py-3 bg-[#009DF8] text-white rounded-full font-semibold hover:bg-[#007fd0] transition-colors">
                    Φόρτωση Περισσότερων
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-zinc-800">Φίλτρα</h2>
              <button onClick={() => setDrawerOpen(false)}><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <FilterPanel {...panelProps} />
          </div>
        </div>
      )}

      {showModal && <AddPostModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense>
      <PostsContent />
    </Suspense>
  );
}
