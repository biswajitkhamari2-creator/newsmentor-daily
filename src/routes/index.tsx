import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Newspaper, CalendarCheck2, FileQuestion, PenLine, Sparkles,
  ArrowRight, Flame, Target, Clock, TrendingUp, BookOpen, CheckCircle2, Circle,
} from "lucide-react";
import { headlines, todaysPlan, syllabus } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NewsMentor Daily" },
      { name: "description", content: "Your daily UPSC command center: today's plan, streak, current affairs, syllabus progress and mock scores." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const done = todaysPlan.filter((t) => t.done).length;
  const overall = Math.round(
    syllabus.flatMap((p) => p.topics).reduce((s, t) => s + t.progress, 0) /
      syllabus.flatMap((p) => p.topics).length,
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl gradient-emerald text-primary-foreground p-6 sm:p-10">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -right-24 top-40 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold">Monday · 13 July 2026</div>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Good morning, <span className="italic text-gold">Aspirant</span>.
              <br /> Today is a strong day to write.
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80 text-sm sm:text-base">
              {done} of {todaysPlan.length} tasks done · 3 editorials queued · GS-II answer practice due.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/current-affairs">Read today's brief <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/planner">Open study plan</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile icon={Flame} label="Streak" value="12 days" hint="Personal best: 18" />
            <StatTile icon={Target} label="Syllabus" value={`${overall}%`} hint="On track for Prelims" />
            <StatTile icon={Clock} label="Focus today" value="4.2 hrs" hint="Goal: 6 hrs" />
            <StatTile icon={TrendingUp} label="Mock avg" value="118 / 200" hint="+6 vs last week" />
          </div>
        </div>
      </section>

      {/* Bento grid */}
      <section className="grid gap-4 lg:grid-cols-6">
        <ModuleCard
          className="lg:col-span-3"
          to="/current-affairs" icon={Newspaper} title="Today's Current Affairs"
          eyebrow="Newspapers & PIB"
          description={`${headlines.length} stories · GS-tagged · avg 4 min each`}
          accent
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
          description={`${done}/${todaysPlan.length} completed · ${overall}% syllabus`}
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
          description="12 PYQs · 6 mock tests" />

        <ModuleCard className="lg:col-span-2" to="/answers" icon={PenLine}
          title="Answer Writing" eyebrow="Mains" description="2 pending · 4 evaluated" />

        <ModuleCard className="lg:col-span-2" to="/mentor" icon={Sparkles}
          title="AI Mentor" eyebrow="24×7 doubt clearing"
          description="Ask about syllabus, PYQs, or today's news" accent />
      </section>

      {/* Syllabus snapshot */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-2xl">
              <BookOpen className="h-5 w-5 text-gold" /> Syllabus snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {syllabus.map((paper) => {
              const avg = Math.round(paper.topics.reduce((s, t) => s + t.progress, 0) / paper.topics.length);
              return (
                <div key={paper.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{paper.name}</span>
                    <span className="text-muted-foreground">{avg}%</span>
                  </div>
                  <Progress value={avg} className="h-2" />
                </div>
              );
            })}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/planner">Open full planner <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Facts for Prelims</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Fact k="Repo rate" v="6.5% (unchanged)" />
            <Fact k="Green H₂ target" v="5 MMT by 2030" />
            <Fact k="15th FC devolution" v="41% of central taxes" />
            <Fact k="Wassenaar members" v="42 states" />
            <Fact k="Gaganyaan launcher" v="Human-rated LVM3" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur p-3">
      <div className="flex items-center gap-2 text-gold text-[11px] uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 font-serif text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-primary-foreground/60">{hint}</div>
    </div>
  );
}

function ModuleCard({
  to, icon: Icon, title, eyebrow, description, children, className = "", accent = false,
}: {
  to: string; icon: any; title: string; eyebrow: string; description: string;
  children?: React.ReactNode; className?: string; accent?: boolean;
}) {
  return (
    <Link to={to} className={`group ${className}`}>
      <Card className={`h-full hover-lift transition-all shadow-sm ${accent ? "border-gold/40 bg-gradient-to-br from-card to-gold/5" : ""}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${accent ? "bg-gold text-gold-foreground" : "bg-primary/10 text-primary"}`}>
              <Icon className="h-5 w-5" />
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

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-dashed pb-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
