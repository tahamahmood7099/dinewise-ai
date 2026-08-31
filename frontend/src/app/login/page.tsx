"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setIsLoading(true);
    await switchDemoUser(userEmail);
    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto text-xl font-bold">
            भ
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome to BharatKart AI
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your personalized recommendation feeds
          </p>
        </div>

        {/* Quick Demo Personas Selection */}
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 space-y-2">
          <p className="text-[11px] font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Instant Demo Personas (Click to Login)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin("aarav.sharma@example.in")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-700 text-left hover:bg-orange-100 dark:hover:bg-orange-900 font-semibold"
            >
              Aarav Sharma
              <span className="block text-[10px] text-slate-400 font-normal">Tech & Footwear</span>
            </button>
            <button
              onClick={() => handleQuickLogin("priya.patel@example.in")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-700 text-left hover:bg-orange-100 dark:hover:bg-orange-900 font-semibold"
            >
              Priya Patel
              <span className="block text-[10px] text-slate-400 font-normal">Fashion & Beauty</span>
            </button>
            <button
              onClick={() => handleQuickLogin("ananya.m@example.in")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-700 text-left hover:bg-orange-100 dark:hover:bg-orange-900 font-semibold"
            >
              Ananya M.
              <span className="block text-[10px] text-slate-400 font-normal">Sweets & Delicacies</span>
            </button>
            <button
              onClick={() => handleQuickLogin("admin@bharatkart.in")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-700 text-left hover:bg-orange-100 dark:hover:bg-orange-900 font-semibold text-orange-600"
            >
              Admin Nadeem
              <span className="block text-[10px] text-slate-400 font-normal">Full AI Telemetry</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          New to BharatKart?{" "}
          <Link href="/register" className="text-orange-600 font-bold hover:underline">
            Create an Indian account
          </Link>
        </div>
      </div>
    </div>
  );
}
