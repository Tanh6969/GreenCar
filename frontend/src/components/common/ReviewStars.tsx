import React from "react";

const ReviewStars: React.FC<{ value: number }> = ({ value }) => {
  return <span>{"★".repeat(value)}{"☆".repeat(5 - value)}</span>;
};

export default ReviewStars;
