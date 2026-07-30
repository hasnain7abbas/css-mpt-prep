"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LETTERS, OptionRow, isUrdu, type OptionState } from "@/components/app/OptionRow";

type Sample = {
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// One item from each of three sections — the paper as a candidate actually
// meets it, including an Urdu item set in Nastaliq.
const SAMPLES: Sample[] = [
  {
    subject: "General Science & Ability",
    text: "A bag bought for Rs. 800 is sold for Rs. 1,000. What is the profit percentage?",
    options: ["20%", "25%", "12.5%", "40%"],
    correctIndex: 1,
    explanation: "Profit = 1,000 − 800 = 200. Percentage = (200 ÷ 800) × 100 = 25%.",
  },
  {
    subject: "English",
    text: "Choose the correct synonym of 'INTRANSIGENT'.",
    options: ["Flexible", "Uncompromising", "Temporary", "Generous"],
    correctIndex: 1,
    explanation:
      "'Intransigent' describes someone unwilling to change their position — uncompromising.",
  },
  {
    subject: "Urdu",
    text: "”آب آب کرتے مر گئے، سرہانے دھرا رہا پانی“ — اس مصرعے میں کون سی صنعت استعمال ہوئی ہے؟",
    options: ["صنعتِ تضاد", "صنعتِ تلمیح", "صنعتِ ایہام", "صنعتِ مراعاۃ النظیر"],
    correctIndex: 0,
    explanation:
      "مصرعے میں پیاس اور پانی کی موجودگی کا تضاد بیان ہوا ہے، اس لیے یہاں صنعتِ تضاد پائی جاتی ہے۔",
  },
];

export function SampleQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sample = SAMPLES[index];

  function stateFor(i: number): OptionState {
    if (!submitted) return selected === i ? "chosen" : "idle";
    if (i === sample.correctIndex) return selected === i ? "correct" : "missed";
    if (selected === i) return "wrong";
    return "idle";
  }

  function next() {
    setIndex((i) => (i + 1) % SAMPLES.length);
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <div className="border border-ink/20 bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          {sample.subject}
        </span>
        <span className="font-mono text-[11px] text-ink-soft tabular-nums">
          {index + 1} / {SAMPLES.length}
        </span>
      </div>

      <div className="px-5 py-5">
        <p
          className={isUrdu(sample.text) ? "urdu text-ink" : "text-[17px] leading-relaxed text-ink"}
          {...(isUrdu(sample.text) ? { lang: "ur", dir: "rtl" } : {})}
        >
          {sample.text}
        </p>

        <div className="mt-4 border-t border-border">
          {sample.options.map((opt, i) => (
            <OptionRow
              key={i}
              letter={LETTERS[i]}
              text={opt}
              state={stateFor(i)}
              disabled={submitted}
              urdu={isUrdu(opt)}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>

        {submitted ? (
          <div className="mt-5 border-l-2 border-primary bg-primary/[0.06] px-4 py-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
              {selected === sample.correctIndex ? "Correct" : "Not quite"}
            </p>
            <p
              className={
                isUrdu(sample.explanation)
                  ? "urdu mt-1 text-ink-muted"
                  : "mt-1 text-sm leading-relaxed text-ink-muted"
              }
              {...(isUrdu(sample.explanation) ? { lang: "ur", dir: "rtl" } : {})}
            >
              {sample.explanation}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {submitted ? (
            <Button onClick={next} variant="outline">
              <RotateCcw /> Next sample
            </Button>
          ) : (
            <Button onClick={() => setSubmitted(true)} disabled={selected === null}>
              Check answer
            </Button>
          )}
          <span className="text-xs text-ink-soft">
            No negative marking — a guess costs nothing.
          </span>
        </div>
      </div>
    </div>
  );
}
