import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../../../context/BookingContext";
import { homepageTestimonials, locations, pricing } from "../../../data/mockData";
import { MODEL_LOCAL_IMAGES, PREMIUM_IMAGES } from "../../../data/localImages";
import { useVehicles } from "../../../hooks/useVehicles";
import { formatCurrency } from "../../../utils/formatters";
import { VehicleCardData } from "../../../types/vehicle.type";

import heroBg from "../../../assets/images/Premium EV Experience.png";

const LUXURY_MODEL_IDS = [9, 10, 11, 12, 13, 14];
const BRANDS = ["TESLA", "VINFAST", "HYUNDAI", "RIVIAN", "LUCID", "POLESTAR"];

function getImage(data: VehicleCardData): string | undefined {
  return MODEL_LOCAL_IMAGES[data.model.vehicle_model_id] ?? data.image?.image_url;
}

function dedupeByModel(list: VehicleCardData[]): VehicleCardData[] {
  const seen = new Set<number>();
  return list.filter(v => {
    if (seen.has(v.model.vehicle_model_id)) return false;
    seen.add(v.model.vehicle_model_id);
    return true;
  });
}

/* ── car card in horizontal scroll ───────────────────────── */
interface ScrollCardProps {
  data: VehicleCardData;
  price4h: number;
  price24h: number;
}

const ScrollCard: React.FC<ScrollCardProps> = ({ data, price4h, price24h }) => {
  const { model, vehicle, location } = data;
  const isLuxury = LUXURY_MODEL_IDS.includes(model.vehicle_model_id);
  const img = getImage(data);
  const available = vehicle.status === "available";

  return (
    <Link
      to={`/cars/${vehicle.vehicle_id}`}
      className={`flex-shrink-0 w-60 rounded-2xl overflow-hidden border transition-all duration-200
        hover:-translate-y-1 hover:shadow-xl group snap-start
        ${isLuxury ? "bg-[#0F172A] border-[#334155]" : "bg-white border-[#E5E7EB]"}`}
    >
      <div className="relative overflow-hidden">
        {img ? (
          <img src={img} alt={model.name}
            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-36 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] flex items-center justify-center text-5xl">🚗</div>
        )}
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full
          ${available ? "bg-[#006C4C] text-white" : "bg-[#9CA3AF] text-white"}`}>
          {available ? "Còn trống" : "Đã đặt"}
        </span>
      </div>

      <div className="p-3.5">
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5
          ${isLuxury ? "text-[#4FBD91]" : "text-[#006C4C]"}`}>{model.brand}</p>
        <h4 className={`font-bold text-sm leading-tight mb-2
          ${isLuxury ? "text-white" : "text-[#191C1E]"}`}>{model.name}</h4>

        <div className="flex gap-2 text-[10px] mb-3">
          <span className={`px-1.5 py-0.5 rounded-full ${isLuxury ? "bg-[#1E293B] text-[#94A3B8]" : "bg-[#F3F4F6] text-[#3E4943]"}`}>
            ⚡ {model.range_km}km
          </span>
          <span className={`px-1.5 py-0.5 rounded-full ${isLuxury ? "bg-[#1E293B] text-[#94A3B8]" : "bg-[#F3F4F6] text-[#3E4943]"}`}>
            💺 {model.seats} chỗ
          </span>
        </div>

        <div className={`border-t pt-2.5 flex justify-between items-end
          ${isLuxury ? "border-[#334155]" : "border-[#F3F4F6]"}`}>
          <div>
            <div className="text-[#006C4C] font-bold text-sm">{formatCurrency(price24h)}</div>
            <div className={`text-[10px] ${isLuxury ? "text-[#64748B]" : "text-[#9CA3AF]"}`}>/ngày</div>
          </div>
          <div className={`text-[10px] ${isLuxury ? "text-[#64748B]" : "text-[#9CA3AF]"}`}>
            {formatCurrency(price4h)}/4h
          </div>
        </div>

        {location && (
          <p className={`text-[10px] mt-1.5 ${isLuxury ? "text-[#4FBD91]" : "text-[#6E7A72]"}`}>
            📍 {location.name}
          </p>
        )}
      </div>
    </Link>
  );
};

/* ── horizontal carousel row ─────────────────────────────── */
interface CarRowProps {
  id?: string;
  title: string;
  subtitle: string;
  cars: VehicleCardData[];
  dark?: boolean;
}

const CarRow: React.FC<CarRowProps> = ({ id, title, subtitle, cars, dark = false }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    rowRef.current?.scrollBy({ left: dir === "right" ? 260 : -260, behavior: "smooth" });

  if (cars.length === 0) return null;

  return (
    <section id={id} className={`py-12 ${dark ? "bg-[#0F172A]" : "bg-white"}`}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1
              ${dark ? "text-[#4FBD91]" : "text-[#6E7A72]"}`}>{subtitle}</p>
            <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-[#191C1E]"}`}>{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll("left")}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-colors
                ${dark ? "border-[#334155] text-white hover:bg-[#1E293B]" : "border-[#BDCAC1] text-[#3E4943] hover:bg-[#F3F4F6]"}`}>
              ‹
            </button>
            <button onClick={() => scroll("right")}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-colors
                ${dark ? "border-[#334155] text-white hover:bg-[#1E293B]" : "border-[#BDCAC1] text-[#3E4943] hover:bg-[#F3F4F6]"}`}>
              ›
            </button>
            <Link to="/cars"
              className={`ml-2 text-xs font-semibold transition-colors hidden sm:block
                ${dark ? "text-[#4FBD91] hover:text-white" : "text-[#006C4C] hover:text-[#004832]"}`}>
              Xem tất cả →
            </Link>
          </div>
        </div>

        <div ref={rowRef} className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-2 snap-x">
          {cars.map(item => {
            const p4h  = pricing.find(p => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 1)?.price ?? 0;
            const p24h = pricing.find(p => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 3)?.price ?? 0;
            return <ScrollCard key={item.vehicle.vehicle_id} data={item} price4h={p4h} price24h={p24h} />;
          })}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link to="/cars"
            className={`text-sm font-semibold ${dark ? "text-[#4FBD91]" : "text-[#006C4C]"}`}>
            Xem tất cả →
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ── search widget ────────────────────────────────────────── */
const SearchWidget: React.FC = () => {
  const { search, setSearch } = useContext(BookingContext);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl">
      <h3 className="font-bold text-[#191C1E] mb-4 text-base">Tìm xe nhanh</h3>

      <div className="mb-3">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E7A72] mb-1">Địa điểm đón</label>
        <select
          value={search.locationId ?? ""}
          onChange={e => setSearch({ ...search, locationId: Number(e.target.value) || null })}
          className="w-full h-10 border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#191C1E] bg-white focus:outline-none focus:border-[#006C4C]"
        >
          <option value="">Chọn quận / khu vực</option>
          {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.name} — {l.city}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E7A72] mb-1">Nhận xe</label>
          <input type="date" value={search.startDate}
            onChange={e => setSearch({ ...search, startDate: e.target.value })}
            className="w-full h-10 border border-[#E5E7EB] rounded-lg px-3 text-sm focus:outline-none focus:border-[#006C4C]" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E7A72] mb-1">Trả xe</label>
          <input type="date" value={search.endDate}
            onChange={e => setSearch({ ...search, endDate: e.target.value })}
            className="w-full h-10 border border-[#E5E7EB] rounded-lg px-3 text-sm focus:outline-none focus:border-[#006C4C]" />
        </div>
      </div>

      <button onClick={() => navigate("/cars")}
        className="w-full bg-[#4FBD91] hover:bg-[#006C4C] text-[#004832] hover:text-white font-bold py-3 rounded-xl text-sm transition-all">
        Tìm Xe Trống →
      </button>

      <div className="flex justify-between items-center mt-3 text-[10px] text-[#9CA3AF]">
        <span>⚡ Sạc đầy trước mỗi chuyến</span>
        <span>🛡️ Bảo hiểm đầy đủ</span>
      </div>
    </div>
  );
};

/* ── main page ────────────────────────────────────────────── */
const HomePage: React.FC = () => {
  const { vehicles, loading } = useVehicles();

  const available   = dedupeByModel(vehicles.filter(v => v.vehicle.status === "available"));
  const luxury      = dedupeByModel(vehicles.filter(v => LUXURY_MODEL_IDS.includes(v.model.vehicle_model_id)));
  const recommended = dedupeByModel(vehicles.filter(v => v.model.range_km >= 420 && !LUXURY_MODEL_IDS.includes(v.model.vehicle_model_id)));

  return (
    <div className="w-full">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full grid lg:grid-cols-[1fr_400px] gap-10 items-center">
          <div>
            <p className="text-[#4FBD91] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              100% Electric Vehicle Fleet
            </p>
            <h1 className="text-5xl font-black text-white leading-[1.1] mb-4">
              Thuê Xe Điện<br />Tự Lái Tại Hà Nội
            </h1>
            <p className="text-white/75 text-sm leading-relaxed mb-7 max-w-md">
              Đội xe VinFast, Tesla, Hyundai, Audi, Polestar. Linh hoạt theo giờ &amp; ngày. Sạc đầy, bảo hiểm đầy đủ.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/cars"
                className="bg-[#4FBD91] hover:bg-[#3aad7e] text-[#004832] font-bold px-6 py-3 rounded-full text-sm transition-all hover:shadow-lg">
                Đặt xe ngay
              </Link>
              <a href="#available"
                className="border border-white/50 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all">
                Xem xe có sẵn
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* ── MOBILE SEARCH ─────────────────────────────────────── */}
      <div className="lg:hidden bg-[#F8F9FB] px-4 py-5">
        <SearchWidget />
      </div>

      {/* ── BRANDS BAR ────────────────────────────────────────── */}
      <div className="bg-white border-y border-[#E5E7EB] py-4">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-4">
          {BRANDS.map(b => (
            <span key={b} className="text-base font-black text-[#BDCAC1] tracking-wider whitespace-nowrap hover:text-[#006C4C] transition-colors cursor-default">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <div className="bg-[#F8F9FB] border-b border-[#E5E7EB] py-5">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E5E7EB]">
          {[
            { num: "15+",    lbl: "Mẫu xe điện" },
            { num: "7",      lbl: "Điểm đón Hà Nội" },
            { num: "20K+",   lbl: "Chuyến thành công" },
            { num: "4.9 ★",  lbl: "Đánh giá trung bình" },
          ].map(s => (
            <div key={s.lbl} className="text-center px-4 py-2">
              <div className="text-xl font-black text-[#006C4C]">{s.num}</div>
              <div className="text-[11px] text-[#6E7A72] mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CAROUSELS ─────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-20 bg-white">
          <div className="w-9 h-9 border-4 border-[#bbf7d0] border-t-[#006C4C] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <CarRow id="available" title="Xe Có Ngay" subtitle="Đặt ngay hôm nay" cars={available} />
          <CarRow title="Xe Sang" subtitle="Premium" cars={luxury} dark />
          <CarRow title="Có Lẽ Bạn Sẽ Thích" subtitle="Gợi ý" cars={recommended} />
        </>
      )}

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="bg-[#F8F9FB] py-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6E7A72] mb-1">Quy trình</p>
            <h2 className="text-xl font-bold text-[#191C1E]">Đặt xe chỉ 3 bước</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "🔍", title: "Chọn xe & địa điểm", desc: "Lọc theo loại xe, khu vực đón và ngày giờ phù hợp." },
              { step: "02", icon: "📋", title: "Đặt & thanh toán",   desc: "Xác nhận thông tin, chọn gói thuê và thanh toán an toàn." },
              { step: "03", icon: "🚗", title: "Nhận xe & lái",      desc: "Nhận xe tại điểm hẹn. Xe đã sạc đầy, bảo hiểm đầy đủ." },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center hover:border-[#BDCAC1] transition-colors">
                <div className="text-3xl mb-3">{s.icon}</div>
                <p className="text-[10px] font-black text-[#006C4C] uppercase tracking-[0.15em] mb-1">Bước {s.step}</p>
                <h3 className="font-bold text-[#191C1E] text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-[#6E7A72] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM DARK ──────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4FBD91] mb-1">Cao cấp</p>
              <h2 className="text-xl font-bold text-white">Dòng Xe Sang Premium</h2>
              <p className="text-[#64748B] text-xs mt-1">Trải nghiệm cao cấp nhất — dành cho dịp đặc biệt.</p>
            </div>
            <Link to="/cars" className="text-xs font-semibold text-[#4FBD91] hover:text-white transition-colors hidden sm:block">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { img: PREMIUM_IMAGES.lucidDream, brand: "Lucid",  name: "Air Dream Edition", price: "4.200.000", range: "837km", accel: "2.7s" },
              { img: PREMIUM_IMAGES.rivianR1S,  brand: "Rivian", name: "R1S Adventure",     price: "3.400.000", range: "505km", accel: "3.0s" },
              { img: PREMIUM_IMAGES.lucidAir,   brand: "Lucid",  name: "Air Grand Touring", price: "3.800.000", range: "760km", accel: "3.0s" },
            ].map(car => (
              <div key={car.name}
                className="bg-[#1E293B] rounded-2xl overflow-hidden border border-[#334155] hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
                <div className="relative">
                  <img src={car.img} alt={car.name} className="w-full h-48 object-cover" />
                  <span className="absolute top-3 right-3 bg-[#006C4C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    PREMIUM
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[#64748B] text-xs mb-0.5">{car.brand}</p>
                  <p className="text-white font-bold mb-1">{car.name}</p>
                  <p className="text-[#4FBD91] font-bold text-lg mb-4">
                    {car.price}đ<span className="text-[#64748B] text-xs font-normal">/ngày</span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-4 border-t border-[#334155] text-xs">
                    <div>
                      <span className="text-[#64748B]">Range: </span>
                      <span className="text-white font-semibold">{car.range}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">0–100: </span>
                      <span className="text-white font-semibold">{car.accel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECO SECTION ───────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-gradient-to-br from-[#F0FDF4] to-[#dcfce7] rounded-3xl p-10 grid sm:grid-cols-[1fr_auto] gap-8 items-center border border-[#bbf7d0]">
            <div>
              <span className="inline-block bg-[#006C4C] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                🌱 Eco Impact
              </span>
              <h2 className="text-xl font-bold text-[#191C1E] mb-2">
                Cộng đồng GreenCar đã tiết kiệm 4.2 tấn CO₂
              </h2>
              <p className="text-sm text-[#3E4943] leading-relaxed mb-5 max-w-md">
                Mỗi chuyến thuê xe điện thay vì xe xăng giúp giảm trung bình 2.3kg CO₂. Hơn 20.000 chuyến đang tạo ra sự thay đổi thực sự.
              </p>
              <Link to="/cars"
                className="inline-block bg-[#006C4C] hover:bg-[#004832] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors">
                Bắt đầu hành trình xanh →
              </Link>
            </div>
            <div className="flex sm:flex-col gap-3">
              {[
                { icon: "🌳", num: "12.5K", lbl: "Trees equivalent" },
                { icon: "🔋", num: "450K",  lbl: "kWh tiết kiệm" },
                { icon: "🚗", num: "20K+",  lbl: "Chuyến thành công" },
              ].map(s => (
                <div key={s.lbl} className="bg-white rounded-xl border border-[#bbf7d0] p-4 text-center min-w-[100px] shadow-sm">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-bold text-[#191C1E] text-base">{s.num}</div>
                  <div className="text-[9px] font-bold text-[#6E7A72] uppercase tracking-wide mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="bg-[#F8F9FB] py-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6E7A72] mb-1">Đánh giá</p>
            <h2 className="text-xl font-bold text-[#191C1E]">Khách Hàng Nói Gì</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {homepageTestimonials.map(t => (
              <div key={t.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#BDCAC1] transition-colors">
                <div className="text-[#4FBD91] text-sm mb-2">★★★★★</div>
                <p className="text-sm text-[#3E4943] leading-relaxed italic mb-4">"{t.message}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#006C4C] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#191C1E]">{t.name}</div>
                    <div className="text-[10px] text-[#6E7A72]">{t.area}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
