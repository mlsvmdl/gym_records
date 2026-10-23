import React, { useId } from "react";
import { Box, GlobalStyles, Typography } from "@mui/material";
import { FONTS, IRON } from "../theme";
import { playPlateClank } from "../utils/clang";
import { useSound } from "../utils/sound";

// IPF competition plates: kg, colour, height and thickness in SVG units
const PLATES = [
  { kg: 25, color: "#b3141c", h: 96, t: 12 },
  { kg: 20, color: "#1f4a9c", h: 96, t: 10 },
  { kg: 15, color: "#d1a21e", h: 84, t: 9 },
  { kg: 10, color: "#2b7d36", h: 70, t: 8 },
  { kg: 5, color: "#ddd5c4", h: 46, t: 7 },
  { kg: 2.5, color: "#1c1b1b", h: 38, t: 6 },
  { kg: 1.25, color: "#a9adb2", h: 30, t: 5 },
] as const;

type Plate = (typeof PLATES)[number];

const BAR_KG = 20;
const COLLARS_KG = 5; // 2.5 kg each side, competition collars

// Greedy plate loading per side. Lifts under bar + collars go without collars.
export function loadPlates(totalKg: number): {
  perSide: Plate[];
  collars: boolean;
} {
  const collars = totalKg >= BAR_KG + COLLARS_KG;
  let side = (totalKg - BAR_KG - (collars ? COLLARS_KG : 0)) / 2;
  const perSide: Plate[] = [];
  for (const plate of PLATES) {
    while (side >= plate.kg - 1e-9) {
      perSide.push(plate);
      side -= plate.kg;
    }
  }
  return { perSide, collars };
}

const CY = 55; // bar centreline
const INNER_LEFT = 104; // sleeve stop positions
const INNER_RIGHT = 256;

// Each pair of plates slides on, accelerating into the plates already on the bar
// (ease-in, no bounce), so the moment the animation ends *is* the impact.
// The clank is played from animationend, which keeps the sound locked to the motion.
const SLIDE_S = 0.28;
const PAIR_STEP_S = 0.26; // gap between pairs landing (real loading is ~0.6-0.8 s)
const MAX_FILL_S = 4; // heavy loads speed up so all three bars never take longer than this
const BAR_GAP_S = 0.3; // breath between finishing one bar and starting the next

const PlateRect: React.FC<{
  plate: Plate;
  x: number;
  delay: number;
  fromLeft: boolean;
  onLanded?: () => void;
}> = ({ plate, x, delay, fromLeft, onLanded }) => (
  <g
    className="lb-plate"
    onAnimationEnd={onLanded}
    style={
      {
        "--from": `${fromLeft ? -70 : 70}px`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties
    }
  >
    <rect
      x={x}
      y={CY - plate.h / 2}
      width={plate.t}
      height={plate.h}
      rx={1.5}
      fill={plate.color}
      stroke="#000"
      strokeWidth={1}
    />
    {/* worn highlight down one edge, dark rim on the other */}
    <rect
      x={x + 1}
      y={CY - plate.h / 2 + 3}
      width={1.5}
      height={plate.h - 6}
      fill="rgba(255,255,255,0.25)"
    />
    <rect
      x={x + plate.t - 2.5}
      y={CY - plate.h / 2 + 2}
      width={1.5}
      height={plate.h - 4}
      fill="rgba(0,0,0,0.35)"
    />
  </g>
);

interface LoadedLift {
  lift: string;
  kg: number;
  perSide: Plate[];
  collars: boolean;
}

const Barbell: React.FC<
  LoadedLift & { start: number; step: number; compact: boolean }
> = ({ lift, kg, perSide, collars, start, step, compact }) => {
  const { soundOn } = useSound();
  const uid = useId().replace(/:/g, "");
  const steel = `url(#lb-steel${uid})`;
  const breakdown = perSide.length
    ? perSide.map((p) => p.kg).join(" · ")
    : "empty bar";
  const delayOf = (i: number) => start + i * step;
  const collarDelay =
    delayOf(perSide.length) + (perSide.length ? SLIDE_S - step : 0);

  // Lay plates outward from each sleeve stop. Both sides of a pair land together,
  // so only the right-hand plate triggers the clank.
  let leftX = INNER_LEFT;
  let rightX = INNER_RIGHT;
  const left = perSide.map((plate, i) => {
    leftX -= plate.t + 1;
    return (
      <PlateRect
        key={`l${i}`}
        plate={plate}
        x={leftX}
        delay={delayOf(i)}
        fromLeft
      />
    );
  });
  const right = perSide.map((plate, i) => {
    const el = (
      <PlateRect
        key={`r${i}`}
        plate={plate}
        x={rightX}
        delay={delayOf(i)}
        fromLeft={false}
        onLanded={soundOn ? () => playPlateClank(plate.kg) : undefined}
      />
    );
    rightX += plate.t + 1;
    return el;
  });

  return (
    <Box
      sx={
        compact
          ? { display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }
          : { textAlign: "center", minWidth: 0 }
      }
    >
      <Box
        component="svg"
        viewBox="0 0 360 110"
        role="img"
        aria-label={`${lift} ${kg} kg: ${breakdown} kg per side`}
        sx={{
          width: compact ? "64%" : "100%",
          flexShrink: 0,
          height: "auto",
          display: "block",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id={`lb-steel${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9a9da1" />
            <stop offset="50%" stopColor="#55585c" />
            <stop offset="100%" stopColor="#2a2b2d" />
          </linearGradient>
          <pattern
            id={`lb-knurl${uid}`}
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0 L3 3 M3 0 L0 3"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        {/* sleeves */}
        <rect
          x={4}
          y={CY - 5}
          width={INNER_LEFT - 4}
          height={10}
          fill={steel}
        />
        <rect
          x={INNER_RIGHT}
          y={CY - 5}
          width={356 - INNER_RIGHT}
          height={10}
          fill={steel}
        />
        {/* shaft with knurled grip */}
        <rect
          x={INNER_LEFT}
          y={CY - 3}
          width={INNER_RIGHT - INNER_LEFT}
          height={6}
          fill={steel}
        />
        <rect
          x={INNER_LEFT + 12}
          y={CY - 3}
          width={INNER_RIGHT - INNER_LEFT - 24}
          height={6}
          fill={`url(#lb-knurl${uid})`}
        />
        {/* sleeve stops */}
        <rect
          x={INNER_LEFT - 2}
          y={CY - 10}
          width={6}
          height={20}
          fill={steel}
          stroke="#000"
          strokeWidth={0.8}
        />
        <rect
          x={INNER_RIGHT - 4}
          y={CY - 10}
          width={6}
          height={20}
          fill={steel}
          stroke="#000"
          strokeWidth={0.8}
        />
        {left}
        {right}
        {/* collars snap on after the last pair, with a small tink */}
        {collars && (
          <g
            className="lb-collar"
            style={{ animationDelay: `${collarDelay}s` }}
            onAnimationEnd={soundOn ? () => playPlateClank(1.25) : undefined}
          >
            <rect
              x={leftX - 8}
              y={CY - 11}
              width={7}
              height={22}
              fill="#3a3c3f"
              stroke="#000"
              strokeWidth={0.8}
            />
            <rect
              x={rightX + 1}
              y={CY - 11}
              width={7}
              height={22}
              fill="#3a3c3f"
              stroke="#000"
              strokeWidth={0.8}
            />
          </g>
        )}
      </Box>
      <Box sx={{ minWidth: 0, textAlign: compact ? "left" : "center" }}>
        <Typography
          sx={{
            fontFamily: FONTS.stat,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontSize: "0.8rem",
            color: IRON.bone,
            mt: 0.5,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: compact ? "flex-start" : "center",
            columnGap: 1,
          }}
        >
          {lift}
          <Box
            component="span"
            sx={{
              fontFamily: FONTS.number,
              fontWeight: 800,
              fontSize: "1.5rem",
              letterSpacing: 0,
              color: IRON.bloodText,
              textShadow: "2px 2px 0 #000",
            }}
          >
            {kg}
          </Box>
          kg
        </Typography>
        <Typography
          sx={{ fontSize: "0.65rem", color: IRON.boneFaint, letterSpacing: 1 }}
        >
          per side: {breakdown}
        </Typography>
      </Box>
    </Box>
  );
};

// Bars fill one after another: squat, then bench, then deadlift
// compact: phone layout, one short row per bar with the weight beside it
export const LoadedBarbells: React.FC<{
  lifts: { lift: string; kg: number }[];
  compact?: boolean;
}> = ({ lifts, compact = false }) => {
  const loaded: LoadedLift[] = lifts.map((l) => ({
    ...l,
    ...loadPlates(l.kg),
  }));
  const totalPairs = loaded.reduce((n, l) => n + l.perSide.length, 0);
  const step = Math.min(PAIR_STEP_S, MAX_FILL_S / Math.max(totalPairs, 1));

  let cursor = 0.15;
  const starts = loaded.map((l) => {
    const start = cursor;
    cursor += l.perSide.length * step + SLIDE_S + BAR_GAP_S;
    return start;
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "repeat(3, 1fr)",
        gap: compact ? 1.5 : 3,
      }}
    >
      <GlobalStyles
        styles={{
          "@keyframes lbSlideOn": {
            "0%": { transform: "translateX(var(--from))", opacity: 0 },
            "30%": { opacity: 1 },
            "100%": { transform: "none", opacity: 1 },
          },
          "@keyframes lbCollarOn": {
            from: { opacity: 0, transform: "scaleY(1.6)" },
            to: { opacity: 1, transform: "none" },
          },
          ".lb-plate": {
            animation: `lbSlideOn ${SLIDE_S}s cubic-bezier(.55,0,1,.45) both`,
          },
          ".lb-collar": {
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "lbCollarOn 0.12s ease-in both",
          },
          "@media (prefers-reduced-motion: reduce)": {
            ".lb-plate, .lb-collar": { animation: "none" },
          },
        }}
      />
      {loaded.map((l, i) => (
        <Barbell
          key={l.lift}
          {...l}
          start={starts[i]}
          step={step}
          compact={compact}
        />
      ))}
    </Box>
  );
};
