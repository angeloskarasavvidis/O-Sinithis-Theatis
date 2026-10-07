"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await login(form.email, form.password);
    if (err !== null) {
      setError("Λάθος στοιχεία σύνδεσης.");
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-sans">
      <div className="bg-[#F2AA48] border-[3px] border-black shadow-[8px_8px_0_0_#000] p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-black flex items-center justify-center mb-4">
            <Film className="w-7 h-7 text-[#F2AA48]" />
          </div>
          <h1 className="text-4xl font-display uppercase font-black text-black">Σύνδεση</h1>
          <p className="text-sm text-black/60 mt-1">Ο Συνήθης Θεατής · Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wide mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black text-sm"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wide mb-1">Κωδικός</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-black bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs font-semibold text-red-700 bg-white border-2 border-red-700 px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-sans text-sm font-semibold uppercase tracking-widest bg-black text-[#F2AA48] border-[3px] border-black hover:bg-[#F2AA48] hover:text-black py-3 transition-colors disabled:opacity-60"
          >
            {loading ? "Σύνδεση..." : "Σύνδεση"}
          </button>
        </form>
      </div>
    </div>
  );
}
