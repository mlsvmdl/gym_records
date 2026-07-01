export type Sex = "male" | "female";
export type LiftType = "Squat" | "Bench" | "Deadlift";

export interface LiftRecord {
  type: LiftType;
  value: number; // kg
  videoUrl?: string;
}

export interface Hero {
  name: string;
  bodyweight: number; // kg
  sex: Sex;
  Records: LiftRecord[];
}

export type SortMode = "total" | "Squat" | "Bench" | "Deadlift" | "glPoints";
