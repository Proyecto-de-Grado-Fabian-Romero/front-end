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
  Grid,
  FormControlLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cities, environments } from "@/utils/constants/constants";
import { FormDataCreateEnv } from "@/types/Environments";
import ImageUploader from "@/components/inputs/form/InputUploader";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import { createEnvironment } from "@/services/environmentService";

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
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, width: "100%" }}>
      <Typography variant="h5" mb={4}>
        Crear Nuevo Ambiente
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="h6">Información General</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Define el nombre, descripción y capacidad del ambiente.
            </Typography>
            <TextField
              name="title"
              label="Nombre del Ambiente"
              placeholder="Ej: Sala de Conferencias"
              fullWidth
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              name="description"
              label="Descripción del Ambiente"
              placeholder="Ej: Amplia sala equipada con proyectores, sonido envolvente y aire acondicionado."
              fullWidth
              multiline
              rows={4}
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              name="capacity"
              label="Capacidad Máxima (personas)"
              placeholder="Ej: 50"
              type="number"
              fullWidth
              onChange={handleInputChange}
              sx={{ mt: 2 }}
              required
            />
          </Box>

          <br />
          <hr />
          <Box>
            <Typography variant="h6">Configuración de Alquiler</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Establece las condiciones mínimas y máximas para el alquiler de
              este ambiente.
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Unidad de Tiempo de Alquiler</InputLabel>
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
              label="Tiempo mínimo de alquiler (en unidades seleccionadas)"
              placeholder="Ej: 2"
              type="number"
              fullWidth
              onChange={handleInputChange}
              sx={{ mt: 2 }}
            />
            <TextField
              name="maxRentalTime"
              label="Tiempo máximo de alquiler (en unidades seleccionadas)"
              placeholder="Ej: 8"
              type="number"
              fullWidth
              onChange={handleInputChange}
              sx={{ mt: 2 }}
            />
            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Checkbox
                  name="instantBooking"
                  checked={formData.instantBooking}
                  onChange={handleCheckboxChange}
                />
              }
              label="Permitir reservas instantáneas"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <hr />
          <Box>
            <Typography variant="h6">Ubicación y Tipo de Ambiente</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Selecciona la ubicación y la categoría a la que pertenece el
              ambiente.
            </Typography>
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
              <InputLabel>Tipo de Ambiente</InputLabel>
              <Select
                name="typePublicKey"
                value={formData.typePublicKey}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Tipo de Ambiente" />}
              >
                {environments.map((env) => (
                  <MenuItem key={env.key} value={env.key}>
                    {env.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <br />
          <hr />
          <Box>
            <Typography variant="h6">Servicios y Áreas Disponibles</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Indica qué servicios y áreas adicionales están disponibles en el
              ambiente.
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Servicios</InputLabel>
              <Select
                multiple
                name="servicePublicKeys"
                value={formData.servicePublicKeys}
                onChange={handleServiceChange}
                input={<OutlinedInput label="Servicios" />}
                renderValue={(selected) =>
                  (selected as string[])
                    .map(
                      (key) =>
                        services.find((s) => s.publicKey === key)?.name ?? "",
                    )
                    .join(", ")
                }
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
                renderValue={(selected) =>
                  (selected as string[])
                    .map(
                      (key) =>
                        areas.find((s) => s.publicKey === key)?.name ?? "",
                    )
                    .join(", ")
                }
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
          </Box>
          <br />
          <hr />
          <Box>
            <Typography variant="h6">Galería de Imágenes</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Sube imágenes representativas del ambiente.
            </Typography>
            <ImageUploader
              images={formData.images}
              setImages={(newImages) =>
                setFormData((prev) => ({ ...prev, images: newImages }))
              }
            />
          </Box>
          <br />
          <FormControlLabel
            control={
              <Checkbox
                name="request360Tour"
                checked={formData.request360Tour}
                onChange={handleCheckboxChange}
              />
            }
            label="Solicitar creación de Tour Virtual 360°"
          />
        </Grid>

        {/* Botón Submit */}
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Crear Ambiente
          </Button>
        </Grid>

        {/* Feedback */}
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
      </Grid>
    </Box>
  );
};

export default CreateEnvironmentForm;
