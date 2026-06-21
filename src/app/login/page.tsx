"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(form.username, form.password);
    if (ok) {
      router.push("/");
    } else {
      setError("Λάθος στοιχεία σύνδεσης.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#009DF8]/10 rounded-full flex items-center justify-center mb-4">
            <Film className="w-7 h-7 text-[#009DF8]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-zinc-800">Σύνδεση</h1>
          <p className="text-sm text-zinc-400 mt-1">Ο Συνήθης Θεατής · Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1">Όνομα χρήστη</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:border-[#009DF8] focus:ring-1 focus:ring-[#009DF8] text-sm"
              placeholder="adminangelos"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1">Κωδικός</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:border-[#009DF8] focus:ring-1 focus:ring-[#009DF8] text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#009DF8] text-white py-2.5 rounded-xl font-semibold hover:bg-[#007fd0] transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? "Σύνδεση..." : "Σύνδεση"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Δεν έχεις λογαριασμό;{" "}
          <a href="/signup" className="text-[#009DF8] hover:underline">Εγγραφή</a>
        </p>
      </div>
    </div>
  );
}
