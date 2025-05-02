import { Card, CardContent, Typography } from "@mui/material";

type Props = {
  environmentName: string;
  status: string;
  requestDate: number;
  scheduledDate?: number;
};

const Tour360RequestCard = ({
  environmentName,
  status,
  requestDate,
  scheduledDate,
}: Props) => {
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
      </CardContent>
    </Card>
  );
};

// Helpers
const translateStatus = (status: string) => {
  switch (status) {
    case "Pending":
      return "Pendiente";
    case "Scheduled":
      return "Programado";
    case "Completed":
      return "Completado";
    case "Cancelled":
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
