// src/types/earnings.ts
export type MonthlyEarningPointDto = {
  year: number;
  month: number; // 1..12
  total: number;
  currency: string;
};

export type MonthlyEarningsResponseDto = {
  ownerId: string;
  currency: string;
  points: MonthlyEarningPointDto[];
};
