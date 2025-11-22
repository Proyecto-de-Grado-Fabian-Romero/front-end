import { FormDataCreateEnv } from "@/types/Environments";
import { Environment } from "@/types/GetEnvironment";
import { Moment } from "moment";

export function envToFormData(env: Environment): FormDataCreateEnv {
  return {
    title: env.title ?? "",
    description: env.description ?? "",
    location: env.location ?? "",
    latitude: env.latitude ?? 0,
    longitude: env.longitude ?? 0,
    typePublicKey: env.type?.publicKey ?? "hospedajes",
    servicePublicKeys: env.services?.map((s) => s.publicKey) ?? [],
    areas:
      env.environmentAreas?.map((a) => ({
        AreaPublicKey: a.area.publicKey,
        Quantity: a.quantity,
      })) ?? [],
    images: [],

    equipment: env.equipment ?? "{}", // si es JSON string, OK
    pricingPolicies: (env.pricingPolicies ?? []).map((p) => ({
      BasePrice: p.basePrice,
      Currency: p.currency,
      PriceUnit: p.priceUnit,
      ExtraGuestPrice: p.extraGuestPrice,
    })),
    discountPolicies: (env.discountPolicies ?? []).map((d) => ({
      MinHours: d.minHours,
      DiscountPercentage: d.discountPercentage,
    })),
    weeklySchedules: (env.weeklySchedules ?? []).map((s) => ({
      DayOfWeek: s.dayOfWeek,
      StartTime: s.startTime,
      EndTime: s.endTime,
    })),

    request360Tour: !!env.tour360Id,
    capacity: env.capacity ?? 0,
    instantBooking: !!env.instantBooking,
    minRentalTime: env.minRentalTime ?? 1,
    maxRentalTime: env.maxRentalTime ?? 24,
    rentalUnit: env.rentalUnit ?? "Horas",
  };
}

// Devuelve unix seconds (o cambia a valueOf() para ms)
export const buildTimestampsForRequest = (
  startDate: Moment | null,
  endDate: Moment | null,
  startTime: Moment | null,
  endTime: Moment | null,
  isHospedaje: boolean,
) => {
  if (!startDate) return null;

  // hospedaje: usar full days
  if (isHospedaje) {
    const s = startDate.clone().startOf("day");
    const e = endDate
      ? endDate.clone().startOf("day")
      : s.clone().add(1, "day");
    return {
      startDate: s.unix(), // segundos
      endDate: e.unix(),
    };
  }

  // no hospedaje: combinar fecha + hora (si existe startTime/endTime)
  const sTime = startTime ?? startDate.clone().hour(0).minute(0);
  const eTime = endTime ?? sTime.clone().add(2, "hours");

  // construir startMoment y endMoment tomando la fecha de startDate/endDate
  const startMoment = startDate
    .clone()
    .hour(sTime.hour())
    .minute(sTime.minute())
    .second(0);

  // endDate puede ser distinto (si el usuario escogió otro día)
  const endDateToUse = endDate ?? startDate;
  let endMoment = endDateToUse
    .clone()
    .hour(eTime.hour())
    .minute(eTime.minute())
    .second(0);

  // si endMoment queda antes de startMoment asumimos día siguiente
  if (endMoment.isSameOrBefore(startMoment)) {
    endMoment = endMoment.add(1, "day");
  }

  return {
    startDate: startMoment.unix(), // segundos
    endDate: endMoment.unix(),
  };
};
