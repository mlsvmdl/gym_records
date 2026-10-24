import React from "react";
import { Button, Typography } from "@mui/material";
import { FONTS, IRON } from "../theme";
import { heavyShadow } from "../textures";
import { IronPlate } from "./IronPlate";

const noteSx = {
  fontFamily: FONTS.stat,
  fontSize: "0.8rem",
  letterSpacing: 1,
  color: IRON.boneDim,
};

// The hunt turned up nobody: say so, and give the way back
export const NoMatch: React.FC<{ query: string; onClear: () => void }> = ({
  query,
  onClear,
}) => (
  <IronPlate sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
    <Typography
      sx={{
        fontFamily: FONTS.metal,
        fontSize: { xs: "1.6rem", md: "2rem" },
        color: IRON.bone,
        textShadow: "3px 3px 0 #000",
      }}
    >
      No soul by that name
    </Typography>
    <Typography sx={{ ...noteSx, mt: 1, overflowWrap: "anywhere" }}>
      Nobody on the board matches “{query.trim()}”. Check the spelling, or bring
      everyone back.
    </Typography>
    <Button
      onClick={onClear}
      variant="contained"
      disableElevation
      sx={{
        mt: 2.5,
        fontFamily: FONTS.stat,
        boxShadow: heavyShadow(0.6),
        "&:hover": { boxShadow: heavyShadow(0.6), background: IRON.bloodDeep },
      }}
    >
      Clear the hunt
    </Button>
  </IronPlate>
);
