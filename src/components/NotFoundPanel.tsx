import Link from "next/link";

// Shared "nothing here" screen for unknown addresses and missing articles.
export default function NotFoundPanel({
  message = "Η σελίδα που ψάχνεις δεν υπάρχει ή έχει μετακινηθεί.",
}: {
  message?: string;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
      <p className="font-display font-black text-[9rem] md:text-[14rem] leading-[0.8] text-black" aria-hidden="true">
        404
      </p>
      <h1 className="-rotate-2 -mt-4 md:-mt-8 font-display uppercase font-black text-5xl md:text-7xl leading-none bg-black text-[#F2AA48] px-4 pt-2.5 pb-1.5">
        Κόπηκε στο μοντάζ
      </h1>
      <p className="mt-8 text-lg text-black/80 max-w-md">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="font-sans text-sm font-semibold uppercase tracking-widest bg-[#F2AA48] text-black border-[3px] border-black press px-6 py-3"
        >
          Πίσω στην αρχική
        </Link>
        <Link
          href="/posts"
          className="font-sans text-sm font-semibold uppercase tracking-widest bg-white text-black border-[3px] border-black press px-6 py-3"
        >
          Όλα τα άρθρα
        </Link>
      </div>
    </div>
  );
}
