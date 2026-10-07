"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Menu, X, Search, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const links = [
  { href: "/", path: "/", label: "Αρχική", img: "/arxiki_rebrand.png" },
  { href: "/posts", path: "/posts", label: "Άρθρα", img: "/arthra_rebrand.png" },
  { href: "/posts?postType=Κριτική", path: "/posts", postType: "Κριτική", label: "Κριτικές", img: "/kritikes_rebrand.png" },
  { href: "/posts?postType=Αφιέρωμα", path: "/posts", postType: "Αφιέρωμα", label: "Αφιερώματα", img: "/afieromata_rebrand.png" },
  { href: "/about", path: "/about", label: "Σχετικά", img: "/sxetika_rebrand.png" },
];

const linkedPostTypes = links.flatMap((l) => (l.postType ? [l.postType] : []));

// Reading the query string needs a Suspense boundary; until it resolves the bar
// renders without a post-type highlight.
export default function Navbar() {
  return (
    <Suspense fallback={<NavbarBar postType={null} />}>
      <NavbarWithQuery />
    </Suspense>
  );
}

function NavbarWithQuery() {
  const searchParams = useSearchParams();
  return <NavbarBar postType={searchParams.get("postType")} />;
}

function NavbarBar({ postType }: { postType: string | null }) {
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

  // "Άρθρα" is active on /posts unless one of the post-type links is
  function isActive(l: (typeof links)[number]) {
    if (pathname !== l.path) return false;
    if (l.path !== "/posts") return true;
    return l.postType ? l.postType === postType : !linkedPostTypes.includes(postType ?? "");
  }

  // while the mobile drawer is open: lock page scroll and close on Escape
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

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
    <>
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
                  isActive(l) ? "border-[#F2AA48]" : "border-transparent opacity-90"
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
              onClick={() => setOpen(true)}
              aria-label="Άνοιγμα μενού"
              aria-expanded={open}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile menu: a drawer sliding in from the right. It sits outside <nav>, whose
        translate would otherwise become the containing block for fixed children. */}
    <div
      className={`md:hidden fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Μενού"
        className={`absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-black text-white border-l-4 border-[#F2AA48] flex flex-col overflow-y-auto transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 shrink-0">
          <span className="font-display uppercase font-black text-3xl leading-none text-[#F2AA48]">Μενού</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Κλείσιμο μενού"
            className="p-1 text-white hover:text-[#F2AA48] transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col py-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex px-4 py-4 border-l-4 transition-colors ${
                isActive(l)
                  ? "border-[#F2AA48] bg-white/10"
                  : "border-transparent hover:bg-white/10"
              }`}
            >
              <img src={l.img} alt={l.label} className="h-8 w-auto" />
            </Link>
          ))}
        </div>

        {isLoggedIn && (
          <div className="mt-auto flex items-center justify-between gap-3 px-4 py-4 border-t border-white/20">
            <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              Admin
            </span>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-white hover:text-[#F2AA48] transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              Έξοδος
            </button>
          </div>
        )}
      </aside>
    </div>
    </>
  );
}
