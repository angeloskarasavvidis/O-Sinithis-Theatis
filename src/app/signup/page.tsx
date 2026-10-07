import { Clock } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-sans">
      <div className="bg-[#F2AA48] border-[3px] border-black shadow-[8px_8px_0_0_#000] p-12 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-[#F2AA48]" />
        </div>
        <h1 className="text-4xl font-display uppercase font-black text-black mb-3">Σύντομα Διαθέσιμο</h1>
        <p className="text-black/80 text-sm leading-relaxed mb-6">
          Η εγγραφή νέων χρηστών θα είναι σύντομα διαθέσιμη. Μείνετε συντονισμένοι!
        </p>
        <a href="/login" className="inline-block font-sans text-sm font-semibold uppercase tracking-widest bg-white text-black border-[3px] border-black press px-6 py-3">
          Σύνδεση
        </a>
      </div>
    </div>
  );
}
