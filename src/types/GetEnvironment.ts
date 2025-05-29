type Photo = {
  fileId: string;
  fileName: string;
  url: string;
  order: number;
};

type Service = {
  name: string;
  publicKey: string;
};

type AreaItem = {
  area: {
    name: string;
    publicKey: string;
  };
  quantity: number;
};

type PricingPolicy = {
  basePrice: number;
  currency: string;
  priceUnit: string;
  extraGuestPrice: number;
};

type WeeklySchedule = {
  dayOfWeek: number;
  startTime: number;
  endTime: number;
};

export type DiscountPolicy = {
  minHours: number;
  discountPercentage: number;
};

export type Environment = {
  publicId: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  minRentalTime: number;
  maxRentalTime: number;
  type: {
    name: string;
    publicKey: string;
  };
  photos: Photo[];
  rentalUnit: string;
  services: Service[];
  environmentAreas: AreaItem[];
  equipment: string;
  pricingPolicies: PricingPolicy[];
  discountPolicies: DiscountPolicy[];
  weeklySchedules: WeeklySchedule[];
  tour360Id?: string;
  ownerId: string;
  instantBooking: boolean;
};
