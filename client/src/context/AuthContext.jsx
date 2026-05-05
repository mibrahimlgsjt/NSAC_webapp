import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

function readUser() {
  const raw = localStorage.getItem("nsac_user");
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  async function login(username, password) {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("nsac_token", data.token);
    localStorage.setItem("nsac_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("nsac_token");
    localStorage.removeItem("nsac_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout, isAuthenticated: Boolean(user) }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
