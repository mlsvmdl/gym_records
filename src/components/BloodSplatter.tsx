import React, { useId } from "react";
import { Box, GlobalStyles } from "@mui/material";
import { IRON } from "../theme";

// Deterministic pseudo-random in [0,1) so the splatter is identical every render
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const BLOBS = Array.from({ length: 7 }, (_, i) => ({
  cx: 100 + (rand(i) - 0.5) * 44,
  cy: 100 + (rand(i + 50) - 0.5) * 36,
  r: 16 + rand(i + 100) * 22,
}));

// Droplets scattered on a golden-angle spiral, smaller the further they flew
const DROPS = Array.from({ length: 28 }, (_, i) => {
  const angle = i * 2.39996;
  const dist = 48 + rand(i + 200) * 46;
  return {
    cx: 100 + Math.cos(angle) * dist,
    cy: 100 + Math.sin(angle) * dist,
    r: Math.max(1, 5.5 - dist / 20 + rand(i + 300) * 2),
  };
});

// Streaks point away from the impact
const STREAKS = Array.from({ length: 9 }, (_, i) => {
  const angle = i * 0.7 + rand(i + 400);
  const dist = 40 + rand(i + 500) * 16;
  return {
    x: 100 + Math.cos(angle) * dist,
    y: 100 + Math.sin(angle) * dist,
    len: 8 + rand(i + 600) * 16,
    deg: (angle * 180) / Math.PI,
  };
});

export const BloodSplatter: React.FC<{ size?: number; opacity?: number }> = ({
  size = 220,
  opacity = 0.85,
}) => {
  // useId returns ":r0:"-style ids; strip colons so url(#id) resolves everywhere
  const filterId = `splat${useId().replace(/:/g, "")}`;

  return (
    <>
      <GlobalStyles
        styles={{
          "@keyframes splatIn": {
            "0%": { transform: "scale(0.2)", opacity: 0 },
            "60%": { transform: "scale(1.08)", opacity },
            "100%": { transform: "scale(1)", opacity },
          },
        }}
      />
      <Box
        component="svg"
        viewBox="0 0 200 200"
        aria-hidden
        sx={{
          width: size,
          height: size,
          opacity,
          animation: "splatIn 0.45s cubic-bezier(.2,.9,.3,1.2) both",
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="3"
              seed="4"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`} fill={IRON.blood}>
          {BLOBS.map((b, i) => (
            <circle key={`b${i}`} {...b} />
          ))}
          {DROPS.map((d, i) => (
            <circle key={`d${i}`} {...d} />
          ))}
          {STREAKS.map((s, i) => (
            <ellipse
              key={`s${i}`}
              cx={s.x}
              cy={s.y}
              rx={s.len}
              ry={2.2}
              transform={`rotate(${s.deg} ${s.x} ${s.y})`}
            />
          ))}
        </g>
      </Box>
    </>
  );
};
