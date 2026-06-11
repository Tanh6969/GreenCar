import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../services/api";

interface MyRegistration {
  id: number;
  brand: string;
  model: string;
  year: string;
  license_plate: string;
  city: string;
  price_per_day: number;
  status: "pending" | "reviewing" | "approved" | "rejected";
  reject_reason?: string;
  images: { type: string; url: string }[];
  created_at: string;
}

const STATUS_MAP = {
  pending: { label: "Chờ xem xét", color: "#F59E0B", bg: "#FEF3C7", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  reviewing: { label: "Đang xem xét", color: "#3B82F6", bg: "#EFF6FF", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  approved: { label: "Đã được duyệt", color: "#10B981", bg: "#ECFDF5", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  rejected: { label: "Bị từ chối", color: "#EF4444", bg: "#FEF2F2", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
};

const MyVehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MyRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiClient<MyRegistration[]>("/owner/my-registrations");
      setItems(data || []);
    } catch {
      setItems(MOCK_MY);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#F8F9FB", minHeight: "100vh", padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: "#191C1E", margin: "0 0 6px" }}>Xe của tôi</h1>
            <p style={{ color: "#6E7A72", margin: 0, fontSize: 15 }}>Quản lý các xe đăng ký cho thuê trên GreenCar</p>
          </div>
          <button onClick={() => navigate("/owner/register")} className="btn btn-primary">
            + Đăng ký xe mới
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6E7A72" }}>Đang tải...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, background: "#fff", borderRadius: 20, border: "1px solid #E5EBE8" }}>
            <div style={{ marginBottom: 16, color: "var(--green)", display: "flex", justifyContent: "center" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px", color: "#191C1E" }}>Chưa có xe nào</h2>
            <p style={{ color: "#6E7A72", margin: "0 0 28px" }}>Đăng ký xe đầu tiên của bạn và bắt đầu tạo thu nhập!</p>
            <button onClick={() => navigate("/owner/register")} className="btn btn-primary btn-lg">
              Đăng ký cho thuê xe →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map(item => {
              const s = STATUS_MAP[item.status];
              const coverImg = item.images?.find(i => i.type === "front")?.url;
              return (
                <div key={item.id} style={{
                  background: "#fff", borderRadius: 16, padding: 24,
                  border: "1px solid #E5EBE8", display: "flex", gap: 20, alignItems: "flex-start",
                  transition: "box-shadow 0.2s",
                }}>
                  {coverImg ? (
                    <img src={coverImg} alt="xe" style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 12, flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 140, height: 100, borderRadius: 12, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#BDCAC1", flexShrink: 0 }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: "#191C1E" }}>
                          {item.brand} {item.model} {item.year}
                        </h3>
                        <p style={{ fontSize: 14, color: "#6E7A72", margin: "0 0 12px" }}>
                          {item.license_plate} · 📍 {item.city}
                        </p>
                      </div>
                      <span style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase" }}>Giá/ngày</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--green)" }}>
                          {Number(item.price_per_day).toLocaleString("vi")}đ
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase" }}>Ngày đăng ký</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#191C1E" }}>
                          {new Date(item.created_at).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                      {item.status === "approved" && (
                        <div style={{ background: "#ECFDF5", borderRadius: 8, padding: "8px 14px", border: "1px solid #A7F3D0" }}>
                          <div style={{ fontSize: 12, color: "#10B981", fontWeight: 700 }}>Đang hoạt động · Nhận đặt xe</div>
                        </div>
                      )}
                    </div>
                    {item.status === "rejected" && item.reject_reason && (
                      <div style={{ marginTop: 12, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px" }}>
                        <span style={{ fontSize: 13, color: "#B91C1C" }}>
                          <strong>Lý do từ chối:</strong> {item.reject_reason}
                        </span>
                        <button onClick={() => navigate("/owner/register/steps")} style={{
                          marginLeft: 12, fontSize: 13, color: "var(--green)", fontWeight: 700,
                          background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
                        }}>
                          Đăng ký lại →
                        </button>
                      </div>
                    )}
                    {item.status === "pending" && (
                      <div style={{ marginTop: 12, fontSize: 13, color: "#6E7A72", display: "flex", gap: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Đang chờ chuyên viên GreenCar xem xét. Thời gian xử lý: 24–48 giờ làm việc.
                      </div>
                    )}
                    {item.status === "reviewing" && (
                      <div style={{ marginTop: 12, fontSize: 13, color: "#3B82F6", display: "flex", gap: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Chuyên viên đang xem xét hồ sơ của bạn. Chúng tôi sẽ liên hệ sớm nhất.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info banner */}
        {items.some(i => i.status === "approved") && (
          <div style={{
            marginTop: 32, background: "linear-gradient(135deg, #003D2B, #006C4C)",
            borderRadius: 20, padding: 28, display: "flex", gap: 20, alignItems: "center",
          }}>
            <div style={{ color: "#fff", display: "flex" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                Xe bạn đang hoạt động!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: 14 }}>
                Xe của bạn đã xuất hiện trên GreenCar và đang nhận đặt xe. Thu nhập được thanh toán vào ngày 5 hàng tháng.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MOCK_MY: MyRegistration[] = [
  {
    id: 1, brand: "VinFast", model: "VF8 Plus", year: "2023",
    license_plate: "30A-12345", city: "Hà Nội", price_per_day: 1200000,
    status: "approved",
    images: [{ type: "front", url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop" }],
    created_at: "2026-06-01T09:00:00Z",
  },
];

export default MyVehiclesPage;
