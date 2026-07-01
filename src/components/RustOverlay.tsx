import React from "react";
import { Box } from "@mui/material";

export const RustOverlay: React.FC<{ intensity?: "full" | "small" }> = ({
  intensity = "full",
}) => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      opacity: intensity === "full" ? 0.85 : 0.65,
      backgroundImage: `
        radial-gradient(ellipse 260px 160px at 3% -5%, rgba(168,78,46,0.55), transparent 70%),
        radial-gradient(ellipse 220px 140px at 97% 105%, rgba(150,65,38,0.5), transparent 70%),
        radial-gradient(ellipse 120px 80px at 40% 100%, rgba(120,50,30,0.35), transparent 70%)
      `,
    }}
  />
);
