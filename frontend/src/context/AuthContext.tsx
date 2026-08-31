"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { fetchApi } from "../lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    city?: string,
    cuisines?: string[],
    areas?: string[],
    dietaryPref?: string,
    budget?: string
  ) => Promise<void>;
  logout: () => void;
  switchDemoUser: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("dinewise_user");
    const savedToken = localStorage.getItem("dinewise_token");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default demo login as Aarav Sharma (Biryani Enthusiast)
      const demoUser: User = {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@example.in",
        role: "user",
        city: "Hyderabad",
        dietary_pref: "Non-Veg",
        preferred_budget: "Moderate",
        preferred_cuisines: ["Biryani", "Mughlai", "Street Food"],
        preferred_areas: ["Secunderabad", "Tolichowki", "Charminar"],
        created_at: new Date().toISOString(),
      };
      setUser(demoUser);
      setToken("demo_token_aarav");
      localStorage.setItem("dinewise_user", JSON.stringify(demoUser));
      localStorage.setItem("dinewise_token", "demo_token_aarav");
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetchApi<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem("dinewise_user", JSON.stringify(res.user));
    localStorage.setItem("dinewise_token", res.access_token);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    city: string = "Hyderabad",
    cuisines: string[] = ["Biryani"],
    areas: string[] = ["Banjara Hills"],
    dietaryPref: string = "All",
    budget: string = "Moderate"
  ) => {
    const res = await fetchApi<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        city,
        preferred_cuisines: cuisines,
        preferred_areas: areas,
        dietary_pref: dietaryPref,
        preferred_budget: budget
      }),
    });
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem("dinewise_user", JSON.stringify(res.user));
    localStorage.setItem("dinewise_token", res.access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("dinewise_user");
    localStorage.removeItem("dinewise_token");
  };

  const switchDemoUser = async (email: string) => {
    try {
      const password = email.includes("admin") ? "adminpassword" : "password123";
      await login(email, password);
    } catch (e) {
      console.error("Demo user switch error", e);
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
