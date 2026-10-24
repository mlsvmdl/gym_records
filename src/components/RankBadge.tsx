import React from "react";
import { Box } from "@mui/material";
import { FONTS, IRON, RANK_METAL } from "../theme";
import { PUNCHED } from "../textures";

// Speckle mask so the plate's edge looks pitted, not machined
const PIT_MASK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -6 0 0 0 4.6'/></filter><rect width='100%25' height='100%25' filter='url(%23p)'/></svg>";

const SIZE = 38;

// A tarnished iron tag with the place struck into it, down the board's rank
// column. The top three are rimmed in their metal, everyone else in dull iron.
export const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  return (
    <Box
      className="rank-tag"
      role="img"
      aria-label={`Rank ${rank}`}
      sx={{
        width: SIZE,
        height: SIZE,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background:
          "radial-gradient(circle at 30% 25%, #3a3633, #1a1716 60%, #0d0b0b)",
        border: `2px solid ${RANK_METAL[rank] ?? "#4a4441"}`,
        outline: "2px solid #000",
        boxShadow: "inset 0 0 0 2px #000, inset 0 2px 6px rgba(0,0,0,0.9)",
        maskImage: `url("${PIT_MASK}")`,
        WebkitMaskImage: `url("${PIT_MASK}")`,
        maskSize: "48px 48px",
        transition: "filter 120ms ease",
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          fontFamily: FONTS.number,
          fontWeight: 800,
          fontSize: 22,
          lineHeight: 1,
          color: RANK_METAL[rank] ?? IRON.boneDim,
          textShadow: PUNCHED,
        }}
      >
        {rank}
      </Box>
    </Box>
  );
};
