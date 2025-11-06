import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http from "../api/http";
import { jwtDecode } from "jwt-decode";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("sg_token"));
  const [user, setUser] = useState(null);
  const isAuthed = !!token;

  useEffect(() => {
    if (!token) { setUser(null); return; }
    try {
      const payload = jwtDecode(token);
      setUser({ email: payload.email, isConfigured: payload.isConfigured });
    } catch {
      localStorage.removeItem("sg_token");
      setToken(null);
    }
  }, [token]);

  const login = (t) => { localStorage.setItem("sg_token", t); setToken(t); };
  const logout = () => { localStorage.removeItem("sg_token"); setToken(null); };

  const refreshUser = async () => {
    if (!token) return;
    const { data } = await http.get("/user/me");
    setUser(data.user);
  };

  const value = useMemo(() => ({ token, user, isAuthed, login, logout, refreshUser }), [token, user, isAuthed]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
