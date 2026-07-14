import { createServerFn } from "@tanstack/react-start";
import { PRELIMS_FACTS, type PrelimsFact } from "@/data/prelimsFacts";

export type { PrelimsFact };

// Static, curated Prelims facts. Returned in strict subject order:
// Polity → Economics → History → Geography. The client rotator advances
// through this sequence continuously so the same order repeats forever.
export const fetchPrelimsFacts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PrelimsFact[]> => PRELIMS_FACTS
);
