import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { CalendarCheck2, Target, Flame, Plus, BookOpen, ChevronRight, Trash2, Minus, Pencil } from "lucide-react";
import { type Task, type SyllabusPaper, type SyllabusTopic } from "@/data/mock";
import { syllabusDetail, paperOverview } from "@/data/syllabusDetail";
import { usePlannerStore } from "@/hooks/usePlannerStore";

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
  const {
    ready, tasks, syllabus, streak, weeklyGoalHrs, weekHrs,
    toggleTask, addTask, removeTask, setProgress, setWeeklyGoal,
  } = usePlannerStore();
  const [openTopic, setOpenTopic] = useState<{ topic: SyllabusTopic; paper: SyllabusPaper } | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const done = tasks.filter((t) => t.done).length;
  const overall = useMemo(() => {
    const all = syllabus.flatMap((p) => p.topics);
    if (!all.length) return 0;
    return Math.round(all.reduce((s, t) => s + t.progress, 0) / all.length);
  }, [syllabus]);

  const todayLabel = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const weekPct = Math.min(100, Math.round((weekHrs / weeklyGoalHrs) * 100));

  if (!ready) {
    return <div className="px-6 py-10 text-muted-foreground">Loading your planner…</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Your Roadmap</div>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1">Study Planner</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Tap a subject to see the official syllabus. Add tasks for today, tick them off to build your streak.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StatChip icon={Target} label="Syllabus" value={`${overall}%`} />
          <StatChip icon={Flame} label="Streak" value={`${streak}`} />
          <StatChip icon={CalendarCheck2} label="Today" value={`${done}/${tasks.length || 0}`} />
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
                    <div key={t.id} className="rounded-lg border p-3 hover:border-gold/60 hover:shadow-sm transition group">
                      <button
                        type="button"
                        onClick={() => setOpenTopic({ topic: t, paper })}
                        className="w-full text-left focus:outline-none"
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
                      <div className="flex items-center gap-1 mt-2">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setProgress(t.id, t.progress - 5)} aria-label="Decrease progress">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Slider
                          value={[t.progress]}
                          onValueChange={(v) => setProgress(t.id, v[0])}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setProgress(t.id, t.progress + 5)} aria-label="Increase progress">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
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
                <CardTitle className="font-serif text-2xl">Today · {todayLabel}</CardTitle>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost"><Plus className="h-4 w-4" /></Button>
                  </DialogTrigger>
                  <AddTaskDialog onAdd={(t) => { addTask(t); setAddOpen(false); }} />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No tasks yet. Tap + to add your first block.</p>
              )}
              {tasks.map((t) => (
                <div key={t.id} className={`flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 group ${t.done ? "opacity-60" : ""}`}>
                  <Checkbox checked={t.done} onCheckedChange={() => toggleTask(t.id)} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t.time}</span>
                      <Badge variant="outline" className="text-[10px]">{t.module}</Badge>
                    </div>
                    <div className={`text-sm mt-0.5 ${t.done ? "line-through" : ""}`}>{t.title}</div>
                  </div>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {tasks.length > 0 && <Progress value={(done / tasks.length) * 100} className="h-1.5 mt-2" />}
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-primary/5 to-gold/5 border-gold/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-gold">This week</div>
                <WeeklyGoalDialog current={weeklyGoalHrs} onSave={setWeeklyGoal} />
              </div>
              <div className="font-serif text-3xl mt-1">{weekHrs} hrs</div>
              <div className="text-sm text-muted-foreground">of {weeklyGoalHrs} hr goal · {weekPct}%</div>
              <Progress value={weekPct} className="mt-3 h-2" />
              <p className="text-[11px] text-muted-foreground mt-2">Each completed task counts as ~30 min.</p>
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

                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Your progress</span>
                    <span className="font-medium text-foreground">{openTopic.topic.progress}%</span>
                  </div>
                  <Slider
                    value={[openTopic.topic.progress]}
                    onValueChange={(v) => {
                      setProgress(openTopic.topic.id, v[0]);
                      setOpenTopic((s) => s ? { ...s, topic: { ...s.topic, progress: v[0] } } : s);
                    }}
                    max={100}
                    step={5}
                  />
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddTaskDialog({ onAdd }: { onAdd: (t: Omit<Task, "id" | "done">) => void }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [module, setModule] = useState("GS-II");

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="font-serif text-2xl">Add a study block</DialogTitle>
        <DialogDescription>Schedule a focused task for today.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="task-title">Task</Label>
          <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. GS-III · Monetary Policy notes" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="task-time">Time</Label>
            <Input id="task-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-module">Module</Label>
            <Input id="task-module" value={module} onChange={(e) => setModule(e.target.value)} placeholder="Polity / Prelims / GS-IV" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={() => title.trim() && onAdd({ title: title.trim(), time, module: module.trim() || "General" })}
          disabled={!title.trim()}
        >
          Add task
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function WeeklyGoalDialog({ current, onSave }: { current: number; onSave: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(current);
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setVal(current); }}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-6 w-6"><Pencil className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Weekly goal</DialogTitle>
          <DialogDescription>How many focused hours per week?</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Slider value={[val]} onValueChange={(v) => setVal(v[0])} min={5} max={80} step={1} />
          <div className="text-center font-serif text-3xl">{val} hrs</div>
        </div>
        <DialogFooter>
          <Button onClick={() => { onSave(val); setOpen(false); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
