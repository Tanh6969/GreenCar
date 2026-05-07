import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { vehicleService } from "../../../services/vehicle.service";
import { MODEL_LOCAL_IMAGES } from "../../../data/localImages";
import { formatCurrency } from "../../../utils/formatters";

// ── icons ─────────────────────────────────────────────────────
const IcCarLg  = () => <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#BDCAC1" strokeWidth="1" strokeLinecap="round"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-3h8l3 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
const IcPin    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcBolt   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><polyline points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>;
const IcPower  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
const IcSeat   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcLeaf   = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="1.5" strokeLinecap="round"><path d="M2 22l10-10"/><path d="M13.5 21.5C18 21.5 21 17.5 21 12c0-5.5-4-9-9-9C7 3 3 7 3 12c0 3 1.5 5.5 4 7l6.5 2.5z"/></svg>;

interface DetailData {
  vehicle: { vehicle_id: number; license_plate: string; status: string; battery_level: number; battery_health: number };
  model: { vehicle_model_id: number; name: string; brand: string; seats: number; horsepower: number; range_km: number; trunk_capacity: number; airbags: number; vehicle_type: string; transmission: string };
  location?: { name: string; city: string; address: string };
  images: { image_id: number; image_url: string }[];
  specs: { spec_id: number; spec_name: string; spec_value: string }[];
  features: { feature_id: number; feature_name: string }[];
  pricing: { pricing_id: number; rental_plan_id: number; price: number }[];
}

const PLAN_LABELS: Record<number, { label: string; sub: string }> = {
  1: { label: "Gói 4 giờ",  sub: "Tối đa 150km" },
  2: { label: "Gói 8 giờ",  sub: "Tối đa 250km" },
  3: { label: "Gói 24 giờ", sub: "Tối đa 400km" },
};

const IcCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(3);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    vehicleService.getVehicleDetail(Number(id)).then((d) => {
      setData(d as DetailData);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#bbf7d0] border-t-[#006C4C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-[#6E7A72]">
        <div className="flex justify-center mb-3"><IcCarLg /></div>
        <p className="font-semibold text-lg">Không tìm thấy xe.</p>
        <Link to="/cars" className="mt-4 inline-block text-[#006C4C] font-semibold hover:underline">
          ← Quay lại danh sách xe
        </Link>
      </div>
    );
  }

  const { vehicle, model, location, images, specs, features, pricing } = data;
  const available = vehicle.status === "available";
  const selectedPrice = pricing.find(p => p.rental_plan_id === selectedPlan)?.price ?? 0;
  const mainImg = MODEL_LOCAL_IMAGES[model.vehicle_model_id] ?? images[imgIdx]?.image_url;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* breadcrumb */}
      <div className="bg-white border-b border-[#BDCAC1]">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-[#6E7A72]">
          <Link to="/" className="hover:text-[#006C4C]">Trang chủ</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-[#006C4C]">Danh sách xe</Link>
          <span>/</span>
          <span className="text-[#006C4C] font-semibold">{model.brand} {model.name}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">

        {/* ── LEFT: images + info ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* main image */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] aspect-[16/9]">
            {mainImg ? (
              <img src={mainImg} alt={model.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><IcCarLg /></div>
            )}
            <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow
              ${available ? "bg-[#006C4C] text-white" : "bg-[#E5E7EB] text-[#6E7A72]"}`}>
              {available ? "✓ Còn trống" : "✗ Đã đặt"}
            </span>
          </div>

          {/* thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={img.image_id} onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all
                    ${i === imgIdx ? "border-[#006C4C]" : "border-transparent opacity-60 hover:opacity-90"}`}>
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* title + badge */}
          <div>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className="text-xs font-semibold bg-[#dcfce7] text-[#006C4C] px-2.5 py-1 rounded-full">
                  {model.brand}
                </span>
                <h1 className="text-2xl font-bold text-[#191C1E] mt-2">{model.brand} {model.name}</h1>
                {location && (
                  <p className="text-sm text-[#6E7A72] mt-1"><IcPin />{location.name}, {location.city}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#6E7A72] uppercase tracking-wide">Biển số</p>
                <p className="font-mono font-bold text-[#191C1E]">{vehicle.license_plate}</p>
              </div>
            </div>
          </div>

          {/* EV key specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { icon: <IcBolt />,   label: "Phạm vi",  val: `${model.range_km} km` },
              { icon: <IcPower />,  label: "Công suất", val: `${model.horsepower} hp` },
              { icon: <IcSeat />,   label: "Số chỗ",   val: `${model.seats} chỗ` },
              { icon: <IcShield />, label: "Túi khí",  val: `${model.airbags} túi` },
            ] as { icon: React.ReactNode; label: string; val: string }[]).map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#BDCAC1] p-4 text-center shadow-sm">
                <div className="flex justify-center mb-1">{s.icon}</div>
                <div className="text-[10px] text-[#6E7A72] uppercase tracking-wide">{s.label}</div>
                <div className="font-bold text-[#191C1E] text-sm mt-0.5">{s.val}</div>
              </div>
            ))}
          </div>

          {/* battery + transmission */}
          <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-[#191C1E]">Pin & Truyền động</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#6E7A72] mb-1">Mức pin hiện tại</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#006C4C] rounded-full transition-all"
                      style={{ width: `${vehicle.battery_level}%` }} />
                  </div>
                  <span className="font-bold text-[#006C4C] w-10 text-right">{vehicle.battery_level}%</span>
                </div>
              </div>
              <div>
                <p className="text-[#6E7A72] mb-1">Sức khỏe pin</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4FBD91] rounded-full"
                      style={{ width: `${vehicle.battery_health}%` }} />
                  </div>
                  <span className="font-bold text-[#4FBD91] w-10 text-right">{vehicle.battery_health}%</span>
                </div>
              </div>
              <div>
                <p className="text-[#6E7A72]">Hộp số</p>
                <p className="font-semibold text-[#191C1E]">{model.transmission}</p>
              </div>
              <div>
                <p className="text-[#6E7A72]">Loại xe</p>
                <p className="font-semibold text-[#191C1E]">{model.vehicle_type}</p>
              </div>
              <div>
                <p className="text-[#6E7A72]">Cốp xe</p>
                <p className="font-semibold text-[#191C1E]">{model.trunk_capacity} L</p>
              </div>
            </div>
          </div>

          {/* specs */}
          {specs.length > 0 && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm">
              <h3 className="font-bold text-[#191C1E] mb-4">Thông số kỹ thuật</h3>
              <div className="flex flex-col gap-2">
                {specs.map(s => (
                  <div key={s.spec_id} className="flex justify-between items-center py-2 border-b border-[#F3F4F6] last:border-0 text-sm">
                    <span className="text-[#6E7A72]">{s.spec_name}</span>
                    <span className="font-semibold text-[#191C1E]">{s.spec_value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* features */}
          {features.length > 0 && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm">
              <h3 className="font-bold text-[#191C1E] mb-4">Tính năng nổi bật</h3>
              <div className="flex flex-wrap gap-2">
                {features.map(f => (
                  <span key={f.feature_id}
                    className="flex items-center gap-1.5 bg-[#F0FDF4] border border-[#bbf7d0] text-[#006C4C] text-sm font-medium px-3 py-1.5 rounded-full">
                    <IcCheck />
                    {f.feature_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* eco badge */}
          <div className="bg-gradient-to-r from-[#F0FDF4] to-[#dcfce7] border border-[#bbf7d0] rounded-xl p-5 flex items-center gap-4">
            <div className="flex-shrink-0"><IcLeaf /></div>
            <div>
              <p className="font-bold text-[#006C4C]">Eco Impact</p>
              <p className="text-sm text-[#3E4943]">
                Thuê xe điện này tiết kiệm ~{Math.round(model.range_km * 0.21 / 100)} kg CO₂ mỗi 100km so với xe xăng.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: booking card ── */}
        <div className="w-full lg:w-[360px] flex-shrink-0 sticky top-[84px]">
          <div className="bg-white rounded-2xl border border-[#BDCAC1] shadow-lg overflow-hidden">
            {/* card header */}
            <div className="bg-[#0F172A] p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold text-lg">{model.brand} {model.name}</p>
                  <p className="text-[#94A3B8] text-sm mt-0.5">{model.vehicle_type} • {model.seats} chỗ</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded
                  ${available ? "bg-[#10B981] text-white" : "bg-[#6B7280] text-white"}`}>
                  {available ? "TRỐNG" : "ĐÃ ĐẶT"}
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* rental plans */}
              <div>
                <p className="text-xs font-bold text-[#3E4943] uppercase tracking-wider mb-3">Chọn gói thuê</p>
                <div className="flex flex-col gap-2">
                  {pricing.map(p => {
                    const plan = PLAN_LABELS[p.rental_plan_id];
                    if (!plan) return null;
                    const isSelected = selectedPlan === p.rental_plan_id;
                    return (
                      <button key={p.pricing_id} onClick={() => setSelectedPlan(p.rental_plan_id)}
                        className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all text-left
                          ${isSelected
                            ? "border-[#006C4C] bg-[#ECFDF5]"
                            : "border-[#E5E7EB] hover:border-[#BDCAC1]"
                          }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${isSelected ? "border-[#006C4C] bg-[#006C4C]" : "border-[#9CA3AF]"}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${isSelected ? "text-[#191C1E]" : "text-[#3E4943]"}`}>
                              {plan.label}
                            </p>
                            <p className="text-xs text-[#6E7A72]">{plan.sub}</p>
                          </div>
                        </div>
                        <span className={`font-bold text-sm ${isSelected ? "text-[#006C4C]" : "text-[#191C1E]"}`}>
                          {formatCurrency(p.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* price summary */}
              <div className="bg-[#F8F9FB] rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6E7A72]">Tổng thanh toán</span>
                  <span className="text-xl font-bold text-[#006C4C]">{formatCurrency(selectedPrice)}</span>
                </div>
                <p className="text-xs text-[#6E7A72] mt-1">Đã bao gồm bảo hiểm pin & mạng sạc</p>
              </div>

              {/* CTA */}
              <button
                disabled={!available}
                onClick={() => navigate(`/customer/checkout?vehicle=${vehicle.vehicle_id}&plan=${selectedPlan}`)}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all
                  ${available
                    ? "bg-[#4FBD91] hover:bg-[#006C4C] text-[#004832] hover:text-white shadow-md hover:shadow-lg"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"}`}>
                {available ? "Đặt xe ngay" : "Xe đã được đặt"}
              </button>

              <p className="text-center text-xs text-[#6E7A72]">
                Miễn phí hủy trong vòng 24 giờ
              </p>
            </div>
          </div>

          {/* back link */}
          <Link to="/cars"
            className="mt-3 flex items-center justify-center gap-1.5 text-sm text-[#6E7A72] hover:text-[#006C4C] transition-colors">
            ← Xem thêm xe khác
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
