import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", className = "", ...props }) => {
  return <button className={`btn ${variant === "ghost" ? "btn-ghost" : "btn-primary"} ${className}`.trim()} {...props} />;
};

export default Button;
