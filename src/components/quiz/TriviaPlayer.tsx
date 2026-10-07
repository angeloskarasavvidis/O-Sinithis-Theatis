"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, X } from "lucide-react";
import { QuizQuestion, QuizTier } from "@/lib/quizzes";

interface Props {
  title: string;
  prompt?: string;
  questions: QuizQuestion[];
  /** verdicts by minimum score, in any order */
  tiers: QuizTier[];
  shareUrl: string;
}

// A quiz with right and wrong answers: each pick is revealed before moving on, and the score picks the verdict.
export default function TriviaPlayer({ title, prompt, questions, tiers, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const done = step >= questions.length;
  const question = questions[step];
  // the answers are listed in a different order on each question, so the right one moves around
  const answers = question
    ? question.answers.map((_, i) => question.answers[(i + step) % question.answers.length])
    : [];

  function pick(text: string, correct: boolean) {
    if (picked !== null) return;
    setPicked(text);
    if (correct) setScore(score + 1);
  }

  function next() {
    setPicked(null);
    setStep(step + 1);
  }

  function restart() {
    setStep(0);
    setScore(0);
    setPicked(null);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const panel = "bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000] p-6 md:p-10";

  if (done) {
    const tier = [...tiers].sort((a, b) => b.min - a.min).find((t) => score >= t.min);
    return (
      <div className={`${panel} flex flex-col items-start gap-5`} aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black/70">Το σκορ σου</p>
        <p className="font-display font-black text-8xl md:text-9xl leading-[0.8] text-black tabular-nums">
          {score}
          <span className="text-5xl md:text-6xl text-black/50"> / {questions.length}</span>
        </p>
        {tier && (
          <>
            <h2 className="-rotate-1 font-display uppercase font-black text-4xl md:text-6xl leading-none bg-black text-[#34D399] px-4 pt-2.5 pb-1.5 text-balance">
              {tier.title}
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-black max-w-xl">{tier.text}</p>
          </>
        )}
        <div className="flex flex-wrap gap-4 pt-2">
          <button onClick={restart} className="font-sans text-sm font-semibold uppercase tracking-widest bg-[#34D399] text-black border-[3px] border-black press px-6 py-3">
            Παίξε ξανά
          </button>
          <button onClick={copyLink} className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest bg-white text-black border-[3px] border-black press px-6 py-3">
            {copied ? <><Check className="w-4 h-4" />Αντιγράφηκε</> : <><Copy className="w-4 h-4" />Στείλ&apos; το σε φίλο</>}
          </button>
          <Link href="/quiz" className="font-sans text-sm font-semibold uppercase tracking-widest bg-white text-black border-[3px] border-black press px-6 py-3">
            Όλα τα κουίζ
          </Link>
        </div>
      </div>
    );
  }

  const answered = picked !== null;
  const wasRight = answered && !!question.answers.find((a) => a.text === picked)?.correct;

  return (
    <div className={panel}>
      <div className="flex items-center gap-4 mb-6">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black/70 tabular-nums whitespace-nowrap">
          Ερώτηση {step + 1} / {questions.length}
        </p>
        <div className="flex flex-1 gap-1" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step}>
          {questions.map((_, i) => (
            <span key={i} className={`h-2.5 flex-1 border-2 border-black ${i < step ? "bg-black" : i === step ? "bg-[#34D399]" : "bg-white"}`} />
          ))}
        </div>
        <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black tabular-nums whitespace-nowrap">Σκορ {score}</p>
      </div>

      {prompt && <p className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-black/70 mb-3">{prompt}</p>}
      <h2 className="font-display font-black text-4xl md:text-6xl leading-[0.95] text-black text-balance mb-8">{question.text}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {answers.map((answer) => {
          const isPicked = picked === answer.text;
          // once answered: the right answer turns green, a wrong pick turns red, the rest fade
          const state = !answered
            ? "bg-white hover:bg-[#34D399] press"
            : answer.correct
              ? "bg-[#34D399]"
              : isPicked
                ? "bg-[#EF4444]"
                : "bg-white opacity-50";
          return (
            <button
              key={answer.text}
              onClick={() => pick(answer.text, !!answer.correct)}
              disabled={answered}
              className={`flex items-center justify-between gap-3 text-left font-sans text-base md:text-lg font-semibold text-black border-[3px] border-black px-5 py-4 ${state}`}
            >
              {answer.text}
              {answered && answer.correct && <Check className="w-5 h-5 shrink-0" aria-label="σωστό" />}
              {answered && isPicked && !answer.correct && <X className="w-5 h-5 shrink-0" aria-label="λάθος" />}
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-12 flex flex-wrap items-center justify-between gap-4" aria-live="polite">
        {answered && (
          <>
            <p className="font-display uppercase font-black text-3xl leading-none text-black">{wasRight ? "Σωστά!" : "Λάθος."}</p>
            <button onClick={next} autoFocus className="font-sans text-sm font-semibold uppercase tracking-widest bg-black text-white border-[3px] border-black px-6 py-3 hover:bg-[#34D399] hover:text-black transition-colors duration-200">
              {step + 1 < questions.length ? "Επόμενη →" : "Δες το σκορ →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
