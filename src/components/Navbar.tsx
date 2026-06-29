"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Αρχική" },
  { href: "/posts", label: "Άρθρα" },
  { href: "/posts?postType=Κριτική", label: "Κριτικές" },
  { href: "/posts?postType=Αφιέρωμα", label: "Αφιερώματα" },
  { href: "/about", label: "Σχετικά" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/posts?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <nav className="bg-zinc-900 text-white sticky top-0 z-50 border-b-4 border-[#009DF8]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 h-24">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-pixel text-[14px] md:text-[17px] text-white leading-tight tracking-tight">
              Ο ΣΥΝΗΘΗΣ <span className="text-[#009DF8]">ΘΕΑΤΗΣ</span>
            </span>
          </Link>

          {/* Divider */}
          <span className="hidden md:block w-px h-6 bg-zinc-700 shrink-0" />

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0 flex-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`font-pixel text-[11px] px-4 py-6 transition-colors border-b-4 hover:text-[#009DF8] ${
                  pathname === l.href
                    ? "text-[#009DF8] border-[#009DF8]"
                    : "text-zinc-300 border-transparent"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: search + auth */}
          <div className="flex items-center gap-3 ml-auto">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Αναζήτηση..."
                  className="bg-zinc-800 text-white placeholder-zinc-500 text-sm px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#009DF8] w-44"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-zinc-400 hover:text-[#009DF8] transition-colors">
                <Search className="w-4 h-4" />
              </button>
            )}

            {isLoggedIn ? (
              <>
                <span className="hidden md:flex items-center gap-1 font-pixel text-[8px] text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-1 font-pixel text-[8px] text-zinc-500 hover:text-white transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  Έξοδος
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden md:block font-pixel text-[11px] text-zinc-400 hover:text-white transition-colors"
              >
                Σύνδεση
              </Link>
            )}

            <button
              className="md:hidden p-1 text-zinc-400 hover:text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-4 font-pixel text-[9px] border-l-4 transition-colors ${
                pathname === l.href
                  ? "text-[#009DF8] border-[#009DF8] bg-zinc-800"
                  : "text-zinc-300 border-transparent hover:text-white hover:bg-zinc-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-condensed text-sm font-semibold uppercase tracking-widest text-zinc-500 border-l-4 border-transparent"
            >
              Σύνδεση
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
