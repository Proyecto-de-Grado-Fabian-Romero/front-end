import { Box, Button, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
// import ScheduleIcon from "@mui/icons-material/Schedule";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { requestTour360 } from "@/services/adminService";
import Link from "next/link";
import { PageRoutes } from "@/utils/constants/page-routes";
import EquipmentModal from "../modal/EquipmentModal";

type OwnerEnvironmentButtonsProps = {
  envPubId: string;
};

const OwnerEnvironmentButtons: React.FC<OwnerEnvironmentButtonsProps> = ({
  envPubId,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [openEquipmentModal, setOpenEquipmentModal] = useState(false);

  const handleRequest360Tour = async () => {
    setLoading(true);
    try {
      await requestTour360(envPubId, user.publicId ?? "");
    } catch {
      alert("No se pudo realizar la solicitud, inténtalo de nuevo");
    } finally {
      setLoading(false);
    }
  };

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
      <Link href={`${PageRoutes.Environment_Details}/${envPubId}/editar`}>
        <Button variant="outlined" startIcon={<EditIcon />}>
          Editar Ambiente
        </Button>
      </Link>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpenEquipmentModal(true)}
      >
        Editar Equipamiento
      </Button>

      {/* <Button variant="outlined" startIcon={<ScheduleIcon />}>
        Editar disponibilidad
      </Button> */}

      <Button
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <CameraAltIcon />}
        disabled={loading}
        onClick={handleRequest360Tour}
        loading={loading}
      >
        Solicitar captura 360
      </Button>

      <EquipmentModal
        open={openEquipmentModal}
        onClose={() => setOpenEquipmentModal(false)}
        publicId={envPubId}
      />
    </Box>
  );
};

export default OwnerEnvironmentButtons;
