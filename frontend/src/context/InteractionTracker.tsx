"use client";

import React, { createContext, useContext, useCallback } from "react";
import { logInteraction, submitFeedback } from "../lib/api";
import { useAuth } from "./AuthContext";

interface InteractionTrackerContextType {
  trackView: (productId: number, metadata?: Record<string, any>) => void;
  trackClick: (productId: number, metadata?: Record<string, any>) => void;
  trackFeedback: (productId: number, type: "like" | "dislike", source?: string) => Promise<void>;
}

const InteractionTrackerContext = createContext<InteractionTrackerContextType | undefined>(undefined);

export const InteractionTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const trackView = useCallback(
    (productId: number, metadata?: Record<string, any>) => {
      logInteraction(productId, "view", user?.id, metadata);
    },
    [user?.id]
  );

  const trackClick = useCallback(
    (productId: number, metadata?: Record<string, any>) => {
      logInteraction(productId, "click", user?.id, metadata);
    },
    [user?.id]
  );

  const trackFeedback = useCallback(
    async (productId: number, type: "like" | "dislike", source: string = "hybrid") => {
      await submitFeedback(productId, type, user?.id, source);
    },
    [user?.id]
  );

  return (
    <InteractionTrackerContext.Provider value={{ trackView, trackClick, trackFeedback }}>
      {children}
    </InteractionTrackerContext.Provider>
  );
};

export const useInteractionTracker = () => {
  const context = useContext(InteractionTrackerContext);
  if (!context) throw new Error("useInteractionTracker must be used within InteractionTrackerProvider");
  return context;
};
