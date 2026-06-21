import React from "react";
import { Link, useLocation } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatters";

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ConfirmationPage: React.FC = () => {
  const { state } = useLocation() as {
    state: {
      bookingId:     number | null;
      contactInfo:   { name: string; phone: string; email: string };
      vehicleInfo:   { name: string; brand: string; imageUrl: string; locationName: string; locationCity: string; licensePlate: string };
      planName:      string;
      startTime:     string;
      endTime:       string;
      totalPrice:    number;
      depositAmount: number;
      isGuest:       boolean;
    } | null;
  };

  if (!state) {
    return (
      <div className="text-center py-24 text-[#6E7A72]">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-semibold text-lg mb-2">Không tìm thấy thông tin xác nhận.</p>
        <Link to="/" className="text-[#006C4C] font-semibold hover:underline">← Về trang chủ</Link>
      </div>
    );
  }

  const { bookingId, contactInfo, vehicleInfo, planName, startTime, endTime, totalPrice, depositAmount, isGuest } = state;
  const refCode = bookingId ? `GC-${String(bookingId).padStart(5, "0")}` : `GC-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-10">
      <div className="max-w-[600px] mx-auto px-4">

        {/* success banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-black text-[#191C1E]">Đặt xe thành công!</h1>
          <p className="text-[#6E7A72] mt-1.5 text-sm">
            Yêu cầu đặt xe của bạn đã được ghi nhận.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-2 mt-3 shadow-sm">
            <span className="text-xs text-[#6E7A72]">Mã đặt xe</span>
            <span className="font-mono font-bold text-[#006C4C] tracking-wider">{refCode}</span>
          </div>
        </div>

        {/* booking card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-5">
          <div className="relative h-44 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] overflow-hidden">
            {vehicleInfo.imageUrl
              ? <img src={vehicleInfo.imageUrl} alt={vehicleInfo.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-6xl">🚗</div>}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-black text-lg">{vehicleInfo.brand} {vehicleInfo.name}</p>
              <p className="text-xs opacity-80 font-mono">{vehicleInfo.licensePlate}</p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📍</span>
              <div>
                <p className="text-xs text-[#6E7A72] mb-0.5">Địa điểm nhận xe</p>
                <p className="font-semibold text-[#191C1E]">{vehicleInfo.locationName}, {vehicleInfo.locationCity}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8F9FB] rounded-xl p-3">
                <p className="text-[10px] text-[#6E7A72] uppercase font-bold tracking-wide mb-1">Nhận xe</p>
                <p className="font-semibold text-[#191C1E] text-xs">{formatDT(startTime)}</p>
              </div>
              <div className="bg-[#F8F9FB] rounded-xl p-3">
                <p className="text-[10px] text-[#6E7A72] uppercase font-bold tracking-wide mb-1">Trả xe</p>
                <p className="font-semibold text-[#191C1E] text-xs">{formatDT(endTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📦</span>
              <div>
                <p className="text-xs text-[#6E7A72] mb-0.5">Gói thuê</p>
                <p className="font-semibold text-[#191C1E]">{planName}</p>
              </div>
            </div>

            <div className="border-t border-[#F3F4F6] pt-3 flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-[#6E7A72]">Phí thuê xe</span>
                <span className="font-semibold">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#006C4C]">
                <span>Đã thanh toán cọc</span>
                <span>{formatCurrency(depositAmount)}</span>
              </div>
              <div className="flex justify-between text-[#6E7A72]">
                <span>Thanh toán khi nhận xe</span>
                <span>{formatCurrency(totalPrice - depositAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* contact info */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm mb-5 text-sm">
          <h3 className="font-bold text-[#191C1E] mb-3">Thông tin liên lạc</h3>
          <div className="flex flex-col gap-2 text-[#3E4943]">
            <div className="flex justify-between"><span className="text-[#6E7A72]">Họ tên</span><span className="font-semibold">{contactInfo.name}</span></div>
            <div className="flex justify-between"><span className="text-[#6E7A72]">Điện thoại</span><span className="font-semibold">{contactInfo.phone}</span></div>
            {contactInfo.email && (
              <div className="flex justify-between"><span className="text-[#6E7A72]">Email</span><span className="font-semibold">{contactInfo.email}</span></div>
            )}
          </div>
        </div>

        {/* email note */}
        <div className="bg-[#ECFDF5] border border-[#86efac] rounded-2xl p-4 mb-5 flex gap-3 items-start text-sm">
          <span className="text-xl mt-0.5">📧</span>
          <p className="text-[#006C4C]">
            Email xác nhận sẽ được gửi về <strong>{contactInfo.email || "địa chỉ email của bạn"}</strong> trong thời gian sớm nhất.
          </p>
        </div>

        {/* guest upsell */}
        {isGuest && (
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-5 mb-5">
            <p className="font-bold text-[#0369A1] mb-1">Tạo tài khoản để theo dõi đơn thuê</p>
            <p className="text-sm text-[#0C4A6E] mb-3">Lưu lịch sử đặt xe, nhận ưu đãi thành viên và quản lý thông tin GPLX nhanh hơn.</p>
            <Link to="/auth/register"
              className="inline-block bg-[#0369A1] text-white text-sm font-bold px-5 py-2.5 rounded-xl
                hover:bg-[#0284C7] transition-colors">
              Tạo tài khoản miễn phí
            </Link>
          </div>
        )}

        {/* actions */}
        <div className="flex gap-3">
          {!isGuest && (
            <Link to="/customer/my-bookings"
              className="flex-1 bg-[#006C4C] hover:bg-[#004832] text-white font-bold py-3.5 rounded-xl
                text-center text-sm transition-all shadow-md hover:shadow-lg">
              Xem đơn của tôi
            </Link>
          )}
          <Link to="/"
            className={`font-bold py-3.5 rounded-xl text-center text-sm transition-all border-2
              ${isGuest ? "flex-1 bg-[#006C4C] text-white border-[#006C4C] hover:bg-[#004832]"
                : "flex-1 border-[#E5E7EB] text-[#6E7A72] hover:border-[#BDCAC1] hover:text-[#3E4943]"}`}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
