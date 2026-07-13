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
import { ChevronDown, Timer, CheckCircle2, Play, Search, RefreshCw, AlertCircle, Radio, Sparkles, Loader2 } from "lucide-react";
import { pyqs, mockTests } from "@/data/mock";
import { fetchMcqs, fetchMains, type LiveMcq, type LiveMains } from "@/lib/api";
import { generateMainsQuestions } from "@/lib/mains.functions";
import { generatePrelimsMcqs } from "@/lib/mcqs.functions";
import { useServerFn } from "@tanstack/react-start";

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
          <TabsTrigger value="live"><Radio className="h-3.5 w-3.5 mr-1" /> Live from backend</TabsTrigger>
          <TabsTrigger value="pyq">PYQ Bank</TabsTrigger>
          <TabsTrigger value="mock">Mock Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-4">
          <MainsGenerator />
        </TabsContent>

        <TabsContent value="live" className="mt-4">
          <LivePractice />
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockTests.map((t) => (
              <Card key={t.id} className="hover-lift shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-xs">{t.type}</Badge>
                    {t.attempted && <Badge className="bg-gold text-gold-foreground text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Done</Badge>}
                  </div>
                  <CardTitle className="font-serif text-xl mt-2">{t.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t.questions} questions</span>
                    <span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" />{t.duration}</span>
                  </div>
                  {t.attempted ? (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Your score: </span>
                      <span className="font-serif text-2xl text-gold">{t.score}</span>
                      <span className="text-muted-foreground"> / {t.questions * 2}</span>
                    </div>
                  ) : (
                    <Button className="w-full" size="sm"><Play className="h-3.5 w-3.5 mr-1" /> Start test</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
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
  question: string;
  marks: number;
  wordLimit: number;
  paper: string;
  hint: string;
  keyPoints: string[];
};

function MainsGenerator() {
  const generate = useServerFn(generateMainsQuestions);
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
      setQuestions(out.questions as GeneratedQ[]);
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
            <Collapsible key={i}>
              <Card className="shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className="bg-primary text-primary-foreground">{q.paper}</Badge>
                    <Badge variant="outline">{q.marks} marks</Badge>
                    <Badge variant="outline" className="border-gold/50 text-gold">{q.wordLimit} words</Badge>
                    <Badge variant="outline"><Sparkles className="h-3 w-3 mr-1" />AI</Badge>
                  </div>
                  <p className="mt-3 font-serif text-lg leading-snug">{q.question}</p>
                  <CollapsibleTrigger className="group mt-3 text-sm text-primary hover:text-gold inline-flex items-center gap-1">
                    Reveal hint & key points
                    <ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    <div className="rounded-md border border-gold/40 bg-gold/5 p-3 text-sm">
                      <span className="font-semibold text-gold">Hint · </span>{q.hint}
                    </div>
                    <div className="rounded-md bg-muted/40 p-3 text-sm">
                      <div className="font-semibold mb-1">Key points to cover</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {q.keyPoints.map((kp, j) => <li key={j}>{kp}</li>)}
                      </ul>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
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
