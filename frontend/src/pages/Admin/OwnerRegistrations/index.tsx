import React, { useEffect, useState } from "react";
import { apiClient } from "../../../services/api";
import { Pagination } from "../../../components/common/Pagination";
import { PaginatedResponse } from "../../../types/pagination.type";

interface OwnerRegistration {
  id: number;
  user_id: number;
  owner_name: string;
  owner_phone: string;
  brand: string;
  model: string;
  year: string;
  license_plate: string;
  color: string;
  seats: string;
  transmission: string;
  fuel_type: string;
  city: string;
  address: string;
  price_per_day: number;
  description: string;
  images: { type: string; url: string }[];
  status: "pending" | "reviewing" | "approved" | "rejected";
  reject_reason?: string;
  created_at: string;
}

const STATUS_MAP = {
  pending: { label: "Chờ xem xét", color: "#F59E0B", bg: "#FEF3C7" },
  reviewing: { label: "Đang xem xét", color: "#3B82F6", bg: "#EFF6FF" },
  approved: { label: "Đã duyệt", color: "#10B981", bg: "#ECFDF5" },
  rejected: { label: "Từ chối", color: "#EF4444", bg: "#FEF2F2" },
};

const AdminOwnerRegistrations: React.FC = () => {
  const [items, setItems] = useState<OwnerRegistration[]>([]);
  const [selected, setSelected] = useState<OwnerRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData(page);
  }, [page]);

  const loadData = async (p: number) => {
    setLoading(true);
    try {
      const res = await apiClient<PaginatedResponse<OwnerRegistration[]>>(`/admin/owner-registrations?page=${p}&limit=10`);
      if (res && "data" in res) {
        setItems(res.data || []);
        setTotalPages(res.pagination.total_pages || 1);
        setTotal(res.pagination.total || 0);
      } else {
        setItems((res as any) || []);
        setTotalPages(1);
        setTotal(((res as any) || []).length);
      }
    } catch {
      // Use mock data
      setItems(MOCK_DATA);
      setTotalPages(1);
      setTotal(MOCK_DATA.length);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    try {
      await apiClient(`/admin/owner-registrations/${id}/status`, "PATCH", { status: "approved" });
    } catch {}
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status: "approved" } : prev);
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await apiClient(`/admin/owner-registrations/${selected.id}/status`, "PATCH", { status: "rejected", reject_reason: rejectReason });
    } catch {}
    setItems(prev => prev.map(r => r.id === selected.id ? { ...r, status: "rejected", reject_reason: rejectReason } : r));
    setSelected(prev => prev ? { ...prev, status: "rejected", reject_reason: rejectReason } : null);
    setShowRejectModal(false);
    setRejectReason("");
    setActionLoading(false);
  };

  const handleSetReviewing = async (id: number) => {
    try {
      await apiClient(`/admin/owner-registrations/${id}/status`, "PATCH", { status: "reviewing" });
    } catch {}
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: "reviewing" } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status: "reviewing" } : prev);
  };

  const safeItems = items || [];
  const filtered = filter === "all" ? safeItems : safeItems.filter(i => i.status === filter);
  const counts = { all: total, pending: safeItems.filter(i => i.status === "pending").length, reviewing: safeItems.filter(i => i.status === "reviewing").length, approved: safeItems.filter(i => i.status === "approved").length, rejected: safeItems.filter(i => i.status === "rejected").length };

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "380px 1fr" : "1fr", gap: 24, minHeight: "calc(100vh - 120px)" }}>
      {/* List panel */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E5EBE8" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 16px" }}>Đơn đăng ký cho thuê xe</h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {(["all", "pending", "reviewing", "approved", "rejected"] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: "5px 12px", borderRadius: 999, border: "1px solid",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: filter === s ? "var(--green)" : "#fff",
                color: filter === s ? "#fff" : "#6E7A72",
                borderColor: filter === s ? "var(--green)" : "#BDCAC1",
              }}>
                {s === "all" ? "Tất cả" : s === "pending" ? "Chờ duyệt" : s === "reviewing" ? "Đang xét" : s === "approved" ? "Đã duyệt" : "Từ chối"} ({counts[s]})
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6E7A72" }}>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6E7A72" }}>Không có đơn nào.</div>
        ) : (
          <>
            <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 325px)" }}>
              {filtered.map(item => {
                const s = STATUS_MAP[item.status];
                const isSelected = selected?.id === item.id;
                return (
                  <div key={item.id} onClick={() => setSelected(item)} style={{
                    padding: "16px 20px", cursor: "pointer", borderBottom: "1px solid #F3F4F6",
                    background: isSelected ? "#F0FAF5" : "transparent", transition: "background 0.15s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#191C1E" }}>{item.brand} {item.model} {item.year}</div>
                        <div style={{ fontSize: 13, color: "#6E7A72" }}>{item.license_plate} · {item.owner_name}</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#BDCAC1" }}>{new Date(item.created_at).toLocaleDateString("vi-VN")}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid #F3F4F6", background: "#FAFDFB" }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #E5EBE8", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>{selected.brand} {selected.model} {selected.year}</h2>
              <span style={{
                padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: STATUS_MAP[selected.status].bg, color: STATUS_MAP[selected.status].color,
              }}>{STATUS_MAP[selected.status].label}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6E7A72", display: "flex" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Images */}
          {selected.images?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Hình ảnh xe</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {selected.images.map((img, i) => (
                  <img key={i} src={img.url} alt={img.type} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10 }} />
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              ["Chủ xe", selected.owner_name], ["SĐT", selected.owner_phone],
              ["Biển số", selected.license_plate], ["Số chỗ", `${selected.seats} chỗ`],
              ["Màu", selected.color], ["Hộp số", selected.transmission === "auto" ? "Tự động" : "Số sàn"],
              ["Nhiên liệu", selected.fuel_type], ["Thành phố", selected.city],
              ["Giá/ngày", `${Number(selected.price_per_day).toLocaleString("vi")} đ`], ["Ngày nộp", new Date(selected.created_at).toLocaleDateString("vi-VN")],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#F8F9FB", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6E7A72", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#191C1E" }}>{value || "—"}</div>
              </div>
            ))}
          </div>
          {selected.address && <div style={{ fontSize: 14, color: "#3E4943", marginBottom: 16 }}>📍 {selected.address}, {selected.city}</div>}
          {selected.description && (
            <div style={{ background: "#F8F9FB", borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 14, color: "#3E4943", lineHeight: 1.7 }}>
              <strong>Mô tả:</strong> {selected.description}
            </div>
          )}
          {selected.reject_reason && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: "#EF4444", marginBottom: 4 }}>Lý do từ chối:</div>
              <div style={{ fontSize: 14, color: "#B91C1C" }}>{selected.reject_reason}</div>
            </div>
          )}

          {/* Actions */}
          {(selected.status === "pending" || selected.status === "reviewing") && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {selected.status === "pending" && (
                <button onClick={() => handleSetReviewing(selected.id)} className="btn btn-ghost" style={{ flex: 1, display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Bắt đầu xem xét
                </button>
              )}
              <button onClick={() => handleApprove(selected.id)} disabled={actionLoading} className="btn btn-primary" style={{ flex: 1, display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Duyệt xe
              </button>
              <button onClick={() => setShowRejectModal(true)} disabled={actionLoading}
                style={{ flex: 1, padding: "10px 20px", borderRadius: 999, background: "none", border: "1.5px solid #EF4444", color: "#EF4444", fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Từ chối
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowRejectModal(false)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 16px" }}>Từ chối đơn đăng ký</h3>
            <p style={{ fontSize: 14, color: "#6E7A72", margin: "0 0 16px" }}>Vui lòng nêu rõ lý do để chủ xe có thể điều chỉnh và đăng ký lại.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="VD: Xe chưa đủ điều kiện đăng kiểm, ảnh không rõ ràng, thông tin không khớp..."
              style={{ width: "100%", height: 100, border: "1px solid #BDCAC1", borderRadius: 10, padding: 12, fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={() => setShowRejectModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Hủy</button>
              <button onClick={handleReject} disabled={!rejectReason.trim() || actionLoading}
                style={{ flex: 1, padding: "10px", borderRadius: 999, background: "#EF4444", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", opacity: rejectReason.trim() ? 1 : 0.5 }}>
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock data for demonstration
const MOCK_DATA: OwnerRegistration[] = [
  {
    id: 1, user_id: 2, owner_name: "Nguyễn Văn A", owner_phone: "0901234567",
    brand: "VinFast", model: "VF8 Plus", year: "2023", license_plate: "30A-12345",
    color: "Trắng", seats: "5", transmission: "auto", fuel_type: "electric",
    city: "Hà Nội", address: "45 Trần Đại Nghĩa, Hai Bà Trưng",
    price_per_day: 1200000,
    description: "Xe như mới, camera 360, ghế da cao cấp, còn bảo hành hãng đến 2026.",
    images: [
      { type: "front", url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop" },
      { type: "back", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop" },
      { type: "left", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop" },
      { type: "interior", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop" },
    ],
    status: "pending", created_at: "2026-06-10T09:00:00Z",
  },
  {
    id: 2, user_id: 3, owner_name: "Trần Thị B", owner_phone: "0912345678",
    brand: "Toyota", model: "Camry 2.5Q", year: "2022", license_plate: "51G-98765",
    color: "Đen", seats: "5", transmission: "auto", fuel_type: "gasoline",
    city: "TP. Hồ Chí Minh", address: "123 Nguyễn Huệ, Quận 1",
    price_per_day: 900000, description: "Camry đen bóng, nội thất da, sạch sẽ thơm tho.",
    images: [
      { type: "front", url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop" },
      { type: "back", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop" },
      { type: "left", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop" },
      { type: "interior", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop" },
    ],
    status: "reviewing", created_at: "2026-06-09T14:30:00Z",
  },
  {
    id: 3, user_id: 4, owner_name: "Lê Văn C", owner_phone: "0923456789",
    brand: "Hyundai", model: "Tucson 2.0", year: "2021", license_plate: "43A-54321",
    color: "Xám", seats: "5", transmission: "auto", fuel_type: "gasoline",
    city: "Đà Nẵng", address: "78 Bạch Đằng, Hải Châu",
    price_per_day: 750000, description: "Tucson ít đi, xe đẹp, tiết kiệm nhiên liệu.",
    images: [
      { type: "front", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop" },
      { type: "back", url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop" },
      { type: "left", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop" },
      { type: "interior", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop" },
    ],
    status: "approved", created_at: "2026-06-08T10:00:00Z",
  },
];

export default AdminOwnerRegistrations;
