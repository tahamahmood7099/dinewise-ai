"use client";

import React from "react";
import { Sparkles, Users, Award, ShieldAlert, Check, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const DEMO_PERSONAS = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.in",
    segment: "Biryani Enthusiast",
    badge: "Non-Veg • Moderate Budget",
    cuisines: "Biryani & Mughlai",
    areas: "Tolichowki, Secunderabad"
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.in",
    segment: "Vegetarian Explorer",
    badge: "Pure Veg Only",
    cuisines: "South Indian & Sweets",
    areas: "Banjara Hills, Hitech City"
  },
  {
    id: 3,
    name: "Rohan Verma",
    email: "rohan.verma@example.in",
    segment: "Premium Diner",
    badge: "Fine Dining • > ₹1000",
    cuisines: "Italian, Cafes & Asian",
    areas: "Jubilee Hills, Madhapur"
  },
  {
    id: 4,
    name: "Ananya Mukherjee",
    email: "ananya.m@example.in",
    segment: "Budget Explorer",
    badge: "Pocket Friendly • ≤ ₹500",
    cuisines: "Haleem & Street Delights",
    areas: "Charminar, Tolichowki"
  },
  {
    id: 5,
    name: "Admin Nadeem",
    email: "admin@dinewise.in",
    segment: "System Administrator",
    badge: "Full Telemetry & BI Access",
    cuisines: "All Hyderabad Listings",
    areas: "Hyderabad Citywide"
  }
];

export default function DemoPersonaBar() {
  const { user, switchDemoUser } = useAuth();
  const { showToast } = useToast();

  const handleSelectPersona = async (p: typeof DEMO_PERSONAS[0]) => {
    if (user?.email === p.email) return;
    await switchDemoUser(p.email);
    showToast(
      `🎭 Demo Persona Switched: ${p.name}`,
      `Active taste profile calibrated to ${p.segment} (${p.cuisines} in ${p.areas}).`,
      "success"
    );
  };

  return (
    <aside aria-label="Demo Persona Switcher" className="w-full bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border-b border-orange-500/30 px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs">
        {/* Left Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="px-2 py-0.5 rounded-lg bg-orange-600/90 text-white font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>Viva Demo Mode</span>
          </div>
          <span className="hidden lg:inline text-slate-400 font-medium text-[11px]">
            1-Click Switcher for College Examination:
          </span>
        </div>

        {/* Persona Buttons Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none py-0.5">
          {DEMO_PERSONAS.map((p) => {
            const isActive = user?.email === p.email;
            return (
              <button
                key={p.email}
                onClick={() => handleSelectPersona(p)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 flex-shrink-0 text-[11px] shadow-sm ${
                  isActive
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-2 ring-orange-400 shadow-md scale-[1.02]"
                    : "bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/80"
                }`}
              >
                <span>{p.name.split(" ")[0]}</span>
                <span className="text-[10px] opacity-80 hidden sm:inline">
                  ({p.segment.replace(" Explorer", "").replace(" Enthusiast", "")})
                </span>
                {isActive && <Check className="w-3 h-3 text-amber-200" />}
              </button>
            );
          })}
        </div>

        {/* Current Active Persona Summary Tag */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <span className="text-orange-400 font-bold">Active Palate:</span>
          <span className="truncate max-w-[220px]">
            {user?.name} • {user?.dietary_pref || "All"}
          </span>
        </div>
      </div>
    </aside>
  );
}
