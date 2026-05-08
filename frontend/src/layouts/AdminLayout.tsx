import React from "react";
import Sidebar from "../components/layout/Sidebar";
import AdminHeader from "../components/layout/AdminHeader";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="admin-shell">
      <AdminHeader />
      <div className="admin-layout">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
