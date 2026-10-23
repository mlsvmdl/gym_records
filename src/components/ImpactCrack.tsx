import React from "react";
import { Box, GlobalStyles } from "@mui/material";
import { seeded } from "../utils/random";

const W = 360;
const H = 220;

// Jagged rays splintering out from the impact point, some with a side branch
const RAYS: string[] = [];
for (let r = 0; r < 9; r++) {
  let angle = (r / 9) * Math.PI * 2 + seeded(r) * 0.5;
  let x = W / 2;
  let y = H / 2;
  let d = `M${x} ${y}`;
  const segments = 4 + Math.floor(seeded(r + 20) * 3);
  for (let s = 0; s < segments; s++) {
    angle += (seeded(r * 10 + s + 40) - 0.5) * 0.9;
    const len = 14 + seeded(r * 10 + s + 80) * 18;
    x += Math.cos(angle) * len;
    y += Math.sin(angle) * len * 0.75; // a little flattened, like a wide plate
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    if (s === 1 && seeded(r + 120) > 0.45) {
      const ba = angle + (seeded(r + 140) > 0.5 ? 0.9 : -0.9);
      const bl = 12 + seeded(r + 160) * 14;
      RAYS.push(
        `M${x.toFixed(1)} ${y.toFixed(1)} L${(x + Math.cos(ba) * bl).toFixed(1)} ${(y + Math.sin(ba) * bl * 0.75).toFixed(1)}`,
      );
    }
  }
  RAYS.push(d);
}

// Cracks splintered into the plate behind the #1 number when it slams. Stays put
// once drawn; remount (via key) to crack it again.
export const ImpactCrack: React.FC = () => (
  <Box
    component="svg"
    viewBox={`0 0 ${W} ${H}`}
    aria-hidden
    sx={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: W,
      height: H,
      transform: "translate(-50%, -50%)",
      zIndex: -1,
      pointerEvents: "none",
      overflow: "visible",
    }}
  >
    <GlobalStyles
      styles={{
        "@keyframes crackRun": { to: { strokeDashoffset: 0 } },
        ".crack-ray": {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "crackRun 0.22s cubic-bezier(.1,.8,.3,1) forwards",
        },
        "@media (prefers-reduced-motion: reduce)": {
          ".crack-ray": { animation: "none", strokeDashoffset: 0 },
        },
      }}
    />
    <g fill="none" strokeLinejoin="miter" strokeLinecap="round">
      {/* lit broken edge, offset a pixel, under the dark fissure */}
      {RAYS.map((d, i) => (
        <path
          key={`h${i}`}
          className="crack-ray"
          pathLength={1}
          d={d}
          transform="translate(1 1)"
          stroke="rgba(232,224,208,0.16)"
          strokeWidth={0.9}
        />
      ))}
      {RAYS.map((d, i) => (
        <path
          key={`c${i}`}
          className="crack-ray"
          pathLength={1}
          d={d}
          stroke="#000"
          strokeWidth={2.2}
        />
      ))}
    </g>
  </Box>
);
