import React, { useCallback, useEffect, useState } from "react";
import { bookingService } from "../../../services/booking.service";
import { formatCurrency } from "../../../utils/formatters";
import { Booking } from "../../../types/booking.type";
import { Pagination } from "../../../components/common/Pagination";

type Status = Booking["status"] | "all";

const STATUS_CONFIG: Record<Booking["status"], { label: string; color: string; bg: string }> = {
  pending:         { label: "Chờ xác nhận",  color: "#b45309", bg: "#fef3c7" },
  confirmed:       { label: "Đã xác nhận",   color: "#1d4ed8", bg: "#dbeafe" },
  active:          { label: "Đang thuê",     color: "#006C4C", bg: "#dcfce7" },
  running:         { label: "Đang thuê",     color: "#006C4C", bg: "#dcfce7" },
  pending_payment: { label: "Chưa thanh toán",color: "#dc2626", bg: "#fef2f2" },
  completed:       { label: "Hoàn thành",    color: "#374151", bg: "#f3f4f6" },
  paid:            { label: "Hoàn thành",    color: "#006c4c", bg: "#dcfce7" },
  cancelled:       { label: "Đã huỷ",        color: "#dc2626", bg: "#fef2f2" },
};

const FILTERS: { key: Status; label: string }[] = [
  { key: "all",       label: "Tất cả" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "active",    label: "Đang thuê" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã huỷ" },
];

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function BookingNotification({ b }: { b: Booking }) {
  const st      = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.confirmed;
  const carLabel = b.vehicle_brand && b.vehicle_name
    ? `${b.vehicle_brand} ${b.vehicle_name}`
    : `Xe #${b.vehicle_id}`;

  return (
    <div className="panel" style={{ borderLeft: `4px solid ${st.color}`, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        {/* Left: car + dates */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--green)", fontSize: 13 }}>
              GC-{String(b.booking_id).padStart(5, "0")}
            </span>
            <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 700, color: st.color, background: st.bg }}>
              {st.label}
            </span>
          </div>
          <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", margin: "0 0 2px" }}>{carLabel}</p>
          {b.license_plate && (
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)", margin: "0 0 8px" }}>{b.license_plate}</p>
          )}
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)", flexWrap: "wrap" }}>
            <span><strong style={{ color: "var(--text)" }}>Nhận xe:</strong> {formatDT(b.start_time)}</span>
            <span><strong style={{ color: "var(--text)" }}>Trả xe:</strong> {formatDT(b.end_time)}</span>
          </div>
        </div>

        {/* Right: customer + amount */}
        <div style={{ textAlign: "right", minWidth: 160 }}>
          {b.customer_name && (
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>{b.customer_name}</p>
          )}
          {b.customer_phone && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 8px" }}>{b.customer_phone}</p>
          )}
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 2px" }}>Đặt cọc</p>
          <p style={{ fontSize: 16, fontWeight: 800, color: "var(--green)", margin: 0 }}>{formatCurrency(b.deposit_amount)}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>/ {formatCurrency(b.total_price)} tổng</p>
        </div>
      </div>
    </div>
  );
}

const BookingManagePage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<Status>("all");
  const [error,    setError]    = useState("");
  const [page,     setPage]     = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,    setTotal]    = useState(0);
  const [search,   setSearch]   = useState("");

  const refresh = useCallback((p: number) => {
    setLoading(true);
    bookingService.getAllBookings(p, 10)
      .then(res => {
        if (res && "data" in res) {
          setBookings(res.data);
          setTotalPages(res.pagination.total_pages);
          setTotal(res.pagination.total);
        } else {
          setBookings(res ?? []);
          setTotalPages(1);
          setTotal((res ?? []).length);
        }
      })
      .catch(() => setError("Không tải được danh sách đơn."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh(page);
  }, [refresh, page]);

  const counts = bookings.reduce<Record<string, number>>((acc, b) => {
    let key = b.status;
    if (b.status === "active" || b.status === "running") key = "active";
    if (b.status === "paid") key = "completed";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const visible = bookings.filter(b => {
    const status = b.status === "paid" ? "completed" : b.status;
    const matchFilter = filter === "all" || status === filter || (filter === "active" && status === "running");
    if (!matchFilter) return false;

    const s = search.toLowerCase().trim();
    if (!s) return true;
    return (
      (b.vehicle_brand && b.vehicle_brand.toLowerCase().includes(s)) ||
      (b.vehicle_name && b.vehicle_name.toLowerCase().includes(s)) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(s)) ||
      (b.customer_phone && b.customer_phone.toLowerCase().includes(s)) ||
      (b.license_plate && b.license_plate.toLowerCase().includes(s)) ||
      String(b.booking_id).includes(s)
    );
  });

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 240 }}>
      <div style={{ width: 36, height: 36, border: "3px solid #006C4C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Đơn thuê xe</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Danh sách các lượt đặt cọc và thuê xe</p>
      </div>

      {/* Stats */}
      <div className="cards-3" style={{ marginBottom: 24 }}>
        {[
          { label: "Đã xác nhận", count: counts.confirmed ?? 0, color: "#1d4ed8", bg: "#dbeafe" },
          { label: "Đang thuê",   count: counts.active    ?? 0, color: "#006C4C", bg: "#dcfce7" },
          { label: "Tổng đơn",    count: total,                 color: "#374151", bg: "#f3f4f6" },
        ].map(s => (
          <div key={s.label} className="panel" style={{ textAlign: "center", background: s.bg, border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo mã đơn, dòng xe, tên khách hàng hoặc điện thoại..."
          style={{ flex: 1, minWidth: 200, height: 40, border: "1px solid var(--border)", borderRadius: 8, padding: "0 14px", fontSize: 14, outline: "none" }}
        />
      </div>

      {/* Filter tabs */}
      <div className="brand-filter" style={{ marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={filter === f.key ? "active" : ""}>
            {f.label}
            {f.key !== "all" && counts[f.key] != null && (
              <span style={{ marginLeft: 6, background: "rgba(0,0,0,0.1)", borderRadius: 9999, padding: "1px 7px", fontSize: 11 }}>
                {counts[f.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {visible.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
          Không có đơn nào.
        </div>
      ) : (
        <>
          {visible.map(b => <BookingNotification key={b.booking_id} b={b} />)}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              Hiển thị {visible.length} / {bookings.length} đơn (Tổng số: {total})
            </p>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default BookingManagePage;
