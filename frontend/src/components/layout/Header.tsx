import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user ? user.name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase() : "";

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">G</div>
          GreenCar
        </Link>

        <nav className="nav">
          <Link to="/cars">Danh sách xe</Link>
          {user && <Link to="/customer/my-bookings">Đơn của tôi</Link>}
          {isAdmin && <Link to="/admin/dashboard">Admin</Link>}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, background: "none",
                  border: "1.5px solid var(--border)", borderRadius: 9999,
                  padding: "6px 14px 6px 8px", cursor: "pointer", transition: "all 0.15s"
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = open ? "var(--green)" : "var(--border)")}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: "var(--green)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name.split(" ").at(-1)}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 2 }}>▼</span>
              </button>

              {open && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)", width: 220,
                  background: "#fff", border: "1px solid var(--border)", borderRadius: 12,
                  boxShadow: "var(--shadow-lg)", zIndex: 200, overflow: "hidden"
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{user.email}</div>
                  </div>

                  {[
                    { to: "/customer/profile", icon: "👤", label: "Tài khoản của tôi" },
                    { to: "/customer/my-bookings", icon: "📋", label: "Đơn thuê xe" },
                    ...(isAdmin ? [{ to: "/admin/dashboard", icon: "⚙️", label: "Quản trị" }] : []),
                  ].map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "11px 16px", fontSize: 14, color: "var(--text)",
                        fontWeight: 500, transition: "background 0.12s"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--green-light)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  <div style={{ borderTop: "1px solid var(--border)" }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: "11px 16px", fontSize: 14, color: "#dc2626", fontWeight: 600,
                        background: "none", border: "none", cursor: "pointer", textAlign: "left",
                        transition: "background 0.12s"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span>🚪</span>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth/login" className="btn btn-ghost btn-sm">Đăng nhập</Link>
              <Link to="/auth/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
