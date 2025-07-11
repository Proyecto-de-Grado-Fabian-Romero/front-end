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
import { Email, ArrowBack, ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { ColorPalette } from "@/utils/constants/ui-constants";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/services/authService";
import { PageRoutes } from "@/utils/constants/page-routes";
import PasswordField from "@/components/inputs/field/PasswordField";

export default function LogInForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      if (!userData.verifiedEmail) {
        setError(
          "Por favor, confirma tu correo electrónico para completar el registro.",
        );
        router.push(`${PageRoutes.ConfirmEmail}?error=account-not-verified`);
        return;
      }

      router.back();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.message === "UserNotConfirmed") {
        setError(
          "Tu cuenta no está confirmada. Por favor, revisa tu correo electrónico.",
        );
        router.push(`${PageRoutes.ConfirmEmail}?error=account-not-verified`);
      } else {
        setError(err.message || "Credenciales inválidas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      component={"form"}
      onSubmit={handleLogin}
      flexDirection="column"
      gap={2}
    >
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
      <PasswordField
        label="Contraseña"
        value={password}
        onChange={(val) => setPassword(val)}
        required
        name="password"
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Link
        href={PageRoutes.RestorePassword}
        style={{ color: ColorPalette.SECONDARY_DEFAULT }}
      >
        ¿Olvidaste tu contraseña?
      </Link>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1, backgroundColor: "black", color: "white", py: 1.5 }}
        endIcon={<ArrowForward />}
        type="submit"
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
          href={PageRoutes.SignUp}
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
