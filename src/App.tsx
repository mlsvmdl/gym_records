import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { ThemeProvider } from "@mui/material/styles";
import { theme as ironTheme, IRON, FONTS, hardShadow } from "./theme";
import { Hero, RankedHero, SortMode } from "./types";
import { calculateGLPoints } from "./utils/glPoints";
import { computeTotal, getCurrentBodyweight, getSortValue } from "./utils/lifts";
import { useFlip } from "./utils/motion";
import { playClang } from "./utils/clang";
import { useSound } from "./utils/sound";
import { SortControls } from "./components/SortControls";
import { BarbellDivider } from "./components/BarbellDivider";
import { AtmosphereLayer } from "./components/AtmosphereLayer";
import { BloodTitle } from "./components/BloodTitle";
import { Podium } from "./components/Podium";
import { Leaderboard } from "./components/Leaderboard";
import heroesSeed from "./data/heroes.json";

const App: React.FC = () => {
  const [heroes] = useState<Hero[]>(heroesSeed as Hero[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("total");
  const [expandedHero, setExpandedHero] = useState<string | null>(null);
  const { soundOn, toggleSound } = useSound();
  const { register, capture, play } = useFlip();
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

  const isSearching = searchQuery.trim() !== "";

  const filteredAndRanked = useMemo(() => {
    if (!isSearching) return ranked;
    const q = searchQuery.toLowerCase();
    return ranked.filter((h) => h.name.toLowerCase().includes(q));
  }, [ranked, searchQuery, isSearching]);

  // Rows slide to their new rank: measure before the sort, animate after it lands
  const changeSort = (mode: SortMode) => {
    capture();
    setSortMode(mode);
    // The podium's count-up ticks and slam are the sound feedback; it's hidden while
    // searching, so the sort itself clangs instead.
    if (soundOn && isSearching) playClang();
  };
  useLayoutEffect(play, [sortMode, play]);

  const toggleExpand = (name: string) =>
    setExpandedHero((prev) => (prev === name ? null : name));

  return (
    <ThemeProvider theme={ironTheme}>
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
          <BloodTitle />

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
                    <SearchIcon sx={{ color: IRON.boneFaint }} />
                  </InputAdornment>
                ),
                sx: { fontFamily: FONTS.stat, boxShadow: hardShadow(4) },
              }}
              sx={{ maxWidth: isMobile ? "100%" : 380 }}
            />
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Box sx={{ flex: 1 }}>
                <SortControls value={sortMode} onChange={changeSort} />
              </Box>
              <IconButton
                onClick={toggleSound}
                aria-label="Iron sound effects"
                aria-pressed={soundOn}
                sx={{
                  borderRadius: 0,
                  border: `2px solid ${soundOn ? IRON.blood : IRON.line}`,
                  boxShadow: hardShadow(4),
                  background: IRON.black,
                  color: soundOn ? IRON.bloodText : IRON.boneFaint,
                  "&:hover": { background: IRON.steel },
                }}
              >
                {soundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
              </IconButton>
            </Box>
          </Box>

          {!isSearching && (
            <Podium
              metric={sortMode}
              entries={ranked.map((h) => ({
                name: h.name,
                value: getSortValue(h, sortMode),
              }))}
            />
          )}

          <BarbellDivider />

          <Leaderboard
            isMobile={isMobile}
            heroes={filteredAndRanked}
            sortMode={sortMode}
            expandedHero={expandedHero}
            onToggle={toggleExpand}
            register={register}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
