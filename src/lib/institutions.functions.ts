import { createServerFn } from "@tanstack/react-start";

export type InstitutionItem = {
  id: string;
  title: string;
  link: string;
  pubDate?: string;
  summary: string;
  bullets: string[];
  source: string;
};

export type InstitutionBucket = {
  key: string;
  name: string;
  tagline: string;
  site: string;
  accent: string;
  items: InstitutionItem[];
};

const SOURCES: Array<{
  key: string;
  name: string;
  tagline: string;
  site: string;
  domain: string;
  accent: string;
}> = [
  {
    key: "vision",
    name: "Vision IAS",
    tagline: "Daily Current Affairs & Monthly Magazine",
    site: "https://www.visionias.in",
    domain: "visionias.in",
    accent: "from-amber-500/20 to-orange-500/5",
  },
  {
    key: "drishti",
    name: "Drishti IAS",
    tagline: "Daily News Analysis & Editorials",
    site: "https://www.drishtiias.com",
    domain: "drishtiias.com",
    accent: "from-rose-500/20 to-pink-500/5",
  },
  {
    key: "insights",
    name: "Insights IAS",
    tagline: "Daily Current Affairs + Secure",
    site: "https://www.insightsonindia.com",
    domain: "insightsonindia.com",
    accent: "from-sky-500/20 to-blue-500/5",
  },
  {
    key: "iasbaba",
    name: "IASbaba",
    tagline: "Daily News, Quiz & TLP",
    site: "https://iasbaba.com",
    domain: "iasbaba.com",
    accent: "from-emerald-500/20 to-teal-500/5",
  },
  {
    key: "forumias",
    name: "ForumIAS",
    tagline: "9 PM Brief & Editorials",
    site: "https://blog.forumias.com",
    domain: "forumias.com",
    accent: "from-violet-500/20 to-purple-500/5",
  },
  {
    key: "pib",
    name: "PIB India",
    tagline: "Government Press Releases",
    site: "https://pib.gov.in",
    domain: "pib.gov.in",
    accent: "from-yellow-500/20 to-amber-500/5",
  },
];

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function pick(block: string, tag: string) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decode(m[1]).trim() : "";
}

function stripHtml(s: string) {
  return decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function toBullets(text: string): string[] {
  if (!text) return [];
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 260);
  return sentences.slice(0, 5);
}

async function fetchGoogleNews(domain: string, when: "1d" | "7d") {
  const q = encodeURIComponent(`site:${domain} when:${when}`);
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 NewsMentorDaily/1.0" },
  });
  if (!res.ok) return "";
  return res.text();
}

function parseItems(xml: string, sourceName: string, keyPrefix: string): InstitutionItem[] {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  return blocks.slice(0, 8).map((block, idx) => {
    const rawTitle = pick(block, "title");
    const src = pick(block, "source");
    const title = src
      ? rawTitle.replace(new RegExp(`\\s*-\\s*${src}\\s*$`), "")
      : rawTitle;
    const description = stripHtml(pick(block, "description"));
    return {
      id: `${keyPrefix}-${idx}`,
      title,
      link: pick(block, "link"),
      pubDate: pick(block, "pubDate"),
      summary: description || title,
      bullets: toBullets(description),
      source: sourceName,
    };
  });
}

export const fetchInstitutionalNews = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const r = (raw ?? {}) as { range?: "1d" | "7d" };
    return { range: r.range === "7d" ? "7d" : "1d" } as { range: "1d" | "7d" };
  })
  .handler(async ({ data }): Promise<InstitutionBucket[]> => {
    const range = data.range;
    const results = await Promise.all(
      SOURCES.map(async (s) => {
        try {
          const xml = await fetchGoogleNews(s.domain, range);
          const items = parseItems(xml, s.name, s.key);
          return {
            key: s.key,
            name: s.name,
            tagline: s.tagline,
            site: s.site,
            accent: s.accent,
            items,
          } satisfies InstitutionBucket;
        } catch {
          return {
            key: s.key,
            name: s.name,
            tagline: s.tagline,
            site: s.site,
            accent: s.accent,
            items: [] as InstitutionItem[],
          } satisfies InstitutionBucket;
        }
      }),
    );
    return results;
  });
