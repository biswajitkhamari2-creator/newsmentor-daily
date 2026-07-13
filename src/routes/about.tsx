import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Compass, Feather, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — NewsMentor Daily" },
      { name: "description", content: "NewsMentor Daily is a focused, respectful workspace for UPSC aspirants — daily current affairs, syllabus tracking, PYQs, mock tests and a mentor." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto space-y-10">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-gold">Our Story</div>
        <h1 className="font-serif text-5xl sm:text-6xl mt-2 leading-tight">
          Built for the <span className="italic text-gold">quiet, disciplined</span> hours of UPSC prep.
        </h1>
        <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
          NewsMentor Daily is the workspace we wished we had while preparing —
          the newspaper, syllabus, PYQ bank, mock tests and a patient mentor,
          arranged so nothing gets in the way of the work itself.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Pillar icon={BookOpen} title="Every syllabus item, tracked"
          text="GS I–IV and Prelims topics with honest progress bars — no gamified fluff." />
        <Pillar icon={Compass} title="Newspaper without noise"
          text="The Hindu, Indian Express and PIB summarised into GS-mapped notes each morning." />
        <Pillar icon={Feather} title="Answer writing that counts"
          text="Daily prompts with a timer, word tracker, and structured feedback loops." />
        <Pillar icon={Sparkles} title="A mentor at 11 pm"
          text="Ask anything about a PYQ, editorial, or 3-mark fact — without waiting for coaching hours." />
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-gold/10 border-gold/30">
        <CardContent className="p-8">
          <blockquote className="font-serif text-2xl italic leading-snug">
            "Discipline is the bridge between goals and accomplishment."
          </blockquote>
          <div className="text-sm text-muted-foreground mt-3">— Jim Rohn · shown on every desk we've seen crack this exam.</div>
        </CardContent>
      </Card>

      <footer className="text-sm text-muted-foreground">
        Made with care for UPSC aspirants. Frontend prototype — mock data only.
      </footer>
    </div>
  );
}

function Pillar({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <Card className="shadow-sm hover-lift">
      <CardContent className="p-5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-serif text-xl mt-3">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{text}</p>
      </CardContent>
    </Card>
  );
}
