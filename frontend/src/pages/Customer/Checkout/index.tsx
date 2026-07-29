import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookingContext } from "../../../context/BookingContext";
import { vehicleService } from "../../../services/vehicle.service";
import { userService } from "../../../services/user.service";
import { useAuth } from "../../../hooks/useAuth";
import { MODEL_LOCAL_IMAGES } from "../../../data/localImages";
import { formatCurrency } from "../../../utils/formatters";
import DeliveryMap from "./DeliveryMap";

const PLAN_HOURS: Record<number, number> = { 1: 4, 2: 8, 3: 24 };
const PLAN_NAMES: Record<number, string> = { 1: "Gói 4 giờ", 2: "Gói 8 giờ", 3: "Gói 24 giờ" };
const DEPOSIT_RATIO = 0.3;

function addHours(iso: string, h: number) {
  const d = new Date(iso);
  d.setHours(d.getHours() + h);
  return d.toISOString();
}
function getLocalDateStr(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toLocal(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return getLocalDateStr(d);
}
function fromLocal(local: string) {
  return new Date(local).toISOString();
}
function formatDT(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const StepBar: React.FC<{ step: number }> = ({ step }) => {
  const steps = ["Thông tin", "Thanh toán", "Xác nhận"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${done ? "bg-[#006C4C] border-[#006C4C] text-white"
                  : active ? "bg-white border-[#006C4C] text-[#006C4C]"
                  : "bg-white border-[#E5E7EB] text-[#9CA3AF]"}`}>
                {done ? "✓" : idx}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? "text-[#006C4C]" : "text-[#9CA3AF]"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-16 mb-5 mx-1 ${done ? "bg-[#006C4C]" : "bg-[#E5E7EB]"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const [params] = useSearchParams();
  const vehicleId = Number(params.get("vehicle") ?? 0);
  
  const queryStartDate = params.get("startDate") ?? "";
  const queryDelivery = params.get("delivery") ?? "self";
  const planId = Number(params.get("plan") ?? 3);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { setPendingBooking } = useContext(BookingContext);

  const [detail, setDetail]     = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // License verification states
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseFrontUrl, setLicenseFrontUrl] = useState("");
  const [licenseBackUrl, setLicenseBackUrl] = useState("");
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [verifySubmitLoading, setVerifySubmitLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const defaultStart = () => {
    if (queryStartDate) return toLocal(queryStartDate);
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return toLocal(d.toISOString());
  };
  const [startLocal, setStartLocal] = useState(defaultStart);

  const hours = PLAN_HOURS[planId] ?? 24;

  const defaultEnd = () => {
    const start = new Date(fromLocal(defaultStart()));
    start.setHours(start.getHours() + hours);
    return toLocal(start.toISOString());
  };
  const [endLocal, setEndLocal] = useState(defaultEnd);

  // Update endLocal when startLocal changes
  useEffect(() => {
    const start = new Date(fromLocal(startLocal));
    start.setHours(start.getHours() + hours);
    setEndLocal(toLocal(start.toISOString()));
  }, [startLocal, hours]);

  const queryAddress = params.get("address") || "";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  
  const [note, setNote] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(queryAddress || "");
  const [deliveryDistance, setDeliveryDistance] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!vehicleId) { navigate("/cars"); return; }
    vehicleService.getVehicleDetail(vehicleId).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [vehicleId, navigate]);

  // Fetch fresh user profile on mount & when user state changes
  const fetchFreshUser = useCallback(() => {
    if (user) {
      userService.getMe()
        .then(u => {
          setCurrentUser(u);
          setLicenseNo(u.license_no || "");
          setForm({
            name: u.name || "",
            phone: u.phone || "",
            email: u.email || "",
          });
        })
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    fetchFreshUser();
  }, [fetchFreshUser]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#bbf7d0] border-t-[#006C4C] rounded-full animate-spin" />
    </div>
  );
  if (!detail) return (
    <div className="text-center py-20 text-[#6E7A72]">
      <p className="text-4xl mb-3">🚗</p>
      <p>Không tìm thấy xe. <Link to="/cars" className="text-[#006C4C] underline">Quay lại</Link></p>
    </div>
  );

  const { vehicle, model, location, pricing } = detail;
  const isHCM = location?.city?.toLowerCase().includes("hồ chí minh") || location?.city?.toLowerCase().includes("hcm");
  const airportName = isHCM ? "Sân bay Tân Sơn Nhất" : "Sân bay Nội Bài";

  const discountPercent = detail.promo_discount ?? 0;
  const originalPlanPrice = pricing?.find((p: any) => p.rental_plan_id === planId)?.price ?? 0;
  const planPrice = discountPercent > 0 ? originalPlanPrice * (1 - discountPercent / 100) : originalPlanPrice;
  const planName = PLAN_NAMES[planId] ?? "Gói thuê";
  
  const startISO  = fromLocal(startLocal);
  const endISO    = fromLocal(endLocal);
  
  const totalRentalPrice = planPrice;
  
  const distanceToUse = queryDelivery === "custom" 
    ? deliveryDistance 
    : (queryDelivery === "airport" ? 15 : 0);
  
  const deliveryFee = distanceToUse > 0 ? Math.round(distanceToUse * 10000) : 0;
  const serviceFee = Math.round(totalRentalPrice * 0.1);
  const totalPrice = totalRentalPrice + deliveryFee + serviceFee;
  
  const deposit   = Math.round(totalPrice * DEPOSIT_RATIO);
  const imgUrl    = MODEL_LOCAL_IMAGES[model.vehicle_model_id] ?? detail.images?.[0]?.image_url ?? "";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = "Vui lòng nhập họ tên";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt xe!");
      return;
    }
    if (currentUser?.license_status !== "verified") {
      alert("Giấy phép lái xe của bạn chưa được xác thực!");
      return;
    }
    if (!validate()) return;
    setPendingBooking({
      vehicleId: vehicle.vehicle_id,
      vehicleInfo: {
        name: model.name, brand: model.brand, imageUrl: imgUrl,
        locationName: queryDelivery === "custom" ? deliveryAddress : queryDelivery === "airport" ? airportName : (location?.name ?? ""), 
        locationCity: location?.city ?? "",
        licensePlate: vehicle.license_plate, batteryLevel: vehicle.battery_level,
      },
      planId, planName, planDurationHours: hours,
      startTime: startISO, endTime: endISO,
      totalPrice: totalPrice, depositAmount: deposit,
      contactInfo: { ...form, licenseNo: currentUser?.license_no || "" },
      customerNote: note,
    });
    navigate("/customer/payment");
  };

  const handleFileUpload = (side: "front" | "back", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (side === "front") setUploadingFront(true);
    else setUploadingBack(true);

    // Simulated secure upload. Create object URL for client preview.
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      if (side === "front") {
        setLicenseFrontUrl(url);
        setUploadingFront(false);
      } else {
        setLicenseBackUrl(url);
        setUploadingBack(false);
      }
    }, 1200);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");

    if (!licenseNo.trim()) {
      setVerifyError("Vui lòng nhập số GPLX!");
      return;
    }
    if (!licenseFrontUrl || !licenseBackUrl) {
      setVerifyError("Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau!");
      return;
    }

    setVerifySubmitLoading(true);
    try {
      await userService.submitLicense({
        license_no: licenseNo,
        license_front_url: licenseFrontUrl,
        license_back_url: licenseBackUrl,
      });
      fetchFreshUser();
    } catch (err: any) {
      setVerifyError(err.error || err.message || "Không thể gửi hồ sơ xác thực.");
    } finally {
      setVerifySubmitLoading(false);
    }
  };

  const licenseStatus = currentUser?.license_status || "unverified";

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <StepBar step={1} />

        <div className={`flex flex-col lg:flex-row gap-6 items-start ${!user || licenseStatus !== "verified" ? "justify-center" : ""}`}>

          {/* ── LEFT: checkout logic & verification ──────────────── */}
          <div className={`flex flex-col gap-5 w-full ${!user || licenseStatus !== "verified" ? "max-w-2xl mx-auto" : "flex-1"}`}>

            {/* CASE 1: Guest (not logged in) */}
            {!user ? (
              <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-md text-center flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl">🔑</div>
                <div>
                  <h2 className="font-bold text-[#191C1E] text-xl mb-2">Yêu cầu đăng nhập</h2>
                  <p className="text-sm text-[#6E7A72] max-w-md mx-auto">
                    Để đảm bảo an toàn và tính bảo mật thông tin, bạn cần đăng nhập tài khoản GreenCar trước khi thực hiện đặt xe và thanh toán.
                  </p>
                </div>
                <Link to={`/auth/login?redirect=/customer/checkout?vehicle=${vehicleId}%26plan=${planId}%26startDate=${queryStartDate}%26delivery=${queryDelivery}`}
                  className="bg-[#006C4C] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#004832] transition-colors shadow-md">
                  Đăng nhập ngay
                </Link>
                <p className="text-xs text-[#9CA3AF]">Chưa có tài khoản? <Link to="/auth/register" className="text-[#006C4C] underline">Đăng ký mới</Link></p>
              </div>
            ) : (
              <>
                {/* CASE 2: Logged in but driving license not verified */}
                {licenseStatus !== "verified" && (
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6 pb-5 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">🪪</div>
                      <div>
                        <h2 className="font-bold text-[#191C1E] text-lg">Xác thực Giấy phép lái xe (GPLX)</h2>
                        <p className="text-xs text-[#6E7A72] mt-0.5">GreenCar yêu cầu xác thực bằng lái xe hợp lệ để có quyền vận hành xe tự lái.</p>
                      </div>
                    </div>

                    {/* Pending state details */}
                    {licenseStatus === "pending" ? (
                      <div className="text-center py-6 px-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl animate-pulse">⏳</div>
                        <h3 className="font-bold text-[#b45309] text-base">Hồ sơ đang chờ phê duyệt</h3>
                        <p className="text-sm text-[#78350F] max-w-md">
                          Thông tin bằng lái xe của bạn đã được gửi thành công. Ban quản trị GreenCar sẽ kiểm tra và duyệt hồ sơ của bạn trong vòng 5-10 phút. Vui lòng tải lại trang sau khi được phê duyệt để hoàn tất checkout.
                        </p>
                        <button onClick={fetchFreshUser} className="mt-2 bg-[#b45309] hover:bg-[#92400E] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                          Tải lại trạng thái ↻
                        </button>
                      </div>
                    ) : (
                      /* Unverified or Rejected state: Show Upload Form */
                      <form onSubmit={handleVerifySubmit} className="flex flex-col gap-5">
                        {licenseStatus === "rejected" && (
                          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 text-sm text-[#DC2626]">
                            <strong className="block mb-1">❌ GPLX bị từ chối phê duyệt trước đó:</strong>
                            {currentUser?.license_reject_reason || "Thông tin bằng lái hoặc hình ảnh không khớp / mờ."}
                            <span className="block mt-1.5 text-xs text-[#7F1D1D]">Vui lòng kiểm tra lại thông tin và chụp lại ảnh sắc nét hơn để gửi duyệt lại.</span>
                          </div>
                        )}

                        {verifyError && (
                          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
                            {verifyError}
                          </div>
                        )}

                        {/* License Number Input */}
                        <div>
                          <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                            Số giấy phép lái xe (GPLX) *
                          </label>
                          <input
                            type="text"
                            required
                            value={licenseNo}
                            onChange={e => setLicenseNo(e.target.value)}
                            placeholder="Nhập 12 số trên bằng lái xe của bạn"
                            className="w-full h-11 border border-[#E5E7EB] rounded-xl px-3.5 text-sm text-[#191C1E] bg-white transition-colors focus:outline-none focus:border-[#006C4C]"
                          />
                        </div>

                        {/* Front & Back uploads */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Front */}
                          <div>
                            <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                              Ảnh mặt trước bằng lái *
                            </label>
                            <div className="border-2 border-dashed border-[#E5E7EB] hover:border-[#006C4C] rounded-xl p-4 bg-[#F8F9FB] transition-colors relative min-h-[140px] flex flex-col items-center justify-center text-center cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleFileUpload("front", e)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              {uploadingFront ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-6 h-6 border-2 border-green-200 border-t-[#006C4C] rounded-full animate-spin" />
                                  <span className="text-xs text-[#6E7A72]">Đang tải lên...</span>
                                </div>
                              ) : licenseFrontUrl ? (
                                <div className="w-full h-full">
                                  <img src={licenseFrontUrl} alt="Mặt trước" className="w-full h-24 object-cover rounded-lg" />
                                  <span className="text-[10px] text-[#006C4C] font-semibold mt-1.5 block">✓ Thay đổi ảnh</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-2xl">📸</span>
                                  <span className="text-xs font-semibold text-[#191C1E]">Tải ảnh mặt trước</span>
                                  <span className="text-[10px] text-[#6E7A72]">Hỗ trợ file PNG, JPG</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Back */}
                          <div>
                            <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                              Ảnh mặt sau bằng lái *
                            </label>
                            <div className="border-2 border-dashed border-[#E5E7EB] hover:border-[#006C4C] rounded-xl p-4 bg-[#F8F9FB] transition-colors relative min-h-[140px] flex flex-col items-center justify-center text-center cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleFileUpload("back", e)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              {uploadingBack ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-6 h-6 border-2 border-green-200 border-t-[#006C4C] rounded-full animate-spin" />
                                  <span className="text-xs text-[#6E7A72]">Đang tải lên...</span>
                                </div>
                              ) : licenseBackUrl ? (
                                <div className="w-full h-full">
                                  <img src={licenseBackUrl} alt="Mặt sau" className="w-full h-24 object-cover rounded-lg" />
                                  <span className="text-[10px] text-[#006C4C] font-semibold mt-1.5 block">✓ Thay đổi ảnh</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-2xl">📸</span>
                                  <span className="text-xs font-semibold text-[#191C1E]">Tải ảnh mặt sau</span>
                                  <span className="text-[10px] text-[#6E7A72]">Hỗ trợ file PNG, JPG</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={verifySubmitLoading || uploadingFront || uploadingBack}
                          className="w-full bg-[#006C4C] hover:bg-[#004832] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all shadow"
                        >
                          {verifySubmitLoading ? "Đang gửi hồ sơ..." : "Gửi yêu cầu xác thực GPLX"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* CASE 3: Verified User: Show normal checkout details */}
                {licenseStatus === "verified" && (
                  <>
                    {/* Success License Badge */}
                    <div className="flex items-center gap-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="font-bold text-[#065F46] text-sm">Đã xác thực GPLX thành công</p>
                        <p className="text-xs text-[#047857] mt-0.5">Tài khoản của bạn đã đủ điều kiện nhận xe tự lái tại GreenCar.</p>
                      </div>
                    </div>

                    {/* Contact info form */}
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                      <h2 className="font-bold text-[#191C1E] text-base mb-5">Thông tin liên lạc</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* name */}
                        <div>
                          <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                            Họ và tên *
                          </label>
                          <input
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Nguyễn Văn A"
                            className={`w-full h-11 border rounded-xl px-3.5 text-sm text-[#191C1E] bg-white transition-colors focus:outline-none focus:border-[#006C4C] ${errors.name ? "border-red-400" : "border-[#E5E7EB]"}`}
                          />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* phone */}
                        <div>
                          <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                            Số điện thoại *
                          </label>
                          <input
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="0912 345 678"
                            className={`w-full h-11 border rounded-xl px-3.5 text-sm text-[#191C1E] bg-white transition-colors focus:outline-none focus:border-[#006C4C] ${errors.phone ? "border-red-400" : "border-[#E5E7EB]"}`}
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* license */}
                        <div>
                          <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                            Số GPLX * (Đã xác thực)
                          </label>
                          <input
                            value={currentUser?.license_no}
                            readOnly
                            className="w-full h-11 border border-[#E5E7EB] rounded-xl px-3.5 text-sm text-[#6E7A72] bg-[#F8F9FB] cursor-default focus:outline-none"
                          />
                        </div>

                        {/* email */}
                        <div>
                          <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                            Email
                          </label>
                          <input
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="email@example.com"
                            className="w-full h-11 border border-[#E5E7EB] rounded-xl px-3.5 text-sm text-[#191C1E] bg-white transition-colors focus:outline-none focus:border-[#006C4C]"
                          />
                        </div>
                      </div>

                      {/* Map or Note */}
                      {queryDelivery === "custom" ? (
                        <DeliveryMap
                          carLat={location?.latitude ?? 21.0285}
                          carLng={location?.longitude ?? 105.8542}
                          carAddress={location?.name ? `${location.name}, ${location.city}` : "Trung tâm Hà Nội"}
                          defaultNoteAddress={queryAddress}
                          onDistanceChange={(dist, addr) => {
                            setDeliveryDistance(dist);
                            setDeliveryAddress(addr);
                          }}
                        />
                      ) : null}

                      <div className="mt-4">
                        <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                          Ghi chú cho chủ xe (không bắt buộc)
                        </label>
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Ghi chú thêm về yêu cầu đặc biệt..."
                          className="w-full border border-[#E5E7EB] rounded-xl p-3.5 text-sm text-[#191C1E] bg-white transition-colors focus:outline-none focus:border-[#006C4C] min-h-[80px]"
                        />
                      </div>
                    </div>

                    {/* pickup time */}
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                      <h2 className="font-bold text-[#191C1E] text-base mb-5">Thời gian nhận xe</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                            Nhận xe lúc *
                          </label>
                          <input
                            type="datetime-local"
                            value={startLocal}
                            min={toLocal(new Date().toISOString())}
                            onChange={e => setStartLocal(e.target.value)}
                            className="h-11 border border-[#E5E7EB] rounded-xl px-3.5 text-sm text-[#191C1E] bg-white focus:outline-none focus:border-[#006C4C] w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#6E7A72] uppercase tracking-wide mb-1.5">
                            Trả xe lúc *
                          </label>
                          <input
                            type="datetime-local"
                            value={endLocal}
                            readOnly
                            className="h-11 border border-[#E5E7EB] rounded-xl px-3.5 text-sm text-[#6E7A72] bg-[#F8F9FB] focus:outline-none focus:border-[#E5E7EB] w-full cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#F8F9FB] rounded-xl p-3">
                          <p className="text-[10px] text-[#6E7A72] uppercase font-bold tracking-wide mb-1">Nhận xe</p>
                          <p className="font-semibold text-[#191C1E]">{formatDT(startISO)}</p>
                        </div>
                        <div className="bg-[#F8F9FB] rounded-xl p-3">
                          <p className="text-[10px] text-[#6E7A72] uppercase font-bold tracking-wide mb-1">Trả xe</p>
                          <p className="font-semibold text-[#191C1E]">{formatDT(endISO)}</p>
                        </div>
                      </div>
                    </div>

                    <button onClick={handleContinue}
                      className="w-full bg-[#4FBD91] hover:bg-[#006C4C] text-[#004832] hover:text-white font-bold py-4 rounded-xl text-base transition-all shadow-md hover:shadow-lg">
                      Tiếp tục thanh toán →
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* ── RIGHT: order summary (only show when logged in and verified) ────── */}
          {user && licenseStatus === "verified" && <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden sticky top-[84px]">
              {/* car image */}
              <div className="relative h-44 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] overflow-hidden">
                {imgUrl
                  ? <img src={imgUrl} alt={model.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-6xl">🚗</div>}
                <span className="absolute bottom-3 left-3 bg-white/90 text-[#006C4C] text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {model.brand}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-[#191C1E]">{model.brand} {model.name}</h3>
                  <p className="text-xs text-[#6E7A72] mt-0.5">
                    📍 {location?.name}, {location?.city}
                  </p>
                  <p className="text-xs text-[#6E7A72] mt-0.5 font-mono">{vehicle.license_plate}</p>
                </div>

                <div className="border-t border-[#F3F4F6] pt-4 flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Gói thuê</span>
                    <span className="font-semibold text-[#191C1E]">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Nhận xe</span>
                    <span className="font-semibold text-[#191C1E] text-right text-xs">{formatDT(startISO)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Trả xe</span>
                    <span className="font-semibold text-[#191C1E] text-right text-xs">{formatDT(endISO)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Giao nhận</span>
                    <span className="font-semibold text-[#191C1E] text-right text-xs">{queryDelivery === "airport" ? `Giao tại ${airportName}` : queryDelivery === "custom" ? "Giao tận nơi" : "Tự đến lấy"}</span>
                  </div>
                </div>

                <div className="border-t border-[#F3F4F6] pt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6E7A72]">Giá gói thuê</span>
                    {discountPercent > 0 ? (
                      <div className="text-right">
                        <span className="text-xs text-[#6E7A72] line-through mr-1.5">{formatCurrency(originalPlanPrice)}</span>
                        <span className="font-bold text-[#EF4444]">{formatCurrency(planPrice)}</span>
                        <span className="ml-1 text-[9px] bg-[#EF4444] text-white px-1.5 py-0.5 rounded font-bold">-{discountPercent}%</span>
                      </div>
                    ) : (
                      <span className="font-semibold">{formatCurrency(planPrice)}</span>
                    )}
                  </div>

                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6E7A72]">
                        Phí giao xe {distanceToUse > 0 ? `(${distanceToUse} km)` : ""}
                      </span>
                      <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Phí dịch vụ</span>
                    <span className="font-semibold">{formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between text-[#006C4C] mt-2">
                    <span className="font-semibold">Đặt cọc (30%)</span>
                    <span className="font-bold">{formatCurrency(deposit)}</span>
                  </div>
                </div>

                <div className="bg-[#F0FDF4] rounded-xl p-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-[#006C4C]">Tổng thanh toán</span>
                  <span className="text-lg font-black text-[#006C4C]">{formatCurrency(totalPrice)}</span>
                </div>

                <p className="text-center text-xs text-[#9CA3AF]">
                  Cọc {formatCurrency(deposit)} khi xác nhận đặt xe
                </p>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
