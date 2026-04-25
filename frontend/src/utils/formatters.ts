export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};
