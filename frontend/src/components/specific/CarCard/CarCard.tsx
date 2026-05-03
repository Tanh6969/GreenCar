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
  const { model, vehicle, location, image } = data;

  return (
    <article className="car-card">
      {image?.image_url ? (
        <img src={image.image_url} alt={model.name} className="car-card-img" />
      ) : (
        <div className="car-img-placeholder">🚗</div>
      )}

      <div className="car-content">
        <div className="car-header">
          <h4 className="car-name">{model.brand} {model.name}</h4>
          <span className="car-price-main">{formatCurrency(price24h)}<span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>/ngày</span></span>
        </div>

        <div className="car-specs-row">
          <div className="car-spec">
            <span className="spec-icon">⚡</span>
            <span className="spec-value">{model.range_km}km</span>
            <span className="spec-label">Range</span>
          </div>
          <div className="car-spec">
            <span className="spec-icon">🐎</span>
            <span className="spec-value">{model.horsepower}hp</span>
            <span className="spec-label">Power</span>
          </div>
          <div className="car-spec">
            <span className="spec-icon">💺</span>
            <span className="spec-value">{model.seats}</span>
            <span className="spec-label">Chỗ</span>
          </div>
        </div>

        <p className="car-meta-row">📍 {location.name}, {location.city}</p>

        <div className="price-row">
          <div className="price-item">
            <div className="price-value">{formatCurrency(price4h)}</div>
            <div className="price-label">/ 4 giờ</div>
          </div>
          <div style={{ width: 1, background: "var(--green-border)", alignSelf: "stretch" }} />
          <div className="price-item">
            <div className="price-value">{formatCurrency(price24h)}</div>
            <div className="price-label">/ 24 giờ</div>
          </div>
        </div>

        <Link to={`/cars/${vehicle.vehicle_id}`} className="link-btn">
          Chi tiết
        </Link>
      </div>
    </article>
  );
};

export default CarCard;
