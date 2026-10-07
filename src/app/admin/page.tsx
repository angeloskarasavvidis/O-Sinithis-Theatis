"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import { usePosts } from "@/context/PostsContext";
import { formatDate, formatDateTime } from "@/lib/format";
import { postState, PostState } from "@/lib/postStatus";
import { Post } from "@/types";

const SECTIONS: { state: PostState; title: string; empty: string }[] = [
  { state: "draft", title: "Πρόχειρα", empty: "Δεν υπάρχουν πρόχειρα." },
  { state: "scheduled", title: "Προγραμματισμένα", empty: "Δεν υπάρχει τίποτα προγραμματισμένο." },
  { state: "live", title: "Δημοσιευμένα", empty: "Δεν υπάρχουν δημοσιευμένες αναρτήσεις." },
];

function Row({ post, state }: { post: Post; state: PostState }) {
  return (
    <li className="flex items-center gap-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="font-display uppercase font-bold text-2xl leading-tight text-black truncate">{post.title || "(χωρίς τίτλο)"}</p>
        <p className="font-sans text-xs uppercase tracking-widest text-black/70">
          {post.postType}
          {state === "scheduled" && ` · δημοσιεύεται ${formatDateTime(post.date)}`}
          {state === "live" && ` · ${formatDate(post.date)}`}
        </p>
      </div>
      {state === "live" && (
        <Link href={`/posts/${encodeURIComponent(post.slug)}`} className="font-sans text-xs font-semibold uppercase tracking-widest text-black underline underline-offset-4 hover:text-white">
          Προβολή
        </Link>
      )}
      <Link
        href={`/admin/edit/${post.id}`}
        className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest bg-white text-black border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors duration-300"
      >
        <Pencil className="w-3 h-3" />
        Επεξεργασία
      </Link>
    </li>
  );
}

function AdminHome() {
  const { allPosts, ready } = usePosts();
  // one fixed moment for the whole visit, so a post does not jump between lists while the page is open
  const [now] = useState(() => Date.now());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1 className="font-display uppercase font-black text-5xl md:text-6xl leading-none bg-black text-[#F2AA48] px-3 pt-1.5 pb-1">Διαχείριση</h1>
        <Link href="/admin/new" className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest bg-[#F2AA48] text-black border-[3px] border-black press px-5 py-2.5">
          <Plus className="w-4 h-4" /> Νέα Ανάρτηση
        </Link>
      </div>

      {!ready ? (
        <div className="h-64 bg-black/20 animate-pulse" aria-busy="true" />
      ) : (
        SECTIONS.map(({ state, title, empty }) => {
          const list = allPosts.filter((p) => postState(p, now) === state);
          return (
            <section key={state} className="mb-10 bg-[#F2AA48] border-[3px] border-black p-5 md:p-6">
              <h2 className="font-display uppercase font-black text-3xl leading-none text-black mb-2">
                {title} <span className="text-black/60">({list.length})</span>
              </h2>
              {list.length === 0 ? (
                <p className="text-sm text-black/70 pt-2">{empty}</p>
              ) : (
                <ul className="divide-y-2 divide-black">{list.map((p) => <Row key={p.id} post={p} state={state} />)}</ul>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminHome />
    </AdminGate>
  );
}
