import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BookMarked, ChevronDown, ChevronUp, SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pyqs, type Pyq } from "@/data/pyqs";

export const Route = createFileRoute("/pyq")({
  component: PyqPage,
  head: () => ({
    meta: [
      { title: "PYQ Bank — UPSC Previous Year Questions | NewsMentor Daily" },
      {
        name: "description",
        content:
          "Searchable bank of UPSC Prelims and Mains previous year questions from 2020–2025, tagged by subject.",
      },
      { property: "og:title", content: "UPSC PYQ Bank — NewsMentor Daily" },
      { property: "og:url", content: "/pyq" },
    ],
    links: [{ rel: "canonical", href: "/pyq" }],
  }),
});

const subjects: (Pyq["subject"] | "All")[] = [
  "All",
  "Polity",
  "History",
  "Geography",
  "Economy",
  "Environment",
  "S&T",
  "Current Affairs",
];
const years = ["All", "2025", "2024", "2023", "2022", "2021", "2020"] as const;

function PyqPage() {
  const [year, setYear] = useState<string>("All");
  const [subject, setSubject] = useState<string>("All");
  const [type, setType] = useState<"All" | "Prelims" | "Mains">("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return pyqs.filter((p) => {
      if (year !== "All" && String(p.year) !== year) return false;
      if (subject !== "All" && p.subject !== subject) return false;
      if (type !== "All" && p.type !== type) return false;
      if (q.trim() && !p.question.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [year, subject, type, q]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <BookMarked className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">PYQ Bank</h1>
          <p className="text-sm text-muted-foreground">
            UPSC Prelims & Mains — 2020 to 2025, tagged by subject.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_160px_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions by keyword…"
              className="pl-9"
            />
          </div>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              {years.map((y) => (<SelectItem key={y} value={y}>{y === "All" ? "All years" : y}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (<SelectItem key={s} value={s}>{s === "All" ? "All subjects" : s}</SelectItem>))}
            </SelectContent>
          </Select>
          <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Prelims">Prelims</TabsTrigger>
              <TabsTrigger value="Mains">Mains</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
        {filtered.length} question{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl font-bold">No matches</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing filters or searching a different keyword.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => { setYear("All"); setSubject("All"); setType("All"); setQ(""); }}
          >
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const isOpen = open[p.id];
            return (
              <Card key={p.id} className="hover-lift p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                    {p.year}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-accent/50 bg-accent/20 text-accent-foreground">
                    {p.subject}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    {p.type}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed sm:text-base">{p.question}</p>
                {isOpen && (
                  <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed animate-fade-in">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground/80">
                      Hint / Answer
                    </p>
                    {p.answer}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 h-8 px-2 text-primary hover:text-primary"
                  onClick={() => setOpen((s) => ({ ...s, [p.id]: !s[p.id] }))}
                >
                  {isOpen ? (<>Hide answer <ChevronUp className="h-4 w-4" /></>) : (<>Show answer / hint <ChevronDown className="h-4 w-4" /></>)}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
