"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Stack,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { getUserByPublicId, UserDTO } from "@/services/authService";

type Props = {
  publicId: string;
  title?: string;
};

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

export default function UserPreviewCard({
  publicId,
  title = "Usuario",
}: Props) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr(null);
    getUserByPublicId(publicId, ac.signal)
      .then(setUser)
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [publicId]);

  const avatar = useMemo(() => {
    const src = user?.photoFileUrl?.trim() || "";
    if (src) return <Avatar src={src} sx={{ width: 72, height: 72 }} />;
    return (
      <Avatar
        sx={{
          width: 72,
          height: 72,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          fontWeight: 700,
        }}
      >
        {getInitials(user?.name)}
      </Avatar>
    );
  }, [user]);

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <CardHeader
        avatar={
          loading ? (
            <Skeleton variant="circular" width={72} height={72} />
          ) : (
            avatar
          )
        }
        title={
          loading ? (
            <Skeleton variant="text" width={220} />
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                {user?.name || "—"}
              </Typography>
            </Stack>
          )
        }
        subheader={
          loading ? (
            <Skeleton variant="text" width={120} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          )
        }
        sx={{ pb: 0, alignItems: "center" }}
      />

      <CardContent sx={{ pt: 2 }}>
        {err ? (
          <Alert severity="error" icon={<ErrorOutlineIcon />}>
            {err}
          </Alert>
        ) : (
          <>
            <Stack spacing={1.5}>
              {/* Email */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton size="small" sx={{ pointerEvents: "none" }}>
                  <MailOutlineIcon fontSize="small" />
                </IconButton>
                {loading ? (
                  <Skeleton variant="text" width={260} />
                ) : (
                  <Typography variant="body1">
                    {user?.email ? (
                      <a
                        href={`mailto:${user.email}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {user.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </Typography>
                )}
              </Stack>

              {/* Teléfono */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton size="small" sx={{ pointerEvents: "none" }}>
                  <PhoneIphoneIcon fontSize="small" />
                </IconButton>
                {loading ? (
                  <Skeleton variant="text" width={180} />
                ) : (
                  <Typography variant="body1">
                    {user?.phone ? (
                      <a
                        href={`tel:${user.phone}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {user.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
