export type Pyq = {
  id: string;
  year: number;
  subject:
    | "Polity"
    | "History"
    | "Geography"
    | "Economy"
    | "Environment"
    | "S&T"
    | "Current Affairs";
  type: "Prelims" | "Mains";
  question: string;
  answer: string;
};

export const pyqs: Pyq[] = [
  {
    id: "p1",
    year: 2023,
    subject: "Polity",
    type: "Prelims",
    question:
      "Consider the following statements about the Finance Commission: 1) It is a constitutional body under Article 280. 2) Its recommendations are binding on the government. Which of the above statements is/are correct?",
    answer:
      "Only 1 is correct. The Finance Commission is constitutional (Article 280) but its recommendations are advisory in nature, not binding.",
  },
  {
    id: "p2",
    year: 2022,
    subject: "Economy",
    type: "Mains",
    question:
      "Distinguish between Capital Budget and Revenue Budget. Explain the components of both these Budgets.",
    answer:
      "Revenue Budget covers revenue receipts (tax + non-tax) and revenue expenditure (interest, subsidies, salaries). Capital Budget covers capital receipts (borrowings, disinvestment) and capital expenditure (asset creation, loans to states). Key distinction: revenue items do not create assets/liabilities; capital items do.",
  },
  {
    id: "p3",
    year: 2024,
    subject: "Environment",
    type: "Prelims",
    question:
      "With reference to 'Global Biodiversity Framework', which was adopted at COP15, consider its key targets. Which one is NOT part of the 30x30 goal?",
    answer:
      "The 30x30 goal targets protecting 30% of land and sea areas by 2030. Targets on subsidy reform and DSI benefit-sharing exist separately and are not part of 30x30.",
  },
  {
    id: "p4",
    year: 2021,
    subject: "History",
    type: "Mains",
    question:
      "Assess the role of the Non-Cooperation Movement in transforming the character of Indian nationalism.",
    answer:
      "The NCM (1920-22) transformed nationalism from elite constitutionalism to mass mobilization. It brought peasants, women, and students into the freedom struggle, popularized swadeshi, and established Gandhi's leadership. Its abrupt withdrawal after Chauri Chaura also introduced debates on nonviolence.",
  },
  {
    id: "p5",
    year: 2020,
    subject: "Geography",
    type: "Prelims",
    question:
      "Which of the following are the reasons for the occurrence of multi-drug resistance in microbial pathogens in India? [Adapted]",
    answer:
      "Indiscriminate use of antibiotics in animal husbandry, poor sewage treatment leading to environmental contamination, and over-the-counter availability of antibiotics all contribute to AMR.",
  },
  {
    id: "p6",
    year: 2023,
    subject: "S&T",
    type: "Mains",
    question:
      "What is Quantum Supremacy? Discuss its implications for India's data security and cryptographic infrastructure.",
    answer:
      "Quantum supremacy = a quantum computer solving a task infeasible for classical machines. Implications: RSA/ECC encryption threatened by Shor's algorithm; need for post-quantum cryptography (PQC); relevance for banking, defence, and Aadhaar-scale systems.",
  },
  {
    id: "p7",
    year: 2022,
    subject: "Current Affairs",
    type: "Prelims",
    question:
      "'Aditya-L1' mission is associated with which of the following celestial bodies?",
    answer:
      "The Sun. Aditya-L1 is India's first solar observatory, placed at the Sun-Earth Lagrange point L1 (~1.5 million km from Earth).",
  },
  {
    id: "p8",
    year: 2024,
    subject: "Polity",
    type: "Mains",
    question:
      "Discuss the significance of the doctrine of Basic Structure in preserving constitutional identity. Illustrate with recent judicial pronouncements.",
    answer:
      "Basic Structure (Kesavananda Bharati, 1973) limits Parliament's constituent power. Recent cases: NJAC (2015), Electoral Bonds (2024), Article 370 abrogation (2023) — all invoked basic structure tests around judicial independence, free & fair elections, and federalism.",
  },
  {
    id: "p9",
    year: 2021,
    subject: "Environment",
    type: "Prelims",
    question:
      "The 'Miyawaki method' is best known in the context of which of the following?",
    answer:
      "Afforestation. It is a Japanese technique for creating dense, native, self-sustaining urban mini-forests within short time frames.",
  },
  {
    id: "p10",
    year: 2023,
    subject: "Economy",
    type: "Prelims",
    question:
      "With reference to 'Green Deposits', consider the following: 1) They are governed by RBI. 2) They can only be issued by scheduled commercial banks. Which of the above is/are correct?",
    answer:
      "Only 1 is correct. RBI's framework (June 2023) allows scheduled commercial banks AND small finance banks (excluding payment banks and RRBs) to issue green deposits.",
  },
  {
    id: "p11",
    year: 2020,
    subject: "History",
    type: "Prelims",
    question:
      "The Vital-Vidhvansak, the first Hindi journal to have Dalit resistance as its major theme, was published in which of the following?",
    answer:
      "It was published from Meerut in the early 20th century and served as a platform for anti-caste writing among the Adi-Hindu movement in North India.",
  },
  {
    id: "p12",
    year: 2025,
    subject: "S&T",
    type: "Mains",
    question:
      "Examine the role of India Semiconductor Mission in achieving strategic autonomy. What are the key bottlenecks?",
    answer:
      "ISM (2021) targets end-to-end chip ecosystem: fabs, ATMP, design-linked incentive. Bottlenecks: talent pipeline, ultra-pure water & power for fabs, EDA-tool dependence, and long payback periods requiring sustained subsidy commitments.",
  },
];
