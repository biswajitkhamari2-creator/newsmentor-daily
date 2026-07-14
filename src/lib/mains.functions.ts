import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  topic: z.string().min(2).max(200),
  count: z.number().int().min(1).max(6).default(4),
});

type Question = {
  question: string;
  marks: number;
  wordLimit: number;
  paper: string;
  hint: string;
  keyPoints: string[];
};

const PAPERS = ["GS-I", "GS-II", "GS-III", "GS-IV", "Essay"] as const;

const TEMPLATES: Array<{
  paper: (typeof PAPERS)[number];
  stem: (t: string) => string;
  hint: (t: string) => string;
  points: (t: string) => string[];
}> = [
  {
    paper: "GS-I",
    stem: (t) => `Critically examine the historical and socio-cultural dimensions of ${t} in the Indian context.`,
    hint: (t) => `Trace the evolution of ${t} and connect past legacies to present-day realities.`,
    points: (t) => [
      `Historical background and key milestones of ${t}`,
      `Socio-cultural forces shaping ${t}`,
      `Regional variations and case studies`,
      `Continuity and change over time`,
    ],
  },
  {
    paper: "GS-II",
    stem: (t) => `Discuss the governance and policy challenges associated with ${t}. Suggest a way forward.`,
    hint: (t) => `Anchor the answer in constitutional provisions, institutions and recent policy moves on ${t}.`,
    points: (t) => [
      `Constitutional and legal framework around ${t}`,
      `Role of Union, State and local institutions`,
      `Implementation gaps and accountability issues`,
      `Reform measures and best practices`,
    ],
  },
  {
    paper: "GS-III",
    stem: (t) => `Analyze the economic, technological and environmental implications of ${t} for India.`,
    hint: (t) => `Balance growth, sustainability and security concerns while discussing ${t}.`,
    points: (t) => [
      `Economic impact and sectoral linkages of ${t}`,
      `Technology and innovation dimensions`,
      `Environmental and sustainability trade-offs`,
      `Policy interventions and global comparisons`,
    ],
  },
  {
    paper: "GS-IV",
    stem: (t) => `"${t.charAt(0).toUpperCase() + t.slice(1)} tests the ethical fabric of public administration." Examine with suitable examples.`,
    hint: (t) => `Bring in ethical theories, case studies and administrative dilemmas relevant to ${t}.`,
    points: (t) => [
      `Ethical issues raised by ${t}`,
      `Relevant values: integrity, objectivity, empathy`,
      `Real-world case studies or dilemmas`,
      `Institutional and personal responses`,
    ],
  },
  {
    paper: "GS-II",
    stem: (t) => `Evaluate India's international engagement on ${t} and its strategic implications.`,
    hint: (t) => `Cover bilateral, regional and multilateral dimensions of ${t}.`,
    points: (t) => [
      `Key partners and forums on ${t}`,
      `Strategic and economic stakes for India`,
      `Emerging challenges and opportunities`,
      `Policy recommendations`,
    ],
  },
  {
    paper: "Essay",
    stem: (t) => `"${t.charAt(0).toUpperCase() + t.slice(1)} — challenge, opportunity, and the road ahead." Reflect.`,
    hint: (t) => `Adopt a balanced, essayistic tone with philosophical, factual and forward-looking angles on ${t}.`,
    points: (t) => [
      `Framing ${t} in contemporary context`,
      `Multiple perspectives — social, economic, ethical`,
      `Case studies and examples`,
      `Vision for the future`,
    ],
  },
];

export const generateMainsQuestions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const topic = data.topic.trim();
    const count = Math.min(data.count, TEMPLATES.length);

    const questions: Question[] = TEMPLATES.slice(0, count).map((tpl, i) => {
      const marks = i % 2 === 0 ? 15 : 10;
      return {
        question: tpl.stem(topic),
        marks,
        wordLimit: marks === 15 ? 250 : 150,
        paper: tpl.paper,
        hint: tpl.hint(topic),
        keyPoints: tpl.points(topic),
      };
    });

    return { questions };
  });
