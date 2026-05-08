import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

const IcUser  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcMail  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>;
const IcPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.18 2 2 0 013 .02h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const IcCard  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 }}>{value || "—"}</p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const initials = user
    ? user.name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase()
    : "?";

  const copyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>

      {/* header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Tài khoản của tôi</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Thông tin cá nhân của bạn</p>
      </div>

      {/* avatar card */}
      <div className="panel" style={{ padding: "28px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--green) 0%, #4FBD91 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: 26, flexShrink: 0,
          boxShadow: "0 4px 16px rgba(0,108,76,0.25)",
        }}>
          {initials}
        </div>
        <div>
          <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>{user?.name ?? "—"}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--green)", background: "var(--green-light)", fontWeight: 700, padding: "2px 10px", borderRadius: 9999 }}>
              Khách hàng
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              ID #{user?.user_id}
            </span>
          </div>
        </div>
      </div>

      {/* info rows */}
      <div className="panel" style={{ padding: "4px 24px 8px" }}>
        <Row icon={<IcUser />}  label="Họ và tên"       value={user?.name ?? ""} />
        <Row icon={<IcMail />}  label="Email"           value={user?.email ?? ""} />
        <Row icon={<IcPhone />} label="Số điện thoại"   value={user?.phone ?? ""} />
        <Row icon={<IcCard />}  label="Số bằng lái xe"  value={user?.license_no ?? ""} />
      </div>

      {/* copy email helper */}
      <div style={{ marginTop: 12, textAlign: "right" }}>
        <button
          onClick={copyEmail}
          style={{ fontSize: 12, color: copied ? "var(--green)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          {copied ? "Đã sao chép email" : "Sao chép email"}
        </button>
      </div>

      {/* note */}
      <div style={{ marginTop: 20, padding: "12px 16px", background: "var(--green-light)", borderRadius: 10, fontSize: 13, color: "var(--green)", fontWeight: 500 }}>
        Để thay đổi thông tin, vui lòng liên hệ bộ phận hỗ trợ GreenCar.
      </div>
    </div>
  );
};

export default ProfilePage;
