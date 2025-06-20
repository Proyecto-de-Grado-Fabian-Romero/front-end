"use client";
import { Box, Button, Stack, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import { UserRole, UserState as User } from "@/types/Users";
import RentPromptSection from "@/sections/home/RentPromptSection";

interface Props {
  user: User;
  onEditBankData: () => void;
}

export default function ProfileSidebarActions({ user, onEditBankData }: Props) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width:900px)");

  if (!isDesktop) return null;

  return (
    <Box sx={{ minWidth: 240, pl: 4 }}>
      <Stack spacing={2}>
        {user.role === UserRole.Owner && (
          <>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push(PageRoutes.Incomes)}
            >
              Ver Ingresos
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push(PageRoutes.Received_Payments)}
            >
              Ver Pagos Recibidos
            </Button>
            <Button variant="outlined" fullWidth onClick={onEditBankData}>
              Editar datos bancarios
            </Button>
          </>
        )}

        {user.role === UserRole.User && (
          <Box>
            <RentPromptSection onClick={onEditBankData} />
          </Box>
        )}

        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/profile/security")}
        >
          Seguridad
        </Button>
      </Stack>
    </Box>
  );
}
