import { useMemo } from "react";
import { Pricing } from "../types/booking.type";
import { getPlanPrice } from "../utils/calculators";

export const usePricing = (pricing: Pricing[], modelId: number) => {
  return useMemo(
    () => ({
      getPriceByPlan: (planId: number) => getPlanPrice(modelId, planId, pricing)
    }),
    [pricing, modelId]
  );
};
