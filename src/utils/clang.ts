// Synthesised iron clangs: a short noise "hit" plus a few inharmonic
// partials, like steel struck against steel. No audio files needed.
const PARTIALS: [freq: number, amp: number][] = [
  [180, 1],
  [287, 0.7],
  [463, 0.5],
  [701, 0.35],
  [1043, 0.2],
];

let ctx: AudioContext | null = null;

// pitch scales every partial (higher = smaller piece of iron),
// ring scales how long it rings out.
function strike(pitch: number, volume: number, ring: number) {
  ctx = ctx ?? new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;

  const out = ctx.createGain();
  out.gain.value = volume;
  out.connect(ctx.destination);

  PARTIALS.forEach(([baseFreq, amp]) => {
    const freq = baseFreq * pitch * (0.97 + Math.random() * 0.06);
    const osc = ctx!.createOscillator();
    osc.frequency.value = freq;
    const gain = ctx!.createGain();
    const decay = (0.25 + 180 / freq) * ring; // low partials ring longer
    gain.gain.setValueAtTime(amp, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);
    osc.connect(gain).connect(out);
    osc.start(now);
    osc.stop(now + decay);
  });

  const noise = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const hit = ctx.createBufferSource();
  hit.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2500 * pitch;
  const hitGain = ctx.createGain();
  hitGain.gain.setValueAtTime(0.8, now);
  hitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  hit.connect(band).connect(hitGain).connect(out);
  hit.start(now);
}

// Big clang for re-sorting the leaderboard
export const playClang = () => strike(1, 0.18, 1);

// Ratchet tick while a podium number counts up; climbs in pitch as it nears the top
export const playTick = (progress: number) =>
  strike(2.4 + progress * 1.4, 0.05, 0.08);

// A plate landing on the sleeve: 25 kg is a deep klang, 1.25 kg a high tink
export const playPlateClank = (kg: number) => {
  const lightness = (25 - Math.min(kg, 25)) / 25; // 0 for 25 kg, ~1 for tiny plates
  strike(0.8 + lightness * 1.1, 0.12, 0.55 - lightness * 0.25);
};
