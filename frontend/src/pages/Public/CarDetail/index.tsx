import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { vehicleService } from "../../../services/vehicle.service";
import { formatCurrency } from "../../../utils/formatters";

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

const FEATURE_ICONS: Record<string, string> = {
  "Camera 360°": "📷",
  "Cruise Control": "🛞",
  "Màn hình lớn": "🖥️",
  "Autopilot": "🤖",
  "Sạc nhanh DC": "⚡",
  "Cửa sổ trời": "☀️",
  "Ghế sưởi": "🔥",
  "Đỗ xe tự động": "🅿️",
  "Hệ thống âm thanh premium": "🎵",
  "AWD": "⚙️",
};

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
        <p className="text-4xl mb-3">🚗</p>
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
  const mainImg = images[imgIdx]?.image_url;

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
              <div className="w-full h-full flex items-center justify-center text-7xl">🚗</div>
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
                  <p className="text-sm text-[#6E7A72] mt-1">📍 {location.name}, {location.city}</p>
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
            {[
              { icon: "⚡", label: "Phạm vi", val: `${model.range_km} km` },
              { icon: "🐎", label: "Công suất", val: `${model.horsepower} hp` },
              { icon: "💺", label: "Số chỗ", val: `${model.seats} chỗ` },
              { icon: "🛡️", label: "Túi khí", val: `${model.airbags} túi` },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#BDCAC1] p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">{s.icon}</div>
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
                    <span>{FEATURE_ICONS[f.feature_name] ?? "✓"}</span>
                    {f.feature_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* eco badge */}
          <div className="bg-gradient-to-r from-[#F0FDF4] to-[#dcfce7] border border-[#bbf7d0] rounded-xl p-5 flex items-center gap-4">
            <div className="text-4xl">🌱</div>
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
