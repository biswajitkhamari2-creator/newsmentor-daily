import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BookOpen, Newspaper, Repeat, Coffee, ClipboardCheck, Sparkles,
  Plus, Trash2, CheckCircle2, Circle, Flame, Target, Clock, AlertCircle,
  ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { useScheduleStore, type Category, type Priority, type ScheduleTask } from "@/hooks/useScheduleStore";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Premium Schedule — UPSC Hero by Biswajit" },
      { name: "description", content: "A world-class daily planner for UPSC: circular progress ring, weekly strip, categorised timeline, priorities, streaks and quick-add tasks." },
    ],
  }),
  component: SchedulePage,
});

// ---------------- helpers ----------------

const todayISO = () => new Date().toISOString().slice(0, 10);
const toDate = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtHM = (mins: number) => {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
};
const greet = () => {
  const h = new Date().getHours();
  if (h < 5) return "Still awake";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Late night grind";
};
const timeLabel = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
};

const CATEGORY: Record<Category, { label: string; icon: React.ElementType; ring: string; bg: string; text: string; dot: string }> = {
  "study":           { label: "Study",           icon: BookOpen,       ring: "ring-blue-500/40",   bg: "bg-blue-500/10",   text: "text-blue-600",   dot: "bg-blue-500" },
  "revision":        { label: "Revision",        icon: Repeat,         ring: "ring-purple-500/40", bg: "bg-purple-500/10", text: "text-purple-600", dot: "bg-purple-500" },
  "mock":            { label: "Mock Test",       icon: ClipboardCheck, ring: "ring-amber-500/40",  bg: "bg-amber-500/10",  text: "text-amber-600",  dot: "bg-amber-500" },
  "current-affairs": { label: "Current Affairs", icon: Newspaper,      ring: "ring-orange-500/40", bg: "bg-orange-500/10", text: "text-orange-600", dot: "bg-orange-500" },
  "break":           { label: "Break",           icon: Coffee,         ring: "ring-slate-400/30",  bg: "bg-slate-500/10",  text: "text-slate-600",  dot: "bg-slate-400" },
  "custom":          { label: "Custom",          icon: Sparkles,       ring: "ring-gold/40",       bg: "bg-gold/10",       text: "text-gold",       dot: "bg-gold" },
};

const PRIORITY: Record<Priority, { label: string; cls: string }> = {
  low:    { label: "Low",    cls: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  medium: { label: "Medium", cls: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  high:   { label: "High",   cls: "bg-red-500/10 text-red-600 border-red-500/20" },
};

type FilterKey = "all" | Category;

// ---------------- page ----------------

function SchedulePage() {
  const store = useScheduleStore();
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  const dayTasks = useMemo(() => store.tasksByDate.get(selectedDate) ?? [], [store.tasksByDate, selectedDate]);
  const filtered = useMemo(
    () => (filter === "all" ? dayTasks : dayTasks.filter((t) => t.category === filter)),
    [dayTasks, filter],
  );

  const completedMin = dayTasks.filter((t) => t.status === "completed" && t.category !== "break")
    .reduce((s, t) => s + t.duration, 0);
  const goalMin = store.dailyGoalMin;
  const pct = Math.min(100, Math.round((completedMin / goalMin) * 100));

  const counts = {
    total: dayTasks.filter((t) => t.category !== "break").length,
    completed: dayTasks.filter((t) => t.status === "completed").length,
    pending: dayTasks.filter((t) => t.status === "pending").length,
    overdue: dayTasks.filter((t) => t.status === "overdue").length,
    revision: dayTasks.filter((t) => t.category === "revision").length,
    mock: dayTasks.filter((t) => t.category === "mock").length,
  };

  if (!store.ready) {
    return <div className="px-6 py-10 text-muted-foreground">Loading your schedule…</div>;
  }

  const isToday = selectedDate === todayISO();
  const selDate = toDate(selectedDate);
  const dateLong = selDate.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto pb-32">
      {/* Header */}
      <header className="animate-fade-in-up">
        <div className="text-xs uppercase tracking-[0.3em] text-gold">{isToday ? "Today" : "Schedule"}</div>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1">{greet()}, Biswajit</h1>
        <p className="text-muted-foreground mt-2">{dateLong}</p>
      </header>

      {/* Dashboard: ring + stat cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="glass p-6 lg:col-span-1 hover-lift">
          <div className="flex items-center gap-6">
            <ProgressRing pct={pct} />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Study Goal</div>
              <div className="font-serif text-3xl">{fmtHM(goalMin)}</div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Done <span className="ml-auto font-medium">{fmtHM(completedMin)}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-highlight" /> Remaining <span className="ml-auto font-medium">{fmtHM(Math.max(0, goalMin - completedMin))}</span></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <StatBox icon={Clock}          label="Today's Tasks"   value={counts.total}      tone="primary" />
          <StatBox icon={CheckCircle2}   label="Completed"       value={counts.completed}  tone="success" />
          <StatBox icon={Circle}         label="Pending"         value={counts.pending}    tone="highlight" />
          <StatBox icon={AlertCircle}    label="Overdue"         value={counts.overdue}    tone="destructive" />
          <StatBox icon={Repeat}         label="Revision Due"    value={counts.revision}   tone="purple" />
          <StatBox icon={Flame}          label="Study Streak"    value={`${store.streak}d`} tone="gold" />
        </div>
      </section>

      {/* Weekly strip */}
      <WeeklyStrip
        selected={selectedDate}
        onSelect={setSelectedDate}
        countFor={(d) => (store.tasksByDate.get(d) ?? []).length}
        loadFor={(d) => (store.tasksByDate.get(d) ?? []).reduce((s, t) => s + t.duration, 0)}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 animate-fade-in">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5" /> Filter
        </div>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {(Object.keys(CATEGORY) as Category[]).filter((c) => c !== "break").map((c) => (
          <FilterChip
            key={c}
            active={filter === c}
            onClick={() => setFilter(c)}
            label={CATEGORY[c].label}
            dot={CATEGORY[c].dot}
          />
        ))}
      </div>

      {/* Timeline */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">Daily Timeline</h2>
          <div className="text-xs text-muted-foreground">{filtered.length} task{filtered.length === 1 ? "" : "s"}</div>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center border-dashed">
            <div className="font-serif text-xl">Nothing scheduled here yet</div>
            <p className="text-sm text-muted-foreground mt-1">Tap the <span className="font-medium text-gold">+</span> button to add your first task for {isToday ? "today" : dateLong}.</p>
          </Card>
        ) : (
          <div className="relative">
            <div className="absolute left-[64px] top-0 bottom-0 w-px bg-border" aria-hidden />
            <div className="space-y-3">
              {filtered.map((t, i) => (
                <TimelineRow
                  key={t.id}
                  task={t}
                  onToggle={() => store.toggleComplete(t.id)}
                  onRemove={() => store.removeTask(t.id)}
                  delay={i * 40}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label="Quick add task"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full gradient-gold text-gold-foreground shadow-gold hover:scale-105 active:scale-95 transition flex items-center justify-center animate-fade-in"
      >
        <Plus className="h-6 w-6" />
      </button>

      <QuickAdd
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultDate={selectedDate}
        onAdd={(t) => { store.addTask(t); setAddOpen(false); }}
      />
    </div>
  );
}

// ---------------- pieces ----------------

function ProgressRing({ pct }: { pct: number }) {
  const size = 128, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-muted" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none"
          stroke="url(#ringGrad)"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor="oklch(0.78 0.14 85)" />
            <stop offset="100%" stopColor="oklch(0.55 0.13 162)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-serif text-3xl leading-none">{pct}%</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">of goal</div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, tone }:
  { icon: React.ElementType; label: string; value: React.ReactNode; tone: "primary" | "success" | "highlight" | "destructive" | "purple" | "gold" }) {
  const tones: Record<string, string> = {
    primary:     "text-primary bg-primary/10",
    success:     "text-success bg-success/10",
    highlight:   "text-highlight bg-highlight/10",
    destructive: "text-destructive bg-destructive/10",
    purple:      "text-purple-600 bg-purple-500/10",
    gold:        "text-gold bg-gold/10",
  };
  return (
    <Card className="p-4 hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="font-serif text-2xl mt-1">{value}</div>
        </div>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

function WeeklyStrip({
  selected, onSelect, countFor, loadFor,
}: {
  selected: string;
  onSelect: (d: string) => void;
  countFor: (d: string) => number;
  loadFor: (d: string) => number;
}) {
  const [anchor, setAnchor] = useState(() => {
    const d = toDate(selected);
    const day = (d.getDay() + 6) % 7; // Monday-first
    d.setDate(d.getDate() - day);
    return d;
  });
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(anchor); d.setDate(anchor.getDate() + i);
    return d;
  });
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const today = todayISO();
  const shift = (n: number) => { const d = new Date(anchor); d.setDate(anchor.getDate() + n * 7); setAnchor(d); };
  const label = `${anchor.toLocaleDateString("en-IN", { month: "short", day: "2-digit" })} — ${new Date(anchor.getTime() + 6 * 86400000).toLocaleDateString("en-IN", { month: "short", day: "2-digit" })}`;

  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Week · {label}</div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => shift(-1)} aria-label="Previous week"><ChevronLeft className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); setAnchor(d); onSelect(today); }}>Today</Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => shift(1)} aria-label="Next week"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const dIso = iso(d);
          const isSel = dIso === selected;
          const isToday = dIso === today;
          const count = countFor(dIso);
          const load = loadFor(dIso);
          const loadPct = Math.min(100, Math.round((load / 480) * 100));
          return (
            <button
              key={dIso}
              onClick={() => onSelect(dIso)}
              className={[
                "group relative rounded-xl border p-2 transition text-center",
                isSel ? "gradient-navy text-primary-foreground border-transparent shadow-elegant" : "bg-card hover:border-gold/50 hover:bg-gold/5",
              ].join(" ")}
            >
              <div className={`text-[10px] uppercase tracking-widest ${isSel ? "opacity-80" : "text-muted-foreground"}`}>
                {d.toLocaleDateString("en-IN", { weekday: "short" })}
              </div>
              <div className={`font-serif text-xl mt-0.5 leading-none ${isToday && !isSel ? "text-gold" : ""}`}>
                {d.getDate()}
              </div>
              <div className={`mt-2 h-1 rounded-full overflow-hidden ${isSel ? "bg-white/20" : "bg-muted"}`}>
                <div
                  className={isSel ? "h-full bg-gold" : "h-full gradient-gold"}
                  style={{ width: `${loadPct}%`, transition: "width 600ms cubic-bezier(0.16,1,0.3,1)" }}
                />
              </div>
              <div className={`text-[10px] mt-1 ${isSel ? "opacity-80" : "text-muted-foreground"}`}>{count} task{count === 1 ? "" : "s"}</div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function FilterChip({ active, onClick, label, dot }: { active: boolean; onClick: () => void; label: string; dot?: string }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-xs font-medium border transition inline-flex items-center gap-1.5",
        active ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-card hover:border-gold/50 hover:text-gold",
      ].join(" ")}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {label}
    </button>
  );
}

function TimelineRow({ task, onToggle, onRemove, delay }: {
  task: ScheduleTask; onToggle: () => void; onRemove: () => void; delay: number;
}) {
  const cat = CATEGORY[task.category];
  const Icon = cat.icon;
  const done = task.status === "completed";
  const overdue = task.status === "overdue";

  return (
    <div className="flex items-stretch gap-3 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      {/* Time gutter */}
      <div className="w-14 shrink-0 text-right pt-3">
        <div className={`text-xs font-mono tabular-nums ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{timeLabel(task.time)}</div>
        <div className="text-[10px] text-muted-foreground">{fmtHM(task.duration)}</div>
      </div>

      {/* Dot on rail */}
      <div className="relative w-4 shrink-0">
        <span className={`absolute left-1/2 top-4 -translate-x-1/2 h-3 w-3 rounded-full ring-4 ring-background ${cat.dot} ${overdue ? "animate-pulse-glow" : ""}`} />
      </div>

      {/* Card */}
      <Card
        className={[
          "flex-1 p-4 hover-lift transition border",
          done ? "opacity-70 border-success/40 bg-success/5" : "",
          overdue ? "border-destructive/50 bg-destructive/5" : "",
          !done && !overdue ? `${cat.ring} hover:${cat.ring}` : "",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            aria-label={done ? "Mark incomplete" : "Mark complete"}
            className="mt-0.5 shrink-0"
          >
            {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-gold transition" />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <Badge variant="outline" className={`gap-1 border-0 ${cat.bg} ${cat.text}`}>
                <Icon className="h-3 w-3" /> {cat.label}
              </Badge>
              {task.subject && <Badge variant="outline" className="text-[10px]">{task.subject}</Badge>}
              <Badge variant="outline" className={`text-[10px] ${PRIORITY[task.priority].cls}`}>
                {PRIORITY[task.priority].label}
              </Badge>
              {overdue && <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30 gap-1"><AlertCircle className="h-3 w-3" /> Overdue</Badge>}
              {done && <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">Done</Badge>}
            </div>
            <div className={`mt-1.5 font-medium ${done ? "line-through text-muted-foreground" : ""}`}>{task.title}</div>
            {task.notes && <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.notes}</div>}
          </div>
          <button
            onClick={onRemove}
            aria-label="Delete task"
            className="text-muted-foreground hover:text-destructive transition shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}

function QuickAdd({ open, onOpenChange, defaultDate, onAdd }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDate: string;
  onAdd: (t: Omit<ScheduleTask, "id" | "status" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category>("study");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState<string>(defaultDate);
  const [time, setTime] = useState<string>("09:00");
  const [duration, setDuration] = useState<number>(60);
  const [notes, setNotes] = useState("");

  const reset = () => {
    setTitle(""); setSubject(""); setCategory("study"); setPriority("medium");
    setDate(defaultDate); setTime("09:00"); setDuration(60); setNotes("");
  };

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), subject: subject.trim() || undefined, category, priority, date, time, duration, notes: notes.trim() || undefined });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" /> Quick Add
          </DialogTitle>
          <DialogDescription>Add a task to your schedule. Categorise it so the timeline colours pop.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="qa-title">Title</Label>
            <Input id="qa-title" placeholder="e.g. Polity — Fundamental Rights" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY) as Category[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      <span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${CATEGORY[c].dot}`} />{CATEGORY[c].label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRIORITY) as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>{PRIORITY[p].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="qa-subject">Subject <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="qa-subject" placeholder="e.g. Polity" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="qa-date">Date</Label>
              <Input id="qa-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="qa-time">Start time</Label>
              <Input id="qa-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Duration</Label>
              <span className="text-xs text-muted-foreground">{fmtHM(duration)}</span>
            </div>
            <Slider value={[duration]} onValueChange={(v) => setDuration(v[0])} min={15} max={240} step={15} />
          </div>

          <div>
            <Label htmlFor="qa-notes">Notes <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea id="qa-notes" placeholder="Source book, teacher, target pages…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!title.trim()} className="gradient-gold text-gold-foreground">
            <Target className="h-4 w-4 mr-1" /> Add to schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
