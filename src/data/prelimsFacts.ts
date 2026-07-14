// Curated, static, syllabus-aligned facts for UPSC Prelims.
// Ordered strictly: Polity → Economics → History → Geography, then loop.
// See fetchPrelimsFacts — server just returns this array as-is.

export type PrelimsCategory = "Polity" | "Economics" | "History" | "Geography";
export type PrelimsFact = { k: string; v: string; c: PrelimsCategory };

const POLITY: PrelimsFact[] = [
  { c: "Polity", k: "Article 14", v: "Equality before law & equal protection of laws" },
  { c: "Polity", k: "Article 19", v: "Six freedoms — speech, assembly, association, movement, residence, profession" },
  { c: "Polity", k: "Article 21", v: "Protection of life and personal liberty" },
  { c: "Polity", k: "Article 32", v: "Right to constitutional remedies (Ambedkar: 'heart & soul')" },
  { c: "Polity", k: "Article 44", v: "Uniform Civil Code (DPSP)" },
  { c: "Polity", k: "Article 51A", v: "Fundamental Duties — 11 in total (42nd & 86th Amdt)" },
  { c: "Polity", k: "Article 72", v: "Pardoning power of the President" },
  { c: "Polity", k: "Article 74", v: "Council of Ministers to aid & advise President" },
  { c: "Polity", k: "Article 110", v: "Definition of a Money Bill" },
  { c: "Polity", k: "Article 148", v: "Comptroller & Auditor-General of India (CAG)" },
  { c: "Polity", k: "Article 226", v: "Writ jurisdiction of High Courts (wider than SC's Art. 32)" },
  { c: "Polity", k: "Article 243", v: "Panchayats — added by 73rd Amendment (1992)" },
  { c: "Polity", k: "Article 280", v: "Finance Commission — constituted every 5 years" },
  { c: "Polity", k: "Article 312", v: "All-India Services (IAS, IPS, IFoS)" },
  { c: "Polity", k: "Article 324", v: "Election Commission — superintendence of elections" },
  { c: "Polity", k: "Article 356", v: "President's Rule in a State" },
  { c: "Polity", k: "Article 368", v: "Power of Parliament to amend the Constitution" },
  { c: "Polity", k: "Article 370", v: "Special status for J&K — abrogated on 5 Aug 2019" },
  { c: "Polity", k: "Rajya Sabha strength", v: "245 (233 elected + 12 nominated)" },
  { c: "Polity", k: "Lok Sabha strength", v: "543 elected members (max 552)" },
  { c: "Polity", k: "NITI Aayog", v: "Replaced Planning Commission on 1 Jan 2015" },
  { c: "Polity", k: "GST Council", v: "Article 279A; Union FM chairs; 3/4th weighted vote" },
  { c: "Polity", k: "Basic Structure", v: "Kesavananda Bharati case, 1973 (13-judge bench)" },
];

const ECONOMICS: PrelimsFact[] = [
  { c: "Economics", k: "Repo rate", v: "6.50% — held by RBI MPC" },
  { c: "Economics", k: "CRR", v: "4.50% of NDTL" },
  { c: "Economics", k: "SLR", v: "18.00% of NDTL" },
  { c: "Economics", k: "SDF rate", v: "6.25% (Apr 2022) — floor of LAF corridor" },
  { c: "Economics", k: "MSF rate", v: "6.75% — ceiling of LAF corridor" },
  { c: "Economics", k: "Inflation target", v: "4% ± 2% CPI (Flexible Inflation Targeting)" },
  { c: "Economics", k: "MPC composition", v: "6 members — 3 RBI + 3 Govt-appointed" },
  { c: "Economics", k: "Base year — CPI", v: "2012" },
  { c: "Economics", k: "Base year — WPI", v: "2011-12" },
  { c: "Economics", k: "Base year — GDP", v: "2011-12" },
  { c: "Economics", k: "Fiscal deficit target", v: "FRBM: 3% of GDP (long-term glide path)" },
  { c: "Economics", k: "15th FC devolution", v: "41% of central taxes to States" },
  { c: "Economics", k: "Insurance FDI", v: "74% under automatic route" },
  { c: "Economics", k: "PM-KISAN", v: "₹6,000/year to landholding farmers in 3 instalments" },
  { c: "Economics", k: "PMJDY", v: "Financial inclusion — RuPay + ₹2 lakh accident cover" },
  { c: "Economics", k: "PM-JAY (Ayushman Bharat)", v: "₹5 lakh/family/year secondary & tertiary care" },
  { c: "Economics", k: "MGNREGA", v: "100 days of guaranteed wage employment / rural HH" },
  { c: "Economics", k: "PLI Scheme", v: "Production-Linked Incentive across 14 sectors" },
  { c: "Economics", k: "PM Gati Shakti", v: "National Master Plan for multi-modal infra (2021)" },
  { c: "Economics", k: "Green H₂ target", v: "5 MMT/yr production capacity by 2030" },
  { c: "Economics", k: "Priority Sector Lending", v: "40% of ANBC for domestic scheduled banks" },
];

const HISTORY: PrelimsFact[] = [
  { c: "History", k: "INC founded", v: "1885 — A.O. Hume; 1st session Bombay, W.C. Bonnerjee" },
  { c: "History", k: "Partition of Bengal", v: "1905 by Lord Curzon; annulled 1911" },
  { c: "History", k: "Surat Split", v: "1907 — INC split into Moderates & Extremists" },
  { c: "History", k: "Lucknow Pact", v: "1916 — INC–Muslim League joint demands" },
  { c: "History", k: "Rowlatt Act / Jallianwala", v: "1919 — Gen. Dyer, 13 April, Amritsar" },
  { c: "History", k: "Non-Cooperation", v: "1920–22, called off after Chauri Chaura" },
  { c: "History", k: "Simon Commission", v: "1927 — all-white; 'Simon Go Back' protests" },
  { c: "History", k: "Poorna Swaraj", v: "Lahore Session, 26 Jan 1930 (Nehru presided)" },
  { c: "History", k: "Dandi March", v: "12 Mar – 6 Apr 1930 — Salt Satyagraha" },
  { c: "History", k: "Gandhi–Irwin Pact", v: "5 March 1931" },
  { c: "History", k: "Poona Pact", v: "1932 — Gandhi & Ambedkar on separate electorates" },
  { c: "History", k: "Govt of India Act", v: "1935 — federal scheme, provincial autonomy" },
  { c: "History", k: "Quit India", v: "8 Aug 1942, Bombay AICC — 'Do or Die'" },
  { c: "History", k: "INA trials", v: "1945–46 at Red Fort — Bhulabhai Desai defended" },
  { c: "History", k: "Cabinet Mission", v: "1946 — rejected Pakistan, proposed groupings" },
  { c: "History", k: "Constituent Assembly", v: "First sat 9 Dec 1946; adopted 26 Nov 1949" },
  { c: "History", k: "Independence", v: "15 August 1947 — Mountbatten Plan (3 June 1947)" },
  { c: "History", k: "Constitution enforced", v: "26 January 1950" },
];

const GEOGRAPHY: PrelimsFact[] = [
  { c: "Geography", k: "Tropic of Cancer — India", v: "Passes through 8 states" },
  { c: "Geography", k: "IST meridian", v: "82°30′ E through Mirzapur (UP)" },
  { c: "Geography", k: "Standard latitude range", v: "8°4′ N to 37°6′ N (mainland)" },
  { c: "Geography", k: "Highest peak (India)", v: "Kanchenjunga (8,586 m) — Sikkim" },
  { c: "Geography", k: "Longest river (India)", v: "Ganga (~2,525 km)" },
  { c: "Geography", k: "Longest peninsular river", v: "Godavari (~1,465 km)" },
  { c: "Geography", k: "Coastline of India", v: "~7,516.6 km (mainland + islands)" },
  { c: "Geography", k: "Deepest lake (India)", v: "Manasbal, Jammu & Kashmir" },
  { c: "Geography", k: "Largest freshwater lake", v: "Wular Lake, J&K" },
  { c: "Geography", k: "Largest saltwater lake", v: "Chilika, Odisha" },
  { c: "Geography", k: "Rice–wheat belt", v: "Punjab, Haryana, W-UP — Green Revolution core" },
  { c: "Geography", k: "Black soil", v: "Regur — Deccan Trap; ideal for cotton" },
  { c: "Geography", k: "SW Monsoon onset", v: "Kerala coast, ~1 June (± 4 days)" },
  { c: "Geography", k: "El Niño", v: "Warming of eastern Pacific; weakens Indian monsoon" },
  { c: "Geography", k: "Western Ghats", v: "UNESCO WHS; 8 hottest biodiversity hotspots globally" },
  { c: "Geography", k: "Ramsar sites — India", v: "85 (as of 2024)" },
  { c: "Geography", k: "Highest waterfall", v: "Kunchikal Falls, Karnataka" },
];

// Strict subject order — Polity first, then Economics, then History, then Geography.
export const PRELIMS_FACTS: PrelimsFact[] = [
  ...POLITY,
  ...ECONOMICS,
  ...HISTORY,
  ...GEOGRAPHY,
];

export const PRELIMS_ORDER: PrelimsCategory[] = ["Polity", "Economics", "History", "Geography"];
