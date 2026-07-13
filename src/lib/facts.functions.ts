import { createServerFn } from "@tanstack/react-start";

export type PrelimsFact = { k: string; v: string };

// Wikipedia "On this day" — real, live, no key required.
const pad = (n: number) => String(n).padStart(2, "0");

export const fetchPrelimsFacts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PrelimsFact[]> => {
    const d = new Date();
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${pad(
      d.getMonth() + 1
    )}/${pad(d.getDate())}`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "UPSCHeroByBiswajit/1.0 (facts)" },
      });
      if (!res.ok) throw new Error(`onthisday ${res.status}`);
      const json = (await res.json()) as {
        events?: { year: number; text: string }[];
      };
      const events = (json.events ?? [])
        .filter((e) => e.text && e.year)
        .sort((a, b) => b.year - a.year)
        .slice(0, 25)
        .map<PrelimsFact>((e) => ({
          k: String(e.year),
          v: e.text.length > 140 ? e.text.slice(0, 137) + "…" : e.text,
        }));
      if (events.length) return events;
    } catch {
      // fall through to fallback
    }
    return [
      { k: "Repo rate", v: "6.5% (unchanged)" },
      { k: "Green H₂ target", v: "5 MMT by 2030" },
      { k: "15th FC devolution", v: "41% of central taxes" },
      { k: "Wassenaar members", v: "42 states" },
      { k: "Gaganyaan launcher", v: "Human-rated LVM3" },
    ];
  }
);
