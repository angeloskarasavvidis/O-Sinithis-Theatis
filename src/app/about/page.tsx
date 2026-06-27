export default function AboutPage() {
  const stats = [
    { label: "Κριτικές", value: "10+" },
    { label: "Σκηνοθέτες", value: "80+" },
    { label: "Χρόνια Online", value: "< 1" },
  ];

  const team = [
    { name: "Αγγελος Καρασαββίδης", role: "Ιδρυτής & Αρχισυντάκτης", bio: "Δήθεν σινεφίλ με ειδίκευση στο να το παίζει ψαγμένος." },
 ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-zinc-800 mb-4">
          Σχετικά με τον <span className="text-[#009DF8]">Συνήθη Θεατή</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          Μια σελίδα για όσους θέλουν να έρθουν πιο κοντά στο σινεμά.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-zinc-200 rounded-xl p-5 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#009DF8] mb-1">{s.value}</div>
            <div className="text-sm text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold text-zinc-800 mb-6">Η Ομάδα μας</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#009DF8]/10 flex items-center justify-center text-2xl font-bold text-[#009DF8] mb-4">
                {m.name[0]}
              </div>
              <h3 className="font-bold text-zinc-800 mb-1">{m.name}</h3>
              <p className="text-xs text-[#009DF8] font-semibold mb-3">{m.role}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#009DF8]/5 border border-[#009DF8]/20 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-zinc-800 mb-3">Επικοινωνία</h2>
        <p className="text-zinc-500 mb-4">Θέλεις να συνεργαστείς μαζί μας ή να μοιραστείς τις απόψεις σου;</p>
        <a href="mailto:osinithistheatis@gmail.com" className="inline-block bg-[#009DF8] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#007fd0] transition-colors">
          Επικοινωνήστε μαζί μας
        </a>
      </section>
    </div>
  );
}
