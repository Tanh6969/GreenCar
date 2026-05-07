import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../../../services/booking.service";
import { formatCurrency } from "../../../utils/formatters";
import { Booking } from "../../../types/booking.type";
import { useAuth } from "../../../hooks/useAuth";

// ── helpers ────────────────────────────────────────────────────
function todayLabel() {
  return new Date().toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: "Đã xác nhận", color: "#1d4ed8", bg: "#dbeafe" },
  active:    { label: "Đang thuê",   color: "#006C4C", bg: "#dcfce7" },
  running:   { label: "Đang thuê",   color: "#006C4C", bg: "#dcfce7" },
  completed: { label: "Hoàn thành",  color: "#374151", bg: "#f3f4f6" },
  cancelled: { label: "Đã huỷ",      color: "#dc2626", bg: "#fef2f2" },
  pending:   { label: "Chờ xác nhận",color: "#b45309", bg: "#fef3c7" },
};

// ── SVG icons ─────────────────────────────────────────────────
const IcClipboard = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);
const IcKey = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);
const IcCar = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14l4 4v4a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
);
const IcUsers = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IcFileText = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IcPen = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IcChevron = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

// ── StatCard ──────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}
function StatCard({ label, value, sub, icon, accent, bg }: StatCardProps) {
  return (
    <div className="panel" style={{ background: bg, border: `1px solid ${accent}33`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 16, top: 14, color: accent, opacity: 0.2 }}>{icon}</div>
      <p style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 900, color: accent, margin: "0 0 4px", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: accent, opacity: 0.7, margin: 0 }}>{sub}</p>}
    </div>
  );
}

// ── QuickAction ────────────────────────────────────────────────
function QuickAction({ to, icon, label, sub }: { to: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div className="panel" style={{
        display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,108,76,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.transform = ""; }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", margin: "0 0 2px" }}>{label}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{sub}</p>
        </div>
        <svg style={{ marginLeft: "auto", color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    bookingService.getAllBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  // ── derived stats ──
  const activeCount    = bookings.filter(b => b.status === "active" || b.status === "running").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const revenue        = bookings
    .filter(b => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.deposit_amount, 0);
  const recent         = [...bookings].slice(0, 6);

  return (
    <div style={{ padding: 24 }}>

      {/* ── Welcome banner ─────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #006C4C 0%, #005a3e 60%, #004832 100%)",
        borderRadius: 16, padding: "28px 32px", marginBottom: 28,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 13, color: "#a7f3d0", fontWeight: 600, margin: "0 0 6px", letterSpacing: 0.5 }}>
            {todayLabel()}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>
            Chào mừng trở lại{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p style={{ fontSize: 13, color: "#6ee7b7", margin: 0 }}>
            Dưới đây là tổng quan hoạt động GreenCar hôm nay.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 12, color: "#6ee7b7", margin: "0 0 4px" }}>Đặt cọc tích luỹ</p>
          <p style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: 0 }}>
            {loading ? "—" : formatCurrency(revenue)}
          </p>
        </div>
      </div>

      {/* ── KPI cards ──────────────────────────────────────────── */}
      <div className="cards-3" style={{ marginBottom: 28 }}>
        <StatCard
          label="Tổng đơn thuê"
          value={loading ? "—" : bookings.length}
          sub="tất cả thời gian"
          icon={<IcClipboard size={36} />}
          accent="#1d4ed8"
          bg="#eff6ff"
        />
        <StatCard
          label="Chờ nhận xe"
          value={loading ? "—" : confirmedCount}
          sub="đã đặt cọc, chưa nhận"
          icon={<IcKey size={36} />}
          accent="#006C4C"
          bg="#f0fdf4"
        />
        <StatCard
          label="Đang thuê"
          value={loading ? "—" : activeCount}
          sub="xe đang trên đường"
          icon={<IcCar size={36} />}
          accent="#d97706"
          bg="#fffbeb"
        />
      </div>

      {/* ── Content grid ───────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

        {/* LEFT: recent bookings */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: 0 }}>Đơn thuê gần đây</h2>
            <Link to="/admin/bookings" style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, textDecoration: "none" }}>
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <div className="panel" style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <div style={{ width: 28, height: 28, border: "3px solid #006C4C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : recent.length === 0 ? (
            <div className="panel" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              Chưa có đơn nào.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recent.map(b => {
                const st = STATUS_LABEL[b.status] ?? STATUS_LABEL.confirmed;
                const car = b.vehicle_brand && b.vehicle_name
                  ? `${b.vehicle_brand} ${b.vehicle_name}`
                  : `Xe #${b.vehicle_id}`;
                return (
                  <div key={b.booking_id} className="panel" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 80 }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12, color: "var(--green)" }}>
                        GC-{String(b.booking_id).padStart(5, "0")}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", margin: "0 0 2px" }}>{car}</p>
                      {b.customer_name && (
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{b.customer_name} · {b.customer_phone}</p>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 130 }}>
                      <p style={{ margin: "0 0 2px" }}>Nhận: {formatDT(b.start_time)}</p>
                      <p style={{ margin: 0 }}>Trả: {formatDT(b.end_time)}</p>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 100 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", margin: "0 0 4px" }}>{formatCurrency(b.deposit_amount)}</p>
                      <span style={{ padding: "2px 9px", borderRadius: 9999, fontSize: 11, fontWeight: 700, color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: quick actions */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: "0 0 14px" }}>Thao tác nhanh</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <QuickAction to="/admin/vehicles"  icon={<IcCar size={20}/>}      label="Quản lý xe"       sub="Thêm, sửa, xoá xe" />
            <QuickAction to="/admin/bookings"  icon={<IcClipboard size={20}/>} label="Đơn thuê xe"      sub="Xem tất cả đơn" />
            <QuickAction to="/admin/users"     icon={<IcUsers size={20}/>}     label="Người dùng"       sub="Quản lý tài khoản" />
            <QuickAction to="/admin/blogs"     icon={<IcFileText size={20}/>}  label="Quản lý blog"     sub="Bài viết & nội dung" />
            <QuickAction to="/admin/blogs/new" icon={<IcPen size={20}/>}       label="Viết bài mới"     sub="Tạo bài đăng mới" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
