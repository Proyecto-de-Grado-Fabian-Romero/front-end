import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmReservationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Conflicto de Reservas</DialogTitle>
    <DialogContent>
      Ya existen otras reservas en este horario. ¿Deseas confirmar esta reserva
      y rechazar las otras?
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} variant="contained" color="primary">
        Confirmar y Rechazar otras
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmReservationDialog;
