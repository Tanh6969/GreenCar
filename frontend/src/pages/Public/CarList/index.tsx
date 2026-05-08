import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useVehicles } from "../../../hooks/useVehicles";
import { pricing } from "../../../data/mockData";
import { MODEL_LOCAL_IMAGES } from "../../../data/localImages";
import { formatCurrency } from "../../../utils/formatters";

// ── icons ─────────────────────────────────────────────────────
const IcSearch = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BDCAC1" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcCarPlaceholder = () => (
  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#4FBD91" strokeWidth="1" strokeLinecap="round">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-3h8l3 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
);
const IcPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6E7A72" strokeWidth="2" strokeLinecap="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 3, flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcBolt = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#006C4C" stroke="none" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 3, flexShrink: 0 }}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
  </svg>
);
const IcSeat = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2.5" strokeLinecap="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 3, flexShrink: 0 }}>
    <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/>
  </svg>
);
const IcSpeed = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2.5" strokeLinecap="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 3, flexShrink: 0 }}>
    <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/>
  </svg>
);

const VEHICLE_TYPES = ["Sedan", "SUV", "Crossover", "Fastback", "Hatchback"];
const RANGE_OPTIONS = [
  { label: "Tất cả",  min: 0   },
  { label: "300km+",  min: 300 },
  { label: "400km+",  min: 400 },
  { label: "500km+",  min: 500 },
  { label: "600km+",  min: 600 },
];
const SORT_OPTIONS = [
  { value: "price_asc",   label: "Giá: Thấp → Cao"  },
  { value: "price_desc",  label: "Giá: Cao → Thấp"  },
  { value: "range_desc",  label: "Phạm vi: Xa nhất"  },
  { value: "power_desc",  label: "Công suất: Mạnh nhất" },
];

const CarListPage: React.FC = () => {
  const { vehicles, loading } = useVehicles();

  const [selectedTypes,  setSelectedTypes]  = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRange,       setMinRange]       = useState(0);
  const [onlyAvailable,  setOnlyAvailable]  = useState(false);
  const [sortBy,         setSortBy]         = useState("price_asc");
  const [searchQuery,    setSearchQuery]    = useState("");

  const brands = useMemo(() =>
    Array.from(new Set(vehicles.map(v => v.model.brand))).sort(),
    [vehicles]
  );

  const getPrice24h = (modelId: number) =>
    pricing.find(p => p.vehicle_model_id === modelId && p.rental_plan_id === 3)?.price ?? 0;

  const getPrice4h = (modelId: number) =>
    pricing.find(p => p.vehicle_model_id === modelId && p.rental_plan_id === 1)?.price ?? 0;

  const filtered = useMemo(() => {
    let list = [...vehicles];

    if (onlyAvailable)
      list = list.filter(v => v.vehicle.status === "available");
    if (selectedTypes.length)
      list = list.filter(v => selectedTypes.includes(v.model.vehicle_type));
    if (selectedBrands.length)
      list = list.filter(v => selectedBrands.includes(v.model.brand));
    if (minRange > 0)
      list = list.filter(v => v.model.range_km >= minRange);
    if (searchQuery.trim())
      list = list.filter(v =>
        `${v.model.brand} ${v.model.name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );

    list.sort((a, b) => {
      if (sortBy === "price_asc")  return getPrice24h(a.model.vehicle_model_id) - getPrice24h(b.model.vehicle_model_id);
      if (sortBy === "price_desc") return getPrice24h(b.model.vehicle_model_id) - getPrice24h(a.model.vehicle_model_id);
      if (sortBy === "range_desc") return b.model.range_km - a.model.range_km;
      if (sortBy === "power_desc") return b.model.horsepower - a.model.horsepower;
      return 0;
    });

    return list;
  }, [vehicles, onlyAvailable, selectedTypes, selectedBrands, minRange, searchQuery, sortBy]);

  const toggleType = (t: string) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleBrand = (b: string) =>
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setMinRange(0);
    setOnlyAvailable(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF]">
      {/* page header */}
      <div className="bg-white border-b border-[#BDCAC1]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#151C27]">Danh sách xe điện</h1>
            <p className="text-sm text-[#6E7A72] mt-0.5">{filtered.length} xe phù hợp</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm xe..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 sm:w-56 border border-[#BDCAC1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#006C4C]"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-[#BDCAC1] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#006C4C] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6 flex gap-6 items-start">

        {/* ── SIDEBAR ───────────────────────────────────────────── */}
        <aside className="w-64 flex-shrink-0 bg-white rounded-xl border border-[#BDCAC1] p-5 sticky top-[84px]"
          style={{ maxHeight: "calc(100vh - 104px)", overflowY: "auto" }}>
          <div className="flex justify-between items-center mb-5">
            <span className="font-semibold text-[#151C27]">Bộ lọc</span>
            <button onClick={resetFilters} className="text-sm text-[#006C4C] hover:underline font-medium">Xóa tất cả</button>
          </div>

          {/* available only */}
          <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
            <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 accent-[#006C4C]" />
            <span className="text-sm text-[#3E4943]">Chỉ xe còn trống</span>
          </label>

          <hr className="border-[#F3F4F6] mb-5" />

          {/* vehicle type */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#151C27] mb-3">Loại xe</p>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_TYPES.map(t => {
                const active = selectedTypes.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                    style={{
                      background: active ? "#006C4C" : "#fff",
                      color: active ? "#fff" : "#3E4943",
                      borderColor: active ? "#006C4C" : "#BDCAC1",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-[#F3F4F6] mb-5" />

          {/* brand */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#151C27] mb-3">Hãng xe</p>
            <div className="flex flex-wrap gap-2">
              {brands.map(b => {
                const active = selectedBrands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                    style={{
                      background: active ? "#006C4C" : "#fff",
                      color: active ? "#fff" : "#3E4943",
                      borderColor: active ? "#006C4C" : "#BDCAC1",
                    }}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-[#F3F4F6] mb-5" />

          {/* range */}
          <div>
            <p className="text-sm font-semibold text-[#151C27] mb-3">Phạm vi tối thiểu</p>
            <div className="flex flex-col gap-2">
              {RANGE_OPTIONS.map(r => (
                <label key={r.label} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="range" checked={minRange === r.min} onChange={() => setMinRange(r.min)}
                    className="w-4 h-4 accent-[#006C4C]" />
                  <span className="text-sm text-[#3E4943]">{r.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── GRID ──────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-9 h-9 border-4 border-[#bbf7d0] border-t-[#006C4C] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[#6E7A72]">
              <div className="mb-4 flex justify-center"><IcSearch /></div>
              <p className="font-semibold">Không tìm thấy xe phù hợp.</p>
              <button onClick={resetFilters} className="mt-3 text-[#006C4C] font-semibold hover:underline text-sm">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(item => {
                const p4h  = getPrice4h(item.model.vehicle_model_id);
                const p24h = getPrice24h(item.model.vehicle_model_id);
                const available = item.vehicle.status === "available";

                return (
                  <article key={item.vehicle.vehicle_id}
                    className="bg-white rounded-xl overflow-hidden border border-[#BDCAC1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                    <div className="relative">
                      {(MODEL_LOCAL_IMAGES[item.model.vehicle_model_id] ?? item.image?.image_url) ? (
                        <img src={MODEL_LOCAL_IMAGES[item.model.vehicle_model_id] ?? item.image?.image_url} alt={item.model.name}
                          className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] flex items-center justify-center"><IcCarPlaceholder /></div>
                      )}
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full
                        ${available ? "bg-[#006C4C] text-white" : "bg-[#E5E7EB] text-[#6E7A72]"}`}>
                        {available ? "Còn trống" : "Đã đặt"}
                      </span>
                    </div>

                    <div className="p-4">
                      {/* brand chip */}
                      <p className="text-[10px] font-bold text-[#006C4C] uppercase tracking-wider mb-1">
                        {item.model.brand}
                      </p>

                      {/* title + price */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h4 className="font-bold text-[#191C1E] text-[15px] leading-tight">{item.model.name}</h4>
                        <div className="text-right shrink-0">
                          <p className="text-[#006C4C] font-bold text-sm leading-tight">{formatCurrency(p24h)}</p>
                          <p className="text-[10px] text-[#6E7A72]">/ngày</p>
                        </div>
                      </div>

                      {/* spec badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="inline-flex items-center bg-[#F0FDF4] text-[#3E4943] text-[11px] font-medium px-2 py-1 rounded-md">
                          <IcBolt />{item.model.range_km} km
                        </span>
                        <span className="inline-flex items-center bg-[#F0FDF4] text-[#3E4943] text-[11px] font-medium px-2 py-1 rounded-md">
                          <IcSpeed />{item.model.horsepower} hp
                        </span>
                        <span className="inline-flex items-center bg-[#F0FDF4] text-[#3E4943] text-[11px] font-medium px-2 py-1 rounded-md">
                          <IcSeat />{item.model.seats} chỗ
                        </span>
                      </div>

                      {/* price 4h + link */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] text-[#6E7A72]">{formatCurrency(p4h)}/4h · {item.model.vehicle_type}</span>
                      </div>

                      <Link
                        to={`/cars/${item.vehicle.vehicle_id}`}
                        className="block text-center bg-[#006C4C] hover:bg-[#005a3e] text-white font-bold py-2 rounded-lg text-sm transition-colors mb-3"
                      >
                        Xem chi tiết
                      </Link>

                      {/* location at bottom */}
                      <p className="flex items-center text-[11px] text-[#6E7A72]">
                        <IcPin />{item.location.name}, {item.location.city}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarListPage;
