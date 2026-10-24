import React, { useEffect, useRef, useState } from "react";
import { Box, GlobalStyles, Typography } from "@mui/material";
import { SortMode } from "../types";
import { FONTS, IRON, RANK_METAL } from "../theme";
import { useCountUp } from "../utils/motion";
import { formatMetric, METRIC_LABEL } from "../utils/lifts";
import { playSlam, playTick } from "../utils/clang";
import { useSound } from "../utils/sound";
import { BloodSplatter } from "./BloodSplatter";
import { IronPlate, PLATE_BG } from "./IronPlate";
import { ImpactCrack } from "./ImpactCrack";
import { BarbedCorners } from "./BarbedCorners";
import { ThornCrown } from "./ThornCrown";
import { PunchedDigits } from "./PunchedDigits";
import { PUNCHED_DEEP, STRIKE_MASK } from "../textures";

const FIRST_COUNT_MS = 1000;
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

  const shown = useCountUp(value, isFirst ? FIRST_COUNT_MS : 800, () => {
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

  // The crown hangs above the plate, outside its overflow clip (the splatter needs it)
  return (
    <Box
      sx={{
        position: "relative",
        gridColumn: { xs: isFirst ? "1 / -1" : "auto", md: "auto" },
        order: { xs: rank - 1, md: rank === 1 ? 1 : rank === 2 ? 0 : 2 },
        ...(isFirst && { mt: { xs: "72px", md: "96px" } }),
      }}
    >
      {isFirst && (
        <ThornCrown key={`${metric}-${value}`} landAt={FIRST_COUNT_MS / 1000} />
      )}
      {/* #1 is the cleanest iron on the wall; the plates beneath it have rotted more */}
      <IronPlate
        depth={isFirst ? 1.5 : 1}
        rust={isFirst ? 0.3 : 0.85}
        bloodied={isFirst}
        sx={{
          overflow: "hidden",
          textAlign: "center",
          // Same footprint the plates had with rank tags on them; the name and
          // total now grow to fill it, centred
          minHeight: isFirst ? { xs: 172, md: 214 } : { xs: 134, md: 164 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 1, md: 2 },
          pt: isFirst ? { xs: 2, md: 3 } : { xs: 1.5, md: 2 },
          pb: { xs: 1.5, md: 2 },
          ...(isFirst && {
            border: `2px solid ${IRON.blood}`,
            background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,59,47,0.28), transparent 70%), ${PLATE_BG}`,
          }),
        }}
      >
        {/* Giant rank numeral gouged into the plate, rimmed in the place's metal.
            It is the only rank mark on the podium, so it carries some weight. */}
        <Typography
          aria-hidden
          sx={{
            position: "absolute",
            right: -8,
            bottom: -48,
            fontFamily: FONTS.metal,
            fontSize: isFirst ? "11rem" : "8.5rem",
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: `2px ${RANK_METAL[rank]}66`,
            pointerEvents: "none",
          }}
        >
          {rank}
        </Typography>

        {/* Blood soaked into the rim of the winner's plate */}
        {isFirst && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: -1,
              pointerEvents: "none",
              boxShadow:
                "inset 0 0 26px rgba(163,16,26,0.6), inset 0 0 4px rgba(74,6,8,0.9)",
            }}
          />
        )}
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
            <BloodSplatter
              key={`${metric}-${value}`}
              size={240}
              opacity={0.55}
            />
          </Box>
        )}

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            component="span"
            sx={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            Rank {rank}:
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.metal,
              fontSize: isFirst
                ? { xs: "2.1rem", md: "2.6rem" }
                : { xs: "1.4rem", md: "1.85rem" },
              lineHeight: 1.1,
              color: IRON.bone,
              textShadow: "0 2px 0 #000, 0 4px 10px rgba(0,0,0,0.8)",
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
                  ? { xs: "3.3rem", md: "4.4rem" }
                  : { xs: "2.1rem", md: "2.8rem" },
                lineHeight: 1,
                color: isFirst ? IRON.bloodText : IRON.bone,
                textShadow: PUNCHED_DEEP,
                maskImage: STRIKE_MASK,
                WebkitMaskImage: STRIKE_MASK,
                maskSize: "80px 80px",
                // room inside the masked box so the soft shadow isn't cut off
                p: "0.12em 0.2em 0.3em",
                m: "-0.12em -0.2em -0.3em",
              }}
            >
              <PunchedDigits text={formatMetric(shown, metric)} />
            </Typography>
            {puffs > 0 && <ChalkPuff key={puffs} />}
            {isFirst && puffs > 0 && <ImpactCrack key={`crack${puffs}`} />}
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.stat,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
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
    </Box>
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
        width: "100%",
        maxWidth: { md: 880 },
        mx: "auto",
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
