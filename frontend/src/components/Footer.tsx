"use client";

import React from "react";
import Link from "next/link";
import { UtensilsCrossed, ShieldCheck, Sparkles, MapPin, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Dine<span className="text-orange-500">Wise</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Based Restaurant Recommendation & Customer Behavior Analysis System. Tailored for authentic Hyderabad food discovery.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hyderabad, Telangana, India</span>
            </div>
          </div>

          {/* Prime Hyderabad Dining Zones */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Hyderabad Dining Zones
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link href="/restaurants?area=Banjara%20Hills" className="hover:text-orange-400 transition">Banjara Hills & Road No 3</Link></li>
              <li><Link href="/restaurants?area=Jubilee%20Hills" className="hover:text-orange-400 transition">Jubilee Hills Fine Dining</Link></li>
              <li><Link href="/restaurants?area=Madhapur" className="hover:text-orange-400 transition">Madhapur & Hitech City</Link></li>
              <li><Link href="/restaurants?area=Gachibowli" className="hover:text-orange-400 transition">Gachibowli Tech Corridor</Link></li>
              <li><Link href="/restaurants?area=Charminar" className="hover:text-orange-400 transition">Old City & Charminar</Link></li>
            </ul>
          </div>

          {/* AI Architecture & Formula */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Recommendation Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>TF-IDF & Cosine Content Similarity</li>
              <li>User-Restaurant Interaction Matrix</li>
              <li>Hybrid Formula: α·Content + β·Collab (α=0.6, β=0.4)</li>
              <li>Explainable AI (XAI) Grounded Rationale</li>
              <li>Customer Behavioral Clustering</li>
            </ul>
          </div>

          {/* Major Project Viva Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Academic Project Info
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Final Year CSE Major Project • Osmania University / NSAKCET • Evaluated using Precision@K, Recall@K, F1-Score, and NDCG@K.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:underline pt-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Open Analytics & Telemetry Portal →
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DineWise AI • Intelligent Restaurant Recommendation System.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Real Database Grounding • Zero Fake Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
