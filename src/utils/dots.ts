import { Sex } from "../types";

// DOTS: total × 500 / (A + B·bw + C·bw² + D·bw³ + E·bw⁴), a bodyweight-adjusted
// strength score that lets lifters of different sizes be compared.
const DOTS_COEFFICIENTS: Record<Sex, [number, number, number, number, number]> = {
  male: [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093],
  female: [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706],
};

// The polynomial is only fitted over these bodyweights; outside them it's
// clamped to the edge instead of extrapolated
const BODYWEIGHT_RANGE: Record<Sex, [number, number]> = {
  male: [40, 210],
  female: [40, 150],
};

export function calculateDots(total: number, bodyweight: number, sex: Sex): number {
  if (!total || !bodyweight) return 0;
  const [min, max] = BODYWEIGHT_RANGE[sex];
  const bw = Math.min(Math.max(bodyweight, min), max);
  const [a, b, c, d, e] = DOTS_COEFFICIENTS[sex];
  const denominator = a + b * bw + c * bw ** 2 + d * bw ** 3 + e * bw ** 4;
  if (denominator <= 0) return 0;
  return Math.round(((total * 500) / denominator) * 100) / 100;
}
