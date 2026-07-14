import { useCallback, useEffect, useState } from "react";

export type ArchivedQuestion = {
  id: string;
  question: string;
  marks: number;
  wordLimit: number;
  paper: string;
  hint: string;
  keyPoints: string[];
  modelAnswer: string;
  topic: string;
  savedAt: number;
};

const KEY = "upsc.mains-archive.v1";

export function useMainsArchive() {
  const [items, setItems] = useState<ArchivedQuestion[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* noop */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* noop */ }
  }, [items, ready]);

  const addMany = useCallback((qs: Omit<ArchivedQuestion, "savedAt">[]) => {
    setItems((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      const now = Date.now();
      for (const q of qs) {
        if (!map.has(q.id)) map.set(q.id, { ...q, savedAt: now });
      }
      return Array.from(map.values()).sort((a, b) => b.savedAt - a.savedAt);
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback((id: string) => items.some((p) => p.id === id), [items]);

  return { ready, items, addMany, remove, clear, has };
}
