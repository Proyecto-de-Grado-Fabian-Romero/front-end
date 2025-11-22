"use client";

import React, { useState, useEffect } from "react";
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
import {
  CalendarToday,
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Save,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import { Tour360Request } from "@/types/Tour360Request";
import {
  updateTour360Schedule,
  updateTour360Status,
} from "@/services/adminService";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import Link from "next/link";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

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

const statusOptions = [
  {
    value: 0,
    label: "Pendiente",
    icon: <HourglassEmpty fontSize="small" sx={{ color: "#f57c00" }} />,
    color: "#f57c00", // naranja
  },
  {
    value: 1,
    label: "Programado",
    icon: <CalendarToday fontSize="small" sx={{ color: "#0288d1" }} />,
    color: "#0288d1", // azul
  },
  {
    value: 2,
    label: "Completado",
    icon: <CheckCircle fontSize="small" sx={{ color: "#2e7d32" }} />,
    color: "#2e7d32", // verde
  },
  {
    value: 3,
    label: "Cancelado",
    icon: <Cancel fontSize="small" sx={{ color: "#d32f2f" }} />,
    color: "#d32f2f",
  },
];

const Tour360RequestsTable = ({ requests, loading }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [localRequests, setLocalRequests] =
    useState<Tour360Request[]>(requests);

  useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const [editingDateById, setEditingDateById] = useState<
    Record<string, string>
  >({}); // yyyy-MM-dd
  const [dateSavingId, setDateSavingId] = useState<string | null>(null);

  const toUnixStartOfDayLaPaz = (yyyyMMdd: string) => {
    // La Paz = UTC-04:00 ⇒ 00:00 local = 04:00 UTC
    const [y, m, d] = yyyyMMdd.split("-").map(Number);
    return Math.floor(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 4, 0, 0) / 1000);
  };

  const handleScheduleSave = async (publicId: string) => {
    const val = editingDateById[publicId];
    if (!val) return;
    const unix = toUnixStartOfDayLaPaz(val);
    setDateSavingId(publicId);
    try {
      await updateTour360Schedule(publicId, unix);
      setLocalRequests((prev) =>
        prev.map((r) =>
          r.publicId === publicId ? { ...r, scheduledDate: unix } : r,
        ),
      );
    } catch {
      alert("No se pudo actualizar la fecha programada.");
    } finally {
      setDateSavingId(null);
      setEditingDateById((s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [publicId]: _, ...rest } = s;
        return rest;
      });
    }
  };

  const handleStatusChange = async (publicId: string, newStatus: number) => {
    setStatusLoadingId(publicId);
    try {
      await updateTour360Status(publicId, newStatus);
      setLocalRequests((prev) =>
        prev.map((req) =>
          req.publicId === publicId ? { ...req, status: newStatus } : req,
        ),
      );
    } catch {
      alert("Hubo un error al actualizar el estado.");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const minDateForReq = (req: Tour360Request) => {
    const today = moment().startOf("day");
    const requestDay = moment.unix(req.requestDate).startOf("day");
    return moment.max(today, requestDay);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        {localRequests.map((req) => (
          <Paper key={req.publicId} sx={{ p: 2 }}>
            <Typography variant="subtitle2">Ambiente</Typography>
            <Typography variant="body1" mb={1}>
              {req.environmentName}
            </Typography>

            <Typography variant="subtitle2">Estado</Typography>
            {statusLoadingId === req.publicId ? (
              <CircularProgress size={20} />
            ) : (
              <Select
                value={req.status}
                size="small"
                fullWidth
                onChange={(e) =>
                  handleStatusChange(req.publicId, Number(e.target.value))
                }
                renderValue={(selected) => {
                  const option = statusOptions.find(
                    (opt) => opt.value === selected,
                  );
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      {option?.icon}
                      <Typography sx={{ color: option?.color }}>
                        {option?.label}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {option.icon}
                      <Typography sx={{ color: option.color }}>
                        {option.label}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            )}

            <Typography variant="subtitle2" mt={2}>
              Fecha de Solicitud
            </Typography>
            <Typography variant="body1">
              {formatDate(req.requestDate)}
            </Typography>

            <Typography variant="subtitle2" mt={2}>
              Fecha Programada
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="es"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ flex: 1.2 }}>
                    <DatePicker
                      label="Seleccionar fecha"
                      value={
                        editingDateById[req.publicId]
                          ? moment(editingDateById[req.publicId])
                          : req.scheduledDate
                            ? moment.unix(req.scheduledDate)
                            : null
                      }
                      onChange={(newValue) => {
                        if (newValue) {
                          setEditingDateById((s) => ({
                            ...s,
                            [req.publicId]: newValue
                              .startOf("day")
                              .format("YYYY-MM-DD"),
                          }));
                        }
                      }}
                      disablePast
                      minDate={moment.max(
                        moment().startOf("day"),
                        moment.unix(req.requestDate).startOf("day"),
                      )}
                      disabled={req.status === 2 || req.status === 3} // 2 = Completado, 3 = Cancelado
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </Box>

                  {editingDateById[req.publicId] && (
                    <Button
                      sx={{ flex: 0.7 }}
                      variant="outlined"
                      size="small"
                      disabled={
                        !editingDateById[req.publicId] ||
                        dateSavingId === req.publicId
                      }
                      onClick={() => handleScheduleSave(req.publicId)}
                      startIcon={
                        dateSavingId === req.publicId ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Save fontSize="small" />
                        )
                      }
                    >
                      Guardar
                    </Button>
                  )}
                </Box>
              </LocalizationProvider>
            </Box>

            {req.status <= 1 && (
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() =>
                  router.push(
                    `${PageRoutes.Create_Virtual_Tour}?id=${req.publicId}&environmentId=${req.environmentId}`,
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

  const columns: MRT_ColumnDef<Tour360Request>[] = [
    {
      header: "Ambiente",
      accessorKey: "environmentName",
      Cell: ({ row }) => {
        const name = row.original.environmentName;
        const id = row.original.environmentId;

        return (
          <Link
            href={`${PageRoutes.Environment_Details}/${id}`}
            style={{ color: "#000", textDecoration: "underline" }}
            target="_blank"
          >
            {name}
          </Link>
        );
      },
    },
    {
      header: "Estado",
      accessorKey: "status",
      Cell: ({ row }) => {
        const req = row.original;
        return statusLoadingId === req.publicId ? (
          <CircularProgress size={24} />
        ) : (
          <Select
            value={req.status}
            size="small"
            fullWidth
            onChange={(e) =>
              handleStatusChange(req.publicId, Number(e.target.value))
            }
            renderValue={(selected) => {
              const option = statusOptions.find(
                (opt) => opt.value === selected,
              );
              return (
                <Box display="flex" alignItems="center" gap={1}>
                  {option?.icon}
                  <Typography sx={{ color: option?.color }}>
                    {option?.label}
                  </Typography>
                </Box>
              );
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  {option.icon}
                  <Typography sx={{ color: option.color }}>
                    {option.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      header: "Fecha de Solicitud",
      accessorKey: "requestDate",
      Cell: ({ cell }) => formatDate(cell.getValue<number>()),
    },
    {
      header: "Fecha Programada",
      accessorKey: "scheduledDate",
      Cell: ({ row }) => {
        const req = row.original;
        const currentValue = req.scheduledDate
          ? moment.unix(req.scheduledDate)
          : null;

        const minDate = minDateForReq(req);
        const selectedDate = editingDateById[req.publicId]
          ? moment(editingDateById[req.publicId])
          : currentValue;

        return (
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ flex: 1 }}>
                <DatePicker
                  label="Seleccionar fecha"
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue)
                      setEditingDateById((s) => ({
                        ...s,
                        [req.publicId]: newValue
                          .startOf("day")
                          .format("YYYY-MM-DD"),
                      }));
                  }}
                  disablePast
                  minDate={minDate}
                  disabled={req.status === 2 || req.status === 3} // 2=Completado,3=Cancelado
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                />
              </Box>

              {editingDateById[req.publicId] && (
                <Button
                  sx={{ flex: 0.5 }}
                  variant="outlined"
                  size="small"
                  disabled={
                    !editingDateById[req.publicId] ||
                    dateSavingId === req.publicId
                  }
                  onClick={() => handleScheduleSave(req.publicId)}
                  startIcon={
                    dateSavingId === req.publicId ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Save fontSize="small" />
                    )
                  }
                >
                  Guardar
                </Button>
              )}
            </Box>
          </LocalizationProvider>
        );
      },
    },
    {
      header: "Acción",
      Cell: ({ row }) => {
        const req = row.original;
        return req.status <= 1 ? (
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              router.push(
                `${PageRoutes.Create_Virtual_Tour}?id=${req.publicId}&environmentId=${req.environmentId}`,
              )
            }
          >
            Añadir Recorrido
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <Box sx={{ mt: 4, width: "100%" }}>
      <MaterialReactTable
        columns={columns}
        data={localRequests}
        enablePagination
        manualPagination
        rowCount={localRequests.length}
        pageCount={Math.ceil(localRequests.length / 10)}
        muiPaginationProps={{
          rowsPerPageOptions: [10],
        }}
        localization={{
          noRecordsToDisplay: "No hay solicitudes encontradas.",
        }}
      />
    </Box>
  );
};

export default Tour360RequestsTable;
