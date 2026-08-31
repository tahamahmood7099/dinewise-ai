"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { formatINR } from "../../lib/utils";

export default function WishlistPage() {
  const { wishlist, removeItemFromWishlist, moveItemToCart } = useCartWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Save your favorite Indian fashion, electronics, and sweets to track price drops and quick checkout later.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          <span>My Saved Wishlist ({wishlist.length} Items)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your saved items for festive celebrations and everyday shopping
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full pt-[85%] rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-700">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                {item.product?.brand}
              </span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                {item.product?.name}
              </h3>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-2">
                {formatINR(item.product?.price || 0)}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <button
                onClick={() => moveItemToCart(item.id, item.product)}
                className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
              </button>
              <button
                onClick={() => removeItemFromWishlist(item.id)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
