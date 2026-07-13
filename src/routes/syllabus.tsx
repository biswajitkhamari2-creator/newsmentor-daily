import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Loader2, BookOpen, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronRight, ArrowRight, Gauge } from "lucide-react";
import { syllabus, mockTests, type SyllabusTopic } from "@/data/mock";
import { syllabusDetail, paperOverview } from "@/data/syllabusDetail";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { askMentor } from "@/lib/api";
import { usePlannerStore } from "@/hooks/usePlannerStore";



export const Route = createFileRoute("/syllabus")({
  head: () => ({
    meta: [
      { title: "Syllabus — UPSC Hero by Biswajit" },
      { name: "description", content: "Search the official UPSC CSE syllabus (Prelims + Mains GS I–IV) and ask AI whether any topic is inside the syllabus." },
    ],
  }),
  component: SyllabusPage,
});

type Match = {
  paperId: string;
  paperName: string;
  topic: SyllabusTopic;
  points: string[];
  hitPoints: string[];
};

type Verdict = "in" | "out" | "partial" | "unknown";

function classify(text: string): Verdict {
  const t = text.toLowerCase();
  if (/\b(not\s+(in|part\s+of|covered)|outside|beyond)\b/.test(t) && !/is\s+in/.test(t)) return "out";
  if (/\bpartial|indirect|tangential|related\b/.test(t)) return "partial";
  if (/\byes|is\s+part\s+of|covered|included|falls under|comes under|in the syllabus\b/.test(t)) return "in";
  return "unknown";
}

function SyllabusPage() {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [expandedPaper, setExpandedPaper] = useState<string | null>(syllabus[0]?.id ?? null);
  const [aiVerdict, setAiVerdict] = useState<Verdict | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Live tick — repaints the "updated Xs ago" label so it feels live.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 15_000);
    const onStorage = () => setTick((t) => t + 1);
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(id); window.removeEventListener("storage", onStorage); };
  }, []);

  const { progress: liveProgress, tasks: plannerTasks, streak } = usePlannerStore();

  // Live topic progress: planner store's per-topic %, falling back to the seed value.
  const liveTopicPct = (t: SyllabusTopic) => {
    const p = liveProgress?.[t.id];
    return typeof p === "number" && p > 0 ? p : t.progress;
  };
  const livePaperPct = (paperTopics: SyllabusTopic[]) =>
    Math.round(paperTopics.reduce((s, t) => s + liveTopicPct(t), 0) / paperTopics.length);

  const overall = Math.round(
    syllabus.flatMap((p) => p.topics).reduce((s, t) => s + liveTopicPct(t), 0) /
      syllabus.flatMap((p) => p.topics).length,
  );

  // Live signals
  const attempted = mockTests.filter((m) => m.attempted).length;
  const doneToday = plannerTasks.filter((t) => t.done).length;
  const lastSync = new Date();



  const matches = useMemo<Match[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Match[] = [];
    for (const paper of syllabus) {
      for (const topic of paper.topics) {
        const detail = syllabusDetail[topic.id];
        const points = detail?.points ?? [];
        const hits = points.filter((p) => p.toLowerCase().includes(q));
        const nameHit = topic.name.toLowerCase().includes(q);
        if (nameHit || hits.length > 0) {
          out.push({
            paperId: paper.id,
            paperName: paper.name,
            topic,
            points,
            hitPoints: hits.length ? hits : points.slice(0, 3),
          });
        }
      }
    }
    return out;
  }, [query]);

  const askAI = async () => {
    const q = aiQuery.trim();
    if (!q || aiBusy) return;
    setAiBusy(true);
    setAiAnswer(null);
    setAiVerdict(null);
    setAiError(null);
    try {
      const prompt = `You are a UPSC Civil Services Examination (CSE) syllabus expert. The user wants to know if a topic is part of the official UPSC CSE syllabus (Prelims Paper I & II / Mains Essay, GS-I, GS-II, GS-III, GS-IV).

Topic asked: "${q}"

Answer in this exact format (short, 4-6 lines):
Verdict: <Yes / No / Partially>
Paper: <Prelims / GS-I / GS-II / GS-III / GS-IV / Not applicable>
Syllabus point: <exact official syllabus line if yes, else "—">
Why: <1-2 line reason>
Study tip: <1 line on how to approach it, or say "Not required" if outside syllabus>`;
      const reply = await askMentor({ message: prompt, provider: "gemini" });
      setAiAnswer(reply);
      setAiVerdict(classify(reply));
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl">Syllabus</h1>
        <p className="text-sm text-muted-foreground">
          Search the official UPSC CSE syllabus or ask AI whether any topic is inside the syllabus.
        </p>
      </header>

      {/* Syllabus snapshot */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between gap-2 text-base">
            <span className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-gold" /> Syllabus snapshot
            </span>
            <span className="text-xs font-normal text-muted-foreground tabular-nums">
              Overall <AnimatedCounter value={overall} suffix="%" />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {syllabus.map((paper, i) => {
            const avg = Math.round(
              paper.topics.reduce((s, t) => s + t.progress, 0) / paper.topics.length,
            );
            const isOpen = expandedPaper === paper.id;
            return (
              <div key={paper.id} className="rounded-lg border bg-card/50">
                <button
                  type="button"
                  onClick={() => setExpandedPaper(isOpen ? null : paper.id)}
                  className="w-full text-left p-3 hover:bg-muted/40 rounded-lg transition"
                  aria-expanded={isOpen}
                >
                  <div className="flex justify-between text-sm mb-1.5 items-center gap-2">
                    <span className="font-medium flex items-center gap-1.5 min-w-0">
                      <ChevronDown
                        className={`h-4 w-4 text-gold shrink-0 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                      />
                      <span className="truncate">{paper.name}</span>
                    </span>
                    <span className="text-muted-foreground tabular-nums text-xs shrink-0">
                      {avg}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-gold animate-bar"
                      style={{ width: `${avg}%`, animationDelay: `${i * 90}ms` }}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 pt-1 grid gap-2 sm:grid-cols-2 animate-fade-in-up">
                    {paper.topics.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setQuery(t.name)}
                        className="group text-left rounded-md border p-2.5 hover:border-gold/60 hover:shadow-sm transition"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium flex items-center gap-1.5 min-w-0">
                            <BookOpen className="h-3 w-3 text-gold/70 shrink-0" />
                            <span className="truncate">{t.name}</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-gold transition shrink-0" />
                        </div>
                        <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full gradient-emerald" style={{ width: `${t.progress}%` }} />
                        </div>
                        <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">
                          {t.progress}%
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/planner">Open full planner <ArrowRight className="ml-1 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>

      {/* Search */}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4" /> Search syllabus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: federalism, climate change, ethics, art forms…"
              className="pl-9 h-11"
            />
          </div>

          {query.trim() && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">
                {matches.length} match{matches.length === 1 ? "" : "es"} in the official syllabus
              </div>
              {matches.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No direct match found. Try the AI check below to confirm.
                </div>
              ) : (
                matches.map((m) => (
                  <div key={m.paperId + m.topic.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-serif text-lg">{m.topic.name}</div>
                      <Badge variant="outline">{m.paperName.split(" — ")[0]}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {syllabusDetail[m.topic.id]?.paperRef ?? m.paperName}
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {m.hitPoints.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-gold mt-1">•</span>
                          <span>{highlight(p, query)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI check */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-gold" /> Ask AI — is it in the syllabus?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askAI()}
              placeholder="e.g. Is quantum computing in UPSC syllabus?"
              className="h-11"
            />
            <Button onClick={askAI} disabled={aiBusy || !aiQuery.trim()} className="h-11">
              {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Check</span>
            </Button>
          </div>

          {aiError && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5" /> {aiError}
            </div>
          )}

          {aiAnswer && (
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                {aiVerdict === "in" && (
                  <Badge className="bg-emerald-600 hover:bg-emerald-600"><CheckCircle2 className="h-3 w-3 mr-1" />In syllabus</Badge>
                )}
                {aiVerdict === "partial" && (
                  <Badge className="bg-amber-500 hover:bg-amber-500"><AlertCircle className="h-3 w-3 mr-1" />Partially / related</Badge>
                )}
                {aiVerdict === "out" && (
                  <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Not in syllabus</Badge>
                )}
                {aiVerdict === "unknown" && <Badge variant="outline">AI verdict</Badge>}
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{aiAnswer}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overview cards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" /> All papers
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {syllabus.map((p) => (
            <div key={p.id} className="rounded-lg border p-3">
              <div className="font-serif">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {paperOverview[p.id] ?? `${p.topics.length} topics`}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.topics.map((t) => (
                  <Badge
                    key={t.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setQuery(t.name)}
                  >
                    {t.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function highlight(text: string, q: string) {
  const query = q.trim();
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-gold/30 text-inherit rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}
