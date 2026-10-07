"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { usePosts } from "@/context/PostsContext";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { RETIRED_SLUGS, slugify, uniqueSlug } from "@/lib/slug";

const ALL_GENRES = ["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Ιστορική", "Φαντασία", "Ρομαντική", "Εγκληματική", "Φεστιβάλ", "Ειδήσεις"];
const POST_TYPES = ["Κριτική", "Αφιέρωμα", "Νέα", "Συνέντευξη"] as const;
const BADGES = ["NEW REVIEW", "TRENDING", "EDITORIAL", "EXCLUSIVE"] as const;
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80";

// The full-page form for writing a new post (no `post`) or editing an existing one.
export default function PostEditor({ post }: { post?: Post }) {
  const { posts, addPost, updatePost } = usePosts();
  const router = useRouter();
  const otherSlugs = posts.filter((p) => p.id !== post?.id).map((p) => p.slug);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    subtitle: post?.subtitle ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    author: post?.author ?? "",
    director: post?.director ?? "",
    year: post?.year ?? new Date().getFullYear(),
    postType: post?.postType ?? ("Κριτική" as Post["postType"]),
    rating: post?.rating?.toString() ?? "",
    image: post?.image ?? "",
    tags: post?.tags?.join(", ") ?? "",
    badge: (post?.badge ?? "") as Post["badge"] | "",
    featured: post?.featured ?? false,
    genre: post?.genre ?? [],
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  function toggleGenre(g: string) {
    set("genre", form.genre.includes(g) ? form.genre.filter((x) => x !== g) : [...form.genre, g]);
  }

  // warn before closing or reloading the tab with unsaved writing
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // a new post takes its address from the title; an existing one keeps its address unless the field is changed
  const slug = !post
    ? uniqueSlug(form.title, otherSlugs)
    : form.slug === post.slug
      ? post.slug
      : slugify(form.slug);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content) { setError("Το κείμενο του άρθρου είναι κενό."); return; }
    if (!slug) { setError("Η διεύθυνση δεν μπορεί να είναι κενή."); return; }
    if (otherSlugs.includes(slug)) { setError("Υπάρχει ήδη άλλη ανάρτηση με αυτή τη διεύθυνση."); return; }

    const fields = {
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
      featured: form.featured,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      badge: (form.badge || undefined) as Post["badge"],
      genre: form.genre,
      readingTime: Math.max(1, Math.ceil(form.content.length / 1000)),
    };

    setSaving(true);
    setError("");
    const err = post
      ? await updatePost({ ...post, ...fields, image: form.image || post.image })
      : await addPost({ ...fields, id: Date.now().toString(), date: new Date().toISOString(), image: form.image || DEFAULT_IMAGE });
    setSaving(false);
    if (err) { setError(err); return; }
    setDirty(false);
    router.push(`/posts/${encodeURIComponent(slug)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-8 items-start">
      <div className="min-w-0 space-y-6">
        <h1 className="inline-block font-display uppercase font-black text-5xl md:text-6xl leading-none bg-black text-[#F2AA48] px-3 pt-1.5 pb-1">
          {post ? "Επεξεργασία ανάρτησης" : "Νέα ανάρτηση"}
        </h1>

        <Field label="Τίτλος *">
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full px-4 py-3 border-[3px] border-black bg-white text-black font-display font-black uppercase text-4xl md:text-5xl leading-none focus:outline-none"
          />
        </Field>
        <Field label="Υπότιτλος">
          <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={`${input} text-lg py-3`} />
        </Field>

        <div>
          <p className={labelClass}>Κείμενο *</p>
          <RichTextEditor initialHtml={post?.content ?? ""} onChange={(html) => set("content", html)} />
        </div>
      </div>

      <aside className="bg-[#F2AA48] border-[3px] border-black p-5 space-y-4 lg:sticky lg:top-28">
        <Field label="Σύνοψη *">
          <textarea required value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} className={input} />
        </Field>

        <Field label="Τύπος άρθρου">
          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => set("postType", t)} className={chip(form.postType === t)}>{t}</button>
            ))}
          </div>
        </Field>

        <Field label="Είδη">
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map((g) => (
              <button key={g} type="button" onClick={() => toggleGenre(g)} className={chip(form.genre.includes(g))}>{g}</button>
            ))}
          </div>
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

        <Field label="Εικόνα">
          <ImageUploader value={form.image} onChange={(url) => set("image", url)} />
        </Field>

        <Field label="Tags (κόμμα)">
          <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Oscar, Νόλαν, ..." className={input} />
        </Field>

        <Field label="Badge">
          <div className="flex flex-wrap gap-2">
            {["", ...BADGES].map((b) => (
              <button key={b} type="button" onClick={() => set("badge", b as Post["badge"] | "")} className={chip(form.badge === b)}>
                {b || "Κανένα"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Διεύθυνση σελίδας">
          {post && (
            <div className="flex gap-2 mb-1">
              <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} spellCheck={false} autoCapitalize="none" className={input} />
              <button
                type="button"
                onClick={() => set("slug", uniqueSlug(form.title, otherSlugs))}
                className="px-3 py-2 bg-black text-[#F2AA48] text-sm font-semibold border-2 border-black hover:bg-white hover:text-black transition-colors whitespace-nowrap"
              >
                Από τον τίτλο
              </button>
            </div>
          )}
          <p className="text-xs text-black/70 break-all">
            /posts/{form.title || post ? slug : "…"}
            {post && form.slug !== post.slug &&
              (post.slug in RETIRED_SLUGS
                ? " · Ο παλιός σύνδεσμος θα οδηγεί αυτόματα στη νέα διεύθυνση."
                : " · Οι παλιοί σύνδεσμοι προς αυτή την ανάρτηση θα πάψουν να λειτουργούν.")}
          </p>
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-black" />
          <span className="text-sm font-semibold text-black">Προβολή στο Hero Slider</span>
        </label>

        {error && <p className="text-sm font-semibold text-red-700 bg-white border-2 border-red-700 px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 font-sans text-sm font-semibold uppercase tracking-widest bg-white text-black border-[3px] border-black py-2.5 press disabled:opacity-50">
            {saving ? "Αποθήκευση…" : post ? "Αποθήκευση" : "Δημοσίευση"}
          </button>
          <Link
            href={post ? `/posts/${encodeURIComponent(post.slug)}` : "/posts"}
            className="px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-widest border-[3px] border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            Ακύρωση
          </Link>
        </div>
      </aside>
    </form>
  );
}

const input = "w-full px-3 py-2 border-2 border-black text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black bg-white";
const labelClass = "block text-xs font-bold text-black mb-1 uppercase tracking-[0.2em]";

function chip(selected: boolean) {
  return `px-3 py-1 text-sm font-semibold border-2 transition-colors ${
    selected ? "bg-black text-[#F2AA48] border-black" : "bg-white border-black text-black hover:bg-black hover:text-white"
  }`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}
