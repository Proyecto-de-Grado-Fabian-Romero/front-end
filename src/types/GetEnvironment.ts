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
  services: Service[];
  environmentAreas: AreaItem[];
  equipment: string; // JSON string
  pricingPolicies: PricingPolicy[];
  tour360Id?: string;
};
