import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, AlertCircle, BookOpen, Newspaper, Target, ArrowUpRight } from "lucide-react";
import { seedChat, headlines, type MentorMessage } from "@/data/mock";
import { askMentor, type MentorMsg } from "@/lib/api";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "AI Mentor — UPSC Hero by Biswajit" },
      { name: "description", content: "Chat with a 24×7 UPSC mentor powered by Gemini: syllabus doubts, PYQ analysis, current affairs and answer-writing feedback." },
    ],
  }),
  component: Mentor,
});

const prompts = [
  { label: "Summarise today's editorials", hint: "5 bullets" },
  { label: "15th Finance Commission", hint: "100 words" },
  { label: "PYQ trend — Environment", hint: "last 5 yrs" },
  { label: "Frame an intro on UCC", hint: "Mains" },
];

// Terracotta scope — local to this page
const TERRA = "#c14b2e";

function Mentor() {
  const [messages, setMessages] = useState<MentorMessage[]>(seedChat);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => { inputRef.current?.focus(); }, []);

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
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);
  const brief = headlines.slice(0, 4);

  return (
    <div className="min-h-[calc(100vh-3rem)]" style={{ background: "#fbf7ee" }}>
      {/* Masthead */}
      <div className="border-b" style={{ borderColor: "#e6dfcc" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em]" style={{ color: TERRA }}>
              The Mentor's Desk · Vol. I
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl leading-none mt-2" style={{ color: "#1a1a1a" }}>
              Ask, and be answered.
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-neutral-500">{today}</div>
            <div className="text-xs mt-1" style={{ color: TERRA }}>● Mentor online · Gemini</div>
          </div>
        </div>
      </div>

      {/* Split workspace */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* LEFT — conversation */}
        <section className="flex flex-col">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-2 space-y-8 min-h-[520px] max-h-[calc(100vh-320px)]"
          >
            {messages.map((m, i) => (
              <article key={m.id} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: m.role === "user" ? "#3a5a40" : TERRA }}
                  >
                    {m.role === "user" ? "You asked" : "Mentor replies"}
                  </div>
                  <div className="h-px flex-1" style={{ background: "#e6dfcc" }} />
                  <div className="text-[10px] text-neutral-400 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <p
                  className={m.role === "mentor" ? "font-serif text-2xl sm:text-[26px] leading-snug" : "text-base leading-relaxed"}
                  style={{ color: "#1a1a1a", whiteSpace: "pre-wrap" }}
                >
                  {m.text}
                </p>
              </article>
            ))}

            {busy && (
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: TERRA }} />
                <span className="italic font-serif text-lg">the mentor is thinking…</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 text-xs border-l-2 pl-3 py-2" style={{ borderColor: TERRA, color: TERRA }}>
              <AlertCircle className="h-3.5 w-3.5 mt-0.5" /> <span>{error}</span>
            </div>
          )}

          {/* Composer */}
          <div className="mt-6 border-t pt-4" style={{ borderColor: "#e6dfcc" }}>
            <div className="flex flex-wrap gap-2 mb-3">
              {prompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => send(p.label)}
                  className="group text-xs px-3 py-1.5 border transition hover:bg-white"
                  style={{ borderColor: "#d9d0b7", color: "#1a1a1a" }}
                >
                  {p.label}{" "}
                  <span className="text-[10px] uppercase tracking-wider ml-1" style={{ color: TERRA }}>
                    {p.hint}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 items-end bg-white border p-3" style={{ borderColor: "#d9d0b7" }}>
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Type your question — syllabus, PYQ, editorial, answer feedback…"
                className="min-h-[56px] max-h-40 resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-base bg-transparent"
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim() || busy}
                className="shrink-0 rounded-none h-10 px-4 text-white hover:opacity-90"
                style={{ background: TERRA }}
              >
                <Send className="h-4 w-4 mr-2" /> Send
              </Button>
            </div>
            <div className="text-[11px] text-neutral-500 mt-2 tracking-wide">
              Press ↵ to send · Shift+↵ for new line
            </div>
          </div>
        </section>

        {/* RIGHT — context rail */}
        <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="h-3.5 w-3.5" style={{ color: TERRA }} />
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: TERRA }}>Today's Brief</div>
            </div>
            <ul className="space-y-3">
              {brief.map((h, i) => (
                <li key={h.id} className="group cursor-pointer" onClick={() => send(`Explain: ${h.title}`)}>
                  <div className="flex gap-3 items-start">
                    <span className="font-serif text-2xl leading-none tabular-nums" style={{ color: TERRA }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="font-serif text-[15px] leading-snug group-hover:underline decoration-1 underline-offset-2" style={{ color: "#1a1a1a" }}>
                        {h.title}
                      </div>
                      <div className="text-[11px] uppercase tracking-wider text-neutral-500 mt-1">
                        {h.gs} · {h.source}
                      </div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition mt-1" style={{ color: TERRA }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6" style={{ borderColor: "#e6dfcc" }}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-3.5 w-3.5" style={{ color: TERRA }} />
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: TERRA }}>Ask by mode</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { l: "Prelims MCQ", q: "Give me 3 tough Prelims MCQs from today's news" },
                { l: "Mains 250w", q: "Draft a 250-word Mains answer with intro-body-conclusion" },
                { l: "Ethics case", q: "Give me a GS-IV case study with 3 stakeholders" },
                { l: "Diagram idea", q: "Suggest a flowchart/map I can draw for this topic" },
              ].map((m) => (
                <button
                  key={m.l}
                  onClick={() => send(m.q)}
                  className="text-left px-3 py-2 border hover:bg-white transition"
                  style={{ borderColor: "#d9d0b7", color: "#1a1a1a" }}
                >
                  {m.l}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6" style={{ borderColor: "#e6dfcc" }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-3.5 w-3.5" style={{ color: TERRA }} />
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: TERRA }}>Field notes</div>
            </div>
            <p className="font-serif italic text-[15px] leading-snug text-neutral-700">
              "The examiner rewards the student who has read the newspaper as if it were a syllabus, and the syllabus as if it were a newspaper."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
