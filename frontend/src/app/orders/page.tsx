"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PackageCheck, CheckCircle2, Truck, Calendar,
  CreditCard, MapPin, ArrowRight
} from "lucide-react";
import { getOrders } from "../../lib/api";
import { Order } from "../../types";
import { formatINR } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

function OrdersContent() {
  const searchParams = useSearchParams();
  const placedNumber = searchParams.get("placed");
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders(user?.id)
      .then((data) => setOrders(data || []))
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Placed Order Success Banner */}
      {placedNumber && (
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-md flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-100">
              Order Placed Successfully!
            </h2>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
              Order Reference: <strong className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded text-emerald-600 font-bold">{placedNumber}</strong>
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
              ✨ Purchase interactions recorded in database. The Collaborative Recommendation Engine has automatically updated its matrix!
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm"
          >
            Check Admin Logs →
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <PackageCheck className="w-7 h-7 text-orange-600" />
            <span>My Orders ({orders.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track deliveries across India and view itemized invoices
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
        >
          Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Experience our simulated checkout to test order processing and collaborative recommendation updates.
          </p>
          <Link
            href="/products"
            className="inline-block mt-3 px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
            >
              {/* Order Card Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">ORDER NUMBER</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{order.order_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">ORDER DATE</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">TOTAL AMOUNT</span>
                    <span className="font-black text-slate-900 dark:text-white">{formatINR(order.total_amount)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-bold text-[11px] flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                    <Truck className="w-3 h-3" />
                    {order.order_status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 space-y-4">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.product_name} className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{item.product_name}</p>
                          <p className="text-slate-500">Qty: {item.quantity} • Unit Price: {formatINR(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Information Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    <span>Delivered to: <strong>{order.shipping_name}</strong>, {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mode: <strong>{order.payment_method}</strong> ({order.payment_status})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto p-8 text-center text-slate-400">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
