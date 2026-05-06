import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/admin/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/admin/vehicles",   icon: "🚗", label: "Quản lý xe" },
  { to: "/admin/bookings",   icon: "📋", label: "Đơn thuê xe" },
  { to: "/admin/users",      icon: "👥", label: "Người dùng" },
  { to: "/admin/blogs",      icon: "📝", label: "Blog" },
];

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 4px", margin: "4px 0 4px" }}>
        Quản trị
      </p>
      {NAV.map(item => {
        const active = pathname === item.to || (item.to !== "/admin/dashboard" && pathname.startsWith(item.to));
        return (
          <Link
            key={item.to}
            to={item.to}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: active ? "var(--green)" : "var(--text-mid)",
              background: active ? "var(--green-light)" : "transparent",
              transition: "all 0.12s",
              textDecoration: "none",
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "var(--green-light)"; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
};

export default Sidebar;
