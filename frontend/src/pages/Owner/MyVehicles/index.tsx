import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../services/api";
import { bookingService } from "../../../services/booking.service";
import { MODEL_LOCAL_IMAGES } from "../../../data/localImages";
import fallbackImg from "../../../assets/images/Premium EV Experience.png";

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

interface VehicleCardResponse {
  vehicle: { id: number; status: string; license_plate: string; available_from?: string; available_to?: string; status_reason?: string };
  model: { vehicle_model_id: number; name: string; brand: string };
  location: { city: string; address: string };
  image_url: string;
  trip_count: number;
  revenue: number;
  avg_rating: number;
  promo_discount?: number;
  promo_end_date?: string;
}

interface Unavailability {
  id: number;
  start_time: string;
  end_time: string;
  type: string;
}

const STATUS_MAP = {
  pending: { label: "Chờ xem xét", color: "#F59E0B", bg: "#FEF3C7", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  reviewing: { label: "Đang xem xét", color: "#3B82F6", bg: "#EFF6FF", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  approved: { label: "Đã được duyệt", color: "#10B981", bg: "#ECFDF5", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  rejected: { label: "Bị từ chối", color: "#EF4444", bg: "#FEF2F2", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", marginBottom: -2}}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
};

const MyVehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"vehicles" | "registrations" | "bookings">("vehicles");
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [bookingPage, setBookingPage] = useState(1);
  const BOOKINGS_PER_PAGE = 5;

  useEffect(() => {
    setBookingPage(1);
  }, [bookingFilter]);
  
  const [items, setItems] = useState<MyRegistration[]>([]);
  const [vehicles, setVehicles] = useState<VehicleCardResponse[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingVehicleId, setSettingVehicleId] = useState<number | null>(null);
  const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([]);
  const [blockFrom, setBlockFrom] = useState("");
  const [blockTo, setBlockTo] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);

  // Trip Completion
  const [completingBooking, setCompletingBooking] = useState<any>(null);
  const [actualKM, setActualKM] = useState<number | "">("");
  const [extraFee, setExtraFee] = useState<number | "">("");
  const [extraFeeDesc, setExtraFeeDesc] = useState("");

  // Handover (Check-in)
  const [handoverBooking, setHandoverBooking] = useState<any>(null);
  const [skipODO, setSkipODO] = useState(false);
  const [startODO, setStartODO] = useState<number | "">("");
  const [checklist, setChecklist] = useState({ license: false, photos: false });

  // Pricing Rules
  const [pricingVehicleId, setPricingVehicleId] = useState<number | null>(null);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [newRuleType, setNewRuleType] = useState<"weekend" | "promo">("weekend");
  const [newRuleExtra, setNewRuleExtra] = useState<number | "">("");
  const [newRuleDiscount, setNewRuleDiscount] = useState<number | "">("");
  const [newPromoStart, setNewPromoStart] = useState<string>("");
  const [newPromoEnd, setNewPromoEnd] = useState<string>("");


  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (pricingVehicleId) loadPricingRules(pricingVehicleId);
  }, [pricingVehicleId]);



  const filteredBookings = ownerBookings.filter((b: any) => {
    if (bookingFilter === "all") return true;
    if (bookingFilter === "pending") return b.status === "pending" || b.status === "confirmed";
    if (bookingFilter === "active") return b.status === "active" || b.status === "running";
    if (bookingFilter === "completed") return b.status === "completed" || b.status === "pending_payment";
    if (bookingFilter === "cancelled") return b.status === "cancelled";
    return true;
  });

  const totalBookingPages = Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE);
  const paginatedOwnerBookings = filteredBookings.slice(
    (bookingPage - 1) * BOOKINGS_PER_PAGE,
    bookingPage * BOOKINGS_PER_PAGE
  );

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "registrations") {
        const data = await apiClient<MyRegistration[]>("/owner/my-registrations");
        const pendingOrRejected = (data || []).filter(item => item.status !== "approved");
        setItems(pendingOrRejected);
      } else if (activeTab === "bookings") {
        loadOwnerBookings();
      } else {
        const data = await apiClient<VehicleCardResponse[]>("/owner/vehicles");
        setVehicles(data || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const loadOwnerBookings = async (showLoading: boolean = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await bookingService.getOwnerBookings();
      setOwnerBookings(data || []);
    } catch {
      // ignore
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerBookings(true);
    // Auto refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      loadOwnerBookings(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadUnavailabilities = async (id: number) => {
    try {
      const data = await apiClient<Unavailability[]>(`/owner/vehicles/${id}/unavailabilities`);
      setUnavailabilities(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const addUnavailability = async () => {
    if (!settingVehicleId || !blockFrom || !blockTo) return;
    setIsBlocking(true);
    try {
      const from = new Date(blockFrom);
      from.setHours(0, 0, 0, 0);
      const to = new Date(blockTo);
      to.setHours(23, 59, 59, 999);

      await apiClient(`/owner/vehicles/${settingVehicleId}/unavailabilities`, "POST", {
        start_time: from.toISOString(),
        end_time: to.toISOString(),
        type: "blocked"
      });
      setBlockFrom("");
      setBlockTo("");
      await loadUnavailabilities(settingVehicleId);
    } catch (error) {
      alert("Không thể thêm lịch bận");
    } finally {
      setIsBlocking(false);
    }
  };

  const deleteUnavailability = async (uid: number) => {
    if (!settingVehicleId) return;
    try {
      await apiClient(`/owner/vehicles/${settingVehicleId}/unavailabilities/${uid}`, "DELETE");
      await loadUnavailabilities(settingVehicleId);
    } catch (err: any) {
      alert(err.response?.data?.error || "Có lỗi xảy ra khi xóa ngày khóa.");
    }
  };

  const handleCompleteTrip = async () => {
    if (!completingBooking) return;
    if (actualKM === "" || Number(actualKM) < 0) {
      alert("Vui lòng nhập số KM thực tế hợp lệ.");
      return;
    }
    
    try {
      await apiClient(`/owner/bookings/${completingBooking.booking_id}/complete`, "POST", {
        actual_km: Number(actualKM),
        extra_fee: Number(extraFee) || 0,
        extra_fee_desc: extraFeeDesc
      });
      alert("Hoàn thành chuyến đi thành công!");
      setCompletingBooking(null);
      setActualKM("");
      setExtraFee("");
      setExtraFeeDesc("");
      loadOwnerBookings(); // reload
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi hoàn thành chuyến đi.");
    }
  };

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    try {
      await apiClient(`/owner/bookings/${bookingId}/status`, "PUT", { status });
      loadOwnerBookings();
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleHandover = async () => {
    if (!handoverBooking) return;
    if (!checklist.license || !checklist.photos) {
      alert("Vui lòng hoàn thành các bước kiểm tra an toàn (bằng lái, chụp ảnh) trước khi giao xe.");
      return;
    }
    if (!skipODO && startODO === "") {
      alert("Vui lòng nhập số KM trên đồng hồ, hoặc chọn 'Bỏ qua ghi nhận số ODO'.");
      return;
    }
    // Just update status to active. In a real app, we'd save startODO to DB.
    await handleUpdateStatus(handoverBooking.booking_id, "active");
    setHandoverBooking(null);
    setStartODO("");
    setSkipODO(false);
    setChecklist({ license: false, photos: false });
  };

  const loadPricingRules = async (vehicleId: number) => {
    try {
      const data = await apiClient<any[]>(`/owner/vehicles/${vehicleId}/pricing-rules`);
      setPricingRules(data || []);
    } catch { setPricingRules([]); }
  };

  const addPricingRule = async () => {
    if (!pricingVehicleId) return;
    const body: any = { rule_type: newRuleType, is_active: true, min_days: 0, discount_percent: 0, extra_percent: 0 };
    if (newRuleType === "weekend") body.extra_percent = Number(newRuleExtra) || 0;
    if (newRuleType === "promo") { 
      body.discount_percent = Number(newRuleDiscount) || 0; 
      body.promo_start_date = newPromoStart;
      body.promo_end_date = newPromoEnd;
    }
    try {
      await apiClient(`/owner/vehicles/${pricingVehicleId}/pricing-rules`, "POST", body);
      loadPricingRules(pricingVehicleId);
      setNewRuleExtra(""); setNewRuleDiscount(""); setNewPromoStart(""); setNewPromoEnd("");
    } catch (err: any) { alert(err.message || "Lỗi khi thêm quy tắc"); }
  };

  const deletePricingRule = async (ruleId: number) => {
    if (!pricingVehicleId) return;
    try {
      await apiClient(`/owner/vehicles/${pricingVehicleId}/pricing-rules/${ruleId}`, "DELETE");
      loadPricingRules(pricingVehicleId);
    } catch (err: any) { alert(err.message || "Lỗi"); }
  };

  const renderStepper = (status: string) => {
    const steps = ["Xác nhận", "Đang thuê", "Thanh toán", "Hoàn thành"];
    let currentStep = 0;
    if (status === "confirmed") currentStep = 1;
    if (status === "active" || status === "running") currentStep = 2;
    if (status === "pending_payment") currentStep = 3;
    if (status === "completed") currentStep = 4;
    
    if (status === "cancelled") {
      return <div style={{ color: "#EF4444", fontWeight: 700, padding: "4px 12px", background: "#FEF2F2", borderRadius: 8 }}>Đã hủy</div>;
    }
    if (status === "pending") {
      return <div style={{ color: "#F59E0B", fontWeight: 700, padding: "4px 12px", background: "#FEF3C7", borderRadius: 8 }}>Chờ duyệt</div>;
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {steps.map((s, i) => {
          const isActive = i < currentStep;
          const isCurrent = i === Math.min(currentStep, 3);
          return (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: isActive ? "#10B981" : isCurrent ? "#3B82F6" : "#E5EBE8",
                  color: "#fff", fontSize: 10, fontWeight: 800
                }}>
                  {isActive ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: isActive || isCurrent ? "#191C1E" : "#A3AFA8" }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 24, height: 2, background: isActive ? "#10B981" : "#E5EBE8", marginBottom: 16 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
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

        <div style={{ display: "flex", gap: 32, borderBottom: "1px solid #E5EBE8", marginBottom: 32 }}>
          <button
            onClick={() => setActiveTab("vehicles")}
            style={{
              padding: "0 0 12px", background: "none", border: "none",
              borderBottom: activeTab === "vehicles" ? "3px solid #006C4C" : "3px solid transparent",
              color: activeTab === "vehicles" ? "#191C1E" : "#6E7A72",
              fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Xe đang hoạt động
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            style={{
              padding: "0 0 12px", background: "none", border: "none",
              borderBottom: activeTab === "bookings" ? "3px solid #006C4C" : "3px solid transparent",
              color: activeTab === "bookings" ? "#191C1E" : "#6E7A72",
              fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            Đơn đặt xe
            {(() => {
              const pendingCount = ownerBookings.filter((b: any) => b.status === "pending").length;
              return pendingCount > 0 ? (
                <span style={{
                  background: "#ef4444", color: "#fff",
                  fontSize: 11, fontWeight: 800,
                  minWidth: 18, height: 18,
                  borderRadius: 999, display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  padding: "0 5px", lineHeight: 1,
                }}>
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              ) : null;
            })()}
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            style={{
              padding: "0 0 12px", background: "none", border: "none",
              borderBottom: activeTab === "registrations" ? "3px solid #006C4C" : "3px solid transparent",
              color: activeTab === "registrations" ? "#191C1E" : "#6E7A72",
              fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Đơn đăng ký
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6E7A72" }}>Đang tải...</div>
        ) : (activeTab === "vehicles" ? vehicles.length === 0 : activeTab === "bookings" ? ownerBookings.length === 0 : items.length === 0) ? (
          <div style={{ textAlign: "center", padding: 80, background: "#fff", borderRadius: 20, border: "1px solid #E5EBE8" }}>
            <div style={{ marginBottom: 16, color: "var(--green)", display: "flex", justifyContent: "center" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px", color: "#191C1E" }}>Chưa có {activeTab === "vehicles" ? "xe nào" : activeTab === "bookings" ? "đơn đặt xe nào" : "đơn đăng ký nào"}</h2>
            <p style={{ color: "#6E7A72", margin: "0 0 28px" }}>Đăng ký xe đầu tiên của bạn và bắt đầu tạo thu nhập!</p>
            <button onClick={() => navigate("/owner/register")} className="btn btn-primary btn-lg">
              Đăng ký cho thuê xe →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {activeTab === "bookings" && ownerBookings.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 8, overflowX: "auto", paddingBottom: 4 }}>
                {[{id: "all", label: "Tất cả"}, {id: "pending", label: "Chờ xác nhận"}, {id: "active", label: "Đang diễn ra"}, {id: "completed", label: "Hoàn thành"}, {id: "cancelled", label: "Đã hủy"}].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setBookingFilter(f.id)}
                    style={{
                      padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: "none", whiteSpace: "nowrap",
                      background: bookingFilter === f.id ? "#006C4C" : "#E5EBE8",
                      color: bookingFilter === f.id ? "#fff" : "#3E4943",
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                  >{f.label}</button>
                ))}
              </div>
            )}
            {activeTab === "vehicles" ? vehicles.map(v => (
              <div key={v.vehicle.id} style={{
                background: "#fff", borderRadius: 16, padding: 16,
                border: "1px solid #E5EBE8", display: "flex", gap: 20, alignItems: "flex-start",
                transition: "box-shadow 0.2s",
              }}>
                {(MODEL_LOCAL_IMAGES[v.model.vehicle_model_id] || v.image_url || fallbackImg) ? (
                  <img src={MODEL_LOCAL_IMAGES[v.model.vehicle_model_id] || v.image_url || fallbackImg} alt="xe" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== fallbackImg) {
                        target.src = fallbackImg;
                      }
                    }}
                    style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 12, flexShrink: 0, backgroundColor: "#f3f4f6" }} 
                  />
                ) : (
                  <div style={{ width: 140, height: 100, borderRadius: 12, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#BDCAC1", flexShrink: 0 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: "#191C1E" }}>
                        {v.model.brand} {v.model.name}
                      </h3>
                      <p style={{ fontSize: 14, color: "#6E7A72", margin: "0 0 12px" }}>
                        {v.vehicle.license_plate} · 📍 {v.location.city}
                      </p>
                    </div>
                    <span style={{ 
                      padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                      background: v.vehicle.status === "available" ? "#ECFDF5" : (v.vehicle.status === "archived" ? "#F3F4F6" : "#FEF2F2"), 
                      color: v.vehicle.status === "available" ? "#10B981" : (v.vehicle.status === "archived" ? "#6B7280" : "#EF4444") 
                    }}>
                      {v.vehicle.status === "available" ? "Đang hoạt động" : (v.vehicle.status === "archived" ? "Ngừng hoạt động" : "Tạm ngưng")}
                    </span>
                  </div>

                  {v.vehicle.status === "archived" && (
                    <div style={{ 
                      marginTop: 8, background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, 
                      padding: "8px 12px", fontSize: 13, color: "#991B1B", fontWeight: 500, display: "flex", alignItems: "flex-start", gap: 6 
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                      <div>
                        <strong>Xe bị ngừng hoạt động:</strong> {v.vehicle.status_reason || "Không có lý do cụ thể."}
                      </div>
                    </div>
                  )}
                  
                  {/* Statistics block to mimic Mioto */}
                  <div style={{ display: "flex", gap: 32, marginTop: 16, paddingBottom: 16, borderBottom: "1px dashed #E5EBE8" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase" }}>Số chuyến</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#191C1E" }}>{v.trip_count || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase" }}>Doanh thu</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#191C1E" }}>{Number(v.revenue || 0).toLocaleString("vi")}đ</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase" }}>Đánh giá</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#191C1E" }}>{v.avg_rating > 0 ? `${v.avg_rating.toFixed(1)} ⭐` : "Chưa có"}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      <button 
                        disabled={v.vehicle.status === "archived"}
                        onClick={() => {
                          setSettingVehicleId(v.vehicle.id);
                          loadUnavailabilities(v.vehicle.id);
                        }}
                        style={{ 
                          padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none",
                          background: v.vehicle.status === "archived" ? "#E5EBE8" : "#006C4C", 
                          color: v.vehicle.status === "archived" ? "#BDCAC1" : "#fff", 
                          cursor: v.vehicle.status === "archived" ? "not-allowed" : "pointer"
                        }}>
                        Quản lý Lịch bận
                      </button>
                      <button
                        disabled={v.vehicle.status === "archived"}
                        onClick={() => setPricingVehicleId(v.vehicle.id)}
                        style={{ 
                          padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "1px solid #E5EBE8",
                          background: "#fff", 
                          color: v.vehicle.status === "archived" ? "#BDCAC1" : "#191C1E", 
                          cursor: v.vehicle.status === "archived" ? "not-allowed" : "pointer", 
                          display: "flex", alignItems: "center", gap: 6
                        }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        Chiến lược giá
                      </button>
                    <button 
                      onClick={() => navigate(`/cars/${v.vehicle.id}`)}
                      style={{ 
                        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "1px solid #E5EBE8",
                        background: "#fff", color: "#191C1E", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                      }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Xem trên hệ thống
                    </button>
                  </div>
                </div>
              </div>
            )) : activeTab === "bookings" ? (
              <>
                {paginatedOwnerBookings.map((b: any) => {
              const start = new Date(b.start_time).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"});
              const end = new Date(b.end_time).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"});
              const isPastEndTime = new Date(b.end_time).getTime() < Date.now();
              // Do not automatically set to completed if they haven't explicitly completed it.
              const effectiveStatus = b.status === "paid" ? "completed" : b.status;
              let statusText = "Chờ duyệt"; let statusBg = "#FEF3C7"; let statusColor = "#F59E0B";
              if (effectiveStatus === "pending") { statusText = "Chờ duyệt"; statusBg = "#FEF3C7"; statusColor = "#F59E0B"; }
              if (effectiveStatus === "confirmed") { statusText = "Đã xác nhận"; statusBg = "#EFF6FF"; statusColor = "#3B82F6"; }
              if (effectiveStatus === "active" || effectiveStatus === "running") { statusText = "Đang cho thuê"; statusBg = "#ECFDF5"; statusColor = "#10B981"; }
              if (effectiveStatus === "pending_payment") { statusText = "Chờ thanh toán"; statusBg = "#F3F4F6"; statusColor = "#6B7280"; }
              if (effectiveStatus === "completed") { statusText = "Đã hoàn thành"; statusBg = "#D1FAE5"; statusColor = "#059669"; }
              if (effectiveStatus === "cancelled") { statusText = "Đã hủy"; statusBg = "#FEF2F2"; statusColor = "#EF4444"; }

              return (
                <div key={b.booking_id} style={{
                  background: "#fff", borderRadius: 16, padding: 16,
                  border: "1px solid #E5EBE8", display: "flex", gap: 20, alignItems: "flex-start",
                  transition: "box-shadow 0.2s",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px dashed #E5EBE8", paddingBottom: 16, marginBottom: 16 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", background: "#ECFDF5", padding: "4px 10px", borderRadius: 8, marginRight: 8 }}>
                          Mã đơn: GC-{String(b.booking_id).padStart(5, "0")}
                        </span>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: "10px 0 4px", color: "#191C1E" }}>
                          {b.vehicle_brand} {b.vehicle_name} ({b.license_plate})
                        </h3>
                        <p style={{ fontSize: 14, color: "#6E7A72", margin: 0 }}>
                          👤 Khách hàng: {b.customer_name} · 📞 {b.customer_phone}
                        </p>
                      </div>
                      <div>
                        {renderStepper(effectiveStatus)}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Lịch thuê xe</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#191C1E" }}>Nhận: <span style={{color: "var(--green)"}}>{start}</span></div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#191C1E", marginTop: 4 }}>Trả: <span style={{color: "var(--green)"}}>{end}</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Giá trị đơn (Gốc)</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#191C1E" }}>
                          {Number(b.total_price - (b.overtime_fee || 0) - (b.over_km_fee || 0) - (b.extra_fee || 0)).toLocaleString("vi")}đ
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#6E7A72", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                          {effectiveStatus === "cancelled" ? "Đã hoàn tiền (Cọc 30%)" : 
                           `Đã thanh toán ${effectiveStatus === "pending" ? "(Cọc 30% - Tạm giữ)" : "(Cọc 30%)"}`}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: effectiveStatus === "cancelled" ? "#9CA3AF" : "var(--green)", textDecoration: effectiveStatus === "cancelled" ? "line-through" : "none" }}>
                          {Number(b.deposit_amount).toLocaleString("vi")}đ
                        </div>
                      </div>
                    </div>
                    {effectiveStatus === "active" || effectiveStatus === "running" ? (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #E5EBE8", display: "flex", justifyContent: "flex-end" }}>
                        <button 
                          onClick={() => {
                            setCompletingBooking(b);
                            setActualKM(b.planned_km); // default to planned
                          }}
                          style={{
                            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none",
                            background: "#006C4C", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                          }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          Tính tiền & Nhận xe
                        </button>
                      </div>
                    ) : effectiveStatus === "pending" ? (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #E5EBE8" }}>
                        {/* Customer profile card */}
                        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                            Hồ sơ khách hàng
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                            <div><span style={{color: "#6E7A72"}}>Họ tên:</span> <strong>{b.customer_name}</strong></div>
                            <div><span style={{color: "#6E7A72"}}>SĐT:</span> <strong>{b.customer_phone}</strong></div>
                            <div><span style={{color: "#6E7A72"}}>Email:</span> <strong>{b.customer_email || "Chưa cung cấp"}</strong></div>
                            <div><span style={{color: "#6E7A72"}}>Bằng lái:</span> <strong style={{color: b.customer_license_no ? "#191C1E" : "#EF4444"}}>{b.customer_license_no || "✗ Chưa cung cấp"}</strong></div>
                            <div style={{gridColumn: "span 2"}}><span style={{color: "#6E7A72"}}>Số chuyến đã thuê:</span> <strong style={{color: "#3B82F6"}}>{b.customer_trip_count || 0} chuyến</strong></div>
                          </div>
                        </div>
                        {/* Reject reason input */}
                        <div style={{ marginBottom: 12 }}>
                          <input
                            id={`reject-note-${b.booking_id}`}
                            type="text"
                            placeholder="Lý do từ chối (nếu có)..."
                            style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5EBE8", borderRadius: 8, fontSize: 13, outline: "none" }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                          <button
                            onClick={async () => {
                              const note = (document.getElementById(`reject-note-${b.booking_id}`) as HTMLInputElement)?.value || "";
                              if (window.confirm("Xác nhận từ chối đơn đặt xe này?")) {
                                try {
                                  await apiClient(`/owner/bookings/${b.booking_id}/reject`, "POST", { owner_note: note });
                                  loadOwnerBookings();
                                } catch (err: any) { alert(err.message || "Lỗi"); }
                              }
                            }}
                            style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "1px solid #FECACA", background: "#FEF2F2", color: "#EF4444", cursor: "pointer" }}
                          >
                            ✗ Từ chối
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm("Xác nhận chấp nhận đơn đặt xe này?")) {
                                try {
                                  await apiClient(`/owner/bookings/${b.booking_id}/approve`, "POST", {});
                                  loadOwnerBookings();
                                } catch (err: any) { alert(err.message || "Lỗi"); }
                              }
                            }}
                            style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", background: "#006C4C", color: "#fff", cursor: "pointer" }}
                          >
                            ✓ Chấp nhận
                          </button>
                        </div>
                      </div>
                    ) : effectiveStatus === "confirmed" ? (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #E5EBE8", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                        <button 
                          onClick={() => {
                            if (window.confirm("Bạn muốn hủy đơn này? Lưu ý: Việc hủy đơn có thể ảnh hưởng đến đánh giá của bạn.")) {
                              handleUpdateStatus(b.booking_id, "cancelled");
                            }
                          }}
                          style={{
                            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "1px solid #FECACA",
                            background: "#FEF2F2", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center"
                          }}>
                          Hủy đơn
                        </button>
                        <button 
                          onClick={() => {
                            setHandoverBooking(b);
                          }}
                          style={{
                            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none",
                            background: "#3B82F6", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                          }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          Làm thủ tục giao xe
                        </button>
                      </div>
                    ) : null}
                    {effectiveStatus === "pending_payment" && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #E5EBE8", fontSize: 13, color: "#3E4943" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span><strong>Số KM thực tế:</strong> {b.actual_km} km (Giới hạn: {b.planned_km} km)</span>
                          {b.over_km_fee > 0 && <span style={{ color: "#EF4444" }}>+ Phí vượt KM: {Number(b.over_km_fee).toLocaleString("vi")}đ</span>}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span><strong>Thời gian trả thực tế:</strong> {b.actual_end_time ? new Date(b.actual_end_time).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"}) : "-"}</span>
                          {b.overtime_fee > 0 && <span style={{ color: "#EF4444" }}>+ Phí quá giờ: {Number(b.overtime_fee).toLocaleString("vi")}đ</span>}
                        </div>
                        {(Number(b.extra_fee) > 0 || (b.extra_fee_desc && b.extra_fee_desc.length > 0)) ? (
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span><strong>Phụ phí khác:</strong> {b.extra_fee_desc || "Không có ghi chú"}</span>
                            <span style={{ color: "#EF4444" }}>+ {Number(b.extra_fee || 0).toLocaleString("vi")}đ</span>
                          </div>
                        ) : null}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                          <button
                            onClick={() => {
                              if (window.confirm(`Xác nhận bạn đã nhận đủ số tiền thanh toán còn lại từ khách hàng?`)) {
                                handleUpdateStatus(b.booking_id, "completed");
                              }
                            }}
                            style={{
                              padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none",
                              background: "#10B981", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                            }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            Đã nhận thanh toán
                          </button>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#191C1E" }}>
                            Tổng thu cuối cùng: <span style={{ color: "#006C4C", marginLeft: 8, fontSize: 16 }}>{Number(b.total_price).toLocaleString("vi")}đ</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {effectiveStatus === "completed" && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #E5EBE8", fontSize: 13, color: "#3E4943" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span><strong>Số KM thực tế:</strong> {b.actual_km} km</span>
                          {b.over_km_fee > 0 && <span style={{ color: "#EF4444" }}>+ Phí vượt KM: {Number(b.over_km_fee).toLocaleString("vi")}đ</span>}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span><strong>Thời gian trả thực tế:</strong> {b.actual_end_time ? new Date(b.actual_end_time).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"}) : "-"}</span>
                          {b.overtime_fee > 0 && <span style={{ color: "#EF4444" }}>+ Phí quá giờ: {Number(b.overtime_fee).toLocaleString("vi")}đ</span>}
                        </div>
                        {(Number(b.extra_fee) > 0 || (b.extra_fee_desc && b.extra_fee_desc.length > 0)) ? (
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span><strong>Phụ phí khác:</strong> {b.extra_fee_desc || "Không có ghi chú"}</span>
                            <span style={{ color: "#EF4444" }}>+ {Number(b.extra_fee || 0).toLocaleString("vi")}đ</span>
                          </div>
                        ) : null}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, background: "#ECFDF5", padding: "12px 16px", borderRadius: 12 }}>
                          <span style={{ color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Đã thanh toán đủ
                          </span>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#191C1E" }}>
                            Tổng thu cuối cùng: <span style={{ color: "#006C4C", marginLeft: 8, fontSize: 18 }}>{Number(b.total_price).toLocaleString("vi")}đ</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
              {totalBookingPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 24, padding: "8px 0" }}>
                  <button
                    disabled={bookingPage === 1}
                    onClick={() => setBookingPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                      border: "1px solid #E5EBE8", background: bookingPage === 1 ? "#F3F4F6" : "#fff",
                      color: bookingPage === 1 ? "#9CA3AF" : "#3E4943",
                      cursor: bookingPage === 1 ? "not-allowed" : "pointer"
                    }}
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalBookingPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setBookingPage(page)}
                      style={{
                        width: 36, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 700,
                        border: page === bookingPage ? "none" : "1px solid #E5EBE8",
                        background: page === bookingPage ? "#006C4C" : "#fff",
                        color: page === bookingPage ? "#fff" : "#3E4943",
                        cursor: "pointer"
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={bookingPage === totalBookingPages}
                    onClick={() => setBookingPage(prev => Math.min(prev + 1, totalBookingPages))}
                    style={{
                      padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                      border: "1px solid #E5EBE8", background: bookingPage === totalBookingPages ? "#F3F4F6" : "#fff",
                      color: bookingPage === totalBookingPages ? "#9CA3AF" : "#3E4943",
                      cursor: bookingPage === totalBookingPages ? "not-allowed" : "pointer"
                    }}
                  >
                    Sau
                  </button>
                </div>
              )}
              </>
            ) : items.map(item => {
              const s = STATUS_MAP[item.status];
              const coverImg = item.images?.find(i => i.type === "front")?.url;
              return (
                <div key={item.id} style={{
                  background: "#fff", borderRadius: 16, padding: 16,
                  border: "1px solid #E5EBE8", display: "flex", gap: 20, alignItems: "flex-start",
                  transition: "box-shadow 0.2s",
                }}>
                  {coverImg || fallbackImg ? (
                    <img src={coverImg || fallbackImg} alt="xe" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== fallbackImg) {
                          target.src = fallbackImg;
                        }
                      }}
                      style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 12, flexShrink: 0, backgroundColor: "#f3f4f6" }} 
                    />
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
                        <button onClick={() => navigate("/owner/register/steps", { state: { prefill: item } })} style={{
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

      {/* Trip Completion Modal */}
      {completingBooking && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff", padding: 32, borderRadius: 20, width: "100%", maxWidth: 500,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px", color: "#006C4C" }}>Hoàn thành chuyến đi</h3>
                <p style={{ fontSize: 14, color: "#6E7A72", margin: 0 }}>Mã đơn: GC-{String(completingBooking.booking_id).padStart(5, "0")}</p>
              </div>
              <button onClick={() => setCompletingBooking(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#6E7A72" }}>×</button>
            </div>
            
            <div style={{ background: "#F0FDF4", padding: 16, borderRadius: 12, marginBottom: 20, border: "1px solid #BBF7D0" }}>
              <div style={{ fontSize: 13, color: "#006C4C", fontWeight: 700, marginBottom: 8 }}>Khách hàng: {completingBooking.customer_name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#3E4943", marginBottom: 4 }}>
                <span>KM giới hạn:</span>
                <strong>{completingBooking.planned_km} km</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#3E4943" }}>
                <span>Hạn trả xe:</span>
                <strong>{new Date(completingBooking.end_time).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"})}</strong>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#191C1E", marginBottom: 6 }}>Tổng số KM khách đã chạy <span style={{color: "red"}}>*</span></label>
              <div style={{ position: "relative" }}>
                <input 
                  type="number" 
                  value={actualKM}
                  onChange={e => setActualKM(e.target.value ? Number(e.target.value) : "")}
                  placeholder={`Vd: ${completingBooking.planned_km}`}
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #E5EBE8", borderRadius: 10, fontSize: 14, outline: "none", transition: "border 0.2s" }}
                />
                <span style={{ position: "absolute", right: 14, top: 12, color: "#6E7A72", fontSize: 14, fontWeight: 600 }}>km</span>
              </div>
              <p style={{ fontSize: 12, color: "#6E7A72", margin: "6px 0 0" }}>Nhập tổng số khoảng cách (KM) khách đã di chuyển trong chuyến đi này.</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#191C1E", marginBottom: 6 }}>Phụ phí khác (Vệ sinh, khử mùi,...) <span style={{ color: "#6E7A72", fontWeight: 400 }}>(Tùy chọn)</span></label>
              <div style={{ position: "relative", marginBottom: 8 }}>
                <input 
                  type="number" 
                  value={extraFee}
                  onChange={e => setExtraFee(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0"
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #E5EBE8", borderRadius: 10, fontSize: 14, outline: "none", transition: "border 0.2s" }}
                />
                <span style={{ position: "absolute", right: 14, top: 12, color: "#6E7A72", fontSize: 14, fontWeight: 600 }}>VNĐ</span>
              </div>
              <input 
                type="text" 
                value={extraFeeDesc}
                onChange={e => setExtraFeeDesc(e.target.value)}
                placeholder="Lý do thu phụ phí (vd: Phí rửa xe, khử mùi thuốc lá...)"
                style={{ width: "100%", padding: "12px 14px", border: "1px solid #E5EBE8", borderRadius: 10, fontSize: 14, outline: "none" }}
              />
            </div>

            <p style={{ fontSize: 13, color: "#EF4444", margin: "0 0 20px", background: "#FEF2F2", padding: 12, borderRadius: 8, border: "1px solid #FECACA" }}>
              <strong>Lưu ý:</strong> Việc kết thúc chuyến đi sẽ được ghi nhận vào lúc này. Phí trả trễ giờ (nếu có) sẽ được hệ thống tự động tính toán.
            </p>

            <button 
              onClick={handleCompleteTrip}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 800, border: "none",
                background: "#006C4C", color: "#fff", cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 4px 10px rgba(0, 108, 76, 0.2)"
              }}>
              Xác nhận Hoàn thành chuyến
            </button>
          </div>
        </div>
      )}

      {/* Handover Modal (Check-in) */}
      {handoverBooking && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff", padding: 32, borderRadius: 20, width: "100%", maxWidth: 500,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px", color: "#3B82F6" }}>Biên bản Giao Xe</h3>
                <p style={{ fontSize: 14, color: "#6E7A72", margin: 0 }}>Giao xe cho: <strong>{handoverBooking.customer_name}</strong></p>
              </div>
              <button onClick={() => setHandoverBooking(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#6E7A72" }}>×</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#191C1E", marginBottom: 12 }}>1. Kiểm tra an toàn bắt buộc</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#F8F9FB", padding: 16, borderRadius: 12 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={checklist.license} onChange={e => setChecklist({...checklist, license: e.target.checked})} style={{ marginTop: 2, width: 16, height: 16 }} />
                  <div style={{ fontSize: 14, color: "#3E4943" }}>Tôi đã đối chiếu khớp CCCD và Bằng Lái Xe của khách hàng.</div>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={checklist.photos} onChange={e => setChecklist({...checklist, photos: e.target.checked})} style={{ marginTop: 2, width: 16, height: 16 }} />
                  <div style={{ fontSize: 14, color: "#3E4943" }}>Tôi đã tự quay video / chụp ảnh 4 góc xe, nội thất và mức xăng hiện tại để làm bằng chứng.</div>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <label style={{ fontSize: 14, fontWeight: 800, color: "#191C1E" }}>2. Chốt số ODO (Tùy chọn)</label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6E7A72", cursor: "pointer" }}>
                  <input type="checkbox" checked={skipODO} onChange={e => setSkipODO(e.target.checked)} />
                  Bỏ qua ghi nhận
                </label>
              </div>
              {!skipODO ? (
                <div>
                  <div style={{ position: "relative" }}>
                    <input 
                      type="number" 
                      value={startODO}
                      onChange={e => setStartODO(e.target.value ? Number(e.target.value) : "")}
                      placeholder="Nhập số KM trên đồng hồ lúc này"
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #E5EBE8", borderRadius: 10, fontSize: 14, outline: "none" }}
                    />
                    <span style={{ position: "absolute", right: 14, top: 12, color: "#6E7A72", fontSize: 14, fontWeight: 600 }}>km</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#6E7A72", margin: "6px 0 0" }}>Nếu không nhớ, bạn có thể chọn "Bỏ qua ghi nhận". Lúc trả xe hệ thống sẽ hỏi bạn "Tổng số KM khách đã chạy" tính theo Trip A/B.</p>
                </div>
              ) : (
                <div style={{ padding: 12, background: "#FEF3C7", borderRadius: 8, fontSize: 13, color: "#92400E" }}>
                  Bạn đã chọn bỏ qua. Hãy yêu cầu khách bấm reset Trip A/B về 0 trên bảng điều khiển xe để dễ đối chiếu.
                </div>
              )}
            </div>

            <button 
              onClick={handleHandover}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 800, border: "none",
                background: "#3B82F6", color: "#fff", cursor: "pointer", transition: "all 0.2s"
              }}>
              Xác nhận Giao Xe
            </button>
          </div>
        </div>
      )}

      {settingVehicleId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", padding: 16, borderRadius: 16, width: "100%", maxWidth: 480,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#191C1E" }}>Quản lý Lịch bận</h3>
              <button onClick={() => setSettingVehicleId(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            
            <p style={{ fontSize: 14, color: "#6E7A72", margin: "0 0 20px" }}>
              Thêm các ngày bạn muốn khóa lại, không cho khách thuê (ví dụ: ngày gia đình dùng xe, ngày mang xe đi bảo dưỡng).
            </p>
            
            <div style={{ background: "#F8F9FB", padding: 16, borderRadius: 12, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6E7A72", marginBottom: 4 }}>Từ ngày</label>
                  <input 
                    type="date" 
                    value={blockFrom}
                    onChange={e => setBlockFrom(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5EBE8", borderRadius: 8, fontSize: 14 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6E7A72", marginBottom: 4 }}>Đến ngày</label>
                  <input 
                    type="date" 
                    value={blockTo}
                    onChange={e => setBlockTo(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5EBE8", borderRadius: 8, fontSize: 14 }}
                  />
                </div>
              </div>
              <button 
                onClick={addUnavailability}
                disabled={isBlocking || !blockFrom || !blockTo}
                style={{ 
                  width: "100%", padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700,
                  border: "none", background: (!blockFrom || !blockTo) ? "#E5EBE8" : "#006C4C", 
                  color: (!blockFrom || !blockTo) ? "#9CA3AF" : "#fff", cursor: (!blockFrom || !blockTo) ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}>
                {isBlocking ? "Đang thêm..." : "+ Thêm ngày bận"}
              </button>
            </div>

            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#191C1E", margin: "0 0 12px" }}>Danh sách ngày đã khóa</h4>
            {unavailabilities.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#9CA3AF", fontSize: 14, background: "#F9FAFB", borderRadius: 8 }}>
                Chưa có ngày bận nào được thiết lập.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {unavailabilities.map(u => (
                  <div key={u.id} style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px", background: "#fff", border: "1px solid #E5EBE8", borderRadius: 10
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#191C1E" }}>
                        {new Date(u.start_time).toLocaleDateString("vi-VN")} - {new Date(u.end_time).toLocaleDateString("vi-VN")}
                      </div>
                      <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 500 }}>Đã khóa</div>
                    </div>
                    <button 
                      onClick={() => deleteUnavailability(u.id)}
                      style={{ background: "#FEF2F2", border: "none", color: "#EF4444", padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Rules Modal */}
      {pricingVehicleId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 560, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px", color: "#006C4C" }}>Chiến lược giá linh hoạt</h3>
                <p style={{ fontSize: 14, color: "#6E7A72", margin: 0 }}>Cài đặt giá cuối tuần & giảm giá thuê nhiều ngày</p>
              </div>
              <button onClick={() => setPricingVehicleId(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#6E7A72" }}>×</button>
            </div>

            {/* Add new rule */}
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#191C1E", marginBottom: 14 }}>Thêm quy tắc giá mới</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button
                  onClick={() => setNewRuleType("weekend")}
                  style={{ flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "2px solid", borderColor: newRuleType === "weekend" ? "#006C4C" : "#E5EBE8", background: newRuleType === "weekend" ? "#ECFDF5" : "#fff", color: newRuleType === "weekend" ? "#006C4C" : "#3E4943", cursor: "pointer", transition: "all 0.2s" }}
                >
                  Giá Cuối Tuần
                </button>
                <button
                  onClick={() => setNewRuleType("promo")}
                  style={{ flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "2px solid", borderColor: newRuleType === "promo" ? "#006C4C" : "#E5EBE8", background: newRuleType === "promo" ? "#ECFDF5" : "#fff", color: newRuleType === "promo" ? "#006C4C" : "#3E4943", cursor: "pointer", transition: "all 0.2s" }}
                >
                  Khuyến mãi theo ngày
                </button>
              </div>

              {newRuleType === "weekend" ? (
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3E4943", marginBottom: 6 }}>Tăng thêm (%) vào Thứ 7 & Chủ Nhật</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" min={0} max={100} value={newRuleExtra} onChange={e => setNewRuleExtra(e.target.value ? Number(e.target.value) : "")}
                      placeholder="VD: 15" style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #E5EBE8", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    <span style={{ position: "absolute", right: 14, top: 10, color: "#6E7A72", fontWeight: 700 }}>%</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#6E7A72", margin: "6px 0 0" }}>Ví dụ: nhập 15 → ngày cuối tuần đắt hơn 15% so với ngày thường.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3E4943", marginBottom: 6 }}>Từ ngày</label>
                      <input type="date" value={newPromoStart} onChange={e => setNewPromoStart(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5EBE8", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3E4943", marginBottom: 6 }}>Đến ngày</label>
                      <input type="date" value={newPromoEnd} onChange={e => setNewPromoEnd(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5EBE8", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3E4943", marginBottom: 6 }}>Giảm giá (%)</label>
                    <div style={{ position: "relative" }}>
                      <input type="number" min={0} max={50} value={newRuleDiscount} onChange={e => setNewRuleDiscount(e.target.value ? Number(e.target.value) : "")}
                        placeholder="VD: 10" style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #E5EBE8", borderRadius: 8, fontSize: 14, outline: "none" }} />
                      <span style={{ position: "absolute", right: 14, top: 10, color: "#6E7A72", fontWeight: 700 }}>%</span>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={addPricingRule} style={{ marginTop: 14, width: "100%", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 800, border: "none", background: "#006C4C", color: "#fff", cursor: "pointer" }}>
                + Thêm quy tắc
              </button>
            </div>

            {/* Existing rules */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#191C1E", marginBottom: 12 }}>Quy tắc đang áp dụng</div>
            {pricingRules.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#9CA3AF", fontSize: 14, background: "#F9FAFB", borderRadius: 10 }}>
                Chưa có quy tắc nào. Thêm quy tắc phía trên để tăng doanh thu!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pricingRules.map((rule: any) => (
                  <div key={rule.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: rule.is_active ? "#ECFDF5" : "#F9FAFB", border: "1px solid", borderColor: rule.is_active ? "#A7F3D0" : "#E5EBE8", borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#191C1E" }}>
                        {rule.rule_type === "weekend" ? "Giá Cuối Tuần" : rule.rule_type === "multi_day" ? "Khuyến mãi dài ngày" : "Khuyến mãi theo ngày"}
                        {!rule.is_active && <span style={{ marginLeft: 8, fontSize: 11, color: "#6E7A72" }}>(Tắt)</span>}
                      </div>
                      <div style={{ fontSize: 13, color: "#6E7A72", marginTop: 4 }}>
                        {rule.rule_type === "weekend"
                          ? `Tăng +${rule.extra_percent}% vào Thứ 7 & Chủ Nhật`
                          : (rule.promo_start_date && rule.promo_end_date && !rule.promo_start_date.startsWith("0001-01-01")
                            ? `Giảm ${rule.discount_percent}% từ ngày ${new Date(rule.promo_start_date).toLocaleDateString("vi-VN")} đến ngày ${new Date(rule.promo_end_date).toLocaleDateString("vi-VN")}`
                            : `Giảm ${rule.discount_percent}%`
                          )}
                      </div>
                    </div>
                    <button onClick={() => deletePricingRule(rule.id)} style={{ background: "#FEF2F2", border: "none", color: "#EF4444", padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Xóa</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
