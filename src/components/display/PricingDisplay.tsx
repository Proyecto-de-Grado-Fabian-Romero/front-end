import { Box, Typography } from "@mui/material";

type PricingPolicy = {
  basePrice: number;
  currency: string;
  priceUnit: string;
  extraGuestPrice: number;
};

const PricingDisplay = ({ pricing }: { pricing: PricingPolicy }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography>
        <strong>Precio base:</strong> {pricing.currency} {pricing.basePrice} /{" "}
        {pricing.priceUnit}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        <strong>Precio por huésped adicional:</strong> {pricing.extraGuestPrice}{" "}
        {pricing.currency}
      </Typography>
    </Box>
  );
};

export default PricingDisplay;
