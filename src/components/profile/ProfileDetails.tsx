import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { UserRole, UserState as User } from "@/types/Users";
import LogoutButton from "../buttons/LogOutButton";
import { useState } from "react";
import BankPaymentModal from "../modal/BankPaymentModal";
import { PageRoutes } from "@/utils/constants/page-routes";
import Link from "next/link";
import RentPromptSection from "@/sections/home/RentPromptSection";

type Props = {
  user: User;
};

export default function ProfileDetails({ user }: Props) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Avatar
          src={user.photoFileUrl || undefined}
          alt={user.name}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h5" fontWeight="bold">
          {user.name}
        </Typography>
        {user.role === UserRole.Admin && (
          <Chip
            icon={<VerifiedIcon />}
            label="Administrador"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" />
            <Typography variant="body1">{user.email}</Typography>
            {user.verifiedEmail && (
              <Chip
                label="Email verificado"
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body1">
              {user.phone || "Sin número telefónico"}
            </Typography>
          </Box>
        </Grid>

        {user.role === UserRole.Owner && (
          <Grid size={{ xs: 12 }} mt={2}>
            <Button variant="outlined" onClick={() => setOpenModal(true)}>
              Editar datos bancarios
            </Button>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Link href={PageRoutes.Incomes}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Ver Ingresos
          </Button>
        </Link>
        <Link href={PageRoutes.Received_Payments}>
          <Button variant="outlined" color="primary">
            Ver Pagos Recibidos
          </Button>
        </Link>
      </Box>

      <Box display="flex" justifyContent="center" mt={4}>
        <LogoutButton />
      </Box>

      {user.role === UserRole.Owner && (
        <BankPaymentModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          mode={user.bankPaymentData ? "update" : "create"}
          defaultValues={user.bankPaymentData}
        />
      )}
      {user.role === UserRole.User && (
        <>
          <Box my={4}>
            <RentPromptSection onClick={() => setOpenModal(true)} />
          </Box>
          <BankPaymentModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            mode="create"
          />
        </>
      )}
    </>
  );
}
