"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  IconButton,
  Stack,
  Divider,
  TextField,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PaidIcon from "@mui/icons-material/Paid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  getDebts,
  getDebtDetails,
  markDebtAsPaid,
} from "@/services/adminService";
import { getUserByPublicId, type UserDTO } from "@/services/authService";
import { type AdminDebt } from "@/types/Payments";

// ---------- Modal Mejorado ----------
const DebtDetailsModal = ({
  open,
  onClose,
  debtId,
}: {
  open: boolean;
  onClose: () => void;
  debtId: string | null;
}) => {
  const [debt, setDebt] = useState<AdminDebt | null>(null);
  const [owner, setOwner] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      if (!open || !debtId) return;
      setLoading(true);
      setOwner(null);
      setDebt(null);
      try {
        const d = await getDebtDetails(debtId);
        setDebt(d);
        // Intentar resolver el publicId del owner
        const possiblePublicId =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d as any).ownerPublicId ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d as any).ownerId ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d as any).owner?.publicId;
        if (possiblePublicId) {
          const u = await getUserByPublicId(
            String(possiblePublicId),
            abort.signal,
          );
          setOwner(u);
        }
      } catch {
        alert("Hubo un error obteniendo los detalles. Recarga la página.");
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [open, debtId]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
  };

  const handleMarkAsPaid = async () => {
    if (!debtId) return;
    if (!paymentReference.trim()) {
      alert("Ingresa una referencia de pago.");
      return;
    }
    try {
      setSubmitting(true);
      await markDebtAsPaid(debtId, paymentReference.trim());
      alert("Deuda marcada como pagada y el pago registrado.");
      onClose();
      setPaymentReference("");
    } catch {
      alert("Error al marcar la deuda como pagada.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: open ? "flex" : "none",
        position: "fixed",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.4)",
        zIndex: 1300,
        p: 2,
      }}
      onClick={onClose}
    >
      <Paper
        onClick={(e) => e.stopPropagation()}
        elevation={8}
        sx={{
          position: "relative",
          width: "min(720px, 96vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 4,
          p: 3,
        }}
      >
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            py={6}
          >
            <CircularProgress />
          </Box>
        ) : !debt ? (
          <Typography>No se encontró la deuda.</Typography>
        ) : (
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <InfoOutlinedIcon />
              <Typography variant="h6">Detalles de la Deuda</Typography>
            </Box>

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Propietario
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {owner?.name || debt.ownerName || "—"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Stack flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Monto a Pagar
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {`Bs. ${Number(debt.totalAmount).toFixed(2)}`}
                </Typography>
              </Stack>
              <Stack flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Actualización
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {new Date(debt.updatedAt).toLocaleDateString()}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            {/* Datos bancarios del propietario */}
            <Stack spacing={1}>
              <Typography variant="subtitle1">
                Datos bancarios del propietario
              </Typography>
              {owner?.bankPaymentData ? (
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Titular de la cuenta
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {owner.bankPaymentData.bankAccountHolder}
                        </Typography>
                      </Box>
                      <IconButton
                        aria-label="Copiar titular"
                        onClick={() =>
                          handleCopy(owner.bankPaymentData!.bankAccountHolder)
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Número de cuenta
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {owner.bankPaymentData.bankAccountNumber}
                        </Typography>
                      </Box>
                      <IconButton
                        aria-label="Copiar número de cuenta"
                        onClick={() =>
                          handleCopy(owner.bankPaymentData!.bankAccountNumber)
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Banco
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {owner.bankPaymentData.bankName}
                    </Typography>
                    {/* NOTA: sin botón de copiar para el nombre del banco */}
                  </Box>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  El propietario no tiene datos bancarios registrados.
                </Typography>
              )}
            </Stack>

            <Divider />

            {/* Marcar como pagado (incluido en el modal) */}
            <Stack spacing={2}>
              <Typography variant="subtitle1">Marcar como pagado</Typography>
              <TextField
                label="Referencia de pago"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Ej: Transferencia #ABC123"
                fullWidth
              />
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<PaidIcon />}
                  onClick={handleMarkAsPaid}
                  disabled={submitting}
                >
                  Guardar y marcar como pagado
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Cancelar
                </Button>
              </Box>
            </Stack>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

// ---------- Fila como componente ----------
const DebtRow = ({
  debt,
  onOpenDetails,
}: {
  debt: AdminDebt;
  onOpenDetails: (id: string) => void;
}) => {
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const ownerPublicId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (debt as any).ownerPublicId || (debt as any).ownerId || null;

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      // Si ya viene el nombre, úsalo; si no, consulta por publicId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((debt as any).ownerName) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOwnerName((debt as any).ownerName);
        return;
      }
      if (!ownerPublicId) return;
      try {
        const u = await getUserByPublicId(String(ownerPublicId), abort.signal);
        setOwnerName(u.name);
      } catch {
        setOwnerName(null);
      }
    };
    run();
    return () => abort.abort();
  }, [ownerPublicId, debt]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr auto",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary">
          Propietario
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {ownerName ?? "—"}
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Monto a pagar
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {"Bs. " + Number(debt.totalAmount).toFixed(2)}
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Actualizado
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {new Date(debt.updatedAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          onClick={() => onOpenDetails(debt.id as unknown as string)}
        >
          Ver detalles
        </Button>
      </Box>
    </Paper>
  );
};

// ---------- Pantalla principal ----------
const AdminDebtsClient = () => {
  const [debts, setDebts] = useState<AdminDebt[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0); // 0-index UI, API usa 1-index
  const pageSize = 20;

  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems],
  );

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        setLoading(true);
        const data = await getDebts(page + 1, pageSize);
        setDebts(data.items);
        setTotalItems(data.totalItems);
      } catch {
        alert("Hubo un error obteniendo las deudas");
      } finally {
        setLoading(false);
      }
    };
    fetchDebts();
  }, [page]);

  const openDetails = (id: string) => {
    setSelectedDebtId(id);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedDebtId(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4, width: "100%" }}>
      <Typography variant="h5" mb={2}>
        Deudas Pendientes
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Cargando deudas...</Typography>
        </Box>
      ) : debts.length === 0 ? (
        <Typography color="text.secondary">
          No hay deudas pendientes.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {debts.map((debt) => (
            <DebtRow
              key={String(debt.id)}
              debt={debt}
              onOpenDetails={openDetails}
            />
          ))}

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={pageCount}
              page={page + 1}
              onChange={(_, p) => setPage(p - 1)}
              color="primary"
            />
          </Box>
        </Stack>
      )}

      <DebtDetailsModal
        open={detailsOpen}
        onClose={closeDetails}
        debtId={selectedDebtId}
      />
    </Paper>
  );
};

export default AdminDebtsClient;
