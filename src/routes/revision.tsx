import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RotateCcw, BookOpen, CheckCircle2, Sparkles, CalendarDays, Library, TrendingUp, FileText } from "lucide-react";
import { subjects } from "@/data/subjectMap";
import { syllabus, pyqs, type SyllabusTopic } from "@/data/mock";
import { syllabusDetail } from "@/data/syllabusDetail";

// Map each topic id to the PYQ `subject` strings that count as "this topic".
const topicPyqSubjects: Record<string, string[]> = {
  t1: ["History"], t2: ["History"], t3: ["History"], t4: ["History"],
  t5: ["Society"], t6: ["Geography"],
  t7: ["Polity"], t8: ["Governance"], t9: ["IR"], t10: ["Governance"],
  t11: ["Economy"], t12: ["Environment"], t13: ["Science & Tech"],
  t14: ["Security"], t15: ["Disaster"],
  t16: ["Ethics"], t17: ["Ethics"], t18: ["Ethics"],
};


export const Route = createFileRoute("/revision")({
  head: () => ({
    meta: [
      { title: "Revision — UPSC Hero by Biswajit" },
      { name: "description", content: "Revise everything you've already studied — pulled from your study archive with spaced-repetition suggestions." },
    ],
  }),
  component: Revision,
});

type ArchiveItem = {
  id: string;
  subjectKey: string;
  subjectName: string;
  paper: string;
  topicId: string;
  topicName: string;
  point: string;
  doneAt: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function Revision() {
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [revised, setRevised] = useState<Record<string, string>>({}); // id -> lastRevisedAt
  const [filter, setFilter] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<SyllabusTopic | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const a = localStorage.getItem("planner:studyArchive");
      if (a) setArchive(JSON.parse(a));
      const r = localStorage.getItem("planner:revisionLog");
      if (r) setRevised(JSON.parse(r));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  const markRevised = (id: string) => {
    const next = { ...revised, [id]: new Date().toISOString() };
    setRevised(next);
    try { localStorage.setItem("planner:revisionLog", JSON.stringify(next)); } catch { /* ignore */ }
  };

  const enriched = useMemo(() => {
    const now = Date.now();
    return archive.map((it) => {
      const lastTouch = revised[it.id] ?? it.doneAt;
      const ageDays = Math.floor((now - new Date(lastTouch).getTime()) / DAY_MS);
      // Simple spaced-repetition tiers: 1d, 3d, 7d, 14d.
      const dueTier = ageDays >= 14 ? "overdue" : ageDays >= 7 ? "week" : ageDays >= 3 ? "3-day" : ageDays >= 1 ? "1-day" : "fresh";
      return { ...it, ageDays, dueTier, lastTouch };
    });
  }, [archive, revised]);

  const due = useMemo(
    () => enriched
      .filter((it) => it.ageDays >= 1)
      .sort((a, b) => b.ageDays - a.ageDays),
    [enriched],
  );

  const filtered = filter ? enriched.filter((it) => it.subjectKey === filter) : enriched;
  const subjectsWithData = subjects.filter((s) => archive.some((a) => a.subjectKey === s.key));
  const overdueCount = enriched.filter((it) => it.ageDays >= 7).length;
  const revisedToday = Object.values(revised).filter((d) => new Date(d).toDateString() === new Date().toDateString()).length;

  if (!ready) return <div className="px-6 py-10 text-muted-foreground">Loading…</div>;


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1100px] mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold flex items-center gap-2">
            <RotateCcw className="h-3.5 w-3.5" /> Revision
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1">What to revise today</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Everything you've already ticked in Planner shows up here. Older items float to the top — spaced repetition, minus the app tax.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StatChip icon={BookOpen} label="Archived" value={`${archive.length}`} />
          <StatChip icon={CalendarDays} label="Due" value={`${due.length}`} />
          <StatChip icon={Sparkles} label="Revised today" value={`${revisedToday}`} />
        </div>
      </header>

      {due.length > 0 && (
        <Card className="border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-2xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" /> Suggested for revision now
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {overdueCount > 0 ? `${overdueCount} items are a week or older — start with these.` : "Fresh in memory but worth a quick pass."}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {due.slice(0, 5).map((it) => (
              <RevisionRow key={it.id} item={it} onRevised={markRevised} />
            ))}
            {due.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-1">+ {due.length - 5} more below</p>
            )}
          </CardContent>
        </Card>
      )}

      {archive.length > 0 && (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="font-serif text-2xl">Full archive</CardTitle>
            <div className="flex gap-1 flex-wrap">
              <FilterChip active={filter === null} onClick={() => setFilter(null)}>All ({archive.length})</FilterChip>
              {subjectsWithData.map((s) => {
                const count = archive.filter((a) => a.subjectKey === s.key).length;
                return (
                  <FilterChip key={s.key} active={filter === s.key} onClick={() => setFilter(s.key)}>
                    {s.name} ({count})
                  </FilterChip>
                );
              })}
            </div>
          </div>
          {filter === null && archive.length > 0 && (
            <Progress value={Math.round((revisedToday / Math.max(archive.length, 1)) * 100)} className="h-1.5 mt-3" />
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered
            .sort((a, b) => b.ageDays - a.ageDays)
            .map((it) => (
              <RevisionRow key={it.id} item={it} onRevised={markRevised} />
            ))}
        </CardContent>
      </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Library className="h-5 w-5 text-gold" /> Syllabus
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Tap any topic for the deep official syllabus and a breakdown of how it's been asked in previous years.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {syllabus.map((paper) => (
            <div key={paper.id}>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{paper.name}</div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {paper.topics.map((t) => {
                  const pyqCount = pyqs.filter((q) => (topicPyqSubjects[t.id] ?? []).includes(q.subject)).length;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTopic(t)}
                      className="text-left rounded-lg border p-3 hover:border-gold hover:bg-gold/5 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium">{t.name}</div>
                        {pyqCount > 0 && (
                          <Badge variant="outline" className="text-[10px] shrink-0">{pyqCount} PYQ</Badge>
                        )}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Tap for depth</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!activeTopic} onOpenChange={(o) => !o && setActiveTopic(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {activeTopic && (() => {
            const detail = syllabusDetail[activeTopic.id];
            const matchedPyqs = pyqs.filter((q) => (topicPyqSubjects[activeTopic.id] ?? []).includes(q.subject));
            const yearGroups = matchedPyqs.reduce<Record<number, typeof matchedPyqs>>((acc, q) => {
              (acc[q.year] ??= []).push(q); return acc;
            }, {});
            const years = Object.keys(yearGroups).map(Number).sort((a, b) => b - a);
            const prelimsCount = matchedPyqs.filter((q) => q.paper === "Prelims").length;
            const mainsCount = matchedPyqs.length - prelimsCount;
            return (
              <>
                <DialogHeader>
                  {detail?.paperRef && (
                    <Badge variant="outline" className="border-gold/50 text-gold w-fit">{detail.paperRef}</Badge>
                  )}
                  <DialogTitle className="font-serif text-3xl mt-2">{activeTopic.name}</DialogTitle>
                  <DialogDescription>Deep official syllabus + previous-year question analysis.</DialogDescription>
                </DialogHeader>

                <section className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gold" />
                    <div className="font-medium">Official syllabus (deep)</div>
                  </div>
                  {detail ? (
                    <ul className="space-y-2 rounded-lg border p-4 bg-card">
                      {detail.points.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Deep points coming soon.</p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-2 italic">
                    Re-upload your syllabus PDF in chat and I'll layer its notes into this view.
                  </p>
                </section>

                <section className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-gold" />
                    <div className="font-medium">Previous-year analysis</div>
                  </div>
                  {matchedPyqs.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No PYQs indexed for this topic yet.</p>
                  ) : (
                    <>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <Badge variant="outline">{matchedPyqs.length} total</Badge>
                        <Badge variant="outline">Prelims: {prelimsCount}</Badge>
                        <Badge variant="outline">Mains: {mainsCount}</Badge>
                        <Badge variant="outline">Years: {years.join(", ")}</Badge>
                      </div>
                      <div className="space-y-3">
                        {years.map((year) => (
                          <div key={year} className="rounded-lg border p-3 bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-serif text-lg">{year}</div>
                              <Badge variant="outline" className="text-[10px]">{yearGroups[year].length} question{yearGroups[year].length > 1 ? "s" : ""}</Badge>
                            </div>
                            <ul className="space-y-2">
                              {yearGroups[year].map((q) => (
                                <li key={q.id} className="text-sm">
                                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <Badge variant="outline" className="text-[10px]">{q.paper}</Badge>
                                    {q.marks && <span className="text-[10px] text-muted-foreground">{q.marks} marks</span>}
                                  </div>
                                  <div className="leading-relaxed">{q.question}</div>
                                  <div className="text-xs text-muted-foreground italic mt-1">Hint: {q.hint}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RevisionRow({ item, onRevised }: { item: ArchiveItem & { ageDays: number; dueTier: string; lastTouch: string }; onRevised: (id: string) => void }) {
  const isRevisedToday = new Date(item.lastTouch).toDateString() === new Date().toDateString();
  const tierColor: Record<string, string> = {
    fresh: "border-muted-foreground/30 text-muted-foreground",
    "1-day": "border-primary/40 text-primary",
    "3-day": "border-amber-500/50 text-amber-600 dark:text-amber-400",
    week: "border-orange-500/50 text-orange-600 dark:text-orange-400",
    overdue: "border-destructive/60 text-destructive",
  };
  const tierLabel: Record<string, string> = {
    fresh: "just studied",
    "1-day": "1 day",
    "3-day": "3+ days",
    week: "1 week+",
    overdue: "2 weeks+",
  };
  return (
    <div className="flex items-start gap-3 rounded-md border p-3 hover:bg-muted/30 transition">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Badge variant="outline" className="text-[10px]">{item.subjectName}</Badge>
          {item.topicName !== item.subjectName && (
            <span className="text-[10px] text-muted-foreground">· {item.topicName}</span>
          )}
          <Badge variant="outline" className={`text-[10px] ${tierColor[item.dueTier]}`}>{tierLabel[item.dueTier]}</Badge>
        </div>
        <div className="text-sm leading-relaxed">{item.point}</div>
      </div>
      <Button
        size="sm"
        variant={isRevisedToday ? "outline" : "default"}
        onClick={() => onRevised(item.id)}
        disabled={isRevisedToday}
        className="shrink-0"
      >
        {isRevisedToday ? <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Revised</> : "Mark revised"}
      </Button>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-md border transition ${active ? "bg-gold text-gold-foreground border-gold" : "hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}

function StatChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
      <Icon className="h-4 w-4 text-gold" />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-serif text-lg">{value}</div>
    </div>
  );
}
