"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Plus, Minus, Trash2, ArrowRight,
  ShieldCheck, Sparkles, Tag, ArrowLeft
} from "lucide-react";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { getSmartCartRecommendations } from "../../lib/api";
import { Product } from "../../types";
import { formatINR } from "../../lib/utils";
import ProductCard from "../../components/ProductCard";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateItemQuantity, removeItemFromCart, cartTotal, addItemToCart } = useCartWishlist();
  const [smartRecommendations, setSmartRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    if (cart.length > 0) {
      const pids = cart.map((i) => i.product_id);
      getSmartCartRecommendations(pids)
        .then((items) => setSmartRecommendations(items || []))
        .catch(() => setSmartRecommendations([]));
    }
  }, [cart]);

  const deliveryFee = cartTotal > 999 || cartTotal === 0 ? 0 : 49;
  const grandTotal = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Looks like you haven't added any items to your shopping cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md"
        >
          <span>Explore Authentic Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-orange-600" />
          <span>Shopping Cart ({cart.reduce((t, i) => t + i.quantity, 0)} Items)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your items and proceed to simulated Indian checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center gap-4"
            >
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-24 h-24 rounded-xl object-cover bg-slate-100 dark:bg-slate-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  {item.product?.brand}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {item.product?.name}
                </h3>
                <p className="text-xs text-slate-500">{item.product?.category}</p>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-2">
                  {formatINR((item.product?.price || 0) * item.quantity)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-xs px-2 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeItemFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Smart Cart Complementary Recommendations */}
          {smartRecommendations.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Smart Cart Suggestions (Frequently Paired Items)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {smartRecommendations.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/40 flex items-center justify-between gap-2"
                  >
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-white" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{prod.name}</p>
                      <p className="text-xs font-bold text-orange-600">{formatINR(prod.price)}</p>
                    </div>
                    <button
                      onClick={() => addItemToCart(prod, 1)}
                      className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-lg"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Indian Order Summary & Simulated Checkout */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Items Subtotal</span>
                <span className="font-semibold">{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Estimated GST</span>
                <span className="font-semibold text-slate-400">Included in MRP</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Pan-India Delivery</span>
                <span className="font-semibold text-emerald-600">
                  {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-700">
                <span>Grand Total</span>
                <span className="text-orange-600 dark:text-orange-400">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Proceed to Simulated Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure Simulated Indian Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
