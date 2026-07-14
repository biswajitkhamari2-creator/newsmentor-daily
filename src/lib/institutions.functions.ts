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
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 260)
    .slice(0, 5);
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/xml" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

function parseRss(xml: string, sourceName: string, keyPrefix: string, limit = 8): InstitutionItem[] {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  return blocks.slice(0, limit).map((block, idx) => {
    const title = pick(block, "title");
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

function titleFromSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function fetchVisionIAS(): Promise<InstitutionItem[]> {
  const html = await fetchText("https://visionias.in/current-affairs/news-today");
  const re =
    /href="(\/current-affairs\/news-today\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+\/[a-z0-9-]+)"/g;
  const seen = new Set<string>();
  const items: InstitutionItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null && items.length < 8) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const path = m[1];
    const slug = path.split("/").pop() || "";
    items.push({
      id: `vision-${items.length}`,
      title: titleFromSlug(slug),
      link: `https://visionias.in${path}`,
      pubDate: `${m[2]}T00:00:00Z`,
      summary: "",
      bullets: [],
      source: "Vision IAS",
    });
  }
  return items;
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};
function parseDMY(s: string): string | undefined {
  // Matches "04 May 2026" or "4 May 2026"
  const m = s.match(/(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/);
  if (!m) return undefined;
  const mon = MONTHS[m[2].slice(0, 3).toLowerCase()];
  if (!mon) return undefined;
  const dd = m[1].padStart(2, "0");
  return `${m[3]}-${mon}-${dd}T00:00:00Z`;
}

function parseDDMMYYYY(s: string): string | undefined {
  const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return undefined;
  return `${m[3]}-${m[2]}-${m[1]}T00:00:00Z`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function fetchDrishti(): Promise<InstitutionItem[]> {
  // Drishti's current, freshly-updated feed lives on the editorials landing:
  // https://www.drishtiias.com/current-affairs-news-analysis-editorials
  // Each day's aggregated News Analysis + Editorials is linked by date.
  const html = await fetchText(
    "https://www.drishtiias.com/current-affairs-news-analysis-editorials",
  );
  const re =
    /href="(https:\/\/www\.drishtiias\.com\/current-affairs-news-analysis-editorials\/news-analysis\/(\d{2}-\d{2}-\d{4}))"/g;
  const seen = new Set<string>();
  const items: InstitutionItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null && items.length < 12) {
    const url = m[1];
    const ddmmyyyy = m[2];
    if (seen.has(url)) continue;
    seen.add(url);
    const iso = parseDDMMYYYY(ddmmyyyy);
    items.push({
      id: `drishti-${items.length}`,
      title: iso
        ? `News Analysis & Editorials — ${fmtDate(iso)}`
        : `News Analysis & Editorials — ${ddmmyyyy}`,
      link: url,
      pubDate: iso,
      summary:
        "Drishti IAS daily aggregated news analysis and editorials. Open to read the full day's coverage.",
      bullets: [],
      source: "Drishti IAS",
    });
  }
  return items;
}

const SOURCES: Array<{
  key: string;
  name: string;
  tagline: string;
  site: string;
  accent: string;
  load: () => Promise<InstitutionItem[]>;
}> = [
  {
    key: "vision",
    name: "Vision IAS",
    tagline: "Daily News Today",
    site: "https://visionias.in/current-affairs",
    accent: "from-amber-500/20 to-orange-500/5",
    load: fetchVisionIAS,
  },
  {
    key: "drishti",
    name: "Drishti IAS",
    tagline: "Daily News Analysis & Editorials",
    site: "https://www.drishtiias.com/current-affairs-news-analysis-editorials",
    accent: "from-rose-500/20 to-pink-500/5",
    load: fetchDrishti,
  },
  {
    key: "insights",
    name: "Insights IAS",
    tagline: "Daily Current Affairs",
    site: "https://www.insightsonindia.com",
    accent: "from-sky-500/20 to-blue-500/5",
    load: async () =>
      parseRss(await fetchText("https://www.insightsonindia.com/feed/"), "Insights IAS", "insights"),
  },
  {
    key: "iasbaba",
    name: "IASbaba",
    tagline: "Daily News, Quiz & TLP",
    site: "https://iasbaba.com",
    accent: "from-emerald-500/20 to-teal-500/5",
    load: async () =>
      parseRss(await fetchText("https://iasbaba.com/feed/"), "IASbaba", "iasbaba"),
  },
  {
    key: "forumias",
    name: "ForumIAS",
    tagline: "9 PM Brief & Editorials",
    site: "https://forumias.com/blog",
    accent: "from-violet-500/20 to-purple-500/5",
    load: async () =>
      parseRss(await fetchText("https://forumias.com/blog/feed/"), "ForumIAS", "forumias"),
  },
  {
    key: "pib",
    name: "PIB India",
    tagline: "Government Press Releases",
    site: "https://pib.gov.in",
    accent: "from-yellow-500/20 to-amber-500/5",
    load: async () =>
      parseRss(
        await fetchText("https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3"),
        "PIB India",
        "pib",
      ),
  },
];

export const fetchInstitutionalNews = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const r = (raw ?? {}) as { range?: "1d" | "7d" };
    return { range: r.range === "7d" ? "7d" : "1d" } as { range: "1d" | "7d" };
  })
  .handler(async ({ data }): Promise<InstitutionBucket[]> => {
    const now = Date.now();
    const windowMs = data.range === "7d" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const oldestAllowed = now - windowMs;

    const results = await Promise.all(
      SOURCES.map(async (s) => {
        let items: InstitutionItem[] = [];
        try {
          items = await s.load();
        } catch {
          items = [];
        }
        // Keep only genuinely fresh items for the selected Daily/Weekly window.
        const filtered = items.filter((it) => {
          if (!it.pubDate) return false;
          const t = new Date(it.pubDate).getTime();
          if (!Number.isFinite(t)) return false;
          return t >= oldestAllowed && t <= now + 24 * 60 * 60 * 1000;
        });
        // Freshest first.
        filtered.sort((a, b) => {
          const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
          const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
          return tb - ta;
        });
        return {
          key: s.key,
          name: s.name,
          tagline: s.tagline,
          site: s.site,
          accent: s.accent,
          items: filtered.slice(0, 8),
        } satisfies InstitutionBucket;
      }),
    );
    return results;
  });
