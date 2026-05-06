import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_MANAGE = [
  { to: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/admin/vehicles",  icon: "🚗", label: "Quản lý xe" },
  { to: "/admin/bookings",  icon: "📋", label: "Đơn thuê xe" },
  { to: "/admin/users",     icon: "👥", label: "Người dùng" },
];

const NAV_BLOG = [
  { to: "/admin/blogs",     icon: "📝", label: "Quản lý bài viết" },
  { to: "/admin/blogs/new", icon: "✍️", label: "Viết bài mới" },
];

type NavItem = { to: string; icon: string; label: string };

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
