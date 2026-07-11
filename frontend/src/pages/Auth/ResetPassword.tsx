import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { apiClient } from "../../services/api";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Liên kết không hợp lệ hoặc đã thiếu token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await apiClient("/auth/reset-password", "POST", { token, new_password: password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, token có thể đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#E7F6ED] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h1 className="text-2xl font-black text-[#191C1E] mb-2">Đặt lại mật khẩu</h1>
        <p className="text-sm text-[#6E7A72] mb-6">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
        </p>

        {success ? (
          <div className="bg-[#F0FDF4] border border-[#bbf7d0] text-[#006C4C] p-4 rounded-xl mb-6 text-center">
            <p className="font-semibold mb-1">Thành công!</p>
            <p className="text-sm">Mật khẩu của bạn đã được thay đổi.</p>
            <p className="text-xs mt-2 opacity-80">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#3E4943] uppercase tracking-wider mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 border border-[#BDCAC1] rounded-lg px-3 focus:border-[#006C4C] focus:ring-1 focus:ring-[#006C4C] outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7A72] hover:text-[#006C4C]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3E4943] uppercase tracking-wider mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full h-11 border border-[#BDCAC1] rounded-lg px-3 focus:border-[#006C4C] focus:ring-1 focus:ring-[#006C4C] outline-none transition-colors"
                required
              />
            </div>
            
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full h-11 bg-[#006C4C] text-white font-bold rounded-lg hover:bg-[#004832] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Đang xử lý..." : "Lưu mật khẩu mới"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/auth/login" className="text-sm font-semibold text-[#006C4C] hover:underline">
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
