"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, MessageSquare, X, Send, Bot, User,
  ShoppingCart, ArrowRight, CornerDownLeft, RefreshCw
} from "lucide-react";
import { chatWithAssistant } from "../lib/api";
import { Product } from "../types";
import { formatINR } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
}

export default function AiAssistant() {
  const { user } = useAuth();
  const { addItemToCart } = useCartWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-1",
      role: "assistant",
      text: `Namaste ${user?.name ? user.name.split(" ")[0] : "Shopper"}! 🙏 I am your BharatKart AI Shopping Assistant. Tell me what you're looking for, your budget, or festival needs (e.g. "black shoes under ₹2000" or "biryani feast for family").`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsLoading(true);

    try {
      // Build history
      const history = messages.map((m) => ({ role: m.role, content: m.text }));
      const response = await chatWithAssistant(textToSend, history, user?.id);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: response.reply,
        products: response.products,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          text: "I experienced a temporary connection hiccup with our product database. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Shopping Assistant"
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group border-2 border-white/20"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </div>
        <span className="font-bold text-sm hidden md:inline tracking-wide">
          AI Assistant
        </span>
      </button>

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[580px] max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  BharatKart Shopping AI
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-semibold">Grounded</span>
                </h3>
                <p className="text-[11px] text-orange-100">Live Indian Product Recommendations</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-orange-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Grounded Product Recommendations Cards */}
                  {m.products && m.products.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      {m.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover bg-white"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                              {formatINR(prod.price)}
                              {prod.discount > 0 && (
                                <span className="ml-1 text-[10px] text-emerald-600 font-semibold">
                                  ({prod.discount}% off)
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => addItemToCart(prod, 1)}
                            className="p-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex-shrink-0"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center text-xs text-slate-400">
                <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>BharatKart AI is querying product database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              "Black shoes under ₹2000",
              "Festive Banarasi Saree",
              "Hyderabadi Biryani pack",
              "boAt Earbuds with ANC",
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/60 dark:hover:text-orange-300 text-[11px] font-medium text-slate-600 dark:text-slate-300 rounded-full whitespace-nowrap transition-colors border border-slate-200 dark:border-slate-700"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything (e.g. show shoes under 2000)..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-2xl transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
