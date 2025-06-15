import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Tour360Request } from "@/types/Tour360Request";
import { SyncOutlined } from "@mui/icons-material";
import { updateTour360Status } from "@/services/adminService";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("es-ES");
};

type Props = {
  requests: Tour360Request[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
};

const Tour360RequestsTable = ({
  requests,
  loading,
  page,
  totalPages,
  onPageChange,
}: Props) => {
  const router = useRouter();

  const [localRequests, setLocalRequests] =
    useState<Tour360Request[]>(requests);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (publicId: string, newStatus: number) => {
    setStatusLoadingId(publicId);
    try {
      await updateTour360Status(publicId, newStatus);

      setLocalRequests((prev) =>
        prev.map((req) =>
          req.publicId === publicId ? { ...req, status: newStatus } : req
        )
      );
    } catch {
      alert("Hubo un error al actualizar el estado.");
    } finally {
      setStatusLoadingId(null);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (localRequests.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" gutterBottom>
          No hay solicitudes encontradas.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ambiente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Solicitud</TableCell>
              <TableCell>Fecha Programada</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localRequests.map((req) => (
              <TableRow key={req.publicId}>
                <TableCell>{req.environmentName}</TableCell>
                <TableCell>
                  {statusLoadingId === req.publicId ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Select
                      value={req.status}
                      size="small"
                      startAdornment={<SyncOutlined fontSize="small" />}
                      onChange={(e) =>
                        handleStatusChange(req.publicId, Number(e.target.value))
                      }
                    >
                      <MenuItem value={0}>Pendiente</MenuItem>
                      <MenuItem value={1}>Programado</MenuItem>
                      <MenuItem value={2}>Completado</MenuItem>
                      <MenuItem value={3}>Cancelado</MenuItem>
                    </Select>
                  )}
                </TableCell>
                <TableCell>{formatDate(req.requestDate)}</TableCell>
                <TableCell>
                  {req.scheduledDate ? formatDate(req.scheduledDate) : "-"}
                </TableCell>
                <TableCell>
                  {req.status <= 1 && (
                    <Button
                      variant="outlined"
                      onClick={() =>
                        router.push(
                          `${PageRoutes.Create_Virtual_Tour}?id=${req.publicId}&environmentId=${req.environmentId}`
                        )
                      }
                    >
                      Añadir Recorrido
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => onPageChange(val)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
};

export default Tour360RequestsTable;
