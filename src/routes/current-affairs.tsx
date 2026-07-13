import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Newspaper, Clock, Loader2, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { headlines } from "@/data/mock";
import { fetchNews, type LiveNews } from "@/lib/api";
import { ArticleDialog, type ArticleDialogItem } from "@/components/ArticleDialog";

export const Route = createFileRoute("/current-affairs")({
  head: () => ({
    meta: [
      { title: "Current Affairs — UPSC Hero by Biswajit" },
      { name: "description", content: "Live GS-tagged current affairs feed and editorial deep-dives, powered by your UPSC Hero backend." },
    ],
  }),
  component: CurrentAffairs,
});

function CurrentAffairs() {
  const [q, setQ] = useState("");
  const [gs, setGs] = useState<string>("All");
  const [news, setNews] = useState<LiveNews[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<ArticleDialogItem | null>(null);

  const load = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchNews(refresh);
      setNews(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(false); }, []);

  const filteredLive = (news ?? []).filter((n) =>
    n.title.toLowerCase().includes(q.toLowerCase()),
  );
  const filteredMock = headlines.filter(
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
            <Input placeholder="Search live headlines…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
            <Button size="sm" variant="outline" onClick={() => load(true)} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <span className="text-xs text-muted-foreground ml-auto">
              {news ? `${news.length} live headlines` : loading ? "Loading…" : ""}
            </span>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          {loading && !news && (
            <div className="grid gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="shadow-sm">
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {news && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredLive.slice(0, 60).map((n, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive({ title: n.title, link: n.link, source: n.source })}
                  className="text-left"
                >
                  <Card className="hover-lift shadow-sm h-full transition hover:border-gold/50">
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge className="bg-primary text-primary-foreground">Live</Badge>
                        <Badge variant="outline">{n.source}</Badge>
                      </div>
                      <h3 className="font-serif text-xl mt-3 leading-snug">{n.title}</h3>
                      {n.summary && n.summary !== n.title && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{n.summary}</p>
                      )}
                      <div className="mt-3 inline-flex items-center gap-1 text-xs text-gold">
                        Read here <ExternalLink className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
              {filteredLive.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No headlines match your search.
                </div>
              )}
            </div>
          )}
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
      <ArticleDialog item={active} onClose={() => setActive(null)} />
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
