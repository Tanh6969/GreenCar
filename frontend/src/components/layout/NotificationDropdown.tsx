import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../services/api";
import { Notification } from "../../types/notification.type";

const IcBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const res = (await apiClient("/notifications/unread-count")) as { count: number };
      setUnreadCount(res.count || 0);
    } catch (e) {
      console.error("Failed to fetch unread count", e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = (await apiClient("/notifications")) as Notification[];
      setNotifications(data || []);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30s
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!open) {
      fetchNotifications();
    }
    setOpen(!open);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiClient(`/notifications/${id}/read`, "PUT", {});
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient("/notifications/read-all", "PUT", {});
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.is_read) {
      handleMarkAsRead(n.notification_id);
    }
    setOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "chat": return "💬";
      case "booking_approved": return "✅";
      case "booking_rejected": return "❌";
      case "booking_requested": return "🔔";
      case "system_alert": return "⚠️";
      default: return "📌";
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button 
        onClick={handleToggle}
        style={{ 
          background: "none", border: "none", cursor: "pointer", color: "var(--text)", 
          position: "relative", display: "flex", alignItems: "center", padding: "8px" 
        }}
        title="Thông báo"
      >
        <IcBell />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2, background: "#ef4444", color: "white",
            fontSize: "10px", fontWeight: "bold", width: "16px", height: "16px",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0, width: 340,
          background: "#fff", border: "1px solid var(--border)", borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)", zIndex: 300, overflow: "hidden",
          display: "flex", flexDirection: "column", maxHeight: 450
        }}>
          <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                style={{ background: "none", border: "none", color: "var(--green)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                Chưa có thông báo nào.
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.notification_id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 12,
                    cursor: "pointer", background: n.is_read ? "#fff" : "#f0fdf4", transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = n.is_read ? "#f9fafb" : "#dcfce7"}
                  onMouseLeave={e => e.currentTarget.style.background = n.is_read ? "#fff" : "#f0fdf4"}
                >
                  <div style={{ fontSize: 20, paddingTop: 2 }}>{getIcon(n.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: n.is_read ? 600 : 700, color: "var(--text)", marginBottom: 4 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 4 }}>
                      {n.content}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                      {formatTime(n.created_at)}
                    </div>
                  </div>
                  {!n.is_read && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", marginTop: 6 }} />
                  )}
                </div>
              ))
            )}
          </div>
          
          <div style={{ padding: "12px", borderTop: "1px solid var(--border)", textAlign: "center", background: "#fafafa" }}>
            <Link to="/customer/notifications" onClick={() => setOpen(false)} style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, textDecoration: "none" }}>
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
