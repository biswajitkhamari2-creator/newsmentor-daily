// Map subject chips → syllabus topic ids (from src/data/mock.ts) or a custom points block.
// Clicking a subject in the Planner shows exactly what to study from the official UPSC syllabus.

export type SubjectEntry = {
  key: string;
  name: string;
  paper: string;
  topicIds?: string[];       // pulls points from syllabusDetail
  extraPoints?: string[];    // used when a subject isn't a single mains topic (CSAT, Current Affairs)
};

export const subjects: SubjectEntry[] = [
  { key: "polity",       name: "Polity & Constitution", paper: "GS-II",   topicIds: ["t7"] },
  { key: "governance",   name: "Governance",            paper: "GS-II",   topicIds: ["t8"] },
  { key: "ir",           name: "International Relations", paper: "GS-II", topicIds: ["t9"] },
  { key: "schemes",      name: "Welfare Schemes",       paper: "GS-II",   topicIds: ["t10"] },
  { key: "economy",      name: "Economics",             paper: "GS-III",  topicIds: ["t11"] },
  { key: "environment",  name: "Environment & Ecology", paper: "GS-III",  topicIds: ["t12"] },
  { key: "st",           name: "Science & Tech",        paper: "GS-III",  topicIds: ["t13"] },
  { key: "security",     name: "Internal Security",     paper: "GS-III",  topicIds: ["t14"] },
  { key: "disaster",     name: "Disaster Management",   paper: "GS-III",  topicIds: ["t15"] },
  { key: "history",      name: "History",               paper: "GS-I",    topicIds: ["t1", "t2"] },
  { key: "culture",      name: "Art & Culture",         paper: "GS-I",    topicIds: ["t3"] },
  { key: "worldhistory", name: "World History",         paper: "GS-I",    topicIds: ["t4"] },
  { key: "society",      name: "Indian Society",        paper: "GS-I",    topicIds: ["t5"] },
  { key: "geography",    name: "Geography",             paper: "GS-I",    topicIds: ["t6"] },
  { key: "ethics",       name: "Ethics",                paper: "GS-IV",   topicIds: ["t16", "t17", "t18"] },
  {
    key: "csat",
    name: "CSAT (Prelims Paper II)",
    paper: "Prelims",
    extraPoints: [
      "Comprehension.",
      "Interpersonal skills including communication skills.",
      "Logical reasoning and analytical ability.",
      "Decision-making and problem solving.",
      "General mental ability.",
      "Basic numeracy (numbers and their relations, orders of magnitude etc.) — Class X level.",
      "Data interpretation (charts, graphs, tables, data sufficiency etc.) — Class X level.",
      "Qualifying paper — minimum 33% required.",
    ],
  },
  {
    key: "currentaffairs",
    name: "Current Affairs",
    paper: "Prelims + Mains",
    extraPoints: [
      "Current events of national and international importance (Prelims).",
      "Daily editorial reading — The Hindu, Indian Express, Livemint.",
      "PIB releases and government scheme updates.",
      "Yojana & Kurukshetra monthly magazines.",
      "Economic Survey and Union Budget highlights.",
      "PRS legislative briefs and Standing Committee reports.",
      "Link current events to static syllabus topics for GS mains.",
    ],
  },
];
