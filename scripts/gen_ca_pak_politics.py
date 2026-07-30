import json, os

W = "en.wikipedia.org"
D = "dawn.com"
T = "tribune.com.pk"
AN = "arabnews.pk"
ANC = "arabnews.com"
NAT = "nation.com.pk"
CN = "constitutionnet.org"

Q = []


def q(text, ans, dis, expl, diff, src=None):
    Q.append({"text": text, "ans": ans, "dis": dis, "expl": expl, "diff": diff, "src": src})


# ---------------- 2024 general election ----------------
q("On what date was the general election for Pakistan's National Assembly held in 2024?",
  "8 February 2024", ["8 February 2023", "28 January 2024", "10 March 2024"],
  "The Election Commission of Pakistan held the general election for the National Assembly and the four provincial assemblies on 8 February 2024.",
  "EASY")

q("How many directly elected general seats of Pakistan's National Assembly were contested in the 2024 general election?",
  "266", ["272", "336", "342"],
  "The National Assembly has 266 general seats filled by direct election; the remaining 70 are reserved for women and non-Muslims.",
  "MEDIUM")

q("How many National Assembly general seats did the Pakistan Muslim League (N) win in the 2024 general election?",
  "75", ["54", "93", "63"],
  "PML-N took 75 general seats, the largest tally won under a party symbol, while PTI-backed candidates contested as independents.",
  "MEDIUM")

q("How many National Assembly general seats did the Pakistan Peoples Party win in the 2024 general election?",
  "54", ["75", "93", "17"],
  "The PPP won 54 general seats and joined the PML-N-led coalition government formed after the election.",
  "MEDIUM")

q("Which electoral symbol was Pakistan Tehreek-e-Insaf denied for the 2024 general election after a Supreme Court ruling in January 2024?",
  "Bat", ["Arrow", "Tiger", "Bicycle"],
  "On 13 January 2024 the Supreme Court set aside the Peshawar High Court order and restored the ECP decision withdrawing the bat symbol over defective intra-party elections.",
  "EASY")

q("After the 2024 general election, most PTI-backed independent members of the National Assembly joined which party?",
  "Sunni Ittehad Council", ["Jamaat-e-Islami", "Majlis Wahdat-e-Muslimeen", "Pakistan Awami Tehreek"],
  "Having contested as independents, PTI-backed winners joined the Sunni Ittehad Council in order to claim reserved seats.",
  "MEDIUM")

# ---------------- Executive ----------------
q("How many votes did Shehbaz Sharif secure when the National Assembly elected him Prime Minister on 3 March 2024?",
  "201", ["174", "224", "190"],
  "Shehbaz Sharif polled 201 votes against 92 for his rival, comfortably above the 169 needed for a majority.",
  "MEDIUM")

q("Who was the rival candidate defeated by Shehbaz Sharif in the March 2024 election for Prime Minister?",
  "Omar Ayub Khan", ["Mahmood Khan Achakzai", "Bilawal Bhutto Zardari", "Shah Mehmood Qureshi"],
  "Omar Ayub Khan was the joint candidate of the PTI-backed Sunni Ittehad Council and received 92 votes.",
  "EASY")

q("Who won Pakistan's presidential election held on 9 March 2024?",
  "Asif Ali Zardari", ["Arif Alvi", "Mahmood Khan Achakzai", "Yousaf Raza Gillani"],
  "Asif Ali Zardari of the PPP secured 411 electoral votes to win a second, non-consecutive term as President.",
  "EASY")

q("Who was the opposition-backed candidate in Pakistan's 2024 presidential election?",
  "Mahmood Khan Achakzai", ["Omar Ayub Khan", "Gohar Ali Khan", "Sahibzada Hamid Raza"],
  "The PTI-backed Sunni Ittehad Council nominated PkMAP chief Mahmood Khan Achakzai, who lost to Asif Ali Zardari.",
  "MEDIUM")

q("Asif Ali Zardari, elected in March 2024, is which numbered President of Pakistan?",
  "14th", ["12th", "13th", "15th"],
  "Zardari became the 14th President of Pakistan and the first civilian to be elected to the office twice.",
  "MEDIUM")

q("Who was appointed Deputy Prime Minister of Pakistan in April 2024?",
  "Ishaq Dar", ["Khawaja Asif", "Ahsan Iqbal", "Mohsin Naqvi"],
  "Foreign Minister Ishaq Dar was given the additional charge of Deputy Prime Minister in late April 2024.",
  "MEDIUM")

q("Who presented Pakistan's federal budget for 2026-27 in the National Assembly?",
  "Muhammad Aurangzeb", ["Ishaq Dar", "Shamshad Akhtar", "Miftah Ismail"],
  "Finance Minister Muhammad Aurangzeb presented the 2026-27 federal budget on 12 June 2026.",
  "EASY", D)

# ---------------- Parliament offices ----------------
q("Who was elected Speaker of Pakistan's National Assembly in March 2024?",
  "Sardar Ayaz Sadiq", ["Raja Pervaiz Ashraf", "Asad Qaiser", "Amir Dogar"],
  "PML-N's Sardar Ayaz Sadiq was elected Speaker on 1 March 2024, returning to an office he had held before.",
  "EASY")

q("Who was elected Deputy Speaker of Pakistan's National Assembly in March 2024?",
  "Syed Ghulam Mustafa Shah", ["Zahid Akram Durrani", "Qasim Suri", "Syedaal Khan Nasar"],
  "The PPP's Syed Ghulam Mustafa Shah was elected Deputy Speaker alongside Speaker Ayaz Sadiq on 1 March 2024.",
  "HARD")

q("Sardar Ayaz Sadiq, elected in 2024, became which numbered Speaker of Pakistan's National Assembly?",
  "23rd", ["21st", "22nd", "24th"],
  "He was sworn in as the 23rd Speaker of the National Assembly following the 2024 general election.",
  "HARD")

q("Who was elected Chairman of the Senate of Pakistan in April 2024?",
  "Yousaf Raza Gillani", ["Sadiq Sanjrani", "Raja Pervaiz Ashraf", "Sherry Rehman"],
  "Former Prime Minister Yousaf Raza Gillani of the PPP was elected Chairman of the Senate on 9 April 2024.",
  "EASY")

q("Who was elected Deputy Chairman of the Senate of Pakistan in April 2024?",
  "Syedaal Khan Nasar", ["Mirza Muhammad Afridi", "Saleem Mandviwalla", "Abdul Shakoor"],
  "Syedaal Khan Nasar was elected Deputy Chairman in the same sitting that elected Yousaf Raza Gillani as Chairman.",
  "HARD")

q("Who was notified as Leader of the Opposition in Pakistan's National Assembly in January 2026?",
  "Mahmood Khan Achakzai", ["Omar Ayub Khan", "Gohar Ali Khan", "Asad Qaiser"],
  "Achakzai was appointed in January 2026, filling a vacancy left after Omar Ayub Khan lost his seat on conviction in 2025.",
  "MEDIUM", AN)

q("Mahmood Khan Achakzai heads which political party?",
  "Pakhtunkhwa Milli Awami Party", ["Awami National Party", "National Party", "Balochistan Awami Party"],
  "Achakzai is chairman of the Pakhtunkhwa Milli Awami Party (PkMAP), based mainly in Pashtun districts of Balochistan.",
  "MEDIUM")

q("Which opposition alliance launched in 2024 is led by Mahmood Khan Achakzai?",
  "Tehreek Tahafuz Ayin-e-Pakistan", ["Pakistan Democratic Movement", "Muttahida Majlis-e-Amal", "Grand Democratic Alliance"],
  "Tehreek Tahafuz Ayin-e-Pakistan, a PTI-backed alliance for the defence of the Constitution, was launched from Pishin in 2024 under Achakzai.",
  "MEDIUM")

q("Who was appointed Leader of the Opposition in Pakistan's National Assembly in 2024 after the general election?",
  "Omar Ayub Khan", ["Raja Riaz", "Shibli Faraz", "Asad Qaiser"],
  "PTI's Omar Ayub Khan was notified as Opposition Leader in the National Assembly in March 2024.",
  "EASY")

q("Who was appointed Leader of the Opposition in the Senate of Pakistan in April 2024?",
  "Shibli Faraz", ["Shahzad Waseem", "Azam Nazeer Tarar", "Ali Zafar"],
  "PTI senator Shibli Faraz took over as Senate Opposition Leader after the March-April 2024 Senate elections.",
  "MEDIUM")

# ---------------- 26th Amendment ----------------
q("In which month and year was the 26th Constitutional Amendment passed by Pakistan's Parliament?",
  "October 2024", ["August 2024", "January 2025", "November 2025"],
  "The Senate passed it on 20 October 2024 and the National Assembly on 21 October 2024; the President assented the same day.",
  "EASY")

q("The 26th Constitutional Amendment provided for the creation of which body inside the Supreme Court of Pakistan?",
  "Constitutional Bench", ["Federal Constitutional Court", "Shariat Appellate Bench", "Judicial Commission"],
  "The amendment set up a separate Constitutional Bench of the Supreme Court to hear constitutional matters.",
  "EASY")

q("Which body was empowered by the 26th Amendment to nominate the Chief Justice of Pakistan from among the three most senior Supreme Court judges?",
  "A 12-member Special Parliamentary Committee", ["The Supreme Judicial Council", "The federal cabinet", "The Council of Common Interests"],
  "The amendment ended automatic elevation by seniority and gave the nomination to a 12-member Special Parliamentary Committee voting by two-thirds majority.",
  "MEDIUM")

q("What tenure did the 26th Amendment fix for the Chief Justice of Pakistan?",
  "Three years", ["Two years", "Four years", "Five years"],
  "Article 177 was amended to cap the Chief Justice's term at three years, subject to the retirement age.",
  "EASY")

q("Which fundamental right was inserted into Pakistan's Constitution as Article 9A by the 26th Amendment?",
  "Right to a clean, healthy and sustainable environment", ["Right to information", "Right to fair trial", "Right to education"],
  "Article 9A makes a clean, healthy and sustainable environment a justiciable fundamental right.",
  "MEDIUM")

q("By which date does the 26th Amendment require riba (usury) to be eliminated in Pakistan, as far as practicable?",
  "1 January 2028", ["1 January 2027", "1 January 2030", "14 August 2029"],
  "The amendment wrote into the Constitution a deadline of 1 January 2028 for the elimination of riba as far as practicable.",
  "HARD")

q("Who took oath in October 2024 as the first Chief Justice of Pakistan appointed under the 26th Amendment?",
  "Yahya Afridi", ["Mansoor Ali Shah", "Munib Akhtar", "Aminuddin Khan"],
  "Justice Yahya Afridi was nominated by the Special Parliamentary Committee and sworn in on 26 October 2024.",
  "EASY")

q("Justice Yahya Afridi became which numbered Chief Justice of Pakistan?",
  "30th", ["28th", "29th", "31st"],
  "He is counted as the 30th Chief Justice of Pakistan, succeeding Qazi Faez Isa.",
  "HARD")

# ---------------- 27th Amendment ----------------
q("On what date did President Asif Ali Zardari give assent to Pakistan's 27th Constitutional Amendment?",
  "13 November 2025", ["12 November 2025", "21 October 2024", "8 November 2025"],
  "The Senate approved the final text on 13 November 2025 and the President signed it into law the same day.",
  "MEDIUM", D)

q("By what margin did the Senate finally pass Pakistan's 27th Constitutional Amendment in November 2025?",
  "64 votes to 4", ["65 votes to 4", "70 votes to 8", "60 votes to 4"],
  "The Senate recorded 64 votes in favour and 4 against, exactly meeting the two-thirds threshold of 64 in a house of 96.",
  "HARD", D)

q("How many votes were cast in favour of the 27th Constitutional Amendment in Pakistan's National Assembly?",
  "234", ["225", "201", "224"],
  "The National Assembly passed the bill on 12 November 2025 with 234 votes in favour against 4, comfortably above the 224 required.",
  "HARD", D)

q("Which federal minister tabled the 27th Constitutional Amendment bill in Pakistan's Parliament?",
  "Azam Nazeer Tarar", ["Ahsan Iqbal", "Mohsin Naqvi", "Attaullah Tarar"],
  "Law and Justice Minister Azam Nazeer Tarar moved the bill on behalf of the government.",
  "MEDIUM", W)

q("Which new court was established by Pakistan's 27th Constitutional Amendment?",
  "Federal Constitutional Court", ["Federal Shariat Court", "National Accountability Court", "Federal Service Tribunal"],
  "The amendment created a Federal Constitutional Court and moved constitutional jurisdiction to it from the Supreme Court.",
  "EASY", D)

q("Who was appointed the first Chief Justice of Pakistan's Federal Constitutional Court in November 2025?",
  "Aminuddin Khan", ["Yahya Afridi", "Sarfraz Dogar", "Muhammad Ali Mazhar"],
  "Justice Aminuddin Khan, who had headed the Supreme Court's Constitutional Bench, was named the first Chief Justice of the new court.",
  "EASY", D)

q("What is the sanctioned strength of judges of Pakistan's Federal Constitutional Court?",
  "13", ["17", "11", "15"],
  "The court was given a sanctioned strength of 13 judges including its Chief Justice.",
  "HARD", W)

q("Which article of Pakistan's Constitution was amended by the 27th Amendment to create the office of Chief of Defence Forces?",
  "Article 243", ["Article 245", "Article 175A", "Article 248"],
  "Article 243, which deals with command of the armed forces, was recast to provide for a Chief of Defence Forces.",
  "MEDIUM", W)

q("Which military office was abolished by Pakistan's 27th Constitutional Amendment?",
  "Chairman Joint Chiefs of Staff Committee", ["Chief of General Staff", "Vice Chief of Army Staff", "Chief of the Naval Staff"],
  "The post of Chairman Joint Chiefs of Staff Committee lapsed on 27 November 2025 and its role passed to the new Chief of Defence Forces.",
  "EASY", W)

q("Who was the last holder of the office of Chairman Joint Chiefs of Staff Committee of Pakistan?",
  "General Sahir Shamshad Mirza", ["General Nadeem Raza", "General Zubair Mahmood Hayat", "General Rashad Mahmood"],
  "General Sahir Shamshad Mirza retired on 27 November 2025, after which the office ceased to exist.",
  "HARD", W)

q("Who became Pakistan's first Chief of Defence Forces?",
  "Field Marshal Asim Munir", ["General Sahir Shamshad Mirza", "General Qamar Javed Bajwa", "Air Chief Marshal Zaheer Ahmed Babar"],
  "Field Marshal Asim Munir, the Chief of Army Staff, was appointed to the newly created post of Chief of Defence Forces in late 2025.",
  "EASY", D)

q("What change did Pakistan's 27th Amendment make to Article 248 in relation to the President?",
  "It granted lifetime immunity from criminal and civil proceedings", ["It removed presidential immunity altogether", "It limited immunity to five years after leaving office", "It made immunity conditional on parliamentary approval"],
  "Immunity under Article 248, previously tied to the term of office, was extended to cover the President for life.",
  "MEDIUM", CN)

q("Which two Supreme Court judges resigned on 13 November 2025 in protest against the 27th Constitutional Amendment?",
  "Mansoor Ali Shah and Athar Minallah", ["Munib Akhtar and Ayesha Malik", "Aminuddin Khan and Naeem Akhtar Afghan", "Yahya Afridi and Irfan Saadat Khan"],
  "Justices Mansoor Ali Shah and Athar Minallah resigned the day the amendment received presidential assent.",
  "MEDIUM", W)

# ---------------- Judiciary ----------------
q("How many judges sat on the Supreme Court bench that delivered the reserved seats verdict of 12 July 2024?",
  "13", ["11", "8", "15"],
  "A 13-member full court decided the reserved seats case, with eight judges forming the majority in favour of PTI.",
  "MEDIUM")

q("Which judge headed the Supreme Court constitutional bench that decided the reserved seats review in 2025?",
  "Justice Aminuddin Khan", ["Justice Yahya Afridi", "Justice Mansoor Ali Shah", "Justice Munib Akhtar"],
  "Justice Aminuddin Khan presided over the constitutional bench that took up review petitions against the July 2024 judgment.",
  "MEDIUM")

q("What did the Supreme Court's constitutional bench decide in the reserved seats review of March 2025?",
  "That PTI was not entitled to the reserved seats", ["That PTI was entitled to all the reserved seats", "That the reserved seats would remain vacant", "That fresh elections would be held for the reserved seats"],
  "The bench accepted the review petitions on 26 March 2025 and held that PTI could not claim reserved seats because it had not contested the election as a party.",
  "MEDIUM")

q("Which provision of the Pakistan Army Act 1952 permitting trial of civilians was restored by the Supreme Court's constitutional bench in May 2025?",
  "Section 2(1)(d)", ["Section 59(4)", "Section 31D", "Section 8"],
  "The constitutional bench overturned the October 2023 judgment and revived Section 2(1)(d), under which civilians may be tried by court martial.",
  "HARD", W)

q("In September 2024 the Supreme Court reversed its earlier judgment and reinstated amendments to which law?",
  "The National Accountability Ordinance 1999", ["The Elections Act 2017", "The Pakistan Army Act 1952", "The Official Secrets Act 1923"],
  "The Court restored the 2022 amendments to the accountability law, including the Rs 500 million threshold for NAB's jurisdiction.",
  "MEDIUM")

q("Who was sworn in as Chief Justice of the Islamabad High Court in July 2025?",
  "Sardar Muhammad Sarfraz Dogar", ["Aamer Farooq", "Athar Minallah", "Miangul Hassan Aurangzeb"],
  "Justice Sarfraz Dogar, transferred from the Lahore High Court, took oath as Chief Justice of the Islamabad High Court amid a seniority dispute.",
  "MEDIUM", NAT)

q("In which case was Imran Khan sentenced to 14 years' imprisonment in January 2025?",
  "Al-Qadir Trust case", ["Toshakhana case", "Cipher case", "Iddat case"],
  "An accountability court in Rawalpindi convicted him on 17 January 2025 in the £190 million Al-Qadir Trust reference.",
  "EASY")

q("In December 2025 Imran Khan and Bushra Bibi were each sentenced to how many years in the Toshakhana-II case?",
  "17 years", ["14 years", "10 years", "7 years"],
  "A special court handed both a 17-year sentence on 20 December 2025 in the second Toshakhana reference.",
  "MEDIUM", D)

# ---------------- Provincial governments ----------------
q("Who became the first woman Chief Minister of Punjab in February 2024?",
  "Maryam Nawaz", ["Hina Rabbani Khar", "Shireen Mazari", "Sherry Rehman"],
  "Maryam Nawaz Sharif was elected on 26 February 2024, becoming the first woman to head any Pakistani province.",
  "EASY")

q("How many votes did Maryam Nawaz secure in the Punjab Assembly to be elected Chief Minister in February 2024?",
  "220", ["201", "186", "250"],
  "She polled 220 votes in the Punjab Assembly while the opposition boycotted the count.",
  "MEDIUM", D)

q("Who was elected Chief Minister of Sindh for a third consecutive term in February 2024?",
  "Murad Ali Shah", ["Nasir Hussain Shah", "Sharjeel Memon", "Maqbool Baqar"],
  "PPP's Syed Murad Ali Shah was elected Sindh Chief Minister for a third successive term on 26 February 2024.",
  "EASY")

q("Who was elected Chief Minister of Balochistan in early 2024?",
  "Sarfraz Bugti", ["Ali Mardan Khan Domki", "Abdul Quddus Bizenjo", "Jam Kamal Khan"],
  "PPP's Mir Sarfraz Bugti was elected unopposed as Chief Minister of Balochistan after the 2024 general election.",
  "EASY")

q("Who became Chief Minister of Khyber Pakhtunkhwa after Pakistan's 2024 general election?",
  "Ali Amin Gandapur", ["Sohail Afridi", "Mahmood Khan", "Pervez Khattak"],
  "PTI's Ali Amin Gandapur was elected Chief Minister of Khyber Pakhtunkhwa in March 2024.",
  "EASY")

q("Who was elected Chief Minister of Khyber Pakhtunkhwa in October 2025?",
  "Sohail Afridi", ["Ali Amin Gandapur", "Muzzammil Aslam", "Babar Saleem Swati"],
  "PTI replaced Ali Amin Gandapur with Sohail Afridi, who was elected by the provincial assembly on 13 October 2025.",
  "EASY", ANC)

q("Which court in October 2025 ordered the Governor of Khyber Pakhtunkhwa to administer the oath of office to Sohail Afridi?",
  "Peshawar High Court", ["Supreme Court of Pakistan", "Islamabad High Court", "Federal Constitutional Court"],
  "The Peshawar High Court directed Governor Faisal Karim Kundi to administer the oath by 15 October 2025 after his delay.",
  "HARD", W)

q("Who took oath as Governor of Punjab in May 2024?",
  "Sardar Saleem Haider Khan", ["Baligh Ur Rehman", "Omar Sarfraz Cheema", "Muhammad Sarwar"],
  "PPP's Sardar Saleem Haider Khan was sworn in as the 40th Governor of Punjab in May 2024.",
  "MEDIUM")

q("Who took oath as Governor of Khyber Pakhtunkhwa in May 2024?",
  "Faisal Karim Kundi", ["Haji Ghulam Ali", "Shah Farman", "Iqbal Zafar Jhagra"],
  "PPP leader Faisal Karim Kundi was sworn in as Governor of Khyber Pakhtunkhwa in May 2024.",
  "MEDIUM")

q("Who took oath as Governor of Balochistan in May 2024?",
  "Sheikh Jaffar Khan Mandokhail", ["Abdul Wali Kakar", "Syed Zahoor Ahmad Agha", "Amanullah Khan Yasinzai"],
  "Sheikh Jaffar Khan Mandokhail was sworn in as Governor of Balochistan in May 2024.",
  "HARD")

q("Who was elected Speaker of the Provincial Assembly of Punjab in 2024?",
  "Malik Muhammad Ahmad Khan", ["Sibtain Khan", "Chaudhry Parvez Elahi", "Zaheer Iqbal Channar"],
  "PML-N's Malik Muhammad Ahmad Khan was elected Speaker of the Punjab Assembly after the 2024 election.",
  "MEDIUM")

q("Who was elected Speaker of the Sindh Assembly in 2024?",
  "Awais Qadir Shah", ["Agha Siraj Durrani", "Nisar Ahmed Khuhro", "Rehana Leghari"],
  "PPP's Syed Awais Qadir Shah was elected Speaker of the Sindh Assembly following the 2024 general election.",
  "HARD")

q("Who was sworn in as Prime Minister of Azad Jammu and Kashmir in November 2025?",
  "Faisal Mumtaz Rathore", ["Chaudhry Anwarul Haq", "Sardar Tanveer Ilyas", "Raja Farooq Haider"],
  "Faisal Mumtaz Rathore was elected the 16th Prime Minister of Azad Jammu and Kashmir and took oath on 18 November 2025.",
  "MEDIUM", D)

q("Faisal Mumtaz Rathore, who became Prime Minister of Azad Jammu and Kashmir in 2025, belongs to which party?",
  "Pakistan Peoples Party", ["Pakistan Muslim League (N)", "Pakistan Tehreek-e-Insaf", "All Jammu and Kashmir Muslim Conference"],
  "Rathore is a PPP leader and replaced Chaudhry Anwarul Haq as head of the AJK government.",
  "MEDIUM", D)

q("On what date was the Gilgit-Baltistan Assembly election held in 2026?",
  "7 June 2026", ["15 November 2025", "8 February 2026", "22 June 2026"],
  "Polling for the Gilgit-Baltistan Assembly took place on 7 June 2026 after a caretaker set-up ran the region.",
  "MEDIUM", W)

q("Which party won the largest number of general seats in the 2026 Gilgit-Baltistan Assembly election?",
  "Pakistan Peoples Party", ["Pakistan Muslim League (N)", "Pakistan Tehreek-e-Insaf", "Majlis Wahdat-e-Muslimeen"],
  "The PPP won 10 general seats, ahead of PML-N's six, and later formed a coalition government with PML-N.",
  "MEDIUM", W)

q("Who was elected Chief Minister of Gilgit-Baltistan in June 2026?",
  "Amjad Hussain Azar", ["Gulbar Khan", "Khalid Khurshid", "Yar Muhammad"],
  "PPP's Amjad Hussain Azar was elected unopposed on 22 June 2026 under a power-sharing deal with PML-N.",
  "MEDIUM", W)

q("Who was appointed caretaker Chief Minister of Gilgit-Baltistan in November 2025?",
  "Justice (retd) Yar Muhammad", ["Gulbar Khan", "Amjad Hussain Azar", "Hafiz Hafeezur Rehman"],
  "Justice (retd) Yar Muhammad was sworn in as caretaker Chief Minister on 25 November 2025 to oversee the 2026 election.",
  "HARD", T)

# ---------------- Elections and by-elections ----------------
q("The Senate election of 2 April 2024 left the seats of which province unfilled because its assembly was incomplete?",
  "Khyber Pakhtunkhwa", ["Balochistan", "Sindh", "Punjab"],
  "Khyber Pakhtunkhwa's Senate seats could not be filled in April 2024 because the reserved seats dispute had left the provincial assembly short of members.",
  "HARD")

q("In which month of 2025 were the long-delayed Senate elections for Khyber Pakhtunkhwa finally held?",
  "July 2025", ["April 2025", "March 2025", "October 2025"],
  "Polling for Khyber Pakhtunkhwa's Senate seats took place on 21 July 2025 after the reserved seats issue was settled.",
  "MEDIUM", W)

q("On what date were by-elections held in 2025 for six National Assembly and seven Punjab Assembly seats?",
  "23 November 2025", ["21 April 2025", "8 September 2025", "14 December 2025"],
  "The by-elections of 23 November 2025 filled seats vacated mainly by the disqualification of PTI members convicted over the May 2023 riots.",
  "HARD", W)

q("Which party won the overwhelming majority of seats in Pakistan's by-elections of 23 November 2025?",
  "Pakistan Muslim League (N)", ["Pakistan Tehreek-e-Insaf", "Pakistan Peoples Party", "Jamiat Ulema-e-Islam (F)"],
  "PML-N took 12 of the 13 seats contested, with PTI winning only one.",
  "MEDIUM", W)

# ---------------- Legislation and policy ----------------
q("Which section inserted by Pakistan's PECA (Amendment) Act 2025 criminalises the spreading of false or fake information?",
  "Section 26A", ["Section 20", "Section 37", "Section 11"],
  "Section 26A of the amended Prevention of Electronic Crimes Act penalises intentionally spreading information known to be false or fake.",
  "MEDIUM")

q("Which of these bodies was created by Pakistan's PECA (Amendment) Act 2025?",
  "Social Media Protection Tribunal", ["National Media Commission", "Press Council of Pakistan", "Pakistan Telecommunication Tribunal"],
  "The 2025 amendment set up a Social Media Protection Tribunal along with a regulatory authority and a complaint council.",
  "MEDIUM")

q("In which month and year did President Zardari give assent to Pakistan's PECA (Amendment) Act?",
  "January 2025", ["January 2024", "June 2025", "November 2025"],
  "The President signed the PECA amendment into law at the end of January 2025 despite protests by journalists' bodies.",
  "EASY")

q("Which authority was established by Pakistan's Digital Nation Pakistan Act 2025?",
  "Pakistan Digital Authority", ["Pakistan Telecommunication Authority", "National Database and Registration Authority", "Pakistan Software Export Board"],
  "The Digital Nation Pakistan Act, enacted in January 2025, created the Pakistan Digital Authority to drive digital transformation.",
  "EASY")

q("Who chairs the National Digital Commission created under Pakistan's Digital Nation Pakistan Act 2025?",
  "The Prime Minister", ["The President", "The Minister for Information Technology", "The Governor of the State Bank"],
  "The Act places the National Digital Commission, which sets strategic direction for the Pakistan Digital Authority, under the Prime Minister's chairmanship.",
  "MEDIUM")

q("What is the name of the five-year National Economic Transformation Plan launched by Prime Minister Shehbaz Sharif on 31 December 2024?",
  "Uraan Pakistan", ["Vision 2025", "Ehsaas Programme", "Digital Pakistan"],
  "Uraan Pakistan is the National Economic Transformation Plan 2024-29 launched on 31 December 2024.",
  "EASY")

q("What are the five pillars of Pakistan's Uraan Pakistan plan collectively called?",
  "The 5Es", ["The 4Ps", "The 5Ds", "The 3Cs"],
  "The plan is built on the 5Es: Exports, E-Pakistan, Environment and climate, Energy and infrastructure, and Equity and empowerment.",
  "EASY")

q("What annual export target does Pakistan's Uraan Pakistan plan set for 2029?",
  "US$60 billion", ["US$30 billion", "US$100 billion", "US$45 billion"],
  "Uraan Pakistan aims to roughly double annual exports to about US$60 billion by 2029.",
  "HARD")

q("What was the total outlay of Pakistan's federal budget for 2026-27?",
  "About Rs 18.77 trillion", ["About Rs 17.57 trillion", "About Rs 14.46 trillion", "About Rs 21.30 trillion"],
  "The 2026-27 federal budget presented on 12 June 2026 carried a total outlay of roughly Rs 18,771 billion.",
  "MEDIUM", D)

q("What GDP growth rate did Pakistan's federal budget for 2026-27 target?",
  "4 per cent", ["4.2 per cent", "3.6 per cent", "5 per cent"],
  "The 2026-27 budget set a real GDP growth target of 4 per cent.",
  "MEDIUM", D)

q("What was the total outlay of Pakistan's federal budget for 2025-26, presented on 10 June 2025?",
  "About Rs 17.57 trillion", ["About Rs 18.77 trillion", "About Rs 18.88 trillion", "About Rs 16.20 trillion"],
  "Finance Minister Muhammad Aurangzeb presented a budget of about Rs 17,573 billion for 2025-26.",
  "HARD", W)

q("What is the name of the reinvigorated counter-terrorism campaign approved by Pakistan's government in June 2024?",
  "Azm-e-Istehkam", ["Radd-ul-Fasaad", "Zarb-e-Azb", "Bunyan-um-Marsoos"],
  "Operation Azm-e-Istehkam was approved on 22 June 2024 as a reinvigorated national counter-terrorism drive.",
  "EASY")

q("Which forum approved Operation Azm-e-Istehkam in June 2024?",
  "The Central Apex Committee of the National Action Plan", ["The National Security Committee", "The Council of Common Interests", "The National Command Authority"],
  "The Central Apex Committee on the National Action Plan, chaired by Prime Minister Shehbaz Sharif, approved the campaign.",
  "HARD")

q("Under the National Fiscal Pact agreed by Pakistan's federal and provincial governments in September 2024, the provinces undertook to tax which income?",
  "Agricultural income", ["Income from foreign remittances", "Income from digital services", "Pension income"],
  "The pact, signed under the IMF programme, committed provinces to align agricultural income tax with federal personal and corporate rates.",
  "MEDIUM")

q("At which Islamabad location did the PTI protest of November 2024 culminate before being dispersed?",
  "D-Chowk", ["Faizabad Interchange", "Liaquat Bagh", "Aabpara Chowk"],
  "PTI marchers reached D-Chowk near the Red Zone on 26 November 2024 before a night-time crackdown ended the protest.",
  "MEDIUM")

q("Which official was named in January 2020 as Chief Election Commissioner of Pakistan for a five-year term?",
  "Sikandar Sultan Raja", ["Fakhruddin G. Ebrahim", "Sardar Muhammad Raza Khan", "Justice Javed Iqbal"],
  "Sikandar Sultan Raja was appointed Chief Election Commissioner on 27 January 2020 and oversaw the 2024 general election.",
  "MEDIUM")

SEQ = [0, 2, 1, 3, 2, 0, 3, 1, 3, 1, 0, 2]

out = []
for i, item in enumerate(Q):
    pos = SEQ[i % len(SEQ)]
    opts = list(item["dis"])
    opts.insert(pos, item["ans"])
    d = {
        "text": item["text"],
        "options": opts,
        "correctIndex": pos,
        "explanation": item["expl"],
        "difficulty": item["diff"],
        "topic": "pakistan-current",
    }
    if item["src"]:
        d["sourceNote"] = "Confirmed from " + item["src"] + " (checked July 2026)."
    out.append(d)

doc = {"subject": "current-affairs", "unit": "ca-pakistan-politics", "questions": out}

path = "/home/claude/fia-job-prep/content/raw/current-affairs/ca-pakistan-politics.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)
    f.write("\n")

from collections import Counter
print("count", len(out))
print("pos", Counter(x["correctIndex"] for x in out))
print("diff", Counter(x["difficulty"] for x in out))
texts = [x["text"] for x in out]
print("dupe texts", len(texts) - len(set(texts)))
for x in out:
    assert len(x["options"]) == 4, x["text"]
    assert len(set(x["options"])) == 4, x["text"]
    assert x["options"][x["correctIndex"]]
run = 1
best = 1
for a, b in zip(out, out[1:]):
    run = run + 1 if a["correctIndex"] == b["correctIndex"] else 1
    best = max(best, run)
print("longest run", best)
