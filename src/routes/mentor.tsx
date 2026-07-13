import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, AlertCircle } from "lucide-react";
import { seedChat, type MentorMessage } from "@/data/mock";
import { askMentor, type MentorMsg } from "@/lib/api";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "AI Mentor — NewsMentor Daily" },
      { name: "description", content: "Chat with a 24×7 UPSC mentor powered by Gemini: syllabus doubts, PYQ analysis, current affairs and answer-writing feedback." },
    ],
  }),
  component: Mentor,
});

const suggestions = [
  "Summarise today's editorials in 5 bullets",
  "Give me the 15th Finance Commission in 100 words",
  "PYQ trend for Environment in last 5 years",
  "Frame an intro for the UCC question",
];


function Mentor() {
  const [messages, setMessages] = useState<MentorMessage[]>(seedChat);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const userMsg: MentorMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const history: MentorMsg[] = nextMessages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const reply = await askMentor({ message: trimmed, history, provider: "gemini" });
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "mentor", text: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1000px] mx-auto space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-gold">24 × 7 Companion</div>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1 flex items-center gap-3">
          AI Mentor <Sparkles className="h-7 w-7 text-gold" />
        </h1>
        <p className="text-muted-foreground mt-2">
          Doubt clearing, answer feedback and today-in-the-news — in one conversation.
        </p>
      </header>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="border-b py-3 flex-row items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full gradient-gold text-gold-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-serif">Mentor</CardTitle>
            <div className="text-xs text-muted-foreground">Trained on UPSC syllabus & PYQs (2015–2024)</div>
          </div>
        </CardHeader>

        <div ref={scrollRef} className="h-[500px] overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card border rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="bg-card border rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="border-t px-4 py-2 text-xs text-destructive flex items-center gap-2 bg-destructive/10">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </div>
        )}

        <div className="border-t p-4 space-y-3">

          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs rounded-full border px-3 py-1 hover:border-gold hover:text-gold transition"
              >
                {s}
              </button>
            ))}
          </div>
          <CardContent className="p-0 flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask about a topic, PYQ or today's news…"
              className="min-h-[48px] max-h-32 resize-none"
            />
            <Button onClick={() => send(input)} disabled={!input.trim() || busy} className="bg-gold text-gold-foreground hover:bg-gold/90 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
