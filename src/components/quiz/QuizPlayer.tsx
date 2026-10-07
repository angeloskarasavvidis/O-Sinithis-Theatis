"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { QuizQuestion, QuizResult } from "@/lib/quizzes";

interface Props {
  title: string;
  questions: QuizQuestion[];
  results: Record<string, QuizResult>;
  shareUrl: string;
}

// The result with the most answers wins; on a tie, the one answered most recently among the leaders.
function winner(picks: string[]): string {
  const counts: Record<string, number> = {};
  for (const pick of picks) counts[pick] = (counts[pick] ?? 0) + 1;
  const top = Math.max(...Object.values(counts));
  return [...picks].reverse().find((pick) => counts[pick] === top)!;
}

export default function QuizPlayer({ title, questions, results, shareUrl }: Props) {
  const [picks, setPicks] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const step = picks.length;
  const done = step >= questions.length;
  const question = questions[step];
  // the answers are listed in a different order on each question, so the pattern is not obvious
  const answers = question
    ? question.answers.map((_, i) => question.answers[(i + step) % question.answers.length])
    : [];

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const panel = "bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000] p-6 md:p-10";

  if (done) {
    const result = results[winner(picks)];
    return (
      <div className={`${panel} flex flex-col items-start gap-5`} aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black/70">Το αποτέλεσμά σου</p>
        <h2 className="-rotate-1 font-display uppercase font-black text-5xl md:text-7xl leading-none bg-black text-[#FFD60A] px-4 pt-2.5 pb-1.5 text-balance">
          {result.title}
        </h2>
        <p className="text-lg md:text-xl leading-relaxed text-black max-w-xl">{result.text}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <button onClick={() => setPicks([])} className="font-sans text-sm font-semibold uppercase tracking-widest bg-[#FFD60A] text-black border-[3px] border-black press px-6 py-3">
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

  return (
    <div className={panel}>
      <div className="flex items-center gap-4 mb-6">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black/70 tabular-nums whitespace-nowrap">
          Ερώτηση {step + 1} / {questions.length}
        </p>
        <div className="flex flex-1 gap-1" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step}>
          {questions.map((_, i) => (
            <span key={i} className={`h-2.5 flex-1 border-2 border-black ${i < step ? "bg-black" : i === step ? "bg-[#FFD60A]" : "bg-white"}`} />
          ))}
        </div>
      </div>

      <h2 className="font-display uppercase font-black text-4xl md:text-6xl leading-[0.95] text-black text-balance mb-8" aria-live="polite">
        {question.text}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {answers.map((answer) => (
          <button
            key={answer.text}
            onClick={() => setPicks([...picks, answer.result])}
            className="text-left font-sans text-base md:text-lg font-semibold text-black bg-white hover:bg-[#FFD60A] border-[3px] border-black press px-5 py-4"
          >
            {answer.text}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setPicks(picks.slice(0, -1))} className="mt-6 font-sans text-xs font-semibold uppercase tracking-widest text-black underline underline-offset-4 hover:no-underline">
          ← Προηγούμενη ερώτηση
        </button>
      )}
    </div>
  );
}
