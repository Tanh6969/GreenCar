import { apiClient } from "./api";
import { User } from "../types/user.type";

interface ApiUser {
  id: number;
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

function toUser(u: ApiUser): User {
  return {
    user_id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    license_no: u.license_no,
    role_id: u.role_id,
    created_at: u.created_at,
    license_front_url: u.license_front_url,
    license_back_url: u.license_back_url,
    license_status: u.license_status,
    license_reject_reason: u.license_reject_reason,
  };
}

export const userService = {
  async getAll(): Promise<User[]> {
    const data = await apiClient<ApiUser[]>("/admin/users");
    return (data ?? []).map(toUser);
  },

  async getMe(): Promise<User> {
    const data = await apiClient<ApiUser>("/users/me");
    return toUser(data);
  },

  async getById(id: number): Promise<User> {
    const data = await apiClient<ApiUser>(`/admin/users/${id}`);
    return toUser(data);
  },

  async submitLicense(data: {
    license_no: string;
    license_front_url: string;
    license_back_url: string;
  }): Promise<User> {
    const res = await apiClient<ApiUser>("/users/me/license", "PUT", data);
    return toUser(res);
  },

  async adminVerifyLicense(
    userId: number,
    status: "verified" | "rejected",
    rejectReason?: string
  ): Promise<User> {
    const res = await apiClient<ApiUser>(
      `/admin/users/${userId}/license/status`,
      "PUT",
      { status, reject_reason: rejectReason ?? "" }
    );
    return toUser(res);
  },
};
