"use client";

import Link from "next/link";
import { Search, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/posts?search=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="bg-white border-b border-zinc-200 py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/" className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-zinc-800">
            Ο Συνήθης{" "}
            <span className="text-[#009DF8]">Θεατής</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Κριτικές · Αφιερώματα · Νέα Κινηματογράφου</p>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Αναζήτηση..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-200 rounded-full bg-zinc-50 focus:outline-none focus:border-[#009DF8] focus:ring-1 focus:ring-[#009DF8]"
            />
          </form>

          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3 h-3" />
                Admin
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 px-2 py-1 rounded-full border border-zinc-200 hover:border-zinc-400 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Έξοδος
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
