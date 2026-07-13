export type GsPaper = "Polity" | "Economy" | "Environment" | "IR" | "S&T";

export type SummaryPoint = {
  gs: GsPaper;
  point: string;
};

export const mockSummary: SummaryPoint[] = [
  {
    gs: "Polity",
    point:
      "Supreme Court upholds transparency reforms to electoral bonds — mandates quarterly ECI disclosure of donor-wise data (Article 19(1)(a)).",
  },
  {
    gs: "Polity",
    point:
      "MHA issues SOPs for BNS/BNSS/BSA rollout — Zero FIR, e-summons, and mandatory forensic visits for offences carrying 7+ years.",
  },
  {
    gs: "Economy",
    point:
      "RBI MPC holds repo rate at 6.25% (5-1 vote); FY26 CPI projection revised to 4.8% citing sticky food inflation.",
  },
  {
    gs: "Economy",
    point:
      "Cabinet clears National Mission on Natural Farming — ₹2,481 cr outlay, 1 crore farmers, 15,000 clusters by 2026.",
  },
  {
    gs: "Environment",
    point:
      "Green Credit Programme methodology notified — tradable credits for water conservation and afforestation; distinct from carbon credits.",
  },
  {
    gs: "Environment",
    point:
      "India commits to 30x30 targets under Global Biodiversity Framework — 30% of terrestrial and marine areas protected by 2030.",
  },
  {
    gs: "IR",
    point:
      "India–EU TTC roadmap operationalized — €10 bn joint window across semiconductors, clean tech, and Digital Public Infrastructure.",
  },
  {
    gs: "IR",
    point:
      "India assumes SCO Council of Heads of Government chair — agenda focuses on connectivity and counter-terror cooperation.",
  },
  {
    gs: "S&T",
    point:
      "ISRO RLV-LEX-03 (Pushpak) demonstrates autonomous cross-wind landing — milestone toward reusable orbital vehicle.",
  },
  {
    gs: "S&T",
    point:
      "India ranks 39th in Global Innovation Index 2025 — leads lower-middle-income economies for the 14th consecutive year.",
  },
];
