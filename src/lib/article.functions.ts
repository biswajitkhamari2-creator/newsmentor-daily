import { createServerFn } from "@tanstack/react-start";

export type ArticleDetail = {
  title: string;
  paragraphs: string[];
  finalUrl: string;
  siteName?: string;
  image?: string;
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
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function pickMeta(html: string, name: string) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const m = html.match(re);
  return m ? decode(m[1]) : "";
}

function sliceContainer(html: string): string {
  // Prefer known article content containers first
  const idCandidates = [
    /<div[^>]+id=["']article-content["'][^>]*>([\s\S]*?)<\/div>\s*<\/(?:section|main|article|div)>/i,
    /<div[^>]+id=["']article-content["'][^>]*>([\s\S]*?)$/i,
    /<div[^>]+class=["'][^"']*\bck-content\b[^"']*["'][^>]*>([\s\S]*?)$/i,
    /<div[^>]+class=["'][^"']*\b(entry-content|post-content|article-body|td-post-content)\b[^"']*["'][^>]*>([\s\S]*?)$/i,
  ];
  for (const re of idCandidates) {
    const m = html.match(re);
    if (m) return m[1] || m[2] || "";
  }
  const art = html.match(/<article[\s\S]*?<\/article>/i);
  if (art) return art[0];
  const main = html.match(/<main[\s\S]*?<\/main>/i);
  if (main) return main[0];
  return html;
}

function extractParagraphs(html: string): string[] {
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "");

  cleaned = sliceContainer(cleaned);

  const chunks: string[] = [];
  const blockRe = /<(p|h2|h3|h4|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(cleaned)) !== null) {
    const tag = m[1].toLowerCase();
    const raw = m[2].replace(/<[^>]+>/g, " ");
    const text = decode(raw).replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (/^(subscribe|share|comments?|read more|advertisement|related|tags?|follow us|choose your preferred)/i.test(text)) continue;
    if (text.length < 30 && tag === "p") continue;
    if (tag.startsWith("h")) {
      chunks.push(`## ${text}`);
    } else {
      chunks.push(text);
    }
  }

  const out: string[] = [];
  for (const c of chunks) {
    if (out[out.length - 1] !== c) out.push(c);
    if (out.length > 80) break;
  }
  return out;
}

async function resolveGoogleNews(url: string): Promise<string> {
  // Google News RSS often gives news.google.com/rss/articles/... redirect URLs.
  // Follow to the destination.
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 UPSCHeroByBiswajit/1.0" },
      redirect: "follow",
    });
    return res.url || url;
  } catch {
    return url;
  }
}

async function fetchViaJinaReader(url: string): Promise<{ title: string; paragraphs: string[] } | null> {
  // r.jina.ai is a free reader proxy that renders JS and strips boilerplate,
  // returning clean markdown. No API key required.
  try {
    const readerUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(readerUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 UPSCHeroByBiswajit/1.0",
        Accept: "text/plain, text/markdown",
        "X-Return-Format": "markdown",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const md = await res.text();
    if (!md || md.length < 200) return null;

    // Reader returns a small header block: "Title: ...\nURL Source: ...\n\nMarkdown Content:\n..."
    let title = "";
    const titleMatch = md.match(/^Title:\s*(.+)$/m);
    if (titleMatch) title = titleMatch[1].trim();
    const bodyStart = md.indexOf("Markdown Content:");
    const body = bodyStart >= 0 ? md.slice(bodyStart + "Markdown Content:".length) : md;

    const paragraphs: string[] = [];
    for (const rawLine of body.split(/\n+/)) {
      let line = rawLine.trim();
      if (!line) continue;
      // strip markdown images and standalone links
      if (/^!\[/.test(line)) continue;
      if (/^\[.*\]\(.*\)\s*$/.test(line)) continue;
      // remove leading list bullets & blockquote markers
      line = line.replace(/^([*+\-]|\d+\.|>)\s+/, "");
      // inline: [text](url) -> text
      line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
      // strip emphasis / code markers
      line = line.replace(/[*_`]{1,3}([^*_`]+)[*_`]{1,3}/g, "$1");
      if (/^#{1,6}\s+/.test(line)) {
        const t = line.replace(/^#{1,6}\s+/, "").trim();
        if (t) paragraphs.push(`## ${t}`);
        continue;
      }
      if (line.length < 40) continue;
      if (/^(subscribe|share this|comments?|read more|advertisement|related|tags?|follow us|sign in|log in|newsletter)/i.test(line)) continue;
      paragraphs.push(line);
      if (paragraphs.length > 80) break;
    }
    if (paragraphs.length < 2) return null;
    return { title, paragraphs };
  } catch {
    return null;
  }
}

export const fetchArticleDetail = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const r = (raw ?? {}) as { url?: string };
    if (!r.url || typeof r.url !== "string") throw new Error("url required");
    return { url: r.url };
  })
  .handler(async ({ data }): Promise<ArticleDetail> => {
    let url = data.url;
    if (url.includes("news.google.com")) {
      url = await resolveGoogleNews(url);
    }

    let finalUrl = url;
    let html = "";
    let httpStatus = 0;
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
      finalUrl = res.url || url;
      httpStatus = res.status;
      if (res.ok) html = await res.text();
    } catch {
      // network error — will fall through to reader
    }

    let ogTitle = "";
    let ogSite = "";
    let ogImage = "";
    let ogDesc = "";
    let title = "";
    let paragraphs: string[] = [];

    if (html) {
      ogTitle = pickMeta(html, "og:title");
      ogSite = pickMeta(html, "og:site_name");
      ogImage = pickMeta(html, "og:image");
      ogDesc = pickMeta(html, "og:description") || pickMeta(html, "description");
      const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      title = ogTitle || (titleTag ? decode(titleTag[1]).trim() : "");
      paragraphs = extractParagraphs(html);
    }

    // Fallback 1: reader proxy (handles JS-rendered / anti-bot / soft-paywall)
    if (paragraphs.length < 3) {
      const via = await fetchViaJinaReader(finalUrl);
      if (via) {
        if (!title && via.title) title = via.title;
        paragraphs = via.paragraphs;
      }
    }

    // Fallback 2: og:description as a single readable paragraph
    if (paragraphs.length === 0 && ogDesc) {
      paragraphs = [ogDesc];
    }

    if (paragraphs.length === 0) {
      const reason = httpStatus && httpStatus !== 200
        ? `Couldn't load the source article (HTTP ${httpStatus}).`
        : "This source doesn't expose readable article text (likely paywalled or JS-rendered). Open the original link below to read it.";
      paragraphs = [reason];
    }

    return {
      title,
      paragraphs,
      finalUrl,
      siteName: ogSite || undefined,
      image: ogImage || undefined,
    };
  });
