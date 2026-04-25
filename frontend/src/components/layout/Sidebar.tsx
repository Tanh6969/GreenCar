import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h3>Admin</h3>
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/vehicles">Vehicle Manage</Link>
      <Link to="/admin/bookings">Booking Manage</Link>
      <Link to="/admin/users">User Manage</Link>
    </aside>
  );
};

export default Sidebar;
