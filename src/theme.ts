import { createTheme } from "@mui/material/styles";

// "Iron & Blood": black iron, bone-white chalk, and one colour that hurts.
// Red is reserved for what matters: the active sort, PRs and #1.
export const IRON = {
  black: "#0b0a0a",
  plate: "#151313",
  steel: "#2a2626",
  line: "rgba(232,224,208,0.12)",
  bone: "#e8e0d0",
  boneDim: "rgba(232,224,208,0.6)",
  boneFaint: "rgba(232,224,208,0.4)",
  blood: "#a3101a",
  bloodDeep: "#4a0608",
  // Brighter red for text on black (passes WCAG AA contrast, #a3101a does not)
  bloodText: "#ff3b2f",
  rust: "#8a3a24",
};

// Three roles, nothing else:
//   metal  - title, lifter names, section headings
//   number - every number (podium, table, barbells, meet history, rank badges)
//   stat   - every label and piece of UI text
export const FONTS = {
  metal: "'Metal Mania', 'Oswald', serif",
  number: "'Big Shoulders Stencil', 'Oswald', sans-serif",
  stat: "'Oswald', 'Helvetica Neue', sans-serif",
};

// Hard offset shadow, no blur: the brutalist "stamped" look
export const hardShadow = (offset = 6) => `${offset}px ${offset}px 0 #000`;

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
          backgroundColor: "rgba(11,10,10,0.85)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: IRON.line,
            borderWidth: 2,
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
        paper: { border: `2px solid ${IRON.line}`, boxShadow: hardShadow(4) },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottomColor: IRON.line } },
    },
  },
});
