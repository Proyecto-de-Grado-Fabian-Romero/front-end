import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  requestTour360,
  getLastTour360RequestDateByEnv,
} from "@/services/adminService";
import Link from "next/link";
import { PageRoutes } from "@/utils/constants/page-routes";
import EquipmentModal from "../modal/EquipmentModal";
import { DeleteForever, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  patchDeleteEnvironment,
  patchHideEnvironment,
} from "@/services/environmentService";
import { useRouter } from "next/navigation";

type OwnerEnvironmentButtonsProps = {
  envPubId: string;
  hidden?: boolean;
};

const FOUR_MONTHS = 4;

const addMonthsUtc = (unixSeconds: number, months: number) => {
  const d = new Date(unixSeconds * 1000);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  // conserva día; Date manejará overflow (fin de mes)
  const next = new Date(Date.UTC(y, m + months, day, 0, 0, 0));
  return Math.floor(next.getTime() / 1000);
};

const formatDateEs = (unixSeconds: number) => {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const OwnerEnvironmentButtons: React.FC<OwnerEnvironmentButtonsProps> = ({
  envPubId,
  hidden,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openEquipmentModal, setOpenEquipmentModal] = useState(false);

  // 🔎 Última solicitud y bloqueo
  const [lastRequestUnix, setLastRequestUnix] = useState<number | null>(null);
  const [checking, setChecking] = useState(true);

  // Dialog de restricción
  const [openDialog, setOpenDialog] = useState(false);
  const [hideDialogOpen, setHideDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [currentHidden, setCurrentHidden] = useState(false);

  useEffect(() => {
    setCurrentHidden(hidden ?? false);
  }, [hidden]);

  useEffect(() => {
    const fetchLast = async () => {
      try {
        setChecking(true);
        const last = await getLastTour360RequestDateByEnv(envPubId);
        setLastRequestUnix(last); // null si no hay
      } catch {
        // si hay error, asumimos que no hay bloqueo para no romper UX
        setLastRequestUnix(null);
      } finally {
        setChecking(false);
      }
    };
    fetchLast();
  }, [envPubId]);

  const nextEligibleUnix = useMemo(() => {
    if (!lastRequestUnix) return null;
    return addMonthsUtc(lastRequestUnix, FOUR_MONTHS);
  }, [lastRequestUnix]);

  const isBlocked = useMemo(() => {
    if (!nextEligibleUnix) return false;
    const nowUnix = Math.floor(Date.now() / 1000);
    return nowUnix < nextEligibleUnix;
  }, [nextEligibleUnix]);

  const handleRequest360Tour = async () => {
    if (isBlocked) {
      setOpenDialog(true);
      return;
    }
    setLoading(true);
    try {
      await requestTour360(envPubId, user.publicId ?? "");
      // Opcional: refrescar última fecha tras solicitar
      setLastRequestUnix(Math.floor(Date.now() / 1000));
    } catch {
      alert("No se pudo realizar la solicitud, inténtalo de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmHide = async (hide: boolean) => {
    setLoadingAction(true);
    try {
      await patchHideEnvironment(envPubId, hide);
      setHideDialogOpen(false);
      setCurrentHidden(!currentHidden);
      // optional: show toast
    } catch (err) {
      console.error(err);
      // show toast error
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoadingAction(true);
    try {
      await patchDeleteEnvironment(envPubId);
      setDeleteDialogOpen(false);
      router.replace(PageRoutes.Owner_Environments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
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
      {currentHidden && (
        <Alert severity="warning" hidden={!currentHidden}>
          Este ambiente está oculto, no se muestra a los usuarios ni puede
          recibir reservas.
        </Alert>
      )}
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

      {/* Botón solicitar 360: estilo gris cuando está bloqueado, pero clickable */}
      <Button
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <CameraAltIcon />}
        disabled={loading || checking} // solo disabled por loading o mientras consulta
        onClick={handleRequest360Tour}
        sx={{
          // “medio gris, como deshabilitado” cuando bloqueado
          opacity: isBlocked ? 0.5 : 1,
          color: isBlocked ? "#6b7280" : "inherit", // gris-500
          borderColor: isBlocked ? "#9ca3af" : "inherit", // gris-400
          pointerEvents: loading || checking ? "none" : "auto", // sigue siendo clickable si bloqueado
        }}
      >
        Solicitar captura 360
      </Button>

      <Stack direction="row" spacing={1}>
        <Tooltip
          title={currentHidden ? "Mostrar ambiente" : "Ocultar ambiente"}
          arrow
        >
          <span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setHideDialogOpen(true);
              }}
            >
              {currentHidden ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Eliminar ambiente" arrow>
          <span>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <DeleteForever />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* Dialog de restricción */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Solicitud no disponible</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Solo se puede solicitar una captura 360 cada <b>4 meses</b>.
          </Typography>
          {lastRequestUnix && nextEligibleUnix && (
            <>
              <Typography variant="body2">
                Última solicitud: <b>{formatDateEs(lastRequestUnix)}</b>
              </Typography>
              <Typography variant="body2">
                Próxima fecha habilitada:{" "}
                <b>{formatDateEs(nextEligibleUnix)}</b>
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      <EquipmentModal
        open={openEquipmentModal}
        onClose={() => setOpenEquipmentModal(false)}
        publicId={envPubId}
      />

      {/* Hide confirmation dialog */}
      <Dialog open={hideDialogOpen} onClose={() => setHideDialogOpen(false)}>
        <DialogTitle>
          {currentHidden ? "Mostrar ambiente" : "Ocultar ambiente"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres {currentHidden ? "mostrar" : "ocultar"}{" "}
            este ambiente? Esto hará que otros usuarios {!currentHidden && "no"}{" "}
            puedan verlo {!currentHidden ? "ni " : "y "}
            reservarlo.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHideDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => handleConfirmHide(!currentHidden)}
            disabled={loadingAction}
          >
            {currentHidden ? "Mostrar" : "Ocultar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Eliminar ambiente</DialogTitle>
        <DialogContent>
          <Typography>
            Esta acción marcará el ambiente como eliminado. ¿Continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={loadingAction}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerEnvironmentButtons;
