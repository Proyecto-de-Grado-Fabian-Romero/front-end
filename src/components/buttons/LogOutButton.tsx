"use client";

import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/services/authService";
import { setUser } from "@/store/slices/userSlice";
import { deleteFcmToken } from "@/services/notificationsService";
import { RootState } from "@/store";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await deleteFcmToken(user.publicId ?? "");
      await logoutRequest(dispatch);
      dispatch(setUser(null));
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
