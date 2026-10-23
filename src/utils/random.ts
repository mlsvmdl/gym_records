// Deterministic pseudo-random in [0,1) so generated shapes (splatter, cracks)
// come out identical on every render
export const seeded = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
