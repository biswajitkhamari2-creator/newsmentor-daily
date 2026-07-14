import { useCallback, useEffect, useState } from "react";
import type { LiveMcq } from "@/lib/api";

export type BookmarkedMcq = LiveMcq & {
  id: string;
  topic?: string;
  savedAt: number;
};

const KEY = "upsc.mcq-bookmarks.v1";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function load(): BookmarkedMcq[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookmarkedMcq[]) : [];
  } catch {
    return [];
  }
}

function persist(items: BookmarkedMcq[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  notify();
}

// Stable id for an mcq — based on question text so toggling works across renders.
export function mcqIdFor(m: { question: string }): string {
  let h = 0;
  for (let i = 0; i < m.question.length; i++) h = (h * 31 + m.question.charCodeAt(i)) | 0;
  return `mcq_${h}`;
}

export function useMcqBookmarks() {
  const [items, setItems] = useState<BookmarkedMcq[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
    const l = () => setItems(load());
    listeners.add(l);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) l(); };
    window.addEventListener("storage", onStorage);
    return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
  }, []);

  const toggle = useCallback((m: LiveMcq & { topic?: string }) => {
    const id = mcqIdFor(m);
    const cur = load();
    const exists = cur.some((x) => x.id === id);
    const next = exists
      ? cur.filter((x) => x.id !== id)
      : [{ ...m, id, savedAt: Date.now() }, ...cur];
    persist(next);
    setItems(next);
    return !exists;
  }, []);

  const remove = useCallback((id: string) => {
    const next = load().filter((x) => x.id !== id);
    persist(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => { persist([]); setItems([]); }, []);

  const has = useCallback((m: { question: string }) => items.some((x) => x.id === mcqIdFor(m)), [items]);

  return { ready, items, toggle, remove, clear, has };
}
