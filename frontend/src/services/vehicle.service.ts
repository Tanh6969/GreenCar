import { locations, pricing, vehicleImages, vehicleModels, vehicles, vehicleFeatures, vehicleModelFeatures, vehicleSpecs } from "../data/mockData";
import { VehicleCardData } from "../types/vehicle.type";

const wait = async (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const vehicleService = {
  async getVehicleCards(): Promise<VehicleCardData[]> {
    await wait();
    return vehicles.map((vehicle) => ({
      vehicle,
      model: vehicleModels.find((m) => m.vehicle_model_id === vehicle.vehicle_model_id)!,
      location: locations.find((l) => l.location_id === vehicle.location_id)!,
      image: vehicleImages.find((img) => img.vehicle_model_id === vehicle.vehicle_model_id)
    }));
  },

  async getVehicleDetail(vehicleId: number) {
    await wait();
    const vehicle = vehicles.find((v) => v.vehicle_id === vehicleId)!;
    const model = vehicleModels.find((m) => m.vehicle_model_id === vehicle.vehicle_model_id)!;
    return {
      vehicle,
      model,
      location: locations.find((l) => l.location_id === vehicle.location_id),
      images: vehicleImages.filter((img) => img.vehicle_model_id === model.vehicle_model_id),
      specs: vehicleSpecs.filter((s) => s.vehicle_model_id === model.vehicle_model_id),
      features: vehicleModelFeatures
        .filter((mf) => mf.vehicle_model_id === model.vehicle_model_id)
        .map((mf) => vehicleFeatures.find((f) => f.feature_id === mf.feature_id)!),
      pricing: pricing.filter((p) => p.vehicle_model_id === model.vehicle_model_id)
    };
  }
};
