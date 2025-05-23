import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { FormDataCreateEnv } from "@/types/Environments";

interface Props {
  formData: FormDataCreateEnv;
  setFormData: React.Dispatch<React.SetStateAction<FormDataCreateEnv>>;
}

const DiscountPoliciesForm: React.FC<Props> = ({ formData, setFormData }) => {
  const basePrice = formData.pricingPolicies[0]?.BasePrice || 0;

  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
  const [bsValue, setBsValue] = useState<string>("");

  const addDiscount = () => {
    setFormData((prev) => ({
      ...prev,
      discountPolicies: [
        ...prev.discountPolicies,
        {
          MinHours: 0,
          DiscountPercentage: 0,
        },
      ],
    }));
  };

  const handleChange = (
    index: number,
    field: keyof FormDataCreateEnv["discountPolicies"][0],
    value: number,
  ) => {
    const updated = [...formData.discountPolicies];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, discountPolicies: updated }));
  };

  const convertFixedToPercentage = (fixed: number) => {
    if (basePrice === 0) return 0;
    return Number(((fixed / basePrice) * 100).toFixed(2));
  };

  const dayHours = formData.typePublicKey === "hospedajes" ? "días" : "horas";

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Políticas de Descuento
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Establece descuentos en porcentaje según la cantidad mínima de{" "}
        {dayHours}
        reservadas.
      </Typography>

      {formData.discountPolicies.map((policy, index) => {
        const discountAmount = (basePrice * policy.DiscountPercentage) / 100;
        const discountedPrice = basePrice - discountAmount;

        return (
          <Box key={index} mb={3}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label={`Mínimo de ${dayHours}`}
                type="number"
                value={policy.MinHours}
                onChange={(e) =>
                  handleChange(index, "MinHours", Number(e.target.value))
                }
              />
              <TextField
                label="% Descuento"
                type="number"
                value={policy.DiscountPercentage}
                onChange={(e) =>
                  handleChange(
                    index,
                    "DiscountPercentage",
                    Number(e.target.value),
                  )
                }
              />
              <Tooltip title="¿Sabes cuánto quieres descontar en Bs? Calculamos el % por ti.">
                <IconButton onClick={() => setOpenDialogIndex(index)}>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {basePrice > 0 && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                Ej: Bs {basePrice} - {policy.DiscountPercentage}% = Bs{" "}
                {discountedPrice.toFixed(2)} (descuento de Bs{" "}
                {discountAmount.toFixed(2)})
              </Typography>
            )}
          </Box>
        );
      })}

      <Button variant="outlined" onClick={addDiscount}>
        Agregar política de descuento
      </Button>

      <Dialog
        open={openDialogIndex !== null}
        onClose={() => setOpenDialogIndex(null)}
      >
        <DialogTitle>Convertir descuento en Bs a %</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Descuento en Bs"
            type="number"
            fullWidth
            value={bsValue}
            onChange={(e) => setBsValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogIndex(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              if (openDialogIndex !== null && bsValue) {
                const percentage = convertFixedToPercentage(Number(bsValue));
                if (!isNaN(percentage)) {
                  handleChange(
                    openDialogIndex,
                    "DiscountPercentage",
                    percentage,
                  );
                }
              }
              setOpenDialogIndex(null);
              setBsValue("");
            }}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiscountPoliciesForm;
