"use client";

import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmRestorePassword,
  sendRestoreCode,
} from "@/services/authService";
import { validatePassword } from "@/utils/methods/validations";
import PasswordField from "../inputs/field/PasswordField";
import Image from "next/image";
import { PageRoutes } from "@/utils/constants/page-routes";

const RestorePasswordClient = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleEnviarCodigo = async () => {
    setLoading(true);
    setError(null);
    setMensaje(null);

    try {
      await sendRestoreCode(email);
      setMensaje("Te hemos enviado un código a tu correo.");
      setStep(2);
    } catch {
      setError("No se pudo enviar el código. Verifica el correo.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarRestablecimiento = async () => {
    setLoading(true);
    setError(null);
    setMensaje(null);

    if (!validatePassword(newPassword)) {
      setError(
        "La contraseña debe tener al menos 6 caracteres, con una mayúscula, minúscula, número y carácter especial.",
      );
      setLoading(false);
      return;
    }

    try {
      await confirmRestorePassword(email, code, newPassword);
      setMensaje("Contraseña restablecida con éxito. Puedes iniciar sesión.");
      setTimeout(() => router.push(PageRoutes.LogIn), 2000);
    } catch {
      setError(
        "El código es inválido o la contraseña no cumple los requisitos.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setLoading(true);
    setError(null);
    setMensaje(null);
    try {
      await sendRestoreCode(email);
      setMensaje("Código reenviado correctamente.");
    } catch {
      setError("No se pudo reenviar el código. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={"center"}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1) {
          handleEnviarCodigo();
        } else {
          handleConfirmarRestablecimiento();
        }
      }}
      sx={{ mt: 8, maxWidth: 400, mx: "auto", width: "100%" }}
      gap={2}
    >
      <Image
        src={
          step === 2
            ? "/images/illustrations/changepassword.svg"
            : "/images/illustrations/sendcode.svg"
        }
        alt="Illustration"
        width={200}
        height={200}
      />
      <Typography variant="h5" fontWeight="bold" textAlign="center">
        {step === 2 ? "Nueva Contraseña" : "Restablecer Contraseña"}
      </Typography>

      <Typography variant="body2" color="text.secondary" textAlign="center">
        {step === 2
          ? "Introduce el correo electrónico de tu cuenta de Spacio para restablecer tu contraseña."
          : "Ingresa tu correo y te enviaremos un código para restablecer tu contraseña."}
      </Typography>

      {step === 1 && (
        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      {step === 2 && (
        <>
          <TextField
            label="Código de confirmación"
            fullWidth
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <PasswordField
            label="Nueva contraseña"
            value={newPassword}
            onChange={setNewPassword}
          />
          <Button
            variant="text"
            onClick={handleReenviarCodigo}
            disabled={loading || !email}
          >
            Reenviar código
          </Button>
        </>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      {mensaje && <Alert severity="success">{mensaje}</Alert>}

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={loading || !email || (step === 2 && (!code || !newPassword))}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : step === 1 ? (
          "Enviar código"
        ) : (
          "Confirmar cambio"
        )}
      </Button>
    </Box>
  );
};

export default RestorePasswordClient;
