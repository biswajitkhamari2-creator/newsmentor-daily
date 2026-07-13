import { useCallback, useEffect, useMemo, useState } from "react";

export type Category = "study" | "revision" | "mock" | "current-affairs" | "break" | "custom";
export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "completed" | "overdue";

export type ScheduleTask = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  duration: number; // minutes
  title: string;
  subject?: string;
  category: Category;
  priority: Priority;
  notes?: string;
  status: Status;
  createdAt: string;
};

export type ScheduleState = {
  tasks: ScheduleTask[];
  dailyGoalMin: number; // minutes
  streak: number;
  lastActiveDate: string | null;
};

const KEY = "upsc.schedule.v1";
const todayISO = () => new Date().toISOString().slice(0, 10);
const yesterdayISO = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const seed = (): ScheduleTask[] => {
  const d = todayISO();
  const mk = (o: Omit<ScheduleTask, "id" | "date" | "status" | "createdAt">): ScheduleTask => ({
    id: crypto.randomUUID(),
    date: d,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...o,
  });
  return [
    mk({ time: "06:30", duration: 30, title: "Wake up · Meditation", category: "break", priority: "low" }),
    mk({ time: "07:00", duration: 60, title: "The Hindu · Editorial", subject: "Current Affairs", category: "current-affairs", priority: "high" }),
    mk({ time: "08:15", duration: 105, title: "Polity — DPSP", subject: "Polity", category: "study", priority: "high", notes: "Laxmikanth Ch. 8" }),
    mk({ time: "10:15", duration: 30, title: "Break", category: "break", priority: "low" }),
    mk({ time: "10:45", duration: 90, title: "Economy — Monetary Policy", subject: "Economy", category: "study", priority: "medium" }),
    mk({ time: "12:30", duration: 60, title: "Lunch", category: "break", priority: "low" }),
    mk({ time: "14:00", duration: 120, title: "Modern History — Revolt of 1857", subject: "History", category: "study", priority: "medium" }),
    mk({ time: "16:15", duration: 45, title: "PIB summary", subject: "Current Affairs", category: "current-affairs", priority: "medium" }),
    mk({ time: "17:30", duration: 60, title: "CSAT — Reasoning Set 3", subject: "CSAT", category: "mock", priority: "high" }),
    mk({ time: "19:00", duration: 60, title: "Revision — Polity Week 1", subject: "Polity", category: "revision", priority: "high" }),
  ];
};

const initial = (): ScheduleState => ({
  tasks: seed(),
  dailyGoalMin: 480, // 8h
  streak: 0,
  lastActiveDate: null,
});

function load(): ScheduleState {
  if (typeof window === "undefined") return initial();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    return { ...initial(), ...(JSON.parse(raw) as ScheduleState) };
  } catch {
    return initial();
  }
}

export function useScheduleStore() {
  const [state, setState] = useState<ScheduleState>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  // Mark overdue for today's uncompleted past-time tasks
  useEffect(() => {
    if (!ready) return;
    const now = new Date();
    const d = todayISO();
    setState((s) => {
      let changed = false;
      const tasks = s.tasks.map((t) => {
        if (t.date !== d || t.status === "completed") return t;
        const [h, m] = t.time.split(":").map(Number);
        const end = new Date();
        end.setHours(h, m + t.duration, 0, 0);
        const shouldOverdue = end < now;
        const nextStatus: Status = shouldOverdue ? "overdue" : "pending";
        if (nextStatus !== t.status) { changed = true; return { ...t, status: nextStatus }; }
        return t;
      });
      return changed ? { ...s, tasks } : s;
    });
  }, [ready]);

  const addTask = useCallback((t: Omit<ScheduleTask, "id" | "status" | "createdAt">) => {
    setState((s) => ({
      ...s,
      tasks: [
        ...s.tasks,
        { ...t, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setState((s) => {
      const tasks = s.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === "completed" ? "pending" as Status : "completed" as Status } : t,
      );
      const d = todayISO();
      const anyDoneToday = tasks.some((t) => t.date === d && t.status === "completed");
      let streak = s.streak;
      let lastActiveDate = s.lastActiveDate;
      if (anyDoneToday && s.lastActiveDate !== d) {
        streak = s.lastActiveDate === yesterdayISO() ? s.streak + 1 : 1;
        lastActiveDate = d;
      }
      return { ...s, tasks, streak, lastActiveDate };
    });
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<ScheduleTask>) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }, []);

  const setDailyGoal = useCallback((min: number) => {
    setState((s) => ({ ...s, dailyGoalMin: Math.max(30, Math.round(min)) }));
  }, []);

  const tasksByDate = useMemo(() => {
    const m = new Map<string, ScheduleTask[]>();
    state.tasks.forEach((t) => {
      const arr = m.get(t.date) ?? [];
      arr.push(t);
      m.set(t.date, arr);
    });
    m.forEach((arr) => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return m;
  }, [state.tasks]);

  return {
    ready,
    tasks: state.tasks,
    tasksByDate,
    dailyGoalMin: state.dailyGoalMin,
    streak: state.streak,
    addTask,
    toggleComplete,
    removeTask,
    updateTask,
    setDailyGoal,
  };
}
