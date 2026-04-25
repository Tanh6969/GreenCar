import React from "react";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input className="input" {...props} />;
};

export default Input;
