import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { CalendarCheck2, Target, Flame, Plus, BookOpen, Trash2, Minus, Pencil, GraduationCap, X } from "lucide-react";
import { type Task } from "@/data/mock";
import { syllabusDetail } from "@/data/syllabusDetail";
import { subjects, type SubjectEntry } from "@/data/subjectMap";
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
  const [addOpen, setAddOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState<SubjectEntry | null>(null);
  const [todayKey, setTodayKey] = useState<string | null>(null);

  // Persist "today's subject" — resets when the date changes.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("planner:todaySubject");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { key: string; date: string };
      const today = new Date().toDateString();
      if (parsed.date === today) setTodayKey(parsed.key);
      else localStorage.removeItem("planner:todaySubject");
    } catch { /* ignore */ }
  }, []);

  const pickTodaySubject = (key: string | null) => {
    setTodayKey(key);
    try {
      if (key) localStorage.setItem("planner:todaySubject", JSON.stringify({ key, date: new Date().toDateString() }));
      else localStorage.removeItem("planner:todaySubject");
    } catch { /* ignore */ }
  };

  const todaySubject = todayKey ? subjects.find((s) => s.key === todayKey) ?? null : null;

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
            Official GS-I to GS-IV syllabus is visible below with your progress starting at 0%.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StatChip icon={Target} label="Syllabus" value={`${overall}%`} />
          <StatChip icon={Flame} label="Streak" value={`${streak}`} />
          <StatChip icon={CalendarCheck2} label="Today" value={`${done}/${tasks.length || 0}`} />
        </div>
      </header>

      {todaySubject ? (
        <Card className="shadow-sm border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-gold">Today's subject</div>
                <CardTitle className="font-serif text-3xl mt-1">{todaySubject.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{todaySubject.paper} · focus only on this today.</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => pickTodaySubject(null)}>
                <X className="h-4 w-4 mr-1" /> Change subject
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySubject.topicIds?.map((tid) => {
              const detail = syllabusDetail[tid];
              const topicMeta = syllabus.flatMap((p) => p.topics).find((t) => t.id === tid);
              if (!topicMeta) return null;
              return (
                <div key={tid} className="rounded-lg border p-4 bg-card">
                  <div className="flex justify-between text-sm mb-2 items-center flex-wrap gap-2">
                    <span className="font-medium flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-gold" />
                      {topicMeta.name}
                    </span>
                    <span className="text-muted-foreground text-xs">{topicMeta.progress}%</span>
                  </div>
                  <Progress value={topicMeta.progress} className="h-1.5" />
                  <div className="flex items-center gap-1 mt-3">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setProgress(tid, topicMeta.progress - 5)} aria-label="Decrease">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Slider value={[topicMeta.progress]} onValueChange={(v) => setProgress(tid, v[0])} max={100} step={5} className="flex-1" />
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setProgress(tid, topicMeta.progress + 5)} aria-label="Increase">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  {detail && (
                    <ul className="space-y-1.5 mt-4 border-t pt-3">
                      {detail.points.map((p, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            {todaySubject.extraPoints && (
              <div className="rounded-lg border p-4 bg-card">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Official syllabus</div>
                <ul className="space-y-1.5">
                  {todaySubject.extraPoints.map((p, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gold" />
                Subjects
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Tap any subject to see exactly what to study from the official UPSC syllabus.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {subjects.map((s) => {
            const avg = (() => {
              if (!s.topicIds?.length) return null;
              const topics = syllabus.flatMap((p) => p.topics).filter((t) => s.topicIds!.includes(t.id));
              if (!topics.length) return null;
              return Math.round(topics.reduce((a, t) => a + t.progress, 0) / topics.length);
            })();
            return (
              <button
                key={s.key}
                onClick={() => setActiveSubject(s)}
                className="text-left rounded-lg border p-3 hover:border-gold hover:shadow-sm hover:bg-gold/5 transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.paper}</div>
                  </div>
                  {avg !== null && (
                    <Badge variant="outline" className="border-gold/40 text-gold text-[10px] shrink-0">{avg}%</Badge>
                  )}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
      )}



      <Dialog open={!!activeSubject} onOpenChange={(o) => !o && setActiveSubject(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {activeSubject && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-gold/50 text-gold">{activeSubject.paper}</Badge>
                </div>
                <DialogTitle className="font-serif text-3xl mt-2">{activeSubject.name}</DialogTitle>
                <DialogDescription>What to study — matched from the official UPSC CSE syllabus.</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                {activeSubject.topicIds?.map((tid) => {
                  const detail = syllabusDetail[tid];
                  const topicMeta = syllabus.flatMap((p) => p.topics).find((t) => t.id === tid);
                  if (!detail || !topicMeta) return null;
                  return (
                    <div key={tid} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gold" />
                          <span className="font-medium">{topicMeta.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{topicMeta.progress}% done</Badge>
                      </div>
                      <ul className="space-y-1.5 mt-2">
                        {detail.points.map((p, i) => (
                          <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                {activeSubject.extraPoints && (
                  <div className="rounded-lg border p-4">
                    <ul className="space-y-1.5">
                      {activeSubject.extraPoints.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button
                  onClick={() => {
                    addTask({
                      title: `${activeSubject.name} — study block`,
                      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
                      module: activeSubject.paper,
                    });
                    setActiveSubject(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add to today's plan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {!todaySubject && syllabus.map((paper) => {
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
                  {paper.topics.map((t) => {
                    const detail = syllabusDetail[t.id];
                    return (
                    <div key={t.id} className="rounded-lg border p-3 hover:border-gold/60 hover:shadow-sm transition group space-y-3">
                      <div className="w-full text-left">
                        <div className="flex justify-between text-sm mb-1.5 items-center">
                          <span className="font-medium flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-gold/70" />
                            {t.name}
                          </span>
                          <span className="text-muted-foreground text-xs">{t.progress}%</span>
                        </div>
                        <Progress value={t.progress} className="h-1.5" />
                      </div>
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
                      <div className="border-t pt-3">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Official UPSC syllabus</span>
                          {detail?.paperRef && (
                            <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">{detail.paperRef}</Badge>
                          )}
                        </div>
                        {detail ? (
                          <ul className="space-y-1.5">
                            {detail.points.map((point, index) => (
                              <li key={index} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground">Official points for this topic are being added.</p>
                        )}
                      </div>
                    </div>
                  );
                  })}
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
