import React from "react";
import {
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { SortMode } from "../types";
import { FONTS, IRON } from "../theme";
import { heavyShadow, PLATE_BG, RUST } from "../textures";

// The chosen sort is a tag soaked through with blood
const SOAKED = `radial-gradient(ellipse at 40% 30%, rgba(208,20,31,0.95), rgba(110,8,12,0.95) 70%), ${RUST}`;

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "total", label: "Total" },
  { value: "Squat", label: "Squat" },
  { value: "Bench", label: "Bench" },
  { value: "Deadlift", label: "Deadlift" },
  { value: "dots", label: "DOTS" },
];

export const SortControls: React.FC<{
  value: SortMode;
  onChange: (v: SortMode) => void;
}> = ({ value, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Select
        fullWidth
        size="small"
        inputProps={{ "aria-label": "Rank the board by" }}
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
        sx={{
          color: IRON.bone,
          fontFamily: FONTS.stat,
          letterSpacing: 1,
          textTransform: "uppercase",
          "& .MuiSelect-icon": { color: IRON.bloodText },
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    );
  }

  return (
    <ToggleButtonGroup
      exclusive
      aria-label="Rank the board by"
      value={value}
      onChange={(_, v) => v && onChange(v)}
      sx={{
        background: PLATE_BG,
        p: 0.5,
        border: "1px solid #000",
        boxShadow: `${heavyShadow(0.6)}, inset 0 1px 0 rgba(232,224,208,0.07)`,
      }}
    >
      {SORT_OPTIONS.map((opt) => (
        <ToggleButton
          key={opt.value}
          value={opt.value}
          sx={{
            color: IRON.boneDim,
            fontFamily: FONTS.stat,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            px: 2,
            border: 0,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: IRON.bone,
              background: SOAKED,
              boxShadow:
                "inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 -3px 6px rgba(0,0,0,0.5)",
              textShadow: "0 1px 2px #000",
            },
            "&:hover": { background: "rgba(255,255,255,0.06)" },
          }}
        >
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
