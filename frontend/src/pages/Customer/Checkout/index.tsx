import React from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../../../services/booking.service";
import { vehicleService } from "../../../services/vehicle.service";
import { estimatePrice } from "../../../utils/calculators";
import { formatCurrency } from "../../../utils/formatters";

const CheckoutPage: React.FC = () => {
  const [cards, setCards] = React.useState<any[]>([]);
  const [plans, setPlans] = React.useState<any[]>([]);
  const [pricing, setPricing] = React.useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = React.useState<number>(1);
  const [selectedPlan, setSelectedPlan] = React.useState<number>(3);

  React.useEffect(() => {
    vehicleService.getVehicleCards().then(setCards);
    bookingService.getRentalPlans().then(setPlans);
    bookingService.getPricing().then(setPricing);
  }, []);

  const current = cards.find((c) => c.vehicle.vehicle_id === selectedVehicle);
  const base = pricing.find((p) => p.vehicle_model_id === current?.model.vehicle_model_id && p.rental_plan_id === selectedPlan)?.price ?? 0;
  const total = estimatePrice(base);

  return (
    <div className="section">
      <h1>Checkout</h1>
      <div className="cards-2">
        <article className="panel">
          <label>Chon xe
            <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(Number(e.target.value))}>
              {cards.map((c) => <option key={c.vehicle.vehicle_id} value={c.vehicle.vehicle_id}>{`${c.model.brand} ${c.model.name}`}</option>)}
            </select>
          </label>
          <label>Chon goi
            <select value={selectedPlan} onChange={(e) => setSelectedPlan(Number(e.target.value))}>
              {plans.map((p) => <option key={p.rental_plan_id} value={p.rental_plan_id}>{p.name}</option>)}
            </select>
          </label>
        </article>
        <article className="panel">
          <h3>Tom tat</h3>
          <p>{`Gia goi: ${formatCurrency(base)}`}</p>
          <p>{`Du kien thanh toan: ${formatCurrency(total)}`}</p>
          <Link className="link-btn" to="/customer/payment">Sang thanh toan</Link>
        </article>
      </div>
    </div>
  );
};

export default CheckoutPage;
