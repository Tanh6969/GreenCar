import React from "react";
import { Link } from "react-router-dom";
import { VehicleCardData } from "../../../types/vehicle.type";
import { formatCurrency } from "../../../utils/formatters";

interface Props {
  data: VehicleCardData;
  price4h: number;
  price24h: number;
}

const CarCard: React.FC<Props> = ({ data, price4h, price24h }) => {
  return (
    <article className="car-card">
      <img src={data.image?.image_url} alt={data.model.name} />
      <div className="car-content">
        <h4>{`${data.model.brand} ${data.model.name}`}</h4>
        <p>{`${data.location.name}, ${data.location.city}`}</p>
        <p>{`${data.model.seats} cho - ${data.model.transmission}`}</p>
        <div className="price-row">
          <strong>{`${formatCurrency(price4h)}/4h`}</strong>
          <strong>{`${formatCurrency(price24h)}/24h`}</strong>
        </div>
        <Link to={`/cars/${data.vehicle.vehicle_id}`} className="link-btn">Xem chi tiet</Link>
      </div>
    </article>
  );
};

export default CarCard;
