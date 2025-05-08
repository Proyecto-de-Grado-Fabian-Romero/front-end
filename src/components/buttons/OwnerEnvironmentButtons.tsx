import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const OwnerEnvironmentButtons = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button variant="outlined" startIcon={<EditIcon />}>
        Editar Ambiente
      </Button>

      <Button variant="outlined" startIcon={<CalendarMonthIcon />}>
        Ver calendario de reservas
      </Button>

      <Button variant="outlined" startIcon={<ScheduleIcon />}>
        Editar disponibilidad
      </Button>

      <Button variant="outlined" startIcon={<CameraAltIcon />}>
        Solicitar captura 360
      </Button>
    </Box>
  );
};

export default OwnerEnvironmentButtons;
