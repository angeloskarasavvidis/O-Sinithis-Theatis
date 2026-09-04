"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Αρχική", img: "/arxiki_rebrand.png" },
  { href: "/posts", label: "Άρθρα", img: "/arthra_rebrand.png" },
  { href: "/posts?postType=Κριτική", label: "Κριτικές", img: "/kritikes_rebrand.png" },
  { href: "/posts?postType=Αφιέρωμα", label: "Αφιερώματα", img: "/afieromata_rebrand.png" },
  { href: "/about", label: "Σχετικά", img: "/sxetika_rebrand.png" },
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
    <nav className="bg-[#009DF8] text-white sticky top-0 z-50 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 h-24">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img src="/main_logo_rebrand.png" alt="Ο Συνήθης Θεατής" className="h-16 md:h-20 w-auto" />
          </Link>

          {/* Divider */}
          <span className="hidden md:block w-px h-6 bg-white/30 shrink-0" />

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0 flex-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-6 transition-opacity border-b-4 hover:opacity-80 ${
                  pathname === l.href ? "border-black" : "border-transparent opacity-90"
                }`}
              >
                <img src={l.img} alt={l.label} className="h-8" />
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
                  className="bg-white/10 text-white placeholder-white/60 text-sm px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-black w-44"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-white/80 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
            )}

            {isLoggedIn && (
              <>
                <span className="hidden md:flex items-center gap-1 font-pixel text-[8px] text-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-1 font-pixel text-[8px] text-white/70 hover:text-white transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  Έξοδος
                </button>
              </>
            )}

            <button
              className="md:hidden p-1 text-white/80 hover:text-white"
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
        <div className="md:hidden border-t border-black/20">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex px-4 py-3 border-l-4 transition-colors ${
                pathname === l.href
                  ? "border-black bg-black/10"
                  : "border-transparent hover:bg-black/10"
              }`}
            >
              <img src={l.img} alt={l.label} className="h-7" />
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
