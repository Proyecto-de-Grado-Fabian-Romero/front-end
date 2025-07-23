import React from "react";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import { SyncOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import { Tour360Request } from "@/types/Tour360Request";
import { updateTour360Status } from "@/services/adminService";

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

const Tour360RequestsTable = ({ requests, loading }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [statusLoadingId, setStatusLoadingId] = React.useState<string | null>(null);
  const [localRequests, setLocalRequests] = React.useState<Tour360Request[]>(requests);

  React.useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const handleStatusChange = async (publicId: string, newStatus: number) => {
    setStatusLoadingId(publicId);
    try {
      await updateTour360Status(publicId, newStatus);
      setLocalRequests((prev) =>
        prev.map((req) =>
          req.publicId === publicId ? { ...req, status: newStatus } : req,
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

  if (isMobile) {
    // ✅ Vista tipo tarjeta para móviles
    return (
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        {localRequests.map((req) => (
          <Paper key={req.publicId} sx={{ p: 2 }}>
            <Typography variant="subtitle2">Ambiente</Typography>
            <Typography variant="body1" mb={1}>{req.environmentName}</Typography>

            <Typography variant="subtitle2">Estado</Typography>
            {statusLoadingId === req.publicId ? (
              <CircularProgress size={20} />
            ) : (
              <Select
                value={req.status}
                size="small"
                fullWidth
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

            <Typography variant="subtitle2" mt={2}>Fecha de Solicitud</Typography>
            <Typography variant="body1">{formatDate(req.requestDate)}</Typography>

            <Typography variant="subtitle2" mt={2}>Fecha Programada</Typography>
            <Typography variant="body1">
              {req.scheduledDate ? formatDate(req.scheduledDate) : "-"}
            </Typography>

            {req.status <= 1 && (
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() =>
                  router.push(
                    `${PageRoutes.Create_Virtual_Tour}?id=${req.publicId}&environmentId=${req.environmentId}`
                  )
                }
              >
                Añadir Recorrido
              </Button>
            )}
          </Paper>
        ))}
      </Box>
    );
  }

  // ✅ Tabla para pantallas grandes
  const columns = [
    {
      name: "environmentName",
      label: "Ambiente",
    },
    {
      name: "status",
      label: "Estado",
      options: {
        customBodyRenderLite: (dataIndex: number) => {
          const req = localRequests[dataIndex];
          return statusLoadingId === req.publicId ? (
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
          );
        },
      },
    },
    {
      name: "requestDate",
      label: "Fecha de Solicitud",
      options: {
        customBodyRender: (value: number) => formatDate(value),
      },
    },
    {
      name: "scheduledDate",
      label: "Fecha Programada",
      options: {
        customBodyRender: (value: number) => (value ? formatDate(value) : "-"),
      },
    },
    {
      name: "action",
      label: "Acción",
      options: {
        customBodyRenderLite: (dataIndex: number) => {
          const req = localRequests[dataIndex];
          return req.status <= 1 ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                router.push(
                  `${PageRoutes.Create_Virtual_Tour}?id=${req.publicId}&environmentId=${req.environmentId}`
                )
              }
            >
              Añadir Recorrido
            </Button>
          ) : null;
        },
      },
    },
  ];

  return (
    <Box sx={{ overflowX: "auto", width: "100%", marginBottom: "100px", maxWidth: "100%", overflowY: "visible"}}>
      <MUIDataTable
        title={"Solicitudes de Recorridos 360°"}
        data={localRequests}
        columns={columns}
        options={{
          selectableRows: "none",
          responsive: "scroll",
          rowsPerPage: 10,
          rowsPerPageOptions: [],
          search: false,
          download: false,
          print: false,
          viewColumns: false,
          filter: false,
          textLabels: {
            body: {
              noMatch: "No hay solicitudes encontradas.",
            },
            pagination: {
              next: "Siguiente",
              previous: "Anterior",
              rowsPerPage: "Filas por página:",
              displayRows: "de",
            },
          },
        }}
      />
    </Box>
  );
  
};

export default Tour360RequestsTable;
