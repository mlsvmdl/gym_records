import React from "react";
import { Box, Typography } from "@mui/material";
import { Hero, LiftType } from "../types";

const LIFT_ORDER: LiftType[] = ["Squat", "Bench", "Deadlift"];

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export const HeroDetail: React.FC<{ hero: Hero }> = ({ hero }) => {
  return (
    <Box
      sx={{
        p: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        gap: 2,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 1,
      }}
    >
      {LIFT_ORDER.map((type) => {
        const record = hero.Records.find((r) => r.type === type);
        const embedUrl = getYouTubeEmbedUrl(record?.videoUrl);
        return (
          <Box
            key={type}
            sx={{
              p: 1.5,
              borderRadius: 1,
              background: "linear-gradient(160deg, #2a2b2d, #141516)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.6)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#c9463c",
                fontWeight: 600,
                fontSize: "0.8rem",
                mb: 0.5,
              }}
            >
              {type}
            </Typography>
            <Typography sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
              {record?.value ?? 0} kg
            </Typography>
            {embedUrl ? (
              <Box
                sx={{
                  position: "relative",
                  pt: "56.25%",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <iframe
                  src={embedUrl}
                  title={`${hero.name} ${type}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            ) : (
              <Box
                sx={{
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  background:
                    "repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 8px, #222 8px, #222 16px)",
                  border: "1px dashed rgba(255,255,255,0.15)",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  No footage available
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
