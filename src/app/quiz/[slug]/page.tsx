import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import TriviaPlayer from "@/components/quiz/TriviaPlayer";
import QuizSign from "@/components/quiz/QuizSign";
import { isPlayable, QUIZZES } from "@/lib/quizzes";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return QUIZZES.filter(isPlayable).map((quiz) => ({ slug: quiz.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const quiz = QUIZZES.find((q) => q.slug === slug);
  if (!quiz || !isPlayable(quiz)) return { title: "Το κουίζ δεν βρέθηκε" };
  return {
    title: `${quiz.title} · Κουίζ`,
    description: quiz.blurb,
    alternates: { canonical: `/quiz/${quiz.slug}` },
  };
}

export default async function QuizPage({ params }: Props) {
  const { slug } = await params;
  const quiz = QUIZZES.find((q) => q.slug === slug);
  if (!quiz || !isPlayable(quiz)) notFound();

  return (
    <div className="bg-[#A78BFA] -mb-16 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6 md:gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/quiz" aria-label="Όλα τα κουίζ">
            <QuizSign small />
          </Link>
          <h1 className="-rotate-1 font-display uppercase font-black text-3xl md:text-4xl leading-none bg-black text-white px-3 pt-1.5 pb-1">
            {quiz.title}
          </h1>
        </div>
        {quiz.kind === "trivia" ? (
          <TriviaPlayer title={quiz.title} prompt={quiz.prompt} questions={quiz.questions} tiers={quiz.tiers ?? []} shareUrl={`${SITE_URL}/quiz/${quiz.slug}`} />
        ) : (
          <QuizPlayer title={quiz.title} questions={quiz.questions} results={quiz.results ?? {}} shareUrl={`${SITE_URL}/quiz/${quiz.slug}`} />
        )}
      </div>
    </div>
  );
}
