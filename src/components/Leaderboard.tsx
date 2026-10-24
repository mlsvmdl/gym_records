import React from "react";
import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { RankedHero, SortMode } from "../types";
import { FONTS, IRON, RANK_METAL } from "../theme";
import { formatMetric, getSortValue, METRIC_LABEL } from "../utils/lifts";
import { HeroDetail } from "./HeroDetail";
import { IronPlate } from "./IronPlate";
import { Chevron } from "./IronIcons";
import { RankBadge } from "./RankBadge";
import { BLOOD_RULE, PUNCHED, RECESS, RUST, SEAM } from "../textures";

// Edge strip: red when opened, metal colour for the top three, otherwise none
const stripColor = (rank: number, open: boolean) =>
  open ? IRON.bloodText : (RANK_METAL[rank] ?? "transparent");

const STAT_COLUMNS: { mode: SortMode; label: string; short: string }[] = [
  { mode: "Squat", label: "Squat", short: "SQ" },
  { mode: "Bench", label: "Bench", short: "BP" },
  { mode: "Deadlift", label: "Deadlift", short: "DL" },
  { mode: "total", label: "Total", short: "TOT" },
  { mode: "dots", label: "DOTS", short: "DOTS" },
];

// The active column is stained: blood soaked into rust, darkest at the top.
// Layered as images so hover background colours still show through underneath.
// The rust shows only faintly through a dark blood wash, so labels and figures
// on top keep their contrast.
const BAND = `linear-gradient(180deg, rgba(70,4,7,0.8), rgba(46,5,6,0.86)), ${RUST}`;

// Every body cell sits on a scratched weld seam; the active one is stained too
const cellBg = (active: boolean) => ({
  backgroundImage: active ? `${SEAM}, ${BAND}` : SEAM,
  backgroundRepeat: active ? "repeat-x, repeat, repeat" : "repeat-x",
  backgroundPosition: active ? "left bottom, 0 0, 0 0" : "left bottom",
});

const detailId = (name: string) => `scars-${name.replace(/\W+/g, "-")}`;

// Red is for #1 in the active column only; the rest of the column is bright bone
const statColor = (active: boolean, rank: number) =>
  active ? (rank === 1 ? IRON.bloodText : IRON.bone) : IRON.boneDim;

const statNumberSx = (color: string, size: string) => ({
  fontFamily: FONTS.number,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
  color,
  textShadow: PUNCHED,
});

const labelSx = {
  fontFamily: FONTS.stat,
  textTransform: "uppercase" as const,
  color: IRON.boneFaint,
};

const nameSx = {
  fontFamily: FONTS.name,
  fontSize: "1.4rem",
  lineHeight: 1.15,
  color: IRON.bone,
  textShadow: "0 2px 0 #000, 0 3px 8px rgba(0,0,0,0.8)",
};

// Unstyled native button, so table rows keep their row semantics
const bareButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  p: 0,
  border: 0,
  background: "none",
  color: "inherit",
  font: "inherit",
  textAlign: "left" as const,
  cursor: "pointer",
};

// The arrowhead turns to point down into the open scars
const ChevronMark: React.FC<{ open: boolean }> = ({ open }) => (
  <Box
    component="span"
    aria-hidden
    sx={{
      display: "inline-flex",
      color: open ? IRON.bloodText : IRON.boneFaint,
      transform: open ? "rotate(0deg)" : "rotate(-90deg)",
      transition: "transform 200ms cubic-bezier(.2,.8,.2,1), color 120ms",
      "@media (prefers-reduced-motion: reduce)": { transition: "none" },
    }}
  >
    <Chevron />
  </Box>
);

interface LeaderboardProps {
  heroes: RankedHero[];
  sortMode: SortMode;
  onSort: (mode: SortMode) => void;
  expandedHero: string | null;
  onToggle: (name: string) => void;
  register: (key: string) => (el: HTMLElement | null) => void;
}

const LeaderboardTable: React.FC<LeaderboardProps> = ({
  heroes,
  sortMode,
  onSort,
  expandedHero,
  onToggle,
  register,
}) => (
  <IronPlate rust={0.7} sx={{ p: "16px" }}>
    <Box sx={{ overflowX: "auto" }}>
      <Table
        sx={{
          minWidth: 760,
          "& th, & td": { borderBottom: 0 },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...labelSx, width: 72, letterSpacing: 2 }}>
              Rank
            </TableCell>
            <TableCell sx={{ ...labelSx, letterSpacing: 2 }}>Lifter</TableCell>
            {STAT_COLUMNS.map(({ mode, label }) => {
              const active = sortMode === mode;
              return (
                <TableCell
                  key={mode}
                  align="right"
                  aria-sort={active ? "descending" : undefined}
                  sx={{
                    width: 112,
                    backgroundImage: active ? BAND : "none",
                  }}
                >
                  <Box
                    component="button"
                    onClick={() => onSort(mode)}
                    sx={{
                      ...bareButton,
                      ...labelSx,
                      letterSpacing: 2,
                      color: active ? IRON.bloodText : IRON.boneFaint,
                      "&:hover": { color: active ? IRON.bloodText : IRON.bone },
                    }}
                  >
                    {label}
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow aria-hidden>
            <TableCell
              colSpan={7}
              sx={{
                p: 0,
                height: 20,
                backgroundImage: BLOOD_RULE,
                backgroundRepeat: "repeat-x",
              }}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {heroes.map((hero) => {
            const open = expandedHero === hero.name;
            const strip = stripColor(hero.originalRank, open);
            const lit = `inset 4px 0 0 ${IRON.bloodText}`;
            return (
              <React.Fragment key={hero.name}>
                {/* Mouse users click anywhere on the row; keyboard and screen
                    readers get the real button on the name */}
                <TableRow
                  ref={register(hero.name)}
                  onClick={() => onToggle(hero.name)}
                  sx={{
                    cursor: "pointer",
                    "& td": {
                      py: 1.25,
                      backgroundColor: open
                        ? "rgba(74,6,8,0.35)"
                        : "transparent",
                      transition:
                        "transform 120ms ease, background-color 120ms ease",
                    },
                    "& td:first-of-type": {
                      boxShadow: `inset 4px 0 0 ${strip}`,
                    },
                    // grabbed: the row sinks into shadow and its tag catches the light
                    "&:hover td, &:has(button:focus-visible) td": {
                      backgroundColor: "rgba(10,2,3,0.55)",
                      transform: "translateX(4px)",
                    },
                    "&:hover .rank-tag, &:has(button:focus-visible) .rank-tag":
                      { filter: "brightness(1.45)" },
                    "&:hover td:first-of-type, &:has(button:focus-visible) td:first-of-type":
                      { boxShadow: lit },
                  }}
                >
                  <TableCell sx={cellBg(false)}>
                    <RankBadge rank={hero.originalRank} />
                  </TableCell>
                  <TableCell sx={cellBg(false)}>
                    <Box
                      component="button"
                      aria-expanded={open}
                      aria-controls={open ? detailId(hero.name) : undefined}
                      sx={{ ...bareButton, ...nameSx }}
                    >
                      {hero.name}
                      <ChevronMark open={open} />
                    </Box>
                  </TableCell>
                  {STAT_COLUMNS.map(({ mode }) => (
                    <TableCell
                      key={mode}
                      align="right"
                      sx={cellBg(sortMode === mode)}
                    >
                      <Typography
                        component="span"
                        sx={statNumberSx(
                          statColor(sortMode === mode, hero.originalRank),
                          sortMode === mode ? "1.8rem" : "1.45rem",
                        )}
                      >
                        {formatMetric(getSortValue(hero, mode), mode)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow ref={register(`${hero.name}:detail`)}>
                  <TableCell colSpan={7} sx={{ p: 0 }}>
                    <Collapse in={open} unmountOnExit id={detailId(hero.name)}>
                      <HeroDetail hero={hero} />
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  </IronPlate>
);

const LeaderboardCards: React.FC<LeaderboardProps> = ({
  heroes,
  sortMode,
  expandedHero,
  onToggle,
  register,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {heroes.map((hero) => {
      const open = expandedHero === hero.name;
      return (
        <IronPlate
          key={hero.name}
          ref={register(hero.name)}
          depth={0.8}
          boltSize={8}
          rust={0.65}
          bloodied={open}
          sx={{ overflow: "hidden" }}
        >
          <Box
            role="button"
            tabIndex={0}
            aria-expanded={open}
            aria-controls={open ? detailId(hero.name) : undefined}
            onClick={() => onToggle(hero.name)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(hero.name);
              }
            }}
            sx={{
              p: { xs: 1.5, sm: 2 },
              cursor: "pointer",
              outlineOffset: "-4px",
              "&:focus-visible": { backgroundColor: "rgba(163,16,26,0.12)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <RankBadge rank={hero.originalRank} />
              <Typography
                sx={{
                  ...nameSx,
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hero.name}
              </Typography>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={statNumberSx(statColor(true, hero.originalRank), "2rem")}
                >
                  {formatMetric(getSortValue(hero, sortMode), sortMode)}
                </Typography>
                <Typography
                  sx={{
                    ...labelSx,
                    fontSize: "0.68rem",
                    letterSpacing: 1.5,
                    mt: 0.25,
                  }}
                >
                  {METRIC_LABEL[sortMode]}
                </Typography>
              </Box>
              <ChevronMark open={open} />
            </Box>

            {/* All five stats in one strip, split by seams; active one gets the band */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                mt: 1.5,
                ...RECESS,
              }}
            >
              {STAT_COLUMNS.map(({ mode, short }, i) => (
                <Box
                  key={mode}
                  sx={{
                    textAlign: "center",
                    py: 0.75,
                    px: 0.25,
                    borderLeft: i > 0 ? "1px solid #000" : 0,
                    boxShadow:
                      i > 0 ? "inset 1px 0 0 rgba(232,224,208,0.05)" : "none",
                    backgroundImage: sortMode === mode ? BAND : "none",
                  }}
                >
                  <Typography
                    sx={{
                      ...labelSx,
                      fontSize: "0.68rem",
                      letterSpacing: 1,
                      color:
                        sortMode === mode ? IRON.bloodText : IRON.boneFaint,
                    }}
                  >
                    {short}
                  </Typography>
                  <Typography
                    sx={statNumberSx(
                      statColor(sortMode === mode, hero.originalRank),
                      "1.1rem",
                    )}
                  >
                    {formatMetric(getSortValue(hero, mode), mode)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Collapse in={open} unmountOnExit id={detailId(hero.name)}>
            <HeroDetail hero={hero} />
          </Collapse>
        </IronPlate>
      );
    })}
  </Box>
);

export const Leaderboard: React.FC<
  LeaderboardProps & { isMobile: boolean }
> = ({ isMobile, ...props }) =>
  isMobile ? <LeaderboardCards {...props} /> : <LeaderboardTable {...props} />;
