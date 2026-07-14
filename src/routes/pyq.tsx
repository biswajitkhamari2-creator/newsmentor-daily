import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Timer, CheckCircle2, Play, Search, RefreshCw, AlertCircle, Radio, Sparkles, Loader2, Archive, Trash2, BookmarkCheck, Bookmark, BookmarkPlus } from "lucide-react";
import { pyqs, mockTests } from "@/data/mock";
import { fetchMcqs, fetchMains, type LiveMcq, type LiveMains } from "@/lib/api";
import { generateMainsQuestions } from "@/lib/mains.functions";
import { generatePrelimsMcqs } from "@/lib/mcqs.functions";
import { useServerFn } from "@tanstack/react-start";
import { useMainsArchive, type ArchivedQuestion } from "@/hooks/useMainsArchive";
import { useActivityStore, relativeTime } from "@/hooks/useActivityStore";
import { useMcqBookmarks } from "@/hooks/useMcqBookmarks";

export const Route = createFileRoute("/pyq")({
  head: () => ({
    meta: [
      { title: "PYQ Bank & Mock Tests — UPSC Hero by Biswajit" },
      { name: "description", content: "Searchable UPSC previous year questions (2020–2024) with model answers, plus timed prelims & mains mock tests." },
    ],
  }),
  component: PyqPage,
});

const years = ["All", "2024", "2023", "2022", "2021", "2020"];
const papers = ["All", "Prelims", "Mains GS-I", "Mains GS-II", "Mains GS-III", "Mains GS-IV", "Essay"];

function PyqPage() {
  const [q, setQ] = useState("");
  const [year, setYear] = useState("All");
  const [paper, setPaper] = useState("All");
  const { attempts, logAttempt } = useActivityStore();

  const maxFor = (t: typeof mockTests[number]) =>
    t.type === "Prelims" ? t.questions * 2 : t.type === "Mains" ? t.questions * 10 : t.questions;

  const startMock = (t: typeof mockTests[number]) => {
    const max = maxFor(t);
    const input = window.prompt(`Log your score for "${t.title}" (out of ${max}):`);
    if (input === null) return;
    const score = Number(input);
    if (!Number.isFinite(score) || score < 0 || score > max) {
      window.alert(`Please enter a valid number between 0 and ${max}.`);
      return;
    }
    logAttempt({ mockId: t.id, title: t.title, type: t.type, questions: t.questions, score, max });
  };


  const filtered = pyqs.filter(
    (p) =>
      (year === "All" || String(p.year) === year) &&
      (paper === "All" || p.paper === paper) &&
      (q === "" || p.question.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-gold">Practice Vault</div>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1">PYQ Bank & Mock Tests</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Every previous-year question with model answers. Full-length and sectional mocks with instant scoring.
        </p>
      </header>

      <Tabs defaultValue="generator">
        <TabsList>
          <TabsTrigger value="generator"><Sparkles className="h-3.5 w-3.5 mr-1" /> Mains Generator</TabsTrigger>
          <TabsTrigger value="archive"><Archive className="h-3.5 w-3.5 mr-1" /> Archive</TabsTrigger>
          <TabsTrigger value="pyq">PYQ Bank</TabsTrigger>
          <TabsTrigger value="mock">Mock Tests</TabsTrigger>
          <TabsTrigger value="bookmarks"><Bookmark className="h-3.5 w-3.5 mr-1" /> Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-4">
          <MainsGenerator />
        </TabsContent>

        <TabsContent value="archive" className="mt-4">
          <MainsArchivePanel />
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-4">
          <BookmarkedMcqsPanel />
        </TabsContent>


        <TabsContent value="pyq" className="mt-4 space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search question…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
              </div>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>{years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={paper} onValueChange={setPaper}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>{papers.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">{filtered.length} results</div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filtered.map((p) => (
              <Collapsible key={p.id}>
                <Card className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">{p.paper}</Badge>
                      <Badge variant="outline">{p.year}</Badge>
                      <Badge variant="outline" className="border-gold/50 text-gold">{p.subject}</Badge>
                      {p.marks && <Badge variant="outline">{p.marks} marks</Badge>}
                    </div>
                    <p className="mt-3 font-serif text-lg leading-snug">{p.question}</p>
                    <CollapsibleTrigger className="group mt-3 text-sm text-primary hover:text-gold inline-flex items-center gap-1">
                      Reveal hint & model answer
                      <ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-3">
                      <div className="rounded-md border border-gold/40 bg-gold/5 p-3 text-sm">
                        <span className="font-semibold text-gold">Hint · </span>{p.hint}
                      </div>
                      <div className="rounded-md bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                        <div className="font-semibold mb-1">Model answer</div>
                        {p.answer}
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))}
            {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground">No matches. Try broadening your filters.</div>}
          </div>
        </TabsContent>

        <TabsContent value="mock" className="mt-4">
          <UnlimitedMockPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const SUBJECTS: { key: string; label: string; subtopics: string[] }[] = [
  { key: "Polity", label: "Polity", subtopics: ["President — election & impeachment", "Parliament", "Judiciary", "Fundamental Rights", "DPSP", "Federalism", "Emergency Provisions", "Constitutional Bodies"] },
  { key: "Economy", label: "Economy", subtopics: ["Monetary Policy & RBI", "Fiscal Policy & Budget", "Banking & NPAs", "Inflation & CPI", "External Sector & BoP", "GST", "Agriculture & MSP", "Capital Markets"] },
  { key: "History", label: "History", subtopics: ["Indus Valley", "Mauryan Empire", "Mughal Empire", "1857 Revolt", "Freedom Struggle 1885-1919", "Gandhian Movements", "Post-Independence Consolidation"] },
  { key: "Geography", label: "Geography", subtopics: ["Indian Monsoon", "Rivers & Drainage", "Soils of India", "Climatology", "Oceanography", "Volcanoes & Earthquakes", "Population & Urbanisation"] },
  { key: "Environment", label: "Environment", subtopics: ["Biodiversity Hotspots", "Protected Areas", "Climate Change & COP", "Wetlands & Ramsar", "Pollution Control Acts", "Renewable Energy"] },
  { key: "Science & Tech", label: "Science & Tech", subtopics: ["Space — ISRO Missions", "Defence Tech", "Biotech & Vaccines", "IT & AI", "Nuclear Programme"] },
  { key: "IR", label: "International Relations", subtopics: ["India-US", "India-China", "India-Russia", "Neighbourhood First", "QUAD & Indo-Pacific", "UN & Multilateralism"] },
  { key: "Current Affairs", label: "Current Affairs", subtopics: ["Recent Schemes", "Recent SC Judgments", "Recent Bills & Acts", "Reports & Indices", "Summits & Awards"] },
];

function UnlimitedMockPanel() {
  const genMcqs = useServerFn(generatePrelimsMcqs);
  const bookmarks = useMcqBookmarks();
  const [subject, setSubject] = useState(SUBJECTS[0].key);
  const [subtopic, setSubtopic] = useState(SUBJECTS[0].subtopics[0]);
  const [custom, setCustom] = useState("");
  const [pages, setPages] = useState<LiveMcq[][]>([]);
  const [pageIdx, setPageIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const currentSubject = SUBJECTS.find((s) => s.key === subject) ?? SUBJECTS[0];
  const effectiveTopic = custom.trim()
    ? `${subject} → ${custom.trim()}`
    : `${subject} → ${subtopic}`;

  const loadPage = async (nextIdx: number, reset = false) => {
    setLoading(true); setError(null);
    try {
      const avoid = reset ? [] : pages.flat().map((m) => m.question);
      const out = await genMcqs({
        data: {
          topic: effectiveTopic,
          count: 20,
          seed: `page-${nextIdx}-${Date.now()}`,
          avoid,
        },
      });
      const batch = out.mcqs as LiveMcq[];
      setPages((prev) => (reset ? [batch] : [...prev, batch]));
      setPageIdx(reset ? 0 : nextIdx);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      if (msg.includes("429")) setError("Rate limit hit. Retry in a moment.");
      else if (msg.includes("402")) setError("AI credits exhausted. Add credits to continue.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const start = () => {
    setAnswers({}); setRevealed({});
    loadPage(0, true);
  };

  const next = () => {
    if (pageIdx + 1 < pages.length) { setPageIdx(pageIdx + 1); return; }
    loadPage(pages.length, false);
  };

  const prev = () => { if (pageIdx > 0) setPageIdx(pageIdx - 1); };

  const currentPage = pages[pageIdx] ?? [];
  const pageOffset = pageIdx * 20;

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="font-semibold">Unlimited Mock Test — pick a topic & subtopic</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Subject</label>
              <Select value={subject} onValueChange={(v) => { setSubject(v); const s = SUBJECTS.find((x) => x.key === v); if (s) setSubtopic(s.subtopics[0]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Subtopic</label>
              <Select value={subtopic} onValueChange={setSubtopic}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{currentSubject.subtopics.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Custom (optional)</label>
              <Input placeholder="e.g. Impeachment of President" value={custom} onChange={(e) => setCustom(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={start} disabled={loading}>
              {loading && pages.length === 0 ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1" />}
              {pages.length ? "Restart with these" : "Start test"}
            </Button>
            <Badge variant="outline" className="border-gold/50 text-gold">20 questions per page · unlimited pages</Badge>
            <span className="text-xs text-muted-foreground ml-auto">Focus: {effectiveTopic}</span>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {pages.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl">Page {pageIdx + 1} · Q{pageOffset + 1}–{pageOffset + currentPage.length}</h3>
            <div className="text-xs text-muted-foreground">Total generated: {pages.flat().length}</div>
          </div>

          <div className="space-y-3">
            {currentPage.map((m, i) => {
              const qNum = pageOffset + i + 1;
              const key = `${pageIdx}-${i}`;
              const picked = answers[key];
              const isRevealed = revealed[i];
              return (
                <Card key={key} className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge className="bg-primary text-primary-foreground">Q{qNum}</Badge>
                      {m.topic && <Badge variant="outline">{m.topic}</Badge>}
                    </div>
                    <p className="mt-3 font-serif text-lg leading-snug">{m.question}</p>
                    {m.options && (
                      <ul className="mt-3 space-y-1.5 text-sm">
                        {m.options.map((o, j) => {
                          const letter = String.fromCharCode(97 + j);
                          const isPicked = picked === o;
                          const isCorrect = isRevealed && m.answer && o === m.answer;
                          const isWrong = isRevealed && isPicked && o !== m.answer;
                          return (
                            <li key={j}>
                              <button
                                type="button"
                                onClick={() => setAnswers((a) => ({ ...a, [key]: o }))}
                                className={`w-full text-left flex gap-2 px-3 py-1.5 rounded-md border transition ${
                                  isCorrect ? "border-gold bg-gold/10" :
                                  isWrong ? "border-destructive/60 bg-destructive/10" :
                                  isPicked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                                }`}
                              >
                                <span className="text-gold">{letter})</span><span>{o}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}>
                        {isRevealed ? "Hide answer" : "Reveal answer"}
                      </Button>
                      {isRevealed && m.answer && (
                        <span className="text-sm text-gold">Correct: {m.answer}</span>
                      )}
                    </div>
                    {isRevealed && m.explanation && (
                      <div className="mt-2 rounded-md bg-muted/40 p-3 text-sm whitespace-pre-wrap">{m.explanation}</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={prev} disabled={pageIdx === 0 || loading}>← Previous</Button>
            <div className="text-xs text-muted-foreground">
              Answered {Object.keys(answers).filter((k) => k.startsWith(`${pageIdx}-`)).length} / {currentPage.length}
            </div>
            <Button onClick={next} disabled={loading}>
              {loading ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Generating…</> : <>Next 20 →</>}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function LivePractice() {
  const [mcqs, setMcqs] = useState<LiveMcq[] | null>(null);
  const [mains, setMains] = useState<LiveMains[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"backend" | "ai" | null>(null);
  const [mcqTopic, setMcqTopic] = useState("current affairs");
  const genMcqs = useServerFn(generatePrelimsMcqs);

  const loadFromAi = async (topic: string) => {
    setLoading(true); setError(null);
    try {
      const [ai, n] = await Promise.all([
        genMcqs({ data: { topic, count: 6 } }),
        fetchMains().catch(() => [] as LiveMains[]),
      ]);
      setMcqs(ai.mcqs as LiveMcq[]);
      setMains(n);
      setSource("ai");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [m, n] = await Promise.all([
        fetchMcqs().catch(() => [] as LiveMcq[]),
        fetchMains().catch(() => [] as LiveMains[]),
      ]);
      if (m.length === 0) {
        await loadFromAi(mcqTopic);
        setMains(n);
        return;
      }
      setMcqs(m); setMains(n); setSource("backend");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-gold/50 text-gold">
          {source === "ai" ? "AI-generated · Lovable Gateway" : "Vercel /mcqs · /mains"}
        </Badge>
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="MCQ topic (e.g. Monetary Policy)"
            value={mcqTopic}
            onChange={(e) => setMcqTopic(e.target.value)}
            className="h-8 text-sm"
          />
          <Button size="sm" variant="secondary" onClick={() => loadFromAi(mcqTopic)} disabled={loading}>
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Generate
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} /> Reload
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">
          {loading ? "Loading…" : `${mcqs?.length ?? 0} MCQs · ${mains?.length ?? 0} Mains prompts`}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading && (
        <Card className="shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Fetching live questions…
          </CardContent>
        </Card>
      )}



      {(mcqs?.length ?? 0) > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif text-xl">Prelims MCQs</h3>
          {mcqs!.map((m, i) => (
            <Collapsible key={`mcq-${i}`}>
              <Card className="shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className="bg-primary text-primary-foreground">Prelims</Badge>
                    {m.topic && <Badge variant="outline">{m.topic}</Badge>}
                  </div>
                  <p className="mt-3 font-serif text-lg leading-snug">{m.question}</p>
                  {m.options && (
                    <ul className="mt-3 space-y-1 text-sm">
                      {m.options.map((o, j) => (
                        <li key={j} className="flex gap-2"><span className="text-gold">{String.fromCharCode(97 + j)})</span>{o}</li>
                      ))}
                    </ul>
                  )}
                  {(m.answer || m.explanation) && (
                    <>
                      <CollapsibleTrigger className="group mt-3 text-sm text-primary hover:text-gold inline-flex items-center gap-1">
                        Reveal answer <ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 space-y-2">
                        {m.answer && <div className="rounded-md border border-gold/40 bg-gold/5 p-3 text-sm"><strong className="text-gold">Answer: </strong>{m.answer}</div>}
                        {m.explanation && <div className="rounded-md bg-muted/40 p-3 text-sm whitespace-pre-wrap">{m.explanation}</div>}
                      </CollapsibleContent>
                    </>
                  )}
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {(mains?.length ?? 0) > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif text-xl">Mains prompts</h3>
          {mains!.map((m, i) => (
            <Card key={`mn-${i}`} className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge className="bg-primary text-primary-foreground">Mains</Badge>
                  {m.marks && <Badge variant="outline">{m.marks} marks</Badge>}
                  {m.topic && <Badge variant="outline">{m.topic}</Badge>}
                </div>
                <p className="mt-3 font-serif text-lg leading-snug">{m.question}</p>
                {m.hint && <div className="mt-3 rounded-md border border-gold/40 bg-gold/5 p-3 text-sm"><strong className="text-gold">Hint · </strong>{m.hint}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

type GeneratedQ = {
  id: string;
  question: string;
  marks: number;
  wordLimit: number;
  paper: string;
  hint: string;
  keyPoints: string[];
  modelAnswer: string;
};

function MainsGenerator() {
  const generate = useServerFn(generateMainsQuestions);
  const archive = useMainsArchive();
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("4");
  const [questions, setQuestions] = useState<GeneratedQ[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(null); setQuestions(null);
    try {
      const out = await generate({ data: { topic: topic.trim(), count: Number(count) } });
      const qs = out.questions as GeneratedQ[];
      setQuestions(qs);
      // auto-archive every generated question
      archive.addMany(qs.map((q) => ({ ...q, topic: topic.trim() })));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      if (msg.includes("429")) setError("Rate limit hit. Please retry in a moment.");
      else if (msg.includes("402")) setError("AI credits exhausted. Add credits in your workspace to continue.");
      else setError(msg);
    } finally {
      setLoading(false);
    }

  };

  const suggestions = ["Cooperative federalism", "Climate change & India", "Ethics in public service", "Green Hydrogen Mission", "India-EU FTA"];

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="font-semibold">Generate UPSC Mains questions on any topic</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Enter a topic (e.g. Fiscal federalism, Article 370, Monsoon dynamics)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !loading) onGenerate(); }}
              className="flex-1 min-w-[240px]"
            />
            <Select value={count} onValueChange={setCount}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["2","3","4","5","6"].map((n) => <SelectItem key={n} value={n}>{n} questions</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={onGenerate} disabled={loading || !topic.trim()} className="bg-gold text-gold-foreground hover:bg-gold/90">
              {loading ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Generating…</> : <><Sparkles className="h-3.5 w-3.5 mr-1" /> Generate</>}
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="text-muted-foreground">Try:</span>
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => setTopic(s)} className="rounded-full border px-2 py-0.5 hover:border-gold/60 hover:text-gold transition">
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: Number(count) }).map((_, i) => (
            <Card key={i} className="shadow-sm animate-pulse">
              <CardContent className="p-5 space-y-2">
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="h-5 w-4/5 bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {questions && questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id} className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge className="bg-primary text-primary-foreground">{q.paper}</Badge>
                  <Badge variant="outline">{q.marks} marks</Badge>
                  <Badge variant="outline" className="border-gold/50 text-gold">{q.wordLimit} words</Badge>
                  <Badge variant="outline" className="font-mono text-[10px] tracking-wider">{q.id}</Badge>
                </div>
                <p className="mt-3 font-serif text-lg leading-snug">{q.question}</p>
                <Tabs defaultValue={`q-${i}`} className="mt-4">
                  <TabsList>
                    <TabsTrigger value={`q-${i}`}>Question</TabsTrigger>
                    <TabsTrigger value={`h-${i}`}>Hint & Key points</TabsTrigger>
                    <TabsTrigger value={`a-${i}`}>Model Answer</TabsTrigger>
                  </TabsList>
                  <TabsContent value={`q-${i}`} className="mt-3">
                    <div className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                      Attempt this question in <strong>{q.wordLimit} words</strong> within ~{q.marks === 15 ? 18 : 9} minutes. Reference ID: <span className="font-mono text-foreground">{q.id}</span>.
                    </div>
                  </TabsContent>
                  <TabsContent value={`h-${i}`} className="mt-3 space-y-3">
                    <div className="rounded-md border border-gold/40 bg-gold/5 p-3 text-sm">
                      <span className="font-semibold text-gold">Hint · </span>{q.hint}
                    </div>
                    <div className="rounded-md bg-muted/40 p-3 text-sm">
                      <div className="font-semibold mb-1">Key points to cover</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {q.keyPoints.map((kp, j) => <li key={j}>{kp}</li>)}
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value={`a-${i}`} className="mt-3">
                    <div className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm whitespace-pre-line leading-relaxed">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold text-primary">Model Answer</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{q.id}</span>
                      </div>
                      {q.modelAnswer}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !questions && !error && (
        <Card className="shadow-sm border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground text-center">
            Enter any UPSC topic above and press Generate — the AI will craft exam-style Mains questions with hints and key points.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MainsArchivePanel() {
  const { items, remove, clear, ready } = useMainsArchive();
  const [q, setQ] = useState("");
  const [paperFilter, setPaperFilter] = useState("All");

  const paperOptions = ["All", ...Array.from(new Set(items.map((i) => i.paper)))];
  const filtered = items.filter(
    (it) =>
      (paperFilter === "All" || it.paper === paperFilter) &&
      (q === "" ||
        it.question.toLowerCase().includes(q.toLowerCase()) ||
        it.topic.toLowerCase().includes(q.toLowerCase()) ||
        it.id.toLowerCase().includes(q.toLowerCase())),
  );

  if (!ready) return null;

  if (items.length === 0) {
    return (
      <Card className="shadow-sm border-dashed">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          <Archive className="h-6 w-6 mx-auto mb-2 opacity-60" />
          Your archive is empty. Generated Mains questions and model answers will be saved here automatically.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search archive by topic, ID or question…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={paperFilter} onValueChange={setPaperFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{paperOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Badge variant="outline" className="border-gold/50 text-gold">
            <BookmarkCheck className="h-3 w-3 mr-1" /> {items.length} saved
          </Badge>
          <Button size="sm" variant="ghost" onClick={() => { if (confirm("Clear entire archive?")) clear(); }}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear all
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((it, i) => (
          <Card key={it.id} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge className="bg-primary text-primary-foreground">{it.paper}</Badge>
                <Badge variant="outline">{it.marks} marks</Badge>
                <Badge variant="outline" className="border-gold/50 text-gold">{it.wordLimit} words</Badge>
                <Badge variant="outline" className="font-mono text-[10px] tracking-wider">{it.id}</Badge>
                <Badge variant="secondary" className="text-[10px]">Topic: {it.topic}</Badge>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {new Date(it.savedAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-3 font-serif text-lg leading-snug">{it.question}</p>
              <Tabs defaultValue={`aq-${i}`} className="mt-4">
                <TabsList>
                  <TabsTrigger value={`aq-${i}`}>Question</TabsTrigger>
                  <TabsTrigger value={`ah-${i}`}>Hint & Key points</TabsTrigger>
                  <TabsTrigger value={`aa-${i}`}>Model Answer</TabsTrigger>
                </TabsList>
                <TabsContent value={`aq-${i}`} className="mt-3">
                  <div className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                    Attempt in <strong>{it.wordLimit} words</strong>. Reference ID: <span className="font-mono text-foreground">{it.id}</span>.
                  </div>
                </TabsContent>
                <TabsContent value={`ah-${i}`} className="mt-3 space-y-3">
                  <div className="rounded-md border border-gold/40 bg-gold/5 p-3 text-sm">
                    <span className="font-semibold text-gold">Hint · </span>{it.hint}
                  </div>
                  <div className="rounded-md bg-muted/40 p-3 text-sm">
                    <div className="font-semibold mb-1">Key points</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {it.keyPoints.map((kp, j) => <li key={j}>{kp}</li>)}
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value={`aa-${i}`} className="mt-3">
                  <div className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm whitespace-pre-line leading-relaxed">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-primary">Model Answer</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{it.id}</span>
                    </div>
                    {it.modelAnswer}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => remove(it.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-muted-foreground">No archived questions match your filters.</div>
        )}
      </div>
    </div>
  );
}

