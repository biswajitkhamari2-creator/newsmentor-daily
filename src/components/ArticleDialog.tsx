import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Sparkles } from "lucide-react";
import { fetchArticleDetail } from "@/lib/article.functions";

export type ArticleDialogItem = {
  title: string;
  link: string;
  source?: string;
  pubDate?: string;
  bullets?: string[];
};

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

export function ArticleDialog({
  item,
  onClose,
}: {
  item: ArticleDialogItem | null;
  onClose: () => void;
}) {
  const fetchDetail = useServerFn(fetchArticleDetail);
  const { data, isLoading, error } = useQuery({
    enabled: !!item,
    queryKey: ["article", item?.link],
    queryFn: () => fetchDetail({ data: { url: item!.link } }),
    staleTime: 30 * 60 * 1000,
  });

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {item && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 flex-wrap">
                {item.source && (
                  <Badge variant="outline" className="border-gold/50 text-gold">
                    {item.source}
                  </Badge>
                )}
                {data?.siteName && <Badge variant="outline">{data.siteName}</Badge>}
                {item.pubDate && (
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(item.pubDate)}
                  </span>
                )}
              </div>
              <DialogTitle className="font-serif text-2xl leading-snug mt-2">
                {data?.title || item.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Full article content
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {item.bullets && item.bullets.length > 0 && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="text-xs uppercase tracking-widest text-gold mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Crisp notes
                  </div>
                  <ul className="space-y-2 text-sm">
                    {item.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gold shrink-0">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Full article
                </div>

                {isLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                )}

                {error && (
                  <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Couldn't fetch article content.
                  </div>
                )}

                {data?.image && (
                  <img
                    src={data.image}
                    alt=""
                    className="rounded-lg border w-full mb-4 max-h-72 object-cover"
                  />
                )}

                {data && (
                  <article className="max-w-none">
                    {data.paragraphs.map((p, i) =>
                      p.startsWith("## ") ? (
                        <h3
                          key={i}
                          className="font-serif text-lg mt-4 mb-1 text-foreground"
                        >
                          {p.slice(3)}
                        </h3>
                      ) : (
                        <p
                          key={i}
                          className="text-sm leading-relaxed text-foreground/90 mb-3"
                        >
                          {p}
                        </p>
                      ),
                    )}
                  </article>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
