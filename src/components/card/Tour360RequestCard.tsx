import { PageRoutes } from "@/utils/constants/page-routes";
import { AddOutlined, PlusOneOutlined } from "@mui/icons-material";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  environmentName: string;
  status: number;
  requestDate: number;
  scheduledDate?: number;
};

const Tour360RequestCard = ({
  environmentName,
  status,
  requestDate,
  scheduledDate,
}: Props) => {
  const router = useRouter();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {environmentName}
        </Typography>
        <Typography variant="body2">
          Estado: {translateStatus(status)}
        </Typography>
        <Typography variant="body2">
          Fecha de solicitud: {formatDate(requestDate)}
        </Typography>
        {scheduledDate && (
          <Typography variant="body2">
            Fecha programada: {formatDate(scheduledDate)}
          </Typography>
        )}

        {status <= 1 && (
          <Button
            startIcon={<AddOutlined />}
            variant="contained"
            onClick={() => router.push(`${PageRoutes.Create_Virtual_Tour}`)}
            sx={{ paddingLeft: 3, paddingRight: 2, marginTop: 4 }}
          >
            Añadir Recorrido Virtual
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Helpers
const translateStatus = (status: number) => {
  switch (status) {
    case 0:
      return "Pendiente";
    case 1:
      return "Programado";
    case 2:
      return "Completado";
    case 3:
      return "Cancelado";
    default:
      return status;
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("es-ES");
};

export default Tour360RequestCard;
