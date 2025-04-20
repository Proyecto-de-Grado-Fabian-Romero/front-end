import { PageRoutes } from "@/utils/constants/page-routes";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LoggedOutProps {
  imageSrc: string;
  title: string;
}

const LoggedOutProfile = ({ imageSrc, title }: LoggedOutProps) => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={"center"}
      gap={2}
      height={"100vh"}
    >
      <Image src={imageSrc} alt="login visual" width={200} height={200} />
      <Typography variant="h6" align="center">
        {title}
      </Typography>
      <Button
        variant="contained"
        endIcon={"→"}
        onClick={() => router.push(PageRoutes.LogIn)}
        sx={{ borderColor: "black", color: "black" }}
      >
        Iniciar Sesión
      </Button>
    </Box>
  );
};
export default LoggedOutProfile;
