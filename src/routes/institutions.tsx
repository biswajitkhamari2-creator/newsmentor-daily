import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import {
  fetchInstitutionalNews,
  type InstitutionItem,
} from "@/lib/institutions.functions";
import { ArticleDialog } from "@/components/ArticleDialog";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Institutional Engine — NewsMentor Daily" },
      {
        name: "description",
        content:
          "Daily & weekly current affairs from Vision IAS, Drishti IAS, Insights, IASbaba, ForumIAS and PIB — auto-aggregated with crisp bullet notes.",
      },
    ],
  }),
  component: InstitutionsPage,
});

function timeAgo(iso?: string) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (!then) return "";
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function InstitutionsPage() {
  const fetchFn = useServerFn(fetchInstitutionalNews);
  const [range, setRange] = useState<"1d" | "7d">("1d");
  const [active, setActive] = useState<InstitutionItem | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["institutional-news", range],
    queryFn: () => fetchFn({ data: { range } }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" /> Institutional Engine
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1">
            Coaching-grade current affairs
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Live pulls from Vision IAS, Drishti IAS, Insights, IASbaba, ForumIAS &
            PIB. Tap any headline for crisp, exam-ready bullet notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={(v) => setRange(v as "1d" | "7d")}>
            <TabsList>
              <TabsTrigger value="1d">
                <Clock className="h-3.5 w-3.5 mr-1" /> Daily
              </TabsTrigger>
              <TabsTrigger value="7d">
                <BookOpen className="h-3.5 w-3.5 mr-1" /> Weekly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Couldn't load feeds. Try refresh.
        </div>
      )}

      {isLoading && !data && (
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data && (
        <div className="grid gap-5 lg:grid-cols-2">
          {data.map((bucket) => (
            <Card
              key={bucket.key}
              className={`relative overflow-hidden shadow-sm bg-gradient-to-br ${bucket.accent}`}
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold/70 via-gold to-gold/70" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-background/70 backdrop-blur border font-serif text-sm">
                        {bucket.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="font-serif text-xl leading-tight">
                          {bucket.name}
                        </div>
                        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                          {bucket.tagline}
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    href={bucket.site}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground hover:text-gold inline-flex items-center gap-1"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <ul className="mt-4 space-y-2">
                  {bucket.items.length === 0 && (
                    <li className="text-sm text-muted-foreground italic py-4">
                      No fresh items in this window.
                    </li>
                  )}
                  {bucket.items.slice(0, 6).map((it) => (
                    <li key={it.id}>
                      <button
                        onClick={() => setActive(it)}
                        className="group w-full text-left rounded-lg border border-transparent hover:border-border bg-background/60 hover:bg-background transition p-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                              {it.title}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {timeAgo(it.pubDate) || "recent"}
                              <span className="opacity-40">•</span>
                              <span className="inline-flex items-center gap-1 text-gold/80">
                                <Sparkles className="h-3 w-3" /> Crisp notes
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ArticleDialog
        item={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

