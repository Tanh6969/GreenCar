export const toISODate = (value: Date): string => value.toISOString();

export const toDateInputValue = (value: Date): string => value.toISOString().slice(0, 10);

export const formatDateTime = (value: string): string => {
  return new Date(value).toLocaleString("vi-VN");
};
