"use client";

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Entity, Scene } from "aframe-react";
import { POI, Scene360 } from "@/types/Tour360";
import "aframe";
import { ColorPalette } from "@/utils/constants/ui-constants";

type Props = {
  scene: Scene360;
  onSceneClick: (position: string) => void;
  onPOIClick: (poi: POI) => void;
};

const ScenePreview: React.FC<Props> = ({ scene, onSceneClick, onPOIClick }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      if (e?.target?.classList?.contains("clickable")) return;

      const intersection = e.detail?.intersection;
      if (!intersection) return;

      const { point } = intersection;
      const posStr = `${(point.x / 100).toFixed(2)} ${(point.y / 100 + 1.5).toFixed(2)} ${(point.z / 100).toFixed(3)}`;
      onSceneClick(posStr);
    };

    const cursors = document.querySelectorAll("[cursor]");
    cursors.forEach((cursor) => {
      cursor.addEventListener("click", handler);
    });

    return () => {
      cursors.forEach((cursor) => {
        cursor.removeEventListener("click", handler);
      });
    };
  }, [onSceneClick]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const sceneEl = document.querySelector("a-scene");
    const skyEl = sceneEl?.querySelector("a-sky");

    if (skyEl && scene) {
      skyEl.setAttribute("src", "");
      setTimeout(() => {
        skyEl.setAttribute("src", scene.fileUrl);
      }, 50);
    }
  }, [scene]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const camera = document.querySelector("#camera") as any;
      const images = document.querySelectorAll(".poi");

      if (camera && images.length) {
        const camPos = camera.object3D.position;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        images.forEach((el: any) => {
          const poiPos = el.object3D.position;
          const dx = camPos.x - poiPos.x;
          const dz = camPos.z - poiPos.z;
          const yaw = (Math.atan2(dx, dz) * 180) / Math.PI;
          el.setAttribute("rotation", `0 ${yaw} 0`);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Vista previa
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 600,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Scene
          embedded
          vr-mode-ui="enabled: false"
          style={{ width: "100%", height: "100%" }}
        >
          <Entity
            cursor="rayOrigin: mouse"
            raycaster={{ objects: ".click-surface", far: 100 }}
          />

          <Entity
            id="camera"
            camera="fov: 60"
            position="0 1.6 0"
            look-controls
            wasd-controls
          >
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
            primitive="a-sky"
            class="click-surface"
            src={scene.fileUrl}
            material={{ shader: "flat", side: "back" }}
          />

          {scene.pois.map((poi, index) => (
            <Entity
              key={`poi ${index}`}
              geometry={{ primitive: "sphere", radius: 0.2 }}
              material={{
                color: ColorPalette.PRIMARY_HOVER,
                emissive: ColorPalette.PRIMARY_HOVER,
                opacity: 0.9,
                shader: "standard",
              }}
              position={poi.position}
              animation__pulse={{
                property: "scale",
                dir: "alternate",
                dur: 1000,
                loop: true,
                to: "1.3 1.3 1.3",
              }}
              class="clickable"
              events={{
                click: () => onPOIClick(poi),
              }}
            />
          ))}
        </Scene>
      </Box>
    </Box>
  );
};

export default ScenePreview;
