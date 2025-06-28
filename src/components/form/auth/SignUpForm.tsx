import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Box,
  InputAdornment,
} from "@mui/material";
import { signUpUser } from "@/services/authService";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/methods/validations";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import Link from "next/link";
import { ColorPalette } from "@/utils/constants/ui-constants";
import Image from "next/image";
import { Email, Lock, Person, Phone } from "@mui/icons-material";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleBlur = (field: string) => {
    setError((prev) => ({
      ...prev,
      [field]:
        field === "email" && !validateEmail(email)
          ? "Correo inválido"
          : field === "password" && !validatePassword(password)
            ? "Debe tener al menos 6 caracteres, con mayúscula, minúscula, número y un caracter (como .,*)"
            : field === "name" && !validateName(name)
              ? "Debe tener al menos 3 caracteres"
              : field === "phone" && !validatePhone(phone)
                ? "Teléfono inválido"
                : "",
    }));
  };

  const handleFocus = (field: string) => {
    setError((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !validateEmail(email) ||
      !validatePhone(phone) ||
      !validatePassword(password) ||
      !validateName(name)
    ) {
      setError({
        email: !validateEmail(email)
          ? "Por favor, ingrese un correo válido."
          : "",
        phone: !validatePhone(phone)
          ? "Por favor, ingrese un teléfono válido (mínimo 8 números)."
          : "",
        password: !validatePassword(password)
          ? "La contraseña debe tener al menos 6 caracteres, con mayúscula, minúscula y un número."
          : "",
        name: !validateName(name)
          ? "El nombre debe tener al menos 3 caracteres."
          : "",
      });
      return;
    }

    try {
      await signUpUser(email, password, name, phone);
      setSuccess(
        "¡Cuenta creada correctamente! Por favor, revise su correo electrónico para confirmar."
      );
      localStorage.setItem("pendingEmail", email);
      router.push(PageRoutes.ConfirmEmail);
    } catch {
      setError({ general: "No se pudo crear tu cuenta, intenta de nuevo" });
    }
  };

  const isFormValid =
    validateEmail(email) &&
    validatePhone(phone) &&
    validatePassword(password) &&
    validateName(name);

  return (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 8,
      }}
    >
      <Typography variant="h5">Crea tu Cuenta</Typography>
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
      <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 8 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nombre"
              variant="outlined"
              placeholder="Eg: Jhon Doe"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={!!error.name}
              helperText={error.name || ""}
              onBlur={() => handleBlur("name")}
              onFocus={() => handleFocus("name")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Teléfono"
              variant="outlined"
              placeholder="Eg: 76543218"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              error={!!error.phone}
              helperText={error.phone || ""}
              onBlur={() => handleBlur("phone")}
              onFocus={() => handleFocus("phone")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Eg: usuario@spacio.com"
              required
              error={!!error.email}
              helperText={error.email || ""}
              onBlur={() => handleBlur("email")}
              onFocus={() => handleFocus("email")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              placeholder="Introduce una contraseña"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!!error.password}
              helperText={error.password || ""}
              onBlur={() => handleBlur("password")}
              onFocus={() => handleFocus("password")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={!isFormValid}
            >
              Registrarse
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="body1">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href={PageRoutes.LogIn}
          color="error"
          style={{
            color: ColorPalette.PRIMARY_DEFAULT,
            fontWeight: "bold",
          }}
        >
          Inicia Sesión
        </Link>
      </Typography>
      {error.general && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error.general}
        </Typography>
      )}
      {success && (
        <Typography color="success" sx={{ marginTop: 2 }}>
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default SignUpForm;
