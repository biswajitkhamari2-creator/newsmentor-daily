import { useCallback, useEffect, useState } from "react";
import { syllabus as seedSyllabus, todaysPlan as seedPlan, type Task, type SyllabusPaper } from "@/data/mock";

const KEY = "newsmentor.planner.v2";

export type PlannerDay = {
  date: string; // YYYY-MM-DD
  tasks: Task[];
};

export type PlannerState = {
  days: Record<string, PlannerDay>;
  progress: Record<string, number>; // topicId -> percent
  weeklyGoalHrs: number;
  lastActiveDate: string | null;
  streak: number;
  progressSeedCleared?: boolean;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const seedProgress = (): Record<string, number> => {
  const p: Record<string, number> = {};
  seedSyllabus.forEach((paper) => paper.topics.forEach((t) => (p[t.id] = 0)));
  return p;
};

const initial = (): PlannerState => ({
  days: { [todayISO()]: { date: todayISO(), tasks: seedPlan.map((t) => ({ ...t, done: false })) } },
  progress: seedProgress(),
  weeklyGoalHrs: 40,
  lastActiveDate: null,
  streak: 0,
  progressSeedCleared: true,
});

function load(): PlannerState {
  if (typeof window === "undefined") return initial();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    const parsed = JSON.parse(raw) as PlannerState;
    // ensure today exists
    const t = todayISO();
    if (!parsed.days[t]) {
      // carry uncompleted tasks forward? keep simple: seed for new day empty
      parsed.days[t] = { date: t, tasks: [] };
    }
    const baseline = seedProgress();
    return {
      ...initial(),
      ...parsed,
      progress: parsed.progressSeedCleared ? { ...baseline, ...parsed.progress } : baseline,
      progressSeedCleared: true,
    };
  } catch {
    return initial();
  }
}

export function usePlannerStore() {
  const [state, setState] = useState<PlannerState>(() => (typeof window === "undefined" ? initial() : load()));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const today = state.days[todayISO()] ?? { date: todayISO(), tasks: [] };

  const updateDay = (mut: (tasks: Task[]) => Task[]) => {
    const t = todayISO();
    setState((s) => {
      const day = s.days[t] ?? { date: t, tasks: [] };
      return { ...s, days: { ...s.days, [t]: { ...day, tasks: mut(day.tasks) } } };
    });
  };

  const toggleTask = useCallback((id: string) => {
    let toggled: Task | undefined;
    updateDay((tasks) => tasks.map((t) => {
      if (t.id !== id) return t;
      const next = { ...t, done: !t.done };
      toggled = next;
      return next;
    }));
    // log activity (only when marking done, not un-done)
    if (typeof window !== "undefined" && toggled?.done) {
      try {
        const KEY_A = "newsmentor.activity.v1";
        const raw = localStorage.getItem(KEY_A);
        const cur = raw ? JSON.parse(raw) : { attempts: [], activity: [] };
        const event = {
          id: crypto.randomUUID(),
          kind: "task",
          action: "Completed",
          target: `${toggled.title}${toggled.module ? ` · ${toggled.module}` : ""}`,
          at: Date.now(),
        };
        cur.activity = [event, ...(cur.activity ?? [])].slice(0, 200);
        localStorage.setItem(KEY_A, JSON.stringify(cur));
      } catch { /* noop */ }
    }
    // update streak
    setState((s) => {
      const t = todayISO();
      const day = s.days[t];
      if (!day) return s;
      const anyDone = day.tasks.some((x) => x.done) || true;
      if (!anyDone) return s;
      if (s.lastActiveDate === t) return s;
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = s.lastActiveDate === y ? s.streak + 1 : 1;
      return { ...s, lastActiveDate: t, streak };
    });
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "done">) => {
    updateDay((tasks) => [...tasks, { ...task, id: crypto.randomUUID(), done: false }].sort((a, b) => a.time.localeCompare(b.time)));
  }, []);

  const removeTask = useCallback((id: string) => {
    updateDay((tasks) => tasks.filter((t) => t.id !== id));
  }, []);

  const setProgress = useCallback((topicId: string, value: number) => {
    setState((s) => ({ ...s, progress: { ...s.progress, [topicId]: Math.max(0, Math.min(100, Math.round(value))) } }));
  }, []);

  const setWeeklyGoal = useCallback((hrs: number) => {
    setState((s) => ({ ...s, weeklyGoalHrs: Math.max(1, hrs) }));
  }, []);

  // syllabus with live progress
  const syllabusLive: SyllabusPaper[] = seedSyllabus.map((p) => ({
    ...p,
    topics: p.topics.map((t) => ({ ...t, progress: state.progress[t.id] ?? 0 })),
  }));

  // weekly hours per day Mon..Sun of the current ISO week (30m per completed task)
  const weekDailyHrs = (() => {
    const now = new Date();
    const dow = (now.getDay() + 6) % 7; // 0=Mon..6=Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - dow);
    const days: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const day = state.days[key];
      const mins = day ? day.tasks.filter((t) => t.done).length * 30 : 0;
      days.push(Math.round((mins / 60) * 10) / 10);
    }
    return days;
  })();
  const weekHrs = Math.round(weekDailyHrs.reduce((a, b) => a + b, 0) * 10) / 10;

  return {
    ready,
    today,
    tasks: today.tasks,
    syllabus: syllabusLive,
    streak: state.streak,
    weeklyGoalHrs: state.weeklyGoalHrs,
    weekHrs,
    weekDailyHrs,
    toggleTask,
    addTask,
    removeTask,
    setProgress,
    setWeeklyGoal,
  };
}
