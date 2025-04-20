"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Email, Lock, ArrowBack, ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { ColorPalette } from "@/utils/constants/ui-constants";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/services/authService";

export default function LogInForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Correo electrónico inválido.");
      setLoading(false);
      return;
    }

    try {
      const userData = await loginRequest(email, password);
      dispatch(setUser(userData));
      router.back();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <ArrowBack sx={{ cursor: "pointer" }} />
      <Typography variant="h5" fontWeight="bold">
        Bienvenid@ a
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <Image
          src="/images/logo.png"
          alt="Spacio logo"
          width={30}
          height={30}
        />
        <Typography variant="h4" fontWeight="bold">
          SPACIO
        </Typography>
      </Box>
      <Typography variant="subtitle1">
        Encuentra el ambiente ideal para ti
      </Typography>

      <TextField
        label="Correo electrónico"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Contraseña"
        variant="outlined"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
        }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Link href="#" style={{ color: ColorPalette.SECONDARY_DEFAULT }}>
        ¿Olvidaste tu contraseña?
      </Link>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1, backgroundColor: "black", color: "white", py: 1.5 }}
        endIcon={<ArrowForward />}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Iniciar Sesión"
        )}
      </Button>

      <Typography variant="body1">
        ¿No tienes una cuenta?{" "}
        <Link
          href="#"
          color="error"
          style={{
            color: ColorPalette.PRIMARY_DEFAULT,
            fontWeight: "bold",
          }}
        >
          Regístrate
        </Link>
      </Typography>
    </Box>
  );
}
