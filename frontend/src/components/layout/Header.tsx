import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../Logo";
import NotificationDropdown from "./NotificationDropdown";
import { chatService } from "../../services/chat.service";
import AdminHeader from "./AdminHeader";

// ── icons ─────────────────────────────────────────────────────
const IcGrid = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
const IcCar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-3h8l3 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>;
const IcClip = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>;
const IcUsers = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
const IcFile = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
const IcPen = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IcUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IcMessage = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const IcLogout = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (user && !isAdmin) {
      chatService.getConversations().then(data => {
        if (data) {
          const count = data.reduce((acc, c) => acc + (c.unread_count || 0), 0);
          setUnreadMsgCount(count);
        }
      }).catch(console.error);
    }
  }, [user, isAdmin, location.pathname]);

  if (isAdmin) {
    return <AdminHeader />;
  }

  const initials = user ? user.name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase() : "";

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  const adminItems: { to: string; icon: React.ReactNode; label: string }[] = [
    { to: "/admin/dashboard", icon: <IcGrid />, label: "Dashboard" },
    { to: "/admin/vehicles", icon: <IcCar />, label: "Quản lý xe" },
    { to: "/admin/bookings", icon: <IcClip />, label: "Đơn thuê xe" },
    { to: "/admin/users", icon: <IcUsers />, label: "Người dùng" },
    { to: "/admin/blogs", icon: <IcFile />, label: "Quản lý Blog" },
    { to: "/admin/blogs/new", icon: <IcPen />, label: "Viết bài mới" },
  ];

  const customerItems: { to: string; icon: React.ReactNode; label: string }[] = [
    { to: "/customer/profile", icon: <IcUser />, label: "Tài khoản của tôi" },
    { to: "/customer/my-bookings", icon: <IcClip />, label: "Đơn thuê xe" },
    { to: "/owner/my-vehicles", icon: <IcCar />, label: "Xe của tôi" },
    { to: "/customer/messages", icon: <IcMessage />, label: "Tin nhắn" },
  ];

  const menuItems = isAdmin ? adminItems : customerItems;

  return (
    <header className="header">
      <div className="container header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/" className="logo" style={{ textDecoration: "none" }}>
            <Logo size="medium" showText={true} />
          </Link>

          <nav className="nav">
            {isAdmin ? (
              <Link to="/admin/dashboard">Bảng điều khiển</Link>
            ) : (
              <>
                <Link to="/cars">Danh sách xe</Link>
                <Link to="/blog">Blog</Link>
                {user && <Link to="/customer/my-bookings">Đơn của tôi</Link>}
                <Link
                  to={user ? "/owner/register" : "/auth/login"}
                  style={{
                    padding: "7px 16px", borderRadius: 999,
                    fontWeight: 700, fontSize: 13,
                    color: "var(--green)", border: "1.5px solid var(--green)",
                    transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--green)"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--green)"; }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    Cho thuê xe
                  </span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Message Icon */}
              <Link to="/customer/messages" style={{ position: "relative", color: "var(--text)", display: "flex", alignItems: "center" }} title="Tin nhắn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {unreadMsgCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", fontSize: 10, fontWeight: "bold", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                    {unreadMsgCount > 9 ? "9+" : unreadMsgCount}
                  </span>
                )}
              </Link>
              <NotificationDropdown />

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
                  position: "absolute", right: 0, top: "calc(100% + 8px)", width: 240,
                  background: "#fff", border: "1px solid var(--border)", borderRadius: 12,
                  boxShadow: "var(--shadow-lg)", zIndex: 200, overflow: "hidden"
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={user.email}>{user.email}</div>
                  </div>

                  {menuItems.map(item => (
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
                      <span style={{ display: "flex", alignItems: "center", color: "var(--text-muted)" }}>{item.icon}</span>
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
                      <span style={{ display: "flex", alignItems: "center" }}><IcLogout /></span>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
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
