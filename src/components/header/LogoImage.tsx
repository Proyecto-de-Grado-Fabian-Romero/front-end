"use client";
import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface LogoImageProps {
  size?: number;
}

const LogoImage: React.FC<LogoImageProps> = ({ size = 40 }) => {
  return (
    <>
      <Image src="/images/logo.png" alt="Logo" width={size} height={size} />
      <Typography variant="h6">SPACIO</Typography>
    </>
  );
};

export default LogoImage;
