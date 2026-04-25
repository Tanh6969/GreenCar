import React from "react";
import CarCard from "../../../components/specific/CarCard/CarCard";
import BrandFilter from "../../../components/specific/BrandFilter/BrandFilter";
import Spinner from "../../../components/common/Spinner";
import { pricing } from "../../../data/mockData";
import { useVehicles } from "../../../hooks/useVehicles";

const CarListPage: React.FC = () => {
  const { vehicles, loading } = useVehicles();
  const [brand, setBrand] = React.useState("all");
  const brands = Array.from(new Set(vehicles.map((v) => v.model.brand)));

  const data = vehicles.filter((v) => brand === "all" || v.model.brand === brand);

  return (
    <div className="section">
      <h1>Danh sach xe</h1>
      <BrandFilter brands={brands} active={brand} onChange={setBrand} />
      {loading ? <Spinner /> : (
        <div className="car-grid">
          {data.map((item) => (
            <CarCard
              key={item.vehicle.vehicle_id}
              data={item}
              price4h={pricing.find((p) => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 1)?.price ?? 0}
              price24h={pricing.find((p) => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 3)?.price ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarListPage;
