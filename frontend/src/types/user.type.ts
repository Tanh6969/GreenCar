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
  license_front_url?: string;
  license_back_url?: string;
  license_status?: "unverified" | "pending" | "verified" | "rejected";
  license_reject_reason?: string;
}
