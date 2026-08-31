"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User as UserIcon, MapPin, ArrowRight, Check, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CUISINE_OPTIONS = [
  "Biryani", "Mughlai", "South Indian", "North Indian",
  "Chinese", "Italian & Pizza", "Cafe & Bistro", "Bakery & Desserts", "Street Food", "Healthy Food"
];

const HYDERABAD_AREAS = [
  "Banjara Hills", "Jubilee Hills", "Madhapur", "Gachibowli",
  "Charminar", "Tolichowki", "Secunderabad", "Hitech City", "Kukatpally"
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [dietaryPref, setDietaryPref] = useState("All");
  const [budget, setBudget] = useState("Moderate");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Biryani"]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["Banjara Hills"]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleCuisine = (cuis: string) => {
    if (selectedCuisines.includes(cuis)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuis));
    } else {
      setSelectedCuisines([...selectedCuisines, cuis]);
    }
  };

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await register(name, email, password, city, selectedCuisines, selectedAreas, dietaryPref, budget);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center mx-auto text-xl font-bold">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Create Your Foodie Profile
          </h2>
          <p className="text-xs text-slate-500">
            Calibrate your dining taste preferences so DineWise AI starts recommending restaurants tailored to your palate
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Your Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Dietary Preference
              </label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="All">All (Veg & Non-Veg)</option>
                <option value="Pure Veg">Pure Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Halal">Halal</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Typical Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Budget Friendly">Budget Friendly (≤ ₹500)</option>
                <option value="Moderate">Moderate (₹500 - ₹1000)</option>
                <option value="Premium / Fine Dining">Premium / Fine Dining (&gt; ₹1000)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Select Cuisines You Crave (Cold-Start Calibration)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {CUISINE_OPTIONS.map((cuis) => (
                <button
                  type="button"
                  key={cuis}
                  onClick={() => toggleCuisine(cuis)}
                  className={`p-2 rounded-xl text-left border flex items-center justify-between text-[11px] font-medium transition-all ${
                    selectedCuisines.includes(cuis)
                      ? "bg-orange-50 dark:bg-orange-950 border-orange-500 text-orange-700 dark:text-orange-300 font-bold"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{cuis}</span>
                  {selectedCuisines.includes(cuis) && <Check className="w-3 h-3 text-orange-600 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Creating Taste Profile..." : "Create Account & Start Exploring"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="text-orange-600 font-bold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
