import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import { apiClient } from "../../services/api";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await apiClient("/auth/forgot-password", "POST", { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E7F6ED] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h1 className="text-2xl font-black text-[#191C1E] mb-2">Quên mật khẩu</h1>
        <p className="text-sm text-[#6E7A72] mb-6">
          Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
        </p>

        {success ? (
          <div className="bg-[#F0FDF4] border border-[#bbf7d0] text-[#006C4C] p-4 rounded-xl mb-6">
            <p className="font-semibold text-sm mb-1">Đã gửi email!</p>
            <p className="text-sm">Vui lòng kiểm tra hộp thư đến (và thư mục rác) để lấy lại mật khẩu.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#3E4943] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="ban@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 border border-[#BDCAC1] rounded-lg px-3 focus:border-[#006C4C] focus:ring-1 focus:ring-[#006C4C] outline-none transition-colors"
                required
              />
            </div>
            
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#006C4C] text-white font-bold rounded-lg hover:bg-[#004832] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Đang gửi..." : "Gửi liên kết"}
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

export default ForgotPasswordPage;
