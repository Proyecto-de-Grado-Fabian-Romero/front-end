"use client";

import { authFetch } from "@/services/authFetch";
import { PageRoutes } from "@/utils/constants/page-routes";
import {
  AddOutlined,
  SyncOutlined,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  publicId: string;
  environmentId: string;
  environmentName: string;
  status: number;
  requestDate: number;
  scheduledDate?: number;
};

const Tour360RequestCard = ({
  publicId,
  environmentId,
  environmentName,
  status: initialStatus,
  requestDate,
  scheduledDate,
}: Props) => {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: number) => {
    setLoading(true);
    try {

    } catch (error) {
      console.error("Fallo la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {environmentName}
        </Typography>

        <Typography variant="body2" gutterBottom>
          Estado:{" "}
          {loading ? (
            <CircularProgress size={16} />
          ) : (
            <Select
              value={status}
              size="small"
              onChange={(e) => handleStatusChange(Number(e.target.value))}
              sx={{ ml: 1 }}
              startAdornment={<SyncOutlined fontSize="small" />}
            >
              <MenuItem value={0}>Pendiente</MenuItem>
              <MenuItem value={1}>Programado</MenuItem>
              <MenuItem value={2}>Completado</MenuItem>
              <MenuItem value={3}>Cancelado</MenuItem>
            </Select>
          )}
        </Typography>

        <Typography variant="body2">
          Fecha de solicitud: {formatDate(requestDate)}
        </Typography>
        {scheduledDate && (
          <Typography variant="body2">
            Fecha programada: {formatDate(scheduledDate)}
          </Typography>
        )}

        {status <= 1 && (
          <Button
            startIcon={<AddOutlined />}
            variant="contained"
            onClick={() =>
              router.push(
                `${PageRoutes.Create_Virtual_Tour}?id=${publicId}&environmentId=${environmentId}`,
              )
            }
            sx={{ paddingLeft: 3, paddingRight: 2, marginTop: 4 }}
          >
            Añadir Recorrido Virtual
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Helpers
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("es-ES");
};

export default Tour360RequestCard;
