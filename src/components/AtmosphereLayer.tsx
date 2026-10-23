import React, { useEffect, useRef } from "react";
import { Box, GlobalStyles } from "@mui/material";
import { prefersReducedMotion } from "../utils/motion";

const NOISE_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>";

const DUST_COUNT = 14;

const fixedLayer = {
  position: "fixed",
  inset: 0,
  zIndex: 1,
  pointerEvents: "none",
} as const;

// A single bare bulb in a dark basement: everything outside its pool of light
// falls to black. Mouse users drag it around (it trails lazily, like a hanging
// lamp); touch screens get a slow pendulum sway; reduced motion hangs it still.
const BulbLight: React.FC = () => {
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lamp = lampRef.current;
    const canFollow =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !prefersReducedMotion();
    if (!lamp || !canFollow) return;

    let target = { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };
    const pos = { ...target };
    let frame = 0;
    const place = () => {
      lamp.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      place();
      const moving = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.5;
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      target = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(tick);
    };

    lamp.classList.add("bulb-follow"); // turns off the CSS sway
    place();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <Box
        ref={lampRef}
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1,
          pointerEvents: "none",
          transform: "translate(50vw, 25vh)",
          animation: "bulbSway 9s ease-in-out infinite alternate",
          "&.bulb-follow": { animation: "none" },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        {/* Oversized so the darkness still covers the screen wherever the bulb is */}
        <Box
          sx={{
            position: "absolute",
            width: "300vmax",
            height: "300vmax",
            left: "-150vmax",
            top: "-150vmax",
            background:
              "radial-gradient(circle, rgba(255,180,140,0.07) 0, transparent 8vmax, rgba(0,0,0,0.45) 26vmax, rgba(0,0,0,0.9) 55vmax)",
          }}
        />
      </Box>
      {/* The bulb browns out now and then */}
      <Box
        sx={{
          ...fixedLayer,
          background: "#000",
          opacity: 0,
          animation: "bulbFlicker 11s linear infinite",
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      />
    </>
  );
};

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
          "@keyframes bulbSway": {
            from: { transform: "translate(30vw, 20vh)" },
            to: { transform: "translate(70vw, 30vh)" },
          },
          "@keyframes bulbFlicker": {
            "0%, 94%, 100%": { opacity: 0 },
            "94.6%": { opacity: 0.55 },
            "95.2%": { opacity: 0.1 },
            "96%": { opacity: 0.45 },
            "96.6%": { opacity: 0 },
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
      <BulbLight />
      {/* A dim blood-red glow coming up off the floor */}
      <Box
        sx={{
          ...fixedLayer,
          background:
            "radial-gradient(ellipse 120% 60% at 50% 115%, rgba(120,8,14,0.4), transparent 60%)",
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
