// Formulario completo con validaciones previas al envío
"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cities, environments } from "@/utils/constants/constants";
import { FormDataCreateEnv } from "@/types/Environments";
import ImageUploader from "@/components/inputs/form/InputUploader";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

const CreateEnvironmentForm = () => {
  const router = useRouter();
  const { areas, services } = useSelector((state: RootState) => state.options);

  const [formData, setFormData] = useState<FormDataCreateEnv>({
    title: "",
    description: "",
    location: "",
    latitude: 0,
    longitude: 0,
    typePublicKey: "",
    servicePublicKeys: [],
    areas: [],
    images: [],
    equipmentJson: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    console.log(formData);

    // Validaciones previas
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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        (value as File[]).forEach((file) => data.append("images", file));
      } else if (Array.isArray(value)) {
        data.append(key, JSON.stringify(value));
      } else if (typeof value === "boolean" || typeof value === "number") {
        data.append(key, value.toString());
      } else if (value !== undefined && value !== null) {
        data.append(key, value.toString());
      }
    });

    try {
      const response = await fetch("http://localhost:5150/api/environments", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Error al crear el ambiente");
      }

      router.push(PageRoutes.Owner_Environments);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Hubo un problema al enviar el formulario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, width: "100%" }}>
      <Typography variant="h5" mb={2}>
        Crear Ambiente
      </Typography>

      <TextField
        name="title"
        label="Nombre del Ambiente"
        fullWidth
        onChange={handleInputChange}
        required
      />

      <TextField
        name="description"
        label="Descripción"
        fullWidth
        multiline
        rows={3}
        onChange={handleInputChange}
        required
        sx={{ mt: 2 }}
      />

      <TextField
        name="capacity"
        label="Capacidad"
        type="number"
        fullWidth
        onChange={handleInputChange}
        sx={{ mt: 2 }}
      />

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Unidad de Alquiler</InputLabel>
        <Select
          name="rentalUnit"
          value={formData.rentalUnit}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Unidad de Alquiler" />}
        >
          <MenuItem value="Horas">Horas</MenuItem>
          <MenuItem value="Días">Días</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="minRentalTime"
        label="Tiempo Mínimo de Alquiler"
        type="number"
        fullWidth
        onChange={handleInputChange}
        sx={{ mt: 2 }}
      />

      <TextField
        name="maxRentalTime"
        label="Tiempo Máximo de Alquiler"
        type="number"
        fullWidth
        onChange={handleInputChange}
        sx={{ mt: 2 }}
      />

      <Box sx={{ mt: 2 }}>
        <label>
          <Checkbox
            name="instantBooking"
            checked={formData.instantBooking}
            onChange={handleCheckboxChange}
          />
          Reserva instantánea
        </label>
      </Box>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Ubicación</InputLabel>
        <Select
          name="location"
          value={formData.location}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Ubicación" />}
        >
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Tipo</InputLabel>
        <Select
          name="typePublicKey"
          value={formData.typePublicKey}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Tipo" />}
        >
          {environments.map((env) => (
            <MenuItem key={env.key} value={env.key}>
              {env.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Servicios</InputLabel>
        <Select
          multiple
          name="servicePublicKeys"
          value={formData.servicePublicKeys}
          onChange={handleServiceChange}
          input={<OutlinedInput label="Servicios" />}
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {services.map((s) => (
            <MenuItem key={s.publicKey} value={s.publicKey}>
              <Checkbox
                checked={formData.servicePublicKeys.includes(s.publicKey)}
              />
              <ListItemText primary={s.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Áreas</InputLabel>
        <Select
          multiple
          name="areas"
          value={formData.areas.map((a) => a.AreaPublicKey)}
          onChange={(e) => {
            const selected = [...e.target.value] as string[];
            const updated = selected.map((key) => ({
              AreaPublicKey: key,
              Quantity: 1,
            }));
            setFormData((prev) => ({ ...prev, areas: updated }));
          }}
          input={<OutlinedInput label="Áreas" />}
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {areas.map((a) => (
            <MenuItem key={a.publicKey} value={a.publicKey}>
              <Checkbox
                checked={formData.areas.some(
                  (ar) => ar.AreaPublicKey === a.publicKey,
                )}
              />
              <ListItemText primary={a.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ImageUploader
        images={formData.images}
        setImages={(newImages) =>
          setFormData((prev) => ({ ...prev, images: newImages }))
        }
      />

      <Box sx={{ mt: 2 }}>
        <label>
          <Checkbox
            name="request360Tour"
            checked={formData.request360Tour}
            onChange={handleCheckboxChange}
          />
          Solicitar Tour 360°
        </label>
      </Box>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }}>
        Crear Ambiente
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default CreateEnvironmentForm;
