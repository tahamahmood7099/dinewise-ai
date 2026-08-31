"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "ai_signal" | "success" | "info" | "error";

interface ToastItem {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, description?: string, type?: ToastType) => void;
  showAiSignal: (description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, description?: string, type: ToastType = "info") => {
      const id = "toast_" + Math.random().toString(36).substring(2, 9) + Date.now();
      setToasts((prev) => [...prev, { id, message, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const showAiSignal = useCallback(
    (description: string = "Your recommendations are adapting to your preferences") => {
      showToast("✨ AI Signal Recorded", description, "ai_signal");
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, showAiSignal }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start justify-between gap-3 animate-slideUp transition-all ${
              t.type === "ai_signal"
                ? "bg-slate-900/95 text-white border-orange-500/60 shadow-orange-950/40"
                : t.type === "success"
                ? "bg-emerald-950/95 text-white border-emerald-500/60 shadow-emerald-950/40"
                : t.type === "error"
                ? "bg-rose-950/95 text-white border-rose-500/60 shadow-rose-950/40"
                : "bg-slate-900/95 text-white border-slate-700"
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5 flex-shrink-0">
                {t.type === "ai_signal" && <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />}
                {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {t.type === "info" && <Info className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-snug">{t.message}</p>
                {t.description && (
                  <p className="text-[11px] text-slate-300 font-medium leading-tight mt-0.5">
                    {t.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white transition flex-shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
