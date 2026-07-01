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

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "total", label: "Total" },
  { value: "Squat", label: "Squat" },
  { value: "Bench", label: "Bench" },
  { value: "Deadlift", label: "Deadlift" },
  { value: "glPoints", label: "GL Points" },
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
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
        sx={{
          background: "linear-gradient(160deg, #2a2b2d, #141516)",
          color: "#fff",
          borderRadius: 1,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: 1,
          textTransform: "uppercase",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.15)",
          },
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
      value={value}
      onChange={(_, v) => v && onChange(v)}
      sx={{
        background: "linear-gradient(160deg, #2a2b2d, #141516)",
        borderRadius: 1,
        p: 0.5,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {SORT_OPTIONS.map((opt) => (
        <ToggleButton
          key={opt.value}
          value={opt.value}
          sx={{
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            px: 2,
            border: 0,
            borderRadius: "6px !important",
            "&.Mui-selected": {
              color: "#fff",
              background: "linear-gradient(135deg, #7a3220, #4a1e12)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
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
