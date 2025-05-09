"use client";

import React from "react";
import { Grid, Box, Paper, Tooltip } from "@mui/material";
import Image from "next/image";
import { Scene360 } from "@/types/Tour360";
import { ColorPalette } from "@/utils/constants/ui-constants";

type Props = {
  scenes: Scene360[];
  selectedId: string | null;
  onSelect: (sceneId: string) => void;
  excludeId?: string;
  layout?: "grid" | "horizontal";
};

const SceneThumbnailSelector: React.FC<Props> = ({
  scenes,
  selectedId,
  onSelect,
  excludeId,
  layout = "grid",
}) => {
  const filtered = scenes.filter((s) => s.id !== excludeId);

  if (layout === "horizontal") {
    return (
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", mb: 3 }}>
        {filtered.map((scene) => (
          <Tooltip key={scene.id} title={scene.fileName} arrow>
            <Box
              onClick={() => onSelect(scene.id)}
              sx={{
                cursor: "pointer",
                border:
                  selectedId === scene.id
                    ? `3px solid ${ColorPalette.PRIMARY_ACTION}`
                    : "1px solid #ccc",
                borderRadius: 2,
                overflow: "hidden",
                width: 200,
                flexShrink: 0,
                boxShadow: selectedId === scene.id ? 4 : 1,
              }}
            >
              <Image
                src={scene.fileUrl}
                alt={scene.fileName}
                width={200}
                height={100}
                style={{ objectFit: "cover", display: "block" }}
              />
            </Box>
          </Tooltip>
        ))}
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {filtered.map((scene) => (
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={scene.id}>
          <Paper
            elevation={selectedId === scene.id ? 6 : 1}
            sx={{
              cursor: "pointer",
              border:
                selectedId === scene.id
                  ? `2px solid ${ColorPalette.PRIMARY_ACTION}`
                  : "1px solid #ccc",
              borderRadius: 2,
              overflow: "hidden",
            }}
            onClick={() => onSelect(scene.id)}
          >
            <Image
              src={scene.fileUrl}
              alt={scene.fileName}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SceneThumbnailSelector;
