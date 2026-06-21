import Link from "next/link";
import { Share2, Rss, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-100 text-zinc-500 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-zinc-800 font-serif font-bold text-lg mb-2">
            Ο Συνήθης <span className="text-[#009DF8]">Θεατής</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Κριτικές, αφιερώματα και νέα κινηματογράφου από παθιασμένους θεατές για παθιασμένους θεατές.
          </p>
          <div className="flex gap-3 mt-4">
            <Share2 className="w-5 h-5 hover:text-[#009DF8] cursor-pointer transition-colors" />
            <Rss className="w-5 h-5 hover:text-[#009DF8] cursor-pointer transition-colors" />
            <MessageCircle className="w-5 h-5 hover:text-[#009DF8] cursor-pointer transition-colors" />
            <Mail className="w-5 h-5 hover:text-[#009DF8] cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="text-zinc-700 font-semibold mb-3 text-sm uppercase tracking-wide">Πλοήγηση</h4>
          <ul className="space-y-2 text-sm">
            {[["Αρχική", "/"], ["Άρθρα", "/posts"], ["Σχετικά", "/about"], ["Σύνδεση", "/login"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-[#009DF8] transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-700 font-semibold mb-3 text-sm uppercase tracking-wide">Είδη</h4>
          <ul className="space-y-2 text-sm">
            {["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Φαντασία"].map((g) => (
              <li key={g}>
                <Link href={`/posts?genre=${encodeURIComponent(g)}`} className="hover:text-[#009DF8] transition-colors">
                  {g}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-700 font-semibold mb-3 text-sm uppercase tracking-wide">Newsletter</h4>
          <p className="text-sm mb-3">Λάβετε τις τελευταίες κριτικές απευθείας στο inbox σας.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="email@example.com"
              className="flex-1 text-sm px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-[#009DF8]"
            />
            <button className="bg-[#009DF8] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#007fd0] transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Ο Συνήθης Θεατής · Όλα τα δικαιώματα κατοχυρωμένα
      </div>
    </footer>
  );
}
