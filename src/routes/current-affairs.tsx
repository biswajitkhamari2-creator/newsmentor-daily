import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Newspaper, Clock, Loader2 } from "lucide-react";
import { headlines } from "@/data/mock";

export const Route = createFileRoute("/current-affairs")({
  head: () => ({
    meta: [
      { title: "Current Affairs — NewsMentor Daily" },
      { name: "description", content: "GS-tagged daily newspaper summaries, editorials and PIB briefs. Upload your own PDF for an AI-styled summary." },
    ],
  }),
  component: CurrentAffairs,
});

function CurrentAffairs() {
  const [q, setQ] = useState("");
  const [gs, setGs] = useState<string>("All");
  const filtered = headlines.filter(
    (h) => (gs === "All" || h.gs === gs) && h.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-gold">Daily Brief</div>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1">Current Affairs</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          The Hindu, Indian Express & PIB — condensed into GS-mapped notes. Upload your own newspaper PDF and we'll simulate a summary.
        </p>
      </header>

      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed"><Newspaper className="h-4 w-4 mr-1" /> Feed</TabsTrigger>
          <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-1" /> Upload PDF</TabsTrigger>
          <TabsTrigger value="editorial"><FileText className="h-4 w-4 mr-1" /> Editorials</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input placeholder="Search headlines…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
            {["All", "GS-I", "GS-II", "GS-III", "GS-IV", "Prelims"].map((g) => (
              <Button key={g} size="sm" variant={gs === g ? "default" : "outline"} onClick={() => setGs(g)}>{g}</Button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((h) => (
              <Card key={h.id} className="hover-lift shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge className="bg-primary text-primary-foreground">{h.gs}</Badge>
                    {h.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                    <span className="ml-auto flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {h.minutes} min
                    </span>
                  </div>
                  <h3 className="font-serif text-xl mt-3 leading-snug">{h.title}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{h.source}</div>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {h.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gold mt-1">▸</span>
                        <span className="text-foreground/80">{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No headlines match. Try clearing filters.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <UploadZone />
        </TabsContent>

        <TabsContent value="editorial" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="font-serif text-2xl">Editorial deep-dives</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              {headlines.filter((h) => h.source.includes("Editorial")).map((h) => (
                <div key={h.id} className="border-l-2 border-gold pl-4">
                  <div className="text-xs text-muted-foreground">{h.source}</div>
                  <h4 className="font-serif text-lg">{h.title}</h4>
                  <p className="text-muted-foreground mt-1">{h.bullets[0]}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UploadZone() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [file, setFile] = useState<string | null>(null);
  const onFile = (f: File | null) => {
    if (!f) return;
    setFile(f.name);
    setState("loading");
    setTimeout(() => setState("done"), 1800);
  };
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <label className="block border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-gold cursor-pointer transition">
          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <div className="font-serif text-xl mt-3">Drop today's newspaper PDF</div>
          <div className="text-sm text-muted-foreground mt-1">PDF up to 25 MB · runs entirely in your browser (demo)</div>
          {file && <div className="mt-3 text-xs text-foreground">Selected: {file}</div>}
        </label>

        {state === "loading" && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Summarising…
            </div>
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        )}

        {state === "done" && (
          <div className="mt-6 space-y-4">
            <div className="text-xs uppercase tracking-wider text-gold">GS-mapped summary</div>
            {[
              { gs: "GS-II · Polity", bullets: ["Electoral bonds review reserved.", "UCC rules notified for Uttarakhand."] },
              { gs: "GS-III · Economy", bullets: ["RBI repo unchanged at 6.5%; CPI revised to 5.4%.", "PLI adds 1 GW electrolyser capacity."] },
              { gs: "GS-II · IR", bullets: ["India-EU FTA 12th round concludes.", "India chairs Wassenaar plenary."] },
            ].map((s) => (
              <div key={s.gs} className="border rounded-lg p-4 bg-muted/30">
                <div className="text-xs font-semibold text-primary">{s.gs}</div>
                <ul className="mt-2 space-y-1 text-sm">
                  {s.bullets.map((b, i) => <li key={i} className="flex gap-2"><span className="text-gold">▸</span>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
