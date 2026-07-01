export type Sex = "male" | "female";

// Official IPF GL Coefficients — Classic (Raw) Powerlifting, effective May 2020
// Source: IPF_GL_Coefficients-2020.pdf
const GL_COEFFICIENTS: Record<Sex, { A: number; B: number; C: number }> = {
  male: { A: 1199.72839, B: 1025.18162, C: 0.00921 },
  female: { A: 610.32796, B: 1045.59282, C: 0.03048 },
};

export function calculateGLPoints(
  total: number,
  bodyweight: number,
  sex: Sex,
): number {
  if (!total || !bodyweight) return 0;
  const { A, B, C } = GL_COEFFICIENTS[sex];
  const denominator = A - B * Math.exp(-C * bodyweight);
  if (denominator <= 0) return 0;
  const points = total * (100 / denominator);
  return Math.round(points * 100) / 100;
}
