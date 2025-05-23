import React, { useEffect } from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";
import { FormDataCreateEnv } from "@/types/Environments";

interface Props {
  formData: FormDataCreateEnv;
  setFormData: React.Dispatch<React.SetStateAction<FormDataCreateEnv>>;
}

const PricingPoliciesForm: React.FC<Props> = ({ formData, setFormData }) => {
  const policy = formData.pricingPolicies[0];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pricingPolicies: [
        ...prev.pricingPolicies,
        {
          BasePrice: 0,
          Currency: "Bs.",
          PriceUnit: formData.rentalUnit,
          ExtraGuestPrice: 0,
        },
      ],
    }));
  }, [formData.rentalUnit]);

  const handleChange = (
    field: keyof FormDataCreateEnv["pricingPolicies"][0],
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pricingPolicies: [
        {
          ...prev.pricingPolicies[0],
          [field]: value,
        },
      ],
    }));
  };

  const dayHours = formData.typePublicKey === "hospedajes" ? "días" : "horas";

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Política de Precio
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Define el precio base por unidad de tiempo, la moneda y el extra por
        {formData.typePublicKey === "hospedajes" ? "huésped" : "ocupante"}{" "}
        adicional. El precio base se aplica para todos los{" "}
        {formData.typePublicKey === "hospedajes" ? "huéspedes" : "ocupantes"} y
        el extra se suma al total por cada{" "}
        {formData.typePublicKey === "hospedajes" ? "huésped" : "ocupante"}{" "}
        adicional.
      </Typography>
      <br />

      {policy && (
        <Grid container spacing={1}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label={`Precio Base en Bs. (por ${dayHours})`}
              type="number"
              value={policy.BasePrice}
              onChange={(e) =>
                handleChange("BasePrice", Number(e.target.value))
              }
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label={`Precio por ${formData.typePublicKey === "hospedajes" ? "huésped" : "ocupante"} extra en Bs. (por ${dayHours})`}
              type="number"
              value={policy.ExtraGuestPrice ?? ""}
              onChange={(e) =>
                handleChange("ExtraGuestPrice", Number(e.target.value))
              }
              fullWidth
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PricingPoliciesForm;
