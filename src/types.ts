export type Sex = "male" | "female";
export type LiftType = "Squat" | "Bench" | "Deadlift";
export type SortMode = LiftType | "total" | "dots";

// One meet/session: all three lifts + bodyweight recorded on the same date
export interface LiftSession {
  date: string; // "YYYY-MM-DD"
  bodyweight: number;
  Squat: number;
  Bench: number;
  Deadlift: number;
}

export interface Hero {
  name: string;
  sex: Sex;
  history: LiftSession[];
}

export interface RankedHero extends Hero {
  total: number;
  dots: number;
  originalRank: number;
}
