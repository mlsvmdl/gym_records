// Synthesised iron, built to sound heavy rather than arcade-y:
//   thud  - a low sine that drops in pitch (the weight of the hit)
//   ring  - detuned inharmonic partials through a dark filter (dirty steel)
//   grit  - a short burst of low-passed noise (the contact)
// Everything runs through one shared chain: dark EQ -> soft saturation -> dry +
// a generated "concrete basement" reverb. No audio files to load.

let ctx: AudioContext | null = null;
let bus: AudioNode | null = null;
// Bypasses the dark EQ and saturation (still gets the room): for bright, clean rings
let cleanBus: AudioNode | null = null;

// Gentle tanh saturation: rounds the transients and adds grit
function softClipCurve() {
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(2.4 * x) / Math.tanh(2.4);
  }
  return curve;
}

// Impulse response of a small concrete room: a few hard early reflections,
// then a dark, low-passed noise tail
function basementImpulse(audio: AudioContext) {
  const seconds = 1.5;
  const length = Math.floor(audio.sampleRate * seconds);
  const impulse = audio.createBuffer(2, length, audio.sampleRate);
  const reflections = [0.011, 0.023, 0.037, 0.052];
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      lp += 0.22 * (Math.random() * 2 - 1 - lp); // one-pole low-pass = dark tail
      data[i] = lp * Math.pow(1 - t, 3) * 2.2;
    }
    reflections.forEach((s, k) => {
      const at = Math.floor((s + ch * 0.003) * audio.sampleRate);
      data[at] += 0.6 / (k + 1);
    });
  }
  return impulse;
}

function getBus() {
  if (!ctx || !bus || !cleanBus) {
    ctx = new AudioContext();
    const input = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 3000;
    const shaper = ctx.createWaveShaper();
    shaper.curve = softClipCurve();
    shaper.oversample = "2x";
    const dry = ctx.createGain();
    dry.gain.value = 0.85;
    const verb = ctx.createConvolver();
    verb.buffer = basementImpulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    const out = ctx.createGain();
    out.gain.value = 0.8;

    input.connect(tone).connect(shaper);
    shaper.connect(dry).connect(out);
    shaper.connect(verb).connect(wet).connect(out);
    // Limiter: overlapping plates/echo tails can stack past full scale; squash
    // them instead of letting the browser hard-clip
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 4;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.15;
    out.connect(limiter).connect(ctx.destination);
    const clean = ctx.createGain();
    clean.connect(dry);
    clean.connect(verb);
    bus = input;
    cleanBus = clean;
  }
  if (ctx.state === "suspended") ctx.resume();
  return { audio: ctx, input: bus, clean: cleanBus! };
}

function noiseBuffer(audio: AudioContext, seconds: number) {
  const buffer = audio.createBuffer(
    1,
    Math.floor(audio.sampleRate * seconds),
    audio.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// Envelope helper: quick attack, exponential decay
function envelope(audio: AudioContext, peak: number, decay: number) {
  const gain = audio.createGain();
  const now = audio.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
  return gain;
}

// Inharmonic ratios of a struck steel plate
const RING_RATIOS = [1, 1.47, 2.09, 2.56, 3.39, 4.12];

// weight: 0 = small light piece of iron, 1 = big heavy plate
function hit(weight: number, volume: number, ring: number) {
  const { audio, input } = getBus();
  const now = audio.currentTime;
  const pitch = 1.3 - 0.6 * weight;

  const out = audio.createGain();
  out.gain.value = volume;
  out.connect(input);

  // thud
  const thud = audio.createOscillator();
  thud.frequency.setValueAtTime(120 * pitch, now);
  thud.frequency.exponentialRampToValueAtTime(42 * pitch, now + 0.09);
  const thudEnv = envelope(audio, 0.6 + 0.6 * weight, 0.18 + 0.15 * weight);
  thud.connect(thudEnv).connect(out);
  thud.start(now);
  thud.stop(now + 0.4);

  // ring: each partial is a detuned pair, so it beats and sounds dirty
  const ringFilter = audio.createBiquadFilter();
  ringFilter.type = "lowpass";
  ringFilter.frequency.value = 1800 * pitch;
  ringFilter.Q.value = 2;
  ringFilter.connect(out);
  RING_RATIOS.forEach((ratio, i) => {
    const decay = ring * (0.9 - i * 0.11);
    const env = envelope(audio, 0.22 / (i + 1), decay);
    env.connect(ringFilter);
    [-6, 6].forEach((cents) => {
      const osc = audio.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = 150 * pitch * ratio * (0.98 + Math.random() * 0.04);
      osc.detune.value = cents;
      osc.connect(env);
      osc.start(now);
      osc.stop(now + decay);
    });
  });

  // grit
  const grit = audio.createBufferSource();
  grit.buffer = noiseBuffer(audio, 0.1);
  const gritFilter = audio.createBiquadFilter();
  gritFilter.type = "lowpass";
  gritFilter.frequency.value = 1100 * pitch;
  const gritEnv = envelope(audio, 0.7, 0.06);
  grit.connect(gritFilter).connect(gritEnv).connect(out);
  grit.start(now);
}

// Re-sorting the board (only while searching hides the podium) and the sound toggle
export const playClang = () => hit(0.8, 0.5, 1.1);

// #1's number slamming down: a loaded bar dropped on the platform
export const playSlam = () => {
  hit(1, 0.6, 1.6);
  const { audio, input } = getBus();
  const now = audio.currentTime;
  const boom = audio.createOscillator();
  boom.frequency.setValueAtTime(70, now);
  boom.frequency.exponentialRampToValueAtTime(32, now + 0.25);
  const env = envelope(audio, 0.9, 0.5);
  boom.connect(env).connect(input);
  boom.start(now);
  boom.stop(now + 0.6);
};

// A plate landing on the sleeve: heavier plates are deeper and ring longer
// Partials measured from a recording of cast-iron plates being loaded
// (public/audio reference clip): frequency at a 20-25 kg plate, relative
// strength, ring scale, and whether it wobbles. The strongest were ~760, 1360 and
// 2410 Hz; overall brightness centres around 2.2 kHz.
const PLATE_MODES: [hz: number, amp: number, ring: number, wobble: boolean][] =
  [
    [512, 0.2, 0.7, false],
    [762, 0.7, 1, false],
    [1162, 0.6, 0.9, false],
    [1362, 0.9, 0.95, false],
    [1562, 0.5, 0.75, true],
    [2287, 0.6, 0.7, true],
    [2412, 0.9, 0.75, true],
    [2737, 0.7, 0.65, false],
    [3012, 0.55, 0.55, false],
    [3337, 0.55, 0.5, false],
    [4100, 0.35, 0.4, false],
    [4962, 0.45, 0.35, false],
  ];

// A plate going onto the sleeve and striking the plate before it, matched to
// the reference recording: a hard full-range contact click, then a bright
// metallic ring (~0.5 s to fade 30 dB) with very little low end. Upper partials
// drift ~5-7% in pitch as the plate rocks on the sleeve; every hit varies a
// little in pitch and balance, like real plates do.
export const playPlateClank = (kg: number) => {
  const { audio, input, clean } = getBus();
  const now = audio.currentTime;
  const weight = Math.min(kg, 25) / 25; // 1 = 25 kg, ~0.05 = 1.25 kg
  // small change plates are a bit higher and shorter than the big iron
  const pitch = (0.92 + (1 - weight) * 0.3) * (0.96 + Math.random() * 0.08);
  const ringFor = 0.38 + 0.22 * weight;

  const out = audio.createGain();
  out.gain.value = 0.13;
  out.connect(clean);

  PLATE_MODES.forEach(([hz, amp, ringScale, wobble]) => {
    // wobbling partials keep ringing long enough for the whole arc to be heard
    const decay =
      ringFor * ringScale * (wobble ? 1.6 : 1) * (0.85 + Math.random() * 0.3);
    const env = envelope(audio, amp * (0.7 + Math.random() * 0.6), decay);
    env.connect(out);
    const f = hz * pitch;
    // the plate rocking on the sleeve: pitch arcs up ~8-14% over ~0.22 s and
    // falls back over the next ~0.3 s (shared by both oscillators of the pair)
    const rise = 1.08 + Math.random() * 0.06;
    const settle = 0.97 + Math.random() * 0.04;
    // a tiny mistuning = slow, gentle shimmer (a wider one flutters audibly)
    [0.999, 1.001].forEach((mistune) => {
      const osc = audio.createOscillator();
      const base = f * mistune;
      osc.frequency.setValueAtTime(base, now);
      if (wobble) {
        osc.frequency.linearRampToValueAtTime(base * rise, now + 0.22);
        osc.frequency.linearRampToValueAtTime(base * settle, now + 0.52);
      }
      osc.connect(env);
      osc.start(now);
      osc.stop(now + decay);
    });
  });

  // contact click: hard, full-range, a few milliseconds long
  const click = audio.createBufferSource();
  click.buffer = noiseBuffer(audio, 0.015);
  const clickFilter = audio.createBiquadFilter();
  clickFilter.type = "highpass";
  clickFilter.frequency.value = 1200;
  const clickEnv = envelope(audio, 1.2, 0.015);
  click.connect(clickFilter).connect(clickEnv).connect(out);
  click.start(now);

  // sizzle: the plate scraping and rattling on the sleeve, a noisy wash
  // between the partials up around 3-7 kHz that fades with the ring
  const sizzle = audio.createBufferSource();
  sizzle.buffer = noiseBuffer(audio, 0.4);
  const sizzleBand = audio.createBiquadFilter();
  sizzleBand.type = "bandpass";
  sizzleBand.frequency.value = 4500;
  sizzleBand.Q.value = 0.7;
  const sizzleEnv = envelope(audio, 0.22, ringFor * 0.7);
  sizzle.connect(sizzleBand).connect(sizzleEnv).connect(out);
  sizzle.start(now);

  // a faint low body (~6% of the energy in the recording)
  const knock = audio.createOscillator();
  knock.frequency.setValueAtTime(90, now);
  knock.frequency.exponentialRampToValueAtTime(60, now + 0.06);
  const knockEnv = envelope(audio, 0.08 + 0.08 * weight, 0.08);
  knock.connect(knockEnv).connect(input);
  knock.start(now);
  knock.stop(now + 0.1);
};

// Dry ratchet click while a podium number counts up, like a chain over a gear
export const playTick = () => {
  const { audio, input } = getBus();
  const now = audio.currentTime;
  const click = audio.createBufferSource();
  click.buffer = noiseBuffer(audio, 0.02);
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1300 * (0.92 + Math.random() * 0.16);
  band.Q.value = 6;
  const env = envelope(audio, 0.5, 0.025);
  click.connect(band).connect(env).connect(input);
  click.start(now);

  const knock = audio.createOscillator();
  knock.frequency.setValueAtTime(110, now);
  knock.frequency.exponentialRampToValueAtTime(60, now + 0.03);
  const knockEnv = envelope(audio, 0.25, 0.04);
  knock.connect(knockEnv).connect(input);
  knock.start(now);
  knock.stop(now + 0.06);
};
