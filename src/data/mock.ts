export type Headline = {
  id: string;
  title: string;
  source: string;
  gs: "GS-I" | "GS-II" | "GS-III" | "GS-IV" | "Prelims";
  tags: string[];
  bullets: string[];
  minutes: number;
};

export const headlines: Headline[] = [
  {
    id: "h1",
    title: "India, EU move closer to Free Trade Agreement after 12th round",
    source: "The Hindu · Editorial",
    gs: "GS-II",
    tags: ["IR", "Economy"],
    bullets: [
      "12th round concluded in Brussels; sticking points on data flows and auto tariffs.",
      "Impact on India's services exports, especially IT and pharma.",
      "Link with Indo-Pacific strategy and de-risking from China.",
    ],
    minutes: 4,
  },
  {
    id: "h2",
    title: "Supreme Court reserves verdict on electoral bonds review petition",
    source: "Indian Express",
    gs: "GS-II",
    tags: ["Polity", "Governance"],
    bullets: [
      "Bench examines transparency vs donor privacy trade-off.",
      "Article 19(1)(a) — right to information of the voter.",
      "Precedent: PUCL v. Union of India (2003).",
    ],
    minutes: 5,
  },
  {
    id: "h3",
    title: "RBI keeps repo rate unchanged; flags food inflation risk",
    source: "Livemint",
    gs: "GS-III",
    tags: ["Economy", "Monetary Policy"],
    bullets: [
      "Repo at 6.5%; stance retained as 'withdrawal of accommodation'.",
      "CPI projection revised upward to 5.4%.",
      "Growth forecast at 7.2% for FY26.",
    ],
    minutes: 3,
  },
  {
    id: "h4",
    title: "ISRO's Gaganyaan uncrewed test flight scheduled for Q3",
    source: "PIB",
    gs: "GS-III",
    tags: ["S&T", "Space"],
    bullets: [
      "TV-D2 mission to validate crew escape system.",
      "Human-rated LVM3 undergoing final qualification.",
      "Bharatiya Antariksh Station target: 2035.",
    ],
    minutes: 3,
  },
  {
    id: "h5",
    title: "Cyclone 'Remal' makes landfall; NDRF deploys 14 teams",
    source: "The Hindu",
    gs: "GS-I",
    tags: ["Geography", "Disaster Mgmt"],
    bullets: [
      "Category 1 cyclone; wind speeds 110–120 kmph.",
      "IMD's colour-coded warning system in action.",
      "Coastal Regulation Zone (CRZ) implications.",
    ],
    minutes: 3,
  },
  {
    id: "h6",
    title: "Centre notifies Uniform Civil Code rules for Uttarakhand",
    source: "Indian Express · Editorial",
    gs: "GS-II",
    tags: ["Polity", "Society"],
    bullets: [
      "First state to operationalise UCC post-independence.",
      "Article 44 — Directive Principle now in practice.",
      "Debate: personal law vs common civil framework.",
    ],
    minutes: 5,
  },
  {
    id: "h7",
    title: "Green Hydrogen Mission crosses 1 GW electrolyser capacity",
    source: "PIB",
    gs: "GS-III",
    tags: ["Environment", "Energy"],
    bullets: [
      "SIGHT programme incentives driving domestic manufacturing.",
      "Target: 5 MMT green H₂ by 2030.",
      "Emission reduction of ~50 MT CO₂e per year.",
    ],
    minutes: 4,
  },
  {
    id: "h8",
    title: "India assumes chair of Wassenaar Arrangement plenary",
    source: "MEA Briefing",
    gs: "GS-II",
    tags: ["IR", "Security"],
    bullets: [
      "Multilateral export control regime for dual-use goods.",
      "India's membership since 2017 — strategic significance.",
      "Links with NSG, MTCR, Australia Group.",
    ],
    minutes: 4,
  },
];

export type PYQ = {
  id: string;
  year: number;
  paper: "Prelims" | "Mains GS-I" | "Mains GS-II" | "Mains GS-III" | "Mains GS-IV" | "Essay";
  subject: string;
  question: string;
  marks?: number;
  hint: string;
  answer: string;
};

export const pyqs: PYQ[] = [
  { id: "p1", year: 2024, paper: "Mains GS-II", subject: "Polity", question: "Discuss the role of the Finance Commission in maintaining fiscal federalism in India.", marks: 15, hint: "Constitutional mandate → Article 280 → horizontal & vertical devolution.", answer: "Intro: Art. 280 mandates FC every 5 years. Body: (i) Vertical — share of central taxes (41% under 15th FC), (ii) Horizontal — inter-se distribution using population, area, demographic performance, income distance, forest cover, tax effort, (iii) Grants-in-aid under Art. 275, (iv) Local body grants. Challenges: GST subsumed autonomy, cess/surcharge exclusion, revenue deficit grants. Conclusion: FC is the balancing wheel — needs statutory backing for permanent secretariat." },
  { id: "p2", year: 2024, paper: "Mains GS-III", subject: "Economy", question: "Examine the impact of Production Linked Incentive (PLI) schemes on India's manufacturing sector.", marks: 15, hint: "Sectors covered → exports → challenges → way forward.", answer: "14 sectors, ₹1.97 lakh cr outlay. Positives: electronics exports up 3x, mobile mfg from 3% to 16% global share, semiconductor ecosystem via Micron/Tata. Concerns: MSME exclusion, import dependence on components, JIT-vs-strategic reserves, WTO subsidy compatibility. Way forward: R&D linkage, deeper localisation, skill mission integration." },
  { id: "p3", year: 2023, paper: "Prelims", subject: "Economy", question: "With reference to 'Green Bonds', consider the following statements: 1) It is a debt instrument. 2) It is issued to fund only renewable energy projects. Which is correct?", hint: "Broader than renewables — all climate/eco projects.", answer: "Only (1) is correct. Green bonds fund climate & environment projects — renewables, clean transport, sustainable water, green buildings. India issued sovereign green bonds in Jan 2023." },
  { id: "p4", year: 2023, paper: "Mains GS-I", subject: "Geography", question: "Why is the world today confronted with a crisis of availability and access to freshwater resources?", marks: 10, hint: "Physical + economic scarcity, pollution, governance.", answer: "Availability: uneven distribution (0.3% surface freshwater), climate-driven variability, glacial retreat. Access: economic scarcity, pricing failures, transboundary disputes (Nile, Indus). Anthropogenic: over-abstraction (Punjab groundwater), pollution, urbanisation. Solutions: IWRM, virtual water trade, Ken-Betwa link, atmospheric water generation." },
  { id: "p5", year: 2023, paper: "Mains GS-IV", subject: "Ethics", question: "Explain the term 'moral turpitude'. Cite two examples from public life.", marks: 10, hint: "Legal-ethical concept — Section 8 RPA.", answer: "Moral turpitude = conduct contrary to community standards of justice, honesty, good morals. In law: disqualifies from public office (Sec 8, RPA 1951). Examples: 2G spectrum case (public trust betrayal), Vyapam scam (educational fraud). Ethical dimension: erodes institutional trust, requires probity via Nolan principles." },
  { id: "p6", year: 2022, paper: "Mains GS-II", subject: "Governance", question: "'Right of movement and residence throughout the territory of India are freely available except restrictions.' Discuss.", marks: 15, hint: "Article 19(1)(d) & (e) with reasonable restrictions.", answer: "Art. 19(1)(d)/(e) — free movement & residence. Restrictions (Art. 19(5)): interests of general public, protection of Scheduled Tribes. Cases: Inner Line Permit (NE states), Ladakh Sixth Schedule demand, COVID lockdown proportionality (Anuradha Bhasin). Balancing test: least restrictive means." },
  { id: "p7", year: 2022, paper: "Prelims", subject: "Environment", question: "Which of the following is/are the aim(s) of 'Digital India' Plan?", hint: "3 vision areas: infra, governance, empowerment.", answer: "Three vision areas: (a) digital infra as utility, (b) governance & services on demand, (c) digital empowerment of citizens. All aims applicable." },
  { id: "p8", year: 2022, paper: "Essay", subject: "Essay", question: "The process of self-discovery has now been technologically outsourced.", hint: "Tech mediation of identity, algorithms, agency.", answer: "Thesis: from Socrates' 'know thyself' to Spotify Wrapped — self-discovery is now curated by algorithms. Body: (i) social media as mirror, (ii) recommender systems shaping taste, (iii) mental health apps quantifying emotion, (iv) loss of solitude & unstructured reflection. Anti-thesis: tools enable, humans still choose. Conclusion: reclaim inner sovereignty through digital minimalism." },
  { id: "p9", year: 2021, paper: "Mains GS-III", subject: "Science & Tech", question: "How is the S-400 air defence system technically superior to any other system?", marks: 10, hint: "Range, multi-target, tiered missiles.", answer: "Features: 400 km range, tracks 300 targets, engages 36 simultaneously, tiered missiles (40N6, 48N6, 9M96). Superior to Patriot in range & altitude coverage. Strategic relevance for India: 2-front deterrence, CAATSA waiver diplomacy." },
  { id: "p10", year: 2021, paper: "Mains GS-I", subject: "History", question: "Evaluate the nature of the Bhakti literature and its contribution to Indian culture.", marks: 15, hint: "Nirguna vs Saguna, vernacularisation, social reform.", answer: "Bhakti = devotional egalitarianism (7th–17th c). Nirguna: Kabir, Nanak — formless divine, anti-caste. Saguna: Tulsidas, Mirabai — personal deity. Contributions: vernacular literary flowering, questioning of ritualism & caste, women's voice (Andal, Akka Mahadevi), foundation of composite culture." },
  { id: "p11", year: 2020, paper: "Mains GS-II", subject: "IR", question: "'Indian diaspora has an important role in the country's foreign policy.' Elaborate.", marks: 10, hint: "Soft power, remittances, lobbying.", answer: "32 million+ diaspora. Roles: (i) remittances $125B FY24 — largest globally, (ii) technology & capital corridors (Silicon Valley, Gulf), (iii) political lobbying (India Caucus, HAF), (iv) soft power (yoga, cuisine, Bollywood), (v) crisis diplomacy (Vande Bharat, Kaveri, Ganga)." },
  { id: "p12", year: 2020, paper: "Prelims", subject: "Polity", question: "The Preamble to the Constitution of India is:", hint: "Kesavananda Bharati verdict.", answer: "Part of the Constitution and amenable to amendment as per basic structure doctrine (Kesavananda Bharati, 1973). Reflects the philosophy — justice, liberty, equality, fraternity." },
];

export type SyllabusTopic = { id: string; name: string; progress: number };
export type SyllabusPaper = { id: string; name: string; topics: SyllabusTopic[] };

export const syllabus: SyllabusPaper[] = [
  {
    id: "gs1", name: "GS Paper I — History, Society, Geography",
    topics: [
      { id: "t1", name: "Ancient & Medieval History", progress: 0 },
      { id: "t2", name: "Modern India & Freedom Struggle", progress: 0 },
      { id: "t3", name: "Art & Culture", progress: 0 },
      { id: "t4", name: "World History", progress: 0 },
      { id: "t5", name: "Indian Society", progress: 0 },
      { id: "t6", name: "Physical & Human Geography", progress: 0 },
    ],
  },
  {
    id: "gs2", name: "GS Paper II — Polity, Governance, IR",
    topics: [
      { id: "t7", name: "Constitution & Polity", progress: 0 },
      { id: "t8", name: "Governance & Social Justice", progress: 0 },
      { id: "t9", name: "International Relations", progress: 0 },
      { id: "t10", name: "Welfare Schemes", progress: 0 },
    ],
  },
  {
    id: "gs3", name: "GS Paper III — Economy, Environment, S&T, Security",
    topics: [
      { id: "t11", name: "Indian Economy", progress: 0 },
      { id: "t12", name: "Environment & Ecology", progress: 0 },
      { id: "t13", name: "Science & Technology", progress: 0 },
      { id: "t14", name: "Internal Security", progress: 0 },
      { id: "t15", name: "Disaster Management", progress: 0 },
    ],
  },
  {
    id: "gs4", name: "GS Paper IV — Ethics, Integrity, Aptitude",
    topics: [
      { id: "t16", name: "Ethics — Theory & Thinkers", progress: 0 },
      { id: "t17", name: "Case Studies", progress: 0 },
      { id: "t18", name: "Public Service Values", progress: 0 },
    ],
  },
];

export type Task = { id: string; time: string; title: string; module: string; done: boolean };
export const todaysPlan: Task[] = [
  { id: "k1", time: "06:30", title: "The Hindu — read + notes", module: "Current Affairs", done: true },
  { id: "k2", time: "08:00", title: "GS-II · Federalism revision", module: "Polity", done: true },
  { id: "k3", time: "10:30", title: "Answer writing — 2 questions (15m)", module: "Mains", done: false },
  { id: "k4", time: "13:00", title: "Economy · Monetary Policy chapter", module: "GS-III", done: false },
  { id: "k5", time: "17:00", title: "Prelims MCQs — 50Q sectional", module: "Prelims", done: false },
  { id: "k6", time: "20:30", title: "Ethics — Case study drill", module: "GS-IV", done: false },
];

export type MockTest = {
  id: string;
  title: string;
  type: "Prelims" | "Mains" | "Sectional";
  questions: number;
  duration: string;
  attempted: boolean;
  score?: number;
};

export const mockTests: MockTest[] = [
  { id: "m1", title: "Prelims Full Mock #14", type: "Prelims", questions: 100, duration: "2 hrs", attempted: true, score: 118 },
  { id: "m2", title: "Polity Sectional — Federalism", type: "Sectional", questions: 40, duration: "45 min", attempted: true, score: 32 },
  { id: "m3", title: "Prelims Full Mock #15", type: "Prelims", questions: 100, duration: "2 hrs", attempted: false },
  { id: "m4", title: "Mains GS-II — Test 06", type: "Mains", questions: 20, duration: "3 hrs", attempted: false },
  { id: "m5", title: "Economy — Budget & Fiscal Policy", type: "Sectional", questions: 30, duration: "35 min", attempted: false },
  { id: "m6", title: "Environment Sectional #08", type: "Sectional", questions: 40, duration: "45 min", attempted: true, score: 28 },
];

export type MentorMessage = { id: string; role: "user" | "mentor"; text: string };
export const seedChat: MentorMessage[] = [
  { id: "m1", role: "mentor", text: "Good morning! Ready to tackle today's editorial on India-EU FTA? Ask me anything about the syllabus, PYQs or your daily plan." },
];
