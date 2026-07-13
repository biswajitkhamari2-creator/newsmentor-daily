import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PenLine, Timer, CheckCircle2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/answers")({
  head: () => ({
    meta: [
      { title: "Answer Writing — NewsMentor Daily" },
      { name: "description", content: "Practice UPSC Mains answer writing with word-count tracking, model answers and structured feedback." },
    ],
  }),
  component: AnswerWriting,
});

const prompt = {
  paper: "Mains GS-II",
  marks: 15,
  time: "9 min",
  question: "Discuss the role of the Finance Commission in maintaining fiscal federalism in India.",
  structure: [
    "Intro — Art. 280, statutory role",
    "Vertical devolution (41% of central taxes)",
    "Horizontal criteria — population, area, income distance, forest cover",
    "Grants-in-aid (Art. 275), local body grants",
    "Challenges — GST autonomy, cess/surcharge, revenue deficit",
    "Way forward — permanent secretariat",
  ],
};

const submissions = [
  { id: 1, title: "Discuss the role of NITI Aayog in cooperative federalism", score: 11, max: 15, when: "Yesterday" },
  { id: 2, title: "Examine the ethical issues in emergency situations", score: 13, max: 15, when: "2 days ago" },
  { id: 3, title: "Green Hydrogen as India's clean energy vector", score: 12, max: 15, when: "3 days ago" },
  { id: 4, title: "Bhakti movement and composite culture", score: 10, max: 15, when: "5 days ago" },
];

function AnswerWriting() {
  const [text, setText] = useState("");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const target = 250;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-gold">Mains Practice</div>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1">Answer Writing</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          One question a day. Timer, word tracker, structured hints — then compare with a model answer.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground">{prompt.paper}</Badge>
              <Badge variant="outline">{prompt.marks} marks</Badge>
              <Badge variant="outline" className="border-gold/50 text-gold"><Timer className="h-3 w-3 mr-1" />{prompt.time}</Badge>
            </div>
            <CardTitle className="font-serif text-2xl leading-snug">{prompt.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Begin your answer here… intro → body (bullets & subheadings) → conclusion."
              className="min-h-[320px] font-serif text-base leading-relaxed"
            />
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Word count</span>
                  <span>{words} / {target}</span>
                </div>
                <Progress value={Math.min(100, (words / target) * 100)} className="h-1.5" />
              </div>
              <Button onClick={() => setSubmitted(true)} disabled={words < 20} className="bg-gold text-gold-foreground hover:bg-gold/90">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Submit for review
              </Button>
            </div>

            {submitted && (
              <div className="rounded-lg border border-gold/40 bg-gold/5 p-4 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                  <Sparkles className="h-4 w-4" /> Auto-evaluation (demo)
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <Stat k="Structure" v="8/10" />
                  <Stat k="Content" v="7/10" />
                  <Stat k="Clarity" v="9/10" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Good introduction with Art. 280. Add more on horizontal criteria and recent 15th FC recommendations. Conclusion should propose reform.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="font-serif text-xl">Suggested structure</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                {prompt.structure.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] shrink-0">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="font-serif text-xl flex items-center gap-2"><PenLine className="h-4 w-4 text-gold" /> Recent</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {submissions.map((s) => (
                <div key={s.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="text-sm line-clamp-2">{s.title}</div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{s.when}</span>
                    <span className="font-serif text-gold text-sm">{s.score}/{s.max}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-background p-2 border">
      <div className="text-[11px] text-muted-foreground">{k}</div>
      <div className="font-serif text-xl text-primary">{v}</div>
    </div>
  );
}
