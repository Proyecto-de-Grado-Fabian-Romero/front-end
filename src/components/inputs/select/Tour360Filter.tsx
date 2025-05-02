import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

type Props = {
  statusFilter: string;
  onStatusChange: (value: string) => void;
};

const Tour360Filter = ({ statusFilter, onStatusChange }: Props) => {
  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Estado</InputLabel>
      <Select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        label="Estado"
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="Pending">Pendiente</MenuItem>
        <MenuItem value="Scheduled">Programado</MenuItem>
        <MenuItem value="Completed">Completado</MenuItem>
        <MenuItem value="Cancelled">Cancelado</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Tour360Filter;
