// Curated, static, syllabus-aligned facts for UPSC Prelims.
// Verified factual data (constitutional articles, schemes, indices, institutions).
// This is intentionally static — not fetched, not generated.

export type PrelimsFact = { k: string; v: string };

export const PRELIMS_FACTS: PrelimsFact[] = [
  // Polity — Articles
  { k: "Article 14", v: "Equality before law & equal protection of laws" },
  { k: "Article 21", v: "Protection of life and personal liberty" },
  { k: "Article 32", v: "Right to constitutional remedies (Ambedkar: 'heart & soul')" },
  { k: "Article 44", v: "Uniform Civil Code (DPSP)" },
  { k: "Article 51A", v: "Fundamental Duties — 11 in total (42nd & 86th Amdt)" },
  { k: "Article 74", v: "Council of Ministers to aid & advise President" },
  { k: "Article 148", v: "Comptroller & Auditor-General of India (CAG)" },
  { k: "Article 243", v: "Panchayats — added by 73rd Amendment (1992)" },
  { k: "Article 280", v: "Finance Commission — constituted every 5 years" },
  { k: "Article 324", v: "Election Commission — superintendence of elections" },
  { k: "Article 356", v: "President's Rule in a State" },
  { k: "Article 368", v: "Power of Parliament to amend the Constitution" },
  { k: "Article 370", v: "Special status for J&K — abrogated on 5 Aug 2019" },

  // Polity — Institutions & terms
  { k: "Rajya Sabha strength", v: "245 (233 elected + 12 nominated)" },
  { k: "Lok Sabha strength", v: "543 elected members (max 552)" },
  { k: "NITI Aayog", v: "Replaced Planning Commission on 1 Jan 2015" },
  { k: "15th Finance Commission", v: "Devolution: 41% of central taxes to States" },
  { k: "GST Council", v: "Article 279A; Union FM chairs; 3/4th weighted vote" },

  // Economy
  { k: "Repo rate", v: "6.50% — held by RBI MPC" },
  { k: "CRR", v: "4.50% of NDTL" },
  { k: "SDF rate", v: "6.25% (introduced Apr 2022, replaced fixed reverse repo floor)" },
  { k: "Inflation target", v: "4% ± 2% CPI (Flexible Inflation Targeting)" },
  { k: "Base year — CPI", v: "2012" },
  { k: "Base year — WPI", v: "2011-12" },
  { k: "Base year — GDP", v: "2011-12" },
  { k: "Fiscal deficit target", v: "FRBM: 3% of GDP (long-term glide path)" },
  { k: "Insurance FDI", v: "74% under automatic route" },

  // Schemes (flagship)
  { k: "PM-KISAN", v: "₹6,000/year to landholding farmers in 3 instalments" },
  { k: "PMJDY", v: "Financial inclusion — RuPay debit + ₹2 lakh accident cover" },
  { k: "Ayushman Bharat PM-JAY", v: "₹5 lakh/family/year secondary & tertiary care" },
  { k: "PMAY-G", v: "Housing for All (rural) — 25 sqm min unit area" },
  { k: "MGNREGA", v: "100 days of guaranteed wage employment per rural household" },
  { k: "PLI Scheme", v: "Production-Linked Incentive across 14 sectors" },
  { k: "PM Gati Shakti", v: "National Master Plan for multi-modal infrastructure (2021)" },

  // Environment & Ecology
  { k: "Ramsar Convention", v: "Wetlands of international importance (1971, Iran)" },
  { k: "India Ramsar sites", v: "85 (as of 2024)" },
  { k: "Project Tiger", v: "Launched 1973; NTCA is statutory under WLPA 1972" },
  { k: "Project Cheetah", v: "Reintroduction at Kuno National Park (2022)" },
  { k: "CITES", v: "Convention on Intl. Trade in Endangered Species (1975)" },
  { k: "Kyoto Protocol", v: "1997; binding emission targets on Annex-I parties" },
  { k: "Paris Agreement", v: "2015; goal: well below 2°C, pursue 1.5°C" },
  { k: "India NDC (updated)", v: "45% emission intensity cut by 2030 (vs 2005)" },
  { k: "Net-Zero target — India", v: "2070 (announced at COP-26, Glasgow)" },
  { k: "Green Hydrogen Mission", v: "5 MMT/yr production capacity target by 2030" },
  { k: "Montreal Protocol", v: "1987; ozone-depleting substances; Kigali Amendment 2016 (HFCs)" },

  // Geography
  { k: "Tropic of Cancer — India", v: "Passes through 8 states" },
  { k: "IST meridian", v: "82°30′ E through Mirzapur (UP)" },
  { k: "Highest peak (India)", v: "Kanchenjunga (8,586 m) — Sikkim" },
  { k: "Longest river (India)", v: "Ganga (~2,525 km)" },
  { k: "Coastline of India", v: "~7,516.6 km (mainland + islands)" },
  { k: "Deepest lake (India)", v: "Manasbal, Jammu & Kashmir" },

  // Science & Tech
  { k: "Chandrayaan-3", v: "Soft-landed near lunar south pole, 23 Aug 2023" },
  { k: "Aditya-L1", v: "India's first solar mission — halo orbit around L1" },
  { k: "Gaganyaan", v: "Human-rated launcher: LVM3 (HLVM3)" },
  { k: "ISRO HQ", v: "Bengaluru; first satellite — Aryabhata (1975)" },

  // History
  { k: "INC founded", v: "1885 by A.O. Hume; first session Bombay, W.C. Bonnerjee" },
  { k: "Poorna Swaraj", v: "Lahore Session, 26 Jan 1930 (Nehru presided)" },
  { k: "Quit India", v: "8 Aug 1942, Bombay (AICC session)" },
  { k: "Constituent Assembly", v: "First sat 9 Dec 1946; adopted Constitution 26 Nov 1949" },
  { k: "Constitution enforced", v: "26 January 1950" },

  // International
  { k: "UNSC — permanent members", v: "5 (China, France, Russia, UK, USA)" },
  { k: "UN founding", v: "24 October 1945; HQ New York" },
  { k: "WTO established", v: "1 January 1995 (succeeded GATT 1947)" },
  { k: "BRICS expansion (2024)", v: "+ Egypt, Ethiopia, Iran, UAE (Saudi invited)" },
  { k: "SCO", v: "Shanghai Cooperation Organisation — India full member since 2017" },
  { k: "Wassenaar Arrangement", v: "42 participating states; India joined 2017" },
  { k: "IMF SDR basket", v: "USD, EUR, CNY, JPY, GBP" },

  // Indices (issuing body)
  { k: "Human Development Index", v: "UNDP — life expectancy, education, GNI/capita" },
  { k: "Global Hunger Index", v: "Concern Worldwide & Welthungerhilfe" },
  { k: "Ease of Doing Business", v: "Discontinued 2021; replaced by B-READY (from 2024)" },
  { k: "World Press Freedom Index", v: "Reporters Without Borders (RSF)" },
  { k: "Global Innovation Index", v: "WIPO" },
];
