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
import { ChevronDown, Timer, CheckCircle2, Play, Search, RefreshCw, AlertCircle, Radio } from "lucide-react";
import { pyqs, mockTests } from "@/data/mock";
import { fetchMcqs, fetchMains, type LiveMcq, type LiveMains } from "@/lib/api";

export const Route = createFileRoute("/pyq")({
  head: () => ({
    meta: [
      { title: "PYQ Bank & Mock Tests — NewsMentor Daily" },
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

      <Tabs defaultValue="pyq">
        <TabsList>
          <TabsTrigger value="pyq">PYQ Bank</TabsTrigger>
          <TabsTrigger value="mock">Mock Tests</TabsTrigger>
        </TabsList>

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
