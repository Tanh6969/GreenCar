import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ClipboardList, Car, MapPin, Package, Mail, CalendarDays } from "lucide-react";
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
      <div className="text-center py-32 text-[#6E7A72] flex flex-col items-center">
        <ClipboardList size={64} className="mb-4 opacity-50" />
        <p className="font-semibold text-xl mb-2 text-[#191C1E]">Không tìm thấy thông tin xác nhận.</p>
        <Link to="/" className="text-[#006C4C] font-semibold hover:underline mt-2">← Về trang chủ</Link>
      </div>
    );
  }

  const { bookingId, contactInfo, vehicleInfo, planName, startTime, endTime, totalPrice, depositAmount, isGuest } = state;
  const refCode = bookingId ? `GC-${String(bookingId).padStart(5, "0")}` : `GC-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-12">
      <div className="max-w-[1000px] mx-auto px-4">
        
        {/* success banner */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border-[6px] border-white">
            <CheckCircle2 size={48} className="text-[#006C4C]" />
          </div>
          <h1 className="text-3xl font-black text-[#191C1E] tracking-tight mb-2">Đặt xe thành công!</h1>
          <p className="text-[#6E7A72] text-base">
            Yêu cầu đặt xe của bạn đã được ghi nhận thành công.
          </p>
          <div className="inline-flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-full px-5 py-2.5 mt-4 shadow-sm">
            <span className="text-sm font-medium text-[#6E7A72]">Mã đặt xe:</span>
            <span className="font-mono font-bold text-lg text-[#006C4C] tracking-wider">{refCode}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Info - Left side (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* booking card */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="relative h-60 md:h-72 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] overflow-hidden">
                {vehicleInfo.imageUrl ? (
                  <img src={vehicleInfo.imageUrl} alt={vehicleInfo.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car size={80} className="text-[#006C4C] opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#191C1E]/80 via-[#191C1E]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-black text-2xl mb-1">{vehicleInfo.brand} {vehicleInfo.name}</p>
                  <p className="text-sm opacity-90 font-mono bg-white/20 px-2.5 py-1 rounded-md inline-block backdrop-blur-sm">
                    {vehicleInfo.licensePlate}
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column in Details */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-[#006C4C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6E7A72] uppercase font-bold tracking-wide mb-1">Địa điểm nhận xe</p>
                        <p className="font-semibold text-[#191C1E] leading-relaxed">{vehicleInfo.locationName}</p>
                        <p className="text-sm text-[#6E7A72] mt-0.5">{vehicleInfo.locationCity}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center shrink-0">
                        <Package size={20} className="text-[#006C4C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6E7A72] uppercase font-bold tracking-wide mb-1">Gói thuê</p>
                        <p className="font-semibold text-[#191C1E]">{planName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column in Details */}
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#F8F9FB] rounded-xl p-4 flex gap-4 items-center">
                      <CalendarDays size={24} className="text-[#6E7A72] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#6E7A72] uppercase font-bold tracking-wide mb-0.5">Nhận xe</p>
                        <p className="font-bold text-[#191C1E] text-sm">{formatDT(startTime)}</p>
                      </div>
                    </div>
                    <div className="bg-[#F8F9FB] rounded-xl p-4 flex gap-4 items-center">
                      <CalendarDays size={24} className="text-[#6E7A72] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#6E7A72] uppercase font-bold tracking-wide mb-0.5">Trả xe</p>
                        <p className="font-bold text-[#191C1E] text-sm">{formatDT(endTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* email note */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <Mail size={24} className="text-[#006C4C] shrink-0 mt-0.5" />
              <p className="text-[#004832] leading-relaxed text-sm">
                Email xác nhận chi tiết đơn hàng sẽ được gửi về <strong className="font-bold">{contactInfo.email || "địa chỉ email của bạn"}</strong> trong vài phút tới. Vui lòng kiểm tra hộp thư rác (Spam) nếu không nhận được.
              </p>
            </div>
            
          </div>

          {/* Sidebar - Right side (1/3 width) */}
          <div className="flex flex-col gap-6">
            
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="font-bold text-lg text-[#191C1E] mb-5 border-b border-[#F3F4F6] pb-3">Chi tiết thanh toán</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#6E7A72]">Phí thuê xe</span>
                  <span className="font-medium">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ECFDF5] -mx-4 px-4 py-2 rounded-lg">
                  <span className="font-bold text-[#006C4C]">Đã thanh toán cọc</span>
                  <span className="font-bold text-[#006C4C]">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-dashed border-[#E5E7EB]">
                  <span className="text-[#3E4943] font-semibold">Thanh toán khi nhận</span>
                  <span className="font-black text-lg text-[#191C1E]">{formatCurrency(totalPrice - depositAmount)}</span>
                </div>
              </div>
            </div>

            {/* contact info */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="font-bold text-lg text-[#191C1E] mb-5 border-b border-[#F3F4F6] pb-3">Người đặt xe</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span className="text-[#6E7A72]">Họ tên</span><span className="font-semibold text-right max-w-[120px] truncate" title={contactInfo.name}>{contactInfo.name}</span></div>
                <div className="flex justify-between"><span className="text-[#6E7A72]">Điện thoại</span><span className="font-semibold text-right">{contactInfo.phone}</span></div>
                {contactInfo.email && (
                  <div className="flex justify-between"><span className="text-[#6E7A72]">Email</span><span className="font-semibold text-right truncate max-w-[150px]" title={contactInfo.email}>{contactInfo.email}</span></div>
                )}
              </div>
            </div>

            {/* guest upsell */}
            {isGuest && (
              <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 shadow-sm text-center">
                <p className="font-bold text-[#0369A1] text-lg mb-2">Tạo tài khoản</p>
                <p className="text-sm text-[#0C4A6E] mb-5 leading-relaxed">
                  Lưu lịch sử đặt xe, nhận ưu đãi thành viên và tự động điền thông tin cho những lần sau.
                </p>
                <Link to="/auth/register"
                  className="block w-full bg-[#0369A1] text-white text-sm font-bold px-5 py-3.5 rounded-xl
                    hover:bg-[#0284C7] transition-colors shadow-sm">
                  Đăng ký miễn phí ngay
                </Link>
              </div>
            )}

            {/* actions */}
            <div className="flex flex-col gap-3 mt-1">
              {!isGuest && (
                <Link to="/customer/my-bookings"
                  className="w-full bg-[#006C4C] hover:bg-[#004832] text-white font-bold py-3.5 rounded-xl
                    text-center text-sm transition-all shadow-md hover:shadow-lg">
                  Xem đơn của tôi
                </Link>
              )}
              <Link to="/"
                className={`w-full font-bold py-3.5 rounded-xl text-center text-sm transition-all border-2
                  ${isGuest ? "bg-[#006C4C] text-white border-[#006C4C] hover:bg-[#004832] shadow-md hover:shadow-lg"
                    : "border-[#E5E7EB] text-[#3E4943] hover:border-[#BDCAC1] hover:bg-[#F8F9FB]"}`}>
                Về trang chủ
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
