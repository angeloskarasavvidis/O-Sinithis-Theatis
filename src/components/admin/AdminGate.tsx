"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Shows its children only to a logged-in admin. This hides the tools; the database rules are what protect the data.
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, ready } = useAuth();

  if (!ready) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><div className="h-96 bg-black/20 animate-pulse" aria-busy="true" /></div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="inline-block font-display uppercase font-black text-5xl leading-none bg-black text-[#F2AA48] px-3 pt-1.5 pb-1 mb-6">
          Μόνο για διαχειριστές
        </h1>
        <p className="text-black/80 mb-8">Συνδέσου για να γράψεις ή να επεξεργαστείς μια ανάρτηση.</p>
        <Link
          href="/login"
          className="inline-block font-sans text-sm font-semibold uppercase tracking-widest bg-[#F2AA48] text-black border-[3px] border-black press px-6 py-3"
        >
          Σύνδεση
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
