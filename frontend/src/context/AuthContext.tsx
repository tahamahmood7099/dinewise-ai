"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { loginApi, registerApi } from "../lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, city?: string, categories?: string[]) => Promise<void>;
  logout: () => void;
  switchDemoUser: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("bharatkart_user");
    const savedToken = localStorage.getItem("bharatkart_token");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default demo login as Aarav Sharma for immediate personalized experience
      const demoUser: User = {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@example.in",
        role: "user",
        city: "Bengaluru",
        preferences: JSON.stringify({ categories: ["Electronics & Audio", "Footwear"] }),
        created_at: new Date().toISOString(),
      };
      setUser(demoUser);
      setToken("demo_token_aarav");
      localStorage.setItem("bharatkart_user", JSON.stringify(demoUser));
      localStorage.setItem("bharatkart_token", "demo_token_aarav");
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem("bharatkart_user", JSON.stringify(res.user));
    localStorage.setItem("bharatkart_token", res.access_token);
  };

  const register = async (name: string, email: string, password: string, city?: string, categories?: string[]) => {
    const res = await registerApi(name, email, password, city, categories);
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem("bharatkart_user", JSON.stringify(res.user));
    localStorage.setItem("bharatkart_token", res.access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bharatkart_user");
    localStorage.removeItem("bharatkart_token");
  };

  const switchDemoUser = async (email: string) => {
    try {
      await login(email, "password123");
    } catch (e) {
      if (email.includes("admin")) {
        await login(email, "adminpassword");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
