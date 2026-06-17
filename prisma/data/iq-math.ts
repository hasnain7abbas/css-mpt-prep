// IQ & Mathematics datasets for the FIA "Intelligence / Mathematics / Analytical
// Reasoning" portion. Two kinds of data live here:
//   1. Raw numeric problem inputs (percentages, averages, ratios, interest, …).
//      The generator in ../generators.ts computes the answers + plausible
//      numeric distractors deterministically.
//   2. Curated reasoning MCQs (number series, analogies, coding–decoding, blood
//      relations, direction sense, logical word problems) where the distractors
//      are hand-picked.
import type { Curated } from "./gk-misc";

// ── Numeric problem inputs ───────────────────────────────────────────────────

// [percent, of] → asks "What is <percent>% of <of>?"  Inputs chosen so answers
// are whole numbers.
export const PERCENTS: [number, number][] = [
  [10, 250], [20, 150], [25, 80], [15, 200], [40, 90], [12, 50], [60, 45],
  [35, 120], [5, 180], [75, 64], [8, 250], [45, 80], [30, 300], [55, 60],
  [65, 40], [90, 70], [16, 75], [22, 50], [4, 350], [85, 40], [70, 90],
  [18, 150], [36, 25], [48, 75], [24, 125],
];

// Each inner array → "What is the average of these numbers?"
export const AVERAGE_SETS: number[][] = [
  [10, 20, 30], [12, 18, 24, 26], [5, 15, 25, 35, 45], [8, 16, 24, 32],
  [40, 50, 60], [11, 22, 33, 44], [100, 200, 300, 400], [7, 14, 21, 28, 35],
  [9, 18, 27], [2, 4, 6, 8, 10], [13, 17, 21, 25], [50, 60, 70, 80, 90],
  [6, 12, 18, 24, 30], [3, 6, 9, 12, 15], [15, 30, 45], [20, 40, 60, 80],
  [14, 28, 42], [1, 3, 5, 7, 9], [25, 50, 75, 100], [16, 24, 32, 40],
];

// [Principal, Rate%, Time(yrs)] → simple interest = P·R·T / 100.
export const SIMPLE_INTEREST: [number, number, number][] = [
  [1000, 5, 2], [2000, 10, 3], [5000, 4, 2], [1500, 8, 1], [4000, 6, 5],
  [2500, 12, 2], [800, 5, 4], [10000, 7, 1], [3000, 9, 2], [6000, 5, 3],
  [1200, 10, 5], [7500, 4, 2], [900, 8, 3], [5000, 6, 4], [2200, 5, 2],
  [3500, 10, 2], [1800, 5, 3], [12000, 8, 1], [640, 5, 5], [4500, 4, 4],
];

// [a, b] → "Simplify the ratio a : b" (reduced by GCD).
export const RATIO_PAIRS: [number, number][] = [
  [12, 18], [25, 35], [16, 24], [40, 100], [48, 60], [9, 27], [14, 21],
  [30, 45], [50, 75], [18, 24], [36, 54], [8, 32], [45, 60], [22, 33],
  [28, 42], [15, 35], [64, 80], [27, 36], [44, 66], [21, 49],
];

// [distance(km), time(hrs)] → "find the speed (km/h)".
export const SPEED_SETS: [number, number][] = [
  [120, 2], [150, 3], [240, 4], [100, 5], [360, 6], [90, 2], [200, 4],
  [300, 5], [180, 3], [80, 2], [420, 7], [160, 4], [250, 5], [144, 4],
  [210, 3], [60, 2], [480, 6], [350, 5], [132, 6], [275, 5],
];

// [a, b] → both LCM and HCF questions are generated for each pair.
export const NUM_PAIRS: [number, number][] = [
  [12, 18], [8, 12], [15, 20], [6, 9], [16, 24], [10, 25], [14, 21],
  [9, 12], [18, 27], [20, 30], [4, 6], [21, 28], [24, 36], [5, 15],
  [22, 33], [27, 36], [8, 20], [12, 16], [30, 45], [14, 35],
];

// Whole numbers → square and cube questions are generated for each.
export const BASE_NUMS: number[] = [
  3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 24, 25,
];

// Perfect squares → "find the square root".
export const PERFECT_SQUARES: number[] = [
  16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361,
  400, 441, 484, 529, 625, 729, 841, 900,
];

// BODMAS / simplification problems: [expression text, numeric answer].
export const SIMPLIFY: [string, number][] = [
  ["8 + 6 × 2", 20], ["(12 + 8) ÷ 4", 5], ["15 − 3 × 4", 3],
  ["20 ÷ 4 + 6", 11], ["7 × 3 − 5", 16], ["(9 + 6) × 2", 30],
  ["48 ÷ 6 + 2 × 3", 14], ["100 − 36 ÷ 6", 94], ["5 × 5 − 5 ÷ 5", 24],
  ["(18 − 6) ÷ 3 + 7", 11], ["2 × (3 + 4) × 2", 28], ["64 ÷ 8 ÷ 2", 4],
  ["3 × 4 + 5 × 2", 22], ["(25 − 10) × 2 ÷ 5", 6], ["9 + 9 ÷ 9 × 9", 18],
  ["40 − 5 × 4 + 2", 22], ["(7 + 3) × (8 − 5)", 30], ["12 × 12 ÷ 6", 24],
  ["50 ÷ (2 + 3)", 10], ["6 + 6 × 6 − 6", 36],
];

// [Cost Price, Selling Price] → profit/loss percentage is generated.
export const PROFIT_LOSS: [number, number][] = [
  [100, 120], [200, 250], [500, 450], [80, 100], [150, 120], [400, 500],
  [250, 200], [1000, 1200], [600, 540], [300, 360], [120, 90], [800, 1000],
  [50, 60], [900, 720], [160, 200],
];

// ── Curated reasoning MCQs ───────────────────────────────────────────────────

// Number / letter series — find the next (or missing) term.
export const SERIES: Curated[] = [
  { text: "Find the next number in the series: 2, 4, 8, 16, ?", options: ["18", "24", "32", "30"], correctIndex: 2, explanation: "Each term doubles: 16 × 2 = 32.", difficulty: "EASY" },
  { text: "Find the next number in the series: 3, 6, 9, 12, ?", options: ["13", "14", "15", "16"], correctIndex: 2, explanation: "An arithmetic series with common difference 3: 12 + 3 = 15.", difficulty: "EASY" },
  { text: "Find the next number: 1, 4, 9, 16, 25, ?", options: ["30", "36", "49", "35"], correctIndex: 1, explanation: "These are perfect squares (1², 2², …, 5²); next is 6² = 36.", difficulty: "EASY" },
  { text: "Find the next number: 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "15"], correctIndex: 2, explanation: "Fibonacci series — each term is the sum of the previous two: 5 + 8 = 13.", difficulty: "MEDIUM" },
  { text: "Find the next number: 5, 10, 20, 40, ?", options: ["50", "60", "70", "80"], correctIndex: 3, explanation: "Each term doubles: 40 × 2 = 80.", difficulty: "EASY" },
  { text: "Find the next number: 100, 90, 80, 70, ?", options: ["65", "60", "55", "50"], correctIndex: 1, explanation: "Decreasing arithmetic series with difference 10: 70 − 10 = 60.", difficulty: "EASY" },
  { text: "Find the next number: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "44"], correctIndex: 2, explanation: "Differences increase by 2 (4, 6, 8, 10, 12): 30 + 12 = 42.", difficulty: "MEDIUM" },
  { text: "Find the next number: 1, 8, 27, 64, ?", options: ["100", "125", "121", "144"], correctIndex: 1, explanation: "These are perfect cubes (1³, 2³, 3³, 4³); next is 5³ = 125.", difficulty: "MEDIUM" },
  { text: "Find the missing number: 7, 14, 28, ?, 112", options: ["42", "56", "63", "70"], correctIndex: 1, explanation: "Each term doubles: 28 × 2 = 56 (then 56 × 2 = 112).", difficulty: "EASY" },
  { text: "Find the next number: 3, 7, 15, 31, ?", options: ["47", "55", "63", "62"], correctIndex: 2, explanation: "Each term = previous × 2 + 1: 31 × 2 + 1 = 63.", difficulty: "HARD" },
  { text: "Find the next number: 0, 3, 8, 15, 24, ?", options: ["33", "35", "30", "36"], correctIndex: 1, explanation: "Terms are n² − 1 (for n = 1,2,3…): 6² − 1 = 35.", difficulty: "HARD" },
  { text: "Find the next number: 1, 2, 4, 7, 11, ?", options: ["14", "15", "16", "17"], correctIndex: 2, explanation: "Differences increase by 1 (1,2,3,4,5): 11 + 5 = 16.", difficulty: "MEDIUM" },
  { text: "Find the next number: 81, 27, 9, 3, ?", options: ["0", "1", "2", "3"], correctIndex: 1, explanation: "Each term is divided by 3: 3 ÷ 3 = 1.", difficulty: "MEDIUM" },
  { text: "Find the next letter in the series: A, C, E, G, ?", options: ["H", "I", "J", "K"], correctIndex: 1, explanation: "Skip one letter each time (A,_,C,_,E,_,G,_,I).", difficulty: "EASY" },
  { text: "Find the next letter: B, D, F, H, ?", options: ["I", "J", "K", "L"], correctIndex: 1, explanation: "Alternate letters of the alphabet; after H comes J.", difficulty: "EASY" },
  { text: "Find the next letter pair: AZ, BY, CX, ?", options: ["DV", "DW", "DX", "EW"], correctIndex: 1, explanation: "First letter moves forward (A,B,C,D), second moves backward (Z,Y,X,W) → DW.", difficulty: "MEDIUM" },
  { text: "Find the next number: 2, 3, 5, 7, 11, ?", options: ["12", "13", "14", "15"], correctIndex: 1, explanation: "These are consecutive prime numbers; the next prime after 11 is 13.", difficulty: "MEDIUM" },
  { text: "Find the odd one out: 3, 5, 7, 9, 11", options: ["3", "5", "9", "11"], correctIndex: 2, explanation: "All are prime except 9 (= 3 × 3).", difficulty: "MEDIUM" },
  { text: "Find the next number: 6, 11, 21, 36, ?", options: ["51", "56", "61", "46"], correctIndex: 1, explanation: "Differences increase by 5 (5,10,15,20): 36 + 20 = 56.", difficulty: "HARD" },
  { text: "Find the next number: 4, 9, 16, 25, ?", options: ["30", "36", "49", "42"], correctIndex: 1, explanation: "Squares of 2,3,4,5 …; next is 6² = 36.", difficulty: "EASY" },
];

export const CURATED_IQ: Curated[] = [
  // Analogies
  { text: "Hand is to Glove as Foot is to ___?", options: ["Sock", "Shoe", "Toe", "Leg"], correctIndex: 1, explanation: "A glove covers the hand as a shoe covers the foot.", difficulty: "EASY" },
  { text: "Doctor is to Hospital as Teacher is to ___?", options: ["Student", "Book", "School", "Class"], correctIndex: 2, explanation: "A doctor works in a hospital; a teacher works in a school.", difficulty: "EASY" },
  { text: "Bird is to Sky as Fish is to ___?", options: ["Net", "Water", "Boat", "Scale"], correctIndex: 1, explanation: "A bird moves through the sky; a fish moves through water.", difficulty: "EASY" },
  { text: "Pen is to Writer as Brush is to ___?", options: ["Paint", "Canvas", "Painter", "Colour"], correctIndex: 2, explanation: "A writer uses a pen; a painter uses a brush.", difficulty: "EASY" },
  { text: "Hot is to Cold as Up is to ___?", options: ["High", "Down", "Top", "Above"], correctIndex: 1, explanation: "These are antonym pairs: hot/cold, up/down.", difficulty: "EASY" },
  { text: "Day is to Night as Light is to ___?", options: ["Lamp", "Bright", "Darkness", "Sun"], correctIndex: 2, explanation: "Opposite pairs: day/night, light/darkness.", difficulty: "EASY" },
  { text: "Dog is to Puppy as Cat is to ___?", options: ["Cub", "Kitten", "Calf", "Foal"], correctIndex: 1, explanation: "A young dog is a puppy; a young cat is a kitten.", difficulty: "EASY" },
  { text: "Book is to Read as Food is to ___?", options: ["Cook", "Eat", "Taste", "Buy"], correctIndex: 1, explanation: "You read a book; you eat food.", difficulty: "EASY" },
  { text: "Clock is to Time as Thermometer is to ___?", options: ["Heat", "Temperature", "Weather", "Mercury"], correctIndex: 1, explanation: "A clock measures time; a thermometer measures temperature.", difficulty: "MEDIUM" },
  { text: "2 is to 8 as 3 is to ___? (cube relationship)", options: ["9", "18", "27", "12"], correctIndex: 2, explanation: "2³ = 8, so 3³ = 27.", difficulty: "MEDIUM" },

  // Odd one out
  { text: "Which one does NOT belong: Apple, Banana, Carrot, Mango?", options: ["Apple", "Banana", "Carrot", "Mango"], correctIndex: 2, explanation: "Carrot is a vegetable; the rest are fruits.", difficulty: "EASY" },
  { text: "Which one does NOT belong: Rose, Lily, Oak, Tulip?", options: ["Rose", "Lily", "Oak", "Tulip"], correctIndex: 2, explanation: "Oak is a tree; the others are flowers.", difficulty: "EASY" },
  { text: "Which is the odd one out: Triangle, Square, Circle, Rectangle?", options: ["Triangle", "Square", "Circle", "Rectangle"], correctIndex: 2, explanation: "A circle has no straight sides or corners; the others are polygons.", difficulty: "EASY" },
  { text: "Which is the odd one out: Copper, Iron, Gold, Plastic?", options: ["Copper", "Iron", "Gold", "Plastic"], correctIndex: 3, explanation: "Plastic is not a metal; the others are metals.", difficulty: "EASY" },
  { text: "Which is the odd one out: 64, 36, 49, 50?", options: ["64", "36", "49", "50"], correctIndex: 3, explanation: "64, 36 and 49 are perfect squares; 50 is not.", difficulty: "MEDIUM" },
  { text: "Which is the odd one out: Eye, Ear, Nose, Glove?", options: ["Eye", "Ear", "Nose", "Glove"], correctIndex: 3, explanation: "A glove is not a sense organ; the others are.", difficulty: "EASY" },

  // Coding – decoding
  { text: "If CAT is coded as DBU, how is DOG coded?", options: ["EPH", "EPG", "DPH", "FPH"], correctIndex: 0, explanation: "Each letter shifts forward by 1: D→E, O→P, G→H → EPH.", difficulty: "MEDIUM" },
  { text: "If 'RED' is coded as '18-5-4' (position in alphabet), how is 'BAD' coded?", options: ["2-1-4", "1-2-4", "2-4-1", "3-1-4"], correctIndex: 0, explanation: "B=2, A=1, D=4 → 2-1-4.", difficulty: "MEDIUM" },
  { text: "In a code, MOUSE is written as NPVTF. How is TABLE written?", options: ["UBCMF", "UBCNF", "SBCMF", "UACMF"], correctIndex: 0, explanation: "Each letter is shifted forward by 1: T→U, A→B, B→C, L→M, E→F.", difficulty: "MEDIUM" },
  { text: "If A = 1, B = 2 … then the sum of letters in 'CAB' equals?", options: ["6", "7", "8", "5"], correctIndex: 0, explanation: "C(3) + A(1) + B(2) = 6.", difficulty: "EASY" },
  { text: "If 'FACE' is coded as 'GBDF', the coding rule is:", options: ["+1 to each letter", "−1 to each letter", "reverse the word", "+2 to each letter"], correctIndex: 0, explanation: "F→G, A→B, C→D, E→F — each letter is shifted forward by 1.", difficulty: "MEDIUM" },

  // Blood relations
  { text: "Pointing to a photo, a man said, 'He is the son of my grandfather's only son.' How is the boy in the photo related to the man?", options: ["Father", "Brother", "Son", "Uncle"], correctIndex: 1, explanation: "The man's grandfather's only son is the man's own father; that father's son is the man's brother.", difficulty: "HARD" },
  { text: "A is the father of B. B is the son of C. How is C related to A?", options: ["Wife", "Sister", "Mother", "Daughter"], correctIndex: 0, explanation: "A and C are the parents of B; A is the father, so C is the wife (mother of B).", difficulty: "MEDIUM" },
  { text: "If P is the brother of Q, and Q is the mother of R, how is P related to R?", options: ["Father", "Uncle", "Brother", "Grandfather"], correctIndex: 1, explanation: "P is Q's brother and Q is R's mother, so P is R's (maternal) uncle.", difficulty: "MEDIUM" },
  { text: "X is the daughter of Y. Y is the wife of Z. How is Z related to X?", options: ["Brother", "Father", "Uncle", "Son"], correctIndex: 1, explanation: "Y is X's mother and Z is Y's husband, so Z is X's father.", difficulty: "EASY" },
  { text: "The son of my father's brother is my:", options: ["Brother", "Cousin", "Uncle", "Nephew"], correctIndex: 1, explanation: "Father's brother is your uncle; his son is your cousin.", difficulty: "EASY" },

  // Direction sense
  { text: "A man walks 5 km North, then turns right and walks 3 km. Which direction is he facing now?", options: ["North", "South", "East", "West"], correctIndex: 2, explanation: "Facing North and turning right makes you face East.", difficulty: "EASY" },
  { text: "Facing East, you turn 90° clockwise. Which direction do you face?", options: ["North", "South", "West", "East"], correctIndex: 1, explanation: "Turning 90° clockwise from East gives South.", difficulty: "EASY" },
  { text: "A boy walks 4 km East, then 3 km North. How far is he from the start (straight line)?", options: ["5 km", "7 km", "6 km", "4 km"], correctIndex: 0, explanation: "By Pythagoras: √(4² + 3²) = √25 = 5 km.", difficulty: "MEDIUM" },
  { text: "If you are facing South and turn 180°, which direction do you face?", options: ["East", "West", "North", "South"], correctIndex: 2, explanation: "A 180° turn reverses direction: South becomes North.", difficulty: "EASY" },
  { text: "Sunrise is in the East. In the early morning, your shadow falls toward the:", options: ["East", "West", "North", "South"], correctIndex: 1, explanation: "With the sun in the East, shadows are cast toward the West.", difficulty: "EASY" },

  // Logical / arithmetic word problems
  { text: "If 5 pencils cost Rs. 20, how much do 8 pencils cost?", options: ["Rs. 28", "Rs. 32", "Rs. 30", "Rs. 36"], correctIndex: 1, explanation: "One pencil costs Rs. 4, so 8 pencils cost 8 × 4 = Rs. 32.", difficulty: "EASY" },
  { text: "A train covers 60 km in 45 minutes. What is its speed in km/h?", options: ["75 km/h", "80 km/h", "90 km/h", "70 km/h"], correctIndex: 1, explanation: "45 min = 0.75 h; speed = 60 ÷ 0.75 = 80 km/h.", difficulty: "MEDIUM" },
  { text: "The sum of two numbers is 30 and their difference is 8. The larger number is:", options: ["17", "18", "19", "20"], correctIndex: 2, explanation: "Larger = (30 + 8) ÷ 2 = 19.", difficulty: "MEDIUM" },
  { text: "A father is 30 years older than his son. In 5 years, the father will be three times as old as the son. The son's present age is:", options: ["10", "12", "15", "8"], correctIndex: 0, explanation: "Let son = x. (x+30+5) = 3(x+5) → x+35 = 3x+15 → 2x = 20 → x = 10.", difficulty: "HARD" },
  { text: "If today is Monday, what day will it be after 61 days?", options: ["Friday", "Saturday", "Sunday", "Monday"], correctIndex: 1, explanation: "61 ÷ 7 leaves remainder 5; 5 days after Monday is Saturday.", difficulty: "MEDIUM" },
  { text: "A clock shows 3:00. What is the angle between the hour and minute hands?", options: ["60°", "90°", "120°", "45°"], correctIndex: 1, explanation: "At 3:00 the hands are 3 hours apart; 3 × 30° = 90°.", difficulty: "MEDIUM" },
  { text: "If 3 workers build a wall in 12 days, how many days will 6 workers take (same rate)?", options: ["4", "6", "8", "24"], correctIndex: 1, explanation: "More workers, less time: 3 × 12 ÷ 6 = 6 days.", difficulty: "MEDIUM" },
  { text: "A shopkeeper gives a 20% discount on an item marked Rs. 500. The sale price is:", options: ["Rs. 380", "Rs. 400", "Rs. 420", "Rs. 450"], correctIndex: 1, explanation: "20% of 500 = 100; 500 − 100 = Rs. 400.", difficulty: "EASY" },
  { text: "Half of one-third of a number is 25. The number is:", options: ["100", "120", "150", "75"], correctIndex: 2, explanation: "(1/2)(1/3)x = 25 → x/6 = 25 → x = 150.", difficulty: "MEDIUM" },
  { text: "The next number that is divisible by both 6 and 8 after 24 is:", options: ["30", "36", "48", "40"], correctIndex: 2, explanation: "The LCM of 6 and 8 is 24; the next common multiple is 48.", difficulty: "MEDIUM" },
  { text: "If 25% of a number is 75, the number is:", options: ["150", "200", "250", "300"], correctIndex: 3, explanation: "If 25% = 75, then 100% = 75 × 4 = 300.", difficulty: "EASY" },
  { text: "A bag has 3 red and 2 blue balls. The probability of drawing a red ball is:", options: ["2/5", "3/5", "1/2", "1/5"], correctIndex: 1, explanation: "3 red out of 5 total → 3/5.", difficulty: "MEDIUM" },
  { text: "The average of 10, 20 and x is 20. The value of x is:", options: ["20", "25", "30", "15"], correctIndex: 2, explanation: "(10 + 20 + x) ÷ 3 = 20 → 30 + x = 60 → x = 30.", difficulty: "EASY" },
  { text: "How many times do the hands of a clock overlap in 24 hours?", options: ["20", "22", "24", "12"], correctIndex: 1, explanation: "The hands overlap 11 times every 12 hours → 22 times in 24 hours.", difficulty: "HARD" },
  { text: "If the day before yesterday was Wednesday, what day is tomorrow?", options: ["Friday", "Saturday", "Sunday", "Thursday"], correctIndex: 1, explanation: "Day before yesterday = Wed → yesterday Thu, today Fri, tomorrow Saturday.", difficulty: "MEDIUM" },
];
