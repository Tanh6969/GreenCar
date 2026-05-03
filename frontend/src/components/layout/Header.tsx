import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">G</div>
          GreenCar
        </Link>
        <nav className="nav">
          <Link to="/cars">Danh sách xe</Link>
          <Link to="/customer/my-bookings">Đơn của tôi</Link>
          <Link to="/admin/dashboard">Admin</Link>
        </nav>
        <div className="nav-actions">
          <Link to="/auth/login" className="btn btn-ghost btn-sm">Đăng nhập</Link>
          <Link to="/auth/register" className="btn btn-primary btn-sm">Đăng ký</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
