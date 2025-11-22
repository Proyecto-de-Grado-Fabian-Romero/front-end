"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  Box,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

interface PaymentModalProps {
  open: boolean;
  paymentUrl: string | null;
  reservationId: string;
  environmentPublicId: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: () => void;
}

const FIFTEEN_MINUTES = 15 * 60; // segundos

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  paymentUrl,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const router = useRouter();

  const countdownRef = useRef<number>(FIFTEEN_MINUTES);
  const countdownTimerRef = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const urlCheckRef = useRef<number | null>(null);
  const lastUrlRef = useRef<string>("");

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  // Función para verificar la URL del iframe
  const checkIframeUrl = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const currentUrl = iframe.contentWindow?.location.href;
      if (currentUrl && currentUrl !== lastUrlRef.current) {
        lastUrlRef.current = currentUrl;

        if (
          /success|approved|confirmado|status=success|payment_id|pago_exitoso/i.test(
            currentUrl,
          )
        ) {
          onPaymentConfirmed();
        }

        if (
          /failure|failed|error|cancel|rejected|fallo|pago_fallido/i.test(
            currentUrl,
          )
        ) {
          onClose();
          onPaymentFailure?.();
        }
      }
    } catch {}
  };

  const startUrlPolling = () => {
    if (urlCheckRef.current) {
      clearInterval(urlCheckRef.current);
    }
    urlCheckRef.current = window.setInterval(checkIframeUrl, 1000);
  };

  const stopUrlPolling = () => {
    if (urlCheckRef.current) {
      clearInterval(urlCheckRef.current);
      urlCheckRef.current = null;
    }
  };

  const handleCloseAttempt = () => {
    setConfirmCloseOpen(true);
  };

  const handleCloseConfirmed = async () => {
    stopUrlPolling();
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
    }
    setConfirmCloseOpen(false);
    onClose();
    onPaymentFailure?.();
  };

  const handleCancelClose = () => {
    setConfirmCloseOpen(false);
  };

  useEffect(() => {
    return () => {
      stopUrlPolling();
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("message", handlePostMessage as any);
    };
  }, []);

  const startCountdown = () => {
    countdownRef.current = FIFTEEN_MINUTES;
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
    }
    countdownTimerRef.current = window.setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        if (countdownTimerRef.current) {
          window.clearInterval(countdownTimerRef.current);
        }
        handlePaymentTimeout();
      }
    }, 1000);
  };

  const handlePaymentTimeout = () => {
    stopUrlPolling();
    onClose();
    onPaymentFailure?.();
  };

  const handlePostMessage = (event: MessageEvent) => {
    try {
      const data = event.data;
      if (!data) return;

      console.log("Mensaje recibido:", data);

      if (data.paymentStatus === "success" || data.status === "approved") {
        console.log("✅ Pago exitoso por postMessage");
        onPaymentConfirmed();
      } else if (data.paymentStatus === "failure" || data.status === "failed") {
        console.log("❌ Pago fallido por postMessage");
        onClose();
        onPaymentFailure?.();
      }
    } catch {}
  };

  useEffect(() => {
    if (open && paymentUrl) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.addEventListener("message", handlePostMessage as any);
      startCountdown();
      // Esperar un poco para que el iframe cargue antes de empezar el polling
      setTimeout(() => {
        startUrlPolling();
      }, 2000);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("message", handlePostMessage as any);
      stopUrlPolling();
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
      }
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("message", handlePostMessage as any);
      stopUrlPolling();
    };
  }, [open, paymentUrl]);

  const onPaymentConfirmed = () => {
    stopUrlPolling();
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
    }
    setPaymentSuccess(true);
    onPaymentSuccess?.();
  };

  const handleIframeLoad = () => {
    console.log("Iframe cargado");
    setTimeout(checkIframeUrl, 1000);
  };

  const handleAcceptAfterSuccess = () => {
    onClose();
    router.push(PageRoutes.Booking);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleCloseAttempt}
        PaperProps={{
          sx: { backgroundColor: "transparent", boxShadow: "none" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6">Completa tu pago</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton aria-label="close" onClick={handleCloseAttempt}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Por favor, no abandones la página mientras dure el proceso de pago.
            El sistema reservará temporalmente tu espacio por 15 minutos.
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{ height: "calc(100vh - 64px)", p: 0, position: "relative" }}
        >
          {paymentUrl && (
            <iframe
              ref={iframeRef}
              src={paymentUrl}
              title="Pago"
              onLoad={handleIframeLoad}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                position: "relative",
                zIndex: 1,
              }}
            />
          )}

          {paymentSuccess && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 6,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                sx={{ maxWidth: 400, textAlign: "center" }}
              >
                <Alert severity="success" sx={{ width: "100%" }}>
                  ¡Pago confirmado exitosamente!
                </Alert>
                <Typography>
                  Tu reserva ha sido confirmada y el pago procesado
                  correctamente.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleAcceptAfterSuccess}
                  size="large"
                >
                  Ver mis reservas
                </Button>
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCloseOpen} onClose={handleCancelClose}>
        <DialogTitle>¿Salir y cancelar el pago?</DialogTitle>
        <DialogContent>
          <Typography>
            Al salir ahora, el pago no se confirmará y la reserva no quedará
            confirmada. ¿Deseas continuar y salir?
          </Typography>
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, p: 2 }}>
          <Button onClick={handleCancelClose}>Volver al pago</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleCloseConfirmed}
          >
            Salir y cancelar
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default PaymentModal;
