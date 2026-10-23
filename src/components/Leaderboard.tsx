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
import { FONTS, IRON } from "../theme";
import { formatMetric, getSortValue, METRIC_LABEL } from "../utils/lifts";
import { HeroDetail } from "./HeroDetail";
import { IronPlate } from "./IronPlate";

const TOP3_COLOR: Record<number, string> = {
  1: "#d9b466",
  2: "#c7ccd1",
  3: "#b47a4e",
};

// Edge strip: red when opened, metal colour for the top three, otherwise none
const stripColor = (rank: number, open: boolean) =>
  open ? IRON.bloodText : (TOP3_COLOR[rank] ?? "transparent");

const STAT_COLUMNS: { mode: SortMode; label: string; short: string }[] = [
  { mode: "Squat", label: "Squat", short: "SQ" },
  { mode: "Bench", label: "Bench", short: "BP" },
  { mode: "Deadlift", label: "Deadlift", short: "DL" },
  { mode: "total", label: "Total", short: "TOT" },
  { mode: "dots", label: "DOTS", short: "DOTS" },
];

// Full-height red band down the active column (layered as an image so hover
// background colours still show through underneath it)
const BAND = "linear-gradient(rgba(163,16,26,0.16), rgba(163,16,26,0.16))";
const SEAM = "inset 0 1px 0 rgba(232,224,208,0.05)"; // weld-seam highlight

const rankNumberSx = (rank: number, size: string) => ({
  fontFamily: FONTS.number,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1,
  color: TOP3_COLOR[rank] ?? IRON.boneFaint,
  textShadow: "2px 2px 0 #000",
});

const statNumberSx = (active: boolean, size: string, activeSize: string) => ({
  fontFamily: FONTS.number,
  fontWeight: 800,
  fontSize: active ? activeSize : size,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
  color: active ? IRON.bloodText : IRON.boneDim,
  textShadow: "2px 2px 0 #000",
});

const labelSx = {
  fontFamily: FONTS.stat,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  color: IRON.boneFaint,
};

// Click, Enter or Space toggles a lifter's detail panel
const toggleProps = (open: boolean, onToggle: () => void) => ({
  role: "button",
  tabIndex: 0,
  "aria-expanded": open,
  onClick: onToggle,
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  },
});

interface LeaderboardProps {
  heroes: RankedHero[];
  sortMode: SortMode;
  expandedHero: string | null;
  onToggle: (name: string) => void;
  register: (key: string) => (el: HTMLElement | null) => void;
}

const LeaderboardTable: React.FC<LeaderboardProps> = ({
  heroes,
  sortMode,
  expandedHero,
  onToggle,
  register,
}) => (
  <IronPlate sx={{ p: "14px" }}>
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
            <TableCell sx={{ ...labelSx, letterSpacing: 2 }}>Hero</TableCell>
            {STAT_COLUMNS.map(({ mode, label }) => (
              <TableCell
                key={mode}
                align="right"
                sx={{
                  ...labelSx,
                  width: 112,
                  letterSpacing: 2,
                  color: sortMode === mode ? IRON.bloodText : IRON.boneFaint,
                  backgroundImage: sortMode === mode ? BAND : "none",
                }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
          <TableRow aria-hidden>
            <TableCell
              colSpan={7}
              sx={{ p: 0, height: 3, background: IRON.blood }}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {heroes.map((hero) => {
            const open = expandedHero === hero.name;
            const strip = stripColor(hero.originalRank, open);
            return (
              <React.Fragment key={hero.name}>
                <TableRow
                  ref={register(hero.name)}
                  {...toggleProps(open, () => onToggle(hero.name))}
                  sx={{
                    cursor: "pointer",
                    outline: "none",
                    "& td": {
                      py: 1.25,
                      boxShadow: SEAM,
                      borderBottom: "2px solid #000",
                      backgroundColor: open
                        ? "rgba(163,16,26,0.08)"
                        : "transparent",
                      transition:
                        "transform 120ms ease, background-color 120ms ease",
                    },
                    "& td:first-of-type": {
                      boxShadow: `inset 5px 0 0 ${strip}, ${SEAM}`,
                    },
                    "&:hover td, &:focus-visible td": {
                      backgroundColor: "rgba(163,16,26,0.12)",
                      transform: "translateX(4px)",
                    },
                    "&:hover td:first-of-type, &:focus-visible td:first-of-type":
                      {
                        boxShadow: `inset 5px 0 0 ${IRON.bloodText}, ${SEAM}`,
                      },
                  }}
                >
                  <TableCell>
                    <Typography sx={rankNumberSx(hero.originalRank, "1.9rem")}>
                      {hero.originalRank}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: FONTS.metal,
                        fontSize: "1.45rem",
                        color: IRON.bone,
                        textShadow: "2px 2px 0 #000",
                      }}
                    >
                      {hero.name}
                    </Typography>
                  </TableCell>
                  {STAT_COLUMNS.map(({ mode }) => (
                    <TableCell
                      key={mode}
                      align="right"
                      sx={{
                        backgroundImage: sortMode === mode ? BAND : "none",
                      }}
                    >
                      <Typography
                        component="span"
                        sx={statNumberSx(
                          sortMode === mode,
                          "1.45rem",
                          "1.8rem",
                        )}
                      >
                        {formatMetric(getSortValue(hero, mode), mode)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow ref={register(`${hero.name}:detail`)}>
                  <TableCell colSpan={7} sx={{ p: 0 }}>
                    <Collapse in={open} unmountOnExit>
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
      const strip = stripColor(hero.originalRank, open);
      return (
        <IronPlate
          key={hero.name}
          ref={register(hero.name)}
          shadow={5}
          rivetSize={7}
          sx={{
            overflow: "hidden",
            borderLeft: `6px solid ${strip === "transparent" ? "#000" : strip}`,
          }}
        >
          <Box
            {...toggleProps(open, () => onToggle(hero.name))}
            sx={{
              p: { xs: 1.5, sm: 2 },
              cursor: "pointer",
              outline: "none",
              "&:focus-visible": { backgroundColor: "rgba(163,16,26,0.12)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  ...rankNumberSx(hero.originalRank, "2.2rem"),
                  minWidth: 30,
                }}
              >
                {hero.originalRank}
              </Typography>
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: FONTS.metal,
                  fontSize: "1.45rem",
                  color: IRON.bone,
                  textShadow: "2px 2px 0 #000",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hero.name}
              </Typography>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={statNumberSx(true, "2rem", "2rem")}>
                  {formatMetric(getSortValue(hero, sortMode), sortMode)}
                </Typography>
                <Typography
                  sx={{
                    ...labelSx,
                    fontSize: "0.6rem",
                    letterSpacing: 1.5,
                    mt: 0.25,
                  }}
                >
                  {METRIC_LABEL[sortMode]}
                </Typography>
              </Box>
            </Box>

            {/* All five stats in one strip, split by seams; active one gets the band */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                mt: 1.5,
                border: "2px solid #000",
                background: IRON.black,
              }}
            >
              {STAT_COLUMNS.map(({ mode, short }, i) => (
                <Box
                  key={mode}
                  sx={{
                    textAlign: "center",
                    py: 0.75,
                    px: 0.25,
                    borderLeft: i > 0 ? "2px solid #000" : 0,
                    boxShadow:
                      i > 0 ? "inset 1px 0 0 rgba(232,224,208,0.05)" : "none",
                    backgroundImage: sortMode === mode ? BAND : "none",
                  }}
                >
                  <Typography
                    sx={{
                      ...labelSx,
                      fontSize: "0.6rem",
                      letterSpacing: 1.5,
                      color:
                        sortMode === mode ? IRON.bloodText : IRON.boneFaint,
                    }}
                  >
                    {short}
                  </Typography>
                  <Typography
                    sx={statNumberSx(sortMode === mode, "1.1rem", "1.1rem")}
                  >
                    {formatMetric(getSortValue(hero, mode), mode)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Collapse in={open} unmountOnExit>
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
