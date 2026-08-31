"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare, X, Send, Bot, Sparkles, Store, Star,
  MapPin, ArrowRight
} from "lucide-react";
import { sendAssistantMessage } from "../lib/api";
import { AssistantMessage, Restaurant } from "../types";
import { formatINR } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "assistant",
      content:
        "Adaab! I'm your DineWise AI Restaurant Concierge. Looking for a legendary Biryani spot under ₹500, a romantic Italian rooftop in Jubilee Hills, or pure veg dosas in Banjara Hills? Ask me anything!",
      suggestions: [
        "Best biryani under 500 in Tolichowki",
        "Pure veg dosas in Banjara Hills",
        "Fine dining Italian in Jubilee Hills",
        "Historic Irani chai near Charminar"
      ]
    }
  ]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg: AssistantMessage = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await sendAssistantMessage(queryText, historyPayload, user?.id);

      const botMsg: AssistantMessage = {
        role: "assistant",
        content: response.reply,
        restaurants: response.restaurants,
        suggestions: response.suggestions
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Assistant error", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having a brief connection hiccup. Please try asking again!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Open DineWise AI Restaurant Concierge"
      >
        <Bot className="w-6 h-6 animate-bounce" />
        <span className="font-bold text-xs pr-1 hidden sm:inline">
          AI Concierge
        </span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[580px] max-h-[85vh] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm">DineWise AI Concierge</h4>
                <p className="text-[10px] text-orange-100">
                  Grounded in Hyderabad restaurant database
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-none">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-orange-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <p>{m.content}</p>
                </div>

                {/* Grounded Restaurant Cards */}
                {m.restaurants && m.restaurants.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    {m.restaurants.map((rest) => (
                      <Link
                        key={rest.id}
                        href={`/restaurants/${rest.id}`}
                        onClick={() => setIsOpen(false)}
                        className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-2 hover:border-orange-500 transition block group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                            <Image
                              src={rest.image}
                              alt={rest.name}
                              fill
                              className="object-cover group-hover:scale-105 transition"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {rest.name}
                            </p>
                            <p className="text-[10.5px] text-slate-500 truncate">
                              {rest.cuisine} • {rest.area} • {formatINR(rest.price_for_two)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] flex-shrink-0">
                          <span>{rest.rating.toFixed(1)}★</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Quick Suggestion Chips */}
                {m.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.suggestions.map((sug) => (
                      <button
                        key={sug}
                        onClick={() => handleSend(sug)}
                        className="px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-[10.5px] font-semibold text-orange-700 dark:text-orange-300 hover:bg-orange-100 transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 p-2">
                <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
                <span>Thinking & querying Hyderabad restaurants...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for recommendations..."
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-orange-600 text-white disabled:opacity-50 hover:bg-orange-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
