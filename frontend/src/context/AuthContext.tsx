import React, { createContext, useMemo, useState } from "react";
import { User } from "../types/user.type";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  login: () => undefined,
  logout: () => undefined,
  isAdmin: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("gc_user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gc_token"));

  const value = useMemo(
    () => ({
      user,
      token,
      login: (nextToken: string, nextUser: User) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem("gc_token", nextToken);
        localStorage.setItem("gc_user", JSON.stringify(nextUser));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("gc_token");
        localStorage.removeItem("gc_user");
      },
      isAdmin: user?.role_id === 1
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
