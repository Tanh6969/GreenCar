import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../../../services/booking.service";
import { useAuth } from "../../../hooks/useAuth";
import { formatCurrency } from "../../../utils/formatters";
import { Booking } from "../../../types/booking.type";
import { apiClient } from "../../../services/api";

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

function BookingCard({ booking, onReview }: { booking: Booking; onReview: (b: Booking) => void }) {
  const carLabel = booking.vehicle_brand && booking.vehicle_name
    ? `${booking.vehicle_brand} ${booking.vehicle_name}`
    : `Xe #${booking.vehicle_id}`;
  const plate = booking.license_plate ?? "";

  const isPastEndTime = new Date(booking.end_time).getTime() < Date.now();
  const effectiveStatus = (booking.status === "active" || booking.status === "running") && isPastEndTime 
    ? "completed" 
    : booking.status;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-semibold text-[#006C4C] tracking-wide">
          {formatRef(booking.booking_id)}
        </span>
        <StatusBadge status={effectiveStatus} />
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
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-xs text-gray-500">Đặt cọc đã thanh toán</p>
          <p className="text-base font-bold text-[#006C4C]">{formatCurrency(booking.deposit_amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Tổng giá trị đơn</p>
          <p className="text-base font-bold text-gray-800">{formatCurrency(booking.total_price)}</p>
        </div>
      </div>

      {effectiveStatus === "completed" && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => onReview(booking)}
            className="px-5 py-2 bg-[#006C4C] text-white text-sm font-medium rounded-full hover:bg-[#004832] transition-colors"
          >
            Đánh giá
          </button>
        </div>
      )}
    </div>
  );
}

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const handleSubmitReview = async () => {
    if (!reviewBooking) return;
    try {
      setSubmittingReview(true);
      await apiClient("/reviews", "POST", {
        vehicle_model_id: reviewBooking.vehicle_model_id,
        booking_id: reviewBooking.booking_id,
        rating,
        comment
      });
      alert("Đánh giá thành công!");
      setReviewBooking(null);
      setRating(5);
      setComment("");
    } catch (err) {
      alert("Lỗi khi gửi đánh giá, vui lòng thử lại.");
    } finally {
      setSubmittingReview(false);
    }
  };

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
              <BookingCard key={booking.booking_id} booking={booking} onReview={setReviewBooking} />
            ))}
          </div>
        )}
      </div>

      {reviewBooking && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setReviewBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Đánh giá xe</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sao (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bình luận</label>
              <textarea 
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C4C]"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setReviewBooking(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="px-5 py-2 bg-[#006C4C] text-white rounded-full text-sm font-medium hover:bg-[#004832] transition-colors disabled:opacity-50"
              >
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
