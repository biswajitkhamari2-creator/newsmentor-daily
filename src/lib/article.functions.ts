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

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    const finalUrl = res.url || url;
    if (!res.ok) {
      return {
        title: "",
        paragraphs: [`Couldn't load the source article (HTTP ${res.status}).`],
        finalUrl,
      };
    }
    const html = await res.text();

    const ogTitle = pickMeta(html, "og:title");
    const ogSite = pickMeta(html, "og:site_name");
    const ogImage = pickMeta(html, "og:image");
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = ogTitle || (titleTag ? decode(titleTag[1]).trim() : "");

    const paragraphs = extractParagraphs(html);

    return {
      title,
      paragraphs: paragraphs.length
        ? paragraphs
        : [
            "This source doesn't expose readable article text (likely paywalled or JS-rendered).",
          ],
      finalUrl,
      siteName: ogSite || undefined,
      image: ogImage || undefined,
    };
  });
