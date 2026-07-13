import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, Newspaper, BookMarked, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "NewsMentor Daily — Turn Newspapers into UPSC Notes" },
      {
        name: "description",
        content:
          "Upload your daily newspaper and get crisp, GS-mapped UPSC summaries, headlines, and PYQs — every day.",
      },
      { property: "og:title", content: "NewsMentor Daily" },
      {
        property: "og:description",
        content: "Turn newspapers into crisp UPSC notes — every day.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const features = [
  {
    icon: Sparkles,
    title: "AI Summaries",
    body: "Every article distilled into syllabus-tagged bullets — Polity, Economy, Environment, IR, S&T.",
  },
  {
    icon: Newspaper,
    title: "Daily Headlines",
    body: "The 8 stories that matter for UPSC — with editorial takeaways and prelims-ready facts.",
  },
  {
    icon: BookMarked,
    title: "Previous Year Questions",
    body: "A searchable PYQ vault from 2020–2025 — Prelims + Mains, tagged by subject.",
  },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(1200px 500px at 50% -10%, oklch(0.78 0.14 75 / 0.18), transparent 60%), radial-gradient(800px 400px at 90% 10%, oklch(0.24 0.06 260 / 0.10), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Built for serious UPSC aspirants
          </div>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Turn Newspapers into
            <span className="block text-accent">Crisp UPSC Notes</span>
            — Every Day.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Upload any newspaper PDF or clipping. Get syllabus-mapped bullets,
            editorial angles, and prelims-ready facts in under a minute.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/upload">
                <Upload className="h-4 w-4" />
                Upload Newspaper
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/headlines">
                See today's headlines
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="hover-lift group relative overflow-hidden border-border/60 p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 transition-transform group-hover:scale-125"
              />
            </Card>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:grid-cols-3">
          {[
            { k: "2 hrs", v: "Saved per day" },
            { k: "5 GS", v: "Papers mapped" },
            { k: "365", v: "Days of coverage" },
          ].map((s) => (
            <div key={s.k} className="text-center">
              <div className="font-serif text-3xl font-bold text-primary">
                {s.k}
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
