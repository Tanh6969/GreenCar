import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">GreenCar</Link>
        <nav className="nav">
          <Link to="/cars">Danh sach xe</Link>
          <Link to="/customer/my-bookings">Don cua toi</Link>
          <Link to="/admin/dashboard">Admin</Link>
          <Link to="/auth/login">Dang nhap</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
