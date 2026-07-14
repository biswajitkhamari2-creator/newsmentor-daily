import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  BookOpen,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  fetchInstitutionalNews,
  type InstitutionBucket,
  type InstitutionItem,
} from "@/lib/institutions.functions";
import { ArticleDialog } from "@/components/ArticleDialog";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Institutional Engine — UPSC Hero by Biswajit" },
      {
        name: "description",
        content:
          "Daily & weekly current affairs from Vision IAS, Drishti IAS, Insights, IASbaba, ForumIAS and The Hindu — auto-aggregated with crisp bullet notes.",
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

function initials(name: string) {
  return name
    .replace(/[—–-].*/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function pickFeatured(buckets: InstitutionBucket[] | undefined) {
  if (!buckets) return null;
  let best: { item: InstitutionItem; bucket: InstitutionBucket; t: number } | null = null;
  for (const b of buckets) {
    for (const it of b.items) {
      const t = it.pubDate ? new Date(it.pubDate).getTime() : 0;
      if (!best || t > best.t) best = { item: it, bucket: b, t };
    }
  }
  return best;
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

  const featured = useMemo(() => pickFeatured(data), [data]);
  const otherBuckets = useMemo(
    () => (data ?? []).filter((b) => b.key !== featured?.bucket.key),
    [data, featured],
  );

  return (
    <div className="relative min-h-full">
      {/* Ambient radial glow, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(1200px 600px at 100% -10%, oklch(0.30 0.14 275 / 0.35) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-10 animate-fade-in-up">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
              <Building2 className="h-3.5 w-3.5" />
              Institutional Engine
            </div>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mt-3 text-foreground">
              Coaching-grade current affairs
            </h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              Curated analytical sources from Vision IAS, Drishti, Insights, IASbaba,
              ForumIAS and The Hindu — one editorial desk for high-yield civil service prep.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SegmentedToggle value={range} onChange={setRange} />
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh feed
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Couldn't load feeds. Try refresh.
          </div>
        )}

        {isLoading && !data && (
          <div className="mt-10 grid grid-cols-12 gap-6">
            <Skeleton className="col-span-12 lg:col-span-8 aspect-[16/9] rounded-2xl" />
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
            <Skeleton className="col-span-12 md:col-span-6 h-52 rounded-2xl" />
            <Skeleton className="col-span-12 md:col-span-6 h-52 rounded-2xl" />
          </div>
        )}

        {data && (
          <div className="mt-10 grid grid-cols-12 gap-6">
            {/* Featured hero */}
            {featured && (
              <FeaturedTile
                item={featured.item}
                bucket={featured.bucket}
                onOpen={() => setActive(featured.item)}
              />
            )}

            {/* Side stack: next 2 buckets' top items */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {otherBuckets.slice(0, 2).map((b) => (
                <SideTile
                  key={b.key}
                  bucket={b}
                  item={b.items[0]}
                  onOpen={(it) => setActive(it)}
                />
              ))}
            </div>

            {/* Remaining source buckets */}
            {otherBuckets.slice(2).map((b) => (
              <SourceBucket
                key={b.key}
                bucket={b}
                onOpen={(it) => setActive(it)}
              />
            ))}
          </div>
        )}
      </div>

      <ArticleDialog item={active} onClose={() => setActive(null)} />
    </div>
  );
}

function SegmentedToggle({
  value,
  onChange,
}: {
  value: "1d" | "7d";
  onChange: (v: "1d" | "7d") => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 text-xs">
      <button
        onClick={() => onChange("1d")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
          value === "1d"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Clock className="h-3 w-3" /> Daily
      </button>
      <button
        onClick={() => onChange("7d")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
          value === "7d"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <BookOpen className="h-3 w-3" /> Weekly
      </button>
    </div>
  );
}

function FeaturedTile({
  item,
  bucket,
  onOpen,
}: {
  item: InstitutionItem;
  bucket: InstitutionBucket;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group col-span-12 lg:col-span-8 relative overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:border-primary/50"
    >
      <div className="relative aspect-[16/9] w-full">
        {/* Gradient wash */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.24 0.10 275) 0%, oklch(0.19 0.06 275) 55%, oklch(0.14 0.04 275) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(400px 260px at 85% 15%, oklch(0.58 0.22 275 / 0.55) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Top-right open icon */}
        <div className="absolute right-6 top-6">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur transition-all group-hover:bg-primary group-hover:border-primary">
            <ArrowUpRight className="h-5 w-5 text-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="absolute left-8 right-8 bottom-8">
          <div className="inline-flex items-center rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
            Featured · {bucket.name}
          </div>
          <h3 className="mt-4 font-serif text-3xl md:text-4xl leading-[1.1] max-w-2xl">
            {item.title}
          </h3>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(item.pubDate) || "recent"}
            </span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1 text-primary">
              <Sparkles className="h-3 w-3" /> Crisp notes
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function SideTile({
  bucket,
  item,
  onOpen,
}: {
  bucket: InstitutionBucket;
  item?: InstitutionItem;
  onOpen: (item: InstitutionItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-secondary/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background font-serif text-sm text-primary">
            {initials(bucket.name)}
          </div>
          <div>
            <div className="font-serif text-lg leading-tight">{bucket.name}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {bucket.tagline}
            </div>
          </div>
        </div>
        <a
          href={bucket.site}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-primary"
          aria-label={`Visit ${bucket.name}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {item ? (
        <button
          onClick={() => onOpen(item)}
          className="mt-4 block w-full text-left group"
        >
          <h4 className="font-serif text-xl leading-snug line-clamp-3 group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeAgo(item.pubDate) || "recent"}
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1 text-primary/80">
              <Sparkles className="h-3 w-3" /> Crisp notes
            </span>
          </div>
        </button>
      ) : (
        <div className="mt-4 text-sm italic text-muted-foreground">
          No fresh items in this window.
        </div>
      )}
    </div>
  );
}

function SourceBucket({
  bucket,
  onOpen,
}: {
  bucket: InstitutionBucket;
  onOpen: (item: InstitutionItem) => void;
}) {
  return (
    <div className="col-span-12 md:col-span-6 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background font-serif text-sm text-primary">
            {initials(bucket.name)}
          </div>
          <div>
            <div className="font-serif text-lg leading-tight">{bucket.name}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {bucket.tagline}
            </div>
          </div>
        </div>
        <a
          href={bucket.site}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <ul className="mt-4 divide-y divide-border/60">
        {bucket.items.length === 0 && (
          <li className="py-4 text-sm italic text-muted-foreground">
            No fresh items in this window.
          </li>
        )}
        {bucket.items.slice(0, 6).map((it) => (
          <li key={it.id}>
            <button
              onClick={() => onOpen(it)}
              className="group flex w-full items-start gap-3 py-3 text-left"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {it.title}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {timeAgo(it.pubDate) || "recent"}
                  <span className="opacity-40">·</span>
                  <span className="inline-flex items-center gap-1 text-primary/80">
                    <Sparkles className="h-3 w-3" /> Crisp notes
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
