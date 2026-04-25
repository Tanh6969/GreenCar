import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="page-shell">
      <Header />
      <main className="container main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
