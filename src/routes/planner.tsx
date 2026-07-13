import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarCheck2, Target, Flame, Plus, BookOpen, ChevronRight } from "lucide-react";
import { syllabus, todaysPlan, type Task, type SyllabusPaper, type SyllabusTopic } from "@/data/mock";
import { syllabusDetail, paperOverview } from "@/data/syllabusDetail";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Study Planner — NewsMentor Daily" },
      { name: "description", content: "GS I–IV + Prelims syllabus tracker with progress bars and a personalised daily schedule for UPSC aspirants." },
    ],
  }),
  component: Planner,
});

function Planner() {
  const [tasks, setTasks] = useState<Task[]>(todaysPlan);
  const [openTopic, setOpenTopic] = useState<{ topic: SyllabusTopic; paper: SyllabusPaper } | null>(null);
  const toggle = (id: string) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const done = tasks.filter((t) => t.done).length;
  const overall = Math.round(
    syllabus.flatMap((p) => p.topics).reduce((s, t) => s + t.progress, 0) /
      syllabus.flatMap((p) => p.topics).length,
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Your Roadmap</div>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1">Study Planner</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Every GS paper, every topic, tracked. Today's plan on the right.
            <span className="ml-2 text-xs uppercase tracking-wider text-gold/80">Demo data · enable Cloud to persist</span>
          </p>
        </div>
        <div className="flex gap-2">
          <StatChip icon={Target} label="Syllabus" value={`${overall}%`} />
          <StatChip icon={Flame} label="Streak" value="12" />
          <StatChip icon={CalendarCheck2} label="Today" value={`${done}/${tasks.length}`} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {syllabus.map((paper) => {
            const avg = Math.round(paper.topics.reduce((s, t) => s + t.progress, 0) / paper.topics.length);
            return (
              <Card key={paper.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <CardTitle className="font-serif text-xl sm:text-2xl">{paper.name}</CardTitle>
                    <Badge variant="outline" className="border-gold/50 text-gold">{avg}% complete</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {paper.topics.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setOpenTopic({ topic: t, paper })}
                      className="text-left rounded-lg border p-3 hover:border-gold/60 hover:shadow-sm transition group focus:outline-none focus:ring-2 focus:ring-gold/40"
                    >
                      <div className="flex justify-between text-sm mb-1.5 items-center">
                        <span className="font-medium flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-gold/70" />
                          {t.name}
                        </span>
                        <span className="text-muted-foreground text-xs inline-flex items-center gap-1">
                          {t.progress}%
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-gold transition" />
                        </span>
                      </div>
                      <Progress value={t.progress} className="h-1.5" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-2xl">Today · 13 Jul</CardTitle>
                <Button size="sm" variant="ghost"><Plus className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.map((t) => (
                <label key={t.id} className={`flex items-start gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 ${t.done ? "opacity-60" : ""}`}>
                  <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t.time}</span>
                      <Badge variant="outline" className="text-[10px]">{t.module}</Badge>
                    </div>
                    <div className={`text-sm mt-0.5 ${t.done ? "line-through" : ""}`}>{t.title}</div>
                  </div>
                </label>
              ))}
              <Progress value={(done / tasks.length) * 100} className="h-1.5 mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-primary/5 to-gold/5 border-gold/30">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-gold">This week</div>
              <div className="font-serif text-3xl mt-1">28.4 hrs</div>
              <div className="text-sm text-muted-foreground">of 40 hr goal · 71%</div>
              <Progress value={71} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog open={!!openTopic} onOpenChange={(o) => !o && setOpenTopic(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {openTopic && (() => {
            const detail = syllabusDetail[openTopic.topic.id];
            const overview = paperOverview[openTopic.paper.id];
            return (
              <>
                <DialogHeader>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-gold">{openTopic.paper.name}</div>
                  <DialogTitle className="font-serif text-2xl sm:text-3xl mt-1">{openTopic.topic.name}</DialogTitle>
                  {detail?.paperRef && (
                    <DialogDescription className="text-xs">
                      <Badge variant="outline" className="border-primary/30 text-primary">{detail.paperRef}</Badge>
                    </DialogDescription>
                  )}
                </DialogHeader>

                {overview && (
                  <p className="text-sm text-muted-foreground border-l-2 border-gold/40 pl-3 italic">
                    {overview}
                  </p>
                )}

                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Official UPSC syllabus points
                  </div>
                  {detail ? (
                    <ul className="space-y-2.5">
                      {detail.points.map((p, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Detailed points for this topic are being added shortly.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                  <span>Your progress</span>
                  <span className="font-medium text-foreground">{openTopic.topic.progress}%</span>
                </div>
                <Progress value={openTopic.topic.progress} className="h-1.5" />
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
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

function StatChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
      <Icon className="h-4 w-4 text-gold" />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-serif text-lg">{value}</div>
    </div>
  );
}
