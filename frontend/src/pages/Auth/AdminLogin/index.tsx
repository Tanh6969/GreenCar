import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth.service";
import { useAuth } from "../../../hooks/useAuth";
import Logo from "../../../components/Logo";

const AdminLoginPage: React.FC = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Vui lòng nhập email."); return; }
    if (!password)     { setError("Vui lòng nhập mật khẩu."); return; }

    setLoading(true);
    try {
      const result = await authService.login(email.trim(), password);
      if (result.user.role_id !== 1) {
        setError("Tài khoản không có quyền quản trị.");
        return;
      }
      login(result.token, result.user);
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <Logo size="large" showText={true} />
          <span className="text-xs font-bold text-[#334155] bg-[#E5E7EB] px-2 py-1 rounded-full">
            ADMIN
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-[#191C1E] mb-1">Đăng nhập quản trị</h1>
          <p className="text-sm text-[#475569] mb-7">
            Chỉ dành cho tài khoản quản trị viên.
          </p>

          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl p-3 text-sm
              text-red-400 font-medium mb-5">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@greencar.vn"
                autoComplete="email"
                disabled={loading}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3
                  text-[#191C1E] placeholder-[#94A3B8] text-sm outline-none
                  focus:border-[#006C4C] focus:ring-2 focus:ring-[#006C4C]/20 transition-all
                  disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 pr-12
                    text-[#191C1E] placeholder-[#94A3B8] text-sm outline-none
                    focus:border-[#006C4C] focus:ring-2 focus:ring-[#006C4C]/20 transition-all
                    disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569]
                    hover:text-[#94A3B8] transition-colors text-base p-1"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all mt-2
                ${loading
                  ? "bg-[#334155] text-[#64748B] cursor-wait"
                  : "bg-[#006C4C] hover:bg-[#004832] text-white shadow-lg hover:shadow-xl"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xác thực...
                </span>
              ) : "Đăng nhập"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#475569] mt-6">
          GreenCar Admin Panel — chỉ dành cho nội bộ
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
