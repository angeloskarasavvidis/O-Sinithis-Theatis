import { Clock } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-manrope">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-lg p-12 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-zinc-400" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-zinc-800 mb-3">Σύντομα Διαθέσιμο</h1>
        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
          Η εγγραφή νέων χρηστών θα είναι σύντομα διαθέσιμη. Μείνετε συντονισμένοι!
        </p>
        <a href="/login" className="inline-block bg-[#009DF8] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#007fd0] transition-colors">
          Σύνδεση
        </a>
      </div>
    </div>
  );
}
