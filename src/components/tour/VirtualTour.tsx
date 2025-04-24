"use client";
import { useEffect, useRef, useState } from "react";
import { Entity, Scene } from "aframe-react";
import "aframe";
import "aframe-extras";
import "aframe-event-set-component";
import { Scene360, Tour360 } from "@/types/Tour360";

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
        const res = await fetch(`http://localhost:5150/api/tour/${tour360Id}`);
        const json = await res.json();
        setTourData(json);
        setCurrentScene(json.scenes?.[0]);
      } catch (error) {
        console.error("Error fetching tour 360:", error);
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
      } catch (error) {}
    }
  }, [currentScene]);

  const handleSceneChange = (sceneId: string) => {
    const nextScene = tourData?.scenes.find((scene) => scene.id === sceneId);
    if (nextScene) setCurrentScene(nextScene);
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
        <Entity
          camera
          position="0 1.6 0"
          look-controls
          wasd-controls
          raycaster={{ objects: ".clickable" }}
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
          ref={skyRef}
          key={currentScene.id}
          primitive="a-sky"
          src={currentScene.fileUrl}
          material={{ shader: "flat", side: "back" }}
        />

        {currentScene.pois.map((poi, index) => (
          <Entity
            key={`poi-${index}-${poi.sceneId}`}
            primitive="a-image"
            radius="0.25"
            scale="1 1 1"
            src="/arrow.png"
            position={poi.position}
            class="clickable"
            event-set__mouseenter={{ "material.color": "blue" }}
            event-set__mouseleave={{ "material.color": "white" }}
            events={{
              click: () => handleSceneChange(poi.sceneId),
              "grab-start": () => handleSceneChange(poi.sceneId),
            }}
          />
        ))}
      </Scene>
    </div>
  );
};

export default VirtualTour;
