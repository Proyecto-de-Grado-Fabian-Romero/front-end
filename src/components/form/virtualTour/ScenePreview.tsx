"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Entity, Scene } from "aframe-react";
import { Scene360 } from "@/types/Tour360";
import "aframe";

type Props = {
  scene: Scene360;
};

const ScenePreview: React.FC<Props> = ({ scene }) => {
  const skyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (skyRef.current && scene) {
      const skyEl = skyRef.current as unknown as HTMLElement;
      skyEl.setAttribute("src", "");
      setTimeout(() => {
        skyEl.setAttribute("src", scene.fileUrl);
      }, 50);
    }
  }, [scene]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Vista previa de la escena: {scene.fileName}
      </Typography>
      <Box
        sx={{ width: "100%", height: 500, borderRadius: 2, overflow: "hidden" }}
      >
        <Scene
          embedded
          vr-mode-ui="enabled: false"
          style={{ width: "100%", height: "100%" }}
        >
          <Entity camera position="0 1.6 0" look-controls wasd-controls />
          <Entity
            ref={skyRef}
            primitive="a-sky"
            src={scene.fileUrl}
            material={{ shader: "flat", side: "back" }}
          />
        </Scene>
      </Box>
    </>
  );
};

export default ScenePreview;
