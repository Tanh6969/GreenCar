import { Pricing, RentalPlan } from "../types/booking.type";

export const estimatePrice = (basePrice: number, overtimeFee = 0, overKmFee = 0): number => {
  return basePrice + overtimeFee + overKmFee;
};

export const getPlanPrice = (
  modelId: number,
  planId: number,
  pricingList: Pricing[]
): number => {
  return pricingList.find((p) => p.vehicle_model_id === modelId && p.rental_plan_id === planId)?.price ?? 0;
};

export const summarizePlan = (plan: RentalPlan): string => {
  return `${plan.name} - gioi han ${plan.max_km}km`;
};
