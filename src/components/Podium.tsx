import React, { useEffect, useRef, useState } from "react";
import { Box, GlobalStyles, Typography } from "@mui/material";
import { SortMode } from "../types";
import { FONTS, IRON } from "../theme";
import { useCountUp } from "../utils/motion";
import { formatMetric, METRIC_LABEL } from "../utils/lifts";
import { playSlam, playTick } from "../utils/clang";
import { useSound } from "../utils/sound";
import { RankBadge } from "./RankBadge";
import { BloodSplatter } from "./BloodSplatter";
import { IronPlate, PLATE_BG } from "./IronPlate";
import { ImpactCrack } from "./ImpactCrack";
import { BarbedCorners } from "./BarbedCorners";

const TICK_GAP_MS = 70; // ~14 clicks over the 1s count, like a ratchet

const SHAKE: Keyframe[] = [
  { transform: "none" },
  { transform: "translate(-6px, 3px) rotate(-0.4deg)" },
  { transform: "translate(5px, -3px) rotate(0.4deg)" },
  { transform: "translate(-3px, 2px)" },
  { transform: "translate(2px, -1px)" },
  { transform: "none" },
];

const PUFF_COUNT = 12;

// Chalk dust bursting out from where the number lands. Remount (via key) to replay.
const ChalkPuff: React.FC = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      left: "50%",
      top: "50%",
      pointerEvents: "none",
      "@media (prefers-reduced-motion: reduce)": { display: "none" },
    }}
  >
    {Array.from({ length: PUFF_COUNT }, (_, i) => {
      const angle = (i / PUFF_COUNT) * Math.PI * 2;
      const dist = 50 + (i % 3) * 18;
      return (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: IRON.bone,
            filter: "blur(2px)",
            opacity: 0,
            "--dx": `${Math.cos(angle) * dist}px`,
            "--dy": `${Math.sin(angle) * dist * 0.6}px`,
            animation: "chalkPuff 0.7s ease-out forwards",
          }}
        />
      );
    })}
  </Box>
);

const PodiumCard: React.FC<{
  rank: number;
  name: string;
  value: number;
  metric: SortMode;
  onLanded?: () => void;
}> = ({ rank, name, value, metric, onLanded }) => {
  const isFirst = rank === 1;
  const numberRef = useRef<HTMLSpanElement>(null);
  const [puffs, setPuffs] = useState(0);
  const { soundOn } = useSound();
  const lastTick = useRef(0);

  const shown = useCountUp(value, isFirst ? 1000 : 800, () => {
    if (!isFirst) return;
    if (soundOn) playSlam();
    numberRef.current?.animate(
      [{ transform: "scale(1.35)" }, { transform: "scale(1)" }],
      { duration: 260, easing: "cubic-bezier(.3,1.6,.5,1)" },
    );
    setPuffs((n) => n + 1);
    onLanded?.();
  });

  // Only #1 ticks: three counters ticking at once is just noise
  useEffect(() => {
    if (!isFirst || !soundOn || shown <= 0 || shown >= value) return;
    const now = performance.now();
    if (now - lastTick.current < TICK_GAP_MS) return;
    lastTick.current = now;
    playTick();
  }, [shown, value, isFirst, soundOn]);

  return (
    <IronPlate
      shadow={isFirst ? 10 : 6}
      sx={{
        overflow: "hidden",
        textAlign: "center",
        px: 2,
        pt: isFirst ? { xs: 3, md: 5 } : { xs: 2, md: 3 },
        pb: { xs: 2, md: 3 },
        gridColumn: { xs: isFirst ? "1 / -1" : "auto", md: "auto" },
        order: { xs: rank - 1, md: rank === 1 ? 1 : rank === 2 ? 0 : 2 },
        ...(isFirst && {
          borderColor: IRON.blood,
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,59,47,0.28), transparent 70%), ${PLATE_BG}`,
        }),
      }}
    >
      {/* Giant outlined rank numeral stamped into the plate */}
      <Typography
        aria-hidden
        sx={{
          position: "absolute",
          right: -8,
          bottom: -48,
          fontFamily: FONTS.metal,
          fontSize: isFirst ? "13rem" : "10rem",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `2px rgba(232,224,208,0.07)`,
          pointerEvents: "none",
        }}
      >
        {rank}
      </Typography>

      {isFirst && <BarbedCorners />}
      {isFirst && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: { xs: -30, md: -10 },
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          <BloodSplatter key={`${metric}-${value}`} size={240} opacity={0.55} />
        </Box>
      )}

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <RankBadge rank={rank} size={isFirst ? "large" : "small"} />
        </Box>
        <Typography
          sx={{
            fontFamily: FONTS.metal,
            fontSize: isFirst
              ? { xs: "1.9rem", md: "2.4rem" }
              : { xs: "1.25rem", md: "1.7rem" },
            lineHeight: 1.1,
            color: IRON.bone,
            textShadow: "3px 3px 0 #000",
            overflowWrap: "anywhere",
          }}
        >
          {name}
        </Typography>
        <Box sx={{ position: "relative", display: "inline-block", mt: 0.5 }}>
          <Typography
            ref={numberRef}
            component="span"
            sx={{
              display: "inline-block",
              fontFamily: FONTS.number,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              fontSize: isFirst
                ? { xs: "3rem", md: "4rem" }
                : { xs: "1.9rem", md: "2.6rem" },
              lineHeight: 1,
              color: isFirst ? IRON.bloodText : IRON.bone,
              textShadow: "4px 4px 0 #000",
            }}
          >
            {formatMetric(shown, metric)}
          </Typography>
          {puffs > 0 && <ChalkPuff key={puffs} />}
          {isFirst && puffs > 0 && <ImpactCrack key={`crack${puffs}`} />}
        </Box>
        <Typography
          sx={{
            fontFamily: FONTS.stat,
            fontSize: "0.7rem",
            letterSpacing: 3,
            textTransform: "uppercase",
            color: IRON.boneFaint,
            mt: 0.5,
          }}
        >
          {METRIC_LABEL[metric]}
        </Typography>
      </Box>
    </IronPlate>
  );
};

export const Podium: React.FC<{
  entries: { name: string; value: number }[];
  metric: SortMode;
}> = ({ entries, metric }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLanded = () => {
    containerRef.current?.animate(SHAKE, { duration: 320, easing: "linear" });
  };

  return (
    <Box
      ref={containerRef}
      component="section"
      aria-label="Top three"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1.3fr 1fr" },
        alignItems: "end",
        gap: { xs: 2, md: 3 },
      }}
    >
      <GlobalStyles
        styles={{
          "@keyframes chalkPuff": {
            "0%": { transform: "translate(0, 0) scale(0.6)", opacity: 0.9 },
            "100%": {
              transform: "translate(var(--dx), var(--dy)) scale(2.6)",
              opacity: 0,
            },
          },
        }}
      />
      {entries.slice(0, 3).map((e, i) => (
        <PodiumCard
          key={e.name}
          rank={i + 1}
          name={e.name}
          value={e.value}
          metric={metric}
          onLanded={i === 0 ? handleLanded : undefined}
        />
      ))}
    </Box>
  );
};
