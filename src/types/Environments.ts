type AreaQuantity = {
  AreaPublicKey: string;
  Quantity: number;
};

type PricingPolicy = {
  BasePrice: number;
  Currency: string;
  PriceUnit: string;
  ExtraGuestPrice?: number;
};

type DiscountPolicy = {
  MinHours: number;
  DiscountPercentage: number;
};

type WeeklySchedule = {
  DayOfWeek: number;
  StartTime: number;
  EndTime: number;
};
export type FormDataCreateEnv = {
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  typePublicKey: string;
  servicePublicKeys: string[];
  areas: AreaQuantity[];
  images: File[];
  equipment: string;
  pricingPolicies: PricingPolicy[];
  discountPolicies: DiscountPolicy[];
  weeklySchedules: WeeklySchedule[];
  request360Tour: boolean;
  capacity: number;
  instantBooking: boolean;
  minRentalTime: number;
  maxRentalTime: number;
  rentalUnit: "Horas" | "Días";
};
