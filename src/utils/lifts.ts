import { Hero, LiftSession, LiftType, SortMode } from "../types";

export const LIFT_TYPES: LiftType[] = ["Squat", "Bench", "Deadlift"];

// The "current" bodyweight is whatever was logged in the most recent session,
// since that's the number that should feed into DOTS today.
const getLatestSession = (hero: Hero): LiftSession | null => {
  if (!hero.history || hero.history.length === 0) return null;
  return [...hero.history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
};

// The leaderboard always shows a hero's all-time PR for each lift, regardless
// of which session it happened in. Expanding a row shows how they got there
// via hero.history (handled inside HeroDetail).
export const getLiftValue = (hero: Hero, type: LiftType) => {
  if (!hero.history || hero.history.length === 0) return 0;
  return Math.max(...hero.history.map((session) => session[type]));
};

// All-time total = sum of each lift's all-time best, not a single session's total.
export const computeTotal = (hero: Hero) =>
  LIFT_TYPES.reduce((sum, type) => sum + getLiftValue(hero, type), 0);

export const getCurrentBodyweight = (hero: Hero) => {
  const latest = getLatestSession(hero);
  return latest ? latest.bodyweight : 0;
};

export const getSortValue = (
  hero: Hero & { total: number; dots: number },
  mode: SortMode,
): number => {
  if (mode === "total") return hero.total;
  if (mode === "dots") return hero.dots;
  return getLiftValue(hero, mode);
};

export const METRIC_LABEL: Record<SortMode, string> = {
  total: "kg total",
  Squat: "kg squat",
  Bench: "kg bench",
  Deadlift: "kg deadlift",
  dots: "DOTS",
};

export const formatMetric = (value: number, mode: SortMode) =>
  mode === "dots" ? value.toFixed(2) : Math.round(value).toString();
