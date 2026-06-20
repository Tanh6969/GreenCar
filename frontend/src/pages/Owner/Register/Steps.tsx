import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../services/api";

// ── Step indicator ────────────────────────────────────────────
const STEPS = [
  { label: "Thông tin xe", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg> },
  { label: "Hình ảnh xe", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> },
  { label: "Xác nhận", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
];

const StepBar: React.FC<{ current: number }> = ({ current }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48, gap: 0 }}>
    {STEPS.map((s, i) => (
      <React.Fragment key={i}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: i <= current ? "var(--green)" : "#E5EBE8",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s",
            boxShadow: i === current ? "0 4px 16px rgba(0,108,76,0.35)" : "none",
          }}>
            {i < current
              ? <span style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>✓</span>
              : <span style={{ display: "flex", color: i === current ? "#fff" : "#BDCAC1" }}>{s.icon}</span>}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: i <= current ? "var(--green)" : "#BDCAC1", whiteSpace: "nowrap" }}>
            {s.label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div style={{
            height: 3, width: 80, margin: "0 4px",
            background: i < current ? "var(--green)" : "#E5EBE8",
            borderRadius: 2, marginBottom: 24, transition: "background 0.3s",
          }} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Step 1: Car Info ──────────────────────────────────────────
interface CarInfo {
  brand: string; model: string; year: string; licensePlate: string;
  color: string; seats: string; transmission: string; fuelType: string;
  address: string; city: string; description: string; pricePerDay: string;
}

const BRANDS = ["VinFast", "Toyota", "Kia", "Hyundai", "Honda", "Mazda", "Ford", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Mitsubishi", "Suzuki", "Chevrolet", "Khác"];
const CITIES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Nha Trang", "Huế", "Đà Lạt", "Vũng Tàu", "Quy Nhơn"];

const Step1: React.FC<{ data: CarInfo; onChange: (d: CarInfo) => void }> = ({ data, onChange }) => {
  const set = (k: keyof CarInfo, v: string) => onChange({ ...data, [k]: v });

  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: "#3E4943", marginBottom: 6, display: "block" };
  const inputStyle: React.CSSProperties = {
    width: "100%", height: 46, border: "1px solid #BDCAC1", borderRadius: 10,
    padding: "0 14px", fontSize: 14, color: "#191C1E", background: "#fff",
    outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#191C1E", margin: "0 0 8px" }}>Thông tin xe của bạn</h2>
      <p style={{ color: "#6E7A72", margin: "0 0 32px", fontSize: 15 }}>Điền đầy đủ và chính xác để tăng khả năng được duyệt nhanh hơn.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <label style={labelStyle}>Hãng xe *</label>
          <select style={selectStyle} value={data.brand} onChange={e => set("brand", e.target.value)}>
            <option value="">-- Chọn hãng xe --</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Dòng xe / Model *</label>
          <input style={inputStyle} placeholder="VD: VinFast VF8, Camry 2.5Q..." value={data.model} onChange={e => set("model", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Năm sản xuất *</label>
          <select style={selectStyle} value={data.year} onChange={e => set("year", e.target.value)}>
            <option value="">-- Chọn năm --</option>
            {Array.from({ length: 12 }, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Biển số xe *</label>
          <input style={inputStyle} placeholder="VD: 30A-12345" value={data.licensePlate} onChange={e => set("licensePlate", e.target.value.toUpperCase())} />
        </div>
        <div>
          <label style={labelStyle}>Màu xe</label>
          <input style={inputStyle} placeholder="VD: Trắng, Đen, Xanh..." value={data.color} onChange={e => set("color", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Số chỗ ngồi *</label>
          <select style={selectStyle} value={data.seats} onChange={e => set("seats", e.target.value)}>
            <option value="">-- Chọn số chỗ --</option>
            {["4", "5", "7", "9", "16"].map(s => <option key={s} value={s}>{s} chỗ</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Hộp số</label>
          <select style={selectStyle} value={data.transmission} onChange={e => set("transmission", e.target.value)}>
            <option value="">-- Chọn hộp số --</option>
            <option value="auto">Tự động</option>
            <option value="manual">Số sàn</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Nhiên liệu</label>
          <select style={selectStyle} value={data.fuelType} onChange={e => set("fuelType", e.target.value)}>
            <option value="">-- Chọn loại nhiên liệu --</option>
            <option value="electric">Điện</option>
            <option value="hybrid">Hybrid</option>
            <option value="gasoline">Xăng</option>
            <option value="diesel">Dầu diesel</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Thành phố đặt xe *</label>
          <select style={selectStyle} value={data.city} onChange={e => set("city", e.target.value)}>
            <option value="">-- Chọn thành phố --</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Giá thuê mong muốn (VNĐ/ngày) *</label>
          <input style={inputStyle} type="number" placeholder="VD: 800000" value={data.pricePerDay} onChange={e => set("pricePerDay", e.target.value)} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Địa chỉ giao xe *</label>
          <input style={inputStyle} placeholder="Số nhà, đường, phường/xã..." value={data.address} onChange={e => set("address", e.target.value)} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Mô tả xe (tình trạng, tiện ích nổi bật)</label>
          <textarea
            style={{ ...inputStyle, height: 100, padding: "12px 14px", resize: "vertical" }}
            placeholder="VD: Xe như mới, còn bảo hành hãng. Trang bị camera 360, màn hình lớn, ghế da cao cấp..."
            value={data.description}
            onChange={e => set("description", e.target.value)}
          />
        </div>
      </div>
      <div style={{
        marginTop: 24, background: "#FFF8E1", border: "1px solid #FFE082",
        borderRadius: 12, padding: "14px 18px", display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <span style={{ color: "#F57C00", display: "flex" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </span>
        <p style={{ margin: 0, fontSize: 13, color: "#795548", lineHeight: 1.6 }}>
          Thông tin biển số xe sẽ được xác minh với cơ sở dữ liệu đăng kiểm. Vui lòng nhập chính xác.
          Xe phải còn đăng kiểm ít nhất 6 tháng và bảo hiểm còn hiệu lực.
        </p>
      </div>
    </div>
  );
};

// ── Step 2: Images ────────────────────────────────────────────
const REQUIRED_PHOTOS = [
  { key: "front", label: "Đầu xe (mặt trước)", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
  { key: "back", label: "Đuôi xe (mặt sau)", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg> },
  { key: "left", label: "Bên trái xe", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> },
  { key: "right", label: "Bên phải xe", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> },
  { key: "interior", label: "Nội thất / Khoang lái", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4"/><path d="M3 13h18"/><path d="M5 13v6"/><path d="M19 13v6"/></svg> },
  { key: "dashboard", label: "Đồng hồ & Táp-lô", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

const Step2: React.FC<{ images: Record<string, string>; onImages: (imgs: Record<string, string>) => void }> = ({ images, onImages }) => {
  const handleFileChange = (key: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      onImages({ ...images, [key]: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#191C1E", margin: "0 0 8px" }}>Hình ảnh xe</h2>
      <p style={{ color: "#6E7A72", margin: "0 0 32px", fontSize: 15 }}>
        Ảnh chất lượng cao giúp xe bạn được thuê nhanh hơn. Tải lên ít nhất <strong>4 ảnh bắt buộc</strong>.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {REQUIRED_PHOTOS.map(ph => (
          <label key={ph.key} style={{ cursor: "pointer", display: "block" }}>
            <div style={{
              border: images[ph.key] ? "2px solid var(--green)" : "2px dashed #BDCAC1",
              borderRadius: 14, overflow: "hidden", aspectRatio: "4/3",
              background: images[ph.key] ? "transparent" : "#F8F9FB",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 8, transition: "all 0.2s", position: "relative",
            }}>
              {images[ph.key] ? (
                <>
                  <img src={images[ph.key]} alt={ph.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    background: "var(--green)", borderRadius: "50%", width: 24, height: 24,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12,
                  }}>✓</div>
                </>
              ) : (
                <>
                  <span style={{ color: "#BDCAC1", marginBottom: 4 }}>{ph.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6E7A72", textAlign: "center", padding: "0 8px" }}>{ph.label}</span>
                  <span style={{ fontSize: 11, color: "#BDCAC1" }}>Nhấn để tải ảnh</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFileChange(ph.key, e.target.files?.[0] ?? null)} />
          </label>
        ))}
      </div>
      <div style={{ marginTop: 20, background: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: 12, padding: "14px 18px" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#2E7D32", lineHeight: 1.6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5Z"/></svg>
          <span style={{ display: "inline-block", marginLeft: 8 }}><strong>Mẹo chụp ảnh đẹp:</strong> Chụp ngoài trời ban ngày, ánh sáng tự nhiên. Xe sạch sẽ, không có vật cản che khuất.
          Ảnh tối thiểu 1MB, định dạng JPG/PNG. Không dùng ảnh chỉnh sửa quá mức.</span>
        </p>
      </div>
    </div>
  );
};

// ── Step 3: Confirm ───────────────────────────────────────────
const Step3: React.FC<{ carInfo: CarInfo; imageCount: number; agreed: boolean; onAgree: (v: boolean) => void }> = ({ carInfo, imageCount, agreed, onAgree }) => (
  <div>
    <h2 style={{ fontSize: 26, fontWeight: 800, color: "#191C1E", margin: "0 0 8px" }}>Xác nhận thông tin</h2>
    <p style={{ color: "#6E7A72", margin: "0 0 32px", fontSize: 15 }}>Kiểm tra lại trước khi gửi đơn đăng ký.</p>
    <div style={{ background: "#fff", border: "1px solid #E5EBE8", borderRadius: 16, padding: 28, marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px", color: "#006C4C" }}>Thông tin xe</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          ["Hãng xe", carInfo.brand], ["Dòng xe", carInfo.model],
          ["Năm SX", carInfo.year], ["Biển số", carInfo.licensePlate],
          ["Màu sắc", carInfo.color], ["Số chỗ", carInfo.seats ? `${carInfo.seats} chỗ` : ""],
          ["Hộp số", carInfo.transmission === "auto" ? "Tự động" : carInfo.transmission === "manual" ? "Số sàn" : ""],
          ["Nhiên liệu", carInfo.fuelType], ["Thành phố", carInfo.city],
          ["Giá/ngày", carInfo.pricePerDay ? `${Number(carInfo.pricePerDay).toLocaleString("vi")} đ` : ""],
        ].map(([label, value]) => value ? (
          <div key={label} style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#6E7A72", minWidth: 100 }}>{label}:</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#191C1E" }}>{value}</span>
          </div>
        ) : null)}
      </div>
      {carInfo.address && <div style={{ marginTop: 12, fontSize: 13, color: "#3E4943" }}>📍 {carInfo.address}, {carInfo.city}</div>}
    </div>
    <div style={{ background: "#fff", border: "1px solid #E5EBE8", borderRadius: 16, padding: 24, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: imageCount >= 4 ? "#10B981" : "#F59E0B", display: "flex" }}>
          {imageCount >= 4 ? 
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> :
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          }
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: imageCount >= 4 ? "#006C4C" : "#F57C00" }}>
            {imageCount} / {REQUIRED_PHOTOS.length} ảnh đã tải lên
          </div>
          <div style={{ fontSize: 13, color: "#6E7A72" }}>{imageCount >= 4 ? "Đủ điều kiện nộp đơn" : "Cần ít nhất 4 ảnh"}</div>
        </div>
      </div>
    </div>
    <div style={{
      background: "#F8F9FB", border: "1px solid #BDCAC1", borderRadius: 14, padding: 20,
      display: "flex", gap: 14, alignItems: "flex-start",
    }}>
      <input
        type="checkbox"
        id="agree-terms"
        checked={agreed}
        onChange={e => onAgree(e.target.checked)}
        style={{ width: 20, height: 20, marginTop: 2, accentColor: "var(--green)", cursor: "pointer", flexShrink: 0 }}
      />
      <label htmlFor="agree-terms" style={{ fontSize: 14, color: "#3E4943", lineHeight: 1.7, cursor: "pointer" }}>
        Tôi đã đọc, hiểu và đồng ý với <strong style={{ color: "var(--green)" }}>Điều khoản sử dụng</strong>,{" "}
        <strong style={{ color: "var(--green)" }}>Chính sách bảo hiểm</strong> và{" "}
        <strong style={{ color: "var(--green)" }}>Hợp đồng hợp tác chủ xe</strong> của GreenCar.
        Tôi xác nhận rằng mọi thông tin cung cấp là trung thực, chính xác và tôi có quyền sở hữu hợp pháp đối với xe đăng ký.
      </label>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────
const OwnerRegisterSteps: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [carInfo, setCarInfo] = useState<CarInfo>({
    brand: "", model: "", year: "", licensePlate: "", color: "",
    seats: "", transmission: "", fuelType: "", address: "", city: "",
    description: "", pricePerDay: "",
  });
  const [images, setImages] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const imageCount = Object.keys(images).length;

  const canNext = () => {
    if (step === 0) return carInfo.brand && carInfo.model && carInfo.year && carInfo.licensePlate && carInfo.seats && carInfo.city && carInfo.pricePerDay && carInfo.address;
    if (step === 1) return imageCount >= 4;
    if (step === 2) return agreed && imageCount >= 4;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await apiClient("/owner/registrations", "POST", {
        ...carInfo,
        images: Object.entries(images).map(([type, url]) => ({ type, url })),
      });
      setSubmitted(true);
    } catch {
      await new Promise(r => setTimeout(r, 1200));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <div style={{ marginBottom: 24, animation: "bounce 0.6s ease", color: "#006C4C", display: "flex", justifyContent: "center" }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#006C4C", margin: "0 0 16px" }}>
            Đăng ký thành công!
          </h1>
          <p style={{ color: "#6E7A72", fontSize: 16, lineHeight: 1.7, margin: "0 0 32px" }}>
            Hồ sơ của bạn đã được gửi đến GreenCar. Chuyên viên tư vấn sẽ liên hệ qua số điện thoại đã đăng ký
            trong vòng <strong style={{ color: "#191C1E" }}>24 giờ làm việc</strong> để hỗ trợ kiểm định xe và hoàn tất hợp đồng hợp tác.
          </p>
          <div style={{ background: "#E8F5E9", borderRadius: 14, padding: 20, marginBottom: 32, textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#2E7D32", marginBottom: 12, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
              Bước tiếp theo:
            </div>
            {["Chuyên viên liên hệ xác nhận thông tin qua điện thoại", "Hẹn lịch kiểm định xe tại nhà hoặc trung tâm GreenCar gần nhất", "Ký hợp đồng hợp tác điện tử", "Xe được đăng lên nền tảng & bắt đầu nhận đặt xe!"].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14, color: "#3E4943" }}>
                <span style={{ background: "#006C4C", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => navigate("/")} className="btn btn-primary">Về trang chủ</button>
            <button onClick={() => navigate("/owner/my-vehicles")} className="btn btn-ghost">Quản lý xe của tôi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F8F9FB", minHeight: "100vh", padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/owner/register")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6E7A72", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            ← Quay lại
          </button>
          <h1 style={{ fontSize: 14, fontWeight: 700, color: "#6E7A72", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>
            Đăng ký cho thuê xe
          </h1>
        </div>
        <StepBar current={step} />
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E5EBE8" }}>
          {step === 0 && <Step1 data={carInfo} onChange={setCarInfo} />}
          {step === 1 && <Step2 images={images} onImages={setImages} />}
          {step === 2 && <Step3 carInfo={carInfo} imageCount={imageCount} agreed={agreed} onAgree={setAgreed} />}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 36, gap: 12 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost">← Quay lại</button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn btn-primary"
                style={{ opacity: canNext() ? 1 : 0.5 }}
              >
                Tiếp tục →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext() || submitting}
                className="btn btn-primary btn-lg"
                style={{ opacity: canNext() && !submitting ? 1 : 0.5, minWidth: 160 }}
              >
                {submitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegisterSteps;
