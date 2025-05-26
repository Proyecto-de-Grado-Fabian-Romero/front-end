import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { DiscountPolicy } from "@/types/GetEnvironment";

interface DiscountsDisplayProps {
  policies: DiscountPolicy[];
  isHospedaje: boolean;
  mt?: number;
}

const DiscountsDisplay: React.FC<DiscountsDisplayProps> = ({
  policies,
  isHospedaje,
  mt = 1,
}) => {
  if (!policies.length) return null;

  return (
    <Box mt={mt}>
      {mt > 1 && <hr />}
      <Typography variant="subtitle1" mt={2} mb={-2}>
        Descuentos disponibles:
      </Typography>
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
