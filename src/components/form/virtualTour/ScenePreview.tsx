import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Entity, Scene } from "aframe-react";
import { Scene360 } from "@/types/Tour360";
import "aframe";

type Props = {
  scene: Scene360;
  onSceneClick: (position: string) => void; // nueva prop
};

const ScenePreview: React.FC<Props> = ({ scene, onSceneClick }) => {
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

  // Escuchar clicks en el visor
  useEffect(() => {
    const sceneEl = document.querySelector("a-scene");
    const handler = (e: any) => {
      const intersection = e.detail.intersection;
      if (!intersection) return;
      const { point } = intersection;
      const posStr = `${point.x.toFixed(2)} ${point.y.toFixed(2)} ${point.z.toFixed(2)}`;
      onSceneClick(posStr);
    };

    const cursor = document.querySelector("[cursor]");
    if (cursor) {
      cursor.addEventListener("click", handler);
    }

    return () => {
      if (cursor) cursor.removeEventListener("click", handler);
    };
  }, [onSceneClick]);

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
          <Entity camera position="0 1.6 0" look-controls wasd-controls>
            <Entity
              cursor={{ rayOrigin: "entity", fuse: false }}
              geometry={{
                primitive: "ring",
                radiusInner: 0.02,
                radiusOuter: 0.03,
              }}
              material={{ color: "white", shader: "standard" }}
              position="0 0 -1"
            />
          </Entity>

          <Entity
            ref={skyRef}
            primitive="a-sky"
            src={scene.fileUrl}
            material={{ shader: "flat", side: "back" }}
          />

          {/* Aquí se podrían renderizar los POIs */}
          {scene.pois.map((poi, index) => (
            <Entity
              key={`poi-${index}`}
              primitive="a-image"
              src="/arrow.png"
              position={poi.position}
              scale="1 1 1"
              rotation={getRotationByType(poi.text)} // según tipo
              class="clickable"
            />
          ))}
        </Scene>
      </Box>
    </>
  );
};

const getRotationByType = (type: string) => {
  switch (type) {
    case "ground":
      return "90 0 0";
    case "door":
      return "0 0 0";
    case "other":
      return "-30 0 0";
    default:
      return "0 0 0";
  }
};

export default ScenePreview;
