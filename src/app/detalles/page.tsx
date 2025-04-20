import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import WifiIcon from "@mui/icons-material/Wifi";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PetsIcon from "@mui/icons-material/Pets";
import WhatshotIcon from "@mui/icons-material/Whatshot";

const environmentData = {
  title: "Oficina Moderna en el Centro",
  location: "Cochabamba, Bolivia",
  minRentalTime: 1,
  maxRentalTime: 8,
  capacity: 10,
  instantBooking: true,
  description:
    "Oficina equipada con tecnología de punta, perfecta para reuniones y trabajo colaborativo.",
  services: [
    { name: "WiFi", icon: <WifiIcon /> },
    { name: "Aire Acondicionado", icon: <AcUnitIcon /> },
    { name: "Estacionamiento", icon: <LocalParkingIcon /> },
    { name: "Pet Friendly", icon: <PetsIcon /> },
    { name: "Calefacción", icon: <WhatshotIcon /> },
  ],
  equipment: [
    "1 Proyector",
    "4 Sillas Ergonómicas",
    "1 Escritorio",
    "1 Lámpara",
  ],
  areas: ["Baño", "Oficina Privada", "Sala de Descanso"],
  pricePerHour: 30,
  photos: [
    "https://f005.backblazeb2.com/file/spacio/environments/3d6f8f20-e006-4319-ba3f-da40c4b8ab4a/1.jpg",
    "https://f005.backblazeb2.com/file/spacio/environments/3d6f8f20-e006-4319-ba3f-da40c4b8ab4a/1.jpg",
    "https://f005.backblazeb2.com/file/spacio/environments/3d6f8f20-e006-4319-ba3f-da40c4b8ab4a/2.jpg",
    "https://f005.backblazeb2.com/file/spacio/environments/3d6f8f20-e006-4319-ba3f-da40c4b8ab4a/3.jpg",
  ],
  mapEmbedUrl: "https://www.google.com/maps/embed?q=-17.814,-63.156",
};

export default function EnvironmentDetailsPage() {
  return (
    <Box sx={{ padding: 2, maxWidth: 600, margin: "auto" }}>
      <Image
        src={environmentData.photos[0]}
        alt="Oficina Principal"
        width={600}
        height={400}
        style={{ borderRadius: 12 }}
      />

      <Typography variant="h5" fontWeight="bold" mt={2}>
        {environmentData.title}
      </Typography>

      <Typography color="text.secondary" display="flex" alignItems="center">
        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
        {environmentData.location}
      </Typography>

      <Box display="flex" gap={2} mt={1}>
        <Chip
          icon={<AccessTimeIcon />}
          label={`Min. ${environmentData.minRentalTime} hora`}
        />
        <Chip
          icon={<GroupIcon />}
          label={`Máx. ${environmentData.capacity} personas`}
        />
      </Box>

      <Typography mt={2}>{environmentData.description}</Typography>

      <Box mt={3}>
        <Typography fontWeight="bold">Servicios incluidos</Typography>
        <Grid container spacing={1} mt={1}>
          {environmentData.services.map((service) => (
            <Grid key={service.name}>
              <Chip icon={service.icon} label={service.name} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={3}>
        <Typography fontWeight="bold">Equipamiento</Typography>
        <ul>
          {environmentData.equipment.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Box>

      <Box mt={3}>
        <Typography fontWeight="bold">Áreas</Typography>
        <ul>
          {environmentData.areas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </Box>

      <Box mt={3}>
        <Typography fontWeight="bold">Recorrido Virtual</Typography>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Typography variant="body2">
              360° Virtual Tour Coming Soon
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box mt={3}>
        <Typography fontWeight="bold">Ubicación</Typography>
        <Box
          sx={{
            mt: 1,
            border: "1px solid #ccc",
            borderRadius: 2,
            overflow: "hidden",
            height: 300,
          }}
        >
          <iframe
            src={environmentData.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
      </Box>

      {/* <div
        style={{ width: "800px", height: "1000px", border: "1px solid black" }}
      >
        <VirtualTour />
      </div> */}

      <Box
        mt={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" fontWeight="bold">
          Bs. {environmentData.pricePerHour} / hora
        </Typography>
        <Button variant="contained" color="primary">
          Reservar
        </Button>
      </Box>
    </Box>
  );
}
