import { useEffect, useState, useCallback } from "react";
import { subjects } from "@/data/subjectMap";
import { syllabusDetail } from "@/data/syllabusDetail";

const KEY = "upsc.syllabus-tracker.v1";

export type ChapterItem = {
  id: string;          // `${subjectKey}::${index}`
  subjectKey: string;
  subjectName: string;
  paper: string;
  text: string;
};

export type CheckedMap = Record<string, { at: number }>;

export function getChaptersForSubject(subjectKey: string): ChapterItem[] {
  const s = subjects.find((x) => x.key === subjectKey);
  if (!s) return [];
  const points: string[] = [];
  if (s.topicIds) {
    for (const tid of s.topicIds) {
      const det = syllabusDetail[tid];
      if (det) points.push(...det.points);
    }
  }
  if (s.extraPoints) points.push(...s.extraPoints);
  return points.map((text, i) => ({
    id: `${s.key}::${i}`,
    subjectKey: s.key,
    subjectName: s.name,
    paper: s.paper,
    text,
  }));
}

export function useSyllabusTracker() {
  const [checked, setChecked] = useState<CheckedMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch { /* noop */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch { /* noop */ }
  }, [checked, ready]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { at: Date.now() };
      return next;
    });
  }, []);

  const clearArchive = useCallback(() => setChecked({}), []);

  const unarchive = useCallback((id: string) => {
    setChecked((prev) => {
      const n = { ...prev }; delete n[id]; return n;
    });
  }, []);

  return { ready, checked, toggle, clearArchive, unarchive };
}
