"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Heart, Sparkles, Moon, Sun, User as UserIcon,
  ChevronDown, MapPin, SlidersHorizontal, Scale, BarChart3,
  LogOut, Shield, UtensilsCrossed, Store
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import SmartSearchModal from "./SmartSearchModal";
import VoiceSearchButton from "./VoiceSearchButton";

const HYDERABAD_AREAS = [
  "All Hyderabad", "Banjara Hills", "Jubilee Hills", "Madhapur",
  "Gachibowli", "Charminar", "Tolichowki", "Secunderabad", "Hitech City", "Kukatpally"
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout, switchDemoUser } = useAuth();
  const { favoritesCount } = useFavorites();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("All Hyderabad");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    if (area === "All Hyderabad") {
      router.push("/restaurants");
    } else {
      router.push(`/restaurants?area=${encodeURIComponent(area)}`);
    }
  };

  const handleSwitchPersona = async (email: string, name: string, segment: string) => {
    await switchDemoUser(email);
    setIsUserMenuOpen(false);
    showToast(
      `🎭 Switched to ${name}`,
      `Taste profile calibrated to ${segment}. Recommendations updating.`,
      "success"
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Brand Logo & Location */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  Dine<span className="text-orange-600">Wise</span>{" "}
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold">
                    AI
                  </span>
                </span>
                <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                  Hyderabad Dining
                </span>
              </div>
            </Link>

            {/* Hyderabad Area Selector */}
            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs">
              <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer pr-1"
              >
                {HYDERABAD_AREAS.map((a) => (
                  <option key={a} value={a} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center: Smart Search Trigger Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-between w-full px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-orange-500/60 cursor-pointer text-xs text-slate-400 transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                <span className="truncate">
                  Search &quot;Biryani under 500 in Tolichowki&quot;...
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <VoiceSearchButton
                  onTranscript={(text) => {
                    setIsSearchOpen(true);
                  }}
                />
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
                  NLP
                </kbd>
              </div>
            </div>
          </div>

          {/* Right: Actions, Navigation & Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Explore Restaurants */}
            <Link
              href="/restaurants"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            >
              <Store className="w-4 h-4" />
              <span>Restaurants</span>
            </Link>

            {/* Compare Tool */}
            <Link
              href="/compare"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition relative"
              title="Compare Restaurants"
            >
              <Scale className="w-5 h-5" />
            </Link>

            {/* Favorites Icon with Badge */}
            <Link
              href="/favorites"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition relative"
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-scaleIn">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Admin Analytics Portal */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 text-xs font-bold hover:bg-orange-100 dark:hover:bg-orange-900 transition"
              title="AI Analytics & Telemetry"
            >
              <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden xl:inline">AI Analytics</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile & 1-Click Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition bg-slate-50 dark:bg-slate-900"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center text-[11px] font-black">
                  {user ? user.name[0] : "A"}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline truncate max-w-[100px]">
                  {user ? user.name.split(" ")[0] : "Aarav"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-3 text-xs space-y-3 z-50 animate-fadeIn"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="p-2.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/60">
                    <p className="font-black text-slate-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-orange-700 dark:text-orange-300 font-bold">
                      <Sparkles className="w-3 h-3 text-orange-600" />
                      <span>{user?.dietary_pref || "Non-Veg"} • {user?.preferred_budget || "Moderate"}</span>
                    </div>
                  </div>

                  {/* 1-Click Demo Personas */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                      Switch Demo Persona (1-Click)
                    </span>
                    <button
                      onClick={() => handleSwitchPersona("aarav.sharma@example.in", "Aarav Sharma", "Biryani Enthusiast")}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Aarav Sharma</p>
                        <p className="text-[10.5px] text-slate-400">Biryani & Mughlai Enthusiast</p>
                      </div>
                      {user?.email === "aarav.sharma@example.in" && (
                        <span className="text-[10px] font-bold text-orange-600">Active</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleSwitchPersona("priya.patel@example.in", "Priya Patel", "Vegetarian Explorer")}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Priya Patel</p>
                        <p className="text-[10.5px] text-slate-400">Vegetarian South Indian Explorer</p>
                      </div>
                      {user?.email === "priya.patel@example.in" && (
                        <span className="text-[10px] font-bold text-orange-600">Active</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleSwitchPersona("rohan.verma@example.in", "Rohan Verma", "Premium Diner")}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Rohan Verma</p>
                        <p className="text-[10.5px] text-slate-400">Premium Diner (Italian & Cafes)</p>
                      </div>
                      {user?.email === "rohan.verma@example.in" && (
                        <span className="text-[10px] font-bold text-orange-600">Active</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleSwitchPersona("ananya.m@example.in", "Ananya Mukherjee", "Budget Explorer")}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Ananya Mukherjee</p>
                        <p className="text-[10.5px] text-slate-400">Budget Explorer (Haleem & Street Food)</p>
                      </div>
                      {user?.email === "ananya.m@example.in" && (
                        <span className="text-[10px] font-bold text-orange-600">Active</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleSwitchPersona("admin@dinewise.in", "Admin Nadeem", "System Administrator")}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between text-orange-600"
                    >
                      <div>
                        <p className="font-bold">Admin Nadeem</p>
                        <p className="text-[10.5px] text-slate-400">Analytics & Model Benchmarks</p>
                      </div>
                      {user?.role === "admin" && (
                        <span className="text-[10px] font-bold text-orange-600">Active</span>
                      )}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <Link
                      href="/favorites"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="text-slate-600 dark:text-slate-300 font-semibold hover:text-orange-600"
                    >
                      My Favorites ({favoritesCount})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="text-rose-500 font-bold flex items-center gap-1 hover:underline"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Smart Search Modal */}
      <SmartSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
