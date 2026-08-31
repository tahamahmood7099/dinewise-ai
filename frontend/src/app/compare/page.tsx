"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Check, Award, ArrowLeft, Store, MapPin } from "lucide-react";
import { fetchRestaurants } from "../../lib/api";
import { Restaurant } from "../../types";
import { formatINR } from "../../lib/utils";

export default function CompareRestaurantsPage() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants({ limit: 20 })
      .then((res) => {
        setAllRestaurants(res || []);
        if (res && res.length >= 2) {
          setSelectedRestaurants([res[0], res[1]]);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const addSlot = (rest: Restaurant) => {
    if (selectedRestaurants.length < 3 && !selectedRestaurants.some((r) => r.id === rest.id)) {
      setSelectedRestaurants([...selectedRestaurants, rest]);
    }
  };

  const removeSlot = (id: number) => {
    setSelectedRestaurants(selectedRestaurants.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8 pb-16">
      <Link
        href="/restaurants"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Restaurants
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Compare Hyderabad Restaurants
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Compare up to 3 restaurants side-by-side on ratings, price for two, cuisine, specialties, and location
        </p>
      </div>

      {/* Comparison Matrix Table */}
      {selectedRestaurants.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-4 w-1/4 text-slate-400 uppercase text-[10px] font-bold">
                  Attributes
                </th>
                {selectedRestaurants.map((rest) => (
                  <th key={rest.id} className="pb-4 w-1/4">
                    <div className="space-y-2">
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={rest.image}
                          alt={rest.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900 dark:text-white truncate">
                          {rest.name}
                        </span>
                        <button
                          onClick={() => removeSlot(rest.id)}
                          className="text-[10px] text-rose-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr>
                <td className="py-3.5 font-bold text-slate-500">Foodie Rating</td>
                {selectedRestaurants.map((r) => (
                  <td key={r.id} className="py-3.5 font-semibold text-emerald-600">
                    <div className="flex items-center gap-1 font-black text-sm">
                      <span>{r.rating.toFixed(1)}★</span>
                      <span className="text-slate-400 text-[10.5px] font-normal">
                        ({r.review_count}+ reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-500">Price for Two</td>
                {selectedRestaurants.map((r) => (
                  <td key={r.id} className="py-3.5 font-black text-sm text-slate-900 dark:text-white">
                    {formatINR(r.price_for_two)}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">({r.cost_category})</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-500">Primary Cuisine</td>
                {selectedRestaurants.map((r) => (
                  <td key={r.id} className="py-3.5 font-bold text-orange-600">
                    {r.cuisine}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-500">Dietary Type</td>
                {selectedRestaurants.map((r) => (
                  <td key={r.id} className="py-3.5 font-semibold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        r.veg_type === "veg"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : r.veg_type === "non_veg"
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {r.veg_type === "veg" ? "Pure Vegetarian" : r.veg_type === "non_veg" ? "Non-Veg" : "Veg & Non-Veg"}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-500">Location & Area</td>
                {selectedRestaurants.map((r) => (
                  <td key={r.id} className="py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {r.area}
                    <span className="block text-[10.5px] text-slate-400">{r.location}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-500">Signature Specialties</td>
                {selectedRestaurants.map((r) => (
                  <td key={r.id} className="py-3.5 text-slate-600 dark:text-slate-400">
                    {r.specialty_dishes.slice(0, 3).join(", ")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 font-bold text-slate-500">View Page</td>
                {selectedRestaurants.map((r) => (
                  <td key={r.id} className="py-4">
                    <Link
                      href={`/restaurants/${r.id}`}
                      className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow"
                    >
                      View Details →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Select More Restaurants */}
      {selectedRestaurants.length < 3 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Add Another Hyderabad Restaurant to Comparison:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allRestaurants
              .filter((r) => !selectedRestaurants.some((s) => s.id === r.id))
              .slice(0, 4)
              .map((r) => (
                <button
                  key={r.id}
                  onClick={() => addSlot(r)}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 text-left transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {r.name}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
