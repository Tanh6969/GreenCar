import { roles, users } from "../data/mockData";
import { Role, User } from "../types/user.type";

const wait = async (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  async login(email: string): Promise<{ token: string; user: User }> {
    await wait();
    const user = users.find((u) => u.email === email) ?? users[1];
    return { token: `mock-token-${user.user_id}`, user };
  },

  async register(payload: Pick<User, "name" | "email" | "phone" | "license_no">): Promise<User> {
    await wait();
    return {
      user_id: users.length + 1,
      role_id: 2,
      created_at: new Date().toISOString(),
      ...payload
    };
  },

  async getRoles(): Promise<Role[]> {
    await wait();
    return roles;
  }
};
