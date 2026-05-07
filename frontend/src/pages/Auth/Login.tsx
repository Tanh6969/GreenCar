import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Vui lòng nhập email."); return; }
    if (!password) { setError("Vui lòng nhập mật khẩu."); return; }

    setLoading(true);
    try {
      const result = await authService.login(email.trim(), password);
      login(result.token, result.user);
      const destination = result.user.role_id === 1 ? "/admin/dashboard" : from;
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div className="logo-icon" style={{ width: 40, height: 40, fontSize: 20 }}>G</div>
          <span style={{ fontSize: 22, fontWeight: 900, color: "var(--green)", letterSpacing: -0.5 }}>GreenCar</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", margin: "0 0 6px" }}>Đăng nhập</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 24px" }}>
          Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ban@email.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="search-field">
            <label htmlFor="password" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Mật khẩu</span>
              <span style={{ fontSize: 12, color: "#316BF3", fontWeight: 600, cursor: "pointer" }}>Quên mật khẩu?</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                disabled={loading}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 16,
                  color: "var(--text-muted)", padding: 0, lineHeight: 1
                }}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
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
                Đang đăng nhập...
              </span>
            ) : "Đăng nhập"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
          Chưa có tài khoản?{" "}
          <Link to="/auth/register" style={{ color: "var(--green)", fontWeight: 700 }}>
            Đăng ký ngay
          </Link>
        </p>

        {/* Demo hint */}
        <div style={{
          marginTop: 20, padding: "10px 14px", background: "#f0fdf4",
          border: "1px solid var(--green-border)", borderRadius: 8, fontSize: 12, color: "var(--text-muted)"
        }}>
          <strong style={{ color: "var(--green)" }}>Demo:</strong> Admin: <code style={{ background: "#dcfce7", padding: "1px 5px", borderRadius: 4 }}>admin@greencar.vn</code> — Customer: <code style={{ background: "#dcfce7", padding: "1px 5px", borderRadius: 4 }}>nguyenvanan@gmail.com</code> — mật khẩu: <code style={{ background: "#dcfce7", padding: "1px 5px", borderRadius: 4 }}>password</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
