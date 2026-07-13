export type Headline = {
  id: string;
  title: string;
  summary: string;
  category: "Polity" | "Economy" | "Environment" | "IR" | "S&T" | "Society";
  fullText: string;
};

export const headlines: Headline[] = [
  {
    id: "h1",
    title: "Supreme Court Upholds Constitutional Validity of Electoral Bonds Reform",
    summary:
      "A five-judge bench affirmed transparency amendments to political funding, mandating quarterly public disclosure by the ECI.",
    category: "Polity",
    fullText:
      "The Supreme Court, in a 4:1 verdict, upheld reforms requiring the Election Commission to publish donor-wise electoral bond data every quarter. The bench emphasized Article 19(1)(a) — the voter's right to information — as a facet of free speech. GS-II relevance: representation of people, transparency in political funding, role of ECI.",
  },
  {
    id: "h2",
    title: "RBI Maintains Repo Rate at 6.25%, Flags Sticky Food Inflation",
    summary:
      "The MPC held rates steady for a fourth consecutive meeting; FY26 CPI projection revised upward to 4.8%.",
    category: "Economy",
    fullText:
      "The Monetary Policy Committee retained the repo rate at 6.25% with a 5-1 vote, citing sticky food inflation driven by pulses and vegetables. Real GDP growth for FY26 is projected at 6.9%. GS-III relevance: monetary policy, inflation targeting framework, fiscal-monetary coordination.",
  },
  {
    id: "h3",
    title: "India Notifies Green Credit Rules for Ecosystem Restoration",
    summary:
      "MoEFCC finalizes methodology to award tradable green credits for water conservation and tree plantation on degraded land.",
    category: "Environment",
    fullText:
      "The Ministry of Environment notified detailed methodologies under the Green Credit Programme (GCP), enabling corporates and individuals to earn tradable credits by restoring degraded forest land or reviving water bodies. Credits are distinct from carbon credits. GS-III relevance: conservation, market-based environmental instruments.",
  },
  {
    id: "h4",
    title: "India–EU Sign Strategic Trade & Technology Council Roadmap",
    summary:
      "New agreement covers semiconductors, clean tech, and digital public infrastructure with a joint investment window of €10 billion.",
    category: "IR",
    fullText:
      "The India-EU TTC roadmap identifies three working groups: strategic technologies, green and clean energy, and trade & investment. Focus areas include semiconductor supply-chain resilience, 6G research, and interoperable DPI. GS-II relevance: bilateral groupings, effect on India's interests.",
  },
  {
    id: "h5",
    title: "ISRO Successfully Tests Reusable Launch Vehicle Landing Experiment",
    summary:
      "Pushpak, the winged RLV, executed a fully autonomous approach and landing under cross-wind conditions at Chitradurga.",
    category: "S&T",
    fullText:
      "ISRO's RLV-LEX-03 mission demonstrated precision autonomous landing under adverse wind, a key milestone toward a fully reusable orbital vehicle. GS-III relevance: achievements of Indians in S&T, indigenization of technology.",
  },
  {
    id: "h6",
    title: "Union Cabinet Clears National Mission on Natural Farming",
    summary:
      "Rs 2,481 crore outlay to bring 1 crore farmers under chemical-free farming across 15,000 clusters by 2026.",
    category: "Economy",
    fullText:
      "The Cabinet approved the National Mission on Natural Farming (NMNF) with a special focus on Bhartiya Prakritik Krishi Paddhati. GS-III relevance: agriculture, food security, cropping patterns, and sustainable agriculture.",
  },
  {
    id: "h7",
    title: "New Guidelines Issued for Bharatiya Nyaya Sanhita Implementation",
    summary:
      "MHA circulates SOPs on Zero FIR, e-summons, and forensic evidence collection under the new criminal codes.",
    category: "Polity",
    fullText:
      "The Ministry of Home Affairs issued SOPs to streamline implementation of the three new criminal laws. Mandatory forensic visits for offences carrying 7+ years imprisonment take effect nationwide. GS-II relevance: government policies, criminal justice reform.",
  },
  {
    id: "h8",
    title: "India Ranks 39th in Global Innovation Index 2025",
    summary:
      "India climbs one spot, leading lower-middle-income economies for the 14th consecutive year on innovation output.",
    category: "S&T",
    fullText:
      "WIPO's GII 2025 places India 39th globally, with strengths in ICT services exports, unicorn valuations, and intangible asset intensity. GS-III relevance: science and technology, indigenous R&D ecosystem.",
  },
];
