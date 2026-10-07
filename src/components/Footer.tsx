import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-zinc-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src="/main_logo_rebrand.png" alt="Ο Συνήθης Θεατής" className="h-16 w-auto mb-4" />
          <p className="font-sans text-sm leading-relaxed text-zinc-400">
            Κριτικές, αφιερώματα και νέα κινηματογράφου από παθιασμένους θεατές για παθιασμένους θεατές.
          </p>
        </div>

        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#F2AA48] mb-4">Πλοήγηση</h4>
          <ul className="space-y-2">
            {[["Αρχική", "/"], ["Άρθρα", "/posts"], ["Σχετικά", "/about"], ["Σύνδεση", "/login"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="font-sans text-sm font-semibold uppercase tracking-wide text-zinc-200 hover:text-[#F2AA48] transition-colors duration-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#F2AA48] mb-4">Είδη</h4>
          <ul className="space-y-2">
            {["Δράμα", "Θρίλερ", "Επιστημονική Φαντασία", "Κωμωδία", "Βιογραφία", "Φαντασία"].map((g) => (
              <li key={g}>
                <Link
                  href={`/posts?genre=${encodeURIComponent(g)}`}
                  className="font-sans text-sm font-semibold uppercase tracking-wide text-zinc-200 hover:text-[#F2AA48] transition-colors duration-300"
                >
                  {g}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#F2AA48] mb-4">Επικοινωνία</h4>
          <a
            href="mailto:osinithistheatis@gmail.com"
            className="inline-flex items-center gap-2 font-sans text-sm text-zinc-200 hover:text-[#F2AA48] transition-colors duration-300 break-all"
          >
            <Mail className="w-4 h-4 shrink-0" />
            osinithistheatis@gmail.com
          </a>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-4 text-center">
        <span className="font-sans text-xs uppercase tracking-widest text-zinc-500">
          © {new Date().getFullYear()} Ο Συνήθης Θεατής · Όλα τα δικαιώματα κατοχυρωμένα
        </span>
      </div>
    </footer>
  );
}
