import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { hardShadow } from "../theme";

// Brushed dark steel: faint horizontal grain over a top-lit gradient
export const PLATE_BG =
  "repeating-linear-gradient(0deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 3px), linear-gradient(180deg, #1d1a1a, #0d0b0b)";

const CORNERS = [
  { top: 0, left: 0 },
  { top: 0, right: 0 },
  { bottom: 0, left: 0 },
  { bottom: 0, right: 0 },
];

const Rivet: React.FC<{
  size: number;
  inset: number;
  at: (typeof CORNERS)[number];
}> = ({ size, inset, at }) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      zIndex: 2,
      width: size,
      height: size,
      borderRadius: "50%",
      pointerEvents: "none",
      background:
        "radial-gradient(circle at 35% 30%, #a3a6aa, #4a4c4f 50%, #141414 100%)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.08), 1px 2px 2px rgba(0,0,0,0.8)",
      ...Object.fromEntries(Object.keys(at).map((side) => [side, inset])),
    }}
  />
);

// Hard-edged steel plate with corner rivets: the shared surface for the table,
// phone cards and podium. `ref` is forwarded so FLIP reordering can measure it.
export const IronPlate: React.FC<{
  children: React.ReactNode;
  shadow?: number;
  rivetSize?: number;
  sx?: SxProps<Theme>;
  ref?: React.Ref<HTMLDivElement>;
  onClick?: () => void;
  component?: React.ElementType;
}> = ({
  children,
  shadow = 8,
  rivetSize = 9,
  sx,
  ref,
  onClick,
  component = "div",
}) => (
  <Box
    ref={ref}
    component={component}
    onClick={onClick}
    sx={[
      {
        position: "relative",
        border: "3px solid #000",
        background: PLATE_BG,
        boxShadow: `${hardShadow(shadow)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {CORNERS.map((at, i) => (
      <Rivet key={i} size={rivetSize} inset={rivetSize * 0.6} at={at} />
    ))}
    {children}
  </Box>
);
