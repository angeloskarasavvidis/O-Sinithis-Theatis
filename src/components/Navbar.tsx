"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Αρχική" },
  { href: "/posts", label: "Άρθρα" },
  { href: "/about", label: "Σχετικά" },
  { href: "/login", label: "Σύνδεση" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#009DF8] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="hidden md:flex gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${
                  pathname === l.href
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <span className="text-xs opacity-60 hidden md:block">
            Ο Κόσμος του Κινηματογράφου
          </span>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/20 py-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm font-medium hover:bg-white/10 ${
                pathname === l.href ? "border-l-4 border-white pl-3" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
