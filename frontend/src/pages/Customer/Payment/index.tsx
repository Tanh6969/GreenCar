import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../../../context/BookingContext";
import { bookingService } from "../../../services/booking.service";
import { useAuth } from "../../../hooks/useAuth";
import { formatCurrency } from "../../../utils/formatters";
import { chatService } from "../../../services/chat.service";

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

const METHODS = [
  { id: "transfer", icon: "🏦", label: "Chuyển khoản ngân hàng", sub: "MB Bank / VCB / TCB" },
];

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pendingBooking, setPendingBooking } = useContext(BookingContext);
  const [method, setMethod]   = useState("transfer");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  if (!pendingBooking) {
    return (
      <div className="text-center py-24 text-[#6E7A72]">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-semibold text-lg mb-2">Không có thông tin đặt xe.</p>
        <Link to="/cars" className="text-[#006C4C] font-semibold hover:underline">← Chọn xe</Link>
      </div>
    );
  }

  const { vehicleInfo, planName, startTime, endTime, totalPrice, depositAmount, contactInfo } = pendingBooking;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      let bookingId: number | null = null;

      if (user) {
        const booking = await bookingService.createBooking({
          user_id:        user.user_id,
          vehicle_id:     pendingBooking.vehicleId,
          rental_plan_id: pendingBooking.planId,
          start_time:     startTime,
          end_time:       endTime,
          planned_km:     400,
          deposit_amount: depositAmount,
          total_price:    totalPrice,
          status:         "pending",
          payment_method: method,
          actual_start_time: undefined,
          actual_end_time:   undefined,
          actual_km:      0,
          overtime_fee:   0,
          over_km_fee:    0,
        });
        bookingId = booking.booking_id;
        
        if (pendingBooking.customerNote) {
          try {
            await chatService.sendMessage(bookingId, pendingBooking.customerNote);
          } catch (chatErr) {
            console.error("Lỗi gửi tin nhắn mặc định:", chatErr);
          }
        }
      }

      setPendingBooking(null);
      navigate("/customer/confirmation", { state: { bookingId, contactInfo, vehicleInfo, planName, startTime, endTime, totalPrice, depositAmount, isGuest: !user } });
    } catch (e: any) {
      setError(e.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <StepBar step={2} />

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT: payment methods ─────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <h2 className="font-bold text-[#191C1E] text-base mb-5">Phương thức thanh toán đặt cọc</h2>

              <div className="flex flex-col gap-3">
                {METHODS.map(m => (
                  <button key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                      ${method === m.id ? "border-[#006C4C] bg-[#ECFDF5]" : "border-[#E5E7EB] hover:border-[#BDCAC1]"}`}>
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${method === m.id ? "text-[#006C4C]" : "text-[#191C1E]"}`}>
                        {m.label}
                      </p>
                      <p className="text-xs text-[#6E7A72] mt-0.5">{m.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${method === m.id ? "border-[#006C4C] bg-[#006C4C]" : "border-[#D1D5DB]"}`}>
                      {method === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* bank info for transfer */}
              {method === "transfer" && (
                <div className="mt-5 bg-[#F8F9FB] rounded-xl p-4 text-sm">
                  <p className="font-bold text-[#191C1E] mb-3">Thông tin chuyển khoản</p>
                  <div className="flex flex-col gap-1.5 text-[#3E4943]">
                    <div className="flex justify-between"><span className="text-[#6E7A72]">Ngân hàng</span><span className="font-semibold">MB Bank</span></div>
                    <div className="flex justify-between"><span className="text-[#6E7A72]">Số tài khoản</span><span className="font-mono font-bold">0123 4567 8901</span></div>
                    <div className="flex justify-between"><span className="text-[#6E7A72]">Chủ tài khoản</span><span className="font-semibold">CONG TY GREENCAR</span></div>
                    <div className="flex justify-between">
                      <span className="text-[#6E7A72]">Nội dung CK</span>
                      <span className="font-mono font-bold text-[#006C4C]">GC {contactInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E7A72]">Số tiền</span>
                      <span className="font-bold text-[#006C4C]">{formatCurrency(depositAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)}
                className="flex-1 py-4 rounded-xl border-2 border-[#E5E7EB] font-bold text-[#6E7A72]
                  hover:border-[#BDCAC1] hover:text-[#3E4943] transition-all">
                ← Quay lại
              </button>
              <button onClick={handleConfirm} disabled={loading}
                className={`flex-[2] py-4 rounded-xl font-bold text-base transition-all shadow-md
                  ${loading
                    ? "bg-[#BDCAC1] text-white cursor-wait"
                    : "bg-[#4FBD91] hover:bg-[#006C4C] text-[#004832] hover:text-white hover:shadow-lg"}`}>
                {loading ? "Đang xử lý..." : "Xác nhận & Giữ chỗ"}
              </button>
            </div>
          </div>

          {/* ── RIGHT: order summary ──────────────────────────────── */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden sticky top-[84px]">
              <div className="relative h-40 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] overflow-hidden">
                {vehicleInfo.imageUrl
                  ? <img src={vehicleInfo.imageUrl} alt={vehicleInfo.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-6xl">🚗</div>}
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-[#191C1E]">{vehicleInfo.brand} {vehicleInfo.name}</h3>
                  <p className="text-xs text-[#6E7A72] mt-0.5">📍 {vehicleInfo.locationName}, {vehicleInfo.locationCity}</p>
                  <p className="text-xs font-mono text-[#6E7A72]">{vehicleInfo.licensePlate}</p>
                </div>

                <div className="border-t border-[#F3F4F6] pt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Gói thuê</span>
                    <span className="font-semibold">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Nhận xe</span>
                    <span className="font-semibold text-xs text-right">{formatDT(startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Trả xe</span>
                    <span className="font-semibold text-xs text-right">{formatDT(endTime)}</span>
                  </div>
                </div>

                <div className="border-t border-[#F3F4F6] pt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6E7A72]">Phí thuê xe</span>
                    <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#006C4C]">
                    <span>Đặt cọc ngay (30%)</span>
                    <span>{formatCurrency(depositAmount)}</span>
                  </div>
                </div>

                <div className="bg-[#F0FDF4] rounded-xl p-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-[#006C4C]">Cần thanh toán</span>
                  <span className="text-lg font-black text-[#006C4C]">{formatCurrency(depositAmount)}</span>
                </div>

                <div className="border-t border-[#F3F4F6] pt-3 text-xs text-[#6E7A72] flex flex-col gap-1">
                  <p>👤 {contactInfo.name}</p>
                  <p>📞 {contactInfo.phone}</p>
                  <p>🪪 GPLX: {contactInfo.licenseNo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
