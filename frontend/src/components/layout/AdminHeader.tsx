import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const IcLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? user.name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase()
    : "A";

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header style={{
      height: 56,
      background: "#fff",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* left: logo */}
      <Link to="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "var(--green)", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: 14,
        }}>G</div>
        <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>GreenCar</span>
        <span style={{
          fontSize: 10, fontWeight: 700, color: "var(--green)",
          background: "var(--green-light)", padding: "2px 7px",
          borderRadius: 4, letterSpacing: 0.5, textTransform: "uppercase",
        }}>Admin</span>
      </Link>

      {/* right: user + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "var(--green)", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                {user.name.split(" ").at(-1)}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Quản trị viên</p>
            </div>
          </div>
        )}

        <div style={{ width: 1, height: 28, background: "var(--border)" }} />

        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border)",
            background: "#fff", color: "var(--text-mid)", fontWeight: 600, fontSize: 13,
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#fecaca";
            (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fff";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-mid)";
          }}
        >
          <IcLogout />
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
