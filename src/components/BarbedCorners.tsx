import React from "react";
import { Box } from "@mui/material";

// A short twist of barbed wire strung across a corner, with one barb
const Corner: React.FC<{ rotate: number }> = ({ rotate }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <g fill="none" strokeLinecap="round">
      <path
        d="M0 60 C14 52 18 42 30 30 S50 9 60 0"
        stroke="#000"
        strokeWidth="3.4"
      />
      <path
        d="M0 60 C8 46 20 40 30 30 S52 16 60 0"
        stroke="#000"
        strokeWidth="3.4"
      />
      <path
        d="M0 60 C14 52 18 42 30 30 S50 9 60 0"
        stroke="#7d8085"
        strokeWidth="1.8"
      />
      <path
        d="M0 60 C8 46 20 40 30 30 S52 16 60 0"
        stroke="#5f6266"
        strokeWidth="1.8"
      />
      <path d="M21 30 L39 30 M30 21 L30 39" stroke="#000" strokeWidth="3.2" />
      <path
        d="M21 30 L39 30 M30 21 L30 39"
        stroke="#9a9da2"
        strokeWidth="1.4"
      />
    </g>
    <circle
      cx="30"
      cy="30"
      r="3.6"
      fill="#4a4c50"
      stroke="#000"
      strokeWidth="1"
    />
  </svg>
);

const PLACES = [
  { top: 0, left: 0, rotate: 0 },
  { top: 0, right: 0, rotate: 90 },
  { bottom: 0, right: 0, rotate: 180 },
  { bottom: 0, left: 0, rotate: 270 },
];

// Wire across all four corners: first place looks fought for
export const BarbedCorners: React.FC = () => (
  <>
    {PLACES.map(({ rotate, ...at }) => (
      <Box
        key={rotate}
        aria-hidden
        sx={{
          position: "absolute",
          zIndex: 3,
          lineHeight: 0,
          pointerEvents: "none",
          filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.7))",
          ...at,
        }}
      >
        <Corner rotate={rotate} />
      </Box>
    ))}
  </>
);
