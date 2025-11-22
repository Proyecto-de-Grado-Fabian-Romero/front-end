"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Stack,
  FormControlLabel,
  RadioGroup,
  Radio,
  Collapse,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { SelectChangeEvent } from "@mui/material";
import { PageRoutes } from "@/utils/constants/page-routes";
import {
  createEnvironment,
  updateEnvironment,
} from "@/services/environmentService";
import { envToFormData } from "@/utils/methods/conversions";
import GeneralInfoForm from "./GeneralInfoForm";
import RentSettingForm from "./RentSettingForm";
import LocationTypeForm from "./LocationTypeForm";
import ServicesAreasForm from "./ServicesAreasForm";
import ImagesForm from "./ImagesForm";
import PricingPoliciesForm from "./PricingPoliciesForm";
import DiscountPoliciesForm from "./DiscountPoliciesForm";
import WeeklySchedulesForm from "./WeeklySchedulesForm";
import LocationMapStep from "@/components/map/LocationMapStep";
import { FormDataCreateEnv } from "@/types/Environments";
import { Environment, Photo } from "@/types/GetEnvironment";
import { Vrpano } from "@mui/icons-material";
import { getLastTour360RequestDateByEnv } from "@/services/adminService";

type Props = {
  initialData?: Environment;
};

const FOUR_MONTHS = 4;

const addMonthsUtc = (unixSeconds: number, months: number) => {
  const d = new Date(unixSeconds * 1000);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  // conserva día; Date manejará overflow (fin de mes)
  const next = new Date(Date.UTC(y, m + months, day, 0, 0, 0));
  return Math.floor(next.getTime() / 1000);
};

const formatDateEs = (unixSeconds: number) => {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CreateEnvironmentForm: React.FC<Props> = ({ initialData }) => {
  const router = useRouter();

  // ---------- Estados ----------
  const [tab, setTab] = useState(0);
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
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wants360, setWants360] = useState<"no" | "si" | "later">("no");
  const [tourOption, setTourOption] = useState<
    "solicitar" | "agregar" | "none"
  >("none");

  // ---------- Inicialización ----------
  useEffect(() => {
    if (initialData) {
      setFormData(envToFormData(initialData));
      setExistingPhotos(initialData.photos ?? []);
    }
  }, [initialData]);

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
  useEffect(() => {
    if (wants360 === "si" && !isBlocked) {
      setFormData((prev) => ({ ...prev, request360Tour: true }));
    } else {
      setFormData((prev) => ({ ...prev, request360Tour: false }));
    }
  }, [wants360]);

  // ---------- Sincroniza el campo request360Tour ----------
  useEffect(() => {
    setFormData((prev) => ({ ...prev, request360Tour: wants360 === "si" }));
  }, [wants360]);

  // ---------- Validaciones por Tab ----------
  const validateStep = (step: number): boolean => {
    setError("");

    switch (step) {
      case 0:
        if (!formData.title || !formData.description)
          return (
            setError("Completa el título y la descripción del ambiente."), false
          );
        return true;

      case 1:
        if (
          !formData.location ||
          formData.latitude === 0 ||
          formData.longitude === 0
        )
          return (
            setError("Debes seleccionar la ubicación del ambiente."), false
          );
        return true;

      case 3:
        if (formData.servicePublicKeys.length === 0)
          return setError("Selecciona al menos un servicio."), false;
        return true;

      case 4:
        if (formData.images.length === 0 && existingPhotos.length === 0)
          return setError("Agrega al menos una imagen del ambiente."), false;
        return true;

      case 5:
        if (formData.pricingPolicies.length === 0)
          return setError("Agrega una política de precios."), false;
        return true;

      default:
        return true;
    }
  };

  // ---------- Navegación de Tabs con validación ----------
  const handleNext = () => {
    if (!validateStep(tab)) return;
    setTab((prev) => prev + 1);
  };

  const handlePrev = () => {
    setTab((prev) => prev - 1);
  };

  // ---------- Submit ----------
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let environmentId = initialData?.publicId;

      // Crear o actualizar el ambiente
      if (initialData) {
        await updateEnvironment(initialData.publicId, formData, {
          keepPhotoIds: existingPhotos.map((p) => p.fileId),
        });
      } else {
        const created = await createEnvironment(formData);
        environmentId = created.publicId;
      }

      // Si seleccionó subir su propio tour → redirigir después de guardar
      if (wants360 === "si" && tourOption === "agregar" && environmentId) {
        router.push(
          `${PageRoutes.Create_Virtual_Tour_Direct}?environmentId=${environmentId}`,
        );
        return;
      }

      router.push(PageRoutes.Owner_Environments);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Hubo un problema al guardar el ambiente.");
    } finally {
      setLoading(false);
    }
  };

  const [lastRequestUnix, setLastRequestUnix] = useState<number | null>(null);

  useEffect(() => {
    const fetchLast = async () => {
      if (!initialData?.publicId) return;
      try {
        const last = await getLastTour360RequestDateByEnv(
          initialData?.publicId,
        );
        setLastRequestUnix(last); // null si no hay
      } catch {
        // si hay error, asumimos que no hay bloqueo para no romper UX
        setLastRequestUnix(null);
      }
    };
    if (initialData?.publicId) fetchLast();
  }, [initialData?.publicId]);

  const nextEligibleUnix = useMemo(() => {
    if (!lastRequestUnix) return null;
    return addMonthsUtc(lastRequestUnix, FOUR_MONTHS);
  }, [lastRequestUnix]);

  const isBlocked = useMemo(() => {
    if (!nextEligibleUnix) return false;
    const nowUnix = Math.floor(Date.now() / 1000);
    return nowUnix < nextEligibleUnix;
  }, [nextEligibleUnix]);

  // ---------- Render ----------
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        py: 4,
        px: { xs: 2, md: 6, lg: 16 },
        width: "100%",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" textAlign="center" mb={4} mt={4}>
        {initialData ? "Editar Ambiente" : "Crear Nuevo Ambiente"}
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        centered
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4 }}
      >
        <Tab label="General" />
        <Tab label="Ubicación" />
        <Tab label="Alquiler" />
        <Tab label="Servicios" />
        <Tab label="Imágenes" />
        <Tab label="Precios" />
        <Tab label="Horarios" />
        <Tab label="Recorrido 360°" />
      </Tabs>

      {/* Contenido por Tab */}
      {tab === 0 && (
        <GeneralInfoForm
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      {tab === 1 && (
        <>
          <LocationTypeForm
            formData={formData}
            handleSelectChange={handleSelectChange}
          />
          <LocationMapStep
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={(lat, lng) =>
              setFormData((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
              }))
            }
          />
        </>
      )}

      {tab === 2 && (
        <RentSettingForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}

      {tab === 3 && (
        <ServicesAreasForm
          formData={formData}
          setFormData={setFormData}
          handleServiceChange={handleServiceChange}
        />
      )}

      {tab === 4 && (
        <ImagesForm
          formData={formData}
          setFormData={setFormData}
          existingPhotos={existingPhotos}
          onDeleteExisting={(fileId) =>
            setExistingPhotos((prev) => prev.filter((p) => p.fileId !== fileId))
          }
        />
      )}

      {tab === 5 && (
        <>
          <PricingPoliciesForm formData={formData} setFormData={setFormData} />
          <br />
          <DiscountPoliciesForm formData={formData} setFormData={setFormData} />
        </>
      )}

      {tab === 6 &&
        (formData.typePublicKey !== "hospedajes" ? (
          <WeeklySchedulesForm formData={formData} setFormData={setFormData} />
        ) : (
          <Box>
            <Typography>Función no disponible para hospedajes</Typography>
          </Box>
        ))}

      {tab === 7 && (
        <Box sx={{ maxWidth: "800px", width: "100%", mb: 4 }} mt={3}>
          <Box display="flex" alignItems="center" mb={3} gap={1.5}>
            <Vrpano
              sx={{
                fontSize: 40,
                color: "primary.main",
                filter: "drop-shadow(0 0 4px rgba(0,0,0,0.2))",
              }}
            />
            <Typography variant="h6">
              ¿Deseas {initialData?.tour360Id ? "editar" : "agregar"} un
              Recorrido 360° de tu ambiente?
            </Typography>
          </Box>

          <RadioGroup
            row
            value={wants360}
            onChange={(e) =>
              setWants360(e.target.value as "si" | "no" | "later")
            }
          >
            <FormControlLabel value="si" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel
              value="later"
              control={<Radio />}
              label="Lo haré más tarde"
            />
          </RadioGroup>

          <Collapse in={wants360 === "si"}>
            <Typography mt={2} mb={1}>
              ¿Cómo deseas {initialData?.tour360Id ? "editar" : "agregar"} el
              recorrido 360°?
            </Typography>

            <RadioGroup
              value={tourOption}
              onChange={(e) =>
                setTourOption(e.target.value as "solicitar" | "agregar")
              }
            >
              <FormControlLabel
                value="solicitar"
                control={<Radio />}
                label="Quiero que alguien del equipo de Spacio tome las fotos 360° de mi ambiente, contactándose conmigo."
              />
              <FormControlLabel
                value="agregar"
                control={<Radio />}
                label={`Prefiero ${initialData?.tour360Id ? "editar" : "agregar"} el recorrido yo mismo`}
              />
            </RadioGroup>

            {isBlocked && tourOption === "solicitar" && (
              <Alert severity="error">
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  Solo se puede solicitar una captura 360 cada <b>4 meses</b>.
                </Typography>
                {lastRequestUnix && nextEligibleUnix && (
                  <>
                    <Typography variant="body2">
                      Última solicitud: <b>{formatDateEs(lastRequestUnix)}</b>
                    </Typography>
                    <Typography variant="body2">
                      Próxima fecha habilitada:{" "}
                      <b>{formatDateEs(nextEligibleUnix)}</b>
                    </Typography>
                  </>
                )}
              </Alert>
            )}

            <Collapse in={tourOption === "agregar"}>
              <Box mt={2}>
                <Alert severity="success">
                  Puedes crear tu recorrido usando una cámara 360° o
                  aplicaciones móviles como <strong>P360</strong>. Una vez
                  tomadas las fotos, podrás subirlas para conectar las escenas
                  (puertas, pasillos, habitaciones, etc.).
                </Alert>

                <Typography mt={2}>
                  Al hacer clic en una zona del recorrido podrás enlazar otra
                  imagen 360°, simulando la navegación entre tus espacios.
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => handleSubmit()}
                >
                  Guardar y Crear Recorrido 360°
                </Button>
              </Box>
            </Collapse>
          </Collapse>
        </Box>
      )}

      {/* Barra inferior */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "background.paper",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
          py: 1.5,
          display: "flex",
          justifyContent: "center",
          zIndex: 100000,
        }}
      >
        <Stack direction="row" spacing={2}>
          {tab > 0 && (
            <Button variant="outlined" onClick={handlePrev}>
              Anterior
            </Button>
          )}
          {tab < 7 ? (
            <Button variant="contained" onClick={handleNext}>
              Siguiente
            </Button>
          ) : tourOption !== "agregar" || wants360 !== "si" ? (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? <CircularProgress size={22} /> : "Guardar Ambiente"}
            </Button>
          ) : (
            <></>
          )}
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default CreateEnvironmentForm;
