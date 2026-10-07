import type { Metadata } from "next";
import Link from "next/link";
import QuizSign from "@/components/quiz/QuizSign";
import { isPlayable, QUIZZES } from "@/lib/quizzes";

export const metadata: Metadata = {
  title: "Κουίζ",
  description: "Κουίζ για δήθεν και αληθινούς σινεφίλ, από τον Συνήθη Θεατή.",
  alternates: { canonical: "/quiz" },
};

export default function QuizHubPage() {
  return (
    // the quiz section has its own purple ground; -mb-16 closes the gap the footer's margin would leave in blue
    <div className="bg-[#A78BFA] -mb-16 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 flex flex-col gap-8 md:gap-10">
        <h1 className="self-center">
          <QuizSign />
        </h1>
        <p className="text-center text-lg md:text-xl font-semibold text-black max-w-xl mx-auto">
          Διάλεξε παιχνίδι. Οι απαντήσεις δεν βαθμολογούνται, η αξιοπρέπειά σου ναι.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {QUIZZES.map((quiz) => {
            const playable = isPlayable(quiz);
            return (
              <div
                key={quiz.slug}
                className={`relative ${quiz.color} text-black border-[3px] border-black shadow-[6px_6px_0_0_#000] p-6 flex flex-col items-start gap-3 ${playable ? "" : "opacity-90"}`}
              >
                {quiz.isNew && (
                  <span className="absolute -top-3 right-4 rotate-6 bg-black text-white font-sans text-xs font-bold uppercase tracking-widest px-3 py-1 outline-2 outline-offset-2 outline-white">
                    Νέο
                  </span>
                )}
                <h2 className="font-display uppercase font-black text-4xl leading-none text-balance">{quiz.title}</h2>
                <p className="text-black/85">{quiz.blurb}</p>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-black/70">{quiz.meta}</p>
                {playable ? (
                  <Link
                    href={`/quiz/${quiz.slug}`}
                    className="mt-auto font-sans text-sm font-semibold uppercase tracking-widest bg-white text-black border-[3px] border-black press px-5 py-2.5"
                  >
                    Παίξε →
                  </Link>
                ) : (
                  <span className="mt-auto font-sans text-sm font-semibold uppercase tracking-widest text-black/70 border-[3px] border-dashed border-black/60 px-5 py-2.5">
                    Έρχεται
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
