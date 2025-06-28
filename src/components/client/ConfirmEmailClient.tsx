"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { confirmSignUp, resendConfirmationCode } from "@/services/authService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserType } from "@/utils/constants/user-constants";
import { PageRoutes } from "@/utils/constants/page-routes";
import Image from "next/image";

const ConfirmEmailClient: React.FC = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const role = useSelector((state: RootState) => state.user.role);

  const userType: UserType =
    (role?.toLowerCase() as UserType) || UserType.UNLOGGED;

  useEffect(() => {
    if (userType !== UserType.UNLOGGED) router.replace("/");
  }, [userType, router]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) setEmail(storedEmail);
    else router.replace(PageRoutes.LogIn);
  }, []);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await confirmSignUp(email, code);
      setSuccess(
        "Correo confirmado exitosamente. Ahora puedes iniciar sesión."
      );
      localStorage.removeItem("pendingEmail");
      setTimeout(() => router.push(PageRoutes.LogIn), 2000);
    } catch (err) {
      setError("Código incorrecto. Por favor, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await resendConfirmationCode(email);
      setSuccess("Código reenviado correctamente. Revisa tu correo.");
    } catch {
      setError("Error al reenviar el código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ marginTop: 8 }}>
      <ArrowBack sx={{ cursor: "pointer" }} onClick={() => router.back()} />

      <Box
        display="flex"
        component="form"
        onSubmit={handleConfirm}
        flexDirection="column"
        gap={2}
        alignItems="center"
      >
        <Typography variant="h5" fontWeight="bold">
          Confirmar Correo Electrónico
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 2,
            maxWidth: 480,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          Te hemos enviado un código de confirmación a tu correo electrónico.
          Por favor, ingresa el código aquí para verificar tu cuenta. Si no
          recibiste el código, puedes solicitar que te lo reenviemos.
        </Typography>

        <Image
          src="/images/illustrations/confirm.svg"
          alt="Illustration"
          width={300}
          height={300}
        />

        <TextField
          label="Código de Confirmación"
          variant="outlined"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          inputProps={{ maxLength: 6, marginTop: 24 }}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          endIcon={<ArrowForward />}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Confirmar"
          )}
        </Button>

        <Button
          variant="text"
          color="primary"
          onClick={handleResendCode}
          disabled={!email || loading}
        >
          Reenviar código
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmEmailClient;
