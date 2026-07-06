import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "./theme";
import { calculateGLPoints } from "./utils/glPoints";
import { RankBadge } from "./components/RankBadge";
import { HeroDetail } from "./components/HeroDetail";
import { SortControls } from "./components/SortControls";
import { RustOverlay } from "./components/RustOverlay";
import { BarbellDivider } from "./components/BarbellDivider";
import { AtmosphereLayer } from "./components/AtmosphereLayer";
import heroesSeed from "./data/heroes.json";

// ---- Types (colocated here, no separate types.ts) ----
export type LiftType = "Squat" | "Bench" | "Deadlift";
export type SortMode = LiftType | "total" | "glPoints";

// One meet/session: all three lifts + bodyweight recorded on the same date
export interface LiftSession {
  date: string; // "YYYY-MM-DD"
  bodyweight: number;
  Squat: number;
  Bench: number;
  Deadlift: number;
}

export interface Hero {
  name: string;
  sex: "male" | "female";
  history: LiftSession[];
}
// -------------------------------------------------------

const LIFT_TYPES: LiftType[] = ["Squat", "Bench", "Deadlift"];

// The "current" state for a hero is whatever was logged in the most recent session
const getLatestSession = (hero: Hero): LiftSession | null => {
  if (!hero.history || hero.history.length === 0) return null;
  return [...hero.history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
};

const getLiftValue = (hero: Hero, type: LiftType) => {
  const latest = getLatestSession(hero);
  return latest ? latest[type] : 0;
};

const computeTotal = (hero: Hero) => {
  const latest = getLatestSession(hero);
  return latest ? latest.Squat + latest.Bench + latest.Deadlift : 0;
};

const getCurrentBodyweight = (hero: Hero) => {
  const latest = getLatestSession(hero);
  return latest ? latest.bodyweight : 0;
};

interface RankedHero extends Hero {
  total: number;
  glPoints: number;
  originalRank: number;
}

const getSortValue = (
  hero: Hero & { total: number; glPoints: number },
  mode: SortMode,
): number => {
  if (mode === "total") return hero.total;
  if (mode === "glPoints") return hero.glPoints;
  return getLiftValue(hero, mode);
};

const rankColor = (rank: number) =>
  rank === 1
    ? "#d9b466"
    : rank === 2
      ? "#c7ccd1"
      : rank === 3
        ? "#b47a4e"
        : "#eee";

const rankRowBg = (rank: number) =>
  rank === 1
    ? "linear-gradient(90deg, rgba(217,180,102,0.08), rgba(0,0,0,0.4))"
    : rank === 2
      ? "linear-gradient(90deg, rgba(199,204,209,0.08), rgba(0,0,0,0.4))"
      : rank === 3
        ? "linear-gradient(90deg, rgba(180,122,78,0.08), rgba(0,0,0,0.4))"
        : "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(0,0,0,0.35))";

const statCellSx = (isActive: boolean) => ({
  fontFamily: "'Oswald', sans-serif",
  fontWeight: isActive ? 800 : 500,
  color: isActive ? "#d9463c" : "rgba(255,255,255,0.75)",
  letterSpacing: isActive ? 0.5 : 0,
});

const App: React.FC = () => {
  const [heroes] = useState<Hero[]>(heroesSeed as Hero[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("total");
  const [expandedHero, setExpandedHero] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const computed = useMemo(
    () =>
      heroes.map((h) => {
        const total = computeTotal(h);
        const bodyweight = getCurrentBodyweight(h);
        return {
          ...h,
          total,
          glPoints: calculateGLPoints(total, bodyweight, h.sex),
        };
      }),
    [heroes],
  );

  const ranked = useMemo<RankedHero[]>(
    () =>
      [...computed]
        .sort((a, b) => getSortValue(b, sortMode) - getSortValue(a, sortMode))
        .map((h, i) => ({ ...h, originalRank: i + 1 })),
    [computed, sortMode],
  );

  const filteredAndRanked = useMemo(() => {
    if (!searchQuery.trim()) return ranked;
    const q = searchQuery.toLowerCase();
    return ranked.filter((h) => h.name.toLowerCase().includes(q));
  }, [ranked, searchQuery]);

  const toggleExpand = (name: string) =>
    setExpandedHero((prev) => (prev === name ? null : name));

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          p: isMobile ? 2 : 4,
          boxSizing: "border-box",
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/gymbackground.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <AtmosphereLayer />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 3 : 4,
            width: "100%",
            maxWidth: 1040,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/fireTitle.gif`}
              alt="Powerlifting Leaderboard"
              style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : 600,
                height: "auto",
                maxHeight: isMobile ? 120 : 200,
                objectFit: "contain",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search heroes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "rgba(0,0,0,0.7)",
                  borderRadius: 1,
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.15)",
                  },
                },
              }}
              sx={{ maxWidth: isMobile ? "100%" : 380 }}
            />
            <SortControls value={sortMode} onChange={setSortMode} />
          </Box>

          <BarbellDivider />

          {isMobile ? (
            <Box>
              {filteredAndRanked.map((hero) => {
                const isExpanded = expandedHero === hero.name;
                return (
                  <Card
                    key={hero.name}
                    onClick={() => toggleExpand(hero.name)}
                    sx={{
                      mb: 2,
                      cursor: "pointer",
                      background: "linear-gradient(160deg, #2a2b2d, #131415)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 1,
                      p: 0,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <RustOverlay intensity="small" />
                    <CardContent sx={{ p: 2, position: "relative", zIndex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1.5,
                        }}
                      >
                        <RankBadge rank={hero.originalRank} size="small" />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: "'Oswald', sans-serif",
                              fontWeight: 700,
                              color: "#fff",
                              letterSpacing: 0.5,
                            }}
                          >
                            {hero.name}
                          </Typography>
                          <Typography
                            component="div"
                            sx={{
                              fontFamily: "'Oswald', sans-serif",
                              fontWeight: 800,
                              letterSpacing: 1,
                              fontSize: "0.85rem",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            <Box
                              sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontFamily: "'Oswald', sans-serif",
                                  fontWeight: sortMode === "total" ? 800 : 500,
                                  fontSize: "0.85rem",
                                  color:
                                    sortMode === "total"
                                      ? rankColor(hero.originalRank)
                                      : "rgba(255,255,255,0.6)",
                                }}
                              >
                                Total: {hero.total} kg
                              </Typography>
                              <Typography
                                component="span"
                                sx={{
                                  fontFamily: "'Oswald', sans-serif",
                                  fontWeight:
                                    sortMode === "glPoints" ? 800 : 500,
                                  fontSize: "0.85rem",
                                  color:
                                    sortMode === "glPoints"
                                      ? rankColor(hero.originalRank)
                                      : "rgba(255,255,255,0.6)",
                                }}
                              >
                                GL: {hero.glPoints.toFixed(2)}
                              </Typography>
                            </Box>
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 1,
                        }}
                      >
                        {LIFT_TYPES.map((type) => (
                          <Box
                            key={type}
                            sx={{
                              textAlign: "center",
                              p: 1,
                              borderRadius: 1,
                              background:
                                "linear-gradient(160deg, #232426, #121212)",
                              border:
                                sortMode === type
                                  ? "1px solid rgba(217,70,60,0.5)"
                                  : "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "'Oswald', sans-serif",
                                fontSize: "0.65rem",
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.45)",
                              }}
                            >
                              {type}
                            </Typography>
                            <Typography sx={statCellSx(sortMode === type)}>
                              {getLiftValue(hero, type)} kg
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                    <Collapse
                      in={isExpanded}
                      sx={{ position: "relative", zIndex: 1 }}
                    >
                      <HeroDetail hero={hero} />
                    </Collapse>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 1,
                background: "rgba(10,10,10,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <RustOverlay />
              <Table sx={{ minWidth: 820, position: "relative", zIndex: 1 }}>
                <TableHead>
                  <TableRow
                    sx={{ background: "linear-gradient(90deg,#111,#1b1b1b)" }}
                  >
                    <TableCell
                      sx={{
                        color: "#999",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Rank
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#999",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Hero
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: sortMode === "Squat" ? "#d9463c" : "#999",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Squat
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: sortMode === "Bench" ? "#d9463c" : "#999",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Bench
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: sortMode === "Deadlift" ? "#d9463c" : "#999",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Deadlift
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: sortMode === "total" ? "#d9463c" : "#999",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: sortMode === "glPoints" ? "#d9463c" : "#999",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      GL Pts
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndRanked.map((hero) => {
                    const isExpanded = expandedHero === hero.name;
                    return (
                      <React.Fragment key={hero.name}>
                        <TableRow
                          onClick={() => toggleExpand(hero.name)}
                          sx={{
                            cursor: "pointer",
                            background: rankRowBg(hero.originalRank),
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            "&:hover": { background: "rgba(255,255,255,0.04)" },
                          }}
                        >
                          <TableCell>
                            <RankBadge rank={hero.originalRank} />
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontFamily: "'Oswald', sans-serif",
                                fontWeight: 700,
                                color: "#fff",
                              }}
                            >
                              {hero.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={statCellSx(sortMode === "Squat")}>
                              {getLiftValue(hero, "Squat")}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={statCellSx(sortMode === "Bench")}>
                              {getLiftValue(hero, "Bench")}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              sx={statCellSx(sortMode === "Deadlift")}
                            >
                              {getLiftValue(hero, "Deadlift")}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={statCellSx(sortMode === "total")}>
                              {hero.total}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              sx={statCellSx(sortMode === "glPoints")}
                            >
                              {hero.glPoints.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                            <Collapse in={isExpanded}>
                              <HeroDetail hero={hero} />
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
