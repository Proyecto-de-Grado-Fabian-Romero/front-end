"use client";

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  name?: string;
}

const PasswordField = ({
  label,
  value,
  onChange,
  required = true,
  name,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl variant="outlined" fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        type={showPassword ? "text" : "password"}
        value={value}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <InputAdornment
            position="start"
            style={{ marginLeft: 12, marginRight: 16 }}
          >
            <LockIcon />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
};

export default PasswordField;
