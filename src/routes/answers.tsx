import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PenLine, Timer, CheckCircle2, Sparkles, Loader2, AlertCircle, LogIn } from "lucide-react";
import { evaluateAnswer } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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

type Submission = {
  id: string;
  question: string;
  feedback: string;
  created_at: string;
  word_count: number;
};

function AnswerWriting() {
  const { user, loading: authLoading } = useAuth();
  const [text, setText] = useState("");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const target = 250;
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Submission[]>([]);

  useEffect(() => {
    if (!user) { setHistory([]); return; }
    supabase
      .from("answer_submissions")
      .select("id, question, feedback, created_at, word_count")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setHistory((data as Submission[]) ?? []);
      });
  }, [user]);

  const submit = async () => {
    if (!user) return;
    setLoading(true); setError(null); setFeedback(null);
    try {
      const md = await evaluateAnswer(prompt.question, text);
      setFeedback(md);
      const { data, error: dbErr } = await supabase
        .from("answer_submissions")
        .insert({
          user_id: user.id,
          question: prompt.question,
          answer: text,
          feedback: md,
          word_count: words,
          paper: prompt.paper,
          marks: prompt.marks,
        })
        .select("id, question, feedback, created_at, word_count")
        .single();
      if (dbErr) console.error(dbErr);
      else if (data) setHistory((h) => [data as Submission, ...h].slice(0, 10));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-gold">Mains Practice</div>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1">Answer Writing</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          One question a day. Timer, word tracker, structured hints — then compare with a model answer.
        </p>
      </header>

      {!authLoading && !user && (
        <div className="rounded-lg border border-gold/40 bg-gold/5 p-4 flex flex-wrap items-center gap-3">
          <LogIn className="h-4 w-4 text-gold" />
          <span className="text-sm">Sign in to save your submissions and track progress.</span>
          <Button asChild size="sm" className="ml-auto bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      )}

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
              <Button onClick={submit} disabled={words < 20 || loading || !user} className="bg-gold text-gold-foreground hover:bg-gold/90">
                {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
                {loading ? "Evaluating…" : "Submit for AI review"}
              </Button>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            {feedback && (
              <div className="rounded-lg border border-gold/40 bg-gold/5 p-4 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                  <Sparkles className="h-4 w-4" /> Mentor evaluation
                </div>
                <pre className="text-sm whitespace-pre-wrap font-sans text-foreground">{feedback}</pre>
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
            <CardHeader className="pb-3"><CardTitle className="font-serif text-xl flex items-center gap-2"><PenLine className="h-4 w-4 text-gold" /> Your submissions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {!user && (
                <p className="text-xs text-muted-foreground">Sign in to view your submission history.</p>
              )}
              {user && history.length === 0 && (
                <p className="text-xs text-muted-foreground">No submissions yet. Write one above to get started.</p>
              )}
              {history.map((s) => (
                <div key={s.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="text-sm line-clamp-2">{s.question}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(s.created_at).toLocaleString()} · {s.word_count} words
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
