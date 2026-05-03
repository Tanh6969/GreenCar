import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo">GreenCar</Link>
            <p>Nền tảng thuê xe điện tự lái hàng đầu Việt Nam. Di chuyển xanh — sống xanh.</p>
            <a href="tel:19005335" className="footer-hotline">📞 1900 5335</a>
          </div>
          <div className="footer-col">
            <h4>Dịch vụ</h4>
            <ul>
              <li><Link to="/cars">Thuê xe tự lái</Link></li>
              <li><a href="#how-it-works">Cách hoạt động</a></li>
              <li><Link to="/cars">Xe theo giờ</Link></li>
              <li><Link to="/cars">Xe theo ngày</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Hướng dẫn đặt xe</a></li>
              <li><a href="#">Chính sách bảo hiểm</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Công ty</h4>
            <ul>
              <li><a href="#">Về GreenCar</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 GreenCar Mobility. Bảo lưu mọi quyền.</span>
          <span>📧 support@greencar.vn &nbsp;|&nbsp; 📍 Hà Nội, Việt Nam</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
