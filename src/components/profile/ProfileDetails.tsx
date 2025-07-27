import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { UserState as User, UserRole } from "@/types/Users";
import EditProfileModal from "../modal/EditProfileModal";
import RentPromptSection from "@/sections/home/RentPromptSection";
import BankPaymentModal from "../modal/BankPaymentModal";
import LogoutButton from "../buttons/LogOutButton";

interface Props {
  user: User;
}

export default function ProfileDetails({ user }: Props) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false);

  return (
    <Box>
      <Grid container spacing={4} alignItems="center">
        <Grid>
          <Avatar
            src={user.photoFileUrl || undefined}
            alt={user.name}
            sx={{ width: 120, height: 120 }}
          />
        </Grid>

        <Grid>
          <Grid>
            <Typography variant="h5" fontWeight="bold">
              {user.name}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <EmailIcon fontSize="small" />
              <Typography>{user.email}</Typography>
              {user.verifiedEmail && (
                <Chip
                  label="Email verificado"
                  size="small"
                  icon={<VerifiedIcon fontSize="small" />}
                />
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <PhoneIcon fontSize="small" />
              <Typography>{user.phone || "Sin número telefónico"}</Typography>
              {user.verifiedPhone && (
                <Chip
                  label="Teléfono verificado"
                  size="small"
                  icon={<VerifiedIcon fontSize="small" />}
                />
              )}
            </Box>

            {user.role === UserRole.Admin && (
              <Chip
                icon={<VerifiedIcon />}
                label="Administrador"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Grid>

          <Grid>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={() => setOpenEditModal(true)}
              sx={{ marginTop: 4 }}
            >
              Editar perfil
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {user.role === UserRole.User && (
        <Box>
          <RentPromptSection onClick={() => setOpenBankModal(true)} />
        </Box>
      )}

      <BankPaymentModal
        open={openBankModal}
        onClose={() => setOpenBankModal(false)}
        mode={"create"}
      />

      <EditProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        defaultValues={user}
      />

      <LogoutButton />
    </Box>
  );
}
