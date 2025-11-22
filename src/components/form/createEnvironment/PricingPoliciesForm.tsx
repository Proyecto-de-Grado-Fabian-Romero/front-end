import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";
import { type FormDataCreateEnv } from "@/types/Environments";

interface Props {
  formData: FormDataCreateEnv;
  setFormData: React.Dispatch<React.SetStateAction<FormDataCreateEnv>>;
}

type PricingPolicy = FormDataCreateEnv["pricingPolicies"][0];

const PricingPoliciesForm: React.FC<Props> = ({ formData, setFormData }) => {
  const [policy, setPolicy] = useState<PricingPolicy>(() => {
    const first =
      formData.pricingPolicies && formData.pricingPolicies.length > 0
        ? formData.pricingPolicies[0]
        : undefined;

    return (
      first ?? {
        BasePrice: 0,
        Currency: "Bs.",
        PriceUnit: formData.rentalUnit,
        ExtraGuestPrice: 0,
      }
    );
  });

  useEffect(() => {
    const first = formData.pricingPolicies?.[0];
    if (
      first &&
      (first.BasePrice !== policy.BasePrice ||
        first.ExtraGuestPrice !== policy.ExtraGuestPrice)
    ) {
      setPolicy(first);
    }
  }, [formData.pricingPolicies]);

  useEffect(() => {
    setFormData((prev) => {
      const next = [...(prev.pricingPolicies ?? [])];
      next[0] = policy;
      return { ...prev, pricingPolicies: next };
    });
  }, [policy, setFormData]);

  const handleChange = (field: keyof PricingPolicy, value: string | number) => {
    setPolicy((p) => ({ ...p, [field]: value }));
  };

  const dayHours = formData.typePublicKey === "hospedajes" ? "días" : "horas";

  return (
    <Box sx={{ maxWidth: "800px", width: "100%", mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Política de Precio
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Define el precio base por unidad de tiempo, la moneda y el extra por{" "}
        {formData.typePublicKey === "hospedajes" ? "huésped" : "ocupante"}{" "}
        adicional. El precio base se aplica para todos los{" "}
        {formData.typePublicKey === "hospedajes" ? "huéspedes" : "ocupantes"} y
        el extra se suma por cada{" "}
        {formData.typePublicKey === "hospedajes" ? "huésped" : "ocupante"}{" "}
        adicional.
      </Typography>

      <br />

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <TextField
            label={`Precio Base en Bs. (por ${dayHours})`}
            type="number"
            value={policy.BasePrice}
            onChange={(e) => handleChange("BasePrice", Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <TextField
            label={`Precio por ${
              formData.typePublicKey === "hospedajes" ? "huésped" : "ocupante"
            } extra en Bs. (por ${dayHours})`}
            type="number"
            value={policy.ExtraGuestPrice ?? 0}
            onChange={(e) =>
              handleChange("ExtraGuestPrice", Number(e.target.value))
            }
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingPoliciesForm;
