import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays, BookOpen, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { headlines, type Headline } from "@/data/headlines";

export const Route = createFileRoute("/headlines")({
  component: HeadlinesPage,
  head: () => ({
    meta: [
      { title: "Daily Headlines — NewsMentor Daily" },
      {
        name: "description",
        content:
          "Today's UPSC-relevant headlines with editorial takeaways and prelims-ready facts.",
      },
      { property: "og:title", content: "Daily Headlines — NewsMentor Daily" },
      { property: "og:url", content: "/headlines" },
    ],
    links: [{ rel: "canonical", href: "/headlines" }],
  }),
});

const categoryStyles: Record<Headline["category"], string> = {
  Polity: "bg-primary/10 text-primary border-primary/30",
  Economy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  Environment: "bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/30",
  IR: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
  "S&T": "bg-accent/20 text-accent-foreground border-accent/50",
  Society: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
};

function HeadlinesPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">
            Today's Headlines
          </h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Feed */}
        <div className="space-y-4">
          {headlines.map((h) => {
            const open = expanded[h.id];
            return (
              <Card key={h.id} className="hover-lift p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`rounded-full border ${categoryStyles[h.category]}`}>
                    {h.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Editorial insight · 3 min read
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-xl font-bold leading-snug">
                  {h.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {h.summary}
                </p>
                {open && (
                  <div className="mt-3 rounded-lg border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed animate-fade-in">
                    {h.fullText}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 h-8 px-2 text-primary hover:text-primary"
                  onClick={() => setExpanded((s) => ({ ...s, [h.id]: !s[h.id] }))}
                >
                  {open ? (
                    <>Hide summary <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Read summary <ChevronDown className="h-4 w-4" /></>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              <h3 className="font-serif text-lg font-bold">Editorial Analysis</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="font-medium">The transparency turn in political funding</p>
                <p className="mt-1 text-muted-foreground">
                  Court's electoral bonds order reshapes Article 19(1)(a) into a
                  positive duty on the state.
                </p>
              </li>
              <li>
                <p className="font-medium">Why the RBI is still cautious</p>
                <p className="mt-1 text-muted-foreground">
                  Food inflation persistence, not headline CPI, is now the
                  binding constraint on rate cuts.
                </p>
              </li>
            </ul>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <h3 className="font-serif text-lg font-bold">Facts for Prelims</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><span className="text-accent">•</span> Aditya-L1 orbits at Sun-Earth L1 (~1.5M km)</li>
              <li className="flex gap-2"><span className="text-accent">•</span> Green Credit Programme ≠ Carbon Credit</li>
              <li className="flex gap-2"><span className="text-accent">•</span> India GII 2025 rank: 39</li>
              <li className="flex gap-2"><span className="text-accent">•</span> RBI repo rate held at 6.25%</li>
              <li className="flex gap-2"><span className="text-accent">•</span> NMNF outlay: ₹2,481 crore</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
