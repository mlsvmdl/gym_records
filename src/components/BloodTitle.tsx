import React from "react";
import { Box, GlobalStyles } from "@mui/material";
import { FONTS, IRON } from "../theme";

// x / stroke width / length in the 600x80 drip viewBox. `fall` drips shed a drop now and then.
const DRIPS: { x: number; w: number; len: number; fall?: boolean }[] = [
  { x: 64, w: 5, len: 20 },
  { x: 128, w: 8, len: 46, fall: true },
  { x: 186, w: 4, len: 13 },
  { x: 258, w: 6, len: 30 },
  { x: 316, w: 10, len: 60, fall: true },
  { x: 372, w: 5, len: 19 },
  { x: 432, w: 7, len: 38 },
  { x: 490, w: 4, len: 15 },
  { x: 542, w: 6, len: 26, fall: true },
];

const titleStyles = {
  "@keyframes btFlicker": {
    "0%, 90%, 94%, 100%": { opacity: 1 },
    "91%": { opacity: 0.35 },
    "92%": { opacity: 0.9 },
    "93%": { opacity: 0.5 },
  },
  "@keyframes btDripGrow": { to: { strokeDashoffset: 0 } },
  "@keyframes btBulbIn": { to: { transform: "scale(1)" } },
  "@keyframes btDropFall": {
    "0%, 70%": { transform: "translateY(0) scale(0)", opacity: 0 },
    "74%": { transform: "translateY(0) scale(1)", opacity: 1 },
    "100%": { transform: "translateY(140px) scale(1)", opacity: 0 },
  },
  ".bt-flicker": { animation: "btFlicker 9s linear infinite" },
  ".bt-drip": {
    strokeDasharray: 1,
    strokeDashoffset: 1,
    animation: "btDripGrow 1.6s cubic-bezier(.6,0,.2,1) forwards",
  },
  ".bt-bulb": {
    transform: "scale(0)",
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: "btBulbIn 0.4s ease-out forwards",
  },
  ".bt-drop": {
    opacity: 0,
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: "btDropFall 6s ease-in infinite",
  },
  "@media (prefers-reduced-motion: reduce)": {
    ".bt-flicker, .bt-drip, .bt-bulb": {
      animation: "none",
      strokeDashoffset: 0,
      transform: "none",
    },
    ".bt-drop": { display: "none" },
  },
};

export const BloodTitle: React.FC = () => (
  <Box sx={{ textAlign: "center", userSelect: "none" }}>
    <GlobalStyles styles={titleStyles} />

    {/* Filter defs: `distress` chews the letter edges and punches speckle holes,
        `ooze` wobbles the drips so they don't look machine-drawn. */}
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="bt-distress">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="3"
            seed="7"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rough"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="1"
            seed="3"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -14 0 0 0 9"
            result="holes"
          />
          <feComposite in="rough" in2="holes" operator="in" />
        </filter>
        <filter id="bt-ooze">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.09"
            numOctaves="2"
            seed="11"
          />
          <feDisplacementMap
            in="SourceGraphic"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <linearGradient
          id="bt-blood"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2="80"
        >
          <stop offset="0%" stopColor={IRON.blood} />
          <stop offset="100%" stopColor={IRON.bloodDeep} />
        </linearGradient>
      </defs>
    </svg>

    <Box
      component="h1"
      className="bt-flicker"
      sx={{ m: 0, display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: FONTS.metal,
          fontWeight: 400,
          fontSize: "clamp(3.2rem, 16vw, 8.5rem)",
          lineHeight: 0.95,
          letterSpacing: "0.02em",
          px: 2,
          color: "transparent",
          background:
            "linear-gradient(180deg, #ff5a4a 0%, #d0141f 45%, #5c0a0a 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          filter:
            "url(#bt-distress) drop-shadow(0 0 22px rgba(193,18,31,0.45)) drop-shadow(5px 5px 0 #000)",
        }}
      >
        Sougueur
      </Box>
      <Box
        component="span"
        sx={{
          fontFamily: FONTS.stat,
          fontWeight: 700,
          fontSize: "clamp(0.85rem, 3.2vw, 1.35rem)",
          letterSpacing: "0.6em",
          // letter-spacing adds trailing space after the last letter; offset it
          mr: "-0.6em",
          textTransform: "uppercase",
          color: IRON.bone,
          textShadow: "3px 3px 0 #000",
          mt: 0.5,
        }}
      >
        Records
      </Box>
    </Box>

    <Box
      component="svg"
      viewBox="0 0 600 80"
      aria-hidden
      sx={{
        display: "block",
        width: "100%",
        maxWidth: 600,
        height: "auto",
        mx: "auto",
        mt: 1.5,
        overflow: "visible",
      }}
    >
      <g filter="url(#bt-ooze)" fill="url(#bt-blood)" stroke="url(#bt-blood)">
        <rect x="20" y="0" width="560" height="11" rx="5.5" stroke="none" />
        {DRIPS.map((d, i) => {
          const delay = 0.3 + i * 0.12;
          return (
            <g key={d.x}>
              <line
                className="bt-drip"
                pathLength={1}
                x1={d.x}
                y1={6}
                x2={d.x}
                y2={d.len}
                strokeWidth={d.w}
                strokeLinecap="round"
                style={{ animationDelay: `${delay}s` }}
              />
              <circle
                className="bt-bulb"
                cx={d.x}
                cy={d.len}
                r={d.w * 0.75}
                stroke="none"
                style={{ animationDelay: `${delay + 1.3}s` }}
              />
            </g>
          );
        })}
      </g>
      {/* Falling drops sit outside the ooze filter so it isn't recomputed every frame */}
      <g fill="url(#bt-blood)">
        {DRIPS.filter((d) => d.fall).map((d, i) => (
          <ellipse
            key={d.x}
            className="bt-drop"
            cx={d.x}
            cy={d.len + d.w}
            rx={d.w * 0.45}
            ry={d.w * 0.65}
            style={{ animationDelay: `${3 + i * 2.3}s` }}
          />
        ))}
      </g>
    </Box>
  </Box>
);
