"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axiosInstance from "@/lib/api/axios";
import { logoutApi } from "@/lib/auth/auth";

type User = {
  id?: number;
  name?: string;
  email?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // LOAD USER ON START
  useEffect(() => {
    const loadAuth = () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("token");

        if (!storedUser || !token || storedUser === "undefined") {
          setUser(null);
          return;
        }

        let parsedUser: User | null = null;

        try {
          parsedUser = JSON.parse(storedUser);
        } catch (e) {
          console.warn("Invalid user JSON in sessionStorage");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
          setUser(null);
          return;
        }

        setUser(parsedUser);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      } catch (err) {
        console.error("Auth load error:", err);

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // LOGIN
  const login = (userData: User, token: string) => {
    try {
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", token);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setUser(userData);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API error:", err);
    }

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    delete axiosInstance.defaults.headers.common["Authorization"];

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};