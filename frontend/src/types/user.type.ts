export interface Role {
  role_id: number;
  role_name: "admin" | "customer";
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  license_no: string;
  role_id: number;
  created_at: string;
}
