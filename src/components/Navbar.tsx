"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 80 || delta < 0) {
        setVisible(true);
      } else if (delta > 0) {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // keep navbar visible while mobile menu or search is open
  const shown = visible || open || searchOpen;

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/posts?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <nav
      className={`bg-black text-white sticky top-0 z-50 transition-transform duration-300 ${
        shown ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 lg:gap-6 h-16 md:h-20 xl:h-24">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img src="/main_logo_rebrand.png" alt="Ο Συνήθης Θεατής" className="h-11 md:h-14 lg:h-16 xl:h-20 w-auto" />
          </Link>

          {/* Divider */}
          <span className="hidden md:block w-1 h-8 bg-[#F2AA48] shrink-0" />

          {/* Nav links */}
          <div className="hidden md:flex items-stretch gap-0 flex-1 h-full">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center px-2 lg:px-3 transition-opacity border-b-4 hover:opacity-80 ${
                  pathname === l.href ? "border-[#F2AA48]" : "border-transparent opacity-90"
                }`}
              >
                <img src={l.img} alt={l.label} className="h-6 lg:h-7 xl:h-9 w-auto" />
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
                  className="bg-white/10 text-white placeholder-white/60 text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#F2AA48] w-44"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-[#F2AA48] hover:text-white transition-colors duration-300">
                <Search className="w-6 h-6" strokeWidth={3} />
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
                  className="hidden md:flex items-center gap-1 font-pixel text-[8px] text-white/70 hover:text-white transition-colors duration-300"
                >
                  <LogOut className="w-3 h-3" />
                  Έξοδος
                </button>
              </>
            )}

            <button
              className="md:hidden p-1 text-white hover:text-[#F2AA48] transition-colors duration-300"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/20">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex px-4 py-3 border-l-4 transition-colors ${
                pathname === l.href
                  ? "border-[#F2AA48] bg-white/10"
                  : "border-transparent hover:bg-white/10"
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
