"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, CheckCircle2, QrCode, CreditCard,
  Banknote, Truck, ArrowRight, Lock
} from "lucide-react";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../lib/api";
import { formatINR } from "../../lib/utils";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi NCR", "Gujarat", 
  "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, refreshCartAndWishlist } = useCartWishlist();
  const { user } = useAuth();

  const [shippingName, setShippingName] = useState(user?.name || "Aarav Sharma");
  const [shippingPhone, setShippingPhone] = useState("9876543210");
  const [shippingAddress, setShippingAddress] = useState("Flat 402, Green Glen Heights, Bellandur Outer Ring Road");
  const [shippingCity, setShippingCity] = useState(user?.city || "Bengaluru");
  const [shippingState, setShippingState] = useState("Karnataka");
  const [shippingPincode, setShippingPincode] = useState("560103");
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = cartTotal > 999 || cartTotal === 0 ? 0 : 49;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      }));

      const newOrder = await createOrder({
        items: orderItems,
        payment_method: paymentMethod,
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_pincode: shippingPincode,
        user_id: user?.id,
      });

      await refreshCartAndWishlist();
      router.push(`/orders?placed=${newOrder.order_number}`);
    } catch (err) {
      console.error(err);
      alert("Failed to place simulated order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-emerald-600" />
          <span>Simulated Indian Checkout (₹ INR)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Indian address verification and simulated instant payment (No real money deducted)
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address & Payment Selection */}
        <div className="lg:col-span-8 space-y-6">
          {/* Indian Delivery Address Form */}
          <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <Truck className="w-5 h-5 text-orange-600" />
              <span>1. Delivery Address (India Only)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  10-Digit Mobile Number (with +91) *
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="9876543210"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  House/Flat No., Building & Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  City / District *
                </label>
                <input
                  type="text"
                  required
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  State *
                </label>
                <select
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  6-Digit Indian PIN Code *
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  placeholder="560103"
                  value={shippingPincode}
                  onChange={(e) => setShippingPincode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector (Simulation) */}
          <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <QrCode className="w-5 h-5 text-orange-600" />
              <span>2. Payment Mode (Instant Simulation)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod("UPI")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "UPI"
                    ? "bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">⚡</span>
                  {paymentMethod === "UPI" && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">UPI Simulation</h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">Google Pay / PhonePe / Paytm</p>
              </div>

              <div
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">💵</span>
                  {paymentMethod === "COD" && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Cash on Delivery</h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">Pay in cash upon arrival</p>
              </div>

              <div
                onClick={() => setPaymentMethod("Card")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "Card"
                    ? "bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">💳</span>
                  {paymentMethod === "Card" && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">RuPay / Debit Card</h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">Indian Banking Gateway</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="truncate max-w-[170px]">
                    <span className="font-semibold text-slate-900 dark:text-white">{item.product?.name}</span>
                    <span className="text-slate-400 block text-[11px]">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatINR((item.product?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Pan-India Express Shipping</span>
                <span className="font-bold text-emerald-600">{deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
                <span>Total Due</span>
                <span className="text-orange-600 dark:text-orange-400">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Confirming Order..." : "Confirm & Place Simulated Order"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10.5px] text-slate-400 text-center">
              🔒 By placing this order, you simulate purchase interactions that train the Collaborative Recommendation Engine.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
