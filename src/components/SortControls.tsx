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
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
        sx={{
          background: IRON.black,
          color: IRON.bone,
          fontFamily: FONTS.stat,
          letterSpacing: 1,
          textTransform: "uppercase",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: IRON.line,
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
        background: IRON.black,
        p: 0.5,
        border: `2px solid ${IRON.line}`,
        boxShadow: "4px 4px 0 #000",
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
            "&.Mui-selected": {
              color: IRON.bone,
              background: `linear-gradient(135deg, ${IRON.blood}, ${IRON.bloodDeep})`,
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
