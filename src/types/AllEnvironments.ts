export interface EnvironmentType {
  name: string;
  publicKey: string;
  description: string | null;
  iconUrl: string | null;
}

export interface PricingPolicy {
  basePrice: number;
  currency: string;
  priceUnit: string;
  extraGuestPrice: number;
}

export interface Environment {
  publicId: string;
  ownerId: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  type: EnvironmentType;
  tour360Id: string;
  instantBooking: boolean;
  minRentalTime: number;
  maxRentalTime: number;
  rentalUnit: string;
  photoUrls: string[];
  pricingPolicies: PricingPolicy[];
}
