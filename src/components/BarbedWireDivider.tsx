import React from "react";
import { Box, GlobalStyles, Typography } from "@mui/material";
import { FONTS, IRON } from "../theme";
import { useInViewOnce } from "../utils/motion";

// One 60x40 tile of two twisted strands with a barb at the crossing. Repeated
// along x so the wire never stretches, whatever the screen width.
const WIRE_TILE = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40">
  <g fill="none" stroke-linecap="round">
    <path d="M0 20 C10 13 20 13 30 20 S50 27 60 20" stroke="#000" stroke-width="3.4"/>
    <path d="M0 20 C10 27 20 27 30 20 S50 13 60 20" stroke="#000" stroke-width="3.4"/>
    <path d="M0 20 C10 13 20 13 30 20 S50 27 60 20" stroke="#7d8085" stroke-width="1.8"/>
    <path d="M0 20 C10 27 20 27 30 20 S50 13 60 20" stroke="#5f6266" stroke-width="1.8"/>
    <path d="M23 11 L37 29 M37 11 L23 29" stroke="#000" stroke-width="3.2"/>
    <path d="M23 11 L37 29 M37 11 L23 29" stroke="#9a9da2" stroke-width="1.4"/>
  </g>
  <ellipse cx="30" cy="20" rx="3.2" ry="4.6" fill="#4a4c50" stroke="#000" stroke-width="1"/>
</svg>`;

const WIRE_BG = `url("data:image/svg+xml,${encodeURIComponent(WIRE_TILE)}")`;

const strandSx = (side: "left" | "right", shown: boolean) => ({
  flex: 1,
  height: 40,
  backgroundImage: WIRE_BG,
  backgroundRepeat: "repeat-x",
  // Anchor the tiles at the heading so both halves meet it on a barb-free twist
  backgroundPosition: side === "left" ? "right center" : "left center",
  filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.7))",
  clipPath: shown
    ? "inset(0 0 0 0)"
    : side === "left"
      ? "inset(0 0 0 100%)"
      : "inset(0 100% 0 0)",
  transition: "clip-path 0.9s cubic-bezier(.6,0,.2,1)",
});

// Section break between the podium and the table: barbed wire that unrolls
// outward from the heading the first time it scrolls into view.
export const BarbedWireDivider: React.FC<{ title: string }> = ({ title }) => {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      sx={{ display: "flex", alignItems: "center", width: "100%" }}
    >
      <GlobalStyles
        styles={{
          "@keyframes wireTitleIn": {
            "0%": { transform: "scale(1.6)", opacity: 0 },
            "100%": { transform: "scale(1)", opacity: 1 },
          },
        }}
      />
      <Box sx={strandSx("left", inView)} />
      <Typography
        component="h2"
        sx={{
          flexShrink: 0,
          px: { xs: 1.5, md: 2.5 },
          fontFamily: FONTS.metal,
          fontSize: "clamp(1.5rem, 6vw, 2.3rem)",
          lineHeight: 1,
          color: IRON.bone,
          textShadow: `3px 3px 0 #000, 0 0 18px rgba(193,18,31,0.35)`,
          whiteSpace: "nowrap",
          opacity: inView ? 1 : 0,
          animation: inView
            ? "wireTitleIn 0.35s cubic-bezier(.3,1.5,.5,1) both"
            : "none",
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        {title}
      </Typography>
      <Box sx={strandSx("right", inView)} />
    </Box>
  );
};
