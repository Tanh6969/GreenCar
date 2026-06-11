import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../../../services/booking.service";
import { useAuth } from "../../../hooks/useAuth";
import { formatCurrency } from "../../../utils/formatters";
import { Booking } from "../../../types/booking.type";

type BookingStatus = Booking["status"];

const STATUS_CONFIG: Record<BookingStatus, { label: string; textColor: string; bgColor: string }> = {
  pending:   { label: "Chờ xác nhận", textColor: "text-amber-700",    bgColor: "bg-amber-100" },
  confirmed: { label: "Đã xác nhận",  textColor: "text-blue-700",     bgColor: "bg-blue-100" },
  active:    { label: "Đang thuê",    textColor: "text-[#006C4C]",    bgColor: "bg-[#ECFDF5]" },
  running:   { label: "Đang thuê",    textColor: "text-[#006C4C]",    bgColor: "bg-[#ECFDF5]" },
  completed: { label: "Hoàn thành",   textColor: "text-gray-700",     bgColor: "bg-gray-100" },
  cancelled: { label: "Đã huỷ",       textColor: "text-red-600",      bgColor: "bg-red-50" },
};

function formatRef(id: number) {
  return `GC-${String(id).padStart(5, "0")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bgColor} ${cfg.textColor}`}>
      {cfg.label}
    </span>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const carLabel = booking.vehicle_brand && booking.vehicle_name
    ? `${booking.vehicle_brand} ${booking.vehicle_name}`
    : `Xe #${booking.vehicle_id}`;
  const plate = booking.license_plate ?? "";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-semibold text-[#006C4C] tracking-wide">
          {formatRef(booking.booking_id)}
        </span>
        <StatusBadge status={booking.status} />
      </div>

      {/* Car info */}
      <div className="mb-3">
        <p className="font-bold text-gray-900 text-base">{carLabel}</p>
        {plate && <p className="text-xs font-mono text-gray-500 mt-0.5">{plate}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-[#ECFDF5] rounded-xl px-4 py-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Nhận xe</p>
          <p className="text-sm font-semibold text-gray-800">{formatDate(booking.start_time)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-0.5">Trả xe</p>
          <p className="text-sm font-semibold text-gray-800">{formatDate(booking.end_time)}</p>
        </div>
      </div>

      {/* Pricing row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">Đặt cọc đã thanh toán</p>
          <p className="text-base font-bold text-[#006C4C]">{formatCurrency(booking.deposit_amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Tổng giá trị đơn</p>
          <p className="text-base font-bold text-gray-800">{formatCurrency(booking.total_price)}</p>
        </div>
      </div>
    </div>
  );
}

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    bookingService
      .getBookingsByUser(user.user_id)
      .then(data => { if (!cancelled) setBookings(data); })
      .catch(() => { if (!cancelled) setError("Không thể tải danh sách đơn thuê. Vui lòng thử lại."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#006C4C] px-4 py-10 text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Đơn thuê xe của tôi</h1>
          <p className="text-[#ECFDF5] text-sm opacity-90">
            Theo dõi trạng thái và lịch sử các chuyến thuê xe của bạn.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#006C4C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-600 text-base mb-6">Bạn chưa có đơn thuê xe nào.</p>
            <Link
              to="/cars"
              className="inline-flex items-center gap-1.5 bg-[#006C4C] hover:bg-[#005a3e] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors duration-200"
            >
              Thuê xe ngay &rarr;
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">{bookings.length} đơn thuê</p>
            {bookings.map(booking => (
              <BookingCard key={booking.booking_id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
