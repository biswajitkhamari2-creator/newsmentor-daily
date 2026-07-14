import { useCallback, useEffect, useState } from "react";

export type MockAttempt = {
  id: string;
  mockId: string;
  title: string;
  type: "Prelims" | "Mains" | "Sectional";
  questions: number;
  score: number;
  max: number;
  at: number; // epoch ms
};

export type ActivityKind = "task" | "attempt" | "bookmark" | "note";

export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  action: string; // e.g. "Completed", "Scored 62/100", "Bookmarked"
  target: string; // e.g. "Editorial: Green H2 Mission"
  at: number;
};

type State = {
  attempts: MockAttempt[];
  activity: ActivityEvent[];
};

const KEY = "newsmentor.activity.v1";
const initial: State = { attempts: [], activity: [] };

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...(JSON.parse(raw) as State) };
  } catch {
    return initial;
  }
}

// simple pub-sub so multiple hook instances stay in sync within a tab
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useActivityStore() {
  const [state, setState] = useState<State>(() => (typeof window === "undefined" ? initial : load()));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
    const l = () => setState(load());
    listeners.add(l);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) l(); };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const persist = (next: State) => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
    setState(next);
    notify();
  };

  const logAttempt = useCallback((a: Omit<MockAttempt, "id" | "at">) => {
    const cur = load();
    const attempt: MockAttempt = { ...a, id: crypto.randomUUID(), at: Date.now() };
    const event: ActivityEvent = {
      id: crypto.randomUUID(),
      kind: "attempt",
      action: `Scored ${a.score}/${a.max}`,
      target: a.title,
      at: attempt.at,
    };
    persist({
      attempts: [attempt, ...cur.attempts].slice(0, 100),
      activity: [event, ...cur.activity].slice(0, 200),
    });
  }, []);

  const logActivity = useCallback((e: Omit<ActivityEvent, "id" | "at">) => {
    const cur = load();
    const event: ActivityEvent = { ...e, id: crypto.randomUUID(), at: Date.now() };
    persist({ ...cur, activity: [event, ...cur.activity].slice(0, 200) });
  }, []);

  const clear = useCallback(() => persist(initial), []);

  return {
    ready,
    attempts: state.attempts,
    activity: state.activity,
    logAttempt,
    logActivity,
    clear,
  };
}

export function relativeTime(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(ts).toLocaleDateString();
}
