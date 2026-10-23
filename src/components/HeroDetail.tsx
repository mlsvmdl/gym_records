import React from "react";
import { Box, Typography, Divider, GlobalStyles } from "@mui/material";
import { FONTS, IRON } from "../theme";
import { Hero, LiftSession, LiftType } from "../types";
import { calculateGLPoints } from "../utils/glPoints";
import { LoadedBarbells } from "./LoadedBarbell";

const LIFT_ORDER: LiftType[] = ["Squat", "Bench", "Deadlift"];
const LIFT_SHORT: Record<LiftType, string> = { Squat: "SQ", Bench: "BP", Deadlift: "DL" };

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Speckle mask so the stamp looks like uneven ink, not a clean border
const INK_MASK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='30'><filter id='i'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' seed='9'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 5.6'/></filter><rect width='100%25' height='100%25' filter='url(%23i)'/></svg>";

// Red ink "PR" stamp slammed over a number that beat every earlier meet
const PRStamp: React.FC<{ delay: number }> = ({ delay }) => (
  <Box
    component="span"
    aria-label="personal record"
    sx={{
      position: "absolute",
      top: -11,
      right: -16,
      px: "3px",
      border: `2px solid ${IRON.bloodText}`,
      color: IRON.bloodText,
      fontFamily: FONTS.stat,
      fontWeight: 700,
      fontSize: "0.6rem",
      lineHeight: 1.2,
      letterSpacing: 1,
      transform: "rotate(-12deg)",
      maskImage: `url("${INK_MASK}")`,
      WebkitMaskImage: `url("${INK_MASK}")`,
      pointerEvents: "none",
      animation: "prStamp 0.22s cubic-bezier(.3,1.4,.5,1) both",
      animationDelay: `${delay}s`,
      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
    }}
  >
    PR
  </Box>
);

// Hidden on phones: no room, and the PR stamp already flags the gains that matter
const deltaSx = (delta: number) => ({
  display: { xs: "none", sm: "block" },
  fontSize: "0.65rem",
  fontWeight: 600,
  color: delta > 0 ? IRON.boneDim : IRON.boneFaint,
});

export const HeroDetail: React.FC<{ hero: Hero }> = ({ hero }) => {
  const sessions = [...(hero.history ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Box
      sx={{
        p: 2,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
        border: `1px solid ${IRON.line}`,
      }}
    >
      <GlobalStyles
        styles={{
          "@keyframes prStamp": {
            "0%": { transform: "scale(2.6) rotate(-24deg)", opacity: 0 },
            "100%": { transform: "scale(1) rotate(-12deg)", opacity: 1 },
          },
        }}
      />
      {sessions.length > 0 && (
        <>
          <Typography sx={sectionLabelSx}>Best lifts, loaded</Typography>
          <Box sx={{ mb: 3, px: { xs: 1, sm: 2 } }}>
            <LoadedBarbells
              lifts={LIFT_ORDER.map((type) => ({
                lift: type,
                kg: Math.max(...sessions.map((s) => s[type])),
              }))}
            />
          </Box>
        </>
      )}
      <Typography sx={sectionLabelSx}>Meet History</Typography>

      {sessions.length === 0 ? (
        <Box
          sx={{
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 8px, #222 8px, #222 16px)",
            border: `1px dashed ${IRON.line}`,
          }}
        >
          <Typography
            sx={{
              color: IRON.boneFaint,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            No history yet
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            border: `1px solid ${IRON.line}`,
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 0.8fr repeat(3, 1fr) 1fr 1fr",
              px: 1.5,
              py: 0.75,
              background: IRON.black,
            }}
          >
            <Typography sx={headerCellSx}>Date</Typography>
            <Typography align="right" sx={headerCellSx}>
              BW
            </Typography>
            {LIFT_ORDER.map((type) => (
              <Typography key={type} align="right" sx={headerCellSx}>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  {type}
                </Box>
                <Box component="span" sx={{ display: { sm: "none" } }}>
                  {LIFT_SHORT[type]}
                </Box>
              </Typography>
            ))}
            <Typography align="right" sx={headerCellSx}>
              Total
            </Typography>
            <Typography align="right" sx={headerCellSx}>
              GL
            </Typography>
          </Box>

          {sessions.map((session, idx) => {
            const prev = sessions[idx + 1]; // chronologically earlier session
            const total = session.Squat + session.Bench + session.Deadlift;
            const prevTotal = prev
              ? prev.Squat + prev.Bench + prev.Deadlift
              : null;
            const totalDelta = prevTotal !== null ? total - prevTotal : null;
            const glPoints = calculateGLPoints(
              total,
              session.bodyweight,
              hero.sex,
            );
            const isLatest = idx === 0;
            const earlier = sessions.slice(idx + 1);
            // A PR beats every earlier meet, not just the previous one
            const isPR = (value: number, of: (s: LiftSession) => number) =>
              earlier.length > 0 && value > Math.max(...earlier.map(of));
            const stampDelay = 0.25 + idx * 0.1;

            return (
              <Box key={session.date}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 0.8fr repeat(3, 1fr) 1fr 1fr",
                    px: 1.5,
                    py: 1,
                    alignItems: "center",
                    background: isLatest
                      ? "rgba(163,16,26,0.14)"
                      : "transparent",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      fontWeight: isLatest ? 700 : 500,
                      color: isLatest ? IRON.bone : IRON.boneDim,
                    }}
                  >
                    {formatDate(session.date)}
                  </Typography>

                  <Typography
                    align="right"
                    sx={{
                      fontFamily: FONTS.number,
                      fontSize: { xs: "0.8rem", sm: "0.95rem" },
                      color: IRON.boneDim,
                    }}
                  >
                    {session.bodyweight}
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                      {" "}kg
                    </Box>
                  </Typography>

                  {LIFT_ORDER.map((type) => {
                    const value = session[type];
                    const prevValue = prev ? prev[type] : null;
                    const delta = prevValue !== null ? value - prevValue : null;
                    return (
                      <Box
                        key={type}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "baseline",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          align="right"
                          sx={{
                            position: "relative",
                            fontFamily: FONTS.number,
                        fontSize: { xs: "0.9rem", sm: "1.05rem" },
                            fontWeight: isLatest ? 700 : 500,
                            color: isLatest ? IRON.bone : IRON.boneDim,
                          }}
                        >
                          {value}
                          {isPR(value, (s) => s[type]) && (
                            <PRStamp delay={stampDelay} />
                          )}
                        </Typography>
                        {delta !== null && delta !== 0 && (
                          <Typography sx={deltaSx(delta)}>
                            {delta > 0 ? "+" : ""}
                            {delta}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "baseline",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      align="right"
                      sx={{
                        position: "relative",
                        fontFamily: FONTS.number,
                        fontSize: { xs: "0.9rem", sm: "1.05rem" },
                        fontWeight: 700,
                        color: isLatest ? IRON.bloodText : IRON.boneDim,
                      }}
                    >
                      {total}
                      {isPR(total, (s) => s.Squat + s.Bench + s.Deadlift) && (
                        <PRStamp delay={stampDelay + 0.15} />
                      )}
                    </Typography>
                    {totalDelta !== null && totalDelta !== 0 && (
                      <Typography sx={deltaSx(totalDelta)}>
                        {totalDelta > 0 ? "+" : ""}
                        {totalDelta}
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    align="right"
                    sx={{
                      fontFamily: FONTS.number,
                        fontSize: { xs: "0.9rem", sm: "1.05rem" },
                      fontWeight: 600,
                      color: IRON.boneDim,
                    }}
                  >
                    {glPoints.toFixed(2)}
                  </Typography>
                </Box>
                {idx < sessions.length - 1 && (
                  <Divider sx={{ borderColor: IRON.line }} />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const sectionLabelSx = {
  fontFamily: FONTS.stat,
  fontSize: "0.7rem",
  letterSpacing: 2,
  textTransform: "uppercase" as const,
  color: IRON.boneFaint,
  mb: 1,
};

const headerCellSx = {
  fontFamily: FONTS.stat,
  fontSize: "0.65rem",
  letterSpacing: 1,
  textTransform: "uppercase" as const,
  color: IRON.boneFaint,
};
