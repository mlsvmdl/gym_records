import React from "react";
import { Box, Typography, GlobalStyles, useMediaQuery, useTheme } from "@mui/material";
import { FONTS, IRON } from "../theme";
import { Hero, LiftSession, LiftType } from "../types";
import { calculateDots } from "../utils/dots";
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
// "value": hangs off the number's top-right; "seam": stamped across the cell's top edge
const PRStamp: React.FC<{ delay: number; at?: "value" | "seam" }> = ({
  delay,
  at = "value",
}) => (
  <Box
    component="span"
    aria-label="personal record"
    sx={{
      position: "absolute",
      // seam: straddles the seam above the cell, centred (stamp is ~24px wide)
      ...(at === "value"
        ? { top: -11, right: -16 }
        : { top: -8, left: "calc(50% - 12px)" }),
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

// ---- One pass over the data; both layouts below just draw it ----

interface MeetCell {
  key: string;
  label: string;
  short: string;
  text: string;
  isPR: boolean;
  delta: number | null;
  highlight: boolean; // the total on the latest meet
}

interface Meet {
  date: string;
  bodyweight: number;
  isLatest: boolean;
  stampDelay: number;
  cells: MeetCell[];
}

const sessionTotal = (s: LiftSession) => s.Squat + s.Bench + s.Deadlift;

// sessions are newest-first; a PR beats every earlier meet, not just the previous one
function buildMeets(hero: Hero, sessions: LiftSession[]): Meet[] {
  return sessions.map((session, idx) => {
    const earlier = sessions.slice(idx + 1);
    const prev = earlier[0];
    const isPR = (value: number, of: (s: LiftSession) => number) =>
      earlier.length > 0 && value > Math.max(...earlier.map(of));
    const total = sessionTotal(session);

    const liftCells: MeetCell[] = LIFT_ORDER.map((type) => ({
      key: type,
      label: type,
      short: LIFT_SHORT[type],
      text: String(session[type]),
      isPR: isPR(session[type], (s) => s[type]),
      delta: prev ? session[type] - prev[type] : null,
      highlight: false,
    }));

    return {
      date: session.date,
      bodyweight: session.bodyweight,
      isLatest: idx === 0,
      stampDelay: 0.25 + idx * 0.1,
      cells: [
        ...liftCells,
        {
          key: "total",
          label: "Total",
          short: "TOT",
          text: String(total),
          isPR: isPR(total, sessionTotal),
          delta: prev ? total - sessionTotal(prev) : null,
          highlight: idx === 0,
        },
        {
          key: "dots",
          label: "DOTS",
          short: "DOTS",
          text: calculateDots(total, session.bodyweight, hero.sex).toFixed(2),
          isPR: false,
          delta: null,
          highlight: false,
        },
      ],
    };
  });
}

const CellValue: React.FC<{
  meet: Meet;
  cell: MeetCell;
  index: number;
  size: string;
  withStamp?: boolean;
}> = ({ meet, cell, index, size, withStamp = true }) => (
  <Typography
    component="span"
    sx={{
      position: "relative",
      fontFamily: FONTS.number,
      fontWeight: meet.isLatest ? 800 : 700,
      fontSize: size,
      lineHeight: 1.1,
      color: cell.highlight ? IRON.bloodText : meet.isLatest ? IRON.bone : IRON.boneDim,
    }}
  >
    {cell.text}
    {withStamp && cell.isPR && (
      <PRStamp delay={meet.stampDelay + index * 0.05} />
    )}
  </Typography>
);

// ---- Desktop/tablet: one row per meet ----

const GRID = "1.1fr 0.7fr repeat(3, 1fr) 1fr 1fr";

const MeetTable: React.FC<{ meets: Meet[] }> = ({ meets }) => (
  <Box sx={{ border: "2px solid #000" }}>
    <Box sx={{ display: "grid", gridTemplateColumns: GRID, px: 1.5, py: 0.75, background: IRON.black }}>
      <Typography sx={headerCellSx}>Date</Typography>
      <Typography align="right" sx={headerCellSx}>
        BW
      </Typography>
      {meets[0].cells.map((c) => (
        <Typography key={c.key} align="right" sx={headerCellSx}>
          {c.label}
        </Typography>
      ))}
    </Box>
    {meets.map((meet) => (
      <Box
        key={meet.date}
        sx={{
          display: "grid",
          gridTemplateColumns: GRID,
          alignItems: "center",
          px: 1.5,
          py: 1,
          borderTop: "2px solid #000",
          boxShadow: "inset 0 1px 0 rgba(232,224,208,0.05)",
          background: meet.isLatest ? "rgba(163,16,26,0.14)" : "transparent",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: meet.isLatest ? 700 : 500,
            color: meet.isLatest ? IRON.bone : IRON.boneDim,
          }}
        >
          {formatDate(meet.date)}
        </Typography>
        <Typography align="right" sx={{ fontFamily: FONTS.number, fontSize: "0.95rem", color: IRON.boneDim }}>
          {meet.bodyweight} kg
        </Typography>
        {meet.cells.map((cell, i) => (
          <Box
            key={cell.key}
            sx={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 0.5 }}
          >
            <CellValue meet={meet} cell={cell} index={i} size="1.05rem" />
            {cell.delta !== null && cell.delta !== 0 && (
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: cell.delta > 0 ? IRON.boneDim : IRON.boneFaint,
                }}
              >
                {cell.delta > 0 ? "+" : ""}
                {cell.delta}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);

// ---- Phones: one block per meet, same five-stat strip as the cards ----

const MeetBlocks: React.FC<{ meets: Meet[] }> = ({ meets }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
    {meets.map((meet) => (
      <Box
        key={meet.date}
        sx={{
          border: "2px solid #000",
          background: meet.isLatest ? "rgba(163,16,26,0.14)" : IRON.black,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            px: 1.25,
            py: 0.75,
            borderBottom: "2px solid #000",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: meet.isLatest ? IRON.bone : IRON.boneDim,
            }}
          >
            {formatDate(meet.date)}
          </Typography>
          <Typography sx={{ ...headerCellSx, fontSize: "0.7rem" }}>
            BW{" "}
            <Box component="span" sx={{ fontFamily: FONTS.number, fontSize: "0.95rem", color: IRON.boneDim }}>
              {meet.bodyweight}
            </Box>{" "}
            kg
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          {meet.cells.map((cell, i) => (
            <Box
              key={cell.key}
              sx={{
                position: "relative",
                textAlign: "center",
                pt: 1.25,
                pb: 0.75,
                borderLeft: i > 0 ? "2px solid #000" : 0,
              }}
            >
              {cell.isPR && (
                <PRStamp delay={meet.stampDelay + i * 0.05} at="seam" />
              )}
              <Typography sx={{ ...headerCellSx, display: "block" }}>
                {cell.short}
              </Typography>
              <CellValue
                meet={meet}
                cell={cell}
                index={i}
                size="1.1rem"
                withStamp={false}
              />
            </Box>
          ))}
        </Box>
      </Box>
    ))}
  </Box>
);

export const HeroDetail: React.FC<{ hero: Hero }> = ({ hero }) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const sessions = [...(hero.history ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const meets = buildMeets(hero, sessions);

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
        borderTop: "2px solid #000",
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
          <Box sx={{ mb: 3, px: { xs: 0, sm: 2 } }}>
            <LoadedBarbells
              compact={isPhone}
              lifts={LIFT_ORDER.map((type) => ({
                lift: type,
                kg: Math.max(...sessions.map((s) => s[type])),
              }))}
            />
          </Box>
        </>
      )}
      <Typography sx={sectionLabelSx}>Meet History</Typography>

      {meets.length === 0 ? (
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
      ) : isPhone ? (
        <MeetBlocks meets={meets} />
      ) : (
        <MeetTable meets={meets} />
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
