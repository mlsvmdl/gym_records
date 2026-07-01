import React from "react";
import { Box } from "@mui/material";

export const BarbellDivider: React.FC = () => (
  <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
    <Box
      sx={{
        flex: 1,
        height: 3,
        background: "linear-gradient(90deg, transparent, #3a3b3d 40%, #57585b)",
        borderRadius: 2,
      }}
    />
    <svg
      width="72"
      height="40"
      viewBox="0 0 72 40"
      style={{ flexShrink: 0, margin: "0 10px" }}
    >
      <defs>
        <linearGradient id="plateMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b6e73" />
          <stop offset="50%" stopColor="#37383b" />
          <stop offset="100%" stopColor="#1a1b1c" />
        </linearGradient>
        <radialGradient id="rustSpot" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8a3a24" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8a3a24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="17" width="18" height="6" fill="url(#plateMetal)" />
      <rect x="54" y="17" width="18" height="6" fill="url(#plateMetal)" />
      <circle
        cx="36"
        cy="20"
        r="19"
        fill="url(#plateMetal)"
        stroke="#0f1011"
        strokeWidth="2"
      />
      <circle cx="36" cy="20" r="19" fill="url(#rustSpot)" />
      <circle
        cx="36"
        cy="20"
        r="12"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
      />
      <circle
        cx="36"
        cy="20"
        r="5"
        fill="#0f1011"
        stroke="#000"
        strokeWidth="1"
      />
    </svg>
    <Box
      sx={{
        flex: 1,
        height: 3,
        background: "linear-gradient(90deg, #57585b, #3a3b3d 60%, transparent)",
        borderRadius: 2,
      }}
    />
  </Box>
);
