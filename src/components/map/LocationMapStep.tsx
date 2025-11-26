"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Typography, Stack } from "@mui/material";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

// Dynamic imports para evitar SSR
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false },
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false },
);
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});

// Icono naranja personalizado
const orangeIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path fill="#F24F13" d="M172.3 501.7C26.5 291.3 0 269.4 0 192C0 86 86 0 192 0s192 86 192 192c0 77.4-26.5 99.3-172.3 309.7a24 24 0 0 1-39.4 0zM192 272a80 80 0 1 0 0-160 80 80 0 0 0 0 160z"/>
      </svg>
    `),
  iconSize: [35, 56],
  iconAnchor: [17, 54],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

type Props = {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  title?: string;
  forEdition?: boolean;
};

// Componente para manejar clicks
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Componente que "vuela" cuando cambian coords
function RecenterOnPosition({
  lat,
  lng,
  zoom = 18,
}: {
  lat: number;
  lng: number;
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      !(lat === 0 && lng === 0)
    ) {
      map.flyTo([lat, lng], zoom, { duration: 0.8 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

const LocationMapStep = ({
  latitude,
  longitude,
  onChange,
  title = "Paso 2: Ubicación",
  forEdition = true,
}: Props) => {
  const [currentLat, setCurrentLat] = useState<number>(latitude || 0);
  const [currentLng, setCurrentLng] = useState<number>(longitude || 0);
  const [loadingGPS, setLoadingGPS] = useState(false);

  useEffect(() => {
    if (latitude) setCurrentLat(latitude);
    if (longitude) setCurrentLng(longitude);
  }, [latitude, longitude]);

  useEffect(() => {
    if (forEdition) {
      const isZeroZero =
        (latitude === 0 && longitude === 0) || (!latitude && !longitude);
      if (!isZeroZero) return;
      if (!navigator.geolocation) return;

      setLoadingGPS(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setCurrentLat(lat);
          setCurrentLng(lng);
          onChange(lat, lng);
          setLoadingGPS(false);
        },
        () => setLoadingGPS(false),
        { enableHighAccuracy: true, timeout: 8000 },
      );
    }
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCurrentLat(lat);
        setCurrentLng(lng);
        onChange(lat, lng);
        setLoadingGPS(false);
      },
      () => setLoadingGPS(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <Box sx={{ maxWidth: "800px", width: "100%", mb: 4 }}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>

      <Stack spacing={2} alignItems="stretch">
        {/* Contenedor del mapa */}
        <Box
          sx={{
            width: "100%",
            height: { xs: 420, sm: 520 },
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* @ts-ignore dynamic SSR */}
          <MapContainer
            center={[currentLat, currentLng]} // Usar las coordenadas actuales directamente
            zoom={18}
            scrollWheelZoom
            style={{ width: "100%", height: "100%" }}
          >
            {/* @ts-ignore */}
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterOnPosition lat={currentLat} lng={currentLng} />

            {/* @ts-ignore */}
            <MapClickHandler
              onMapClick={(lat, lng) => {
                if (forEdition) {
                  setCurrentLat(lat);
                  setCurrentLng(lng);
                  onChange(lat, lng);
                }
              }}
            />

            {/* @ts-ignore */}
            <Marker
              position={[currentLat, currentLng]}
              draggable={forEdition}
              icon={orangeIcon}
              eventHandlers={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dragend: (e: any) => {
                  if (forEdition) {
                    const p = e.target.getLatLng();
                    setCurrentLat(p.lat);
                    setCurrentLng(p.lng);
                    onChange(p.lat, p.lng);
                  }
                },
              }}
            />
          </MapContainer>
        </Box>

        {forEdition ? (
          <Button
            variant="outlined"
            startIcon={<RoomOutlinedIcon />}
            onClick={handleUseMyLocation}
            disabled={loadingGPS}
            sx={{ alignSelf: "center", minWidth: 260 }}
          >
            {loadingGPS ? "Obteniendo ubicación..." : "Usar mi ubicación"}
          </Button>
        ) : (
          <Link
            href={`https://www.google.com/maps/search/?q=${currentLat},${currentLng}`}
            target="_blank"
          >
            <Button
              variant="outlined"
              startIcon={<RoomOutlinedIcon />}
              sx={{ alignSelf: "center", minWidth: 260 }}
            >
              Ver en Google Maps
            </Button>
          </Link>
        )}
      </Stack>
    </Box>
  );
};

export default LocationMapStep;
