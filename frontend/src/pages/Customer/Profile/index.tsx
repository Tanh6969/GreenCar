import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { userService } from "../../../services/user.service";
import { User } from "../../../types/user.type";

const LicenseCardPlaceholder: React.FC<{ side: "front" | "back"; licenseNo?: string; name?: string }> = ({ side, licenseNo, name }) => {
  if (side === "front") {
    return (
      <div style={{
        width: "100%",
        height: 120,
        background: "linear-gradient(135deg, #FFFDF3 0%, #FFF9D9 100%)",
        border: "1px solid #E5D59E",
        borderRadius: 8,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(229, 213, 158, 0.5)", paddingBottom: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ width: 6, height: 6, background: "#DA251D", borderRadius: "50%" }} />
            <span style={{ fontSize: 6.5, fontWeight: 800, color: "#7A1C1C", letterSpacing: 0.2 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
          </div>
          <span style={{ fontSize: 6.5, fontWeight: 800, color: "#1D4ED8" }}>DRIVING LICENCE</span>
        </div>

        {/* Card Body */}
        <div style={{ display: "flex", gap: 8, flex: 1, marginTop: 6, alignItems: "center" }}>
          {/* Avatar Silhouette */}
          <div style={{
            width: 28,
            height: 36,
            background: "#E5E7EB",
            borderRadius: 3,
            border: "1px solid #D1D5DB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9CA3AF",
            flexShrink: 0
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>

          {/* Details */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 8, color: "#374151", height: 38 }}>
            <div>
              <div style={{ fontWeight: 800, color: "#DA251D", fontSize: 8.5 }}>Số/No: {licenseNo || "123456789012"}</div>
              <div style={{ marginTop: 2 }}>Họ tên/Full name: <span style={{ fontWeight: 700, textTransform: "uppercase" }}>{name || "NGUYỄN VĂN A"}</span></div>
              <div>Hạng/Class: <span style={{ fontWeight: 700 }}>B2</span></div>
            </div>
          </div>

          {/* Hologram / Chip representation */}
          <div style={{
            width: 14,
            height: 10,
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            borderRadius: 2,
            alignSelf: "center",
            opacity: 0.8,
            flexShrink: 0
          }} />
        </div>

        {/* Footer info */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 6.5, color: "#9CA3AF", borderTop: "1px solid rgba(229, 213, 158, 0.3)", paddingTop: 3 }}>
          <span>Nơi cấp: Cục Đường Bộ Việt Nam</span>
          <span>Hạn: Không thời hạn</span>
        </div>
      </div>
    );
  }

  // Back side
  return (
    <div style={{
      width: "100%",
      height: 120,
      background: "linear-gradient(135deg, #FFFDF3 0%, #FFF9D9 100%)",
      border: "1px solid #E5D59E",
      borderRadius: 8,
      padding: 10,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      {/* Back side columns */}
      <div style={{ display: "flex", gap: 8, flex: 1, alignItems: "stretch" }}>
        {/* Table representation */}
        <div style={{ flex: 1, border: "1px solid #E5D59E", borderRadius: 4, padding: 4, background: "#FFF", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #E5D59E", paddingBottom: 2, marginBottom: 2, fontSize: 6.5, fontWeight: 700, color: "#7A1C1C" }}>
            <span style={{ width: "25%" }}>Hạng</span>
            <span style={{ flex: 1 }}>Mô tả phạm vi được lái</span>
          </div>
          <div style={{ display: "flex", fontSize: 5.5, color: "#4B5563", lineHeight: 1.2 }}>
            <span style={{ width: "25%", fontWeight: 700 }}>B2</span>
            <span style={{ flex: 1 }}>Xe ô tô chở người đến 9 chỗ; xe tải dưới 3.5 tấn.</span>
          </div>
        </div>

        {/* Signature stamp area */}
        <div style={{ width: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 5.5, color: "#4B5563", flexShrink: 0 }}>
          <span>Hà Nội, ngày 24/05/2024</span>
          <span style={{ fontWeight: 700, marginTop: 1 }}>NGƯỜI KÝ</span>
          <div style={{
            width: 22,
            height: 22,
            border: "1.5px dashed #DA251D",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#DA251D",
            fontWeight: 800,
            fontSize: 4.5,
            transform: "rotate(-15deg)",
            marginTop: 4
          }}>
            ĐÃ KÝ
          </div>
        </div>
      </div>
    </div>
  );
};

const IcUser  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcMail  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>;
const IcPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.18 2 2 0 013 .02h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const IcCard  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;

const Row: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: React.ReactNode;
  onClick?: () => void;
}> = ({ icon, label, value, badge, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 0",
      borderBottom: "1px solid var(--border)",
      cursor: onClick ? "pointer" : "default"
    }}
  >
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
      <div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 2px" }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 }}>{value || "—"}</p>
      </div>
      {badge && <div style={{ display: "flex", alignItems: "center" }}>{badge}</div>}
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { user, token, login } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [copied, setCopied] = useState(false);

  // Verification modal states
  const [showModal, setShowModal] = useState(false);
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseFrontUrl, setLicenseFrontUrl] = useState("");
  const [licenseBackUrl, setLicenseBackUrl] = useState("");
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [verifySubmitLoading, setVerifySubmitLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  const fetchFreshUser = () => {
    userService.getMe()
      .then(u => {
        setCurrentUser(u);
        setLicenseNo(u.license_no || "");
        setLicenseFrontUrl(u.license_front_url || "");
        setLicenseBackUrl(u.license_back_url || "");
        if (token) {
          login(token, u);
        }
      })
      .catch(console.error);
  };

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verify") === "true") {
      setShowModal(true);
    }
  }, [location]);

  useEffect(() => {
    fetchFreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = currentUser
    ? currentUser.name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase()
    : "?";

  const copyEmail = () => {
    if (currentUser?.email) {
      navigator.clipboard.writeText(currentUser.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleFileUpload = (side: "front" | "back", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (side === "front") setUploadingFront(true);
    else setUploadingBack(true);

    setTimeout(() => {
      const url = URL.createObjectURL(file);
      if (side === "front") {
        setLicenseFrontUrl(url);
        setUploadingFront(false);
      } else {
        setLicenseBackUrl(url);
        setUploadingBack(false);
      }
    }, 1200);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");
    setVerifySuccess(false);

    if (!licenseNo.trim()) {
      setVerifyError("Vui lòng nhập số GPLX!");
      return;
    }
    if (!licenseFrontUrl || !licenseBackUrl) {
      setVerifyError("Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau!");
      return;
    }

    setVerifySubmitLoading(true);
    try {
      await userService.submitLicense({
        license_no: licenseNo,
        license_front_url: licenseFrontUrl,
        license_back_url: licenseBackUrl,
      });
      setVerifySuccess(true);
      fetchFreshUser();
      setTimeout(() => {
        setShowModal(false);
        setVerifySuccess(false);
      }, 1500);
    } catch (err: any) {
      setVerifyError(err.error || err.message || "Không thể gửi hồ sơ xác thực.");
    } finally {
      setVerifySubmitLoading(false);
    }
  };

  const getLicenseBadge = (status?: string) => {
    switch (status) {
      case "verified":
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", fontSize: 11, fontWeight: 700,
            color: "#059669", background: "#ECFDF5",
            border: "1px solid #10B981", borderRadius: 9999
          }}>
            ✓ Đã xác thực
          </span>
        );
      case "pending":
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", fontSize: 11, fontWeight: 700,
            color: "#D97706", background: "#FFFBEB",
            border: "1px solid #F59E0B", borderRadius: 9999
          }}>
            ⏳ Chờ duyệt
          </span>
        );
      case "rejected":
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", fontSize: 11, fontWeight: 700,
            color: "#DC2626", background: "#FEF2F2",
            border: "1px solid #EF4444", borderRadius: 9999,
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          }}>
            ⚠️ Từ chối (Cần sửa)
          </span>
        );
      default:
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", fontSize: 11, fontWeight: 700,
            color: "#2563EB", background: "#EFF6FF",
            border: "1px solid #3B82F6", borderRadius: 9999
          }}>
            🪪 Xác thực ngay
          </span>
        );
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
          <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>{currentUser?.name ?? "—"}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--green)", background: "var(--green-light)", fontWeight: 700, padding: "2px 10px", borderRadius: 9999 }}>
              Khách hàng
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              ID #{currentUser?.user_id}
            </span>
          </div>
        </div>
      </div>

      {/* info rows */}
      <div className="panel" style={{ padding: "4px 24px 8px" }}>
        <Row icon={<IcUser />}  label="Họ và tên"       value={currentUser?.name ?? ""} />
        <Row icon={<IcMail />}  label="Email"           value={currentUser?.email ?? ""} />
        <Row icon={<IcPhone />} label="Số điện thoại"   value={currentUser?.phone ?? ""} />
        <Row 
          icon={<IcCard />}  
          label="Số bằng lái xe"  
          value={currentUser?.license_no ?? ""} 
          badge={getLicenseBadge(currentUser?.license_status)}
          onClick={() => setShowModal(true)}
        />
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
        Để thay đổi thông tin cá nhân khác, vui lòng liên hệ bộ phận hỗ trợ GreenCar.
      </div>

      {/* Verification steps modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: 16
        }}>
          <div className="panel animate-fade-in" style={{
            width: "100%",
            maxWidth: 540,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "var(--shadow-lg)",
            padding: 24,
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative"
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #F3F4F6", paddingBottom: 12 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", margin: 0 }}>
                {currentUser?.license_status === "verified" ? "Thông tin Giấy phép lái xe" : "Xác thực Giấy phép lái xe (GPLX)"}
              </h3>
              <button 
                onClick={() => { setShowModal(false); setVerifyError(""); setVerifySuccess(false); }}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--text-muted)", fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {verifySuccess ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <span style={{ fontSize: 48 }}>✅</span>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--green)", margin: "16px 0 8px" }}>Gửi hồ sơ thành công!</h4>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Thông tin của bạn đang được chờ phê duyệt.</p>
              </div>
            ) : currentUser?.license_status === "verified" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12, padding: 14, color: "#065F46", fontSize: 13, fontWeight: 500 }}>
                  ✓ Bằng lái xe của bạn đã được xác thực thành công. Bạn đã đủ điều kiện đặt xe tự lái.
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Số GPLX</label>
                  <input readOnly value={currentUser?.license_no} style={{ width: "100%", height: 42, background: "#F8F9FB", border: "1px solid var(--border)", borderRadius: 8, padding: "0 12px", fontSize: 14, color: "var(--text)", outline: "none" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Mặt trước</label>
                    {currentUser?.license_front_url ? (
                      <img src={currentUser.license_front_url} alt="Mặt trước" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                    ) : (
                      <LicenseCardPlaceholder side="front" licenseNo={currentUser?.license_no} name={currentUser?.name} />
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Mặt sau</label>
                    {currentUser?.license_back_url ? (
                      <img src={currentUser.license_back_url} alt="Mặt sau" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                    ) : (
                      <LicenseCardPlaceholder side="back" licenseNo={currentUser?.license_no} name={currentUser?.name} />
                    )}
                  </div>
                </div>
              </div>
            ) : currentUser?.license_status === "pending" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, color: "#B45309", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
                  ⏳ Hồ sơ đang chờ phê duyệt. Ban quản trị GreenCar sẽ kiểm tra và xác thực trong thời gian sớm nhất (khoảng 5-10 phút).
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Số GPLX</label>
                  <input readOnly value={currentUser?.license_no} style={{ width: "100%", height: 42, background: "#F8F9FB", border: "1px solid var(--border)", borderRadius: 8, padding: "0 12px", fontSize: 14, color: "var(--text)", outline: "none" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Mặt trước</label>
                    {currentUser?.license_front_url ? (
                      <img src={currentUser.license_front_url} alt="Mặt trước" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                    ) : (
                      <LicenseCardPlaceholder side="front" licenseNo={currentUser?.license_no} name={currentUser?.name} />
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Mặt sau</label>
                    {currentUser?.license_back_url ? (
                      <img src={currentUser.license_back_url} alt="Mặt sau" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                    ) : (
                      <LicenseCardPlaceholder side="back" licenseNo={currentUser?.license_no} name={currentUser?.name} />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Unverified or Rejected Form */
              <form onSubmit={handleVerifySubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {currentUser?.license_status === "rejected" && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: 12, fontSize: 13, color: "#DC2626" }}>
                    <strong style={{ display: "block", marginBottom: 4 }}>❌ GPLX bị từ chối trước đó:</strong>
                    {currentUser?.license_reject_reason || "Bằng lái xe hoặc hình ảnh không khớp / mờ."}
                    <span style={{ display: "block", marginTop: 6, fontSize: 11, color: "#7F1D1D" }}>Vui lòng tải lại ảnh mới rõ nét hơn.</span>
                  </div>
                )}

                {verifyError && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: 10, fontSize: 12, color: "#DC2626" }}>
                    {verifyError}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Số giấy phép lái xe (GPLX) *</label>
                  <input
                    type="text"
                    required
                    value={licenseNo}
                    onChange={e => setLicenseNo(e.target.value)}
                    placeholder="Nhập 12 số trên bằng lái xe của bạn"
                    style={{ width: "100%", height: 42, border: "1px solid var(--border)", borderRadius: 8, padding: "0 12px", fontSize: 14, color: "var(--text)", outline: "none" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Front */}
                  <div>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Ảnh mặt trước *</label>
                    <div style={{
                      border: "2px dashed var(--border)",
                      borderRadius: 12,
                      padding: 12,
                      background: "#F8F9FB",
                      position: "relative",
                      minHeight: 120,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "pointer"
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload("front", e)}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }}
                      />
                      {uploadingFront ? (
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Đang tải...</div>
                      ) : licenseFrontUrl ? (
                        <div style={{ width: "100%" }}>
                          <img src={licenseFrontUrl} alt="Mặt trước" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6 }} />
                          <span style={{ fontSize: 9, color: "var(--green)", fontWeight: 600, display: "block", marginTop: 4 }}>Thay đổi ảnh</span>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontSize: 24, display: "block", marginBottom: 2 }}>📸</span>
                          <span style={{ fontSize: 11, fontWeight: 600 }}>Tải ảnh mặt trước</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back */}
                  <div>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Ảnh mặt sau *</label>
                    <div style={{
                      border: "2px dashed var(--border)",
                      borderRadius: 12,
                      padding: 12,
                      background: "#F8F9FB",
                      position: "relative",
                      minHeight: 120,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "pointer"
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload("back", e)}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }}
                      />
                      {uploadingBack ? (
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Đang tải...</div>
                      ) : licenseBackUrl ? (
                        <div style={{ width: "100%" }}>
                          <img src={licenseBackUrl} alt="Mặt sau" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6 }} />
                          <span style={{ fontSize: 9, color: "var(--green)", fontWeight: 600, display: "block", marginTop: 4 }}>Thay đổi ảnh</span>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontSize: 24, display: "block", marginBottom: 2 }}>📸</span>
                          <span style={{ fontSize: 11, fontWeight: 600 }}>Tải ảnh mặt sau</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={verifySubmitLoading || uploadingFront || uploadingBack}
                  style={{
                    width: "100%",
                    background: "var(--green)",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 0",
                    marginTop: 8,
                    cursor: "pointer",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {verifySubmitLoading ? "Đang gửi hồ sơ..." : "Gửi yêu cầu xác thực GPLX"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
