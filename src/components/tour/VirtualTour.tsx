"use client";
import { useEffect, useRef, useState } from "react";
import { Entity, Scene } from "aframe-react";
import "aframe";
import "aframe-extras";
import "aframe-event-set-component";
import { Scene360, Tour360 } from "@/types/Tour360";
import { fetchTourData } from "@/services/environmentService";
import { ColorPalette } from "@/utils/constants/ui-constants";
import { Box, Chip } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

type VirtualTourProps = {
  tour360Id: string;
};

const VirtualTour = ({ tour360Id }: VirtualTourProps) => {
  const [tourData, setTourData] = useState<Tour360 | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene360 | null>(null);
  const skyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const json = await fetchTourData(tour360Id);
        setTourData(json);
        setCurrentScene(json.scenes?.[0]);
      } catch {
        alert("No se pudo cargar el tour virtual, recarga la página por favor");
      }
    };

    if (tour360Id) fetchTour();
  }, [tour360Id]);

  useEffect(() => {
    if (skyRef.current && currentScene) {
      try {
        const skyEl = skyRef.current as unknown as HTMLElement;
        skyEl.setAttribute("src", "");
        setTimeout(() => {
          skyEl.setAttribute("src", currentScene.fileUrl);
        }, 50);
      } catch {}
    }
  }, [currentScene]);

  const handleSceneChange = (sceneId: string) => {
    const nextScene = tourData?.scenes.find((scene) => scene.id === sceneId);
    if (nextScene) setCurrentScene(nextScene);
  };

  const formatDateLiteral = (unixSeconds: number) => {
    const date = new Date(unixSeconds * 1000);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!currentScene) return <p>Cargando recorrido virtual...</p>;

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <Scene
        embedded
        vr-mode-ui="enabled: true"
        xr-mode-ui="enabled: true"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Cámara con raycaster VR */}
        <Entity camera position="0 1.6 0" look-controls wasd-controls>
          <Entity
            id="camera"
            cursor="rayOrigin: entity; fuse: false"
            raycaster={{ objects: ".clickable" }}
            geometry={{
              primitive: "ring",
              radiusInner: 0.02,
              radiusOuter: 0.03,
            }}
            material={{ color: "white", shader: "standard" }}
            position="0 0 -1"
          />
        </Entity>

        {/* Cursor adicional para mouse normal */}
        <Entity
          cursor="rayOrigin: mouse"
          raycaster={{ objects: ".clickable" }}
        />

        {/* Fondo */}
        <Entity
          primitive="a-sky"
          key={currentScene.id}
          src={currentScene.fileUrl}
          material={{ shader: "flat", side: "back" }}
        />

        {/* POIs */}
        {currentScene.pois.map((poi, index) => (
          <Entity
            key={`poi-${index}-${poi.sceneId}`}
            geometry={{ primitive: "sphere", radius: 0.2 }}
            material={{
              color: ColorPalette.PRIMARY_HOVER,
              emissive: ColorPalette.PRIMARY_HOVER,
              opacity: 0.9,
              shader: "standard",
            }}
            animation__pulse={{
              property: "scale",
              dir: "alternate",
              dur: 1000,
              loop: true,
              to: "1.3 1.3 1.3",
            }}
            src="/arrow.png"
            position={poi.position}
            scale="1 1 1"
            class="clickable"
            look-at="#camera"
            events={{
              click: () => handleSceneChange(poi.sceneId),
            }}
          />
        ))}
      </Scene>
      <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
        <Chip
          icon={<CalendarToday />}
          label={
            tourData?.createdDate
              ? `Tomado el ${formatDateLiteral(tourData.createdDate)}`
              : "Fecha no disponible"
          }
          sx={{
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            "& .MuiChip-icon": { color: "#fff" },
            fontSize: 12.4,
            height: 32,
          }}
        />
      </Box>
    </div>
  );
};

export default VirtualTour;
