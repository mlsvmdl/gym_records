import { createTheme } from "@mui/material/styles";
import { heavyShadow, PLATE_BG } from "./textures";

// "Iron & Blood": black iron, bone-white chalk, and one colour that hurts.
// Red is reserved for what matters: the active sort, PRs and #1.
export const IRON = {
  black: "#0b0a0a",
  plate: "#151313",
  steel: "#2a2626",
  line: "rgba(232,224,208,0.12)",
  bone: "#e8e0d0",
  boneDim: "rgba(232,224,208,0.6)",
  // 0.52 keeps small labels at ~4.6:1 on the plate (0.4 was ~3.3:1)
  boneFaint: "rgba(232,224,208,0.52)",
  blood: "#a3101a",
  bloodDeep: "#4a0608",
  // Brighter red for text on black (passes WCAG AA contrast, #a3101a does not)
  bloodText: "#ff3b2f",
  rust: "#8a3a24",
  // A lift that went down since the last meet: hot rust, readable at small sizes
  scar: "#e0804f",
};

// The top three wear old metal, never polish: tarnished brass, pewter, rust.
// (Red stays reserved for the active/open state, so #1 doesn't take it.)
export const RANK_METAL: Record<number, string> = {
  1: "#b9a36e",
  2: "#9a9d9f",
  3: "#a0583a",
};

// Four roles, nothing else:
//   metal  - the "Sougueur" masthead, podium names and numerals, section headings: spiky 80s metal
//   name   - lifter names on the board: rock-tattoo face whose capital I can't pass for a J
//   number - every number (podium, table, barbells, meet history)
//   stat   - every label and piece of UI text: worn typewriter, like a xeroxed zine (400 only)
export const FONTS = {
  metal: "'Metal Mania', serif",
  name: "'New Rocker', 'Metal Mania', serif",
  number: "'Big Shoulders', sans-serif",
  stat: "'Special Elite', 'Courier New', monospace",
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: IRON.blood, contrastText: IRON.bone },
    error: { main: IRON.bloodText },
    background: { default: IRON.black, paper: IRON.plate },
    text: { primary: IRON.bone, secondary: IRON.boneDim },
    divider: IRON.line,
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: FONTS.stat,
    fontSize: 16,
    button: { textTransform: "uppercase", letterSpacing: 1 },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: PLATE_BG,
          boxShadow: `${heavyShadow(0.6)}, inset 0 2px 6px rgba(0,0,0,0.8)`,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000",
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: IRON.boneFaint,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: IRON.blood,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: PLATE_BG,
          border: "1px solid #000",
          boxShadow: heavyShadow(),
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottomColor: IRON.line } },
    },
  },
});
