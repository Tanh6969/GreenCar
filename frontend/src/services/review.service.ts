import { reviews } from "../data/mockData";

const wait = async (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const reviewService = {
  async getReviewsByModel(vehicleModelId: number) {
    await wait();
    return reviews.filter((r) => r.vehicle_model_id === vehicleModelId);
  }
};
