import { useMemo, useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpenCheck, CheckCircle2, Sparkles, X } from "lucide-react";
import { subjects as ALL_SUBJECTS } from "@/data/subjectMap";
import { useSyllabusTracker, getChaptersForSubject, type ChapterItem } from "@/hooks/useSyllabusTracker";

const todayISO = () => new Date().toISOString().slice(0, 10);

export function TodayDiary() {
  const { ready, checked, toggle } = useSyllabusTracker();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Flat catalog of every chapter across subjects
  const catalog: ChapterItem[] = useMemo(
    () => ALL_SUBJECTS.flatMap((s) => getChaptersForSubject(s.key)),
    [],
  );

  const total = catalog.length;
  const doneCount = catalog.filter((c) => checked[c.id]).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const startOfToday = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime();
  }, []);
  const todayItems = useMemo(
    () =>
      catalog
        .filter((c) => checked[c.id] && checked[c.id].at >= startOfToday)
        .map((c) => ({ ...c, at: checked[c.id].at }))
        .sort((a, b) => b.at - a.at),
    [catalog, checked, startOfToday],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    return catalog
      .filter((c) => !checked[c.id])
      .filter((c) => {
        const hay = `${c.text} ${c.subjectName} ${c.paper}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 8);
  }, [query, catalog, checked]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = (c: ChapterItem) => {
    toggle(c.id);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); pick(suggestions[activeIdx]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  if (!ready) return null;

  return (
    <section className="space-y-3 animate-fade-in">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl">Today's Diary</h2>
          <span className="text-xs text-muted-foreground">({todayISO()})</span>
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Syllabus · <span className="text-foreground font-medium">{doneCount}/{total}</span> ({pct}%)
        </div>
      </div>

      <Card className="p-4 space-y-4">
        {/* Search input with autocomplete */}
        <div ref={wrapRef} className="relative">
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold pointer-events-none" />
            <Input
              value={query}
              onFocus={() => setOpen(true)}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onKeyDown={onKeyDown}
              placeholder="Type what you read… e.g. fundamental rights, mauryan, climate change"
              className="pl-9"
            />
          </div>

          {open && query.trim().length >= 2 && (
            <div className="absolute z-30 mt-1 w-full rounded-lg border bg-popover shadow-lg overflow-hidden">
              {suggestions.length === 0 ? (
                <div className="px-3 py-3 text-sm text-muted-foreground">
                  No matching syllabus chapter. Try another keyword.
                </div>
              ) : (
                suggestions.map((c, i) => (
                  <button
                    type="button"
                    key={c.id}
                    onMouseDown={(e) => { e.preventDefault(); pick(c); }}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={[
                      "w-full text-left px-3 py-2 flex items-start gap-2 transition",
                      i === activeIdx ? "bg-gold/10" : "hover:bg-muted/50",
                    ].join(" ")}
                  >
                    <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm leading-snug">{highlight(c.text, query)}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                        {c.subjectName} · {c.paper}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Overall progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full gradient-gold"
              style={{ width: `${pct}%`, transition: "width 700ms cubic-bezier(0.16,1,0.3,1)" }}
            />
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">{pct}%</div>
        </div>

        {/* Today's ticked entries */}
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Read today
            <Badge variant="secondary" className="text-[10px]">{todayItems.length}</Badge>
          </div>
          {todayItems.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Type a topic above — pick a suggestion to tick it off the syllabus.
            </div>
          ) : (
            <div className="space-y-1.5">
              {todayItems.map((c) => (
                <div
                  key={c.id}
                  className="group flex items-start gap-3 rounded-lg p-2.5 bg-muted/30 hover:bg-muted/50 transition"
                >
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm leading-relaxed line-through text-muted-foreground">
                      {c.text}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mt-0.5">
                      {c.subjectName} · {c.paper}
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(c.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
                    title="Undo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}

function highlight(text: string, q: string) {
  const query = q.trim();
  if (query.length < 2) return text;
  const tokens = Array.from(new Set(query.split(/\s+/).filter((t) => t.length >= 2)));
  if (tokens.length === 0) return text;
  const re = new RegExp(`(${tokens.map(escapeReg).join("|")})`, "ig");
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? <mark key={i} className="bg-gold/25 text-foreground rounded px-0.5">{p}</mark> : <span key={i}>{p}</span>,
  );
}
function escapeReg(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
