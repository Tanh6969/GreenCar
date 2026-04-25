import { useEffect, useState } from "react";
import { vehicleService } from "../services/vehicle.service";
import { VehicleCardData } from "../types/vehicle.type";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService.getVehicleCards().then((data) => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  return { vehicles, loading };
};
