import { roles, users } from "../data/mockData";
import { Role, User } from "../types/user.type";

const wait = async (ms = 200) => new Promise((r) => setTimeout(r, ms));

type RegisterPayload = Pick<User, "name" | "email" | "phone" | "license_no"> & { password: string };

export const authService = {
  async login(email: string, _password: string): Promise<{ token: string; user: User }> {
    await wait();
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("Email hoặc mật khẩu không đúng.");
    return { token: `mock-token-${user.user_id}`, user };
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
    await wait();
    if (users.some((u) => u.email === payload.email)) {
      throw new Error("Email này đã được sử dụng.");
    }
    const newUser: User = {
      user_id: users.length + 1,
      role_id: 2,
      created_at: new Date().toISOString(),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      license_no: payload.license_no,
    };
    return { token: `mock-token-${newUser.user_id}`, user: newUser };
  },

  async getRoles(): Promise<Role[]> {
    await wait();
    return roles;
  }
};
