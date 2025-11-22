"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  LinearProgress,
  Pagination,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  listNotifications,
  markAllNotificationsRead,
  clearAllNotifications,
  type NotificationDto,
  type PagedResponse,
} from "@/services/notificationsService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PageRoutes } from "@/utils/constants/page-routes";
import moment from "moment";
import { DeleteForeverOutlined } from "@mui/icons-material";

export default function NotificationsClient() {
  const user = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PagedResponse<NotificationDto> | null>(null);

  // reload toggle to force refetch after clearing
  const [reloadToggle, setReloadToggle] = useState<boolean>(false);

  // dialog + snackbar state for clear-all
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!user.publicId) {
        setError("No se encontró el publicId en cookies.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const resp = await listNotifications(user.publicId, page, pageSize);
        if (isMounted) setData(resp);
        await markAllNotificationsRead(user.publicId);
      } catch (e) {
        if (isMounted) setError((e as Error).message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user.publicId, page, pageSize, reloadToggle]);

  const totalPages = useMemo(
    () =>
      Math.max(1, Math.ceil((data?.total ?? 0) / (data?.pageSize ?? pageSize))),
    [data, pageSize],
  );

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const goToTarget = (n: NotificationDto) => {
    const haystack = normalize(`${n.title} ${n.message}`);

    if (haystack.includes("reserva")) {
      router.push(PageRoutes.Booking);
      return;
    }
    if (haystack.includes("recorrido")) {
      router.push(PageRoutes.Owner_Environments);
      return;
    }
    if (
      haystack.includes("pago recibido") ||
      haystack.includes("pagos recibidos")
    ) {
      router.push(PageRoutes.Received_Payments);
      return;
    }
  };

  const handleCardClick = (n: NotificationDto) => (e: MouseEvent) => {
    e.preventDefault();
    goToTarget(n);
  };

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);

  const handleClearAll = async () => {
    if (!user.publicId) {
      setFeedback({ type: "error", message: "Usuario no disponible." });
      setConfirmOpen(false);
      return;
    }
    setClearing(true);
    try {
      const deleted = await clearAllNotifications(user.publicId);
      setFeedback({
        type: "success",
        message: `${deleted} notificaciones eliminadas.`,
      });
      // trigger refetch
      setReloadToggle((v) => !v);
      setPage(1);
    } catch (e) {
      console.error(e);
      setFeedback({
        type: "error",
        message: "Error al eliminar notificaciones.",
      });
    } finally {
      setClearing(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" fontWeight={700} mt={4}>
          Notificaciones
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Borrar todas las notificaciones">
            <span>
              <Button
                variant="outlined"
                color="error"
                startIcon={
                  clearing ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <DeleteForeverOutlined />
                  )
                }
                onClick={handleOpenConfirm}
                disabled={clearing || loading || !data || data.total === 0}
                sx={{ marginTop: 4 }}
              >
                {clearing ? "Eliminando..." : "Borrar todas"}
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {error && (
        <Card
          sx={{
            borderColor: "error.main",
            borderWidth: 1,
            borderStyle: "solid",
            mb: 2,
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" color="error">
              Error al cargar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data?.items?.length === 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1">
              No tienes notificaciones aún.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack spacing={2}>
        {data?.items.map((n) => {
          const created = new Date(n.createdAt);
          const createdLabel = moment(created)
            .locale("es")
            .format("D [de] MMMM [de] YYYY, HH:mm");

          return (
            <Card
              key={n.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor:
                  n.status !== "Read"
                    ? "rgba(242,79,19,0.04)"
                    : "background.paper",
              }}
            >
              <CardActionArea onClick={handleCardClick(n)}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 1 }}
                  >
                    <Stack>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 0.5 }}
                      >
                        {n.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {n.message}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption" color="text.secondary">
                      {createdLabel}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar todas las notificaciones? Esta
            acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={clearing}>
            Cancelar
          </Button>
          <Button
            color="error"
            onClick={handleClearAll}
            disabled={clearing}
            startIcon={clearing ? <CircularProgress size={18} /> : undefined}
          >
            {clearing ? "Eliminando..." : "Eliminar todas"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={!!feedback}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {feedback ? (
          <Alert
            onClose={() => setFeedback(null)}
            severity={feedback.type}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
