import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../../../context/BookingContext";
import { homepageTestimonials, locations, pricing } from "../../../data/mockData";
import { useVehicles } from "../../../hooks/useVehicles";
import { formatCurrency } from "../../../utils/formatters";
import { VehicleCardData } from "../../../types/vehicle.type";

import heroBg        from "../../../assets/images/Premium EV Experience.png";
import lucidPureImg  from "../../../assets/images/Lucid Air Pure.png";
import teslaImg      from "../../../assets/images/Tesla Model 3.png";
import hyundaiImg    from "../../../assets/images/Hyundai Ioniq 5.png";
import lucidDreamImg from "../../../assets/images/Lucid Air Dream.png";
import rivianImg     from "../../../assets/images/Rivian R1S.png";
import lucidImg      from "../../../assets/images/Lucid Air.png";

const LUXURY_MODEL_IDS = [9, 10, 11, 12, 13, 14];
const BRANDS = ["TESLA", "VINFAST", "HYUNDAI", "RIVIAN", "LUCID", "POLESTAR"];

/* ── mini car card for horizontal scroll ─────────────────── */
interface ScrollCardProps {
  data: VehicleCardData;
  price4h: number;
  price24h: number;
}

const ScrollCard: React.FC<ScrollCardProps> = ({ data, price4h, price24h }) => {
  const { model, vehicle, location, image } = data;
  const isLuxury = LUXURY_MODEL_IDS.includes(model.vehicle_model_id);

  return (
    <Link
      to={`/cars/${vehicle.vehicle_id}`}
      className={`
        flex-shrink-0 w-64 rounded-2xl overflow-hidden border transition-all duration-200
        hover:-translate-y-1 hover:shadow-xl group
        ${isLuxury ? "bg-[#0F172A] border-[#334155]" : "bg-white border-[#BDCAC1]"}
      `}
    >
      {image?.image_url ? (
        <img src={image.image_url} alt={model.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] flex items-center justify-center text-5xl">🚗</div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${isLuxury ? "text-[#4FBD91]" : "text-[#006C4C]"}`}>
              {model.brand}
            </p>
            <h4 className={`font-bold text-sm leading-tight ${isLuxury ? "text-white" : "text-[#191C1E]"}`}>
              {model.name}
            </h4>
          </div>
          {isLuxury && (
            <span className="bg-[#006C4C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PREMIUM</span>
          )}
        </div>

        <div className="flex gap-3 my-2 py-2 border-t border-b border-[#BDCAC1]/30">
          <div className="text-center flex-1">
            <div className={`text-xs font-bold ${isLuxury ? "text-white" : "text-[#191C1E]"}`}>{model.range_km}km</div>
            <div className="text-[10px] text-[#6E7A72] uppercase tracking-wide">Range</div>
          </div>
          <div className="text-center flex-1">
            <div className={`text-xs font-bold ${isLuxury ? "text-white" : "text-[#191C1E]"}`}>{model.horsepower}hp</div>
            <div className="text-[10px] text-[#6E7A72] uppercase tracking-wide">Power</div>
          </div>
          <div className="text-center flex-1">
            <div className={`text-xs font-bold ${isLuxury ? "text-white" : "text-[#191C1E]"}`}>{model.seats} chỗ</div>
            <div className="text-[10px] text-[#6E7A72] uppercase tracking-wide">Seats</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-[#006C4C] font-bold text-sm">{formatCurrency(price24h)}</span>
            <span className={`text-[10px] ml-0.5 ${isLuxury ? "text-[#94A3B8]" : "text-[#6E7A72]"}`}>/ngày</span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full
            ${isLuxury ? "bg-[#1E293B] text-[#4FBD91]" : "bg-[rgba(79,189,145,0.10)] text-[#006C4C]"}`}>
            📍 {location.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ── horizontal scroll row ────────────────────────────────── */
interface CarRowProps {
  title: string;
  subtitle: string;
  cars: VehicleCardData[];
  dark?: boolean;
}

const CarRow: React.FC<CarRowProps> = ({ title, subtitle, cars, dark = false }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <div className={`py-12 ${dark ? "bg-[#0F172A]" : "bg-white"}`}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dark ? "text-[#4FBD91]" : "text-[#6E7A72]"}`}>
              {subtitle}
            </p>
            <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-[#191C1E]"}`}>{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll("left")}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors
                ${dark ? "border-[#334155] text-white hover:bg-[#1E293B]" : "border-[#BDCAC1] text-[#3E4943] hover:bg-[#F3F4F6]"}`}>
              ←
            </button>
            <button onClick={() => scroll("right")}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors
                ${dark ? "border-[#334155] text-white hover:bg-[#1E293B]" : "border-[#BDCAC1] text-[#3E4943] hover:bg-[#F3F4F6]"}`}>
              →
            </button>
          </div>
        </div>

        {/* scroll track */}
        <div ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {cars.map((item) => {
            const p4h  = pricing.find(p => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 1)?.price ?? 0;
            const p24h = pricing.find(p => p.vehicle_model_id === item.model.vehicle_model_id && p.rental_plan_id === 3)?.price ?? 0;
            return (
              <div key={item.vehicle.vehicle_id} className="snap-start">
                <ScrollCard data={item} price4h={p4h} price24h={p24h} />
              </div>
            );
          })}
        </div>

        {/* view all */}
        <div className="mt-5 text-center">
          <Link to="/cars"
            className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors
              ${dark ? "text-[#4FBD91] hover:text-white" : "text-[#006C4C] hover:text-[#004832]"}`}>
            Xem thêm →
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ── search widget ────────────────────────────────────────── */
const SearchWidget: React.FC = () => {
  const { search, setSearch } = useContext(BookingContext);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-7 shadow-2xl border border-white/20">
      <h3 className="text-base font-semibold text-[#191C1E] mb-5">Tìm xe phù hợp</h3>

      <div className="mb-3">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3E4943] mb-1.5">
          Địa điểm đón
        </label>
        <select
          value={search.locationId ?? ""}
          onChange={e => setSearch({ ...search, locationId: Number(e.target.value) || null })}
          className="w-full h-11 border border-[#BDCAC1] rounded-lg px-3 text-sm text-[#191C1E] bg-white focus:outline-none focus:border-[#006C4C] focus:ring-2 focus:ring-[#006C4C]/10"
        >
          <option value="">Chọn quận / khu vực</option>
          {locations.map(l => (
            <option key={l.location_id} value={l.location_id}>{l.name} — {l.city}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3E4943] mb-1.5">Nhận xe</label>
          <input type="date" value={search.startDate}
            onChange={e => setSearch({ ...search, startDate: e.target.value })}
            className="w-full h-11 border border-[#BDCAC1] rounded-lg px-3 text-sm text-[#191C1E] focus:outline-none focus:border-[#006C4C] focus:ring-2 focus:ring-[#006C4C]/10" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3E4943] mb-1.5">Trả xe</label>
          <input type="date" value={search.endDate}
            onChange={e => setSearch({ ...search, endDate: e.target.value })}
            className="w-full h-11 border border-[#BDCAC1] rounded-lg px-3 text-sm text-[#191C1E] focus:outline-none focus:border-[#006C4C] focus:ring-2 focus:ring-[#006C4C]/10" />
        </div>
      </div>

      <button
        onClick={() => navigate("/cars")}
        className="w-full bg-[#4FBD91] hover:bg-[#3aad7e] text-[#004832] font-bold py-3.5 rounded-lg text-sm transition-colors tracking-wide"
      >
        TÌM XE TRỐNG
      </button>

      <p className="text-xs text-[#6E7A72] mt-3 flex items-center justify-between">
        <span>⚡ Sạc đầy trước mỗi chuyến</span>
        <Link to="/cars" className="text-[#316BF3] font-semibold hover:underline">Bộ lọc nâng cao</Link>
      </p>
    </div>
  );
};

/* ── homepage ─────────────────────────────────────────────── */
const HomePage: React.FC = () => {
  const { vehicles, loading } = useVehicles();

  const available  = vehicles.filter(v => v.vehicle.status === "available");
  const luxury     = vehicles.filter(v => LUXURY_MODEL_IDS.includes(v.model.vehicle_model_id));
  const recommended = vehicles.filter(v => v.model.range_km >= 450 && !LUXURY_MODEL_IDS.includes(v.model.vehicle_model_id));

  return (
    <div className="w-full">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[620px] overflow-hidden flex items-center">
        <img src={heroBg} alt="hero" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,20,12,0.78)] via-[rgba(0,20,12,0.45)] to-transparent" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full grid grid-cols-[1fr_460px] gap-12 items-center">
          <div>
            <p className="text-[#4FBD91] text-xs font-bold uppercase tracking-widest mb-4">
              Drive the Evolution of Mobility.
            </p>
            <h1 className="text-[52px] font-black text-white leading-[1.1] tracking-tight mb-4">
              Thuê Xe Điện<br />Tự Lái Tại Hà Nội
            </h1>
            <p className="text-white/80 text-base leading-relaxed mb-8 max-w-[440px]">
              Đội xe 100% EV — VinFast, Tesla, Hyundai Ioniq, Audi, Polestar.
              Linh hoạt theo giờ &amp; ngày. Sạc đầy, bảo hiểm đầy đủ.
            </p>
            <div className="flex gap-3">
              <Link to="/cars"
                className="bg-[#4FBD91] hover:bg-[#3aad7e] text-[#004832] font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Tìm xe ngay
              </Link>
              <a href="#available"
                className="border border-white/60 hover:border-white hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all">
                Xem xe có sẵn
              </a>
            </div>
          </div>
          <SearchWidget />
        </div>
      </section>

      {/* ── BRANDS BAR ────────────────────────────────────────── */}
      <div className="bg-[#F3F4F6] border-t border-b border-[#BDCAC1] py-5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between gap-6 opacity-40">
            {BRANDS.map(b => (
              <span key={b} className="text-xl font-black text-[#191C1E] tracking-wide whitespace-nowrap">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#BDCAC1] py-6">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-4 divide-x divide-[#BDCAC1]">
            {[
              { num: "500+",    lbl: "Xe điện sẵn sàng" },
              { num: "7",       lbl: "Điểm đón tại Hà Nội" },
              { num: "20.000+", lbl: "Chuyến thành công" },
              { num: "4.9 ★",   lbl: "Đánh giá trung bình" },
            ].map(s => (
              <div key={s.lbl} className="text-center px-6 py-2">
                <div className="text-2xl font-black text-[#006C4C]">{s.num}</div>
                <div className="text-xs text-[#6E7A72] font-semibold mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3 CAROUSEL SECTIONS ───────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-20 bg-white">
          <div className="w-9 h-9 border-4 border-[#bbf7d0] border-t-[#006C4C] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* 1. Xe Có Ngay */}
          <div id="available">
            <CarRow
              title="Xe Có Ngay"
              subtitle="Đội xe"
              cars={available}
            />
          </div>

          {/* 2. Xe Sang */}
          <CarRow
            title="Xe Sang — Premium"
            subtitle="Hạng cao cấp"
            cars={luxury}
            dark
          />

          {/* 3. Có Lẽ Bạn Sẽ Thích */}
          <CarRow
            title="Có Lẽ Bạn Sẽ Thích"
            subtitle="Gợi ý cho bạn"
            cars={recommended}
          />
        </>
      )}

      {/* ── FEATURED ──────────────────────────────────────────── */}
      <section className="bg-[#F8F9FB] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#6E7A72] mb-1">Nổi bật</p>
              <h2 className="text-2xl font-bold text-[#191C1E]">Top Xe Được Đặt Nhiều Nhất</h2>
            </div>
            <Link to="/cars" className="bg-[#006C4C] hover:bg-[#004832] text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
              Xem toàn bộ
            </Link>
          </div>

          <div className="grid grid-cols-[1fr_0.65fr] gap-5">
            {/* large featured */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#BDCAC1] shadow-sm">
              <div className="relative">
                <img src={lucidPureImg} alt="Lucid Air Pure" className="w-full h-[340px] object-cover" />
                <span className="absolute top-4 left-4 bg-[#006C4C] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                  CERTIFIED EV-CHECK
                </span>
                <div className="absolute bottom-4 left-4 bg-white/92 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm flex items-baseline gap-1">
                  <span className="text-[#006C4C] font-bold text-lg">1.900.000đ</span>
                  <span className="text-[#3E4943] text-sm">/ngày</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#191C1E]">Lucid Air Pure</h3>
                    <p className="text-sm text-[#6E7A72]">📍 Cầu Giấy, Hà Nội • 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#4FBD91] text-sm">★★★★★</div>
                    <div className="text-xs text-[#6E7A72]">124 đánh giá</div>
                  </div>
                </div>
                <div className="flex gap-5 mt-4 pt-4 border-t border-[#BDCAC1]">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#191C1E]">⚡ 660km</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#191C1E]">🔋 20 phút DC</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#191C1E]">🚀 3.8s 0–100</span>
                </div>
              </div>
            </div>

            {/* side cards */}
            <div className="flex flex-col gap-4">
              {[
                { img: teslaImg,   name: "Tesla Model 3",    meta: "491km · Long Range",  price: "1.500.000đ/ngày" },
                { img: hyundaiImg, name: "Hyundai Ioniq 5",  meta: "451km · AWD Electric", price: "1.100.000đ/ngày" },
              ].map(c => (
                <div key={c.name} className="bg-white rounded-2xl overflow-hidden border border-[#BDCAC1] shadow-sm flex flex-col">
                  <img src={c.img} alt={c.name} className="w-full h-36 object-cover" />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-[#191C1E]">{c.name}</p>
                      <p className="text-xs text-[#6E7A72]">{c.meta}</p>
                    </div>
                    <span className="text-sm font-bold text-[#006C4C]">{c.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PREMIUM DARK ──────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4FBD91] mb-1">Cao cấp</p>
            <h2 className="text-2xl font-bold text-white">Hạng Sang &amp; Premium</h2>
            <p className="text-[#94A3B8] text-sm mt-1">Những mẫu EV cao cấp nhất — dành cho dịp đặc biệt.</p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[
              { img: lucidDreamImg, brand: "Lucid",   name: "Air Dream Edition", price: "4.200.000", range: "837km", accel: "2.7s", charge: "300kW" },
              { img: rivianImg,     brand: "Rivian",  name: "R1S Adventure",     price: "3.400.000", range: "505km", accel: "3.0s", charge: "220kW" },
              { img: lucidImg,      brand: "Lucid",   name: "Air Grand Touring", price: "3.800.000", range: "760km", accel: "3.0s", charge: "300kW" },
            ].map(car => (
              <div key={car.name}
                className="bg-[#1E293B] rounded-2xl overflow-hidden border border-[#334155] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-200">
                <div className="relative">
                  <img src={car.img} alt={car.name} className="w-full h-52 object-cover" />
                  <span className="absolute top-3 right-3 bg-[#006C4C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">PREMIUM</span>
                </div>
                <div className="p-6">
                  <p className="text-[#94A3B8] text-sm mb-0.5">{car.brand}</p>
                  <p className="text-white font-bold text-lg mb-1">{car.name}</p>
                  <p className="text-[#4FBD91] font-bold text-xl mb-5">
                    {car.price}đ<span className="text-[#94A3B8] text-sm font-normal">/ngày</span>
                  </p>
                  <div className="grid grid-cols-3 gap-0 pt-4 border-t border-[#334155]">
                    {[["RANGE", car.range], ["0–100", car.accel], ["CHARGE", car.charge]].map(([lbl, val]) => (
                      <div key={lbl} className="text-center px-1 first:pl-0 last:pr-0 border-r border-[#334155] last:border-r-0">
                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{lbl}</div>
                        <div className="text-white font-bold text-sm">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECO IMPACT ────────────────────────────────────────── */}
      <section className="bg-[#F8F9FB] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-white rounded-3xl border border-[rgba(79,189,145,0.20)] p-14 grid grid-cols-[1fr_auto] gap-12 items-center">
            <div>
              <span className="inline-block bg-[#4FBD91] text-[#004832] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                Impact Calculator
              </span>
              <h2 className="text-xl font-bold text-[#191C1E] mb-3">
                Cộng đồng GreenCar đã tiết kiệm 4.2 tấn CO₂ tháng này.
              </h2>
              <p className="text-[#3E4943] text-sm leading-relaxed mb-6 max-w-lg">
                Mỗi chuyến thuê xe điện thay vì xe xăng giúp giảm trung bình 2.3kg CO₂.
                Hơn 20.000 chuyến của chúng ta đang tạo ra sự thay đổi thực sự cho Hà Nội.
              </p>
              <Link to="/cars"
                className="inline-block bg-[#006C4C] hover:bg-[#004832] text-white font-bold px-8 py-3 rounded-full text-sm transition-colors">
                Bắt đầu hành trình xanh
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { icon: "🌳", num: "12.500", lbl: "Trees equivalent" },
                { icon: "🔋", num: "450K",   lbl: "kWh tiết kiệm"    },
                { icon: "🚗", num: "20K+",   lbl: "Chuyến thành công" },
              ].map(s => (
                <div key={s.lbl}
                  className="bg-white border border-[#BDCAC1] rounded-2xl p-5 text-center shadow-sm min-w-[130px]">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-xl font-bold text-[#191C1E]">{s.num}</div>
                  <div className="text-[10px] font-bold text-[#6E7A72] uppercase tracking-wide mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6E7A72] mb-1">Đánh giá</p>
            <h2 className="text-2xl font-bold text-[#191C1E]">Khách Hàng Nói Gì</h2>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {homepageTestimonials.map(t => (
              <div key={t.id} className="bg-[#F8F9FB] border border-[#BDCAC1] rounded-2xl p-6">
                <div className="text-[#4FBD91] text-sm mb-3">★★★★★</div>
                <p className="text-sm text-[#3E4943] leading-relaxed italic mb-4">"{t.message}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006C4C] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#191C1E]">{t.name}</div>
                    <div className="text-xs text-[#6E7A72]">{t.area}</div>
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
