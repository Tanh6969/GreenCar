import React from "react";
import Sidebar from "../components/layout/Sidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
