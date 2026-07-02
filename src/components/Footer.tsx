import Link from "next/link";
import { Share2, Rss, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src="/second_logo.svg" alt="Ο Συνήθης Θεατής" className="h-24 w-auto mb-3" />
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
          <p className="font-inter text-sm text-zinc-500 italic">Έρχεται σύντομα...</p>
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
