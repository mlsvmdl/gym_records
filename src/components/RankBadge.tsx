import React from "react";
import { Box } from "@mui/material";

const CrownIcon: React.FC = () => (
  <svg viewBox="0 0 100 70" width="65%" height="65%">
    <defs>
      <linearGradient id="crownMetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8c77a" />
        <stop offset="45%" stopColor="#a9832f" />
        <stop offset="100%" stopColor="#5c4517" />
      </linearGradient>
      <pattern
        id="scratchPattern"
        width="5"
        height="5"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(20)"
      >
        <rect width="5" height="5" fill="transparent" />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="5"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="0.5"
        />
      </pattern>
      <clipPath id="crownClip">
        <path d="M8 62 L8 30 L28 46 L50 12 L72 46 L92 30 L92 62 Z" />
        <rect x="6" y="60" width="88" height="8" />
      </clipPath>
    </defs>
    <path
      d="M8 62 L8 30 L28 46 L50 12 L72 46 L92 30 L92 62 Z"
      fill="url(#crownMetal)"
      stroke="#2b1e08"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <rect
      x="6"
      y="60"
      width="88"
      height="8"
      fill="url(#crownMetal)"
      stroke="#2b1e08"
      strokeWidth="3"
    />
    <g clipPath="url(#crownClip)">
      <rect
        x="0"
        y="0"
        width="100"
        height="70"
        fill="url(#scratchPattern)"
        opacity="0.55"
      />
    </g>
    <circle
      cx="8"
      cy="30"
      r="5.5"
      fill="#c99a3f"
      stroke="#2b1e08"
      strokeWidth="2"
    />
    <circle
      cx="50"
      cy="12"
      r="5.5"
      fill="#c99a3f"
      stroke="#2b1e08"
      strokeWidth="2"
    />
    <circle
      cx="92"
      cy="30"
      r="5.5"
      fill="#c99a3f"
      stroke="#2b1e08"
      strokeWidth="2"
    />
  </svg>
);

const getMetalStyle = (rank: number) => {
  if (rank === 1)
    return {
      background:
        "linear-gradient(135deg, #d9b466 0%, #8a6a2f 55%, #4a3712 100%)",
      border: "2px solid #3d2c0d",
      glow: "0 0 14px rgba(217,180,102,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
      color: "#241a06",
    };
  if (rank === 2)
    return {
      background:
        "linear-gradient(135deg, #c7ccd1 0%, #888e94 55%, #45484c 100%)",
      border: "2px solid #2b2d2f",
      glow: "0 0 10px rgba(199,204,209,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
      color: "#1a1b1c",
    };
  if (rank === 3)
    return {
      background:
        "linear-gradient(135deg, #b47a4e 0%, #7a4d2c 55%, #3f2814 100%)",
      border: "2px solid #2b1c0f",
      glow: "0 0 10px rgba(180,122,78,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
      color: "#1c1208",
    };
  return {
    background:
      "linear-gradient(135deg, #565a5f 0%, #303336 55%, #17181a 100%)",
    border: "2px solid #0e0f10",
    glow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    color: "#e6e6e6",
  };
};

const scratchTexture = {
  backgroundImage: `
    repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px),
    repeating-linear-gradient(25deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 4px)
  `,
};

export const RankBadge: React.FC<{
  rank: number;
  size?: "small" | "large";
}> = ({ rank, size = "large" }) => {
  const style = getMetalStyle(rank);
  const dims = size === "small" ? 38 : 46;

  return (
    <Box
      sx={{
        width: dims,
        height: dims,
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontFamily: "'Oswald', 'Helvetica Neue', sans-serif",
        fontSize: size === "small" ? 16 : 19,
        position: "relative",
        transition: "transform 150ms ease, filter 150ms ease",
        background: style.background,
        border: style.border,
        boxShadow: style.glow,
        color: style.color,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "6px",
          ...scratchTexture,
        },
        "&:hover": {
          transform: "scale(1.08)",
          filter: "brightness(1.08)",
        },
      }}
    >
      {rank === 1 ? <CrownIcon /> : rank}
    </Box>
  );
};
