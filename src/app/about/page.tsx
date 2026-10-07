export default function AboutPage() {
  const team = [
    { name: "Άγγελος Καρασαββίδης", role: "Ιδρυτής & Αρχισυντάκτης", bio: "Δήθεν σινεφίλ με ειδίκευση στο να το παίζει ψαγμένος." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 font-sans">
      <div className="text-center mb-14">
        <h1 className="text-5xl md:text-6xl font-display uppercase font-black text-black text-balance mb-4">
          Σχετικά με τον <span className="text-white">Συνήθη Θεατή</span>
        </h1>
        <p className="text-lg text-black/80 max-w-2xl mx-auto leading-relaxed">
          Μια σελίδα για όσους θέλουν να έρθουν πιο κοντά στο σινεμά.
        </p>
      </div>

      <section className="mb-14">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-display uppercase font-black text-4xl md:text-5xl bg-black text-[#F2AA48] px-3 pt-1.5 pb-1 leading-none">Η Ομάδα μας</h2>
          <span className="flex-1 h-[3px] bg-black" />
        </div>
        <ul className="divide-y-[3px] divide-black">
          {team.map((m) => (
            <li key={m.name} className="flex items-center gap-5 md:gap-8 py-8">
              <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-black flex items-center justify-center font-display uppercase font-black text-6xl md:text-8xl text-[#F2AA48]">
                {m.name[0]}
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-black font-bold mb-2">{m.role}</p>
                <h3 className="font-display uppercase font-black text-3xl md:text-4xl text-black leading-tight mb-2">{m.name}</h3>
                <p className="text-black/80 leading-relaxed">{m.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#F2AA48] border-[3px] border-black p-8 md:p-10 text-center">
        <h2 className="font-display uppercase font-black text-4xl text-black mb-3">Επικοινωνία</h2>
        <p className="text-black/80 mb-6">Θέλεις να συνεργαστείς μαζί μας ή να μοιραστείς τις απόψεις σου;</p>
        <a href="mailto:osinithistheatis@gmail.com" className="inline-block font-sans text-sm font-semibold uppercase tracking-widest bg-black text-[#F2AA48] border-[3px] border-black hover:bg-[#F2AA48] hover:text-black px-6 py-3 transition-colors duration-300">
          Επικοινωνήστε μαζί μας
        </a>
      </section>
    </div>
  );
}
