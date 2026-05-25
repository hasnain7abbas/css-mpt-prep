import type { Curated } from "./gk-misc";

// [province/region, provincial capital]
export const PROVINCE_CAPITALS: [string, string][] = [
  ["Punjab", "Lahore"],
  ["Sindh", "Karachi"],
  ["Khyber Pakhtunkhwa", "Peshawar"],
  ["Balochistan", "Quetta"],
  ["Gilgit-Baltistan", "Gilgit"],
  ["Azad Jammu and Kashmir", "Muzaffarabad"],
];

// [dam, river it is built on]
export const DAMS: [string, string][] = [
  ["Tarbela Dam", "Indus"],
  ["Mangla Dam", "Jhelum"],
  ["Warsak Dam", "Kabul"],
  ["Ghazi Barotha", "Indus"],
  ["Diamer-Bhasha Dam", "Indus"],
];

export const CURATED_PAK: Curated[] = [
  { text: "In which year did Pakistan come into being?", options: ["1940", "1945", "1947", "1956"], correctIndex: 2, explanation: "Pakistan gained independence on 14 August 1947.", difficulty: "EASY" },
  { text: "Who was the first Governor-General of Pakistan?", options: ["Liaquat Ali Khan", "Quaid-e-Azam Muhammad Ali Jinnah", "Khawaja Nazimuddin", "Iskander Mirza"], correctIndex: 1, explanation: "Quaid-e-Azam Muhammad Ali Jinnah was the first Governor-General (1947–1948).", difficulty: "EASY" },
  { text: "Who was the first Prime Minister of Pakistan?", options: ["Quaid-e-Azam", "Liaquat Ali Khan", "Muhammad Ali Bogra", "Khawaja Nazimuddin"], correctIndex: 1, explanation: "Liaquat Ali Khan was Pakistan's first Prime Minister.", difficulty: "EASY" },
  { text: "When was the Pakistan Resolution passed?", options: ["23 March 1940", "14 August 1947", "23 March 1956", "25 December 1940"], correctIndex: 0, explanation: "The Pakistan (Lahore) Resolution was passed on 23 March 1940.", difficulty: "EASY" },
  { text: "How many provinces does Pakistan currently have?", options: ["3", "4", "5", "6"], correctIndex: 1, explanation: "Pakistan has four provinces: Punjab, Sindh, KPK, and Balochistan.", difficulty: "EASY" },
  { text: "The national language of Pakistan is:", options: ["Punjabi", "Sindhi", "Urdu", "Pashto"], correctIndex: 2, explanation: "Urdu is the national language of Pakistan per Article 251.", difficulty: "EASY" },
  { text: "When was Pakistan's current (1973) Constitution enforced?", options: ["1956", "1962", "1973", "1985"], correctIndex: 2, explanation: "The 1973 Constitution came into effect on 14 August 1973.", difficulty: "EASY" },
  { text: "Pakistan conducted its nuclear tests in which year?", options: ["1974", "1988", "1998", "2002"], correctIndex: 2, explanation: "Pakistan conducted nuclear tests at Chagai on 28 May 1998.", difficulty: "MEDIUM" },
  { text: "K2, the second highest mountain on Earth, lies in which range?", options: ["Himalaya", "Hindu Kush", "Karakoram", "Sulaiman"], correctIndex: 2, explanation: "K2 lies in the Karakoram Range in Gilgit-Baltistan.", difficulty: "EASY" },
  { text: "The Indus Waters Treaty (1960) was brokered by:", options: ["United Nations", "World Bank", "United States", "United Kingdom"], correctIndex: 1, explanation: "The World Bank brokered the Indus Waters Treaty between Pakistan and India.", difficulty: "MEDIUM" },
  { text: "Gwadar Port is located in which province?", options: ["Sindh", "Balochistan", "Punjab", "KPK"], correctIndex: 1, explanation: "Gwadar deep-sea port is in Balochistan.", difficulty: "EASY" },
  { text: "The Durand Line is the border between Pakistan and:", options: ["India", "Iran", "Afghanistan", "China"], correctIndex: 2, explanation: "The Durand Line (1893) is the Pakistan–Afghanistan border.", difficulty: "EASY" },
  { text: "Who designed the national flag of Pakistan?", options: ["Amin-ud-Din Ahmad", "Ameer-ud-Din Kidwai", "Hafeez Jalandhari", "Sadequain"], correctIndex: 1, explanation: "The flag of Pakistan was designed by Ameer-ud-Din Kidwai.", difficulty: "HARD" },
  { text: "Who wrote the national anthem of Pakistan?", options: ["Allama Iqbal", "Hafeez Jalandhari", "Faiz Ahmed Faiz", "Ahmed Faraz"], correctIndex: 1, explanation: "The national anthem was written by Hafeez Jalandhari.", difficulty: "MEDIUM" },
  { text: "The national flower of Pakistan is:", options: ["Rose", "Jasmine", "Tulip", "Marigold"], correctIndex: 1, explanation: "Jasmine (Chambeli) is the national flower.", difficulty: "EASY" },
  { text: "The national animal of Pakistan is:", options: ["Lion", "Markhor", "Chinkara", "Snow leopard"], correctIndex: 1, explanation: "The Markhor is the national animal of Pakistan.", difficulty: "MEDIUM" },
  { text: "The national bird of Pakistan is:", options: ["Eagle", "Chukar Partridge", "Peacock", "Falcon"], correctIndex: 1, explanation: "The Chukar Partridge (Chakor) is the national bird.", difficulty: "MEDIUM" },
  { text: "The Objectives Resolution was passed in:", options: ["1947", "1949", "1956", "1973"], correctIndex: 1, explanation: "The Objectives Resolution was passed on 12 March 1949.", difficulty: "MEDIUM" },
  { text: "Who was the first female Prime Minister of Pakistan?", options: ["Fatima Jinnah", "Benazir Bhutto", "Begum Nusrat Bhutto", "Hina Rabbani Khar"], correctIndex: 1, explanation: "Benazir Bhutto became the first female PM in 1988.", difficulty: "EASY" },
  { text: "Mohenjo-daro, an Indus Valley site, is in which province?", options: ["Punjab", "Sindh", "Balochistan", "KPK"], correctIndex: 1, explanation: "Mohenjo-daro is in Larkana District, Sindh.", difficulty: "MEDIUM" },
  { text: "The Khyber Pass connects Pakistan with:", options: ["Iran", "China", "Afghanistan", "India"], correctIndex: 2, explanation: "The Khyber Pass connects Pakistan to Afghanistan.", difficulty: "EASY" },
  { text: "Which is the largest province of Pakistan by area?", options: ["Punjab", "Sindh", "Balochistan", "KPK"], correctIndex: 2, explanation: "Balochistan is the largest province by area.", difficulty: "EASY" },
  { text: "Which is the most populous province of Pakistan?", options: ["Sindh", "Punjab", "KPK", "Balochistan"], correctIndex: 1, explanation: "Punjab is the most populous province.", difficulty: "EASY" },
  { text: "Allama Iqbal presented the idea of a separate Muslim state in his address at:", options: ["Lahore", "Allahabad", "Karachi", "Delhi"], correctIndex: 1, explanation: "Iqbal's 1930 Allahabad Address outlined the idea of a separate Muslim state.", difficulty: "MEDIUM" },
  { text: "CPEC stands for:", options: ["China-Pakistan Economic Corridor", "Central Pakistan Energy Commission", "China-Pakistan Electric Cooperation", "Continental Pacific Economic Council"], correctIndex: 0, explanation: "CPEC is the China-Pakistan Economic Corridor.", difficulty: "EASY" },
];
