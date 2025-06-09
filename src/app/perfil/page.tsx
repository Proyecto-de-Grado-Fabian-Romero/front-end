import ProfileClient from "@/components/client/ProfileClient";
import { Container } from "@mui/material";

export default function ProfilePage() {
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ProfileClient />
    </Container>
  );
}
