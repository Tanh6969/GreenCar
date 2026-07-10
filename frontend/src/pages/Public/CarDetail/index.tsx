import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { vehicleService } from "../../../services/vehicle.service";
import { useAuth } from "../../../hooks/useAuth";
import { MODEL_LOCAL_IMAGES } from "../../../data/localImages";
import { formatCurrency } from "../../../utils/formatters";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// ── icons ─────────────────────────────────────────────────────
const IcCarLg  = () => <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#BDCAC1" strokeWidth="1" strokeLinecap="round"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-3h8l3 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
const IcPin    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcBolt   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><polyline points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>;
const IcPower  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
const IcSeat   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcLeaf   = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="1.5" strokeLinecap="round"><path d="M2 22l10-10"/><path d="M13.5 21.5C18 21.5 21 17.5 21 12c0-5.5-4-9-9-9C7 3 3 7 3 12c0 3 1.5 5.5 4 7l6.5 2.5z"/></svg>;

interface DetailData {
  vehicle: { 
    vehicle_id: number; 
    license_plate: string; 
    status: string; 
    battery_level: number; 
    battery_health: number;
    available_from?: string;
    available_to?: string;
    owner_id?: number;
  };
  model: { vehicle_model_id: number; name: string; brand: string; seats: number; horsepower: number; range_km: number; trunk_capacity: number; airbags: number; vehicle_type: string; transmission: string };
  location?: { name: string; city: string; address: string; latitude: number; longitude: number };
  images: { image_id: number; image_url: string }[];
  specs: { spec_id: number; spec_name: string; spec_value: string }[];
  features: { feature_id: number; feature_name: string }[];
  pricing: { pricing_id: number; rental_plan_id: number; price: number }[];
  reviews: { review_id: number; user_id: number; reviewer_name: string; rating: number; comment: string; created_at: string }[];
  owner?: { user_id: number; name: string; phone: string; trip_count: number; avg_rating: number };
  meta?: { avg_rating: number; review_count: number };
  active_bookings?: { start_time: string; end_time: string }[];
  promo_discount?: number;
  promo_end_date?: string;
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
  const { user } = useAuth();
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(3);
  const [imgIdx, setImgIdx] = useState(0);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [modalDeliveryType, setModalDeliveryType] = useState("custom");
  const [customAddress, setCustomAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"self" | "custom" | "airport">("self");
  const [showLightbox, setShowLightbox] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  const [searchParams] = useSearchParams();

  const getLocalDateStr = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
  };

  const [startDate, setStartDate] = useState(() => {
    const s = searchParams.get("startDate");
    if (s) return `${s}T09:00`;
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    return getLocalDateStr(now);
  });

  const [endDate, setEndDate] = useState(() => {
    const e = searchParams.get("endDate");
    if (e) return `${e}T20:00`;
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 25, 0, 0, 0);
    return getLocalDateStr(tomorrow);
  });

  useEffect(() => {
    const s = searchParams.get("startDate");
    const e = searchParams.get("endDate");
    if (s) setStartDate(`${s}T09:00`);
    if (e) setEndDate(`${e}T20:00`);
  }, [searchParams]);

  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    if (!id) return;
    vehicleService.getVehicleDetail(Number(id)).then((d) => {
      setData(d as unknown as DetailData);
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

  const { vehicle, model, location, images, specs, features, pricing, active_bookings } = data;
  
  const isHCM = location?.city?.toLowerCase().includes("hồ chí minh") || location?.city?.toLowerCase().includes("hcm");
  const airportName = isHCM ? "Sân bay Tân Sơn Nhất" : "Sân bay Nội Bài";

  // Overlap check
  let isOverlapping = false;
  let isOutsideAvailability = false;
  let overlappingRange: { start: string; end: string } | null = null;
  const userStart = new Date(startDate);
  const userEnd = new Date(endDate);
  
  if (active_bookings) {
    for (const b of active_bookings) {
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      if (userStart < bEnd && userEnd > bStart) {
        isOverlapping = true;
        overlappingRange = {
          start: bStart.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          end: bEnd.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        };
        break;
      }
    }
  }

  // Check if owner set specific availability window
  if (vehicle?.available_from && vehicle?.available_to) {
    const availStart = new Date(vehicle.available_from);
    const availEnd = new Date(vehicle.available_to);
    if (userStart < availStart || userEnd > availEnd) {
      isOutsideAvailability = true;
    }
  }

  const isStatusAllowed = vehicle?.status === "available" || vehicle?.status === "booked";
  const isOwner = user?.user_id && vehicle?.owner_id === user.user_id;
  const available = isStatusAllowed && !isOverlapping && !isOutsideAvailability && !isOwner;
  
  // Calculate pricing based on selected plan
  const selectedPrice = pricing.find(p => p.rental_plan_id === selectedPlan)?.price ?? 0;
  
  let galleryImages = images.map(img => img.image_url);
  if (galleryImages.length <= 1 && MODEL_LOCAL_IMAGES[model.vehicle_model_id]) {
    galleryImages = [
      MODEL_LOCAL_IMAGES[model.vehicle_model_id],
      "/images/extra_1.png",
      "/images/extra_2.png",
      "/images/extra_3.png"
    ];
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* breadcrumb */}
      <div className="bg-white border-b border-[#BDCAC1]">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-[#6E7A72]">
          <Link to="/" className="hover:text-[#006C4C]">Trang chủ</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-[#006C4C]">Danh sách xe</Link>
          <span>/</span>
          <span className="text-[#006C4C] font-semibold">{model.brand} {model.name}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">

        {/* ── LEFT: images + info ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* main image */}
          <div 
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] aspect-[16/9] cursor-pointer group"
            onClick={() => setShowLightbox(true)}
          >
            {galleryImages[imgIdx] ? (
              <img src={galleryImages[imgIdx]} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><IcCarLg /></div>
            )}
            <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow z-10
              ${available ? "bg-[#006C4C] text-white" : "bg-[#E5E7EB] text-[#6E7A72]"}`}>
              {available ? "✓ Còn trống" : "✗ Đã đặt"}
            </span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors flex items-center justify-center">
               <span className="opacity-0 group-hover:opacity-100 bg-white/60 text-[#191C1E] px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity backdrop-blur-sm">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-2 -mt-0.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                 Xem ảnh lớn
               </span>
            </div>
          </div>

          {/* thumbnail strip */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {galleryImages.map((url, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-[3px] transition-all
                  ${i === imgIdx ? "border-[#006C4C]" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

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

          {/* rental time */}
          <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
            <h3 className="font-bold text-[#191C1E] text-lg mb-4">Lịch trình chuyến đi</h3>
            <p className="text-sm text-[#6E7A72] mb-3">Vui lòng chọn thời gian bạn muốn thuê xe:</p>
            <div className={`grid grid-cols-2 gap-4 border ${isOverlapping ? "border-[#EF4444] bg-[#FEF2F2]" : "border-[#BDCAC1] bg-[#F8F9FB]"} rounded-xl p-4`}>
              <div>
                <p className="text-sm text-[#3E4943] font-semibold mb-1">Nhận xe</p>
                <input 
                  type="datetime-local" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="font-bold text-[#191C1E] bg-transparent border-none p-0 focus:ring-0 w-full"
                />
              </div>
              <div>
                <p className="text-sm text-[#3E4943] font-semibold mb-1">Trả xe</p>
                <input 
                  type="datetime-local" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="font-bold text-[#191C1E] bg-transparent border-none p-0 focus:ring-0 w-full"
                />
              </div>
            </div>

            {vehicle?.available_from && vehicle?.available_to && (
              <div className="mt-3 text-sm text-[#006C4C] font-medium bg-[#ECFDF5] p-3 rounded-lg border border-[#A7F3D0]">
                <span className="font-bold">Lịch xe hoạt động: </span>
                Từ {new Date(vehicle.available_from).toLocaleDateString("vi-VN")} đến {new Date(vehicle.available_to).toLocaleDateString("vi-VN")}
              </div>
            )}
            {/* Show overlapping error if user selected overlapping dates */}
            {isOverlapping && overlappingRange && (
              <p className="mt-3 text-[#EF4444] font-bold text-sm bg-[#FEF2F2] p-2 rounded-lg border border-[#FCA5A5]">
                ⚠ Thời gian bạn chọn bị trùng: Xe đã được đặt từ {overlappingRange.start} đến {overlappingRange.end}. Vui lòng chọn thời gian khác!
              </p>
            )}
            {/* Show outside availability error */}
            {isOutsideAvailability && vehicle?.available_from && vehicle?.available_to && (
              <p className="mt-3 text-[#EAB308] font-bold text-sm bg-[#FEFCE8] p-2 rounded-lg border border-[#FEF08A]">
                ⚠ Chủ xe chỉ nhận đặt xe trong khoảng từ {new Date(vehicle.available_from).toLocaleDateString("vi-VN")} đến {new Date(vehicle.available_to).toLocaleDateString("vi-VN")}. Vui lòng chọn lại ngày!
              </p>
            )}
            {/* Show all booked dates so user knows upfront */}
            {active_bookings && active_bookings.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-[#EF4444] mb-1">Xe đã được thuê:</p>
                <div className="flex flex-col">
                  {active_bookings.map((b, idx) => {
                    const s = new Date(b.start_time);
                    const e = new Date(b.end_time);
                    const sStr = `${s.getHours().toString().padStart(2, '0')}h${s.getMinutes().toString().padStart(2, '0')}, ${s.toLocaleDateString("vi-VN")}`;
                    const eStr = `${e.getHours().toString().padStart(2, '0')}h${e.getMinutes().toString().padStart(2, '0')}, ${e.toLocaleDateString("vi-VN")}`;
                    return (
                      <p key={idx} className="text-[#EF4444] text-sm">
                        - Từ {sStr} đến {eStr}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* location map */}
          {!isOwner && location && !!location.latitude && !!location.longitude && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
              <h3 className="font-bold text-[#191C1E] text-lg mb-4">Địa điểm giao nhận xe</h3>
              
              <div className="flex flex-col gap-3 mb-4">
                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${deliveryOption === "self" ? "border-[#006C4C]" : "border-[#E5EBE8]"}`}>
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${deliveryOption === "self" ? "border-[#006C4C]" : "border-[#9CA3AF]"}`}>
                    {deliveryOption === "self" && <div className="w-2.5 h-2.5 rounded-full bg-[#006C4C]"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#191C1E]">Tôi tự đến lấy xe</span>
                      <span className="text-[#10B981] font-semibold text-sm">Miễn phí</span>
                    </div>
                    <p className="text-sm text-[#3E4943] font-medium">{location.address}, {location.city}</p>
                  </div>
                </label>

                <label 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeliveryModal(true);
                  }}
                  className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${deliveryOption !== "self" ? "border-[#006C4C]" : "border-[#E5EBE8]"}`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${deliveryOption !== "self" ? "border-[#006C4C]" : "border-[#9CA3AF]"}`}>
                    {deliveryOption !== "self" && <div className="w-2.5 h-2.5 rounded-full bg-[#006C4C]"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#191C1E]">Tôi muốn được giao xe tận nơi</span>
                    </div>
                    <p className="text-sm text-[#6E7A72]">
                      {deliveryOption === "custom" && customAddress 
                        ? `Địa chỉ nhận xe: ${customAddress}`
                        : deliveryOption === "airport" 
                          ? `Giao xe ${airportName}` 
                          : "Chủ xe sẽ giao và nhận xe đến tận nhà hoặc địa chỉ mà bạn lựa chọn trên ứng dụng."}
                    </p>
                  </div>
                </label>
              </div>

              <div className="h-[250px] rounded-xl overflow-hidden border border-[#E5EBE8] z-0">
                <MapContainer center={[location.latitude, location.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.latitude, location.longitude]}>
                    <Popup>
                      <div className="font-bold">{location.name}</div>
                      <div className="text-xs">{location.address}</div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

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

          {/* insurance */}
          {!isOwner && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
              <h3 className="font-bold text-[#191C1E] mb-2 text-lg flex items-center gap-2">
                <IcShield /> Bảo hiểm thuê xe
              </h3>
              <p className="text-sm text-[#3E4943] mb-2">Chuyến đi có mua bảo hiểm. Khách thuê bồi thường tối đa 2.000.000 VNĐ trong trường hợp có sự cố ngoài ý muốn.</p>
              <button onClick={() => setShowInsuranceModal(true)} className="text-sm font-bold text-[#191C1E] hover:text-[#006C4C] underline-offset-2 underline">Xem thêm &gt;</button>
            </div>
          )}

          {/* terms and conditions */}
          {!isOwner && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
              <h3 className="font-bold text-[#191C1E] mb-4 text-lg">Điều khoản</h3>
              <div className="text-sm text-[#3E4943] flex flex-col gap-2">
                <p className="font-medium">Quy định khác:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#6E7A72]">
                  <li>Sử dụng xe đúng mục đích.</li>
                  <li>Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.</li>
                  <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
                  <li>Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</li>
                  <li>Không chở hàng quốc cấm dễ cháy nổ.</li>
                  <li>Không chở hoa quả, thực phẩm nặng mùi trong xe.</li>
                  <li>Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.</li>
                </ul>
                <p className="text-xs text-[#006C4C] mt-2 font-semibold cursor-pointer">Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời!</p>
              </div>
            </div>
          )}

          {/* extra fees */}
          {!isOwner && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
              <h3 className="font-bold text-[#191C1E] mb-4 text-lg">Phụ phí có thể phát sinh</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[#191C1E]">Phí vượt giới hạn</span>
                    <span className="font-semibold text-[#10B981]">3.000đ /km</span>
                  </div>
                  <p className="text-sm text-[#6E7A72]">Phụ phí phát sinh nếu di chuyển vượt quá <strong className="text-[#3E4943]">350 km</strong> khi thuê xe <strong className="text-[#3E4943]">1 ngày</strong>.</p>
                </div>
                <div className="h-px bg-[#E5EBE8] w-full"></div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[#191C1E]">Phí quá giờ</span>
                    <span className="font-semibold text-[#10B981]">70.000đ /giờ</span>
                  </div>
                  <p className="text-sm text-[#6E7A72]">Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá <strong className="text-[#3E4943]">3 giờ</strong> phụ phí thêm 1 ngày thuê.</p>
                </div>
                <div className="h-px bg-[#E5EBE8] w-full"></div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[#191C1E]">Phụ phí khác</span>
                    <span className="font-semibold text-[#10B981]">Thỏa thuận</span>
                  </div>
                  <p className="text-sm text-[#6E7A72]">Phụ phí phát sinh nếu xe không đảm bảo vệ sinh hoặc bị ám mùi (hút thuốc, sầu riêng, hải sản...).</p>
                </div>
              </div>
            </div>
          )}

          {/* cancellation policy */}
          {!isOwner && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
              <h3 className="font-bold text-[#191C1E] mb-3 text-lg">Chính sách hủy chuyến</h3>
              <p className="text-sm text-[#3E4943]">
                An tâm thuê xe, không lo bị phạt với <span className="font-semibold text-[#006C4C] cursor-pointer hover:underline" onClick={() => setShowCancellationModal(true)}>Chính sách hủy chuyến của GreenCar!</span> Miễn phí hủy trong vòng 24 giờ sau khi đặt thành công.
              </p>
            </div>
          )}

          {/* ── OWNER BLOCK ── */}
          {!isOwner && (data as any).owner && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
              <h3 className="font-bold text-[#191C1E] mb-4 text-lg">Chủ xe</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E8F5F0] flex items-center justify-center text-2xl font-bold text-[#006C4C] flex-shrink-0">
                  {(data as any).owner.name?.charAt(0) ?? "G"}
                </div>
                <div>
                  <p className="font-bold text-[#191C1E] text-base">{(data as any).owner.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-[#6E7A72]">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold text-[#191C1E]">{(data as any).owner.avg_rating?.toFixed(1) ?? "5.0"}</span>
                    </span>
                    <span>•</span>
                    <span><strong className="text-[#191C1E]">{(data as any).owner.trip_count ?? 0}</strong> chuyến</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="bg-[#F0FDF4] rounded-xl p-3">
                  <p className="font-bold text-[#006C4C] text-base">100%</p>
                  <p className="text-xs text-[#6E7A72] mt-0.5">Tỉ lệ phản hồi</p>
                </div>
                <div className="bg-[#F0FDF4] rounded-xl p-3">
                  <p className="font-bold text-[#006C4C] text-base">100%</p>
                  <p className="text-xs text-[#6E7A72] mt-0.5">Tỉ lệ đồng ý</p>
                </div>
                <div className="bg-[#F0FDF4] rounded-xl p-3">
                  <p className="font-bold text-[#006C4C] text-base">&lt;1h</p>
                  <p className="text-xs text-[#6E7A72] mt-0.5">Phản hồi trong</p>
                </div>
              </div>
            </div>
          )}

          {/* ── REVIEWS BLOCK ── */}
          {(data as any).reviews?.length > 0 && (
            <div className="bg-white rounded-xl border border-[#BDCAC1] p-5 shadow-sm mt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#191C1E] text-lg">Đánh giá từ khách thuê</h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-bold text-[#191C1E]">
                    {(data as any).meta?.avg_rating?.toFixed(1) ?? "5.0"}
                  </span>
                  <span className="text-[#6E7A72] text-sm">({(data as any).reviews.length} đánh giá)</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {(data as any).reviews.slice(0, 5).map((rv: any) => (
                  <div key={rv.review_id} className="flex gap-3 pb-4 border-b border-[#F0F0F0] last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-[#E8F5F0] flex items-center justify-center text-base font-bold text-[#006C4C] flex-shrink-0">
                      {rv.reviewer_name?.charAt(0) ?? "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-[#191C1E] text-sm">{rv.reviewer_name || "Ẩn danh"}</p>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={s <= rv.rating ? "text-yellow-400" : "text-[#E5E7EB]"}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#6E7A72] mt-0.5">
                        {rv.created_at ? new Date(rv.created_at).toLocaleDateString("vi-VN") : ""}
                      </p>
                      <p className="text-sm text-[#3E4943] mt-2 leading-relaxed">{rv.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: booking card ── */}
        {!isOwner && (
          <div className="w-full lg:w-[360px] flex-shrink-0 sticky top-[84px]">
          <div className="bg-white rounded-2xl border border-[#BDCAC1] shadow-lg overflow-hidden">
            {/* card header */}
            <div className="bg-[#F8FAFC] p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#191C1E] font-bold text-lg">{model.brand} {model.name}</p>
                  <p className="text-[#475569] text-sm mt-0.5">{model.vehicle_type} • {model.seats} chỗ</p>
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
                    const hasPromo = (data?.promo_discount ?? 0) > 0;
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
                        {hasPromo ? (
                          <div className="text-right">
                            <p className="text-xs text-[#6E7A72] line-through leading-none mb-0.5">{formatCurrency(p.price)}</p>
                            <p className={`font-bold text-sm ${isSelected ? "text-[#EF4444]" : "text-[#191C1E]"}`}>{formatCurrency(p.price * (1 - (data?.promo_discount ?? 0) / 100))}</p>
                          </div>
                        ) : (
                          <span className={`font-bold text-sm ${isSelected ? "text-[#006C4C]" : "text-[#191C1E]"}`}>
                            {formatCurrency(p.price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* price summary */}
              <div className="bg-[#F8F9FB] rounded-xl p-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6E7A72]">Tổng thanh toán</span>
                  {(data?.promo_discount ?? 0) > 0 ? (
                    <div className="text-right">
                      <span className="text-sm text-[#6E7A72] line-through mr-2 font-normal">{formatCurrency(selectedPrice)}</span>
                      <span className="text-xl font-bold text-[#EF4444]">{formatCurrency(selectedPrice * (1 - (data?.promo_discount ?? 0) / 100))}</span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-[#006C4C]">{formatCurrency(selectedPrice)}</span>
                  )}
                </div>
                <p className="text-xs text-[#6E7A72] mt-1">Đã bao gồm bảo hiểm pin & mạng sạc</p>
              </div>

              {/* CTA */}
              <button
                disabled={!available}
                onClick={() => {
                  let url = `/customer/checkout?vehicle=${vehicle.vehicle_id}&plan=${selectedPlan}&startDate=${startDate}&endDate=${endDate}&delivery=${deliveryOption}`;
                  if (deliveryOption === "custom" && customAddress) {
                    url += `&address=${encodeURIComponent(customAddress)}`;
                  } else if (deliveryOption === "airport") {
                    url += `&address=${encodeURIComponent(airportName)}`;
                  }
                  navigate(url);
                }}
                className={`w-full py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all
                  ${available
                    ? "bg-[#4FBD91] hover:bg-[#006C4C] text-[#004832] hover:text-white shadow-md hover:shadow-lg"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                {isOwner ? "Đây là xe của bạn" : (available ? "Chọn thuê" : "Không thể đặt")}
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
        )}
      </div>



      {/* INSURANCE MODAL */}
      {showInsuranceModal && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-white/40 p-4" onClick={() => setShowInsuranceModal(false)}>
          <div className="bg-white w-full sm:w-[500px] rounded-2xl flex flex-col max-h-[90vh] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E5EBE8]">
              <h3 className="font-bold text-lg text-[#006C4C]">Bảo hiểm thuê xe tự lái</h3>
              <button onClick={() => setShowInsuranceModal(false)} className="text-[#6E7A72] hover:bg-[#F3F4F6] rounded-full p-2">✕</button>
            </div>
            <div className="p-5 overflow-y-auto text-[#3E4943] text-sm leading-relaxed flex flex-col gap-4">
              <p>Với nhiều năm kinh nghiệm trong lĩnh vực cho thuê xe tự lái, GreenCar hiểu rằng các rủi ro đâm đụng, cháy nổ, thủy kích gây tổn thất lớn (vượt quá khả năng chi trả) luôn tiềm ẩn trong thời gian thuê xe.</p>
              <p>❌ Trong khi đó, hầu hết các rủi ro phát sinh trong quá trình thuê xe tự lái sẽ <strong className="text-red-500">không thuộc phạm vi</strong> của <strong>Bảo hiểm thân vỏ xe theo năm</strong> (hay còn gọi là Bảo hiểm 2 chiều).</p>
              <p>✅ Xuất phát từ nhu cầu thiết yếu của khách hàng, GreenCar kết hợp cùng đối tác bảo hiểm hàng đầu Việt Nam cung cấp sản phẩm <strong>Bảo hiểm thuê xe tự lái</strong> với mức phí thực sự tiết kiệm và số tiền bảo hiểm lớn giúp bạn an tâm tận hưởng chuyến đi.</p>
              
              <h4 className="font-bold text-base text-[#191C1E] mt-2">I. Nội dung sản phẩm bảo hiểm thuê xe</h4>
              <p>Trong thời gian thuê xe, nếu xảy ra các sự cố va chạm ngoài ý muốn dẫn đến tổn thất về xe, khách thuê sẽ chỉ bồi thường số tiền <strong>tối đa 2.000.000 VNĐ</strong> để sửa chữa xe (mức khấu trừ), nhà bảo hiểm sẽ hỗ trợ cho các chi phí phát sinh vượt mức khấu trừ.</p>

              <div className="border border-[#E5EBE8] rounded-xl overflow-hidden mt-2 text-center text-xs">
                <div className="grid grid-cols-3 bg-[#F8F9FB] p-3 font-bold text-[#191C1E] border-b border-[#E5EBE8]">
                  <div>Thiệt hại xe</div>
                  <div>Khách thanh toán</div>
                  <div>BH thanh toán</div>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-[#E5EBE8]">
                  <div>{'<='} 2 triệu</div>
                  <div>{'<='} 2 triệu</div>
                  <div>0 triệu</div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div>{'>'} 2 triệu</div>
                  <div>2 triệu</div>
                  <div>Phần còn lại</div>
                </div>
              </div>

              <h4 className="font-bold text-base text-[#191C1E] mt-2">II. Điều khoản Bảo hiểm</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bảo hiểm vật chất xe: đâm va, hỏa hoạn, cháy nổ.</li>
                <li>Miễn phí cứu hộ tối đa 70 km/vụ.</li>
                <li>Bảo hiểm thủy kích (khấu trừ 20% số tiền bảo hiểm, tối thiểu 3.000.000 VNĐ).</li>
                <li>Mức khấu trừ: <strong>2.000.000 VNĐ/vụ</strong>.</li>
              </ul>
              
              <h4 className="font-bold text-base text-[#191C1E] mt-2">III. Quy trình xử lý nếu xảy ra sự cố</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Khách thuê <strong>giữ nguyên hiện trường và chụp ảnh xe đang bị sự cố</strong>.</li>
                <li>Tại thời điểm xảy ra sự cố, khách thuê gọi đến trung tâm bồi thường của nhà bảo hiểm (MIC - 1900 55 88 91), đọc số hợp đồng bảo hiểm và làm theo hướng dẫn tổng đài.</li>
                <li>Giám định viên bảo hiểm liên hệ khách thuê để hướng dẫn xử lí, xác minh thông tin.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION POLICY MODAL */}
      {showCancellationModal && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-white/40 p-4" onClick={() => setShowCancellationModal(false)}>
          <div className="bg-white w-full sm:w-[500px] rounded-2xl flex flex-col max-h-[90vh] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E5EBE8]">
              <h3 className="font-bold text-lg text-[#006C4C]">Chính sách hủy chuyến của GreenCar</h3>
              <button onClick={() => setShowCancellationModal(false)} className="text-[#6E7A72] hover:bg-[#F3F4F6] rounded-full p-2">✕</button>
            </div>
            <div className="p-5 overflow-y-auto text-[#3E4943] text-sm leading-relaxed flex flex-col gap-4">
              <p>GreenCar hỗ trợ khách hàng thay đổi kế hoạch với chính sách hủy chuyến minh bạch và linh hoạt nhằm đảm bảo quyền lợi cho cả người thuê lẫn chủ xe.</p>
              
              <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#bbf7d0]">
                <h4 className="font-bold text-base text-[#006C4C] mb-2 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Hủy chuyến Miễn Phí
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-[#3E4943]">
                  <li>Trong vòng <strong>24 giờ</strong> kể từ lúc đặt xe và thanh toán thành công.</li>
                  <li>HOẶC trước thời điểm nhận xe ít nhất <strong>48 giờ</strong>.</li>
                </ul>
                <p className="mt-2 text-[#006C4C] font-semibold text-xs">» Bạn sẽ được hoàn lại 100% số tiền đã thanh toán.</p>
              </div>

              <h4 className="font-bold text-base text-[#191C1E] mt-2">I. Hủy chuyến sát giờ (Phạt phí)</h4>
              <p>Nếu bạn hủy chuyến trong vòng <strong>48 giờ</strong> trước thời điểm nhận xe, bạn sẽ phải chịu phí hủy chuyến tương đương <strong>30% giá trị hợp đồng</strong> (nhưng không thấp hơn giá trị 1 ngày thuê xe). Số tiền còn lại sẽ được hoàn trả vào tài khoản của bạn.</p>

              <h4 className="font-bold text-base text-[#191C1E] mt-2">II. Chủ xe hủy chuyến</h4>
              <p>Trong trường hợp hãn hữu chủ xe (hoặc GreenCar) không thể giao xe và buộc phải hủy chuyến của bạn, bạn sẽ được:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hoàn lại 100% số tiền đã thanh toán.</li>
                <li>Nhận ngay một <strong className="text-[#006C4C]">voucher giảm giá 10%</strong> (tối đa 500k) cho chuyến đi tiếp theo thay cho lời xin lỗi.</li>
              </ul>

              <h4 className="font-bold text-base text-[#191C1E] mt-2">III. Không nhận xe (No-show)</h4>
              <p>Nếu đến giờ nhận xe mà bạn không có mặt và không có bất kỳ thông báo nào cho chủ xe/GreenCar, hợp đồng sẽ tự động bị hủy và bạn sẽ <strong>không được hoàn tiền</strong> cọc/tiền thuê xe.</p>
            </div>
          </div>
        </div>
      )}
      {/* LIGHTBOX MODAL */}
      {showLightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-4" onClick={() => setShowLightbox(false)}>
          <button className="absolute top-6 right-6 text-[#191C1E] hover:text-[#334155]" onClick={() => setShowLightbox(false)}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          
          <button className="absolute left-6 text-white hover:text-gray-300 p-4" onClick={(e) => { e.stopPropagation(); setImgIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); }}>
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <img src={galleryImages[imgIdx]} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />

          <button className="absolute right-6 text-white hover:text-gray-300 p-4" onClick={(e) => { e.stopPropagation(); setImgIdx((prev) => (prev + 1) % galleryImages.length); }}>
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-semibold">
            {imgIdx + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* ── DELIVERY MODAL ── */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-fade-in sm:items-center sm:justify-center sm:bg-[#191C1E]/60 sm:p-4">
          <div className="bg-white sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-md flex flex-col shadow-2xl">
            <div className="flex items-center p-4 border-b border-[#E5EBE8]">
              <button onClick={() => setShowDeliveryModal(false)} className="text-[#191C1E] p-2 hover:bg-gray-100 rounded-full mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <h3 className="font-bold text-[#191C1E] text-lg flex-1 text-center pr-10">Địa điểm giao nhận xe</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <div className="bg-[#F8F9FB] rounded-xl p-4 text-sm flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[#3E4943]">Dịch vụ giao xe tận nơi</span>
                  <span className="font-semibold text-[#191C1E]">trong vòng 15 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3E4943]">Phí giao nhận xe (2 chiều)</span>
                  <span className="font-semibold text-[#191C1E]">15.000đ /km</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-[#191C1E] text-base">Địa chỉ tùy chỉnh</h4>
                  <span className="text-[#10B981] font-semibold text-sm cursor-pointer hover:underline">Thay đổi</span>
                </div>
                <label className="flex items-center gap-3 p-4 border border-[#E5EBE8] rounded-xl cursor-pointer hover:border-[#BDCAC1] transition-colors">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${modalDeliveryType === "custom" ? "border-[#006C4C]" : "border-[#9CA3AF]"}`}>
                    {modalDeliveryType === "custom" && <div className="w-2.5 h-2.5 rounded-full bg-[#006C4C]"></div>}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={customAddress}
                      onChange={(e) => {
                        setCustomAddress(e.target.value);
                        setModalDeliveryType("custom");
                      }}
                      placeholder="Nhập địa chỉ tùy chỉnh" 
                      className="w-full text-sm text-[#191C1E] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent"
                      onClick={() => setModalDeliveryType("custom")}
                    />
                  </div>
                </label>
              </div>

              {/* Removed 'Nhập địa chỉ của tôi' because user does not have address field */}

              <div>
                <h4 className="font-bold text-[#191C1E] text-base mb-3">Giao xe sân bay</h4>
                <label className="flex justify-between items-center p-4 border border-[#E5EBE8] rounded-xl cursor-pointer hover:border-[#BDCAC1] transition-colors" onClick={() => setModalDeliveryType("airport")}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${modalDeliveryType === "airport" ? "border-[#006C4C]" : "border-[#9CA3AF]"}`}>
                      {modalDeliveryType === "airport" && <div className="w-2.5 h-2.5 rounded-full bg-[#006C4C]"></div>}
                    </div>
                    <span className="font-semibold text-[#191C1E]">{airportName}</span>
                  </div>
                  <span className="font-bold text-[#191C1E]">150.000đ</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5EBE8]">
              <button
                onClick={() => {
                  setDeliveryOption(modalDeliveryType === "airport" ? "airport" : "custom");
                  setShowDeliveryModal(false);
                }}
                className={`w-full font-bold py-3.5 rounded-xl text-base transition-colors
                  ${modalDeliveryType 
                    ? "bg-[#006C4C] hover:bg-[#005a3e] text-white" 
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"}`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;
