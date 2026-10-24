import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme as ironTheme, IRON, FONTS } from "./theme";
import { heavyShadow, PLATE_BG, WALL_URL } from "./textures";
import { Hero, RankedHero, SortMode } from "./types";
import { calculateDots } from "./utils/dots";
import {
  computeTotal,
  getCurrentBodyweight,
  getSortValue,
} from "./utils/lifts";
import { useFlip } from "./utils/motion";
import { useSound } from "./utils/sound";
import { SortControls } from "./components/SortControls";
import { BarbedWireDivider } from "./components/BarbedWireDivider";
import { AtmosphereLayer } from "./components/AtmosphereLayer";
import { BloodTitle } from "./components/BloodTitle";
import { Podium } from "./components/Podium";
import { Leaderboard } from "./components/Leaderboard";
import { Cross, SearchIron, SoundOff, SoundOn } from "./components/IronIcons";
import { NoMatch } from "./components/BoardStates";
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
          dots: calculateDots(total, bodyweight, h.sex),
        };
      }),
    [heroes],
  );

  // Competition ranking: equal values share a place (1, 2, 2, 4)
  const ranked = useMemo<RankedHero[]>(() => {
    const sorted = [...computed].sort(
      (a, b) => getSortValue(b, sortMode) - getSortValue(a, sortMode),
    );
    return sorted.reduce<RankedHero[]>((acc, h, i) => {
      const prev = acc[i - 1];
      const tied =
        prev && getSortValue(prev, sortMode) === getSortValue(h, sortMode);
      acc.push({ ...h, originalRank: tied ? prev.originalRank : i + 1 });
      return acc;
    }, []);
  }, [computed, sortMode]);

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
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* The wall: same scratched iron, pushed colder and darker, with the
            corners falling away to black so the plates sit in its light.
            Its own fixed layer, not background-attachment: fixed, which made the
            browser repaint every plate on every scroll frame. */}
        <Box
          aria-hidden
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: [
              "radial-gradient(ellipse 90% 75% at 50% 30%, transparent 35%, rgba(0,0,0,0.75) 100%)",
              "linear-gradient(rgba(16,14,20,0.42), rgba(16,14,20,0.42))",
              `url(${WALL_URL})`,
            ].join(", "),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
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

          {/* The top three hold their places whatever the search; it only
              filters the board below */}
          <Podium
            metric={sortMode}
            entries={ranked.map((h) => ({
              name: h.name,
              value: getSortValue(h, sortMode),
            }))}
          />

          <BarbedWireDivider title="The Damned" />

          {/* Search and sort sit with the board they control */}
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
              placeholder="Hunt the damned…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ color: IRON.boneFaint }}
                    >
                      <SearchIron />
                    </InputAdornment>
                  ),
                  endAdornment: isSearching && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Clear search"
                        onClick={() => setSearchQuery("")}
                        edge="end"
                        sx={{ borderRadius: 0, color: IRON.boneDim }}
                      >
                        <Cross />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { fontFamily: FONTS.stat },
                },
                htmlInput: { "aria-label": "Search lifters" },
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
                  border: `1px solid ${soundOn ? IRON.blood : "#000"}`,
                  boxShadow: `${heavyShadow(0.6)}, inset 0 1px 0 rgba(232,224,208,0.07)`,
                  background: PLATE_BG,
                  color: soundOn ? IRON.bloodText : IRON.boneFaint,
                  "&:hover": {
                    background: PLATE_BG,
                    filter: "brightness(1.35)",
                  },
                }}
              >
                {soundOn ? <SoundOn /> : <SoundOff />}
              </IconButton>
            </Box>
          </Box>

          {filteredAndRanked.length === 0 ? (
            <NoMatch query={searchQuery} onClear={() => setSearchQuery("")} />
          ) : (
            <Leaderboard
              isMobile={isMobile}
              heroes={filteredAndRanked}
              sortMode={sortMode}
              onSort={changeSort}
              expandedHero={expandedHero}
              onToggle={toggleExpand}
              register={register}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
