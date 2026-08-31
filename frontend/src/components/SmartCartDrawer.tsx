"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X, ShoppingBag, Plus, Minus, Trash2,
  Sparkles, ArrowRight, ShieldCheck, Check
} from "lucide-react";
import { useCartWishlist } from "../context/CartWishlistContext";
import { getSmartCartRecommendations } from "../lib/api";
import { Product } from "../types";
import { formatINR } from "../lib/utils";

export default function SmartCartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateItemQuantity,
    removeItemFromCart,
    addItemToCart,
    cartTotal,
  } = useCartWishlist();

  const [complementaryItems, setComplementaryItems] = useState<Product[]>([]);

  useEffect(() => {
    if (cart.length > 0 && isCartDrawerOpen) {
      const pids = cart.map((i) => i.product_id);
      getSmartCartRecommendations(pids)
        .then((items) => setComplementaryItems(items || []))
        .catch(() => setComplementaryItems([]));
    } else {
      setComplementaryItems([]);
    }
  }, [cart, isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const deliveryFee = cartTotal > 999 || cartTotal === 0 ? 0 : 49;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Your Shopping Cart ({cart.reduce((t, i) => t + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explore our curated Indian catalog and add ethnic wear, sweets, electronics, or groceries!
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/products");
                  }}
                  className="mt-5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70"
                    >
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-16 h-16 rounded-xl object-cover bg-white flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {item.product?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {item.product?.brand}
                        </p>
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-1">
                          {formatINR(item.product?.price || 0)}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItemFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-sm">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SMART CART: Complementary Recommendations */}
                {complementaryItems.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Frequently Paired With Your Cart</span>
                    </div>

                    <div className="space-y-2">
                      {complementaryItems.slice(0, 3).map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/40"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover bg-white flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {prod.name}
                              </p>
                              <p className="text-[11px] font-bold text-orange-600">
                                {formatINR(prod.price)}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => addItemToCart(prod, 1)}
                            className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold rounded-lg transition-colors flex-shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatINR(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Delivery (Pan-India)</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Amount</span>
                  <span className="text-orange-600 dark:text-orange-400">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated UPI & Cash on Delivery Available</span>
              </div>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  router.push("/checkout");
                }}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Simulated Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
