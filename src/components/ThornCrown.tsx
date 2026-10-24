import React, { useId } from "react";
import { Box, GlobalStyles } from "@mui/material";
import { IRON } from "../theme";

// Hand-forged thorns on a twisted band: x of the base, height, base width and a
// little lean so no two spikes stand quite straight. viewBox is 120 x 92.
const BAND_TOP = 52;
const BAND_BOTTOM = 64;
const SPIKES = [
  { x: 13, h: 26, w: 7, lean: -3 },
  { x: 31, h: 38, w: 8, lean: -2 },
  { x: 46, h: 30, w: 7, lean: 1 },
  { x: 60, h: 48, w: 10, lean: 0 },
  { x: 74, h: 30, w: 7, lean: -1 },
  { x: 89, h: 38, w: 8, lean: 2 },
  { x: 107, h: 26, w: 7, lean: 3 },
];

// Small barbs jutting sideways off the band, like the wire on the divider
const BARBS = [22, 39, 53, 67, 81, 98];

// Blood running off the band onto the plate below: x, length, width
const DRIPS = [
  { x: 27, len: 9, w: 3 },
  { x: 58, len: 22, w: 4.5 },
  { x: 66, len: 13, w: 3.5 },
  { x: 93, len: 16, w: 3.5 },
];

const spikePath = ({ x, h, w, lean }: (typeof SPIKES)[number]) =>
  `M${x - w / 2} ${BAND_TOP + 1} L${x + lean} ${BAND_TOP - h} L${x + w / 2} ${BAND_TOP + 1} Z`;

const crownStyles = {
  "@keyframes crownDrop": {
    "0%": { transform: "translate(-50%, -90px) rotate(-16deg)", opacity: 0 },
    "15%": { opacity: 1 },
    "80%": { transform: "translate(-50%, 0) rotate(-4deg)" },
    "90%": { transform: "translate(-50%, -5px) rotate(-5deg)" },
    "100%": { transform: "translate(-50%, 0) rotate(-4deg)", opacity: 1 },
  },
};

// Crown of thorns jammed onto the #1 plate. Drops in so it lands right as the
// number slams (`landAt` seconds after mount); remount (via key) to drop it again.
export const ThornCrown: React.FC<{ landAt: number }> = ({ landAt }) => {
  const id = useId().replace(/:/g, "");
  const iron = `ci${id}`;
  const rust = `cr${id}`;
  const blood = `cb${id}`;
  const tip = `ct${id}`;
  const DROP_S = 0.42;

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: "50%",
        // band's bottom edge (64 of 92 units) sits on the plate's top border
        top: { xs: -68, md: -88 },
        width: { xs: 132, md: 170 },
        zIndex: 4,
        pointerEvents: "none",
        filter: "drop-shadow(3px 5px 2px rgba(0,0,0,0.75))",
        transform: "translate(-50%, 0) rotate(-4deg)",
        animation: `crownDrop ${DROP_S}s cubic-bezier(.55,0,.9,.45) both`,
        animationDelay: `${Math.max(0, landAt - DROP_S * 0.8)}s`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <GlobalStyles styles={crownStyles} />
      <svg viewBox="0 0 120 92" width="100%" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id={iron} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#8d8a86" />
            <stop offset="40%" stopColor="#4a4643" />
            <stop offset="100%" stopColor="#1a1716" />
          </linearGradient>
          {/* Rust blooms: noise thresholded into patches, tinted rust */}
          <filter
            id={rust}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.54  0 0 0 0 0.23  0 0 0 0 0.14  0 0 0 -7 3.4"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={blood} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d0141f" />
            <stop offset="100%" stopColor={IRON.bloodDeep} />
          </linearGradient>
          <clipPath id={tip}>
            <path d={spikePath(SPIKES[3])} />
          </clipPath>
        </defs>

        {/* Thorns, then the band over their roots */}
        <g stroke="#000" strokeWidth="1.6" strokeLinejoin="miter">
          {SPIKES.map((s) => (
            <path key={s.x} d={spikePath(s)} fill={`url(#${iron})`} />
          ))}
        </g>
        {BARBS.map((x, i) => (
          <path
            key={x}
            d={
              i % 2
                ? `M${x} ${BAND_TOP + 3} l-5 -7 l3 7 Z`
                : `M${x} ${BAND_BOTTOM - 3} l5 8 l-2 -8 Z`
            }
            fill="#3a3734"
            stroke="#000"
            strokeWidth="1"
          />
        ))}
        <rect
          x="3"
          y={BAND_TOP}
          width="114"
          height={BAND_BOTTOM - BAND_TOP}
          fill={`url(#${iron})`}
          stroke="#000"
          strokeWidth="1.8"
        />
        {/* Twist of the forged band */}
        <g stroke="#000" strokeWidth="1.4" opacity="0.7">
          {Array.from({ length: 14 }, (_, i) => (
            <line
              key={i}
              x1={8 + i * 8}
              y1={BAND_TOP + 1}
              x2={3 + i * 8}
              y2={BAND_BOTTOM - 1}
            />
          ))}
        </g>
        <rect
          x="3"
          y={BAND_TOP}
          width="114"
          height={BAND_BOTTOM - BAND_TOP}
          fill="#000"
          filter={`url(#${rust})`}
          opacity="0.85"
        />

        {/* The tallest thorn, wet to halfway down */}
        <g clipPath={`url(#${tip})`}>
          <path
            d="M40 0 H80 V24 C74 30 70 22 64 30 C60 36 57 26 52 31 C48 34 44 28 40 30 Z"
            fill={`url(#${blood})`}
          />
        </g>

        {/* Blood pooled along the band and running off it */}
        <g fill={`url(#${blood})`}>
          <path
            d={`M18 ${BAND_BOTTOM - 2} C30 ${BAND_BOTTOM - 4} 40 ${BAND_BOTTOM + 1} 58 ${BAND_BOTTOM - 3} S88 ${BAND_BOTTOM + 1} 100 ${BAND_BOTTOM - 2} L100 ${BAND_BOTTOM + 1} L18 ${BAND_BOTTOM + 1} Z`}
          />
          {DRIPS.map((d) => (
            <g key={d.x}>
              <rect
                x={d.x - d.w / 2}
                y={BAND_BOTTOM}
                width={d.w}
                height={d.len}
                rx={d.w / 2}
              />
              <circle cx={d.x} cy={BAND_BOTTOM + d.len} r={d.w * 0.72} />
            </g>
          ))}
        </g>
      </svg>
    </Box>
  );
};
