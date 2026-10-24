import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { BLOOD_SMEAR, heavyShadow, PITS, PLATE_BG, RUST } from "../textures";

export { PLATE_BG };

const CORNERS = [
  { top: 0, left: 0 },
  { top: 0, right: 0 },
  { bottom: 0, left: 0 },
  { bottom: 0, right: 0 },
];

const HEX = "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)";

// Old rusted hex bolt
const Bolt: React.FC<{
  size: number;
  inset: number;
  at: (typeof CORNERS)[number];
}> = ({ size, inset, at }) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      zIndex: 2,
      lineHeight: 0,
      pointerEvents: "none",
      filter: "drop-shadow(1px 2px 1px rgba(0,0,0,0.9))",
      ...Object.fromEntries(Object.keys(at).map((side) => [side, inset])),
    }}
  >
    <Box
      sx={{
        width: size,
        height: size,
        clipPath: HEX,
        background:
          "radial-gradient(circle at 35% 30%, #7a6656, #3b2e26 50%, #120d0b 100%)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.6)",
      }}
    />
  </Box>
);

// Scarred iron plate bolted to the wall: the shared surface for the board, the
// phone cards, the podium and the no-match plate. Wear layers sit at z-index -1 inside an
// isolated stacking context, so they cover the plate but never the content.
// `ref` is forwarded so FLIP reordering can measure it.
export const IronPlate: React.FC<{
  children: React.ReactNode;
  depth?: number;
  boltSize?: number;
  rust?: number; // 0-1, how far the rot has eaten in from the rim
  bloodied?: boolean;
  sx?: SxProps<Theme>;
  ref?: React.Ref<HTMLDivElement>;
  onClick?: () => void;
  component?: React.ElementType;
}> = ({
  children,
  depth = 1,
  boltSize = 10,
  rust = 0.5,
  bloodied = false,
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
        isolation: "isolate",
        border: "1px solid #000",
        background: PLATE_BG,
        boxShadow: [
          heavyShadow(depth),
          "inset 0 1px 0 rgba(232,224,208,0.07)", // lit top edge
          "inset 0 0 0 1px rgba(0,0,0,0.6)",
          "inset 0 -40px 50px -30px rgba(0,0,0,0.7)", // light falls off downward
        ].join(", "),
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {/* Rot creeping in from the rim: rust blooms, then black pitting over them */}
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        backgroundImage: `${PITS}, ${RUST}`,
        opacity: 0.35 + rust * 0.6,
        maskImage:
          "radial-gradient(ellipse 120% 120% at 50% 45%, transparent 52%, #000 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 120% 120% at 50% 45%, transparent 52%, #000 85%)",
      }}
    />
    {bloodied && (
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 220,
          maxWidth: "70%",
          height: 150,
          zIndex: -1,
          pointerEvents: "none",
          backgroundImage: BLOOD_SMEAR,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          opacity: 0.85,
        }}
      />
    )}
    {CORNERS.map((at, i) => (
      <Bolt key={i} size={boltSize} inset={boltSize * 0.55} at={at} />
    ))}
    {children}
  </Box>
);
