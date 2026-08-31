"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingCart, Heart, User as UserIcon,
  Sparkles, MapPin, Moon, Sun, Scale,
  ChevronDown, LogOut, ShieldAlert, Cpu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useTheme } from "../context/ThemeContext";
import VoiceSearchButton from "./VoiceSearchButton";

interface NavbarProps {
  onOpenSearchModal: () => void;
}

export default function Navbar({ onOpenSearchModal }: NavbarProps) {
  const router = useRouter();
  const { user, logout, switchDemoUser, isAdmin } = useAuth();
  const { cartCount, wishlistCount, setIsCartDrawerOpen } = useCartWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [locationCity, setLocationCity] = useState("Mumbai 400001");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* Top micro banner for Indian Context */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white text-xs py-1.5 px-4 font-medium flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide">🇮🇳 BHARAT AI COMMERCE</span>
          <span className="hidden sm:inline">Next-Gen Hybrid Recommendation Engine & Customer Behavior Intelligence</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden md:inline">⚡ Free 1-Day Delivery across 19,000+ PIN Codes</span>
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded">
            <Cpu className="w-3 h-3 text-amber-300" />
            <span className="font-semibold text-amber-200">Active AI: TF-IDF + Collaborative Matrix</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              भ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Bharat<span className="text-orange-600 dark:text-orange-500">Kart</span>
                </span>
                <span className="bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block tracking-wider">
                INTELLIGENT INDIAN COMMERCE
              </span>
            </div>
          </Link>

          {/* Delivery Location Pin */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800 pl-4">
            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Deliver to</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                {user?.city || "Mumbai"} 400001
              </p>
            </div>
          </div>

          {/* Search Trigger Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div
              onClick={onOpenSearchModal}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full cursor-pointer transition-all shadow-inner group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
              <span className="text-sm text-slate-500 dark:text-slate-400 truncate flex-1">
                Try <span className="text-orange-600 dark:text-orange-400 font-medium">"black shoes under 2000"</span>, "hyderabadi biryani", or brand...
              </span>
              <VoiceSearchButton onSearch={(query) => {
                router.push(`/products?q=${encodeURIComponent(query)}`);
              }} />
              <kbd className="hidden md:inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Compare */}
            <Link
              href="/compare"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex"
              title="Compare Products"
            >
              <Scale className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-800/80 transition-colors font-medium text-sm"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline text-xs font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-orange-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu with Quick Persona Switch */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user?.name ? user.name[0] : "G"}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 text-sm animate-in fade-in zoom-in-95">
                  {/* Current Persona Header */}
                  <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.name || "Guest Shopper"}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || "Browsing as guest"}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium text-slate-600 dark:text-slate-300">
                      <span>📍 {user?.city || "India"}</span>
                      {isAdmin && <span className="text-orange-600 font-bold ml-1">• Admin</span>}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      ❤️ My Wishlist
                    </Link>
                    <Link
                      href="/compare"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      ⚖️ Product Comparison
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 bg-orange-50/70 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-semibold"
                    >
                      📊 AI Admin & Analytics Dashboard
                    </Link>
                  </div>

                  {/* Quick Persona Switcher for Evaluation */}
                  <div className="px-4 pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Switch Persona (AI Demo)
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <button
                        onClick={() => { switchDemoUser("aarav.sharma@example.in"); setIsUserMenuOpen(false); }}
                        className={`px-2 py-1 rounded text-left border ${user?.email.includes("aarav") ? "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300 font-bold" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        Aarav (Tech/Footwear)
                      </button>
                      <button
                        onClick={() => { switchDemoUser("priya.patel@example.in"); setIsUserMenuOpen(false); }}
                        className={`px-2 py-1 rounded text-left border ${user?.email.includes("priya") ? "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300 font-bold" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        Priya (Ethnic/Beauty)
                      </button>
                      <button
                        onClick={() => { switchDemoUser("ananya.m@example.in"); setIsUserMenuOpen(false); }}
                        className={`px-2 py-1 rounded text-left border ${user?.email.includes("ananya") ? "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300 font-bold" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        Ananya (Food/Sweets)
                      </button>
                      <button
                        onClick={() => { switchDemoUser("admin@bharatkart.in"); setIsUserMenuOpen(false); }}
                        className={`px-2 py-1 rounded text-left border ${user?.email.includes("admin") ? "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300 font-bold" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        Admin Nadeem
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 px-4">
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full text-left py-1 text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Category Sub-Navigation */}
        <nav className="flex items-center gap-6 overflow-x-auto py-2 text-xs font-medium text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 no-scrollbar">
          <Link href="/products" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap font-bold flex items-center gap-1">
            <span>✨ All Categories</span>
          </Link>
          <Link href="/products?category=Ethnic%20%26%20Fashion" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Ethnic & Fashion
          </Link>
          <Link href="/products?category=Electronics%20%26%20Audio" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Electronics & Audio
          </Link>
          <Link href="/products?category=Footwear" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Footwear
          </Link>
          <Link href="/products?category=Indian%20Delicacies%20%26%20Sweets" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Biryani & Indian Sweets
          </Link>
          <Link href="/products?category=Groceries%20%26%20Spices" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Groceries & Desi Ghee
          </Link>
          <Link href="/products?category=Beauty%20%26%20Ayurveda" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Beauty & Ayurveda
          </Link>
          <Link href="/products?category=Home%20%26%20Kitchen" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Home & Kitchen
          </Link>
          <Link href="/products?category=Watches%20%26%20Accessories" className="hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap">
            Watches & Accessories
          </Link>
        </nav>
      </div>
    </header>
  );
}
