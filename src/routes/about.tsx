import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Target, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — NewsMentor Daily" },
      {
        name: "description",
        content:
          "NewsMentor Daily is built by aspirants, for aspirants — to save 2 hours of newspaper reading every single day.",
      },
      { property: "og:title", content: "About — NewsMentor Daily" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const pillars = [
  { icon: Target, title: "Syllabus first", body: "Every summary maps back to a specific GS paper — no fluff, no filler." },
  { icon: Clock, title: "Two hours back", body: "The newspaper drill used to eat your morning. Now it takes 10 minutes." },
  { icon: Sparkles, title: "Exam-tuned", body: "Fact patterns, editorial takes, and PYQ links — the same lens toppers use." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium">
          <BookOpen className="h-3.5 w-3.5 text-accent" />
          Our story
        </div>
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">
          Built by aspirants, for aspirants.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Every UPSC aspirant knows the feeling — three newspapers open,
          highlighter running dry, and it's already 9 AM. NewsMentor Daily
          exists to give you that time back without giving up an inch of
          syllabus coverage.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title} className="hover-lift p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <p.icon className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-12 p-8 text-center">
        <h2 className="font-serif text-2xl font-bold">Ready to try it?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Drop today's newspaper — you'll have a GS-mapped summary in under a
          minute.
        </p>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link to="/upload">Upload a newspaper</Link>
        </Button>
      </Card>
    </div>
  );
}
