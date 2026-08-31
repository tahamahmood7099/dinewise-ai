"use client";

import React, { useState } from "react";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { CartWishlistProvider } from "../context/CartWishlistContext";
import { InteractionTrackerProvider } from "../context/InteractionTracker";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmartSearchModal from "../components/SmartSearchModal";
import SmartCartDrawer from "../components/SmartCartDrawer";
import AiAssistant from "../components/AiAssistant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>BharatKart AI — Intelligent Indian E-Commerce & Recommendation Engine</title>
        <meta name="description" content="AI-Based E-Commerce Recommendation & Customer Behavior Intelligence System for India" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CartWishlistProvider>
              <InteractionTrackerProvider>
                <Navbar onOpenSearchModal={() => setIsSearchModalOpen(true)} />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <SmartSearchModal
                  isOpen={isSearchModalOpen}
                  onClose={() => setIsSearchModalOpen(false)}
                />
                <SmartCartDrawer />
                <AiAssistant />
              </InteractionTrackerProvider>
            </CartWishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
