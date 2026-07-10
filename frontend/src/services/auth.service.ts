import { apiClient } from "./api";
import { User } from "../types/user.type";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  role: string;
  user_id: number;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  license_no: string;
  role_id: number;
  created_at: string;
}

function toUser(r: UserResponse): User {
  return {
    user_id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    license_no: r.license_no,
    role_id: r.role_id,
    created_at: r.created_at,
  };
}

type RegisterPayload = Pick<User, "name" | "email" | "phone" | "license_no"> & { password: string };

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiClient<LoginResponse>("/auth/login", "POST", { email, password });
    // Store token temporarily so the next call can authenticate
    sessionStorage.setItem("gc_token", res.access_token);
    const userRes = await apiClient<UserResponse>(`/users/me`);
    return { token: res.access_token, user: toUser(userRes) };
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
    const res = await apiClient<LoginResponse>("/auth/register", "POST", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      license_no: payload.license_no,
    });
    sessionStorage.setItem("gc_token", res.access_token);
    const userRes = await apiClient<UserResponse>(`/users/me`);
    return { token: res.access_token, user: toUser(userRes) };
  },
};
