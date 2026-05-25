# FIA MCQ Scraper — Instructions for Claude Code

## What to do
Scrape the URLs listed below per subject, parse the MCQs, and append them to `prisma/seed.ts` in the existing format:
```ts
{ order, text, options: [A, B, C, D], correctIndex: 0|1|2|3, explanation, difficulty: "EASY"|"MEDIUM"|"HARD" }
```
- If only 2–3 options exist on a page, infer a 4th plausible wrong option.
- If no explanation is given on the page, write a 1-sentence explanation yourself.
- Assign difficulty: questions with dates/numbers = EASY, conceptual = MEDIUM, obscure = HARD.
- Deduplicate against questions already in seed.ts.
- Target: **200 MCQs per subject** (we already have 50 each, so scrape ~150 more per subject).

---

## Subject 1 — English

| URL | What's there |
|-----|-------------|
| https://gurumcqs.com/english/english-mcqs/ | Synonyms, antonyms, grammar — FIA/FPSC repeated |
| https://mcqsforum.com/verbal-ability/questions-and-answers | FPSC/NTS English verbal MCQs with answers |
| https://onlinetests.youthforpakistan.org/english-synonyms-mcqs/ | Synonym MCQs with answers |
| https://onlinetests.youthforpakistan.org/vocabulary-mcqs/ | Vocabulary MCQs with answers |
| https://cssmpt.com/english-mcqs/ | CSS/FPSC English grammar & vocabulary |

---

## Subject 2 — General Knowledge

| URL | What's there |
|-----|-------------|
| https://examaunty.com/fia-inspector-past-papers-2/ | FIA Inspector Investigation Past Paper (Aug 2023) |
| https://cssmcqs.com/solved-fia-assistant-director-ad-2023-batch-1-past-paper-mcqs/ | FIA AD 2023 Batch 1 solved paper |
| https://gurumcqs.com/general-knowledge/ | GK MCQs repeated in FIA exams |
| https://pakmcqs.com/general-knowledge-mcqs | General knowledge MCQs with answers |
| https://testpointpk.com/important-mcqs/general-knowledge | 1000+ GK MCQs from past papers |

---

## Subject 3 — Pakistan Studies

| URL | What's there |
|-----|-------------|
| https://testpointpk.com/important-mcqs/pak-study | Pak study MCQs from FPSC/FIA past papers |
| https://pakmcqs.com/pakistan-studies-mcqs | Pakistan affairs MCQs with answers |
| https://gurumcqs.com/pak-study/ | Pakistan studies repeated MCQs |
| https://cssmpt.com/pak-study-mcqs/ | CSS/FPSC Pak study MCQs |
| https://mcqsforum.com/pak-study/ | FPSC/PPSC Pak study MCQs |

---

## Subject 4 — Computer

| URL | What's there |
|-----|-------------|
| https://testpointpk.com/important-mcqs/computer | 1000 Computer MCQs from past papers (2026 updated) |
| https://pakmcqs.com/category/computer-mcqs | Basic to advanced computer MCQs |
| https://gotest.com.pk/computer-mcqs-test-online-preparation/ | MS Office, hardware, internet MCQs |
| https://gurumcqs.com/computer/ | Computer MCQs from FIA/FPSC/NTS |
| https://examaunty.com/category/computer-mcqs/ | Computer MCQs with answers |

---

## Subject 5 — Islamic Studies

| URL | What's there |
|-----|-------------|
| https://testpointpk.com/important-mcqs/islamic-studies-mcqs | Islamic Studies MCQs from past papers |
| https://pakmcqs.com/islamiyat-mcqs | Islamiyat MCQs with answers |
| https://gurumcqs.com/islamiat/ | Islamiat MCQs repeated in FIA exams |
| https://cssmpt.com/islamiat-mcqs/ | CSS/FPSC Islamic Studies MCQs |
| https://examaunty.com/category/islamiat-mcqs/ | Islamiat MCQs with answers |

---

## Bonus — FIA Past Papers (Mixed subjects, all useful)

| URL | What's there |
|-----|-------------|
| https://testpointpk.com/past-papers-mcqs/fia-past-papers | Index of ALL FIA past papers 2018–2026 |
| https://examaunty.com/category/fia-past-papers/fia-inspector-past-papers/ | FIA Inspector past papers list |
| https://cssmcqs.com/fia-past-papers-pdf-for-assistant-director-and-its-fpsc-syllabus/ | FIA AD past papers |
| https://www.generalknowledge.online/past-papers/fpsc-past-papers/2105-inspector-fia-fpsc-solved-past-papers-2019-to-2023-download-pdf-for-online-preparation | Inspector FIA 2019–2023 solved papers |
| https://mcqsplanet.com/page/2524/ | FIA AD solved test Aug 2023 |

---

## Scraping Strategy for Claude Code

```
1. Use fetch() or axios to GET each URL.
2. Use cheerio to parse HTML.
3. Look for patterns:
   - Question text: usually in <p>, <li>, <td>, or elements with class containing "question"
   - Options: usually labeled A. B. C. D. or (a)(b)(c)(d)
   - Answer: look for "Ans:", "Answer:", bold text after options, or a class like "correct"
4. For paginated sites (testpointpk, gurumcqs): check for pagination and loop through pages.
5. Rate-limit: add 1-2 second delay between requests to avoid being blocked.
6. Save raw scraped data to /tmp/scraped_[subject].json first, then convert to seed format.
7. Run deduplication by comparing question text (lowercased, trimmed).
```

### Minimal scraper scaffold (Node.js + cheerio)

```ts
// scripts/scrape.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

async function scrapePage(url: string) {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FIAJobPrep/1.0)' }
  });
  const $ = cheerio.load(data);
  const mcqs: any[] = [];

  // Adapt selectors per site — inspect the HTML first
  // Common pattern on Pakistani MCQ sites:
  $('p, li').each((_, el) => {
    const text = $(el).text().trim();
    if (text.match(/^\d+[.)]/)) {
      // likely a question
    }
  });

  return mcqs;
}

// Install: npm i axios cheerio
// Run: npx ts-node scripts/scrape.ts
```

---

## Final target after scraping

| Subject | Current | Target after scrape | Tests (50 Qs each) |
|---------|---------|---------------------|--------------------|
| English | 50 | 250 | 5 tests |
| General Knowledge | 50 | 250 | 5 tests |
| Pakistan Studies | 50 | 250 | 5 tests |
| Computer | 50 | 200 | 4 tests |
| Islamic Studies | 50 | 250 | 5 tests |
| **Total** | **250** | **~1,200** | **~24 tests** |

That's enough to launch. Add more later via the admin CSV importer.
