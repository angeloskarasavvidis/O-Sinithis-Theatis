"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, SlidersHorizontal, X } from "lucide-react";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard";
import AddPostModal from "@/components/admin/AddPostModal";

const PAGE_SIZE = 9;
const SEARCH_DEBOUNCE_MS = 300;

const POST_TYPES = ["Κριτική", "Αφιέρωμα", "Νέα", "Συνέντευξη"];

const HEADINGS: Record<string, string> = {
  Κριτική: "Κριτικές",
  Αφιέρωμα: "Αφιερώματα",
  Νέα: "Νέα",
  Συνέντευξη: "Συνεντεύξεις",
};

type Filters = {
  search: string;
  genre: string;
  director: string;
  year: string;
  postType: string;
  sort: string;
};

// The URL query string is the single source of truth for the filters.
function filtersFromParams(params: URLSearchParams): Filters {
  return {
    search: params.get("search") ?? "",
    genre: params.get("genre") ?? "",
    director: params.get("director") ?? "",
    year: params.get("year") ?? "",
    postType: params.get("postType") ?? "",
    sort: params.get("sort") === "rating" ? "rating" : "date",
  };
}

function filtersToHref(filters: Filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value && !(key === "sort" && value === "date")) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/posts?${query}` : "/posts";
}

function FilterPanel({ filters, update, allGenres, allDirectors, allYears }: {
  filters: Filters;
  update: (key: keyof Filters, value: string) => void;
  allGenres: string[];
  allDirectors: string[];
  allYears: number[];
}) {

  return (
    <div className="space-y-5 text-sm">
      <div>
        <label className="block font-sans font-bold text-black uppercase text-xs tracking-[0.2em] mb-1.5">Αναζήτηση</label>
        <input
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Τίτλος, περιεχόμενο..."
          className="w-full px-3 py-2 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div>
        <label className="block font-sans font-bold text-black uppercase text-xs tracking-[0.2em] mb-1.5">Είδος</label>
        <select value={filters.genre} onChange={(e) => update("genre", e.target.value)}
          className="w-full px-3 py-2 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black">
          <option value="">Όλα</option>
          {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-sans font-bold text-black uppercase text-xs tracking-[0.2em] mb-1.5">Σκηνοθέτης</label>
        <select value={filters.director} onChange={(e) => update("director", e.target.value)}
          className="w-full px-3 py-2 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black">
          <option value="">Όλοι</option>
          {allDirectors.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-sans font-bold text-black uppercase text-xs tracking-[0.2em] mb-1.5">Έτος</label>
        <select value={filters.year} onChange={(e) => update("year", e.target.value)}
          className="w-full px-3 py-2 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black">
          <option value="">Όλα</option>
          {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-sans font-bold text-black uppercase text-xs tracking-[0.2em] mb-1.5">Τύπος</label>
        <select value={filters.postType} onChange={(e) => update("postType", e.target.value)}
          className="w-full px-3 py-2 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black">
          <option value="">Όλοι</option>
          {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-sans font-bold text-black uppercase text-xs tracking-[0.2em] mb-1.5">Ταξινόμηση</label>
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}
          className="w-full px-3 py-2 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black">
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
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const query = searchParams.toString();
  const urlFilters = useMemo(() => filtersFromParams(new URLSearchParams(query)), [query]);

  // The search box filters as you type and is written to the URL after a short pause.
  // `written` is the last search text this page put in the URL, so any other value
  // arriving there (navbar search, back button, a link) is adopted as the new text.
  const [draft, setDraft] = useState(urlFilters.search);
  const [written, setWritten] = useState(urlFilters.search);
  const [seenQuery, setSeenQuery] = useState(query);
  if (seenQuery !== query) {
    setSeenQuery(query);
    setPage(1);
    if (urlFilters.search !== written) {
      setDraft(urlFilters.search);
      setWritten(urlFilters.search);
    }
  }

  useEffect(() => {
    if (draft === written) return;
    const timer = setTimeout(() => {
      setWritten(draft);
      router.replace(filtersToHref({ ...urlFilters, search: draft }), { scroll: false });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, written, urlFilters, router]);

  const filters = useMemo(() => ({ ...urlFilters, search: draft }), [urlFilters, draft]);

  function update(key: keyof Filters, value: string) {
    if (key === "search") {
      setDraft(value);
      setPage(1);
      return;
    }
    setWritten(draft);
    router.push(filtersToHref({ ...filters, [key]: value }), { scroll: false });
  }

  function clearFilter(key: keyof Filters) {
    const next = { ...filters, [key]: "" };
    setDraft(next.search);
    setWritten(next.search);
    router.push(filtersToHref(next), { scroll: false });
  }

  function clearAll() {
    setDraft("");
    setWritten("");
    router.push("/posts", { scroll: false });
  }

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

  const activeFilters = (Object.keys(filters) as (keyof Filters)[])
    .filter((key) => filters[key] && key !== "sort")
    .map((key) => ({ key, value: filters[key] }));

  const heading = HEADINGS[filters.postType] ?? "Όλα τα Άρθρα";

  const panelProps = { filters, update, allGenres, allDirectors, allYears };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h1 className="font-display uppercase font-black text-5xl md:text-6xl bg-black text-[#F2AA48] px-3 pt-1.5 pb-1 leading-none">{heading}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDrawerOpen(true)} className="md:hidden flex items-center gap-1 px-3 py-2 border-[3px] border-black bg-[#F2AA48] text-sm font-semibold text-black press">
            <SlidersHorizontal className="w-4 h-4" /> Φίλτρα
          </button>
          {isLoggedIn && (
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest bg-[#F2AA48] text-black border-[3px] border-black press px-5 py-2.5">
              <Plus className="w-4 h-4" /> Νέα Ανάρτηση
            </button>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(({ key, value }) => (
            <span key={key} className="flex items-center gap-1 font-sans uppercase tracking-widest bg-[#F2AA48] border-2 border-black text-black font-semibold text-xs px-3 py-1">
              {value}
              <button onClick={() => clearFilter(key)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button onClick={clearAll}
            className="text-xs font-semibold text-black hover:text-white underline transition-colors duration-300">Καθαρισμός</button>
        </div>
      )}

      <div className="flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-[#F2AA48] border-[3px] border-black p-5 sticky top-4">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        <div className="flex-1">
          <p className="text-sm text-black/75 mb-4">{filtered.length} αποτελέσματα</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-black/75">Δεν βρέθηκαν αποτελέσματα.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={() => setPage((p) => p + 1)} className="px-8 py-3 font-sans text-sm font-semibold uppercase tracking-widest bg-[#F2AA48] text-black border-[3px] border-black press">
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
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#F2AA48] border-l-[3px] border-black p-6 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-black">Φίλτρα</h2>
              <button onClick={() => setDrawerOpen(false)}><X className="w-5 h-5 text-black" /></button>
            </div>
            <FilterPanel {...panelProps} />
          </div>
        </div>
      )}

      {showModal && <AddPostModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default function PostsBrowser() {
  return (
    <Suspense>
      <PostsContent />
    </Suspense>
  );
}
