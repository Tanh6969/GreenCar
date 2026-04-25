import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-card">{children}</div>
    </div>
  );
};

export default AuthLayout;
