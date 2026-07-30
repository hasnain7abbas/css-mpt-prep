# MCQ generation brief — CSS MPT bank

Every question you write will be shown to a real candidate sitting the FPSC
**CSS MCQ-Based Preliminary Test (MPT)** on 27 September 2026. Wrong answers
are worse than no answer at all, so accuracy beats volume every time.

## Exam context

- 200 MCQs, ~200 minutes, **no negative marking**, qualifying score 66/200 (33%).
- Marks do not count toward final CSS merit — it is a pure screening test.
- Official weighting: English 50 · General Science & Ability 60 · Pakistan
  Affairs 20 · Current Affairs 20 · Islamic Studies (or Civics & Ethics) 20 ·
  Urdu 20 · General Knowledge 10.
- Audience: Pakistani graduates. FPSC style is factual, single-clause, and dry.

## Output format

Write ONE file: `content/raw/<subject>/<unit>.json`

```json
{
  "subject": "<subject-slug>",
  "unit": "<unit-name>",
  "questions": [
    {
      "text": "Which article of the 1973 Constitution guarantees freedom of speech?",
      "options": ["Article 17", "Article 19", "Article 25", "Article 27"],
      "correctIndex": 1,
      "explanation": "Article 19 guarantees freedom of speech and expression, subject to reasonable restrictions.",
      "difficulty": "MEDIUM",
      "topic": "constitution"
    }
  ]
}
```

- `correctIndex` is 0-based and must point at the genuinely correct option.
- `difficulty`: `EASY` (recall of a common fact) · `MEDIUM` (standard exam item) ·
  `HARD` (obscure or multi-step).
- `explanation`: one or two sentences saying *why* the answer is right. Never
  restate the option alone.
- `topic`: lowercase slug used for weak-area drills, e.g. `synonyms`,
  `number-series`, `seerah`, `constitution`.

## Hard rules

1. **Exactly four options**, all distinct, all plausible. No "All of the above",
   no "None of the above", no joke distractors.
2. **One defensible answer.** If two options could both be argued correct,
   rewrite the question. An independent checker will re-answer every question
   from scratch; anything they answer differently is thrown away, so ambiguity
   costs you the whole item.
3. **Only facts you are confident are true.** Skip anything shaky rather than
   guess. Never invent statistics, dates, article numbers, or attributions.
4. **Avoid volatile facts** (current office-holders, prices, rankings) unless
   the unit is explicitly Current Affairs — those go stale before the exam.
5. **Vary the answer position.** Roughly a quarter of items on each of A/B/C/D;
   never leave a long run on one letter.
6. **No duplicates or near-duplicates** — not within your file and not obvious
   rewordings of the same fact.
7. Question text is one self-contained sentence or short stem. No numbering
   prefixes, no "Q1.", no markdown.
8. Spread difficulty roughly 30% EASY / 50% MEDIUM / 20% HARD.

## Style

Write the way FPSC writes: plain, unambiguous, no adjectives, no story framing.
"Who was the first Governor-General of Pakistan?" — not "Let's test your
knowledge! Can you name the very first Governor-General of Pakistan?"

Urdu items are written in Urdu script; the stem, options, and explanation stay
in Urdu (the explanation may add a short English gloss where it helps).
