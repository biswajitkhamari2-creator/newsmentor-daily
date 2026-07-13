// Backend: UPSC AI News Assistant (FastAPI on Vercel)
export const API_BASE = "https://python-backend-ivory-two.vercel.app";

export type MentorMsg = { role: "user" | "assistant" | "system"; content: string };

export async function askMentor(opts: {
  message: string;
  history?: MentorMsg[];
  provider?: "gemini" | "ollama";
  language?: "en" | "hi" | "hinglish" | "or";
  mode?: "simple" | "advanced";
}): Promise<string> {
  const res = await fetch(`${API_BASE}/mentor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: opts.message,
      messages: opts.history ?? [],
      provider: opts.provider ?? "gemini",
      language: opts.language ?? "en",
      mode: opts.mode ?? "simple",
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  // Try JSON, else raw text
  try {
    const j = JSON.parse(text);
    return j.reply ?? j.response ?? j.answer ?? j.text ?? j.message ?? text;
  } catch {
    return text;
  }
}

export type LiveNews = {
  title: string;
  summary: string;
  source: string;
  link: string;
};

export async function fetchNews(refresh = false): Promise<LiveNews[]> {
  const res = await fetch(`${API_BASE}/news${refresh ? "?refresh=true" : ""}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  return (j.news ?? []) as LiveNews[];
}

export type LiveMcq = {
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  topic?: string;
};
export type LiveMains = {
  question: string;
  marks?: number;
  hint?: string;
  topic?: string;
};
export type LiveInterview = {
  question: string;
  approach?: string;
  topic?: string;
};

export async function fetchMcqs(): Promise<LiveMcq[]> {
  const res = await fetch(`${API_BASE}/mcqs`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  return (j.mcqs ?? []) as LiveMcq[];
}
export async function fetchMains(): Promise<LiveMains[]> {
  const res = await fetch(`${API_BASE}/mains`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  return (j.mains_questions ?? j.mains ?? []) as LiveMains[];
}
export async function fetchInterview(): Promise<LiveInterview[]> {
  const res = await fetch(`${API_BASE}/interview`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  return (j.interview_questions ?? j.interview ?? []) as LiveInterview[];
}

// Ask the mentor to grade a mains answer. Returns raw markdown feedback.
export async function evaluateAnswer(question: string, answer: string): Promise<string> {
  const prompt = `You are a strict UPSC Mains evaluator. Grade the answer below.

Question: ${question}

Candidate answer:
"""
${answer}
"""

Return ONLY compact markdown with these exact fields:
**Structure**: X/10
**Content**: X/10
**Clarity**: X/10
**Overall**: X/15
**Feedback**: 2-3 crisp lines on strengths, gaps and how to improve.`;
  return askMentor({ message: prompt, mode: "advanced" });
}
