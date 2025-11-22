import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BankPaymentData } from "@/types/BankPaymentData";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  initialValues?: Partial<BankPaymentData>;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: BankPaymentData) => void;
  onCancel?: () => void;
}

export default function BankPaymentForm({
  initialValues = {},
  loading = false,
  error = null,
  onSubmit,
  onCancel,
}: Props) {
  const user = useSelector((state: RootState) => state.user);
  const [accountNumber, setAccountNumber] = useState(
    initialValues.bankAccountNumber || "",
  );
  const [accountHolder, setAccountHolder] = useState(
    initialValues.bankAccountHolder || "",
  );
  const [bankName, setBankName] = useState(initialValues.bankName || "");

  const handleSubmit = () => {
    onSubmit({
      bankAccountNumber: accountNumber,
      bankAccountHolder: accountHolder,
      bankName,
    });
    window.location.reload();
  };

  useEffect(() => {
    setAccountHolder(user.name || "");
  }, [user.name]);

  return (
    <>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, pt: 4 }}
      >
        <TextField
          label="Número de cuenta"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          fullWidth
          placeholder="Ej: 1234567890"
          sx={{ mt: 2 }}
        />
        <TextField
          label="Titular de la cuenta"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          placeholder="Ej: Juan Pérez"
          fullWidth
        />
        <TextField
          label="Banco"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Ej: Banco Sol"
          fullWidth
        />
        {error && (
          <Typography color="error" fontSize="0.9rem">
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        {onCancel && (
          <Button onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !accountNumber || !accountHolder || !bankName}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Guardar"
          )}
        </Button>
      </DialogActions>
    </>
  );
}
