/**
 * FIA Job Prep — Prisma Seed File
 * 250 MCQs across 5 subjects (50 each), sourced from FIA/FPSC past papers 2018–2024.
 * Each question has 4 options, a correctIndex (0-based), difficulty, and explanation.
 *
 * Run: npx prisma db seed
 * Add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
 */

import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// SUBJECT DEFINITIONS
// ─────────────────────────────────────────────

const subjects = [
  {
    slug: "english",
    title: "English",
    description: "Grammar, Vocabulary, Synonyms, Antonyms, Sentence Correction",
    order: 1,
  },
  {
    slug: "general-knowledge",
    title: "General Knowledge",
    description: "World Facts, Current Affairs, Everyday Science, Capitals",
    order: 2,
  },
  {
    slug: "pakistan-studies",
    title: "Pakistan Studies",
    description: "History, Geography, Politics, Constitution of Pakistan",
    order: 3,
  },
  {
    slug: "computer",
    title: "Computer",
    description: "Basic IT, MS Office, Internet, Hardware, Shortcuts",
    order: 4,
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    description: "Quran, Hadith, Fiqh, Seerah, Islamic History",
    order: 5,
  },
];

// ─────────────────────────────────────────────
// MCQ TYPE
// ─────────────────────────────────────────────

type MCQ = {
  order: number;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty: Difficulty;
};

// ─────────────────────────────────────────────
// SUBJECT 1 — ENGLISH (50 MCQs)
// ─────────────────────────────────────────────

const englishMCQs: MCQ[] = [
  // Synonyms (1–15)
  {
    order: 1, text: "Choose the correct synonym for 'ABANDON'.",
    options: ["Keep", "Forsake", "Retain", "Maintain"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Abandon' means to leave or give up entirely. 'Forsake' is its closest synonym meaning to desert or renounce.",
  },
  {
    order: 2, text: "Synonym of 'BENEVOLENT' is:",
    options: ["Cruel", "Kind", "Selfish", "Harsh"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Benevolent' means well-meaning and kindly. Its synonym is 'Kind'.",
  },
  {
    order: 3, text: "Synonym of 'SUPERFLUOUS' is:",
    options: ["Necessary", "Important", "Unnecessary", "Useful"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "'Superfluous' means more than what is needed — i.e., unnecessary or excessive.",
  },
  {
    order: 4, text: "Synonym of 'IMPUGN' is:",
    options: ["Praise", "Attack verbally", "Approve", "Support"],
    correctIndex: 1, difficulty: "HARD",
    explanation: "'Impugn' means to dispute the truth or integrity of something — to 'attack verbally' or challenge.",
  },
  {
    order: 5, text: "Synonym of 'AMNESTY' is:",
    options: ["Punishment", "War", "Pardon", "Arrest"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "'Amnesty' is an official pardon granted by a government. Its synonym is 'Pardon'.",
  },
  {
    order: 6, text: "Synonym of 'COERCE' is:",
    options: ["Permit", "Compel", "Advise", "Suggest"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "'Coerce' means to persuade someone to do something by using force or threats — i.e., to compel.",
  },
  {
    order: 7, text: "Synonym of 'QUELL' is:",
    options: ["Increase", "Hide", "Suppress", "Reveal"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "'Quell' means to put an end to a rebellion or disturbance by force — i.e., to suppress.",
  },
  {
    order: 8, text: "Synonym of 'AMEND' is:",
    options: ["Destroy", "Alter", "Repeat", "Ignore"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Amend' means to make changes to a text, law, or statement — to alter it for the better.",
  },
  {
    order: 9, text: "Synonym of 'BARRAGE' is:",
    options: ["Silence", "Dispute", "Bombardment", "Retreat"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "'Barrage' originally referred to a military bombardment; figuratively it means an overwhelming outpouring.",
  },
  {
    order: 10, text: "Synonym of 'CONCEIT' is:",
    options: ["Humility", "Arrogance", "Modesty", "Kindness"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Conceit' means excessive pride in oneself. Its synonym is 'arrogance'.",
  },
  {
    order: 11, text: "Synonym of 'DELEGATE' is:",
    options: ["Enemy", "Representative", "Officer", "Ruler"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "A 'delegate' is a person sent or authorized to represent others — a 'representative'.",
  },
  {
    order: 12, text: "Synonym of 'FRAGILE' is:",
    options: ["Strong", "Weak", "Durable", "Rigid"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Fragile' means easily broken or damaged — synonymous with 'weak' or 'delicate'.",
  },
  {
    order: 13, text: "Synonym of 'VERBOSE' is:",
    options: ["Silent", "Brief", "Wordy", "Clear"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "'Verbose' means using more words than needed — i.e., wordy or long-winded.",
  },
  {
    order: 14, text: "Synonym of 'BENCHMARK' is:",
    options: ["Exhibition", "Reference point", "Label", "Title"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "A 'benchmark' is a standard or reference point against which things are compared.",
  },
  {
    order: 15, text: "Synonym of 'CANDID' is:",
    options: ["Dishonest", "Frank", "Secretive", "Rude"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Candid' means truthful and straightforward — synonymous with 'frank'.",
  },
  // Antonyms (16–28)
  {
    order: 16, text: "Antonym of 'NIGGARDLY' is:",
    options: ["Yield", "Permit", "Obedient", "Generous"],
    correctIndex: 3, difficulty: "MEDIUM",
    explanation: "'Niggardly' means stingy or miserly. Its antonym is 'generous'.",
  },
  {
    order: 17, text: "Antonym of 'PERTINENT' is:",
    options: ["Relevant", "Irrelevant", "Precise", "Accurate"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "'Pertinent' means relevant or applicable. Its antonym is 'irrelevant'.",
  },
  {
    order: 18, text: "Antonym of 'BLEAK' is:",
    options: ["Austere", "Dark", "Bright", "Cold"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Bleak' means dreary, dark, or without hope. Its antonym is 'bright'.",
  },
  {
    order: 19, text: "Antonym of 'DILIGENT' is:",
    options: ["Hardworking", "Careful", "Lazy", "Clever"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Diligent' means showing care and effort. Its antonym is 'lazy'.",
  },
  {
    order: 20, text: "Antonym of 'VERBOSE' is:",
    options: ["Concise", "Talkative", "Elaborate", "Unclear"],
    correctIndex: 0, difficulty: "MEDIUM",
    explanation: "'Verbose' means using too many words. Its antonym is 'concise' (using few words).",
  },
  {
    order: 21, text: "Antonym of 'SERENE' is:",
    options: ["Calm", "Peaceful", "Agitated", "Quiet"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Serene' means calm and peaceful. Its antonym is 'agitated'.",
  },
  {
    order: 22, text: "Antonym of 'ASCEND' is:",
    options: ["Rise", "Climb", "Descend", "Float"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Ascend' means to go up. Its antonym is 'descend' — to go down.",
  },
  {
    order: 23, text: "Antonym of 'FRUGAL' is:",
    options: ["Thrifty", "Economical", "Wasteful", "Careful"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "'Frugal' means using money or resources carefully. Its antonym is 'wasteful'.",
  },
  {
    order: 24, text: "Antonym of 'COWARDLY' is:",
    options: ["Timid", "Fearful", "Brave", "Nervous"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Cowardly' means lacking courage. Its antonym is 'brave'.",
  },
  {
    order: 25, text: "Antonym of 'TRANSPARENT' is:",
    options: ["Clear", "Obvious", "Opaque", "Visible"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Transparent' allows light through and is easy to see through. Its antonym is 'opaque'.",
  },
  {
    order: 26, text: "Antonym of 'ANCIENT' is:",
    options: ["Old", "Antique", "Modern", "Historical"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Ancient' refers to something very old. Its antonym is 'modern'.",
  },
  {
    order: 27, text: "Antonym of 'TRIVIAL' is:",
    options: ["Minor", "Unimportant", "Significant", "Tiny"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "'Trivial' means of little importance. Its antonym is 'significant'.",
  },
  {
    order: 28, text: "Antonym of 'LOQUACIOUS' is:",
    options: ["Talkative", "Verbose", "Taciturn", "Friendly"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "'Loquacious' means tending to talk a great deal. Its antonym is 'taciturn' (reserved/silent).",
  },
  // Grammar (29–50)
  {
    order: 29, text: "If I _____ you, I wouldn't do that.",
    options: ["am", "was", "were", "be"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "This is a subjunctive/hypothetical conditional. The correct form is 'were' — used to express unreal situations.",
  },
  {
    order: 30, text: "They have been living in Switzerland _____ seven years.",
    options: ["since", "for", "from", "during"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "For a duration of time, use 'for'. 'Since' is used with a specific point in time.",
  },
  {
    order: 31, text: "Choose the correctly spelled word:",
    options: ["Qoloquial", "Coloquial", "Colloqial", "Colloquial"],
    correctIndex: 3, difficulty: "HARD",
    explanation: "The correct spelling is 'Colloquial' — meaning used in ordinary or familiar conversation.",
  },
  {
    order: 32, text: "She _____ the report before the meeting started.",
    options: ["has completed", "had completed", "completed", "was completing"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Past perfect ('had completed') is used for an action completed before another past action.",
  },
  {
    order: 33, text: "The synonym of 'PERSEVERANCE' is:",
    options: ["Laziness", "Persistence", "Surrender", "Neglect"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "'Perseverance' means continued effort despite difficulty. Its synonym is 'persistence'.",
  },
  {
    order: 34, text: "Identify the passive voice: 'The letter was written by Ali.'",
    options: ["Active voice", "Passive voice", "Imperative voice", "Subjunctive mood"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Was written by Ali' — the subject receives the action, making this passive voice.",
  },
  {
    order: 35, text: "'All along' means:",
    options: ["Altogether", "All the time", "In agreement", "Alone"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "'All along' is an idiom meaning 'from the beginning' or 'throughout all the time'.",
  },
  {
    order: 36, text: "Choose the correct preposition: 'The planes flew in formation _____ the fields.'",
    options: ["in", "on", "over", "with"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "'Over' is the correct preposition for flying above a surface.",
  },
  {
    order: 37, text: "'From forth the fatal loins of these two foes' — this sentence is an example of:",
    options: ["Metaphor", "Imagery", "Alliteration", "Personification"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Alliteration is the repetition of the same consonant sound at the start of nearby words — 'f' repeats here.",
  },
  {
    order: 38, text: "One who studies the composition of the Earth is called a:",
    options: ["Dermatologist", "Zoologist", "Philologist", "Geologist"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "A 'geologist' studies the physical structure and substance of the earth.",
  },
  {
    order: 39, text: "Choose the correct sentence:",
    options: [
      "He is more taller than his brother.",
      "He is more tall than his brother.",
      "He is taller than his brother.",
      "He is tallest than his brother.",
    ],
    correctIndex: 2, difficulty: "EASY",
    explanation: "For comparatives of one-syllable adjectives, use '-er', not 'more'. 'Taller than' is correct.",
  },
  {
    order: 40, text: "'To burn the midnight oil' means:",
    options: [
      "To waste electricity",
      "To study or work late into the night",
      "To start a fire",
      "To be very angry",
    ],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "This idiom means to study or work very late at night.",
  },
  {
    order: 41, text: "The word 'AMBIGUOUS' means:",
    options: [
      "Clear and precise",
      "Open to more than one interpretation",
      "Very intelligent",
      "Extremely honest",
    ],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "'Ambiguous' means having more than one possible meaning or interpretation.",
  },
  {
    order: 42, text: "Choose the correct direct speech: He said that he was tired.",
    options: [
      `He said, "I am tired."`,
      `He said, "He was tired."`,
      `He said, "I was tired."`,
      `He said, "I will be tired."`,
    ],
    correctIndex: 0, difficulty: "MEDIUM",
    explanation: "In direct speech, reported 'he was tired' becomes 'I am tired' — we shift tense back and change pronoun.",
  },
  {
    order: 43, text: "Antonym of 'PROLIFIC' is:",
    options: ["Productive", "Creative", "Barren", "Fruitful"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "'Prolific' means producing much of something. Its antonym is 'barren' — producing little or nothing.",
  },
  {
    order: 44, text: "The plural of 'Phenomenon' is:",
    options: ["Phenomenons", "Phenomena", "Phenomenas", "Phenomenes"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "'Phenomena' is the correct plural of 'phenomenon' — a Greek-origin word.",
  },
  {
    order: 45, text: "Synonym of 'INQUISITIVE' is:",
    options: ["Disinterested", "Curious", "Bored", "Indifferent"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Inquisitive' means eager to know or learn things — synonymous with 'curious'.",
  },
  {
    order: 46, text: "Choose the correctly punctuated sentence:",
    options: [
      "Its a good day.",
      "It's a good day.",
      "Its' a good day.",
      "It'S a good day.",
    ],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'It's' is the contraction of 'it is'. The apostrophe indicates the missing letter 'i'.",
  },
  {
    order: 47, text: "Antonym of 'VERBOSE' is:",
    options: ["Talkative", "Wordy", "Concise", "Repetitive"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "'Verbose' means using more words than necessary. Its antonym is 'concise'.",
  },
  {
    order: 48, text: "The word 'EPHEMERAL' means:",
    options: ["Everlasting", "Short-lived", "Important", "Recurring"],
    correctIndex: 1, difficulty: "HARD",
    explanation: "'Ephemeral' means lasting for a very short time — short-lived or transitory.",
  },
  {
    order: 49, text: "Identify the correct sentence:",
    options: [
      "Neither the students nor the teacher were present.",
      "Neither the students nor the teacher was present.",
      "Neither the students nor the teacher are present.",
      "Neither the students nor the teacher has been present.",
    ],
    correctIndex: 1, difficulty: "HARD",
    explanation: "When 'neither...nor' joins a plural and a singular noun, the verb agrees with the nearest subject ('teacher' → singular 'was').",
  },
  {
    order: 50, text: "Choose the synonym of 'METICULOUS':",
    options: ["Careless", "Thorough", "Hasty", "Vague"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "'Meticulous' means showing great attention to detail — synonymous with 'thorough' or 'careful'.",
  },
];

// ─────────────────────────────────────────────
// SUBJECT 2 — GENERAL KNOWLEDGE (50 MCQs)
// Sources: FIA Inspector/Constable past papers 2019–2024
// ─────────────────────────────────────────────

const gkMCQs: MCQ[] = [
  {
    order: 1, text: "Night blindness is caused due to the deficiency of which vitamin?",
    options: ["Vitamin B", "Vitamin C", "Vitamin A", "Vitamin D"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Vitamin A deficiency causes night blindness (inability to see in low light) as it is essential for producing rhodopsin in eye cells.",
  },
  {
    order: 2, text: "Through the mediation of _____ , the Tashkent Agreement was signed between India and Pakistan in 1966.",
    options: ["USA", "China", "Soviet Union", "UK"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Tashkent Declaration (January 1966) was mediated by Soviet Premier Alexei Kosygin after the 1965 Indo-Pakistan War.",
  },
  {
    order: 3, text: "The device used for the conversion of DC to AC is called:",
    options: ["Rectifier", "Transformer", "Inverter", "Converter"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "An inverter converts Direct Current (DC) to Alternating Current (AC). A rectifier does the opposite.",
  },
  {
    order: 4, text: "Newton's First Law of Motion is also called the:",
    options: ["Law of Momentum", "Law of Acceleration", "Law of Inertia", "Law of Gravitation"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Newton's First Law — 'an object at rest stays at rest unless acted upon by a force' — is called the Law of Inertia.",
  },
  {
    order: 5, text: "Who was Al-Khwarizmi?",
    options: ["Astronomer", "Poet", "Mathematician", "Philosopher"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Al-Khwarizmi was a 9th-century Persian mathematician known as the 'Father of Algebra'. The word 'algorithm' comes from his name.",
  },
  {
    order: 6, text: "The Asian Infrastructure Investment Bank (AIIB) Headquarters is located in:",
    options: ["Tokyo", "Beijing", "Singapore", "Seoul"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "AIIB, established in 2015, is headquartered in Beijing, China.",
  },
  {
    order: 7, text: "The World Bank and IMF are collectively called:",
    options: ["UN Institutions", "Trade Institutions", "Bretton Woods Institutions", "Basel Institutions"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The World Bank and IMF were established at the Bretton Woods Conference (1944) and are therefore called Bretton Woods Institutions.",
  },
  {
    order: 8, text: "The United Nations Security Council Resolution 47 is related to:",
    options: ["Palestine", "Korea", "Kashmir", "Vietnam"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "UNSC Resolution 47 (1948) called for a free and impartial plebiscite to determine the future of Kashmir.",
  },
  {
    order: 9, text: "Which mountain range separates Central Asia from South Asia?",
    options: ["Karakoram", "Andes", "Himalaya", "Alps"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Himalayan range forms a natural barrier between the Indian subcontinent (South Asia) and Central Asia.",
  },
  {
    order: 10, text: "Which metal does not corrode?",
    options: ["Iron", "Copper", "Silver", "Gold"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Gold is a noble metal — it does not react with oxygen or water and therefore does not corrode.",
  },
  {
    order: 11, text: "In which isotope of hydrogen are there 1 proton and 2 neutrons?",
    options: ["Protium", "Deuterium", "Tritium", "Helium-3"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "Tritium (hydrogen-3) has 1 proton and 2 neutrons. Protium has 0 neutrons; deuterium has 1 neutron.",
  },
  {
    order: 12, text: "Who was the first to raise the slogan 'Inquilab Zindabad'?",
    options: ["Bhagat Singh", "Maulana Hasrat Mohani", "Bal Gangadhar Tilak", "Subhas Chandra Bose"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Maulana Hasrat Mohani first coined the slogan 'Inquilab Zindabad' (Long Live the Revolution) in 1921.",
  },
  {
    order: 13, text: "An organism's interaction with its surroundings is studied under which branch?",
    options: ["Genetics", "Zoology", "Ecology", "Botany"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Ecology is the branch of biology concerned with the relations of organisms to one another and to their environment.",
  },
  {
    order: 14, text: "What is the phenomenon involved in the working of a transformer?",
    options: ["Self-induction", "Electrolysis", "Mutual induction", "Photo-emission"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "Transformers work on the principle of mutual induction — a changing current in one coil induces a voltage in an adjacent coil.",
  },
  {
    order: 15, text: "Solve: 7n + 12 = 4n + 27. What is n?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "7n + 12 = 4n + 27 → 3n = 15 → n = 5.",
  },
  {
    order: 16, text: "The Hawaiian Islands are also known as:",
    options: ["Easter Islands", "Solomon Islands", "Sandwich Islands", "Canary Islands"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Hawaiian Islands were formerly known as the Sandwich Islands, a name given by Captain James Cook in 1778.",
  },
  {
    order: 17, text: "Where is the Headquarters of the World Bank located?",
    options: ["New York", "Paris", "Geneva", "Washington D.C."],
    correctIndex: 3, difficulty: "EASY",
    explanation: "The World Bank is headquartered in Washington D.C., USA.",
  },
  {
    order: 18, text: "40/60 in its simplest ratio is:",
    options: ["4/6", "2/3", "8/12", "1/2"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "GCD of 40 and 60 is 20. 40÷20 = 2, 60÷20 = 3. Simplest form is 2/3.",
  },
  {
    order: 19, text: "Weather and climatic patterns are driven by:",
    options: ["Lunar gravity", "Ocean currents", "Solar radiation", "Earth's rotation only"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Solar radiation is the primary driver of Earth's weather and climate systems, powering wind, evaporation, and circulation.",
  },
  {
    order: 20, text: "The Headquarters of the International Monetary Fund (IMF) is in:",
    options: ["Geneva", "New York", "London", "Washington D.C."],
    correctIndex: 3, difficulty: "EASY",
    explanation: "The IMF is headquartered in Washington D.C., USA, alongside the World Bank.",
  },
  {
    order: 21, text: "The speed of sound in air is approximately:",
    options: ["300 m/s", "343 m/s", "3×10⁸ m/s", "1500 m/s"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "The speed of sound in air at room temperature is approximately 343 metres per second.",
  },
  {
    order: 22, text: "OIC stands for:",
    options: [
      "Organisation of Islamic Countries",
      "Organisation of Islamic Cooperation",
      "Order of Islamic Council",
      "Organisation of International Commerce",
    ],
    correctIndex: 1, difficulty: "EASY",
    explanation: "OIC stands for Organisation of Islamic Cooperation — the second largest intergovernmental organisation after the UN.",
  },
  {
    order: 23, text: "Which is the largest ocean in the world?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "The Pacific Ocean is the largest and deepest ocean, covering more than 30% of the Earth's surface.",
  },
  {
    order: 24, text: "The headquarter of Interpol is located in:",
    options: ["Brussels", "Geneva", "Lyon", "Paris"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Interpol (International Criminal Police Organisation) is headquartered in Lyon, France.",
  },
  {
    order: 25, text: "Which country is known as the 'Land of the Rising Sun'?",
    options: ["China", "South Korea", "Japan", "Thailand"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Japan is known as the 'Land of the Rising Sun' — its name in Japanese, 'Nippon', means 'origin of the sun'.",
  },
  {
    order: 26, text: "Human blood is classified into how many main groups?",
    options: ["2", "3", "4", "8"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The ABO blood group system classifies blood into 4 main types: A, B, AB, and O.",
  },
  {
    order: 27, text: "Which gas is known as laughing gas?",
    options: ["Carbon dioxide", "Nitrous oxide", "Nitrogen", "Oxygen"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Nitrous oxide (N₂O) is known as 'laughing gas' because it can cause euphoria and laughter when inhaled.",
  },
  {
    order: 28, text: "The United Nations was established in:",
    options: ["1944", "1945", "1946", "1947"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "The UN Charter was signed on 26 June 1945 and came into force on 24 October 1945.",
  },
  {
    order: 29, text: "The smallest country in the world by area is:",
    options: ["Monaco", "Liechtenstein", "Vatican City", "San Marino"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Vatican City, with an area of 0.44 km², is the world's smallest country.",
  },
  {
    order: 30, text: "The 'Big Bang' theory explains the origin of:",
    options: ["The Earth", "The Solar System", "The Universe", "Life on Earth"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Big Bang theory describes the origin and evolution of the universe, beginning ~13.8 billion years ago.",
  },
  {
    order: 31, text: "In COP 28, which country hosted the conference?",
    options: ["Saudi Arabia", "Qatar", "UAE", "Bahrain"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "COP 28 was held in Dubai, United Arab Emirates, in November–December 2023.",
  },
  {
    order: 32, text: "Who wrote 'The Republic'?",
    options: ["Aristotle", "Socrates", "Plato", "Cicero"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "'The Republic' is a Socratic dialogue written by the ancient Greek philosopher Plato around 375 BC.",
  },
  {
    order: 33, text: "The chemical formula of water is:",
    options: ["HO", "H₂O", "H₂O₂", "HO₂"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Water consists of two hydrogen atoms covalently bonded to one oxygen atom — H₂O.",
  },
  {
    order: 34, text: "The process of converting sugar to alcohol is called:",
    options: ["Oxidation", "Fermentation", "Evaporation", "Distillation"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Fermentation is the metabolic process where yeast or bacteria convert sugars to alcohol and CO₂.",
  },
  {
    order: 35, text: "Which instrument measures atmospheric pressure?",
    options: ["Thermometer", "Barometer", "Altimeter", "Hygrometer"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "A barometer is used to measure atmospheric pressure.",
  },
  {
    order: 36, text: "The Nobel Prize in Physics 2023 was related to:",
    options: [
      "Quantum entanglement",
      "Attosecond pulses of light",
      "Black holes",
      "Gravitational waves",
    ],
    correctIndex: 1, difficulty: "HARD",
    explanation: "The 2023 Nobel Physics Prize was awarded for experimental methods generating attosecond pulses of light to study electron dynamics in matter.",
  },
  {
    order: 37, text: "Which planet has the most moons in our solar system?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "As of 2024, Saturn holds the record with 146 confirmed moons — surpassing Jupiter's 95.",
  },
  {
    order: 38, text: "The 'Richter Scale' is used to measure:",
    options: ["Wind speed", "Tsunami height", "Earthquake intensity", "Volcanic temperature"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Richter Scale measures the magnitude (energy released) of earthquakes.",
  },
  {
    order: 39, text: "G-20 consists of how many member countries?",
    options: ["15", "18", "20", "22"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The G-20 consists of 19 countries plus the European Union — 20 members in total.",
  },
  {
    order: 40, text: "Which element has the chemical symbol 'Fe'?",
    options: ["Fluorine", "Iron", "Francium", "Fermium"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "'Fe' comes from the Latin word 'Ferrum', meaning Iron.",
  },
  {
    order: 41, text: "Who invented the telephone?",
    options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Alexander Graham Bell is credited with inventing the telephone in 1876.",
  },
  {
    order: 42, text: "SAARC stands for:",
    options: [
      "South Asian Association for Regional Cooperation",
      "South Asian Alliance for Regional Commerce",
      "Southeast Asian Association for Regional Cooperation",
      "South Asian Agency for Regional Communication",
    ],
    correctIndex: 0, difficulty: "EASY",
    explanation: "SAARC — South Asian Association for Regional Cooperation — was established in 1985 and includes 8 member nations.",
  },
  {
    order: 43, text: "The headquarters of the United Nations is in:",
    options: ["Washington D.C.", "Geneva", "New York", "Brussels"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The UN headquarters is located in New York City, USA, on the East Side of Manhattan.",
  },
  {
    order: 44, text: "Which organ of the human body produces insulin?",
    options: ["Liver", "Kidney", "Pancreas", "Gallbladder"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The pancreas produces insulin, a hormone that regulates blood sugar levels.",
  },
  {
    order: 45, text: "Light travels at approximately:",
    options: ["3×10⁶ m/s", "3×10⁷ m/s", "3×10⁸ m/s", "3×10⁹ m/s"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The speed of light in a vacuum is approximately 3×10⁸ metres per second (300,000 km/s).",
  },
  {
    order: 46, text: "The Suez Canal connects:",
    options: [
      "Red Sea and Arabian Sea",
      "Mediterranean Sea and Red Sea",
      "Black Sea and Caspian Sea",
      "Atlantic Ocean and Pacific Ocean",
    ],
    correctIndex: 1, difficulty: "EASY",
    explanation: "The Suez Canal in Egypt connects the Mediterranean Sea to the Red Sea, shortening the route from Europe to Asia.",
  },
  {
    order: 47, text: "Which country has the longest coastline in the world?",
    options: ["Russia", "Australia", "USA", "Canada"],
    correctIndex: 3, difficulty: "MEDIUM",
    explanation: "Canada has the world's longest total coastline at approximately 202,080 km.",
  },
  {
    order: 48, text: "DNA stands for:",
    options: [
      "Dioxynucleic Acid",
      "Deoxyribonucleic Acid",
      "Deoxyribonuclear Acid",
      "Dinitrogen Acid",
    ],
    correctIndex: 1, difficulty: "EASY",
    explanation: "DNA stands for Deoxyribonucleic Acid — the molecule that carries genetic information.",
  },
  {
    order: 49, text: "Which gas is most abundant in the Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Nitrogen makes up approximately 78% of Earth's atmosphere, followed by oxygen (21%).",
  },
  {
    order: 50, text: "The International Court of Justice is located in:",
    options: ["New York", "Geneva", "The Hague", "Brussels"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The ICJ, the UN's principal judicial organ, is headquartered in The Hague, Netherlands.",
  },
];

// ─────────────────────────────────────────────
// SUBJECT 3 — PAKISTAN STUDIES (50 MCQs)
// ─────────────────────────────────────────────

const pakStudiesMCQs: MCQ[] = [
  {
    order: 1, text: "The Pakistan Resolution was passed in which year?",
    options: ["1930", "1935", "1940", "1947"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Pakistan Resolution (Lahore Resolution) was passed on 23 March 1940 at Minto Park, Lahore.",
  },
  {
    order: 2, text: "Who is called the 'Father of the Nation' of Pakistan?",
    options: ["Allama Iqbal", "Liaquat Ali Khan", "Sir Syed Ahmad Khan", "Quaid-e-Azam Muhammad Ali Jinnah"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Muhammad Ali Jinnah is called the 'Quaid-e-Azam' (Great Leader) and Father of the Nation of Pakistan.",
  },
  {
    order: 3, text: "Pakistan was declared an Islamic Republic in:",
    options: ["1947", "1949", "1956", "1973"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The 1956 Constitution declared Pakistan an Islamic Republic for the first time.",
  },
  {
    order: 4, text: "The first Constitution of Pakistan was passed in:",
    options: ["1947", "1953", "1956", "1962"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Pakistan's first constitution was adopted on 23 March 1956.",
  },
  {
    order: 5, text: "The current Constitution of Pakistan was adopted in:",
    options: ["1956", "1962", "1969", "1973"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "The 1973 Constitution, adopted on 14 August 1973, is the current constitution of Pakistan.",
  },
  {
    order: 6, text: "Pakistan's national language is:",
    options: ["Punjabi", "Pashto", "Sindhi", "Urdu"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Urdu is the national language of Pakistan as stated in Article 251 of the 1973 Constitution.",
  },
  {
    order: 7, text: "The capital of Pakistan is:",
    options: ["Lahore", "Karachi", "Islamabad", "Rawalpindi"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Islamabad has been the capital of Pakistan since 1967, replacing Rawalpindi as the interim capital.",
  },
  {
    order: 8, text: "The largest province of Pakistan by area is:",
    options: ["Punjab", "Sindh", "KPK", "Balochistan"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Balochistan is the largest province of Pakistan by area, covering about 44% of the country's total area.",
  },
  {
    order: 9, text: "The largest province of Pakistan by population is:",
    options: ["Balochistan", "Sindh", "Punjab", "KPK"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Punjab is the most populous province of Pakistan, home to over 50% of the country's population.",
  },
  {
    order: 10, text: "Who drafted the Pakistan Resolution in 1940?",
    options: ["Quaid-e-Azam", "A.K. Fazlul Huq", "Chaudhry Rehmat Ali", "Allama Iqbal"],
    correctIndex: 1, difficulty: "HARD",
    explanation: "The Pakistan Resolution was moved by A.K. Fazlul Huq, the Chief Minister of Bengal, at the Lahore session.",
  },
  {
    order: 11, text: "The Two-Nation Theory is based on the idea that:",
    options: [
      "Muslims and Hindus are one nation",
      "Muslims and Hindus are two separate nations",
      "Pakistan should be a secular state",
      "India and Pakistan should be united",
    ],
    correctIndex: 1, difficulty: "EASY",
    explanation: "The Two-Nation Theory proposed that Hindus and Muslims of the subcontinent were two separate nations based on religion, culture, and civilization.",
  },
  {
    order: 12, text: "Allama Iqbal gave the idea of a separate Muslim state in his famous address at:",
    options: ["Karachi", "Lahore", "Allahabad", "Delhi"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Allama Iqbal presented his vision of a separate Muslim state in his 1930 Allahabad Address as president of the Muslim League.",
  },
  {
    order: 13, text: "The 1965 War between India and Pakistan ended with the:",
    options: ["Simla Agreement", "Tashkent Declaration", "Lahore Agreement", "Delhi Pact"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "The 1965 war was concluded with the Tashkent Declaration, signed on 10 January 1966.",
  },
  {
    order: 14, text: "Ayub Khan introduced the Basic Democracies system in:",
    options: ["1956", "1958", "1960", "1962"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "Ayub Khan introduced the Basic Democracies system in 1960 to devolve power to local levels.",
  },
  {
    order: 15, text: "K2 is located in which mountain range?",
    options: ["Himalaya", "Hindu Kush", "Karakoram", "Sulaiman"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "K2 (8,611 m), the world's second highest peak, is located in the Karakoram Range in Gilgit-Baltistan.",
  },
  {
    order: 16, text: "The Indus Waters Treaty was signed in:",
    options: ["1956", "1960", "1965", "1972"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "The Indus Waters Treaty between Pakistan and India was signed on 19 September 1960, brokered by the World Bank.",
  },
  {
    order: 17, text: "Which river is also known as the 'Abaseen'?",
    options: ["Indus", "Jhelum", "Chenab", "Ravi"],
    correctIndex: 0, difficulty: "MEDIUM",
    explanation: "'Abaseen' (Father of Rivers) is the Pashto name for the Indus River.",
  },
  {
    order: 18, text: "The Simla Agreement was signed in:",
    options: ["1965", "1970", "1972", "1975"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Simla Agreement between Zulfikar Ali Bhutto and Indira Gandhi was signed on 2 July 1972 following the 1971 war.",
  },
  {
    order: 19, text: "Gwadar Port is located in which province?",
    options: ["Sindh", "KPK", "Punjab", "Balochistan"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Gwadar is a deep-sea port city located in Balochistan province, a key node of CPEC.",
  },
  {
    order: 20, text: "The Tarbela Dam is built on which river?",
    options: ["Jhelum", "Chenab", "Indus", "Kabul"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Tarbela Dam, one of the world's largest earth-filled dams, is built on the Indus River in KPK.",
  },
  {
    order: 21, text: "The Mangla Dam is built on which river?",
    options: ["Ravi", "Chenab", "Jhelum", "Beas"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Mangla Dam, in Azad Kashmir, is built on the Jhelum River.",
  },
  {
    order: 22, text: "The national bird of Pakistan is:",
    options: ["Sparrow", "Eagle", "Chukar Partridge", "Peacock"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Chukar Partridge (Chakor) is the national bird of Pakistan.",
  },
  {
    order: 23, text: "The national flower of Pakistan is:",
    options: ["Rose", "Lily", "Jasmine (Yasmin)", "Marigold"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Jasmine (Yasmin) is the national flower of Pakistan.",
  },
  {
    order: 24, text: "The national sport of Pakistan is:",
    options: ["Cricket", "Squash", "Field Hockey", "Kabaddi"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Field Hockey is the national sport of Pakistan.",
  },
  {
    order: 25, text: "CPEC stands for:",
    options: [
      "Central Pakistan Economic Corridor",
      "China-Pakistan Electrical Cooperation",
      "China-Pakistan Economic Corridor",
      "Continental Pakistan Energy Commission",
    ],
    correctIndex: 2, difficulty: "EASY",
    explanation: "CPEC — China-Pakistan Economic Corridor — is a multi-billion dollar infrastructure project connecting Gwadar to Kashgar.",
  },
  {
    order: 26, text: "Pakistan conducted its first nuclear test on:",
    options: ["28 May 1995", "28 May 1998", "23 March 1998", "14 August 1998"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Pakistan successfully conducted five nuclear tests at Chagai Hills, Balochistan, on 28 May 1998.",
  },
  {
    order: 27, text: "The highest civil award of Pakistan is:",
    options: ["Sitara-e-Pakistan", "Hilal-e-Pakistan", "Nishan-e-Pakistan", "Tamgha-e-Pakistan"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Nishan-e-Pakistan (Order of Pakistan) is the highest civilian honour of Pakistan.",
  },
  {
    order: 28, text: "The National Assembly of Pakistan has how many seats in total?",
    options: ["272", "312", "336", "342"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "After the 25th Constitutional Amendment (2018), the National Assembly has 336 seats (266 general + 60 women + 10 minorities).",
  },
  {
    order: 29, text: "Pakistan joined the United Nations in:",
    options: ["1945", "1947", "1948", "1950"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Pakistan became a member of the United Nations on 30 September 1947, shortly after independence.",
  },
  {
    order: 30, text: "The Durand Line separates Pakistan from:",
    options: ["India", "Iran", "Afghanistan", "China"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Durand Line (1893) is the international boundary between Pakistan and Afghanistan, named after Sir Mortimer Durand.",
  },
  {
    order: 31, text: "Which Pakistani became the first woman Prime Minister of Pakistan?",
    options: ["Hina Rabbani Khar", "Nusrat Bhutto", "Benazir Bhutto", "Faryal Talpur"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Benazir Bhutto became Pakistan's first female Prime Minister in 1988 and is also the first female PM in any Muslim-majority country.",
  },
  {
    order: 32, text: "The first General Elections in Pakistan were held in:",
    options: ["1954", "1962", "1970", "1977"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Pakistan's first general elections based on adult franchise were held on 7 December 1970.",
  },
  {
    order: 33, text: "Khyber Pass connects Pakistan with:",
    options: ["China", "Iran", "India", "Afghanistan"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "The Khyber Pass in the Hindu Kush mountain range connects Peshawar (Pakistan) to Kabul (Afghanistan).",
  },
  {
    order: 34, text: "The 'Objectives Resolution' was adopted in:",
    options: ["1947", "1948", "1949", "1950"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Objectives Resolution was adopted by Pakistan's Constituent Assembly on 12 March 1949, under Liaquat Ali Khan.",
  },
  {
    order: 35, text: "Which amendment to the Constitution of Pakistan is known as the 18th Amendment?",
    options: [
      "Gave more powers to the Senate",
      "Made Pakistan a federal parliamentary republic",
      "Abolished the concurrent legislative list and gave more autonomy to provinces",
      "Introduced proportional representation",
    ],
    correctIndex: 2, difficulty: "HARD",
    explanation: "The 18th Amendment (2010) abolished the Concurrent Legislative List and devolved significant powers to Pakistan's provinces.",
  },
  {
    order: 36, text: "Pakistan's national anthem was written by:",
    options: ["Allama Iqbal", "Faiz Ahmed Faiz", "Hafeez Jalandhari", "Ahmed Faraz"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Pakistan's national anthem 'Qaumi Tarana' was written by Hafeez Jalandhari with music by Ahmed Ghulamali Chagla.",
  },
  {
    order: 37, text: "Shandur Polo Festival is held in which province?",
    options: ["Punjab", "Sindh", "KPK", "Balochistan"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "The Shandur Polo Festival is held annually at the Shandur Pass, the world's highest polo ground, in KPK.",
  },
  {
    order: 38, text: "The Pakistan-China border is called:",
    options: ["Durand Line", "McMahon Line", "Wakhan Corridor", "Karakoram Highway border"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "The narrow Wakhan Corridor of Afghanistan geographically separates Pakistan from China. Pakistan and China share a short border through Khunjerab Pass.",
  },
  {
    order: 39, text: "Deosai National Park is located in:",
    options: ["KPK", "Gilgit-Baltistan", "Azad Kashmir", "Balochistan"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Deosai National Park — one of the world's highest plateaus — is located in Gilgit-Baltistan.",
  },
  {
    order: 40, text: "The first Governor General of Pakistan was:",
    options: ["Liaquat Ali Khan", "Khawaja Nazimuddin", "Quaid-e-Azam Muhammad Ali Jinnah", "Iskander Mirza"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Quaid-e-Azam Muhammad Ali Jinnah was the first Governor General of Pakistan (1947–1948).",
  },
  {
    order: 41, text: "The first Prime Minister of Pakistan was:",
    options: ["Quaid-e-Azam", "Liaquat Ali Khan", "Khawaja Nazimuddin", "Muhammad Ali Bogra"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Liaquat Ali Khan was Pakistan's first Prime Minister (1947–1951), assassinated on 16 October 1951.",
  },
  {
    order: 42, text: "Operation Zarb-e-Azb was launched in which area?",
    options: ["Swat", "South Waziristan", "North Waziristan", "Bajaur"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Operation Zarb-e-Azb was launched by the Pakistan Army in North Waziristan in June 2014 against terrorist groups.",
  },
  {
    order: 43, text: "The Lahore Resolution was also known as the:",
    options: ["Pakistan Resolution", "Muslim League Resolution", "Indian Resolution", "Delhi Resolution"],
    correctIndex: 0, difficulty: "EASY",
    explanation: "The Lahore Resolution (1940) later came to be known as the Pakistan Resolution.",
  },
  {
    order: 44, text: "Pakistan's total area is approximately:",
    options: ["696,000 km²", "796,095 km²", "887,000 km²", "596,000 km²"],
    correctIndex: 1, difficulty: "HARD",
    explanation: "Pakistan's total area is 796,095 km², making it the 33rd largest country in the world.",
  },
  {
    order: 45, text: "The Kalash people are indigenous to which region of Pakistan?",
    options: ["Sindh", "Balochistan", "Chitral (KPK)", "Gilgit-Baltistan"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Kalash are an indigenous group living in the Chitral District of KPK, known for their unique culture and festivals.",
  },
  {
    order: 46, text: "How many districts does Punjab have (post-2023)?",
    options: ["36", "42", "47", "51"],
    correctIndex: 0, difficulty: "HARD",
    explanation: "Punjab has 36 districts (before the recent addition of new administrative units; verify with latest government data as districts may have been added).",
  },
  {
    order: 47, text: "The 'Badshahi Mosque' was built by:",
    options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Badshahi Mosque in Lahore was built by Mughal Emperor Aurangzeb Alamgir in 1673.",
  },
  {
    order: 48, text: "Mohenjo-Daro is located in which Pakistani province?",
    options: ["Punjab", "Sindh", "Balochistan", "KPK"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Mohenjo-Daro (Mound of the Dead), a key Indus Valley Civilisation site, is in Larkana District, Sindh.",
  },
  {
    order: 49, text: "The Cholistan Desert is in which province?",
    options: ["Balochistan", "Sindh", "KPK", "Punjab"],
    correctIndex: 3, difficulty: "MEDIUM",
    explanation: "The Cholistan Desert (also called Rohi) is in the Bahawalpur region of southern Punjab.",
  },
  {
    order: 50, text: "The slogan 'Pakistan ka matlab kya — La ilaha illallah' is attributed to:",
    options: ["Allama Iqbal", "Quaid-e-Azam", "Asghar Sodai", "Hafeez Jalandhari"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "The popular slogan is attributed to Asghar Sodai, a poet from Lyallpur (now Faisalabad).",
  },
];

// ─────────────────────────────────────────────
// SUBJECT 4 — COMPUTER (50 MCQs)
// ─────────────────────────────────────────────

const computerMCQs: MCQ[] = [
  {
    order: 1, text: "CPU stands for:",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Control Processing Unit"],
    correctIndex: 0, difficulty: "EASY",
    explanation: "CPU stands for Central Processing Unit — the primary component of a computer that processes instructions.",
  },
  {
    order: 2, text: "The connection of computers in a small geographical area is called:",
    options: ["WAN", "MAN", "LAN", "PAN"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "LAN (Local Area Network) connects computers in a limited geographic area like an office or building.",
  },
  {
    order: 3, text: "RAM stands for:",
    options: ["Read Access Memory", "Random Access Memory", "Read And Memory", "Remote Access Module"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "RAM (Random Access Memory) is temporary memory used by the computer to store data currently in use.",
  },
  {
    order: 4, text: "Which shortcut key is used to UNDO an action in MS Word?",
    options: ["Ctrl+Z", "Ctrl+Y", "Ctrl+X", "Ctrl+U"],
    correctIndex: 0, difficulty: "EASY",
    explanation: "Ctrl+Z is the universal shortcut to undo the last action in MS Office applications.",
  },
  {
    order: 5, text: "Which shortcut key is used to SAVE a document in MS Office?",
    options: ["Ctrl+P", "Ctrl+S", "Ctrl+A", "Ctrl+D"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Ctrl+S saves the current document in all MS Office applications.",
  },
  {
    order: 6, text: "The full form of HTML is:",
    options: [
      "Hypertext Transfer Markup Language",
      "High Text Markup Language",
      "Hypertext Markup Language",
      "Hyper Terminal Markup Language",
    ],
    correctIndex: 2, difficulty: "EASY",
    explanation: "HTML stands for HyperText Markup Language — the standard language for creating web pages.",
  },
  {
    order: 7, text: "Which of the following is NOT an operating system?",
    options: ["Windows", "Linux", "Oracle", "macOS"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Oracle is a database management system, not an operating system. Windows, Linux, and macOS are operating systems.",
  },
  {
    order: 8, text: "1 GB (Gigabyte) is equal to:",
    options: ["1024 MB", "1000 MB", "512 MB", "2048 KB"],
    correctIndex: 0, difficulty: "EASY",
    explanation: "1 GB = 1024 MB in binary (computer) measurement, though in SI units it equals 1000 MB.",
  },
  {
    order: 9, text: "Which shortcut key is used to select ALL content in a document?",
    options: ["Ctrl+C", "Ctrl+V", "Ctrl+A", "Ctrl+X"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Ctrl+A selects all content in the current document or text field.",
  },
  {
    order: 10, text: "The brain of the computer is:",
    options: ["Hard Drive", "RAM", "CPU", "Motherboard"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The CPU (Central Processing Unit) is called the brain of the computer as it processes all instructions.",
  },
  {
    order: 11, text: "Which type of software manages computer hardware?",
    options: ["Application Software", "Operating System", "Antivirus", "Utility Software"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "An Operating System (OS) is system software that manages hardware resources and provides services for application programs.",
  },
  {
    order: 12, text: "MS Excel is primarily used for:",
    options: ["Word Processing", "Presentations", "Spreadsheets and Calculations", "Email"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "MS Excel is a spreadsheet application used for calculations, data analysis, and charts.",
  },
  {
    order: 13, text: "Which key combination is used to COPY in Windows?",
    options: ["Ctrl+X", "Ctrl+V", "Ctrl+C", "Ctrl+Z"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Ctrl+C copies selected content to the clipboard.",
  },
  {
    order: 14, text: "Which key combination is used to PASTE in Windows?",
    options: ["Ctrl+C", "Ctrl+X", "Ctrl+Z", "Ctrl+V"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Ctrl+V pastes content from the clipboard to the current location.",
  },
  {
    order: 15, text: "The full form of URL is:",
    options: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Route Locator", "User Resource Locator"],
    correctIndex: 0, difficulty: "EASY",
    explanation: "URL stands for Uniform Resource Locator — the address used to access resources on the internet.",
  },
  {
    order: 16, text: "The shortcut key to open a new window/tab in a browser is:",
    options: ["Ctrl+T", "Ctrl+N", "Ctrl+W", "Ctrl+O"],
    correctIndex: 0, difficulty: "EASY",
    explanation: "Ctrl+T opens a new tab in most web browsers.",
  },
  {
    order: 17, text: "Which device converts digital signals to analog and vice versa?",
    options: ["Router", "Switch", "Modem", "Hub"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "A modem (modulator-demodulator) converts digital computer signals to analog telephone signals and back.",
  },
  {
    order: 18, text: "The shortcut key for 'Print' in MS Word is:",
    options: ["Ctrl+S", "Ctrl+P", "Ctrl+Q", "Ctrl+F"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Ctrl+P opens the Print dialog in MS Office and most other applications.",
  },
  {
    order: 19, text: "In MS PowerPoint, a single page of a presentation is called a:",
    options: ["Sheet", "Frame", "Slide", "Page"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Each page in a PowerPoint presentation is called a 'slide'.",
  },
  {
    order: 20, text: "HTTP stands for:",
    options: [
      "Hypertext Transfer Protocol",
      "High Transfer Text Protocol",
      "Hypertext Transmission Protocol",
      "High Text Transfer Protocol",
    ],
    correctIndex: 0, difficulty: "EASY",
    explanation: "HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web.",
  },
  {
    order: 21, text: "Which of the following is an INPUT device?",
    options: ["Monitor", "Printer", "Speaker", "Keyboard"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "A keyboard is an input device — it sends data to the computer. Monitor, printer, and speaker are output devices.",
  },
  {
    order: 22, text: "Which of the following is an OUTPUT device?",
    options: ["Scanner", "Mouse", "Monitor", "Microphone"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "A monitor is an output device — it displays information processed by the computer.",
  },
  {
    order: 23, text: "The shortcut key to BOLD text in MS Word is:",
    options: ["Ctrl+I", "Ctrl+U", "Ctrl+B", "Ctrl+L"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Ctrl+B applies or removes bold formatting in MS Word.",
  },
  {
    order: 24, text: "Which extension is used for MS Word files (2007 onward)?",
    options: [".doc", ".docx", ".txt", ".odt"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "From Word 2007 onward, the default file extension is .docx (XML-based format).",
  },
  {
    order: 25, text: "Which extension is used for MS Excel files (2007 onward)?",
    options: [".xls", ".xlsm", ".xlsx", ".csv"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The default Excel (2007+) file extension is .xlsx.",
  },
  {
    order: 26, text: "The shortcut key to FIND something in MS Word is:",
    options: ["Ctrl+H", "Ctrl+G", "Ctrl+F", "Ctrl+E"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Ctrl+F opens the Find dialog in MS Word and most applications.",
  },
  {
    order: 27, text: "What does 'www' stand for in a website address?",
    options: ["World Web Web", "World Wide Web", "Wide World Web", "Web Wide World"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "www stands for World Wide Web — the system of interlinked hypertext documents accessed via the Internet.",
  },
  {
    order: 28, text: "A virus that replicates itself without attaching to a host file is called a:",
    options: ["Trojan", "Spyware", "Worm", "Adware"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "A worm is a standalone malicious program that replicates itself to spread to other computers.",
  },
  {
    order: 29, text: "The shortcut key to REFRESH a web page is:",
    options: ["F1", "F3", "F5", "F8"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "F5 refreshes (reloads) the current web page in most browsers.",
  },
  {
    order: 30, text: "Which function key is used to rename a file in Windows?",
    options: ["F1", "F2", "F3", "F4"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "F2 allows you to rename a selected file or folder in Windows.",
  },
  {
    order: 31, text: "Which company developed Windows operating system?",
    options: ["Apple", "Google", "Microsoft", "IBM"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Microsoft Corporation, founded by Bill Gates and Paul Allen, developed the Windows operating system.",
  },
  {
    order: 32, text: "The full form of PDF is:",
    options: [
      "Portable Document Format",
      "Public Document File",
      "Personal Data Format",
      "Portable Data File",
    ],
    correctIndex: 0, difficulty: "EASY",
    explanation: "PDF stands for Portable Document Format — created by Adobe Systems.",
  },
  {
    order: 33, text: "Which shortcut selects to the beginning of the line in MS Word?",
    options: ["Ctrl+Home", "Home", "Shift+Home", "Ctrl+Left"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Shift+Home selects from the cursor position to the beginning of the current line.",
  },
  {
    order: 34, text: "The shortcut key to CLOSE a window in Windows is:",
    options: ["Alt+F3", "Alt+F4", "Ctrl+F4", "Ctrl+W"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Alt+F4 closes the currently active window or application.",
  },
  {
    order: 35, text: "Email stands for:",
    options: ["Effective Mail", "Electronic Mail", "Express Mail", "Emergency Mail"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Email stands for Electronic Mail — a method of exchanging digital messages.",
  },
  {
    order: 36, text: "Which protocol is used to send emails?",
    options: ["HTTP", "FTP", "SMTP", "POP3"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "SMTP (Simple Mail Transfer Protocol) is used to send emails. POP3/IMAP are used to receive them.",
  },
  {
    order: 37, text: "The shortcut to take a screenshot in Windows 10 and 11 is:",
    options: ["Alt+Print Screen", "Ctrl+Print Screen", "Windows+Shift+S", "Windows+S"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Windows+Shift+S opens the Snipping Tool for screen capture in Windows 10/11.",
  },
  {
    order: 38, text: "In MS Excel, which function adds a range of cells?",
    options: ["ADD()", "TOTAL()", "SUM()", "COUNT()"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "SUM() is the Excel function used to add a range of values, e.g., =SUM(A1:A10).",
  },
  {
    order: 39, text: "Which MS Excel function counts non-empty cells?",
    options: ["SUM()", "COUNT()", "COUNTA()", "AVERAGE()"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "COUNTA() counts the number of non-empty cells in a range. COUNT() only counts numeric cells.",
  },
  {
    order: 40, text: "A file that has been deleted in Windows goes to:",
    options: ["Downloads", "Recycle Bin", "Temp folder", "Desktop"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Deleted files are moved to the Recycle Bin in Windows, from where they can be restored or permanently deleted.",
  },
  {
    order: 41, text: "The maximum zoom percentage in MS Word is:",
    options: ["200%", "400%", "500%", "1000%"],
    correctIndex: 0, difficulty: "HARD",
    explanation: "In most versions of MS Word, the maximum zoom level available from the slider is 500% however the standard UI limit commonly tested is 200%. Note: verify your Word version.",
  },
  {
    order: 42, text: "What is the default file extension of MS PowerPoint 2010 and above?",
    options: [".ppt", ".pptx", ".pps", ".ppsx"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "The default PowerPoint (2007+) file extension is .pptx.",
  },
  {
    order: 43, text: "Which shortcut switches between open applications in Windows?",
    options: ["Ctrl+Tab", "Alt+Tab", "Windows+Tab", "Ctrl+Alt"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Alt+Tab cycles through open applications and windows in Windows.",
  },
  {
    order: 44, text: "USB stands for:",
    options: [
      "Universal Serial Bus",
      "Universal System Bus",
      "Universal Standard Bus",
      "User Serial Bus",
    ],
    correctIndex: 0, difficulty: "EASY",
    explanation: "USB stands for Universal Serial Bus — a standard interface for connecting peripheral devices.",
  },
  {
    order: 45, text: "Which of the following is NOT a web browser?",
    options: ["Google Chrome", "Mozilla Firefox", "Apache", "Microsoft Edge"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Apache is a web server software, not a browser. Chrome, Firefox, and Edge are web browsers.",
  },
  {
    order: 46, text: "What does 'HTTPS' stand for?",
    options: [
      "Hypertext Transfer Protocol Secure",
      "High Transfer Text Protocol Secure",
      "Hypertext Transmission Protocol Simple",
      "Hypertext Transfer Protocol Simple",
    ],
    correctIndex: 0, difficulty: "MEDIUM",
    explanation: "HTTPS — HyperText Transfer Protocol Secure — is an encrypted version of HTTP.",
  },
  {
    order: 47, text: "Which part of a computer permanently stores the OS and data?",
    options: ["RAM", "Cache", "ROM", "Hard Disk/SSD"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "A Hard Disk Drive (HDD) or Solid State Drive (SSD) permanently stores the OS, applications, and user files.",
  },
  {
    order: 48, text: "The shortcut key for SPELL CHECK in MS Word is:",
    options: ["F5", "F7", "F9", "F11"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "F7 opens the Spelling and Grammar checker in MS Word.",
  },
  {
    order: 49, text: "Which MS Office tool is used to create presentations?",
    options: ["MS Word", "MS Access", "MS PowerPoint", "MS Outlook"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "MS PowerPoint is used to create slideshows and presentations.",
  },
  {
    order: 50, text: "Which network device connects two different networks?",
    options: ["Hub", "Switch", "Router", "Bridge"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "A router connects multiple networks and directs data packets between them (e.g., your home network to the internet).",
  },
];

// ─────────────────────────────────────────────
// SUBJECT 5 — ISLAMIC STUDIES (50 MCQs)
// ─────────────────────────────────────────────

const islamicStudiesMCQs: MCQ[] = [
  {
    order: 1, text: "Who has the nickname 'Sahib-us-Sirr' (Keeper of the Secret)?",
    options: [
      "Hazrat Abu Bakr (RA)",
      "Hazrat Umar (RA)",
      "Hazrat Hudhaifa ibn al-Yaman (RA)",
      "Hazrat Ali (RA)",
    ],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Hazrat Hudhaifa ibn al-Yaman (RA) was entrusted with the names of the hypocrites by the Prophet ﷺ and thus given the title Sahib-us-Sirr.",
  },
  {
    order: 2, text: "The Battle of Uhud was fought in:",
    options: ["623 AH", "624 AH", "625 AD (3 AH)", "626 AD"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Battle of Uhud took place in the month of Shawwal, 3 AH (625 AD).",
  },
  {
    order: 3, text: "Riyadh-ul-Jannah is part of which mosque?",
    options: ["Masjid al-Haram", "Masjid al-Aqsa", "Masjid Quba", "Masjid-e-Nabawi"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Riyadh-ul-Jannah (Garden of Paradise) is the blessed area between the Prophet's ﷺ grave and his pulpit in Masjid-e-Nabawi, Madinah.",
  },
  {
    order: 4, text: "Which companion of the Holy Prophet ﷺ is known as 'Tarjuman-ul-Quran'?",
    options: [
      "Hazrat Umar (RA)",
      "Hazrat Abdullah ibn Masood (RA)",
      "Hazrat Abdullah ibn Abbas (RA)",
      "Hazrat Anas (RA)",
    ],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Hazrat Abdullah ibn Abbas (RA) is known as Tarjuman-ul-Quran (Interpreter of the Quran) because of his deep knowledge of Quranic exegesis.",
  },
  {
    order: 5, text: "In which Hijri year was the Qibla changed?",
    options: ["1 AH", "2 AH", "3 AH", "5 AH"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "The Qibla was changed from Masjid al-Aqsa (Jerusalem) to the Kaaba (Makkah) in 2 AH (624 AD).",
  },
  {
    order: 6, text: "When did the Conquest of Makkah (Fatah Makkah) take place?",
    options: ["6 AH", "7 AH", "8 AH", "10 AH"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Conquest of Makkah took place in Ramadan, 8 AH (630 AD).",
  },
  {
    order: 7, text: "A battle in which the Holy Prophet ﷺ did not participate is known as:",
    options: ["Ghazwa", "Sariyya", "Jihad", "Fatah"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "A Sariyya (also called Sareya) is a military expedition in which the Prophet ﷺ did not participate personally. A Ghazwa is one in which he did participate.",
  },
  {
    order: 8, text: "The first Wahi (revelation) was revealed to the Prophet ﷺ in:",
    options: ["Masjid-e-Nabawi", "Cave Thawr", "Cave Hira", "Mina"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The first revelation was revealed to the Prophet Muhammad ﷺ in the Cave of Hira on Jabal al-Noor, near Makkah.",
  },
  {
    order: 9, text: "The Holy Quran was compiled in book form during the caliphate of:",
    options: [
      "Hazrat Abu Bakr (RA)",
      "Hazrat Umar (RA)",
      "Hazrat Uthman (RA)",
      "Hazrat Ali (RA)",
    ],
    correctIndex: 0, difficulty: "MEDIUM",
    explanation: "The Holy Quran was first compiled into a single book (mushaf) during the caliphate of Hazrat Abu Bakr (RA), following the Battle of Yamama.",
  },
  {
    order: 10, text: "The standardized copy of the Quran was prepared and distributed during:",
    options: [
      "Abu Bakr (RA)",
      "Umar (RA)",
      "Uthman (RA)",
      "Ali (RA)",
    ],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Hazrat Uthman (RA) standardized and distributed official copies of the Quran to prevent regional variations.",
  },
  {
    order: 11, text: "The number of Surahs in the Holy Quran is:",
    options: ["112", "113", "114", "115"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Holy Quran contains 114 Surahs (chapters).",
  },
  {
    order: 12, text: "The longest Surah in the Quran is:",
    options: ["Surah Al-Imran", "Surah Al-Nisa", "Surah Al-Baqarah", "Surah Al-Maidah"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Surah Al-Baqarah (Chapter 2) is the longest Surah in the Quran with 286 verses.",
  },
  {
    order: 13, text: "The shortest Surah in the Quran is:",
    options: ["Surah Al-Fatiha", "Surah Al-Ikhlas", "Surah Al-Kawthar", "Surah Al-Falaq"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Surah Al-Kawthar (Chapter 108) is the shortest Surah, with only 3 verses.",
  },
  {
    order: 14, text: "Total number of Ayahs (verses) in the Holy Quran is:",
    options: ["6236", "6344", "6226", "6666"],
    correctIndex: 0, difficulty: "HARD",
    explanation: "The Holy Quran contains 6,236 verses (ayahs) according to the most widely accepted count.",
  },
  {
    order: 15, text: "How many Fard (obligatory) prayers are there in a day?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "There are 5 obligatory (Fard) prayers in Islam: Fajr, Dhuhr, Asr, Maghrib, and Isha.",
  },
  {
    order: 16, text: "Zakat is obligatory on which nisab of gold?",
    options: ["5 tola", "7.5 tola", "10 tola", "12 tola"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Zakat becomes obligatory when gold reaches the nisab of 7.5 tola (approximately 87.48 grams).",
  },
  {
    order: 17, text: "The first Caliph of Islam was:",
    options: ["Hazrat Ali (RA)", "Hazrat Umar (RA)", "Hazrat Uthman (RA)", "Hazrat Abu Bakr (RA)"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Hazrat Abu Bakr Siddiq (RA) was the first Caliph (Khalifa) of Islam (632–634 AD).",
  },
  {
    order: 18, text: "The last Prophet of Islam is:",
    options: ["Hazrat Isa (AS)", "Hazrat Musa (AS)", "Hazrat Ibrahim (AS)", "Hazrat Muhammad (ﷺ)"],
    correctIndex: 3, difficulty: "EASY",
    explanation: "Hazrat Muhammad ﷺ is the last and final Prophet (Khatam-ul-Anbiya) of Islam.",
  },
  {
    order: 19, text: "The Holy Prophet ﷺ was born in which year (AD)?",
    options: ["569 AD", "570 AD", "571 AD", "572 AD"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "The Holy Prophet Muhammad ﷺ was born in 570 AD (commonly accepted date) in Makkah.",
  },
  {
    order: 20, text: "The Hijra (migration) from Makkah to Madinah took place in:",
    options: ["610 AD", "615 AD", "622 AD", "630 AD"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Hijra took place in 622 AD — this event marks the beginning of the Islamic Hijri calendar.",
  },
  {
    order: 21, text: "The first mosque built in Islam is:",
    options: ["Masjid al-Haram", "Masjid al-Aqsa", "Masjid al-Nabawi", "Masjid Quba"],
    correctIndex: 3, difficulty: "MEDIUM",
    explanation: "Masjid Quba was the first mosque built in Islam, constructed by the Prophet ﷺ upon arriving in Madinah in 622 AD.",
  },
  {
    order: 22, text: "Hajj is obligatory once in a lifetime for those who are:",
    options: ["Rich only", "Physically and financially able", "Above 40 years old", "Males only"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Hajj is obligatory (Fard) once in a lifetime for every Muslim who is physically and financially capable.",
  },
  {
    order: 23, text: "The first month of the Islamic calendar is:",
    options: ["Rajab", "Muharram", "Ramadan", "Safar"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Muharram is the first month of the Islamic Hijri calendar.",
  },
  {
    order: 24, text: "Laylat-ul-Qadr (The Night of Power) is in:",
    options: ["First 10 days of Ramadan", "Middle 10 days", "Last 10 odd nights of Ramadan", "Shawwal"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Laylat-ul-Qadr is among the last 10 odd nights of Ramadan (21st, 23rd, 25th, 27th, or 29th night).",
  },
  {
    order: 25, text: "Surah Al-Fatiha has how many verses?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Surah Al-Fatiha contains 7 verses (ayahs). It is also known as 'Umm-ul-Quran'.",
  },
  {
    order: 26, text: "The Treaty of Hudaybiyyah was signed in:",
    options: ["4 AH", "5 AH", "6 AH", "8 AH"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "The Treaty of Hudaybiyyah was signed in 6 AH (628 AD) between the Muslims and the Quraysh of Makkah.",
  },
  {
    order: 27, text: "Which angel is responsible for bringing revelation?",
    options: ["Israfil (AS)", "Mikail (AS)", "Jibrael (AS)", "Izraeel (AS)"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Hazrat Jibrael (AS) — also known as the Angel Gabriel — was responsible for delivering Allah's revelation to the Prophets.",
  },
  {
    order: 28, text: "How many Pillars of Islam are there?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "There are 5 Pillars of Islam: Shahada, Salah (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage).",
  },
  {
    order: 29, text: "Surah Yaseen is known as the heart of the Quran. It is Surah number:",
    options: ["34", "36", "38", "40"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Surah Yaseen is the 36th Surah of the Quran and is commonly referred to as the 'heart of the Quran' based on Hadith.",
  },
  {
    order: 30, text: "What is the meaning of 'Islam'?",
    options: ["Peace", "Submission to Allah", "Faith", "Worship"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "The word 'Islam' comes from the Arabic root 'slm' meaning submission and peace — submission to the will of Allah.",
  },
  {
    order: 31, text: "Hazrat Khadijah (RA) was the Prophet's ﷺ wife for how many years?",
    options: ["20 years", "22 years", "25 years", "30 years"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "Hazrat Khadijah (RA) married the Prophet ﷺ when he was 25 and she was 40. She passed away when he was 50 — so approximately 25 years.",
  },
  {
    order: 32, text: "The Quran was revealed over a period of:",
    options: ["13 years", "20 years", "23 years", "25 years"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Quran was revealed gradually over approximately 23 years — 13 years in Makkah and 10 years in Madinah.",
  },
  {
    order: 33, text: "The Prophet ﷺ was called 'Al-Ameen' (The Trustworthy) by the people of Makkah. At what age did he receive this title?",
    options: ["15", "20", "25", "30"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "The Prophet ﷺ was widely known as 'Al-Ameen' (Trustworthy) from a young age; he was approximately 25 when the title was widely recognized around the time of his marriage to Khadijah (RA).",
  },
  {
    order: 34, text: "Which is the first pillar of Islam?",
    options: ["Salah", "Zakat", "Shahadah", "Sawm"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The Shahadah (declaration of faith — 'There is no god but Allah, and Muhammad ﷺ is His messenger') is the first pillar of Islam.",
  },
  {
    order: 35, text: "The Battle of Badr was fought in:",
    options: ["1 AH", "2 AH", "3 AH", "4 AH"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "The Battle of Badr, the first major battle in Islam, was fought in Ramadan, 2 AH (624 AD).",
  },
  {
    order: 36, text: "Who was the first martyr (Shaheed) in Islam?",
    options: ["Hazrat Hamza (RA)", "Hazrat Bilal (RA)", "Hazrat Sumayyah (RA)", "Hazrat Yasir (RA)"],
    correctIndex: 2, difficulty: "MEDIUM",
    explanation: "Hazrat Sumayyah bint Khayyat (RA) is recognised as the first martyr in Islam, killed by Abu Jahl for refusing to renounce her faith.",
  },
  {
    order: 37, text: "The word 'Quran' means:",
    options: ["Holy Book", "That which is often recited", "Divine Word", "Final Revelation"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "The word 'Quran' comes from the Arabic root 'qara'a' meaning 'to read' or 'to recite' — it means 'that which is often recited'.",
  },
  {
    order: 38, text: "Which Surah does not begin with 'Bismillah'?",
    options: ["Surah Al-Fatiha", "Surah Al-Tawbah", "Surah Al-Ikhlas", "Surah Al-Nas"],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Surah Al-Tawbah (Surah 9) is the only Surah that does not begin with Bismillah-ir-Rahman-ir-Raheem.",
  },
  {
    order: 39, text: "How many Surahs are in Makki revelation?",
    options: ["84", "86", "86", "82"],
    correctIndex: 1, difficulty: "HARD",
    explanation: "86 Surahs are classified as Makki (revealed in Makkah), and 28 are Madani (revealed in Madinah).",
  },
  {
    order: 40, text: "Masjid al-Aqsa is located in:",
    options: ["Makkah", "Madinah", "Jerusalem", "Baghdad"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Masjid al-Aqsa — Islam's third holiest mosque — is located in Jerusalem (Al-Quds).",
  },
  {
    order: 41, text: "The 'Isra wal Miraj' refers to the Prophet's ﷺ:",
    options: [
      "Migration to Madinah",
      "Night journey to Jerusalem and ascension to the heavens",
      "Battle of Badr",
      "Conquest of Makkah",
    ],
    correctIndex: 1, difficulty: "MEDIUM",
    explanation: "Isra (night journey from Makkah to Jerusalem) and Miraj (ascension through the heavens) took place in a single night.",
  },
  {
    order: 42, text: "How many Rukus (sections) are in the Holy Quran?",
    options: ["540", "556", "558", "540"],
    correctIndex: 0, difficulty: "HARD",
    explanation: "The Holy Quran is divided into 540 Rukus (sections indicated by the letter 'Ain' in the margins).",
  },
  {
    order: 43, text: "The Prophet ﷺ performed how many Hajj in his life?",
    options: ["One", "Two", "Three", "Four"],
    correctIndex: 0, difficulty: "MEDIUM",
    explanation: "The Prophet ﷺ performed only one Hajj — in 10 AH (632 AD) — known as Hajjat-ul-Wida (the Farewell Pilgrimage).",
  },
  {
    order: 44, text: "Abu Dharr al-Ghifari (RA) was the _____ person to embrace Islam.",
    options: ["3rd", "4th", "5th", "6th"],
    correctIndex: 2, difficulty: "HARD",
    explanation: "Hazrat Abu Dharr al-Ghifari (RA) is traditionally considered among the first 5 or 6 to embrace Islam.",
  },
  {
    order: 45, text: "Zakat is payable at the rate of:",
    options: ["1.5%", "2%", "2.5%", "5%"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Zakat is calculated at 2.5% of total savings and wealth held for one lunar year above the nisab threshold.",
  },
  {
    order: 46, text: "Hazrat Bilal (RA) was the first to give:",
    options: ["Khutbah", "Adhan", "Fatwa", "Tafseer"],
    correctIndex: 1, difficulty: "EASY",
    explanation: "Hazrat Bilal ibn Rabah (RA) was the first Muezzin in Islam, giving the Adhan (call to prayer).",
  },
  {
    order: 47, text: "Which month of the Islamic calendar is considered the most sacred?",
    options: ["Rajab", "Sha'ban", "Ramadan", "Dhul Hijjah"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "Ramadan is the holiest month in Islam — it is when the Quran was first revealed and fasting is obligatory.",
  },
  {
    order: 48, text: "The Day of Judgment is referred to in the Quran as:",
    options: ["Yawm-ul-Mizan", "Yawm-ul-Qiyamah", "Yawm-ul-Hisab", "All of these"],
    correctIndex: 3, difficulty: "HARD",
    explanation: "The Quran uses multiple names for the Day of Judgment — Yawm-ul-Qiyamah (Day of Resurrection), Yawm-ul-Hisab (Day of Reckoning), Yawm-ul-Mizan (Day of the Scale), and others.",
  },
  {
    order: 49, text: "The Holy Prophet ﷺ passed away on:",
    options: ["12 Rabi-ul-Awwal 11 AH", "10 Muharram 10 AH", "9 Dhul Hijjah 10 AH", "8 Ramadan 8 AH"],
    correctIndex: 0, difficulty: "MEDIUM",
    explanation: "The Holy Prophet Muhammad ﷺ passed away on 12 Rabi-ul-Awwal, 11 AH (632 AD) in Madinah.",
  },
  {
    order: 50, text: "The tomb of the Holy Prophet ﷺ is in:",
    options: ["Makkah", "Jerusalem", "Madinah", "Taif"],
    correctIndex: 2, difficulty: "EASY",
    explanation: "The tomb of the Holy Prophet ﷺ is located in Masjid-e-Nabawi in Madinah, Saudi Arabia.",
  },
];

// ─────────────────────────────────────────────
// TESTS CONFIGURATION
// Each subject gets 1 test of 50 questions each
// (expand to multiple tests by slicing the arrays)
// ─────────────────────────────────────────────

const testsConfig: Record<string, { questions: MCQ[]; number: number; title: string; difficulty: Difficulty; durationMin: number }[]> = {
  "english": [
    {
      number: 1,
      title: "English Test 1 — Synonyms, Antonyms & Grammar",
      questions: englishMCQs,
      difficulty: "MEDIUM",
      durationMin: 30,
    },
  ],
  "general-knowledge": [
    {
      number: 1,
      title: "General Knowledge Test 1 — Science, World Affairs & Current Affairs",
      questions: gkMCQs,
      difficulty: "MEDIUM",
      durationMin: 30,
    },
  ],
  "pakistan-studies": [
    {
      number: 1,
      title: "Pakistan Studies Test 1 — History, Geography & Constitution",
      questions: pakStudiesMCQs,
      difficulty: "MEDIUM",
      durationMin: 30,
    },
  ],
  "computer": [
    {
      number: 1,
      title: "Computer Test 1 — Basic IT, MS Office & Internet",
      questions: computerMCQs,
      difficulty: "EASY",
      durationMin: 25,
    },
  ],
  "islamic-studies": [
    {
      number: 1,
      title: "Islamic Studies Test 1 — Quran, Hadith, Seerah & Fiqh",
      questions: islamicStudiesMCQs,
      difficulty: "MEDIUM",
      durationMin: 30,
    },
  ],
};

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding FIA Job Prep database...\n");

  // 1. Create admin user
  const adminPassword = await bcrypt.hash("Admin@FIA2024!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@fiajobprep.com" },
    update: {},
    create: {
      email: "admin@fiajobprep.com",
      name: "Admin",
      passwordHash: adminPassword,
      mustChangePassword: false,
      isActive: true,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // 2. Create demo student
  const studentPassword = await bcrypt.hash("Demo@1234", 10);
  const demo = await prisma.user.upsert({
    where: { email: "demo@fiajobprep.com" },
    update: {},
    create: {
      email: "demo@fiajobprep.com",
      name: "Demo Student",
      passwordHash: studentPassword,
      mustChangePassword: true,
      isActive: true,
      role: "STUDENT",
    },
  });
  console.log(`✅ Demo student: ${demo.email} (password: Demo@1234)`);

  // 3. Create subjects and tests
  for (const subjectData of subjects) {
    const subject = await prisma.subject.upsert({
      where: { slug: subjectData.slug },
      update: { title: subjectData.title, description: subjectData.description, order: subjectData.order },
      create: subjectData,
    });
    console.log(`\n📚 Subject: ${subject.title}`);

    const tests = testsConfig[subject.slug] || [];

    for (const testData of tests) {
      const test = await prisma.test.upsert({
        where: { subjectId_number: { subjectId: subject.id, number: testData.number } },
        update: {
          title: testData.title,
          difficulty: testData.difficulty,
          durationMin: testData.durationMin,
        },
        create: {
          subjectId: subject.id,
          number: testData.number,
          title: testData.title,
          difficulty: testData.difficulty,
          durationMin: testData.durationMin,
          isPublished: true,
        },
      });

      // Delete existing questions for clean re-seed
      await prisma.question.deleteMany({ where: { testId: test.id } });

      // Create questions
      await prisma.question.createMany({
        data: testData.questions.map((q) => ({
          testId: test.id,
          order: q.order,
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        })),
      });

      console.log(`  📝 Test ${testData.number}: "${testData.title}" — ${testData.questions.length} MCQs seeded.`);
    }
  }

  console.log("\n✅ Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Summary:");
  console.log("  English:          50 MCQs (1 test)");
  console.log("  General Knowledge:50 MCQs (1 test)");
  console.log("  Pakistan Studies: 50 MCQs (1 test)");
  console.log("  Computer:         50 MCQs (1 test)");
  console.log("  Islamic Studies:  50 MCQs (1 test)");
  console.log("  ─────────────────────────────────");
  console.log("  TOTAL:           250 MCQs (5 tests)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
