"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Post } from "@/types";
import { usePosts } from "@/context/PostsContext";
import ImageUploader from "@/components/admin/ImageUploader";
import { RETIRED_SLUGS, slugify, uniqueSlug } from "@/lib/slug";

const ALL_GENRES = ["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Ιστορική", "Φαντασία", "Ρομαντική", "Εγκληματική", "Φεστιβάλ", "Ειδήσεις"];
const POST_TYPES = ["Κριτική", "Αφιέρωμα", "Νέα", "Συνέντευξη"] as const;
const BADGES = ["NEW REVIEW", "TRENDING", "EDITORIAL", "EXCLUSIVE"] as const;

interface Props {
  post: Post;
  onClose: () => void;
}

export default function EditPostModal({ post, onClose }: Props) {
  const { posts, updatePost } = usePosts();
  const otherSlugs = posts.filter((p) => p.id !== post.id).map((p) => p.slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
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
    // the address is kept exactly as it was unless the field was changed
    const slug = form.slug === post.slug ? post.slug : slugify(form.slug);
    if (!slug) { setError("Η διεύθυνση δεν μπορεί να είναι κενή."); return; }
    if (otherSlugs.includes(slug)) { setError("Υπάρχει ήδη άλλη ανάρτηση με αυτή τη διεύθυνση."); return; }
    const updated: Post = {
      ...post,
      slug,
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
    setSaving(true);
    setError("");
    const err = await updatePost(updated);
    setSaving(false);
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
      <div className="bg-[#F2AA48] text-black border-[3px] border-black shadow-[10px_10px_0_0_#000] w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-black">
          <h2 className="font-display uppercase font-black text-4xl leading-none text-[#F2AA48]">Επεξεργασία Ανάρτησης</h2>
          <button onClick={onClose} className="text-[#F2AA48] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Τίτλος *">
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={input} />
          </Field>
          <Field label="Διεύθυνση σελίδας">
            <div className="flex gap-2">
              <input
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                spellCheck={false}
                autoCapitalize="none"
                className={input}
              />
              <button
                type="button"
                onClick={() => set("slug", uniqueSlug(form.title, otherSlugs))}
                className="px-3 py-2 bg-black text-[#F2AA48] text-sm font-semibold border-2 border-black hover:bg-white hover:text-black transition-colors whitespace-nowrap"
              >
                Από τον τίτλο
              </button>
            </div>
            <p className="mt-1 text-xs text-black/70 break-all">
              /posts/{form.slug === post.slug ? post.slug : slugify(form.slug)}
              {form.slug !== post.slug &&
                (post.slug in RETIRED_SLUGS
                  ? " · Ο παλιός σύνδεσμος θα οδηγεί αυτόματα στη νέα διεύθυνση."
                  : " · Οι παλιοί σύνδεσμοι προς αυτή την ανάρτηση θα πάψουν να λειτουργούν.")}
            </p>
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
                  className={`px-3 py-1 text-sm font-semibold border-2 transition-colors ${form.postType === t ? "bg-black text-[#F2AA48] border-black" : "bg-white border-black text-black hover:bg-black hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Είδη">
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((g) => (
                <button key={g} type="button" onClick={() => toggleGenre(g)}
                  className={`px-3 py-1 text-sm font-semibold border-2 transition-colors ${form.genre.includes(g) ? "bg-black text-[#F2AA48] border-black" : "bg-white border-black text-black hover:bg-black hover:text-white"}`}>
                  {g}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Badge">
            <div className="flex flex-wrap gap-2">
              {["", ...BADGES].map((b) => (
                <button key={b} type="button" onClick={() => set("badge", b as Post["badge"] | "")}
                  className={`px-3 py-1 text-sm font-semibold border-2 transition-colors ${form.badge === b ? "bg-black text-[#F2AA48] border-black" : "bg-white border-black text-black hover:bg-black hover:text-white"}`}>
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
              className="w-4 h-4 accent-black" />
            <span className="text-sm font-semibold text-black">Προβολή στο Hero Slider</span>
          </label>

          {error && <p className="text-sm font-semibold text-red-700 bg-white border-2 border-red-700 px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 font-sans text-sm font-semibold uppercase tracking-widest bg-white text-black border-[3px] border-black py-2.5 press disabled:opacity-50">
              {saving ? "Αποθήκευση…" : "Αποθήκευση"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 font-sans text-sm font-semibold uppercase tracking-widest border-[3px] border-black text-black hover:bg-black hover:text-white transition-colors duration-300">
              Ακύρωση
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const input = "w-full px-3 py-2 border-2 border-black text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-black mb-1 uppercase tracking-[0.2em]">{label}</label>
      {children}
    </div>
  );
}
