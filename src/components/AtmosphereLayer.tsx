import React from "react";
import { Box, GlobalStyles } from "@mui/material";

const NOISE_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>";

const DUST_COUNT = 14;

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
        }}
      />
      {/* Static metallic film grain */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.08,
          mixBlendMode: "overlay",
          backgroundImage: `url("${NOISE_SVG}")`,
        }}
      />
      {/* Slow-drifting chalk dust */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
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
