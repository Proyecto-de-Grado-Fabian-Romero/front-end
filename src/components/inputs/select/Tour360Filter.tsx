import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

type Props = {
  statusFilter: number;
  onStatusChange: (value: number) => void;
};

const Tour360Filter = ({ statusFilter, onStatusChange }: Props) => {
  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Estado</InputLabel>
      <Select
        value={statusFilter}
        onChange={(e) => onStatusChange(parseInt(e.target.value.toString()))}
        label="Estado"
      >
        <MenuItem value={0}>Pendiente</MenuItem>
        <MenuItem value={1}>Programado</MenuItem>
        <MenuItem value={2}>Completado</MenuItem>
        <MenuItem value={3}>Cancelado</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Tour360Filter;
