import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const OwnerRegisterLanding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleStart = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate("/owner/register/steps");
    }
  };

  const benefits = [
    { icon: "💰", title: "Thu nhập thụ động hấp dẫn", desc: "Kiếm từ 8–30 triệu/tháng khi xe không sử dụng. Tối ưu hóa tài sản, tăng thu nhập đều đặn." },
    { icon: "🛡️", title: "Bảo hiểm toàn diện", desc: "GreenCar phối hợp bảo hiểm vật chất 24/7. Mọi sự cố đều được xử lý nhanh chóng, minh bạch." },
    { icon: "📱", title: "Quản lý dễ dàng", desc: "Theo dõi xe, lịch đặt, doanh thu mọi lúc mọi nơi qua ứng dụng. Tự chủ lịch trình cho thuê." },
    { icon: "✅", title: "Khách hàng được xác minh", desc: "100% khách hàng đã xác minh CCCD & GPLX. Quy trình đặt xe chặt chẽ, bảo vệ chủ xe." },
    { icon: "🔧", title: "Hỗ trợ kỹ thuật 24/7", desc: "Đội ngũ GreenCar luôn sẵn sàng hỗ trợ. Xử lý sự cố, bảo dưỡng định kỳ có tư vấn viên." },
    { icon: "📊", title: "Báo cáo thu nhập rõ ràng", desc: "Sao kê chi tiết từng chuyến, thanh toán đúng hạn vào ngày 5 hàng tháng qua tài khoản ngân hàng." },
  ];

  const steps = [
    { num: "01", title: "Điền thông tin xe", desc: "Cung cấp thông tin chi tiết về xe của bạn: hãng xe, model, năm sản xuất, biển số và tình trạng xe." },
    { num: "02", title: "Tải ảnh xe lên", desc: "Chụp và tải lên ít nhất 4 ảnh xe (trước, sau, bên trái, bên phải) và ảnh nội thất. Ảnh rõ nét sẽ thu hút nhiều khách hơn." },
    { num: "03", title: "Tư vấn & Duyệt xe", desc: "Chuyên viên GreenCar sẽ liên hệ tư vấn trong vòng 24h. Xe được kiểm định chất lượng trước khi đăng cho thuê." },
    { num: "04", title: "Bắt đầu cho thuê", desc: "Sau khi được duyệt, xe sẽ xuất hiện trên nền tảng. Bạn bắt đầu nhận đặt xe và thu nhập ngay!" },
  ];

  const faqs = [
    { q: "Xe tôi có đủ điều kiện không?", a: "GreenCar chấp nhận xe từ 4–16 chỗ, đời xe không quá 10 năm (tính từ năm hiện tại), còn hạn đăng kiểm ít nhất 6 tháng. Xe điện, xe hybrid được ưu tiên." },
    { q: "Tỷ lệ ăn chia như thế nào?", a: "Chủ xe nhận 75–80% doanh thu mỗi chuyến sau khi trừ phí dịch vụ nền tảng 20–25%. Không phí ẩn, không phí đăng ký." },
    { q: "Xe của tôi có được bảo hiểm không?", a: "Có. GreenCar hợp tác với bảo hiểm ô tô toàn diện. Trong thời gian cho thuê, xe được bảo hiểm vật chất theo hợp đồng bảo hiểm liên kết. Chủ xe không chịu bất kỳ chi phí nào nếu khách gây tai nạn." },
    { q: "Tôi có thể chủ động chặn lịch không?", a: "Hoàn toàn có thể. Bạn tự quản lý lịch cho thuê, có thể chặn ngày sử dụng cá nhân bất kỳ lúc nào qua ứng dụng. GreenCar tôn trọng quyền sở hữu của bạn." },
    { q: "Bao lâu thì tôi nhận được tiền?", a: "Tiền được quy đổi và thanh toán vào ngày 5 hàng tháng qua chuyển khoản ngân hàng. Bạn có thể xem sao kê chi tiết từng chuyến trong ứng dụng." },
    { q: "Nếu khách làm hỏng xe thì sao?", a: "Khách đặt cọc 30% giá trị chuyến thuê. Thiệt hại vượt mức cọc sẽ được bảo hiểm hoặc khách bồi thường theo hợp đồng. GreenCar hỗ trợ toàn bộ quy trình giải quyết." },
  ];

  return (
    <div style={{ background: "#F8F9FB", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #003D2B 0%, #006C4C 50%, #004832 100%)",
        padding: "80px 0 100px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(79,189,145,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(79,189,145,0.10) 0%, transparent 50%)",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(79,189,145,0.2)", borderRadius: 999,
                padding: "6px 16px", marginBottom: 24,
              }}>
                <span style={{ fontSize: 14 }}>💚</span>
                <span style={{ color: "#4FBD91", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>CHƯƠNG TRÌNH CHỦ XE GREENCAR</span>
              </div>
              <h1 style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -2 }}>
                Tăng thu nhập<br />
                <span style={{ color: "#4FBD91" }}>hàng tháng</span><br />
                cùng GreenCar
              </h1>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.80)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 460 }}>
                Xe bạn đang đỗ là tài sản sinh lời. Chia sẻ xe cùng GreenCar — nền tảng thuê xe điện hàng đầu Việt Nam — và nhận thu nhập thụ động lên đến <strong style={{ color: "#4FBD91" }}>30 triệu/tháng</strong> mà không cần lo lắng về rủi ro.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={handleStart}
                  style={{
                    background: "#4FBD91", color: "#003D2B", border: "none",
                    borderRadius: 999, padding: "16px 36px", fontWeight: 800,
                    fontSize: 16, cursor: "pointer", transition: "all 0.2s",
                    boxShadow: "0 4px 20px rgba(79,189,145,0.4)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#3aad7e"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#4FBD91"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Đăng ký cho thuê ngay →
                </button>
                <a
                  href="#how-it-works"
                  style={{
                    background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)",
                    borderRadius: 999, padding: "16px 32px", fontWeight: 700,
                    fontSize: 15, cursor: "pointer", transition: "all 0.2s", textDecoration: "none",
                    display: "inline-flex", alignItems: "center",
                  }}
                >
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
            {/* Stats card */}
            <div style={{
              background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: 32,
            }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Thu nhập trung bình / tháng
              </div>
              {[
                { type: "Xe phổ thông (4 chỗ)", amount: "8–12 triệu" },
                { type: "Xe gia đình (7 chỗ)", amount: "15–20 triệu" },
                { type: "Xe sang / SUV", amount: "25–35 triệu" },
                { type: "Xe điện cao cấp", amount: "30–50 triệu" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{item.type}</span>
                  <span style={{ color: "#4FBD91", fontWeight: 800, fontSize: 16 }}>{item.amount}</span>
                </div>
              ))}
              <div style={{
                marginTop: 20, background: "rgba(79,189,145,0.2)", borderRadius: 10,
                padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span>⭐</span>
                <span style={{ color: "#4FBD91", fontSize: 13, fontWeight: 600 }}>
                  Hơn 2.400 chủ xe đang kiếm thu nhập cùng GreenCar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-eyebrow">Lợi ích nổi bật</div>
            <h2 className="section-title" style={{ fontSize: 36 }}>Tại sao chọn GreenCar?</h2>
            <p className="section-sub" style={{ margin: "12px auto 0", textAlign: "center" }}>
              Chúng tôi xây dựng hệ sinh thái bảo vệ tối đa quyền lợi của chủ xe
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: 28,
                border: "1px solid #E5EBE8", transition: "all 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,108,76,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{b.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#191C1E", margin: "0 0 10px" }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: "#6E7A72", lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="section section-alt" style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-eyebrow">Quy trình đăng ký</div>
            <h2 className="section-title" style={{ fontSize: 36 }}>Chỉ 4 bước đơn giản</h2>
            <p className="section-sub" style={{ margin: "12px auto 0", textAlign: "center" }}>
              Từ đăng ký đến bắt đầu cho thuê, toàn bộ quy trình chỉ mất 1–3 ngày
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, position: "relative" }}>
            <div style={{
              position: "absolute", top: 32, left: "12.5%", right: "12.5%",
              height: 2, background: "linear-gradient(90deg, #006C4C, #4FBD91)",
              zIndex: 0,
            }} />
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: i === 3 ? "var(--green)" : "#fff",
                  border: "3px solid var(--green)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 4px 16px rgba(0,108,76,0.2)",
                }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: i === 3 ? "#fff" : "var(--green)" }}>{step.num}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#191C1E", margin: "0 0 10px" }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#6E7A72", lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 52 }}>
            <button
              onClick={handleStart}
              className="btn btn-primary btn-lg"
              style={{ minWidth: 280 }}
            >
              Bắt đầu đăng ký ngay →
            </button>
          </div>
        </div>
      </div>

      {/* Terms & Policy */}
      <div className="section" style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* Policy card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 36, border: "1px solid #E5EBE8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22 }}>📋</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#191C1E" }}>Điều khoản sử dụng</h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Chủ xe phải là công dân Việt Nam từ 21 tuổi trở lên, có đầy đủ năng lực hành vi dân sự",
                  "Xe phải có đầy đủ giấy tờ hợp lệ: đăng ký xe, bảo hiểm, đăng kiểm còn hiệu lực",
                  "Xe không được có tranh chấp pháp lý, không thế chấp trong thời gian cho thuê",
                  "Chủ xe cam kết cung cấp thông tin trung thực, chính xác về xe",
                  "GreenCar có quyền từ chối hoặc ngừng hợp tác nếu phát hiện thông tin gian lận",
                  "Phí dịch vụ nền tảng: 20% mỗi chuyến cho xe phổ thông, 25% cho xe điện cao cấp",
                  "Hợp đồng cho thuê có thể chấm dứt với thông báo trước 30 ngày",
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#3E4943", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--green)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Insurance card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 36, border: "1px solid #E5EBE8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(79,189,145,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22 }}>🛡️</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#191C1E" }}>Chính sách bảo hiểm</h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Bảo hiểm vật chất xe trong suốt thời gian cho thuê (24/7)",
                  "Bảo hiểm trách nhiệm dân sự bên thứ ba theo quy định pháp luật",
                  "Mức khấu trừ bảo hiểm: 2 triệu đồng/sự cố đối với chủ xe",
                  "Thiệt hại do lỗi cố ý, vi phạm nghiêm trọng sẽ do khách hàng chịu hoàn toàn",
                  "GreenCar hỗ trợ xử lý hồ sơ bảo hiểm trong vòng 24h kể từ khi sự cố được báo cáo",
                  "Tiền bồi thường bảo hiểm thanh toán trong vòng 15 ngày làm việc",
                  "Không áp dụng bảo hiểm nếu chủ xe vi phạm điều khoản hợp đồng",
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#3E4943", lineHeight: 1.6 }}>
                    <span style={{ color: "#4FBD91", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="section section-alt" style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-eyebrow">Câu hỏi thường gặp</div>
            <h2 className="section-title" style={{ fontSize: 36 }}>Giải đáp thắc mắc</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900, margin: "0 auto" }}>
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{
        background: "linear-gradient(135deg, #003D2B 0%, #006C4C 100%)",
        padding: "72px 0",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: -1 }}>
            Sẵn sàng sinh lời từ xe của bạn?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, margin: "0 0 36px" }}>
            Đăng ký miễn phí hôm nay. Chuyên viên sẽ liên hệ tư vấn trong 24 giờ.
          </p>
          <button
            onClick={handleStart}
            style={{
              background: "#4FBD91", color: "#003D2B", border: "none",
              borderRadius: 999, padding: "18px 48px", fontWeight: 800,
              fontSize: 17, cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 4px 24px rgba(79,189,145,0.5)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#3aad7e"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#4FBD91"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Đăng ký cho thuê xe →
          </button>
        </div>
      </div>

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={() => setShowLoginPrompt(false)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 48, maxWidth: 440, width: "90%",
            textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔐</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px", color: "#191C1E" }}>
              Đăng nhập để tiếp tục
            </h2>
            <p style={{ color: "#6E7A72", fontSize: 15, lineHeight: 1.6, margin: "0 0 28px" }}>
              Bạn cần có tài khoản GreenCar để đăng ký cho thuê xe. Đăng nhập hoặc tạo tài khoản miễn phí ngay.
            </p>
            <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
              <button
                onClick={() => { window.location.href = "/auth/login?redirect=/owner/register/steps"; }}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "14px" }}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => { window.location.href = "/auth/register"; }}
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", padding: "14px" }}
              >
                Tạo tài khoản mới
              </button>
            </div>
            <button
              onClick={() => setShowLoginPrompt(false)}
              style={{ marginTop: 16, background: "none", border: "none", color: "#6E7A72", cursor: "pointer", fontSize: 14 }}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #E5EBE8",
      overflow: "hidden", transition: "box-shadow 0.2s",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", padding: "18px 20px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: "#191C1E" }}>{q}</span>
        <span style={{
          color: "var(--green)", fontSize: 18, fontWeight: 700,
          transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s",
          flexShrink: 0,
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#6E7A72", lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
};

export default OwnerRegisterLanding;
