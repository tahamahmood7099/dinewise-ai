import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Cpu, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      {/* Indian Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Authentic</h4>
              <p className="text-xs text-slate-400">Direct from Indian artisans & verified brands</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Pan-India Express</h4>
              <p className="text-xs text-slate-400">Coverage across 19,000+ PIN codes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Easy Returns</h4>
              <p className="text-xs text-slate-400">7-Day hassle-free doorstep pickup</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Explainable AI</h4>
              <p className="text-xs text-slate-400">TF-IDF & Collaborative Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
              भ
            </div>
            <span className="text-lg font-bold text-white">BharatKart AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
            Next-Generation AI-Powered E-Commerce Platform engineered specifically for Indian consumers. 
            Powered by real-time TF-IDF semantic embeddings, User-Item collaborative filtering, and lightweight natural language search.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Payment Modes:</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[11px] font-semibold text-slate-300">UPI (GPay / PhonePe / Paytm)</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[11px] font-semibold text-slate-300">Cash on Delivery</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Categories</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/products?category=Ethnic%20%26%20Fashion" className="hover:text-orange-400">Ethnic Wear & Kurtas</Link></li>
            <li><Link href="/products?category=Electronics%20%26%20Audio" className="hover:text-orange-400">Wireless Earbuds & Audio</Link></li>
            <li><Link href="/products?category=Indian%20Delicacies%20%26%20Sweets" className="hover:text-orange-400">Biryani & Desi Sweets</Link></li>
            <li><Link href="/products?category=Footwear" className="hover:text-orange-400">Sports Shoes & Mojaris</Link></li>
            <li><Link href="/products?category=Beauty%20%26%20Ayurveda" className="hover:text-orange-400">Ayurvedic Skincare</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">AI Intelligence</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/admin" className="hover:text-orange-400">Admin Intelligence Portal</Link></li>
            <li><Link href="/compare" className="hover:text-orange-400">Product Comparison</Link></li>
            <li><span className="hover:text-orange-400 cursor-pointer">TF-IDF Vector Space</span></li>
            <li><span className="hover:text-orange-400 cursor-pointer">Collaborative Matrix</span></li>
            <li><span className="hover:text-orange-400 cursor-pointer">Precision@K Benchmarks</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Customer Support</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/orders" className="hover:text-orange-400">Track Order</Link></li>
            <li><Link href="/wishlist" className="hover:text-orange-400">Saved Wishlist</Link></li>
            <li><span>24x7 India Support</span></li>
            <li><span>help@bharatkart.in</span></li>
            <li><span>Toll Free: 1800-BHARAT-AI</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 BharatKart AI — Major Project. Designed & Built for India.</p>
        <p className="flex items-center gap-1">
          Made with <HeartHandshake className="w-3.5 h-3.5 text-orange-500" /> for Indian CSE Engineering Excellence
        </p>
      </div>
    </footer>
  );
}
