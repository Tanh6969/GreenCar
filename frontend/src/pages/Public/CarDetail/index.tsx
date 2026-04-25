import React from "react";
import { Link, useParams } from "react-router-dom";
import ReviewStars from "../../../components/common/ReviewStars";
import { reviewService } from "../../../services/review.service";
import { vehicleService } from "../../../services/vehicle.service";
import { formatCurrency } from "../../../utils/formatters";

const CarDetailPage: React.FC = () => {
  const { id } = useParams();
  const [detail, setDetail] = React.useState<any>(null);
  const [reviews, setReviews] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!id) return;
    vehicleService.getVehicleDetail(Number(id)).then((d) => {
      setDetail(d);
      reviewService.getReviewsByModel(d.model.vehicle_model_id).then(setReviews);
    });
  }, [id]);

  if (!detail) return <p>Dang tai...</p>;

  return (
    <div className="section">
      <Link to="/cars">← Quay lai danh sach</Link>
      <h1>{`${detail.model.brand} ${detail.model.name}`}</h1>
      <img className="detail-image" src={detail.images[0]?.image_url} alt={detail.model.name} />
      <div className="cards-2">
        <article className="panel">
          <h3>Thong so</h3>
          {detail.specs.map((s: any) => <p key={s.spec_id}>{`${s.spec_name}: ${s.spec_value}`}</p>)}
          <h4>Tinh nang</h4>
          <ul>
            {detail.features.map((f: any) => <li key={f.feature_id}>{f.feature_name}</li>)}
          </ul>
        </article>
        <article className="panel">
          <h3>Gia theo goi</h3>
          {detail.pricing.map((p: any) => <p key={p.pricing_id}>{formatCurrency(p.price)}</p>)}
          <Link className="link-btn" to="/customer/checkout">Dat xe</Link>
        </article>
      </div>
      <section className="section">
        <h3>Danh gia</h3>
        {reviews.map((r) => (
          <article key={r.review_id} className="panel">
            <ReviewStars value={r.rating} />
            <p>{r.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default CarDetailPage;
