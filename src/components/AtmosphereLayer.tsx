import React from "react";
import { Box, GlobalStyles } from "@mui/material";

const NOISE_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>";

const DUST_COUNT = 14;

const fixedLayer = {
  position: "fixed",
  inset: 0,
  zIndex: 1,
  pointerEvents: "none",
} as const;

export const AtmosphereLayer: React.FC = () => {
  const particles = Array.from({ length: DUST_COUNT }, (_, i) => i);

  return (
    <>
      <GlobalStyles
        styles={{
          "@keyframes dustDrift": {
            "0%": { transform: "translateY(0) translateX(0)", opacity: 0 },
            "10%": { opacity: 0.5 },
            "90%": { opacity: 0.4 },
            "100%": {
              transform: "translateY(-100vh) translateX(20px)",
              opacity: 0,
            },
          },
          // Jumps between offsets (no tweening) at ~8fps, like projected film grain
          "@keyframes grainJitter": {
            "0%": { transform: "translate(0, 0)" },
            "12%": { transform: "translate(-5%, -8%)" },
            "25%": { transform: "translate(7%, 3%)" },
            "37%": { transform: "translate(-9%, 6%)" },
            "50%": { transform: "translate(4%, -6%)" },
            "62%": { transform: "translate(-3%, 9%)" },
            "75%": { transform: "translate(8%, -2%)" },
            "87%": { transform: "translate(-7%, -4%)" },
          },
        }}
      />
      {/* Film grain, oversized so the jitter never shows an edge */}
      <Box sx={{ ...fixedLayer, overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            inset: "-50%",
            opacity: 0.11,
            mixBlendMode: "overlay",
            backgroundImage: `url("${NOISE_SVG}")`,
            animation: "grainJitter 1s steps(1) infinite",
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      </Box>
      {/* Heavy vignette + a dim blood-red glow coming up off the floor */}
      <Box
        sx={{
          ...fixedLayer,
          background: `
            radial-gradient(ellipse 120% 60% at 50% 115%, rgba(120,8,14,0.35), transparent 60%),
            radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)
          `,
        }}
      />
      {/* Slow-drifting chalk dust */}
      <Box
        sx={{
          ...fixedLayer,
          overflow: "hidden",
          "@media (prefers-reduced-motion: reduce)": { display: "none" },
        }}
      >
        {particles.map((i) => {
          const left = Math.round((i * 137.5) % 100);
          const size = 2 + (i % 3);
          const duration = 18 + (i % 6) * 4;
          const delay = -(i * 3.7);
          return (
            <Box
              key={i}
              sx={{
                position: "absolute",
                left: `${left}%`,
                bottom: -20,
                width: size,
                height: size,
                borderRadius: "50%",
                background: "rgba(230,225,210,0.5)",
                filter: "blur(0.5px)",
                animation: `dustDrift ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </Box>
    </>
  );
};
