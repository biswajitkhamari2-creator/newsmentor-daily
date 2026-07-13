import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Loader2, Sparkles, Upload as UploadIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockSummary, type GsPaper } from "@/data/summary";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
  head: () => ({
    meta: [
      { title: "Upload Newspaper — NewsMentor Daily" },
      {
        name: "description",
        content:
          "Drop a PDF or image of today's newspaper — get instant UPSC-mapped summaries by GS paper.",
      },
      { property: "og:title", content: "Upload Newspaper — NewsMentor Daily" },
      { property: "og:url", content: "/upload" },
    ],
    links: [{ rel: "canonical", href: "/upload" }],
  }),
});

const gsColors: Record<GsPaper, string> = {
  Polity: "bg-primary/10 text-primary border-primary/30",
  Economy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  Environment: "bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/30",
  IR: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
  "S&T": "bg-accent/20 text-accent-foreground border-accent/50",
};

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = (f: File) => {
    setFile(f);
    setShowSummary(false);
    if (f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl(null);
    setShowSummary(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const summarize = () => {
    setLoading(true);
    setShowSummary(false);
    setTimeout(() => {
      setLoading(false);
      setShowSummary(true);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          Upload today's newspaper
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          PDF or image. We'll return a GS-paper-tagged summary you can copy into
          your notes.
        </p>
      </div>

      {/* Dropzone */}
      <Card
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) accept(f);
        }}
        className={`relative border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-accent bg-accent/5" : "border-border"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) accept(f);
          }}
        />
        {!file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <UploadIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Drag & drop your newspaper</p>
              <p className="text-sm text-muted-foreground">PDF or image, up to 20 MB</p>
            </div>
            <Button onClick={() => inputRef.current?.click()} className="mt-2">
              Choose file
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <FileText className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <FileText className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="truncate font-medium">{file.name}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB · Ready to summarize
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={summarize} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Summarizing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Summarize
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clear} disabled={loading}>
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="mt-8 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
        </div>
      )}

      {/* Summary output */}
      {showSummary && !loading && (
        <div className="mt-10 animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">Your UPSC summary</h2>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              {mockSummary.length} points
            </Badge>
          </div>
          <div className="space-y-3">
            {mockSummary.map((p, i) => (
              <Card key={i} className="hover-lift p-4">
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className={`shrink-0 rounded-full border font-semibold ${gsColors[p.gs]}`}
                  >
                    GS · {p.gs}
                  </Badge>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed">{p.point}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty helper */}
      {!file && !loading && (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Tip: The Hindu, Indian Express, and PIB releases work best.
        </p>
      )}
    </div>
  );
}
