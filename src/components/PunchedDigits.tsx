import React from "react";
import { Box } from "@mui/material";

// Each strike of a hand-held letter punch lands a little off: tilt (deg) and
// drop (em) by position, fixed so a counting number doesn't jitter frame to frame.
const STRIKES = [
  { r: -2.4, y: 0.02 },
  { r: 1.9, y: -0.035 },
  { r: -0.8, y: 0.04 },
  { r: 2.7, y: -0.01 },
  { r: -1.7, y: 0.03 },
  { r: 1.1, y: -0.04 },
  { r: -2.1, y: 0.015 },
];

// Splits a number into individually struck digits. The surrounding text element
// sets font, size, colour and the punched shadow.
export const PunchedDigits: React.FC<{ text: string }> = ({ text }) => (
  <>
    {Array.from(text).map((ch, i) => {
      const s = STRIKES[i % STRIKES.length];
      return (
        <Box
          key={i}
          component="span"
          sx={{
            display: "inline-block",
            transform: /\d/.test(ch)
              ? `translateY(${s.y}em) rotate(${s.r}deg)`
              : "none",
          }}
        >
          {ch}
        </Box>
      );
    })}
  </>
);
