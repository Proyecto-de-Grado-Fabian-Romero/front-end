import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { DiscountPolicy } from "@/types/GetEnvironment";

interface DiscountsDisplayProps {
  policies: DiscountPolicy[];
  isHospedaje: boolean;
}

const DiscountsDisplay: React.FC<DiscountsDisplayProps> = ({
  policies,
  isHospedaje,
}) => {
  console.log(policies);
  if (!policies.length) return null;

  return (
    <Box mt={1}>
      <Typography variant="subtitle1">Descuentos disponibles:</Typography>
      <List>
        {policies.map((policy, index) => (
          <ListItem key={index} disablePadding>
            <ListItemText
              primary={`-${policy.discountPercentage}% si reservas al menos ${
                isHospedaje
                  ? `${policy.minHours} ${policy.minHours === 1 ? "noche" : "noches"}`
                  : `${policy.minHours} ${policy.minHours === 1 ? "hora" : "horas"}`
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DiscountsDisplay;
