import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Newspaper, CalendarCheck2, FileQuestion, PenLine, Sparkles,
  ArrowRight, Flame, Target, Clock, TrendingUp, BookOpen, CheckCircle2, Circle, Radio,
  Zap, Award, Quote, Activity, BarChart3, ChevronRight, ChevronDown, Bookmark, Play,
} from "lucide-react";
import { headlines, todaysPlan, syllabus, type SyllabusPaper, type SyllabusTopic } from "@/data/mock";
import { syllabusDetail, paperOverview } from "@/data/syllabusDetail";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { fetchLatestNews } from "@/lib/news.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NewsMentor Daily" },
      { name: "description", content: "Your daily UPSC command center: today's plan, streak, current affairs, syllabus progress and mock scores." },
    ],
  }),
  component: Dashboard,
});

const ticker = [
  "RBI holds repo at 6.5%",
  "Green Hydrogen Mission crosses 1 MMT",
  "15th FC devolution debate reopens",
  "Chandrayaan-4 sample-return greenlit",
  "India–EU FTA — 11th round concludes",
  "Article 370 anniversary explainer",
  "COP-30 draft text leaks",
  "Bharat NCAP rates 3 new SUVs",
];

const weeklyHours = [3.2, 4.1, 5.5, 4.8, 6.2, 5.9, 4.2];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const upcomingTests = [
  { name: "Prelims Mock #14", subject: "GS-I · Full length", date: "Wed, 15 Jul", difficulty: "Hard" },
  { name: "GS-II Sectional", subject: "Polity & Governance", date: "Fri, 17 Jul", difficulty: "Medium" },
  { name: "CSAT Practice #7", subject: "Aptitude", date: "Sat, 18 Jul", difficulty: "Easy" },
];
const continueLearning = [
  { title: "Fiscal Federalism", subject: "GS-II · Polity", progress: 62, mins: 18, difficulty: "Medium" },
  { title: "Monsoon Dynamics", subject: "GS-I · Geography", progress: 34, mins: 24, difficulty: "Hard" },
];
const recentActivity = [
  { action: "Completed", target: "Editorial: Green H₂ Mission", when: "12 min ago", icon: CheckCircle2 },
  { action: "Scored 62/100", target: "Mock Test #13", when: "2 hr ago", icon: Award },
  { action: "Bookmarked", target: "Art. 280 — Finance Commission", when: "4 hr ago", icon: Bookmark },
  { action: "Wrote answer on", target: "Cooperative Federalism", when: "Yesterday", icon: PenLine },
];

function Dashboard() {
  const done = todaysPlan.filter((t) => t.done).length;
  const topics = syllabus.flatMap((p) => p.topics);
  const overall = Math.round(topics.reduce((s, t) => s + t.progress, 0) / topics.length);
  const targetHours = 6;
  const doneHours = 4.2;
  const targetPct = Math.round((doneHours / targetHours) * 100);
  const maxWeek = Math.max(...weeklyHours);

  const { data: liveNews } = useQuery({
    queryKey: ["latest-news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
  const tickerItems = (liveNews && liveNews.length > 0)
    ? liveNews.map((n) => n.title)
    : ticker;

  const [expandedPaper, setExpandedPaper] = useState<string | null>(syllabus[0]?.id ?? null);
  const [openTopic, setOpenTopic] = useState<{ topic: SyllabusTopic; paper: SyllabusPaper } | null>(null);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 gradient-mesh-subtle" />

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 max-w-[1400px] mx-auto">

        {/* Welcome + Hero */}
        <section className="grid gap-4 lg:grid-cols-3 animate-fade-in-up">
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl gradient-navy text-primary-foreground p-6 sm:p-8">
            <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl animate-float-slow" />
            <div aria-hidden className="absolute -left-10 -bottom-16 h-56 w-56 rounded-full bg-success/15 blur-3xl animate-float-slower" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-pulse-glow" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                Monday · 13 July 2026
              </div>
              <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.02]">
                Good morning, <span className="italic text-gold">Aspirant</span>.
              </h1>
              <p className="mt-3 max-w-lg text-primary-foreground/75 text-sm sm:text-base">
                {done} of {todaysPlan.length} tasks done · 3 editorials queued · GS-II answer due.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-[0_10px_30px_-12px_rgba(201,168,76,0.6)]">
                  <Link to="/current-affairs">Read today's brief <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/planner">Open study plan</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Daily target ring */}
          <div className="card-premium p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Daily target</div>
                <div className="mt-1 font-serif text-3xl">{doneHours} <span className="text-muted-foreground text-lg">/ {targetHours} hrs</span></div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-success/10 text-success">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6">
              <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="absolute inset-y-0 left-0 gradient-emerald animate-bar rounded-full" style={{ width: `${targetPct}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-muted-foreground">{targetPct}% of goal</span>
                <span className="text-success font-medium">On track</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick stats bento row */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatBento icon={Flame} label="Streak" value={<><AnimatedCounter value={12} /> d</>} sub="Best: 18" tone="gold" flame delay={0} />
          <StatBento icon={TrendingUp} label="Mock avg" value={<><AnimatedCounter value={118} />/200</>} sub="+6 vs last wk" tone="success" delay={80} />
          <StatBento icon={BookOpen} label="Syllabus" value={<><AnimatedCounter value={overall} suffix="%" /></>} sub="On track" tone="primary" delay={160} />
          <StatBento icon={CheckCircle2} label="Accuracy" value={<><AnimatedCounter value={72} suffix="%" /></>} sub="last 20 MCQs" tone="highlight" delay={240} />
        </section>

        {/* Live ticker */}
        <section className="relative overflow-hidden rounded-xl border bg-card shadow-soft">
          <div className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground shrink-0">
              <Radio className="h-3.5 w-3.5 animate-pulse-glow text-gold" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Newswire</span>
            </div>
            <div className="relative flex-1 overflow-hidden py-2.5">
              <div className="flex gap-10 whitespace-nowrap animate-marquee w-max">
                {[...tickerItems, ...tickerItems].map((t, i) => (
                  <span key={i} className="text-sm text-foreground/80 inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gold" /> {t}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent" />
            </div>
          </div>
        </section>

        {/* Main bento grid */}
        <section className="grid gap-4 lg:grid-cols-6 auto-rows-min">
          {/* Today's schedule — tall */}
          <BentoCard className="lg:col-span-2 lg:row-span-2" delay={0}>
            <BentoHeader eyebrow="Today" title="Schedule" icon={CalendarCheck2} to="/planner" />
            <div className="mt-4 space-y-3">
              {todaysPlan.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-start gap-3 group">
                  <div className="mt-0.5">
                    {t.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground group-hover:text-gold transition" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.time} · {t.module}</div>
                    <div className={`text-sm truncate ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">{done}/{todaysPlan.length}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-gold animate-bar" style={{ width: `${(done / todaysPlan.length) * 100}%` }} />
              </div>
            </div>
          </BentoCard>

          {/* Continue learning */}
          <BentoCard className="lg:col-span-4" delay={80}>
            <BentoHeader eyebrow="Pick up where you left off" title="Continue learning" icon={Play} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {continueLearning.map((c) => (
                <Link key={c.title} to="/planner" className="group rounded-xl border p-4 hover:border-gold/50 hover:shadow-soft transition-all">
                  <div className="flex items-start justify-between">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.subject}</div>
                    <DifficultyBadge level={c.difficulty} />
                  </div>
                  <h4 className="font-serif text-xl mt-1 group-hover:text-primary transition">{c.title}</h4>
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full gradient-emerald" style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{c.progress}% complete</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{c.mins} min left</span>
                  </div>
                </Link>
              ))}
            </div>
          </BentoCard>

          {/* Current affairs preview */}
          <BentoCard className="lg:col-span-2" delay={160}>
            <BentoHeader eyebrow="Newspapers & PIB" title="Today's brief" icon={Newspaper} to="/current-affairs" />
            <ul className="mt-4 space-y-2.5">
              {headlines.slice(0, 3).map((h) => (
                <li key={h.id} className="flex items-start gap-2">
                  <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5 border-primary/30 text-primary">{h.gs}</Badge>
                  <span className="text-sm line-clamp-2 text-foreground/85">{h.title}</span>
                </li>
              ))}
            </ul>
          </BentoCard>

          {/* Motivation quote */}
          <BentoCard className="lg:col-span-2 gradient-navy text-primary-foreground border-0" delay={240}>
            <Quote className="h-6 w-6 text-gold opacity-80" />
            <p className="mt-3 font-serif text-xl leading-snug">
              "Discipline is choosing between what you want now and what you want most."
            </p>
            <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground/60">— Abraham Lincoln</div>
          </BentoCard>

          {/* Subject shortcuts */}
          <BentoCard className="lg:col-span-6" delay={320}>
            <BentoHeader eyebrow="Jump straight in" title="Subject shortcuts" icon={Zap} />
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { name: "GS-I", desc: "History & Geo", to: "/planner", accent: "gold" as const },
                { name: "GS-II", desc: "Polity & IR", to: "/planner", accent: "primary" as const },
                { name: "GS-III", desc: "Econ & Sci", to: "/planner", accent: "success" as const },
                { name: "GS-IV", desc: "Ethics", to: "/planner", accent: "highlight" as const },
                { name: "CSAT", desc: "Aptitude", to: "/pyq", accent: "primary" as const },
                { name: "Optional", desc: "Choose", to: "/planner", accent: "gold" as const },
              ].map((s) => (
                <Link key={s.name} to={s.to} className="group rounded-xl border p-3 hover:border-gold/60 hover:-translate-y-0.5 transition-all bg-card">
                  <div className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold ${accentBg(s.accent)}`}>
                    {s.name.replace("GS-", "")}
                  </div>
                  <div className="mt-2 font-serif text-base">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                </Link>
              ))}
            </div>
          </BentoCard>

          {/* Weekly progress chart */}
          <BentoCard className="lg:col-span-3" delay={400}>
            <BentoHeader eyebrow="Last 7 days" title="Weekly focus" icon={BarChart3} />
            <div className="mt-6 flex items-stretch justify-between gap-2 h-36">
              {weeklyHours.map((h, i) => {
                const pct = (h / maxWeek) * 100;
                const isToday = i === 6;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                    <div className="w-full flex-1 flex items-end min-h-0">
                      <div
                        className={`w-full rounded-t-md ${isToday ? "gradient-gold" : "bg-primary/70"} animate-bar hover:opacity-90 transition`}
                        style={{ height: `${pct}%`, animationDelay: `${i * 60}ms` }}
                        title={`${h} hrs`}
                      />
                    </div>
                    <div className={`text-[10px] uppercase tracking-wider ${isToday ? "text-gold font-semibold" : "text-muted-foreground"}`}>{weekDays[i]}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between text-xs">
              <span className="text-muted-foreground">Total this week</span>
              <span className="font-medium text-foreground">{weeklyHours.reduce((a, b) => a + b, 0).toFixed(1)} hrs</span>
            </div>
          </BentoCard>

          {/* Performance analytics */}
          <BentoCard className="lg:col-span-3" delay={480}>
            <BentoHeader eyebrow="Performance" title="Recent mocks" icon={Activity} to="/pyq" />
            <div className="mt-4 space-y-3">
              {[
                { name: "Prelims Mock #13", score: 118, max: 200, delta: +6 },
                { name: "GS-II Sectional", score: 62, max: 100, delta: +4 },
                { name: "CSAT #6", score: 54, max: 80, delta: -2 },
              ].map((m) => {
                const pct = (m.score / m.max) * 100;
                return (
                  <div key={m.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="truncate">{m.name}</span>
                      <span className="tabular-nums font-medium">
                        {m.score}/{m.max}
                        <span className={`ml-2 text-xs ${m.delta >= 0 ? "text-success" : "text-destructive"}`}>
                          {m.delta >= 0 ? "▲" : "▼"} {Math.abs(m.delta)}
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-emerald animate-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoCard>

          {/* Upcoming tests */}
          <BentoCard className="lg:col-span-3" delay={560}>
            <BentoHeader eyebrow="Coming up" title="Upcoming tests" icon={FileQuestion} to="/pyq" />
            <div className="mt-4 space-y-3">
              {upcomingTests.map((t) => (
                <div key={t.name} className="flex items-center gap-3 rounded-lg border p-3 hover:border-gold/40 transition">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/8 text-primary shrink-0">
                    <FileQuestion className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.subject} · {t.date}</div>
                  </div>
                  <DifficultyBadge level={t.difficulty} />
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Recent activity */}
          <BentoCard className="lg:col-span-3" delay={640}>
            <BentoHeader eyebrow="Latest" title="Recent activity" icon={Activity} />
            <div className="mt-4 space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground shrink-0">
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Quick actions row */}
          <BentoCard className="lg:col-span-6" delay={720}>
            <BentoHeader eyebrow="One tap" title="Quick actions" icon={Zap} />
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <QuickAction to="/answers" icon={PenLine} label="Write answer" tone="gold" />
              <QuickAction to="/pyq" icon={FileQuestion} label="Attempt PYQ" tone="primary" />
              <QuickAction to="/current-affairs" icon={Newspaper} label="Today's brief" tone="success" />
              <QuickAction to="/mentor" icon={Sparkles} label="Ask mentor" tone="highlight" sparkle />
              <QuickAction to="/planner" icon={CalendarCheck2} label="Plan tomorrow" tone="primary" />
            </div>
          </BentoCard>
        </section>

        {/* Syllabus snapshot — retained */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card-premium lg:col-span-2 p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-gold" />
              <h3 className="font-serif text-2xl">Syllabus snapshot</h3>
            </div>
            <div className="space-y-4">
              {syllabus.map((paper, i) => {
                const avg = Math.round(paper.topics.reduce((s, t) => s + t.progress, 0) / paper.topics.length);
                return (
                  <div key={paper.id} style={{ animationDelay: `${i * 90}ms` }} className="animate-fade-in-up">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{paper.name}</span>
                      <span className="text-muted-foreground tabular-nums">
                        <AnimatedCounter value={avg} suffix="%" />
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full gradient-gold animate-bar" style={{ width: `${avg}%`, animationDelay: `${i * 90 + 200}ms` }} />
                    </div>
                  </div>
                );
              })}
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <Link to="/planner">Open full planner <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>

          <div className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <h3 className="font-serif text-2xl mb-4">Facts for Prelims</h3>
            <div className="space-y-3 text-sm">
              {[
                { k: "Repo rate", v: "6.5% (unchanged)" },
                { k: "Green H₂ target", v: "5 MMT by 2030" },
                { k: "15th FC devolution", v: "41% of central taxes" },
                { k: "Wassenaar members", v: "42 states" },
                { k: "Gaganyaan launcher", v: "Human-rated LVM3" },
              ].map((f, i) => (
                <div key={f.k} className="flex justify-between gap-2 border-b border-dashed pb-2 last:border-0 animate-fade-in-up" style={{ animationDelay: `${200 + i * 80}ms` }}>
                  <span className="text-muted-foreground">{f.k}</span>
                  <span className="font-medium text-right">{f.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- Bento primitives ---------- */

function BentoCard({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`card-premium p-5 sm:p-6 animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function BentoHeader({
  eyebrow, title, icon: Icon, to,
}: { eyebrow: string; title: string; icon: any; to?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</div>
        <h3 className="font-serif text-2xl mt-0.5 truncate">{title}</h3>
      </div>
      {to ? (
        <Link to={to} aria-label={`Open ${title}`} className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition shrink-0">
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground shrink-0">
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function StatBento({
  icon: Icon, label, value, sub, tone, flame = false, delay = 0,
}: {
  icon: any; label: string; value: React.ReactNode; sub: string;
  tone: "gold" | "success" | "primary" | "highlight"; flame?: boolean; delay?: number;
}) {
  return (
    <div className="card-premium p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${accentBg(tone)}`}>
          <Icon className={`h-4 w-4 ${flame ? "animate-flame" : ""}`} />
        </div>
      </div>
      <div className="mt-2 font-serif text-3xl leading-none">{value}</div>
      <div className="mt-1.5 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function QuickAction({
  to, icon: Icon, label, tone, sparkle = false,
}: { to: string; icon: any; label: string; tone: "gold" | "success" | "primary" | "highlight"; sparkle?: boolean }) {
  return (
    <Link to={to} className="group rounded-xl border p-4 flex flex-col items-start gap-2 hover:border-gold/60 hover:-translate-y-0.5 transition-all bg-card">
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${accentBg(tone)}`}>
        <Icon className={`h-4 w-4 ${sparkle ? "animate-sparkle" : ""}`} />
      </div>
      <div className="text-sm font-medium">{label}</div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition ml-auto" />
    </Link>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Easy: "bg-success/10 text-success border-success/20",
    Medium: "bg-highlight/10 text-highlight border-highlight/20",
    Hard: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${map[level] ?? map.Medium}`}>{level}</span>;
}

function accentBg(tone: "gold" | "success" | "primary" | "highlight") {
  switch (tone) {
    case "gold": return "bg-gold/15 text-gold";
    case "success": return "bg-success/10 text-success";
    case "highlight": return "bg-highlight/15 text-highlight";
    default: return "bg-primary/10 text-primary";
  }
}
