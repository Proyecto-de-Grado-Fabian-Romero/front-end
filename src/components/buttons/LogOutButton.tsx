"use client";

import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/services/authService";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutRequest(dispatch);
      router.push("/");
    } catch {
      alert("No se pudo cerrar sesión, intenta de nuevo.");
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleLogout}
      sx={{ mt: 3, borderColor: "red" }}
      style={{ borderColor: "red", color: "red" }}
    >
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton;
