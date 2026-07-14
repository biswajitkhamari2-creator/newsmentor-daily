import { createServerFn } from "@tanstack/react-start";
import { PRELIMS_FACTS, type PrelimsFact } from "@/data/prelimsFacts";

export type { PrelimsFact };

// Static, curated Prelims facts — no external fetch, no AI, no demo/placeholder.
// Rotates deterministically by day so users see variety across visits without
// introducing fake data. See src/data/prelimsFacts.ts for the source list.
export const fetchPrelimsFacts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PrelimsFact[]> => {
    const day = Math.floor(Date.now() / 86_400_000);
    const n = PRELIMS_FACTS.length;
    const start = ((day % n) + n) % n;
    // Return the full pool rotated by today's offset so the client rotator
    // has a stable, ordered set to cycle through.
    return [...PRELIMS_FACTS.slice(start), ...PRELIMS_FACTS.slice(0, start)];
  }
);
