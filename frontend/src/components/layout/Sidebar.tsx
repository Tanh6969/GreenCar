import React from "react";
import { Link, useLocation } from "react-router-dom";

// ── SVG icons ─────────────────────────────────────────────────
const IcDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IcCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14l4 4v4a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
);
const IcClipboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);
const IcUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IcFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);
const IcPen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const NAV_MANAGE = [
  { to: "/admin/dashboard", icon: <IcDashboard />, label: "Dashboard" },
  { to: "/admin/vehicles",  icon: <IcCar />,       label: "Quản lý xe" },
  { to: "/admin/bookings",  icon: <IcClipboard />, label: "Đơn thuê xe" },
  { to: "/admin/users",     icon: <IcUsers />,     label: "Người dùng" },
];

const NAV_BLOG = [
  { to: "/admin/blogs",     icon: <IcFileText />, label: "Quản lý bài viết" },
  { to: "/admin/blogs/new", icon: <IcPen />,      label: "Viết bài mới" },
];

type NavItem = { to: string; icon: React.ReactNode; label: string };

const NavLink: React.FC<{ item: NavItem; pathname: string }> = ({ item, pathname }) => {
  const active = pathname === item.to || (item.to !== "/admin/dashboard" && pathname.startsWith(item.to));
  return (
    <Link
      to={item.to}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600,
        color: active ? "var(--green)" : "var(--text-mid)",
        background: active ? "var(--green-light)" : "transparent",
        transition: "all 0.12s", textDecoration: "none",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "var(--green-light)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{item.icon}</span>
      {item.label}
    </Link>
  );
};

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 4px", margin: "16px 0 4px" }}>
    {label}
  </p>
);

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
      <SectionLabel label="Quản trị" />
      {NAV_MANAGE.map(item => <NavLink key={item.to} item={item} pathname={pathname} />)}
      <SectionLabel label="Blog" />
      {NAV_BLOG.map(item => <NavLink key={item.to} item={item} pathname={pathname} />)}
    </aside>
  );
};

export default Sidebar;
