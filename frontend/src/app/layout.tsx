"use client";

import React from "react";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { InteractionTrackerProvider } from "../context/InteractionTracker";
import { ToastProvider } from "../context/ToastContext";
import DemoPersonaBar from "../components/DemoPersonaBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AiAssistant from "../components/AiAssistant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>DineWise AI — Intelligent Restaurant Recommendation & Customer Behavior System</title>
        <meta
          name="description"
          content="AI-Based Restaurant Recommendation & Customer Behavior Analysis System for Hyderabad & India"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-orange-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <InteractionTrackerProvider>
                <ToastProvider>
                  {/* High-visibility Live Demo Persona Bar */}
                  <DemoPersonaBar />
                  <Navbar />
                  <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    {children}
                  </main>
                  <Footer />
                  <AiAssistant />
                </ToastProvider>
              </InteractionTrackerProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
