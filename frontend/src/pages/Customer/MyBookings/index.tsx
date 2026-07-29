import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../../../services/booking.service";
import { useAuth } from "../../../hooks/useAuth";
import { formatCurrency } from "../../../utils/formatters";
import { Booking } from "../../../types/booking.type";
import { apiClient } from "../../../services/api";

type BookingStatus = Booking["status"];

const STATUS_CONFIG: Record<string, { label: string; textColor: string; bgColor: string }> = {
  pending:         { label: "Chờ duyệt",      textColor: "text-amber-700",    bgColor: "bg-amber-100" },
  confirmed:       { label: "Sắp tới",        textColor: "text-blue-700",     bgColor: "bg-blue-100" },
  active:          { label: "Đang thuê",      textColor: "text-[#006C4C]",    bgColor: "bg-[#ECFDF5]" },
  running:         { label: "Đang thuê",      textColor: "text-[#006C4C]",    bgColor: "bg-[#ECFDF5]" },
  pending_payment: { label: "Chưa thanh toán",textColor: "text-red-700",      bgColor: "bg-red-100" },
  completed:       { label: "Hoàn thành",     textColor: "text-gray-700",     bgColor: "bg-gray-100" },
  cancelled:       { label: "Đã huỷ",         textColor: "text-red-600",      bgColor: "bg-red-50" },
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

  const effectiveStatus = booking.status === "paid" ? "completed" : booking.status;

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

      {/* Detailed Pricing Block */}
      {effectiveStatus !== "cancelled" ? (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giá thuê xe</span>
              <span className="font-medium text-gray-800">
                {formatCurrency(booking.total_price - booking.over_km_fee - booking.overtime_fee - (booking.extra_fee || 0))}
              </span>
            </div>
            {booking.over_km_fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vượt giới hạn KM</span>
                <span className="font-medium text-gray-800">{formatCurrency(booking.over_km_fee)}</span>
              </div>
            )}
            {booking.overtime_fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí thêm giờ</span>
                <span className="font-medium text-gray-800">{formatCurrency(booking.overtime_fee)}</span>
              </div>
            )}
            {(booking.extra_fee && booking.extra_fee > 0) ? (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phụ phí khác{booking.extra_fee_desc ? `: ${booking.extra_fee_desc}` : ""}</span>
                <span className="font-medium text-gray-800">{formatCurrency(booking.extra_fee)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm border-t border-dashed border-gray-200 pt-2 mt-2">
              <span className="text-gray-600 font-medium">Tổng giá trị đơn</span>
              <span className="font-bold text-gray-900">{formatCurrency(booking.total_price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Đã cọc (trừ vào tổng)</span>
              <span className="font-medium text-[#006C4C]">- {formatCurrency(booking.deposit_amount)}</span>
            </div>
          </div>

          {["pending_payment", "completed"].includes(effectiveStatus) && (
            <div className={`flex justify-between items-center p-3 rounded-lg border mt-2 ${
              effectiveStatus === "pending_payment" 
                ? "bg-red-50 border-red-100 text-red-700" 
                : "bg-gray-50 border-gray-200 text-gray-800"
            }`}>
              <span className="text-sm font-bold">
                {effectiveStatus === "pending_payment" ? "CẦN THANH TOÁN THÊM:" : "Đã thanh toán (ngoài cọc):"}
              </span>
              <span className="text-lg font-black">
                {formatCurrency(Math.max(0, booking.total_price - booking.deposit_amount))}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs font-medium text-blue-600">Tiền cọc đã hoàn trả</p>
            <p className="text-base font-bold text-blue-600">+{formatCurrency(booking.deposit_amount)}</p>
          </div>
        </div>
      )}

      {effectiveStatus === "cancelled" && (
        <div className="mt-4 pt-3 border-t border-red-100">
          <p className="text-xs font-semibold text-red-600 mb-1">
            {booking.owner_note ? "Lý do hủy từ chủ xe:" : "Lý do hủy từ hệ thống:"}
          </p>
          <p className="text-sm text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-100">
            {booking.owner_note || "Hệ thống tự động hủy do chủ xe không phản hồi trong thời gian quy định."}
          </p>
        </div>
      )}

      {effectiveStatus === "completed" && !booking.has_reviewed && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => onReview(booking)}
            className="px-5 py-2 bg-[#006C4C] text-white text-sm font-medium rounded-full hover:bg-[#004832] transition-colors"
          >
            Đánh giá
          </button>
        </div>
      )}
      {effectiveStatus === "completed" && booking.has_reviewed && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <span className="text-sm font-medium text-gray-500 italic">
            Đã đánh giá
          </span>
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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    
    const fetchBookings = async (showLoading: boolean) => {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }
      try {
        const data = await bookingService.getBookingsByUser(user.user_id);
        if (!cancelled) setBookings(data);
      } catch (err) {
        if (!cancelled && showLoading) setError("Không thể tải danh sách đơn thuê. Vui lòng thử lại.");
      } finally {
        if (!cancelled && showLoading) setLoading(false);
      }
    };

    fetchBookings(true);

    // Auto refresh every 10 seconds to catch status updates from owner
    const interval = setInterval(() => {
      fetchBookings(false);
    }, 10000);

    return () => { 
      cancelled = true; 
      clearInterval(interval);
    };
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
      // Reload bookings to get updated has_reviewed status
      if (user) {
        bookingService.getBookingsByUser(user.user_id).then(setBookings);
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === "all") return true;
    const effectiveStatus = b.status === "paid" ? "completed" : b.status;
    if (filterStatus === "active") return effectiveStatus === "active" || effectiveStatus === "running";
    return effectiveStatus === filterStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <p className="text-sm text-gray-500">{filteredBookings.length} đơn thuê</p>
              
              <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "pending", label: "Chờ duyệt" },
                  { value: "confirmed", label: "Sắp tới" },
                  { value: "active", label: "Đang thuê" },
                  { value: "pending_payment", label: "Chưa thanh toán" },
                  { value: "completed", label: "Hoàn thành" },
                  { value: "cancelled", label: "Đã hủy" }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterStatus(opt.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      filterStatus === opt.value 
                        ? "bg-[#006C4C] text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                Không có đơn thuê nào khớp với bộ lọc.
              </div>
            ) : (
              <>
                {paginatedBookings.map(booking => (
                  <BookingCard key={booking.booking_id} booking={booking} onReview={setReviewBooking} />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-[#006C4C] text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {reviewBooking && (
        <div className="fixed inset-0 bg-white/60 z-[100] flex items-center justify-center p-4">
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
