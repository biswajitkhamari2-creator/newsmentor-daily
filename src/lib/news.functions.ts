import { createServerFn } from "@tanstack/react-start";

export type NewsItem = { title: string; link: string; pubDate?: string; source?: string };

// Google News RSS — India top stories (no API key required).
const FEED_URL =
  "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en";

function decodeEntities(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function pick(block: string, tag: string) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeEntities(m[1]).trim() : "";
}

export const fetchLatestNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<NewsItem[]> => {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "Mozilla/5.0 UPSCHeroByBiswajit/1.0" },
    });
    if (!res.ok) throw new Error(`Feed error ${res.status}`);
    const xml = await res.text();
    const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
    return items.slice(0, 15).map((block) => {
      const rawTitle = pick(block, "title");
      const source = pick(block, "source");
      // Strip trailing " - Source" that Google News appends
      const title = source
        ? rawTitle.replace(new RegExp(`\\s*-\\s*${source}\\s*$`), "")
        : rawTitle;
      return {
        title,
        link: pick(block, "link"),
        pubDate: pick(block, "pubDate"),
        source,
      };
    });
  }
);
