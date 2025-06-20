"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  SelectChangeEvent,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { FormDataCreateEnv } from "@/types/Environments";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import { createEnvironment } from "@/services/environmentService";
import GeneralInfoForm from "./GeneralInfoForm";
import RentSettingForm from "./RentSettingForm";
import LocationTypeForm from "./LocationTypeForm";
import ServicesAreasForm from "./ServicesAreasForm";
import ImagesForm from "./ImagesForm";
import PricingPoliciesForm from "./PricingPoliciesForm";
import DiscountPoliciesForm from "./DiscountPoliciesForm";
import WeeklySchedulesForm from "./WeeklySchedulesForm";

const CreateEnvironmentForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataCreateEnv>({
    title: "",
    description: "",
    location: "",
    latitude: 0,
    longitude: 0,
    typePublicKey: "hospedajes",
    servicePublicKeys: [],
    areas: [],
    images: [],
    equipment: "{}",
    pricingPolicies: [],
    discountPolicies: [],
    weeklySchedules: [],
    request360Tour: false,
    capacity: 0,
    instantBooking: false,
    minRentalTime: 1,
    maxRentalTime: 24,
    rentalUnit: "Horas",
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e: SelectChangeEvent<string[]>) => {
    setFormData((prev) => ({
      ...prev,
      servicePublicKeys: e.target.value as string[],
    }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.typePublicKey
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    if (formData.servicePublicKeys.length === 0) {
      setError("Selecciona al menos un servicio.");
      setLoading(false);
      return;
    }

    if (formData.areas.length === 0) {
      setError("Selecciona al menos un área.");
      setLoading(false);
      return;
    }

    if (formData.minRentalTime > formData.maxRentalTime) {
      setError("El tiempo mínimo de alquiler no puede ser mayor al máximo.");
      setLoading(false);
      return;
    }

    if (formData.pricingPolicies[0]?.BasePrice === 0) {
      setError("El precio base no puede ser 0.");
      setLoading(false);
      return;
    }

    if (
      formData.typePublicKey !== "hospedajes" &&
      formData.weeklySchedules.length === 0
    ) {
      setError("Debes agregar al menos un horario semanal para el ocupante.");
      setLoading(false);
      return;
    }

    try {
      await createEnvironment(formData);
      router.push(PageRoutes.Owner_Environments);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Hubo un problema al enviar el formulario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ py: 4, px: { xs: 0, md: 6, lg: 24 }, width: "100%" }}
    >
      <Typography variant="h5" mb={4} textAlign={"center"}>
        Crear Nuevo Ambiente
      </Typography>

      <Grid container spacing={10}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GeneralInfoForm handleInputChange={handleInputChange} />
          <br />
          <hr />
          <LocationTypeForm
            handleSelectChange={handleSelectChange}
            formData={formData}
          />
          <br /> <hr />
          <RentSettingForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <br />
          <hr />
          <ServicesAreasForm
            formData={formData}
            setFormData={setFormData}
            handleServiceChange={handleServiceChange}
          />
          <br />
          <hr />
          <ImagesForm
            formData={formData}
            setFormData={setFormData}
            handleCheckboxChange={handleCheckboxChange}
          />
          <br />
          <hr />
          <PricingPoliciesForm formData={formData} setFormData={setFormData} />
          <br />
          <hr />
          <DiscountPoliciesForm formData={formData} setFormData={setFormData} />
          {formData.typePublicKey !== "hospedajes" && (
            <>
              <br />
              <hr />
              <WeeklySchedulesForm
                formData={formData}
                setFormData={setFormData}
              />
            </>
          )}
        </Grid>

        {/* Botón Submit */}
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "CREAR AMBIENTE"
            )}
          </Button>
        </Grid>

        {/* Feedback */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Grid>
    </Box>
  );
};

export default CreateEnvironmentForm;
