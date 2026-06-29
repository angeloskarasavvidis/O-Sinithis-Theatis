"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Post } from "@/types";
import { usePosts } from "@/context/PostsContext";
import ImageUploader from "@/components/admin/ImageUploader";

const ALL_GENRES = ["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Ιστορική", "Φαντασία", "Ρομαντική", "Εγκληματική", "Φεστιβάλ", "Ειδήσεις"];
const POST_TYPES = ["Κριτική", "Αφιέρωμα", "Νέα", "Συνέντευξη"] as const;
const BADGES = ["NEW REVIEW", "TRENDING", "EDITORIAL", "EXCLUSIVE"] as const;

interface Props {
  onClose: () => void;
}

export default function AddPostModal({ onClose }: Props) {
  const { addPost } = usePosts();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    content: "",
    author: "",
    director: "",
    year: new Date().getFullYear(),
    postType: "Κριτική" as Post["postType"],
    rating: "",
    image: "",
    tags: "",
    badge: "" as Post["badge"] | "",
    featured: false,
    genre: [] as string[],
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function toggleGenre(g: string) {
    setForm((prev) => ({
      ...prev,
      genre: prev.genre.includes(g) ? prev.genre.filter((x) => x !== g) : [...prev.genre, g],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const post: Post = {
      id: Date.now().toString(),
      slug: form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") + "-" + Date.now(),
      title: form.title,
      subtitle: form.subtitle,
      excerpt: form.excerpt,
      content: form.content,
      author: form.author,
      date: new Date().toISOString(),
      readingTime: Math.max(1, Math.ceil(form.content.length / 1000)),
      genre: form.genre,
      director: form.director,
      year: Number(form.year),
      postType: form.postType,
      rating: form.rating ? Number(form.rating) : undefined,
      image: form.image || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80",
      featured: form.featured,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      badge: (form.badge || undefined) as Post["badge"],
    };
    setSaving(true);
    setError("");
    const err = await addPost(post);
    setSaving(false);
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-800">+ Νέα Ανάρτηση</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Τίτλος *">
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={input} />
          </Field>
          <Field label="Υπότιτλος">
            <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={input} />
          </Field>
          <Field label="Σύνοψη *">
            <textarea required value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className={input} />
          </Field>
          <Field label="Περιεχόμενο (HTML) *">
            <textarea required value={form.content} onChange={(e) => set("content", e.target.value)} rows={5} className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Συγγραφέας *">
              <input required value={form.author} onChange={(e) => set("author", e.target.value)} className={input} />
            </Field>
            <Field label="Σκηνοθέτης">
              <input value={form.director} onChange={(e) => set("director", e.target.value)} className={input} />
            </Field>
            <Field label="Έτος">
              <input type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} className={input} />
            </Field>
            <Field label="Βαθμολογία (1-10)">
              <input type="number" step="0.1" min="1" max="10" value={form.rating} onChange={(e) => set("rating", e.target.value)} className={input} />
            </Field>
          </div>

          <Field label="Τύπος Άρθρου">
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => set("postType", t)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.postType === t ? "bg-[#009DF8] text-white border-[#009DF8]" : "border-zinc-300 text-zinc-600 hover:border-[#009DF8]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Είδη">
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((g) => (
                <button key={g} type="button" onClick={() => toggleGenre(g)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.genre.includes(g) ? "bg-[#009DF8] text-white border-[#009DF8]" : "border-zinc-300 text-zinc-600 hover:border-[#009DF8]"}`}>
                  {g}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Badge">
            <div className="flex flex-wrap gap-2">
              {["", ...BADGES].map((b) => (
                <button key={b} type="button" onClick={() => set("badge", b as Post["badge"] | "")}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.badge === b ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-300 text-zinc-600"}`}>
                  {b || "Κανένα"}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Εικόνα">
            <ImageUploader value={form.image} onChange={(url) => set("image", url)} />
          </Field>

          <Field label="Tags (κόμμα)">
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Oscar, Νόλαν, ..." className={input} />
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-[#009DF8]" />
            <span className="text-sm text-zinc-700">Προβολή στο Hero Slider</span>
          </label>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 bg-[#009DF8] text-white py-2.5 rounded-xl font-semibold hover:bg-[#007fd0] transition-colors disabled:opacity-50">
              {saving ? "Αποθήκευση…" : "Δημιουργία"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-zinc-300 rounded-xl text-zinc-700 hover:border-zinc-500 transition-colors">
              Ακύρωση
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const input = "w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-[#009DF8] bg-zinc-50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-600 mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
