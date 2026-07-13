import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Newspaper, CalendarCheck2, FileQuestion, PenLine, Sparkles,
  ArrowRight, Flame, Target, Clock, TrendingUp, BookOpen, CheckCircle2, Circle, Radio,
} from "lucide-react";
import { headlines, todaysPlan, syllabus } from "@/data/mock";
import { AnimatedCounter } from "@/components/AnimatedCounter";

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

function Dashboard() {
  const done = todaysPlan.filter((t) => t.done).length;
  const topics = syllabus.flatMap((p) => p.topics);
  const overall = Math.round(topics.reduce((s, t) => s + t.progress, 0) / topics.length);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl gradient-emerald animate-gradient text-primary-foreground p-6 sm:p-10 animate-fade-in-up">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/25 blur-3xl animate-float-slow" />
        <div className="absolute -right-24 top-40 h-40 w-40 rounded-full bg-gold/15 blur-2xl animate-float-slower" />
        <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-primary-foreground/5 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute inset-0 animate-shimmer opacity-30" />

        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-pulse-glow" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              Live · Monday · 13 July 2026
            </div>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Good morning, <span className="italic text-gold">Aspirant</span>.
              <br /> Today is a strong day to write.
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80 text-sm sm:text-base">
              {done} of {todaysPlan.length} tasks done · 3 editorials queued · GS-II answer practice due.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 hover:scale-[1.03] transition-transform">
                <Link to="/current-affairs">Read today's brief <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/planner">Open study plan</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile icon={Flame} label="Streak" value={<><AnimatedCounter value={12} /> days</>} hint="Personal best: 18" flame delay={0} />
            <StatTile icon={Target} label="Syllabus" value={<><AnimatedCounter value={overall} suffix="%" /></>} hint="On track for Prelims" delay={80} />
            <StatTile icon={Clock} label="Focus today" value={<><AnimatedCounter value={4.2} decimals={1} /> hrs</>} hint="Goal: 6 hrs" delay={160} />
            <StatTile icon={TrendingUp} label="Mock avg" value={<><AnimatedCounter value={118} /> / 200</>} hint="+6 vs last week" delay={240} />
          </div>
        </div>
      </section>

      {/* Live ticker */}
      <section className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground shrink-0">
            <Radio className="h-3.5 w-3.5 animate-pulse-glow text-gold" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">Newswire</span>
          </div>
          <div className="relative flex-1 overflow-hidden py-2.5">
            <div className="flex gap-10 whitespace-nowrap animate-marquee w-max">
              {[...ticker, ...ticker].map((t, i) => (
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

      {/* Bento grid */}
      <section className="grid gap-4 lg:grid-cols-6">
        <ModuleCard className="lg:col-span-3" to="/current-affairs" icon={Newspaper}
          title="Today's Current Affairs" eyebrow="Newspapers & PIB"
          description={`${headlines.length} stories · GS-tagged · avg 4 min each`} accent delay={0}
        >
          <ul className="mt-4 space-y-2 text-sm">
            {headlines.slice(0, 3).map((h) => (
              <li key={h.id} className="flex items-start gap-2">
                <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">{h.gs}</Badge>
                <span className="line-clamp-1 text-foreground/90">{h.title}</span>
              </li>
            ))}
          </ul>
        </ModuleCard>

        <ModuleCard className="lg:col-span-3" to="/planner" icon={CalendarCheck2}
          title="Today's Plan" eyebrow="Study Planner"
          description={`${done}/${todaysPlan.length} completed · ${overall}% syllabus`} delay={80}
        >
          <div className="mt-4 space-y-2">
            {todaysPlan.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-sm">
                {t.done ? <CheckCircle2 className="h-4 w-4 text-gold" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                <span className="text-xs text-muted-foreground w-12">{t.time}</span>
                <span className={t.done ? "line-through text-muted-foreground" : "text-foreground"}>{t.title}</span>
              </div>
            ))}
          </div>
        </ModuleCard>

        <ModuleCard className="lg:col-span-2" to="/pyq" icon={FileQuestion}
          title="PYQ & Mock Tests" eyebrow="Practice"
          description="12 PYQs · 6 mock tests" delay={160} />

        <ModuleCard className="lg:col-span-2" to="/answers" icon={PenLine}
          title="Answer Writing" eyebrow="Mains" description="2 pending · 4 evaluated" delay={240} />

        <ModuleCard className="lg:col-span-2" to="/mentor" icon={Sparkles}
          title="AI Mentor" eyebrow="24×7 doubt clearing"
          description="Ask about syllabus, PYQs, or today's news" accent delay={320} sparkle />
      </section>

      {/* Syllabus snapshot */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-2xl">
              <BookOpen className="h-5 w-5 text-gold" /> Syllabus snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {syllabus.map((paper, i) => {
              const avg = Math.round(paper.topics.reduce((s, t) => s + t.progress, 0) / paper.topics.length);
              return (
                <div key={paper.id} style={{ animationDelay: `${i * 90}ms` }} className="animate-fade-in-up">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{paper.name}</span>
                    <span className="text-muted-foreground">
                      <AnimatedCounter value={avg} suffix="%" />
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-gold animate-bar"
                      style={{ width: `${avg}%`, animationDelay: `${i * 90 + 200}ms` }}
                    />
                  </div>
                </div>
              );
            })}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/planner">Open full planner <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Facts for Prelims</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { k: "Repo rate", v: "6.5% (unchanged)" },
              { k: "Green H₂ target", v: "5 MMT by 2030" },
              { k: "15th FC devolution", v: "41% of central taxes" },
              { k: "Wassenaar members", v: "42 states" },
              { k: "Gaganyaan launcher", v: "Human-rated LVM3" },
            ].map((f, i) => (
              <div
                key={f.k}
                className="flex justify-between gap-2 border-b border-dashed pb-2 last:border-0 animate-fade-in-up"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <span className="text-muted-foreground">{f.k}</span>
                <span className="font-medium text-right">{f.v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatTile({
  icon: Icon, label, value, hint, delay = 0, flame = false,
}: { icon: any; label: string; value: React.ReactNode; hint: string; delay?: number; flame?: boolean }) {
  return (
    <div
      className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur p-3 hover:bg-primary-foreground/10 transition-colors animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 text-gold text-[11px] uppercase tracking-wider">
        <Icon className={`h-3.5 w-3.5 ${flame ? "animate-flame" : ""}`} /> {label}
      </div>
      <div className="mt-1 font-serif text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-primary-foreground/60">{hint}</div>
    </div>
  );
}

function ModuleCard({
  to, icon: Icon, title, eyebrow, description, children, className = "", accent = false, delay = 0, sparkle = false,
}: {
  to: string; icon: any; title: string; eyebrow: string; description: string;
  children?: React.ReactNode; className?: string; accent?: boolean; delay?: number; sparkle?: boolean;
}) {
  return (
    <Link to={to} className={`group animate-fade-in-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <Card className={`h-full hover-lift transition-all shadow-sm ${accent ? "border-gold/40 bg-gradient-to-br from-card to-gold/5" : ""}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={`grid h-10 w-10 place-items-center rounded-lg transition-transform group-hover:scale-110 ${accent ? "bg-gold text-gold-foreground" : "bg-primary/10 text-primary"}`}>
              <Icon className={`h-5 w-5 ${sparkle ? "animate-sparkle" : ""}`} />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition" />
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">{eyebrow}</div>
          <h3 className="font-serif text-2xl mt-1">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {children}
        </CardContent>
      </Card>
    </Link>
  );
}
