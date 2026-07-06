import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Hero, LiftType } from "../App";
import { calculateGLPoints } from "../utils/glPoints";

const LIFT_ORDER: LiftType[] = ["Squat", "Bench", "Deadlift"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 1,
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "0.7rem",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          mb: 1,
        }}
      >
        Meet History
      </Typography>

      {sessions.length === 0 ? (
        <Box
          sx={{
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            background:
              "repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 8px, #222 8px, #222 16px)",
            border: "1px dashed rgba(255,255,255,0.15)",
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
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
            borderRadius: 1,
            border: "1px solid rgba(255,255,255,0.06)",
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
              background: "linear-gradient(90deg,#111,#1b1b1b)",
            }}
          >
            <Typography sx={headerCellSx}>Date</Typography>
            <Typography align="right" sx={headerCellSx}>
              BW
            </Typography>
            {LIFT_ORDER.map((type) => (
              <Typography key={type} align="right" sx={headerCellSx}>
                {type}
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
                      ? "rgba(217,70,60,0.08)"
                      : "transparent",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: isLatest ? 700 : 500,
                      color: isLatest ? "#fff" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {formatDate(session.date)}
                  </Typography>

                  <Typography
                    align="right"
                    sx={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {session.bodyweight} kg
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
                            fontSize: "0.8rem",
                            fontWeight: isLatest ? 700 : 500,
                            color: isLatest ? "#fff" : "rgba(255,255,255,0.7)",
                          }}
                        >
                          {value}
                        </Typography>
                        {delta !== null && delta !== 0 && (
                          <Typography
                            sx={{
                              fontSize: "0.65rem",
                              fontWeight: 600,
                              color: delta > 0 ? "#5fbf6b" : "#d9463c",
                            }}
                          >
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
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: isLatest ? "#c9463c" : "rgba(255,255,255,0.8)",
                      }}
                    >
                      {total}
                    </Typography>
                    {totalDelta !== null && totalDelta !== 0 && (
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          color: totalDelta > 0 ? "#5fbf6b" : "#d9463c",
                        }}
                      >
                        {totalDelta > 0 ? "+" : ""}
                        {totalDelta}
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    align="right"
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {glPoints.toFixed(2)}
                  </Typography>
                </Box>
                {idx < sessions.length - 1 && (
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const headerCellSx = {
  fontFamily: "'Oswald', sans-serif",
  fontSize: "0.65rem",
  letterSpacing: 1,
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.45)",
};
