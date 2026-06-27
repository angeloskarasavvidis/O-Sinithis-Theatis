import Link from "next/link";
import { Share2, Rss, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif font-black italic text-2xl text-white mb-3">
            Ο Συνήθης <span className="text-[#009DF8]">Θεατής</span>
          </h3>
          <p className="font-inter text-sm leading-relaxed text-zinc-500">
            Κριτικές, αφιερώματα και νέα κινηματογράφου από παθιασμένους θεατές για παθιασμένους θεατές.
          </p>
          <div className="flex gap-4 mt-5">
            {[Share2, Rss, MessageCircle, Mail].map((Icon, i) => (
              <Icon key={i} className="w-4 h-4 hover:text-[#009DF8] cursor-pointer transition-colors" />
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-inter text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Πλοήγηση</h4>
          <ul className="space-y-2">
            {[["Αρχική", "/"], ["Άρθρα", "/posts"], ["Σχετικά", "/about"], ["Σύνδεση", "/login"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="font-inter text-sm font-semibold uppercase tracking-wide text-zinc-400 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-inter text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Είδη</h4>
          <ul className="space-y-2">
            {["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Φαντασία"].map((g) => (
              <li key={g}>
                <Link
                  href={`/posts?genre=${encodeURIComponent(g)}`}
                  className="font-inter text-sm font-semibold uppercase tracking-wide text-zinc-400 hover:text-white transition-colors"
                >
                  {g}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-inter text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Newsletter</h4>
          <p className="font-inter text-sm mb-4 text-zinc-500">Λάβετε τις τελευταίες κριτικές απευθείας στο inbox σας.</p>
          <div className="flex gap-0">
            <input
              type="email"
              placeholder="email@example.com"
              className="flex-1 font-inter text-sm px-3 py-2.5 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-[#009DF8]"
            />
            <button className="font-inter text-xs font-semibold uppercase tracking-widest bg-[#009DF8] text-white px-4 py-2.5 hover:bg-white hover:text-zinc-900 transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-4 text-center">
        <span className="font-inter text-xs uppercase tracking-widest text-zinc-600">
          © {new Date().getFullYear()} Ο Συνήθης Θεατής · Όλα τα δικαιώματα κατοχυρωμένα
        </span>
      </div>
    </footer>
  );
}
