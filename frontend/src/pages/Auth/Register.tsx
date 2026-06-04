import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../components/Logo";

interface FormState {
  name: string;
  email: string;
  phone: string;
  license_no: string;
  password: string;
  confirmPassword: string;
}

const INIT: FormState = { name: "", email: "", phone: "", license_no: "", password: "", confirmPassword: "" };

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(INIT);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = (): string => {
    if (!form.name.trim()) return "Vui lòng nhập họ tên.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email không hợp lệ.";
    if (!form.phone.trim() || !/^(0|\+84)\d{9}$/.test(form.phone.replace(/\s/g, ""))) return "Số điện thoại không hợp lệ (10 chữ số, bắt đầu 0 hoặc +84).";
    if (!form.license_no.trim()) return "Vui lòng nhập số GPLX.";
    if (form.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
    if (form.password !== form.confirmPassword) return "Mật khẩu xác nhận không khớp.";
    return "";
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      const result = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        license_no: form.license_no.trim(),
        password: form.password,
      });
      login(result.token, result.user);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ padding: "32px 0" }}>
      <div className="auth-card" style={{ width: "min(480px, calc(100% - 32px))" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <Logo size="large" showText={true} />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>Tạo tài khoản</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 22px" }}>
          Đăng ký để trải nghiệm thuê xe điện thông minh.
        </p>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
            padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="search-field">
            <label htmlFor="name">Họ và tên <span style={{ color: "#dc2626" }}>*</span></label>
            <input id="name" type="text" value={form.name} onChange={set("name")}
              placeholder="Nguyễn Văn A" autoComplete="name" disabled={loading} />
          </div>

          <div className="search-field">
            <label htmlFor="reg-email">Email <span style={{ color: "#dc2626" }}>*</span></label>
            <input id="reg-email" type="email" value={form.email} onChange={set("email")}
              placeholder="ban@email.com" autoComplete="email" disabled={loading} />
          </div>

          <div className="search-field">
            <label htmlFor="phone">Số điện thoại <span style={{ color: "#dc2626" }}>*</span></label>
            <input id="phone" type="tel" value={form.phone} onChange={set("phone")}
              placeholder="0912 345 678" autoComplete="tel" disabled={loading} />
          </div>

          <div className="search-field">
            <label htmlFor="license_no">
              Số GPLX <span style={{ color: "#dc2626" }}>*</span>
              <span style={{ fontWeight: 400, fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
                (Giấy phép lái xe)
              </span>
            </label>
            <input id="license_no" type="text" value={form.license_no} onChange={set("license_no")}
              placeholder="012345678910" disabled={loading} />
          </div>

          <div className="search-field">
            <label htmlFor="reg-password">Mật khẩu <span style={{ color: "#dc2626" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input
                id="reg-password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
                disabled={loading}
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 16,
                color: "var(--text-muted)", padding: 0, lineHeight: 1
              }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="search-field">
            <label htmlFor="confirm-password">Xác nhận mật khẩu <span style={{ color: "#dc2626" }}>*</span></label>
            <input
              id="confirm-password"
              type={showPw ? "text" : "password"}
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 6, width: "100%", height: 48, fontSize: 15, borderRadius: 10 }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite", display: "inline-block"
                }} />
                Đang tạo tài khoản...
              </span>
            ) : "Tạo tài khoản"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
          Đã có tài khoản?{" "}
          <Link to="/auth/login" style={{ color: "var(--green)", fontWeight: 700 }}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
