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
  post: Post;
  onClose: () => void;
}

export default function EditPostModal({ post, onClose }: Props) {
  const { updatePost } = usePosts();
  const [form, setForm] = useState({
    title: post.title,
    subtitle: post.subtitle ?? "",
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    director: post.director ?? "",
    year: post.year,
    postType: post.postType,
    rating: post.rating?.toString() ?? "",
    image: post.image,
    tags: post.tags?.join(", ") ?? "",
    badge: (post.badge ?? "") as Post["badge"] | "",
    featured: post.featured,
    genre: post.genre ?? [],
  });

  function toggleGenre(g: string) {
    setForm((f) => ({
      ...f,
      genre: f.genre.includes(g) ? f.genre.filter((x) => x !== g) : [...f.genre, g],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const updated: Post = {
      ...post,
      title: form.title,
      subtitle: form.subtitle,
      excerpt: form.excerpt,
      content: form.content,
      author: form.author,
      director: form.director,
      year: Number(form.year),
      postType: form.postType,
      rating: form.rating ? Number(form.rating) : undefined,
      image: form.image || post.image,
      featured: form.featured,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      badge: (form.badge || undefined) as Post["badge"],
      genre: form.genre,
      readingTime: Math.max(1, Math.ceil(form.content.length / 1000)),
    };
    await updatePost(updated);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-800">✏️ Επεξεργασία Ανάρτησης</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Τίτλος *">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
          </Field>
          <Field label="Υπότιτλος">
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={input} />
          </Field>
          <Field label="Σύνοψη *">
            <textarea required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className={input} />
          </Field>
          <Field label="Περιεχόμενο (HTML) *">
            <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Συγγραφέας *">
              <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={input} />
            </Field>
            <Field label="Σκηνοθέτης">
              <input value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} className={input} />
            </Field>
            <Field label="Έτος">
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className={input} />
            </Field>
            <Field label="Βαθμολογία (1-10)">
              <input type="number" step="0.1" min="1" max="10" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={input} />
            </Field>
          </div>

          <Field label="Τύπος Άρθρου">
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setForm({ ...form, postType: t })}
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
                <button key={b} type="button" onClick={() => setForm({ ...form, badge: b as Post["badge"] | "" })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.badge === b ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-300 text-zinc-600"}`}>
                  {b || "Κανένα"}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Εικόνα">
            <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </Field>

          <Field label="Tags (κόμμα)">
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Oscar, Νόλαν, ..." className={input} />
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-[#009DF8]" />
            <span className="text-sm text-zinc-700">Προβολή στο Hero Slider</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-[#009DF8] text-white py-2.5 rounded-xl font-semibold hover:bg-[#007fd0] transition-colors">
              Αποθήκευση
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
